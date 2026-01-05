// ==UserScript==
// @name        Steam guide links
// @description Converts guides into links
// @namespace   https://github.com/Farow/userscripts
// @include     http://steamcommunity.com/app/*/guides/*
// @version     1.0.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18292/Steam%20guide%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/18292/Steam%20guide%20links.meta.js
// ==/UserScript==

rename_elements('workshopItemCollection');
rename_elements('guide_home_category_selection');

function rename_elements(class_name) {
	var elements = document.getElementsByClassName(class_name);

	for (var i = 0, element; element = elements[i]; i++) {
		var link       = document.createElement('a');

		link.href      = element.getAttribute('onclick').slice(19, -1);
		link.innerHTML = element.innerHTML;

		link.style.setProperty('display', 'block');
		link.classList.add(class_name);

		element.parentElement.replaceChild(link, element);
	}
}