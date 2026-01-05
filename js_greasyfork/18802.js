// ==UserScript==
// @name        SavedPasswords
// @namespace   https://greasyfork.org/users/11909
// @description Saved passwords' list.
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18802/SavedPasswords.user.js
// @updateURL https://update.greasyfork.org/scripts/18802/SavedPasswords.meta.js
// ==/UserScript==

;(function (document) {
  var passwords = [
    ['url', 'txtUserName', 'userName', 'txtPassword', 'password']
  ];
  
  var setPassword = function (url, txtUserName, userName, txtPassword, password) {
    if (window.location.href.indexOf(url) < 0) return;
    var txt1 = document.getElementById(txtUserName) || document.getElementsByName(txtUserName)[0];
    var txt2 = document.getElementById(txtPassword) || document.getElementsByName(txtPassword)[0];
    if (!txt1 || !txt2) return;
    txt1.value = userName;
    txt2.value = password;
  }
  
  for (var i = 0; i < passwords.length; i++) {
    var pwd = passwords[i];
    setPassword(pwd[0], pwd[1], pwd[2], pwd[3], pwd[4]);
  }
})(document);