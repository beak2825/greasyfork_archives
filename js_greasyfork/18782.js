// ==UserScript==
// @name         'Choose Subject of Homework Question'
// @version      1.0
// @description  Selection hotkeys and auto-submit for Lili Dworkin's HIT 'Choose Subject of Homework Question'
// @author       TheFrostlixen
// @include      https://www.mturkcontent.com/dynamic/*
// @match        https://www.mturk.com/mturk/accept?*
// @match        https://www.mturk.com/mturk/previewandaccept?*
// @grant        none
// @namespace    https://greasyfork.org/en/users/34060
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/18782/%27Choose%20Subject%20of%20Homework%20Question%27.user.js
// @updateURL https://update.greasyfork.org/scripts/18782/%27Choose%20Subject%20of%20Homework%20Question%27.meta.js
// ==/UserScript==
var submit = true;
var $j = jQuery.noConflict(true);

// verify HIT
if ( $j('strong:homework question')) {
    // This HIT is a match for the script, so get it set up
    document.addEventListener( "keydown", key, false);
    $j("input[name='Q1Answer']").eq(5).click();
    $j("input[id='submitButton']").focus();
}

// Wait for keypress
function key(i) {
    if (i.keyCode >= 97 && i.keyCode <= 103) { // numpad 1-7
        $j("input[name='Q1Answer']").eq(i.keyCode - 97).click();
        if (submit) {
            $j("input[id='submitButton']").click();
        }
    }
    if (i.keyCode == 13) { // enter
        console.log( $j("input[id='submitButton']") );
        $j("input[id='submitButton']").click();
    }
}
