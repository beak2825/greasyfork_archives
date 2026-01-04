// ==UserScript==
// @name         B站直播关闭看板娘
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站直播关闭看板娘，删除相关元素 *2023-02-19*
// @author       Debbl
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460291/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%B3%E9%97%AD%E7%9C%8B%E6%9D%BF%E5%A8%98.user.js
// @updateURL https://update.greasyfork.org/scripts/460291/B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%85%B3%E9%97%AD%E7%9C%8B%E6%9D%BF%E5%A8%98.meta.js
// ==/UserScript==

// repo https://github.com/Debbl/TemperMonkeyScripts

(function () {
  "use strict";
  var harunaEl = document.getElementById("my-dear-haruna-vm");
  if (harunaEl) harunaEl.remove();
})();
