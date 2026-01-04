// ==UserScript==
// @name         Copy Customer Device Name to Reference Name
// @namespace    ESM Autotask Configuration Item
// @version      1.0
// @description  Copy "Customer Device Name" to "Reference Name" with "REPLACEME-" prefix
// @author       KLElisa
// @match        https://ww19.autotask.net/Mvc/CRM/InstalledProductEdit.mvc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537721/Copy%20Customer%20Device%20Name%20to%20Reference%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/537721/Copy%20Customer%20Device%20Name%20to%20Reference%20Name.meta.js
// ==/UserScript==
// Copies name from Customer Device Name and pastes it into Reference Name with prefix REPLACEME-
// Selects "SC Managed WLAN" into the "Service or Bundle" field

(function () {
    'use strict';

    function getInputByLabel(labelText) {
        const labels = Array.from(document.querySelectorAll('.EditorLabelContainer1 .PrimaryText'));
        for (const label of labels) {
            if (label.textContent.trim() === labelText) {
                const container = label.closest('.EditorLabelContainer1').nextElementSibling;
                if (container) {
                    return container.querySelector('input[type="text"]');
                }
            }
        }
        return null;
    }

    function selectDropdownItem(labelText, itemText) {
        const labels = Array.from(document.querySelectorAll('.EditorLabelContainer1 .PrimaryText'));
        for (const label of labels) {
            if (label.textContent.trim() === labelText) {
                const container = label.closest('.EditorLabelContainer1').nextElementSibling;
                const dropdown = container.querySelector('.SingleItemSelector2');

                if (dropdown) {
                    dropdown.click();

                    setTimeout(() => {
                        const items = Array.from(document.querySelectorAll('.SingleItemSelectorDropDownOverlay .Item'));
                        const targetItem = items.find(item => item.textContent.trim() === itemText);
                        if (targetItem) {
                            targetItem.click();
                        }
                    }, 1000); // delay 1sec
                }
            }
        }
    }

    function runAutomation() {
        const deviceInput = getInputByLabel("Customer Device Name");
        const referenceInput = getInputByLabel("Reference Name");

        if (deviceInput && referenceInput) {
            const deviceName = deviceInput.value.trim();
            referenceInput.value = "REPLACEME-" + deviceName; //with REPLACEME- prefix, for switches for example | comment this out and uncomment the other one based on device you're fixing
            //referenceInput.value = deviceName; //without prefix, for APs for example | comment this out and uncomment the other one based on device you're fixing

            referenceInput.dispatchEvent(new Event('input', { bubbles: true }));
            referenceInput.dispatchEvent(new Event('change', { bubbles: true }));
        }

        selectDropdownItem("Service or Bundle", "SC Managed WLAN"); //comment this out if no need to change service bundle
    }

    setTimeout(runAutomation, 5000);
})();
