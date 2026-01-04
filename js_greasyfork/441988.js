// ==UserScript==
// @name         audio video playback tools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        .*
// @include      *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=web.dev
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441988/audio%20video%20playback%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/441988/audio%20video%20playback%20tools.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const keys = {
		ratePlus: '}',
		rateMinus: '{',
		timePlus: ')',
		timeMinus: '(',
		playPause: '|',
		volumeUp: '+',
		volumeDown: '-',
		muteUnmute: '*',
		to0: 'S',
	}
	document.onkeyup = e => {
		const el = document.querySelector("audio") || document.querySelector("video");
		if (!el) return
		switch (e.key) {
			case keys.rateMinus:
				el.playbackRate = (el.playbackRate - 0.2).toFixed(1)
				break
			case keys.ratePlus:
				el.playbackRate = (el.playbackRate + 0.2).toFixed(1)
				break
			case keys.timeMinus:
				el.currentTime -= 5
				break
			case keys.timePlus:
				el.currentTime += 5
				break
			case keys.playPause:
				el.paused ? el.play() : el.pause();
				break;
			case keys.to0:
				el.currentTime = 0;
				break;
			case keys.volumeDown:
				el.volume = el.volume - 0.1 > 0 ? (el.volume - 0.1).toFixed(1) : 0
				break
			case keys.volumeUp:
				el.volume = el.volume + 0.1 < 1 ? (el.volume + 0.1).toFixed(1) : 1
				break
			case keys.muteUnmute:
				el.muted = !el.muted
				break
		}
		if ([keys.ratePlus, keys.rateMinus].indexOf(e.key) > -1) {
			const toast = document.createElement("div");
			toast.setAttribute("style", "z-index:99999;position:fixed;top:0px;font-size:12px;height:20px;width:100vw;background:rgba(255,255,255,0.4);text-align:center;color:white;");
			toast.setAttribute("class", "__toaster__")
			toast.innerText = `playback speed: ${el.playbackRate}`
			document.querySelectorAll(".__toaster__").forEach(e => e.remove())
			document.body.appendChild(toast)
			setTimeout(_ => toast.remove(), 800)
		}
	}
	// Your code here...
})();

