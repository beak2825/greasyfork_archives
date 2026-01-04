// ==UserScript==
// @name         Filter Median XL Runewords
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter runewords at https://docs.median-xl.com/doc/items/runewords
// @author       You
// @match        https://docs.median-xl.com/doc/items/runewords
// @icon         https://www.google.com/s2/favicons?sz=64&domain=median-xl.com
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461722/Filter%20Median%20XL%20Runewords.user.js
// @updateURL https://update.greasyfork.org/scripts/461722/Filter%20Median%20XL%20Runewords.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let selectedRunes = {}
	let minimumLevel = 0
	let maximumLevel = 120

	let loadStorage = function () {
		let raw = localStorage.getItem('selectedRunes')
		selectedRunes = JSON.parse(raw ? raw : '[]');
		let rawMinLevel = localStorage.getItem('minimumLevel')
		minimumLevel = rawMinLevel ? parseInt(rawMinLevel) : 0;
		let rawMaxLevel = localStorage.getItem('maximumLevel')
		maximumLevel = rawMaxLevel ? parseInt(rawMaxLevel) : 120;
	}

	let getURLText = (uri) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", uri, false);
		xhr.send();
		let el = document.createElement( 'html' );
		el.innerHTML = xhr.response
		return el
	}

	let getRunewords = () => {
		return getURLText("https://docs.median-xl.com/doc/items/runewords");
	}

	let getRunes = () => {
		return getURLText("https://docs.median-xl.com/doc/items/socketables");
	}

	let trimRune = (rune) => rune.trim().replaceAll('\'', '')

	let getRuneGroup = (firstRune) => {
		let runesRaw = getRunes()
		let socketables = runesRaw.querySelectorAll('td > span.item-eruneword')
		let elRune = null;
		let runes = [];

		for (let socketable of socketables.values()) {
			let rune = trimRune(socketable.innerText)
			runes.push(rune);

			if (rune == firstRune) {
				elRune = socketable
				break;
			}
		}

		if (!elRune) {
			console.log('Missing ' + firstRune + ' rune group')
		}

		return elRune.parentNode.parentNode.parentNode;
	}

	let getRuneNames = () => {
		let rawRunes = [
			getRuneGroup('El'),
			getRuneGroup('Ol'),
			getRuneGroup('Taha'),
			getRuneGroup('Fire'),
		];

		let runeNames = []

		for (let tbody of rawRunes) {
			let runes = tbody.childNodes.values()
			let runesTD = []

			for (let socketable of runes) {
				if (socketable.nodeName == 'TR') {
					runesTD.push(socketable)
				}
			}

			for (let socketable of runesTD) {
				if (socketable.childNodes.length < 4) {
					//console.log('Missing socketable name element');
				}

				if (socketable.childNodes[3].childNodes.length < 2) {
					//console.log('Missing socketable actual name element');
				}

				runeNames.push(socketable.childNodes[3].childNodes[1].innerText.trim())
			}
		}

		return runeNames;
	}

	let runeNames = getRuneNames();

	let allRunesWordTRs = Array.from(document.querySelectorAll('td > span.item-runeword')).map(i => i.parentNode.parentNode)

	let filterRunewords = (runes) => {
		for (let runeWord of allRunesWordTRs.values()) {
			runeWord.style.display = "table-row"
		}

		function changeByRunes(RunewordsTRs) {
			let runewordsTRs = []
			if (runes.length == 0) {
				return RunewordsTRs
			}

			function getRunewordTD(runeWord) {
				function getRunewordTDInternal(td) {
					for (let span of td.childNodes.values()) {
						if (span.nodeName == 'SPAN' && span.className == 'item-runeword') {
							return span
						}
					}
					return undefined
				}

				for (let td of runeWord.childNodes.values()) {
					if (td.nodeName == 'TD' && td.className == 'item-name') {
						let span = getRunewordTDInternal(td)
						if (span) {
							return span
						}
					}
				}
				console.log('td.item-name not found for ' + runeWord)
				return undefined
			}

			for (let runeWord of RunewordsTRs.values()) {
				let runewordTD = getRunewordTD(runeWord)
				if (!runewordTD) {
					console.log('runewordTD not found for ' + runeWord)
					continue
				}
				let runes = trimRune(runewordTD.innerText).split(/(?=[A-Z])/)
				let diff = runes.filter(i => !selectedRunes.includes(i))

				if (diff.length != 0) {
					runeWord.style.display = "none"
					continue
				}
				runewordsTRs.push(runeWord)
			}

			return runewordsTRs
		}

		let shownTRs = changeByRunes(allRunesWordTRs)

		function changeByLevel(RunewordsTRs) {
			let runewordsTRs = []

			function getItemLevelTD(runeWord) {
				for (let td of runeWord.childNodes.values()) {
					if (td.nodeName == 'TD' && td.className == 'item-level') {
						let requiredLevel = parseInt(td.innerText.trim())
						if (isNaN(requiredLevel)) {
							console.log('requiredLevel is NaN for ' + runeWord)
							return undefined
						}
						return requiredLevel

					}
				}
				console.log('td.item-level not found for ' + runeWord)
				return undefined
			}

			for (let runeWord of RunewordsTRs.values()) {
				let requiredItemLevel = getItemLevelTD(runeWord)
				if (!requiredItemLevel) {
					console.log('itemlevelTD not found for ' + runeWord)
					continue
				}
				if (requiredItemLevel < minimumLevel || requiredItemLevel > maximumLevel) {
					runeWord.style.display = "none"
					continue
				}
				runewordsTRs.push(runeWord)
			}

			return runewordsTRs
		}

		shownTRs = changeByLevel(shownTRs)
	}

	const mainDiv = document.createElement('div')
	mainDiv.id = 'myContainer'

	function getRuneRealName(runeName) {
		switch(runeName) {
			case "Fire":
				runeName = "Ign"
				break
			case "Stone":
				runeName = "Sil"
				break
			case "Arcane":
				runeName = "Arc"
				break
			case "Poison":
				runeName = "Ven"
				break
			case "Light":
				runeName = "Ful"
				break
			case "Ice":
				runeName = "Gla"
				break
		}
		return runeName
	}

	function getMinimumLevelRequirement() {
		return minimumLevel.toString();
	}

	function saveSelectedRunes() {
		localStorage.setItem('selectedRunes', JSON.stringify(selectedRunes));
	}

	let showUI2 = () => {
		function createRuneGrid() {
			const grid = document.createElement('div');
			grid.className = 'grid'
			let columns = 10
			let rows = Math.ceil(runeNames.length / columns)
			let index = 0;

			for (var i = 0; i < columns; ++i) {
				if (i * rows >= runeNames.length) {
					break
				}

				var column = document.createElement('div'); // create column
				column.className = 'column';
				for (var j = 0; j < rows; ++j) {
					let nextIndex = j + i * rows

					if (nextIndex >= runeNames.length) {
						break
					}
//console.log(nextIndex)
					let runeName = runeNames[nextIndex]
					let runeRealName = getRuneRealName(runeName)

					let checkBox = document.createElement('input')
					checkBox.type = "checkbox";
					checkBox.checked = selectedRunes.indexOf(runeRealName) != -1
					checkBox.name = runeName;
					checkBox.value = runeName;
					checkBox.id = runeName;
					checkBox.className = 'rune-checkbox';
					checkBox.addEventListener('change', (event) => {
						if (event.currentTarget.checked) {
							selectedRunes.push(runeRealName);
						} else {
							selectedRunes = selectedRunes.filter(i => i != runeRealName)
						}
						saveSelectedRunes();
					});

					var label = document.createElement('label')
					label.htmlFor = runeName;
					label.appendChild(document.createTextNode(runeName));

					var row = document.createElement('div'); // create row
					row.className = 'row';
					row.appendChild(checkBox);
					row.appendChild(label);
					column.appendChild(row); // append row in column
				}

				if (i == columns - 1) {
					let resetButton = document.createElement('button');
					resetButton.id = 'reset-runes';
					resetButton.innerText = 'Reset';
					resetButton.addEventListener("click", (e) => {
						selectedRunes = []
						saveSelectedRunes()

						function resetRunes() {
							for (let checkbox of document.querySelectorAll('input.rune-checkbox').values()) {
								checkbox.checked = false
							}
						}

						resetRunes()
						filterRunewords([])
					}, false);
					column.appendChild(resetButton); // append row in column
				}

				grid.appendChild(column); // append column inside grid
			}
			return grid;
		}

		mainDiv.appendChild(createRuneGrid())

		function createLevelRequirements() {
			const levelRequirements = document.createElement('div');
			levelRequirements.className = 'lvlreq'

			let minLevel = document.createElement('input');
			minLevel.type = "text";
			minLevel.value = getMinimumLevelRequirement()

			function setMinimumLevel(nextMinimumLevel) {
				minimumLevel = nextMinimumLevel
				localStorage.setItem('minimumLevel', minimumLevel.toString());
				minLevel.value = getMinimumLevelRequirement()
			}

			minLevel.addEventListener('change', (event) => {
				let nextMinimumLevel = parseInt(event.currentTarget.value);
				if (isNaN(nextMinimumLevel) || nextMinimumLevel < 0 || nextMinimumLevel > 120) {
					nextMinimumLevel = minimumLevel
				}
				setMinimumLevel(nextMinimumLevel);
			})
			levelRequirements.appendChild(minLevel)

			let maxLevel = document.createElement('input');
			maxLevel.type = "text";
			maxLevel.value = maximumLevel.toString()

			function setMaximulLevel(nextMaximumLevel) {
				maximumLevel = nextMaximumLevel
				localStorage.setItem('maximumLevel', maximumLevel.toString());
				maxLevel.value = maximumLevel.toString()
			}

			maxLevel.addEventListener('change', (event) => {
				let nextMaximumLevel = parseInt(event.currentTarget.value);
				if (isNaN(nextMaximumLevel) || nextMaximumLevel < 0 || nextMaximumLevel > 120) {
					nextMaximumLevel = maximumLevel
				}
				setMaximulLevel(nextMaximumLevel);
			})
			levelRequirements.appendChild(maxLevel)

			let resetButton = document.createElement('button');
			resetButton.id = 'reset-lvls';
			resetButton.innerText = 'Reset';
			resetButton.addEventListener("click", (e) => {
				setMinimumLevel(0)
				setMaximulLevel(120)
			}, false);
			levelRequirements.appendChild(resetButton)

			return levelRequirements;
		}

		mainDiv.appendChild(createLevelRequirements())

		let button = document.createElement('button');
		button.id = 'filter-rw';
		button.innerText = 'Filter';
		button.addEventListener("click", (e) => {
			filterRunewords(selectedRunes)
		}, false);


		mainDiv.appendChild(button)

		GM_addStyle ( `
			#filter-rw {
				cursor:                 pointer;
				display: block;
			}
			.grid {
				display: flex;   /* <--- required */
			}

			.column {
				flex: 1; /* <--- required (style column to fill the same space as the other columns) */
			}

			.row {
				font-size: 15px;
			}
			` );
	}
	loadStorage()
	showUI2()

	let addUI = () => {
		if (document.querySelector('div.text_on_the_left > hr') == null) {
			setTimeout(addUI, "1000")
		} else {
			document.querySelector('div.text_on_the_left > hr').before(mainDiv)
		}
	}

	addUI()
})();