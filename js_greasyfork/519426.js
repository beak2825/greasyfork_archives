// ==UserScript==
// @name         Torn - OC Travel Restrictions
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  Disables travel for individual countries based on flight type if you would be late for an organized crime. Includes a button to enable or disable the script. Green 'OC' means enabled.
// @author       Baccy
// @match        https://www.torn.com/page.php?sid=travel
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519426/Torn%20-%20OC%20Travel%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/519426/Torn%20-%20OC%20Travel%20Restrictions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function apply() {
        const elements = {
            "Mexico": { pc: "Mexico - Ciudad Juarez", mobile: '/images/v2/travel_agency/flags/fl_mexico.svg' },
            "Cayman Islands": { pc: "Cayman Islands - George Town", mobile: '/images/v2/travel_agency/flags/fl_cayman_islands.svg' },
            "Canada": { pc: "Canada - Toronto", mobile: '/images/v2/travel_agency/flags/fl_canada.svg' },
            "Hawaii": { pc: "Hawaii - Honolulu", mobile: '/images/v2/travel_agency/flags/fl_hawaii.svg' },
            "United Kingdom": { pc: "United Kingdom - London", mobile: '/images/v2/travel_agency/flags/fl_uk.svg' },
            "Argentina": { pc: "Argentina - Buenos Aires", mobile: '/images/v2/travel_agency/flags/fl_argentina.svg' },
            "Switzerland": { pc: "Switzerland - Zurich", mobile: '/images/v2/travel_agency/flags/fl_switzerland.svg' },
            "Japan": { pc: "Japan - Tokyo", mobile: '/images/v2/travel_agency/flags/fl_japan.svg' },
            "China": { pc: "China - Beijing", mobile: '/images/v2/travel_agency/flags/fl_china.svg' },
            "UAE": { pc: "UAE - Dubai", mobile: '/images/v2/travel_agency/flags/fl_uae.svg' },
            "South Africa": { pc: "South Africa - Johannesburg", mobile: '/images/v2/travel_agency/flags/fl_south_africa.svg' }
        };

        const dataElement = document.querySelector('#travel-root');
        if (dataElement) {
            const dataModel = dataElement.getAttribute('data-model');
            const data = JSON.parse(dataModel.replace(/&quot;/g, '"'));

            data.destinations.forEach(destination => {
                const country = destination.country;
                if (destination[active] && destination[active].ocReadyBeforeBack) {
                    const elementData = elements[country];
                    if (elementData) {
                        if (mobile) {
                            const element = document.querySelector(`[src="${elementData.mobile}"]`);
                            if (element) {
                                const parent = element.parentElement.parentElement.parentElement.parentElement;
                                parent.style.display = 'none';
                                parent.classList.add('oc-restriction');
                            }
                        } else {
                            const element = document.querySelector(`[aria-label="${elementData.pc}"]`);
                            if (element) {
                                element.nextSibling.style.opacity = '0.5';
                                element.classList.add('oc-restriction');
                                const parent = element.parentElement;
                                parent.style.pointerEvents = 'none';
                            }
                        }
                    }
                }
            });
        }
    }

    function remove() {
        const elements = document.querySelectorAll('.oc-restriction');
        elements.forEach(element => {
            if (mobile) {
                element.style.display = '';
            } else {
                element.nextSibling.style.opacity = '';
                element.classList.remove('oc-restriction');
                const parent = element.parentElement;
                parent.style.pointerEvents = '';
            }
        });
    }

    function init() {
        const travelTabs = document.querySelector('fieldset[class^="travelTypeSelector"]');
        let enabled = JSON.parse(localStorage.getItem('ocTravelRestriction')) ?? true;

        const checkedTab = [...document.querySelectorAll('[aria-checked]')].find(tab => tab.getAttribute('aria-checked') === "true");
        if (checkedTab) active = checkedTab.getAttribute('value');

        const observer = new MutationObserver(() => {
            const checkedTab = [...document.querySelectorAll('[aria-checked]')].find(tab => tab.getAttribute('aria-checked') === "true");
            if (checkedTab) active = checkedTab.getAttribute('value');
            if (enabled) {
                remove();
                apply();
            }
        });
        observer.observe(travelTabs, { childList: true, subtree: true, attributes: true });

        const header = Array.from(document.querySelectorAll('h4')).find(el => el.childNodes[0]?.nodeValue.trim() === 'Travel Agency');
        const button = document.createElement('button');
        button.textContent = 'OC';
        button.style.cssText = 'margin-left: 10px; padding: 5px 10px; border-radius: 5px; background-color: #555;  cursor: pointer;';
        button.style.color = enabled ? 'lightgreen' : 'white';
        button.addEventListener('click', () => {
            enabled = !enabled;
            localStorage.setItem('ocTravelRestriction', enabled);
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
    let active;
    let data;

    function wait() {
        const travelTabs = document.querySelector('fieldset[class^="travelTypeSelector"]');
        if (travelTabs) {
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