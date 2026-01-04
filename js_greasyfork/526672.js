// ==UserScript==
// @name         ProxMox Auto Login
// @version      1.0
// @description  ProxMox auto Login
// @author       xX_KSGaming_Xx (KoKsus
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ks-bio.pl
// @match        https://172.31.0.30:8006/*
// @grant        none
// @namespace https://greasyfork.org/users/1414785
// @downloadURL https://update.greasyfork.org/scripts/526672/ProxMox%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/526672/ProxMox%20Auto%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = 'root'; // Here goes ur Login
    const password = 'URPASWORD'; // Here goes ur Password

    function login() {
        let userField = document.querySelector('#textfield-1065-inputEl');
        let passField = document.querySelector('#textfield-1066-inputEl');
        let loginButton = document.querySelector('#button-1070-btnEl');

        if (userField && passField && loginButton) {
            userField.value = username;
            passField.value = password;

            userField.dispatchEvent(new Event('input', { bubbles: true }));
            passField.dispatchEvent(new Event('input', { bubbles: true }));

            setTimeout(() => {
                loginButton.click();
            }, 1);
        }
    }


    window.onload = function() {
        setTimeout(login, 100);
    };
})();