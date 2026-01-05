// ==UserScript==
// @name         IMDb Standard Deviation
// @namespace    http://userscripts.org/users/7063
// @include      https://www.imdb.com/title/tt*/ratings
// @include      https://www.imdb.com/title/tt*/ratings/
// @include      https://www.imdb.com/title/tt*/ratings-*
// @include      https://www.imdb.com/title/tt*/ratings?*
// @version      2025.1.13.4.31
// @grant        none
// @description  Adds standard deviation to IMDb ratings breakdown pages.
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536/IMDb%20Standard%20Deviation.user.js
// @updateURL https://update.greasyfork.org/scripts/536/IMDb%20Standard%20Deviation.meta.js
// ==/UserScript==

(function () {
    "use strict";
	function go(main) {
		const votes = [...main.querySelectorAll(".VictoryContainer path ~ text")].map(k => {
			const text = k.textContent.match(/\((.*)\)/)[1];
			const km = text.match(/[KM]/);
			if (km) {
				return +text.match(/[^KM]+/) * 10 ** {"K": 3, "M": 6}[km];
			}
			return +text;
		});
		const [product, votecount] = votes.reduce(
			([p, v], c, i) => [p + c * (10 - i), v + c],
			[0, 0]
		);
		const sumOfSquares = votes.reduce(
			(p, c, i) => p + Math.pow(10 - i - product / votecount, 2) * c,
			0
		);
        const p = document.createElement("p");
		p.textContent = `${Math.sqrt(sumOfSquares / (votecount - 1)).toFixed(2)} Standard deviation`;
		p.classList.add("cSLvSW");
		main.append(p);
	}
	const obParams = [document.body, { childList: true, subtree: true }];
	const observer = new MutationObserver(() => {
		observer.disconnect();
		const histo = document.querySelector(`[data-testid="histogram-container"]`);
		if (histo) {
			go(histo);
		} else {
			observer.observe(...obParams);
		}
	});
	observer.observe(...obParams);

}());
