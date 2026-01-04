// ==UserScript==
// @name        Posti autologin
// @namespace   posti_jump_to_login
// @description Presses the 'Kirjaudu' button if the credentials are already filled. 
// @include     https://todentaminen.posti.fi/uas/authn/*
// @version     0.0.2
// @grant       none
// @icon         https://posti.fi/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/473318/Posti%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/473318/Posti%20autologin.meta.js
// ==/UserScript==

var target_button = document.getElementsByClassName('no-double-submit')[0];
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