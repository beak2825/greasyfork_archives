// ==UserScript==
// @name         YGG auto-login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks the "Connexion" button on the login page
// @author       tu0mas
// @match        https://www.ygg.re/auth/login
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502149/YGG%20auto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/502149/YGG%20auto-login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        const button = document.querySelector('button[type="submit"]');
        if (button) {
            button.click();
        }
    });
})();
