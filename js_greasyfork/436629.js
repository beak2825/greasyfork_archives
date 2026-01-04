// ==UserScript==
// @name         不显示B站直播间活动皮肤
// @version      0.0.2
// @description  Jump to the simple version of the live broadcast room.
// @description:zh-cn  让有活动皮肤的B站直播间，跳转到直播间原始样式，还原简洁的观看体验。
// @author       binsee
// @namespace    https://github.com/binsee/tampermonkey-scripts
// @supportURL   https://github.com/binsee/tampermonkey-scripts/issues
// @license      GPL
// @run-at       document-end
// @noframes
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436629/%E4%B8%8D%E6%98%BE%E7%A4%BAB%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B4%BB%E5%8A%A8%E7%9A%AE%E8%82%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/436629/%E4%B8%8D%E6%98%BE%E7%A4%BAB%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%B4%BB%E5%8A%A8%E7%9A%AE%E8%82%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';
  if (window.__initialState?.BaseInfo?.__activity_id) {
    const tmp = window.location.pathname.match(/^\/(\d+)/)
    const roomId = tmp ? tmp[1] : window.__initialState['live-non-revenue-player'][0].defaultRoomId
    const url = 'https://live.bilibili.com/blanc/' + roomId
    console.log('【不要显示B站直播活动皮肤】', '即将跳转到', url)
    window.location.href = url
  }
})();