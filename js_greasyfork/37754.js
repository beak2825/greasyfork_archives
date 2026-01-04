// ==UserScript==
// @name         Mangadex Static Navbar & Reader Scrolling Between Chapters
// @namespace    http://tampermonkey.net/
// @version      1.2.4
// @description  Makes the nav-bar static instead of fixed. Fixes the scroll to top function so it scrolls to the top of the manga page when going between pages and (unique to this script) chapters.
// @author       Hajile-Haji
// @match        *://mangadex.org/*
// @match        *://*.mangadex.org/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/37754/Mangadex%20Static%20Navbar%20%20Reader%20Scrolling%20Between%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/37754/Mangadex%20Static%20Navbar%20%20Reader%20Scrolling%20Between%20Chapters.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let d = document,
		redirect = GM_getValue('mangaDexRedirect', null),
		isBeta = location.hostname.startsWith('beta.'),
		isReaderPage = location.pathname.startsWith('/chapter'),
		topNav = isBeta ? d.querySelector('.navbar') : d.getElementById('top_nav');


	if (isBeta) {
		if (!isReaderPage) {
			d.body.style.paddingTop = 0;
			topNav.classList.remove('fixed-top');
			topNav.style.marginBottom = '20px';
		}
	} else {
		d.body.style.paddingTop = 0;
		topNav.classList.add('navbar-static-top');
		topNav.classList.remove('navbar-fixed-top');
	}

	// If the page is a reader page
	if (!isBeta && isReaderPage) {
		let currentPage = d.getElementById('current_page'),
			pageCount = d.getElementById('jump_page').length,
			keyPressed = false;

		function getCurrentDataSrc(add) {
			if (add !== undefined) {
				return $(currentPage).data('page') + add;
			} else {
				return $(currentPage).data('page');
			}
		};

		function goPage(page) {
			if (page > pageCount || page < 1) {
				GM_setValue('mangaDexRedirect', true);
			}

			if (redirect) {
				currentPage.scrollIntoView();
			} else {
				currentPage.addEventListener('load', () => currentPage.scrollIntoView());
			}
		};

		GM_deleteValue('mangaDexRedirect');

		currentPage.style.paddingTop = '5px';
		currentPage.style.margin = '0 auto';

		if (redirect) {
			goPage(1);
			redirect = false;
		}

		// jump_page select change event
		d.getElementById('jump_page').addEventListener('change', () => goPage(getCurrentDataSrc()));

		// page click event
		currentPage.addEventListener('click', () => goPage(getCurrentDataSrc(1)));

		// keyboard events
		d.addEventListener('keyup', e => (e.key === keyPressed) ? keyPressed = false : null);
		d.addEventListener('keydown', e => {
			e.stopPropagation();

			const tag = (e.target || e.srcElement).tagName.toLowerCase();

			if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || keyPressed !== false) return;

			keyPressed = e.key;

			if (!['input', 'select', 'textarea'].includes(tag)) {
				switch (e.key.toLowerCase()) {
					case "arrowleft":
					case "left":
					case "a":
						return goPage(getCurrentDataSrc() - 1);

					case "arrowright":
					case "right":
					case "d":
						return goPage(getCurrentDataSrc() + 1);
				}
			}
		});
	}
})();