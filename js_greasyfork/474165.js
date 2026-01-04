// ==UserScript==
// @name            5ちゃんねるsageチェックボックス
// @name:en         5ch.net sage checkbox
// @version         1.0.4
// @license         MIT License
// @description     5ちゃんねるのメールアドレス欄にsageコマンドを入力するチェックボックスを追加します。
// @description:en  Add a check box to enter the sage command in the email address field of 5ch.net.
// @match           http://*.5ch.net/*
// @match           https://*.5ch.net/*
// @match           http://*.bbspink.com/*
// @match           https://*.bbspink.com/*
// @namespace       https://greasyfork.org/users/1160382
// @downloadURL https://update.greasyfork.org/scripts/474165/5%E3%81%A1%E3%82%83%E3%82%93%E3%81%AD%E3%82%8Bsage%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/474165/5%E3%81%A1%E3%82%83%E3%82%93%E3%81%AD%E3%82%8Bsage%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
	var mail_address_input = document.getElementsByName('mail');
	var len = mail_address_input.length;

	for (var i = 0; i < len; i++) {
		mail_address_input.item(i).value=`sage`;
	}

	if (len == 0) {
	} else {
		var body_elem = document.getElementsByTagName('body').item(0);
		body_elem.insertAdjacentHTML('afterbegin', '<div style="position:fixed;bottom:50px;right:15px;background:rgba(220,220,220,0.9);border-radius:5px;box-shadow:0 0 8px gray;padding-top:5px;padding-bottom:10px;padding-left:10px;padding-right:9px;letter-spacing:.01em;line-height:1;user-select:none;z-index:10000;"><input type="checkbox" id="sage-checkbox-greasyfork-org-users-1160382" name="sage-checkbox-greasyfork-org-users-1160382" style="display:inline-block;margin:0;box-sizing:content-box;width:12px;height:12px;vertical-align:middle;appearance:auto;" onclick="var mail_address_input = document.getElementsByName(`mail`);var len = mail_address_input.length;if (document.getElementById(`sage-checkbox-greasyfork-org-users-1160382`).checked) {for (var i = 0; i < len; i++) {mail_address_input.item(i).value=`sage`;}} else {for (var i = 0; i < len; i++) {if (mail_address_input.item(i).value == `sage`) {mail_address_input.item(i).value=``;}}}" checked /><label for="sage-checkbox-greasyfork-org-users-1160382" style="display:inline-block;font-weight:normal;font-size:large;margin:0;letter-spacing:.01em;line-height:1;padding-left:4px;color:#000;">sage</label></div>');
	}
})
