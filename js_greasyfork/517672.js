// ==UserScript==
// @name         AI Chat Window Enhancer Pro
// @name:zh-CN   AI对话窗口增强专业版
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Enhanced chat window for various AI platforms: ChatGPT, Claude, Kimi, Tongyi, ChatGLM, Tiangong, Deepseek, Gemini
// @description:zh-CN  为主流AI平台优化对话窗口体验：支持ChatGPT、Claude、Kimi、通义千问、智谱GLM、天工、Deepseek、Gemini
// @author       Claude
// @match        *://chatgpt.com/*
// @match        *://new.oaifree.com/*
// @match        *://shared.oaifree.com/*
// @match        *://www.aicnn.cn/oaifree/*
// @match        *://chat.aicnn.xyz/*
// @match        *://plus.aivvm.com/*
// @match        *://kimi.moonshot.cn/*
// @match        *://tongyi.aliyun.com/qianwen*
// @match        *://www.tiangong.cn/*
// @match        *://chatglm.cn/*
// @match        *://claude.ai/*
// @match        *://chat.deepseek.com/*
// @include      *://*claude*/*
// @match        *://chat.kelaode.ai/*
// @match        *://gemini.google.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNSIgcnk9IjUiIGZpbGw9IiM2YmIiLz4KICA8cGF0aCBkPSJtMTcgMTMuNyA0LTQtNC00bS0xMCA4LTQtNCA0LTRtMTMuOTk5IDMuODI1SDMuMjE1Ii8+CiAgPHBhdGggZD0iTTE5IDE2aC0yLjVhLjk5LjkgMCAwIDAtLjc3NS4zNzVsLTIuOSAzLjY1Yy0uNC41LTEuMTYyLjUtMS41NjMgMGwtMi45MjUtMy42NUEuOTkuOSAwIDAgMCA3LjUgMTZINWMtMS42NjMgMC0zLTEuMzM4LTMtM1Y2YzAtMS42NjIgMS4zNS0zIDMtM2gxNGEzIDMgMCAwIDEgMyAzdjdjMCAxLjY2Mi0xLjM1IDMtMyAzWiIgZmlsbC1vcGFjaXR5PSIuMTYiIHN0cm9rZT0iI0VFRSIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIvPgo8L3N2Zz4K
// @license      AGPL-3.0
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/517672/AI%20Chat%20Window%20Enhancer%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/517672/AI%20Chat%20Window%20Enhancer%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 统一的样式配置
    const STYLE_CONFIG = {
        maxWidth: '95%',
        maxViewportWidth: '90vw',
        scrollbarWidth: 'thin',
        scrollbarThumbColor: '#aaaa',
        scrollbarTrackColor: '#1111',
        codeBlockScrollbarHeight: '8px',
        codeBlockScrollbarThumbColor: '#666',
        codeBlockScrollbarTrackColor: '#f1f1f1',
        // 代码块选中样式
        codeSelectionBgColor: 'rgba(70, 130, 180, 0.5)',     // 深色主题选中背景色
        codeSelectionTextColor: 'white',                     // 深色主题选中文本色
        lightCodeSelectionBgColor: 'rgba(0, 120, 215, 0.3)', // 浅色主题选中背景色
        lightCodeSelectionTextColor: 'black'                 // 浅色主题选中文本色
    };

    // 通用代码块样式
    const CODE_BLOCK_STYLES = `
        /* 代码块样式优化 */
        pre > div.rounded-md,
        .code-block__code {
            min-height: 1.5em;
            height: auto !important;
        }
        /* 保持代码块的水平滚动，移除纵向限制 */
        pre > div.rounded-md > div.overflow-y-auto,
        .code-block__code {
            max-height: none !important;
            height: auto !important;
            overflow-y: visible !important;
            overflow-x: auto !important;
        }
        /* 移除代码块的折叠按钮 */
        button[class*="code-block-collapse-button"],
        div[class*="code-block-collapse"] {
            display: none !important;
        }
        /* 确保代码块始终展开 */
        div[class*="code-block-wrapper"].collapsed {
            max-height: none !important;
            height: auto !important;
        }
        /* 优化代码块滚动条样式 */
        pre > div.rounded-md > div.overflow-y-auto::-webkit-scrollbar,
        .code-block__code::-webkit-scrollbar {
            height: ${STYLE_CONFIG.codeBlockScrollbarHeight};
            width: ${STYLE_CONFIG.codeBlockScrollbarHeight};
        }
        pre > div.rounded-md > div.overflow-y-auto::-webkit-scrollbar-thumb,
        .code-block__code::-webkit-scrollbar-thumb {
            background: ${STYLE_CONFIG.codeBlockScrollbarThumbColor};
            border-radius: 4px;
        }
        pre > div.rounded-md > div.overflow-y-auto::-webkit-scrollbar-track,
        .code-block__code::-webkit-scrollbar-track {
            background: ${STYLE_CONFIG.codeBlockScrollbarTrackColor};
        }

        /* 代码块文本选中样式 - 适用于深色背景 */
        pre code::selection,
        .code-block__code code::selection,
        pre div::selection,
        .code-block__code div::selection,
        pre span::selection,
        .code-block__code span::selection,
        div[class*="codeBlockContainer"] *::selection,
        div[class*="code-block"] *::selection {
            background-color: ${STYLE_CONFIG.codeSelectionBgColor} !important;
            color: ${STYLE_CONFIG.codeSelectionTextColor} !important;
        }

        /* 浅色背景代码块的选中样式 */
        pre.bg-white code::selection,
        pre.bg-gray-50 code::selection,
        pre.bg-slate-50 code::selection,
        .light-theme pre code::selection,
        .light pre code::selection {
            background-color: ${STYLE_CONFIG.lightCodeSelectionBgColor} !important;
            color: ${STYLE_CONFIG.lightCodeSelectionTextColor} !important;
        }

        /* 提升代码块hover时的可识别性 */
        pre:hover,
        .code-block__code:hover,
        div[class*="codeBlockContainer"]:hover,
        div[class*="code-block"]:hover {
            box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
            transition: box-shadow 0.2s ease-in-out;
        }
    `;

    // 平台特定的样式定义
    const PLATFORM_STYLES = {
        kimi: `
            div[data-testid] div[data-index] div.MuiBox-root {
                max-width: 100% !important;
            }
            div[class^=mainContent] div.MuiBox-root > div[class^=chatBottom_] {
                max-width: calc(100% - 100px);
            }
            div[class^=mainContent] div[class^=chatInput_] div[class^=inputInner_] div[class^=editor] {
                max-height: 360px;
            }
            #scroll-list div[class^=chatItemBox_].MuiBox-root {
                max-width: 100%;
            }
            div.MuiBox-root[class^=homepage] div[class^=mainContent] div[class^=chatInput_] div[class^=inputInner_] div[class^=editor] {
                max-height: 600px;
            }
            #root > div > div[class*=mainContent] > div[class*=layoutContent] > div.MuiBox-root > div.MuiBox-root[class*=homepage] > div.MuiContainer-root.MuiContainer-maxWidthMd {
                max-width: calc(100% - 100px);
            }
            ${CODE_BLOCK_STYLES}
        `,
        deepseek: `
            div:has(> #latest-context-divider) {
                width: ${STYLE_CONFIG.maxWidth} !important;
            }
            div:has(> div > #chat-input) {
                width: ${STYLE_CONFIG.maxWidth} !important;
                max-width: ${STYLE_CONFIG.maxViewportWidth};
            }
            ${CODE_BLOCK_STYLES}
        `,
        tongyi: `
            div[class^=mainContent] div[class^=questionItem--],
            div[class^=mainContent] div[class^=answerItem--] {
                width: 90% !important;
                max-width: ${STYLE_CONFIG.maxViewportWidth};
            }
            ${CODE_BLOCK_STYLES}
        `,
        tiangong: `
            #app > div > div > main > div.overflow-y-scroll.w-full > div.search-content.relative.flex.w-full.flex-row.justify-center,
            #app > div > div > main > div.overflow-y-scroll.w-full > div.search-content.relative.flex.w-full.flex-row.justify-center > label.w-full.cursor-default.select-auto,
            label.w-full {
                max-width: calc(100% - 100px);
                --search-max-width: calc(100% - 100px);
            }
            :root {
                --search-max-width: calc(100% - 100px);
            }
            ${CODE_BLOCK_STYLES}
        `,
        chatglm: `
            div.conversation-inner.dialogue > div.conversation-list.detail > div.item.conversation-item,
            .markdown-body.md-body {
                max-width: ${STYLE_CONFIG.maxViewportWidth} !important;
            }
            ${CODE_BLOCK_STYLES}
        `,
        gemini: `
            #chat-history > infinite-scroller > div,
            #app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div > div > div.content-container > chat-window > div.chat-container.ng-star-inserted > div.bottom-container.response-optimization.ng-star-inserted,
            #app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div > div > div.content-container > chat-window > div.chat-container.ng-star-inserted > div.bottom-container.response-optimization.ng-star-inserted > div.input-area-container.ng-star-inserted {
                max-width: calc(100% - 20px);
            }
            ${CODE_BLOCK_STYLES}
        `,
        default: `
            .xl\\:max-w-\\[48rem\\] {
                width: ${STYLE_CONFIG.maxWidth} !important;
                max-width: 96% !important;
            }
            div.mx-auto.md\\:max-w-3xl,
            div.mx-auto.flex {
                max-width: calc(100% - 10px);
            }
            ${CODE_BLOCK_STYLES}
            .ProseMirror.break-words.ProseMirror-focused {
                max-width: 100%;
            }
            body > div.flex.min-h-screen.w-full div.flex.flex-col div.flex.gap-2 div.mt-1.max-h-96.w-full.overflow-y-auto.break-words > div.ProseMirror.break-words {
                max-width: 90%;
            }
            main > div.composer-parent article > div.text-base > div.mx-auto,
            main article > div.text-base > div.mx-auto {
                max-width: ${STYLE_CONFIG.maxWidth};
            }
            body > div.flex.min-h-screen.w-full > div > main > div.top-5.z-10.mx-auto.w-full.max-w-2xl.md,
            body > div.flex.min-h-screen.w-full > div > main > div.mx-auto.w-full.max-w-2xl.px-1.md {
                max-width: 100%;
            }
            body > div.flex.min-h-screen.w-full > div > main.max-w-7xl {
                max-width: 90rem;
            }
        `
    };

    // 平台映射配置
    const PLATFORM_MAP = {
        'kimi.moonshot.cn': 'kimi',
        'chat.deepseek.com': 'deepseek',
        'tongyi.aliyun.com': 'tongyi',
        'tiangong.cn': 'tiangong',
        'chatglm.cn': 'chatglm',
        'gemini.google.com': 'gemini'
    };

    // 检测当前平台并应用相应样式
    function applyPlatformStyles() {
        try {
            const host = window.location.hostname;
            let platformKey = 'default';
            
            // 使用平台映射检测当前平台
            for (const [domain, key] of Object.entries(PLATFORM_MAP)) {
                if (host.includes(domain)) {
                    platformKey = key;
                    break;
                }
            }
            
            // 应用对应平台的样式
            const styleToApply = PLATFORM_STYLES[platformKey] || PLATFORM_STYLES.default;
            GM_addStyle(styleToApply);
            
            console.log(`[AI Chat Enhancer] Applied styles for platform: ${platformKey}`);
        } catch (error) {
            console.error('[AI Chat Enhancer] Error applying styles:', error);
        }
    }

    // 优化链接处理
    function enhanceLinks() {
        // 使用防抖避免频繁调用
        if (enhanceLinks.timer) {
            clearTimeout(enhanceLinks.timer);
        }
        
        try {
            const links = document.querySelectorAll('div[data-message-id] a[rel="noreferrer"]');
            
            if (links.length > 0) {
                links.forEach(link => {
                    if (!link.href && link.innerText && link.innerText.trim()) {
                        const linkText = link.innerText.trim();
                        // 仅处理有效链接文本
                        if (linkText.startsWith('http') || linkText.includes('www.')) {
                            link.href = linkText;
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                        }
                    }
                });
            }
        } catch (error) {
            console.error('[AI Chat Enhancer] Error enhancing links:', error);
        }
        
        // 使用MutationObserver替代递归调用，降低性能消耗
        enhanceLinks.timer = setTimeout(() => {
            if (!enhanceLinks.observer) {
                // 创建观察器，监听DOM变化
                enhanceLinks.observer = new MutationObserver((mutations) => {
                    const shouldProcess = mutations.some(mutation => 
                        mutation.addedNodes.length > 0 || 
                        (mutation.type === 'attributes' && mutation.attributeName === 'href')
                    );
                    
                    if (shouldProcess) {
                        enhanceLinks();
                    }
                });
                
                // 开始观察文档变化
                enhanceLinks.observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['href']
                });
            }
        }, 2000);
    }

    // 初始化
    function init() {
        // 在DOMContentLoaded后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                applyPlatformStyles();
                enhanceLinks();
            });
        } else {
            // 文档已经加载完成
            applyPlatformStyles();
            enhanceLinks();
        }
        
        // 监听页面变化，适应单页应用
        window.addEventListener('popstate', applyPlatformStyles);
        window.addEventListener('pushstate', applyPlatformStyles);
        window.addEventListener('replacestate', applyPlatformStyles);
    }

    // 启动脚本
    init();
})();