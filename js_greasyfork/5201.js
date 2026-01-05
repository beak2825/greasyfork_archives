// ==UserScript==
// @name      SolarMovieLogin
// @namespace http://oryuken/solarautologin
// @include   http://www.solarmovie.is/*
// @exclude   http://www.solarmovie.is/link/*
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant     GM_addStyle
// @version 0.0.1.20140923065650
// @description Keep signed on to Solarmovie.is
// @downloadURL https://update.greasyfork.org/scripts/5201/SolarMovieLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/5201/SolarMovieLogin.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

/**************************************************************************
    This script attempts to keep constantly logged on to solarmovie.is by 
    reloading every 20mins and attempt to log on and off to reset the site 
    logon timer

    Enter your username and password below here
**********************************************************************/
var yourUsername = 'Oryuken';
var yourPassword = 'solarpower';

if (window.top === window.self) { //-- Don't run on frames or iframes.
  //check if login when site loads for the first time
  setTimeout(clickLogin, 3000);
  //runs again after 20 mins or 1200000sec
  setTimeout(solarLogin, 1200000);
  //solarLogin(); 
}

function solarLogin() {
  window.location.reload;
  //check if logged out, just log back in
  //add delay for site to finish loading
  setTimeout(reLogin, 3000);
}

//This function will force a logout and relogin
function reLogin() {
  //If logged in log out and log in again
  var searchLink = $("[href^='/forum/logout/?']"); 
  if (searchLink.length) {
    triggerMouseEvent(searchLink[0], 'click');
    // try to log back in again after some delay
    setTimeout(clickLogin, 4000);
  }
  else //just log back in
    setTimeout(clickLogin, 1000);  
}

//This function looks for the Login link to determine if
//logged out of site and logs back in
function clickLogin() {
  var searchLink = $('#login');  
  if (searchLink.length) {
    triggerMouseEvent(searchLink[0], 'click');
    setTimeout(submitUnamePasswd, 1000);
  }
}

function submitUnamePasswd() {
  var sForm = document.getElementById('login_form');
  console.log('sForm.length= ' + sForm.length);
  if (sForm.length) {
    var sUsername = document.getElementById('login_login'),
    sPasswd = document.getElementById('login_password');
    sUsername.value = yourUsername;
    sPasswd.value = yourPassword;
    console.log('sPasswd.value= '+sPasswd.value);
    var passwordExists = false;
    for (var i = 0; i < sForm.length; i++) {
      var thisElement = sForm[i];
      if (thisElement.type == 'password') {
        if (thisElement.value.length > 6) {
          passwordExists = true;
        }
      }
      if ((thisElement.type == 'submit') && (passwordExists)) {
        console.log('thisElement.type= '+thisElement.type);
          triggerMouseEvent(thisElement, 'click');
      }
    }
  } 
}

function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}