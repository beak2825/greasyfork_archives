// ==UserScript==
// @name         System Fonts
// @name:en      System Fonts
// @name:zh-CN   强制系统字体
// @name:zh-TW   強制系統字體
// @namespace    https://greasyfork.org/scripts/528512
// @version      1.0.2
// @description  让网页强制使用系统字体
// @description:en  Let web pages force the use of system fonts
// @description:zh-CN    让网页强制使用系统字体
// @description:zh-TW    讓網頁強制使用系統字體
// @author       Deepseek
// @match        *://*/*
// @exclude *://fanqienovel.com/reader/*
// @exclude *://*.android.google.cn/*
// @exclude *://ai.qaqgpt.com/*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/528512/System%20Fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/528512/System%20Fonts.meta.js
// ==/UserScript==

(function() {
    const css = document.createElement('style');
    css.innerHTML = `
        *:not([class^="fa-"],[class*=" fa-"],[class^="material-"],[class*=" material-"],[class*="icon"],[class^="icon-"],[aria-hidden=true]) {
            font-family: system-ui !important;
        }
    `;
    document.head.appendChild(css);
})();