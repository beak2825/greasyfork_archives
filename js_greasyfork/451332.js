// ==UserScript==
// @name         GatheRaid for KOTD
// @namespace    http://reddit.com/u/slampisko
// @version      1.1.2
// @description  Simplify the process of gathering people for a raid!
// @author       /u/slampisko
// @license      GNU GPLv3
// @match        https://*.reddit.com/r/kickopenthedoor/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/451332/GatheRaid%20for%20KOTD.user.js
// @updateURL https://update.greasyfork.org/scripts/451332/GatheRaid%20for%20KOTD.meta.js
// ==/UserScript==

// Default configuration definition
let default_config = `
{
    "templates": {
        "doc_1": "Available placeholders for templates.main_template:",
        "doc_2": "<notify>            The text @Notify and a postfix as defined in settings.notify_types",
        "doc_3": "<boss_hp>           The current HP of the boss taken from the post flair",
        "doc_4": "<wk_symbols>        A series of symbols corresponding to the elements passed as input.",
        "doc_5": "                    Symbols can be set up in settings.elements",
        "doc_6": "<wk_lines>          A line for each weakness as defined in templates.weakness_line_template",
        "doc_7": "<post_link>         A reddit post link to the boss",
        "doc_8": "<post_shortlink>    A reddit post shortlink to the boss",
        "main_template": "Templates not defined. Edit the JSON in the Config section to define them, or paste a definition someone else has made.",
        "doc_9": "Available placeholders for templates.weakness_line_template:",
        "doc_10": "<wkl_symbol>    The symbol corresponding to the current element",
        "doc_11": "<wkl_name>      The name of the current element",
        "doc_12": "<wkl_tiers>     A series of weapon tiers for the current element, as defined in templates.weakness_tier_template",
        "weakness_lines_template": "<wkl_symbol>: <wkl_tiers>\\n",
        "doc_13": "Available placeholders for templates.weakness_line_template:",
        "doc_14": "<wkt_symbol>    The symbol corresponding to the current weapon tier",
        "doc_15": "<wkt_weapons>   A comma-separated list of weapons included in the current weapon tier,",
        "doc_16": "                including their damage in brackets",
        "weakness_tier_template": "<wkt_symbol> <wkt_weapons>"
    },
    "settings": {
        "doc_1": "Set up the element dictionary. Most useful when listed from best to worst.",
        "doc_2": "Supported properties:",
        "doc_3": "key         An arbitrary (but unique) number",
        "doc_4": "name        Name of the element",
        "doc_5": "shorthand   The shorthand by which the element will be distinguished from the element input",
        "doc_6": "symbol      The textual symbol by which the element will be represented in the templates.",
        "doc_7": "            Pro tip: Can be a Discord emoji",
        "elements": {
            "1": { "name": "Order", "shorthand": "O", "symbol": "O" },
            "2": { "name": "Light", "shorthand": "Li", "symbol": "Li" },
            "3": { "name": "Lawful", "shorthand": "La", "symbol": "La" },
            "4": { "name": "Sinful", "shorthand": "S", "symbol": "S" },
            "5": { "name": "Almighty", "shorthand": "A", "symbol": "A" },
            "6": { "name": "Havoc", "shorthand": "H", "symbol": "H" },
            "7": { "name": "Bless", "shorthand": "B", "symbol": "B" },
            "8": { "name": "Chaos", "shorthand": "Ch", "symbol": "Ch" },
            "9": { "name": "Curse", "shorthand": "Cu", "symbol": "Cu" },
            "10": { "name": "Dark", "shorthand": "D", "symbol": "D" }
        },
        "doc_8": "Set up the weapons. Most useful when listed from best to worst.",
        "doc_9": "Supported properties:",
        "doc_10": "id          ID of the weapon",
        "doc_11": "damage      Damage of the weapon",
        "doc_12": "element     Element id as set up in settings.elements",
        "weapons": [
            { "id": 1094, "damage": 16, "element": 8},
            { "id": 5103, "damage": 14, "element": 1},
            { "id": 1082, "damage": 13, "element": 2},
            { "id": 1084, "damage": 12, "element": 3},
            { "id": 1086, "damage": 12, "element": 4},
            { "id": 4024, "damage": 12, "element": 5},
            { "id": 4025, "damage": 11, "element": 1},
            { "id": 32, "damage": 10, "element": 5},
            { "id": 1067, "damage": 10, "element": 1},
            { "id": 1068, "damage": 10, "element": 6},
            { "id": 1069, "damage": 10, "element": 7},
            { "id": 1070, "damage": 10, "element": 2},
            { "id": 1079, "damage": 10, "element": 8},
            { "id": 1080, "damage": 10, "element": 2},
            { "id": 1081, "damage": 10, "element": 7},
            { "id": 4026, "damage": 10, "element": 8},
            { "id": 5101, "damage": 10, "element": 6},
            { "id": 30, "damage": 9, "element": 3},
            { "id": 31, "damage": 9, "element": 6},
            { "id": 1087, "damage": 9, "element": 9},
            { "id": 4027, "damage": 9, "element": 2},
            { "id": 5102, "damage": 9, "element": 1},
            { "id": 1078, "damage": 8, "element": 10},
            { "id": 5100, "damage": 8, "element": 8},
            { "id": 25, "damage": 7, "element": 1},
            { "id": 26, "damage": 7, "element": 10},
            { "id": 28, "damage": 7, "element": 2},
            { "id": 5099, "damage": 7, "element": 7},
            { "id": 21, "damage": 6, "element": 7},
            { "id": 22, "damage": 6, "element": 9},
            { "id": 23, "damage": 6, "element": 8},
            { "id": 24, "damage": 6, "element": 4}
        ],
        "doc_13": "Set up weapon tiers. Most useful when listed from best to worst.",
        "doc_14": "The default settings will probably work fine for you.",
        "doc_15": "Supported properties:",
        "doc_16": "damage_min  Minimum damage for the weapon tier, the from",
        "doc_17": "damage_max  Maxixum damage for the weapon tier, the to",
        "doc_18": "symbol      The textual symbol by which the weapon tier will be represented in the templates",
        "weap_tiers": [
            { "damage_min": 0, "damage_max": 100, "symbol": "" }
        ],
        "doc_19": "Set up Notify types. If a boss's HP does not fall between a min and max",
        "doc_20": "of any Notify type, the Notify will not appear.",
        "doc_21": "hp_min      Minimum HP for which the notify type applies",
        "doc_22": "hp_max      Maxixum damage for which the notify type applies",
        "doc_23": "postfifx    The postfix to add to this notify type",
        "notify_types": [
            { "hp_min": 0, "hp_max": 299, "postfix": " " }
        ]
    }
}`;

