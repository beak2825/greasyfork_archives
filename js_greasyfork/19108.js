// ==UserScript==
// @name        Speed Up Buzzfeed Moderation HITs
// @author      StubbornlyDesigned
// @description Speeds up Buzzfeed's moderation HITs (group id: 3X7VAYHW1SUWUZ8JYZVI0YRDLK5VPS). Simply select the image(s) if necessary and hit submit. No need to check none. 
// @namespace   https://greasyfork.org/en/users/35961-stubbornlydesigned
// @version		2.0.1
// @match       https://www.mturkcontent.com/dynamic/hit*
// @require		http://code.jquery.com/jquery-latest.min.js
// @require     http://code.jquery.com/ui/1.11.4/jquery-ui.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19108/Speed%20Up%20Buzzfeed%20Moderation%20HITs.user.js
// @updateURL https://update.greasyfork.org/scripts/19108/Speed%20Up%20Buzzfeed%20Moderation%20HITs.meta.js
// ==/UserScript==

var instructions = "Guidelines for selecting images that does not contain animals.";

if($('div.panel-body > p')[0].innerText.indexOf(instructions) === 0) {
	var section = $('section#ModerationOfAnImage.container');

	$('div.panel-primary', section).accordion({active: false, collapsible: true});

	var submitBtn = $('input#submitButton').detach();
	var newCell = document.createElement('td');
	$('tr:first', section)[0].appendChild(newCell);
	submitBtn.appendTo(newCell);
	$(newCell).css({'padding-left': '50px'});

	section.find('input#submitButton').click(function() {
		var noneChkBox = section.find('input#checkbox8');
		if(section.find('table input:checked').length === 0) {
			noneChkBox.prop('checked', true);
		} else {
			noneChkBox.prop('checked', false);
		}
	});
}