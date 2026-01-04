// ==UserScript==
// @name         PPTrans Monitor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Monitoruje parametry TSO z API, filtruje dane i wysyła info na Chime
// @author       nowaratn
// @match        rodeo-dub.amazon.com/KTW1/ExSD?yAxis=WORK_POOL&zAxis=PROCESS_PATH&shipmentTypes=TRANSSHIPMENTS*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520090/PPTrans%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/520090/PPTrans%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const { ssp_start_date, ssp_end_date, currentShift } = getShiftTimestamps();

    var SUPPORT_API_URL_rest = 'entity=getOutboundDockView&nodeId=KTW1&startDate=' + ssp_start_date + '&endDate=' + ssp_end_date + '&loadCategories=outboundScheduled,outboundInProgress,outboundReadyToDepart,outboundCancelled&shippingPurposeType=TRANSSHIPMENT%2CNON-TRANSSHIPMENT%2CSHIP_WITH_AMAZON'

    const SOURCE_API_URL = 'https://picking-console.eu.picking.aft.a2z.com/api/fcs/KTW1/process-paths/information';
    const SUPPORT_API_URL = 'https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?' + SUPPORT_API_URL_rest;
    let TARGET_API_URL = localStorage.getItem('chimeWebhookUrl') || '';

    // Tworzenie panelu sterującego
    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        top: 4%;
        right: 2%;
        background: #f0f0f0;
        border: 1px solid #ccc;
        padding: 15px;
        z-index: 999999;
        font-family: Arial, sans-serif;
        font-size: 14px;
        width: 450px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    `;

    const title = document.createElement('div');
    title.textContent = "PPTrans Monitor";
    title.style.cssText = `
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 16px;
        text-align: center;
    `;
    panel.appendChild(title);

    // Dodanie przycisku konfiguracji
    const configBtn = document.createElement('button');
    configBtn.textContent = '⚙️ Config';
    configBtn.style.cssText = `
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 4px;
        border: none;
        background: #6c757d;
        color: white;
        cursor: pointer;
        margin-bottom: 10px;
    `;

    // Panel konfiguracji
    const configPanel = document.createElement('div');
    configPanel.style.display = 'none';
    configPanel.style.marginBottom = '10px';

    const webhookInput = document.createElement('input');
    webhookInput.type = 'text';
    webhookInput.placeholder = 'Enter Chime webhook URL';
    webhookInput.value = TARGET_API_URL;
    webhookInput.style.cssText = `
        width: 100%;
        padding: 5px;
        margin-bottom: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    `;

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.style.cssText = `
        padding: 5px 10px;
        font-size: 12px;
        border-radius: 4px;
        border: none;
        background: #28A745;
        color: white;
        cursor: pointer;
    `;

    // Obszar informacyjny
    const infoArea = document.createElement('textarea');
    infoArea.style.cssText = `
        width: 100%;
        height: 120px;
        font-size: 12px;
        margin-bottom: 15px;
        resize: none;
        padding: 5px;
        border-radius: 4px;
        border: 1px solid #ccc;
    `;
    infoArea.readOnly = true;
    panel.appendChild(infoArea);

    // Dodanie event listenerów
    configBtn.addEventListener('click', () => {
        configPanel.style.display = configPanel.style.display === 'none' ? 'block' : 'none';
    });

    saveBtn.addEventListener('click', () => {
        const url = webhookInput.value.trim();
        if (url) {
            localStorage.setItem('chimeWebhookUrl', url);
            TARGET_API_URL = url;
            logMessage('Webhook URL saved');
            configPanel.style.display = 'none';
        } else {
            logMessage('Please enter a valid webhook URL');
        }
    });

    // Dodanie elementów do panelu
    configPanel.appendChild(webhookInput);
    configPanel.appendChild(saveBtn);
    panel.appendChild(configBtn);
    panel.appendChild(configPanel);
    document.body.appendChild(panel);

    // Funkcja do logowania w panelu
    function logMessage(msg) {
        const now = new Date().toLocaleTimeString();
        infoArea.value += `[${now}] ${msg}\n`;
        infoArea.scrollTop = infoArea.scrollHeight;
    }

    // Automatyczne uruchomienie po 5 sekundach
    setTimeout(() => {
        logMessage('Starting monitoring...');
        fetchAndProcessData();
    }, 5000);

    function getShiftTimestamps() {
        const now = new Date();
        const currentHour = now.getHours();
        let shift;

        // Automatyczne wykrywanie zmiany
        // Zmiana dzienna: 7:00 - 17:30
        // Zmiana nocna: 18:30 - 5:00
        if (currentHour >= 7 && currentHour < 17.5) {
            shift = 'day';
        } else {
            shift = 'night';
        }

        let startDate = new Date(now);
        let endDate = new Date(now);

        if (shift === 'day') {
            // Zmiana dzienna (07:00 - 17:30)
            startDate.setHours(7, 0, 0, 0);
            endDate.setDate(endDate.getDate() + 7);
            endDate.setHours(17, 30, 0, 0);
        } else {
            // Zmiana nocna (18:30 - 05:00)
            if (currentHour >= 0 && currentHour < 5) {
                startDate.setDate(startDate.getDate() - 1);
                startDate.setHours(18, 30, 0, 0);
                endDate.setDate(endDate.getDate() + 7);
                endDate.setHours(5, 0, 0, 0);
            } else {
                startDate.setHours(18, 30, 0, 0);
                endDate.setDate(endDate.getDate() + 7);
                endDate.setHours(5, 0, 0, 0);
            }
        }

        const ssp_start_date = Math.floor(startDate.getTime());
        const ssp_end_date = Math.floor(endDate.getTime());
        return { ssp_start_date, ssp_end_date, currentShift: shift };
    }

    function fetchAndProcessData() {
        if (!TARGET_API_URL) {
            logMessage('Error: Webhook URL not configured. Please set it in the config panel.');
            return;
        }

        logMessage('Fetching data from source API...');
        GM.xmlHttpRequest({
            method: 'GET',
            url: SOURCE_API_URL,
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        logMessage('Source data fetched. Getting support data...');

                        GM.xmlHttpRequest({
                            method: 'GET',
                            url: SUPPORT_API_URL,
                            onload: function(supportResponse) {
                                if (supportResponse.status === 200) {
                                    try {
                                        const supportData = JSON.parse(supportResponse.responseText);
                                        logMessage('Support data fetched, processing...');
                                        processData(data, supportData).then(result => {
                                            if(result.length > 0) {
                                                sendDataToTarget(result);
                                            }
                                        }).catch(error => {
                                            logMessage('Error processing data: ' + error.message);
                                        });
                                    } catch (e) {
                                        logMessage('Error parsing support data JSON: ' + e.message);
                                    }
                                } else {
                                    logMessage('Error fetching support data (status ' + supportResponse.status + ').');
                                }
                            },
                            onerror: function(err) {
                                logMessage('Error fetching support data: ' + err.error);
                            }
                        });
                    } catch (e) {
                        logMessage('Error parsing JSON: ' + e.message);
                    }
                } else {
                    logMessage('Error fetching source data (status ' + response.status + ').');
                }
            },
            onerror: function(err) {
                logMessage('Error fetching source data: ' + err.error);
            }
        });
    }

    async function processData(data, supportData) {
        if (!data.hasOwnProperty('processPathInformationMap')) {
            logMessage('Brak klucza processPathInformationMap w odpowiedzi API.');
            return {};
        }
        const mapData = data.processPathInformationMap;
        const tables = Array.from(document.querySelectorAll('table[id^="PPTrans"]'));
        const tableIds = tables.map(t => t.id);
        const keys = tableIds.map(id => id.replace(/Table$/, ''));
        var units = [];
        var result = [];

        for (const k of keys) {
            if (mapData.hasOwnProperty(k)) {
                const item = mapData[k];
                if (item.Status === "Active") {
                    const unitsCount = item.UnitsInTotesCount || 0;
                    const totesCount = item.ToteCount || 1;
                    const pickerCount = item.PickerCount;
                    const upt = unitsCount / totesCount;

                    if(upt == 0) continue ;

                    let extraInfo = '';

                    const table = document.getElementById(k + "Table");
                    let pickingSubtotalValue = '';
                    let predictedChargeValue = '';
                    if (table) {
                        const colIndex = findClosestDateColumnIndex(table);
                        const units = getValuesFromTable(table, colIndex);

                        const subtotal = units.pickingSubtotal;
                        const charge = units.predictedCharge;

                        if (subtotal !== null) {
                            pickingSubtotalValue = `${subtotal}`;

                            if(charge)
                            {
                                predictedChargeValue = `${charge}`;
                            }
                        }
                    }

                    var truck_capacity = 0;
                    var tote_capacity = 0;
                    var currentTotes = 0;

                    if (supportData && supportData.ret && Array.isArray(supportData.ret.aaData)) {
                        for (let i = 0; i < supportData.ret.aaData.length; i++) {
                            const element = supportData.ret.aaData[i];
                            const route = element.load && element.load.route ? element.load.route : null;
                            const criticalPullTimeStr = element.load && element.load.criticalPullTime ? element.load.criticalPullTime : null;

                            if (route && criticalPullTimeStr) {
                                // Parsowanie daty w formacie "08-Dec-24 03:30"
                                // Format: dd-MMM-yy HH:mm
                                const dateParts = criticalPullTimeStr.split(' ');
                                // "08-Dec-24" "03:30"
                                const datePart = dateParts[0]; // "08-Dec-24"
                                const timePart = dateParts[1]; // "03:30"

                                const [dayStr, monthStr, yearStr] = datePart.split('-');
                                const day = parseInt(dayStr, 10);
                                const shortYear = parseInt(yearStr, 10);
                                const fullYear = 2000 + shortYear; // zakładamy, że '24' to 2024
                                const monthsMap = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
                                const month = monthsMap[monthStr] || 0;

                                const [hourStr, minuteStr] = timePart.split(':');
                                const hour = parseInt(hourStr, 10);
                                const minute = parseInt(minuteStr, 10);

                                const criticalPullDate = new Date(fullYear, month, day, hour, minute);

                                if (route.substr(-4) === k.replace("PPTrans",""))
                                {
                                    if(criticalPullDate.toString() == closestDate.toString()) {

                                        truck_capacity++;
                                        tote_capacity = tote_capacity + 924;

                                        var loadGroupId = element.load.loadGroupId;

                                        try {
                                            currentTotes = await getSSPcontainerCount(loadGroupId);
                                        } catch (error) {
                                            console.log("Error getting container count:", error);
                                            currentTotes = 0;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Dodajemy osobne obliczenie dla predicted charge
                    const basePredictedTotes = pickingSubtotalValue / upt;
                    const predictedChargeTotes = predictedChargeValue / upt;

                    // Całkowita liczba przewidywanych tote z uwzględnieniem wszystkich składowych
                    const predictedTotes = basePredictedTotes;
                    const predictedTotesWithCharge = basePredictedTotes + predictedChargeTotes;

                    // Uwzględnienie dodatkowych tote na wózkach (2 tote na pickera)
                    const additionalTotesFromPickers = pickerCount * 2;
                    const totalPredictedTotes = predictedTotes + additionalTotesFromPickers;
                    const totalPredictedTotesWithCharge = predictedTotesWithCharge + additionalTotesFromPickers;

                    // Obliczenie dostępnego miejsca
                    const remainingSpace = tote_capacity - currentTotes;

                    // Logika rekomendacji
                    let recommendation = "";
                    let recommendationIcon = "";

                    // Aktualizacja logiki rekomendacji
                    if (remainingSpace <= 0) {
                        recommendationIcon = "❌";
                        recommendation = "STOP PICKING - No space available!";
                    } else if (totalPredictedTotesWithCharge > remainingSpace) {
                        recommendationIcon = "⚠️";
                        recommendation = `CAUTION - Total predicted totes (including ${predictedChargeTotes.toFixed(0)} charge totes) may exceed available space.`;
                    } else if (remainingSpace > totalPredictedTotesWithCharge * 1.2) {
                        recommendationIcon = "✅";
                        recommendation = "CONTINUE PICKING - Sufficient space available for all scenarios.";
                    } else {
                        recommendationIcon = "⚠️";
                        recommendation = "MONITOR CLOSELY - Space may become limited when including predicted charge.";
                    }

                    // Aktualizacja finalString z wydzielonymi sekcjami
                    var finalString = `/md ## Status Overview for ${k}\n` +
                        `**Current Status:** *${item.Status}*\n\n` +

                        `### Capacity Information\n` +
                        `- Available Trucks: ${truck_capacity}\n` +
                        `- Total Tote Capacity: ${tote_capacity} totes\n` +
                        `- Totes ready: ${currentTotes} totes\n` +
                        `- Remaining Space: ${remainingSpace} totes\n\n` +

                        `### Current Metrics\n` +
                        `- Current Picking Subtotal: ${pickingSubtotalValue} units\n` +
                        `- Current Picking Charge: ${predictedChargeValue} units\n` +
                        `- Active Pickers: ${item.PickerCount}\n` +
                        `- UPT: ${upt.toFixed(2)}\n\n` +

                        `### Predictions\n` +
                        `- Base Predicted Totes: ${basePredictedTotes.toFixed(0)}\n` +
                        `- Additional Charge Totes: ${predictedChargeTotes.toFixed(0)}\n` +
                        `- Additional Totes from Pickers: ${additionalTotesFromPickers}\n` +
                        `- Total Predicted Totes (without charge): ${totalPredictedTotes.toFixed(0)}\n` +
                        `- Total Predicted Totes (with charge): ${totalPredictedTotesWithCharge.toFixed(0)}\n\n` +

                        `- Remaining space (base scenario): ${(remainingSpace - totalPredictedTotes).toFixed(0)} totes\n` +
                        `- Remaining space (with charge): ${(remainingSpace - totalPredictedTotesWithCharge).toFixed(0)} totes\n\n` +

                        `### ${recommendationIcon} Recommendation\n` +
                        `**${recommendation}**`;

                    result.push(finalString);
                }
            }
        }
        return result;
    }


    var closestDate;

    // Funkcja zwraca index kolumny, która jest najbliższa lub równa dzisiejszej dacie
    function findClosestDateColumnIndex(table) {
        const currentDate = new Date();
        const ths = table.querySelectorAll('th.new-day');
        let closestIndex = -1;
        let closestDiff = Infinity;

        ths.forEach((th, idx) => {
            const date = parseDateFromCellText(th.textContent || th.innerText);
            // Zakładamy, że szukamy daty >= dzisiejsza
            const diff = date - currentDate;
            // Jeśli diff jest ujemny, to data jest w przeszłości, jeśli chcemy najbliższą >= dziś:
            if (diff >= 0 && diff < closestDiff) {
                closestDiff = diff;
                closestIndex = idx;
                closestDate = date;
            }
        });

        return closestIndex;
    }

    // Funkcja pomocnicza do parsowania daty z formatu w komórce tabeli, np. "Dec 8\n00:00"
    function parseDateFromCellText(text) {
        // Usuwamy zbędne białe znaki
        const cleanText = text.trim();
        // Załóżmy, że format to np. "Dec 8\n00:00" -> "Dec 8 00:00"
        // Możemy podzielić po nowej linii
        const parts = cleanText.split('\n').map(p => p.trim()).filter(Boolean);
        // parts[0] np. "Dec 8", parts[1] np. "00:00"
        // Składamy je w jedną linię:
        const dateString = parts.join(' '); // "Dec 8 00:00"

        // Założenie: rok bieżący, strefa czasowa lokalna
        // Spróbujmy sparsować przez Date.parse. Jeśli to zawiedzie, można użyć mapowania miesięcy
        // Oczekiwany format: "Dec 8 00:00" - brak roku, dołożymy bieżący rok:
        const currentYear = new Date().getFullYear();
        const finalDateString = dateString + ' ' + currentYear;

        // W niektórych przeglądarkach może być konieczne doprecyzowanie formatu, np. "Dec 8 00:00 2024"
        // Spróbujemy:
        const parsedDate = new Date(finalDateString);

        if (isNaN(parsedDate.getTime())) {
            // Jeśli się nie uda, spróbujemy ręcznie sparsować
            // Zakładamy format "MMM d HH:mm yyyy"
            // Rozbijemy dateString po spacji: ["Dec", "8", "00:00"]
            const tokens = dateString.split(' ');
            const monthName = tokens[0];
            const day = parseInt(tokens[1],10);
            const time = tokens[2] || "00:00";
            const [hours, minutes] = time.split(':').map(n=>parseInt(n,10));
            const monthsMap = {Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};
            const month = monthsMap[monthName] !== undefined ? monthsMap[monthName] : 0;
            return new Date(currentYear, month, day, hours||0, minutes||0);
        } else {
            return parsedDate;
        }
    }

    function getValuesFromTable(table, columnIndex) {
        if (columnIndex === -1) return null;

        // Znajdź wiersz nagłówkowy
        const headerRow = table.querySelector('tr.header-row');
        if (!headerRow) return null;

        // Pobierz wszystkie nagłówki z datami
        const dayHeaders = Array.from(headerRow.querySelectorAll('th.new-day'));

        // Wyciągnij konkretny nagłówek odpowiadający najbliższej dacie
        const chosenDayTh = dayHeaders[columnIndex];
        if (!chosenDayTh) return null;

        // Wyznacz absolutny indeks kolumny w wierszu nagłówkowym
        const allHeaderCells = Array.from(headerRow.querySelectorAll('th, td'));
        const absoluteColIndex = allHeaderCells.indexOf(chosenDayTh);
        if (absoluteColIndex === -1) return null;

        // Znajdź wiersze "Picking Subtotal" i "PredictedCharge"
        const rowLabels = Array.from(table.querySelectorAll('tr th.row-label'));
        const pickingSubtotalTh = rowLabels.find(th => th.textContent.trim() === "Picking Subtotal");
        const predictedChargeTh = rowLabels.find(th => th.textContent.trim() === "PredictedCharge");

        let result = {
            pickingSubtotal: null,
            predictedCharge: null
        };

        // Pobierz wartość dla Picking Subtotal
        if (pickingSubtotalTh) {
            const subtotalRow = pickingSubtotalTh.closest('tr');
            if (subtotalRow) {
                const rowCells = Array.from(subtotalRow.querySelectorAll('th, td'));
                const targetCell = rowCells[absoluteColIndex];
                if (targetCell && targetCell.classList.contains('subtotal')) {
                    result.pickingSubtotal = targetCell.textContent.trim();
                }
            }
        }

        // Pobierz wartość dla PredictedCharge
        if (predictedChargeTh) {
            const predictedChargeRow = predictedChargeTh.closest('tr');
            if (predictedChargeRow) {
                const rowCells = Array.from(predictedChargeRow.querySelectorAll('th, td'));
                const targetCell = rowCells[absoluteColIndex];
                if (targetCell) {
                    result.predictedCharge = targetCell.textContent.trim();
                }
            }
        }

        return result;
    }

    async function getSSPcontainerCount(loadid) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: "https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?entity=getContainerCountForCPT&loadGroupIds=" + loadid + "&nodeId=KTW1",
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            var ssp_resp = JSON.parse(response.responseText);
                            var notArrived = ssp_resp.ret.cptContainerCountMap[loadid].notArrived.P;
                            var inFaciltiy = ssp_resp.ret.cptContainerCountMap[loadid].inFaciltiy.P;
                            var sum = notArrived + inFaciltiy;
                            resolve(sum);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error('Request failed'));
                    }
                }
            });
        });
    }

    function sendDataToTarget(messages) {
        if (!TARGET_API_URL || messages.length === 0) return;

        messages.forEach(message => {
            const payload = {
                Content: message
            };

            GM.xmlHttpRequest({
                method: 'POST',
                url: TARGET_API_URL,
                data: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        logMessage('Alert sent successfully');
                    } else {
                        logMessage('Error sending alert (status ' + response.status + ')');
                    }
                },
                onerror: function(err) {
                    logMessage('Error sending alert: ' + err.error);
                }
            });
        });
    }
})();