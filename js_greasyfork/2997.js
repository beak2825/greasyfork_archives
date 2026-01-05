// ==UserScript==
// @name       Crowdsource PDF
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @include       *
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/2997/Crowdsource%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/2997/Crowdsource%20PDF.meta.js
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
}
