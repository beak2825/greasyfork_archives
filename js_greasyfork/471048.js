// ==UserScript==
// @name         AutoAlmoxarife
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Clica autoamticamente nos links para consultar materiais
// @match        https://asiweb.tre-rn.jus.br/asi/web?target=com.linkdata.central.menu.MenuGateway&action=start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471048/AutoAlmoxarife.user.js
// @updateURL https://update.greasyfork.org/scripts/471048/AutoAlmoxarife.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateMouseClick(element) {
        var event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        element.dispatchEvent(event);
    }

    function areElementsLoaded() {
        var targetElement1 = document.evaluate('/html/body/div[2]/form/div[2]/div/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var targetElement2 = document.evaluate('//*[@id="centralViewport"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        return targetElement1 !== null && targetElement2 !== null;
    }

    function waitForElementsLoad(callback) {
        var intervalId = setInterval(function() {
            if (areElementsLoaded()) {
                clearInterval(intervalId);
                callback();
            }
        }, 100);
    }

    function performActions() {
        var firstElement = document.evaluate('//*[@id="menuGroupLink000380"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (firstElement) {
            simulateMouseClick(firstElement);

            setTimeout(function() {
                // Find and click the second button
                var secondElement = document.evaluate('//*[@id="menuItemLink000098"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                if (secondElement) {
                    simulateMouseClick(secondElement);
                }
            }, 1000);
        }
    }

    setTimeout(function() {
        waitForElementsLoad(performActions);
    }, 1000);
})();
