// ==UserScript==
// @name HoldingsScript
// @namespace https://greasyfork.org/users/17267
// @version 1.1
// @description Selects default radio button depending on the HIT.
// @author Kagura
// @include https://www.mturk.com/mturk/*
// @grant GM_log
// @require http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/12889/HoldingsScript.user.js
// @updateURL https://update.greasyfork.org/scripts/12889/HoldingsScript.meta.js
// ==/UserScript==

// Marks radio buttons.
$(":radio:even").click();

// Enter to submit the HIT.
window.onkeydown = function(event) {
if (event.keyCode === 13) {
$('input[name="/submit"]').click();
}
};