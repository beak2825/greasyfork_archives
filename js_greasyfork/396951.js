// ==UserScript==
// @name         Re-enable Spellcheck on Duolingo
// @namespace    mailto:gooseserbus@gmail.com
// @version      0.4
// @description  This re-enables spellcheck on textareas on Duolingo where it's disabled
// @author       GooseSerbus
// @match        http*://www.duolingo.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396951/Re-enable%20Spellcheck%20on%20Duolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/396951/Re-enable%20Spellcheck%20on%20Duolingo.meta.js
// ==/UserScript==

function loop() {
    enableSpellCheck();
	setTimeout(function() {
		loop();
	}, 1000);
}

function enableSpellCheck() {
    var snapshot = document.evaluate('//@spellcheck', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < snapshot.snapshotLength; ++i) {
        snapshot.snapshotItem(i).nodeValue = 'true';
    }
}

loop();
