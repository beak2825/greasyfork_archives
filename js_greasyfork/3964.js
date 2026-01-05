// ==UserScript==
// @name        Template for buttons
// @namespace   localhost
// @author      zingy
// @description test
// @include     *
// @version     3.14
// @downloadURL https://update.greasyfork.org/scripts/3964/Template%20for%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/3964/Template%20for%20buttons.meta.js
// ==/UserScript==

var NAME = document.getElementById("INSERTFORMIDHERE");
ocmp.tabIndex = "0";
ocmp.focus();

document.addEventListener( "keydown", NAME1, false);

function NAME1(i) {
if ( i.keyCode == 65 ) {
         document.getElementById("NAME").click();
	}    
}