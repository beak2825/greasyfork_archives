// ==UserScript==
// @name         button clicker
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  presses a button
// @author       twarped
// @include      https://*/*
// @include      http://*/*
// @exclude      *docs.google.com/*/*
// @exclude      *sites.google.com/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387525/button%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/387525/button%20clicker.meta.js
// ==/UserScript==
// id="next"

setInterval(function($){ document.getElementById('next').click('click'); },15000);
