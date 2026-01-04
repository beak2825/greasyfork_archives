// ==UserScript==
// @name         Gemini & Claude & ChatGPT
// @namespace    https://example.com/aiHelp
// @match        *://claude.ai/*
// @match        *://chatgpt.com/*
// @match        *://gemini.google.com/*
// @match        https://gemini.google.com/app/*
// @version      1.4.1
// @author       cores (Refactored by Gemini AI)
// @license      MIT
// @description  Widescreen for Claude/ChatGPT/Gemini, Claude font fix & menu button. Gemini: code block copy & collapse buttons (header & footer). | 扩展三平台布局，Claude字体及菜单按钮。Gemini：代码块复制及头部/页脚折叠按钮。(重构版)
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535343/Gemini%20%20Claude%20%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/535343/Gemini%20%20Claude%20%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 常量定义 ---
    // 平台检测
    const PLATFORM_HOSTS = {
        GEMINI: 'gemini.google.com',
        CLAUDE: 'claude.ai',
        CHATGPT: 'chatgpt.com'
    };

    // Gemini 相关选择器和类名
    const GEMINI_SELECTORS = {
        CODE_BLOCK: 'div.code-block',
        CODE_CONTENT: 'code[data-test-id="code-content"], pre code',
        CODE_HEADER: 'div.code-block-decoration.header-formatted.gds-title-s',
        ORIGINAL_BUTTONS_CONTAINER: 'div.buttons[class*="ng-star-inserted"]',
        COLLAPSIBLE_PANEL: '.formatted-code-block-internal-container',
        SIDE_PANEL: '.side-panel', // 用于排除宽屏调整
        NAVIGATION_PANEL: '.navigation-panel', // 用于排除宽屏调整
        QUERY_TEXT_COLLAPSED: 'div.query-text.gds-body-l.collapsed' // 新增：折叠的查询文本选择器
    };
    const GEMINI_CLASSES = {
        CUSTOM_COPY_BUTTON: 'userscript-gemini-custom-copy-button',
        FOOTER_CONTAINER: 'userscript-gemini-code-block-footer',
        HEADER_COLLAPSE_BUTTON: 'userscript-gemini-header-collapse-btn',
        FOOTER_COLLAPSE_BUTTON: 'userscript-gemini-footer-collapse-btn',
        COLLAPSED_PANEL: 'userscript-collapsed-panel',
        QUERY_TEXT_BUTTONS_CONTAINER: 'userscript-gemini-query-text-buttons', // 新增：查询文本按钮容器类
        QUERY_TEXT_COPY_BUTTON: 'userscript-gemini-query-text-copy-button'    // 新增：查询文本复制按钮类
    };
    const GEMINI_ATTRIBUTES = {
        COPY_BUTTON_PROCESSED: 'data-userscript-copy-processed',
        HEADER_COLLAPSE_PROCESSED: 'data-userscript-header-collapse-processed',
        FOOTER_COLLAPSE_PROCESSED: 'data-userscript-footer-collapse-processed',
        QUERY_TEXT_COPY_PROCESSED: 'data-userscript-query-text-copy-processed' // 新增：查询文本复制处理标记
    };

    // Claude 相关选择器和ID
    const CLAUDE_SELECTORS = {
        SETTINGS_BUTTON: 'button[data-testid="user-menu-settings"]',
        MENU_CONTAINER: 'div[role="menu"], div[data-radix-menu-content]',
        TEXT_INPUT_ELEMENTS: 'textarea, [role="textbox"], div[contenteditable="true"]',
        FORM_CONTAINER: 'form[enctype="multipart/form-data"], main form, body'
    };
    const CLAUDE_IDS = {
        CUSTOM_MENU_BUTTON: 'userscript-claude-custom-recents-button'
    };
    const CLAUDE_ATTRIBUTES = {
        WIDTH_FIXED: 'data-userscript-width-fixed'
    };


    // --- 工具函数 ---
    const Utils = {
        /**
         * 创建 Material Design 图标元素 (用于 Gemini)
         * @param {string} iconName - 图标名称 (例如 'content_copy')
         * @returns {HTMLElement} mat-icon 元素
         */
        createMaterialIconElement: function(iconName) {
            const iconElement = document.createElement('mat-icon');
            iconElement.setAttribute('role', 'img');
            iconElement.setAttribute('fonticon', iconName);
            iconElement.className = 'mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color';
            iconElement.setAttribute('aria-hidden', 'true');
            iconElement.setAttribute('data-mat-icon-type', 'font');
            iconElement.setAttribute('data-mat-icon-name', iconName);
            iconElement.textContent = iconName;
            return iconElement;
        },

        /**
         * 向文档头部添加样式
         * @param {string} cssString - 要添加的 CSS 字符串
         * @returns {HTMLStyleElement} 添加的 style 元素
         */
        addStylesToHead: function(cssString) {
            const styleElement = document.createElement('style');
            styleElement.textContent = cssString;
            document.head.appendChild(styleElement);
            return styleElement;
        },

        /**
         * 观察 DOM 变化并执行回调
         * @param {Node} targetNode - 被观察的 DOM 节点
         * @param {MutationObserverInit} observerOptions - MutationObserver 的配置选项
         * @param {Function} callback - 当检测到变化时执行的回调函数
         * @returns {MutationObserver} 创建的 MutationObserver 实例
         */
        observeDOMChanges: function(targetNode, observerOptions, callback) {
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, observerOptions);
            return observer;
        }
    };

    // --- 样式管理器 ---
    const StyleManager = {
        commonStyles: `
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
            }
        `,
        platformStyles: '',
        featureStyles: '',

        /**
         * 添加平台特定的 CSS
         * @param {string} css - 平台 CSS
         */
        addPlatformStyles: function(css) {
            this.platformStyles += css;
        },

        /**
         * 添加功能特定的 CSS (例如 Gemini 按钮)
         * @param {string} css - 功能 CSS
         */
        addFeatureStyles: function(css) {
            this.featureStyles += css;
        },

        /**
         * 将所有收集到的样式应用到文档
         */
        applyAllStyles: function() {
            Utils.addStylesToHead(this.commonStyles + this.platformStyles + this.featureStyles);
        }
    };

    // --- 平台模块 ---

    // Gemini 模块
    const GeminiModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.GEMINI),
        copyButtonProcessedAttr: GEMINI_ATTRIBUTES.COPY_BUTTON_PROCESSED,
        headerCollapseProcessedAttr: GEMINI_ATTRIBUTES.HEADER_COLLAPSE_PROCESSED,
        footerCollapseProcessedAttr: GEMINI_ATTRIBUTES.FOOTER_COLLAPSE_PROCESSED,
        queryTextCopyProcessedAttr: GEMINI_ATTRIBUTES.QUERY_TEXT_COPY_PROCESSED, // 新增属性

        /**
         * 获取 Gemini 平台的特定样式
         * @returns {string} CSS 字符串
         */
        getStyles: function() {
            return `
                /* Gemini 宽屏 CSS */
                .chat-window, .chat-container, .conversation-container, .gemini-conversation-container { max-width: 95% !important; width: 95% !important; }
                .input-area-container, textarea, .prompt-textarea, .prompt-container { max-width: 95% !important; width: 95% !important; }
                textarea { width: 100% !important; }
                .max-w-3xl, .max-w-4xl, .max-w-screen-md { max-width: 95% !important; }
                .message-content, .user-message, .model-response { width: 100% !important; max-width: 100% !important; }
                .pre-fullscreen { height: auto !important; }
                .input-buttons-wrapper-top { right: 8px !important; }

                /* Gemini 代码块功能 CSS */
                .${GEMINI_CLASSES.FOOTER_CONTAINER} {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 8px 0px;
                    margin-top: 8px;
                    gap: 8px; /* 页脚按钮之间的间距 */
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} { /* 代码块复制按钮和页脚折叠按钮的基础样式 */
                    background-color: transparent;
                    color: #5f6368; /* Google 图标颜色 */
                    border: none;
                    padding: 0;
                    width: 40px; /* Material Design 图标按钮标准尺寸 */
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
                    outline: none;
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} .mat-icon {
                    font-size: 24px; /* Material Design 图标标准尺寸 */
                    display: flex;
                    align-items: center;
                    justify-content:center;
                    line-height: 1;
                    flex-wrap:wrap;
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON}:hover {
                    background-color: rgba(0, 0, 0, 0.08); /* Material Design 悬停效果 */
                    color: #202124; /* 深色图标悬停颜色 */
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON}:active {
                    background-color: rgba(0, 0, 0, 0.12); /* Material Design 点击效果 */
                    transform: scale(0.95);
                }
                .${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON} {
                    margin-right: 4px; /* 头部折叠按钮与原始按钮的间距 */
                }
                .${GEMINI_CLASSES.COLLAPSED_PANEL} {
                    display: none !important; /* 隐藏折叠的内容 */
                }

                /* Gemini 查询文本复制按钮的容器样式 - 模仿原生 "buttons" div */
                .${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER} {
                    display: flex; /* Or 'inline-flex' if needed */
                    align-items: center;
                    margin-left: 8px; /* 与查询文本的间距 */
                    flex-direction:column;
                }
            `;
        },

        /**
         * 更新单个折叠按钮的图标和提示文本
         * @param {HTMLElement} buttonElement - 按钮元素
         * @param {boolean} isPanelCollapsed - 面板是否已折叠
         */
        updateSingleCollapseButtonIcon: function(buttonElement, isPanelCollapsed) {
            if (!buttonElement) return;
            while (buttonElement.firstChild) buttonElement.removeChild(buttonElement.firstChild); // 清空现有图标

            const iconName = isPanelCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
            const label = isPanelCollapsed ? '展开代码块 (Userscript)' : '收起代码块 (Userscript)';
            buttonElement.appendChild(Utils.createMaterialIconElement(iconName));
            buttonElement.setAttribute('aria-label', label);
            buttonElement.setAttribute('mattooltip', label); // Gemini 使用 mattooltip
            buttonElement.setAttribute('title', label); // 备用 title
        },

        /**
         * 同步代码块头部和底部相关折叠按钮的图标状态
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {boolean} panelIsCollapsed - 面板是否已折叠
         */
        syncRelatedCollapseButtons: function(codeBlockElement, panelIsCollapsed) {
            const headerBtn = codeBlockElement.querySelector(`.${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON}`);
            const footerBtn = codeBlockElement.querySelector(`.${GEMINI_CLASSES.FOOTER_COLLAPSE_BUTTON}`);
            this.updateSingleCollapseButtonIcon(headerBtn, panelIsCollapsed);
            this.updateSingleCollapseButtonIcon(footerBtn, panelIsCollapsed);
        },

        /**
         * 为 Gemini 代码块添加自定义复制按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @returns {{copyButton: HTMLElement|null, footerDiv: HTMLElement|null}} 包含复制按钮和页脚容器的对象
         */
        addCustomCopyButton: function(codeBlockElement) {
            if (codeBlockElement.getAttribute(this.copyButtonProcessedAttr) === 'true') {
                const existingFooter = codeBlockElement.querySelector('.' + GEMINI_CLASSES.FOOTER_CONTAINER);
                const existingButton = existingFooter ? existingFooter.querySelector('.' + GEMINI_CLASSES.CUSTOM_COPY_BUTTON) : null;
                return { copyButton: existingButton, footerDiv: existingFooter };
            }

            const codeContentElement = codeBlockElement.querySelector(GEMINI_SELECTORS.CODE_CONTENT);
            if (!codeContentElement) return { copyButton: null, footerDiv: null };

            const copyButton = document.createElement('button');
            copyButton.className = GEMINI_CLASSES.CUSTOM_COPY_BUTTON; // 使用通用样式
            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
            copyButton.setAttribute('title', '复制代码 (Userscript)');
            const icon = Utils.createMaterialIconElement('content_copy');
            copyButton.appendChild(icon);

            copyButton.addEventListener('click', async (event) => {
                event.stopPropagation(); // 防止事件冒泡
                const codeText = codeContentElement.innerText;
                try {
                    await navigator.clipboard.writeText(codeText);
                    icon.textContent = 'check';
                    copyButton.setAttribute('aria-label', '已复制 (Userscript)');
                    copyButton.setAttribute('mattooltip', '已复制 (Userscript)');
                } catch (err) {
                    console.error('Userscript: 无法复制代码块', err);
                    icon.textContent = 'error_outline';
                    copyButton.setAttribute('aria-label', '复制失败 (Userscript)');
                    copyButton.setAttribute('mattooltip', '复制失败 (Userscript)');
                    // 不在此处恢复图标，让用户看到错误状态，成功时才自动恢复
                    setTimeout(() => { // 错误状态也延时恢复，避免快速闪烁
                         if (icon.isConnected) {
                            icon.textContent = 'content_copy';
                            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                        }
                    }, 2500);
                    return;
                }

                setTimeout(() => {
                    if (icon.isConnected) {
                        icon.textContent = 'content_copy';
                        copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                        copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                    }
                }, 2500);
            });

            let footerDiv = codeBlockElement.querySelector('.' + GEMINI_CLASSES.FOOTER_CONTAINER);
            if (!footerDiv) {
                footerDiv = document.createElement('div');
                footerDiv.className = GEMINI_CLASSES.FOOTER_CONTAINER;
                const panel = codeBlockElement.querySelector(GEMINI_SELECTORS.COLLAPSIBLE_PANEL);
                if (panel && panel.nextSibling) {
                    panel.parentNode.insertBefore(footerDiv, panel.nextSibling);
                } else if (panel) {
                    panel.parentNode.appendChild(footerDiv);
                } else {
                    codeBlockElement.appendChild(footerDiv);
                }
            }
            footerDiv.appendChild(copyButton);
            codeBlockElement.setAttribute(this.copyButtonProcessedAttr, 'true');
            return { copyButton: copyButton, footerDiv: footerDiv };
        },

        /**
         * 为 Gemini 代码块头部添加折叠/展开按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {HTMLElement} panelToCollapse - 需要折叠/展开的面板元素
         */
        addHeaderCollapseButton: function(codeBlockElement, panelToCollapse) {
            if (codeBlockElement.getAttribute(this.headerCollapseProcessedAttr) === 'true' || !panelToCollapse) return;

            const headerDiv = codeBlockElement.querySelector(GEMINI_SELECTORS.CODE_HEADER);
            if (!headerDiv) return;

            const collapseButton = document.createElement('button');
            collapseButton.className = `mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger ${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON}`;
            collapseButton.setAttribute('mat-icon-button', '');

            collapseButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isCurrentlyCollapsed = panelToCollapse.classList.toggle(GEMINI_CLASSES.COLLAPSED_PANEL);
                this.syncRelatedCollapseButtons(codeBlockElement, isCurrentlyCollapsed);
            });

            const existingButtonsDiv = headerDiv.querySelector(GEMINI_SELECTORS.ORIGINAL_BUTTONS_CONTAINER);
            if (existingButtonsDiv && existingButtonsDiv.parentNode === headerDiv) {
                headerDiv.insertBefore(collapseButton, existingButtonsDiv);
            } else {
                headerDiv.prepend(collapseButton);
            }
            codeBlockElement.setAttribute(this.headerCollapseProcessedAttr, 'true');
        },

        /**
         * 为 Gemini 代码块页脚添加折叠/展开按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {HTMLElement} panelToCollapse - 需要折叠/展开的面板元素
         * @param {HTMLElement} footerDiv - 页脚容器元素
         * @param {HTMLElement} copyButtonRef - 复制按钮的引用，用于定位
         */
        addFooterCollapseButton: function(codeBlockElement, panelToCollapse, footerDiv, copyButtonRef) {
            if (codeBlockElement.getAttribute(this.footerCollapseProcessedAttr) === 'true' || !panelToCollapse || !footerDiv) return;

            const collapseButton = document.createElement('button');
            collapseButton.className = `${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} ${GEMINI_CLASSES.FOOTER_COLLAPSE_BUTTON}`;

            collapseButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isCurrentlyCollapsed = panelToCollapse.classList.toggle(GEMINI_CLASSES.COLLAPSED_PANEL);
                this.syncRelatedCollapseButtons(codeBlockElement, isCurrentlyCollapsed);
            });

            if (copyButtonRef && copyButtonRef.parentNode === footerDiv) {
                footerDiv.insertBefore(collapseButton, copyButtonRef);
            } else {
                footerDiv.appendChild(collapseButton);
            }
            codeBlockElement.setAttribute(this.footerCollapseProcessedAttr, 'true');
        },

        /**
         * 初始化单个 Gemini 代码块的功能 (复制、折叠)
         * @param {HTMLElement} codeBlockElement - 要初始化的代码块元素
         */
        initializeCodeBlockFeatures: function(codeBlockElement) {
            const panelToCollapse = codeBlockElement.querySelector(GEMINI_SELECTORS.COLLAPSIBLE_PANEL);
            const { copyButton, footerDiv } = this.addCustomCopyButton(codeBlockElement);

            if (panelToCollapse) {
                this.addHeaderCollapseButton(codeBlockElement, panelToCollapse);
                if (footerDiv && copyButton) {
                    this.addFooterCollapseButton(codeBlockElement, panelToCollapse, footerDiv, copyButton);
                }
                this.syncRelatedCollapseButtons(codeBlockElement, panelToCollapse.classList.contains(GEMINI_CLASSES.COLLAPSED_PANEL));
            }
        },

        /**
         * 观察并初始化页面上所有 Gemini 代码块的功能
         */
        observeAndInitializeCodeBlocks: function() {
            document.querySelectorAll(GEMINI_SELECTORS.CODE_BLOCK).forEach(block => this.initializeCodeBlockFeatures(block));
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, (mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && node.matches(GEMINI_SELECTORS.CODE_BLOCK)) {
                                    this.initializeCodeBlockFeatures(node);
                                }
                                node.querySelectorAll(GEMINI_SELECTORS.CODE_BLOCK).forEach(block => this.initializeCodeBlockFeatures(block));
                            }
                        });
                    }
                });
            });
        },

        /**
         * 为 Gemini 折叠的查询文本添加复制按钮
         * @param {HTMLElement} queryTextElement - `query-text gds-body-l collapsed` 元素
         */
        addCopyButtonToQueryText: function(queryTextElement) {
            if (!queryTextElement || queryTextElement.getAttribute(this.queryTextCopyProcessedAttr) === 'true') {
                return;
            }
            if (!queryTextElement.parentNode || !queryTextElement.isConnected) {
                return;
            }

            const buttonsContainer = document.createElement('div');
            // 使用 'buttons' 类以尝试匹配原生按钮容器的布局，并添加自定义类
            buttonsContainer.className = `buttons ${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER}`;

            const copyButton = document.createElement('button');
            // 使用 Material Design 组件的类
            copyButton.className = `mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger ${GEMINI_CLASSES.QUERY_TEXT_COPY_BUTTON}`;
            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
            copyButton.setAttribute('title', '复制代码 (Userscript)'); // Fallback tooltip
            // copyButton.setAttribute('mat-icon-button', ''); // 通常由 Angular 处理，作为属性可能无效

            const iconElement = Utils.createMaterialIconElement('content_copy');
            copyButton.appendChild(iconElement);

            copyButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                const textToCopy = queryTextElement.innerText;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    iconElement.textContent = 'check';
                    copyButton.setAttribute('aria-label', '已复制 (Userscript)');
                    copyButton.setAttribute('mattooltip', '已复制 (Userscript)');
                } catch (err) {
                    console.error('Userscript: 无法复制查询文本', err);
                    iconElement.textContent = 'error_outline';
                    copyButton.setAttribute('aria-label', '复制失败 (Userscript)');
                    copyButton.setAttribute('mattooltip', '复制失败 (Userscript)');
                     setTimeout(() => {
                        if (iconElement.isConnected) {
                            iconElement.textContent = 'content_copy';
                            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                        }
                    }, 2000); // 错误状态也延时恢复
                    return;
                }
                setTimeout(() => {
                    if (iconElement.isConnected) {
                        iconElement.textContent = 'content_copy';
                        copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                        copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                    }
                }, 2000);
            });

            buttonsContainer.appendChild(copyButton);
            queryTextElement.parentNode.insertBefore(buttonsContainer, queryTextElement.nextSibling);
            queryTextElement.setAttribute(this.queryTextCopyProcessedAttr, 'true');
        },

        /**
         * 观察并为 Gemini 折叠的查询文本初始化复制按钮
         */
        observeAndInitializeQueryTextCopyButtons: function() {
            document.querySelectorAll(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED).forEach(el => this.addCopyButtonToQueryText(el));
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, (mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && node.matches(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED)) {
                                    this.addCopyButtonToQueryText(node);
                                }
                                node.querySelectorAll(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED).forEach(el => this.addCopyButtonToQueryText(el));
                            }
                        });
                    }
                });
            });
        },

        /**
         * 应用宽屏模式到 Gemini 的内联样式元素
         */
        applyWidescreenToInlineStyles: function() {
            const elements = document.querySelectorAll('[style*="max-width"]');
            elements.forEach(el => {
                if (el.closest(GEMINI_SELECTORS.SIDE_PANEL) ||
                    el.closest(GEMINI_SELECTORS.NAVIGATION_PANEL) ||
                    el.closest(`.${GEMINI_CLASSES.FOOTER_CONTAINER}`) ||
                    el.closest(`.${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER}`)) { // 排除新按钮容器
                    return;
                }
                const currentMaxWidth = el.style.maxWidth;
                if (currentMaxWidth && (currentMaxWidth.includes('px') || currentMaxWidth.includes('rem') || currentMaxWidth.includes('em') || currentMaxWidth.includes('%'))) {
                     if (parseInt(currentMaxWidth, 10) < 1200 && !currentMaxWidth.includes('95%')) {
                        el.style.maxWidth = '95%';
                     }
                }
            });
        },

        /**
         * 观察并应用宽屏模式到 Gemini 的内联样式元素
         */
        observeAndApplyWidescreenInlineStyles: function() {
            this.applyWidescreenToInlineStyles();
            Utils.observeDOMChanges(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            }, () => this.applyWidescreenToInlineStyles());
        },

        /**
         * 初始化 Gemini 平台的所有特定功能
         */
        init: function() {
            StyleManager.addFeatureStyles(this.getStyles());
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.observeAndInitializeCodeBlocks();
                    this.observeAndApplyWidescreenInlineStyles();
                    this.observeAndInitializeQueryTextCopyButtons(); // 新增：初始化查询文本复制按钮
                });
            } else {
                this.observeAndInitializeCodeBlocks();
                this.observeAndApplyWidescreenInlineStyles();
                this.observeAndInitializeQueryTextCopyButtons(); // 新增：初始化查询文本复制按钮
            }
        }
    };

    // Claude 模块
    const ClaudeModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.CLAUDE),
        jsExecuted: false,

        getStyles: function() {
            return `
                /* Claude 宽屏 CSS */
                .max-w-screen-md, .max-w-3xl, .max-w-4xl { max-width: 95% !important; }
                .w-full.max-w-3xl, .w-full.max-w-4xl { max-width: 95% !important; width: 95% !important; }
                .w-full.max-w-3xl textarea { width: 100% !important; }
                .mx-auto { max-width: 95% !important; }
                [data-message-author-role] { width: 100% !important; }
                .absolute.right-0 { right: 10px !important; }

                /* Claude 特定字体修复 */
                p, h1, h2, h3, h4, h5, h6, span, div, textarea, input, button {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                    font-weight: 400 !important;
                }
                pre, code, .font-mono {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                }
                [data-message-author-role] p {
                    font-size: 16px !important;
                    line-height: 1.6 !important;
                    letter-spacing: normal !important;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                }
            `;
        },
        addCustomButtonToMenu: function() {
            const settingsButton = document.querySelector(CLAUDE_SELECTORS.SETTINGS_BUTTON);
            if (!settingsButton) return;
            const menu = settingsButton.closest(CLAUDE_SELECTORS.MENU_CONTAINER);
            if (!menu || document.getElementById(CLAUDE_IDS.CUSTOM_MENU_BUTTON)) return;
            const newButton = document.createElement('button');
            newButton.id = CLAUDE_IDS.CUSTOM_MENU_BUTTON;
            newButton.className = settingsButton.className;
            newButton.setAttribute('role', 'menuitem');
            newButton.setAttribute('tabindex', '-1');
            newButton.setAttribute('data-orientation', 'vertical');
            newButton.textContent = "Recents (Userscript)";
            newButton.addEventListener('click', () => { window.location.href = 'https://claude.ai/recents'; });
            if (settingsButton.parentNode) settingsButton.parentNode.insertBefore(newButton, settingsButton.nextSibling);
        },
        observeMenuForButtonAddition: function() {
            this.addCustomButtonToMenu();
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, () => this.addCustomButtonToMenu());
        },
        fixInputWidths: function() {
            document.querySelectorAll(CLAUDE_SELECTORS.TEXT_INPUT_ELEMENTS).forEach(el => {
                if (el && !el.getAttribute(CLAUDE_ATTRIBUTES.WIDTH_FIXED)) {
                    el.style.maxWidth = '100%';
                    el.setAttribute(CLAUDE_ATTRIBUTES.WIDTH_FIXED, 'true');
                }
            });
        },
        observeAndFixInputWidths: function() {
            let timeoutId;
            const debouncedFixWidths = () => {
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => this.fixInputWidths(), 300);
            };
            this.fixInputWidths();
            const formContainer = document.querySelector(CLAUDE_SELECTORS.FORM_CONTAINER) || document.body;
            Utils.observeDOMChanges(formContainer, { childList: true, subtree: true, attributes: false }, debouncedFixWidths);
        },
        init: function() {
            if (this.jsExecuted) return;
            StyleManager.addPlatformStyles(this.getStyles());
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.observeMenuForButtonAddition();
                    this.observeAndFixInputWidths();
                });
            } else {
                this.observeMenuForButtonAddition();
                this.observeAndFixInputWidths();
            }
            this.jsExecuted = true;
        }
    };

    // ChatGPT 模块
    const ChatGPTModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.CHATGPT),
        getStyles: function() {
            return `
                /* ChatGPT 宽屏 CSS */
                .text-base.gap-4.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-xl.xl\\:max-w-3xl.p-4.md\\:py-6.flex.lg\\:px-0.m-auto,
                .md\\:max-w-2xl.lg\\:max-w-xl.xl\\:max-w-3xl,
                main .text-token-text-primary .w-full .max-w-agw {
                    max-width: 95% !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                }
                form .w-full {
                     max-width: 95% !important;
                     margin-left: auto !important;
                     margin-right: auto !important;
                }
                .stretch { width: 100% !important; }
                .md\\:flex.md\\:items-end.md\\:gap-4 .w-full { max-width: 100% !important; }
                .relative.flex.h-full.max-w-full.flex-1.flex-col {
                     max-width: 95% !important;
                     margin: 0 auto !important;
                }
            `;
        },
        init: function() {
            StyleManager.addPlatformStyles(this.getStyles());
        }
    };

    // --- 主逻辑：初始化和执行 ---
    function main() {
        if (GeminiModule.isCurrent) {
            GeminiModule.init();
        } else if (ClaudeModule.isCurrent) {
            ClaudeModule.init();
        } else if (ChatGPTModule.isCurrent) {
            ChatGPTModule.init();
        }
        StyleManager.applyAllStyles();
    }

    main();

})();
// ==UserScript==
// @name         Gemini & Claude & ChatGPT Enhancements (Refactored)
// @namespace    https://example.com/aiHelp
// @match        *://claude.ai/*
// @match        *://chatgpt.com/*
// @match        *://gemini.google.com/*
// @match        https://gemini.google.com/app/*
// @version      1.4.1
// @author       cores (Refactored by Gemini AI)
// @license      MIT
// @description  Widescreen for Claude/ChatGPT/Gemini, Claude font fix & menu button. Gemini: code block copy & collapse buttons (header & footer), copy button for collapsed query text. | 扩展三平台布局，Claude字体及菜单按钮。Gemini：代码块复制及头部/页脚折叠按钮，为折叠的查询文本添加复制按钮。(重构版)
// @grant        none
// @downloadURL  https://update.greasyfork.org/scripts/535343/Gemini%20Gemini%20%20chatgpt.user.js
// @updateURL    https://update.greasyfork.org/scripts/535343/Gemini%20Gemini%20%20chatgpt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 常量定义 ---
    // 平台检测
    const PLATFORM_HOSTS = {
        GEMINI: 'gemini.google.com',
        CLAUDE: 'claude.ai',
        CHATGPT: 'chatgpt.com'
    };

    // Gemini 相关选择器和类名
    const GEMINI_SELECTORS = {
        CODE_BLOCK: 'div.code-block',
        CODE_CONTENT: 'code[data-test-id="code-content"], pre code',
        CODE_HEADER: 'div.code-block-decoration.header-formatted.gds-title-s',
        ORIGINAL_BUTTONS_CONTAINER: 'div.buttons[class*="ng-star-inserted"]',
        COLLAPSIBLE_PANEL: '.formatted-code-block-internal-container',
        SIDE_PANEL: '.side-panel', // 用于排除宽屏调整
        NAVIGATION_PANEL: '.navigation-panel', // 用于排除宽屏调整
        QUERY_TEXT_COLLAPSED: 'div.query-text.gds-body-l.collapsed' // 新增：折叠的查询文本选择器
    };
    const GEMINI_CLASSES = {
        CUSTOM_COPY_BUTTON: 'userscript-gemini-custom-copy-button',
        FOOTER_CONTAINER: 'userscript-gemini-code-block-footer',
        HEADER_COLLAPSE_BUTTON: 'userscript-gemini-header-collapse-btn',
        FOOTER_COLLAPSE_BUTTON: 'userscript-gemini-footer-collapse-btn',
        COLLAPSED_PANEL: 'userscript-collapsed-panel',
        QUERY_TEXT_BUTTONS_CONTAINER: 'userscript-gemini-query-text-buttons', // 新增：查询文本按钮容器类
        QUERY_TEXT_COPY_BUTTON: 'userscript-gemini-query-text-copy-button'    // 新增：查询文本复制按钮类
    };
    const GEMINI_ATTRIBUTES = {
        COPY_BUTTON_PROCESSED: 'data-userscript-copy-processed',
        HEADER_COLLAPSE_PROCESSED: 'data-userscript-header-collapse-processed',
        FOOTER_COLLAPSE_PROCESSED: 'data-userscript-footer-collapse-processed',
        QUERY_TEXT_COPY_PROCESSED: 'data-userscript-query-text-copy-processed' // 新增：查询文本复制处理标记
    };

    // Claude 相关选择器和ID
    const CLAUDE_SELECTORS = {
        SETTINGS_BUTTON: 'button[data-testid="user-menu-settings"]',
        MENU_CONTAINER: 'div[role="menu"], div[data-radix-menu-content]',
        TEXT_INPUT_ELEMENTS: 'textarea, [role="textbox"], div[contenteditable="true"]',
        FORM_CONTAINER: 'form[enctype="multipart/form-data"], main form, body'
    };
    const CLAUDE_IDS = {
        CUSTOM_MENU_BUTTON: 'userscript-claude-custom-recents-button'
    };
    const CLAUDE_ATTRIBUTES = {
        WIDTH_FIXED: 'data-userscript-width-fixed'
    };


    // --- 工具函数 ---
    const Utils = {
        /**
         * 创建 Material Design 图标元素 (用于 Gemini)
         * @param {string} iconName - 图标名称 (例如 'content_copy')
         * @returns {HTMLElement} mat-icon 元素
         */
        createMaterialIconElement: function(iconName) {
            const iconElement = document.createElement('mat-icon');
            iconElement.setAttribute('role', 'img');
            iconElement.setAttribute('fonticon', iconName);
            iconElement.className = 'mat-icon notranslate google-symbols mat-ligature-font mat-icon-no-color';
            iconElement.setAttribute('aria-hidden', 'true');
            iconElement.setAttribute('data-mat-icon-type', 'font');
            iconElement.setAttribute('data-mat-icon-name', iconName);
            iconElement.textContent = iconName;
            return iconElement;
        },

        /**
         * 向文档头部添加样式
         * @param {string} cssString - 要添加的 CSS 字符串
         * @returns {HTMLStyleElement} 添加的 style 元素
         */
        addStylesToHead: function(cssString) {
            const styleElement = document.createElement('style');
            styleElement.textContent = cssString;
            document.head.appendChild(styleElement);
            return styleElement;
        },

        /**
         * 观察 DOM 变化并执行回调
         * @param {Node} targetNode - 被观察的 DOM 节点
         * @param {MutationObserverInit} observerOptions - MutationObserver 的配置选项
         * @param {Function} callback - 当检测到变化时执行的回调函数
         * @returns {MutationObserver} 创建的 MutationObserver 实例
         */
        observeDOMChanges: function(targetNode, observerOptions, callback) {
            const observer = new MutationObserver(callback);
            observer.observe(targetNode, observerOptions);
            return observer;
        }
    };

    // --- 样式管理器 ---
    const StyleManager = {
        commonStyles: `
            body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
            }
        `,
        platformStyles: '',
        featureStyles: '',

        /**
         * 添加平台特定的 CSS
         * @param {string} css - 平台 CSS
         */
        addPlatformStyles: function(css) {
            this.platformStyles += css;
        },

        /**
         * 添加功能特定的 CSS (例如 Gemini 按钮)
         * @param {string} css - 功能 CSS
         */
        addFeatureStyles: function(css) {
            this.featureStyles += css;
        },

        /**
         * 将所有收集到的样式应用到文档
         */
        applyAllStyles: function() {
            Utils.addStylesToHead(this.commonStyles + this.platformStyles + this.featureStyles);
        }
    };

    // --- 平台模块 ---

    // Gemini 模块
    const GeminiModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.GEMINI),
        copyButtonProcessedAttr: GEMINI_ATTRIBUTES.COPY_BUTTON_PROCESSED,
        headerCollapseProcessedAttr: GEMINI_ATTRIBUTES.HEADER_COLLAPSE_PROCESSED,
        footerCollapseProcessedAttr: GEMINI_ATTRIBUTES.FOOTER_COLLAPSE_PROCESSED,
        queryTextCopyProcessedAttr: GEMINI_ATTRIBUTES.QUERY_TEXT_COPY_PROCESSED, // 新增属性

        /**
         * 获取 Gemini 平台的特定样式
         * @returns {string} CSS 字符串
         */
        getStyles: function() {
            return `
                /* Gemini 宽屏 CSS */
                .chat-window, .chat-container, .conversation-container, .gemini-conversation-container { max-width: 95% !important; width: 95% !important; }
                .input-area-container, textarea, .prompt-textarea, .prompt-container { max-width: 95% !important; width: 95% !important; }
                textarea { width: 100% !important; }
                .max-w-3xl, .max-w-4xl, .max-w-screen-md { max-width: 95% !important; }
                .message-content, .user-message, .model-response { width: 100% !important; max-width: 100% !important; }
                .pre-fullscreen { height: auto !important; }
                .input-buttons-wrapper-top { right: 8px !important; }

                /* Gemini 代码块功能 CSS */
                .${GEMINI_CLASSES.FOOTER_CONTAINER} {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 8px 0px;
                    margin-top: 8px;
                    gap: 8px; /* 页脚按钮之间的间距 */
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} { /* 代码块复制按钮和页脚折叠按钮的基础样式 */
                    background-color: transparent;
                    color: #5f6368; /* Google 图标颜色 */
                    border: none;
                    padding: 0;
                    width: 40px; /* Material Design 图标按钮标准尺寸 */
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
                    outline: none;
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} .mat-icon {
                    font-size: 24px; /* Material Design 图标标准尺寸 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON}:hover {
                    background-color: rgba(0, 0, 0, 0.08); /* Material Design 悬停效果 */
                    color: #202124; /* 深色图标悬停颜色 */
                }
                .${GEMINI_CLASSES.CUSTOM_COPY_BUTTON}:active {
                    background-color: rgba(0, 0, 0, 0.12); /* Material Design 点击效果 */
                    transform: scale(0.95);
                }
                .${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON} {
                    margin-right: 4px; /* 头部折叠按钮与原始按钮的间距 */
                }
                .${GEMINI_CLASSES.COLLAPSED_PANEL} {
                    display: none !important; /* 隐藏折叠的内容 */
                }

                /* Gemini 查询文本复制按钮的容器样式 - 模仿原生 "buttons" div */
                .${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER} {
                    display: flex; /* Or 'inline-flex' if needed */
                    align-items: center;
                    margin-left: 8px; /* 与查询文本的间距 */
                }
            `;
        },

        /**
         * 更新单个折叠按钮的图标和提示文本
         * @param {HTMLElement} buttonElement - 按钮元素
         * @param {boolean} isPanelCollapsed - 面板是否已折叠
         */
        updateSingleCollapseButtonIcon: function(buttonElement, isPanelCollapsed) {
            if (!buttonElement) return;
            while (buttonElement.firstChild) buttonElement.removeChild(buttonElement.firstChild); // 清空现有图标

            const iconName = isPanelCollapsed ? 'keyboard_arrow_down' : 'keyboard_arrow_up';
            const label = isPanelCollapsed ? '展开代码块 (Userscript)' : '收起代码块 (Userscript)';
            buttonElement.appendChild(Utils.createMaterialIconElement(iconName));
            buttonElement.setAttribute('aria-label', label);
            buttonElement.setAttribute('mattooltip', label); // Gemini 使用 mattooltip
            buttonElement.setAttribute('title', label); // 备用 title
        },

        /**
         * 同步代码块头部和底部相关折叠按钮的图标状态
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {boolean} panelIsCollapsed - 面板是否已折叠
         */
        syncRelatedCollapseButtons: function(codeBlockElement, panelIsCollapsed) {
            const headerBtn = codeBlockElement.querySelector(`.${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON}`);
            const footerBtn = codeBlockElement.querySelector(`.${GEMINI_CLASSES.FOOTER_COLLAPSE_BUTTON}`);
            this.updateSingleCollapseButtonIcon(headerBtn, panelIsCollapsed);
            this.updateSingleCollapseButtonIcon(footerBtn, panelIsCollapsed);
        },

        /**
         * 为 Gemini 代码块添加自定义复制按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @returns {{copyButton: HTMLElement|null, footerDiv: HTMLElement|null}} 包含复制按钮和页脚容器的对象
         */
        addCustomCopyButton: function(codeBlockElement) {
            if (codeBlockElement.getAttribute(this.copyButtonProcessedAttr) === 'true') {
                const existingFooter = codeBlockElement.querySelector('.' + GEMINI_CLASSES.FOOTER_CONTAINER);
                const existingButton = existingFooter ? existingFooter.querySelector('.' + GEMINI_CLASSES.CUSTOM_COPY_BUTTON) : null;
                return { copyButton: existingButton, footerDiv: existingFooter };
            }

            const codeContentElement = codeBlockElement.querySelector(GEMINI_SELECTORS.CODE_CONTENT);
            if (!codeContentElement) return { copyButton: null, footerDiv: null };

            const copyButton = document.createElement('button');
            copyButton.className = GEMINI_CLASSES.CUSTOM_COPY_BUTTON; // 使用通用样式
            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
            copyButton.setAttribute('title', '复制代码 (Userscript)');
            const icon = Utils.createMaterialIconElement('content_copy');
            copyButton.appendChild(icon);

            copyButton.addEventListener('click', async (event) => {
                event.stopPropagation(); // 防止事件冒泡
                const codeText = codeContentElement.innerText;
                try {
                    await navigator.clipboard.writeText(codeText);
                    icon.textContent = 'check';
                    copyButton.setAttribute('aria-label', '已复制 (Userscript)');
                    copyButton.setAttribute('mattooltip', '已复制 (Userscript)');
                } catch (err) {
                    console.error('Userscript: 无法复制代码块', err);
                    icon.textContent = 'error_outline';
                    copyButton.setAttribute('aria-label', '复制失败 (Userscript)');
                    copyButton.setAttribute('mattooltip', '复制失败 (Userscript)');
                    // 不在此处恢复图标，让用户看到错误状态，成功时才自动恢复
                    setTimeout(() => { // 错误状态也延时恢复，避免快速闪烁
                         if (icon.isConnected) {
                            icon.textContent = 'content_copy';
                            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                        }
                    }, 2500);
                    return;
                }

                setTimeout(() => {
                    if (icon.isConnected) {
                        icon.textContent = 'content_copy';
                        copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                        copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                    }
                }, 2500);
            });

            let footerDiv = codeBlockElement.querySelector('.' + GEMINI_CLASSES.FOOTER_CONTAINER);
            if (!footerDiv) {
                footerDiv = document.createElement('div');
                footerDiv.className = GEMINI_CLASSES.FOOTER_CONTAINER;
                const panel = codeBlockElement.querySelector(GEMINI_SELECTORS.COLLAPSIBLE_PANEL);
                if (panel && panel.nextSibling) {
                    panel.parentNode.insertBefore(footerDiv, panel.nextSibling);
                } else if (panel) {
                    panel.parentNode.appendChild(footerDiv);
                } else {
                    codeBlockElement.appendChild(footerDiv);
                }
            }
            footerDiv.appendChild(copyButton);
            codeBlockElement.setAttribute(this.copyButtonProcessedAttr, 'true');
            return { copyButton: copyButton, footerDiv: footerDiv };
        },

        /**
         * 为 Gemini 代码块头部添加折叠/展开按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {HTMLElement} panelToCollapse - 需要折叠/展开的面板元素
         */
        addHeaderCollapseButton: function(codeBlockElement, panelToCollapse) {
            if (codeBlockElement.getAttribute(this.headerCollapseProcessedAttr) === 'true' || !panelToCollapse) return;

            const headerDiv = codeBlockElement.querySelector(GEMINI_SELECTORS.CODE_HEADER);
            if (!headerDiv) return;

            const collapseButton = document.createElement('button');
            collapseButton.className = `mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger ${GEMINI_CLASSES.HEADER_COLLAPSE_BUTTON}`;
            collapseButton.setAttribute('mat-icon-button', '');

            collapseButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isCurrentlyCollapsed = panelToCollapse.classList.toggle(GEMINI_CLASSES.COLLAPSED_PANEL);
                this.syncRelatedCollapseButtons(codeBlockElement, isCurrentlyCollapsed);
            });

            const existingButtonsDiv = headerDiv.querySelector(GEMINI_SELECTORS.ORIGINAL_BUTTONS_CONTAINER);
            if (existingButtonsDiv && existingButtonsDiv.parentNode === headerDiv) {
                headerDiv.insertBefore(collapseButton, existingButtonsDiv);
            } else {
                headerDiv.prepend(collapseButton);
            }
            codeBlockElement.setAttribute(this.headerCollapseProcessedAttr, 'true');
        },

        /**
         * 为 Gemini 代码块页脚添加折叠/展开按钮
         * @param {HTMLElement} codeBlockElement - 代码块元素
         * @param {HTMLElement} panelToCollapse - 需要折叠/展开的面板元素
         * @param {HTMLElement} footerDiv - 页脚容器元素
         * @param {HTMLElement} copyButtonRef - 复制按钮的引用，用于定位
         */
        addFooterCollapseButton: function(codeBlockElement, panelToCollapse, footerDiv, copyButtonRef) {
            if (codeBlockElement.getAttribute(this.footerCollapseProcessedAttr) === 'true' || !panelToCollapse || !footerDiv) return;

            const collapseButton = document.createElement('button');
            collapseButton.className = `${GEMINI_CLASSES.CUSTOM_COPY_BUTTON} ${GEMINI_CLASSES.FOOTER_COLLAPSE_BUTTON}`;

            collapseButton.addEventListener('click', (event) => {
                event.stopPropagation();
                const isCurrentlyCollapsed = panelToCollapse.classList.toggle(GEMINI_CLASSES.COLLAPSED_PANEL);
                this.syncRelatedCollapseButtons(codeBlockElement, isCurrentlyCollapsed);
            });

            if (copyButtonRef && copyButtonRef.parentNode === footerDiv) {
                footerDiv.insertBefore(collapseButton, copyButtonRef);
            } else {
                footerDiv.appendChild(collapseButton);
            }
            codeBlockElement.setAttribute(this.footerCollapseProcessedAttr, 'true');
        },

        /**
         * 初始化单个 Gemini 代码块的功能 (复制、折叠)
         * @param {HTMLElement} codeBlockElement - 要初始化的代码块元素
         */
        initializeCodeBlockFeatures: function(codeBlockElement) {
            const panelToCollapse = codeBlockElement.querySelector(GEMINI_SELECTORS.COLLAPSIBLE_PANEL);
            const { copyButton, footerDiv } = this.addCustomCopyButton(codeBlockElement);

            if (panelToCollapse) {
                this.addHeaderCollapseButton(codeBlockElement, panelToCollapse);
                if (footerDiv && copyButton) {
                    this.addFooterCollapseButton(codeBlockElement, panelToCollapse, footerDiv, copyButton);
                }
                this.syncRelatedCollapseButtons(codeBlockElement, panelToCollapse.classList.contains(GEMINI_CLASSES.COLLAPSED_PANEL));
            }
        },

        /**
         * 观察并初始化页面上所有 Gemini 代码块的功能
         */
        observeAndInitializeCodeBlocks: function() {
            document.querySelectorAll(GEMINI_SELECTORS.CODE_BLOCK).forEach(block => this.initializeCodeBlockFeatures(block));
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, (mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && node.matches(GEMINI_SELECTORS.CODE_BLOCK)) {
                                    this.initializeCodeBlockFeatures(node);
                                }
                                node.querySelectorAll(GEMINI_SELECTORS.CODE_BLOCK).forEach(block => this.initializeCodeBlockFeatures(block));
                            }
                        });
                    }
                });
            });
        },

        /**
         * 为 Gemini 折叠的查询文本添加复制按钮
         * @param {HTMLElement} queryTextElement - `query-text gds-body-l collapsed` 元素
         */
        addCopyButtonToQueryText: function(queryTextElement) {
            if (!queryTextElement || queryTextElement.getAttribute(this.queryTextCopyProcessedAttr) === 'true') {
                return;
            }
            if (!queryTextElement.parentNode || !queryTextElement.isConnected) {
                return;
            }

            const buttonsContainer = document.createElement('div');
            // 使用 'buttons' 类以尝试匹配原生按钮容器的布局，并添加自定义类
            buttonsContainer.className = `buttons ${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER}`;

            const copyButton = document.createElement('button');
            // 使用 Material Design 组件的类
            copyButton.className = `mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-tooltip-trigger ${GEMINI_CLASSES.QUERY_TEXT_COPY_BUTTON}`;
            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
            copyButton.setAttribute('title', '复制代码 (Userscript)'); // Fallback tooltip
            // copyButton.setAttribute('mat-icon-button', ''); // 通常由 Angular 处理，作为属性可能无效

            const iconElement = Utils.createMaterialIconElement('content_copy');
            copyButton.appendChild(iconElement);

            copyButton.addEventListener('click', async (event) => {
                event.stopPropagation();
                const textToCopy = queryTextElement.innerText;
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    iconElement.textContent = 'check';
                    copyButton.setAttribute('aria-label', '已复制 (Userscript)');
                    copyButton.setAttribute('mattooltip', '已复制 (Userscript)');
                } catch (err) {
                    console.error('Userscript: 无法复制查询文本', err);
                    iconElement.textContent = 'error_outline';
                    copyButton.setAttribute('aria-label', '复制失败 (Userscript)');
                    copyButton.setAttribute('mattooltip', '复制失败 (Userscript)');
                     setTimeout(() => {
                        if (iconElement.isConnected) {
                            iconElement.textContent = 'content_copy';
                            copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                            copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                        }
                    }, 2000); // 错误状态也延时恢复
                    return;
                }
                setTimeout(() => {
                    if (iconElement.isConnected) {
                        iconElement.textContent = 'content_copy';
                        copyButton.setAttribute('aria-label', '复制代码 (Userscript)');
                        copyButton.setAttribute('mattooltip', '复制代码 (Userscript)');
                    }
                }, 2000);
            });

            buttonsContainer.appendChild(copyButton);
            queryTextElement.parentNode.insertBefore(buttonsContainer, queryTextElement.nextSibling);
            queryTextElement.setAttribute(this.queryTextCopyProcessedAttr, 'true');
        },

        /**
         * 观察并为 Gemini 折叠的查询文本初始化复制按钮
         */
        observeAndInitializeQueryTextCopyButtons: function() {
            document.querySelectorAll(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED).forEach(el => this.addCopyButtonToQueryText(el));
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, (mutationsList) => {
                mutationsList.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.matches && node.matches(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED)) {
                                    this.addCopyButtonToQueryText(node);
                                }
                                node.querySelectorAll(GEMINI_SELECTORS.QUERY_TEXT_COLLAPSED).forEach(el => this.addCopyButtonToQueryText(el));
                            }
                        });
                    }
                });
            });
        },

        /**
         * 应用宽屏模式到 Gemini 的内联样式元素
         */
        applyWidescreenToInlineStyles: function() {
            const elements = document.querySelectorAll('[style*="max-width"]');
            elements.forEach(el => {
                if (el.closest(GEMINI_SELECTORS.SIDE_PANEL) ||
                    el.closest(GEMINI_SELECTORS.NAVIGATION_PANEL) ||
                    el.closest(`.${GEMINI_CLASSES.FOOTER_CONTAINER}`) ||
                    el.closest(`.${GEMINI_CLASSES.QUERY_TEXT_BUTTONS_CONTAINER}`)) { // 排除新按钮容器
                    return;
                }
                const currentMaxWidth = el.style.maxWidth;
                if (currentMaxWidth && (currentMaxWidth.includes('px') || currentMaxWidth.includes('rem') || currentMaxWidth.includes('em') || currentMaxWidth.includes('%'))) {
                     if (parseInt(currentMaxWidth, 10) < 1200 && !currentMaxWidth.includes('95%')) {
                        el.style.maxWidth = '95%';
                     }
                }
            });
        },

        /**
         * 观察并应用宽屏模式到 Gemini 的内联样式元素
         */
        observeAndApplyWidescreenInlineStyles: function() {
            this.applyWidescreenToInlineStyles();
            Utils.observeDOMChanges(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            }, () => this.applyWidescreenToInlineStyles());
        },

        /**
         * 初始化 Gemini 平台的所有特定功能
         */
        init: function() {
            StyleManager.addFeatureStyles(this.getStyles());
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.observeAndInitializeCodeBlocks();
                    this.observeAndApplyWidescreenInlineStyles();
                    this.observeAndInitializeQueryTextCopyButtons(); // 新增：初始化查询文本复制按钮
                });
            } else {
                this.observeAndInitializeCodeBlocks();
                this.observeAndApplyWidescreenInlineStyles();
                this.observeAndInitializeQueryTextCopyButtons(); // 新增：初始化查询文本复制按钮
            }
        }
    };

    // Claude 模块
    const ClaudeModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.CLAUDE),
        jsExecuted: false,

        getStyles: function() {
            return `
                /* Claude 宽屏 CSS */
                .max-w-screen-md, .max-w-3xl, .max-w-4xl { max-width: 95% !important; }
                .w-full.max-w-3xl, .w-full.max-w-4xl { max-width: 95% !important; width: 95% !important; }
                .w-full.max-w-3xl textarea { width: 100% !important; }
                .mx-auto { max-width: 95% !important; }
                [data-message-author-role] { width: 100% !important; }
                .absolute.right-0 { right: 10px !important; }

                /* Claude 特定字体修复 */
                p, h1, h2, h3, h4, h5, h6, span, div, textarea, input, button {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                    font-weight: 400 !important;
                }
                pre, code, .font-mono {
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
                }
                [data-message-author-role] p {
                    font-size: 16px !important;
                    line-height: 1.6 !important;
                    letter-spacing: normal !important;
                }
                h1, h2, h3, h4, h5, h6 {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif !important;
                }
            `;
        },
        addCustomButtonToMenu: function() {
            const settingsButton = document.querySelector(CLAUDE_SELECTORS.SETTINGS_BUTTON);
            if (!settingsButton) return;
            const menu = settingsButton.closest(CLAUDE_SELECTORS.MENU_CONTAINER);
            if (!menu || document.getElementById(CLAUDE_IDS.CUSTOM_MENU_BUTTON)) return;
            const newButton = document.createElement('button');
            newButton.id = CLAUDE_IDS.CUSTOM_MENU_BUTTON;
            newButton.className = settingsButton.className;
            newButton.setAttribute('role', 'menuitem');
            newButton.setAttribute('tabindex', '-1');
            newButton.setAttribute('data-orientation', 'vertical');
            newButton.textContent = "Recents (Userscript)";
            newButton.addEventListener('click', () => { window.location.href = 'https://claude.ai/recents'; });
            if (settingsButton.parentNode) settingsButton.parentNode.insertBefore(newButton, settingsButton.nextSibling);
        },
        observeMenuForButtonAddition: function() {
            this.addCustomButtonToMenu();
            Utils.observeDOMChanges(document.body, { childList: true, subtree: true }, () => this.addCustomButtonToMenu());
        },
        fixInputWidths: function() {
            document.querySelectorAll(CLAUDE_SELECTORS.TEXT_INPUT_ELEMENTS).forEach(el => {
                if (el && !el.getAttribute(CLAUDE_ATTRIBUTES.WIDTH_FIXED)) {
                    el.style.maxWidth = '100%';
                    el.setAttribute(CLAUDE_ATTRIBUTES.WIDTH_FIXED, 'true');
                }
            });
        },
        observeAndFixInputWidths: function() {
            let timeoutId;
            const debouncedFixWidths = () => {
                if (timeoutId) clearTimeout(timeoutId);
                timeoutId = setTimeout(() => this.fixInputWidths(), 300);
            };
            this.fixInputWidths();
            const formContainer = document.querySelector(CLAUDE_SELECTORS.FORM_CONTAINER) || document.body;
            Utils.observeDOMChanges(formContainer, { childList: true, subtree: true, attributes: false }, debouncedFixWidths);
        },
        init: function() {
            if (this.jsExecuted) return;
            StyleManager.addPlatformStyles(this.getStyles());
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.observeMenuForButtonAddition();
                    this.observeAndFixInputWidths();
                });
            } else {
                this.observeMenuForButtonAddition();
                this.observeAndFixInputWidths();
            }
            this.jsExecuted = true;
        }
    };

    // ChatGPT 模块
    const ChatGPTModule = {
        isCurrent: window.location.hostname.includes(PLATFORM_HOSTS.CHATGPT),
        getStyles: function() {
            return `
                /* ChatGPT 宽屏 CSS */
                .text-base.gap-4.md\\:gap-6.md\\:max-w-2xl.lg\\:max-w-xl.xl\\:max-w-3xl.p-4.md\\:py-6.flex.lg\\:px-0.m-auto,
                .md\\:max-w-2xl.lg\\:max-w-xl.xl\\:max-w-3xl,
                main .text-token-text-primary .w-full .max-w-agw {
                    max-width: 95% !important;
                    margin-left: auto !important;
                    margin-right: auto !important;
                }
                form .w-full {
                     max-width: 95% !important;
                     margin-left: auto !important;
                     margin-right: auto !important;
                }
                .stretch { width: 100% !important; }
                .md\\:flex.md\\:items-end.md\\:gap-4 .w-full { max-width: 100% !important; }
                .relative.flex.h-full.max-w-full.flex-1.flex-col {
                     max-width: 95% !important;
                     margin: 0 auto !important;
                }
            `;
        },
        init: function() {
            StyleManager.addPlatformStyles(this.getStyles());
        }
    };

    // --- 主逻辑：初始化和执行 ---
    function main() {
        if (GeminiModule.isCurrent) {
            GeminiModule.init();
        } else if (ClaudeModule.isCurrent) {
            ClaudeModule.init();
        } else if (ChatGPTModule.isCurrent) {
            ChatGPTModule.init();
        }
        StyleManager.applyAllStyles();
    }

    main();

})();

