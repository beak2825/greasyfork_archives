// ==UserScript==
// @name         DH2 Fixed Altered
// @namespace    FileFace
// @description  Improve Diamond Hunt 2
// @version      0.41.4
// @author       Murdarains Altered Zorbing
// @grant        none
// @run-at       document-start
// @include      http://www.diamondhunt.co/game.php
// Zorbing did alot of work this is my altered version that other people prefer
// @downloadURL https://update.greasyfork.org/scripts/27841/DH2%20Fixed%20Altered.user.js
// @updateURL https://update.greasyfork.org/scripts/27841/DH2%20Fixed%20Altered.meta.js
// ==/UserScript==

(function ()
{
'use strict';



/**
 * observer
 */

let observedKeys = new Map();
/**
 * Observes the given key for change
 * 
 * @param {string} key	The name of the variable
 * @param {Function} fn	The function which is called on change
 */
function observe(key, fn)
{
	if (key instanceof Array)
	{
		for (let k of key)
		{
			observe(k, fn);
		}
	}
	else
	{
		if (!observedKeys.has(key))
		{
			observedKeys.set(key, new Set());
		}
		observedKeys.get(key).add(fn);
	}
	return fn;
}
function unobserve(key, fn)
{
	if (key instanceof Array)
	{
		let ret = [];
		for (let k of key)
		{
			ret.push(unobserve(k, fn));
		}
		return ret;
	}
	if (!observedKeys.has(key))
	{
		return false;
	}
	return observedKeys.get(key).delete(fn);
}
function updateValue(key, newValue)
{
	if (window[key] === newValue)
	{
		return false;
	}

	const oldValue = window[key];
	window[key] = newValue;
	(observedKeys.get(key) || []).forEach(fn => fn(key, oldValue, newValue));
	return true;
}



/**
 * global constants
 */

const tierLevels = ['empty', 'sapphire', 'emerald', 'ruby', 'diamond'];
const tierNames = ['Standard', 'Sapphire', 'Emerald', 'Ruby', 'Diamond'];
const tierItemList = ['pickaxe', 'shovel', 'hammer', 'axe', 'rake', 'fishingRod'];
const furnaceLevels = ['stone', 'bronze', 'iron', 'silver', 'gold'];
const furnaceCapacity = [10, 30, 75, 150, 300];
const ovenLevels = ['bronze', 'iron', 'silver', 'gold'];
const maxOilStorageLevel = 4; // 7
const oilStorageSize = [10e3, 50e3, 100e3, 300e3];



/**
 * general functions
 */

let styleElement = null;
function addStyle(styleCode)
{
	if (styleElement === null)
	{
		styleElement = document.createElement('style');
		document.head.appendChild(styleElement);
	}
	styleElement.innerHTML += styleCode;
}
function getBoundKey(key)
{
	return 'bound' + key[0].toUpperCase() + key.substr(1);
}
function getTierKey(key, tierLevel)
{
	return tierLevels[tierLevel] + key[0].toUpperCase() + key.substr(1);
}
function formatNumber(num)
{
	return parseFloat(num).toLocaleString('en');
}
function formatNumbersInText(text)
{
	return text.replace(/\d(?:[\d',\.]*\d)?/g, (numStr) =>
	{
		return formatNumber(parseInt(numStr.replace(/\D/g, ''), 10));
	});
}
function now()
{
	return (new Date()).getTime();
}
function padLeft(num, padChar)
{
	return (num < 10 ? padChar : '') + num;
}
function formatTimer(timer)
{
	timer = parseInt(timer, 10);
	const hours = Math.floor(timer / 3600);
	const minutes = Math.floor((timer % 3600) / 60);
	const seconds = timer % 60;
	return padLeft(hours, '0') + ':' + padLeft(minutes, '0') + ':' + padLeft(seconds, '0');
}
const timeSteps = [
	{
		threshold: 1
		, name: 'second'
		, short: 'sec'
		, padp: 0
	}
	, {
		threshold: 60
		, name: 'minute'
		, short: 'min'
		, padp: 0
	}
	, {
		threshold: 3600
		, name: 'hour'
		, short: 'h'
		, padp: 1
	}
	, {
		threshold: 86400
		, name: 'day'
		, short: 'd'
		, padp: 2
	}
];
function formatTime2NearestUnit(time, long = false)
{
	let step = timeSteps[0];
	for (let i = timeSteps.length-1; i > 0; i--)
	{
		if (time >= timeSteps[i].threshold)
		{
			step = timeSteps[i];
			break;
		}
	}
	const factor = Math.pow(10, step.padp);
	const num = Math.round(time / step.threshold * factor) / factor;
	const unit = long ? step.name + (num === 1 ? '' : 's') : step.short;
	return num + ' ' + unit;
}



/**
 * hide crafting recipes of lower tiers or of maxed machines
 */

function setRecipeVisibility(key, visible)
{
	const recipeRow = document.getElementById('crafting-' + key);
	if (recipeRow)
	{
		recipeRow.style.display = visible ? '' : 'none';
	}
}
function hideLeveledRecipes(max, getKey, init)
{
	const keys2Observe = [];
	let maxLevel = 0;
	for (let i = max-1; i >= 0; i--)
	{
		const level = i+1;
		const key = getKey(i);
		const boundKey = getBoundKey(key);
		keys2Observe.push(key);
		keys2Observe.push(boundKey);
		if (window[key] > 0 || window[boundKey] > 0)
		{
			maxLevel = Math.max(maxLevel, level);
		}

		setRecipeVisibility(key, level > maxLevel);
	}

	if (init)
	{
		observe(keys2Observe, () => hideLeveledRecipes(max, getKey, false));
	}
}
function hideToolRecipe(key, init)
{
	const emptyKey = getTierKey(key, 0);
	const keys2Observe = [emptyKey];
	let hasTool = window[emptyKey] > 0;
	for (let i = 0; i < tierLevels.length; i++)
	{
		const boundKey = getBoundKey(getTierKey(key, i));
		hasTool = hasTool || window[boundKey] > 0;
		keys2Observe.push(boundKey);
	}

	setRecipeVisibility(emptyKey, !hasTool);

	if (init)
	{
		observe(keys2Observe, () => hideToolRecipe(key, false));
	}
}
function hideRecipe(key, max, init)
{
	const maxValue = typeof max === 'function' ? max() : max;
	const boundKey = getBoundKey(key);
	const unbound = parseInt(window[key], 10);
	const bound = parseInt(window[boundKey], 10);

	setRecipeVisibility(key, (bound + unbound) < maxValue);

	if (init)
	{
		observe([key, boundKey], () => hideRecipe(key, max, false));
	}
}
function hideCraftedRecipes()
{
	function processRecipes(init)
	{
		// furnace
		hideLeveledRecipes(
			furnaceLevels.length
			, i => furnaceLevels[i] + 'Furnace'
			, init
		);
		// oil storage
		hideLeveledRecipes(
			7
			, i => 'oilStorage' + (i+1)
			, init
		);
		// oven recipes
		hideLeveledRecipes(
			ovenLevels.length
			, i => ovenLevels[i] + 'Oven'
			, init
		);
		// tools
		hideToolRecipe('axe', init);
		hideToolRecipe('hammer', init);
		hideToolRecipe('shovel', init);
		hideToolRecipe('pickaxe', init);
		hideToolRecipe('fishingRod', init);
		// drills
		hideRecipe('drills', 10, init);
		// crushers
		hideRecipe('crushers', 10, init);
		// oil pipe
		hideRecipe('oilPipe', 1, init);
		// boats
		hideRecipe('rowBoat', 1, init);
		hideRecipe('canoe', 1, init);
	}
	processRecipes(true);

	const _processCraftingTab = window.processCraftingTab;
	window.processCraftingTab = () =>
	{
		const reinit = !!window.refreshLoadCraftingTable;
		_processCraftingTab();

		if (reinit)
		{
			processRecipes(true);
		}
	};
}



/**
 * improve item boxes
 */

function hideNumberInItemBox(key, setVisibility)
{
	const itemBox = document.getElementById('item-box-' + key);
	const numberElement = itemBox.lastElementChild;
	if (setVisibility)
	{
		numberElement.style.visibility = 'hidden';
	}
	else
	{
		numberElement.style.display = 'none';
	}
}
function addSpan2ItemBox(key)
{
	hideNumberInItemBox(key);

	const itemBox = document.getElementById('item-box-' + key);
	const span = document.createElement('span');
	itemBox.appendChild(span);
	return span;
}
function setOilPerSecond(span, oil)
{
	span.innerHTML = `+ ${formatNumber(oil)} L/s <img src="images/oil.png" class="image-icon-20" style="margin-top: -2px;">`;
}
function improveItemBoxes()
{
	// show capacity of furnace
	for (let i = 0; i < furnaceLevels.length; i++)
	{
		const key = furnaceLevels[i] + 'Furnace';
		const capacitySpan = addSpan2ItemBox(getBoundKey(key));
		capacitySpan.className = 'capacity';
		capacitySpan.textContent = 'Capacity: ' + formatNumber(furnaceCapacity[i]);
	}

	// show oil cap of oil storage
	for (let i = 0; i < maxOilStorageLevel; i++)
	{
		const key = 'oilStorage' + (i+1);
		const capSpan = addSpan2ItemBox(getBoundKey(key));
		capSpan.className = 'oil-cap';
		capSpan.textContent = 'Oil cap: ' + formatNumber(oilStorageSize[i]);
	}

	// show oil per second
	const handheldOilSpan = addSpan2ItemBox('handheldOilPump');
	setOilPerSecond(handheldOilSpan, 1*window.miner);
	observe('miner', () => setOilPerSecond(handheldOilSpan, 1*window.miner));
	const oilPipeSpan = addSpan2ItemBox('boundOilPipe');
	setOilPerSecond(oilPipeSpan, 50);

	// show current tier
	hideNumberInItemBox('emptyAnvil', true);
	hideNumberInItemBox('farmer', true);
	hideNumberInItemBox('planter', true);
	for (let tierItem of tierItemList)
	{
		for (let i = 0; i < tierLevels.length; i++)
		{
			const key = getTierKey(tierItem, i);
			const toolKey = tierItem == 'rake' ? key : getBoundKey(key);
			const tierSpan = addSpan2ItemBox(toolKey);
			tierSpan.className = 'tier';
			tierSpan.textContent = tierNames[i];
		}
	}

	// show boat progress
	function setTransitText(span, isInTransit)
	{
		span.textContent = isInTransit ? 'In transit' : 'Ready';
	}
	const boatSpan = addSpan2ItemBox('boundRowBoat');
	setTransitText(boatSpan, window.rowBoatTimer > 0);
	observe('rowBoatTimer', () => setTransitText(boatSpan, window.rowBoatTimer > 0));
	const canoeSpan = addSpan2ItemBox('boundCanoe');
	setTransitText(canoeSpan, window.canoeTimer > 0);
	observe('canoeTimer', () => setTransitText(canoeSpan, window.canoeTimer > 0));
}



/**
 * fix wood cutting
 */

function fixWoodcutting()
{
	addStyle(`
img.woodcutting-tree-img
{
	border: 1px solid transparent;
}
	`);
}



/**
 * fix chat
 */

const lastMsg = new Map();
function isMuted(user)
{
	// return window.mutedPeople.some((name) => user.indexOf(name) > -1);
	return window.mutedPeople.includes(user);
}
function isSpam(user, msg)
{
	return lastMsg.has(user) &&
		lastMsg.get(user).msg == msg &&
		// last message in the last 30 seconds?
		(now() - lastMsg.get(user).time) < 30e3;
}
function handleSpam(user, msg)
{
	const msgObj = lastMsg.get(user);
	msgObj.time = now();
	msgObj.repeat++;
	// a user is allowed to repeat a message twice (write it 3 times in total)
	if (msgObj.repeat > 1)
	{
		window.mutedPeople.push(user);
	}
}
function fixChat()
{
	const _addToChatBox = window.addToChatBox;
	window.addToChatBox = (userChatting, iconSet, tagSet, msg, isPM) =>
	{
		if (isMuted(userChatting))
		{
			return;
		}
		if (isSpam(userChatting, msg))
		{
			return handleSpam(userChatting, msg);
		}
		lastMsg.set(userChatting, {
			time: now()
			, msg: msg
			, repeat: 0
		});

		// add clickable links
		msg = msg.replace(/(https?:\/\/[^\s"<>]+)/g, '<a target="_blank" href="$1">$1</a>');

		_addToChatBox(userChatting, iconSet, tagSet, msg, isPM);
	};

	// add checkbox instead of button for toggling auto scrolling
	const btn = document.querySelector('input[value="Toggle Autoscroll"]');
	const checkboxId = 'chat-toggle-autoscroll';
	// create checkbox
	const toggleCheckbox = document.createElement('input');
	toggleCheckbox.type = 'checkbox';
	toggleCheckbox.id = checkboxId;
	toggleCheckbox.checked = true;
	// create label
	const toggleLabel = document.createElement('label');
	toggleLabel.htmlFor = checkboxId;
	toggleLabel.textContent = 'Autoscroll';
	btn.parentNode.insertBefore(toggleCheckbox, btn);
	btn.parentNode.insertBefore(toggleLabel, btn);
	btn.style.display = 'none';

	// add checkbox for intelligent scrolling
	const isCheckboxId = 'chat-toggle-intelligent-scroll';
	const intScrollCheckbox = document.createElement('input');
	intScrollCheckbox.type = 'checkbox';
	intScrollCheckbox.id = isCheckboxId;
	intScrollCheckbox.checked = true;
	// add label
	const intScrollLabel = document.createElement('label');
	intScrollLabel.htmlFor = isCheckboxId;
	intScrollLabel.textContent = 'Intelligent Scrolling';
	btn.parentNode.appendChild(intScrollCheckbox);
	btn.parentNode.appendChild(intScrollLabel);

	const chatArea = document.getElementById('div-chat-area');
	function setAutoScrolling(value, full)
	{
		if (window.isAutoScrolling != value)
		{
			toggleCheckbox.checked = value;
			window.isAutoScrolling = value;
			window.scrollText(
				'none'
				, value ? 'lime' : 'red'
				, (value ? 'En' : 'Dis') + 'abled' + (full ? ' Autoscroll' : '')
			);
			return true;
		}
		return false;
	}
	toggleCheckbox.addEventListener('change', function ()
	{
		setAutoScrolling(this.checked);
		if (this.checked && intScrollCheckbox.checked)
		{
			chatArea.scrollTop = chatArea.scrollHeight - chatArea.clientHeight;
		}
	});

	chatArea.addEventListener('scroll', () =>
	{
		if (intScrollCheckbox.checked)
		{
			const scrolled2Bottom = (chatArea.scrollTop + chatArea.clientHeight) >= chatArea.scrollHeight;
			setAutoScrolling(scrolled2Bottom, true);
		}
	});
}



/**
 * hopefully only temporary fixes
 */

function temporaryFixes()
{
	// fix recipe of oil storage 3
	const _processCraftingTab = window.processCraftingTab;
	window.processCraftingTab = () =>
	{
		const reinit = !!window.refreshLoadCraftingTable;
		_processCraftingTab();

		if (reinit)
		{
			// 200 instead of 100 gold bars
			window.craftingRecipes['oilStorage3'].recipeCost[2] = 200;
			document.getElementById('recipe-cost-oilStorage3-2').textContent = 200;
			window.showMateriesNeededAndLevelLabels('oilStorage3');
		}
	};

	// fix burn rate of ovens
	window.getOvenBurnRate = () =>
	{
		if (boundBronzeOven == 1)
		{
			return .5;
		}
		else if (boundIronOven == 1)
		{
			return .4;
		}
		else if (boundSilverOven == 1)
		{
			return .3;
		}
		else if (boundGoldOven == 1)
		{
			return .2;
		}
		return 1;
	};

	// fix grow time of some seeds
	const seeds = {
		'limeLeafSeeds': '1 hour and 30 minutes'
		, 'greenLeafSeeds': '45 minutes'
	};
	for (let seedName in seeds)
	{
		const tooltip = document.getElementById('tooltip-' + seedName);
		tooltip.lastElementChild.lastChild.textContent = seeds[seedName];
	}

	// fix exhaustion timer and updating brewing recipes
	const _clientGameLoop = window.clientGameLoop;
	window.clientGameLoop = () =>
	{
		_clientGameLoop();
		if (document.getElementById('tab-container-combat').style.display != 'none')
		{
			window.combatNotFightingTick();
		}
		if (currentOpenTab == 'brewing')
		{
			window.processBrewingTab();
		}
	};

	// fix elements of scrollText (e.g. when joining the game and receiving xp at that moment)
	const textEls = document.querySelectorAll('div.scroller');
	for (let i = 0; i < textEls.length; i++)
	{
		const scroller = textEls[i];
		if (scroller.style.position != 'absolute')
		{
			scroller.style.display = 'none';
		}
	}

	// fix style of tooltips
	addStyle(`
body > div.tooltip > h2:first-child
{
	margin-top: 0;
	font-size: 20pt;
	font-weight: normal;
}
	`);
}



/**
 * improve timer
 */

function improveTimer()
{
	window.formatTime = (seconds) =>
	{
		return formatTimer(seconds);
	};
	window.formatTimeShort2 = (seconds) =>
	{
		return formatTimer(seconds);
	};

	addStyle(`
#notif-smelting > span:not(.timer)
{
	display: none;
}
	`);
	const smeltingNotifBox = document.getElementById('notif-smelting');
	const smeltingTimerEl = document.createElement('span');
	smeltingTimerEl.className = 'timer';
	smeltingNotifBox.appendChild(smeltingTimerEl);
	function updateSmeltingTimer()
	{
		const totalTime = parseInt(window.smeltingPercD, 10);
		const elapsedTime = parseInt(window.smeltingPercN, 10);
		smeltingTimerEl.textContent = formatTimer(Math.max(totalTime - elapsedTime, 0));
	}
	observe('smeltingPercD', () => updateSmeltingTimer());
	observe('smeltingPercN', () => updateSmeltingTimer());
	updateSmeltingTimer();

	// add tree grow timer
	const treeInfo = {
		1: {
			name: 'Normal tree'
			// 3h = 10800s
			, growTime: 3 * 60 * 60
		}
		, 2: {
			name: 'Oak tree'
			// 6h = 21600s
			, growTime: 6 * 60 * 60
		}
		, 3: {
			name: 'Willow tree'
			 // 8h = 28800s
			, growTime: 8 * 60 * 60
		}
	};
	function updateTreeInfo(place, nameEl, timerEl, init)
	{
		const idKey = 'treeId' + place;
		const growTimerKey = 'treeGrowTimer' + place;
		const lockedKey = 'treeUnlocked' + place;

		const info = treeInfo[window[idKey]];
		if (!info)
		{
			const isLocked = place > 4 && window[lockedKey] == 0;
			nameEl.textContent = isLocked ? 'Locked' : 'Empty';
			timerEl.textContent = '';
		}
		else
		{
			nameEl.textContent = info.name;
			const remainingTime = info.growTime - parseInt(window[growTimerKey], 10);
			timerEl.textContent = remainingTime > 0 ? '(' + formatTimer(remainingTime) + ')' : 'Fully grown';
		}

		if (init)
		{
			observe(
				[idKey, growTimerKey, lockedKey]
				, () => updateTreeInfo(place, nameEl, timerEl, false)
			);
		}
	}
	for (let i = 0; i < 6; i++)
	{
		const treePlace = i+1;
		const treeContainer = document.getElementById('wc-div-tree-' + treePlace);
		treeContainer.style.position = 'relative';
		const infoEl = document.createElement('div');
		infoEl.setAttribute('style', 'position: absolute; top: 0; left: 0; right: 0; pointer-events: none; margin-top: 5px; color: white;');
		const treeName = document.createElement('div');
		treeName.style.fontSize = '1.2rem';
		infoEl.appendChild(treeName);
		const treeTimer = document.createElement('div');
		infoEl.appendChild(treeTimer);
		treeContainer.appendChild(infoEl);

		updateTreeInfo(treePlace, treeName, treeTimer, true);
	}
}



/**
 * improve smelting dialog
 */

const smeltingRequirements = {
	'glass': {
		sand: 1
		, oil: 10
	}
	, 'bronzeBar': {
		copper: 1
		, tin: 1
		, oil: 10
	}
	, 'ironBar': {
		iron: 1
		, oil: 100
	}
	, 'silverBar': {
		silver: 1
		, oil: 300
	}
	, 'goldBar': {
		gold: 1
		, oil: 1e3
	}
};
function improveSmelting()
{
	const amountInput = document.getElementById('input-smelt-bars-amount');
	amountInput.type = 'number';
	amountInput.min = 0;
	amountInput.step = 5;
	function onValueChange(event)
	{
		smeltingValue = null;
		window.selectBar('', '', amountInput, document.getElementById('smelting-furnace-capacity').value);
	}
	amountInput.addEventListener('mouseup', onValueChange);
	amountInput.addEventListener('keyup', onValueChange);
	amountInput.setAttribute('onkeyup', '');

	const _selectBar = window.selectBar;
	let smeltingValue = null;
	window.selectBar = (bar, inputElement, inputBarsAmountEl, capacity) =>
	{
		const requirements = smeltingRequirements[bar];
		let maxAmount = capacity;
		for (let key in requirements)
		{
			maxAmount = Math.min(Math.floor(window[key] / requirements[key]), maxAmount);
		}
		const value = parseInt(amountInput.value, 10);
		if (value > maxAmount)
		{
			smeltingValue = value;
			amountInput.value = maxAmount;
		}
		else if (smeltingValue != null)
		{
			amountInput.value = Math.min(smeltingValue, maxAmount);
			if (smeltingValue <= maxAmount)
			{
				smeltingValue = null;
			}
		}
		return _selectBar(bar, inputElement, inputBarsAmountEl, capacity);
	};

	const _openFurnaceDialogue = window.openFurnaceDialogue;
	window.openFurnaceDialogue = (furnace) =>
	{
		if (smeltingBarType == 0)
		{
			amountInput.max = getFurnaceCapacity(furnace);
		}
		return _openFurnaceDialogue(furnace);
	};
}



/**
 * add chance to time calculator
 */

/**
 * calculates the number of seconds until the event with the given chance happened at least once with the given
 * probability p (in percent)
 */
function calcSecondsTillP(chancePerSecond, p)
{
	return Math.round(Math.log(1 - p/100) / Math.log(1 - chancePerSecond));
}
function addChanceTooltip(headline, chancePerSecond, elId, targetEl)
{
	// ensure element existence
	const tooltipElId = 'tooltip-chance-' + elId;
	let tooltipEl = document.getElementById(tooltipElId);
	if (!tooltipEl)
	{
		tooltipEl = document.createElement('div');
		tooltipEl.id = tooltipElId;
		tooltipEl.style.display = 'none';
		document.getElementById('tooltip-list').appendChild(tooltipEl);
	}

	// set elements content
	const percValues = [1, 10, 20, 50, 80, 90, 99];
	let percRows = '';
	for (let p of percValues)
	{
		percRows += `
			<tr>
				<td>${p}%</td>
				<td>${formatTime2NearestUnit(calcSecondsTillP(chancePerSecond, p), true)}</td>
			</tr>`;
	}
	tooltipEl.innerHTML = `<h2>${headline}</h2>
		<table class="chance">
			<tr>
				<th>Probability</th>
				<th>Time</th>
			</tr>
			${percRows}
		</table>
	`;

	// ensure binded events to show the tooltip
	if (targetEl.dataset.tooltipId == null)
	{
		targetEl.setAttribute('data-tooltip-id', tooltipElId);
		window.$(targetEl).bind({
			mousemove: window.changeTooltipPosition
			, mouseenter: window.showTooltip
			, mouseleave: window.hideTooltip
		});
	}
}
function chance2TimeCalculator()
{
	addStyle(`
table.chance
{
	border-spacing: 0;
}
table.chance th
{
	border-bottom: 1px solid gray;
}
table.chance td:first-child
{
	border-right: 1px solid gray;
	text-align: center;
}
table.chance th,
table.chance td
{
	padding: 4px 8px;
}
table.chance tr:nth-child(2n) td
{
	background-color: white;
}
	`);

	const _clicksShovel = window.clicksShovel;
	window.clicksShovel = () =>
	{
		_clicksShovel();

		const shovelChance = document.getElementById('dialogue-shovel-chance');
		const titleEl = shovelChance.parentElement;
		const chance = 1/window.getChanceOfDiggingSand();
		addChanceTooltip('One sand every:', chance, 'shovel', titleEl);
	};

	// depends on fishingXp
	const _clicksFishingRod = window.clicksFishingRod;
	window.clicksFishingRod = () =>
	{
		_clicksFishingRod();

		const fishList = ['shrimp', 'sardine', 'tuna', 'swordfish', 'shark'];
		for (let fish of fishList)
		{
			const rawFish = 'raw' + fish[0].toUpperCase() + fish.substr(1);
			const row = document.getElementById('dialogue-fishing-rod-tr-' + rawFish);
			const chance = row.cells[4].textContent
				.replace(/[^\d\/]/g, '')
				.split('/')
				.reduce((p, c) => p / parseInt(c, 10), 1)
			;
			addChanceTooltip(`One raw ${fish} every:`, chance, rawFish, row);
		}
	};
}



/**
 * add notification boxes
 */

function addNotifBox(id, icon)
{
	const notificationArea = document.getElementById('notifaction-area');
	const notifBox = document.createElement('span');
	notifBox.className = 'notif-box';
	notifBox.id = 'notif-' + id;
	notifBox.innerHTML = `<img src="images/${icon}" class="image-icon-50" id="notif-${id}-img">`;
	notificationArea.appendChild(notifBox);
	return notifBox;
}
function addClickableNotifBox(id, icon, tabName)
{
	const notifBox = addNotifBox(id, icon);
	notifBox.style.cursor = 'pointer';
	notifBox.addEventListener('click', () => window.openTab(tabName));
	return notifBox;
}
function showStageNotification(stagePrefix, notifBox, init)
{
    
	const keys2Observe = [];
	let show = false;
	for (let i = 1; i <= 6; i++)
	{
		const key = stagePrefix + 'Stage' + i;
		keys2Observe.push(key);
		show = show || window[key] == 4;
	}
	notifBox.style.display = show ? '' : 'none';
   
	if (init)
	{
		observe(keys2Observe, () => showStageNotification(stagePrefix, notifBox, false));
	}
     
}
function addNotificationBoxes()
{
	// tree / wood cutting notification
	const treeNotifBox = addClickableNotifBox('woodCutter', 'icons/woodcutting.png', 'woodcutting');
	treeNotifBox.title = 'There is some wood to chop';
	window.$(treeNotifBox).tooltip();
	showStageNotification('tree', treeNotifBox, true);

	// farming notification
	const harvestNotifBox = addClickableNotifBox('farming', 'icons/watering-can.png', 'farming');
	harvestNotifBox.title = 'Some plants are ready for harvest';
	window.$(harvestNotifBox).tooltip();
	showStageNotification('farmingPatch', harvestNotifBox, true);


        //combat notification
        const combatNotifBoxon = addClickableNotifBox('combat', 'icons/combat.png', 'combat');
        combatNotifBoxon.title = 'Ready to fight';
        window.$(combatNotifBoxon).tooltip();
        

	// combat cooldown timer
	const combatNotifBox = addNotifBox('combatCooldown', 'icons/combat.png');
	// const combatNotifBox = addNotifBox('combatCooldown', 'icons/hourglass.png');
	const combatTimer = document.createElement('span');
	combatNotifBox.appendChild(combatTimer);
	function updateCombatTimer()
	{
		const cooldown = parseInt(window.combatGlobalCooldown, 10);
		const show = cooldown > 0;
		combatNotifBox.style.display = show ? '' : 'none';
		combatTimer.textContent = formatTimer(cooldown);
        if(parseInt(window.combatGlobalCooldown, 10) === 0){
            combatNotifBoxon.style.display = 'inline-block';
        }else{
            combatNotifBoxon.style.display = 'none';
        }
        
	}
	observe('combatGlobalCooldown', () => updateCombatTimer());
	updateCombatTimer();
}



/**
 * add tooltips for recipes
 */

function updateRecipeTooltips(recipeKey, recipes)
{
	const table = document.getElementById('table-' + recipeKey + '-recipe');
	const rows = table.rows;
	for (let i = 1; i < rows.length; i++)
	{
		const row = rows[i];
		const key = row.id.replace(recipeKey + '-', '');
		const recipe = recipes[key];
		const requirementCell = row.cells[3];
		requirementCell.title = recipe.recipe
			.map((name, i) =>
			{
				return formatNumber(recipe.recipeCost[i]) + ' '
					+ name.replace(/[A-Z]/g, (match) => ' ' + match.toLowerCase())
				;
			})
			.join(' + ')
		;
		window.$(requirementCell).tooltip();
	}
}
function addRecipeTooltips()
{
	const _processCraftingTab = window.processCraftingTab;
	window.processCraftingTab = () =>
	{
		const reinit = !!window.refreshLoadCraftingTable;
		_processCraftingTab();

		if (reinit)
		{
			updateRecipeTooltips('crafting', window.craftingRecipes);
		}
	};

	const _processBrewingTab = window.processBrewingTab;
	window.processBrewingTab = () =>
	{
		const reinit = !!window.refreshLoadBrewingTable;
		_processBrewingTab();

		if (reinit)
		{
			updateRecipeTooltips('brewing', window.brewingRecipes);
		}
	};

	const _processMagicTab = window.processMagicTab;
	window.processMagicTab = () =>
	{
		const reinit = !!window.refreshLoadCraftingTable;
		_processMagicTab();

		if (reinit)
		{
			updateRecipeTooltips('magic', window.magicRecipes);
		}
	};
}



/**
 * fix formatting of numbers
 */

function prepareRecipeForTable(recipe)
{
	// create a copy of the recipe to prevent requirement check from failing
	const newRecipe = JSON.parse(JSON.stringify(recipe));
	newRecipe.recipeCost = recipe.recipeCost.map(cost => formatNumber(cost));
	newRecipe.xp = formatNumber(recipe.xp);
	return newRecipe;
}
function fixNumberFormat()
{
	const _addRecipeToBrewingTable = window.addRecipeToBrewingTable;
	window.addRecipeToBrewingTable = (brewingRecipe) =>
	{
		_addRecipeToBrewingTable(prepareRecipeForTable(brewingRecipe));
	};

	const _addRecipeToMagicTable = window.addRecipeToMagicTable;
	window.addRecipeToMagicTable = (magicRecipe) =>
	{
		_addRecipeToMagicTable(prepareRecipeForTable(magicRecipe));
	};
}



/**
 * style tweaks
 */

function addTweakStyle(setting, style)
{
	const prefix = 'body.' + setting;
	addStyle(
		style
			.replace(/(^\s*|,\s*|\}\s*)([^\{\},]+)(,|\s*\{)/g, '$1' + prefix + ' $2$3')
	);
	document.body.classList.add(setting);
}
function tweakStyle()
{
	// tweak oil production/consumption
	addTweakStyle('tweak-oil', `
span#oil-flow-values
{
	position: relative;
	margin-left: .5em;
}
#oil-flow-values > span
{
	font-size: 0px;
	position: absolute;
	top: -0.75rem;
	visibility: hidden;
}
#oil-flow-values > span > span
{
	font-size: 1rem;
	visibility: visible;
}
#oil-flow-values > span:last-child
{
	top: 0.75rem;
}
#oil-flow-values span[data-item-display="oilIn"]::before
{
	content: '+';
}
#oil-flow-values span[data-item-display="oilOut"]::before
{
	content: '-';
}
	`);

	addTweakStyle('no-select', `
table.tab-bar,
span.item-box,
div.farming-patch,
div.farming-patch-locked,
div.tab-sub-container-combat,
table.top-links a
{
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
	`);
}



/**
 * init
 */

function init()
{
	temporaryFixes();

	hideCraftedRecipes();
	improveItemBoxes();
	fixWoodcutting();
	fixChat();
	improveTimer();
	improveSmelting();
	chance2TimeCalculator();
	addNotificationBoxes();
	addRecipeTooltips();

	fixNumberFormat();
	tweakStyle();
}
document.addEventListener('DOMContentLoaded', () =>
{
	const _doCommand = window.doCommand;
	window.doCommand = (data) =>
	{
		if (data.startsWith('REFRESH_ITEMS='))
		{
			const itemDataValues = data.split('=')[1].split(';');
			const itemArray = [];
			for (var i = 0; i < itemDataValues.length; i++)
			{
				const [key, newValue] = itemDataValues[i].split('~');
				if (updateValue(key, newValue))
				{
					itemArray.push(key);
				}
			}

			window.refreshItemValues(itemArray, false);

			if (window.firstLoadGame)
			{
				window.loadInitial();
				window.firstLoadGame = false;
				init();
			}
			else
			{
				window.clientGameLoop();
			}
			return;
		}
		return _doCommand(data);
	};
});



/**
 * fix web socket errors
 */

function webSocketLoaded(event)
{
	if (window.webSocket == null)
	{
		console.error('no webSocket instance found!');
		return;
	}

	const messageQueue = [];
	const _onMessage = webSocket.onmessage;
	webSocket.onmessage = (event) => messageQueue.push(event);
	document.addEventListener('DOMContentLoaded', () =>
	{
		messageQueue.forEach(event => onMessage(event));
		webSocket.onmessage = _onMessage;
	});

	const commandQueue = [];
	const _sendBytes = window.sendBytes;
	window.sendBytes = (command) => commandQueue.push(command);
	const _onOpen = webSocket.onopen;
	webSocket.onopen = (event) =>
	{
		window.sendBytes = _sendBytes;
		commandQueue.forEach(command => window.sendBytes(command));
		return _onOpen(event);
	};
}
function isWebSocketScript(script)
{
	return script.src.includes('socket.js');
}
function fixWebSocketScript()
{
	if (!document.head)
	{
		return;
	}

	const scripts = document.head.querySelectorAll('script');
	let found = false;
	for (let i = 0; i < scripts.length; i++)
	{
		if (isWebSocketScript(scripts[i]))
		{
			// does this work?
			scripts[i].onload = webSocketLoaded;
			return;
		}
	}

	// create an observer instance
	const mutationObserver = new MutationObserver((mutationList) =>
	{
		mutationList.forEach((mutation) =>
		{
			if (mutation.addedNodes.length === 0)
			{
				return;
			}

			for (let i = 0; i < mutation.addedNodes.length; i++)
			{
				const node = mutation.addedNodes[i];
				if (node.tagName == 'SCRIPT' && isWebSocketScript(node))
				{
					mutationObserver.disconnect();
					node.onload = webSocketLoaded;
					return;
				}
			}
		});
	});
	mutationObserver.observe(document.head, {
		childList: true
	});
}
fixWebSocketScript();

// fix scrollText (e.g. when joining the game and receiving xp at that moment)
window.mouseX = window.innerWidth / 2;
window.mouseY = window.innerHeight / 2;
})();
