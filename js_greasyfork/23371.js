// ==UserScript==
// @name           Japanese Cloze-Test Opener
// @description    Open Japanese cloze tests from any text selected on a website
// @namespace      https://greasyfork.org/en/users/3656-kaiko
// @version        1.6
// @grant          GM_registerMenuCommand
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/23371/Japanese%20Cloze-Test%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/23371/Japanese%20Cloze-Test%20Opener.meta.js
// ==/UserScript==
GM_registerMenuCommand("Open a Jp Cloze Test", getSelectionText);

function getSelectionText() {
	//Get our selected text
	var text = "";
	if (window.getSelection) {
		text = window.getSelection().toString();
	} else if (document.selection && document.selection.type != "Control") {
		text = document.selection.createRange().text;
	}

	// Open the cloze tester website
	window.open("https://krausekai.github.io/japanese-tools/cloze-tester/index.html?" + text);
}