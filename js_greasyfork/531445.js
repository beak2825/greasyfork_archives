// ==UserScript==
// @name         Arbeitsheft.online Aufgabenlöser
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fügt einen "Aufgabe lösen" Button hinzu, der die Lösung aus dem Quelltext extrahiert
// @author       spezifischer
// @match        https://arbeitsheft.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531445/Arbeitsheftonline%20Aufgabenl%C3%B6ser.user.js
// @updateURL https://update.greasyfork.org/scripts/531445/Arbeitsheftonline%20Aufgabenl%C3%B6ser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Hinzufügen des Lösungs-Buttons
    function addSolveButton() {
        // Suche nach dem "Prüfen" Button
        const checkButton = document.querySelector('button[type="submit"]');
        
        if (checkButton) {
            // Erstelle neuen "Aufgabe lösen" Button
            const solveButton = document.createElement('button');
            solveButton.type = 'button';
            solveButton.className = checkButton.className; // Gleiche Klassen wie der Prüfen-Button
            solveButton.innerText = 'Aufgabe lösen';
            solveButton.style.marginLeft = '10px';
            
            // Event-Listener für den Klick auf den Button
            solveButton.addEventListener('click', findSolution);
            
            // Füge den Button neben dem Prüfen-Button ein
            checkButton.parentNode.insertBefore(solveButton, checkButton.nextSibling);
        }
    }
    
    // Funktion zum Finden der Lösung im Quelltext
    function findSolution() {
        // Versuche, verschiedene mögliche Lösungselemente im Quelltext zu finden
        let solution = null;
        
        // Methode 1: Suche nach data-solution Attribut
        const elementsWithSolution = document.querySelectorAll('[data-solution]');
        if (elementsWithSolution.length > 0) {
            solution = Array.from(elementsWithSolution).map(el => el.getAttribute('data-solution')).join(', ');
        }
        
        // Methode 2: Suche nach versteckten Input-Feldern mit Lösungen
        if (!solution) {
            const hiddenSolutions = document.querySelectorAll('input[type="hidden"][name*="solution"], input[type="hidden"][name*="answer"]');
            if (hiddenSolutions.length > 0) {
                solution = Array.from(hiddenSolutions).map(el => el.value).join(', ');
            }
        }
        
        // Methode 3: Suche nach JavaScript-Variablen im Seitenquelltext
        if (!solution) {
            const scriptTags = document.querySelectorAll('script');
            const solutionRegex = /(?:solution|answer|ergebnis|lösung)\s*[=:]\s*['"]?([^'";\s]+)['"]?/i;
            
            for (const script of scriptTags) {
                const match = script.textContent.match(solutionRegex);
                if (match && match[1]) {
                    solution = match[1];
                    break;
                }
            }
        }
        
        // Wenn eine Lösung gefunden wurde, fülle die Antwortfelder aus
        if (solution) {
            fillAnswers(solution);
            alert('Lösung gefunden: ' + solution);
        } else {
            alert('Keine Lösung im Quelltext gefunden. Versuchen Sie, die Aufgabe manuell zu lösen.');
        }
    }
    
    // Funktion zum Ausfüllen der Antwortfelder
    function fillAnswers(solution) {
        // Suche nach Eingabefeldern
        const inputFields = document.querySelectorAll('input[type="text"], input[type="number"]');
        
        // Wenn es nur ein Eingabefeld gibt, fülle die Lösung dort ein
        if (inputFields.length === 1) {
            inputFields[0].value = solution;
            return;
        }
        
        // Bei mehreren Feldern: Versuche, die Lösung aufzuteilen (falls es mehrere Werte gibt)
        const solutionParts = solution.split(/[,;]/);
        
        // Fülle so viele Felder wie möglich aus
        for (let i = 0; i < Math.min(inputFields.length, solutionParts.length); i++) {
            inputFields[i].value = solutionParts[i].trim();
        }
    }
    
    // Führe die Hauptfunktion aus, nachdem die Seite geladen ist
    window.addEventListener('load', function() {
        setTimeout(addSolveButton, 1000); // Warte 1 Sekunde, um sicherzustellen, dass alle Elemente geladen sind
    });
    
    // Beobachte DOM-Änderungen für dynamisch geladene Inhalte
    const observer = new MutationObserver(function(mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // Wenn neue Elemente hinzugefügt wurden, prüfe ob der Button hinzugefügt werden muss
                setTimeout(addSolveButton, 500);
            }
        }
    });
    
    // Starte die Beobachtung des Dokuments
    observer.observe(document.body, { childList: true, subtree: true });
})();