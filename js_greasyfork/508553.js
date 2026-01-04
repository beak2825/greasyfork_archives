// ==UserScript==
// @name         Facebook Back to Top Button
// @namespace    https://greasyfork.org/users/123456
// @version      1.0
// @description  Adds a "Back to Top" button on Facebook pages.
// @author       Saimen Nemias
// @match        https://www.facebook.com/*
// @icon         https://www.facebook.com/favicon.ico
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/508553/Facebook%20Back%20to%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/508553/Facebook%20Back%20to%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerText = 'Top';
    backToTopButton.style.position = 'fixed';
    backToTopButton.style.bottom = '10px';
    backToTopButton.style.right = '10px';
    backToTopButton.style.padding = '10px';
    backToTopButton.style.backgroundColor = '#4267B2';
    backToTopButton.style.color = '#fff';
    backToTopButton.style.border = 'none';
    backToTopButton.style.borderRadius = '5px';
    backToTopButton.style.cursor = 'pointer';
    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Donation message
    console.log('Se você gostou deste script e deseja apoiar o desenvolvimento, considere fazer uma doação em [Buy Me a Coffee](https://buymeacoffee.com/saimen). Agradeço pelo apoio!');
})();
