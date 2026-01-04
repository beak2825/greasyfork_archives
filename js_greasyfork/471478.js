// ==UserScript==
// @name         Reddit Confirm Save/Submit ⚠️
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Display a confirmation popup before submitting or editing content
// @author       Agreasyforkuser
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471478/Reddit%20Confirm%20SaveSubmit%20%E2%9A%A0%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471478/Reddit%20Confirm%20SaveSubmit%20%E2%9A%A0%EF%B8%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function getUsername() {
        const userSpan = document.querySelector('span.user a');
        if (userSpan) {
            const username = userSpan.textContent;
            const maskedUsername = username
                .split('')
                .map((char, index) => (index % 3 === 2 ? '*' : char))
                .join('');
            return maskedUsername;
        }
        return 'Unknown User';
    }

    function confirmButtonClick(event) {
        const target = event.target;
        const buttonText = target.textContent.trim().toLowerCase();

        // exclude save-post and save-comment buttons
        if (target.closest('.link-save-button, .link-unsave-button, .entry')) {
            return;
        }


        if (['save', 'submit'].includes(buttonText)) {
            const username = getUsername();
            if (!confirm(`⚠️${username}⚠️`)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    document.body.addEventListener('click', confirmButtonClick);
})();