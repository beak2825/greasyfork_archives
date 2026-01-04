// ==UserScript==
// @name        Fehlzeiten xschool.de
// @namespace   Violentmonkey Scripts
// @match       https://oszimt.xschool.de/Marks/StudentHeadMark*
// @grant       none
// @license     GNU GPLv3
// @version     250718
// @author      Pfannkuchen, Trutz
// @description Fügt ein Textfeld für eine Importfunktion für Fehlzeiten in XSchool hinzu.
// @downloadURL https://update.greasyfork.org/scripts/500313/Fehlzeiten%20xschoolde.user.js
// @updateURL https://update.greasyfork.org/scripts/500313/Fehlzeiten%20xschoolde.meta.js
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
        textField.innerHTML =   "<div style='padding: 15px; border: gray 1px solid; width: 100%; background: white; color: black;'>" +
            "<h4>Fehlzeiten Import | <label for='notenspaltenModus'>Eintragemodus: </label><select name='notenspaltenModus' id='notenspaltenModus'>" +
            "    <option value='simple'>vereinfacht</option>" +
            "    <option value='untis'>WebUntisBericht</option>" +
            "  </select> <button onclick='notenspaltenInfo()'>Erklärung</button> " +
            "<a href='https://greasyfork.org/de/scripts/500313-fehlzeiten-xschool-de'>Ausführliche Erklärung</a></h4>" +
            "<textarea id='fehlzeiten_import_txt' style='width: 100%'></textarea><br>" +
            "<button id='fehlzeiten_import_button'>Fehlzeiten eintragen</button> " +
            "<input type='checkbox' id='check_student_count' name='check_student_count' value='true' checked='checked'><label for='notenspaltenFinish'>Anzahl der Schüler prüfen</label> " +
            "<input type='checkbox' id='calculate_times' name='calculate_times' value='true' checked='checked'><label for='notenspaltenFinish'>Fehlstunden * 2</label> " +
            "<input type='checkbox' id='fehlzeiten_save' name='fehlzeiten_save' value='true' checked='checked'><label for='notenspaltenFinish'>Nach jedem Schüler speichern</label><br>" +
            "<div id='notenspaltenImportError'></div>" +
            "</div>";


        // Füge das Textfeld dem Container hinzu
        container.appendChild(textField);

        // Füge einen EventListener zum Button hinzu
        var button = document.getElementById('fehlzeiten_import_button');
        button.addEventListener('click', notenspaltenImportButtonClicked);
    }

    function notenspaltenImportShowMessage(message, typ = 'red') {
        console.error(message);
        var errorDiv = document.getElementById('notenspaltenImportError');
        errorDiv.innerHTML = message;
        errorDiv.style.color = typ;
        triggerInputChangeEvent(errorDiv);
    }



    // Funktion zum Senden eines Input- und Change-Events für ein Element
        function triggerInputChangeEvent(element) {
            var event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);

            var changeEvent = new Event('change', { bubbles: true });
            element.dispatchEvent(changeEvent);
        }

// Verzögerungsfunktion
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Buttonclick Funktion
    async function notenspaltenImportButtonClicked() {
        try {
            notenspaltenImportShowMessage(`Parse und sende Anfrage. Bitte warten...`, 'orange');

            // config
            const modus = document.getElementById('notenspaltenModus').value;
            const student_save = document.getElementById('fehlzeiten_save').checked;

            var fehlzeiten = [];
            // Finde Noten
            var value =  document.getElementById('fehlzeiten_import_txt').value.trim();
             // Teile den Inhalt in Zeilen auf
            var lines = value.split('\n');

            // Erstelle ein leeres 2D-Array für die Werte
            var values = [];

            // Durchlaufe jede Zeile und konvertiere sie in ein Array von Zahlen
            var lineNr = 1;
            lines.forEach(function(line) {
                // Splitte die Zeile an Tabulatoren oder Leerzeichen und konvertiere zu Zahlen
                if (modus == 'simple') {
                  var numbers = line.trim().split(/\s+/).map(Number);
                  if (numbers.length != 5) throw "5 Einträge erwartet. "+numbers.length+" Einträge in der Zeile "+lineNr+" erhalten.";

                  // Füge das Array der Zahlen zum Hauptarray hinzu
                  fehlzeiten.push(numbers);
                }

                if (modus == 'untis') {
                  var numbers = line.trim().split(/\t/).map(Number);
                  if (numbers.length != 21) throw "21 Einträge erwartet. "+numbers.length+" Einträge in der Zeile "+lineNr+" erhalten.";

                  // Füge das Array der Zahlen zum Hauptarray hinzu
                  fehlzeiten.push([numbers[14], numbers[15], numbers[6], numbers[7], numbers[20]]);
                }

                lineNr++;
            });
            if (!fehlzeiten) throw "Keine Fehlzeiten gefunden";
            // Select the ul element with the data-bind attribute
            var studentList = document.querySelector('ul[data-bind="foreach: Students"]');
            var studentItems = studentList.querySelectorAll('li.select-item.student-item');

            // Count the number of li elements within the ul
            if (document.getElementById('check_student_count').checked && (studentList.querySelectorAll('li').length != fehlzeiten.length))
              throw "Anzahl Schüler ("+studentList.querySelectorAll('li').length+") stimmt nicht mit der Anzahl der Zeilen ("+fehlzeiten.length+") überein.";
            var count = 0;
            for (var fehlzeiten_elemnt of fehlzeiten) {
              var containers = document.querySelectorAll('.headmark-container');
              containers.forEach(function(container, index) {
                // Selektiere das Textfeld innerhalb des Containers
                var textarea = container.querySelector('textarea');
                if (fehlzeiten_elemnt[index] != 0){
                  textarea.value = fehlzeiten_elemnt[index];
                  if (document.getElementById('calculate_times').checked && (index == 2 || index == 3))
                    textarea.value = fehlzeiten_elemnt[index] * 2;
                } else
                  textarea.value = "";
                // Ereignisse auslösen, um die Änderung zu erfassen
                triggerInputChangeEvent(textarea);
              });
               notenspaltenImportShowMessage("Parse und sende Anfrage. Bitte warten " + count + "/" + fehlzeiten.length + " - " + studentItems[count].querySelector('label').textContent , 'orange');
              await delay(0); // Browser-Zeit zum Aktualisieren geben
              count++;

              if (student_save) {
                var Speicher_button = document.querySelector('button.xschool-btn.primary[title="Speichern"]');
                Speicher_button.click();
              }
              var next_Student_Button = document.querySelector('.xschool-btn.col-xs-6.primary[data-bind="click: NextStudent"]');
              next_Student_Button.click();
            }
            notenspaltenImportShowMessage("Fertig", 'green');
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
    alert('Geben Sie pro Schüler eine Zeile ein mit der folgenden Reihenfolge mit Tabzeichen getrennt: \n'+
          '* vereinfacht: Fehltage (tab) Fehltage unent. (tab) Fehlstunden (tab) Fehlstunden unent.  (tab) Verspätungen.\n'+
          '* WebUntisBericht: Fehlzeiten pro Klasse > Gesamtübersicht\n'+
          'Die Werte können direkt aus Excel kopiert werden.');
}