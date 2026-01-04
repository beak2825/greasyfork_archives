// ==UserScript==
// @name         MH - ToC Minimum Book
// @author       squash
// @namespace    https://greasyfork.org/users/918578
// @description  Simple projection in tooltip for the minimum book length reachable with remaining hunts assuming 100% catch rate. Worst case attractions, best case catch rate.
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/451720/MH%20-%20ToC%20Minimum%20Book.user.js
// @updateURL https://update.greasyfork.org/scripts/451720/MH%20-%20ToC%20Minimum%20Book.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function init() {
		function targetBook(books, words) {
			let target = books[0];
			let next;
			for (let book of books) {
				next = book;
				if (words >= book.words_required) {
					target = book;
				} else {
					break;
				}
			}

			let diff = next.words_required - words;
			let targetName = target.name;
			let nextName = next.name;
			let words_required = target.words_required;
			if (target.type == 'encyclopedia') {
				let vols = words / target.words_required;
				let wholeVol = Math.ceil(vols);

				diff = wholeVol * next.words_required - words;
				targetName = `Vol. ${round(vols)}`;
				nextName = `Vol. ${wholeVol}`;
				words_required = Math.floor(vols) * target.words_required;
			}

			return { name: targetName, words_required: words_required, words_to_next: diff, next_name: nextName };
		}

		function round(num) {
			return Math.round((num + Number.EPSILON) * 100) / 100;
		}

		function formatCatches(catches) {
			return `${catches} catch${catches == 1 ? '' : 'es'}`;
		}

		function estimateWords(data) {
			const tooltip = document.querySelector('.tableOfContentsView-wordMeterContainer .mousehuntTooltip');
			if (tooltip) {
				let extras = tooltip.querySelector('.mousehuntTooltip__estimates') || document.createElement('div');
				extras.classList = 'mousehuntTooltip__estimates';
				extras.style = 'border-top: 1px solid grey; margin-top: 1em; padding-top: 1em; padding-bottom: 1em; text-align: left;';

				if (data.show_book) {
                    let range_min = (data.current_word_range.min + '').replaceAll(',','');
					let min = data.current_book.hunts_remaining * range_min + data.current_book.word_count;
					let catches_to_next = Math.ceil(data.next_book.words_until / range_min);
					let target = targetBook(data.all_books, min);
					let catches_to_target = Math.ceil((target.words_required - data.current_book.word_count) / range_min);

					let ccHint = '';
					if (!data.is_fuel_enabled && target.words_to_next <= data.current_book.hunts_remaining * range_min) {
						ccHint = `<br>Could reach ${target.next_name} by burning CC for at least ${formatCatches(Math.ceil(target.words_to_next / range_min))}`;
					}

					extras.innerHTML = `
					Minimum book in ${formatCatches(data.current_book.hunts_remaining)}:
					<br> ${target.name} (${min.toLocaleString()} words). ${catches_to_target > 0 ? formatCatches(catches_to_target) + ' to start of book.' : ''}
					<br>
					<br> Next book is ${data.next_book.name_formatted} in ${formatCatches(catches_to_next)} (${data.next_book.words_until} words)
					<br>
					${ccHint}
					`;
				} else {
					extras.style = 'display:none;';
				}

				tooltip.append(extras);
			}
		}

		if (typeof user !== 'undefined' && 'enviroment_atts' in user && 'current_book' in user.enviroment_atts) {
			estimateWords(user.enviroment_atts);
		}

		eventRegistry.addEventListener('ajax_response', function (response) {
			if ('user' in response && 'enviroment_atts' in response.user && 'current_book' in response.user.enviroment_atts) {
				estimateWords(response.user.enviroment_atts);
			}
		});
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
