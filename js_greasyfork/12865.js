// ==UserScript==
// @name        WaniKani I don't care about sect names
// @author      tomboy
// @namespace   japanese
// @description You had enough of sect names? Here's your holy grail!
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http*://*wanikani.com/chat/*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/12865/WaniKani%20I%20don%27t%20care%20about%20sect%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/12865/WaniKani%20I%20don%27t%20care%20about%20sect%20names.meta.js
// ==/UserScript==

window.addEventListener('load', function (e) {
  var sectNames = document.getElementsByClassName('group');
  while(sectNames.length > 0){
    sectNames[0].parentNode.removeChild(sectNames[0]);
  }
});
