// ==UserScript==
// @author craftwar
// @name TWSE tweak
// @description 顯示表格全部資料
// @copyright 2022, craftwar (https://craftwarblog.blogspot.com/)
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @homepageURL https://github.com/craftwar/userscript/tree/master/TWSE
// @version 0.1.20220830
// @namespace github.com.craftwar
// @match https://www.twse.com.tw/zh/page/trading/fund/TWT43U.html
// @match https://www.twse.com.tw/zh/page/trading/exchange/TWT93U.html
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/450358/TWSE%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/450358/TWSE%20tweak.meta.js
// ==/UserScript==

'use strict';
(() => {
	new MutationObserver((record, observer) => {
		const report_len = document.querySelector('select[name="report-table_length"]')
		if (report_len) {
			observer.disconnect();

			report_len.value = -1
			report_len.dispatchEvent(new Event('change'))
		}
	}).observe(document.body, { subtree: true, childList: true });
})();
