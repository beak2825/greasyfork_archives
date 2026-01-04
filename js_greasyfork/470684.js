// ==UserScript==
// @name         Team Leader Helper
// @version      0.8
// @description  timliderzu
// @author       @nowaratn
// @match        https://fclm-portal.amazon.com/reports*
// @match        https://fclm-portal.amazon.com/employee/*
// @match        https://fcmenu-dub-regionalized.corp.amazon.com/*/laborTrackingKiosk*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/470684/Team%20Leader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470684/Team%20Leader%20Helper.meta.js
// ==/UserScript==

(function() {



    // Function RollUp
    if(location.href.indexOf("https://fclm-portal.amazon.com/reports/functionRollup") === 0)
    {
        // Zmień nazwę strony na nazwę procsu który jest otwarty
        if(document.getElementById("processId") != undefined)
        {
            // Pobierz referencję do elementu select
            var selectElement = document.getElementById("processId");

            // Pobierz indeks wybranego elementu
            var selectedIndex = selectElement.selectedIndex;

            // Pobierz wybrany element
            var selectedOption = selectElement.options[selectedIndex];

            // Pobierz wyświetlaną nazwę
            var selectedText = selectedOption.text;

            setTimeout(function(){
                document.title = selectedText;
            }, 500);
        }

        // Guzik przewijania do góry oraz info o aktualizacji PPR w prawym dolnym rogu
        addScrollTopButton();
    }

    // Process Path Rollup (PPR)
    if(location.href.indexOf("https://fclm-portal.amazon.com/reports/processPathRollup") === 0)
    {
        // Guzik przewijania do góry oraz info o aktualizacji PPR w prawym dolnym rogu
        addScrollTopButton();

        document.getElementById("timestamps").style = "margin-left:1%;background-color:#B9C9FE;color:black;width:fit-content;";


        // Dodaj guzik zaznaczenia danej linijki (abym nie musiał robić ctrl+f SHIP)
        var linijka = document.getElementsByTagName("tr");

        restorePinnedStates();

        function createPrzypinka() {
            var przypinka = document.createElement('div');
            przypinka.style = "position:absolute;";
            przypinka.innerHTML = '🖌️';


            // przypinka click
            przypinka.addEventListener('click', function() {
                var isPinned = this.parentNode.dataset.pinned === "true";

                if (!isPinned) {
                    // Zmień kolor tła na YellowGreen
                    this.parentNode.style.backgroundColor = "YellowGreen";
                    // Zapisz stan przypięcia
                    this.parentNode.dataset.pinned = "true";
                } else {
                    // Przywróć oryginalny kolor tła
                    this.parentNode.style.backgroundColor = "";
                    // Usuń stan przypięcia
                    delete this.parentNode.dataset.pinned;
                }

                // Zapisz stan przypięcia w localStorage
                savePinnedState(this.parentNode.id, this.parentNode.dataset.pinned === "true");
            });

            return przypinka;
        }

        function savePinnedState(elementId, isPinned) {
            var pinnedElements = JSON.parse(localStorage.getItem('pinnedElements')) || {};
            pinnedElements[elementId] = isPinned;
            localStorage.setItem('pinnedElements', JSON.stringify(pinnedElements));
        }

        function restorePinnedStates() {
            var pinnedElements = JSON.parse(localStorage.getItem('pinnedElements')) || {};

            for (var i = 0; i < linijka.length; i++) {
                if(linijka[i] != undefined)
                {
                    var elementId = linijka[i].id;

                    if (pinnedElements[elementId]) {
                        linijka[i].dataset.pinned = "true";
                        linijka[i].style.backgroundColor = "YellowGreen";
                    } else {
                        linijka[i].dataset.pinned = "";
                        linijka[i].style.backgroundColor = "";
                    }
                }
            }
        }

        for (var i = 0; i < linijka.length; i++) {
            if (linijka[i] != undefined && linijka[i].id != "") {
                var przypinka = createPrzypinka();
                linijka[i].appendChild(przypinka);
            }
        }
    }

    // Employee
    if(location.href.indexOf("https://fclm-portal.amazon.com/employee/") === 0)
    {
        // Poprawa Imie nazwisko przyrostek
        var title = document.getElementsByClassName("title")[0].innerText;
        var nazwisko = title.split(",")[0];
        var imie_login = title.split(",")[1];
        //  console.log(imie_login);
        var ile_imion = imie_login.split(" ");
        //  console.log(ile_imion);
        var login = ile_imion[ile_imion.length - 1];
        //  console.log(login);
        var new_title = imie_login.replace(login,"") + " " + nazwisko + " " + login;

        document.getElementsByClassName("title")[0].children[0].innerText = new_title;


        // Zamiana Ikony strony na obrazek z badge
        // Tworzenie nowego elementu link
        var newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.type = 'image/png';
        newLink.href = document.getElementsByClassName("photo")[0].attributes.src.value;

        // Znajdowanie istniejącego elementu link z favicon
        var existingLink = document.querySelector('link[rel="icon"]');

        // Jeśli istnieje element link z favicon, zamień go na nowy
        if (existingLink !== null) {
            document.head.removeChild(existingLink);
        }

        // Dodaj nowy element link z nową ikoną do sekcji head
        document.head.appendChild(newLink);



        setTimeout(function(){
            // Zamiana nazwy strony na login pracownika
            document.title = document.getElementsByClassName("list-side-by-side")[0].children[1].innerText + " | FCLM ";

            // Dodanie Menu i skanera do każdej strony
            var targetElementSelector = '#main-panel'; // Zmień to na odpowiedni selektor dla elementu, do którego chcesz przyczepić guzik

            // Dodawanie przycisków dla FCLM
            var buttons = [
                { label: 'Dodaj dla OPS_EMP_ENGAGEMENT', action: function() { dodaj_OPSEMPENG("OPSEMPENG", document.getElementsByClassName("list-side-by-side")[0].children[5].innerText, document.getElementsByClassName("list-side-by-side")[0].children[1].innerText) } },
                { label: 'Dodaj dla OPS_ASSOCIATE_ENGAGE', action: function() { dodaj_OPSASSOCIATEENG("OPSAAENG", document.getElementsByClassName("list-side-by-side")[0].children[5].innerText, document.getElementsByClassName("list-side-by-side")[0].children[1].innerText )} },
                { label: '', action: function() { } },
                { label: 'Czyść całą kolejkę', action: function() { czysc_lista() } },
                { label: '', action: function() { } },
                { label: 'Otwórz Skaner w nowej karcie', action: function() { window.open("https://fcmenu-dub-regionalized.corp.amazon.com/KTW1/laborTrackingKiosk", "_blank") } }
            ];

            // Sprawdzanie, czy wybrany element istnieje na stronie
            var targetElement = document.querySelector(targetElementSelector);
            if (targetElement) {
                attachButtonToElement(targetElement, buttons);
            } else {
                console.error('Nie można znaleźć elementu o selektorze:', targetElementSelector);
            }

            // Dodawanie stylów
            GM_addStyle(`#customButtonContainer { position: relative; display: inline-block; }
  #customButton { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px; font-size: 16px; }
  #customModal { display: none; position: absolute; top: 100%; left: 0; width: 300px; background-color: #f2f2f2; border-radius: 5px; padding: 20px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2); }
  #customModal textarea { width: 100%; height: 120px; resize: block; margin-bottom: 10px; }
  `);


            // // jeżeli mamy już dane, załaduj je do tabeli pracowników
            // if(GM_getValue('team_leader_taski') != "")
            // {
            //     document.getElementById("team_leader_textareaId").value = zmienna;
            // }


            function dodaj_OPSEMPENG(task, badge, login)
            {
                if(sprawdz_czy(login))
                {
                    document.getElementById("team_leader_lista").innerHTML += '<tr id="team_lider_' + login + '" style="border: 1px solid black !important"><td class="team_lider_pracownik_login">' + login + '</td><td class="team_lider_pracownik_badge" >' + badge + '</td><td class="team_lider_pracownik_task" >' + task + "</td></tr>";
                    var team_leader_taski = "";
                    team_leader_taski += document.getElementById("team_leader_lista").innerHTML;
                    GM_setValue('team_leader_taski', team_leader_taski);
                }
            }

            function dodaj_OPSASSOCIATEENG(task, badge, login)
            {
                if(sprawdz_czy(login))
                {
                    document.getElementById("team_leader_lista").innerHTML += '<tr id="team_lider_' + login + '"style="border: 1px solid black !important"><td class="team_lider_pracownik_login">' + login + '</td><td class="team_lider_pracownik_badge" >' + badge + '</td><td class="team_lider_pracownik_task" >' + task + "</td></tr>";
                    var team_leader_taski = "";
                    team_leader_taski += document.getElementById("team_leader_lista").innerHTML;
                    GM_setValue('team_leader_taski', team_leader_taski);
                }
            }

        }, 500)


        //     const iframe = document.createElement('iframe');
        //     iframe.src = 'https://trans-logistics-eu.amazon.com/sortcenter/tantei?nodeId=KTW1&searchType=Container&searchId=tsX0xjm7u0m'; // Replace with the desired URL
        //     iframe.style.position = 'fixed';
        //     iframe.style.bottom = '0';
        //     iframe.style.right = '0';
        //     iframe.style.width = '600px';
        //     iframe.style.height = '600px';
        //     iframe.style.border = 'none';
        //     iframe.style.zIndex = '9999';
        //     iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        //     document.body.appendChild(iframe);
    }

    // Time on task
    if(location.href.indexOf("https://fclm-portal.amazon.com/reports/timeOnTask") === 0)
    {
        var tot_menu = document.createElement('div');
        tot_menu.id = "tot_menu_div";
        tot_menu.style = "position:absolute;";
        tot_menu.innerHTML = '<input type="button" id="tot_menu_openAll" value="Otwórz obecnych w nowych kartach" />';

        document.getElementsByClassName("total")[0].appendChild(tot_menu);

        document.getElementById("tot_menu_openAll").addEventListener (
            "click", tot_menu_openAll, false
        );

        function tot_menu_openAll (zEvent)
        {
            var elements = document.querySelectorAll('.tot-row:not(.tot-row.hide-manager):not(.tot-row.hide-100)');

            if(elements.length > 25)
            {
                var confirmationMessage = "Czy na pewno chcesz otworzyć " + elements.length + " nowych kart?";

                if (window.confirm(confirmationMessage)) {
                    elements.forEach(function(element) {
                        window.open(element.children[0].lastElementChild.href, "_blank");
                    });
                }
            }
            else
            {
                elements.forEach(function(element) {
                    window.open(element.children[0].lastElementChild.href, "_blank");
                });
            }
        }
    }


    // Strona WEB Skaner do taskowania
    if(location.href.indexOf("https://fcmenu-dub-regionalized.corp.amazon.com/KTW1/laborTrackingKiosk") === 0 || location.href.indexOf("https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk") === 0)
    {
        var zmienna = GM_getValue('team_leader_taski');
        console.log(zmienna);
        // Dodanie Menu i skanera do każdej strony
        var targetElementSelector = '#body'; // Zmień to na odpowiedni selektor dla elementu, do którego chcesz przyczepić guzik

        // Dodanie przycisków dla WEB Skanera
        var buttons = [
            { label: 'Taskuj wszystkich', action: function() { taskuj_wszystkich(zmienna) } },
            { label: 'Czyść listę', action: function() { czysc_lista() } },
            { label: '', action: function() { } },
            { label: '', action: function() { } },
            { label: '', action: function() { } },
            { label: 'Czyść trwające taski', action: function() { czysc_lista_aktualne() } }
        ];

        // Sprawdzanie, czy wybrany element istnieje na stronie
        var targetElement = document.querySelector(targetElementSelector);
        if (targetElement) {
            attachButtonToElement(targetElement, buttons);
        } else {
            console.error('Nie można znaleźć elementu o selektorze:', targetElementSelector);
        }

        // Dodawanie stylów
        GM_addStyle(`#customButtonContainer { position: relative; display: inline-block; }
  #customButton { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px; font-size: 16px; }
  #customModal { display: none; position: absolute; top: 100%; left: 0; width: 300px; background-color: #f2f2f2; border-radius: 5px; padding: 20px; box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2); }
  #customModal textarea { width: 100%; height: 120px; resize: block; margin-bottom: 10px; } `);

        function taskuj_wszystkich()
        {
            var currentDate = new Date();
            var taski = zmienna.split("\r\n");

            var ile = document.getElementsByClassName("team_lider_pracownik_login").length;

            for(var i = 0;i < ile;i++)
            {
                var calm = document.getElementsByClassName("team_lider_pracownik_task")[i].innerText;
                var badge = document.getElementsByClassName("team_lider_pracownik_badge")[i].innerText;
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open( "POST", 'https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk', true );
                xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                xmlHttp.send( 'warehouseId=KTW1&calmCode=' + calm + '&trackingBadgeId=' + badge );
                var respond = xmlHttp.responseText;

                // if(respond.includes("Associates added (1):"))
                // {
                console.log("dobrze");
                var futureDate = "";
                var obecneTaski = GM_getValue('raw_taski_aktualne');

                if(obecneTaski == undefined)
                {
                    obecneTaski = "";
                }

                if(calm == "OPSEMPENG")
                {
                    futureDate = new Date(currentDate.getTime() + 55 * 60 * 1000);

                    // zaktualizuj localStorage taski o dodatkowy wpis
                    // localStorage.setItem("taski", obecneTaski + linijka[1] + "<=>" + futureDate + ">=<");
                    GM_setValue('raw_taski_aktualne', obecneTaski + badge + "<=>" + futureDate + ">=<");
                }

                if(calm == "OPSAAENG")
                {
                    futureDate = new Date(currentDate.getTime() + 13 * 60 * 1000);

                    // zaktualizuj localStorage taski o dodatkowy wpis
                    GM_setValue('raw_taski_aktualne', obecneTaski + badge + "<=>" + futureDate + ">=<");
                }
                // }
            }
        }


        if (zmienna !== "" && typeof zmienna !== "undefined")
        {
            document.getElementById("customButton").click();
        }

        GM_setValue('team_leader_taski', '');
        sprawdz_aktualne_taski();

        setTimeout(function() {
            location.reload();
        }, 60000);
    }

    function sprawdz_aktualne_taski()
    {
        document.getElementById("team_leader_lista_aktualne").innerHTML = "";
        var zmienna = GM_getValue('raw_taski_aktualne');

        // jeżeli są aktualne taski
        if (zmienna !== "" && typeof zmienna !== "undefined")
        {
            console.log("Sprawdzam taski...");
            var taski = zmienna.split(">=<");

            for(var i = 0; i<taski.length;i++)
            {
                var linijka_task = taski[i].split("<=>");
                var badge = linijka_task[0];
                var koniec_task = linijka_task[1];

                console.log(koniec_task);

                // Jeżeli minął czas taska, to iStop
                if(new Date() >= new Date(koniec_task))
                {
                    var xmlHttp = new XMLHttpRequest();
                    xmlHttp.open( "POST", 'https://fcmenu-dub-regionalized.corp.amazon.com/do/laborTrackingKiosk', true );
                    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                    xmlHttp.send( 'warehouseId=KTW1&calmCode=ISTOP&trackingBadgeId=' + badge );
                    var respond = xmlHttp.responseText;
                }
                // Jeżeli trwa, dopisz do listy aktualnych tasków
                else
                {
                    document.getElementById("team_leader_lista_aktualne").innerHTML += '<tr id="team_lider_header_aktualny" style="border: 1px solid black !important"><td class="team_lider_header_badge_aktualny">' + badge + '</td><td class="team_lider_header_task_aktualny" ></td><td class="team_lider_header_task_kiedy" >' + formatDate(new Date(koniec_task)) + '</td></tr>';
                }
            }
        }
    }

    // Funkcja do formatowania daty w postaci "DD/MM/RRRR hh:mm"
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }



    function sprawdz_czy(login)
    {
        if(document.getElementById("team_lider_" + login))
        {
            var confirmationMessage = "Pracownik o loginie " + login + " jest już na liście.\r\nNaciśnij 'OK' aby zaktualizować, lub 'ANULUJ' aby anulować";

            if (window.confirm(confirmationMessage))
            {
                document.getElementById("team_lider_" + login).parentNode.remove();
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return true;
        }
    }


    function czysc_lista()
    {
        GM_setValue('team_leader_taski', '');
        document.getElementById("team_leader_lista").innerHTML = "";
    }

    function czysc_lista_aktualne()
    {
        GM_setValue('raw_taski_aktualne', '');
    }

    var sortAscending = true; // Zmienna do śledzenia aktualnego sposobu sortowania (true - A-Z, false - Z-A)

    function sortTable(columnIndex) {
        var table, rows, switching, i, x, y, shouldSwitch;
        table = document.getElementById("team_leader_lista");
        switching = true;

        while (switching) {
            switching = false;
            rows = table.rows;

            for (i = 0; i < (rows.length - 1); i++) { // Zmieniamy indeks startowy pętli na 0
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("td")[columnIndex];
                y = rows[i + 1].getElementsByTagName("td")[columnIndex];

                var xValue = x.textContent.toLowerCase();
                var yValue = y.textContent.toLowerCase();

                // Użyj metody localeCompare() do sortowania alfabetycznego
                var compareResult = xValue.localeCompare(yValue);

                // Sprawdź, czy sortujemy w drugą stronę (Z-A)
                if (!sortAscending) {
                    compareResult = -compareResult;
                }

                if (compareResult > 0) {
                    shouldSwitch = true;
                    break;
                }
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
            }
        }

        // Zmiana kierunku sortowania po każdym naciśnięciu
        sortAscending = !sortAscending;

        // Po posortowaniu, odświeżamy widok tabeli
        refreshTable();
    }

    function refreshTable() {
        var table = document.getElementById("team_leader_lista");
        var tbody = table.getElementsByTagName("tbody")[0];
        var rows = Array.from(tbody.getElementsByTagName("tr"));

        // Sortowanie i usunięcie wszystkich wierszy z tbody
        rows.sort(function (a, b) {
            return a.rowIndex - b.rowIndex;
        });

        for (var i = 0; i < rows.length; i++) {
            tbody.appendChild(rows[i]);
        }
    }


    // Funkcja do przyczepiania guzika pod wybrany element
    function attachButtonToElement(element, buttons) {
        var container = document.createElement('div');
        container.id = 'customButtonContainer';
        // element.appendChild(container);
        element.parentNode.insertBefore(container,element);


        var button = document.createElement('button');
        button.id = 'customButton';
        button.innerHTML = 'Lider Menu';
        container.appendChild(button);

        var modal = document.createElement('div');
        modal.id = 'customModal';

        var label = document.createElement('div');
        label.id = 'team_lider_label';
        label.style = 'text-align: center; margin-bottom: 1%; font-size: x-small;';
        label.innerText = "Tutaj możesz wrzucić do kolejki wszystkich pracowników wraz z wybranym taskiem, a później przejsć do Web Skanera i zataskować wszystkich jednym przyciskiem.";
        modal.appendChild(label);

        var haer = document.createElement('hr');
        modal.appendChild(haer);


        // Lista na kolejkowane taski
        var lista_header_label = document.createElement('div');
        lista_header_label.innerText = "Lista osób zakolejkowanych do taskowania";
        lista_header_label.style = "margin-top: 5%;text-align:center;font-size: x-small; border: 1px solid black; background-color: dodgerblue;";


        var lista_header = document.createElement('table');
        lista_header.id = 'team_leader_lista_header';
        lista_header.style = 'width: 100%; text-align: center; border: 1px solid black !important; border-collapse: collapse; background-color: dodgerblue;font-weight: bold;';
        lista_header.innerHTML = '<tr><td id="team_lider_header_login">LOGIN</td><td id="team_lider_header_badge">BADGE</td><td id="team_lider_header_task">TASK</td></tr>';

        var lista = document.createElement('table');
        lista.id = 'team_leader_lista';
        lista.style = 'width: 100%; text-align: center; border: 1px solid black !important; border-collapse: collapse;';
        lista.innerHTML = "";


        // Lista aktualnie trwających tasków (dla wiadomości i zakończenia ich w czasie)
        var lista_aktualne_header_label = document.createElement('div');
        lista_aktualne_header_label.innerText = "Lista osób z trwającym już taskiem";
        lista_aktualne_header_label.style = "margin-top: 5%;text-align:center;font-size: x-small; border: 1px solid black; background-color: violet;";


        var lista_aktualne_header = document.createElement('table');
        lista_aktualne_header.id = 'team_leader_lista_header_aktualne';
        lista_aktualne_header.style = 'width: 100%; text-align: center; border: 1px solid black !important; border-collapse: collapse; background-color: violet;font-weight: bold;';
        lista_aktualne_header.innerHTML = '<tr><td id="team_lider_header_badge_aktualny">Badge</td><td id="team_lider_header_task_aktualny">TASK</td><td id="team_lider_header_task_kiedy">DO KIEDY</td></tr>';

        var lista_aktualne = document.createElement('table');
        lista_aktualne.id = 'team_leader_lista_aktualne';
        lista_aktualne.style = 'width: 100%; text-align: center; border: 1px solid black !important; border-collapse: collapse;';
        lista_aktualne.innerHTML = "";

        // lista.placeholder = 'Tutaj będzie widniała kolejka pracowników których chcesz zataskować na dane funkcje.\r\nWejście na stronę Skanera pozwoli na zrobienie tego automatycznie według listy.\r\nLista pokazuje się w formie:\r\n\r\nLOGIN | BADGE | TASK';

        var buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'grid';


        buttons.forEach(function(btn) {
            var button = document.createElement('button');
            button.innerHTML = btn.label;
            button.style = 'margin-left: 20px; margin-right: 20px; margin-bottom: 10px;';
            button.addEventListener('click', btn.action);
            buttonsContainer.appendChild(button);
        });

        modal.appendChild(buttonsContainer);
        modal.appendChild(lista_header_label);
        modal.appendChild(lista_header);
        modal.appendChild(lista);
        modal.appendChild(haer);
        modal.appendChild(lista_aktualne_header_label);
        modal.appendChild(lista_aktualne_header);
        modal.appendChild(lista_aktualne);
        container.appendChild(modal);

        document.getElementById("team_lider_header_login").addEventListener('click', function() { console.log("test123"); sortTable(0) } );
        document.getElementById("team_lider_header_task").addEventListener('click', function() { sortTable(2) } );


        // Dodawanie obsługi zdarzenia dla guzika
        button.addEventListener('click', function() {
            var modal = document.getElementById('customModal');
            if (modal) {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    button.innerHTML = 'Lider Menu';
                    GM_setValue("menu_open","false");
                } else {
                    modal.style.display = 'block';
                    button.innerHTML = 'Schowaj Menu';
                    GM_setValue("menu_open","true");
                }
            }
        });

        // Wczytaj dane jeżeli istnieją
        if(GM_getValue('team_leader_taski') != "")
        {
            document.getElementById("team_leader_lista").innerHTML += GM_getValue('team_leader_taski');
        }

        if(GM_getValue('menu_open') == "true")
        {
            document.getElementById("customButton").click();
        }
    }

    // FUNKCJA Guzik przewijania do góry oraz info o aktualizacji PPR w prawym dolnym rogu
    function addScrollTopButton() {
        // Tworzenie guzika
        const button = document.createElement('button');
        button.classList.add('scroll-top-button');
        button.innerHTML = '&#9650;'; // Strzałka w górę - Unicode

        // Stylowanie guzika
        button.style = "display: contents; position: fixed; font-size: 20px; z-index: 9999; cursor: pointer; background-color: rgba(0, 0, 0, 0.5); border: none; border-radius: 0;";

        // Tworzenie elementu div
        const container = document.createElement('div');
        container.style = "position: fixed; right: 2%; bottom: 5%; display: flex; align-items: center;";

        // Skopiowanie elementu timestamps i dodanie go do kontenera
        const timestampsElement = document.getElementById('timestamps');
        const copiedElement = timestampsElement.cloneNode(true);
        copiedElement.style = "background-color: #B9C9FE; color: black;";
        container.appendChild(copiedElement);

        // Dodawanie guzika do kontenera
        container.appendChild(button);

        // Dodawanie kontenera do strony
        document.body.appendChild(container);

        // Obsługa kliknięcia guzika
        button.addEventListener('click', scrollToTop);

        // Funkcja przewijająca do góry
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
})();