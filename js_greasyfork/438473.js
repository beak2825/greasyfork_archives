// ==UserScript==
// @name         Convert Call of Duty phonetic gun names
// @namespace    https://github.com/jayktaylor
// @version      0.1
// @description  Simple script which tries to replace phonetic gun names in Raven Software blog posts with their actual names.
// @author       Jayden Bailey - github.com/jayktaylor
// @match        https://www.ravensoftware.com/community/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438473/Convert%20Call%20of%20Duty%20phonetic%20gun%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/438473/Convert%20Call%20of%20Duty%20phonetic%20gun%20names.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // Shamelessly taken from SO
    const replaceOnDocument = (pattern, string, {target = document.body} = {}) => {
        [
            target,
            ...target.querySelectorAll("*:not(script):not(noscript):not(style)")
        ].forEach(({childNodes: [...nodes]}) => nodes
                  .filter(({nodeType}) => nodeType === document.TEXT_NODE)
                  .forEach((textNode) => textNode.textContent = textNode.textContent.replace(pattern, string)));
    };

    let mapping = {
        VG: {
            // ARs
            'Assault Rifle Alpha': 'STG44',
            'Assault Rifle Bravo': 'ITRA Burst',
            'Assault Rifle Charlie': 'BAR',
            'Assault Rifle Delta': 'NZ-41',
            'Assault Rifle Echo': 'Volkssturmgewehr',
            'Assault Rifle Foxtrot': 'AS44',
            'Assault Rifle Hotel': 'Automaton',
            'Assault Rifle India': 'Cooper Carbine',
            // SMGs
            'Submachine Gun Alpha': 'M1928',
            'Submachine Gun Bravo': 'Sten',
            'Submachine Gun Charlie': 'MP40',
            'Submachine Gun Delta': 'PPSh-41',
            'Submachine Gun Echo': 'Owen Gun',
            'Submachine Gun Foxtrot': 'Type 100',
            // LMGs
            'Light Machine Gun Alpha': 'MG42',
            'Light Machine Gun Bravo': 'DP27',
            'Light Machine Gun Charlie': 'Bren',
            'Light Machine Gun Delta': 'Type 11',
            // Shotguns
            'Shotgun Alpha': 'Einhorn Revolving',
            'Shotgun Bravo': 'Gracey Auto',
            'Shotgun Charlie': 'Combat Shotgun',
            'Shotgun Delta': 'Double Barrel',
            // Snipers
            'Sniper Rifle Alpha': '3-Line Rifle',
            'Sniper Rifle Bravo': 'Kar98k',
            'Sniper Rifle Charlie': 'Type 99',
            'Sniper Rifle Delta': 'Gorenko Anti-Tank Rifle',
            // Marksman Rifles
            'Marksman Rifle Alpha': 'M1 Garand',
            'Marksman Rifle Bravo': 'SVT-40',
            'Marksman Rifle Charlie': 'G-43',
            // Launchers
            'Launcher Alpha': 'M1 Bazooka',
            'Launcher Bravo': 'Panzerschreck',
            'Launcher Charlie': 'Panzerfaust',
            'Launcher Delta': 'MK11 Launcher',
            // Handguns
            'Handgun Alpha': 'Machine Pistol',
            'Handgun Bravo': 'Ratt',
            'Handgun Charlie': '1911',
            'Handgun Delta': 'Top Break',
            'Handgun Echo': 'Klauser',
            // Melee
            'Melee Weapon Alpha': 'Combat Shield',
            'Melee Weapon Bravo': 'FS Fighting Knife',
            'Melee Weapon Charlie': 'Katana',
            'Melee Weapon Delta': 'Sawtooth',
        },
        BOCW: {
            // ARs
            'Assault Rifle Alpha': 'XM4',
            'Assault Rifle Bravo': 'AK-47',
            'Assault Rifle Charlie': 'Krig 6',
            'Assault Rifle Delta': 'QBZ-83',
            'Assault Rifle Echo': 'FFAR 1',
            'Assault Rifle Foxtrot': 'Groza',
            'Assault Rifle Golf': 'FARA 83',
            'Assault Rifle Hotel': 'C58',
            'Assault Rifle India': 'EM2',
            'Assault Rifle Juliet': 'Grav',
            // SMGs
            'Submachine Gun Alpha': 'MP5',
            'Submachine Gun Bravo': 'Milano 821',
            'Submachine Gun Charlie': 'AK-74u',
            'Submachine Gun Delta': 'KSP 45',
            'Submachine Gun Echo': 'Bullfrog',
            'Submachine Gun Foxtrot': 'MAC-10',
            'Submachine Gun Golf': 'LC10',
            'Submachine Gun Hotel': 'PPSh-41',
            'Submachine Gun India': 'OTs 9',
            'Submachine Gun Juliet': 'TEC-9',
            'Submachine Gun Kilo': 'LAPA',
            // Tactical Rifles
            'Tactical Rifle Alpha': 'Type 63',
            'Tactical Rifle Bravo': 'M16',
            'Tactical Rifle Charlie': 'AUG',
            'Tactical Rifle Delta': 'DMR 14',
            'Tactical Rifle Echo': 'CARV.2',
            // LMGs
            'Light Machine Gun Alpha': 'Stoner 63',
            'Light Machine Gun Bravo': 'RPD',
            'Light Machine Gun Charlie': 'M60',
            'Light Machine Gun Delta': 'MG 82',
            // Shotguns
            'Shotgun Alpha': 'Hauer 77',
            'Shotgun Bravo': 'Gallo SA12',
            'Shotgun Charlie': 'Streetsweeper',
            'Shotgun Delta': '.410 Ironhide',
            // Snipers
            'Sniper Rifle Alpha': 'Pelington 703',
            'Sniper Rifle Bravo': 'LW3 Tundra',
            'Sniper Rifle Charlie': 'M82',
            'Sniper Rifle Delta': 'ZRG 20mm',
            'Sniper Rifle Echo': 'Swiss K31',
            // Marksman Rifles
            'Marksman Rifle Alpha': 'M1 Garand',
            'Marksman Rifle Bravo': 'SVT-40',
            'Marksman Rifle Charlie': 'G-43',
            // Launchers
            'Launcher Alpha': 'Cigma 2',
            'Launcher Bravo': 'RPG-7',
            // Pistols
            'Pistol Alpha': '1911',
            'Pistol Bravo': 'Magnum',
            'Pistol Charlie': 'Diamatti',
            'Pistol Delta': 'AMP63',
            'Pistol Echo': 'Marshal',
            // Melee
            'Melee Weapon Alpha': 'Knife',
            'Melee Weapon Bravo': 'Sledgehammer',
            'Melee Weapon Charlie': 'Wakizashi',
            'Melee Weapon Delta': 'E-Tool',
            'Melee Weapon Echo': 'Machete',
            'Melee Weapon Foxtrot': 'Baseball Bat',
            'Melee Weapon Golf': 'Mace',
            'Melee Weapon Hotel': 'Cane',
            'Melee Weapon India': 'Sai',
            'Melee Weapon Juliet': 'Battle Axe',
            'Melee Weapon Kilo': 'Hammer and Sickle',
            // Specials
            'Special Weapon Alpha': 'M79',
            'Special Weapon Bravo': 'R1 Shadowhunter',
            'Special Weapon Charlie': 'Ballistic Knife',
            'Special Weapon Delta': 'Nail Gun',
        },
        'MW': {
            // ARs
            'Assault Rifle Alpha': 'Kilo 141',
            'Assault Rifle Bravo': 'FAL',
            'Assault Rifle Charlie': 'M4A1',
            'Assault Rifle Delta': 'FR 5.56',
            'Assault Rifle Echo': 'Oden',
            'Assault Rifle Foxtrot': 'M13',
            'Assault Rifle Golf': 'FN Scar 17',
            'Assault Rifle Hotel': 'AK-47',
            'Assault Rifle India': 'RAM-7',
            'Assault Rifle Juliet': 'Grau 5.56',
            'Assault Rifle Kilo': 'CR-56 AMAX',
            'Assault Rifle Lima': 'AN-94',
            'Assault Rifle Mike': 'AS VAL',
            // SMGs
            'Submachine Gun Alpha': 'AUG',
            'Submachine Gun Bravo': 'P90',
            'Submachine Gun Charlie': 'MP5',
            'Submachine Gun Delta': 'Uzi',
            'Submachine Gun Echo': 'PP19 Bizon',
            'Submachine Gun Foxtrot': 'MP7',
            'Submachine Gun Golf': 'Striker 45',
            'Submachine Gun Hotel': 'Fennec',
            'Submachine Gun India': 'ISO',
            'Submachine Gun Juliet': 'CX-9',
            // LMGs
            'Light Machine Gun Alpha': 'PKM',
            'Light Machine Gun Bravo': 'SA87',
            'Light Machine Gun Charlie': 'M91',
            'Light Machine Gun Delta': 'MG34',
            'Light Machine Gun Echo': 'Holger-26',
            'Light Machine Gun Foxtrot': 'Bruen Mk9',
            'Light Machine Gun Golf': 'FiNN LMG',
            'Light Machine Gun Hotel': 'RAAL MG',
            // Shotguns
            'Shotgun Alpha': 'Model 680',
            'Shotgun Bravo': 'R9-0',
            'Shotgun Charlie': '725',
            'Shotgun Delta': 'Origin 12',
            'Shotgun Echo': 'VLK Rogue',
            'Shotgun Foxtrot': 'JAK-12',
            // Snipers
            'Sniper Rifle Alpha': 'Dragunov',
            'Sniper Rifle Bravo': 'HDR',
            'Sniper Rifle Charlie': 'AX-50',
            'Sniper Rifle Delta': 'Rytec AMR',
            // Marksman Rifles
            'Marksman Rifle Alpha': 'EBR-14',
            'Marksman Rifle Bravo': 'MK2 Carbine',
            'Marksman Rifle Charlie': 'Kar98k',
            'Marksman Rifle Delta': 'Crossbow',
            'Marksman Rifle Echo': 'SKS',
            'Marksman Rifle Foxtrot': 'SP-R 208',
            // Launchers
            'Launcher Alpha': 'PILA',
            'Launcher Bravo': 'Strela-P',
            'Launcher Charlie': 'JOKR',
            'Launcher Delta': 'RPG-7',
            // Handguns
            'Handgun Alpha': 'X16',
            'Handgun Bravo': '1911',
            'Handgun Charlie': '.357',
            'Handgun Delta': 'M19',
            'Handgun Echo': '.50 GS',
            'Handgun Foxtrot': 'Renetti',
            'Handgun Golf': 'Sykov',
            // Melee
            'Melee Weapon Alpha \\(Primary\\)': 'Riot Shield',
            'Melee Weapon Alpha \\(Secondary\\)': 'Combat Knife',
            'Melee Weapon Bravo': 'Kali Sticks',
            'Melee Weapon Charlie': 'Dual Kodachis',
        }
    }

    for (let [k, v] of Object.entries(mapping.VG)) {
        let pattern = new RegExp(k + ' \\(VG\\)', 'gi');
        replaceOnDocument(pattern, v + ' (VG)');
    }
    for (let [k, v] of Object.entries(mapping.BOCW)) {
        let pattern = new RegExp(k + ' \\(BOCW\\)', 'gi');
        replaceOnDocument(pattern, v + ' (BOCW)');
    }
    for (let [k, v] of Object.entries(mapping.MW)) {
        let pattern = new RegExp(k + ' \\(MW\\)', 'gi');
        replaceOnDocument(pattern, v + ' (MW)');
    }
})();