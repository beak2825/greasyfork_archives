// ==UserScript==
// @name        York SSO Autologin
// @namespace   Violentmonkey Scripts
// @match       https://passportyork.yorku.ca/ppylogin/ppylogin
// @grant       none
// @version     1.1
// @author      Judah Goldstein
// @description clicks the login button automaticaly when the SSO page loads, only works if you have autofill on.
// @downloadURL https://update.greasyfork.org/scripts/421343/York%20SSO%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/421343/York%20SSO%20Autologin.meta.js
// ==/UserScript==

window.onload = function() {
  var button = document.getElementsByName("dologin"); //finds login button
  var username = document.getElementById("mli");      //finds username box
  var password = document.getElementById("password"); //finds password box
  if(username.value != "" && password.value != ""){ //makes sure you've actually got the username and password filled in
    console.log("success, logging you in");
    button[0].click(); //hits login button 
  } else {
    alert("I'm happy that you have such confidence in my mind reading abilities but this script only works with autofill enabled for your YorkU account's username and password through your browser. if this is a mistake please make an issue on my github at https://github.com/JudahGoldstein/York-SSO-Autologin");
  }
}
