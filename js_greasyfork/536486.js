// ==UserScript==
// @name         Einsatz Endzeit-Anzeige
// @namespace    HendrikStaufenbiel
// @version      1.3.4
// @description  Zeigt bei Verbands-Einsätzen das früheste Zufahrts-Ende als verschiebbares, Panel mit nebeneinander angeordneten Buttons und Farbschema. 
// @author       Hendrik
// @license      MIT 
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536486/Einsatz%20Endzeit-Anzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/536486/Einsatz%20Endzeit-Anzeige.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.hasRunEinsatzEndzeitScriptVerband) return;
    window.hasRunEinsatzEndzeitScriptVerband = true;

    const STORAGE_KEY = 'chaos_ignored_einsaetze_verband';
    const CHAOS_MODE_KEY = 'chaos_mode_activated';
    const OWN_MISSIONS_KEY = 'show_own_missions_over_10k';
    const POSITION_KEY = 'einsatz_endzeit_panel_position';

    const ignoredEinsaetze = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    let chaosMode = JSON.parse(localStorage.getItem(CHAOS_MODE_KEY) || 'false');
    let showOwnMissions = JSON.parse(localStorage.getItem(OWN_MISSIONS_KEY) || 'false');
    const eingeklappteMissionen = new Set();

    let einsatzMitFruehestemEnde = null;
    let creditDisplay = null;

    function saveIgnored() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ignoredEinsaetze]));
    }

    function saveChaosMode() {
        localStorage.setItem(CHAOS_MODE_KEY, JSON.stringify(chaosMode));
    }

    function saveOwnMissionsSetting() {
        localStorage.setItem(OWN_MISSIONS_KEY, JSON.stringify(showOwnMissions));
    }

    function savePanelPosition(left, top) {
        localStorage.setItem(POSITION_KEY, JSON.stringify({ left, top }));
    }

    function loadPanelPosition() {
        const pos = localStorage.getItem(POSITION_KEY);
        if (pos) {
            try {
                return JSON.parse(pos);
            } catch {
                return null;
            }
        }
        return null;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function calculateOffset(avgCredits) {
        return chaosMode ? (avgCredits <= 4999 ? 1800 : 5400) : (avgCredits <= 4999 ? 3600 : 10800);
    }

    function verarbeiteEinsatzliste(container, isOwn = false) {
        if (!container) return { fruehesteZeit: Infinity, eintrag: null, gesamt: 0 };

        let fruehesteZeit = Infinity;
        let fruehesterEintrag = null;
        let gesamtCredits = 0;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId || ignoredEinsaetze.has(missionId)) return;

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const age = sortableData.age;
                const avgCredits = sortableData.average_credits;
                gesamtCredits += avgCredits;

                if (isOwn) {
                    if (avgCredits <= 10000 && !eingeklappteMissionen.has(missionId)) {
                        eingeklappteMissionen.add(missionId);
                        const collapseBtn = entry.querySelector('button.lssmv4-extendedCallList_collapsable-missions_btn');
                        if (collapseBtn) collapseBtn.click();
                    }
                    if (!showOwnMissions || avgCredits <= 10000) return;
                }

                const offset = calculateOffset(avgCredits);
                const endTimestamp = age + offset;

                if (endTimestamp < fruehesteZeit) {
                    fruehesteZeit = endTimestamp;
                    fruehesterEintrag = entry;
                }

                if (!entry.querySelector('.endzeit-anzeige')) {
                    const zeitAnzeige = document.createElement('div');
                    zeitAnzeige.className = 'endzeit-anzeige';
                    Object.assign(zeitAnzeige.style, {
                        marginLeft: '8px',
                        fontSize: 'smaller',
                        color: 'white',
                        backgroundColor: '#ff0000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
                    });
                    zeitAnzeige.textContent = `Ende: ${formatTime(endTimestamp)}`;

                    zeitAnzeige.addEventListener('click', () => {
                        zeitAnzeige.style.display = 'none';
                        ignoredEinsaetze.add(missionId);
                        saveIgnored();
                        addEndTimes();
                    });

                    entry.querySelector('.panel-heading')?.appendChild(zeitAnzeige);
                }
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
            }
        });

        return { fruehesteZeit, eintrag: fruehesterEintrag, gesamt: gesamtCredits };
    }

    function addEndTimes() {
        const allianceContainer = document.querySelector('#mission_list_alliance');
        const ownContainer = document.querySelector('#mission_list');

        const allianceResult = verarbeiteEinsatzliste(allianceContainer);
        const ownResult = showOwnMissions ? verarbeiteEinsatzliste(ownContainer, true) : { fruehesteZeit: Infinity, eintrag: null, gesamt: 0 };

        const result = allianceResult.fruehesteZeit < ownResult.fruehesteZeit ? allianceResult : ownResult;

        if (result.fruehesteZeit < Infinity) {
            einsatzMitFruehestemEnde = result.eintrag;
            updatePanel(formatTime(result.fruehesteZeit), allianceResult.gesamt);
        }
    }

    function createDraggablePanel() {
        const panel = document.createElement('div');
        panel.id = 'endzeit-panel';

        const pos = loadPanelPosition();
        const left = pos?.left ?? 100;
        const top = pos?.top ?? 100;

        Object.assign(panel.style, {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: '9999',
            background: '#1e1e1e',
            color: '#fff',
            padding: '4px 6px',
            borderRadius: '6px',
            border: '2px solid #555',
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'move',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            fontWeight: '600'
        });

        panel.innerHTML = `
            <button id="btnNextEnd" title="Zur nächsten Endzeit springen">Nächste Endzeit</button>
            <button id="btnResetIgnored" title="Ignorierte Einsätze zurücksetzen">↺</button>
            <button id="btnToggleChaos" title="Chaostage an/aus">Chaostage: ${chaosMode ? 'AN' : 'AUS'}</button>
            <button id="btnOwnMissions" title="Eigene Einsätze > 15.000 Cr ein/aus">Eigene >10k: ${showOwnMissions ? 'AN' : 'AUS'}</button>
            <div id="creditDisplay" title="Gesamt-Credits" style="
                background:#2980b9;
                width:16px;
                height:16px;
                border-radius:50%;
                display:flex;
                justify-content:center;
                align-items:center;
                font-weight:bold;
                font-size:11px;
                cursor: default;
                user-select:none;
            ">ⓘ</div>
        `;

        document.body.appendChild(panel);

        // Styles für Buttons
        const btnNextEnd = document.getElementById('btnNextEnd');
        Object.assign(btnNextEnd.style, {
            backgroundColor: '#888888',
            color: '#ff0000',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 4px rgba(255,0,0,0.6)',
            fontSize: '11px'
        });

        const btnResetIgnored = document.getElementById('btnResetIgnored');
        Object.assign(btnResetIgnored.style, {
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            padding: '3px 7px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '1',
            boxShadow: '0 0 4px rgba(255,255,255,0.4)',
            userSelect: 'none'
        });

        const btnToggleChaos = document.getElementById('btnToggleChaos');
        const updateChaosButton = () => {
            if (chaosMode) {
                btnToggleChaos.style.backgroundColor = '#e74c3c'; // rot
                btnToggleChaos.style.color = '#fff';
                btnToggleChaos.style.boxShadow = '0 0 6px rgba(231,76,60,0.8)';
            } else {
                btnToggleChaos.style.backgroundColor = '#27ae60'; // grün
                btnToggleChaos.style.color = '#fff';
                btnToggleChaos.style.boxShadow = '0 0 6px rgba(39,174,96,0.8)';
            }
        };
        updateChaosButton();
        btnToggleChaos.style.border = 'none';
        btnToggleChaos.style.padding = '3px 8px';
        btnToggleChaos.style.borderRadius = '5px';
        btnToggleChaos.style.cursor = 'pointer';
        btnToggleChaos.style.fontWeight = 'bold';
        btnToggleChaos.style.fontSize = '11px';

        const btnOwnMissions = document.getElementById('btnOwnMissions');
        Object.assign(btnOwnMissions.style, {
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            fontSize: '11px'
        });

        // Drag-Funktionalität
        let isDragging = false;
        let offsetX, offsetY;
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.id === 'creditDisplay') return; // Buttons nicht draggable machen
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                panel.style.left = `${newLeft}px`;
                panel.style.top = `${newTop}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Position speichern
                const rect = panel.getBoundingClientRect();
                savePanelPosition(rect.left, rect.top);
            }
        });

        // Button Events
        btnNextEnd.addEventListener('click', () => {
            if (einsatzMitFruehestemEnde) {
                einsatzMitFruehestemEnde.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const endzeitAnzeige = einsatzMitFruehestemEnde.querySelector('.endzeit-anzeige');
                if (endzeitAnzeige) {
                    endzeitAnzeige.classList.add('blink-animation');
                    setTimeout(() => endzeitAnzeige.classList.remove('blink-animation'), 5000);
                }
            }
        });

        btnResetIgnored.addEventListener('click', () => {
            ignoredEinsaetze.clear();
            saveIgnored();
            addEndTimes();
        });

        btnToggleChaos.addEventListener('click', () => {
            chaosMode = !chaosMode;
            btnToggleChaos.textContent = `Chaostage: ${chaosMode ? 'AN' : 'AUS'}`;
            updateChaosButton();
            saveChaosMode();
            addEndTimes();
        });

        btnOwnMissions.addEventListener('click', () => {
            showOwnMissions = !showOwnMissions;
            btnOwnMissions.textContent = `Eigene >10k: ${showOwnMissions ? 'AN' : 'AUS'}`;
            saveOwnMissionsSetting();
            addEndTimes();
        });

        creditDisplay = document.getElementById('creditDisplay');
    }

    function updatePanel(zeit, credits) {
        document.getElementById('btnNextEnd').textContent = `Nächste Endzeit: ${zeit}`;
        if (creditDisplay) {
            creditDisplay.title = `Gesamt-Credits: ${credits.toLocaleString()} Cr`;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { background-color: yellow; }
            50% { background-color: red; }
            100% { background-color: yellow; }
        }
        .blink-animation {
            animation: blink 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    createDraggablePanel();
    setInterval(addEndTimes, 2000);
})();

// ==UserScript==
// @name         Einsatz Endzeit-Anzeige
// @namespace    HendrikStaufenbiel
// @version      1.3.4
// @description  Zeigt bei Verbands-Einsätzen das früheste Zufahrts-Ende als verschiebbares, sehr kompaktes Panel mit nebeneinander angeordneten Buttons und Farbschema. Speichert Panelposition im localStorage.
// @author       Hendrik
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    if (window.hasRunEinsatzEndzeitScriptVerband) return;
    window.hasRunEinsatzEndzeitScriptVerband = true;

    const STORAGE_KEY = 'chaos_ignored_einsaetze_verband';
    const CHAOS_MODE_KEY = 'chaos_mode_activated';
    const OWN_MISSIONS_KEY = 'show_own_missions_over_10k';
    const POSITION_KEY = 'einsatz_endzeit_panel_position';

    const ignoredEinsaetze = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    let chaosMode = JSON.parse(localStorage.getItem(CHAOS_MODE_KEY) || 'false');
    let showOwnMissions = JSON.parse(localStorage.getItem(OWN_MISSIONS_KEY) || 'false');
    const eingeklappteMissionen = new Set();

    let einsatzMitFruehestemEnde = null;
    let creditDisplay = null;

    function saveIgnored() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...ignoredEinsaetze]));
    }

    function saveChaosMode() {
        localStorage.setItem(CHAOS_MODE_KEY, JSON.stringify(chaosMode));
    }

    function saveOwnMissionsSetting() {
        localStorage.setItem(OWN_MISSIONS_KEY, JSON.stringify(showOwnMissions));
    }

    function savePanelPosition(left, top) {
        localStorage.setItem(POSITION_KEY, JSON.stringify({ left, top }));
    }

    function loadPanelPosition() {
        const pos = localStorage.getItem(POSITION_KEY);
        if (pos) {
            try {
                return JSON.parse(pos);
            } catch {
                return null;
            }
        }
        return null;
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function calculateOffset(avgCredits) {
        return chaosMode ? (avgCredits <= 4999 ? 1800 : 5400) : (avgCredits <= 4999 ? 3600 : 10800);
    }

    function verarbeiteEinsatzliste(container, isOwn = false) {
        if (!container) return { fruehesteZeit: Infinity, eintrag: null, gesamt: 0 };

        let fruehesteZeit = Infinity;
        let fruehesterEintrag = null;
        let gesamtCredits = 0;

        container.querySelectorAll('.missionSideBarEntry').forEach(entry => {
            const missionId = entry.getAttribute('mission_id');
            if (!missionId || ignoredEinsaetze.has(missionId)) return;

            const sortableRaw = entry.getAttribute('data-sortable-by');
            if (!sortableRaw) return;

            try {
                const sortableData = JSON.parse(sortableRaw.replace(/&quot;/g, '"'));
                const age = sortableData.age;
                const avgCredits = sortableData.average_credits;
                gesamtCredits += avgCredits;

                if (isOwn) {
                    if (avgCredits <= 10000 && !eingeklappteMissionen.has(missionId)) {
                        eingeklappteMissionen.add(missionId);
                        const collapseBtn = entry.querySelector('button.lssmv4-extendedCallList_collapsable-missions_btn');
                        if (collapseBtn) collapseBtn.click();
                    }
                    if (!showOwnMissions || avgCredits <= 10000) return;
                }

                const offset = calculateOffset(avgCredits);
                const endTimestamp = age + offset;

                if (endTimestamp < fruehesteZeit) {
                    fruehesteZeit = endTimestamp;
                    fruehesterEintrag = entry;
                }

                if (!entry.querySelector('.endzeit-anzeige')) {
                    const zeitAnzeige = document.createElement('div');
                    zeitAnzeige.className = 'endzeit-anzeige';
                    Object.assign(zeitAnzeige.style, {
                        marginLeft: '8px',
                        fontSize: 'smaller',
                        color: 'white',
                        backgroundColor: '#ff0000',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        display: 'inline-block',
                        boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
                    });
                    zeitAnzeige.textContent = `Ende: ${formatTime(endTimestamp)}`;

                    zeitAnzeige.addEventListener('click', () => {
                        zeitAnzeige.style.display = 'none';
                        ignoredEinsaetze.add(missionId);
                        saveIgnored();
                        addEndTimes();
                    });

                    entry.querySelector('.panel-heading')?.appendChild(zeitAnzeige);
                }
            } catch (err) {
                console.error('Fehler beim Parsen:', err);
            }
        });

        return { fruehesteZeit, eintrag: fruehesterEintrag, gesamt: gesamtCredits };
    }

    function addEndTimes() {
        const allianceContainer = document.querySelector('#mission_list_alliance');
        const ownContainer = document.querySelector('#mission_list');

        const allianceResult = verarbeiteEinsatzliste(allianceContainer);
        const ownResult = showOwnMissions ? verarbeiteEinsatzliste(ownContainer, true) : { fruehesteZeit: Infinity, eintrag: null, gesamt: 0 };

        const result = allianceResult.fruehesteZeit < ownResult.fruehesteZeit ? allianceResult : ownResult;

        if (result.fruehesteZeit < Infinity) {
            einsatzMitFruehestemEnde = result.eintrag;
            updatePanel(formatTime(result.fruehesteZeit), allianceResult.gesamt);
        }
    }

    function createDraggablePanel() {
        const panel = document.createElement('div');
        panel.id = 'endzeit-panel';

        const pos = loadPanelPosition();
        const left = pos?.left ?? 100;
        const top = pos?.top ?? 100;

        Object.assign(panel.style, {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: '9999',
            background: '#1e1e1e',
            color: '#fff',
            padding: '4px 6px',
            borderRadius: '6px',
            border: '2px solid #555',
            boxShadow: '0 0 6px rgba(0,0,0,0.5)',
            cursor: 'move',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
            fontSize: '11px',
            fontWeight: '600'
        });

        panel.innerHTML = `
            <button id="btnNextEnd" title="Zur nächsten Endzeit springen">Nächste Endzeit</button>
            <button id="btnResetIgnored" title="Ignorierte Einsätze zurücksetzen">↺</button>
            <button id="btnToggleChaos" title="Chaostage an/aus">Chaostage: ${chaosMode ? 'AN' : 'AUS'}</button>
            <button id="btnOwnMissions" title="Eigene Einsätze > 15.000 Cr ein/aus">Eigene >10k: ${showOwnMissions ? 'AN' : 'AUS'}</button>
            <div id="creditDisplay" title="Gesamt-Credits" style="
                background:#2980b9;
                width:16px;
                height:16px;
                border-radius:50%;
                display:flex;
                justify-content:center;
                align-items:center;
                font-weight:bold;
                font-size:11px;
                cursor: default;
                user-select:none;
            ">ⓘ</div>
        `;

        document.body.appendChild(panel);

        // Styles für Buttons
        const btnNextEnd = document.getElementById('btnNextEnd');
        Object.assign(btnNextEnd.style, {
            backgroundColor: '#888888',
            color: '#ff0000',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 4px rgba(255,0,0,0.6)',
            fontSize: '11px'
        });

        const btnResetIgnored = document.getElementById('btnResetIgnored');
        Object.assign(btnResetIgnored.style, {
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            padding: '3px 7px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '1',
            boxShadow: '0 0 4px rgba(255,255,255,0.4)',
            userSelect: 'none'
        });

        const btnToggleChaos = document.getElementById('btnToggleChaos');
        const updateChaosButton = () => {
            if (chaosMode) {
                btnToggleChaos.style.backgroundColor = '#e74c3c'; // rot
                btnToggleChaos.style.color = '#fff';
                btnToggleChaos.style.boxShadow = '0 0 6px rgba(231,76,60,0.8)';
            } else {
                btnToggleChaos.style.backgroundColor = '#27ae60'; // grün
                btnToggleChaos.style.color = '#fff';
                btnToggleChaos.style.boxShadow = '0 0 6px rgba(39,174,96,0.8)';
            }
        };
        updateChaosButton();
        btnToggleChaos.style.border = 'none';
        btnToggleChaos.style.padding = '3px 8px';
        btnToggleChaos.style.borderRadius = '5px';
        btnToggleChaos.style.cursor = 'pointer';
        btnToggleChaos.style.fontWeight = 'bold';
        btnToggleChaos.style.fontSize = '11px';

        const btnOwnMissions = document.getElementById('btnOwnMissions');
        Object.assign(btnOwnMissions.style, {
            backgroundColor: '#444',
            color: '#fff',
            border: 'none',
            padding: '3px 8px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            fontSize: '11px'
        });

        // Drag-Funktionalität
        let isDragging = false;
        let offsetX, offsetY;
        panel.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.id === 'creditDisplay') return; // Buttons nicht draggable machen
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;
                panel.style.left = `${newLeft}px`;
                panel.style.top = `${newTop}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                // Position speichern
                const rect = panel.getBoundingClientRect();
                savePanelPosition(rect.left, rect.top);
            }
        });

        // Button Events
        btnNextEnd.addEventListener('click', () => {
            if (einsatzMitFruehestemEnde) {
                einsatzMitFruehestemEnde.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const endzeitAnzeige = einsatzMitFruehestemEnde.querySelector('.endzeit-anzeige');
                if (endzeitAnzeige) {
                    endzeitAnzeige.classList.add('blink-animation');
                    setTimeout(() => endzeitAnzeige.classList.remove('blink-animation'), 5000);
                }
            }
        });

        btnResetIgnored.addEventListener('click', () => {
            ignoredEinsaetze.clear();
            saveIgnored();
            addEndTimes();
        });

        btnToggleChaos.addEventListener('click', () => {
            chaosMode = !chaosMode;
            btnToggleChaos.textContent = `Chaostage: ${chaosMode ? 'AN' : 'AUS'}`;
            updateChaosButton();
            saveChaosMode();
            addEndTimes();
        });

        btnOwnMissions.addEventListener('click', () => {
            showOwnMissions = !showOwnMissions;
            btnOwnMissions.textContent = `Eigene >10k: ${showOwnMissions ? 'AN' : 'AUS'}`;
            saveOwnMissionsSetting();
            addEndTimes();
        });

        creditDisplay = document.getElementById('creditDisplay');
    }

    function updatePanel(zeit, credits) {
        document.getElementById('btnNextEnd').textContent = `Nächste Endzeit: ${zeit}`;
        if (creditDisplay) {
            creditDisplay.title = `Gesamt-Credits: ${credits.toLocaleString()} Cr`;
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0% { background-color: yellow; }
            50% { background-color: red; }
            100% { background-color: yellow; }
        }
        .blink-animation {
            animation: blink 1s linear infinite;
        }
    `;
    document.head.appendChild(style);

    createDraggablePanel();
    setInterval(addEndTimes, 2000);
})();