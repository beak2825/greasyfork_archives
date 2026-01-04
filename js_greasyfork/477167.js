// ==UserScript==
// @name         Popup Oeener
// @namespace    Popup Oeener
// @version      0.1
// @description  Ctr + Alt + P를 누르면 입력한 주소의 팝업을 열 수 있습니다.
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477167/Popup%20Oeener.user.js
// @updateURL https://update.greasyfork.org/scripts/477167/Popup%20Oeener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = null; // Initialize container as null

    // Function to toggle the container's display
    function toggleContainer() {
        if (!container) {
            createContainer();
        }
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    }

    // Function to create the container div
    function createContainer() {
        container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.display = 'none'; // Initially hidden
        container.style.flexDirection = 'column'; // Display inputs and buttons vertically

        // Create the first input field for global URL
        const globalInput = document.createElement('input');
        globalInput.type = 'text';
        globalInput.value = GM_getValue('globalUrl', '');

        // Create the OK button for global URL
        const globalOkButton = document.createElement('button');
        globalOkButton.textContent = 'OK';
        globalOkButton.addEventListener('click', function() {
            const url = globalInput.value;
            if (url) {
                GM_setValue('globalUrl', url);
                window.open(url, '_blank', 'width=800,height=600');
                container.style.display = 'none'; // Hide the container
            }
        });

        // Create the second input field for site-specific URL
        const siteInput = document.createElement('input');
        siteInput.type = 'text';
        siteInput.value = GM_getValue(window.location.hostname, '');

        // Create the OK button for site-specific URL
        const siteOkButton = document.createElement('button');
        siteOkButton.textContent = 'OK';
        siteOkButton.addEventListener('click', function() {
            const url = siteInput.value;
            if (url) {
                GM_setValue(window.location.hostname, url);
                window.open(url, '_blank', 'width=800,height=600');
                container.style.display = 'none'; // Hide the container
            }
        });

        // Append input fields and buttons to the container
        container.appendChild(globalInput);
        container.appendChild(globalOkButton);
        container.appendChild(siteInput);
        container.appendChild(siteOkButton);

        // Append the container to the document body
        document.body.appendChild(container);
    }

    // Listen for the Ctrl + Alt + P shortcut
    window.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey && event.key === 'p') {
            toggleContainer(); // Toggle the container's display
        }
    });
})();