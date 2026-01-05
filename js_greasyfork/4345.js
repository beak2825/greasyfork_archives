// ==UserScript==
// @name         Version Testing
// @version      0.8001
// @description  Could be any script that is still being tested.
// @author       Cristo
// @include     *
// @grant       GM_getValue
// @grant       GM_setValue
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/4345/Version%20Testing.user.js
// @updateURL https://update.greasyfork.org/scripts/4345/Version%20Testing.meta.js
// ==/UserScript==


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