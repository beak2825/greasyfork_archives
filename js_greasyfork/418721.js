// ==UserScript==
// @name         Search defaults to all releases
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jermrellum
// @match        https://rateyourmusic.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418721/Search%20defaults%20to%20all%20releases.user.js
// @updateURL https://update.greasyfork.org/scripts/418721/Search%20defaults%20to%20all%20releases.meta.js
// ==/UserScript==

(function() {
    'use strict';

    selectSearchType('l');
})();