// ==UserScript==
// @name         Classroom Redirect
// @version      0.2
// @description  Auto switch to user 1 when using Google Classroom with User 0
// @author       pooroll
// @include https://classroom.google.com/*
// @namespace https://greasyfork.org/users/157849
// @downloadURL https://update.greasyfork.org/scripts/34727/Classroom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/34727/Classroom%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 5);
        if (path1 === "/u/0/") {
            window.location.replace("https://classroom.google.com/u/1/h");
        }
    }, 100);
})();