// ==UserScript==
// @name         Budget Price Converter
// @namespace    https://www.reddit.com/user/RobotOilInc
// @license      MIT
// @version      0.1
// @description  Converts BM Lin style prices to CNY.
// @author       RobotOilInc
// @match        http://*.x.yupoo.com/*
// @match        https://*.x.yupoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/444620/Budget%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/444620/Budget%20Price%20Converter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const prices = {"A": 100, "B": 200, "C": 300, "D": 400, "E": 500, "F": 600,};
    const pricesMid = {0: 50, 1:60, 2: 70, 3: 80, 4: 90, 5: 0, 6: 10, 7: 20, 8: 30, 9: 40,};

    const selector = document.querySelectorAll('.album__title,.showalbumheader__gallerytitle');
    for (let i = 0; i < selector.length; i++) {
        const text = selector[i].innerText;

        const arr = text.match(/\w\w\d\w\w/);
        if (Array.isArray(arr) && arr.length > 0) {
            const total = prices[arr[0].charAt(0)] + pricesMid[arr[0].charAt(2)];
            selector[i].innerText = "[" + total + "¥] " + text;
        }
    }
})();