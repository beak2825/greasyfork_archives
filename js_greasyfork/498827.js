// ==UserScript==
// @name         Modify Desidime Buttons
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  Change href to data-href and set target to _blank for specified buttons on desidime.com
// @author       Dev Goyal
// @match        https://www.desidime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498827/Modify%20Desidime%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/498827/Modify%20Desidime%20Buttons.meta.js
// ==/UserScript==



function fixDesiDimeLinks() {
        // Select all buttons with the specified class
    const buttons = document.querySelectorAll('.btn-lgetdeal.home-page-get-deal.gtm-getdeal-home');

    // Iterate over each button and modify the attributes
    buttons.forEach(button => {
        const dataHref = button.getAttribute('data-href');
        if (dataHref) {
            button.setAttribute('href', dataHref);
            button.setAttribute('target', '_blank');
            button.removeAttribute('data-href');
            button.removeAttribute('data-href-alt');

        }
    });
}



// Function to handle DOM changes
function handleDOMChanges(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
            // Handle attribute changes (e.g., href attribute)
            fixDesiDimeLinks();
        } else if (mutation.type === 'childList') {
            // Handle changes in the DOM structure (e.g., added nodes)
            fixDesiDimeLinks();
        }
    }
}

// Wrap the MutationObserver setup inside a DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Use MutationObserver to detect changes in the document
    const observer = new MutationObserver(handleDOMChanges);

    // Observe changes in the body and its subtree
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });

    // Call fixDesiDimeLinks once when the DOM is ready
    fixDesiDimeLinks();
});

