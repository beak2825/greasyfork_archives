// ==UserScript==
// @name         Test TM
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Test
// @match        *://*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/543282/Test%20TM.user.js
// @updateURL https://update.greasyfork.org/scripts/543282/Test%20TM.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener('load', function() {




function getClientNumber() {
    console.log('window.parent.parent.frames.length:', window.parent.parent.frames.length);

        // Pak de derde frame (index 2) uit het frameset
        const mainframe = window.parent.parent.frames[2]; // of window.frames['mainframe']

        if (!mainframe) {
            console.error('Mainframe (derde frame) niet gevonden');
            return null;
        }

        // Pak het document uit de frame
        const frameDoc = mainframe.document;

        if (!frameDoc) {
            console.error('Kan niet bij frame document');
            return null;
        }

        console.log('Frame document gevonden');
        const container = frameDoc.getElementById('tab_contents3');
        console.log(container);

    if (!container) return null;

    // Zoek de tweede <tr> binnen de container
    const rows = container.querySelectorAll('table tbody tr');
    if (rows.length >= 2) {
        const secondRow = rows[1];
        const lastCell = secondRow.lastElementChild;

        if (lastCell) {
            const text = (lastCell.textContent || lastCell.innerText).trim();
            const numberMatch = text.match(/\d+/);
            if (numberMatch) {
                return numberMatch[0];
            }
        }
    }

    return null;
}

    const clientNumber = getClientNumber();

    if (clientNumber === null){
        console.log("kan clientnummer niet vinden");
    } else {
        console.log("haal data op")

        fetch("https://whisper.anzwerz.ai/api/get_treatment_data/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ patientnummer: String(clientNumber) })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Snowflake resultaat:', data);
            const subjectief = data.response.subjectief;
            const objectief = data.response.objectief;
            const evaluatie = data.response.evaluatie;
            const plan = data.response.plan;
            const opmerkingen = data.response.opmerkingen;
            const afwijking = data.response.afwijking;

            console.log(evaluatie);


            const subjectiefeEl = document.getElementById('Subjectief');

            if (subjectiefeEl && subjectiefeEl.innerHTML == '' ){

                if (subjectiefeEl && subjectief) {
                    subjectiefeEl.innerHTML = subjectief;
                }


                const objectiefeEl = document.getElementById('Objectief');
                if (objectiefeEl && objectief) {
                    objectiefeEl.innerHTML = objectief;
                }

                const evaluatieEl = document.getElementById('Evaluatie');
                if (evaluatieEl && evaluatie) {
                    evaluatieEl.innerHTML = evaluatie;
                }

                const planEl = document.getElementById('PlanVanAanpak');
                if (planEl && plan) {
                    planEl.innerHTML = plan;
                }

                const opmerkingenEl = document.getElementById('Opmerkingen');
                if (opmerkingenEl && opmerkingen) {
                    opmerkingenEl.innerHTML = opmerkingen;
                }

                if (afwijking && afwijking !== ''){
                    const afwijkingEl = document.getElementById('afwijking');
                    afwijkingEl.checked = true;

                    const afwijkingomsEl = document.getElementById('afwijkingoms');
                    if (afwijkingomsEl && afwijking) {
                        afwijkingomsEl.value = afwijking;
                    }
                }
            }

        });

    }

}, false);
})();