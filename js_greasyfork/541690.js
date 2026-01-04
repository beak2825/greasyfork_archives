// ==UserScript==
// @name         Fahrzeug-Tool (Besatzung, FMS, Rückalarm, Refit & Verschrotten)
// @namespace    http://tampermonkey.net/
// @version      16.0.0
// @description  Massenaktionen mit Kombi-Dialog (Dropdown & Zufallsauswahl) beim Refit. Intelligentes MAX-Refit: Prüft, erstellt & rüstet um.
// @author       Masklin, Gemini & Community-Feedback
// @match        https://*.leitstellenspiel.de/*
// @match        https://*.missionchief.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541690/Fahrzeug-Tool%20%28Besatzung%2C%20FMS%2C%20R%C3%BCckalarm%2C%20Refit%20%20Verschrotten%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541690/Fahrzeug-Tool%20%28Besatzung%2C%20FMS%2C%20R%C3%BCckalarm%2C%20Refit%20%20Verschrotten%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // --- 1. KERN-LOGIK & KONFIGURATION ---
    // =================================================================================
    const SCRIPT_PREFIX = '[Fahrzeug-Tool]';
    const VEHICLE_TYPE_MAP = {0:'LF 20',1:'LF 10',2:'DLK 23',3:'ELW 1',4:'RW',5:'GW-A',6:'LF 8/6',7:'LF 20/16',8:'LF 10/6',9:'LF 16-TS',10:'GW-Öl',11:'GW-L2-Wasser',12:'GW-Messtechnik',13:'SW 1000',14:'SW 2000',15:'SW 2000-Tr',16:'SW Kats',17:'TLF 2000',18:'TLF 3000',19:'TLF 8/8',20:'TLF 8/18',21:'TLF 16/24-Tr',22:'TLF 16/25',23:'TLF 16/45',24:'TLF 20/40',25:'TLF 20/40-SL',26:'TLF 16',27:'GW-Gefahrgut',28:'RTW',29:'NEF',30:'HLF 20',31:'RTH',32:'FuStW',33:'GW-Höhenrettung',34:'ELW 2',35:'leBefKw',36:'MTW',37:'TSF-W',38:'KTW',39:'GKW',40:'MTW-TZ',41:'MzGW (FGr N)',42:'LKW K 9',43:'BRmG R',44:'Anh DLE',45:'MLW 5',46:'WLF',47:'AB-Rüst',48:'AB-Atemschutz',49:'AB-Öl',50:'GruKw',51:'FüKW (Polizei)',52:'GefKw',53:'Dekon-P',54:'AB-Dekon-P',55:'KdoW-LNA',56:'KdoW-OrgL',57:'FwK',58:'KTW Typ B',59:'ELW 1 (SEG)',60:'GW-San',61:'Polizeihubschrauber',62:'AB-Schlauch',63:'GW-Taucher',64:'GW-Wasserrettung',65:'LKW 7 Lkr 19 tm',66:'Anh MzB',67:'Anh SchlB',68:'Anh MzAB',69:'Tauchkraftwagen',70:'MZB',71:'AB-MZB',72:'WaWe 10',73:'GRTW',74:'NAW',75:'FLF',76:'Rettungstreppe',77:'AB-Gefahrgut',78:'AB-Einsatzleitung',79:'SEK - ZF',80:'SEK - MTF',81:'MEK - ZF',82:'MEK - MTF',83:'GW-Werkfeuerwehr',84:'ULF mit Löscharm',85:'TM 50',86:'Turbolöscher',87:'TLF 4000',88:'KLF',89:'MLF',90:'HLF 10',91:'Rettungshundefahrzeug',92:'Anh Hund',93:'MTW-O',94:'DHuFüKW',95:'Polizeimotorrad',96:'Außenlastbehälter (allgemein)',97:'ITW',98:'Zivilstreifenwagen',100:'MLW 4',101:'Anh SwPu',102:'Anh 7',103:'FuStW (DGL)',104:'GW-L1',105:'GW-L2',106:'MTF-L',107:'LF-L',108:'AB-L',109:'MzGW SB',110:'NEA50',111:'NEA50',112:'NEA200',113:'NEA200',114:'GW-Lüfter',115:'Anh Lüfter',116:'AB-Lüfter',117:'AB-Tank',118:'Kleintankwagen',119:'AB-Lösch',120:'Tankwagen',121:'GTLF',122:'LKW 7 Lbw (FGr E)',123:'LKW 7 Lbw (FGr WP)',124:'MTW-OV',125:'MTW-Tr UL',126:'MTF Drohne',127:'GW UAS',128:'ELW Drohne',129:'ELW2 Drohne',130:'GW-Bt',131:'Bt-Kombi',132:'FKH',133:'Bt LKW',134:'Pferdetransporter klein',135:'Pferdetransporter groß',136:'Anh Pferdetransport',137:'Zugfahrzeug Pferdetransport',138:'GW-Verpflegung',139:'GW-Küche',140:'MTW-Verpflegung',141:'FKH',142:'AB-Küche',143:'Anh Schlauch',144:'FüKW (THW)',145:'FüKomKW',146:'Anh FüLa',147:'FmKW',148:'MTW-FGr K',149:'GW-Bergrettung (NEF)',150:'GW-Bergrettung',151:'ELW Bergrettung',152:'ATV',153:'Hundestaffel (Bergrettung)',154:'Schneefahrzeug',155:'Anh Höhenrettung (Bergrettung)',156:'Polizeihubschrauber mit verbauter Winde',157:'RTH Winde',158:'GW-Höhenrettung (Bergrettung)',159:'Seenotrettungskreuzer',160:'Seenotrettungsboot',161:'Hubschrauber (Seenotrettung)',162:'RW-Schiene',163:'HLF Schiene',164:'AB-Schiene',165:'LauKw',166:'PTLF 4000',167:'SLF',168:'Anh Sonderlöschmittel',169:'AB-Sonderlöschmittel',170:'AB-Wasser/Schaum',171:'GW TeSi',172:'LKW Technik (Notstrom)',173:'MTW TeSi',174:'Anh TeSi',175:'NEA50',};
    const VEHICLE_GROUPS = {"Feuerwehr": [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,30,33,34,36,37,46,47,48,49,53,54,57,75,76,77,78,83,84,85,86,87,88,89,90,104,105,106,107,108,114,115,116,117,118,119,120,121,126,127,128,129,143,162,163,164,166,167,168,169,170],"Rettungsdienst": [28,29,31,38,55,56,58,59,60,73,74,91,92,93,97,130,131,132,133,138,139,140,141,142],"Polizei": [32,35,50,51,52,61,72,79,80,81,82,94,95,98,103,156],"THW": [39,40,41,42,43,44,45,65,66,67,68,69,70,71,100,101,102,109,110,111,112,113,122,123,124,125,144,145,146,147,148,165,171,172,173,174,175],"Wasserrettung / Bergrettung": [63,64,149,150,151,152,153,154,155,157,158,159,160,161],"Pferde / Tiere": [134,135,136,137]};
    const refitVehicleTypeIds = [0, 1, 6, 7, 8, 9, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 75, 87, 88, 89, 90, 121, 163, 166, 167];
    let allApiVehicles = [];
    let currentlyFilteredVehicles = [];

    refitVehicleTypeIds.sort((a, b) => (VEHICLE_TYPE_MAP[a] || '').localeCompare(VEHICLE_TYPE_MAP[b] || ''));

    const vehicleActions = {
        refit: async (vehicle, context) => {
            const postUrl = context.postUrlTemplate.replace('{id}', vehicle.id);
            const formData = new FormData();
            formData.append('utf8', '✓');
            formData.append('authenticity_token', context.authToken);
            formData.append('vehicle_fitting_template[id]', context.templateId);
            formData.append('commit', 'Fahrzeug umrüsten');
            const postResponse = await fetch(postUrl, { method: 'POST', body: formData });
            if (!postResponse.ok && postResponse.status !== 302) throw new Error(`Refit-Serverfehler: ${postResponse.status}`);
        },
        setCrew: async (vehicle) => {
            const response = await fetch(`/vehicles/${vehicle.id}/edit`);
            const text = await response.text();
            const doc = new DOMParser().parseFromString(text, 'text/html');
            const select = doc.getElementById('vehicle_personal_max');
            if (!select) throw new Error('Dropdown nicht gefunden');
            const maxValue = Math.max(...Array.from(select.options).map(o => parseInt(o.value, 10)));
            const currentVal = doc.querySelector('#vehicle_personal_max option[selected]')?.value || select.value;
            if (parseInt(currentVal, 10) !== maxValue) {
                const form = doc.querySelector('form');
                const formData = new FormData(form);
                formData.set('vehicle[personal_max]', maxValue);
                await fetch(form.action, { method: 'POST', body: formData });
            }
        },
        scrap: async (vehicle) => {
            const token = document.querySelector('meta[name="csrf-token"]').content;
            await fetch(`/vehicles/${vehicle.id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': token } });
        },
        backalarm: async (vehicle) => {
            await fetch(`/vehicles/${vehicle.id}/backalarm?return=vehicle_show`);
        },
        setFms: async (vehicle, context) => {
            await fetch(`/vehicles/${vehicle.id}/set_fms/${context.targetStatus}`);
        }
    };

    async function processWithProgress(vehicles, action, context = {}) {
        const progressContainer = document.getElementById('lssToolProgressContainer');
        if (!progressContainer) { console.error(`${SCRIPT_PREFIX} Progress container not found!`); return; }
        const CONCURRENCY_LIMIT = 20;
        progressContainer.innerHTML = '';
        progressContainer.style.display = 'grid';
        progressContainer.style.gap = '2px';
        progressContainer.style.marginBottom = '10px';
        const originalTotal = vehicles.length;
        if (originalTotal === 0) return;
        let targetTotal = originalTotal;
        let columns = 20;
        if (originalTotal <= 40) {
            if (originalTotal <= 20) {
                columns = originalTotal || 1;
            } else {
                 while (true) {
                    let foundDivisor = false;
                    for (let i = 20; i >= 2; i--) { if (targetTotal % i === 0) { columns = i; foundDivisor = true; break; } }
                    if (foundDivisor) break;
                    targetTotal++;
                }
            }
        }
        progressContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        const blockElements = new Map();
        vehicles.forEach(vehicle => {
            const block = document.createElement('div');
            block.style.height = '18px'; block.style.backgroundColor = '#fff'; block.style.border = '1px solid #eee'; block.style.fontSize = '10px'; block.style.color = '#333'; block.style.textAlign = 'center'; block.style.lineHeight = '16px'; block.style.overflow = 'hidden'; block.style.whiteSpace = 'nowrap';
            block.textContent = vehicle.id;
            block.title = `Fahrzeug: ${vehicle.name || vehicle.caption}\nID: ${vehicle.id}`;
            progressContainer.appendChild(block);
            blockElements.set(vehicle.id.toString(), block);
        });
        const emptyCellsToAdd = targetTotal - originalTotal;
        if (originalTotal <= 40) {
            for (let i = 0; i < emptyCellsToAdd; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.style.border = '1px solid transparent'; emptyCell.style.backgroundColor = '#f8f8f8';
                progressContainer.appendChild(emptyCell);
            }
        }
        let failedCount = 0;
        const queue = [...vehicles];
        const worker = async () => {
            while (queue.length > 0) {
                const vehicle = queue.shift();
                if (!vehicle) continue;
                const block = blockElements.get(vehicle.id.toString());
                block.style.backgroundColor = 'gold'; block.style.color = '#000';
                try {
                    await action(vehicle, context);
                    block.style.backgroundColor = 'limegreen';
                } catch (e) {
                    failedCount++;
                    block.style.backgroundColor = 'crimson'; block.style.color = '#fff'; block.title += `\nFEHLER: ${e.message}`;
                    console.error(`${SCRIPT_PREFIX} FEHLER bei Fahrzeug-ID ${vehicle.id}:`, e.message);
                }
            }
        };
        const workers = Array.from({ length: CONCURRENCY_LIMIT }, () => worker());
        await Promise.all(workers);
        alert(`Vorgang abgeschlossen. ${originalTotal - failedCount} erfolgreich, ${failedCount} Fehler.`);
        if (failedCount === 0 && window.location.pathname.startsWith('/buildings/')) {
             setTimeout(() => window.location.reload(), 1000);
        }
    }

    async function createMaximumTemplate(doc, templateName) {
        const form = doc.getElementById('refit_form');
        if (!form) throw new Error("Formular zum Erstellen der Vorlage nicht gefunden.");

        const formData = new FormData();
        const authToken = doc.querySelector('input[name="authenticity_token"]')?.value;
        if (authToken) {
            formData.append('authenticity_token', authToken);
        }
        formData.append('utf8', '✓');
        formData.append('vehicle_fitting_template[id]', '');
        formData.append('vehicle_fitting_template[template_caption]', templateName);

        doc.querySelectorAll('.slider-container').forEach(container => {
            const slider = container.querySelector('input[type="range"]');
            const hiddenInput = container.querySelector('input[type="hidden"]');
            if (slider && hiddenInput) {
                const maxValue = slider.getAttribute('max');
                const inputName = hiddenInput.getAttribute('name');
                formData.set(inputName, maxValue);
            }
        });

        const commitButton = doc.querySelector('input[name="commit"]:not(.coins_activate)');
        if (commitButton) {
            formData.set('commit', commitButton.value);
        } else {
            formData.set('commit', 'Fahrzeug umrüsten');
        }

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        if (!response.ok && response.status !== 302) {
            throw new Error(`Serverfehler beim Erstellen der Vorlage: ${response.status}`);
        }
    }

    // ========== NEUE HELFERFUNKTIONEN ==========
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function showRefitConfirmationModal(vehicleCount, vehicleTypeName) {
        return new Promise((resolve, reject) => {
            document.getElementById('lss-refit-modal-container')?.remove();

            const modalHtml = `
                <div id="lss-refit-modal-container" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 1055; display: flex; align-items: center; justify-content: center;">
                    <div style="background: #fff; color: #333; padding: 20px; border-radius: 5px; width: 90%; max-width: 500px; border: 1px solid #ddd; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                        <h3 style="margin-top: 0; border-bottom: 1px solid #eee; padding-bottom: 10px;">Umrüstung bestätigen</h3>
                        <p>Möchten Sie wirklich <strong>${vehicleCount} ${vehicleTypeName}</strong> maximieren?</p>
                        <div style="background: #fcf8e3; border: 1px solid #faebcc; color: #8a6d3b; padding: 15px; border-radius: 4px; margin: 15px 0;">
                            <strong>Achtung:</strong>
                            <ul style="margin: 5px 0 0 20px; padding: 0;">
                                <li>Die Umrüstung kostet Credits.</li>
                                <li>Jedes Fahrzeug ist für 48 Stunden nicht verfügbar.</li>
                            </ul>
                        </div>
                        <div style="margin-top: 20px;">
                            <label for="lss-refit-percentage-select">Wie viele der ${vehicleCount} Fahrzeuge sollen umgerüstet werden?</label>
                            <select id="lss-refit-percentage-select" class="form-control" style="margin-top: 5px;">
                                <option value="25">25%</option>
                                <option value="50">50%</option>
                                <option value="75">75%</option>
                                <option value="100" selected>100%</option>
                            </select>
                        </div>
                        <div style="margin-top: 25px; text-align: right;">
                            <button id="lss-refit-cancel-btn" class="btn btn-default" style="margin-right: 10px;">Abbrechen</button>
                            <button id="lss-refit-confirm-btn" class="btn btn-primary">Bestätigen & Starten</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);

            const confirmBtn = document.getElementById('lss-refit-confirm-btn');
            const cancelBtn = document.getElementById('lss-refit-cancel-btn');
            const modalContainer = document.getElementById('lss-refit-modal-container');
            const select = document.getElementById('lss-refit-percentage-select');

            confirmBtn.addEventListener('click', () => {
                modalContainer.remove();
                resolve(parseInt(select.value, 10));
            });

            cancelBtn.addEventListener('click', () => {
                modalContainer.remove();
                reject(new Error('User cancelled.'));
            });
        });
    }
    // ===========================================

    function findTemplateIdInDoc(doc, templateName) {
        const options = doc.querySelectorAll('#fitting_template_select option');
        for (const option of options) {
            if (option.textContent.trim() === templateName) {
                return option.value;
            }
        }
        return null;
    }

    function logToPage(message) {
        const logContainer = document.getElementById('lssToolLogContainer');
        if (logContainer) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('p');
            logEntry.style.margin = '0 0 5px 0';
            logEntry.style.fontFamily = 'monospace';
            logEntry.style.fontSize = '12px';
            logEntry.textContent = `[${timestamp}] ${message}`;
            logContainer.appendChild(logEntry);
        }
    }

    // =================================================================================
    // --- 2. IN-PAGE-MODUL ---
    // =================================================================================
    function initializeInPageTool() {
        const getVehicleDataFromRow = (row) => {
            const link = row.querySelector('td a[href*="/vehicles/"]');
            if (!link) return null;
            const idMatch = link.href.match(/\/vehicles\/(\d+)/);
            const id = idMatch ? idMatch[1] : null;
            const name = link.textContent.replace(/\u200b/g, '').trim();
            const typeId = parseInt(row.querySelector('img[vehicle_type_id]')?.getAttribute('vehicle_type_id'), 10);
            const fms = row.querySelector('span.building_list_fms')?.textContent.trim();
            if (!id || !name) return null;
            return { id, name, typeId, fms };
        };
        const getVisibleVehicleRowsInPage = () => Array.from(document.querySelectorAll('#vehicle_table tbody tr')).filter(row => row.style.display !== 'none');
        const getVehiclesFromTable = (filterFunc = () => true) => getVisibleVehicleRowsInPage().map(getVehicleDataFromRow).filter(Boolean).filter(filterFunc);

        const refitHandler = async (typeId) => {
            const vehicleTypeName = VEHICLE_TYPE_MAP[typeId] || `Fahrzeugtyp ${typeId}`;
            const templateName = `MAX ${vehicleTypeName}`;
            const vehiclesToRefit = getVehiclesFromTable(v => v.typeId === typeId && v.fms === '2' && !v.name.toLowerCase().includes('maximum'));

            if (vehiclesToRefit.length === 0) {
                alert(`Keine umrüstbaren "${vehicleTypeName}" in Status 2 gefunden.`);
                return;
            }

            let percentage;
            try {
                percentage = await showRefitConfirmationModal(vehiclesToRefit.length, vehicleTypeName);
            } catch (error) {
                console.log("Umrüstung vom Benutzer abgebrochen.");
                return;
            }

            const shuffledVehicles = shuffleArray([...vehiclesToRefit]);
            const vehicleCountToSend = Math.ceil(shuffledVehicles.length * (percentage / 100));
            const vehiclesToSend = shuffledVehicles.slice(0, vehicleCountToSend);

            const logContainer = document.getElementById('lssToolLogContainer');
            if(logContainer) logContainer.innerHTML = '';

            try {
                const firstVehicleId = vehiclesToSend[0].id;

                logToPage(`Prüfe auf Vorlage "${templateName}"...`);
                const refitPageResponse = await fetch(`/vehicles/${firstVehicleId}/refit`);
                const htmlText = await refitPageResponse.text();
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                const authToken = doc.querySelector('input[name="authenticity_token"]')?.value;
                if (!authToken) throw new Error("Authenticity Token nicht gefunden.");

                let templateId = findTemplateIdInDoc(doc, templateName);

                if (!templateId) {
                    logToPage(`Vorlage nicht gefunden. Erstelle sie jetzt...`);
                    await createMaximumTemplate(doc, templateName);

                    const newRefitPageResponse = await fetch(`/vehicles/${firstVehicleId}/refit`);
                    const newHtmlText = await newRefitPageResponse.text();
                    const newDoc = new DOMParser().parseFromString(newHtmlText, 'text/html');
                    templateId = findTemplateIdInDoc(newDoc, templateName);

                    if (!templateId) throw new Error("Vorlage konnte nach der Erstellung nicht gefunden werden.");
                    logToPage(`Vorlage erfolgreich erstellt.`);
                } else {
                    logToPage(`Vorlage gefunden.`);
                }

                logToPage(`Starte zufällige Umrüstung für ${vehiclesToSend.length} von ${vehiclesToRefit.length} Fahrzeugen (${percentage}%)...`);
                const context = {
                    postUrlTemplate: '/refit_vehicle/{id}',
                    authToken,
                    templateId
                };
                await processWithProgress(vehiclesToSend, vehicleActions.refit, context);

            } catch (e) {
                logToPage(`FEHLER: ${e.message}`);
                alert(`Ein Fehler ist aufgetreten: ${e.message}`);
            }
        };

        const handleInPageScrap = () => {
            const vehicles = getVehiclesFromTable();
            if (vehicles.length === 0) { alert('Keine Fahrzeuge zum Verschrotten gefunden.'); return; }
            if (!confirm(`ACHTUNG! Sollen wirklich ${vehicles.length} Fahrzeuge VERSCHROTTET werden?`)) return;
            processWithProgress(vehicles, vehicleActions.scrap);
        };
        const handleInPageCrew = () => {
            const vehicles = getVehiclesFromTable();
            if (vehicles.length === 0) { alert('Keine Fahrzeuge gefunden.'); return; }
            if (!confirm(`Sollen für ${vehicles.length} Fahrzeuge die max. Besatzung eingestellt werden?`)) return;
            processWithProgress(vehicles, vehicleActions.setCrew);
        };
        const handleInPageBackalarm = () => {
            const vehicles = getVehiclesFromTable(v => v.fms && !['1', '2', '6'].includes(v.fms));
            if (vehicles.length === 0) { alert('Keine Fahrzeuge zum Rückalarmieren gefunden.'); return; }
            if (!confirm(`Sollen ${vehicles.length} Fahrzeuge zur Wache zurückalarmiert werden?`)) return;
            processWithProgress(vehicles, vehicleActions.backalarm);
        };
        const handleInPageSetFms = (targetStatus, currentStatusFilter) => {
            const vehicles = getVehiclesFromTable(v => v.fms === currentStatusFilter);
            if (vehicles.length === 0) { alert(`Keine Fahrzeuge mit Status ${currentStatusFilter} gefunden.`); return; }
            if (!confirm(`Sollen ${vehicles.length} Fahrzeuge von Status ${currentStatusFilter} auf ${targetStatus} gesetzt werden?`)) return;
            processWithProgress(vehicles, vehicleActions.setFms, { targetStatus });
        };
        function buildInPageControls() {
            const mainContainer = document.createElement('div');
            mainContainer.id = 'lssToolContainer'; mainContainer.className = 'panel panel-default'; mainContainer.style.marginBottom = '10px';
            const panelBody = document.createElement('div');
            panelBody.className = 'panel-body'; panelBody.style.display = 'flex'; panelBody.style.flexDirection = 'column'; panelBody.style.gap = '5px';
            const standardActionsGroup = document.createElement('div');
            standardActionsGroup.className = 'btn-group';
            const refitActionsGroup = document.createElement('div');
            refitActionsGroup.className = 'btn-group'; refitActionsGroup.style.flexWrap = 'wrap'; refitActionsGroup.style.gap = '5px';
            const fmsActionsGroup = document.createElement('div');
            fmsActionsGroup.className = 'btn-group'; fmsActionsGroup.style.alignItems = 'center'; fmsActionsGroup.style.display = 'flex';
            const createButton = (text, className, handler, icon) => {
                const btn = document.createElement('button');
                btn.className = `btn ${className} btn-sm`;
                if (icon) btn.innerHTML = `<span class="glyphicon glyphicon-${icon}"></span> `;
                btn.appendChild(document.createTextNode(text));
                btn.onclick = handler;
                return btn;
            };
            standardActionsGroup.appendChild(createButton('Max. Besatzung', 'btn-success', handleInPageCrew, 'user'));
            standardActionsGroup.appendChild(createButton('Rückalarmieren', 'btn-warning', handleInPageBackalarm, 'bell'));
            standardActionsGroup.appendChild(createButton('Verschrotten', 'btn-danger', handleInPageScrap, 'trash'));
            refitVehicleTypeIds.forEach(typeId => {
                const vehicleTypeName = VEHICLE_TYPE_MAP[typeId];
                if (!vehicleTypeName) return;
                const vehiclesToRefit = getVehiclesFromTable(v => v.typeId === typeId && v.fms === '2' && !v.name.toLowerCase().includes('maximum'));
                if (vehiclesToRefit.length > 0) {
                    refitActionsGroup.appendChild(createButton(`MAX ${vehicleTypeName} (${vehiclesToRefit.length})`, 'btn-primary', () => refitHandler(typeId), 'wrench'));
                }
            });
            const fmsLabel = document.createElement('span');
            fmsLabel.textContent = 'FMS:'; fmsLabel.style.marginLeft = '10px'; fmsLabel.style.marginRight = '5px';
            fmsActionsGroup.appendChild(fmsLabel);
            const setFms2Btn = document.createElement('button');
            setFms2Btn.textContent = '2'; setFms2Btn.className = 'btn btn-xs building_list_fms building_list_fms_2'; setFms2Btn.style.width = '25px';
            setFms2Btn.onclick = () => handleInPageSetFms('2', '6');
            fmsActionsGroup.appendChild(setFms2Btn);
            const setFms6Btn = document.createElement('button');
            setFms6Btn.textContent = '6'; setFms6Btn.className = 'btn btn-xs'; setFms6Btn.style.backgroundColor = 'black'; setFms6Btn.style.color = 'white'; setFms6Btn.style.width = '25px';
            setFms6Btn.onclick = () => handleInPageSetFms('6', '2');
            fmsActionsGroup.appendChild(setFms6Btn);
            const combinedLeftGroup = document.createElement('div');
            combinedLeftGroup.style.display = 'flex'; combinedLeftGroup.style.flexWrap = 'wrap'; combinedLeftGroup.style.gap = '5px';
            combinedLeftGroup.appendChild(standardActionsGroup);
            combinedLeftGroup.appendChild(fmsActionsGroup);
            panelBody.appendChild(combinedLeftGroup);
            if (refitActionsGroup.hasChildNodes()) panelBody.appendChild(refitActionsGroup);
            mainContainer.appendChild(panelBody);
            return mainContainer;
        }
        function runInPage() {
            const vehicleTable = document.getElementById('vehicle_table');
            if (!vehicleTable || document.getElementById('lssToolContainer')) return;
            document.getElementById('lssToolContainer')?.remove();
            const controls = buildInPageControls();
            const logContainer = document.createElement('div');
            logContainer.id = 'lssToolLogContainer';
            logContainer.style.marginBottom = '10px';
            const progressContainer = document.createElement('div');
            progressContainer.id = 'lssToolProgressContainer';
            vehicleTable.parentNode.insertBefore(controls, vehicleTable);
            vehicleTable.parentNode.insertBefore(logContainer, vehicleTable);
            vehicleTable.parentNode.insertBefore(progressContainer, vehicleTable);
        }
        const observer = new MutationObserver(runInPage);
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(runInPage, 500);
    }

    // =================================================================================
    // --- 3. STANDALONE-MODUL ---
    // =================================================================================
    function initializeStandaloneTool() {
        const settingsLi = document.querySelector('ul.dropdown-menu[aria-labelledby="menu_profile"] a[href="/settings/index"]')?.parentNode;
        if (!settingsLi || document.getElementById('lssStandaloneToolBtn')) return;
        const toolLi = document.createElement('li');
        toolLi.innerHTML = `<a href="#" id="lssStandaloneToolBtn"><span class="glyphicon glyphicon-wrench" style="margin-right: 8px; vertical-align: text-top;"></span> Fahrzeug-Tool</a>`;
        settingsLi.parentNode.insertBefore(toolLi, settingsLi.nextSibling);
        document.getElementById('lssStandaloneToolBtn').addEventListener('click', e => { e.preventDefault(); showStandaloneTool(); });
    }

    function showStandaloneTool() {
        if (document.getElementById('lssStandaloneToolModal')) document.getElementById('lssStandaloneToolModal').remove();
        const modalHtml = `
            <div id="lssStandaloneToolModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1051; display: flex; align-items: center; justify-content: center;">
                <div style="background: #fff; color: #000; padding: 20px; border-radius: 5px; width: 90%; max-width: 1200px; height: auto; display: flex; flex-direction: column; max-height: 90vh;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">
                        <h2 style="margin:0;">Fahrzeug-Tool (Standalone)</h2>
                        <button id="lssToolCloseBtn" style="font-size: 24px; border: none; background: transparent; cursor: pointer; color: #000; padding:0;">&times;</button>
                    </div>
                    <div id="lssToolControls" style="display: flex; flex-wrap: wrap; gap: 15px; padding: 10px; border: 1px solid #eee; margin-bottom: 10px; align-items: center;">
                        <button id="lssToolLoadDataBtn" class="btn btn-primary">Aktualisieren</button>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                           <input type="text" id="lssToolVehicleTypeSearch" class="form-control" placeholder="Fahrzeugtyp suchen..." style="width: 250px;">
                           <select id="lssToolVehicleTypeFilter" class="form-control" style="width: 250px; height: 100px;" size="5" disabled><option value="-1">Alle Fahrzeugtypen</option></select>
                        </div>
                        <select id="lssToolFmsFilter" class="form-control" style="width: 150px;" disabled><option value="-1">Alle FMS</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option></select>
                        <span id="lssToolVehicleCount" style="font-weight: bold; margin-left: auto;"></span>
                    </div>
                    <div id="lssToolActionButtons" style="display: flex; flex-direction: column; gap: 5px; margin-bottom: 10px; min-height: 34px;"></div>
                    <div id="lssToolLogContainer" style="margin-bottom: 10px; max-height: 100px; overflow-y: auto; background: #f5f5f5; border: 1px solid #ddd; padding: 5px;"></div>
                    <div id="lssToolProgressContainer" style="flex-shrink: 0;"></div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        document.getElementById('lssToolCloseBtn').addEventListener('click', () => document.getElementById('lssStandaloneToolModal').remove());
        document.getElementById('lssToolLoadDataBtn').addEventListener('click', handleLoadApiData);
        document.getElementById('lssToolVehicleTypeSearch').addEventListener('input', filterVehicleDropdown);
        document.getElementById('lssToolVehicleTypeFilter').addEventListener('change', handleApplyFilters);
        document.getElementById('lssToolFmsFilter').addEventListener('change', handleApplyFilters);
        handleLoadApiData();
    }

    function filterVehicleDropdown() {
        const searchTerm = this.value.toLowerCase();
        const select = document.getElementById('lssToolVehicleTypeFilter');
        const optgroups = select.querySelectorAll('optgroup');
        const allOption = select.querySelector('option[value="-1"]');
        if (allOption) allOption.style.display = '';
        optgroups.forEach(group => {
            let visibleOptionsInGroup = 0;
            const options = group.querySelectorAll('option');
            options.forEach(option => {
                if (option.textContent.toLowerCase().includes(searchTerm)) { option.style.display = ''; visibleOptionsInGroup++; }
                else { option.style.display = 'none'; }
            });
            group.style.display = visibleOptionsInGroup > 0 ? '' : 'none';
        });
    }

    async function handleLoadApiData() {
        const btn = document.getElementById('lssToolLoadDataBtn');
        btn.textContent = 'Lade...'; btn.disabled = true;
        document.getElementById('lssToolVehicleCount').textContent = 'Lade Fahrzeuge...';
        try {
            const response = await fetch('/api/vehicles');
            if (!response.ok) throw new Error(`Serverantwort: ${response.status}`);
            allApiVehicles = await response.json();
            document.getElementById('lssToolVehicleCount').textContent = `${allApiVehicles.length} Fahrzeuge geladen. Bitte Filter anwenden.`;
            const vehicleTypeFilter = document.getElementById('lssToolVehicleTypeFilter');
            vehicleTypeFilter.innerHTML = '<option value="-1">Alle Fahrzeugtypen</option>';
            const ownedTypes = new Set(allApiVehicles.map(v => v.vehicle_type));
            const processedTypes = new Set();
            for (const groupName in VEHICLE_GROUPS) {
                const groupOpt = document.createElement('optgroup');
                groupOpt.label = groupName;
                const typesInGroup = VEHICLE_GROUPS[groupName].filter(typeId => ownedTypes.has(typeId)).sort((a, b) => (VEHICLE_TYPE_MAP[a] || '').localeCompare(VEHICLE_TYPE_MAP[b] || ''));
                if (typesInGroup.length > 0) {
                    typesInGroup.forEach(typeId => { const typeName = VEHICLE_TYPE_MAP[typeId] || `Typ ${typeId}`; const option = document.createElement('option'); option.value = typeId; option.textContent = typeName; groupOpt.appendChild(option); processedTypes.add(typeId); });
                    vehicleTypeFilter.appendChild(groupOpt);
                }
            }
            const otherGroup = document.createElement('optgroup');
            otherGroup.label = "Sonstige";
            let hasOthers = false;
            ownedTypes.forEach(typeId => {
                if (!processedTypes.has(typeId)) { const typeName = VEHICLE_TYPE_MAP[typeId] || `Typ ${typeId}`; const option = document.createElement('option'); option.value = typeId; option.textContent = typeName; otherGroup.appendChild(option); hasOthers = true; }
            });
            if (hasOthers) vehicleTypeFilter.appendChild(otherGroup);
            vehicleTypeFilter.disabled = false;
            document.getElementById('lssToolFmsFilter').disabled = false;
        } catch(e) { alert(`Fehler beim Laden der Fahrzeuge: ${e.message}`); document.getElementById('lssToolVehicleCount').textContent = 'Fehler!'; }
        finally { btn.textContent = 'Aktualisieren'; btn.disabled = false; handleApplyFilters(); }
    }

    function handleApplyFilters() {
        const typeFilter = document.getElementById('lssToolVehicleTypeFilter').value;
        const fmsFilter = document.getElementById('lssToolFmsFilter').value;
        currentlyFilteredVehicles = allApiVehicles.filter(v =>
            (typeFilter == -1 || v.vehicle_type == typeFilter) &&
            (fmsFilter == -1 || v.fms_real == fmsFilter)
        );
        document.getElementById('lssToolVehicleCount').textContent = `${currentlyFilteredVehicles.length} Fahrzeuge im Filter`;
        generateActionButtonsForApi();
    }

    function generateActionButtonsForApi() {
        const container = document.getElementById('lssToolActionButtons');
        container.innerHTML = '';
        const standardButtonsGroup = document.createElement('div');
        standardButtonsGroup.className = 'btn-group';
        const refitButtonsGroup = document.createElement('div');
        refitButtonsGroup.className = 'btn-group'; refitButtonsGroup.style.flexWrap = 'wrap'; refitButtonsGroup.style.gap = '5px';

        const standardButtons = [
            {text: 'Max. Besatzung', class: 'btn-success', action: vehicleActions.setCrew, confirmMsg: 'Sollen für %COUNT% Fahrzeuge die max. Besatzung eingestellt werden?'},
            {text: 'Rückalarmieren', class: 'btn-warning', action: vehicleActions.backalarm, confirmMsg: 'Sollen %COUNT% Fahrzeuge zur Wache zurückalarmiert werden?', filter: v => v.fms_real > 2 && v.fms_real != 6},
            {text: 'Verschrotten', class: 'btn-danger', action: vehicleActions.scrap, confirmMsg: 'ACHTUNG! Sollen wirklich %COUNT% Fahrzeuge unwiderruflich VERSCHROTTET werden?'},
            {text: 'FMS 2 (von 6)', class: 'btn-success', action: vehicleActions.setFms, context: {targetStatus: 2}, confirmMsg: 'Sollen %COUNT% Fahrzeuge von FMS 6 auf 2 gesetzt werden?', filter: v => v.fms_real == 6},
            {text: 'FMS 6 (von 2)', class: 'btn-default', action: vehicleActions.setFms, context: {targetStatus: 6}, confirmMsg: 'Sollen %COUNT% Fahrzeuge von FMS 2 auf 6 gesetzt werden?', filter: v => v.fms_real == 2},
        ];

        standardButtons.forEach(config => {
            const vehiclesForAction = config.filter ? currentlyFilteredVehicles.filter(config.filter) : currentlyFilteredVehicles;
            if (vehiclesForAction.length === 0) return;
            const btn = document.createElement('button');
            btn.className = `btn ${config.class} btn-sm`;
            btn.textContent = `${config.text} (${vehiclesForAction.length})`;
            btn.onclick = async () => {
                if (!confirm(config.confirmMsg.replace('%COUNT%', vehiclesForAction.length))) return;
                await processWithProgress(vehiclesForAction, config.action, config.context || {});
            };
            standardButtonsGroup.appendChild(btn);
        });

        refitVehicleTypeIds.forEach(typeId => {
            const vehicleTypeName = VEHICLE_TYPE_MAP[typeId];
            if (!vehicleTypeName) return;
            const templateName = `MAX ${vehicleTypeName}`;
            const vehiclesToRefit = currentlyFilteredVehicles.filter(v => v.vehicle_type === typeId && !v.caption.toLowerCase().includes('maximum') && v.fms_real === 2);
            if (vehiclesToRefit.length === 0) return;
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-sm';
            btn.textContent = `MAX ${vehicleTypeName} (${vehiclesToRefit.length})`;
            btn.onclick = async function refitStandaloneHandler() {
                let percentage;
                try {
                    percentage = await showRefitConfirmationModal(vehiclesToRefit.length, vehicleTypeName);
                } catch (error) {
                    console.log("Umrüstung vom Benutzer abgebrochen.");
                    return;
                }

                const shuffledVehicles = shuffleArray([...vehiclesToRefit]);
                const vehicleCountToSend = Math.ceil(shuffledVehicles.length * (percentage / 100));
                const vehiclesToSend = shuffledVehicles.slice(0, vehicleCountToSend);

                const logContainer = document.getElementById('lssToolLogContainer');
                if(logContainer) logContainer.innerHTML = '';

                try {
                    const firstVehicleId = vehiclesToSend[0].id;

                    logToPage(`Prüfe auf Vorlage "${templateName}"...`);
                    const refitPageResponse = await fetch(`/vehicles/${firstVehicleId}/refit`);
                    const htmlText = await refitPageResponse.text();
                    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
                    const authToken = doc.querySelector('input[name="authenticity_token"]')?.value;
                    if (!authToken) throw new Error("Authenticity Token nicht gefunden.");

                    let templateId = findTemplateIdInDoc(doc, templateName);

                    if (!templateId) {
                        logToPage(`Vorlage nicht gefunden. Erstelle sie jetzt...`);
                        await createMaximumTemplate(doc, templateName);

                        const newRefitPageResponse = await fetch(`/vehicles/${firstVehicleId}/refit`);
                        const newHtmlText = await newRefitPageResponse.text();
                        const newDoc = new DOMParser().parseFromString(newHtmlText, 'text/html');
                        templateId = findTemplateIdInDoc(newDoc, templateName);

                        if (!templateId) throw new Error("Vorlage konnte nach der Erstellung nicht gefunden werden.");
                        logToPage(`Vorlage erfolgreich erstellt.`);
                    } else {
                        logToPage(`Vorlage gefunden.`);
                    }

                    logToPage(`Starte zufällige Umrüstung für ${vehiclesToSend.length} von ${vehiclesToRefit.length} Fahrzeugen (${percentage}%)...`);
                    const context = {
                        postUrlTemplate: '/refit_vehicle/{id}',
                        authToken,
                        templateId
                    };
                    await processWithProgress(vehiclesToSend, vehicleActions.refit, context);
                    await handleLoadApiData();
                } catch (e) {
                    logToPage(`FEHLER: ${e.message}`);
                    alert(`Ein Fehler ist aufgetreten: ${e.message}`);
                }
            };
            refitButtonsGroup.appendChild(btn);
        });

        if (standardButtonsGroup.hasChildNodes()) container.appendChild(standardButtonsGroup);
        if (refitButtonsGroup.hasChildNodes()) container.appendChild(refitButtonsGroup);
    }

    // =================================================================================
    // --- 4. HAUPTROUTER ---
    // =================================================================================
    if (window.location.pathname.startsWith('/buildings/')) {
        initializeInPageTool();
    } else {
        initializeStandaloneTool();
    }
})();