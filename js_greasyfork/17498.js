// ==UserScript==
// @name         Reddit Enhancement Suite Custom Toggle Visibility
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Toggle a comment's visibility by clicking text on its tagline or the comment's body.
// @author       You
// @match        https://*.reddit.com/r/*/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17498/Reddit%20Enhancement%20Suite%20Custom%20Toggle%20Visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/17498/Reddit%20Enhancement%20Suite%20Custom%20Toggle%20Visibility.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

Array.prototype.forEach.call(
    document.querySelectorAll(".usertext, .usertext :not(a), .usertext-body, .entry, .tagline span, .tagline time"),
    function(elem) {
        elem.onclick = function(event) {
            console.log(event);
            if(event.target == this) {
                return togglecomment(this);
            }
        };
    }
);
Array.prototype.forEach.call(
    document.querySelectorAll(".expand"),
    function(elem) {
        elem.style.display = "none";
    }
);