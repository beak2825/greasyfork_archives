// ==UserScript==
// @name        last day snow-forecast
// @description Shows last day on snow-forecast.com.
// @namespace snow-forecast
// @license MIT
// @include     https://www.snow-forecast.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/435581/last%20day%20snow-forecast.user.js
// @updateURL https://update.greasyfork.org/scripts/435581/last%20day%20snow-forecast.meta.js
// ==/UserScript==

(function removeBlock() {
    for (var el of document.getElementsByClassName('incentive')) {
        el.remove()
    }
})();