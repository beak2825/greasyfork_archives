// ==UserScript==
// @name         Reddit Hide All Posts & Reload Hotkey
// @namespace    redditposthideandreload_kk
// @version      1.5
// @description  Hide all posts & reload page on Ctrl+Shift+R; cancel with Escape
// @match        https://*.reddit.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388082/Reddit%20Hide%20All%20Posts%20%20Reload%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/388082/Reddit%20Hide%20All%20Posts%20%20Reload%20Hotkey.meta.js
// ==/UserScript==

let oldhidebtns;
let newhidebtns;

function getbtns() {
	oldhidebtns = document.getElementsByTagName("a");
	newhidebtns = document.getElementsByClassName("icon-hide");
}

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
let waitTime = 500;
let canReload = true;

async function doHide() {
	getbtns();

	try {
		for (let i = 0; i < oldhidebtns.length; i++) {
			if (!canReload) return;

			if (oldhidebtns[i].innerText.toLowerCase() === "hide") {
				oldhidebtns[i].click();
				await wait(waitTime);
			}
		}

		let didNewBtnRun = false;

		for (let i = 1; i < newhidebtns.length; i++) {
			if (!canReload) return;
			i--;

			newhidebtns[i].click();
			didNewBtnRun = true;
			await wait(waitTime);
		}

		if (didNewBtnRun) return doHide();

		await wait(waitTime + 1000);

		if (!canReload) return;

		location.reload();
	}
	catch (e) {
		console.warn(e);
		doHide();
	}
}

document.addEventListener("keydown", (e) => {
	if (e.ctrlKey && e.shiftKey && e.keyCode == 82) {
		e.preventDefault();
		canReload = true;
		doHide();
	}
	if (e.key.toLowerCase() === "escape" || e.code.toLowerCase() === "escape") {
		e.preventDefault();
		canReload = false;
	}
}, false);

