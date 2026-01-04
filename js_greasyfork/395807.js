// ==UserScript==
// @name         Better Classroom Redirect
// @version      0.3
// @description  Auto switch to user 1 when using Google Classroom with User 0
// @author       Original:pooroll, Better:Merith-TK
// @include https://classroom.google.com/*
// @namespace https://greasyfork.org/users/439452
// @downloadURL https://update.greasyfork.org/scripts/395807/Better%20Classroom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/395807/Better%20Classroom%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        var path0 = window.location.pathname;
        var path1 = path0.substring(0, 5);
    if (path1 === "/u/0/") {
         
        var res = path0.split("/u/0/");
        window.location.replace("https://classroom.google.com/u/1/"+res[1]);
    }
    }, 100);
})();