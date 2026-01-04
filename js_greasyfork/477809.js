// ==UserScript==
// @name        Pull Loglevel Script
// @namespace   Violentmonkey Scripts
// @match       https://www.loglevel.com/aticgo/US/gateway_amazon_roc_new.html
// @grant       GM.setClipboard
// @grant       GM_setClipboard
// @version     1.1.1
// @author      penavari
// @license     MIT
// @description 10/19/2023, 7:42PM
// @downloadURL https://update.greasyfork.org/scripts/477809/Pull%20Loglevel%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/477809/Pull%20Loglevel%20Script.meta.js
// ==/UserScript==

$(document).ready(function() { //When document has loaded

setTimeout(function() {

//Code to run After timeout elapses
  var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button"> Click here!</button>'//'For Pete\'s sake, don\'t click me!</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.getElementsByTagName("div")[0].appendChild (zNode);
//document.body.appendChild (zNode);
  //--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

}, 2000); //Two seconds will elapse and Code will execute.

});


function ButtonClickAction (zEvent) {
  var outString = "";
  var elements = document.getElementsByClassName("sorting_2");
  var i;
  for (i = 0; i < elements.length; i++) {
    var longString = elements[i].getAttribute("onclick");
      var subStrings = longString.split("'");

      outString = outString + subStrings[1] + "|" + subStrings[3] + "|" + elements[i].innerText + "," + elements[i].nextSibling.innerText + "|" + elements[i].previousSibling.innerText + "|" + elements[i].nextSibling.nextSibling.nextSibling.nextSibling.innerText + "\n";
  }
  console.log(outString);
  GM.setClipboard(outString);

  if (outString) {
      alert("Loaded to clipboard!")
  };

   // $("#csvBtn").text("Loaded to clipboard");
}
