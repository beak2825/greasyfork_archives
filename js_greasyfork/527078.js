// ==UserScript==
// @name         Gefangene in Einsatzliste entlassen
// @namespace    leeSalami.lss
// @version      0.4.1
// @description  Fügt einen Button in der Einsatzliste hinzu, um direkt die Gefangenen zu entlassen. Die Einstellungen zu diesem Skript befinden sich unter Profil -> Einstellungen (https://www.leitstellenspiel.de/settings/index).
// @author       leeSalami
// @license      MIT
// @require      https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @match        https://*.leitstellenspiel.de
// @match        https://*.leitstellenspiel.de/settings/index*
// @match        https://*.meldkamerspel.com
// @match        https://*.meldkamerspel.com/settings/index*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/527078/Gefangene%20in%20Einsatzliste%20entlassen.user.js
// @updateURL https://update.greasyfork.org/scripts/527078/Gefangene%20in%20Einsatzliste%20entlassen.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const COUNT_FREED_PRISONERS_STORAGE_KEY = 'count_freed_prisoners';
  const FREE_PRISONERS_AUTOMATICALLY_STORAGE_KEY = 'free_prisoners_automatically';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'free_prisoners_in_missions_list',
      'title': 'Gefangene in Einsatzliste entlassen',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'checkbox',
          'key': COUNT_FREED_PRISONERS_STORAGE_KEY,
          'label': 'Entlassene Gefangene zählen (Neuladen nach Änderung erforderlich)'
        },
        {
          'type': 'checkbox',
          'key': FREE_PRISONERS_AUTOMATICALLY_STORAGE_KEY,
          'label': 'Gefangene automatisch entlassen (Neuladen nach Änderung erforderlich)'
        }
      ]
    });
    return;
  }

  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  const COUNT_FREED_PRISONERS = await GM.getValue(COUNT_FREED_PRISONERS_STORAGE_KEY, false);
  const FREE_PRISONERS_AUTOMATICALLY = await GM.getValue(FREE_PRISONERS_AUTOMATICALLY_STORAGE_KEY, false);
  const startOfDay = new Date().setHours(0, 0, 0, 0);
  const freedMissions = [];
  const form = new FormData();
  form.append('_method', 'post');
  form.append('authenticity_token', csrfToken);
  const requestBody = new URLSearchParams(form);
  let countElement;
  let freedPrisoners = 0;

  const missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = async (mission) => {
    missionMarkerAddOrig(mission);

    if (mission.user_id === user_id && mission.missing_text === 'Gefangene sollen abtransportiert werden.' && !document.getElementById(`free_prisoners_button_${mission.id}`)) {
      addFreePrisonersButton(mission.id);
    }
  }

  const missionMarkerAddSingleOrig = missionMarkerAddSingle;
  missionMarkerAddSingle = (mission) => {
    missionMarkerAddSingleOrig(mission);

    if (FREE_PRISONERS_AUTOMATICALLY && mission.user_id === user_id && mission.vehicle_state === 0 && mission.missing_text === 'Gefangene sollen abtransportiert werden.' && !freedMissions.includes(mission.id)) {
      freedMissions.push(mission.id);
      freePrisoners(mission.id);
      freedPrisoners += mission.prisoners_count;
      updatePrisonerCount();
    }
  }

  if (COUNT_FREED_PRISONERS) {
    freedPrisoners = await getCurrentPrisonerCount();
    await addPrisonerCounterElement();
  }

  async function addPrisonerCounterElement() {
    countElement = document.createElement('div');
    countElement.id = 'prisoner_counter';
    countElement.innerText = `Entlassene Gefangene: ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(freedPrisoners)} (${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(freedPrisoners * 250)} Credits)`;
    document.getElementById('mission-filters-block').insertAdjacentElement('beforeend', countElement);
  }

  function addFreePrisonersButton(missionId) {
    const missingTextElement = document.getElementById(`mission_missing_${missionId}`);

    if (missingTextElement === null) {
      return;
    }

    const button = document.createElement('a');
    button.id = `free_prisoners_button_${missionId}`;
    button.className = 'btn btn-default btn-xs';
    button.innerText = 'Entlassen';
    button.style.textDecoration = 'none';
    button.style.marginLeft = '5px';
    button.addEventListener('click', (e) => freePrisonersClick(e, missionId));

    missingTextElement.insertAdjacentElement('beforeend', button);
  }

  async function freePrisonersClick(event, missionId) {
    event.preventDefault();
    const currentTarget = event.currentTarget;
    currentTarget.disabled = true;
    currentTarget.classList.add('disabled');
    let prisonerCount = 0;

    if (COUNT_FREED_PRISONERS) {
      prisonerCount = document.getElementById(`mission_prisoners_${missionId}`)?.querySelectorAll(':scope > div[id^="prisoner_"]')?.length ?? 0;
    }

    const freed = await freePrisoners(missionId);

    if (COUNT_FREED_PRISONERS && freed) {
      freedPrisoners += prisonerCount;
      await updatePrisonerCount();
    }

    missionDelete(missionId);
  }

  async function freePrisoners(missionId) {
    let success = false;
    const result = await fetch(`/missions/${missionId}/gefangene/entlassen`, {
      method: 'POST',
      body: requestBody,
      redirect: 'manual'
    });

    if (result.ok || result.redirected) {
      success = true;
    }

    return success;
  }

  async function getCurrentPrisonerCount() {
    const prisoners = await GM.getValue('prisoners', null);

    if (prisoners) {
      const storedPrisoners = JSON.parse(prisoners);

      if (storedPrisoners.timestamp === startOfDay) {
        return storedPrisoners.prisoners;
      }
    }

    return 0;
  }

  async function updatePrisonerCount() {
    await GM.setValue('prisoners', `{"prisoners": ${freedPrisoners}, "timestamp": ${startOfDay}}`);
    countElement.innerText = `Entlassene Gefangene: ${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(freedPrisoners)} (${new Intl.NumberFormat('de-DE', {maximumFractionDigits: 0}).format(freedPrisoners * 250)} Credits)`;
  }
})();
