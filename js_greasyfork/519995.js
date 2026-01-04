// ==UserScript==
// @name          OpenAI ChatGPT Block and Hide Popups
// @namespace     http://userstyles.org
// @description   OpenAI ChatGPT Blocks and Hides Popups
// @author        636597
// @homepage      https://creatitees.info
// @include       *://chatgpt.com/*
// @match         *://chatgpt.com/*
// @run-at        document-start
// @version       0.2
// @downloadURL https://update.greasyfork.org/scripts/519995/OpenAI%20ChatGPT%20Block%20and%20Hide%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/519995/OpenAI%20ChatGPT%20Block%20and%20Hide%20Popups.meta.js
// ==/UserScript==
( function() {
	const hide_popup = () => {
		document.querySelectorAll( "div.right-4" ).forEach( el => {
			el.style.display = "none";
			el.remove();
		});
	};
	hide_popup();
	const observer = new MutationObserver( mutations => {
		mutations.forEach( mutation => {
			mutation.addedNodes.forEach( node => {
				if (node.nodeType === 1 && node.classList.contains( "right-4" ) ) {
					node.style.display = 'none';
					node.remove();
				}
			});
		});
	});
	observer.observe( document.body , { childList: true , subtree: true } );
})();