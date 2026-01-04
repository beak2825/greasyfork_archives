// ==UserScript==
// @name         Leitstellenspiel - Konfigurierbare Auto-Auswahl
// @namespace    http://tampermonkey.net/
// @version      5.3.0
// @description  Integriert einen Menüpunkt im Profil und einen Schalter in Einsätzen, um die automatische Fahrzeugauswahl zu konfigurieren.
// @author       Dein Name / Gemini
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544396/Leitstellenspiel%20-%20Konfigurierbare%20Auto-Auswahl.user.js
// @updateURL https://update.greasyfork.org/scripts/544396/Leitstellenspiel%20-%20Konfigurierbare%20Auto-Auswahl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('LSS Script v5.3.0: IIFE gestartet.');

    // --- DATEN & KONSTANTEN ---
    const SETTINGS_KEYS = {
        scriptEnabled: 'lss_auto_select_main_enabled_v5',
        sKeyEnabled: 'lss_auto_select_s_key_enabled_v5',
        selectedVehicles: 'lss_auto_select_vehicles_v5'
    };
    const VEHICLE_TYPES = [
        {id:0,name:"LF 20"},{id:1,name:"LF 10"},{id:2,name:"DLK 23"},{id:3,name:"ELW 1"},{id:4,name:"RW"},{id:5,name:"GW-A"},{id:6,name:"LF 8/6"},{id:7,name:"LF 20/16"},{id:8,name:"LF 10/6"},{id:9,name:"LF 16-TS"},{id:10,name:"GW-Öl"},{id:11,name:"GW-L2-Wasser"},{id:12,name:"GW-Messtechnik"},{id:13,name:"SW 1000"},{id:14,name:"SW 2000"},{id:15,name:"SW 2000-Tr"},{id:16,name:"SW Kats"},{id:17,name:"TLF 2000"},{id:18,name:"TLF 3000"},{id:19,name:"TLF 8/8"},{id:20,name:"TLF 8/18"},{id:21,name:"TLF 16/24-Tr"},{id:22,name:"TLF 16/25"},{id:23,name:"TLF 16/45"},{id:24,name:"TLF 20/40"},{id:25,name:"TLF 20/40-SL"},{id:26,name:"TLF 16"},{id:27,name:"GW-Gefahrgut"},{id:28,name:"RTW"},{id:29,name:"NEF"},{id:30,name:"HLF 20"},{id:31,name:"RTH"},{id:32,name:"FuStW"},{id:33,name:"GW-Höhenrettung"},{id:34,name:"ELW 2"},{id:35,name:"leBefKw"},{id:36,name:"MTW"},{id:37,name:"TSF-W"},{id:38,name:"KTW"},{id:39,name:"GKW"},{id:40,name:"MTW-TZ"},{id:41,name:"MzGW (FGr N)"},{id:42,name:"LKW K 9"},{id:43,name:"BRmG R"},{id:44,name:"Anh DLE"},{id:45,name:"MLW 5"},{id:46,name:"WLF"},{id:47,name:"AB-Rüst"},{id:48,name:"AB-Atemschutz"},{id:49,name:"AB-Öl"},{id:50,name:"GruKw"},{id:51,name:"FüKW (Polizei)"},{id:52,name:"GefKw"},{id:53,name:"Dekon-P"},{id:54,name:"AB-Dekon-P"},{id:55,name:"KdoW-LNA"},{id:56,name:"KdoW-OrgL"},{id:57,name:"FwK"},{id:58,name:"KTW Typ B"},{id:59,name:"ELW 1 (SEG)"},{id:60,name:"GW-San"},{id:61,name:"Polizeihubschrauber"},{id:62,name:"AB-Schlauch"},{id:63,name:"GW-Taucher"},{id:64,name:"GW-Wasserrettung"},{id:65,name:"LKW 7 Lkr 19 tm"},{id:66,name:"Anh MzB"},{id:67,name:"Anh SchlB"},{id:68,name:"Anh MzAB"},{id:69,name:"Tauchkraftwagen"},{id:70,name:"MZB"},{id:71,name:"AB-MZB"},{id:72,name:"WaWe 10"},{id:73,name:"GRTW"},{id:74,name:"NAW"},{id:75,name:"FLF"},{id:76,name:"Rettungstreppe"},{id:77,name:"AB-Gefahrgut"},{id:78,name:"AB-Einsatzleitung"},{id:79,name:"SEK - ZF"},{id:80,name:"SEK - MTF"},{id:81,name:"MEK - ZF"},{id:82,name:"MEK - MTF"},{id:83,name:"GW-Werkfeuerwehr"},{id:84,name:"ULF mit Löscharm"},{id:85,name:"TM 50"},{id:86,name:"Turbolöscher"},{id:87,name:"TLF 4000"},{id:88,name:"KLF"},{id:89,name:"MLF"},{id:90,name:"HLF 10"},{id:91,name:"Rettungshundefahrzeug"},{id:92,name:"Anh Hund"},{id:93,name:"MTW-O"},{id:94,name:"DHuFüKW"},{id:95,name:"Polizeimotorrad"},{id:96,name:"Außenlastbehälter (allgemein)"},{id:97,name:"ITW"},{id:98,name:"Zivilstreifenwagen"},{id:100,name:"MLW 4"},{id:101,name:"Anh SwPu"},{id:102,name:"Anh 7"},{id:103,name:"FuStW (DGL)"},{id:104,name:"GW-L1"},{id:105,name:"GW-L2"},{id:106,name:"MTF-L"},{id:107,name:"LF-L"},{id:108,name:"AB-L"},{id:109,name:"MzGW SB"},{id:110,name:"NEA50"},{id:111,name:"NEA50"},{id:112,name:"NEA200"},{id:113,name:"NEA200"},{id:114,name:"GW-Lüfter"},{id:115,name:"Anh Lüfter"},{id:116,name:"AB-Lüfter"},{id:117,name:"AB-Tank"},{id:118,name:"Kleintankwagen"},{id:119,name:"AB-Lösch"},{id:120,name:"Tankwagen"},{id:121,name:"GTLF"},{id:122,name:"LKW 7 Lbw (FGr E)"},{id:123,name:"LKW 7 Lbw (FGr WP)"},{id:124,name:"MTW-OV"},{id:125,name:"MTW-Tr UL"},{id:126,name:"MTF Drohne"},{id:127,name:"GW UAS"},{id:128,name:"ELW Drohne"},{id:129,name:"ELW2 Drohne"},{id:130,name:"GW-Bt"},{id:131,name:"Bt-Kombi"},{id:132,name:"FKH"},{id:133,name:"Bt LKW"},{id:134,name:"Pferdetransporter klein"},{id:135,name:"Pferdetransporter groß"},{id:136,name:"Anh Pferdetransport"},{id:137,name:"Zugfahrzeug Pferdetransport"},{id:138,name:"GW-Verpflegung"},{id:139,name:"GW-Küche"},{id:140,name:"MTW-Verpflegung"},{id:141,name:"FKH"},{id:142,name:"AB-Küche"},{id:143,name:"Anh Schlauch"},{id:144,name:"FüKW (THW)"},{id:145,name:"FüKomKW"},{id:146,name:"Anh FüLa"},{id:147,name:"FmKW"},{id:148,name:"MTW-FGr K"},{id:149,name:"GW-Bergrettung (NEF)"},{id:150,name:"GW-Bergrettung"},{id:151,name:"ELW Bergrettung"},{id:152,name:"ATV"},{id:153,name:"Hundestaffel (Bergrettung)"},{id:154,name:"Schneefahrzeug"},{id:155,name:"Anh Höhenrettung (Bergrettung)"},{id:156,name:"Polizeihubschrauber mit verbauter Winde"},{id:157,name:"RTH Winde"},{id:158,name:"GW-Höhenrettung (Bergrettung)"},{id:159,name:"Seenotrettungskreuzer"},{id:160,name:"Seenotrettungsboot"},{id:161,name:"Hubschrauber (Seenotrettung)"},{id:162,name:"RW-Schiene"},{id:163,name:"HLF Schiene"},{id:164,name:"AB-Schiene"},{id:165,name:"LauKw"},{id:166,name:"PTLF 4000"},{id:167,name:"SLF"},{id:168,name:"Anh Sonderlöschmittel"},{id:169,name:"AB-Sonderlöschmittel"},{id:170,name:"AB-Wasser/Schaum"},{id:171,name:"GW TeSi"},{id:172,name:"LKW Technik (Notstrom)"},{id:173,name:"MTW TeSi"},{id:174,name:"Anh TeSi"},{id:175,name:"NEA50"}
    ];

    // --- ZUSTANDS-VARIABLEN ---
    let settings = {
        scriptEnabled: true,
        sKeyEnabled: true,
        selectedVehicleIDs: [30, 32]
    };

    // --- HILFSFUNKTIONEN ---
    function showSideNotification(message, type = 'info', duration = 3500) {
        const id = 'lss-side-flash-notification';
        let n = document.getElementById(id);
        if (n) n.remove();
        n = document.createElement('div');
        n.id = id;
        n.innerHTML = message;
        Object.assign(n.style, {
            position:'fixed', top:'40px', right:'40px', padding:'20px 25px', borderRadius:'8px', color:'white',
            minWidth:'320px', maxWidth:'480px', zIndex:'10002', boxShadow:'0 6px 18px rgba(0,0,0,0.22)',
            opacity:'0', transform:'translateX(100%)', transition:'all 300ms ease-out'
        });
        const colors = { success: '#28a745', error: '#dc3545', warning: '#ffc107', disabled: '#6c757d', info: '#17a2b8' };
        n.style.backgroundColor = colors[type] || colors.info;
        document.body.appendChild(n);
        requestAnimationFrame(() => { n.style.opacity = '1'; n.style.transform = 'translateX(0)'; });
        setTimeout(() => {
            n.style.opacity = '0';
            n.style.transform = 'translateX(100%)';
            setTimeout(() => n.remove(), 300);
        }, duration);
    }

    function simulateSKeyPress() {
        document.dispatchEvent(new KeyboardEvent('keydown', {key:'s', code:'KeyS', keyCode:83, which:83, bubbles:true}));
    }

    // --- EINSTELLUNGEN (Laden & Speichern) ---
    function loadSettings() {
        settings.scriptEnabled = JSON.parse(localStorage.getItem(SETTINGS_KEYS.scriptEnabled) ?? 'true');
        settings.sKeyEnabled = JSON.parse(localStorage.getItem(SETTINGS_KEYS.sKeyEnabled) ?? 'true');
        settings.selectedVehicleIDs = JSON.parse(localStorage.getItem(SETTINGS_KEYS.selectedVehicles) ?? '[30, 32]');
    }

    function saveSettings() {
        localStorage.setItem(SETTINGS_KEYS.scriptEnabled, JSON.stringify(settings.scriptEnabled));
        localStorage.setItem(SETTINGS_KEYS.sKeyEnabled, JSON.stringify(settings.sKeyEnabled));
        localStorage.setItem(SETTINGS_KEYS.selectedVehicles, JSON.stringify(settings.selectedVehicleIDs));
    }

    // Helferfunktion zum Erstellen eines Schalters
    function createSwitch(id, labelText, isChecked, onChangeCallback) {
        const switchLabel = document.createElement('label');
        switchLabel.className = 'lss-toggle-switch';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = isChecked;
        checkbox.addEventListener('change', onChangeCallback); // Event-Listener hier hinzufügen
        const textSpan = document.createElement('span');
        textSpan.className = 'lss-label';
        textSpan.textContent = labelText;
        switchLabel.append(checkbox, Object.assign(document.createElement('span'), { className: 'lss-slider' }), textSpan);
        return switchLabel;
    }

    // --- LOGIK FÜR EINSATZSEITEN ---
    function selectVehicle() {
        const vehicleTable = document.getElementById('vehicle_show_table_all');
        if (!vehicleTable) return;

        const rows = vehicleTable.querySelectorAll('tr.vehicle_select_table_tr');
        let foundMatch = false;

        for (const row of rows) {
            const checkbox = row.querySelector('input.vehicle_checkbox');
            if (!checkbox || checkbox.checked) continue;

            const vehicleTypeIdRaw = checkbox.getAttribute('vehicle_type_id');
            const vehicleTypeId = parseInt(vehicleTypeIdRaw, 10);

            if (!isNaN(vehicleTypeId) && settings.selectedVehicleIDs.includes(vehicleTypeId)) {
                checkbox.click();
                const vehicleName = row.getAttribute('vehicle_type')?.trim() || "Fahrzeug";
                let msg = `<strong>${vehicleName}</strong> automatisch ausgewählt!`;

                if (settings.sKeyEnabled) {
                    simulateSKeyPress();
                    msg = `<strong>${vehicleName}</strong> ausgewählt &<br><strong>"S"-Taste</strong> gedrückt!`;
                }
                showSideNotification(msg, 'success');
                foundMatch = true;
                break;
            }
        }

        if (!foundMatch) {
            showSideNotification('Kein passendes Fahrzeug zum Auswählen gefunden.', 'warning');
        }
    }

    function mainScriptLogic() {
        if (!settings.scriptEnabled) return;
        if (!document.querySelector('.mission_header_info .glyphicon-asterisk')) {
            showSideNotification('Einheiten bereits vor Ort.<br>Auto-Auswahl nicht nötig.', 'info');
            return;
        }
        selectVehicle();
    }

    // --- UI ---
    function addProfileMenuEntry() {
        const menu = document.querySelector('#menu_profile + .dropdown-menu');
        if (!menu) return;

        const newLi = document.createElement('li');
        newLi.innerHTML = `<a href="#" id="lss-open-settings-menu"><span class="glyphicon glyphicon-cog"></span> First Responder Master</a>`;
        menu.appendChild(newLi);

        document.getElementById('lss-open-settings-menu').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('lss-settings-overlay').style.display = 'flex';
        });
    }

    function createMissionPageToggle() {
        const switchContainer = document.createElement('div');
        switchContainer.className = 'lss-mission-toggle-container';

        const masterSwitch = createSwitch('lss-floating-master-toggle', 'Auto-Select', settings.scriptEnabled, function() {
            settings.scriptEnabled = this.checked;
            saveSettings();
            showSideNotification(`Auto-Select <strong>${settings.scriptEnabled ? 'AKTIVIERT' : 'DEAKTIVIERT'}</strong>`, settings.scriptEnabled ? 'success' : 'disabled');
        });

        switchContainer.appendChild(masterSwitch);
        document.body.appendChild(switchContainer);
    }

    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.id = 'lss-settings-overlay';

        const panel = document.createElement('div');
        panel.id = 'lss-settings-panel';
        panel.addEventListener('click', e => e.stopPropagation());

        const header = document.createElement('div');
        header.className = 'panel-header';
        header.innerHTML = '<h2>First Responder Master</h2>';
        const closeBtn = document.createElement('span');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.style.display = 'none';
        });
        header.appendChild(closeBtn);

        const generalSettings = document.createElement('div');
        generalSettings.className = 'panel-general-settings';

        generalSettings.appendChild(createSwitch('lss-panel-master-toggle', 'Auto-Select Aktiv', settings.scriptEnabled, function() {
             settings.scriptEnabled = this.checked;
             // Synchronisiere den optionalen schwebenden Schalter, falls vorhanden
             const floatingSwitch = document.getElementById('lss-floating-master-toggle');
             if (floatingSwitch) floatingSwitch.checked = this.checked;
        }));
        generalSettings.appendChild(createSwitch('lss-panel-s-key-toggle', "Auto Alarmieren Aktiv", settings.sKeyEnabled, function() {
            settings.sKeyEnabled = this.checked;
        }));

        const vehicleSettings = document.createElement('div');
        vehicleSettings.className = 'panel-vehicle-settings';
        vehicleSettings.innerHTML = '<h4>Zu alarmierende Fahrzeuge</h4>';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Fahrzeug suchen...';
        searchInput.className = 'panel-search';
        searchInput.oninput = () => {
            const filter = searchInput.value.toLowerCase();
            panel.querySelectorAll('.vehicle-checkbox-label').forEach(label => {
                label.style.display = label.textContent.toLowerCase().includes(filter) ? 'flex' : 'none';
            });
        };
        vehicleSettings.appendChild(searchInput);

        const listContainer = document.createElement('div');
        listContainer.className = 'panel-list';
        VEHICLE_TYPES.forEach(v => {
            const label = document.createElement('label');
            label.className = 'vehicle-checkbox-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = v.id;
            checkbox.checked = settings.selectedVehicleIDs.includes(v.id);
            const textNode = document.createTextNode(` ${v.name}`);
            label.append(checkbox, textNode);
            listContainer.appendChild(label);
        });
        vehicleSettings.appendChild(listContainer);

        const footer = document.createElement('div');
        footer.className = 'panel-footer';
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Speichern & Schließen';
        saveBtn.className = 'panel-save-btn';
        saveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Werte auslesen und speichern
            settings.scriptEnabled = panel.querySelector('#lss-panel-master-toggle').checked;
            settings.sKeyEnabled = panel.querySelector('#lss-panel-s-key-toggle').checked;
            const selectedVehicles = [];
            panel.querySelectorAll('.panel-list input[type="checkbox"]:checked').forEach(cb => selectedVehicles.push(parseInt(cb.value, 10)));
            settings.selectedVehicleIDs = selectedVehicles;
            saveSettings();

            overlay.style.display = 'none';
            showSideNotification('Einstellungen gespeichert!', 'success');
        });
        footer.appendChild(saveBtn);

        panel.append(header, generalSettings, vehicleSettings, footer);
        overlay.appendChild(panel);
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.style.display = 'none';
        });
        document.body.appendChild(overlay);
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .lss-mission-toggle-container { position: fixed; top: 90px; right: 20px; z-index: 9990; }
            .lss-mission-toggle-container .lss-toggle-switch { background-color: #2d2d2d; padding: 6px 10px; border-radius: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
            #lss-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 10001; display: none; justify-content: center; align-items: center; }
            #lss-settings-panel { color: #333; background: #f4f4f4; border-radius: 8px; width: 90%; max-width: 600px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
            .panel-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid #ccc; background: #fff; }
            .panel-header h2 { margin: 0; font-size: 1.2em; }
            .close-btn { font-size: 2em; cursor: pointer; color: #888; line-height: 0.5; }
            .panel-general-settings { padding: 15px 20px; background: #fff; border-bottom: 1px solid #ccc; display: flex; flex-wrap: wrap; gap: 20px; }
            .panel-vehicle-settings { padding: 15px 20px; display: flex; flex-direction: column; flex-grow: 1; min-height: 0; }
            .panel-vehicle-settings h4 { margin-top: 0; }
            .panel-search { width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
            .panel-list { overflow-y: auto; flex-grow: 1; background: #fff; border: 1px solid #ccc; padding: 10px; border-radius: 4px; }
            .vehicle-checkbox-label { display: flex; align-items: center; padding: 5px 0; user-select: none; cursor: pointer; }
            .vehicle-checkbox-label input { margin-right: 10px; }
            .panel-footer { padding: 15px 20px; border-top: 1px solid #ccc; text-align: right; background: #fff; }
            .panel-save-btn { background-color: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold; }
            .lss-toggle-switch { display: inline-flex; align-items: center; cursor: pointer; }
            .lss-toggle-switch input { display:none; }
            .lss-slider { position: relative; width: 34px; height: 18px; border-radius: 9px; transition: .3s; margin-right: 8px; background-color: #dc3545; }
            .lss-slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; border-radius: 50%; transition: .3s; }
            .lss-toggle-switch input:checked + .lss-slider { background-color: #28a745; }
            .lss-toggle-switch input:checked + .lss-slider:before { transform: translateX(16px); }
            .lss-label { font-size: 14px; user-select: none; }
        `;
        document.head.appendChild(style);
    }

    // --- INITIALISIERUNG ---
    function initialize() {
        loadSettings();
        addStyles();
        addProfileMenuEntry();
        createSettingsPanel();

        if (window.location.pathname.startsWith('/missions/')) {
            createMissionPageToggle();
            setTimeout(mainScriptLogic, 1000);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        window.addEventListener('DOMContentLoaded', initialize);
    }
})();