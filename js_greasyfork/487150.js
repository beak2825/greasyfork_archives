// ==UserScript==
// @name         视频简介与专栏自动转链接
// @namespace    https://github.com/IcedDog
// @version      0.0.1
// @description  把B站视频简介或者专栏中的链接自动转成可点击的链接
// @author       IcedDog
// @match        https://*.bilibili.com/read/*
// @match        https://*.bilibili.com/video/*
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/487150/%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E4%B8%8E%E4%B8%93%E6%A0%8F%E8%87%AA%E5%8A%A8%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487150/%E8%A7%86%E9%A2%91%E7%AE%80%E4%BB%8B%E4%B8%8E%E4%B8%93%E6%A0%8F%E8%87%AA%E5%8A%A8%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const linkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const ClassName_VideoDesc = "desc-info-text";
    const ClassName_VideoPlayer = "bpx-player-ctrl-btn-icon";
    const ClassName_ArticleContent = "read-article-holder";
    const ClassName_ArticleApp = "article-content";
    const delay1 = 500;
    const delay2 = 1000;

    var setLinks = setInterval(function(){
        if(document.getElementsByClassName(ClassName_VideoPlayer) != null){
            window.setTimeout(replaceVideo, delay2);
            clearInterval(setLinks);
        }
        if(document.getElementsByClassName(ClassName_ArticleApp) != null){
            window.setTimeout(replaceArticle, delay2);
            clearInterval(setLinks);
        }
    }, delay1);

    function replaceVideo() {
        var elementVideoDesc = document.getElementsByClassName(ClassName_VideoDesc);
        for (var i = 0; i < elementVideoDesc.length; i++) {
            var html = elementVideoDesc[i].innerHTML;
            if (linkRegex.test(html)) {
                html = html.replace(linkRegex, function(url) {return '<a target="_blank" href="' + url + '">' + url + '</a>';});
                elementVideoDesc[i].innerHTML = html;
            }
        }
    }

    function replaceArticle() {
        var elementArticleContent = document.getElementsByClassName(ClassName_ArticleApp)[0];
        for (var i = 0; i < elementArticleContent.childNodes.length; i++) {
            var html = elementArticleContent.childNodes[i];
            if (linkRegex.test(html.innerHTML) && html.nodeType==1) {
                html.innerHTML = html.innerHTML.replace(linkRegex, function(url) {return '<a target="_blank" href="' + url + '">' + url + '</a>';});
            }
        }
    }
})();

// Original: https://greasyfork.org/zh-CN/scripts/486696-%E6%8A%A2%E6%95%91%E6%9C%AC%E5%AE%B6%E7%9B%B4%E9%93%BE