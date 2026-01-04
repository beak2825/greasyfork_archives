// ==UserScript==
// @name           Mysterious Symol Hole Forever
// @namespace      Neoscripts
// @description    Plays Mysterious Symol Hole
// @author         themagicteeth
// @version        2.0.1
// @include        *://www.neopets.com/medieval/symolhole.phtml
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/432904/Mysterious%20Symol%20Hole%20Forever.user.js
// @updateURL https://update.greasyfork.org/scripts/432904/Mysterious%20Symol%20Hole%20Forever.meta.js
// ==/UserScript==

// We set the timeout for this to 10 seconds, which seems to be the perfect amount of time
setTimeout(function(){
  // Instead of click the button when we are done diving, we navigate to the start page again
  // I have read that it may not work to get the avatar if you click the button
  window.location = "https://www.neopets.com/medieval/symolhole.phtml";
}, 10000);

// ENTER THE SYMOL HOLE YOU BRAVE LITTLE DUDE!
document.getElementById("enterhole").click()

