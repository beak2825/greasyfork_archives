// ==UserScript==
// @name         AutoOdpowiadacz SWDR
// @version      1.2.0
// @description  Automatyczna odpowiedź do następnej scenerii o wyprawieniu pociągu
// @author       Spythere
// @match       https://rj.td2.info.pl/swdr
// @run-at       document-end
// @namespace https://greasyfork.org/users/1034973
// @downloadURL https://update.greasyfork.org/scripts/469659/AutoOdpowiadacz%20SWDR.user.js
// @updateURL https://update.greasyfork.org/scripts/469659/AutoOdpowiadacz%20SWDR.meta.js
// ==/UserScript==

(function () {
  console.log('Korzystasz z AutoOdpowiadacza SWDR autorstwa @Spythere!');

  const departureButtonEl = document.querySelector('#ttTimeSaveDataButton');
  const inputEl = document.querySelector('#sendPrivateChatMessageText');

  const swdrNewTTModal = document.querySelector('#ttTimeConfirmModal > div > div > div.modal-footer');

  const saveBtnEl = document.createElement('button');
  saveBtnEl.setAttribute('id', 'saveAndNotifyButton');
  saveBtnEl.classList.add('btn', 'btn-sm', 'bg-green');
  saveBtnEl.innerText = 'Zapisz i powiadom';

  saveBtnEl.addEventListener('click', () => {
    const nextConnectionData = timetableMenu_nextSceneryName;

    if (!nextConnectionData) return;

    const departure = document.querySelector(
      '#ttTimeConfirmTable > tbody > tr:nth-child(2) > td:nth-child(4) > div.input-group.ttTimeConfirmClockpickerDeparture > input'
    ).value;

    ttTimeSaveData(false);

    showPrivateMessageToScenery(timetableMenu_nextSceneryName, timetableMenu_trainno);
    inputEl.value = `@${nextStation} ${timetableMenu_trainno} odjechał ${departure}`;
  });

  swdrNewTTModal.insertBefore(saveBtnEl, swdrNewTTModal.childNodes[1]);
})();
