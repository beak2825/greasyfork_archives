// ==UserScript==
// @name		Youtube: remove sidebar recommendations 2018 edition
// @description	removes youtube recommendations in sidebar and end of video
// @author		antoine-dh
// @include		*.youtube.com/watch*
// @include		*.youtube.*/watch*
// @version		1.1
// @namespace https://greasyfork.org/users/214944
// @downloadURL https://update.greasyfork.org/scripts/372506/Youtube%3A%20remove%20sidebar%20recommendations%202018%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/372506/Youtube%3A%20remove%20sidebar%20recommendations%202018%20edition.meta.js
// ==/UserScript==

// TODO: add more locales
const searchStrings = [
	'Recommandée pour vous',	// fr-FR
	'Recommandé pour vous',		// fr-CA
	'Recommended for you',		// en-US/UK
	'Empfohlenes Video',		// de-DE
	'Recomendado para ti',		// es-ES/US
	'Recomendado para si',		// pt-PT
	'Recomendado',			// pt-BR
	'Consigliato per te',		// it-IT
];

function removeSideElement(element) {
	if (element.getElementsByClassName('style-scope ytd-badge-supported-renderer').length !== 0) { // if it as the "New" badge
		element.remove();
		return;
	}
	for (let i of element.getElementsByClassName('style-scope ytd-video-meta-block')) {
		for (let str of searchStrings) {
			if (i.textContent.includes(str)) {
				element.remove();
				return;
			}
		}
	}
}

function removeShit() {
	for (let i of document.getElementsByClassName('ytp-endscreen-content')) { // removes all suggestions at the video end
		i.remove();
	}
	for (let i of document.getElementsByClassName('ytp-upnext ytp-suggestion-set')) { // removes next autoplay video
		i.remove();
	}
	for (let i of document.getElementsByTagName('ytd-compact-video-renderer')) { // removes sidebar recommendations
		removeSideElement(i);
	}
}

// from https://stackoverflow.com/a/14570614
const observeDOM = (function () {
	const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

	return function (obj, callback) {
		if (!obj || !obj.nodeType === true) {
			return;
		}
		if (MutationObserver) {
			const obs = new MutationObserver(function (mutations) {
				if (mutations[0].addedNodes.length)
					callback(mutations[0]);
			});
			obs.observe(obj, {childList: true, subtree: true});
		} else if (window.addEventListener) {
			obj.addEventListener('DOMNodeInserted', callback, false);
		}
	}
})();

observeDOM(document, () => {
	removeShit();
});
