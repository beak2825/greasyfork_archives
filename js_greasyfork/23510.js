// ==UserScript==
// @name        Change CSGOLounge font color
// @namespace   https://greasyfork.org/en/users/28684
// @description The font color on the new trade page is white, which clashes 
// @description with the white background, so you can use this script to fix 
// @description that issue.
// @include     https://csgolounge.com/addtrade
// @version     1
// @grant       just use the code it's really not even worth money ^^
// @downloadURL https://update.greasyfork.org/scripts/23510/Change%20CSGOLounge%20font%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/23510/Change%20CSGOLounge%20font%20color.meta.js
// ==/UserScript==

$(document).ready(function(){
  
  /* this is really the only piece of code you need, you can change the color 
  ** here if you want a different color
  */
   document.getElementById("notes").style.color = "black";

  /* you can just change the color in the last part (so change #D7D7D7 to a 
  ** color by just writing the color), which will keep the gradient effect, or 
  ** just write a color instead, which will make it a solid color. In any case,
  ** you'll have to remove the // in the beginning of the line for it to
  ** take effect
  */
    //document.getElementById("notes").style.background = "radial-gradient(ellipse at 0 0, #BBB 0%, #D7D7D7 50%)";
});