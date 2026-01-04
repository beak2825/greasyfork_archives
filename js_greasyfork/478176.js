// ==UserScript==
// @name         Hochschulsport Windhundskript
// @namespace    http://tampermonkey.net/
// @version      2.3.5
// @description  AutoFill mit Benutzereingabe für das Anmeldeformular des Universitätssportprogramms
// @author       ricardofauch
// @match        https://hochschulsport.uni-leipzig.de/angebote/*
// @match        https://hochschulsport.uni-leipzig.de/cgi/anmeldung.fcgi
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478176/Hochschulsport%20Windhundskript.user.js
// @updateURL https://update.greasyfork.org/scripts/478176/Hochschulsport%20Windhundskript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add styles using GM_addStyle
    GM_addStyle(`
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
        .toggle-switch .slider {
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
        .toggle-switch .slider:before {
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
        .toggle-switch input:checked + .slider {
            background-color: #2196F3;
        }
        .toggle-switch input:checked + .slider:before {
            transform: translateX(20px);
        }
        .captcha-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ff9800;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            max-width: 400px;
        }
        .captcha-highlight {
            box-shadow: 0 0 15px 5px #ff9800 !important;
            border: 3px solid #ff9800 !important;
            animation: captcha-pulse 2s infinite;
        }
        @keyframes captcha-pulse {
            0% { box-shadow: 0 0 15px 5px #ff9800; }
            50% { box-shadow: 0 0 25px 8px #ff6600; }
            100% { box-shadow: 0 0 15px 5px #ff9800; }
        }
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .welcome-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10001;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        }
        .welcome-message {
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
        }
        .welcome-arrow {
            position: absolute;
            top: -15px;
            right: 20px;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid #4CAF50;
            animation: bounce 2s infinite;
        }
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .update-button-highlight {
            animation: button-pulse 2s infinite;
            box-shadow: 0 0 20px 5px rgba(76, 175, 80, 0.6) !important;
        }
        @keyframes button-pulse {
            0% { box-shadow: 0 0 20px 5px rgba(76, 175, 80, 0.6); }
            50% { box-shadow: 0 0 30px 8px rgba(76, 175, 80, 0.8); }
            100% { box-shadow: 0 0 20px 5px rgba(76, 175, 80, 0.6); }
        }
        .emergency-stop {
            position: fixed;
            top: 35%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 10002;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
            animation: emergency-pulse 1.5s infinite;
            font-family: Arial, sans-serif;
        }
        .emergency-stop:hover {
            background-color: #c82333;
            transform: translate(-50%, -50%) scale(1.05);
        }
        @keyframes emergency-pulse {
            0% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
            50% { box-shadow: 0 4px 25px rgba(220, 53, 69, 0.8); }
            100% { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4); }
        }
    `);

    // Function to create and show the input form
    function showInputForm() {
        const savedUserData = JSON.parse(GM_getValue('userData', '{}'));
        const formHtml = `
            <div id="userInputForm" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 20px; border-radius: 10px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;">
                    <h2 style="margin-top: 0; color: #333; font-size: 1.5em; text-align: center;">Das Hochschulsport Windhundskript</h2>
                    <div style="margin-bottom: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; font-size: 0.9em;">
                    <h3 style="margin-top: 0; color: #333;">Erklärung zum Formular und Skript</h3>
                    <p>
                    Dieses Formular dient dazu, deine persönlichen Daten für die Anmeldung zum Hochschulsport zu speichern.
                    Das zugehörige Skript wird diese Informationen automatisch in das offizielle Anmeldeformular eintragen,
                    um den Anmeldeprozess zu beschleunigen.
                    </p>
                    <details>
                        <summary style="margin-left: 10px; color: grey; cursor: pointer">mehr Infos</summary>
                        <p>
                        Bitte fülle alle Felder sorgfältig aus. Deine Daten werden lokal in deinem Browser gespeichert und
                        können jederzeit aktualisiert werden. Das Skript verwendet diese Daten nur für die Anmeldung zum
                        Hochschulsport und überträgt sie nicht an Dritte.
                        </p>
                        <p>
                        Nach dem Speichern deiner Daten kannst du zur Anmeldeseite des Hochschulsports navigieren.
                        Das Skript wird automatisch deine gespeicherten Informationen in das Formular eintragen.
                        </p>
                        <p>
                        Falls du die Daten zu einem späteren Zeitpunkt aktualisieren möchtest, kannst du jederzeit auf den Button
                        "Persönliche Daten aktualisieren" klicken, der sich oben rechts auf der Hochschulsport-Angeboteseite befindet.
                        </p>
                        <p>
                        Wenn du die automatische Absendung aktiviert hast, wird während des Vorgangs eine kleine Benachrichtigung angezeigt.
                        Bitte warte, bis diese verschwindet, und interagiere nicht mit der Seite, um eine erfolgreiche Anmeldung zu gewährleisten.
                        </p>
                        </details>
                    </div>
                    <form id="dataForm" style="display: grid; gap: 15px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <label style="display: flex; flex-direction: column;">
                                <span style="font-size: 0.9em; color: #555;">Geschlecht:</span>
                                <select name="geschlecht" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                    <option value="M" ${savedUserData.geschlecht === 'M' ? 'selected' : ''}>Männlich</option>
                                    <option value="W" ${savedUserData.geschlecht === 'W' ? 'selected' : ''}>Weiblich</option>
                                    <option value="D" ${savedUserData.geschlecht === 'D' ? 'selected' : ''}>Divers</option>
                                    <option value="X" ${savedUserData.geschlecht === 'X' ? 'selected' : ''}>Keine Angabe</option>
                                </select>
                            </label>
                            <label style="display: flex; flex-direction: column;">
                                <span style="font-size: 0.9em; color: #555;">Geburtsdatum:</span>
                                <input type="date" name="geburtsdatum" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.geburtsdatum || ''}">
                            </label>
                        </div>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Vorname:</span>
                            <input type="text" name="vorname" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.vorname || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Nachname:</span>
                            <input type="text" name="familienname" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.familienname || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Straße und Hausnummer:</span>
                            <input type="text" name="straßennameundnr" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.straßennameundnr || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">PLZ und Ort:</span>
                            <input type="text" name="plzort" required
                                   pattern="^(?=.*\\d{5})(?=.*[a-zA-ZäöüÄÖÜß]{2,}).*$"
                                   title="Bitte geben Sie eine 5-stellige PLZ und mindestens 2 Buchstaben für den Ort ein (z.B. 04109 Leipzig)"
                                   placeholder="z.B. 04109 Leipzig"
                                   style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                                   value="${savedUserData.plzort || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Matrikel-Nr.:</span>
                            <input type="text" name="matrikelnr" required
                                   pattern="^\\d{5,8}$"
                                   title="Bitte geben Sie eine 5-8 stellige Matrikelnummer ein (nur Zahlen)"
                                   placeholder="z.B. 1234567"
                                   maxlength="8"
                                   style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
                                   value="${savedUserData.matrikelnr || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">E-Mail:</span>
                            <input type="email" name="mail" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.mail || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Telefonnummer:</span>
                            <input type="tel" name="phone" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.phone || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">IBAN:</span>
                            <input type="text" name="iban" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" value="${savedUserData.iban || ''}">
                        </label>
                        <label style="display: flex; flex-direction: column;">
                            <span style="font-size: 0.9em; color: #555;">Status:</span>
                            <select name="status" required style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                                <option value="S-UNIL" ${savedUserData.status === 'S-UNIL' ? 'selected' : ''}>StudentIn der Universität Leipzig</option>
                                <option value="S-HGB" ${savedUserData.status === 'S-HGB' ? 'selected' : ''}>StudentIn der HGB</option>
                                <option value="S-HfMT" ${savedUserData.status === 'S-HfMT' ? 'selected' : ''}>StudentIn der HfMT</option>
                                <option value="S-HTWK" ${savedUserData.status === 'S-HTWK' ? 'selected' : ''}>StudentIn der HTWK</option>
                                <option value="S-MPI" ${savedUserData.status === 'S-MPI' ? 'selected' : ''}>StudentIn der MPI</option>
                                <option value="S-Med" ${savedUserData.status === 'S-Med' ? 'selected' : ''}>StudentIn der Medizinischen Fakultät</option>
                                <option value="S-UNIJ" ${savedUserData.status === 'S-UNIJ' ? 'selected' : ''}>StudentIn der Universität Jena</option>
                                <option value="S-UNIH" ${savedUserData.status === 'S-UNIH' ? 'selected' : ''}>StudentIn der Universität Halle</option>
                                <option value="B-UNIL" ${savedUserData.status === 'B-UNIL' ? 'selected' : ''}>Beschäftigte/r der Universität Leipzig</option>
                                <option value="Azubi-UL" ${savedUserData.status === 'Azubi-UL' ? 'selected' : ''}>Auszubildende/r an der Universität Leipzig</option>
                                <option value="Extern" ${savedUserData.status === 'Extern' ? 'selected' : ''}>Externe/r</option>
                                <option value="S-Kind" ${savedUserData.status === 'S-Kind' ? 'selected' : ''}>Kinder von Studierenden</option>
                                <option value="B-Kind" ${savedUserData.status === 'B-Kind' ? 'selected' : ''}>Kinder von Beschäftigten</option>
                                <option value="Ext-Kind" ${savedUserData.status === 'Ext-Kind' ? 'selected' : ''}>Kinder von Externen</option>
                                <option value="B-UNIH" ${savedUserData.status === 'B-UNIH' ? 'selected' : ''}>Beschäftigte/r der Universität Halle</option>
                                <option value="B-UNIJ" ${savedUserData.status === 'B-UNIJ' ? 'selected' : ''}>Beschäftigte/r der Universität Jena</option>
                                <option value="B-MPI" ${savedUserData.status === 'B-MPI' ? 'selected' : ''}>Beschäftigte/r des MPI</option>
                                <option value="B-HGB" ${savedUserData.status === 'B-HGB' ? 'selected' : ''}>Beschäftigte/r der HGB</option>
                                <option value="B-HfMT" ${savedUserData.status === 'B-HfMT' ? 'selected' : ''}>Beschäftigte/r der HfMT</option>
                                <option value="B-HTWK" ${savedUserData.status === 'B-HTWK' ? 'selected' : ''}>Beschäftigte/r der HTWK</option>
                                <option value="B-SDI" ${savedUserData.status === 'B-SDI' ? 'selected' : ''}>Beschäftigte/r am Simon-Dubnow-Institut</option>
                            </select>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" name="autoSubmit" ${savedUserData.autoSubmit !== false ? 'checked' : ''}>
                            <span style="font-size: 0.9em; color: #555;">Submit-Buttons automatisch klicken</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" name="autoRefresh" ${savedUserData.autoRefresh === true ? 'checked' : ''}>
                            <span style="font-size: 0.9em; color: #555;">Auto-Refresh aktivieren</span>
                        </label>
                        <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;">Speichern</button>
                    </form>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', formHtml);
        // Add event listener to close the form when clicking outside
        document.getElementById('userInputForm').addEventListener('click', function(e) {
            if (e.target === this) {
                this.remove();
            }
        });

        document.getElementById('dataForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            data.autoSubmit = formData.get('autoSubmit') === 'on';
            data.autoRefresh = formData.get('autoRefresh') === 'on';
            GM_setValue('userData', JSON.stringify(data));
            document.getElementById('userInputForm').remove();
            updateUI(data);
            updateToggleSwitch(); // Add this line to update the toggle switch
        });
    }
    function updateToggleSwitch() {
        const userData = JSON.parse(GM_getValue('userData', '{}'));
        const toggleSwitch = document.getElementById('autoRefreshToggle');
        if (toggleSwitch) {
            toggleSwitch.checked = userData.autoRefresh === true;
        } else {
        }
    }
    function toggleAutoRefresh() {
        const userData = JSON.parse(GM_getValue('userData', '{}'));
        userData.autoRefresh = !userData.autoRefresh;
        GM_setValue('userData', JSON.stringify(userData));
        const toggleSwitch = document.getElementById('autoRefreshToggle');
        if (userData.autoRefresh) {
            toggleSwitch.checked = true;
            checkAndAutoRefresh();
        } else {
            toggleSwitch.checked = false;
        }
    }
    function checkAndAutoRefresh() {
        const userData = JSON.parse(GM_getValue('userData', '{}'));
        if (userData.autoRefresh && window.location.href.includes('.html')) {
            const bsBuchElements = document.querySelectorAll('.bs_btn_buchen');
            if (bsBuchElements.length != 0){
                if (bsBuchElements.length === 1) {
                    const inputElement = bsBuchElements[0]
                    if (inputElement) {
                        if (inputElement.value === 'buchen' || inputElement.value === 'Buchen') {
                            inputElement.click();
                        } else {
                            setTimeout(() => {
                                location.reload();
                            }, 1500);
                        }
                    } else {
                    }
                } else {
                }
            } else {
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        } else {
        }
    }

    // Global variable to track if script should stop
    let emergencyStop = false;

    // Function to show emergency stop button
    function showEmergencyStop() {
        // Don't show if already exists
        if (document.getElementById('emergencyStopButton')) return;

        const stopButton = document.createElement('button');
        stopButton.id = 'emergencyStopButton';
        stopButton.className = 'emergency-stop';
        stopButton.textContent = '🛑 STOPP';
        stopButton.title = 'Automatischen Vorgang stoppen';

        stopButton.addEventListener('click', function() {
            emergencyStop = true;
            stopButton.remove();

            // Remove progress overlay if exists
            const overlay = document.getElementById('autoSubmitOverlay');
            if (overlay) overlay.remove();

            // Show notification that script was stopped
            showStopNotification();
        });

        document.body.appendChild(stopButton);
    }

    // Function to hide emergency stop button
    function hideEmergencyStop() {
        const stopButton = document.getElementById('emergencyStopButton');
        if (stopButton) stopButton.remove();
    }

    // Function to show stop notification
    function showStopNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #dc3545;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
        `;
        notification.innerHTML = `
            <h3 style="margin: 0 0 10px;">⛔ Automatischer Vorgang gestoppt!</h3>
            <p style="margin: 0; font-size: 14px;">Du kannst nun manuell fortfahren.</p>
        `;
        document.body.appendChild(notification);

        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Function to check if emergency stop was triggered
    function isEmergencyStopped() {
        return emergencyStop;
    }
    function showWelcomeMessage() {
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.id = 'welcomeOverlay';

        const message = document.createElement('div');
        message.className = 'welcome-message';

        message.innerHTML += `
            <h2 style="color: #4CAF50; margin-top: 0;">Willkommen beim Hochschulsport Windhundskript! 🎯</h2>
            <p style="color: #333; font-size: 16px; line-height: 1.5;">
                Um das Skript zu nutzen, trage zu aller erst deine persönlichen Daten ein.
            </p>
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                Klicke irgendwo oder drücke eine Taste, um diese Nachricht zu schließen.
            </p>
        `;

        overlay.appendChild(message);
        document.body.appendChild(overlay);

        // Add event listeners to close the message
        const closeWelcome = () => {
            overlay.remove();
            // Mark that user has seen the welcome message
            GM_setValue('hasSeenWelcome', 'true');
            // Remove highlight from button
            const updateButton = document.querySelector('button');
            if (updateButton && updateButton.textContent.includes('Persönliche Daten aktualisieren')) {
                updateButton.classList.remove('update-button-highlight');
            }
        };

        // Close on click anywhere
        overlay.addEventListener('click', closeWelcome);

        // Close on any key press
        document.addEventListener('keydown', function handleKeydown(e) {
            closeWelcome();
            document.removeEventListener('keydown', handleKeydown);
        });
    }

    // Function to check if user is first-time and show welcome
    function checkFirstTimeUser() {
        const hasSeenWelcome = GM_getValue('hasSeenWelcome', 'false');
        const userData = JSON.parse(GM_getValue('userData', '{}'));

        // Show welcome if user hasn't seen it AND has no saved data
        if (hasSeenWelcome === 'false' && Object.keys(userData).length === 0) {
            // Wait a bit for the UI to load, then show welcome
            setTimeout(() => {
                showWelcomeMessage();
                // Highlight the update button
                const updateButton = document.querySelector('button');
                if (updateButton && updateButton.textContent.includes('Persönliche Daten aktualisieren')) {
                    updateButton.classList.add('update-button-highlight');
                }
            }, 500);
        }
    }
    function showProgressOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'autoSubmitOverlay';
        overlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(34, 139, 34, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
        overlay.innerHTML = `
        <p style="margin: 0; font-size: 14px; display: flex; align-items: center; justify-content: center;">
            <span class="loading-spinner"></span>
            Automatische Anmeldung läuft...
        </p>
        <p style="margin: 5px 0 0; font-size: 12px;">Bitte warte und interagiere nicht mit der Seite.</p>
    `;
        document.body.appendChild(overlay);

        // Show emergency stop button when automation starts
        showEmergencyStop();
    }

    // Function to show CAPTCHA notification
    function showCaptchaNotification() {
        // Remove any existing progress overlay
        const existingOverlay = document.getElementById('autoSubmitOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Find and highlight the CAPTCHA field
        const captchaField = document.getElementById('BS_F_captcha');
        if (captchaField) {
            // Add highlight class
            captchaField.classList.add('captcha-highlight');

            // Scroll the CAPTCHA field into view
            captchaField.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });

            // Focus on the CAPTCHA field after a short delay
            setTimeout(() => {
                captchaField.focus();
            }, 500);
        }

        const notification = document.createElement('div');
        notification.id = 'captchaNotification';
        notification.className = 'captcha-notification';
        notification.innerHTML = `
            <h3 style="margin: 0 0 10px;">CAPTCHA erkannt!</h3>
            <p style="margin: 0 0 10px;">Bitte löse die CAPTCHA-Aufgabe und klicke dann auf "kostenpflichtig buchen" oder drücke Enter.</p>
            <p style="margin: 0; font-size: 12px;">Die automatische Anmeldung wurde pausiert.</p>
        `;
        document.body.appendChild(notification);

        // Auto-remove notification and highlight after 10 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.remove();
            }
            if (captchaField) {
                captchaField.classList.remove('captcha-highlight');
            }
        }, 10000);
    }

    // Function to check if CAPTCHA exists
    function hasCaptcha() {
        const captchaField = document.getElementById('BS_F_captcha');
        return captchaField !== null;
    }

    // Function to fill the form
    function fillForm() {
        const userData = JSON.parse(GM_getValue('userData', '{}'));

        if (Object.keys(userData).length === 0) {
            alert('Bitte füllen Sie zuerst das Formular mit Ihren persönlichen Daten aus.');
            return;
        }

        // Fill in the form fields
        const fillField = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        };

        fillField('BS_F1100', userData.vorname);
        fillField('BS_F1200', userData.familienname);
        fillField('BS_F1300', userData.straßennameundnr);
        fillField('BS_F1400', userData.plzort);
        // Convert the date format
        if (userData.geburtsdatum) {
            const [year, month, day] = userData.geburtsdatum.split('-');
            const formattedDate = `${day}.${month}.${year}`;
            fillField('BS_F1500', formattedDate);
        }
        fillField('BS_F1600', userData.status);
        fillField('BS_F1700', userData.matrikelnr);
        fillField('BS_F2000', userData.mail);
        fillField('BS_F2100', userData.phone);
        fillField('BS_F_iban', userData.iban);

        // Set gender
        const genderInput = document.querySelector(`input[type="radio"][name="sex"][value="${userData.geschlecht}"]`);
        if (genderInput) genderInput.checked = true;

        // Check the terms checkbox
        const termsCheckbox = document.querySelector('input[name="tnbed"]');
        if (termsCheckbox) termsCheckbox.checked = true;

        // Modify the auto-submit behavior based on user preference
        if (userData.autoSubmit) {
            showProgressOverlay();
            // Enable the submit button
            const submitButton = document.querySelector('input#bs_submit[value="weiter zur Buchung"]');
            if (submitButton) {
                submitButton.classList.remove('hidden');
                submitButton.classList.add('sub');
                submitButton.disabled = false;
            }

            function waitAndSubmit() {
                // Check for emergency stop
                if (isEmergencyStopped()) {
                    console.log("Emergency stop triggered - stopping automation");
                    return;
                }

                const counter = document.querySelector('#bs_counter:not(.hidden)');
                if (!counter) {
                    const submitButton = document.querySelector('input#bs_submit[value="weiter zur Buchung"]');
                    if (submitButton && !isEmergencyStopped()) {
                        submitButton.click();
                    } else {
                        console.error("Submit-Button 'weiter zur Buchung' nicht gefunden");
                    }
                } else {
                    setTimeout(waitAndSubmit, 250);
                }
            }
            waitAndSubmit();
        }

        // Handle email confirmation and final submission
        setTimeout(function() {
            const mailCheck = document.querySelector('input[name^="email_check_"]');
            if (mailCheck) mailCheck.value = userData.mail;

            if (userData.autoSubmit) {
                // Check for CAPTCHA before final submission
                if (hasCaptcha()) {
                    showCaptchaNotification();
                    // Don't auto-submit, let user handle CAPTCHA manually
                } else {
                    const finalSubmit = document.querySelector('input.sub[type="submit"][value="kostenpflichtig buchen"]');
                    if (finalSubmit) {
                        finalSubmit.click();
                    } else {
                        console.error("Abschließender Submit-Button nicht gefunden");
                    }
                }
            }
        }, 200);
    }

    function updateUI(userData){
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '9999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.backgroundColor = 'transparent';
        buttonContainer.style.borderRadius = '5px';

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Persönliche Daten aktualisieren';
        updateButton.style.backgroundColor = 'green';
        updateButton.style.color = 'white';
        updateButton.style.border = 'none';
        updateButton.style.padding = '5px 10px';
        updateButton.style.borderRadius = '5px';
        updateButton.style.cursor = 'pointer';
        updateButton.addEventListener('click', showInputForm);

        const switchdiv = document.createElement('div');
        switchdiv.style.backgroundColor = 'white';
        switchdiv.style.border = 'none';
        switchdiv.style.padding = '5px 10px';
        switchdiv.style.borderRadius = '5px';
        switchdiv.style.color = 'black';

        const toggleSwitchLabel = document.createElement('label');
        toggleSwitchLabel.className = 'toggle-switch';

        const toggleSwitch = document.createElement('input');
        toggleSwitch.type = 'checkbox';
        toggleSwitch.id = 'autoRefreshToggle';
        toggleSwitch.checked = userData.autoRefresh;

        const toggleSlider = document.createElement('span');
        toggleSlider.className = 'slider';

        toggleSwitch.addEventListener('change', toggleAutoRefresh);

        toggleSwitchLabel.appendChild(toggleSwitch);
        toggleSwitchLabel.appendChild(toggleSlider);
        switchdiv.appendChild(toggleSwitchLabel);

        const toggleLabel = document.createElement('span');
        toggleLabel.textContent = 'Auto-Refresh';
        toggleLabel.style.marginLeft = '5px';
        toggleLabel.style.color = 'black';
        switchdiv.appendChild(toggleLabel);

        buttonContainer.appendChild(switchdiv);
        buttonContainer.appendChild(updateButton);
        document.body.appendChild(buttonContainer);
        updateToggleSwitch();
    }
    // Main execution
    if (window.location.href.includes('/angebote/')) {
        const userData = JSON.parse(GM_getValue('userData', '{}'));
        if (!userData || Object.keys(userData).length === 0) {
            showInputForm();
        } else {
            updateUI(userData);
            checkAndAutoRefresh();
        }

        // Check if this is a first-time user and show welcome message
        checkFirstTimeUser();

    } else if (window.location.href.includes('/cgi/anmeldung.fcgi')) {
        fillForm();
    } else {
    }
})();