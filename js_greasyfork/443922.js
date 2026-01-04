// ==UserScript==
// @name         Spotify - Ensure Default Ctrl + Click Bebehavior
// @description  Spotify - Ensure Default Ctrl + Click Bebehavior.
// @version      0.2
// @author       to
// @namespace    https://github.com/to
// @license      MIT
//
// @run-at       document-start
//
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
// @downloadURL https://update.greasyfork.org/scripts/443922/Spotify%20-%20Ensure%20Default%20Ctrl%20%2B%20Click%20Bebehavior.user.js
// @updateURL https://update.greasyfork.org/scripts/443922/Spotify%20-%20Ensure%20Default%20Ctrl%20%2B%20Click%20Bebehavior.meta.js
// ==/UserScript==

window.addEventListener('click', (e) =>{
	if(e.ctrlKey)
		e.stopImmediatePropagation();
}, true);