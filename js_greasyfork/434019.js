// ==UserScript==
// @name	    No Redirect to Bing CN for Chrome NTP
// @namespace	xuyiming.open@outlook.com
// @description	当 Chrome 的搜索引擎设置为 Bing 时阻止新标签页重定向到 Bing 中国首页
// @author	    依然独特
// @version		1.0
// @grant	    unsafeWindow
// @run-at	    document-start
// @include		https://cn.bing.com/chrome/newtab
// @match	    https://cn.bing.com/chrome/newtab
// @license		BSD 3-Clause
// @downloadURL https://update.greasyfork.org/scripts/434019/No%20Redirect%20to%20Bing%20CN%20for%20Chrome%20NTP.user.js
// @updateURL https://update.greasyfork.org/scripts/434019/No%20Redirect%20to%20Bing%20CN%20for%20Chrome%20NTP.meta.js
// ==/UserScript==

"use strict";

/**
 * @see {@link https://www.chromium.org/embeddedsearch}
 */

if (unsafeWindow.chrome != null) {
	// unsafeWindow.chrome.embeddedSearch ??= {
	// 	newTabPage: {
	// 		mostVisited: [],

	// 		get onmostvisitedchange() {
	// 			return null;
	// 		},

	// 		set onmostvisitedchange(_) {},

	// 		deleteMostVisitedItem(_) {},

	// 		undoMostVisitedDeletion(_) {},

	// 		undoAllMostVisitedDeletions() {}

	// 	}
	// };

	var _unsafeWindow$chrome, _unsafeWindow$chrome$;

	(_unsafeWindow$chrome$ = (_unsafeWindow$chrome = unsafeWindow.chrome).embeddedSearch) !== null && _unsafeWindow$chrome$ !== void 0 ? _unsafeWindow$chrome$ : _unsafeWindow$chrome.embeddedSearch = {
		newTabPage: {
			mostVisited: [],

			get onmostvisitedchange() {
				return null;
			},

			set onmostvisitedchange(_) {},

			deleteMostVisitedItem: function deleteMostVisitedItem(_) {},
			undoMostVisitedDeletion: function undoMostVisitedDeletion(_) {},
			undoAllMostVisitedDeletions: function undoAllMostVisitedDeletions() {}
		}
	};
}
