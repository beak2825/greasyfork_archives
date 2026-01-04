// ==UserScript==
// @name         Amazon stars rating
// @namespace    V@no
// @author       V@no
// @description  Restore stars rating on Amazon product pages
// @include      https://amazon.*/*
// @include      https://*.amazon.*/*
// @license      MIT
// @version      1.0.2
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473381/Amazon%20stars%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/473381/Amazon%20stars%20rating.meta.js
// ==/UserScript==

//tab = 4 spaces

(() =>
{
"use strict";

const processNode = node =>
{
	if (!node.querySelectorAll) return;

	const nlSingleStar = node.querySelectorAll(".puis-review-star-single");
	for (let i = 0; i < nlSingleStar.length; i++)
	{
		const el = nlSingleStar[i];
		const ratingFull = el.textContent; //4.6 out of 5 stars
		const rating = ratingFull.split("."); //["4", "6 out of 5 stars"]
		rating[1] = rating[1][0]; //discard everything after first digit
		if (rating[1] > 6 && rating[0] < 4)
			rating[0] = ++rating[0];

		const stars = rating[0] + (rating[1] > 2 && rating[1] < 8 ? "-5" : "");
		el.classList.remove("puis-review-star-single", "a-star-small-5");
		el.classList.add("a-star-small-" + stars);
		//rating count
		const elRatingCount = el.closest(".a-section").querySelector(".a-size-base.s-underline-text");
		if (!elRatingCount.textContent)
		{
			const elRatingCountBox = elRatingCount.closest("[aria-label]");
			elRatingCount.textContent = elRatingCountBox.ariaLabel;
			const elFiveStarPercent = elRatingCountBox.nextSibling.firstChild.firstChild;
			elFiveStarPercent.nodeValue = "(" + elFiveStarPercent.nodeValue + ")";
		}
	}
};

//support for dynamically added content
new MutationObserver(mutations =>
{
	for (let i = 0; i < mutations.length; i++)
	{
		const addedNodes = mutations[i].addedNodes;
		if (!addedNodes) continue;

		for (let j = 0; j < addedNodes.length; j++)
			processNode(addedNodes[j]);
	}
}).observe(document, { childList: true, subtree: true });

})();