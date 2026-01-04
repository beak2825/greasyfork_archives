// ==UserScript==
// @name         Amazon KTW4 SSP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tabela wynikowa pozostałych paczek na trasie KTW4->KTW1
// @author       nowaratn
// @match        https://trans-logistics-eu.amazon.com/ssp/dock/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529674/Amazon%20KTW4%20SSP.user.js
// @updateURL https://update.greasyfork.org/scripts/529674/Amazon%20KTW4%20SSP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function initializeUI() {
        // Dodanie stylów CSS
        const styles = `
        .dock-data-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            max-height: 90vh;
            overflow-y: auto;
            min-width: 800px;
            font-size: 14px;
            color: #343a40;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            color: #212529;
            margin-bottom: 20px;
            text-align: center;
        }

        .toggle-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #6c757d;
            color: white;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }

        .toggle-button:hover {
            background: #5a6268;
        }

        .dock-data-table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            background: white;
        }

        .dock-data-table th, .dock-data-table td {
            border: 1px solid #dee2e6;
            padding: 12px 15px;
            text-align: left;
            font-size: 14px;
        }

        .dock-data-table th {
            background-color: #e9ecef;
            position: sticky;
            top: 0;
            font-weight: bold;
            font-size: 15px;
            color: #495057;
        }

        .dock-data-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        .dock-data-table tr:hover {
            background-color: #e9ecef;
            transition: background-color 0.2s;
        }

        .refresh-button {
            background-color: #28a745;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            margin: 15px 0;
            font-size: 14px;
            font-weight: bold;
            transition: background-color 0.2s;
        }

        .refresh-button:hover {
            background-color: #218838;
        }

        .last-update {
            font-size: 14px;
            color: #6c757d;
            margin: 15px 0;
            text-align: center;
        }

        hr {
            border: none;
            border-top: 1px solid #dee2e6;
            margin: 15px 0;
        }

        .hidden {
            display: none;
        }

         .countdown {
            font-size: 14px;
            color: #6c757d;
            margin: 5px 0;
            text-align: center;
        }
    `;


        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Utworzenie i dodanie kontenera UI
        const container = document.createElement('div');
        container.className = 'dock-data-container';
        document.body.appendChild(container);

        // Dodanie tytułu
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = 'Pozostałe paczki KTW4->KTW1';
        container.appendChild(title);

        // Dodanie przycisku toggle
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = '−';
        container.appendChild(toggleButton);

        // Element na tabelę
        const tableDiv = document.createElement('div');
        container.appendChild(tableDiv);

        // Element HR
        const tableHr = document.createElement('hr');
        container.appendChild(tableHr);

        // Element pokazujący czas ostatniej aktualizacji
        const lastUpdateDiv = document.createElement('div');
        lastUpdateDiv.className = 'last-update';
        container.appendChild(lastUpdateDiv);

        // Element HR
        const bottomHr = document.createElement('hr');
        container.appendChild(bottomHr);

        // Dodanie elementu dla odliczania
        const countdownDiv = document.createElement('div');
        countdownDiv.className = 'countdown';
        container.appendChild(countdownDiv);

        // Dodanie przycisku odświeżania
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.textContent = 'Odśwież dane';
        container.appendChild(refreshButton);

        // Logika przycisku toggle
        let isVisible = true;

        toggleButton.addEventListener('click', () => {
            isVisible = !isVisible;
            contentElements.forEach(el => {
                el.classList.toggle('hidden');
            });
            toggleButton.textContent = isVisible ? '−' : '+';
            container.style.padding = isVisible ? '25px' : '15px';
        });

        // Aktualizacja listy elementów do ukrywania
        const contentElements = [tableDiv, tableHr, lastUpdateDiv, bottomHr, refreshButton, countdownDiv];


        return { refreshButton, lastUpdateDiv, tableDiv, countdownDiv };
    }



    // Czekamy na pełne załadowanie strony
    function waitForPageLoad() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAndStart);
        } else {
            initializeAndStart();
        }
    }

    // Główna funkcja inicjalizująca
    function initializeAndStart() {
        setTimeout(() => {
            const ui = initializeUI();
            let countdown = 300; // 5 minut = 300 sekund

            // Funkcja aktualizująca licznik
            function updateCountdown() {
                const minutes = Math.floor(countdown / 60);
                const seconds = countdown % 60;
                ui.countdownDiv.textContent = `Następne odświeżenie za: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                countdown--;

                if (countdown < 0) {
                    countdown = 300; // Reset po odświeżeniu
                }
            }

            // Funkcja odświeżająca dane
            async function refreshData() {
                try {
                    const results = await fetchAndProcessData();
                    if (results && results.length > 0) {
                        ui.tableDiv.innerHTML = createTable(results);
                        updateLastUpdateTime(ui.lastUpdateDiv);
                        countdown = 300; // Reset licznika po odświeżeniu
                    }
                } catch (error) {
                    console.error('Error refreshing data:', error);
                }
            }

            // Uruchomienie licznika
            setInterval(updateCountdown, 1000); // Aktualizacja co sekundę

            // Obsługa kliknięcia przycisku
            ui.refreshButton.addEventListener('click', () => {
                refreshData();
                countdown = 300; // Reset licznika po manualnym odświeżeniu
            });

            // Automatyczne odświeżanie co 5 minut
            setInterval(refreshData, 5 * 60 * 1000);

            // Pierwsze pobranie danych
            refreshData();
            updateCountdown(); // Pierwsze wyświetlenie licznika
        }, 2000);
    }



    // Funkcja tworząca tabelę HTML
    function createTable(data) {
        return `
            <table class="dock-data-table">
                <thead>
                    <tr>
                        <th>Kierunek</th>
                        <th>CPT</th>
                        <th>Liczba paczek</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.route}</td>
                            <td>${row.criticalPullTime}</td>
                            <td>${row.inboundInTransitP}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // Rozpocznij proces
    waitForPageLoad();


    // Funkcja aktualizująca czas ostatniej aktualizacji
    function updateLastUpdateTime() {
        const now = new Date();
        document.getElementsByClassName('last-update')[0].textContent = `Ostatnia aktualizacja: ${now.toLocaleTimeString()}`;
    }


    // Tutaj pozostałe funkcje z poprzedniego skryptu (fetchDockData, fetchContainerData, fetchAndProcessData)
    async function fetchDockData() {
        // Get current time
        const now = new Date();

        // Calculate times
        const twoHoursAgo = new Date(now.getTime() - (2 * 60 * 60 * 1000));
        const eighteenHoursAhead = new Date(now.getTime() + (18 * 60 * 60 * 1000));

        // Convert to milliseconds timestamp
        const startDate = twoHoursAgo.getTime();
        const endDate = eighteenHoursAhead.getTime();

        try {
            const response = await fetch("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Priority": "u=0"
                },
                "referrer": "https://trans-logistics-eu.amazon.com/ssp/dock/ob?",
                "body": `entity=getOutboundDockView&nodeId=KTW1&startDate=${startDate}&endDate=${endDate}&loadCategories=outboundScheduled%2CoutboundInProgress%2CoutboundReadyToDepart%2CoutboundDeparted%2CoutboundCancelled&shippingPurposeType=NON-TRANSSHIPMENT%2CSHIP_WITH_AMAZON`,
                "method": "POST",
                "mode": "cors"
            });

            const data = await response.json();

            // Tablica na wszystkie załadunki
            const loads = [];

            // Sprawdzenie czy mamy dane i czy mamy aaData
            if (data && data.ret && data.ret.aaData) {
                // Iteracja przez wszystkie elementy i wyciągnięcie danych o załadunkach
                data.ret.aaData.forEach(item => {
                    if (item.load) {
                        loads.push(item.load);
                    }
                });
            }

            // Możesz zapisać dane do localStorage jeśli chcesz je zachować
            localStorage.setItem('dockLoads', JSON.stringify(loads));

            //console.log('Zapisane załadunki:', loads);
            return loads;

        } catch (error) {
            console.error('Error fetching dock data:', error);
        }
    }

    async function fetchContainerData(loadGroupIds) {
        try {
            const response = await fetch("https://trans-logistics-eu.amazon.com/ssp/dock/hrz/ob/fetchdata?", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                "referrer": "https://trans-logistics-eu.amazon.com/ssp/dock/ob?",
                "body": `entity=getContainerCountForCPT&loadGroupIds=${loadGroupIds.join('%2C')}&nodeId=KTW1`,
                "method": "POST",
                "mode": "cors"
            });

            return await response.json();
        } catch (error) {
            console.error('Error fetching container data:', error);
            return null;
        }
    }

    async function fetchAndProcessData() {
        try {
            const loads = await fetchDockData();
            const loadGroupIds = loads.map(load => load.loadGroupId);
            const containerData = await fetchContainerData(loadGroupIds);

            // Utworzenie mapy do przechowywania unikalnych kombinacji route/criticalPullTime
            const uniqueRouteData = new Map();

            // Przetwarzanie danych
            loads.forEach(load => {
                if(load.route.length > 10)
                {
                    const key = `${load.route}|${load.criticalPullTime}`;
                    if (!uniqueRouteData.has(key)) {
                        const containerInfo = containerData.ret.cptContainerCountMap[load.loadGroupId];
                        const inboundInTransitP = containerInfo ? containerInfo.inboundInTransit.P : 0;

                        // Dodaj tylko jeśli inboundInTransitP > 0
                        if (inboundInTransitP > 0) {
                            uniqueRouteData.set(key, {
                                route: load.route,
                                criticalPullTime: load.criticalPullTime,
                                inboundInTransitP: inboundInTransitP
                            });
                        }
                    }
                }
            });

            // Konwersja do tablicy i sortowanie po criticalPullTime
            const results = Array.from(uniqueRouteData.values())
            .sort((a, b) => {
                const dateA = new Date(a.criticalPullTime);
                const dateB = new Date(b.criticalPullTime);
                return dateA - dateB;
            });

            // Wyświetlenie wyników w konsoli w formie tabeli
            // console.table(results);

            // Zapisanie wyników do localStorage
            localStorage.setItem('routeData', JSON.stringify(results));

            return results;

        } catch (error) {
            console.error('Error processing data:', error);
        }
    }

    // Funkcja do pobrania zapisanych danych
    function getStoredRouteData() {
        const storedData = localStorage.getItem('routeData');
        return storedData ? JSON.parse(storedData) : [];
    }
})();

