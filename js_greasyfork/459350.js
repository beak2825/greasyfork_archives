// ==UserScript==
// @name         Wolt Cibus Autoselect
// @namespace    https://bengr.dev/
// @version      0.1
// @description  Automatically choose Cibus payment method in Wolt and turns off the "Use Wolt Credits" Toggle
// @author       bengry
// @match        https://wolt.com/**/checkout
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459350/Wolt%20Cibus%20Autoselect.user.js
// @updateURL https://update.greasyfork.org/scripts/459350/Wolt%20Cibus%20Autoselect.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const getUsingCreditsIndicator = () => document.querySelector('[data-test-id="Order.WoltCredits"]');

    const selectPaymentMethodSelector = '[data-test-id="PaymentMethods.SelectedPaymentMethod"]';
    const cibusPaymentMethodSelector = '[data-test-id="PaymentMethod-cibus"]';
    const creditsButtonSelector = '[data-test-id="CreditsToggle"] *:has([draggable]';

    const paymentMethodButton = await waitForElement(selectPaymentMethodSelector);
    paymentMethodButton.click();

    const cibusPaymentMethodButton = await waitForElement(cibusPaymentMethodSelector);
    cibusPaymentMethodButton.click();

    await waitForElement('[data-test-id="CreditsToggle"]')

    if (getUsingCreditsIndicator() != null) {
        const useCreditsButton = await waitForElement(creditsButtonSelector);
        useCreditsButton.click();
    }
})();

/**
* Taken from https://stackoverflow.com/a/61511955
**/
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
