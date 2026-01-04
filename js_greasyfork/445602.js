// ==UserScript==
// @name         MH - Enable tooltips for item favorites
// @namespace    https://greasyfork.org/users/918578
// @version      0.2
// @description  Enables item description tooltips on hover for favorited items in the trap selector
// @author       squash
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445602/MH%20-%20Enable%20tooltips%20for%20item%20favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/445602/MH%20-%20Enable%20tooltips%20for%20item%20favorites.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function init() {
		function bindMouseEvents() {
			const itemDescriptionHover = document.querySelector(
				'.campPage-trap-itemBrowser-itemDescriptionHover'
			);
			const favorites = document.querySelectorAll(
				'.campPage-trap-itemBrowser-favorite-item'
			);
			if (favorites && itemDescriptionHover) {
				if (itemDescriptionHover.style.display == 'none') {
					itemDescriptionHover.style.marginTop = '0';
				}

				favorites.forEach(function (item) {
					if (item.dataset.itemId) {
						item.onmouseenter = function (event) {
							itemDescriptionHover.style.marginTop = '-80px';
							app.pages.CampPage.showItemDescription(event);
						};
					}
					item.onmouseleave = function () {
						itemDescriptionHover.style.marginTop = '0';
						app.pages.CampPage.hideItemDescription();
					};
				});
			}
		}

		// When favorites get rerendered after adding/removing
		let timeoutId;
		eventRegistry.addEventListener(
			app.pages.CampPage.EventUpdateItemArray,
			function (data) {
				clearTimeout(timeoutId);

				timeoutId = setTimeout(function () {
					bindMouseEvents();
				}, 1000);
			}
		);

		// When item browser is initially opened
		eventRegistry.addEventListener(
			'camp_page_toggle_blueprint',
			function (type) {
				if (type == 'item_browser') {
					bindMouseEvents();
				}
			}
		);
	}

	if (typeof eventRegistry === 'undefined') {
		// Workaround for GM
		const script = document.createElement('script');
		script.type = 'application/javascript';
		script.textContent = '(' + init + ')();';
		document.body.appendChild(script);
	} else {
		init();
	}
})();
