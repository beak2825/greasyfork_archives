// ==UserScript==
// @name            Ausbildungs-Mausschoner (faster & harder)
// @version         2025.06.28+0011 // Versionsnummer angepasst
// @author          Masklin (Fork von Jan (jxn_30))
// @description  Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @match           https://www.leitstellenspiel.de/buildings/*
// @run-at          document-idle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           unsafeWindow
// @namespace https://greasyfork.org/users/1473073
// @downloadURL https://update.greasyfork.org/scripts/541942/Ausbildungs-Mausschoner%20%28faster%20%20harder%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541942/Ausbildungs-Mausschoner%20%28faster%20%20harder%29.meta.js
// ==/UserScript==

/**
 * @name Training Mouse Protector
 * @name:de Ausbildungs-Mausschoner
 * @description Protects your mouse by reducing the amount of unnecessary clicks to train much staff.
 * @description:de Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25707-script-ausbildungs-mausschoner-endlich-machen-massen-ausbildungen-wieder-spa%C3%9F/
 * @match /buildings/*
 * @grant GM_getValue
 * @grant GM_setValue
 * @grant GM_addStyle
 * @grant unsafeWindow
 */

/* global $ */

// EINSTELLUNG: Soll ein Bestätigungsdialog vor dem Ausbilden angezeigt werden?
var SETTING_SHOW_CONFIRM_DIALOG = false; // true: Bestätigungsdialog vor dem Ausbilden anzeigen.
//                                           false: Keinen Bestätigungsdialog anzeigen, sondern direkt ausbilden.
// NEUE EINSTELLUNG: Debug-Modus - unterbindet das tatsächliche Senden von Anfragen zum Öffnen/Füllen von Räumen
var SETTING_DEBUG_MODE_NO_FETCH = false; // true: Keine tatsächlichen Anfragen senden (nur loggen).
//                                           false: Echte Anfragen senden.
// ENDE DER EINSTELLUNGEN! DA DRUNTER LIEBER NICHTS ÄNDERN!

var isAllianceSchool =
    document.querySelector('dl > dd > a[href^="/alliances/"]') !== null;

// Sicherstellen, dass das h1-Element vorhanden ist, bevor building_type abgerufen wird
var h1Element = document.querySelector('h1');
var buildingType = -1;
if (h1Element) {
    buildingType = parseInt(h1Element.getAttribute('building_type') || '-1');
}

var schoolBuildingId = parseInt(
    unsafeWindow.location.pathname.split('/')[2] || '-1'
);
var form = document.querySelector('form[action$="/education"]');

/** @type {HTMLSelectElement} */
var roomsSelection =
    document.querySelector('#building_rooms_use') ||
    document.createElement('select');

if (!roomsSelection.id) {
    roomsSelection.addEventListener(
        'change',
        unsafeWindow.update_personnel_counter_navbar
    );
}

roomsSelection.id = roomsSelection.id || 'building_rooms_use';
roomsSelection.name = roomsSelection.name || 'building_rooms_use';

var spinner = document.createElement('img');
spinner.src = '/images/ajax-loader.gif';
spinner.style.setProperty('height', '1lh');

// --- Start Option 1 Anpassungen ---

// Referenz auf das ursprüngliche education_select
var originalEducationSelect = document.getElementById('education_select');
var originalEducationSelectParent = originalEducationSelect ? originalEducationSelect.parentNode : null;
var originalEducationSelectSibling = originalEducationSelect ? originalEducationSelect.nextSibling : null;

// Container für die neuen Lehrgangs-Dropdowns bei "Leere Klassenzimmer öffnen"
var emptyRoomsEducationContainer = document.createElement('div');
emptyRoomsEducationContainer.id = 'empty_rooms_education_selection';
emptyRoomsEducationContainer.style.display = 'none'; // Standardmäßig ausgeblendet

/** @type {Array<HTMLSelectElement>} */
var emptyRoomEducationSelectors = []; // Speichert Referenzen zu den neuen Dropdowns

// Funktion zum Erstellen der Lehrgangs-Dropdowns für leere Räume
function createEmptyRoomsEducationDropdowns() { // totalAvailableRooms wird jetzt dynamisch aus roomsSelection geholt
    emptyRoomsEducationContainer.innerHTML = '<h4>Leere Räume pro Lehrgang:</h4>';
    emptyRoomEducationSelectors = []; // Zurücksetzen

    var allOptions = Array.from(originalEducationSelect.options);
    allOptions.shift(); // "Wähle einen Lehrgang aus" entfernen (da es der erste leere Eintrag ist)

    allOptions.forEach(function(option) {
        var div = document.createElement('div');
        div.style.marginBottom = '5px';

        var label = document.createElement('label');
        label.style.display = 'inline-block';
        label.style.width = '200px'; // Feste Breite für Ausrichtung

        // Optische Trennung des Lehrgangsnamens von der Dauer
        var textContentParts = option.textContent.match(/(.*)\s+\((\d+)\s*Tage\)/);
        var courseName = textContentParts ? textContentParts[1].trim() : option.textContent.trim();
        // Die tatsächliche Dauer aus dem `value`-Attribut der Original-Option extrahieren
        var originalValueParts = option.value.split(':');
        var originalCourseDurationFromValue = parseInt(originalValueParts[1] || '0');

        label.innerHTML = courseName + "<br><small>(" + (textContentParts ? textContentParts[2] : 'N/A') + " Tage)</small>";
        label.style.verticalAlign = 'top'; // Optische Ausrichtung

        var select = document.createElement('select');
        select.className = 'form-control empty_rooms_education_selector';
        select.style.display = 'inline-block';
        select.style.width = 'auto'; // Automatische Breite
        select.value = option.value; // Speichert den originalen fullValue (key:duration)
        select.dataset.educationKey = originalValueParts[0]; // Speichert nur den Key
        select.dataset.educationName = courseName; // Speichert den gekürzten Namen (ohne Dauer)
        // Die korrekte Dauer aus dem `value`-Attribut speichern
        select.dataset.courseDuration = originalCourseDurationFromValue.toString();

        emptyRoomEducationSelectors.push(select);

        div.appendChild(label);
        div.appendChild(select);
        emptyRoomsEducationContainer.appendChild(div);

        select.addEventListener('change', updateEmptyRoomsEducationSelectors);
    });

    if (originalEducationSelectParent) {
        originalEducationSelectParent.insertBefore(emptyRoomsEducationContainer, originalEducationSelectSibling);
    }
    updateEmptyRoomsEducationSelectors(); // Initiales Füllen der Optionen
}

// Funktion zur Aktualisierung der Optionen in den leeren Räume-Dropdowns
function updateEmptyRoomsEducationSelectors() {
    var totalSelectedRoomsAcrossEducations = 0;
    // Summiere die aktuell in ALLEN Lehrgangs-Dropdowns ausgewählten Räume
    emptyRoomEducationSelectors.forEach(function(select) {
        totalSelectedRoomsAcrossEducations += parseInt(select.value.split(':')[1] || '0');
    });

    // Die gesamt verfügbaren Räume aus dem Haupt-Dropdown #building_rooms_use
    var maxAvailableRoomsOverall = parseInt(roomsSelection.value || '0');

    emptyRoomEducationSelectors.forEach(function(currentSelect) {
        var currentSelectedRoomsValue = parseInt(currentSelect.value.split(':')[1] || '0');

        // Die verbleibende Kapazität für das AKTUELLE Dropdown ist die Gesamtverfügbarkeit
        // minus der Summe der bereits in ANDEREN Dropdowns ausgewählten Räume.
        var remainingCapacityForCurrentSelect = maxAvailableRoomsOverall - (totalSelectedRoomsAcrossEducations - currentSelectedRoomsValue);

        var oldSelectedFullValue = currentSelect.value; // Aktuellen Wert speichern (z.B. "elw2:3")

        currentSelect.replaceChildren(); // Optionen leeren

        // Standardoption "0 Räume"
        var zeroOption = document.createElement('option');
        zeroOption.value = currentSelect.dataset.educationKey + ':0';
        zeroOption.textContent = '0 Räume';
        currentSelect.appendChild(zeroOption);

        // Optionen bis zur verbleibenden Kapazität hinzufügen
        for (var i = 1; i <= remainingCapacityForCurrentSelect; i++) {
            var option = document.createElement('option');
            option.value = currentSelect.dataset.educationKey + ':' + i;
            option.textContent = i + ' Räume';
            currentSelect.appendChild(option);
        }

        // Versuch, den zuvor ausgewählten Wert beizubehalten, wenn möglich
        currentSelect.value = oldSelectedFullValue;
        // Fallback, falls der alte Wert nicht mehr gültig ist (z.B. weil die Kapazität kleiner wurde)
        // Setze auf den größten noch möglichen Wert, der kleiner oder gleich der alten Auswahl ist,
        // oder auf den maximal verfügbaren Wert.
        if (parseInt(currentSelect.value.split(':')[1] || '0') > remainingCapacityForCurrentSelect) {
            currentSelect.value = currentSelect.dataset.educationKey + ':' + remainingCapacityForCurrentSelect;
            // Wenn nach dieser Anpassung der Wert immer noch außerhalb des Bereichs liegt (z.B. wenn es <0 wäre), setze auf 0.
            if (parseInt(currentSelect.value.split(':')[1] || '0') < 0) {
                 currentSelect.value = currentSelect.dataset.educationKey + ':0';
            }
        }
    });

    // Wichtig: Nach jeder Änderung die Gesamtübersicht aktualisieren
    unsafeWindow.update_personnel_counter_navbar();
}


