// ==UserScript==
// @name         [Ned] Fast Check Box
// @namespace    localhost
// @version      2.1
// @description  Fast Check Box
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/DealershipSettings/OpCodesNormalize.aspx?Tab=Raw*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16145/%5BNed%5D%20Fast%20Check%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/16145/%5BNed%5D%20Fast%20Check%20Box.meta.js
// ==/UserScript==

$(':checkbox').prop('onclick',null).off('click');

//Add Button
$('#ctl00_ctl00_Main_Main_gvRawOpCodes > tbody > tr.GridPager > td > table > tbody > tr').append('<td><span> Checkbox: <a href="#" id="_all"> All </a><a href="#" id="_none"> None </a><a href="#" id="_invert"> Invert </a></span></td>');

//Listeners & Actions
var allchecks, thisLink;
allchecks = document.evaluate(
	'//input[@type="checkbox"]',
	document,
	null,
	XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
	null);
window.setTimeout(function() {
	if (allchecks.snapshotLength) {
		_all = document.getElementById('_all');
		_all.addEventListener('click', function(event) {for (var i = 0; i < allchecks.snapshotLength; i++) {thisLink = allchecks.snapshotItem(i);thisLink.checked = true;event.preventDefault();}}, true)

		_none = document.getElementById('_none');
		_none.addEventListener('click', function(event) {for (var i = 0; i < allchecks.snapshotLength; i++) {thisLink = allchecks.snapshotItem(i);thisLink.checked = false;event.preventDefault();}}, true)

		_invert = document.getElementById('_invert');
		_invert.addEventListener('click', function(event) {for (var i = 0; i < allchecks.snapshotLength; i++) {thisLink = allchecks.snapshotItem(i);thisLink.checked = !thisLink.checked;event.preventDefault();}}, true)
	}
}, 60);