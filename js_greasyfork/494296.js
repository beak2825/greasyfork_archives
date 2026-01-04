// ==UserScript==
// @name         Azure DevOps Chore Prefixer
// @version      1
// @description  Prefix "chore: " to Merge PR Commit message
// @match        https://dev.azure.com/*
// @match        https://*.visualstudio.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1297998
// @downloadURL https://update.greasyfork.org/scripts/494296/Azure%20DevOps%20Chore%20Prefixer.user.js
// @updateURL https://update.greasyfork.org/scripts/494296/Azure%20DevOps%20Chore%20Prefixer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function prependChore() {
        // Step 1: Click checkbox
        const checkbox = findCheckbox();
        if (!checkbox) {
            return;
        }
        if(checkbox.getAttribute("aria-checked") === "false") {
            checkbox.click();
        }

        // Step 2: Prepend "chore: " to input value if it doesn't already start with it
        const input = findInput();
        if (!input) {
            return;
        }
        if(!input.value.startsWith("chore: ")) {
            const newValue = "chore: " + input.value;
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
            nativeInputValueSetter.call(input, newValue);
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
        }
    }

    // Define a function to handle DOM mutations
    function handleMutations(mutationsList, observer) {
        const checkbox = findCheckbox();
        if (!checkbox) {
            return;
        }
        const input = findInput();
        if(input) {
            observer.disconnect();
        }
        prependChore();
    }

    function findCheckbox() {
        return Array.from(document.querySelectorAll('div')).find(div => div.innerText === 'Customize merge commit message');
    }

    function findInput() {
        return document.querySelector('input[value^="Merged PR"]');
    }


    // Create a new MutationObserver
    var observer = new MutationObserver(handleMutations);

    // Configure the observer to watch for changes in the DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();