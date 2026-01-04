// ==UserScript==
// @name         cleanLiveMailAds
// @name:zh-CN   outlook邮箱侧边栏去除
// @namespace    http://tampermonkey.net/
// @version      0.28
// @description  strip outlook mail sidebar ads
// @description:zh-CN  去除outlook 邮箱侧边栏广告
// @author       mooring@codernotes.club
// @match        https://outlook.live.com/*
// @icon         https://www.google.com/s2/favicons?domain=live.com
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426935/cleanLiveMailAds.user.js
// @updateURL https://update.greasyfork.org/scripts/426935/cleanLiveMailAds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var css = '#MainModule+.GssDD > div[style*="width:"],#MainModule > div > div > div[class*=css-] + div,#MainModule [role="region"] .ms-FocusZone+div,[role="complementary"] [role="region"] .customScrollBar[data-is-scrollable] > div > div:not([data-convid]),#MailList .customScrollBar>div>div:has(div+button),#MailList .customScrollBar>div>div:has(div>i[data-icon-name="MailDismissRegular"]){display:none!important}';
    css += '#MainModule .customScrollBar>div[style]>div:has(div>i[title="Remove"]){pointer-events:none!important;opacity: 0.3!important;}'
    var style = document.createElement('style');
    style.innerText = css;
    document.body.appendChild(style)
})();