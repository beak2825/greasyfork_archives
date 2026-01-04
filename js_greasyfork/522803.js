// ==UserScript==
// @name         Mission zufahrbar?
// @namespace    leeSalami.lss
// @version      0.7.2
// @description  Zeigt in Missionen an, ob diese bereits zugefahren werden dürfen oder noch offen bleiben müssen.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/missions/*
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @downloadURL https://update.greasyfork.org/scripts/522803/Mission%20zufahrbar.user.js
// @updateURL https://update.greasyfork.org/scripts/522803/Mission%20zufahrbar.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const ALLIANCE_MISSION_THRESHOLD = 14400000; // 4h
  const ALLIANCE_CUSTOM_MISSION_THRESHOLD = 43200000; // 12h

  const guardMissionCountdown = document.getElementById('col_left')?.querySelector('span[id^="mission_countdown_"]');

  if (guardMissionCountdown) {
    return;
  }

  const missionGeneralInfo = document.getElementById('mission_general_info');
  const missionGenerationTimestamp = getOriginalGenerationTime();
  const missionGeneralInfoSmall = missionGeneralInfo.querySelector(':scope > small');
  const missionTitle = document.getElementById('missionH1');

  if (missionGenerationTimestamp === null || !missionTitle || missionGeneralInfoSmall === null) {
    return;
  }

  const actualMissionGenerationTimestamp = getActualGenerationTime();

  if (actualMissionGenerationTimestamp === null) {
    return;
  }

  const missionOpenTime = Date.now() - actualMissionGenerationTimestamp;
  const remainingMinMissionTime = await getRemainingMinMissionTime(missionOpenTime);

  if (missionGenerationTimestamp < getLastUtc2Am()) {
    missionTitle.innerHTML += ' <span title="Mission verfällt heute Nacht.">⚠️</span>';
  }

  if (remainingMinMissionTime <= 0) {
    missionTitle.innerHTML += ' <span title="Mission darf zugefahren werden.">✅</span>';
    return;
  }

  const closeMissionCountdownElement = document.createElement('span');
  missionTitle.innerHTML += ' <span title="Mission darf noch nicht zugefahren werden.">🛑</span>';
  missionGeneralInfoSmall.innerHTML += ' | Kann geschlossen werden in ';
  missionGeneralInfoSmall.insertAdjacentElement('beforeend', closeMissionCountdownElement);

  closeMissionCountdown(remainingMinMissionTime, closeMissionCountdownElement);

  function getOriginalGenerationTime() {
    const missionGenerationTime = missionGeneralInfo?.dataset?.generationTime;

    if (!missionGenerationTime) {
      return null;
    }

    return Date.parse(missionGenerationTime);
  }

  function getActualGenerationTime() {
    const missionTitle = document.getElementById('missionH1')?.innerText;

    if (!missionTitle || missionTitle.trim().toUpperCase().startsWith('[EVENT]')) {
      return missionGenerationTimestamp;
    }

    const firstMissionReply = document.querySelector('#mission_replies li:last-of-type');

    if (!firstMissionReply) {
      return missionGenerationTimestamp;
    }

    const firstMissionReplyUser = parseInt(firstMissionReply.querySelector('a[href^="/profile/"]')?.getAttribute('href')?.replace(/[^0-9]/g, '') ?? 0);
    let missionOwner = parseInt(document.querySelector('.alert.alert-info > a[href^="/profile/"]')?.getAttribute('href')?.replace(/[^0-9]/g, '') ?? 0);

    if (!missionOwner && typeof user_id !== 'undefined') {
      missionOwner = user_id;
    }

    if (firstMissionReplyUser && missionOwner && firstMissionReplyUser === missionOwner) {
      let firstMissionReplyDatetime = firstMissionReply.getAttribute('data-message-time');

      if (firstMissionReplyDatetime) {
        return Date.parse(firstMissionReplyDatetime);
      }
    }

    return missionGenerationTimestamp;
  }

  async function getRemainingMinMissionTime(missionOpenTime) {
    const missionHelpElement = document.getElementById('mission_help');
    let missionTypeId = null;

    if (missionHelpElement) {
      const missionHelpLink = missionHelpElement.href
      const params = new URLSearchParams(new URL(decodeURIComponent(missionHelpLink)).search);
      const missionAdditiveOverlays = params.get('additive_overlays');
      const missionOverlayIndex = params.get('overlay_index');
      missionTypeId = missionHelpLink.split('/').pop().split('?')[0];

      if (missionOverlayIndex !== null) {
        missionTypeId += '-' + missionOverlayIndex;
      }

      if (missionAdditiveOverlays !== null) {
        missionTypeId += '/' + missionAdditiveOverlays;
      }
    }

    if (missionTypeId === null) {
      return Math.round((ALLIANCE_CUSTOM_MISSION_THRESHOLD - missionOpenTime) / 1000);
    }

    const db = await openDb();
    await updateMissions(db);
    const missionInfo = await getData(db, 'missions', missionTypeId);

    if (!missionInfo || (missionInfo.hasOwnProperty('date_start') && missionInfo.date_start)) {
      return Math.round((ALLIANCE_MISSION_THRESHOLD - missionOpenTime) / 1000);
    }

    if (missionInfo.additional.only_alliance_mission === true) {
      return Math.round((ALLIANCE_CUSTOM_MISSION_THRESHOLD - missionOpenTime) / 1000);
    }

    combineVehicleRequirements(missionInfo);

    let vehicleCount = 0;

    Object.values(missionInfo.requirements).forEach(amount => {
      if (!isNaN(amount) && amount < 200) {
        vehicleCount += amount;
      }
    });

    if (vehicleCount >= 3) {
      return Math.round((ALLIANCE_MISSION_THRESHOLD - missionOpenTime) / 1000);
    }

    return 0;
  }

  function combineVehicleRequirements(mission) {
    if (mission.requirements.hasOwnProperty('police_service_group_leader') && mission.requirements.hasOwnProperty('police_cars') && mission.requirements.police_cars >= mission.requirements.police_service_group_leader) {
      mission.requirements.police_cars -= mission.requirements.police_service_group_leader;
    }

    if (mission.requirements.hasOwnProperty('firetrucks') && mission.requirements.hasOwnProperty('heavy_rescue_vehicles') && mission.requirements.firetrucks >= mission.requirements.heavy_rescue_vehicles) {
      mission.requirements.firetrucks -= mission.requirements.heavy_rescue_vehicles;
    }
  }

  function closeMissionCountdown(time, element) {
    if (time < 0) {
      return;
    }
    element.innerHTML = formatTime(time, false);
    setTimeout((() => {
      closeMissionCountdown(time - 1, element);
    }), 1000);
  }

  function getLastUtc2Am() {
    const lastUTC2am = new Date();
    lastUTC2am.setUTCHours(2, 0, 0, 0);

    if (lastUTC2am.getTime() > Date.now()) {
      lastUTC2am.setDate(lastUTC2am.getDate() - 1);
    }

    return lastUTC2am.getTime();
  }
})()
