// ==UserScript==
// @name         WN navigation
// @namespace    https://greasyfork.org/en/scripts/430252-wn-navigation
// @version      1.4
// @description  navigate sites that don't support left/right arrow keys
// @author       Matt W
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430252/WN%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/430252/WN%20navigation.meta.js
// ==/UserScript==

(function () {
	"use strict";
	const checkElement = (query, fuzzy, matchText, regex) => {
		let elements = [...document.querySelectorAll(query)];
		let link = null;
		if (fuzzy) {
			link = elements.find((linkElement) => {
                return regex.test(linkElement.textContent)
            });
		} else if (elements) {
			elements.forEach((element) => {
				let linkElements = element.getElementsByTagName("a");
				if (linkElements) link = linkElements[0];
			});
		}
		return link;
	};
	const getActionButton = (matchText, regex) => {
		let link = checkElement("a", true, matchText, regex);
		if (link) return link;
		link = checkElement(`[id^='${matchText}']`, false, matchText);
		if (link) return link;
		link = checkElement(`[class^='${matchText}']`, false, matchText);
		if (link) return link;
	};
    const fallbackMatch = (matchOptions) => {
		let elements = [...document.querySelectorAll("a")];
		let link = null;
        link = elements.find((linkElement) => {
            const textContent = linkElement.textContent.toLowerCase();
            for (let i = 0; i < matchOptions.length; i++) {
                const option = matchOptions[i];
                if (textContent.includes(option)) return true
            }
        });
        return link
    }
    const nextRegex = /Next ?(Chap(ter)?)? ?(>>?)?(->)?(→)?/gi
	let nextButton = getActionButton("next", nextRegex);
    if(!nextButton) {
        const matchOptions = ["→"]
        nextButton = fallbackMatch(matchOptions);
    }
    const prevRegex = /(←)?(<-)?(<<?)? ?Prev(ious)? ?(Chap(ter)?)?/gi
	let prevButton = getActionButton("previous", prevRegex) || getActionButton("prev", prevRegex);
    if(!prevButton) {
        const matchOptions = ["←"]
        prevButton = fallbackMatch(matchOptions);
    }
	const navFunction = (keyEvent) => {
		switch (keyEvent.key) {
			case "ArrowRight":
				if (nextButton) nextButton.click();
				break;
			case "ArrowLeft":
				if (prevButton) prevButton.click();
				break;
		}
	};
	document.addEventListener("keyup", navFunction);
})();
