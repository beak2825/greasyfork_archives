// ==UserScript==
// @name           DCU: Focus user name field.
// @description    Jumps automatically into the user name input field.
// @author         r2r
// @version        1.0.8
// @match          *://www.dcu.org
// @namespace      https://greasyfork.org/users/382804
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/390773/DCU%3A%20Focus%20user%20name%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/390773/DCU%3A%20Focus%20user%20name%20field.meta.js
// ==/UserScript==
// date            2022-03-10
// log             Updated for DCU March 2022 site overhaul.

(function() {
  // Login form is initially hidden. Make it visible.
  // 2021-02-06: currently not required anymore.
  // var login_form = document.getElementsByClassName('login-form')[0];
  // login_form.style.display = 'block';

  // Move the input focus to username field.
  function focus_user_name() {
    var member_number = document.getElementsByName('username')[0];
    member_number.focus();
  }
  // Run after page is loaded.
  window.onload = focus_user_name;
})();
