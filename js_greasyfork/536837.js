// ==UserScript==
// @name         LSS - Fehlende Fahrzeuge Nachalarmieren (mit Best-Effort-Button)
// @namespace    http://tampermonkey.net/
// @version      1.48.0.0
// @description  Fügt Buttons im Alarmfenster hinzu, schließt Care Vehicles aus und bietet eine "Best-Effort"-Auswahl
// @author       Gemeinschaftsprojekt (modifiziert by AI)
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536837/LSS%20-%20Fehlende%20Fahrzeuge%20Nachalarmieren%20%28mit%20Best-Effort-Button%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536837/LSS%20-%20Fehlende%20Fahrzeuge%20Nachalarmieren%20%28mit%20Best-Effort-Button%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INITIAL_DELAY_MS = 500; // Initial delay before checking for the alarm window and adding the button
    const CHECKBOX_DELAY_MS = 50; // Verzögerung zwischen den einzelnen Checkbox-Klicks (reduziert für schnellere Aktivierung)
    const RELOAD_WAIT_MS = 2000;
    const MAX_RELOAD_ATTEMPTS = 8; // Max. Nachladeversuche auf 8 gesetzt

    // Define Care Vehicles by their names and IDs.
    // These are vehicles that should be excluded from the *primary* alarm calculation
    // and instead handled by the separate processCareVehicleRequirements function,
    // which relies on external LSSM variables (window.LSS_Care_Required...).
    const CARE_VEHICLE_NAMES = [
        'GW-Bt', 'Bt-Kombi', 'FKH', 'Bt LKW', 'GW-Verpflegung', 'GW-Küche', 'MTW-Verpflegung', 'AB-Küche'
    ];
    const CARE_VEHICLE_IDS = [130, 131, 132, 133, 138, 139, 140, 141, 142].map(String);


    // Hotkey configuration
    const HOTKEY_CONFIG = {
        ALARM_MISSING_ALL: 't', // Hotkey for "Alles wählen"
        ALARM_MISSING_EMS: 'r',  // Hotkey for "Rettungsdienst wählen"
        ALARM_ALL_AND_NEXT: 'f', // Hotkey for "Alles wählen & alarmieren"
        ALARM_EMS_AND_NEXT: 'g',  // Hotkey for "RD wählen & alarmieren"
        ALARM_BEST_EFFORT: 'z' // Hotkey for the new "Best Effort" button
    };

    // NEF/RTH rule for EMS alarm with silent patients
    // Defines how many units are requested per 10 total patients (using Math.ceil((totalPatients/10)*VALUE)).
    const NEF_PER_10_SILENT_PATIENTS = 2; // Number of NEF-equivalents (IDs 29, 31, 149, 157)
    const RTH_PER_10_SILENT_PATIENTS = 2; // Number of RTHs (IDs 31, 157)

    // Constants for distance/time calculation (from _1.json)
    const AVERAGE_SPEED_KMH = 65; // km/h
    const SECONDS_PER_HOUR = 3600; // s/h
    const METERS_PER_KILOMETER = 1000; // m/km

    // Schlauchwagen bonus for water
    const SCHLAUCHWAGEN_BONUS_PERCENTAGE = 0.25; // 25% bonus per Schlauchwagen

    // --- Original LSS_VEHICLE_TYPE_DEFINITIONS from 1.42.0.txt ---
    const LSS_VEHICLE_TYPE_DEFINITIONS = [
        { id: '0', name: 'LF 20' }, { id: '1', name: 'LF 10' }, { id: '2', name: 'DLK 23' }, { id: '3', name: 'ELW 1' },
        { id: '4', name: 'RW' }, { id: '5', 'name': 'GW-A' }, { id: '6', name: 'LF 8/6' }, { id: '7', name: 'LF 20/16' },
        { id: '8', name: 'LF 10/6' }, { id: '9', name: 'LF 16-TS' }, { id: '10', name: 'GW-Öl' }, { id: '11', name: 'GW-L2-Wasser' },
        { id: '12', name: 'GW-Messtechnik' }, { id: '13', name: 'SW 1000' }, { id: '14', name: 'SW 2000' }, { id: '15', name: 'SW 2000-Tr' },
        { id: '16', name: 'SW Kats' }, { id: '17', name: 'TLF 2000' }, { id: '18', name: 'TLF 3000' }, { id: '19', name: 'TLF 8/8' },
        { id: '20', name: 'TLF 8/18' }, { id: '21', name: 'TLF 16/24-Tr' }, { id: '22', name: 'TLF 16/25' }, { id: '23', name: 'TLF 16/45' },
        { id: '24', name: 'TLF 20/40' }, { id: '25', name: 'TLF 20/40-SL' }, { id: '26', name: 'TLF 16' }, { id: '27', name: 'GW-Gefahrgut' },
        { id: '28', name: 'RTW' }, { id: '29', name: 'NEF' }, { id: '30', name: 'HLF 20' }, { id: '31', name: 'RTH' },
        { id: '32', name: 'FuStW' }, { id: '33', name: 'GW-Höhenrettung' }, { id: '34', name: 'ELW 2' }, { id: '35', name: 'leBefKw' },
        { id: '36', name: 'MTW' }, { id: '37', name: 'TSF-W' }, { id: '38', name: 'KTW' }, { id: '39', name: 'GKW' },
        { id: '40', name: 'MTW-TZ' }, { id: '41', name: 'MzGW (FGr N)' }, { id: '43', 'name': 'BRmG R' },
        { id: '44', name: 'Anh DLE' }, { id: '45', name: 'MLW 5' }, { id: '46', name: 'WLF' }, { id: '47', name: 'AB-Rüst' },
        { id: '48', name: 'AB-Atemschutz' }, { id: '49', name: 'AB-Öl' }, { id: '50', name: 'GruKw' }, { id: '51', name: 'FüKW (Polizei)' },
        { id: '52', 'name': 'GefKw' }, { id: '53', name: 'Dekon-P' }, { id: '54', name: 'AB-Dekon-P' }, { id: '55', name: 'KdoW-LNA' },
        { id: '56', name: 'KdoW-OrgL' }, { id: '57', name: 'FwK' }, { id: '58', name: 'KTW Typ B' }, { id: '59', name: 'ELW 1 (SEG)' },
        { id: '60', name: 'GW-San' }, { id: '61', name: 'Polizeihubschrauber' }, { id: '62', name: 'AB-Schlauch' }, { id: '63', name: 'GW-Taucher' },
        { id: '64', name: 'GW-Wasserrettung' }, { id: '65', name: 'LKW 7 Lkr 19 tm' }, { id: '66', name: 'Anh MzB' }, { id: '67', name: 'Anh SchlB' },
        { id: '68', name: 'Anh MzAB' }, { id: '69', name: 'Tauchkraftwagen' }, { id: '70', name: 'MZB' }, { id: '71', name: 'AB-MZB' },
        { id: '72', name: 'WaWe 10' }, { id: '73', name: 'GRTW' }, { id: '74', name: 'NAW' }, { id: '75', 'name': 'FLF' },
        { id: '76', name: 'Rettungstreppe' },
        { id: '77', name: 'AB-Gefahrgut' }, { id: '78', name: 'AB-Einsatzleitung' }, { id: '79', name: 'SEK - ZF' },
        { id: '80', name: 'SEK - MTF' }, { id: '81', name: 'MEK - ZF' }, { id: '82', name: 'MEK - MTF' }, { id: '83', 'name': 'GW-Werkfeuerwehr' },
        { id: '84', name: 'ULF mit Löscharm' }, { id: '85', 'name': 'TM 50' }, { id: '86', 'name': 'Turbolöscher' }, { id: '87', name: 'TLF 4000' },
        { id: '88', name: 'KLF' }, { id: '89', name: 'MLF' }, { id: '90', 'name': 'HLF 10' }, { id: '91', name: 'Rettungshundefahrzeug' },
        { id: '92', name: 'Anh Hund' }, { id: '93', name: 'MTW-O' }, { id: '94', name: 'DHuFüKW' }, { id: '95', name: 'Polizeimotorrad' },
        { id: '96', name: 'Außenlastbehälter (allgemein)' }, { id: '97', name: 'ITW' }, { id: '98', name: 'Zivilstreifenwagen' },
        { id: '100', name: 'MLW 4' }, { id: '101', name: 'Anh SwPu' }, { id: '102', name: 'Anh 7' }, { id: '103', name: 'FuStW (DGL)' },
        { id: '104', name: 'GW-L1' }, { id: '105', name: 'GW-L2' }, { id: '106', name: 'MTF-L' }, { id: '107', name: 'LF-L' },
        { id: '108', name: 'AB-L' }, { id: '109', name: 'MzGW SB' }, { id: '110', name: 'NEA50' }, { id: '111', name: 'NEA50' },
        { id: '112', name: 'NEA200' }, { id: '113', name: 'NEA200' },
        { id: '114', name: 'GW-Lüfter' }, { id: '115', name: 'Anh Lüfter' }, { id: '116', name: 'AB-Lüfter' }, { id: '117', name: 'AB-Tank' },
        { id: '118', name: 'Kleintankwagen' }, { id: '119', name: 'AB-Lösch' }, { id: '120', name: 'Tankwagen' }, { id: '121', name: 'GTLF' },
        { id: '122', name: 'LKW 7 Lbw (FGr E)' }, { id: '123', name: 'LKW 7 Lbw (FGr WP)' }, { id: '124', name: 'MTW-OV' },
        { id: '125', name: 'MTW-Tr UL' }, { id: '126', name: 'MTF Drohne' }, { id: '127', name: 'GW UAS' }, { id: '128', name: 'ELW Drohne' },
        { id: '129', name: 'ELW2 Drohne' }, { id: '130', name: 'GW-Bt' }, { id: '131', name: 'Bt-Kombi' }, { id: '132', name: 'FKH' },
        { id: '133', name: 'Bt LKW' }, { id: '134', name: 'Pferdetransporter klein' }, { id: '135', name: 'Pferdetransporter groß' },
        { id: '136', name: 'Anh Pferdetransport' }, { id: '137', name: 'Zugfahrzeug Pferdetransport' }, { id: '138', name: 'GW-Verpflegung' },
        { id: '139', name: 'GW-Küche' }, { id: '140', name: 'MTW-Verpflegung' }, { id: '141', name: 'FKH' },
        { id: '142', name: 'AB-Küche' }, { id: '143', name: 'Anh Schlauch' }, { id: '144', name: 'FüKW (THW)' },
        //{ id: '145', name: 'FüKomKW' },
        { id: '146', name: 'Anh FüLa' }, { id: '147', name: 'FmKW' }, { id: '148', name: 'MTW-FGr K' },
        { id: '149', name: 'GW-Bergrettung (NEF)' }, { id: '150', name: 'GW-Bergrettung' }, { id: '151', name: 'ELW Bergrettung' },
        { id: '152', name: 'ATV' }, { id: '153', name: 'Hundestaffel (Bergrettung)' }, { id: '154', name: 'Schneefahrzeug' },
        { id: '155', name: 'Anh Höhenrettung (Bergrettung)' }, { id: '156', name: 'Polizeihubschrauber mit verbauter Winde' },
        { id: '157', name: 'RTH Winde' }, { id: '158', name: 'GW-Höhenrettung (Bergrettung)' }, { id: '159', name: 'Seenotrettungskreuzer' },
        { id: '160', name: 'Seenotrettungsboot' }, { id: '161', name: 'Hubschrauber (Seenotrettung)' }, { id: '162', name: 'RW-Schiene' },
        { id: '163', name: 'HLF Schiene' }, { id: '164', name: 'AB-Schiene' }, { id: '165', name: 'LauKw' }, { id: '166', name: 'PTLF 4000' },
        { id: '167', name: 'SLF' }, { id: '168', name: 'Anh Sonderlöschmittel' }, { id: '169', name: 'AB-Sonderlöschmittel' },
        { id: '170', name: 'AB-Wasser/Schaum' },
    ];

    const VEHICLE_ID_BY_SHORT_NAME = {};
    const VEHICLE_SHORT_NAME_BY_ID = {};
    LSS_VEHICLE_TYPE_DEFINITIONS.forEach(def => {
        VEHICLE_ID_BY_SHORT_NAME[def.name] = def.id;
        if (!VEHICLE_SHORT_NAME_BY_ID[def.id]) {
            VEHICLE_SHORT_NAME_BY_ID[def.id] = def.name;
        }
    });

    function getVehicleShortNameById(typeId) {
        return VEHICLE_SHORT_NAME_BY_ID[typeId] || null;
    }

    const LINKS_JSON_DATA = {
        "ambulance": [28, 73], "Anh DLE": [44], "slf": [167], "laukw": [165], "anhänger drucklufterzeugung": [44],
        "anhänger drucklufterzeugung ": [44], "boot": [70],
        "boote": [70], "dekon-p": [53, 54], "dhufükw": [94],
        // UPDATED: DLK can be fulfilled by DLK 23 (ID 2) or TM 50 (ID 85)
        "drehleiter": ['2', '85'],
        "drehleiter (dlk 23)": ['2', '85'],
        "drehleitern": ['2', '85'],
        "drehleitern (dlk 23)": ['2', '85'],
        "drehleitern (dlk 3)": ['2', '85'], // Assuming DLK 3 is also covered by DLK 23 / TM 50
        "dlk": ['2', '85'],
        "elw": [3, 34, 78, 128, 129], // Generic ELW, excludes ELW 1 (SEG)
        "elw 1": [3, 128, 34, 129, 78], // ELW 1 can be fulfilled by ELW 1, ELW Drohne, ELW 2, ELW2 Drohne, AB-Einsatzleitung
        "elw 1 (seg)": [59], // ELW 1 (SEG) remains distinct
        "elw drohne": [128],
        "elw2 drohne": [129],
        "elw 2": [34, 78, 129], // ELW 2 can be ELW 2, AB-Einsatzleitung, ELW2 Drohne
        "hlf": [30, 90],
        "fachgruppen sb": [109],
        "feuerlöschpumpe": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167],
        "feuerlöschpumpen": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167],
        "feuerlöschpumpen (z. b. lf)": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167],
        "feuerwehrkräne (fwk)": [57],
        "feuerwehrleute": [0, 1, 10, 12, 17, 18, 19, 2, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 36, 37, 46, 5, 57, 6, 7, 75, 8, 84, 87, 88, 89, 9, 90, 126, 76, 150], // Added Rettungstreppe (76) and GW-Bergrettung (150)
        "feuerwehrmann": [0, 1, 10, 12, 17, 18, 19, 2, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 36, 37, 46, 5, 57, 6, 7, 75, 8, 84, 87, 88, 89, 9, 90, 126, 76, 150], // Added Rettungstreppe (76) and GW-Bergrettung (150)
        "flugfeldlöschfahrzeug": [75], "flugfeldlöschfahrzeuge": [75],
        "funkstreifenwagen": [32, 103], // Zivilstreifenwagen (98) removed
        "funkstreifenwagen (dienstgruppenleitung)": [103],
        "fustw": [32, 103], // Zivilstreifenwagen (98) removed
        "fustw (dgl)": [103],
        "fwk": [57],
        // Removed "fükw" generic entry as per user's clarification
        "gefahrgut": [27, 77],
        "gefkw": [52], "gefangenenkraftwagen": [52], "gerätekraftwagen": [39], "gerätekraftwagen (gkw)": [39], "gkw": [39],
        "grukw": [50],
        // Re-added 101 (Anh SwPu) and 102 (Anh 7) to Schlauchwagen definitions as per user request
        "gw l 2 wasser": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], '101', '102'].filter(Boolean),
        "gw-a": [5, 48], "gw-a oder ab-atemschutz": [5, 48],
        "gw-atemschutz": [5, 48], "gw-gefahrgut": [27, 77], "gw-höhenrettung": [33, 155, 158], "gw-mess": [12], "gw-messtechnik": [12],
        "gw-san": [60], "gw-taucher": [63, 69], "gw-wasserrettung": [64, 65, 70, 71], "gw-werkfeuerwehr": [83], "gw-öl": [10, 49],
        "itw": [97], "kdow lna": [55], "kdow orgl": [56], "kdow-lna": [55], "kdow-orgl": [56], "ktw": [38, 58], "ktw typ b": [58, 38],
        "lebefkw": [35], // Specific, no alternatives
        // UPDATED: Teleskopmast can only be fulfilled by TM 50 (ID 85)
        "leiter": ['85'],
        "lkw 7 lkr 19 tm": [65], "LKW K 9": [], "lkw kipper": [], "lna": [55], "orgl": [56],
        "löschfahrzeuge": [0, 1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166],
        "löschfahrzeug": [0, 1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166],
        "löschfahrzeug (lf)": [0, 1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166],
        "löschfahrzeuge (lf)": [0, 1, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166],
        "lüfter": [114, 115, 116], "lüfter-erweiterungen": [114, 115, 116], "mannschaftstransport-wagen": [36, 40, 80, 82, 93, 106, 124, 125, 126, 140, 148],
        "maximale patientenanzahl": [28, 73, 74], "mek-fahrzeug": [81, 82], "mek-fahrzeuge": [81, 82], "mek-mtf": [82], "mek-zf": [81],
        "mlw 5": [45], "mtw-o": [93], "mtz ov": [124], "mtw-tz": [40], "mzgw": [41, 109], "mzkw (fgr n)": [41], "mzgw (fgr n)": [41],
        "mzgw sb": [109], "mzkw": [41, 109], "nea200": [112, 113], "nea200-erweiterungen": [112, 113], "nea50": [110, 111],
        "nea50-erweiterungen": [110, 111], "nef": [29, 31, 149, 157], "nef, lna, orgl": [55, 56, 29],
        "nef, lna, orgl, rtw": [55, 56, 29, 28], "nef, rtw": [28, 29, 31, 149, 157],
        "personal": [0, 1, 10, 12, 17, 18, 19, 2, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 36, 37, 46, 5, 57, 6, 7, 75, 8, 84, 87, 88, 89, 9, 90, 126, 76, 150], // Added Rettungstreppe (76) and GW-Bergrettung (150)
        "polizeihubschrauber": [61, 156], "polizeimotorrad": [95], "polizeimotorräder": [95], "polizisten": [32, 98, 50, 51, 52, 61, 95, 103],
        "pumpenleistung": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167],
        "radlader": [43], "radlader (brmg r)": [43], "rettung": [29, 31, 28, 38, 58, 55, 56, 59, 60, 73, 74, 97],
        "rettungshundefahrzeug": [91, 92], "rettungshundestaffel": [91, 92, 153], "rettungshundestaffel/n": [91, 92, 153],
        "rettungshundestaffeln": [91, 92, 153],
        "rettungstreppe": [76],
        "rettungstreppen": [76],
        "rettungswache": [38, 58, 28, 73, 74, 97],
        "rth": [31, 157],
        "rtw": [28, 38, 58, 73],
        "rtw oder ktw oder ktw-b": [28, 38, 58, 73], "rtw oder ktw typ b": [28, 58, 73],
        "rtw, ktw": [28, 38, 58, 73], "rtw, naw": [28, 73, 74], "rw": [4, 30, 90, 162, 47], "rüstwagen": [4, 30, 47, 90, 162],
        "rüstwagen oder hlf": [4, 47, 162, 30, 90],
        // Re-added 101 (Anh SwPu) and 102 (Anh 7) to Schlauchwagen definitions as per user request
        "schlauchwagen": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'], VEHICLE_ID_BY_SHORT_NAME['Anh 7'], '101', '102'].filter(Boolean),
        "schlauchwagen (gw-l2 wasser, sw 1000, sw 2000 oder ähnliches)": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'], VEHICLE_ID_BY_SHORT_NAME['Anh 7'], '101', '102'].filter(Boolean),
        "schlauchwagen (gw-l2 wasser oder sw)": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'], VEHICLE_ID_BY_SHORT_NAME['Anh 7'], '101', '102'].filter(Boolean),
        "gw-l2 wasser": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'], VEHICLE_ID_BY_SHORT_NAME['Anh 7'], '101', '102'].filter(Boolean),
        "schlauchwagen (gw-l wasser oder sw)": [VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'], VEHICLE_ID_BY_SHORT_NAME['SW 1000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000'], VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'], VEHICLE_ID_BY_SHORT_NAME['SW Kats'], VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'], VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'], VEHICLE_ID_BY_SHORT_NAME['Anh 7'], '101', '102'].filter(Boolean),
        "schmutzwasserpumpe": [101, 102], "schmutzwasserpumpen": [101, 102],
        "sek-fahrzeug": [79, 80], "sek-fahrzeuge": [79, 80],
        "sek-mtf": [80], "sek-zf": [81], "streifenwagen": [32, 98, 103], // This entry still includes 98, but it's not used for direct FuStW requirements.
        "tauchkraftwagen": [63, 69],
        // UPDATED: Teleskopmast can only be fulfilled by TM 50 (ID 85)
        "teleskopmast": ['85'],
        "teleskopmasten": ['85'], // Added plural for Teleskopmast
        "thw-einsatzleitung": [40], "thw-einsatzleitung (mtw tz)": [40], "thw-mehrzweckkraftwagen": [41, 109],
        "thw-mehrzweckkraftwagen (mzkw)": [41, 109],
        "tragehilfe (z.b. durch ein lf)": [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 36, 37, 87, 88, 89, 90],
        "turbolöscher": [86], "ulf": [84], "ulf mit löscharm": [84],
        "wasser": [0, 1, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 46, 6, 7, 8, 62, 75, 84, 86, 87, 88, 89, 90, 117, 118, 119, 120, 121, 143, 166, 167, 170],
        "wasserwerfer": [72], "wlf": [46],
        "zivilstreifenwagen": [98], // Changed to only ID 98
        "zivilstreifenwagen, streifenwagen": [32, 103], // Zivilstreifenwagen (98) removed
        "mtf drohne": [126, 127, 128, 129],
        "drohneneinheit": [125, 126, 127, 128, 129],
        "drohneneinheiten": [125, 126, 127, 128, 129],
        "drohnen-erweiterungen (fw, thw, seg)": [125, 126, 127, 128, 129],
        "einsatzleiter 2": [34, 78, 129], "gw uas": [127, 126],
        "gw-bt": [130, 131], "gw bt": [130, 131], "bt-kombi": [131, 130], "fkh": [132, 141], "bt lkw": [133],
        "betreuungshelfer": [36, 130, 131, 140],
        "verpflegungshelfer": [36, 130, 133, 138, 139, 140, 142],
        "betreuungs- und verpflegungsausstattung": [130, 131, 132, 133, 138, 139, 140, 141, 142],
        "betreuungs- und verpflegungsausstattungen": [130, 131, 132, 133, 138, 139, 140, 141, 142],
        "polizeipferde": [134, 135, 136, 137], "reiterstaffeln": [134, 135, 137],
        "s personal mit ausbildung": [134, 135, 136, 137],
        "fükw (polizei)": [51], // Specific, no alternatives
        "fükw (polizei)": [51], // Specific, no alternatives
        "fükw (thw)": [144], // Specific, no alternatives
        "fükw (thw)": [144], // Specific, no alternatives
 //       "FüKomKW": [145], // Specific, no alternatives
        "Anh FüLa": [146], "FMHC": [147], "MTW-FGr K": [148], "mtw fgr k": [148], "anh füla": [146], "fmkw": [147], "fgr k": [148],
        "höhenrettung (bergrettung)": [33, 155, 158], "bergrettungsfahrzeuge": [149, 150, 151, 152, 153, 154, 155, 158],
        "hubschrauber mit winde": [157, 156],
        "gw bergrettung": ['150'], // GW-Bergrettung (ID 150) can only be fulfilled by itself
        "gw-bergrettung": ['150'], // GW-Bergrettung (ID 150) can only be fulfilled by itself
        "gw bergrettung (nef)": ['149'], // GW-Bergrettung (NEF) (ID 149) can only be fulfilled by itself
        "gw-bergrettung (nef) ": ['149'], // GW-Bergrettung (NEF) (ID 149) can only be fulfilled by itself
        "gw-bergrettung (nef)": ['149'], // GW-Bergrettung (NEF) (ID 149) can only be fulfilled by itself
        "bergrettung": [149, 150, 151, 152, 153, 154, 155, 158], // Generic term, includes both
        "elw bergrettung": [151], "atv": [152], "bergrettung,": [149, 150, 151, 152, 153, 154, 155, 158],
        "hundestaffel (bergrettung)": [153, 91, 92], "schneefahrzeug": [154], "schneefahrzeuge": [154],
        "anh höhenrettung (bergrettung)": [155, 33], "polizeihubschrauber mit winde": [156, 61],
        "rettungsdienstler": [28, 29, 31, 38, 55, 56, 58, 59, 60, 73, 74, 91, 97, 149],
        "fükomkw": [145], // Specific, no alternatives
        "gw-verpflegung": [138, 139, 142], "gw-küche": [139, 138, 142], "mtw-verpflegung": [140, 131, 130], "lkw kipper (lkw k 9)": [], "lkw k 9": [],
        "brmg r": [43], "reiterstaffel": [134, 135, 137], "tankwagen": [118, 120, 121, 117, 119, 170],
        "seenotrettungsboote oder seenotrettungskreuzer": [159, 160], "seenotrettungsboote oder seenotrettungskreuzer,": [159, 160],
        "seenotrettungsboote": [160], "seenotrettungskreuzer": [159],
        "bahnrettungsfahrzeug": [162, 163, 164],
        "bahnrettungsfahrzeuge": [162, 163, 164],
        "hubschrauber (seenotrettung)": [161], "hubschrauber (seenotrettung),": [161],
        "thw-einsatzkräfte": [39, 40, 41, 42, 43, 45, 100, 109, 110, 111, 112, 113, 122, 123, 124, 125, 144, 145, 146, 147, 148],
        "streifenwagen oder polizeimotorräder": [32, 95, 103], // Zivilstreifenwagen (98) removed from OR clause
        "funkstreifenwagen oder polizeimotorräder": [32, 95, 103, 98], // Updated to include Zivilstreifenwagen (98)
        "funkstreifenwagen oder polizeimotorrad": [32, 95, 103, 98], // Added singular form with Zivilstreifenwagen (98)
        "rettungswagen": [28, 38, 58, 73, 74, 97]
    };

    const COMPREHENSIVE_REQUIREMENT_MAP = {};
    for (const key in LINKS_JSON_DATA) {
        COMPREHENSIVE_REQUIREMENT_MAP[key.toLowerCase()] = LINKS_JSON_DATA[key].map(String);
    }

    // IDs for Schlauchwagen types that provide the water bonus
    // Re-added 101 (Anh SwPu) and 102 (Anh 7) as per user request
    const SCHLAUCHWAGEN_IDS = [
        VEHICLE_ID_BY_SHORT_NAME['Anh SwPu'],
        VEHICLE_ID_BY_SHORT_NAME['Anh 7'],
        VEHICLE_ID_BY_SHORT_NAME['GW-L2-Wasser'],
        VEHICLE_ID_BY_SHORT_NAME['SW 1000'],
        VEHICLE_ID_BY_SHORT_NAME['SW 2000'],
        VEHICLE_ID_BY_SHORT_NAME['SW 2000-Tr'],
        VEHICLE_ID_BY_SHORT_NAME['SW Kats'],
        VEHICLE_ID_BY_SHORT_NAME['AB-Schlauch'],
        VEHICLE_ID_BY_SHORT_NAME['Anh Schlauch'],
        '101', // Anh SwPu
        '102'  // Anh 7
    ].filter(Boolean).map(String);


    const LONG_NAME_TO_SHORT_NAME_MAPPING = {
        'Radlader (BRmG R)': 'BRmG R', 'GW-Atemschutz': 'GW-A', 'Drohneneinheit': 'MTF Drohne',
        'Funkstreifenwagen (Dienstgruppenleitung)': 'FuStW (DGL)',
        'THW-Einsatzleitung': 'MTW-TZ',
        'Gerätekraftwagen (GKW)': 'GKW',
        'Bahnrettungsfahrzeug': 'HLF Schiene',
    };

    const GENERIC_TO_SPECIFIC_VEHICLE_MAPPING = {
        // Removed FüKW (Polizei), FüKW (THW), FüKomKW as they are now specific
        'Kommandowagen': ['ELW 1', 'ELW 2', 'KdoW-LNA', 'KdoW-OrgL', 'leBefKw', 'DHuFüKW', 'ELW Bergrettung', 'ELW Drohne', 'ELW2 Drohne'],
    };

    const PERSONNEL_TO_VEHICLE_MAPPING = {
        'Betreuungshelfer': { 'MTW': 8, 'GW-Bt': 2, 'Bt-Kombi': 9, 'MTW-Verpflegung': 8 },
        'Verpflegungshelfer': { 'MTW': 8, 'GW-Bt': 2, 'Bt LKW': 2, 'GW-Verpflegung': 2, 'GW-Küche': 2, 'MTW-Verpflegung': 8, 'AB-Küche': 0 },
        'LNA': { 'KdoW-LNA': 1 },
        'OrgL': { 'KdoW-OrgL': 1 },
        'Einsatzleiter 2': {'ELW 2':1, 'AB-Einsatzleitung':0, 'ELW2 Drohne':1},
        'Feuerwehrleute': { 'HLF 20': 9, 'HLF 10': 9, 'LF 20': 9, 'LF 10': 9, 'DLK 23': 3, 'ELW 1': 3, 'LF 8/6': 9, 'LF 20/16': 9, 'LF 10/6':6, 'LF 16-TS': 9, 'TLF 2000': 3, 'TLF 3000': 3, 'TLF 8/8': 3, 'TLF 8/18': 3, 'TLF 16/24-Tr': 6, 'TLF 16/25': 6, 'TLF 16/45':3, 'TLF 20/40':3, 'TLF 20/40-SL':3, 'TLF 16':6, 'GW-A':3, 'RW':3, 'TSF-W':6, 'KLF':6, 'MLF':6, 'MTW':9, 'GW-Messtechnik':3, 'GW-Gefahrgut':3, 'GW-Öl':3, 'FLF':3, 'ULF mit Löscharm':3, 'TLF 4000':3, 'PTLF 4000':3, 'SLF':3, 'GTLF':3, 'MTF Drohne': 3, 'ELW 2':3, 'AB-Einsatzleitung':0, 'ELW Drohne':3, 'ELW2 Drohne':3, 'Rettungtreppe': 2, 'GW-Bergrettung': 6 },
        'Feuerwehrmann': { 'HLF 20': 9, 'HLF 10': 9, 'LF 20': 9, 'LF 10': 9, 'DLK 23': 3, 'ELW 1': 3, 'LF 8/6': 9, 'LF 20/16': 9, 'LF 10/6':6, 'LF 16-TS': 9, 'TLF 2000': 3, 'TLF 3000': 3, 'TLF 8/8': 3, 'TLF 8/18': 3, 'TLF 16/24-Tr': 6, 'TLF 16/25': 6, 'TLF 16/45':3, 'TLF 20/40':3, 'TLF 20/40-SL':3, 'TLF 16':6, 'GW-A':3, 'RW':3, 'TSF-W':6, 'KLF':6, 'MLF':6, 'MTW':9, 'GW-Messtechnik':3, 'GW-Gefahrgut':3, 'GW-Öl':3, 'FLF':3, 'ULF mit Löscharm':3, 'TLF 4000':3, 'PTLF 4000':3, 'SLF':3, 'GTLF':3, 'MTF Drohne': 3, 'ELW 2':3, 'AB-Einsatzleitung':0, 'ELW Drohne':3, 'ELW2 Drohne':3, 'Rettungtreppe': 2, 'GW-Bergrettung': 6 },
        'THW-Einsatzkräfte': { 'GKW': 9, 'MTW-TZ': 8, 'MzGW (FGr N)': 9, 'BRmG R': 2, 'LKW K 9':3, 'MLW 5':6, 'MLW 4':6, 'FüKW (THW)':3, 'FüKomKW':3, 'MTW-OV':6, 'MTW-Tr UL':6, 'MTW-FGr K':6 },
        'Polizisten': {'FuStW': 2, 'GruKw': 9, 'leBefKw': 3, 'FüKW (Polizei)': 3, 'GefKw':3, 'Polizeihubschrauber':3, 'Polizeimotorrad':1, 'FuStW (DGL)':2, 'Zivilstreifenwagen':2},
        'Rettungsdienstler': {'RTW':2, 'NEF':2, 'KTW':2, 'KTW Typ B':2, 'GRTW':3, 'NAW':3, 'ITW':3, 'RTH':3, 'KdoW-LNA':1, 'KdoW-OrgL':1, 'GW-San':9, 'ELW 1 (SEG)':2 },
        'Personen mit GW-Gefahrgut-Ausbildung': { 'GW-Gefahrgut': 1 },
        'Personen mit Dekon-P-Ausbildung': { 'Dekon-P': 6 }, // Added for Dekon-P personnel
        'GW-Wasserrettung': {
            'GW-Wasserrettung': 4, // Das Fahrzeug selbst stellt auch Personal
            'MZB': 4,
            'AB-MZB': 4,
            'Anh MzB': 4,
            'Anh SchlB': 4,
            'Anh MzAB': 4,
            'Tauchkraftwagen': 4
        }
    };
    const EQUIPMENT_TO_VEHICLE_MAPPING = {
        'Betreuungs- und Verpflegungsausstattung': ['GW-Bt', 'Bt LKW', 'Bt-Kombi', 'GW-Verpflegung', 'GW-Küche', 'MTW-Verpflegung', 'AB-Küche', 'FKH'],
    };

    // Dynamically build FIRE_PUMP_CAPACITIES
    const FIRE_PUMP_VEHICLE_IDS = COMPREHENSIVE_REQUIREMENT_MAP["feuerlöschpumpe"] || [];
    const FIRE_PUMP_CAPACITIES = {};
    FIRE_PUMP_VEHICLE_IDS.forEach(id => {
        const shortName = VEHICLE_SHORT_NAME_BY_ID[id];
        if (shortName) {
            FIRE_PUMP_CAPACITIES[shortName] = 1; // Each of these vehicles provides 1 fire pump
        }
    });

    const MATERIAL_CAPACITY_MAPPING = {
        'Sonderlöschmittel': { 'SLF': 5000, 'Anh Sonderlöschmittel': 2000, 'AB-Sonderlöschmittel': 2000, 'HLF 20': 150, 'HLF 10': 100, 'PTLF 4000': 500, 'FLF':500, 'ULF mit Löscharm': 1000, 'Turbolöscher':1000 },
        'Wasser': {
            'GTLF': 10000, 'TLF 4000': 4000, 'PTLF 4000': 4000, 'FLF': 6000, 'Turbolöscher': 2500, 'SLF':1000,
            'ULF mit Löscharm': 3000,
            'TLF 20/40': 4000, 'TLF 20/40-SL': 4000, 'TLF 3000': 3000, 'TLF 2000': 2000,
            // Set water capacity to 0 for all Schlauchwagen types, as per user's clarification.
            // Their contribution is solely via the bonus to existing water.
            'SW 2000': 0,
            'SW 1000': 0,
            'GW-L2-Wasser': 0,
            'LF 20': 2000, 'HLF 20': 2000, 'LF 10': 1200, 'HLF 10': 1000, 'LF 20/16': 1600, 'LF 10/6':600,
            'TSF-W':750, 'MLF':1000, 'KLF':500, 'AB-Tank':10000, 'AB-Lösch':4000,
            'Kleintankwagen': 2000, 'Tankwagen':6000, 'AB-Wasser/Schaum': 2000
        },
        'Schaummittel': {'GTLF': 1000, 'TLF 4000': 500, 'PTLF 4000': 500, 'FLF': 800, 'Turbolöscher': 1000, 'SLF':3000, 'ULF mit Löscharm':3000, 'TLF 20/40': 500, 'TLF 20/40-SL': 500, 'HLF 20':120, 'LF 20':120, 'AB-Lösch':1000, 'AB-Wasser/Schaum':2000 },
        'Feuerlöschpumpe': FIRE_PUMP_CAPACITIES, // Dynamically added here
        'Schmutzwasserpumpe': { 'Anh SwPu': 1, 'Anh 7': 1 } // Specific for explicit SWPu
    };

    const VEHICLE_TYPE_ID_MAPPING = {};
    Object.keys(LONG_NAME_TO_SHORT_NAME_MAPPING).forEach(longName => {
        const shortName = LONG_NAME_TO_SHORT_NAME_MAPPING[longName];
        const id = VEHICLE_ID_BY_SHORT_NAME[shortName];
        if (id !== undefined) VEHICLE_TYPE_ID_MAPPING[longName] = id;
    });
    LSS_VEHICLE_TYPE_DEFINITIONS.forEach(def => {
        if (!VEHICLE_TYPE_ID_MAPPING[def.name]) VEHICLE_TYPE_ID_MAPPING[def.name] = def.id;
    });

    const ELW1_ID = VEHICLE_ID_BY_SHORT_NAME['ELW 1'];
    const ELW2_ID = VEHICLE_ID_BY_SHORT_NAME['ELW 2'];
    const ELW_DROHNE_ID = VEHICLE_ID_BY_SHORT_NAME['ELW Drohne'];
    const ELW2_DROHNE_ID = VEHICLE_ID_BY_SHORT_NAME['ELW2 Drohne'];
    const AB_EINSATZLEITUNG_ID = VEHICLE_ID_BY_SHORT_NAME['AB-Einsatzleitung'];
    const ELW1_SEG_ID = VEHICLE_ID_BY_SHORT_NAME['ELW 1 (SEG)'];


    const FUSTW_ID = VEHICLE_ID_BY_SHORT_NAME['FuStW'];
    const ZIVILSTREIFENWAGEN_ID = VEHICLE_ID_BY_SHORT_NAME['Zivilstreifenwagen'];
    const FUSTW_DGL_ID = VEHICLE_ID_BY_SHORT_NAME['FuStW (DGL)'];
    // Define FuStW IDs for the special OR requirement handling
    const FUSTW_IDS_FOR_OR_REQUIREMENT = [FUSTW_ID, ZIVILSTREIFENWAGEN_ID, FUSTW_DGL_ID].filter(Boolean).map(String);


    const VEHICLE_CAPABILITIES = {};

    LSS_VEHICLE_TYPE_DEFINITIONS.forEach(def => {
        const typeId = def.id;
        const shortName = def.name;

        // All vehicle types are added to VEHICLE_CAPABILITIES, no exclusion here.
        VEHICLE_CAPABILITIES[typeId] = {
            name: shortName,
            provides: {
                personnel: {},
                material: {},
                vehicle_categories: new Set()
            }
        };

        for (const personnelType in PERSONNEL_TO_VEHICLE_MAPPING) {
            if (PERSONNEL_TO_VEHICLE_MAPPING[personnelType][shortName]) {
                VEHICLE_CAPABILITIES[typeId].provides.personnel[personnelType] = PERSONNEL_TO_VEHICLE_MAPPING[personnelType][shortName];
            }
        }

        for (const materialType in MATERIAL_CAPACITY_MAPPING) {
            if (MATERIAL_CAPACITY_MAPPING[materialType][shortName] !== undefined) { // Check for undefined to allow 0 capacity
                VEHICLE_CAPABILITIES[typeId].provides.material[materialType] = MATERIAL_CAPACITY_MAPPING[materialType][shortName];
            }
        }

        for (const categoryName in COMPREHENSIVE_REQUIREMENT_MAP) {
            const normalizedCategoryName = categoryName.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
            if (COMPREHENSIVE_REQUIREMENT_MAP[categoryName].includes(typeId)) {
                VEHICLE_CAPABILITIES[typeId].provides.vehicle_categories.add(normalizedCategoryName);
            }
        }
    });

    for (const typeId in VEHICLE_CAPABILITIES) {
        VEHICLE_CAPABILITIES[typeId].provides.vehicle_categories = Array.from(VEHICLE_CAPABILITIES[typeId].provides.vehicle_categories);
    }

    const EMS_VEHICLE_TYPE_IDS = [
        VEHICLE_ID_BY_SHORT_NAME['RTW'], VEHICLE_ID_BY_SHORT_NAME['GRTW'],
        VEHICLE_ID_BY_SHORT_NAME['KTW'], VEHICLE_ID_BY_SHORT_NAME['KTW Typ B'],
        VEHICLE_ID_BY_SHORT_NAME['NEF'], VEHICLE_ID_BY_SHORT_NAME['RTH'],
        VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA'], VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL'],
        VEHICLE_ID_BY_SHORT_NAME['ELW 1 (SEG)'],
        VEHICLE_ID_BY_SHORT_NAME['GW-San'],
        VEHICLE_ID_BY_SHORT_NAME['ITW']
    ].filter(Boolean).map(String);

    // Removed 'GW-Wasserrettung' from EMS_PERSONNEL_TYPES as it's a vehicle type, not a personnel type for EMS filtering.
    const EMS_PERSONNEL_TYPES = ['LNA', 'OrgL', 'Rettungsdienstler', 'Personen mit GW-Gefahrgut-Ausbildung', 'Personen mit Dekon-P-Ausbildung'];
    const EMS_MATERIAL_TYPES = ['Sonderlöschmittel', 'Wasser', 'Schaummittel', 'Feuerlöschpumpe', 'Schmutzwasserpumpe'].filter(type => {
        return false; // Effectively an empty list, as these are not EMS specific materials usually
    });


    function isInAlarmWindow() { return document.getElementById('mission-form') !== null; }

    /**
     * Parses a distance string (km/m) or a time string (min/sek)
     * and returns the estimated travel time in seconds.
     * For distances, time is calculated using AVERAGE_SPEED_KMH.
     * @param {string} text - The text content of the distance/duration element.
     * @returns {number} The estimated travel time in seconds, or Infinity if parsing fails.
     */
    function parseDistance(text) {
        if (typeof text !== 'string' || text.trim() === "") {
            return Infinity;
        }
        const originalTextForWarning = text;
        let normalizedText = text.replace(',', '.').toLowerCase().trim();

        if (normalizedText === "") {
            return Infinity;
        }

        let timeMatchMinSek = normalizedText.match(/(\d+)\s*min\.?\s*(\d+)\s*sek\.?/);
        if (timeMatchMinSek) {
            const minutes = parseInt(timeMatchMinSek[1], 10);
            const seconds = parseInt(timeMatchMinSek[2], 10);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                const totalSeconds = (minutes * 60) + seconds;
                return totalSeconds;
            }
        }

        let timeMatchSek = normalizedText.match(/^(\d+)\s*sek\.?$/);
        if (timeMatchSek) {
            const seconds = parseInt(timeMatchSek[1], 10);
            if (!isNaN(seconds)) {
                return seconds;
            }
        }

        let timeMatchMin = normalizedText.match(/^(\d+)\s*min\.?$/);
        if (timeMatchMin) {
            const minutes = parseInt(timeMatchMin[1], 10);
            if (!isNaN(minutes)) {
                const totalSeconds = minutes * 60;
                return totalSeconds;
            }
        }

        const kmMatch = normalizedText.match(/(\d+(\.\d+)?)\s*km/);
        if (kmMatch) {
            const distanceKm = parseFloat(kmMatch[1]);
            if (!isNaN(distanceKm)) {
                const calculatedTimeInSeconds = (distanceKm / AVERAGE_SPEED_KMH) * SECONDS_PER_HOUR;
                return calculatedTimeInSeconds;
            }
        }

        const mMatch = normalizedText.match(/(\d+(\.\d+)?)\s*m/);
        if (mMatch) {
            const distanceM = parseFloat(mMatch[1]);
            if (!isNaN(distanceM)) {
                const distanceKm = distanceM / METERS_PER_KILOMETER;
                const calculatedTimeInSeconds = (distanceKm / AVERAGE_SPEED_KMH) * SECONDS_PER_HOUR;
                return calculatedTimeInSeconds;
            }
        }

        console.warn(`[LSS-Nachalarmierung] Konnte Distanz/Zeit nicht in Sekunden umrechnen: Input war "${originalTextForWarning}"`);
        return Infinity;
    }

    /**
     * Resolves a requirement name to a list of vehicle type IDs.
     * This function does NOT filter out CARE_VEHICLE_IDS. Filtering happens later.
     * @param {string} name - The requirement name (e.g., "LF 20", "Rettungswagen").
     * @returns {string[]} An array of vehicle type IDs (as strings).
     */
    function resolveRequirementToVehicleTypeIds(name) {
        const lowerName = name.toLowerCase().trim();
        console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Versuche, "${lowerName}" aufzulösen.`);

        if (COMPREHENSIVE_REQUIREMENT_MAP[lowerName]) {
            console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden in COMPREHENSIVE_REQUIREMENT_MAP: ${JSON.stringify(COMPREHENSIVE_REQUIREMENT_MAP[lowerName])}`);
            return COMPREHENSIVE_REQUIREMENT_MAP[lowerName];
        }
        const nameWithoutBrackets = lowerName.replace(/\s*\(.*?\)\s*/g, '').trim();
        if (nameWithoutBrackets !== lowerName && COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets]) {
            console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden nach Klammer-Entfernung: ${JSON.stringify(COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets])}`);
            return COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets];
        }
        const shortNameFromLong = LONG_NAME_TO_SHORT_NAME_MAPPING[name];
        if (shortNameFromLong && VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]) {
            console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden via LONG_NAME_TO_SHORT_NAME_MAPPING: ${VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]}`);
            return [VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]];
        }
        if (GENERIC_TO_SPECIFIC_VEHICLE_MAPPING[name] && name !== 'Rettungswagen') {
            const resolvedIds = GENERIC_TO_SPECIFIC_VEHICLE_MAPPING[name]
                .map(sn => VEHICLE_ID_BY_SHORT_NAME[sn])
                .filter(id => id !== undefined);
            if (resolvedIds.length > 0) {
                console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden via GENERIC_TO_SPECIFIC_VEHICLE_MAPPING: ${JSON.stringify(resolvedIds)}`);
                return resolvedIds;
            }
        }
        if (VEHICLE_ID_BY_SHORT_NAME[name]) {
            console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden via VEHICLE_ID_BY_SHORT_NAME: ${VEHICLE_ID_BY_SHORT_NAME[name]}`);
            return [VEHICLE_ID_BY_SHORT_NAME[name]];
        }
        if (VEHICLE_TYPE_ID_MAPPING[name]) {
             console.debug(`[LSS-Nachalarmierung] DEBUG (resolveRequirement): Gefunden via VEHICLE_TYPE_ID_MAPPING: ${VEHICLE_TYPE_ID_MAPPING[name]}`);
             return [VEHICLE_TYPE_ID_MAPPING[name]];
        }
        console.warn(`[LSS-Nachalarmierung] Konnte "${name}" nicht zu Fahrzeug-IDs auflösen.`);
        return [];
    }

    async function getMissionVehiclesTable(tableId) {
        let missionVehiclesTable = null;
        let attempts = 0;
        const MAX_TABLE_WAIT_ATTEMPTS = 10;
        const TABLE_WAIT_DELAY_MS = 100;

        while (!missionVehiclesTable && attempts < MAX_TABLE_WAIT_ATTEMPTS) {
            missionVehiclesTable = document.getElementById(tableId);
            if (!missionVehiclesTable) {
                await new Promise(resolve => setTimeout(resolve, TABLE_WAIT_DELAY_MS));
                attempts++;
            }
        }
        return missionVehiclesTable;
    }

    async function getDispatchedVehicles() {
        const dispatchedVehicles = {
            onScene: new Map(),
            onWay: new Map(),
            ownOnScene: new Map(),
            ownOnWay: new Map()
        };

        const processTable = (tableElement, tableName, targetMap, ownTargetMap) => {
            if (tableElement) {
                const vehicleRows = tableElement.querySelectorAll('tbody tr');
                vehicleRows.forEach(row => {
                    const vehicleLink = row.querySelector('a[href*="/vehicles/"][vehicle_type_id]');
                    if (vehicleLink) {
                        const vehicleTypeId = vehicleLink.getAttribute('vehicle_type_id');
                        const backalarmButton = row.querySelector('a.btn-backalarm-ajax');
                        const isOwnVehicle = !!backalarmButton;

                        // Care Vehicles are always counted as dispatched if present, regardless of primary/care logic
                        if (vehicleTypeId) {
                            targetMap.set(vehicleTypeId, (targetMap.get(vehicleTypeId) || 0) + 1);
                            if (isOwnVehicle) {
                                ownTargetMap.set(vehicleTypeId, (ownTargetMap.get(vehicleTypeId) || 0) + 1);
                            }
                        }
                    }
                });
            }
        };

        const missionVehiclesAtMissionTable = await getMissionVehiclesTable('mission_vehicle_at_mission');
        processTable(missionVehiclesAtMissionTable, 'mission_vehicle_at_mission', dispatchedVehicles.onScene, dispatchedVehicles.ownOnScene);

        const missionVehiclesOnWayTable = await getMissionVehiclesTable('mission_vehicle_on_way');
        processTable(missionVehiclesOnWayTable, 'mission_vehicle_on_way', dispatchedVehicles.onWay, dispatchedVehicles.ownOnWay);

        return dispatchedVehicles;
    }

    let globalCheckboxesToProcess = []; // This will store all vehicle data objects (including checkbox element)

    /**
     * Marks a checkbox and adds the vehicle data to the global list if not already present.
     * @param {object} vehicleData - The vehicle data object containing the checkbox element.
     * @returns {boolean} True if the vehicle was successfully marked and added, false otherwise.
     */
    function markAndAddVehicleToGlobalSelection(vehicleData) {
        // Check if the checkbox is already marked or if the vehicle is already in the global list
        if (vehicleData.checkbox.checked) {
            console.debug(`[LSS-Nachalarmierung] DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) bereits VORHER GEPRÜFT. Überspringe Markierung.`);
            return false;
        }
        if (globalCheckboxesToProcess.some(v => v.checkbox === vehicleData.checkbox)) {
            console.debug(`[LSS-Nachalarmierung] DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) bereits in globaler Auswahl-Liste. Überspringe Markierung.`);
            return false;
        }

        vehicleData.checkbox.checked = true;
        // Use document.createEvent for broader compatibility
        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', true, true); // Event type, bubbles, cancelable
        vehicleData.checkbox.dispatchEvent(event);

        globalCheckboxesToProcess.push(vehicleData);
        console.debug(`[LSS-Nachalarmierung] DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) erfolgreich markiert und zur globalen Liste hinzugefügt.`);
        return true;
    }

    /**
     * Simulates selection of a vehicle in a dry run.
     * This function updates the temporary requirements and selected checkboxes for the dry run,
     * but does NOT mark actual checkboxes or modify globalCheckboxesToProcess.
     * @param {object} vehicleData - The vehicle data object.
     * @param {Array} tempReqs - Deep copy of requirements for the dry run.
     * @param {Array} tempAltReqs - Deep copy of alternative requirements for the dry run.
     * @param {object|null} tempGenLFReq - Deep copy of generic LF requirement for the dry run.
     * @param {Set<string>} tempSelCheckboxes - Set of checkbox IDs selected in this dry run.
     * @param {Array} availableVehiclesForDryRun - List of currently available vehicles for the dry run.
     * @returns {boolean} True if the vehicle was successfully "selected" in the dry run, false otherwise (e.g., already selected).
     */
    function trySelectVehicleDryRun(vehicleData, tempReqs, tempAltReqs, tempGenLFReq, tempSelCheckboxes, availableVehiclesForDryRun) {
        // Check if this specific vehicle's checkbox is already considered selected in this dry run
        if (tempSelCheckboxes.has(vehicleData.checkbox.id)) {
            console.debug(`[LSS-Nachalarmierung] DEBUG (DRY RUN SELECTION): Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) bereits in Trockenlauf-Auswahl. Überspringe.`);
            return false;
        }

        tempSelCheckboxes.add(vehicleData.checkbox.id);
        console.debug(`[LSS-Nachalarmierung] DEBUG (DRY RUN SELECTION): Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) ausgewählt.`);

        const selectedVehicleCapabilities = VEHICLE_CAPABILITIES[vehicleData.vehicleTypeId];
        if (selectedVehicleCapabilities) {
            for (const req of tempReqs) { // This loop iterates over ALL requirements
                if (req.category === 'vehicle' && req.count > 0 && req.vehicleTypeIds.includes(vehicleData.vehicleTypeId)) {
                    req.count = Math.max(0, req.count - 1);
                    console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - Reduziere Fahrzeug-Anforderung "${req.originalName}" auf ${req.count}`);
                }
            }
            for (const personnelType in selectedVehicleCapabilities.provides.personnel) {
                const providedAmount = selectedVehicleCapabilities.provides.personnel[personnelType];
                    let personnelReq = tempReqs.find(req =>
                        req.category === 'personnel' && req.specificType === personnelType && req.count > 0
                    );
                    if (personnelReq) {
                        personnelReq.count = Math.max(0, personnelReq.count - providedAmount);
                        console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - Reduziere Personal-Anforderung "${personnelReq.originalName}" auf ${personnelReq.count}`);
                    }
            }
            // Water calculation is handled centrally in Phase 3, NOT here.
            for (const materialType in selectedVehicleCapabilities.provides.material) {
                if (materialType === 'Wasser') continue; // Skip water, handled separately
                const providedAmount = selectedVehicleCapabilities.provides.material[materialType];
                let materialReq = tempReqs.find(req =>
                    req.category === 'material' && req.specificType === materialType && req.count > 0
                );
                if (materialReq) {
                    materialReq.count = Math.max(0, materialReq.count - providedAmount);
                    console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - Reduziere Material-Anforderung "${materialReq.originalName}" auf ${materialReq.count}`);
                }
            }

            if (tempGenLFReq && tempGenLFReq.count > 0) {
                const normalizedLFReqName = tempGenLFReq.originalName.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
                if (selectedVehicleCapabilities.provides.vehicle_categories.includes(normalizedLFReqName)) {
                    tempGenLFReq.count = Math.max(0, tempGenLFReq.count - 1);
                    console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - Reduziere generische LF-Anforderung auf ${tempGenLFReq.count}`);
                }
            }
            console.debug(`[LSS-Nachalarmierung] DEBUG (DRY RUN ALT REQ REDUCTION): Checking alternative requirements for vehicle ID: ${vehicleData.vehicleTypeId}`);
            for (const altReq of tempAltReqs) {
                if (altReq.count > 0) {
                    console.debug(`[LSS-Nachalarmierung]   - Processing alternative requirement: "${altReq.originalName}", current count: ${altReq.count}, alternatives: ${JSON.stringify(altReq.alternatives.map(a => a.name))}`);
                    const foundAlternativeOption = altReq.alternatives.find(altOption => altOption.ids.includes(vehicleData.vehicleTypeId));
                    if (foundAlternativeOption) {
                        const originalCount = altReq.count; // Capture original count for logging
                        altReq.count = Math.max(0, altReq.count - 1);
                        console.debug(`[LSS-Nachalarmierung]   - REDUCED: ODER-Anforderung "${altReq.originalName}" von ${originalCount} auf ${altReq.count}. Erfüllt durch "${foundAlternativeOption.name}" (ID: ${vehicleData.vehicleTypeId}).`);
                    } else {
                        console.debug(`[LSS-Nachalarmierung]   - NOT REDUCED: Vehicle ID ${vehicleData.vehicleTypeId} does not fulfill alternative requirement "${altReq.originalName}".`);
                    }
                }
            }

            // NEU: GRTW-Regel-Logik zur Reduzierung von RTW
            const GRTW_ID = VEHICLE_ID_BY_SHORT_NAME['GRTW'];
            const RTW_IDS = resolveRequirementToVehicleTypeIds('Rettungswagen').filter(id => id !== GRTW_ID && !CARE_VEHICLE_IDS.includes(id));
            if (vehicleData.vehicleTypeId === GRTW_ID) {
                console.log(`[LSS-Nachalarmierung] GRTW ausgewählt. Reduziere RTW-Anforderungen.`);
                let rtwReq = tempReqs.find(req => req.category === 'vehicle' && RTW_IDS.some(id => req.vehicleTypeIds.includes(id)));
                if (rtwReq) {
                    const reductionAmount = 6;
                    console.log(`[LSS-Nachalarmierung]  - Reduziere RTW-Anforderung von ${rtwReq.count} um ${reductionAmount} Einheiten.`);
                    rtwReq.count = Math.max(0, rtwReq.count - reductionAmount);
                }
            }

            // Handle KTW-induced GW-San adjustment for already selected KTW Typ B
            const ktwTypB_Id = VEHICLE_ID_BY_SHORT_NAME['KTW Typ B'];
            const gwSan_Id = VEHICLE_ID_BY_SHORT_NAME['GW-San'];
            if (vehicleData.vehicleTypeId === ktwTypB_Id && gwSan_Id) {
                // Combine vehicles already selected in previous REAL runs (globalCheckboxesToProcess)
                // and vehicles selected in the current DRY RUN (tempSelCheckboxes)
                const allKtwBTypSelected = new Set();
                globalCheckboxesToProcess.filter(v => v.vehicleTypeId === ktwTypB_Id).forEach(v => allKtwBTypSelected.add(v.checkbox.id));
                // Use the passed availableVehiclesForDryRun for the current dry run selections
                Array.from(tempSelCheckboxes).filter(cbId => {
                    const vData = availableVehiclesForDryRun.find(v => v.checkbox.id === cbId);
                    return vData && vData.vehicleTypeId === ktwTypB_Id;
                }).forEach(cbId => allKtwBTypSelected.add(cbId));

                const totalKtwBTypCount = allKtwBTypSelected.size;
                const neededGwSansForKtws = Math.ceil(totalKtwBTypCount / 6);
                let ktwInducedGwSanReq = tempReqs.find(r =>
                    r.isKTWInduced && r.vehicleTypeIds.includes(gwSan_Id)
                );
                let currentTargetGwSansCount = 0;
                if (ktwInducedGwSanReq) {
                    currentTargetGwSansCount = ktwInducedGwSanReq.initialCount;
                }

                if (neededGwSansForKtws > currentTargetGwSansCount) {
                    if (ktwInducedGwSanReq) {
                        const diff = neededGwSansForKtws - ktwInducedGwSanReq.initialCount;
                        ktwInducedGwSanReq.initialCount = neededGwSansForKtws;
                        ktwInducedGwSanReq.count += diff;
                        console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - GW-San (KTW-induziert) angepasst auf ${ktwInducedGwSanReq.count}`);
                    } else {
                        tempReqs.push({
                            originalName: `GW-San (für KTW Typ B, ${neededGwSansForKtws} benötigt)`,
                            count: neededGwSansForKtws,
                            initialCount: neededGwSansForKtws,
                            vehicleTypeIds: [gwSan_Id],
                            category: 'vehicle',
                            isKTWInduced: true
                        });
                        console.debug(`[LSS-Nachalarmierung] DEBUG (Dry Run):  - GW-San (KTW-induziert) hinzugefügt: ${neededGwSansForKtws}`);
                    }
                }
            }
        }
        return true;
    }

    async function processAlarmRequirements(filterCategory = 'all', bestEffortMode = false) {
        console.log(`[LSS-Nachalarmierung] Starte Prozess für "${filterCategory}"-Alarm. Best-Effort-Modus: ${bestEffortMode}`);
        let initialParsedRequirements = [];
        let initialParsedAlternativeRequirements = [];
        let initialGenericLFRequirement = null;

        let requirementsSource = 'none';
        let rawRequirementsText = '';

        const lssmDataRawHtmlDiv = document.querySelector('div.alert-missing-vehicles[data-raw-html]');
        if (lssmDataRawHtmlDiv) {
            const rawHtmlContent = lssmDataRawHtmlDiv.getAttribute('data-raw-html');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = rawHtmlContent;
            tempDiv.querySelectorAll('div[data-requirement-type]').forEach(reqDiv => {
                rawRequirementsText += reqDiv.textContent.trim() + '\u0002';
            });
            if (rawRequirementsText.endsWith('\u0002')) {
                rawRequirementsText = rawRequirementsText.slice(0, -1);
            }
            if (rawRequirementsText.trim() !== '') requirementsSource = 'lssm-data-raw-html';
        }

        if (requirementsSource === 'none') {
            const missingVehiclesDiv = document.getElementById('missing_text');
            if (missingVehiclesDiv && missingVehiclesDiv.style.display !== 'none' && missingVehiclesDiv.textContent.trim() !== '') {
                rawRequirementsText = missingVehiclesDiv.textContent.trim();
                requirementsSource = 'missing_text';
            }
        }

        if (rawRequirementsText.trim() !== '') {
            const sections = { vehicles: '', personnel: '', material: '' };
            const TEMP_VEH_MARKER = "%%VEHICLES_MARKER%%";
            const TEMP_PERS_MARKER = "%%PERSONNEL_MARKER%%";
            const TEMP_MAT_MARKER = "%%MATERIAL_MARKER%%";
            const BLOCK_SEP = '\u0003';

            let workingText = rawRequirementsText.split('\u0002').map(block => {
                return block.trim()
                    .replace(/Fehlende Fahrzeuge:/gi, TEMP_VEH_MARKER)
                    .replace(/Fehlendes Personal:/gi, TEMP_PERS_MARKER)
                    .replace(/Uns fehlt:|Nicht genügend Material:/gi, TEMP_MAT_MARKER);
            }).join(' ');
            workingText = workingText.replace(/\s+/g, ' ').trim();
            workingText = workingText
                .replace(new RegExp(TEMP_VEH_MARKER, 'g'), BLOCK_SEP + TEMP_VEH_MARKER)
                .replace(new RegExp(TEMP_PERS_MARKER, 'g'), BLOCK_SEP + TEMP_PERS_MARKER)
                .replace(new RegExp(TEMP_MAT_MARKER, 'g'), BLOCK_SEP + TEMP_MAT_MARKER);
            if (workingText.startsWith(BLOCK_SEP)) workingText = workingText.substring(BLOCK_SEP.length);

            const textBlocks = workingText.split(BLOCK_SEP);
            let currentSectionForNextUnmarkedBlock = 'vehicles';
            textBlocks.forEach(block => {
                block = block.trim(); if (!block) return;
                if (block.startsWith(TEMP_VEH_MARKER)) { sections.vehicles += (sections.vehicles ? ', ' : '') + block.substring(TEMP_VEH_MARKER.length).trim(); currentSectionForNextUnmarkedBlock = 'vehicles'; }
                else if (block.startsWith(TEMP_PERS_MARKER)) { sections.personnel += (sections.personnel ? ', ' : '') + block.substring(TEMP_PERS_MARKER.length).trim(); currentSectionForNextUnmarkedBlock = 'personnel'; }
                else if (block.startsWith(TEMP_MAT_MARKER)) { sections.material += (sections.material ? ', ' : '') + block.substring(TEMP_MAT_MARKER.length).trim(); currentSectionForNextUnmarkedBlock = 'material'; }
                else { sections[currentSectionForNextUnmarkedBlock] += (sections[currentSectionForNextUnmarkedBlock] ? ', ' : '') + block; }
            });
            ['vehicles', 'personnel', 'material'].forEach(cat => sections[cat] = sections[cat].replace(/^,\s*/, '').trim());

            // --- START FIX: Handle specific cases where requirements might be miscategorized by LSS text ---
            const specialVehicleToMaterialMapping = {
                'Schmutzwasserpumpen': 'Schmutzwasserpumpe',
                'Schmutzwasserpumpe': 'Schmutzwasserpumpe'
            };

            for (const specialVehicleName in specialVehicleToMaterialMapping) {
                const regex = new RegExp(`(\\d+)\\s*[xX]?\\s*(${specialVehicleName})`, 'i');
                let match;
                // Use a temporary copy to avoid infinite loops if replacement logic is flawed
                let tempVehiclesSection = sections.vehicles;
                let foundInThisPass = false;
                while ((match = tempVehiclesSection.match(regex)) !== null) {
                    foundInThisPass = true;
                    const fullMatch = match[0];
                    const count = parseInt(match[1], 10);
                    const materialType = specialVehicleToMaterialMapping[specialVehicleName];

                    // Remove from vehicles section
                    tempVehiclesSection = tempVehiclesSection.replace(fullMatch, '').replace(/,,\s*/g, ', ').replace(/,\s*$/g, '').replace(/^\s*,/g, '').trim();

                    // Add to material section
                    if (sections.material) {
                        sections.material += `, ${count}x ${materialType}`;
                    } else {
                        sections.material = `${count}x ${materialType}`;
                    }
                    sections.material = sections.material.replace(/\s+/g, ' ').trim(); // Clean up whitespace
                    console.log(`[LSS-Nachalarmierung] Umkategorisiert: "${fullMatch}" von Fahrzeugen zu Material als "${count}x ${materialType}".`);
                }
                if (foundInThisPass) {
                    sections.vehicles = tempVehiclesSection; // Update original if changes were made
                }
            }
            // --- END FIX ---

            const countAndNameRegex = /(\d+)\s*[xX]?\s*(.*)/;
            // Regex to capture the number and the rest of the material string, including "l/min"
            const materialRegex = /(\d+(?:\.\d{3})*)\s*[xX]?\s*(.*)/;

            if (sections.vehicles) {
                sections.vehicles.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
                    const vehicleMatch = part.match(countAndNameRegex);
                    if (vehicleMatch) {
                        let count = parseInt(vehicleMatch[1], 10);
                        let fullRequestText = vehicleMatch[2].trim();

                        // Exclude Care Vehicles from being added to initial requirements for primary selection
                        if (CARE_VEHICLE_NAMES.includes(fullRequestText) || CARE_VEHICLE_NAMES.includes(fullRequestText.toLowerCase())) {
                            console.log(`[LSS-Nachalarmierung] Fahrzeug "${fullRequestText}" ist ein Care Vehicle und wird von der primären Auswahl ausgeschlossen.`);
                            return;
                        }

                        const resolvedIds = resolveRequirementToVehicleTypeIds(fullRequestText);
                        // Filter out Care Vehicle IDs from the resolved IDs for this alarm
                        // (This ensures that even if a non-Care request *could* be fulfilled by a Care Vehicle,
                        // it won't be if that Care Vehicle is meant for the separate Care logic)
                        const filteredResolvedIds = resolvedIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

                        if (filteredResolvedIds.length === 0 && resolvedIds.length > 0) {
                            console.warn(`[LSS-Nachalarmierung] Fahrzeug "${fullRequestText}" konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
                            return;
                        }
                        if (filteredResolvedIds.length === 0) {
                            console.warn(`[LSS-Nachalarmierung] Fahrzeug "${fullRequestText}" konnte keinen gültigen (Nicht-Care-Vehicle) IDs zugeordnet werden, wird ignoriert.`);
                            return;
                        }

                        if (fullRequestText.toLowerCase().includes('löschfahrzeuge (lf)') || fullRequestText.toLowerCase().includes('löschfahrzeuge')) {
                            const resolvedIdsLF = resolveRequirementToVehicleTypeIds(fullRequestText);
                            const filteredResolvedIdsLF = resolvedIdsLF.filter(id => !CARE_VEHICLE_IDS.includes(id));
                            if (filteredResolvedIdsLF.length === 0 && resolvedIdsLF.length > 0) {
                                console.warn(`[LSS-Nachalarmierung] Generische LF-Anforderung "${fullRequestText}" konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
                                return;
                            }
                            if (filteredResolvedIdsLF.length === 0) {
                                console.warn(`[LSS-Nachalarmierung] Generische LF-Anforderung "${fullRequestText}" konnte keinen gültigen (Nicht-Care-Vehicle) IDs zugeordnet werden, wird ignoriert.`);
                            }
                            initialGenericLFRequirement = { originalName: fullRequestText, count: count, vehicleTypeIds: filteredResolvedIdsLF, category: 'vehicle', initialCount: count };
                            return;
                        }

                        const oderMatch = fullRequestText.match(/^(.*?)\s*\(([^)]+oder[^)]+)\)$/);
                        let isOderClause = false; let alternativesRaw = [];
                        let baseNameForOder; // Declare baseNameForOder here

                        if (oderMatch) {
                            baseNameForOder = oderMatch[1].trim() + " (" + oderMatch[2] + ")";
                            alternativesRaw = oderMatch[2].split(/\s+oder\s+/i).map(alt => alt.trim());
                            isOderClause = true;
                        } else if (fullRequestText.includes(' oder ') && !fullRequestText.includes('(') && !fullRequestText.match(/^\(.*\)$/) ) {
                            alternativesRaw = fullRequestText.split(/\s+oder\s+/i).map(alt => alt.trim());
                            isOderClause = true;
                            baseNameForOder = fullRequestText; // Assign fullRequestText here
                        }
                        if (isOderClause) {
                            let resolvedAlternatives = alternativesRaw.map(altName => ({ name: altName, ids: resolveRequirementToVehicleTypeIds(altName).filter(id => !CARE_VEHICLE_IDS.includes(id)) })).filter(alt => alt.ids.length > 0);
                            if (resolvedAlternatives.length > 0) {
                                initialParsedAlternativeRequirements.push({ originalName: baseNameForOder, count: count, alternatives: resolvedAlternatives, initialCount: count });
                            } else {
                                console.warn(`[LSS-Nachalarmierung] Keine gültigen (Nicht-Care-Vehicle) Alternativen für ODER-Klausel: "${baseNameForOder}", wird ignoriert.`);
                                return;
                            }
                        } else {
                            if (filteredResolvedIds.length > 0) {
                                initialParsedRequirements.push({ originalName: fullRequestText, count: count, vehicleTypeIds: filteredResolvedIds, category: 'vehicle', initialCount: count });
                            }
                        }
                    } else console.warn(`[LSS-Nachalarmierung] Konnte Fahrzeug-Anforderung nicht parsen: "${part}"`);
                });
            }
            if (sections.personnel) {
                for (const part of sections.personnel.split(',').map(s => s.trim()).filter(Boolean)) {
                    const personnelMatch = part.match(countAndNameRegex);
                    if (personnelMatch) {
                        let count = parseInt(personnelMatch[1], 10);
                        let personnelType = personnelMatch[2].trim();
                        let normalizedPersonnelType = personnelType;

                        if (personnelType.toLowerCase() === 'person mit gw-gefahrgut-ausbildung') {
                            normalizedPersonnelType = 'Personen mit GW-Gefahrgut-Ausbildung';
                        } else if (personnelType.toLowerCase().includes('dekon-p-ausbildung')) { // Added for Dekon-P personnel
                            normalizedPersonnelType = 'Personen mit Dekon-P-Ausbildung';
                        }

                        // Exclude Care Vehicle related personnel types from being added to initial requirements for primary selection
                        if (personnelType.toLowerCase() === 'betreuungshelfer' || personnelType.toLowerCase() === 'verpflegungshelfer') {
                            console.log(`[LSS-Nachalarmierung] Personal-Anforderung "${personnelType}" ist Care-bezogen und wird von der primären Auswahl ausgeschlossen.`);
                            continue;
                        }

                        const idsFromLinks = COMPREHENSIVE_REQUIREMENT_MAP[normalizedPersonnelType.toLowerCase()];
                        const filteredIdsFromLinks = idsFromLinks ? idsFromLinks.filter(id => !CARE_VEHICLE_IDS.includes(id)) : null;

                        if (idsFromLinks && filteredIdsFromLinks && filteredIdsFromLinks.length === 0 && idsFromLinks.length > 0) {
                            console.warn(`[LSS-Nachalarmierung] Personal-Anforderung "${personnelType}" konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
                            continue;
                        }

                        initialParsedRequirements.push({ originalName: personnelType, count: count, vehicleTypeIds: filteredIdsFromLinks, category: 'personnel', specificType: normalizedPersonnelType, initialCount: count });
                    } else console.warn(`[LSS-Nachalarmierung] Konnte Personal-Anforderung nicht parsen: "${part}"`);
                }
            }
            if (sections.material) {
                sections.material.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
                    const materialMatch = part.match(materialRegex);
                    if (materialMatch) {
                        const rawCountString = materialMatch[1];
                        let count = parseInt(rawCountString.replace(/\./g, ''), 10);
                        let originalFullMaterialText = materialMatch[2].trim();
                        let normalizedMaterialType = originalFullMaterialText;

                        // --- START MODIFICATION FOR PUMPENLEISTUNG / SCHMUTZWASSERPUMPE / WASSER ---
                        if (originalFullMaterialText.toLowerCase().includes('pumpenleistung') || originalFullMaterialText.toLowerCase().includes('feuerlöschpumpe')) {
                            console.log(`[LSS-Nachalarmierung] "Pumpenleistung" Anforderung "${part}" wird komplett ignoriert.`);
                            return;
                        } else if (originalFullMaterialText.toLowerCase().includes('schmutzwasserpumpe')) {
                            normalizedMaterialType = 'Schmutzwasserpumpe';
                            // FIX: Do NOT set count to 1 here; use the parsed count.
                            console.log(`[LSS-Nachalarmierung] "Schmutzwasserpumpe" Anforderung "${part}" (ursprünglich ${rawCountString} l/min) wird als ${count}x "Schmutzwasserpumpe" behandelt.`);
                        } else if (originalFullMaterialText.toLowerCase().includes('sonderlöschmittel')) {
                            normalizedMaterialType = 'Sonderlöschmittel';
                        } else if (originalFullMaterialText.toLowerCase().includes('wasser')) {
                            normalizedMaterialType = 'Wasser';
                            // Count remains as parsed for Water
                        }
                        // --- END MODIFICATION ---

                        // Exclude Care Vehicle related material/equipment types from being added to initial requirements for primary selection
                        if (originalFullMaterialText.toLowerCase().includes('betreuungs- und verpflegungsausstattung')) {
                            console.log(`[LSS-Nachalarmierung] Material-Anforderung "${originalFullMaterialText}" ist Care-bezogen und wird von der primären Auswahl ausgeschlossen.`);
                            return;
                        }

                        const idsFromLinks = COMPREHENSIVE_REQUIREMENT_MAP[normalizedMaterialType.toLowerCase()];
                        const filteredIdsFromLinks = idsFromLinks ? idsFromLinks.filter(id => !CARE_VEHICLE_IDS.includes(id)) : null;

                        if (idsFromLinks && filteredIdsFromLinks && filteredIdsFromLinks.length === 0 && idsFromLinks.length > 0) {
                            console.warn(`[LSS-Nachalarmierung] Material-Anforderung "${originalFullMaterialText}" konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
                            return;
                        }

                        initialParsedRequirements.push({
                            originalName: part,
                            count: count,
                            vehicleTypeIds: filteredIdsFromLinks,
                            category: 'material',
                            specificType: normalizedMaterialType,
                            initialCount: count
                        });
                    } else console.warn(`[LSS-Nachalarmierung] Konnte Material-Anforderung nicht parsen: "${part}"`);
                });
            }
        } else console.log("[LSS-Nachalarmierung] Keine verwertbaren Anforderungsdaten aus Textquellen gefunden.");

        const allPatientDivs = document.querySelectorAll('.mission_patient');

        document.querySelectorAll('.mission_patient .alert.alert-danger').forEach(alertDiv => {
            let reqText = alertDiv.textContent.replace('Wir benötigen:', '').trim();
            reqText.split(',').map(item => item.trim()).forEach(cleanReq => {
                // Exclude Care Vehicle related requirements from patient alerts for primary selection
                if (CARE_VEHICLE_NAMES.includes(cleanReq) || CARE_VEHICLE_NAMES.includes(cleanReq.toLowerCase()) ||
                    cleanReq.toLowerCase() === 'betreuungshelfer' || cleanReq.toLowerCase() === 'verpflegungshelfer' ||
                    cleanReq.toLowerCase().includes('betreuungs- und verpflegungsausstattung')) {
                    console.log(`[LSS-Nachalarmierung] Anforderung "${cleanReq}" aus Patienten-Alert ist Care-bezogen und wird von der primären Auswahl ausgeschlossen.`);
                    return;
                }

                if (cleanReq === 'LNA' || cleanReq === 'OrgL') {
                    // LNA/OrgL requirement from alert text will be processed by patient count logic.
                } else {
                    const resolvedInitialIds = resolveRequirementToVehicleTypeIds(cleanReq);
                    const ids = resolvedInitialIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

                    if (ids.length === 0 && resolvedInitialIds.length > 0) {
                         console.warn(`[LSS-Nachalarmierung] Fahrzeug-Anforderung "${cleanReq}" aus Alert konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
                         return;
                    }

                    const rthMatch = cleanReq.match(/^(RTH)\s*(\d+)$/);
                    if (rthMatch) {
                         const rthCount = parseInt(rthMatch[2],10);
                         if (ids.length > 0) {
                             let existingReq = initialParsedRequirements.find(r => r.originalName === rthMatch[1] && r.category === 'vehicle');
                             if (existingReq) {
                                existingReq.count += rthCount; existingReq.initialCount += rthCount;
                             }
                             else {
                                initialParsedRequirements.push({ originalName: rthMatch[1], count: rthCount, vehicleTypeIds: ids, category: 'vehicle', initialCount: rthCount });
                             }
                         }
                    } else {
                        if (ids.length > 0) {
                             let existingReq = initialParsedRequirements.find(r => r.originalName === cleanReq && r.category === 'vehicle');
                             if (existingReq) {
                                existingReq.count++; existingReq.initialCount++;
                             }
                             else {
                                initialParsedRequirements.push({ originalName: cleanReq, count: 1, vehicleTypeIds: ids, category: 'vehicle', initialCount: 1 });
                             }
                        }
                    }
                }
            });
        });

        let silentPatientsNeedingRTW = 0;
        allPatientDivs.forEach(patientDiv => {
            const hasExplicitAlert = patientDiv.querySelector('.alert.alert-danger');
            if (hasExplicitAlert) {
                return;
            }

            let shouldIgnoreSilentPatient = false;
            const hasCountdown = patientDiv.querySelector('div.mission_overview_countdown');

            if (hasCountdown) {
                shouldIgnoreSilentPatient = true;
            } else {
                const progressBar = patientDiv.querySelector('.progress-bar');
                if (progressBar) {
                    const styleWidth = progressBar.style.width;
                    if (styleWidth === '0%') {
                        shouldIgnoreSilentPatient = true;
                    }
                    if (progressBar.classList.contains('progress-bar-success')) {
                        shouldIgnoreSilentPatient = true;
                    }
                }
            }

            if (!shouldIgnoreSilentPatient) {
                silentPatientsNeedingRTW++;
            }
        });


        if (silentPatientsNeedingRTW > 0) {
            console.log(`[LSS-Nachalarmierung] Zusätzlich ${silentPatientsNeedingRTW} "stille" Patienten identifiziert, die wahrscheinlich einen RTW benötigen.`);
            const resolvedRtwIds = resolveRequirementToVehicleTypeIds('Rettungswagen');
            const rtwEquivalentTypeIds = resolvedRtwIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

            if (rtwEquivalentTypeIds.length === 0 && resolvedRtwIds.length > 0) {
                console.warn("[LSS-Nachalarmierung] 'Rettungswagen' für stille Patienten konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.");
            } else if (rtwEquivalentTypeIds && rtwEquivalentTypeIds.length > 0) {
                let rtwRequirement = initialParsedRequirements.find(req =>
                    req.category === 'vehicle' &&
                    rtwEquivalentTypeIds.some(id => req.vehicleTypeIds.includes(id)) &&
                    !req.isSilentPatientRequirement && !req.isKTWInduced && !req.isSilentPatientRuleRequirement
                );
                if (rtwRequirement) {
                    rtwRequirement.count += silentPatientsNeedingRTW;
                    rtwRequirement.initialCount += silentPatientsNeedingRTW;
                } else {
                    initialParsedRequirements.push({
                        originalName: `Rettungswagen (für ${silentPatientsNeedingRTW} stille Patienten)`,
                        count: silentPatientsNeedingRTW,
                        vehicleTypeIds: rtwEquivalentTypeIds,
                        category: 'vehicle',
                        initialCount: silentPatientsNeedingRTW,
                        isSilentPatientRequirement: true
                    });
                    console.log(`[LSS-Nachalarmierung] ${silentPatientsNeedingRTW} "Rettungswagen"-Anforderungen für stille Patienten hinzugefügt.`);
                }
            } else {
                console.warn("[LSS-Nachalarmierung] 'Rettungswagen' konnte nicht zu Fahrzeug-IDs für stille Patienten aufgelöst werden (möglicherweise nur Care Vehicles).");
            }
        }

        const totalPatientCount = allPatientDivs.length;

        // NEU: GRTW-Regel bei > 6 Patienten
        const GRTW_ID = VEHICLE_ID_BY_SHORT_NAME['GRTW'];
        if (totalPatientCount > 6 && GRTW_ID) {
            const grtwReqExists = initialParsedRequirements.some(req => req.vehicleTypeIds && req.vehicleTypeIds.includes(GRTW_ID));
            if (!grtwReqExists) {
                initialParsedRequirements.push({
                    originalName: `GRTW (für >6 Patienten)`,
                    count: 1,
                    vehicleTypeIds: [GRTW_ID],
                    category: 'vehicle',
                    initialCount: 1,
                    isGRTWPatientRule: true
                });
                console.log(`[LSS-Nachalarmierung] GRTW-Anforderung aufgrund von ${totalPatientCount} Patienten hinzugefügt.`);
            }
        }

        // NEF/RTH rule for EMS alarm with silent patients
        if (filterCategory === 'ems' && silentPatientsNeedingRTW > 0 && totalPatientCount > 0) {
            console.log(`[LSS-Nachalarmierung] EMS-Alarm mit ${silentPatientsNeedingRTW} stillen Patienten und ${totalPatientCount} Gesamtpatienten. Überprüfe NEF/RTH-Regel.`);

            const resolvedNefRuleIds = [
                VEHICLE_ID_BY_SHORT_NAME['NEF'],
                VEHICLE_ID_BY_SHORT_NAME['RTH'],
                VEHICLE_ID_BY_SHORT_NAME['GW-Bergrettung (NEF)'],
                VEHICLE_ID_BY_SHORT_NAME['RTH Winde']
            ].filter(Boolean).map(String);
            const nefRuleVehicleTypeIds = resolvedNefRuleIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

            const resolvedRthRuleIds = [
                VEHICLE_ID_BY_SHORT_NAME['RTH'],
                VEHICLE_ID_BY_SHORT_NAME['RTH Winde']
            ].filter(Boolean).map(String);
            const rthRuleVehicleTypeIds = resolvedRthRuleIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

            if (NEF_PER_10_SILENT_PATIENTS > 0 && nefRuleVehicleTypeIds.length === 0 && resolvedNefRuleIds.length > 0) {
                console.warn("[LSS-Nachalarmierung] NEF-Regel konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.");
            } else if (NEF_PER_10_SILENT_PATIENTS > 0 && nefRuleVehicleTypeIds.length > 0) {
                const numNefsToAdd = Math.ceil((totalPatientCount / 10) * NEF_PER_10_SILENT_PATIENTS);
                if (numNefsToAdd > 0) {
                    initialParsedRequirements.push({
                        originalName: `NEF (${numNefsToAdd} per Regel für ${totalPatientCount} Patienten)`,
                        count: numNefsToAdd,
                        vehicleTypeIds: nefRuleVehicleTypeIds,
                        category: 'vehicle',
                        initialCount: numNefsToAdd,
                        isSilentPatientRuleRequirement: true
                    });
                    console.log(`[LSS-Nachalarmierung] ${numNefsToAdd} NEF-äquivalente Fahrzeuge für stille Patientenregel hinzugefügt.`);
                }
            }

            if (RTH_PER_10_SILENT_PATIENTS > 0 && rthRuleVehicleTypeIds.length === 0 && resolvedRthRuleIds.length > 0) {
                console.warn("[LSS-Nachalarmierung] RTH-Regel konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.");
            } else if (RTH_PER_10_SILENT_PATIENTS > 0 && rthRuleVehicleTypeIds.length > 0) {
                const numRthsToAdd = Math.ceil((totalPatientCount / 10) * RTH_PER_10_SILENT_PATIENTS);
                if (numRthsToAdd > 0) {
                    initialParsedRequirements.push({
                        originalName: `RTH (${numRthsToAdd} per Regel für ${totalPatientCount} Patienten)`,
                        count: numRthsToAdd,
                        vehicleTypeIds: rthRuleVehicleTypeIds,
                        category: 'vehicle',
                        initialCount: numRthsToAdd,
                        isSilentPatientRuleRequirement: true
                    });
                    console.log(`[LSS-Nachalarmierung] ${numRthsToAdd} RTHs für stille Patientenregel hinzugefügt.`);
                }
            }
        }


        const lnaShortName = 'LNA';
        const orglShortName = 'OrgL';
        const resolvedLnaIds = COMPREHENSIVE_REQUIREMENT_MAP[lnaShortName.toLowerCase()] || [];
        const lnaVehicleTypeIds = resolvedLnaIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

        const resolvedOrglIds = COMPREHENSIVE_REQUIREMENT_MAP[orglShortName.toLowerCase()] || [];
        const orglVehicleTypeIds = resolvedOrglIds.filter(id => !CARE_VEHICLE_IDS.includes(id));

        const dispatchedVehicles = await getDispatchedVehicles();

        const lnaOnSceneOrOnWay = (dispatchedVehicles.onScene.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA']) || 0) > 0 ||
                                  (dispatchedVehicles.ownOnWay.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA']) || 0) > 0;
        const orgLOnSceneOrOnWay = (dispatchedVehicles.onScene.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL']) || 0) > 0 ||
                                   (dispatchedVehicles.ownOnWay.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL']) || 0) > 0;

        const lnaExplicitlyRequired = initialParsedRequirements.some(r => r.specificType === lnaShortName && !r.isSilentPatientRuleRequirement);
        const orgLExplicitlyRequired = initialParsedRequirements.some(r => r.specificType === orglShortName && !r.isSilentPatientRuleRequirement);

        if (totalPatientCount >= 5 && lnaVehicleTypeIds.length === 0 && resolvedLnaIds.length > 0) {
            console.warn(`[LSS-Nachalarmierung] LNA-Anforderung für >=5 Patienten konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
        } else if (totalPatientCount >= 5 && lnaVehicleTypeIds && lnaVehicleTypeIds.length > 0) {
            if (!lnaOnSceneOrOnWay && !lnaExplicitlyRequired) {
                initialParsedRequirements.push({
                    originalName: `${lnaShortName} (bei >=5 Patienten)`,
                    count: 1,
                    vehicleTypeIds: lnaVehicleTypeIds,
                    category: 'personnel',
                    specificType: lnaShortName,
                    initialCount: 1,
                    isPatientCountTriggered: true

                });
                console.log(`[LSS-Nachalarmierung] ${lnaShortName} Anforderung (Personal, 1) aufgrund von ${totalPatientCount} Patienten hinzugefügt.`);
            }
        }

        if (totalPatientCount >= 10 && orglVehicleTypeIds.length === 0 && resolvedOrglIds.length > 0) {
            console.warn(`[LSS-Nachalarmierung] OrgL-Anforderung für >=10 Patienten konnte nur Care Vehicle IDs zugeordnet werden, wird für primäre Auswahl ignoriert.`);
        } else if (totalPatientCount >= 10 && orglVehicleTypeIds && orglVehicleTypeIds.length > 0) {
            if (!orgLOnSceneOrOnWay && !orgLExplicitlyRequired) {
                initialParsedRequirements.push({
                    originalName: `${orglShortName} (bei >=10 Patienten)`,
                    count: 1,
                    vehicleTypeIds: orglVehicleTypeIds,
                    category: 'personnel',
                    specificType: orglShortName,
                    initialCount: 1,
                    isPatientCountTriggered: true
                });
                console.log(`[LSS-Nachalarmierung] ${orglShortName} Anforderung (Personal, 1) aufgrund von ${totalPatientCount} Patienten hinzugefügt.`);
            }
        }

        // --- REMOVED PRE-PROCESSING FOR SCHLAUCHWAGEN / SCHMUTZWASSERPUMPE OVERLAP ---
        // The reduction of Schlauchwagen OR requirement by Schmutzwasserpumpen will now happen dynamically
        // within trySelectVehicleDryRun when a Schmutzwasserpumpe vehicle is selected.
        console.log("[LSS-Nachalarmierung] Vorverarbeitung für Schlauchwagen/Schmutzwasserpumpe-Überlappung entfernt. Reduzierung erfolgt dynamisch.");


        console.log("[LSS-Nachalarmierung] Initial geparste Anforderungen:");
        initialParsedRequirements.forEach(req => { console.log(`  - ${req.originalName} (Kategorie: ${req.category}, Benötigt: ${req.count})`); });
        initialParsedAlternativeRequirements.forEach(req => { console.log(`  - ODER-Anforderung: ${req.count}x ${req.originalName} (Benötigt: ${req.count})`); }); // Added count here
        if (initialGenericLFRequirement) { console.log(`  - Generisches LF: ${initialGenericLFRequirement.originalName} (Benötigt: ${initialGenericLFRequirement.count})`); }


        // =================================================================================================
        // ===== START OF CORRECTED LOGIC FOR BEST-EFFORT RELOADING ========================================
        // =================================================================================================
        let reloadAttempts = 0;
        let allRequirementsMetInLoop = false;
        let bestDryRunResult = { selectedCheckboxes: new Set(), metAllReqs: false, remainingReqs: Infinity, remainingReqsDetails: [] };
        let finalAvailableVehicleData = []; // To store the vehicle list from the best attempt

        while (reloadAttempts <= MAX_RELOAD_ATTEMPTS && !allRequirementsMetInLoop) {
            console.log(`[LSS-Nachalarmierung] --- Schleife ${reloadAttempts + 1} / ${MAX_RELOAD_ATTEMPTS + 1} ---`);

            if (reloadAttempts > 0) {
                console.log(`[LSS-Nachalarmierung] Simuliere Klick auf 'Fahrzeuganzeige begrenzt! Fehlende Fahrzeuge laden!' Button (Nachladeversuch: ${reloadAttempts})`);
                const reloadButton = document.querySelector('a.missing_vehicles_load');
                if (reloadButton) { try { reloadButton.click(); if (document.activeElement !== document.body) document.activeElement.blur(); } catch (e) { console.error("[LSS-Nachalarmierung] Fehler bei Klick auf Reload-Button:", e); break; } }
                else { console.error("[LSS-Nachalarmierung] Fehler: Reload-Button nicht gefunden."); break; }
                console.log(`[LSS-Nachalarmierung] Warte ${RELOAD_WAIT_MS / 1000} Sekunden nach dem Nachladen...`);
                await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
            }

            let currentAvailableVehicleData = Array.from(document.querySelectorAll('tr.vehicle_select_table_tr')).map(row => {
                const checkbox = row.querySelector('input[type="checkbox"].vehicle_checkbox:not(:checked)');
                if (!checkbox || globalCheckboxesToProcess.some(v => v.checkbox === checkbox)) return null;
                const vehicleTypeTd = row.querySelector('td[vehicle_type_id]');
                const vehicleTypeId = vehicleTypeTd ? vehicleTypeTd.getAttribute('vehicle_type_id') : null;
                if (CARE_VEHICLE_IDS.includes(vehicleTypeId)) return null;
                const distanceDisplayElement = row.querySelector('td[id^="vehicle_sort_"]');
                let timeValue = parseDistance(distanceDisplayElement ? distanceDisplayElement.textContent : '');
                if (vehicleTypeTd) return { checkbox, vehicleTypeId, vehicleLabel: (vehicleTypeTd.querySelector('label.mission_vehicle_label')?.textContent.trim().replace(/\s+/g, ' ') || 'Unbekannt'), distance: timeValue };
                return null;
            }).filter(Boolean).sort((a, b) => a.distance - b.distance);

            let tempRequirementsForDryRun = JSON.parse(JSON.stringify(initialParsedRequirements));
            let tempAlternativeRequirementsForDryRun = JSON.parse(JSON.stringify(initialParsedAlternativeRequirements));
            let tempGenericLFRequirementForDryRun = initialGenericLFRequirement ? JSON.parse(JSON.stringify(initialGenericLFRequirement)) : null;

            if (filterCategory === 'ems') {
                tempRequirementsForDryRun = tempRequirementsForDryRun.filter(req => (req.isSilentPatientRuleRequirement && req.category === 'vehicle') || (req.category === 'personnel' && EMS_PERSONNEL_TYPES.includes(req.specificType)) || (req.category === 'vehicle' && req.vehicleTypeIds.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))) || (req.category === 'material' && ((req.isKTWInduced && req.vehicleTypeIds.includes(VEHICLE_ID_BY_SHORT_NAME['GW-San'])) || EMS_MATERIAL_TYPES.includes(req.specificType))));
                tempAlternativeRequirementsForDryRun = tempAlternativeRequirementsForDryRun.filter(altReq => altReq.alternatives.some(alt => alt.ids.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))));
                tempGenericLFRequirementForDryRun = null;
            }

            let tempSelectedCheckboxesInDryRun = new Set();
            console.log("[LSS-Nachalarmierung] Führe Trockenlauf durch, um Erfüllbarkeit zu prüfen...");

            // Phase 1: Personnel (Dry Run)
            tempRequirementsForDryRun.filter(req => req.category === 'personnel' && req.count > 0).forEach(req => {
                let neededPersonnelCount = req.count;
                let candidateVehiclesConfig = PERSONNEL_TO_VEHICLE_MAPPING[req.specificType];
                let vehicleShortNamesToConsider = [];
                if (req.vehicleTypeIds && req.vehicleTypeIds.length > 0) {
                     vehicleShortNamesToConsider = req.vehicleTypeIds.map(id => getVehicleShortNameById(id)).filter(Boolean);
                } else if (candidateVehiclesConfig) {
                    vehicleShortNamesToConsider = Object.keys(candidateVehiclesConfig);
                } else { return; }
                let personnelCandidates = [];
                for (const shortName of vehicleShortNamesToConsider) {
                    const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                    if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                        const capacity = candidateVehiclesConfig ? (candidateVehiclesConfig[shortName] || 0) : 0;
                        if (capacity > 0) {
                            currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId).forEach(v => personnelCandidates.push({ ...v, providesCapacity: capacity }));
                        }
                    }
                }
                personnelCandidates.sort((a,b) => { const aIsDirectReq = tempRequirementsForDryRun.some(dr => dr.category === 'vehicle' && dr.count > 0 && dr.vehicleTypeIds.includes(a.vehicleTypeId)), bIsDirectReq = tempRequirementsForDryRun.some(dr => dr.category === 'vehicle' && dr.count > 0 && dr.vehicleTypeIds.includes(b.vehicleTypeId)); if(aIsDirectReq && !bIsDirectReq)return -1; if(!aIsDirectReq && bIsDirectReq)return 1; if(b.providesCapacity !== a.providesCapacity)return b.providesCapacity - a.providesCapacity; return a.distance - b.distance; });
                for (const cand of personnelCandidates) {
                    if (neededPersonnelCount <= 0) break;
                    if (trySelectVehicleDryRun(cand, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                        neededPersonnelCount = Math.max(0, neededPersonnelCount - cand.providesCapacity);
                    }
                }
            });

            // Phase 2: Equipment (Dry Run)
            tempRequirementsForDryRun.filter(req => req.category === 'equipment' && req.count > 0).forEach(req => {
                let neededEquipmentCount = req.count;
                let vehicleShortNamesToConsider = [];
                if (req.vehicleTypeIds && req.vehicleTypeIds.length > 0) vehicleShortNamesToConsider = req.vehicleTypeIds.map(id => getVehicleShortNameById(id)).filter(Boolean);
                else if (EQUIPMENT_TO_VEHICLE_MAPPING[req.specificType]) vehicleShortNamesToConsider = EQUIPMENT_TO_VEHICLE_MAPPING[req.specificType];
                const candidatePoolForReq = [];
                for (const shortName of vehicleShortNamesToConsider) {
                    const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                    if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                        currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId).forEach(v => {
                            if (!tempSelectedCheckboxesInDryRun.has(v.checkbox.id)) {
                                candidatePoolForReq.push(v);
                            }
                        });
                    }
                }
                candidatePoolForReq.sort((a,b) => a.distance - b.distance);
                for (let i = 0; i < candidatePoolForReq.length && neededEquipmentCount > 0; i++) {
                    if (trySelectVehicleDryRun(candidatePoolForReq[i], tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                        neededEquipmentCount--;
                    }
                }
            });

            // Phase 3: Material (Dry Run)
            tempRequirementsForDryRun.filter(req => req.category === 'material' && req.count > 0).forEach(req => {
                let capacitiesConfig = MATERIAL_CAPACITY_MAPPING[req.specificType];
                if (!capacitiesConfig) { return; }
                if (req.specificType === 'Wasser') {
                    let currentTotalBaseWaterProvidedInDryRun = 0;
                    let currentSchlauchwagenCountInDryRun = 0;
                    const allSelectedCheckboxIdsForWaterCalc = new Set(tempSelectedCheckboxesInDryRun);
                    for (const vData of globalCheckboxesToProcess) { allSelectedCheckboxIdsForWaterCalc.add(vData.checkbox.id); }
                    for (const dryRunSelectedCheckboxId of allSelectedCheckboxIdsForWaterCalc) {
                        const vData = currentAvailableVehicleData.find(v => v.checkbox.id === dryRunSelectedCheckboxId) || globalCheckboxesToProcess.find(v => v.checkbox.id === dryRunSelectedCheckboxId);
                        if (vData) {
                            const dryRunSelectedTypeId = vData.vehicleTypeId;
                            const dryRunSelectedVehicleCaps = VEHICLE_CAPABILITIES[dryRunSelectedTypeId];
                            if (dryRunSelectedVehicleCaps) {
                                if (dryRunSelectedVehicleCaps.provides.material['Wasser'] !== undefined && !SCHLAUCHWAGEN_IDS.includes(dryRunSelectedTypeId)) {
                                    currentTotalBaseWaterProvidedInDryRun += dryRunSelectedVehicleCaps.provides.material['Wasser'];
                                }
                                if (SCHLAUCHWAGEN_IDS.includes(dryRunSelectedTypeId)) {
                                    currentSchlauchwagenCountInDryRun++;
                                }
                            }
                        }
                    }
                    let waterCandidates = [];
                    for (const shortName in capacitiesConfig) {
                        const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                        if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                            currentAvailableVehicleData.filter(v => !tempSelectedCheckboxesInDryRun.has(v.checkbox.id) && v.vehicleTypeId === targetTypeId).forEach(v => {
                                waterCandidates.push({ ...v, providesCapacity: capacitiesConfig[shortName] || 0, isSchlauchwagen: SCHLAUCHWAGEN_IDS.includes(targetTypeId) });
                            });
                        }
                    }
                    waterCandidates.sort((a, b) => {
                        if (!a.isSchlauchwagen && b.isSchlauchwagen) return -1;
                        if (a.isSchlauchwagen && !b.isSchlauchwagen) return 1;
                        if (b.providesCapacity !== a.providesCapacity) return b.providesCapacity - a.providesCapacity;
                        return a.distance - b.distance;
                    });
                    for (const cand of waterCandidates) {
                        const currentEffectiveWaterProvided = currentTotalBaseWaterProvidedInDryRun * (1 + (currentSchlauchwagenCountInDryRun * SCHLAUCHWAGEN_BONUS_PERCENTAGE));
                        if (currentEffectiveWaterProvided >= req.initialCount) break;
                        if (trySelectVehicleDryRun(cand, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                            if (cand.isSchlauchwagen) {
                                currentSchlauchwagenCountInDryRun++;
                            } else {
                                currentTotalBaseWaterProvidedInDryRun += cand.providesCapacity;
                            }
                        }
                    }
                    const finalEffectiveWaterProvided = currentTotalBaseWaterProvidedInDryRun * (1 + (currentSchlauchwagenCountInDryRun * SCHLAUCHWAGEN_BONUS_PERCENTAGE));
                    req.count = Math.max(0, req.initialCount - finalEffectiveWaterProvided);
                } else if (req.specificType === 'Schmutzwasserpumpe') {
                    let neededSwPuCount = req.count;
                    let swPuCandidates = [];
                    for (const shortName in capacitiesConfig) {
                        const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                        if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                            currentAvailableVehicleData.filter(v => !tempSelectedCheckboxesInDryRun.has(v.checkbox.id) && v.vehicleTypeId === targetTypeId).forEach(v => {
                                swPuCandidates.push({ ...v, providesCapacity: capacitiesConfig[shortName] });
                            });
                        }
                    }
                    swPuCandidates.sort((a,b) => a.distance - b.distance);
                    for (const cand of swPuCandidates) {
                        if (neededSwPuCount <= 0) break;
                        if (trySelectVehicleDryRun(cand, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                            neededSwPuCount--;
                        }
                    }
                    req.count = neededSwPuCount;
                } else {
                    let materialCandidates = [];
                    for (const shortName in capacitiesConfig) {
                        const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                        if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                            currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId).forEach(v => {
                                if (!tempSelectedCheckboxesInDryRun.has(v.checkbox.id)) {
                                    materialCandidates.push({ ...v, providesCapacity: capacitiesConfig[shortName] });
                                }
                            });
                        }
                    }
                    if (req.specificType === 'Sonderlöschmittel') {
                        // BUG FIX: The original logic was flawed because it used a pre-reduced `req.count`.
                        // This new logic correctly calculates the remaining need based on `req.initialCount`
                        // and what has already been provided by all selected vehicles, similar to the water logic.

                        // Create a pool of candidate vehicles for SLM that are not yet selected in this dry run
                        let slmCandidates = [];
                        for (const shortName in capacitiesConfig) {
                            const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName];
                            if (targetTypeId && !CARE_VEHICLE_IDS.includes(targetTypeId)) {
                                currentAvailableVehicleData.filter(v => !tempSelectedCheckboxesInDryRun.has(v.checkbox.id) && v.vehicleTypeId === targetTypeId).forEach(v => {
                                    slmCandidates.push({ ...v, providesCapacity: capacitiesConfig[shortName] });
                                });
                            }
                        }

                        // Sort candidates for optimal selection (SLF first, then by capacity, then distance)
                        const slfId = VEHICLE_ID_BY_SHORT_NAME['SLF'];
                        slmCandidates.sort((a, b) => {
                            const aIsSlf = a.vehicleTypeId === slfId;
                            const bIsSlf = b.vehicleTypeId === slfId;
                            if (aIsSlf && !bIsSlf) return -1;
                            if (!aIsSlf && bIsSlf) return 1;
                            if (b.providesCapacity !== a.providesCapacity) return b.providesCapacity - a.providesCapacity;
                            return a.distance - b.distance;
                        });

                        // Select candidates until the total SLM provided by all selected vehicles meets the initial requirement
                        for (const cand of slmCandidates) {
                            // Check current total before selecting a new vehicle
                            let currentTotalSlmFromAllSelected = 0;
                            const allSelectedCheckboxes = new Set([...globalCheckboxesToProcess.map(v => v.checkbox.id), ...tempSelectedCheckboxesInDryRun]);

                            for (const selectedCheckboxId of allSelectedCheckboxes) {
                                const vData = currentAvailableVehicleData.find(v => v.checkbox.id === selectedCheckboxId) || globalCheckboxesToProcess.find(v => v.checkbox.id === selectedCheckboxId);
                                if (vData) {
                                    const selectedVehicleCaps = VEHICLE_CAPABILITIES[vData.vehicleTypeId];
                                    if (selectedVehicleCaps?.provides?.material?.['Sonderlöschmittel']) {
                                        currentTotalSlmFromAllSelected += selectedVehicleCaps.provides.material['Sonderlöschmittel'];
                                    }
                                }
                            }

                            if (currentTotalSlmFromAllSelected >= req.initialCount) {
                                break; // Stop if requirement is already met
                            }

                            // Select the next best candidate
                            trySelectVehicleDryRun(cand, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData);
                        }

                        // After the selection loop, perform a final calculation to accurately update the requirement's count
                        let finalTotalSlmProvided = 0;
                        const finalAllSelectedCheckboxes = new Set([...globalCheckboxesToProcess.map(v => v.checkbox.id), ...tempSelectedCheckboxesInDryRun]);

                        for (const selectedCheckboxId of finalAllSelectedCheckboxes) {
                            const vData = currentAvailableVehicleData.find(v => v.checkbox.id === selectedCheckboxId) || globalCheckboxesToProcess.find(v => v.checkbox.id === selectedCheckboxId);
                            if (vData) {
                                const selectedVehicleCaps = VEHICLE_CAPABILITIES[vData.vehicleTypeId];
                                if (selectedVehicleCaps?.provides?.material?.['Sonderlöschmittel']) {
                                    finalTotalSlmProvided += selectedVehicleCaps.provides.material['Sonderlöschmittel'];
                                }
                            }
                        }
                        req.count = Math.max(0, req.initialCount - finalTotalSlmProvided);

                    } else {
                        materialCandidates.sort((a, b) => {
                            if (b.providesCapacity !== a.providesCapacity) return b.providesCapacity - a.providesCapacity;
                            return a.distance - b.distance;
                        });
                        for (const cand of materialCandidates) {
                            if (req.count <= 0) break;
                            if (trySelectVehicleDryRun(cand, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                                req.count = Math.max(0, req.count - cand.providesCapacity);
                            }
                        }
                    }
                }
            });

            // Phase 4: Direct vehicles (Dry Run)
            const sortedVehicleReqsDryRun = tempRequirementsForDryRun.filter(r => r.category === 'vehicle' && r.count > 0 && !r.isKTWInduced).sort((a,b) => {
                const aIsSchlauchwagenReq = a.vehicleTypeIds.some(id => SCHLAUCHWAGEN_IDS.includes(id));
                const bIsSchlauchwagenReq = b.vehicleTypeIds.some(id => SCHLAUCHWAGEN_IDS.includes(id));
                if (aIsSchlauchwagenReq && !bIsSchlauchwagenReq) return -1000;
                if (!aIsSchlauchwagenReq && bIsSchlauchwagenReq) return 1000;
                return 0;
            });
            sortedVehicleReqsDryRun.forEach(req => {
                let neededVehicleCount = req.count;
                let candidatePoolForReq = [];
                for (const targetTypeId of req.vehicleTypeIds) {
                    // NEU: ELW 1 SEG wird hier wieder berücksichtigt, wenn er explizit angefordert wird
                    if (!CARE_VEHICLE_IDS.includes(targetTypeId) || targetTypeId === ELW1_SEG_ID) {
                        candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));
                    }
                }
                candidatePoolForReq = [...new Map(candidatePoolForReq.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                for (let i = 0; i < candidatePoolForReq.length && neededVehicleCount > 0; i++) {
                    if (trySelectVehicleDryRun(candidatePoolForReq[i], tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                        neededVehicleCount--;
                    }
                }
                req.count = neededVehicleCount;
            });

            // Phase 4.5: KTW-induced GW-San (Dry Run)
             const ktwInducedGwSanReqsDryRun = tempRequirementsForDryRun.filter(req => req.isKTWInduced && req.category === 'vehicle' && req.count > 0);
             ktwInducedGwSanReqsDryRun.forEach(gwSanReq => {
                 let neededGwSanCount = gwSanReq.count;
                 let candidatePoolForGwSan = []; for (const targetTypeId of gwSanReq.vehicleTypeIds) {
                     if (!CARE_VEHICLE_IDS.includes(targetTypeId)) {
                         candidatePoolForGwSan.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));
                     }
                 }
                 candidatePoolForGwSan = [...new Map(candidatePoolForGwSan.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                 for (let i = 0; i < candidatePoolForGwSan.length && neededGwSanCount > 0; i++) {
                     if (trySelectVehicleDryRun(candidatePoolForGwSan[i], tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                         neededGwSanCount--;
                     }
                 }
             });

            // Phase 5: Generic LF (Dry Run)
            if (tempGenericLFRequirementForDryRun && tempGenericLFRequirementForDryRun.count > 0) {
                 let neededLFCount = tempGenericLFRequirementForDryRun.count;
                 const lfTypeIds = tempGenericLFRequirementForDryRun.vehicleTypeIds; let candidatePoolForLF = [];
                 for (const targetTypeId of lfTypeIds) {
                     if (!CARE_VEHICLE_IDS.includes(targetTypeId)) {
                         candidatePoolForLF.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));
                     }
                 }
                 candidatePoolForLF = [...new Map(candidatePoolForLF.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                 for (let i = 0; i < candidatePoolForLF.length && neededLFCount > 0; i++) {
                     if (trySelectVehicleDryRun(candidatePoolForLF[i], tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)) {
                         neededLFCount--;
                     }
                 }
            }

            // Phase 6: OR-vehicle (Dry Run)
            tempAlternativeRequirementsForDryRun.filter(req => req.count > 0).forEach(req => {
                 const allAlternativeVehicles = [];
                 for(const alternative of req.alternatives) {
                     for(const typeId of alternative.ids) {
                         if (!CARE_VEHICLE_IDS.includes(typeId)) {
                             currentAvailableVehicleData.filter(v => v.vehicleTypeId === typeId).forEach(v => allAlternativeVehicles.push({...v, originalAlternativeName: alternative.name}));
                         }
                     }
                 }
                 const uniqueAlternativeVehicles = [...new Map(allAlternativeVehicles.map(item => [item.checkbox, item])).values()].sort((a,b) => {
                     const aIsSchlauchwagen = SCHLAUCHWAGEN_IDS.includes(a.vehicleTypeId);
                     const bIsSchlauchwagen = SCHLAUCHWAGEN_IDS.includes(b.vehicleTypeId);
                     if (aIsSchlauchwagen && !bIsSchlauchwagen) return -1;
                     if (!aIsSchlauchwagen && bIsSchlauchwagen) return 1;
                     return a.distance - b.distance;
                 });
                 let currentSelectedCountForThisORReq = 0;
                 const totalNeededForThisORReq = req.count;
                 for (const foundVehicle of uniqueAlternativeVehicles) {
                     if (currentSelectedCountForThisORReq < totalNeededForThisORReq) {
                         if (trySelectVehicleDryRun(foundVehicle, tempRequirementsForDryRun, tempAlternativeRequirementsForDryRun, tempGenericLFRequirementForDryRun, tempSelectedCheckboxesInDryRun, currentAvailableVehicleData)){
                             currentSelectedCountForThisORReq++;
                         }
                     } else {
                         break;
                     }
                 }
                 req.count = Math.max(0, totalNeededForThisORReq - currentSelectedCountForThisORReq);
            });

            let dryRunRequirementsMet = tempRequirementsForDryRun.every(req => req.count === 0) && tempAlternativeRequirementsForDryRun.every(req => req.count === 0) && (!tempGenericLFRequirementForDryRun || tempGenericLFRequirementForDryRun.count === 0);

            const remainingReqsCount = tempRequirementsForDryRun.reduce((sum, r) => sum + r.count, 0) +
                                     tempAlternativeRequirementsForDryRun.reduce((sum, r) => sum + r.count, 0) +
                                     (tempGenericLFRequirementForDryRun ? tempGenericLFRequirementForDryRun.count : 0);

            // NEUER CODE: Detaillierte Liste der fehlenden Anforderungen erstellen
            const remainingReqsDetails = [];
            tempRequirementsForDryRun.filter(r => r.count > 0).forEach(r => {
                 remainingReqsDetails.push(`${r.count}x '${r.originalName}'`);
            });
            tempAlternativeRequirementsForDryRun.filter(r => r.count > 0).forEach(r => {
                 remainingReqsDetails.push(`${r.count}x '${r.originalName}' (ODER-Anforderung)`);
            });
            if (tempGenericLFRequirementForDryRun && tempGenericLFRequirementForDryRun.count > 0) {
                 remainingReqsDetails.push(`${tempGenericLFRequirementForDryRun.count}x '${tempGenericLFRequirementForDryRun.originalName}'`);
            }

            if (remainingReqsCount < bestDryRunResult.remainingReqs) {
                console.log(`[LSS-Nachalarmierung] Besserer Trockenlauf-Durchgang gefunden. Verbleibende Anforderungen: ${remainingReqsCount}`);
                bestDryRunResult = {
                    selectedCheckboxes: new Set(tempSelectedCheckboxesInDryRun),
                    metAllReqs: dryRunRequirementsMet,
                    remainingReqs: remainingReqsCount,
                    remainingReqsDetails: remainingReqsDetails
                };
                finalAvailableVehicleData = [...currentAvailableVehicleData];
            }

            if (dryRunRequirementsMet) {
                console.log("[LSS-Nachalarmierung] Trockenlauf erfolgreich: Alle Anforderungen können erfüllt werden. Beende Nachlade-Schleife.");
                allRequirementsMetInLoop = true;
            } else {
                 console.log(`[LSS-Nachalarmierung] Trockenlauf nicht erfolgreich. Verbleibende Anforderungen: ${remainingReqsCount}. Fehlend: ${remainingReqsDetails.join(', ')}. Versuche Nachladen.`);
            }

            reloadAttempts++;
        } // End while loop
// ===== START: Hinzugefügter Code für ELW 1 SEG Regel =====
        const elwSegTypeId = VEHICLE_ID_BY_SHORT_NAME['ELW 1 (SEG)'];
        if (elwSegTypeId) {
            // Prüfen, ob ein RD-Fahrzeug in der besten Auswahl enthalten ist
            let rdVehicleSelected = false;
            for (const checkboxId of bestDryRunResult.selectedCheckboxes) {
                const vehicleData = finalAvailableVehicleData.find(v => v.checkbox.id === checkboxId);
                if (vehicleData && EMS_VEHICLE_TYPE_IDS.includes(vehicleData.vehicleTypeId)) {
                    rdVehicleSelected = true;
                    break;
                }
            }

            if (rdVehicleSelected) {
                // Prüfen, ob der ELW 1 SEG schon dabei ist (alarmiert, gefordert oder bereits ausgewählt)
                const elwSegIsAlreadyDispatched = (dispatchedVehicles.onScene.get(elwSegTypeId) || 0) > 0 ||
                                                  (dispatchedVehicles.ownOnWay.get(elwSegTypeId) || 0) > 0;
                const elwSegIsAlreadyExplicitlyRequired = initialParsedRequirements.some(r => r.vehicleTypeIds && r.vehicleTypeIds.includes(elwSegTypeId));

                let elwSegIsAlreadySelected = false;
                for (const checkboxId of bestDryRunResult.selectedCheckboxes) {
                     const vehicleData = finalAvailableVehicleData.find(v => v.checkbox.id === checkboxId);
                     if (vehicleData && vehicleData.vehicleTypeId === elwSegTypeId) {
                         elwSegIsAlreadySelected = true;
                         break;
                     }
                }

                // Wenn ein RD-Fahrzeug kommt und der ELW 1 SEG noch nicht dabei ist, füge ihn hinzu
                if (!elwSegIsAlreadyDispatched && !elwSegIsAlreadyExplicitlyRequired && !elwSegIsAlreadySelected) {
                    const availableElwSeg = finalAvailableVehicleData.find(v => v.vehicleTypeId === elwSegTypeId);

                    if (availableElwSeg) {
                        bestDryRunResult.selectedCheckboxes.add(availableElwSeg.checkbox.id);
                        console.log(`[LSS-Nachalarmierung] REGEL: ELW 1 (SEG) "${availableElwSeg.vehicleLabel}" hinzugefügt, da ein RD-Fahrzeug alarmiert wird.`);
                    }
                }
            }
        }
        // ===== ENDE: Hinzugefügter Code für ELW 1 SEG Regel =====

        if (bestDryRunResult.metAllReqs) {
            console.log("[LSS-Nachalarmierung] Finale Auswahl: Alle Anforderungen wurden erfüllt.");
            for (const checkboxId of bestDryRunResult.selectedCheckboxes) {
                const vehicleData = finalAvailableVehicleData.find(v => v.checkbox.id === checkboxId);
                if (vehicleData) markAndAddVehicleToGlobalSelection(vehicleData);
            }
        } else if (bestEffortMode) {
            console.log(`[LSS-Nachalarmierung] Finale Auswahl (Best-Effort): Wähle die beste gefundene Teilauswahl mit ${bestDryRunResult.selectedCheckboxes.size} Fahrzeugen.`);
            if (bestDryRunResult.remainingReqsDetails.length > 0) {
                 console.log(`[LSS-Nachalarmierung] Es konnten die folgenden Anforderungen nicht erfüllt werden: ${bestDryRunResult.remainingReqsDetails.join(', ')}`);
            }
            for (const checkboxId of bestDryRunResult.selectedCheckboxes) {
                const vehicleData = finalAvailableVehicleData.find(v => v.checkbox.id === checkboxId);
                if (vehicleData) markAndAddVehicleToGlobalSelection(vehicleData);
            }
        } else {
            console.warn("[LSS-Nachalarmierung] Finale Auswahl: Nach allen Nachlade-Versuchen konnten nicht alle Anforderungen erfüllt werden. Standard-Modus ('Alles wählen') bricht ab.");
            if (bestDryRunResult.remainingReqsDetails.length > 0) {
                 console.warn(`[LSS-Nachalarmierung] Es konnten die folgenden Anforderungen nicht erfüllt werden: ${bestDryRunResult.remainingReqsDetails.join(', ')}`);
            }
        }
    }

    async function processCareVehicleRequirements() {
        console.log("[LSS-Nachalarmierung] Starte Care Vehicle Prozess.");

        let availableCareVehicles = Array.from(document.querySelectorAll('tr.vehicle_select_table_tr')).map(row => {
            const checkbox = row.querySelector('input[type="checkbox"].vehicle_checkbox');
            if (!checkbox || checkbox.checked) return null;
            const vehicleTypeTd = row.querySelector('td[vehicle_type_id]');
            const vehicleTypeId = vehicleTypeTd ? vehicleTypeTd.getAttribute('vehicle_type_id') : null;
            if (!CARE_VEHICLE_IDS.includes(vehicleTypeId)) return null;
            const distanceDisplayElement = row.querySelector('td[id^="vehicle_sort_"]');
            let timeValue = parseDistance(distanceDisplayElement ? distanceDisplayElement.textContent : '');
            if (vehicleTypeTd) {
                const vehicleLabel = vehicleTypeTd.querySelector('label.mission_vehicle_label')?.textContent.trim().replace(/\s+/g, ' ') || 'Unbekannt';
                return { checkbox, vehicleTypeId, vehicleLabel, distance: timeValue };
            }
            return null;
        }).filter(Boolean).sort((a, b) => a.distance - b.distance);

        let requiredKitchens = typeof window.LSS_Care_RequiredKitchensOverall !== 'undefined' ? window.LSS_Care_RequiredKitchensOverall : 0;
        let requiredCareHelpers = typeof window.LSS_Care_RequiredCareHelpersOverall !== 'undefined' ? window.LSS_Care_RequiredCareHelpersOverall : 0;

        console.log(`[LSS-Nachalarmierung] Benötigte Küchen (LSSM): ${requiredKitchens}, Benötigte Betreuer (LSSM): ${requiredCareHelpers}`);

        if (requiredKitchens > 0) {
            const kitchenVehicleTypeIds = [
                VEHICLE_ID_BY_SHORT_NAME['GW-Küche'],
                VEHICLE_ID_BY_SHORT_NAME['AB-Küche'],
                VEHICLE_ID_BY_SHORT_NAME['GW-Verpflegung'],
                VEHICLE_ID_BY_SHORT_NAME['Bt LKW'],
                VEHICLE_ID_BY_SHORT_NAME['FKH'],
                VEHICLE_ID_BY_SHORT_NAME['GW-Bt']
            ].filter(Boolean).map(String);
            let kitchenCandidates = availableCareVehicles.filter(v => kitchenVehicleTypeIds.includes(v.vehicleTypeId));
            for (const cand of kitchenCandidates) {
                if (requiredKitchens <= 0) break;
                if (markAndAddVehicleToGlobalSelection(cand)) {
                    requiredKitchens--;
                }
            }
        }

        if (requiredCareHelpers > 0) {
            const careHelperVehicleTypeIds = [
                VEHICLE_ID_BY_SHORT_NAME['MTW'],
                VEHICLE_ID_BY_SHORT_NAME['GW-Bt'],
                VEHICLE_ID_BY_SHORT_NAME['Bt-Kombi'],
                VEHICLE_ID_BY_SHORT_NAME['MTW-Verpflegung']
            ].filter(Boolean).map(String);
            let careHelperCandidates = availableCareVehicles.filter(v => careHelperVehicleTypeIds.includes(v.vehicleTypeId));
            careHelperCandidates.sort((a, b) => {
                const aProvides = VEHICLE_CAPABILITIES[a.vehicleTypeId]?.provides?.personnel?.['Betreuungshelfer'] || 0;
                const bProvides = VEHICLE_CAPABILITIES[b.vehicleTypeId]?.provides?.personnel?.['Betreuungshelfer'] || 0;
                if (bProvides !== aProvides) return bProvides - aProvides;
                return a.distance - b.distance;
            });
            for (const cand of careHelperCandidates) {
                const providedHelpers = VEHICLE_CAPABILITIES[cand.vehicleTypeId]?.provides?.personnel?.['Betreuungshelfer'] || 0;
                if (requiredCareHelpers <= 0) break;
                if (providedHelpers > 0 && markAndAddVehicleToGlobalSelection(cand)) {
                    requiredCareHelpers = Math.max(0, requiredCareHelpers - providedHelpers);
                }
            }
        }

        console.log("[LSS-Nachalarmierung] Care Vehicle Prozess abgeschlossen.");
    }

    async function alarmMissingVehiclesManually() {
        console.log("[LSS-Nachalarmierung] Manuell ausgelöst (ALLE Fahrzeuge, Alles-oder-Nichts).");
        const button = document.getElementById('autoAlarmButton');
        const emsButton = document.getElementById('autoAlarmButtonEMS');
        const bestEffortButton = document.getElementById('autoAlarmButtonBestEffort');
        if (button) {
            button.textContent = 'Verarbeite...';
            button.classList.add('disabled');
            if (emsButton) emsButton.classList.add('disabled');
            if (bestEffortButton) bestEffortButton.classList.add('disabled');
        }
        globalCheckboxesToProcess = []; // Reset global list for a new run

        try {
            await processAlarmRequirements('all', false); // Standard "all or nothing" mode

            if (globalCheckboxesToProcess.length > 0) {
                await processFinalCheckboxesPromise();
            }
            const careVehiclesNeeded = (typeof window.LSS_Care_RequiredKitchensOverall !== 'undefined' && window.LSS_Care_RequiredKitchensOverall > 0) || (typeof window.LSS_Care_RequiredCareHelpersOverall !== 'undefined' && window.LSS_Care_RequiredCareHelpersOverall > 0);
            if (careVehiclesNeeded) {
                await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
                await processCareVehicleRequirements();
                await processFinalCheckboxesPromise();
            }

            const finalVehiclesCheckedCount = globalCheckboxesToProcess.length;
            if(button) { button.textContent = `Fahrzeuge ausgewählt (${finalVehiclesCheckedCount})`; button.style.backgroundColor = '#5cb85c';}
        } catch (e) {
            console.error("[LSS-Nachalarmierung] Fehler während der Nachalarmierung (ALLE):", e);
            if (button) { button.textContent = 'Fehler!'; button.style.backgroundColor = 'red'; }
        } finally {
            if (button && button.textContent === 'Verarbeite...') { button.textContent = `Alles wählen (${HOTKEY_CONFIG.ALARM_MISSING_ALL})`; }
            if (button) button.classList.remove('disabled');
            if (emsButton) emsButton.classList.remove('disabled');
            if (bestEffortButton) bestEffortButton.classList.remove('disabled');
        }
    }

    async function alarmMissingEMSVehiclesManually() {
        console.log("[LSS-Nachalarmierung] Manuell ausgelöst (NUR Rettungsdienstfahrzeuge).");
        const button = document.getElementById('autoAlarmButtonEMS');
        const allButton = document.getElementById('autoAlarmButton');
        const bestEffortButton = document.getElementById('autoAlarmButtonBestEffort');
        if (button) {
            button.textContent = 'Verarbeite...';
            button.classList.add('disabled');
             if (allButton) allButton.classList.add('disabled');
             if (bestEffortButton) bestEffortButton.classList.add('disabled');
        }
        globalCheckboxesToProcess = []; // Reset global list for a new run

        try {
            await processAlarmRequirements('ems', false); // Standard, non-best-effort mode for EMS

            if (globalCheckboxesToProcess.length > 0) {
                await processFinalCheckboxesPromise();
            }
             const careVehiclesNeeded = (typeof window.LSS_Care_RequiredKitchensOverall !== 'undefined' && window.LSS_Care_RequiredKitchensOverall > 0) || (typeof window.LSS_Care_RequiredCareHelpersOverall !== 'undefined' && window.LSS_Care_RequiredCareHelpersOverall > 0);
            if (careVehiclesNeeded) {
                await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
                await processCareVehicleRequirements();
                await processFinalCheckboxesPromise();
            }

            const finalVehiclesCheckedCount = globalCheckboxesToProcess.length;
            if(button) { button.textContent = `Fahrzeuge ausgewählt (${finalVehiclesCheckedCount})`; button.style.backgroundColor = '#5cb85c';}
        } catch (e) {
            console.error("[LSS-Nachalarmierung] Fehler während der Nachalarmierung (EMS):", e);
            if (button) { button.textContent = 'Fehler!'; }
        } finally {
            if (button && button.textContent === 'Verarbeite...') { button.textContent = `Rettungsdienst wählen (${HOTKEY_CONFIG.ALARM_MISSING_EMS})`; }
            if (button) button.classList.remove('disabled');
            if (allButton) allButton.classList.remove('disabled');
            if (bestEffortButton) bestEffortButton.classList.remove('disabled');
        }
    }

    async function alarmBestEffortManually() {
        console.log("[LSS-Nachalarmierung] Manuell ausgelöst (Best-Effort-Modus).");
        const button = document.getElementById('autoAlarmButtonBestEffort');
        const allButton = document.getElementById('autoAlarmButton');
        const emsButton = document.getElementById('autoAlarmButtonEMS');
        if (button) {
            button.textContent = 'Verarbeite...';
            button.classList.add('disabled');
            if (allButton) allButton.classList.add('disabled');
            if (emsButton) emsButton.classList.add('disabled');
        }
        globalCheckboxesToProcess = []; // Reset global list for a new run

        try {
            await processAlarmRequirements('all', true); // Call with best-effort mode

            if (globalCheckboxesToProcess.length > 0) {
                await processFinalCheckboxesPromise();
            }
            const careVehiclesNeeded = (typeof window.LSS_Care_RequiredKitchensOverall !== 'undefined' && window.LSS_Care_RequiredKitchensOverall > 0) || (typeof window.LSS_Care_RequiredCareHelpersOverall !== 'undefined' && window.LSS_Care_RequiredCareHelpersOverall > 0);
            if (careVehiclesNeeded) {
                await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
                await processCareVehicleRequirements();
                await processFinalCheckboxesPromise();
            }

            const finalVehiclesCheckedCount = globalCheckboxesToProcess.length;
            if(button) { button.textContent = `Fahrzeuge ausgewählt (${finalVehiclesCheckedCount})`; button.style.backgroundColor = '#5cb85c';}
        } catch (e) {
            console.error("[LSS-Nachalarmierung] Fehler während der Nachalarmierung (Best-Effort):", e);
            if (button) { button.textContent = 'Fehler!'; button.style.backgroundColor = 'red'; }
        } finally {
            if (button && button.textContent === 'Verarbeite...') { button.textContent = `Wähle Mögliches (${HOTKEY_CONFIG.ALARM_BEST_EFFORT})`; }
            if (button) button.classList.remove('disabled');
            if (allButton) allButton.classList.remove('disabled');
            if (emsButton) emsButton.classList.remove('disabled');
        }
    }

    async function alarmAllAndNextMission() {
        const continueButton = document.querySelector('.alert_next');
        const allButtons = [
            document.getElementById('autoAlarmButton'),
            document.getElementById('autoAlarmButtonEMS'),
            document.getElementById('autoAlarmButtonBestEffort'),
            document.getElementById('autoAlarmAndNextButton'),
            document.getElementById('autoAlarmEMSAndNextButton')
        ];
        if (!continueButton) {
            console.error("[LSS-Nachalarmierung] 'Alarmieren und weiter'-Button nicht gefunden.");
            return;
        }
        continueButton.classList.add('disabled');
        allButtons.forEach(btn => btn && btn.classList.add('disabled'));

        try {
            await alarmMissingVehiclesManually();
            continueButton.click();
            if (document.activeElement !== document.body) document.activeElement.blur();
        } catch (e) {
            console.error("[LSS-Nachalarmierung] Fehler beim Alarmieren und Weiterleiten (ALLE):", e);
            continueButton.classList.remove('disabled');
            allButtons.forEach(btn => btn && btn.classList.remove('disabled'));
        }
    }

    async function alarmEMSAndNextMission() {
        const continueButton = document.querySelector('.alert_next');
        const allButtons = [
            document.getElementById('autoAlarmButton'),
            document.getElementById('autoAlarmButtonEMS'),
            document.getElementById('autoAlarmButtonBestEffort'),
            document.getElementById('autoAlarmAndNextButton'),
            document.getElementById('autoAlarmEMSAndNextButton')
        ];
        if (!continueButton) {
            console.error("[LSS-Nachalarmierung] 'Alarmieren und weiter'-Button nicht gefunden.");
            return;
        }
        continueButton.classList.add('disabled');
        allButtons.forEach(btn => btn && btn.classList.add('disabled'));

        try {
            await alarmMissingEMSVehiclesManually();
            continueButton.click();
            if (document.activeElement !== document.body) document.activeElement.blur();
        } catch (e) {
            console.error("[LSS-Nachalarmierung] Fehler beim Alarmieren und Weiterleiten (EMS):", e);
            continueButton.classList.remove('disabled');
            allButtons.forEach(btn => btn && btn.classList.remove('disabled'));
        }
    }

    function processFinalCheckboxesPromise() {
        return new Promise(resolve => {
            let currentFinalIdx = 0;
            function processOneCheckbox() {
                if (currentFinalIdx < globalCheckboxesToProcess.length) {
                    const { checkbox } = globalCheckboxesToProcess[currentFinalIdx];
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        const event = document.createEvent('HTMLEvents');
                        event.initEvent('change', true, true);
                        checkbox.dispatchEvent(event);
                    }
                    currentFinalIdx++;
                    setTimeout(processOneCheckbox, CHECKBOX_DELAY_MS);
                } else {
                    resolve();
                }
            }
            processOneCheckbox();
        });
    }

    function addAlarmButton() {
        if (!isInAlarmWindow()) { setTimeout(addAlarmButton, INITIAL_DELAY_MS * 2); return; }

        const referenceLoadingButton = document.querySelector('a.missing_vehicles_load');
        let targetParentNode;
        let actualReferenceNodeForInsertion;

        if (referenceLoadingButton && referenceLoadingButton.parentNode) {
            targetParentNode = referenceLoadingButton.parentNode;
            actualReferenceNodeForInsertion = referenceLoadingButton;
        } else {
            const dispatchButtonsDiv = document.getElementById('dispatch_buttons');
            if (dispatchButtonsDiv) {
                targetParentNode = dispatchButtonsDiv;
                actualReferenceNodeForInsertion = null; // Append
            } else {
                console.log("[LSS-Nachalarmierung] Ziel für Buttons nicht gefunden.");
                return;
            }
        }

        let newButtonAll = document.getElementById('autoAlarmButton');
        if (!newButtonAll) {
            newButtonAll = document.createElement('a');
            newButtonAll.id = 'autoAlarmButton';
            newButtonAll.className = 'btn btn-info';
            newButtonAll.style.cssText = 'margin-right: 5px; margin-bottom: 5px; background-color: #5cb85c; color: white; border-radius: 5px;';
            newButtonAll.addEventListener('click', alarmMissingVehiclesManually);
            targetParentNode.insertBefore(newButtonAll, actualReferenceNodeForInsertion);
        }
        newButtonAll.textContent = `Alles wählen (${HOTKEY_CONFIG.ALARM_MISSING_ALL})`;

        let newButtonEMS = document.getElementById('autoAlarmButtonEMS');
        if (!newButtonEMS) {
            newButtonEMS = document.createElement('a');
            newButtonEMS.id = 'autoAlarmButtonEMS';
            newButtonEMS.className = 'btn';
            newButtonEMS.style.cssText = 'margin-right: 5px; margin-bottom: 5px; background-color: #FF0000; color: white; border-radius: 5px;';
            newButtonEMS.addEventListener('click', alarmMissingEMSVehiclesManually);
            targetParentNode.insertBefore(newButtonEMS, actualReferenceNodeForInsertion);
        }
        newButtonEMS.textContent = `Rettungsdienst wählen (${HOTKEY_CONFIG.ALARM_MISSING_EMS})`;

        let newButtonBestEffort = document.getElementById('autoAlarmButtonBestEffort');
        if (!newButtonBestEffort) {
            newButtonBestEffort = document.createElement('a');
            newButtonBestEffort.id = 'autoAlarmButtonBestEffort';
            newButtonBestEffort.className = 'btn btn-warning';
            newButtonBestEffort.style.cssText = 'margin-right: 5px; margin-bottom: 5px; background-color: #f0ad4e; color: white; border-radius: 5px;';
            newButtonBestEffort.addEventListener('click', alarmBestEffortManually);
            targetParentNode.insertBefore(newButtonBestEffort, actualReferenceNodeForInsertion);
        }
        newButtonBestEffort.textContent = `Wähle Mögliches (${HOTKEY_CONFIG.ALARM_BEST_EFFORT})`;

        let newButtonAllAndNext = document.getElementById('autoAlarmAndNextButton');
        if (!newButtonAllAndNext) {
            newButtonAllAndNext = document.createElement('a');
            newButtonAllAndNext.id = 'autoAlarmAndNextButton';
            newButtonAllAndNext.className = 'btn btn-primary';
            newButtonAllAndNext.style.cssText = 'margin-right: 5px; margin-bottom: 5px; background-color: #286090; color: white; border-radius: 5px;';
            newButtonAllAndNext.addEventListener('click', alarmAllAndNextMission);
            targetParentNode.insertBefore(newButtonAllAndNext, newButtonBestEffort.nextSibling);
        }
        newButtonAllAndNext.textContent = `Alles wählen & alarmieren (${HOTKEY_CONFIG.ALARM_ALL_AND_NEXT})`;

        let newButtonEMSAndNext = document.getElementById('autoAlarmEMSAndNextButton');
        if (!newButtonEMSAndNext) {
            newButtonEMSAndNext = document.createElement('a');
            newButtonEMSAndNext.id = 'autoAlarmEMSAndNextButton';
            newButtonEMSAndNext.className = 'btn btn-danger';
            newButtonEMSAndNext.style.cssText = 'margin-right: 5px; margin-bottom: 5px; background-color: #d9534f; color: white; border-radius: 5px;';
            newButtonEMSAndNext.addEventListener('click', alarmEMSAndNextMission);
            targetParentNode.insertBefore(newButtonEMSAndNext, newButtonAllAndNext.nextSibling);
        }
        newButtonEMSAndNext.textContent = `RD wählen & alarmieren (${HOTKEY_CONFIG.ALARM_EMS_AND_NEXT})`;
    }

    function handleHotkeys(event) {
        const targetTagName = event.target.tagName.toLowerCase();
        if (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable) return;
        if (!isInAlarmWindow()) return;

        const actions = {
            [HOTKEY_CONFIG.ALARM_MISSING_ALL]: 'autoAlarmButton',
            [HOTKEY_CONFIG.ALARM_MISSING_EMS]: 'autoAlarmButtonEMS',
            [HOTKEY_CONFIG.ALARM_BEST_EFFORT]: 'autoAlarmButtonBestEffort',
            [HOTKEY_CONFIG.ALARM_ALL_AND_NEXT]: 'autoAlarmAndNextButton',
            [HOTKEY_CONFIG.ALARM_EMS_AND_NEXT]: 'autoAlarmEMSAndNextButton'
        };

        const buttonId = actions[event.key.toLowerCase()];
        if (buttonId) {
            event.preventDefault();
            const button = document.getElementById(buttonId);
            if (button && !button.classList.contains('disabled')) {
                button.click();
            }
        }
    }

    if (typeof GM_info !== 'undefined' && GM_info.script) {
        console.log(`LSS Nachalarmierungs-Skript: Initialisierung gestartet (v${GM_info.script.version}).`);
    } else {
        console.log(`LSS Nachalarmierungs-Skript: Initialisierung gestartet.`);
    }
    setTimeout(addAlarmButton, INITIAL_DELAY_MS);
    document.addEventListener('keydown', handleHotkeys);

})();