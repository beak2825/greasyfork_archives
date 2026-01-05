// ==UserScript==
// @name         SEN Signature Inserter
// @namespace    http://your.homepage/
// @version      1.0
// @description  Inserts the SEN signature into every post you make!
// @author       SFOH
// @match        http://interact.modulatornetwork.com/FFL/index.php?action=post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11482/SEN%20Signature%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/11482/SEN%20Signature%20Inserter.meta.js
// ==/UserScript==

var isReady = false
var waitLoop

function mainFunction(button,editor){
	console.log(button.onclick)
	button.onclick = function(){
		editor.value = editor.value.replace("\n\nLet's join Science and Everything Nice! [url=http://goo.gl/qOmIqB]Click me to join![/url]","")+"\n\nLet's join Science and Everything Nice! [url=http://goo.gl/qOmIqB]Click me to join![/url]"
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