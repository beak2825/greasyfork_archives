// ==UserScript==
// @name         Color code StackOverflow users by recent activity/last login
// @namespace    http://your.homepage/
// @version      0.1
// @description  Color highlight users by recent activity
// @author       You
// @match        http://*.stackexchange.com/users*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21599/Color%20code%20StackOverflow%20users%20by%20recent%20activitylast%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/21599/Color%20code%20StackOverflow%20users%20by%20recent%20activitylast%20login.meta.js
// ==/UserScript==
(function () {
	function daycol(n, html) { //wicked, 2 functions in one, based on second param
		var el = document.createElement('p');
		if (html) return ~~((new Date() - new Date((el.innerHTML = html, el).querySelector(n + ' .relativetime').title)) / 864e5);
		return n < 60 ? 'limegreen' : n < 180 ? 'goldenrod' : n < 365 ? 'firebrick' : 'black';
	}
	[].forEach.call(document.querySelectorAll('.user-info'), function (user) {
		$.get(user.querySelector('a').href, function (profile) {
			$.get(user.querySelector('a').href + '?tab=answers&sort=newest', function (answers) {
				var login = daycol('.icon-time +', profile),
					answer = daycol('#user-tab-answers', answers);
				user.querySelector('.user-tags').innerHTML = '<b style=padding:5px;background:' + daycol(login) + '>Days Since Login ' + login + '  Answer ' + answer + '</b>';
				user.style.cssText = 'color:#fff;width:21em;margin:1px;background:' + daycol(answer);
			});
		});
	});
}());