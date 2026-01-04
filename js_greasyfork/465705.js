// ==UserScript==
// @name             Hide Outlook Ads
// @name:CN          隐藏 Outlook 广告
// @namespace        https://ivanli.cc/
// @version          0.1.0
// @description      Hide mailing list, sidebar ads
// @description:CN   隐藏邮件列表、侧边栏广告
// @author           Ivan Li
// @match            https://outlook.live.com/mail/*
// @icon             https://www.google.com/s2/favicons?sz=64&domain=live.com
// @grant            none
// @run-at           document-body
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/465705/Hide%20Outlook%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/465705/Hide%20Outlook%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // outlook

    if (location.href.includes('outlook')) {
        setInterval(() => {
            const listAdItems = Array.from(document.querySelectorAll('[role=listbox] [id]')).filter(el => /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/.test(el.id));
            listAdItems.map(el => {el.style.display='none'});
            const rightAd = Array.from(document.querySelectorAll('[role="region"][data-app-section="NavigationPane"]~div')).reverse()[0];
            if (rightAd) {
                rightAd.style.display = 'none';
            }
            const premiumAds = Array.from(document.querySelectorAll('[role="region"][data-app-section="NavigationPane"] [data-focuszone-id]+div'));
            premiumAds.map(el => {el.style.display='none'});
        }, 1000);
    }
})();