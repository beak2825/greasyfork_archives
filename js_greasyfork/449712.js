/* eslint-disable no-multi-spaces */
/* eslint-disable userscripts/no-invalid-headers */
/* eslint-disable userscripts/no-invalid-grant */
/* eslint-disable no-implicit-globals */

// ==UserScript==
// @name               assets
// @namespace          Wenku8++
// @version            0.1.4
// @description        Wenku8++ basic assets support
// @author             PY-DNG
// @license            GPL-v3
// @regurl             https?://www\.wenku8\.net/.*
// @protect
// ==/UserScript==

(function() {
	const FLAG = {
		SYSTEM: 1,
		NO_UNINSTALL: 2,
		NO_DISABLE: 4
	};
	const ClassName = {
		Button: 'plus_btn',
		Text: 'plus_text',
		Disabled: 'plus_disabled'
	};
	const URL = {};
	const Color = {
		Text: 'rgb(30, 100, 220)',
		Button: 'rgb(0, 160, 0)',
		ButtonHover: 'color: rgb(0, 100, 0)',
		ButtonFocus: 'color: rgb(0, 100, 0)',
		ButtonDisabled: 'rgba(150, 150, 150)',
	};
	const CSS = {
		Button_Text_Disabled: `.${ClassName.Text} {color: ${Color.Text} !important;} .${ClassName.Button} {color: ${Color.Button} !important; cursor: pointer !important; user-select: none;} .${ClassName.Button}:hover {${Color.ButtonHover} !important;} .${ClassName.Button}:focus {${Color.ButtonFocus} !important;} .${ClassName.Button}.${ClassName.Disabled} {color: ${Color.ButtonDisabled} !important; cursor: not-allowed !important;}`
	};
	const Number = {
		Interval: 500
	};
	const Text = {
		'zh-CN': {}
	};

	// Init language
	let i18n = navigator.language;
	let i18n_default = 'zh-CN';
	if (!Object.keys(Text).includes(i18n)) {i18n = i18n_default;}

	// Common css
	addStyle(CSS.Button_Text_Disabled);

	// Export
	exports = {
		FLAG: FLAG,
		ClassName: ClassName,
		URL: URL,
		Color: Color,
		CSS: CSS,
		Number: Number,
		Text: Text[i18n],
		Text_Full: Text
	}

	// Append a style text to document(<head>) with a <style> element
	function addStyle(css, id) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#' + id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
		document.head.appendChild(style);
	}
}) ();