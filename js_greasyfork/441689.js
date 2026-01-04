// ==UserScript==
// @name         TianchiNotebook
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  天池Notebook界面优化。
// @author       You
// @match        https://tianchi.aliyun.com/ailab/notebook-ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441689/TianchiNotebook.user.js
// @updateURL https://update.greasyfork.org/scripts/441689/TianchiNotebook.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function () {
        var iframe = document.getElementsByClassName('detail-html')[0];
        if (iframe) {
            var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
            if (iframeWin.document.body) {
                var arr = iframeWin.document.getElementsByClassName('p-Widget');
                setTimeout(function () {
                    iframe.style.height = (arr[arr.length - 1].getBoundingClientRect().top) + 200 + 'px';
                }, 1000);
            }
        }

        document.body.insertAdjacentHTML('beforeBegin','<style>\n' +
                                         '    .GTGoToTop{\n' +
                                         '        cursor: pointer;\n' +
                                         '        position: fixed;\n' +
                                         '        right: 50px;\n' +
                                         '        bottom: 50px;\n' +
                                         '        width: 50px;\n' +
                                         '        height: 50px;\n' +
                                         '        color: #fff;\n' +
                                         '        background: #ff8929;\n' +
                                         '        box-shadow: 5px 2px 5px #ffe4d1;\n' +
                                         '        line-height: 15px;\n' +
                                         '        padding: 10px;\n' +
                                         '    }\n' +
                                         '    .ailab-common-breadcrumb{\n' +
                                         '        display: none !important;\n' +
                                         '    }\n' +
                                         '    .ant-layout-header{\n' +
                                         '        display: none !important;\n' +
                                         '    }\n' +
                                         '    .ailab-notebook{\n' +
                                         '        height: unset;\n' +
                                         '    }\n' +
                                         '    .mynotebook-btn-container{\n' +
                                         '        padding: 16px 13px 22px;\n' +
                                         '        border-top: none;\n' +
                                         '        position: fixed;\n' +
                                         '        bottom: 0;\n' +
                                         '        left: 0;\n' +
                                         '        width: 295px !important;\n' +
                                         '        background: #fff;\n' +
                                         '    }\n' +
                                         '    .right-content-wrap{\n' +
                                         '        height: unset;\n' +
                                         '    }\n' +
                                         '</style>');

        document.body.insertAdjacentHTML('beforeEnd','<span class="GTGoToTop" onclick="window.scrollTo(0,0)">回到顶部</span>');

        var list_height = document.getElementsByClassName('left-menu')[0].offsetHeight;
        var btn_line_body = document.getElementsByClassName('mynotebook-btn-container')[0];
        var list_body = document.getElementsByClassName('list-container')[0];
        btn_line_body.style.position = "fixed";
        window.onscroll = function () {
            //为了保证兼容性，这里取两个值，哪个有值取哪一个
            //scrollTop就是触发滚轮事件时滚轮的高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop + document.body.offsetHeight >= list_height){
                btn_line_body.style.position = "relative";
                list_body.style.marginBottom = "0";
            }else{
                btn_line_body.style.position = "fixed";
                list_body.style.marginBottom = "70px";
            }
        };
    };
        // Your code here...
})();