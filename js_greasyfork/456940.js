// ==UserScript==
// @name         Geen "weet je zeker dat je wil sluiten" pop-up
// @name:en      No "are you sure you want to close this window" pop-up
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Je krijgt nooit meer zo een irritant bericht van zermelo als je gewoon je rooster wilt bekijken
// @description:en Never again will you get an annoying pop-up from zermelo if you just want to check your schedule
// @author       You
// @match        https://*.zportal.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zportal.nl
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/456940/Geen%20%22weet%20je%20zeker%20dat%20je%20wil%20sluiten%22%20pop-up.user.js
// @updateURL https://update.greasyfork.org/scripts/456940/Geen%20%22weet%20je%20zeker%20dat%20je%20wil%20sluiten%22%20pop-up.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onbeforeunload = null;
    Object.defineProperty(window,"onbeforeunload", {writable:false})

})();