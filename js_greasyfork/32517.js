// ==UserScript==
// @name         bilibili sbqsb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/video/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32517/bilibili%20sbqsb.user.js
// @updateURL https://update.greasyfork.org/scripts/32517/bilibili%20sbqsb.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        var sbqsb = document.querySelector(".bilibili-player-iconfont.bilibili-player-iconfont-danmaku.icon-24danmuon.player-tooltips-trigger");
        console.log(sbqsb);
        if (sbqsb !== null) {
            sbqsb.parentNode.dispatchEvent(new Event("click"));
            setTimeout(function() {
               sbqsb.parentNode.dispatchEvent(new Event("click"));
            }, 1000);
        }
    }, 1000);
})();