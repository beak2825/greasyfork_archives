// ==UserScript==
// @name        GSX Serial fixer
// @author      Jonathan von Kelaita
// @namespace   http://localhost
// @description Removes the leading "S" from the serial in the global search field
// @include     https://gsx*.apple.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39821/GSX%20Serial%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/39821/GSX%20Serial%20fixer.meta.js
// ==/UserScript==

var mainSearch = document.getElementById("search_GSX_input");
var globalSearch = document.getElementById("global_search");

if (mainSearch !== null) {
  mainSearch.onkeypress = function(e){
    if (!e) e = window.event;
    //console.log("keypress");
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13){
      // Enter pressed
      fixSerial(mainSearch);
    }
    return submitFormWithEnter(this, e);
  };
}

if (globalSearch !== null) {
  globalSearch.onkeypress = function(e){
    if (!e) e = window.event;
    //console.log("keypress");
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13){
      // Enter pressed
      fixSerial(globalSearch);
    }
    return submitFormWithEnter(this, e);
  };
}

function fixSerial(searchField) {
  if (searchField.value[0].toUpperCase() == "S") {
    searchField.value = searchField.value.slice(1);
  }
}