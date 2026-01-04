// ==UserScript==
// @name         字体与字号调整
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  🏷️ 支持按网站独立保存设置的字体控制工具
// @author       pcysanji
// @match        *://*/*
// @exclude      *://*.chatgpt.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535109/%E5%AD%97%E4%BD%93%E4%B8%8E%E5%AD%97%E5%8F%B7%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/535109/%E5%AD%97%E4%BD%93%E4%B8%8E%E5%AD%97%E5%8F%B7%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG_KEY_PREFIX = 'SiteFontControl_';
    const DEFAULT_FONTS = ['system-ui', 'Segoe UI', 'Microsoft YaHei', 'Arial', 'sans-serif'];
    
    // 获取当前网站标识
    const getSiteKey = () => {
        try {
            return new URL(window.location.href).hostname;
        } catch {
            return 'global';
        }
    };

    // 加载网站独立配置
    const loadConfig = () => {
        const defaultConfig = {
            baseScale: 1.0,
            step: 0.1,
            fontFamily: 'system-ui',
            dynamicWatch: true,
            intervalSec: 0
        };
        return GM_getValue(CONFIG_KEY_PREFIX + getSiteKey(), defaultConfig);
    };

    // 保存网站独立配置
    const saveConfig = (config) => {
        GM_setValue(CONFIG_KEY_PREFIX + getSiteKey(), config);
    };

    let config = loadConfig();
    let observer = null;
    let intervalTimer = null;
    let menuHandles = {};

    // 核心功能函数
    function saveOriginalStyles(element = document.body) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        if (!element.dataset.origFontSize) {
            element.dataset.origFontSize = getComputedStyle(element).fontSize;
        }
        if (!element.dataset.origFontFamily) {
            element.dataset.origFontFamily = getComputedStyle(element).fontFamily;
        }

        const processNodes = node => {
            if (node.shadowRoot) {
                node.shadowRoot.childNodes.forEach(saveOriginalStyles);
            }
            if (node.tagName === 'IFRAME') {
                try {
                    node.contentDocument?.body && saveOriginalStyles(node.contentDocument.body);
                } catch {}
            }
        };

        processNodes(element);
        element.childNodes.forEach(saveOriginalStyles);
    }

    function applySettings(element = document.body) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) return;

        // 应用字号缩放
        if (element.dataset.origFontSize) {
            const originalSize = element.dataset.origFontSize;
            const unit = originalSize.replace(/[\d.-]/g, '');
            const baseValue = parseFloat(originalSize);
            
            let baseSize = baseValue;
            if (unit === 'rem') {
                baseSize *= parseFloat(getComputedStyle(document.documentElement).fontSize);
            } else if (unit === 'em') {
                baseSize *= parseFloat(getComputedStyle(element.parentElement).fontSize);
            }
            
            element.style.fontSize = `${baseSize * config.baseScale}px`;
        }

        // 应用独立字体设置
        element.style.fontFamily = `${config.fontFamily}, ${element.dataset.origFontFamily}`;

        // 递归处理
        element.childNodes.forEach(child => requestAnimationFrame(() => applySettings(child)));
        if (element.shadowRoot) applySettings(element.shadowRoot);
        if (element.tagName === 'IFRAME') {
            try {
                element.contentDocument?.body && applySettings(element.contentDocument.body);
            } catch {}
        }
    }

    function restoreFontSize() {
        config.baseScale = 1.0;
        document.querySelectorAll('*').forEach(el => {
            el.style.removeProperty('font-size');
        });
        applySettings();
        saveConfig(config);
    }

    function restoreFontFamily() {
        config.fontFamily = 'system-ui';
        document.querySelectorAll('*').forEach(el => {
            el.style.removeProperty('font-family');
        });
        applySettings();
        saveConfig(config);
    }

    // 菜单系统
    function createMenu() {
        Object.values(menuHandles).forEach(id => GM_unregisterMenuCommand(id));
        menuHandles = {};

        // 状态显示
        menuHandles.status = GM_registerMenuCommand(
            `🌐 ${getSiteKey()} | 缩放: ${config.baseScale.toFixed(1)}x | 字体: ${config.fontFamily}`,
            () => {},
            { autoClose: false }
        );

        // 字号控制
        menuHandles.increase = GM_registerMenuCommand("🔠 增大字号 (+0.1)", () => {
            config.baseScale = Math.min(config.baseScale + config.step, 3.0);
            applySettings();
            saveConfig(config);
            createMenu();
        }, { autoClose: false });

        menuHandles.decrease = GM_registerMenuCommand("🔠 减小字号 (-0.1)", () => {
            config.baseScale = Math.max(config.baseScale - config.step, 0.5);
            applySettings();
            saveConfig(config);
            createMenu();
        }, { autoClose: false });

        // 字体控制
        menuHandles.font = GM_registerMenuCommand("🎨 设置当前网站字体", () => {
            const newFont = prompt(
                `当前网站：${getSiteKey()}\n推荐字体：${DEFAULT_FONTS.join(', ')}\n输入新字体名称：`,
                config.fontFamily
            );
            if (newFont) {
                config.fontFamily = newFont;
                applySettings();
                saveConfig(config);
                createMenu();
            }
        }, { autoClose: false });

        // 独立恢复功能
        menuHandles.resetSize = GM_registerMenuCommand("↔️ 恢复字号", () => {
            restoreFontSize();
            createMenu();
        }, { autoClose: false });

        menuHandles.resetFont = GM_registerMenuCommand("🔄 恢复字体", () => {
            restoreFontFamily();
            createMenu();
        }, { autoClose: false });

        // 高级设置
        menuHandles.settings = GM_registerMenuCommand("⚙️ 设置步长和定时刷新", () => {
            // 步长设置
            const newStep = parseFloat(prompt("设置当前网站调整步长 (0.1-1.0):", config.step));
            if (!isNaN(newStep) && newStep >= 0.1 && newStep <= 1) {
                config.step = newStep;
                saveConfig(config);
            }

            // 定时刷新
            const newInterval = parseInt(prompt("设置当前网站定时刷新间隔 (秒):", config.intervalSec));
            if (!isNaN(newInterval) && newInterval >= 0) {
                config.intervalSec = newInterval;
                initInterval();
                saveConfig(config);
            }
            createMenu();
        }, { autoClose: false });
    }

    // 辅助功能
    function initObserver() {
        observer?.disconnect();
        if (config.dynamicWatch) {
            observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        saveOriginalStyles(node);
                        applySettings(node);
                    });
                });
            });
            observer.observe(document.body, { subtree: true, childList: true });
        }
    }

    function initInterval() {
        clearInterval(intervalTimer);
        if (config.intervalSec > 0) {
            intervalTimer = setInterval(() => {
                saveOriginalStyles();
                applySettings();
            }, config.intervalSec * 1000);
        }
    }

    // 主初始化
    (function init() {
        const initProcedure = () => {
            saveOriginalStyles();
            applySettings();
            initObserver();
            initInterval();
            createMenu();
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProcedure);
        } else {
            initProcedure();
        }
    })();
})();