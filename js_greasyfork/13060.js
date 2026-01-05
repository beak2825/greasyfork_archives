// ==UserScript==
// @name         MODIFIED LIME FOR VER
// @namespace    http://fusionfalllegacy.com/
// @version      1.0
// @description  Automatically insert your badge list into your forum posts!
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13060/MODIFIED%20LIME%20FOR%20VER.user.js
// @updateURL https://update.greasyfork.org/scripts/13060/MODIFIED%20LIME%20FOR%20VER.meta.js
// ==/UserScript==

var Siggy = "[center][url=http://goo.gl/4ZXdm6][img]http://i.imgur.com/Rqg0ly4.jpg[/img][/url][/center]"

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