// Style definitions
let styles = `
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 60%; /* Could be more or less, depending on screen size */
  animation-name: animatetop;
  animation-duration: 0.4s
}

.modal-content .markdownEditor-wrapper {
  display: none;
}

.modal-content .heading {
  color: black;
  font-size: 24px;
  font-weight: bold;
}

/* The Buttons */
.gatheraid_icon {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.gatheraid_icon:hover,
.gatheraid_icon:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.gatheraid-tools {
  float: left;
  display: block;
}

#gatheraid-output-textarea, #gatheraid-input-textarea, #gatheraid-config-textarea {
  background-color: #fff !important;
  color: #000 !important;
  font-family: monospace;
  width: 100%;
  display: block;
  clear: both;
}

/* Add Animation */
@keyframes animatetop {
  from {top: -300px; opacity: 0}
  to {top: 0; opacity: 1}
}
`;

//HTML definitions
let content = `
<!-- Modal content -->
<div class="modal-content">
<span title="Close GatheRaid" class="gatheraid_icon close">&times;</span>
<span title="Configuration" class="gatheraid_icon config">&#9881;&#65039;</span>
<span title="Exit Configuration" class="gatheraid_icon back">&#128281;</span>
<form>
  <div id="gatheraid-main">
    <span class="heading">GatheRaid</span> by /u/slampisko
    <hr>
    <textarea id="gatheraid-input-textarea" rows="1" cols="32" name="text" placeholder="Enter weakness shorthands"></textarea>
    <textarea id="gatheraid-output-textarea" rows="5" cols="100" name="text" placeholder="GatheRaid output goes here"></textarea>
  </div>
  <div id="gatheraid-config">
    <span class="heading">Configuration</span>
    <span class="label">Recommended to copy this out into a JSON editor and beautify before attempting to edit.</span>
    <hr>
    <div class="gatheraid-tools">
      <span title="Save Configuration" class="gatheraid_icon tool save" style="display: none;">&#128190;</span>
      <span title="Restore Default" class="gatheraid_icon tool restore">&#128686;</span>
    </div>
    <textarea id="gatheraid-config-textarea" rows="24" cols="100" name="text" placeholder="GatheRaid configuration goes here"></textarea>
  </div>
</form>
</div>`;

