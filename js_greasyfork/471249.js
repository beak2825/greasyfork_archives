// ==UserScript==
// @name         清除常用网站的登录和禁止复制
// @namespace    https://www.qingheluo.com
// @version      0.3.1
// @description  清除常用网站如知乎、CSDN等烦人的的登录和禁止复制
// @author       三千
// @license      MIT
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.360doc.com/*
// @match        *://wenku.baidu.com/*
// @match        *://www.php.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471249/%E6%B8%85%E9%99%A4%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E7%9A%84%E7%99%BB%E5%BD%95%E5%92%8C%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/471249/%E6%B8%85%E9%99%A4%E5%B8%B8%E7%94%A8%E7%BD%91%E7%AB%99%E7%9A%84%E7%99%BB%E5%BD%95%E5%92%8C%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (location.href.includes("zhihu.com")) {
        setInterval(() => {
            if (document.querySelector('button[aria-label="关闭"]')) {
                document.querySelector('button[aria-label="关闭"]').click();
            }
        }, 500);
    }
    if (location.href.includes("csdn.net")) {
        if (location.href.indexOf('http')==0){
            location.href = 'read:'+location.href;
        }
        setInterval(() => {
            if (document.querySelector(".passport-login-container")) {
                document.querySelector(".passport-login-container").style =
                    "display:none";
            }
            if (document.querySelector("#articleSearchTip")) {
                document.querySelector("#articleSearchTip").style =
                    "display:none";
            }
            if (
                document.querySelectorAll('div[data-title="登录后复制"]')
                    .length > 0
            ) {
                for (let emement of document.querySelectorAll(
                    'div[data-title="登录后复制"]'
                )) {
                    emement.style = "display:none";
                }
            }
            if (document.querySelectorAll("code").length > 0) {
                let all_pre = document.querySelectorAll("pre");
                for (let pre of all_pre) {
                    pre.style =
                        "-webkit-touch-callout: auto;-webkit-user-select: auto;-khtml-user-select: auto;-moz-user-select: auto;-ms-user-select: auto;user-select: auto;";
                    pre.querySelector("code").style =
                        "-webkit-touch-callout: auto;-webkit-user-select: auto;-khtml-user-select: auto;-moz-user-select: auto;-ms-user-select: auto;user-select: auto;";
                }
            }
        }, 500);
    }
    if (location.href.includes("360doc.com")) {
        setInterval(() => {
            if (document.querySelector('.logcontent .logcloser')) {
                document.querySelector('.logcontent .logcloser').click();
            }
            if (document.querySelector('.bevip__ .closer')) {
                document.querySelector('.bevip__ .closer').click();
            }
        }, 500);
    }
    if (location.href.includes("wenku.baidu.com")) {
        setInterval(() => {
            if (document.querySelector('.retain-dialog .close-btn')) {
                document.querySelector('.retain-dialog .close-btn').click();
            }
        }, 500);
    }
    if (location.href.includes("www.php.cn")) {
        setInterval(() => {
            if (document.querySelector('.layui-layer-setwin a')) {
                document.querySelector('.layui-layer-setwin a').click();
            }
            if (document.querySelector('.phpGuanbi')) {
                document.querySelector('.phpGuanbi').click();
            }
        }, 500);
    }

})();