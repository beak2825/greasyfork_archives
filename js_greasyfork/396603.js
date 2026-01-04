// ==UserScript==
// @name         百度网盘批量解压缩
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  百度网盘当前目录压缩文件一键解压
// @match        https://pan.baidu.com/*
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396603/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%A7%A3%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/396603/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%89%B9%E9%87%8F%E8%A7%A3%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let btnToolHTML = '<a class="g-button" href="javascript:;" title="批量解压" style="display: inline-block;"><span class="g-button-right"><em class="icon icon-remark-remove" title="批量重命名"></em><span class="text" style="width: auto;">批量解压</span></span></a>';

    $(btnToolHTML).appendTo('.tcuLAu').click(function () {
        unZip();
        return false;
    });
    let baidu_tips = require('system-core:system/uiService/tip/tip.js');
    let allList = $.grep($('.file-name .text a'), function (element, index) {
        return $(element).text();
    }).map(function (item, index) {
        return $(item).text();
    });//获取当前目录所有文件列表
    let folders = $.grep($('.file-name .text a'), function (element, index) {
        return !/\.\w{2,4}$/ig.test($(element).text());
    }).map(function (item, index) {
        return $(item).text();
    });//获取当前目录文件夹列表
    let vip_status = [];

    async function unZip() {
        let url_list = 'https://pan.baidu.com/api/zipfile/list';
        let url_copy = 'https://pan.baidu.com/api/zipfile/copy';
        let url_task = 'https://pan.baidu.com/api/taskquery';
        let url_delete = 'https://pan.baidu.com/api/filemanager?';
        let password = prompt('请输入解压密码，没有密码为空即可', '');
        let path = $('.FuIxtL li[node-type] span:last');
        path = path.attr('title').replace('全部文件', '') + '/';

        let filelist = $.grep($('.file-name .text a'), function (element, index) {
            return /\.(zip|rar)$/ig.test($(element).text()) && !folders.includes($(element).text().replace(/\.(zip|rar)$/ig,
                                                                                                           ''));
        });//获取当前文件夹压缩文件列表，排除同名文件夹

        for (var i = 0; i < filelist.length; i++) {
            var data_copy = [];
            let optiona = {
                path: path + filelist[i].text,
                start: 0,
                limit: 100,
                passwd: password,
                subpath: '/',
                channel: 'chunlei',
                web: 1,
                bdstoken: window.locals.get('bdstoken'),
                app_id: 250528,
                clienttype: 0,
            };


            let file_name = [];
            let status = [];
            let responsedata = [];


            await ajax('GET', url_list, optiona).then(data => {
                responsedata = data;
            });//获取压缩文件文件列表
            if (responsedata['errno'] == 0) {
                if (responsedata['list']){
                    $.each(responsedata['list'], function (index, element) {
                        file_name.push(element.file_name)
                    });
                } else {
                    status.push(0)
                    continue;
                }
            } else if (responsedata['errno'] == 120){
                console.log('errno:' + responsedata['errno'] + '普通会员支持2G以内压缩包，超级会员支持8G以内压缩包')
                status.push(0)
                vip_status.push(0)
                window.yunHeader.tools.ui.tip.show({
                    msg: `普通会员支持2G以内压缩包，超级会员支持8G以内压缩包`,
                    type: 'erro'
                });
                break;
            } else{
                console.log('errno' + responsedata['errno'] + '未知错误')
                status.push(0)
                continue;
            }
            let file_list = $.grep(file_name, function (element, index) {
                return element && !allList.includes(element)
            });//排除已存在的文件


            for (var x = 0; x < file_list.length; x++) {
                let taskidno;
                let optionb = {
                    path: path + filelist[i].text,
                    subpath: '[' + JSON.stringify('/' + file_list[x]) + ']',
                    topath: path,
                    type: 'unzip',
                    channel: 'chunlei',
                    web: 1,
                    app_id: '250528',
                    clienttype: 0,
                    passwd: password,
                    bdstoken: window.locals.get('bdstoken')
                };
                baidu_tips.show({
                    mode: "loading",
                    msg: `正在解压第${i + 1}个压缩包中的第${x + 1}个文件，共${filelist.length}个压缩文件`,
                    autoClose: !1
                });

                await ajax('GET', url_copy, optionb).then(data => {
                    if (data['errno'] == 0) {
                        taskidno = data['taskid']
                    } else {
                        console.log('errno' + data['errno'])


                    }

                });//发送解压命令
                let optionc = {
                    channel: 'chunlei',
                    taskid: taskidno,
                    web: 1,
                    app_id: '250528',
                    clienttype: 0,
                    bdstoken: window.locals.get('bdstoken')
                };


                for (var y = 0; y < 5; y++) {
                    let response = [];
                    await ajax('GET', url_task, optionc).then(data => {
                        response = data;
                    });//判断文件是否解压成功
                    if (response['errno'] !== 0) {
                        status.push(0)
                        console.log('解压' + filelist[i].text + '/' + file_list[x] + '失败')
                        break;
                    } else if (response['status'] == 'failed') {
                        status.push(0)
                        console.log('解压' + filelist[i].text + '/' + file_list[x] + '失败')
                        break;
                    } else if (response['status'] == 'success') {
                        break;
                    } else if (y == 2) {
                        status.push(0)
                        console.log('解压' + filelist[i].text + '/' + file_list[x] + '超时')
                        break;
                    }


                }


            }
            if (status.length == 0) {
                let optiond = {
                    channel: 'chunlei',
                    web: 1,
                    bdstoken: window.locals.get('bdstoken'),
                    app_id: '250528',
                    clienttype: 0,
                    opera: 'delete',
                    async: 2,
                    onnest: 'fail'

                };
                let postdata = {
                    filelist: '[' + JSON.stringify(path + filelist[i].text) + ']'

                };
                let url = url_delete + $.param(optiond);
                await ajax('POST', url, postdata)//删除已解压文件
            }


        }
        if (vip_status.length == 0){
            window.yunHeader.tools.ui.tip.show({
                msg: `全部解压命令发送完成，正在刷新页面……`,
                type: 'success'
            });
            setTimeout(function () {
                location.reload(true);
            }, 4000);
        }        


    }


    function ajax(method, url, option) {
        return new Promise((resolve, reject) => {
            $.ajax(url, {
                data: option,
                type: method,
                datatype: "json",
                success: function (data) {
                    setTimeout(function () {
                        resolve(data);
                    }, 2000);
                }
            });
        });
    }
    // Your code here...
})();