// ==UserScript==
// @name        Speed Up Scott Isbell HITs
// @author      StubbornlyDesigned
// @description Speeds up Scott Isbell HITs (group id: 38S83E1CSOHKVI7VBOBTIOXV88D3UR). 
// @namespace   https://greasyfork.org/en/users/35961-stubbornlydesigned
// @version		2.0
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require		http://code.jquery.com/jquery-latest.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @grant       GM_Log
// @downloadURL https://update.greasyfork.org/scripts/19173/Speed%20Up%20Scott%20Isbell%20HITs.user.js
// @updateURL https://update.greasyfork.org/scripts/19173/Speed%20Up%20Scott%20Isbell%20HITs.meta.js
// ==/UserScript==

var section = $('section#DataCollection.container');

if(section.length) {
    $('div.panel-primary', section).accordion({active: false, collapsible: true});

    var panel = $('div:first', section);

    if(panel.length) {
		panel = panel[0];
		var rows = $('tr', panel);
		
		if(rows.length) {
			var searchQuery = '';
			
			for(i = 0; i < rows.length; i++) {
				searchQuery += $('td', rows[i])[1].innerHTML + ' ';
			}
			
			searchQuery = searchQuery.trim().replace(/[ ]/g, "+");
			
			window.open('http://www.google.com/webhp?gws_rd=ssl#newwindow=1&q=' + encodeURI(searchQuery), '_blank');

		}
	}
}