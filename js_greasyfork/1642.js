// ==UserScript==
// @name           Remove Junk From Gaia Signatures NOT aquariums 
// @description    Removes scion license, car, etc. It does NOT remove the standard signature which is controlled from your account settings. Excludes aquariums because there is a game associated with it. 
// @include        http://*.gaiaonline.com/forum/*
// @include        http://gaiaonline.com/forum/*
// @include        https://*.gaiaonline.com/forum/*
// @include        https://gaiaonline.com/forum/*
// @version 0.0.1.20140525024111
// @namespace https://greasyfork.org/users/2178
// @downloadURL https://update.greasyfork.org/scripts/1642/Remove%20Junk%20From%20Gaia%20Signatures%20NOT%20aquariums.user.js
// @updateURL https://update.greasyfork.org/scripts/1642/Remove%20Junk%20From%20Gaia%20Signatures%20NOT%20aquariums.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(
'.extra_sigs div:not(.forum-flash-signature) {display:none}' );