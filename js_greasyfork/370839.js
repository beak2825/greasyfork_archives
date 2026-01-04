// ==UserScript==
// @name         lr-online.de Sperre umgehen
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mit dem Script die "5 Artikel im Monat lesen" Sperre umgehen.
// @author       theTV
// @match        *://www.lr-online.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370839/lr-onlinede%20Sperre%20umgehen.user.js
// @updateURL https://update.greasyfork.org/scripts/370839/lr-onlinede%20Sperre%20umgehen.meta.js
// ==/UserScript==

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ?
        "" :
        ";expires="+exdate.toUTCString())+";domain=.lr-online.de;hostonly=false;path=/";
}
setCookie("lr_paywall", 1, null);