// ==UserScript==
// @name         TSP Quiz Import
// @namespace    https://nihlen.io/
// @version      0.1
// @description  Import word lists into quiz
// @author       You
// @match        https://teckensprakslexikon.su.se/sok/idnummer*
// @icon         https://tspquiz.se/app/favicon.ico
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/434187/TSP%20Quiz%20Import.user.js
// @updateURL https://update.greasyfork.org/scripts/434187/TSP%20Quiz%20Import.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var idString = new URLSearchParams(window.location.search).get('q');
    var ids = idString.split(',');
    var name = prompt("List name");
    var data = { name: name, list: ids };
    prompt("Import code", JSON.stringify(data));
})();
