// ==UserScript==
// @name        web_noimmersion_experiment OptOut
// @namespace   web_noimmersion
// @include     https://www.duolingo.com/*
// @version     1
// @run-at      document-start
// @grant       none
// @description This script opts out of duolingo's web_noimmersion_experiment
// @downloadURL https://update.greasyfork.org/scripts/17151/web_noimmersion_experiment%20OptOut.user.js
// @updateURL https://update.greasyfork.org/scripts/17151/web_noimmersion_experiment%20OptOut.meta.js
// ==/UserScript==


window.addEventListener('beforescriptexecute', function(e){
//  if (document.getElementsByTagName("script")[7] == e.target){
    if (e.target.innerHTML.contains('duo.immersion_enabled = false;')){
    console.log('este es el bueno');
    eval(e.target.innerHTML.replace('duo.immersion_enabled = false;','duo.immersion_enabled = true;').replace('"web_noimmersion_experiment": true','"web_noimmersion_experiment": false'));
    e.stopPropagation();
    e.preventDefault();
    window.removeEventListener(e.type, arguments.callee, true);
  }
}, false);