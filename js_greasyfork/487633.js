// ==UserScript==
// @name         NodeSeek 用户自定义标签
// @namespace    https://www.nodeseek.com/
// @version      0.0.1
// @description  为 NodeSeek 用户添加自定义标签
// @author       Dabo
// @match        *://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        GM_xmlhttpRequest
// @license      MPL-2.0 License
// @supportURL   https://www.nodeseek.com/post-?-1
// @homepageURL  https://www.nodeseek.com/post-?-1
// @downloadURL https://update.greasyfork.org/scripts/487633/NodeSeek%20%E7%94%A8%E6%88%B7%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/487633/NodeSeek%20%E7%94%A8%E6%88%B7%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

/**
 *
 *
 * 当前版本更新日志
 * 0.0.1 - 2024.02.18
 * - 自定义用户标签
 */

(function() {
    'use strict';
    const userName = 'nowayhost'; // 用户名 这里改成自己的用户名
    const tag = '水王'; // 标签 这里改成自定义的标签名称

    const elements = document.getElementsByClassName('author-name');
    for (const element of elements) {
        const text = element.textContent;
        if (text == userName) {
            element.insertAdjacentHTML('afterend', '<span class="nsk-badge role-tag role-active"><!----><span>'+tag+'</span></span> ');
        }
    }
}
)();