// ==UserScript==
// @name         奶牛簡中字型
// @namespace    http://tampermonkey.net/
// @version      2025-04-19
// @description  簡體中文字型替換成Google的Noto Sans SC
// @author       Misuwa
// @match        https://www.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533293/%E5%A5%B6%E7%89%9B%E7%B0%A1%E4%B8%AD%E5%AD%97%E5%9E%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533293/%E5%A5%B6%E7%89%9B%E7%B0%A1%E4%B8%AD%E5%AD%97%E5%9E%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontName = "Noto Sans SC";
    const fontSize = "14px";

    // Google Fonts
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // 套用
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            font-family: '${fontName}', sans-serif !important;
            font-size: ${fontSize} !important;
        }
    `;
    document.head.appendChild(style);
})();
