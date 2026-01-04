// ==UserScript==
// @name         Skip intro
// @description  Move forward in a video
// @namespace    dt
// @version      1.7
// @run-at       document-idle
// @match      https://filemoon.sx/*
// @match      https://v-o-e-unblock.com/*
// @match      https://adblockstreamtape.*
// @match      https://streamta.pe/*
// @match      https://streamtape.com/*
// @match      https://www.myvi.tv/*
// @match      https://videovard.sx/*
// @match      https://sp.rmbl.ws/*
// @match      https://www.yourupload.com/*
// @match      https://sbfull.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @grant        GM_addStyle
// @author       drhouse
// @icon         https://voiranime.com/wp-content/uploads/fbrfg/favicon-32x32.png
// @match      https://fonts.googleapis.com/icon?family=Material+Icons
// @downloadURL https://update.greasyfork.org/scripts/440099/Skip%20intro.user.js
// @updateURL https://update.greasyfork.org/scripts/440099/Skip%20intro.meta.js
// ==/UserScript==

// Utils

function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

// Assets

function insertAsset(){
	let icon = document.createElement("link");
	icon.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
	icon.rel = "stylesheet";
	document.head.append(icon);
}


// Main Script

let button = document.createElement('span');
button.className = 'material-icons'
button.innerHTML = '<span class="material-icons">fast_forward</span>';
button.onclick = skipIntro;

function skipIntro()
{
	document.querySelector('video').currentTime += 90;
}

window.addEventListener('keydown', function(e){
	if(e.key === "Control")
	{
		skipIntro();
	}
});

function insertButton(){

    let video = document.querySelector("video")
	video.onpause = (event) => {
		button.style.visibility = "visible";
	};
	video.onplay = (event) => {
		button.style.visibility = "hidden";
	};
	video.onfullscreenchange = event => {
	   console.log("video en full screen");
	};
	button.style.position = "absolute";
	button.style.top = "70%";
	button.style.left = "5%";
	button.style.background = "#00884d";
	button.style.padding = "13px";
    button.style.zIndex = "10000000";
	console.log(video.parentNode);
	video.parentNode.append(button);
}

let observer = new MutationObserver(function(mutations) {
	// check at least two H1 exist using the extremely fast getElementsByTagName
	// which is faster than enumerating all the added nodes in mutations
	if (document.querySelector('video')) {
		insertAsset();
		insertButton();
		observer.disconnect();
	}
})

observer.observe(document, {childList: true, subtree: true});