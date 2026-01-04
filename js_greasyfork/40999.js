// ==UserScript==
// @name         Wanikani: Move context sentence to top
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Moves the context sentence to the top when you open the full info of a vocabulary item.
// @author       Kumirei
// @include      *wanikani.com/review/session
// @include      *preview.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40999/Wanikani%3A%20Move%20context%20sentence%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/40999/Wanikani%3A%20Move%20context%20sentence%20to%20top.meta.js
// ==/UserScript==

(function() {
	let style = document.createElement("style");
	style.innerText = "#item-info-col2 { display: inline-grid; row-gap: 40px; }" +
		"#item-info #item-info-col2 section, #item-info-col2 section *:last-child { margin-bottom: 0; }" +
		"#item-info-context-sentences { order: -1; }";
	document.head.appendChild(style);
})();
