// ==UserScript==
// @name         Behandeling SOM
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Behandeling inladen voor SOM
// @match        *://*/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/543301/Behandeling%20SOM.user.js
// @updateURL https://update.greasyfork.org/scripts/543301/Behandeling%20SOM.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.addEventListener('load', function() {




function getClientNumber() {
   
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
        try {
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
         } catch (err) {
            fetch("https://whisper.anzwerz.ai/api/log_tm_error/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ error_description: err.message,
                                    error_log: err.stack,
                                  error_type: err.name          
             })
            })
            return null;

         }

        return null;
   

    }


    function getCurrentdate(){
        const currentLi = document.getElementById('current');
        if (currentLi){
            const smallElement = currentLi.querySelector('small');
            if (smallElement) {
                console.log("element gevonden");
                try{
                    const datum = smallElement.textContent;
                    const datumGedeelte = datum.split(' ')[1];
                    const delen = datumGedeelte.split('-');
                    const dag = delen[0].padStart(2, '0'); // "14"
                    const maand = delen[1].padStart(2, '0'); // "07"
                    const jaar = '20' + delen[2].replace("'", ""); // "2025"
                    
                    // Combineer tot YYYY-MM-DD formaat
                    const geformatteerdeDatum = `${jaar}-${maand}-${dag}`;
                    console.log(geformatteerdeDatum);
                    
                    return geformatteerdeDatum;

                } catch (err) {
                    fetch("https://whisper.anzwerz.ai/api/log_tm_error/", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                    body: JSON.stringify({ error_description: err.message,
                                            error_log: err.stack,
                                        error_type: err.name          
                    })
                    })
                    return null;
                }
            }
            return null;
        }
        return null;
    }


    const clientNumber = getClientNumber();
    const dateConsult = getCurrentdate()

    if (clientNumber === null){
        console.log("kan clientnummer niet vinden");
     } else if (dateConsult == null) {
        console.log("kan datum niet vinden");
    } else {
        console.log("haal data op")
    

        fetch("https://whisper.anzwerz.ai/api/v2/treatment_som/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ patient_number: String(clientNumber),
                                  date_of_consult: dateConsult
                                   
             })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); 
        })
        .then(data => {
            console.log('Snowflake resultaat:', data);
            if (data.ok){

                const subjectief = data.response.behandeling_subjectief;
                const objectief = data.response.behandeling_objectief;
                const evaluatie = data.response.behandeling_evaluatie;
                const plan = data.response.behandeling_plan;
                const opmerkingen = data.response.behandeling_opmerkingen;
                const afwijking = data.response.behandeling_afwijking_richtlijnen;

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

                    const afwijkingomsEl = document.getElementById('afwijkingoms');
                    if (afwijking && afwijking !== ''){
                        const afwijkingEl = document.getElementById('afwijking');
                        afwijkingEl.checked = true;

                        
                        if (afwijkingomsEl && afwijking) {
                            afwijkingomsEl.value = afwijking;
                        }
                    }
                            
                    const checkveld = (el, input) => {
                        if (!el) return { status: 'element niet gevonden', succes: false };

                        if (el.tagName === 'TEXTAREA'){
                            if (el.innerHTML.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el.innerHTML.trim().replace(/\s+/g, ''),
                                opgehaald: input.trim().replace(/\s+/g, '')
                            }
                        } else if (el.tagName === 'INPUT' && el.type === 'text'){
                             if (el.value.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el.value.trim().replace(/\s+/g, ''),
                                opgehaald: input.trim().replace(/\s+/g, '')
                            }

                        }

                        return {status: 'ok', success: true}
                    };

                    const rapport = {
                        behandeling_subjectief: checkveld(subjectiefeEl, data.response.behandeling_subjectief),
                        behandeling_objectief: checkveld(objectiefeEl, data.response.behandeling_objectief ),
                        behandeling_evaluatie: checkveld(evaluatieEl, data.response.behandeling_evaluatie),
                        behandeling_plan: checkveld(planEl, data.response.behandeling_plan),
                        behandeling_opmerkingen: checkveld(opmerkingenEl, data.response.behandeling_opmerkingen),
                        behandeling_afwijking: checkveld(afwijkingomsEl, data.response.behandeling_afwijking_richtlijnen),
                    };


                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.success === true);
                    console.log(allesOK)

                    console.log(new Date().toISOString())
                    console.log(allesOK ? 'succes' : 'fouten')
                    console.log(rapport)
                    console.log(window.location.href)

                    // ✅ Stuur terug naar het systeem
                    fetch('https://whisper.anzwerz.ai/api/som-feedback', {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': 'mijn-geheime-sleutel'
                    },
                        body: JSON.stringify({
                        timestamp: new Date().toISOString(),
                        result: allesOK ? 'ok' : 'not ok',
                        details: rapport,
                        consult_type: 'behandeling',
                        patient_number: String(clientNumber)
                    })
                    })
                    .then(r => {
                        if (!r.ok) {
                            console.warn('Feedback verzenden mislukt:', r.status);
                        }
                    })
                    .catch(err => console.error('Fout bij terugsturen feedback:', err));
                }
            }
        })
        .catch(err => {
            console.error("❌ Fout bij ophalen of verwerken van data:", err);
            alert("Er ging iets mis. Ons team is hiervan op de hoogte gesteld en gaat ermee aan de slag om in de toekomst te voorkomen.");

            fetch("https://whisper.anzwerz.ai/api/log_tm_error/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'mijn-geheime-sleutel'
            },
            body: JSON.stringify({ error_description: err.message,
                                    error_log: err.stack,
                                    error_type: err.name
            })
            })
        });

    }

    
}, false);
})();