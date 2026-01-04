// ==UserScript==
// @name         Lösung eintragen und prüfen
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt einen "Lösen"-Button hinzu, der die richtige Antwort findet, einträgt und prüft.
// @author       spezifischer
// @match        https://*.arbeitsheft.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531012/L%C3%B6sung%20eintragen%20und%20pr%C3%BCfen.user.js
// @updateURL https://update.greasyfork.org/scripts/531012/L%C3%B6sung%20eintragen%20und%20pr%C3%BCfen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Ermitteln der Lösung aus dem HTML-Quelltext
    function findSolution() {
        // Beispiel: Annahme, dass die Lösung in einem bestimmten Datensatz oder Attribut gespeichert ist
        const solutionElement = document.querySelector('[data-solution]');
        if (solutionElement) {
            return solutionElement.getAttribute('data-solution');
        }

        // Alternative Methode: Durchsuche den Quelltext nach Mustern
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            const match = script.textContent.match(/correctAnswer\s*=\s*['"](.*?)['"]/);
            if (match) {
                return match[1];
            }
        }

        // Wenn keine Lösung gefunden wurde
        return null;
    }

    // Funktion zum Eintragen der Lösung
    function enterSolution(solution) {
        const inputField = document.querySelector('input[type="text"]'); // Beispiel: Textfeld
        if (inputField && solution) {
            inputField.value = solution;
        }
    }

    // Funktion zum automatischen Prüfen
    function autoCheck() {
        const checkButton = document.querySelector('button:contains("Prüfen")');
        if (checkButton) {
            checkButton.click();
        }
    }

    // "Lösen"-Button erstellen
    function addSolveButton() {
        const checkButton = document.querySelector('button:contains("Prüfen")');
        if (checkButton) {
            const solveButton = document.createElement('button');
            solveButton.innerText = 'Lösen';
            solveButton.style.marginLeft = '10px';
            solveButton.addEventListener('click', () => {
                const solution = findSolution();
                if (solution) {
                    enterSolution(solution);
                    autoCheck();
                } else {
                    alert('Lösung konnte nicht gefunden werden!');
                }
            });
            checkButton.parentNode.insertBefore(solveButton, checkButton.nextSibling);
        }
    }

    // Button hinzufügen, wenn die Seite geladen ist
    window.addEventListener('load', addSolveButton);
})();