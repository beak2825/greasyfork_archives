// ==UserScript==
// @name         Torn Property Upgrade Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to quickly select property upgrades
// @author       aquaglooop
// @match        https://www.torn.com/properties.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544597/Torn%20Property%20Upgrade%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/544597/Torn%20Property%20Upgrade%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const facilitiesToSelect = {
        'interior': 'Superior Interior Modification',
        'range': 'Shooting range',
        'hottub': 'Hot Tub',
        'safe': 'Extra Large Vault',
        'sauna': 'Sauna',
        'medical': 'Medical facility',
        'pool': 'Large pool',
        'airstrip': 'Airstrip & Plane',
        'bar': 'Open bar',
        'yacht': 'Private Yacht'
    };

    function selectAllFacilities() {
        console.log("Starting automatic selection");
        let selectionsMade = 0;

        for (const selectName in facilitiesToSelect) {
            const desiredUpgradeName = facilitiesToSelect[selectName];
            const selectElement = document.querySelector(`div#facilities select[name="${selectName}"]`);

            if (selectElement) {
                const targetOption = Array.from(selectElement.options).find(opt => opt.text.startsWith(desiredUpgradeName));

                if (targetOption) {
                    selectElement.value = targetOption.value;
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log(`Selected: "${targetOption.text}"`);
                    selectionsMade++;
                } else {
                    console.warn(`Could not find an upgrade named: "${desiredUpgradeName}"`);
                }
            }
        }
        console.log(`All selections complete. ${selectionsMade} items selected.`);
    }

    function addButton() {
        const targetArea = document.querySelector('div#facilities div.act-wrap');
        if (targetArea && !document.getElementById('geminiUpgradeBtn')) {
            const buttonContainer = document.createElement('span');
            buttonContainer.className = 'update btn-wrap silver';
            buttonContainer.style.marginLeft = '10px';

            const buttonInput = document.createElement('input');
            buttonInput.id = 'geminiUpgradeBtn';
            buttonInput.type = 'button';
            buttonInput.value = 'SELECT MY UPGRADES';
            buttonInput.className = 'torn-btn';

            buttonContainer.appendChild(buttonInput);
            targetArea.appendChild(buttonContainer);

            buttonInput.addEventListener('click', selectAllFacilities);
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('div#facilities div.act-wrap')) {
            addButton();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();