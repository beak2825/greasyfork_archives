// ==UserScript==
// @name         跳过B站充电提示
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  可以在视频结尾跳过冗长的5秒B站充电提示(只是方便视频流利播放，如损害开发商利益请联系，确认官方号马上删除)
// @author       yehuda
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @match      *://www.bilibili.com/video/av*
// @match      *://www.bilibili.com/video/BV*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443364/%E8%B7%B3%E8%BF%87B%E7%AB%99%E5%85%85%E7%94%B5%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443364/%E8%B7%B3%E8%BF%87B%E7%AB%99%E5%85%85%E7%94%B5%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (document.getElementsByTagName('video').item(0)) {
    document.getElementsByTagName('video').item(0).onended=()=>{document.getElementsByClassName('bilibili-player-video-btn-next').item(0).click()};
    console.log(
	'%c 已启用 %c 跳过B站充电脚本 %c',
	'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
	'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #000',
	'background:transparent'
)
  }
})();