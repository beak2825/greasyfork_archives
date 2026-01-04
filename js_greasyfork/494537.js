// ==UserScript==
// @name         清除eclipse属性
// @namespace    http://tampermonkey.net/
// @version      2024-05-10-1
// @description  清除监控平台的eclipse属性
// @author       You
// @match        http://172.16.60.11/*
// @match        http://172.16.60.12/*
// @match        http://172.16.60.13/*
// @match        http://172.16.60.14/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=60.13
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494537/%E6%B8%85%E9%99%A4eclipse%E5%B1%9E%E6%80%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/494537/%E6%B8%85%E9%99%A4eclipse%E5%B1%9E%E6%80%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styleText = `
        /*多语言翻译会动态增加该样式*/
        overflow: hidden !important;
        text-overflow: clip !important;
        white-space: nowrap !important;
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `.ellipsis { ${styleText} }`;
    document.head.appendChild(styleSheet);
})();