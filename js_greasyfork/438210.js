// ==UserScript==
// @name         CONfetti
// @namespace    https://www.conflictnations.com/
// @version      0.9.1
// @description  Improve the Conflict Of Nations UI experience.
// @author       Taviandir
// @match        https://www.conflictnations.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438210/CONfetti.user.js
// @updateURL https://update.greasyfork.org/scripts/438210/CONfetti.meta.js
// ==/UserScript==

(function () {
	'use strict';

	if (!inIframe()) return;

	log('INIT');

	let correctUrl = document.location.href.includes('con-client');
	console.log('CORRECT URL?', { correctUrl, href: document.location.href });

	if (!correctUrl) return;

	// Determine when it's loaded by observing changes to splash screen attributes. When it is finished loading, style="display: none;" is added to this element.
	var splashScreen = document.getElementById('splashScreenContainer');
	var observer = new MutationObserver(function (mutations) {
		mutations.forEach(function (mutation) {
			if (mutation.type === 'attributes') {
				if (!__loaded) {
					log('INIT SCRIPT');
					initExtensionPlay();
					__loaded = true;
					log('INIT SCRIPT - DONE');
				}
			}
		});
	});
	observer.observe(splashScreen, {
		attributes: true, //configure it to listen to attribute changes
	});
})();

var __loaded = false;
function initExtensionPlay() {
	initEventWindow();
	// hideGoldMarketing();
	hideTutorialAdvisor();
	initExtensionMenuRow();
	initDiplomacyWindow();
}

function initDiplomacyWindow() {
	var dipBtn = document.getElementById('func_btn_diplomacy');
	dipBtn.addEventListener('click', onOpenDiplomacyWindow);
}

function onOpenDiplomacyWindow() {
	log('on diplomacy open');
	setTimeout(() => {
		// delay setting to give it time to load the UI

		var messageTabEl = document.getElementById('func_tab_messages');
		messageTabEl.addEventListener('click', onClickDiplomacyMessagesTab);
	}, 2000);
}

var __enabledCtrlEnterSend;
function onClickDiplomacyMessagesTab() {
	// enable CTRL-Enter to send messages
	if (!__enabledCtrlEnterSend) {
		setTimeout(() => {
			var textAreaEl = document.getElementById('func_create_message_body');
			if (textAreaEl) {
				textAreaEl.addEventListener('keydown', function (e) {
					if (e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13)) {
						// Ctrl-Enter pressed
						document.getElementById('func_send_message').click();
					}
				});
				__enabledCtrlEnterSend = true;
			}
		}, 2000);
	}
}

/**************************************** MENU ROW FEATURES ****************************************/
function initExtensionMenuRow() {
	var refElement = document.getElementById('menuContainer');
	var menuWrapper = document.createElement('div');
	menuWrapper.id = 'ExtMenu';
	menuWrapper.style = 'position: absolute; bottom: -80px; left: 0; width: 315px; z-index: 10; color: white; margin-left: 13px;';
	var ulEl = document.createElement('ul');
	ulEl.classList.add('mainmenu');
	ulEl.style = 'display: grid; grid-template-columns: repeat(5, 1fr)';
	menuWrapper.appendChild(ulEl);
	insertAfter(menuWrapper, refElement);

	// UNIT B-LVL BUTTON
	var ubLvlButtonEl = addButtonToMenu(ulEl);
	ubLvlButtonEl.style.fill = 'white';
	var svgWrapper = document.createElement('div');
	svgWrapper.innerHTML = _buildingIconSvg;
	svgWrapper.style = 'width: 100%; margin: 0.25rem';
	ubLvlButtonEl.appendChild(svgWrapper);
	ubLvlButtonEl.addEventListener('click', onClickMenuUnitBuildingLevel);

	// NOTES BUTTON
	var notesButtonEl = addButtonToMenu(ulEl);
	notesButtonEl.innerText = 'NOTES';
	notesButtonEl.addEventListener('click', onClickMenuItemNotes);
}

function addButtonToMenu(menuEl) {
	var liEl = document.createElement('li');
	liEl.classList.add('con_button');
	liEl.style = 'display: inline-flex; align-items: center; justify-content: center; font-weight: bold;';
	menuEl.appendChild(liEl);
	return liEl;
}

function createPopupCloseButton() {
	var div = document.createElement('div');
	div.innerHTML = `<div class="close_button_s"><div>x</div></div>`;
	var child = div.firstChild;
	child.parent = null;
	div.remove();
	return child;
}

/*** UNIT BUILDING LVL MATRIX ***/
function onClickMenuUnitBuildingLevel() {
	log('UNIT BUILDING-LEVEL ITEM CLICKED');
	var popupEl = document.createElement('div');
	popupEl.id = 'ExtNotesUbLvl';
	popupEl.style =
		'min-width: 500px; background: #51666d; color: white; border: 1px solid #ccc; position: absolute; left: 2%; top: 25%; display: flex; flex-direction: column; padding: 0.25rem;';
	popupEl.appendChild(initUbPopupStyles());
	popupEl.appendChild(initUbLvlHeader());
	var tableWrapper = document.createElement('div');
	popupEl.appendChild(tableWrapper);
	tableWrapper.innerHTML = _unitBuildlingLevelTableTemplate;

	// inject data into table
	var data = parseUnitBuildingLevelsData();
	var tableEl = tableWrapper.firstChild;
	for (let key in data) {
		let obj = data[key];
		for (let lvl = 1; lvl <= 5; lvl++) {
			let arr = obj[lvl];
			if (arr.length) {
				let tdHtml = ubArrayToHtml(arr);
				var cellId = getUbTableCellId(key, lvl);
				var tdMatch = tableEl.querySelectorAll('#' + cellId);
				if (tdMatch.length) {
					tdMatch[0].innerHTML = tdHtml;
				}
			}
		}
	}

	document.getElementById('s1914').appendChild(popupEl);
}

