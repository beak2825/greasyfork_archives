// ==UserScript==
// @name                WME Presets
// @namespace           https://greasyfork.org/en/users/46070
// @description         Save/load settings for WME Layers plus scripts
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @supportURL          https://www.waze.com/forum/viewtopic.php?f=819&t=314906
// @version             1.1
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/423282/WME%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/423282/WME%20Presets.meta.js
// ==/UserScript==

/* eslint-env jquery */
/* global W, GM */
// jshint esversion: 6

(function() {

// global variables
var prefix = "WMEPresets";
var version = '1.1';
var updateMessage = `WME Presets has been updated to version ${version}

• UI changes so the script works without WME FixUI installed
• Adjustments to work with Firefox
• Removal of Font Awesome dependency loaded by another script`;
var debug = false;
if (typeof GM !== 'undefined') {
	if (GM.info.script.version == '0.0') {
		//running locally for me as an @require script
		debug = true;
	}
}
var options;
var keepOpen = false;

function init1(e) {
	if (e && e.user == null) {
		return;
	}
	logit("Starting init1","debug");
	if (typeof W === 'undefined' || typeof W.loginManager === 'undefined') {
		setTimeout(init1, 200);
		return;
	}
	// go round again if search box isn't there yet
	if (getById('search') == null) {
		logit("waiting for search box...","debug");
		setTimeout(init1, 200);
		return;
	}
	//pass control to init2
	init2();
}

function init2() {
	logit("Starting init2","debug");
	loadSettings();
	// overload the window unload function to save my settings
	window.addEventListener("beforeunload", saveSettings, false);
	if (!W.selectionManager.getSelectedFeatures) {
		W.selectionManager.getSelectedFeatures = W.selectionManager.getSelectedItems;
	}
	//create Button div
	var div = document.createElement('div');
	div.id = "WMEPresetsDiv";
	div.classList.add('ItemInactive','toolbar-group','toolbar-submenu');
	div.innerHTML = `<i class="toolbar-icon w-icon waze-icon-layers"></i>
<menu class="dropdown-menu"></menu>`;
	div.onmouseenter = myButtonEnter;
	div.onmouseleave = myButtonLeave;
	div.children[0].title = `WME Presets v${version}\n\nCTRL+click for Waze Forum topic`;
	div.children[0].onclick = function (e) { myButtonClicked(e);};
	// div.children[0].style = 'height: calc(100% - 16px)';
	div.children[1].appendChild(MenuNLDiv());
	insertNodeAfterNode(div,getById('search'));
	//Populate loaded NL sets to menu
	for (let name of options.NL.keys()) {
		AddNLListItem(name);
	}
	//Add menu divs for other scripts
	div.children[1].appendChild(MenuCHDiv());
	for (let name of options.CH.keys()) {
		AddCHListItem(name);
	}
	div.children[1].appendChild(MenuTBHLDiv());
	for (let name of options.TBHL.keys()) {
		AddTBHLListItem(name);
	}
	ShowScriptDivs(1);
	//Add CSS for my elements
	var styles = "";
	styles = '#WMEPresetsDiv div { margin-left: 10px; }';
	styles += '#WMEPresetsDiv > i { height: calc(100% - 16px);}';
	styles += '#WMEPresetsDiv ul { list-style:none; padding-left:10px; margin-bottom: 0px; border-bottom: 1px solid;}';
	styles += '#WMEPresetsDiv li { display: flex; white-space: nowrap; justify-content: space-between; }';
	styles += '#WMEPresetsDiv .buttondiv { display: flex; margin-right: 5px; visibility: hidden; }';
	styles += '#WMEPresetsDiv .buttondiv-open { visibility: visible; }';
	styles += '#WMEPresetsDiv menu { width: auto; min-width: 230px; }';
	styles += '#WMEPresetsDiv toolbar-button { line-height: 18px; right: 10px; }';
	styles += '#WMEPresetsDiv b { white-space: nowrap; margin-right: 30px; }';
	styles += '#WMEPresetsDiv button { height: 22px; margin: -1px 0; padding: 0 1px; border: none; font-size: small; }';
	addStyle('WMEPresetsStyle',styles);
	//check for update
	if (version != options.oldVersion){
		getById('WMEPresetsDiv').children[0].style.color = 'red';
		getById('WMEPresetsDiv').children[0].title = 'WME Presets has been updated.\nClick for more info.';
	}

	logit("Initialisation complete");
	// console.timeEnd(prefix + ": initialisation time");
	// console.groupEnd();
}

function loadSettings() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (localStorage.WMESSSettings) {
		//change old settings name to new
		localStorage.WMEPresets = localStorage.WMESSSettings;
		localStorage.removeItem('WMESSSettings');
	}
	if (localStorage.WMEPresets) {
		options = JSON.parse(localStorage.WMEPresets,reviver);
	} else {
		options = {};
	}
	if (options.oldVersion == undefined) options.oldVersion = '0.0';
	if (options.NL == undefined) options.NL = new Map();
	if (options.CH == undefined) options.CH = new Map();
	if (options.TBHL == undefined) options.TBHL = new Map();
}

function saveSettings() {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (localStorage) {
		localStorage.WMEPresets = JSON.stringify(options,replacer);
	} else {
		logit('Local storage not found','error');
	}
	logit(options,'debug');
}

function replacer(key, value) {
	if(value instanceof Map) {
		return {
			dataType: 'Map',
			value: Array.from(value.entries()), // or with spread: value: [...value]
		};
	} else {
	return value;
	}
}

function reviver(key, value) {
	if(typeof value === 'object' && value !== null) {
		if (value.dataType === 'Map') {
			return new Map(value.value);
		}
	}
	return value;
}

function myButtonEnter () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	getById('WMEPresetsDiv').classList.add('open');
}

