// ==UserScript==
// @name         LatexCopier
// @name:zh-CN   Latex公式复制助手  支持一键复制到Word文档/支持直接复制Latex代码(一键切换) 支持ChatGPT 维基百科 豆包 DeepSeek stackexchange 等主流网站
// @namespace    https://github.com/BakaDream/LatexCopier
// @version      1.0.0
// @license      GPLv3
// @description  一键复制网页数学公式到Word/LaTeX | 智能悬停预览 | 支持维基百科/知乎/豆包/ChatGPT/stackexchange/DeepSeek等主流网站 | 自动识别并转换LaTeX/MathML格式 | 可视化反馈提示
// @author       BakaDream
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @match        *://*.chatgpt.com/*
// @match        *://*.stackexchange.com/*
// @match        *://*.doubao.com/*
// @match        *://*.deepseek.com/*
// @require      https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531420/LatexCopier.user.js
// @updateURL https://update.greasyfork.org/scripts/531420/LatexCopier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================
    // 配置中心
    // ========================
    const CONFIG = {
        STORAGE_KEY: 'latexCopyMode',
        MODES: {
            WORD: {
                id: 'word',
                name: 'Word公式模式',
                desc: '生成MathML，粘贴到Word自动转为公式',
                feedback: '公式已复制 ✓ 可粘贴到Word'
            },
            RAW: {
                id: 'raw',
                name: '原始LaTeX模式',
                desc: '直接复制LaTeX源代码',
                feedback: 'LaTeX代码已复制 ✓'
            }
        },
        DEFAULT_MODE: 'word',
        SITE_TARGETS: {
            'wikipedia.org': {
                selector: 'span.mwe-math-element',
                extractor: el => el.querySelector('math')?.getAttribute('alttext')
            },
            'zhihu.com': {
                selector: 'span.ztext-math',
                extractor: el => el.getAttribute('data-tex')
            },
            'doubao.com': {
                selector: 'span.math-inline',
                extractor: el => el.getAttribute('data-custom-copy-text')
            },
            'chatgpt.com': {
                selector: 'span.katex',
                extractor: el => el.querySelector('annotation')?.textContent
            },
            'stackexchange.com': {
                selector: 'span.math-container',
                extractor: el => el.querySelector('script')?.textContent
            },
            'deepseek.com': {
                selector: 'span.katex',
                extractor: el => el.querySelector('annotation')?.textContent
            }

        }
    };

    // ========================
    // 工具模块
    // ========================
    const Utils = {
        getSiteConfig(url) {
            for (const [domain, config] of Object.entries(CONFIG.SITE_TARGETS)) {
                if (url.includes(domain)) return config;
            }
            return null;
        },

        copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.opacity = 0;
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();

            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {
                console.error('[LaTeX助手] 复制失败:', err);
            } finally {
                document.body.removeChild(textarea);
            }
            return success;
        }
    };

    // ========================
    // 主功能模块
    // ========================
    const LaTeXCopyHelper = {
        currentMode: null,
        tooltip: null,
        feedback: null,
        activeElements: new Set(),

        // ===== 初始化 =====
        init() {
            this.currentMode = this._loadMode();
            this._initStyles(); // 合并样式配置和注入
            this._initUIElements();
            this._setupEventListeners();
            this._registerMenuCommand();
        },

        // ===== 模式管理 =====
        _loadMode() {
            const savedMode = GM_getValue(CONFIG.STORAGE_KEY);
            return Object.values(CONFIG.MODES).find(m => m.id === savedMode) || CONFIG.MODES.WORD;
        },

        _registerMenuCommand() {
            GM_registerMenuCommand(
                `切换模式 | 当前: ${this.currentMode.name}`,
                () => this._toggleMode()
            );
        },

        _toggleMode() {
            const newMode = this.currentMode === CONFIG.MODES.WORD
                ? CONFIG.MODES.RAW
                : CONFIG.MODES.WORD;

            GM_setValue(CONFIG.STORAGE_KEY, newMode.id);
            this.currentMode = newMode;

            this._showFeedback(`已切换为: ${newMode.name}\n${newMode.desc}`, true);
            setTimeout(() => location.reload(), 300);
        },

        // ===== UI管理 =====
        _initStyles() {
            const STYLES = {
                // 公式悬停效果
                HOVER: {
                    background: 'rgba(100, 180, 255, 0.15)',
                    boxShadow: '0 0 8px rgba(0, 120, 215, 0.3)',
                    transition: 'all 0.3s ease'
                },
                // 工具提示
                TOOLTIP: {
                    background: 'rgba(0, 0, 0, 0.85)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    maxWidth: '400px',
                    fontSize: '13px',
                    offset: 10,
                    arrowSize: '5px'
                },
                // 操作反馈
                FEEDBACK: {
                    background: '#4CAF50',
                    errorBackground: '#f44336',
                    color: 'white',
                    duration: 1500,
                    position: 'bottom: 20%; left: 50%'
                }
            };

            const style = document.createElement('style');
            style.textContent = `
                /* 公式元素悬停效果 */
                [data-latex-copy] {
                    cursor: pointer;
                    transition: ${STYLES.HOVER.transition};
                    border-radius: 3px;
                    padding: 2px;
                    position: relative;
                }
                [data-latex-copy]:hover {
                    background: ${STYLES.HOVER.background} !important;
                    box-shadow: ${STYLES.HOVER.boxShadow} !important;
                }

                /* 智能工具提示 */
                .latex-helper-tooltip {
                    position: fixed;
                    background: ${STYLES.TOOLTIP.background};
                    color: ${STYLES.TOOLTIP.color};
                    padding: ${STYLES.TOOLTIP.padding};
                    border-radius: ${STYLES.TOOLTIP.borderRadius};
                    max-width: min(${STYLES.TOOLTIP.maxWidth}, 90vw);
                    font-size: ${STYLES.TOOLTIP.fontSize};
                    z-index: 9999;
                    opacity: 0;
                    transform: translateY(5px);
                    transition: all 0.2s ease;
                    pointer-events: none;
                    word-break: break-word;
                }
                .latex-helper-tooltip.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .latex-helper-tooltip::after {
                    content: '';
                    position: absolute;
                    left: 10px;
                    border-width: ${STYLES.TOOLTIP.arrowSize};
                    border-style: solid;
                    border-color: transparent;
                }
                .latex-helper-tooltip.top-direction::after {
                    bottom: calc(-${STYLES.TOOLTIP.arrowSize} * 2);
                    border-top-color: ${STYLES.TOOLTIP.background};
                }
                .latex-helper-tooltip.bottom-direction::after {
                    top: calc(-${STYLES.TOOLTIP.arrowSize} * 2);
                    border-bottom-color: ${STYLES.TOOLTIP.background};
                }

                /* 操作反馈提示 */
                .latex-helper-feedback {
                    position: fixed;
                    ${STYLES.FEEDBACK.position};
                    transform: translateX(-50%);
                    background: ${STYLES.FEEDBACK.background};
                    color: ${STYLES.FEEDBACK.color};
                    padding: 10px 20px;
                    border-radius: 4px;
                    z-index: 10000;
                    opacity: 0;
                    transition: all 0.3s;
                    text-align: center;
                    white-space: pre-wrap;
                }
                .latex-helper-feedback.error {
                    background: ${STYLES.FEEDBACK.errorBackground} !important;
                }
                .latex-helper-feedback.visible {
                    opacity: 1;
                    transform: translateX(-50%) translateY(-10px);
                }
            `;
            document.head.appendChild(style);
        },

        _initUIElements() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'latex-helper-tooltip';
            document.body.appendChild(this.tooltip);

            this.feedback = document.createElement('div');
            this.feedback.className = 'latex-helper-feedback';
            document.body.appendChild(this.feedback);
        },

        // ===== 事件处理 =====
        _setupEventListeners() {
            document.addEventListener('mouseover', (e) => this._handleHover(e));
            document.addEventListener('mouseout', (e) => this._handleMouseOut(e));
            document.addEventListener('dblclick', (e) => this._handleDoubleClick(e), true);

            new MutationObserver((mutations) => this._handleMutations(mutations))
                .observe(document.body, { childList: true, subtree: true });
        },

        _handleHover(e) {
            const siteConfig = Utils.getSiteConfig(window.location.href);
            const element = e.target.closest(siteConfig?.selector || '');
            if (!element) return this._hideTooltip();

            element.setAttribute('data-latex-copy', 'true');
            this.activeElements.add(element);

            const latex = siteConfig.extractor(element);
            if (latex) this._showSmartTooltip(latex, element);
        },

        _handleMouseOut(e) {
            const element = e.target.closest('[data-latex-copy]');
            if (element) {
                element.style.background = '';
                element.style.boxShadow = '';
            }
            this._hideTooltip();
        },

        _handleDoubleClick(e) {
            const siteConfig = Utils.getSiteConfig(window.location.href);
            const element = e.target.closest(siteConfig?.selector || '');
            if (!element) return;

            const latex = siteConfig.extractor(element);
            if (!latex) return;

            this._copyFormula(latex);
            e.preventDefault();
            e.stopPropagation();
        },

        _handleMutations(mutations) {
            const siteConfig = Utils.getSiteConfig(window.location.href);
            if (!siteConfig) return;

            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches(siteConfig.selector)) {
                        node.setAttribute('data-latex-copy', 'true');
                        this.activeElements.add(node);
                    }
                });
            });
        },

        // ===== 核心功能 =====
        _showSmartTooltip(text, element) {
            this.tooltip.textContent = text;

            const rect = element.getBoundingClientRect();
            const tooltipHeight = this.tooltip.offsetHeight;
            const viewportHeight = window.innerHeight;

            // 优先显示在上方
            if (rect.top - tooltipHeight - 10 > 0) {
                this.tooltip.style.top = `${rect.top - tooltipHeight - 10}px`;
                this.tooltip.style.left = `${rect.left}px`;
                this.tooltip.className = 'latex-helper-tooltip top-direction visible';
            }
            // 上方空间不足时显示在下方
            else if (rect.bottom + tooltipHeight + 10 < viewportHeight) {
                this.tooltip.style.top = `${rect.bottom + 10}px`;
                this.tooltip.style.left = `${rect.left}px`;
                this.tooltip.className = 'latex-helper-tooltip bottom-direction visible';
            }
            // 极端情况：显示在元素旁边
            else {
                this.tooltip.style.top = `${rect.top}px`;
                this.tooltip.style.left = `${rect.right + 10}px`;
                this.tooltip.className = 'latex-helper-tooltip visible';
            }
        },

        _hideTooltip() {
            this.tooltip.className = 'latex-helper-tooltip';
        },

        async _copyFormula(latex) {
            if (this.currentMode === CONFIG.MODES.RAW) {
                this._copyRawLatex(latex);
            } else {
                await this._copyAsMathML(latex);
            }
        },

        _copyRawLatex(latex) {
            const success = Utils.copyToClipboard(latex);
            this._showFeedback(
                success ? this.currentMode.feedback : '复制失败 ✗',
                success
            );
        },

        async _copyAsMathML(latex) {
            try {
                MathJax.texReset();
                const mathML = await MathJax.tex2mmlPromise(latex);
                const success = Utils.copyToClipboard(mathML);
                this._showFeedback(
                    success ? this.currentMode.feedback : '转换失败 ✗',
                    success
                );
            } catch (error) {
                console.error('[LaTeX助手] MathJax转换错误:', error);
                this._showFeedback('公式转换失败，请尝试原始模式', false);
            }
        },

        _showFeedback(message, isSuccess) {
            this.feedback.textContent = message;
            this.feedback.className = `latex-helper-feedback ${isSuccess ? '' : 'error'} visible`;
            setTimeout(() => {
                this.feedback.className = 'latex-helper-feedback';
            }, 1500);
        }
    };

    // ========================
    // 启动脚本
    // ========================
    LaTeXCopyHelper.init();
})();