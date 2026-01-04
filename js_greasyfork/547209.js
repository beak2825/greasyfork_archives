// ==UserScript==
// @name         Quicker图片轮盘
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  左键点击网页图片时重定向到Quicker动作
// @author       Developer
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547209/Quicker%E5%9B%BE%E7%89%87%E8%BD%AE%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/547209/Quicker%E5%9B%BE%E7%89%87%E8%BD%AE%E7%9B%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    document.addEventListener('mousedown', function(e) {
        if (e.button === 0 && e.target.tagName === 'IMG') {
            setTimeout(() => {
                window.location.href = 'quicker:runaction:3f021a56-eb2b-4e3b-a70a-08dde22d8eb3?' + e.target.src;
            }, 100);
        }
    });
})();