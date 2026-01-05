// ==UserScript==
// @name SimpleHays
// @namespace https://greasyfork.org/users/17267
// @version 2.0
// @description Selects default checkbox depending on the HIT.
// @author Kagura
// @include https://www.cocottributes.org/*
// @grant GM_log
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/13433/SimpleHays.user.js
// @updateURL https://update.greasyfork.org/scripts/13433/SimpleHays.meta.js
// ==/UserScript==


// Marks even checkboxes.
$(":checkbox:even").click();

// Enter to submit the HIT.
window.onkeydown = function(event) {
if (event.keyCode === 13) {
$("#commit").click();
}
};
