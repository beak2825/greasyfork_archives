// ==UserScript==
// @name         LSS - Fehlende Fahrzeuge Nachalarmieren (Debug)
// @namespace    http://tampermonkey.net/
// @version      1.44.27.40-debug-fix2
// @description  Fügt einen Button im Alarmfenster hinzu
// @author       Gemeinschaftsprojekt (modifiziert by AI)
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537178/LSS%20-%20Fehlende%20Fahrzeuge%20Nachalarmieren%20%28Debug%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537178/LSS%20-%20Fehlende%20Fahrzeuge%20Nachalarmieren%20%28Debug%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const INITIAL_DELAY_MS = 500; // Initial delay before checking for the alarm window and adding the button
    const CHECKBOX_DELAY_MS = 50;
    const RELOAD_WAIT_MS = 2000;
    const MAX_RELOAD_ATTEMPTS = 8;
    // Removed 'Person mit GW-Gefahrgut-Ausbildung' from EXCLUDED_VEHICLE_TYPES
    // as it should be processed and then cross-fulfilled by GW-Gefahrgut vehicles.
    const EXCLUDED_VEHICLE_TYPES = [];

    // Hotkey configuration
    const HOTKEY_CONFIG = {
        ALARM_MISSING_ALL: 'c', // Hotkey for "Fehlende nachalarmieren"
        ALARM_MISSING_EMS: 'r'  // Hotkey for "Rettungsdienst alarmieren"
    };

    // NEF/RTH rule for EMS alarm with silent patients
    // Defines how many units are requested per 10 total patients (using Math.ceil((totalPatients/10)*VALUE)).
    const NEF_PER_10_SILENT_PATIENTS = 2; // Number of NEF-equivalents (IDs 29, 31, 149, 157)
    const RTH_PER_10_SILENT_PATIENTS = 1; // Number of RTHs (IDs 31, 157)

    // Constants for distance/time calculation (from _1.json)
    const AVERAGE_SPEED_KMH = 65; // km/h
    const SECONDS_PER_HOUR = 3600; // s/h
    const METERS_PER_KILOMETER = 1000; // m/km

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
        { id: '40', name: 'MTW-TZ' }, { id: '41', name: 'MzGW (FGr N)' }, { id: '42', name: 'LKW K 9' }, { id: '43', 'name': 'BRmG R' },
        { id: '44', name: 'Anh DLE' }, { id: '45', name: 'MLW 5' }, { id: '46', name: 'WLF' }, { id: '47', name: 'AB-Rüst' },
        { id: '48', name: 'AB-Atemschutz' }, { id: '49', name: 'AB-Öl' }, { id: '50', name: 'GruKw' }, { id: '51', name: 'FüKW (Polizei)' },
        { id: '52', 'name': 'GefKw' }, { id: '53', name: 'Dekon-P' }, { id: '54', name: 'AB-Dekon-P' }, { id: '55', name: 'KdoW-LNA' },
        { id: '56', name: 'KdoW-OrgL' }, { id: '57', name: 'FwK' }, { id: '58', name: 'KTW Typ B' }, { id: '59', name: 'ELW 1 (SEG)' },
        { id: '60', name: 'GW-San' }, { id: '61', name: 'Polizeihubschrauber' }, { id: '62', name: 'AB-Schlauch' }, { id: '63', name: 'GW-Taucher' },
        { id: '64', name: 'GW-Wasserrettung' }, { id: '65', name: 'LKW 7 Lkr 19 tm' }, { id: '66', name: 'Anh MzB' }, { id: '67', name: 'Anh SchlB' },
        { id: '68', name: 'Anh MzAB' }, { id: '69', name: 'Tauchkraftwagen' }, { id: '70', name: 'MZB' }, { id: '71', name: 'AB-MZB' },
        { id: '72', name: 'WaWe 10' }, { id: '73', name: 'GRTW' }, { id: '74', name: 'NAW' }, { id: '75', 'name': 'FLF' },
        { id: '76', name: 'Rettungstreppe' }, { id: '77', name: 'AB-Gefahrgut' }, { id: '78', name: 'AB-Einsatzleitung' }, { id: '79', name: 'SEK - ZF' },
        { id: '80', name: 'SEK - MTF' }, { id: '81', name: 'MEK - ZF' }, { id: '82', name: 'MEK - MTF' }, { id: '83', 'name': 'GW-Werkfeuerwehr' },
        { id: '84', name: 'ULF mit Löscharm' }, { id: '85', name: 'TM 50' }, { id: '86', 'name': 'Turbolöscher' }, { id: '87', name: 'TLF 4000' },
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
        { id: '142', name: 'AB-Küche' }, { id: '143', name: 'Anh Schlauch' }, { id: '144', name: 'FüKW (THW)' }, { id: '145', name: 'FüKomKW' },
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
        "boote": [70], "dekon-p": [53, 54], "dhufükw": [94], "drehleiter": [2],
        "drehleiter (dlk 23)": [2], "drehleitern": [2], "drehleitern (dlk 23)": [2], "drehleitern (dlk 3)": [2], "dlk": [2],
        "elw": [3, 34, 78, 128, 129], // Generic ELW, excludes ELW 1 (SEG)
        "elw 1": [3, 128, 34, 129, 78], // ELW 1 can be fulfilled by ELW 1, ELW Drohne, ELW 2, ELW2 Drohne, AB-Einsatzleitung
        "elw 1 (seg)": [59], // ELW 1 (SEG) remains distinct
        "elw drohne": [128],
        "elw2 drohne": [129],
        "elw 2": [34, 78, 129], // ELW 2 can be ELW 2, AB-Einsatzleitung, ELW2 Drohne
        "hlf": [30, 90],
        "fachgruppen sb": [109],
        // SLF (ID 167) removed from generic LF categories as requested
        "feuerlöschpumpe": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167], // Keep 167 for pump capability
        "feuerlöschpumpen": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167], // Keep 167 for pump capability
        "feuerlöschpumpen (z. b. lf)": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 163, 166, 121, 167], // Keep 167 for pump capability
        "feuerwehrkräne (fwk)": [57],
        "feuerwehrleute": [0, 1, 10, 12, 17, 18, 19, 2, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 36, 37, 46, 5, 57, 6, 7, 75, 8, 84, 87, 88, 89, 9, 90, 126],
        "flugfeldlöschfahrzeug": [75], "flugfeldlöschfahrzeuge": [75],
        "funkstreifenwagen": [32, 98, 103], // All FuStW types can fulfill generic "funkstreifenwagen"
        "funkstreifenwagen (dienstgruppenleitung)": [103],
        "fustw": [32, 98, 103], // FuStW refers to regular FuStW, Zivilstreifenwagen, AND FuStW (DGL)
        "fustw (dgl)": [103], // FuStW (DGL) refers only to ID 103
        "fwk": [57], "fükw": [51, 144, 145], "gefahrgut": [27, 77],
        "gefkw": [52], "gefangenenkraftwagen": [52], "gerätekraftwagen": [39], "gerätekraftwagen (gkw)": [39], "gkw": [39],
        "grukw": [50], "gw l 2 wasser": [11, 13, 14, 15, 16, 62, 143], "gw-a": [5, 48], "gw-a oder ab-atemschutz": [5, 48],
        "gw-atemschutz": [5, 48], "gw-gefahrgut": [27, 77], "gw-höhenrettung": [33, 155, 158], "gw-mess": [12], "gw-messtechnik": [12],
        "gw-san": [60], "gw-taucher": [63, 69], "gw-wasserrettung": [64, 65, 70, 71], "gw-werkfeuerwehr": [83], "gw-öl": [10, 49],
        "itw": [97], "kdow lna": [55], "kdow orgl": [56], "kdow-lna": [55], "kdow-orgl": [56], "ktw": [38, 58], "ktw typ b": [58, 38],
        "lebefkw": [35], "leiter": [2, 85], "lkw 7 Lkr 19 tm": [65], "LKW K 9": [42], "lkw kipper": [42], "lna": [55], "orgl": [56],
        // SLF (ID 167) removed from generic LF categories as requested
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
        "personal": [0, 1, 10, 12, 17, 18, 19, 2, 20, 21, 22, 23, 24, 25, 26, 27, 30, 33, 36, 37, 46, 5, 57, 6, 7, 75, 8, 84, 87, 88, 89, 9, 90, 126],
        "polizeihubschrauber": [61, 156], "polizeimotorrad": [95], "polizeimotorräder": [95], "polizisten": [32, 98, 50, 51, 52, 61, 95, 103],
        "pumpenleistung": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90, 167], // Keep 167 for pump capability
        "radlader": [43], "radlader (brmg r)": [43], "rettung": [29, 31, 28, 38, 58, 55, 56, 59, 60, 73, 74, 97],
        "rettungshundefahrzeug": [91, 92], "rettungshundestaffel": [91, 92, 153], "rettungshundestaffel/n": [91, 92, 153],
        "rettungshundestaffeln": [91, 92, 153], "rettungtreppe": [76], "rettungtreppen": [76], "rettungswache": [38, 58, 28, 73, 74, 97],
        "rth": [31, 157],
        "rtw": [28, 38, 58, 73], // MODIFIED: Added KTW (38) as a substitute for RTW
        "rtw oder ktw oder ktw-b": [28, 38, 58, 73], "rtw oder ktw typ b": [28, 58, 73],
        "rtw, ktw": [28, 38, 58, 73], "rtw, naw": [28, 73, 74], "rw": [4, 30, 90, 162, 47], "rüstwagen": [4, 30, 47, 90, 162],
        "rüstwagen oder hlf": [4, 47, 162, 30, 90],
        "schlauchwagen": [11, 13, 14, 15, 16, 62, 143],
        "schlauchwagen (gw-l2 wasser, sw 1000, sw 2000 oder ähnliches)": [11, 13, 14, 15, 16, 62, 143],
        "schlauchwagen (gw-l2 wasser oder sw)": [11, 13, 14, 15, 16, 62, 143],
        "gw-l2 wasser": [11], "sw": [13,14,15,16],
        "schlauchwagen (gw-l wasser oder sw)": [11, 13, 14, 15, 16, 62, 143],
        "schmutzwasserpumpe": [101, 102], "schmutzwasserpumpen": [101, 102], "sek-fahrzeug": [79, 80], "sek-fahrzeuge": [79, 80],
        "sek-mtf": [80], "sek-zf": [81], "streifenwagen": [32, 98, 103], "tauchkraftwagen": [63, 69], "teleskopmast": [2, 85], "teleskopmasten": [2, 85],
        "thw-einsatzleitung": [40], "thw-einsatzleitung (mtw tz)": [40], "thw-mehrzweckkraftwagen": [41, 109],
        "thw-mehrzweckkraftwagen (mzkw)": [41, 109],
        "tragehilfe (z.b. durch ein lf)": [0, 1, 6, 7, 8, 9, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 36, 37, 87, 88, 89, 90],
        "turbolöscher": [86], "ulf": [84], "ulf mit löscharm": [84],
        "wasser": [0, 1, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 46, 6, 7, 8, 62, 75, 84, 86, 87, 88, 89, 90, 117, 118, 119, 120, 121, 143, 166, 167, 170],
        "wasserwerfer": [72], "wlf": [46], "zivilstreifenwagen": [98, 32], "zivilstreifenwagen, streifenwagen": [32, 98, 103],
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
        "s personal mit ausbildung": [134, 135, 136, 137], "fükw (thw)": [144, 145, 146], "fükw (thw)": [144, 145, 146], "FüKomKW": [145, 144, 146],
        "Anh FüLa": [146], "FMHC": [147], "MTW-FGr K": [148], "mtw fgr k": [148], "anh füla": [146], "fmkw": [147], "fgr k": [148],
        "höhenrettung (bergrettung)": [33, 155, 158], "bergrettungsfahrzeuge": [149, 150, 151, 152, 153, 154, 155, 158],
        "hubschrauber mit winde": [157, 156], "gw bergrettung": [150, 149, 158], "gw-bergrettung": [150, 149, 158], "gw bergrettung (nef)": [149, 150],
        "gw-bergrettung (nef) ": [149, 150], "gw-bergrettung (nef)": [149, 150], "bergrettung": [149, 150, 151, 152, 153, 154, 155, 158],
        "elw bergrettung": [151], "atv": [152], "bergrettung,": [149, 150, 151, 152, 153, 154, 155, 158],
        "hundestaffel (bergrettung)": [153, 91, 92], "schneefahrzeug": [154], "schneefahrzeuge": [154],
        "anh höhenrettung (bergrettung)": [155, 33], "polizeihubschrauber mit winde": [156, 61],
        "rettungsdienstler": [28, 29, 31, 38, 55, 56, 58, 59, 60, 73, 74, 91, 97, 149], "fükw (polizei)": [51, 35], "fükomkw": [145, 144, 146],
        "gw-verpflegung": [138, 139, 142], "gw-küche": [139, 138, 142], "mtw-verpflegung": [140, 131, 130], "lkw kipper (lkw k 9)": [42], "lkw k 9": [42],
        "brmg r": [43], "reiterstaffel": [134, 135, 137], "tankwagen": [118, 120, 121, 117, 119, 170],
        "seenotrettungsboote oder seenotrettungskreuzer": [159, 160], "seenotrettungsboote oder seenotrettungskreuzer,": [159, 160],
        "seenotrettungsboote": [160], "seenotrettungskreuzer": [159],
        "bahnrettungsfahrzeug": [162, 163, 164],
        "bahnrettungsfahrzeuge": [162, 163, 164],
        "hubschrauber (seenotrettung)": [161], "hubschrauber (seenotrettung),": [161],
        "thw-einsatzkräfte": [39, 40, 41, 42, 43, 45, 100, 109, 110, 111, 112, 113, 122, 123, 124, 125, 144, 145, 146, 147, 148],
        // Changed these entries to only include FuStW (ID 32) and Polizeimotorrad (ID 95)
        "streifenwagen oder polizeimotorräder": [32, 95],
        "streifenwagen oder polizeimotorräder ": [32, 95],
        "streifenwagen oder polizeimotorräd": [32, 95],
        "funkstreifenwagen oder polizeimotorräder": [32, 95],
        "funkstreifenwagen oder polizeimotorräder ": [32, 95],
        "funkstreifenwagen oder polizeimotorräd": [32, 95],
        "l/min": [0, 1, 101, 102, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 30, 37, 6, 7, 8, 87, 88, 89, 9, 90],
        "rettungswagen": [28, 38, 58, 73, 74, 97] // MODIFIED: Added KTW (38) as a substitute for Rettungswagen (generic)
    };

    const COMPREHENSIVE_REQUIREMENT_MAP = {};
    for (const key in LINKS_JSON_DATA) {
        COMPREHENSIVE_REQUIREMENT_MAP[key.toLowerCase()] = LINKS_JSON_DATA[key].map(String);
    }

    const LONG_NAME_TO_SHORT_NAME_MAPPING = {
        'Radlader (BRmG R)': 'BRmG R', 'GW-Atemschutz': 'GW-A', 'Drohneneinheit': 'MTF Drohne',
        'Funkstreifenwagen (Dienstgruppenleitung)': 'FuStW (DGL)',
        'THW-Einsatzleitung': 'MTW-TZ',
        'Gerätekraftwagen (GKW)': 'GKW',
        'Bahnrettungsfahrzeug': 'HLF Schiene',
    };

    const GENERIC_TO_SPECIFIC_VEHICLE_MAPPING = {
        'Kommandowagen': ['ELW 1', 'ELW 2', 'KdoW-LNA', 'KdoW-OrgL', 'leBefKw', 'FüKW (Polizei)', 'FüKW (THW)', 'FüKomKW', 'DHuFüKW', 'ELW Bergrettung', 'ELW Drohne', 'ELW2 Drohne'],
    };

    const PERSONNEL_TO_VEHICLE_MAPPING = {
        'Betreuungshelfer': { 'MTW': 8, 'GW-Bt': 2, 'Bt-Kombi': 9, 'MTW-Verpflegung': 8 },
        'Verpflegungshelfer': { 'MTW': 8, 'GW-Bt': 2, 'Bt LKW': 2, 'GW-Verpflegung': 2, 'GW-Küche': 2, 'MTW-Verpflegung': 8, 'AB-Küche': 0 },
        'LNA': { 'KdoW-LNA': 1 },
        'OrgL': { 'KdoW-OrgL': 1 },
        'Einsatzleiter 2': {'ELW 2':1, 'AB-Einsatzleitung':0, 'ELW2 Drohne':1},
        'Feuerwehrleute': { 'HLF 20': 9, 'HLF 10': 9, 'LF 20': 9, 'LF 10': 9, 'DLK 23': 3, 'ELW 1': 3, 'LF 8/6': 9, 'LF 20/16': 9, 'LF 10/6': 9, 'LF 16-TS': 9, 'TLF 2000': 3, 'TLF 3000': 3, 'TLF 8/8': 3, 'TLF 8/18': 3, 'TLF 16/24-Tr': 6, 'TLF 16/25': 6, 'TLF 16/45':3, 'TLF 20/40':3, 'TLF 20/40-SL':3, 'TLF 16':6, 'GW-A':3, 'RW':3, 'TSF-W':6, 'KLF':6, 'MLF':6, 'MTW':9, 'GW-Messtechnik':3, 'GW-Gefahrgut':3, 'GW-Öl':3, 'FLF':3, 'ULF mit Löscharm':3, 'TLF 4000':3, 'PTLF 4000':3, 'SLF':3, 'GTLF':3, 'MTF Drohne': 3, 'ELW 2':3, 'AB-Einsatzleitung':0, 'ELW Drohne':3, 'ELW2 Drohne':3 },
        'THW-Einsatzkräfte': { 'GKW': 9, 'MTW-TZ': 8, 'MzGW (FGr N)': 9, 'BRmG R': 2, 'LKW K 9':3, 'MLW 5':6, 'MLW 4':6, 'FüKW (THW)':3, 'FüKomKW':3, 'MTW-OV':6, 'MTW-Tr UL':6, 'MTW-FGr K':6 },
        'Polizisten': {'FuStW': 2, 'GruKw': 9, 'leBefKw': 3, 'FüKW (Polizei)': 3, 'GefKw':3, 'Polizeihubschrauber':3, 'Polizeimotorrad':1, 'FuStW (DGL)':2, 'Zivilstreifenwagen':2},
        'Rettungsdienstler': {'RTW':2, 'NEF':2, 'KTW':2, 'KTW Typ B':2, 'GRTW':3, 'NAW':3, 'ITW':3, 'RTH':3, 'KdoW-LNA':1, 'KdoW-OrgL':1, 'GW-San':9, 'ELW 1 (SEG)':3, 'GW-Bergrettung (NEF)':2 },
        'Personen mit GW-Gefahrgut-Ausbildung': { 'GW-Gefahrgut': 1 },
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
        'Wasser': { 'GTLF': 10000, 'TLF 4000': 4000, 'PTLF 4000': 4000, 'FLF': 6000, 'Turbolöscher': 2500, 'SLF':1000, 'TLF 20/40': 4000, 'TLF 20/40-SL': 4000, 'TLF 3000': 3000, 'TLF 2000': 2000, 'SW 2000': 2000, 'SW 1000': 1000, 'LF 20': 2000, 'HLF 20': 2000, 'LF 10': 1200, 'HLF 10': 1000, 'LF 20/16': 1600, 'LF 10/6':600, 'TSF-W':750, 'MLF':1000, 'KLF':500, 'AB-Tank':10000, 'AB-Lösch':4000, 'Kleintankwagen': 2000, 'Tankwagen':6000, 'AB-Wasser/Schaum': 2000 },
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
            if (MATERIAL_CAPACITY_MAPPING[materialType][shortName]) {
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

    console.log("DEBUG: VEHICLE_CAPABILITIES initialisiert:", VEHICLE_CAPABILITIES);

    const EMS_VEHICLE_TYPE_IDS = [
        VEHICLE_ID_BY_SHORT_NAME['RTW'], VEHICLE_ID_BY_SHORT_NAME['GRTW'],
        VEHICLE_ID_BY_SHORT_NAME['KTW'], VEHICLE_ID_BY_SHORT_NAME['KTW Typ B'],
        VEHICLE_ID_BY_SHORT_NAME['NEF'], VEHICLE_ID_BY_SHORT_NAME['RTH'],
        VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA'], VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL'],
        VEHICLE_ID_BY_SHORT_NAME['ELW 1 (SEG)'], // ELW 1 (SEG) is still an EMS vehicle type
        VEHICLE_ID_BY_SHORT_NAME['GW-San'],
        VEHICLE_ID_BY_SHORT_NAME['ITW']
    ].filter(Boolean).map(String);

    const EMS_PERSONNEL_TYPES = ['LNA', 'OrgL', 'Rettungsdienstler', 'Personen mit GW-Gefahrgut-Ausbildung', 'GW-Wasserrettung']; // Added GW-Wasserrettung here
    const EMS_MATERIAL_TYPES = ['Sonderlöschmittel', 'Wasser', 'Schaummittel', 'Feuerlöschpumpe', 'Schmutzwasserpumpe'].filter(type => {
        return false; // Effectively an empty list, as these are not EMS specific materials usually
    });


    function isInAlarmWindow() { return document.getElementById('mission-form') !== null; }

    /**
     * Parses a distance string (km/m) or a time string (min/sec)
     * and returns the estimated travel time in seconds.
     * For distances, time is calculated using AVERAGE_SPEED_KMH.
     * @param {string} text - The text content of the distance/duration element.
     * @returns {number} The estimated travel time in seconds, or Infinity if parsing fails.
     */
    function parseDistance(text) { // Function from _1.json
        // console.log(`DEBUG: [parseDistance] Raw input: "${text}"`); // Kann bei Bedarf aktiviert werden

        if (typeof text !== 'string' || text.trim() === "") {
            // console.warn(`DEBUG: [parseDistance] Input is not a valid string or is empty/invalid type: Received: "${text}", Type: ${typeof text}`);
            return Infinity;
        }
        const originalTextForWarning = text;
        let normalizedText = text.replace(',', '.').toLowerCase().trim();

        if (normalizedText === "") {
            // console.warn(`DEBUG: [parseDistance] Original text "${originalTextForWarning}" resulted in empty string after normalization.`);
            return Infinity;
        }

        // 1. Try to parse as time (e.g., "00 min. 50 sek.", "01 min 01 sek")
        let timeMatchMinSek = normalizedText.match(/(\d+)\s*min\.?\s*(\d+)\s*sek\.?/);
        if (timeMatchMinSek) {
            const minutes = parseInt(timeMatchMinSek[1], 10);
            const seconds = parseInt(timeMatchMinSek[2], 10);
            if (!isNaN(minutes) && !isNaN(seconds)) {
                const totalSeconds = (minutes * 60) + seconds;
                // console.log(`DEBUG: [parseDistance] Parsed "${originalTextForWarning}" (as min.sek.) to ${totalSeconds}s.`);
                return totalSeconds;
            }
        }

        // 2. Try to parse as time (e.g., "50 sek", "50 sek.")
        let timeMatchSek = normalizedText.match(/^(\d+)\s*sek\.?$/);
        if (timeMatchSek) {
            const seconds = parseInt(timeMatchSek[1], 10);
            if (!isNaN(seconds)) {
                // console.log(`DEBUG: [parseDistance] Parsed "${originalTextForWarning}" (as sek.) to ${seconds}s.`);
                return seconds;
            }
        }

        // 3. Try to parse as time (e.g., "2 min", "2 min.")
        let timeMatchMin = normalizedText.match(/^(\d+)\s*min\.?$/);
        if (timeMatchMin) {
            const minutes = parseInt(timeMatchMin[1], 10);
            if (!isNaN(minutes)) {
                const totalSeconds = minutes * 60;
                // console.log(`DEBUG: [parseDistance] Parsed "${originalTextForWarning}" (as min.) to ${totalSeconds}s.`);
                return totalSeconds;
            }
        }

        // 4. Try to parse as distance in km (e.g., "2.73 km")
        const kmMatch = normalizedText.match(/(\d+(\.\d+)?)\s*km/);
        if (kmMatch) {
            const distanceKm = parseFloat(kmMatch[1]);
            if (!isNaN(distanceKm)) {
                const calculatedTimeInSeconds = (distanceKm / AVERAGE_SPEED_KMH) * SECONDS_PER_HOUR;
                // HIER DIE NEUE console.log Anweisung:
                console.log(`DEBUG: [parseDistance] "km"-Angabe "${distanceKm} km" gefunden und in ${calculatedTimeInSeconds.toFixed(2)} Sekunden umgerechnet.`);
                return calculatedTimeInSeconds;
            }
        }

        // 5. Try to parse as distance in m (e.g., "500 m")
        const mMatch = normalizedText.match(/(\d+(\.\d+)?)\s*m/);
        if (mMatch) {
            const distanceM = parseFloat(mMatch[1]);
            if (!isNaN(distanceM)) {
                const distanceKm = distanceM / METERS_PER_KILOMETER;
                const calculatedTimeInSeconds = (distanceKm / AVERAGE_SPEED_KMH) * SECONDS_PER_HOUR;
                // Optional: console.log für Meter-Umrechnung, falls gewünscht
                // console.log(`DEBUG: [parseDistance] "m"-Angabe "${distanceM} m" (${distanceKm.toFixed(2)} km) gefunden und in ${calculatedTimeInSeconds.toFixed(2)} Sekunden umgerechnet.`);
                return calculatedTimeInSeconds;
            }
        }

        console.warn(`DEBUG: [parseDistance] Konnte Distanz/Zeit nicht in Sekunden umrechnen: Input war "${originalTextForWarning}" (normalisiert zu: "${normalizedText}")`);
        return Infinity;
    }

    function resolveRequirementToVehicleTypeIds(name) {
        const lowerName = name.toLowerCase().trim();
        if (COMPREHENSIVE_REQUIREMENT_MAP[lowerName]) {
            console.log(`DEBUG: Auflösung von Anforderung "${name}" (lower: "${lowerName}") zu IDs: ${COMPREHENSIVE_REQUIREMENT_MAP[lowerName].join(', ')}`);
            return COMPREHENSIVE_REQUIREMENT_MAP[lowerName];
        }
        if (lowerName === 'rettungswagen' && COMPREHENSIVE_REQUIREMENT_MAP['rettungswagen']) {
             console.log(`DEBUG: Auflösung von Anforderung "${name}" (lower: "${lowerName}") zu IDs: ${COMPREHENSIVE_REQUIREMENT_MAP['rettungswagen'].join(', ')}`);
             return COMPREHENSIVE_REQUIREMENT_MAP['rettungswagen'];
        }
        const nameWithoutBrackets = lowerName.replace(/\s*\(.*?\)\s*/g, '').trim();
        if (nameWithoutBrackets !== lowerName && COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets]) {
            console.log(`DEBUG: Auflösung von Anforderung "${name}" (ohne Klammern: "${nameWithoutBrackets}") zu IDs: ${COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets].join(', ')}`);
            return COMPREHENSIVE_REQUIREMENT_MAP[nameWithoutBrackets];
        }
        const shortNameFromLong = LONG_NAME_TO_SHORT_NAME_MAPPING[name];
        if (shortNameFromLong && VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]) {
            console.log(`DEBUG: Auflösung von Anforderung "${name}" über Long-Name-Mapping zu Short-Name "${shortNameFromLong}" (ID: ${VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]})`);
            return [VEHICLE_ID_BY_SHORT_NAME[shortNameFromLong]];
        }
        if (GENERIC_TO_SPECIFIC_VEHICLE_MAPPING[name] && name !== 'Rettungswagen') {
            const resolvedIds = GENERIC_TO_SPECIFIC_VEHICLE_MAPPING[name]
                .map(sn => VEHICLE_ID_BY_SHORT_NAME[sn])
                .filter(id => id !== undefined);
            console.log(`DEBUG: Auflösung von generischer Anforderung "${name}" zu spezifischen IDs: ${resolvedIds.join(', ')}`);
            return resolvedIds;
        }
        if (VEHICLE_ID_BY_SHORT_NAME[name]) {
            console.log(`DEBUG: Direkte Auflösung von Anforderung "${name}" zu ID: ${VEHICLE_ID_BY_SHORT_NAME[name]}`);
            return [VEHICLE_ID_BY_SHORT_NAME[name]];
        }
        if (VEHICLE_TYPE_ID_MAPPING[name]) {
             console.log(`DEBUG: Auflösung von Anforderung "${name}" über VEHICLE_TYPE_ID_MAPPING zu ID: ${VEHICLE_TYPE_ID_MAPPING[name]}`);
             return [VEHICLE_TYPE_ID_MAPPING[name]];
        }
        console.warn(`DEBUG: [resolveRequirementToVehicleTypeIds] Konnte "${name}" (lower: "${lowerName}") nicht zu Fahrzeug-IDs auflösen.`);
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
        console.log(`DEBUG: Tabelle "${tableId}" gefunden nach ${attempts} Versuchen.`);
        return missionVehiclesTable;
    }

    async function getAllVehiclesOnPage() {
        const uniqueVehicleIds = new Set();

        document.querySelectorAll('tr.vehicle_select_table_tr td[vehicle_type_id]').forEach(td => {
            uniqueVehicleIds.add(td.getAttribute('vehicle_type_id'));
        });
        console.log(`DEBUG: Gefundene Fahrzeug-IDs aus der Auswahl-Tabelle: ${Array.from(uniqueVehicleIds).join(', ')}`);


        const missionVehiclesAtMissionTable = await getMissionVehiclesTable('mission_vehicle_at_mission');
        if (missionVehiclesAtMissionTable) {
            missionVehiclesAtMissionTable.querySelectorAll('tbody tr').forEach(row => {
                const vehicleLink = row.querySelector('a[href*="/vehicles/"][vehicle_type_id]');
                if (vehicleLink) {
                    const vehicleTypeId = vehicleLink.getAttribute('vehicle_type_id');
                    if (vehicleTypeId) {
                        uniqueVehicleIds.add(vehicleTypeId);
                    }
                }
            });
            console.log(`DEBUG: Gefundene Fahrzeug-IDs vom Einsatzort-Tabelle hinzugefügt. Aktuell: ${Array.from(uniqueVehicleIds).join(', ')}`);
        }

        const missionVehiclesOnWayTable = await getMissionVehiclesTable('mission_vehicle_on_way');
        if (missionVehiclesOnWayTable) {
            missionVehiclesOnWayTable.querySelectorAll('tbody tr').forEach(row => {
                const vehicleLink = row.querySelector('a[href*="/vehicles/"][vehicle_type_id]');
                if (vehicleLink) {
                    const vehicleTypeId = vehicleLink.getAttribute('vehicle_type_id');
                    if (vehicleTypeId) {
                        uniqueVehicleIds.add(vehicleTypeId);
                    }
                }
            });
            console.log(`DEBUG: Gefundene Fahrzeug-IDs von der Anfahrt-Tabelle hinzugefügt. Aktuell: ${Array.from(uniqueVehicleIds).join(', ')}`);
        }

        return Array.from(uniqueVehicleIds);
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

                        if (vehicleTypeId) {
                            targetMap.set(vehicleTypeId, (targetMap.get(vehicleTypeId) || 0) + 1);
                            if (isOwnVehicle) {
                                ownTargetMap.set(vehicleTypeId, (ownTargetMap.get(vehicleTypeId) || 0) + 1);
                            }
                        }
                    }
                });
                console.log(`DEBUG: Verarbeitete Tabelle "${tableName}". Dispatched: ${JSON.stringify(Object.fromEntries(targetMap))}, Own Dispatched: ${JSON.stringify(Object.fromEntries(ownTargetMap))}`);
            }
        };

        const missionVehiclesAtMissionTable = await getMissionVehiclesTable('mission_vehicle_at_mission');
        processTable(missionVehiclesAtMissionTable, 'mission_vehicle_at_mission', dispatchedVehicles.onScene, dispatchedVehicles.ownOnScene);

        const missionVehiclesOnWayTable = await getMissionVehiclesTable('mission_vehicle_on_way');
        processTable(missionVehiclesOnWayTable, 'mission_vehicle_on_way', dispatchedVehicles.onWay, dispatchedVehicles.ownOnWay);

        return dispatchedVehicles;
    }

    async function processAlarmRequirements(filterCategory = 'all') {
        console.log(`DEBUG: Starte processAlarmRequirements mit Filter: "${filterCategory}"`);
        let initialParsedRequirements = []; // Store initial parsed requirements
        let initialParsedAlternativeRequirements = []; // Store initial parsed alternative requirements
        let initialGenericLFRequirement = null; // Store initial generic LF requirement

        let requirementsSource = 'none';
        let rawRequirementsText = '';

        // --- Initial Parsing (once) ---
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
            else console.log("DEBUG: LSSM 'data-raw-html' Div was empty.");
        }

        if (requirementsSource === 'none') {
            const missingVehiclesDiv = document.getElementById('missing_text');
            if (missingVehiclesDiv && missingVehiclesDiv.style.display !== 'none' && missingVehiclesDiv.textContent.trim() !== '') {
                rawRequirementsText = missingVehiclesDiv.textContent.trim();
                requirementsSource = 'missing_text';
            }
        }

        if (rawRequirementsText.trim() !== '') {
            console.log(`DEBUG: Requirements from source: ${requirementsSource}. Raw text (with \\u0002 as div separator):\n`, rawRequirementsText.replace(/\u0002/g, '\\u0002\n'));
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
            console.log("DEBUG: Split sections:", sections);

            const countAndNameRegex = /(\d+)\s*[xX]?\s*(.*)/;
            const materialRegex = /(\d+(?:\.\d{3})*)\s*[xX]?\s*(?:l\.\s*)?(.*)/;

            if (sections.vehicles) {
                sections.vehicles.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
                    const vehicleMatch = part.match(countAndNameRegex);
                    if (vehicleMatch) {
                        let count = parseInt(vehicleMatch[1], 10);
                        let fullRequestText = vehicleMatch[2].trim();
                        if (EXCLUDED_VEHICLE_TYPES.includes(fullRequestText) || EXCLUDED_VEHICLE_TYPES.includes(fullRequestText.toLowerCase())) {
                            console.log(`DEBUG: Vehicle "${fullRequestText}" is in EXCLUDED_VEHICLE_TYPES, ignoring.`);
                            return;
                        }

                        if (fullRequestText.toLowerCase().includes('löschfahrzeuge (lf)') || fullRequestText.toLowerCase().includes('löschfahrzeuge')) {
                            initialGenericLFRequirement = { originalName: fullRequestText, count: count, vehicleTypeIds: resolveRequirementToVehicleTypeIds(fullRequestText), category: 'vehicle', initialCount: count };
                            console.log(`DEBUG: Generic LF requirement parsed:`, initialGenericLFRequirement);
                            return;
                        }

                        const oderMatch = fullRequestText.match(/^(.*?)\s*\(([^)]+oder[^)]+)\)$/);
                        let isOderClause = false; let alternativesRaw = [];
                        let baseNameForOder = fullRequestText;

                        if (oderMatch) {
                            baseNameForOder = oderMatch[1].trim() + " (" + oderMatch[2] + ")";
                            alternativesRaw = oderMatch[2].split(/\s+oder\s+/i).map(alt => alt.trim());
                            isOderClause = true;
                        } else if (fullRequestText.includes(' oder ') && !fullRequestText.includes('(') && !fullRequestText.match(/^\(.*\)$/) ) {
                            alternativesRaw = fullRequestText.split(/\s+oder\s+/i).map(alt => alt.trim());
                            isOderClause = true;
                        }
                        if (isOderClause) {
                            let resolvedAlternatives = alternativesRaw.map(altName => ({ name: altName, ids: resolveRequirementToVehicleTypeIds(altName) })).filter(alt => alt.ids.length > 0);
                            if (resolvedAlternatives.length > 0) {
                                initialParsedAlternativeRequirements.push({ originalName: baseNameForOder, count: count, alternatives: resolvedAlternatives, initialCount: count });
                                console.log(`DEBUG: OR-requirement parsed:`, initialParsedAlternativeRequirements[initialParsedAlternativeRequirements.length - 1]);
                            } else console.warn(`DEBUG: No valid alternatives for OR clause: "${baseNameForOder}" (Alternatives were: ${alternativesRaw.join(';')})`);
                        } else {
                            const ids = resolveRequirementToVehicleTypeIds(fullRequestText);
                            if (ids.length > 0) {
                                initialParsedRequirements.push({ originalName: fullRequestText, count: count, vehicleTypeIds: ids, category: 'vehicle', initialCount: count });
                                console.log(`DEBUG: Direct vehicle requirement parsed:`, initialParsedRequirements[initialParsedRequirements.length - 1]);
                            }
                        }
                    } else console.warn(`DEBUG: [Vehicles section] Could not parse part as "NUMBER NAME": "${part}"`);
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
                            console.log(`DEBUG: Personnel "${personnelType}" normalized to "${normalizedPersonnelType}".`);
                        }

                        if (EXCLUDED_VEHICLE_TYPES.includes(personnelType) || EXCLUDED_VEHICLE_TYPES.includes(personnelType.toLowerCase())) {
                            console.log(`DEBUG: Personnel "${personnelType}" is in EXCLUDED_VEHICLE_TYPES, ignoring.`);
                            continue;
                        }

                        const idsFromLinks = COMPREHENSIVE_REQUIREMENT_MAP[normalizedPersonnelType.toLowerCase()];
                        initialParsedRequirements.push({ originalName: personnelType, count: count, vehicleTypeIds: idsFromLinks || null, category: 'personnel', specificType: normalizedPersonnelType, initialCount: count });
                        console.log(`DEBUG: Personnel requirement parsed:`, initialParsedRequirements[initialParsedRequirements.length - 1]);
                    } else console.warn(`DEBUG: [Personnel section] Could not parse: "${part}"`);
                }
            }
            if (sections.material) {
                sections.material.split(',').map(s => s.trim()).filter(Boolean).forEach(part => {
                    const materialMatch = part.match(materialRegex);
                    if (materialMatch) {
                        const rawCountString = materialMatch[1];
                        let count = parseInt(rawCountString.replace(/\./g, ''), 10);
                        let fullMaterialText = materialMatch[2].trim();

                        console.log(`DEBUG: Material parsing: Raw number "${rawCountString}", parsed number ${count}, raw text "${fullMaterialText}"`);

                         if (EXCLUDED_VEHICLE_TYPES.includes(fullMaterialText) || EXCLUDED_VEHICLE_TYPES.includes(fullMaterialText.toLowerCase())) {
                            console.log(`DEBUG: Material "${fullMaterialText}" is in EXCLUDED_VEHICLE_TYPES, ignoring.`);
                            return;
                        }

                        let normalizedMaterialType = fullMaterialText;
                        if (normalizedMaterialType.toLowerCase().includes('feuerlöschpumpe')) {
                            normalizedMaterialType = 'Feuerlöschpumpe';
                        } else if (normalizedMaterialType.toLowerCase().includes('schmutzwasserpumpe')) {
                            normalizedMaterialType = 'Schmutzwasserpumpe';
                        } else if (normalizedMaterialType.toLowerCase().includes('sonderlöschmittel')) {
                            normalizedMaterialType = 'Sonderlöschmittel';
                            console.log(`DEBUG: Material "Sonderlöschmittel" recognized. Original text: "${fullMaterialText}", required amount: ${count}`);
                        }

                        const idsFromLinks = COMPREHENSIVE_REQUIREMENT_MAP[normalizedMaterialType.toLowerCase()];
                        initialParsedRequirements.push({
                            originalName: fullMaterialText,
                            count: count,
                            vehicleTypeIds: idsFromLinks || null,
                            category: 'material',
                            specificType: normalizedMaterialType,
                            initialCount: count
                        });
                        console.log(`DEBUG: Material requirement parsed:`, initialParsedRequirements[initialParsedRequirements.length - 1]);
                    } else console.warn(`DEBUG: [Material section] Could not parse: "${part}"`);
                });
            }
        } else console.log("DEBUG: No usable requirement data from text sources.");

        const allPatientDivs = document.querySelectorAll('.mission_patient');
        console.log(`DEBUG: Total patient divs: ${allPatientDivs.length}`);

        document.querySelectorAll('.mission_patient .alert.alert-danger').forEach(alertDiv => {
            let reqText = alertDiv.textContent.replace('Wir benötigen:', '').trim();
            reqText.split(',').map(item => item.trim()).forEach(cleanReq => {
                if (cleanReq && !(EXCLUDED_VEHICLE_TYPES.includes(cleanReq) || EXCLUDED_VEHICLE_TYPES.includes(cleanReq.toLowerCase()))) {
                    if (cleanReq === 'LNA' || cleanReq === 'OrgL') {
                        console.log(`DEBUG: LNA/OrgL requirement "${cleanReq}" from alert text will be processed by patient count logic.`);
                    } else {
                        const rthMatch = cleanReq.match(/^(RTH)\s*(\d+)$/);
                        if (rthMatch) {
                             const rthCount = parseInt(rthMatch[2],10);
                             const ids = resolveRequirementToVehicleTypeIds(rthMatch[1]);
                             if (ids.length > 0) {
                                 let existingReq = initialParsedRequirements.find(r => r.originalName === rthMatch[1] && r.category === 'vehicle');
                                 if (existingReq) {
                                    existingReq.count += rthCount; existingReq.initialCount += rthCount;
                                    console.log(`DEBUG: Existing RTH requirement extended: ${existingReq.originalName}, new count: ${existingReq.count}`);
                                 }
                                 else {
                                    initialParsedRequirements.push({ originalName: rthMatch[1], count: rthCount, vehicleTypeIds: ids, category: 'vehicle', initialCount: rthCount });
                                    console.log(`DEBUG: New RTH requirement parsed from alert:`, initialParsedRequirements[initialParsedRequirements.length - 1]);
                                 }
                             }
                        } else {
                            const ids = resolveRequirementToVehicleTypeIds(cleanReq);
                            if (ids.length > 0) {
                                 let existingReq = initialParsedRequirements.find(r => r.originalName === cleanReq && r.category === 'vehicle');
                                 if (existingReq) {
                                    existingReq.count++; existingReq.initialCount++;
                                    console.log(`DEBUG: Existing vehicle requirement extended: ${existingReq.originalName}, new count: ${existingReq.count}`);
                                 }
                                 else {
                                    initialParsedRequirements.push({ originalName: cleanReq, count: 1, vehicleTypeIds: ids, category: 'vehicle', initialCount: 1 });
                                    console.log(`DEBUG: New vehicle requirement parsed from alert:`, initialParsedRequirements[initialParsedRequirements.length - 1]);
                                 }
                            }
                        }
                    }
                }
            });
        });

        let silentPatientsNeedingRTW = 0;
        allPatientDivs.forEach(patientDiv => {
            const patientNameForLog = patientDiv.textContent.trim().split('\n')[0].trim() || "Unnamed Patient";
            const hasExplicitAlert = patientDiv.querySelector('.alert.alert-danger');
            if (hasExplicitAlert) {
                console.log(`DEBUG: Silent patient "${patientNameForLog}" has explicit requirements, ignoring for RTW count.`);
                return; // Skip patients with explicit demands for this counter
            }

            let shouldIgnoreSilentPatient = false;
            const hasCountdown = patientDiv.querySelector('div.mission_overview_countdown');

            if (hasCountdown) {
                shouldIgnoreSilentPatient = true;
                console.log(`DEBUG: Silent patient "${patientNameForLog}" ignored (has countdown timer).`);
            } else {
                const progressBar = patientDiv.querySelector('.progress-bar');
                if (progressBar) {
                    const styleWidth = progressBar.style.width;
                    if (styleWidth === '0%') {
                        shouldIgnoreSilentPatient = true;
                        console.log(`DEBUG: Silent patient "${patientNameForLog}" ignored (Progress Bar 0%).`);
                    }
                    if (progressBar.classList.contains('progress-bar-success')) {
                        shouldIgnoreSilentPatient = true;
                        console.log(`DEBUG: Silent patient "${patientNameForLog}" ignored (Progress Bar Success).`);
                    }
                } else {
                     console.log(`DEBUG: Silent patient "${patientNameForLog}" has no countdown and no progress bar. Counting as needy.`);
                }
            }

            if (!shouldIgnoreSilentPatient) {
                silentPatientsNeedingRTW++;
            }
        });


        if (silentPatientsNeedingRTW > 0) {
            console.log(`DEBUG: Zusätzlich ${silentPatientsNeedingRTW} "stille" Patienten identifiziert, die wahrscheinlich einen RTW benötigen.`);
            const rtwEquivalentTypeIds = resolveRequirementToVehicleTypeIds('Rettungswagen'); // This now uses the updated "rettungswagen" list
            if (rtwEquivalentTypeIds && rtwEquivalentTypeIds.length > 0) {
                let rtwRequirement = initialParsedRequirements.find(req =>
                    req.category === 'vehicle' &&
                    rtwEquivalentTypeIds.some(id => req.vehicleTypeIds.includes(id)) &&
                    !req.isSilentPatientRequirement && !req.isKTWInduced && !req.isSilentPatientRuleRequirement
                );
                if (rtwRequirement) {
                    console.log(`DEBUG: Vorhandene Rettungswagen-Anforderung (${rtwRequirement.originalName}) um ${silentPatientsNeedingRTW} erhöht. Alt: ${rtwRequirement.count}`);
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
                    console.log(`DEBUG: ${silentPatientsNeedingRTW} "Rettungswagen"-Anforderungen für stille Patienten hinzugefügt.`);
                }
            } else {
                console.warn("DEBUG: 'Rettungswagen' konnte nicht zu Fahrzeug-IDs für stille Patienten aufgelöst werden.");
            }
        }

        const totalPatientCount = allPatientDivs.length;
        console.log(`DEBUG: Gesamtzahl Patienten für LNA/OrgL/NEF/RTH Regelprüfung: ${totalPatientCount}`);

        // NEF/RTH Rule for EMS alarm with silent patients
        if (filterCategory === 'ems' && silentPatientsNeedingRTW > 0 && totalPatientCount > 0) {
            console.log(`DEBUG: EMS-Alarm mit ${silentPatientsNeedingRTW} stillen Patienten und ${totalPatientCount} Gesamtpatienten. Überprüfe NEF/RTH-Regel.`);

            const nefRuleVehicleTypeIds = [
                VEHICLE_ID_BY_SHORT_NAME['NEF'],
                VEHICLE_ID_BY_SHORT_NAME['RTH'],
                VEHICLE_ID_BY_SHORT_NAME['GW-Bergrettung (NEF)'],
                VEHICLE_ID_BY_SHORT_NAME['RTH Winde']
            ].filter(Boolean).map(String);

            const rthRuleVehicleTypeIds = [
                VEHICLE_ID_BY_SHORT_NAME['RTH'],
                VEHICLE_ID_BY_SHORT_NAME['RTH Winde']
            ].filter(Boolean).map(String);

            if (NEF_PER_10_SILENT_PATIENTS > 0 && nefRuleVehicleTypeIds.length > 0) {
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
                    console.log(`DEBUG: ${numNefsToAdd} NEF-äquivalente Fahrzeuge (Typen: ${nefRuleVehicleTypeIds.join(', ')}) für stille Patientenregel hinzugefügt.`);
                }
            }

            if (RTH_PER_10_SILENT_PATIENTS > 0 && rthRuleVehicleTypeIds.length > 0) {
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
                    console.log(`DEBUG: ${numRthsToAdd} RTHs (Typen: ${rthRuleVehicleTypeIds.join(', ')}) für stille Patientenregel hinzugefügt.`);
                }
            }
        }


        const lnaShortName = 'LNA';
        const orglShortName = 'OrgL';
        const lnaVehicleTypeIds = COMPREHENSIVE_REQUIREMENT_MAP[lnaShortName.toLowerCase()];
        const orglVehicleTypeIds = COMPREHENSIVE_REQUIREMENT_MAP[orglShortName.toLowerCase()];

        const dispatchedVehicles = await getDispatchedVehicles();
        console.log("DEBUG: Bereits alarmierte Fahrzeuge (dispatchedVehicles):", dispatchedVehicles);

        const lnaOnSceneOrOnWay = (dispatchedVehicles.onScene.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA']) || 0) > 0 ||
                                  (dispatchedVehicles.ownOnWay.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-LNA']) || 0) > 0;
        const orgLOnSceneOrOnWay = (dispatchedVehicles.onScene.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL']) || 0) > 0 ||
                                   (dispatchedVehicles.ownOnWay.get(VEHICLE_ID_BY_SHORT_NAME['KdoW-OrgL']) || 0) > 0;

        const lnaExplicitlyRequired = initialParsedRequirements.some(r => r.specificType === lnaShortName && !r.isSilentPatientRuleRequirement);
        const orgLExplicitlyRequired = initialParsedRequirements.some(r => r.specificType === orglShortName && !r.isSilentPatientRuleRequirement);

        if (totalPatientCount >= 5 && lnaVehicleTypeIds && lnaVehicleTypeIds.length > 0) {
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
                console.log(`DEBUG: ${lnaShortName} Anforderung (Personal, 1) aufgrund von ${totalPatientCount} Patienten hinzugefügt.`);
            } else {
                 console.log(`DEBUG: ${lnaShortName} bereits vor Ort (beliebig) oder auf dem Weg (eigen) oder explizit angefordert für ${totalPatientCount} Patienten, keine weitere Hinzufügung.`);
            }
        }

        if (totalPatientCount >= 10 && orglVehicleTypeIds && orglVehicleTypeIds.length > 0) {
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
                console.log(`DEBUG: ${orglShortName} Anforderung (Personal, 1) aufgrund von ${totalPatientCount} Patienten hinzugefügt.`);
            } else {
                console.log(`DEBUG: ${orglShortName} bereits vor Ort (beliebig) oder auf dem Weg (eigen) oder explizit angefordert für ${totalPatientCount} Patienten, keine weitere Hinzufügung.`);
            }
        }

        console.log("DEBUG: Initial parsed requirements summary:");
        initialParsedRequirements.forEach(req => { console.log(`DEBUG:   - ${req.originalName} (Category: ${req.category}, Count: ${req.count}, VehicleTypeIds: [${req.vehicleTypeIds ? req.vehicleTypeIds.join(', ') : 'N/A'}])`); });
        initialParsedAlternativeRequirements.forEach(req => { console.log(`DEBUG:   - OR-Requirement: ${req.originalName} (Count: ${req.count}, Alternatives: ${req.alternatives.map(alt => `${alt.name} [${alt.ids.join(', ')}]`).join('; ')})`); });
        if (initialGenericLFRequirement) { console.log(`DEBUG:   - Generic LF: ${initialGenericLFRequirement.originalName} (Count: ${initialGenericLFRequirement.count}, VehicleTypeIds: [${initialGenericLFRequirement.vehicleTypeIds.join(', ')}])`); }


        let reloadAttempts = 0;
        let allRequirementsMetInLoop = false;
        let globalCheckboxesToProcess = [];
        let currentAvailableVehicleData = [];
        let filteredRequirements = [];
        let filteredAlternativeRequirements = [];
        let filteredGenericLFRequirement = null;
        let vehiclesSelectedInCurrentIteration = new Set();

        // ***** START OF MODIFIED addCheckboxToProcessLocal (from fix1 logic) *****
        function addCheckboxToProcessLocal(vehicleData, availableVehicles) {
            // Check if already selected IN THIS ITERATION (via vehiclesSelectedInCurrentIteration Set)
            if (vehiclesSelectedInCurrentIteration.has(vehicleData.checkbox)) {
                console.log(`DEBUG: Checkbox für Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) in dieser Iteration (vehiclesSelectedInCurrentIteration) bereits ausgewählt, überspringe erneute Verrechnung.`);
                return false; // Not newly processed in this call
            }

            // Check if this checkbox is ALREADY in the global list from a PREVIOUS iteration.
            const isAlreadyGloballySelected = globalCheckboxesToProcess.some(existingVData => existingVData.checkbox === vehicleData.checkbox);

            if (isAlreadyGloballySelected) {
                console.log(`DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) ist bereits in globalCheckboxesToProcess aus einer früheren Iteration. Wird nicht erneut hinzugefügt oder seine Kapazitäten verrechnet.`);
                // Mark as "used" in this iteration's set so it's not picked again *in this iteration for another role*,
                // even if it was selected globally for a different primary reason.
                vehiclesSelectedInCurrentIteration.add(vehicleData.checkbox);
                // Also remove from current iteration's available vehicles list if it's still there.
                const indexInAvailable = availableVehicles.findIndex(v => v.checkbox === vehicleData.checkbox);
                if (indexInAvailable > -1) {
                    availableVehicles.splice(indexInAvailable, 1);
                    console.log(`DEBUG: Bereits global ausgewähltes Fahrzeug "${vehicleData.vehicleLabel}" aus den aktuell verfügbaren Fahrzeugen für diese Iteration entfernt, da es als berücksichtigt gilt.`);
                }
                return false; // Not newly added globally, and provisions not re-counted.
            }

            // If we are here, it's not in vehiclesSelectedInCurrentIteration AND it's not already in globalCheckboxesToProcess.
            // This is a genuinely new vehicle for the overall selection process.

            globalCheckboxesToProcess.push(vehicleData); // Add to the global list
            vehiclesSelectedInCurrentIteration.add(vehicleData.checkbox); // Mark as selected for this current iteration pass
            console.log(`DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" (ID: ${vehicleData.vehicleTypeId}) zur globalen Auswahl und zur Auswahl dieser Iteration hinzugefügt. Kapazitäten werden jetzt verrechnet.`);

            // Original logic for removing from availableVehicles for the current iteration
            const index = availableVehicles.findIndex(v => v.checkbox === vehicleData.checkbox);
            if (index > -1) {
                availableVehicles.splice(index, 1);
                // The console log from the base script for this action was here, it's preserved:
                console.log(`DEBUG: Fahrzeug "${vehicleData.vehicleLabel}" aus den aktuell verfügbaren Fahrzeugen für diese Iteration entfernt.`);
            }

            // Cross-fulfillment logic (capability processing)
            // This will now only happen ONCE per unique checkbox globally.
            // The following capability processing block is from the original base script and preserved.
            const selectedVehicleCapabilities = VEHICLE_CAPABILITIES[vehicleData.vehicleTypeId];
            if (selectedVehicleCapabilities) {
                console.log(`DEBUG: Cross-Fulfillment: Fahrzeug "${selectedVehicleCapabilities.name}" (ID: ${vehicleData.vehicleTypeId}) ausgewählt.`);
                console.log(`DEBUG:   [${vehicleData.vehicleLabel} (ID: ${vehicleData.vehicleTypeId})] State of filteredRequirements BEFORE processing:`);
                filteredRequirements.forEach(req => {
                    console.log(`DEBUG:     - Req: "${req.originalName}" (Category: ${req.category}, Count: ${req.count}, VehicleTypeIds: [${req.vehicleTypeIds ? req.vehicleTypeIds.join(', ') : 'N/A'}])`);
                });

                for (const req of filteredRequirements) {
                    console.log(`DEBUG:   [${vehicleData.vehicleLabel} (ID: ${vehicleData.vehicleTypeId})] Checking requirement "${req.originalName}" (Category: ${req.category}, Current Count: ${req.count}, VehicleTypeIds: [${req.vehicleTypeIds ? req.vehicleTypeIds.join(', ') : 'N/A'}]) against selected vehicle ID: ${vehicleData.vehicleTypeId}`);
                    if (req.category === 'vehicle' && req.count > 0 && req.vehicleTypeIds.includes(vehicleData.vehicleTypeId)) {
                        const oldReqCount = req.count;
                        req.count = Math.max(0, req.count - 1);
                        console.log(`DEBUG:   [${vehicleData.vehicleLabel} (ID: ${vehicleData.vehicleTypeId})] MATCH! Reduziere direkte Fahrzeuganforderung "${req.originalName}" um 1. Vorher: ${oldReqCount}, Nachher: ${req.count}`);
                    } else {
                        // Preserving the original console log, even if it was commented out or conditional
                        console.log(`DEBUG:   [${vehicleData.vehicleLabel} (ID: ${vehicleData.vehicleTypeId})] NO MATCH for requirement "${req.originalName}".`);
                    }
                }
                for (const personnelType in selectedVehicleCapabilities.provides.personnel) {
                    const providedAmount = selectedVehicleCapabilities.provides.personnel[personnelType];
                    let personnelReq = filteredRequirements.find(req =>
                        req.category === 'personnel' && req.specificType === personnelType && req.count > 0
                    );
                    if (personnelReq) {
                        const oldPersonnelCount = personnelReq.count;
                        personnelReq.count = Math.max(0, personnelReq.count - providedAmount);
                        console.log(`DEBUG: Cross-Fulfillment: Reduziere Personal "${personnelType}" um ${providedAmount}. Vorher: ${oldPersonnelCount}, Nachher: ${personnelReq.count}`);
                    }
                }
                for (const materialType in selectedVehicleCapabilities.provides.material) {
                    const providedAmount = selectedVehicleCapabilities.provides.material[materialType];
                    let materialReq = filteredRequirements.find(req =>
                        req.category === 'material' && req.specificType === materialType && req.count > 0
                    );
                    if (materialReq) {
                        const oldMaterialCount = materialReq.count;
                        materialReq.count = Math.max(0, materialReq.count - providedAmount);
                        console.log(`DEBUG: Cross-Fulfillment: Reduziere Material "${materialType}" (Original: "${materialReq.originalName}") um ${providedAmount}. Vorher: ${oldMaterialCount}, Nachher: ${materialReq.count}`);
                    }
                }
                if (filteredGenericLFRequirement && filteredGenericLFRequirement.count > 0) {
                    const normalizedLFReqName = filteredGenericLFRequirement.originalName.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
                    if (selectedVehicleCapabilities.provides.vehicle_categories.includes(normalizedLFReqName)) {
                        const oldGenericLFCount = filteredGenericLFRequirement.count;
                        filteredGenericLFRequirement.count = Math.max(0, filteredGenericLFRequirement.count - 1);
                        console.log(`DEBUG: Cross-Fulfillment: Reduziere generische LF-Anforderung "${filteredGenericLFRequirement.originalName}" um 1. Vorher: ${oldGenericLFCount}, Nachher: ${filteredGenericLFRequirement.count}`);
                    }
                }
                const ktwTypB_Id = VEHICLE_ID_BY_SHORT_NAME['KTW Typ B'];
                const gwSan_Id = VEHICLE_ID_BY_SHORT_NAME['GW-San'];
                if (vehicleData.vehicleTypeId === ktwTypB_Id && gwSan_Id) {
                    console.log(`DEBUG: KTW Typ B (${vehicleData.vehicleLabel}) ausgewählt. Überprüfe GW-San-Anforderung (1 pro 6 KTW-B).`);
                    if (allPatientDivs.length > 0) {
                        const selectedKtwBTypCount = globalCheckboxesToProcess.filter(v => v.vehicleTypeId === ktwTypB_Id).length; // Count from the now-unique global list
                        const neededGwSansForKtws = Math.ceil(selectedKtwBTypCount / 6);
                        console.log(`DEBUG: Aktuell ${selectedKtwBTypCount} KTW Typ B ausgewählt (global). Benötigte GW-San (Regel): ${neededGwSansForKtws}`);
                        let ktwInducedGwSanReq = filteredRequirements.find(r =>
                            r.isKTWInduced && r.vehicleTypeIds.includes(gwSan_Id)
                        );
                        let currentTargetGwSansCount = 0;
                        if (ktwInducedGwSanReq) {
                            currentTargetGwSansCount = ktwInducedGwSanReq.initialCount; // Compare against initial target
                        }

                        if (neededGwSansForKtws > currentTargetGwSansCount) {
                            if (ktwInducedGwSanReq) {
                                const diff = neededGwSansForKtws - ktwInducedGwSanReq.initialCount; // Difference to the original target
                                ktwInducedGwSanReq.initialCount = neededGwSansForKtws; // Update target
                                ktwInducedGwSanReq.count += diff; // Adjust current need
                                console.log(`DEBUG: GW-San (KTW-induziert) Anforderung aktualisiert. Neue initiale Anzahl: ${ktwInducedGwSanReq.initialCount}, neue aktuelle Anzahl: ${ktwInducedGwSanReq.count}`);
                            } else {
                                filteredRequirements.push({
                                    originalName: `GW-San (für KTW Typ B, ${neededGwSansForKtws} benötigt)`,
                                    count: neededGwSansForKtws,
                                    initialCount: neededGwSansForKtws,
                                    vehicleTypeIds: [gwSan_Id],
                                    category: 'vehicle',
                                    isKTWInduced: true
                                });
                                console.log(`DEBUG: Neue GW-San (KTW-induziert) Anforderung hinzugefügt:`, filteredRequirements[filteredRequirements.length - 1]);
                            }
                        }
                    } else {
                        console.log(`DEBUG: Keine Patienten divs gefunden (allPatientDivs.length === 0), daher keine KTW-induzierte GW-San Anforderung erstellt/aktualisiert.`);
                    }
                }
                console.log(`DEBUG:   [${vehicleData.vehicleLabel} (ID: ${vehicleData.vehicleTypeId})] State of filteredRequirements AFTER processing:`);
                filteredRequirements.forEach(req => {
                    console.log(`DEBUG:     - Req: "${req.originalName}" (Category: ${req.category}, Count: ${req.count}, VehicleTypeIds: [${req.vehicleTypeIds ? req.vehicleTypeIds.join(', ') : 'N/A'}])`);
                });
            }
            return true; // Successfully added and processed globally
        }
        // ***** END OF MODIFIED addCheckboxToProcessLocal *****


        while (reloadAttempts <= MAX_RELOAD_ATTEMPTS && !allRequirementsMetInLoop) {
            console.log(`DEBUG: --- Schleife ${reloadAttempts + 1} / ${MAX_RELOAD_ATTEMPTS + 1} (Filter: ${filterCategory}) ---`);
            vehiclesSelectedInCurrentIteration = new Set(); // Reset for this new pass/iteration


            // ***** MODIFICATION FOR REQUIREMENT STATE ACROSS RELOADS (fix2 logic) *****
            let currentLoopEffectiveRequirements = JSON.parse(JSON.stringify(initialParsedRequirements));
            let currentLoopEffectiveAltRequirements = JSON.parse(JSON.stringify(initialParsedAlternativeRequirements));
            let currentLoopEffectiveGenericLFReq = initialGenericLFRequirement ? JSON.parse(JSON.stringify(initialGenericLFRequirement)) : null;

            if (globalCheckboxesToProcess.length > 0 && reloadAttempts > 0) { // Only adjust if vehicles were selected in PRIOR iterations
                console.log(`DEBUG: Iteration ${reloadAttempts + 1}: ${globalCheckboxesToProcess.length} Fahrzeuge bereits global ausgewählt. Passe aktuelle Bedarfslisten an...`);
                for (const globallySelectedVehicleData of globalCheckboxesToProcess) {
                    const vehicleTypeId = globallySelectedVehicleData.vehicleTypeId;
                    const selectedVehicleCapabilities = VEHICLE_CAPABILITIES[vehicleTypeId];
                    if (selectedVehicleCapabilities) {
                        // Adjust direct vehicle requirements
                        for (const req of currentLoopEffectiveRequirements) {
                            if (req.category === 'vehicle' && req.count > 0 && req.vehicleTypeIds.includes(vehicleTypeId)) {
                                // This vehicle type fulfilled one unit of this requirement
                                req.count = Math.max(0, req.count - 1);
                                // console.log(`DEBUG (Replay): Globales Fhz ${vehicleTypeId} reduziert ${req.originalName} auf ${req.count}`);
                            }
                        }
                        // Adjust personnel requirements
                        for (const personnelType in selectedVehicleCapabilities.provides.personnel) {
                            const providedAmount = selectedVehicleCapabilities.provides.personnel[personnelType];
                            let personnelReq = currentLoopEffectiveRequirements.find(req =>
                                req.category === 'personnel' && req.specificType === personnelType && req.count > 0
                            );
                            if (personnelReq) {
                                personnelReq.count = Math.max(0, personnelReq.count - providedAmount);
                                // console.log(`DEBUG (Replay): Globales Fhz ${vehicleTypeId} reduziert Personal ${personnelType} auf ${personnelReq.count}`);
                            }
                        }
                        // Adjust material requirements
                        for (const materialType in selectedVehicleCapabilities.provides.material) {
                            const providedAmount = selectedVehicleCapabilities.provides.material[materialType];
                            let materialReq = currentLoopEffectiveRequirements.find(req =>
                                req.category === 'material' && req.specificType === materialType && req.count > 0
                            );
                            if (materialReq) {
                                materialReq.count = Math.max(0, materialReq.count - providedAmount);
                                // console.log(`DEBUG (Replay): Globales Fhz ${vehicleTypeId} reduziert Material ${materialType} auf ${materialReq.count}`);
                            }
                        }
                        // Adjust generic LF requirements
                        if (currentLoopEffectiveGenericLFReq && currentLoopEffectiveGenericLFReq.count > 0) {
                            const normalizedLFReqName = currentLoopEffectiveGenericLFReq.originalName.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
                            if (selectedVehicleCapabilities.provides.vehicle_categories.includes(normalizedLFReqName)) {
                                currentLoopEffectiveGenericLFReq.count = Math.max(0, currentLoopEffectiveGenericLFReq.count - 1);
                                // console.log(`DEBUG (Replay): Globales Fhz ${vehicleTypeId} reduziert generisches LF ${currentLoopEffectiveGenericLFReq.originalName} auf ${currentLoopEffectiveGenericLFReq.count}`);
                            }
                        }
                        // Adjust alternative requirements' counts
                        for (const altReq of currentLoopEffectiveAltRequirements) {
                            if (altReq.count > 0) {
                                if (altReq.alternatives.some(altOption => altOption.ids.includes(vehicleTypeId))) {
                                    altReq.count = Math.max(0, altReq.count - 1);
                                    // console.log(`DEBUG (Replay): Globales Fhz ${vehicleTypeId} reduziert Alt-Req ${altReq.originalName} auf ${altReq.count}`);
                                    break; // Assume one vehicle fulfills one slot in one OR-group it matches during replay
                                }
                            }
                        }
                    }
                }
                 console.log("DEBUG: Effektive Anforderungen für diese Iteration angepasst (nach Abzug globaler Fahrzeuge).");
            }
            // ***** END OF MODIFICATION FOR REQUIREMENT STATE *****


            // Base script's logic for setting up filteredRequirements, filteredAlternativeRequirements, etc.
            // for the current iteration, now using the adjusted 'currentLoopEffective...' versions
            if (filterCategory === 'ems') {
                console.log("DEBUG: Anforderungen für EMS-only Alarm für diese Schleifeniteration filtern (aus effektiv angepassten Anforderungen).");
                filteredRequirements = currentLoopEffectiveRequirements.filter(req => (req.isSilentPatientRuleRequirement && req.category === 'vehicle') || (req.category === 'personnel' && EMS_PERSONNEL_TYPES.includes(req.specificType)) || (req.category === 'vehicle' && req.vehicleTypeIds.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))) || (req.category === 'material' && ((req.isKTWInduced && req.vehicleTypeIds.includes(VEHICLE_ID_BY_SHORT_NAME['GW-San'])) || EMS_MATERIAL_TYPES.includes(req.specificType))));
                filteredAlternativeRequirements = currentLoopEffectiveAltRequirements.filter(altReq => altReq.alternatives.some(alt => alt.ids.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))));
                filteredGenericLFRequirement = null; // Assuming generic LF is not EMS specific
            } else {
                filteredRequirements = currentLoopEffectiveRequirements;
                filteredAlternativeRequirements = currentLoopEffectiveAltRequirements;
                filteredGenericLFRequirement = currentLoopEffectiveGenericLFReq;
            }

            // The original logging of the state of requirements at the start of the loop:
            console.log(`DEBUG: Status der Anforderungen zu Beginn von Schleife ${reloadAttempts + 1} (nach Reset, globaler Anpassung und Filter):`);
            console.log("DEBUG: filteredRequirements (aktuell):", JSON.parse(JSON.stringify(filteredRequirements.map(r=>({...r, vehicleTypeIds:r.vehicleTypeIds ? r.vehicleTypeIds.join(',') : null })))));
            console.log("DEBUG: filteredAlternativeRequirements (aktuell):", JSON.parse(JSON.stringify(filteredAlternativeRequirements.map(r => ({...r, alternatives: r.alternatives.map(a => ({...a, ids:a.ids ? a.ids.join(',') : null}))})))));
            if (filteredGenericLFRequirement) console.log("DEBUG: filteredGenericLFRequirement (aktuell):", JSON.parse(JSON.stringify(filteredGenericLFRequirement)));


            if (reloadAttempts > 0) {
                let missingInfoPreviousAttempt = [];
                // Show what was missing based on the state BEFORE this iteration's effective requirement calculation
                // This means using initialParsedRequirements and how they were left by the *previous* full iteration.
                // For simplicity and to avoid complex state tracking of 'how requirements were left last time',
                // this log might be less precise or could be removed if too confusing.
                // The current filteredRequirements already reflect what this iteration *thinks* is missing.
                // The original script's logic for this log:
                initialParsedRequirements.filter(req => req.count > 0).forEach(req => { missingInfoPreviousAttempt.push(`${req.originalName} (noch ${req.count} benötigt global)`); }); // Note: this 'req.count' on initialParsedRequirements is not updated loop-to-loop.
                initialParsedAlternativeRequirements.filter(req => req.count > 0).forEach(req => { missingInfoPreviousAttempt.push(`${req.originalName} (noch ${req.count} aus Gruppe benötigt global)`); });
                if (initialGenericLFRequirement && initialGenericLFRequirement.count > 0) { missingInfoPreviousAttempt.push(`${initialGenericLFRequirement.originalName} (noch ${initialGenericLFRequirement.count} benötigt global)`); }
                // This log is now more of a snapshot of the *original total unfulfilled items* rather than *what last loop failed to get*.
                // For true "what last loop failed on", one would need to store the state of filteredRequirements at the *end* of the last loop.
                console.log(`DEBUG: Vor dem Nachladen: Theoretisch noch global ungedeckt (basierend auf initialen Listen, nicht unbedingt was letzter Loop spezifisch nicht fand): ${missingInfoPreviousAttempt.join('; ')}`);


                console.log("DEBUG: Simuliere Klick auf 'Fahrzeuganzeige begrenzt! Fehlende Fahrzeuge laden!' Button (Nachladeversuch: " + reloadAttempts + ")");
                const reloadButton = document.querySelector('a.missing_vehicles_load');
                if (reloadButton) { try { reloadButton.click(); if (document.activeElement !== document.body) document.activeElement.blur(); } catch (e) { console.error("DEBUG: Fehler bei Klick auf Reload-Button:", e); break; } }
                else { console.error("DEBUG: Fehler: Reload-Button nicht gefunden."); break; }
                console.log(`DEBUG: Warte ${RELOAD_WAIT_MS / 1000} Sekunden nach dem Nachladen...`);
                await new Promise(resolve => setTimeout(resolve, RELOAD_WAIT_MS));
            }

            // Updated currentAvailableVehicleData population from _1.json
            currentAvailableVehicleData = Array.from(document.querySelectorAll('tr.vehicle_select_table_tr')).map(row => {
                const checkbox = row.querySelector('input[type="checkbox"].vehicle_checkbox:not(:checked)'); if (!checkbox) return null;
                const vehicleTypeTd = row.querySelector('td[vehicle_type_id]');
                const distanceDisplayElement = row.querySelector('td[id^="vehicle_sort_"]'); // NEUER SELEKTOR
                if (vehicleTypeTd && !distanceDisplayElement) { // WARNUNG WENN SELEKTOR FEHLSCHLÄGT
                     console.warn("DEBUG: Kein Element für Distanz/Zeit mit id^='vehicle_sort_' in Zeile gefunden für Fahrzeug-Typ:", vehicleTypeTd.getAttribute('vehicle_type_id'), "Zeilen-HTML:", row.innerHTML);
                }
                let timeValue = parseDistance(distanceDisplayElement ? distanceDisplayElement.textContent : ''); // VERWENDET NEUE parseDistance

                if (vehicleTypeTd) return { checkbox, vehicleTypeId: vehicleTypeTd.getAttribute('vehicle_type_id'), vehicleLabel: (vehicleTypeTd.querySelector('label.mission_vehicle_label')?.textContent.trim().replace(/\s+/g, ' ') || 'Unbekannt'), distance: timeValue }; // distance IST JETZT ZEIT IN SEKUNDEN
                return null;
            }).filter(Boolean).sort((a, b) => a.distance - b.distance); // Sortiert nach Zeit
            console.log(`DEBUG: ${currentAvailableVehicleData.length} Fahrzeuge aktuell zur Auswahl auf der Seite verfügbar (sortiert nach Zeit).`);

            // vehiclesSelectedInCurrentIteration was already reset at the start of the loop.

            // --- Phase 1: Process personnel requirements ---
            console.log("DEBUG: --- Phase 1: Bearbeitung Personal-Anforderungen ---");
            console.log("DEBUG: filteredRequirements vor Phase 1:", JSON.parse(JSON.stringify(filteredRequirements.filter(req => req.category === 'personnel').map(r => ({originalName: r.originalName, count: r.count})))));
            filteredRequirements.filter(req => req.category === 'personnel' && req.count > 0).forEach(req => {
                let neededPersonnelCount = req.count;
                console.log(`DEBUG: Bearbeite Personal-Anforderung: "${req.originalName}", noch benötigt: ${neededPersonnelCount}`);
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
                    if (targetTypeId) { const capacity = candidateVehiclesConfig ? (candidateVehiclesConfig[shortName] || 0) : 0; if (capacity > 0) currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId).forEach(v => personnelCandidates.push({ ...v, providesCapacity: capacity })); }
                }
                personnelCandidates.sort((a,b) => { const aIsDirectReq = filteredRequirements.some(dr => dr.category === 'vehicle' && dr.count > 0 && dr.vehicleTypeIds.includes(a.vehicleTypeId)), bIsDirectReq = filteredRequirements.some(dr => dr.category === 'vehicle' && dr.count > 0 && dr.vehicleTypeIds.includes(b.vehicleTypeId)); if(aIsDirectReq && !bIsDirectReq)return -1; if(!aIsDirectReq && bIsDirectReq)return 1; if(b.providesCapacity !== a.providesCapacity)return b.providesCapacity - a.providesCapacity; return a.distance - b.distance; });
                console.log(`DEBUG: Kandidaten für Personal "${req.specificType}" (nach Priorität sortiert):`, personnelCandidates.map(v => `${v.vehicleLabel} (Kapazität: ${v.providesCapacity}, Direkt-Anforderung: ${filteredRequirements.some(dr => dr.category === 'vehicle' && dr.count > 0 && dr.vehicleTypeIds.includes(v.vehicleTypeId))})`));
                for (const cand of personnelCandidates) { if (neededPersonnelCount <= 0) { console.log(`DEBUG: Personal "${req.specificType}" ist abgedeckt.`); break; } if (addCheckboxToProcessLocal(cand, currentAvailableVehicleData)) { neededPersonnelCount = Math.max(0, neededPersonnelCount - cand.providesCapacity); console.log(`DEBUG: "${cand.vehicleLabel}" ausgewählt. Personal "${req.specificType}" noch benötigt: ${neededPersonnelCount}`); }}
            });

            // --- Phase 2: Process equipment requirements ---
            console.log("DEBUG: --- Phase 2: Bearbeitung Ausrüstungs-Anforderungen ---");
            console.log("DEBUG: filteredRequirements vor Phase 2:", JSON.parse(JSON.stringify(filteredRequirements.filter(req => req.category === 'equipment').map(r => ({originalName: r.originalName, count: r.count})))));
            filteredRequirements.filter(req => req.category === 'equipment' && req.count > 0).forEach(req => {
                let neededEquipmentCount = req.count;
                console.log(`DEBUG: Bearbeite Ausrüstungs-Anforderung: "${req.originalName}", noch benötigt: ${neededEquipmentCount}`);
                let vehicleShortNamesToConsider = [];
                if (req.vehicleTypeIds && req.vehicleTypeIds.length > 0) vehicleShortNamesToConsider = req.vehicleTypeIds.map(id => getVehicleShortNameById(id)).filter(Boolean);
                else if (EQUIPMENT_TO_VEHICLE_MAPPING[req.specificType]) vehicleShortNamesToConsider = EQUIPMENT_TO_VEHICLE_MAPPING[req.specificType];
                const candidatePoolForReq = [];
                for (const shortName of vehicleShortNamesToConsider) { const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[shortName]; if (targetTypeId) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId)); }
                candidatePoolForReq.sort((a,b) => a.distance - b.distance);
                console.log(`DEBUG: Kandidaten für Ausrüstung "${req.specificType}":`, candidatePoolForReq.map(v => v.vehicleLabel));
                for (let i = 0; i < candidatePoolForReq.length && neededEquipmentCount > 0; i++) { if (addCheckboxToProcessLocal(candidatePoolForReq[i], currentAvailableVehicleData)) { neededEquipmentCount--; console.log(`DEBUG: "${candidatePoolForReq[i].vehicleLabel}" ausgewählt. Ausrüstung "${req.specificType}" noch benötigt: ${neededEquipmentCount}`); }}
            });

            // --- Phase 3: Process material requirements ---
             console.log("DEBUG: --- Phase 3: Bearbeitung Material-Anforderungen ---");
             console.log("DEBUG: filteredRequirements vor Phase 3:", JSON.parse(JSON.stringify(filteredRequirements.filter(req => req.category === 'material').map(r => ({originalName: r.originalName, count: r.count})))));
             filteredRequirements.filter(req => req.category === 'material' && req.count > 0).forEach(req => {
                let neededMaterialAmount = req.count;
                console.log(`DEBUG: Bearbeite Material-Anforderung: "${req.originalName}", noch benötigt: ${neededMaterialAmount}`);
                let capacitiesConfig = MATERIAL_CAPACITY_MAPPING[req.specificType], vehicleShortNamesToConsider = [];
                if (req.vehicleTypeIds && req.vehicleTypeIds.length > 0) vehicleShortNamesToConsider = req.vehicleTypeIds.map(id => getVehicleShortNameById(id)).filter(Boolean);
                else if (capacitiesConfig) vehicleShortNamesToConsider = Object.keys(capacitiesConfig);
                const sortedCandidates = vehicleShortNamesToConsider.map(shortName => ({ shortName, capacity: capacitiesConfig ? (capacitiesConfig[shortName] || 0) : 0 })).filter(vc => vc.capacity > 0).sort((a, b) => b.capacity - a.capacity);
                console.log(`DEBUG: Kandidaten für Material "${req.specificType}" (nach Kapazität sortiert):`, sortedCandidates);
                for (const cand of sortedCandidates) { if (neededMaterialAmount <= 0) { console.log(`DEBUG: Material "${req.specificType}" ist abgedeckt.`); break; } const targetTypeId = VEHICLE_ID_BY_SHORT_NAME[cand.shortName]; if (!targetTypeId) continue; const availableOfType = currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId).sort((a,b) => a.distance - b.distance); console.log(`DEBUG: Für "${cand.shortName}" (ID: ${targetTypeId}), verfügbar: ${availableOfType.length} Fahrzeuge.`); let numToSelect = Math.min(availableOfType.length, Math.ceil(neededMaterialAmount / cand.capacity)); console.log(`DEBUG: Versuche ${numToSelect}x "${cand.shortName}" auszuwählen, um ${neededMaterialAmount} Material abzudecken (Kapazität pro Fahrzeug: ${cand.capacity}).`); for (let i = 0; i < numToSelect && neededMaterialAmount > 0; i++) { if (availableOfType[i] && addCheckboxToProcessLocal(availableOfType[i], currentAvailableVehicleData)) { neededMaterialAmount = Math.max(0, neededMaterialAmount - cand.capacity); console.log(`DEBUG: "${availableOfType[i].vehicleLabel}" ausgewählt. Material "${req.specificType}" noch benötigt: ${neededMaterialAmount}`); } else if (!availableOfType[i]) {console.log("DEBUG: Undefined vehicle candidate in material selection, skipping."); break;} }}
            });

            // --- Phase 4: Process direct vehicle requirements (excluding KTW-induced) ---
            console.log("DEBUG: --- Phase 4: Bearbeitung direkter Fahrzeuganforderungen (exkl. KTW-induzierter) ---");
            const sortedVehicleReqs = filteredRequirements.filter(r => r.category === 'vehicle' && r.count > 0 && !r.isKTWInduced).sort((a,b) => { const aDGL = a.vehicleTypeIds.includes(FUSTW_DGL_ID), bDGL = b.vehicleTypeIds.includes(FUSTW_DGL_ID), aGenF = (a.originalName.toLowerCase()==='fustw'||a.originalName.toLowerCase()==='funkstreifenwagen')&&!aDGL, bGenF = (b.originalName.toLowerCase()==='fustw'||b.originalName.toLowerCase()==='funkstreifenwagen')&&!bDGL; if(aDGL&&bGenF)return -1; if(bDGL&&aGenF)return 1; return 0;});
            console.log("DEBUG: sortedVehicleRequirements for Phase 4 (exkl. KTW-induzierter):", JSON.parse(JSON.stringify(sortedVehicleReqs.map(r => ({originalName: r.originalName, count: r.count})))));
            sortedVehicleReqs.forEach(req => {
                let neededVehicleCount = req.count; console.log(`DEBUG: Bearbeite direkte Fahrzeuganforderung (Phase 4): "${req.originalName}", noch benötigt: ${neededVehicleCount}`);
                let candidatePoolForReq = [];
                if (req.originalName === 'ELW 1' || req.originalName.toLowerCase().includes('elw 1')) { console.log(`DEBUG: Priorisiere ELW 2 und ELW2 Drohne für ELW 1 Anforderung.`); const elw1FulfillingIds = req.vehicleTypeIds, prioritizedElwIds = [ELW2_ID, ELW2_DROHNE_ID, AB_EINSATZLEITUNG_ID].filter(id => elw1FulfillingIds.includes(id)), otherElwIds = elw1FulfillingIds.filter(id => !prioritizedElwIds.includes(id)); for(const targetTypeId of prioritizedElwIds) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId)); for(const targetTypeId of otherElwIds) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));}
                else if (req.originalName === 'FuStW' || (req.originalName.toLowerCase().includes('fustw') && !req.originalName.toLowerCase().includes('(dgl)'))) { console.log(`DEBUG: Priorisiere normale FuStW und Zivilstreifenwagen für generische FuStW Anforderung, dann FuStW (DGL) als Fallback.`); const genericFuStWIds = resolveRequirementToVehicleTypeIds('FuStW'), nonDGLFuStWIds = [FUSTW_ID, ZIVILSTREIFENWAGEN_ID].filter(id => genericFuStWIds.includes(id)), DGLFuStWId = FUSTW_DGL_ID; for(const targetTypeId of nonDGLFuStWIds) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId)); if(genericFuStWIds.includes(DGLFuStWId)) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === DGLFuStWId));}
                else { for (const targetTypeId of req.vehicleTypeIds) candidatePoolForReq.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId)); }
                candidatePoolForReq = [...new Map(candidatePoolForReq.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                console.log(`DEBUG: Kandidaten für direkte Anforderung (Phase 4) "${req.originalName}":`, candidatePoolForReq.map(v => `${v.vehicleLabel} (ID: ${v.vehicleTypeId}, Zeit: ${typeof v.distance === 'number' ? v.distance.toFixed(2) : v.distance}s)`));
                for (let i = 0; i < candidatePoolForReq.length && neededVehicleCount > 0; i++) { if (addCheckboxToProcessLocal(candidatePoolForReq[i], currentAvailableVehicleData)) { neededVehicleCount--; console.log(`DEBUG: "${candidatePoolForReq[i].vehicleLabel}" ausgewählt. Direkte Anforderung (Phase 4) "${req.originalName}" noch benötigt: ${neededVehicleCount}`); }}
            });

            // --- Phase 4.5: Process KTW-induced GW-San requirements ---
            console.log("DEBUG: --- Phase 4.5: Bearbeitung KTW-induzierter GW-San Anforderungen ---");
            const ktwInducedGwSanReqs = filteredRequirements.filter(req => req.isKTWInduced && req.category === 'vehicle' && req.count > 0);
            if (ktwInducedGwSanReqs.length > 0) {
                console.log("DEBUG: KTW-induzierte GW-San Anforderungen gefunden:", JSON.parse(JSON.stringify(ktwInducedGwSanReqs.map(r => ({originalName: r.originalName, count: r.count})))));
                ktwInducedGwSanReqs.forEach(gwSanReq => {
                    let neededGwSanCount = gwSanReq.count; console.log(`DEBUG: Bearbeite KTW-induzierte GW-San Anforderung (Phase 4.5): "${gwSanReq.originalName}", noch benötigt: ${neededGwSanCount}`);
                    let candidatePoolForGwSan = []; for (const targetTypeId of gwSanReq.vehicleTypeIds) candidatePoolForGwSan.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));
                    candidatePoolForGwSan = [...new Map(candidatePoolForGwSan.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                    console.log(`DEBUG: Kandidaten für KTW-induzierte GW-San Anforderung (Phase 4.5) "${gwSanReq.originalName}":`, candidatePoolForGwSan.map(v => v.vehicleLabel));
                    for (let i = 0; i < candidatePoolForGwSan.length && neededGwSanCount > 0; i++) { if (addCheckboxToProcessLocal(candidatePoolForGwSan[i], currentAvailableVehicleData)) { neededGwSanCount--; console.log(`DEBUG: "${candidatePoolForGwSan[i].vehicleLabel}" ausgewählt für KTW-induzierte GW-San. Anforderung "${gwSanReq.originalName}" (lokal in Phase 4.5) noch ${neededGwSanCount} benötigt.`); }}
                });
            } else { console.log("DEBUG: Keine aktiven KTW-induzierten GW-San Anforderungen zur Bearbeitung in Phase 4.5."); }

            // --- Phase 5: Process 'OR'-vehicle requirements ---
            console.log("DEBUG: --- Phase 5: Bearbeitung 'ODER'-Fahrzeuganforderungen ---");
            console.log("DEBUG: filteredAlternativeRequirements vor Phase 5:", JSON.parse(JSON.stringify(filteredAlternativeRequirements.map(r => ({originalName: r.originalName, count: r.count})))));
            filteredAlternativeRequirements.filter(req => req.count > 0).forEach(req => {
                console.log(`DEBUG: Bearbeite ODER-Anforderung: "${req.originalName}", noch benötigt: ${req.count}`);
                while(req.count > 0) { let foundForThisUnitInIteration = false; const allAlternativeVehicles = []; for(const alternative of req.alternatives) for(const typeId of alternative.ids) currentAvailableVehicleData.filter(v => v.vehicleTypeId === typeId).forEach(v => allAlternativeVehicles.push({...v, originalAlternativeName: alternative.name}));
                const uniqueAlternativeVehicles = [...new Map(allAlternativeVehicles.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                console.log(`DEBUG: Kandidaten für ODER-Anforderung "${req.originalName}":`, uniqueAlternativeVehicles.map(v => `${v.vehicleLabel} (Alternative: ${v.originalAlternativeName})`));
                if (uniqueAlternativeVehicles.length === 0) { console.log(`DEBUG: Keine verfügbaren Fahrzeuge für ODER-Anforderung "${req.originalName}".`); break; }
                for (const foundVehicle of uniqueAlternativeVehicles) { if (addCheckboxToProcessLocal(foundVehicle, currentAvailableVehicleData)){foundForThisUnitInIteration = true; req.count--; console.log(`DEBUG: "${foundVehicle.vehicleLabel}" ausgewählt. ODER-Anforderung "${req.originalName}" noch benötigt: ${req.count}`); break; }}
                if (!foundForThisUnitInIteration) { console.log(`DEBUG: Konnte keine weitere Einheit für ODER-Anforderung "${req.originalName}" finden.`); break; }}
            });

            // --- Phase 6: Process generic LF requirements ---
            console.log("DEBUG: --- Phase 6: Bearbeitung generischer LF-Anforderungen ---");
            if (filteredGenericLFRequirement) console.log("DEBUG: filteredGenericLFRequirement vor Phase 6:", JSON.parse(JSON.stringify(filteredGenericLFRequirement)));
            if (filteredGenericLFRequirement && filteredGenericLFRequirement.count > 0) {
                let neededLFCount = filteredGenericLFRequirement.count; console.log(`DEBUG: Bearbeite generische LF-Anforderung: "${filteredGenericLFRequirement.originalName}", noch benötigt: ${neededLFCount}`);
                const lfTypeIds = filteredGenericLFRequirement.vehicleTypeIds; let candidatePoolForLF = [];
                for (const targetTypeId of lfTypeIds) candidatePoolForLF.push(...currentAvailableVehicleData.filter(v => v.vehicleTypeId === targetTypeId));
                candidatePoolForLF = [...new Map(candidatePoolForLF.map(item => [item.checkbox, item])).values()].sort((a,b) => a.distance - b.distance);
                console.log(`DEBUG: Kandidaten für generische LF-Anforderung:`, candidatePoolForLF.map(v => v.vehicleLabel));
                for (let i = 0; i < candidatePoolForLF.length && neededLFCount > 0; i++) { if (addCheckboxToProcessLocal(candidatePoolForLF[i], currentAvailableVehicleData)) { neededLFCount--; console.log(`DEBUG: "${candidatePoolForLF[i].vehicleLabel}" ausgewählt. Generische LF-Anforderung noch benötigt: ${neededLFCount}`); }}
            }

            allRequirementsMetInLoop = filteredRequirements.every(req => req.count === 0) && filteredAlternativeRequirements.every(req => req.count === 0) && (!filteredGenericLFRequirement || filteredGenericLFRequirement.count === 0);

            if (allRequirementsMetInLoop) { console.log("DEBUG: Alle Anforderungen scheinen nach dieser Schleife abgedeckt zu sein."); break; }
            reloadAttempts++;
            if (reloadAttempts > MAX_RELOAD_ATTEMPTS) { console.log("DEBUG: Maximale Anzahl an Nachladeversuchen erreicht."); break; }
        }

        // --- Phase 7: Additional alarms (ELW-SEG) (final) ---
        console.log("DEBUG: --- Phase 7: Überprüfe zusätzliche Alarme (ELW-SEG) ---");
        const elwSegTypeId = VEHICLE_ID_BY_SHORT_NAME['ELW 1 (SEG)'];
        if (elwSegTypeId) {
            let rdVehicleSelectedOrStillNeeded = globalCheckboxesToProcess.some(vData => // Check the globally selected unique vehicles
                EMS_VEHICLE_TYPE_IDS.includes(vData.vehicleTypeId) ||
                [VEHICLE_ID_BY_SHORT_NAME['NEF'], VEHICLE_ID_BY_SHORT_NAME['RTH'], VEHICLE_ID_BY_SHORT_NAME['GW-Bergrettung (NEF)'], VEHICLE_ID_BY_SHORT_NAME['RTH Winde']].filter(Boolean).map(String).includes(vData.vehicleTypeId)
            );
            if (!rdVehicleSelectedOrStillNeeded) {
                 rdVehicleSelectedOrStillNeeded = filteredRequirements.some(req => req.count > 0 && ( // Check remaining requirements
                    (req.category === 'vehicle' && req.vehicleTypeIds.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))) ||
                    (req.category === 'personnel' && EMS_PERSONNEL_TYPES.includes(req.specificType)) ||
                    req.isSilentPatientRuleRequirement
                ));
            }
            if (!rdVehicleSelectedOrStillNeeded && filteredAlternativeRequirements.some(req => req.count > 0 && req.alternatives.some(alt => alt.ids.some(id => EMS_VEHICLE_TYPE_IDS.includes(id))))) {
                rdVehicleSelectedOrStillNeeded = true;
            }
            console.log(`DEBUG: RD-Fahrzeug ausgewählt oder noch benötigt (für ELW-SEG Prüfung): ${rdVehicleSelectedOrStillNeeded}`);


            const elwSegIsAlreadyDispatched = (dispatchedVehicles.onScene.get(elwSegTypeId) || 0) > 0 ||
                                              (dispatchedVehicles.ownOnWay.get(elwSegTypeId) || 0) > 0;
            const elwSegIsAlreadyExplicitlyRequired = initialParsedRequirements.some(r => r.vehicleTypeIds && r.vehicleTypeIds.includes(elwSegTypeId) && r.initialCount > 0 && !r.isPatientCountTriggered);
            const elwSegIsAlreadySelected = globalCheckboxesToProcess.some(vData => vData.vehicleTypeId === elwSegTypeId); // Check unique global list
            console.log(`DEBUG: ELW 1 (SEG) bereits alarmiert: ${elwSegIsAlreadyDispatched}, explizit gefordert: ${elwSegIsAlreadyExplicitlyRequired}, bereits ausgewählt: ${elwSegIsAlreadySelected}`);

            if (rdVehicleSelectedOrStillNeeded && !elwSegIsAlreadyDispatched && !elwSegIsAlreadyExplicitlyRequired && !elwSegIsAlreadySelected) {
                const availableElwSeg = currentAvailableVehicleData.find(v => v.vehicleTypeId === elwSegTypeId); // Check from remaining available vehicles
                if (availableElwSeg) {
                    // The original base script directly called addCheckboxToProcessLocal without checking its return for this specific case.
                    // To maintain that behavior, we'll also call it directly. The internal checks in addCheckboxToProcessLocal
                    // will prevent duplicate processing if it was somehow already selected.
                    if(addCheckboxToProcessLocal(availableElwSeg, currentAvailableVehicleData)){
                        console.log(`DEBUG: ELW 1 (SEG): "${availableElwSeg.vehicleLabel}" hinzugefügt, da RD-Fahrzeuge benötigt/ausgewählt sind und ELW-SEG noch nicht vor Ort/ausgewählt war.`);
                    } else {
                         console.log(`DEBUG: ELW 1 (SEG) benötigt, aber "${availableElwSeg.vehicleLabel}" konnte nicht hinzugefügt werden (evtl. bereits global/iterativ selektiert).`);
                    }
                } else {
                    console.log(`DEBUG: ELW 1 (SEG) benötigt, aber kein verfügbares Fahrzeug gefunden.`);
                }
            } else {
                console.log(`DEBUG: ELW 1 (SEG) nicht hinzugefügt, da Bedingungen nicht erfüllt.`);
            }
        }

        if (globalCheckboxesToProcess.length === 0) {
            console.log("DEBUG: Keine Checkboxen zum Aktivieren gefunden.");
            const btn = document.getElementById('autoAlarmButton');
            const emsBtn = document.getElementById('autoAlarmButtonEMS');
            if(btn) { btn.textContent = `Keine Fahrzeuge markiert`; btn.style.backgroundColor = '#f0ad4e'; }
            if(emsBtn) { emsBtn.textContent = `Keine Fahrzeuge markiert`; emsBtn.style.backgroundColor = '#FF0000';}
            return;
        }
        console.log(`DEBUG: Aktiviere ${globalCheckboxesToProcess.length} Checkboxen final...`);
        let finalVehiclesCheckedCount = globalCheckboxesToProcess.length;
        let currentFinalIdx = 0;
        function processFinalCheckboxes() {
            if (currentFinalIdx < globalCheckboxesToProcess.length) {
                const { checkbox, vehicleLabel, vehicleTypeId } = globalCheckboxesToProcess[currentFinalIdx];
                console.log(`DEBUG: Aktiviere Checkbox für Fahrzeug "${vehicleLabel}" (ID: ${vehicleTypeId}).`);
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                currentFinalIdx++;
                setTimeout(processFinalCheckboxes, CHECKBOX_DELAY_MS);
            } else {
                const btn = document.getElementById('autoAlarmButton');
                const emsBtn = document.getElementById('autoAlarmButtonEMS');
                if(btn) { btn.textContent = `Fahrzeuge ausgewählt (${finalVehiclesCheckedCount})`; btn.style.backgroundColor = '#5cb85c';}
                if(emsBtn) { emsBtn.textContent = `Fahrzeuge ausgewählt (${finalVehiclesCheckedCount})`; emsBtn.style.backgroundColor = '#FF0000';} // Keep EMS color
                console.log("DEBUG: Alle global ausgewählten Checkboxen aktiviert.");
            }
        }
        processFinalCheckboxes();
    }

    async function alarmMissingVehiclesManually() {
        console.log("DEBUG: LSS Nachalarmierung: Manuell ausgelöst (ALLE Fahrzeuge).");
        const button = document.getElementById('autoAlarmButton');
        const emsButton = document.getElementById('autoAlarmButtonEMS');
        if (button) {
            button.textContent = 'Verarbeite...';
            button.classList.add('disabled');
            if (emsButton) emsButton.classList.add('disabled');
        }
        try {
            await processAlarmRequirements('all');
        } catch (e) {
            console.error("DEBUG: Fehler während alarmMissingVehiclesManually (ALLE):", e);
            if (button) { button.textContent = 'Fehler!'; button.style.backgroundColor = 'red'; }
        } finally {
            if (button && button.textContent === 'Verarbeite...') { button.textContent = 'Fehlende nachalarmieren'; }
            if (button) button.classList.remove('disabled');
            if (emsButton) emsButton.classList.remove('disabled');
        }
    }

    async function alarmMissingEMSVehiclesManually() {
        console.log("DEBUG: LSS Nachalarmierung: Manuell ausgelöst (NUR Rettungsdienstfahrzeuge).");
        const button = document.getElementById('autoAlarmButtonEMS');
        const allButton = document.getElementById('autoAlarmButton');
        if (button) {
            button.textContent = 'Verarbeite...';
            button.classList.add('disabled');
             if (allButton) allButton.classList.add('disabled');
        }
        try {
            await processAlarmRequirements('ems');
        } catch (e) {
            console.error("DEBUG: Fehler während alarmMissingEMSVehiclesManually (EMS):", e);
            if (button) { button.textContent = 'Fehler!'; /* Keep red color */ }
        } finally {
            if (button && button.textContent === 'Verarbeite...') { button.textContent = 'Rettungsdienst alarmieren'; }
            if (button) button.classList.remove('disabled');
            if (allButton) allButton.classList.remove('disabled');
        }
    }

    function addAlarmButton() {
        if (!isInAlarmWindow()) { setTimeout(addAlarmButton, INITIAL_DELAY_MS * 2); return; }

        const referenceLoadingButton = document.querySelector('a.missing_vehicles_load');
        let targetParentNode;
        let actualReferenceNodeForInsertion;

        if (referenceLoadingButton && referenceLoadingButton.parentNode) {
            targetParentNode = referenceLoadingButton.parentNode;
            actualReferenceNodeForInsertion = referenceLoadingButton;
            console.log("DEBUG: Referenz-Ladebutton gefunden. Buttons werden davor eingefügt.");
        } else {
            const dispatchButtonsDiv = document.getElementById('dispatch_buttons');
            if (dispatchButtonsDiv) {
                targetParentNode = dispatchButtonsDiv;
                actualReferenceNodeForInsertion = null; // Append
                console.log("DEBUG: Dispatch-Buttons-Div gefunden. Buttons werden angehängt.");
            } else {
                console.log("DEBUG: LSS Nachalarmierungs-Skript: Ziel für Buttons nicht gefunden.");
                return;
            }
        }

        if (!document.getElementById('autoAlarmButton')) {
            const newButtonAll = document.createElement('a');
            newButtonAll.id = 'autoAlarmButton';
            newButtonAll.className = 'btn btn-info';
            newButtonAll.textContent = 'Fehlende nachalarmieren';
            newButtonAll.style.marginRight = '5px';
            newButtonAll.style.marginBottom = '5px';
            newButtonAll.style.borderRadius = '5px';
            newButtonAll.addEventListener('click', alarmMissingVehiclesManually);
            targetParentNode.insertBefore(newButtonAll, actualReferenceNodeForInsertion);
            console.log("DEBUG: 'Fehlende nachalarmieren'-Button hinzugefügt.");
        }

        if (!document.getElementById('autoAlarmButtonEMS')) {
            const newButtonEMS = document.createElement('a');
            newButtonEMS.id = 'autoAlarmButtonEMS';
            newButtonEMS.className = 'btn';
            newButtonEMS.textContent = 'Rettungsdienst alarmieren';
            newButtonEMS.style.marginRight = '5px';
            newButtonEMS.style.marginBottom = '5px';
            newButtonEMS.style.backgroundColor = '#FF0000';
            newButtonEMS.style.color = 'white';
            newButtonEMS.style.borderRadius = '5px';
            newButtonEMS.addEventListener('click', alarmMissingEMSVehiclesManually);
            targetParentNode.insertBefore(newButtonEMS, actualReferenceNodeForInsertion);
            console.log("DEBUG: 'Rettungsdienst alarmieren'-Button hinzugefügt.");
        }
    }

    function handleHotkeys(event) {
        const targetTagName = event.target.tagName.toLowerCase();
        if (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable) {
            console.log(`DEBUG: Hotkey-Ereignis ignoriert, da Fokus auf Eingabefeld oder bearbeitbarem Element liegt.`);
            return;
        }
        if (!isInAlarmWindow()) {
            console.log(`DEBUG: Hotkey-Ereignis ignoriert, da nicht im Alarmfenster.`);
            return;
        }

        switch (event.key.toLowerCase()) {
            case HOTKEY_CONFIG.ALARM_MISSING_ALL:
                event.preventDefault();
                const alarmMissingButton = document.getElementById('autoAlarmButton');
                if (alarmMissingButton && !alarmMissingButton.classList.contains('disabled')) {
                    console.log(`DEBUG: Hotkey "${HOTKEY_CONFIG.ALARM_MISSING_ALL}" gedrückt. Klicke auf 'Fehlende nachalarmieren'-Button.`);
                    alarmMissingButton.click();
                } else {
                    console.log(`DEBUG: Hotkey "${HOTKEY_CONFIG.ALARM_MISSING_ALL}" gedrückt, aber Button nicht gefunden oder deaktiviert.`);
                }
                break;
            case HOTKEY_CONFIG.ALARM_MISSING_EMS:
                event.preventDefault();
                const alarmEMSButton = document.getElementById('autoAlarmButtonEMS');
                if (alarmEMSButton && !alarmEMSButton.classList.contains('disabled')) {
                    console.log(`DEBUG: Hotkey "${HOTKEY_CONFIG.ALARM_MISSING_EMS}" gedrückt. Klicke auf 'Rettungsdienst alarmieren'-Button.`);
                    alarmEMSButton.click();
                } else {
                    console.log(`DEBUG: Hotkey "${HOTKEY_CONFIG.ALARM_MISSING_EMS}" gedrückt, aber Button nicht gefunden oder deaktiviert.`);
                }
                break;
            default:
                console.log(`DEBUG: Hotkey "${event.key.toLowerCase()}" gedrückt, aber keine Aktion zugewiesen.`);
                break;
        }
    }

    // Updated initialization log message
    console.log(`LSS Nachalarmierungs-Skript: Initialisierung gestartet (v${GM_info.script.version}). Korrekte Zeitberechnung. Zählfehlerbehebung v2 integriert.`);
    setTimeout(addAlarmButton, INITIAL_DELAY_MS);
    document.addEventListener('keydown', handleHotkeys);

})();