// --- Ende Option 1 Anpassungen ---


// checkbox to (dis-)allow opening empty schools
var allowEmptyLabel = document.createElement('label');
allowEmptyLabel.textContent = '\xa0Leere Klassenzimmer öffnen?';
var allowEmptyCheckbox = document.createElement('input');
allowEmptyCheckbox.type = 'checkbox';
allowEmptyCheckbox.id = allowEmptyLabel.htmlFor = 'allow_empty_schools';
allowEmptyCheckbox.dataset.storageKey = 'allowEmptySchools';
allowEmptyCheckbox.checked = GM_getValue(
    allowEmptyCheckbox.dataset.storageKey,
    false
);
allowEmptyCheckbox.addEventListener('change', function() {
    GM_setValue(
        allowEmptyCheckbox.dataset.storageKey,
        allowEmptyCheckbox.checked
    );
    // UI aktualisieren, wenn Checkbox geändert wird
    updateEducationSelectionUI();
});
allowEmptyLabel.prepend(allowEmptyCheckbox);

// Funktion zur Steuerung der Sichtbarkeit der Lehrgangsauswahl-UI
function updateEducationSelectionUI() {
    if (allowEmptyCheckbox.checked) {
        // Wenn leere Räume geöffnet werden sollen:
        originalEducationSelect.style.display = 'none'; // Originales Dropdown ausblenden
        emptyRoomsEducationContainer.style.display = 'block'; // Neue Dropdowns anzeigen
        // Die updateEmptyRoomsEducationSelectors() wird aufgerufen, um die dynamischen Dropdowns zu steuern.
        updateEmptyRoomsEducationSelectors();

    } else {
        // Wenn Personal zugewiesen werden soll:
        originalEducationSelect.style.display = 'block'; // Originales Dropdown anzeigen
        emptyRoomsEducationContainer.style.display = 'none'; // Neue Dropdowns ausblenden
    }
    // Nach der UI-Aktualisierung sicherstellen, dass die Personal-Navbar korrekt ist
    unsafeWindow.update_personnel_counter_navbar();
}


// checkbox to toggle whether only specific schools should be used
var useSpecificSchoolsLabel = document.createElement('label');
useSpecificSchoolsLabel.textContent = '\xa0Nur spezielle Schulen nutzen?';
var useSpecificSchoolsCheckbox = document.createElement('input');
useSpecificSchoolsCheckbox.type = 'checkbox';
useSpecificSchoolsCheckbox.id = useSpecificSchoolsLabel.htmlFor =
    'use_specific_schools';
useSpecificSchoolsCheckbox.dataset.storageKey = 'useSpecificSchools';
useSpecificSchoolsCheckbox.checked = GM_getValue(
    useSpecificSchoolsCheckbox.dataset.storageKey,
    false
);
useSpecificSchoolsCheckbox.addEventListener('change', function() {
    GM_setValue(
        useSpecificSchoolsCheckbox.dataset.storageKey,
        useSpecificSchoolsCheckbox.checked
    );
});
useSpecificSchoolsLabel.prepend(useSpecificSchoolsCheckbox);

GM_addStyle(`
 label:has(#${useSpecificSchoolsCheckbox.id}:not(:checked)) + select[multiple],
             label:has(#${useSpecificSchoolsCheckbox.id}:not(:checked)) + select[multiple] + .help-block {
                 display: none;
             }`);

var specificSchoolSelection = document.createElement('select');
specificSchoolSelection.classList.add('form-control');
specificSchoolSelection.multiple = true;
specificSchoolSelection.size = 7;

var specificSchoolsHelp = document.createElement('p');
specificSchoolsHelp.classList.add('help-block');
specificSchoolsHelp.textContent =
    'Durch das Drücken von Strg können mehrere Schulen einzeln ausgewählt werden.';

form.querySelector(':scope > h3')?.before(roomsSelection);
roomsSelection.after(
    spinner,
    document.createElement('br'),
    allowEmptyLabel,
    ' | ',
    useSpecificSchoolsLabel,
    specificSchoolSelection,
    specificSchoolsHelp
);

// create a label if none exists
if (roomsSelection.labels.length === 0) {
    var label = document.createElement('label');
    label.htmlFor = roomsSelection.id;
    label.textContent =
        'Wie viele Räume sollen für diese Ausbildung genutzt werden?\xa0';
    roomsSelection.before(label);
}

var roomsSelectionClass = 'jxn-training_mouse_protector-rooms_use';
var lastShownOptionClass = 'jxn-training_mouse_protector-last_shown';
var isDurchschloedelingClass =
    'jxn-training_mouse_protector-is-durchschloedeling';

var selectStyle = document.createElement('style');
form?.append(selectStyle);

var updateSelectStyle = function() {
    selectStyle.textContent = `
     body:has(#${allowEmptyCheckbox.id}:checked) #accordion > .panel,
     form.${isDurchschloedelingClass} #accordion > .panel {
         opacity: 0.5;
         pointer-events: none;
     }
     `.trim();
};

roomsSelection.addEventListener('change', updateSelectStyle);
allowEmptyCheckbox.addEventListener('change', updateSelectStyle);

/**
 * @typedef {Object} Schooling
 * @property {number} id
 * @property {number} education_id
 * @property {string} education
 * @property {string} education_start_time
 * @property {string} education_end_time
 */

/**
 * @typedef {Object} BuildingExtension
 * @property {string} caption
 * @property {boolean} available
 * @property {boolean} enabled
 * @property {number} type_id
 */

/**
 * @typedef {Object} Building
 * @property {number} id
 * @property {string} caption
 * @property {number} building_type
 * @property {number} personal_count
 * @property {Schooling[]} [schoolings]
 * @property {BuildingExtension[]} [extensions]
 */

/**
 * @typedef {Object} BuildingType
 * @property {string} caption
 * @property {number[]} [schools]
 */

/**
 * @param {Building} school
 * @returns {number}
*/
var getFreeRooms = function(school) {
    var _a;
    var total =
        1 + (((_a = school.extensions) === null || _a === void 0 ? void 0 : _a.filter(function(e) {
            return e.available && e.enabled;
        }).length) || 0);
    return total - (school.schoolings?.length || 0);
};

/**
 * @param {Building[]} schools
*/
var getUsableSchools = function(schools) {
    if (!useSpecificSchoolsCheckbox.checked) return schools;
    var selectedSchools = Array.from(
        specificSchoolSelection.selectedOptions
    ).map(function(option) {
        return option.value;
    });
    return schools.filter(function(ref) {
        var id = ref.id;
        return selectedSchools.includes(id.toString());
    });
};

/**
 * @param {Building[]} schools
*/
var setRoomSelection = function(schools) {
    var filteredSchools = getUsableSchools(schools);

    var totalFreeRooms = filteredSchools.reduce(
        function(acc, school) {
            return acc + getFreeRooms(school);
        },
        0
    );

    roomsSelection.replaceChildren();

    var zeroOption = document.createElement('option');
    zeroOption.value = '0';
    zeroOption.textContent = '0';
    roomsSelection.appendChild(zeroOption);

    for (var i = 1; i <= totalFreeRooms; i++) {
        var option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        roomsSelection.appendChild(option);
    }
    // Wenn es freie Räume gibt und der Wert noch 0 ist, setze ihn auf den Maximalwert
    // Dieser Teil wird nun durch update_personnel_counter_navbar im Personalmodus überschrieben
    if (roomsSelection.value === '0' && totalFreeRooms > 0) {
        roomsSelection.value = totalFreeRooms.toString();
    }

    roomsSelection.dispatchEvent(new Event('change'));

    // Nach dem Aktualisieren der Gesamt-Raumauswahl, die Optionen der einzelnen Lehrgangs-Dropdowns anpassen
    updateEmptyRoomsEducationSelectors();
};

