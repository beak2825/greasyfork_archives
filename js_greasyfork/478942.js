// ==UserScript==
// @name         Skipper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  y Skipper
// @author       mpapec
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/478942/Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/478942/Skipper.meta.js
// ==/UserScript==

setInterval(function(){
    jQuery(".ytp-ad-skip-button-text").click();
}, 500);
