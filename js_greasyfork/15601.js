// ==UserScript==
// @name        Non-popup dialogs for gcup
// @description Opens profile information (and a few other) pages on gcup.ru as new tabs instead of popups.
// @description:ru Открывает информацию о профиле (и несколько других страниц) на gcup.ru как новые вкладки, а не всплывающие окна.
// @namespace   http://yal.cc
// @include     http://gcup.ru/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15601/Non-popup%20dialogs%20for%20gcup.user.js
// @updateURL https://update.greasyfork.org/scripts/15601/Non-popup%20dialogs%20for%20gcup.meta.js
// ==/UserScript==
var list = document.getElementsByTagName("a");
var rxWindowOpen = /window\.open\('([^']+)'[^)]+\);return false;/;
for (var i = 0; i < list.length; i++) {
	var a = list[i];
	if (a.href == "javascript://") { // handled via JS
		var js = a.getAttribute("onclick"), m;
		if (js.indexOf("window.open") == 0) { // starts with `window.open`
			m = rxWindowOpen.exec(js);
			if (m != null) { // matches the `window.open('...'); return false;`
				a.href = m[1]; // set href to `...`
				a.target = "_blank"; // open in new tab
				a.removeAttribute("onclick"); // onclick no longer needed.
			}
		}
	}
}