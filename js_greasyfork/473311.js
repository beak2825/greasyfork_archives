// ==UserScript==
// @name        E4ward autologin
// @description Presses the 'Log in' button if the credentials are already filled. 
// @namespace   E4ward_copy
// @include     https://www.e4ward.com/
// @include     https://e4ward.com/
// @version     0.2
// @grant       none
// @icon        https://www.google.com/s2/favicons?sz=64&domain=e4ward.com

// @downloadURL https://update.greasyfork.org/scripts/473311/E4ward%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/473311/E4ward%20autologin.meta.js
// ==/UserScript==

console.log("Starting autologin script...");

var buttons = document.getElementsByClassName("buttonblue");

var target_button = buttons[0]
var username = document.getElementById('username');
var password = document.getElementById('password');
var retry_time = 500;
var tries = 0;

function click_target_button() {
  if (username.value != '' && password.value != '') {
    target_button.click();
  } else {
    console.log("Username or password was not given... Tried " + tries + " times.");
    setTimeout(click_target_button, retry_time);
  }
}

setTimeout(click_target_button, retry_time);