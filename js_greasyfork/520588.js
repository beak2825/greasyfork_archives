// ==UserScript==
// @name         Remove Mogg.top Overlay
// @namespace    http://tampermonkey.net/
// @license           GPLv3
// @version      0.1
// @description  自动移除 mogg.top 的遮罩层
// @author       ChatGPT
// @match        *://www.mogg.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520588/Remove%20Moggtop%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/520588/Remove%20Moggtop%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 查找并移除固定遮罩层
    document.querySelectorAll('div[style*="position: fixed; top: 0px; left: 0px; width: 100vw; height: 100vh;"]').forEach(el => el.remove());
})();
