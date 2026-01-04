// ==UserScript==
// @name         ŁORKFORS REJTS
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  ŁORK FORS
// @author       @nowaratn
// @match        https://picking-console.eu.picking.aft.a2z.com/fc/KTW1/pick-workforce
// @icon         https://www.google.com/s2/favicons?sz=64&domain=a2z.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/510323/%C5%81ORKFORS%20REJTS.user.js
// @updateURL https://update.greasyfork.org/scripts/510323/%C5%81ORKFORS%20REJTS.meta.js
// ==/UserScript==

// Użycie funkcji
(async function() {
    const url = 'https://fclm-portal.amazon.com/reports/functionRollup?reportFormat=CSV&warehouseId=KTW1&processId=1003001' + generateShiftString(); // Wstaw swój URL
    console.log(url);

    try {
        const result = await getData(url);
        // console.log('Pobrane dane:', result);
        let rows = result.split("\n");

        // Podział na kolumny, konwertujemy każdy wiersz do tablicy
        let csv_table = rows.map(row => parseCSVRow(row));
        // console.log(csv_table);

        // Process Name | Function Name | Employee Type | Employee Id | Name | Manager | "Paid Hours-Small(function | employee)" | "Paid Hours-Medium(function | employee)" | "Paid Hours-Large(function | employee)" | "Paid Hours-HeavyBulky(function | employee)" | "Paid Hours-Total(function | employee)" | Job Action | Jobs | JPH | Unit Type | Size | Units | UPH
        // Zakładamy, że pierwszy wiersz to nagłówek
        let headers = csv_table[0];


        // Funkcja zamieniająca wiersz na obiekt z kluczami jako nazwami nagłówków
        function rowToObject(row, headers) {
            let rowObject = {};
            headers.forEach((header, index) => {
                rowObject[header] = row[index]; // Mapujemy nagłówki do wartości
            });
            return rowObject;
        }

        // Funkcja do filtrowania po dwóch kolumnach: ID i rozmiar
        function findRowsByIDAndSize(id, size, idColumnIndex = 4, sizeColumnIndex = 15) {
            // Zamieniamy wiersze na obiekty i filtrujemy po ID oraz rozmiarze
            return csv_table
                .map(row => rowToObject(row, headers)) // Zamieniamy każdy wiersz na obiekt
                .filter(rowObject => rowObject[headers[idColumnIndex]] === id.toString() &&
                        rowObject[headers[sizeColumnIndex]] === size.toString());
        }

        // Deklarujemy flagę, aby zapobiec rekurencyjnym wywołaniom
        let isUpdating = false;

        // Funkcja aktualizująca kolumnę UPH
        function updateUPHColumn() {
            if (isUpdating) return;
            isUpdating = true;

            // Pobieramy wszystkie wiersze tabeli z tbody
            let tableRows = document.querySelectorAll('.awsui-table-row');

            tableRows.forEach(row => {
                // Usuwamy istniejącą komórkę UPH, jeśli istnieje
                let existingUPHCell = row.querySelector('.uph-cell');
                if (existingUPHCell) {
                    existingUPHCell.remove();
                }

                // Wyciągamy ID z konkretnej komórki
                let idToFind = row.children[2].textContent.trim(); // Dostosuj indeks do swojej tabeli
                let sizeToFind = "Total";
                let foundRows = findRowsByIDAndSize(idToFind, sizeToFind);
                console.log(foundRows);
                let UPH = 0;

                if (foundRows.length > 0) {
                    foundRows.forEach(rowData => {
                        UPH += parseFloat(rowData["UPH"]);
                    });
                    UPH = UPH / foundRows.length;

                    // Tworzymy nową komórkę dla UPH
                    let uphCell = document.createElement('td');
                    uphCell.textContent = UPH.toFixed(2);
                    uphCell.classList.add('awsui-table-cell', 'uph-cell');

                    // Przechowujemy wartość UPH w dataset wiersza dla sortowania
                    row.dataset.uph = UPH;

                    // Dodajemy komórkę UPH do wiersza
                    row.appendChild(uphCell);
                } else {
                    // Tworzymy pustą komórkę dla UPH
                    let uphCell = document.createElement('td');
                    uphCell.textContent = '-';
                    uphCell.classList.add('awsui-table-cell', 'uph-cell');

                    // Przechowujemy wartość UPH jako zero
                    row.dataset.uph = 0;

                    // Dodajemy komórkę UPH do wiersza
                    row.appendChild(uphCell);
                }
            });

            isUpdating = false;
        }

        // Funkcja sortująca tabelę po kolumnie UPH
        function sortTableByUPH(uphHeader) {
            if (isUpdating) return;
            isUpdating = true;

            // Pobieramy ciało tabeli
            let tableBody = document.querySelector('.awsui-table-nowrap tbody');
            let tableRows = Array.from(document.querySelectorAll('.awsui-table-row'));

            // Określamy bieżący porządek sortowania
            let sortOrder = uphHeader.dataset.sortOrder === 'asc' ? 'desc' : 'asc';
            uphHeader.dataset.sortOrder = sortOrder;

            // Aktualizujemy nagłówek, aby pokazać wskaźnik sortowania
            uphHeader.classList.remove('sorted-asc', 'sorted-desc');
            if (sortOrder === 'asc') {
                uphHeader.classList.add('sorted-asc');
            } else {
                uphHeader.classList.add('sorted-desc');
            }

            // Usuwamy wskaźniki sortowania z innych nagłówków
            let headerRow = uphHeader.parentElement;
            let headerCells = headerRow.querySelectorAll('td, th');
            headerCells.forEach(function(cell) {
                if (cell !== uphHeader) {
                    cell.classList.remove('sorted-asc', 'sorted-desc');
                    cell.dataset.sortOrder = 'none';
                }
            });

            // Sortujemy wiersze na podstawie wartości UPH
            tableRows.sort(function(a, b) {
                let uphA = parseFloat(a.dataset.uph);
                let uphB = parseFloat(b.dataset.uph);

                if (isNaN(uphA)) uphA = -Infinity;
                if (isNaN(uphB)) uphB = -Infinity;

                if (sortOrder === 'asc') {
                    return uphA - uphB;
                } else {
                    return uphB - uphA;
                }
            });

            // Usuwamy wszystkie istniejące wiersze z ciała tabeli
            while (tableBody.firstChild) {
                tableBody.removeChild(tableBody.firstChild);
            }

            // Ponownie dodajemy posortowane wiersze
            tableRows.forEach(function(row) {
                tableBody.appendChild(row);
            });

            isUpdating = false;
        }

        // Funkcja dodająca nagłówek UPH z funkcjonalnością sortowania
        function addUPHHeader() {
            // Dodajemy nową kolumnę nagłówka "UPH" do tabeli
            let tableHeaderRow = document.querySelector('.awsui-table-sticky-active');

            if (tableHeaderRow) {
                // Pobieramy wiersz nagłówka (<tr> wewnątrz <thead>)
                let headerRow = tableHeaderRow.children[0]; // Zakładając, że thead zawiera jeden <tr>
                if (headerRow) {
                    let uphHeader = document.createElement('td'); // Używamy 'td' jeśli nagłówki są 'td'
                    uphHeader.textContent = 'UPH';
                    uphHeader.className = 'awsui-table-column-sortable awsui-table-column-sortable-enabled';

                    // Inicjalizujemy porządek sortowania
                    uphHeader.dataset.sortOrder = 'none';

                    // Dodajemy nasłuchiwanie kliknięć do nagłówka UPH
                    uphHeader.addEventListener('click', function() {
                        sortTableByUPH(uphHeader);
                    });

                    // Dodajemy komórkę nagłówka UPH do wiersza nagłówka
                    headerRow.appendChild(uphHeader);
                }
            }
        }

        // Ustawiamy MutationObserver do wykrywania zmian w tabeli i aktualizacji kolumny UPH
        function observeTableChanges() {
            // Pobieramy element ciała tabeli
            // Ustawiamy MutationObserver do wykrywania zmian w tabeli
            const tableBody = document.querySelector('.awsui-table tbody');
            if (tableBody) {
                const observer = new MutationObserver(function(mutationsList, observer) {
                    if (isUpdating) return;

                    updateUPHColumn();
                });

                observer.observe(tableBody, { childList: true });
            }
        }

        setTimeout(function(){
            // Inicjalizacja
            addUPHHeader();
            updateUPHColumn();
            observeTableChanges();
        },5000);



    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
    }
})();


