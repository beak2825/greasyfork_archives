// ==UserScript==
// @name         MemeNexus for J
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Change memenexus logo!
// @author       You
// @match        http://www.gamersnexus.net/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/31426/MemeNexus%20for%20J.user.js
// @updateURL https://update.greasyfork.org/scripts/31426/MemeNexus%20for%20J.meta.js
// ==/UserScript==

(function() {
$("#logo img:first").attr('src', 'https://divix.lt/tmp/logo.png');
document.title = 'Meme Nexus';
})();