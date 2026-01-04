// ==UserScript==
// @name             Auto Clicker2
// @namespace    Sarmad Khan
// @version          0.1
// @description    Automatically clicks a link for you
// @include   http*://moakt.com/*
// @copyright      Found1s.blogspot.com
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35352/Auto%20Clicker2.user.js
// @updateURL https://update.greasyfork.org/scripts/35352/Auto%20Clicker2.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var url = window.location.href;

if (url.search("moakt") >= 0) {
    var found = $("a:contains('GameTwist - Confirm email address')")
    if (found.length)
        window.location.href = found[0].href
}