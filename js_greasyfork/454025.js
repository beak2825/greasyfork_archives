// ==UserScript==
// @name         Autospinner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatic spinner for Kolex.gg
// @author       TheLuigiplayer
// @license      MIT
// @match        https://kolex.gg/loadout/spinner
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epics.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454025/Autospinner.user.js
// @updateURL https://update.greasyfork.org/scripts/454025/Autospinner.meta.js
// ==/UserScript==

window.onload=function(){

  setInterval(autoClick,100);

}

function autoClick(){
  if(document.getElementsByClassName("_2TAgJu2 _2bBZvRV").length > 0){
  for(var i = 0; i < document.getElementsByClassName("_2TAgJu2 _2bBZvRV").length; i++)
  {
      document.getElementsByClassName("_2TAgJu2 _2bBZvRV")[i].click();
  }
}
  if(document.getElementsByClassName("_1gLfywR").length > 0){
    for(var j = 0; j < document.getElementsByClassName("_1gLfywR").length; i++)
  {
      document.getElementsByClassName("_1gLfywR")[j].click();
  }
}
}