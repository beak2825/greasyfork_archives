// ==UserScript==
// @name         去你大爷的小黄脸
// @namespace    1337
// @version      0.2
// @description  把哔哩哔哩小黄脸表情替换成文字
// @author       955winxpqq
// @match        https://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/467006/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E5%B0%8F%E9%BB%84%E8%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/467006/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E5%B0%8F%E9%BB%84%E8%84%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playingInterval = setInterval(function () {
        document.querySelectorAll('.opus-text-rich-emoji,.bili-rich-text-emoji,.emoji-small').forEach(function(element) {
            var name = element.alt;
            if(!name.includes("_")) {
                element.outerHTML = "<a style=\"color:#FF0000\";>" + name + "</a>";
            }
        });
    })
})();