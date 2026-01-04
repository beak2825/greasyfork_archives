// ==UserScript==
// @name            Inara - Commodities Search-Presets
// @name:de         Inara - Waren Such-Voreinstellungen
// @namespace    	https://greasyfork.org/users/928242
// @version         1.0.0
// @description     Saving/Loading of search-presets for commodities
// @description:de  Speichern/Laden von Such-Presets für Waren
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL      https://github.com/Kamiikaze/Tampermonkey/issues
// @icon         	https://www.google.com/s2/favicons?sz=64&domain=inara.cz
// @match           https://inara.cz/elite/commodities/*
// @grant           none
// @license      	MIT
// @downloadURL https://update.greasyfork.org/scripts/530950/Inara%20-%20Commodities%20Search-Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/530950/Inara%20-%20Commodities%20Search-Presets.meta.js
// ==/UserScript==

const showPresetDetails = true

// Mapping of all commodities. You can change the displayed values if needed
const fullMapping = {
    "pi1": {
        "label": "Buy/Sell",
        "values": [
            {"value": "1", "text": "Buy"},
            {"value": "2", "text": "Sell"}
        ]
    },
    "pa1": {
        "label": "Commodity",
        "values": [
            {"value": "61", "text": "Advanced Catalysers"},
            {"value": "166", "text": "Advanced Medicines"},
            {"value": "1", "text": "Agri-Medicines"},
            {"value": "10268", "text": "Agronomic Treatment"},
            {"value": "89", "text": "AI Relics"},
            {"value": "10249", "text": "Alexandrite"},
            {"value": "15", "text": "Algae"},
            {"value": "37", "text": "Aluminium"},
            {"value": "121", "text": "Ancient Artefact"},
            {"value": "10240", "text": "Ancient Key"},
            {"value": "16", "text": "Animal Meat"},
            {"value": "62", "text": "Animal Monitors"},
            {"value": "10270", "text": "Anomaly Particles"},
            {"value": "10167", "text": "Antimatter Containment Unit"},
            {"value": "10209", "text": "Antique Jewellery"},
            {"value": "91", "text": "Antiquities"},
            {"value": "63", "text": "Aquaponic Systems"},
            {"value": "182", "text": "Articulation Motors"},
            {"value": "169", "text": "Assault Plans"},
            {"value": "87", "text": "Atmospheric Processors"},
            {"value": "65", "text": "Auto-Fabricators"},
            {"value": "33", "text": "Basic Medicines"},
            {"value": "88", "text": "Battle Weapons"},
            {"value": "51", "text": "Bauxite"},
            {"value": "10", "text": "Beer"},
            {"value": "10247", "text": "Benitoite"},
            {"value": "52", "text": "Bertrandite"},
            {"value": "38", "text": "Beryllium"},
            {"value": "66", "text": "Bioreducing Lichen"},
            {"value": "76", "text": "Biowaste"},
            {"value": "106", "text": "Bismuth"},
            {"value": "122", "text": "Black Box"},
            {"value": "10456", "text": "Bone Fragments"},
            {"value": "95", "text": "Bootleg Liquor"},
            {"value": "148", "text": "Bromellite"},
            {"value": "102", "text": "Building Fabricators"},
            {"value": "10439", "text": "Caustic Tissue Sample"},
            {"value": "100", "text": "Ceramic Composites"},
            {"value": "32", "text": "Chemical Waste"},
            {"value": "7", "text": "Clothing"},
            {"value": "140", "text": "CMM Composite"},
            {"value": "39", "text": "Cobalt"},
            {"value": "17", "text": "Coffee"},
            {"value": "55", "text": "Coltan"},
            {"value": "34", "text": "Combat Stabilisers"},
            {"value": "170", "text": "Commercial Samples"},
            {"value": "67", "text": "Computer Components"},
            {"value": "165", "text": "Conductive Fabrics"},
            {"value": "8", "text": "Consumer Technology"},
            {"value": "40", "text": "Copper"},
            {"value": "10451", "text": "Coral Sap"},
            {"value": "29", "text": "Crop Harvesters"},
            {"value": "110", "text": "Cryolite"},
            {"value": "10459", "text": "Cyst Specimen"},
            {"value": "10215", "text": "Damaged Escape Pod"},
            {"value": "10166", "text": "Data Core"},
            {"value": "171", "text": "Diplomatic Bag"},
            {"value": "9", "text": "Domestic Appliances"},
            {"value": "10210", "text": "Earth Relics"},
            {"value": "158", "text": "Emergency Power Cells"},
            {"value": "172", "text": "Encrypted Correspondence"},
            {"value": "173", "text": "Encrypted Data Storage"},
            {"value": "149", "text": "Energy Grid Assembly"},
            {"value": "99", "text": "Evacuation Shelter"},
            {"value": "159", "text": "Exhaust Manifold"},
            {"value": "123", "text": "Experimental Chemicals"},
            {"value": "3", "text": "Explosives"},
            {"value": "18", "text": "Fish"},
            {"value": "19", "text": "Food Cartridges"},
            {"value": "10221", "text": "Fossil Remnants"},
            {"value": "20", "text": "Fruit and Vegetables"},
            {"value": "56", "text": "Gallite"},
            {"value": "41", "text": "Gallium"},
            {"value": "10211", "text": "Gene Bank"},
            {"value": "103", "text": "Geological Equipment"},
            {"value": "174", "text": "Geological Samples"},
            {"value": "42", "text": "Gold"},
            {"value": "111", "text": "Goslarite"},
            {"value": "21", "text": "Grain"},
            {"value": "10248", "text": "Grandidierite"},
            {"value": "10153", "text": "Guardian Casket"},
            {"value": "10154", "text": "Guardian Orb"},
            {"value": "10155", "text": "Guardian Relic"},
            {"value": "10156", "text": "Guardian Tablet"},
            {"value": "10157", "text": "Guardian Totem"},
            {"value": "10158", "text": "Guardian Urn"},
            {"value": "68", "text": "H.E. Suits"},
            {"value": "10486", "text": "Haematite"},
            {"value": "124", "text": "Hafnium 178"},
            {"value": "155", "text": "Hardware Diagnostic Sensor"},
            {"value": "151", "text": "Heatsink Interlink"},
            {"value": "150", "text": "HN Shock Mount"},
            {"value": "175", "text": "Hostages"},
            {"value": "4", "text": "Hydrogen Fuel"},
            {"value": "138", "text": "Hydrogen Peroxide"},
            {"value": "49", "text": "Imperial Slaves"},
            {"value": "10452", "text": "Impure Spire Mineral"},
            {"value": "57", "text": "Indite"},
            {"value": "43", "text": "Indium"},
            {"value": "141", "text": "Insulating Membrane"},
            {"value": "160", "text": "Ion Distributor"},
            {"value": "168", "text": "Jadeite"},
            {"value": "71", "text": "Land Enrichment Systems"},
            {"value": "118", "text": "Landmines"},
            {"value": "107", "text": "Lanthanum"},
            {"value": "125", "text": "Large Survey Data Cache"},
            {"value": "73", "text": "Leather"},
            {"value": "58", "text": "Lepidolite"},
            {"value": "137", "text": "Liquid oxygen"},
            {"value": "11", "text": "Liquor"},
            {"value": "44", "text": "Lithium"},
            {"value": "147", "text": "Lithium Hydroxide"},
            {"value": "144", "text": "Low Temperature Diamonds"},
            {"value": "152", "text": "Magnetic Emitter Coil"},
            {"value": "86", "text": "Marine Equipment"},
            {"value": "154", "text": "Medical Diagnostic Equipment"},
            {"value": "101", "text": "Meta-Alloys"},
            {"value": "145", "text": "Methane Clathrate"},
            {"value": "146", "text": "Methanol Monohydrate Crystals"},
            {"value": "185", "text": "Micro-weave Cooling Hoses"},
            {"value": "85", "text": "Microbial Furnaces"},
            {"value": "156", "text": "Micro Controllers"},
            {"value": "157", "text": "Military Grade Fabrics"},
            {"value": "126", "text": "Military Intelligence"},
            {"value": "127", "text": "Military Plans"},
            {"value": "31", "text": "Mineral Extractors"},
            {"value": "5", "text": "Mineral Oil"},
            {"value": "181", "text": "Modular Terminals"},
            {"value": "116", "text": "Moissanite"},
            {"value": "10256", "text": "Mollusc Brain Tissue"},
            {"value": "10255", "text": "Mollusc Fluid"},
            {"value": "10252", "text": "Mollusc Membrane"},
            {"value": "10253", "text": "Mollusc Mycelium"},
            {"value": "10254", "text": "Mollusc Soft Tissue"},
            {"value": "10251", "text": "Mollusc Spores"},
            {"value": "10245", "text": "Monazite"},
            {"value": "119", "text": "Muon Imager"},
            {"value": "10246", "text": "Musgravite"},
            {"value": "10219", "text": "Mysterious Idol"},
            {"value": "167", "text": "Nanobreakers"},
            {"value": "12", "text": "Narcotics"},
            {"value": "74", "text": "Natural Fabrics"},
            {"value": "183", "text": "Neofabric Insulation"},
            {"value": "96", "text": "Nerve Agents"},
            {"value": "78", "text": "Non-Lethal Weapons"},
            {"value": "129", "text": "Occupied Escape Pod"},
            {"value": "10435", "text": "Onionhead Gamma Strain"},
            {"value": "10458", "text": "Organ Sample"},
            {"value": "72", "text": "Osmium"},
            {"value": "84", "text": "Painite"},
            {"value": "45", "text": "Palladium"},
            {"value": "35", "text": "Performance Enhancers"},
            {"value": "10159", "text": "Personal Effects"},
            {"value": "79", "text": "Personal Weapons"},
            {"value": "6", "text": "Pesticides"},
            {"value": "10259", "text": "Pod Core Tissue"},
            {"value": "10257", "text": "Pod Dead Tissue"},
            {"value": "10262", "text": "Pod Mesoglea"},
            {"value": "10260", "text": "Pod Outer Tissue"},
            {"value": "10261", "text": "Pod Shell Tissue"},
            {"value": "10258", "text": "Pod Surface Tissue"},
            {"value": "10263", "text": "Pod Tissue"},
            {"value": "177", "text": "Political Prisoners"},
            {"value": "26", "text": "Polymers"},
            {"value": "153", "text": "Power Converter"},
            {"value": "83", "text": "Power Generators"},
            {"value": "161", "text": "Power Transfer Bus"},
            {"value": "143", "text": "Praseodymium"},
            {"value": "10165", "text": "Precious Gems"},
            {"value": "36", "text": "Progenitor Cells"},
            {"value": "10220", "text": "Prohibited Research Materials"},
            {"value": "10449", "text": "Protective Membrane Scrap"},
            {"value": "130", "text": "Prototype Tech"},
            {"value": "112", "text": "Pyrophyllite"},
            {"value": "162", "text": "Radiation Baffle"},
            {"value": "131", "text": "Rare Artwork"},
            {"value": "80", "text": "Reactive Armour"},
            {"value": "132", "text": "Rebel Transmissions"},
            {"value": "163", "text": "Reinforced Mounting Plate"},
            {"value": "69", "text": "Resonating Separators"},
            {"value": "10243", "text": "Rhodplumsite"},
            {"value": "70", "text": "Robotics"},
            {"value": "10264", "text": "Rockforth Fertiliser"},
            {"value": "59", "text": "Rutile"},
            {"value": "142", "text": "Samarium"},
            {"value": "90", "text": "SAP 8 Core Container"},
            {"value": "178", "text": "Scientific Research"},
            {"value": "179", "text": "Scientific Samples"},
            {"value": "77", "text": "Scrap"},
            {"value": "10453", "text": "Semi-Refined Spire Mineral"},
            {"value": "28", "text": "Semiconductors"},
            {"value": "10244", "text": "Serendibite"},
            {"value": "46", "text": "Silver"},
            {"value": "104", "text": "Skimmer Components"},
            {"value": "53", "text": "Slaves"},
            {"value": "10208", "text": "Small Survey Data Cache"},
            {"value": "10164", "text": "Space Pioneer Relics"},
            {"value": "10487", "text": "Steel"},
            {"value": "117", "text": "Structural Regulators"},
            {"value": "27", "text": "Superconductors"},
            {"value": "97", "text": "Surface Stabilisers"},
            {"value": "164", "text": "Survival Equipment"},
            {"value": "75", "text": "Synthetic Fabrics"},
            {"value": "23", "text": "Synthetic Meat"},
            {"value": "98", "text": "Synthetic Reagents"},
            {"value": "120", "text": "Taaffeite"},
            {"value": "180", "text": "Tactical Data"},
            {"value": "47", "text": "Tantalum"},
            {"value": "22", "text": "Tea"},
            {"value": "133", "text": "Technical Blueprints"},
            {"value": "184", "text": "Telemetry Suite"},
            {"value": "108", "text": "Thallium"},
            {"value": "10236", "text": "Thargoid Basilisk Tissue Sample"},
            {"value": "10450", "text": "Thargoid Bio-storage Capsule"},
            {"value": "10160", "text": "Thargoid Biological Matter"},
            {"value": "10234", "text": "Thargoid Cyclops Tissue Sample"},
            {"value": "10441", "text": "Thargoid Glaive Tissue Sample"},
            {"value": "10235", "text": "Thargoid Heart"},
            {"value": "10239", "text": "Thargoid Hydra Tissue Sample"},
            {"value": "10161", "text": "Thargoid Link"},
            {"value": "10237", "text": "Thargoid Medusa Tissue Sample"},
            {"value": "10438", "text": "Thargoid Orthrus Tissue Sample"},
            {"value": "186", "text": "Thargoid Probe"},
            {"value": "10162", "text": "Thargoid Resin"},
            {"value": "10238", "text": "Thargoid Scout Tissue Sample"},
            {"value": "10448", "text": "Thargoid Scythe Tissue Sample"},
            {"value": "10226", "text": "Thargoid Sensor"},
            {"value": "10163", "text": "Thargoid Technology Samples"},
            {"value": "105", "text": "Thermal Cooling Units"},
            {"value": "109", "text": "Thorium"},
            {"value": "10212", "text": "Time Capsule"},
            {"value": "10442", "text": "Titan Deep Tissue Sample"},
            {"value": "10457", "text": "Titan Drive Component"},
            {"value": "48", "text": "Titanium"},
            {"value": "10445", "text": "Titan Maw Deep Tissue Sample"},
            {"value": "10446", "text": "Titan Maw Partial Tissue Sample"},
            {"value": "10447", "text": "Titan Maw Tissue Sample"},
            {"value": "10444", "text": "Titan Partial Tissue Sample"},
            {"value": "10443", "text": "Titan Tissue Sample"},
            {"value": "13", "text": "Tobacco"},
            {"value": "54", "text": "Toxic Waste"},
            {"value": "134", "text": "Trade Data"},
            {"value": "135", "text": "Trinkets of Hidden Fortune"},
            {"value": "10269", "text": "Tritium"},
            {"value": "10437", "text": "Unclassified Relic"},
            {"value": "10440", "text": "Unoccupied Escape Pod"},
            {"value": "176", "text": "Unstable Data Core"},
            {"value": "60", "text": "Uraninite"},
            {"value": "50", "text": "Uranium"},
            {"value": "10250", "text": "Void Opal"},
            {"value": "139", "text": "Water"},
            {"value": "82", "text": "Water Purifiers"},
            {"value": "14", "text": "Wine"},
            {"value": "10207", "text": "Wreckage Components"},
            {"value": "81", "text": "Platinum"}
        ]
    },
    "ps1": {"label": "Near"},
    "pi10": {
        "label": "Order",
        "values": [
            {"value": "1", "text": "Best price"},
            {"value": "2", "text": "Best supply/demand"},
            {"value": "4", "text": "Last update"},
            {"value": "3", "text": "Distance"}
        ]
    },
    "pi11": {
        "label": "Max. System dist.",
        "values": [
            {"value": "0", "text": "Any"},
            {"value": "50", "text": "~ 50 Ly"},
            {"value": "100", "text": "~ 100 Ly"},
            {"value": "250", "text": "~ 250 Ly"},
            {"value": "500", "text": "~ 500 Ly"},
            {"value": "1000", "text": "~ 1k Ly"},
            {"value": "5000", "text": "~ 5k Ly"}
        ]
    },
    "pi3": {
        "label": "Landing pad",
        "values": [
            {"value": "1", "text": "S"},
            {"value": "2", "text": "M"},
            {"value": "3", "text": "L"}
        ]
    },
    "pi9": {
        "label": "Max. Station dist.",
        "values": [
            {"value": "0", "text": "Any"},
            {"value": "100", "text": "100 Ls"},
            {"value": "500", "text": "500 Ls"},
            {"value": "1000", "text": "1k Ls"},
            {"value": "2000", "text": "2k Ls"},
            {"value": "5000", "text": "5k Ls"},
            {"value": "10000", "text": "10k Ls"},
            {"value": "15000", "text": "15k Ls"},
            {"value": "20000", "text": "20k Ls"},
            {"value": "25000", "text": "25k Ls"},
            {"value": "50000", "text": "50k Ls"},
            {"value": "100000", "text": "100k Ls"}
        ]
    },
    "pi4": {
        "label": "Surface",
        "values": [
            {"value": "2", "text": "Yes"},
            {"value": "1", "text": "No"},
            {"value": "0", "text": "Yes (Ody)"}
        ]
    },
    "pi14": {
        "label": "Power",
        "values": [
            {"value": "-1", "text": "None"},
            {"value": "0", "text": "Any"},
            {"value": "1", "text": "Denton Patreus"},
            {"value": "2", "text": "Aisling Duval"},
            {"value": "3", "text": "Edmund Mahon"},
            {"value": "4", "text": "Arissa Lavigny-Duval"},
            {"value": "5", "text": "Felicia Winters"},
            {"value": "7", "text": "Li Yong-Rui"},
            {"value": "8", "text": "Zemina Torval"},
            {"value": "9", "text": "Pranav Antal"},
            {"value": "10", "text": "Archon Delaine"},
            {"value": "11", "text": "Yuri Grom"},
            {"value": "12", "text": "Jerome Archer"},
            {"value": "13", "text": "Nakato Kaine"}
        ]
    },
    "pi5": {
        "label": "Price age",
        "values": [
            {"value": "0", "text": "Any"},
            {"value": "1", "text": "1 h"},
            {"value": "8", "text": "8 h"},
            {"value": "16", "text": "16 h"},
            {"value": "24", "text": "1 d"},
            {"value": "48", "text": "2 d"},
            {"value": "72", "text": "3 d"},
            {"value": "168", "text": "7 d"},
            {"value": "336", "text": "14 d"},
            {"value": "720", "text": "30 d"},
            {"value": "4320", "text": "180 d"}
        ]
    },
    "pi12": {
        "label": "Price condition",
        "values": [
            {"value": "-1", "text": "Only anarchy black markets"},
            {"value": "0", "text": "No"},
            {"value": "5", "text": "± 5%"},
            {"value": "10", "text": "± 10%"},
            {"value": "25", "text": "± 25%"},
            {"value": "50", "text": "± 50%"}
        ]
    },
    "pi7": {
        "label": "Min. supply/demand",
        "values": [
            {"value": "0", "text": "Any"},
            {"value": "100", "text": "100"},
            {"value": "500", "text": "500"},
            {"value": "1000", "text": "1k"},
            {"value": "2500", "text": "2,5k"},
            {"value": "5000", "text": "5k"},
            {"value": "10000", "text": "10k"},
            {"value": "50000", "text": "50k"}
        ]
    },
    "pi8": {
        "label": "Fleet Carriers",
        "values": [
            {"value": "0", "text": "Yes"},
            {"value": "1", "text": "No"},
            {"value": "2", "text": "Yes (updated)"}
        ]
    },
    "pi13": {
        "label": "Stronghold Carriers",
        "values": [
            {"value": "0", "text": "Yes"},
            {"value": "1", "text": "No"},
            {"value": "2", "text": "Yes (Power)"}
        ]
    }
};

