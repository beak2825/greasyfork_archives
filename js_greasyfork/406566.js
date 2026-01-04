// ==UserScript==
// @name     Ekşi Toplu Entry Silici
// @namespace  eksi
// @description Ekşi Sözlük Toplu Entry Silici
// @match https://eksisozluk.com/biri/*
// @match https://www.eksisozluk.com/biri/*
// @version  1
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/406566/Ek%C5%9Fi%20Toplu%20Entry%20Silici.user.js
// @updateURL https://update.greasyfork.org/scripts/406566/Ek%C5%9Fi%20Toplu%20Entry%20Silici.meta.js
// ==/UserScript==


(function(){
		var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
		GM_ES = document.createElement('script');

    GM_ES.defer = true;
		GM_ES.src = 'https://cdn.jsdelivr.net/gh/tatliokur/eksi-scripts/topluentrysil.js';
    
		GM_Head.insertBefore(GM_ES, GM_Head.children[26]);
    GM_Head.appendChild(GM_ES);
})();