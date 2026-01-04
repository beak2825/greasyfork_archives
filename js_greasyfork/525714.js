// ==UserScript==
// @name         ChatGPT Edit Cancel Confirmation
// @namespace    https://github.com/GooglyBlox
// @version      1.0
// @description  Adds a confirmation dialog when clicking the Cancel button when editing messages
// @author       GooglyBlox
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525714/ChatGPT%20Edit%20Cancel%20Confirmation.user.js
// @updateURL https://update.greasyfork.org/scripts/525714/ChatGPT%20Edit%20Cancel%20Confirmation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleCancelClick(event) {
        const target = event.target.closest('button');
        if (target &&
            target.classList.contains('btn-secondary') &&
            target.textContent.trim() === 'Cancel') {

            event.stopPropagation();
            event.preventDefault();

            if (confirm('Are you sure you want to cancel?')) {
                document.removeEventListener('click', handleCancelClick, true);

                target.click();

                setTimeout(() => {
                    document.addEventListener('click', handleCancelClick, true);
                }, 0);
            }
        }
    }

    document.addEventListener('click', handleCancelClick, true);
})();