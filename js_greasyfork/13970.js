// ==UserScript==
// @name        LM Autofocus
// @author      LM_DEV
// @namespace   LM_Autofocus
// @include     *linkomanija.net/*
// @description  LM set autofocus
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13970/LM%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/13970/LM%20Autofocus.meta.js
// ==/UserScript==

window.onload = function() {
  var mainSearch = document.getElementsByName("search")[1];
  var sideSearch = document.getElementById("search");
  if (mainSearch)      // Is current page browse.php? If true, this field takes priority.
    mainSearch.focus();
  else if (sideSearch) // Just in case.
    sideSearch.focus();
};