// ==UserScript==
// @name               移除 Outlook 侧边广告~dd
// @name:en            Remove Outlook Side Ads~dd
// @namespace          http://tampermonkey.net/
// @version            0.2
// @description        隐藏 Outlook 侧边和底侧广告, "开通 Premium" 按钮和 "开始会议" 按钮, 以及"其他"收件箱中的广告. (2023.8.28)
// @description:en     Hide Outlook side & bottom Ads, 'Upgrade to Premium' button and 'Meeting Now' button, and Ads in your "Other" inbox. (2023.8.28)
// @author             ddzzky,ReekyStive
// @match              https://outlook.live.com/*
// @grant              none
// @run-at             document-end
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/474085/%E7%A7%BB%E9%99%A4%20Outlook%20%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A~dd.user.js
// @updateURL https://update.greasyfork.org/scripts/474085/%E7%A7%BB%E9%99%A4%20Outlook%20%E4%BE%A7%E8%BE%B9%E5%B9%BF%E5%91%8A~dd.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeSideAndBottomAds = true;
    const removePremiumButton = true;
    const removeMeetingButton = true;

    let css = '';
    if (removeSideAndBottomAds) {
        css += '.GssDD { display: none !important; }'; //2023.8的规则
        css += '.pBKjV { display: none !important; }';
    }
    if (removePremiumButton) {
        css += '.ab0a0.evj9g { display: none !important; }'; //2023.8的规则(存在于"其他"收件箱)
        css += '.Ogt7j { display: none !important; }'; //2023.8的规则(存在于"其他"收件箱广告脚本执行完毕后)
        css += '.VPtFl { display: none !important; }';
    }
    if (removeMeetingButton) {
        css += '#owaMeetNowButton_container { display: none !important; }';
    }

    const style = document.createElement('style');
    style.innerHTML = css;
    document.body.appendChild(style);
})();