// ==UserScript==
// @name         TW-Swap
// @license MIT
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  Skrypt zmienia kolor twojej postaci, gdy masz z kimś rotę.
// @author       robui
// @include	http://*.the-west.*/game.php*
// @include	https://*.the-west.*/game.php*
// @downloadURL https://update.greasyfork.org/scripts/432211/TW-Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/432211/TW-Swap.meta.js
// ==/UserScript==

FortBattleWindow.setSwapState = function (swapState) {
$('.battleground_thick_arrow canvas').toggleClass('swapping', swapState);
//console.log(swapState);
//console.log('jd');
if(swapState){
$('.self')[0].style.filter = "hue-rotate(050deg)";}
else{
$('.self')[0].style.filter = "hue-rotate(000deg)";
}
};
