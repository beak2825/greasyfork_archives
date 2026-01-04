// ==UserScript==
// @name        Mail.com open login dialog and login automatically
// @namespace   mail_com_show_login_box
// @description Clicks the login dialog open and submits username/password if they are available from keepass.
// @include     https://www.mail.com/
// @version     1.0.2
// @grant       none
// @icon        https://www.mail.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/372325/Mailcom%20open%20login%20dialog%20and%20login%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/372325/Mailcom%20open%20login%20dialog%20and%20login%20automatically.meta.js
// ==/UserScript==

document.getElementById('login-button').click();

var target_button = document.querySelectorAll('button[type="submit"].login-submit');
var username = document.getElementById('login-email');
var password = document.getElementById('login-password');
var retry_time = 500;
var tries = 0;

function click_target_button() {
  if (username.value != '' && password.value != '') {
    target_button[0].click();
  } else {
    console.log("Username or password was not given... Tried " + tries + " times.");
    tries++
    setTimeout(click_target_button, retry_time);
  }
}

setTimeout(click_target_button, retry_time);