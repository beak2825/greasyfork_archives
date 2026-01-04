// ==UserScript==
// @name    kaldata Spoiler
// @description Създава спойлер бутон в лентата с инструменти
// @match  	https://www.kaldata.com/forums/*
// @require	https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @version 5
// @namespace https://greasyfork.org/users/196421
// @downloadURL https://update.greasyfork.org/scripts/372982/kaldata%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/372982/kaldata%20Spoiler.meta.js
// ==/UserScript==

window.jQ = $.noConflict(true);

waitForKeyElements('.cke_toolgroup', add_button);

function create_button(pos, cmd, title) {
	var button, icon;
	button = $('<a></a>');
	button.attr({
		'class':'cke_button cke_button_off',
		'title': title,
		'role':'button'
	});
	icon = $('<span></span>');
	icon.attr({
		'class':'cke_button_icon',
	});
	icon.css({
		"background-image": "url('//www.kaldata.com/forums/applications/core/interface/ckeditor/ckeditor/plugins/icons.png?t=I6QJ')",
		"background-position": "0 " + pos,
		"background-size": "auto"
	});
	button.click(function() {
		var currentInstance = unsafeWindow.CKEDITOR.currentInstance.name;
		unsafeWindow.CKEDITOR.instances[currentInstance].execCommand(cmd);
	});
	icon.appendTo(button);
	return $(button);
}

function add_button(toolbar) {
	toolbar.append(create_button('-696px', 'ipsspoiler', 'Спойлер'));
	//toolbar.append(create_button('-698px', 'ipspage', 'Черта'));
	toolbar.append(create_button('-936px', 'source', 'Редактирай HTML кода'));
}