// Template of the preset details.
/* It supports "discord-like"-formatting for bold, italic, underlined and strikethrough.
** Following fields are available:
	Commodity: {pa1}
	Near star system: {ps1}
	Order by: {pi10}
	Max. star system distance: {pi11}
	Buy/Sell: {pi1}
	Min. landing pad: {pi3}
	Max. station distance: {pi9}
	Use surface stations: {pi4}
	Power: {pi14}
	Max. price age: {pi5}
	Price condition: {pi12}
	Min. supply/demand: {pi7}
	Include fleet carriers: {pi8}
	Include Stronghold carriers: {pi13}`
**/
const DETAILS_TEMPLATE =
`**{pi1}:** {pa1}

**__Near: {ps1}__**
**Pad:** {pi3} | **Surface:** {pi4} | **Price Age:** {pi5}
**Min. Supply/Demand:** {pi7}

**Max. Distance** - **Star:** {pi11} | **Station:** {pi9}
**FC:** {pi8} | **SC:** {pi13}

**Power:** {pi14}
`;



/*** DO NOT CHANGE BELOW ***/



(function() {
    'use strict';

    const STORAGE_KEY = 'inara_search_presets';

    let editMode = false

    // Übersetzt den Parameterwert anhand des Mappings
    function translateParamValues(pKey, pValue) {
        if (fullMapping[pKey] && fullMapping[pKey].values) {
            const found = fullMapping[pKey].values.find(entry => entry.value === pValue);
            if (found) {
                return found.text
            } else {
                console.log("No mapping found", pKey, pValue)
            }
        }
        return pValue;
    }

    // Modified: getTranslatedParams – für den Parameter "pi1" wird nur der rohe Wert übernommen.
    function getTranslatedParams(paramsStr) {
        const searchParams = new URLSearchParams(paramsStr);
        const obj = {};
        for (let [key, value] of searchParams.entries()) {
            const cleanKey = key.replace(/\[\]$/, '');
            const displayValue = translateParamValues(cleanKey, value)

            if (cleanKey === "pa1") {
                // Mehrfach vorkommende Werte als Array speichern
                if (!obj[cleanKey]) {
                    obj[cleanKey] = displayValue;
                } else {
                    obj[cleanKey] += `, ${displayValue}`;
                }
            } else {
                obj[cleanKey] = displayValue;
            }
        }
        return obj;
    }

    function applyFormatting(text) {
        // Reihenfolge ist wichtig: zuerst kombinierte Formatierungen, dann einzelne
        const rules = [
            { regex: /__\*\*\*(.*?)\*\*\*__/g, replacement: '<u><strong><em>$1</em></strong></u>' },
            { regex: /__\*\*(.*?)\*\*__/g, replacement: '<u><strong>$1</strong></u>' },
            { regex: /__\*(.*?)\*__/g, replacement: '<u><em>$1</em></u>' },
            { regex: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
            { regex: /~~(.*?)~~/g, replacement: '<del>$1</del>' },
            { regex: /__(.*?)__/g, replacement: '<u>$1</u>' },
            { regex: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { regex: /\*(.*?)\*/g, replacement: '<em>$1</em>' }
        ];

        return rules.reduce((acc, rule) => acc.replace(rule.regex, rule.replacement), text);
    }

    // Ersetzt Platzhalter im Template durch die entsprechenden Werte aus obj
    function applyTemplate(template, obj) {
        return template.replace(/{([^}]+)}/g, (match, key) => obj[key] || "");
    }

    function getTemplate(paramsStr) {
        // Process params
        let template = convertParams(paramsStr)
        // Process formatting
        template = applyFormatting(template)

        return template
    }

    // Wandelt URL-Parameter in ein lesbares Format um – nutzt das definierte Template
    function convertParams(paramsStr) {
        const translatedParams = getTranslatedParams(paramsStr);
        return applyTemplate(DETAILS_TEMPLATE, translatedParams);
    }

    // Lade vorhandene Presets aus localStorage
    function loadPresets() {
        const data = localStorage.getItem(STORAGE_KEY);
        console.debug("Loaded presets:", JSON.parse(data))
        return data ? JSON.parse(data) : [];
    }

    // Speichere Presets in localStorage
    function savePresets(presets) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
        console.debug("Saved presets:", presets)
    }

    // Toggling editing mode
    function toggleEditMode() {
        editMode = !editMode

        const editables = document.querySelectorAll(".edit-only")
        for ( let i = 0; i < editables.length; i++ ) {
            editables[i].style.display = editMode ? "block" : "none";
        }
    }

    // Rendere die Liste der Presets in einem Container
    function renderPresetList() {
        const maincontent = document.querySelector('.maincontent.block0');
        const form = maincontent.querySelector(".mainblockaction");
        let container = document.getElementById('preset-container');

        if (!container) {
            container = document.createElement('div');
            container.id = 'preset-container';
            container.style.background = '#2a2a2a';
            container.style.padding = '10px';
            container.style.fontSize = '14px';
            container.style.lineHeight = '1.4';
            container.style.borderRadius = '4px';
            container.style.marginTop = '10px';
            // Füge den Container vor dem Formular ein
            maincontent.insertBefore(container, form);
        }

        // Container leeren und Header hinzufügen
        container.innerHTML = '';
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '10px';

        const title = document.createElement('h3');
        title.textContent = 'Search Presets';
        headerDiv.appendChild(title);

        // Container für die Buttons (erste Zeile)
        const presetCRUDrow = document.createElement('div');
        presetCRUDrow.style.display = 'flex';
        presetCRUDrow.style.gap = '5px';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.fontSize = '12px';
        editBtn.style.width = '70px';
        editBtn.style.background = "#4d5d66";
        editBtn.addEventListener('click', toggleEditMode);
        presetCRUDrow.appendChild(editBtn);

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Preset';
        saveBtn.style.fontSize = '12px';
        saveBtn.stylewidth = '200px';
        saveBtn.addEventListener('click', addPreset);
        presetCRUDrow.appendChild(saveBtn);

        headerDiv.appendChild(presetCRUDrow);
        container.appendChild(headerDiv);

        // Add horizontal divider
        const line = document.createElement("hr")
        container.appendChild(line);

        // Container für die Presets als Flexbox
        const listDiv = document.createElement('div');
        listDiv.style.display = 'flex';
        listDiv.style.flexWrap = 'wrap';
        listDiv.style.justifyContent = 'space-evenly';
        listDiv.style.gap = '5px';
        listDiv.style.maxHeight = '230px';
        listDiv.style.overflowY = 'auto';
        container.appendChild(listDiv);

        const presets = loadPresets();
        if (presets.length === 0) {
            const noPreset = document.createElement('em');
            noPreset.textContent = 'No presets found';
            listDiv.appendChild(noPreset);
        } else {
            presets.forEach((preset, index) => {
                const presetDiv = document.createElement('div');
                // Preset-Div als Spalte, damit Details darunter angezeigt werden
                presetDiv.style.display = 'flex';
                presetDiv.style.flexDirection = 'column';
                presetDiv.style.background = '#353331';
                presetDiv.style.borderRadius = '4px';
                presetDiv.style.padding = '3px 5px';
                presetDiv.style.minWidth = '150px';
                presetDiv.style.maxWidth = '250px';
                presetDiv.style.width = '33%';

                // Container für die Buttons (erste Zeile)
                const buttonRow = document.createElement('div');
                buttonRow.style.display = 'flex';
                buttonRow.style.alignItems = 'center';

                const indexInput = document.createElement('input');
                indexInput.type = "number"
                indexInput.value = index
                indexInput.style.width = "25px";
                indexInput.style.padding = "0";
                indexInput.style.margin = "0 3px 0 0";
                indexInput.style.background = "none";
                indexInput.style.color = "#fff";
                indexInput.style.textAlign = "center";
                indexInput.style.outline = "none";
                indexInput.style.textDecoration = "underline";
                indexInput.classList.add("edit-only");
                indexInput.style.display = "none"
                buttonRow.appendChild(indexInput);

                const loadBtn = document.createElement('button');
                loadBtn.textContent = preset.name;
                loadBtn.style.fontSize = '12px';
                loadBtn.style.lineHeight = '15px';
                loadBtn.addEventListener('click', () => {
                    window.location.search = preset.params;
                });
                buttonRow.appendChild(loadBtn);

                const delBtn = document.createElement('button');
                delBtn.textContent = '✕';
                delBtn.style.fontSize = '10px';
                delBtn.style.padding = '2px 5px';
                delBtn.style.maxWidth = '25px';
                delBtn.style.marginLeft = '3px';
                delBtn.classList.add("edit-only");
                delBtn.style.display = "none"
                delBtn.addEventListener('click', () => {
                    if (confirm(`Delete Preset: "${preset.name}" ?`)) {
                        presets.splice(index, 1);
                        savePresets(presets);
                        renderPresetList();
                    }
                });
                buttonRow.appendChild(delBtn);

                presetDiv.appendChild(buttonRow);

                // Details-Div (zweite Zeile) mit dem benutzerdefinierten Template
                if (showPresetDetails) {
                    const detailsDiv = document.createElement('div');
                    detailsDiv.style.fontSize = '12px';
                    detailsDiv.style.marginTop = '5px';
                    detailsDiv.style.whiteSpace = 'pre-wrap';
                    detailsDiv.style.wordBreak = 'break-all';
                    detailsDiv.innerHTML = getTemplate(preset.params);
                    presetDiv.appendChild(detailsDiv);
                }

                listDiv.appendChild(presetDiv);
            });
        }
    }

    // Funktion, um ein neues Preset zu speichern
    function addPreset() {
        const presetName = prompt('Name of this preset:');
        if (!presetName) return;
        const currentParams = window.location.search;
        const presets = loadPresets();
        presets.push({
            name: presetName,
            params: currentParams
        });
        savePresets(presets);
        renderPresetList();
    }

    // Initialisierung
    function init() {
        renderPresetList();
    }

    window.addEventListener('load', init);
})();
