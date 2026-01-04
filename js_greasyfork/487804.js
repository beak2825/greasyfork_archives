// ==UserScript==
// @name         隐藏web端b站广告,微博广告
// @namespace    http://tampermonkey.net/
// @version      1.0.17
// @description  隐藏web端bilibili首页卡片广告
// @author       weiye
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        weibo.com
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487804/%E9%9A%90%E8%97%8Fweb%E7%AB%AFb%E7%AB%99%E5%B9%BF%E5%91%8A%2C%E5%BE%AE%E5%8D%9A%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/487804/%E9%9A%90%E8%97%8Fweb%E7%AB%AFb%E7%AB%99%E5%B9%BF%E5%91%8A%2C%E5%BE%AE%E5%8D%9A%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let style = document.createElement('style');
  style.innerHTML = `
    .palette-button-wrap .fixed-card {
      display: none;
    }
    .feed-card .bili-video-card, .bili-video-card.is-rcmd {
      visibility: hidden;
    }
    .feed-card .bili-video-card.enable-no-interest, .bili-video-card.is-rcmd.enable-no-interest {
      visibility: visible;
    }
    .floor-single-card {
      visibility: hidden;
    }
    .bili-video-card:has(svg.bili-video-card__info--creative-ad) {
      visibility: hidden;
    }
    .bili-video-card:has(div.bili-video-card__info--ad) {
      visibility: hidden;
    }
    .bili-video-card:has(svg.bili-video-card__info--ad) {
      visibility: hidden;
    }

    .feed-card:has(svg.bili-video-card__info--creative-ad) {
      visibility: hidden;
    }
    .feed-card:has(div.bili-video-card__info--ad) {
      visibility: hidden;
    }
    
    .vue-recycle-scroller__item-view:has(div.wbpro-tag) {
      display: none;
    }
    .vue-recycle-scroller__item-view:has(div.wbpro-tag-img) {
      display: none;
    }
  `;
  document.body.appendChild(style);
})();