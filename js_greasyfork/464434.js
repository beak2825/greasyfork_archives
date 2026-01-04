// ==UserScript==
// @name        *.fandom.com annoyances remover
// @namespace   Violentmonkey Scripts
// @match       https://*.fandom.com/*
// @grant       none
// @version     1.0
// @author      Starbeamrainbowlabs
// @license     Apache2
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @description 19/04/2023, 21:12:07
// @downloadURL https://update.greasyfork.org/scripts/464434/%2Afandomcom%20annoyances%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/464434/%2Afandomcom%20annoyances%20remover.meta.js
// ==/UserScript==

function find_and_hide(selector) {
	const els = document.querySelectorAll(selector);
	let i = 0;
	for(const el of els) {
		el.style.display = "none";
		i++;
	}
	return i;
}
const removals = { // Items are marked as true once we have hit it
	".marketing-notifications": false,
	"#WikiaBar": false
}

VM.observe(document.body, () => {
	for(const selector in removals) {
		if(find_and_hide(selector) > 0) removals[selector] = true;
	}

	if(typeof Object.values(removals).find(val => val === false) == "undefined") return true;
});


const style = document.createElement("style");
style.textContent = `
.global-navigation {
	filter: saturate(0);
	opacity: 0.1;
	width: 0.5em;
	overflow-y: hidden;
	transition: filter 0.25s, opacity 0.25s, width 0.25s;
}
.global-navigation:hover {
	filter: saturate(60%);
	opacity: 1;
	width: 66px; /* The default :-/ */
}

`;
document.head.appendChild(style);