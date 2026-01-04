// ==UserScript==
// @name         Auto Click Zoom Button
// @namespace    https://www.facebook.com/messages/t/joachim97
// @version      0.0010
// @description  Automatyczne klikanie przycisku na stronie Zoom
// @author       Joachim Winkowski & ChatGPT
// @match        https://app.zoom.us/wc/8439802338/join?fromPWA=1&pwd=T1V4NjlnT3I2YVpRckNzMnlaLzFDQT09&_x_zm_rtaid=7ocIIi1oR5-NGFDpSGdGzA.1732207863953.45c01045fecbbc80a71c4314fd001a0e&_x_zm_rhtaid=431
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524163/Auto%20Click%20Zoom%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/524163/Auto%20Click%20Zoom%20Button.meta.js
// ==/UserScript==
console.log("Zaczynam działanie skryptu Tampermonkey");

// Jeśli się zostastawi stronę to po 30 minutach wyrzuca z zooma. 
// Skrypt sam klika w momencie oczekiwania. 
(function() {
    'use strict';

    // Czas pierwszego kliknięcia w formacie godzina:minuta (24-godzinny format)
    var firstClickTime = "20:29";
    // var firstClickTime = "19:05";
    var firstClickExecuted = false;
    var elementFound = false;

    // Funkcja oczekiwania na element w iframe
    function waitForElementInIframe(iframeSelector, elementSelector, callback, retryInterval = 5000) {
        var intervalId = setInterval(function() {
            var iframe = document.querySelector(iframeSelector);
            if (iframe) {
                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                var element = iframeDocument.querySelector(elementSelector);
                if (element) {
                    console.log("Element w iframe znaleziony: ", element);
                    clearInterval(intervalId); // Zatrzymaj sprawdzanie po znalezieniu elementu
                    callback(element);
                } else {
                    console.log("Element w iframe nie znaleziony, ponowne sprawdzenie za " + retryInterval/1000 + " sekund");
                }
            } else {
                console.log("Iframe nie znaleziony, ponowne sprawdzenie za " + retryInterval/1000 + " sekund");
            }
        }, retryInterval); // Sprawdza co określony interwał
    }

    // Funkcja kliknięcia przycisku
    function clickButton(button) {
        button.click();
        console.log("Przycisk w iframe kliknięty");
    }

    // Funkcja sprawdzająca czas i klikająca przycisk
    function checkTimeAndClick() {
        console.log("Rozpoczęto funkcję checkTimeAndClick");
        var now = new Date();
        var currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
        console.log("Aktualny czas: " + currentTime);

        // Sprawdzanie, czy jest już po czasie pierwszego kliknięcia
        if (currentTime >= firstClickTime && !firstClickExecuted) {
            console.log("Jest po czasie pierwszego kliknięcia, sprawdzanie elementu");
            firstClickExecuted = true;
            waitForElementInIframe("iframe", "#root > div > div.preview-new-flow > div > div.preview-meeting-info > button", clickButton);

            // Powtarzaj kliknięcie co 2 minuty po pierwszym kliknięciu
            setInterval(function() {
                waitForElementInIframe("iframe", "#root > div > div.preview-new-flow > div > div.preview-meeting-info > button", clickButton);
            }, 12000);
        }
    }

    // Uruchomienie funkcji po załadowaniu strony
    window.onload = function() {
        console.log("Strona w pełni załadowana");

        // Sprawdzaj co 10 sekund, czy nadszedł czas pierwszego kliknięcia
        var checkInterval = setInterval(function() {
            checkTimeAndClick();

            if (firstClickExecuted) {
                clearInterval(checkInterval);
            }
        }, 10000);
    };
})();

console.log("Koniec działania skryptu Tampermonkey");
