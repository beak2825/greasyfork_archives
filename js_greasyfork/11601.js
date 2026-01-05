// ==UserScript==
// @name         godpeople player popup patch for mobile
// @namespace    http://your.homepage/
// @version      0.13
// @description  enter something useful
// @author       You
// @match        http://music.godpeople.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/11601/godpeople%20player%20popup%20patch%20for%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/11601/godpeople%20player%20popup%20patch%20for%20mobile.meta.js
// ==/UserScript==

(function(){
	document.addEventListener('DOMContentLoaded', function(){
		var btnOpenPlayer = document.createElement('button');
		btnOpenPlayer.setAttribute('type', 'button');
		btnOpenPlayer.innerText = 'Open Player';
		btnOpenPlayer.style.cssText = 'position:fixed;top:0;right:0;z-index:99999;padding:1em;border-radius:2px;font-family:sans-serif;';
		btnOpenPlayer.addEventListener('click', function(){
			window.open('/gpplayer2013/', 'GPPlayer');
		});

		document.body.appendChild(btnOpenPlayer);
	});
})();