// ==UserScript==
// @name        Canny Google Search
// @name:ja     Canny Google検索
// @description Adds Google Custom Search Box into Canny pages.
// @description:ja CannyのページへGoogleカスタム検索窓を追加します。
// @namespace   https://greasyfork.org/users/137
// @version     1.1.0
// @match       https://*.canny.io/*
// @exclude     https://canny.io/*
// @require     https://greasyfork.org/scripts/17896/code/start-script.js?version=112958
// @require     https://greasyfork.org/scripts/19616/code/utilities.js?version=230651
// @license     MPL-2.0
// @compatible  Edge
// @compatible  Firefox Firefoxを推奨 / Firefox is recommended
// @compatible  Opera
// @compatible  Chrome
// @grant       dummy
// @noframes
// @run-at      document-start
// @icon        data:image/png;base64,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
// @author      100の人
// @homepageURL https://greasyfork.org/scripts/392585
// @downloadURL https://update.greasyfork.org/scripts/392585/Canny%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/392585/Canny%20Google%20Search.meta.js
// ==/UserScript==

'use strict';

startScript(
	function () {
		document.head.insertAdjacentHTML('beforeend', `<style>
			[action="https://www.google.com/search"] {
				margin-left: auto;
				display: flex;
				align-items: center;
			}
		</style>`);

		const secondaryNav = document.getElementsByClassName('secondaryNav')[0];
		document.getElementsByClassName('secondaryNav')[0].insertAdjacentHTML('beforeend', h`
			<form action="https://www.google.com/search">
				<input type="search" name="q" size="31" />
				<input type="hidden" name="as_sitesearch" value="${location.origin}" />
				<input type="submit" value="Search" />
				<img alt="Google™ Custom Search"
					src="https://cse.google.com/cse/images/google_custom_search_smwide.gif" />
			</form>
		`);
		const form = secondaryNav.lastElementChild;

		// CSPの回避
		form.addEventListener('submit', function (event) {
			event.preventDefault();
			location.assign(form.action + '?' + new URLSearchParams(new FormData(form)));
		});

		new MutationObserver(function (mutations, observer) {
			if (!mutations.some(mutation => mutation.removedNodes[0] === form)) {
				return;
			}
			observer.disconnect();
			secondaryNav.append(form);
		}).observe(secondaryNav, { childList: true });

		new MutationObserver(function () {
			document.getElementsByClassName('secondaryNav')[0].append(form);
		}).observe(document.getElementsByClassName('publicContainer')[0], { childList: true });
	},
	parent => parent.classList.contains('secondaryNav'),
	target => target.classList.contains('boards'),
	() => document.getElementsByClassName('boards')[0]
);
