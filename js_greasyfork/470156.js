// ==UserScript==
// @name        Golden Jade Opener Helper
// @version     1.0.0
// @description how much rmd you gonna get
// @license     MIT
// @author      brap
// @namespace   bradp
// @match       https://www.mousehuntgame.com/*
// @icon        https://i.mouse.rip/mouse.png
// @run-at      document-end
// @grant       none
// @require https://greasyfork.org/scripts/464008-mousehunt-utils-beta/code/%F0%9F%90%AD%EF%B8%8F%20MouseHunt%20Utils%20Beta.js?version=1212272
// @downloadURL https://update.greasyfork.org/scripts/470156/Golden%20Jade%20Opener%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470156/Golden%20Jade%20Opener%20Helper.meta.js
// ==/UserScript==
(function () {
	'use strict';

	const goldenJade = async () => {
		const append = document.querySelector('.campPage-questCampHUDContainer');
		if (! append) {
			return;
		}

		const existing = document.querySelector('.golden-jade-wrapper');
		if (existing) {
			existing.remove();
		}

		const wrapper = makeElement('div', 'golden-jade-wrapper');
		const quantity = await getUserItems(['relic_scroll_case_convertible']);
		let qty = quantity[0].quantity || 0;

		const existingOpen = document.getElementById('golden-jade');
		if (existingOpen) {
			existingOpen.remove();
		}

		const open = makeElement('div', 'mousehuntActionButton', `<span>Open Golden Jade (${qty}/100)</span>`);
		open.id = 'golden-jade';

		open.addEventListener('click', async () => {
			open.classList.add('disabled');

			const existingLeave = document.getElementById('golden-jade-leave');
			if (existingLeave) {
			existingLeave.remove();
			}

			const mapdata = await doRequest('managers/ajax/users/useconvertible.php', {
			item_type: 'relic_scroll_case_convertible',
			item_qty: 1
			});

			if (mapdata && mapdata.treasure_map) {
			// decode the json
			const map = JSON.parse(mapdata.treasure_map);
			if (! map || ! map.map_id) {
				return;
			}

			const leave = makeElement('div', 'mousehuntActionButton', '<span>Leave</span>');
			leave.id = 'golden-jade-leave';
			leave.addEventListener('click', async () => {
				hg.utils.TreasureMapUtil.leave(map.map_id);
			});

			wrapper.appendChild(leave);

			// update the text of the button
			qty = qty - 1;
			open.querySelector('span').innerText = `Open Golden Jade (${qty}/100)`;
			}

			open.classList.remove('disabled');
		});

		wrapper.appendChild(open);
		append.appendChild(wrapper);

		addStyles(`.golden-jade-wrapper {
			margin: 10px;
		}

		#golden-jade-leave {
			margin-left: 10px;
		}

		.golden-jade-wrapper .mousehuntActionButton:hover,
		.golden-jade-wrapper .mousehuntActionButton:focus,
		.golden-jade-wrapper .mousehuntActionButton:active {
			cursor: pointer;
		}`)
	};

	goldenJade();
})();
