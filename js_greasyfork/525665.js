// ==UserScript==
// @name         🛠️B站过滤广告视频/推广视频
// @namespace    https://greasyfork.org/scripts/467384
// @version      2.1
// @description  多规则过滤B站推荐内容（类名过滤｜粉丝数过滤｜SVG标记过滤）
// @author       anonymous
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      GNU GPL v3
// @downloadURL https://update.greasyfork.org/scripts/525665/%F0%9F%9B%A0%EF%B8%8FB%E7%AB%99%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/525665/%F0%9F%9B%A0%EF%B8%8FB%E7%AB%99%E8%BF%87%E6%BB%A4%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%E6%8E%A8%E5%B9%BF%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区域 =================
    const CONFIG = {
        FILTERS: {
            CLASS_NAME: {  // 类名过滤
                ENABLED: true,
                TARGETS: ['floor-single-card', 'bili-live-card is-rcmd']
            },
            FOLLOWERS: {   // 粉丝数过滤
                ENABLED: true,
                MIN_FOLLOWERS: 1000,
                API: 'https://api.bilibili.com/x/relation/stat?vmid='
            },
            SVG_MARKER: {  // SVG标记过滤
                ENABLED: true,
                SELECTOR: '.bili-video-card__stats > svg'
            }
        },
        THROTTLE_DELAY: 300
    };

    // ================= 状态管理 =================
    let processedCards = 0;
    let isBlockCardsRunning = false;

    // ================= 过滤规则集 =================
    const FILTER_RULES = {
        /* 规则1: 类名匹配过滤 (原始过滤规则) */
        filterByClassName(card) {
            if (!CONFIG.FILTERS.CLASS_NAME.ENABLED) return false;
            return CONFIG.FILTERS.CLASS_NAME.TARGETS.some(className =>
                card.classList.contains(className.replace(/\s+/g, '.'))
            );
        },

        /* 规则2: UP主粉丝数过滤 (原始过滤规则) */
        async filterByFollowers(card) {
            if (!CONFIG.FILTERS.FOLLOWERS.ENABLED) return false;

            const getUid = () => {
                const ownerLink = card.querySelector('.bili-video-card__info--owner');
                return ownerLink?.href.split('/').pop() || null;
            };

            const uid = getUid();
            if (!uid || !uid.match(/^\d+$/)) return true; // UID异常时过滤

            try {
                const response = await fetch(`${CONFIG.FILTERS.FOLLOWERS.API}${uid}`);
                const { code, data } = await response.json();
                return code === 0 && data.follower < CONFIG.FILTERS.FOLLOWERS.MIN_FOLLOWERS;
            } catch {
                return false;
            }
        },

        /* 规则3: SVG标记过滤 (新增过滤规则) */
        filterBySVGMarker(card) {
            if (!CONFIG.FILTERS.SVG_MARKER.ENABLED) return false;
            return !!card.querySelector(CONFIG.FILTERS.SVG_MARKER.SELECTOR);
        }
    };

    // ================= 核心处理逻辑 =================
    async function processCards() {
        if (isBlockCardsRunning) return;
        isBlockCardsRunning = true;

        const cards = document.querySelectorAll(`
            .bili-video-card.is-rcmd,
            .floor-single-card,
            .bili-live-card.is-rcmd
        `);

        for (let i = processedCards; i < cards.length; i++) {
            const card = cards[i];

            // 并行执行所有过滤检查
            const [isClassMatch, isFollowerMatch, isSvgMatch] = await Promise.all([
                FILTER_RULES.filterByClassName(card),
                FILTER_RULES.filterByFollowers(card),
                FILTER_RULES.filterBySVGMarker(card)
            ]);

            // 任一规则命中即隐藏
            if (isClassMatch || isFollowerMatch || isSvgMatch) {
                console.log(card, isClassMatch, isFollowerMatch, isSvgMatch);

                card.style.cssText = `
                    display: none !important;
                    visibility: hidden !important;
                `;

                continue;
            }

            processedCards++;
        }

        isBlockCardsRunning = false;
    }

    // ================= 性能优化工具 =================
    const throttle = (fn, delay) => {
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    };

    // ================= 事件监听器 =================
    const optimizedProcess = throttle(processCards, CONFIG.THROTTLE_DELAY);

    // 动态内容监听
    new MutationObserver(optimizedProcess)
        .observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

    // 用户交互监听
    window.addEventListener('scroll', optimizedProcess);
    window.addEventListener('resize', optimizedProcess);

    // 初始执行
    processCards();

})();