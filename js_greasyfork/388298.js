// ==UserScript==
// @name        Speedrun.com MiddleClick Fix
// @description Fix middleclick on speedrun.com
// @namespace   Judgy
// @include     http*://www.speedrun.com/*
// @version     2
// @grant       GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/388298/Speedruncom%20MiddleClick%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/388298/Speedruncom%20MiddleClick%20Fix.meta.js
// ==/UserScript==

document.addEventListener("mousedown", function(e) {
  if(e.which == 2 || e.ctrlKey == true){
    var checkedNode = checkParentsClass(e.target);
    if(checkedNode){
      //window.open("http://www.speedrun.com" + checkedNode.attributes["data-target"].value, "_blank");
      GM_openInTab("http://www.speedrun.com" + checkedNode.attributes["data-target"].value, {active:false});
      e.preventDefault();
      e.stopPropagation();
    }
  }
});
function checkParentsClass(node){
  if(!node) return false;
  if(node.tagName === "A") return false;
  if(new RegExp("linked").test(node.className)){
    return node;
  }
  return checkParentsClass(node.parentNode);
}