function initUbPopupStyles() {
	var styles = document.createElement('style');
	styles.innerHTML = _unitBuildlingPopupCss;
	return styles;
}

function ubArrayToHtml(arr) {
	let html = '';
	for (let x of arr) {
		html += '<div>' + x + '</div>';
	}
	return html;
}

function getUbTableCellId(building, lvl) {
	let key = '';
	if (building === 'Army Base') {
		key = 'army';
	} else if (building === 'Air Base') {
		key = 'air';
	} else if (building === 'Naval Base') {
		key = 'naval';
	}
	return key + '_' + lvl;
}

function initUbLvlHeader() {
	var headerWrapper = document.createElement('div');
	headerWrapper.style = 'display: flex; align-items: space-between';
	var closeButton = createPopupCloseButton();
	closeButton.addEventListener('click', onClickCloseUbLvlWindow);
	var headerEl = document.createElement('h1');
	headerEl.innerText = 'Units by Building Levels';
	headerEl.style = 'margin-bottom: 0.5rem';
	headerWrapper.appendChild(headerEl);
	headerWrapper.appendChild(closeButton);
	return headerWrapper;
}

function onClickCloseUbLvlWindow() {
	document.getElementById('ExtNotesUbLvl').remove();
}

function parseUnitBuildingLevelsData() {
	var rows = _unitBuildingLevelsData.split('\n');
	let dict = {};
	let currentObj = null;
	for (let row of rows) {
		let cols = row.split('\t');

		// check for new category
		if (cols[0] != '') {
			currentObj = {};
			initLevelsInBuildingObj(currentObj);
			var key = cols[0] + ' Base';
			dict[key] = currentObj;
		}

		// add units to its level
		for (let lvl = 1; lvl <= 5; lvl++) {
			if (!!cols[lvl]) {
				currentObj[lvl].push(cols[lvl]);
			}
		}
	}

	return dict;
}

function initLevelsInBuildingObj(obj) {
	for (let i = 0; i < 5; i++) {
		obj[i + 1] = [];
	}
}

/*** NOTES ***/
function onClickMenuItemNotes() {
	log('NOTES MENU ITEM CLICKED');
	var popupEl = document.createElement('div');
	popupEl.id = 'ExtNotesPopup';
	popupEl.style =
		'min-width: 500px; background: #eee; color: black; border: 1px solid #ccc; position: absolute; left: 2%; top: 25%; display: flex; flex-direction: column; padding: 0.25rem;';
	var headerEl = document.createElement('h1');
	headerEl.innerText = 'Notes';
	headerEl.style = 'margin-bottom: 0.5rem';
	popupEl.appendChild(headerEl);

	var gameId = getGameId();
	var textEl = document.createElement('textarea');
	textEl.id = 'ExtNoteInput';
	textEl.value = loadGameNote(gameId);
	textEl.setAttribute('rows', 10);
	popupEl.appendChild(textEl);

	// buttons container
	var buttonDiv = document.createElement('div');
	buttonDiv.style = 'display: flex; margin-top: 0.5rem; justify-content: flex-end';
	popupEl.appendChild(buttonDiv);

	// cancel button
	var cancelEl = document.createElement('button');
	cancelEl.id = 'ExtNoteCancel';
	cancelEl.innerText = 'Cancel';
	cancelEl.className = 'con_button large_button uppercase';
	cancelEl.style = 'margin-right: 0.5rem;';
	cancelEl.addEventListener('click', onClickCancelNote);
	buttonDiv.appendChild(cancelEl);

	// save button
	var saveEl = document.createElement('button');
	saveEl.id = 'ExtNoteSave';
	saveEl.innerText = 'Save';
	saveEl.className = 'con_button large_button uppercase';
	saveEl.addEventListener('click', onClickSaveNote);
	buttonDiv.appendChild(saveEl);

	document.getElementById('s1914').appendChild(popupEl);
}

function onClickCancelNote() {
	closeNoteWindow();
}

function onClickSaveNote() {
	// log('save click');
	var textValue = document.getElementById('ExtNoteInput').value;
	log(textValue);
	saveGameNote(getGameId(), textValue);
	// log('NOTE SAVED');
	closeNoteWindow();
}

function closeNoteWindow() {
	document.getElementById('ExtNotesPopup').remove();
}

function loadGameNote(gameId) {
	return localStorage.getItem('ext_note_' + gameId);
}

function saveGameNote(gameId, text) {
	localStorage.setItem('ext_note_' + gameId, text);
}

function hideTutorialAdvisor() {
	var element = document.getElementById('tutorialAdviceTextContainer');
	if (element) {
		element.remove();
	}
}

