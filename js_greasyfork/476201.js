// ==UserScript==
// @name         WNBA on ESPN
// @namespace    espn
// @version      1.2
// @description  Removes WNBA articles
// @license      MIT
// @author       kynak
// @include      https://www.espn.com/*
// @downloadURL https://update.greasyfork.org/scripts/476201/WNBA%20on%20ESPN.user.js
// @updateURL https://update.greasyfork.org/scripts/476201/WNBA%20on%20ESPN.meta.js
// ==/UserScript==
const rmWnba = () => {
	Array.from(document.getElementsByTagName('section')).forEach(section => {
	    const text = section.textContent.toLowerCase();
		if (text.includes('wnba') || text.includes('women\'s')) {
			const classNames = section.className.split(' ');
			if (classNames.includes('contentItem__content')) {
				if (!classNames.includes('contentItem__miniCards')) { section.remove(); }
				if (classNames.includes('miniCard')) { section.remove(); }
			}
			else if (classNames.includes('contentItem')) { section.remove(); }
		}
	});
	Array.from(document.getElementsByTagName('article')).forEach(a => {
        const text = a.textContent.toLowerCase();
		if (text.includes('wnba') || text.includes('women\'s')) {
			a.remove();
		}
	});
};
    document.addEventListener("DOMNodeInserted", rmWnba);

