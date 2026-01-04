// ==UserScript==
// @name         [KPX] DigiRegistratuur Auto Select
// @namespace    https://digiregistratuur.ee
// @version      0.1
// @description  Automatically select "psühholoogia" and "Harju maakond", and set date on DigiRegistratuur.ee
// @author       KPCX
// @match        https://digiregistratuur.ee/search_appointment*
// @match        https://digiregistratuur.ee/login*
// @match        https://digiregistratuur.ee/logout_session*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digiregistratuur.ee
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500728/%5BKPX%5D%20DigiRegistratuur%20Auto%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/500728/%5BKPX%5D%20DigiRegistratuur%20Auto%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wait for elements to be available in the DOM
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    console.log(`Found ${identifier}`);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Function to simulate a click event
    function clickElement(element) {
        const event = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        element.dispatchEvent(event);
        console.log(`Clicked element: ${element.id}`);
    }

    // Function to select an option by visible text
    function selectOptionByText(dropdown, text) {
        const options = dropdown.querySelectorAll('option');
        options.forEach(option => {
            if (option.textContent.trim() === text) {
                dropdown.value = option.value;
                const event = new Event('change', { bubbles: true });
                dropdown.dispatchEvent(event);
                console.log(`Selected text ${text} in dropdown`);
            }
        });
    }

    // Function to perform the selection by simulating clicks with a delay
    async function performSelection(dropdownSelector, optionText, labelSelector) {
        const dropdownLabel = document.querySelector(labelSelector);
        if (dropdownLabel) {
            clickElement(dropdownLabel); // Click to open the dropdown
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            const dropdown = document.querySelector(dropdownSelector);
            if (dropdown) {
                selectOptionByText(dropdown, optionText); // Select the option by visible text
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
            } else {
                console.error(`Dropdown ${dropdownSelector} not found`);
            }
        } else {
            console.error(`Dropdown label ${labelSelector} not found`);
        }
    }

    // Function to set the date input value
    function setDateInput(selector, date) {
        const dateInput = document.querySelector(selector);
        if (dateInput) {
            dateInput.value = date;
            const event = new Event('change', { bubbles: true });
            dateInput.dispatchEvent(event);
            console.log(`Set date input ${selector} to ${date}`);
        } else {
            console.error(`Date input ${selector} not found`);
        }
    }

    // Function to click the "Otsi" button
    function clickSearchButton(selector) {
        const searchButton = document.querySelector(selector);
        if (searchButton) {
            searchButton.click();
            console.log(`Clicked search button: ${selector}`);
        } else {
            console.error(`Search button ${selector} not found`);
        }
    }

    // Function to blink the tab
    function blinkTab() {
        let oldTitle = document.title;
        let timeoutId;
        function blink() { document.title = (document.title == oldTitle ? '***' : oldTitle); }
        function clear() {
            clearInterval(timeoutId);
            document.title = oldTitle;
            window.onmousemove = null;
            timeoutId = null;
        }
        if (!timeoutId) {
            timeoutId = setInterval(blink, 1000);
            window.onmousemove = clear;
        }
    }

    // Function to show a popup message
    function showPopupMessage(message) {
        alert(message);
    }

    function showNotification(message) {
        Notification.requestPermission().then(function(result) {
            if (result === 'granted') {
                new Notification('Notification Title', {
                    body: message
                });
            }
        });
    }

    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Wait for 5 seconds after page load
        setTimeout(async () => {
            try {
                // Wait for the first select element to be available
                //await waitForElements('#form\\:field_label', 200, 50, 'Teenuste valdkond label');
                // Perform the first selection
                //await performSelection('#form\\:field_input', 'psühholoogia', '#form\\:field_label');
                // Wait for 1 second
                //await new Promise(resolve => setTimeout(resolve, 500));
                // Wait for the second select element to be available
                //await waitForElements('#form\\:county_label', 1000, 50, 'Maakond label');
                // Perform the second selection
                //await performSelection('#form\\:county_input', 'Harju maakond', '#form\\:county_label');
                // Wait for 1 second
                //await new Promise(resolve => setTimeout(resolve, 1000));
                // Wait for the date input to be available
                //await waitForElements('#form\\:toDate_input', 1000, 50, 'kuni date input');
                // Set the date input value
                //setDateInput('#form\\:toDate_input', '08.04.2025');
                // Wait for 1 second
                //await new Promise(resolve => setTimeout(resolve, 1000));
                // Click the "Otsi" button
                clickSearchButton('#form\\:searchFreeSlots');
                await new Promise(resolve => setTimeout(resolve, 8000));

                // Wait for the search results to load
                await waitForElements('#form\\:pollingStats\\:j_idt138_header', 1000, 50, 'Päring teostatud message');

                // Check if "Päring teostatud. Ühtegi vaba aega ei leitud." message exists
                function freecheck() {
                    const messageElement = document.querySelector('#form\\:pollingStats\\:j_idt138_header');
                    if (!messageElement || !messageElement.textContent.includes('Päring teostatud. Ühtegi vaba aega ei leitud.')) {
                        blinkTab();
                        showNotification('Vabad ajad leitud! showNotification');
                        //showPopupMessage('Vabad ajad leitud! showPopupMessage');
                        console.log('Vabad ajad leitud!');
                    }
                }
                freecheck()

                // Detect URL change to specific URL
                function urlcheck() {
                    const urlChangeInterval = setInterval(() => {
                        if (window.location.href.includes('https://digiregistratuur.ee/logout_session')) {
                            clearInterval(urlChangeInterval);
                            blinkTab();
                            showNotification('Välja logitud! showNotification');
                            showPopupMessage('Välja logitud! showPopupMessage');
                            console.log('Välja logitud!');
                        }
                    }, 1000); // Check every 500 ms for URL change
                }
                setInterval(() => {
                    urlcheck()
                }, 1000); // Check every 500 ms for URL change

                // Repeat clicking the "Otsi" button every 3 minutes (180000 ms)
                setInterval(() => {
                    clickSearchButton('#form\\:searchFreeSlots');
                    freecheck()
                    urlcheck()
                }, 120000); // 2 minutes interval, 120000; 3: 180000

                // Repeat full page refresh every 5 minutes (300000 ms)
                setInterval(() => {
                    window.location.reload(true);
                }, 180000); // 3 minutes interval, 180000; 5: 300000
            } catch (error) {
                console.error(error);
            }
        }, 2500); // 2-second wait
    }, false);
})();
