// ==UserScript==
// @name         天凤牌谱链接提取器
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  实时获取并累计牌谱链接
// @author       馒头卡
// @match        *://tenhou.net/3/*
// @match        *://tenhou.net/4/*
// @match        *://nodocchi.moe/tenhoulog/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527090/%E5%A4%A9%E5%87%A4%E7%89%8C%E8%B0%B1%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527090/%E5%A4%A9%E5%87%A4%E7%89%8C%E8%B0%B1%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局配置
    const CONFIG = {
        STYLES: {
            panel: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: 'white',
                padding: '15px',
                border: '2px solid #ccc',
                borderRadius: '5px',
                zIndex: '9999',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                minWidth: '450px'
            },
            title: {
                margin: '0 0 10px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#333'
            },
            status: {
                margin: '5px 0',
                fontSize: '13px',
                color: '#666'
            },
            textarea: {
                width: '100%',
                height: '200px',
                margin: '10px 0',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontFamily: 'monospace',
                resize: 'vertical',
                boxSizing: 'border-box'
            },
            button: {
                padding: '8px 15px',
                cursor: 'pointer',
                border: 'none',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                flex: 1
            }
        },

        SELECTORS: {
            'nodocchi.moe': {
                '/tenhoulog/': {
                    scrollContainer: null,
                    selector: 'td.td_rule > a[href^="http://tenhou.net/0/?log="]',
                    transform: link => link.replace(/&amp;/g, '&'),
                    scrollConfig: {
                        step: 1500,
                    },
                }
            },
            'tenhou.net': {
                '/3/': {
                    scrollContainer: '#hlist',
                    selector: '#hlist > div > a[href^="https://tenhou.net/0/"]',
                    scrollConfig: {
                        step: 600,
                    },
                },
                '/4/': {
                    scrollContainer: '#c32',
                    selector: '#c32 > div > a.s9.s7.bt3',
                    scrollConfig: {
                        step: 600,
                    },
                }
            }
        },

        SCROLL: {
            step: 800,
            interval: 1000,
            timeout: 120000,
            retryLimit: 3
        },

        COLORS: {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            secondary: '#9C27B0'
        }
    };

    const createElement = (tag, styles = {}, attributes = {}) => {
        const el = document.createElement(tag);
        Object.assign(el.style, styles);
        Object.entries(attributes).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    };

    class LinkExtractor {
        constructor() {
            this.isProcessing = false;
            this.collectedLinks = new Set(); // 新增：用于存储去重后的链接
            this.initPanel();
        }

        initPanel() {
            document.getElementById('th-link-panel')?.remove();

            this.panel = createElement('div', CONFIG.STYLES.panel, { id: 'th-link-panel' });
            this.title = createElement('div', CONFIG.STYLES.title);
            this.statusBar = createElement('div', CONFIG.STYLES.status);
            this.textarea = createElement('textarea', CONFIG.STYLES.textarea, { readonly: true });

            const btnContainer = createElement('div', {
                display: 'flex',
                gap: '10px',
                marginTop: '10px'
            });

            const buttons = [
                {
                    text: '开始获取',
                    color: CONFIG.COLORS.info,
                    action: () => this.startProcess()
                },
                {
                    text: '复制链接',
                    color: CONFIG.COLORS.success,
                    action: () => this.copyLinks()
                },
                {
                    text: '下载牌谱',
                    color: CONFIG.COLORS.secondary,
                    action: () => this.downloadLinks()
                }
            ];

            this.controlButtons = buttons.map(config => {
                const btn = createElement('button',
                    { ...CONFIG.STYLES.button, background: config.color },
                    { type: 'button' }
                );
                btn.textContent = config.text;
                btn.addEventListener('click', config.action);
                return btn;
            });

            btnContainer.append(...this.controlButtons);
            this.panel.append(
                this.title,
                this.statusBar,
                this.textarea,
                btnContainer
            );
            document.body.appendChild(this.panel);
        }

        showStatus(text, color = CONFIG.COLORS.info) {
            this.statusBar.textContent = text;
            this.statusBar.style.color = color;
        }

        async startProcess() {
            if (this.isProcessing) return;

            try {
                this.toggleProcessing(true);
                const pageConfig = this.getCurrentPageConfig();
                const scrollContainer = pageConfig.container;
                const scrollConfig = { ...CONFIG.SCROLL, ...pageConfig.scrollConfig };

                await this.autoScroll(scrollContainer, scrollConfig);
                this.showStatus(`完成！共获取 ${this.collectedLinks.size} 个链接`, CONFIG.COLORS.success);
            } catch (error) {
                this.showStatus(`操作失败: ${error.message}`, CONFIG.COLORS.error);
            } finally {
                this.toggleProcessing(false);
            }
        }

        autoScroll(scrollContainer, scrollConfig) {
            return new Promise((resolve) => {
                const isDocumentContainer = scrollContainer === document.documentElement;
                let lastScrollPos = isDocumentContainer ? window.pageYOffset : scrollContainer.scrollTop;
                let retryCount = 0;
                const startTime = Date.now();

                const getScrollPosition = () => {
                    return isDocumentContainer ?
                        window.pageYOffset + window.innerHeight :
                        scrollContainer.scrollTop + scrollContainer.clientHeight;
                };
                // 新增：实时提取链接的方法
                const processLinks = () => {
                    const newLinks = this.extractLinks(this.getCurrentPageConfig().selectorConfig);
                    const prevSize = this.collectedLinks.size;
                    newLinks.forEach(link => this.collectedLinks.add(link));
                    
                    if (this.collectedLinks.size > prevSize) {
                        this.updateUI();
                        // this.showStatus(`已累计发现 ${this.collectedLinks.size} 个链接`, CONFIG.COLORS.info);
                    }
                };

                const scrollStep = () => {
                    if (Date.now() - startTime > scrollConfig.timeout) {
                        this.showStatus(`滚动超时（${scrollConfig.timeout}ms）`, CONFIG.COLORS.error);
                        resolve();
                        return;
                    }
                    
                    processLinks(); // 每次滚动前先处理现有链接

                    const currentPosition = getScrollPosition();
                    const totalHeight = isDocumentContainer ?
                        document.documentElement.scrollHeight :
                        scrollContainer.scrollHeight;

                    if (currentPosition >= totalHeight - 10) {
                        if (totalHeight === (isDocumentContainer ? lastScrollPos + window.innerHeight : lastScrollPos)) {
                            if (++retryCount >= scrollConfig.retryLimit) {
                                resolve();
                                return;
                            }
                        } else {
                            retryCount = 0;
                            lastScrollPos = isDocumentContainer ? totalHeight - window.innerHeight : totalHeight;
                        }
                    }

                    if (isDocumentContainer) {
                        window.scrollBy(0, scrollConfig.step);
                    } else {
                        scrollContainer.scrollTop += scrollConfig.step;
                    }

                    setTimeout(scrollStep, scrollConfig.interval);
                };

                this.showStatus('采集中，请勿操作页面...');
                processLinks(); // 初始加载时处理一次
                scrollStep();
            });
        }

        getCurrentPageConfig() {
            const { hostname, pathname } = window.location;

            for (const [domain, domainConfig] of Object.entries(CONFIG.SELECTORS)) {
                if (!hostname.includes(domain)) continue;

                const pathConfig = this.findPathConfig(domainConfig, pathname);
                if (pathConfig) {
                    let container = document.documentElement;
                    if (pathConfig.scrollContainer) {
                        container = document.querySelector(pathConfig.scrollContainer) || container;
                    }

                    return {
                        container: container,
                        scrollConfig: pathConfig.scrollConfig || {},
                        selectorConfig: pathConfig
                    };
                }
            }

            return {
                container: document.documentElement,
                scrollConfig: {},
                selectorConfig: null
            };
        }

        toggleProcessing(processing) {
            this.isProcessing = processing;
            this.controlButtons.forEach(btn => btn.disabled = processing);
        }

        extractLinks(selectorConfig) {
            if (!selectorConfig) return [];
            const elements = document.querySelectorAll(selectorConfig.selector);
            let links = Array.from(elements).map(a => a.href);
            return selectorConfig.transform ? links.map(selectorConfig.transform) : links;
        }

        updateUI(links) {
            this.title.textContent = `累计发现 ${this.collectedLinks.size} 个牌谱链接`;
            this.textarea.value = Array.from(this.collectedLinks).join('\n');
        }

        copyLinks() {
            this.textarea.value = Array.from(this.collectedLinks).join('\n'); // 确保复制最新数据
            document.execCommand('copy');
            this.showStatus('链接已复制到剪贴板', CONFIG.COLORS.success);
        }

        downloadLinks() {
            const content = Array.from(this.collectedLinks).join('\n');
            if (!content) return;

            const blob = new Blob([content], { type: 'text/plain' });

            const url = URL.createObjectURL(blob);
            const a = createElement('a', {}, {
                href: url,
                download: `牌谱-${new Date().toLocaleString().replace(/[/:]/g, '-')}.txt`
            });

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
                        
            this.showStatus('文件下载已开始', CONFIG.COLORS.secondary);
        }

        findPathConfig(config, currentPath) {
            for (const [pathPrefix, pathConfig] of Object.entries(config)) {
                if (currentPath.startsWith(pathPrefix)) {
                    return pathConfig;
                }
            }
            return null;
        }
    }

    window.addEventListener('load', () => new LinkExtractor());
})();
