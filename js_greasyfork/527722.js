// ==UserScript==
// @name         Bilibili Cleaner
// @namespace    https://github.com/BLIpage/Bilibili-Cleaner
// @version      3.0.1
// @description  删除 B 站页面上的指定元素
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527722/Bilibili%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/527722/Bilibili%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeRules = {
        'common': [
            "left-entry",
            "nav-search-input",
            "search-panel"
        ],
        'https://www.bilibili.com/': [
            "left-entry",
            "nav-search-input",
            "search-panel",
            "palette-button-outer",
            "palette-feed4"
        ],
        'https://t.bilibili.com/': [
            "bili-dyn-live-users__more",
            "bili-dyn-publishing",
            "bili-dyn-up-list",
            "bili-dyn-list-tabs__list",
            "right",
            "bili-dyn-sidebar",
            "bili-dyn-item__ornament",
            "bili-rich-text-module goods",
            "bili-dyn-content__orig__additional",
            "brt-placeholder",
            "_cardBg_1aw9v_13"
        ],
        'https://www.bilibili.com/video': [
            "slide-ad-exp",
            "rcmd-tab",
            "video-ai-assistant video-toolbar-right-item toolbar-right-ai minisize",
            "_cardBg_1aw9v_13",
            "bpx-player-ending-panel",
            "bili-comments-bottom-fixed-wrapper"
        ],
        'https://www.bilibili.com/opus': [
            "_cardBg_1aw9v_13",
            "bili-comments-bottom-fixed-wrapper"
        ],
        'live': [
            "follow-ctnr p-relative enable-dark",
            "lower-row",
            "live-skin-coloration-area p-relative rank-list-section new",
            "section-block f-clear z-section-blocks",
            "p-relative z-sidebar contain-optimize",
            "icon-right-part",
            "link-footer-ctnr z-link-footer-ctnr"
        ],
        'bangumi': [
            "paybar_container__WApBR",
            "recommend_wrap__PccwM",
            "_cardBg_1aw9v_13",
            "bili-comments-bottom-fixed-wrapper",
            "navTools_floatNavExp__iNll7"
        ]
    };

    function removeElements(selectors) {
        selectors.forEach(selector => {
            document.querySelectorAll('.' + selector).forEach(el => el.remove());
        });
    }

    function observeAndRemove(selectors) {
        const observer = new MutationObserver(() => removeElements(selectors));
        observer.observe(document.body, { childList: true, subtree: true });
    }

    const url = window.location.href;
    removeElements(removeRules['common']);
    observeAndRemove(removeRules['common']);

    for (let key in removeRules) {
        if (url === key || url.startsWith(key + '/')) {
            removeElements(removeRules[key]);
            observeAndRemove(removeRules[key]);
        }
    }

    if (url === "https://www.bilibili.com/") {
        document.body.childNodes.forEach(node => {
            if (node.classList && !node.classList.contains("bili-header__bar")) {
                node.remove();
            }
        });
    }
})();
