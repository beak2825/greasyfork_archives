// ==UserScript==
// @name        Notion Custom Font
// @namespace   Violentmonkey Scripts
// @match       *://www.notion.so/*
// @grant       none
// @version     1.0
// @author      reonokiy
// @description Change Notion Default Font
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514483/Notion%20Custom%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/514483/Notion%20Custom%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // 更改为想要的字体
    const sansSerifFont = 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "PingFang SC", "思源黑体", "Microsoft YaHei", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
    const serifFont = ' Lyon-Text, Georgia, "Songti SC", "思源宋体", serif';
    const monoFont = ' iawriter-mono, Nitti, Menlo, Courier, "思源等宽", monospace';

    const style = document.createElement('style');
    style.textContent = `
        .notion-app-inner {
            font-family: ${sansSerifFont} !important;
        }

        .notion-app-inner [style*="serif"] {
            font-family: ${serifFont} !important;
        }

        .notion-app-inner [style*="monospace"] {
            font-family: ${monoFont} !important;
        }
    `;

    document.head.appendChild(style);

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.notion-app-inner').forEach(el => {
            el.style.fontFamily = sansSerifFont;
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();