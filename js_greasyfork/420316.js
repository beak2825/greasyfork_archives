// ==UserScript==
// @name         Improve Google Docs Equation typing
// @namespace    https://mambo.in.ua/en/
// @version      1.1.1
// @icon         https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico
// @description  Exposes latex-like Google Docs equation shortcuts for faster equation typing
// @author       Maksym Patiiuk <maksym.patiiuk@mambo.in.ua> (https://mambo.in.ua/en/)
// @match        https://docs.google.com/document/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420316/Improve%20Google%20Docs%20Equation%20typing.user.js
// @updateURL https://update.greasyfork.org/scripts/420316/Improve%20Google%20Docs%20Equation%20typing.meta.js
// ==/UserScript==

/* jshint esversion: 9 */
/* globals document */

function event_handler(event){
	const icon = event.target.closest('.goog-palette-cell');
	if(icon === null)
		return true;

	add_extra_icons();

	const aria_label = icon.getAttribute('aria-label');

	if(aria_label === null)
		return true;

	display_label(aria_label);
	return true;
}

let formula_container;
function display_label(label){

	if(typeof formula_container === "undefined"){
		const formula_bar_header = document.getElementById('docs-equationtoolbar');
		if(formula_bar_header===null)
			return false;

		formula_container = document.createElement('span');
		formula_bar_header.insertBefore(formula_container,formula_bar_header.children[formula_bar_header.children.length-1]);
	}

	formula_container.innerText = transform_label(label);
}

const replacement_dictionary = {
	overline: 'bar',
	widehat: 'hat',
};

function transform_label(label){

	// some labels are capitalized for some reason
	label = label.toLowerCase();

	// prioritize shorter labels over longer ones
	if(typeof replacement_dictionary[label] !== "undefined")
		label = replacement_dictionary[label];

	// if label ends with `ab`, e.x `sumab`, replace it with a shorter `sum`, as they both work
	if(label.substr(-2)==='ab')
		label = label.substr(0,label.length-2);

	return label;
}

const extra_icons_base_styles = [
	{
		'cursor': 'not-allowed',
	},
	{
		'background-position': 'center',
		'background-repeat': 'no-repeat',
	},
];

let extra_icons_to_add = [
	{
		aria_label: 'vec',
		background_image: 'https://equation-shortcuts.notuom.com/img/vec.png',
		target: 'goog-palette-cell-584',
	},
	{
		aria_label: 'tilde',
		background_image: 'https://equation-shortcuts.notuom.com/img/tilde.png',
		target: 'goog-palette-cell-585',
	},
	{
		aria_label: 'max',
		background_image: 'https://equation-shortcuts.notuom.com/img/max.png',
		target: 'goog-palette-cell-586',
	},
	{
		aria_label: 'min',
		background_image: 'https://equation-shortcuts.notuom.com/img/min.png',
		target: 'goog-palette-cell-587',
	},
	{
		aria_label: 'angle',
		background_image: 'https://equation-shortcuts.notuom.com/img/angle.png',
		target: 'goog-palette-cell-502',
	},
	{
		aria_label: 'nabla',
		background_image: 'https://lh3.googleusercontent.com/proxy/fn5z5iqWJ9kkhl6NvO78ze4ac6jL201hE2o0IIr9yqJBWFrZozroonWrKBoAN28ZBEx49_OWPXBxkaRYxTSkqfxz3ycm5szroRSY9ZNnpFsMz0rBRNlM63zrPpGZs5Jmhk0o7A',
		target: 'goog-palette-cell-503',
		styles: [
			{},
			{
				'background-size': 'contain',
			}
		]
	}
];

const styles_dictionary_to_string = (styles_dictionary)=>
	Object.entries(styles_dictionary).map(([prop_name, prop_value])=>
		`${prop_name}: ${prop_value}`
	).join(';');

const apply_styles = (element, styles_dictionary)=>
	element.style.cssText += styles_dictionary_to_string(styles_dictionary);

const add_extra_icons = ()=>
	extra_icons_to_add = extra_icons_to_add.map((icon)=>{
		const icon_container = document.getElementById(icon.target);
		if(icon_container === null)
			return icon;

		const source_icon = icon_container.previousElementSibling;
		icon_container.innerHTML = source_icon.innerHTML;

		const icon_element = icon_container.children[0];

		if(typeof icon.styles === "undefined")
			icon.styles = [{},{}];

		apply_styles(icon_container,{
			...extra_icons_base_styles[0],
			...icon.styles[0]
		});
		apply_styles(icon_element,{
			...extra_icons_base_styles[1],
			'background-image': `url('${icon.background_image}')`,
			...icon.styles[1]
		});
		icon_container.setAttribute('aria-label', icon.aria_label);

		return false;
	}).filter(icon=>
		icon !== false
	);

(function() {
    'use strict';
    document.addEventListener('mouseover',event_handler);
})();