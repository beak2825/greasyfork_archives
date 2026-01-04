// ==UserScript==
// @name         Itch "Open in App" button
// @namespace    http://itch.io/
// @version      1.0
// @description  Add "Open in App" button to most of itch.io pages
// @author       Dimava
// @match        https://*.itch.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itch.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455993/Itch%20%22Open%20in%20App%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/455993/Itch%20%22Open%20in%20App%22%20button.meta.js
// ==/UserScript==

(function() {
    let path = document.querySelector('meta[name="itch:path"]')?.content
    if (!path) return;
    let li = document.createElement('li');
    li.innerHTML = `
		<a class="action_btn"
				href="itchio://${path}">
			<span class="icon icon-download"></span>
			<span>
				Open in App
			</span>
		</a>
	`;
    document.querySelector('#user_tools')?.append(li);
})();