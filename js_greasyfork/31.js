// ==UserScript==
// @name          Show Password onFocus
// @namespace     http://zoolcar9.lhukie.net/
// @include       *
// @description	  Show password when focus on password field
// @author        LouCypher
// @license       free
// @version 0.0.1.20140630034959
// @downloadURL https://update.greasyfork.org/scripts/31/Show%20Password%20onFocus.user.js
// @updateURL https://update.greasyfork.org/scripts/31/Show%20Password%20onFocus.meta.js
// ==/UserScript==

window.setTimeout(function() {
  var passFields = document.querySelectorAll("input[type='password']");
  if (!passFields.length) return;
  for (var i = 0; i < passFields.length; i++) {
    passFields[i].addEventListener("focus", function() {
      this.type = "text";
    }, false);
    passFields[i].addEventListener("blur", function() {
      this.type = "password";
    }, false);
  }
}, 1000)
