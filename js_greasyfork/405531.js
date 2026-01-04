// ==UserScript==
// @name         北师大云盘下载器
// @namespace    https://zhangnew.com/
// @version      0.2
// @description  解除下载限制，通过调用预览接口，清晰度稍有下降。(点击下载之后稍等一会儿，会在下载完成之后弹出保存)
// @author       zhangnew
// @homepage     https://zhangnew.com/
// @match        https://pan.bnu.edu.cn/link/view/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download

// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource toastr_css https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @downloadURL https://update.greasyfork.org/scripts/405531/%E5%8C%97%E5%B8%88%E5%A4%A7%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/405531/%E5%8C%97%E5%B8%88%E5%A4%A7%E4%BA%91%E7%9B%98%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('toastr_css'));
toastr.options.timeOut = 5000;

(function() {
    'use strict';
    const uuid = window.location.pathname.split("/")[3];

    function getMetaData(path){
        // 获取所有视频信息
        let meta_url = "https://pan.bnu.edu.cn/v2/delivery/metadata/" + uuid + '/' + path;
        let $list = $('.display-name');

        let response = GM_xmlhttpRequest({
            method: "GET",
            url: meta_url,
            onload: function(response) {
                let meta = JSON.parse(response.responseText);
                console.log('当前目录：' + meta.path);

                var cnt_dir = 0;
                var cnt_mp4 = 0;
                $list.each(function(e){
                    let item_title = this.text;
                    var is_dir = false;
                    meta.content.forEach(item => {
                        let p = item.path.split('/');
                        // 取路径中的最后一个
                        if(p[p.length-1] === item_title){
                            is_dir = item.is_dir;p[p.length-1]
                        }
                    });
                    if(is_dir){
                        cnt_dir += 1;
                    } else if (item_title.endsWith('mp4')){
                        cnt_mp4 += 1;
                    }
                });

                toastr.success('发现' + $list.length + '条数据,' + cnt_dir + '个目录,' + cnt_mp4 + '条视频', getTitle());

                let $ico_d = $('.cmd-download');
                $ico_d.show();
                $ico_d.toggleClass('cmd-download cmd-download-unbind'); // 取消原来的下载功能

                let $btn_d = $('.i-download');
                $btn_d.click(function(event) {
                    // 视频标题
                    var item_title = event.target.parentNode.parentNode.parentElement.getElementsByClassName('display-name')[0].text
                    meta.content.forEach(item => {
                        let p = item.path.split('/');
                        if(p[p.length-1] === item_title){
                            if(item.is_dir){
                                toastr.error('禁止下载目录：' + item_title);
                                return
                            };
                            console.log("click " + item.path);
                            GM_download(item.preview_url, item_title);
                            toastr.success('开始下载，请稍候~', item_title);
                        }
                    });
                });
            }
        });
    };

    function getTitle(){
        return document.getElementById('listHeader').getElementsByClassName('fold-name')[0].textContent
    };


    function isTopDir(){
        let dom_title = document.getElementById('listHeader').getElementsByClassName('fold-name')[0];
        return dom_title.textContent === dom_title.title;
    };

    function addMonitor(){
        // 选择需要观察变动的节点: 文件列表
        let targetNode = document.getElementById('listBody').getElementsByClassName('list-wraper')[0];
        // 观察器的配置（需要观察什么变动）
        let config = { attributes: true, childList: true, subtree: false, characterData: true };
        // 当观察到变动时执行的回调函数
        let callback = function(mutations) {
            // 这里只需要获取第一个变化，否则会重复
            if (mutations[0].type == 'childList') {
                let text = getTitle();
                //console.log('切换目录：' + text);
                if(isTopDir()){
                    getMetaData('');
                }else{
                    getMetaData(text);
                }
            }
        };
        // 创建一个观察器实例并传入回调函数
        let observer = new MutationObserver(callback);
        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
    };


    setTimeout( function loading() {
        let $list = $('.display-name');
        if ($list.length > 0){
            console.log("origin pan data loaded.");
            if($('.cmd-download').is(':visible')){
                return;
            }
            addMonitor();
            getMetaData('');
        } else {
            // wait a moment and check again
            console.log('wait for data.');
            setTimeout( loading , 500);
        }
    } , 500);
})();