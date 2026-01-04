// ==UserScript==
// @name         bahn.de preselect Bahncard 50 reduction
// @namespace    http://wosc.de/
// @version      1.0
// @description  Preselects the "Bahncard 50" reduction
// @author       Wolfgang Schnerring
// @match        https://reiseauskunft.bahn.de/bin/query.exe/d*
// @match        https://reiseauskunft.bahn.de//bin/query.exe/d*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36212/bahnde%20preselect%20Bahncard%2050%20reduction.user.js
// @updateURL https://update.greasyfork.org/scripts/36212/bahnde%20preselect%20Bahncard%2050%20reduction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('travellerReduction_1').value = 4;
})();