// ==UserScript==
// @name         MH - Estimate Pond Drops
// @author       squash
// @namespace    https://greasyfork.org/users/918578
// @description  Simple projection for potential drops per current quantity of cheese in prologue pond
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @version      0.6.1
// @downloadURL https://update.greasyfork.org/scripts/449794/MH%20-%20Estimate%20Pond%20Drops.user.js
// @updateURL https://update.greasyfork.org/scripts/449794/MH%20-%20Estimate%20Pond%20Drops.meta.js
// ==/UserScript==


(function () {
	'use strict';

	function init() {

		function getCR() {
			const CRdefaults = {
				'architeuthulhu_of_the_abyss': 0.70,
				'vicious_vampire_squid': 0.90,
				'nefarious_nautilus': 0.93,
				'sinister_squid': 0.98,
				'melodramatic_minnow': 0.99,
				'careless_catfish': 1.00,
				'pompous_perch': 1.00
			};

			let CR = Object.assign({}, CRdefaults)
			let storage = JSON.parse(localStorage.getItem('squash-pond-catchrates'));
			if (storage) {
				Object.keys(storage).forEach(function (key) {
					if (key in CR) {
						CR[key] = storage[key] > 1 ? 1 : (storage[key] < 0 ? 0 : storage[key]);
					}
				});
			}
			return CR
		}

		function round(x) {
			return Math.round(x * 10) / 10
		}

		function estimateDrops(data) {
			let CR = getCR()

			const AR = {
				'vicious_vampire_squid': 0.25,
				'nefarious_nautilus': 0.40,
				'sinister_squid': 0.35,
				'melodramatic_minnow': 0.25,
				'careless_catfish': 0.40,
				'pompous_perch': 0.35
			};

			const grubbeenClam = ((1 * AR.pompous_perch * CR.pompous_perch) + (1 * AR.careless_catfish * CR.careless_catfish) + (2 * AR.melodramatic_minnow * CR.melodramatic_minnow)) * (data.has_fridge_bait_box ? 2 : 1);
			const grubbeenPenny = ((1 * AR.pompous_perch * CR.pompous_perch) + (2 * AR.careless_catfish * CR.careless_catfish) + (3 * AR.melodramatic_minnow * CR.melodramatic_minnow)) * (data.has_fish_net ? 2 : 1);
			const grubbeenCC = 0.0875 * ((1 * AR.pompous_perch * CR.pompous_perch) + (1 * AR.careless_catfish * CR.careless_catfish) + (1 * AR.melodramatic_minnow * CR.melodramatic_minnow));
			const clamembertInk = ((3 * AR.sinister_squid * CR.sinister_squid) + (3 * AR.nefarious_nautilus * CR.nefarious_nautilus) + (6 * AR.vicious_vampire_squid * CR.vicious_vampire_squid)) * (data.has_fishing_rod ? 2 : 1) * (data.has_steam_reel ? 2 : 1) * (data.has_fishing_line ? 2 : 1);
			const clamembertPenny = ((4 * AR.sinister_squid * CR.sinister_squid) + (8 * AR.nefarious_nautilus * CR.nefarious_nautilus) + (12 * AR.vicious_vampire_squid * CR.vicious_vampire_squid)) * (data.has_fish_net ? 2 : 1);
			const clamembertCC = 0.18 * ((1 * AR.sinister_squid * CR.sinister_squid) + (1 * AR.nefarious_nautilus * CR.nefarious_nautilus) + (1 * AR.vicious_vampire_squid * CR.vicious_vampire_squid));
			const stormyInk = (CR.architeuthulhu_of_the_abyss * 25) * (data.has_fishing_rod ? 2 : 1) * (data.has_steam_reel ? 2 : 1) * (data.has_fishing_line ? 2 : 1);
			const stormyPenny = (CR.architeuthulhu_of_the_abyss * 35) * (data.has_fish_net ? 2 : 1);
			const stormyCC = (0.28 * CR.architeuthulhu_of_the_abyss);

			const pondBaits = document.querySelectorAll('.folkloreForestRegionView-baitCraftableContainer');

			// Modify bait tooltips
			if (pondBaits) {
				pondBaits.forEach(function (el) {
					let tooltip = el.querySelector('.mousehuntTooltip')
					let extras = el.querySelector('.mousehuntTooltip__estimates') || document.createElement('div');
					extras.classList = 'mousehuntTooltip__estimates';
					switch (el.dataset.itemType) {
						case 'grubbeen_cheese':
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.grubbeen_cheese.quantity * grubbeenClam)} (${round(grubbeenClam)}) clam</b>
							<br> ${Math.floor(data.items.grubbeen_cheese.quantity * grubbeenCC)} condensed creativity
							`;
							break;
						case 'clamembert_cheese':
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.clamembert_cheese.quantity * clamembertInk)} (${round(clamembertInk)}) ink
							<br>${Math.floor(data.items.clamembert_cheese.quantity * clamembertPenny)} (${round(clamembertPenny)}) penny</b>
							<br>${Math.floor(data.items.clamembert_cheese.quantity * clamembertCC)} condensed creativity
							<br>
							<br>As ${(data.items.clamembert_cheese.quantity / 20) * 2} stormy+cc:<br>${Math.floor((data.items.clamembert_cheese.quantity / 20) * 2 * stormyInk * 2)} ink or ${Math.floor((data.items.clamembert_cheese.quantity / 20) * 2 * stormyPenny * 2)} penny
							`;
							break;
						case 'stormy_clamembert_cheese':
							extras.innerHTML = `
							---
							<br><b>${Math.floor(data.items.stormy_clamembert_cheese.quantity * stormyInk)} (${round(stormyInk)}) ink
							<br>${Math.floor(data.items.stormy_clamembert_cheese.quantity * stormyPenny)} (${round(stormyPenny)}) penny</b>
							<br>With CC:
							<br><b>${Math.floor(data.items.stormy_clamembert_cheese.quantity * stormyInk * 2)} (${round(stormyInk) * 2}) ink
							<br>${Math.floor(data.items.stormy_clamembert_cheese.quantity * stormyPenny * 2)} (${round(stormyPenny) * 2}) penny</b>
							<br>${Math.floor(data.items.stormy_clamembert_cheese.quantity * stormyCC)} condensed creativity
							`;
							break;
					}

					tooltip.append(extras)
				})

			}

			// Catch rate configuration dialog
			const settings = document.querySelector('.folkloreForestRegionView__estimate-button') || document.createElement('a');
			settings.style = `position: absolute; right: -6px; top: 13px; font-size: 16px; font-weight: bold; color: #064155; filter:brightness(2.5);`;
			settings.innerText = '⚙';
			settings.classList = 'folkloreForestRegionView__estimate-button';
			settings.title = 'Pond Estimate Settings';
			settings.onclick = function () {
				let dialog = new jsDialog()
				dialog.setTemplate('ajax')
				dialog.setIsModal(true)
				dialog.addToken('{*prefix*}', '<h2 class="title">Pond Estimate Settings</h2><p>Configure catchrates according to your own setup. Values are in decimal format where 1.00 is 100%</p>')
				let CR = getCR()
				let content = `<form>`;
				Object.keys(CR).forEach(function (key) {
					content += `<div><label><input type="number" min="0" max="1" name="${key}" value="${CR[key]}" step="0.01" /> ${key} </label></div>`
				})
				content += '</form>'
				dialog.addToken('{*content*}', content)
				dialog.addToken('{*suffix*}', `<input class="jsDialogClose" type="button" value="Cancel" /> <input class="jsDialogClose" type="button" onclick="localStorage.setItem('squash-pond-catchrates', JSON.stringify(Object.fromEntries(new FormData(document.querySelector('.jsDialog form')).entries()))); hg.utils.PageUtil.refresh();" value="Save" />`)
				dialog.show()
			};
			document.querySelector('.folkloreForestRegionView-footer').append(settings);
		}

		if (typeof user !== 'undefined' && 'enviroment_atts' in user && user.environment_type == "prologue_pond") {
			estimateDrops(user.enviroment_atts)
		}

		eventRegistry.addEventListener(
			'ajax_response',
			function (response) {
				if ('user' in response && 'enviroment_atts' in response.user && response.user.environment_type == "prologue_pond") {
					estimateDrops(response.user.enviroment_atts)
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
