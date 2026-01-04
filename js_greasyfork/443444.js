// ==UserScript==
// @name         优化 OneDrive 显示
// @namespace    67373tools
// @description  减小了 OneDrive 上图片信息的不透明度
// @version      0.1
// @author       旅行
// @match        *://*.sharepoint.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443444/%E4%BC%98%E5%8C%96%20OneDrive%20%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/443444/%E4%BC%98%E5%8C%96%20OneDrive%20%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var fadeTitle = document.createElement('style');
  fadeTitle.textContent = `
    .hasBackground_3d7a162e .nameplate_3d7a162e {
      opacity: 0;
    }
  `
  document.head.appendChild(fadeTitle);

})();

