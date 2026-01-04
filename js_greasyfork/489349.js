// ==UserScript==
// @name         Sterowanie Bag Sortacja (HAJ8)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Dodaje opcję włącz/wyłącz HAJ8 na bag sortacji
// @author       @nowaratn
// @match        https://stem-eu.corp.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489349/Sterowanie%20Bag%20Sortacja%20%28HAJ8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489349/Sterowanie%20Bag%20Sortacja%20%28HAJ8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkcja obserwująca dokument w poszukiwaniu elementu o danej klasie
    const observeDOM = (function(){
        const mutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        return function(obj, callback){
            if( !obj || obj.nodeType !== 1 ) return;

            if( mutationObserver ){
                // Użyj MutationObserver jeśli jest dostępny
                const obs = new mutationObserver(callback);
                obs.observe( obj, { childList:true, subtree:true });
                return obs;
            }
        }
    })();

    function getTokenValue() {
        var tokenInput = document.querySelector('input[type="hidden"][name="__token_"]');
        return tokenInput ? tokenInput.value : null;
    }


    const bagowa_off_fnc = function(button) {
        button.addEventListener('click', function() {
            // Tutaj możesz dodać więcej akcji po naciśnięciu guzika
            var tokenValue = getTokenValue();

            fetch("https://stem-eu.corp.amazon.com/sortcenter/equipmentmanagement/graphql", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "anti-csrftoken-a2z": tokenValue,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                "referrer": "https://stem-eu.corp.amazon.com/node/KTW1/equipment/editMappings/reviewMappings",
                "body": "[{\"operationName\":\"updateChuteMappings\",\"variables\":{\"mapping\":{\"mappings\":[{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"a6c35c22-a765-a7fc-8e20-96c564735e44\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"46c35c22-bec9-0391-577f-aaa1679a98ae\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"d0c35c22-eb84-593c-a345-ad5d6d350841\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"92c35c23-3a7d-28a8-21fd-65566a49f3fd\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"2ec35c24-09c7-1915-5a91-115f7fa868ca\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"c2c35c24-9c28-d93c-7bc8-bb8dee444eb3\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"b2c36293-91c5-9188-d4f6-c5741aa0c589\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"dec36294-8e7a-ab44-51ef-01fb782bf50c\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"90c36292-bff4-6141-0945-ba2673158805\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"fac36293-a597-ba3b-147a-1eaa64f98c42\"},{\"action\":\"remove\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"bac36292-fad1-cebd-5ded-14e485ac7c4d\"}],\"namespace\":\"KTW1\"}},\"query\":\"mutation updateChuteMappings($mapping: ChuteMappingsInput!) {\\n  updateChuteMappings(mapping: $mapping) {\\n    failedChuteMappingsAndCauses {\\n      errorType\\n      chuteMapping {\\n        chuteId\\n        resourceId\\n        action\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}]",
                "method": "POST",
                "mode": "cors"
            });

            alert("Wyłączono HAJ8 na Bag Sortacji");
            location.reload();
        });
    };


    const bagowa_on_fnc = function(button) {
        button.addEventListener('click', function() {
            // Tutaj możesz dodać więcej akcji po naciśnięciu guzika
            var tokenValue = getTokenValue();

            fetch("https://stem-eu.corp.amazon.com/sortcenter/equipmentmanagement/graphql", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "anti-csrftoken-a2z": tokenValue,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin"
                },
                "referrer": "https://stem-eu.corp.amazon.com/node/KTW1/equipment/editMappings/reviewMappings",
                "body": "[{\"operationName\":\"updateChuteMappings\",\"variables\":{\"mapping\":{\"mappings\":[{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"a6c35c22-a765-a7fc-8e20-96c564735e44\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"46c35c22-bec9-0391-577f-aaa1679a98ae\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"d0c35c22-eb84-593c-a345-ad5d6d350841\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"92c35c23-3a7d-28a8-21fd-65566a49f3fd\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"2ec35c24-09c7-1915-5a91-115f7fa868ca\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"c2c35c24-9c28-d93c-7bc8-bb8dee444eb3\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"b2c36293-91c5-9188-d4f6-c5741aa0c589\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"dec36294-8e7a-ab44-51ef-01fb782bf50c\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"90c36292-bff4-6141-0945-ba2673158805\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"fac36293-a597-ba3b-147a-1eaa64f98c42\"},{\"action\":\"add\",\"chuteId\":\"KTW1-ShippingSorter-S01322\",\"resourceId\":\"bac36292-fad1-cebd-5ded-14e485ac7c4d\"}],\"namespace\":\"KTW1\"}},\"query\":\"mutation updateChuteMappings($mapping: ChuteMappingsInput!) {\\n  updateChuteMappings(mapping: $mapping) {\\n    failedChuteMappingsAndCauses {\\n      errorType\\n      chuteMapping {\\n        chuteId\\n        resourceId\\n        action\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\"}]",
                "method": "POST",
                "mode": "cors"
            });

            alert("Uruchomiono HAJ8 na Bag Sortacji");
            location.reload();
        });
    };


    // // Przykładowa tablica zgodna z Twoim formatem
    // var tablica = [
    //     ["RT_01_01", "28b277d9-df69-e236-3151-cb79fecc7672"],
    //     ["RT_01_02", "e0b277d9-e826-3867-0a5e-c114d9af4e55"],
    //     ["RT_01_03", "e2b277d9-f19f-1eee-af0f-7249b1437847"],
    //     ["RT_01_04", "86b277d9-c4c2-17f1-1949-3827a611038e"],
    //     ["RT_01_05", "66b277d9-d6ad-45d8-7d1e-4b603ffac4c4"],
    //     ["RT_01_06", "58b277d9-fa9a-6f3d-7ba5-cafee1ea91cd"],
    //     ["RT_01_07", "1cb277da-02bb-7645-5421-bed7ac0aba92"],
    //     ["RT_01_08", "b2b277da-0d11-3177-e678-d05ebe6f5215"],
    //     ["RT_01_09", "68b277da-15de-9699-8429-4e1a011aac56"],
    //     ["RT_01_10", "28b277da-1f35-a167-3057-37398cb62a77"],
    //     // Dodaj więcej elementów tutaj
    // ];

    var tablica = [
        ["BG_401", "62b6dab3-50b6-bfe4-b76e-8c902e6cf2ae"],
        ["BG_402", "26b6dab3-59ce-5637-ded3-930f05ba0822"],
        ["BG_403", "d4b6dab3-61b1-8f60-c863-88824132077c"],
        ["BG_404", "e8b6dab3-6ae0-331a-0e33-12bc58f69153"],
    ];


    // Nowa tablica z danymi do AddReservations
    var tablica2 = [
        ["BG_401", "62b6dab3-50b6-bfe4-b76e-8c902e6cf2ae", "POZ2_SLOW", ["KTW1->POZ2"]],
        ["BG_402", "26b6dab3-59ce-5637-ded3-930f05ba0822", "POZ2_SLOW", ["KTW1->POZ2"]],
        ["BG_403", "d4b6dab3-61b1-8f60-c863-88824132077c", "POZ2_SLOW", ["KTW1->POZ2"]],
        ["BG_404", "e8b6dab3-6ae0-331a-0e33-12bc58f69153", "POZ2_SLOW", ["KTW1->POZ2"]],
    ];

    console.log("newTablicaAdd:", tablica2);



    /**
 * Funkcja ekstrakująca wszystkie resourceId oraz odpowiadające im label z dwuwymiarowej tablicy.
 * @param {Array} tablica - Dwuwymiarowa tablica z resourceId i label.
 * @returns {Object} - Obiekt zawierający:
 *  - resourceIds: tablica z wszystkimi resourceId,
 *  - idToLabelMap: mapa resourceId do odpowiadających label.
 */
    function extractResourceData(tablica) {
        const resourceIds = [];
        const idToLabelMap = {};

        tablica.forEach(element => {
            if (Array.isArray(element) && element.length >= 2) {
                const [label, resourceId] = element;
                resourceIds.push(resourceId);
                idToLabelMap[resourceId] = label;
            }
        });

        return { resourceIds, idToLabelMap };
    }

    /**
 * Funkcja wykonująca zapytanie POST do pobrania stackingFilters, usuwa rezerwacje, a następnie dodaje nowe.
 * @param {string} urlFetch - Endpoint URL do pobrania stackingFilters.
 * @param {string} urlRemove - Endpoint URL do wykonania removeReservations.
 * @param {string} urlAdd - Endpoint URL do wykonania addReservations.
 * @param {Array} tablica - Dwuwymiarowa tablica z resourceId i label.
 * @param {Array} newTablicaAdd - Dwuwymiarowa tablica z danymi do addReservations.
 * @returns {Object|null} - Wynik operacji removeReservations i addReservations lub null w przypadku błędu.
 */

    async function fetchStackingFiltersAndRemoveReservations(urlFetch, urlRemove, urlAdd, tablica, tablica2) {
        try {

            var tokenValue = getTokenValue();


            // Ekstrakcja resourceId i mapa resourceId do label
            const { resourceIds, idToLabelMap } = extractResourceData(tablica);
            console.log("Wyekstrahowane resourceId:", resourceIds);
            console.log("Mapa resourceId do label:", idToLabelMap);

            // Budowanie postDataFetch jako tablicy z jednym zapytaniem
            const postDataFetch = [
                {
                    operationName: 'Reservations',
                    query: `query Reservations($nodeId: String!, $cached: Boolean!) {
          reservations(nodeId: $nodeId, cached: $cached) {
            __typename
            reservationId
            stackingFilters
            startTime
            endTime
            lastUpdateTime
            userLogin
            reservationProperties {
              __typename
              key
              value
            }
            resources {
              __typename
              resourceId
              label
              resourceType
            }
          }
        }`,
                    variables: {
                        cached: true,
                        nodeId: 'KTW1'
                    }
                }
            ];

            // Wykonanie pierwszego zapytania POST z tablicą zapytań
            const responseFetch = await fetch(urlFetch, {
                method: 'POST',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "anti-csrftoken-a2z": tokenValue,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postDataFetch) // Tablica z jednym obiektem
            });

            // Sprawdzenie statusu odpowiedzi
            if (!responseFetch.ok) {
                throw new Error(`Błąd w zapytaniu fetch: ${responseFetch.status} ${responseFetch.statusText}`);
            }

            // Parsowanie odpowiedzi jako JSON
            const dataFetch = await responseFetch.json();
            console.log("Odpowiedź z serwera (fetch):", dataFetch);

            // Poprawne wyodrębnienie reservations z odpowiedzi GraphQL
            const reservations = dataFetch[0]?.data?.reservations || [];
            console.log("Wyodrębnione reservations:", reservations);

            // Mapowanie label do stackingFilters
            const labelToFiltersMap = {};

            // Inicjalizacja mapy z pustymi tablicami dla każdego label
            Object.values(idToLabelMap).forEach(label => {
                labelToFiltersMap[label] = [];
            });

            // Przetwarzanie każdej rezerwacji
            reservations.forEach(reservation => {
                const { stackingFilters, resources } = reservation;

                if (Array.isArray(resources)) {
                    resources.forEach(resource => {
                        const { resourceId } = resource;
                        if (resourceIds.includes(resourceId)) {
                            const label = idToLabelMap[resourceId];
                            if (label && Array.isArray(stackingFilters)) {
                                // Dodaj stackingFilters do odpowiedniego label
                                labelToFiltersMap[label] = labelToFiltersMap[label].concat(stackingFilters);
                            }
                        }
                    });
                }
            });

            // Usunięcie duplikatów stackingFilters dla każdego label
            for (const label in labelToFiltersMap) {
                labelToFiltersMap[label] = [...new Set(labelToFiltersMap[label])];
            }

            console.log("Mapa label do stackingFilters:", labelToFiltersMap);

            // Budowanie ciała zapytania removeReservations
            const bodyRemoveReservations = tablica.map(([label, resourceId]) => ({
                operationName: "RemoveReservations",
                variables: {
                    allocationChangeInput: {
                        resourceId: resourceId,
                        stackingFilters: labelToFiltersMap[label] || []
                    }
                },
                query: `mutation RemoveReservations($allocationChangeInput: RemoveReservationsInput!) {
        removeReservations(removeReservationsInput: $allocationChangeInput) {
          reservationId
          __typename
        }
      }`
            }));

            console.log("Ciało zapytania removeReservations:", bodyRemoveReservations);

            // Wykonanie zapytania removeReservations
            const responseRemove = await fetch(urlRemove, {
                method: 'POST',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "anti-csrftoken-a2z": tokenValue,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyRemoveReservations)
            });

            // Sprawdzenie statusu odpowiedzi
            if (!responseRemove.ok) {
                throw new Error(`Błąd w zapytaniu removeReservations: ${responseRemove.status} ${responseRemove.statusText}`);
            }

            // Parsowanie odpowiedzi jako JSON
            const resultRemove = await responseRemove.json();
            console.log("Odpowiedź z serwera (removeReservations):", resultRemove);
            console.log("newTablicaAdd: ", tablica2);

            // Budowanie ciała zapytania addReservations
            const bodyAddReservations = tablica2.map(([label, resourceId, stackingFilter, lanes]) => ({
                operationName: "AddReservations",
                variables: {
                    allocationChangeInput: {
                        resourceId: resourceId,
                        sfWithLanes: [
                            {
                                stackingFilter: stackingFilter,
                                lanes: lanes
                            }
                        ]
                    }
                },
                query: `mutation AddReservations($allocationChangeInput: AddReservationsInput!) {
        addReservations(addReservationsInput: $allocationChangeInput) {
          reservationId
          __typename
        }
      }`
            }));

            console.log("Ciało zapytania addReservations:", bodyAddReservations);

            // Wykonanie zapytania addReservations
            const responseAdd = await fetch(urlAdd, {
                method: 'POST',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    "content-type": "application/json",
                    "anti-csrftoken-a2z": tokenValue,
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyAddReservations)
            });

            // Sprawdzenie statusu odpowiedzi
            if (!responseAdd.ok) {
                throw new Error(`Błąd w zapytaniu addReservations: ${responseAdd.status} ${responseAdd.statusText}`);
            }

            // Parsowanie odpowiedzi jako JSON
            const resultAdd = await responseAdd.json();
            console.log("Odpowiedź z serwera (addReservations):", resultAdd);

            return { remove: resultRemove, add: resultAdd };

        } catch (error) {
            console.error("Wystąpił błąd:", error);
            return null;
        }
    }

    const robot_pusto = function(button) {
        button.addEventListener('click', function() {
            // Tutaj możesz dodać więcej akcji po naciśnięciu guzika



            // Przykładowe użycie funkcji
            const urlFetch = 'https://stem-eu.corp.amazon.com/sortcenter/equipmentmanagement/graphql'; // Zastąp rzeczywistym URL
            const urlRemove = 'https://stem-eu.corp.amazon.com/sortcenter/equipmentmanagement/graphql'; // Zastąp rzeczywistym URL
            const urlAdd = 'https://stem-eu.corp.amazon.com/sortcenter/equipmentmanagement/graphql'; // Zastąp rzeczywistym URL


            const postDataFetch = [
                {
                    operationName: 'Reservations',
                    query: `query Reservations($nodeId: String!, $cached: Boolean!) {
      reservations(nodeId: $nodeId, cached: $cached) {
        __typename
        reservationId
        stackingFilters
        startTime
        endTime
        lastUpdateTime
        userLogin
        reservationProperties {
          __typename
          key
          value
        }
        resources {
          __typename
          resourceId
          label
          resourceType
        }
      }
    }`,
                    variables: {
                        cached: true,
                        nodeId: 'KTW1'
                    }
                }
            ];

            fetchStackingFiltersAndRemoveReservations(urlFetch, urlRemove, urlAdd, tablica, tablica2)
                .then(result => {
                if (result) {
                    console.log("Wynik operacji removeReservations:", result);
                    // Możesz dalej przetwarzać wynik tutaj
                }
            });

        });
    };

    // Funkcja dodająca kafelki i panele
    const addDivAndButton = function(){
        const elements = document.querySelectorAll('.css-qodthi');

        // Tworzenie paneli tylko raz
        let bagowaPanel = document.getElementById('bagowa_panel_id');
        if (!bagowaPanel) {
            // Tworzenie panelu bagowej
            bagowaPanel = document.createElement('div');
            bagowaPanel.id = 'bagowa_panel_id';
            bagowaPanel.style.display = 'none';
            // Dodajemy wysoką wartość order
            bagowaPanel.style.order = '1000';

            const div_panel_menu = document.createElement('div');
            div_panel_menu.id = 'div_panel_menu_id';
            // Ustawienie stylów poprawnie
            div_panel_menu.style.display = 'grid';
            div_panel_menu.style.width = '30%';
            div_panel_menu.style.transform = 'translate(100%)';

            const button_off = document.createElement('button');
            button_off.id = 'bagowa_btn_id_off';
            button_off.textContent = 'Wyłącz HAJ8 na bagowej';
            // Ustawienie stylów poprawnie
            button_off.style.margin = '5px';
            button_off.style.fontWeight = 'bold';
            button_off.style.height = '69px';
            bagowa_off_fnc(button_off); // Zakładamy, że ta funkcja istnieje

            const button_on = document.createElement('button');
            button_on.id = 'bagowa_btn_id_on';
            button_on.textContent = 'Uruchom HAJ8 na bagowej';
            // Ustawienie stylów poprawnie
            button_on.style.margin = '5px';
            button_on.style.fontWeight = 'bold';
            button_on.style.height = '69px';
            bagowa_on_fnc(button_on); // Zakładamy, że ta funkcja istnieje

            div_panel_menu.appendChild(button_off);
            div_panel_menu.appendChild(button_on);

            bagowaPanel.appendChild(div_panel_menu);

            // Dodajemy panel do kontenera
            const parent = document.querySelector('.css-1mdw918');
            parent.appendChild(bagowaPanel);
        }

        let robotPanel = document.getElementById('robot_panel_id');
        if (!robotPanel) {
            // Tworzenie panelu robota
            robotPanel = document.createElement('div');
            robotPanel.id = 'robot_panel_id';
            robotPanel.style.display = 'none';
            // Dodajemy wysoką wartość order
            robotPanel.style.order = '1000';

            const div_panel_menu = document.createElement('div');
            div_panel_menu.id = 'robot_panel_menu_id';
            // Ustawienie stylów poprawnie
            div_panel_menu.style.display = 'grid';
            div_panel_menu.style.width = '30%';
            div_panel_menu.style.transform = 'translate(100%)';

            const button_off = document.createElement('button');
            button_off.id = 'robot_btn_id';
            button_off.textContent = 'Przywróć ustawienia domyślne robota';
            // Ustawienie stylów poprawnie
            button_off.style.margin = '5px';
            button_off.style.fontWeight = 'bold';
            button_off.style.height = '69px';
            robot_pusto(button_off); // Zakładamy, że ta funkcja istnieje

            div_panel_menu.appendChild(button_off);

            robotPanel.appendChild(div_panel_menu);

            // Dodajemy panel do kontenera
            const parent = document.querySelector('.css-1mdw918');
            parent.appendChild(robotPanel);
        }

        // Dodawanie kafelków
        Array.from(elements).forEach(function(element) {
            // Kafelek BAG Sortacja
            if (!element.querySelector('#bagowa_span_id')) {
                const span1 = document.createElement('span');
                span1.id = 'bagowa_span_id';
                span1.className = 'css-8l72ut';

                const div1 = document.createElement('div');
                div1.setAttribute('role','button');
                div1.id = 'bagowa_div_id';
                div1.className = 'css-1fpgend';

                const section1 = document.createElement('section');
                section1.id = 'bagowa_section_id';
                section1.className = 'css-1h8c63v';

                const div2 = document.createElement('div');
                div2.textContent = 'Sterowanie BAG Sortacja';
                div2.style.width = 'min-content';

                div1.appendChild(section1);
                section1.appendChild(div2);
                span1.appendChild(div1);

                element.appendChild(span1);

                div1.addEventListener('click', function() {
                    // Ukrywanie panelu robota i usuwanie obramowania
                    robotPanel.style.display = 'none';
                    const robotSection = document.querySelector('#robot_section_id');
                    if (robotSection) robotSection.style.border = '';

                    // Przełączanie widoczności panelu bagowej
                    if (bagowaPanel.style.display === 'none' || bagowaPanel.style.display === '') {
                        bagowaPanel.style.display = 'block';
                        document.querySelector('#bagowa_section_id').style.border = 'yellowgreen 3px solid';
                        // Ukrywanie oryginalnej tabeli
                        document.querySelector('.css-9wtx8v').style.display = 'none';
                    } else {
                        bagowaPanel.style.display = 'none';
                        document.querySelector('#bagowa_section_id').style.border = '';
                        // Pokazywanie oryginalnej tabeli
                        document.querySelector('.css-9wtx8v').style.display = '';
                    }
                });
            }

            // Kafelek ABB Robot TSO
            if (!element.querySelector('#robot_span_id')) {
                const span1 = document.createElement('span');
                span1.id = 'robot_span_id';
                span1.className = 'css-8l72ut';

                const div1 = document.createElement('div');
                div1.setAttribute('role','button');
                div1.id = 'robot_div_id';
                div1.className = 'css-1fpgend';

                const section1 = document.createElement('section');
                section1.id = 'robot_section_id';
                section1.className = 'css-1h8c63v';

                const div2 = document.createElement('div');
                div2.textContent = 'ABB Robot TSO';
                div2.style.width = 'min-content';

                div1.appendChild(section1);
                section1.appendChild(div2);
                span1.appendChild(div1);

                element.appendChild(span1);

                div1.addEventListener('click', function() {
                    // Ukrywanie panelu bagowej i usuwanie obramowania
                    bagowaPanel.style.display = 'none';
                    const bagowaSection = document.querySelector('#bagowa_section_id');
                    if (bagowaSection) bagowaSection.style.border = '';

                    // Przełączanie widoczności panelu robota
                    if (robotPanel.style.display === 'none' || robotPanel.style.display === '') {
                        robotPanel.style.display = 'block';
                        document.querySelector('#robot_section_id').style.border = 'yellowgreen 3px solid';
                        // Ukrywanie oryginalnej tabeli
                        document.querySelector('.css-9wtx8v').style.display = 'none';
                    } else {
                        robotPanel.style.display = 'none';
                        document.querySelector('#robot_section_id').style.border = '';
                        // Pokazywanie oryginalnej tabeli
                        document.querySelector('.css-9wtx8v').style.display = '';
                    }
                });
            }
        });
    };


    // Obserwuj body strony pod kątem zmian
    observeDOM( document.body, function(){ addDivAndButton(); });
})();
