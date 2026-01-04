// ==UserScript==
// @name         文字选中颜色修改器-菜单版
// @namespace    https://viayoo.com/
// @version      1.0
// @description  自定义网页文本选中颜色，支持透明度/智能文字色
// @author       是小白呀 & DeepSeek & Grok
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532843/%E6%96%87%E5%AD%97%E9%80%89%E4%B8%AD%E9%A2%9C%E8%89%B2%E4%BF%AE%E6%94%B9%E5%99%A8-%E8%8F%9C%E5%8D%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/532843/%E6%96%87%E5%AD%97%E9%80%89%E4%B8%AD%E9%A2%9C%E8%89%B2%E4%BF%AE%E6%94%B9%E5%99%A8-%E8%8F%9C%E5%8D%95%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置初始化
    const defaultConfig = {
        selColor: '#FFC0CB', // 文本选择色
        alpha: 'CC', // 默认透明度（80%）
        textColor: '#333' // 初始文字颜色
    };

    // 复合预设库
    const colorPresets = {
        '🌸 少女粉': {
            sel: 'pink',
            text: 'auto'
        },
        '🍃 薄荷绿': {
            sel: '#98FF98',
            text: 'auto'
        },
        '🌌 深空蓝': {
            sel: '#87CEEB',
            text: '#FFF'
        },
        '🌙 暗黑系': {
            sel: '#2D3436',
            text: '#FFF'
        }
    };

    // 初始化样式元素
    const style = document.createElement('style');
    document.head.appendChild(style);

    // 状态管理
    let currentSel = GM_getValue('selColor', defaultConfig.selColor);
    let currentAlpha = GM_getValue('alpha', defaultConfig.alpha);
    let currentText = GM_getValue('textColor', defaultConfig.textColor);

    // 核心渲染函数
    const applyStyles = () => {
        const selColor = colorNameToHex(currentSel) + currentAlpha;
        const textColor = currentText === 'auto' ?
            getContrastColor(currentSel) :
            colorNameToHex(currentText);

        style.textContent = `
    ::selection {
        background: ${selColor} !important;
        color: ${textColor} !important;
    }
    ::-moz-selection {
        background: ${selColor} !important;
        color: ${textColor} !important;
    }
`;

        // 持久化存储
        GM_setValue('selColor', currentSel);
        GM_setValue('alpha', currentAlpha);
        GM_setValue('textColor', currentText);
    };

    // 工具函数
    const colorNameToHex = (name) => {
        const colorMap = {
            pink: '#FFC0CB',
            white: '#FFFFFF',
            black: '#000000',
            auto: 'transparent'
        };
        return colorMap[name.toLowerCase()] || name;
    };

    const getContrastColor = (bgColor) => {
        const hex = colorNameToHex(bgColor).replace(/^#/, '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 128 ? '#333' : '#FFF';
    };

    const validateHex = (color) => {
        return /^(#)?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color);
    };

    // 菜单系统
    GM_registerMenuCommand('🎨 设置选择颜色', () => {
        const newColor = prompt('输入颜色名称/HEX值（当前： ' + currentSel + '）', currentSel);
        if (newColor && validateHex(colorNameToHex(newColor))) {
            currentSel = newColor.toLowerCase();
            applyStyles();
        }
    });

    GM_registerMenuCommand('⚙ 透明度设置', () => {
        const currentPercent = Math.round(parseInt(currentAlpha, 16) / 255 * 100);
        const newPercent = prompt('输入透明度百分比（0-100）', currentPercent);
        const alphaValue = Math.min(100, Math.max(0, isNaN(newPercent) ? currentPercent : Number(newPercent)));
        currentAlpha = Math.round(alphaValue / 100 * 255).toString(16).padStart(2, '0');
        applyStyles();
    });

    GM_registerMenuCommand('⚙ 文字颜色模式', () => {
        const choice = prompt('选择模式：\n1. 自动对比色\n2. 自定义固定色\n输入数字', currentText === 'auto' ? 1 : 2);
        if (choice === '1') {
            currentText = 'auto';
        } else if (choice === '2') {
            const fixedColor = prompt('输入固定文字颜色（名称/HEX）', currentText);
            if (validateHex(colorNameToHex(fixedColor))) {
                currentText = fixedColor;
            }
        }
        applyStyles();
    });

    // 注册预设菜单
    Object.entries(colorPresets).forEach(([name, preset]) => {
        GM_registerMenuCommand(name, () => {
            currentSel = preset.sel;
            currentText = preset.text;
            applyStyles();
        });
    });

    // 初始化应用
    applyStyles();
})();