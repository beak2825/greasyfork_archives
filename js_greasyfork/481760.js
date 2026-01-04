// ==UserScript==
// @license MIT
// @name        auto click google ai overview show more.
// @namespace    google自動ai回答
// @version      1.1
// @description   google自動ai回答
// @author       Joey Gambler
// @match        *://www.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481760/auto%20click%20google%20ai%20overview%20show%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/481760/auto%20click%20google%20ai%20overview%20show%20more.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function skipAd() {

        var skipButton = document.querySelector('#B2Jtyd > div.X6JNf > div > div.OZ9ddf.WAUd4.GkDqAd.nlXKX > div.RiehGf > div > div > div > span');
        if (skipButton) {
            skipButton.click();
            console.log("Click button");
        }

        var expend = document.querySelector('div.h7Tj7e > div.RDmXvc.Jzkafd');
        if (expend) {
            expend.click();
            console.log("Click button");
        }

    }

    // 设置检测时间间隔
    var timer = setInterval(skipAd, 1000); // 1000毫秒 = 1秒
})();