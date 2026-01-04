// ==UserScript==
// @name         My Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add a button to trigger an action
// @author       Your name
// @match        *://*.xiaoyinli.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463727/My%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/463727/My%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        const button = document.createElement('button');
        button.textContent = 'My Button';
        button.addEventListener('click', () => {
            // Add your action here
        });
        document.body.appendChild(button);
    }

    addButton();
})();
