// ==UserScript==
// @license MIT
// @name         Google Search Prank
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Prank people when they search on google. LOL. You can edit text by editing the script, finding "var TEXT", and changing the variable to anything. Have fun ;)
// @author       You
// @match        http*://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452069/Google%20Search%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/452069/Google%20Search%20Prank.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var TEXT = 'Free online games for free no download unblocked for hacking pros with school protection off #games #multiplayer #fun #free #unblocked #hacking #schoolprotectoff ';Array.prototype.slice.call(document.querySelectorAll('input[type=text],textarea')).map(function(el){el.onkeypress=function(evt){var charCode = typeof evt.which == 'number' ? evt.which : evt.keyCode;if (charCode && charCode > 31) {var start = this.selectionStart, end = this.selectionEnd;this.value = this.value.slice(0, start) + TEXT[start % TEXT.length] + this.value.slice(end);this.selectionStart = this.selectionEnd = start + 1;}return false;}});
})();