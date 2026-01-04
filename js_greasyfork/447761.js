// ==UserScript==
// @name         Infinity新标签页图标名称/背景色适配DarkReader
// @namespace    https://github.com/iMortRex
// @version      0.0.8
// @description  让Infinity新标签页图标名称和背景色适配DarkReader
// @author       Mort Rex
// @run-at       document-start
// @match        https://inftab.com/
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447761/Infinity%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%9B%BE%E6%A0%87%E5%90%8D%E7%A7%B0%E8%83%8C%E6%99%AF%E8%89%B2%E9%80%82%E9%85%8DDarkReader.user.js
// @updateURL https://update.greasyfork.org/scripts/447761/Infinity%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E5%9B%BE%E6%A0%87%E5%90%8D%E7%A7%B0%E8%83%8C%E6%99%AF%E8%89%B2%E9%80%82%E9%85%8DDarkReader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM.addStyle('@media (prefers-color-scheme: dark) {* {--icon-font-color: var(--darkreader-neutral-text) !important;}}');
    GM.addStyle('@media (prefers-color-scheme: dark) {.wallpaper-mask {background-color: #242424 !important;}}');
    (function loop() {
        if (document.getElementsByClassName('wallpaper-mask')[0] && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.getElementsByClassName('wallpaper-mask')[0].style.cssText += 'background-color: #242424 !important;';
        } else {
            setTimeout(loop, 20);
        }
    })();
})();