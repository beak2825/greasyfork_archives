// ==UserScript==
// @name          Scroll to Trello list
// @description   Automatically scroll to the specified Trello-board list
// @author        Vassyutovich Ilya (https://github.com/VassyutovichIlya)
// @homepageURL   https://github.com/VassyutovichIlya/user-scripts
// @license       MIT
// @version       0.1.0
// @grant         none
// @include       https://trello.com/*
// @namespace https://greasyfork.org/users/629857
// @downloadURL https://update.greasyfork.org/scripts/405880/Scroll%20to%20Trello%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/405880/Scroll%20to%20Trello%20list.meta.js
// ==/UserScript==

const listNameParameterName = "scrollToList";
const scriptExecutionTimeoutSeconds = 10;

const uriParams = new URLSearchParams(window.location.search);
const listName = uriParams.get(listNameParameterName);

if (listName == null) {
	return;
}

let executionTimedOut = false;
const executionTimeoutTimer = setTimeout(
	() => executionTimedOut = true,
	scriptExecutionTimeoutSeconds * 1000
);

const mutator = async (_, observer) => {
	if (executionTimedOut) {
		clearTimeout(executionTimeoutTimer);
		observer.disconnect();
		return;
	}

	const trelloRootElement = document.getElementById("trello-root");
	if (trelloRootElement == null) {
		return;
	}

	const trelloContentElement = document.getElementById("content");
	if (trelloContentElement == null) {
		return;
	}

	const trelloBoardElement = document.getElementById("board");
	if (trelloBoardElement == null) {
		return;
	}

	const listsTextAreas = Array.from(
		document
			.querySelectorAll("div .list-header textarea"));
	const foundList = listsTextAreas.find(textArea => textArea.value === listName);
	if (foundList === undefined) {
		return;
	}

	observer.disconnect();

	const scrollOptions = { "inline": "center" };
	foundList.scrollIntoView(scrollOptions);
}

const mutationObserver = new MutationObserver(mutator);
mutationObserver.observe(document, { childList: true, subtree: true });
