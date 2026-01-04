// ==UserScript==
// @name         b站按下alt二倍速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按下alt键实现二倍速，松开恢复一倍速
// @author       iehtian
// @match        *://*.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490752/b%E7%AB%99%E6%8C%89%E4%B8%8Balt%E4%BA%8C%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/490752/b%E7%AB%99%E6%8C%89%E4%B8%8Balt%E4%BA%8C%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
document.addEventListener("keydown", function(event) {
    if (event.keyCode === 18) {
        document.querySelector('video').playbackRate = 2
    }
})
document.onkeyup = function(e) {
    var keyNum = window.event ? e.keyCode : e.which;
    if (keyNum == 18) {
        document.querySelector('video').playbackRate = 1
    }
}

})();