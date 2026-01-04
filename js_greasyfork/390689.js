// ==UserScript==
// @name         stackoverflow
// @namespace    https://lyler.xyz
// @version      0.1
// @description  Clean up stackoverflow UI; removes jobs, chat, etc.
// @author       Lyle Hanson
// @match        https://stackoverflow.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390689/stackoverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/390689/stackoverflow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('hireme').style = 'display: none;';
    document.getElementById('chat-feature').style = 'display: none;';
    document.getElementById('newsletter-ad').style = 'display: none;';
})();