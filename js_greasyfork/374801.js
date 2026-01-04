// ==UserScript==
// @name         Redacted :: Click Avatars to Mention Users
// @namespace    https://redacted.ch/
// @version      1.2
// @description  Click forum avatars to add [user]username[/user] to the quickpost textarea box.
// @author       newstarshipsmell
// @include      https://redacted.ch/forums.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374801/Redacted%20%3A%3A%20Click%20Avatars%20to%20Mention%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/374801/Redacted%20%3A%3A%20Click%20Avatars%20to%20Mention%20Users.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var avatars = document.querySelectorAll('td.avatar > div > img');
	var usernames = [];
	usernames.length = avatars.length - 1;
	var quickpost = document.querySelector('textarea#quickpost');
	for (var i = 0, len = avatars.length; i < len - 1; i++) {
		usernames[i] = avatars[i].parentNode.parentNode.parentNode.parentNode.querySelector('td > div > strong > a').innerHTML;
		addListener(avatars[i], usernames[i]);
	}

	function addListener(avatar, username) {
		avatar.addEventListener('click', function(){insertQuickpostText(username)}, false);
	}

	function insertQuickpostText(user) {
		quickpost.value += ((quickpost.value == '' || quickpost.value.slice(-1) == ' ' || quickpost.value.slice(-1) == '\n') ? '' : ' ') +
			'[user]' + user + '[/user]';
	}
})();