// ==UserScript==
// @name         MODIFIED LIME FOR CLARA
// @namespace    http://fusionfalllegacy.com/
// @version      1.0
// @description  Automatically insert your badge list into your forum posts!
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13127/MODIFIED%20LIME%20FOR%20CLARA.user.js
// @updateURL https://update.greasyfork.org/scripts/13127/MODIFIED%20LIME%20FOR%20CLARA.meta.js
// ==/UserScript==

var Siggy = "[center][url=http://goo.gl/4ZXdm6][img]http://i.imgur.com/0f0SDy3.png[/img][/url][/center]"

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