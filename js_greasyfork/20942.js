// ==UserScript==
// @name        EB Anti-Adblock
// @namespace   EB Anti-Adblock
// @description fjerner Adblock blockeren
// @include     http://ekstrabladet.dk
// @include     http://ekstrabladet.dk/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20942/EB%20Anti-Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/20942/EB%20Anti-Adblock.meta.js
// ==/UserScript==

$('#eb_fullBody').nextAll().remove()