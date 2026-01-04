// ==UserScript==
// @name          MetaFilter embiggen favorite plus minus sign
// @namespace     http://userstyles.org
// @description	  Makes the + and − signs to add and remove favorites on MetaFilter.com larger for easier access on mobile.
// @author        Tehhund
// @match         *://*.metafilter.com/*
// @version       6
// @downloadURL https://update.greasyfork.org/scripts/388452/MetaFilter%20embiggen%20favorite%20plus%20minus%20sign.user.js
// @updateURL https://update.greasyfork.org/scripts/388452/MetaFilter%20embiggen%20favorite%20plus%20minus%20sign.meta.js
// ==/UserScript==

const styleTag = document.createElement('style');
styleTag.textContent = '.embiggenPlusMinus {font-size: 3rem;}';
document.head.appendChild(styleTag);

function embiggenAllPlusMinus() { // Hit every plus or minus on initial load.
	let allPlusMinusSpans = document.querySelectorAll("a:link[id^='plusminus'");
	for (let span of allPlusMinusSpans) {
		embiggenOne(span);
	}
}

function embiggenOne(tag) {
  /*let compStyles = window.getComputedStyle(tag);
  let compFontSize = parseFloat(compStyles.getPropertyValue('font-size'));
  if (compFontSize < 25) tag.style.fontSize = '250%';*/
  tag.classList.add('embiggenPlusMinus'); // Only adds a class if it doesn't already exist, so repeat mutations won't cause it to be added over and over.
}

function handleMutationsList(mutationsList, observer) { // Handle mutation events, since adding or removing a favorite removes the old span and creates a new one.
	 for (let mutation of mutationsList) { // Loop over all mutations for this event.
		 let allLinksInMutatedNode = Array.from(mutation.target.querySelectorAll("a:link[id^='plusminus'")); // Get all anchor elements aka links in the mutated node.
		 for (let currentNode of allLinksInMutatedNode) { embiggenOne(currentNode); } // Call embiggenOne on every link element in the mutated node.
	 }
}

// run once when the page is loaded.
embiggenAllPlusMinus();

// After the first embiggening, observe the main content div for changes such as new comments or adding a Favorite, and run embiggenOne() on the changed tag.
// This was a big drag on performance when combined with other scripts (e.g., sorting by Favorites) so removing it for now. It's only needed when new comments are added to the thread, and that's easily handled by refreshing the page anyway.
// const mutationObserver = new MutationObserver(handleMutationsList);
// mutationObserver.observe(document.getElementById('posts'), { attributes: true, childList: true, subtree: true })