var getSelectedEducationInfo = function() {
    var educationSelect = document.getElementById('education_select');
    if (!educationSelect) return {
        key: '',
        fullValue: '',
        duration: 0,
        name: ''
    };

    var selectedOption = educationSelect.options[educationSelect.selectedIndex];
    if (!selectedOption || !selectedOption.value) return {
        key: '',
        fullValue: '',
        duration: 0,
        name: ''

    };

    var valueSplit = selectedOption.value.split(':');
    var educationKey = valueSplit[0] || '';
    var duration = parseInt(valueSplit[1] || '0');
    var educationName = selectedOption.textContent.trim().replace(("(" + duration + " Tage)"), '').trim();

    return {
        key: educationKey,
        fullValue: selectedOption.value,
        duration: duration,
        name: educationName
    };
};

// Neue Funktion, um die ausgewählten Lehrgänge für leere Räume zu erhalten
function getSelectedEmptyRoomEducations() {
    var selectedEducations = [];
    emptyRoomEducationSelectors.forEach(function(select) {
        var educationKey = select.dataset.educationKey; // Already stored correctly
        var originalDuration = select.dataset.courseDuration; // Now this dataset value is correctly the numerical duration from the original option's value
        var roomsForThisEducation = parseInt(select.value.split(':')[1] || '0'); // Correctly gets rooms

        if (roomsForThisEducation > 0) {
            selectedEducations.push({
                key: educationKey,
                fullValue: educationKey + ':' + originalDuration, // This should now correctly combine
                rooms: roomsForThisEducation,
                name: select.dataset.educationName,
                duration: parseInt(originalDuration || '0') // Sicherstellen, dass die Dauer korrekt geparst wird
            });
        }
    });
    return selectedEducations;
}


var getTrainingDuration = function() {
    if (allowEmptyCheckbox.checked) {
        var selectedEmptyEducations = getSelectedEmptyRoomEducations();
        if (selectedEmptyEducations.length > 0) {
            return selectedEmptyEducations[0].duration;
        }
        return 0;
    }
    return getSelectedEducationInfo().duration;
};


var confirmDialogId = 'jxn-training_mouse-protector_confirm-dialog';

GM_addStyle(`
     #${confirmDialogId} {
     position: fixed;
     padding-top: 0;
     left: 0;
     right: 0;
     top: 0;
     bottom: 0;
     overflow: hidden;
     z-index: 1050;
     }
     #${confirmDialogId} .modal-dialog {
     max-width: 500px;
     }
     #${confirmDialogId} .modal-body {
     height: unset;
     overflow-y: unset;
     }

     #${confirmDialogId} u {
     text-decoration-color: #aaa;
     }

     #${confirmDialogId} .buttons {
     text-align: center;
     margin: -15px;
     margin-top: 15px;
     border-top: 1px solid;
     }

     #${confirmDialogId} .buttons > a {
     width: 50%;
     display: inline-block;
     color: inherit;
     cursor: pointer;
     padding: 15px;
     }

     #${confirmDialogId} .buttons > a:hover {
     background-color: #aaa;
     text-decoration: none;
     }

     #${confirmDialogId} .buttons > a:not(:last-child) {
     border-right: 1px solid;
     }
     `);

/**
 * @param {string} educationName
 * @param {number} staffAmount
 * @param {number} schoolsAmount
 * @param {number} duration
 * @param {number} emptyRooms
 * @param {number} emptySchools
 * @param {number} pricePerSeatPerDay
 * @param {string} openDuration
 * @returns {Promise<boolean>}
 */
var confirmDialog = function(
    educationName,
    staffAmount,
    schoolsAmount,
    duration,
    emptyRooms,
    emptySchools,
    pricePerSeatPerDay,
    openDuration
) {
    var modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = confirmDialogId;

    var dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    dialog.style.setProperty('width', 'fit-content');

    var content = document.createElement('div');
    content.classList.add('modal-content');

    var body = document.createElement('div');
    body.classList.add('modal-body');
    body.style.setProperty('overflow', 'auto');
    body.style.setProperty('box-sizing', 'content-box');

    /**
     * @param {number} num
     * @returns {string}
     */
    var str = function(num) {
        return num.toLocaleString('de');
    };

    var trainingP = document.createElement('p');
    trainingP.innerHTML = "Ausbildung: <b>" + educationName + "</b>";
    body.append(trainingP);

    if (staffAmount) {
        var staffAmountP = document.createElement('p');
        staffAmountP.innerHTML = "Es werden <b>" + (str(staffAmount)) + "&nbsp;Personen</b> in <b>" + (str(Math.ceil(staffAmount / 10))) + "&nbsp;Zimmern</b> (<b>" + (str(schoolsAmount)) + "&nbsp;Schulen</b>) ausgebildet.";
        if (pricePerSeatPerDay && isAllianceSchool) {
            staffAmountP.innerHTML += "<br/>Die Kosten betragen <b>" + (str(pricePerSeatPerDay)) + "&nbsp;*&nbsp;" + (str(staffAmount)) + "&nbsp;*&nbsp;" + duration + "&nbsp;=&nbsp;<u>" + (str(pricePerSeatPerDay * staffAmount * duration)) + "&nbsp;Credits</u></b>.";
        }
        body.append(staffAmountP);
    }
    if (emptyRooms) {
        var emptyRoomsP = document.createElement('p');
        emptyRoomsP.innerHTML = "Es werden <b>" + (str(emptyRooms)) + "&nbsp;leere&nbsp;Zimmer</b> in <b>" + (str(emptySchools)) + "&nbsp;Schulen</b> zum Preis von <b>" + (str(pricePerSeatPerDay)) + "&nbsp;Credits</b> pro Person pro Tag für die Dauer von <b>" + openDuration + "</b> im Verband freigegeben.";
        body.append(emptyRoomsP);
    }

    var buttons = document.createElement('div');
    buttons.classList.add('buttons');
    var abortBtn = document.createElement('a');
    abortBtn.href = '#';
    abortBtn.textContent = 'Abbrechen';
    var confirmBtn = document.createElement('a');
    confirmBtn.textContent = 'Fortfahren';

    buttons.append(abortBtn, confirmBtn);
    body.append(buttons);
    content.append(body);
    dialog.append(content);
    modal.append(dialog);
    document.body.append(modal);

    modal.classList.add('in');
    modal.style.setProperty('display', 'block');

    return new Promise(function(resolve) {
        abortBtn.addEventListener('click', function(event) {
            event.preventDefault();
            modal.remove();
            resolve(false);
        });
        confirmBtn.addEventListener('click', function(event) {
            event.preventDefault();
            modal.remove();
            resolve(true);
        });
    });
};

var abortedDueToMultipleSchools = false;
var multipleSchoolsAlert = `
     ⚠️🚨 𝐀𝐜𝐡𝐭𝐮𝐧𝐠 𝐀𝐜𝐡𝐭𝐮𝐧𝐠. 𝐄𝐢𝐧𝐞 𝐰𝐢𝐜𝐡𝐭𝐢𝐠𝐞 𝐃𝐮𝐫𝐜𝐡𝐬𝐚𝐠𝐞! 🚨⚠️

     Das Script "Ausbildungs-Mausschoner" ist NICHT mit dem Script "MultipleSchools" von Allure149 kompatibel. Bitte deaktiviere das Script "MultipleSchools", um dieses Script hier verwenden zu können.

     Andernfalls kann es zu unerwartetem Verhalten kommen, für dieses übernimmt der Autor dieses Scriptes keine Haftung.

     Viele Grüße
     Euer Tutorial-Polizist mit dem langen Zeigefinger! 👮👆
     `.trim();

var checkMultipleSchools = setInterval(function() {
    if (document.querySelector('#multipleClassesSelect')) {
        var pre = document.createElement('pre');
        pre.textContent = multipleSchoolsAlert;
        document.querySelector('#schooling')?.prepend(pre);
        alert(multipleSchoolsAlert);
        abortedDueToMultipleSchools = true;
        clearInterval(checkMultipleSchools);
    }
}, 1000);

// Helper function to process promises sequentially
function sequentialPromiseProcessor(items, processorFn) {
    var result = Promise.resolve();
    items.forEach(function(item) {
        result = result.then(function() {
            return processorFn(item);
        });
    });
    return result;
}

