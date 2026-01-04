// ==UserScript==
// @name         Torn OC 2.0 Role Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Counts OC 2.0 roles and displays the total on the OC page
// @author       You
// @match        https://www.torn.com/page.php?sid=crimes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530259/Torn%20OC%2020%20Role%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/530259/Torn%20OC%2020%20Role%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the OC content to load
    const waitForElement = (selector, callback) => {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForElement('.crime-wrapper', () => {
        console.log("Counting OC 2.0 roles...");

        // Select all role elements
        const roles = document.querySelectorAll('.role-name');

        if (!roles.length) {
            console.log("No OC 2.0 roles found.");
            return;
        }

        // Count roles
        const roleCount = {};
        roles.forEach(role => {
            const roleName = role.textContent.trim();
            roleCount[roleName] = (roleCount[roleName] || 0) + 1;
        });

        // Create display container
        const totalRoles = roles.length;
        const container = document.querySelector('.crime-wrapper');

        const resultDiv = document.createElement('div');
        resultDiv.style.backgroundColor = '#1e1e2f';
        resultDiv.style.color = '#fff';
        resultDiv.style.padding = '10px';
        resultDiv.style.margin = '10px 0';
        resultDiv.style.borderRadius = '8px';
        resultDiv.style.fontSize = '16px';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

        resultDiv.innerHTML = `<strong>OC 2.0 Role Count:</strong><br>`;
        for (const [role, count] of Object.entries(roleCount)) {
            resultDiv.innerHTML += `${role}: ${count}<br>`;
        }
        resultDiv.innerHTML += `<br><strong>Total Roles: ${totalRoles}</strong>`;

        container.insertBefore(resultDiv, container.firstChild);
    });

})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-03-19
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/factions.php?step=your&type=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();