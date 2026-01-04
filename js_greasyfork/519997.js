// ==UserScript==
// @name         Skynet Ship Audit
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Skrypt wykonujący określone czynności na stronie
// @author
// @match        https://skynet.amazon.dev/stage-audit/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/519997/Skynet%20Ship%20Audit.user.js
// @updateURL https://update.greasyfork.org/scripts/519997/Skynet%20Ship%20Audit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isActive = false;
    let intervalId;
    let countdownId;
    let timeLeft = 60;

    // Sprawdź czy jesteśmy na właściwej stronie
    function isCorrectPage() {
        console.log("correct page");
        console.log(window.location.pathname.includes('stage-audit/KTW1'));
        return window.location.pathname.includes('stage-audit/KTW1');
    }

    function updateCountdown() {
        const statusElement = document.getElementById('scriptStatus');
        if (statusElement && isActive) {
            statusElement.textContent = `Następne wykonanie za: ${timeLeft} sekund`;
            timeLeft--;
            if (timeLeft < 0) {
                timeLeft = 180;
            }
        }
    }

    function addButton(element) {
        if (element.querySelector('#myTampermonkeyButton')) {
            return;
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = '';
        buttonContainer.style.alignItems = 'left';
        buttonContainer.style.gap = '10px';

        const button = document.createElement('button');
        button.id = 'myTampermonkeyButton';
        button.textContent = 'Aktywuj';
        button.style.marginLeft = '10px';
        button.style.padding = '5px';

        const status = document.createElement('div');
        status.id = 'scriptStatus';
        status.style.marginLeft = '10px';
        status.style.fontSize = 'xx-small';

        buttonContainer.appendChild(button);
        buttonContainer.appendChild(status);
        element.appendChild(buttonContainer);

        button.addEventListener('click', function() {
            isActive = !isActive;
            if (isActive) {
                button.textContent = 'Aktywny';
                button.style.backgroundColor = 'green';
                timeLeft = 180; // Reset licznika
                startFunction();
            } else {
                button.textContent = 'Aktywuj';
                button.style.backgroundColor = '';
                stopFunction();
                status.textContent = '';
            }
        });

    }

    function checkAndAddButton() {
        if (!isCorrectPage()) return;

        const existingElement = document.querySelector('.css-18md5b0');
        if (existingElement && !existingElement.querySelector('#myTampermonkeyButton')) {
            addButton(existingElement);
        }
    }

    function observeDOM() {
        if (!isCorrectPage()) return;

        checkAndAddButton();

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('css-18md5b0')) {
                        addButton(node);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function startFunction() {
        executeRequests();
        intervalId = setInterval(executeRequests, 60000);
        timeLeft = 180;
        countdownId = setInterval(updateCountdown, 1000); // Dodane uruchomienie licznika
    }

    function stopFunction() {
        clearInterval(intervalId);
        clearInterval(countdownId);
    }



    // Funkcja wykonująca zapytania jeden po drugim
    function executeRequests() {
        // Pobieramy dane z tabeli
        const table = document.querySelector('table');
        if (!table) {
            console.error('Nie znaleziono tabeli o klasie css-1pqhxit');
            return;
        }

        const rows = table.querySelectorAll('tr');
        let texts = [];
        let cont = [];

        rows.forEach(function(row) {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return; // Sprawdzamy, czy są przynajmniej 2 kolumny
            const lastCell = cells[cells.length - 1];
            if (lastCell.querySelector('.css-4c2zid')) {
                const secondCellText = cells[1].textContent.trim();
                texts.push(secondCellText);
                cont.push(secondCellText);
            }
        });

        if (texts.length === 0) {
            console.warn('Nie znaleziono żadnych tekstów do przetworzenia.');
            const button = document.getElementById('myTampermonkeyButton');
            if (button) {
                button.style.backgroundColor = "";
                button.textContent = "Git";

                // Zatrzymujemy licznik na czas komunikatu
                clearInterval(countdownId);
                document.getElementById('scriptStatus').textContent = '';

                setTimeout(() => {
                    if (isActive) { // Sprawdzamy czy skrypt nadal jest aktywny
                        button.textContent = "Aktywny";
                        button.style.backgroundColor = "green";
                        // Ponownie uruchamiamy licznik
                        timeLeft = 180;
                        countdownId = setInterval(updateCountdown, 1000);
                    }
                }, 5000);
            }
            return;
        }

        // Przetwarzanie tekstów sekwencyjnie
        processTextsSequentially(texts, cont, 0);
    }

    // Funkcja rekurencyjna do przetwarzania tekstów jeden po drugim
    function processTextsSequentially(texts, cont, index) {
        if (index >= texts.length) {
            // Wszystkie teksty zostały przetworzone
            return;
        }

        const currentText = texts[index];
        const contai = cont[index];
        // Podaj tutaj URL do którego ma być wykonywane zapytanie GET z aktualnym tekstem
        const url = `https://skynet.amazon.dev/get-container?fc=KTW1&container=${encodeURIComponent(currentText)}`; // <-- Zmień na właściwy URL

        // Wykonujemy zapytanie GET
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    const container_id = data.container_id;
                    const jejson = JSON.stringify("{\"fc\":\"KTW1\",\"container\":\""+ contai +"\",\"container_id\":\"" + container_id + "\",\"checkedCheckWrongLabel\":false}",);
                    console.log("jejson: " + jejson);
                    console.log("container_id: " + container_id);
                    console.log("contai: " + contai);

                    if (container_id) {
                        // Wykonujemy fetch z użyciem container_id
                        const fetchUrl = `https://skynet.amazon.dev/audit-container`; // <-- Zmień na właściwy URL
                        fetch("https://skynet.amazon.dev/audit-container", {
                            "credentials": "include",
                            "headers": {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                                "Accept": "*/*",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Content-Type": "application/json",
                                "Sec-Fetch-Dest": "empty",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "same-origin",
                                "Priority": "u=0"
                            },
                            "body": "{\"fc\":\"KTW1\",\"container\":\"" + contai + "\",\"container_id\":\"" + container_id + "\",\"checkedCheckWrongLabel\":false}",
                            "method": "POST",
                            "mode": "cors"
                        });
                        processTextsSequentially(texts, cont, index + 1);

                    } else {
                        console.error('Nie znaleziono container_id w odpowiedzi');
                        // Kontynuuj z następnym tekstem
                        processTextsSequentially(texts, cont, index + 1);
                    }
                } catch (e) {
                    console.error('Błąd podczas parsowania JSON:', e);
                    // Kontynuuj z następnym tekstem
                    processTextsSequentially(texts, cont, index + 1);
                }
            },
            onerror: function(err) {
                console.error('Błąd podczas wykonywania zapytania GET:', err);
                // Kontynuuj z następnym tekstem
                processTextsSequentially(texts, cont, index + 1);
            }
        });

        document.getElementById('myTampermonkeyButton').style.backGroundColor = "";
    }

    // Nasłuchiwanie zmian URL
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (isCorrectPage()) {
                setTimeout(checkAndAddButton, 1000);
            }
        }
    }).observe(document, {subtree: true, childList: true});

    // Inicjalizacja
    if (isCorrectPage()) {
        setTimeout(checkAndAddButton, 1000);
    }

    // Uruchamiamy obserwator DOM
    observeDOM();

})();

