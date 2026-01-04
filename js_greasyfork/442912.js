// ==UserScript==
// @name         Normal G-mail Inbox
// @version      1.1
// @description  Change that useless side-bar back to a normal list.
// @match        https://mail.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @namespace    Change G-mail Inbox back to normal automatically
// @downloadURL https://update.greasyfork.org/scripts/442912/Normal%20G-mail%20Inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/442912/Normal%20G-mail%20Inbox.meta.js
// ==/UserScript==
const checkElements = setInterval(function () {
	if (document.getElementById('loading').style  !== null) {
		document.getElementsByClassName('no')[1].children[0].className = 'nh oy8Mbf nn aeN bbZ bym';
        clearInterval(checkElements);
	}
}, 500);