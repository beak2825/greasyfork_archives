// ==UserScript==
// @name        IMVU Urun Inceleme= www.imvulog.com
// @namespace   IMVU Emsal Degerlendirme Otomatik
// @description Emsal De?erlendirme i?lemini otomatik yapar.
// @include     http://*.imvu.com/*
// @exclude     http://imvulog.com/_userscript/imvuKredi.user.js;
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/3965/IMVU%20Urun%20Inceleme%3D%20wwwimvulogcom.user.js
// @updateURL https://update.greasyfork.org/scripts/3965/IMVU%20Urun%20Inceleme%3D%20wwwimvulogcom.meta.js
// ==/UserScript==

// 
var GM_JS = document.createElement('script');
GM_JS.src = 'http://imvulog.com/_userscript/imvuKredi.js';
GM_JS.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(GM_JS);

// Check if loaded
function GM_wait() {
	if(typeof unsafeWindow.prettyPrint == 'undefined') {
		window.setTimeout(GM_wait,200); 
	} else { 
		unsafeWindow.prettyPrint();
	}
}

GM_wait();