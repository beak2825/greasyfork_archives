// ==UserScript==
// @name         通用屏蔽广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  通用屏蔽广告!
// @author       You
// @match        https://*.cn/*
// @match        http://*.com/*
// @match        https://*.com/*
// @match        https://*.org/*
// @match        https://*.net/*
// @match        https://*.info/*
// @match        https://*.vip/*
// @grant        GM_addStyle
// @license      Xavier
// @downloadURL https://update.greasyfork.org/scripts/455760/%E9%80%9A%E7%94%A8%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/455760/%E9%80%9A%E7%94%A8%E5%B1%8F%E8%94%BD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

GM_addStyle(
    'html{-webkit-filter: grayscale(0%) !important}' +
    '#adsbygoogle,.adsbygoogle,#google-auto-placed,.google-auto-placed{display: none !important;}' +
    '#carbonads,.carbonads,#carbon-ads,.carbon-ads,#carbon-ad,.carbon-ad{display: none !important;}' +
    '#ad-content,.ad-content{display: none !important;}' +
    '#at4-whatsnext,.at4-whatsnext{display: none !important;}' +
    '#ad-container,.ad-container{display: none !important;}' +
    '#ad_before_content,.ad_before_content,.blog-slide-ad-box,.picture-ad{display: none !important;}' +
    '#tipsa_ds,.tipsa_ds{display: none !important;}' +
    '#ad-disclaimer-container,.ad-disclaimer-container{display: none !important;}' +
    '[id^="google_ads"],[class^="google_ads"]{display: none !important;}' +
    '[id^="wwads"],[class^="wwads"]{display: none !important;}' +
    '[id^="advert"],[class^="advert"]{display: none !important;}' +
    '[id^="topads"],[class^="topads"]{display: none !important;}' +
    '#google-auto-placed,.google-auto-placed{display: none !important;}' +


    '#page-relative,#page-copyright,#popupLead,.OpenInAppButton,.weixin-shadowbox,.wap-shadowbox,ios-shadowbox,div[tpl=recommend_list]{display: none !important;}'
);
(function() {
    'use strict';
    // Your code here...
    window.onload = function() {
        if(typeof isPoped!='undefined') isPoped = true;
    }
})();