// ==UserScript==
// @name         bilibili首页/热门页拉黑
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  B站首页/热门页拉黑。
// @author       yingming006
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://www.bilibili.com/v/popular/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545555/bilibili%E9%A6%96%E9%A1%B5%E7%83%AD%E9%97%A8%E9%A1%B5%E6%8B%89%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/545555/bilibili%E9%A6%96%E9%A1%B5%E7%83%AD%E9%97%A8%E9%A1%B5%E6%8B%89%E9%BB%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 常量与配置 ---
    const CONFIG = {
        API_URL: 'https://api.bilibili.com/x/relation/modify',
        CSRF_COOKIE_NAME: 'bili_jct',
        SELECTORS: {
            VIDEO_CARD: '.bili-video-card, .bili-feed-card, .video-card',
            AUTHOR_CONTAINER: '.bili-video-card__info--owner, .up-name',
            AUTHOR_LINK: 'a.bili-video-card__info--owner, a.up-name',
            VIDEO_LINK: 'a[href*="/video/BV"]',
        },
        BUTTON_CLASS: 'home-blacklist-btn-silent',
        PROCESSED_FLAG: 'data-blacklist-processed',
    };

    class BilibiliBlacklist {
        constructor() {
            this.videoDataMap = new Map();
            this.init();
        }



        init() {
            this.injectStyles();
            this.parseInitialState();
            this.scanAndProcess(document.body);

            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.scanAndProcess(node);
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }

        // ========================================================================
        // --- 核心逻辑 ---
        // ========================================================================

        scanAndProcess(rootElement) {
            const cards = rootElement.matches(CONFIG.SELECTORS.VIDEO_CARD)
                ? [rootElement]
                : rootElement.querySelectorAll(CONFIG.SELECTORS.VIDEO_CARD);

            for (const card of cards) {
                if (card.hasAttribute(CONFIG.PROCESSED_FLAG)) continue;
                card.setAttribute(CONFIG.PROCESSED_FLAG, 'true');
                this.addBlacklistButton(card);
            }
        }

        addBlacklistButton(card) {
            const fid = this.getFid(card);
            if (!fid) return;

            const authorContainer = card.querySelector(CONFIG.SELECTORS.AUTHOR_CONTAINER);
            if (!authorContainer || authorContainer.querySelector(`.${CONFIG.BUTTON_CLASS}`)) return;

            const btn = this.createButton();
            authorContainer.appendChild(btn);
            btn.addEventListener('click', (e) => this.handleBlacklistClick(e, card, fid));
        }

        async handleBlacklistClick(event, card, fid) {
            event.preventDefault();
            event.stopPropagation();

            const btn = event.currentTarget;
            btn.disabled = true;
            btn.textContent = '处理中';

            try {
                await this.addToBlacklist(fid);
                this.showNotification('拉黑成功');
                this.clearVideoCard(card);
            } catch (err) {
                if (err.message?.includes('已拉黑')) {
                    this.showNotification('该UP主已被拉黑');
                    this.clearVideoCard(card);
                } else {
                    this.showNotification(`操作失败: ${err.message}`, 'error');
                    console.error('B站拉黑脚本：操作失败', err);
                    btn.disabled = false;
                    btn.textContent = '拉黑';
                }
            }
        }

        // ========================================================================
        // --- 数据获取与API ---
        // ========================================================================

        parseInitialState() {
            try {
                const list = window.__INITIAL_STATE__?.popularData?.list;
                if (Array.isArray(list)) {
                    list.forEach(video => {
                        if (video.bvid && video.owner?.mid) {
                            this.videoDataMap.set(video.bvid, video.owner.mid);
                        }
                    });
                    console.log(`B站拉黑脚本：成功解析 ${this.videoDataMap.size} 条初始视频数据。`);
                }
            } catch (error) {
                console.error('B站拉黑脚本：解析 window.__INITIAL_STATE__ 失败。', error);
            }
        }

        getFid(card) {
            const authorLink = card.querySelector(CONFIG.SELECTORS.AUTHOR_LINK);
            if (authorLink?.href) {
                const match = authorLink.href.match(/space\.bilibili\.com\/(\d+)/);
                if (match) return match[1];
            }

            const videoLink = card.querySelector(CONFIG.SELECTORS.VIDEO_LINK);
            if (videoLink?.href) {
                const bvid = videoLink.href.match(/BV[a-zA-Z0-9_]+/)?.[0];
                if (bvid && this.videoDataMap.has(bvid)) {
                    return this.videoDataMap.get(bvid).toString();
                }
            }

            const vueInstance = card.__vue__ || card.__vueParentComponent?.ctx;
            const mid = vueInstance?.video?.owner?.mid ||
                        vueInstance?.archive?.owner?.mid ||
                        vueInstance?.videoData?.owner?.mid ||
                        vueInstance?.item?.mid ||
                        vueInstance?.item?.owner?.mid;
            return mid ? mid.toString() : null;
        }

        async addToBlacklist(fid) {
            const csrf = this.getCookieValue(CONFIG.CSRF_COOKIE_NAME);
            if (!csrf) throw new Error('未获取到CSRF Token');

            const response = await fetch(CONFIG.API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `fid=${fid}&act=5&re_src=11&gaia_source=web_main&csrf=${csrf}`,
                credentials: 'include',
            });

            if (!response.ok) throw new Error(`网络错误: ${response.status}`);

            const data = await response.json();
            if (data.code !== 0) {
                // 对-101错误码进行特殊处理，提供更友好的提示
                if (data.code === -101) throw new Error('账号未登录或登录状态已失效');
                throw new Error(data.message || `API错误代码: ${data.code}`);
            }

            return data;
        }

        getCookieValue(cookieName) {
            const name = cookieName + "=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            for(let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        }

        // ========================================================================
        // --- UI与样式 ---
        // ========================================================================

        createButton() {
            const btn = document.createElement('button');
            btn.className = CONFIG.BUTTON_CLASS;
            btn.textContent = '拉黑';
            return btn;
        }

        clearVideoCard(cardElement) {
            const cardHeight = cardElement.offsetHeight;
            cardElement.innerHTML = '';
            Object.assign(cardElement.style, {
                height: `${cardHeight}px`,
                background: '#f0f0f0',
                borderRadius: '6px',
                border: 'none',
                margin: window.getComputedStyle(cardElement).margin,
                display: 'block',
                transition: 'opacity 0.3s ease',
                opacity: '0.5'
            });
        }

        showNotification(message, type = 'success') {
            const containerId = 'userscript-notification-container';
            let container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                document.body.appendChild(container);
            }

            const notification = document.createElement('div');
            notification.className = `us-notification ${type === 'error' ? 'error' : ''}`;
            notification.textContent = message;
            container.appendChild(notification);

            requestAnimationFrame(() => notification.classList.add('show'));

            setTimeout(() => {
                notification.classList.remove('show');
                notification.addEventListener('transitionend', () => notification.remove(), { once: true });
            }, 3000);
        }

        injectStyles() {
            GM_addStyle(`
                .${CONFIG.BUTTON_CLASS} {
                    margin-left: 8px;
                    padding: 0 8px;
                    height: 20px;
                    line-height: 20px;
                    background-color: #F1F2F3;
                    color: #61666D;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: inherit;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    flex-shrink: 0;
                }
                .${CONFIG.BUTTON_CLASS}:hover {
                    background-color: #00A1D6;
                    color: #FFFFFF;
                }
                .${CONFIG.BUTTON_CLASS}:disabled {
                    background-color: #E3E5E7;
                    color: #9499A0;
                    cursor: not-allowed;
                }

                #userscript-notification-container {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 99999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                }
                .us-notification {
                    padding: 9px 16px;
                    border-radius: 6px;
                    background-color: rgba(0, 161, 214, 0.9);
                    color: #FFFFFF;
                    font-size: 14px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    opacity: 0;
                    transform: translateY(15px);
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                }
                .us-notification.error {
                    background-color: rgba(250, 80, 80, 0.9);
                }
                .us-notification.show {
                    opacity: 1;
                    transform: translateY(0);
                }
            `);
        }
    }

    if (window.requestIdleCallback) {
        window.requestIdleCallback(() => new BilibiliBlacklist());
    } else {
        setTimeout(() => new BilibiliBlacklist(), 500);
    }
})();