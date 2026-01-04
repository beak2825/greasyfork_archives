// ==UserScript==
// @name         Redacted :: Set Report Type
// @namespace    https://greasyfork.org/en/scripts/371460-redacted-set-report-type
// @version      1.0
// @description  Sets a default report type to preselect on the torrent report form upon page load.
// @author       newstarshipsmell
// @include      https://redacted.ch/reportsv2.php?action=report&id=*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371460/Redacted%20%3A%3A%20Set%20Report%20Type.user.js
// @updateURL https://update.greasyfork.org/scripts/371460/Redacted%20%3A%3A%20Set%20Report%20Type.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var reportIndex = localStorage.getItem('redactedReportType') === undefined ? 0 : localStorage.getItem('redactedReportType');
	var reportDropdown = document.getElementById('type');
	reportDropdown.selectedIndex = reportIndex;

	(function() {
		$.post("reportsv2.php?action=ajax_report", $('#reportform').serialize(), function (response) {
			$('#dynamic_form').html(response);
		});
	})();

	var setRepBtn = document.createElement('input');
	setRepBtn.setAttribute('type', 'button');
	setRepBtn.setAttribute('id', 'set_report_index');
	setRepBtn.setAttribute('value', 'Set');
	setRepBtn.setAttribute('title', 'Set the default report type to preselect on the torrent report form upon page load');

	reportDropdown.parentNode.appendChild(setRepBtn);
	document.getElementById('set_report_index').addEventListener("click", function(){
		reportIndex = reportDropdown.selectedIndex;
		localStorage.setItem('redactedReportType', reportIndex);
		setRepBtn.setAttribute('value', 'Set (updated to ' + reportDropdown.options[reportIndex].innerHTML + ')');
	});
})();