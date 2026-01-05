// ==UserScript==
// @name         SIDs
// @version      0.1
// @description  Covert SID to HEX in Kingofsat.fr
// @author       ShadyOrr
// @icon         http://upload.dinhosting.fr/j/a/r/d41d8cd98f00b204e9800998ecf8427e.png
// @include      http://*.kingofsat.fr/*.php*
// @namespace http://your.homepage/
// @downloadURL https://update.greasyfork.org/scripts/11579/SIDs.user.js
// @updateURL https://update.greasyfork.org/scripts/11579/SIDs.meta.js
// ==/UserScript==

var tds = document.getElementsByTagName("TD");
var priceEls = document.getElementsByClassName("s");
var j = 0 ; 

function decimalToHexString(number)
{
    if (number < 0)
    {
    	number = 0xFFFFFFFF + number + 1;
    }

    return number.toString(16).toUpperCase();
}


for (var i = 0; i<tds.length; i++) {
	
	var price = priceEls[i].innerText;
	
	var n = decimalToHexString(parseFloat(price)).toString();
	
	if (n.length != 4) {
    for (var g = 1; 4 - n.length; g++) {
    n = '0' + n ;
     }
     }
    document.getElementsByClassName("s")[i].innerHTML = n;
}