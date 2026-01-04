// ==UserScript==
// @name         微信读书全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  向下滚动时隐藏微信读书的topBar 
// @author       jiaway
// @match        https://weread.qq.com/web/reader/*
// @icon        https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_16h.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438072/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/438072/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onscroll = function () {

      var h = document.documentElement.scrollTop || document.body.scrollTop;
      var headerTop = document.getElementsByClassName("readerTopBar")[0];

      if (h >= 100) {
          headerTop.style.display = "none"
      } else {
        headerTop.style.display = "flex"
      }

    };

})();