// ==UserScript==
// @name         🔍 Aniyan Search - Script oficial Aniyan.net
// @name:en      🔍 Aniyan Search - Official script of Aniyan.net
// @namespace    https://aniyan.net/?referral=aniyan_search
// @version      2.3.2
// @description  Procure facilmente palavras chaves no Aniyan.net
// @description:en  Search keywords in Aniyan.net
// @author       dk (dkzerah)
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=www.aniyan.net
// @grant        none
// @run-at       context-menu
// @supportURL   https://discord.gg/fYeHEywhWW
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437221/%F0%9F%94%8D%20Aniyan%20Search%20-%20Script%20oficial%20Aniyannet.user.js
// @updateURL https://update.greasyfork.org/scripts/437221/%F0%9F%94%8D%20Aniyan%20Search%20-%20Script%20oficial%20Aniyannet.meta.js
// ==/UserScript==

(function() {
    var selection = getSelection();
    var formattedText = "https://aniyan.net/?s=" + selection;
    formattedText = formattedText.replace(/\s/g, "+");
    formattedText = formattedText.replace(/,/g, "%2C");
    formattedText = formattedText.replace(/!/g, "%21");
    window.open(formattedText);;
})();