// ==UserScript==
// @name       	  SET Master Keys
// @author         Cristo
// @version        1.1
// @description  Adds Hot keys to Set Master Hits
// @updateurl  
// @include        *
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1668/SET%20Master%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/1668/SET%20Master%20Keys.meta.js
// ==/UserScript==

var page = document.getElementById("question-form");
page.tabIndex = "0";
page.focus();
 
document.addEventListener( "keydown", kas, false);

function kas(i) {
if ( i.keyCode == 83 ) { //S Key - Yes
    document.getElementById("yes").click();
    document.getElementById("submitButton").click();
	}    
if ( i.keyCode == 70 ) { //F Key - No
    document.getElementById("no").click();
    document.getElementById("submitButton").click(); 
	}
if ( i.keyCode == 191 ) { //? Key - Show Keys
	alert("S Key - Yes\nF Key - No"); 
	}
}