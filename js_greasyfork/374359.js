// ==UserScript==
// @name         百度网盘一键解压缩
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  百度网盘当前目录压缩文件一键解压
// @match        https://pan.baidu.com/*
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374359/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E8%A7%A3%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/374359/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E8%A7%A3%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btnToolHTML = '<a class="g-button" href="javascript:;" title="批量解压" style="display: inline-block;"><span class="g-button-right"><em class="icon icon-remark-remove" title="批量重命名"></em><span class="text" style="width: auto;">批量解压</span></span></a>';

    $(btnToolHTML).appendTo('.tcuLAu').click(function() {
        unZip();
        return false;
    });

    let baidu_tips = require('system-core:system/uiService/tip/tip.js');

    let folders = $.grep($('.file-name .text a'), function(element, index) {
        return !/\.\w{2,4}$/ig.test($(element).text());
    }).map(function(item, index) {
        return $(item).text();
    });

    async function unZip() {
        let password = prompt('请输入解压密码，没有密码为空即可', '');
        //  增加prompt判断
        if(password == null) return;
        let path = $('.FuIxtL li[node-type] span:last');
        path = path.attr('title').replace('全部文件', '') + '/';

        // let unzipFiles = $.grep($('.file-name .text a'), function(element, index) {
        //     return /\.(zip|rar)/ig.test($(element).text());
        // }).map(function(element,index){
        // 	return $(element).replace(/\.(zip|rar)/ig, '');
        // });
        //
        // let zipedPath = $.grep($('.file-name .text a'), function(element, index) {
        //     return /^((?!\.rar|\.zip$).)*$/ig.test($(element).text());
        // });
        //
        // unzipFiles = unzipFiles.filter(key => !zipedPath.includes(key));

        let options = $.grep($('.file-name .text a'), function(element, index) {
            return /\.(zip|rar)$/ig.test($(element).text()) && !folders.includes($(element).text().replace(/\.(zip|rar)$/ig, ''));
        }).map(function(element, index) {
            let option = {
                path: path + $(element).text(),
                //  subpath: JSON.stringify(['/' + $(element).text().replace(/\.(zip|rar)$/ig, '')]),
                subpath:[],
                topath: path,
                type: 'unzip',
                channel: 'chunlei',
                web: 1,
                app_id: '250528',
                clienttype: 0,
                bdstoken: window.locals.get('bdstoken')
            };
            return password == '' ? option : $.extend(option, {
                passwd: password
            });
        });


        for (let i = 0; i < options.length; i++) {
            // window.yunHeader.tools.ui.tip.show({
            //     msg: `正在解压第${i}个文件，共${options.length}个文件`,
            //     type: 'success'
            // });
            baidu_tips.show({
                mode: "loading",
                msg: `正在解压第${i+1}个文件，共${options.length}个文件`,
                autoClose: !1
            });
            await ajaxUnZip(options[i]);
        }
        window.yunHeader.tools.ui.tip.show({
            msg: `全部解压命令发送完成，正在刷新页面……`,
            type: 'success'
        });

        setTimeout(function() {
            location.reload(true);
        }, 4000);
    }

    function ajaxUnZip(options) {
        return new Promise((resolve, reject) => {
            $.ajax('https://pan.baidu.com/api/zipfile/copy', {
                data: options,
                type: 'GET',
                complete: function() {
                    setTimeout(function() {
                        resolve(true);
                    }, 2000);
                }
            });
        });
    }

})();
