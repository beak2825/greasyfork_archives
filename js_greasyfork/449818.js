// ==UserScript==
// @name         Shoptet - Větší foto produktu v kompletaci
// @namespace    mailto:azuzula.cz@gmail.com
// @version      1.01
// @description  Zvětší fotku v detailu objednávky
// @author       Zuzana Nyiri
// @match        */admin/objednavky-detail/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449818/Shoptet%20-%20V%C4%9Bt%C5%A1%C3%AD%20foto%20produktu%20v%20kompletaci.user.js
// @updateURL https://update.greasyfork.org/scripts/449818/Shoptet%20-%20V%C4%9Bt%C5%A1%C3%AD%20foto%20produktu%20v%20kompletaci.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".imagePreview").css({"width":"100px"});
    $(".std-table-listing tbody tr td:nth-child(2) span img").css({"max-width":"100px"});
})();