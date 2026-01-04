// ==UserScript==
// @name         (PDA) Torn OC Travel Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Disables travel for individual countries based on flight type if you would be late for an organized crime. Includes a button to enable or disable the script.
// @author       Baccy
// @match        https://www.torn.com/travelagency.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517615/%28PDA%29%20Torn%20OC%20Travel%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/517615/%28PDA%29%20Torn%20OC%20Travel%20Restrictions.meta.js
// ==/UserScript==

(function () {
    const travelTimes = {
        "tab4-1": { mexico: 1560000 * 2, cayman: 2100000 * 2, canada: 2460000 * 2, hawaii: 8040000 * 2, uk: 9540000 * 2, argentina: 10020000 * 2, switzerland: 10500000 * 2, japan: 13500000 * 2, china: 14520000 * 2, uae: 16260000 * 2, "south-africa": 17820000 * 2 },
        "tab4-2": { mexico: 1080000 * 2, cayman: 1500000 * 2, canada: 1740000 * 2, hawaii: 5640000 * 2, uk: 6660000 * 2, argentina: 7020000 * 2, switzerland: 7380000 * 2, japan: 9480000 * 2, china: 10140000 * 2, uae: 11400000 * 2, "south-africa": 12480000 * 2 },
        "tab4-3": { mexico: 780000 * 2, cayman: 1080000 * 2, canada: 1200000 * 2, hawaii: 4020000 * 2, uk: 4800000 * 2, argentina: 4980000 * 2, switzerland: 5280000 * 2, japan: 6780000 * 2, china: 7260000 * 2, uae: 8100000 * 2, "south-africa": 8940000 * 2 },
        "tab4-4": { mexico: 480000 * 2, cayman: 660000 * 2, canada: 720000 * 2, hawaii: 2400000 * 2, uk: 2880000 * 2, argentina: 3000000 * 2, switzerland: 3180000 * 2, japan: 4080000 * 2, china: 4320000 * 2, uae: 4860000 * 2, "south-africa": 5340000 * 2 }
    };

    // Load or set toggle state
    let isEnabled = JSON.parse(localStorage.getItem('ocTravelRestrictionMobile')) ?? true;

    // Add toggle button for enabling/disabling the feature
    const toggleButton = document.createElement('button');
    toggleButton.innerText = isEnabled ? 'Disable Travel Restriction' : 'Enable Travel Restriction';
    toggleButton.style =
        'padding: 5px 10px; border-radius: 5px; background-color: #555555; color: white; border: none; cursor: pointer;';
	toggleButton.ontouchstart = toggleButton.onmousedown = () => {
		toggleButton.style.backgroundColor = '#444444';
	};

	toggleButton.ontouchend = toggleButton.onmouseup = toggleButton.onmouseleave = () => {
		toggleButton.style.backgroundColor = '#555555';
	};

    if ($('div.content-title > h4').length > 0) {
        $('div.content-title > h4').append(toggleButton);
    }
	
    toggleButton.onclick = () => {
        isEnabled = !isEnabled;
        localStorage.setItem('ocTravelRestrictionMobile', isEnabled);
        toggleButton.innerText = isEnabled
            ? 'Disable Travel Restriction'
            : 'Enable Travel Restriction';
        if (isEnabled) {
            applyTravelRestrictions();
        } else {
            enableAllTravel();
        }
    };

    // Function to check warnings and apply restrictions
    function applyTravelRestrictions() {
        const warningElements = document.querySelectorAll('.t-red');
        if (warningElements.length === 0) {
            console.warn('No warning messages found.');
            return;
        }

        let validWarningFound = false;

        warningElements.forEach((warningElement) => {
            const warningText = warningElement.innerText.trim();
            if (warningText.startsWith("Warning: An organized crime you're participating in will be ready in")) {
                validWarningFound = true;

                const timeMatch = warningText.match(/(\d+) hours? and (\d+) minutes?/);
                if (!timeMatch) {
                    console.error('Failed to parse time from warning:', warningText);
                    return;
                }

                const hours = parseInt(timeMatch[1], 10);
                const minutes = parseInt(timeMatch[2], 10);
                const remainingTime = (hours * 60 + minutes) * 60 * 1000;

                disableExceedingTravel(remainingTime);
            } else if (warningText.startsWith("Warning: An organized crime you're participating in is ready for initiation")) {
                validWarningFound = true;
                disableExceedingTravel(0);
            }
        });

        if (!validWarningFound) {
            console.warn('No relevant organized crime warnings found.');
        }
    }

    // Function to disable travel options based on remaining time
    function disableExceedingTravel(remainingTime) {
        Object.entries(travelTimes).forEach(([tabId, locations]) => {
            const tabElement = document.querySelector(`#${tabId}`);
            if (!tabElement) {
                console.warn(`Tab element ${tabId} not found.`);
                return;
            }

            Object.entries(locations).forEach(([location, time]) => {
                if (time > remainingTime) {
                    const cityFlag = tabElement.querySelector(`.city-flag.${location}`);
                    if (cityFlag) {
                        const travelOption = cityFlag.closest(
                            '.travel-info-table-list.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all.ui-accordion-icons'
                        );
                        if (travelOption) {
                            travelOption.setAttribute('style', 'display: none;');
                        } else {
                            console.warn(`Travel option container for ${location} not found in ${tabId}.`);
                        }
                    } else {
                        console.warn(`City flag for ${location} not found in ${tabId}.`);
                    }
                }
            });
        });
        observer.disconnect();
    }

    // Function to re-enable all travel options
    function enableAllTravel() {
        document
            .querySelectorAll(
                '.travel-info-table-list.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all.ui-accordion-icons'
            )
            .forEach((travelOption) => {
                travelOption.setAttribute('style', '');
            });
    }

    // Run the restrictions if enabled
    if (isEnabled) {
        applyTravelRestrictions();
    }

    // Observer for slow wifi where the script attempts to make the changes before the elements are loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const travelButtons = document.querySelectorAll('.city-flag');
        if (travelButtons.length > 0) {
            if (isEnabled) {
                applyTravelRestrictions();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
