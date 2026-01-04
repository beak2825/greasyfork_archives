// ==UserScript==
// @name     _YOUR_SCRIPT_NAME
// @description Wow this is it and you cand ot it
// @match    nitrotype.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_setClipboard
// @version 0.0.1.20200608002509
// @namespace https://greasyfork.org/users/522000
// @downloadURL https://update.greasyfork.org/scripts/404895/_YOUR_SCRIPT_NAME.user.js
// @updateURL https://update.greasyfork.org/scripts/404895/_YOUR_SCRIPT_NAME.meta.js
// ==/UserScript==

document.addEventListener ( "keydown", function (i) {
    var selectLink = $('a').eq (8); // The link by index
    var targetLink = selectLink.text ().trim (); // The link text

    if (i.keyCode === 106  &&  i.shiftKey) // Shift+Num*
    {
        GM_setClipboard (targetLink); // Copy to clipboard
    }
} );