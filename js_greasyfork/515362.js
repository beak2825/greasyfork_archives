// ==UserScript==
// @name        飞书阅读辅助
// @namespace   Violentmonkey Scripts
// @match       https://*.feishu.cn/wiki/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      -
// @license MIT
// @description 2024/4/14 19:15:25
// @downloadURL https://update.greasyfork.org/scripts/515362/%E9%A3%9E%E4%B9%A6%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/515362/%E9%A3%9E%E4%B9%A6%E9%98%85%E8%AF%BB%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义字体大小和对应的行高
    const fontSettings = [
        { size: 16, lineHeight: 26 },
        { size: 18, lineHeight: 30 },
        { size: 20, lineHeight: 34 },
        { size: 22, lineHeight: 36 },
        { size: 24, lineHeight: 40 },
        { size: 26, lineHeight: 45 },
        { size: 28, lineHeight: 50 },
        { size: 30, lineHeight: 56 }
    ];

    let contentWrappers;
    let rightContentContainer;
    let fontSizeSelect;

    // 应用保存的字体设置
    function applyFontSettings(size) {
        const setting = fontSettings.find(s => s.size === size);
        if (!setting) return;

        const style = document.createElement('style');
        style.textContent = `
            .mindnote-tree .content-wrapper .content {
                font-size: ${setting.size}px !important;
                line-height: ${setting.lineHeight}px !important;
                border: none !important;
                box-shadow: none !important;
                padding: 2px 4px !important;
            }
            .mindnote-tree .content-wrapper {
                border: none !important;
                box-shadow: none !important;
            }
            .mindnote-tree .content-wrapper:hover {
                background: rgba(0, 0, 0, 0.03) !important;
                border-radius: 4px !important;
            }
        `;

        // 移除之前添加的样式
        const oldStyle = document.getElementById('custom-font-size');
        if (oldStyle) {
            oldStyle.remove();
        }

        style.id = 'custom-font-size';
        document.head.appendChild(style);
    }

    function createFontSizeSelect() {
        fontSizeSelect = document.createElement('select');
        fontSizeSelect.classList.add('font-size-select');

        // 添加选择器样式
        fontSizeSelect.style.padding = '4px 8px';
        fontSizeSelect.style.margin = '8px';
        fontSizeSelect.style.borderRadius = '4px';
        fontSizeSelect.style.border = '1px solid #ddd';

        // 获取保存的字体大小，如果没有则使用默认值16
        const savedSize = GM_getValue('fontSize', 16);

        fontSettings.forEach(setting => {
            const option = document.createElement('option');
            option.value = setting.size;
            option.text = `${setting.size}px`;
            if (setting.size === savedSize) {
                option.selected = true;
            }
            fontSizeSelect.add(option);
        });

        // 初始应用保存的设置
        applyFontSettings(savedSize);

        fontSizeSelect.addEventListener('change', () => {
            const selectedSize = parseInt(fontSizeSelect.value);
            // 保存选择的字体大小
            GM_setValue('fontSize', selectedSize);
            applyFontSettings(selectedSize);
        });
    }

    function insertFontSizeSelect() {
        rightContentContainer.insertBefore(fontSizeSelect, rightContentContainer.firstChild);
    }

    function checkElements() {
        contentWrappers = document.querySelectorAll('.mindnote-tree .content-wrapper .content');
        rightContentContainer = document.querySelector('.right-content');

        if (contentWrappers.length > 0 && rightContentContainer && !fontSizeSelect) {
            createFontSizeSelect();
            insertFontSizeSelect();
        }
    }

    window.addEventListener('load', () => {
        const interval = setInterval(() => {
            checkElements();
            if (fontSizeSelect) {
                clearInterval(interval);
            }
        }, 500);
    });
})();








