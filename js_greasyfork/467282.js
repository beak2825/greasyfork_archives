// ==UserScript==
// @name         MH - Bean Counter
// @author       squash
// @namespace    https://greasyfork.org/users/918578
// @description  Adds calculations to Bountiful Beanstalk HUD tooltips. Beanster quantities craftable with your resources, and the max possible loot & noise for your current/next room/zone and multiplier.
// @match        https://www.mousehuntgame.com/*
// @match        http://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @version      0.1.11
// @downloadURL https://update.greasyfork.org/scripts/467282/MH%20-%20Bean%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/467282/MH%20-%20Bean%20Counter.meta.js
// ==/UserScript==

(function () {
	'use strict';

	function init() {
		function calculateMaxCraftable(itemsOwned, recipe, ignoreItems = [], accounted = {}, itemsCrafted = {}, cheeseRecipes, settings) {
			let maxCanCraft = Infinity;
			let cost = {};

			if (settings) {
				// Calculate craftable of each ingredient recursively
				for (const item of recipe.items) {
					if (item.type in cheeseRecipes) {
						let subRecipe = cheeseRecipes[item.type][settings.recipe[item.type] ? 'upsell' : 'vanilla'];
						let subCraftable = calculateMaxCraftable(itemsOwned, subRecipe, ignoreItems, accounted, itemsCrafted, cheeseRecipes, settings);
						itemsCrafted[item.type] = subCraftable.quantity;
					}
				}
			}

			for (const item of recipe.items) {
				let quantityOwned = itemsOwned[item.type]?.quantity_unformatted || 0;

				// If tracking items that COULD be crafted, add them to available ingredients
				if (item.type in itemsCrafted) {
					quantityOwned += itemsCrafted[item.type];
				}

				let maxCanCraftThisIngredient = Math.floor(quantityOwned / item.required_quantity);

				if (!ignoreItems.includes(item.name)) {
					// || !settings) {
					maxCanCraft = Math.min(maxCanCraft, maxCanCraftThisIngredient);
				}
			}

			// Record crafting costs
			for (const item of recipe.items) {
				if (settings?.general.include_previous_costs) {
					// Calculate prior recipe costs based on maxCanCraft of current recipe
					let obj = {};
					obj[item.type] = maxCanCraft * item.required_quantity;
					cost = sumProperties(cost, obj);
					cost = recursiveCosts(item, cost, cheeseRecipes, settings, itemsOwned);
				} else {
					cost[item.type] = maxCanCraft * item.required_quantity;
				}

				// accounted properties updated by reference?
				accounted[item.type] = itemsOwned[item.type].quantity_unformatted + (itemsCrafted[item.type] || 0);
			}

			return {
				name: recipe.action.name,
				quantity: maxCanCraft * recipe.action.result_quantity,
				cost: cost,
				accounted: accounted,
			};
		}

		function recursiveCosts(item, cost, cheeseRecipes, settings, itemsOwned) {
			if (item.type in cheeseRecipes) {
				let quantity = cost[item.type];
				// Use configured recipe
				let subRecipe = cheeseRecipes[item.type][settings.recipe[item.type] ? 'upsell' : 'vanilla'];
				// Remove already owned qty to not account for ingredients already spent
				cost[item.type] -= itemsOwned[item.type]?.quantity_unformatted || 0;
				let maxCanCraft = cost[item.type] / subRecipe.action.result_quantity;
				for (const subItem of subRecipe.items) {
					let obj = {};
					obj[subItem.type] = maxCanCraft * subItem.required_quantity;
					cost = sumProperties(cost, obj);
					cost = recursiveCosts(subItem, cost, cheeseRecipes, settings, itemsOwned);
				}
				// Change cost back to actual qty of cheese needed
				cost[item.type] = quantity;
			}

			return cost;
		}

		function sumProperties(obj1, obj2) {
			const result = { ...obj1 }; // Copy object

			for (const key in obj2) {
				if (result.hasOwnProperty(key)) {
					result[key] += obj2[key];
				} else {
					// If the key doesn't exist in result, add it
					result[key] = obj2[key];
				}
			}

			return result;
		}

		function calculateAllCheeses(cheeseRecipes, itemsOwned, ignoreItems, settings) {
			let allTotals = {};
			const cheeseTypes = Object.keys(cheeseRecipes); // 'beanster_cheese', 'lavish_beanster_cheese', 'royal_beanster_cheese'

			for (const cheeseType of cheeseTypes) {
				let recipeTotals = {};

				let types = [];
				if (settings.recipe[cheeseType]) {
					types.push('upsell');
				} else {
					types.push('vanilla');
				}
				for (const recipeType of types) {
					let cheeseRecipe = cheeseRecipes[cheeseType][recipeType];
					let craftingResult = calculateMaxCraftable(itemsOwned, cheeseRecipe, ignoreItems);

					recipeTotals[recipeType] = {
						as_is: craftingResult,
					};

					recipeTotals[recipeType].with_crafted = calculateMaxCraftable(itemsOwned, cheeseRecipe, ignoreItems, {}, {}, cheeseRecipes, settings);
				}

				allTotals[cheeseType] = recipeTotals;
			}

			return allTotals;
		}

		function calculatePossibleLoot(data) {
			let totalLootMultiplier = data.loot_multipliers.total;
			let huntsPerRoom = 20; // Assuming a fixed number of hunts per room

			// Calculate total possible loot depending on in_castle status
			let currentRoomOrZone, nextRoomOrZone, huntsRemaining;
			if (data.in_castle) {
				currentRoomOrZone = data.castle.current_room;
				nextRoomOrZone = data.castle.next_room;
				huntsRemaining = data.castle.hunts_remaining;
			} else {
				currentRoomOrZone = data.beanstalk.current_zone;
				nextRoomOrZone = data.beanstalk.next_zone;
				huntsRemaining = data.beanstalk.hunts_remaining;
			}

			let nextRoomOrZoneMultiplier = (totalLootMultiplier / currentRoomOrZone.loot_multiplier) * nextRoomOrZone.loot_multiplier;

			return {
				currentRoomOrZoneLoot: {
					hunts: huntsRemaining,
					quantity: totalLootMultiplier * huntsRemaining,
				},
				nextRoomOrZoneLoot: {
					hunts: huntsPerRoom,
					quantity: nextRoomOrZoneMultiplier * huntsPerRoom,
				},
			};
		}

		function calculateCatchesUntilMaxNoise(data) {
			const noisePerCatch = data.loot_multipliers.total;
			const remainingNoise = data.castle.max_noise_level - data.castle.noise_level;
			const catchesNeeded = Math.ceil(remainingNoise / noisePerCatch);

			const mayWake = catchesNeeded <= data.castle.hunts_remaining;
			const possibleNoise = data.castle.hunts_remaining * noisePerCatch;
			const noiseDiff = mayWake ? possibleNoise - remainingNoise : remainingNoise - possibleNoise;
			const catchesShort = mayWake ? 0 : catchesNeeded - data.castle.hunts_remaining;

			// Noise short, or noise extra
			let content = `${catchesNeeded} catches until full noise. `;
			if (mayWake) {
				content += `May wake giant with extra ${noiseDiff} noise.`;
			} else {
				content += `${catchesShort} catches (${noiseDiff} noise) short of waking giant.`;
			}

			if (remainingNoise < 0) {
				content = ``;
			}

			return content;
		}

		function renderCraftable(output) {
			let allRenders = [];

			const recipeTypeMap = {
				upsell: 'Magic Essence',
				vanilla: 'Standard',
			};
			const calcTypeMap = {
				as_is: 'Current Ingredients',
				with_crafted: 'Craftable Ingredients',
			};

			const bait = document.querySelectorAll('.headsUpDisplayBountifulBeanstalkView__baitCraftableContainer');
			if (bait) {
				for (const el of bait) {
					let result = output[el.dataset.itemType];

					let tooltip = el.querySelector('.mousehuntTooltip');
					let extras = el.querySelector('.mousehuntTooltip__estimates') || document.createElement('div');
					extras.classList = 'mousehuntTooltip__estimates';

					let content = '';

					for (const recipeType in result) {
						content += `<br><b>${recipeTypeMap[recipeType]}</b>`;
						for (const calcType in result[recipeType]) {
							content += `<br>${calcTypeMap[calcType]}<br>`;
							content += `<div style="padding-left: 1.5ch;"><b>${result[recipeType][calcType].quantity.toLocaleString('en-US')}</b> ${result[recipeType][calcType].name}</div>`;
							content += `<div style="padding-left: 1.5ch;">${renderCraftableCost(result[recipeType][calcType].cost, result[recipeType][calcType].accounted)}</div>`;
						}
						content += `<br>`;
					}

					allRenders.push(content);

					extras.innerHTML = `
					---
					${content}
					`;

					tooltip.append(extras);
				}
			}

			return allRenders;
		}

		function renderTypeAsName(input) {
			// Remove undesired phrases
			input = input.replace(/_craft_item|_stat_item|_cheese/g, '');

			// Replace underscores with spaces
			input = input.replace(/_/g, ' ');

			// Uppercase the first letter of every word
			input = input.replace(/\b\w/g, function (letter) {
				return letter.toUpperCase();
			});

			return input;
		}

		function renderCraftableCost(items, accounted) {
			let out = '';
			for (const type in items) {
				let short = accounted[type] - items[type];
				out += `<i>(${items[type].toLocaleString('en-US')} ${renderTypeAsName(type)}`;
				if (short < 0) {
					out += `<br><span style="color: red;">${short.toLocaleString('en-US')}</span>`;
				}
				out += `)</i><br>`;
			}
			return out;
		}

		function renderTooltip(el, content) {
			if (el) {
				let tooltip = el.querySelector('.mousehuntTooltip');
				if (tooltip) {
					let extras = el.querySelector('.mousehuntTooltip__estimates') || document.createElement('div');
					extras.classList = 'mousehuntTooltip__estimates';
					extras.innerHTML = content;
					tooltip.append(extras);
				}
			}
		}

		function renderRoomLoot(loot, data) {
			let elCurrent, elNext;
			if (data.in_castle) {
				elCurrent = document.querySelector('.bountifulBeanstalkCastleView__plinthOverlay');
				elNext = document.querySelector('.headsUpDisplayBountifulBeanstalkView__castleChevronContainer');
			} else {
				elCurrent = document.querySelector('.bountifulBeanstalkClimbView__plinth');
				//elCurrent.style.zIndex = 'auto';
				//let chevron = document.querySelector('.bountifulBeanstalkClimbView__plinthChevron');
				//chevron.style.zIndex = 'auto';
				elNext = document.querySelector('.headsUpDisplayBountifulBeanstalkView__climbNextRoom');
			}

			let contentCurrent = '';
			let contentNext = '';

			// Loot for current room/zone
			if (loot.currentRoomOrZoneLoot.quantity > 0) {
				contentCurrent += `<b>${loot.currentRoomOrZoneLoot.quantity}</b> each with ${loot.currentRoomOrZoneLoot.hunts} catches.`;
			}

			// Loot for next room/zone
			if (data.castle.is_boss_chase == false && loot.nextRoomOrZoneLoot.quantity > 0) {
				contentNext += `<b>${loot.nextRoomOrZoneLoot.quantity}</b> each with ${loot.nextRoomOrZoneLoot.hunts} catches.`;
			}

			renderTooltip(elCurrent, contentCurrent);
			renderTooltip(elNext, contentNext);
		}

		function getSettings() {
			const defaults = {
				general: {
					enable_loot_estimate: true,
					enable_noise_estimate: true,
					include_previous_costs: false,
				},

				// Magic essence recipe?
				recipe: {
					beanster_cheese: true,
					lavish_beanster_cheese: true,
					leaping_lavish_beanster_cheese: true,
					royal_beanster_cheese: true,
				},
				// Ignore/Assume unlimited ingredients?
				ignore: {
					Gold: true,
					'Magic Essence': true,
					'Beanster Cheese': false,
					'Lavish Beanster Cheese': false,
					'Golden Harp String': false,
				},
			};

			let settings = Object.assign({}, defaults);
			let storage = JSON.parse(localStorage.getItem('squash-beans'));
			if (storage) {
				Object.assign(settings.general, storage.general ?? {});
				Object.assign(settings.recipe, storage.recipe ?? {});
				Object.assign(settings.ignore, storage.ignore ?? {});
			}

			return settings;
		}

		function setupSettingsDialog(renders) {
			// Configuration dialog
			const button = document.querySelector('.headsUpDisplayBountifulBeanstalkView__bean-counter-button') || document.createElement('a');
			button.style = `position: absolute; z-index: 21; left: 160px; top: 15px; font-size: 18px; font-weight: bold; color: #fa822d; text-shadow: 1px 1px #000;`;
			button.innerText = '⚙';
			button.classList = 'headsUpDisplayBountifulBeanstalkView__bean-counter-button';
			button.title = 'Bean Counter HUD Settings';
			button.onclick = () => {
				let dialog = new jsDialog();
				dialog.setTemplate('ajax');
				dialog.setIsModal(true);
				dialog.addToken('{*prefix*}', '<h2 class="title">Bean Counter HUD Settings</h2>');
				let settings = getSettings();

				// Save settings on checkbox change - also do interface refresh to update calculation preview
				let saveSettings = `localStorage.setItem('squash-beans', JSON.stringify(Array.from(document.querySelector('.jsDialog form').elements).filter(e=>e.type==='checkbox').reduce((d,e)=>(g=e.name.split('.'),d[g[0]]||(d[g[0]]={}),d[g[0]][g[1]]=e.checked,d),{})));  hg.utils.PageUtil.refresh();`;

				// Settings form
				let content = ``;
				content += `<form style="display: flex;">`;

				content += `<div style="padding: 1em;">`;
				content += `<h3>Use Magic Essence Recipe?</h3>`;
				for (const key in settings.recipe) {
					let label = key.replace(/_/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
					content += `<p><label><input type="checkbox" name="recipe.${key}" value="1" ${settings.recipe[key] ? 'checked' : ''} onchange="${saveSettings}"> ${label} </label></p>`;
				}
				content += `</div>`;

				content += `<div style="padding: 1em;">`;
				content += `<h3>Assume Unlimited Ingredient?</h3>`;
				for (const key in settings.ignore) {
					content += `<p><label><input type="checkbox" name="ignore.${key}" value="1" ${settings.ignore[key] ? 'checked' : ''} onchange="${saveSettings}"> ${key} </label></p>`;
				}
				content += `</div>`;

				content += `<div style="padding: 1em;">`;
				content += `<h3>General</h3>`;
				content += `<p><label><input type="checkbox" name="general.enable_loot_estimate" value="1" ${settings.general.enable_loot_estimate ? 'checked' : ''} onchange="${saveSettings}"> Estimate max room/zone loot? </label></p>`;
				content += `<p><label><input type="checkbox" name="general.enable_noise_estimate" value="1" ${settings.general.enable_noise_estimate ? 'checked' : ''} onchange="${saveSettings}"> Estimate noise generated? </label></p>`;
				content += `<p><label><input type="checkbox" name="general.include_previous_costs" value="1" ${settings.general.include_previous_costs ? 'checked' : ''} onchange="${saveSettings}"> Tally crafting costs from prior recipes? </label></p>`;
				content += `</div>`;

				content += `</form>`;

				// Calculation preview
				content += `<div class="headsUpDisplayBountifulBeanstalkView__bean-counter-dialog-preview" style="display: flex; border-top: 1px solid lightgrey;">`;
				for (const render of renders) {
					content += `<div style="padding: 1em;">${render}</div>`;
				}
				content += `</div>`;

				content += `<div style="padding: 1em;">`;
				content += `<p>Checking unlimited ingredient will behave as though you have an unlimited amount for any recipes that use it and determine the max-craftable based on the other ingredients. </p>`;
				content += `<p>Checking tally prior crafting costs will add up the costs of any uncrafted ingredients from prior recipes in addition to the current recipe. </p>`;
				content += `<p>Ingredient numbers shown in red indicate how much of that ingredient you're missing and cannot craft using one of the prior cheese recipes. </p>`;
				content += `</div>`;

				content += `</form>`;

				dialog.addToken('{*content*}', content);
				dialog.addToken('{*suffix*}', `<input class="jsDialogClose" type="button" value="Close">`);
				dialog.show();
			};
			document.querySelector('.headsUpDisplayBountifulBeanstalkView').append(button);
		}

		function update(data) {
			const itemsOwned = data.items;
			const cheeseRecipes = {
				beanster_cheese: data.beanster_recipe,
				lavish_beanster_cheese: data.lavish_beanster_recipe,
				leaping_lavish_beanster_cheese: data.leaping_lavish_beanster_recipe,
				royal_beanster_cheese: data.royal_beanster_recipe,
			};

			let settings = getSettings();
			let ignoreItems = Object.entries(settings.ignore)
				.filter(([key, value]) => value === true)
				.map(([key]) => key); //['Magic Essence', 'Gold', 'Beanster Cheese'];

			// Add room/zone loot to tooltips
			if (settings.general.enable_loot_estimate) {
				renderRoomLoot(calculatePossibleLoot(data), data);
			}

			// Add cheese crafting calculations to tooltips
			let renders = renderCraftable(calculateAllCheeses(cheeseRecipes, itemsOwned, ignoreItems, settings));

			// Add projected noise to noise meter tooltip
			if (settings.general.enable_noise_estimate && data.in_castle && data.castle.is_boss_chase == false) {
				let el = document.querySelector('.bountifulBeanstalkCastleView__noiseMeter');
				if (el) {
					let content = calculateCatchesUntilMaxNoise(data);
					renderTooltip(el, content);
				}
			}

			// Add settings dialog/button
			setupSettingsDialog(renders);

			// If dialog is open, update the calculation preview
			let dialogPreview = document.querySelector('.headsUpDisplayBountifulBeanstalkView__bean-counter-dialog-preview');
			if (dialogPreview) {
				let content = ``;
				for (const render of renders) {
					content += `<div style="padding: 1em;">${render}</div>`;
				}
				dialogPreview.innerHTML = content;
			}
		}

		if (user?.environment_type == 'bountiful_beanstalk') {
			update(user.enviroment_atts);
		}

		eventRegistry.addEventListener(
			'ajax_response',
			(response) => {
				if (response?.user?.environment_type == 'bountiful_beanstalk') {
					update(response.user.enviroment_atts);
				}
			},
			null,
			false,
			1
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
