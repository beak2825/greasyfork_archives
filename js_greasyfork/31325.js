// ==UserScript==
// @name         ROBLOX Robux Converter
// @version      1.0
// @description  Converts robux to its DevEx equivalent, wrote by reddit.com/user/azndibs 
// @author       reddit.com/user/azndibs
// @match        https://www.roblox.com/*
// @grant        none
// @namespace https://greasyfork.org/users/38402
// @downloadURL https://update.greasyfork.org/scripts/31325/ROBLOX%20Robux%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/31325/ROBLOX%20Robux%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        var robux = document.getElementById('nav-robux-amount').innerHTML;
        document.getElementById('nav-robux-amount').innerHTML = robux + " or $" + convertToDollar(robux);
        console.log(robux + " or $" + convertToDollar(robux));
    };

    function convertToDollar(robux) {
        robux = robux.replace(",", "");
        console.log(robux);
        robux = parseInt(robux);
        var moneyz = robux * 0.0035;
        moneyz = Math.floor(moneyz * 100) / 100;
        return moneyz;
    }
})();