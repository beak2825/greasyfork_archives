// ==UserScript==
// @name         Discord MidjourneyCN
// @namespace    https://github.com/cwser/midjourney-discord-cn
// @version      1.0.5
// @description  Discord平台Midjourney全功能汉化｜支持按钮实时翻译、操作面板优化、用户偏好记忆（需开启开发者模式）
// @author       cwser
// @match        https://discord.com/channels/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      discord.com
// @connect      cdn.jsdelivr.net
// @run-at       document-end
// @noframes
// @license      MIT
// @homepageURL  https://github.com/cwser/midjourney-discord-cn
// @supportURL   https://github.com/cwser/midjourney-discord-cn/issues
// @downloadURL https://update.greasyfork.org/scripts/535352/Discord%20MidjourneyCN.user.js
// @updateURL https://update.greasyfork.org/scripts/535352/Discord%20MidjourneyCN.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 定义汉化映射
    const translationMap = {
    "U1": "细化放大1",
    "U2": "细化放大2",
    "U3": "细化放大3",
    "U4": "细化放大4",
    "V1": "变化微调1",
    "V2": "变化微调2",
    "V3": "变化微调3",
    "V4": "变化微调4",
    "Animate (High motion)": "生成动画(高动态)",
    "Animate (Low motion)": "生成动画(低动态)",
    "Make Variations": "变化微调",
    "Reset": "重置",
    "Light Upscale Redo": "轻度高清重绘",
    "Strong Upscale Redo": "强力高清重绘",
    "Stylize low": "低强度风格化",
    "Stylize med": "中强度风格化",
    "Stylize high": "高强度风格化",
    "Stylize very high": "超强度风格化",
    "Personalization": "个性化设置",
    "Public mode": "公开模式",
    "Remix mode": "重塑模式",
    "Strong Variation Mode": "强烈变化模式",
    "Subtle Variation Mode": "细微变化模式",
    "Turbo mode": "极速模式",
    "Fast mode": "快速模式",
    "Relax mode": "低速模式",
    "RAW Mode": "原始模式",
    "Make Square": "生成正方形",
    "Default Style": "默认风格",
    "Expressive Style": "表现主义风格",
    "Cute Style": "可爱风格",
    "Scenic Style": "风景风格",
    "Original Style": "原创风格",
    "Reset Settings": "恢复默认设置",
    "Upscale (Subtle)": "精细高清化",
    "Upscale (Creative)": "创意高清化",
    "Vary (Subtle)": "细微调整",
    "Vary (Strong)": "大幅调整",
    "Vary (Region)": "局部调整",
    "Zoom Out 2x": "画面缩小2倍",
    "Zoom Out 1.5x": "画面缩小1.5倍",
    "Custom Zoom": "自定义缩放",
    "Web": "网页版",
    "Redo Upscale (Subtle)": "重新精细高清化",
    "Redo Upscale (Creative)": "重新创意高清化",
    "Redo Upscale (2x)": "2倍高清重制",
    "Redo Upscale (4x)": "4倍高清重制",
    "Upscale (2x)": "2倍高清化",
    "Upscale (4x)": "4倍高清化"

    };

    // 函数用于汉化按钮
    function translateButtons() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const originalText = button.textContent.trim();
            if (translationMap[originalText]) {
                const textNodes = [];
                function collectTextNodes(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        textNodes.push(node);
                    } else {
                        for (let i = 0; i < node.childNodes.length; i++) {
                            collectTextNodes(node.childNodes[i]);
                        }
                    }
                }
                collectTextNodes(button);
                if (textNodes.length > 0) {
                    textNodes[0].textContent = translationMap[originalText];
                }
            }
        });
    }

    // 页面加载完成后执行汉化
    window.addEventListener('load', () => {
        translateButtons();

        // 监听 DOM 变化，处理动态加载的按钮
        const observer = new MutationObserver(() => {
            translateButtons();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();