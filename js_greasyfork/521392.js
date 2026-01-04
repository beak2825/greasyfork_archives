// ==UserScript==
// @name         去除百度搜索框的热搜 placeholder & AI搜索提示
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  确保百度搜索框 placeholder 为空，并移除 AI 搜索提示。
// @match        https://www.baidu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521392/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%9A%84%E7%83%AD%E6%90%9C%20placeholder%20%20AI%E6%90%9C%E7%B4%A2%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/521392/%E5%8E%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E6%A1%86%E7%9A%84%E7%83%AD%E6%90%9C%20placeholder%20%20AI%E6%90%9C%E7%B4%A2%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function clearPlaceholder() {
        let inputElement = document.getElementById('kw');
        if (inputElement && inputElement.placeholder !== '') {
            inputElement.placeholder = ''; // 立即清空
        }
    }

    function observePlaceholder() {
        let inputElement = document.getElementById('kw');
        if (!inputElement) return;

        let observer = new MutationObserver(() => {
            clearPlaceholder(); // 仅在变化时清除
        });

        observer.observe(inputElement, {
            attributes: true,
            attributeFilter: ['placeholder'],
        });

        // 页面卸载时停止监听，防止内存泄漏
        window.addEventListener('beforeunload', () => observer.disconnect());
    }

    function removeAISearchGuide() {
        let aiGuide = document.querySelector('a.new_search_guide_bub_container');
        if (aiGuide) {
            aiGuide.remove(); // 直接移除 AI 搜索提示
        }
    }

    function observeAISearchGuide() {
        let observer = new MutationObserver(() => {
            removeAISearchGuide();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener('beforeunload', () => observer.disconnect());
    }

    // 页面加载时执行一次
    clearPlaceholder();
    observePlaceholder();
    removeAISearchGuide();
    observeAISearchGuide();
})();
