// ==UserScript==
// @name         [Smail Pro] Temporary Gmail Address - Reset
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Let's you create unlimited temporary gmails for bypassing most of the websites.
// @author       $um@n
// @match        ://*.smailpro.com/temp-gmail
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smailpro.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496227/%5BSmail%20Pro%5D%20Temporary%20Gmail%20Address%20-%20Reset.user.js
// @updateURL https://update.greasyfork.org/scripts/496227/%5BSmail%20Pro%5D%20Temporary%20Gmail%20Address%20-%20Reset.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        if (button.textContent.includes("Create Temporary Gmail")) {
            button.click();
        }
    });

    const resetButton = document.createElement("button");
    resetButton.innerText = "Reset Email";
    resetButton.style = `
       background-color: #ffe484;
       border-radius: 2rem;
       box-shadow: inset 0 -1px 1px rgba(33, 37, 41, 0.15), 0 0.25rem 1.5rem rgba(255, 255, 255, 0.75);
       display: inline-block;
       padding: 5px 15px;
       position: fixed;
       top: 50%;
       right: 15px;
    `;
    document.body.appendChild(resetButton);
    resetButton.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.clear();
        location.reload();
    });
})();