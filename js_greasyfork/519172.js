// ==UserScript==
// @name         BePo-Werber
// @namespace    leeSalami.lss
// @version      0.1.6
// @description  Wählt unausgebildetes Personal von anderen Wachen aus, bis das gewünschte Soll erreicht ist.
// @author       leeSalami
// @license      MIT
// @match        https://*.leitstellenspiel.de/
// @match        https://*.leitstellenspiel.de/buildings/*/hire
// @require      https://update.greasyfork.org/scripts/516844/API-Speicher.user.js?v=1
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519172/BePo-Werber.user.js
// @updateURL https://update.greasyfork.org/scripts/519172/BePo-Werber.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const buildingTypeId = parseInt(document.querySelector('h1[building_type]')?.getAttribute('building_type'));

  if (buildingTypeId !== 11) {
    return;
  }

  let totalAvailable = 0;
  let requiredPersonnelAmount;
  await addInputElements();
  const db = await openDb();
  const refreshedBuildingData = await updateBuildings(db);
  const selectButton = document.getElementById('select-personnel');
  selectButton.disabled = false;
  selectButton.classList.remove('disabled');

  async function addInputElements() {
    const submitButton = document.querySelector('.navbar-fixed-bottom input[name="commit"]');
    const infoBanner = document.querySelector('form[action$="/adopt"] h2 + .alert-info');

    if (!submitButton || !infoBanner) {
      return;
    }

    const button = document.createElement('input');
    button.type = 'submit';
    button.id = 'select-personnel';
    button.className = 'btn btn-success navbar-btn disabled';
    button.value = 'Personal auswählen';
    button.style.marginLeft = '15px';
    button.disabled = true;
    button.addEventListener('click', selectPersonnel);
    submitButton.insertAdjacentElement('afterend', button);

    const inputWrapper = document.createElement('div');
    inputWrapper.style.marginBottom = '15px';
    infoBanner.insertAdjacentElement('afterend', inputWrapper);

    const labelTargetAmount = document.createElement('label');
    labelTargetAmount.for = 'personnel-target-amount';
    labelTargetAmount.innerText = 'Personal-Soll:';
    labelTargetAmount.style.marginRight = '5px';
    inputWrapper.insertAdjacentElement('beforeend', labelTargetAmount);

    const inputTargetAmount = document.createElement('input');
    inputTargetAmount.type = 'number';
    inputTargetAmount.id = 'personnel-target-amount';
    inputTargetAmount.min = '1';
    inputTargetAmount.max = '400';
    inputTargetAmount.value = await GM.getValue('personnel-target-amount', '239');
    inputTargetAmount.style.width = '75px';
    inputTargetAmount.style.marginRight = '20px';
    inputTargetAmount.addEventListener('input', (e) => {GM.setValue('personnel-target-amount', e.currentTarget.value)});
    inputWrapper.insertAdjacentElement('beforeend', inputTargetAmount);

    const labelMinPolicePersonnel = document.createElement('label');
    labelMinPolicePersonnel.for = 'min-police-personnel';
    labelMinPolicePersonnel.innerText = 'Min. Personal Polizeiwache:';
    labelMinPolicePersonnel.style.marginRight = '5px';
    inputWrapper.insertAdjacentElement('beforeend', labelMinPolicePersonnel);

    const inputMinPolicePersonnel = document.createElement('input');
    inputMinPolicePersonnel.type = 'number';
    inputMinPolicePersonnel.id = 'min-police-personnel';
    inputMinPolicePersonnel.min = '2';
    inputMinPolicePersonnel.max = '400';
    inputMinPolicePersonnel.value = await GM.getValue('min-police-personnel', '36');
    inputMinPolicePersonnel.style.width = '75px';
    inputMinPolicePersonnel.style.marginRight = '20px';
    inputMinPolicePersonnel.addEventListener('input', (e) => {GM.setValue('min-police-personnel', e.currentTarget.value);getAvailablePersonnelPerBuilding()});
    inputWrapper.insertAdjacentElement('beforeend', inputMinPolicePersonnel);

    const labelMinBepoPersonnel = document.createElement('label');
    labelMinBepoPersonnel.for = 'min-bepo-personnel';
    labelMinBepoPersonnel.innerText = 'Min. Personal Bereitschaftspolizei:';
    labelMinBepoPersonnel.style.marginRight = '5px';
    inputWrapper.insertAdjacentElement('beforeend', labelMinBepoPersonnel);

    const inputMinBepoPersonnel = document.createElement('input');
    inputMinBepoPersonnel.type = 'number';
    inputMinBepoPersonnel.id = 'min-bepo-personnel';
    inputMinBepoPersonnel.min = '0';
    inputMinBepoPersonnel.max = '400';
    inputMinBepoPersonnel.value = await GM.getValue('min-bepo-personnel', '239');
    inputMinBepoPersonnel.style.width = '75px';
    inputMinBepoPersonnel.style.marginRight = '20px';
    inputMinBepoPersonnel.addEventListener('input', (e) => {GM.setValue('min-bepo-personnel', e.currentTarget.value);getAvailablePersonnelPerBuilding()});
    inputWrapper.insertAdjacentElement('beforeend', inputMinBepoPersonnel);
  }

  async function selectPersonnel(e) {
    e.preventDefault();
    const building = await getData(db, 'buildings', parseInt(window.location.pathname.split('/').reverse()[1]));
    requiredPersonnelAmount = parseInt(document.getElementById('personnel-target-amount').value) - building.personal_count;

    if (requiredPersonnelAmount <= 0) {
      return;
    }

    let personnelPerBuilding;
    totalAvailable = await GM.getValue('total-building-personnel', 0);

    if (!refreshedBuildingData && totalAvailable > 0) {
      personnelPerBuilding = await getAvailableBuildingPersonnel();
    } else {
      totalAvailable = 0;
      personnelPerBuilding = await getAvailablePersonnelPerBuilding();
    }

    if (totalAvailable < requiredPersonnelAmount) {
      return;
    }

    const personnelPerBuildingSorted = personnelPerBuilding.sort((a, b) => b.total - a.total);

    for (let i = 0, n = personnelPerBuildingSorted.length; i < n; i++) {
      const buildingHeadingElement = document.querySelector('form[action$="/adopt"] div[href="/buildings/' + personnelPerBuildingSorted[i]['id'] + '/schooling_personal_select"]');

      if (!buildingHeadingElement) {
        continue;
      }

      buildingHeadingElement?.click();
      const buildingPersonnelTable = await waitForElm('#personal_table_' + personnelPerBuildingSorted[i]['id']);
      buildingPersonnelTable.parentElement.parentElement.scrollIntoView(true);

      if (selectBuildingPersonnel(personnelPerBuildingSorted[i])) {
        break;
      }

      await new Promise(r => setTimeout(r, 100));
    }

    document.querySelector('.navbar-fixed-bottom input[type="submit"]').addEventListener('click', () => {
      setAvailableBuildingPersonnel(personnelPerBuildingSorted);
      GM.setValue('total-building-personnel', totalAvailable);
    });
  }

  function selectBuildingPersonnel(building) {
    const nodeSnapshots = document.evaluate('//table[@id="personal_table_' + building.id + '"]/tbody/tr[td[3][normalize-space()=""] and td[4][normalize-space()=""] and td[1][input]]/td[1]/input', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (let i = 0, n = nodeSnapshots.snapshotLength; i < n; i++) {
      nodeSnapshots.snapshotItem(i).click();
      requiredPersonnelAmount--;
      totalAvailable--;
      building.available--;
      building.total--;

      if (requiredPersonnelAmount <= 0) {
        return true;
      } else if (building.available <= 0 || building.total <= 0 || totalAvailable <= 0) {
        building.available = 0;
        return false;
      }
    }

    return false;
  }

  async function getAvailablePersonnelPerBuilding() {
    const buildings = await getDataByIndex(db, 'buildings', 'building_type', IDBKeyRange.bound(6, 11));
    const personnel = [];

    for (let i = 0, n = buildings.length; i < n; i++) {
      let available = 0;
      if (buildings[i]['building_type'] === 11) {
        available = buildings[i]['personal_count'] - parseInt(document.getElementById('min-bepo-personnel').value);
      } else if (buildings[i]['building_type'] === 6) {
        available = buildings[i]['personal_count'] - parseInt(document.getElementById('min-police-personnel').value);
      } else {
        continue;
      }

      if (available > 0) {
        let total = buildings[i]['personal_count'];

        if (buildings[i]['building_type'] === 11 && total < 310) {
          total = available
        }

        personnel.push({'id': buildings[i]['id'], 'available': available, total: total});
        totalAvailable += available;
      }
    }

    setAvailableBuildingPersonnel(personnel);
    await GM.setValue('total-building-personnel', totalAvailable);

    return personnel;
  }

  async function getAvailableBuildingPersonnel() {
    return JSON.parse(await GM.getValue('available-building-personnel', '[]'));
  }

  function setAvailableBuildingPersonnel(data) {
    GM.setValue('available-building-personnel', JSON.stringify(data));
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
