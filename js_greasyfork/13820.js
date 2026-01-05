// ==UserScript==
// @name       	 SET Master Account Keybindings
// @author       bottles (based on Cristo's script)
// @version      1.2
// @icon         http://i.imgur.com/lpKj5Kr.png
// @description  Adds Hot keys to Set Master Account Hits
// @updateurl  
// @include        *
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/13820/SET%20Master%20Account%20Keybindings.user.js
// @updateURL https://update.greasyfork.org/scripts/13820/SET%20Master%20Account%20Keybindings.meta.js
// ==/UserScript==

// To do: make instructions text bigger!

var page = document.getElementById("question-form");
page.tabIndex = "0";
//page.focus() // Not needed if working from queue w/o tabbing
 
document.addEventListener( "keydown", kas, false);

function kas(i) {
if ( i.keyCode == 97 ) { // numpad1 - Yes
    document.getElementById("yes").click();
    document.getElementById("submitButton").click();
	}    
if ( i.keyCode == 98 ) { // numpad2 - No
    document.getElementById("no").click();
    document.getElementById("submitButton").click(); 
	}
if ( i.keyCode == 96 ) { // numpad0 - Show Keys
	alert("numpad1 - Yes \ numpad2 - No"); 
	}
}