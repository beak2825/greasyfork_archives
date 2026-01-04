// ==UserScript==
// @name        JPDB Add WaniKani Info To Review
// @namespace   JPDB_Add_WaniKani_Info_To_Review
// @match       https://jpdb.io/review*
// @grant       GM_xmlhttpRequest
// @version     0.03
// @author      Flipp Fuzz
// @description 6/17/2024, 5:34:38 PM
// @run-at      document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497964/JPDB%20Add%20WaniKani%20Info%20To%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/497964/JPDB%20Add%20WaniKani%20Info%20To%20Review.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // Handling of answer is copied from https://greasyfork.org/en/scripts/459772-jpdb-auto-reveal-answer-sentence/code
  // -こう- implemented the switch from question to answer without really navigating
  // by simply replacing the content and location.href on clicking the "show answer" button
  window.onload = observeUrlChange(setup);

  // this handles refreshing the page while on the answer screen
  setup();
})();

function observeUrlChange(onChange) {
  let oldHref = document.location.href;
  const body = document.querySelector("body");
  const observer = new MutationObserver(mutations => {
	mutations.forEach(() => {
	  if (oldHref !== document.location.href) {
		oldHref = document.location.href;
		onChange();
	  }
	});
  });
  observer.observe(body, { childList: true, subtree: true });
}

function getWkItem(type, lookupString) {
  // type needs to be vocabulary or kanji
  const url = `https://www.wanikani.com/${type}/${lookupString}`;

  return new Promise(resolve => {
	GM_xmlhttpRequest({
	  method: "GET",
	  url,
	  onload: resolve
	});
  }).then(result => {
    // console.log(result);
	  if(result.status == 200) {
      const titleSpan = result.responseXML.querySelector('#turbo-body > div.site-container > div.site-content-container > div:nth-child(3) > header > h1 > span');
      if(titleSpan) {
	      return [lookupString, url, titleSpan.innerText];
      }
	    return null;
    }
  });
}

function setup() {
  if(document.querySelector('body > div.container.bugfix > div > div.review-reveal')) {
	// Figure out where to insert our new div
	const insertAfterElement = document.querySelector('body > div.container.bugfix > div > div.review-reveal > div.result.vocabulary > div > div.subsection-meanings');

	// Find out what is our vocab word
	const wordA = document.querySelector('body > div.container.bugfix > div > div.review-reveal > div.answer-box > div.plain > a');
	const word = wordA.getAttribute('href').split(/[?#]/)[0].split('/').pop();

	// Terminate if we can't find the word or location to insert
	if(!insertAfterElement || !wordA || !word) {
	  console.log(`insertAfterElement: ${insertAfterElement}`);
	  console.log(`wordA: ${wordA}`);
	  console.log(`word: ${word}`);
	  return;
	}

	const wkItemsToSearch = [
	  ['vocabulary', word]
	];

	// Find out all the Kanjis
	const KanjisA = document.querySelectorAll('body > div.container.bugfix > div > div.review-reveal > div.result.vocabulary > div > div.subsection-composed-of-kanji > div > div > div.spelling > a');
	KanjisA.forEach((kanjiA) => {
	  let localKanji = kanjiA.getAttribute('href').split(/[?#]/)[0].split('/').pop();
	  wkItemsToSearch.push(['kanji', localKanji]);
	});

	Promise.all(
	  wkItemsToSearch.map((entry) => getWkItem(entry[0], entry[1]))
	).then((results) => {
	  // console.log(results);
	  results.forEach((result) => {
		if(result) {
		  addWkItem(result[0], result[1], result[2]);
		}
	  });
	});
  }
}

function addMainDiv() {
  // Create the div if it is not present.
  // Otherwise, return the div
  const mainInnderDiv = document.querySelector('#JpdbAddWaniKaniInfoToReviewInnerDiv');
  if(mainInnderDiv)
	  return mainInnderDiv;

  // Figure out where to insert our new div
  const insertAfterElement = document.querySelector('body > div.container.bugfix > div > div.review-reveal > div.result.vocabulary > div > div.subsection-meanings');

  let subsectionWkLinkDiv = document.createElement('div');
  subsectionWkLinkDiv.setAttribute('class', 'subsection-wk-link');

  let subsectionWkLinkLabel = document.createElement('h6');
  subsectionWkLinkLabel.setAttribute('class', 'subsection-label');
  subsectionWkLinkLabel.textContent = 'WaniKani';
  subsectionWkLinkDiv.appendChild(subsectionWkLinkLabel);

  let subsectionWkLinkSubsectionDiv = document.createElement('div');
  subsectionWkLinkSubsectionDiv.setAttribute('class', 'subsection');
  subsectionWkLinkDiv.appendChild(subsectionWkLinkSubsectionDiv);
  subsectionWkLinkDiv.setAttribute("id", "JpdbAddWaniKaniInfoToReviewInnerDiv");

  insertAfterElement.insertAdjacentElement('afterend', subsectionWkLinkDiv);

  return subsectionWkLinkDiv;
}

function addWkItem(word, url, title) {
  const mainDiv = addMainDiv();
  console.log(mainDiv);

  let itemP = document.createElement('p');
  mainDiv.appendChild(itemP);

  let itemA1 = document.createElement('a');
  itemA1.textContent = `${word} ${title} `;
  itemA1.setAttribute('href', url);
  itemA1.setAttribute('target', '_blank');
  itemP.appendChild(itemA1);
}
