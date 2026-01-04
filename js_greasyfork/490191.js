// ==UserScript==
// @name        Convai Scritps
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      -
// @description 18/03/2024, 18:30:42
// @downloadURL https://update.greasyfork.org/scripts/490191/Convai%20Scritps.user.js
// @updateURL https://update.greasyfork.org/scripts/490191/Convai%20Scritps.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Create a <script> element
    var scriptElement = document.createElement('script');

    // Set the src attribute to the unpkg link
    scriptElement.src = 'https://unpkg.com/convai-web-sdk@0.1.0/dist/umd/convai-web-client.umd.js';

    // Append the <script> element to the document body
    document.body.appendChild(scriptElement);
})();

console.log(ConvaiClient)