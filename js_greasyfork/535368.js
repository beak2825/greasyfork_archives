// ==UserScript==
// @name         BGG Simplify Mark Read Button
// @namespace    https://github.com/kofaysi/bgg-userscripts/blob/main/bgg-simplify-mark-read-button.user.js
// @version      1.5
// @description  Replaces 'Mark All Read' with a direct 'Mark Current Page Read' button and hides unnecessary elements.
// @author       https://github.com/kofaysi/
// @match        https://boardgamegeek.com/subscriptions*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535368/BGG%20Simplify%20Mark%20Read%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/535368/BGG%20Simplify%20Mark%20Read%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simplifyMarkReadButton() {
        // Find the 'Mark All Read' button by its content
        const buttons = document.querySelectorAll("button");
        let markAllReadButton = null;

        buttons.forEach(button => {
            if (button.textContent.includes("Mark All Read")) {
                markAllReadButton = button;
            }
        });

        if (!markAllReadButton) return;

        // Find its dropdown container
        const dropdownContainer = markAllReadButton.closest("div.dropdown");
        if (!dropdownContainer) return;

        // Find the dropdown menu
        let dropdownMenu = dropdownContainer.querySelector(".dropdown-menu");
        if (!dropdownMenu) return;

        // Find the 'Mark Current Page Read' button inside the dropdown
        let markCurrentPageButton = null;
        dropdownMenu.querySelectorAll("button").forEach(button => {
            if (button.textContent.includes("Mark Current Page Read")) {
                markCurrentPageButton = button;
            }
        });

        if (!markCurrentPageButton) return;

        // Clone 'Mark Current Page Read' and replace the main button
        const newButton = markCurrentPageButton.cloneNode(true);
        newButton.onclick = () => markCurrentPageButton.click();
        newButton.className = markAllReadButton.className.replace("dropdown-toggle", ""); // Remove dropdown-toggle class
        newButton.textContent = "Mark Current Page Read";

        // Change button color
        newButton.style.setProperty("--bs-btn-bg", "#005bca");
        newButton.style.setProperty("--bs-btn-hover-bg", "#004a9f");
        newButton.style.setProperty("--bs-btn-border-color", "#005bca");
        newButton.style.setProperty("--bs-btn-hover-border-color", "#004a9f");
        newButton.style.setProperty("--bs-btn-active-border-color", "#004a9f");
        newButton.style.setProperty("--bs-btn-active-color", "#004a9f");

        // Replace 'Mark All Read' button with new one
        markAllReadButton.replaceWith(newButton);

        // Hide the dropdown menu
        dropdownMenu.style.display = "none";
    }

    // Use MutationObserver to wait for dynamically loaded content
    function observePage() {
        const observer = new MutationObserver(() => {
            simplifyMarkReadButton();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(simplifyMarkReadButton, 2000); // Delay execution to ensure elements are fully loaded
        observePage();
    });
})();