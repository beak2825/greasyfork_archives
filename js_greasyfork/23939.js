// ==UserScript==
// @name duolingo_immersion_every_language
// @namespace   duolingo_immersion_every_language
// @include     https://www.duolingo.com/*
// @version     1
// @run-at      document-start
// @grant       none
// @description This script gives access to immersion if you don't have it, and in unsupported languages.
// @description based on script: https://greasyfork.org/en/scripts/17151-web-noimmersion-experiment-optout
// @downloadURL https://update.greasyfork.org/scripts/23939/duolingo_immersion_every_language.user.js
// @updateURL https://update.greasyfork.org/scripts/23939/duolingo_immersion_every_language.meta.js
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e){
    if(duo.immersion_enabled == false) duo.immersion_enabled = true;
    if (e.target.innerHTML.contains('duo.immersion_enabled = false;')){
    eval(e.target.innerHTML.replace('duo.immersion_enabled = false;','duo.immersion_enabled = true;').replace('"web_noimmersion_experiment": true','"web_noimmersion_experiment": false'));
    e.stopPropagation();
    e.preventDefault();
    window.removeEventListener(e.type, arguments.callee, true);
  }
}, false);