// ==UserScript==
// @name         Pendelverkehr
// @namespace    leeSalami.lss
// @version      0.1
// @license      All Rights Reserved
// @description  Aktiviert den Pendelverkehr für alle ELW 1 (SEG).
// @author       leeSalami
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @match        https://*.leitstellenspiel.de/buildings/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538179/Pendelverkehr.user.js
// @updateURL https://update.greasyfork.org/scripts/538179/Pendelverkehr.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  if (!confirm('Pendelverkehr für alle ELW 1 (SEG) aktivieren?')) {
    return;
  }

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  const db = await openDb();
  await updateVehicles(db);
  const elwVehicles = await getDataByIndex(db, 'vehicles', 'vehicle_type', IDBKeyRange.only(59));
  let error = false;

  for (let i = 0, n = elwVehicles.length; i < n; i++) {
    await setPendelverkehr(elwVehicles[i]['id']);
    await new Promise(r => setTimeout(r, 100));
  }

  if (error) {
    alert('Pendelverkehr konnte nicht für alle ELW 1 (SEG) aktiviert werden.');
  } else {
    alert('Pendelverkehr für ELW 1 (SEG) aktiviert.')
  }

  async function setPendelverkehr(vehicleId, retries = 0) {
    if (retries > 3) {
      error = true;
      console.error(vehicleId);
    }

    const formData = new FormData();
    formData.append('utf8', '✓');
    formData.append('_method', 'patch');
    formData.append('authenticity_token', csrfToken);
    formData.append('vehicle[hospital_automatic_return]', '1');
    formData.append('commit', 'Speichern');

    try {
      const response = await fetch(`/vehicles/${vehicleId}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams(formData).toString(),
        redirect: 'manual'
      });

      if (response.status >= 400) {
        retries++;
        await new Promise(r => setTimeout(r, 1000));
        await setPendelverkehr(vehicleId, retries);
      }
    } catch (e) {
      retries++;
      await new Promise(r => setTimeout(r, 1000));
      await setPendelverkehr(vehicleId, retries);
    }
  }
})();
