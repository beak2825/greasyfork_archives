// ==UserScript==
// @name         Sallie Mae Bitwarden Support
// @namespace    https://fairburn.dev/
// @version      1.1
// @description  Fixes the Sallie Mae login form so that Bitwarden can auto-fill it.
// @author       Garrett Fairburn
// @license      Apache 2.0
// @match        https://www.salliemae.com/login/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salliemae.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/449879/Sallie%20Mae%20Bitwarden%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/449879/Sallie%20Mae%20Bitwarden%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var form = document.querySelector('form#LoginForm');

    // Remove event listeners from input fields.
    form.querySelectorAll('input:not([type="hidden"])').forEach(function(el) {
        el.replaceWith(el.cloneNode(true));
    });

    // Enable submit button.
    var btn = form.querySelector('button#login-button');
    btn.removeAttribute('disabled');
    btn.classList.remove('disabled');
})();