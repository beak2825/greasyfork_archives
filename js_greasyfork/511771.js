// ==UserScript==
// @name         Google Scholar Save All 
// @namespace    https://github.com/asmpro7
// @version      1.1
// @description  Adds a Save All button to save all articles on the page in Google Scholar
// @author       Ahmed ElSaeed
// @icon         https://scholar.google.com/favicon.ico
// @match        https://scholar.google.com/scholar*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511771/Google%20Scholar%20Save%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/511771/Google%20Scholar%20Save%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click
    function simulateClick(element) {
        if (element) {
            element.click();
        }
    }

    // Add the "Save All" button
    function addSaveAllButton() {
        const gsAbMdDiv = document.getElementById('gs_ab_md');
        if (gsAbMdDiv) {
            const saveAllButton = document.createElement('button');
            saveAllButton.textContent = 'Save All';
            saveAllButton.style.backgroundColor = 'blue';
            saveAllButton.style.color = 'white';
            saveAllButton.style.padding = '10px';
            saveAllButton.style.border = 'none';
            saveAllButton.style.cursor = 'pointer';
            saveAllButton.style.marginLeft = '10px';

            saveAllButton.addEventListener('click', function() {
                // Get all "Save" buttons on the page
                const saveButtons = document.querySelectorAll('span.gs_or_btn_lbl');
                saveButtons.forEach((btn, index) => {
                    // Simulate a click on each Save button
                    setTimeout(() => {
                        simulateClick(btn);
                        // After a click, wait for popups and then dismiss them
                        setTimeout(() => {
                            const popup = document.querySelector('.gs_or_sav');
                            if (popup) {
                                simulateClick(document.body); // Click outside to close the popup
                            }
                        }, 500);
                    }, 500 * index); // Delay between each click to ensure the popup appears and is closed
                });

                // Change the button's background color to green once done
                saveAllButton.style.backgroundColor = 'green';
            });

            gsAbMdDiv.appendChild(saveAllButton);
        }
    }

    // Wait for the page to load, then add the button
    window.addEventListener('load', addSaveAllButton);

})();
