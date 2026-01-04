// ==UserScript==
// @name         Bilibili净化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽B站的广告和推广视频，优化页面布局样式。
// @author       wang1122
// @match        *://www.bilibili.com/*
// @match        *://t.bilibili.com/*
// @match        *://search.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519273/Bilibili%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519273/Bilibili%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加布局相关样式
    GM_addStyle(`
        /* 布局相关样式 */
        .bili-header__channel {
            height: 20px !important;
            min-height: 20px !important;
        }

        .bili-header__bar {
            display: flex !important;
            justify-content: flex-end !important;
            width: 100% !important;
        }

        /* 导航栏样式 */
        .right-entry {
            margin-left: auto !important;
            display: flex !important;
            align-items: center !important;
        }

        .inner-logo .logo-img {
            display: flex !important;
            align-items: center !important;
            height: 36px !important;
            width: auto !important;
        }

    `);

    const AD_SELECTORS = {
        common: [
            '.adcard-content',                 // 主页右侧广告
            '.recommended-swipe',              // 主页轮播广告
            '.left-entry',                     // 主页左侧导航栏
            '.trending',                       // 搜索栏热搜
            '.channel-icons',                  // 导航栏左侧图标
            '.right-channel-container',        // 导航栏右侧容器
            '.floor-single-card',              // 视频卡片
            '.header-channel',                 // 顶部导航栏
            '.flexible-roll-btn',              // 右下角刷新内容按钮
            '.desktop-download-tip',           // 下载桌面端弹窗
            '.new-charge-btn',                 // 充电按钮
            'slide_ad',                        // 视频页右侧广告
            '.video-card-ad-small',            // 视频页右侧广告
            '.video-page-special-card-small',  // 视频页右侧广告
            '.ad-report',                      // 视频推荐上下的广告
            '.pop-live-small-mode',            // 推荐视频下方直播
            '.activity-m-v1',                  // 视频页标签下方广告
            '.video-ai-assistant',             // AI助手
            '#biliMainFooter',                 // 搜索页底部广告
        ],
        dynamicPage: [
            '.bili-dyn-ads',                   // 动态页右侧广告
            '.sticky',                         // 动态页右侧话题
        ],
        shadowDOM: {
            commentAd: {
                path: ['#commentapp > bili-comments', '#header > bili-comments-header-renderer', '#notice'],
                description: '评论区顶部广告',
            },
        },
    };

    const utils = {
        hideElement(element) {
            if (element) {
                element.style.display = 'none';
            }
        },

        querySelectorAll(selector) {
            return Array.from(document.querySelectorAll(selector));
        },

        processShadowDOM(pathSelectors) {
            let currentElement = document;
            for (const selector of pathSelectors) {
                if (!currentElement) break;
                currentElement = currentElement instanceof Document
                    ? currentElement.querySelector(selector)
                    : currentElement.shadowRoot?.querySelector(selector);
            }
            return currentElement;
        },
    };

    const adHandler = {
        hideCommonAds() {
            AD_SELECTORS.common.forEach(selector => {
                const elements = selector.startsWith('.')
                    ? document.getElementsByClassName(selector.substring(1))
                    : [document.getElementById(selector.replace('#', ''))];

                Array.from(elements).forEach(utils.hideElement);
            });
        },

        hideDynamicPageAds() {
            if (window.location.hostname === 't.bilibili.com') {
                AD_SELECTORS.dynamicPage.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    Array.from(elements).forEach(utils.hideElement);
                });
            }
        },

        hideShadowDOMAds() {
            Object.values(AD_SELECTORS.shadowDOM).forEach(({ path }) => {
                const element = utils.processShadowDOM(path);
                utils.hideElement(element);
            });
        },

        hideAdVideoCard() {
            const hostname = window.location.hostname;

            if (hostname === 'www.bilibili.com') {
                utils.querySelectorAll('.feed-card').forEach(card => {
                    if (!card.querySelector('.enable-no-interest')) {
                        utils.hideElement(card);
                    }
                });

                Array.from(document.getElementsByClassName('bili-video-card')).forEach(card => {
                    if (!card.classList.contains('enable-no-interest')) {
                        utils.hideElement(card);
                    }
                });
            } else if (hostname === 'search.bilibili.com') {
                utils.querySelectorAll('.col_3.col_xs_1_5.col_md_2.col_xl_1_7.mb_x40').forEach(card => {
                    if (card.querySelector('a[href^="//cm.bilibili.com"]')) {
                        utils.hideElement(card);
                    }
                });
            }
        },
    };

    const logoHandler = {
        move() {
            const logo = document.querySelector('.bili-header__banner .inner-logo');
            const searchContainer = document.querySelector('.bili-header__bar .center-search-container');

            if (logo && searchContainer) {
                const logoContainer = document.createElement('div');
                logoContainer.style.marginRight = '20px';
                logoContainer.appendChild(logo);
                searchContainer.parentNode.insertBefore(logoContainer, searchContainer);
            }
        },
    };

    function main() {
        adHandler.hideCommonAds();
        adHandler.hideDynamicPageAds();
        adHandler.hideShadowDOMAds();
        adHandler.hideAdVideoCard();
    }

    document.addEventListener('DOMContentLoaded', main);

    const mainObserver = new MutationObserver(main);
    mainObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });

    const logoObserver = new MutationObserver(logoHandler.move);
    logoObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
