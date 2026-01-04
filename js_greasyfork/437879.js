// ==UserScript==
// @name			Always Show Top Lesson and Review buttons
// @namespace		https://www.wanikani.com
// @description		Always show the lesson and review buttons in the top bar without having to scroll below the giant buttons.
// @author			Devin Schaffer
// @version			1.0.0
// @license			GNU-3.0
// @include			/^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/437879/Always%20Show%20Top%20Lesson%20and%20Review%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/437879/Always%20Show%20Top%20Lesson%20and%20Review%20buttons.meta.js
// ==/UserScript==
 
(() => {
	const headerButtons = document.getElementsByClassName("navigation-shortcuts")[0];
    headerButtons.classList.remove("hidden");
 
	let observer = new MutationObserver((mutations, observer) => {
    	mutations.forEach(mutation => {
			if (mutation.attributeName == 'class') {
				let classList = [...mutation.target.classList];
 
				if (classList && classList.some(c => c == 'navigation-shortcuts') && classList.some(c => c == "hidden")) {
					headerButtons.classList.remove("hidden");
				}
			}
		});
	});
 
    observer.observe(document, { attributes: true, subtree:true });
})();