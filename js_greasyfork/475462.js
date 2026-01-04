// ==UserScript==
// @name         Centrum Zarządzania Pracą (CZP)
// @namespace    http://tampermonkey.net/
// @version      3.75
// @description  Tworzy centrum zarządzania pracą (taski / off-taski / rejty)
// @author       @nowaratn
// @match        https://fclm-portal.amazon.com/?warehouseId=KTW1
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475462/Centrum%20Zarz%C4%85dzania%20Prac%C4%85%20%28CZP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/475462/Centrum%20Zarz%C4%85dzania%20Prac%C4%85%20%28CZP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastExecutionMinute = -1;
    let isAutoEnabled = false;
    // Najpierw sprawdź czy są zapisani pracownicy
    let autoBadges = JSON.parse(localStorage.getItem('autoBadges')) || [];

    var linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://fclm-portal.amazon.com/resources/styles/ganttChart.min.css,/styles/totPopup.min.css'; // ścieżka do pliku CSS
    document.head.appendChild(linkElement);

    const style = document.createElement('style');
    style.textContent += `
.highlighted-row {
    background-color: #ffeb3b !important;
}
.highlighted-text {
    background-color: #ffeb3b !important;
    font-weight: bold !important;
}
.sort-arrow {
    display: inline-block;
    margin-left: 5px;
    font-size: 0.8em;
    transition: opacity 0.2s;
}

th:hover .sort-arrow {
    opacity: 1 !important;
}

.loader-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .loader {
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #3498db;
        width: 20px;
        height: 20px;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
    document.head.appendChild(style);


    // Dodaj na początku skryptu lub w dowolnym miejscu przed końcem
    window.addEventListener('beforeunload', function(e) {
        // Sprawdź czy tabela pracowników istnieje i ma jakieś dane
        const pracownicyTable = document.getElementById('pracownicyTabela');
        if (pracownicyTable && pracownicyTable.rows.length > 1) { // > 1 bo pierwszy wiersz to nagłówek
            // Komunikat który zostanie wyświetlony
            e.preventDefault();
            e.returnValue = 'Masz załadowaną listę pracowników. Czy na pewno chcesz opuścić stronę?';
            return e.returnValue;
        }
    });


    // Dodanie głównego loadera
    const mainLoaderOverlay = document.createElement('div');
    mainLoaderOverlay.style.position = 'fixed';
    mainLoaderOverlay.style.top = '0';
    mainLoaderOverlay.style.left = '0';
    mainLoaderOverlay.style.width = '100%';
    mainLoaderOverlay.style.height = '100%';
    mainLoaderOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Półprzezroczyste tło
    mainLoaderOverlay.style.display = 'none';
    mainLoaderOverlay.style.justifyContent = 'center';
    mainLoaderOverlay.style.alignItems = 'center';
    mainLoaderOverlay.style.zIndex = '9999';

    const mainLoaderContainer = document.createElement('div');
    mainLoaderContainer.style.backgroundColor = 'white';
    mainLoaderContainer.style.padding = '20px';
    mainLoaderContainer.style.borderRadius = '5px';
    mainLoaderContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';

    const mainLoader = document.createElement('div');
    mainLoader.className = 'loader';
    mainLoaderContainer.appendChild(mainLoader);
    mainLoaderOverlay.appendChild(mainLoaderContainer);
    document.body.appendChild(mainLoaderOverlay);

    // Zmieniamy wysokość strony aby wszystko zmieścić
    document.documentElement.style.height = "3000px";

    var div = document.getElementById('pracownicy-div');
    if (!div) {
        div = document.createElement('div');
        div.id = 'pracownicy-div';
        div.style.position = 'fixed';
        div.style.zIndex = '999';
        div.style.height = '80%';
        div.style.top = '10%';
        div.style.backgroundColor = 'aliceblue'; // taki sam jak pracownicy_tabela_id
        div.style.border = '1px solid blue';
        div.style.left = '-380px'; // Dostosowane do nowej szerokości
        div.style.width = '350px'; // Węższa szerokość
        div.style.borderRadius = '0 8px 8px 0';
        div.style.boxShadow = '2px 0 5px rgba(0,0,0,0.2)';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.transition = 'left 0.3s ease';
        document.body.appendChild(div);

        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.flexDirection = 'column';
        contentContainer.style.padding = '10px';
        div.appendChild(contentContainer);


        // Tworzenie guziku "zamknij"
        var zamknij = document.createElement('button');
        zamknij.style = `
    position: absolute;
    right: 10px;
    top: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #666;
`;
        zamknij.innerText = 'X';
        zamknij.addEventListener('click', function() {
            // div.style.left = '-100%';
            // toggleArrowButton();
        });
        div.appendChild(zamknij);

        // Tworzenie napisu "Pracownicy"
        var title = document.createElement('div');
        title.style = `
    padding: 15px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    background-color: aliceblue;
    border-bottom: 1px solid #ccc;
    text-align: center;
`;
        title.innerText = 'Lista pracowników';
        div.appendChild(title);

        // Tworzenie textarea
        var textarea = document.createElement('textarea');
        textarea.id = "pracownicy";
        textarea.style = `
    width: 95%;
    height: 60%;
    margin: 10px auto;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    font-family: monospace;
    background-color: white;
`;
        textarea.addEventListener('input', obslugaZmiany);
        div.appendChild(textarea);


        const infoSection = document.createElement('div');
        infoSection.style = `
    margin: 10px 0;
    padding: 10px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

        const countInfo = document.createElement('div');
        countInfo.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
        <div>
            <span>Wpisanych: <b id="lista_ile">0</b></span>
            <span style="margin-left: 10px;">Znalezionych: <b id="lista_ileWczytano">0</b></span>
        </div>
    </div>
`;
        infoSection.appendChild(countInfo);

        // Sekcja na nieznalezionych pracowników
        const notFoundSection = document.createElement('div');
        notFoundSection.id = 'notFoundSection';
        notFoundSection.style = `
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ccc;
    display: none;
