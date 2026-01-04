// ==UserScript==
// @name         Intake SOM
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Intake inladen voor SOM
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543303/Intake%20SOM.user.js
// @updateURL https://update.greasyfork.org/scripts/543303/Intake%20SOM.meta.js
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



    function storeConsultDate(){
        const datumEl = document.getElementById('t202_datumaanmelding');
        if (datumEl){
            console.log("element gevonden");
            sessionStorage.setItem('consultDate', datumEl.value);

        }
    }
    
    const clientNumber = getClientNumber();
    storeConsultDate()
    const dateConsult = sessionStorage.getItem('consultDate');

    if (clientNumber === null){
    console.log("kan clientnummer niet vinden");
    } else if (dateConsult == null) {
        console.log("kan datum niet vinden");
        
    } else {
        console.log("haal data op")


        fetch("https://whisper.anzwerz.ai/api/v2/intake_som/", {
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
                const binnenkomst = data.response.aanmelding_binnenkomst;
                //const verwijzer = data.response.aanmelding_verwijsgegevens_verwijzer;  // niet gebruikt
                const verwijsdatum = data.response.aanmelding_verwijsgegevens_verwijsdatum;
                const verwijsdiagnose = data.response.aanmelding_verwijsgegevens_verwijsdiagnose;
                const verrichtingGewenst = data.response.aanmelding_verwijsgegevens_verrichting_gewenst;
                const regio = data.response.aanmelding_dtf_screening_screening_regio;
                const toelichtingAfwijkendBeloop = data.response.aanmelding_dtf_screening_toelichting_afwijkend_beloop_screening;
                const conclusieScreening = data.response.aanmelding_dtf_screening_conclusie_screening;
                const aanbevelingVervolg = data.response.aanmelding_dtf_screening_aanbeveling_voor_vervolg;
                const indicatieVoorVerderFysio = data.response.aanmelding_dtf_screening_indicatie_voor_fysiotherapeutisch_onderzoek;
                const akkoordOverdrachtHa = data.response.aanmelding_toestemming_voor_contact_met_huisarts;
                const omschrijvingKlacht = data.response.aanmelding_contactreden_omschrijving_klacht;
                const duurKlachtAantal = data.response.aanmelding_contactreden_duur_klacht_aantal;
                const duurKlachtEenheid = data.response.aanmelding_contactreden_duur_klacht_eenheid;
                const hulpvraag = data.response.anamnese_hulpvraag;
                const recidief = data.response.aanmelding_contactreden_recidief;
                const ongeval = data.response.aanmelding_contactreden_ongeval;
                const beloop = data.response.anamnese_beloop;
                const beloopTotNu = data.response.anamnese_beloop_tot_nu_toe;
                const pijn = data.response.anamnese_pijn;
                const stijfheid = data.response.anamnese_stijfheid;
                const psk1Activiteit = data.response.anamnese_psk_scores_psk_activiteit_1_activiteit;
                const psk1Score = data.response.anamnese_psk_scores_psk_activiteit_1_score;
                const psk2Activiteit = data.response.anamnese_psk_scores_psk_activiteit_2_activiteit;
                const psk2Score = data.response.anamnese_psk_scores_psk_activiteit_2_score;
                const psk3Activiteit = data.response.anamnese_psk_scores_psk_activiteit_3_activiteit;
                const psk3Score = data.response.anamnese_psk_scores_psk_activiteit_3_score;
                const stoornissen = data.response.anamnese_functioneringsfactoren_stoornissen_in_functie;
                const beperkingen = data.response.anamnese_functioneringsfactoren_beperkingen_in_activiteiten;
                const participatie = data.response.anamnese_functioneringsfactoren_participatieproblemen;
                const medischeFactoren = data.response.anamnese_functioneringsfactoren_medische_factoren;
                const omgevingsdeterminanten = data.response.anamnese_functioneringsfactoren_omgevingsdeterminanten;
                const persoonlijkeDeterminanten = data.response.anamnese_functioneringsfactoren_persoonlijke_determinanten;
                const wijzeVanOmgang = data.response.anamnese_functioneringsfactoren_wijze_van_omgang;
                const factorenVanInvloed = data.response.anamnese_functioneringsfactoren_factoren_van_invloed;
                const belangrijkeOpmerkingen = data.response.anamnese_functioneringsfactoren_belangrijke_opmerkingen;
                const verwachtHerstelPatient = data.response.anamnese_afronding_anamnese_verwachtingen_van_de_patient;
                const verwachteDuurPatientAantal = data.response.anamnese_afronding_anamnese_verwachte_duur_volgens_patient_aantal;
                const verwachteDuurPatientEenheid = data.response.anamnese_afronding_anamnese_verwachte_duur_volgens_patient_eenheid;
                const verwachtHerstelPatientDD = data.response.anamnese_afronding_anamnese_verwacht_herstel_volgens_patient;
                const voorlopigeConlusie = data.response.anamnese_afronding_anamnese_voorlopige_conclusie;
                const toestemmingPatient = data.response.anamnese_toestemmingen_toestemming_patient;
                const toestemmingBijzondereBehandeling = data.response.anamnese_toestemmingen_toestemming_bijzondere_behandeling;
                const toelichtingBijzondereBehandeling = data.response.anamnese_toestemmingen_toelichting_bijzondere_behandeling;
                const conclusieAnamnese = data.response.onderzoek_conclusie_anamnese;
                const indicatieFysio = data.response.behandelplan_indicatie_fysiotherapeutische_behandeling;
                const inspectie = data.response.onderzoek_inspectie;
                const dynamisch = data.response.onderzoek_dynamisch;
                const statisch = data.response.onderzoek_statisch;
                const overig = data.response.onderzoek_overig;
                const palpatie = data.response.onderzoek_palpatie_percussie_auscultatie;
                const hoofddoel = data.response.behandelplan_hoofddoel;
                const verwachteDuurFysioAantal = data.response.behandelplan_prognose_verwachte_duur_volgens_therapeut_aantal;
                const verwachteDuurFysioEenheid = data.response.behandelplan_prognose_verwachte_duur_volgens_therapeut_eenheid;
                const verwachtHerstelFysioDD = data.response.behandelplan_prognose_verwacht_herstel_volgens_therapeut;
                const werkdiagnose = data.response.behandelplan_fysiotherapeutische_werkdiagnose;
                const aanvulling = data.response.behandelplan_aanvulling;


                const checkveld = (el, input, checkboxValue=null) => {
                    if (!el) return { status: 'element niet gevonden', succes: false };

                    if (el.tagName === 'TEXTAREA'){
                        if (el.innerHTML.trim().replace(/\s+/g, '')  !== input.trim().replace(/\s+/g, '') ) return {
                            status: 'niet goed ingevuld', 
                            succes: false,
                            ingevuld: el.innerHTML.trim().replace(/\s+/g, ''),
                            opgehaald: input.trim().replace(/\s+/g, '')
                        }
                    } else if (el.tagName === 'INPUT' && el.type === 'checkbox'){
                        if (input) { 
                            if (el.checked !== (input.toLowerCase() === checkboxValue.toLowerCase())) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el.checked,
                                opgehaald: input.toLowerCase(),
                                checkbox_waarde: checkboxValue.toLowerCase()
                            }
                        }
                    } else if (el.tagName === 'INPUT' && el.type === 'date'){
                        if (el.value && el.value !== input) return {
                            status: 'niet goed ingevuld', 
                            succes: false,
                            ingevuld: el.value,
                            opgehaald: input
                        }
                    } else if (el.tagName === 'INPUT' && el.type === 'text'){
                        if (el.getAttribute('data-slider') === 'true') {
                            if (el !== input) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el,
                                opgehaald: input
                            }
                        } else {
                            if (el.value !== input) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el.value,
                                opgehaald: input
                            }
                        }
                    } else if (el.tagName === 'SELECT') {
                        if (el.value && el.value !== input) return { 
                            status: 'niet goed ingevuld', 
                            succes: false,
                            ingevuld: el.value,
                            opgehaald: input
                        };
                    } else if (el.tagName === 'INPUT' && el.type === 'radio') {
                        if (el.name == 'pijn' || el.name == 'stijfheid'){
                            const geselecteerd = Array.from(el).find(r => r.checked);

                            if ((input && (!geselecteerd || geselecteerd.value !== input)) || (!input && geselecteerd)) {
                                return { 
                                    status: 'niet goed ingevuld', 
                                    succes: false,
                                    ingevuld: geselecteerd.value,
                                    opgehaald: input
                                };
                            }
                        } else {
                            if (input) { 
                            if (el.checked !== (input.toLowerCase() === checkboxValue.toLowerCase())) return {
                                status: 'niet goed ingevuld', 
                                succes: false,
                                ingevuld: el.checked,
                                opgehaald: input.toLowerCase(),
                                checkbox_waarde: checkboxValue.toLowerCase()
                            }
                        }

                        }
                    }

                    return {status: 'ok', succes: true}
                    
                }

                //Aanmelding & Screening
                const klachtomschrijvingEl = document.getElementById('t202_klachtomschrijving');
                if (klachtomschrijvingEl && klachtomschrijvingEl.innerHTML == '') {
                    if (klachtomschrijvingEl && omschrijvingKlacht) {
                        klachtomschrijvingEl.innerHTML = omschrijvingKlacht;
                    }

                    const binnenkomst3El = document.getElementById('t202_binnenkomst3');
                    if (binnenkomst3El && binnenkomst && binnenkomst.toUpperCase() === 'DTF') {
                        binnenkomst3El.checked = true;
                    }

                    const binnenkomst1El = document.getElementById('t202_binnenkomst1');
                    if (binnenkomst1El && binnenkomst && binnenkomst.toLowerCase() === 'verwijzing') {
                        binnenkomst1El.checked = true;
                    }

                    const verwijsdatumEl = document.getElementById('t202_verwijsdatum');
                    if (verwijsdatumEl && verwijsdatum) {
                        verwijsdatumEl.value = verwijsdatum;
                    }

                    const verwijzerbeleidEl = document.getElementById('t202_verwijzerbeleid');
                    if (verwijzerbeleidEl && verwijsdiagnose) {
                        verwijzerbeleidEl.innerHTML = verwijsdiagnose;
                    }

                    const dienstgewenstEl = document.getElementById('t202_dienstgewenst');
                    if (dienstgewenstEl && verrichtingGewenst) {
                        dienstgewenstEl.innerHTML = verrichtingGewenst;
                        
                    }

                    const klachtensindsgetalEl = document.getElementById('t203_klachtensindsgetal');
                    if (klachtensindsgetalEl && duurKlachtAantal) {
                        klachtensindsgetalEl.value = duurKlachtAantal;
                        
                    }

                    const klachtenSindsMaatEl = document.getElementById('t203_klachtenSindsMaat');
                    let dropdownValueKlacht = '0'; // default waarde
                    if (klachtenSindsMaatEl) {

                        if (duurKlachtEenheid) {
                            const eenheid = duurKlachtEenheid.toLowerCase();

                            if (eenheid === 'dagen') {
                                dropdownValueKlacht = 'dag';
                            } else if (eenheid === 'weken') {
                                dropdownValueKlacht = 'week';
                            } else if (eenheid === 'maanden') {
                                dropdownValueKlacht = 'maand';
                            } else if (eenheid === 'jaren') {
                                dropdownValueKlacht = 'jaar';
                            }
                        }

                        klachtenSindsMaatEl.value = dropdownValueKlacht ;
                    }

                    const recidief0El = document.getElementById('t202_recidief0');
                    if (recidief0El && recidief && recidief.toLowerCase() === 'nee') {
                        recidief0El.checked = true;
                    }

                    const recidief1El = document.getElementById('t202_recidief1');
                    if (recidief1El && recidief && recidief.toLowerCase() === 'ja') {
                        recidief1El.checked = true;
                    }

                    const indicatieongeval0El = document.getElementById('t24_indicatieongeval0');
                    if (indicatieongeval0El && ongeval && ongeval.toLowerCase() === 'nee') {
                        indicatieongeval0El.checked = true;
                    }

                    const indicatieongeval1El = document.getElementById('t24_indicatieongeval1');
                    if (indicatieongeval1El && ongeval && ongeval.toLowerCase() === 'ja') {
                        indicatieongeval1El.checked = true;
                    }


                    const regioScreeningEl = document.getElementById('t202_vlaggroep');
                    let dropdownValueRegio = '0'; // default waarde
                    if (regioScreeningEl ) {



                        if (regio) {
                            const regioLower = regio.toLowerCase();

                            if (regioLower === 'acute (sport-) letsels') {
                                dropdownValueRegio = '1';
                            } else if (regioLower === 'hoofd') {
                                dropdownValueRegio = '2';
                            } else if (regioLower === 'nek') {
                                dropdownValueRegio = '3';
                            } else if (regioLower === 'schouder') {
                                dropdownValueRegio = '4';
                            } else if (regioLower === 'elleboog') {
                                dropdownValueRegio = '5';
                            } else if (regioLower === 'pols-hand') {
                                dropdownValueRegio = '6';
                            } else if (regioLower === 'twk-thorax') {
                                dropdownValueRegio = '7';
                            } else if (regioLower === 'lage rug') {
                                dropdownValueRegio = '8';  
                            } else if (regioLower === 'bekken-heup') {
                                dropdownValueRegio = '9';  
                            } else if (regioLower === 'knie') {
                                dropdownValueRegio = '10';  
                            } else if (regioLower === 'enkel-voet') {
                                dropdownValueRegio = '11';  
                            } else if (regioLower === 'medische fitness-cardiorevalidatie') {
                                dropdownValueRegio = '12';  
                            }
                        }

                        regioScreeningEl.value = dropdownValueRegio ;
                    }
                    

                    const pluis1El = document.getElementById('pluis1');
                    if (pluis1El && conclusieScreening && conclusieScreening.toLowerCase() === 'niet pluis') {
                        pluis1El.checked = true;
                    }

                    const pluis0El = document.getElementById('pluis0');
                    if (pluis0El && conclusieScreening && conclusieScreening.toLowerCase() === 'pluis') {
                        pluis0El.checked = true;
                    }

                    

                    const afwijkendBeloopEl = document.getElementById('t202_AfwijkendBeloop');
                    if (afwijkendBeloopEl && toelichtingAfwijkendBeloop) {
                        afwijkendBeloopEl.innerHTML = toelichtingAfwijkendBeloop;
                    }

                    const aanbevelingEl = document.getElementById('t202_aanbeveling');
                    if (aanbevelingEl && aanbevelingVervolg) {
                        aanbevelingEl.innerHTML = aanbevelingVervolg;
                    }

                    
                    const indicatieonderzoekaanmelding1El = document.getElementById('t202_indicatieonderzoekaanmelding1');
                    if (indicatieonderzoekaanmelding1El && indicatieVoorVerderFysio && indicatieVoorVerderFysio.toLowerCase() === 'nee') {
                        indicatieonderzoekaanmelding1El.checked = true;
                    }

                    const indicatieonderzoekaanmelding0El = document.getElementById('t202_indicatieonderzoekaanmelding0');
                    if (indicatieonderzoekaanmelding0El && indicatieVoorVerderFysio && indicatieVoorVerderFysio.toLowerCase() === 'ja') {
                        indicatieonderzoekaanmelding0El.checked = true;
                    }

                    const toestemmingoverleg0El = document.getElementById('t206_toestemmingoverleg0');
                    if (toestemmingoverleg0El && akkoordOverdrachtHa && akkoordOverdrachtHa.toLowerCase() === 'ja') {
                        toestemmingoverleg0El.checked = true;
                    }

                    const toestemmingoverleg1El = document.getElementById('t206_toestemmingoverleg1');
                    if (toestemmingoverleg1El && akkoordOverdrachtHa && akkoordOverdrachtHa.toLowerCase() === 'nee') {
                        toestemmingoverleg1El.checked = true;
                    }



    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        klachtomschrijving: checkveld(klachtomschrijvingEl, data.response.aanmelding_contactreden_omschrijving_klacht),
                        binnenkomst_verwijzing: checkveld(binnenkomst1El,data.response.aanmelding_binnenkomst, 'verwijzing'),
                        binnenkomst_dtf: checkveld(binnenkomst3El, data.response.aanmelding_binnenkomst, 'DTF'),
                        verwijsdatum: checkveld(verwijsdatumEl, data.response.aanmelding_verwijsgegevens_verwijsdatum),
                        verwijzer: checkveld(verwijzerbeleidEl, data.response.aanmelding_verwijsgegevens_verwijsdiagnose),
                        verrichting_gewenst: checkveld(dienstgewenstEl, data.response.aanmelding_verwijsgegevens_verrichting_gewenst),
                        duur_klacht_aantal: checkveld(klachtensindsgetalEl, data.response.aanmelding_contactreden_duur_klacht_aantal),
                        duur_klacht_eenheid: checkveld(klachtenSindsMaatEl, dropdownValueKlacht ),
                        recidief_niet: checkveld(recidief0El, data.response.aanmelding_contactreden_recidief, 'nee'),
                        recidief_wel: checkveld(recidief1El, data.response.aanmelding_contactreden_recidief, 'ja'),
                        ongeval_niet: checkveld(indicatieongeval0El, data.response.aanmelding_contactreden_ongeval, 'nee'),
                        ongeval_wel: checkveld(indicatieongeval1El, data.response.aanmelding_contactreden_ongeval, 'ja'),
                        regio: checkveld(regioScreeningEl, dropdownValueRegio),
                        niet_pluis: checkveld(pluis1El, data.response.aanmelding_dtf_screening_conclusie_screening, 'niet pluis'),
                        pluis: checkveld(pluis0El, data.response.aanmelding_dtf_screening_conclusie_screening, 'pluis'),
                        toelichting_afwijkend_beloop: checkveld(afwijkendBeloopEl, data.response.aanmelding_dtf_screening_toelichting_afwijkend_beloop_screening),
                        aanbeveling_vervolg: checkveld(aanbevelingEl, data.response.aanmelding_dtf_screening_aanbeveling_voor_vervolg),
                        indicatie_voor_verder_fysio_niet: checkveld(indicatieonderzoekaanmelding1El, data.response.aanmelding_dtf_screening_indicatie_voor_fysiotherapeutisch_onderzoek, 'nee'),
                        indicatie_voor_verder_fysio_wel: checkveld(indicatieonderzoekaanmelding0El, data.response.aanmelding_dtf_screening_indicatie_voor_fysiotherapeutisch_onderzoek, 'ja'),
                        akkoord_overdracht_ha_niet: checkveld(toestemmingoverleg1El, data.response.aanmelding_toestemming_voor_contact_met_huisarts, 'nee'),
                        akkoord_overdracht_ha_wel: checkveld(toestemmingoverleg0El, data.response.aanmelding_toestemming_voor_contact_met_huisarts, 'ja'),             
                    };

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)


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
                            consult_type: 'intake - aanmelding',
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

    ///////////////////////////////////////////////////////////////////////////////////
                
                //Anamnese
                const hulpvraagEl = document.getElementById('t203_hulpvraag');
                if (hulpvraagEl && hulpvraagEl.innerHTML == '') {

                    if (hulpvraagEl && hulpvraag) {
                        hulpvraagEl.innerHTML = hulpvraag;
                    }
                

                    const locatieaardoorzaakEl = document.getElementById('t203_locatieaardoorzaak');
                    if (locatieaardoorzaakEl && beloop) {
                        locatieaardoorzaakEl.innerHTML = beloop;
                    }


                    const beloopIdEl = document.getElementById('t203_beloopId');
                    let dropdownValueBeloop = '0';
                    if (beloopIdEl) {
                        
                        if (beloopTotNu) {
                            const beloopText = beloopTotNu.toLowerCase();
                            console.log(beloopText);

                            if (beloopText.includes('niets vastgelegd')) {
                                dropdownValueBeloop = '803';
                            } else if (beloopText.includes('afgenomen')) {
                                dropdownValueBeloop = '755';
                            } else if (beloopText.includes('niet gewijzig')) {
                                dropdownValueBeloop = '802';
                            } else if (beloopText.includes('toegenomen')) {
                                dropdownValueBeloop = '804';
                            } else if (beloopText.includes('wisselend')) {
                                dropdownValueBeloop = '801';
                            }
                        }

                        beloopIdEl.value = dropdownValueBeloop
                    }

                                
                    const pijnRadioButtons = document.querySelectorAll('input[name="pijn"]');
                    if (pijnRadioButtons && pijn) {

                        pijnRadioButtons.forEach(radio => {
                            if (radio.value === pijn) {
                                radio.checked = true;
                            }
                        });
                        }


                    const stijfheidRadioButtons = document.querySelectorAll('input[name="stijfheid"]');
                    if (stijfheidRadioButtons && stijfheid) {
                        stijfheidRadioButtons.forEach(radio => {
                            if (radio.value === stijfheid) {
                                radio.checked = true;
                            }
                        });
                    }
                                

                    const activiteit1El = document.getElementById('Activiteit1');
                        if (activiteit1El && psk1Activiteit) {
                            activiteit1El.innerHTML = psk1Activiteit;
                        }

                    const slider1 = document.getElementById('psk1');
                    let score1 = -1
                    let nextSibling1
                    let psk1_element = 'none'

                    if (slider1 && !isNaN(psk1Score) && psk1Score.trim() !== ''){
                        score1 = parseInt(psk1Score, 10) * 10;
                        nextSibling1 = slider1.nextElementSibling;
            
                        if (nextSibling1 && nextSibling1.tagName.toLowerCase() === 'span') {
                            nextSibling1.textContent = score1;
                        }

                        
                        if (nextSibling1.textContent) {
                            psk1_element = nextSibling1.textContent
                        }
    
                        slider1.value = score1;
            
                        // Events triggeren voor compatibiliteit
                        slider1.dispatchEvent(new Event('input', { bubbles: true }));
                        slider1.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                

                    const activiteit2El = document.getElementById('Activiteit2');
                    if (activiteit2El && psk2Activiteit) {
                        activiteit2El.innerHTML = psk2Activiteit;
                    }

                    const slider2 = document.getElementById('psk2');
                    let score2 = -1
                    let nextSibling2
                    let psk2_element = 'none'

                    if (slider2 && !isNaN(psk2Score) && psk2Score.trim() !== ''){
            
                        score2 = parseInt(psk2Score, 10) * 10;
                        nextSibling2 = slider2.nextElementSibling
                        
                        if (nextSibling2 && nextSibling2.tagName.toLowerCase() === 'span') {
                            nextSibling2.textContent = score2;
                        }

                        
                        if (nextSibling2.textContent) {
                            psk2_element = nextSibling2.textContent
                        }


                        slider2.value = score2;
                
                        // Events triggeren voor compatibiliteit
                        slider2.dispatchEvent(new Event('input', { bubbles: true }));
                        slider2.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    const activiteit3El = document.getElementById('Activiteit3');
                
                    if (activiteit3El && psk3Activiteit) {
                        activiteit3El.innerHTML = psk3Activiteit;
                    }

                    const slider3 = document.getElementById('psk3');
                    let score3 = -1
                    let nextSibling3
                    let psk3_element = 'none'

                    if (slider3 && !isNaN(psk3Score) && psk3Score.trim() !== ''){
            
                        score3 = parseInt(psk3Score, 10) * 10;
                        nextSibling3 = slider3.nextElementSibling;
                        
                        if (nextSibling3 && nextSibling3.tagName.toLowerCase() === 'span') {
                            nextSibling3.textContent = score3;
                        }

                        if (nextSibling3.textContent) {
                            psk3_element = nextSibling3.textContent
                        }

                        slider3.value = score3;
                
                        // Events triggeren voor compatibiliteit
                        slider3.dispatchEvent(new Event('input', { bubbles: true }));
                        slider3.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    const stoornisFunctieEl = document.getElementById('t204_StoornisFunctie');
                    if (stoornisFunctieEl && stoornissen) {
                        stoornisFunctieEl.innerHTML = stoornissen;
                    }

                    const beperkingActiviteitenEl = document.getElementById('t204_BeperkingActiviteiten');
                    if (beperkingActiviteitenEl && beperkingen) {
                        beperkingActiviteitenEl.innerHTML = beperkingen;
                    }

                    const participatieproblemenEl = document.getElementById('t204_participatieproblemen');
                    if (participatieproblemenEl && participatie) {
                        participatieproblemenEl.innerHTML = participatie;
                    }

                    const medischefactorenEl = document.getElementById('t204_medischefactoren');
                    if (medischefactorenEl && medischeFactoren) {
                        medischefactorenEl.innerHTML = medischeFactoren;
                    }

                    const externefactorenEl = document.getElementById('t204_externefactoren');
                    if (externefactorenEl && omgevingsdeterminanten) {
                        externefactorenEl.innerHTML = omgevingsdeterminanten;
                    }

                    const externefactoren1El = document.getElementById('t204_externefactoren1');
                    if (externefactoren1El){
                        if (!omgevingsdeterminanten || omgevingsdeterminanten.trim() === '') {
                            externefactoren1El.checked = true;
                        } else {
                            externefactoren1El.checked = false;
                        }
                    }

                    const persoonlijkefactorenEl = document.getElementById('t204_persoonlijkefactoren');
                    if (persoonlijkefactorenEl && persoonlijkeDeterminanten) {
                        persoonlijkefactorenEl.innerHTML = persoonlijkeDeterminanten;
                    }


                    const persoonlijkefactoren1El = document.getElementById('t204_persoonlijkefactoren1');
                    if (persoonlijkefactoren1El){
                        if(!persoonlijkeDeterminanten || persoonlijkeDeterminanten.trim() === '') {
                        persoonlijkefactoren1El.checked = true;
                    } else {
                        persoonlijkefactoren1El.checked = false;
                    }
                    }

                    const omgangswijzeEl = document.getElementById('t203_omgangswijze');
                    if (omgangswijzeEl && wijzeVanOmgang) {
                        omgangswijzeEl.innerHTML = wijzeVanOmgang;
                    }

                    const omgangswijze1El = document.getElementById('t203_omgangswijze1');
                    if (omgangswijze1El){
                        if (!wijzeVanOmgang || wijzeVanOmgang.trim() === '') {
                        omgangswijze1El.checked = true;
                    } else {
                        omgangswijze1El.checked = false;
                    }
                    }

                    const invloedfactorenEl = document.getElementById('t203_invloedfactoren');
                    if (invloedfactorenEl && factorenVanInvloed) {
                        invloedfactorenEl.innerHTML = factorenVanInvloed;
                    }

                    
                    const invloedfactoren1El = document.getElementById('t203_invloedfactoren1');
                    if (invloedfactoren1El){
                        if(!factorenVanInvloed || factorenVanInvloed.trim() === '') {
                        invloedfactoren1El.checked = true;
                    } else {
                        invloedfactoren1El.checked = false;
                    }
                    }

                    const belangrijkeOpmerkingenEl = document.getElementById('t203_BelangrijkeOpmerkingen');
                    if (belangrijkeOpmerkingenEl && belangrijkeOpmerkingen) {
                        belangrijkeOpmerkingenEl.innerHTML = belangrijkeOpmerkingen;
                    }


                    const verwachtHerstelPatientEl = document.getElementById('t203_verwachthersteldropdown');
                    let dropdownValueHerstelPatient = '0'; // default waarde
                    if (verwachtHerstelPatientEl) {

                        if (verwachtHerstelPatientDD) {
                            if (verwachtHerstelPatientDD.includes('progressie')) {
                                dropdownValueHerstelPatient = '572';
                            } else if (verwachtHerstelPatientDD.includes('geringe')) {
                                dropdownValueHerstelPatient = '569';
                            } else if (verwachtHerstelPatientDD.includes('matige')) {
                                dropdownValueHerstelPatient = '567';
                            } else if (verwachtHerstelPatientDD.includes('bepalen')) {
                                dropdownValueHerstelPatient = '800';
                            } else if (verwachtHerstelPatientDD.includes('Onderhoud')) {
                                dropdownValueHerstelPatient = '565';
                            } else if (verwachtHerstelPatientDD.includes('klachten')) {
                                dropdownValueHerstelPatient = '571';
                            } else if (verwachtHerstelPatientDD.includes('Stabilisatie')) {
                                dropdownValueHerstelPatient = '573';
                            } else if (verwachtHerstelPatientDD.includes('herstel')) {
                                dropdownValueHerstelPatient = '568';
                            }
                        }

                        verwachtHerstelPatientEl.value = dropdownValueHerstelPatient
                    }

                    const behandelepisodeverwachtingEl = document.getElementById('t206_behandelepisodeverwachting');
                    if (behandelepisodeverwachtingEl && verwachteDuurPatientAantal) {
                        behandelepisodeverwachtingEl.value = verwachteDuurPatientAantal;
                    }

                    const herstelverwachtingperiodeEl = document.getElementById('t206_herstelverwachtingperiode');
                    let dropdownValueDuurPatient = '0'; // default waarde
                    if (herstelverwachtingperiodeEl) {  

                        if (verwachteDuurPatientEenheid) {
                            const eenheid = verwachteDuurPatientEenheid.toLowerCase();

                            if (eenheid === 'weken') {
                                dropdownValueDuurPatient = '1';
                            } else if (eenheid === 'maanden') {
                                dropdownValueDuurPatient = '2';
                            } else if (eenheid === 'jaren') {
                                dropdownValueDuurPatient = '3';
                            }
                        }

                    herstelverwachtingperiodeEl.value = dropdownValueDuurPatient
                    }

                    const patientverwachtingenEl = document.getElementById('T203_patientverwachtingen');
                    if (patientverwachtingenEl && verwachtHerstelPatient) {
                        patientverwachtingenEl.innerHTML = verwachtHerstelPatient;
                    }


                    const voorlopigeconcelusieEl = document.getElementById('t203_voorlopigeconclusie');
                    if (voorlopigeconcelusieEl && voorlopigeConlusie) {
                        voorlopigeconcelusieEl.innerHTML = voorlopigeConlusie;
                    }

    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        hulpvraag: checkveld(hulpvraagEl, data.response.anamnese_hulpvraag),
                        beloop: checkveld(locatieaardoorzaakEl,data.response.anamnese_beloop),
                        beloop_tot_nu: checkveld(beloopIdEl, dropdownValueBeloop),
                        pijn: checkveld(pijnRadioButtons, data.response.anamnese_pijn),
                        stijfheid: checkveld(stijfheidRadioButtons, data.response.anamnese_stijfheid),
                        psk1_activiteit: checkveld(activiteit1El, data.response.anamnese_psk_scores_psk_activiteit_1_activiteit),
                        psk1_score: checkveld(psk1_element, score1),
                        psk2_activiteit: checkveld(activiteit2El, data.response.anamnese_psk_scores_psk_activiteit_2_activiteit),
                        psk2_score: checkveld(psk2_element, score2),
                        psk3_activiteit: checkveld(activiteit3El, data.response.anamnese_psk_scores_psk_activiteit_3_activiteit),
                        psk3_score: checkveld(psk3_element, score3),
                        stoornissen: checkveld(stoornisFunctieEl, data.response.anamnese_functioneringsfactoren_stoornissen_in_functie),
                        beperkingen: checkveld(beperkingActiviteitenEl, data.response.anamnese_functioneringsfactoren_beperkingen_in_activiteiten),
                        participatie: checkveld(participatieproblemenEl, data.response.anamnese_functioneringsfactoren_participatieproblemen),
                        medische_factoren: checkveld(medischefactorenEl, data.response.anamnese_functioneringsfactoren_medische_factoren),
                        omgevingsdeterminanten: checkveld(externefactorenEl, data.response.anamnese_functioneringsfactoren_omgevingsdeterminanten),
                        persoonlijke_determinanten: checkveld(persoonlijkefactorenEl, data.response.anamnese_functioneringsfactoren_persoonlijke_determinanten),
                        wijze_van_omgang : checkveld(omgangswijzeEl, data.response.anamnese_functioneringsfactoren_wijze_van_omgang),
                        factoren_van_invloed: checkveld(invloedfactorenEl, data.response.anamnese_functioneringsfactoren_factoren_van_invloed),
                        belangrijke_opmerkingen: checkveld(belangrijkeOpmerkingenEl, data.response.anamnese_functioneringsfactoren_belangrijke_opmerkingen),
                        verwacht_herstel_patient_dropdown: checkveld(verwachtHerstelPatientEl,dropdownValueHerstelPatient),
                        verwachte_duur_patient_aantal: checkveld(behandelepisodeverwachtingEl, data.response.anamnese_afronding_anamnese_verwachte_duur_volgens_patient_aantal),
                        verwachte_duur_patient_eenheid: checkveld(herstelverwachtingperiodeEl, dropdownValueDuurPatient),
                        verwacht_herstel_patient: checkveld(patientverwachtingenEl, data.response.anamnese_afronding_anamnese_verwachtingen_van_de_patient),
                        voorlopige_conclusie: checkveld(voorlopigeconcelusieEl, data.response.anamnese_afronding_anamnese_voorlopige_conclusie),
                    };

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)

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
                            consult_type: 'intake - anamnese',
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

    ///////////////////////////////////////////////////////////////////////////////////
                        
                //Onderzoek
                const conclusieEl = document.getElementById('t204_conclusie');
                if (conclusieEl && conclusieEl.innerHTML == '') {

                    if (conclusieEl && conclusieAnamnese) {
                        conclusieEl.innerHTML = conclusieAnamnese;
                    }
                

                    const indicatieonderzoekaanmelding1El = document.getElementById('t202_indicatieonderzoekaanmelding1');
                    if (indicatieonderzoekaanmelding1El && toestemmingPatient && toestemmingPatient.toLowerCase() === 'nee') {
                        indicatieonderzoekaanmelding1El.checked = true;
                    }

                    const indicatieonderzoekaanmelding0El = document.getElementById('t202_indicatieonderzoekaanmelding0');
                    if (indicatieonderzoekaanmelding0El && toestemmingPatient && toestemmingPatient.toLowerCase() === 'ja') {
                        indicatieonderzoekaanmelding0El.checked = true;
                    }

                    const handelingtoestemmingjn1El = document.getElementById('t204_handelingtoestemmingjn1');
                    if (handelingtoestemmingjn1El && toestemmingBijzondereBehandeling && toestemmingBijzondereBehandeling.toLowerCase() === 'nee') {
                        handelingtoestemmingjn1El.checked = true;
                    }

                    const handelingtoestemmingjn0El = document.getElementById('t204_handelingtoestemmingjn0');
                    if (handelingtoestemmingjn0El && toestemmingBijzondereBehandeling && toestemmingBijzondereBehandeling.toLowerCase() === 'ja') {
                        handelingtoestemmingjn0El.checked = true;
                    }


                    const toelichtingBijzondereBehandelingEl = document.getElementById('t204_handelingtoestemming');
                    if (toelichtingBijzondereBehandelingEl && toelichtingBijzondereBehandeling){
                        toelichtingBijzondereBehandelingEl.innerHTML = toelichtingBijzondereBehandeling;
                    }

                    const inspectieEl = document.getElementById('t204_inspectie');
                    if (inspectieEl && inspectie) {
                        inspectieEl.innerHTML = inspectie;
                    }

                    const inspectiedynamischEl = document.getElementById('t204_inspectiedynamisch');
                    if (inspectiedynamischEl && dynamisch) {
                        inspectiedynamischEl.innerHTML = dynamisch;
                    }

                    const inspectiestatischEl = document.getElementById('t204_inspectiestatisch');
                    if (inspectiestatischEl && statisch) {
                        inspectiestatischEl.innerHTML = statisch;
                    }

                    const inspectieobservatieEl = document.getElementById('t204_inspectieobservatie');
                    if (inspectieobservatieEl && overig) {
                        inspectieobservatieEl.innerHTML = overig;
                    }

                    const inspectiepelpatieEl = document.getElementById('t204_inspectiepalpatie');
                    if (inspectiepelpatieEl && palpatie) {
                        inspectiepelpatieEl.innerHTML = palpatie;
                    }

    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        conclusie_anamnese: checkveld(conclusieEl, data.response.onderzoek_conclusie_anamnese),
                        toestemming_patient_niet: checkveld(indicatieonderzoekaanmelding1El,data.response.anamnese_toestemmingen_toestemming_patient,"nee"),
                        toestemming_patient_wel: checkveld(indicatieonderzoekaanmelding0El,data.response.anamnese_toestemmingen_toestemming_patient,"ja"),
                        toestemming_bijzondere_behandeling_niet: checkveld(handelingtoestemmingjn1El,data.response.anamnese_toestemmingen_toestemming_bijzondere_behandeling,"nee"),
                        toestemming_bijzondere_behandeling_wel: checkveld(handelingtoestemmingjn0El,data.response.anamnese_toestemmingen_toestemming_bijzondere_behandeling,"ja"),
                        toelichting_bijzondere_behandeling: checkveld(toelichtingBijzondereBehandelingEl,data.response.anamnese_toestemmingen_toelichting_bijzondere_behandeling),
                        inspectie: checkveld(inspectieEl, data.response.onderzoek_inspectie),
                        dynamisch: checkveld(inspectiedynamischEl, data.response.onderzoek_dynamisch),
                        statisch: checkveld(inspectiestatischEl, data.response.onderzoek_statisch),
                        overig: checkveld(inspectieobservatieEl, data.response.onderzoek_overig),
                        palpatie: checkveld(inspectiepelpatieEl, data.response.onderzoek_palpatie_percussie_auscultatie),
                    };


                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)


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
                            consult_type: 'intake - onderzoek',
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

    ///////////////////////////////////////////////////////////////////////////////////

                //Analyse
                const werkdiagnoseEl = document.getElementById('t205_FysTherapeutDiag');

                if (werkdiagnoseEl && werkdiagnoseEl.innerHTML == ''){

                    if (werkdiagnoseEl && werkdiagnose){
                        werkdiagnoseEl.innerHTML = werkdiagnose;
                    }


                    const overigeEl = document.getElementById('t203_overige');
                    if (overigeEl) {
                        overigeEl.innerHTML = aanvulling;
                    }

                    
                    const janee0El = document.getElementById('t205_janee0');
                    if (janee0El && indicatieFysio && indicatieFysio.toLowerCase() === 'ja') {
                        janee0El.checked = true;
                    }

                    const janee1El = document.getElementById('t205_janee1');
                    if (janee1El && indicatieFysio && indicatieFysio.toLowerCase() === 'nee') {
                        janee1El.checked = true;
                    }

                ////////////////////////////////////////////////////////////////////////////////////////////
                    

                    const rapport = {
                        werkdiagnose: checkveld(werkdiagnoseEl, data.response.behandelplan_fysiotherapeutische_werkdiagnose),
                        aanvulling: checkveld(overigeEl, data.response.behandelplan_aanvulling),
                        indicatie_fysio_niet: checkveld(janee1El,data.response.behandelplan_indicatie_fysiotherapeutische_behandeling,"nee"),
                        indicatie_fysio_wel: checkveld(janee0El,data.response.behandelplan_indicatie_fysiotherapeutische_behandeling,"ja"),
                    };


                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);
 
                    console.log(rapport)

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
                            consult_type: 'intake - analyse',
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

    ///////////////////////////////////////////////////////////////////////////////////

                //Behandelplan
                const consultatieConcelusieEl = document.getElementById('t206_ConsultatieConclusie');
                if (consultatieConcelusieEl && consultatieConcelusieEl.innerHTML == '') {

                    if (consultatieConcelusieEl && hoofddoel) {
                        consultatieConcelusieEl.innerHTML = hoofddoel;
                    }

                    const verwachtHerstelFysioEl = document.getElementById('t206_verwachthersteltherapeut');
                    let dropdownValueHerstelFysio = '0'; // default waarde
                    if (verwachtHerstelFysioEl) {

                        if (verwachtHerstelFysioDD) {
                            
                            if (verwachtHerstelFysioDD.includes('progressie')) {
                                dropdownValueHerstelFysio = '572';
                            } else if (verwachtHerstelFysioDD.includes('geringe')) {
                                dropdownValueHerstelFysio = '569';
                            } else if (verwachtHerstelFysioDD.includes('matige')) {
                                dropdownValueHerstelFysio = '567';
                            } else if (verwachtHerstelFysioDD.includes('bepalen')) {
                                dropdownValueHerstelFysio = '800';
                            } else if (verwachtHerstelFysioDD.includes('Onderhoud')) {
                                dropdownValueHerstelFysio = '565';
                            } else if (verwachtHerstelFysioDD.includes('klachten')) {
                                dropdownValueHerstelFysio = '571';
                            } else if (verwachtHerstelFysioDD.includes('Stabilisatie')) {
                                dropdownValueHerstelFysio = '573';
                            } else if (verwachtHerstelFysioDD.includes('herstel')) {
                                dropdownValueHerstelFysio = '568';
                            }
                        }

                        verwachtHerstelFysioEl.value = dropdownValueHerstelFysio;
                    }

                    const behandelepisodeverwachtingEl = document.getElementById('t206_behandelepisodeverwachting');
                        if (behandelepisodeverwachtingEl && verwachteDuurFysioAantal) {
                                behandelepisodeverwachtingEl.value = verwachteDuurFysioAantal;
                        }


                    const herstelverwachtingperiodeEl = document.getElementById('t206_herstelverwachtingperiode');
                    let dropdownValueDuurFysio = '0'; // default waarde
                    if (herstelverwachtingperiodeEl) {
                        
                        if (verwachteDuurFysioEenheid) {
                            const eenheid = verwachteDuurFysioEenheid.toLowerCase();

                            if (eenheid === 'weken') {
                                dropdownValueDuurFysio = '1';
                            } else if (eenheid === 'maanden') {
                                dropdownValueDuurFysio = '2';
                            } else if (eenheid === 'jaren') {
                                dropdownValueDuurFysio = '3';
                            }
                        }

                    herstelverwachtingperiodeEl.value = dropdownValueDuurFysio;
                    }
                    
    ////////////////////////////////////////////////////////////////////////////////////////////
                    
                    const rapport = {
                        hoofddoel: checkveld(consultatieConcelusieEl, data.response.behandelplan_hoofddoel),
                        verwacht_herstel_fysio: checkveld(verwachtHerstelFysioEl,dropdownValueHerstelFysio),
                        verwacht_herstel_fysio_aantal:checkveld(behandelepisodeverwachtingEl, data.response.behandelplan_prognose_verwachte_duur_volgens_therapeut_aantal),
                        verwacht_herstel_fysio_eenheid: checkveld(herstelverwachtingperiodeEl,dropdownValueDuurFysio),
                    };

                    const allesOK = Object.values(rapport).every(v => v.status === 'ok' && v.succes === true);

                    console.log(rapport)

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
                            consult_type: 'intake - behandelplan',
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

///////////////////////////////////////////////////////////////////////////////////

        })
        .catch(err => {
            console.error("❌ Fout bij ophalen of verwerken van data:", err);

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
