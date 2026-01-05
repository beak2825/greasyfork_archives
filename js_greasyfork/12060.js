// ==UserScript==
// @name         Tech's BugBusters Siggy
// @namespace    http://your.homepage/
// @version      1.0
// @description  aw yea
// @author       SFOH
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12060/Tech%27s%20BugBusters%20Siggy.user.js
// @updateURL https://update.greasyfork.org/scripts/12060/Tech%27s%20BugBusters%20Siggy.meta.js
// ==/UserScript==

// HERE'S WHAT YOU NEED TO CHANGE
var ID = 11614
// YOU NEED TO CHANGE THE 2140 TO YOUR USER ID ON FUSIONFALL LEGACY'S FORUMS

var isReady = false
var waitLoop

function mainFunction(button,editor){
	console.log(button.onclick)
	button.onclick = function(){
        editor.value = editor.value.replace("\n\n[center][url=http://goo.gl/xvFW00][img]http://l0l-limewire.comoj.com/Siggy/Signature.php?userid="+ID+"[/img][/url][/center]","")+"\n\n[center][url=http://goo.gl/xvFW00][img]http://l0l-limewire.comoj.com/Siggy/Signature.php?userid="+ID+"[/img][/url][/center]"
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