function hideGoldMarketing() {
	var element = document.getElementById('marketingPopupContainer');

	let m = document.querySelectorAll('#marketingPopupContainer .func_close_button');
	console.log('GOLD match', m);
	if (m.length) {
		m.click();
	}
}

var _unreadEvents = 0;
function initEventWindow() {
	var eventButton = document.getElementById('func_btn_events');

	// extract the "Unread Events" value from the red circle
	var unreadEventsElem = document.getElementById('func_events_unread');
	if (unreadEventsElem) {
		log('UNREAD EVENTS: ' + unreadEventsElem.innerText);
		if (unreadEventsElem.innerText !== '') {
			var unreadValue = parseInt(unreadEventsElem.innerText);
			if (+unreadValue) {
				_unreadEvents = +unreadValue;
			}
			console.log('unread as number', unreadValue, _unreadEvents);
		}
	}
	eventButton.addEventListener('click', (event) => {
		initOptionsInEventWindow();
		markUnreadEvents();
		addUnitTypeToResearchEvents();
		enhanceAgentEvents();
	});
}

function initOptionsInEventWindow() {
	log('init event window!');
	var eventContentElem = document.querySelector('#eventsContainer .content .overview');
	if (eventContentElem) {
		// create a parent wrapper object for all filters
		let wrapper = document.createElement('div');
		wrapper.id = 'confetti-event-filters';
		wrapper.style = 'display: flex; padding: 1rem;';
		eventContentElem.prepend(wrapper);

		addTypeFilterSelect(wrapper);
		addCountryFilterSelect(wrapper);
	}
}

function markUnreadEvents() {
	console.log('Mark Unread Events', _unreadEvents);
	let childrenOfUl = document.querySelector('#eventsContainer .content .overview ul').children;
	//console.log("children of ul", childrenOfUl, unreadEvents);
	for (var i = 0; i < _unreadEvents; i++) {
		var liElem = childrenOfUl[i];
		// console.log("SET UNREAD: li elem", liElem);
		liElem.style.borderLeft = '4px solid yellow';
	}
}

function enhanceAgentEvents() {
	log('Enhance Agent Events');
	let childrenOfUl = document.querySelector('#eventsContainer .content .overview ul').children;
	//console.log("children of ul", childrenOfUl, unreadEvents);
	// console.log("AGENT childrenoful", childrenOfUl);
	for (var i = 0; i < childrenOfUl.length; i++) {
		var evEl = childrenOfUl[i];
		var desc = evEl.querySelector('.event-description');
		// console.log("event innertext", evEl, desc, desc.innerText);
		if (desc.innerText.indexOf('Our agent') >= 0) {
			// console.log("ENHANCE - our agent event", desc.innerText);
			var headerEl = evEl.querySelector('.event-time');
			if (desc.innerText.indexOf('have intercepted') >= 0) {
				// this is one of the "done to us"
			} else if (desc.innerText.indexOf('has been captured') >= 0) {
				// mission failed
				headerEl.innerText = '👎 ' + headerEl.innerText;
				headerEl.style = 'color: yellow;';
			} else if (desc.innerText.indexOf('sabotaged buildings') >= 0 || desc.innerText.indexOf('destroyed resources') >= 0) {
				// mission successful
				headerEl.innerText = '👍 ' + headerEl.innerText;
				headerEl.style = 'color: #0f0;';
			}
			// TODO : agent missions done on us
		}
	}
}

function addUnitTypeToResearchEvents() {
	setTimeout(() => {
		// console.log('addUnitTypeToResearchEvents()');
		var eventElems = document.querySelectorAll('#eventsContainer .content .overview ul li');
		// console.log('RES event elems', eventElems);
		for (var i = 0; i < eventElems.length; i++) {
			var evEl = eventElems[i];
			var desc = evEl.querySelector('.event-description');
			var content = '';
			if (desc) {
				content = desc.innerText;
			} else {
				continue;
			}

			if (content.includes('Research Completed')) {
				// parse out research name from event text
				let prefix = 'Research for ';
				let suffix = ' has been completed';
				let idxStart = content.lastIndexOf(prefix) + prefix.length;
				let idxEnd = content.lastIndexOf(suffix);
				let researchName = content.substring(idxStart, idxEnd);
				let researchNameWithoutParanthesis = researchName.substring(0, researchName.indexOf(' ('));
				// find match
				let unitTypeMatch = tryMatchUnitType(researchNameWithoutParanthesis);
				// let unitTypeMatch = tryMatchUnitType('Benjamin Franklin Class');
				console.log('Unit type match?', { unitTypeMatch, researchNameWithoutParanthesis, researchName });
				if (unitTypeMatch) {
					// set the new innerText on the content div
					//var newContent = content.substring(0, idxStart) + researchName + ' [' + unitTypeMatch + ']' + content.substring(idxEnd);
					setNewResearchContent(content, idxStart, idxEnd, researchName, unitTypeMatch, desc);
				} else {
					// perhaps a soft upgrade, try to match for it instead
					var softUpgrades = parseSoftUnitUpgradesData();
					var lvl = extractResearchUpgradeLevel(researchName);
					// console.log('research softs', { researchName, researchNameWithoutParanthesis, lvl });
					if (lvl > 1) {
						var unitTypes = tryMatchSoftUpgrade(researchNameWithoutParanthesis, lvl);
						// console.log("soft upgr result", { unitTypes });
						// if more than 3 hits, then dont write anything (too common upgrade, e.g. "Engine Upgrade (Lvl 2)"
						if (unitTypes.length && unitTypes.length <= 3) {
							var softMatchStr = unitTypes.join(' / ');
							setNewResearchContent(content, idxStart, idxEnd, researchName, softMatchStr, desc);
						}
					}
				}
			}
		}
	}, 1000);
}

