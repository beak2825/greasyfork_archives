// ==UserScript==
// @name        Steam - Add review percentage number
// @namespace   valacar
// @description Add review percentage number
// @include     http://store.steampowered.com/app/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12487/Steam%20-%20Add%20review%20percentage%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/12487/Steam%20-%20Add%20review%20percentage%20number.meta.js
// ==/UserScript==

try
{
	var ratingTooltipTag = document.querySelector('div[itemprop="aggregateRating"]')
	var ratingTooltipText = ratingTooltipTag.getAttribute('data-store-tooltip');
	var ratingPercent = ratingTooltipText.match(/^\d+%/)[0];

	//console.log(ratingPercent)

	//ratingTooltipTag.textContent = ratingTooltipTag.textContent.replace(/([\d,]+ reviews)/, '$1');

	var reviewsText = document.querySelector('.game_review_summary + .responsive_hidden');

	//console.log(reviewsText.textContent)

	reviewsText.textContent = reviewsText.textContent.replace('(', '(' + ratingPercent + ' of ' );
}
catch(e)
{
	console.log(e)
}