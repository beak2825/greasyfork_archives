// ==UserScript==
// @name         Auto Login Tool
// @namespace    https://devcoderx.dev/
// @version      1.0
// @description  Automatically logs into websites you specify
// @author       devcoderx
// @match        *://*/*
// @license      MIT
// @grant        none
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/542747/Auto%20Login%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/542747/Auto%20Login%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const usernameField = document.querySelector('input[name="username"], input[type="email"]');
    const passwordField = document.querySelector('input[type="password"]');

    if (usernameField && passwordField) {
        usernameField.value = "yourUsername";
        passwordField.value = "yourPassword";
        const loginForm = passwordField.closest('form');
        if (loginForm) loginForm.submit();
    }
})();

