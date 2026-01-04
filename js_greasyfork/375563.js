// ==UserScript==
// @name         Redacted :: Compare Logs and Report Dupes
// @namespace    https://greasyfork.org/en/scripts/375563-redacted-compare-logs-and-report-dupes
// @version      0.4.1
// @description  Compares logs between two different torrents and determines whether the latter upload is a unique edition or should be reported as a potential Dupe.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/(torrents\.php\?(page=\d+&)?id=\d+|reportsv2\.php\?action=report&id=\d+)/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/375563/Redacted%20%3A%3A%20Compare%20Logs%20and%20Report%20Dupes.user.js
// @updateURL https://update.greasyfork.org/scripts/375563/Redacted%20%3A%3A%20Compare%20Logs%20and%20Report%20Dupes.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if (/*GM_getValue('REDreportadupe') === undefined && */location.href.indexOf('reportsv2.php?action=report&id=') > -1) return;

	var logging = false;
	var torrentTable = document.querySelectorAll('table#torrent_details > tbody > tr');
	var torrents = {'0': null};
	var lastEd;
	var checkboxes = {};
	var checkboxInsert = {};
	var boxesChecked = 0;
	var totalLogs = 0;
	var isDupe = false;

	var torrentsHead = document.querySelector('table#torrent_details > tbody > tr.colhead_dark > td[width="80%"]');
	var compLogsBtn = document.createElement('input');
	compLogsBtn.type = 'button';
	compLogsBtn.name = 'Compare logs';
	compLogsBtn.value = 'Compare';
	compLogsBtn.title = 'Check two checkboxes beside two CD / Log (0-100%) torrents and click this button to compare the logs';
	compLogsBtn.disabled = true;

	compLogsBtn.addEventListener('click', function(){
		cancConfTR.classList.add('hidden');

		for (var i = 1, len = torrentTable.length; i < len; i++) {
			if (torrents[i].isEdwLog) torrentTable[i].classList.add('hidden');

			if (torrents[i].isTorwLog) {
				if (checkboxes[i].checked === false) {
					torrentTable[i].classList.add('hidden');
				} else {
					torrentTable[checkboxes[i + '_ed']].classList.remove('hidden');
				}
			}

			if (torrents[i].isDet) torrentTable[i].classList.add('hidden');
		}

		for (var b in checkboxes) {
			if (/\d+_ed/.test(b)) continue;
			checkboxes[b].classList.add('hidden');
		}

		compResultsH.classList.remove('hidden');
		compResultsTR.classList.remove('hidden');

		if (isDupe) {
			reportBtn.classList.remove('hidden');
		} else {
			okBtn.classList.remove('hidden');
		}
	});

	var cancelBtn = document.createElement('input');
	cancelBtn.type = 'button';
	cancelBtn.name = 'Cancel';
	cancelBtn.value = 'Cancel';

	cancelBtn.addEventListener('click', function(){

		for (var i = 1, len = torrentTable.length; i < len; i++) {
			if (torrents[i].isEd) torrentTable[i].classList.remove('hidden');
			if (torrents[i].isTor) torrentTable[i].classList.remove('hidden');
			if (torrents[i].isDet) torrentTable[i].classList.add('hidden');
		}

		for (var b in checkboxes) {
			if (/\d+_ed/.test(b)) continue;
			checkboxes[b].checked = false;
			checkboxes[b].classList.add('hidden');
		}

		cancConfTR.classList.add('hidden');
		compLogsBtn.disabled = true;
		boxesChecked = 0;
		compLogsLnk.classList.remove('hidden');
	});

	var linkbox = document.querySelector('div.linkbox');
	var compLogsLnk = document.createElement('a');
	compLogsLnk.href = 'javascript:void(0);';
	compLogsLnk.classList.add('brackets');
	compLogsLnk.innerHTML = 'Compare logs';
	linkbox.appendChild(compLogsLnk);

	compLogsLnk.addEventListener('click', function(){
		compLogsLnk.classList.add('hidden');
		cancConfTR.classList.remove('hidden');

		for (var i = 1, len = torrentTable.length; i < len; i++) {
			if (torrents[i].isEd && !torrents[i].isEdwLog) torrentTable[i].classList.add('hidden');
			if (torrents[i].isTor && !torrents[i].isTorwLog) torrentTable[i].classList.add('hidden');
			if (torrents[i].isDet && !torrents[i - 1].isTorwLog) torrentTable[i].classList.add('hidden');

		}

		for (var b in checkboxes) {
			if (/\d+_ed/.test(b)) continue;
			checkboxes[b].classList.remove('hidden');
		}
	});

	for (var i = 1, len = torrentTable.length; i < len; i++) {
		torrents[i] = {};
		torrents[i].isEd = torrentTable[i].classList.contains('edition');
		torrents[i].isTor = torrentTable[i].classList.contains('torrent_row');
		torrents[i].isDet = torrentTable[i].classList.contains('torrentdetails');

		if (torrents[i].isEd) lastEd = i;
		torrents[i].isEdwLog = false;
		torrents[i].isTorwLog = (torrents[i].isTor && /<a href="#".+>FLAC \/ Lossless \/ Log \(\d{1,3}%\).+<\/a>/.test(torrentTable[i].innerHTML));

		if (torrents[i].isTorwLog) {
			totalLogs++;
			torrents[lastEd].isEdwLog = true;

			checkboxes[i + '_ed'] = lastEd;
			checkboxes[i] = document.createElement('input');
			checkboxes[i].type = 'checkbox';
			checkboxes[i].checked = false;
			checkboxes[i].name = 'Check Torrent #' + i;
			checkboxes[i].value = i;
			checkboxes[i].classList.add('hidden');

			checkboxInsert[i] = document.querySelector('table#torrent_details > tbody > tr:nth-child(' + (i + 1) + ') > td');
			checkboxInsert[i].insertBefore(checkboxes[i], checkboxInsert[i].firstChild);
		}
	}

	if (totalLogs < 2) compLogsLnk.classList.add('hidden');

	for (var b in checkboxes) {
		if (/\d+_ed/.test(b)) continue;
		checkboxes[b].addEventListener('click', function(){
			boxesChecked += this.checked === true ? 1 : -1;
			compLogsBtn.disabled = boxesChecked != 2;
		});
	}

	var cancConfTR = document.createElement('tr');
	var cancConfTD = document.createElement('td');
	cancConfTD.setAttribute('colspan', 6);
	cancConfTD.textContent = 'Compare selected torrents\' log files';
	cancConfTD.appendChild(document.createElement('br'));
	cancConfTD.appendChild(document.createElement('br'));
	cancConfTR.appendChild(cancConfTD);
	cancConfTR.classList.add('hidden');
	cancConfTD.appendChild(compLogsBtn);
	cancConfTD.appendChild(document.createTextNode('\u00A0'));
	cancConfTD.appendChild(cancelBtn);

	var compResultsH = document.createElement('tr');
	compResultsH.classList.add('colhead_dark');
	compResultsH.innerHTML = '<td colspan="6"><strong>Log comparison results</strong></td>';
	compResultsH.classList.add('hidden');

	var compResultsTR = document.createElement('tr');
	var compResultsTD = document.createElement('td');
	compResultsTD.setAttribute('colspan', 6);
	compResultsTD.textContent = 'Results of log comparison.';
	compResultsTD.appendChild(document.createElement('br'));
	compResultsTD.appendChild(document.createElement('br'));
	compResultsTR.appendChild(compResultsTD);
	compResultsTR.classList.add('hidden');

	var okBtn = document.createElement('input');
	okBtn.type = 'button';
	okBtn.name = 'OK';
	okBtn.value = 'OK';
	okBtn.style.float = 'right';
	okBtn.classList.add('hidden');
	compResultsTD.appendChild(okBtn);

	okBtn.addEventListener('click', function(){
		for (var i = 1, len = torrentTable.length; i < len; i++) {
			if (torrents[i].isEd) torrentTable[i].classList.remove('hidden');
			if (torrents[i].isTor) torrentTable[i].classList.remove('hidden');
			if (torrents[i].isDet) torrentTable[i].classList.add('hidden');
		}

		for (var b in checkboxes) {
			if (/\d+_ed/.test(b)) continue;
			checkboxes[b].checked = false;
			checkboxes[b].classList.add('hidden');
		}

		cancConfTR.classList.add('hidden');
		compLogsBtn.disabled = true;
		boxesChecked = 0;
		compLogsLnk.classList.remove('hidden');
		compResultsH.classList.add('hidden');
		compResultsTR.classList.add('hidden');
		okBtn.classList.add('hidden');
	});

	var reportBtn = document.createElement('input');
	reportBtn.type = 'button';
	reportBtn.name = 'Report Dupe';
	reportBtn.value = 'Report dupe';
	reportBtn.style.float = 'right';
	reportBtn.classList.add('hidden');
	compResultsTD.appendChild(reportBtn);
	compResultsTD.appendChild(document.createTextNode('\u00A0'));

	reportBtn.addEventListener('click', function(){});

	var tTbl = document.querySelector('table#torrent_details > tbody');
	tTbl.appendChild(cancConfTR);
	tTbl.appendChild(compResultsH);
	tTbl.appendChild(compResultsTR);
})();