// ==UserScript==
// @name         FMS 6 in Leitstellenansicht
// @namespace    leeSalami.lss
// @version      0.1
// @description  Zeigt in der Leitstellenansicht nur Fahrzeuge im Status 6 an.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/leitstellenansicht
// @downloadURL https://update.greasyfork.org/scripts/523665/FMS%206%20in%20Leitstellenansicht.user.js
// @updateURL https://update.greasyfork.org/scripts/523665/FMS%206%20in%20Leitstellenansicht.meta.js
// ==/UserScript==

(() => {
  'use strict'

  document.querySelectorAll('.list-group-item:has(.building_list_fms):not(:has(.building_list_fms_6))').forEach((element) => {
    element.remove();
  });

  document.querySelectorAll('.building_list_li:not(:has(.list-group > a[href^="/vehicles/"]))').forEach((element) => {
    element.remove();
  });

  refilterOverviewSelection();
})();
