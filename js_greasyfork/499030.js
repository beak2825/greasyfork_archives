// ==UserScript==
// @name        Notenspalten Import xschool.de
// @namespace   Violentmonkey Scripts
// @match       https://oszimt.xschool.de/Marks/InputMark*
// @grant       none
// @license     GNU GPLv3
// @version     250710
// @author      Steffen Trutz
// @description Fügt ein Textfeld für eine Importfunktion für Noten hinzu.
// @downloadURL https://update.greasyfork.org/scripts/499030/Notenspalten%20Import%20xschoolde.user.js
// @updateURL https://update.greasyfork.org/scripts/499030/Notenspalten%20Import%20xschoolde.meta.js
// ==/UserScript==
(function () {
    'use strict';

// Funktion, die ausgeführt wird, wenn das DOM vollständig geladen ist
    function notenspaltenImportOnDOMContentLoaded() {
        // Finde das erste Element mit der Klasse "oszKlausurContainer"
        var container = document.querySelector('body');

        // Erstelle ein neues Textfeld
        var textField = document.createElement('div');
        textField.type = 'text';
        textField.innerHTML = "<div style='padding: 15px; border: gray 1px solid; width: 100%; background: white; color: black;'>" +
            "<h4>Notenspalten Import | <label for='notenspaltenModus'>Eintragemodus: </label><select name='notenspaltenModus' id='notenspaltenModus'>" +
            "    <option value='noteNote'>Noten als Noten</option>" +
            "    <option value='noteEndNote'>Noten als ganze Noten</option>" +
            "    <option value='prozentNote'>Prozente als Noten</option>" +
            "    <option value='prozentEndNote'>Prozente als ganze Noten</option>" +
            "    <option value='endNote'>Eingetragene Note als Endnote runden</option>" +
            "  </select> <button onclick='notenspaltenInfo()'>Erklärung</button></h4>" +
            "Geben Sie pro Zeile eine Note ein. Diese wird ab dem markierten Schüler eingetragen. Nach dem Import speichern nicht vergessen. Leerzeilen werden übersprungen." +
            "<textarea id='notenspaltenImportNoten' style='width: 100%'></textarea><br>" +
            "<button id='notenspaltenImportButton'>Noten eintragen</button> " +
            "<input type='checkbox' id='notenspaltenFinish' name='notenspaltenFinish' value='true' checked='checked'><label for='notenspaltenFinish'> Danach speichern und schließen</label><br>" +
            "<div id='notenspaltenImportError'></div>" +
            "</div>";


        // Füge das Textfeld dem Container hinzu
        container.appendChild(textField);

        // Füge einen EventListener zum Button hinzu
        var button = document.getElementById('notenspaltenImportButton');
        button.addEventListener('click', notenspaltenImportButtonClicked);
    }

    function notenspaltenImportShowMessage(message, typ = 'red') {
        console.error(message);
        var errorDiv = document.getElementById('notenspaltenImportError');
        errorDiv.innerHTML = message;
        errorDiv.style.color = typ;
    }

    function notenspaltenSetGrade(id) {
        const notenButton = document.getElementsByClassName('mark-selector');
        // Suche nächsten Button mit der spezifischen Klasse und dem data-bind-Attribut
        const buttonNextStudent = document.querySelector('button.xschool-btn.col-xs-6.primary[data-bind="click: NextStudent"]');

        if (!notenButton) throw "Notenbutton nicht gefunden";
        if (!buttonNextStudent) throw "buttonNextStudent nicht gefunden";

        notenButton[id].click();
        buttonNextStudent.click();
    }

// Buttonclick Funktion
    async function notenspaltenImportButtonClicked() {
        try {
            notenspaltenImportShowMessage(`Parse und sende Anfrage. Bitte warten...`, 'orange');

            // Finde Noten
            let noten = document.getElementById('notenspaltenImportNoten').value.split('\n')
            if (!noten) throw "Notenfeld nicht gefunden";
            // remove empty
            noten = noten.reduce((acc, i) => i ? [...acc, i] : acc, []);

            // set modus
            const modus = document.getElementById('notenspaltenModus').value;
            let notenspalten = {};

            if (modus === 'noteNote') {
                notenspalten = {
                    "0,7": 4, "1,0": 5, "1": 5, "1,3": 6,
                    "1,7": 7, "2,0": 8, "2": 8, "2,3": 9,
                    "2,7": 10, "3,0": 11, "3": 11, "3,3": 12,
                    "3,7": 13, "4,0": 14, "4": 14,
                    "4,7": 15, "5,0": 16, "5": 16, "5,3": 17,
                    "6,0": 18, "6": 18
                };
            } else if (modus === 'noteEndNote' || modus === 'endNote') {
                notenspalten = {
                    "0,7": 5, "1,0": 5, "1": 5, "1,3": 5,
                    "1,7": 8, "2,0": 8, "2": 8, "2,3": 8,
                    "2,7": 11, "3,0": 11, "3": 11, "3,3": 11,
                    "3,7": 14, "4,0": 14, "4": 14,
                    "4,7": 16, "5,0": 16, "5": 16, "5,3": 16,
                    "6,0": 18, "6": 18
                };
            } else if (modus === 'prozentNote') {
                notenspalten = {
                    95: 4, 90: 5, 85: 6,
                    80: 7, 75: 8, 70: 9,
                    65: 10, 60: 11, 55: 12,
                    50: 13, 45: 14,
                    27: 15, 18: 16, 9: 17,
                    0: 18
                };
            } else if (modus === 'prozentEndNote') {
                notenspalten = {
                    84: 5, 69: 8, 54: 11, 44: 14, 8: 16,
                    0: 18
                };
            }
            notenspalten = Object.assign({}, notenspalten, {
              "": 0, " ": 0, "bf.": 1, "o.B.": 2, "n.e": 3,
              "-": 0, "bf": 1, "oB": 2, "ne": 3
            });

            // laufe alle noten durch
            if (modus === 'endNote') {
                const studentCount = document.getElementsByClassName('select-item').length;
                for(let i = 0; i < studentCount; i++) {
                    let note = document.querySelector('.mark-value').value;
                    if (!(note in notenspalten)) throw "Note " + note + " ist ungültige Auswahl";
                    notenspaltenSetGrade(notenspalten[note]);
                }
            } else if (modus === 'noteNote' || modus === 'noteEndNote') {
                for (const note of noten) {
                    if (!(note in notenspalten)) throw "Note " + note + " ist ungültige Auswahl";

                    notenspaltenSetGrade(notenspalten[note]);
                }
            } else if (modus === 'prozentNote' || modus === 'prozentEndNote') {
                for (let note of noten) {
                    const noteN = parseInt(note);
                    //is number?
                    if (isNaN(noteN)) {
                        //special cases
                        if (!(note in notenspalten)) throw "Note " + note + " ist ungültige Auswahl";
                        notenspaltenSetGrade(notenspalten[note]);
                        continue;
                    }
                    note = noteN;

                    // Extrahiere die Schlüssel des Dictionaries und konvertiere sie zu Zahlen
                    const keys = Object.keys(notenspalten).map(key => Number(key)).filter(key => !isNaN(key));

                    // Filtere die Schlüssel, um nur die zu behalten, die kleiner oder gleich der übergebenen Zahl sind
                    const filteredKeys = keys.filter(key => key <= note);

                    // Falls keine passenden Schlüssel gefunden wurden, gib null zurück
                    if (filteredKeys.length === 0) {
                        throw "Prozent " + note + " ist ungültige Auswahl";
                    }

                    // Finde den höchsten Schlüssel im gefilterten Array
                    const highestKey = Math.max(...filteredKeys);

                    notenspaltenSetGrade(notenspalten[highestKey]);
                }
            }

            //check length
            const studentList = document.getElementsByClassName('select-item');
            const txt = noten.length + ' Noten für ' + studentList.length + ' Schüler eingetragen. Wenn alle Noten stimmen, speichern nicht vergessen.';

            if (noten.length === studentList.length) {
                notenspaltenImportShowMessage(txt, 'green');
                //finish?
                if (document.getElementById('notenspaltenFinish').checked) {
                    document.querySelector('button.xschool-btn.finish.primary[data-bind="enable: CanFinish, click: Finish, showMissing: true"]').click();
                }
            } else {
                notenspaltenImportShowMessage(txt, 'orange');
            }

        } catch (error) {
            notenspaltenImportShowMessage('Es gab ein Problem beim Eintragen: ' + error);
            throw error;
        }

    }

// Event-Listener für DOMContentLoaded hinzufügen
    document.addEventListener('DOMContentLoaded', notenspaltenImportOnDOMContentLoaded);

// Fallback, falls das DOM bereits geladen ist
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        notenspaltenImportOnDOMContentLoaded();
    }
})();

