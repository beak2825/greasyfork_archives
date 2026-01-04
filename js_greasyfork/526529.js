// ==UserScript==
// @name        Timelog Color Invert (DBC Edition)
// @namespace   Violentmonkey Scripts
// @match       https://app.timelog.com/Registration/*
// @grant       none
// @version     2.0
// @author      Christina Sørensen
// @description 2/11/2025, 9:14:35 AM
// @license     EUPL-1.2
// @downloadURL https://update.greasyfork.org/scripts/526529/Timelog%20Color%20Invert%20%28DBC%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526529/Timelog%20Color%20Invert%20%28DBC%20Edition%29.meta.js
// ==/UserScript==

function setColorScheme(scheme) {
  switch(scheme){
    case 'dark':
      document.addEventListener("DOMContentLoaded", () => {document.body.style.filter = "invert(1)";});
      break;
    case 'light':
      document.addEventListener("DOMContentLoaded", () => {document.body.style.filter = "invert(0)";});
      break;
    default:
      document.addEventListener("DOMContentLoaded", () => {document.body.style.filter = "invert(1)";});
      console.log('default');
      break;
  }
}

function getPreferredColorScheme() {
  if (window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      return 'dark';
    } else {
      return 'light';
    }
  }
  return 'light';
}

function updateColorScheme(){
    setColorScheme(getPreferredColorScheme());
}

if(window.matchMedia){
  var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeQuery.addEventListener('change', updateColorScheme);
}

updateColorScheme();