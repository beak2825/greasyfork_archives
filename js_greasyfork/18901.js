// ==UserScript==
// @name         PINK TEXT 
// @namespace    http://fusionfalllegacy.com/
// @version      1.0
// @description  Automatically changes text to pink in your forum posts!
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post;topic=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18901/PINK%20TEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/18901/PINK%20TEXT.meta.js
// ==/UserScript==

var Siggy = "[center][color=deeppink][font=georgia]  [/font][/color][/center]"

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