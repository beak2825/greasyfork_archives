/* eslint-disable no-multi-spaces */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */

// ==UserScript==
// @name               SidePanel
// @namespace          Wenku8++
// @version            0.1.5
// @description        轻小说文库++的侧边工具栏
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @require            https://greasyfork.org/scripts/449412-basic-functions/code/Basic%20Functions.js?version=1085783
// @grant              none
// ==/UserScript==

(function __MAIN__() {
	'use strict';

	const tippy = require('tippy');

	exports = sideFunctions();

	// Side functions area
	function sideFunctions() {
		const SPanel = new SidePanel();
		SPanel.create();
		SPanel.setPosition('bottom-right');
		addStyle('#sidepanel-panel {background-color: #00000000;z-index: 4000;}.sidepanel-button {font-size: 1vmin;color: #1E64DC;background-color: #FDFDFD;}.sidepanel-button:hover, .sidepanel-button.low-opacity:hover {opacity: 1;color: #FDFDFD;background-color: #1E64DC;}.sidepanel-button.low-opacity{opacity: 0.4 }.sidepanel-button>i[class^="fa-"] {line-height: 3vmin;width: 3vmin;}.sidepanel-button[class*="tooltip"]:hover::after {font-size: 0.9rem;top: calc((5vmin - 25px) / 2);}.sidepanel-button[class*="tooltip"]:hover::before {top: calc((5vmin - 12px) / 2);}.sidepanel-button.accept-pointer{pointer-events:auto;}');

		commonButtons();
		return SPanel;

		function commonButtons() {
			// Button show/hide-all-buttons
			const btnShowHide = SPanel.add({
				faicon: 'fa-solid fa-down-left-and-up-right-to-center',
				className: 'accept-pointer',
				tip: '隐藏面板',
				onclick: (function() {
					let hidden = false;
					return (e) => {
						hidden = !hidden;
						btnShowHide.faicon.className = 'fa-solid ' + (hidden ? 'fa-up-right-and-down-left-from-center' : 'fa-down-left-and-up-right-to-center');
						btnShowHide.classList[hidden ? 'add' : 'remove']('low-opacity');
						btnShowHide.setAttribute('aria-label', (hidden ? '显示面板' : '隐藏面板'));
						SPanel.elements.panel.style.pointerEvents = hidden ? 'none' : 'auto';
						for (const button of SPanel.elements.buttons) {
							if (button === btnShowHide) {continue;}
							//button.style.display = hidden ? 'none' : 'block';
							button.style.pointerEvents = hidden ? 'none' : 'auto';
							button.style.opacity = hidden ? '0' : '1';
						}
					};
				}) ()
			});

			// Button scroll-to-bottom
			const btnDown = SPanel.add({
				faicon: 'fa-solid fa-angle-down',
				tip: '转到底部',
				onclick: (e) => {
					const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

					for (const elm of elms) {
						elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, elm.scrollHeight);
					}
				}
			});

			// Button scroll-to-top
			const btnUp = SPanel.add({
				faicon: 'fa-solid fa-angle-up',
				tip: '转到顶部',
				onclick: (e) => {
					const elms = [document.body.parentElement, $('#content'), $('#contentmain')];

					for (const elm of elms) {
						elm && elm.scrollTo && elm.scrollTo(elm.scrollLeft, 0);
					}
				}
			});

			// Darkmode
			/*
			const btnDarkmode = SPanel.add({
				faicon: 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon'),
				tip: '明暗切换',
				onclick: (e) => {
					DMode.toggle();
					btnDarkmode.faicon.className = 'fa-solid ' + (DMode.isActivated() ? 'fa-sun' : 'fa-moon');
				}
			});
			*/

			// Refresh page
			const btnRefresh = SPanel.add({
				faicon: 'fa-solid fa-rotate-right',
				tip: '刷新页面',
				onclick: (e) => {
					location.href = location.href;
				}
			});
		}
	}

    // Side-located control panel
	// Requirements: FontAwesome, tippy.js, addStyle
	// Use 'new' keyword
	function SidePanel() {
		// Public SP
		const SP = this;
		const elms = SP.elements = {};

		// Private _SP
		// keys start with '_' shouldn't be modified
		const _SP = {
			_id: {
				css: 'sidepanel-style',
				usercss: 'sidepanel-style-user',
				panel: 'sidepanel-panel'
			},
			_class: {
				button: 'sidepanel-button'
			},
			_directions: ['left', 'right', 'top', 'bottom']
		};

		addStyle('#sidepanel-panel {position: fixed; background-color: #00000000; padding: 0.5vmin; line-height: 3.5vmin; height: auto; display: flex; transition-duration: 0.3s; z-index: 9999999999;} #sidepanel-panel.right {right: 3vmin;} #sidepanel-panel.bottom {bottom: 3vmin; flex-direction: column-reverse;} #sidepanel-panel.left {left: 3vmin;} #sidepanel-panel.top {top: 3vmin; flex-direction: column;} .sidepanel-button {padding: 1vmin; margin: 0.5vmin; font-size: 3.5vmin; border-radius: 10%; text-align: center; color: #00000088; background-color: #FFFFFF88; box-shadow:3px 3px 2px #00000022; user-select: none; transition-duration: inherit;} .sidepanel-button:hover {color: #FFFFFFDD; background-color: #000000DD;}', 'sidepanel');

		SP.create = function() {
			// Create panel
			const panel = elms.panel = document.createElement('div');
			panel.id = _SP._id.panel;
			SP.setPosition('bottom-right');
			document.body.appendChild(panel);

			// Prepare buttons
			elms.buttons = [];
		}

		// Insert a button to given index
		// details = {index, text, faicon, id, tip, className, onclick, listeners}, all optional
		// listeners = [..[..args]]. [..args] will be applied as button.addEventListener's args
		// faicon = 'fa-icon-name-classname fa-icon-style-classname', this arg stands for a FontAwesome icon to be inserted inside the botton
		// Returns the button(HTMLDivElement), including button.faicon(HTMLElement/HTMLSpanElement in firefox, <i>) if faicon is set
		SP.insert = function(details) {
			const index = details.index;
			const text = details.text;
			const faicon = details.faicon;
			const id = details.id;
			const tip = details.tip;
			const className = details.className;
			const onclick = details.onclick;
			const listeners = details.listeners || [];

			const button = document.createElement('div');
			text && (button.innerHTML = text);
			id && (button.id = id);
			tip && setTooltip(button, tip); //settip(button, tip);
			className && (button.className = className);
			onclick && (button.onclick = onclick);
			if (faicon) {
				const i = document.createElement('i');
				i.className = faicon;
				button.faicon = i;
				button.appendChild(i);
			}
			for (const listener of listeners) {
				button.addEventListener.apply(button, listener);
			}
			button.classList.add(_SP._class.button);

			elms.buttons = insertItem(elms.buttons, button, index);
			index < elms.buttons.length ? elms.panel.insertBefore(button, elms.panel.children[index]) : elms.panel.appendChild(button);
			return button;
		}

		// Append a button
		SP.add = function(details) {
			details.index = elms.buttons.length;
			return SP.insert(details);
		}

		// Remove a button
		SP.remove = function(arg) {
			let index, elm;
			if (arg instanceof HTMLElement) {
				elm = arg;
				index = elms.buttons.indexOf(elm);
			} else if (typeof(arg) === 'number') {
				index = arg;
				elm = elms.buttons[index];
			} else if (typeof(arg) === 'string') {
				elm = $(elms.panel, arg);
				index = elms.buttons.indexOf(elm);
			}

			elms.buttons = delItem(elms.buttons, index);
			elm.parentElement.removeChild(elm);
		}

		// Sets the display position by texts like 'right-bottom'
		SP.setPosition = function(pos) {
			const poses = _SP.direction = pos.split('-');
			const avails = _SP._directions;

			// Available check
			if (poses.length !== 2) {return false;}
			for (const p of poses) {
				if (!avails.includes(p)) {return false;}
			}

			// remove all others
			for (const p of avails) {
				elms.panel.classList.remove(p);
			}

			// add new pos
			for (const p of poses) {
				elms.panel.classList.add(p);
			}

			// Change tooltips' direction
			elms.buttons && elms.buttons.forEach(setTooltipDirection);
		}

		// Gets the current display position
		SP.getPosition = function() {
			return _SP.direction.join('-');
		}

		// Append a style text to document(<head>) with a <style> element
		// Replaces existing id-specificed <style>s
		function spAddStyle(css, id) {
			const style = document.createElement("style");
			id && (style.id = id);
			style.textContent = css;
			for (const elm of $All('#'+id)) {
				elm.parentElement && elm.parentElement.removeChild(elm);
			}
			document.head.appendChild(style);
		}

		// Set a tooltip to the element
		function setTooltip(elm, text, direction='auto') {
			elm.tooltip = tippy(elm, {
				content: text,
				arrow: true,
				hideOnClick: false
			});

			setTooltipDirection(elm, direction);
		}

		function setTooltipDirection(elm, direction='auto') {
			direction === 'auto' && (direction = _SP.direction.includes('left') ? 'right' : 'left');
			if (!_SP._directions.includes(direction)) {throw new Error('setTooltip: invalid direction');}

			// Tippy direction
			if (!elm.tooltip) {
				DoLog(LogLevel.Error, 'SidePanel.setTooltipDirection: Given elm has no tippy instance(elm.tooltip)');
				throw new Error('SidePanel.setTooltipDirection: Given elm has no tippy instance(elm.tooltip)');
			}
			elm.tooltip.setProps({
				placement: direction
			});
		}

		// Del an item from an array using its index. Returns the array but can NOT modify the original array directly!!
		function delItem(arr, index) {
			arr = arr.slice(0, index).concat(arr.slice(index+1));
			return arr;
		}

		// Insert an item into an array using given index. Returns the array but can NOT modify the original array directly!!
		function insertItem(arr, item, index) {
			arr = arr.slice(0, index).concat(item).concat(arr.slice(index));
			return arr;
		}
	}
})();