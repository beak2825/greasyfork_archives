// ==UserScript==
// @name         Item Market shit for Luke-
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Move yes button in item market
// @author       Ask [1935081]
// @match        https://www.torn.com/page.php?sid=ItemMarket
// @downloadURL https://update.greasyfork.org/scripts/532375/Item%20Market%20shit%20for%20Luke-.user.js
// @updateURL https://update.greasyfork.org/scripts/532375/Item%20Market%20shit%20for%20Luke-.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processContainer(container) {
        const confirmButtons = container.querySelectorAll('button.confirmButton___WoFpj');
        let yesButton = null;
        confirmButtons.forEach(button => {
            if (button.textContent.trim() === "Yes") {
                yesButton = button;
            }
        });
        const closeButton = container.querySelector('button.closeButton___kyy2h');

        if (yesButton && closeButton) {
            closeButton.parentNode.insertBefore(yesButton, closeButton);
            const closeButtonContainer = closeButton.parentNode;
            closeButtonContainer.style.display = "flex";
            closeButtonContainer.style.alignItems = "center";
            closeButtonContainer.style.justifyContent = "flex-start";
            yesButton.style.fontSize = "2em";
            yesButton.style.padding = "20px 5px";
            yesButton.style.marginRight = "2px";

            return true;
        }
        return false;
    }

    const observer = new MutationObserver((mutations, obs) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.classList.contains('confirmWrapper___T6EcT')) {
                        if (processContainer(node)) obs.disconnect();
                    } else {
                        const container = node.querySelector('.confirmWrapper___T6EcT');
                        if (container && processContainer(container)) obs.disconnect();
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();