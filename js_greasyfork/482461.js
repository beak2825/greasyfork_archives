// ==UserScript==
// @name         Redirector Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects specified URLs to target URLs
// @author       You
// @match        https://www.google.com/*
// @match        https://oldgoogle.neocities.org/2010/webhp?hl=en
// @match        https://www.google.com/search?hl=en&ie=ISO-8859-1&q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482461/Redirector%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/482461/Redirector%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = window.location.href.replace("https://www.google.com/", "https://google2002.neocities.org/");
})();
