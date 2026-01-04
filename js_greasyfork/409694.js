// ==UserScript==
// @name         Black cam removal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @description  Fuck black cams
// @author       Jojo - Code extracted from CosmosisT (https://gist.github.com/CosmosisT), all credits go to him
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409694/Black%20cam%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/409694/Black%20cam%20removal.meta.js
// ==/UserScript==

function MSR() {
	console.log("msr");
	if (arguments[0]) {
		arguments[1].videolist.RemoveVideoRemote(arguments[1].handle);
	} else {
		arguments[1].mediaStream.stop();
		arguments[1].mediaStream = null;
	}
}


function MS() {
	console.log("ms");
	if (arguments[0].mediaStream !== null) {
		if (arguments[0].mediaStream.active && arguments[1].signalingState !== "closed" && typeof arguments[1].removeStream === "function" && arguments[1].removeStream(arguments[0].mediaStream)) MSR(false, arguments[0]);
	} else {
		MSR(true, arguments[0]);
	}
	if (arguments[1].signalingState !== "closed" && arguments[1].close());
}


function RTC() {
	console.log("rtc");
	if (null != arguments[0].rtc) {
		let a = arguments[0].rtc;
		arguments[0].rtc = null;
		MS(arguments[0], a);
	}
}

CTSInit();

function CTSInit() {
	console.log("CTSINIT");
	var err_out = 0;
	var scriptLoading = setInterval(function () {
		err_out++;
		if (document.querySelector("tinychat-webrtc-app")) {
			if (document.querySelector("tinychat-webrtc-app").shadowRoot) CTSRoomInject();
		} else if (document.querySelector("#welcome-wrapper")) {

		} else {
			err_out++;
		}
		if (err_out == 50) {
			clearInterval(scriptLoading);
		}
	}, 200);
}

function CTSRoomInject() {
	window.TinychatApp.BLL.MediaConnection.prototype.Close = function () {
		RTC(this);
	};
}