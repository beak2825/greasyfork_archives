// ==UserScript==
// @name         Start Position set for All Nomination Submission Data
// @author       Saiful Islam
// @version      0.3
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://www.google.com/*
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/477927/Start%20Position%20set%20for%20All%20Nomination%20Submission%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/477927/Start%20Position%20set%20for%20All%20Nomination%20Submission%20Data.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {
   const aNumber = Number(window.prompt("---Auto Nomination Data Copy---\n\nEnter The number of Row according to the sheet to start from",""));
   var startPositionNumber = parseInt(aNumber)-2;
   localStorage.setItem("StartPosition", startPositionNumber);
   alert(parseInt(localStorage.getItem("StartPosition")));
   return;
   
})();