window.notenspaltenInfo = function() {
    alert('Die Umrechnung erfolgt nach dem OSZ IMT Berufsschul-Notenschlüssel.\n' +
        '* Noten als Noten = Die ins Feld eingetragenen Noten, wie 3,3 oder 4,7, werden genauso in die Spalte eingetragen.\n' +
        '* Noten als ganze Noten = Die ins Feld eingetragenen Noten, wie 3,3 oder 4,7, werden in ganze Noten, wie 3,0 und 5,0 umgerechnet und eingetragen.\n' +
        '* Prozente als Noten = Die ins Feld eingetragenen Prozente, wie 95 oder 50, werden in Noten, wie 1,0 und 3,7, umgerechnet und eingetragen.\n' +
        '* Prozente als ganze Noten = Die ins Feld eingetragenen Prozente, wie 95 oder 50, werden in ganze Noten, wie 1,0 und 4,0, umgerechnet und eingetragen.\n' +
        '* Eingetragene Note als Endnote runden = Die eingetragene Note wird ausgelesen, wie 3,3 oder 4,7, und werden auf die nächste ganze Note gerundet und eingetragen' +
        '* Danach speichern und schließen = Nach dem Eintragen der Noten wird automatisch auf "Fertig" geklickt und die Übersicht aufgerufen.');
}