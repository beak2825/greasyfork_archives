// ==UserScript==
// @name         Skip Alert in Review
// @author       Saiful Islam
// @version      0.1
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://wayfarer.nianticlabs.com/*
// @downloadURL https://update.greasyfork.org/scripts/481468/Skip%20Alert%20in%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/481468/Skip%20Alert%20in%20Review.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

   var skipAlert = Number(window.prompt("---Skip Alert Page Review---\n\nType 1 to active\nType 0 to Remove", ""));
   if(skipAlert == 1)
   {
	   localStorage.setItem("SkipAlertPage", skipAlert);
   }
   else if(skipAlert == 0)
   {
	   localStorage.setItem("SkipAlertPage", skipAlert);
   }
   return;
   
})();