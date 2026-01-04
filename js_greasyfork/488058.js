// ==UserScript==
// @name         curiosity? (Not anymore)
// @namespace    http://tampermonkey.net/
// @version      420
// @description  try to stop me, lol.
// @author       @nowaratn
// @match        https://cdnplay.learningcloud.me/*
// @match        https://amazon-learnerportal.learningcloud.me/*
// @icon         https://www.shutterstock.com/image-vector/hand-holding-question-mark-icon-600nw-2039941685.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488058/curiosity%20%28Not%20anymore%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488058/curiosity%20%28Not%20anymore%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Funkcja, która zostanie wykonana, gdy element się pojawi
    function wykonajAkcje() {
        // Tworzenie solving button
        const solveBtn = document.createElement('button');
        solveBtn.classList.add('ntx-quiz-introduction-btn-content');
        solveBtn.style = "float:left;";
        solveBtn.id = 'solveBtn_id'
        solveBtn.textContent = 'Solve';
        document.querySelector('.ntx-quiz-footer.clearfix').appendChild(solveBtn);

        document.getElementById ("solveBtn_id").addEventListener (
            "click", Qurio_Solver, false
        );
    }

    function Qurio_Solver() {
        // Pobranie obecnego adresu URL strony
        var currentUrl = window.location.href;

        // Otwarcie nowego okienka z tym samym adresem URL i nadanie mu nazwy 'QurioWindow'
        var newWindow = window.open(currentUrl, 'QurioWindow');

        setTimeout(function() {
            // startujemy test w okienku
            newWindow.document.querySelector('.ntx-quiz-introduction-btn-content').click();

            // startujemy główny test
            document.querySelector('.ntx-quiz-introduction-btn-content').click();

            //
            // Przeklikać test w okienku byle jak
            //
            var pytania = newWindow.document.querySelectorAll('.ntx-activity');
            pytania.forEach(element => {

                // Jeżeli pytanie to tylko zaznaczenie odpowiedzi
                if(element.querySelector('input'))
                {
                    element.querySelector('input').click();
                }

                // Jeżeli pytanie wymaga przeciągania elementów
                if(element.querySelector('.ntx-drag-and-drop-target-origins-container'))
                {
                    var target = element.querySelector('.ntx-drag-and-drop-target-origins-container');
                    var origin = element.querySelector('.ntx-qDragAndDropOrigin-569-001-wrapper');

                    target.appendChild(origin);
                }

                //Jeżeli pytanie wymaga oznaczenia left <-> right
                if(element.querySelector('.ntx-qTapTapOrigin-569-001'))
                {
                    // element.click();
                    var ile = element.querySelectorAll('.ntx-qTapTapOrigin-569-001').length;

                    for(var j=0;j<ile;j++)
                    {
                        element.querySelectorAll('.ntx-qTapTapOrigin-569-001')[j].click();
                        element.querySelectorAll('.ntx-qTapTapTarget-569-001')[j].click();
                    }
                }

                // true / false
                // ale tylko jedno :/
                if(element.querySelector('.ntx-tf-option'))
                {
                    element.querySelector('.ntx-tf-option').click();
                }


                // Selectory? lol.
                if(element.querySelector('select'))
                {
                    element.querySelector('select').selectedIndex = 0;
                }





            });

            // wyślij i spisz uzupełnij odpowiedziami główne okno (jeżeli test wypełniony w całości)
            if(newWindow.document.getElementsByClassName('ntx-quiz-btn-content-last ntx-activity-btn-enabled')[0])
            {
                newWindow.document.getElementsByClassName('ntx-quiz-btn-content-last ntx-activity-btn-enabled')[0].click();
            }
            else
            {

            }

            // Zakończ test w okienku
            newWindow.document.getElementsByClassName('ntx-quiz-btn-end ntx-activity-btn-enabled')[0].click();
            // potwierdź
            newWindow.document.querySelector('.ntx-finishing-button').children[0].click();
            // Pokaż test
            newWindow.document.querySelector('.ntx-quiz-content').style.display = 'block';

            var odpowiedzi_test = newWindow.document.querySelectorAll('.ntx-activity');
            odpowiedzi_test.forEach(element => {
                element.style.display = 'block';
            });

            // "Pokaż prawidłowe odpowiedzi"
            newWindow.document.querySelector('.showSolutions').click();

            // wczytaj prawidłowe odpowiedzi
            // odpowiedzi to tablica elementow zawierajaca te prawidlowe
            // odpowiedzi[0].id = "input_5536706cdc74a4d2e85a756b2f2e9491"
            // wystarczy przeiterować wszystkie i klikać xD
            var odpowiedzi = newWindow.document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked, .ntx-tf-options, .ntx-qTapTapTarget');
            newWindow.close();

            //
            // Uzupełnianie głównego testu (a przynajmniej inputy checkboxy i radio)
            //
            odpowiedzi.forEach(element => {
                if(element.className.includes('TapTap'))
                {
                    // ile tapów
                    var taps = document.querySelectorAll('.ntx-qTapTapTarget');

                    for(var t=0;t<taps.length;t++)
                    {
                        var ile_class = taps[t].classList.length;
                        // który dobry dla pierwszej odpowiedzi?
                        var ktory = taps[t].classList[ile_class-1].substr(-1);
                        document.querySelector('.ntx-qTapTapOrigin-position-' + ktory).click();
                        taps[t].click();
                    }
                }
                else
                    if(element.id)
                    {
                        document.getElementById(element.id).click();
                    }
                // jeżeli nie ma ID, to pewnie true/false
                else
                {
                    var question = element.closest('.ntx-activity');
                    var odpowiedz = question.querySelector('.ntx-correct').innerText;

                    console.log(question);
                    console.log(odpowiedz);

                    if(document.getElementById(question.id).querySelectorAll('.ntx-tf-label')[0].innerText == odpowiedz)
                    {
                        document.getElementById(question.id).querySelectorAll('.ntx-tf-label')[0].click();
                    }
                    else
                    {
                        document.getElementById(question.id).querySelectorAll('.ntx-tf-label')[0].click();
                    }

                }
            });

            // document.getElementsByClassName('ntx-quiz-header-container-carousel')[0].lastElementChild.click();

        }, 4000);


    }


    // Ustawienie obserwera do monitorowania zmian w dokumencie
    const observer = new MutationObserver((mutations, obs) => {
        // Sprawdzenie, czy element o klasie .ntx-quiz-introduction-btn jest już dostępny
        const element = document.querySelector('.ntx-quiz-introduction-btn');
        const finished = document.querySelector('.ntx-quiz-attempts');

        if (element)
        {
            console.log("element");
            wykonajAkcje();
            // Opcjonalnie: odłącz obserwera po znalezieniu elementu, jeśli nie potrzebujesz dalszego monitorowania
            obs.disconnect();
        }

        //         if(finished)
        //         {
        //             console.log(isElementVisible(finished.children[0]));
        //             // jeżeli w trakcie testu samemu, lol, to i tak walnij guzik Solve i lecisz
        //             if(isElementVisible(finished.children[0]))
        //             {
        //                 console.log("finished");
        //                 wykonajAkcje();
        //                 obs.disconnect();

        //                 //             // dodaj jakieś info jak postępować (guzik do otwarcia nowego testu w karcie, przeklikanie jednego z nich, zakończenie i pokazanie prawidłowych odpowiedzi
        //                 //             if(!document.getElementById('solveManual_id'))
        //                 //             {
        //                 //                 const solveManual = document.createElement('div');
        //                 //                 // solveManual.classList.add('ntx-quiz-introduction-btn-content');
        //                 //                 solveManual.style = "float:left;margin:20px;padding:20px;background-color:white;";
        //                 //                 solveManual.id = 'solveManual_id'
        //                 //                 solveManual.innerHTML = '<span id="solveManualInfo">Jeżeli test został rozpoczęty, nic straconego.<br>1. Otwórz kolejny test w nowej karcie<br>' +
        //                 //                     '2. Któryś z nich przeklikaj byle jak<br>' +
        //                 //                     '3. Potwierdź zakończenie<br>' +
        //                 //                     '4. Powinien pokazać się uzupełniony test<br>5. Na jego podstawie uzupełnij test w karcie, która pozostała otwarta </span><br><br>' +
        //                 //                     '<input type="button" id="wykonajQurio" value="Przeklikaj ten test byle jak i uzyskaj prawidłowe odpowiedzi (;">';
        //                 //                 finished.appendChild(solveManual);

        //                 //                 document.getElementById ("wykonajQurio").addEventListener (
        //                 //                     "click", Qurio_Solver, false
        //                 //                 );

        //                 //                 document.getElementById ("solveBtn_id").addEventListener (
        //                 //                     "click", Qurio_Solver, false
        //                 //                 );
        //                 //                 obs.disconnect();
        //                 //             }
        //             }


        //             //         // Jeżeli koniec prób, to pokaż test
        //             //         if(isElementVisible(finished.children[1]))
        //             //         {
        //             //             // pokaż parenta
        //             //             document.querySelector('.ntx-quiz-content').style.display = 'block';

        //             //             setTimeout(function()
        //             //                        {
        //             //                 // pokaż wszystkie pytania
        //             //                 var odpowiedzi_test = document.querySelectorAll('.ntx-activity');
        //             //                 odpowiedzi_test.forEach(element => {
        //             //                     element.style.display = 'block';
        //             //                 });

        //             //                 setTimeout(function()
        //             //                            {
        //             //                     console.log("dupa");
        //             //                     // "Pokaż prawidłowe odpowiedzi"
        //             //                     document.querySelector('.showSolutions').click();
        //             //                 },1500);

        //             //                 obs.disconnect();
        //             //             },500);
        //             //         }
        //         }


    });


    // Konfiguracja obserwera do nasłuchiwania na dodanie elementów do DOM
    const config = {
        childList: true, // obserwuj bezpośrednio dodane lub usunięte dzieci
        subtree: true, // obserwuj wszystkie zmiany wewnątrz drzewa DOM, nie tylko w korzeniu
    };

    // Rozpoczęcie obserwacji całego dokumentu
    observer.observe(document.body, config);

    function isElementVisible(element) {
        // Sprawdzenie czy element jest zdefiniowany i czy nie jest to element <html>
        if (!element || element.tagName === 'HTML') {
            return true; // Zakładamy, że element <html> jest zawsze widoczny
        }

        const style = window.getComputedStyle(element);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0;

        // Rekurencyjne sprawdzenie dla rodzica, jeśli element sam jest widoczny
        return isVisible && isElementVisible(element.parentElement);
    }

})();
