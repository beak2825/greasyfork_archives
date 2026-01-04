// ==UserScript==
// @name       The West Green Swap
// @namespace   Violentmonkey Scripts
// @include      http*://*.the-west.*/game.php*
// @grant       none
// @version     1.0
// @author      KŁ0P0T
// @description The West Green Swap 024
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463562/The%20West%20Green%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/463562/The%20West%20Green%20Swap.meta.js
// ==/UserScript==
FortBattleWindow.setSwapState = function (swapState) {
$('.battleground_thick_arrow canvas').toggleClass('swapping', swapState);
//console.log(swapState);
//console.log('jd');
if(swapState){
$('.self')[0].style.filter = "hue-rotate(90deg)";}
else{
$('.self')[0].style.filter = "hue-rotate(0deg)";
}
};