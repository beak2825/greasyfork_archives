// ==UserScript==
// @name         91porn
// @namespace    http://your-namespace.com
// @version      1.0
// @description  提醒用户当前网页是否安全。根据简单的 URL 检查，提示用户正在访问的网站是否在可信任的网站列表中。
// @author       YourName
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503851/91porn.user.js
// @updateURL https://update.greasyfork.org/scripts/503851/91porn.meta.js
// ==/UserScript==

// 安全网址列表
const trustedWebsites = [
    "https://www.google.com",
    "https://www.wikipedia.org",
    "https://www.github.com"
];

// 获取当前页面的 URL
const currentUrl = window.location.href;

// 功能：检查当前网页是否在可信任列表中，并给出相应的提示
function checkWebsiteSafety() {
    if (trustedWebsites.some(url => currentUrl.startsWith(url))) {
        alert("您正在访问的网页是可信任的网站。");
    } else {
        alert("请注意，您正在访问的网页不在信任的网站列表中，请小心操作。");
    }
}

// 执行安全检查
checkWebsiteSafety();