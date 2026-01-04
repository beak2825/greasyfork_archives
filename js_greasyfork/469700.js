// ==UserScript==
// @name        Get Input Values
// @version     1
// @grant       none
// @description This script logs the values of specific input fields when a button is clicked
// @include     http://www.example.com/*
// @namespace https://greasyfork.org/users/1114751
// @downloadURL https://update.greasyfork.org/scripts/469700/Get%20Input%20Values.user.js
// @updateURL https://update.greasyfork.org/scripts/469700/Get%20Input%20Values.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    let loginButton = document.querySelector('div.btn_primary.disabled');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            let usernameInput = document.querySelector('input[placeholder="请输入账号"]');
            let passwordInput = document.querySelector('input[placeholder="请输入密码"]');
            if (usernameInput && passwordInput) {
                console.log('Username: ' + usernameInput.value);
                console.log('Password: ' + passwordInput.value);
            }
        });
    }
});
