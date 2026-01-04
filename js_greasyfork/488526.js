// ==UserScript==
// @name        Paste AutomateNow AccessToken
// @author      Marek Slebodnik <marek.slebodnik@dhl.com>
// @description Paste access token in active field
// @namespace   TamperMonkey Scripts
// @match       https://*/automatenow/*
// @version     0.0.4
// @run-at          context-menu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488526/Paste%20AutomateNow%20AccessToken.user.js
// @updateURL https://update.greasyfork.org/scripts/488526/Paste%20AutomateNow%20AccessToken.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.activeElement.value = sessionStorage.accessToken;
})();