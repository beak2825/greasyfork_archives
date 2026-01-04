// ==UserScript==
// @name         LSS Easter Egg Checker
// @namespace    www.leitstellenspiel.de
// @version      1.0
// @license      MIT
// @description  OSTERHASEEEEEEEEE
// @author       blckcld
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532296/LSS%20Easter%20Egg%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/532296/LSS%20Easter%20Egg%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Setze diese Variable auf true, um das Remove-Script zu aktivieren, oder auf false, um es zu deaktivieren
    var removeScriptEnabled = true;

    // Prüfe, ob das Element mit der ID "easter-egg-link" vorhanden ist
    var easterEggLink = document.getElementById('easter-egg-link');

    if (easterEggLink) {
        var imageSrc = easterEggLink.querySelector('img').getAttribute('src');
        var symbol = '';

        // Prüfe, ob der Bild-Quelltext das Wort "Pumpkin" enthält
        if (imageSrc.includes('pumpkin')) {
            symbol = '🎃';
        } else if (imageSrc.includes('oster')) {
            symbol = '🐰';
        } else if (imageSrc.includes('heart')) {
            symbol = '❤️';
        } else if (imageSrc.includes('football')) {
            symbol = '⚽';
        } else if (imageSrc.includes('santa')) {
            symbol = '🎅';
        } else if (imageSrc.includes('summer')) {
            symbol = '🌻';
        }

        // Klicke automatisch auf das Easter Egg
        easterEggLink.click();

        // Zeige das Symbol für 2 Sekunden an
        var symbolElement = document.createElement('div');
        symbolElement.innerHTML = '<span style="font-size: 600px;">' + symbol + '</span>';
        symbolElement.style.position = 'fixed';
        symbolElement.style.top = '0';
        symbolElement.style.left = '0';
        symbolElement.style.width = '100%';
        symbolElement.style.height = '100%';
        symbolElement.style.display = 'flex';
        symbolElement.style.justifyContent = 'center';
        symbolElement.style.alignItems = 'center';
        symbolElement.style.zIndex = '999999';
        document.body.appendChild(symbolElement);

        // Schließe das Symbol nach 2 Sekunden
        setTimeout(function() {
            symbolElement.remove();
        }, 2000);
    }

    if (removeScriptEnabled) {
        // Funktion zum Entfernen des Alert-Elements mit dem spezifischen Text
        function removeSpecificAlertElement() {
            var alertElements = document.querySelectorAll('.alert.fade.in.alert-success');
            alertElements.forEach(function(alertElement) {
                // Überprüfe den Text des Alert-Elements
                if (alertElement.textContent.includes(' gefunden!')) {
                    // Wenn der spezifische Text gefunden wurde, entferne das Alert-Element
                    alertElement.remove();
                }
            });
        }

        // Funktion zum Überwachen von DOM-Änderungen
        function observeDOM() {
            var targetNode = document.body;

            // Konfiguration des Observers mit einer Callback-Funktion
            var config = { childList: true, subtree: true };

            // Callback-Funktion wird ausgeführt, wenn Änderungen im DOM festgestellt werden
            var callback = function(mutationsList, observer) {
                for (var mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // Überprüfe, ob das Alert-Element mit dem spezifischen Text hinzugefügt wurde
                        removeSpecificAlertElement();
                    }
                }
            };

            // Erstelle einen Observer mit der angegebenen Konfiguration und Callback-Funktion
            var observer = new MutationObserver(callback);

            // Starte die Überwachung des Zielknotens für Änderungen
            observer.observe(targetNode, config);
        }

        // Führe das Skript direkt nach dem Laden der Seite aus
        observeDOM();
    }
})();