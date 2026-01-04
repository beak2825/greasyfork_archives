// ==UserScript==
// @name         Einsätze in Einsatzliste freigeben
// @namespace    leeSalami.lss
// @version      1.0.3
// @description  Fügt einen Button in der Einsatzliste hinzu, um Einsätze einfach freigeben zu können. Die Einstellungen zu diesem Skript befinden sich unter Profil -> Einstellungen (https://www.leitstellenspiel.de/settings/index).
// @author       leeSalami
// @license      All Rights Reserved
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @require      https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @match        https://*.leitstellenspiel.de
// @match        https://*.leitstellenspiel.de/settings/index*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/529310/Eins%C3%A4tze%20in%20Einsatzliste%20freigeben.user.js
// @updateURL https://update.greasyfork.org/scripts/529310/Eins%C3%A4tze%20in%20Einsatzliste%20freigeben.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const MAX_SHARES_STORAGE_KEY = 'max_shares';
  const MAX_SHARES_DEFAULT = 0;
  const MIN_SHARES_AT_ONCE_STORAGE_KEY = 'min_shares_at_once';
  const MAX_SHARES_AT_ONCE_STORAGE_KEY = 'max_shares_at_once';
  const MIN_CREDITS_STORAGE_KEY = 'min_credits';
  const MIN_CREDITS_DEFAULT = 3000;
  const MAX_CREDITS_STORAGE_KEY = 'max_credits';
  const SHARE_OLD_MISSIONS_STORAGE_KEY = 'share_old_missions';
  const SHARE_ONLY_OLD_MISSIONS_STORAGE_KEY = 'share_only_old_missions';
  const INCLUDED_MISSION_TYPE_IDS_STORAGE_KEY = 'included_mission_type_ids';
  const EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY = 'excluded_mission_type_ids';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'share_alliance_missions',
      'title': 'Einsätze in Einsatzliste freigeben',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
        },
        {
          'type': 'number',
          'key': MAX_SHARES_STORAGE_KEY,
          'label': 'Max. offene Freigaben',
          'min': 0,
          'max': 9999,
          'default': MAX_SHARES_DEFAULT
        },
        {
          'type': 'number',
          'key': MIN_SHARES_AT_ONCE_STORAGE_KEY,
          'label': 'Min. Anzahl freizugebender Missionen je Durchlauf',
          'min': 0,
          'max': 9999
        },
        {
          'type': 'number',
          'key': MAX_SHARES_AT_ONCE_STORAGE_KEY,
          'label': 'Max. Anzahl freizugebender Missionen je Durchlauf',
          'min': 0,
          'max': 9999
        },
        {
          'type': 'number',
          'key': MIN_CREDITS_STORAGE_KEY,
          'label': 'Min. Credits der freizugebenden Einsätze',
          'min': 0,
          'max': 999999,
          'default': MIN_CREDITS_DEFAULT
        },
        {
          'type': 'number',
          'key': MAX_CREDITS_STORAGE_KEY,
          'label': 'Max. Credits der freizugebenden Einsätze',
          'min': 0,
          'max': 999999
        },
        {
          'type': 'checkbox',
          'key': SHARE_OLD_MISSIONS_STORAGE_KEY,
          'label': 'Verfallende Einsätze freigeben'
        },
        {
          'type': 'checkbox',
          'key': SHARE_ONLY_OLD_MISSIONS_STORAGE_KEY,
          'label': 'Nur verfallende Einsätze freigeben'
        },
        {
          'type': 'select',
          'selectType': 'missions_normal',
          'key': INCLUDED_MISSION_TYPE_IDS_STORAGE_KEY,
          'label': 'Erlaubte Einsätze (keine Auswahl erlaubt alle Einsatztypen)',
          'title': 'Einsätze',
          'multiple': true
        },
        {
          'type': 'select',
          'selectType': 'missions_normal',
          'key': EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY,
          'label': 'Ausgeschlossene Einsätze',
          'title': 'Einsätze',
          'multiple': true
        }
      ]
    });
    return;
  }

  let sharedMissions = [];
  let shareCountSpan;

  addGlobalShareButton();

  const missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (mission) => {
    missionMarkerAddOrig(mission);

    if (mission.user_id !== user_id || !mission.user_id) {
      return;
    }

    const shareButton = document.getElementById(`share_button_${mission.id}`);

    if (shareButton && (mission.alliance_id !== null || mission.vehicle_state === 2)) {
      shareButton.remove();
    } else if (!shareButton && mission.alliance_id === null && mission.vehicle_state !== 2) {
      addShareButton(mission.id);
    }

    if (mission.alliance_id !== null && mission.user_id === user_id && mission.sw === false && !sharedMissions.includes(mission.id)) {
      sharedMissions.push(mission.id);
      updateSharedCount();
    }
  }

  const missionDeleteOrig = missionDelete;
  missionDelete = (missionId) => {
    missionDeleteOrig(missionId);
    sharedMissions = sharedMissions.filter((id) => id !== missionId);
    updateSharedCount();
  }

  function updateSharedCount() {
    shareCountSpan.innerText = ` ${sharedMissions.length}`;
  }

  function addShareButton(missionId) {
    const captionElement = document.getElementById(`mission_caption_${missionId}`);

    if (captionElement === null) {
      return;
    }

    const icon = document.createElement('img');
    icon.src = '/images/icons8-share.svg'
    icon.className = 'icon icons8-Share';
    icon.height = 15;
    icon.width = 15;

    const button = document.createElement('a');
    button.id = `share_button_${missionId}`;
    button.className = 'btn btn-default btn-xs';
    button.title = 'Im Verband freigeben';
    button.style.textDecoration = 'none';
    button.style.marginLeft = '5px';
    button.style.float = 'right';
    button.addEventListener('click', (e) => shareMissionEvent(e, missionId));
    button.insertAdjacentElement('afterbegin', icon);

    captionElement.insertAdjacentElement('afterend', button);
  }

  function addGlobalShareButton() {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const icon = document.createElement('img');
    icon.src = '/images/icons8-share.svg'
    icon.className = 'icon icons8-Share';
    icon.height = 15;
    icon.width = 15;

    shareCountSpan = document.createElement('span');
    shareCountSpan.innerText = ' 0';

    const button = document.createElement('a');
    button.className = 'btn btn-xs btn-default';
    button.id = 'mission_share_missions';
    button.title = 'Einsätze freigeben';
    button.style.marginLeft = '5px';
    button.addEventListener('click', shareMissions);
    button.insertAdjacentElement('afterbegin', shareCountSpan);
    button.insertAdjacentElement('afterbegin', icon);
    buttonGroup.appendChild(button);

    const anchorSettings = document.createElement('a');
    anchorSettings.className = 'btn btn-default btn-xs';
    anchorSettings.href = '/settings/index#share_alliance_missions';
    anchorSettings.target = '_blank';

    const spanSettings = document.createElement('span');
    spanSettings.className = 'glyphicon glyphicon-cog';
    spanSettings.title = 'Einstellungen';
    anchorSettings.appendChild(spanSettings);
    buttonGroup.appendChild(anchorSettings);

    document.getElementById('missions-panel-main').querySelector(':scope > div:last-of-type').insertAdjacentElement('beforebegin', buttonGroup);
  }

  async function shareMissions(event) {
    event.preventDefault();
    const targetElement = event.currentTarget;
    targetElement.setAttribute('disabled', 'true');
    targetElement.classList.add('disabled');

    const maxShares = await GM.getValue(MAX_SHARES_STORAGE_KEY, MAX_SHARES_DEFAULT);
    const sharedMissionsCount = sharedMissions.length;

    if (sharedMissionsCount >= maxShares) {
      targetElement.removeAttribute('disabled');
      targetElement.classList.remove('disabled');
      return;
    }

    const missions = document.getElementById('mission_list').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted):has(.panel:not(.panel-success))');
    const shareIncludeMissionIds = JSON.parse(await GM.getValue(INCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
    const shareExcludeMissionIds = JSON.parse(await GM.getValue(EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
    const minSharesAtOnce = await GM.getValue(MIN_SHARES_AT_ONCE_STORAGE_KEY, 0);
    const maxSharesAtOnce = await GM.getValue(MAX_SHARES_AT_ONCE_STORAGE_KEY, 9999);
    const minCredits = await GM.getValue(MIN_CREDITS_STORAGE_KEY, MIN_CREDITS_DEFAULT);
    const maxCredits = await GM.getValue(MAX_CREDITS_STORAGE_KEY, 999999);
    const shareOldMissions = await GM.getValue(SHARE_OLD_MISSIONS_STORAGE_KEY, false);
    const shareOnlyOldMissions = await GM.getValue(SHARE_ONLY_OLD_MISSIONS_STORAGE_KEY, false);
    const includeMissionTypeIdsCount = shareIncludeMissionIds.length;
    const excludeMissionTypeIdsCount = shareExcludeMissionIds.length;
    const lastUtc2Am = getLastUtc2Am();
    const missionsToShare = [];

    for (let i = 0, n = missions.length; i < n; i++) {
      const missionTypeId = parseInt(missions[i].getAttribute('mission_type_id'), 10);
      if ((includeMissionTypeIdsCount && !shareIncludeMissionIds.includes(missionTypeId)) || (excludeMissionTypeIdsCount && shareExcludeMissionIds.includes(missionTypeId))) {
        continue;
      }

      const missionData = JSON.parse(missions[i].getAttribute('data-sortable-by'));

      if (!missionData || missionsToShare.find(mission => mission.id === missionData.id) || (minCredits && missionData.average_credits < minCredits) || (maxCredits && missionData.average_credits > maxCredits) || (!shareOldMissions && missionData.created_at * 1000 < lastUtc2Am) || (shareOnlyOldMissions && missionData.created_at * 1000 > lastUtc2Am)) {
        continue;
      }

      missionsToShare.push({ 'id': missionData.id, 'credits': missionData.average_credits, 'created': missionData.created_at });
    }

    missionsToShare.sort((a, b) => b.credits - a.credits || a.created - b.created);
    const missionsToShareCount = missionsToShare.length;
    let shared = 0;

    if (missionsToShareCount < minSharesAtOnce) {
      targetElement.removeAttribute('disabled');
      targetElement.classList.remove('disabled');
      return;
    }

    for (let i = 0; i < missionsToShareCount; i++) {
      if (shared >= maxSharesAtOnce || shared + sharedMissionsCount >= maxShares) {
        break;
      }

      await shareMission(missionsToShare[i].id);
      await new Promise(r => setTimeout(r, 100));
      shared++;
    }

    targetElement.removeAttribute('disabled');
    targetElement.classList.remove('disabled');
  }

  async function shareMissionEvent(event, missionId) {
    event.preventDefault();
    const targetElement = event.currentTarget;
    await shareMission(missionId);
    targetElement.blur();
    targetElement.remove();
  }

  async function shareMission(missionId) {
    const response = await fetch(`/missions/${missionId}/alliance`, { redirect: 'manual' });

    if (!sharedMissions.includes(missionId) && (response.redirected || response.ok)) {
      sharedMissions.push(missionId);
      updateSharedCount();
    }
  }

  function getLastUtc2Am() {
    const lastUTC2am = new Date();
    lastUTC2am.setUTCHours(2, 0, 0, 0);

    if (lastUTC2am.getTime() > Date.now()) {
      lastUTC2am.setDate(lastUTC2am.getDate() - 1);
    }

    return lastUTC2am.getTime();
  }
})();
