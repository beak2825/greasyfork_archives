// ==UserScript==
// @name         [LSS] Erweiterungs-Manager Faster&Harder
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  Ermöglicht das einfache Verwalten und Hinzufügen von fehlenden Erweiterungen und Lagerräumen für deine Wachen und Gebäude. [Retry auf 10 erhöht]
// @author       Caddy21 & Masklin & Gemini
// @match        https://www.leitstellenspiel.de/
// @grant        GM_xmlhttpRequest
// @connect      api.lss-manager.de
// @connect      leitstellenspiel.de
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://github.com/Caddy21/-docs-assets-css/raw/main/yoshi_icon__by_josecapes_dgqbro3-fullview.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547037/%5BLSS%5D%20Erweiterungs-Manager%20FasterHarder.user.js
// @updateURL https://update.greasyfork.org/scripts/547037/%5BLSS%5D%20Erweiterungs-Manager%20FasterHarder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Originaler, unveränderter Codeblock (Styling, Daten, UI-Grundgerüst)
    const styles = `
        :root {
        --background-color: #f2f2f2; --text-color: #000; --border-color: #ccc; --button-background-color: #007bff; --button-hover-background-color: #0056b3; --button-text-color: #ffffff; --warning-color: #fd7e14; --warning-hover: #e96b00; --credits-color: #28a745; --coins-color: #dc3545; --cancel-color: #6c757d;
        }
        #extension-lightbox { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; }
        #extension-lightbox-content { background: var(--background-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 20px; width: 80%; max-width: 1500px; max-height: 90vh; overflow-y: auto; position: relative; text-align: center; border-radius: 10px; }
        #close-extension-helper { position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; }
        #extension-lightbox table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 16px; }
        #extension-lightbox th, #extension-lightbox td { text-align: center; vertical-align: middle; }
        #extension-lightbox td { background-color: var(--background-color); color: var(--text-color); border: 1px solid var(--border-color); padding: 10px; }
        #extension-lightbox thead { background-color: var(--background-color); font-weight: bold; border-bottom: 2px solid var(--border-color); }
        #extension-lightbox button, .currency-button, .cancel-button { border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px; font-size: 14px; color: var(--button-text-color); transition: background-color 0.2s ease-in-out; }
        #extension-lightbox .extension-button { background-color: var(--button-background-color); }
        #extension-lightbox .extension-button:hover:enabled { background-color: var(--button-hover-background-color); }
        #extension-lightbox .build-selected-button { background-color: blue; } #extension-lightbox .build-all-button { background-color: red; } #extension-lightbox .spoiler-button { background-color: green; } #extension-lightbox .lager-button { background-color: var(--warning-color); }
        #extension-lightbox .build-selected-button:hover:enabled, #extension-lightbox .build-all-button:hover:enabled { filter: brightness(90%); }
        #extension-lightbox .build-selected-button:disabled, #extension-lightbox .build-all-button:disabled { background-color: gray !important; cursor: not-allowed; }
        #extension-lightbox .button-container { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px 5px; }
        #extension-lightbox .button-container > button { margin: 0; } #extension-lightbox .spoiler-content { display: none; }
        .currency-selection { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid black; padding: 20px; z-index: 10001; display: flex; flex-direction: column; gap: 10px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .currency-button.credits-button { background-color: var(--credits-color); } .currency-button.coins-button { background-color: var(--coins-color); } .cancel-button { background-color: var(--cancel-color); }
        #open-extension-helper { cursor: pointer; } .active-button { background-color: #007bff; color: white; font-weight: bold; }
    `;
    const manualExtensions = {
        '0_normal': [ { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 }, { id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 3, name: '3te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 4, name: '4te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 5, name: '5te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 }, { id: 7, name: '6te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 }, { id: 9, name: 'Großwache', cost: 1000000, coins: 50 }, { id: 10, name: '7te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 11, name: '8te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 12, name: '9te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 }, { id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 }, { id: 15, name: 'Netzersatzanlage 200', cost: 100000, coins: 20 }, { id: 16, name: 'Großlüfter', cost: 75000, coins: 15 }, { id: 17, name: '10te AB-Stellplatz', cost: 100000, coins: 20 }, { id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 }, { id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 }, { id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 }, { id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 }, { id: 22, name: '3te Anhänger Stellplatz', cost: 75000, coins: 15 }, { id: 23, name: '4te Anhänger Stellplatz', cost: 75000, coins: 15 }, { id: 24, name: '5te Anhänger Stellplatz', cost: 75000, coins: 15 }, { id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 }, { id: 26, name: '11te Ab-Stellplatz', cost: 150000, coins: 20 }, { id: 27, name: '12te Ab-Stellplatz', cost: 150000, coins: 20 },],
        '1_normal': [ { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },], '2_normal': [ { id: 0, name: 'Großwache', cost: 1000000, coins: 50 },], '3_normal': [ { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },], '4_normal': [ { id: 0, name: 'Allgemeine Innere', cost: 10000, coins: 10 },{ id: 1, name: 'Allgemeine Chirugie', cost: 10000, coins: 10 },{ id: 2, name: 'Gynäkologie', cost: 70000, coins: 15 },{ id: 3, name: 'Urologie', cost: 70000, coins: 15 },{ id: 4, name: 'Unfallchirugie', cost: 70000, coins: 15 },{ id: 5, name: 'Neurologie', cost: 70000, coins: 15 },{ id: 6, name: 'Neurochirugie', cost: 70000, coins: 15 },{ id: 7, name: 'Kardiologie', cost: 70000, coins: 15 },{ id: 8, name: 'Kardiochirugie', cost: 70000, coins: 15 },{ id: 9, name: 'Großkrankenhaus', cost: 200000, coins: 50 },], '5_normal': [ { id: 0, name: 'Windenrettung', cost: 200000, coins: 15 },], '6_normal': [ { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },{ id: 1, name: '2te Zelle', cost: 25000, coins: 5 },{ id: 2, name: '3te Zelle', cost: 25000, coins: 5 },{ id: 3, name: '4te Zelle', cost: 25000, coins: 5 },{ id: 4, name: '5te Zelle', cost: 25000, coins: 5 },{ id: 5, name: '6te Zelle', cost: 25000, coins: 5 },{ id: 6, name: '7te Zelle', cost: 25000, coins: 5 },{ id: 7, name: '8te Zelle', cost: 25000, coins: 5 },{ id: 8, name: '9te Zelle', cost: 25000, coins: 5 },{ id: 9, name: '10te Zelle', cost: 25000, coins: 5 },{ id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },{ id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },{ id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },{ id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },{ id: 14, name: 'Großwache', cost: 1000000, coins: 50 },{ id: 15, name: 'Großgewahrsam', cost: 200000, coins: 50 },], '8_normal': [ { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },], '9_normal': [ { id: 0, name: '1. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },{ id: 1, name: '1. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },{ id: 2, name: 'Fachgruppe Räumen', cost: 25000, coins: 5 },{ id: 3, name: 'Fachgruppe Wassergefahren', cost: 500000, coins: 15 },{ id: 4, name: '2. Technischer Zug - Bergungsgruppe', cost: 25000, coins: 5 },{ id: 5, name: '2. Technischer Zug: Fachgruppe Bergung/Notinstandsetzung', cost: 25000, coins: 5 },{ id: 6, name: '2. Technischer Zug: Zugtrupp', cost: 25000, coins: 5 },{ id: 7, name: 'Fachgruppe Ortung', cost: 450000, coins: 25 },{ id: 8, name: 'Fachgruppe Wasserschaden/Pumpen', cost: 200000, coins: 25 },{ id: 9, name: 'Fachruppe Schwere Bergung', cost: 200000, coins: 25 },{ id: 10, name: 'Fachgruppe Elektroversorgung', cost: 200000, coins: 25 },{ id: 11, name: 'Ortsverband-Mannschaftstransportwagen', cost: 50000, coins: 15 },{ id: 12, name: 'Trupp Unbenannte Luftfahrtsysteme', cost: 50000, coins: 15 },{ id: 13, name: 'Fachzug Führung und Kommunikation', cost: 300000, coins: 25 },], '10_normal': [ { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },], '11_normal': [ { id: 0, name: '2. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },{ id: 1, name: '3. Zug der 1. Hundertschaft', cost: 25000, coins: 5 },{ id: 2, name: 'Sonderfahrzeug: Gefangenenkraftwagen', cost: 25000, coins: 5 },{ id: 3, name: 'Technischer Zug: Wasserwerfer', cost: 25000, coins: 5 },{ id: 4, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },{ id: 5, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },{ id: 6, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },{ id: 7, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },{ id: 8, name: 'Diensthundestaffel', cost: 100000, coins: 10 },{ id: 9, name: 'Reiterstaffel', cost: 300000, coins: 25},{ id: 10, name: 'Lautsprecherkraftwagen', cost: 100000, coins: 10},], '12_normal': [ { id: 0, name: 'Führung', cost: 25000, coins: 5 },{ id: 1, name: 'Sanitätsdienst', cost: 25500, coins: 5 },{ id: 2, name: 'Wasserrettung', cost: 500000, coins: 25 },{ id: 3, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },{ id: 4, name: 'SEG-Drohne', cost: 50000, coins: 15 },{ id: 5, name: 'Betreuungs- und Verpflegungsdienst', cost: 200000, coins: 25 },], '13_normal': [ { id: 0, name: 'Außenlastbehälter', cost: 200000, coins: 15 },{ id: 1, name: 'Windenrettung', cost: 200000, coins: 15 },], '17_normal': [ { id: 0, name: 'SEK: 1. Zug', cost: 100000, coins: 10 },{ id: 1, name: 'SEK: 2. Zug', cost: 100000, coins: 10 },{ id: 2, name: 'MEK: 1. Zug', cost: 100000, coins: 10 },{ id: 3, name: 'MEK: 2. Zug', cost: 100000, coins: 10 },{ id: 4, name: 'Diensthundestaffel', cost: 100000, coins: 10 },], '0_small': [ { id: 0, name: 'Rettungsdienst', cost: 100000, coins: 20 },{ id: 1, name: '1te AB-Stellplatz', cost: 100000, coins: 20 },{ id: 2, name: '2te AB-Stellplatz', cost: 100000, coins: 20 },{ id: 6, name: 'Wasserrettung', cost: 400000, coins: 25 },{ id: 8, name: 'Flughafenfeuerwehr', cost: 300000, coins: 25 },{ id: 13, name: 'Werkfeuerwehr', cost: 100000, coins: 20 },{ id: 14, name: 'Netzersatzanlage 50', cost: 100000, coins: 20 },{ id: 16, name: 'Großlüfter', cost: 75000, coins: 25 },{ id: 18, name: 'Drohneneinheit', cost: 150000, coins: 25 },{ id: 19, name: 'Verpflegungsdienst', cost: 200000, coins: 25 },{ id: 20, name: '1te Anhänger Stellplatz', cost: 75000, coins: 15 },{ id: 21, name: '2te Anhänger Stellplatz', cost: 75000, coins: 15 },{ id: 25, name: 'Bahnrettung', cost: 125000, coins: 25 },], '6_small': [ { id: 0, name: '1te Zelle', cost: 25000, coins: 5 },{ id: 1, name: '2te Zelle', cost: 25000, coins: 5 },{ id: 10, name: 'Diensthundestaffel', cost: 100000, coins: 10 },{ id: 11, name: 'Kriminalpolizei', cost: 100000, coins: 20 },{ id: 12, name: 'Dienstgruppenleitung', cost: 200000, coins: 25 },{ id: 13, name: 'Motorradstaffel', cost: 75000, coins: 15 },], '24_normal': [ { id: 0, name: 'Reiterstaffel', cost: 300000, coins: 25 },{ id: 1, name: 'Reiterstaffel', cost: 300000, coins: 25 },{ id: 2, name: 'Reiterstaffel', cost: 300000, coins: 25 },{ id: 3, name: 'Reiterstaffel', cost: 300000, coins: 25 },{ id: 4, name: 'Reiterstaffel', cost: 300000, coins: 25 },{ id: 5, name: 'Reiterstaffel', cost: 300000, coins: 25 },], '25_normal': [ { id: 0, name: 'Höhenrettung', cost: 50000, coins: 25 },{ id: 1, name: 'Drohneneinheit', cost: 75000, coins: 25 },{ id: 2, name: 'Rettungshundestaffel', cost: 350000, coins: 25 },{ id: 3, name: 'Rettungsdienst', cost: 100000, coins: 20 },], '27_normal': [ { id: 0, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 1, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },{ id: 2, name: 'Weiterer Klassenraum', cost: 400000, coins: 40 },],
    };
    const manualStorageRooms = {
        '0_normal': [ { id: 'initial_containers', name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },{ id: 'additional_containers_1', name: '1te Zusätzlicher Lagerraum', cost: 50000, coins: 12, additionalStorage: 30 },{ id: 'additional_containers_2', name: '2te Zusätzlicher Lagerraum', cost: 50000, coins: 12, additionalStorage: 30 },{ id: 'additional_containers_3', name: '3te Zusätzlicher Lagerraum', cost: 100000, coins: 15, additionalStorage: 30 },{ id: 'additional_containers_4', name: '4te Zusätzlicher Lagerraum', cost: 100000, coins: 15, additionalStorage: 30 },{ id: 'additional_containers_5', name: '5te Zusätzlicher Lagerraum', cost: 100000, coins: 15, additionalStorage: 30 },{ id: 'additional_containers_6', name: '6te Zusätzlicher Lagerraum', cost: 100000, coins: 15, additionalStorage: 30 },{ id: 'additional_containers_7', name: '7te Zusätzlicher Lagerraum', cost: 100000, coins: 15, additionalStorage: 30 },],
        '0_small': [ { id: 'initial_containers', name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },{ id: 'additional_containers_1', name: '1te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },{ id: 'additional_containers_2', name: '2te Zusätzlicher Lagerraum', cost: 50000, coins: 10, additionalStorage: 30 },],
        '5_normal': [ { id: 'initial_containers', name: 'Lagerraum', cost: 25000, coins: 10, additionalStorage: 40 },],
    };
    const buildingTypeNames = { '0_normal': 'Feuerwache (Normal)', '0_small': 'Feuerwache (Kleinwache)', '1_normal': 'Feuerwehrschule', '2_normal': 'Rettungswache', '3_normal': 'Rettungsschule', '4_normal': 'Krankenhaus', '5_normal': 'Rettungshubschrauber-Station', '6_normal': 'Polizeiwache (Normal)', '6_small': 'Polizeiwache (Kleinwache)', '8_normal': 'Polizeischule', '9_normal': 'Technisches Hilfswerk', '10_normal': 'Technisches Hilfswerk - Bundesschule', '11_normal': 'Bereitschaftspolizei', '12_normal': 'Schnelleinsatzgruppe (SEG)', '13_normal': 'Polizeihubschrauber-Station', '17_normal': 'Polizei-Sondereinheiten', '24_normal': 'Reiterstaffel', '25_normal': 'Bergrettungswache', '27_normal': 'Schule für Seefahrt und Seenotrettung', };
    const SETTINGS_KEY = 'enabledExtensions';
    const defaultExtensionSettings = {};
    for (const category in manualExtensions) { for (const ext of manualExtensions[category]) { defaultExtensionSettings[`${category}_${ext.id}`] = true; } }
    for (const category in manualStorageRooms) { for (const room of manualStorageRooms[category]) { const key = `${category}_storage_${room.name.replace(/\s+/g, '_')}`; defaultExtensionSettings[key] = true; } }
    let buildingsData = [];
    let buildingGroups = {};
    const storageGroups = {};
    var user_premium = false;

    // Alle Funktionen werden hier definiert, bevor sie aufgerufen werden.

    // Unveränderte Originalfunktionen
    function saveExtensionSettings(settings) { GM_setValue(SETTINGS_KEY, settings); }
    function getExtensionSettings() { return { ...defaultExtensionSettings, ...GM_getValue(SETTINGS_KEY, {}) }; }
    function openExtensionSettingsOverlay() {
        const settings = getExtensionSettings();
        const overlay = document.createElement('div');
        Object.assign(overlay.style, { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 10001, overflowY: 'auto', });
        const panel = document.createElement('div');
        Object.assign(panel.style, { margin: '50px auto', padding: '20px', background: 'var(--background-color, #fff)', color: 'var(--text-color, #000)', borderRadius: '10px', maxWidth: '800px', boxShadow: '0 0 10px rgba(0,0,0,0.25)', });
        const description = document.createElement('div');
        description.style.marginBottom = '20px';
        const descHeading = document.createElement('h4');
        Object.assign(descHeading.style, { marginBottom: '10px', fontSize: '1.2em', lineHeight: '1.4', });
        descHeading.textContent = '🛠️ Erweiterungen & Lagerräume anpassen';
        description.appendChild(descHeading);
        const descText = document.createElement('p');
        descText.textContent = 'Gestalte deine Wachen individuell: Bestimme, welche Erweiterungen und Lagerräume du je Gebäude-Typ sehen möchtest. Deine Einstellungen werden gespeichert und beibehalten!';
        descText.style.lineHeight = '1.6';
        descText.style.margin = '0';
        description.appendChild(descText);
        panel.appendChild(description);
        const btnGroup = document.createElement('div');
        btnGroup.style.marginBottom = '10px';
        const extBtn = document.createElement('button');
        extBtn.id = 'tab-ext-btn';
        extBtn.className = 'tab-btn active';
        extBtn.textContent = 'Erweiterungen';
        Object.assign(extBtn.style, { background: '#007bff', color: 'white', padding: '6px 12px', marginRight: '6px', border: 'none', borderRadius: '4px', cursor: 'pointer', });
        const storageBtn = document.createElement('button');
        storageBtn.id = 'tab-storage-btn';
        storageBtn.className = 'tab-btn';
        storageBtn.textContent = 'Lagerräume';
        Object.assign(storageBtn.style, { background: 'transparent', color: 'var(--text-color, #000)', padding: '6px 12px', marginRight: '6px', border: '1px solid var(--border-color, #ccc)', borderRadius: '4px', cursor: 'pointer', });
        btnGroup.appendChild(extBtn);
        btnGroup.appendChild(storageBtn);
        panel.appendChild(btnGroup);
        const tabContent = document.createElement('div');
        tabContent.id = 'settings-tab-content';
        tabContent.style.margin = '20px 0';
        panel.appendChild(tabContent);
        function createSpoilerLegend(text) {
            const legend = document.createElement('legend');
            Object.assign(legend.style, { color: 'var(--text-color, #000)', borderBottom: '1px solid var(--border-color, #ccc)', padding: '6px 10px', marginBottom: '6px', cursor: 'pointer', userSelect: 'none', fontWeight: '600', fontSize: '0.95em', display: 'flex', alignItems: 'center', gap: '6px', });
            const arrow = document.createElement('span');
            arrow.textContent = '▶';
            arrow.style.transition = 'transform 0.2s ease';
            const labelText = document.createElement('span');
            labelText.textContent = text;
            legend.appendChild(arrow);
            legend.appendChild(labelText);
            return {legend, arrow};
        }
        function createExtensionForm() {
            const form = document.createElement('form');
            for (const category in manualExtensions) {
                const fieldset = document.createElement('fieldset');
                fieldset.style.marginBottom = '12px';
                const { legend, arrow } = createSpoilerLegend(buildingTypeNames[category] || category);
                const content = document.createElement('div');
                content.style.display = 'none';
                content.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
                content.style.gap = '8px';
                content.style.padding = '8px 0';
                const allLabel = document.createElement('label');
                allLabel.style.gridColumn = '1 / -1';
                allLabel.style.display = 'flex';
                allLabel.style.alignItems = 'center';
                allLabel.style.gap = '6px';
                allLabel.style.fontWeight = '500';
                const selectAllCheckbox = document.createElement('input');
                selectAllCheckbox.type = 'checkbox';
                const selectAllText = document.createElement('span');
                selectAllText.textContent = 'Alle Erweiterungen an-/abwählen';
                selectAllText.style.fontWeight = 'bold';
                selectAllText.style.color = 'var(--primary-color, #007bff)';
                allLabel.appendChild(selectAllCheckbox);
                allLabel.appendChild(selectAllText);
                content.appendChild(allLabel);
                const checkboxes = [];
                manualExtensions[category].slice().sort((a, b) => { const aAlpha = /^[A-Za-z]/.test(a.name); const bAlpha = /^[A-Za-z]/.test(b.name); if (aAlpha && !bAlpha) return -1; if (!aAlpha && bAlpha) return 1; return a.name.localeCompare(b.name, 'de', { numeric: true }); }).forEach(ext => {
                    const key = `${category}_${ext.id}`;
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'center';
                    label.style.gap = '6px';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = settings[key];
                    checkbox.dataset.key = key;
                    checkbox.addEventListener('change', () => { settings[key] = checkbox.checked; const allChecked = checkboxes.every(cb => cb.checked); selectAllCheckbox.checked = allChecked; });
                    label.appendChild(checkbox);
                    label.append(` ${ext.name}`);
                    content.appendChild(label);
                    checkboxes.push(checkbox);
                });
                selectAllCheckbox.checked = checkboxes.every(cb => cb.checked);
                selectAllCheckbox.addEventListener('change', () => { checkboxes.forEach(cb => { cb.checked = selectAllCheckbox.checked; settings[cb.dataset.key] = cb.checked; }); });
                legend.addEventListener('click', () => { const open = content.style.display === 'grid'; content.style.display = open ? 'none' : 'grid'; arrow.textContent = open ? '▶' : '▼'; });
                fieldset.appendChild(legend);
                fieldset.appendChild(content);
                form.appendChild(fieldset);
            }
            return form;
        }
        function createStorageForm() {
            const form = document.createElement('form');
            for (const category in manualStorageRooms) {
                const fieldset = document.createElement('fieldset');
                fieldset.style.marginBottom = '12px';
                const {legend, arrow} = createSpoilerLegend(buildingTypeNames[category] || category);
                const content = document.createElement('div');
                content.style.display = 'none';
                content.style.gridTemplateColumns = 'repeat(auto-fill, minmax(150px, 1fr))';
                content.style.gap = '8px';
                content.style.padding = '8px 0';
                const allLabel = document.createElement('label');
                allLabel.style.gridColumn = '1 / -1';
                allLabel.style.display = 'flex';
                allLabel.style.alignItems = 'center';
                allLabel.style.gap = '6px';
                allLabel.style.fontWeight = '500';
                const selectAllCheckbox = document.createElement('input');
                selectAllCheckbox.type = 'checkbox';
                const selectAllText = document.createElement('span');
                selectAllText.textContent = 'Alle Lagerräume an-/abwählen';
                selectAllText.style.fontWeight = 'bold';
                selectAllText.style.color = 'var(--primary-color, #007bff)';
                allLabel.appendChild(selectAllCheckbox);
                allLabel.appendChild(selectAllText);
                content.appendChild(allLabel);
                const checkboxes = [];
                manualStorageRooms[category].forEach(room => {
                    const key = `${category}_storage_${room.name.replace(/\s+/g, '_')}`;
                    const label = document.createElement('label');
                    label.style.display = 'flex';
                    label.style.alignItems = 'center';
                    label.style.gap = '6px';
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = settings[key];
                    checkbox.dataset.key = key;
                    checkbox.addEventListener('change', () => { settings[key] = checkbox.checked; const allChecked = checkboxes.every(cb => cb.checked); selectAllCheckbox.checked = allChecked; });
                    label.appendChild(checkbox);
                    label.append(` ${room.name}`);
                    content.appendChild(label);
                    checkboxes.push(checkbox);
                });
                selectAllCheckbox.checked = checkboxes.every(cb => cb.checked);
                selectAllCheckbox.addEventListener('change', () => { checkboxes.forEach(cb => { cb.checked = selectAllCheckbox.checked; settings[cb.dataset.key] = cb.checked; }); });
                legend.addEventListener('click', () => { const open = content.style.display === 'grid'; content.style.display = open ? 'none' : 'grid'; arrow.textContent = open ? '▶' : '▼'; });
                fieldset.appendChild(legend);
                fieldset.appendChild(content);
                form.appendChild(fieldset);
            }
            return form;
        }
        function setActiveTab(tabName) {
            if (tabName === 'extensions') {
                extBtn.classList.add('active');
                Object.assign(extBtn.style, {background: '#007bff', color: 'white', border: 'none'});
                storageBtn.classList.remove('active');
                Object.assign(storageBtn.style, {background: 'transparent', color: 'var(--text-color, #000)', border: '1px solid var(--border-color, #ccc)'});
                tabContent.innerHTML = '';
                tabContent.appendChild(createExtensionForm());
            } else {
                storageBtn.classList.add('active');
                Object.assign(storageBtn.style, {background: '#007bff', color: 'white', border: 'none'});
                extBtn.classList.remove('active');
                Object.assign(extBtn.style, {background: 'transparent', color: 'var(--text-color, #000)', border: '1px solid var(--border-color, #ccc)'});
                tabContent.innerHTML = '';
                tabContent.appendChild(createStorageForm());
            }
        }
        extBtn.addEventListener('click', () => setActiveTab('extensions'));
        storageBtn.addEventListener('click', () => setActiveTab('storage'));
        setActiveTab('extensions');
        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', });
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Speichern';
        Object.assign(saveBtn.style, { background: '#28a745', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', });
        saveBtn.addEventListener('click', () => { saveExtensionSettings(settings); alert('Deine Einstellungen wurden gespeichert. Die Seite wird neu geladen, um diese zu übernehmen.'); overlay.remove(); location.reload(); });
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Schließen';
        Object.assign(closeBtn.style, { backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', });
        closeBtn.addEventListener('click', () => overlay.remove());
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(closeBtn);
        panel.appendChild(buttonContainer);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
    }
    async function getUserMode() { try { const response = await fetch('https://www.leitstellenspiel.de/api/settings'); const data = await response.json(); return data; } catch (error) { console.error("Fehler beim Abrufen der Einstellungen: ", error); return null; } }
    async function applyMode(lightboxContent) {
        const userSettings = await getUserMode();
        if (!userSettings) { return; }
        const mode = userSettings.design_mode;
        lightboxContent.classList.remove('dark', 'light');
        if (mode === 1 || mode === 4) {
            lightboxContent.classList.add('dark');
            document.documentElement.style.setProperty('--background-color', '#333');
            document.documentElement.style.setProperty('--text-color', '#fff');
            document.documentElement.style.setProperty('--border-color', '#444');
        } else {
            lightboxContent.classList.add('light');
            document.documentElement.style.setProperty('--background-color', '#f2f2f2');
            document.documentElement.style.setProperty('--text-color', '#000');
            document.documentElement.style.setProperty('--border-color', '#ccc');
        }
    }
    function formatNumber(number) { return new Intl.NumberFormat('de-DE').format(number); }
    function getCSRFToken() { const meta = document.querySelector('meta[name="csrf-token"]'); return meta ? meta.getAttribute('content') : ''; }
    function getBuildingCaption(buildingId) {
        const building = buildingsData.find(b => String(b.id) === String(buildingId));
        if (building) { return building.caption; }
        return 'Unbekanntes Gebäude';
    }
    function fetchBuildingsAndRender() {
        fetch('https://www.leitstellenspiel.de/api/buildings')
            .then(response => { if (!response.ok) { throw new Error('Fehler beim Abrufen der Daten'); } return response.json(); })
            .then(data => { buildingsData = data; renderMissingExtensions(data); })
            .catch(error => { document.getElementById('extension-list').innerHTML = 'Fehler beim Laden der Gebäudedaten.'; });
    }
    function getLeitstelleName(building) {
        if (!building.leitstelle_building_id) return 'Keine Leitstelle';
        const leitstelle = buildingsData.find(b => b.id === building.leitstelle_building_id);
        return leitstelle ? leitstelle.caption : 'Unbekannt';
    }
    async function getUserCredits() {
        try { const response = await fetch('https://www.leitstellenspiel.de/api/userinfo'); if (!response.ok) { throw new Error('Fehler beim Abrufen der Credits und Coins'); } const data = await response.json(); return { credits: data.credits_user_current, coins: data.coins_user_current, premium: data.premium }; }
        catch (error) { console.error('Fehler beim Abrufen der Credits und Coins:', error); throw error; }
    }
    function prepareStorageGroup(groupKey, group, settings) {
        if (!storageGroups[groupKey]) storageGroups[groupKey] = [];
        group.forEach(({ building }) => {
            const baseKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const options = manualStorageRooms[baseKey];
            if (!options) return;
            const current = new Set((building.storage_upgrades || []).map(u => u.type_id));
            const missingExtensions = [];
            options.forEach(opt => {
                const id = opt.id;
                if (current.has(id)) return;
                const storageKey = `${baseKey}_storage_${opt.name.replace(/\s+/g, '_')}`;
                if (settings[storageKey] === false) return;
                missingExtensions.push({ id, cost: opt.cost, coins: opt.coins, isStorage: true, name: opt.name, additionalStorage: opt.additionalStorage });
            });
            if (missingExtensions.length > 0) {
                storageGroups[groupKey].push({ building, missingExtensions });
            }
        });
    }
    async function renderMissingExtensions(buildings) {
        const userInfo = await getUserCredits();
        const list = document.getElementById('extension-list');
        list.innerHTML = '';
        buildingGroups = {};
        Object.keys(storageGroups).forEach(k => delete storageGroups[k]);
        buildingsData = buildings;
        buildings.sort((a, b) => a.building_type === b.building_type ? a.caption.localeCompare(b.caption) : a.building_type - b.building_type);
        const settings = getExtensionSettings();
        buildings.forEach(building => {
            const baseKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const extensions = manualExtensions[baseKey];
            const storageOptions = manualStorageRooms[baseKey];
            if (!extensions && !storageOptions) return;
            const existingExtensions = new Set(building.extensions.map(e => e.type_id));
            const existingStorages = new Set((building.storage_upgrades || []).map(u => u.type_id));
            const allowedExtensions = (extensions || []).filter(ext => {
                const key = `${baseKey}_${ext.id}`;
                if (!settings[key] || isExtensionLimitReached(building, ext.id)) return false;
                if (existingExtensions.has(ext.id)) return false;
                const isForbidden = (forbiddenIds) => forbiddenIds.some(id => existingExtensions.has(id)) && !forbiddenIds.includes(ext.id);
                if (building.building_type === 6 && building.small_building) { return !isForbidden([10, 11, 12, 13]); }
                if (building.building_type === 0 && building.small_building) { return !isForbidden([0, 6, 8, 13, 14, 16, 18, 19, 25]); }
                return true;
            });
            const enabledStorages = (storageOptions || []).filter(opt => { const key = `${baseKey}_storage_${opt.name.replace(/\s+/g, '_')}`; return settings[key] !== false && !existingStorages.has(opt.id); });
            if (allowedExtensions.length === 0 && enabledStorages.length === 0) return;
            buildingGroups[baseKey] = buildingGroups[baseKey] || [];
            buildingGroups[baseKey].push({ building, missingExtensions: allowedExtensions });
            if (enabledStorages.length > 0) { prepareStorageGroup(baseKey, [{ building }], settings); }
        });
        Object.entries(buildingGroups).forEach(([groupKey, group]) => {
            const buildingType = buildingTypeNames[groupKey] || 'Unbekannt';
            const header = createHeader(buildingType);
            const buttons = createButtonContainer(groupKey, group);
            const hasEnabledStorage = group.some(({ building }) => { const baseKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`; const options = manualStorageRooms[baseKey]; if (!options) return false; return options.some(opt => { const key = `${baseKey}_storage_${opt.name.replace(/\s+/g, '_')}`; return settings[key] !== false; }); });
            if (buttons.lagerButton) { buttons.lagerButton.disabled = !hasEnabledStorage; buttons.lagerButton.style.opacity = hasEnabledStorage ? '1' : '0.5'; buttons.lagerButton.style.cursor = hasEnabledStorage ? 'pointer' : 'not-allowed'; if (!hasEnabledStorage) { buttons.lagerButton.title = 'Keine Lager-Erweiterung für diese Gruppe aktiviert'; } }
            const hasExtensions = group.some(({ missingExtensions }) => missingExtensions.length > 0);
            if (buttons.spoilerButton) { buttons.spoilerButton.disabled = !hasExtensions; buttons.spoilerButton.style.opacity = hasExtensions ? '1' : '0.5'; buttons.spoilerButton.style.cursor = hasExtensions ? 'pointer' : 'not-allowed'; if (!hasExtensions) { buttons.spoilerButton.title = 'Keine Erweiterungen zum Ausbau oder ausgewählt'; } }
            const spoilerWrapper = hasExtensions ? createSpoilerContentWrapper(buttons.spoilerButton) : null;
            if (spoilerWrapper) { const table = createExtensionTable(groupKey, group, userInfo, buttons.buildSelectedButton); spoilerWrapper.appendChild(table); }
            const lagerWrapper = buttons.lagerButton && hasEnabledStorage ? createLagerContentWrapper(buttons.lagerButton, group, userInfo, buttons.buildSelectedButton, groupKey) : null;
            list.append(header, buttons.container);
            if (spoilerWrapper) { list.appendChild(spoilerWrapper); }
            if (lagerWrapper) { list.appendChild(lagerWrapper); }
            if (spoilerWrapper && lagerWrapper) { spoilerWrapper.otherWrapper = lagerWrapper; lagerWrapper.otherWrapper = spoilerWrapper; }
        });
    }
    function createHeader(title) { const h = document.createElement('h4'); h.textContent = title; h.classList.add('building-header'); return h; }
    function createButtonContainer(groupKey, group) {
        const container = document.createElement('div'); container.classList.add('button-container');
        const spoilerButton = createButton('Erweiterungen anzeigen', ['btn', 'spoiler-button']);
        const canBuildStorage = group.some(({ building }) => { const key = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`; return manualStorageRooms.hasOwnProperty(key); });
        let lagerButton = null; if (canBuildStorage) { lagerButton = createButton('Lager anzeigen', ['btn', 'lager-button']); }
        const buildSelectedButton = createButton('Ausgewählte Erweiterungen/Lager bauen', ['btn', 'build-selected-button']); buildSelectedButton.disabled = true; buildSelectedButton.onclick = () => buildSelectedExtensions();
        const buildAllButton = createButton('Sämtliche Erweiterungen/Lager bei allen Wachen bauen', ['btn', 'build-all-button']); buildAllButton.onclick = () => showCurrencySelectionForAll(groupKey);
        [spoilerButton, lagerButton, buildSelectedButton, buildAllButton].filter(Boolean).forEach(btn => container.appendChild(btn));
        return { container, spoilerButton, lagerButton, buildSelectedButton };
    }
    function createButton(text, classes = []) { const btn = document.createElement('button'); btn.textContent = text; classes.forEach(cls => btn.classList.add(cls)); return btn; }
    function createSpoilerContentWrapper(spoilerButton) {
        const wrapper = document.createElement('div'); wrapper.className = 'spoiler-content'; wrapper.style.display = 'none';
        spoilerButton.addEventListener('click', () => {
            const show = wrapper.style.display !== 'block';
            if (wrapper.otherWrapper) { wrapper.otherWrapper.style.display = 'none'; const otherButton = wrapper.otherWrapper.associatedButton; if (otherButton) otherButton.textContent = 'Lager anzeigen'; }
            wrapper.style.display = show ? 'block' : 'none';
            spoilerButton.textContent = show ? 'Erweiterungen ausblenden' : 'Erweiterungen anzeigen';
            spoilerButton.classList.toggle('active-button', show);
            if (wrapper.otherWrapper && wrapper.otherWrapper.associatedButton) { wrapper.otherWrapper.associatedButton.classList.remove('active-button'); }
        });
        wrapper.associatedButton = spoilerButton;
        return wrapper;
    }
    function createLagerContentWrapper(lagerButton, group, userInfo, buildSelectedButton, currentGroupKey) {
        const wrapper = document.createElement('div'); wrapper.classList.add('lager-wrapper'); wrapper.style.display = 'none'; wrapper.style.marginTop = '10px';
        const lagerTable = createLagerTable(group, userInfo, buildSelectedButton, currentGroupKey);
        wrapper.appendChild(lagerTable);
        lagerButton.addEventListener('click', () => {
            const show = wrapper.style.display !== 'block';
            if (wrapper.otherWrapper) { wrapper.otherWrapper.style.display = 'none'; const otherButton = wrapper.otherWrapper.associatedButton; if (otherButton) otherButton.textContent = 'Erweiterungen anzeigen'; }
            wrapper.style.display = show ? 'block' : 'none';
            lagerButton.textContent = show ? 'Lager ausblenden' : 'Lager anzeigen';
            lagerButton.classList.toggle('active-button', show);
            if (wrapper.otherWrapper && wrapper.otherWrapper.associatedButton) { wrapper.otherWrapper.associatedButton.classList.remove('active-button'); }
        });
        wrapper.associatedButton = lagerButton;
        return wrapper;
    }
    function createExtensionTable(groupKey, group, userInfo) {
        const table = document.createElement('table'); table.innerHTML = `<thead><tr><th>Alle An- / Abwählen</th><th>Leitstelle</th><th>Wache/Gebäude</th><th>Baubare Erweiterungen</th><th>Bauen mit Credits</th><th>Bauen mit Coins</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        const filters = {};
        const filterRow = document.createElement('tr');
        const filterElements = {};
        const selectAllCell = document.createElement('th');
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox'; selectAllCheckbox.className = 'select-all-checkbox'; selectAllCheckbox.dataset.group = groupKey;
        selectAllCell.appendChild(selectAllCheckbox);
        filterRow.appendChild(selectAllCell);
        function createDropdownFilter(options, placeholder, colIndex) {
            const th = document.createElement('th');
            const select = document.createElement('select');
            select.innerHTML = `<option value="">🔽 ${placeholder}</option>`;
            [...new Set(options)].sort().forEach(opt => { const option = document.createElement('option'); option.value = opt; option.textContent = opt; select.appendChild(option); });
            select.addEventListener('change', () => { filters[colIndex] = select.value || undefined; applyAllFilters(); updateSelectAllCheckboxState(); });
            filterElements[colIndex] = select;
            th.appendChild(select);
            return th;
        }
        const leitstellen = group.map(g => getLeitstelleName(g.building));
        const wachen = group.map(g => g.building.caption);
        const erweiterungen = group.flatMap(g => g.missingExtensions.map(e => e.name));
        filterRow.appendChild(createDropdownFilter(leitstellen, 'Leitstelle', 1));
        filterRow.appendChild(createDropdownFilter(wachen, 'Wache', 2));
        filterRow.appendChild(createDropdownFilter(erweiterungen, 'Erweiterung', 3));
        const resetCell = document.createElement('th');
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Filter zurücksetzen';
        resetBtn.classList.add('btn', 'btn-sm', 'btn-primary');
        resetBtn.style.padding = '2px 6px';
        resetBtn.style.fontSize = '0.8em';
        resetBtn.onclick = () => { Object.values(filterElements).forEach(select => select.selectedIndex = 0); Object.keys(filters).forEach(k => delete filters[k]); applyAllFilters(); updateSelectAllCheckboxState(); };
        resetCell.appendChild(resetBtn);
        filterRow.appendChild(resetCell);
        filterRow.appendChild(document.createElement('th'));
        table.querySelector('thead').appendChild(filterRow);
        selectAllCheckbox.addEventListener('change', () => {
            tbody.querySelectorAll('tr').forEach(row => { if (row.style.display !== 'none') { const cb = row.querySelector('.extension-checkbox'); if (cb && !cb.disabled) cb.checked = selectAllCheckbox.checked; } });
            updateBuildSelectedButton(); updateSelectAllCheckboxState();
        });
        group.forEach(({ building, missingExtensions }) => {
            missingExtensions.forEach(extension => {
                if (isExtensionLimitReached(building, extension.id)) return;
                const row = document.createElement('tr'); row.classList.add(`row-${building.id}-${extension.id}`);
                const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'extension-checkbox'; checkbox.dataset.buildingId = building.id; checkbox.dataset.extensionId = extension.id; checkbox.disabled = userInfo.credits < extension.cost && userInfo.coins < extension.coins; checkbox.addEventListener('change', () => { updateBuildSelectedButton(); });
                row.innerHTML = `<td></td><td>${getLeitstelleName(building)}</td><td>${building.caption}</td><td>${extension.name}</td>`;
                row.children[0].appendChild(checkbox);
                const creditCell = document.createElement('td'); const creditBtn = document.createElement('button'); creditBtn.textContent = `${formatNumber(extension.cost)} Credits`; creditBtn.classList.add('btn', 'btn-xl', 'credit-button'); creditBtn.style.backgroundColor = '#28a745'; creditBtn.style.color = 'white'; creditBtn.disabled = userInfo.credits < extension.cost; creditBtn.onclick = () => buildExtension(building, extension.id, 'credits', extension.cost, row); creditCell.appendChild(creditBtn); row.appendChild(creditCell);
                const coinsCell = document.createElement('td'); const coinBtn = document.createElement('button'); coinBtn.textContent = `${extension.coins} Coins`; coinBtn.classList.add('btn', 'btn-xl', 'coins-button'); coinBtn.style.backgroundColor = '#dc3545'; coinBtn.style.color = 'white'; coinBtn.disabled = userInfo.coins < extension.coins; coinBtn.onclick = () => buildExtension(building, extension.id, 'coins', extension.coins, row); coinsCell.appendChild(coinBtn); row.appendChild(coinsCell);
                tbody.appendChild(row);
            });
        });
        function applyAllFilters() {
            table.querySelectorAll('tbody tr').forEach(row => {
                let visible = true;
                Object.entries(filters).forEach(([i, val]) => { const text = row.children[i]?.textContent.toLowerCase().trim(); if (val && text !== val.toLowerCase()) visible = false; });
                row.style.display = visible ? '' : 'none';
            });
        }
        function updateSelectAllCheckboxState() {
            let total = 0, checked = 0;
            tbody.querySelectorAll('tr').forEach(row => { if (row.style.display !== 'none') { const cb = row.querySelector('.extension-checkbox'); if (cb && !cb.disabled) { total++; if (cb.checked) checked++; } } });
            selectAllCheckbox.checked = total > 0 && total === checked;
            selectAllCheckbox.indeterminate = checked > 0 && checked < total;
        }
        return table;
    }
    function createLagerTable(group, userInfo, buildSelectedButton, currentGroupKey) {
        const table = document.createElement('table');
        table.innerHTML = `<thead><tr><th>Alle An- / Abwählen</th><th>Leitstelle</th><th>Wache</th><th>Baubare Lager</th><th>Lagerkapazität</th><th>Credits</th><th>Coins</th></tr></thead><tbody></tbody>`;
        const tbody = table.querySelector('tbody');
        const filters = {};
        const filterElements = {};
        const filterRow = document.createElement('tr');
        const selectAllCell = document.createElement('th');
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'select-all-checkbox-lager';
        selectAllCell.appendChild(selectAllCheckbox);
        filterRow.appendChild(selectAllCell);
        function createDropdownFilter(options, placeholder, colIndex) {
            const th = document.createElement('th');
            const select = document.createElement('select');
            select.innerHTML = `<option value="">🔽 ${placeholder}</option>`;
            [...new Set(options)].sort().forEach(opt => { const option = document.createElement('option'); option.value = opt; option.textContent = opt; select.appendChild(option); });
            select.addEventListener('change', () => { filters[colIndex] = select.value || undefined; applyAllFilters(); updateSelectAllCheckboxState(); });
            filterElements[colIndex] = select;
            th.appendChild(select);
            return th;
        }
        const leitstellen = [];
        const wachen = [];
        const lagerArten = [];
        (storageGroups[currentGroupKey] || []).forEach(({ building, missingExtensions }) => {
            missingExtensions.forEach(opt => {
                leitstellen.push(getLeitstelleName(building));
                wachen.push(building.caption);
                lagerArten.push(opt.name);
                const row = document.createElement('tr'); row.classList.add(`storage-row-${building.id}-${opt.id}`);
                const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'storage-checkbox'; checkbox.dataset.buildingId = building.id; checkbox.dataset.storageType = opt.id; checkbox.disabled = userInfo.credits < opt.cost && userInfo.coins < opt.coins; checkbox.addEventListener('change', () => { updateBuildSelectedButton(); });
                const checkboxCell = document.createElement('td'); checkboxCell.appendChild(checkbox); row.appendChild(checkboxCell);
                [getLeitstelleName(building), building.caption, opt.name, `+${opt.additionalStorage}`].forEach(text => { const td = document.createElement('td'); td.textContent = text; row.appendChild(td); });
                const creditCell = document.createElement('td'); const creditBtn = document.createElement('button'); creditBtn.textContent = `${formatNumber(opt.cost)} Credits`; creditBtn.classList.add('btn', 'btn-xl', 'credit-button'); creditBtn.style.backgroundColor = '#28a745'; creditBtn.style.color = 'white'; creditBtn.disabled = userInfo.credits < opt.cost; creditBtn.onclick = () => { buildStorage(building, opt.id, 'credits', opt.cost, row); }; creditCell.appendChild(creditBtn); row.appendChild(creditCell);
                const coinsCell = document.createElement('td'); const coinBtn = document.createElement('button'); coinBtn.textContent = `${opt.coins} Coins`; coinBtn.classList.add('btn', 'btn-xl', 'coins-button'); coinBtn.style.backgroundColor = '#dc3545'; coinBtn.style.color = 'white'; coinBtn.disabled = userInfo.coins < opt.coins; coinBtn.onclick = () => { buildStorage(building, opt.id, 'coins', opt.coins, row); }; coinsCell.appendChild(coinBtn); row.appendChild(coinsCell);
                tbody.appendChild(row);
            });
        });
        filterRow.appendChild(createDropdownFilter(leitstellen, 'Leitstelle', 1));
        filterRow.appendChild(createDropdownFilter(wachen, 'Wache', 2));
        filterRow.appendChild(createDropdownFilter(lagerArten, 'Erweiterung', 3));
        const resetCell = document.createElement('th');
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Filter zurücksetzen';
        resetBtn.classList.add('btn', 'btn-sm', 'btn-primary');
        resetBtn.style.padding = '2px 6px';
        resetBtn.style.fontSize = '0.8em';
        resetBtn.onclick = () => { Object.values(filterElements).forEach(select => select.selectedIndex = 0); Object.keys(filters).forEach(k => delete filters[k]); applyAllFilters(); updateSelectAllCheckboxState(); };
        resetCell.appendChild(resetBtn);
        filterRow.appendChild(resetCell);
        filterRow.appendChild(document.createElement('th'));
        table.querySelector('thead').appendChild(filterRow);
        selectAllCheckbox.addEventListener('change', () => {
            tbody.querySelectorAll('tr').forEach(row => { if (row.style.display !== 'none') { const cb = row.querySelector('.storage-checkbox'); if (cb && !cb.disabled) cb.checked = selectAllCheckbox.checked; } });
            updateSelectAllCheckboxState(); updateBuildSelectedButton();
        });
        function applyAllFilters() {
            tbody.querySelectorAll('tr').forEach(row => {
                let visible = true;
                Object.entries(filters).forEach(([i, val]) => { const text = row.children[i]?.textContent.toLowerCase().trim(); if (val && text !== val.toLowerCase()) visible = false; });
                row.style.display = visible ? '' : 'none';
            });
        }
        function updateSelectAllCheckboxState() {
            const visibleRows = [...tbody.querySelectorAll('tr')].filter(row => row.style.display !== 'none');
            if (visibleRows.length === 0) { selectAllCheckbox.checked = false; selectAllCheckbox.indeterminate = false; selectAllCheckbox.disabled = true; return; }
            selectAllCheckbox.disabled = false;
            const allChecked = visibleRows.every(row => row.querySelector('.storage-checkbox').checked || row.querySelector('.storage-checkbox').disabled);
            const noneChecked = visibleRows.every(row => !row.querySelector('.storage-checkbox').checked);
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
        }
        updateSelectAllCheckboxState();
        return table;
    }
    function isExtensionLimitReached(building, extensionId) {
        const fireStationSmallLimited = [0, 6, 8, 13, 14, 16, 18, 19, 25];
        const policeStationSmallLimited = [10, 11, 12, 13];
        if (user_premium) { return false; }
        if ([1, 3, 8, 10, 27].includes(building.building_type)) { if (extensionId === 2) { return !building.extensions.some(ext => ext.type_id === 0); } }
        if (building.building_type === 0 && building.small_building) { if (fireStationSmallLimited.includes(extensionId)) { return building.extensions.some(ext => fireStationSmallLimited.includes(ext.type_id)); } }
        if (building.building_type === 6 && building.small_building) { if (policeStationSmallLimited.includes(extensionId)) { return building.extensions.some(ext => policeStationSmallLimited.includes(ext.type_id)); } }
        return false;
    }

    // Block 1: Zentrale Bau- und Hilfsfunktionen
    async function retry(fn, extensionName, buildingName, maxRetries = 10, delay = 1000) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                console.warn(`[Erweiterungs-Manager] Bau von "${extensionName}" in "${buildingName}" fehlgeschlagen (Versuch ${i + 1}/${maxRetries}). Fehler: ${error}. Nächster Versuch in ${delay/1000}s.`);
                await new Promise(res => setTimeout(res, delay));
            }
        }
        throw lastError;
    }
    async function buildExtension(building, extensionId, currency, amount, row) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCSRFToken();
            const buildUrl = `/buildings/${building.id}/extension/${currency}/${extensionId}`;
            GM_xmlhttpRequest({
                method: 'POST', url: buildUrl, headers: { 'X-CSRF-Token': csrfToken, 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 15000,
                onload: function(response) {
                    if (response.status === 200 && response.responseText.includes('alert-success')) {
                        if (row) { row.classList.add("built"); row.style.display = "none"; }
                        resolve(response);
                    } else {
                        reject(`Server hat den Bau nicht bestätigt (Status: ${response.status})`);
                    }
                },
                onerror: (error) => reject("Netzwerkfehler"),
                ontimeout: () => reject("Timeout")
            });
        });
    }
    async function buildStorage(building, storageId, currency, cost, row) {
        return new Promise((resolve, reject) => {
            const csrfToken = getCSRFToken();
            const buildUrl = `https://www.leitstellenspiel.de/buildings/${building.id}/storage_upgrade/${currency}/${storageId}?redirect_building_id=${building.id}`;
            GM_xmlhttpRequest({
                method: 'POST', url: buildUrl, headers: { 'X-CSRF-Token': csrfToken, 'Content-Type': 'application/x-www-form-urlencoded' }, data: '', withCredentials: true, timeout: 15000,
                onload: function(response) {
                    if (response.status === 200 && response.responseText.includes('alert-success')) {
                        if (row) { row.classList.add("built"); row.style.display = "none"; }
                        resolve(response);
                    } else {
                        reject(`Server hat den Bau nicht bestätigt (Status: ${response.status})`);
                    }
                },
                onerror: (error) => reject("Netzwerkfehler"),
                ontimeout: () => reject("Timeout")
            });
        });
    }
    async function createProgressBar(totalExtensions) {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);
        const progressContainer = document.createElement('div');
        Object.assign(progressContainer.style, { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', width: '300px', textAlign: 'center', zIndex: '10002', background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000' });
        const progressText = document.createElement('p');
        progressText.textContent = `0 / ${totalExtensions} gebaut`;
        Object.assign(progressText.style, { fontWeight: 'bold', fontSize: '16px' });
        const progressBar = document.createElement('div');
        Object.assign(progressBar.style, { width: '100%', background: isDarkMode ? '#555' : '#ddd', borderRadius: '5px', marginTop: '10px', overflow: 'hidden' });
        const progressFill = document.createElement('div');
        Object.assign(progressFill.style, { width: '0%', height: '20px', background: '#4caf50', borderRadius: '5px' });
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBar);
        document.body.appendChild(progressContainer);
        progressContainer.dataset.totalTasks = totalExtensions;
        return { progressContainer, progressText, progressFill, totalTasks: totalExtensions };
    }
    function updateProgress(builtCount, totalExtensions, progressText, progressFill) {
        progressText.textContent = `${builtCount} / ${totalExtensions} gebaut`;
        progressFill.style.width = `${Math.min(100, (builtCount / totalExtensions) * 100)}%`;
    }
    function removeProgressBar(progressContainer) {
        setTimeout(() => { if (document.body.contains(progressContainer)) { document.body.removeChild(progressContainer); } }, 2000);
    }
    async function buildTasksConcurrently(tasksToProcess, currency) {
        const CONCURRENCY_LIMIT = 10;
        if (tasksToProcess.length === 0) { alert("Keine Aufgaben zum Bauen gefunden."); return; }
        console.log(`[Erweiterungs-Manager] Starte Bau von ${tasksToProcess.length} Erweiterungen mit bis zu ${CONCURRENCY_LIMIT} parallelen Workern.`);
        const { progressContainer, progressText, progressFill, totalTasks } = await createProgressBar(tasksToProcess.length);
        let builtCount = 0;
        let failedCount = 0;

        const worker = async (workerId) => {
            while (tasksToProcess.length > 0) {
                const task = tasksToProcess.shift();
                if (!task) continue;
                const { building, extension, isStorage, row } = task;
                const cost = currency === 'credits' ? extension.cost : extension.coins;

                try {
                    const buildFn = () => isStorage ? buildStorage(building, extension.id, currency, cost, row) : buildExtension(building, extension.id, currency, cost, row);
                    await retry(buildFn, extension.name || extension.id, building.caption);
                    builtCount++;
                    console.log(`%c[Erweiterungs-Manager] ERFOLG: "${extension.name || extension.id}" in "${building.caption}" gebaut. (${builtCount}/${totalTasks})`, "color: green");
                } catch (error) {
                    failedCount++;
                    console.error(`%c[Erweiterungs-Manager] FEHLER: Bau von "${extension.name || extension.id}" in "${building.caption}" endgültig fehlgeschlagen.`, "color: red", error);
                }
                updateProgress(builtCount, totalTasks, progressText, progressFill);
            }
        };

        const workerPromises = Array.from({ length: CONCURRENCY_LIMIT }, (_, i) => worker(i + 1));
        await Promise.all(workerPromises);

        console.log(`[Erweiterungs-Manager] Alle Bauvorgänge abgeschlossen. Erfolgreich: ${builtCount}, Fehlgeschlagen: ${failedCount}.`);
        removeProgressBar(progressContainer);
    }

    // Block 3: Funktionen, die von den UI-Buttons aufgerufen werden
    async function buildSelectedExtensions() {
        const selectedExtensionsCheckboxes = document.querySelectorAll('.extension-checkbox:checked');
        const selectedStoragesCheckboxes = document.querySelectorAll('.storage-checkbox:checked');
        const tasks = [];
        let totalCredits = 0;
        let totalCoins = 0;
        selectedExtensionsCheckboxes.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const extensionId = parseInt(checkbox.dataset.extensionId, 10);
            const building = buildingsData.find(b => b.id.toString() === buildingId);
            if (!building) return;
            const groupKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const extension = manualExtensions[groupKey]?.find(e => e.id === extensionId);
            const row = checkbox.closest('tr');
            if (extension && row) {
                tasks.push({ building, extension, isStorage: false, row });
                totalCredits += extension.cost;
                totalCoins += extension.coins;
            }
        });
        selectedStoragesCheckboxes.forEach(checkbox => {
            const buildingId = checkbox.dataset.buildingId;
            const storageType = checkbox.dataset.storageType;
            const building = buildingsData.find(b => b.id.toString() === buildingId);
            if (!building) return;
            const groupKey = `${building.building_type}_${building.small_building ? 'small' : 'normal'}`;
            const storage = manualStorageRooms[groupKey]?.find(s => s.id === storageType);
            const row = checkbox.closest('tr');
            if (storage && row) {
                tasks.push({ building, extension: { ...storage, id: storage.id, name: storage.name }, isStorage: true, row });
                totalCredits += storage.cost;
                totalCoins += storage.coins;
            }
        });
        showCurrencySelectionForTasks(tasks, totalCredits, totalCoins);
    }
    async function showCurrencySelectionForAll(groupKey) {
        const tasks = [];
        let totalCredits = 0;
        let totalCoins = 0;
        const wachenGroup = buildingGroups[groupKey] || [];
        const lagerGroup = storageGroups[groupKey] || [];
        wachenGroup.forEach(({ building, missingExtensions }) => missingExtensions.forEach(extension => {
            if (!isExtensionLimitReached(building, extension.id)) {
                const row = document.querySelector(`.row-${building.id}-${extension.id}`);
                tasks.push({ building, extension, isStorage: false, row });
                totalCredits += extension.cost;
                totalCoins += extension.coins;
            }
        }));
        lagerGroup.forEach(({ building, missingExtensions }) => missingExtensions.forEach(storage => {
            const row = document.querySelector(`.storage-row-${building.id}-${storage.id}`);
            tasks.push({ building, extension: storage, isStorage: true, row });
            totalCredits += storage.cost;
            totalCoins += storage.coins;
        }));
        showCurrencySelectionForTasks(tasks, totalCredits, totalCoins);
    }
    async function showCurrencySelectionForTasks(tasks, totalCredits, totalCoins) {
        const userInfo = await getUserCredits();
        const fehlendeCredits = Math.max(0, totalCredits - userInfo.credits);
        const fehlendeCoins = Math.max(0, totalCoins - userInfo.coins);
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);
        if (userInfo.credits < totalCredits && userInfo.coins < totalCoins) {
            alert(`Du hast nicht genug Ressourcen!\n\n- Fehlende Credits: ${formatNumber(fehlendeCredits)}\n- Fehlende Coins: ${formatNumber(fehlendeCoins)}`);
            return;
        }
        const selectionDiv = document.createElement('div');
        selectionDiv.className = 'currency-selection';
        Object.assign(selectionDiv.style, { background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#ccc' });
        const totalText = document.createElement('p');
        totalText.innerHTML = `Wähle die Währung für ${tasks.length} Ausbauten:`;
        selectionDiv.appendChild(totalText);
        const creditsButton = document.createElement('button');
        creditsButton.className = 'currency-button credits-button';
        creditsButton.textContent = `${formatNumber(totalCredits)} Credits`;
        creditsButton.disabled = userInfo.credits < totalCredits;
        creditsButton.onclick = () => { document.body.removeChild(selectionDiv); buildTasksConcurrently(tasks, 'credits'); };
        const coinsButton = document.createElement('button');
        coinsButton.className = 'currency-button coins-button';
        coinsButton.textContent = `${formatNumber(totalCoins)} Coins`;
        coinsButton.disabled = userInfo.coins < totalCoins;
        coinsButton.onclick = () => { document.body.removeChild(selectionDiv); buildTasksConcurrently(tasks, 'coins'); };
        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancel-button';
        cancelButton.textContent = 'Abbrechen';
        cancelButton.onclick = () => document.body.removeChild(selectionDiv);
        selectionDiv.appendChild(creditsButton);
        selectionDiv.appendChild(coinsButton);
        selectionDiv.appendChild(cancelButton);
        document.body.appendChild(selectionDiv);
    }
    function updateBuildSelectedButton() {
        document.querySelectorAll('.build-selected-button').forEach(button => {
            const selectedCount = document.querySelectorAll('.extension-checkbox:checked, .storage-checkbox:checked').length;
            button.disabled = selectedCount === 0;
        });
    }

    // Block 4: Initialisierung (unverändert vom Original)
    document.addEventListener('change', (e) => {
        if (e.target.matches('.extension-checkbox, .storage-checkbox, .select-all-checkbox, .select-all-checkbox-lager')) {
            updateBuildSelectedButton();
        }
    });
    function checkPremiumStatus() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var scriptContent = scripts[i].textContent;
            var premiumMatch = scriptContent.match(/var user_premium\s*=\s*(true|false);/);
            if (premiumMatch) { user_premium = (premiumMatch[1] === 'true'); break; }
        }
        if (typeof user_premium === 'undefined') { console.error("Die Variable 'user_premium' ist nicht definiert."); user_premium = false; }
    }
    async function checkPremiumAndShowHint() {
        const userSettings = await getUserMode();
        const isDarkMode = userSettings && (userSettings.design_mode === 1 || userSettings.design_mode === 4);
        function createCustomAlert(message, isDarkMode, callback) {
            const alertDiv = document.createElement('div');
            Object.assign(alertDiv.style, { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px', border: '1px solid', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0,0,0,0.2)', width: '300px', textAlign: 'center', zIndex: '10002', background: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', borderColor: isDarkMode ? '#444' : '#ccc' });
            const alertText = document.createElement('p');
            alertText.textContent = message;
            alertDiv.appendChild(alertText);
            const closeButton = document.createElement('button');
            closeButton.textContent = 'OK';
            Object.assign(closeButton.style, { marginTop: '10px', padding: '5px 10px', border: 'none', cursor: 'pointer', borderRadius: '4px', backgroundColor: isDarkMode ? '#444' : '#007bff', color: '#fff' });
            closeButton.onclick = () => { document.body.removeChild(alertDiv); callback(); };
            alertDiv.appendChild(closeButton);
            document.body.appendChild(alertDiv);
        }
        if (document.getElementById('extension-lightbox')?.style.display === 'flex') return;
        if (typeof user_premium !== 'undefined') {
            if (!user_premium) {
                createCustomAlert("Du kannst dieses Script nur mit Einschränkungen nutzen da du keinen Premium-Account hast.", isDarkMode, () => {
                    document.getElementById('extension-lightbox').style.display = 'flex';
                    fetchBuildingsAndRender();
                });
            } else {
                document.getElementById('extension-lightbox').style.display = 'flex';
                fetchBuildingsAndRender();
            }
        } else { console.error("Die Variable 'user_premium' ist nicht definiert."); }
    }
    function addMenuButton() {
        const profileMenu = document.querySelector('#menu_profile + .dropdown-menu');
        if (!profileMenu) { console.error('Profilmenü (#menu_profile + .dropdown-menu) nicht gefunden.'); return; }
        if (profileMenu.querySelector('#open-extension-helper')) return;
        const menuButton = document.createElement('li');
        menuButton.setAttribute('role', 'presentation');
        const link = document.createElement('a');
        link.id = 'open-extension-helper';
        link.href = '#';
        link.innerHTML = `<span class="glyphicon glyphicon-wrench"></span>&nbsp;&nbsp; Erweiterungs-Manager`;
        link.addEventListener('click', (e) => { e.preventDefault(); checkPremiumAndShowHint(); });
        menuButton.appendChild(link);
        const divider = profileMenu.querySelector('li.divider');
        if (divider) { profileMenu.insertBefore(menuButton, divider); } else { profileMenu.appendChild(menuButton); }
    }

    // Skriptstart
    window.addEventListener('load', () => {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = styles;
        document.head.appendChild(styleElement);

        const lightbox = document.createElement('div');
        lightbox.id = 'extension-lightbox';
        lightbox.style.display = 'none';
        lightbox.innerHTML = `<div id="extension-lightbox-content"><button id="close-extension-helper">Schließen</button><h3>🚒🏗️ <strong>Herzlich willkommen beim ultimativen Ausbau-Assistenten für eure Wachen!</strong> 🚒🏗️</h3><h2><br>Dem Erweiterungs-Manager</h2><h5><br><br>Dieses kleine Helferlein zeigt euch genau, wo noch Platz in euren Wachen ist: Welche <strong>Erweiterungen</strong> und <strong>Lagerräume</strong> noch möglich sind – und mit nur ein paar Klicks geht’s direkt in den Ausbau. Einfacher wird’s nicht!<br><br>Und das Beste: Über den <button id="open-extension-settings" style="font-weight: 600; color: #fff; background-color: var(--primary-color, #007bff); border: none; padding: 6px 14px; border-radius: 5px; cursor: pointer; transition: background-color 0.3s ease; margin: 0 5px;">Einstellungen</button>-Button könnt ihr festlegen, welche Erweiterungen und Lagerräume euch pro Wachen-Typ angezeigt werden – ganz nach eurem Geschmack. Einmal gespeichert, für immer gemerkt.<br><br>Kleiner Hinweis am Rande: Feedback, Verbesserungsvorschläge oder Kritik zum Skript sind jederzeit im<a href="https://forum.leitstellenspiel.de/index.php?thread/27856-script-erweiterungs-manager/" target="_blank" style="color:#007bff; text-decoration:none;"><strong>Forum</strong></a> willkommen. 💌<br><br><br>Und nun viel Spaß beim Credits oder Coins ausgeben!<br><br><div id="extension-list">Einen Moment Geduld bitte …<br><br>Gebäudedaten werden geladen, Kaffee kocht – gleich geht's los!</div></h5></div>`;
        document.body.appendChild(lightbox);

        document.getElementById('close-extension-helper').addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        const openSettingsBtn = document.getElementById('open-extension-settings');
        openSettingsBtn.addEventListener('click', openExtensionSettingsOverlay);

        checkPremiumStatus();
        addMenuButton();
    });

})();