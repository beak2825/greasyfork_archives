// ==UserScript==
// @name         OSZIMT Klausur Moodlequiz import
// @namespace    http://tampermonkey.net/
// @version      250128
// @description  Fügt eine Importfunktion für Moodlequiz Ergebnisse hinzu.
// @author       Steffen Trutz
// @match        https://lehrer.oszimt.de/service/klausur.php
// @grant        none
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519153/OSZIMT%20Klausur%20Moodlequiz%20import.user.js
// @updateURL https://update.greasyfork.org/scripts/519153/OSZIMT%20Klausur%20Moodlequiz%20import.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Füge Moodle Quiz Import hinzu
// Funktion, die ausgeführt wird, wenn das DOM vollständig geladen ist
function moodleExamImportOnDOMContentLoaded() {
    // Finde das erste Element mit der Klasse "oszKlausurContainer"
    var container = document.querySelector('article');

    // Erstelle ein neues Textfeld
    var textField = document.createElement('div');
    textField.type = 'text';
    textField.innerHTML = "<div style='padding: 15px; margin-top: 15px; background-color: white; border: lightgray 1px solid; border-radius: 10px; float: left; align-items: center;'>" +
        "<h4>Moodle Quiz Import</h4>" +
        "Geben Sie pro Zeile einen Link zu einer Moodlequiz ein. Wenn Sie mehrere Links angeben, werden alle Abgaben der Quizze addiert.<br>" +
        "<textarea id='importMoodleExamLinks' style='width: 100%'></textarea><br>" +
        "<button id='importMoodleExamButton'>Importiere Moodle Quiz Ergebnisse</button>" +
        "<div id='importMoodleExamError' style='color: red'></div>" +
        "</div>";


    // Füge das Textfeld dem Container hinzu
    container.appendChild(textField);

    // Füge einen EventListener zum Button hinzu
    var button = document.getElementById('importMoodleExamButton');
    button.addEventListener('click', moodleExamImportButtonClicked);
}

function moodleExamImportShowMessageRaw(message, error = true) {
    console.error(message);
    var errorDiv = document.getElementById('importMoodleExamError');
    errorDiv.innerHTML = message;

    if (error) {
        errorDiv.style.color = 'red';
    } else {
        errorDiv.style.color = 'green';
    }
}

function moodleExamImportShowMessage(data) {
    console.error(data);
    var errorDiv = document.getElementById('importMoodleExamError');
  let message = "??";

    if (data.status == 'error') {
        errorDiv.style.color = 'red';
        message = 'Fehler: '+data.message;
    } else {
        if (data.status == 'warn') {
            errorDiv.style.color = 'orange';
            message = 'Hinweis: '+data.message;
        } else {
            errorDiv.style.color = 'green';
            message = 'Erfolgreich: '+data.message;
        }
    }

    errorDiv.innerHTML = message;
}

function moodleExamImportFillFormId(formId, value) {
    const element = document.getElementById(formId);
    element.value = value;
}

// Buttonclick Funktion
async function moodleExamImportButtonClicked() {
    try {
        // URL, an die die POST-Anfrage gesendet werden soll
        //const url = '/moodleExamImport.php';
        const url = 'https://moodle.oszimt.de/grade_export_lehrerbereich.php';
        moodleExamImportShowMessageRaw(`Parse und sende Anfrage. Bitte warten...`);

        // Finde Lehrer Name
        const links = document.getElementById('importMoodleExamLinks').value.split('\n')
        const teacher = document.getElementsByClassName('oszAccountData')[0].querySelector('span').textContent;
        const klasse = document.getElementById('klasse').value;

        // Daten, die im Body der POST-Anfrage gesendet werden sollen
        const requestData = {
            links: links,
            teacher: teacher,
            klasse: klasse
        };

        try {
            // Sende die POST-Anfrage mit den JSON-Daten
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            // Überprüfe, ob die Anfrage erfolgreich war
            if (!response.ok) {
                throw new Error(`Netzwerkantwort war nicht ok: ${response.status} ${response.statusText}`);
            }

            // Parst die JSON-Antwort
            const responseText = await response.text();
            const responseData = JSON.parse(responseText);

            if (responseData.status == 'error'){
                moodleExamImportShowMessage(responseData);
                return;
            }

            // Daten in die Formulare eintragen
            moodleExamImportFillFormId('datum', responseData.examDate);
            moodleExamImportFillFormId('dauer', responseData.examTime);

            //run over all grades
            for (var i = 0; i < responseData.grades.length; i++) {
                const element = document.getElementsByName('noten')[i];
                element.value = responseData.grades[i];
            }
            updateNoten();

            // Ausgabe der empfangenen JSON-Daten
            moodleExamImportShowMessage(responseData);
        } catch (error) {
            moodleExamImportShowMessageRaw('Es gab ein Problem mit der Fetch-Operation:'+ error, true);
            throw error;
        }

    } catch (error) {
        moodleExamImportShowMessageRaw('Es gab ein Problem mit der Fetch-Operation:' + error);
        throw error;
    }

}

// Event-Listener für DOMContentLoaded hinzufügen
document.addEventListener('DOMContentLoaded', moodleExamImportOnDOMContentLoaded);

// Fallback, falls das DOM bereits geladen ist
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    moodleExamImportOnDOMContentLoaded();
}
})();