(function() {
    'use strict';

    let initialized = false, myModal, config, configuring;
    let gatheraid_main, gatheraid_config, config_icon, back_icon, save_icon;
    let outputArea, inputArea, settingsArea;
    let templateToOutputConverter;
    let boss_hp, post_id;

    document.addEventListener("keyup", function (e) {
        if (e.altKey) {
            if (e.key == 'g') {
                if (!initialized) init();
                myModal.style.display = "block";
                inputArea.focus();
            }
        } else {
            if (e.key == 'Escape') {
                closeModal();
            }
        }
    });

    function closeModal() {
        myModal.style.display = "none";
    }

    function selectAllInOutputArea() {
        outputArea.select();
    }

    function toggleConfig() {
        setConfiguring(!configuring);
    }

    function showSaveIcon(show = true) {
        save_icon.style.display = show ? "block" : "none";
    }

    function setConfiguring(newValue) {
        configuring = newValue;
        gatheraid_config.style.display = configuring ? "block" : "none";
        back_icon.style.display = configuring ? "block" : "none";

        gatheraid_main.style.display = configuring ? "none" : "block";
        config_icon.style.display = configuring ? "none" : "block";
    }

    function saveConfig() {
        try {
            saveConfiguration(settingsArea.value);
            alert("Configuration saved. Reload page to see effect");
            showSaveIcon(false);
        } catch (e) {
            alert(`There was an error parsing your JSON:\n${e.toString()}`);
        }
    }

    function restoreConfig() {
        settingsArea.value = default_config;
        showSaveIcon();
    }

    function updateOutputArea() {
        const elemKeys = Object.keys(config.settings.elements);
        let weaknesses = [];
        for (const elemKey of elemKeys) {
            const element = config.settings.elements[elemKey];
            if (inputArea.value.includes(element.shorthand)) {
                weaknesses.push(elemKey);
            }
        }

        outputArea.value = templateToOutputConverter.getOutput({
            weaknesses: weaknesses,
            boss_hp: boss_hp,
            post_id: post_id
        });
    }

    function init() {
        let post_id_match = window.location.href.match(/(?:.*?)reddit\.com\/r\/kickopenthedoor\/comments\/([a-z0-9]+)\//);
        if (post_id_match.length > 1) {
            post_id = post_id_match[1];
        } else {
            alert(`GatheRaid was unable to determine the post ID. \
                This is a fatal error. Searched in:\n${window.location.href}`);
        }

        let flair = determinePostFlair();
        boss_hp = flair.replace(/Boss \[Health: (\d+)\]/, "$1");

        let configJson = loadConfiguration();
        config = JSON.parse(configJson);
        addStyles();
        initModal();
        initButtons();
        outputArea = myModal.querySelector("#gatheraid-output-textarea");
        inputArea = myModal.querySelector("#gatheraid-input-textarea");
        settingsArea = myModal.querySelector("#gatheraid-config-textarea");
        settingsArea.value = configJson;
        settingsArea.addEventListener("input", showSaveIcon);
        gatheraid_main = myModal.querySelector("#gatheraid-main");
        gatheraid_config = myModal.querySelector("#gatheraid-config");
        setConfiguring(false);

        inputArea.addEventListener("input", updateOutputArea);
        outputArea.addEventListener("focus", selectAllInOutputArea);
        
        templateToOutputConverter = new TemplateToOutputConverter(config);
        updateOutputArea();

        initialized = true;
    }

    function addStyles() {
        let styleSheet = document.createElement("style");
        styleSheet.innerHTML = styles;
        document.head.appendChild(styleSheet);
    }

    function initModal() {
        myModal = document.createElement("div");
        myModal.id = "myModal";
        myModal.classList.add("modal");
        myModal.innerHTML = content;
        document.body.appendChild(myModal);
    }

    function initButtons() {
        let span = myModal.querySelector(".close");
        span.onclick = closeModal;
        config_icon = myModal.querySelector(".config");
        config_icon.onclick = toggleConfig;
        back_icon = myModal.querySelector(".back");
        back_icon.onclick = toggleConfig;
        save_icon = myModal.querySelector(".save");
        save_icon.onclick = saveConfig;
        span = myModal.querySelector(".restore");
        span.onclick = restoreConfig;
    }

    function determinePostFlair() {
        let span = document.querySelector("span.linkflairlabel");
        if (!!span) return span.getAttribute("title");
        else return Array.from(document.querySelector('div[data-test-id="post-content"]')
            .querySelectorAll('span')) // array of spans under post content div
            .find(el => el.textContent.includes('Boss ['))
            .textContent;
    }
})();

function loadConfiguration() {
    let stored_config = GM_getValue('gatheraid_config');
    if (!stored_config) {
        try {
            JSON.parse(default_config);
            // Parse was successful, save this default config
            GM_setValue('gatheraid_config', default_config);
        } catch (e) {
            alert(`GatheRaid: Parsing the default config failed. The script code is probably corrupted.\n\
                   This is a fatal error.\nPlease make sure to install this script directly from its \
                   GreasyFork page by using the Install button and not by copypasting it.\n\
                   The error:\n${e}`);
        }
        return default_config;
    } else {
        return stored_config;
    }
}

function saveConfiguration(configJson) {
    validateConfiguration(JSON.parse(configJson));
    GM_setValue('gatheraid_config', configJson);
}

function validateConfiguration(config) {
    if (!config.templates || !config.settings) {
        throw new SyntaxError(`The configuration object has to contain both a "templates" object and a "settings" object.`);
    }
    if (!config.templates.main_template || !config.templates.weakness_lines_template || !config.templates.weakness_tier_template) {
        throw new SyntaxError(`The template object has to contain the strings "main_template", "weakness_lines_template" and "weakness_tier_template".`);
    }
    if (!config.settings.elements || !config.settings.weapons || !config.settings.weap_tiers || !config.settings.notify_types) {
        throw new SyntaxError(`The settings object has to contain the lists "elements", "weapons", "weap_tiers" and "notify_types".`);
    }
    for (const elemKey in config.settings.elements) {
        if (Object.hasOwnProperty.call(config.settings.elements, elemKey)) {
            const el = config.settings.elements[elemKey];
            if (!el.name || !el.shorthand || !el.symbol) {
                throw new SyntaxError(`An element in settings.elements has no name, shorthand or symbol.`);
            }
        }
    }

    for (const wep of config.settings.weapons) {
        if (!wep.id) {
            throw new SyntaxError(`All weapons in the "settings.weapons" list have to have an id.`);
        }
        if (!wep.damage || !wep.element) {
            throw new SyntaxError(`Weapon id ${wep.id} has no damage or element.`);
        }
    }
    for (const tier of config.settings.weap_tiers) {
        if ([tier.damage_min, tier.damage_max, tier.symbol].includes(undefined)) {
            throw new SyntaxError(`All weapon tiers in the "settings.weap_tiers" list have to have a damage_min, damage_max and a symbol.`);
        }
    }
    for (const type of config.settings.notify_types) {
        if ([type.hp_min, type.hp_max, type.postfix].includes(undefined)) {
            throw new SyntaxError(`All notify types in the "settings.notify_types" list have to have a hp_min, hp_max and a postfix.`);
        }
    }
}

class TemplateToOutputConverter {
    constructor(config) {
        this.templates = config.templates;
        this.settings = config.settings;
    }

    getOutput(data) {
        return this.templates.main_template
            .replace("<notify>", this.getNotify(data.boss_hp))
            .replace("<boss_hp>", data.boss_hp)
            .replace("<wk_symbols>", this.getWeaknessSymbols(data.weaknesses))
            .replace("<wk_lines>", this.getWeaknessLines(data.weaknesses))
            .replace("<post_link>", this.getPostLink(data.post_id))
            .replace("<post_shortlink>", this.getPostLink(data.post_id, true));
    }

    getWeaknessSymbols(weaknesses) {
        let weakness_symbols = "";
        if (weaknesses.length > 0) {
            for (const element of weaknesses) {
                weakness_symbols += this.settings.elements[element].symbol;
            }
        }

        return weakness_symbols ? weakness_symbols : "?";
    }

    getWeaknessLines(weaknesses) {
        let weakness_lines = "";
        if (weaknesses.length > 0) {
            for (const element of weaknesses) {
                let elem_def = this.settings.elements[element];
                weakness_lines += 
                    this.templates.weakness_lines_template
                        .replace("<wkl_symbol>", elem_def.symbol)
                        .replace("<wkl_name>", elem_def.name)
                        .replace("<wkl_tiers>", this.getWeaponTiers(element));
            }
        }

        return weakness_lines;
    }

    getWeaponTiers(element) {
        let tiers = [];
        for (const tier of this.settings.weap_tiers) {
            let weapons = [];
            for (const weapon of this.settings.weapons) {
                if (weapon.element == element &&
                        weapon.damage <= tier.damage_max &&
                        weapon.damage >= tier.damage_min) {
                    weapons.push(`${weapon.id} [${weapon.damage}]`);
                }
            }

            if (weapons.length > 0) {
                tiers.push(
                    this.templates.weakness_tier_template
                            .replace("<wkt_symbol>", tier.symbol)
                            .replace("<wkt_weapons>", weapons.join(", "))
                );
            }
        }

        return tiers.join(", ");
    }

    getNotify(boss_hp) {
        let notify_text = "";
        for (const n_type of this.settings.notify_types) {
            if (boss_hp >= n_type.hp_min && boss_hp <= n_type.hp_max) {
                notify_text += `@Notify${n_type.postfix}`;
            }
        }

        return notify_text;
    }

    getPostLink(post_id, shortlink = false) {
        return `${shortlink ?
            "https://reddit.com/" :
            "https://www.reddit.com/r/kickopenthedoor/comments/"}${post_id}`;
    }
}
