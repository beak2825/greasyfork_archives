// ==UserScript==
// @name         eagle remover
// @namespace    http://tampermonkey.net/
// @version      2024-05-11-3
// @description  add a fake tracker script so that EagleCloud tracker won't register it's tracker logic
// @author       Monalisa
// @match        https://*/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hanspagel.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500253/eagle%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/500253/eagle%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create a new script element
    var script = document.createElement('script');

    // Set the src attribute to include 'ia_security_' in the URL
    script.src = 'https://example.com/js/ia_security_example.js';

    // Append the script to the document's head (or any other suitable location)
    document.head.appendChild(script);
    window.dlpExtensionStarted = true;
    console.log('registered eagle remover');
})();