// ==UserScript==
// @name        V2L - Describe images with simple sentences
// @namespace   https://greasyfork.org/en/users/14332-turkenator
// @description Starts with the textarea focused, and hit enter to advance.
// @include     https://www.cs.cmu.edu/~tinghaoh/sip-coco-ui*
// @version     0.1
// @grant       GM_addStyle
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11745/V2L%20-%20Describe%20images%20with%20simple%20sentences.user.js
// @updateURL https://update.greasyfork.org/scripts/11745/V2L%20-%20Describe%20images%20with%20simple%20sentences.meta.js
// ==/UserScript==

// Uncomment this line to change the size of the pictures if you want.
//GM_addStyle( "#canvas {width: 480px !important; height: auto !important;}" );

// Focuses the textarea automatically.
window.onload = function() {
    $( "#description" ).focus();
}

// Disables newline when enter is hit in the textarea
// and clicks next on hitting enter instead.
$( document ).ready( function() {
    $( "#description" ).keydown( function(e) {
        if ( (e.keyCode === 13) ) { // Return or Enter
            e.preventDefault();
            $( "input[id='next']" ).click();
        }
    });
});