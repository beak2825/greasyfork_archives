// ==UserScript==
// @name         AutoSlots SMMO
// @namespace    https://simple-mmo.com/
// @version      0.0.5
// @description  Plays slots for you
// @author       Breadsauce
// @match        https://simple-mmo.com/gamecentre/slots*
// @match        http://simple-mmo.com/gamecentre/slots*
// @downloadURL https://update.greasyfork.org/scripts/390679/AutoSlots%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/390679/AutoSlots%20SMMO.meta.js
// ==/UserScript==

window.onload=function(){

  setInterval(autoClick,1);

}
function autoClick(){
  if(document.getElementsByClassName("mdl-button__ripple-container").length>0){
  document.getElementsByClassName("mdl-button__ripple-container")[0].click();
}
}