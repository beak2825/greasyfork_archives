// ==UserScript==
// @name         Copy Musi Playlist to Clipboard
// @namespace    https://www.mattrangel.net
// @version      0.1
// @description  Copies all YouTube links to clipboard.
// @author       Matt
// @match        https://feelthemusi.com/playlist/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feelthemusi.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455001/Copy%20Musi%20Playlist%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/455001/Copy%20Musi%20Playlist%20to%20Clipboard.meta.js
// ==/UserScript==

const button = document.createElement("button");
button.innerText = "Copy YouTube Links";
button.className = "rounded_button";
button.style = "width: 100%; height: 45px";
button.addEventListener('click', () => {
	var linkString = "";
	var htmlList = document.getElementById("playlist_content").children;
	for (let i = 0; i < htmlList.length; i++) {
		linkString += htmlList[i].href;
		linkString += "\n";
	}
	navigator.clipboard.writeText(linkString);
})
document.getElementById("playlist_header").appendChild(button);