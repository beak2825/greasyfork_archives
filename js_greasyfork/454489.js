// ==UserScript==
// @name         V2EXNivito
// @namespace    https://www.nivito.si/kuhinja/kuhinjske-umivalnik.html
// @version      0.1
// @description  V2EXkuhinjski umivalnik
// @author       You
// @match        https://www.nivito.si/kuhinja/kuhinjske-umivalnik.html*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/instantclick/3.1.0/instantclick.min.js
/* globals jQuery, $, InstantClick,waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/454489/V2EXNivito.user.js
// @updateURL https://update.greasyfork.org/scripts/454489/V2EXNivito.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    /* Tim */
    InstantClick.init();
    /* kuhinjski umivalnik */
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode("#instantclick-bar{display:none;}");
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
 
})();