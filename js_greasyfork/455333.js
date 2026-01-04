// ==UserScript==
// @name        F键全屏播放视频
// @namespace   Violentmonkey Scripts
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAMklEQVR4nGJZ8LiXgZaAiaamj1owasGoBaMWjFowasGoBaMWjFowasGoBVQEgAAAAP//s/kCU8RdtEcAAAAASUVORK5CYII=
// @version     0.1.9
// @author      MetalDudu
// @match       https://*.thepaper.cn/*
// @match       https://www.aliyundrive.com/*
// @match       https://www.miguvideo.com/*
// @match       https://www.douban.com/people/*
// @match       https://v.youku.com/*
// @match       https://www.ixigua.com/*
// @match       https://www.huxiu.com/*
// @match       https://open.163.com/*
// @match       https://www.toutiao.com/*
// @match       https://v.qq.com/*
// @description 支持网站：澎湃、阿里云盘、咪咕视频、豆瓣广播、优酷、西瓜视频、虎嗅、网易公开课、头条、腾讯视频
// @description 默认支持F键全屏的网站：爱奇艺、B站、新浪微博
// @license MIT
// @description 2023-12-05
// @downloadURL https://update.greasyfork.org/scripts/455333/F%E9%94%AE%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/455333/F%E9%94%AE%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

const getSiteName = hostname => hostname.match(/([^\.]+)\.[^\.]+$/)[1];

(function () {
  'use strict';

  const siteName = getSiteName(location.hostname);

  window.onkeydown = function (event) {
    if (event.key === "f" || event.key === "F") {
      let selector;

      if (siteName === 'ixigua') {
        // 尝试通过 xgplayer-control-item__entry 类名找到全屏按钮的最后一个元素
        const arr1 = document.getElementsByClassName("xgplayer-control-item__entry");
        arr1[arr1.length-1].click();
      } else {
        switch (siteName) {
          case 'thepaper':
            selector = ".dplayer-icon.dplayer-full-icon";
            break;
          case 'aliyundrive':
            selector = ".action--HeWYA";
            break;
          case 'miguvideo':
            selector = ".btn-bg.zoom-out";
            break;
          case 'toutiao':
            selector = ".xgplayer-fullscreen";
            break;
          case 'douban':
          case '163':
            selector = ".vjs-fullscreen-control.vjs-control.vjs-button";
            break;
          case 'youku':
            selector = ".kui-fullscreen-icon-0";
            break;
          case 'huxiu':
            selector = ".plyr__control";
            break;
          case 'qq':
            selector = ".txp_btn.txp_btn_fullscreen";
            break;
          default:
            selector = null;
        }
      }

      if (selector) {
        document.querySelector(selector).click();
      }
    }
  }
})();

