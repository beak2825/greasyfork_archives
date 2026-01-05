// ==UserScript==
// @name        agent login
// @namespace   IRCTC
// @description login
// @include     https://www.services.irctc.co.in/*
// @version     1
// @grant       none
// @description agt
// @downloadURL https://update.greasyfork.org/scripts/24085/agent%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/24085/agent%20login.meta.js
// ==/UserScript==
if(document.getElementById("button")){
document.LoginForm.userName.value ='csc'
document.LoginForm.password.value=''
//if(confirm("Countinus...")){
//document.forms.LoginForm.submit();}
}
if (document.LoginForm.password.value.length == 0){
  document.LoginForm.password.value="";
  document.LoginForm.Submit.click();
}