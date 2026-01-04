// ==UserScript==
// @name         MH - Guesstimate Halloween Drops
// @author       squash
// @namespace    https://greasyfork.org/users/918578
// @description  Guesstimation in tooltips for potential drops per current quantity of cheese in Gloomy Greenwood. Does not currently account for Incense!
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/453188/MH%20-%20Guesstimate%20Halloween%20Drops.user.js
// @updateURL https://update.greasyfork.org/scripts/453188/MH%20-%20Guesstimate%20Halloween%20Drops.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function init() {
		function round(x) {
			return Math.round(x * 10) / 10;
		}

		function estimateDrops(data) {
			const tier1Root = 0.5; // monterey
			const tier2Root = 1; // bonefort
			const tier3Root = 3; // polter-geitost
			const tier4Root = 9; // scream

			const tier2Mat = 1.46; // marshmarrow
			const tier3Mat = 1; // ghost pepper
			const tier4Mat = 0.59; // avacaaahdo

			const baits = document.querySelectorAll('.halloweenBoilingCauldronHUD-bait-quantity');

			// Modify bait tooltips
			if (baits) {
				baits.forEach(function (el) {
					let parent = el.closest('.mousehuntTooltipParent');
					let tooltip = parent.querySelector('.mousehuntTooltip');
					tooltip.style.flexWrap = 'wrap';
					let extras = parent.querySelector('.mousehuntTooltip__estimates') || document.createElement('div');
					extras.classList = 'mousehuntTooltip__estimates';
					extras.style.flexBasis = '100%';

					switch (el.dataset.itemType) {
						case 'cauldron_tier_1_cheese': // monterey
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.cauldron_tier_1_cheese.quantity * tier2Mat)} (${round(tier2Mat)}) ${data.items.cauldron_tier_2_ingredient_stat_item.name}</b>
							<br><i>(${Math.floor(((data.items.cauldron_tier_1_cheese.quantity * tier2Mat) / 15) * 10)} ${data.items.cauldron_tier_2_cheese.name})</i>
							<br>${Math.floor(data.items.cauldron_tier_1_cheese.quantity * tier1Root)} (${round(tier1Root)}) ${data.items.cauldron_potion_ingredient_stat_item.name}
							`;
							break;
						case 'cauldron_tier_2_cheese': // bonefort
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.cauldron_tier_2_cheese.quantity * tier3Mat)} (${round(tier3Mat)}) ${data.items.cauldron_tier_3_ingredient_stat_item.name}</b>
							<br><i>(${Math.floor(((data.items.cauldron_tier_2_cheese.quantity * tier3Mat) / 15) * 10)} ${data.items.cauldron_tier_3_cheese.name})</i>
							<br>${Math.floor(data.items.cauldron_tier_2_cheese.quantity * tier2Root)} (${round(tier2Root)}) ${data.items.cauldron_potion_ingredient_stat_item.name}
							`;
							break;
						case 'cauldron_tier_3_cheese': // polter-geitost
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.cauldron_tier_3_cheese.quantity * tier4Mat)} (${round(tier4Mat)}) ${data.items.cauldron_tier_4_ingredient_stat_item.name}</b>
							<br><i>(${Math.floor(((data.items.cauldron_tier_3_cheese.quantity * tier4Mat) / 15) * 10)} ${data.items.cauldron_tier_4_cheese.name})</i>
							<br>${Math.floor(data.items.cauldron_tier_3_cheese.quantity * tier3Root)} (${round(tier3Root)}) ${data.items.cauldron_potion_ingredient_stat_item.name}
							`;
							break;
						case 'cauldron_tier_4_cheese': // scream
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.cauldron_tier_4_cheese.quantity * tier4Root)} (${round(tier4Root)}) ${data.items.cauldron_potion_ingredient_stat_item.name}</b>
							`;
							break;
					}

					tooltip.append(extras);
				});
			}
		}

		if (typeof user !== 'undefined' && 'quests' in user && 'QuestHalloweenBoilingCauldron' in user.quests && user.environment_type == 'halloween_event_location') {
			estimateDrops(user.quests.QuestHalloweenBoilingCauldron);
		}

		eventRegistry.addEventListener('ajax_response', function (response) {
			if ('user' in response && 'quests' in response.user && 'QuestHalloweenBoilingCauldron' in response.user.quests && response.user.environment_type == 'halloween_event_location') {
				estimateDrops(response.user.quests.QuestHalloweenBoilingCauldron);
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
