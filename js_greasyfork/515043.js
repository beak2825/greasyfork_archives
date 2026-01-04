// ==UserScript==
// @name        Verfügbare Credits
// @namespace   leeSalami
// @version     1.0.1
// @license     MIT
// @author      leeSalami
// @match       https://*.leitstellenspiel.de
// @description Zeigt die verfügbaren Credits an, die bei Teilnahme an allen offenen Missionen verdient werden können.
// @downloadURL https://update.greasyfork.org/scripts/515043/Verf%C3%BCgbare%20Credits.user.js
// @updateURL https://update.greasyfork.org/scripts/515043/Verf%C3%BCgbare%20Credits.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const span = document.createElement('span');
  span.id = 'own_open_credits';
  span.textContent = 'Credits: 0 Credits (Allianz): 0';
  span.title = 'Count: 0 Count (Allianz): 0';

  const searchInput = document.getElementById('search_input_field_missions');
  searchInput.style.maxWidth = '250px';
  searchInput.style.marginRight = '5px';
  searchInput.parentNode.insertBefore(span, searchInput.nextSibling);

  let missionIds = [];
  let allianceMissionIds = [];
  let credits = 0;
  let allianceCredits = 0;
  let count = 0;
  let allianceCount = 0;

  let missionMarkerAddOrig = missionMarkerAdd;
  missionMarkerAdd = (t) => {
    missionMarkerAddOrig(t);

    if (t.user_id === user_id && t.sw === false && !missionIds.includes(t.id)) {
      missionIds.push(t.id);
      credits += t.average_credits;
      count++;
      updateStats();
    } else if (t.user_id !== user_id && t.sw === false && t.alliance_id !== null && !allianceMissionIds.includes(t.id)) {
      allianceMissionIds.push(t.id);
      allianceCredits += t.average_credits;
      allianceCount++;
      updateStats();
    }
  };

  let missionDeleteOrig = missionDelete;
  missionDelete = (e) => {
    missionDeleteOrig(e);
    const isMission = missionIds.includes(e);
    const isAllianceMission = allianceMissionIds.includes(e);

    if (!isMission && !isAllianceMission) {
      return;
    }

    const missionElement = document.getElementById('missions-panel-body').querySelector('#mission_' + e);

    if (missionElement === null) {
      return
    }

    const mission = JSON.parse(missionElement.dataset.sortableBy);

    if (isMission) {
      credits -= mission.average_credits;
      count--;
      updateStats();
      missionIds = missionIds.filter(id => id !== e);
    } else if (isAllianceMission) {
      allianceCredits -= mission.average_credits;
      allianceCount--;
      updateStats();
      allianceMissionIds = allianceMissionIds.filter(id => id !== e);
    }
  }

  function updateStats() {
    span.textContent = 'Credits: ' + I18n.toNumber(credits, {precision: 0}) + ' Credits (Allianz): ' + I18n.toNumber(allianceCredits, {precision: 0});
    span.title = 'Count: ' + I18n.toNumber(count, {precision: 0}) + '/' + I18n.toNumber(mission_count_max, {precision: 0}) + ' Count (Allianz): ' + I18n.toNumber(allianceCount, {precision: 0});
  }
})();
