// ==UserScript==
// @name         vid.me Playback Speed
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds playback speed options to vid.me in the quality menu (gear icon).
// @author       Eklei
// @match        https://vid.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25785/vidme%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/25785/vidme%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var userscriptWaitForVideo = setInterval(function(){
		//console.log('Userscript waiting...');
		var testElement = document.getElementById('video_player_html5_api');
		if (!testElement || !testElement.playbackRate || !testElement.currentTime)
			return;
		clearInterval(userscriptWaitForVideo);
		userscriptInit();
	}, 200);
	function userscriptInit() {
		function createMenuItem(text, speed) {
			var r = document.createElement('li');
			r.setAttribute('class', 'vjs-menu-item');
			r.setAttribute('tabindex', '-1');
			r.setAttribute('role', 'menuitem');
			r.setAttribute('aria-live', 'polite');
			r.setAttribute("onclick", "document.getElementById('video_player_html5_api').playbackRate = " + speed);
			r.textContent = text;
			return r;
		}
		var menuContent = document.querySelector('.vjs-menu-button[title="Quality"] .vjs-menu-content');
		menuContent.style = 'max-height: none;';
		menuContent.appendChild(createMenuItem('25%', 0.25));
		menuContent.appendChild(createMenuItem('50%', 0.50));
		menuContent.appendChild(createMenuItem('75%', 0.75));
		menuContent.appendChild(createMenuItem('100%', 1.00));
		menuContent.appendChild(createMenuItem('125%', 1.25));
		menuContent.appendChild(createMenuItem('150%', 1.50));
		menuContent.appendChild(createMenuItem('200%', 2.00));
	}
})();