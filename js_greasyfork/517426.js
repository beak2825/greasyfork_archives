// ==UserScript==
// @name         (PC) Torn OC Travel Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Disables travel for individual countries based on flight type if you would be late for an organized crime. Includes a button to enable or disable the script.
// @author       Baccy
// @author       Tenren
// @match        https://www.torn.com/travelagency.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517426/%28PC%29%20Torn%20OC%20Travel%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/517426/%28PC%29%20Torn%20OC%20Travel%20Restrictions.meta.js
// ==/UserScript==

(function() {
    const travelTimes = {
        "tab4-1": { mexico: 1560000 * 2, cayman: 2100000 * 2, canada: 2460000 * 2, hawaii: 8040000 * 2, uk: 9540000 * 2, argentina: 10020000 * 2, switzerland: 10500000 * 2, japan: 13500000 * 2, china: 14520000 * 2, uae: 16260000 * 2, "south-africa": 17820000 * 2 },
        "tab4-2": { mexico: 1080000 * 2, cayman: 1500000 * 2, canada: 1740000 * 2, hawaii: 5640000 * 2, uk: 6660000 * 2, argentina: 7020000 * 2, switzerland: 7380000 * 2, japan: 9480000 * 2, china: 10140000 * 2, uae: 11400000 * 2, "south-africa": 12480000 * 2 },
        "tab4-3": { mexico: 780000 * 2, cayman: 1080000 * 2, canada: 1200000 * 2, hawaii: 4020000 * 2, uk: 4800000 * 2, argentina: 4980000 * 2, switzerland: 5280000 * 2, japan: 6780000 * 2, china: 7260000 * 2, uae: 8100000 * 2, "south-africa": 8940000 * 2 },
        "tab4-4": { mexico: 480000 * 2, cayman: 660000 * 2, canada: 720000 * 2, hawaii: 2400000 * 2, uk: 2880000 * 2, argentina: 3000000 * 2, switzerland: 3180000 * 2, japan: 4080000 * 2, china: 4320000 * 2, uae: 4860000 * 2, "south-africa": 5340000 * 2 }
    };

    let isEnabled = JSON.parse(localStorage.getItem('ocTravelRestriction')) ?? true;

    const toggleButton = document.createElement('button');
    toggleButton.innerText = isEnabled ? 'Disable Travel Restriction' : 'Enable Travel Restriction';
    toggleButton.style = 'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: white; border: none; cursor: pointer;';
    toggleButton.onmouseover = () => { toggleButton.style.backgroundColor = '#444444'; };
    toggleButton.onmouseout = () => { toggleButton.style.backgroundColor = '#555555'; };
    toggleButton.onclick = () => {
        isEnabled = !isEnabled;
        localStorage.setItem('ocTravelRestriction', isEnabled);
        toggleButton.innerText = isEnabled ? 'Disable Travel Restriction' : 'Enable Travel Restriction';
        if (isEnabled) {
            applyTravelRestrictions();
        } else {
            enableFlights();
        }
    };
    if ($('div.content-title > h4').length > 0) {
        $('div.content-title > h4').append(toggleButton);
    }

    if (isEnabled) {
        applyTravelRestrictions();
    }

    function applyTravelRestrictions() {
        const warningElements = document.querySelectorAll('.t-red');
        if (warningElements.length === 0) {
            console.warn("No warning messages found.");
            return;
        }

        let validWarningFound = false;

        warningElements.forEach(warningElement => {
            const warningText = warningElement.innerText.trim();
            if (warningText.startsWith("Warning: An organized crime you're participating in will be ready in")) {
                validWarningFound = true;

                const timeMatch = warningText.match(/(\d+) hours? and (\d+) minutes?/);
                if (!timeMatch) {
                    console.error("Failed to parse time from warning: ", warningText);
                    return;
                }

                const hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                const remainingTime = (hours * 60 + minutes) * 60 * 1000;
                const crimeStartTime = Date.now() + remainingTime;

                disableFlights(crimeStartTime);
            } else if (warningText.startsWith("Warning: An organized crime you're participating in is ready for initiation")) {
                validWarningFound = true;
                disableFlights(Date.now());
            }
        });

        if (!validWarningFound) {
            console.warn("No relevant organized crime warnings found.");
        }
    }

    function disableFlights(crimeStartTime) {
        Object.keys(travelTimes).forEach(tabId => {
            const timeLeft = crimeStartTime - Date.now();

            const travelTab = document.getElementById(tabId);
            const tabTravelTimes = travelTimes[tabId];

            if (travelTab && tabTravelTimes) {
                Object.entries(tabTravelTimes).forEach(([location, time]) => {
                    if (time > timeLeft) {
                        const button = travelTab.querySelector(`.raceway.${location}`);
                        if (button) {
                            button.style.pointerEvents = 'none';
                            button.style.opacity = '0.5';
                        }
                    }
                });
            }
        });
        observer.disconnect(); 
    }

    function enableFlights() {
        document.querySelectorAll('.raceway').forEach(button => {
            button.style.pointerEvents = 'auto';
            button.style.opacity = '1';
        });
    }

    // Observer for cases where the script attempts to make the changes before the elements are loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const travelButtons = document.querySelectorAll('.raceway');
        if (travelButtons.length > 0) {
            if (isEnabled) {
                applyTravelRestrictions();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
