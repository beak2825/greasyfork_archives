// ==UserScript==
// @name       Prospect Smarter
// @author     Cristo
// @version    1
// @description  Adds Hot keys to Prospect Smarter Hits
// @include       https://www.mturkcontent.com/dynamic*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1525/Prospect%20Smarter.user.js
// @updateURL https://update.greasyfork.org/scripts/1525/Prospect%20Smarter.meta.js
// ==/UserScript==

var page = document.getElementById("mturk_form");
var opt = page.getElementsByTagName("option");
page.tabIndex = "0";
page.focus();

document.addEventListener( "keydown", kas, false);

function kas(i) {
if ( i.keyCode == 65 ) { //A Key - Good
     opt[1].selected = true;   
	}    
if ( i.keyCode == 83 ) { //S Key - Bad
     opt[2].selected = true; 
	}
if ( i.keyCode == 68 ) { //D Key - Cannot Determine
	opt[3].selected = true;
	}
if ( i.keyCode == 70 ) { //F Key - Submit
	document.getElementById("submitButton").click();
	}
if ( i.keyCode== 191 ) { //? Key - Shows Keys
    alert("A Key - Good\nS Key - Bad\nD Key - Cannot Determine\nF Key - Submit"); 
    }
}