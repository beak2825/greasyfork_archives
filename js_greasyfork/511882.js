// ==UserScript==
// @name         wwhButton
// @namespace    Safari Scripts
// @version      0.1
// @description  change button text and href
// @author       Eric
// @match        https://wwhotels.us7.list-manage.com/subscribe/confirm-captcha
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511882/wwhButton.user.js
// @updateURL https://update.greasyfork.org/scripts/511882/wwhButton.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Once the page has loaded, set the referral code, tick checkbox, autocomplete email, handle cursor movement, and submit form on Enter key press
    window.addEventListener("load", function () {
        const button = document.querySelector('.formEmailButtonOval');
        if (button) {
            button.textContent = 'Back to WWH';
            button.href = 'https://wwhotels.us7.list-manage.com/subscribe?u=d117162a3dcf8746c0d156867&id=e295a14895';
        }

        const confirmThanksBody = document.querySelector('.confirm-thanks-body');
        if (confirmThanksBody) {
            const newButton = document.createElement('button');
            newButton.textContent = 'Go to WWH';
            newButton.onclick = function () {
                window.location.href = 'https://wwhotels.us7.list-manage.com/subscribe?u=d117162a3dcf8746c0d156867&id=e295a14895';
            };
            confirmThanksBody.appendChild(newButton);
        }
    });
})();