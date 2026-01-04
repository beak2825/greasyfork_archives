// ==UserScript==
// @name        Ikariam Auto Piracy
// @namespace   ikariam
// @description Automatically click capture button, though you need to input verification code from time to time. Please note the beta versions are still not functioning!
// @include      /^https?:\/\/s\d+-\w+\.ikariam\.gameforge\.com.*?$/
// @version     beta 0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439857/Ikariam%20Auto%20Piracy.user.js
// @updateURL https://update.greasyfork.org/scripts/439857/Ikariam%20Auto%20Piracy.meta.js
// ==/UserScript==

/**
 * Auto Piracy
 */
//Mod Space:
//eg.class="IMModSpace0"
//0:addPirateFortressHandlers()


/* click_captureBtn() is the function that keep clicking "Capture" button
   every 2.5 minutes.
   But if we are thrown out of the pirate fort, we need to get back into Town View,
   and then into the Pirate Fort, so we have click_townView() and click_pirateFort() too
*/

function click_captureBtn(){
var captureBtn=document.evaluate("//a[contains(@class,'button capture')]", document.body, null, 9, null).singleNodeValue;
     if ( captureBtn  ){ captureBtn.click();
window.clearInterval(int1);
setTimeout( myPause, 155000 ); // pause for 2.5 minutes and 5 sec
}
else{ delay = getRandomInt (2000, 4000); click_pirateFort(); }
} //eof

var delay = getRandomInt (4000, 9000);

function myPause(){  int1=setInterval( click_captureBtn, delay); }

var int1=setInterval( click_captureBtn, delay);

//************  calculate random delays  **************
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}