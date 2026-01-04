// ==UserScript==
// @name         Auto Click Button by Class
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Finds and clicks a button with a specific class
// @author       You
// @match        https://clash.gg/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534910/Auto%20Click%20Button%20by%20Class.user.js
// @updateURL https://update.greasyfork.org/scripts/534910/Auto%20Click%20Button%20by%20Class.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page fully loads
    window.addEventListener('load', () => {

        // Optional: retry until the button appears
        const interval = setInterval(() => {
            // Replace this with your actual class
            const button = document.querySelector('.css-pc7iwc');

            if (button) {
                button.click();
                console.log('Button clicked!');
                clearInterval(interval); // Stop checking once clicked
            } else {
                console.log('Button not found yet...');
            }
        }, 1000); // Check every second
    });
})();
