// ==UserScript==
// @name         Poe 别乱
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  隐藏Poe主页上的机器人推荐元素。
// @author       小陈
// @match        https://poe.com/*
// @grant        none
// @icon         https://psc2.cf2.poecdn.net/assets/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/521851/Poe%20%E5%88%AB%E4%B9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/521851/Poe%20%E5%88%AB%E4%B9%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 白名单中不应隐藏的类名
    const whitelistClasses = [
        'SidebarItem_item__24u_X',
        'ChatSwitcher_hideCollapsed__6b8nz',
        'ChatHistoryListItem_wrapper__zuPNb',
        'SidebarItem_link__2LgCM',
    ];

    // 需要隐藏的特定类名
    const blacklistClasses = [
        'SidebarFooter_footer__3egHX',
        'ChatMessageFollowupActions_container__0Mrhg'
    ];

    /**
     * 检查一个元素是否包含白名单中的任何类
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    function isWhitelisted(element) {
        return whitelistClasses.some(cls => element.classList.contains(cls));
    }

    /**
     * 隐藏具有特定类名的元素，排除白名单中的元素
     */
    function hideElements() {
        // 隐藏主页推荐区域
        const homeRecommendations = document.querySelector('.ChatHomeMain_exploreBotsCarousel__wddju');
        if (homeRecommendations) {
            homeRecommendations.style.display = 'none';
        }

        // 隐藏官方推荐机器人部分，但排除白名单中的元素
        const sidebarSections = document.querySelectorAll('.SidebarSection_section__uBaAP');
        sidebarSections.forEach(section => {
            const headerElem = section.querySelector('h2, h3, h4') || section;
            const headerText = headerElem.textContent;

            if (headerText.includes('官方机器人') || headerText.includes('图片生成机器人')) {
                // 检查该部分是否包含白名单中的元素
                const containsWhitelisted = section.querySelector(whitelistClasses.map(cls => `.${cls}`).join(', '));
                if (!containsWhitelisted) {
                    section.style.display = 'none';
                }
            }
        });

        // 隐藏黑名单中的特定类名元素
        blacklistClasses.forEach(cls => {
            const elements = document.querySelectorAll(`.${cls}`);
            elements.forEach(element => {
                // 如果元素不在白名单中，则隐藏
                if (!isWhitelisted(element)) {
                    element.style.display = 'none';
                }
            });
        });
    }

    // 延迟执行，确保DOM完全加载
    setTimeout(hideElements, 1000);

    // 使用 MutationObserver 监控动态加载的内容
    const observer = new MutationObserver((mutations) => {
        hideElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();
