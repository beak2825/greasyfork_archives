// ==UserScript==
// @name         AutoOdpowiadacz SWDR
// @version      1.0.0
// @description  Automatyczna odpowiedź do następnej scenerii o wyprawieniu pociągu
// @author       Spythere
// @match       https://rj.td2.info.pl/swdr
// @run-at       document-end
// @namespace https://greasyfork.org/users/1034973
// @downloadURL https://update.greasyfork.org/scripts/467179/AutoOdpowiadacz%20SWDR.user.js
// @updateURL https://update.greasyfork.org/scripts/467179/AutoOdpowiadacz%20SWDR.meta.js
// ==/UserScript==

(function() {
    console.log("Korzystasz z AutoOdpowiadacza SWDR autorstwa @Spythere!");

    const departureButtonEl = document.querySelector("#ttTimeSaveDataButton");
    const inputEl = document.querySelector("#sendChatMessageText");


    departureButtonEl.addEventListener('click', () => {
        const nextConnectionData = document.querySelector(`.collapse > table > tbody > tr[data-id='${timetableMenu_id}'] > td:nth-child(10)`).textContent.split(' (');
        const viaData = document.querySelector(`.collapse > table > tbody > tr[data-id='${timetableMenu_id}'] > td:nth-child(9)`);

        console.log(viaData);

        if(!nextConnectionData || nextConnectionData.length == 1) return;

        const nextStation = nextConnectionData[0].replace(/ /g, '_').trim();
        const route = nextConnectionData[1].replace(/[()]/g, '').trim();
        const departure = document.querySelector("#ttTimeConfirmTable > tbody > tr:nth-child(2) > td:nth-child(4) > div.input-group.ttTimeConfirmClockpickerDeparture > input").value;

        inputEl.value = `@${nextStation} Pociąg ${timetableMenu_trainno} odjechał na szlak ${route} o godzinie ${departure}`;
    });
})();