function myButtonLeave () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (!keepOpen) getById('WMEPresetsDiv').classList.remove('open');
}

function myButtonClicked (e) {
	if (e.altKey && debug) {
		keepOpen = !keepOpen;
		return;
	}
	if (e.ctrlKey) {
		window.open('https://www.waze.com/forum/viewtopic.php?f=819&t=314906');
		return;
	}
	if (version != options.oldVersion) {
		getById('WMEPresetsDiv').children[0].style.color = '';
		getById('WMEPresetsDiv').children[0].title = `WME Presets v${version}\n\nCTRL+click for Waze Forum topic`;
		options.oldVersion = version;
		alert(updateMessage);
	}
}

// Functions for NL menu
function MenuNLDiv() {
	var div = document.createElement('div');
	div.innerHTML = `
<b>WME Layers</b>
<i class="toolbar-icon w-icon waze-icon-plus" style="right:5px;margin-top:-4px"></i>
<ul id="WMEPresets_NLmenu"></ul>`;
	div.children[1].onclick = AddNLClicked;
	return div;
}

function AddNLClicked () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newname = prompt ('Enter new set name:');
	if (newname == null || newname == '') return;
	if (options.NL.has(newname)) {
			alert('Set ' + newname + ' already exists');
			return;	
	}
	AddNLListItem(newname);
	options.NL.set(newname, JSON.parse(JSON.stringify(W.layerSwitcherController.checkboxState.attributes)));
}

function AddNLListItem (name) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newli = document.createElement('li');
	newli.innerText = name;
	newli.onclick = function (e) { NLItemClick(name,e);};
	newli.appendChild(ButtonDiv(NLItemClick,'NL'));
	newli.onmouseenter = function (e) { e.target.firstElementChild.classList.add('buttondiv-open');};
	newli.onmouseleave = function (e) { e.target.firstElementChild.classList.remove('buttondiv-open');};
	getById('WMEPresets_NLmenu').appendChild(newli);
}

function NLItemClick (name,e) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (e.target.tagName !== 'LI') return;
	for (var i in options.NL.get(name)) {
		// logit(i + ' : ' + options.NL.get(name)[i], 'debug');
		if (W.layerSwitcherController.getTogglerState(i) !== undefined) {
			W.layerSwitcherController.setTogglerState(i, options.NL.get(name)[i]);
		} else {
			logit('Layers set ' + name + ' contains non-existent layer ' + i,'error');
		}
	}
}

function ShowScriptDivs (attempt) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + "called, attempts = " + attempt, "debug");
	if (attempt == 50) {
		//stop trying after 10 seconds
		return;
	}
	var scriptcount = 0;
	if (getById('sidepanel-highlights') !== null) {
		getById('WMEPresets_MenuCHDiv').style.display = '';
		scriptcount++;
	}
	if (getById('tb-highlightsContainer') !== null) {
		getById('WMEPresets_MenuTBHLDiv').style.display = '';
		scriptcount++;
	}
	if (scriptcount < 2) setTimeout(ShowScriptDivs,200,attempt+1);
}

//Functions for WMECH menu
function MenuCHDiv() {
	var div = document.createElement('div');
	div.id = 'WMEPresets_MenuCHDiv';
	div.style.display = 'none';
	div.innerHTML = `
<b title="WME Colour Highlights settings">WMECH settings</b>
<i class="toolbar-icon w-icon waze-icon-plus" style="right:5px;margin-top:-4px"></i>
<ul id="WMEPresets_CHmenu"></ul>`;
	div.children[1].onclick = AddCHClicked;
	return div;
}

