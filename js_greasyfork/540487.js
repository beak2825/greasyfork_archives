// ==UserScript==
// @name         没有朋友
// @namespace    https://linux.do/u/amna/
// @version      4.0
// @description  移除页面aff参数，增加代码复制按钮，并深度净化页面内容，移除各类推广元素。
// @license      MIT
// @author       https://linux.do/u/amna/ (Refactored by Senior Software Engineer)
// @match        *://ygpy.net/*
// @icon         https://ygpy.net/images/logo-light.webp
// @run-at       document-start
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540487/%E6%B2%A1%E6%9C%89%E6%9C%8B%E5%8F%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/540487/%E6%B2%A1%E6%9C%89%E6%9C%8B%E5%8F%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 配置常量 ===
    const CONFIG = {
        SCRIPT_BUTTON_CLASS: 'amna-copy-button',
        DEBOUNCE_DELAY: 250,
        IGNORED_CODE_TEXT: new Set([
            "流媒体解锁", "多设备在线", "支持 BT 下载", "国内中转线路", "IEPL 专线路", "设备不限制",
            "晚高峰稳定", "国际专线", "IPLC 线路", "50+ 节点", "不限设备", "超大带宽", "赠送 Emby",
            "IEPL 专线", "家宽 IP", "厦门专线", "开始阅读", "仪表盘", "主页", "兑换礼品卡"
        ])
    };

    // === 工具函数类 ===
    class Utils {
        static debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        static isElement(node) {
            return node instanceof Element;
        }

        static log(message) {
            console.log(`[没有朋友] ${message}`);
        }
    }

    // === 样式管理类 ===
    class StyleManager {
        constructor() {
            this.injected = false;
        }

        injectStyles() {
            if (this.injected) return;
            
            GM_addStyle(`
                /* 复制按钮样式 */
                .${CONFIG.SCRIPT_BUTTON_CLASS} { 
                    margin-left:8px; padding:3px 6px; border:1px solid #ccc; 
                    border-radius:4px; background-color:#f0f0f0; color:#333; 
                    cursor:pointer; font-size:12px; font-family:sans-serif; 
                    user-select:none; display:inline-block; vertical-align:middle; 
                    opacity:0.7; transition:opacity .2s, background-color .2s; 
                }

                /* === 抗闪屏 CSS 规则 === */
                nav#VPSidebarNav > div.group:nth-last-child(-n + 2) { display: none !important; }
                div.VPDocAside > div.doc-aside-ads { display: none !important; }
                ul.VPDocOutlineItem li:has(a[title*="[广告]"]) { display: none !important; }
                div._vpn_free > div > :is(p, br, hr, div.vp-raw:nth-of-type(1)) { display: none !important; }
                div.vp-doc > div > div.vp-raw:nth-of-type(1) { display: none !important; }
                div.vp-doc > div > div > a.link { display: none !important; }
            `);
            
            this.injected = true;
        }
    }

    // === 内容清理器类 ===
    class ContentCleaner {
        static attachMenuListeners(container) {
            const menuButtons = container.querySelectorAll('.VPNavBarMenuGroup button:not([data-amna-menu-listener])');
            menuButtons.forEach(button => {
                button.setAttribute('data-amna-menu-listener', 'true');
                button.addEventListener('mouseover', () => {
                    this.hideSponsoredMenuLinks(document.body);
                }, { passive: true });
            });
        }

        static hideSiblingsUntil(startElement, stopTagName) {
            let currentElement = startElement;
            while (currentElement) {
                currentElement.style.display = 'none';
                const nextElement = currentElement.nextElementSibling;
                if (!nextElement || nextElement.tagName === stopTagName) {
                    break;
                }
                currentElement = nextElement;
            }
        }

        static hideSponsoredSidebarItems(container) {
            const sidebarItems = container.querySelectorAll('section.VPSidebarItem > div.items > div');
            sidebarItems.forEach(itemDiv => {
                const pTag = itemDiv.querySelector('div > a > p');
                if (pTag && pTag.innerText.trim() === '付费机场') {
                    itemDiv.remove();
                }
            });
        }

        static hideSponsoredContent(container) {
            const contentArea = container.querySelector('main.main > div.vp-doc > div');
            if (!contentArea) return;

            const adHeaders = contentArea.querySelectorAll('h2[id*="广告"]');
            adHeaders.forEach(h2 => {
                this.hideSiblingsUntil(h2, 'H2');
            });

            const children = Array.from(contentArea.children);
            const firstVisibleChild = children.find(el => el.style.display !== 'none');
            if (firstVisibleChild && firstVisibleChild.tagName === 'H2') {
                firstVisibleChild.style.marginTop = '0';
            }
        }

        static hideSponsoredHomeActions(container) {
            const actionDivs = container.querySelectorAll('div.VPHome div.main > div.actions > div.action');
            actionDivs.forEach(div => {
                const link = div.querySelector('a');
                if (link && link.innerText.trim() === '付费专栏') {
                    div.remove();
                }
            });
        }

        static hideSponsoredMenuLinks(container) {
            const menuLinks = container.querySelectorAll('div.VPNavBarMenuGroup > div.menu div.items > div.VPMenuLink');
            menuLinks.forEach(div => {
                const span = div.querySelector('a > span');
                if (span && span.innerText.trim() === '付费机场') {
                    div.style.display = 'none';
                }
            });
        }
    }

    // === 链接清理器类 ===
    class LinkCleaner {
        static cleanLinks(container) {
            const links = container.querySelectorAll('a[href*="?"]');
            links.forEach(link => {
                if (!link.href) return;
                
                try {
                    const url = new URL(link.href);
                    const hasSearchParams = url.search;
                    const hasHashParams = url.hash && url.hash.includes('?');
                    
                    if (hasSearchParams || hasHashParams) {
                        let newHref = url.origin + url.pathname;
                        if (hasHashParams) {
                            newHref += url.hash.split('?')[0];
                        }
                        link.href = newHref;
                    }
                } catch (error) {
                    if (link.href.includes('?')) {
                        link.href = link.href.split('?')[0];
                    }
                }
            });
        }
    }

    // === DOM监视器类 ===
    class DOMWatcher {
        constructor() {
            this.observer = null;
            this.debouncedProcessAll = Utils.debounce(() => {
                Utils.log('DOM发生变化，重新扫描页面...');
                this.processNode(document.body);
            }, CONFIG.DEBOUNCE_DELAY);
        }

        processNode(node) {
            if (!Utils.isElement(node)) return;

            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/vpn/') && currentPath !== '/vpn/free.html') {
                ContentCleaner.hideSponsoredContent(node);
            }

            ContentCleaner.attachMenuListeners(node);
            ContentCleaner.hideSponsoredSidebarItems(node);
            ContentCleaner.hideSponsoredHomeActions(node);
            ContentCleaner.hideSponsoredMenuLinks(node);
            LinkCleaner.cleanLinks(node);
        }

        start() {
            Utils.log('脚本核心逻辑启动 (v6.0)。');
            this.processNode(document.body);

            this.observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        this.debouncedProcessAll();
                        return;
                    }
                }
            });

            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        stop() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }

    // === 应用程序主类 ===
    class NoFriendsApp {
        constructor() {
            this.styleManager = new StyleManager();
            this.domWatcher = new DOMWatcher();
        }

        init() {
            // 立即注入样式以防止闪屏
            this.styleManager.injectStyles();

            // 等待DOM准备就绪后启动主要功能
            if (document.readyState === 'loading') {
                window.addEventListener('DOMContentLoaded', () => {
                    this.domWatcher.start();
                });
            } else {
                this.domWatcher.start();
            }
        }
    }

    // === 应用程序启动 ===
    const app = new NoFriendsApp();
    app.init();

})();