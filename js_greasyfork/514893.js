// ==UserScript==
// @name         SKYNET - Dacs chime notifications
// @author       @nowaratn
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Monitoruje stronę pod kątem pojawienai się nowych powiadomień DACS, oraz każdorazowo wysyła nowe poprzez wiadomość Chime
// @match        https://dacs.skynet.amazon.dev/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/514893/SKYNET%20-%20Dacs%20chime%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/514893/SKYNET%20-%20Dacs%20chime%20notifications.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja uruchamiana przy starcie strony
    function uruchomPrzyStarcieStrony() {
        var dacs_fc = localStorage.getItem('dacs_fc');
        // var ciastka = document.cookie;
        // var bearer = /(?<=CloudFront-Policy=)(.*)(?=__;)/.exec(ciastka);
        // bearer[0] = bearer[0] + "__";

        var bearer = localStorage.getItem('FCDC_TOKEN');
        console.log(bearer)

        if(!dacs_fc) return alert("Nie wybrano FC w menu skryptu");

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://kayop2qlaa.execute-api.eu-central-1.amazonaws.com/" + dacs_fc + "/alarms",
            headers: {
                Authorization: "Bearer " + bearer
            },
            onload: function(response) {
                let jsonResponse = JSON.parse(response.responseText);
                // console.log("Odpowiedź GET:", response.responseText);
                // Tutaj możesz coś zrobić z odpowiedzią
                processAlarms(jsonResponse);
            }
        });
    }

    let currentCount = 60;

    // Wywołanie funkcji przy starcie strony
    uruchomPrzyStarcieStrony();

    function updateTimer() {
        currentCount--;
        if (currentCount < 0) {
            currentCount = 60;
            uruchomPrzyStarcieStrony(); // Wywołaj funkcję przy zakończeniu odliczania
        }

        document.querySelectorAll('.timer-span').forEach(timerSpan => {
            timerSpan.textContent = currentCount;
        });
    }

    setInterval(updateTimer, 1000);

    // Zbiór do śledzenia przetworzonych elementów
    const przetworzoneElementy = new WeakSet();

    // Funkcja sprawdzająca istnienie elementu i dodająca przycisk
    function sprawdzIDodajPrzycisk() {
        const elements = document.querySelectorAll('.css-5hcp1b');

        elements.forEach(element => {
            if (!przetworzoneElementy.has(element)) {
                // Sprawdź, czy przycisk już został dodany
                if (!element.querySelector('.dodany-przycisk')) {
                    element.style.display = 'block ruby';
                    // Stwórz przycisk
                    const button = document.createElement('img');
                    button.className = 'dodany-przycisk';
                    button.src = 'https://drive.corp.amazon.com/view/nowaratn@/chime_logo_64.png';
                    button.style.float = "right";
                    button.style.width = "30px";
                    button.alt = 'Menu powiadomień na Chime';


                    const timerSpan = document.createElement('span');
                    timerSpan.className = 'timer-span';
                    timerSpan.style = 'float:right;padding-left:5px;';
                    timerSpan.textContent = currentCount;
                    element.appendChild(timerSpan);

                    // Dodaj zdarzenie kliknięcia do przycisku
                    button.addEventListener('click', function() {
                        pokazMenuPopup();
                    });

                    // Dodaj przycisk do elementu
                    element.appendChild(button);
                }

                // Oznacz element jako przetworzony
                przetworzoneElementy.add(element);
            }
        });
    }



    // Funkcja wyświetlająca menu popup
    function pokazMenuPopup() {
        // Stwórz nakładkę
        const overlay = document.createElement('div');
        overlay.id = 'popup-nakladka';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';

        // Stwórz zawartość popup
        const popup = document.createElement('div');
        popup.id = 'popup';
        popup.style.backgroundColor = '#fff';
        popup.style.padding = '20px';
        popup.style.borderRadius = '5px';
        popup.style.position = 'relative';
        popup.style.width = '300px';
        popup.style.boxSizing = 'border-box';

        // Wyśrodkowany tekst
        const centeredText = document.createElement('div');
        centeredText.textContent = 'Webhook URL';
        centeredText.style.textAlign = 'center';
        centeredText.style.marginBottom = '10px';

        // Textbox
        const textbox = document.createElement('input');
        textbox.type = 'text';
        textbox.id = 'popup-textbox';
        textbox.style.width = '100%';
        textbox.style.marginBottom = '10px';


        // Wyśrodkowany tekst #2
        const centeredText2 = document.createElement('div');
        centeredText2.textContent = 'FC';
        centeredText2.style.textAlign = 'center';
        centeredText2.style.marginBottom = '10px';

        // Textbox #2
        const textbox2 = document.createElement('input');
        textbox2.type = 'text';
        textbox2.id = 'popup-textbox2';
        textbox2.style.width = '100%';
        textbox2.style.marginBottom = '10px';


        if(localStorage.getItem('dacs_webhoook'))
        {
            textbox.value = localStorage.getItem('dacs_webhoook');
        }

        if(localStorage.getItem('dacs_fc'))
        {
            textbox2.value = localStorage.getItem('dacs_fc');
        }



        // Guziki
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        const leftButton = document.createElement('button');
        leftButton.textContent = 'Zapisz';

        const rightButton = document.createElement('button');
        rightButton.textContent = 'Prawy Guzik';

        // Dodaj zdarzenia do guzików
        leftButton.addEventListener('click', function() {

            let dane = textbox.value;
            let dacs_fc = textbox2.value;

            localStorage.setItem('dacs_webhoook', dane);
            localStorage.setItem('dacs_fc', dacs_fc);

            document.body.removeChild(overlay);
        });

        rightButton.addEventListener('click', function() {
            // Inna akcja
            console.log('Kliknięto Prawy Guzik');
            // console.log(localStorage.getItem('FCDC_TOKEN'));
            uruchomPrzyStarcieStrony();
            // Zamknij popup
            document.body.removeChild(overlay);
        });

        // Dodaj guziki do kontenera
        buttonContainer.appendChild(leftButton);
        // buttonContainer.appendChild(rightButton);

        // Dodaj elementy do popup
        popup.appendChild(centeredText);
        popup.appendChild(textbox);
        popup.appendChild(centeredText2);
        popup.appendChild(textbox2);
        popup.appendChild(buttonContainer);

        // Dodaj popup do nakładki
        overlay.appendChild(popup);

        // Dodaj nakładkę do body
        document.body.appendChild(overlay);
    }



    function processAlarms(jsonResponse) {

        var webhookURL = localStorage.getItem('dacs_webhoook');

        if(!webhookURL) return;

        // Helper function to format dates as 'DD/MM/YYYY HH:mm'
        function formatDate(dateStr) {
            let date = new Date(dateStr);
            let day = ('0' + date.getDate()).slice(-2);
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let year = date.getFullYear();
            let hours = ('0' + date.getHours()).slice(-2);
            let minutes = ('0' + date.getMinutes()).slice(-2);
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        }

        // Iterate over each alarm in the jsonResponse
        jsonResponse.forEach(function(alarm) {
            let id = alarm.id;
            let storedAlarm = localStorage.getItem('alarm_' + id);

            if (!storedAlarm) {
                // Alarm is not in localStorage, process it
                localStorage.setItem('alarm_' + id, JSON.stringify(alarm));

                let alarmType = alarm.alarmType;
                let message = '';

                // Extract and format common fields
                let CPT_str = formatDate(alarm.CPT);
                let createdAt_str = formatDate(alarm.createdAt);
                let updatedAt_str = formatDate(alarm.updatedAt);

                if (alarmType === 'ExcessVehicleRun') {
                    // Extract specific fields
                    let facilitySequence = alarm.details.facilitySequence;
                    let vehicleRuns = Object.keys(alarm.details.vehicleRuns).join(',');

                    // Create the message string
                    message = `/md ***alarmType:*** ${alarmType}\n***CPT:*** ${CPT_str}\n***facilitySequence:*** ${facilitySequence}\n***vehicleRuns:*** ${vehicleRuns}\n***createdAt:*** ${createdAt_str}\n***updatedAt:*** ${updatedAt_str}`;
                } else if (alarmType === 'TransCapProblem') {
                    // Extract specific fields
                    let truckFilter = alarm.details.truckFilter;
                    let softcap = alarm.details.softcap;
                    let scheduled = alarm.details.scheduled;

                    // Create the message string
                    message = `/md ***alarmType:*** ${alarmType}\n***CPT:*** ${CPT_str}\n***truckFilter:*** ${truckFilter}\n***softcap:*** ${softcap}\n***scheduled:*** ${scheduled}\n***createdAt:*** ${createdAt_str}\n***updatedAt:*** ${updatedAt_str}`;
                } else if (alarmType === 'MissingVehicleRun') {
                    // Extract specific fields
                    let sortCodes = alarm.details.sortCodes.join(',');

                    // Create the message string
                    message = `/md ***alarmType:*** ${alarmType}\n***CPT:*** ${CPT_str}\n***sortCodes:*** ${sortCodes}`;
                }


                GM_xmlhttpRequest({
                    method: "POST",
                    url: webhookURL,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({ Content: message }),
                    onload: function(response) {
                        let jsonResponse = JSON.parse(response.responseText);
                        // console.log("Odpowiedź POST:", jsonResponse);
                        // Tutaj możesz coś zrobić z odpowiedzią
                    }
                });
            }
        });
    }


    // Ustaw MutationObserver do monitorowania zmian w DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Sprawdź dodane węzły
            if (mutation.addedNodes.length > 0) {
                sprawdzIDodajPrzycisk();
            }
        });
    });

    // Rozpocznij obserwację body dokumentu
    observer.observe(document.body, { childList: true, subtree: true });

    // Początkowe sprawdzenie, czy element już istnieje
    sprawdzIDodajPrzycisk();

})();
