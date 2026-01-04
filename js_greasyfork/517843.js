// ==UserScript==
// @name         (PDA) Torn - Money Required For Travel
// @namespace    http://www.torn.com/
// @version      1.3
// @description  Disables travel for individual countries if you do not have enough to purchase plushies/flowers. This choice will be made by whichever is more expensive. Edit the numbers inside the script if you will need less/more for each country, and the travel capacity if yours is not 29. Switzerland is set to 500k for two rehab sessions. This doesn't take into account the ticket cost in standard flights.
// @author       Baccy
// @match        https://www.torn.com/travelagency.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517843/%28PDA%29%20Torn%20-%20Money%20Required%20For%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/517843/%28PDA%29%20Torn%20-%20Money%20Required%20For%20Travel.meta.js
// ==/UserScript==

(function () {
    const travelCapacity = 29; // Change if your capacity is not 29

    const travelCosts = { // Change numbers if you will need less or more for the item you want to purchase when travelling to that country
        mexico: 10000 * travelCapacity, // Jaguar Plushie cost
        cayman: 4000 * travelCapacity, // Banana Orchid cost
        canada: 600 * travelCapacity, // Crocus cost
        hawaii: 700 * travelCapacity, // Orchid cost
        uk: 5000 * travelCapacity, // Heather cost
        argentina: 500 * travelCapacity, // Ceibo Flower cost
        switzerland: 500000, // 2 rehabs cost
        japan: 500 * travelCapacity, // Cherry Blossom cost
        china: 5000 * travelCapacity, // Peony cost
        uae: 14000 * travelCapacity, // Camel Plushie cost
        'south-africa': 2000 * travelCapacity // African Violet cost
    };
    
    let userMoney;
    let cityFlags = {};
    
    function getMoney() {
        // Get your money from the sidebar element
        const moneyElement = document.querySelector('[data-money]');
        if (!moneyElement) {
            console.error('Unable to find element with data-money attribute.');
            return;
        }
        userMoney = parseInt(moneyElement.getAttribute('data-money'), 10);
    }

    function getCountryElements() {
        // Retrieve country elements for each flight type
        Object.keys(travelCosts).forEach((location) => {
            const flags = document.querySelectorAll(`.city-flag.${location}`);
            if (flags.length > 0) {
                cityFlags[location] = flags;
            } else {
                console.warn(`City flags for ${location} not found.`);
            }
        });
    }
    
    // Function to apply travel restrictions
    function applyTravelRestrictions() {
        Object.entries(cityFlags).forEach(([location, flags]) => {
            const requiredCost = travelCosts[location];
            if (userMoney < requiredCost) {
                flags.forEach((cityFlag) => {
                    const travelOption = cityFlag.closest(
                        '.travel-info-table-list.ui-accordion-header.ui-helper-reset.ui-state-default.ui-corner-all.ui-accordion-icons'
                    );
                    if (travelOption) {
                        travelOption.style.display = 'none';
                    } else {
                        console.warn(`Travel option container for ${location} not found.`);
                    }
                });
            }
        });
    }
    
    getMoney();
    getCountryElements();
    applyTravelRestrictions();

    // Observer for slow wifi where the script attempts to make the changes before the elements are loaded
    const observer = new MutationObserver((mutationsList, observer) => {
        const travelButtons = document.querySelectorAll('.city-flag');
        if (travelButtons.length > 0) {
            getMoney();
            getCountryElements();
            applyTravelRestrictions();
            setTimeout(() => {
                observer.disconnect();
            }, 1000);
        }
    });
 
    observer.observe(document.body, { childList: true, subtree: true });
})();
