// ==UserScript==
// @name         Dice-A-Roo Autoplayer
// @namespace    Midas@Sythe
// @version      2024
// @description  Dice a fucking Roo. Fuck J03.
// @include      https://www.neopets.com/games/play_dicearoo.phtml
// @include      https://www.neopets.com/games/dicearoo.phtml
// @include      *neopets.com/games/play_dicearoo.phtml
// @include      *neopets.com/games/dicearoo.phtml
// @author       Midas
// @downloadURL https://update.greasyfork.org/scripts/405721/Dice-A-Roo%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/405721/Dice-A-Roo%20Autoplayer.meta.js
// ==/UserScript==

function findLinkContainingString(myStr) {
    var aTags = document.getElementsByTagName("input");
    var searchText = myStr;
    var found;

    for (var i = 0; i < aTags.length; i++) {
        if (aTags[i].value.search(searchText) != -1) {
            console.log("Found tag with textContent: " + aTags[i].value);
            found = aTags[i];
            break;
        }
    }
    return found;
}

setTimeout(function(){Main()}, 2000);

function Main(){
var resetear = findLinkContainingString("Lets Play!");
var play = findLinkContainingString("Play Dice-A-Roo");
var rollAgain = findLinkContainingString("Roll Again");
var pressMe = findLinkContainingString("Press Me");
if (resetear != null){
 resetear.click();
} if(play!=null){
 play.click();
}else{
if (document.body.innerHTML.search("You are now eligible to use") < 0) {
    if (rollAgain != null) {
        rollAgain.click();
    } else {
        pressMe.click();
    }
}}}