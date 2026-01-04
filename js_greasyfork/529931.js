// ==UserScript==
// @name         Gebäude einer Leitstelle abreißen
// @namespace    leeSalami.lss
// @version      1.1
// @license      All Rights Reserved
// @description  Ermöglicht das Abreißen aller Gebäude einer Leitstelle. Leitstellen-ID hinterlegen und die Hauptseite mit geöffneter Gebäudeliste laden. ACHTUNG! Aktion kann nicht rückgängig gemacht werden.
// @author       leeSalami
// @match        https://*.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/529931/Geb%C3%A4ude%20einer%20Leitstelle%20abrei%C3%9Fen.user.js
// @updateURL https://update.greasyfork.org/scripts/529931/Geb%C3%A4ude%20einer%20Leitstelle%20abrei%C3%9Fen.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const DISPATCH_CENTER_ID = '00000000';
  const REFUND = false; // Nur verwenden, falls die Leitstelle ausschließlich Gebäude enthält, die vor weniger als 24h gebaut wurden.

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  await waitForElm('#building_list > li');
  const buildings = document.getElementById('building_list').querySelectorAll(`:scope li[leitstelle_building_id="${DISPATCH_CENTER_ID}"] > ul[data-building_id]`);

  if (!buildings || buildings.length === 0) {
    return;
  }

  const buildingsToDelete = [];
  const buildingNamesToDelete = [];

  for (let i = 0, n = buildings.length; i < n; i++) {
      buildingsToDelete.push(buildings[i].getAttribute('data-building_id'));
      buildingNamesToDelete.push(buildings[i].parentElement.querySelector('.building_list_caption a.map_position_mover')?.innerText);
  }

  const buildingsToDeleteCount = buildingsToDelete.length;

  if (buildingsToDeleteCount === 0 || !confirm(`Alle ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(buildingsToDeleteCount)} Gebäude in dieser Leitstelle wirklich abreißen? ACHTUNG! Diese Aktion kann nicht rückgängig gemacht werden!\n\nFolgende Gebäude werden abgerissen:\n${buildingNamesToDelete.join(', ')}`)) {
    return;
  }

  if (!confirm('Sicher? ;)')) {
    return;
  }

  const deletionForm = new FormData();
  deletionForm.append('_method', 'delete');
  deletionForm.append('authenticity_token', csrfToken);
  const deletionBody = new URLSearchParams(deletionForm);
  const refundQueryParameter = REFUND ? '?refund=1' : '';

  for (let i = 0; i < buildingsToDeleteCount; i++) {
    await deleteBuilding(buildingsToDelete[i]);
    await new Promise(r => setTimeout(r, 100));
  }

  alert('Gebäude wurden abgerissen.');

  async function deleteBuilding(buildingId) {
    await fetch(`/buildings/${buildingId}${refundQueryParameter}`, {
      method: 'POST',
      body: deletionBody,
    });
  }

  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }
})();
