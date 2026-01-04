// ==UserScript==
// @name         Google Sheets Suppress F1 Key Preventing Help-Popup
// @namespace    https://gist.github.com/f-steff
// @version      1.1
// @description  Interception of F1 keypress on Google Sheets and replaces default behavior with nothing.
// @author       Flemming Steffensen
// @license      MIT
// @match        http://docs.google.com/spreadsheets/*
// @match        https://docs.google.com/spreadsheets/*
// @include      http://docs.google.com/spreadsheets/*
// @include      https://docs.google.com/spreadsheets/*
// @grant        none
// @homepageURL  https://gist.github.com/f-steff/83be141ea8ce81a526e1b76a8be4a9bc
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522641/Google%20Sheets%20Suppress%20F1%20Key%20Preventing%20Help-Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/522641/Google%20Sheets%20Suppress%20F1%20Key%20Preventing%20Help-Popup.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(event) {
  // For typical shortcuts
  //    Windows & Linux use the Control key == ctrlKey
  //    Mac uses the Command key == metaKey
  //    Other group keys are altKey and shiftKey
  var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
  var modifier = isMac ? event.metaKey : event.ctrlKey;

  var debug = false
  if(debug) {
    if (!( (event.code === "ControlLeft") || (event.code === "ControlRight")
        || (event.code === "MetaLeft") || (event.code === "MetaRight")
        || (event.code === "AltLeft") || (event.code === "AltRight")
        || (event.code === "ShiftLeft") || (event.code === "ShiftRight")
        )) {
      alert("Key pressed Pressed: " + event.code + " (" + event.keyCode + ") on " + (isMac ? "Mac" : "nonMac ") + (modifier ? "with" : " without") + " modifier." )
    }
  }

  // For some reason this triggers on F1, but not shift-F1, although event.code is F1 for both.
  if (event.code === "F1") {
    event.preventDefault();
  }

});
