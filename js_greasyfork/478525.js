// ==UserScript==
// @name         BgmVisitCounts
// @namespace    https://jirehlov.com
// @version      0.1
// @description  show how many times you visited a subject page
// @author       Jirehlov
// @include        /^(https:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/subject\/\d+)$/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478525/BgmVisitCounts.user.js
// @updateURL https://update.greasyfork.org/scripts/478525/BgmVisitCounts.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const urlParts = window.location.href.split('/');
	const id = urlParts[urlParts.length - 1];
	let visitCount = localStorage.getItem(`JvisitCount_${ id }`) || 0;
	visitCount = parseInt(visitCount);
	visitCount++;
	localStorage.setItem(`JvisitCount_${ id }`, visitCount);
	const visitCountSpan = document.createElement('span');
	visitCountSpan.textContent = `(本条目访问次数: ${ visitCount })`;
	const h1Element = document.querySelector('h1');
	if (h1Element) {
		h1Element.appendChild(visitCountSpan);
	}
}());