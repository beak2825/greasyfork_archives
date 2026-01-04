// ==UserScript==
// @name         [GC] - Enhanced Relic Log View
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @version      86
// @license      MIT
// @description  See additional details related to your relic log, included view filter options.
// @author       Cupkait
// @match        https://www.grundos.cafe/space/warehouse/*
// @match        https://www.grundos.cafe/search/items/*
// @match        https://www.grundos.cafe/space/warehouse/relics/#details
// @match        https://www.grundos.cafe/safetydeposit/*&category=999*
// @grant        none
// @icon        https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/485206/%5BGC%5D%20-%20Enhanced%20Relic%20Log%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/485206/%5BGC%5D%20-%20Enhanced%20Relic%20Log%20View.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-485206')) {
    alert("The Enhanced Relic Log script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-485206', 'true');
}