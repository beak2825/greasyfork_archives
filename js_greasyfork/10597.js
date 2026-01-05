// ==UserScript==
// @name MTurk Return HIT with Hotkey
// @version 0.1
// @description Return HIT with CTRL-R
// @include https://www.mturk.com/mturk/accept*
// @include https://www.mturk.com/mturk/continue*
// @include https://www.mturk.com/mturk/preview*
// @include https://www.mturk.com/mturk/return*
// @include https://www.mturk.com/mturk/submit
// @require http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/10597/MTurk%20Return%20HIT%20with%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/10597/MTurk%20Return%20HIT%20with%20Hotkey.meta.js
// ==/UserScript==

document.addEventListener("keydown",function(i) {
        if (i.keyCode == 82 ) { 
     i.preventDefault();
$('a[href^="/mturk/return?"]')[0].click();

   }
   });
