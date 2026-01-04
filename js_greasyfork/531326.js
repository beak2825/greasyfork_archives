// ==UserScript==
// @name        SOULJA BOY TELL EM
// @description Google "do a barrel roll" for an awesome surprise
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/search*
// @grant       none
// @version     1.1
// @author      ben_p_06
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531326/SOULJA%20BOY%20TELL%20EM.user.js
// @updateURL https://update.greasyfork.org/scripts/531326/SOULJA%20BOY%20TELL%20EM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the search query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    // Check if the query matches "do a barrel roll" (case insensitive)
    if (query && query.toLowerCase() === "do a barrel roll") {
        window.location.href = "https://youtu.be/8UFIYGkROII?t=15";
    }
})();