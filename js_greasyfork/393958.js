// ==UserScript==
// @name            [youtube.com] Arrow buttons constant binding
// @name:ru         [youtube.com] Неизменные действия для клавиш стрелок
// @description     The arrow buttons don't depend on slider/seekbar focus. Left/Right - always playback, Down/Up - always sound volume.
// @description:ru  Клавиши стрелок не зависят от фокуса ползунков. Влево/Вправо - всегда перемотка, Вниз/Вверх - всегда громкость.
// @namespace       youtube.com/arrows.constant.binding
// @author          Zaytsev Artem
// @version         0.0.1.4
// @match           *://*.youtube.com/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/393958/%5Byoutubecom%5D%20Arrow%20buttons%20constant%20binding.user.js
// @updateURL https://update.greasyfork.org/scripts/393958/%5Byoutubecom%5D%20Arrow%20buttons%20constant%20binding.meta.js
// ==/UserScript==

var acb_debug = false;
var acb_logstr = "";

//Debug console logging.
function acb_log(msg) {
	if (acb_debug) {
		console.log("debug | " + msg);
	}
}

//Debug console logging.
function acb_log1(msg) {
	if (acb_debug) {
		acb_logstr = "debug | " + msg;
		//window.stdout.write(acb_logstr);
	}
}

//Debug console logging.
function acb_log2(msg) {
	if (acb_debug) {
		acb_logstr = acb_logstr + msg;
		console.log(acb_logstr);
		acb_logstr = "";
	}
}

if (acb_debug) {
	document.addEventListener('focusin', (event) => {
		acb_log("Focusin class: " + event.target.className + "; id: " + event.target.id + "; tag: " + event.target.tagName);
	});
}

//Sound volume panel.
acb_log1("Quering the .ytp-volume-panel...");
var q_vp = document.getElementsByClassName("ytp-volume-panel")[0];
if (q_vp) {
	acb_log2(" - ok.");
	q_vp.addEventListener('focus', (event) => {
		acb_log(".ytp-volume-panel tried to get focus.");
		//event.target.focusout();
		//event.target.blur();
		document.getElementsByClassName("html5-video-player")[0].focus({preventScroll:true});
	});
	window.setTimeout(function(){
		q_vp.setAttribute("tabindex", "-1");
		acb_log("Have set .ytp-volume-panel's tabindex to -1.");
	}, 3000)
} else acb_log2(" - not found.");

//Somehow the slider also wants to get the focus although it doesn't have a tabindex set.
acb_log1("Quering the .ytp-volume-slider-handle...");
var q_vsh = document.getElementsByClassName("ytp-volume-slider-handle")[0];
if (q_vsh) {
	acb_log2(" - ok.");
	q_vsh.addEventListener('focus', (event) => {
		acb_log(".ytp-volume-slider-handle tried to get focus.");
		document.getElementsByClassName("html5-video-player")[0].focus({preventScroll:true});
	});
	window.setTimeout(function(){
		q_vsh.setAttribute("tabindex", "-1");
		acb_log("Have set .ytp-volume-slider-handle's tabindex to -1.");
	}, 3000)
} else acb_log2(" - not found.");

//The player playback seekbar.
acb_log1("Quering the .ytp-progress-bar...");
var q_pb = document.getElementsByClassName("ytp-progress-bar")[0];
if (q_pb) {
	acb_log2(" - ok.");
	q_pb.addEventListener('focus', (event) => {
		acb_log(".ytp-progress-bar tried to get focus.");
		document.getElementsByClassName("html5-video-player")[0].focus({preventScroll:true});
	});
	window.setTimeout(function(){
		q_pb.setAttribute("tabindex", "-1");
		acb_log("Have set .ytp-progress-bar's tabindex to -1.");
	}, 3000)
} else acb_log2(" - not found.");
