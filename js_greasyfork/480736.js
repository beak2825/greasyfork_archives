// ==UserScript==
// @name         Multi-login PIT Operator Check
// @namespace    http://tampermonkey.net/
// @version      1.69
// @description  Check multi-login for PIT Drivers
// @author       nowaratn
// @match        https://customer.crown.com/infolink*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480736/Multi-login%20PIT%20Operator%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/480736/Multi-login%20PIT%20Operator%20Check.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var webhook_url = "https://hooks.chime.aws/incomingwebhooks/e171681e-199a-4d3a-afcf-1f41a8d134b2?token=MGk0N0xPRTZ8MXx0bG4tN3phT2dRR0NUb0YyYlE0WmtyWXh2bDBIWEw1RlRxSHZBMVgyZjhR";

    function watchForElement() {
        const navbarElement = document.getElementById("navcontainer").children[0];

        if(navbarElement)
        {
            // Tworzenie stylowego przełącznika włącz/wyłącz
            const toggleSwitch = document.createElement('input');
            toggleSwitch.type = 'checkbox';
            toggleSwitch.id = 'toggleSwitch';
            toggleSwitch.checked = true;
            toggleSwitch.classList.add('custom-control-input');

            // Tworzenie kontenera dla stylowego przełącznika
            const switchContainer = document.createElement('div');
            switchContainer.classList.add('custom-control', 'custom-switch');
            switchContainer.style = "display:inline-table;";
            switchContainer.id = "multiCheck_div";

            // Tworzenie etykiety dla stylowego przełącznika
            const switchLabel = document.createElement('label');
            switchLabel.htmlFor = 'toggleSwitch';
            switchLabel.classList.add('custom-control-label');
            switchLabel.style = "padding-left:3px;";
            switchLabel.appendChild(document.createTextNode('  Monitoruj podwójne zalogowanie'));

            // Dodanie stylowego przełącznika, kontenera i etykiety do elementu o klasie "nav navbar-nav"

            switchContainer.appendChild(toggleSwitch);
            switchContainer.appendChild(switchLabel);
            navbarElement.appendChild(switchContainer);

            setInterval(() => {
                console.log("sprawdzam . . .");
                setTimeout(() => {
                    performAction();
                }, 2000);
            }, 5000); // Co 5 sekund
        }
        else
        {
            window.location.href = "https://customer.crown.com/group/insite-emea/infolink";
        }

        // Uruchomienie obserwatora
        // observer.observe(document.body, config);
    }

    window.addEventListener("load", (event) => {
        console.log("page is fully loaded");
        setTimeout(() => {

            if(!sessionStorage.getItem("1st_run"))
            {
                let obecnaData = new Date();
                let dataString = obecnaData.toLocaleDateString();
                let godzinaString = obecnaData.toLocaleTimeString();
                let obecnyCzas = `${dataString} ${godzinaString}`;

                let jsonData = JSON.stringify({
                    "Content": "[" + obecnyCzas + "] Uruchomiono **Multi-login PIT Operator Check**"
                });

                // Wysyłanie powiadomienia za pomocą zapytania HTTP
                let requestSettings = {
                    method: 'POST',
                    url: webhook_url, // Upewnij się, że webhook_url jest zdefiniowany
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: jsonData
                };

                GM_xmlhttpRequest(requestSettings);
                sessionStorage.setItem("1st_run",true);
            }

            watchForElement();
        }, 3000);
    });


    const observer = new MutationObserver((mutations, obs) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                console.log("Observer2");
                if (node.matches('#navcontainerHosted')) {

                    // Element pojawił się, wykonaj żądane działanie
                    console.log('Element #navcontainerHosted został dodany');



                    // Opcjonalnie: odłącz obserwatora, jeśli już nie jest potrzebny
                    obs.disconnect();
                }
            });
        });
    });

    // Konfiguracja obserwatora
    const config = { childList: true, subtree: true };




    // Używamy GM_xmlhttpRequest, aby pobrać zawartość strony
    GM_xmlhttpRequest({
        method: 'GET',
        url: "https://hooks.chime.aws",
        onload: function(response) {
            // console.log('Zawartość strony z adresu ' + urlToLoad + ':');
            // console.log(response.responseText);
        },
        onerror: function(error) {
            console.error('Wystąpił błąd podczas ładowania strony:', error);
        }
    });

    var operatorzy_pit = [];
    var operatorzy_pit_wozek;


    // Funkcja do wykonania co 60 sekund
    function performAction() {
        operatorzy_pit = [];
        operatorzy_pit_wozek = [];
        if (document.getElementById("toggleSwitch").checked) {
            console.log("dziala");
            var jazda_str = httpGet(dodajLosowyCzasDoURL("https://customer.crown.com/infolink/fel-nt241/equipment_dashboard.do?method=viewStatusDetail&series=category&cat=WORK"));
            var brak_str = httpGet(dodajLosowyCzasDoURL("https://customer.crown.com/infolink/fel-nt241/equipment_dashboard.do?method=viewStatusDetail&series=category&cat=NOOPERATOR"));
            var stop_str = httpGet(dodajLosowyCzasDoURL("https://customer.crown.com/infolink/fel-nt241/equipment_dashboard.do?method=viewStatusDetail&series=category&cat=STOPPED"));

            const parser = new DOMParser();
            const doc_jazda = parser.parseFromString(jazda_str, 'text/html');
            const doc_brak = parser.parseFromString(brak_str, 'text/html');
            const doc_stop = parser.parseFromString(stop_str, 'text/html');

            var pracownicy_jazda = doc_jazda.querySelectorAll('tr');
            var pracownicy_brak = doc_brak.querySelectorAll('tr');
            var pracownicy_stop = doc_stop.querySelectorAll('tr');

            pracownicy_jazda.forEach(function (element) {
                if(element.children[2] != undefined)
                {
                    var pit = ""
                    pit = element.children[1].innerText.trim();
                    var operator = element.children[2].innerText.trim();

                    if(operator != "Operator" && operator != "Bogusław Szaton" && operator != "Grzegorz Froehlich")
                    {
                        operatorzy_pit.push(operator);
                        if(operatorzy_pit_wozek[operator] == undefined)
                        {
                            operatorzy_pit_wozek[operator] = operator;
                        }

                        operatorzy_pit_wozek[operator] = operatorzy_pit_wozek[operator] + " | " + pit;
                        // console.log(element.children[2].innerText.trim());
                    }
                }
            });

            pracownicy_brak.forEach(function (element) {
                if(element.children[2] != undefined)
                {
                    var pit = element.children[1].innerText.trim();
                    var operator = element.children[2].innerText.trim();

                    if(operator != "Operator" && operator != "Bogusław Szaton" && operator != "Grzegorz Froehlich")
                    {
                        operatorzy_pit.push(operator);
                        if(operatorzy_pit_wozek[operator] == undefined)
                        {
                            operatorzy_pit_wozek[operator] = operator;
                        }

                        operatorzy_pit_wozek[operator] = operatorzy_pit_wozek[operator] + " | " + pit;
                        // console.log(element.children[2].innerText.trim());
                    }
                }
            });

            pracownicy_stop.forEach(function (element) {
                if(element.children[2] != undefined)
                {
                    var pit = element.children[1].innerText.trim();
                    var operator = element.children[2].innerText.trim();

                    if(operator != "Operator" && operator != "Bogusław Szaton" && operator != "Grzegorz Froehlich")
                    {
                        operatorzy_pit.push(operator);
                        if(operatorzy_pit_wozek[operator] == undefined)
                        {
                            operatorzy_pit_wozek[operator] = operator;
                        }

                        operatorzy_pit_wozek[operator] = operatorzy_pit_wozek[operator] + " | " + pit;
                        // console.log(element.children[2].innerText.trim());
                    }
                }
            });

            console.log(operatorzy_pit);
            znajdzPowtarzajaceSieElementy(operatorzy_pit);
            // end if
        }
    }

    const CZAS_POWIADOMENIA = 1800000; // 30 minut w ms
    let buffor = {}; // Zmienna przechowująca powtarzające się operatorzy
    let ostatniePowiadomienie = {}; // Zmienna śledząca czas ostatniego powiadomienia dla każdego operatora

    function znajdzPowtarzajaceSieElementy(operatorzy_pit) {
        buffor = {};
        let wystapienia = {};
        let obecnaData = new Date();
        let powtarzajacySieOperatorzy = [];

        for (let i = 0; i < operatorzy_pit.length; i++) {
            let operator = operatorzy_pit[i];

            if (wystapienia[operator] === undefined) {
                wystapienia[operator] = true;
            } else {
                // Sprawdzanie, czy od ostatniego powiadomienia minęło co najmniej 5 minut
                let ostatniePowiadomienieCzasu = localStorage.getItem(operator);
                let roznicaCzasu = obecnaData.getTime() - ostatniePowiadomienieCzasu;

                console.log("ostatniePowiadomienieCzasu: " + ostatniePowiadomienieCzasu);
                console.log("roznicaCzasu: " + roznicaCzasu);

                if (roznicaCzasu >= CZAS_POWIADOMENIA) {
                    powtarzajacySieOperatorzy.push(operator);
                    // Aktualizacja czasu ostatniego powiadomienia dla tego operatora
                    ostatniePowiadomienie[operator] = obecnaData.getTime();
                    localStorage.setItem(operator, obecnaData.getTime());
                }
            }
        }

        buffor = powtarzajacySieOperatorzy;
        if (buffor.length > 0) {
            chime_msg();
        }

        // Automatyczne kliknięcie na element obrazu (upewnij się, że jest to zamierzone działanie)
        location.reload();
        // document.querySelector('img[name="img1"]').click();
    }

    function chime_msg() {
        let obecnaData = new Date();
        if (buffor.length > 0) {

            var operators = "";

            for(var i = 0;i<buffor.length;i++)
            {
                operators += operatorzy_pit_wozek[buffor[i]] + '\r\n';
            }

            console.log(operators);

            let dataString = obecnaData.toLocaleDateString();
            let godzinaString = obecnaData.toLocaleTimeString();
            let obecnyCzas = `${dataString} ${godzinaString}`;

            const jsonData = JSON.stringify({
                "Content": "[" + obecnyCzas + "]\nWykryto podwójne zalogowanie się na PIT:\n" + operators
            });

            // Wysyłanie powiadomienia za pomocą zapytania HTTP
            const requestSettings = {
                method: 'POST',
                url: webhook_url, // Upewnij się, że webhook_url jest zdefiniowany
                headers: {
                    'Content-Type': 'application/json',
                },
                data: jsonData
            };

            GM_xmlhttpRequest(requestSettings);
        }
    }

    function dodajLosowyCzasDoURL(url) {
        // Generuj losową liczbę
        const losowaLiczba = Math.floor(Math.random() * 1000000000000);

        // Dodaj losową liczbę do adresu URL
        const nowyURL = `${url}&time=${losowaLiczba}`;

        return nowyURL;
    }

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

})();