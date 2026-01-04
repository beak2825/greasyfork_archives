// ==UserScript==
// @name         斗鱼去广告Style
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  去除部分斗鱼播放器广告
// @author       You
// @match        https://www.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/471108/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8AStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/471108/%E6%96%97%E9%B1%BC%E5%8E%BB%E5%B9%BF%E5%91%8AStyle.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const selectors = [
    '#js-room-activity',
    '#js-player-video .ScreenBannerAd',
    '.RedEnvelopAd',
    '.layout-Player-toolbar .AnchorPocketTips',
    '.layout-Player-toolbar .PlayerToolbar-Task',
    '.layout-Player-toolbar .ActiviesExpanel',
    '.layout-Player-toolbar .ToolbarActivityArea',
    '.layout-Player-toolbar .PlayerToolbar-ContentCell:not(.is-full)',
    '.PlayerToolbar-couponInfo',
    '.Title-roomInfo .Title-row:nth-child(3)',
    '.Bottom-ad',
  ];

  let css = `
   ${selectors.join(', ')}{
      display:none !important;
    }
  `;
  GM_addStyle(css);
  // Your code here...
})();
