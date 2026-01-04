// ==UserScript==
// @name         Spellchess+ Darkmode
// @namespace    http://tampermonkey.net/
// @version      B4
// @description  Darkmode for Spellchess.io!
// @author       Saya!
// @match        https://www.spellchess.io/*
// @resource     DARK https://ches.maybeyuuki.repl.co/drkmode.css
// @resource     DARK2 https://ches.maybeyuuki.repl.co/drkmode2.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/443004/Spellchess%2B%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/443004/Spellchess%2B%20Darkmode.meta.js
// ==/UserScript==

if (window.location.href.indexOf("play") > -1) {(function() {
    'use strict';
    const myCss = GM_getResourceText("DARK2");
    GM_addStyle(myCss);

})();
}

if (window.location.href.indexOf("@") > -1) {(function() {
    'use strict';
    const myCss = GM_getResourceText("DARK");
    GM_addStyle(myCss);

})();
}