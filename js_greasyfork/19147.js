// ==UserScript==
// @name        Auto-search for Chad Topaz
// @author      StubbornlyDesigned
// @description Speed up Chad Topaz HITs with auto search.
// @namespace   https://greasyfork.org/en/users/35961-stubbornlydesigned
// @version		1.0
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19147/Auto-search%20for%20Chad%20Topaz.user.js
// @updateURL https://update.greasyfork.org/scripts/19147/Auto-search%20for%20Chad%20Topaz.meta.js
// ==/UserScript==

var section = $('section#Survey.container');

if(section.length) {
	var panel = $('div.panel-body', section);

    if(panel.length) {
		var ul = $('ul', panel);

		if(ul.length) {
			ul = ul[1];
			var items = $('li', ul);
			var search = '';
			var criteria = [
				"First name: ",
				"Last name: ",
				"Institution: "
			];

			for(i = 0; i < items.length; i++) {
				for(j = 0; j < criteria.length; j++) {
					if(items[i].innerHTML.match('^' + criteria[j])) {
						search += items[i].innerHTML.substring(criteria[j].length) + '+';
					}
				}
			}

			search = search.slice(0, -1);
			search = 'http://www.google.com/webhp?gws_rd=ssl#newwindow=1&q=' + encodeURI(search);

			window.open('http://www.google.com/search?' + search, '_blank');
		}
	}
}