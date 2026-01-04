// ==UserScript==
// @name         Active Tab Arrow Display
// @namespace    ActiveTabArrowDisplay
// @description  Display an arrow on the title of the currently active tab
// @version      1.1
// @author       Kai Krause <kaikrause95@gmail.com>
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40267/Active%20Tab%20Arrow%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/40267/Active%20Tab%20Arrow%20Display.meta.js
// ==/UserScript==

var modifier = "➜";

function flashTitle() {
	setTimeout(() => {
		var title = document.title;
		title = title.replace(modifier,"");

		if (document.hasFocus() || !document.hidden) {
			document.title = modifier + " " + title;
		} else if (!document.hasFocus() && document.hidden) {
			document.title = title;
		}
	}, 500);
}

flashTitle();

window.addEventListener("focus", flashTitle, true);
window.addEventListener("blur", flashTitle, true);

var titleSel = document.querySelector('title');
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var MutationObserverConfig={
    childList: true,
    subtree: true,
    characterData: true
};
var titleObserver = new MutationObserver(function(mutations){
	flashTitle();
});
titleObserver.observe(titleSel, MutationObserverConfig);
