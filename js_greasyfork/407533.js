// ==UserScript==
// @name     Use Meetic mobile also in landscape
// @namespace StephenP
// @author   StephenP
// @description This script removes the overlay suggesting portrait orientation.
// @version  1
// @grant    none
// @include    https://www.meetic.tld/m/*
// @downloadURL https://update.greasyfork.org/scripts/407533/Use%20Meetic%20mobile%20also%20in%20landscape.user.js
// @updateURL https://update.greasyfork.org/scripts/407533/Use%20Meetic%20mobile%20also%20in%20landscape.meta.js
// ==/UserScript==
var interval=setInterval(removeBlocker,1000);
function removeBlocker(){
  var blocker=document.getElementsByClassName("landscape-blocker");
  if(blocker.length>0){
   blocker[0].parentNode.removeChild(blocker[0]);
   clearInterval(interval);
  }
}