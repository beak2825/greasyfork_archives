// ==UserScript==
// @name         DontFollow for Linkedin
// @namespace    https://github.com/ketan-16/dontfollow-for-linkedin
// @version      0.1
// @description  Unticks the annoying "Follow company for more updates" in the final Easy Apply modal.
// @author       Ketan Yadav
// @match        https://www.linkedin.com/jobs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513912/DontFollow%20for%20Linkedin.user.js
// @updateURL https://update.greasyfork.org/scripts/513912/DontFollow%20for%20Linkedin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[USERSCRIPT]: DontFollow for LinkedIn: Started.")
        // Function to uncheck the "Follow this company" checkbox
    function uncheckFollowCompany() {
        const checkbox = document.getElementById("follow-company-checkbox");
        if (checkbox?.checked) {
            console.log("[USERSCRIPT]: DontFollow for LinkedIn: Unchecked Follow Button!")
            checkbox.click();
        }
    }

    // Initialize MutationObserver when the page is fully loaded
    window.addEventListener("load", () => {
        const observer = new MutationObserver(() => uncheckFollowCompany());

        // Start observing mutations in the body subtree
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();