function parseCSVRow(row) {
    const result = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < row.length; i++) {
        const char = row[i];

        if (char === '"' && insideQuotes) {
            // Sprawdzamy, czy to podwójny cudzysłów (escape character)
            if (row[i + 1] === '"') {
                current += '"';
                i++; // Pomijamy następny znak
            } else {
                // Koniec sekwencji w cudzysłowie
                insideQuotes = false;
            }
        } else if (char === '"') {
            // Początek sekwencji w cudzysłowie
            insideQuotes = true;
        } else if (char === ',' && !insideQuotes) {
            // Rozdzielamy po przecinku, tylko jeśli nie jesteśmy w cudzysłowie
            result.push(current.trim());
            current = '';
        } else {
            // Zwykłe znaki
            current += char;
        }
    }

    // Dodaj ostatnią wartość (jeśli jakakolwiek pozostała)
    result.push(current.trim());
    return result;
}

// Funkcja GET przy użyciu GM_xmlhttpRequest
function getData(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                // Sprawdź, czy żądanie zakończyło się sukcesem
                if (response.status >= 200 && response.status < 300) {
                    // Zwróć dane z odpowiedzi
                    resolve(response.responseText);
                } else {
                    // Obsłuż błędy
                    reject(`Błąd: ${response.status} ${response.statusText}`);
                }
            },
            onerror: function(error) {
                // Obsłuż błędy sieciowe
                reject(`Błąd sieci: ${error}`);
            }
        });
    });
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


