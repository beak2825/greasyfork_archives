// ==UserScript==
// @name            徳島大学シラバスのヘッダ固定が大っ嫌い！
// @version         1.0.0
// @license         MIT License
// @description     徳島大学のシラバスのヘッダは縦の長さがかなり大きいにもかかわらず、なぜかヘッダ固定が既定で有効にされている。このスクリプトはヘッダ固定を無効化し、ヘッダ固定のチェックボックスを非表示にする。
// @match           https://eweb.stud.tokushima-u.ac.jp/Portal/Public/Syllabus/DetailMain.aspx?*
// @namespace       https://greasyfork.org/users/1256941
// @downloadURL https://update.greasyfork.org/scripts/486391/%E5%BE%B3%E5%B3%B6%E5%A4%A7%E5%AD%A6%E3%82%B7%E3%83%A9%E3%83%90%E3%82%B9%E3%81%AE%E3%83%98%E3%83%83%E3%83%80%E5%9B%BA%E5%AE%9A%E3%81%8C%E5%A4%A7%E3%81%A3%E5%AB%8C%E3%81%84%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/486391/%E5%BE%B3%E5%B3%B6%E5%A4%A7%E5%AD%A6%E3%82%B7%E3%83%A9%E3%83%90%E3%82%B9%E3%81%AE%E3%83%98%E3%83%83%E3%83%80%E5%9B%BA%E5%AE%9A%E3%81%8C%E5%A4%A7%E3%81%A3%E5%AB%8C%E3%81%84%EF%BC%81.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', function() {
	const checkbox = document.getElementById('ctl00_phContents_sylSummary_chbFix_chb');
	const label = document.querySelector('label[for="ctl00_phContents_sylSummary_chbFix_chb"]');

	checkbox.style.display = 'none';
	label.style.display = 'none';

	if (checkbox.checked == true) {
		setTimeout('__doPostBack(\'ctl00$phContents$sylSummary$chbFix$chb\',\'\')', 0);
		checkbox.checked = false;
	}
})