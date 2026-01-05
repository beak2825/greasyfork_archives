// ==UserScript==
// @name        Fix Gmail Link
// @namespace   null
// @description Fixes the gmail link on www.google.com
// @include     https://www.google.com/?gws_rd=ssl
// @include     http://www.google.com/?gws_rd=ssl
// @include     https://www.google.com/
// @include     http://www.google.com/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/5196/Fix%20Gmail%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/5196/Fix%20Gmail%20Link.meta.js
// ==/UserScript==
document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( "https://mail.google.com/mail/?tab=wm", "https://accounts.google.com/ServiceLogin?service=mail&continue=https://mail.google.com/mail/" );
    });
}
