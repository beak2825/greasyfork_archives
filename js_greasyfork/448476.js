// ==UserScript==
// @name         隐藏腾讯课堂正在观看提示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  利用CSS隐藏腾讯课堂正在观看提示*2023-03-25*
// @author       Debbl
// @match        https://ke.qq.com/webcourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ke.qq.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448476/%E9%9A%90%E8%97%8F%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448476/%E9%9A%90%E8%97%8F%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

// about https://aiwan.run/

(function () {
  "use strict";
  var styleEl = document.createElement("style");
  var textNode = document.createTextNode(
    "#video-container div:nth-of-type(2), .copyright-marquee-tips-container {opacity: 0 !important;}"
  );
  styleEl.appendChild(textNode);
  document.querySelector("head").appendChild(styleEl);
})();