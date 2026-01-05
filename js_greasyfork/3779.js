// ==UserScript==
// @name          defPrefs
// @description   improvement of style; enhancement font style browser - css text-shadow;
// @include       *
// @namespace     https://greasyfork.org/en/users/3561-lucianolll
// @namespace     https://openuserjs.org/users/lucianolll
// @namespace     https://userscripts.org/users/46776
// @version  4.1
// @grant    none
// @author lucianolll
// @downloadURL https://update.greasyfork.org/scripts/3779/defPrefs.user.js
// @updateURL https://update.greasyfork.org/scripts/3779/defPrefs.meta.js
// ==/UserScript==
function adstyle(){
	var doc=document,adstyle=doc.createElement('style');adstyle.textContent="body{text-shadow:0.1px 0.2px 0 rgb(0,0,0);}";
	doc.getElementsByTagName('head')[0].appendChild(adstyle);
}
  addEventListener('load',adstyle(),false);