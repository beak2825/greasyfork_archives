// ==UserScript==
// @name         Chicken Sm
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a seaugh
// @author       You
// @match        https://www.chickensmoothie.com/poundandlostandfound.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533708/Chicken%20Sm.user.js
// @updateURL https://update.greasyfork.org/scripts/533708/Chicken%20Sm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the security token from the page
    function getSecurityToken() {
        const forms = document.querySelectorAll('form');
        for (let form of forms) {
            const action = form.getAttribute('action');
            if (action && action.includes('poundandlostandfound.php')) {
                const inputs = form.querySelectorAll('input[type="hidden"]');
                for (let input of inputs) {
                    if (input.name === 'security_token') {
                        return input.value;
                    }
                }
            }
        }
        return null;
    }

    // Create the container div for the UI
    const container = document.createElement('div');
    container.style.margin = '15px auto';
    container.style.padding = '10px 15px';
    container.style.border = '2px solid #aaa';
    container.style.borderRadius = '10px';
    container.style.backgroundColor = '#fffbe6';
    container.style.maxWidth = '600px';
    container.style.textAlign = 'center';

    // Search bar input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter Pet ID (e.g. 12345678)';
    input.style.padding = '6px 12px';
    input.style.marginRight = '10px';
    input.style.borderRadius = '5px';
    input.style.border = '1px solid #999';
    input.style.width = '60%';

    // Adopt button
    const button = document.createElement('button');
    button.textContent = 'Adopt Pet';
    button.style.padding = '6px 20px';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    button.onclick = function() {
        const petId = input.value.trim();
        if (!/^\d+$/.test(petId)) {
            alert('Please enter a valid numeric Pet ID.');
            return;
        }

        const securityToken = getSecurityToken();
        if (!securityToken) {
            alert('Security token not found. Please ensure you are logged in and the page is fully loaded.');
            return;
        }

        const adoptUrl = `https://www.chickensmoothie.com/poundandlostandfound.php?act=adopt&pet=${petId}&security_token=${securityToken}`;
        window.location.href = adoptUrl;
    };

    // Add input and button to container
    container.appendChild(input);
    container.appendChild(button);

    // Find a good place to insert the UI
    const mainContent = document.querySelector('div.content') || document.querySelector('body');
    mainContent.insertBefore(container, mainContent.firstChild);
})();
