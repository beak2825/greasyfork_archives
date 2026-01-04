// ==UserScript==
// @name         Website Shortcut Maker
// @namespace    http://tampermonkey.net/
// @version      1.1.9
// @description  Adds a button to redirect based on user-defined rules
// @license MIT
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/506846/Website%20Shortcut%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/506846/Website%20Shortcut%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create UI elements
    function createUI() {
        // Create button
        const button = document.createElement('button');
        button.textContent = 'Redirect Settings';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'white';
        button.style.color = 'black';

        // Set button position based on the current page
        if (window.location.pathname === '/') {
            // Center the button at the top on Google's main page
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
        } else {
            // Position in top-right corner for search results pages
            button.style.position = 'fixed';
            button.style.top = '10px';
            button.style.right = '10px';
        }

        // Create menu
        const menu = document.createElement('div');
        menu.style.display = 'none';
        menu.style.position = 'fixed';
        menu.style.top = '40px';
        menu.style.right = '10px';
        menu.style.width = '250px';
        menu.style.padding = '10px';
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid black';
        menu.style.zIndex = '9999';
        menu.style.color = 'black';

        menu.innerHTML = `
            <p>Enter the keyword or exact URL to trigger the redirect:</p>
            <input type="text" id="triggerInput"><br><br>
            <p>Enter the URL to redirect to:</p>
            <input type="text" id="redirectInput"><br><br>
            <button id="saveButton" class="menu-button">Save</button>
            <button id="closeButton" class="menu-button">Close</button>
            <button id="viewAllButton" class="menu-button">View All Redirects</button>
        `;

        // Style for menu buttons
        const style = document.createElement('style');
        style.textContent = `
            .menu-button {
                background-color: black;
                color: white;
                border: none;
                padding: 5px 10px;
                margin: 5px;
                cursor: pointer;
            }
            .menu-button:hover {
                background-color: #333;
            }
        `;
        document.head.appendChild(style);

        // Create all redirects menu
        const allRedirectsMenu = document.createElement('div');
        allRedirectsMenu.style.display = 'none';
        allRedirectsMenu.style.position = 'fixed';
        allRedirectsMenu.style.top = '40px';
        allRedirectsMenu.style.right = '280px';
        allRedirectsMenu.style.width = '300px';
        allRedirectsMenu.style.height = '400px';
        allRedirectsMenu.style.padding = '10px';
        allRedirectsMenu.style.backgroundColor = 'white';
        allRedirectsMenu.style.border = '1px solid black';
        allRedirectsMenu.style.zIndex = '9999';
        allRedirectsMenu.style.color = 'black';
        allRedirectsMenu.style.overflowY = 'auto';
        allRedirectsMenu.innerHTML = '<h3>All Redirects:</h3><div id="allRulesList"></div>';

        // Add elements to page
        document.body.appendChild(button);
        document.body.appendChild(menu);
        document.body.appendChild(allRedirectsMenu);

        // Button click event
        button.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
            allRedirectsMenu.style.display = 'none';
        });

        // Save button click event
        document.getElementById('saveButton').addEventListener('click', saveRule);

        // Close button click event
        document.getElementById('closeButton').addEventListener('click', () => {
            menu.style.display = 'none';
            allRedirectsMenu.style.display = 'none';
        });

        // View All Redirects button click event
        document.getElementById('viewAllButton').addEventListener('click', viewAllRedirects);
    }

    // Only create UI if we're on Google's main page or search results page
    if (window.location.hostname === 'www.google.com' &&
        (window.location.pathname === '/' || window.location.pathname.startsWith('/search'))) {
        createUI();
    }

    function saveRule() {
        let trigger = document.getElementById('triggerInput').value.trim();
        let redirect = document.getElementById('redirectInput').value.trim();

        if (trigger && redirect) {
            const rules = GM_getValue('redirectRules', {});
            rules[trigger] = redirect;
            GM_setValue('redirectRules', rules);

            document.getElementById('triggerInput').value = '';
            document.getElementById('redirectInput').value = '';

            // Update the all redirects list
            updateAllRulesList();
        } else {
            alert('Please enter both a trigger (keyword or URL) and a redirect URL.');
        }
    }

    function updateAllRulesList() {
        const allRulesList = document.getElementById('allRulesList');
        const rules = GM_getValue('redirectRules', {});
        allRulesList.innerHTML = '';

        for (const [trigger, redirect] of Object.entries(rules)) {
            const ruleElement = document.createElement('div');
            ruleElement.style.marginBottom = '10px';
            ruleElement.style.wordBreak = 'break-all';

            const triggerSpan = document.createElement('span');
            triggerSpan.textContent = trigger;
            triggerSpan.style.fontWeight = 'bold';

            const arrowSpan = document.createElement('span');
            arrowSpan.textContent = ' → ';

            const redirectSpan = document.createElement('span');
            redirectSpan.textContent = redirect;

            ruleElement.appendChild(triggerSpan);
            ruleElement.appendChild(arrowSpan);
            ruleElement.appendChild(redirectSpan);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'menu-button';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', () => {
                delete rules[trigger];
                GM_setValue('redirectRules', rules);
                updateAllRulesList();
            });

            ruleElement.appendChild(document.createElement('br'));
            ruleElement.appendChild(deleteButton);
            allRulesList.appendChild(ruleElement);
        }
    }

    function viewAllRedirects() {
        updateAllRulesList();
        const allRedirectsMenu = document.querySelector('div[style*="overflow-y: auto"]');
        if (allRedirectsMenu) {
            allRedirectsMenu.style.display = allRedirectsMenu.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Check for redirects
    function checkAndRedirect() {
        const rules = GM_getValue('redirectRules', {});
        const currentURL = window.location.href;

        for (const [trigger, redirect] of Object.entries(rules)) {
            if (currentURL === trigger) {
                window.location.href = redirect;
                return;
            }
            // Check for Google search URLs
            if (currentURL.startsWith('https://www.google.com/search?')) {
                const urlParams = new URLSearchParams(window.location.search);
                const searchQuery = urlParams.get('q');
                if (searchQuery && searchQuery.toLowerCase() === trigger.toLowerCase()) {
                    window.location.href = redirect;
                    return;
                }
            }
        }
    }

    // Run redirect check immediately and set up an interval to check periodically
    checkAndRedirect();
    setInterval(checkAndRedirect, 1000); // Check every second
})();