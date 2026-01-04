// ==UserScript==
// @name         Meneame.net - Edición cotilla
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Muestra contenido oculto, de usuarios ignorados y con strikes.
// @author       ᵒᶜʰᵒᶜᵉʳᵒˢ
// @match        *://*.meneame.net/*
// @run-at       document-end
// @icon         https://www.meneame.net/favicon.ico
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526110/Meneamenet%20-%20Edici%C3%B3n%20cotilla.user.js
// @updateURL https://update.greasyfork.org/scripts/526110/Meneamenet%20-%20Edici%C3%B3n%20cotilla.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const script = document.createElement('script');
    script.textContent = `
	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function showHidden() {
		await delay(2000);
		const classesToRemove = ["phantom", "ignored", "strike"];
		const parentClassToRemove = "collapsed";
		document.querySelectorAll('*').forEach(element => {
			if (classesToRemove.some(cls => element.classList.contains(cls))) {
				element.classList.remove(...classesToRemove);
				let parent = element.parentElement;
				while (parent) {
					if (parent.classList.contains(parentClassToRemove)) {
						parent.classList.remove(parentClassToRemove);
						break;
					}
					parent = parent.parentElement;
				}
			}
		});
	};

	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === 1 && node.matches('.comment-answers')) {
					showHidden();
				}
			});
		});
	});
	observer.observe(document.body, { childList: true, subtree: true });
	showHidden();
    `;
    document.documentElement.appendChild(script);
})();