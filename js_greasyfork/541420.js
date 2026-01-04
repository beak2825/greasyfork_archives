// ==UserScript==
// @name         微信读书阅读体验优化
// @icon         https://weread.qq.com/favicon.ico
// @namespace    https://greasyfork.org/zh-CN/scripts/541420
// @version      1.2.2
// @description  提供背景色切换和空格翻页功能
// @author       Riki & Velens
// @match        https://weread.qq.com/web/reader/*
// @license      CC-BY-4.0
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/541420/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/541420/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. Configuration and State Center ---
    const state = {
        isClassic() {
            // 只要不是水平阅读模式，都视为经典(垂直)模式
            return !document.querySelector(".wr_horizontalReader");
        },
        settings: {},
        menuCommandIds: {},

        load() {
            this.settings.colorIdx = GM_getValue("colorIdx", 0);
            this.settings.spacePageIdx = GM_getValue("spacePageIdx", 0);
        },
        save(key, value) {
            this.settings[key] = value;
            GM_setValue(key, value);
        }
    };

    // --- Configuration object for colors and features ---
    const CONFIG = {
        colors: [
            { title: "豆沙绿", value: "#C7EDCC" }, { title: "象牙米", value: "#F5EEDC" },
            { title: "怀旧棕", value: "#FBF0D9" }, { title: "杏仁黄", value: "#FAF9DE" },
            { title: "秋叶褐", value: "#FFF2E2" }, { title: "胭脂红", value: "#FDE6E0" },
            { title: "海天蓝", value: "#DCE2F1" }, { title: "葛巾紫", value: "#E9EBFE" },
            { title: "极光灰", value: "#EAEAEF" }, { title: "青草绿", value: "#E3EDCD" },
            { title: "银河白", value: "#FFFFFF" }
        ],
        spacePages: [{ title: "开启", enabled: true }, { title: "关闭", enabled: false }],
    };

    // --- 2. Core Functionality Module ---
    const styleManager = {
        styleTag: null,
        setup() {
            // [优化] 移除 .wr_whiteTheme 限制，确保在任何原生主题下都能生效
            // [优化] 增加 !important 提高优先级
            const css = `
                :root {
                    --weread-helper-bg-color: #FFFFFF;
                    --weread-helper-font-color: initial;
                }
                /* 覆盖阅读区域、顶部栏、控制栏 */
                .readerControls_fontSize, 
                .readerControls_item, 
                .readerContent .app_content, 
                .readerTopBar, 
                .wr_horizontalReader .readerChapterContent,
                .app_content { 
                    background-color: var(--weread-helper-bg-color) !important; 
                }
                
                /* 字体颜色适配 */
                .readerChapterContent, .readerChapterContent * { 
                    color: var(--weread-helper-font-color) !important; 
                }
                
                /* 隐藏可能干扰背景色的遮罩层或原生背景图 */
                .readerContent .app_content {
                    background-image: none !important;
                }
            `;
            this.styleTag = document.createElement('style');
            this.styleTag.id = 'weread-helper-styles';
            this.styleTag.textContent = css;
            document.head.appendChild(this.styleTag);
        },
        applyAll() {
            const bgColor = CONFIG.colors[state.settings.colorIdx].value;
            // 简单的文字颜色适配，深色模式可能需要更复杂的逻辑，但当前色板均为浅色，够用了
            const fontColor = (bgColor === '#FFFFFF') ? 'initial' : '#333333';
            
            document.documentElement.style.setProperty('--weread-helper-bg-color', bgColor);
            document.documentElement.style.setProperty('--weread-helper-font-color', fontColor);
        }
    };

    function nextPage() {
        // 模拟按下右箭头键，触发原生翻页
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'ArrowRight',
            code: 'ArrowRight',
            keyCode: 39,
            bubbles: true
        }));
    }

    // --- 3. Event Handling ---
    function setupEventListeners() {
        // [优化] 移除 removeEventListener，因为匿名函数无法被 remove，且脚本只运行一次，无副作用
        document.addEventListener('keydown', handleKeydown, { capture: true });
    }

    function handleKeydown(event) {
        const isSpacePageEnabled = CONFIG.spacePages[state.settings.spacePageIdx].enabled;
        if (!isSpacePageEnabled || event.code !== 'Space') return;

        // [安全] 确保不在输入框或编辑模式下触发
        const activeEl = document.activeElement;
        const isInputting = activeEl && (['INPUT', 'TEXTAREA'].includes(activeEl.tagName) || activeEl.isContentEditable);
        if (isInputting) return;

        event.preventDefault();
        event.stopPropagation();

        if (state.isClassic()) {
            // 垂直滚动模式
            const scrollable = document.documentElement;
            // 滚动高度判定，到底部触发翻页
            const isAtBottom = scrollable.scrollTop + scrollable.clientHeight >= scrollable.scrollHeight - 50; // 增加容错到50px
            
            if (isAtBottom) {
                nextPage();
            } else {
                // 滚动一屏的 85%
                window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
            }
        } else {
            // 水平翻页模式
            nextPage();
        }
    }

    // --- 4. Menu System ---
    function refreshMenus() {
        const menuStructure = buildMenuStructure();
        registerAllMenus(menuStructure);
    }

    function registerAllMenus(menuStructure) {
        // 清理旧菜单
        Object.values(state.menuCommandIds).forEach(id => {
            if (typeof GM_unregisterMenuCommand === 'function' && id) {
                GM_unregisterMenuCommand(id);
            }
        });
        state.menuCommandIds = {};

        // 注册新菜单
        menuStructure.forEach(item => {
            if (!item) return;
            const { key, configArray, labelPrefix, action } = item;
            const commandKey = `cmd_${key}`;
            
            const getCurrentLabel = () => {
                const currentIndex = state.settings[key];
                const nextIndex = (currentIndex + 1) % configArray.length;
                // [优化] 菜单文案微调，使其更易懂
                return `${labelPrefix}：[${configArray[currentIndex].title}] ➤ 点击切换为 ${configArray[nextIndex].title}`;
            };

            const commandHandler = () => {
                state.save(key, (state.settings[key] + 1) % configArray.length);
                if (action) action();
                refreshMenus();
            };
            
            state.menuCommandIds[commandKey] = GM_registerMenuCommand(getCurrentLabel(), commandHandler);
        });
    }

    function buildMenuStructure() {
        return [
            { key: 'colorIdx', configArray: CONFIG.colors, labelPrefix: '🎨 背景色', action: () => styleManager.applyAll() },
            { key: 'spacePageIdx', configArray: CONFIG.spacePages, labelPrefix: '📖 空格翻页' },
        ];
    }

    // --- 5. Script Initialization ---
    function init() {
        state.load();
        styleManager.setup();
        styleManager.applyAll();
        refreshMenus();
        setupEventListeners();
    }
    
    // [优化] 优先使用 DOMContentLoaded，如果脚本注入晚了则直接执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();