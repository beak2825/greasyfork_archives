// ==UserScript==
// @name         EasyWarnings
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  click on a user to add /warn username username to the chat box
// @author       Unregistered, HPrivakos
// @match        https://chopcoin.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20043/EasyWarnings.user.js
// @updateURL https://update.greasyfork.org/scripts/20043/EasyWarnings.meta.js
// ==/UserScript==


document.getElementById('canvas').ondblclick = function() {
    var clickedX = chopcoin.variables.relative_mouse_x;
    var clickedY = chopcoin.variables.relative_mouse_y;
    var delta = 1000; // initial value for distance away from click to look for player
    var playerName = "";
	for (var i=0; i<chopcoin.game.nodes['all'].length; i++) {
		if(chopcoin.game.nodes['all'][i].name_display) {
		    deltaX =  Math.abs(chopcoin.game.nodes['all'][i].ox - clickedX); // positive change from mouse position x
		    deltaY =  Math.abs(chopcoin.game.nodes['all'][i].oy - clickedY); // positive change from mouse position y
		    deltaTemp = deltaX+deltaY;
		    if (deltaTemp < delta) {
		        delta = deltaTemp;
		        playerName = chopcoin.game.nodes['all'][i].name_display._text;
		    }
		}
	}
	console.log(playerName);
    var chatbox = document.getElementsByName('chat')[0];
	if(playerName != "") chatbox.value = "/warn " + playerName + " -" + playerName + "- ";
    else chatbox.value = '';
};