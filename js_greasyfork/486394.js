// ==UserScript==
// @name         52asmr视频续播
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  asmr视频自动续播，无破解仅仅是自动续播
// @author       wrldhorse
// @match        http://52asmr.top/archives/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=52asmr.top
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486394/52asmr%E8%A7%86%E9%A2%91%E7%BB%AD%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/486394/52asmr%E8%A7%86%E9%A2%91%E7%BB%AD%E6%92%AD.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    // Your code here...
    function checkAndPerformActions() {
        let classList = document.querySelector("#ripro-mse").classList;
        let startTime = document.querySelector("span.dplayer-ptime").innerText;
        let finisTime = document.querySelector("span.dplayer-dtime").innerText;
        // console.log(length, startTime, finisTime);
        if (classList.length === 2 && finisTime !== '0:00') {
            document.querySelector("#ripro-mse > div.dplayer-controller > div.dplayer-icons.dplayer-icons-left > button").click();
            document.querySelector("button.dplayer-icon.dplayer-full-in-icon").click();
        }
        if (classList.contains('dplayer-paused') && startTime === '0:00') {
            document.querySelector("#ripro-mse > div.dplayer-controller > div.dplayer-icons.dplayer-icons-left > button").click();
        }
        if (classList.contains('dplayer-paused') && startTime === finisTime) {
            window.location = document.querySelector("div.entry-wrapper > header > h4 > a").href;
        }
    }
    window.onload = setTimeout(setInterval(checkAndPerformActions, 5000), 10000);
})();