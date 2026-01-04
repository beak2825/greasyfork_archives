// ==UserScript==
// @name         隐藏刺猬猫页面中水印并删除行结尾的dmoF
// @namespace    http://tampermonkey.net/
// @version      2024-10-02-2
// @description  自动隐藏页面中的 watermark 元素并删除 dmoF
// @author       muyuanjin
// @match        https://www.ciweimao.com/chapter/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511199/%E9%9A%90%E8%97%8F%E5%88%BA%E7%8C%AC%E7%8C%AB%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%B0%B4%E5%8D%B0%E5%B9%B6%E5%88%A0%E9%99%A4%E8%A1%8C%E7%BB%93%E5%B0%BE%E7%9A%84dmoF.user.js
// @updateURL https://update.greasyfork.org/scripts/511199/%E9%9A%90%E8%97%8F%E5%88%BA%E7%8C%AC%E7%8C%AB%E9%A1%B5%E9%9D%A2%E4%B8%AD%E6%B0%B4%E5%8D%B0%E5%B9%B6%E5%88%A0%E9%99%A4%E8%A1%8C%E7%BB%93%E5%B0%BE%E7%9A%84dmoF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数用于删除 watermark 元素
    function removeWatermark() {
        const watermark = document.querySelector('.watermark');
        if (watermark && watermark.style.display !== 'none') {
            // 设置元素为不可见
            watermark.style.display = 'none';
            console.log('Watermark 已被隐藏');
        }
    }

    // 函数用于删除所有包含 "dmoF" 的 <span> 元素
    function removeDmoF() {
        const spans = document.querySelectorAll('span');
        spans.forEach(span => {
            if (span.textContent.trim() === 'dmoF') {
                span.remove();
                console.log('dmoF 已被删除');
            }
        });
    }

    // 监听页面内容加载完成
    window.addEventListener('load', () => {
        removeWatermark();
        removeDmoF();
    });

    // 处理动态内容加载的情况（例如通过 AJAX 加载的内容）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            removeWatermark();
            removeDmoF();
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
