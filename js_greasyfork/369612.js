// ==UserScript==
// @name         Remove Ticktick upgrade button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You

// @match        https://*.ticktick.com/
// @match        https://ticktick.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369612/Remove%20Ticktick%20upgrade%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/369612/Remove%20Ticktick%20upgrade%20button.meta.js
// ==/UserScript==


function waitForElement(elementId, callBack){
  window.setTimeout(function(){
    var element = document.getElementById(elementId);
    if(element){
      callBack(elementId, element);
    }else{
      waitForElement(elementId, callBack);
    }
  },500)
}
waitForElement("left-bottom-view",function(){
    var left_bottom = document.getElementById('left-bottom-view');
    //left_bottom.parentNode.removeChild(left_bottom);
    //document.getElementById("project-list-view").style.paddingBottom = "0";
    var upgrade = document.getElementById('upgrade-button');
    upgrade.parentNode.removeChild(upgrade);

});