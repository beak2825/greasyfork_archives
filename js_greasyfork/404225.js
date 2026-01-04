// ==UserScript==
// @name         Billboard Paywall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read articles on billboard.com
// @author       You
// @match        https://www.billboard.com/articles/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/404225/Billboard%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/404225/Billboard%20Paywall.meta.js
// ==/UserScript==

$( document ).ready(function() {
    var intervalID = window.setInterval(myCallback, 1000);

    function myCallback() {
        $('.article__body').removeClass( "article__overlay" );
    }
});