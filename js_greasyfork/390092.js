// ==UserScript==
// @name       Ekşi Reklamsız
// @namespace  eksi
// @description Ekşi Sözlük çift tıklama çözümü
// @match https://eksisozluk.com/*
// @match https://www.eksisozluk.com/*
// @version 0.0.1.20190913135521
// @downloadURL https://update.greasyfork.org/scripts/390092/Ek%C5%9Fi%20Reklams%C4%B1z.user.js
// @updateURL https://update.greasyfork.org/scripts/390092/Ek%C5%9Fi%20Reklams%C4%B1z.meta.js
// ==/UserScript==

(function(){
		var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
		GM_ES = document.createElement('script');

    GM_ES.defer = true;
		GM_ES.src = 'https://cdn.jsdelivr.net/gh/tatliokur/eksi-scripts/eksi-defer.js';
    
		//GM_Head.insertBefore(GM_ES, GM_Head.children[26]);
    GM_Head.appendChild(GM_ES);
})();