// ==UserScript==
// @name         Paypayfleamarket Go To Buyee
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  Changes the purchase button in Furima to redirect to buyee
// @author       Midokuni
// @match        https://paypayfleamarket.yahoo.co.jp/item/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491934/Paypayfleamarket%20Go%20To%20Buyee.user.js
// @updateURL https://update.greasyfork.org/scripts/491934/Paypayfleamarket%20Go%20To%20Buyee.meta.js
// ==/UserScript==

(function() {
    'use strict';
	const btn = document.getElementById("item_buy_button");
	btn.href = "https://buyee.jp/paypayfleamarket"+location.pathname;
})();