`;
        infoSection.appendChild(notFoundSection);

        contentContainer.appendChild(infoSection);


        // menu na dole textarea
        var bottomMenuDiv = document.createElement('div');
        bottomMenuDiv.style = `
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

        bottomMenuDiv.id = "bottomMenuDiv_id";


        var lista_ile = document.createElement('span');
        lista_ile.id = 'lista_ile';
        lista_ile.style.float = "left";
        lista_ile.style.paddingLeft = "5%";
        lista_ile.innerText = "0";

        var lista_ileWczytano = document.createElement('span');
        lista_ileWczytano.id = 'lista_ileWczytano';
        lista_ileWczytano.style.float = "right";
        lista_ileWczytano.style.paddingRight = "5%";
        lista_ileWczytano.innerText = "0";


        // Tworzenie guzika w div
        var innerButton = document.createElement('button');
        innerButton.innerText = 'Wczytaj';
        innerButton.addEventListener('click', wczytajListaPracownikow);

        bottomMenuDiv.appendChild(innerButton);

        // Po utworzeniu bottomMenuDiv
        // Po utworzeniu bottomMenuDiv
        const notFoundContainer = document.createElement('div');
        notFoundContainer.id = 'notFoundContainer';
        notFoundContainer.style = `
    margin-top: auto;
    padding: 10px;
    border-top: 1px solid #ccc;
    max-height: 100px;
    overflow: hidden;
    font-size: 12px;
    background-color: #fff5f5;
    position: relative;
    display: none; // Dodane ukrycie kontenera
`;

        const scrollableContainer = document.createElement('div');
        scrollableContainer.style = `
    max-height: 80px;
    overflow-y: auto;
    padding-right: 10px;
    margin-right: -10px;
    width: 100%;
`;

        const notFoundList = document.createElement('div');
        notFoundList.id = 'notFoundList';

        notFoundContainer.appendChild(scrollableContainer);
        div.appendChild(contentContainer);
        div.appendChild(notFoundContainer);
        div.appendChild(bottomMenuDiv);

    }


    // textarea pracownicy onChange
    function obslugaZmiany()
    {
        var linijki = textarea.value.split('\n');
        // Usuń puste linijki
        var iloscLinijek = linijki.filter(function (linijka) {
            return linijka.trim() !== '';
        }).length;

        // Aktualizuj zawartość span z ilością linijek
        document.getElementById('lista_ile').textContent = iloscLinijek;
    }

    var button = document.createElement('button');
    button.innerText = '>';
    button.id = 'Pracownicy_wysuń_id';
    button.style.position = 'fixed';
    button.style.top = '50%';
    button.style.left = '10px';
    button.style.height = '20%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.zIndex = '1000'; // Dodaj z-index
    document.body.appendChild(button);

    button.addEventListener('click', function() {
        const div = document.getElementById('pracownicy-div');
        if (!div) return;

        if (div.style.left === '-380px') {
            div.style.left = '20px';
            this.innerText = '<';
        } else {
            div.style.left = '-380px';
            this.innerText = '>';
        }
    });

    function toggleArrowButton() {
        if (div.style.left === '-100%') {
            button.innerText = '>';
        } else {
            button.innerText = '<';
        }
    }

    function updateNotFoundList(notFoundEmployees) {
        const notFoundContainer = document.getElementById('notFoundContainer');
        if (!notFoundContainer) return;

        // Sprawdź czy lista jest pusta lub undefined
        if (!notFoundEmployees || notFoundEmployees.length === 0) {
            notFoundContainer.style.display = 'none';
            return;
        }

        notFoundContainer.style.display = 'block';
        notFoundContainer.innerHTML = `
        <div style="padding: 10px; background-color: #fff5f5; border: 1px solid #dc3545; border-radius: 4px;">
            <div style="color: #dc3545; font-weight: bold; margin-bottom: 5px;">
                Nie znaleziono pracowników (${notFoundEmployees.length}):
            </div>
            <div style="max-height: 100px; overflow-y: auto; font-size: 12px;">
                ${notFoundEmployees.map(emp => `
                    <div style="margin: 2px 0; padding: 2px 5px;">
                        ${emp}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    }


    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translateX(-50%)';
        errorDiv.style.backgroundColor = '#ffebee';
        errorDiv.style.color = '#c62828';
        errorDiv.style.padding = '10px 20px';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.fontFamily = 'Arial, sans-serif';
        errorDiv.style.fontSize = '14px';
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        // Automatyczne usuwanie komunikatu po 3 sekundach
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.5s ease';
            setTimeout(() => errorDiv.remove(), 500);
        }, 3000);
    }



    // // Funkcja do pobierania danych
    // async function fetchData(url) {
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //         throw new Error(`Błąd HTTP! Status: ${response.status}`);
    //     }
    //     const data = await response.text();
    //     return data;
    // }

    // Funkcja do parsowania CSV
    function parseCSV(csvData) {
        const rows = csvData.split("\n").filter(row => row.trim() !== "");
        const csv_table = rows.map(row => row.split(","));
        const headers = csv_table[0];
        const dataRows = csv_table.slice(1);
        return { headers, dataRows };
    }

    // Funkcja do znajdowania wiersza po ID
    function findRowByID(headers, dataRows, id) {
        const index = headers.indexOf("LineItem Id");
        if (index === -1) {
            return null;
        }

        const row = dataRows.find(row => row[index] === id);
        if (row) {
            const rowObject = {};
            headers.forEach((header, idx) => {
                rowObject[header] = row[idx];
            });
            return rowObject;
        }
        return null;
    }


    var shiftLinks = [];

    async function createAllTables() {

        // loaderContainer.style.display = 'flex';

        if(document.getElementById('metricsContainer'))
        {
            document.getElementById('metricsContainer').remove();
        }


        // Generowanie linków godzinowych dla bieżącej zmiany
        const shiftLinks = generateHourlyShiftLinks();
        const totalLink = generateShiftString();

        // Sprawdzenie, czy linki zostały poprawnie wygenerowane
        if (shiftLinks.length === 0 || (shiftLinks.length === 1 && shiftLinks[0] === "Obecny czas nie mieści się w godzinach zmian")) {
            alert("Obecny czas nie mieści się w godzinach żadnej zmiany.");
            return;
        }

        // Bazowy URL
        const baseUrl = 'https://fclm-portal.amazon.com/reports/processPathRollup?reportFormat=CSV&warehouseId=KTW1';

        // IDs do znalezienia w CSV
        const idsToFind = [
            'ppr.detail.outbound.ship.shipDock',
            'ppr.detail.da.transferOut.transferOut',
            'ppr.detail.da.transferOutDock.transferOutDock'
        ];

        // Funkcja pomocnicza do ekstrakcji danych dla konkretnego ID
        const extractDataForId = (headers, dataRows, id) => {
            const foundRow = findRowByID(headers, dataRows, id);
            if (foundRow) {
                const planVariance = parseFloat(foundRow["Plan Variance (Hrs)"]) || 0;
                const actualRate = parseFloat(foundRow["Actual Rate"]) || 0;
                const percentToPlan = parseFloat(foundRow["% to Plan"]) || 0;
                return {
                    "Plan Variance (Hrs)": planVariance.toFixed(2),
                    "Actual Rate": actualRate.toFixed(2),
                    "% to Plan": (percentToPlan * 100).toFixed(2)
                };
            }
            return {
                "Plan Variance (Hrs)": "N/A",
                "Actual Rate": "N/A",
                "% to Plan": "N/A"
            };
        };

        // Pobieranie danych dla każdej godziny
        const fetchPromises = shiftLinks.map(async (shift) => {
            const fullUrl = baseUrl + shift.link;
            console.log(`Pobieranie danych z: ${fullUrl}`);

            try {
                const csvData = await fetchData(fullUrl);
                const { headers, dataRows } = parseCSV(csvData);

                const results = {};
                idsToFind.forEach(id => {
                    results[id] = {
                        ...extractDataForId(headers, dataRows, id),
                        link: shift.link,
                        start: new Date(shift.start),
                        end: new Date(shift.end)
                    };
                });
                return results;

            } catch (error) {
                console.error(`Błąd podczas pobierania danych z: ${fullUrl}`, error);
                const errorResult = {
                    link: shift.link,
                    start: new Date(shift.start),
                    end: new Date(shift.end),
                    "Plan Variance (Hrs)": "Error",
                    "Actual Rate": "Error",
                    "% to Plan": "Error"
                };
                return Object.fromEntries(idsToFind.map(id => [id, errorResult]));
            }
        });

        // Pobieranie danych dla całej zmiany
        const totalUrl = baseUrl + totalLink;
        let totalData = {};

        try {
            const csvData = await fetchData(totalUrl);
            const { headers, dataRows } = parseCSV(csvData);
            idsToFind.forEach(id => {
                totalData[id] = extractDataForId(headers, dataRows, id);
            });
        } catch (error) {
            console.error(`Błąd podczas pobierania danych z: ${totalUrl}`, error);
            totalData = Object.fromEntries(idsToFind.map(id => [id, {
                "Plan Variance (Hrs)": "Error",
                "Actual Rate": "Error",
                "% to Plan": "Error"
            }]));
        }

        // Przetwarzanie wyników
        const results = await Promise.all(fetchPromises);

        // Przygotowanie danych dla każdej tabeli
        const tableData = {};
        idsToFind.forEach(id => {
            tableData[id] = results.map(result => result[id]);
        });

        // Wywołanie funkcji tworzących tabele
        shipDockTable(tableData[idsToFind[0]], totalData[idsToFind[0]]);
        transferOutTable(tableData[idsToFind[1]], totalData[idsToFind[1]]);
        transferOutDockTable(tableData[idsToFind[2]], totalData[idsToFind[2]]);
        document.getElementById("header_shipdock_btn").disabled = false;
        // loaderContainer.style.display = 'none';
    }

    function createMetricsContainer() {

        // Sprawdź czy kontener już istnieje i usuń go
        const existingContainer = document.getElementById('metricsContainer');
        if (existingContainer) {
            existingContainer.remove();
        }

        const style = document.createElement('style');
        style.textContent = `
        #metricsContainer {
            display: inline-flex; /* Zmiana na inline-flex */
            flex-direction: column;
            margin-left: 10px; /* Odstęp od przycisku Rate */
        }
        .buttons-container {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }
        .tables-container {
            position: relative;
            margin-bottom: 10px;
        }
        .metrics-table {
            border-collapse: collapse;
            font-size: 12px;
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            background-color: white;
            width: max-content; /* Automatyczne dopasowanie szerokości */
        }

        .metrics-table.active {
            display: contents;
        }

        .time-link-td {
            background-color: cornsilk !important;
        }

        .metrics-table th, .metrics-table td {
            border: 1px solid #ddd;
            padding: 4px 8px;
            text-align: center;
            white-space: nowrap; /* Zapobiega zawijaniu tekstu */
            background-color: white !important;
        }
        .metrics-table th {
            background-color: #f4f4f4;
            text-align: left;
            width: 150px;
        }

        .toggle-button {
            padding: 5px 10px;
            border: 1px solid;
            border-radius: 15px;
            font-variant-caps: all-small-caps;
            font-family: Verdana;
            background-color: white;
            cursor: pointer;
        }
        .toggle-button.active {
            background-color: #007bff;
            color: white;
        }

        .positive {
    color: green !important;
}

.negative {
    color: red !important;
}

.highlighted-row {
    background-color: #ffeb3b !important;
}


    `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'metricsContainer';

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';

        const tablesContainer = document.createElement('div');
        tablesContainer.className = 'tables-container';

        container.appendChild(buttonsContainer);
        container.appendChild(tablesContainer);

        // Dodaj kontener obok przycisku Rate
        document.getElementById("header_shipdock_btn").after(container);
    }


    function createMetricsTable(tableData, totalData, containerId, tableTitle)
    {

        if (!document.getElementById('metricsContainer')) {
            createMetricsContainer();
        }

        const container = document.getElementById('metricsContainer');
        const buttonsContainer = container.querySelector('.buttons-container');
        const tablesContainer = container.querySelector('.tables-container');

        // Tworzenie przycisku
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = tableTitle;

        // Tworzenie tabeli
        const table = document.createElement('table');
        table.className = 'metrics-table';
        table.id = containerId;


        // Tworzenie wierszy dla każdej metryki
        const metrics = [
            { key: 'time', label: 'Godziny' },
            { key: 'Plan Variance (Hrs)', label: 'Plan Variance (Hrs)' },
            { key: 'Actual Rate', label: 'Actual Rate' },
            { key: '% to Plan', label: '% to Plan' }
        ];

        metrics.forEach(metric => {
            const row = document.createElement('tr');

            // Nagłówek wiersza
            const th = document.createElement('th');
            th.textContent = metric.label;
            row.appendChild(th);

            // Dane dla każdej godziny
            tableData.forEach(data => {
                const td = document.createElement('td');

                if (metric.key === 'time') {
                    const baseUrl = 'https://fclm-portal.amazon.com/reports/processPathRollup';
                    const timeLink = document.createElement('a');
                    timeLink.className = 'time-link';
                    timeLink.href = `${baseUrl}?${data.link.toString()}`; // Dodajemy pełny URL
                    timeLink.target = '_blank'; // Otwieranie w nowej karcie
                    timeLink.textContent = `${data.start.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} - ${data.end.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`;
                    timeLink.onclick = (e) => {
                        e.preventDefault();
                        const fullUrl = `${baseUrl}?${data.link.toString()}`;
                        window.open(fullUrl, '_blank');
                    };
                    td.appendChild(timeLink);
                    td.className = "time-link-td";
                } else {
                    td.textContent = data[metric.key];

                    // Dodanie kolorowania dla Plan Variance
                    if (metric.key === 'Plan Variance (Hrs)') {
                        const value = parseFloat(data[metric.key]);
                        if (!isNaN(value)) {
                            td.classList.add(value >= 0 ? 'positive' : 'negative');
                        }
                    }
                    // Dodanie kolorowania dla % to Plan
                    else if (metric.key === '% to Plan') {
                        const value = parseFloat(data[metric.key]);
                        if (!isNaN(value)) {
                            td.classList.add(value >= 100 ? 'positive' : 'negative');
                        }
                    }
                }
                row.appendChild(td);
            });


            // Kolumna TOTAL - również dodaj kolorowanie
            const totalCell = document.createElement('td');
            totalCell.className = 'total-column';
            if (metric.key === 'time') {
                totalCell.textContent = 'TOTAL';
            } else {
                totalCell.textContent = totalData[metric.key];

                // Kolorowanie dla Total Plan Variance
                if (metric.key === 'Plan Variance (Hrs)') {
                    const value = parseFloat(totalData[metric.key]);
                    if (!isNaN(value)) {
                        totalCell.classList.add(value >= 0 ? 'positive' : 'negative');
                    }
                }
                // Kolorowanie dla Total % to Plan
                else if (metric.key === '% to Plan') {
                    const value = parseFloat(totalData[metric.key]);
                    if (!isNaN(value)) {
                        totalCell.classList.add(value >= 100 ? 'positive' : 'negative');
                    }
                }
            }
            row.appendChild(totalCell);

            table.appendChild(row);
        });

        toggleButton.onclick = () => {
            const isCurrentlyActive = table.classList.contains('active');

            // Ukryj wszystkie tabele i zresetuj style przycisków
            document.querySelectorAll('.metrics-table').forEach(t => {
                t.classList.remove('active');
            });
            document.querySelectorAll('.toggle-button').forEach(b => {
                b.classList.remove('active');
            });

            // Jeśli tabela nie była aktywna, pokaż ją i aktywuj przycisk
            if (!isCurrentlyActive) {
                table.classList.add('active');
                toggleButton.classList.add('active');
            }
        };

        // Dodawanie elementów do kontenerów
        buttonsContainer.appendChild(toggleButton);
        tablesContainer.appendChild(table);
    }

    // Funkcje wrapper dla konkretnych tabel
    function shipDockTable(tableData, totalData) {
        createMetricsTable(tableData, totalData, 'shipDockContainer', 'Ship Dock Data');
    }

    function transferOutTable(tableData, totalData) {
        createMetricsTable(tableData, totalData, 'transferOutContainer', 'Transfer Out Data');
    }

    function transferOutDockTable(tableData, totalData) {
        createMetricsTable(tableData, totalData, 'transferOutDockContainer', 'Transfer Out Dock Data');
    }

    // Pomocnicza funkcja do formatowania daty
    function formatDate(date) {
        return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    }



    const selectedBadges = [];

    function trimTextarea() {
        const textarea = document.getElementById('pracownicy');
        if (textarea) {
            textarea.value = textarea.value
                .split('\n')
                .map(line => line.trim())
                .filter(line => line !== '')
                .join('\n');
        }
    }

    let isLoading = false;

    async function wczytajListaPracownikow() {
        mainLoaderOverlay.style.display = 'flex';

        if (isLoading) return;
        isLoading = true;

        try {
            trimTextarea();
            // Usunięcie poprzedniego wrapperDiv, jeśli istnieje
            const existingWrapperDiv = document.getElementById('pracownicy_tabela_id');
            if (existingWrapperDiv) {
                existingWrapperDiv.remove();
            }

            // Tworzenie nowego wrapperDiv
            const wrapperDiv = document.createElement('div');
            wrapperDiv.id = 'pracownicy_tabela_id';
            wrapperDiv.style.position = "absolute";
            wrapperDiv.style.width = '95%';
            wrapperDiv.style.backgroundColor = 'aliceblue';
            wrapperDiv.style.border = '1px solid blue';
            wrapperDiv.style.padding = '5px';
            wrapperDiv.style.top = '5%';
            wrapperDiv.style.left = '2%';
            wrapperDiv.style.zIndex = '99';
            wrapperDiv.style.display = "flex";
            wrapperDiv.style.flexDirection = "column"; // Układ kolumnowy

            // Tworzenie nagłówka z informacjami
            const header_nav = document.createElement('div');
            header_nav.id = 'pracownicy_tabela_header';
            header_nav.style.display = 'flex';
            header_nav.style.justifyContent = 'space-between';
            header_nav.style.alignItems = 'center';
            header_nav.style.width = '100%';
            header_nav.style.marginBottom = '10px';

            // Stwórz lewy kontener na przycisk Rates i loader
            const headerLeftButtons = document.createElement('div');
            headerLeftButtons.className = 'header-controls';
            headerLeftButtons.style.display = 'flex';
            headerLeftButtons.style.alignItems = 'center';
            headerLeftButtons.style.gap = '10px';

            // Tworzenie przycisku Rates
            const header_shipdock_btn = document.createElement('button');
            header_shipdock_btn.id = 'header_shipdock_btn';
            header_shipdock_btn.style = 'margin: 5px; padding: 5px 10px; border: 1px solid; border-radius: 15px; font-variant-caps: all-small-caps; font-family: Verdana;';
            header_shipdock_btn.textContent = 'Rates';
            header_shipdock_btn.label = 'Pobiera nowe dane (SHIP DOCK / TSO DOCK / TSO) i prezentuje je w formie tabeli';

            // Tworzenie loadera dla przycisku Rates
            const ratesLoader = document.createElement('div');
            ratesLoader.className = 'loader-container';
            ratesLoader.style.display = 'none';
            const ratesLoaderSpinner = document.createElement('div');
            ratesLoaderSpinner.className = 'loader';
            ratesLoader.appendChild(ratesLoaderSpinner);

            // Dodawanie przycisku i loadera do kontenera
            headerLeftButtons.appendChild(header_shipdock_btn);
            headerLeftButtons.appendChild(ratesLoader);

            header_shipdock_btn.addEventListener('click', async function() {
                this.disabled = true;
                ratesLoader.style.display = 'flex';
                try {
                    await createAllTables();
                } finally {
                    ratesLoader.style.display = 'none';
                    this.disabled = false;
                }
            });

            // Dodawanie kontenera do nagłówka
            header_nav.appendChild(headerLeftButtons);


            // Stwórz prawy kontener na przycisk Odśwież
            const headerRightButtons = document.createElement('div');
            headerRightButtons.style.display = 'flex';
            headerRightButtons.style.gap = '5px';

            // Tworzenie przycisku Odśwież
            const bottomMenu_odśwież = document.createElement('button');
            bottomMenu_odśwież.id = "bottomMenu_odśwież";
            bottomMenu_odśwież.textContent = "Odśwież";
            bottomMenu_odśwież.style = "margin:5px;padding:5px;padding-left:10px;padding-right:10px;border:1px solid;border-radius:15px;font-variant-caps:all-small-caps;font-family: Verdana;";
            bottomMenu_odśwież.addEventListener('click', function () {
                cleanupTaskDivs(); // Dodaj tę linię
                wczytajListaPracownikow();
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

            // Dodaj przycisk Odśwież do prawego kontenera
            headerRightButtons.appendChild(bottomMenu_odśwież);

            // Dodaj oba kontenery do header_nav
            header_nav.appendChild(headerLeftButtons);
            header_nav.appendChild(headerRightButtons);

            // Dodaj header_nav do wrapperDiv
            wrapperDiv.appendChild(header_nav);

            // Tworzenie kontenera dla dwóch tabel obok siebie
            const tablesContainer = document.createElement('div');
            tablesContainer.style.display = 'flex';
            tablesContainer.style.justifyContent = 'space-between';
            tablesContainer.style.width = '100%';
            tablesContainer.style.gap = '10px'; // Odstęp między tabelami

            // Tworzenie tabeli pracowników
            const employees = await getEmployees();
            const employeesTable = createTable(employees);
            employeesTable.id = 'pracownicyTabela';


            // Tworzenie tabeli wynikowej
            const wynikowaTabela = document.createElement('table');
            wynikowaTabela.id = 'wynikowaTabela';
            wynikowaTabela.style.width = '100%';
            wynikowaTabela.border = '1';
            wynikowaTabela.flex = '1 1 15%';
            wynikowaTabela.style.borderCollapse = 'collapse';
            // Nie zmieniamy stylów, zgodnie z prośbą
            wynikowaTabela.innerHTML = ""; // Placeholder

            tablesContainer.appendChild(employeesTable);
            tablesContainer.appendChild(wynikowaTabela);

            // Dodanie kontenera z tabelami do wrapperDiv
            wrapperDiv.appendChild(tablesContainer);

            // Tworzenie menu na dole
            // Tworzenie menu na dole
            const bottomMenu = document.createElement('div');
            bottomMenu.id = "bottomMenu_div";
            bottomMenu.style.marginTop = '10px';
            bottomMenu.style.display = 'flex';
            bottomMenu.style.justifyContent = 'space-between'; // Rozdziela elementy na przeciwne strony
            bottomMenu.style.alignItems = 'center';

            // Kontener na lewą stronę (przyciski usuwania i dropdown)
            const leftContainer = document.createElement('div');
            leftContainer.style.display = 'flex';
            leftContainer.style.alignItems = 'center';
            leftContainer.style.gap = '10px';

            // Etykieta "Usuń z listy:"
            const deleteLabel = document.createElement('span');
            deleteLabel.textContent = 'Usuń z listy:';
            deleteLabel.style.marginRight = '5px';

            // Przycisk usuwania zaznaczonych
            const bottomMenu_usun_pracownika = document.createElement('button');
            bottomMenu_usun_pracownika.id = "bottomMenu_usun";
            bottomMenu_usun_pracownika.textContent = "Usuń zaznaczone";
            bottomMenu_usun_pracownika.style = "margin:5px;padding:5px;padding-left:10px;padding-right:10px;border:1px solid;border-radius:15px;font-variant-caps:all-small-caps;font-family: Verdana;";
            bottomMenu_usun_pracownika.addEventListener('click', deleteEmployee);

            const dropdownContainer = document.createElement('div');
            dropdownContainer.style.display = 'flex';
            dropdownContainer.style.alignItems = 'center';
            dropdownContainer.style.gap = '10px';

            const mainTaskSelect = document.createElement('select');
            mainTaskSelect.id = 'mainTaskSelect';
            mainTaskSelect.style = "margin:5px;padding:5px;border:1px solid;border-radius:15px;font-family: Verdana;";

            const subTaskSelect = document.createElement('select');
            subTaskSelect.id = 'subTaskSelect';
            subTaskSelect.style = "margin:5px;padding:5px;border:1px solid;border-radius:15px;font-family: Verdana;";


            // Przycisk usuwania po tasku
            const deleteByTaskButton = document.createElement('button');
            deleteByTaskButton.textContent = "Usuń wg procesu";
            deleteByTaskButton.style = "margin:5px;padding:5px;padding-left:10px;padding-right:10px;border:1px solid;border-radius:15px;font-variant-caps:all-small-caps;font-family: Verdana;";
            deleteByTaskButton.addEventListener('click', deleteEmployeesByTask);

            // Przycisk Auto (prawa strona)
            const bottomMenu_auto = document.createElement('button');
            bottomMenu_auto.id = "bottomMenu_auto";
            bottomMenu_auto.textContent = "Auto: OFF";
            bottomMenu_auto.style = "margin:5px;padding:5px;padding-left:10px;padding-right:10px;border:1px solid;border-radius:15px;font-variant-caps:all-small-caps;font-family: Verdana;";

            // Składanie elementów
            leftContainer.appendChild(deleteLabel);
            leftContainer.appendChild(bottomMenu_usun_pracownika);

            // Dodajemy separator pionowy
            const separator = document.createElement('div');
            separator.style.height = '20px';
            separator.style.width = '1px';
            separator.style.backgroundColor = '#999';
            separator.style.margin = '0 10px';

            leftContainer.appendChild(separator);
            dropdownContainer.appendChild(mainTaskSelect);
            dropdownContainer.appendChild(subTaskSelect);
            leftContainer.appendChild(dropdownContainer);
            leftContainer.appendChild(deleteByTaskButton);

            // Dodawanie do głównego kontenera
            bottomMenu.appendChild(leftContainer);
            bottomMenu.appendChild(bottomMenu_auto);

            // Dodawanie do wrapper
            wrapperDiv.appendChild(bottomMenu);


            // Funkcja usuwania po tasku
            function deleteEmployeesByTask() {

                const mainTask = document.getElementById('mainTaskSelect').value;
                const subTask = document.getElementById('subTaskSelect').value;

                if (!mainTask && !subTask) return; // Jeśli nic nie wybrano

                const pracownicyTabela = document.getElementById('pracownicyTabela');
                const rows = pracownicyTabela.querySelectorAll('tr');
                const toDelete = [];

                rows.forEach(row => {
                    const currentTaskCell = row.querySelector('.czp_currenttask');
                    if (currentTaskCell) {
                        const taskParts = currentTaskCell.textContent.trim().split('♦');
                        const rowMainTask = taskParts[0].trim();
                        const rowSubTask = taskParts[1]?.trim();

                        // Logika sprawdzania warunków
                        if (mainTask && subTask) {
                            // Jeśli wybrano oba
                            if (rowMainTask === mainTask && rowSubTask === subTask) {
                                toDelete.push(row);
                            }
                        } else if (mainTask) {
                            // Jeśli wybrano tylko główny proces
                            if (rowMainTask === mainTask) {
                                toDelete.push(row);
                            }
                        } else if (subTask) {
                            // Jeśli wybrano tylko podproces
                            if (rowSubTask === subTask) {
                                toDelete.push(row);
                            }
                        }
                    }
                });

                if (toDelete.length > 0) {
                    // Usuwanie znalezionych pracowników
                    toDelete.forEach(row => {
                        const loginCell = row.querySelector('.czp_kto');
                        const badgeCell = row.querySelector('.czp_badge');
                        const employeeIdCell = row.querySelector('.czp_employeeId');

                        // Aktualizacja textarea
                        const textarea = document.getElementById('pracownicy');
                        let content = textarea.value.split('\n');
                        content = content.filter(line => {
                            const trimmed = line.trim();
                            return !(
                                trimmed === loginCell?.textContent ||
                                trimmed === badgeCell?.textContent ||
                                trimmed === employeeIdCell?.textContent
                            );
                        });
                        textarea.value = content.join('\n');

                        // Usunięcie wiersza
                        row.remove();
                    });

                    // Aktualizacja licznika
                    const counter = document.getElementById('lista_ile');
                    if (counter) {
                        const newCount = document.getElementById('pracownicy').value.split('\n')
                        .filter(line => line.trim() !== '').length;
                        counter.textContent = newCount;
                    }

                    // Odśwież tabelę wynikową
                    tabelaWynikowa();

                    // Aktualizuj dropdown
                    setTimeout(() => {
                        updateTaskDropdowns();
                    }, 0);
                }
            }

            let isAutoEnabled = false;
            let intervalId = null;


            // Zmodyfikuj funkcję obsługi przycisku Auto
            bottomMenu_auto.addEventListener('click', function() {
                // Sprawdź czy są zaznaczone checkboxy
                const checkedRows = document.querySelectorAll('#pracownicyTabela input[type="checkbox"]:checked');

                if (checkedRows.length > 0) {
                    // Jeśli są zaznaczone checkboxy, dodaj/usuń pracowników z AUTO bez zmiany stanu przycisku
                    checkedRows.forEach(checkbox => {
                        const row = checkbox.closest('tr');
                        const badge = row.querySelector('.czp_badge');
                        const autoElement = row.querySelector('.czp_auto');

                        if (badge && autoElement) {
                            const badgeId = badge.textContent;
                            const isCurrentlyAuto = autoElement.textContent === 'TRUE';

                            if (isCurrentlyAuto) {
                                // Usuń z AUTO
                                const index = autoBadges.indexOf(badgeId);
                                if (index > -1) {
                                    autoBadges.splice(index, 1);
                                    autoElement.textContent = '';
                                }
                            } else {
                                // Dodaj do AUTO
                                if (!autoBadges.includes(badgeId)) {
                                    autoBadges.push(badgeId);
                                    autoElement.textContent = 'TRUE';
                                }
                            }
                        }
                        checkbox.checked = false; // Odznacz checkbox
                    });

                    // Zapisz zaktualizowaną listę
                    localStorage.setItem('autoBadges', JSON.stringify(autoBadges));
                } else {
                    // Jeśli nie ma zaznaczonych checkboxów, przełącz stan AUTO
                    isAutoEnabled = !isAutoEnabled;
                    localStorage.setItem('autoEnabled', isAutoEnabled);
                    bottomMenu_auto.textContent = isAutoEnabled ? "Auto: ON" : "Auto: OFF";

                    if (isAutoEnabled) {
                        startAutoRequests();
                    } else {
                        stopAutoRequests();
                    }
                }
            });

            // Dodaj sprawdzenie stanu przy inicjalizacji
            function initializeAutoState() {
                const savedState = localStorage.getItem('autoEnabled');
                if (savedState === 'true') {
                    isAutoEnabled = true;
                    bottomMenu_auto.textContent = "Auto: ON";
                    startAutoRequests();
                }
            }



            function startAutoRequests() {
                // Reset lastExecutionMinute przy starcie
                lastExecutionMinute = -1;

                // Initial check
                checkAndSendRequests();

                // Set interval to check every 30 seconds
                intervalId = setInterval(checkAndSendRequests, 30000); // Zmniejszone do 30 sekund dla większej precyzji
            }

            function stopAutoRequests() {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                    lastExecutionMinute = -1; // Reset przy zatrzymaniu
                }
            }

            function processRequests(badgeId) {
                console.log("Processing requests for badge:", badgeId);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Origin": "https://fcmenu-dub-regionalized.corp.amazon.com",
                        "Accept": "*/*"
                    },
                    data: 'warehouseId=KTW1&calmCode=OPSREGP&trackingBadgeId=' + badgeId,
                    withCredentials: true,
                    timeout: 5000,
                    onerror: function(response) {
                        console.error("Error in first request:", response);
                    },
                    onload: function(response) {
                        console.log("First request completed for badge:", badgeId);

                        // Opóźnij drugi request o 1 sekundę
                        setTimeout(() => {
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: "https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk",
                                headers: {
                                    "Content-Type": "application/x-www-form-urlencoded",
                                    "Origin": "https://fcmenu-dub-regionalized.corp.amazon.com",
                                    "Accept": "*/*"
                                },
                                data: 'warehouseId=KTW1&calmCode=MSTOP&trackingBadgeId=' + badgeId,
                                withCredentials: true,
                                timeout: 5000,
                                onerror: function(response) {
                                    console.error("Error in second request:", response);
                                },
                                onload: function(response) {
                                    console.log("Second request completed for badge:", badgeId);
                                }
                            });
                        }, 1000); // 1000 ms = 1 sekunda
                    }
                });
            }


            function checkAndSendRequests() {
                if (!isAutoEnabled) return;

                const now = new Date();
                const minutes = now.getMinutes();

                // Sprawdź czy już wykonaliśmy requesty w tej minucie
                if (minutes === lastExecutionMinute) {
                    return;
                }

                // Wykonuj requesty dla wszystkich zapisanych badgeId
                if (minutes === 1 || minutes === 31) {
                    autoBadges.forEach(badgeId => processRequests(badgeId));
                    lastExecutionMinute = minutes;
                    console.log(`Requests executed at minute ${minutes}`);
                }
            }



            // Add button to menu
            bottomMenu.appendChild(bottomMenu_auto);
            wrapperDiv.appendChild(bottomMenu);


            // Dodanie wrapperDiv do strony
            const body = document.getElementsByTagName('body')[0];
            body.insertBefore(wrapperDiv, body.firstChild);


            // Aktualizacja tekstu przycisku, jeśli istnieje
            if (typeof innerButton !== 'undefined') {
                innerButton.innerText = (existingWrapperDiv && existingWrapperDiv.style.display === 'none') ? 'Pokaż' : 'Odśwież';
            }

            // Aktualizacja informacji o liczbie wczytanych elementów
            const ileWczytanoElem = document.getElementById("lista_ileWczytano");
            if (ileWczytanoElem) {
                ileWczytanoElem.innerText = document.getElementsByClassName("czp_currenttask").length;
            }

            // Automatyczne wysuwanie elementu, jeśli warunek jest spełniony
            if (typeof div !== 'undefined' && div.style.left !== '-100%' && !document.getElementById('pracownicy_tabela_id')) {
                const wysunElement = document.getElementById("Pracownicy_wysuń_id");
                if (wysunElement) wysunElement.click();
            }

            // Dodanie dodatkowej tabelki z zadaniami (zakładam, że tabelaWynikowa jest zdefiniowana)
            tabelaWynikowa();
            updateTaskDropdowns();
            initializeAutoState();

        }
        finally {
            // Ukryj loader
            isLoading = false;
            mainLoaderOverlay.style.display = 'none';
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedUpdateTaskDropdowns = debounce(updateTaskDropdowns, 250);

    function updateTaskDropdowns() {
        const mainTaskSelect = document.querySelector('#mainTaskSelect');
        const subTaskSelect = document.querySelector('#subTaskSelect');
        if (!mainTaskSelect || !subTaskSelect) return;

        // Zapamiętaj aktualnie wybrane wartości
        const currentMainValue = mainTaskSelect.value;
        const currentSubValue = subTaskSelect.value;

        // Czyszczenie obecnych opcji
        mainTaskSelect.innerHTML = '';
        subTaskSelect.innerHTML = '';

        // Dodawanie pustych opcji
        mainTaskSelect.appendChild(new Option('-- Wybierz główny proces --', ''));
        subTaskSelect.appendChild(new Option('-- Wybierz podproces --', ''));

        // Zbieranie tasków i subtasków
        const mainTasks = new Set();
        const subTasks = new Map(); // Map do przechowywania subtasków dla każdego głównego taska

        const currentTasks = document.querySelectorAll('.czp_currenttask');
        currentTasks.forEach(taskCell => {
            const taskParts = taskCell.textContent.trim().split('♦');
            const mainTask = taskParts[0].trim();
            const subTask = taskParts[1]?.trim();

            if (mainTask) {
                mainTasks.add(mainTask);

                if (subTask) {
                    if (!subTasks.has(mainTask)) {
                        subTasks.set(mainTask, new Set());
                    }
                    subTasks.get(mainTask).add(subTask);
                }
            }
        });

        // Dodawanie posortowanych głównych procesów
        Array.from(mainTasks)
            .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}))
            .forEach(task => {
            mainTaskSelect.appendChild(new Option(task, task));
        });

        // Event listener dla głównego dropdowna
        mainTaskSelect.onchange = function() {
            subTaskSelect.innerHTML = '';
            subTaskSelect.appendChild(new Option('-- Wybierz podproces --', ''));

            if (this.value && subTasks.has(this.value)) {
                Array.from(subTasks.get(this.value))
                    .sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}))
                    .forEach(subTask => {
                    subTaskSelect.appendChild(new Option(subTask, subTask));
                });
            };

            // Przywracanie wybranych wartości
            if (mainTasks.has(currentMainValue)) {
                mainTaskSelect.value = currentMainValue;
                mainTaskSelect.dispatchEvent(new Event('change'));
                if (currentSubValue && subTasks.get(currentMainValue)?.has(currentSubValue)) {
                    subTaskSelect.value = currentSubValue;
                }
            }
        }
    }



    function tabelaWynikowa() {

        const wynikowaTabela = document.getElementById('wynikowaTabela');
        if (wynikowaTabela) {
            wynikowaTabela.innerHTML = ''; // Czyszczenie starej zawartości
        }

        // Pobierz wszystkie elementy o klasie "czp_currenttask"
        var currentTasks = document.querySelectorAll('.czp_currenttask');

        // Tworzenie obiektu, który będzie przechowywał dane w formie słownika
        var dane = {};

        // Array to collect all 'osoby'
        var allOsoby = [];

        // Przetwarzanie elementów "czp_currenttask"
        currentTasks.forEach(function (element) {
            // Znajdź rodzica elementu "czp_currenttask", który jest elementem <tr>
            var tr = element.closest('tr');

            if (tr) {
                // Pobierz tekst z elementu ".czp_kto"
                var osobyElement = tr.querySelector('.czp_kto');

                // Znajdź element ".czp_link"
                var linkElement = tr.querySelector('.czp_link');

                // Pobierz tekst z elementu ".czp_currenttask"
                var currentTask = element.textContent.trim();

                // Pobierz tekst z elementu ".czp_kto"
                var osoby = osobyElement.textContent.trim();

                // Add 'osoby' to 'allOsoby' array
                allOsoby.push(osoby);

                // Jeśli currentTask zawiera znak "♦"
                if (currentTask.includes('♦')) {
                    // Podziel tekst na części, używając "♦" jako separatora
                    var czesci = currentTask.split('♦');

                    var nazwa1 = czesci[0].trim();
                    var nazwa2 = czesci[1].trim();

                    // Jeśli nazwa1 jest już w danych, zwiększ jej liczbę osób
                    if (dane.hasOwnProperty(nazwa1)) {
                        dane[nazwa1].iloscOsob += 1;
                    } else {
                        // W przeciwnym razie dodaj ją jako nowy klucz w danych
                        dane[nazwa1] = { iloscOsob: 1, podnazwy: {} };
                    }

                    // Jeśli nazwa2 nie jest pusta, zaktualizuj dane podnazw
                    if (nazwa2 !== '') {
                        // Jeśli nazwa2 jest już w danych, zwiększ jej liczbę osób
                        if (dane[nazwa1].podnazwy.hasOwnProperty(nazwa2)) {
                            dane[nazwa1].podnazwy[nazwa2].iloscOsob += 1;
                            dane[nazwa1].podnazwy[nazwa2].osoby.push(osoby);
                            dane[nazwa1].podnazwy[nazwa2].links.push(linkElement.querySelector('a').getAttribute('href'));
                        } else {
                            // W przeciwnym razie dodaj ją jako nowy klucz w danych
                            dane[nazwa1].podnazwy[nazwa2] = {
                                iloscOsob: 1,
                                osoby: [osoby],
                                links: [linkElement.querySelector('a').getAttribute('href')]
                            };
                        }
                    }
                } else {
                    // Jeśli currentTask nie zawiera znaku "♦", użyj całego tekstu jako nazwa1
                    var nazwa1 = currentTask.trim();
                    var nazwa2 = ''; // Pusty napis dla jednoczęściowych tasków

                    // Jeśli nazwa1 jest już w danych, zwiększ jej liczbę osób
                    if (dane.hasOwnProperty(nazwa1)) {
                        dane[nazwa1].iloscOsob += 1;
                        if (!dane[nazwa1].osoby) dane[nazwa1].osoby = [];
                        if (!dane[nazwa1].links) dane[nazwa1].links = [];
                        dane[nazwa1].osoby.push(osoby);
                        dane[nazwa1].links.push(linkElement.querySelector('a').getAttribute('href'));
                    } else {
                        // W przeciwnym razie dodaj ją jako nowy klucz w danych
                        dane[nazwa1] = {
                            iloscOsob: 1,
                            osoby: [osoby],
                            links: [linkElement.querySelector('a').getAttribute('href')]
                        };
                    }
                }
            }
        });

        // Get unique 'osoby'
        var uniqueOsoby = [...new Set(allOsoby)];

        // Dodaj style do tabeli
        wynikowaTabela.style.borderCollapse = 'collapse';
        wynikowaTabela.style.height = "fit-content";
        wynikowaTabela.style.marginLeft = "5px";
        wynikowaTabela.style.flex = "1 1 15%";

        var trHC = document.createElement('tr');
        trHC.style.backgroundColor = "silver";
        trHC.className = "tr_HC";

        var thHC = document.createElement('th');
        thHC.style.padding = "5px";
        thHC.style.border = '1px solid black';

        // Create the appropriate word for 'osoba', 'osoby', or 'osób'
        let totalPeople = uniqueOsoby.length;
        let slowoOsobaHC;

        if (totalPeople === 1) {
            slowoOsobaHC = 'osoba';
        } else if (totalPeople >= 2 && totalPeople <= 4) {
            slowoOsobaHC = 'osoby';
        } else {
            slowoOsobaHC = 'osób';
        }

        // Create the link for HC count
        const hcLink = document.createElement('a');
        hcLink.href = '#';
        hcLink.style.color = '#0066cc';
        hcLink.style.textDecoration = 'none';
        hcLink.textContent = `HC: ${totalPeople} AAs`;

        // Add hover effect
        hcLink.style.cursor = 'pointer';
        hcLink.onmouseover = function() {
            this.style.textDecoration = 'underline';
        };
        hcLink.onmouseout = function() {
            this.style.textDecoration = 'none';
        };


        // Add click handler
        hcLink.onclick = function(e) {
            e.preventDefault();

            // Zbierz wszystkie linki FCLM
            const allEmployees = document.querySelectorAll('.czp_kto');
            const shiftParams = generateShiftParameters();

            // Otwórz FCLM dla każdego pracownika
            allEmployees.forEach(employee => {
                const login = employee.textContent.trim();
                const fclmUrl = `https://fclm-portal.amazon.com/employee/timeDetails?warehouseId=KTW1&employeeId=${login}${shiftParams}`;
                window.open(fclmUrl, '_blank');
            });
        };

        thHC.appendChild(hcLink);
        trHC.appendChild(thHC);


        // Insert 'trHC' at the top of 'wynikowaTabela'
        if (wynikowaTabela.firstChild) {
            wynikowaTabela.insertBefore(trHC, wynikowaTabela.firstChild);
        } else {
            wynikowaTabela.appendChild(trHC);
        }

        // Przygotuj dane do sortowania
        var sortedData = [];

        for (var nazwa1 in dane) {
            if (dane.hasOwnProperty(nazwa1)) {
                const iloscOsobTh = dane[nazwa1].iloscOsob;
                sortedData.push({
                    nazwa: nazwa1,
                    iloscOsob: iloscOsobTh
                });
            }
        }

        // Posortuj dane według ilości osób (malejąco)
        sortedData.sort(function (a, b) {
            return b.iloscOsob - a.iloscOsob;
        });

        // Tworzenie tabeli na podstawie posortowanych danych
        sortedData.forEach(function(sortedItem) {
            var nazwa1 = sortedItem.nazwa;
            var iloscOsobTh = sortedItem.iloscOsob;

            var trNazwa1 = document.createElement('tr');
            trNazwa1.style.backgroundColor = "silver";
            trNazwa1.className = "tr_nazwa1";

            var thNazwa1 = document.createElement('th');
            thNazwa1.style.padding = "5px";

            let slowoOsobaTh;
            if (iloscOsobTh === 1) {
                slowoOsobaTh = 'osoba';
            } else if (iloscOsobTh >= 2 && iloscOsobTh <= 4) {
                slowoOsobaTh = 'osoby';
            } else {
                slowoOsobaTh = 'osób';
            }

            // Tworzymy span dla nazwy
            const nameSpan = document.createElement('span');
            nameSpan.textContent = nazwa1 + ' (';

            const shiftParams = generateShiftParameters();

            // Tworzenie link dla ilości osób
            const peopleLink = document.createElement('a');
            peopleLink.href = '#';
            peopleLink.style.color = '#0066cc';
            peopleLink.style.textDecoration = 'none';
            peopleLink.textContent = `${iloscOsobTh} ${slowoOsobaTh}`;
            peopleLink.onclick = function(e) {
                e.preventDefault();
                let osoby = [];

                // Zbieramy osoby ze wszystkich podtasków lub z głównego taska
                if (dane[nazwa1].podnazwy && Object.keys(dane[nazwa1].podnazwy).length > 0) {
                    Object.values(dane[nazwa1].podnazwy).forEach(podtask => {
                        if (podtask.osoby) {
                            osoby = osoby.concat(podtask.osoby);
                        }
                    });
                } else if (dane[nazwa1].osoby) {
                    osoby = dane[nazwa1].osoby;
                }

                // Otwieramy FCLM dla każdej osoby
                osoby.forEach(osoba => {
                    const fclmUrl = `https://fclm-portal.amazon.com/employee/timeDetails?warehouseId=KTW1&employeeId=${osoba}${shiftParams}`;
                    window.open(fclmUrl, '_blank');
                });
            };

            // Dodajemy efekt hover
            peopleLink.style.cursor = 'pointer';
            peopleLink.onmouseover = function() {
                this.style.textDecoration = 'underline';
            };
            peopleLink.onmouseout = function() {
                this.style.textDecoration = 'none';
            };

            // Tworzymy span zamykający nawias
            const closingSpan = document.createElement('span');
            closingSpan.textContent = ')';

            // Łączymy wszystko w th
            thNazwa1.appendChild(nameSpan);
            thNazwa1.appendChild(peopleLink);
            thNazwa1.appendChild(closingSpan);

            thNazwa1.style.border = '1px solid black';
            thNazwa1.className = "th_nazwa1";
            thNazwa1.style.whiteSpace = 'nowrap';
            thNazwa1.style.width = '1%';

            trNazwa1.appendChild(thNazwa1);
            wynikowaTabela.appendChild(trNazwa1);
            if (nazwa1 !== '') {
                if (dane[nazwa1] && dane[nazwa1].podnazwy && Object.keys(dane[nazwa1].podnazwy).length > 0) {
                    // Przejdź przez podnazwy
                    for (var nazwa2 in dane[nazwa1].podnazwy) {
                        if (dane[nazwa1].podnazwy.hasOwnProperty(nazwa2)) {
                            var trNazwa2 = document.createElement('tr');
                            trNazwa2.style.backgroundColor = "silver";

                            var tdNazwa2 = document.createElement('td');
                            tdNazwa2.style.backgroundColor = "white";
                            tdNazwa2.style.padding = "5px";
                            tdNazwa2.style.border = '1px solid black';

                            const iloscOsob2 = dane[nazwa1].podnazwy[nazwa2].iloscOsob;
                            let slowoOsoba2;

                            if (iloscOsob2 === 1) {
                                slowoOsoba2 = 'osoba';
                            } else if (iloscOsob2 >= 2 && iloscOsob2 <= 4) {
                                slowoOsoba2 = 'osoby';
                            } else {
                                slowoOsoba2 = 'osób';
                            }

                            tdNazwa2.textContent = `${nazwa2} (${iloscOsob2} ${slowoOsoba2})`;
                            tdNazwa2.style.width = '1%';
                            trNazwa2.appendChild(tdNazwa2);
                            wynikowaTabela.appendChild(trNazwa2);

                            var br = document.createElement('br');
                            var osobySpan = document.createElement('span');
                            osobySpan.style.minWidth = "fit-content";


                            dane[nazwa1].podnazwy[nazwa2].osoby.forEach((osoba, index) => {
                                // Tworzenie linku
                                var a = document.createElement('a');
                                a.textContent = osoba.toUpperCase();
                                a.href = dane[nazwa1].podnazwy[nazwa2].links[index];

                                // Dodanie event listenerów
                                a.addEventListener('mouseenter', function(e) {
                                    e.stopPropagation();
                                    this.classList.add('highlighted-text');
                                    this.closest('tr').classList.add('highlighted-row');

                                    const login = this.textContent;
                                    const pracownicyTabela = document.getElementById('pracownicyTabela');
                                    if (pracownicyTabela) {
                                        const rows = pracownicyTabela.querySelectorAll('tr');
                                        rows.forEach(row => {
                                            const loginCell = row.querySelector('.czp_kto');
                                            if (loginCell && loginCell.textContent.toUpperCase() === login) {
                                                row.classList.add('highlighted-row');
                                            }
                                        });
                                    }
                                });

                                a.addEventListener('mouseleave', function(e) {
                                    e.stopPropagation();
                                    this.classList.remove('highlighted-text');
                                    this.closest('tr').classList.remove('highlighted-row');

                                    const pracownicyTabela = document.getElementById('pracownicyTabela');
                                    if (pracownicyTabela) {
                                        const highlightedRows = pracownicyTabela.querySelectorAll('.highlighted-row');
                                        highlightedRows.forEach(row => row.classList.remove('highlighted-row'));
                                    }
                                });

                                osobySpan.appendChild(a);

                                // Dodaj separator jako osobny element tekstowy
                                if (index < dane[nazwa1].podnazwy[nazwa2].osoby.length - 1) {
                                    const separator = document.createTextNode(' | ');
                                    osobySpan.appendChild(separator);
                                }
                            });

                            tdNazwa2.appendChild(br);
                            tdNazwa2.appendChild(osobySpan);
                        }
                    }
                } else {
                    var trNazwa2 = document.createElement('tr');
                    trNazwa2.style.backgroundColor = "silver";

                    var tdNazwa2 = document.createElement('td');
                    tdNazwa2.style.backgroundColor = "white";
                    tdNazwa2.style.padding = "5px";
                    tdNazwa2.style.border = '1px solid black';
                    tdNazwa2.style.width = '1%';

                    var osobySpan = document.createElement('span');
                    osobySpan.style.minWidth = "fit-content";

                    dane[nazwa1].osoby.forEach((osoba, index) => {
                        var a = document.createElement('a');
                        a.textContent = osoba.toUpperCase();
                        a.href = dane[nazwa1].links[index];

                        a.addEventListener('mouseenter', function(e) {
                            e.stopPropagation();
                            this.classList.add('highlighted-text');
                            this.closest('tr').classList.add('highlighted-row');

                            const login = this.textContent;
                            const pracownicyTabela = document.getElementById('pracownicyTabela');
                            if (pracownicyTabela) {
                                const rows = pracownicyTabela.querySelectorAll('tr');
                                rows.forEach(row => {
                                    const loginCell = row.querySelector('.czp_kto');
                                    if (loginCell && loginCell.textContent.toUpperCase() === login) {
                                        row.classList.add('highlighted-row');
                                    }
                                });
                            }
                        });

                        a.addEventListener('mouseleave', function(e) {
                            e.stopPropagation();
                            this.classList.remove('highlighted-text');
                            this.closest('tr').classList.remove('highlighted-row');

                            const pracownicyTabela = document.getElementById('pracownicyTabela');
                            if (pracownicyTabela) {
                                const highlightedRows = pracownicyTabela.querySelectorAll('.highlighted-row');
                                highlightedRows.forEach(row => row.classList.remove('highlighted-row'));
                            }
                        });

                        osobySpan.appendChild(a);

                        // Dodaj separator jako osobny element tekstowy
                        if (index < dane[nazwa1].osoby.length - 1) {
                            const separator = document.createTextNode(' | ');
                            osobySpan.appendChild(separator);
                        }
                    });

                    tdNazwa2.appendChild(osobySpan);
                    trNazwa2.appendChild(tdNazwa2);
                    wynikowaTabela.appendChild(trNazwa2);
                }
            }
        });
    }




    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }


    function fetchJSON(url) {
        return fetch(url)
            .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
            .then(data => {
            return data;
        })
            .catch(error => {
            console.error('Error:', error);
        });
    }

    function createTable(pracownicy) {
        var table = document.createElement('table');
        table.id = "pracownicyTabela";
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.border = '1px solid black'; // zmieniono ramkę na niebieską
        table.style.padding = '5px'; // dodano odstępy wokół tabeli
        table.style.flexBasis = "75%";
        table.style.height = "fit-content";


        // Tworzenie nagłówka tabeli
        var thead = document.createElement('thead');
        thead.style.backgroundColor = "silver";
        var headerRow = document.createElement('tr');
        var headers = ['', 'Badge ID', 'Employee ID', 'Login', 'FCLM', 'Name', 'Manager', 'Off-Tasks?', 'Current Task', 'Auto', '', ''];

        headers.forEach(function(header, index) {
            var th = document.createElement('th');

            // Dodaj strzałkę sortowania tylko dla wybranych kolumn
            if (index > 0 && index < 9) { // Dodajemy sortowanie tylko dla wybranych kolumn
                const headerSpan = document.createElement('span');
                headerSpan.textContent = header;
                th.appendChild(headerSpan);

                const arrowSpan = document.createElement('span');
                arrowSpan.className = 'sort-arrow';
                arrowSpan.style.opacity = '0.3';
                arrowSpan.textContent = '↕';
                th.appendChild(arrowSpan);

                th.style.cursor = 'pointer';
                th.setAttribute('data-sort', 'none');
                th.addEventListener('click', function() {
                    sortTable(index, this);
                });
            } else {
                th.textContent = header;
            }

            th.style.border = '1px solid black';
            th.style.padding = '5px';
            headerRow.appendChild(th);
        });


        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Tworzenie ciała tabeli z danymi pracowników
        var tbody = document.createElement('tbody');
        pracownicy.forEach(function(pracownik, index) {
            var row = createTableRow(pracownik, index);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    }

    // Funkcja sortująca
    function sortTable(column, header) {
        const table = document.getElementById('pracownicyTabela');
        const tbody = table.getElementsByTagName('tbody')[0];
        const rows = Array.from(tbody.getElementsByTagName('tr'));

        // Resetuj strzałki we wszystkich nagłówkach
        const headers = table.getElementsByTagName('th');
        Array.from(headers).forEach(h => {
            const arrow = h.querySelector('.sort-arrow');
            if (arrow) {
                arrow.innerHTML = '↕';
                arrow.style.opacity = '0.3';
            }
            if (h !== header) {
                h.setAttribute('data-sort', 'none');
            }
        });

        // Pobierz aktualny stan sortowania i ustaw następny
        const currentSort = header.getAttribute('data-sort');
        let nextSort = 'asc';
        if (currentSort === 'asc') {
            nextSort = 'desc';
        } else if (currentSort === 'desc') {
            nextSort = 'asc';
        }
        header.setAttribute('data-sort', nextSort);

        // Aktualizuj strzałkę w aktywnym nagłówku
        const arrow = header.querySelector('.sort-arrow');
        if (arrow) {
            arrow.innerHTML = nextSort === 'asc' ? '↑' : '↓';
            arrow.style.opacity = '1';
        }

        // Funkcja pomocnicza do pobierania wartości z komórki
        const getCellValue = (row, index) => {
            const cell = row.getElementsByTagName('td')[index];
            if (!cell) return '';

            // Specjalna obsługa dla różnych typów kolumn
            switch(index) {
                case 1: // Badge ID
                    return cell.textContent || '';
                case 2: // Employee ID
                    return cell.textContent || '';
                case 3: // Login
                    return cell.textContent || '';
                case 4: // FCLM
                    return cell.textContent || '';
                case 5: // Name
                    return cell.textContent || '';
                case 6: // Manager
                    return cell.textContent || '';
                case 7: // Off-Tasks
                    return cell.textContent || '';
                case 8: // Current Task
                    return cell.textContent || '';
                default:
                    return cell.textContent || '';
            }
        };

        // Funkcja porównująca do sortowania
        const compareFunction = (a, b) => {
            const valueA = getCellValue(a, column);
            const valueB = getCellValue(b, column);

            // Porównanie wartości
            if (valueA < valueB) {
                return nextSort === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return nextSort === 'asc' ? 1 : -1;
            }
            return 0;
        };

        // Wyczyść stare taskDiv przed sortowaniem
        cleanupTaskDivs();

        // Sortuj wiersze
        rows.sort(compareFunction);

        // Usuń obecne wiersze
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        // Dodaj posortowane wiersze i odtwórz taskDiv
        rows.forEach((row, index) => {
            row.style.backgroundColor = index % 2 === 0 ? 'white' : '#f2f2f2';

            // Znajdź elementy
            const login = row.querySelector('.czp_kto').textContent;
            const oldTaskSpan = row.querySelector('.task-icon');
            const taskContent = row.dataset.task; // Pobierz zapisane dane o taskach
            console.log(row);

            if (oldTaskSpan && taskContent) {
                console.log("naajak");
                // Stwórz nowy taskSpan
                const newTaskSpan = document.createElement('span');
                newTaskSpan.innerHTML = '📊';
                newTaskSpan.style.cursor = 'pointer';
                newTaskSpan.className = 'task-icon'; // Dodajemy klasę do nowego spana

                // Stwórz nowy taskDiv
                const taskDiv = document.createElement('div');
                taskDiv.id = "taskDiv_id_" + login;
                taskDiv.style.position = 'absolute';
                taskDiv.style.width = 'fit-content';
                taskDiv.style.backgroundColor = 'white';
                taskDiv.style.border = '1px solid black';
                taskDiv.style.padding = '5px';
                taskDiv.style.display = 'none';
                taskDiv.style.overflow = 'auto';
                taskDiv.style.maxHeight = '80vh';
                taskDiv.style.maxWidth = '50vw';
                taskDiv.style.zIndex = '9999';

                // Dodaj zawartość taskDiv
                const taskDiv_task = document.createElement('div');
                taskDiv_task.id = "taskDiv_task_id_" + login;
                taskDiv_task.innerHTML = taskContent;
                taskDiv_task.style.display = 'block';

                // Dodaj taskDiv do body
                taskDiv.appendChild(taskDiv_task);
                document.body.appendChild(taskDiv);

                // Zamień stary span na nowy z event listenerami
                const tasksCell = oldTaskSpan.parentNode;
                tasksCell.removeChild(oldTaskSpan);
                tasksCell.appendChild(newTaskSpan);

                // Event listeners dla newTaskSpan
                newTaskSpan.addEventListener('mouseover', function(e) {
                    const taskDivElement = document.getElementById("taskDiv_id_" + login);
                    if (taskDivElement) {
                        const spanRect = e.target.getBoundingClientRect();

                        // Najpierw pokaż element poza ekranem, żeby obliczyć jego wymiary
                        taskDivElement.style.visibility = 'hidden';
                        taskDivElement.style.display = 'block';

                        // Teraz możemy pobrać rzeczywiste wymiary
                        const taskDivRect = taskDivElement.getBoundingClientRect();

                        // Oblicz pozycję, aby div był wycentrowany pod spanem
                        const left = spanRect.left + (spanRect.width / 2) - (taskDivRect.width / 2);
                        const top = spanRect.bottom + window.scrollY + 5;

                        // Ustaw pozycję i pokaż element
                        taskDivElement.style.left = Math.max(0, left) + 'px';
                        taskDivElement.style.top = top + 'px';
                        taskDivElement.style.visibility = 'visible';
                    }
                });

                newTaskSpan.addEventListener('mouseout', function(e) {
                    const taskDivElement = document.getElementById("taskDiv_id_" + login);
                    if (taskDivElement && !taskDivElement.dataset.pinned) {
                        const relatedTarget = e.relatedTarget;
                        if (!taskDivElement.contains(relatedTarget)) {
                            taskDivElement.style.display = 'none';
                        }
                    }
                });

                newTaskSpan.addEventListener('click', function(e) {
                    const taskDivElement = document.getElementById("taskDiv_id_" + login);
                    if (taskDivElement) {
                        if (taskDivElement.dataset.pinned) {
                            delete taskDivElement.dataset.pinned;
                            taskDivElement.style.display = 'none';
                        } else {
                            taskDivElement.dataset.pinned = 'true';

                            const spanRect = e.target.getBoundingClientRect();

                            // Tymczasowo pokaż element, aby obliczyć jego wymiary
                            taskDivElement.style.visibility = 'hidden';
                            taskDivElement.style.display = 'block';

                            const taskDivRect = taskDivElement.getBoundingClientRect();

                            // Oblicz pozycję
                            const left = spanRect.left + (spanRect.width / 2) - (taskDivRect.width / 2);
                            const top = spanRect.bottom + window.scrollY + 5;

                            // Ustaw pozycję i pokaż element
                            taskDivElement.style.left = Math.max(0, left) + 'px';
                            taskDivElement.style.top = top + 'px';
                            taskDivElement.style.visibility = 'visible';
                        }
                    }
                });



                // Event listeners dla taskDiv
                taskDiv.addEventListener('mouseenter', function() {
                    this.style.display = 'block';
                });

                taskDiv.addEventListener('mouseleave', function(e) {
                    if (!this.dataset.pinned) {
                        const relatedTarget = e.relatedTarget;
                        if (!newTaskSpan.contains(relatedTarget)) {
                            this.style.display = 'none';
                        }
                    }
                });
            }

            tbody.appendChild(row);
        });

    }

    // Funkcja do tworzenia pojedynczego wiersza (wydzielona dla czytelności)
    function createTableRow(pracownik, index) {
        var row = document.createElement('tr');
        row.style.borderTop = '1px solid black';
        row.style.backgroundColor = index % 2 === 0 ? 'white' : '#f2f2f2';
        // Dodaj dane task do dataset wiersza
        row.dataset.task = pracownik.task;

        // Dodaj obsługę zdarzeń dla podświetlania
        row.addEventListener('mouseenter', function() {
            this.classList.add('highlighted-row');
            const login = loginCell.textContent.trim().toUpperCase();
            const wynikowaTabela = document.getElementById('wynikowaTabela');
            if (wynikowaTabela) {
                const links = wynikowaTabela.querySelectorAll('a');
                links.forEach(link => {
                    if (link.textContent === login) {
                        link.classList.add('highlighted-text');
                        link.closest('tr').classList.add('highlighted-row');
                    }
                });
            }
        });

        row.addEventListener('mouseleave', function() {
            this.classList.remove('highlighted-row');
            const wynikowaTabela = document.getElementById('wynikowaTabela');
            if (wynikowaTabela) {
                const highlightedLinks = wynikowaTabela.querySelectorAll('.highlighted-text');
                highlightedLinks.forEach(link => link.classList.remove('highlighted-text'));
                const highlightedRows = wynikowaTabela.querySelectorAll('.highlighted-row');
                highlightedRows.forEach(row => row.classList.remove('highlighted-row'));
            }
        });

        // Kolumna z ikoną zdjęcia
        var emptyCell = document.createElement('td');
        var imageSpan = document.createElement('span');
        imageSpan.innerHTML = '&#128247;';
        imageSpan.style.cursor = 'pointer';

        var imageDiv = document.createElement('div');
        imageDiv.id = 'imageDiv_id';
        imageDiv.style.position = 'absolute';
        imageDiv.style.width = '150px';
        imageDiv.style.backgroundColor = 'white';
        imageDiv.style.border = '1px solid black';
        imageDiv.style.padding = '5px';
        imageDiv.style.display = 'none';
        imageDiv.style.zIndex = '9999';

        var img = document.createElement('img');
        img.src = 'https://internal-cdn.amazon.com/badgephotos.amazon.com/?uid=' + pracownik.login;
        img.style.maxWidth = '150px';
        img.style.maxHeight = '150px';
        imageDiv.appendChild(img);

        imageSpan.addEventListener('mouseover', function() {
            imageDiv.style.display = 'block';
        });

        imageSpan.addEventListener('mouseout', function() {
            if (!imageDiv.dataset.clicked) {
                imageDiv.style.display = 'none';
            }
        });

        imageSpan.addEventListener('click', function() {
            if (imageDiv.dataset.clicked) {
                imageDiv.dataset.clicked = '';
            } else {
                imageDiv.dataset.clicked = 'true';
            }
        });

        emptyCell.appendChild(imageSpan);
        emptyCell.appendChild(imageDiv);


        function createTaskDivHandlers(taskSpan, taskDiv, login) {
            function positionTaskDiv(e, taskDivElement) {
                const spanRect = e.target.getBoundingClientRect();
                taskDivElement.style.visibility = 'hidden';
                taskDivElement.style.display = 'block';

                const taskDivRect = taskDivElement.getBoundingClientRect();

                const top = spanRect.bottom + window.scrollY + 5;
                const left = spanRect.left + (spanRect.width / 2) - (taskDivRect.width / 2);

                taskDivElement.style.left = Math.max(0, left) + 'px';
                taskDivElement.style.top = top + 'px';
                taskDivElement.style.visibility = 'visible';
            }

            function handleTaskDivShow(e) {
                const taskDivElement = document.getElementById("taskDiv_id_" + login);
                if (taskDivElement) {
                    positionTaskDiv(e, taskDivElement);
                }
            }

            function handleTaskDivHide(e) {
                const taskDivElement = document.getElementById("taskDiv_id_" + login);
                if (taskDivElement && !taskDivElement.dataset.clicked) {
                    const relatedTarget = e.relatedTarget;
                    if (!taskDivElement.contains(relatedTarget) && !taskSpan.contains(relatedTarget)) {
                        taskDivElement.style.display = 'none';
                    }
                }
            }

            function handleTaskDivClick(e) {
                e.stopPropagation();
                const taskDivElement = document.getElementById("taskDiv_id_" + login);
                if (taskDivElement) {
                    taskDivElement.dataset.clicked = !taskDivElement.dataset.clicked;
                    if (!taskDivElement.dataset.clicked) {
                        taskDivElement.style.display = 'none';
                    } else {
                        positionTaskDiv(e, taskDivElement);
                    }
                }
            }

            // Dodaj event listenery do spana
            taskSpan.addEventListener('mouseover', handleTaskDivShow);
            taskSpan.addEventListener('mouseout', handleTaskDivHide);
            taskSpan.addEventListener('click', handleTaskDivClick);

            // Event listenery dla samego taskDiv
            taskDiv.addEventListener('mouseenter', function() {
                this.style.display = 'block';
            });

            taskDiv.addEventListener('mouseleave', function(e) {
                if (!this.dataset.clicked) {
                    const relatedTarget = e.relatedTarget;
                    if (!taskSpan.contains(relatedTarget)) {
                        this.style.display = 'none';
                    }
                }
            });

            return { handleTaskDivShow, handleTaskDivHide, handleTaskDivClick };
        }

        // Kolumna z ikoną tasków
        var tasksCell = document.createElement('td');
        var taskSpan = document.createElement('span');
        taskSpan.innerHTML = '📊';
        taskSpan.style.cursor = 'pointer';
        taskSpan.className = 'task-icon'; // Dodaj tę linię

        var taskDiv = document.createElement('div');
        taskDiv.id = "taskDiv_id_" + pracownik.login;
        taskDiv.style.position = 'absolute';
        taskDiv.style.width = 'fit-content';
        taskDiv.style.backgroundColor = 'white';
        taskDiv.style.border = '1px solid black';
        taskDiv.style.padding = '5px';
        taskDiv.style.display = 'none';
        taskDiv.style.overflow = 'auto';
        taskDiv.style.maxHeight = '80vh';
        taskDiv.style.maxWidth = '50vw';
        taskDiv.style.zIndex = '9999';

        var taskDiv_task = document.createElement('div');
        taskDiv_task.id = "taskDiv_task_id_" + pracownik.login;
        taskDiv_task.innerHTML = pracownik.task;
        taskDiv_task.style.display = 'block';

        taskDiv.appendChild(taskDiv_task);
        document.body.appendChild(taskDiv);

        // Dodaj event listenery
        taskSpan.addEventListener('mouseover', function(e) {
            const taskDivElement = document.getElementById("taskDiv_id_" + pracownik.login);
            if (taskDivElement) {
                const spanRect = e.target.getBoundingClientRect();
                const taskDivRect = taskDivElement.getBoundingClientRect();

                taskDivElement.style.display = 'block';
                const left = spanRect.left + (spanRect.width / 2) - (taskDivElement.offsetWidth / 2);
                const top = spanRect.bottom + window.scrollY + 5;

                taskDivElement.style.left = Math.max(0, left) + 'px';
                taskDivElement.style.top = top + 'px';
            }
        });

        taskSpan.addEventListener('mouseout', function(e) {
            const taskDivElement = document.getElementById("taskDiv_id_" + pracownik.login);
            if (taskDivElement && !taskDivElement.dataset.pinned) {
                const relatedTarget = e.relatedTarget;
                if (!taskDivElement.contains(relatedTarget)) {
                    taskDivElement.style.display = 'none';
                }
            }
        });

        taskSpan.addEventListener('click', function(e) {
            const taskDivElement = document.getElementById("taskDiv_id_" + pracownik.login);
            if (taskDivElement) {
                if (taskDivElement.dataset.pinned) {
                    delete taskDivElement.dataset.pinned;
                    taskDivElement.style.display = 'none';
                } else {
                    taskDivElement.dataset.pinned = 'true';
                    const spanRect = e.target.getBoundingClientRect();
                    const taskDivRect = taskDivElement.getBoundingClientRect();

                    taskDivElement.style.display = 'block';
                    const left = spanRect.left + (spanRect.width / 2) - (taskDivElement.offsetWidth / 2);
                    const top = spanRect.bottom + window.scrollY + 5;

                    taskDivElement.style.left = Math.max(0, left) + 'px';
                    taskDivElement.style.top = top + 'px';
                }
            }
        });

        // Event listenery dla samego taskDiv
        taskDiv.addEventListener('mouseenter', function() {
            if (!this.dataset.pinned) {
                this.style.display = 'block';
            }
        });

        taskDiv.addEventListener('mouseleave', function(e) {
            if (!this.dataset.pinned) {
                const relatedTarget = e.relatedTarget;
                if (!taskSpan.contains(relatedTarget)) {
                    this.style.display = 'none';
                }
            }
        });

        tasksCell.appendChild(taskSpan);


        // Dodawanie wszystkich komórek do wiersza
        row.appendChild(emptyCell);

        // Badge ID
        var badgeIdCell = document.createElement('td');
        badgeIdCell.textContent = pracownik.badgeId;
        badgeIdCell.className = 'czp_badge';
        row.appendChild(badgeIdCell);

        // Employee ID
        var employeeIdCell = document.createElement('td');
        employeeIdCell.textContent = pracownik.employeeId;
        employeeIdCell.className = 'czp_employeeId';
        row.appendChild(employeeIdCell);

        // Login
        var loginCell = document.createElement('td');
        loginCell.textContent = pracownik.login;
        loginCell.className = "czp_kto";
        row.appendChild(loginCell);

        // FCLM
        var fclmCell = document.createElement('td');
        fclmCell.innerHTML = pracownik.fclm;
        fclmCell.className = "czp_link";
        row.appendChild(fclmCell);

        // Name
        var nameCell = document.createElement('td');
        nameCell.textContent = pracownik.name;
        row.appendChild(nameCell);

        // Manager
        var managerCell = document.createElement('td');
        managerCell.textContent = pracownik.manager;
        row.appendChild(managerCell);

        // Off-tasks
        var offTasksCell = document.createElement('td');
        offTasksCell.textContent = pracownik.offTasks;
        row.appendChild(offTasksCell);

        // Current task
        var currentTaskCell = document.createElement('td');
        currentTaskCell.textContent = pracownik.currentTask;
        currentTaskCell.className = "czp_currenttask";
        row.appendChild(currentTaskCell);

        // Auto
        var rowAutoTask = document.createElement('td');
        rowAutoTask.className = 'czp_auto';
        rowAutoTask.textContent = autoBadges.includes(pracownik.badgeId) ? 'TRUE' : '';
        row.appendChild(rowAutoTask);
        if (autoBadges.includes(pracownik.badgeId)) {
            rowAutoTask.textContent = 'TRUE';
        }


        // Tasks
        row.appendChild(tasksCell);

        // Checkbox
        var rowCheckboxTd = document.createElement('td');
        var rowCheckbox = document.createElement('input');
        rowCheckbox.type = 'checkbox';
        rowCheckbox.style.color = 'white';

        rowCheckboxTd.appendChild(rowCheckbox);
        row.appendChild(rowCheckboxTd);



        // Style dla komórek
        const cells = row.getElementsByTagName('td');
        Array.from(cells).forEach(cell => {
            cell.style.padding = '5px';
            cell.style.textAlign = 'center';
        });

        return row;
    }


    function cleanupTaskDivs() {
        const taskDivs = document.querySelectorAll('div[id^="taskDiv_id_"]');
        taskDivs.forEach(div => div.remove());
    }


    async function getEmployees() {
        const textarea = document.getElementById('pracownicy');
        const employees = [];
        const notFoundEmployees = []; // Nowa tablica dla nieznalezionych pracowników

        if (textarea) {
            const lines = textarea.value
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '');

            const MAX_RETRIES = 3;
            const RETRY_DELAY = 2000;
            const TIMEOUT = 10000;
            const BATCH_SIZE = 5; // Liczba pracowników przetwarzanych równolegle
            const ileWczytanoElem = document.getElementById("lista_ileWczytano");
            const shiftParams = generateShiftParameters();


            // Funkcja pomocnicza do fetch z timeout
            async function fetchWithTimeout(url, options = {}) {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), TIMEOUT);

                try {
                    const response = await fetch(url, {
                        ...options,
                        signal: controller.signal
                    });
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    return response;
                } finally {
                    clearTimeout(timeout);
                }
            }


            // Funkcja do przetwarzania pojedynczego pracownika
            async function processEmployee(line, currentIndex, totalCount) {
                let retries = 0;

                while (retries < MAX_RETRIES) {
                    try {
                        console.log(`Processing employee: ${line}`);

                        const searchUrl = 'https://fclm-portal.amazon.com/ajax/partialEmployeeSearch?term=' + encodeURIComponent(line);
                        const searchResponse = await fetchWithTimeout(searchUrl);
                        const data = await searchResponse.json();

                        if (!data.value || data.value.length === 0) {
                            console.log(`Nie znaleziono pracownika: ${line}`);
                            showError(`Nie znaleziono pracownika: ${line}`);
                            return null;
                        }

                        const matchingEmployee = data.value.find(obj =>
                                                                 obj.employeeLogin == line ||
                                                                 obj.badgeBarcodeId == line ||
                                                                 obj.employeeId == line
                                                                );

                        if (!matchingEmployee) {
                            console.log(`Nie znaleziono dopasowania dla: ${line}`);
                            updateNotFoundList(notFoundEmployees);
                            return null;
                        }

                        if (ileWczytanoElem) {
                            const successfullyLoaded = employees.length;
                            ileWczytanoElem.textContent = successfullyLoaded;
                            const progressText = document.createElement('span');
                            progressText.style.color = '#666';
                            progressText.style.fontSize = '0.8em';
                            progressText.textContent = ` (${currentIndex}/${totalCount})`;
                            ileWczytanoElem.appendChild(progressText);
                        }

                        if (matchingEmployee) {
                            // Drugie zapytanie - dane o taskach
                            const tasksUrl = `https://fclm-portal.amazon.com/employee/timeDetails?warehouseId=KTW1&employeeId=${matchingEmployee.employeeLogin}${shiftParams}`;
                            const tasksResponse = await fetchWithTimeout(tasksUrl);
                            const currentTaskData = await tasksResponse.text();

                            const parser = new DOMParser();
                            const htmlDoc = parser.parseFromString(currentTaskData, 'text/html');
                            const tablicaTasks = htmlDoc.getElementsByClassName("ganttChart")[1];

                            if (!tablicaTasks) {
                                // Jeśli nie ma tabeli tasków, zwróć pracownika z pustymi danymi o taskach
                                return {
                                    badgeId: matchingEmployee.badgeBarcodeId,
                                    employeeId: matchingEmployee.employeeId,
                                    login: matchingEmployee.employeeLogin,
                                    name: matchingEmployee.employeeName,
                                    fclm: `<a href="https://fclm-portal.amazon.com/employee/timeDetails?employeeId=${matchingEmployee.badgeBarcodeId}${shiftParams}" target="_blank">FCLM</a>`,
                                    manager: matchingEmployee.supervisorName,
                                    offTasks: "",
                                    currentTask: "BRAK DANYCH",
                                    task: "<div>Brak danych o taskach</div>"
                                };
                            }

                            if (tablicaTasks) {
                                let currentTask = "";
                                let ifOfftask = "";

                                const lastElement = tablicaTasks.lastElementChild.lastElementChild;
                                const lastElementText = lastElement.children[0].innerText.toLowerCase();

                                if (lastElementText === 'i' || lastElementText === 'm') {
                                    currentTask = tablicaTasks.lastElementChild.lastElementChild.previousElementSibling.children[0].innerText;
                                    if (currentTask.toLowerCase() === lastElementText) {
                                        currentTask = tablicaTasks.lastElementChild.lastElementChild.previousElementSibling.previousElementSibling.children[0].innerText;
                                    }
                                } else {
                                    currentTask = lastElement.children[0].innerText;
                                }

                                for (const child of tablicaTasks.children[1].children) {
                                    if (child.children[0].innerText === 'Time Off Task') {
                                        ifOfftask = "TAK";
                                        break;
                                    }
                                }

                                return {
                                    badgeId: matchingEmployee.badgeBarcodeId,
                                    employeeId: matchingEmployee.employeeId,
                                    login: matchingEmployee.employeeLogin,
                                    name: matchingEmployee.employeeName,
                                    fclm: `<a href="https://fclm-portal.amazon.com/employee/timeDetails?employeeId=${matchingEmployee.badgeBarcodeId}${shiftParams}" target="_blank">FCLM</a>`,
                                    manager: matchingEmployee.supervisorName,
                                    offTasks: ifOfftask,
                                    currentTask: currentTask.trim(),
                                    task: tablicaTasks.outerHTML
                                };
                            }
                        }
                    } catch (error) {
                        console.error(`Error processing ${line}, attempt ${retries + 1}:`, error);
                        retries++;

                        if (retries >= MAX_RETRIES) {
                            showError(`Błąd podczas przetwarzania pracownika: ${line}`);
                            updateNotFoundList(notFoundEmployees);
                            return null;
                        }

                        console.log(`Retrying ${line} in ${RETRY_DELAY}ms...`);
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                    }
                }
                return null;
            }


            // Przetwarzanie pracowników w grupach
            for (let i = 0; i < lines.length; i += BATCH_SIZE) {
                const batch = lines.slice(i, i + BATCH_SIZE);
                console.log(`Processing batch ${i/BATCH_SIZE + 1}/${Math.ceil(lines.length/BATCH_SIZE)}`);

                // Aktualizacja licznika
                if (ileWczytanoElem) {
                    document.getElementById('lista_ile').textContent = lines.length;
                    document.getElementById('lista_ileWczytano').textContent = employees.length;

                    // Aktualizacja listy nieznalezionych
                    if (notFoundEmployees.length > 0) {
                        updateNotFoundList(notFoundEmployees);
                    }
                }

                // Przetwarzanie grupy pracowników równolegle
                const batchResults = await Promise.all(
                    batch.map(async (line, index) => {
                        const currentIndex = i + index + 1;
                        const result = await processEmployee(line, currentIndex, lines.length);
                        if (!result) {
                            notFoundEmployees.push(line);
                        }
                        return result;
                    })
                );

                employees.push(...batchResults.filter(result => result !== null));

                // Krótka przerwa między grupami
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Aktualizacja końcowego licznika z informacją o nieznalezionych pracownikach
            if (ileWczytanoElem) {
                document.getElementById('lista_ile').textContent = lines.length;
                document.getElementById('lista_ileWczytano').textContent = employees.length;

                // Aktualizacja listy nieznalezionych
                if (notFoundEmployees.length > 0) {
                    updateNotFoundList(notFoundEmployees);
                }
            }
        }

        return employees;
    }




    // Funkcja pomocnicza do generowania parametrów URL dla odpowiedniej zmiany
    function generateShiftParameters() {
        const now = new Date();
        const dayShiftStart = new Date(now);
        dayShiftStart.setHours(7, 0, 0, 0);
        const dayShiftEnd = new Date(now);
        dayShiftEnd.setHours(17, 30, 0, 0);
        const nightShiftStart = new Date(now);
        nightShiftStart.setHours(18, 0, 0, 0);

        let startDate, endDate;
        const baseParams = '&maxIntradayDays=1&spanType=Intraday' +
              '&startHourIntraday1=7&startMinuteIntraday1=0' +
              '&startHourIntraday2=17&startMinuteIntraday2=2' +
              '&startHourIntraday3=18&startMinuteIntraday3=0' +
              '&startHourIntraday4=5&startMinuteIntraday4=0';

        if (now >= dayShiftStart && now <= dayShiftEnd) {
            // Zmiana dzienna
            startDate = now;
            endDate = now;
            return `${baseParams}&startDateIntraday=${formatDate(startDate)}` +
                `&startHourIntraday=7&startMinuteIntraday=0` +
                `&endDateIntraday=${formatDate(endDate)}` +
                `&endHourIntraday=17&endMinuteIntraday=30`;
        } else {
            // Zmiana nocna
            if (now.getHours() >= 18) {
                // Przed północą
                startDate = now;
                endDate = new Date(now);
                endDate.setDate(endDate.getDate() + 1);
            } else {
                // Po północy
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 1);
                endDate = now;
            }
            return `${baseParams}&startDateIntraday=${formatDate(startDate)}` +
                `&startHourIntraday=18&startMinuteIntraday=0` +
                `&endDateIntraday=${formatDate(endDate)}` +
                `&endHourIntraday=5&endMinuteIntraday=0`;
        }
    }

    function fetchEmployeesByLogin(login) {
        var url = 'https://fclm-portal.amazon.com/ajax/partialEmployeeSearch?term=' + login;
        return fetchJSON(url);
    }

    function fetchEmployeesByBadgeId(badgeId) {
        var url = 'https://fclm-portal.amazon.com/ajax/partialEmployeeSearch?term=' + badgeId;
        return fetchJSON(url);
    }



    function deleteEmployee() {
        // Pobierz textarea z listą pracowników
        const employeesTextarea = document.getElementById('pracownicy');
        if (!employeesTextarea) return;

        // Pobierz element z licznikiem pracowników
        const employeesCounter = document.getElementById('lista_ile');
        if (!employeesCounter) return;

        // Pobierz aktualną listę pracowników z textarea
        let employeesList = employeesTextarea.value.split('\n').map(e => e.trim()).filter(e => e !== '');

        // Pobierz tabelę pracowników
        const employeesTable = document.getElementById('pracownicyTabela');
        if (!employeesTable) return;

        // Znajdź wszystkie zaznaczone checkboxy w tabeli
        const checkedCheckboxes = employeesTable.querySelectorAll('input[type="checkbox"]:checked');

        checkedCheckboxes.forEach(checkbox => {
            // Znajdź wiersz tabeli zawierający checkbox
            const row = checkbox.closest('tr');
            if (!row) return;

            // Pobierz login, badge i employee ID z wiersza
            const loginElement = row.querySelector('.czp_kto');
            const badgeElement = row.querySelector('.czp_badge');
            const employeeIdElement = row.querySelector('.czp_employeeId');

            const login = loginElement ? loginElement.textContent.trim() : null;
            const badge = badgeElement ? badgeElement.textContent.trim() : null;
            const employeeId = employeeIdElement ? employeeIdElement.textContent.trim() : null;

            // Usuń z autoBadges jeśli istnieje
            const index = autoBadges.indexOf(badge);
            if (index > -1) {
                autoBadges.splice(index, 1);
                localStorage.setItem('autoBadges', JSON.stringify(autoBadges));
            }

            // Usuń wiersz z tabeli
            row.remove();

            // Usuń pracownika z listy w textarea
            if (login && employeesList.includes(login)) {
                employeesList = employeesList.filter(e => e !== login);
            } else if (badge && employeesList.includes(badge)) {
                employeesList = employeesList.filter(e => e !== badge);
            } else if (employeeId && employeesList.includes(employeeId)) {
                employeesList = employeesList.filter(e => e !== employeeId);
            }
        });

        // Zaktualizuj textarea z listą pracowników
        employeesTextarea.value = employeesList.join('\n');

        // Zaktualizuj licznik pracowników
        employeesCounter.textContent = employeesList.length;

        // Najpierw aktualizuj tabelę wynikową
        tabelaWynikowa();

        // Potem zaktualizuj dropdowny
        setTimeout(() => {
            updateTaskDropdowns();
        }, 0);
    }




    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


    function generateShiftString() {
        const now = new Date();

        // Ustalamy daty i godziny dla obu zmian
        const dayShiftStart = new Date(now);
        dayShiftStart.setHours(7, 0, 0, 0); // Dzienna zmiana zaczyna się o 07:00

        const dayShiftEnd = new Date(now);
        dayShiftEnd.setHours(17, 30, 0, 0); // Dzienna zmiana kończy się o 17:30

        const nightShiftStart = new Date(now);
        nightShiftStart.setHours(18, 30, 0, 0); // Nocna zmiana zaczyna się o 18:30

        const nightShiftEnd = new Date(nightShiftStart);
        nightShiftEnd.setDate(nightShiftEnd.getDate() + 1); // Nocna zmiana kończy się następnego dnia
        nightShiftEnd.setHours(5, 0, 0, 0); // Nocna zmiana kończy się o 05:00

        let startDate, endDate, startHour, startMinute, endHour, endMinute;

        // Sprawdzenie, na której zmianie jest teraz praca
        if (now >= dayShiftStart && now <= dayShiftEnd) {
            // Dzienna zmiana
            startDate = endDate = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
            startHour = 7;
            startMinute = 0;
            endHour = 17;
            endMinute = 30;
        } else if (now >= nightShiftStart || now <= nightShiftEnd) {
            // Nocna zmiana (pamiętaj, że nocna zmiana przechodzi na następny dzień)
            if (now >= nightShiftStart) {
                // Jesteśmy między rozpoczęciem nocnej zmiany a północą
                startDate = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
                endDate = `${nightShiftEnd.getFullYear()}/${(nightShiftEnd.getMonth() + 1).toString().padStart(2, '0')}/${nightShiftEnd.getDate().toString().padStart(2, '0')}`;
            } else {
                // Jesteśmy po północy, przed końcem nocnej zmiany
                const previousDay = new Date(now);
                previousDay.setDate(now.getDate() - 1); // Poprzedni dzień
                startDate = `${previousDay.getFullYear()}/${(previousDay.getMonth() + 1).toString().padStart(2, '0')}/${previousDay.getDate().toString().padStart(2, '0')}`;
                endDate = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
            }
            startHour = 18;
            startMinute = 30;
            endHour = 5;
            endMinute = 0;
        } else {
            return "Obecny czas nie mieści się w godzinach zmian";
        }

        // Generowanie ciągu znaków
        return `&maxIntradayDays=1&spanType=Intraday&startDateIntraday=${encodeURIComponent(startDate)}&startHourIntraday=${startHour}&startMinuteIntraday=${startMinute}&endDateIntraday=${encodeURIComponent(endDate)}&endHourIntraday=${endHour}&endMinuteIntraday=${endMinute}`;
    }

    function generateHourlyShiftLinks() {
        const links = [];
        const now = new Date();

        // Definicja zmiany dziennej
        const dayShiftStart = new Date(now);
        dayShiftStart.setHours(7, 0, 0, 0); // 07:00

        const dayShiftEnd = new Date(now);
        dayShiftEnd.setHours(17, 30, 0, 0); // 17:30

        // Definicja zmiany nocnej dla dzisiaj
        const nightShiftStartToday = new Date(now);
        nightShiftStartToday.setHours(18, 30, 0, 0); // 18:30

        const nightShiftEndToday = new Date(nightShiftStartToday);
        nightShiftEndToday.setDate(nightShiftEndToday.getDate() + 1); // Następny dzień
        nightShiftEndToday.setHours(5, 0, 0, 0); // 05:00 następnego dnia

        // Definicja zmiany nocnej dla wczoraj (przy uruchomieniu po północy)
        const nightShiftStartYesterday = new Date(now);
        nightShiftStartYesterday.setDate(nightShiftStartYesterday.getDate() - 1); // Wczoraj
        nightShiftStartYesterday.setHours(18, 30, 0, 0); // 18:30 wczoraj

        const nightShiftEndYesterday = new Date(nightShiftStartYesterday);
        nightShiftEndYesterday.setDate(nightShiftEndYesterday.getDate() + 1); // Następny dzień (dzisiaj)
        nightShiftEndYesterday.setHours(5, 0, 0, 0); // 05:00 następnego dnia

        let shiftStart, shiftEnd;

        if (now >= dayShiftStart && now <= dayShiftEnd) {
            // Zmiana dzienna
            shiftStart = new Date(dayShiftStart);
            shiftEnd = new Date(dayShiftEnd);
        }
        else if (now >= nightShiftStartToday) {
            // Zmiana nocna zaczęta dzisiaj
            shiftStart = new Date(nightShiftStartToday);
            shiftEnd = new Date(nightShiftEndToday);
        }
        else if (now < nightShiftEndYesterday) {
            // Zmiana nocna zaczęta wczoraj
            shiftStart = new Date(nightShiftStartYesterday);
            shiftEnd = new Date(nightShiftEndYesterday);
        }
        else {
            // Obecny czas nie mieści się w żadnej zmianie
            return ["Obecny czas nie mieści się w godzinach zmian"];
        }

        // Logowanie shiftStart i shiftEnd dla debugowania
        console.log("Shift Start:", shiftStart);
        console.log("Shift End:", shiftEnd);

        // Funkcja pomocnicza do formatowania daty w formacie YYYY/MM/DD
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}/${month}/${day}`;
        };

        // Generowanie godzinowych linków od shiftStart do shiftEnd
        let currentStart = new Date(shiftStart);

        while (currentStart < shiftEnd) {
            let currentEnd = new Date(currentStart);
            currentEnd.setHours(currentEnd.getHours() + 1);

            // Jeśli currentEnd przekracza shiftEnd, ustaw end na shiftEnd
            if (currentEnd > shiftEnd) {
                currentEnd = new Date(shiftEnd);
            }

            const startDate = formatDate(currentStart);
            const endDate = formatDate(currentEnd);

            const link = `&maxIntradayDays=1&spanType=Intraday&startDateIntraday=${encodeURIComponent(startDate)}` +
                  `&startHourIntraday=${currentStart.getHours()}` +
                  `&startMinuteIntraday=${currentStart.getMinutes()}` +
                  `&endDateIntraday=${encodeURIComponent(endDate)}` +
                  `&endHourIntraday=${currentEnd.getHours()}` +
                  `&endMinuteIntraday=${currentEnd.getMinutes()}`;

            links.push({
                link: link,
                start: new Date(currentStart),
                end: new Date(currentEnd)
            });

            // Przesuwamy na następny przedział godzinowy
            currentStart = new Date(currentEnd);
        }

        console.log("Generated Links:", links);
        return links;
    }
})();
