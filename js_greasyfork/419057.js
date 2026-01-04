// ==UserScript==
// @name         Radon 1.0
// @namespace    https://rnss.glitch.me/
// @version      1.0.0
// @description  vanis.io ext ~ rnss
// @author       rnss
// @match        https://vanis.io/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/419057/Radon%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/419057/Radon%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';
     if (window.location.href == "https://vanis.io/rd" || window.location.href == "https://vanis.io/radon") {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://rnss.glitch.me/vanis/",
            onload: function(response) {
                document.write(response.responseText);
            }
        });
     }
})();