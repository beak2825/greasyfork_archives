// ==UserScript==
// @name        Prefer generic fonts
// @description When a font-family attribute includes a generic font, use it
// @version     1
// @license     MIT
// @match       *://*/*
// @grant       none
// @namespace   https://greasyfork.org/en/users/1141549-mwk-soul
// @downloadURL https://update.greasyfork.org/scripts/472199/Prefer%20generic%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/472199/Prefer%20generic%20fonts.meta.js
// ==/UserScript==

const fonts = ['monospace', 'sans-serif', 'serif', 'cursive', 'fantasy']

function splitAndMatchFirst(fontFamilies) {
	var fontList = fontFamilies.split(',');
	return [fontList.length > 0 && fonts.includes(fontList[0].trim()), fontList];
}

function setFontFamily(node) {
	if (node.nodeType != Node.ELEMENT_NODE)
		return;

	if (splitAndMatchFirst(node.style.fontFamily)[0])
		return;

	const [matches, fontList] = splitAndMatchFirst(window.getComputedStyle(node).fontFamily);

	if (matches || fontList.length == 0)
		return;

	for (let i = 1; i < fontList.length; i++) {
		trimmed = fontList[i].trim();

		if (fonts.includes(trimmed)) {
			node.style.fontFamily = trimmed;
			return;
		}
	}
}

function recursiveSetFontFamily(node) {
	setFontFamily(node);

	for (let i = 0; i < node.childNodes.length; i++)
		recursiveSetFontFamily(node.childNodes[i]);
}

function mutationHandler(mutationList, observer) {
	for (let i = 0; i < mutationList.length; i++) {
		if (mutationList[i].type != 'childList')
			continue;

		for (let j = 0; j < mutationList[i].addedNodes.length; j++)
			recursiveSetFontFamily(mutationList[i].addedNodes[j]);
	}
}

var observer = new MutationObserver(mutationHandler);
var container = document.documentElement || document.body;
observer.observe(container, { subtree: true, childList: true });
recursiveSetFontFamily(container);
