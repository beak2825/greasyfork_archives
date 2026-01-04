// ==UserScript==
// @name         OkCupid more effective pass
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @description  Allows you to pass on someone forever
// @author       You
// @match        https://www.okcupid.com/home
// @match        https://www.okcupid.com/discover
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okcupid.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504158/OkCupid%20more%20effective%20pass.user.js
// @updateURL https://update.greasyfork.org/scripts/504158/OkCupid%20more%20effective%20pass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The userId of the currently viewed profile is not saved in the DOM.
    // It's in the React state so we have to manually manipulate the DOM to get the XHR to trigger.
    const bindTheButton = (passButton) => {
        const blockButtonExists = document.getElementById('user-script-block') !== null;

        if (blockButtonExists) {
            return false;
        }

        console.debug('[user script] Adding a block button.');

        const blockButton = document.createElement('button');

        blockButton.classList.add('dt-action-buttons');
        blockButton.style.cursor = 'pointer';
        blockButton.style.backgroundColor = '#1a1a1a';
        blockButton.style.color = '#fff';
        blockButton.style.display = 'flex';
        blockButton.style.alignItems = 'center';
        blockButton.style.justifyContent = 'center';
        blockButton.style.borderRadius = '50px';
        blockButton.style.height = '50px';
        blockButton.style.padding = '0 10px';
        blockButton.style.marginRight = '10px';
        blockButton.innerHTML = '<span class="dt-action-buttons-button-text" aria-hidden="true">BLOCK</span>';
        blockButton.setAttribute('id', 'user-script-block');

        passButton.closest('div.dt-action-buttons').insertAdjacentElement('afterbegin', blockButton);

        blockButton.addEventListener('click', (event) => {
            event.preventDefault();

            const clickEvent = new Event('click', { bubbles: true });
            const modalIcon = document.querySelector('i.okicon.i-ellipsis-v');

            if (modalIcon) {
                const modalButton = modalIcon.closest('button');

                // Open the modal dialog.
                modalButton.dispatchEvent(clickEvent);

                // The modal is in the DOM only after clicking the elipsis button.
                const baseModal = document.getElementById('BaseModal');

                if (baseModal) {
                    [...baseModal.querySelectorAll('button')].forEach((el) => {
                        if (el.innerText.includes('BLOCK')) {
                            el.dispatchEvent(clickEvent);

                            const closeModal = setInterval(() => {
                                const closeButton = baseModal.querySelector('button[aria-label="Close block confirmation modal"]');

                                if (closeButton) {
                                    clearInterval(closeModal);

                                    closeButton.dispatchEvent(clickEvent);

                                    console.debug('[user script] Successfully blocked.');
                                }
                            }, 10);
                        }
                    });
                } else {
                    console.debug('[user script] The base modal is missing.');
                }
            } else {
                console.debug('[user script] The elipsis icon is missing.');
            }
        });
    };

    const checkForLoadedPage = setInterval(() => {
        const passButton = document.querySelector('button.dt-action-buttons-button.pass');

        if (passButton) {
            bindTheButton(passButton);
        }
    }, 10);
})();