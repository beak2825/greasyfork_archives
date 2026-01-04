// ==UserScript==
// @name         KamePT Preview Cleaner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复KamePT徽章预览图片清理问题
// @author       Your name
// @match        https://kamept.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526595/KamePT%20Preview%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/526595/KamePT%20Preview%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加清理预览图片的功能
    function fixPreviewCleanup() {
        // 查找预览图片元素
        const previewImg = document.getElementById("nexus-preview");
        if (!previewImg) return;

        // 监听所有徽章的鼠标移出事件
        document.addEventListener("mouseover", (e) => {
            if (!e.target.matches("img.nexus-username-medal")) {
                // 如果鼠标不在任何徽章上，隐藏预览
                previewImg.style.display = "none";
            }
        }, true);

        // 监听页面滚动，确保预览不会停留
        window.addEventListener("scroll", () => {
            previewImg.style.display = "none";
        }, { passive: true });

        // 监听鼠标离开页面
        document.addEventListener("mouseout", (e) => {
            if (!e.relatedTarget) {
                previewImg.style.display = "none";
            }
        });
    }

    // 页面加载完成后运行
    window.addEventListener("load", fixPreviewCleanup);
})();