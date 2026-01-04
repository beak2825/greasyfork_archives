// ==UserScript==
// @name         Torn - Cash Travel Restrictions
// @namespace    http://www.torn.com/
// @version      0.4
// @description  Disables travel for individual countries if you do not have enough to purchase plushies/flowers, whichever costs more in case stock of out of your preferred item. Edit capacity or cash requirements if needed. 500k for Switzerland. Standard travel costs not included.  Includes a $ button to toggle the script beside the Travel Agency title. Green $ means enabled.
// @match        https://www.torn.com/page.php?sid=travel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519459/Torn%20-%20Cash%20Travel%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/519459/Torn%20-%20Cash%20Travel%20Restrictions.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const travelCapacity = 29; // Change if your capacity is not 29

    const travelCosts = { // Change numbers if you will need less or more for the item you want to purchase when travelling to that country
        "Mexico - Ciudad Juarez": 10000, // Jaguar Plushie cost
        "Cayman Islands - George Town": 4000, // Banana Orchid cost
        "Canada - Toronto": 600, // Crocus cost
        "Hawaii - Honolulu": 700, // Orchid cost
        "United Kingdom - London": 5000, // Heather cost
        "Argentina - Buenos Aires": 500, // Ceibo Flower cost
        "Switzerland - Zurich": 500000, // 2 rehabs cost
        "Japan - Tokyo": 500, // Cherry Blossom cost
        "China - Beijing": 5000, // Peony cost
        "UAE - Dubai": 14000, // Camel Plushie cost
        "South Africa - Johannesburg": 2000 // African Violet cost
    };

    function apply() {
        const userMoney = Number(document.querySelector('[data-money]')?.getAttribute('data-money'));

        const data = {
            "Mexico - Ciudad Juarez": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_mexico.svg'},
            "Cayman Islands - George Town": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_cayman_islands.svg'},
            "Canada - Toronto": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_canada.svg'},
            "Hawaii - Honolulu": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_hawaii.svg'},
            "United Kingdom - London": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_uk.svg'},
            "Argentina - Buenos Aires": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_argentina.svg'},
            "Switzerland - Zurich": {capacity:false, mobile:'/images/v2/travel_agency/flags/fl_switzerland.svg'},
            "Japan - Tokyo": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_japan.svg'},
            "China - Beijing": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_china.svg'},
            "UAE - Dubai": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_uae.svg'},
            "South Africa - Johannesburg": {capacity:true, mobile:'/images/v2/travel_agency/flags/fl_south_africa.svg'}
        };

        Object.entries(travelCosts).forEach(([key, value]) => {
            const requiredMoney = data[key].capacity ? value * travelCapacity : value;
            if (userMoney < requiredMoney) {
                if (mobile) {
                    const element = document.querySelector(`[src="${data[key].mobile}"]`);
                    if (element) {
                        const parent = element.parentElement.parentElement.parentElement.parentElement;
                        parent.style.display = 'none';
                        parent.classList.add('cash-restriction');
                    }
                } else {
                    const element = document.querySelector(`[aria-label="${key}"]`);
                    if (element) {
                        element.nextSibling.style.opacity = '0.5';
                        element.classList.add('cash-restriction');
                        const parent = element.parentElement;
                        parent.style.pointerEvents = 'none';
                    }
                }
            }
        });
    }

    function remove() {
        const elements = document.querySelectorAll('.cash-restriction');
        elements.forEach(element => {
            if (mobile) {
                element.style.display = '';
            } else {
                element.nextSibling.style.opacity = '';
                element.classList.remove('cash-restriction');
                const parent = element.parentElement;
                parent.style.pointerEvents = '';
            }
        });
    }

    function init() {
        let enabled = JSON.parse(localStorage.getItem('cashTravelRestriction')) ?? true;

        const header = Array.from(document.querySelectorAll('h4')).find(el => el.childNodes[0]?.nodeValue.trim() === 'Travel Agency');
        const button = document.createElement('button');
        button.textContent = '$';
        button.style.cssText = 'margin-left: 10px; padding: 5px 10px; border-radius: 5px; background-color: #555;  cursor: pointer;';
        button.style.color = enabled ? 'lightgreen' : 'white';
        button.addEventListener('click', () => {
            enabled = !enabled;
            localStorage.setItem('cashTravelRestriction', enabled);
            if (enabled) {
                apply();
                button.style.color = 'lightgreen';
            } else {
                remove();
                button.style.color = 'white';
            }
        });
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#444";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "#555";
        });
        if (header) header.appendChild(button);

        if (enabled) apply();
    }

    let mobile = false;
    let loaded = false;

    function wait() {
        if (document.querySelector('[data-money]')) {
            const mobileElement = document.querySelector('[src="/images/v2/travel_agency/flags/fl_uk.svg"]');
            if (mobileElement || document.querySelector('[aria-label="United Kingdom - London"]')) {
                if (mobileElement) mobile = true;
                return true;
            }
        }
        return false;
    }

    loaded = wait();
    if (loaded) {
        init();
    } else {
        const observer = new MutationObserver(() => {
            loaded = wait();
            if (loaded) {
                init();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();