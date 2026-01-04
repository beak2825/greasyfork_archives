// ==UserScript==
// @name         SourceForge promotion content toner
// @namespace    github.com/qzlin/sourceforge-promotion-toner
// @version      0.1
// @description  Toning down the vividness of promotion content helps reduce their potential interference
// @author       Q.Z.Lin
// @match        https://sourceforge.net/*
// @icon         https://icons.duckduckgo.com/ip2/sourceforge.net.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468574/SourceForge%20promotion%20content%20toner.user.js
// @updateURL https://update.greasyfork.org/scripts/468574/SourceForge%20promotion%20content%20toner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".trunc-eligible").forEach(e => { e.style = "background: grey;" })
})();