// ==UserScript==
// @name         HackTheBox Academy - Press Enter To Submit
// @namespace    https://greasyfork.org/en/users/1488917-l0wk3y-iaan

// @compatible   Tampermonkey
// @version      1.0
// @description  Automatically submits any dynamic question input by pressing ENTER
// @author       L0WK3Y @infophreak
 
// @match        https://www.hackthebox.com/home*
// @match        https://academy.hackthebox.com/*
// @match        https://www.hackthebox.eu/home*
// @icon         https://www.hackthebox.com/images/favicon.png
 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540864/HackTheBox%20Academy%20-%20Press%20Enter%20To%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/540864/HackTheBox%20Academy%20-%20Press%20Enter%20To%20Submit.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    function setupInputListeners() {
        const inputs = document.querySelectorAll('input[id^="answer"]');
 
        inputs.forEach(input => {
            if (input.dataset.enterListenerAttached) return; // prevent duplicates
 
            input.dataset.enterListenerAttached = true;
 
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const idSuffix = this.id.replace('answer', '');
                    const submitBtn = document.getElementById(`btnAnswer${idSuffix}`);
                    if (submitBtn) submitBtn.click();
                }
            });
        });
    }
 
    // Re-run listener setup as new elements may be loaded dynamically
    const observer = new MutationObserver(() => setupInputListeners());
    observer.observe(document.body, { childList: true, subtree: true });
 
    // Initial setup
    setupInputListeners();
})();