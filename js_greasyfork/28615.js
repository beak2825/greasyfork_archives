// ==UserScript==
// @name         nyaa.ws --> nyaa.se
// @namespace    https://github.com/dinosw
// @version      0.1
// @description  Redirects nyaa.ws to nyaa.se
// @author       dinosw
// @match        *://www.nyaa.ws/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28615/nyaaws%20--%3E%20nyaase.user.js
// @updateURL https://update.greasyfork.org/scripts/28615/nyaaws%20--%3E%20nyaase.meta.js
// ==/UserScript==

(function() {
    window.location = "http://www.nyaa.se/";
})();