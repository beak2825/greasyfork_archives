// ==UserScript==
// @name         Phantom Helper
// @namespace    https://greasyfork.org/ru/scripts/423861-phantom-helper
// @version      0.2
// @description  try to take over the world!
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/war\.php.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/423861/Phantom%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423861/Phantom%20Helper.meta.js
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

	window.addEventListener("keypress", e => {
		if (["a", "A", "ф", "Ф"].includes(e.key)) {
			makePhantom(1, 10);
		}
		if (["s", "S", "ы", "Ы"].includes(e.key)) {
			makePhantom(1, 9);
		}
	})

	function makePhantom(ax, ay) {
		loadmy('battle.php?warid='+warid+'&move=1&pl_id='+player+'&magical=phantom_forces&my_monster='+activeobj+'&x='+stage[war_scr].obj[activeobj].x+'&y='+stage[war_scr].obj[activeobj].y+'&ax='+ax+'&ay='+ay+'&lastturn='+lastturn+'&lastmess='+lastmess+'&lastmess2='+lastmess2+'&magicp='+0+'&rand='+mathrandom());

	}


})(window);