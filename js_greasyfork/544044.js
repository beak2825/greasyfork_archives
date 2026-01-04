// ==UserScript==
// @name         Einsatzöffner
// @namespace    leeSalami.lss
// @version      1.0
// @license      All Rights Reserved
// @description  Öffnet alle Einsatztypen in verschiedenen Tabs
// @author       leeSalami
// @require      https://update.greasyfork.org/scripts/528065/Skripteinstellungen.user.js
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js
// @match        https://*.leitstellenspiel.de
// @match        https://*.leitstellenspiel.de/settings/index*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/544044/Einsatz%C3%B6ffner.user.js
// @updateURL https://update.greasyfork.org/scripts/544044/Einsatz%C3%B6ffner.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  const INCLUDED_MISSION_TYPE_IDS_STORAGE_KEY = 'included_mission_type_ids';
  const EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY = 'excluded_mission_type_ids';

  if (location.pathname.startsWith('/settings/index')) {
    await addOptions({
      'identifier': 'mission_opener',
      'title': 'Einsatzöffner',
      'settings': [
        {
          'type': 'header',
          'text': 'Allgemeine Einstellungen'
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

  addOpenButton();

  function addOpenButton() {
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group';

    const icon = document.createElement('img');
    icon.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAABqElEQVR4nO2ZXU7CQBSFR1mIIHvQnSB7AR8hxsTEN19kD+gy0G1oeEckISSfGW2Ta1Oxc+/052G+Nyi955zbmWmnOJdIJBJVAObADh174Na1BXACbJTmc/atBchCzAxX4But8CkwBp6Bd+BANbzZmVJvUVZQY74PvKJnE8u8R2N+jZ6gK0C5+V+fQzshO/8BTICBPxbUCb35x+x7VYBxwfxFbNNVzLuf46oAfsLmTNoybwngV5ucgWvJvCWAXCp7lU+MbN4SIPyksLvyQ8H84q/FoVMBQs13KoDGfGcCaM13IkDIhC1DPADuSn9QZwCrefEUuwl6MIwRwDJszEQKcG/pfBcCfBqGzTx42NQQ4AbYAnehnUczcetahVrRJwWwQQogiO6uCX1SABukAILo7prQp+Y98T/aPaF90BaRbyXOo7s8rj0U2m/aIk+iyDS6y+Pa10J7qS1yJYps63wzJwEuM72ckTPspF4KIabZ5e3VMOaHWeel+ZVp/xDh7bSFNXAWozv9rBNNsvK6ZvOF4eTnxNKvCgH/0FTlkNX19UeNbTsTiYTrBF8dlrgLgLL6rAAAAABJRU5ErkJggg==';
    icon.className = 'icon';
    icon.height = 15;
    icon.width = 15;

    const button = document.createElement('a');
    button.className = 'btn btn-xs btn-default';
    button.id = 'mission_open_missions';
    button.title = 'Einsätze öffnen';
    button.style.marginLeft = '5px';
    button.addEventListener('click', openMissions);
    button.insertAdjacentElement('afterbegin', icon);
    buttonGroup.appendChild(button);

    const anchorSettings = document.createElement('a');
    anchorSettings.className = 'btn btn-default btn-xs';
    anchorSettings.href = '/settings/index#mission_opener';
    anchorSettings.target = '_blank';

    const spanSettings = document.createElement('span');
    spanSettings.className = 'glyphicon glyphicon-cog';
    spanSettings.title = 'Einstellungen';
    anchorSettings.appendChild(spanSettings);
    buttonGroup.appendChild(anchorSettings);

    document.getElementById('missions-panel-main').querySelector(':scope > div:last-of-type').insertAdjacentElement('beforebegin', buttonGroup);
  }

  async function openMissions(event) {
    event.preventDefault();
    const targetElement = event.currentTarget;
    targetElement.setAttribute('disabled', 'true');
    targetElement.classList.add('disabled');

    const missions = document.getElementById('mission_list').querySelectorAll(':scope > .missionSideBarEntry:not(.mission_deleted)');
    const includeMissionIds = JSON.parse(await GM.getValue(INCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
    const excludeMissionIds = JSON.parse(await GM.getValue(EXCLUDED_MISSION_TYPE_IDS_STORAGE_KEY, '[]'));
    const hasIncludeMissionIds = includeMissionIds.length > 0;
    const hasExcludeMissionIds = excludeMissionIds.length > 0;
    const missionTypeIds = [];

    for (let i = 0, n = missions.length; i < n; i++) {
      const missionTypeId = parseInt(missions[i].getAttribute('mission_type_id'), 10);

      if (missionTypeIds.includes(missionTypeId) || (hasIncludeMissionIds && !includeMissionIds.includes(missionTypeId)) || (hasExcludeMissionIds && excludeMissionIds.includes(missionTypeId))) {
        continue;
      }

      const missionId = missions[i].getAttribute('mission_id');
      const alarmUrl = document.getElementById(`alarm_button_${missionId}`)?.getAttribute('href');

      if (!alarmUrl) {
        continue;
      }

      window.open(alarmUrl, '_blank');
      missionTypeIds.push(missionTypeId)
    }

    targetElement.removeAttribute('disabled');
    targetElement.classList.remove('disabled');
  }
})();
