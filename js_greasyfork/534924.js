// ==UserScript==
//
// @name        VimKeys Navigation for WeebCentral
// @namespace   Violentmonkey Scripts
// @match       https://weebcentral.com/chapters/*
// @grant       none
// @version     0.2
// @author      Sadist
// @license     MIT
// @description hjkl navigation within WeebCentral's reader. <Alt-c> to show reader's settings. <Alt-g> to show page select dialog.
// @downloadURL https://update.greasyfork.org/scripts/534924/VimKeys%20Navigation%20for%20WeebCentral.user.js
// @updateURL https://update.greasyfork.org/scripts/534924/VimKeys%20Navigation%20for%20WeebCentral.meta.js
// ==/UserScript==

const scrollLines = 35;
const ratioExp = 2.6;
const keyList = ['g','c','h','j','k','l','f'];


function isInputActive() {
	return (document.activeElement.tagName === "INPUT");
}

function noModifierKey(event) {
	return (!((event.altKey) || (event.ctrlKey) || (event.metaKey) || (event.shiftKey)));
}

document.addEventListener("keydown", (event) => {
	if ( isInputActive() ) {
		return;
	}
	if ( !keyList.includes(event.key) ) {
		console.log('key not in list')
		return;
	}
	if ( noModifierKey(event) ) {
		switch (event.key) {
			case 'h':
				document.getElementById('nav-top').querySelector('div > button:nth-child(4)').click();
				break;
			case 'l':
				document.getElementById('nav-top').querySelector('div > button:nth-child(8)').click();
				break;
			case 'k':
				scrollByLines(-scrollLines * Math.pow(window.devicePixelRatio, ratioExp));
				break;
			case 'j':
				scrollByLines(scrollLines * Math.pow(window.devicePixelRatio, ratioExp));
				break;
		}
		return;
	}
	if ( (event.key === 'g') && (event.altKey) ) {
		document.getElementById('nav-top').querySelector('div > button:nth-child(6)').click();
		return;
	}
	if ( (event.key === 'c') && (event.altKey) ) {
		preference_modal.showModal()
		return;
	}
	if ( (event.key === 'f') && (event.ctrlKey) ) {
		event.preventDefault();
		document.getElementById('quick-search-input').focus();
		return;
	}
});
