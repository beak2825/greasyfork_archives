// ==UserScript==
// @name        chopcoin coords+timer
// @namespace   namespace
// @description change title to show coordinates, and a 30 second timer after space has been pressed
// @include     http://chopcoin.io/
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13557/chopcoin%20coords%2Btimer.user.js
// @updateURL https://update.greasyfork.org/scripts/13557/chopcoin%20coords%2Btimer.meta.js
// ==/UserScript==

var timer = 0;
var xCoord = 0;
var yCoord = 0;


setTitle();
window.addEventListener("keydown", dealWithKeyboard, false);

function setTitle() {
  getCoords();
  document.title = xCoord + " : " + yCoord + " | " + timer;
  if (timer != 0) timer--;
  setTimeout(function(){ setTitle(); }, 1000);
}

function getCoords() {
  var rawNodes = chopcoin.game.nodes['all'];
	for(var i=0; i<rawNodes.length; i++) {
		if (rawNodes[i]._name) {
			xCoord = Math.round(rawNodes[i].x / 1000);
      yCoord = Math.round(rawNodes[i].y / 1000);
      //console.log(xCoord + " x " + yCoord);
		}
  }
}

function dealWithKeyboard(e) {
  if (e.keyCode == "32") timer = 30;
}