// ==UserScript==
// @name         Saisonale Einsätze
// @namespace    leeSalami.lss
// @version      1.1.2
// @license      MIT
// @description  Fügt einen Filter für saisonale Einsätze hinzu
// @author       leeSalami
// @match        https://*.leitstellenspiel.de
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @downloadURL https://update.greasyfork.org/scripts/498183/Saisonale%20Eins%C3%A4tze.user.js
// @updateURL https://update.greasyfork.org/scripts/498183/Saisonale%20Eins%C3%A4tze.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const missionsElement = document.getElementById('missions');

  if (!missionsElement) {
    return;
  }

  /**
   * @type {string[]}
   */
  const seasonalMissionIds = await getSeasonalMissionIds();
  const missionSelector = getMissionSelector(seasonalMissionIds);
  let filtered = false;

  setCss();
  addFilterButton();

  function filterSeasonalMissions(e) {
    e.preventDefault();

    filtered = !e.currentTarget.classList.contains('btn-success');
    const missions = missionsElement.querySelectorAll(missionSelector);

    if (!filtered) {
      e.currentTarget.classList.replace('btn-success', 'btn-danger');
    } else {
      e.currentTarget.classList.replace('btn-danger', 'btn-success');
    }

    for (let  i = 0, n = missions.length; i < n; i++) {
        missions[i].classList.toggle('seasonal-missions-filtered', filtered);
    }
  }

  function addFilterButton() {
    const icon = document.createElement('img');
    icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjElEQVR4nO2QuwmAQBBET0wvsAU7sBtTi7EAS7IAi7gCDMTIQHiyMoKKv8tdGFhu5+0O55wKSAHvHgrw5rsaFED7Arfmc6eLBpZAp/5OnXzWpwZnwKTBoO13GuQzf7bBAciB+iV2LV/Ywz1QRajfwyPQRGg8xH6KexE//HBEnT9s1sNXmX+FEy2IVbIAcIu+jCM+kocAAAAASUVORK5CYII='
    icon.className = 'icon icons8-Calendar';
    icon.height = 15;
    icon.width = 15;

    const button = document.createElement('a');
    button.className = 'btn btn-xs btn-danger';
    button.id = 'mission_select_seasonal_missions';
    button.title = 'Saisonale Einsätze';
    button.addEventListener('click', filterSeasonalMissions);
    button.appendChild(icon);

    document.getElementById('missions-panel-main').querySelector(':scope > a:last-of-type').insertAdjacentElement('afterend', button);
  }

  function getMissionSelector(seasonalMissionIds) {
    let missionSelector = '.missionSideBarEntry:not(.mission_deleted)';

    for (let  i = 0, n = seasonalMissionIds.length; i < n; i++) {
      missionSelector += `:not([mission_type_id="${seasonalMissionIds[i]}"])`;
    }

    return missionSelector;
  }

  async function getSeasonalMissionIds() {
    const seasonalMissionIds = [];
    const now = Date.now();

    const db = await openDb();
    await updateMissions(db);
    const missions = await getAllData(db, 'missions');

    for (let  i = 0, n = missions.length; i < n; i++) {
      if (missions[i]['additional']['date_start'] === undefined || missions[i]['additional']['date_end'] === undefined || seasonalMissionIds.includes(missions[i]['base_mission_id'])) {
        continue;
      }

      if (Date.parse(missions[i]['additional']['date_start']) < now && Date.parse(missions[i]['additional']['date_end']) > now) {
        seasonalMissionIds.push(missions[i]['base_mission_id']);
      }
    }

    return seasonalMissionIds;
  }

  const prepareMissionDomElementStrOrig = prepareMissionDomElementStr;
  prepareMissionDomElementStr = (e, t, i, n, s, o, a, r, l, c, u, d, h, p, m, _, f) => {
    const missionDomElementStr = prepareMissionDomElementStrOrig(e, t, i, n, s, o, a, r, l, c, u, d, h, p, m, _, f);

    if (filtered && !seasonalMissionIds.includes(s.mtid)) {
      return missionDomElementStr.replace("class='", "class='seasonal-missions-filtered ");
    }

    return missionDomElementStr;
  }

  function setCss() {
    const style = document.createElement('style');
    style.innerHTML = `
      .seasonal-missions-filtered {
        display: none;
      }
    `;
    document.head.appendChild(style);
  }
})();
