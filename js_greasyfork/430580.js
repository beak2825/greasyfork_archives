// ==UserScript==
// @name         BitBucket checkout pull request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       Mark Metcalfe
// @match        https://git.totaralearning.com/projects/*/pull-requests/*
// @description Adds a button that copies the git checkout string to your clipboard
// @downloadURL https://update.greasyfork.org/scripts/430580/BitBucket%20checkout%20pull%20request.user.js
// @updateURL https://update.greasyfork.org/scripts/430580/BitBucket%20checkout%20pull%20request.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let dropdownMenu = document.querySelector(".pull-request-more-actions div[role='menu']");

    let checkoutButton = document.cloneNode(dropdownMenu.lastChild);
    checkoutButton.firstChild.remove();

    let buttonText = document.createElement("span");
    buttonText.textContent = 'Checkout pull request';
    checkoutButton.appendChild(buttonText);

    dropdownMenu.insertBefore(checkoutButton, dropdownMenu.lastChild);
})();

function checkoutPullRequest() {
    alert('clicked!');
}
