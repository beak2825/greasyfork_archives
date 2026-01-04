// ==UserScript==
// @name         Bing Auto Hover and Select Option
// @description  Automatically hovers over a specific element and selects an option on Bing search engine
// @match        *://www.bing.com/*
// @version 0.0.1.20250323134455
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/530620/Bing%20Auto%20Hover%20and%20Select%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/530620/Bing%20Auto%20Hover%20and%20Select%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function triggerHover() {
        const element = document.getElementById("id_h");
        if (element) {
            const mouseOverEvent = new MouseEvent("mouseover", {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(mouseOverEvent);
            console.log("Hover triggered.");
        }
    }

    function selectOption() {
        const radioButton = document.getElementById("rdiodef");
        if (radioButton) {
            radioButton.click();
            console.log("Option selected.");
        }
    }

    function handleMutations() {
        triggerHover();
        selectOption();
    }

    // Initial call on page load
    handleMutations();

    // Mutation observer to detect dynamic changes
    const observer = new MutationObserver(handleMutations);
    observer.observe(document.body, { childList: true, subtree: true });
})();
