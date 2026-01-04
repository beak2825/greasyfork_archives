// ==UserScript==
// @name         《弹幕世界2》 B 站启动器
// @namespace    danmakucraft.com
// @version      0.5
// @description  在 B 站播放器内玩《弹幕世界2》：https://www.bilibili.com/video/av19771370/。官网：https://danmakucraft.com
// @author       yehzhang
// @include      /^http(s)?:\/\/www\.bilibili\.com\/video\/(av19771370|BV1GW41177LA)((\?|\/)(.*))?$/
// @include      /^http(s)?:\/\/www\.bilibili\.com\/blackboard\/html5player\.html\?aid=19771370&cid=32239646(&(.*))?$/
// @include      /^http(s)?:\/\/www\.bilibili\.com\/blackboard\/(new)?player\.html\?(aid=19771370|(bvid=(BV)?1GW41177LA))(&(.*))?$/
// @grant        none
// @run-at       document-idle
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/38648/%E3%80%8A%E5%BC%B9%E5%B9%95%E4%B8%96%E7%95%8C2%E3%80%8B%20B%20%E7%AB%99%E5%90%AF%E5%8A%A8%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/38648/%E3%80%8A%E5%BC%B9%E5%B9%95%E4%B8%96%E7%95%8C2%E3%80%8B%20B%20%E7%AB%99%E5%90%AF%E5%8A%A8%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var scriptElement = document.createElement('script');
  scriptElement.src = 'https://danmakucraft.com/bundle.js?nonsense=' + Math.random();

  var bodyElement = document.querySelector('body');
  bodyElement.appendChild(scriptElement);
})();
