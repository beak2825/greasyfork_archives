// ==UserScript==
// @name         Show Hitboxes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show hitboxes
// @author       Viper
// @match        https://place.gd/*
// @license MIT
// @grant        none
// @icon https://www.google.com/s2/favicons?sz=64&domain=place.gd
// @downloadURL https://update.greasyfork.org/scripts/517555/Show%20Hitboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/517555/Show%20Hitboxes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function simulateClick(element) {
        if (element) {
            element.click();
            //console.log('Clicked element:', element);
        } else {
            console.warn('Element to click not found.');
        }
    }

    function handleKeyPress(event) {
        console.log(event.key)
        if (event.key === 'h' || event.key == "Control") {
            let open = false;
            const settingsButton = document.querySelector('button[data-guide="test"]');
            if (settingsButton) {
                const showCollidableElement = document.getElementById('showCollidable');
                if (!showCollidableElement) {
                    simulateClick(settingsButton);
                    open = true;
                }

                setTimeout(() => {
                    const showCollidableElement = document.getElementById('showCollidable');
                    if (showCollidableElement) {

                        let currentElement = showCollidableElement;
                        let i = 0
                        while (currentElement && i < 5) {
                            if (currentElement.getAttribute('role') === 'checkbox') {

                                simulateClick(currentElement);

                                if (open) {
                                    simulateClick(settingsButton);
                                }
                                i=+1
                                return;
                            }
                            currentElement = currentElement.parentElement;
                        }
                        console.warn('No parent with role="checkbox" found.');
                    } else {
                        console.warn('Element with id="showCollidable" not found.');
                    }

                    //   console.log('Closing settings menu...');
                    if (open) {
                        simulateClick(settingsButton);
                    }
                }, 0.01);
            } else {
                console.warn('Settings button not found.');
            }
        }
    }

    document.addEventListener('keydown', handleKeyPress);
})();
