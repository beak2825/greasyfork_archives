// ==UserScript==
// @name         Stephen A Smith B Gone
// @namespace    espn
// @version      1.3
// @description  Because life would be better without being yelled at
// @author       kynak
// @include      https://www.espn.com/*
// @downloadURL https://update.greasyfork.org/scripts/412243/Stephen%20A%20Smith%20B%20Gone.user.js
// @updateURL https://update.greasyfork.org/scripts/412243/Stephen%20A%20Smith%20B%20Gone.meta.js
// ==/UserScript==
const removeStephen = () => {
	Array.from(document.getElementsByTagName('section')).forEach(section => {
		if (section.textContent.includes('Stephen A')) {
			const classNames = section.className.split(' ');
			if (classNames.includes('contentItem__content')) {
				if (!classNames.includes('contentItem__miniCards')) { section.remove(); }
				if (classNames.includes('miniCard')) { section.remove(); }
			}
		}
	});
};
document.addEventListener("DOMNodeInserted", removeStephen);