// ==UserScript==
// @name         幕布优化
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  优化幕布显示效果
// @author       XM
// @match        https://mubu.com/*
// @icon         https://assets.mubu.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518746/%E5%B9%95%E5%B8%83%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/518746/%E5%B9%95%E5%B8%83%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementsToRemove = [
        'div.sc-eKaOPE',// 文件夹页面中，又大又傻的文件夹标题
	        'div.outliner-header-container',// 文档页面中，又大又傻的文档标题
    ];

    function removeElements() {
        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    window.addEventListener('load', () => {
        removeElements();
    });
})();