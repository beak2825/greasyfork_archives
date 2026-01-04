// ==UserScript==
// @name           CRITS Tote Counter
// @namespace      http://tampermonkey.net/
// @version        0.8
// @description    Liczy ilość Tote z procesu CRITS
// @author         @nowaratn
// @match          https://picking-console.eu.picking.aft.a2z.com/fc/KTW1*
// @grant          GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478485/CRITS%20Tote%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/478485/CRITS%20Tote%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja do analizy kodu strony i zliczania wystąpień
    function countOccurrencesInTable(pageCode) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageCode, 'text/html');

        // Znajdź tabelę w dokumencie
        const table = doc.querySelector('table');

        if (!table) {
            console.log('Nie znaleziono tabeli.');
            return;
        }

        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');

        const occurrencesMap = new Map();
        const occurrencesMap_TSO = new Map();


        const uniqueColumn6TextSet = new Set();
        const uniqueColumn6TextSet_TSO = new Set();

        rows.forEach(row => {
            const columns = row.querySelectorAll('td');
            if (columns.length >= 8) {
                const column13Text = columns[13].textContent.trim();
                const column6Text = columns[6].textContent.trim();
                const column7Text = columns[7].textContent.trim();
                const column1Text = columns[1].textContent.trim();

                if(parseInt(column13Text) < 1)
                {
                    if (column7Text === 'cvRR_INDUCT') {


                        if (!uniqueColumn6TextSet.has(column6Text)) {
                            uniqueColumn6TextSet.add(column6Text); // Dodaj do zbioru, aby oznaczyć jako przetworzone
                            if (occurrencesMap.has(column1Text)) {
                                occurrencesMap.set(column1Text, occurrencesMap.get(column1Text) + 1);
                            } else {
                                occurrencesMap.set(column1Text, 1);
                            }
                        }
                    }

                    if(column7Text === 'cvPR_LANE_TSO') {
                        const column1Text = columns[1].textContent.trim();

                        if (!uniqueColumn6TextSet_TSO.has(column6Text)) {
                            uniqueColumn6TextSet_TSO.add(column6Text); // Dodaj do zbioru, aby oznaczyć jako przetworzone
                            if (occurrencesMap_TSO.has(column1Text)) {
                                occurrencesMap_TSO.set(column1Text, occurrencesMap_TSO.get(column1Text) + 1);
                            } else {
                                occurrencesMap_TSO.set(column1Text, 1);
                            }
                        }
                    }
                }
            }
        });



        document.getElementById("crits_info").innerText = "";
        document.getElementById("crits_info_tso").innerText = "";
        document.getElementById("crits_total").innerText = "";

        // Wyświetlenie wyników
        var total = 0;

        if (occurrencesMap.size === 0) {
            document.getElementById("crits_info").innerText = `0 Tote`;
        }
        else
        {
            occurrencesMap.forEach((count, word) => {
                // console.log(`${word} - ${count} Tote`);

                // Uzupełnij okienko CRITS
                document.getElementById("crits_info").innerText += `${word} - ${count} Tote\r\n`;
                total += count;
            });

            document.getElementById("crits_info").innerText += `TOTAL: ` + total;
            total = 0;
        }

        if (occurrencesMap_TSO.size === 0) {
            document.getElementById("crits_info_tso").innerText = `0 Tote`;
        }
        else
        {
            occurrencesMap_TSO.forEach((count, word) => {
                // console.log(`${word} - ${count} Tote`);

                // Uzupełnij okienko CRITS
                document.getElementById("crits_info_tso").innerText += `${word} - ${count} Tote\r\n`;
                total += count;
            });

            document.getElementById("crits_info_tso").innerText += `TOTAL: ` + total;
            total = 0;
        }
    }

    // Tworzymy guzik
    var button = document.createElement('button');
    button.innerHTML = 'Załaduj stronę';
    button.style.position = 'fixed';
    button.style.top = '10%';
    button.style.left = '50%';
    button.style.transform = 'translate(-50%, -50%)';
    button.style.padding = '15px 30px';
    button.style.fontSize = '18px';
    button.style.zIndex = "9999";
    button.style.display = "none";
    button.id = "crits_btn";

    // Dodajemy obsługę kliknięcia
    button.addEventListener('click', function() {
        var urlToLoad = 'https://rodeo-dub.amazon.com/KTW1/ItemListCSV?_enabledColumns=on&WorkPool=Crossdock&enabledColumns=EULER_GROUP_TYPE&enabledColumns=FAST_TRACK&enabledColumns=OUTER_SCANNABLE_ID&enabledColumns=SORT_CODE&enabledColumns=STACKING_FILTER&enabledColumns=LABEL&enabledColumns=SSP_STATE&Excel=true&ExSDRange.RangeStartMillis=' + TimeToEpoch(-3) + '000&ExSDRange.RangeEndMillis=' + TimeToEpoch(+3) + '000&ProcessPath=UnassignedProcessPath&shipmentType=TRANSSHIPMENTS';  // Zmień ten URL na adres, który chcesz załadować.

        // console.log(urlToLoad);
        // Używamy GM_xmlhttpRequest, aby pobrać zawartość strony
        GM_xmlhttpRequest({
            method: 'GET',
            url: urlToLoad,
            onload: function(response) {
                // console.log('Zawartość strony z adresu ' + urlToLoad + ':');
                // console.log(response.responseText);

                countOccurrencesInTable(response.responseText);
            },
            onerror: function(error) {
                console.error('Wystąpił błąd podczas ładowania strony:', error);
            }
        });
    });

    // Dodajemy guzik do strony
    document.body.appendChild(button);


    setTimeout(function(){
        var crits_div = document.createElement ('div');
        crits_div.innerHTML = '<div class="awsui-util-label">CRITS<div>' +
            '<table style="width:100%;"><thead><tr><th>Linka TSO</th><th>W drodze<br></th></tr></thead>' +
            '<tbody><tr><td id="crits_info_tso"></td><td id="crits_info" style=""></td></tr>' +
            '<tr><td colspan="2" id="crits_total"></td></tr></tbody></table>';
        crits_div.setAttribute ('style', '');
        document.getElementsByClassName("awsui-column-layout-columns-4 awsui-column-layout-columns-multiple awsui-column-layout-variant-default awsui-column-layout-vertical-borders")[0].lastChild.lastChild.appendChild(crits_div);

        document.getElementById("crits_btn").click();

        setInterval(function(){
            document.getElementById("crits_btn").click();
        },10000);
    },5000);

    function TimeToEpoch(daysOffset) {
        // Pobierz obecną datę
        let currentDate = new Date();

        // Dodaj przesunięcie czasowe w dniach
        currentDate.setDate(currentDate.getDate() + daysOffset);

        // Konwertuj do czasu Unix (w sekundach)
        let epochTime = Math.floor(currentDate.getTime() / 1000);

        return epochTime;
    }

})();