function setNewResearchContent(content, idxStart, idxEnd, researchName, matchName, el) {
	var style = 'text-decoration: underline';
	var newContent =
		content.substring(0, idxStart) +
		researchName +
		' <span style="' +
		style +
		'">[ ' +
		matchName +
		' ]</span>' +
		content.substring(idxEnd);
	// console.log("NEW RESEARCH CONTENT", newContent);
	el.innerHTML = newContent;
}

function extractResearchUpgradeLevel(researchName) {
	var x = /(\d\))$/.exec(researchName)[0].replace(')', '');
	if (!isNaN(x)) {
		return parseInt(x);
	} else {
		return null;
	}
}

function tryMatchSoftUpgrade(researchName, lvl) {
	let data = parseSoftUnitUpgradesData();
	var idx = lvl - 1;
	var matches = [];
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			try {
				if (data[key][idx] === researchName) {
					matches.push(key);
				}
			} catch (error) {}
		}
	}

	return matches;
}

function tryMatchUnitType(researchName) {
	let data = parseUnitDoctrineData();
	for (let key in data) {
		if (data.hasOwnProperty(key)) {
			if (data[key].some((str) => str == researchName)) {
				// console.log("MATCH FOUND!", { type: key, needle: researchName });
				return key;
			}
		}
	}
	return null;
}

// format: { [key: string]: string[] }
// where key = unit type, and array = unit type names in the doctrines
// e.g. { 'Attack Submarine': ['Los Angeles Class', ...]
var _parsedUnitDoctrineData = null;
function parseUnitDoctrineData() {
	if (_parsedUnitDoctrineData) {
		return _parsedUnitDoctrineData;
	}
	let rowSplit = _unitDoctrineData.split('\n');
	var result = {};
	for (let i = 0; i < rowSplit.length; i++) {
		let rawRow = rowSplit[i];
		let cols = rawRow.split('\t');
		let values = cols.filter((x) => !!x && x.length);
		let unitType = values.shift();
		result[unitType] = values;
	}
	_parsedUnitDoctrineData = result;
	return _parsedUnitDoctrineData;
}

var _parsedSoftUpgradesData = null;
function parseSoftUnitUpgradesData() {
	if (_parsedSoftUpgradesData) {
		return _parsedSoftUpgradesData;
	}
	let rowSplit = _unitSoftUpgradesData.split('\n');
	var result = {};
	for (let i = 0; i < rowSplit.length; i++) {
		let rawRow = rowSplit[i];
		let cols = rawRow.split('\t');
		// let values = cols.filter(x => !!x && x.length);
		let values = cols;
		let unitType = values.shift();
		result[unitType] = values;
	}
	_parsedSoftUpgradesData = result;
	return _parsedSoftUpgradesData;
}

/****************************** EVENT FILTERS ******************************/
function onChangeFilters() {
	console.log('onChangeFilters()');
	var typeFilterValue = getEventFilterTypeValue();
	var countryFilterValue = getEventFilterCountryValue();
	// console.log("FILTER VALUES", { typeFilterValue, countryFilterValue });

	var eventElems = document.querySelectorAll('#eventsContainer .content .overview ul li');
	// console.log('eventElems', { eventElems });

	for (var i = 0; i < eventElems.length; i++) {
		var evEl = eventElems[i];
		var typeOk = evalFilterType(evEl, typeFilterValue);
		var countryOk = evalFilterCountry(evEl, countryFilterValue);
		// console.log('EV FILTER RESULT', { evEl, typeOk, countryOk, typeFilterValue, countryFilterValue });

		var show = typeOk && countryOk;
		if (show) {
			evEl.removeAttribute('hidden');
		} else {
			evEl.setAttribute('hidden', '');
		}
	}
}

function addTypeFilterSelect(elem) {
	log('addTypeFilterSelect()');
	let wrapper = document.createElement('div');
	wrapper.id = 'confetti-event-wrapper-type';
	wrapper.style.marginRight = '1rem';

	// add a label for type select
	let filterLabel = document.createElement('span');
	filterLabel.innerText = 'Type: ';
	wrapper.appendChild(filterLabel);

	// add type select w/ options
	let filterSelect = document.createElement('select');
	filterSelect.id = _eventFilterTypeId;
	wrapper.appendChild(filterSelect);
	filterSelect.style.padding = '0.5rem';
	addOptionToParent('All', 'ALL', filterSelect);
	addOptionToParent('Combat', 'COM', filterSelect);
	addOptionToParent('Territories', 'TER', filterSelect);
	addOptionToParent('Agents', 'AGE', filterSelect);
	addOptionToParent('Research', 'RES', filterSelect);
	addOptionToParent('City Production', 'CIT', filterSelect);
	addOptionToParent('Diplomacy', 'DIP', filterSelect);
	filterSelect.addEventListener('change', onChangeFilters);
	elem.append(wrapper);
}

