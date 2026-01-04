// ==UserScript==
// @name         SAP AI Playground | Modify maxlength of textarea
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Increase maxlength attribute to 800000 for textarea with CSS selector #search
// @author       ChatGPT
// @match        https://ai-playground.cfapps.sap.hana.ondemand.com/index.html
// @grant        none
// @author       tddschn
// @downloadURL https://update.greasyfork.org/scripts/463987/SAP%20AI%20Playground%20%7C%20Modify%20maxlength%20of%20textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/463987/SAP%20AI%20Playground%20%7C%20Modify%20maxlength%20of%20textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyMaxLength() {
        const textarea = document.querySelector("#search");
        if (textarea) {
            textarea.setAttribute("maxlength", "800000");
        }
    }

    // Use a MutationObserver to handle dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                modifyMaxLength();
            }
        });
    });

    // Set up the observer configuration
    const observerConfig = {
        childList: true,
        subtree: true,
    };

    // Start observing the document body
    observer.observe(document.body, observerConfig);

    // Call the function to modify the maxlength attribute if the element is already in the DOM
    modifyMaxLength();
})();