function AddCHClicked () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newname = prompt ('Enter new set name:');
	if (newname == null || newname == '') return;
	if (options.CH.has(newname)) {
			alert('Set ' + newname + ' already exists');
			return;	
	}
	AddCHListItem(newname);
	var inputs = getById('sidepanel-highlights').getElementsByTagName('input');
	var toSave = [];
	var item;
	var i;
	for (i = 0; i < inputs.length; i++) {
		item = {};
		item.name = inputs[i].id;
		item.type = inputs[i].type;
		switch (item.type) {
			case 'checkbox':
				item.value = inputs[i].checked;
				break;
			case 'number':
				item.value = inputs[i].value;
				break;
			default:
				item.value = 'unhandled';
		} 
		toSave.push(item);
	}
	options.CH.set(newname, toSave);
}

function AddCHListItem (name) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newli = document.createElement('li');
	newli.innerText = name;
	newli.onclick = function (e) { CHItemClick(name,e);};
	newli.appendChild(ButtonDiv(CHItemClick,'CH'));
	newli.onmouseenter = function (e) { e.target.firstElementChild.classList.add('buttondiv-open');};
	newli.onmouseleave = function (e) { e.target.firstElementChild.classList.remove('buttondiv-open');};
	getById('WMEPresets_CHmenu').appendChild(newli);
}

function CHItemClick (name,e) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (e.target.tagName !== 'LI') return;
	var toSet = options.CH.get(name);
	for (var i=0; i<toSet.length; i++) {
		if (getById(toSet[i].name) == undefined) {
			logit('Missing WMECH input ' + getById(toSet[i].name), 'error');
		} else {
			switch (toSet[i].type) {
				case 'checkbox':
					getById(toSet[i].name).checked = toSet[i].value;
					break;
				case 'number':
					getById(toSet[i].name).value = toSet[i].value;
					break;
				default:
					//donothing
			} 
		}
	}
}

//Functions for WMETBHL menu
function MenuTBHLDiv() {
	var div = document.createElement('div');
	div.id = 'WMEPresets_MenuTBHLDiv';
	div.style.display = 'none';
	div.innerHTML = `
<b title="WME Toolbox Highlights settings">TB Highlights</b>
<i class="toolbar-icon w-icon waze-icon-plus" style="right:5px;margin-top:-4px"></i>
<ul id="WMEPresets_TBHLmenu"></ul>`;
	div.children[1].onclick = AddTBHLClicked;
	return div;
}

function AddTBHLClicked () {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newname = prompt ('Enter new set name:');
	if (newname == null || newname == '') return;
	if (options.TBHL.has(newname)) {
			alert('Set ' + newname + ' already exists');
			return;	
	}
	AddTBHLListItem(newname);
	var inputs = getById('tb-highlightsContainer').getElementsByTagName('input');
	var toSave = [];
	var item;
	var i;
	for (i = 0; i < inputs.length; i++) {
		item = {};
		item.name = inputs[i].id;
		item.type = inputs[i].type;
		switch (item.type) {
			case 'checkbox':
				item.value = inputs[i].checked;
				break;
			case 'color':
				item.value = inputs[i].value;
				break;
			default:
				item.value = 'unhandled';
		} 
		toSave.push(item);
	}
	options.TBHL.set(newname, toSave);
}

function AddTBHLListItem (name) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	var newli = document.createElement('li');
	newli.innerText = name;
	newli.onclick = function (e) { TBHLItemClick(name,e);};
	newli.appendChild(ButtonDiv(TBHLItemClick,'TBHL'));
	newli.onmouseenter = function (e) { e.target.firstElementChild.classList.add('buttondiv-open');};
	newli.onmouseleave = function (e) { e.target.firstElementChild.classList.remove('buttondiv-open');};
	getById('WMEPresets_TBHLmenu').appendChild(newli);
}

