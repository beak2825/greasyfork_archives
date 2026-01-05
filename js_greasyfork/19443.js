// ==UserScript==
// @name         Add video player to Slack
// @namespace    http://tech.velmont.net
// @version      0.1
// @description  Adds a HTML5 video player when it senses a video file.
// @author       Odin Hørthe Omdal
// @match        http://*.slack.com/*
// @match        https://*.slack.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19443/Add%20video%20player%20to%20Slack.user.js
// @updateURL https://update.greasyfork.org/scripts/19443/Add%20video%20player%20to%20Slack.meta.js
// ==/UserScript==

function addVideoTags() {
	let files = Array.from(document.querySelectorAll('.file_container > a:not(.checked-for-video)'))
	files.forEach(anchorElement => {
		/* Only check once */
		anchorElement.classList.add('checked-for-video');
		if (!anchorElement.href.match(/(webm|ogv|ogg|mp4)$/i)) {
			/* Probably not a video file */
			return;
		}
		if (anchorElement.parentElement.querySelector('video')) {
			/* Already have video added */
			return;
		}
		
		let v = document.createElement('video');
		v.src = anchorElement.href;
		v.controls = true;
		v.style.maxWidth='100%';
		v.style.maxHeight = '100%';
		
		anchorElement.parentElement.appendChild(v);
	});
}																 

$(function() {
	$('#msgs_div').on('DOMSubtreeModified propertychange', addVideoTags);
});