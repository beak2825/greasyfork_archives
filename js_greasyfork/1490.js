// ==UserScript==
// @name       CS User Manuals Hot Key
// @author     Cristo
// @version    0.1
// @description Mturk Hit the ? key for key list
// @include       *
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/1490/CS%20User%20Manuals%20Hot%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/1490/CS%20User%20Manuals%20Hot%20Key.meta.js
// ==/UserScript==

var cI = 0;
var page = document.getElementById("target"); 
var table = page.getElementsByClassName("w");
var radio = table[cI].getElementsByTagName("input");
var sub = document.getElementById("submitButton"); 

page.tabIndex = 0;
page.focus();
table[cI].scrollIntoView(false);

function moveGrove(){

    cI++
    radio = table[cI].getElementsByTagName("input");
    table[cI].scrollIntoView(false);    
}

document.addEventListener( "keydown", kas, false);

function kas(i) {
if ( i.keyCode == 83 ) { // yes
    radio[0].checked=true;
    moveGrove();
}
if ( i.keyCode == 70 ) { // no
    radio[1].checked=true;
    moveGrove();
}
if ( i.keyCode == 69 ) { // submit
	sub.click();
}
if ( i.keyCode== 191 ) { //? Key - Shows Keys
    alert("S Key - Yes\nF Key - No\nE Key - Submit"); 
    }
}