// ==UserScript==
// @name         Redacted :: Hide Badges
// @namespace    https://greasyfork.org/en/scripts/377201-redacted-hide-badges
// @version      1.2
// @description  Hides all badges.
// @author       newstarshipsmell
// @match        https://redacted.ch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377201/Redacted%20%3A%3A%20Hide%20Badges.user.js
// @updateURL https://update.greasyfork.org/scripts/377201/Redacted%20%3A%3A%20Hide%20Badges.meta.js
// ==/UserScript==

(function() {
	'use strict';
	if (/user\.php\?id=\d+/.test(location.href)) {
		var badgeSection = document.getElementById('badgesdiv');
		if (badgeSection !== null) badgeSection.parentNode.classList.add('hidden');
	}
	var badges = document.querySelectorAll('img.user_badge_icon');
	for (var i = 0, len = badges.length; i < len; i++) badges[i].parentNode.tagName == 'A' ? badges[i].parentNode.classList.add('hidden') : badges[i].classList.add('hidden');
})();