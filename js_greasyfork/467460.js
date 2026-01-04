// ==UserScript==
// @name         Remove Comic Ads
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove ads from boylove.cc and manwa.me
// @author       You
// @match        https://*boylove.cc/*
// @match        https://*boylove3.cc/*
// @match        https://*manwa.me/*
// @match        https://*manwa.fun/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467460/Remove%20Comic%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/467460/Remove%20Comic%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSS_HIDE = '{ display: none !important;}'
    const CSS_OPACITY_0 = '{ opacity: 0 !important; height: 0px !important;}'

    let selectorsToHide = ['#fake_avivid_waterfall_webpush1', '.a__gs_cy', '.fake_avivid_waterfall_webpush_active_left', '.normal-top:nth-of-type(1)', '.ad-area-close', '.ad-area-close ~ div', '.reader-cartoon-chapter iframe',
                           '.reader-book-read-wraper article div:first-child', '.index-banner', '.manga-list:first-of-type', '.manga-list-2:nth-of-type(1)', '.manga-list-title:nth-of-type(1)', '.index-marquee',
                          '.ifpopup_content', '.ifpopup_div', '.row.stui-pannel', '.blocked_hint_msg_pc', '#index-marquee-block', '.app_download', '.reader-home-swiper', '.reader-home-title-fixed',
                          '#temp_block_01 + div', '#temp_block_02 + div', '#temp_block_03 + div', '#temp_block_04 + div',
                          '.reader-zone-list-view.list.no-hairlines + div', 'iframe', '.guess_mh_list + div'
                          ];

    // use opacity 0 instead of display none since some websites may check the ads divs later
    let selectorsToOpacity = ['.ad-area'];

    addStyle(selectorsToHide, CSS_HIDE);

    addStyle(selectorsToOpacity, CSS_OPACITY_0);

    function addStyle(selectors, style = CSS_HIDE) {
        let str = ``
        if(selectors){
            for (let selector of selectors) {
                str += `${selector} ${style} `;
            }
        }

        console.log(`=======================${str}`)
        GM.addStyle(str);
    }

})();