// ==UserScript==
// @name             Auto Clicker
// @namespace    Sarmad Khan
// @version          0.1
// @description    Automatically clicks a link for you
// @include   https://www.moakt.com/pl/mail
// @copyright      Found1s.blogspot.com
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35351/Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/35351/Auto%20Clicker.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
var url = window.location.href;

if (url.search("moakt") >= 0) {
    var found = $("a:contains('Welcome to GameTwist!')")
    if (found.length)
        window.location.href = found[0].href
}