// ==UserScript==
// @name          	Big Timestamp
// @description     Adds a timestamp on top of video sites like Amazon Video, YouTube, and more.
//
// @author			Transiscodev
// @namespace       http://github.com/transiscodev
// @copyright       Copyright (C) 2022
//
// @include         http://*.example.com/*
// @include         https://www.amazon.com/gp/video/*
// @include         https://www.youtube.com/watch*
// @include         https://play.hbomax.com/*
// @include         https://vimeo.com/*
// @license         CC BY-NC 3.0
// @require         https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @version         1.0
// @run-at			document-end
// @downloadURL https://update.greasyfork.org/scripts/454277/Big%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/454277/Big%20Timestamp.meta.js
// ==/UserScript==

/**
 * SCRIPT DESCRIPTION.
 *
 * @see http://wiki.greasespot.net/API_reference
 * @see http://wiki.greasespot.net/Metadata_Block
 */

function init(){
window.notice = document.createElement("div");
notice.innerHTML = "00:00:00";
notice.id = "text-notice";
notice.style = "text-shadow: 0px 0px 10px black, 0px 0px 10px black, 0px 0px 10px black; color: yellow; background-color: transparent; font-family: Tahoma, sans-serif; position: absolute; z-index: 99999; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;";
notice.style.fontSize = Math.floor(screen.width/20) + "px";
if (document.readyState !== "complete") {
	window.addEventListener("load", afterDOMLoaded);
} else {
	afterDOMLoaded();
}
}

function afterDOMLoaded() {
	getService()[3]().arrive(getService()[2], {onlyOnce: true, existing: true}, function(){
		updateEngine();
		document.body.prepend(notice);
		dragElement(notice);
		getService()[0]();
		console.log("running X times")
	});
}
function toggleFullScreen() {
	if (
		!document.fullscreenElement && // alternative standard method
		!document.mozFullScreenElement &&
		!document.webkitFullscreenElement
	) {
		// current working methods
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(
				Element.ALLOW_KEYBOARD_INPUT
			);
		}
	} else {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	}
}
function dragElement(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0;
	if (document.getElementById(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elmnt.style.top = elmnt.offsetTop - pos2 + "px";
		elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
function updateEngine() {
	const target = getService()[1]()
	target.addEventListener("timeupdate", function () {
		var hours = ('0' + parseInt(target.currentTime / (60 * 60), 10)).slice(-2);
		var minutes = ('0' + parseInt(target.currentTime / 60, 10)).slice(-2);
		var seconds = ('0' + Math.floor(target.currentTime % 60)).slice(-2);
		notice.innerHTML = `${hours}:${minutes}:${seconds}`;
	});
}
function recreateNode(el, withChildren) {
	if (withChildren) {
	  el.parentNode.replaceChild(el.cloneNode(true), el);
	}
	else {
	  var newEl = el.cloneNode(false);
	  while (el.hasChildNodes()) newEl.appendChild(el.firstChild);
	  el.parentNode.replaceChild(newEl, el);
	}
  }

function getService(){
	if (window.location.toString().includes("amazon.com/gp/video/") ){
		var videoElementString = "#dv-web-player > div > div:nth-child(1) > div > div > div.scalingVideoContainer > div.scalingVideoContainerBottom > div > video:nth-child(1)"
		return [
			function(){
				document.body.arrive(".atvwebplayersdk-fullscreen-button", {onceOnly: true, existing: true}, function(){
						recreateNode(document.getElementsByClassName("atvwebplayersdk-fullscreen-button")[0], true)
						var tracker = document.getElementsByClassName("atvwebplayersdk-fullscreen-button")[0]
						tracker.addEventListener("click", function(){toggleFullScreen()})
					});
			},
			function(){return document.querySelector(videoElementString)},
			videoElementString,
			function(){ return document.body}];
	}
	else if (window.location.toString().includes("youtube.com/watch") ){
		return [
			function(){},
			function(){return document.getElementsByClassName("video-stream html5-main-video")[0]},
			".video-stream,.html5-main-video",
			function(){ return document.body}];
	}
	else if (window.location.toString().includes("play.hbomax.com") ){
		return [
			function(){},
			function(){return document.querySelector("#rn-video > video")},
			"#rn-video > video",
			function(){ return document.body}];
	}
	else if (window.location.toString().includes("vimeo.com") ){
		return [
			function(){},
			function(){return document.querySelector("div.vp-video > div > video")},
			"div.vp-video > div > video",
			function(){ return document.body}];
	}
}


init()