// ==UserScript==
// @name         LSS Schrotthändler (Statusänderung & Verschrottung)
// @namespace    www.leitstellenspiel.de
// @version      1.12
// @description  Erzeugt die Möglichkeit, alle Fahrzeuge eines bestimmten Typs auf Status 2 oder 6 zu setzen und zu verschrotten
// @author       MissSobol (erweitert duch Masklin & gemini)
// @match        https://www.leitstellenspiel.de/
// @resource     icon https://github.com/Sobol0202/LSS-Scripte/raw/main/LSS-Schrotth-ndler/icons8-garbage-truck-64.png?raw
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537509/LSS%20Schrotth%C3%A4ndler%20%28Status%C3%A4nderung%20%20Verschrottung%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537509/LSS%20Schrotth%C3%A4ndler%20%28Status%C3%A4nderung%20%20Verschrottung%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Individueller Modal-Name
    var modalName = "Modal_Schrott";

    // Array zum Speichern der abgerufenen Fahrzeuge
    var vehicles = [];

    /**
     * Sendet eine AJAX-Anfrage, um den FMS-Status eines Fahrzeugs zu ändern.
     * @param {number} vehicleId - Die ID des Fahrzeugs.
     * @param {number} status - Der gewünschte FMS-Status (z.B. 2 oder 6).
     */
    function sendFMSRequest(vehicleId, status) {
        // Die vollständige URL zum Setzen des FMS-Status
        var setFmsUrl = `https://www.leitstellenspiel.de/vehicles/${vehicleId}/set_fms/${status}`;
        console.log(`Fahrzeug ${vehicleId} -> ${status} (URL: ${setFmsUrl})`); // Volle URL im Log

        // Hole den CSRF-Token aus dem Meta-Tag für die Sicherheit der Anfrage
        var authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        // Erstelle eine neue XMLHttpRequest-Instanz
        var xhr = new XMLHttpRequest();
        // Öffne die Anfrage als GET-Request, da die Beispiel-URL eine GET-Anfrage impliziert
        xhr.open("GET", setFmsUrl, true);

        // Füge den CSRF-Token hinzu, falls vorhanden
        if (authToken) {
            xhr.setRequestHeader("X-CSRF-Token", authToken);
        }

        // Setze den Callback für die Antwort der Anfrage
        xhr.onreadystatechange = function () {
            // Wenn die Anfrage abgeschlossen ist (readyState 4)
            if (xhr.readyState == 4) {
                // Überprüfe den HTTP-Statuscode
                if (xhr.status == 200) {
                    // Log bereits oben erfolgt
                } else {
                    console.error(`FEHLER: Fahrzeug ${vehicleId} auf Status ${status} setzen fehlgeschlagen. Statuscode: ${xhr.status} (URL: ${setFmsUrl})`); // Kürzeres Fehler-Log mit URL
                }
            }
        };
        // Sende die Anfrage
        xhr.send();
    }

    /**
     * Sendet eine AJAX-Anfrage, um ein Fahrzeug zu löschen (zu verschrotten).
     * @param {number} vehicleId - Die ID des zu löschenden Fahrzeugs.
     */
    function deleteVehicle(vehicleId) {
        var deleteUrl = `https://www.leitstellenspiel.de/vehicles/${vehicleId}`;
        console.log(`Fahrzeug ${vehicleId} -> Löschen (URL: ${deleteUrl})`); // Volle URL im Log

        var authToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", deleteUrl, true);

        if (authToken) {
            xhr.setRequestHeader("X-CSRF-Token", authToken);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // Log bereits oben erfolgt
                } else {
                    console.error(`FEHLER: Fahrzeug ${vehicleId} löschen fehlgeschlagen. Statuscode: ${xhr.status} (URL: ${deleteUrl})`);
                }
            }
        };
        xhr.send();
    }

    /**
     * Behandelt das Setzen des FMS-Status für ausgewählte Fahrzeuge.
     * @param {number} status - Der FMS-Status, auf den die Fahrzeuge gesetzt werden sollen.
     */
    function handleStatusChange(status) {
        const selectedTypeId = document.getElementById('vehicleType').value;
        const selectedTypeCaption = document.getElementById('vehicleType').options[document.getElementById('vehicleType').selectedIndex].text;

        const vehicleIdsToUpdate = vehicles.filter(vehicle => vehicle.vehicle_type == selectedTypeId).map(vehicle => vehicle.id);

        if (vehicleIdsToUpdate.length === 0) {
            const modalContent = document.querySelector(`.${modalName}Content`);
            const messageDiv = document.createElement('div');
            messageDiv.className = 'alert-message';
            messageDiv.textContent = `Keine Fahrzeuge vom Typ ${selectedTypeCaption} gefunden.`;
            modalContent.insertBefore(messageDiv, modalContent.querySelector('p').nextSibling);

            setTimeout(() => {
                messageDiv.remove();
                closeModal();
            }, 2000);
            return;
        }

        const confirmAction = confirm(`Möchtest du wirklich ${vehicleIdsToUpdate.length} Fahrzeuge vom Typ "${selectedTypeCaption}" auf Status ${status} setzen?`);

        if (confirmAction) {
            vehicleIdsToUpdate.forEach(function (vehicleId, index) {
                setTimeout(function () {
                    sendFMSRequest(vehicleId, status);
                }, index * 200); // 200ms Verzögerung pro Fahrzeug
            });

            setTimeout(function () {
                location.reload();
            }, (vehicleIdsToUpdate.length * 200) + 500);
        } else {
            console.log("Vorgang abgebrochen.");
        }

        closeModal();
    }

    /**
     * Behandelt das Löschen (Verschrotten) von ausgewählten Fahrzeugen.
     */
    function handleDeleteVehicles() {
        const selectedTypeId = document.getElementById('vehicleType').value;
        const selectedTypeCaption = document.getElementById('vehicleType').options[document.getElementById('vehicleType').selectedIndex].text;

        const vehicleIdsToDelete = vehicles.filter(vehicle => vehicle.vehicle_type == selectedTypeId).map(vehicle => vehicle.id);

        if (vehicleIdsToDelete.length === 0) {
            const modalContent = document.querySelector(`.${modalName}Content`);
            const messageDiv = document.createElement('div');
            messageDiv.className = 'alert-message';
            messageDiv.textContent = `Keine Fahrzeuge vom Typ ${selectedTypeCaption} zum Verschrottung gefunden.`;
            modalContent.insertBefore(messageDiv, modalContent.querySelector('p').nextSibling);

            setTimeout(() => {
                messageDiv.remove();
                closeModal();
            }, 2000);
            return;
        }

        const confirmAction = confirm(`Möchtest du wirklich ${vehicleIdsToDelete.length} Fahrzeuge vom Typ "${selectedTypeCaption}" VERSCHROTTEN? Dies kann NICHT rückgängig gemacht werden!`);

        if (confirmAction) {
            vehicleIdsToDelete.forEach(function (vehicleId, index) {
                setTimeout(function () {
                    deleteVehicle(vehicleId);
                }, index * 200); // 200ms Verzögerung pro Fahrzeug
            });

            setTimeout(function () {
                location.reload();
            }, (vehicleIdsToDelete.length * 200) + 500);
        } else {
            console.log("Verschrottung abgebrochen.");
        }

        closeModal();
    }

    /**
     * Ruft die Fahrzeuge über die API ab.
     */
    function getVehicles() {
        console.log('DEBUG: Rufe Fahrzeuge ab...');
        var apiUrl = "https://www.leitstellenspiel.de/api/vehicles";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", apiUrl, true);

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    vehicles = JSON.parse(xhr.responseText);
                    console.log("DEBUG: Fahrzeuge erfolgreich abgerufen. Anzahl:", vehicles.length);
                    openModal();
                } else {
                    console.error("FEHLER: Beim Abrufen der Fahrzeuge. Statuscode:", xhr.status);
                    const modalContent = document.querySelector(`.${modalName}Content`);
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'alert-message';
                    messageDiv.textContent = `Fehler beim Abrufen der Fahrzeuge. Statuscode: ${xhr.status}`;
                    modalContent.insertBefore(messageDiv, modalContent.querySelector('p').nextSibling);

                    setTimeout(() => {
                        messageDiv.remove();
                        closeModal();
                    }, 3000);
                }
            }
        };
        xhr.send();
    }

    /**
     * Erstellt das Modal-Fenster mit Dropdown-Menü und Buttons.
     */
    function createModal() {
        if (document.getElementById(modalName)) {
            openModal();
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.lss-manager.de/de_DE/vehicles',
            responseType: 'json',
            onload: function (response) {
                if (response.status === 200) {
                    const vehicleTypes = response.response;
                    const options = Object.entries(vehicleTypes).map(([typeId, typeData]) => {
                        return `<option value="${typeId}">${typeData.caption}</option>`;
                    });

                    const modalHTML = `
                        <div id="${modalName}" class="modal">
                            <div class="modal-content ${modalName}Content">
                                <span class="close" id="${modalName}CloseBtn">&times;</span>
                                <h2>Fahrzeugstatus ändern / Verschrottung</h2>
                                <p>Bitte wähle den Fahrzeugtypen aus und die gewünschte Aktion.</p>
                                <select id="vehicleType" class="modal-select">${options.join('')}</select>
                                <div class="modal-buttons">
                                    <button id="setStatus6Btn" class="btn btn-xs btn-warning">Auf Status 6 setzen</button>
                                    <button id="setStatus2Btn" class="btn btn-xs btn-success">Auf Status 2 setzen</button>
                                    <button id="deleteVehiclesBtn" class="btn btn-xs btn-danger">Fahrzeuge verschrotten</button>
                                </div>
                            </div>
                        </div>
                    `;

                    document.body.insertAdjacentHTML('beforeend', modalHTML);

                    document.getElementById(`${modalName}CloseBtn`).addEventListener('click', closeModal);
                    document.getElementById('setStatus6Btn').addEventListener('click', function() { handleStatusChange(6); });
                    document.getElementById('setStatus2Btn').addEventListener('click', function() { handleStatusChange(2); });
                    document.getElementById('deleteVehiclesBtn').addEventListener('click', handleDeleteVehicles); // Neuer Event-Listener

                    getVehicles();
                } else {
                    console.error('FEHLER: Beim Abrufen der Fahrzeugtypen. Statuscode:', response.status);
                }
            },
            onerror: function (error) {
                console.error('FEHLER: Beim Abrufen der Fahrzeugtypen:', error);
            }
        });
    }

    /**
     * Öffnet das Modal-Fenster.
     */
    function openModal() {
        document.getElementById(modalName).style.display = 'flex';
    }

    /**
     * Schließt das Modal-Fenster.
     */
    function closeModal() {
        document.getElementById(modalName).style.display = 'none';
        vehicles = []; // Setze das vehicles-Array zurück
    }

    // Erstelle ein Trigger-Element im Spielmenü
    const triggerLi = document.createElement('li');
    const triggerA = document.createElement('a');
    const triggerImg = document.createElement('img');
    triggerImg.src = GM_getResourceURL('icon');
    triggerImg.width = 24;
    triggerImg.height = 24;
    triggerA.href = '#';
    triggerA.append(triggerImg, 'Schrotthändler');
    triggerLi.append(triggerA);

    triggerLi.addEventListener('click', event => {
        event.preventDefault();
        createModal();
    });

    document
        .querySelector('#menu_profile + .dropdown-menu > li.divider')
        ?.before(triggerLi);

    window.lightboxOpen = createModal;

    // Füge das CSS für das Styling hinzu
    GM_addStyle(`
        #${modalName} {
            display: none;
            justify-content: center;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }

        .${modalName}Content {
            background-color: #fefefe;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
            position: relative;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .${modalName}Content h2 {
            margin-top: 0;
            color: #333;
            font-size: 1.8em;
            margin-bottom: 15px;
        }

        .${modalName}Content p {
            margin-bottom: 25px;
            color: #555;
            font-size: 1.1em;
        }

        .modal-select {
            width: calc(100% - 20px);
            padding: 12px;
            margin-bottom: 25px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 1em;
            background-color: #fff;
            appearance: none;
            background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%2C197.3L159.2%2C69.5c-3.2-3.2-8.4-3.2-11.6%2C0L5.4%2C197.3c-3.2%2C3.2-3.2%2C8.4%2C0%2C11.6l11.6%2C11.6c3.2%2C3.2%2C8.4%2C3.2%2C11.6%2C0l120.4-120.4l120.4%2C120.4c3.2%2C3.2%2C8.4%2C3.2%2C11.6%2C0l11.6-11.6C290.2%2C205.7%2C290.2%2C200.5%2C287%2C197.3z%22%2F%3E%3C%2Fsvg%3E');
            background-repeat: no-repeat;
            background-position: right 10px top 50%;
            background-size: 12px;
            cursor: pointer;
        }

        .modal-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
            flex-wrap: wrap; /* Ermöglicht Umbruch auf kleineren Bildschirmen */
        }

        /* Angepasste .btn Regel, um nur innerhalb des Modals zu wirken */
        .${modalName}Content .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            font-size: 1.1em;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-weight: bold;
            flex-grow: 1; /* Buttons füllen verfügbaren Platz aus */
            min-width: 150px; /* Mindestbreite für Buttons */
        }

        .btn-warning {
            background-color: #ffc107;
            color: #333;
        }

        .btn-warning:hover {
            background-color: #e0a800;
            transform: translateY(-2px);
        }

        .btn-success {
            background-color: #28a745;
            color: white;
        }

        .btn-success:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }

        .btn-danger { /* Stil für den neuen Löschen-Button */
            background-color: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background-color: #c82333;
            transform: translateY(-2px);
        }

        .close {
            color: #aaa;
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 32px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.3s ease;
        }

        .close:hover,
        .close:focus {
            color: #333;
            text-decoration: none;
        }

        .alert-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-weight: bold;
            border: 1px solid #f5c6cb;
        }
    `);
})();