var _eventFilterTypeId = 'confetti-filter-type-select';
function getEventFilterTypeValue() {
	return document.getElementById('' + _eventFilterTypeId).value;
}

var _eventFilterCountryId = 'confetti-filter-country-select';
function getEventFilterCountryValue() {
	return document.getElementById('' + _eventFilterCountryId).value;
}

function evalFilterType(evEl, filter) {
	if (!filter || filter == '' || filter == 'ALL') return true;
	var desc = evEl.querySelector('.event-description');
	var content = '';
	// console.log('evalFilterType', { desc, filter });
	if (desc) {
		content = desc.innerText;
	} else {
		return true;
	}

	var show = true;
	var keywordsToSearchFor;
	if (filter === 'COM') {
		keywordsToSearchFor = ['Enemy Defeated', 'Fighting.', 'Friendly Unit Lost', 'Civilian Casualties'];
	} else if (filter === 'TER') {
		keywordsToSearchFor = ['Province Entered', 'Territory Lost', 'Territory Conquered'];
	} else if (filter === 'AGE') {
		keywordsToSearchFor = ['Agent'];
	} else if (filter === 'RES') {
		keywordsToSearchFor = ['Research Completed'];
	} else if (filter === 'CIT') {
		keywordsToSearchFor = ['built in', 'mobilized'];
	} else if (filter === 'DIP') {
		keywordsToSearchFor = ['New Article Published', 'Message Received', 'Diplomatic Status Changed', 'the coalition'];
	}

	if (keywordsToSearchFor && keywordsToSearchFor.length) {
		show = keywordsToSearchFor.map((x) => content.includes(x)).some((match) => match === true);
	}

	return show;
}

function evalFilterCountry(evEl, filter) {
	if (!filter || filter == '') return true;
	var attr = evEl.getAttribute('data-country');
	return attr === filter;
}

function addCountryFilterSelect(elem) {
	log('addCountryFilterSelect()');
	var countries = detectCountriesInEvents();
	// console.log("COUNTRIES", countries);

	let wrapper = document.createElement('div');
	wrapper.id = 'confetti-event-wrapper-country';
	wrapper.style.marginRight = '1rem';

	// add a label for type select
	let filterLabel = document.createElement('span');
	filterLabel.innerText = 'Country: ';
	wrapper.appendChild(filterLabel);

	// add type select w/ options
	let filterSelect = document.createElement('select');
	filterSelect.id = _eventFilterCountryId;
	wrapper.appendChild(filterSelect);
	filterSelect.style.padding = '0.5rem';

	// add options
	addOptionToParent('All', '', filterSelect);
	for (var i = 0; i < countries.length; i++) {
		var c = countries[i];
		addOptionToParent(c.value, c.key, filterSelect);
	}

	filterSelect.addEventListener('change', onChangeFilters);
	elem.append(wrapper);
}

function detectCountriesInEvents() {
	// NOTE : THIS METHOD BOTH DETECTS COUNTRIES AND SETS [data-country] ATTR ON EVENT
	var eventElems = document.querySelectorAll('#eventsContainer .content .overview ul li');
	// var filter = event.target.value;

	var countriesLower = [];
	for (var i = 0; i < eventElems.length; i++) {
		var evEl = eventElems[i];
		var finds = evEl.querySelectorAll('.small_flag_container img');
		if (finds.length === 0) continue;
		var el = finds[0];
		var imgSrc = el.getAttribute('src');
		var countryName = imgSrc.split('small_')[1].split('.png')[0];

		// set data-country attr on event elem
		evEl.setAttribute('data-country', countryName);

		// add to list of possible countries, if not there already
		if (countriesLower.indexOf(countryName) === -1) {
			countriesLower.push(countryName);
		}
	}

	var result = countriesLower.map((s) => {
		if (_flagCountryNameDict[s]) {
			return { key: s, value: _flagCountryNameDict[s] };
		} else {
			return { key: s, value: toUpperCaseFirst(s) };
		}
	});

	// finally, sort
	console.log('>>>>>> countries result', { result });
	result.sort((a, b) => (a.value < b.value ? -1 : 1));
	return result;
}

/************************ MISC METHODS *******************************/

function getGameId() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('gameID');
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addOptionToParent(displayName, value, parentElem) {
	let node = document.createElement('option');
	node.value = value;
	node.innerText = displayName;
	parentElem.appendChild(node);
}

function log(msg) {
	if (typeof msg === 'string') {
		console.log('[CONfetti] ' + msg);
	} else {
		console.log('[CONfetti] ', msg);
	}
}

