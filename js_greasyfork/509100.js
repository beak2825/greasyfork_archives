// ==UserScript==
// @name         Neat Reader Font and Size Adjuster (4 Working Fonts)
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  Adjust font size and choose from 4 working Chinese fonts with persistent settings on Neat Reader web app.
// @author       chatgpt
// @match        https://www.neat-reader.com/webapp*
// @match        https://www.neat-reader.cn/webapp*
// @match        https://neat-reader.cn/webapp*
// @match        https://neat-reader.com/webapp*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/509100/Neat%20Reader%20Font%20and%20Size%20Adjuster%20%284%20Working%20Fonts%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509100/Neat%20Reader%20Font%20and%20Size%20Adjuster%20%284%20Working%20Fonts%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取用户存储的字体大小和字体类型，若没有则使用默认值
    let fontSize = localStorage.getItem('customFontSize') || 1.0;
    let fontFamily = localStorage.getItem('customFontFamily') || 'Microsoft YaHei, Heiti SC, Heiti TC';

    // 定义应用字体大小和字体类型的函数，使用 !important 强制覆盖样式
    function applyFontSettings() {
        const sections = document.querySelectorAll('section, section p, section span, section div, section h1, section h2, section h3, section h4, section h5, section h6, section a');
        sections.forEach(section => {
            section.style.setProperty('font-size', fontSize + 'em', 'important');
            section.style.setProperty('font-family', fontFamily, 'important');
        });
    }

    // 保存字体大小到 localStorage
    function saveFontSize(size) {
        localStorage.setItem('customFontSize', size);
    }

    // 保存字体类型到 localStorage
    function saveFontFamily(family) {
        localStorage.setItem('customFontFamily', family);
    }

    // 添加 Tampermonkey 插件栏中的字体大小调整选项
    GM_registerMenuCommand("Adjust Font Size", function() {
        let sizeInput = prompt("请输入想要设置的字体大小（单位 em）:", fontSize);
        if (sizeInput !== null) {
            fontSize = parseFloat(sizeInput);
            saveFontSize(fontSize);  // 保存字体大小到 localStorage
            applyFontSettings();  // 应用设置
        }
    });

    // 添加 Tampermonkey 插件栏中的字体选择选项
    GM_registerMenuCommand("Choose Font Family", function() {
        let fontOptions = `
        请选择字体 (有效字体):
        1. Microsoft YaHei (微软雅黑)
        2. PingFang SC (苹方)
        3. WenQuanYi Micro Hei (文泉驿微米黑)
        4. STSong (华文宋体)
        `;

        let fontChoice = prompt(fontOptions + "\n请输入对应的数字选择字体:", "1");

        switch (fontChoice) {
            case "1":
                fontFamily = 'Microsoft YaHei, Heiti SC, Heiti TC';
                break;
            case "2":
                fontFamily = 'PingFang SC';
                break;
            case "3":
                fontFamily = 'WenQuanYi Micro Hei';
                break;
            case "4":
                fontFamily = 'STSong';
                break;
            default:
                alert('无效的选择，保持当前字体');
                return;
        }

        saveFontFamily(fontFamily);  // 保存字体类型到 localStorage
        applyFontSettings();  // 应用设置
    });

    // 页面加载时自动应用字体设置
    window.addEventListener('load', function() {
        applyFontSettings();  // 应用自定义字体
    });

    // 监听页面的变化，确保字体不会被重置，且持续强制应用自定义字体
    const observer = new MutationObserver(function() {
        applyFontSettings();  // 重新应用自定义字体
    });

    // 监听整个文档，确保在任何变化时重新应用字体
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
})();
