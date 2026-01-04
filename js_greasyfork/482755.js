// ==UserScript==
// @name         Demotywatory - Ukryj elementy
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Dodaje ikonkę na stronie Demotywatory.pl
// @author       You
// @match        https://demotywatory.pl/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/482755/Demotywatory%20-%20Ukryj%20elementy.user.js
// @updateURL https://update.greasyfork.org/scripts/482755/Demotywatory%20-%20Ukryj%20elementy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Lista słów kluczowych
    let keywords = [];

    // Funkcja aktualizująca słowa kluczowe
    function updateKeywords(text) {
        // Podział tekstu na słowa przy użyciu przecinków i usuwanie białych znaków z każdego słowa
        keywords = text.split(',').map(word => word.trim()).filter(word => word !== '');
    }

    // Funkcja sprawdzająca, czy element zawiera słowa kluczowe
    function containsKeyword(element) {
        const text = element.textContent.toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
    }

    // Funkcja ukrywająca element 3 poziomy wyżej
    function hideParentElement(element, levels) {
        let parent = element;
        for (let i = 0; i < levels && parent.parentNode; i++) {
            parent = parent.parentNode;
        }
        if (parent && parent.style) {
            parent.style.display = 'none';
        }
    }

    // Utwórz element ikonki
    const icon = document.createElement('div');
    icon.id = 'filterIcon';
    icon.innerHTML = '<div style="position: fixed; right: 20px; top: 50%; transform: translate(0, -50%); cursor: pointer; z-index: 9999;">🔍</div>';

    // Dodaj ikonkę do ciała dokumentu
    document.body.appendChild(icon);

    // Utwórz element okna
    const windowDiv = document.createElement('div');
    windowDiv.style.position = 'fixed';
    windowDiv.style.left = '1200px'; // Zmiana ustawienia lewej krawędzi
    windowDiv.style.top = '50%';
    windowDiv.style.transform = 'translate(0, -50%)';
    windowDiv.style.padding = '30px'; // Zwiększenie wewnętrznego odstępu
    windowDiv.style.height = '700px'; // Zwiększenie wysokości okna
    windowDiv.style.backgroundColor = '#fff';
    windowDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    windowDiv.style.zIndex = '9998';
    windowDiv.style.display = 'none';

    // Utwórz opis "Blokowane tagi:"
    const description = document.createElement('div');
    description.textContent = 'Blokowane tagi:';
    description.style.marginBottom = '10px';

    // Utwórz pole formularza
    const inputField = document.createElement('textarea'); // Zmiana pola na textarea
    inputField.style.height = 'calc(100% - 40px)'; // Dostosowanie wysokości do wielkości okna
    inputField.style.width = '100%'; // Rozciągnij textarea na całą szerokość okna
    inputField.style.resize = 'none'; // Wyłącz możliwość zmiany rozmiaru textarea
    inputField.style.fontSize = '18px'; // Zwiększenie czcionki
    inputField.placeholder = 'Wprowadź tekst...';

    // Utwórz przycisk SAVE
    const saveButton = document.createElement('button');
    saveButton.textContent = 'SAVE';
    saveButton.style.cursor = 'pointer';

    // Dodaj opis, pole formularza i przycisk do okna
    windowDiv.appendChild(description);
    windowDiv.appendChild(inputField);
    windowDiv.appendChild(saveButton);

    // Dodaj okno do ciała dokumentu
    document.body.appendChild(windowDiv);

    // Obsługa kliknięcia na ikonkę
    icon.addEventListener('click', function () {
        // Pokaż lub ukryj okno po kliknięciu na ikonkę
        windowDiv.style.display = windowDiv.style.display === 'none' ? 'block' : 'none';
    });

    // Obsługa kliknięcia na przycisk SAVE
    saveButton.addEventListener('click', function () {
        // Pobierz wprowadzony tekst
        const enteredText = inputField.value;

        // Zapisz wprowadzony tekst w localStorage
        localStorage.setItem('savedText', enteredText);

        // Zamknij okno po naciśnięciu przycisku SAVE
        windowDiv.style.display = 'none';

        // Zaktualizuj słowa kluczowe
        updateKeywords(enteredText);

            // Odśwież stronę
    location.reload();

    });

    // Wczytaj zapisany tekst z localStorage i ustaw go w polu formularza
    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        inputField.value = savedText;
        updateKeywords(savedText);
    }




    // Zmienna do przechowywania liczby ukrytych elementów
    let hiddenElementsCount = 0;

    // Utwórz div z informacją o liczbie ukrytych elementów
    const infoDiv = document.createElement('div');
    infoDiv.style.position = 'fixed';
    infoDiv.style.top = '70px';
    infoDiv.style.left = '680px';
    infoDiv.style.backgroundColor = '#FFF'; // Dodaj kolor tła
    infoDiv.style.padding = '10px';
    infoDiv.style.zIndex = '9999'; // Ustaw najwyższy indeks z-index, aby było zawsze na wierzchu
    document.body.appendChild(infoDiv);

    // Sprawdź wszystkie elementy z klasą ".tags"
    const elements = document.querySelectorAll('.tags');
    elements.forEach(element => {
        if (containsKeyword(element)) {
            hideParentElement(element, 3);
            hiddenElementsCount++;
        }
    });

    // Wyświetl informację o liczbie ukrytych elementów
    infoDiv.textContent = `Ukryto ${hiddenElementsCount} elementów`;

    // Ukryj informację po 5 sekundach
    setTimeout(() => {
        infoDiv.style.display = 'none';
    }, 5000);

    // Dodaj obsługę kliknięcia, aby ukryć informację
    infoDiv.addEventListener('click', () => {
        infoDiv.style.display = 'none';
    });

})();
