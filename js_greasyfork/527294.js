// ==UserScript==
// @name         交换左键和中键默认打开url的方式
// @namespace    http://tampermonkey.net/
// @version      2025-02-18
// @description  点击超链接,左键新标签页打开.中键当前页面打开
// @author       leftyzzk
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527294/%E4%BA%A4%E6%8D%A2%E5%B7%A6%E9%94%AE%E5%92%8C%E4%B8%AD%E9%94%AE%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80url%E7%9A%84%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/527294/%E4%BA%A4%E6%8D%A2%E5%B7%A6%E9%94%AE%E5%92%8C%E4%B8%AD%E9%94%AE%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80url%E7%9A%84%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

document.addEventListener("mousedown", function(e) {
    let target = e.target.closest("a");
    if (!target) return;

    if (e.button === 0) { // 左键：新标签页打开
        e.preventDefault();
        window.open(target.href, "_blank");
    } else if (e.button === 1) { // 中键：当前页面打开
        e.preventDefault();
        window.location.href = target.href;
    }
}, true);

document.addEventListener("click", function(e) {
    let target = e.target.closest("a");
    if (!target) return;

    if (e.button === 0 || e.button === 1) {
        e.preventDefault(); // 彻底拦截 Firefox 默认行为
    }
}, true);

document.addEventListener("auxclick", function(e) {
    if (e.button === 1) {
        e.preventDefault(); // 防止中键触发新标签页
    }
}, true);

