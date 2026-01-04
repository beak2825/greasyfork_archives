// ==UserScript==
// @name         Saisonale Einsätze
// @namespace    leeSalami.lss
// @version      1.0
// @license      MIT
// @description  Fügt einen Filter für saisonale Einsätze hinzu
// @author       leeSalami
// @match        https://*.leitstellenspiel.de
// @downloadURL https://update.greasyfork.org/scripts/514738/Saisonale%20Eins%C3%A4tze.user.js
// @updateURL https://update.greasyfork.org/scripts/514738/Saisonale%20Eins%C3%A4tze.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  if (document.getElementById('mission_list') === null) {
    return;
  }

  /**
   * @type {object[]|null}
   */
  const aMissions = await fetchMissions();

  /**
   * @type {string[]}
   */
  const seasonalMissionIds = getSeasonalMissionIds();
  let observer = null;

  addFilterButton();

  function filterSeasonalMissions(e) {
    const missions = document.querySelectorAll('#missions-panel-body .missionSideBarEntry:not(.mission_deleted)');

    if (missions === null) {
      return;
    }

    const hide = e.currentTarget.classList.contains('btn-success');

    if (hide) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      e.currentTarget.classList.replace('btn-success', 'btn-danger');
    } else {
      startObserving(missions[0].parentElement.parentElement, 'missionSideBarEntry');
      e.currentTarget.classList.replace('btn-danger', 'btn-success');
    }

    for (let  i = 0, n = missions.length; i < n; i++) {
      if (seasonalMissionIds.includes(missions[i].getAttribute('mission_type_id'))) {
        missions[i].style.display = null;
      } else {
        if (hide) {
          missions[i].style.display = null;
        } else {
          missions[i].style.display = 'none';
        }
      }
    }
  }

  function addFilterButton() {
    const img = document.createElement('img');
    img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAjElEQVR4nO2QuwmAQBBET0wvsAU7sBtTi7EAS7IAi7gCDMTIQHiyMoKKv8tdGFhu5+0O55wKSAHvHgrw5rsaFED7Arfmc6eLBpZAp/5OnXzWpwZnwKTBoO13GuQzf7bBAciB+iV2LV/Ywz1QRajfwyPQRGg8xH6KexE//HBEnT9s1sNXmX+FEy2IVbIAcIu+jCM+kocAAAAASUVORK5CYII='
    img.className = 'icon icons8-Calendar';
    img.height = 15;
    img.width = 15;

    const anchorElement = document.createElement('a');
    anchorElement.className = 'btn btn-xs btn-danger';
    anchorElement.id = 'mission_select_seasonal_missions';
    anchorElement.title = 'Saisonale Einsätze';
    anchorElement.addEventListener('click', filterSeasonalMissions);
    anchorElement.appendChild(img);

    const lastAnchor = document.querySelector('#missions .missions-panel-main > a:last-of-type');

    if (lastAnchor === null) {
      return;
    }

    lastAnchor.parentNode.insertBefore(anchorElement, lastAnchor.nextSibling);
  }

  function getSeasonalMissionIds() {
    let seasonalMissionIds = [];
    const now = Date.now();

    for (let  i = 0, n = aMissions.length; i < n; i++) {
      if (aMissions[i]['additional']['date_start'] === undefined || aMissions[i]['additional']['date_end'] === undefined) {
        continue;
      }

      if (Date.parse(aMissions[i]['additional']['date_start']) < now && Date.parse(aMissions[i]['additional']['date_end']) > now) {
        seasonalMissionIds.push(aMissions[i]['id']);
      }
    }

    return seasonalMissionIds;
  }

  async function fetchMissions() {
    let aMissions = null;
    let aMissionsStored = null;
    console.log(localStorage.aMissions)
    if (localStorage.aMissions) {
      aMissionsStored = JSON.parse(localStorage.aMissions);
    }

    if (!aMissionsStored || aMissionsStored.lastUpdate < (new Date().getTime() - 5 * 60 * 1000) || aMissionsStored.userId !== user_id) {
      try {
        const missions = await (await fetch('/einsaetze.json')).json();
        console.log(missions)
        if (missions) {
          localStorage.setItem('aMissions', JSON.stringify({lastUpdate: new Date().getTime(), value: missions, userId: user_id}));
          aMissions = missions
        }
      } catch(e) {
        console.log(e.message)
        if (aMissionsStored && aMissionsStored.userId === user_id) {
          aMissions = aMissionsStored.value;
        }
      }
    } else {
      aMissions = aMissionsStored.value;
    }

    return aMissions;
  }

  function startObserving(domNode, classToLookFor) {
    observer = new MutationObserver(mutations => {
      mutations.forEach(function (mutation) {

        const elementAdded = Array.from(mutation.addedNodes, (element) => {
            if (element.classList.contains(classToLookFor) && !seasonalMissionIds.includes(element.getAttribute('mission_type_id'))) {
              return element;
            } else {
              return null;
            }
          },
        );

        if (elementAdded[0] !== undefined) {
          elementAdded[0].style.display = 'none';
        }
      });
    });

    observer.observe(domNode, {
      childList: true,
      subtree: true
    });
  }
})();
