// ==UserScript==
// @name        add_line
// @namespace   1
// @include     http://www.eador.com/B2/posting.php?mode=quote*
// @include     http://eador.com/B2/posting.php?mode=quote*
// @version     1
// @grant       none
// @description Add line and focus textarea
// @downloadURL https://update.greasyfork.org/scripts/33981/add_line.user.js
// @updateURL https://update.greasyfork.org/scripts/33981/add_line.meta.js
// ==/UserScript==

document.getElementsByName("message")[0].innerHTML = document.getElementsByName("message")[0].innerHTML + "\n";

document.getElementsByName("message")[0].focus();