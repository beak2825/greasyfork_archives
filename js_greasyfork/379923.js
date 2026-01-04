// ==UserScript==
// @name         Advanced Amazon Money Hack
// @namespace    http://jmuse.cf/
// @version      4.0
// @description  This is a advanced amazon money hack! Not really it's not even a hack this script just changes the look of your amazon gift card balance amount by counting up. Have Fun!
// @author       Jmuse
// @match        https://www.amazon.com/*
// @downloadURL https://update.greasyfork.org/scripts/379923/Advanced%20Amazon%20Money%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/379923/Advanced%20Amazon%20Money%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Special Thanks To Yamid, Chris Sandvik, and jo_va for helping me with this script!

function animateValue(id) {
    var obj = document.getElementById("gc-ui-balance-gc-balance-value");
    var current = parseInt(localStorage.getItem("lastCount")) || 5000; // Number It Starts At

    var interval = null;
    var maxCount = 15000; // Number It Stops At
    var callback = function() {
        var nextCount = current++;
        if (nextCount === maxCount) {
            clearInterval(interval);
        }
        localStorage.setItem("lastCount", nextCount);
        obj.innerText = '$' + nextCount; // Adds the $ symbol next to number to make more legit looking
    }
    interval = setInterval(callback, 0.1);
}
    animateValue('gc-ui-balance-gc-balance-value')
})();