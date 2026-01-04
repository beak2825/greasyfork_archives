// ==UserScript==
// @name         functional market for dh3
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  lol4
// @author       shtos
// @match        dh3.diamondhunt.co
// @match        file:///D:/DOWNLOAD/cache/client.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407472/functional%20market%20for%20dh3.user.js
// @updateURL https://update.greasyfork.org/scripts/407472/functional%20market%20for%20dh3.meta.js
// ==/UserScript==

(function() {
	'use strict';
	// setup on login
	const oldPopulate = window.populateMarketTable;
	var marketSettings = handleStorage('load');
	if (typeof marketSettings.bonemealPrice == 'undefined') {
		marketSettings.bonemealPrice = 0;
	}
	if (typeof marketSettings.highlight == 'undefined') {
		marketSettings.highlight = {};
	}
	if (typeof marketSettings.enableHighlight == 'undefined') {
		marketSettings.enableHighlight = false;
	}
	marketSettings.items = [];
	marketSettings.categories = {};
	marketSettings.normalSearchActive = false;
	marketSettings.presetActive = false;
	marketSettings.customPresets.forEach((preset) => (preset.active = false));
	handleStorage(0, marketSettings);
	const heatPerLog = {
		logs: 1,
		oakLogs: 2,
		willowLogs: 3,
		bambooLogs: 4,
		mapleLogs: 5,
		lavaLogs: 6,
		pineLogs: 7,
		stardustLogs: 8
	};
	const BONES = { bones: 1, ashes: 2, iceBones: 3 };
	// wrapper around old populateMarketTable function
	window.populateMarketTable = function() {
		oldPopulate();
		createElements();
		calculatePrice();
		checkIfCheapest();
		filterItems();
	};
	// resizing and adding item count to tradables dialogue
	document.querySelectorAll('[id*=market-slot-] > div').forEach((slot) => {
		slot.firstElementChild.onclick = () => {
			addItemSlotButton(slot.parentElement.id.split('-')[3]);
			nicerDialogue();
		};
	});
	function nicerDialogue() {
		document.querySelector('#dialogue-tradables').style.maxWidth = '76%';
		document.querySelector('#dialogue-tradables').style.marginTop = '150px';
		document.querySelector('#dialogue-tradables').style.marginLeft = '-22%';
		Array.from(document.querySelector('#dialogue-tradables-section').children).forEach((section) => {
			section.style.padding = '5px';
			section.style.margin = '3px';
			Array.from(section.children).forEach((subsection) => {
				subsection.style.position = 'relative';
				let img = subsection.firstElementChild.src;
				let item = img.substring(img.indexOf('images/') + 7, img.indexOf('.png'));
				let span = document.createElement('span');
				span.textContent = window[`var_${item}`] || 0;
				span.style = `font-size: 10pt;color: white; position: absolute; left: 0px; bottom: 0px;text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;`;
				subsection.appendChild(span);
			});
		});
	}

	// creating buttons in market tab
	function addMarketButtons() {
		// checking if global_global_TradablesData has any data in it
		if (window.global_TradablesData.length > 0) {
			let div = document.createElement('div');
			div.id = 'dialogue-marketRightClick';
			document.getElementById('body').append(div);
			let categories = new Set(window.global_TradablesData.map((item) => item.category));
			categories.forEach((category, index) => {
				let picture;
				// filtering items per category set by smitty
				window.global_TradablesData
					.filter((item) => {
						return item.category === category;
					})
					.forEach((filtered, i) => {
						if (typeof marketSettings.categories[category] === 'undefined') {
							marketSettings.categories[category] = {
								items: [],
								active: false
							};
						}
						marketSettings.categories[category].items.push(
							filtered.itemName.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
						);
						// grabbing first item for preset image
						if (i === 0) {
							picture = filtered.itemName;
						}
					});
				let button = document.createElement('button');
				button.style.background = '#393e46';
				button.style.border = '1px solid #eeeeee';
				button.style.marginLeft = '1px';
				button.style.marginBottom = '1px';
				if (category === 'misc') {
					marketSettings.categories[category].items[2] = 'stardust x 1000';
				}
				button.id = 'market-category-' + category;
				button.onclick = () => {
					//if (!marketSettings.normalSearchActive){
					if (!marketSettings.items.includes(marketSettings.categories[category].items[0])) {
						handleFilter(button, marketSettings.categories[category].items, 'add');
					} else {
						handleFilter(button, marketSettings.categories[category].items, 'remove');
					}
					marketSettings.categories[category].active = !marketSettings.categories[category].active;
					if (marketSettings.items.length !== 0) {
						marketSettings.presetActive = true;
					} else {
						marketSettings.presetActive = false;
					}
					handleStorage(0, marketSettings);
					filterItems();
					//}
				};
				button.innerHTML = `<img src="images/${picture}.png" style="height:32px;width:32px"/>`;
				document.getElementById('market-sort-buttons-wrapper').appendChild(button);
			});
			window.global_TradablesData.forEach((data, index) => {
				// making exception for stardust pack, because theyre named differently for some reason :shrug:
				let name;
				if (data.itemName == 'stardust1000') {
					name = 'stardust x 1000';
				} else {
					name = data.itemName.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
				}
				let button = document.createElement('button');
				button.id = 'market-button-' + camelize(name);
				button.style.background = '#393e46';
				button.style.border = '1px solid #eeeeee';
				button.style.marginLeft = '1px';
				button.style.marginBottom = '1px';
				button.oncontextmenu = (event) => {
					event.preventDefault();
					//window.addItemSlotButtonSelectItemChangeLimits(index);
					openMarketDialogue(event, name);
				};
				button.onclick = () => {
					// checking if array already has selected item
					let check = marketSettings.items.filter((item) => item === name);
					// adding selecting item to filter list
					//if (!marketSettings.presetActive){
					if (check.length === 0) {
						handleFilter(button, name, 'add');
					} else {
						handleFilter(button, name, 'remove');
					}
					if (marketSettings.items.length === 0) {
						marketSettings.normalSearchActive = false;
					} else {
						marketSettings.normalSearchActive = true;
					}
					handleStorage(0, marketSettings);
					filterItems();
				};
				//}
				// adding image of item to a button
				button.innerHTML = `<img src="images/${data.itemName}.png" style="height:32px;width:32px"/>`;
				document.getElementById('market-buttons-xd').appendChild(button);
			});
		} else {
			setTimeout(addMarketButtons, 500);
		}
	}
	// filtering items 'logic'
	function filterItems() {
		// reseting display of items
		document.querySelectorAll('#market-table > tbody')[0].childNodes.forEach((listing) => {
			listing.style.display = 'none';
		});
		// filtering items to only show selected ones
		if (marketSettings.items.length !== 0) {
			marketSettings.items.forEach((item) => {
				Array.from(document.querySelectorAll('#market-table > tbody')[0].childNodes)
					.filter((listing) => {
						return listing.childNodes[0].childNodes[0].textContent.toLowerCase() === item;
					})
					.forEach((filtered, index) => {
						// showing only x cheapest listings
						index < marketSettings.numberOfItems ? (filtered.style.display = '') : null;
					});
			});
		} else {
			// if there is no items in filterList, show everything
			document.querySelectorAll('#market-table > tbody')[0].childNodes.forEach((listing) => {
				listing.style.display = '';
			});
		}
		checkIfCheapest();
	}
	function handleFilter(button, stuff, action) {
		if (action == 'add') {
			if (marketSettings.multiFilter) {
				if (Array.isArray(stuff)) {
					marketSettings.items = [ ...marketSettings.items, ...stuff ];
				} else {
					marketSettings.items.push(stuff);
				}
			} else {
				if (Array.isArray(stuff)) {
					marketSettings.items = [ ...stuff ];
				} else {
					marketSettings.items = [];
					marketSettings.items[0] = stuff;
				}
			}
		} else if (action == 'remove') {
			if (Array.isArray(stuff)) {
				let temp = marketSettings.items.filter((item) => !stuff.includes(item));
				marketSettings.items = [ ...temp ];
			} else {
				marketSettings.items = marketSettings.items.filter((item) => item !== stuff);
			}
		}
		colorButtons(button);
	}

	function colorButtons(button) {
		if (button == 'reset') {
			document.querySelectorAll('#market-preset-wrapper > div').forEach((div, index) => {
				div.querySelectorAll('button')[1].style.background = '#E16B62';
				marketSettings.customPresets[index].active = false;
			});
			document.querySelectorAll('#market-table > tbody')[0].childNodes.forEach((listing) => {
				listing.style.display = '';
			});
			document.querySelectorAll('#market-sort-buttons-wrapper > button').forEach((button, index) => {
				button.style.background = '#393e46';
			});
			document.querySelectorAll('#market-buttons-xd > button').forEach((button, index) => {
				index > 0 ? (button.style.background = '#393e46') : null;
			});
			for (let category in marketSettings.categories) {
				marketSettings.categories[category].active = false;
			}
		} else if (button.id.includes('category')) {
			let category = button.id.split('-')[2];
			if (!marketSettings.categories[category].active) {
				color(button, 'category', category, '#eeeeee');
			} else {
				color(button, 'category', category, '#393e46');
			}
		} else if (button.id.includes('custom')) {
			let index = button.id.split('-')[2];
			if (!marketSettings.customPresets[index].active) {
				color(button, 'custom', index, '#eeeeee', '#83EA6C');
			} else {
				color(button, 'custom', index, '#393e46', '#E16B62');
			}
		}
		document.querySelectorAll('#market-buttons-xd > button').forEach((button, index) => {
			index > 0 ? (button.style.background = '#393e46') : null;
		});
		marketSettings.items.forEach((name) => {
			document.querySelector('#market-button-' + camelize(name)).style.background = '#eeeeee';
		});
	}

	function color(button, type, thing, color, secondaryColor) {
		if (!marketSettings.multiFilter) {
			document.querySelectorAll('#market-preset-wrapper > div').forEach((div, index) => {
				div.querySelectorAll('button')[1].style.background = '#E16B62';
				if (div.querySelectorAll('button')[1].id != button.id) {
					marketSettings.customPresets[index].active = false;
				}
			});
			document.querySelectorAll('#market-sort-buttons-wrapper > button').forEach((button, index) => {
				button.style.background = '#393e46';
			});
			for (let category in marketSettings.categories) {
				if (!button.id.includes(category)) {
					marketSettings.categories[category].active = false;
				}
			}
		}
		if (type == 'category') {
			button.style.background = color;
		} else if (type == 'custom') {
			button.style.background = secondaryColor;
		}
	}

	// creating main cointainers for items
	function createElements() {
		// checking if wrapper element doesnt exist)
		if (!$('#market-buttons-bigger-wrapper').length) {
			// main div container
			$('#market-buttons-section').after(
				`<div id="market-buttons-bigger-wrapper" style="display: flex; align-items: center; flex-direction: row; justify-content: center; align-items: baseline;"></div>`
			);
			// go up button
			$('#navigation-right-market').append(
				`<div id="scroll-market-button" style="position:fixed; top: 90vh; left: 1.3vw;background:#c99024; border:1px solid black; border-radius:50%;cursor:pointer;"><img src="https://img.icons8.com/windows/32/000000/home.png"></div>`
			);
			// left panel, custom presets
			$('#market-buttons-bigger-wrapper').append(`<div id="market-preset-wrapper" style="margin-right: 20px">
    <div id="market-preset-0" style="display: flex; flex-direction: row">
        <button>Save</button>
        <input style="width: 100px">
    <button style="background: #E16B62">Set</button>
</div>
<div id="market-preset-1" style="display: flex; flex-direction: row">
        <button>Save</button>
        <input style="width: 100px">
    <button style="background: #E16B62">Set</button>
</div><div id="market-preset-2" style="display: flex; flex-direction: row">
        <button>Save</button>
        <input style="width: 100px">
    <button style="background: #E16B62">Set</button>
</div><div id="market-preset-3" style="display: flex; flex-direction: row">
        <button>Save</button>
        <input style="width: 100px">
    <button style="background: #E16B62">Set</button>
</div><div id="market-preset-4" style="display: flex; flex-direction: row">
        <button>Save</button>
        <input style="width: 100px">
    <button style="background: #E16B62">Set</button>
</div></div>`);
			//wraper of middle buttons, all individual items
			$('#market-buttons-bigger-wrapper').append(
				`<div id="market-buttons-wrapper" style="display: flex; align-items: center; flex-direction: column;"></div>`
			);
			// settings div
			$('#market-buttons-bigger-wrapper').before(
				`<center><div id="market-buttons-settings" style="background: #222831; margin: 20px 0px 20px 0px; border-radius: 3px; align-items: center; display: flex; flex-direction: column; width: 250px; border: 1px solid #eeeeee;"></div></center>`
			);
			// settings elements
			$('#market-buttons-settings')
				.append(`<div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 5px;">
							<span style="margin-right: 5px">Number of items to show: </span>
							<input id="market-buttons-amount" style="width: 25px; margin-right: 5px" min="1" max="99">
						 </div>
						 <div style="display: flex; flex-direction: row; margin-bottom: 5px;">
						 	<span style="margin-right: 5px">Desired bonemeal price: </span>
						 	<input id="bonemeal-price" style="width: 40px; margin-right: 5px">
						 </div>
						 <button style="width: 160px; height: 30px; font-size: 18px; margin-bottom: 5px; font-weight: bold;" id="filter-check">Multifilter</button>
						 <button style="width: 160px; height: 30px; font-size: 18px; margin-bottom: 5px; font-weight: bold;" id="highlight-check">Only Highlighted</button>
						`);
			//			  			 <span style="margin-right: 5px">Filter multiple items: </span>
			//<input id="filter-check" type="checkbox">
			// right panel, category presets
			$('#market-buttons-bigger-wrapper').append(
				'<div id="market-sort-buttons-wrapper" style="width: 210px; display: flex; align-items: center; flex-direction: row; flex-wrap:wrap;"></div>'
			);
			// events for custom presets
			document.querySelectorAll('#market-preset-wrapper > div').forEach((div, index) => {
				let saveButton = div.children[0];
				let input = div.children[1];
				let setButton = div.children[2];
				saveButton.onclick = () => {
					marketSettings.customPresets[index].name = input.value;
					marketSettings.customPresets[index].items = [ ...marketSettings.items ];
					handleStorage(0, marketSettings);
				};
				input.value = marketSettings.customPresets[index].name;
				setButton.id = 'set-custom-' + index;
				setButton.onclick = () => {
					//if (!marketSettings.presetActive){
					if (!marketSettings.customPresets[index].active) {
						handleFilter(setButton, marketSettings.customPresets[index].items, 'add');
					} else {
						handleFilter(setButton, marketSettings.customPresets[index].items, 'remove');
					}
					marketSettings.customPresets[index].active = !marketSettings.customPresets[index].active;
					if (marketSettings.items.length === 0) {
						marketSettings.normalSearchActive = false;
					} else {
						marketSettings.normalSearchActive = true;
					}
					handleStorage(0, marketSettings);
					filterItems();
				};
				//}
			});
			document.getElementById('scroll-market-button').onclick = () => {
				window.scrollTo({
					top: 500,
					left: 0,
					behavior: 'smooth'
				});
			};
			document.getElementById('market-buttons-amount').value = marketSettings.numberOfItems;
			document.getElementById('market-buttons-amount').onkeyup = (event) => {
				marketSettings.numberOfItems = event.target.value;
				filterItems();
				handleStorage(0, marketSettings);
			};
			document.getElementById('bonemeal-price').value = marketSettings.bonemealPrice;
			document.getElementById('bonemeal-price').onkeyup = (event) => {
				marketSettings.bonemealPrice = event.target.value;
				filterItems();
				handleStorage(0, marketSettings);
			};
			document.getElementById('filter-check').style.backgroundColor = marketSettings.multiFilter
				? 'green'
				: 'red';
			document.getElementById('filter-check').onclick = (event) => {
				event.preventDefault();
				marketSettings.multiFilter = !marketSettings.multiFilter;
				if (!marketSettings.multiFilter) {
					if (marketSettings.items.length > 0) {
						marketSettings.items = [];
						filterItems();
						colorButtons('reset');
					}
				}
				handleStorage(0, marketSettings);
				document.getElementById('filter-check').style.backgroundColor = marketSettings.multiFilter
					? 'green'
					: 'red';
			};
			document.getElementById('highlight-check').style.backgroundColor = marketSettings.enableHighlight
				? 'green'
				: 'red';
			document.getElementById('highlight-check').onclick = (event) => {
				event.preventDefault();
				marketSettings.enableHighlight = !marketSettings.enableHighlight;
				filterItems();
				handleStorage(0, marketSettings);
				document.getElementById('highlight-check').style.backgroundColor = marketSettings.enableHighlight
					? 'green'
					: 'red';
			};
			// document.getElementById('filter-check').checked = marketSettings.multiFilter ? true : false;
			// document.getElementById('filter-check').onclick = (event) => {
			// 	if (event.target.checked) {
			// 		marketSettings.multiFilter = true;
			// 		handleStorage(0, marketSettings);
			// 	} else {
			// 		marketSettings.multiFilter = false;
			// 		if (marketSettings.items.length > 0) {
			// 			marketSettings.items = [];
			// 			filterItems();
			// 			colorButtons('reset');
			// 		}
			// 		handleStorage(0, marketSettings);
			// 	}
			// };
			$('#market-buttons-wrapper').append(
				`<div id="market-buttons-xd" style="width: 45vw; display: flex; justify-center:center; flex-wrap: wrap"></div>`
			);
			let button = document.createElement('button');
			button.innerHTML = `<img src="/images/back.png" style="height:32px;width:32px"/>`;
			button.style.border = '1px solid #eeeeee';
			button.style.marginLeft = '1px';
			button.style.marginBottom = '1px';
			// adding clear button
			button.onclick = () => {
				marketSettings.items = [];
				marketSettings.presetActive = false;
				marketSettings.normalSearchActive = false;
				handleStorage(0, marketSettings);
				colorButtons('reset');
			};
			$('#market-buttons-xd').append(button);
		}
		// checking if market buttons exist
		if (document.querySelectorAll('#market-buttons-xd > button').length < 2) {
			addMarketButtons();
		}
	}
	function calculatePrice() {
		let array = Array.from(document.querySelectorAll('#market-table > tbody')[0].childNodes);
		let boneCheapest = 100000000,
			rawCheapest = 100000000,
			cookedCheapest = 100000000,
			logsCheapest = 100000000;
		let boneElement = [],
			rawElement = [],
			cookedElement = [],
			logsElement = [];
		for (const listing of array) {
			let category = listing.childNodes[4].textContent.toLowerCase();
			if (
				![ 'bonemeal', 'raw food', 'raw fish', 'cooked fish', 'logs', 'armour', 'food', 'seeds' ].includes(
					category
				)
			) {
				continue;
			} else {
				let name = camelize(listing.childNodes[0].childNodes[0].textContent);
				let price = parseInt(listing.childNodes[3].textContent.replace(/,/g, ''));
                let farmingEasyPerk = window.var_achFarmingEasyCompleted ? 1 : 0
                let farmingMediumPerk = window.var_achFarmingMediumCompleted ? 2 : 0
                let farmingHardPerk = typeof window.var_achFarmingHardCompleted != undefined ? window.var_achFarmingHardCompleted ? 3 : 0 : 0
                let farmingElitePerk = typeof window.var_achFarmingEliteCompleted != undefined ? window.var_achFarmingEliteCompleted ? 5 : 0 : 0
				let farmingResearch = window.var_researcherFarming > 2 ? 1.05 : 1;
				let farmingShinies = window.var_researcherFarming > 4 ? 1.1 : 1;
                let leafAverage = 3.5 + (farmingEasyPerk ? 1 : 0) + (farmingMediumPerk ? 2 : 0) + (farmingHardPerk ? 3 : 0) + (farmingElitePerk ? 5 : 0)
				let bonemeal = 0;
				let divider = 0;
				let i = document.createElement('i');
				i.style = 'color: gray; margin-left: 4px';
				switch (category) {
					case 'bonemeal':
						divider = BONES[name];
						i.textContent += (price / divider).toFixed(2);
						if (parseFloat(i.textContent) == boneCheapest) {
							boneElement.push(i);
						} else if (parseFloat(i.textContent) < boneCheapest) {
							boneElement = [];
							boneCheapest = i.textContent;
							boneElement.push(i);
						}
						break;
					case 'raw food':
					case 'raw fish':
						divider = window.global_foodMap.find((e) => e.rawFoodName === name).energy;
						i.textContent += (price / divider).toFixed(2);
						if (parseFloat(i.textContent) == rawCheapest) {
							rawElement.push(i);
						} else if (parseFloat(i.textContent) < rawCheapest) {
							rawElement = [];
							rawCheapest = i.textContent;
							rawElement.push(i);
						}
						break;
					case 'food':
					case 'cooked fish':
						divider = window.global_foodMap.find((e) => e.cookedFoodName === name).energy;
						i.textContent += (price / divider).toFixed(2);
						if (parseFloat(i.textContent) == cookedCheapest) {
							cookedElement.push(i);
						} else if (parseFloat(i.textContent) < cookedCheapest) {
							cookedElement = [];
							cookedCheapest = i.textContent;
							cookedElement.push(i);
						}
						break;
					case 'logs':
						divider = heatPerLog[name];
						i.textContent += (price / divider).toFixed(2);
						if (parseFloat(i.textContent) == logsCheapest) {
							logsElement.push(i);
						} else if (parseFloat(i.textContent) < logsCheapest) {
							logsElement = [];
							logsCheapest = i.textContent;
							logsElement.push(i);
						}
						break;
					case 'armour':
						switch (name) {
							case 'snakeskin':
							case 'batSkin':
								i.textContent += calcSushi(name, price);
								break;
							case 'bearFur':
								i.textContent += (price / 30).toFixed(2);
								break;
							case 'polarBearFur':
								i.textContent += (price / 40).toFixed(2);
								break;
							case 'blackSilk':
								i.textContent += (price / 100).toFixed(2);
								break;
						}
						break;
					case 'seeds':
						bonemeal = window.global_seedMap[name].bonemeal * marketSettings.bonemealPrice;
						if (name.includes('Mushroom')) {
							i.textContent += ((price + bonemeal) / (15 * farmingResearch * farmingShinies)).toFixed(2);
						} else if (name.includes('Leaf')) {
							i.textContent += ((price + bonemeal) / (leafAverage * farmingResearch * farmingShinies)).toFixed(2);
						}
						break;
				}
				listing.childNodes[3].appendChild(i);
			}
		}
		boneElement.forEach((e) => {
			e.style.color = '#3EA01A';
			e.style.fontWeight = 'bold';
		});
		logsElement.forEach((e) => {
			e.style.color = '#3EA01A';
			e.style.fontWeight = 'bold';
		});
		cookedElement.forEach((e) => {
			e.style.color = '#3EA01A';
			e.style.fontWeight = 'bold';
		});
		rawElement.forEach((e) => {
			e.style.color = '#3EA01A';
			e.style.fontWeight = 'bold';
		});
	}
	function calcSushi(name, price) {
		let oven = getOvenType()
		typeof oven === 'undefined' ? (oven = 'bronzeOven') : null;
		let successRate = {
			bronzeOven: 0.5,
			ironOven: 0.6,
			silverOven: 0.7,
			goldOven: 0.8,
			promethiumOven: 0.9,
			titaniumOven: 1
		};
		if (window.var_researcherCooking > 1) {
			successRate[oven] += (1 - successRate[oven]) * 0.25;
		}
		if (window.var_researcherCooking > 2) {
			successRate[oven] += 0.0375;
		}
		successRate[oven] = successRate[oven].toFixed(4);
		let ratio;
		switch (name) {
			case 'snakeskin':
				ratio = 25;
				break;
			case 'batSkin':
				ratio = 75;
				break;
		}
		return (price / ratio * parseFloat(successRate[oven])).toFixed(2);
	}
	function checkIfCheapest() {
		if (window.global_TradablesData.length > 0) {
			document.querySelectorAll('#market-table > tbody')[0].childNodes.forEach((listing) => {
				let name =
					listing.childNodes[0].childNodes[0].textContent.toLowerCase() == 'stardust x 1000'
						? 'stardust1000'
						: camelize(listing.childNodes[0].childNodes[0].textContent);

				let price = parseInt(listing.childNodes[3].childNodes[0].textContent.replace(/,/g, ''));
				if (name !== 'stardust') {
                    try {
					if (price == window.global_TradablesData.find((e) => e.itemName === name).lowerLimit) {
						listing.style.background = 'rgba(63, 191, 63, 0.5)';
					} else if (price <= marketSettings.highlight[name] && marketSettings.highlight[name] != 0) {
						listing.style.background = '#53AEBC';
					}
					if (marketSettings.enableHighlight && !(price <= marketSettings.highlight[name])) {
						listing.style.display = 'none';
					}
                    }catch(err){
                        console.log('fuck pumpkin sigil')
                    }
					/*if (listing.onclick == null) {
						listing.style.display = 'none';
					}*/
				} else if (marketSettings.enableHighlight) {
					listing.style.display = 'none';
				}
			});
		} else {
			setTimeout(checkIfCheapest, 1000);
		}
	}
	function camelize(str) {
		return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
	}
	function decamelize(str, separator) {
		separator = typeof separator === 'undefined' ? ' ' : separator;
		return str
			.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
			.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
			.toLowerCase()
			.replace(/^\w/, (c) => c.toLowerCase());
	}
	function handleStorage(key, config) {
		if (key === 'load') {
			return localStorage.getItem('market-storage-settings-new') === null
				? {
						customPresets: [
							{ name: '', items: [], active: false },
							{ name: '', items: [], active: false },
							{ name: '', items: [], active: false },
							{ name: '', items: [], active: false },
							{ name: '', items: [], active: false }
						],
						presets: [],
						presetActive: false,
						normalSearchActive: false,
						items: [],
						numberOfItems: 20,
						multiFilter: false,
						hideNonMin: false,
						bonemealPrice: 0
					}
				: JSON.parse(localStorage.getItem('market-storage-settings-new'));
		} else {
			return localStorage.setItem('market-storage-settings-new', JSON.stringify(config));
		}
	}
	function openMarketDialogue(event, item) {
		// get item object from smitty, filter returns 1 item array so gotta select it with [0]
		//console.log(item);
		if (item == 'stardust x 1000') {
			item = 'stardust1000';
		}
		const tradable = global_TradablesData.filter((tradable) => tradable.itemName == camelize(item))[0];
		const name = tradable.itemName;
		const min = formatNumber(tradable.lowerLimit);
		const max = formatNumber(tradable.upperLimit);
		// main dialogue, everything goes here
		let wrapper = document.querySelector('#dialogue-marketRightClick');
		wrapper.style = `position: absolute; background-color: rgb(26, 26, 26); min-width: 200px; max-height: 400px; border: 2px solid #eeeeee; display: flex; flex-direction: column; align-items:center; padding: 20px; top: ${event.pageY -
			50}px; left: 38%; border-radius: 4px; `;
		// item image and item name header
		let header = document.createElement('div');
		header.style =
			'display: flex; flex-direction: column; max-height: 130px; align-items: center; margin-bottom: 15px;';
		let itemImage = document.createElement('img');
		itemImage.src = `images/${name}.png`;
		itemImage.className = 'img-100';
		let textNode = document.createElement('span');
		textNode.textContent = tradable.itemName;
		header.append(itemImage, textNode);
		// market limits div
		let limitsDiv = document.createElement('div');
		limitsDiv.style = 'display: flex; flex-direction: row; margin-bottom: 15px;';
		let currentText = document.createElement('span');
		currentText.textContent = 'Current limits: ';
		let coinImage = document.createElement('img');
		coinImage.src = 'images/coins.png';
		coinImage.className = 'img-30';
		let minPrice = document.createElement('span');
		minPrice.textContent = min + ' - ';
		let maxPrice = document.createElement('span');
		maxPrice.textContent = max;
		limitsDiv.innerHTML =
			currentText.outerHTML + coinImage.outerHTML + minPrice.outerHTML + coinImage.outerHTML + maxPrice.outerHTML;
		// personal price highlight threshold selection
		let highlightDiv = document.createElement('div');
		highlightDiv.style = 'display: flex; flex-direction: row; margin-bottom: 15px;';
		let highlightText = document.createElement('span');
		highlightText.textContent = 'Price threshold to highlight: ';
		let highlightInput = document.createElement('input');
		highlightInput.id = 'market-highlight-input';
		highlightInput.style = 'width: 100px; margin-left: 3px;';
		highlightInput.type = 'number';
		highlightDiv.innerHTML = highlightText.outerHTML + highlightInput.outerHTML;
		// create close button
		let closeButton = document.createElement('button');
		closeButton.id = 'market-close-button';
		closeButton.textContent = 'Close';
		closeButton.style =
			'background-color: #4e9af1; padding:0.3em 1.2em; margin:0 0.1em 0.1em 0; border:0.16em solid #4e9af1; border-radius:2em; box-sizing: border-box; text-decoration:none; font-family:"Roboto",sans-serif; font-weight:300; color:#FFFFFF; text-shadow: 0 0.04em 0.04em rgba(0,0,0,0.35); text-align:center; transition: all 0.2s;';
		// append everything to wrapper
		wrapper.innerHTML = header.outerHTML + limitsDiv.outerHTML + highlightDiv.outerHTML + closeButton.outerHTML;
		// add event listeners
		document.querySelector('#market-close-button').onmouseenter = () => {
			document.querySelector('#market-close-button').style.borderColor = 'rgba(255,255,255,1)';
		};
		document.querySelector('#market-close-button').onmouseleave = () => {
			document.querySelector('#market-close-button').style.borderColor = '#4e9af1';
		};
		document.querySelector('#market-close-button').onclick = () => {
			$(wrapper).hide();
		};
		document.querySelector('#market-highlight-input').value = marketSettings.highlight[name] || 0;
		document.querySelector('#market-highlight-input').onkeyup = (e) => {
			console.log('lol');
			e.preventDefault();
			marketSettings.highlight[name] = e.target.value;
			filterItems();
			handleStorage(0, marketSettings);
		};
	}
})();
