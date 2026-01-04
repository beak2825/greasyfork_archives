// ==UserScript==
// @name         Summoner Name Masking
// @namespace    https://greasyfork.org/zh-TW/users/1284613
// @version      0.1
// @description  Apply mosaic effect to summoner names
// @match        *://www.op.gg/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519458/Summoner%20Name%20Masking.user.js
// @updateURL https://update.greasyfork.org/scripts/519458/Summoner%20Name%20Masking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 選擇所有包含特定類名的span元素
    const nameElements = document.querySelectorAll('span.css-ao94tw.e1swkqyq1');

    nameElements.forEach(element => {
        element.style.color = 'transparent';
        element.style.textShadow = '#fff 0 0 4px';
        element.style.userSelect = 'none';
    });
})();