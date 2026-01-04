// ==UserScript==
// @name         Image Names
// @namespace    http://tampermonkey.net/
// @version      5.0.1
// @description  Load Image Pokemon Name By HyperBeam and RenjiYuusei
// @run-at       document-end
// @author       @HyperBeam & @RenjiYuusei
// @match        *://sangtacviet.vip/truyen/*
// @license      GPL-3.0
// @icon64       https://sangtacviet.vip/favicon.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/502509/Image%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/502509/Image%20Names.meta.js
// ==/UserScript==

(function () {
	'use strict';

	//Chiều rộng bảng edit name STV
	const NAME_EDITOR_MOBILE_WIDTH = '100%';
	const NAME_EDITOR_PC_WIDTH = '50%';

	const STYLES = {
		'.pokemon-image': {
			width: '50px',
			height: '50px',
		},
		'.pokemon-type': {
			width: '25px',
			height: '25px',
		},
		'.pokemon-ball': {
			width: '35px',
			height: '35px',
		},
		'.type': {
			fontWeight: 'bold',
			textShadow: '1px 1px 0 #222, -1px -1px 0 #222, 1px -1px 0 #222, -1px 1px 0 #222',
		},
		'i:has(img), i:has(span)': {
			whiteSpace: 'nowrap',
		},
		'i > img': {
			display: 'inline-block',
			marginTop: '-5px',
		},
		'#configBox': {
			zIndex: '100',
		},
	};

	const TYPE_COLOR = {
		Normal: '#ededed',
		Fire: '#ff9236',
		Water: '#75d0ff',
		Electric: '#ffcd2c',
		Grass: '#70ffa2',
		Ice: '#4dffee',
		Fighting: '#ff4f61',
		Poison: '#ff4ae5',
		Ground: '#ebbb8a',
		Flying: '#c6d7ff',
		Psychic: '#ff9999',
		Bug: '#d7ff71',
		Rock: '#fff7bd',
		Ghost: '#a689ff',
		Dragon: '#6a90ff',
		Dark: '#dfd0ff',
		Steel: '#36c4d3',
		Fairy: '#ffa5e2',
	};

	const BUTTON_STYLES = {
		fontSize: '14px',
		outline: 'none',
		borderRadius: '100%',
		height: '50px',
		width: '50px',
		marginBottom: '10px',
		cursor: 'pointer',
		border: '1px solid #ccc',
		backgroundColor: '#f0f0f0',
		transition: 'background-color 0.3s',
	};

	const INPUT_STYLE = {
		width: '200px',
		height: '8px',
		borderRadius: '5px',
		outline: 'none',
		marginLeft: '5px',
	};

	const RESIZE_INPUT_MIN_SIZE = 20;
	const RESIZE_INPUT_MAX_SIZE = 80;
	const RESIZE_INPUT_STEP = 10;

	const DEFAULT_CONFIG = {
		showCopyButton: true,
		showNamesButton: true,
		showReloadButton: true,
		showResizeInput: true,
	};

	let config = { ...DEFAULT_CONFIG };

	function loadConfig() {
		const savedConfig = GM_getValue('imageNamesConfig');
		if (savedConfig) {
			config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
		}
	}

	function saveConfig() {
		GM_setValue('imageNamesConfig', JSON.stringify(config));
	}

	let imageSize = '50';

	function loadImageSize() {
		const savedImageSize = GM_getValue('imageSize');
		if (savedImageSize) {
			imageSize = JSON.parse(savedImageSize);
		}
	}

	function saveImageSize() {
		GM_setValue('imageSize', JSON.stringify(imageSize));
	}

	function updateStyle() {
		STYLES['.pokemon-image'].width = imageSize;
		STYLES['.pokemon-image'].height = imageSize;
	}

	function applyStyles() {
		updateStyle();

		document.querySelectorAll('i').forEach(tag => {
			if (/<img|<span/.test(tag.textContent)) {
				tag.innerHTML = tag.textContent;
			}
		});

		Object.entries(STYLES).forEach(([selector, styles]) => {
			document.querySelectorAll(selector).forEach(element => {
				Object.assign(element.style, styles);
			});
		});

		Object.entries(TYPE_COLOR).forEach(([selector, color]) => {
			Array.from(document.getElementsByClassName(selector)).forEach(element => {
				element.style.color = color;
			});
		});
	}

	function createButton({ text, onClickFunction }) {
		const button = document.createElement('button');
		Object.assign(button.style, BUTTON_STYLES);

		button.textContent = text;
		button.addEventListener('mouseover', () => (button.style.backgroundColor = '#e0e0e0'));
		button.addEventListener('mouseout', () => (button.style.backgroundColor = '#f0f0f0'));
		button.addEventListener('click', onClickFunction);

		return button;
	}

	function createInput({ name, type, event, handler }) {
		const input = document.createElement('input');
		Object.assign(input.style, INPUT_STYLE);

		input.name = name;
		input.type = type;
		input.addEventListener(event, handler);

		return input;
	}

	function clickButton(selector) {
		document.querySelector(`button[onclick='${selector}']`)?.click();
	}

	function createBoxMenu() {
		const boxMenu = document.createElement('div');
		Object.assign(boxMenu.style, {
			position: 'fixed',
			bottom: '100px',
			right: '10px',
			display: 'flex',
			alignItems: 'end',
			flexDirection: 'column',
			zIndex: '1',
			width: '0',
		});

		const buttons = [
			{ condition: 'showCopyButton', text: 'Copy', onClickFunction: copyToClipboard },
			{ condition: 'showNamesButton', text: 'Names', onClickFunction: () => clickButton('showNS()') },
			{ condition: 'showReloadButton', text: 'Reload', onClickFunction: () => clickButton('excute()') },
			{ condition: true, text: 'Config', onClickFunction: createConfigMenu },
		];

		buttons.forEach(({ condition, ...props }) => {
			if (config[condition] || condition === true) {
				boxMenu.appendChild(createButton(props));
			}
		});

		if (config.showResizeInput) {
			const props = {
				name: 'resize',
				type: 'range',
				event: 'input',
				handler: event => {
					imageSize = event.target.value;
					saveImageSize();
					applyStyles();
				},
			};

			const input = createInput(props);
			const resizeInput = createResizeInput(input);

			boxMenu.appendChild(resizeInput);
		}

		document.body.appendChild(boxMenu);
	}

	function createResizeInput(input) {
		input.value = imageSize;
		input.min = RESIZE_INPUT_MIN_SIZE;
		input.max = RESIZE_INPUT_MAX_SIZE;
		input.step = RESIZE_INPUT_STEP;
		input.style.appearance = 'auto';
		input.style.display = 'flex';

		const dataList = document.createElement('datalist');
		dataList.id = 'size-list';

		for (let i = RESIZE_INPUT_MIN_SIZE; i <= RESIZE_INPUT_MAX_SIZE; i += RESIZE_INPUT_STEP) {
			const option = document.createElement('option');
			option.value = i;
			dataList.appendChild(option);
		}

		input.setAttribute('list', 'size-list');

		const resizeInput = document.createElement('label');
		resizeInput.appendChild(document.createTextNode(`Resize:`));
		resizeInput.appendChild(dataList);
		resizeInput.appendChild(input);
		return resizeInput;
	}

	async function copyToClipboard(e) {
		try {
			const copyText = document.querySelector('#namewd')?.value || '';
			await navigator.clipboard.writeText(copyText);
			e.target.textContent = 'Copied!';
		} catch (err) {
			e.target.textContent = 'Error!';
		} finally {
			setTimeout(() => {
				e.target.textContent = 'Copy';
			}, 2000);
		}
	}

	function createConfigMenu() {
		const modal = document.createElement('div');
		Object.assign(modal.style, {
			position: 'fixed',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			zIndex: '1000',
		});

		const menuContent = document.createElement('div');
		Object.assign(menuContent.style, {
			backgroundColor: 'white',
			padding: '20px',
			borderRadius: '10px',
			maxWidth: '300px',
			width: '90%',
		});

		const title = document.createElement('h2');
		title.textContent = 'Configuration';
		title.style.marginTop = '0';
		menuContent.appendChild(title);

		Object.keys(config).forEach(key => {
			const label = document.createElement('label');
			label.style.display = 'block';
			label.style.marginBottom = '10px';

			const checkbox = document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = config[key];
			checkbox.id = key;
			checkbox.style.appearance = 'auto';
			checkbox.addEventListener('change', e => {
				config[key] = e.target.checked;
			});

			label.appendChild(checkbox);
			label.appendChild(document.createTextNode(' ' + createLabelName(key)));
			menuContent.appendChild(label);
		});

		const buttonContainer = document.createElement('div');
		buttonContainer.style.display = 'flex';
		buttonContainer.style.justifyContent = 'space-between';
		buttonContainer.style.marginTop = '20px';

		const saveButton = createButton({
			text: 'Save',
			onClickFunction: () => {
				saveConfig();
				modal.remove();
				location.reload();
			},
		});
		saveButton.style.borderRadius = '5px';
		saveButton.style.marginRight = '10px';
		saveButton.style.flex = '1';

		const cancelButton = createButton({ text: 'Cancel', onClickFunction: () => modal.remove() });
		cancelButton.style.borderRadius = '5px';
		cancelButton.style.flex = '1';

		buttonContainer.appendChild(saveButton);
		buttonContainer.appendChild(cancelButton);
		menuContent.appendChild(buttonContainer);

		modal.appendChild(menuContent);
		document.body.appendChild(modal);
	}

	function createLabelName(key) {
		return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
	}

	function styleNameSettings() {
		const namewdf = document.querySelector('#namewdf');
		const namewd = document.querySelector('#namewd');

		if (window.innerWidth <= 600) {
			// Mobile styles
			namewdf.style.width = NAME_EDITOR_MOBILE_WIDTH;
		} else {
			// PC styles
			namewdf.style.width = NAME_EDITOR_PC_WIDTH;
		}

		Object.assign(namewd.style, {
			fontSize: '12px',
			lineHeight: '1.8',
			padding: '10px',
			outline: 'none',
			height: '60vh',
		});
	}

	function autoReload() {
		const actions = [
			"addSuperName('hv','z')",
			"addSuperName('hv','f')",
			"addSuperName('hv','s')",
			"addSuperName('hv','l')",
			"addSuperName('hv','a')",
			"addSuperName('el')",
			"addSuperName('vp')",
			"addSuperName('kn')",
			"addSuperName('el')",
			"addSuperName('hv','a')",
			'saveNS();excute();',
			'excute()',
		];

		actions.forEach(action => {
			const button = document.querySelector(`[onclick="${action}"]`);
			if (button) {
				button.addEventListener('click', applyStyles);
			}
		});
	}

	function init() {
		loadConfig();
		loadImageSize();
		applyStyles();
		createBoxMenu();
		styleNameSettings();
		autoReload();
	}

	requestAnimationFrame(() => {
		setTimeout(init, 2000);
	});
})();
