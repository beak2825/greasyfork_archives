// ==UserScript==
// @name         Projekt: BOGACTWO
// @namespace    http://tampermonkey.net/
// @version      1.5.9
// @description  Zaawansowany generator kuponów z panelem ustawień, dynamicznym podglądem szans oraz przyciskami akcji. Automatycznie przegląda rynek, klika przyciski zakładu i potwierdzenia, a wygenerowane kupony umożliwiają obstawianie według wybranych parametrów. Kupony są zapisywane – możesz je wczytać i kontynuować wykonywanie po ponownym uruchomieniu strony. Teraz unika generowania identycznych kuponów, poprawiono algorytm, wygląd oraz zapisywanie statusu wykonania.
// @author
// @match        https://superbet.pl/zaklady-bukmacherskie/pilka-nozna/anglia/league-two/wszystko
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      footystats.org
// @downloadURL https://update.greasyfork.org/scripts/527732/Projekt%3A%20BOGACTWO.user.js
// @updateURL https://update.greasyfork.org/scripts/527732/Projekt%3A%20BOGACTWO.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /****************** DODANIE STYLI DO MENU ******************/
    const style = document.createElement('style');
    style.textContent = `
      #combo-settings-panel {
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        color: #333;
        max-width: 400px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 10000;
      }
      #combo-settings-panel h3 {
        margin-top: 0;
        text-align: center;
      }
      #combo-settings-panel fieldset {
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-bottom: 10px;
        padding: 10px;
      }
      #combo-settings-panel fieldset legend {
        font-weight: bold;
        padding: 0 5px;
      }
      #combo-settings-panel label {
        display: block;
        margin-bottom: 5px;
      }
      #combo-settings-panel input[type=number] {
        width: 80px;
        margin-left: 5px;
      }
      #combo-settings-panel button {
        padding: 5px 10px;
        margin: 3px;
        border: 1px solid #007bff;
        background-color: #007bff;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
      }
      #combo-settings-panel button:hover {
        background-color: #0056b3;
      }
      #combo-settings-panel .btn-group {
        margin-top: 5px;
      }
      /* Klasy statusu kuponu */
      .pending-coupon {
        background-color: white;
      }
      .in-progress-coupon {
        background-color: yellow !important;
      }
      .executed-coupon {
        background-color: lightgreen !important;
      }
    `;
    document.head.appendChild(style);

    /****************** GLOBALNE USTAWIENIA ******************/
    let selectedMode = "druzyna"; // "druzyna" lub "mecz"
    let savedCoupons = []; // zapisane kupony
    let couponIdCounter = 0; // licznik unikalnych ID kuponów

    // Bezpieczna normalizacja stringów
    function simpleNormalize(text) {
        return (typeof text === 'string' ? text.toLowerCase().trim() : "");
    }

    /****************** FUNKCJE POMOCNICZE DO PRZETWARZANIA DANYCH ******************/
    function parseProbability(probStr) {
        return parseFloat(probStr.replace('%', '').trim());
    }
    function getTeamStrength(tableKey, table) {
        if (tableKey && table && table[tableKey] && table[tableKey]["PNM (1 Poł.)"]) {
            return parseFloat(table[tableKey]["PNM (1 Poł.)"]);
        }
        return 0;
    }
    function getTeamProbability(tableKey, table) {
        if (tableKey && table && table[tableKey] && table[tableKey]["0.5+"]) {
            return parseProbability(table[tableKey]["0.5+"]);
        }
        return 0;
    }
    function getTableFactor(tableKey, table) {
        if (tableKey && table && table[tableKey] && table[tableKey]["#"]) {
            const pos = parseInt(table[tableKey]["#"], 10);
            const totalTeams = Object.keys(table).length;
            return (totalTeams - pos) / (totalTeams - 1);
        }
        return 0;
    }
    function getTeamNoGoal(tableKey, table) {
        if (tableKey && table && table[tableKey] && table[tableKey]["Brak Zdobytych Pkt"]) {
            return 1 - (parseProbability(table[tableKey]["Brak Zdobytych Pkt"]) / 100);
        }
        return 0;
    }
    function getTeamAvg(tableKey, table) {
        if (tableKey && table && table[tableKey] && table[tableKey]["Śr."]) {
            return parseFloat(table[tableKey]["Śr."]);
        }
        return 0;
    }
    function getTableKey(teamName) {
        for (const key in clubNamesMap) {
            if (clubNamesMap[key] === teamName) return key;
        }
        if (!teamName.endsWith(" FC")) {
            const tryKey = teamName + " FC";
            if (clubNamesMap[tryKey]) return tryKey;
        }
        return null;
    }

    // Porównywanie dwóch kuponów – czy mają taki sam zestaw matchKey:pick
    function combosAreEqual(c1, c2) {
        if (c1.picks.length !== c2.picks.length) return false;
        let s1 = c1.picks
        .map(p => p.matchKey + ":" + p.pick)
        .sort()
        .join(",");
        let s2 = c2.picks
        .map(p => p.matchKey + ":" + p.pick)
        .sort()
        .join(",");
        return (s1 === s2);
    }

    /****************** CZĘŚĆ 1: Pobieranie danych z FootyStats ******************/
    const clubNamesMap = {
        "Bradford City AFC": "Bradford City",
        "Chesterfield FC": "Chesterfield",
        "Milton Keynes Dons FC": "Milton Keynes Dons",
        "Doncaster Rovers FC": "Doncaster Rovers",
        "AFC Wimbledon": "Wimbledon",
        "Fleetwood Town FC": "Fleetwood Town",
        "Port Vale FC": "Port Vale",
        "Notts County FC": "Notts County",
        "Barrow AFC": "Barrow",
        "Walsall FC": "Walsall",
        "Grimsby Town FC": "Grimsby Town",
        "Bromley FC": "Bromley",
        "Salford City FC": "Salford City",
        "Accrington Stanley FC": "Accrington Stanley",
        "Newport County AFC": "Newport County",
        "Cheltenham Town FC": "Cheltenham Town",
        "Harrogate Town FC": "Harrogate Town",
        "Swindon Town FC": "Swindon Town",
        "Gillingham FC": "Gillingham",
        "Colchester United FC": "Colchester United",
        "Tranmere Rovers FC": "Tranmere Rovers",
        "Carlisle United FC": "Carlisle United",
        "Crewe Alexandra FC": "Crewe Alexandra",
        "Morecambe FC": "Morecambe"
    };

    console.log('FootyStats Table Scraper (advanced + akcje + scroll) started.');

    function parseTable(table) {
        const data = {};
        const headers = [];
        table.querySelectorAll('thead tr th').forEach((header, index) => {
            header.querySelectorAll('.hover-modal-content').forEach(elem => elem.remove());
            let headerText = header.textContent.trim();
            if (headerText === '') headerText = `Kolumna${index}`;
            headers.push(headerText);
        });
        const teamHeaderIndex = headers.findIndex(header => ['Drużyna', 'Team', 'Squadra'].includes(header));
        if (teamHeaderIndex === -1) {
            console.warn('Brak kolumny z nazwą drużyny:', headers);
            return data;
        }
        table.querySelectorAll('tbody tr').forEach((row, rowIndex) => {
            const rowData = {};
            const cells = Array.from(row.children);
            if (cells.length < headers.length) return;
            const cellsToProcess = cells.slice(0, headers.length);
            while (cellsToProcess.length < headers.length) {
                const emptyCell = document.createElement('td');
                emptyCell.textContent = '';
                cellsToProcess.push(emptyCell);
            }
            if (cellsToProcess.length > headers.length) {
                cellsToProcess.length = headers.length;
            }
            cellsToProcess.forEach((cell, index) => {
                const header = headers[index];
                cell.querySelectorAll('.hover-modal-content').forEach(elem => elem.remove());
                let cellValue = cell.textContent.trim();
                if (!cellValue) {
                    const tooltip = cell.getAttribute('data-original-title') || cell.getAttribute('title');
                    cellValue = tooltip ? tooltip.trim() : '';
                }
                rowData[header] = cellValue;
            });
            let teamName = rowData[headers[teamHeaderIndex]];
            if (!teamName) {
                const teamCell = cells[teamHeaderIndex];
                if (teamCell) {
                    teamName = teamCell.getAttribute('data-team');
                    if (!teamName) {
                        const possibleName = teamCell.querySelector('a') || teamCell.querySelector('.team');
                        if (possibleName) teamName = possibleName.textContent.trim();
                    }
                }
            }
            if (!teamName) teamName = `Drużyna${rowIndex}`;
            data[teamName] = rowData;
        });
        return data;
    }

    function processDocument(doc) {
        const tables = doc.querySelectorAll('.full-league-table');
        console.log('Znaleziono ' + tables.length + ' tabel.');
        if (tables.length < 3) {
            console.warn('Brak wymaganych trzech tabel.');
            updateGlobalStatus("Błąd: Nie znaleziono wymaganych tabel!", "error");
            return;
        }
        try {
            const allTable = parseTable(tables[0]);
            const homeTable = parseTable(tables[1]);
            const awayTable = parseTable(tables[2]);
            window.footyStatsData = {
                All: allTable,
                Dom: homeTable,
                Wyjazd: awayTable
            };
            console.log('Dane z tabel (domowych):\n', JSON.stringify(window.footyStatsData.Dom, null, 2));
        } catch (error) {
            console.error('Błąd przetwarzania tabel:', error);
            updateGlobalStatus("Błąd podczas przetwarzania tabel: " + error.message, "error");
        }
    }

    function fetchTablePage() {
        console.log('Pobieranie danych z footystats.org...');
        updateGlobalStatus("Pobieram dane z footystats.org...", "info");
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://footystats.org/pl/england/efl-league-two/half-time-table",
            onload: function(response) {
                console.log('Strona pobrana, przetwarzanie danych...');
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                processDocument(doc);
                enableSettingsPanel();
            },
            onerror: function(error) {
                console.error('Błąd pobierania danych:', error);
                updateGlobalStatus("Błąd pobierania danych z footystats.org", "error");
            }
        });
    }
    fetchTablePage();

    /****************** CZĘŚĆ 2: Przygotowanie meczów i kuponów ******************/
    function prepareMatches() {
        const events = document.querySelectorAll('.single-event');
        const matches = [];
        events.forEach(eventEl => {
            if (!eventEl) return;
            const homeTeamEl = eventEl.querySelector('.e2e-event-team1-name');
            const awayTeamEl = eventEl.querySelector('.e2e-event-team2-name');
            if (!homeTeamEl || !awayTeamEl) return;
            const homeTeamName = homeTeamEl.textContent.trim();
            const awayTeamName = awayTeamEl.textContent.trim();
            const homeKey = getTableKey(homeTeamName);
            const awayKey = getTableKey(awayTeamName);

            if (selectedMode === "druzyna") {
                // Pobieramy statystyki z tabeli dom dla gospodarzy i wyjazd dla gości
                const homePNM = getTeamStrength(homeKey, window.footyStatsData && window.footyStatsData.Dom);
                const awayPNM = getTeamStrength(awayKey, window.footyStatsData && window.footyStatsData.Wyjazd);
                const homeProb = getTeamProbability(homeKey, window.footyStatsData && window.footyStatsData.Dom) / 100;
                const awayProb = getTeamProbability(awayKey, window.footyStatsData && window.footyStatsData.Wyjazd) / 100;
                const homeTableFactor = getTableFactor(homeKey, window.footyStatsData && window.footyStatsData.Dom);
                const awayTableFactor = getTableFactor(awayKey, window.footyStatsData && window.footyStatsData.Wyjazd);
                const homeNoGoal = getTeamNoGoal(homeKey, window.footyStatsData && window.footyStatsData.Dom);
                const awayNoGoal = getTeamNoGoal(awayKey, window.footyStatsData && window.footyStatsData.Wyjazd);
                const homeAvg = getTeamAvg(homeKey, window.footyStatsData && window.footyStatsData.Dom);
                const awayAvg = getTeamAvg(awayKey, window.footyStatsData && window.footyStatsData.Wyjazd);

                // Pobieramy wagi z panelu ustawień
                const wPNM = parseFloat(document.getElementById('weight-pnm').value) || 0.3;
                const wProb = parseFloat(document.getElementById('weight-prob').value) || 0.3;
                const wTable = parseFloat(document.getElementById('weight-table').value) || 0.15;
                const wNoGoal = parseFloat(document.getElementById('weight-nogoal').value) || 0.15;
                const wAvg = parseFloat(document.getElementById('weight-avg').value) || 0.10;

                // Normalizacje:
                const normalizedHomePNM = homePNM / 3;
                const normalizedAwayPNM = awayPNM / 3;
                const normalizedHomeProb = homeProb; // już 0-1
                const normalizedAwayProb = awayProb;
                const normalizedHomeAvg = homeAvg / 2; // przyjmujemy 2 jako maksymalną wartość
                const normalizedAwayAvg = awayAvg / 2;

                // Obliczamy kompozyt jako suma ważona
                const homeComposite = (wPNM * normalizedHomePNM) + (wProb * normalizedHomeProb) +
                      (wTable * homeTableFactor) + (wNoGoal * homeNoGoal) +
                      (wAvg * normalizedHomeAvg);
                const awayComposite = (wPNM * normalizedAwayPNM) + (wProb * normalizedAwayProb) +
                      (wTable * awayTableFactor) + (wNoGoal * awayNoGoal) +
                      (wAvg * normalizedAwayAvg);

                let option0, option1;
                if (homeComposite >= awayComposite) {
                    option0 = { team: homeTeamName, composite: homeComposite, probDisplay: (homeComposite * 100).toFixed(2) };
                    option1 = { team: awayTeamName, composite: awayComposite, probDisplay: (awayComposite * 100).toFixed(2) };
                } else {
                    option0 = { team: awayTeamName, composite: awayComposite, probDisplay: (awayComposite * 100).toFixed(2) };
                    option1 = { team: homeTeamName, composite: homeComposite, probDisplay: (homeComposite * 100).toFixed(2) };
                }
                matches.push({
                    eventEl,
                    homeTeam: homeTeamName,
                    awayTeam: awayTeamName,
                    picks: [option0, option1]
                });

            } else { // Tryb "mecz"
                const homeProbAll = getTeamProbability(homeKey, window.footyStatsData && window.footyStatsData.All);
                const awayProbAll = getTeamProbability(awayKey, window.footyStatsData && window.footyStatsData.All);
                const avgProb = ((homeProbAll / 100) + (awayProbAll / 100)) / 2;
                matches.push({
                    eventEl,
                    homeTeam: homeTeamName,
                    awayTeam: awayTeamName,
                    picks: [
                        { team: "Gole", prob: avgProb, probDisplay: (avgProb * 100).toFixed(2) }
                    ]
                });
            }
        });
        return matches;
    }

    // Zapisywanie / wczytywanie kuponów
    function saveCoupons(coupons) {
        GM_setValue("coupons", JSON.stringify(coupons));
    }
    function loadCoupons() {
        const saved = GM_getValue("coupons", null);
        return saved ? JSON.parse(saved) : [];
    }

    // Zapisywanie / wczytywanie filteredMatches
    function saveFilteredMatches(matches) {
        GM_setValue("filteredMatches", JSON.stringify(matches));
    }
    function loadFilteredMatches() {
        const saved = GM_getValue("filteredMatches", null);
        return saved ? JSON.parse(saved) : [];
    }

    function updateCouponsWithCurrentMatches(coupons) {
        const currentMatches = prepareMatches();
        window.filteredMatches = currentMatches;
        console.log("Aktualne mecze (updateCouponsWithCurrentMatches):",
                    currentMatches.map(m => simpleNormalize(m.homeTeam) + " vs " + simpleNormalize(m.awayTeam)));
        coupons.forEach(coupon => {
            coupon.picks.forEach(pick => {
                const key = pick.matchKey;
                const match = currentMatches.find(m => (simpleNormalize(m.homeTeam) + " vs " + simpleNormalize(m.awayTeam)) === key);
                if (match) {
                    pick.matchIndex = currentMatches.indexOf(match);
                    console.log("Zaktualizowano pick dla klucza:", pick.matchKey, "->", pick.matchIndex);
                } else {
                    console.warn("Nie znaleziono meczu dla pick:", pick);
                    pick.matchIndex = -1;
                }
            });
        });
    }

    /****************** CZĘŚĆ 3: Scrollowanie ******************/
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function scrollAndFind(selector, textMatch, maxAttempts = 50, delay = 500) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                window.scrollBy(0, 300);
                const elements = document.querySelectorAll(selector);
                const found = Array.from(elements).find(el => el.innerText && el.innerText.includes(textMatch));
                if (found) {
                    clearInterval(interval);
                    resolve(found);
                }
                if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    reject(new Error("Nie znaleziono elementu: " + selector + " z tekstem: " + textMatch));
                }
            }, delay);
        });
    }

    /****************** CZĘŚĆ 4: Akcje dla meczu i finalizacja kuponu ******************/
    const ACTION_DELAY = 2000;
    function normalizeTeamName(name) {
        return name.toLowerCase().trim().replace(/\s+/g, '').replace(/fc$/i, '');
    }

    async function processMatchAction(match, chosenTeam) {
        if (!match.eventEl || !match.eventEl.children || match.eventEl.children.length === 0) {
            console.warn("Brak elementu meczu w DOM dla:", match.homeTeam, "vs", match.awayTeam);
            return;
        }
        console.log("processMatchAction: Rozpoczynam akcję dla meczu:", match.homeTeam, "vs", match.awayTeam);
        await sleep(ACTION_DELAY);
        match.eventEl.children[0].click();
        console.log("Kliknięto mecz (rozwiniecie)");
        await sleep(3000);

        let marketEl;
        if (selectedMode === "druzyna") {
            try {
                marketEl = await scrollAndFind('.event-grid__expanded-market', "1. połowa - Liczba goli drużyny");
                marketEl.children[0].children[0].click();
                console.log("Kliknięto rynek '1. połowa - Liczba goli drużyny'");
            } catch (error) {
                console.error(error);
                updateGlobalStatus("Błąd przy wyszukiwaniu rynku: " + error.message, "error");
                return;
            }
            await sleep(ACTION_DELAY);

            let marketCard = document.querySelector('.market-layout-card__market');
            if (marketCard) {
                let container = marketCard.querySelector('.market-layout-card__teams-container');
                if (container) {
                    const expected = normalizeTeamName(chosenTeam);
                    let foundButton = null;
                    for (let child of container.children) {
                        const norm = normalizeTeamName(child.textContent);
                        if (norm === expected || norm.includes(expected)) {
                            foundButton = child;
                            break;
                        }
                    }
                    if (foundButton) {
                        foundButton.click();
                        console.log("Kliknięto drużynę:", chosenTeam);
                    } else {
                        console.warn("Nie znaleziono przycisku dla drużyny:", chosenTeam);
                    }
                } else {
                    console.warn("Nie znaleziono kontenera drużyn w karcie rynku");
                }
            } else {
                console.warn("Nie znaleziono karty rynku");
            }

        } else {
            // Tryb "mecz"
            try {
                marketEl = await scrollAndFind('.event-grid__expanded-market', "1.połowa - liczba goli");
                marketEl.children[0].children[0].click();
                console.log("Znaleziono rynek '1.połowa - liczba goli'");
            } catch (error) {
                console.error(error);
                updateGlobalStatus("Błąd przy wyszukiwaniu rynku (mecz): " + error.message, "error");
                return;
            }
        }
        await sleep(ACTION_DELAY);

        // Kliknięcie na 2. odd
        let rows = document.querySelectorAll('.market-layout-card__row');
        if (rows.length >= 2) {
            let row = rows[0];
            let oddContainers = row.querySelectorAll('.market-layout-card__odd-container');
            if (oddContainers && oddContainers.length >= 2) {
                oddContainers[1].children[0].children[0].click();
                console.log("Kliknięto drugi przycisk z oddami (np. over 0.5)");
            } else {
                console.warn("Brak drugiego przycisku z oddami w tym rynku");
            }
        } else {
            console.warn("Brak wystarczającej liczby wierszy w karcie rynku");
        }
        await sleep(ACTION_DELAY);
    }

    async function finalizeCoupon() {
        await sleep(ACTION_DELAY);
        const stakeBtn = document.querySelector('.sds-button.sds-focus.stake-button.e2e-betslip-submit.sds-button--lg.sds-button--primary-elevation');
        if (stakeBtn) {
            stakeBtn.click();
            console.log("Kliknięto przycisk zakładu (stakeBtn)");
        }
        await sleep(ACTION_DELAY);

        const visibleBtn = document.querySelector('.sds-toggle-switch.sds-focus.modal-control__input.sds-toggle-switch--md.sds-toggle-switch--active');
        if (visibleBtn) {
            visibleBtn.click();
            console.log("Kliknięto przycisk NIE POKAZUJ");
        }
        await sleep(ACTION_DELAY);

        const confirmBtn = document.querySelector('.sds-button.sds-focus.e2e-confirm-placemenet-btn.sds-button--lg.sds-button--primary-elevation');
        if (confirmBtn) {
            confirmBtn.click();
            console.log("Kliknięto przycisk potwierdzenia");
        }
        await sleep(ACTION_DELAY);

        let ligaLink = document.querySelector('nav.sds-breadcrumbs a[href*="anglia/league-two/wszystko"]');
        if (ligaLink) {
            ligaLink.click();
            console.log("Powrót do listy meczów (kliknięto 4-liga)");
            await sleep(ACTION_DELAY);
        } else {
            console.warn("Nie znaleziono linku do 4-ligi");
        }
    }

    async function performCombinationAction(combination, callback, skipNavigation = true) {
        const originalMode = selectedMode;
        if (combination.mode) {
            selectedMode = combination.mode;
        }

        const picks = combination.picks;
        console.log("Rozpoczynam wykonywanie kuponu. Picks:", picks);
        updateGlobalStatus(`Wykonuję kupon ID ${combination.id}...`, "info");

        const currentMatches = prepareMatches();
        window.filteredMatches = currentMatches;
        console.log("Aktualne dostępne mecze (performCombinationAction):",
                    currentMatches.map(m => simpleNormalize(m.homeTeam) + " vs " + simpleNormalize(m.awayTeam)));

        for (let i = 0; i < picks.length; i++) {
            const pick = picks[i];
            const key = pick.matchKey;
            const match = currentMatches.find(m =>
                                              (simpleNormalize(m.homeTeam) + " vs " + simpleNormalize(m.awayTeam)) === key
                                             );
            if (match) {
                console.log(`Wykonuję pick ${i+1}/${picks.length}:`, pick);
                await processMatchAction(match, pick.pick);
                await sleep(10);
                if (skipNavigation) {
                    let ligaLink = document.querySelector('nav.sds-breadcrumbs a[href*="anglia/league-two/wszystko"]');
                    if (ligaLink) {
                        ligaLink.click();
                        console.log(`Powrót do listy meczów po meczu ${i+1}`);
                        await sleep(ACTION_DELAY);
                    } else {
                        console.warn("Nie znaleziono linku do 4-ligi");
                    }
                } else {
                    // Pomijamy klikanie – tylko odczekujemy ACTION_DELAY
                    await sleep(ACTION_DELAY);
                }
            } else {
                console.warn("Nie znaleziono meczu dla pick:", pick);
                console.warn("Oczekiwany klucz:", key,
                             "Dostępne klucze:", currentMatches.map(m => simpleNormalize(m.homeTeam) + " vs " + simpleNormalize(m.awayTeam)));
            }
        }
        await finalizeCoupon();
        combination.executed = true;
        savedCoupons = savedCoupons.map(c => (c.id === combination.id ? combination : c));
        saveCoupons(savedCoupons);
        displayCoupons(savedCoupons);
        updateGlobalStatus(`Kupon ID ${combination.id} wykonany.`, "success");
        await sleep(100);
        selectedMode = originalMode;
        if (callback) callback();
    }

    /****************** CZĘŚĆ 5: Dodawanie przycisków akcji do meczów ******************/
    function addMatchActionButtons() {
        const matches = prepareMatches();
        matches.forEach(match => {
            if (match.eventEl && match.eventEl.querySelector('.custom-match-action-btn')) {
                return;
            }
            const btn = document.createElement('button');
            btn.textContent = "Akcja meczu";
            btn.className = "custom-match-action-btn";
            btn.style.marginLeft = "5px";
            btn.style.fontSize = "90%";
            btn.title = "Kliknij, aby wykonać akcję dla tego meczu (symulacja kliknięć użytkownika)";
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                processMatchAction(match, match.picks[0].team);
            });
            if (match.eventEl) {
                match.eventEl.appendChild(btn);
            }
        });
    }

    /****************** CZĘŚĆ 6: Panel ustawień i interfejs użytkownika ******************/
    let settingsPanel, generateBtn, resultsContainer;

    function createSettingsPanel() {
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'combo-settings-panel';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.top = '10px';
        settingsPanel.style.left = '10px';
        settingsPanel.style.backgroundColor = '#f8f8f8';
        settingsPanel.style.border = '1px solid #ccc';
        settingsPanel.style.padding = '10px';
        settingsPanel.style.zIndex = 10000;
        settingsPanel.style.maxWidth = '350px';

        // Przycisk "Pokaż/Ukryj ustawienia"
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = "Ukryj ustawienia";
        toggleBtn.style.marginBottom = "5px";
        toggleBtn.style.display = "block";
        toggleBtn.title = "Kliknij, aby schować lub pokazać panel ustawień";
        toggleBtn.addEventListener('click', () => {
            const container = document.getElementById('settings-container');
            if (container.style.display === 'none') {
                container.style.display = 'block';
                toggleBtn.textContent = "Ukryj ustawienia";
            } else {
                container.style.display = 'none';
                toggleBtn.textContent = "Pokaż ustawienia";
            }
        });

        // Kontener ustawień
        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'settings-container';
        settingsContainer.innerHTML = `
          <fieldset style="margin-bottom:5px;">
            <legend>Filtracja meczy</legend>
            <label title="Minimalna szansa (w %). Mecze o szansie poniżej tej wartości nie są brane pod uwagę. Zalecane: 30%.">
              <strong>Min. szansa (%):</strong> <input type="number" id="min-prob-threshold" value="30" min="0" max="100" step="1">
            </label><br>
            <label title="Maksymalna liczba meczy – ta wartość jest ustawiana automatycznie na liczbę dostępnych meczy.">
              <strong>Maks. meczy:</strong> <input type="number" id="max-matches" value="0" min="1" step="1" readonly>
            </label>
          </fieldset>
          <fieldset style="margin-bottom:5px;">
            <legend>Generowanie kuponów</legend>
            <label title="Liczba kuponów do wygenerowania. Każdy kupon to inny zestaw meczy.">
              <strong>Liczba kuponów:</strong> <input type="number" id="num-combinations" value="10" min="1" step="1">
            </label><br>
            <label title="Minimalna liczba meczy w każdym kuponie. Kupony mogą mieć różną liczbę meczy – od tej wartości do maksymalnej liczby meczy po filtracji.">
              <strong>Min. meczy w kuponie:</strong> <input type="number" id="min-matches" value="7" min="1" step="1">
            </label><br>
            <label title="Liczba Greedy kuponów – kupony zachłanne, w których użyte są wszystkie dostępne mecze wg rankingu statystyk.">
              <strong>Liczba Greedy kuponów:</strong> <input type="number" id="num-greedy" value="5" min="0" step="1">
            </label>
          </fieldset>
          <fieldset style="margin-bottom:5px;">
            <legend>Parametry statystyk (wagi – suma musi wynosić 1.0)</legend>
            <label title="Waga PNM (1 Poł.) – wskaźnik siły drużyny. Im wyższa wartość, tym większy wpływ tej statystyki.">
              <strong>Waga PNM:</strong> <input type="number" id="weight-pnm" value="0.30" step="0.01" min="0" max="1">
            </label><br>
            <label title="Waga 0.5+ – procent meczy, w których drużyna zdobyła gola w pierwszej połowie.">
              <strong>Waga 0.5+:</strong> <input type="number" id="weight-prob" value="0.30" step="0.01" min="0" max="1">
            </label><br>
            <label title="Waga pozycji – pozycja w tabeli.">
              <strong>Waga pozycji:</strong> <input type="number" id="weight-table" value="0.15" step="0.01" min="0" max="1">
            </label><br>
            <label title="Waga Brak Zdobytych Pkt (odwrócona) – im niższy wskaźnik, tym lepiej.">
              <strong>Waga Brak Zdobytych Pkt:</strong> <input type="number" id="weight-nogoal" value="0.15" step="0.01" min="0" max="1">
            </label><br>
            <label title="Waga Śr. – średnia liczba goli w 1. połowie, normalizowana (maks. 2.0).">
              <strong>Waga Śr.:</strong> <input type="number" id="weight-avg" value="0.10" step="0.01" min="0" max="1">
            </label>
          </fieldset>
          <fieldset style="margin-bottom:5px;">
            <legend>Tryb</legend>
            <label title="Wybierz tryb: 'Drużyna' – statystyki dla poszczególnych drużyn, 'Mecz' – średnia statystyk obu drużyn.">
              <input type="checkbox" id="mode-switch"> Tryb: Mecz (zaznacz) / Drużyna (odznacz)
            </label>
          </fieldset>`;

        // Przycisk wczytywania zapisanych kuponów
        const loadBtn = document.createElement('button');
        loadBtn.id = 'load-coupons-btn';
        loadBtn.textContent = "Wczytaj zapisane kupony";
        loadBtn.title = "Kliknij, aby wczytać zapisane wcześniej kupony i kontynuować ich wykonywanie";
        loadBtn.style.marginTop = "5px";
        loadBtn.addEventListener('click', () => {
            const loaded = loadCoupons();
            if (loaded.length === 0) {
                alert("Brak zapisanych kuponów.");
            } else {
                updateCouponsWithCurrentMatches(loaded);
                // UWAGA: Usunięto resetowanie statusu executed!
                // loaded.forEach(c => { c.executed = false; });
                saveCoupons(loaded);
                savedCoupons = loaded;
                displayCoupons(savedCoupons);
                console.log("Wczytano kupony:", loaded);
            }
        });

        const resultsContainerDiv = document.createElement('div');
        resultsContainerDiv.id = 'results-container';
        resultsContainerDiv.style.maxHeight = '60vh';
        resultsContainerDiv.style.overflowY = 'auto';
        resultsContainerDiv.style.fontSize = '90%';

        // Dodajemy globalny status – komunikaty o postępie akcji
        const globalStatusDiv = document.createElement('div');
        globalStatusDiv.id = 'global-status';
        globalStatusDiv.style.marginTop = '5px';
        globalStatusDiv.style.fontSize = '90%';

        const topPanel = document.createElement('div');
        topPanel.appendChild(toggleBtn);
        topPanel.appendChild(settingsContainer);

        const btnPanel = document.createElement('div');
        btnPanel.className = "btn-group";
        generateBtn = document.createElement('button');
        generateBtn.id = 'generate-combinations-btn';
        generateBtn.textContent = "Generuj Kupony";
        generateBtn.title = "Kliknij, aby wygenerować nowe kupony";
        btnPanel.appendChild(generateBtn);
        const refreshBtn = document.createElement('button');
        refreshBtn.id = 'refresh-data-btn';
        refreshBtn.textContent = "Odśwież dane";
        refreshBtn.title = "Kliknij, aby ponownie pobrać dane ze strony FootyStats";
        refreshBtn.style.marginLeft = "5px";
        btnPanel.appendChild(refreshBtn);
        const executeAllBtn = document.createElement('button');
        executeAllBtn.id = 'execute-all-combinations-btn';
        executeAllBtn.textContent = "Wykonaj wszystkie kupony";
        executeAllBtn.title = "Kliknij, aby wykonać wszystkie wygenerowane kupony";
        executeAllBtn.style.marginLeft = "5px";
        btnPanel.appendChild(executeAllBtn);
        btnPanel.appendChild(loadBtn);

        const infoDiv = document.createElement('div');
        infoDiv.id = 'settings-info';
        infoDiv.style.margin = "5px 0";
        infoDiv.style.fontSize = "90%";

        settingsPanel.innerHTML = `<h3>Kupony 0.5+</h3>`;
        settingsPanel.appendChild(topPanel);
        settingsPanel.appendChild(btnPanel);
        settingsPanel.appendChild(document.createElement('hr'));
        settingsPanel.appendChild(infoDiv);
        settingsPanel.appendChild(globalStatusDiv);
        settingsPanel.appendChild(resultsContainerDiv);
        resultsContainer = resultsContainerDiv;
        document.body.appendChild(settingsPanel);

        // Eventy
        document.getElementById('num-combinations').addEventListener('input', updateSettingsDisplay);
        document.getElementById('min-matches').addEventListener('input', updateSettingsDisplay);
        document.getElementById('min-prob-threshold').addEventListener('input', updateSettingsDisplay);
        document.getElementById('max-matches').addEventListener('input', updateSettingsDisplay);
        generateBtn.addEventListener('click', onGenerateClick);
        executeAllBtn.addEventListener('click', executeAllCombinations);
        refreshBtn.addEventListener('click', () => {
            window.footyStatsData = null;
            fetchTablePage();
            generateBtn.disabled = true;
            document.getElementById('settings-info').textContent = "Pobieram dane z footystats.org...";
        });
        const modeSwitch = document.getElementById('mode-switch');
        modeSwitch.addEventListener('change', () => {
            selectedMode = modeSwitch.checked ? "mecz" : "druzyna";
            updateSettingsDisplay();
        });
        document.getElementById('weight-pnm').addEventListener('change', function() {
            enforceWeightSum('weight-pnm');
            updateSettingsDisplay();
        });
        document.getElementById('weight-prob').addEventListener('change', function() {
            enforceWeightSum('weight-prob');
            updateSettingsDisplay();
        });
        document.getElementById('weight-table').addEventListener('change', function() {
            enforceWeightSum('weight-table');
            updateSettingsDisplay();
        });
        document.getElementById('weight-nogoal').addEventListener('change', function() {
            enforceWeightSum('weight-nogoal');
            updateSettingsDisplay();
        });
        document.getElementById('weight-avg').addEventListener('change', function() {
            enforceWeightSum('weight-avg');
            updateSettingsDisplay();
        });
    }

    function enforceWeightSum(changedId) {
        const weightIds = ['weight-pnm', 'weight-prob', 'weight-table', 'weight-nogoal', 'weight-avg'];
        let total = weightIds.reduce((sum, id) => {
            return sum + (parseFloat(document.getElementById(id).value) || 0);
        }, 0);
        if (total > 1) {
            let excess = total - 1;
            let adjustableIds = weightIds.filter(id => id !== changedId);
            let adjustableSum = adjustableIds.reduce((sum, id) => {
                return sum + (parseFloat(document.getElementById(id).value) || 0);
            }, 0);
            if (adjustableSum > 0) {
                adjustableIds.forEach(id => {
                    let current = parseFloat(document.getElementById(id).value) || 0;
                    let newVal = current - (current / adjustableSum) * excess;
                    document.getElementById(id).value = newVal.toFixed(2);
                });
            }
        }
    }

    function updateSettingsDisplay() {
        const totalMatches = document.querySelectorAll('.single-event').length;
        document.getElementById('max-matches').value = totalMatches;
        const threshold = parseFloat(document.getElementById('min-prob-threshold').value) || 0;
        const maxMatches = parseInt(document.getElementById('max-matches').value) || totalMatches;

        let allMatches = prepareMatches();
        allMatches = allMatches.map((match, index) => { match.index = index; return match; });

        let filtered = allMatches.filter(match => parseFloat(match.picks[0].probDisplay) >= threshold);
        filtered.sort((a, b) =>
                      (b.picks[0].composite !== undefined ? b.picks[0].composite : b.picks[0].prob)
                      - (a.picks[0].composite !== undefined ? a.picks[0].composite : a.picks[0].prob)
                     );
        if (maxMatches > 0 && filtered.length > maxMatches) {
            filtered = filtered.slice(0, maxMatches);
        }
        window.filteredMatches = filtered;
        saveFilteredMatches(filtered);

        const totalProb = filtered.reduce((acc, match) => {
            const v = (match.picks[0].composite !== undefined ? match.picks[0].composite : match.picks[0].prob);
            return acc * v;
        }, 1) * 100;
        document.getElementById('settings-info').textContent = `Mecze po filtracji: ${filtered.length}. ` +
            `Łączna szansa (best pick – iloczyn szans) wynosi ${totalProb.toFixed(2)}%. ` +
            `(Przy wielu meczach wynik może być poniżej 1%.)`;
        generateBtn.disabled = !(window.footyStatsData && filtered.length > 0);
    }

    // Funkcja aktualizująca globalny status w panelu
    function updateGlobalStatus(message, type) {
        const globalStatusDiv = document.getElementById('global-status');
        if (globalStatusDiv) {
            globalStatusDiv.textContent = message;
            if (type === "error") {
                globalStatusDiv.style.color = "red";
            } else if (type === "success") {
                globalStatusDiv.style.color = "green";
            } else {
                globalStatusDiv.style.color = "black";
            }
        }
    }

    // Tworzymy unikalny klucz meczu przy pomocy simpleNormalize
    function pickFromMatch(match, idx) {
        const val = (match.picks[0].composite !== undefined ? match.picks[0].composite : match.picks[0].prob);
        return {
            matchIndex: idx,
            matchKey: simpleNormalize(match.homeTeam) + " vs " + simpleNormalize(match.awayTeam),
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            pick: match.picks[0].team,
            prob: val,
            probDisplay: (val * 100).toFixed(2)
        };
    }

    async function generateMixedCombinationsAsync(matches, numCombinations, minMatches) {
        const sortedMatches = matches.slice().sort((a, b) => {
            const aVal = (a.picks[0].composite !== undefined ? a.picks[0].composite : a.picks[0].prob);
            const bVal = (b.picks[0].composite !== undefined ? b.picks[0].composite : b.picks[0].prob);
            return bVal - aVal;
        });

        const maxMatchesCount = sortedMatches.length;
        const combinations = [];
        const requestedGreedy = document.getElementById('num-greedy') ? parseInt(document.getElementById('num-greedy').value, 10) : 5;
        const pureGreedyThreshold = Math.min(requestedGreedy, numCombinations);
        const swapProbability = 0.3;

        // Generowanie pojedynczego kuponu – ulepszony algorytm:
        // Dla "greedy" kuponów bierzemy top wyniki z niewielką losowością,
        // dla pozostałych losujemy kupon używając Fisher–Yates.
        function generateOneCombination(i) {
            let comboSize;
            if (i < pureGreedyThreshold) {
                comboSize = maxMatchesCount;
            } else {
                comboSize = Math.floor(Math.random() * (maxMatchesCount - minMatches + 1)) + minMatches;
            }
            let selectedMatches;
            if (i < pureGreedyThreshold) {
                selectedMatches = sortedMatches.slice(0, comboSize);
                // Wprowadź niewielką losowość – zamień losowo kilka elementów
                for (let j = 0; j < selectedMatches.length; j++) {
                    if (Math.random() < swapProbability) {
                        const candidatePool = sortedMatches.slice(comboSize);
                        if (candidatePool.length > 0) {
                            const candidate = candidatePool[Math.floor(Math.random() * candidatePool.length)];
                            selectedMatches[j] = candidate;
                        }
                    }
                }
            } else {
                // Losowy wybór kuponu – użycie Fisher–Yates
                selectedMatches = sortedMatches.slice();
                for (let j = selectedMatches.length - 1; j > 0; j--) {
                    const k = Math.floor(Math.random() * (j + 1));
                    [selectedMatches[j], selectedMatches[k]] = [selectedMatches[k], selectedMatches[j]];
                }
                selectedMatches = selectedMatches.slice(0, comboSize);
            }
            couponIdCounter++;
            return {
                id: couponIdCounter,
                picks: selectedMatches.map((match, idx) => pickFromMatch(match, idx)),
                sumLog: selectedMatches.reduce((acc, match) => {
                    const val = (match.picks[0].composite !== undefined ? match.picks[0].composite : match.picks[0].prob);
                    return acc + Math.log(val);
                }, 0),
                executed: false,
                mode: selectedMode  // Zapisujemy tryb kuponu ("druzyna" lub "mecz")
            };
        }

        for (let i = 0; i < numCombinations; i++) {
            let attempts = 0;
            const maxAttempts = 30;
            let newCombo;
            do {
                newCombo = generateOneCombination(i);
                attempts++;
                let isDuplicate = combinations.some(existing => combosAreEqual(existing, newCombo));
                if (!isDuplicate) {
                    combinations.push(newCombo);
                    break;
                }
                if (attempts >= maxAttempts) {
                    console.warn(`Nie udało się wygenerować unikatowego kuponu po ${maxAttempts} próbach. Zwracam duplikat.`);
                    combinations.push(newCombo);
                    break;
                }
            } while (true);
        }

        combinations.sort((a, b) => b.sumLog - a.sumLog);
        return combinations;
    }

    function displayCoupons(coupons) {
        resultsContainer.innerHTML = '';
        if (coupons.length === 0) {
            resultsContainer.textContent = "Brak zapisanych kuponów.";
            return;
        }
        coupons.forEach((combo, idx) => {
            const comboDiv = document.createElement('div');
            comboDiv.className = "combination-item";
            comboDiv.style.marginBottom = '10px';
            comboDiv.style.border = '1px solid #ccc';
            comboDiv.style.padding = '5px';
            // Ustawienie atrybutu, aby później móc pobrać aktualny element
            comboDiv.setAttribute('data-coupon-id', combo.id);

            if (combo.executed) {
                comboDiv.classList.add('executed-coupon');
            } else {
                comboDiv.classList.add('pending-coupon');
            }

            comboDiv.innerHTML = `<strong>Kupon ${idx+1}</strong> – Łączny wynik: ${(Math.exp(combo.sumLog)*100).toFixed(2)}% ` +
                `(meczy: ${combo.picks.length}) <span class="coupon-status">` +
                (combo.executed ? "[WYKONANY]" : "[NIEWYKONANY]") +
                `</span><br>`;

            combo.picks.forEach((pick, i) => {
                const matchDiv = document.createElement('div');
                matchDiv.style.fontSize = '90%';
                matchDiv.textContent = `Mecz ${i+1}: ${pick.homeTeam} vs ${pick.awayTeam} – Wybrano: ${pick.pick} (${pick.probDisplay}%)`;
                comboDiv.appendChild(matchDiv);
            });

            const comboActionBtn = document.createElement('button');
            comboActionBtn.textContent = "Wykonaj akcję dla kuponu";
            comboActionBtn.title = "Kliknij, aby wykonać wszystkie akcje dla tego kuponu";
            comboActionBtn.style.fontSize = "90%";
            comboActionBtn.style.marginTop = "5px";
            if (combo.executed) {
                comboActionBtn.disabled = true;
            }
            comboActionBtn.addEventListener('click', async () => {
                if (combo.executed) return;
                // Aktualizujemy status kuponu
                comboDiv.classList.remove('pending-coupon', 'executed-coupon');
                comboDiv.classList.add('in-progress-coupon');
                const headerSpan = comboDiv.querySelector('.coupon-status');
                if (headerSpan) headerSpan.textContent = "[W TRAKCIE]";
                comboDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await new Promise(resolve => {
                    performCombinationAction(combo, resolve);
                });
                comboDiv.classList.remove('in-progress-coupon');
                comboDiv.classList.add('executed-coupon');
                if (headerSpan) headerSpan.textContent = "[WYKONANY]";
            });
            comboDiv.combinationData = combo;
            comboDiv.appendChild(comboActionBtn);
            resultsContainer.appendChild(comboDiv);
        });
    }


    async function onGenerateClick() {
        resultsContainer.innerHTML = '';
        const threshold = parseFloat(document.getElementById('min-prob-threshold').value) || 0;
        const maxMatches = parseInt(document.getElementById('max-matches').value) ||
              document.querySelectorAll('.single-event').length;

        let filtered = prepareMatches().filter(match => parseFloat(match.picks[0].probDisplay) >= threshold);
        filtered.sort((a, b) =>
                      (b.picks[0].composite !== undefined ? b.picks[0].composite : b.picks[0].prob)
                      - (a.picks[0].composite !== undefined ? a.picks[0].composite : a.picks[0].prob)
                     );
        if (maxMatches > 0 && filtered.length > maxMatches) {
            filtered = filtered.slice(0, maxMatches);
        }
        if (filtered.length === 0) {
            resultsContainer.textContent = "Brak meczów spełniających kryteria.";
            return;
        }
        window.filteredMatches = filtered;
        saveFilteredMatches(filtered);

        const numCombinations = parseInt(document.getElementById('num-combinations').value) || 10;
        const minMatchesInCombo = parseInt(document.getElementById('min-matches').value) || 7;

        const combos = await generateMixedCombinationsAsync(filtered, numCombinations, minMatchesInCombo);
        savedCoupons = combos;
        saveCoupons(savedCoupons);
        displayCoupons(savedCoupons);
    }

    // Modyfikacja funkcji wykonującej wszystkie kupony – pomijamy te już wykonane
    async function executeAllCombinations() {
        const resultsContainer = document.getElementById('results-container');
        // Pobieramy listę kuponów, które nie zostały jeszcze wykonane
        const pendingCoupons = savedCoupons.filter(c => !c.executed);
        for (let i = 0; i < pendingCoupons.length; i++) {
            updateGlobalStatus(`Wykonuję kupon ${i+1} z ${pendingCoupons.length}...`, "info");
            // Pobieramy aktualny element kuponu wg ID
            let couponElement = document.querySelector(`[data-coupon-id="${pendingCoupons[i].id}"]`);
            if (couponElement) {
                couponElement.classList.remove('pending-coupon', 'executed-coupon');
                couponElement.classList.add('in-progress-coupon');
                const headerSpan = couponElement.querySelector('.coupon-status');
                if (headerSpan) headerSpan.textContent = "[W TRAKCIE]";
                couponElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            await new Promise(resolve => {
                performCombinationAction(pendingCoupons[i], resolve);
            });
            // Po wykonaniu kuponu – pobieramy aktualny element i aktualizujemy status
            let updatedCouponElement = document.querySelector(`[data-coupon-id="${pendingCoupons[i].id}"]`);
            if (updatedCouponElement) {
                updatedCouponElement.classList.remove('in-progress-coupon');
                updatedCouponElement.classList.add('executed-coupon');
                const headerSpan = updatedCouponElement.querySelector('.coupon-status');
                if (headerSpan) headerSpan.textContent = "[WYKONANY]";
            }
            await sleep(1000);
        }
        updateGlobalStatus("Wszystkie kupony zostały dodane!", "success");
        alert("Wszystkie kupony zostały dodane!");
    }


    function enableSettingsPanel() {
        if (!document.getElementById('combo-settings-panel')) {
            createSettingsPanel();
        }
        setTimeout(updateSettingsDisplay, 3000);
        addMatchActionButtons();
    }

    if (window.footyStatsData) {
        enableSettingsPanel();
    }
    setInterval(addMatchActionButtons, 5000);

})();
