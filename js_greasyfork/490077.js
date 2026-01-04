// ==UserScript==
// @name         Classroom Redirect
// @version      0.2
// @description  Auto switch to user 1 when using Google Classroom with User 0
// @author       MohamedArish
// @include https://classroom.google.com/*
// @license MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/490077/Classroom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/490077/Classroom%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 5);

        console.log(path0, path1)
        if (path1 === "/u/0/" || path1 === "/") {
            window.location.replace("https://classroom.google.com/u/1/h");
        }
    }, 100);
})();