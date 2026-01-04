// ==UserScript==
// @name         Salesmasters X-KOM
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Dodaje menu z prawej strony i przycisk do h1, zapisuje dane na bieżąco
// @author       TomaszFromasz
// @match        https://www.x-kom.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512175/Salesmasters%20X-KOM.user.js
// @updateURL https://update.greasyfork.org/scripts/512175/Salesmasters%20X-KOM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Globalna tablica do przechowywania danych
    var dataEntries = [];

    // Zastąp poniższe wartości swoimi danymi logowania
    const formdata = new FormData();
    formdata.append("username", "uksz.testuje@interia.pl"); // Podaj swój adres e-mail
    formdata.append("password", "zvAnBxJ93cH2"); // Podaj swoje hasło
    formdata.append("grant_type", "password");

    // Funkcja do tworzenia menu
    function createMenu() {
        // Sprawdź, czy menu już istnieje
        if (document.getElementById('myMenuContainer')) return;

        // Stwórz kontener dla menu
        var menuContainer = document.createElement('div');
        menuContainer.id = 'myMenuContainer';
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '50px';
        menuContainer.style.right = '0';
        menuContainer.style.width = '300px';
        menuContainer.style.backgroundColor = '#f1f1f1';
        menuContainer.style.border = '1px solid #ccc';
        menuContainer.style.padding = '10px';
        menuContainer.style.zIndex = '1000';

        // Stwórz przycisk do chowania/pokazywania menu
        var toggleButton = document.createElement('button');
        toggleButton.id = 'toggleMenuButton';
        toggleButton.textContent = 'Pokaż/Ukryj Menu';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.zIndex = '1001';

        toggleButton.addEventListener('click', function() {
            if (menuContainer.style.display === 'none') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        });

        document.body.appendChild(toggleButton);

        // Stwórz textarea
        var textarea = document.createElement('textarea');
        textarea.id = 'myTextarea';
        textarea.style.width = '100%';
        textarea.style.height = '100px';
        textarea.readOnly = true; // Ustaw na tylko do odczytu, ponieważ zawartość jest generowana
        menuContainer.appendChild(textarea);

        // Dodaj 2 checkboxy w jednej linii
        var checkboxContainer = document.createElement('div');
        checkboxContainer.id = 'myCheckboxContainer';
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.marginTop = '10px';

        var labelFacebook = document.createElement('label');
        labelFacebook.style.marginRight = '10px';
        labelFacebook.textContent = 'Facebook';
        var checkboxFacebook = document.createElement('input');
        checkboxFacebook.type = 'checkbox';
        checkboxFacebook.id = 'myCheckbox_facebook';
        labelFacebook.prepend(checkboxFacebook);

        var labelDiscord = document.createElement('label');
        labelDiscord.style.marginRight = '10px';
        labelDiscord.textContent = 'Discord';
        var checkboxDiscord = document.createElement('input');
        checkboxDiscord.type = 'checkbox';
        checkboxDiscord.id = 'myCheckbox_discord';
        labelDiscord.prepend(checkboxDiscord);

        checkboxContainer.appendChild(labelFacebook);
        checkboxContainer.appendChild(labelDiscord);

        menuContainer.appendChild(checkboxContainer);

        // Stwórz guzik, który będzie wykonywał akcję
        var actionButton = document.createElement('button');
        actionButton.id = 'myActionButton';
        actionButton.textContent = 'Postuj w wybranych';
        actionButton.style.marginTop = '10px';
        actionButton.addEventListener('click', function() {
            // Tutaj dodaj kod akcji
            alert('Akcja została wykonana!');
        });
        actionButton.disabled = true;
        menuContainer.appendChild(actionButton);

        var hr = document.createElement('hr');
        hr.style = "margin-top:10px;margin-bottom:10px;";
        menuContainer.appendChild(hr);

        // Label i checkbox do pokazywania nazw produktów
        var labelPokazNazwy = document.createElement('label');
        labelPokazNazwy.style.display = 'block'; // Aby znajdował się w osobnej linii
        labelPokazNazwy.style.marginTop = '10px';
        labelPokazNazwy.textContent = 'Pokaż nazwy produktów';
        var checkboxPokazNazwy = document.createElement('input');
        checkboxPokazNazwy.type = 'checkbox';
        checkboxPokazNazwy.id = 'checkbox_pokaznazwy'; // Poprawiony id
        labelPokazNazwy.prepend(checkboxPokazNazwy);
        menuContainer.appendChild(labelPokazNazwy);

        // Stwórz guzik, który czyści
        var clearButton = document.createElement('button');
        clearButton.id = 'clearButton';
        clearButton.textContent = 'Czyść wszystko/kasuj pamięć';
        clearButton.style.marginTop = '10px';
        clearButton.addEventListener('click', function() {
            // Wyczyść dataEntries i localStorage
            dataEntries = [];
            saveData();
            updateTextarea();
            alert('Dane zostały wyczyszczone!');
        });
        menuContainer.appendChild(clearButton);

        document.body.appendChild(menuContainer);

        // Wczytaj zapisane dane
        loadData();

        // Nasłuchuj zmian i zapisuj dane
        addEventListeners();
    }

    // Funkcja do zapisywania danych
    function saveData() {
        // Zapisz dataEntries w localStorage
        localStorage.setItem('myMenuData', JSON.stringify(dataEntries));
    }

    // Funkcja do wczytywania danych
    function loadData() {
        var savedData = localStorage.getItem('myMenuData');
        if (savedData) {
            dataEntries = JSON.parse(savedData);
        }
        updateTextarea();
    }

    // Funkcja do aktualizacji textarea na podstawie dataEntries i stanu checkboxa
    function updateTextarea() {
        var textarea = document.getElementById('myTextarea');
        var checkboxPokazNazwy = document.getElementById('checkbox_pokaznazwy');
        var showNames = checkboxPokazNazwy.checked;
        var content = '';
        dataEntries.forEach(function(entry) {
            if (showNames) {
                content += entry.name + ' - ' + entry.link + '\n';
            } else {
                content += entry.link + '\n';
            }
        });
        textarea.value = content.trim();
    }

    // Funkcja do dodawania nasłuchiwaczy zdarzeń
    function addEventListeners() {
        // Nasłuchuj zmian w checkboxie "Pokaż nazwy produktów"
        var checkboxPokazNazwy = document.getElementById('checkbox_pokaznazwy');
        checkboxPokazNazwy.addEventListener('change', function() {
            updateTextarea();
        });

        // Tutaj możesz dodać inne nasłuchiwacze zdarzeń
    }

    // Funkcja do dodania przycisku do h1
    function addButtonToH1() {
        var h1Element = document.querySelector('h1');
        if (h1Element) {
            var h1Button = document.createElement('button');
            h1Button.id = 'h1Button';
            h1Button.textContent = '';
            h1Button.style = 'width:20%;height:40%;margin-left:10px;background-image:url("https://salesmasters.x-kom.pl/_next/static/media/SalesMasters_150x36.9b283c8e.svg");background-repeat: no-repeat; background-size: contain;';
            h1Button.addEventListener('click', function() {
                // Pobierz nazwę produktu z h1
                var productName = h1Element.textContent.trim();

                // Pierwsze zapytanie, które otrzyma ciasteczka
                fetch("https://salesmastersapi2.x-kom.pl/api/v1/Account/Token", {
                    method: "POST",
                    body: formdata,  // Używamy FormData dla multipart/form-data
                    credentials: 'include'  // Ważne, aby otrzymać i wysyłać ciasteczka
                })
                    .then(response => {
                    if (!response.ok) {
                        // Rzuć błąd, jeśli status nie jest OK
                        throw new Error("Niepowodzenie zapytania, status: " + response.status);
                    }
                    return response.json(); // Parsujemy odpowiedź jako JSON
                })
                    .then(data => {
                    console.log("Zalogowano i otrzymano dane:", data);

                    // Wykonanie kolejnego zapytania, z użyciem tych samych ciasteczek
                    return fetch("https://salesmastersapi2.x-kom.pl/api/v1/Links/Generate", {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ link: window.location.href })
                    });
                })
                    .then(response => response.json()) // Parsujemy odpowiedź jako JSON
                    .then(function(data) {
                    var newEntry = {
                        name: productName,
                        link: data["link"]
                    };
                    dataEntries.push(newEntry);
                    saveData();
                    updateTextarea();
                })
                    .catch(error => console.error("Error:", error));
            });
            h1Element.appendChild(h1Button);
        }
    }


    // Funkcja pomocnicza do oczekiwania na dostępność elementu
    function waitForElement(selector, callback) {
        var element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            var observer = new MutationObserver(function(mutations, obs) {
                var el = document.querySelector(selector);
                if (el) {
                    callback(el);
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    waitForElement('body', createMenu);
    waitForElement('h1', addButtonToH1);

    // Uruchomienie createMenu, gdy dokument jest w pełni załadowany
    document.addEventListener('DOMContentLoaded', function() {

    });
})();
