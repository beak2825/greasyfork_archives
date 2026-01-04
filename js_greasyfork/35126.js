// ==UserScript==
// @name         m.facebook.com Auto Scroll Back
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto scroll back when switch from messenger tab to news feed.
// @author       Psyblade
// @match        https://m.facebook.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35126/mfacebookcom%20Auto%20Scroll%20Back.user.js
// @updateURL https://update.greasyfork.org/scripts/35126/mfacebookcom%20Auto%20Scroll%20Back.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var giatriy = 0;

$( document ).ready(function() {
    $( "#u_0_a" ).click(function() {
        giatriy = window.pageYOffset;
    });
});

$( document ).ready(function() {
    $( "#u_0_c" ).click(function() {
        giatriy = window.pageYOffset;
    });
});

$( document ).ready(function() {
    $( "#u_0_e" ).click(function() {
        giatriy = window.pageYOffset;
    });
});

$( document ).ready(function() {
    $( "#u_0_9" ).click(function() {
         setTimeout(function() {
            window.scrollTo(0, giatriy);
    }, 50);
    });
});