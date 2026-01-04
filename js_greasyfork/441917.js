// ==UserScript==
// @name         哔哩哔哩去除弹幕投票器与一键三连提示器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去除弹幕投票器与一键三连提示器
// @author       tuntun
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441917/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8%E5%99%A8%E4%B8%8E%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E%E6%8F%90%E7%A4%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441917/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%BC%B9%E5%B9%95%E6%8A%95%E7%A5%A8%E5%99%A8%E4%B8%8E%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E%E6%8F%90%E7%A4%BA%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let styleStr = `
    .bilibili-player-video-popup-vote {
      display: none !important;
    }
    .bilibili-player-video-popup-guide-all {
      display: none !important;
    }
  `
  let body = document.body;
  let styleDom = document.createElement('style');
  styleDom.id = 'tuntun-bilibili-delete-vote'
  styleDom.innerHTML = styleStr;
  body.appendChild(styleDom);
})();