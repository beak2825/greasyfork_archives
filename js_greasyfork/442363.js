// ==UserScript==
// @name         跳过bilibili的充电名单
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Skip bilibili player electric panel
// @author       SmileYik
// @match        *://*.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442363/%E8%B7%B3%E8%BF%87bilibili%E7%9A%84%E5%85%85%E7%94%B5%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442363/%E8%B7%B3%E8%BF%87bilibili%E7%9A%84%E5%85%85%E7%94%B5%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // you can find a class named
    // bilibili-player-electric-panel-jump-time
    // it is a button to skip bilibili player electric panel.
    const checkedClass = "bilibili-player-electric-panel-jump-time";
    // bilibili-player-iconfont-next
    // this is a class name of next part video button
    const nextButtonClass = "bilibili-player-iconfont-next";

    let id = 0;

    function tick() {
        const result = document.getElementsByClassName(checkedClass);
        if (result && result.length > 0) {
            console.log("start skip electric panel...");
            const nextButton = document.getElementsByClassName(nextButtonClass);
            if (nextButton && nextButton.length > 0) {
                console.log("find next button, skipping...");
                nextButton[0].click();
            }
        }
    }

    id = setInterval(tick, 1000);
})();