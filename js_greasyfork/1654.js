// ==UserScript==
// @name           Remove Junk From Gaia Signatures 
// @description    Removes scion license, car, aquarium, .etc. It does NOT remove the standard signature which is controlled from your account settings.
// @include        http://*.gaiaonline.com/forum/*
// @include        http://gaiaonline.com/forum/*
// @include        https://*.gaiaonline.com/forum/*
// @include        https://gaiaonline.com/forum/*
// @version 0.0.1.20140525024114
// @namespace https://greasyfork.org/users/2178
// @downloadURL https://update.greasyfork.org/scripts/1654/Remove%20Junk%20From%20Gaia%20Signatures.user.js
// @updateURL https://update.greasyfork.org/scripts/1654/Remove%20Junk%20From%20Gaia%20Signatures.meta.js
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
'.extra_sigs {display:none}' );