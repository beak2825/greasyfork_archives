// ==UserScript==
// @name         Wanikani ExtraStudy Unburn Script
// @namespace    wanikani
// @version      0.1
// @description  Adds the ability to unburn items during Wanikani Extra Study sessions with a press of the U key
// @author       ChatGPT / SoulLessPuppet
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465589/Wanikani%20ExtraStudy%20Unburn%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/465589/Wanikani%20ExtraStudy%20Unburn%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to fully load
    window.addEventListener('load', function() {

        // Find the element that contains the answer buttons
        const answerButtons = document.querySelector('.extra-session--quiz__buttons');

        // Add an event listener for when the U key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === 'u' && !event.repeat) {

                // Check if the "Unburn" button should be shown
                const unburnButton = document.querySelector('.extra-session--quiz__buttons .btn--unburn');
                if (unburnButton) {
                    // If the "Unburn" button is already shown, click it
                    unburnButton.click();
                } else {
                    // Otherwise, show the "Unburn" button
                    const undoButton = document.querySelector('.extra-session--quiz__buttons .btn--undo');
                    if (undoButton) {
                        undoButton.click();
                    }
                }
            }
        });

        // Add an observer to detect when a new question is loaded
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Wait for the question to fully load
                    setTimeout(function() {
                        const answerInput = document.querySelector('.extra-session--quiz__input input');
                        if (answerInput) {
                            // Add an event listener for when the answer is submitted
                            answerInput.addEventListener('keydown', function(event) {
                                if (event.key === 'Enter' && !event.repeat) {

                                    // Check if the "Unburn" button should be shown
                                    const unburnButton = document.querySelector('.extra-session--quiz__buttons .btn--unburn');
                                    if (unburnButton) {
                                        // Show the "Do you want to unburn this item?" popup
                                        const unburnPopup = document.createElement('div');
                                        unburnPopup.innerHTML = 'Do you want to unburn this item?';
                                        unburnPopup.style.position = 'absolute';
                                        unburnPopup.style.top = '100px';
                                        unburnPopup.style.left = '50%';
                                        unburnPopup.style.transform = 'translateX(-50%)';
                                        unburnPopup.style.background = 'white';
                                        unburnPopup.style.padding = '10px';
                                        unburnPopup.style.boxShadow = '0 2px 4px rgba(0,0,0,.15)';
                                        unburnPopup.style.borderRadius = '4px';
                                        answerButtons.appendChild(unburnPopup);

                                        // Add event listeners for when the popup buttons are clicked
                                        const unburnConfirm = document.createElement('button');
                                        unburnConfirm.innerHTML = 'Unburn';
                                        unburnConfirm.style.marginRight = '10px';
                                        unburnPopup.appendChild(unburnConfirm);
                                        unburnConfirm.addEventListener('click', function() {
                                            unburnButton.click();
                                            unburnPopup.remove();
                                        });

                                        const unburnCancel = document.createElement('button');
                                        unburnCancel.innerHTML = 'Cancel';
                                        unburnPopup.appendChild(unburnCancel);
                                        unburnCancel.addEventListener('click', function() {
                                            unburnPopup.remove();
                                        });
                                    }
                                }
                            });
                        }
                    }, 500);
                }
            });
        });
        observer.observe(document.querySelector('body'), {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
});