// ==UserScript==
// @name         飞书开放平台 · 技术支持辅助工具
// @namespace    https://open.feishu.cn
// @version      0.0.3
// @description  查看作者链接
// @author       bestony
// @match        https://open.feishu.cn/document/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/lark/passport/staticfiles/passport/Open-Platform.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455105/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%20%C2%B7%20%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455105/%E9%A3%9E%E4%B9%A6%E5%BC%80%E6%94%BE%E5%B9%B3%E5%8F%B0%20%C2%B7%20%E6%8A%80%E6%9C%AF%E6%94%AF%E6%8C%81%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function() {
        setTimeout(function(e){

            var docInfo = document.getElementsByClassName("doc-content-info")
            if(docInfo.length ==0) {
                console.log("can't find element");
                return;
            };

            docInfo[0].innerHTML =  docInfo[0].innerHTML + ` &nbsp;<a id="view-author">查看作者</a>`

            function viewAuthor(){
                var pathName = window.location.pathname;
                var newPath = pathName.replace("/document","https://lark-oapi-tools-console.bytedance.net/document-mod/index?fullPath=");
                window.open(newPath, '_blank').focus();
            }

            var link = document.getElementById("view-author");
            if(link){
                link.addEventListener ("click", viewAuthor , false);
            }
        },1000)

    }, false);
})();