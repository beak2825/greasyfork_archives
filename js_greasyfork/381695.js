// ==UserScript==
// @name         KanTV
// @namespace    oneryx
// @version      0.0.1
// @description  Remove AD
// @author       oneryx
// @match        www.imkan.tv/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381695/KanTV.user.js
// @updateURL https://update.greasyfork.org/scripts/381695/KanTV.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.currentPartInfo.advertising={};
    document.querySelectorAll(".mtg-client").forEach(e => e.parentNode.removeChild(e));
    document.querySelectorAll(".adcontainer").forEach(e => e.parentNode.removeChild(e));
})();