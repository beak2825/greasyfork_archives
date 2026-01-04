// ==UserScript==
// @name                Coomer.su prevent auto-download video when click
// @namespace           https://greasyfork.org/users/821661
// @version             1.0
// @description         prevent auto-download video when click in coomer.su
// @author              hdyzen
// @match               https://coomer.su/*
// @grant               none
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/542836/Coomersu%20prevent%20auto-download%20video%20when%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/542836/Coomersu%20prevent%20auto-download%20video%20when%20click.meta.js
// ==/UserScript==

document.addEventListener("click", (event) => {
	if (!event.target.matches("a.post__attachment-link[href*='.mp4']")) return;
	event.preventDefault();

	const videoWindow = window.open("");
	videoWindow.document.documentElement.innerHTML = `
	<style>
		body {
			margin:0;
			background:#000;
		}
		video {
			width:100%;
			height:100%;
		}
	</style>
	<video controls src="${event.target.href}"></video>`;
});