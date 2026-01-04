// ==UserScript==
// @name         Fix Github Legend
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Fix Github Legend!
// @author       You
// @match        https://github.com/new
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        MIT
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524018/Fix%20Github%20Legend.user.js
// @updateURL https://update.greasyfork.org/scripts/524018/Fix%20Github%20Legend.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const legend = document.querySelector("legend");
    console.log(legend);

    if (legend) {
        legend.style = "margin-top: -18px; width: auto !important"
        console.log("Fix the legend successfully.")
    }
})();