// ==UserScript==
// @name        Fix Censis Bitwarden username fill
// @namespace   Violentmonkey Scripts
// @match       https://*.censis.net/mvc/*
// @grant       none
// @version     1.0
// @author      TW
// @license     MIT
// @description Changes the username field type to 'text' on the Censis login page for Bitwarden autofill.
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/536609/Fix%20Censis%20Bitwarden%20username%20fill.user.js
// @updateURL https://update.greasyfork.org/scripts/536609/Fix%20Censis%20Bitwarden%20username%20fill.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const usernameField = document.getElementById('userId');
    if (usernameField) {
        usernameField.type = 'text';
    }
})();