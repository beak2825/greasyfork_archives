/* eslint-disable no-multi-spaces */
/* eslint-disable no-implicit-globals */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               SettingPanel
// @displayname        SettingPanel
// @namespace          Wenku8++
// @version            0.3.9
// @description        SettingPanel for wenku8++
// @author             PY-DNG
// @license            GPL-v3
// @regurl             NONE
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @require            https://greasyfork.org/scripts/449583-configmanager/code/ConfigManager.js?version=1085836
// @grant              none
// ==/UserScript==

/*
计划任务：
[x] 表格线换成蓝色的
[x] 允许使用不同的alertify对话框
[x] 点击按钮的时候要有GUI反馈
[ ] 未保存内容，关闭窗口前要有提示
[ ] 提供注册SettingOptions组件的接口
*/

(function __MAIN__() {
    'use strict';

	const ASSETS = require('assets');
	const alertify = require('alertify');
	const CONST = {
		Text: {
			Saved: '已保存',
			Reset: '已恢复到修改前'
		},
		Manager_Config_Ruleset: {
			'version-key': 'config-version',
			'ignores': ["LOCAL-CDN"],
			'defaultValues': {
				//'config-key': {},
			}
		}
	};
	const SettingOptionElements = {
		'string': {
			createElement: function() {const e = $CrE('input'); e.style.width = '90%'; return e;},
			setValue: function(val) {this.element.value = val;},
			getValue: function() {return this.element.value;},
		},
		'number': {
			createElement: function() {const e = $CrE('input'); e.type = 'number'; e.style.width = '90%'; return e;},
			setValue: function (val) {this.element.value = val;},
			getValue: function() {return this.element.value;},
		},
		'boolean': {
			createElement: function() {const e = $CrE('input'); e.type = 'checkbox'; return e;},
			setValue: function(val) {this.element.checked = val;},
			getValue: function(data) {return this.element.checked ? (this.hasOwnProperty('data') ? this.data.checked : true) : (data ? this.data.unchecked : false);},
		},
		'select': {
			createElement: (() => {const e = $CrE('select'); this.hasOwnProperty('data') && this.data.forEach((d) => {const o = $CrE('option'); o.innerText = d; e.appendChild(o)}); return e;}),
			setValue: (val) => (Array.from(this.element.children).find((opt) => (opt.value === val)).selected = true),
			getValue: function() {return this.element.value;},
		}
	}

	// initialize
	alertify.dialog('setpanel', function factory(){
		return {
			// The dialog startup function
			// This will be called each time the dialog is invoked
			// For example: alertify.myDialog( data );
			main:function(){
				// Split arguments
				let content, header, buttons, onsave, onreset, onclose;
				switch (arguments.length) {
					case 1:
						switch (typeof arguments[0]) {
							case 'string':
								content = arguments[0];
								break;
							case 'object':
								arguments[0].hasOwnProperty('content') && (content = arguments[0].content);
								arguments[0].hasOwnProperty('header')  && (header = arguments[0].header);
								arguments[0].hasOwnProperty('buttons') && (buttons = arguments[0].buttons);
								arguments[0].hasOwnProperty('onsave')  && (onsave = arguments[0].onsave);
								arguments[0].hasOwnProperty('onreset') && (onreset = arguments[0].onreset);
								arguments[0].hasOwnProperty('onclose') && (buttons = arguments[0].onclose);
								break;
							default:
								Err('Arguments invalid', 1);
						}
						break;
					case 2:
						content = arguments[0];
						header = arguments[1];
						break;
					case 3:
						content = arguments[0];
						header = arguments[1];
						buttons = buttons[2];
						break;
				}

				// Prepare dialog
				this.resizeTo('80%', '80%');
				content && this.setContent(content);
				header  && this.setHeader(header);
				onsave  && this.set('onsave', onsave);
				onreset && this.set('onreset', onreset);
				onclose && this.set('onclose', onclose);

				// Choose & show selected button groups
				const btnGroups = {
					// Close button only
					basic: [[1, 0]],

					// Save & reset button
					saver: [[0, 0], [1, 1]]
				};
				const group = btnGroups[buttons || 'basic'];
				const divs = ['auxiliary', 'primary'];
				divs.forEach((div) => {
					Array.from(this.elements.buttons[div].children).forEach((btn) => {
						btn.style.display = 'none';
					});
				});
				group.forEach((button) => {
					this.elements.buttons[divs[button[0]]].children[button[1]].style.display = '';
				});

				return this;
			},
			// The dialog setup function
			// This should return the dialog setup object ( buttons, focus and options overrides ).
			setup:function(){
				return {
					/* buttons collection */
					buttons:[{
						/* button label */
						text: '恢复到修改前',

						/*bind a keyboard key to the button */
						key: undefined,

						/* indicate if closing the dialog should trigger this button action */
						invokeOnClose: false,

						/* custom button class name  */
						className: alertify.defaults.theme.cancel,

						/* custom button attributes  */
						attrs: {},

						/* Defines the button scope, either primary (default) or auxiliary */
						scope:'auxiliary',

						/* The will conatin the button DOMElement once buttons are created */
						element: undefined
					},{
						/* button label */
						text: '关闭',

						/*bind a keyboard key to the button */
						key: undefined,

						/* indicate if closing the dialog should trigger this button action */
						invokeOnClose: false,

						/* custom button class name  */
						className: alertify.defaults.theme.ok,

						/* custom button attributes  */
						attrs: {},

						/* Defines the button scope, either primary (default) or auxiliary */
						scope:'primary',

						/* The will conatin the button DOMElement once buttons are created */
						element: undefined
					},{
						/* button label */
						text: '保存',

						/*bind a keyboard key to the button */
						key: undefined,

						/* indicate if closing the dialog should trigger this button action */
						invokeOnClose: false,

						/* custom button class name  */
						className: alertify.defaults.theme.ok,

						/* custom button attributes  */
						attrs: {},

						/* Defines the button scope, either primary (default) or auxiliary */
						scope:'primary',

						/* The will conatin the button DOMElement once buttons are created */
						element: undefined
					}],

					/* default focus */
					focus:{
						/* the element to receive default focus, has differnt meaning based on value type:
                            number:     action button index.
                            string:     querySelector to select from dialog body contents.
                            function:   when invoked, should return the focus element.
                            DOMElement: the focus element.
                            object:     an object that implements .focus() and .select() functions.
                        */
						element: 0,

						/* indicates if the element should be selected on focus or not*/
						select: true

					},
					/* dialog options, these override the defaults */
					options: {
						title: 'Setting Panel',
						modal: true,
						basic: false,
						frameless: false,
						pinned: false,
						movable: true,
						moveBounded: false,
						resizable: true,
						autoReset: false,
						closable: true,
						closableByDimmer: true,
						maximizable: false,
						startMaximized: false,
						pinnable: false,
						transition: 'fade',
						padding: true,
						overflow: true,
						/*
						onshow:...,
						onclose:...,
						onfocus:...,
						onmove:...,
						onmoved:...,
						onresize:...,
						onresized:...,
						onmaximize:...,
						onmaximized:...,
						onrestore:...,
						onrestored:...
						*/
					}
				};
			},
			// This will be called once the dialog DOM has been created, just before its added to the document.
			// Its invoked only once.
			build:function(){

				// Do custom DOM manipulation here, accessible via this.elements

				// this.elements.root           ==> Root div
				// this.elements.dimmer         ==> Modal dimmer div
				// this.elements.modal          ==> Modal div (dialog wrapper)
				// this.elements.dialog         ==> Dialog div
				// this.elements.reset          ==> Array containing the tab reset anchor links
				// this.elements.reset[0]       ==> First reset element (button).
				// this.elements.reset[1]       ==> Second reset element (button).
				// this.elements.header         ==> Dialog header div
				// this.elements.body           ==> Dialog body div
				// this.elements.content        ==> Dialog body content div
				// this.elements.footer         ==> Dialog footer div
				// this.elements.resizeHandle   ==> Dialog resize handle div

				// Dialog commands (Pin/Maximize/Close)
				// this.elements.commands           ==> Object containing  dialog command buttons references
				// this.elements.commands.container ==> Root commands div
				// this.elements.commands.pin       ==> Pin command button
				// this.elements.commands.maximize  ==> Maximize command button
				// this.elements.commands.close     ==> Close command button

				// Dialog action buttons (Ok, cancel ... etc)
				// this.elements.buttons                ==>  Object containing  dialog action buttons references
				// this.elements.buttons.primary        ==>  Primary buttons div
				// this.elements.buttons.auxiliary      ==>  Auxiliary buttons div

				// Each created button will be saved with the button definition inside buttons collection
				// this.__internal.buttons[x].element

			},
			// This will be called each time the dialog is shown
			prepare:function(){
				// Do stuff that should be done every time the dialog is shown.
			},
			// This will be called each time an action button is clicked.
			callback:function(closeEvent){
				//The closeEvent has the following properties
				//
				// index: The index of the button triggering the event.
				// button: The button definition object.
				// cancel: When set true, prevent the dialog from closing.
				const myEvent = deepClone(closeEvent);
				switch (closeEvent.index) {
					case 0: {
						// Rests button
						closeEvent.cancel = myEvent.cancel = true;
						myEvent.save = false;
						myEvent.reset = true;
						const onreset = this.get('onreset');
						typeof onreset === 'function' && onreset(myEvent);
						break;
					}
					case 1: {
						// Close button
						// Do something here if need
						break;
					}
					case 2: {
						// Save button
						closeEvent.cancel = myEvent.cancel = true;
						myEvent.save = true;
						myEvent.reset = false;
						const onsave = this.get('onsave');
						typeof onsave === 'function' && onsave(myEvent);
					}
				}
				this.get(myEvent.save ? 'saver' : 'reseter').call(this);
				closeEvent.cancel = myEvent.cancel;
			},
			// To make use of AlertifyJS settings API, group your custom settings into a settings object.
			settings:{
				onsave: function() {},
				onreset: function() {},
				options: [], // SettingOption array
				saver: function() {
					this.get('options').forEach((o) => (o.save()));
				},
				reseter: function() {
					this.get('options').forEach((o) => (o.reset()));
				}
			},
			// AlertifyJS will invoke this each time a settings value gets updated.
			settingUpdated:function(key, oldValue, newValue){
				// Use this to respond to specific setting updates.
				const _this = this;
				['onsave', 'onreset', 'saver', 'reseter'].includes(key) && check('function');
				['options'].includes(key) && check(Array);

				function rollback() {
					_this.set(key, oldValue);
				}

				function check(type) {
					valid(oldValue, type) && !valid(newValue, type) && rollback();
				}

				function valid(value, type) {
					return ({
						'string': () => (typeof value === type),
						'function': () => (value instanceof type)
					})[typeof type]();
				}
			},
			// listen to internal dialog events.
			hooks:{
				// triggered when the dialog is shown, this is seperate from user defined onshow
				onshow: function() {
					this.resizeTo('80%', '80%');
				},
				// triggered when the dialog is closed, this is seperate from user defined onclose
				onclose: function() {
					const onclose = this.get('onclose');
					typeof onclose === 'function' && onclose();
				},
				// triggered when a dialog option gets updated.
				// IMPORTANT: This will not be triggered for dialog custom settings updates ( use settingUpdated instead).
				onupdate: function() {
				}
			}
		}
	}, true);

	exports = {
		SettingPanel: SettingPanel,
		SettingOption: SettingOption,
		optionAvailable: optionAvailable,
		isOption: isOption,
		registerElement: registerElement,
	};

	// A table-based setting panel using alertify-js
	// For wenku8++ only version
	// Use 'new' keyword
	// Usage:
	/*
		var panel = new SettingPanel({
			buttons: 0,
			header: '',
			className: '',
			id: '',
			name: '',
			tables: [
				{
					className: '',
					id: '',
					name: '',
					rows: [
						{
							className: '',
							id: '',
							name: '',
							blocks: [
								{
									isHeader: false,
									width: '',
									height: '',
									innerHTML / innerText: ''
									colSpan: 1,
									rowSpan: 1,
									className: '',
									id: '',
									name: '',
									options: [SettingOption, ...]
									children: [HTMLElement, ...]
								},
								...
							]
						},
						...
					]
				},
				...
			]
		});
	*/
	function SettingPanel(details={}, storage) {
		const SP = this;
		SP.insertTable = insertTable;
		SP.appendTable = appendTable;
		SP.removeTable = removeTable;
		SP.remove = remove;
		SP.PanelTable = PanelTable;
		SP.PanelRow = PanelRow;
		SP.PanelBlock = PanelBlock;

		// <div> element
		const elm = $CrE('div');
		copyProps(details, elm, ['id', 'name', 'className']);
		elm.classList.add('settingpanel-container');

		// Configure object
		let css='', usercss='';
		SP.element = elm;
		SP.elements = {};
		SP.children = {};
		SP.tables = [];
		SP.length = 0;
		details.id !== undefined && (SP.elements[details.id] = elm);
		copyProps(details, SP, ['id', 'name']);
		Object.defineProperty(SP, 'css', {
			configurable: false,
			enumerable: true,
			get: function() {
				return css;
			},
			set: function(_css) {
				addStyle(_css, 'settingpanel-css');
				css = _css;
			}
		});
		Object.defineProperty(SP, 'usercss', {
			configurable: false,
			enumerable: true,
			get: function() {
				return usercss;
			},
			set: function(_usercss) {
				addStyle(_usercss, 'settingpanel-usercss');
				usercss = _usercss;
			}
		});
		SP.css = `.settingpanel-table {border-spacing: 0px; border-collapse: collapse; width: 100%; margin: 2em 0;} .settingpanel-block {border: 1px solid ${ASSETS.Color.Text}; text-align: center; vertical-align: middle; padding: 3px; text-align: left;} .settingpanel-header {font-weight: bold;}`

		// Make alerity box
		const box = SP.alertifyBox = alertify.setpanel({
			onsave: function() {
				alertify.notify(CONST.Text.Saved);
			},
			onreset: function() {
				alertify.notify(CONST.Text.Reset);
			},
			buttons: details.hasOwnProperty('buttons') ? details.buttons : 'basic'
		});
		clearChildNodes(box.elements.content);
		box.elements.content.appendChild(elm);
		box.elements.content.style.overflow = 'auto';
		box.setHeader(details.header);
		box.setting({
			maximizable: true,
			overflow: true
		});
		!box.isOpen() && box.show();

		// Create tables
		if (details.tables) {
			for (const table of details.tables) {
				if (table instanceof PanelTable) {
					appendTable(table);
				} else {
					appendTable(new PanelTable(table));
				}
			}
		}

		// Insert a Panel-Row
		// Returns Panel object
		function insertTable(table, index) {
			// Insert table
			!(table instanceof PanelTable) && (table = new PanelTable(table));
			index < SP.length ? elm.insertBefore(table.element, elm.children[index]) : elm.appendChild(table.element);
			insertItem(SP.tables, table, index);
			table.id !== undefined && (SP.children[table.id] = table);
			SP.length++;

			// Set parent
			table.parent = SP;

			// Inherit elements
			for (const [id, subelm] of Object.entries(table.elements)) {
				SP.elements[id] = subelm;
			}

			// Inherit children
			for (const [id, child] of Object.entries(table.children)) {
				SP.children[id] = child;
			}
			return SP;
		}

		// Append a Panel-Row
		// Returns Panel object
		function appendTable(table) {
			return insertTable(table, SP.length);
		}

		// Remove a Panel-Row
		// Returns Panel object
		function removeTable(index) {
			const table = SP.tables[index];
			SP.element.removeChild(table.element);
			removeItem(SP.rows, index);
			return SP;
		}

		// Remove itself from parentElement
		// Returns Panel object
		function remove() {
			SP.element.parentElement && SP.parentElement.removeChild(SP.element);
			return SP;
		}

		// Panel-Table object
		// Use 'new' keyword
		function PanelTable(details={}) {
			const PT = this;
			PT.insertRow = insertRow;
			PT.appendRow = appendRow;
			PT.removeRow = removeRow;
			PT.remove = remove

			// <table> element
			const elm = $CrE('table');
			copyProps(details, elm, ['id', 'name', 'className']);
			elm.classList.add('settingpanel-table');

			// Configure
			PT.element = elm;
			PT.elements = {};
			PT.children = {};
			PT.rows = [];
			PT.length = 0;
			details.id !== undefined && (PT.elements[details.id] = elm);
			copyProps(details, PT, ['id', 'name']);

			// Append rows
			if (details.rows) {
				for (const row of details.rows) {
					if (row instanceof PanelRow) {
						insertRow(row);
					} else {
						insertRow(new PanelRow(row));
					}
				}
			}

			// Insert a Panel-Row
			// Returns Panel-Table object
			function insertRow(row, index) {
				// Insert row
				!(row instanceof PanelRow) && (row = new PanelRow(row));
				index < PT.length ? elm.insertBefore(row.element, elm.children[index]) : elm.appendChild(row.element);
				insertItem(PT.rows, row, index);
				row.id !== undefined && (PT.children[row.id] = row);
				PT.length++;

				// Set parent
				row.parent = PT;

				// Inherit elements
				for (const [id, subelm] of Object.entries(row.elements)) {
					PT.elements[id] = subelm;
				}

				// Inherit children
				for (const [id, child] of Object.entries(row.children)) {
					PT.children[id] = child;
				}
				return PT;
			}

			// Append a Panel-Row
			// Returns Panel-Table object
			function appendRow(row) {
				return insertRow(row, PT.length);
			}

			// Remove a Panel-Row
			// Returns Panel-Table object
			function removeRow(index) {
				const row = PT.rows[index];
				PT.element.removeChild(row.element);
				removeItem(PT.rows, index);
				return PT;
			}

			// Remove itself from parentElement
			// Returns Panel-Table object
			function remove() {
				PT.parent instanceof SettingPanel && PT.parent.removeTable(PT.tables.indexOf(PT));
				return PT;
			}
		}

		// Panel-Row object
		// Use 'new' keyword
		function PanelRow(details={}) {
			const PR = this;
			PR.insertBlock = insertBlock;
			PR.appendBlock = appendBlock;
			PR.removeBlock = removeBlock;
			PR.remove = remove;

			// <tr> element
			const elm = $CrE('tr');
			copyProps(details, elm, ['id', 'name', 'className']);
			elm.classList.add('settingpanel-row');

			// Configure object
			PR.element = elm;
			PR.elements = {};
			PR.children = {};
			PR.blocks = [];
			PR.length = 0;
			details.id !== undefined && (PR.elements[details.id] = elm);
			copyProps(details, PR, ['id', 'name']);

			// Append blocks
			if (details.blocks) {
				for (const block of details.blocks) {
					if (block instanceof PanelBlock) {
						appendBlock(block);
					} else {
						appendBlock(new PanelBlock(block));
					}
				}
			}

			// Insert a Panel-Block
			// Returns Panel-Row object
			function insertBlock(block, index) {
				// Insert block
				!(block instanceof PanelBlock) && (block = new PanelBlock(block));
				index < PR.length ? elm.insertBefore(block.element, elm.children[index]) : elm.appendChild(block.element);
				insertItem(PR.blocks, block, index);
				block.id !== undefined && (PR.children[block.id] = block);
				PR.length++;

				// Set parent
				block.parent = PR;

				// Inherit elements
				for (const [id, subelm] of Object.entries(block.elements)) {
					PR.elements[id] = subelm;
				}

				// Inherit children
				for (const [id, child] of Object.entries(block.children)) {
					PR.children[id] = child;
				}
				return PR;
			};

			// Append a Panel-Block
			// Returns Panel-Row object
			function appendBlock(block) {
				return insertBlock(block, PR.length);
			}

			// Remove a Panel-Block
			// Returns Panel-Row object
			function removeBlock(index) {
				const block = PR.blocks[index];
				PR.element.removeChild(block.element);
				removeItem(PR.blocks, index);
				return PR;
			}

			// Remove itself from parent
			// Returns Panel-Row object
			function remove() {
				PR.parent instanceof PanelTable && PR.parent.removeRow(PR.parent.rows.indexOf(PR));
				return PR;
			}
		}

		// Panel-Block object
		// Use 'new' keyword
		function PanelBlock(details={}) {
			const PB = this;
			PB.remove = remove;

			// <td> element
			const elm = $CrE(details.isHeader ? 'th' : 'td');
			copyProps(details, elm, ['innerText', 'innerHTML', 'colSpan', 'rowSpan', 'id', 'name', 'className']);
			copyProps(details, elm.style, ['width', 'height']);
			elm.classList.add('settingpanel-block');
			details.isHeader && elm.classList.add('settingpanel-header');

			// Configure object
			PB.element = elm;
			PB.elements = {};
			PB.children = {};
			details.id !== undefined && (PB.elements[details.id] = elm);
			copyProps(details, PB, ['id', 'name']);

			// Append to parent if need
			details.parent instanceof PanelRow && (PB.parent = details.parent.appendBlock(PB));

			// Append SettingOptions if exist
			if (details.options) {
				details.options.filter(storage ? () => (true) : isOption).map((o) => (isOption(o) ? o : new SettingOption(storage, o))).forEach(function(option) {
					SP.alertifyBox.get('options').push(option);
					elm.appendChild(option.element);
				});
			}

			// Append child elements if exist
			if (details.children) {
				for (const child of details.children) {
					elm.appendChild(child);
				}
			}

			// Remove itself from parent
			// Returns Panel-Block object
			function remove() {
				PB.parent instanceof PanelRow && PB.parent.removeBlock(PB.parent.blocks.indexOf(PB));
				return PB;
			}
		}

		function $R(e) {return $(e) && $(e).parentElement.removeChild($(e));}
		function insertItem(arr, item, index) {
			for (let i = arr.length; i > index ; i--) {
				arr[i] = arr[i-1];
			}
			arr[index] = item;
			return arr;
		}
		function removeItem(arr, index) {
			for (let i = index; i < arr.length-1; i++) {
				arr[i] = arr[i+1];
			}
			delete arr[arr.length-1];
			return arr;
		}
		function MakeReadonlyObj(val) {
			return isObject(val) ? new Proxy(val, {
				get: function(target, property, receiver) {
					return MakeReadonlyObj(target[property]);
				},
				set: function(target, property, value, receiver) {},
				has: function(target, prop) {}
			}) : val;

			function isObject(value) {
				return ['object', 'function'].includes(typeof value) && value !== null;
			}
		}
	}

	// details = {path='config path', type='config type', data='option data'}
	function SettingOption(storage, details={}) {
		const SO = this;
		SO.save = save;
		SO.reset = reset;

		// Initialize ConfigManager
		!storage && Err('SettingOption requires GM_storage functions');
		const CM = new ConfigManager(CONST.Manager_Config_Ruleset, storage);
		const CONFIG = CM.Config;

		// Get args
		const options = ['path', 'type', 'checker', 'data', 'autoSave'];
		copyProps(details, SO, options);

		// Get first available type if multiple types provided
		Array.isArray(SO.type) && (SO.type = SO.type.find((t) => (optionAvailable(t))));
		!optionAvailable(SO.type) && Err('Unsupported Panel-Option type: ' + details.type);

		// Create element
		const original_value = CM.getConfig(SO.path);
		const SOE = {
			create: SettingOptionElements[SO.type].createElement.bind(SO),
			get: SettingOptionElements[SO.type].getValue.bind(SO),
			set: SettingOptionElements[SO.type].setValue.bind(SO),
		}
		SO.element = SOE.create();
		SOE.set(original_value);

		// Bind change-checker-saver
		SO.element.addEventListener('change', function(e) {
			if (SO.checker) {
				if (SO.checker(e, SOE.get())) {
					SO.autoSave && save();
				} else {
					// Reset value
					reset();

					// Do some value-invalid reminding here
				}
			} else {
				SO.autoSave && save();
			}
		});

		function save() {
			CM.setConfig(SO.path, SOE.get());
		}

		function reset(save=false) {
			SOE.set(original_value);
			save && CM.setConfig(SO.path, original_value);
		}
	}

	// Check if an settingoption type available
	function optionAvailable(type) {
		return Object.keys(SettingOptionElements).includes(type);
	}

	// Register SettingOption element
	function registerElement(name, obj) {
		const formatOkay = typeof obj.createElement === 'function' && typeof obj.setValue === 'function' && typeof obj.getValue === 'function';
		const noConflict = !SettingOptionElements.hasOwnProperty(name);
		const okay = formatOkay && noConflict;
		okay && (SettingOptionElements[name] = obj);
		return okay;
	}

	function isOption(obj) {
		return obj instanceof SettingOption;
	}

	// Deep copy an object
	function deepClone(obj) {
		let newObj = Array.isArray(obj) ? [] : {};
		if (obj && typeof obj === "object") {
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					newObj[key] = (obj && typeof obj[key] === 'object') ? deepClone(obj[key]) : obj[key];
				}
			}
		}
		return newObj;
	}
})();