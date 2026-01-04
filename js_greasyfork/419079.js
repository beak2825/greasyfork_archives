// ==UserScript==
// @name         sexche.at snow disabled
// @namespace    http://tampermonkey.net/
// @version      6.9
// @description  disable snow in sexcheat
// @author       duxe
// @match        https://sexche.at/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/419079/sexcheat%20snow%20disabled.user.js
// @updateURL https://update.greasyfork.org/scripts/419079/sexcheat%20snow%20disabled.meta.js
// ==/UserScript==

(function() {
    var s = document.createElement("style");
    s.innerText = ".snow { display: none !important; }"
    document.head.appendChild(s);
})();