function inIframe() {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

function toUpperCaseFirst(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/************************ STATIC DATA *******************************/

const _flagCountryNameDict = {
	thechosen: 'The Chosen',
	roguestate: 'Rogue State',
};

const _unitDoctrineData = `Motorized Infantry									Basic Infantry	Advanced Infantry	Modern Infantry
Mechanized Infantry									Basic Mechanized	Advanced Mechanized	Modern Mechanized
Naval Infantry									Basic Marines	Advanced Marines	Modern Marines
Airborne Infantry									Basic Airborne	Advanced Airborne	Modern Airborne
Special Forces	Basic Rangers	Advanced Rangers	Modern Rangers		Basic SAS	Advanced SAS	Modern SAS		Basic Spetsnaz	Advanced Spetsnaz	Modern Spetsnaz
National Guard									Basic National Guard	Advanced National Guard	Modern National Guard
Combat Recon Vehicle	M113 Recon	M1117 RSTA	LAV-25		Fox FV721	VEC-M1	Griffon VBMR		BRDM-1	BRDM-2	BRDM-3
Armored Fighting Vehicle	M551 Sheridan	M2 Bradley	M3 Bradley		Scorpion	FV Warrior	Puma		BMP-2	BMP-3 Dragon	T-15
Amphibious Combat Vehicle	LVTP-7	AAVP-7A1	ACV 1.1		Fuchs	Piranha	VCBI II		BTR-80	BTR-90	Bumerang
Main Battle Tank	M1A1 Abrams	M1A2 Abrams	M1A3 Abrams		Leopard 2	Challenger 2	Leopard 2A7+		T-80	T-90	T-14 Armata
Tank Destroyer	M56 Scorpion	M901 ITV	M1134 Stryker ATGM		Kanonenjagdpanzer	AMX-10 RC	Centauro		2S25 Sprut-SD	BMPT Terminator	BMPT-72 Terminator 2
Towed Artillery	M198 Howitzer	M119 Howitzer	M777 Howitzer		FH70	TRF1	155 GH 52 APU		D-30 Howitzer	2A36 Giatsint-B	2A Msta-B
Mobile Artillery	M110 Howitzer	M109 Howitzer	M1203 NLOS		GCT 155mm	AS-90 Braveheart	Panzerhaubitzer 2000		2S3 Akatsiya	2S19 Msta-S	2S35 Koalitsiya-SV
Multiple Rocket Launcher	M270 MLRS	M270A1 MLRS	M142 HIMARS		Teruel	M270 B1	LRSVM Morava		BM-21 Grad	BM-30 Smerch	9A52-4 Tornado
Mobile Anti-Air Vehicle	M163 VADS	M247 Sergeant York	LAV-AD Air Defense		Gepard	Otomatic	Marksman		AZU-57-2	ZSU-23-4 Shilka	2K22 Tunguska
Mobile SAM Launcher	MIM-23 Hawk	MIM-72 Chaparral	AN/TWQ-1 Avenger		Ozelot	Crotale	Stormer HVM		9K35 Strela-10	BUK M1	Pantsir-S1
Theater Defense System	MIM-14 Nike	MIM-104 Patriot	THAAD Missile Defence		Bloodhound	MEADS	SAMP/T		S-125 Neva	S-300	S-400 Triumf
Mobile Radar	LCM RADAR	ELEC EQ-36	PATRIOT AN/MPQ-53		UNIMOG SCB	MARS-L	Ground Master 400		1L121-E	KASTA	Nebo-M
Helicopter Gunship	Kiowa	UH-1Y Venom	Armed Black Hawk		Gazelle	Super Puma	NH-90		Mi-8 TVK	Mi-24 Hind	Mi-35M
Attack Helicopter	AH-1G Cobra	AH-1Z Viper	AH-64D Apache Longbow		A129 Mangusta	AW Apache AH64D	Tiger		Ka-50 Black Shark	Ka-52 Alligator	Mi-28 Havoc
ASW Helicopter	SH-3 Sea King	SH-2 Super Seasprite	MH-60R Seahawk		AB 212ASW	Panther	AW159 Wildcat		Ka-25	Mi-14 Haze	Ka-27 Helix
Air Superiority Fighter	F-5 Tiger	F-16A Fighting Falcon	F-16V Viper		J 35A Draken	Mirage F1	Typhoon		MiG-23 Flogger	MiG-29 Fulcrum	MiG-35 Super Fulcrum
Naval Air Superiority Fighter	F-4 Phantom II	F-14A Tomcat	F-14D Super Tomcat		Étendard IVM	Jaguar M	Rafale M		Yak-141	Su-33 Flanker D	MiG-29K
Stealth Air Superiority Fighter	F-22 Raptor				MBB Firefly				Su-47 Berkut
Strike Fighter	F-111 Aardvark	F-15 Strike Eagle	F-15 Silent Eagle		Mirage Delta 2000	Tornado	JAS 39 Gripen		Su-24 Fencer	Su-27 Flanker	Su-35 Super Flanker
Naval Strike Fighter	A-6 Intruder	A-7 Corsair II	F-18 Super Hornet		Harrier	Super Étendard	Harrier II Plus		Yak-38	Su-27K	Su-35K
Stealth Strike Fighter	F-35 Lightning II				F-117 Nighthawk				Su-T50 PakFa
UAV	MQ1-Predator	RQ-9 Global Hawk	X-47B		Super Heron	MQ9-Reaper	NEUROn		ZOND II	United 40 B5	MIG SKAT
Naval Patrol Aircraft	P-3 Orion	CP-140 Aurora	P-8 Poseidon		Nimrod	CN-235 CASA	C295 Persuader		Tu-142 Bear	Il-38 Dolphin	A-40 Albatros
AWACS	EC-121 Warning Star	E-3 Sentry	E-8 Joint STARS		EC-121 Warning Star	E-3 Sentry	E-8 Joint STARS		Tu-126	A-50 Mainstay	A-100
Naval AWACS	E-2 Hawkeye				Bombardier Globaleye				Tu-126XXXXX
Heavy Bomber	B-47 Stratojet	B-52 Stratofortress	B-1 Lancer		Valiant	Victor	Vulcan		Tu-95 Bear	Tu-22M Backfire	Tu-160 White Swan
Stealth Bomber	B-2 Spirit				SR71 Blackbird				Tu-PakDa
Corvette	Hamilton Class	Cyclone Class	Freedom Class LCS		Descubierta Class	Göteborg Class	Braunschweig Class		Albatros Class	Steregushchiy Class	Gremyashchiy Class
Frigate	Garcia Class	Knox Class	Perry Class		Duke Class	Bremen Class	Horizon Class		Krivak Class	Neutrashimy Class	Admiral Gorshkov Class
Destroyer	Farragut Class	Spruance Class	Arleigh Burke Class		Hamburg Class	Gloucester Class	Daring Class		Kashin Class	Sovremennyy Class	Lider Class
Cruiser	California Class	Virginia Class	Ticonderoga Class		Tiger Class	Vittorio Veneto Class	Absalon Class		Kresta II Class	Kara Class	Slava Class
Aircraft Carrier	Kitty Hawk Class	Nimitz Class	Gerald R. Ford Class		Giuseppe Garibaldi Class	Charles de Gaulle Class	Queen Elizabeth Class		Kiev Class	Kuznetsov Class	Ulyanovsk Class
Attack Submarine	Los Angeles Class	Seawolf Class	Virginia Class		Swiftsure Class	Rubis Class	Astute Class		Viktor Class	Akula Class	Yasen Class
Ballistic Missile Submarine	Benjamin Franklin Class	Ohio Class	Columbia Class		Resolution Class	Vanguard Class	Triomphant Class		Delta Class	Typhoon Class	Borey Class
ICBM	Minuteman III	GBSD			M51.1	M51.2			RT-2PM Topol	RS-26 Rubezh
Ballistic Missile	Pershing I	Pershing II	Pershing III		PGM-17 Thor	SSBS S3	J-600T		Scud	SS-20 Saber	9K720 Iskander
Cruise Missile	Gryphon	Tomahawk	LRSO		RBS-15	KEPD 350	Storm Shadow		P-500 Bazalt	Kh-55	3M-54 Klub`;

const _unitSoftUpgradesData = `Motorized Infantry		Engine Upgrade I	Man Portable Air Defense		Engine Upgrade II		Personal Armor
Mechanized Infantry		Engine Upgrade		NBC Protection	Reinforced Armor
Naval Infantry		Engine Upgrade	Portable Air Defense		NBC Protection
Airborne Infantry		Jungle Warfare Training	Rapid Deployment Training		Woodland Warfare Training	Advanced Ballistic Armor
Special Forces		Portable Air Defense		Amphibious Warfare Training
National Guard		Personal Armor	Rapid Deployment Training I		Rapid Deployment Training II		Streamlined Mobilization
Combat Recon Vehicle		Engine Upgrade	Air Assault		NBC Protection		Reinforced Armor
Armored Fighting Vehicle		Ground-to-Air Armament Upgrade	Reinforced Armor		NBC Protection		Urban Survival Kit
Amphibious Combat Vehicle
Main Battle Tank		Reinforced Armor	Engine Upgrade		NBC Protection		Urban Survival Kit
Tank Destroyer		Anti Personnel Ammunition	Engine Upgrade		Air Assault		Reinforced Armor
Towed Artillery		Rocket Assisted Projectiles		Air Assault	Enhanced Optical Sights		Extended Barrel Upgrade
Mobile Artillery		Rocket Assisted Projectiles	Reinforced Armor		NBC Protection
Multiple Rocket Launcher		Improved Rocket Range	Engine Upgrade
Mobile Anti-Air Vehicle		Reinforced Armor	Engine Upgrade		Air Assault		Ground-to-Air Armament Upgrade
Mobile SAM Launcher		Improved Missile Range	Engine Upgrade		Air Assault
Theater Defense System		Improved Missile Range	Survivability Kit		Stealth Locating System
Mobile Radar		Advanced Sensors Array	Engine Upgrade		Stealth Locating System
Helicopter Gunship		Bulletproofing	Engine Upgrade		AT Missile Pods		Fuel Optimization Measures
Attack Helicopter		Bulletproofing		Fuel Optimization Measures	Engine Upgrade		Streamlined Mobilization
ASW Helicopter		Fuel Optimization Measures	Advanced Sensors Array		Anti-Surface Warfare Kit
Air Superiority Fighter		Reinforced Airframe	Engine Replacement		Fuel Optimization Measures		Streamlined Mobilization
Naval Air Superiority Fighter
Stealth Air Superiority Fighter
Strike Fighter		Reinforced Airframe	Air-to-Air Armament Upgrade		Fuel Optimization Measures		Streamlined Mobilization
Naval Strike Fighter
Stealth Strike Fighter
UAV		Fuel Optimization Measures		Engine Replacement	Reinforced Airframe
Naval Patrol Aircraft		Advanced Sensor Array		Cruise Missile Hardpoints
AWACS		Reinforced Airframe	Advanced Sensor Array		Stealth Locating System
Naval AWACS
Heavy Bomber		Reinforced Airframe	Fuel Optimization Measures		Increased Missile Hardpoints		Bunker Busting Ordnance
Stealth Bomber
Corvette		Survivability Refit	Streamlined Mobilization		Engine Overhaul		Air Defense Upgrade
Frigate		AA Envelope Expansion	Point-Defense Upgrade		Engine Overhaul	Stealth Locating System
Destroyer		Engine Overhaul	Air Defense Upgrade		Survivability Refit
Cruiser		Survivability Refit		Expanded Missile Magazine
Aircraft Carrier		Air Defense Upgrade		Point-Defense Upgrade
Attack Submarine		Survivability Refit	Nuclear Reactor Refit		Expanded Missile Magazine
Ballistic Missile Submarine		Nuclear Reactor Refit	Cruise Missile Launch System		Improved Reloading System	Expanded Missile Magazine
ICBM		Fuel Improvement	Warhead Shielding
Ballistic Missile		Fuel Improvement	Booster Upgrade		Warhead Shielding
Cruise Missile		Booster Upgrade	Fuel Improvement		Warhead Shielding		`;

const _unitBuildingLevelsData = `Army	Motorized Infantry	Mechanized Infantry	Special Forces	Multiple Rocket Launcher	Theater Defense System
	National Guard	Naval Infantry	Mobile Artillery
	Combat Recon Vehicle	Airmobile Infantry	Mobile SAM Launcher
	Mobile Anti-Air Vehicle	Armored Fighting Vehicle	Tank Commander
	Infantry Officer	Amphibious Combat Vehicle
	Airborne Officer	Main Battle Tank
		Tank Destroyer
		Towed Artillery
		Mobile Radar

Air	Helicopter Gunship	Attack Helicopter	Naval Strike Fighter	AWACS	Stealth Air Superiority Fighter
	Air Superiority Fighter	ASW Helicopter	Naval Patrol Aircraft	Naval AWACS	Stealth Strike Fighter
	UAV	Naval Air Superiority Fighter	Heavy Bomber		Stealth Bomber
	Rotary Wing Officer	Strike Fighter

Naval		Corvette	Destroyer	Cruiser	Aircraft Carrier
		Frigate	Attack Submarine	Ballistic Missile Submarine
		Naval Officer	Submarine Commander		`;

const _unitBuildlingPopupCss = `
thead.ext-ub-head {
border-bottom: 1px solid #fff;
}
td.ext-ub-cell-category {
border-right: 1px solid #fff;
}
#ExtUbTable tbody td {
padding: 1rem;
vertical-align: unset;
}
`;

const _unitBuildlingLevelTableTemplate = `<table id="ExtUbTable">
	<thead class="ext-ub-head">
		<tr>
			<th>Building</th>
			<th>Level 1</th>
			<th>Level 2</th>
			<th>Level 3</th>
			<th>Level 4</th>
			<th>Level 5</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td class="ext-ub-cell-category">Army Base</td>
			<td id="army_1"></td>
			<td id="army_2"></td>
			<td id="army_3"></td>
			<td id="army_4"></td>
			<td id="army_5"></td>
		</tr>
		<tr>
			<td class="ext-ub-cell-category">Air Base</td>
			<td id="air_1"></td>
			<td id="air_2"></td>
			<td id="air_3"></td>
			<td id="air_4"></td>
			<td id="air_5"></td>
		</tr>
		<tr>
			<td class="ext-ub-cell-category">Naval Base</td>
			<td id="naval_1"></td>
			<td id="naval_2"></td>
			<td id="naval_3"></td>
			<td id="naval_4"></td>
			<td id="naval_5"></td>
		</tr>
	</tbody>
</table>`;

// NOTE : temp until code for 'native' icons are in place
const _buildingIconSvg = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 442 442" style="enable-background:new 0 0 442 442;" xml:space="preserve">
<g>
	<path d="M382,0H60c-5.523,0-10,4.477-10,10v422c0,5.523,4.477,10,10,10h322c5.523,0,10-4.477,10-10V10C392,4.477,387.523,0,382,0z
		 M295,422h-55V279h55V422z M372,422h-57V269c0-5.523-4.477-10-10-10h-75c-5.523,0-10,4.477-10,10v153H70V20h302V422z"/>
	<path d="M103,128h50c5.523,0,10-4.477,10-10V53c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C93,123.523,97.477,128,103,128z M113,63h30v45h-30V63z"/>
	<path d="M196,128h50c5.523,0,10-4.477,10-10V53c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C186,123.523,190.477,128,196,128z M206,63h30v45h-30V63z"/>
	<path d="M289,128h50c5.523,0,10-4.477,10-10V53c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C279,123.523,283.477,128,289,128z M299,63h30v45h-30V63z"/>
	<path d="M103,236h50c5.523,0,10-4.477,10-10v-65c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C93,231.523,97.477,236,103,236z M113,171h30v45h-30V171z"/>
	<path d="M196,236h50c5.523,0,10-4.477,10-10v-65c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C186,231.523,190.477,236,196,236z M206,171h30v45h-30V171z"/>
	<path d="M289,236h50c5.523,0,10-4.477,10-10v-65c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C279,231.523,283.477,236,289,236z M299,171h30v45h-30V171z"/>
	<path d="M103,344h50c5.523,0,10-4.477,10-10v-65c0-5.523-4.477-10-10-10h-50c-5.523,0-10,4.477-10,10v65
		C93,339.523,97.477,344,103,344z M113,279h30v45h-30V279z"/>
</g></svg>`;

