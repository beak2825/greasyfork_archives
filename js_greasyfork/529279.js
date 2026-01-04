// ==UserScript==
// @name         Verbandszellen ausbauen
// @namespace    leeSalami.lss
// @version      1.0.1
// @license      All Rights Reserved
// @description  Ermöglicht das Ausbauen von Verbandszellen. Zum Starten auf der Gebäudeseite warten, bis die Bestätigungsabfrage kommt.
// @author       leeSalami
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @match        https://*.leitstellenspiel.de/verband/gebauede
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/529279/Verbandszellen%20ausbauen.user.js
// @updateURL https://update.greasyfork.org/scripts/529279/Verbandszellen%20ausbauen.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  /**
   * Gebäude, die den angegeben String beinhalten, werden übersprungen.
   */
  const EXCLUDE_BUILDING_NAME = '';

  /**
   * Die zu bauenden Erweiterungen. 0-9 für die Zellen-Erweiterungen 1-10.
   */
  const EXTENSIONS_TO_BUY = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  const db = await openDb();
  await updateAllianceBuildings(db, 60);
  const buildings = await getAllData(db, 'allianceBuildings');
  const buildingExtensionsToBuy = [];
  let extensionCountToBuy = 0;

  for (let i = 0, n = buildings.length; i < n; i++) {
    if (buildings[i].building_type !== 16 || (EXCLUDE_BUILDING_NAME !== '' && buildings[i].caption.includes(EXCLUDE_BUILDING_NAME))) {
      continue;
    }

    const extensionTypeIds = [];

    for (let j = 0, m = buildings[i].extensions.length; j < m; j++) {
      extensionTypeIds.push(buildings[i].extensions[j].type_id);
    }

    const toBuy = [];

    for (let j = 0, m = EXTENSIONS_TO_BUY.length; j < m; j++) {
      if (!extensionTypeIds.includes(EXTENSIONS_TO_BUY[j]) && EXTENSIONS_TO_BUY[j] >= 0 && EXTENSIONS_TO_BUY[j] < 10) {
        toBuy.push(EXTENSIONS_TO_BUY[j]);
        extensionCountToBuy++;
      }
    }

    if (toBuy.length > 0) {
      buildingExtensionsToBuy.push({'buildingId': buildings[i].id, 'extensionsToBuy': toBuy});
    }
  }

  if (extensionCountToBuy === 0 || !confirm(`${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(extensionCountToBuy)} Erweiterungen für ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(extensionCountToBuy * 25_000)} Credits kaufen?`)) {
    return;
  }

  const form = new FormData();
  form.append('_method', 'post');
  form.append('authenticity_token', csrfToken);
  const requestBody = new URLSearchParams(form);

  for (let i = 0, n = buildingExtensionsToBuy.length; i < n; i++) {
    for (let j = 0, m = buildingExtensionsToBuy[i].extensionsToBuy.length; j < m; j++) {
      await buyExtensions(buildingExtensionsToBuy[i].buildingId, buildingExtensionsToBuy[i].extensionsToBuy[j]);
    }
  }

  alert('Erweiterungen wurden gekauft.');

  async function buyExtensions(buildingId, level) {
    await fetch(`/buildings/${buildingId}/extension/credits/${level}`, {
      body: requestBody,
      method: 'POST',
      redirect: 'manual'
    });
    await new Promise(r => setTimeout(r, 500));
  }
})();
