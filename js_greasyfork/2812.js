// ==UserScript==
// @name          Custom Google Search for Mturk 
// @description  A new window will open and search the highlighted words and saved words.
// @author         Cristo
// @version    	  3.0
// @grant           GM_getValue
// @grant           GM_setValue
// @include        *
// @copyright     2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2812/Custom%20Google%20Search%20for%20Mturk.user.js
// @updateURL https://update.greasyfork.org/scripts/2812/Custom%20Google%20Search%20for%20Mturk.meta.js
// ==/UserScript==

//Hit the + key to enter text to save. Highlight what you want to search and hit the ~ key.
//Saved words are stored until overwritten.
//Update to window type and size.
//If available screen size is less than 1/3 new window opens in a tab. 
//If over 1/3 it finds the largest side and opens new window there.

var FPK;
if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    FPK = 61;
} else {
    FPK = 187;
}

document.addEventListener("keydown", function(i) {
    if (i.keyCode == 192) {//~ Launchs Search  
        launchIt();           
    }
    if (i.keyCode == FPK) {//+ Adds terms
        var wordBank = prompt("Please enter search term to add");
        GM_setValue("search term", wordBank);
    }}, false);
function launchIt() {
    var lighted = window.getSelection().toString();
    var newWidth;
    var newLeft;
    if (window.screenX > (screen.width - (window.screenX + window.outerWidth))) {
        newWidth = window.screenX;						
        newLeft = "0";									
    } else {											
        newWidth = screen.width - (window.screenX + window.outerWidth);		
        newLeft = window.screenX + window.outerWidth;
    }
    if (newWidth < screen.width/3) {
        window.open("http://www.google.com/search?q="+ lighted + " " + GM_getValue("search term"));
    } else {
        var windowTo  = 'width=' + newWidth;
        windowTo += ', height=' + screen.height;
        windowTo += ', top=' + "0"; 
        windowTo += ', left=' + newLeft;
        window.open("http://www.google.com/search?q="+ lighted + " " + GM_getValue("search term"), "name", windowTo);  
    }
} 