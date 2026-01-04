// ==UserScript==
// @name         超星鼠标监听禁用
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  禁用鼠标监听，避免鼠标移出网页后视频自动暂停
// @author       沧浪之水
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489021/%E8%B6%85%E6%98%9F%E9%BC%A0%E6%A0%87%E7%9B%91%E5%90%AC%E7%A6%81%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489021/%E8%B6%85%E6%98%9F%E9%BC%A0%E6%A0%87%E7%9B%91%E5%90%AC%E7%A6%81%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('mouseout', function(event) {
  event.preventDefault();
  event.stopPropagation();
});
})();