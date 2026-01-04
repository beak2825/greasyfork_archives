// ==UserScript==
// @name         微信读书底色修改
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改微信读书的背景颜色，提升阅读体验
// @author       木子火玄
// @match        https://weread.qq.com/*
// @icon         https://weread.qq.com/favicon.ico
// @license      GNU GPLv3
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/530889/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%BA%95%E8%89%B2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/530889/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%BA%95%E8%89%B2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认背景色
    const DEFAULT_BACKGROUND_COLOR = '#FFF9E6';
    let isColorEnabled = GM_getValue('isColorEnabled', true);

    // 判断颜色是否为浅色
    function isLightColor(color) {
        // 移除#符号并转换为RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // 计算亮度 (根据人眼对不同颜色的敏感度)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // 亮度大于125认为是浅色
        return brightness > 125;
    }

    // 应用阅读模式样式
    function applyReadingStyle(backgroundColor) {
        // 检查是否已存在样式标签
        let styleTag = document.getElementById('reading-mode-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'reading-mode-style';
            document.head.appendChild(styleTag);
        }

        // 计算文本颜色（根据背景色亮度）
        const isLightBackground = isLightColor(backgroundColor);
        const textColor = isLightBackground ? '#333333' : '#ffffff';

        // 设置CSS规则
        styleTag.textContent = `
            body {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }

            /* 保持文本容器的背景色，但确保文本可见 */
            .post-content, .readerTopBar, .app_content {
                background-color: ${backgroundColor} !important;
                color: ${textColor} !important;
            }

            /* 确保链接文本可见 */
            a {
                color: ${isLightBackground ? '#0066cc' : '#66b3ff'} !important;
            }
        `;
    }

    // 初始化背景色
    function initBackgroundColor() {
        const backgroundColor = GM_getValue('backgroundColor', DEFAULT_BACKGROUND_COLOR);
        if (isColorEnabled) {
            applyReadingStyle(backgroundColor);
        }
    }

    // 注册菜单命令
    function registerMenu() {
        GM_registerMenuCommand('设置背景颜色', function() {
            const currentColor = GM_getValue('backgroundColor', DEFAULT_BACKGROUND_COLOR);
            const newColor = prompt('请输入新的背景颜色（十六进制格式，如：#FFF9E6）：', currentColor);
            if (newColor && /^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                GM_setValue('backgroundColor', newColor);
                applyReadingStyle(newColor);
            }
        });
    }

    // 添加颜色切换按钮
    function addColorToggleButton() {
        const readerControls = document.querySelector('.readerControls');
        if (!readerControls) return;

        const toggleButton = document.createElement('button');
        toggleButton.title = '切换背景颜色';
        toggleButton.className = 'readerControls_item cg_color';
        toggleButton.innerHTML = '<span class="icon"></span>';

        // 添加按钮样式
        const style = document.createElement('style');
        style.textContent = `
            .cg_color .icon {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>');
                width: 24px;
                height: 24px;
                display: inline-block;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                transition: opacity 0.2s ease;
                opacity: 0.7;
            }
            .cg_color:hover .icon {
                opacity: 1;
            }
            .cg_color.active .icon {
                background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230066cc"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>');
            }
        `;
        document.head.appendChild(style);

        // 设置按钮状态
        if (isColorEnabled) {
            toggleButton.classList.add('active');
        }

        // 添加点击事件
        toggleButton.addEventListener('click', function() {
            isColorEnabled = !isColorEnabled;
            GM_setValue('isColorEnabled', isColorEnabled);

            if (isColorEnabled) {
                toggleButton.classList.add('active');
                const backgroundColor = GM_getValue('backgroundColor', DEFAULT_BACKGROUND_COLOR);
                applyReadingStyle(backgroundColor);
            } else {
                toggleButton.classList.remove('active');
                // 移除自定义样式
                const styleTag = document.getElementById('reading-mode-style');
                if (styleTag) {
                    styleTag.remove();
                }
            }
        });

        readerControls.appendChild(toggleButton);
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        initBackgroundColor();
        registerMenu();
        addColorToggleButton();
    });
})();