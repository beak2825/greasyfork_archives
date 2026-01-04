// ==UserScript==
// @name         Chaturbate MultiView
// @namespace    http://tampermonkey.net/
// @version      2.54
// @description  Multiview for Chaturbate
// @author       TomaszFromasz
// @match        https://chaturbate.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482213/Chaturbate%20MultiView.user.js
// @updateURL https://update.greasyfork.org/scripts/482213/Chaturbate%20MultiView.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var AlreadyWatched = [];

    if(sessionStorage.getItem("multiview_alreadywatched"))
    {
        AlreadyWatched = sessionStorage.getItem("multiview_alreadywatched").split(',');
    }

    // jeżeli strona główna , odpal observer na female-cams random
    if(window.location == 'https://chaturbate.com/' || window.location == 'https://pl.chaturbate.com/' || window.location.href.includes('https://chaturbate.com/?') || window.location.href.includes('https://chaturbate.com/female-cams/') || window.location == 'https://chaturbate.com/discover/'
       || window.location == 'https://chaturbate.com/discover/female/' )
    {

        var roomCards_1stpage;
        // zapisz female do zmiennej
        roomCards_1stpage = fetchUsernames_female('https://chaturbate.com/api/ts/roomlist/room-list/?enable_recommendations=false&genders=f&limit=90&offset=0')
            .then(usernames => {
            roomCards_1stpage = usernames;
            //    console.log(roomCards_1stpage);
        })
            .catch(error => {
            console.error('Błąd podczas pobierania danych:', error);
        });


        //         // Zablokuj odświeżanie przez meta tagi
        //         var metaRefresh = document.querySelector('meta[http-equiv="refresh"]');
        //         if (metaRefresh) {
        //             metaRefresh.parentNode.removeChild(metaRefresh);
        //         }

        //         // Nadpisz funkcje przekierowujące
        //         window.originalLocation = window.location;
        //         // delete window.location;
        //         // window.location = new Proxy(window.originalLocation, {
        //         //     set: function(target, property, value) {
        //         //         console.log(`Próba przekierowania zablokowana: ${property} = ${value}`);
        //         //         return true;
        //         //     }
        //         // });

        //         // Nadpisz funkcje setTimeout i setInterval
        //         window.originalSetTimeout = window.setTimeout;
        //         window.originalSetInterval = window.setInterval;
        //         window.setTimeout = function() {};
        //         window.setInterval = function() {};

        //         //  Zablokuj location.reload()
        //        // window.location.reload = function() {};


        // Przycisk do zamknięcia karty
        var closeButton = document.createElement('button');
        closeButton.style = 'position:fixed;z-index:999999;right:2%;bottom:2%;';
        closeButton.textContent = 'Zamknij kartę';
        document.body.appendChild(closeButton);

        closeButton.addEventListener('click', function() {
            window.close();
        });

        mainFunction();
        updateRoomCardColors();


        // Utworzenie obserwatora zmian w DOM
        const observer = new MutationObserver(addButtonsToAllRoomCards);

        // Rozpoczęcie obserwacji
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    else
    {
        // var AlreadyWatched = [];


        // zapisz female do zmiennej
        roomCards_1stpage = fetchUsernames_female('https://chaturbate.com/api/ts/roomlist/room-list/?enable_recommendations=false&genders=f&limit=90&offset=0')
            .then(usernames => {
            roomCards_1stpage = usernames;
            //    console.log(roomCards_1stpage);
        })
            .catch(error => {
            console.error('Błąd podczas pobierania danych:', error);
        });
        // Always start muted
        if(document.getElementById('chat-player_html5_api'))
        {
            document.getElementById('chat-player_html5_api').muted = true;
        }

        // Definicja funkcji poza obserwatorem
        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        var theater;
        var pacz = true;
        var ukryte = false;


        // Zakładam, że pacz, ukryte, AlreadyWatched, hideSiblings, clickElementWhenAppears, generateNewUrl
        // są dostępne w globalnym zasięgu lub we właściwym module.

        // Pomocnicza tablica fraz oznaczających "offline"
        const OFFLINE_TERMS = [
            "offline",
            "pokaz prywatny",
            "Kamera jest ukryta",
            "nieobecny"
        ];

        const observer2 = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                // Sprawdzamy tylko dwa typy mutacji
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    for (const addedNode of mutation.addedNodes) {
                        // Przykład: jeżeli interesuje nas, że node musi być elementem, a nie np. tekstem
                        if (!(addedNode instanceof HTMLElement)) {
                            continue;
                        }

                        // // Szukamy głównego kontenera w trybie Theater
                        const theaterModePlayer = document.querySelector('#TheaterModeRoomContents');
                        // Alternatywnie lub dodatkowo:
                        const TheaterModeRoomContents2 = document.querySelector('.videoPlayerDiv');

                        if(TheaterModeRoomContents2)
                        {
                            const TheaterModeRoomContents = TheaterModeRoomContents2.querySelector("video");

                            // Główna logika, gdy mamy #TheaterModeRoomContents
                            if (TheaterModeRoomContents) {
                                // Szukamy konkretnego elementu wewnątrz #TheaterModePlayer
                                const theater = document
                                .querySelector("#TheaterModePlayer")
                                ?.children?.[0]
                                ?.children?.[0];

                                // Sprawdzamy, czy pacz jest true oraz czy tekst zawiera którąś z fraz OFFLINE_TERMS
                                if (pacz && theater?.innerText) {
                                    const lowerText = theater.innerText.toLowerCase();
                                    const isOffline = OFFLINE_TERMS.some((term) => lowerText.includes(term));

                                    if (isOffline) {
                                        pacz = false; // wyłączamy tę funkcjonalność, żeby nie wywoływać wielokrotnie

                                        const tempName = document.location.pathname.replace(/\//g, "");
                                        someGlobalName = tempName;

                                        // Generujemy nowy URL
                                        generateNewUrl(event)
                                            .then((newUrl) => {

                                            showLoadingOverlay(tempName);

                                            AlreadyWatched.push(tempName);
                                            sessionStorage.setItem("multiview_alreadywatched",AlreadyWatched);

                                            updateLoadingOverlay(tempName, newUrl);
                                            window.location.href = "https://chaturbate.com/" + newUrl;

                                            // document.querySelector('[id^="iframe_div_"]').querySelector('iframe').src = "https://chaturbate.com/" + newUrl;

                                            // observer2.disconnect();
                                            return;
                                        })
                                            .catch((error) => {
                                            console.error("Wystąpił błąd podczas generowania URL:", error);

                                            generateNewUrl(event)
                                                .then((newUrl) => {

                                                window.location.href = "https://chaturbate.com/" + generateNewUrl(event);
                                                observer2.disconnect();
                                                return;
                                            });
                                        });

                                        // Po wywołaniu przekierowania kończymy dalszą pętlę
                                        return;
                                    }
                                }
                            }

                            // Druga część logiki – sprawdzenie, czy mamy .videoPlayerDiv i czy element nie jest jeszcze ukryty
                            //const TheaterModeRoomContents_ = document.querySelector('.videoPlayerDiv');
                            if (TheaterModeRoomContents && !ukryte && !document.querySelector('multiview_follow_clone')) {
                                ukryte = true; // zapobiegamy ponownemu wywołaniu

                                console.log("CLICK");


                                // Wywołujemy funkcję klikającą w element, jeśli trzeba
                                clickElementWhenAppears("auto</span>");

                                //                                 const obserwujBtn = document.querySelector(".followButton");

                                //                                 // Kopiujemy i ustawiamy przycisk "Obserwuj"
                                //                                 let clonedElement = obserwujBtn.cloneNode(true); // Kopiowanie z dziećmi (głębokie kopiowanie)
                                //                                 clonedElement.id = 'multiview_follow_clone';

                                //                                 if (obserwujBtn && obserwujBtn.style.display === "inline") {
                                //                                     obserwujBtn.style = `
                                //                                               cursor: pointer;
                                //                                               position: absolute;
                                //                                               overflow: hidden;
                                //                                               font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
                                //                                               font-size: 12px;
                                //                                               padding: 3px 8px 2px;
                                //                                               border-radius: 3px;
                                //                                               float: inherit;
                                //                                               bottom: 10%;
                                //                                               right: 2%;
                                //                                               z-index: 999;
                                //                                               display: none;
                                //                                               position: fixed;`;

                                //                                     clonedElement.style = `
                                //                                               cursor: pointer;
                                //                                               position: absolute;
                                //                                               overflow: hidden;
                                //                                               font-family: UbuntuMedium, Helvetica, Arial, sans-serif;
                                //                                               font-size: 12px;
                                //                                               padding: 3px 8px 2px;
                                //                                               border-radius: 3px;
                                //                                               float: inherit;
                                //                                               bottom: 25%;
                                //                                               right: 2%;
                                //                                               z-index: 999;
                                //                                               display: none;
                                //                                               position: fixed;`;

                                //                                     obserwujBtn.id = 'multiview_follow';
                                //                                     clonedElement.id = 'multiview_follow_clone';

                                //                                     // Pokazujemy przycisk po najechaniu myszką
                                //                                     TheaterModeRoomContents?.addEventListener("mouseover", () => {
                                //                                         obserwujBtn.style.display = "block";
                                //                                         clonedElement.style.display = "block";
                                //                                     });

                                //                                     TheaterModeRoomContents?.addEventListener("mouseleave", () => {
                                //                                         obserwujBtn.style.display = "none";
                                //                                         clonedElement.style.display = "none";

                                //                                     });
                                //                                 }


                                // Ukrywamy rodzeństwo elementu TheaterModeRoomContents
                                let parentElement = TheaterModeRoomContents.parentElement;
                                while (parentElement && parentElement !== document.body) {
                                    hideSiblings(parentElement);
                                    parentElement = parentElement.parentElement;
                                }

                                // document.querySelector('.theater-overlay').remove();

                                // Ukrycie elementu .defaultColor.styledDiv, jeśli istnieje
                                const defaultStyledDiv = document.querySelector('.defaultColor.styledDiv');
                                if (defaultStyledDiv) {
                                    defaultStyledDiv.style.display = 'none';
                                }

                                // // Wstawiamy przycisk obserwuj do #TheaterModeRoomContents (lub .videoPlayerDiv)
                                // if (TheaterModeRoomContents && obserwujBtn) {
                                //     //  TheaterModeRoomContents.parentElement.appendChild(obserwujBtn);
                                //     TheaterModeRoomContents.parentElement.appendChild(clonedElement);
                                // }
                            }
                        }
                        else
                        {

                        }
                    }
                }
            }
        });

        // Np. konfiguracja i obserwacja (przykład – może być już ustawione u Ciebie)
        // observer2.observe(document.documentElement, {
        //     childList: true,
        //     subtree: true,
        //     characterData: true
        // });



        function hideSiblings(element) {
            setTimeout(function() {
                const siblings = Array.from(element.parentElement.children);
                for (const sibling of siblings) {
                    if (sibling !== element) {
                        if(sibling.id != 'multiview_follow' && sibling.className != 'loading_overlay') {
                            sibling.style.display = 'none';
                        } else {
                            // Ustawienie padding i margin dla elementów, które nie są ukrywane
                            sibling.style.padding = '0px';
                            sibling.style.margin = '0px';
                        }
                    }
                }
            },300);
        }

        const config = {
            childList: true,
            subtree: true
        };

        // observer2.observe(document.body, config);

        const config2 = {
            childList: true,
            subtree: true
        };

        setTimeout(function()
                   {
            // Always start muted
            if(document.getElementById('chat-player_html5_api'))
            {
                document.getElementById('chat-player_html5_api').muted = true;
            }


            // Zakładam, że observer2 już istnieje gdzie indziej w kodzie

            observer2.observe(document.documentElement, {
                childList: true,
                subtree: true,
                characterData: true
            });

            // observer2.observe(document.body, config);
        },3000);

    }





    // // var TheaterModePlayer = document.getElementById('TheaterModePlayer');
    // // chat-player_html5_api
    // // console.log(TheaterModePlayer);
    // if(document.getElementsByClassName('offlineContentContainer')[0])
    // {
    //     if(document.getElementsByClassName('offlineContentContainer')[0].style.display == "none")
    //     {
    //         generateNewUrl(event)
    //             .then(newUrl => {
    //             // AlreadyWatched.push(document.location.pathname.replaceAll("/",""));
    //             console.log('Wygenerowany nowy URL:', newUrl);
    //             document.location.href = 'https://chaturbate.com/' + newUrl;
    //             observer2.disconnect();
    //         })
    //             .catch(error => {
    //             console.error('Wystąpił błąd podczas generowania URL:', error);
    //         });
    //         observer2.disconnect();
    //     }
    // }




    const roomCards = document.querySelectorAll('.roomCard');
    var hrefs = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
    var AlreadyWatching = hrefs;



    if(hrefs == null)
    {
        hrefs = "";
    }

    // Funkcja do przetwarzania href i usuwania "/" z początku i końca
    function processHref(href) {
        // Usuwa pierwszy i ostatni znak "/" z href
        if(href == null)
        {
            return "dreamsweetgirl";
        }
        else
        {
            //href = href.replace('/female-cams/','');
            return href.replace(/^\/|\/$/g, '');
        }
    }






    async function fetchUsernames_female(url) {
        try {
            // Wykonanie zapytania GET
            const response = await fetch(url);

            // Parsowanie odpowiedzi jako JSON
            const data = await response.json();

            // Sprawdzenie, czy odpowiedź zawiera element 'rooms'
            if (!data.rooms) {
                throw new Error("'rooms' not found in the response");
            }

            // Przetwarzanie każdego obiektu w 'rooms' i wyciąganie 'username'
            const usernames = data.rooms.map(room => room.username);

            // Zwrócenie tablicy z username
            return usernames;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    function CheckIfPublic(name) {
        // console.log(name);
        return new Promise((resolve, reject) => {
            // Assuming fetch is used to check if the name is public
            // console.log('CheckIfPublic_name: ' + name);
            //   console.log(name);
            fetch('https://chaturbate.com/api/biocontext/' + name)
                .then(response => response.json())
                .then(data => {
                const status = data.room_status;
                // console.log(status);
                if (status === 'public') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
                .catch(error => {
                console.error("Error fetching data:", error);
                reject(error);
            });
        });
    }

    // =================================================================
    // PRZYKŁADOWE FUNKCJE NAKŁADKI
    // =================================================================

    // showLoadingOverlay(name) - tworzy/wyświetla nakładkę w iframe_div_name
    function showLoadingOverlay(name) {

        //   console.log(name);

        var tempName2 = document.location.pathname.replace(/\//g, "");
        var overlay = document.getElementById('loading_overlay_' + name);

        if (!overlay) {
            // Jeśli nie istnieje, tworzymy
            overlay = document.createElement('div');
            overlay.id = 'loading_overlay_' + name;
            overlay.className = 'loading_overlay';
            overlay.style = `
            display: flex;
            position: absolute;
            top: 0%;
            z-index: 8888888;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 70%;
            overflow: hidden;
            padding-top: 10%;
            background: rgba(255,255,255,0.4); /* np. półprzezroczyste tło */
        `;

            // Twój obrazek
            const loadingImage = document.createElement('img');
            loadingImage.src = 'https://thumb.live.mmcdn.com/riw/' + name + '.jpg';
            loadingImage.id = 'overlay_image_' + name;
            loadingImage.style = 'width: 50%;';

            // Tekst statusu
            const statusText = document.createElement('div');
            statusText.className = 'overlay-status-text';
            statusText.textContent = 'Ładowanie...';
            statusText.style = 'color: white; font-size: large; padding: 3%; background-color: #0c6a93; width: 50%;';

            overlay.appendChild(loadingImage);
            overlay.appendChild(statusText);

            // Wstawiamy do diva, który ma ID = "iframe_div_name"
            const parentDiv = document.getElementById('iframe_div_' + name);
            //     console.log(parentDiv);
            if (parentDiv) {
                parentDiv.style.position = 'relative'; // ważne, żeby overlay "absolutny" się poprawnie ułożył
                parentDiv.appendChild(overlay);
            } else {
                console.warn('Nie znaleziono parentDiv = iframe_div_' + name);
                document.getElementById('main').appendChild(overlay);
            }
        } else {
            // Jeśli istnieje, tylko go pokazujemy
            overlay.style.display = 'flex';
        }
    }

    // updateLoadingOverlay(name, text) - zmienia napis w nakładce
    function updateLoadingOverlay(name, text) {
        const overlay = document.getElementById('loading_overlay_' + name);
        if (overlay) {
            const statusText = overlay.querySelector('.overlay-status-text');
            if (statusText) {
                statusText.textContent = text;
            }
        }
    }

    // hideLoadingOverlay(name) - chowa nakładkę
    function hideLoadingOverlay(name) {
        const overlay = document.getElementById('loading_overlay_' + name);
        if (overlay) {
            overlay.style.display = "none";
        }
    }

    // =================================================================
    // FUNKCJA generateNewUrl – tu dodajemy wywołania nakładki
    // =================================================================
    async function generateNewUrl(event) {
        // Ustalamy, dla którego iframu generujemy link.
        let divId = null;
        let iframeDiv = null;

        // Jeśli jest event (kliknięcie w przycisk)
        if(event) {
            console.log(event.type);
            if(event.type === "click")
            {
                const button = event.target;
                console.log(button.type);
                const parentDiv = button.closest('div');
                divId = parentDiv?.id.replace('iframe_controls_','');
                showLoadingOverlay(divId);
            }
            else
            {
                divId = someGlobalName;
            }
        }
        else {
            // Brak eventu, np. wywołanie z observera
            // Musisz tu sam zdecydować, skąd brać "name".
            // Jeśli wywołujesz np. generateNewUrl() z createAndAppendIframe(),
            // to możesz tam przekazać wprost "uniqueId".
            // Dla przykładu:
            if (someGlobalName) {
                divId = someGlobalName;
            } else {
                console.warn("Nie mam eventu i nie wiem, które ID iframu użyć");
                // return;
            }
        }

        // Pokaż nakładkę
        // showLoadingOverlay('test');
        updateLoadingOverlay(divId, "Losuję nowy link...");

        let name = roomCards_1stpage[Math.floor(Math.random() * roomCards_1stpage.length)];
        if (name === undefined) {
            console.log("Brak linków do wylosowania.");
            // hideLoadingOverlay(divId);
            return generateNewUrl(event);
        }

        let wasBefore = sessionStorage.getItem("multiview_alreadywatched");

        if(wasBefore.length !== 0 && wasBefore.includes(name)) {
            console.log("Link był już wcześniej oglądany: ", name);
            updateLoadingOverlay(divId, "Ten link był już wylosowany, losuję ponownie...");

            // Rekurencja
            const url = await generateNewUrl(event);
            // hideLoadingOverlay(divId);
            return url;
        } else {
            // Sprawdzamy, czy link jest publiczny
            updateLoadingOverlay(divId, "Sprawdzam, czy link jest publiczny...\r\n" + name);
            let status = await CheckIfPublic(name);

            if(status) {
                updateLoadingOverlay(divId, name);
                //   console.log(divId);

                AlreadyWatched.push(name);
                sessionStorage.setItem("multiview_alreadywatched", AlreadyWatched);

                console.log("Wygenerowany link: ", name);
                if(document.getElementById('overlay_image_' + divId))
                {
                    document.getElementById('overlay_image_' + divId).src = 'https://thumb.live.mmcdn.com/riw/' + name + '.jpg';
                }

                // setTimeout(function(){
                //     hideLoadingOverlay(divId);
                // },5000);



                return name;
            } else {
                // Link nie jest publiczny
                roomCards_1stpage = roomCards_1stpage.filter(item => item !== name);
                console.log("Link niepubliczny. Losuję kolejny...");
                updateLoadingOverlay(divId, "Link nie jest publiczny, losuję kolejny...");
                const url = await generateNewUrl(event);
                setTimeout(function(){
                    // hideLoadingOverlay(divId);
                },5000);
                return url;
            }
        }
    }



    /**
 * Funkcja tworzy i umieszcza (append) nowy iframe w przekazanym kontenerze.
 * Zwraca Promise, który rozwiązuje się po załadowaniu iframe'a (event onload).
 * @param {HTMLElement} parent - rodzic, do którego dołączamy iframe.
 * @param {string} initialUrl - URL, na bazie którego budujemy docelowy adres iframe'a.
 * @returns {Promise<void>}
 */

    let someGlobalName;
    // =================================================================
    // FUNKCJA createAndAppendIframe – bez większych zmian, jedynie drobna kosmetyka
    // =================================================================
    async function createAndAppendIframe(parent, initialUrl) {

        const iframeContainer = document.createElement('div');
        iframeContainer.style.position = 'relative';

        //  console.log("test2");
        // Przykładowo, różne marginesy w zależności od liczby linków
        if (roomCards_1stpage.length < 5) {
            iframeContainer.style.marginTop = '-8%';
        }

        if (roomCards_1stpage.length >= 5) {
            iframeContainer.style.marginTop = '-4.5%';
        }
        else
        {
            iframeContainer.style.marginTop = '-7%';
        }

        //  console.log("url1: " + initialUrl);
        let url = initialUrl;

        //  console.log("url2: " + url);
        // Sprawdzamy, czy URL jest OK
        if (url && CheckIfPublic(url)) {
            AlreadyWatched.push(url);
            sessionStorage.setItem("multiview_alreadywatched", AlreadyWatched);

        } else {
            console.log("test45");
            roomCards_1stpage = roomCards_1stpage.filter((item) => item !== url);
            console.log('Wywołuję generateNewUrl(event) z createAndAppendIframe()');
            url = await generateNewUrl(event);
        }

        const currentDate = new Date();
        const milliseconds = currentDate.getMilliseconds();

        const uniqueId = url;
        iframeContainer.id = `iframe_div_${uniqueId}`;
        iframeContainer.style.zIndex = new Date().valueOf();


        const iframe = document.createElement('iframe');
        iframe.src = `https://chaturbate.com/${url}`;
        iframe.id = `iframe_id_` + uniqueId;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
        iframe.setAttribute('scrolling', 'no');

        // console.log(url);
        if(await !CheckIfPublic(url))
        {
            console.log("test48");
            console.log("test4");
            url = await generateNewUrl();
            iframe.src = `https://chaturbate.com/${url}`;
        }


        iframe.onload = function() {
            setTimeout(function(){
                console.log("test4");
                hideLoadingOverlay(url);
                console.log("test50");
            },3000);
        };

        iframe.addEventListener( "load", function(e) {
            console.log("test51");
            setTimeout(function(){
                console.log("test5");
                hideLoadingOverlay(url);
            },3000);
        } );

        // Kontener z przyciskami
        const iframeControls = document.createElement('div');
        iframeControls.id = `iframe_controls_${uniqueId}`;

        // Pozycjonowanie i rozmiar panelu
        iframeControls.style.position = 'absolute';
        iframeControls.style.top = '0';
        iframeControls.style.right = '0';
        iframeControls.style.width = '25%';          // 10% szerokości
        iframeControls.style.margin = '1%';
        iframeControls.style.display = 'none';
        iframeControls.style.flexDirection = 'column';
        iframeControls.style.zIndex = '9999999999';

        // Opcjonalne tło/wygląd - jeśli chcesz np. półprzezroczyste białe tło
        // iframeControls.style.backgroundColor = 'rgba(255,255,255,0.7)';
        // iframeControls.style.border = '1px solid #ccc';
        // iframeControls.style.borderRadius = '4px';

        // Po najechaniu myszą pokaż panel
        iframeControls.addEventListener('mouseover', () => {
            iframeControls.style.display = 'flex';
        });

        // Po zjechaniu myszy schowaj panel (jeśli chcemy efekt chowania po wyjechaniu kursorem)
        iframeControls.addEventListener('mouseout', () => {
            iframeControls.style.display = 'none';
        });




        // 1. Przycisk Obserwuj
        const iframeObserve = document.createElement('button');
        iframeObserve.id = `observe_btn_id_${uniqueId}`;
        iframeObserve.style = 'margin:5%;text-align:left;';

        console.log(uniqueId + "_1");
        console.log(uniqueId);
        if(await checkFollowedRooms(uniqueId))
        {
            iframeObserve.textContent = '💔 PRZESTAŃ OBSERWOWAĆ';

            iframeObserve.onclick = async () => {
                // Tutaj wstaw logikę obsługi przycisku "Obserwuj"
                var csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                await fetch("https://chaturbate.com/follow/unfollow/" + uniqueId + "/", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                        "Accept": "*/*",
                        "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
                        "X-NewRelic-ID": "VQIGWV9aDxACUFNVDgMEUw==",
                        "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjE0MTg5OTciLCJhcCI6IjI0NTA2NzUwIiwiaWQiOiI0NDljZGUzMzg4MTJkMmQxIiwidHIiOiJmYmU4N2JhOTFlNWFlNjY5M2I3NzA0ZWUxNzg3NjA1MSIsInRpIjoxNzM3Njk4ODU3NjMyfX0=",
                        "traceparent": "00-fbe87ba91e5ae6693b7704ee17876051-449cde338812d2d1-01",
                        "tracestate": "1418997@nr=0-1-1418997-24506750-449cde338812d2d1----1737698857632",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "multipart/form-data; boundary=---------------------------14659865871731049416649089673",
                        "Sec-GPC": "1",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=0",
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    },
                    "body": "-----------------------------14659865871731049416649089673\r\nContent-Disposition: form-data; name=\"location\"\r\n\r\nFollowButton\r\n-----------------------------14659865871731049416649089673\r\nContent-Disposition: form-data; name=\"csrfmiddlewaretoken\"\r\n\r\n" +
                    csrfmiddlewaretoken + "\r\n-----------------------------14659865871731049416649089673--\r\n",
                    "method": "POST",
                    "mode": "cors"
                });

                console.log('Przestań obserwować kliknięty!');
                iframeObserve.textContent = '⭐ OBSERWUJ';
            }
        }
        else
        {
            iframeObserve.textContent = '⭐ OBSERWUJ';

            iframeObserve.onclick = async () => {
                // Tutaj wstaw logikę obsługi przycisku "Obserwuj"
                var csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                await fetch("https://chaturbate.com/follow/follow/" + uniqueId + "/", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                        "Accept": "*/*",
                        "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
                        "X-NewRelic-ID": "VQIGWV9aDxACUFNVDgMEUw==",
                        "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjE0MTg5OTciLCJhcCI6IjI0NTA2NzUwIiwiaWQiOiJiMzJmMGQ3ZGRlYjczMWY2IiwidHIiOiI0NmJhNzkwMDk5N2MzNzM4NTk3N2MxMGZkY2RhNGIwNyIsInRpIjoxNzM3NDI4OTQxNTU5fX0=",
                        "traceparent": "00-46ba7900997c37385977c10fdcda4b07-b32f0d7ddeb731f6-01",
                        "tracestate": "1418997@nr=0-1-1418997-24506750-b32f0d7ddeb731f6----1737428941559",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "multipart/form-data; boundary=---------------------------1504890601746928641650223395",
                        "Sec-GPC": "1",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin",
                        "Priority": "u=0",
                        "Pragma": "no-cache",
                        "Cache-Control": "no-cache"
                    },
                    "body": "-----------------------------1504890601746928641650223395\r\nContent-Disposition: form-data; name=\"location\"\r\n\r\nFollowButton\r\n-----------------------------1504890601746928641650223395\r\nContent-Disposition: form-data; name=\"csrfmiddlewaretoken\"\r\n\r\n" +
                    csrfmiddlewaretoken + "\r\n-----------------------------1504890601746928641650223395--\r\n",
                    "method": "POST",
                    "mode": "cors"
                });

                console.log('Obserwuj kliknięty!');
                iframeObserve.textContent = '💔 PRZESTAŃ OBSERWOWAĆ';
            };
        }

        // 2. Przycisk Odśwież (Reload)
        const iframeReload = document.createElement('button');
        iframeReload.id = `reload_btn_id_${uniqueId}`;
        iframeReload.textContent = '🔄 ODśWIEŻ';
        iframeReload.style = 'padding:2%;margin:5%;text-align:left;';
        iframeReload.onclick = async () => {
            var iframe_src = iframe.contentDocument.URL;

            const regex = /\/([^\/]+)\/?$/;
            const match = iframe_src.match(regex);


            hideLoadingOverlay(uniqueId);
            // Przeładowanie iframe
            showLoadingOverlay(match);
            document.getElementById('overlay_image_' + match).src = 'https://thumb.live.mmcdn.com/riw/' + match + '.jpg';
            updateLoadingOverlay(match, "Odświeżam...");



            iframe.src = iframe.src;
        };

        // 3. Przycisk Losuj (Random)
        const iframeRandom = document.createElement('button');
        iframeRandom.id = `random_btn_id_${uniqueId}`;
        iframeRandom.textContent = '🎲 LOSUJ';
        iframeRandom.style = 'padding:2%;margin:5%;text-align:left;';
        iframeRandom.onclick = async () => {
            document.getElementById('overlay_image_' + uniqueId).src = '';
            const newUrl = await generateNewUrl(event); // Twoja funkcja generująca nowy URL
            someGlobalName = newUrl;
            iframe.src = `https://chaturbate.com/${newUrl}`;
            iframe.id = newUrl;

            if(await checkFollowedRooms(newUrl))
            {
                iframeObserve.textContent = '💔 PRZESTAŃ OBSERWOWAĆ';
            }
            else
            {
                iframeObserve.textContent = '⭐ OBSERWUJ';

                iframeObserve.onclick = async () => {
                    // Tutaj wstaw logikę obsługi przycisku "Obserwuj"
                    var csrfmiddlewaretoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
                    await fetch("https://chaturbate.com/follow/follow/" + newUrl + "/", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                            "Accept": "*/*",
                            "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
                            "X-NewRelic-ID": "VQIGWV9aDxACUFNVDgMEUw==",
                            "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjE0MTg5OTciLCJhcCI6IjI0NTA2NzUwIiwiaWQiOiJiMzJmMGQ3ZGRlYjczMWY2IiwidHIiOiI0NmJhNzkwMDk5N2MzNzM4NTk3N2MxMGZkY2RhNGIwNyIsInRpIjoxNzM3NDI4OTQxNTU5fX0=",
                            "traceparent": "00-46ba7900997c37385977c10fdcda4b07-b32f0d7ddeb731f6-01",
                            "tracestate": "1418997@nr=0-1-1418997-24506750-b32f0d7ddeb731f6----1737428941559",
                            "X-Requested-With": "XMLHttpRequest",
                            "Content-Type": "multipart/form-data; boundary=---------------------------1504890601746928641650223395",
                            "Sec-GPC": "1",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin",
                            "Priority": "u=0",
                            "Pragma": "no-cache",
                            "Cache-Control": "no-cache"
                        },
                        "referrer": "https://chaturbate.com/akura_01/",
                        "body": "-----------------------------1504890601746928641650223395\r\nContent-Disposition: form-data; name=\"location\"\r\n\r\nFollowButton\r\n-----------------------------1504890601746928641650223395\r\nContent-Disposition: form-data; name=\"csrfmiddlewaretoken\"\r\n\r\n" +
                        csrfmiddlewaretoken + "\r\n-----------------------------1504890601746928641650223395--\r\n",
                        "method": "POST",
                        "mode": "cors"
                    });

                    console.log('Obserwuj kliknięty!');
                };
            }
        };

        // 4. Przycisk Zbanuj
        const iframeBan = document.createElement('button');
        iframeBan.id = `ban_btn_id_${uniqueId}`;
        iframeBan.textContent = '🚫 ZBANUJ';
        iframeBan.style = 'padding:2%;margin:5%;text-align:left;';
        iframeBan.onclick = () => {
            // Tutaj wstaw logikę obsługi przycisku "Zbanuj"
            console.log('Zbanuj kliknięty!');
        };

        // 4. Przycisk
        const iframeCams = document.createElement('button');
        iframeCams.id = `cams_btn_id_${uniqueId}`;
        iframeCams.textContent = '🎥 LiveCamRips';
        iframeCams.style = 'padding:2%;margin:5%;text-align:left;';
        iframeCams.onclick = () => {
            // document.getElementById(`iframe_id_` + uniqueId).src = 'https://livecamrips.su/search/' + uniqueId + '/1';
            window.open('https://livecamrips.tv/search/' + uniqueId + '/1','blank');
        };


        // Dodaj wszystkie przyciski do kontenera (z góry na dół)
        iframeControls.appendChild(iframeObserve);
        iframeControls.appendChild(iframeReload);
        iframeControls.appendChild(iframeRandom);
        iframeControls.appendChild(iframeBan);
        iframeControls.appendChild(iframeCams);

        // Na koniec dołącz kontener do dokumentu
        document.body.appendChild(iframeControls);

        // Ewentualnie, jeśli chcesz, żeby panel pojawiał się i znikał wraz z najechaniem na iframe,
        // możesz dodać eventy mouseover/mouseout także na samym iframe.
        iframe.addEventListener('mouseover', () => {
            iframeControls.style.display = 'flex';
        });

        iframe.addEventListener('mouseout', () => {
            iframeControls.style.display = 'none';
        });


        // Pokazywanie panelu przycisków
        iframeContainer.addEventListener('mouseover', () => {
            iframeControls.style.display = 'flex';
        });
        iframeContainer.addEventListener('mouseleave', () => {
            iframeControls.style.display = 'none';
        });

        // Dodajemy przyciski do kontenera, a kontener i iframe do głównego diva
        iframeControls.appendChild(iframeReload);
        iframeControls.appendChild(iframeRandom);
        iframeContainer.appendChild(iframeControls);
        iframeContainer.appendChild(iframe);

        parent.appendChild(iframeContainer);

        showLoadingOverlay(initialUrl);
        updateLoadingOverlay(initialUrl,initialUrl);


        if(document.getElementById('overlay_image_' + initialUrl))
        {
            document.getElementById('overlay_image_' + initialUrl).src = 'https://thumb.live.mmcdn.com/riw/' + initialUrl + '.jpg';
        }

        // Zwrotka – jeśli potrzebny jest moment zakończenia ładowania, można odkomentować
        return new Promise((resolve) => {
            iframe.onload = () =>
            console.log(initialUrl + "_1");
            //hideLoadingOverlay(initialUrl);
            resolve();
        });
    }


    /**
 * Tworzy siatkę iframe'ów na podstawie globalnej tablicy `hrefs` i rozmieszcza je w #MultiView_body.
 * Po utworzeniu przenosi przycisk dołączania na koniec i scrolluje do widoku.
 */
    async function createIframes() {
        const multiViewBody = document.getElementById('MultiView_body');
        if (!multiViewBody) return;

        // Czyścimy kontener i ustawiamy styl flex
        multiViewBody.innerHTML = '';
        // Tworzenie iframe'ów po kolei (sekwencyjnie)
        for (const processedHref of hrefs) {
            await addIframeToGrid(multiViewBody, processedHref);
        }


        // Przeniesienie przycisku na koniec siatki
        const addButtonContainer = document.getElementById('addButtonContainer');
        if (addButtonContainer) {
            multiViewBody.appendChild(addButtonContainer);
        }

        // Ustawienie początkowej wielkości (na wypadek, gdyby nic nie zostało dodane)
        updateIframesSize(multiViewBody);

        multiViewBody.scrollIntoView(true);
        let offset;
        if(hrefs.length >= 5)
        {
            offset = window.innerHeight * 0.1; // 5% wysokości okna
            window.scrollBy(0, -offset); // Przewiń w pionie o 5% wysokości okna
        }
        else
        {
            offset = window.innerHeight * 0.13; // 5% wysokości okna
            //  document.querySelector('#nav').scrollIntoView(true);
            window.scrollBy(0, -offset); // Przewiń w pionie o 5% wysokości okna
        }


        multiViewBody.style.width = "";
    }


    /**
 * Dodaje pojedynczy iframe do siatki i po każdym dodaniu aktualizuje rozmiar wszystkich iframe'ów.
 * @param {HTMLElement} multiViewBody - kontener, do którego dodajemy iframe.
 * @param {string} url - adres (częściowy) do załadowania w iframe.
 */
    async function addIframeToGrid(multiViewBody, url) {
        try {
            await createAndAppendIframe(multiViewBody, url);
            // Po dodaniu (i załadowaniu) nowego iframe'a, dopasowujemy ich rozmiar
            updateIframesSize(multiViewBody);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
        }
    }

    async function checkFollowedRooms(name) {
        console.log("CZEK");
        return new Promise((resolve, reject) => {
            console.log("CZEK2");
            // Assuming fetch is used to check if the name is public
            // console.log('CheckIfPublic_name: ' + name);
            fetch("https://chaturbate.com/follow/api/online_followed_rooms/", {
                "credentials": "include",
                "headers": {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
                    "X-NewRelic-ID": "VQIGWV9aDxACUFNVDgMEUw==",
                    "newrelic": "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjE0MTg5OTciLCJhcCI6IjI0NTA2NzUwIiwiaWQiOiJjOThmNGY5MWE3OThjOWRlIiwidHIiOiI4MTNjNmQ2YjQ5NDA1ZTBkZWY5ZTJkYjQ4YWYxZTVhYiIsInRpIjoxNzM3NDMwNzIyMjg5fX0=",
                    "traceparent": "00-813c6d6b49405e0def9e2db48af1e5ab-c98f4f91a798c9de-01",
                    "tracestate": "1418997@nr=0-1-1418997-24506750-c98f4f91a798c9de----1737430722289",
                    "X-Requested-With": "XMLHttpRequest",
                    "Sec-GPC": "1",
                    "Sec-Fetch-Dest": "empty",
                    "Sec-Fetch-Mode": "cors",
                    "Sec-Fetch-Site": "same-origin",
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache"
                },
                "method": "GET",
                "mode": "cors"
            })
                .then(response => response.json())
                .then(data => {

                console.log("test");
                console.log(data);

                var resp = JSON.stringify(data);

                console.log(resp);


                if(resp.includes(name))
                {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
                .catch(error => {
                console.error("Error fetching data:", error);
                reject(error);
            })
        });
    }


    /**
 * Oblicza wymiar siatki (liczba kolumn/wierszy), bazując na liczbie elementów.
 * @param {number} numItems - liczba elementów (iframe'ów).
 * @returns {number} - rozmiar siatki (np. 3 dla 9 elementów).
 */
    function calculateGridSize(numItems) {
        return Math.ceil(Math.sqrt(numItems));
    }

    /**
 * Dopasowuje rozmiar iframe'ów w kontenerze tak, aby tworzyły równą siatkę.
 * @param {HTMLElement} multiViewBody - główny kontener, w którym znajdują się iframe'y.
 */
    function updateIframesSize(multiViewBody) {
        const iframes = multiViewBody.querySelectorAll('iframe');
        const iframeCount = iframes.length;
        if (iframeCount === 0) return;

        const gridSize = calculateGridSize(iframeCount);

        // Szerokość każdego iframes w pikselach, dzielimy szerokość kontenera przez rozmiar siatki
        const iframeWidthPx = multiViewBody.clientWidth / gridSize;
        // Przyjmujemy proporcję 2:3 (wysokość:szerokość) -> np. 2/3 = ~0.666...
        const iframeHeightPx = iframeWidthPx * (2 / 3);

        const iframeWidth95Percent = iframeWidthPx * 0.95;

        iframes.forEach((iframe) => {
            iframe.style.width = `${iframeWidth95Percent}px`;
            iframe.style.height = `${iframeHeightPx}px`;
            iframe.style.border = 'none';
        });
    }

    /**
 * Usuwa wszystkie iframe'y (i inne elementy) z #MultiView_body.
 */
    function clearIframes() {
        const multiViewBody = document.getElementById('MultiView_body');
        if (multiViewBody) {
            multiViewBody.innerHTML = '';
        }
    }

    /**
 * Czyści 'płytki' (np. z nagłówka) i usuwa z localStorage.
 */
    function clearTiles() {
        localStorage.removeItem('roomCardHrefs');
        const multiViewHeader = document.getElementById('MultiView_header');
        if (multiViewHeader) {
            multiViewHeader.innerHTML = '';
        }
    }



    function removeHrefFromList(processedHref) {
        let hrefList = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
        const hrefIndex = hrefList.indexOf(processedHref);

        if (hrefIndex !== -1) {
            hrefList.splice(hrefIndex, 1);
            localStorage.setItem('roomCardHrefs', JSON.stringify(hrefList));
            createTilesForHeader(); // Aktualizuj kafelki w MultiView_header
            updateRoomCardColors(); // Aktualizuj kolory tła roomCards
        }
    }

    function createTilesForHeader() {
        var hrefs = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];

        const multiViewHeader = document.getElementById('MultiView_header');
        multiViewHeader.innerHTML = ''; // Czyść poprzednią zawartość

        // Przyciski START i STOP
        const startButton = document.createElement('button');
        startButton.textContent = 'START';
        startButton.onclick = createIframes;
        multiViewHeader.appendChild(startButton);

        const stopButton = document.createElement('button');
        stopButton.textContent = 'STOP';
        stopButton.onclick = clearIframes;
        multiViewHeader.appendChild(stopButton);

        // Przycisk WYCZYŚĆ
        const clearButton = document.createElement('button');
        clearButton.textContent = 'WYCZYŚĆ';
        clearButton.onclick = clearTiles;
        multiViewHeader.appendChild(clearButton);

        hrefs.forEach(processedHref => {
            const tileId = 'MultiView_' + processedHref; // Używamy przetworzonego href jako ID
            const tile = document.createElement('div');
            tile.id = tileId;
            tile.style.cssText = 'display: inline-block; margin: 5px; padding: 10px; border: 1px solid #ccc; position: relative; text-align: center;';

            // Miejsce na obrazek
            const imagePlaceholder = document.createElement('img');
            imagePlaceholder.src = 'https://thumb.live.mmcdn.com/riw/' + processedHref + '.jpg'; // Przykładowy sposób generowania URL obrazka
            imagePlaceholder.style.cssText = 'width: 75px; height: 50px; display: block; margin: 0 auto;';
            tile.appendChild(imagePlaceholder);

            // Tekst jako odnośnik
            const linkNode = document.createElement('a');
            linkNode.href = 'https://chaturbate.com/' + processedHref; // Zmień URL zgodnie z potrzebami
            linkNode.target = '_blank'; // Otwiera link w nowej karcie
            linkNode.textContent = processedHref;
            tile.appendChild(linkNode);

            // Przycisk do usuwania
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.style.cssText = 'position: absolute; top: 0; right: 0;';
            removeButton.onclick = function() {
                removeHrefFromList(processedHref);
            };
            tile.appendChild(removeButton);

            multiViewHeader.appendChild(tile);
        });
    }


    function createMenu(multiViewBody) {
        // Wysuwane z dołu menu
        const menu_div = document.createElement('div');
        menu_div.id = "menu_div_id";
        menu_div.style.cssText = `
        position: fixed;
        bottom: -15%;
        left: 0;
        width: 100%;
        height: 15%;
        background-color: #333; /* Przykładowy kolor tła */
        transition: bottom 0.3s;`;

        // Element wyzwalający wysuwanie
        const trigger_div = document.createElement('div');
        trigger_div.id = "trigger_div_id";
        trigger_div.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 50px;  /* Przykładowa szerokość */
        height: 20px; /* Przykładowa wysokość */
        background-color: #666; /* Przykładowy kolor tła */
        cursor: pointer;`;

        // Logika wysuwania menu
        trigger_div.addEventListener('mouseover', () => {
            menu_div.style.bottom = '0';
        });
        menu_div.addEventListener('mouseleave', () => {
            menu_div.style.bottom = '-15%';
        });

        multiViewBody.appendChild(menu_div);
        multiViewBody.appendChild(trigger_div);
    }

    function toggleMultiView() {

        updateRoomCardColors();

        function createMultiRoom()
        {
            // discover page
            var roomlistRoot = document.getElementById('roomlist_root');
            var mainElement = document.getElementById('main');

            mainElement.style.display = 'none';

            var contentElement = mainElement || null;

            // Zmiana widoczności roomlist_root
            if (roomlistRoot) {
                roomlistRoot.style.display = roomlistRoot.style.display === 'none' ? '' : 'none';
            }

            // Dodanie lub usunięcie MultiView_id
            if (contentElement) {
                let multiViewDiv = document.getElementById('MultiView_id');
                if (!multiViewDiv) {

                } else {
                    hrefs = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
                    // contentElement.removeChild(multiViewDiv);
                }
            }

            var multiViewDiv = document.createElement('div');
            multiViewDiv.id = 'MultiView_id';
            multiViewDiv.style = 'display:flex;flex-direction:column;align-items:center;';

            // Tworzenie i dodawanie MultiView_header
            const multiViewHeader = document.createElement('div');
            multiViewHeader.id = 'MultiView_header';

            if(hrefs.length >= 5)
            {
                multiViewHeader.style.marginBottom = '4.5%';
            }
            else
            {
                multiViewHeader.style.marginBottom = '7%';
            }

            multiViewDiv.appendChild(multiViewHeader);

            // Tworzenie i dodawanie MultiView_body
            const multiViewBody = document.createElement('div');
            multiViewBody.id = 'MultiView_body';
            multiViewBody.style = 'display:flex;flex-wrap:wrap;align-items:baseline;align-content:center;width:100%';
            multiViewDiv.appendChild(multiViewBody);

            //
            const multiViewBottom = document.createElement('div');
            multiViewBottom.id = 'multiViewBottom';
            multiViewDiv.appendChild(multiViewBottom);

            document.getElementById("header").appendChild(multiViewDiv);

            // Tworzenie kafelków
            createTilesForHeader();
            // document.getElementsByClassName('content')[0].style.height = '2048px';
            createMenu(document.getElementById('multiViewBottom'));
        }

        // discover page
        var roomlistRoot = document.getElementById('roomlist_root');
        var mainElement = document.getElementById('main');
        var contentElement = mainElement.querySelector('.content') || null;

        // Dodanie lub usunięcie MultiView_id
        if (contentElement) {
            let multiViewDiv = document.getElementById('MultiView_id');
            if (!multiViewDiv) {
                createMultiRoom();
            } else {
                hrefs = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
                contentElement.removeChild(multiViewDiv);
                createMultiRoom();
            }
        }


    }

    function addMultiViewButton() {
        const subNav = document.querySelector('#nav');
        if (subNav && !subNav.querySelector('#multiViewButton')) {
            const multiViewButton = document.createElement('li');
            multiViewButton.textContent = 'MultiView';
            multiViewButton.style.cssText = 'display: inline-block; position: relative; color: rgb(255, 255, 255); font: 13.999px ubuntumedium, Arial, Helvetica, sans-serif; cursor:pointer;';
            multiViewButton.classList.add('multiViewButton');
            multiViewButton.id = 'multiViewButton';

            // Dodanie obsługi zdarzenia kliknięcia
            multiViewButton.addEventListener('click', toggleMultiView);

            const multiViewCount = document.createElement('div');
            multiViewCount.style.cssText = 'display: inline-block; color: rgb(255, 255, 255); font: 13.999px ubuntumedium, Arial, Helvetica, sans-serif; cursor:pointer;padding-left:2%;';
            multiViewCount.id = 'multiViewCount';
            multiViewCount.textContent = '0';

            if(localStorage.getItem('roomCardHrefs') && localStorage.getItem('roomCardHrefs').split(',').length != 0)
            {
                multiViewCount.textContent = localStorage.getItem('roomCardHrefs').split(',').length;
            }


            multiViewButton.appendChild(multiViewCount);




            // Dodaj przycisk do elementu sub-nav
            subNav.appendChild(multiViewButton);
        }
    }


    function mainFunction() {



        setInterval(function(){
            updateRoomCardColors();
            // if(window.location.pathname === '/female-cams/')
            // {
            //     roomCards_1stpage = document.querySelectorAll('.roomCard');
            //     console.log(roomCards_1stpage);
            // }
        },1000);

        // Dodanie przycisków po raz pierwszy
        addButtonsToAllRoomCards();

        // Dodanie przycisku MultiView
        addMultiViewButton();

        // Po załadowaniu strony zaktualizuj kolory tła roomCards i kafelki
        window.addEventListener('load', function() {
            updateRoomCardColors();
            addButtonsToAllRoomCards();
            // createTilesForHeader();
        });
    }

    function addButtonsToAllRoomCards() {
        const roomCards = document.querySelectorAll('.roomCard'); // Załóżmy, że .roomCard to klasa kart pokoi
        roomCards.forEach(addButtonToRoomCard);

        const favCards = document.querySelectorAll('.roomElement');
        favCards.forEach(addButtonToRoomCard);
    }


    const hrefList = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];

    function updateRoomCardColors() {
        const hrefList = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
        const roomCards = document.querySelectorAll('.roomCard'); // Załóżmy, że .roomCard to klasa kart pokoi
        roomCards.forEach(card => {
            const href = processHref(card.querySelector('a').getAttribute('href'));
            if (hrefList.includes(href)) {
                card.style.backgroundColor = 'darkolivegreen';
            } else {
                card.style.backgroundColor = '';
            }
        });

        const favCards = document.querySelectorAll('.roomElement'); // Załóżmy, że .roomCard to klasa kart pokoi
        favCards.forEach(card => {
            const href = processHref(card.querySelector('a').getAttribute('href'));
            if (hrefList.includes(href)) {
                card.children[0].style.backgroundColor = 'darkolivegreen';
            } else {
                card.children[0].style.backgroundColor = '';
            }
        });
    }

    function extractQuality(filename) {
        // Użycie wyrażenia regularnego do znalezienia jakości filmu (np. 720p, 1080p, auto)
        const match = filename.match(/(\d{3,4}p|auto)/);
        // Sprawdzenie, czy jest dopasowanie
        if (match !== null && match.length > 1) {
            return match[1];
        } else {
            return null;
        }
    }



    function clickElementWhenAppears(outerHTML) {
        const tryClickElement = () => {

            if(extractQuality(document.querySelector('.slider').parentElement.children[2].children[0].src))
            {
                const element = document.getElementById("VideoPanel");
                const quality = document.getElementsByClassName("videoPlayerDiv")[0];
                const sterowanie = document.querySelector('.slider').parentElement.children[2].children[0].src.match(/(\d{3,4}p|auto)/)[0];

                if(sterowanie.length >= 5)
                {
                    sterowanie = sterowanie.substr(-sterowanie.length, -4);
                    sterowanie = sterowanie.replace('p','');
                }


                if(element != null)
                {
                    if (element.innerText === "Theater Mode" || element.innerText === "Tryb kinowy") {
                        element.click();
                    }
                    //  console.log(element);


                    if(sterowanie != null)
                    {
                        // // Trzymaj 480p zamiast auto
                        // if(sterowanie.children[2].textContent == "auto")
                        // {
                        //     quality.click();
                        // }

                        if (quality.innerHTML.includes(outerHTML))
                        {
                            if(sterowanie == "auto")
                            {
                                document.getElementById('TheaterModePlayer').querySelectorAll("div").forEach(function(qual) {

                                    if (qual.textContent.trim() === "480p") {
                                        qual.click();
                                    }
                                });
                            }

                            // element.click();
                            // createButtonsFromChildDivs();
                            return true; // Zwróć true, jeśli warunek został spełniony
                        }
                    }
                }
            }
            // if (!element) return false; // Sprawdź, czy element istnieje




            return false; // Zwróć false, jeśli element nie spełnia warunków
        };


        function updateButtonColors(sliderText) {
            // Znajdź wszystkie przyciski zaczynające się od "btn_"
            const allButtons = document.querySelectorAll('[id^="btn_"]');
            // Zresetuj kolor tła wszystkich przycisków
            allButtons.forEach(btn => btn.style.backgroundColor = '');

            // Znajdź i zmień kolor tła pasującego przycisku
            const matchingButton = document.getElementById('btn_' + sliderText);
            if (matchingButton) {
                matchingButton.style.backgroundColor = 'yellowgreen';
            }
        }

        // Utwórz MutationObserver do śledzenia zmian w tekstach
        const sliderTextElement = document.querySelector('.slider').parentElement.children[2].children[0];


        const observer_quality = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {

                    const newSliderText = document.querySelector('.slider').parentElement.children[2].children[0].src.match(/(\d{3,4}p|auto)/)[0];

                    if(newSliderText == "HD")
                    {
                        updateButtonColors(newSliderText);
                    }
                    else
                    {
                        updateButtonColors("1080p");
                    }
                }
            });
        });

        // Konfiguracja obserwatora
        const config_quality = { childList: true, characterData: true, subtree: true };


        const observerCallback = (mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {

                    if (tryClickElement()) {
                        // console.log("try");
                        document.getElementById("chat-close-btn").click();

                        document.getElementsByClassName("videoPlayerDiv")[0].style.overflow = "unset";
                        document.getElementsByClassName("videoPlayerDiv")[0].style.height = "79%";

                        document.getElementsByClassName('topSectionWrapper')[0].style.display = "";

                        document.getElementById("chat-player_html5_api").style.position = "fixed";
                        document.getElementById("chat-player").style.width = "auto";

                        document.getElementById("TheaterModePlayer").style.overflow = "";
                        document.getElementById("TheaterModePlayer").style.height = "auto";

                        document.getElementById("VideoPanel").style.width = "100%";
                        document.getElementById("TheaterModeRoomContents").style.padding = "0px";
                        document.getElementById("TheaterModeRoomContents").style.margin = "0px";

                        document.getElementsByClassName("videoPlayerDiv")[0].querySelector("video").style.height = "85%";
                        document.getElementsByClassName("videoPlayerDiv")[0].querySelector("video").style.marginTop = "-1.5%";

                        document.getElementsByClassName("theater-video-controls")[0].style.bottom = "20%";
                        document.getElementsByClassName("theater-video-controls")[0].style.position = "fixed";
                        document.getElementsByClassName("theater-video-controls")[0].className = "theater-video-controls";

                        createButtonsFromChildDivs();



                        // Rozpocznij obserwację elementu
                        observer_quality.observe(sliderTextElement, config_quality);
                        // Możesz również wywołać updateButtonColors początkowo, jeśli jest to potrzebne
                        updateButtonColors(document.querySelector('.slider').parentElement.children[2].children[0].src.match(/(\d{3,4}p|auto)/)[0]);
                        // observer3.disconnect(); // Poprawne odłączenie obserwatora



                        return;
                    }


                }
            }
        };

        const observer3 = new MutationObserver(observerCallback);
        const config = { childList: true, subtree: true };

        // console.log(document.body);
        observer3.observe(document.body, config);

        return false;
    };




    function createButtonsFromChildDivs() {
        var theaterModePlayer = document.getElementById("TheaterModePlayer");
        // console.log(theaterModePlayer);
        if (!theaterModePlayer) return; // Jeżeli element nie istnieje, zakończ funkcję

        // var allDivs = theaterModePlayer.querySelectorAll("div");
        // //console.log(allDivs);
        // var childDivs = Array.from(allDivs).filter(div => div.innerHTML.includes("auto</div>"));
        //         //console.log(childDivs);
        // childDivs = childDivs[0].childNodes;

        var childDivs = document.getElementById("TheaterModePlayer").lastChild.childNodes;
        // console.log(childDivs);

        // var qualityDiv = Array.from(allDivs).filter(div => div.innerText == "480p");
        // qualityDiv = qualityDiv[0].childNodes;

        var TheaterModeRoomContents = document.getElementById("TheaterModeRoomContents");
        TheaterModeRoomContents.style.padding = "";
        TheaterModeRoomContents.style.margin = "";
        TheaterModeRoomContents.querySelector('.topSectionWrapper').style.position = '';

        // console.log(childDivs);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.style = "z-index: 9999; position: absolute; top: 0;display:none; width: 75%;font-size:initial;";
        buttonsContainer.id = "buttonsContainer_id";

        buttonsContainer.addEventListener('mouseover', () => {
            buttonsContainer.style.display = 'block';
            tile.style.display = 'flex';
        });

        // // włącz 48p na start
        // qualityDiv.forEach((div, index) => {
        //     if (div.textContent.trim()) {
        //         qualityDiv[index].click();
        //     }
        // });

        childDivs.forEach((div, index) => {
            if(index < childDivs.length - 1)
            {
                if (div.textContent.trim()) {
                    if(!document.getElementById("btn_" + div.textContent.trim()))
                    {
                        const button = document.createElement('button');
                        button.textContent = div.textContent.trim();
                        button.id = "btn_" + div.textContent.trim();
                        button.style = "margin: 3px;border-radius:30px;border:1px black solid;";
                        button.onclick = function() {
                            // console.log(`Kliknięto przycisk: ${div.textContent.trim()}`);
                            // console.log(childDivs[index]);
                            childDivs[index].click(); // Kliknij na odpowiadający div
                        };
                        buttonsContainer.appendChild(button);
                    }
                }
            }
        });


        const name = window.location.pathname.replaceAll('/', '');
        //  console.log(name);
        const tileId = 'iFrame_tile_' + name;

        const tile = document.createElement('div');

        // Sprawdź, czy już istnieje taki element
        if (!document.getElementById(tileId)) {
            tile.id = tileId;
            tile.style.cssText = `
    height: 35%;
    left: 50%;
    transform: translate(-50%);
    position: fixed;
    text-align: center;
    bottom: 25%;
    display: none;
    z-index: 99999;
    align-content: center;
    align-items:center;
    flex-direction: column;
  `;

            //           const livecamprip = document.createElement('div');
            //           // zamiast display: contents; przetestuj block / inline / inline-block
            //           livecamprip.style.display = 'block';
            //           livecamprip.innerHTML = `
            //   <a href="https://livecamrips.com/search/${name}/1" target="_blank">
            //     <img
            //       width="10%"
            //       src="https://static-00.iconduck.com/assets.00/l-letter-icon-512x512-y3zwxhv2.png"
            //     />
            //   </a>
            // `;

            // Tworzymy nowy element <a> (link)
            const livecamprip = document.createElement('a');
            livecamprip.href = 'https://livecamrips.tv/search/' + name + '/1'; // Poprawny format href
            livecamprip.target = '_blank'; // Ustawiamy otwieranie linku w nowym oknie

            // Dodajemy style do elementu
            livecamprip.style.cssText = 'background-image:url("https://static-00.iconduck.com/assets.00/l-letter-icon-512x512-y3zwxhv2.png");background-size:contain;background-repeat:no-repeat;height:32px;width:32px;';

            // Można dodać eventListener na click, ale to nie jest konieczne, jeśli już mamy href i target='_blank'
            tile.appendChild(livecamprip);

            const linkNode = document.createElement('a');
            linkNode.href = 'https://chaturbate.com/' + name;
            linkNode.target = '_blank';
            linkNode.textContent = name;
            linkNode.style.cssText = 'font-size: large; color: black; padding:2px; background-color:azure;';
            tile.appendChild(linkNode);

            const imagePlaceholder = document.createElement('img');
            imagePlaceholder.src = `https://thumb.live.mmcdn.com/riw/${name}.jpg`;
            imagePlaceholder.style.cssText = 'height: 100%; display: block; margin: 0 auto;';
            tile.appendChild(imagePlaceholder);

            document.body.appendChild(tile);
        }


        if (buttonsContainer.childNodes.length > 0 && !document.getElementById('buttonsContainer_id')) {
            TheaterModeRoomContents.insertBefore(buttonsContainer, TheaterModeRoomContents.firstChild);
            document.getElementById('chat-player').style.height = "";
            document.getElementById('chat-player').appendChild(tile);

            TheaterModeRoomContents.addEventListener('mouseover', () => {
                buttonsContainer.style.display = 'block';
                tile.style.display = 'block';
            });

            TheaterModeRoomContents.addEventListener('mouseleave', () => {
                buttonsContainer.style.display = 'none';
                tile.style.display = 'none';
            });

        } else {
            // console.log("Nie znaleziono elementów DIV z tekstem do stworzenia przycisków.");
        }


    }

    function manageHrefList(href, roomCard) {
        let hrefList = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
        const processedHref = processHref(href);

        const hrefIndex = hrefList.indexOf(processedHref);

        if (hrefIndex === -1) {
            hrefList.push(processedHref);
            roomCard.style.backgroundColor = 'darkolivegreen';
        } else {
            hrefList.splice(hrefIndex, 1);
            roomCard.style.backgroundColor = '';
        }

        localStorage.setItem('roomCardHrefs', JSON.stringify(hrefList));

        hrefs = JSON.parse(localStorage.getItem('roomCardHrefs')) || [];
        document.getElementById('multiViewCount').textContent = hrefs.length;
    }

    function addButtonToRoomCard(card) {
        if (card.querySelector('button.cameraButton')) {
            return;
        }

        const cameraButton = document.createElement('button');
        cameraButton.innerHTML = '📷';
        cameraButton.classList.add('cameraButton');
        cameraButton.style.position = 'absolute';
        cameraButton.style.right = '3px';
        cameraButton.style.bottom = '0px';
        //  cameraButton.style.zIndex = '999';

        cameraButton.onclick = function() {
            const href = card.querySelector('a').getAttribute('href');
            manageHrefList(href, card);
            // AlreadyWatched.push(href);
            // sessionStorage.setItem("multiview_alreadywatched", AlreadyWatched);
            updateRoomCardColors();
        };

        card.style.position = 'relative';
        card.appendChild(cameraButton);
    }



})();
