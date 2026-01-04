// ==UserScript==
// @name         Improve Keycloak user search
// @namespace    http://tampermonkey.net/
// @version      2025-04-11
// @author       Yaroslav Shepilov
// @match        https://auth.holidu.io/admin/master/console/
// @match        https://search-auth.holidu.cloud/admin/master/console/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=holidu.io
// @grant        none
// @description When you do a search for a user in Keycloak, it drops a focus from the input field. This script fixes the issue
// @downloadURL https://update.greasyfork.org/scripts/507937/Improve%20Keycloak%20user%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/507937/Improve%20Keycloak%20user%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let inputSelected = false;
    let lastBlurAt = null;

    function getNowString() {
        const now = new Date();

        const date = now.toLocaleDateString(); // Get date in a readable format
        const time = now.toLocaleTimeString(); // Get time in a readable format
        const millis = now.getMilliseconds();  // Get milliseconds

        // Combine date, time, and milliseconds
        return `${date} ${time}.${millis}`;
    }

    function setupSearchTextCursorListener(toolbarNode) {
        const inputElement = toolbarNode.querySelector('input.pf-c-text-input-group__text-input[placeholder="Search user"]');
        if (inputElement) {
            if (inputSelected) {
                inputElement.focus();
            }

            inputElement.addEventListener("focus", (event) => {
                inputSelected = true;
            });

            inputElement.addEventListener("blur", (event) => {
                inputSelected = false;
                lastBlurAt = Date.now();
            });
        }
    }

    function setupSearchById(toolbarNode) {

        const searchButton = toolbarNode.querySelector('button[aria-label="Search"]');
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                const input = toolbarNode.querySelector('input.pf-c-text-input-group__text-input[aria-label="Search"]');
                if (!input) return;

                const value = input.value.trim();

                // Basic UUID v4 regex
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

                if (uuidRegex.test(value)) {
                    const currentHost = window.location.origin;
                    const targetUrl = `${currentHost}/admin/master/console/#/guest/users/${value}/settings`;
                    window.location.href = targetUrl;
                }
            });


        };
    }

    const observer = new MutationObserver((mutationsList, observer) => {
        mutationsList.forEach(mutation => {
            // Check if nodes have been added
            if (mutation.addedNodes.length > 0) {

                //.pf-c-text-input-group__text-input[placeholder="Search user"]
                mutation.addedNodes.forEach(node => {
                    if (node.matches('div.pf-c-toolbar')) {

                        setupSearchTextCursorListener(node);

                        setupSearchById(node);

                    }
                });

            }
            if (mutation.removedNodes.length > 0) {
                mutation.removedNodes.forEach(node => {
                    if (node.matches && node.matches('div.pf-c-toolbar')) {
                        const inputElement = node.querySelector('input.pf-c-text-input-group__text-input[placeholder="Search user"]');
                        if (inputElement) {
                            if ((Date.now() - lastBlurAt) < 50) {
                                inputSelected = true;
                            }
                        }
                    }
                });
            }
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });

})();