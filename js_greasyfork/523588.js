// ==UserScript==
// @name         Huawei Echolife HG8145V5 QuickLogin
// @namespace    http://tampermonkey.net/
// @version      2025-01-13
// @description  Login Echolife HG8145V5 no tap button auto
// @author       Johnte Mburu
// @match        https://192.168.100.1/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=100.1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523588/Huawei%20Echolife%20HG8145V5%20QuickLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/523588/Huawei%20Echolife%20HG8145V5%20QuickLogin.meta.js
// ==/UserScript==

(function() {
   'use strict';
var myUsername = 'telecomadmin';
var myPassword = 'admintelecom';
var arr = document.getElementsByTagName("input");
for (var i = 0; i < arr.length; i++) {
  if (arr[i].type == 'password') arr[i].setAttribute('type', 'text');
}
const usernameInputs = document.querySelectorAll('input[type="text"]');
// Handle username inputs
usernameInputs.forEach(input => {
  input.setAttribute('autocomplete', 'username');
});
// find the fiends in your login form
var loginField = document.getElementById('txt_Username');
var passwordField = document.getElementById('txt_Password');

// fill in your username and password
loginField.value = myUsername;
passwordField.value = myPassword;

// if you want, you can even automaticaly submit the login form
document.getElementById('loginbutton').click();
})();