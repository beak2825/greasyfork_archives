// ==UserScript==
// @name        * Personalzuweiser
// @namespace   bos-ernie.leitstellenspiel.de
// @version     2.2.3
// @license     BSD-3-Clause
// @author      BOS-Ernie, leeSalami, Manute1337
// @description Weist maximal mögliche Anzahl an Personal einem Fahrzeug zu. Originalskript von BOS-Ernie, angepasst und erweitert, zur Unterstützung der neusten Lehrgänge, durch leeSalami. Weitere Lehrgänge hinzugefügt von Manute1337.
// @match       https://*.leitstellenspiel.de/vehicles/*/zuweisung
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/494130/%2A%20Personalzuweiser.user.js
// @updateURL https://update.greasyfork.org/scripts/494130/%2A%20Personalzuweiser.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  updatePersonalCount();
  const csrfToken = document.querySelector('meta[name=csrf-token]')?.content;

  if (!csrfToken) {
    return;
  }

  const loadingText = I18n.t('common.loading');
  addButtonGroup();

  async function assign() {
    const assignedPersonsElement = getAssignedPersonsElement();
    const numberOfAssignedPersonnel = parseInt(assignedPersonsElement.innerText);
    const vehicleCapacity = parseInt(assignedPersonsElement.parentElement.firstElementChild.innerText);

    let numberOfPersonnelToAssign = vehicleCapacity - numberOfAssignedPersonnel;
    const vehicleTypeId = getVehicleTypeId();

    if (numberOfPersonnelToAssign > 0 && vehicleTypeId !== null) {
      const vehicleTraining = getIdentifierByVehicleTypeId(vehicleTypeId);

      if (vehicleTraining === null) {
        return;
      }

      const trainingCount = Object.keys(vehicleTraining).length;

      if (trainingCount === 0) {
        return;
      }

      if (trainingCount !== 1 || !('no_training' in vehicleTraining)) {
        const rowsWithTraining = document.querySelectorAll('tbody tr:not([data-filterable-by="[]"]):has(a.btn-success):not(:has(span[data-education-key]))');
        const sortedRowsWithTraining = sortRows(rowsWithTraining);

        for (let i = 0, n = sortedRowsWithTraining.length; i < n; i++) {
          let hasIdentifier = true;
          let currentIdentifier = null;

          for (const educationIdentifier in vehicleTraining) {
            if (educationIdentifier === 'no_training') {
              continue;
            }

            const rowHasTraining = sortedRowsWithTraining[i].dataset.filterableBy.includes('"' + educationIdentifier + '"');

            if (vehicleTraining[educationIdentifier] === true && !rowHasTraining) {
              hasIdentifier = false;
            } else if (typeof vehicleTraining[educationIdentifier] === 'number') {
              if (!rowHasTraining || vehicleTraining[educationIdentifier] <= 0) {
                hasIdentifier = false;
              } else {
                hasIdentifier = true;
                currentIdentifier = educationIdentifier;
                break;
              }
            }
          }

          if (!hasIdentifier) {
            continue;
          }

          if (await changeAssignment(sortedRowsWithTraining[i].querySelector('a.btn-success'))) {
            numberOfPersonnelToAssign--;

            if (currentIdentifier) {
              vehicleTraining[currentIdentifier]--;
            }

            if (numberOfPersonnelToAssign === 0) {
              break;
            }

            await new Promise(r => setTimeout(r, 5));
          }
        }
      }
      if (numberOfPersonnelToAssign === 0) {
        return;
      }

      if ('no_training' in vehicleTraining) {
        if (typeof vehicleTraining['no_training'] === 'number') {
          numberOfPersonnelToAssign = Math.min(numberOfPersonnelToAssign, vehicleTraining['no_training']);
        }

        await assignPersonsWithoutTraining(numberOfPersonnelToAssign);
      }
    }
  }

  async function assignPersonsWithoutTraining(amount) {
    const rowsWithoutTraining = document.querySelectorAll('tbody tr[data-filterable-by="[]"]:has(a.btn-success):not(:has(span[data-education-key]))');
    const sortedRowsWithoutTraining = sortRows(rowsWithoutTraining);


    for (let i = 0, n = sortedRowsWithoutTraining.length; i < n; i++) {
      if (await changeAssignment(sortedRowsWithoutTraining[i].querySelector('a.btn-success'))) {
        amount--;

        if (amount === 0) {
          break;
        }

        await new Promise(r => setTimeout(r, 5));
      }
    }
  }

  async function changeAssignment(button) {
    if (button) {
      const personalId = button.getAttribute('personal_id');
      const personalElement = document.getElementById(`personal_${personalId}`);
      personalElement.innerHTML = `<td colspan="4">${loadingText}</td>`;

      try {
        const response = await fetch(button.href, {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'x-csrf-token': csrfToken,
            'x-requested-with': 'XMLHttpRequest',
          },
        });

        if (!response.ok) {
          return false;
        }

        personalElement.innerHTML = await response.text();
        updatePersonalCount();

        return true;
      } catch (e) {
        return false;
      }
    }

    return false
  }

  function updatePersonalCount() {
    const counterElement = document.getElementById('count_personal');

    if (!counterElement) {
      return;
    }

    const counter = document.querySelectorAll('.btn-assigned').length;
    const vehicleCapacity = parseInt(counterElement.parentElement.firstElementChild.innerText);
    counterElement.innerText = String(counter);

    if (counter !== vehicleCapacity) {
      counterElement.classList.remove('label-success');
      counterElement.classList.add('label-warning');
    } else {
      counterElement.classList.remove('label-warning');
      counterElement.classList.add('label-success');
    }
  }

  function sortRows(rows) {
    const vehicleId = getVehicleId();

    return Array.from(rows)
      .sort((a, b) => {
        const aInVehicle = a.querySelector('td:nth-child(3) a')?.href?.endsWith('/' + vehicleId);
        const bInVehicle = b.querySelector('td:nth-child(3) a')?.href?.endsWith('/' + vehicleId);

        if ((aInVehicle === true && !bInVehicle) || (aInVehicle === undefined && bInVehicle === false)) {
          return -1;
        } else if (aInVehicle === bInVehicle) {
          return 0;
        } else {
          return 1;
        }
      });
  }

  async function reset() {
    const selectButtons = document.getElementsByClassName('btn btn-default btn-assigned');

    // Since the click event removes the button from the DOM, only every second item would be clicked.
    // To prevent this, the loop is executed backwards.
    for (let i = selectButtons.length - 1; i >= 0; i--) {
      await changeAssignment(selectButtons[i]);
      await new Promise(r => setTimeout(r, 5));
    }
  }

  function assignClickEvent(event) {
    assign();
    event.preventDefault();
  }

  function resetClickEvent(event) {
    reset();
    event.preventDefault();
  }

  function getAssignedPersonsElement() {
    return document.getElementById("count_personal");
  }

  function addButtonGroup() {
    const okIcon = document.createElement("span");
    okIcon.className = "glyphicon glyphicon-ok";

    const assignButton = document.createElement("button");
    assignButton.type = "button";
    assignButton.className = "btn btn-default";
    assignButton.appendChild(okIcon);
    assignButton.addEventListener("click", assignClickEvent);

    const resetIcon = document.createElement("span");
    resetIcon.className = "glyphicon glyphicon-trash";

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "btn btn-default";
    resetButton.appendChild(resetIcon);
    resetButton.addEventListener("click", resetClickEvent);

    const buttonGroup = document.createElement("div");
    buttonGroup.id = "vehicle-assigner-button-group";
    buttonGroup.className = "btn-group";
    buttonGroup.style.marginLeft = "5px";
    buttonGroup.appendChild(assignButton);
    buttonGroup.appendChild(resetButton);

    // Append button group to element with class "vehicles-education-filter-box"
    document.getElementsByClassName("vehicles-education-filter-box")[0].appendChild(buttonGroup);
  }

  function getVehicleId() {
    return window.location.pathname.split("/")[2];
  }

  /**
   * @return {number|null}
   */
  function getVehicleTypeId() {
    const vehicleId = getVehicleId();
    const request = new XMLHttpRequest();
    request.open("GET", `/api/v2/vehicles/${vehicleId}`, false);
    request.send();

    if (request.status === 200) {
      const vehicle = JSON.parse(request.responseText);
      return vehicle.result.vehicle_type;
    }

    return null;
  }



  /**
   * @return {{}|null}
   */
  function getIdentifierByVehicleTypeId(vehicleTypeId) {
    switch (vehicleTypeId) {
      case 0: //LF 20
        return {'no_training': true};
      case 1: //LF 10
        return {'no_training': true};
      case 2: //DLK 23
        return {'no_training': true};
      case 3: //ELW 1
        return {'no_training': true};
      case 4: //RW
        return {'no_training': true};
      case 5: //GW-A
        return {'no_training': true};
      case 6: //LF 8/6
        return {'no_training': true};
      case 7: //LF 20/16
        return {'no_training': true};
      case 8: //LF 10/6
        return {'no_training': true};
      case 9: //LF 16-TS
        return {'no_training': true};
      case 10: //GW-Öl
        return {'no_training': true};
      case 11: //GW-L2-Wasser
        return {'no_training': true};
      case 12: //GW-Messtechnik
        return {'gw_messtechnik': true};
      case 13: //SW 1000
        return {'no_training': true};
      case 14: //SW 2000
        return {'no_training': true};
      case 15: //SW 2000-Tr
        return {'no_training': true};
      case 16: //SW Kats
        return {'no_training': true};
      case 17: //TLF 2000
        return {'no_training': true};
      case 18: //TLF 3000
        return {'no_training': true};
      case 19: //TLF 8/8
        return {'no_training': true};
      case 20: //TLF 8/18
        return {'no_training': true};
      case 21: //TLF 16/24-Tr
        return {'no_training': true};
      case 22: //TLF 16/25
        return {'no_training': true};
      case 23: //TLF 16/45
        return {'no_training': true};
      case 24: //TLF 20/40
        return {'no_training': true};
      case 25: //TLF 20/40-SL
        return {'no_training': true};
      case 26: //TLF 16
        return {'no_training': true};
      case 27: //GW-Gefahrgut
        return {'gw_gefahrgut': true};
      case 28: //RTW
        return {'no_training': true};
      case 29: //NEF
        return {'notarzt': true};
      case 30: //HLF 20
        return {'no_training': true};
      case 31: //RTH
        return {'notarzt': true};
      case 32: //FuStW
        return {'no_training': true};
      case 33: //GW-Höhenrettung
        return {'gw_hoehenrettung': true};
      case 34: //ELW 2
        return {'elw2': true};
      case 35: //leBefKw
        return {'police_einsatzleiter': true};
      case 36: //MTW
        return {'no_training': true};
      case 37: //TSF-W
        return {'no_training': true};
      case 38: //KTW
        return {'no_training': true};
      case 39: //GKW
        return {'no_training': true};
      case 40: //MTW-TZ
        return {'thw_zugtrupp': true};
      case 41: //MzKW
        return {'no_training': true};
      case 42: //LKW K 9
        return {'thw_raumen': true};
      case 45: //MLW 5
        return {'thw_raumen': true};
      case 46: //WLF
        return {'wechsellader': true};
      case 50: //GruKw
        return {'no_training': true};
      case 51: //FüKw
        return {'police_fukw': true};
      case 52: //GefKw
        return {'no_training': true};
      case 53: //Dekon-P
        return {'dekon_p': true};
      case 55: //KdoW-LNA
        return {'lna': true};
      case 56: //KdoW-OrgL
        return {'orgl': true};
      case 57: //FwK
        return {'fwk': true};
      case 58: //KTW Typ B
        return {'no_training': true};
      case 59: //ELW 1 (SEG)
        return {'seg_elw': true};
      case 60: //GW-San
        return {'seg_gw_san': true};
      case 61: //Polizeihubschrauber
        return {'polizeihubschrauber': true};
      case 63: //GW-Taucher
        return {'gw_taucher': true};
      case 64: //GW-Wasserrettung
        return {'gw_wasserrettung': true};
      case 65: //LKW 7 Lkr 19 tm
        return {'no_training': true};
      case 69: //Tauchkraftwagen
        return {'gw_taucher': true};
      case 72: //WaWe 10
        return {'police_wasserwerfer': true};
      case 73: //GRTW
        return {'notarzt': 1, 'no_training': 5};
      case 74: //NAW
        return {'notarzt': 1, 'no_training': 2};
      case 75: //FLF
        return {'arff': true};
      case 76: //Rettungstreppe
        return {'rettungstreppe': true};
      case 79: //SEK - ZF
        return {'police_sek': true};
      case 80: //SEK - MTF
        return {'police_sek': true};
      case 81: //MEK - ZF
        return {'police_mek': true};
      case 82: //MEK - MTF
        return {'police_mek': true};
      case 83: //GW-Werkfeuerwehr
        return {'werkfeuerwehr': true};
      case 84: //ULF mit Löscharm
        return {'werkfeuerwehr': true};
      case 85: //TM 50
        return {'werkfeuerwehr': true};
      case 86: //Turbolöscher
        return {'werkfeuerwehr': true};
      case 87: //TLF 4000
        return {'no_training': true};
      case 88: //KLF
        return {'no_training': true};
      case 89: //MLF
        return {'no_training': true};
      case 90: //HLF 10
        return {'no_training': true};
      case 91: //Rettungshundefahrzeug
        return {'seg_rescue_dogs': true};
      case 93: //MTW-O
        return {'thw_rescue_dogs': true};
      case 94: //DHuFüKw
        return {'k9': true};
      case 95: //Polizeimotorrad
        return {'police_motorcycle': true};
      case 97: //ITW
        return {'intensive_care': 2, 'notarzt': 1};
      case 98: //Zivilstreifenwagen
        return {'criminal_investigation': true};
      case 99: //LKW 7 Lbw
        return {'water_damage_pump': true};
      case 100: //MLW 4
        return {'water_damage_pump': true};
      case 103: //FuStW (DGL)
        return {'police_service_group_leader': true};
      case 104: //GW-L1
        return {'no_training': true};
      case 105: //GW-L2
        return {'no_training': true};
      case 106: //MTF-L
        return {'no_training': true};
      case 107: //LF-L
        return {'no_training': true};
      case 109: //MzGW SB
        return {'heavy_rescue': true};
      case 114: //GW-Lüfter
        return {'no_training': true};
      case 121: //GTLF
        return {'no_training': true};
      case 122: //LKW 7 Lbw (FGr E)
        return {'thw_energy_supply': true};
      case 123: //LKW 7 Lbw (FGr WP)
        return {'water_damage_pump': true};
      case 124: //MTW-OV
        return {'no_training': true};
      case 125: //MTW-Tr UL
        return {'thw_drone': true};
      case 126: //MTF Drohne
        return {'fire_drone': true};
      case 127: //GW UAS
        return {'seg_drone': true};
      case 128: //ELW Drohne
        return {'fire_drone': true};
      case 129: //ELW2 Drohne
        return {'fire_drone': true, 'elw2': true};
      case 130: //GW-Bt
        return {'care_service': 1, 'care_service_equipment': 2};
      case 131: //Bt-Kombi
        return {'care_service': true};
      case 133: //Bt LKW
        return {'care_service': 1, 'care_service_equipment': 2};
      case 134: //Pferdetransporter klein
        return {'police_horse': true};
      case 135: //Pferdetransporter groß
        return {'police_horse': true};
      case 137: //Zugfahrzeug Pferdetransport
        return {'police_horse': true};
      case 140: //MTW-Verpflegung
        return {"fire_care_service": true};
      case 144: //FüKw (THW)
        return {"thw_command": true};
      case 145: //FüKomKW
        return {"thw_command": true};
      case 147: //FmKW
        return {"thw_command": true};
      case 148: //MTW Fgr K
        return {"thw_command": true};
      default:
        return null;
    }
  }
})();
