// ==UserScript==
// @name         ZoteroBib APA
// @description  Sets the format style of ZoteroBib to APA.
// @match        https://zbib.org/*
// @grant        none
// @run-at       document-start
// @version 0.0.1.20240330075033
// @namespace https://greasyfork.org/users/1281493
// @downloadURL https://update.greasyfork.org/scripts/491226/ZoteroBib%20APA.user.js
// @updateURL https://update.greasyfork.org/scripts/491226/ZoteroBib%20APA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.setItem("zotero-bib-citation-style", "apa");
})();