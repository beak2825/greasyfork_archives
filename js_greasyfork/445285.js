// ==UserScript==
// @name     Exact Login
// @description Adds the password box to the login page on load
// @version  1
// @grant    none
// @include  https://start.exactonline.nl/docs/Login.aspx*
// @include  https://start.exactonline.be/docs/Login.aspx*
// @include  https://start.exactonline.de/docs/Login.aspx*
// @include  https://start.exactonline.fr/docs/Login.aspx*
// @include  https://start.exactonline.co.uk/docs/Login.aspx*
// @license MIT
// @include  https://start.exactonline.com/docs/Login.aspx*
// @namespace https://greasyfork.org/users/916416
// @downloadURL https://update.greasyfork.org/scripts/445285/Exact%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/445285/Exact%20Login.meta.js
// ==/UserScript==


addPasswordBoxExact=function(){
  s=document.getElementById("LoginForm_HiddenPassword").style.display = "block";
  s=document.getElementById('LoginForm_HiddenPassword').name = 'LoginForm$Password';
  s=document.getElementById('LoginForm_HiddenPassword').placeholder = 'Password';
  s=document.getElementById('LoginForm_HiddenPassword').id = 'LoginForm_Password';
  s=document.getElementById('LoginForm_btnSave').value = 'Login';
};

void(addPasswordBoxExact());