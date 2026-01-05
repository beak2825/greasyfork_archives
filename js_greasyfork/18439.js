// ==UserScript==
// @name         MINA PPG 
// @namespace    http://fusionfalllegacy.com/
// @version      2.0
// @description  Automatically insert your badge list into your forum posts!
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18439/MINA%20PPG.user.js
// @updateURL https://update.greasyfork.org/scripts/18439/MINA%20PPG.meta.js
// ==/UserScript==

var Siggy = "[center][url=http://goo.gl/3iNPVR][img]http://i.imgur.com/MyT3Pfh.gif[/img][/url][/center]"

var isReady = false
var waitLoop

function mainFunction(button,editor){
	console.log(button.onclick)
	button.onclick = function(){
        editor.value = editor.value.replace("\n\n"+Siggy,"")+"\n\n"+Siggy
	}
}

function waitForButtons(){
	if(document.getElementsByClassName("button_submit").length==2&&document.getElementsByClassName("editor").length==1){
		isReady = true
		clearInterval(waitLoop)
		mainFunction(document.getElementsByClassName("button_submit")[0],document.getElementsByClassName("editor")[0])
	}
}

waitLoop = setInterval(waitForButtons,100)