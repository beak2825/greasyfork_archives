// ==UserScript==
// @name         Typescript helpers
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Special click, import and execute tesseract and opencv, alert blocking
// @author       Andrewblood
// @match        *://*/*
// @icon         https://coinfinity.top/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508010/Typescript%20helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/508010/Typescript%20helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.alert = function() {
        // Nichts tun, um den Alert zu blockieren
    };

    window.confirm = function() {
        // Nichts tun, um den Alert zu blockieren
    };

    window.anonymous = function() {
        // Nichts tun, um den Alert zu blockieren
    };



// @grant        window.focus
// @grant        window.close
// @grant        unsafeWindow

    // Funktion für das Schließen der Tabs
    var oldFunction = unsafeWindow.open;
    var lastOpenedWindow = null; // Variable zur Speicherung des zuletzt geöffneten Fensters

    function closeAdFunction(url, target) {
        // Setze den Namen des Fensters
        var windowName = (target && target !== "_blank") ? target : "popUpWindow";

        // Öffne das Fenster und speichere die Referenz
        lastOpenedWindow = oldFunction(url, windowName);
        return lastOpenedWindow;
    }

    unsafeWindow.open = closeAdFunction;

    // Schließe das letzte geöffnete Fenster, wenn die Seite verlassen wird
    unsafeWindow.onbeforeunload = function() {
        if (lastOpenedWindow) {
            lastOpenedWindow.close(); // Schließe das Fenster
            lastOpenedWindow = null; // Setze die Referenz zurück
        }
    };



    // Functions for REAL Click
    function triggerMouseEvent(elm, eventType) {
        let clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        elm.dispatchEvent(clickEvent);
    }

    function alternativeClick(elm) {
        triggerMouseEvent(elm, "mouseover");
        triggerMouseEvent(elm, "mousedown");
        triggerMouseEvent(elm, "mouseup");
        triggerMouseEvent(elm, "click");
    }

    function specialClick(selector) {
        var interval001 = setInterval(function() {
            // Wähle den Button anhand des Selektors
            var button = document.querySelector(selector);
            // Wähle das CAPTCHA-Element und das Response-Element
            var captchaElement = document.querySelector(".captcha-modal, .g-recaptcha, .h-captcha");
            var captchaResponse = document.querySelector("#g-recaptcha-response, #g-recaptcha-response, #fform > center > div > div > input[type=hidden]");

            // Überprüfe, ob das CAPTCHA-Element vorhanden ist
            if (captchaElement) {
                // Falls das CAPTCHA ausgefüllt ist und der Button sichtbar und aktiv ist, klicke den Button
                if (captchaResponse && captchaResponse.value.length > 0 && button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                    alternativeClick(button);
                    console.log("Element is clicked.");
                    clearInterval(interval001);
                }
            } else {
                // Falls kein CAPTCHA vorhanden ist, überprüfe nur die Sichtbarkeit des Buttons
                if (button && button.offsetHeight > 0 && !button.hasAttribute('disabled')) {
                    alternativeClick(button);
                    console.log("Element is clicked.");
                    clearInterval(interval001);
                }
            }
        }, 500);
    }

    function searchFirstButtonWithInnerText(text) {
        let interval = setInterval(function() {
            let buttons = document.querySelectorAll('button');

            for (let button of buttons) {
                if (button.innerText.includes(text) && !button.hasAttribute('disabled') && button.offsetHeight > 0) {
                    setTimeout(function () {
                        alternativeClick(button);
                        console.log("Element is clicked.");
                        clearInterval(interval);
                    }, 1000);
                    break;
                }
            }
        }, 500);
    }



    // Mouse move on random position
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function randomDisplayNumber() {
        var screenWidth = window.innerWidth;
        var screenHeight = window.innerHeight;

        var randomX = getRandomNumber(0, screenWidth);
        var randomY = getRandomNumber(0, screenHeight);

        return { x: randomX, y: randomY };
    }

    function moveMouseTo(x, y) {
        var event = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: document.defaultView,
            clientX: x,
            clientY: y
        });
        document.dispatchEvent(event);
    }

    // Codde for Mouse move function
    var randomPosition = randomDisplayNumber();
    moveMouseTo(randomPosition.x, randomPosition.y);



    // @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.5/tesseract.min.js
    // @require      https://cdnjs.cloudflare.com/ajax/libs/tesseract.js/5.0.5/worker.min.js

    // OpenCV script
    var opencvScript = document.createElement('script');
    opencvScript.src = 'https://docs.opencv.org/4.5.5/opencv.js';
    opencvScript.onload = function() {
        console.log("OpenCV.js loaded");

        // Funktion zum Polling bis das Element sichtbar ist
        function waitForElement(selector, callback) {
            const element = document.querySelector(selector);
            if (element && element.offsetHeight > 1) {
                callback(element);
            } else {
                setTimeout(() => waitForElement(selector, callback), 1000);
            }
        }

        // Funktion zum Laden und Bearbeiten des Bildes
        function loadAndProcessImage() {

            // Überwachungsfunktion, die in bestimmten Intervallen prüft, ob das Bild vorhanden ist
            let interval = setInterval(function() {
                let imgElement = document.querySelector("#description > img");
                if (imgElement) {
                    clearInterval(interval); // Stoppe das Intervall, wenn das Bild vorhanden ist
                    originalImgElement.src = imgElement.src; // Zeige das Originalbild an
                    processImage(imgElement); // Lade und bearbeite das Bild
                } else {
                }
            }, 1000); // Überprüfe alle 1 Sekunde, ob das Bild vorhanden ist
        }

        // Funktion zum Laden und Bearbeiten des Bildes
        function processImage(imgElement) {
            let src = cv.imread(imgElement);

            // Schritt 0: Vergrößere das Bild
            let resized = new cv.Mat();
            let dsize = new cv.Size(src.cols * 4, src.rows * 4); // Verdreifache die Größe des Bildes
            cv.resize(src, resized, dsize, 0, 0, cv.INTER_LINEAR);

            let dst = new cv.Mat();
            let M = cv.Mat.ones(5, 5, cv.CV_8U);
            let anchor = new cv.Point(-1, -1);

            // Schritt 1: Ändere die Schriftfarbe auf Weiß und den Hintergrund auf Schwarz
            cv.cvtColor(resized, dst, cv.COLOR_RGB2GRAY);
            cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);

            // Schritt 2: Verwende Morphologie-Operationen, um das Bild zu bearbeiten
            cv.dilate(dst, dst, M, anchor, 2, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
            //        cv.erode(dst, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

            // Schritt 3: Konvertiere das bearbeitete Bild zurück in ein DOM-Element
            let canvas = document.createElement('canvas');
            cv.imshow(canvas, dst);
            let manipulatedImageSrc = canvas.toDataURL();

            // Füge das bearbeitete Bild dem Overlay-DIV hinzu
            processedImgElement.src = manipulatedImageSrc;

            // Texterkennung mit Tesseract.js
            Tesseract.recognize(
                manipulatedImageSrc,
                'eng', // Sprache einstellen, hier: Englisch
                {
                    logger: m => console.log("Tesseract Log:", m),
                    psm: 7,
                    oem: 3,
                    tessedit_char_whitelist: "0123456789",
                    tessedit_traineddata: 'eng', // Ändere den Pfad zu deiner trainierten Datenbank, z.B. 'C:/Users/User/Desktop/Projekte/Luckybird Chat Bot/output_model/tec'
                }
            ).then(({ data: { text } }) => {
                console.log("Text from teseract:", text);

                // Filtere nur Zahlen von 0 bis 9 aus dem erkannten Text
                const filteredText = text.replace(/[^0-9]/g, '');

                console.log('Regonized Numbers:' + filteredText)

                var textField = document.querySelector("#description > input.captcha-input");

                // Überprüfe, ob die Länge des Textes korrekt ist
                if (filteredText.length === 4) {
                    textField.value = filteredText;

                } else {
                    location.reload();
                }
            });

            // Bereinige Ressourcen
            src.delete();
            dst.delete();
            M.delete();
            resized.delete();
        }

        // Starte das Laden und Bearbeiten des Bildes
        loadAndProcessImage();
    };
    document.head.appendChild(opencvScript);

})();