// ==UserScript==
// @name     Trump the Liar
// @description Replaces all occurrences of the word 'Trump' inside an HTML textarea element with 'Trump the Liar'.
// @grant    none
// @include *
// @version 0.0.1.20200410142025
// @namespace https://greasyfork.org/users/500580
// @downloadURL https://update.greasyfork.org/scripts/400273/Trump%20the%20Liar.user.js
// @updateURL https://update.greasyfork.org/scripts/400273/Trump%20the%20Liar.meta.js
// ==/UserScript==
// Replaces all occurrences of the word 'Trump' inside an HTML
// textarea element with 'Trump the Liar'.
//
// Add this to a Greasemonkey script or a bookmarklet or some such.

e=document.getElementsByTagName('textarea'); for (var i = 0; i < e.length; i++) { e[i].onblur = myReplacer; e[i].onclick = myReplacer; function myReplacer() { this.value = this.value.replace(/Trump the Liar|Trump/gi, 'Trump the Liar'); }; }