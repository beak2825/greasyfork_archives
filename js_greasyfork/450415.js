// ==UserScript==
// @name         local variable Zero
// @author       Saiful Islam
// @version      0.2
// @description  Help users in review
// @namespace    https://github.com/AN0NIM07
// @match        https://www.google.com/*
// @grant        GM.setClipboard
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/450415/local%20variable%20Zero.user.js
// @updateURL https://update.greasyfork.org/scripts/450415/local%20variable%20Zero.meta.js
// ==/UserScript==

/* eslint-env es6 */
/* eslint no-var: "error" */
/* eslint indent: ['error', 2] */
(function() {

   window.localStorage.removeItem("RowNumber");
   localStorage.setItem("RowNumber", 1000);
   return;
   
})();