function TBHLItemClick (name,e) {
	var fname = arguments.callee.toString().match(/function ([^(]+)/)[1];
	logit("function " + fname + " called", "debug");
	if (e.target.tagName !== 'LI') return;
	var toSet = options.TBHL.get(name);
	var changeEvent = new Event('change');
	for (var i=0; i<toSet.length; i++) {
		if (getById(toSet[i].name) == undefined) {
			logit('Missing WMETBHL input ' + getById(toSet[i].name), 'error');
		} else {
			switch (toSet[i].type) {
				case 'checkbox':
					if (getById(toSet[i].name).checked != toSet[i].value) {
						getById(toSet[i].name).click();
					}
					break;
				case 'color':
					if (getById(toSet[i].name).value != toSet[i].value) {
						getById(toSet[i].name).value = toSet[i].value;
						getById(toSet[i].name).dispatchEvent(changeEvent);
					}
					break;
				default:
					//donothing
			} 
		}
	}
}

//common functions for preset controls
function ButtonDiv (func,settingsGroup) {
	var div = document.createElement('div');
	div.classList.add('buttondiv');
	var button;
	button = document.createElement('button');
	button.classList.add('fa','fa-pencil');
	button.title = 'Rename';
	button.onclick = function(e) { ItemButtonClicked(func,settingsGroup,e); };
	div.appendChild(button);
	button = document.createElement('button');
	button.classList.add('fa','fa-arrow-up');
	button.title = 'Move up';
	button.onclick = function(e) { ItemButtonClicked(func,settingsGroup,e); };
	div.appendChild(button);
	button = document.createElement('button');
	button.classList.add('fa','fa-arrow-down');
	button.title = 'Move down';
	button.onclick = function(e) { ItemButtonClicked(func,settingsGroup,e); };
	div.appendChild(button);
	button = document.createElement('button');
	button.classList.add('fa','fa-times');
	button.title = 'Delete';
	button.onclick = function(e) { ItemButtonClicked(func,settingsGroup,e); };
	div.appendChild(button);
	// div.onclick = function (e) { func(name,e);};
	return div;
}

function ItemButtonClicked (func,settingsGroup,e) {
	var newmap = new Map();
	var parentli = e.target.parentNode.parentNode;
	var oldname = parentli.childNodes[0].textContent;
	if (e.target.classList.contains('fa-pen')) {
		var newname = prompt('New set name:');
		if (options[settingsGroup].has(newname)) {
			alert('Set "' + newname + '" already exists');
		} else if (newname != null && newname != '') {
			parentli.childNodes[0].textContent = newname;
			parentli.onclick = function (e) { func(newname,e);};
			for (let [key,value] of options[settingsGroup]) {
				if (key == oldname) {
					newmap.set(newname, value);
				} else {
					newmap.set(key,value);
				}
			}
			options[settingsGroup] = newmap;
		}
	}
	var orderChanged = false;
	if (e.target.classList.contains('fa-arrow-up')) {
		if (parentli.previousSibling !== null) {
			parentli.previousSibling.insertAdjacentElement('beforebegin',parentli);
			orderChanged = true;
		}
	}
	if (e.target.classList.contains('fa-arrow-down')) {
		if (parentli.nextSibling !== null) {
			parentli.nextSibling.insertAdjacentElement('afterend',parentli);
			orderChanged = true;
		}
	}
	if (orderChanged) {
		// redo map in new order
		for (var i = 0; i < parentli.parentNode.children.length; i++) {
			newmap.set(parentli.parentNode.children[i].innerText,options[settingsGroup].get(parentli.parentNode.children[i].innerText));
		}
		options[settingsGroup] = newmap;
	}
	if (e.target.classList.contains('fa-times')) {
		e.target.parentNode.parentNode.remove();
		options[settingsGroup].delete(oldname);
	}
	e.target.blur();
}

function addStyle(ID, css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	removeStyle(ID); // in case it is already there
	style = document.createElement('style');
	style.innerHTML = css;
	style.id = ID;
	head.appendChild(style);
}

function removeStyle(ID) {
	var style = document.getElementById(ID);
	if (style) { style.parentNode.removeChild(style); }
}

function getById(node) {
	return document.getElementById(node);
}

function insertNodeBeforeNode (insertNode, beforeNode) {
	beforeNode.parentNode.insertBefore(insertNode,beforeNode);
}

function insertNodeAfterNode (insertNode, afterNode) {
	insertNodeBeforeNode (insertNode, afterNode);
	insertNodeBeforeNode (afterNode,insertNode);
}

function logit(msg, typ) {
	if (!typ) {
		console.log(prefix + ": " + msg);
	} else {
		switch(typ) {
			case "error":
				console.error(prefix + ": " + msg);
				break;
			case "warning":
				console.warn(prefix + ": " + msg);
				break;
			case "info":
				console.info(prefix + ": " + msg);
				break;
			case "debug":
				if (debug) {
					console.warn(prefix + ": " + msg);
				}
				break;
			default:
				console.log(prefix + " unknown message type: " + msg);
				break;
		}
	}
}

// Start it running
setTimeout(init1, 200);
})();