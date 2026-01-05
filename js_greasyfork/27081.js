// ==UserScript==
// @name         SauceNAO Moder
// @description  Easy to Use SauceNAO
// @version      1.0.1702056
// @author       DanoR
// @namespace    http://weibo.com/zheung
// @grant        none
// @include      *://saucenao.com/*
// @downloadURL https://update.greasyfork.org/scripts/27081/SauceNAO%20Moder.user.js
// @updateURL https://update.greasyfork.org/scripts/27081/SauceNAO%20Moder.meta.js
// ==/UserScript==

(function() {
	const qsa = function(selector) {
		const result = [], arr = document.querySelectorAll(selector);

		for(let i = 0; i < arr.length; i++) result.push(arr[i]);
		return result;
	};

	setTimeout(function() {
		window.togglenao();

		const as = qsa('div.resultcontentcolumn>a');

		for(const i in as) {
			const a = as[i];

			a.target = '_blank';

			if(a.innerHTML.indexOf('hentai-foundry') + 1) {
				const r = a.href.match(/com\/\w\/(.*?\/\d+?)\//);

				if(r)
					a.href = 'http://www.hentai-foundry.com/pictures/user/' + r[1];

				a.innerHTML = 'hentai-foundry.com';
			}
		}
	}, 2014);
})();