// ==UserScript==
// @name           Turn on spellcheck
// @namespace      google.com
// @description    Turns spellcheck on in CrowdSurf transcription.
// @include        *
// @version 0.0.1.20181109172158
// @downloadURL https://update.greasyfork.org/scripts/374182/Turn%20on%20spellcheck.user.js
// @updateURL https://update.greasyfork.org/scripts/374182/Turn%20on%20spellcheck.meta.js
// ==/UserScript==



var found = document.getElementById("plaintext_edit");
found.setAttribute("spellcheck","true");
