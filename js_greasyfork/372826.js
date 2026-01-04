// ==UserScript==
// @name        Gmail - Classic Two Row and less bold
// @description This script tries to undo some of the most annoying changes in GMail's new version that cannot be changed in the settings.
// @include     https://mail.google.com/mail/*
// @version 0.0.2
// @namespace
// @namespace https://greasyfork.org/users/217251
// @downloadURL https://update.greasyfork.org/scripts/372826/Gmail%20-%20Classic%20Two%20Row%20and%20less%20bold.user.js
// @updateURL https://update.greasyfork.org/scripts/372826/Gmail%20-%20Classic%20Two%20Row%20and%20less%20bold.meta.js
// ==/UserScript==

(function() {
  window.setInterval(function() {

    // Less bold
    Array.from(document.getElementsByClassName("zF")).forEach(function(element, index, array) {
      element.style.fontWeight = '500';
    });
    Array.from(document.getElementsByClassName("bqe")).forEach(function(element, index, array) {
      element.style.fontWeight = '500';
    });
    Array.from(document.getElementsByClassName("bq3")).forEach(function(element, index, array) {
      element.style.fontWeight = '500';
    });

    // Two row layout
    Array.from(document.getElementsByClassName("xY")).forEach(function(element, index, array) {
      element.style.minHeight = '50px';
    });
    Array.from(document.getElementsByClassName("xY")).forEach(function(element, index, array) {
      element.style.verticalAlign = 'middle';
    });
    Array.from(document.getElementsByClassName("y6")).forEach(function(element, index, array) {
      element.style.display = 'table';
    });
    Array.from(document.getElementsByClassName("xT")).forEach(function(element, index, array) {
      element.style.display = 'table';
    });
    Array.from(document.getElementsByClassName("Zt")).forEach(function(element, index, array) {
      element.style.display = 'none';
    });

    // Less space between sender and subject
    Array.from(document.getElementsByClassName("yX")).forEach(function(element, index, array) {
      element.style.paddingRight = '0px';
    });

    // Hide the bar on the right
    Array.from(document.getElementsByClassName("bAw")).forEach(function(element, index, array) {
      element.style.display = 'none';
    });
  }, 500);
})();