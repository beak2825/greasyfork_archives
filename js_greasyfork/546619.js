// ==UserScript==
// @name         ChatGPT, GROK, DEEPSEEK, Gemini, QWEN, Doubao AI WEB Chat Scroll Navigator Tool(AI网页聊天智能滚动导航工具)
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  A unified interface for scrolling, navigation in Gemini, ChatGPT, GROK, DEEPSEEK, QWEN, Doubao AI chats with section navigation, multiple themes etc. 为常用AI聊天界面提供统一的滚动导航界面，支持滚动阅读，公式显示, 章节导航，和多种主题及图标风格和自定义设置。
// @author       Lepturus
// @match        *://chatgpt.com/*
// @match        *://chat.deepseek.com/*
// @match        *://grok.com/*
// @match        *://www.qianwen.com/*
// @match        *://chat.qwen.ai/*
// @match        *://gemini.google.com/*
// @match        *://*.doubao.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546619/ChatGPT%2C%20GROK%2C%20DEEPSEEK%2C%20Gemini%2C%20QWEN%2C%20Doubao%20AI%20WEB%20Chat%20Scroll%20Navigator%20Tool%28AI%E7%BD%91%E9%A1%B5%E8%81%8A%E5%A4%A9%E6%99%BA%E8%83%BD%E6%BB%9A%E5%8A%A8%E5%AF%BC%E8%88%AA%E5%B7%A5%E5%85%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546619/ChatGPT%2C%20GROK%2C%20DEEPSEEK%2C%20Gemini%2C%20QWEN%2C%20Doubao%20AI%20WEB%20Chat%20Scroll%20Navigator%20Tool%28AI%E7%BD%91%E9%A1%B5%E8%81%8A%E5%A4%A9%E6%99%BA%E8%83%BD%E6%BB%9A%E5%8A%A8%E5%AF%BC%E8%88%AA%E5%B7%A5%E5%85%B7%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 1. CONFIGURATION & STATE --- //

    const CONFIG = {
        platforms: {
            chatgpt: { container: ' div.relative.flex.min-h-0.min-w-0.flex-1.flex-col, main div[class*="overflow-y-auto"]'},
            grok: { container: '.scrollbar-gutter-stable' },
            deepseek: { container: '.ds-scroll-area' },
            tongyi:{ container: 'div.message-list-scroll-container'},  // qianwen//
            qwen:{ container: 'div#chat-messages-scroll-container'},
            gemini:{container: 'infinite-scroller.chat-history'},
            doubao:{container: 'div[class^="scrollable-"]'},
            generic: { container: 'html, body' }
        },
        defaults: {
            showAutoScrollBtn: true,
            showSectionNavBtn: true,
            language: 'en',
            themeColor: '#007AFF',
            themeStyle: 'minimal',
            scrollSpeed: 5,
            showProgressIndicator: true,
            alwaysShowButtons: true,
            iconSet: 'minimal',
            buttonPosition: 'bottom-right'
        },
        iconSets: {
            minimal: {
                settings: '⚙️',      // 齿轮
                section: '📄',       // 文档
                autoscroll: '⏯️',    // 播放/暂停
                scrollTop: '⬆️',     // 向上箭头
                scrollBottom: '⬇️'   // 向下箭头
            },
            colorful: {
                settings: '🎨',      // 调色板
                section: '📖',       // 书本
                autoscroll: '🚀',    // 火箭
                scrollTop: '👆',     // 向上手指
                scrollBottom: '👇'   // 向下手指
            },
            tech: {
                settings: '🔧',      // 扳手
                section: '📊',       // 图表
                autoscroll: '⚡',    // 闪电
                scrollTop: '🔼',     // 三角形上
                scrollBottom: '🔽'   // 三角形下
            },
            forest: {
                settings: '🌿',      // 叶子
                section: '🌳',       // 树
                autoscroll: '🌊',    // 波浪
                scrollTop: '⛰️',     // 山峰
                scrollBottom: '🌱'   // 幼苗
            },
            anime: {
                settings: '✨',      // 星星
                section: '📑',       // 书签
                autoscroll: '🎵',    // 音乐
                scrollTop: '↑',      // 简洁向上箭头
                scrollBottom: '↓'    // 简洁向下箭头
            },
            space: {
                settings: '🛸',      // 飞碟
                section: '🌌',       // 银河
                autoscroll: '🚀',    // 火箭
                scrollTop: '🛰️',     // 卫星
                scrollBottom: '🌠'    // 流星
            },
            sunset: {
                settings: '🌅',      // 日出
                section: '🌇',       // 日落
                autoscroll: '🌤️',    // 晴间多云
                scrollTop: '☀️',     // 太阳
                scrollBottom: '🌙'    // 月亮
            },
            ocean: {
                settings: '🐚',      // 贝壳
                section: '🐬',       // 海豚
                autoscroll: '🌊',    // 波浪
                scrollTop: '⛵',     // 帆船
                scrollBottom: '🐋'    // 鲸鱼
            },
        },
        themes: {
            minimal: {
                name: { en: 'Minimal', zh: '简约风格' },
                bgColor: '#2c2c2e',
                hoverColor: '#444',
                activeColor: 'var(--enh-nav-theme)',
                textColor: 'white',
                shadow: '0 4px 12px rgba(0,0,0,0.3)',
                panelBg: '#1e1e1e',
                panelBorder: '1px solid #e0e0e0',
                selectColor: 'black',
            },
            colorful: {
                name: { en: 'Colorful', zh: '多彩风格' },
                bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
                hoverColor: 'linear-gradient(135deg, #ff6a6e 0%, #f8c0b4 100%)',
                activeColor: 'linear-gradient(135deg, #ff4b50 0%, #f6b0a0 100%)',
                textColor: '#7c4dff',
                shadow: '0 8px 16px rgba(124, 77, 255, 0.4)',
                panelBg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
                panelBorder: '1px solid rgba(124, 77, 255, 0.3)',
                selectColor: 'rgba(255,255,255,0.2)',
            },
            tech: {
                name: { en: 'Tech', zh: '科技风格' },
                bgColor: 'rgba(0, 20, 40, 0.8)',
                hoverColor: 'rgba(0, 100, 200, 0.8)',
                activeColor: 'var(--enh-nav-theme)',
                textColor: '#00e5ff',
                shadow: '0 0 15px rgba(0, 229, 255, 0.7)',
                panelBg: 'rgba(0, 30, 60, 0.95)',
                panelBorder: '1px solid rgba(0, 229, 255, 0.5)',
                selectColor: 'rgba(255,255,255,0.2)',
            },
            forest: {
                name: { en: 'Forest', zh: '森林风格' },
                bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                hoverColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                activeColor: 'linear-gradient(135deg, #2ed573 0%, #1ed6c8 100%)',
                textColor: '#004d40',
                shadow: '0 6px 14px rgba(0, 77, 64, 0.4)',
                panelBg: 'linear-gradient(135deg, #7bc6cc 0%, #be93c5 100%)',
                panelBorder: '1px solid rgba(0, 77, 64, 0.3)',
                selectColor: 'rgba(255,255,255,0.2)',
            },
            anime: {
                name: { en: 'Cute', zh: '可爱风格' },
                bgColor: 'linear-gradient(135deg, #ffcbf2 0%, #e0c3fc 100%)',
                hoverColor: 'linear-gradient(135deg, #ffafcc 0%, #cdb4db 100%)',
                activeColor: 'linear-gradient(135deg, #ff85a1 0%, #b8a1d9 100%)',
                textColor: '#ff006e',
                shadow: '0 8px 20px rgba(255, 0, 110, 0.4)',
                panelBg: 'linear-gradient(135deg, #f6d5f7 0%, #fbe9d7 100%)',
                panelBorder: '1px solid rgba(255, 0, 110, 0.3)',
                selectColor: 'rgba(255,255,255,0.2)',
            },
            space: {
                name: { en: 'Space', zh: '深空风格' },
                bgColor: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                hoverColor: 'linear-gradient(135deg, #1a153e 0%, #3c3570 50%, #2d2950 100%)',
                activeColor: 'linear-gradient(135deg, #241f4d 0%, #463d85 50%, #353153 100%)',
                textColor: '#ffffff',
                shadow: '0 8px 20px rgba(100, 80, 255, 0.5)',
                panelBg: 'linear-gradient(135deg, #1a153e 0%, #3c3570 100%)',
                panelBorder: '1px solid rgba(163, 161, 247, 0.3)',
                selectColor: 'black',
            },
            sunset: {
                name: { en: 'Sunset', zh: '日落风格' },
                bgColor: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
                hoverColor: 'linear-gradient(135deg, #ff6b4a 0%, #fea566 100%)',
                activeColor: 'linear-gradient(135deg, #ff5c38 0%, #fe9a52 100%)',
                textColor: '#3a1c00',
                shadow: '0 8px 20px rgba(255, 126, 95, 0.5)',
                panelBg: 'linear-gradient(135deg, #feb47b 0%, #ff7e5f 100%)',
                panelBorder: '1px solid rgba(139, 69, 19, 0.3)',
                selectColor: 'rgba(255, 255, 255, 0.2)',
            },
            ocean: {
                name: { en: 'Ocean', zh: '海洋风格' },
                bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                hoverColor: 'linear-gradient(135deg, #3a9cfc 0%, #00d9e6 100%)',
                activeColor: 'linear-gradient(135deg, #2b8dfa 0%, #00c0cc 100%)',
                textColor: '#003366',
                shadow: '0 8px 20px rgba(0, 105, 148, 0.4)',
                panelBg: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
                panelBorder: '1px solid rgba(0, 105, 148, 0.3)',
                selectColor: 'rgba(255, 255, 255, 0.2)',
            }
        },
        i18n: {
            zh: {
                // Main Titles & Tooltips
                mainTitle: '导航',
                autoScroll: '自动滚动',
                pauseAutoScroll: '暂停滚动',
                sectionNav: '章节导航',
                settings: '设置',
                scrollToTop: '滚动到顶部',
                scrollToBottom: '滚动到底部',
                // Settings Panel
                settingsTitle: '脚本设置',
                showHideButtons: '显示/隐藏功能按钮',
                showReadingButton: '阅读模式',
                showAutoScrollButton: '自动滚动',
                showSectionNavButton: '章节导航',
                showProgressIndicator: '显示进度指示器',
                alwaysShowButtons: '常驻显示按钮',
                language: '语言',
                themeColor: '主题颜色',
                themeStyle: '主题风格',
                scrollSpeed: '自动滚动速度',
                speedValue: (val) => ({ 1: '很慢', 3: '慢', 5: '中等', 8: '快', 10: '很快' })[val] || '自定义',
                // Section Nav Panel
                navTitle: '页面导航',
                noHeadings: '未找到章节标题。',
                iconSet: '图标风格',
                iconSetMinimal: '简约',
                iconSetColorful: '多彩',
                iconSetTech: '科技',
                iconSetForest: '森林',
                iconSetAnime: '可爱',
                iconSetSpace: '深空',
                iconSetSunset: '日落',
                iconSetOcean: '海洋',
                buttonPosition: '按钮位置',
                positionBottomRight: '右下',
                positionTopRight: '右上',
                positionMiddleRight: '右中'
            },
            en: {
                // Main Titles & Tooltips
                mainTitle: 'Navigate',
                autoScroll: 'Auto-Scroll',
                pauseAutoScroll: 'Pause Auto-Scroll',
                sectionNav: 'Section Nav',
                settings: 'Settings',
                scrollToTop: 'Scroll to Top',
                scrollToBottom: 'Scroll to Bottom',
                // Settings Panel
                settingsTitle: 'Script Settings',
                showHideButtons: 'Show/Hide Buttons',
                showReadingButton: 'Reading Mode',
                showAutoScrollButton: 'Auto-Scroll',
                showSectionNavButton: 'Section Nav',
                showProgressIndicator: 'Show Progress Indicator',
                alwaysShowButtons: 'Always Show Buttons',
                language: 'Language',
                themeColor: 'Theme Color',
                themeStyle: 'Theme Style',
                scrollSpeed: 'Auto-Scroll Speed',
                speedValue: (val) => ({ 1: 'Very Slow', 3: 'Slow', 5: 'Medium', 8: 'Fast', 10: 'Very Fast' })[val] || 'Custom',
                // Section Nav Panel
                navTitle: 'Section Navigation',
                noHeadings: 'No section headings found.',
                iconSet: 'Icon Style',
                iconSetMinimal: 'Minimal',
                iconSetColorful: 'Colorful',
                iconSetTech: 'Tech',
                iconSetForest: 'Forest',
                iconSetAnime: 'Cute',
                iconSetSpace: 'Space',
                iconSetSunset: 'Sunset',
                iconSetOcean: 'Ocean',
                buttonPosition: 'Button Position',
                positionBottomRight: 'Bottom Right',
                positionTopRight: 'Top Right',
                positionMiddleRight: 'Middle Right'
            }
        }
    };

    let STATE = {
        isInitialized: false,
        isAutoScrolling: false,
        isKeyBound: false,
        autoScrollInterval: null,
        scrollContainer: null,
        settings: {},
        currentPlatform: 'generic',
    };

    // --- 2. CORE LOGIC --- //
    /** Gets a setting value, falling back to default */
    function getSetting(key) {
        return GM_getValue(key, CONFIG.defaults[key]);
    }

    /** Handles keyboard shortcuts */
    function handleKeyboardShortcuts(e) {
        // Developer Mode: Alt + m
        if (e.altKey && (e.key === 'm' || e.code === 'KeyM')) {
            e.preventDefault();
            toggleDebugMode();
            return;
        }

        // Original Scroll Logic
        if (e.altKey && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
            if (!STATE.scrollContainer) return;

            const scrollAmount = STATE.scrollContainer.clientHeight * 0.8;

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                STATE.scrollContainer.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                STATE.scrollContainer.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            }
        }
    }

    /** Loads all settings into the STATE object */
    function loadSettings() {
        STATE.settings = {
            showAutoScrollBtn: getSetting('showAutoScrollBtn'),
            showSectionNavBtn: getSetting('showSectionNavBtn'),
            language: getSetting('language'),
            themeColor: getSetting('themeColor'),
            iconSet: getSetting('iconSet'),
            themeStyle: getSetting('themeStyle'),
            scrollSpeed: getSetting('scrollSpeed'),
            showProgressIndicator: getSetting('showProgressIndicator'),
            alwaysShowButtons: getSetting('alwaysShowButtons'),
            buttonPosition: getSetting('buttonPosition')
        };
    }
    /**
 * Helper to safely set innerHTML on sites with Trusted Types (like Gemini)
 */
    function setSafeHTML(element, htmlString) {
        if (window.trustedTypes && window.trustedTypes.createPolicy) {
            // Check if policy already exists to avoid errors
            if (!window.aiChatNavPolicy) {
                try {
                    window.aiChatNavPolicy = window.trustedTypes.createPolicy('aiChatNavPolicy', {
                        createHTML: (string) => string, // We trust this script's content
                    });
                } catch (e) {
                    console.warn('TrustedTypes policy creation failed:', e);
                }
            }
            const policy = window.aiChatNavPolicy;
            element.innerHTML = policy ? policy.createHTML(htmlString) : htmlString;
        } else {
            // Fallback for standard sites
            element.innerHTML = htmlString;
        }
    }

    /** Finds the correct scrollable element on the page */
    function findScrollContainer() {
        const { host } = window.location;
        let platform = 'generic';
        if (host.includes('chatgpt.com')) platform = 'chatgpt';
        else if (host.includes('grok.com')) platform = 'grok';
        else if (host.includes('deepseek.com')) platform = 'deepseek';
        else if (host.includes('qianwen.com')) platform = 'tongyi';
        else if (host.includes('qwen.ai')) platform = 'qwen';
        else if (host.includes('gemini')) platform = 'gemini';
        else if (host.includes('doubao')) platform = 'doubao';
        STATE.currentPlatform = platform;

        const selector = CONFIG.platforms[platform].container;
        if (platform === 'deepseek' || platform === 'tongyi' ) {
            const containers = document.querySelectorAll(selector);
            if (platform === 'deepseek' ){return containers[2]}
            return containers.length > 1 ? containers[1] : containers[0];
        }
        // console.log('Using selector for platform:', platform, selector,document.querySelector(selector));
        return platform === 'generic' ? (document.scrollingElement || document.documentElement) : document.querySelector(selector);
    }

    /** Handles the main scroll button click */
    function handleScrollClick() {
        if (!STATE.scrollContainer) return;
        const isNearTop = STATE.scrollContainer.scrollTop < 100;
        STATE.scrollContainer.scrollTo({
            top: isNearTop ? STATE.scrollContainer.scrollHeight : 0,
            behavior: 'smooth'
        });
    }

    function updateIcons() {
        const iconSet = CONFIG.iconSets[STATE.settings.iconSet] || CONFIG.iconSets.minimal;

        const settingsBtn = document.getElementById('enh-nav-settings-btn');
        if (settingsBtn) settingsBtn.textContent = iconSet.settings;

        const sectionBtn = document.getElementById('enh-nav-section-btn');
        if (sectionBtn) sectionBtn.textContent = iconSet.section;

        const autoscrollBtn = document.getElementById('enh-nav-autoscroll-btn');
        if (autoscrollBtn) autoscrollBtn.textContent = iconSet.autoscroll;

        updateScrollArrow();
    }


    function updateScrollArrow() {
        if (!STATE.scrollContainer) return;

        const arrowEl = document.getElementById('enh-nav-scroll-arrow');
        const iconSet = CONFIG.iconSets[STATE.settings.iconSet] || CONFIG.iconSets.minimal;

        const isNearTop = STATE.scrollContainer.scrollTop < 100;
        if (arrowEl) arrowEl.textContent = isNearTop ? iconSet.scrollBottom : iconSet.scrollTop;
    }


    /** Toggles Auto-Scroll */
    function toggleAutoScroll() {
        STATE.isAutoScrolling = !STATE.isAutoScrolling;
        const btn = document.getElementById('enh-nav-autoscroll-btn');
        if (btn) btn.classList.toggle('active', STATE.isAutoScrolling);

        if (STATE.isAutoScrolling) {
            STATE.autoScrollInterval = setInterval(() => {
                if (!STATE.scrollContainer) return;
                const atBottom = STATE.scrollContainer.scrollTop + STATE.scrollContainer.clientHeight >= STATE.scrollContainer.scrollHeight - 2;
                if (atBottom) {
                    toggleAutoScroll(); // Stop scrolling
                } else {
                    const scrollAmount = Math.max(1, STATE.settings.scrollSpeed / 5);
                    STATE.scrollContainer.scrollBy(0, scrollAmount);
                }
            }, 20);
        } else {
            clearInterval(STATE.autoScrollInterval);
        }
        updateUIText(); // Update title
    }

    /** Applies the selected button position */
    function applyButtonPosition(position) {
        const container = document.getElementById('enh-nav-container');
        const hoverArea = document.getElementById('enh-nav-hover-area');

        if (!container || !hoverArea) return;

        container.classList.remove(
            'enh-nav-pos-bottom-right',
            'enh-nav-pos-top-right',
            'enh-nav-pos-middle-right'
        );

        hoverArea.classList.remove(
            'enh-nav-pos-bottom-right',
            'enh-nav-pos-top-right',
            'enh-nav-pos-middle-right'
        );

        container.classList.add(`enh-nav-pos-${position}`);
        hoverArea.classList.add(`enh-nav-pos-${position}`);

        updatePanelPositions(position);
    }

    /** Updates panel positions based on button position */
    function updatePanelPositions(position) {
        const panels = document.querySelectorAll('.enh-nav-panel');

        panels.forEach(panel => {
            panel.classList.remove(
                'enh-nav-pos-bottom-right',
                'enh-nav-pos-top-right',
                'enh-nav-pos-middle-right'
            );

            panel.classList.add(`enh-nav-pos-${position}`);
        });
    }

    /** Updates the UI text based on the current language without reloading */
    function updateUIText() {
        const lang = STATE.settings.language;
        const translations = CONFIG.i18n[lang];

        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.dataset.i18nKey;
            const prop = el.dataset.i18nProp || 'textContent';
            if (translations[key]) el[prop] = translations[key];
        });

        // fix theme style lang not change
        const themeSelect = document.getElementById('enh-nav-theme-style');
        if (themeSelect) {
            Array.from(themeSelect.options).forEach(option => {
                const themeId = option.value;
                const theme = CONFIG.themes[themeId];
                if (theme) {
                    option.textContent = theme.name[lang] || theme.name.en;
                }
            });
        }

        const autoScrollBtn = document.getElementById('enh-nav-autoscroll-btn');
        if (autoScrollBtn) autoScrollBtn.title = STATE.isAutoScrolling ? translations.pauseAutoScroll : translations.autoScroll;

        const mainBtn = document.getElementById('enh-nav-main-btn');
        if (mainBtn && STATE.scrollContainer) {
            const isNearTop = STATE.scrollContainer.scrollTop < 100;
            mainBtn.title = isNearTop ? translations.scrollToBottom : translations.scrollToTop;
        }

        // Update speed value text
        const speedValueEl = document.getElementById('enh-nav-speed-value');
        if (speedValueEl) {
            speedValueEl.textContent = translations.speedValue(STATE.settings.scrollSpeed);
        }
    }
    function getScrollableElements() {
        const all = Array.from(document.querySelectorAll('*'));
        const scrollables = [];

        all.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || el.offsetParent === null) return;

          const overflowY = style.overflowY;
          const overflowX = style.overflowX;

          const canScrollY = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && el.scrollHeight > el.clientHeight + 1;
          const canScrollX = (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') && el.scrollWidth > el.clientWidth + 1;

          if (canScrollY || canScrollX) {
            scrollables.push(el);
          }
        });

        return scrollables;
      }
    /** Generate a usable CSS selector for an element */
    function getCssSelector(el) {
        if (!el) return '';
        let path = [];
        while (el.nodeType === Node.ELEMENT_NODE) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += '#' + el.id;
                path.unshift(selector);
                break; // ID is usually unique enough
            } else {
                let sib = el, nth = 1;
                while (sib = sib.previousElementSibling) {
                    if (sib.nodeName.toLowerCase() == selector) nth++;
                }
                if (nth != 1) selector += ":nth-of-type(" + nth + ")";
            }
            if (el.className && typeof el.className === 'string') {
                const classes = el.className.trim().split(/\s+/).filter(c => !c.startsWith('enh-') && !c.includes(':'));
                if (classes.length > 0) {
                     selector += '.' + classes.join('.');
                }
            }
            path.unshift(selector);
            el = el.parentNode;
            if (el.id === 'enh-nav-container' || el === document.body) break;
        }
        return path.join(' > ');
    }

    /** Create and Toggle the Debug Panel */
    function toggleDebugMode() {
        let panel = document.getElementById('enh-debug-panel');

        // Create panel if it doesn't exist
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'enh-debug-panel';

            const panelHTML = `
                <div class="enh-debug-header">
                    <strong>🔍 Scroll Element Detector (Dev Mode)</strong>
                    <button class="enh-nav-btn" style="width:30px;height:30px;font-size:14px;" id="enh-debug-close">✕</button>
                </div>
                <div class="enh-debug-content" id="enh-debug-list"></div>
            `;
            setSafeHTML(panel, panelHTML); // 使用 setSafeHTML

            document.body.appendChild(panel);

            document.getElementById('enh-debug-close').onclick = () => {
                panel.classList.remove('visible');
                removeHighlights();
            };
        }

        if (panel.classList.contains('visible')) {
            panel.classList.remove('visible');
            removeHighlights();
            return;
        }

        // Show Panel and Scan
        panel.classList.add('visible');
        scanAndPopulateDebug(panel);
    }

    /** Scan for scrollable elements and populate the list */
    function scanAndPopulateDebug(panel) {
        const list = document.getElementById('enh-debug-list');
        setSafeHTML(list, ''); // 清空内容
        removeHighlights();

        // Reuse your existing getScrollableElements function
        const scrollables = getScrollableElements();

        if (scrollables.length === 0) {
            setSafeHTML(list, '<div style="padding:20px;text-align:center;color:#888">No scrollable elements found.</div>');
            return;
        }

        scrollables.forEach((el, index) => {
            const selector = getCssSelector(el);
            const rect = el.getBoundingClientRect();
            const isVisible = rect.width > 0 && rect.height > 0;

            const item = document.createElement('div');
            item.className = 'enh-debug-item';

            // Build visual info
            let classText = el.className && typeof el.className === 'string' ? '.' + el.className.split(' ').slice(0, 2).join('.') : '';
            if(classText.length > 30) classText = classText.substring(0, 30) + '...';

            const itemHTML = `
                <div style="margin-right:10px;font-weight:bold;color:#aaa">#${index + 1}</div>
                <div class="enh-debug-info">
                    <span class="enh-debug-tag">${el.tagName.toLowerCase()}</span>
                    <span class="enh-debug-id">${el.id ? '#' + el.id : ''}</span>
                    <span class="enh-debug-class">${classText}</span>
                    <div style="font-size:10px;color:#666;margin-top:2px;">
                        H:${Math.round(rect.height)}px | ScrollH:${el.scrollHeight}px | ${isVisible ? 'Visible' : 'Hidden'}
                    </div>
                </div>
                <div class="enh-debug-actions">
                    <button class="copy-btn">Copy CSS</button>
                </div>
            `;
            setSafeHTML(item, itemHTML); // 使用 setSafeHTML

            // Events
            item.addEventListener('mouseenter', () => highlightElement(el));
            item.addEventListener('mouseleave', () => removeHighlights());
            item.querySelector('.copy-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(selector);
                const btn = e.target;
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy CSS', 1000);
            });
            item.addEventListener('click', () => {
                console.log('Selected Element:', el);
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Flash highlight
                highlightElement(el);
            });

            list.appendChild(item);
        });
    }

    /** Visual Helper for Debug Mode */
    let currentHighlight = null;
    function highlightElement(el) {
        removeHighlights();
        const rect = el.getBoundingClientRect();
        const div = document.createElement('div');
        div.className = 'enh-debug-highlight-overlay';
        div.style.left = rect.left + 'px';
        div.style.top = rect.top + 'px';
        div.style.width = rect.width + 'px';
        div.style.height = rect.height + 'px';
        document.body.appendChild(div);
        currentHighlight = div;
    }

    function removeHighlights() {
        if (currentHighlight) {
            currentHighlight.remove();
            currentHighlight = null;
        }
        document.querySelectorAll('.enh-debug-highlight-overlay').forEach(e => e.remove());
    }

    // --- 3. UI CREATION & UPDATES --- //

    /** Injects all CSS into the page */
    function injectStyles() {
        const theme = CONFIG.themes[STATE.settings.themeStyle] || CONFIG.themes.minimal;

        GM_addStyle(`
        :root {
    --enh-nav-theme: ${STATE.settings.themeColor};
    --enh-nav-bg: ${theme.bgColor};
    --enh-nav-hover: ${theme.hoverColor};
    --enh-nav-active: ${theme.activeColor};
    --enh-nav-text: ${theme.textColor};
    --enh-nav-shadow: ${theme.shadow};
    --enh-nav-panel-bg: ${theme.panelBg};
    --enh-nav-panel-border: ${theme.panelBorder};
    --enh-nav-select: ${theme.selectColor};
}

#enh-nav-container {
    position: fixed;
    right: 15px;
    bottom: 15px;
    z-index: 99999;
    display: flex !important;
    flex-direction: column;
    align-items: center;
    transition: opacity 0.3s ease;
}

#enh-nav-container.hidden {
    opacity: 0;
    pointer-events: none;
}

#enh-nav-container:hover,
#enh-nav-container.always-visible {
    opacity: 1;
    pointer-events: auto;
}

#enh-nav-hover-area {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 60px;
    height: 60px;
    z-index: 99998;
}

.enh-nav-btn {
    background: var(--enh-nav-bg);
    color: var(--enh-nav-text);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    border: none;
    box-shadow: var(--enh-nav-shadow);
    transition: all 0.3s ease;
    user-select: none;
}

.enh-nav-btn:hover {
    transform: scale(1.1);
    background: var(--enh-nav-hover);
}

.enh-nav-btn.active {
    background: var(--enh-nav-active);
}

#enh-nav-main-btn {
    position: relative;
    font-weight: bold;
}

#enh-nav-progress-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

#enh-nav-progress-circle-bar {
    stroke: var(--enh-nav-theme);
    stroke-width: 4;
    fill: transparent;
    transition: stroke-dashoffset 0.1s linear;
}

#enh-nav-progress-text {
    font-size: 12px;
    font-weight: bold;
    color: var(--enh-nav-text);
}

#enh-nav-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: bottom center;
    transform: scale(0.8) translateY(20px);
    opacity: 0;
    pointer-events: none;
}

#enh-nav-container:hover #enh-nav-menu {
    transform: scale(1) translateY(0);
    opacity: 1;
    pointer-events: auto;
}

.enh-nav-menu-btn {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-top: 10px;
}

.enh-nav-panel {
    position: fixed;
    right: 80px;
    bottom: 15px;
    width: 180px;
    background: var(--enh-nav-panel-bg);
    color: var(--enh-nav-text);
    border-radius: 16px;
    padding: 12px;
    box-shadow: var(--enh-nav-shadow);
    border: var(--enh-nav-panel-border);
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 99998;
    backdrop-filter: blur(10px);
}

.enh-nav-panel.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
}

.enh-nav-panel h3 {
    margin: 0 0 8px;
    font-size: 14px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
    padding-bottom: 10px;
    text-align: center;
}

.enh-nav-panel .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
    font-size: 16px;
    opacity: 0.7;
    transition: all 0.2s;
}

.enh-nav-panel .close-btn:hover {
    opacity: 1;
    transform: scale(1.1);
}

.enh-nav-setting-row {
    margin-bottom: 5px;
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.enh-nav-setting-row label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    width: 100%;
}

.enh-nav-panel input[type=checkbox] {
    transform: scale(1.2);
    accent-color: var(--enh-nav-theme);
}

.enh-nav-panel input[type=color] {
    width: 40px;
    height: 25px;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
}

.enh-nav-panel input[type=range] {
    width: 100%;
    margin-top: 5px;
    accent-color: var(--enh-nav-theme);
}

.enh-nav-panel select {
    background: var(--enh-nav-select);
    color: var(--enh-nav-text);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    padding: 5px 10px;
    cursor: pointer;
}

#enh-nav-section-panel {
    width: 350px;
    height: 500px;
    max-height: 70vh;
    right: 90px;
    transform: translateX(30px) scale(0.95);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#enh-nav-section-panel.visible {
    transform: translateX(0) scale(1);
}

#enh-nav-section-panel ul {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: calc(100% - 60px);
    overflow-x: hidden;
    overflow-y: auto;
}

#enh-nav-section-panel ul::-webkit-scrollbar {
    width: 8px;
}

#enh-nav-section-panel ul::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

#enh-nav-section-panel ul::-webkit-scrollbar-thumb {
    background: var(--enh-nav-theme);
    border-radius: 4px;
}

#enh-nav-section-panel ul::-webkit-scrollbar-thumb:hover {
    background: var(--enh-nav-active);
}

#enh-nav-section-panel li {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 12px 15px;
    cursor: pointer;
    border-radius: 10px;
    font-size: 14px;
    margin-bottom: 8px;
    transition: all 0.3s ease;
    background: rgba(255,255,255,0.05);
    opacity: 0;
    transform: translateY(10px);
    transition-delay: calc(var(--index, 0) * 0.05s);
}

#enh-nav-section-panel.visible li {
    opacity: 1;
    transform: translateY(0);
}

#enh-nav-section-panel li:hover {
    background-color: var(--enh-nav-theme);
    color: white;
    transform: translateX(5px) translateY(0);
}

#enh-nav-section-panel li[data-i18n-key="noHeadings"] {
    text-align: center;
    padding: 30px;
    font-size: 16px;
    opacity: 0.7;
    white-space: normal;
    transform: none;
}

.theme-preview {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
    vertical-align: middle;
}

.speed-container {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

/* 位置样式 */
#enh-nav-container.enh-nav-pos-bottom-right {
    right: 15px;
    bottom: 15px;
    top: auto;
    transform: none;
}

#enh-nav-container.enh-nav-pos-top-right {
    right: 15px;
    top: 15px;
    bottom: auto;
    transform: none;
}

#enh-nav-container.enh-nav-pos-middle-right {
    right: 15px;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
}

/* 菜单方向 */
#enh-nav-container.enh-nav-pos-bottom-right #enh-nav-menu {
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 0;
}

#enh-nav-container.enh-nav-pos-top-right #enh-nav-menu,
#enh-nav-container.enh-nav-pos-middle-right #enh-nav-menu {
    flex-direction: column-reverse;
    margin-bottom: 0;
    margin-top: 10px;
}

#enh-nav-container.enh-nav-pos-top-right:hover #enh-nav-menu,
#enh-nav-container.enh-nav-pos-middle-right:hover #enh-nav-menu {
    transform: scale(1) translateY(0);
}

/* 面板位置 */
#enh-nav-container.enh-nav-pos-bottom-right .enh-nav-panel {
    bottom: 15px;
    top: auto;
}

#enh-nav-container.enh-nav-pos-top-right .enh-nav-panel {
    top: 15px;
    bottom: auto;
}

#enh-nav-container.enh-nav-pos-middle-right .enh-nav-panel {
    top: 50%;
    bottom: auto;
    transform: translateX(20px) translateY(-50%);
}

#enh-nav-container.enh-nav-pos-middle-right .enh-nav-panel.visible {
    transform: translateX(0) translateY(-50%);
}

/* 悬停区域位置 */
#enh-nav-hover-area.enh-nav-pos-bottom-right {
    right: 0;
    bottom: 0;
    top: auto;
}

#enh-nav-hover-area.enh-nav-pos-top-right {
    right: 0;
    top: 0;
    bottom: auto;
}

#enh-nav-hover-area.enh-nav-pos-middle-right {
    right: 0;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
}
/* 按钮位置样式*/
#enh-nav-container.enh-nav-pos-bottom-right {
    right: 15px;
    bottom: 15px;
    top: auto;
    transform: none;
}

#enh-nav-container.enh-nav-pos-top-right {
    right: 15px;
    top: 15px;
    bottom: auto;
    transform: none;
}

#enh-nav-container.enh-nav-pos-middle-right {
    right: 15px;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
}

/* 调整菜单方向 */
#enh-nav-container.enh-nav-pos-bottom-right #enh-nav-menu {
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 0;
}

#enh-nav-container.enh-nav-pos-top-right #enh-nav-menu {
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 0;
}

#enh-nav-container.enh-nav-pos-middle-right #enh-nav-menu {
    flex-direction: column;
    margin-bottom: 10px;
    margin-top: 0;
}

/* 调整面板位置 */
#enh-nav-container.enh-nav-pos-bottom-right .enh-nav-panel {
    right: 80px;
    bottom: 15px;
    top: auto;
}

#enh-nav-container.enh-nav-pos-top-right .enh-nav-panel {
    right: 80px;
    top: 80px; /* 在按钮下方 */
    bottom: auto;
}

#enh-nav-container.enh-nav-pos-middle-right .enh-nav-panel {
    right: 80px;
    top: calc(50% + 40px); /* 在按钮下方 */
    bottom: auto;
    transform: translateX(20px) translateY(-50%);
}

#enh-nav-container.enh-nav-pos-middle-right .enh-nav-panel.visible {
    transform: translateX(0) translateY(-50%);
}

/* 确保面板在正确位置 */
.enh-nav-panel {
    transform: translateX(20px);
}

.enh-nav-panel.visible {
    transform: translateX(0);
}

/* 调整悬停区域位置 */
#enh-nav-hover-area.enh-nav-pos-bottom-right {
    right: 0;
    bottom: 0;
    top: auto;
    width: 80px;
    height: 80px;
}

#enh-nav-hover-area.enh-nav-pos-top-right {
    right: 0;
    top: 0;
    bottom: auto;
    width: 80px;
    height: 80px;
}

#enh-nav-hover-area.enh-nav-pos-middle-right {
    right: 0;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
    width: 80px;
    height: 80px;
}

/* Style for the container of KaTeX elements */
/* ds-deepseek*/
.katex-display, .ds-markdown-math, .katex, .math-inline, .math-block {
    position: relative;
    display: inline-block; /* Ensure inline wrappers can hold absolute buttons properly */
}
/* Specific fix for block containers to remain block-like */
.katex-display, .ds-markdown-math, .math-block {
    display: block;
}
/* Style for the new copy button */
.katex-copy-btn {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: #555;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 12px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
}

/* Show the button when hovering over the KaTeX element */
.katex-display:hover > .katex-copy-btn,
.ds-markdown-math:hover > .katex-copy-btn,
.katex:hover > .katex-copy-btn,
.math-inline:hover > .katex-copy-btn,
.math-block:hover > .katex-copy-btn {
    opacity: 1;
}
/* Style for the button after the code has been copied */
.katex-copy-btn.copied {
    background-color: #007AFF;
}
/* --- DEBUG PANEL STYLES (Developer Mode) --- */
#enh-debug-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    max-height: 80vh;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid #00e5ff;
    border-radius: 12px;
    z-index: 1000000;
    color: #fff;
    font-family: monospace;
    display: none;
    flex-direction: column;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);
}

#enh-debug-panel.visible {
    display: flex;
}

.enh-debug-header {
    padding: 15px;
    border-bottom: 1px solid #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 229, 255, 0.1);
}

.enh-debug-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

.enh-debug-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid #333;
    cursor: pointer;
    transition: background 0.2s;
}

.enh-debug-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.enh-debug-info {
    flex: 1;
    overflow: hidden;
}

.enh-debug-tag {
    color: #ff79c6;
    font-weight: bold;
}

.enh-debug-id {
    color: #50fa7b;
}

.enh-debug-class {
    color: #8be9fd;
}

.enh-debug-actions button {
    background: #444;
    border: 1px solid #666;
    color: white;
    padding: 2px 8px;
    margin-left: 5px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 12px;
}

.enh-debug-actions button:hover {
    background: #00e5ff;
    color: black;
}

.enh-debug-highlight-overlay {
    position: fixed;
    border: 2px solid #ff00ff;
    background: rgba(255, 0, 255, 0.1);
    z-index: 999999;
    pointer-events: none;
    transition: all 0.2s;
}
        `);
    }

    /** Creates the main UI elements */
    function createUI() {
        const container = document.createElement('div');
        container.id = 'enh-nav-container';

        if (!STATE.settings.alwaysShowButtons) {
            container.classList.add('hidden');
        } else {
            container.classList.add('always-visible');
        }

        const hoverArea = document.createElement('div');
        hoverArea.id = 'enh-nav-hover-area';
        hoverArea.classList.add(`enh-nav-pos-${STATE.settings.buttonPosition || 'bottom-right'}`);
        document.body.appendChild(hoverArea);

        const progressRadius = 22;
        const progressCircumference = 2 * Math.PI * progressRadius;

        const uiHTML = `
            <!-- Menu Buttons (appear on hover) -->
            <div id="enh-nav-menu">
                <button id="enh-nav-settings-btn" class="enh-nav-btn enh-nav-menu-btn" title="Settings" data-i18n-prop="title" data-i18n-key="settings">⚙️</button>
                <button id="enh-nav-section-btn" class="enh-nav-btn enh-nav-menu-btn" title="Section Nav" data-i18n-prop="title" data-i18n-key="sectionNav">📄</button>
                <button id="enh-nav-autoscroll-btn" class="enh-nav-btn enh-nav-menu-btn" title="Auto-Scroll" data-i18n-prop="title" data-i18n-key="autoScroll">⏯️</button>
            </div>

            <!-- Main Scroll Button -->
            <button id="enh-nav-main-btn" class="enh-nav-btn" title="Scroll to Bottom">
                <span id="enh-nav-scroll-arrow">⬇️</span>
                <span id="enh-nav-progress-text">0%</span>
                <svg id="enh-nav-progress-circle" width="48" height="48">
                    <circle id="enh-nav-progress-circle-bar" r="${progressRadius}" cx="24" cy="24" stroke-dasharray="${progressCircumference}" stroke-dashoffset="${progressCircumference}"></circle>
                </svg>
            </button>

            <!-- Settings Panel -->
            <div id="enh-nav-settings-panel" class="enh-nav-panel" enh-nav-pos-${STATE.settings.buttonPosition || 'bottom-right'}">
                <span class="close-btn">✖️</span>
                <h3 data-i18n-key="settingsTitle">Script Settings</h3>
                <div class="enh-nav-setting-row">
                    <label><span data-i18n-key="language">Language</span>
                        <select id="enh-nav-lang-select">
                            <option value="en">English</option>
                            <option value="zh">中文</option>
                        </select>
                    </label>
                </div>
                <div class="enh-nav-setting-row">
                    <label><span data-i18n-key="themeStyle">Theme Style</span>
                    <select id="enh-nav-theme-style">
                    ${Object.entries(CONFIG.themes).map(([id, theme]) =>
            `<option value="${id}">${theme.name[STATE.settings.language] || theme.name.en}</option>`
        ).join('')}
                    </select>
                    </label>
                </div>
                <div class="enh-nav-setting-row">
                    <label><span data-i18n-key="iconSet">Icon Style</span>
                        <select id="enh-nav-icon-set">
                            <option value="minimal" data-i18n-key="iconSetMinimal">Minimal</option>
                            <option value="colorful" data-i18n-key="iconSetColorful">Colorful</option>
                            <option value="tech" data-i18n-key="iconSetTech">Tech</option>
                            <option value="forest" data-i18n-key="iconSetForest">Forest</option>
                            <option value="anime" data-i18n-key="iconSetAnime">Anime</option>
                            <option value="space" data-i18n-key="iconSetSpace">Space</option>
                            <option value="sunset" data-i18n-key="iconSetSunset">Sunset</option>
                            <option value="ocean" data-i18n-key="iconSetOcean">Ocean</option>
                        </select>
                    </label>
                </div>
                <div class="enh-nav-setting-row">
                    <label><span data-i18n-key="themeColor">Theme Color</span><input type="color" id="enh-nav-theme-color"></label>
                </div>
                <div class="enh-nav-setting-row">
                     <label><span data-i18n-key="scrollSpeed">Scroll Speed</span> <span id="enh-nav-speed-value"></span></label>
                     <div class="speed-container">
                         <input type="range" id="enh-nav-scroll-speed" min="1" max="10" step="1">
                     </div>
                </div>
            <div class="enh-nav-setting-row">
                <strong data-i18n-key="showHideButtons">Show/Hide Buttons</strong>
            </div>
            <div class="enh-nav-setting-row">
                <label><span data-i18n-key="showAutoScrollButton">Auto-Scroll</span><input type="checkbox" id="enh-nav-toggle-autoscroll"></label>
            </div>
            <div class="enh-nav-setting-row">
                <label><span data-i18n-key="showSectionNavButton">Section Nav</span><input type="checkbox" id="enh-nav-toggle-section"></label>
            </div>
            <div class="enh-nav-setting-row">
                <label><span data-i18n-key="showProgressIndicator">Show Progress Indicator</span><input type="checkbox" id="enh-nav-toggle-progress"></label>
            </div>
            <div class="enh-nav-setting-row">
                <label><span data-i18n-key="alwaysShowButtons">Always Show Buttons</span><input type="checkbox" id="enh-nav-toggle-always-show"></label>
            </div>
            <div class="enh-nav-setting-row">
            <label><span data-i18n-key="buttonPosition">Button Position</span>
                <select id="enh-nav-button-position">
                    <option value="bottom-right" data-i18n-key="positionBottomRight">Bottom Right</option>
                    <option value="top-right" data-i18n-key="positionTopRight">Top Right</option>
                    <option value="middle-right" data-i18n-key="positionMiddleRight">Middle Right</option>
                </select>
            </label>
            </div>
            </div>

            <!-- Section Nav Panel -->
            <div id="enh-nav-section-panel" class="enh-nav-panel" enh-nav-pos-${STATE.settings.buttonPosition || 'bottom-right'}">
                 <span class="close-btn">✖️</span>
                 <span id="enh-nav-collapse-toggle" title="Collapse/Expand Levels" style="position: absolute; top: 15px; right: 45px; cursor: pointer; font-size: 16px; user-select: none;">🔽</span>
                 <h3 data-i18n-key="navTitle">Page Navigation</h3>
                 <ul id="enh-nav-section-list"></ul>
            </div>
        `;
        setSafeHTML(container, uiHTML);
        document.body.appendChild(container);
        // Apply initial visibility from settings
        document.getElementById('enh-nav-autoscroll-btn').style.display = STATE.settings.showAutoScrollBtn ? 'flex' : 'none';
        document.getElementById('enh-nav-section-btn').style.display = STATE.settings.showSectionNavBtn ? 'flex' : 'none';

        // Apply initial progress indicator setting
        updateProgressIndicatorVisibility();
    }

    /** Updates the circular progress bar and scroll direction arrow */
    function updateScrollState() {
        if (!STATE.scrollContainer) return;
        const { scrollTop, scrollHeight, clientHeight } = STATE.scrollContainer;
        const scrollableHeight = scrollHeight - clientHeight;

        const arrowEl = document.getElementById('enh-nav-scroll-arrow');
        const textEl = document.getElementById('enh-nav-progress-text');
        const circleBar = document.getElementById('enh-nav-progress-circle-bar');

        if (scrollableHeight <= 0) {
            if (arrowEl) arrowEl.style.display = 'block';
            if (textEl) textEl.style.display = 'none';
            if (arrowEl) arrowEl.textContent = '↕️';
            return;
        }

        const percent = Math.min(Math.round((scrollTop / scrollableHeight) * 100), 100);
        const isNearTop = scrollTop < 100;
        const isNearBottom = scrollTop > scrollableHeight - 100;

        // Show arrow or percentage based on settings
        const showProgress = STATE.settings.showProgressIndicator;

        if (isNearTop || isNearBottom || !showProgress) {
            if (arrowEl) arrowEl.style.display = 'block';
            if (textEl) textEl.style.display = 'none';
            if (arrowEl) arrowEl.textContent = isNearTop ? '⬇️' : '⬆️';
        } else {
            if (arrowEl) arrowEl.style.display = 'none';
            if (textEl) textEl.style.display = 'block';
            if (textEl) textEl.textContent = `${percent}%`;
        }

        // Update progress circle
        if (circleBar) {
            const radius = circleBar.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percent / 100) * circumference;
            circleBar.style.strokeDashoffset = offset;
        }

        // Update main button title for accessibility
        updateScrollArrow();
        updateUIText();
    }

    /** Updates progress indicator visibility based on setting */
    function updateProgressIndicatorVisibility() {
        const textEl = document.getElementById('enh-nav-progress-text');
        const circleBar = document.getElementById('enh-nav-progress-circle-bar');
        const showProgress = STATE.settings.showProgressIndicator;

        if (textEl && circleBar) {
            textEl.style.display = showProgress ? 'block' : 'none';
            circleBar.style.display = showProgress ? 'block' : 'none';
        }
        updateScrollState(); // Refresh the display
    }

    /** Populates the section navigation panel */
    function updateSectionNav() {
        const list = document.getElementById('enh-nav-section-list');
        // Scope heading search to the active scroll container instead of entire document
        const root = STATE.scrollContainer || document;
        const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6'); // 包含所有标题级别

        if (list) list.textContent = '';

        if (headings.length === 0) {
            setSafeHTML(list, `<li data-i18n-key="noHeadings" style="opacity: 0.6; text-align: center; padding: 30px;">
                ${CONFIG.i18n[STATE.settings.language].noHeadings}
            </li>`);
            return;
        }

        let hasValidHeadings = false;
        let index = 0;
        // Reset collapse button state when refreshing
        const collapseBtn = document.getElementById('enh-nav-collapse-toggle');
        if (collapseBtn) collapseBtn.textContent = '🔽';

        headings.forEach(h => {
            const text = h.textContent.trim();
            // 简单的 ID 生成逻辑，避免特殊字符报错
            const id = h.id || h.textContent.toLowerCase().replace(/\s+/g, '-');

            if (text === '') return;
            if (h.className && typeof h.className === 'string') {
                const cls = h.className.toLowerCase();
                if (cls.includes('sr-only') ||
                    cls.includes('visually-hidden') ||
                    cls.includes('invisible') ||
                    cls.includes('w-px') || // Tailwind often uses w-px h-px for sr-only
                    cls.includes('h-px')) return;
            }
            hasValidHeadings = true;

            const item = document.createElement('li');
            item.textContent = text;

            const level = parseInt(h.tagName.substring(1));
            // Store level in dataset for filtering
            item.dataset.level = level;

            item.style.paddingLeft = `${(level - 1) * 15 + 15}px`;
            item.style.fontSize = `${18 - level * 2}px`;
            item.style.fontWeight = level <= 2 ? 'bold' : 'normal';

            item.style.setProperty('--index', index);
            index++;
            item.addEventListener('mouseenter', () => {
                h.style.transition = 'background-color 0.2s';
                h.style.backgroundColor = 'var(--enh-nav-theme)';
            });

            item.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    h.style.backgroundColor = '';
                }, 200);
            });

            item.onclick = () => {
                const element = document.getElementById(id) || h;
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = 'var(--enh-nav-theme)';
                element.style.transition = 'background-color 0.3s';
            };

            list.appendChild(item);
        });

        if (headings.length === 0) {
            setSafeHTML(list, `<li data-i18n-key="noHeadings" style="opacity: 0.6; text-align: center; padding: 30px;">
                ${CONFIG.i18n[STATE.settings.language].noHeadings}
            </li>`);
            return;
        }
    }
    /** Toggles the visibility of a panel */
    function togglePanel(panelId, forceState) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        // Hide other panels
        // document.querySelectorAll('.enh-nav-panel').forEach(p => {
        //     if (p.id !== panelId) p.classList.remove('visible');
        // });
        const isVisible = panel.classList.toggle('visible', forceState);
        // Toggle current panel
        // If we are opening the section nav, refresh its content
        if (isVisible && panelId === 'enh-nav-section-panel') {
            updateSectionNav();
        }
    }

    function addCopyToKatexElements() {
        // Find all potential KaTeX containers: block display, inline, DeepSeek, and Gemini specific containers
        const katexElements = document.querySelectorAll('.katex-display, .katex, .ds-markdown-math, .math-inline, .math-block');

        katexElements.forEach(el => {
            // Check if a button has already been added to this element
            if (el.querySelector('.katex-copy-btn')) {
                return;
            }

            // Avoid duplication: if this element is inside another recognized block/wrapper, let the parent handle it.
            const parentBlock = el.parentElement.closest('.katex-display, .ds-markdown-math, .math-inline, .math-block');
            if (parentBlock && parentBlock !== el) {
                return;
            }

            // Strategy 1: Gemini/Google uses data-math attribute on the wrapper
            let latexCode = el.getAttribute('data-math');

            // Strategy 2: Standard KaTeX uses annotation tag
            if (!latexCode) {
                const annotation = el.querySelector('annotation[encoding="application/x-tex"]');
                if (annotation) {
                    latexCode = annotation.textContent;
                }
            }

            if (latexCode) {
                // Create the copy button
                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy';
                copyBtn.className = 'katex-copy-btn';

                // Add the click event listener to copy the code
                copyBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent affecting parent click events
                    navigator.clipboard.writeText(latexCode).then(() => {
                        // Provide feedback to the user
                        const originalText = copyBtn.textContent;
                        copyBtn.textContent = 'Copied!';
                        copyBtn.classList.add('copied');

                        // Reset the button text after 2 seconds
                        setTimeout(() => {
                            copyBtn.textContent = originalText;
                            copyBtn.classList.remove('copied');
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy KaTeX code: ', err);
                        copyBtn.textContent = 'Error';
                    });
                });

                // Append the button to the KaTeX element
                el.appendChild(copyBtn);
            }
        });
    }

    /** Applies the selected theme style */
    function applyThemeStyle(themeId) {
        STATE.settings.themeStyle = themeId;
        GM_setValue('themeStyle', themeId);
        injectStyles(); // Re-inject styles with the new theme
    }


    // --- 4. EVENT LISTENERS --- //

    /** Binds all event listeners to the UI */
    function attachEventListeners() {
        // Main Actions
        document.getElementById('enh-nav-main-btn').addEventListener('click', handleScrollClick);
        document.getElementById('enh-nav-autoscroll-btn').addEventListener('click', toggleAutoScroll);

        // Panel Toggles
        document.getElementById('enh-nav-settings-btn').addEventListener('click', () => togglePanel('enh-nav-settings-panel'));
        document.getElementById('enh-nav-section-btn').addEventListener('click', () => togglePanel('enh-nav-section-panel'));

        // Collapse/Expand Toggle Logic
        const collapseToggle = document.getElementById('enh-nav-collapse-toggle');
        if (collapseToggle) {
            collapseToggle.addEventListener('click', (e) => {
                const btn = e.target;
                const list = document.getElementById('enh-nav-section-list');
                if (!list) return;

                const isCurrentlyExpanded = btn.textContent === '🔽';
                btn.textContent = isCurrentlyExpanded ? '▶️' : '🔽'; // Toggle Icon

                Array.from(list.children).forEach(li => {
                    // Always show Level 1 and Level 2 (H1, H2), toggle others
                    const level = parseInt(li.dataset.level || 1);
                    if (level > 2) {
                        li.style.display = isCurrentlyExpanded ? 'none' : 'block';
                    }
                });
            });
        }
        // Close Panel Buttons
        document.querySelectorAll('.enh-nav-panel .close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => e.currentTarget.parentElement.classList.remove('visible'));
        });

        // Settings Controls
        const settingsMap = {
            'enh-nav-toggle-autoscroll': { key: 'showAutoScrollBtn', target: '#enh-nav-autoscroll-btn', type: 'toggle' },
            'enh-nav-toggle-section': { key: 'showSectionNavBtn', target: '#enh-nav-section-btn', type: 'toggle' },
            'enh-nav-toggle-progress': { key: 'showProgressIndicator', type: 'value', callback: updateProgressIndicatorVisibility },
            'enh-nav-icon-set': {
                key: 'iconSet',
                type: 'value',
                callback: updateIcons
            },
            'enh-nav-button-position': {
                key: 'buttonPosition',
                type: 'value',
                callback: (value) => {
                    applyButtonPosition(value);
                    setTimeout(() => {
                        updatePanelPositions(value);
                    }, 100);
                }
            },
            'enh-nav-toggle-always-show': {
                key: 'alwaysShowButtons',
                type: 'toggle',
                callback: (value) => {
                    const container = document.getElementById('enh-nav-container');
                    const hoverArea = document.getElementById('enh-nav-hover-area');

                    if (value) {
                        container.classList.add('always-visible');
                        container.classList.remove('hidden');
                        if (hoverArea) hoverArea.style.display = 'none';
                    } else {
                        container.classList.remove('always-visible');
                        container.classList.add('hidden');
                        if (hoverArea) hoverArea.style.display = 'block';
                    }
                }
            },
            'enh-nav-lang-select': { key: 'language', type: 'value', callback: updateUIText },
            'enh-nav-theme-style': { key: 'themeStyle', type: 'value', callback: applyThemeStyle },
            'enh-nav-theme-color': {
                key: 'themeColor', type: 'value', callback: (value) => {
                    document.documentElement.style.setProperty('--enh-nav-theme', value);
                    updateUIText();
                }
            },
            'enh-nav-scroll-speed': { key: 'scrollSpeed', type: 'value', callback: updateUIText },
        };

        for (const [id, config] of Object.entries(settingsMap)) {
            const el = document.getElementById(id);
            if (!el) continue;

            const eventType = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';

            // Set initial value
            if (el.type === 'checkbox') el.checked = STATE.settings[config.key];
            else el.value = STATE.settings[config.key];

            // Add listener
            el.addEventListener(eventType, (e) => {
                const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
                GM_setValue(config.key, value);
                STATE.settings[config.key] = value;

                // Apply change instantly
                if (config.type === 'toggle' && config.target) {
                    document.querySelector(config.target).style.display = value ? 'flex' : 'none';
                }
                if (config.callback) {
                    config.callback(value);
                }
            });
        }

        const hoverArea = document.getElementById('enh-nav-hover-area');
        const container = document.getElementById('enh-nav-container');

        if (hoverArea && container) {
            hoverArea.addEventListener('mouseenter', () => {
                if (!STATE.settings.alwaysShowButtons) {
                    container.classList.remove('hidden');
                }
            });

            container.addEventListener('mouseleave', () => {
                if (!STATE.settings.alwaysShowButtons) {
                    container.classList.add('hidden');
                }
            });
        }
    }


    // --- 5. INITIALIZATION --- //

    /** Main function to start the script */
    function init() {
        if (document.getElementById('enh-nav-container')) return;
        // Bind shortcuts immediately so Alt+M works even if container is missing
        if (!STATE.isKeyBound) {
            document.addEventListener('keydown', handleKeyboardShortcuts);
            STATE.isKeyBound = true;
        }
        STATE.scrollContainer = findScrollContainer();
        // Removed the strict return. Even if scroll container isn't found yet,
        // we should create the UI so settings/Alt+M are visible. The logic will retry finding container later.
        // This prevents the "button missing" issue if container detection lags.
        if (!STATE.scrollContainer && STATE.retryCount <= STATE.maxRetries) {
             STATE.retryCount++;
             // We continue to create UI, but schedule a retry for the container
             setTimeout(() => {
                 STATE.scrollContainer = findScrollContainer();
                 if(STATE.scrollContainer) {
                     // Re-bind scroll event if found later
                     STATE.scrollContainer.addEventListener('scroll', updateScrollState, { passive: true });
                 }
             }, 2000);
        } else {
             STATE.retryCount = 0;
        }

        loadSettings();
        injectStyles();
        updateIcons();
        createUI();
        attachEventListeners();
        addCopyToKatexElements();
        updateUIText();
        updateScrollState();
        applyButtonPosition(STATE.settings.buttonPosition);

        // Bind scroll event (if container exists)
        if (STATE.scrollContainer) {
             const scrollTarget = (STATE.currentPlatform === 'generic') ? window : STATE.scrollContainer;
             scrollTarget.addEventListener('scroll', updateScrollState, { passive: true });
        }

        // Enhanced Observer: Keep UI alive and valid
        const observer = new MutationObserver(() => {
            // 1. Handle Scroll Container updates (React re-renders)
            const currentContainer = findScrollContainer();
            if (currentContainer && STATE.scrollContainer !== currentContainer) {
                console.log('Scroll container updated (React re-render)');
                STATE.scrollContainer = currentContainer;
                STATE.scrollContainer.addEventListener('scroll', updateScrollState, { passive: true });
                updateScrollState();
            }

            // 2.  DOM Guardian: Ensure our UI container wasn't wiped by React
            const uiContainer = document.getElementById('enh-nav-container');
            if (!uiContainer) {
                console.log('UI Container vanished! Re-creating...');
                createUI();
                attachEventListeners(); // Re-attach events to new elements
                updateIcons();
                updateUIText();
                applyButtonPosition(STATE.settings.buttonPosition);
            } else if (document.body.lastElementChild !== uiContainer && document.body.lastElementChild.id !== 'enh-nav-hover-area') {
                // Optional: Move to top if buried (be careful not to fight with other overlays)
                // document.body.appendChild(uiContainer);
            }

            addCopyToKatexElements();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        console.log("Enhanced AI Chat Scroll Navigator initialized.");
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();