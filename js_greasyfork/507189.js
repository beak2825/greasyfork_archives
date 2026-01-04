// ==UserScript==
// @name         Russian Flag on Jadisco
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Draws the Russian flag in the top corner of jadisco.pl
// @author       Your Name
// @match        https://jadisco.pl/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507189/Russian%20Flag%20on%20Jadisco.user.js
// @updateURL https://update.greasyfork.org/scripts/507189/Russian%20Flag%20on%20Jadisco.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a div to hold the flag
    var flagDiv = document.createElement('div');
    flagDiv.style.position = 'fixed';
    flagDiv.style.top = '10px';
    flagDiv.style.left = '10px';
    flagDiv.style.width = '60px';
    flagDiv.style.height = '40px';
    flagDiv.style.border = '1px solid black';
    flagDiv.style.zIndex = '1000';

    // Create the three stripes of the flag
    var colors = ['#ffffff', '#0000ff', '#ff0000'];
    for (var i = 0; i < 3; i++) {
        var stripe = document.createElement('div');
        stripe.style.width = '100%';
        stripe.style.height = '33.33%';
        stripe.style.backgroundColor = colors[i];
        flagDiv.appendChild(stripe);
    }

    // Add the flag to the body
    document.body.appendChild(flagDiv);
})();