// ==UserScript==
// @name         MH - Censor Journal Names
// @author       squash
// @namespace    https://greasyfork.org/users/918578
// @description  Adds toggle button at top of journal to blur out names of friends/mapmates in *most* journal entries. For privacy-conscious screenshots!
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @version      0.7.4
// @downloadURL https://update.greasyfork.org/scripts/445553/MH%20-%20Censor%20Journal%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/445553/MH%20-%20Censor%20Journal%20Names.meta.js
// ==/UserScript==


(function () {
	'use strict';

	function init() {
		let css = `
		#journalContainer.journal--privacy .entry:not(.badge) a[href*="profile.php"],
		#journalContainer.journal--privacy .entry.socialGift .journaltext a,
		#journalContainer.journal--privacy .relicHunter_complete > .journalbody > .journaltext > b:nth-child(6),
		#journalContainer.journal--privacy .wanted_poster-complete > .journalbody > .journaltext > b:nth-child(8),
		#journalContainer.journal--privacy .journal__hunter-name
		{
			-webkit-filter: blur(3px) grayscale(1);
			filter: blur(3px) grayscale(1);
			opacity: 0.3;
			font-size: 0.8em;
			color: #333 !important;
			background-color: #333 !important;
		}

		#journalContainer .journal__privacy-button {
			position: absolute;
			right: 90px;
			top: 60%;
			transform: translateY(-60%);
			font-size: 10px;
			line-height: 20px;
			padding: 0 5px 0 5px;
			border-radius: 5px;
			background: #ccc;
			border: 1px solid #333;
			text-decoration: none;
			display: none;
		}

		#journalContainer .journal__privacy-button:hover {
			text-decoration: none;
			background-color: #eee;
		}

		#journalContainer .top:hover .journal__privacy-button {
			display: block;
		}

		#journalContainer:not(.journal--privacy) .journal__privacy-button::after {
			content: ' Off';
		}

		#journalContainer.journal--privacy .journal__privacy-button::after {
			content: ' On';
			font-weight: bold;
		}
		`;

		const styleNode = document.createElement('style');
		styleNode.appendChild(document.createTextNode(css));
		(document.querySelector('head') || document.documentElement).appendChild(styleNode);

		let journalEventListener = false;
		const toggle = document.createElement('a');
		toggle.innerText = 'Privacy';
		toggle.href = '#';
		toggle.className = 'journal__privacy-button';
		toggle.onclick = function (e) {
			e.preventDefault();

			document.getElementById('journalContainer').classList.toggle('journal--privacy');
			findUnselectableNames();

			// Add listener for journal pagination/updates to recheck for map-related entries
			if (!journalEventListener) {
				journalEventListener = true;
				eventRegistry.addEventListener(
					'ajax_response',
					function (response) {
						if ('journal_page' in response || 'journal_markup' in response) {
							setTimeout(findUnselectableNames, 300);
						}
					}
				);
			}
			return false;
		};

		function findUnselectableNames() {
			// Some map-related journal entries don't have selector-friendly names, so they need to be found and wrapped.
			const mapEntries = document.querySelectorAll(
				'#journalContainer .entry.relicHunter_start .journaltext'
			);
			if (mapEntries) {
				mapEntries.forEach(function (entry) {
					let index = entry.innerHTML.indexOf(' has joined the ');

					if (index === -1) {
						index = entry.innerHTML.indexOf(' has left the ');
					}
					if (index === -1) {
						index = entry.innerHTML.indexOf(' used Rare Map Dust');
					}
					if (index === -1) {
						index = entry.innerHTML.indexOf(', the map owner, has activated Consolation Mode');
					}
					if (index !== -1) {
						if (!entry.querySelector('.journal__hunter-name')) {
							entry.innerHTML = [
								'<span class="journal__hunter-name">',
								entry.innerHTML.slice(0, index),
								'</span>',
								entry.innerHTML.slice(index),
							].join('');
						}
					}
				});
			}

			// ¯\_(ツ)_/¯
			const otherEntries = document.querySelectorAll('#journalContainer .entry.larryGift .journaltext, #journalContainer .entry.socialGift-ignore .journaltext');
			if (otherEntries) {
				otherEntries.forEach(function (entry) {
					let index = entry.innerHTML.indexOf('Larry the Friendly Knight');
					if (index === -1) {
						index = entry.innerHTML.indexOf('I ignored a gift from ');
						if (index !== -1) {
							index += 22;
						}
					}
					if (index !== -1) {
						if (!entry.querySelector('.journal__hunter-name')) {
							entry.innerHTML = [
								entry.innerHTML.slice(0, index),
								'<span class="journal__hunter-name">',
								entry.innerHTML.slice(index),
								'</span>',
							].join('');
						}
					}
				});
			}
		}

		function renderButton() {
			if (!document.querySelector('.journal__privacy-button')) {
				const journalTop = document.querySelector('#journalContainer .top');
				if (journalTop) {
					journalTop.prepend(toggle);
				}
			}
		}

		renderButton();
		eventRegistry.addEventListener(
			hg.utils.PageUtil.EventSetPage,
			function (currentPage) {
				if (['PageCamp', 'PageJournal', 'PageHunterProfile'].includes(currentPage.type)) {
					renderButton();
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