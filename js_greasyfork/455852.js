// ==UserScript==
// @name     Remove Global Filter 移除全局滤镜
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description remove global filter (e.g. grayscale) 移除全局滤镜（例如黑白效果）
// @grant    none
// @run-at   document-idle
// @include	 *
// @version   2023.08.27+888c9ae5
// @downloadURL https://update.greasyfork.org/scripts/455852/Remove%20Global%20Filter%20%E7%A7%BB%E9%99%A4%E5%85%A8%E5%B1%80%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455852/Remove%20Global%20Filter%20%E7%A7%BB%E9%99%A4%E5%85%A8%E5%B1%80%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/remove-global-filter.user.ts
  document.body.parentElement.style.filter = "none";
})();
