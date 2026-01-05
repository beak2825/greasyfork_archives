// ==UserScript==
// @name         Messenger+
// @namespace    DanielVestol.Messenger
// @description  Improves the facebook messenger desktop experience
// @include      https://www.messenger.com/*
// @author       Daniel Vestol
// @version      1.111
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20585/Messenger%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/20585/Messenger%2B.meta.js
// ==/UserScript==
console.log('Userscript: Messenger+')
document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOMContentLoaded')
  setInterval(function() {
     document.getElementsByClassName('_s15')[0].style.display = 'none';
     a = document.getElementsByClassName("_fl3 _30yy")[0];
     a.click();}, 5000);
  
});