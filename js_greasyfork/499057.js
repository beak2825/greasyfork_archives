// ==UserScript==
// @name         FMinside Stat replacer
// @namespace    http://tampermonkey.net/
// @version      2024-06-27.2
// @description  Replaces player stat values to match those used in FM.
// @author       Krytten2X4B
// @match        *://fminside.net/players/*
// @run-at document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fminside.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499057/FMinside%20Stat%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/499057/FMinside%20Stat%20replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Divide all stats by 5 to show the FM values.

    var stats_ele = document.getElementsByClassName('stat');

    for (var i = 0; i < stats_ele.length; ++i) {
        var item = stats_ele[i];
        item.innerHTML = (item.innerHTML / 5).toFixed();
    }

})();