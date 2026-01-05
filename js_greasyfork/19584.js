// ==UserScript==
// @name          Delete Facebook Propaganda Bar
// @namespace     http://jbona.org
// @description	  Facebook reportedly manipulates "trending topics" (http://gizmodo.com/former-facebook-workers-we-routinely-suppressed-conser-1775461006). This script deletes the right column.
// @author        Jonathan Bona
// @include       https://facebook.com/*
// @include       https://*.facebook.com/*
// @include       http://facebook.com/*
// @include       http://*.facebook.com/*
// @version       1.2
// @downloadURL https://update.greasyfork.org/scripts/19584/Delete%20Facebook%20Propaganda%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/19584/Delete%20Facebook%20Propaganda%20Bar.meta.js
// ==/UserScript==
(function() {
    document.getElementById('rightCol').parentNode.removeChild(document.getElementById('rightCol'));}
)();
