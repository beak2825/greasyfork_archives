// ==UserScript==
// @name         Rettungsdienstrechner
// @namespace    leeSalami.lss
// @version      0.0.6
// @description  Berechnet die Anzahl der benötigten Rettungsdienstfahrzeuge
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/missions/*
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521149/Rettungsdienstrechner.user.js
// @updateURL https://update.greasyfork.org/scripts/521149/Rettungsdienstrechner.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const patients = document.querySelectorAll('.mission_patient');
  const missionHelpElement = document.getElementById('mission_help');

  if (!patients.length || !missionHelpElement) {
    return;
  }

  const db = await openDb();
  await updateMissions(db);
  const missionData = await getData(db, 'missions', getMissionTypeId());

  if (!missionData.hasOwnProperty('chances')) {
    return;
  }

  let nefChance = 0;
  let transportChance = 100;

  if (missionData.chances.hasOwnProperty('nef')) {
    nefChance = missionData.chances.nef;
  }

  if (missionData.chances.hasOwnProperty('patient_transport')) {
    transportChance = missionData.chances.patient_transport;
  }

  createInfoElement(patients.length, nefChance, transportChance);

  function createInfoElement(patientCount, nefChance, transportChance) {
    const alertElement = document.createElement('div');
    alertElement.className = 'alert alert-info';
    alertElement.style.marginTop = '10px';

    const close = document.createElement('button');
    close.innerText = '×';
    close.type = 'button';
    close.className = 'close';
    close.dataset.dismiss = 'alert';
    alertElement.append(close);

    const innerDiv = document.createElement('div');
    innerDiv.innerHTML = `<b>Benötigter Rettungsdienst:</b> ${Math.ceil(patientCount * transportChance / 100)}x RTW (${transportChance}%)`;

    if (nefChance > 0) {
      innerDiv.innerHTML += `, ${Math.ceil(patientCount * nefChance / 100)}x NEF (${nefChance}%)`;
    }

    if (patientCount >= 5) {
      innerDiv.innerHTML += `, 1x LNA`;
    }

    if (patientCount >= 10) {
      innerDiv.innerHTML += `, 1x OrgL`;
    }

    alertElement.append(innerDiv);

    if (document.querySelector('.col-md-12 > #mission-aao-group')) {
      document.querySelector('.mission_header_info')?.insertAdjacentElement('afterend', alertElement);
    } else {
      patients[0].parentElement.querySelector('.clearfix')?.insertAdjacentElement('afterend', alertElement);
    }
  }

  function getMissionTypeId() {
    const missionHelpLink = missionHelpElement.href
    const params = new URLSearchParams(new URL(decodeURIComponent(missionHelpLink)).search);
    const missionAdditiveOverlays = params.get('additive_overlays');
    const missionOverlayIndex = params.get('overlay_index');
    let missionTypeId = missionHelpLink.split('/').pop().split('?')[0];

    if (missionOverlayIndex !== null) {
      missionTypeId += '-' + missionOverlayIndex;
    }

    if (missionAdditiveOverlays !== null) {
      missionTypeId += '/' + missionAdditiveOverlays;
    }

    return missionTypeId;
  }
})();
