// ==UserScript==
// @name         Early access to leagues
// @namespace    https://www.nitrotype.com
// @version      1.0
// @description  Set localStorage item on Nitrotype 
// @author       Malakai
// @match        *://www.nitrotype.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496076/Early%20access%20to%20leagues.user.js
// @updateURL https://update.greasyfork.org/scripts/496076/Early%20access%20to%20leagues.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the localStorage item
    localStorage.setItem('i-love', 'leagues');
})();
