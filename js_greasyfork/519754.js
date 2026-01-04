// ==UserScript==
// @name         MathType pomocnik
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  Skrypt do Tampermonkey wpomagajacy pracę ze wzorami LateX w Edifaju. Skrypt uzyteczny tylko dla pracownikow WSiP.
// @author       Ernest
// @match        https://playereditorplayground.z6.web.core.windows.net/*
// @match        https://cms.production.infinicloud.app/editor/*
// @icon         https://wsip.pl/wp-content/uploads/2024/10/cropped-favicon-32x32.png
// @grant        none
// @copyright    MIT
// @downloadURL https://update.greasyfork.org/scripts/519754/MathType%20pomocnik.user.js
// @updateURL https://update.greasyfork.org/scripts/519754/MathType%20pomocnik.meta.js
// ==/UserScript==

(function() {
    /* ###########################################################
    Skrypt wpomaga pracę ze wzorami LateX w Edifaju.
    
    *** SPOSÓB DZIAŁANIA ***
    
    Zaznaczanie manualne:
    Zaznacz myszką liczbę lub bardziej złożony wzór (najlepiej razem z $). Włącz edytor MathType. 
    - liczba automatycznie przeniesie się do edytora – wystarczy kliknąć: save
    - bardziej złożony wzór sam się nie przeniesie, ale zostanie on automatycznie skopiowany do schowka. Wystarczy wkleić go do edytora i też nacisnąć: save
    
    Zaznaczanie automatyczne:
    Klawisz F2 automatycznie zaznacza pierwszy napotkany fragment tekstu otoczony znakami $. Nad zaznaczeniem pojawi się panel z włącznikiem edytora MathType. Dalsze działania są analogiczne jak w przypadku zaznaczania manualnego.
    
    UWAGA!
    Jeśli liczbę lub wzór wprowadzamy manualnie nie ma potrzeby otaczania ich $. Skrypt w trybie zaznaczania manualnego ich nie wymaga.
    ########################################################### */

    'use strict';

    // Zmienna przechowująca aktualny stan wzorów
    let currentLatexIndex = 0;

    // Funkcja wyszukująca wzory LaTeX
    function findAndHighlightLatex() {
        // Pobierz wszystkie widoczne węzły tekstowe w dokumencie
        function getVisibleTextNodes(element) {
            const textNodes = [];
            const walker = document.createTreeWalker(
                element,
                NodeFilter.SHOW_TEXT, {
                    acceptNode: function(node) {
                        // Filtrujemy tylko widoczne teksty
                        if (node.parentElement && window.getComputedStyle(node.parentElement).display !== "none") {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                        return NodeFilter.FILTER_REJECT;
                    },
                },
                false
            );
            let node;
            while ((node = walker.nextNode())) {
                textNodes.push(node);
            }
            return textNodes;
        }

        // Wyrażenie regularne do wyszukiwania wzorów LaTeX
        const latexRegex = /\$(.*?)\$/g;

        // Pobierz wszystkie widoczne teksty z dokumentu
        const textNodes = getVisibleTextNodes(document.body);

        // Znajdź wszystkie wzory LaTeX
        const formulas = [];
        textNodes.forEach((node) => {
            const matches = [...node.textContent.matchAll(latexRegex)];
            matches.forEach((match) => {
                formulas.push({
                    formula: match[1], // Sam wzór (bez $)
                    node: node, // Węzeł, w którym znaleziono wzór
                    start: match.index, // Indeks startu wzoru
                    end: match.index + match[0].length, // Indeks końca wzoru
                });
            });
        });

        // Jeśli nie znaleziono żadnych wzorów, wyjdź
        if (formulas.length === 0) {
            console.log("Brak wzorów LaTeX na stronie.");
            return;
        }

        // Jeśli indeks przekracza liczbę znalezionych wzorów, zaczynamy od początku
        if (currentLatexIndex >= formulas.length) {
            currentLatexIndex = 0;
        }

        // Pobierz aktualny wzór
        const currentFormula = formulas[currentLatexIndex];
        currentLatexIndex++; // Przesuwamy indeks do przodu

        // Podświetlenie wzoru
        const range = document.createRange();
        const selection = window.getSelection();
        range.setStart(currentFormula.node, currentFormula.start);
        range.setEnd(currentFormula.node, currentFormula.end);
        selection.removeAllRanges();
        selection.addRange(range);

        console.log("Znaleziono wzór LaTeX:", currentFormula.formula);
    }

    // Nasłuchiwanie na naciśnięcie klawisza (F2)
    document.addEventListener("keydown", (event) => {
        if (event.key === "F2") {
            findAndHighlightLatex();

            const selection = window.getSelection();
            const selectedText = selection.toString();

            if (selectedText && !czyLiczba(selectedText)) {
                // Kopiujemy zaznaczony tekst do schowka
                copyToClipboard(selectedText);

                // Przechowujemy tekst w zmiennej globalnej, aby później go użyć
                window.latestSelectedText = selectedText;
            }
        }
    });







    ///////////////////////

    // Tablica przechowująca zaznaczane teksty
    let selectedText = [];






    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Tekst został skopiowany do schowka:', text);
        }).catch(err => {
            console.error('Błąd podczas kopiowania do schowka:', err);
        });
    }

    // Funkcja, która będzie wstawiać wyrażenie LaTeX do odpowiedniego inputa
    function insertLatex(inputElement, latexExpression) {
        // Usuwamy dolary na początku i na końcu (jeśli są)
        latexExpression = latexExpression.replace(/^\$(.*?)\$$/, '$1');

        // Ustawiamy wartość inputa
        inputElement.value = latexExpression;

        // Wysyłamy zdarzenie zmiany, żeby MathType przetworzył LaTeX
        const event = new Event('input', {
            'bubbles': true,
            'cancelable': true
        });
        inputElement.dispatchEvent(event);
    }


    // Funkcja do pobrania zaznaczonego tekstu lub domyślnego wyrażenia
    function getSelectedText() {
        return selectedText[selectedText.length - 2];
    }

    // Nasłuchujemy na zakończenie zaznaczania tekstu
    document.addEventListener('selectionchange', function() {
        const selection = window.getSelection();
        selectedText.push(selection.toString()); // Przechowujemy zaznaczony tekst
    });

    function czyLiczba(tekst) {
        let wyrReg = /^\$*[0-9,]+?\$*$/;

        if (wyrReg.test(tekst)) {
            return true;
        } else {
            return false;
        }
    }


    document.addEventListener('mouseup', function() {
        const selection = window.getSelection();
        const selectedText = selection.toString();

        if (selectedText && !czyLiczba(selectedText)) {
            // Kopiujemy zaznaczony tekst do schowka
            copyToClipboard(selectedText);

            // Przechowujemy tekst w zmiennej globalnej, aby później go użyć
            window.latestSelectedText = selectedText;
        }
    });


    // Tworzymy MutationObserver do monitorowania zmian w DOM
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            // Jeśli dodany element jest inputem o odpowiednich cechach
            if (mutation.type === 'childList') {
                let newNode = mutation.addedNodes[0];

                // Sprawdzamy, czy nowy element zawiera edytor MathType (np. <div class="wrs_editor">)
                if (newNode && newNode.classList.contains('wrs_editor')) {

                    // Szukamy inputa z klasą .wrs_focusElement wśród potomków (wnuków, prawnuków) newNode
                    let input = newNode.querySelector('input.wrs_focusElement');
                    if (input) {

                        // Pobieramy zaznaczony tekst lub używamy domyślnego wyrażenia
                        const latexExpression = getSelectedText();



                        // Wstawiamy wyrażenie LaTeX do edytora - ale jak jest tylo liczbą
                        // Jak wzór jest bardziej złożony - nic nie wstawiaj, ale wzór zostanie skopiowany do chowka
                        if (czyLiczba(latexExpression)) {
                            insertLatex(input, latexExpression);
                        }
                    }
                }
            }
        }
    });

    // Rozpoczynamy obserwację całego dokumentu
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();