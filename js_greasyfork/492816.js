// ==UserScript==
// @name         去除bilibili看视频时的直播推荐窗口
// @namespace    http://tampermonkey.net/
// @version      2024-04-18
// @description  去除bilibili看视频界面时的直播推荐窗口
// @author       ningyuan
// @match        *://www.bilibili.com/video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492816/%E5%8E%BB%E9%99%A4bilibili%E7%9C%8B%E8%A7%86%E9%A2%91%E6%97%B6%E7%9A%84%E7%9B%B4%E6%92%AD%E6%8E%A8%E8%8D%90%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/492816/%E5%8E%BB%E9%99%A4bilibili%E7%9C%8B%E8%A7%86%E9%A2%91%E6%97%B6%E7%9A%84%E7%9B%B4%E6%92%AD%E6%8E%A8%E8%8D%90%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';
    new MutationObserver((mutationList) => {
    let list = document.querySelectorAll('.pop-live-small-mode');
        for (let i = 0; i < list.length; i++) {
            if (list[i].firstElementChild.innerText == "大家围观的直播")
            {
                list[i].parentNode.removeChild(list[i]);
                break;
            }
        }
    }).observe(document.querySelector('body'), {
        childList: true,
        attributes: true,
        subtree: true,
    });
})();