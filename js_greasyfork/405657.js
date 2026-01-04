// ==UserScript==
// @name          Sprawdzanie hasel
// @namespace     Check password
// @include       *
// @description	  Sprawdz czy poprawnie wpisales swoje haslo!
// @author        FejmiQ
// @license       fejmiq.license.free
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/405657/Sprawdzanie%20hasel.user.js
// @updateURL https://update.greasyfork.org/scripts/405657/Sprawdzanie%20hasel.meta.js
// ==/UserScript==

window.setTimeout(function() {
  var passFields = document.querySelectorAll("input[type='password']");
  if (!passFields.length) return;
  for (var i = 0; i < passFields.length; i++) {
    passFields[i].addEventListener("mouseover", function() {
      this.type = "uncode";
    }, false);
    passFields[i].addEventListener("mouseout", function() {
      this.type = "password";
    }, false);
  }
}, 10000)