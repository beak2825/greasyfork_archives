// ==UserScript==
// @name BilibiliEnhanced
// @name:CN-zh_cn BilibiliEnhanced
// @version 0.7
// @description bilibili相关
// @author gaojr
// @namespace https://github.com/gaojr/scripts-styles
// @license MIT
// @match *.bilibili.com/*
// @grant none
// @connect www.bilibili.com
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/380783/BilibiliEnhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/380783/BilibiliEnhanced.meta.js
// ==/UserScript==

(function () {
  // 根据网速自己设置时间间隔
  var delay = 5000;
  setTimeout(function () {
    var url = window.location.href;
    var home = /www.bilibili.com\/$/;
    var video = /www.bilibili.com\//;
    var live = /live.bilibili.com/;
    if (home.test(url)) {
      // 首页-删除广告
      $('.adpos').remove();
      $('.gg-floor-module').remove();
    } else if (video.test(url)) {
      // 视频-宽屏
      $('.bilibili-player-video-btn-widescreen').click();
      // 视频-关闭弹幕
      $('.bilibili-player-video-danmaku-switch .bui-checkbox').click();
    } else if (live.test(url)) {
      // 直播-关闭弹幕
      $('.bilibili-live-player-video-controller-hide-danmaku-btn .blpui-btn.icon-btn').click();
    }
  }, delay);
})();
