// ==UserScript==
// @name         Edgenuity Video Skipper
// @namespace    https://greasyfork.org/en/scripts/399211-edgenuity-tweaker
// @version      4.23
// @description  Vive la révolution!
// @author       (☭ ͜ʖ ☭)
// @match        *://*.core.learn.edgenuity.com/*
// @require 	 http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/399211/Edgenuity%20Video%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/399211/Edgenuity%20Video%20Skipper.meta.js
// ==/UserScript==

let $ = window.$;
$( document ).ready(function() {
	//Setting up button & styling
	window.overlay = document.createElement("div")
	window.overlay.style.width = "100vw"
	window.overlay.style.height = "100vh"
	window.overlay.style.zIndex = "1"
	window.overlay.style.position = "fixed"
	window.overlay.style.visibility = "hidden"
	window.overlay.id = "overlay"
	document.body.prepend(window.overlay)
	makeBtn("skipBtn", "Skip Video", "F90");
	makeBtn("showBtn", "Show text box answer (Works on some FRQs)", "F90");
	makeBtn("exitAudioBtn", "Play exit audio", "F90");
	makeBtn("fixBtn", "I have an error", "F90");
	//Set our event listener for the buttons
	document.getElementById("skipBtn").addEventListener("click", function () {
		skipVid();
	})
	document.getElementById("showBtn").addEventListener("click", function () {
		showRightColumn();
	})
	document.getElementById("fixBtn").addEventListener("click", function () {
		alert("One video has failed to skip, make sure all videos have been watched all the way through and then continue as normal")
		location.reload();
		return false;
	})
	document.getElementById("exitAudioBtn").addEventListener("click", function () {
		if(!window.frames[0].API.Frame.playExitAudio()){alert("No exit audio found for this question.")}
	})

	loop();
})

function makeBtn(name, text, hex){
	try{
		console.log("making "+name);
		window.tempBtn = document.createElement("button");
		window.tempBtn.innerText = text
		window.tempBtn.id = name
		window.tempBtn.style.border = "1px solid #"+hex
		window.tempBtn.style.boxShadow = "inset 0 0 5px rgba(0, 0, 0, 0.6)"
		window.tempBtn.style.backgroundColor = "rgb(39, 39, 39)"
		window.tempBtn.style.color = "#"+hex
		window.tempBtn.style.borderRadius = "3px"
		window.tempBtn.style.marginLeft = "1%"
		window.tempBtn.style.zIndex = "2"
		document.getElementsByClassName("mainfoot")[0].appendChild(window.tempBtn)
	} catch (e){}
}
function loop(){

	try {window.frames[0].document.getElementById("invis-o-div").remove()} catch (e) {}

	setTimeout(loop, 1000)
}

function skipVid(){
	if (document.getElementById("activity-title").innerText != "Assignment") { // Make sure were not on an assignment
		if (frames[0].document.getElementById("home_video_container").parentNode.style.opacity == 1) {//Make sure video is playing/visible
			if(window.frames[0].API.FrameChain.framesStatus.length > window.frames[0].API.FrameChain.currentFrame){
				console.log("skippin");
				try {window.frames[0].API.FrameChain.framesStatus[window.frames[0].API.FrameChain.currentFrame - 1] = "complete"} catch(e) {}
				try {document.getElementsByClassName("footnav goRight")[0].click()} catch (e) {}
				try {window.frames[0].API.Video.videoTimer = 9} catch (e) {}
				try {window.frames[0].API.FrameChain.nextFrame()} catch (e) {}
			} else{
				if(confirm("Skipping this video will almost certainly cause an error, would you like to be a dumb fuck and proceed?")){
					try {window.frames[0].API.FrameChain.framesStatus[window.frames[0].API.FrameChain.currentFrame - 1] = "complete"} catch(e) {}
					try {document.getElementsByClassName("footnav goRight")[0].click()} catch (e) {}
					try {window.frames[0].API.FrameChain.nextFrame()} catch (e) {}
				}
			}
		}
	}

}

function showRightColumn(){
	try {window.frames[0].frames[0].document.getElementsByClassName("right-column")[0].children[0].style.display = "block"} catch (e) {}
}
function vidSpeed(x) {
	try{
		document.getElementsByClassName("video-js")[0].playbackRate = x;
	} catch(e) {
		console.log(e);
	}
}