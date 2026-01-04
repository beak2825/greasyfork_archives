// ==UserScript==
// @name         Nakrutka Babok
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description Cash money flex anus
// @match       https://lolz.guru/*
// @match       https://zelenka.guru/*
// @match       https://lzt.market/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480313/Nakrutka%20Babok.user.js
// @updateURL https://update.greasyfork.org/scripts/480313/Nakrutka%20Babok.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function changeBalanceValue() {
        var balance = document.querySelector('.left > .balanceLabel > .balanceValue');
        if (balance) {
            balance.innerHTML = '9999999999';
        }
    }
    window.addEventListener('load', changeBalanceValue);
})();