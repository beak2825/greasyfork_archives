// ==UserScript==
// @name         ChatGPT对话页面禁止选中
// @namespace    http://tampermonkey.net/
// @version      2024-05-20
// @description  复制chatgpt的内容时，会复制到“复制代码”，这个脚本的作用是让“复制代码”这一行无法选中
// @author       alona
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495563/ChatGPT%E5%AF%B9%E8%AF%9D%E9%A1%B5%E9%9D%A2%E7%A6%81%E6%AD%A2%E9%80%89%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/495563/ChatGPT%E5%AF%B9%E8%AF%9D%E9%A1%B5%E9%9D%A2%E7%A6%81%E6%AD%A2%E9%80%89%E4%B8%AD.meta.js
// ==/UserScript==

(function() {

    // 添加样式以禁止文本选择
    GM_addStyle('.bg-token-main-surface-secondary { user-select: none; }');
})();
