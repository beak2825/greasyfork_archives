// ==UserScript==
// @name         Grepolife tiny fixes
// @name:ru		 Крошечные изменения Grepolife
// @namespace    http://grepolis.scripts/
// @version      1.0.2
// @description  Town as a link in conquer list
// @description:ru  Города в списке захватов как ссылка
// @author       Plest; Veta4ka
// @include      /^https?:\/\/grepolife\.com\/[^/]+\/[^/]+\/$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421692/Grepolife%20tiny%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/421692/Grepolife%20tiny%20fixes.meta.js
// ==/UserScript==


(() => {
    'use strict';

	for (const cityTd of document.querySelectorAll('#conquers tr.small .center:nth-child(2)')) {
		const cityEl = cityTd.firstChild;
		const cityId = cityEl.nodeValue.replace(/\D+/g, '');

		const linkEl = document.createElement('a');
		linkEl.setAttribute('href', `${location.href}town/${cityId}`);
		linkEl.appendChild(document.createTextNode(`[town]${cityId}[/town]`));

		cityTd.replaceChild(linkEl, cityEl);
	}
})();