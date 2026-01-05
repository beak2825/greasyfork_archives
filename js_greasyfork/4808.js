// ==UserScript==
// @name           odnoklassniki.(ru|ua) loginform email autofill
// @namespace      http://userscripts.org/
// @description    automatically fills email into login form at odnoklassniki.(ru|ua)
// @include        http://odnoklassniki.ru/*
// @include        http://*.odnoklassniki.ru/*
// @include        http://odnoklassniki.ua/*
// @include        http://*.odnoklassniki.ua/*
// @version 0.0.1.20140904104753
// @downloadURL https://update.greasyfork.org/scripts/4808/odnoklassniki%28ru%7Cua%29%20loginform%20email%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/4808/odnoklassniki%28ru%7Cua%29%20loginform%20email%20autofill.meta.js
// ==/UserScript==


function main() {
  var email = "yz@yz.kiev.ua";

    var emailBox = document.getElementById("field_email");
    if (emailBox) {
      emailBox.value = email;
    }
    document.getElementById("field_password").focus();
}
main();
