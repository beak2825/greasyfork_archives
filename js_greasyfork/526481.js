// ==UserScript==
// @name         Run JS in URL | EN
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Allows running JS code using URL
// @author       Belogvardeec
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526481/Run%20JS%20in%20URL%20%7C%20EN.user.js
// @updateURL https://update.greasyfork.org/scripts/526481/Run%20JS%20in%20URL%20%7C%20EN.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function executeCodeFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('console');

        if (code) {
            try {
                const decodedCode = decodeURIComponent(code);
                eval(decodedCode); // using eval to execute code
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // Execute the main function
    executeCodeFromUrl();

    console.log('JS in URL has been launched');
})();
