// ==UserScript==
// @name         Modify POST Parameters
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify POST request parameters to exploit potential vulnerabilities
// @match        https://energymanagergame.com/sell.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501299/Modify%20POST%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/501299/Modify%20POST%20Parameters.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Intercept and modify POST requests
    (function modifyPostRequests() {
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.send = function(body) {
            if (this.responseURL.includes('/sell.php')) {
                console.log('Original Request Body:', body);
                // Modify the body as needed
                const modifiedBody = body.replace('id=6316854', 'id=99999999'); // Example modification
                console.log('Modified Request Body:', modifiedBody);
                body = modifiedBody;
            }
            originalSend.call(this, body);
        };
    })();
})();
