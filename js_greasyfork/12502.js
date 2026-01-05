// ==UserScript==
// @name        Minimal twitter
// @namespace   nah
// @include     https://twitter.com/
// @include     https://twitter.com/i/*
// @version     1.2
// @grant       none
// @description Hide everything but the timeline
// @downloadURL https://update.greasyfork.org/scripts/12502/Minimal%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/12502/Minimal%20twitter.meta.js
// ==/UserScript==

function deleteNode(node){
    if(node)
       node.parentNode.removeChild(node)
}
function deleteUnwantedStuff(){
  deleteNode(document.getElementById("empty-timeline-recommendations"));
  deleteNode(document.getElementsByClassName("WhoToFollow")[0]);
  deleteNode(document.getElementsByClassName("trends")[0]);
  deleteNode(document.getElementsByClassName("dashboard-right")[0]);
  deleteNode(document.getElementsByClassName("dashboard-left")[0]);

  document.getElementById("timeline").setAttribute("style", "float:left; position:absolute; left:50%; transform: translatex(-50%); ");
}

deleteUnwantedStuff();

setInterval(deleteUnwantedStuff, 500);