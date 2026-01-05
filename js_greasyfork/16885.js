// ==UserScript==
// @name         Cosmic Sans
// @namespace    https://greasyfork.org/en/users/28185-bit
// @version      1.0.2
// @description  Takes your favourite pages and changes the font to something not so pleasent.
// @author       Bit
// @include      *//*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16885/Cosmic%20Sans.user.js
// @updateURL https://update.greasyfork.org/scripts/16885/Cosmic%20Sans.meta.js
// ==/UserScript==
(function() {
  var all = document.all;
  for (var i=0; i<all.length; i++) {
      all[i].style.fontFamily = "'Comic Sans MS'";
  }
})(); void 0;