// ==UserScript==
// @name       	kaldataReplaceNames
// @author  bornofash
// @description Замени имената на хората, които споменаваш в постовете.
// @match  	https://www.kaldata.com/*
// @require	https://code.jquery.com/jquery-3.3.1.min.js
// @require https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @grant	GM.setValue
// @grant	GM.getValue
// @version 1
// @namespace https://greasyfork.org/users/196421
// @downloadURL https://update.greasyfork.org/scripts/373640/kaldataReplaceNames.user.js
// @updateURL https://update.greasyfork.org/scripts/373640/kaldataReplaceNames.meta.js
// ==/UserScript==

waitForKeyElements('aside.cAuthorPane', name_change);

function name_change(pane) {
	var profile = pane.find('strong a').attr('href');
	var name_and_id = profile.split('/')[5];
	var userid = name_and_id.split('-')[0].toString();
	var username = name_and_id.split('-')[1];
	var gender = pane.find('li:contains("Пол:") span.fc').text();
	
	var btn = $('<li class="ipsType_break"><span class="ft">a.k.a. </span><span><a uname href="javascript:void(0)"></a></span></li>');
	if (gender === "Жена") {
		btn.attr('title', 'Задай име, с което ще се заменя нейното, когато я споменаваш в постовете.');
	} else {
		btn.attr('title', 'Задай име, с което ще се заменя неговото, когато го споменаваш в постовете.');
	}
	btn.click(function() {
		var new_name = prompt('Въведи прякор за ' + decodeURIComponent(username));
		if (new_name === "") {
			GM.deleteValue(userid);
			set_name();
		} else if (new_name != null) {
			GM.setValue(userid, new_name);
			set_name();
		}
	});
	btn.appendTo(pane.find('ul.cAuthorPane_info'));
	async function set_name() {
		var uname = await GM.getValue(userid);
		if (uname != undefined) {
			pane.find('a[uname]').text(uname);
		} else {
			pane.find('a[uname]').text('(смени)');
		}
	}
	set_name();
}

waitForKeyElements('div.cke_editable a[data-mentionid]', change);

function change(id) {
	var userid = id.attr('data-mentionid').toString();
	async function set_name() {
		var uname = await GM.getValue(userid);
		if (uname != undefined) {
			id.text('@' + uname);
		}
	}
	set_name();
}
