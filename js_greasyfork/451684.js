// ==UserScript==
// @name               Remove Outlook Side Ads
// @name:zh-CN         移除 Outlook 侧边广告
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        Remove Outlook side & bottom Ads, 'Upgrade to Premium' button and 'Meeting Now' button
// @description:zh-CN  移除 Outlook 侧边和底侧广告, "开通 Premium" 按钮和 "开始会议" 按钮
// @author             ReekyStive
// @match              https://outlook.live.com/*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=live.com
// @grant              none
// @run-at             document-body
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/451684/Remove%20Outlook%20Side%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/451684/Remove%20Outlook%20Side%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeSideAndBottomAds = true;
    const removePremiumButton = true;
    const removeMeetingButton = true;

    let css = '';
    if (removeSideAndBottomAds) {
        css += '.pBKjV { display: none !important; }';
    }
    if (removePremiumButton) {
        css += '.VPtFl { display: none !important; }';
    }
    if (removeMeetingButton) {
        css += '#owaMeetNowButton_container { display: none !important; }';
    }

    const style = document.createElement('style');
    style.innerHTML = css;
    document.body.appendChild(style);
})();
