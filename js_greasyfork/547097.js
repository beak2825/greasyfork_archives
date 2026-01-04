// ==UserScript==
// @name         网页净化器20250824
// @description  批量隐藏网页无用元素
// @version      1.0
// @namespace    https://greasyfork.org/users/1171320
// @author       yzcjd
// @author2      ChatGPT5 辅助
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547097/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96%E5%99%A820250824.user.js
// @updateURL https://update.greasyfork.org/scripts/547097/%E7%BD%91%E9%A1%B5%E5%87%80%E5%8C%96%E5%99%A820250824.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 关键词优先级
     */
    const keywordPriority = {
        'ad': 1,
        'footer': 2,
        'foot': 2,
        'banner': 3,
        'comment': 4,
        'cmt': 4,
        'chat': 5,
        'popup': 6,
        'pop': 6,
        'widget': 7,
        'share': 8,
        'social': 8,
        'other': 99
    };

    /**
     * 原始选择器
     * 重复的我会在后面加备注 /* 重复 * /
     */
    let rawSelectors = [
        "##.ad-content",
        "##.ad-global-bottom",
        "##.ad-global-top",
        "##.ad-module",
        "##.ad-page-content-bottom",
        "##.ad-page-setting",
        "##.ad-position-bottom",
        "##.ad-position-header",
        "##.ad-position-layer1",
        "##.ad-position-layer2",
        "##.ad-position-layer3",
        "##.ad-position-sidebar-vid-box",
        "##.ad-position-top",
        "##.ad-report",
        "##.banner",
        "##.banner-container",
        "##.banner-outer",
        "##.banner-post",
        "##.banner-related",
        "##.bottom-banner",
        "##.bottomLightBox",
        "##.bottom-footer",
        "##.bulletin_div",
        "##.Copyright",
        "##.copyright",
        "##.cmt_form",
        "##.comment-form",
        "##.comment_content",
        "##.comment_form",
        "##.comm_list_box",
        "##.comments-open",
        "##.comments-open-content",
        "##.cookies-banner",
        "##.cookies-reminder",
        "##.crisp-client",
        "##.custom-footer",
        "##.cw-footer",
        "##.db_foot",
        "##.fix.footinner",
        "##.foot",          /* 重复 footer */
        "###foot",          /* 重复 footer */
        "##.foot-nav-info",
        "##.footout",
        "##.footer",        /* 重复 footer */
        "##.footer-block",
        "##.footer-bottom",
        "##.footer-bottom-left",
        "##.footer-bottom-right",
        "##.footer-content",
        "##.footer-container",
        "###footer-container", /* 重复 footer-container */
        "##.footer-inner",
        "##.footer-links",
        "##.footer-navBox",
        "##.footer-wrapper",
        "##.footerContentWrapper",
        "##.footerWrapper",
        "##.footer_inner",
        "###footer",       /* 重复 footer */
        "##.footerbarContainer",
        "##.form-footer",
        "##.fotter",        /* 拼写错误，疑似 footer */
        "##.fottertheme",
        "##.fottertop1",
        "##.fottertop2",
        "##.friend_links",
        "##.gm-foot",
        "##.global-footer",
        "###global-nav-footer",
        "##.gpu-banner",
        "##.gpu-banner__wrapper",
        "###gpuTopBanner",
        "##.gpt-breaker-container",
        "###gpt-leaderboard-ad",
        "##.ibmdocs-copyright",
        "##.ibmdocs-footer",
        "##.ibmdocs-statement",
        "##.left-banner",
        "##.right-banner",
        "##.leftbanner",
        "##.rightbanner",
        "##.leftbannerw",
        "##.rightbannerw",
        "##.layout-room-top-banner",
        "##.messageboard",
        "##.myui-foot",
        "##.m1-foot",
        "##.m2-foot",
        "##.m3-foot",
        "##.m4-foot",
        "##.main-footer",
        "##.mapWrapper",
        "##.mgp_adRollContainer",
        "##.min.container",
        "##.m-footer",
        "##.m-footer-bg",
        "##.m-footer-content",
        "##.ntes_foot_link",
        "##.outlink",
        "##.page-footer",
        "##.pause-ad",
        "##.popUp.age18",
        "##.popup-container",
        "##.post-copyright-custom",
        "##.promotation-item",
        "##.promotedlink",
        "##.qa-footer",
        "##.right-banner",
        "##.sidebar-ads",
        "##.signup-footer",
        "##.site-footer",
        "##.stui-extra",
        "##.strip-ad",
        "##.time",
        "##.top-banner",
        "##.top1-link",
        "##.top2-link",
        "##.top3-link",
        "##.tuijianbox",
        "##.widget",       /* 重复 widget */
        "##widget",        /* 重复 widget */
        "##widget-visible",
        "##.widget__download-app",
        "##.widget__download-app--side",
        "##.widget__download-app__container",
        "##.wm_footer",
        "##.wwads-content",
        "##.wwads-horizontal",
        "##.wwads-poweredby",
        "###agreement-root",
        "###cp-footer",
        "###fbarcnt",
        "###footcnt",
        "###g-comment",
        "###g-nav",
        "###g-posts",
        "###portal-root",
        "###s-chat-plugin",
        "###sfooter",
        "###ss-chat-p"
    ];

    /**
     * 去重 & 排序
     */
    let uniqueSelectors = [...new Set(rawSelectors)];

    function getPriority(selector) {
        let lower = selector.toLowerCase();
        for (let key in keywordPriority) {
            if (lower.includes(key)) return keywordPriority[key];
        }
        return keywordPriority['other'];
    }

    uniqueSelectors.sort((a, b) => {
        let pa = getPriority(a), pb = getPriority(b);
        if (pa !== pb) return pa - pb;
        return a.localeCompare(b);
    });

    /**
     * 注入隐藏样式
     */
    let style = document.createElement('style');
    style.innerHTML = uniqueSelectors.join(',\n') + ' { display: none !important; }';
    document.head.appendChild(style);

    console.log("过滤器已加载，共隐藏:", uniqueSelectors.length, "个选择器（重复项已备注）");
})();
