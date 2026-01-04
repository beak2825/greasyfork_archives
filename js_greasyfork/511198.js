// ==UserScript==
// @name         Das Tool Tool
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Handles the process for language course signup with persistent course selection
// @author       ricardofauch
// @match        https://tool.uni-leipzig.de/einschreibung/bookings/*
// @match        https://tool.uni-leipzig.de/einschreibung/info/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511198/Das%20Tool%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/511198/Das%20Tool%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = GM_getValue('isEnabled', false);
    let autoReload = GM_getValue('autoReload', true);
    let targetCourse = GM_getValue('targetCourse', '');
    const RELOAD_INTERVAL = 1000; // Reload every 1 second
    let intervalId = null;

    // Add styles
    GM_addStyle(`
        #courseSignupControl {
            position: fixed;
            top: 40%;
            left: 10px;
            background: rgba(255, 203, 207, 0.8);
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            width: 180px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            border-radius: 10px;
        }
        #courseSignupControl h3 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .text{
        margin: 5px 5px 5px 0;
        }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
            margin-right: 5px;
        }
        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 20px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #2196F3;
        }
        input:checked + .slider:before {
            transform: translateX(20px);
        }
        .control-group {
            margin-bottom: 5px;
        }
        .labelsprachkurs{
            margin-bottom: 10px;
        }
        #courseSelect {
            width: 100%;
            box-sizing: border-box;
            margin-top: 5px;
            margin-bottom: 10px;
        }
        #status {
            margin-top: 10px;
            font-size: 11px;
            color: red;
        }
    `);
    // Add this function to handle course changes
    function handleCourseChange(newCourse) {
        console.log('Course changed to:', newCourse);
        targetCourse = newCourse;
        GM_setValue('targetCourse', targetCourse);
        if (isEnabled){
            // Navigate back to the course selection page
            if (window.location.href !== 'https://tool.uni-leipzig.de/einschreibung/bookings/course') {
                console.log('Navigating to course selection page');
                window.location.href = 'https://tool.uni-leipzig.de/einschreibung/bookings/course';
            } else {
                console.log('Already on course selection page, running checkAndSelect');
                checkAndSelect();
            }
        }
    }
    // Create UI (updated to set the selected course)
    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'courseSignupControl';
        controlPanel.innerHTML = `
            <h3>Das Tool Tool</h3>
            <p class="text">1. Wähle einen Sprachkurs aus dem Dropdown-Menü aus.</p>
                 <p class="text">2. Aktiviere das Skript</p>
            <p class="text labelsprachkurs" >Die Seite wird dann für dich einmal pro Sekunde aktualisiert und sobald die Einschreibung freigeschaltet ist wirst du automatisch bis zur finalen Terminwahl weitergeleitet.</p>
            <div class="control-group">
                <label for="courseSelect">Sprachkurs:</label>
                <select id="courseSelect">
                    <option value="">Wähle einen Sprachkurs</option>
                    <option value="Grundkurs Altgriechisch">Grundkurs Altgriechisch</option>
                    <option value="Arabisch A2.1">Arabisch A2.1</option>
                    <option value="Autonomes Sprachenlernen">Autonomes Sprachenlernen</option>
                    <option value="Bosnisch Kroatisch Serbisch A2">Bosnisch Kroatisch Serbisch A2</option>
                    <option value="Brasilianisches Portugiesisch B1">Brasilianisches Portugiesisch B1</option>
                    <option value="Fachübergreifendes Englisch B2">Fachübergreifendes Englisch B2</option>
                    <option value="Englisch für Geowissenschaften B2">Englisch für Geowissenschaften B2</option>
                    <option value="Englisch für Geistes- und Sozialwissenschaften B2">Englisch für Geistes- und Sozialwissenschaften B2</option>
                    <option value="Englisch für Geistes- und Sozialwissenschaften C1">Englisch für Geistes- und Sozialwissenschaften C1</option>
                    <option value="Englisch in der Wirtschaft B2">Englisch in der Wirtschaft B2</option>
                    <option value="Englisch in der Wirtschaft C1">Englisch in der Wirtschaft C1</option>
                    <option value="Französisch A2">Französisch A2</option>
                    <option value="Französisch B1">Französisch B1</option>
                    <option value="Französisch B2">Französisch B2</option>
                    <option value="Französisch C1">Französisch C1</option>
                    <option value="Italienisch A2">Italienisch A2</option>
                    <option value="Italienisch B1">Italienisch B1</option>
                    <option value="Italienisch B2">Italienisch B2</option>
                    <option value="Grundkurs Latein">Grundkurs Latein</option>
                    <option value="Lateinkenntnisse">Lateinkenntnisse</option>
                    <option value="Latinum">Latinum</option>
                    <option value="Norwegisch B1">Norwegisch B1</option>
                    <option value="Polnisch A1">Polnisch A1</option>
                    <option value="Polnisch A2">Polnisch A2</option>
                    <option value="Russisch A1">Russisch A1</option>
                    <option value="Russisch A2">Russisch A2</option>
                    <option value="Russisch B1 für Fremdsprachenlernende">Russisch B1 für Fremdsprachenlernende</option>
                    <option value="Russisch B2.1">Russisch B2.1</option>
                    <option value="Spanisch A2">Spanisch A2</option>
                    <option value="Spanisch B1">Spanisch B1</option>
                    <option value="Spanisch B2">Spanisch B2</option>
                    <option value="Spanisch C1">Spanisch C1</option>
                    <option value="Sprachenlernen im Tandem">Sprachenlernen im Tandem</option>
                    <option value="Polnisch B2.1">Polnisch B2.1</option>
                    <option value="Polnisch B1.1">Polnisch B1.1</option>
                    <option value="Russisch B2.2 für Fremdsprachenlernende">Russisch B2.2 für Fremdsprachenlernende</option>
                    <option value="Russisch B1 für Herkunftssprechende">Russisch B1 für Herkunftssprechende</option>
                    <option value="Tschechisch B2.1">Tschechisch B2.1</option>
                    <option value="Tschechisch B1.1">Tschechisch B1.1</option>
                    <option value="Tschechisch A1">Tschechisch A1</option>
                    <option value="Sprache und Kommunikation IIa (Obersorbisch)">Sprache und Kommunikation IIa (Obersorbisch)</option>
                    <option value="Sprache und Kommunikation IIb (Niedersorbisch)">Sprache und Kommunikation IIb (Niedersorbisch)</option>
                    <option value="Keltische Studien I">Keltische Studien I</option>
                    <option value="Keltische Studien III">Keltische Studien III</option>
                    <option value="Irisch im 21. Jahrhundert">Irisch im 21. Jahrhundert</option>
                    <option value="Basiskenntnisse Obersorbisch">Basiskenntnisse Obersorbisch</option>
                    <option value="Basiskenntnisse Niedersorbisch">Basiskenntnisse Niedersorbisch</option>
                    <option value="Aktivierungskurs Obersorbisch I">Aktivierungskurs Obersorbisch I</option>
                 </select>
                 <div class="control-group">
                <label class="toggle-switch">
                    <input type="checkbox" id="enableAutoReload" ${autoReload ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <label for="enableAutoReload">Auto-Reload</label>
                </div>
                 <div class="control-group">
                <label class="toggle-switch">
                    <input type="checkbox" id="enableScript" ${isEnabled ? 'checked' : ''}>
                    <span class="slider"></span>
                </label>
                <label for="enableScript">Skript aktivieren</label>
                </div>
                 <div id="status"></div>
               </div>

        `;
        document.body.appendChild(controlPanel);

        // Set the selected course
        document.getElementById('courseSelect').value = targetCourse || "";

        // Event listeners
        document.getElementById('enableScript').addEventListener('change', (e) => {
            isEnabled = e.target.checked;
            GM_setValue('isEnabled', isEnabled);
            if (isEnabled) {
                startScript();
            } else {
                console.log('Stopped, because Toggle Switch got deactivated');
                stopScript();
            }
        });

        document.getElementById('enableAutoReload').addEventListener('change', (e) => {
            autoReload = e.target.checked;
            GM_setValue('autoReload', autoReload);
        });

        document.getElementById('courseSelect').addEventListener('change', (e) => {
            const newCourse = e.target.value;
            handleCourseChange(newCourse);
        });
    }

    function selectSprachenzentrum() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        for (let radio of radioButtons) {
            const label = radio.nextElementSibling;
            if (label && label.textContent.includes('Sprachenmodule des Sprachenzentrums')) {
                if (!radio.disabled) {
                    radio.click();
                    return true;
                }
                return false;
            }
        }
        return false;
    }

    function selectLanguageModule() {
        console.log('Starting selectLanguageModule function');
        console.log('Target course:', targetCourse);

        const rows = document.querySelectorAll('table tbody tr');
        console.log('Found', rows.length, 'rows in the table');

        // Uncheck all checkboxes first
        rows.forEach((row, index) => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                console.log('Unchecking previously selected course in row', index + 1);
                checkbox.click();
            }
        });

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            console.log('Checking row', i + 1);

            const courseTitleCell = row.querySelector('td:nth-child(3)');

            if (courseTitleCell) {
                const courseTitle = courseTitleCell.textContent.trim();
                console.log('Row', i + 1, 'Course Title:', courseTitle);

                if (courseTitle.includes(targetCourse)) {
                    console.log('Found matching course in row', i + 1);

                    const checkbox = row.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        console.log('Checkbox found. Disabled:', checkbox.disabled, 'Checked:', checkbox.checked);

                        if (checkbox.disabled) {
                            console.log('Target course checkbox is disabled. Stopping the script.');
                            checkbox.scrollIntoView({ behavior: "smooth", block: "center"});
                            stopScript();
                            updateStatus('Kurs ist ausgebucht!');
                            return false;
                        }

                        if (!checkbox.checked) {
                            console.log('Clicking checkbox');
                            checkbox.click();
                        } else {
                            console.log('Checkbox already checked');
                        }
                        console.log('Course selected successfully');
                        return true;
                    } else {
                        console.log('No checkbox found in this row');
                    }
                }
            } else {
                console.log('Row', i + 1, 'is missing course title cell');
            }
        }

        console.log('No matching course found or all matching courses are unavailable');
        return false;
    }

    function updateStatus(message) {
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = message;
        } else {
            console.log('Status update:', message);
        }
    }

    function clickWeiter() {
        const weiterButton = document.querySelector('input[type="submit"][value="Weiter"]');
        if (weiterButton) {
            weiterButton.click();
            return true;
        }
        return false;
    }
    function areAllCheckboxesChecked() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        return Array.from(checkboxes).every(checkbox => checkbox.checked);
    }

    function checkAndSelect() {
        if (!isEnabled) return false;

        if (window.location.href.includes('/bookings/group')) {
            if (selectSprachenzentrum()) {
                return clickWeiter();
            }
        } else if (window.location.href.includes('/bookings/course')) {
            if (selectLanguageModule()) {
                if (clickWeiter()) {
                    console.log('Successfully selected language module and clicked "Weiter"');
                    return true;
                } else {
                    console.log('Selected language module but failed to click "Weiter"');
                    return false;
                }
            } else {
                console.log('Language Course not found or fully booked');
                stopScript();
                return false;
            }
        } else if (window.location.href.includes('/bookings/details')) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            if (areAllCheckboxesChecked()){
                console.log('All Checkboxes checked!');
                const speichernButton = document.querySelector('input[type="submit"][value="Speichern"]');
                if (speichernButton) {
                    speichernButton.click();
                }
            }
            return true;
        } else if (window.location.href.includes('/info/')) {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            console.log('Info Page reached. Stopping');
            return true;
        }
        return false;
    }

    function reloadAndCheck() {
        if (isEnabled) {
            if (!checkAndSelect() && autoReload && window.location.href.includes('/bookings/group')) {
                console.log('Target not available. Reloading in 1 second...');
                setTimeout(() => {
                    location.reload();
                }, RELOAD_INTERVAL);
            }
        }
    }

    function startScript() {
        console.log('Starting script');
        if (window.location.href.includes('/info/')){
            window.location.href = 'https://tool.uni-leipzig.de/einschreibung/bookings/group';
            }
        if (!intervalId) {
            intervalId = setInterval(reloadAndCheck, RELOAD_INTERVAL);
            reloadAndCheck(); // Run once immediately
        }
    }

    function stopScript() {
        console.log('Stopping script');
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isEnabled = false;
        GM_setValue('isEnabled', false);
        const enableScriptCheckbox = document.getElementById('enableScript');
        if (enableScriptCheckbox) {
            enableScriptCheckbox.checked = false;
        }
    }

    createControlPanel();
    if (isEnabled && window.location.href.includes('/bookings/')) {
        console.log('Script is enabled, starting automatically');
        startScript();
    }
    if (isEnabled && window.location.href.includes('/info/')) {
        console.log('Scrolling down!')
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        stopScript();
    }
})();