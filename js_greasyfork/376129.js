// ==UserScript==
// @name         Redacted :: Collapse/Expand My Reports
// @namespace    https://greasyfork.org/en/scripts/376129-redacted-collapse-expand-my-reports
// @version      1.0
// @description  Adds a linkbox with commands [Collapse all] / [Expand all] on the "Reports submitted by" page.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/userhistory\.php\?(page=\d+&|)action=reports/
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/376129/Redacted%20%3A%3A%20CollapseExpand%20My%20Reports.user.js
// @updateURL https://update.greasyfork.org/scripts/376129/Redacted%20%3A%3A%20CollapseExpand%20My%20Reports.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var loadCollapsed = GM_getValue('redColRepDef');
	loadCollapsed = loadCollapsed === undefined ? false : loadCollapsed;

	var linkbox = document.createElement('div');
	linkbox.classList.add('linkbox');

	var header = document.querySelector('div.thin');
	header.insertBefore(linkbox, header.childNodes[2]);

	var collapseAll = document.createElement('a');
	collapseAll.href = 'javascript:void(0);';
	collapseAll.classList.add('brackets');
	collapseAll.textContent = 'Collapse all';
	collapseAll.addEventListener('click', collapseReports);
	if (loadCollapsed) collapseReports();

	var expandAll = document.createElement('a');
	expandAll.href = 'javascript:void(0);';
	expandAll.classList.add('brackets');
	expandAll.textContent = 'Expand all';
	expandAll.addEventListener('click', expandReports);

	linkbox.appendChild(collapseAll);
	linkbox.appendChild(document.createTextNode(' '));
	linkbox.appendChild(expandAll);

	function collapseReports() {
		GM_setValue('redColRepDef', true);
		var reports = document.querySelectorAll('table.users_reports_table > tbody > tr');
		for (var i = 2, len = reports.length; i - 1 < len; i = i + 2) {
			if (reports[i].childNodes[1].childNodes[1].style.display == 'none') continue;
			reports[i - 1].childNodes[3].childNodes[1].click();
		}
	}

	function expandReports() {
		GM_setValue('redColRepDef', false);
		var reports = document.querySelectorAll('table.users_reports_table > tbody > tr');
		for (var i = 2, len = reports.length; i - 1 < len; i = i + 2) {
			if (reports[i].childNodes[1].childNodes[1].style.display == 'block' ||
			   reports[i].childNodes[1].childNodes[1].style.display == '') continue;
			reports[i - 1].childNodes[3].childNodes[1].click();
		}
	}
})();