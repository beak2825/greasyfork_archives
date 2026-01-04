// ==UserScript==
// @name         HWMBattleLinks
// @namespace    https://greasyfork.org/ru/scripts/424550-hwmbattlelinks
// @version      0.3
// @description  ссылки на начало боя и лог
// @author       achepta
// @include        https://www.heroeswm.ru/*
// @include        https://www.lordswm.com/*
// @include        http://178.248.235.15/*
// @exclude        /^https{0,1}:\/\/((www|qrator|my)\.(heroeswm|lordswm)\.(ru|com)|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|rightcol|brd|frames|auction|object-info)\.php.*/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/424550/HWMBattleLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/424550/HWMBattleLinks.meta.js
// ==/UserScript==

(function (window, undefined) {
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}

	Array.from(document.querySelectorAll("a[href*='warid=']")).forEach(item => {
		let warid = item.href.match(/warid=(\d+)/)[1]
		let show_for_all = item.href.match(/(show_for_all|show|show_enemy)=([\w|\d]+)/)
		let battleParams
		if (show_for_all) {
			battleParams = `warid=${warid}&${show_for_all[1]}=${show_for_all[2]}`
		} else {
			battleParams = `warid=${warid}`
		}
		item.insertAdjacentHTML("afterend", getLinksTemplate(battleParams))
	})

	function getLinksTemplate(battleParams) {
		return `
		 		<a href="war.php?lt=-1&${battleParams}">start</a>
		 		<a href="battlechat.php?${battleParams}">chat</a>
		 		<a href="battle.php?lastturn=-3&${battleParams}">lt3</a>
		 	`
	}
})(window);