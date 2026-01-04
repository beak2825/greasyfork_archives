// ==UserScript==
// @name         SPOO Units Check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sprawdź ilość unitów dla podanych SPOO
// @author       @nowaratn
// @match        https://eagleeye.amazon.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.dev
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478502/SPOO%20Units%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/478502/SPOO%20Units%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self === window.top) {
        var spoo_ship = "";

        // Tworzymy iframe
        var iframe = document.createElement('iframe');
        iframe.id = "ee_iframe";
        iframe.style = "position:fixed;top:30%;right:10%;width:60%;height:60%;display:none;";
        iframe.src = ''; // Początkowo puste źródło

        // Dodajemy iframe do body
        document.body.appendChild(iframe);


        setInterval(function(){
            if(document.getElementsByClassName("css-1tjbqgb")[0] != undefined && document.getElementsByClassName("css-1tjbqgb")[0] != null && document.getElementById("spoo_button_id") == undefined)
            {
                var spoo_tab = document.createElement ('button');
                spoo_tab.setAttribute ('id', 'spoo_button_id');
                spoo_tab.textContent = 'SPOO';
                spoo_tab.setAttribute ('class', 'css-sngdlq');
                document.getElementsByClassName("css-1tjbqgb")[0].appendChild(spoo_tab);

                var spoo_textarea = document.createElement ('div');
                spoo_textarea.setAttribute ('id', 'spoo_textarea_div');
                spoo_textarea.innerHTML = '<span>Lista SPOO: </span>(<span id="lista_ile">0</span>)' +
                    '<br>' +
                    '<textarea id="spoo_textarea_id" style="height:100%;width:100%;"></textarea>' +
                    '<br>' +
                    '<input type="button" id="spoo_textarea_button" value="Sprawdź ilość unitów" style="float:right;">';
                spoo_textarea.style = 'display:none;z-index:9999;top:15%;left:1%;height:65%;width:10%;position:absolute;';
                document.getElementsByTagName("body")[0].appendChild(spoo_textarea);

                document.getElementById("spoo_textarea_id").addEventListener('input', obslugaZmiany);


                spoo_tab.addEventListener("click", function () {
                    if(spoo_textarea.style.display == "none")
                    {
                        spoo_textarea.style.display = "block";
                    }
                    else
                    {
                        spoo_textarea.style.display = "none";
                    }
                });


                // Create the overlay and loading indicator elements
                const overlay = document.createElement('div');
                overlay.id = 'overlay';
                const loadingIndicator = document.createElement('div');
                loadingIndicator.id = 'loading-indicator';
                loadingIndicator.innerHTML = '<p>Loading...</p>';

                // Append overlay and loading indicator to the body
                document.body.appendChild(overlay);
                overlay.appendChild(loadingIndicator);


                // Naciśnięcie przycisku sprawdź
                document.getElementById("spoo_textarea_button").addEventListener("click", function () {

                    // Ustaw overlay na loading
                    const overlay = document.getElementById('overlay');
                    overlay.style.display = 'block';

                    // Wywołaj funkcję przy załadowaniu strony
                    divideAndPerformAction();

                });

                // Funkcja do dzielenia textarea i wykonania akcji na paczkach danych
                function divideAndPerformAction() {
                    console.log("divideAndPerformAction");
                    var iframe = document.getElementById('ee_iframe'); // Zastąp 'moj-iframe' odpowiednim identyfikatorem iframe

                    // Pobierz textarea
                    var textarea = document.getElementById('spoo_textarea_id'); // Zmień 'myTextarea' na odpowiednią nazwę ID textarea
                    var lines = textarea.value.split('\n');
                    var batchSize = 50;
                    var currentIndex = 0;

                    // Rozpocznij przetwarzanie paczek danych
                    console.log("procesuj batche");
                    processBatch();

                    function processBatch() {
                        // console.log("currentIndex: " + currentIndex);
                        // console.log("lines.length: " + lines.length);

                        if (currentIndex < lines.length) {
                            var batch = lines.slice(currentIndex, currentIndex + batchSize).join('%2C');
                            console.log('Paczka danych ' + (currentIndex / batchSize + 1) + ':');
                            console.log(batch);
                            currentIndex += batchSize;

                            // Otwórz iFrame z batchem
                            iframe.src = "https://eagleeye.amazon.dev/search?redirect=false&lang=en_US&region=EU&format=leg&nodeInfo=&shipmentType=scannable&searchId=" + batch;

                            waitForElementAndPerformAction();
                        }
                    }

                    function waitForElementAndPerformAction()
                    {
                        iframe = document.getElementById('ee_iframe');
                        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                        var searchResultsElement = iframeDocument.querySelector('.package-search-results');

                        if (searchResultsElement)
                        {
                            // document.getElementsByClassName("package-details-cell")[0].lastChild.children[1].innerText
                            for(var z = 1;z<=iframeDocument.getElementsByClassName("package-search-results")[0].children.length;z++)
                            {
                                var wynik = iframeDocument.getElementsByClassName("package-search-results")[0].children[z];
                                if(wynik != undefined)
                                {
                                    spoo_ship += wynik.getElementsByClassName("package-details-cell")[0].children[0].children[1].innerText + "|" + wynik.getElementsByClassName("package-details-cell")[2].children[0].children[1].innerText + ";";
                                }
                            }

                            console.log(spoo_ship);
                            console.log("currentIndex: " + currentIndex);
                            console.log("lines.length: " + lines.length);

                            // skończyło przypisywać shipment_id do spoo
                            if (currentIndex > lines.length)
                            {
                                // Wywołaj funkcje sprawdzenia batchy
                                var tablica_spoo = spoo_ship.split(';');
                                var spoo_textarea = document.getElementById("spoo_textarea_id");

                                // console.log("tablica_spoo.lines: " + tablica_spoo.length);
                                // console.log("lines.length: " + lines.length);


                                for(var b = 0;b<tablica_spoo.length - 1;b++)
                                {
                                    var jedno_spoo = tablica_spoo[b].split('|');
                                    // console.log("jedno_spoo: " + jedno_spoo);

                                    setTimeout(ilosc_unitow(jedno_spoo[0],jedno_spoo[1]),5000);
                                }
                            }
                            else
                            {
                                console.log("Clearing iFrame...")
                                var html = "";

                                iframe.contentWindow.document.open();
                                iframe.contentWindow.document.write(html);
                                iframe.contentWindow.document.close();

                                setTimeout(processBatch,25000);
                            }
                        }
                        else
                        {
                            console.log("czekam");
                            // Jeśli element nie jest jeszcze dostępny, poczekaj i sprawdź ponownie za chwilę.
                            setTimeout(waitForElementAndPerformAction, 1000); // Możesz dostosować czas oczekiwania według potrzeb.
                        }
                    }
                }
            }


            function hideLoadingOverlay() {
                const overlay = document.getElementById('overlay');
                if (overlay) {
                    overlay.style.display = 'none';
                }
            }


            function ilosc_unitow(spoo,shipment){

                var total_units = 0;

                var urlToLoad = "https://ffrm-troubleshooting-eu.amazon.com/events?shipmentId=" + shipment;
                // console.log(urlToLoad);
                // Używamy GM_xmlhttpRequest, aby pobrać zawartość strony
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: urlToLoad,
                    onload: function(response) {
                        // console.log('Zawartość strony z adresu ' + urlToLoad + ':');

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');



                        const elementsWithClassExtra = doc.querySelectorAll(".extra");
                        // console.log(elementsWithClassExtra);

                        elementsWithClassExtra.forEach(element => {
                            const firstChild = element.children[0];
                            if (firstChild && firstChild.textContent.includes("Total Shipment Items Quantity")) {
                                const secondChild = element.children[1];
                                if (secondChild) {
                                    spoo_ship = spoo_ship.replace(shipment,shipment + "-" + secondChild.textContent);
                                    findAndAppendText("spoo_textarea_id",spoo,secondChild.textContent);
                                }
                            }
                        });
                        // Schowaj overlay loadingu
                        hideLoadingOverlay();

                        //console.log(spoo_ship);
                    },
                    onerror: function(error) {
                        console.error('Wystąpił błąd podczas ładowania strony:', error);
                    }
                });


            }

            // Function to perform an HTTP GET request
            function httpGet(url, callback) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", url, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        callback(xhr.responseText);
                    }
                };
                xhr.send();
            }

            // textarea pracownicy onChange
            function obslugaZmiany()
            {
                var linijki = document.getElementById("spoo_textarea_id").value.split('\n');
                // Usuń puste linijki
                var iloscLinijek = linijki.filter(function (linijka) {
                    return linijka.trim() !== '';
                }).length;

                // Aktualizuj zawartość span z ilością linijek
                document.getElementById('lista_ile').textContent = iloscLinijek;
            }
        },500);

        function findAndAppendText(textareaId, searchString, ile) {
            var textarea = document.getElementById(textareaId);

            if (textarea) {
                var text = textarea.value;
                var newText = text.replace(searchString, searchString + "\t" + ile);

                textarea.value = newText;
            } else {
                console.log('Nie znaleziono textarea o id: ' + textareaId);
            }
        }


        // Create the overlay and loading indicator elements
        GM_addStyle(`
        #overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 999;
            text-align: center;
        }

        #loading-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
        }
    `);
    }
})();