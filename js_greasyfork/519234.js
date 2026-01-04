// ==UserScript==
// @name         Bilibili 首页小优化
// @namespace    http://tampermonkey.net/
// @version      2024-11-29.1
// @description  对 Bilibili 首页小优化
// @author       HBcao233
// @match        http*://*.bilibili.com
// @match        http*://*.bilibili.com/?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519234/Bilibili%20%E9%A6%96%E9%A1%B5%E5%B0%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519234/Bilibili%20%E9%A6%96%E9%A1%B5%E5%B0%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let s = document.createElement('style');
    s.innerHTML = `.adblock-tips {
      display: none !important;
    }

    .bili-video-card__wrap,
    .bili-live-card__wrap {
      background: var(--bg1_float);
      border-radius: 6px;
      transition: background-color .2s;
    }
    .bili-live-card__wrap .bili-live-card__info {
      height: unset;
    }
    .bili-video-card__wrap:hover,
    .bili-live-card__wrap:hover {
      background: var(--bg2_float)
    }
    .floor-card-inner > .pb-16 {
      padding-bottom: 4px;
    }
    .bili-video-card__info--bottom{
      padding-bottom: 4px;
    }

    .recommended-container_floor-aside .container > * {
      display: revert !important;
      margin-top: 0 !important;
    }
    .recommended-container_floor-aside .container > .recommended-swipe {
      display: none !important;
    }
    .bili-video-card.is-rcmd:not(.enable-no-interest), .feed-card:has(.bili-video-card.is-rcmd:not(.enable-no-interest)) {
      display: none !important;
    }

    .single-card.floor-card {
      z-index: unset !important;
      border: none !important;
    }`;
    document.body.after(s);
})();