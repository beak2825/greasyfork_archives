// ==UserScript==
// @name         FORCE HTTPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       NextDev65
// @description  Redirects from HTTP to HTTPS
// @match        http://*/*
// @exclude      http://localhost*/*
// @exclude      http://127.0.0.1/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429078/FORCE%20HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/429078/FORCE%20HTTPS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // @noframes
    window.location.protocol = 'https:';
})();