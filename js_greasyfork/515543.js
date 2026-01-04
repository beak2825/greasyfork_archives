// ==UserScript==
// @name         fab.com Filtros Extras
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2024-11-02
// @description  Custom automated filter/gather script to simplify the process of adding new models from fab.com to your account, be aware that the server has a limit on how many you will be able to add to your account, and then you will have to wait to get your HTTP 429 error gone.
// @author       0x01x02x03
// @match        https://www.fab.com/listings/*
// @match        https://www.fab.com/category/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fab.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515543/fabcom%20Filtros%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/515543/fabcom%20Filtros%20Extras.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function hideOwnedElements() {
        const xpath = '//*[@id="root"]/div[1]/main/div/div[2]/div[2]/div[2]/div/ul/li';
        const elementsToHideList = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < elementsToHideList.snapshotLength; i++) {
            const element = elementsToHideList.snapshotItem(i);
            if (element && element.textContent && element.textContent.includes("Owned")) {
                element.style.display = 'none';
            }
        }
    }

    function clickAddToMyLibraryButton() {
        const xpathResult = document.evaluate('/html/body/div[3]/div[1]/main/div/aside/div/div[2]/div/button[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
        if (xpathResult && xpathResult.singleNodeValue) {
            xpathResult.singleNodeValue.click();
            window.close();
        }
    }

    function clickSpecificElementInExpandableButton() {
        const expandableButtons = document.evaluate(
            '/html/body/div[3]/div[1]/main/div/aside/div/div[2]/div[1]/div[2]/button',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        );

        const expandableButton = expandableButtons.singleNodeValue;
        if (expandableButton) {
            expandableButton.click();

            const specificElementXpath = '//div[contains(text(), "For an individual creator or a small team with not more than $100k of revenue or funding in the last 12 months.")]';
            const specificElement = document.evaluate(specificElementXpath, expandableButton, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

            if (specificElement && specificElement.singleNodeValue) {
                specificElement.singleNodeValue.click();

                const secondButtonXpath = '/html/body/div[3]/div[1]/main/div/aside/div/div[2]/div[2]/button[2]';
                const secondButton = document.evaluate(secondButtonXpath, expandableButton, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

                if (secondButton && secondButton.singleNodeValue) {
                    secondButton.singleNodeValue.click();
                    window.close();
                }
            }
        }
    }

    // Use MutationObserver to react to changes in the DOM
    const observer = new MutationObserver(hideOwnedElements);
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });

    setInterval(clickAddToMyLibraryButton, 2000);
    setInterval(clickSpecificElementInExpandableButton, 2000);
})();
