// ==UserScript==
// @name         coolmathgames skip 15 seconds
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Skips the 15 seconds wait in coolmathgames.com
// @author       You
// @match        *://*.coolmathgames.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382133/coolmathgames%20skip%2015%20seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/382133/coolmathgames%20skip%2015%20seconds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    javascript:removePrerollAndDisplayGame();
})();