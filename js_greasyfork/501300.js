// ==UserScript==
// @name         Debug Request Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify POST request parameters for testing
// @match        https://energymanagergame.com/sell.php*
// @match        https://energymanagergame.com/index.php?intro=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501300/Debug%20Request%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/501300/Debug%20Request%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded');

    // Save the original send method
    const originalSend = XMLHttpRequest.prototype.send;
    
    // Intercept the send method
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;

        // Override the open method to hook into the request
        const originalOpen = this.open;
        this.open = function(method, url) {
            if (url.includes('/sell.php')) {
                xhr.addEventListener('readystatechange', function() {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let responseText = xhr.responseText;
                        console.log('Original Response:', responseText);

                        // Modify the response text
                        responseText = responseText.replace(/changeNumber\('headerAccount', 2, \d+\)/, "changeNumber('headerAccount', 2, 999999)");
                        console.log('Modified Response:', responseText);

                        // Create a new Response object with the modified text
                        Object.defineProperty(xhr, 'responseText', { value: responseText });
                    }
                });
            }
            originalOpen.apply(this, arguments);
        };
        originalSend.apply(this, arguments);
    };
})();
