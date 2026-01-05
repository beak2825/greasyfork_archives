// ==UserScript==
// @name	Open external links in new tab
// @description	Открытые внешних ссылок в новой вкладке
// @namespace	https://greasyfork.org/users/19952-xant1k-bt
// @include	http://*/*
// @include	https://*/*
// @version	1.0
// @downloadURL https://update.greasyfork.org/scripts/28124/Open%20external%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/28124/Open%20external%20links%20in%20new%20tab.meta.js
// ==/UserScript==

function externalLinks() {
  for(var c = document.getElementsByTagName("a"), a = 0;a < c.length;a++) {
    var b = c[a];
    b.getAttribute("href") && b.hostname !== location.hostname && (b.target = "_blank")
  }
}
;
externalLinks();