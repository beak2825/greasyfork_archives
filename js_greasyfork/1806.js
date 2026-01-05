// ==UserScript==
// @author      ZSMTurker
// @name        ZSMTurker's Larger Radio Buttons and Checkboxes
// @namespace   https://greasyfork.org/users/2291
// @description Makes radio buttons and checkboxes larger. Applies to every webpage
//              so turn it off if you don't need it, it can slow things down.
// @match       http://*/*
// @match       https://*/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/1806/ZSMTurker%27s%20Larger%20Radio%20Buttons%20and%20Checkboxes.user.js
// @updateURL https://update.greasyfork.org/scripts/1806/ZSMTurker%27s%20Larger%20Radio%20Buttons%20and%20Checkboxes.meta.js
// ==/UserScript==

/* Function that injects CSS rules */
function injectStyles( rule ) {
    var div = $( '<div />', {
        html: '&shy;<style>' + rule + '</style>'
    } ).appendTo( 'body' );
}

/*Individual calls to add styles */
injectStyles( 'input[type=radio] { width: 1.5em; height: 1.5em;}' );
injectStyles( 'input[type=checkbox] { width: 1.5em; height: 1.5em;}' );