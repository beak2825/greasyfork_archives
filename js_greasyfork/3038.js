// ==UserScript==
// @name        Sabnzbd enhancements
// @namespace   armeagle.nl
// @include     http://192.168.18.26:8006/
// @version     1
// @description Adds two shortcuts to SABnzbd
// @downloadURL https://update.greasyfork.org/scripts/3038/Sabnzbd%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/3038/Sabnzbd%20enhancements.meta.js
// ==/UserScript==

var multi_status = $('multi_status');
if (multi_status) {
	jQuery('<input/>').attr('type', 'button').attr('value', 'high resume').click(function () {
		$('#multi_status').val('resume');
		$('#multi_priority').val('2');
		$('#multi_apply').click();
	}).insertBefore($('#multi_status'));

	jQuery('<input/>').attr('type', 'button').attr('value', 'invert delete').click(function () {
		$('#multiops_select_invert').click();
		$('#multi_delete').click();
	}).insertBefore($('#multi_status'));
}