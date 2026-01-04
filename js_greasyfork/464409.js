// ==UserScript==
// @name         关闭B站顶部受插件影响提示
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  自动关闭bilibili顶部“检测到您的页面展示可能受到浏览器插件影响，建议您将当前页面加入插件白名单，以保障您的浏览体验～”提示。
// @author       chen
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464409/%E5%85%B3%E9%97%ADB%E7%AB%99%E9%A1%B6%E9%83%A8%E5%8F%97%E6%8F%92%E4%BB%B6%E5%BD%B1%E5%93%8D%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/464409/%E5%85%B3%E9%97%ADB%E7%AB%99%E9%A1%B6%E9%83%A8%E5%8F%97%E6%8F%92%E4%BB%B6%E5%BD%B1%E5%93%8D%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

function getDate() {
    const now = new Date()
    return `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`
}

(function() {
    'use strict';
    window.localStorage.setItem("IS_SHOW_TIP_TD", `"${getDate()}_1"`);
})();