// ==UserScript==
// @name         Google AI Studio UI Tweak
// @namespace    https://nancex.me/
// @version      1.0.1
// @description  Hide/Show toolbar and header in Google AI Studio
// @author       Nancex
// @match        https://aistudio.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/544070/Google%20AI%20Studio%20UI%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/544070/Google%20AI%20Studio%20UI%20Tweak.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        body.hide-ui .toolbar-container,
        body.hide-ui .header-container {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    document.body.classList.add('hide-ui');

    const addToggleButtons = () => {
        const togglesContainer = document.querySelector('.toggles-container');
        if (togglesContainer && !togglesContainer.querySelector('.toggle-ui-button')) {
            const existingButton = togglesContainer.querySelector('button');
            if (!existingButton) return;

            const toggleButton = existingButton.cloneNode(true);
            toggleButton.classList.add('toggle-ui-button');
            toggleButton.classList.remove('right-side-panel-button-highlight');
            
            const icon = toggleButton.querySelector('.material-symbols-outlined');

            const updateButtonState = () => {
                if (document.body.classList.contains('hide-ui')) {
                    toggleButton.setAttribute('aria-label', 'Show UI');
                    toggleButton.setAttribute('mattooltip', 'Show UI');
                    icon.textContent = 'visibility';
                } else {
                    toggleButton.setAttribute('aria-label', 'Hide UI');
                    toggleButton.setAttribute('mattooltip', 'Hide UI');
                    icon.textContent = 'visibility_off';
                }
            };

            toggleButton.addEventListener('click', () => {
                document.body.classList.toggle('hide-ui');
                updateButtonState();
            });

            updateButtonState();
            togglesContainer.appendChild(toggleButton);

        }
    };

    const observer = new MutationObserver(addToggleButtons);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the element is already there
    addToggleButtons();
})();
