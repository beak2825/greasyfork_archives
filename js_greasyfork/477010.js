// ==UserScript==
// @name         Auto Click
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Auto-clicks specific elements on Bouncebit.io and Matr1x.io
// @author       You
// @match        *://bouncebit.io/*
// @match        *://matr1x.io/*
// @grant        none
// @license      0xfeng
// @downloadURL https://update.greasyfork.org/scripts/477010/Auto%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/477010/Auto%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const host = window.location.host;

    // 对 bouncebit.io 的操作
    if (host === "bouncebit.io") {
        setInterval(function() {
            var button = document.querySelector("body > div > div.flex.flex-1.flex-col > div > div.relative.mx-auto.flex.h-full.w-full > div.pb-10.text-center.flex.items-start > div:nth-child(1) > div:nth-child(2) > div > button");
            if (button) {
                button.click();
                setTimeout(function() {
                    location.reload();
                }, 1000);
            }
        }, 1000);
    }
    // 对 matr1x.io 的操作
    else if (host === "matr1x.io") {
        setInterval(function() {
            // 现有的点击逻辑
            var button = document.querySelector(".el-button.btn.el-button--default.claim");
            if (button) {
                button.click();
                // 在这里不进行页面刷新
            }
            // 新增的点击逻辑
            var newButton = document.querySelector("#app > div > div.home > div.boxUnpackWarp > div.boxUnpack > div.btnWarp > button");
            if (newButton) {
                newButton.click();
                // 根据需求，在这里也不进行页面刷新
            }
        }, 1000);
    }
})();
