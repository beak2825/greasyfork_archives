// ==UserScript==
// @name         B站广告高亮器
// @namespace    http://00ue.com/
// @version      1.1
// @description  高亮bilibili首页广告卡片，为广告内容提供醒目标识，以便于吸引用户注意力。
// @author       阿盛的世界
// @match        https://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532261/B%E7%AB%99%E5%B9%BF%E5%91%8A%E9%AB%98%E4%BA%AE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532261/B%E7%AB%99%E5%B9%BF%E5%91%8A%E9%AB%98%E4%BA%AE%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 广告检测器
    const isAdElement = (card) => {
        // 类型1：包含广告文字
        const adText = card.querySelector('.bili-video-card__stats--text');
        if (adText?.textContent?.trim() === '广告') return true;

        // 类型2：包含广告图标
        const adIcon = card.querySelector('svg.vui_icon.bili-video-card__stats--icon');
        return !!adIcon;
    };

    // 高亮样式
    GM_addStyle(`
        .bili-ad-marked {
            position: relative !important;
            box-shadow: 0 0 10px red !important;
        }
        .bili-ad-marked::before {
            content: "⚠️ 广告标识 ⚠️";
            position: absolute;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 30px 4px;
            border-radius: 4px;
            z-index: 3;
            font-size: 16px;
        }
    `);

    // 标记广告
    const markAds = () => {
        document.querySelectorAll('.bili-video-card').forEach(card => {
            if (isAdElement(card) && !card.classList.contains('bili-ad-marked')) {
                card.classList.add('bili-ad-marked');
                console.log('已标记广告卡片:', card);
            }
        });
    };

    // 动态监听
    new MutationObserver(mutations => {
        markAds();
    }).observe(document, {
        childList: true,
        subtree: true
    });

    // 初始执行
    markAds();
})();