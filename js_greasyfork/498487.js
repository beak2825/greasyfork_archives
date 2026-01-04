// ==UserScript==
// @name         Automate Password CSRINRU
// @namespace    SWScripts
// @version      v1
// @description  Automate Password of RIN forum
// @match        https://privatebin.rinuploads.org/*
// @author       BN_LOS
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498487/Automate%20Password%20CSRINRU.user.js
// @updateURL https://update.greasyfork.org/scripts/498487/Automate%20Password%20CSRINRU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var passwordField = document.getElementById('passworddecrypt');
        if (passwordField) {
            passwordField.value = 'cs.rin.ru';

            var submitButton = document.querySelector('button.btn.btn-success.btn-block');
            if (submitButton) {
                submitButton.click();
            }
        }
    });
})();
