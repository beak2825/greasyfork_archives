// ==UserScript==
// @name         🔍 NyanMusic Search - Script oficial NyanMusic.net
// @name:en      🔍 NyanMusic Search - Official script of NyanMusic.net
// @namespace    https://www.nyanmusic.net/?referral=nyanmusic_search
// @version      1.0.0
// @description  Procure facilmente palavras chaves no NyanMusic.net
// @description:en  Search keywords in NyanMusic.net
// @author       dk (dkzerah)
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=www.nyanmusic.net
// @grant        none
// @run-at       context-menu
// @supportURL   https://discord.gg/fYeHEywhWW
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458157/%F0%9F%94%8D%20NyanMusic%20Search%20-%20Script%20oficial%20NyanMusicnet.user.js
// @updateURL https://update.greasyfork.org/scripts/458157/%F0%9F%94%8D%20NyanMusic%20Search%20-%20Script%20oficial%20NyanMusicnet.meta.js
// ==/UserScript==

(function() {
    var selection = getSelection();
    var formattedText = "https://www.nyanmusic.net/search/" + selection;
    formattedText = formattedText.replace(/\s/g, "%20");
    formattedText = formattedText.replace(/,/g, "%2C");
    formattedText = formattedText.replace(/!/g, "%21");
    window.open(formattedText);
})();