// ==UserScript==
// @name         TikTok lite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean tiktok
// @author       You
// @match        https://www.tiktok.com/*
// @grant        none
// @icon      https://img.icons8.com/?size=512&id=118638&format=png
// @downloadURL https://update.greasyfork.org/scripts/540035/TikTok%20lite.user.js
// @updateURL https://update.greasyfork.org/scripts/540035/TikTok%20lite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Chặn các phần tử sử dụng CSS selector
    const hideElements = () => {
        const selectors = [
            '.e1u58fka2.css-m8ow1x-DivFixedContentContainer',
        'article.eogpv4e0.css-zpbg2p-ArticleItemContainer > .eogpv4e1.css-50hilk-DivContentFlexLayout > .ees02z00.css-16g1ej4-SectionActionBarContainer',
        '.eogpv4e1.css-1e5ikky-DivContentFlexLayout > .ees02z00.css-16g1ej4-SectionActionBarContainer',
        'article.eogpv4e0.css-xegf27-ArticleItemContainer > .eogpv4e1.css-50hilk-DivContentFlexLayout > .ees02z00.css-16g1ej4-SectionActionBarContainer',
        '#one-column-item-18 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh1.css-185a8ij-DivAnchorTagContainer > .e1sksq2r0.css-1483eyc-DivAnchorTagWrapper > .e1sksq2r5.css-xxrign-DivAnchorTag',
        '#one-column-item-10 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh1.css-185a8ij-DivAnchorTagContainer > .e1sksq2r0.css-1483eyc-DivAnchorTagWrapper > .e1sksq2r5.css-xxrign-DivAnchorTag',
        '#one-column-item-10 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div',
        '.e4x3x653.css-bcj5ai-DivActionBarContainer',
        '.css-1rxmjnh.action-item.TUXButton--secondary.TUXButton--medium.TUXButton--capsule.TUXButton',
        '.e1sksq2r5.css-xxrign-DivAnchorTag',
        '#one-column-item-9 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom',
        '.e1u58fka5.css-10pqo95-DivScrollingContentContainer',
        '#one-column-item-13 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div',
        '#one-column-item-14 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div',
        '#one-column-item-15 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div > .exnv47g0.css-bkapkt-DivDescriptionWrapper > .e1ozkfi0.css-8w2ykf-DivMultilineTextContainer > .e1ozkfi1.css-1g163yh-DivMultilineText > .ejg0rhn1.css-6yud38-DivDescriptionContentContainer',
        '#one-column-item-17 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div',
        '#one-column-item-16 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom',
        '#one-column-item-18 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom',
        '#one-column-item-19 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom',
        '#one-column-item-20 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom',
        '#one-column-item-21 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div',
        '#one-column-item-22 > .e16pyws83.css-9b8api-BasePlayerContainer-DivVideoPlayerContainer > .e1qm78nh0.css-hvwz0s-DivMediaCardBottom > .e1qm78nh5.css-e328ha-DivInlineMusicAndIconContainer > div'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.style.display = 'none'; // Ẩn phần tử
            });
        });
    };

    // Chạy hàm ẩn phần tử khi trang tải
    window.addEventListener('load', hideElements);

    // Cập nhật khi có thay đổi động trên trang
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();
