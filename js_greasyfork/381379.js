// ==UserScript==
// @name              花瓣高清
// @version           0.0.3
// @namespace         https://gitee.com/browser-plug/chrome-huaban
// @icon              https://www.huaban.com/favicon.ico
// @description       花瓣详情页图片替换成高清图片显示
// @author            rose1988c
// @license           MIT
// @match             *://huaban.com*
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_download
// @downloadURL https://update.greasyfork.org/scripts/381379/%E8%8A%B1%E7%93%A3%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/381379/%E8%8A%B1%E7%93%A3%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==

;(function() {
  "use strict";

  var checkZoom = function() {
    if (document.getElementsByClassName("zoomin")) {
      if (
        document.getElementsByClassName("zoom-layer") &&
        document.getElementsByClassName("zoom-layer")[0]
      ) {
        var imgLagerSrc = document
          .getElementsByClassName("zoom-layer")[0]
          .getAttribute("data-img");

        var originImg = document
          .getElementsByClassName("image-holder")[0]
          .getElementsByTagName("img")[0].src;

        if (originImg != imgLagerSrc) {
          document
            .getElementsByClassName("image-holder")[0]
            .getElementsByTagName("img")[0].src = imgLagerSrc;
        }
      }
    }
  };

  setInterval(checkZoom, 500);
  console.log("花瓣高清启动ing")
})();