// Initialer Start des Skripts
Promise.resolve()
    .then(function() {
        return Promise.all([
            fetch("https://api.lss-manager.de/de_DE/buildings").then(function(res) {
                return res.json();
            }),
            ...(isAllianceSchool ?
                [
                    fetch('/api/alliance_buildings').then(function(res) {
                        return res.json();
                    }),
                    fetch('/api/buildings').then(function(res) {
                        return res.json();
                    }),
                ] :
                [fetch('/api/buildings').then(function(res) {
                    return res.json();
                })]),
        ]);
    })
    .then(function(ref) {
        var buildings = ref[0];
        var ownOrAllianceBuildings = ref[1];
        var buildingsResult = ref[2]; // Umbenannt, um Konflikt zu vermeiden
        if (buildingsResult === void 0) {
            buildingsResult = ownOrAllianceBuildings;
        }
        return {
            buildings: buildingsResult, // Hier das korrigierte 'buildingsResult' verwenden
            schools: ownOrAllianceBuildings
                .filter(function(b) {
                    return b.building_type === buildingType;
                })
                .toSorted(function(a, b) {
                    return a.id - b.id;
                }),
            buildingTypes: buildings, // Hier das 'buildingTypes' aus ref[0]
        };
    })
    .then(function(ref) {
        var buildings = ref.buildings;
        var schools = ref.schools;
        var buildingTypes = ref.buildingTypes;
        setRoomSelection(schools); // Befüllt roomsSelection

        // Nach dem Befüllen der Räume, die Checkboxen für leere Räume erstellen.
        createEmptyRoomsEducationDropdowns();
        roomsSelection.addEventListener('change', function() {
            updateEmptyRoomsEducationSelectors();
        });

        specificSchoolSelection.replaceChildren();
        schools.forEach(function(school) {
            var freeRooms = getFreeRooms(school);
            if (!freeRooms) return;
            var option = document.createElement('option');
            option.value = school.id.toString();
            option.textContent = (school.caption) + " (" + freeRooms + " Zimmer frei)";
            specificSchoolSelection.append(option);
        });

        useSpecificSchoolsCheckbox.addEventListener('change', function() {
            return setRoomSelection(schools);
        });

        var updateTimeout;
        specificSchoolSelection.addEventListener('change', function() {
            if (updateTimeout) clearTimeout(updateTimeout);
            setTimeout(function() {
                return setRoomSelection(schools);
            }, 500);
        });

        return {
            buildings: buildings,
            buildingTypes: buildingTypes,
            schools: schools
        };
    })
    .then(function(ref) {
        var buildings = ref.buildings;
        var buildingTypes = ref.buildingTypes;
        var schools = ref.schools;
        if (document.querySelector('.personal-select-heading')) return schools;

        unsafeWindow.loadedBuildings = [];

        var validBuildingTypeIds = Object.keys(buildingTypes)
            .filter(function(type) {
                var _a;
                return ((_a = buildingTypes[type]) === null || _a === void 0 ? void 0 : _a.schools?.includes(buildingType)) || false;
            })
            .map(function(type) {
                return parseInt(type);
            });

        var staffSelectHeading = document.createElement('h3');
        staffSelectHeading.textContent = 'Personal auswählen';
        var accordion = document.createElement('div');
        accordion.id = 'accordion';
        buildings
            .filter(function(ref) {
                var building_type = ref.building_type;
                return validBuildingTypeIds.includes(building_type);
            })
            .toSorted(function(a, b) {
                return a.caption.localeCompare(b.caption);
            })
            .forEach(function(building) {
                var buildingDiv = document.createElement('div');
                buildingDiv.classList.add('panel', 'panel-default');

                var heading = document.createElement('div');
                heading.classList.add(
                    'panel-heading',
                    'personal-select-heading'
                );
                heading.setAttribute('building_id', building.id.toString());
                heading.setAttribute(
                    'href',
                    ("/buildings/" + (building.id) + "/schooling_personal_select")
                );
                heading.textContent = building.caption;
                var headingRight = document.createElement('div');
                headingRight.classList.add('pull-right');
                var selectSpan = document.createElement('span');
                selectSpan.id = "personal-select-heading-building-" + (building.id);
                selectSpan.classList.add('personal-select-heading-building');
                selectSpan.setAttribute('building_id', building.id.toString());
                var currentLabel = document.createElement('span');
                currentLabel.classList.add('label', 'label-default');
                currentLabel.textContent = (building.personal_count) + "\xa0Angestellte";

                var body = document.createElement('div');
                body.classList.add('panel-body', 'hidden');
                body.setAttribute('building_id', building.id.toString());
                var loadingImg = document.createElement('img');
                loadingImg.classList.add('ajaxLoader');
                loadingImg.src = '/images/ajax-loader.gif';

                headingRight.append(selectSpan, currentLabel);
                heading.append(headingRight);
                body.append(loadingImg);
                buildingDiv.append(heading, body);
                accordion.append(buildingDiv);
            });

        document
            .querySelector('#alliance_cost')
            ?.after(staffSelectHeading, accordion);

        var educationCosts = document.createElement('span');
        educationCosts.classList.add('label', 'label-success');
        educationCosts.textContent = '0\xa0Credits';
        document
            .querySelector('#schooling_free')
            ?.after(' Gesamtkosten:\xa0', educationCosts);

        var scrollTimeout;
        var loadVisibleEducatedCounters = function() {
            return document
                .querySelectorAll(
                    '.personal-select-heading-building:not([data-education-loaded])'
                )
                .forEach(function(building) {
                    var rect = building.getBoundingClientRect();
                    if (
                        rect.top <= 0 ||
                        rect.bottom >=
                        (unsafeWindow.innerHeight ||
                            document.documentElement.clientHeight)
                    ) {
                        return;
                    }
                    var buildingId = building.getAttribute('building_id');
                    var educationKeyForCheck = ''; // Standardwert
                    // Wenn im Modus "Leere Klassenzimmer öffnen", nutze den Key des ersten ausgewählten Lehrgangs
                    if (allowEmptyCheckbox.checked) {
                        var selectedEmptyEducations = getSelectedEmptyRoomEducations();
                        if (selectedEmptyEducations.length > 0) {
                            educationKeyForCheck = selectedEmptyEducations[0].key;
                        }
                    } else {
                        // Im Personal-Modus, nutze den Key des einzelnen Lehrgangs-Dropdowns
                        educationKeyForCheck = getSelectedEducationInfo().key;
                    }

                    if (!educationKeyForCheck) {
                        // Wenn kein Lehrgang ausgewählt ist, keinen Check ausführen.
                        return;
                    }

                    fetch(
                            ("/buildings/" + schoolBuildingId + "/schoolingEducationCheck?education=" + (educationKeyForCheck) + "&only_building_id=" + buildingId)
                        )
                        .then(function(res) {
                            return res.ok ? res.text() : Promise.reject(res);
                        })
                        .then(function(res) {
                            building.dataset.educationLoaded = 'true';
                            eval(res);
                        })
                        .catch(console.error);
                });
        };
        var scrollEvent = function() {
            // Nur ausführen, wenn ein Lehrgang (entweder regulär oder für leere Räume) ausgewählt ist
            if ((!allowEmptyCheckbox.checked && !getSelectedEducationInfo().key) || (allowEmptyCheckbox.checked && getSelectedEmptyRoomEducations().length === 0)) return;
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(loadVisibleEducatedCounters, 100);
        };
        document
            .querySelector('#iframe-inside-container')
            ?.addEventListener('scroll', scrollEvent);
        unsafeWindow.addEventListener('scroll', scrollEvent);

        unsafeWindow.schooling_disable = unsafeWindow.schooling_disable || function(educationKey) {
            document
                .querySelectorAll('.schooling_checkbox:disabled')
                .forEach(function(checkbox) {
                    return (checkbox.disabled = false);
                });

            document
                .querySelectorAll((".schooling_checkbox[" + educationKey + "=\"true\"]"))
                .forEach(function(checkbox) {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
        };
        unsafeWindow.schooling_check_educated_counter = unsafeWindow.schooling_check_educated_counter || function() {
            document
                .querySelectorAll('.personal-select-heading-building')
                .forEach(function(span) {
                    span.textContent = 'Lade...';
                    span.classList.remove('label', 'label-success');
                    delete span.dataset.educationLoaded;
                });
            loadVisibleEducatedCounters();
        };
        unsafeWindow.free_space_for_personnel_selection = unsafeWindow.free_space_for_personnel_selection || function() {
            // Im Modus "Personal ausbilden": Freie Plätze basierend auf roomsSelection
            if (!allowEmptyCheckbox.checked) {
                return 10 * parseInt(roomsSelection.value || '0');
            } else {
                // Im Modus "Leere Klassenzimmer öffnen": Hier zählen wir die SUMME der in den Sub-Dropdowns gewählten Räume
                var totalSelectedEmptyRooms = 0;
                getSelectedEmptyRoomEducations().forEach(function(edu) {
                    totalSelectedEmptyRooms += edu.rooms;
                });
                return totalSelectedEmptyRooms * 10; // Jeder Raum repräsentiert 10 Personenplätze
            }
        };
        unsafeWindow.is_free_place_available = unsafeWindow.is_free_place_available || function() {
            var _a;
            return parseInt(((_a = document.querySelector('#schooling_free')) === null || _a === void 0 ? void 0 : _a.textContent) || '0') > 0;
        };
        unsafeWindow.update_personnel_counter_navbar = unsafeWindow.update_personnel_counter_navbar || function() {
            var _a;
            var max = unsafeWindow.free_space_for_personnel_selection();
            var selected = 0;

            if (!allowEmptyCheckbox.checked) { // Im Personal-Modus: Anzahl der ausgewählten Personal-Checkboxen
                selected = document.querySelectorAll('.schooling_checkbox:checked').length;

                // KORREKTE LOGIK FÜR PERSONALMODUS: roomsSelection anpassen
                var requiredRooms = Math.ceil(selected / 10);
                if (requiredRooms === 0) {
                    // Wenn kein Personal ausgewählt, setze roomsSelection auf 0, aber nur wenn es nicht schon 0 ist
                    if (parseInt(roomsSelection.value || '0') !== 0) {
                        roomsSelection.value = '0';
                        roomsSelection.dispatchEvent(new Event('change'));
                    }
                } else if (parseInt(roomsSelection.value || '0') < requiredRooms) {
                    // Wenn mehr Räume benötigt werden, als aktuell ausgewählt sind, setze auf die benötigte Anzahl
                    roomsSelection.value = requiredRooms.toString();
                    roomsSelection.dispatchEvent(new Event('change'));
                }
                // Wenn roomsSelection.value bereits größer oder gleich requiredRooms ist (manuell mehr ausgewählt), belasse es dabei.

            } else { // Im Leere-Räume-Modus: Hier zählt die Anzahl der tatsächlich GEÖFFNETEN Räume (jedoch als Personen-Äquivalent für die Anzeige)
                selected = getSelectedEmptyRoomEducations().reduce(function(acc, edu) {
                    return acc + edu.rooms;
                }, 0) * 10;
            }

            var free = max - selected;
            var freeSpan = document.querySelector('#schooling_free');
            if (freeSpan) {
                freeSpan.textContent = free.toString();
            }
            var duration = getTrainingDuration();
            educationCosts.textContent = (selected * parseInt(((_a = form['alliance[cost]']) === null || _a === void 0 ? void 0 : _a.value) || '0') * duration).toLocaleString() + "\xa0Credits";
        };
        unsafeWindow.update_schooling_free = unsafeWindow.update_schooling_free || function() {};
        unsafeWindow.update_costs =
            unsafeWindow.update_personnel_counter_navbar;

        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!(target instanceof HTMLElement)) return;
            var heading = target.closest('.personal-select-heading');
            if (!heading) return;

            if (
                heading.querySelector(
                    '.schooling-personnel-select-button, .schooling-personnel-reset-button'
                )
            ) {
                return;
            }

            var body = heading.nextElementSibling;
            body.classList.toggle('hidden');

            if (heading.matches(':has( + .panel-body .ajaxLoader)')) {
                var href = heading.getAttribute('href');
                unsafeWindow.loadedBuildings.push(href);
                fetch(href)
                    .then(function(res) {
                        return res.text();
                    })
                    .then(function(html) {
                        $(body).html(html);

                        var educationKey = '';
                        if (allowEmptyCheckbox.checked) {
                            var selectedEmptyEducations = getSelectedEmptyRoomEducations();
                            if (selectedEmptyEducations.length > 0) {
                                educationKey = selectedEmptyEducations[0].key;
                            }
                        } else {
                            educationKey = getSelectedEducationInfo().key;
                        }

                        if (educationKey) {
                            unsafeWindow.schooling_disable(educationKey);
                            unsafeWindow.update_personnel_counter_navbar();
                        }
                    });
            }
        });

        document.addEventListener('click', function(e) {
            var target = e.target;
            if (!(target instanceof HTMLElement)) return;

            var selectAvailable = target.closest(
                '.schooling_select_available'
            );
            var selectAvailableWithoutEducation = target.closest(
                '.schooling_select_available_without_education'
                );
            var btn = selectAvailable || selectAvailableWithoutEducation;
            if (!btn) return;

            e.preventDefault();
            btn.disabled = true;
            unsafeWindow.selectAvailable(
                btn.getAttribute('building_id'),
                !!selectAvailableWithoutEducation
            );
            btn.disabled = false;
        });

        document
            .querySelector('#alliance_cost')
            ?.addEventListener('change', unsafeWindow.update_costs);

        document.dispatchEvent(
            new CustomEvent('lehrgangszuweiser:render-personnel-selectors')
        );
        document.dispatchEvent(
            new CustomEvent('ausbildungs-mausschoner:buildings-appended')
        );

        return schools;
    })
    .then(function(schools) {
        var _a;
        var authToken =
            ((_a = document
                .querySelector('meta[name="csrf-token"]')) === null || _a === void 0 ? void 0 : _a.getAttribute('content')) || '';

        var schoolNameMap = new Map();
        // getRoomsPlan ist jetzt komplexer, es gibt einen Plan von { education: fullValue, staff: []|[...] } Objekten
        // Der neue Parameter desiredRoomsOverride stellt sicher, dass wir den korrekten Wert verwenden.
        var getRoomsPlan = function(desiredRoomsOverride) {
            var roomsPlan = [];

            if (allowEmptyCheckbox.checked) {
                var selectedEducations = getSelectedEmptyRoomEducations();
                if (selectedEducations.length === 0) {
                    alert("Bitte wählen Sie mindestens einen Lehrgang für leere Räume aus!");
                    return null; // Abbruch der Operation
                }

                var roomsToDistribute = parseInt(roomsSelection.value || '0');
                if (roomsToDistribute === 0) {
                     alert("Bitte wählen Sie die Anzahl der Räume für leere Klassenzimmer aus!");
                     return null; // Abbruch der Operation
                }
                var selectedRoomsSum = selectedEducations.reduce(function(sum, edu) {
                    return sum + edu.rooms;
                }, 0);

                if (selectedRoomsSum === 0) {
                    alert("Bitte wählen Sie die Anzahl der Räume für die ausgewählten Lehrgänge!");
                    return null;
                }
                if (selectedRoomsSum > roomsToDistribute) {
                    alert("Sie haben mehr Räume für Lehrgänge ausgewählt (" + selectedRoomsSum + ") als über das Haupt-Dropdown (" + roomsToDistribute + ") zur Verfügung stehen. Bitte korrigieren Sie Ihre Auswahl.");
                    return null;
                }

                // Im leere-Räume-modu ist roomsPlan ein Array von Raum-Infos, die über die Schulen verteilt werden.
                // Jeder Eintrag repräsentiert EINEN Raum für EINEN bestimmten Lehrgang.
                selectedEducations.forEach(function(edu) {
                    for (var i = 0; i < edu.rooms; i++) {
                        roomsPlan.push({ education: edu.fullValue, staff: [] }); // staff ist leer für leere Räume
                    }
                });
                return roomsPlan;
            }

            // Otherwise, we train selected staff
            var allStaff = Array.from(
                document.querySelectorAll('.schooling_checkbox:checked') // Dies sammelt alle Haken bei Personal
            ).map(function(checkbox) {
                return checkbox.value;
            });
            console.log('DEBUG (Personalmodus): Gesammeltes Personal (allStaff):', allStaff);

            // desiredRooms wird jetzt von außen übergeben oder aus roomsSelection gelesen (Fallback)
            var actualDesiredRooms = desiredRoomsOverride !== undefined ? desiredRoomsOverride : parseInt(roomsSelection.value || '0');
            console.log('DEBUG (Personalmodus): desiredRooms für roomsPlan (aus Override oder UI):', actualDesiredRooms);


            if (actualDesiredRooms === 0 && allStaff.length > 0) {
                 alert("Sie haben Personal ausgewählt, aber 0 Räume. Bitte wählen Sie die Raumanzahl!");
                 return null;
            }

            if (allStaff.length === 0 && actualDesiredRooms > 0) {
                alert("Bitte wählen Sie Personal aus, oder aktivieren Sie 'Leere Klassenzimmer öffnen'.");
                return null;
            }
            if (allStaff.length === 0 && actualDesiredRooms === 0) {
                alert("Kein Personal oder Räume ausgewählt. Es wird nichts ausgebildet.");
                return null;
            }


            if (allStaff.length > (actualDesiredRooms * 10)) {
                alert("Sie haben mehr Personal ausgewählt als Räume zur Verfügung stehen (" + actualDesiredRooms + " Räume = " + (actualDesiredRooms * 10) + " Personal). Bitte passen Sie die Raumauswahl an oder reduzieren Sie das Personal.");
                return null;
            }

            // Fill rooms based on selected staff
            for (var i = 0; i < allStaff.length; i += 10) {
                roomsPlan.push({ education: getSelectedEducationInfo().fullValue, staff: allStaff.slice(i, i + 10) });
            }

            // If selected rooms are more than needed for staff, add empty rooms for the same education
            while (roomsPlan.length < actualDesiredRooms) {
                roomsPlan.push({ education: getSelectedEducationInfo().fullValue, staff: [] }); // Diese Räume sind "leer", wenn Personal fehlt
            }
            console.log('DEBUG (Personalmodus): Generierter Raumplan (roomsPlan):', roomsPlan);
            return roomsPlan;
        };
        /**
         * @param {{education: string, staff: string[]}[]} roomsPlanArray // Das ist ein Array von Raum-Objekten
         * @returns {Record<number, {education: string, staff: string[]}[]>} // Umwandlung in Schulen-Mapping
         */
        var assignRoomsToSchools = function(roomsPlanArray) {
            var roomsBySchool = {};
            var currentRoomsPointer = 0;

            for (var _i = 0, _b = getUsableSchools(schools); _i < _b.length; _i++) {
                var school = _b[_i];
                schoolNameMap.set(school.id.toString(), school.caption);
                var freeRooms = getFreeRooms(school);
                if (!freeRooms) continue;

                var roomsForThisSchool = roomsPlanArray.slice(currentRoomsPointer, currentRoomsPointer + freeRooms);
                if (roomsForThisSchool.length > 0) {
                    roomsBySchool[school.id] = roomsForThisSchool;
                    currentRoomsPointer += roomsForThisSchool.length;
                }
                if (currentRoomsPointer >= roomsPlanArray.length) break; // All rooms assigned
            }

            if (currentRoomsPointer < roomsPlanArray.length) {
                alert("FEHLER: Nicht genügend Schulen ausgewählt oder nicht genug freie Räume in den ausgewählten Schulen, um alle gewünschten Lehrgänge/Räume unterzubringen. Bitte überprüfen Sie Ihre Auswahl der Schulen oder Räume.");
                return null;
            }
            return roomsBySchool;
        };

        /**
         * @param {number|string} schoolId
         * @param {number} rooms_to_open_in_school // Anzahl der Räume, die in dieser Schule geöffnet werden sollen
         * @param {string} educationSelectValue // Der vollständige Wert aus dem education_select Dropdown, z.B. "elw2:3"
         * @param {string} allianceDurationValue
         * @param {string} cost
         * @param {string[]} [staffToAssign] // Optional: Personal-IDs, die diesem Raum zugewiesen werden sollen
         * @returns {Promise<Response>}
         */
        var openSchool = function(
            schoolId,
            rooms_to_open_in_school,
            educationSelectValue,
            allianceDurationValue,
            cost,
            staffToAssign // NEUER PARAMETER
        ) {
            var schoolUrl = new URL(
                "/buildings/" + schoolId,
                unsafeWindow.location.href
            );
            schoolUrl.searchParams.set('utf8', '✓');
            schoolUrl.searchParams.set('authenticity_token', authToken);
            schoolUrl.searchParams.set('education_select', educationSelectValue);
            schoolUrl.searchParams.set('alliance[duration]', allianceDurationValue);
            schoolUrl.searchParams.set('alliance[cost]', cost);
            schoolUrl.searchParams.set('building_rooms_use', rooms_to_open_in_school.toString());

            // NEU: personal_ids[] zum POST-Body hinzufügen, falls Personal zugewiesen werden soll
            if (staffToAssign && staffToAssign.length > 0) {
                staffToAssign.forEach(function(personId) {
                    schoolUrl.searchParams.append('personal_ids[]', personId);
                });
            }

            schoolUrl.searchParams.set('commit', 'Ausbilden');
            var school = schools.find(
                function(s) {
                    return s.id.toString() === schoolId.toString();
                }
            );

            // Intern den Schulstatus aktualisieren, damit getFreeRooms die belegten Räume berücksichtigt
            // Dies geschieht immer, da die Operation jetzt echt ist.
            if (!school.schoolings) {
                school.schoolings = [];
            }
            for (var i = 0; i < rooms_to_open_in_school; i++) school.schoolings.push(undefined);

            // --- DEBUG-LOG FÜR BEIDE MODI (BLEIBT AKTIV) ---
            console.log(
                `DEBUG: openSchool aufgerufen für Schule ID: ${schoolId},` +
                ` Räume zu öffnen: ${rooms_to_open_in_school},` +
                ` Lehrgangswert: ${educationSelectValue},` +
                ` Allianzdauer: ${allianceDurationValue},` +
                ` Kosten: ${cost},` +
                ` Personal-IDs: ${staffToAssign ? staffToAssign.join(', ') : 'Kein Personal'}` // NEU: Personal-IDs im Log
            );
            // --- ENDE DEBUG-LOG ---

            // **ENTSCHEIDUNG:** Echte Anfrage senden oder nur simulieren
            if (SETTING_DEBUG_MODE_NO_FETCH) {
                console.log(`DEBUG: fetch für openSchool unterbunden (SETTING_DEBUG_MODE_NO_FETCH ist true).`);
                return Promise.resolve(new Response(null, { status: 200, headers: { 'X-Simulated-Response': 'true' } }));
            } else {
                // Der tatsächliche fetch-Aufruf, der die Anfrage an den Server sendet
                return fetch(("/buildings/" + schoolId + "/education"), {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    referrer: schoolUrl.href.replace(/\?.*$/, ''),
                    body: schoolUrl.search.replace(/^\?/, ''),
                    method: 'POST',
                    mode: 'cors',
                });
            }
        };

        // fillRoom Funktion ist jetzt überflüssig und wird entfernt
        /*
        var fillRoom = function(schoolingId, staff) {
            // ... (alter Code, jetzt entfernt) ...
        };
        */

        var reqOr100ms = function(req) {
            return Promise.all([req, new Promise(function(r) {
                return setTimeout(r, 1000);
            })]).then(
                function(ref) {
                    var res = ref[0];
                    return res;
                }
            );
        };

        var progressStyle = document.createElement('style');
        document.head.append(progressStyle);
        var setProgressStyle = function(staff) {
            var staffSelector = staff.map(function(s) {
                return ("[value=\"" + s + "\"]");
            }).join(', ');
            progressStyle.textContent = `
             .panel:has(~ .panel .panel-body .schooling_checkbox:where(${staffSelector})) .panel-heading::before {
                 content: "✅";
                 text-align: center;
                 border-radius: .25em;
                 margin-right: 1em;
             }

             .panel-heading:has(+ .panel-body .schooling_checkbox:where(${staffSelector}))::before {
                 content: "⏳️";
                 text-align: center;
                 border-radius: .25em;
                 margin-right: 1em;
             }
             `;
        };

        var currentStateSpan;
        var progressWrapper;
        var progressBar;

        var doTheDurchschloedeln = function() {
            var roomsPlanFromGetRooms = null; // Für Personalmodus
            var roomPlanBySchool = null; // Für Personalmodus
            var totalItemsToProcess = 0;
            var totalStaffCount = 0;
            var schoolsWithPersonnel = 0;
            var emptyRoomsToOpenTotal = 0; // Gesamtanzahl leere Räume über alle Lehrgänge
            var schoolsWithEmptyRooms = 0; // Gesamtanzahl Schulen im Leere-Räume-Modus
            var educationsForConfirmationDialog = [];

            if (allowEmptyCheckbox.checked) {
                educationsForConfirmationDialog = getSelectedEmptyRoomEducations();
                emptyRoomsToOpenTotal = educationsForConfirmationDialog.reduce(function(sum, edu) { return sum + edu.rooms; }, 0);
                totalItemsToProcess = educationsForConfirmationDialog.length; // Lehrgänge sind die "Items"

                // Grobe Schätzung der Schulen, die genutzt werden, für den Bestätigungsdialog.
                schoolsWithEmptyRooms = Math.min(emptyRoomsToOpenTotal, getUsableSchools(schools).length);
                if (emptyRoomsToOpenTotal > 0 && schoolsWithEmptyRooms === 0 && getUsableSchools(schools).length > 0) {
                     schoolsWithEmptyRooms = 1;
                }

            } else { // Modus: Personal ausbilden
                totalStaffCount = document.querySelectorAll('.schooling_checkbox:checked').length;
                var calculatedDesiredRooms = Math.ceil(totalStaffCount / 10);

                // Optionale UI-Aktualisierung des roomsSelection-Dropdowns, NUR für die Anzeige.
                // Die Berechnung selbst wird den direkt berechneten Wert verwenden.
                if (calculatedDesiredRooms === 0) {
                    if (parseInt(roomsSelection.value || '0') !== 0) {
                        roomsSelection.value = '0';
                        roomsSelection.dispatchEvent(new Event('change'));
                    }
                } else if (parseInt(roomsSelection.value || '0') < calculatedDesiredRooms) {
                    roomsSelection.value = calculatedDesiredRooms.toString();
                    roomsSelection.dispatchEvent(new Event('change'));
                }
                console.log('DEBUG (Personalmodus): Berechnete desiredRooms (basierend auf Personal):', calculatedDesiredRooms);


                roomsPlanFromGetRooms = getRoomsPlan(calculatedDesiredRooms); // calculatedDesiredRooms wird als Override übergeben
                if (roomsPlanFromGetRooms === null) {
                    return Promise.resolve(); // Abbruch
                }
                roomPlanBySchool = assignRoomsToSchools(roomsPlanFromGetRooms);
                console.log('DEBUG (Personalmodus): Zugewiesene Räume nach Schule (roomPlanBySchool):', roomPlanBySchool);
                console.log('DEBUG (Personalmodus): Keys of roomPlanBySchool:', Object.keys(roomPlanBySchool || {}));
                console.log('DEBUG (Personalmodus): Length of roomPlanBySchool keys:', Object.keys(roomPlanBySchool || {}).length);
                if (roomPlanBySchool === null) {
                     return Promise.resolve(); // Abbruch
                }
                totalItemsToProcess = Object.keys(roomPlanBySchool).length;
                // totalStaffCount bereits oben berechnet
                schoolsWithPersonnel = totalItemsToProcess;
                educationsForConfirmationDialog.push(getSelectedEducationInfo());
            }

            var educationNameForDisplay = educationsForConfirmationDialog.map(function(e) { return e.name; }).join(', ');
            var durationForDisplay = getTrainingDuration(); // Dauer für den Bestätigungsdialog

            var allianceDurationValue = form['alliance[duration]'].value;
            var cost = form['alliance[cost]'].value;

            // WICHTIG: Die gesamte Abarbeitung des "Durchschlödeln" muss jetzt hier starten.
            // Der Bestätigungsdialog wird in der Schleife für leere Räume aufgerufen.
            // Für den Personalmodus wird er einmalig aufgerufen.

            return Promise.resolve()
                .then(function() {
                    if (abortedDueToMultipleSchools) {
                        alert(multipleSchoolsAlert);
                        return Promise.reject('Aborted due to MultipleSchools script');
                    }

                    if (totalItemsToProcess === 0) {
                        alert("Keine Operation erforderlich. (Nichts ausgewählt oder keine freien Räume)");
                        return Promise.reject('No operation required');
                    }

                    form.querySelectorAll('input, select').forEach(
                        function(input) {
                            return (input.disabled = true);
                        }
                    );
                    form.classList.add(isDurchschloedelingClass);

                    currentStateSpan = document.createElement('span');
                    currentStateSpan.classList.add('label', 'label-warning');
                    currentStateSpan.style.setProperty('font-size', '14px');
                    currentStateSpan.textContent = "0/" + (totalItemsToProcess.toLocaleString()) + " verarbeitet";

                    progressWrapper = document.createElement('div');
                    progressWrapper.classList.add('progress');
                    progressWrapper.style.setProperty('margin-bottom', '0');
                    progressWrapper.style.setProperty('width', '50%');

                    progressBar = document.createElement('div');
                    progressBar.classList.add(
                        'progress-bar',
                        'progress-bar-striped',
                        'active'
                    );
                    progressBar.style.setProperty('width', ("" + (0) + "%"));
                    progressWrapper.append(progressBar);

                    document
                        .querySelector(
                            '.navbar.navbar-fixed-bottom div:has(> input[type=submit])'
                        )
                        .after(currentStateSpan, progressWrapper);

                    var start = Date.now();
                    var processedItemsCounter = 0;

                    var doProgress = function(processedItemName) {
                        processedItemsCounter++;
                        currentStateSpan.textContent = (processedItemsCounter.toLocaleString()) + "/" + (totalItemsToProcess.toLocaleString()) + " verarbeitet [" + processedItemName + "]";
                        var percentage = processedItemsCounter / totalItemsToProcess;
                        progressBar.style.setProperty('width', ("" + (percentage * 100) + "%"));
                        var elapsed = Date.now() - start;
                        var remaining =
                            (elapsed / processedItemsCounter) * (totalItemsToProcess - processedItemsCounter);
                        var endDate = new Date(Date.now() + remaining);
                        progressBar.textContent = [
                            (percentage.toLocaleString('de', {
                                style: 'percent'
                            })),
                            (Math.ceil(remaining / 1000).toLocaleString('de')) + "\xa0s",
                            "ETA: " + (endDate.toLocaleTimeString('de')),
                        ].join(' / ');
                    };

                    // --- NEUE, SEQUENZIELLE LOGIK FÜR LEERE KLASSENZIMMER ÖFFNEN (inkl. Einzelbestätigung) ---
                    if (allowEmptyCheckbox.checked) {
                        var selectedEducationsWithRooms = getSelectedEmptyRoomEducations();

                        // Hier ist der entscheidende Punkt: JEDER ausgewählte Lehrgang wird einzeln mit Bestätigung verarbeitet.
                        return sequentialPromiseProcessor(selectedEducationsWithRooms, function(edu) {
                            if (edu.rooms === 0) return Promise.resolve(); // Lehrgang hat 0 Räume, überspringen

                            // Bestätigungsdialog für DIESEN EINZELNEN LEHRGANG
                            return Promise.resolve()
                                .then(function() {
                                    if (SETTING_SHOW_CONFIRM_DIALOG) {
                                        // Der Bestätigungsdialog zeigt nun nur DIESEN EINEN Lehrgang
                                        return confirmDialog(
                                            edu.name, // Nur der Name dieses Lehrgangs
                                            0, // Keine Personalmenge
                                            0, // Keine Personal-Schulen
                                            edu.duration, // Dauer dieses Lehrgangs
                                            edu.rooms, // Räume für DIESEN Lehrgang
                                            Math.min(edu.rooms, getUsableSchools(schools).length), // Geschätzte Schulen für diesen Lehrgang
                                            parseInt(cost),
                                            (document.querySelector(
                                                ("#alliance_duration option[value=\"" + (form['alliance[duration]'].value) + "\"]")
                                            )?.textContent?.trim() || '')
                                        );
                                    }
                                    return true;
                                })
                                .then(function(modalConfirm) {
                                    if (!modalConfirm) {
                                        return Promise.reject('Aborted by user');
                                    }

                                    var roomsRemainingForThisEducation = edu.rooms;
                                    var schoolsAvailableForAssignment = getUsableSchools(schools).toSorted(function(a,b) { return getFreeRooms(b) - getFreeRooms(a); });

                                    var schoolRequestsForThisEducation = [];
                                    schoolsAvailableForAssignment.forEach(function(school) {
                                        if (roomsRemainingForThisEducation === 0) return;

                                        var freeRoomsInThisSchool = getFreeRooms(school);
                                        if (freeRoomsInThisSchool === 0) return;

                                        var roomsToOpenInCurrentSchool = Math.min(roomsRemainingForThisEducation, freeRoomsInThisSchool);
                                        if (roomsToOpenInCurrentSchool === 0) return;

                                        roomsRemainingForThisEducation -= roomsToOpenInCurrentSchool;

                                        schoolRequestsForThisEducation.push(
                                            reqOr100ms(
                                                openSchool(
                                                    school.id,
                                                    roomsToOpenInCurrentSchool,
                                                    edu.fullValue,
                                                    allianceDurationValue,
                                                    cost
                                                )
                                            )
                                                .then(function(res) {
                                                    // Lokale Aktualisierung des Schulstatus, damit getFreeRooms korrekt bleibt
                                                    var schoolInArray = schools.find(function(s) { return s.id === school.id; });
                                                    if (schoolInArray) {
                                                        if (!schoolInArray.schoolings) {
                                                            schoolInArray.schoolings = [];
                                                        }
                                                        for (var i = 0; i < roomsToOpenInCurrentSchool; i++) {
                                                            schoolInArray.schoolings.push(undefined);
                                                        }
                                                    }
                                                    return res;
                                                })
                                        );
                                    });
                                    // Verarbeite alle Requests für DIESEN EINZELNEN LEHRGANG sequentiell
                                    return sequentialPromiseProcessor(schoolRequestsForThisEducation, function(p) { return p; })
                                        .then(function() {
                                            doProgress(edu.name); // Fortschritt für DIESEN Lehrgang aktualisieren
                                        });
                                });
                        })
                            .then(function() { // Wenn alle Lehrgänge erfolgreich abgearbeitet wurden
                                currentStateSpan.classList.replace(
                                    'label-warning',
                                    'label-success'
                                );
                                currentStateSpan.textContent = "Alle simulierten leeren Räume erfolgreich geöffnet! \ud83d\ude0a"; // Angepasste Erfolgsmeldung
                                setTimeout(function() {
                                    window.location.reload();
                                }, 2000);
                            });

                    } else { // Modus: Personal ausbilden
                        totalStaffCount = document.querySelectorAll('.schooling_checkbox:checked').length;
                        var calculatedDesiredRooms = Math.ceil(totalStaffCount / 10);

                        // Optionale UI-Aktualisierung des roomsSelection-Dropdowns, NUR für die Anzeige.
                        // Die Berechnung selbst wird den direkt berechneten Wert verwenden.
                        if (calculatedDesiredRooms === 0) {
                            if (parseInt(roomsSelection.value || '0') !== 0) {
                                roomsSelection.value = '0';
                                roomsSelection.dispatchEvent(new Event('change'));
                            }
                        } else if (parseInt(roomsSelection.value || '0') < calculatedDesiredRooms) {
                            roomsSelection.value = calculatedDesiredRooms.toString();
                            roomsSelection.dispatchEvent(new Event('change'));
                        }
                        console.log('DEBUG (Personalmodus): Berechnete desiredRooms (basierend auf Personal):', calculatedDesiredRooms);


                        roomsPlanFromGetRooms = getRoomsPlan(calculatedDesiredRooms); // calculatedDesiredRooms wird als Override übergeben
                        if (roomsPlanFromGetRooms === null) {
                            return Promise.resolve(); // Abbruch
                        }
                        roomPlanBySchool = assignRoomsToSchools(roomsPlanFromGetRooms);
                        console.log('DEBUG (Personalmodus): Zugewiesene Räume nach Schule (roomPlanBySchool):', roomPlanBySchool);
                        console.log('DEBUG (Personalmodus): Keys of roomPlanBySchool:', Object.keys(roomPlanBySchool || {}));
                        console.log('DEBUG (Personalmodus): Length of roomPlanBySchool keys:', Object.keys(roomPlanBySchool || {}).length);
                        if (roomPlanBySchool === null) {
                             return Promise.resolve(); // Abbruch
                        }
                        totalItemsToProcess = Object.keys(roomPlanBySchool).length;
                        // totalStaffCount bereits oben berechnet
                        schoolsWithPersonnel = totalItemsToProcess;
                        educationsForConfirmationDialog.push(getSelectedEducationInfo());

                        return Promise.resolve()
                           .then(function() {
                                if (SETTING_SHOW_CONFIRM_DIALOG) {
                                    return confirmDialog(
                                        educationNameForDisplay,
                                        totalStaffCount,
                                        schoolsWithPersonnel, // Hier wird die korrigierte Anzahl der Schulen verwendet
                                        durationForDisplay,
                                        0,
                                        0,
                                        parseInt(cost),
                                        (document.querySelector(
                                            ("#alliance_duration option[value=\"" + (form['alliance[duration]'].value) + "\"]")
                                        )?.textContent?.trim() || '')
                                    );
                                }
                                return true;
                           })
                           .then(function(modalConfirm) {
                                if (!modalConfirm) {
                                    return Promise.reject('Aborted by user');
                                }

                                var personalSchoolProcessingPromises = [];
                                Object.entries(roomPlanBySchool).forEach(function(ref) {
                                    var schoolId = ref[0];
                                    var roomsForSchool = ref[1]; // Ein Array von { education: string, staff: string[] } für diese Schule

                                    // Finden Sie das aktuelle Schulobjekt explizit, um es im then-Block zu verwenden
                                    const currentSchoolObject = schools.find(s => s.id.toString() === schoolId);
                                    if (!currentSchoolObject) {
                                        console.error(`ERROR: School object not found for ID ${schoolId}. Skipping.`);
                                        return; // Überspringen, wenn Schulobjekt nicht gefunden wird
                                    }

                                    // Jeder "Raum" im roomsForSchool-Array repräsentiert eine Einheit von bis zu 10 Personal
                                    // mit zugehörigem Lehrgang und Personal-IDs.
                                    roomsForSchool.forEach(function(roomInfo) {
                                        personalSchoolProcessingPromises.push(
                                            reqOr100ms(
                                                openSchool( // openSchool wird jetzt mit dem Personal aufgerufen
                                                    currentSchoolObject.id, // ID der Schule
                                                    1, // Immer 1 Raum pro "roomInfo" Objekt (da jede roomInfo 10 Personal repräsentiert)
                                                    roomInfo.education, // Der Lehrgang für diesen Raum
                                                    allianceDurationValue,
                                                    cost,
                                                    roomInfo.staff // Das Personal für diesen spezifischen Raum
                                                )
                                            )
                                                .then(function(res) {
                                                    // Lokale Aktualisierung des Schulstatus für das gefundene Schulobjekt
                                                    if (!currentSchoolObject.schoolings) {
                                                        currentSchoolObject.schoolings = [];
                                                    }
                                                    currentSchoolObject.schoolings.push(undefined); // Nur 1 Raum pro roomInfo

                                                    // Hier ist keine schoolingId-Parsing mehr nötig, da personal_ids direkt gesendet werden
                                                    console.log('DEBUG (Personalmodus): openSchool erfolgreich für Raum mit Personal. Personal-IDs wurden mit dem Open-Request gesendet.');
                                                    return res;
                                                })
                                        );
                                    });
                                });
                                return sequentialPromiseProcessor(personalSchoolProcessingPromises, function(p) { return p; })
                                    .then(function() {
                                        currentStateSpan.classList.replace(
                                            'label-warning',
                                            'label-success'
                                        );
                                        currentStateSpan.textContent = (totalItemsToProcess.toLocaleString()) + " simulierte Schulen erfolgreich gefüllt! \ud83d\ude0a"; // Angepasste Erfolgsmeldung

                                        setTimeout(function() {
                                            window.location.reload();
                                        }, 2000);
                                    });
                           });
                    }
                })
                .catch(function(error) {
                    if (error !== 'Aborted by user' && error !== 'No operation required' && error !== 'Personal assignment failed') {
                        console.error("Ein Fehler ist während der Ausbildung aufgetreten:", error);
                        if (currentStateSpan) {
                             currentStateSpan.classList.replace('label-warning', 'label-danger');
                             currentStateSpan.textContent = "Fehler: " + (error.message || error.toString());
                        }
                        alert("Es ist ein Fehler aufgetreten: " + (error.message || error.toString()) + ". Bitte versuchen Sie es erneut oder kontaktieren Sie den Script-Autor.");
                        window.location.reload();
                    } else if (error === 'No operation required' || error === 'Personal assignment failed') {
                         window.location.reload();
                    }
                });
        };

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            doTheDurchschloedeln();
        });
    })
    .finally(function() {
        spinner.remove();
        updateSelectStyle();

        updateEducationSelectionUI();

        var initialEducationInfo = getSelectedEducationInfo();
        if (initialEducationInfo.key) {
            unsafeWindow.schooling_disable(initialEducationInfo.key);
            unsafeWindow.schooling_check_educated_counter(initialEducationInfo.duration.toString());
            unsafeWindow.update_personnel_counter_navbar();
        }

        var educationSelectElement = document.getElementById('education_select');
        if (educationSelectElement) {
            educationSelectElement.addEventListener('change', function() {
                var currentEducationInfo = getSelectedEducationInfo();
                if (currentEducationInfo.key) {
                    unsafeWindow.schooling_disable(currentEducationInfo.key);
                    unsafeWindow.schooling_check_educated_counter(currentEducationInfo.duration.toString());
                    unsafeWindow.update_personnel_counter_navbar();
                } else {
                    document.querySelectorAll('.schooling_checkbox').forEach(function(checkbox) {
                        checkbox.disabled = false;
                    });
                    unsafeWindow.update_personnel_counter_navbar();
                }
                updateEducationSelectionUI();
            });
            educationSelectElement.dispatchEvent(new Event('change'));
        }
    });

// Polyfill für Array.prototype.toSorted
if (!Array.prototype.toSorted) {
    Array.prototype.toSorted = function(compareFn) {
        return Array.prototype.slice.call(this).sort(compareFn);
    };
}
