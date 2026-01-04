// ==UserScript==
// @name         curse-redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects *.curse.com pages to the project site if it can find one.
// @author       Ruby Rosario
// @match        https://*.curse.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31276/curse-redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/31276/curse-redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll("ul.details-list li a");

    console.log(links);

    for (var i = 0; i < links.length; ++i) {
        if (links[i].innerText.trim().toLowerCase() === "project site") {
            window.stop();
            location.replace(links[i].href);
        }
    }
})();