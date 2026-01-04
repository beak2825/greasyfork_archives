// ==UserScript==
// @name        Stride2Hacks - stridestart.com
// @namespace   Violentmonkey Scripts
// @match       https://k12al.stridestart.com/
// @grant       none
// @version     1.4.1
// @author      VarNull
// @description 1/31/2022, 12:25:43 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439432/Stride2Hacks%20-%20stridestartcom.user.js
// @updateURL https://update.greasyfork.org/scripts/439432/Stride2Hacks%20-%20stridestartcom.meta.js
// ==/UserScript==

// Variables
var ist = 'True';

// Sets session inactivity time to virtually infinity
function warningFreeze() {
  var SESSION_INACTIVITY_WARNING_MINUTES = 999999999999999999999999999999999999999999999999999999999999999999995;
  var SESSION_INACTIVITY_MINITES = 999999999999999999999999999999999999999999999999999999999999999999999;
  while (ist === 'True'){
    _tSessionStart = _tSessionStart + 1;
  }
}

// Spoofs your amount of answers (always gives 100%)
function smart() {
  var varOfAnswers = window.prompt('How many answers do you want to set to?');
  var _sessionAnswers = varOfAnswers;
  var _sessionCorrect = varOfAnswers;
  var container = document.getElementById('1955');
  var td = container.querySelector('#home-page > div > div.page-content-slimscroll > div.app_stats > div > span.stats_value.stats_answered');
  if(td){
   td.innerHTML = varOfAnswers;
  var td2 = container.querySelector('#home-page > div > div.page-content-slimscroll > div.app_stats > div > span.stats_value.stats_correct.stats_optional');
  if(td2){
   td2.innerHTML = varOfAnswers + ' (100%)';
  }
 }
}
// Quick Redirect allows you to quickly redirect. All you need to do is type quickRe in console
// List of redirects: k12 (goes to ols.k12.com), youtube (opens youtube), close (closes window)
function quickRe() {
  var site = window.prompt('Site?');
  if (site === 'k12') {
    windowObjectReference = window.open("http://ols.k12.com/", "K12_WindowName", windowFeatures);
  }
  if (site === 'youtube') {
    windowObjectReference = window.open("http://youtube.com/", "K12_WindowName", windowFeatures);
  }
  if (site === 'close') {
    window.close();
  }
}

// Settings
var all = window.prompt('Enable all? (y/n)');
if (all === 'y') {
  warningFreeze();
  smart();
}
else{
  var freeze = window.prompt('Turn on freeze? (Y/n)');
  var smart = window.prompt('Turn on smart/ (Y/n)');
}

if (freeze === 'Y') {
  warningFreeze();
}
else {}

if (smart === 'Y') {
  smart();
}
else {}
