// ==UserScript==
// @name         星空fps
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  控制FPS 第18列代碼的0為FPS上限
// @author       jack9246
// @match        https://agario.xingkong.tw/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528979/%E6%98%9F%E7%A9%BAfps.user.js
// @updateURL https://update.greasyfork.org/scripts/528979/%E6%98%9F%E7%A9%BAfps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fps = 0;
    var target = document.getElementById("canvas").getContext("2d");

    var originalRequestAnimationFrame = window.requestAnimationFrame;
    var lastRender = 0;

    function newRequestAnimationFrame(callback) {
        var now = Date.now();
        var elapsed = now - lastRender;
        var delay = Math.max(0, 1000 / fps - elapsed);
        setTimeout(function() {
            lastRender = Date.now();
            callback(lastRender);
        }, delay);
    }

    window.requestAnimationFrame = newRequestAnimationFrame;
})();