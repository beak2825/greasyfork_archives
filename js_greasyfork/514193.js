// ==UserScript==
// @name        [PS] Import Only Init
// @namespace   https://greasyfork.org/en/users/1357767-indigeau
// @version     0.1
// @description Updates selected set when toggling "Only show imported sets".
// @match       https://calc.pokemonshowdown.com/*
// @author      indigeau
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pokemonshowdown.com
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/514193/%5BPS%5D%20Import%20Only%20Init.user.js
// @updateURL https://update.greasyfork.org/scripts/514193/%5BPS%5D%20Import%20Only%20Init.meta.js
// ==/UserScript==

const getImportSetOption = (root) => {
	const dropdown = $(root.querySelector('.poke-info > .select2-container'));
	
	dropdown.select2('open');
	
	const id = document.querySelector('.select2-result-selectable')?.innerText ?? '';
	
	dropdown.select2('close');
	
	return id;
};

// Setup toggle listeners
for (const target of document.querySelectorAll('#importedSets')) {
	const root = target.parentElement.parentElement;
	
	target.addEventListener('change', () => {
		const id = target.checked ? getImportSetOption(root) : window.getFirstValidSetOption().id;
		
		$(root.querySelector('input.set-selector')).val(id).change();
		root.querySelector('.select2-chosen').innerText = id;
	});
}

/* global $ */
