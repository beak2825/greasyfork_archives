// ==UserScript==
// @name         fisch to fischipedia
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirect a website to another site
// @author       You
// @match        *://fisch.fandom.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527697/fisch%20to%20fischipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/527697/fisch%20to%20fischipedia.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let newDomain = "https://fischipedia.org";
    let newURL = newDomain + window.location.pathname + window.location.search + window.location.hash;
    window.location.replace(newURL);
})();