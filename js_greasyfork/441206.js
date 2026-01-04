// ==UserScript==
// @name         IdlePixel+
// @namespace    com.anwinity.idlepixel
// @version      1.2.2
// @description  Idle-Pixel plugin framework
// @author       Anwinity
// @match        *://idle-pixel.com/login/play*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = "1.2.2";

    if(window.IdlePixelPlus) {
        // already loaded
        return;
    }

    const LOCAL_STORAGE_KEY_DEBUG = "IdlePixelPlus:debug";

    const CONFIG_TYPES_LABEL = ["label"];
    const CONFIG_TYPES_BOOLEAN = ["boolean", "bool", "checkbox"];
    const CONFIG_TYPES_INTEGER = ["integer", "int"];
    const CONFIG_TYPES_FLOAT = ["number", "num", "float"];
    const CONFIG_TYPES_STRING = ["string", "text"];
    const CONFIG_TYPES_SELECT = ["select"];
    const CONFIG_TYPES_COLOR = ["color"];

    const CHAT_COMMAND_NO_OVERRIDE = ["help", "mute", "ban", "pm"];

    function createCombatZoneObjects() {
        const fallback = {
            field: {
                id: "field",
                commonMonsters: [
                    "Chickens",
                    "Rats",
                    "Spiders"
                ],
                rareMonsters: [
                    "Lizards",
                    "Bees"
                ],
                energyCost: 50,
                fightPointCost: 300
            },
            blood_field: {
                id: "blood_field",
                blood: true,
                commonMonsters: [
                    "Blood Chickens",
                    "Blood Rats",
                    "Blood Spiders"
                ],
                rareMonsters: [
                    "Blood Lizards",
                    "Blood Bees"
                ],
                energyCost: 5000,
                fightPointCost: 2000
            },
            forest: {
                id: "forest",
                commonMonsters: [
                    "Snakes",
                    "Ants",
                    "Wolves"
                ],
                rareMonsters: [
                    "Ents",
                    "Thief"
                ],
                energyCost: 200,
                fightPointCost: 600
            },
            cave: {
                id: "cave",
                commonMonsters: [
                    "Bears",
                    "Goblins",
                    "Bats"
                ],
                rareMonsters: [
                    "Skeletons"
                ],
                energyCost: 500,
                fightPointCost: 900
            },
            volcano: {
                id: "volcano",
                commonMonsters: [
                    "Fire Hawk",
                    "Fire Snake",
                    "Fire Golem"
                ],
                rareMonsters: [
                    "Fire Witch"
                ],
                energyCost: 1000,
                fightPointCost: 1500
            },
            northern_field: {
                id: "northern_field",
                commonMonsters: [
                    "Ice Hawk",
                    "Ice Witch",
                    "Golem"
                ],
                rareMonsters: [
                    "Yeti"
                ],
                energyCost: 3000,
                fightPointCost: 2000
            }
        };
        try {
            const normalCode = Combat._modal_load_area_data.toString().split(/\r?\n/g);
            const bloodCode = Combat._modal_load_blood_area_data.toString().split(/\r?\n/g);
            const zones = {};
            [false, true].forEach(blood => {
                const code = blood ? bloodCode : normalCode;
                let foundSwitch = false;
                let endSwitch = false;
                let current = null;
                code.forEach(line => {
                    if(endSwitch) {
                        return;
                    }
                    if(!foundSwitch) {
                        if(line.includes("switch(area)")) {
                            foundSwitch = true;
                        }
                    }
                    else {
                        line = line.trim();
                        if(foundSwitch && !endSwitch && !current && line=='}') {
                            endSwitch = true;
                        }
                        else if(/case /.test(line)) {
                            // start of zone data
                            let zoneId = line.replace(/^case\s+"/, "").replace(/":.*$/, "");
                            current = zones[zoneId] = {id: zoneId, blood: blood};
                        }
                        else if(line.startsWith("break;")) {
                            // end of zone data
                            current = null;
                        }
                        else if(current) {
                            if(line.startsWith("common_monsters_array")) {
                                current.commonMonsters = line
                                    .replace("common_monsters_array = [", "")
                                    .replace("];", "")
                                    .split(/\s*,\s*/g)
                                    .map(s => s.substring(1, s.length-1));
                            }
                            else if(line.startsWith("rare_monsters_array")) {
                                current.rareMonsters = line
                                    .replace("rare_monsters_array = [", "")
                                    .replace("];", "")
                                    .split(/\s*,\s*/g)
                                    .map(s => s.substring(1, s.length-1));
                            }
                            else if(line.startsWith("energy")) {
                                current.energyCost = parseInt(line.match(/\d+/)[0]);
                            }
                            else if(line.startsWith("fightpoints")) {
                                current.fightPointCost = parseInt(line.match(/\d+/)[0]);
                            }
                        }
                    }
                });
            });

            if(!zones || !Object.keys(zones).length) {
                console.error("IdlePixelPlus: Could not parse combat zone data, using fallback.");
                return fallback;
            }
            return zones;
        }
        catch(err) {
            console.error("IdlePixelPlus: Could not parse combat zone data, using fallback.", err);
            return fallback;
        }
    }

    function createOreObjects() {
        const ores = {
            stone:      { smeltable:false, bar: null },
            copper:     { smeltable:true, smeltTime: 3, bar: "bronze_bar" },
            iron:       { smeltable:true, smeltTime: 6, bar: "iron_bar" },
            silver:     { smeltable:true, smeltTIme: 15, bar: "silver_bar" },
            gold:       { smeltable:true, smeltTIme: 50, bar: "gold_bar" },
            promethium: { smeltable:true, smeltTIme: 100, bar: "promethium_bar" }
        };
        try {
            Object.keys(ores).forEach(id => {
                const obj = ores[id];
                obj.id = id;
                obj.oil = Crafting.getOilPerBar(id);
                obj.charcoal = Crafting.getCharcoalPerBar(id);
            });
        }
        catch(err) {
            console.error("IdlePixelPlus: Could not create ore data. This could adversely affect related functionality.", err);
        }
        return ores;
    }

    function createSeedObjects() {
        // hardcoded for now.
        return {
            dotted_green_leaf_seeds: {
                id: "dotted_green_leaf_seeds",
                level: 1,
                stopsDying: 15,
                time: 15,
                bonemealCost: 0
            },
            stardust_seeds: {
                id: "stardust_seeds",
                level: 8,
                stopsDying: 0,
                time: 20,
                bonemealCost: 0
            },
            green_leaf_seeds: {
                id: "green_leaf_seeds",
                level: 10,
                stopsDying: 25,
                time: 30,
                bonemealCost: 0
            },
            lime_leaf_seeds: {
                id: "lime_leaf_seeds",
                level: 25,
                stopsDying: 40,
                time: 1*60,
                bonemealCost: 1
            },
            gold_leaf_seeds: {
                id: "gold_leaf_seeds",
                level: 50,
                stopsDying: 60,
                time: 2*60,
                bonemealCost: 10
            },
            crystal_leaf_seeds: {
                id: "crystal_leaf_seeds",
                level: 70,
                stopsDying: 80,
                time: 5*60,
                bonemealCost: 25
            },
            red_mushroom_seeds: {
                id: "red_mushroom_seeds",
                level: 1,
                stopsDying: 0,
                time: 5,
                bonemealCost: 0
            },
            tree_seeds: {
                id: "tree_seeds",
                level: 10,
                stopsDying: 25,
                time: 5*60,
                bonemealCost: 10
            },
            oak_tree_seeds: {
                id: "oak_tree_seeds",
                level: 25,
                stopsDying: 40,
                time: 4*60,
                bonemealCost: 25
            },
            willow_tree_seeds: {
                id: "willow_tree_seeds",
                level: 37,
                stopsDying: 55,
                time: 8*60,
                bonemealCost: 50
            },
            maple_tree_seeds: {
                id: "maple_tree_seeds",
                level: 50,
                stopsDying: 65,
                time: 12*60,
                bonemealCost: 120
            },
            stardust_tree_seeds: {
                id: "stardust_tree_seeds",
                level: 65,
                stopsDying: 80,
                time: 15*60,
                bonemealCost: 150
            },
            pine_tree_seeds: {
                id: "pine_tree_seeds",
                level: 70,
                stopsDying: 85,
                time: 17*60,
                bonemealCost: 180
            }
        };
    }

    function createSpellObjects() {
        const spells = {};
        Object.keys(Magic.spell_info).forEach(id => {
            const info = Magic.spell_info[id];
            spells[id] = {
                id: id,
                manaCost: info.mana_cost,
                magicBonusRequired: info.magic_bonus
            };
        });
        return spells;
    }

    const INFO = {
        ores: createOreObjects(),
        seeds: createSeedObjects(),
        combatZones: createCombatZoneObjects(),
        spells: createSpellObjects()
    };

    function logFancy(s, color="#00f7ff") {
        console.log("%cIdlePixelPlus: %c"+s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: black; font-weight: normal; font-size: 10pt;");
    }

    class IdlePixelPlusPlugin {

        constructor(id, opts) {
            if(typeof id !== "string") {
                throw new TypeError("IdlePixelPlusPlugin constructor takes the following arguments: (id:string, opts?:object)");
            }
            this.id = id;
            this.opts = opts || {};
            this.config = null;
        }

        getConfig(name) {
            if(!this.config) {
                IdlePixelPlus.loadPluginConfigs(this.id);
            }
            if(this.config) {
                return this.config[name];
            }
        }

        /*
        onConfigsChanged() { }
        onLogin() { }
        onMessageReceived(data) { }
        onVariableSet(key, valueBefore, valueAfter) { }
        onChat(data) { }
        onPanelChanged(panelBefore, panelAfter) { }
        onCombatStart() { }
        onCombatEnd() { }
        onCustomMessageReceived(player, content, callbackId) { }
        onCustomMessagePlayerOffline(player, content) { }
        */

    }

    const internal = {
        init() {
            const self = this;

            $("head").append(`
            <style>
            .ipp-chat-command-help {
              padding: 0.5em 0;
            }
            .ipp-chat-command-help:first-child {
              padding-top: 0;
            }
            .ipp-chat-command-help:last-child {
              padding-bottom: 0;
            }
            dialog.ipp-dialog {
              background-color: white;
              border: 1px solid rgba(0, 0, 0, 0.2);
              width: 500px;
              max-width: 800px;
              border-radius: 5px;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
            }
            dialog.ipp-dialog > div {
              width: 100%;
            }
            dialog.ipp-dialog > .ipp-dialog-header > h4 {
              margin-bottom: 0;
            }
            dialog.ipp-dialog > .ipp-dialog-header {
              border-bottom: 1px solid rgba(0, 0, 0, 0.2);
              padding-bottom: 0.25em;
            }
            dialog.ipp-dialog > .ipp-dialog-actions {
              padding-top: 0.25em;
              padding-bottom: 0.25em;
            }
            dialog.ipp-dialog > .ipp-dialog-actions {
              border-top: 1px solid rgba(0, 0, 0, 0.2);
              padding-top: 0.25em;
              text-align: right;
            }
            dialog.ipp-dialog > .ipp-dialog-actions > button {
              margin: 4px;
            }
            </style>
            `);

            // hook into websocket messages
            const hookIntoOnMessage = () => {
                try {
                    const original_onmessage = window.websocket.connected_socket.onmessage;
                    if(typeof original_onmessage === "function") {
                        window.websocket.connected_socket.onmessage = function(event) {
                            original_onmessage.apply(window.websocket.connected_socket, arguments);
                            self.onMessageReceived(event.data);
                        }
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                catch(err) {
                    console.error("Had trouble hooking into websocket...");
                    return false;
                }
            };
            $(function() {
                if(!hookIntoOnMessage()) {
                    // try once more
                    setTimeout(hookIntoOnMessage, 40);
                }
            });

            // hook into Chat.send
            const original_chat_send = Chat.send;
            Chat.send = function() {
                const input = $("#chat-area-input");
                let message = input.val();
                if(message.length == 0) {
                    return;
                }
                if(message.startsWith("/")) {
                    const space = message.indexOf(" ");
                    let command;
                    let data;
                    if(space <= 0) {
                        command = message.substring(1);
                        data = "";
                    }
                    else {
                        command = message.substring(1, space);
                        data = message.substring(space+1);
                    }
                    if(window.IdlePixelPlus.handleCustomChatCommand(command, data)) {
                        input.val("");
                    }
                    else {
                        original_chat_send();
                    }
                }
                else {
                    original_chat_send();
                }
            };

            // hook into Items.set, which is where var_ values are set
            const original_items_set = Items.set;
            Items.set = function(key, value) {
                let valueBefore = window["var_"+key];
                original_items_set.apply(this, arguments);
                let valueAfter = window["var_"+key];
                self.onVariableSet(key, valueBefore, valueAfter);
            }

            // hook into switch_panels, which is called when the main panel is changed. This is also used for custom panels.
            const original_switch_panels = window.switch_panels;
            window.switch_panels = function(id) {
                let panelBefore = Globals.currentPanel;
                if(panelBefore && panelBefore.startsWith("panel-")) {
                    panelBefore = panelBefore.substring("panel-".length);
                }
                self.hideCustomPanels();
                original_switch_panels.apply(this, arguments);
                let panelAfter = Globals.currentPanel;
                if(panelAfter && panelAfter.startsWith("panel-")) {
                    panelAfter = panelAfter.substring("panel-".length);
                }
                self.onPanelChanged(panelBefore, panelAfter);
            }

            // create plugin menu item and panel
            const lastMenuItem = $("#menu-bar-buttons > .hover-menu-bar-item").last();
            lastMenuItem.after(`
            <div onclick="IdlePixelPlus.setPanel('idlepixelplus')" class="hover hover-menu-bar-item">
                <img id="menu-bar-idlepixelplus-icon" src="https://anwinity.com/idlepixelplus/plugins.png"> PLUGINS
            </div>
            `);
            self.addPanel("idlepixelplus", "IdlePixel+ Plugins", function() {
                let content = `
                <style>
                    .idlepixelplus-plugin-box {
                        display: block;
                        position: relative;
                        padding: 0.25em;
                        color: white;
                        background-color: rgb(107, 107, 107);
                        border: 1px solid black;
                        border-radius: 6px;
                        margin-bottom: 0.5em;
                    }
                    .idlepixelplus-plugin-box .idlepixelplus-plugin-settings-button {
                        position: absolute;
                        right: 2px;
                        top: 2px;
                        cursor: pointer;
                    }
                    .idlepixelplus-plugin-box .idlepixelplus-plugin-config-section {
                        display: grid;
                        grid-template-columns: minmax(100px, min-content) 1fr;
                        row-gap: 0.5em;
                        column-gap: 0.5em;
                        white-space: nowrap;
                    }
                </style>
                `;
                self.forEachPlugin(plugin => {
                    let id = plugin.id;
                    let name = "An IdlePixel+ Plugin!";
                    let description = "";
                    let author = "unknown";
                    if(plugin.opts.about) {
                        let about = plugin.opts.about;
                        name = about.name || name;
                        description = about.description || description;
                        author = about.author || author;
                    }
                    content += `
                    <div id="idlepixelplus-plugin-box-${id}" class="idlepixelplus-plugin-box">
                        <strong><u>${name||id}</u></strong> (by ${author})<br />
                        <span>${description}</span><br />
                        <div class="idlepixelplus-plugin-config-section" style="display: none">
                            <hr style="grid-column: span 2">
                    `;
                    if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                        plugin.opts.config.forEach(cfg => {
                            if(CONFIG_TYPES_LABEL.includes(cfg.type)) {
                                content += `<h5 style="grid-column: span 2; margin-bottom: 0; font-weight: 600">${cfg.label}</h5>`;
                            }
                            else if(CONFIG_TYPES_BOOLEAN.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="idlepixelplus-config-${plugin.id}-${cfg.id}" type="checkbox" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="idlepixelplus-config-${plugin.id}-${cfg.id}" type="number" step="1" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="idlepixelplus-config-${plugin.id}-${cfg.id}" type="number" step="${cfg.step || ''}" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_STRING.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="idlepixelplus-config-${plugin.id}-${cfg.id}" type="text" maxlength="${cfg.max || ''}" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_COLOR.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="idlepixelplus-config-${plugin.id}-${cfg.id}" type="color" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_SELECT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="idlepixelplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <select id="idlepixelplus-config-${plugin.id}-${cfg.id}" onchange="IdlePixelPlus.setPluginConfigUIDirty('${id}', true)">
                                    `;
                                if(cfg.options && Array.isArray(cfg.options)) {
                                    cfg.options.forEach(option => {
                                        if(typeof option === "string") {
                                            content += `<option value="${option}">${option}</option>`;
                                        }
                                        else {
                                            content += `<option value="${option.value}">${option.label || option.value}</option>`;
                                        }

                                    });
                                }
                                content += `
                                        </select>
                                    </div>
                                    `;
                            }
                        });
                        content += `
                        <div style="grid-column: span 2">
                            <button id="idlepixelplus-configbutton-${plugin.id}-reload" onclick="IdlePixelPlus.loadPluginConfigs('${id}')">Reload</button>
                            <button id="idlepixelplus-configbutton-${plugin.id}-apply" onclick="IdlePixelPlus.savePluginConfigs('${id}')">Apply</button>
                        </div>
                        `;
                    }
                    content += "</div>";
                    if(plugin.opts.config) {
                        content += `
                        <div class="idlepixelplus-plugin-settings-button">
                            <button onclick="$('#idlepixelplus-plugin-box-${id} .idlepixelplus-plugin-config-section').toggle()">Settings</button>
                        </div>`;
                    }
                    content += "</div>";
                });

                return content;
            });

            $("#chat-area-input").attr("autocomplete", "off");

            logFancy(`(v${self.version}) initialized.`);
        }
    };

    class IdlePixelPlus {

        constructor() {
            this.version = VERSION;
            this.plugins = {};
            this.panels = {};
            this.debug = false;
            this.info = INFO;
            this.nextUniqueId = 1;
            this.customMessageCallbacks = {};
            this.customChatCommands = {
                help: (command, data) => {
                    console.log("help", command, data);
                }
            };
            this.customChatHelp = {};
            this.customDialogOptions = {};

            if(localStorage.getItem(LOCAL_STORAGE_KEY_DEBUG) == "1") {
                this.debug = true;
            }
        }

        getCustomDialogData(id) {
            const el = document.querySelector(`dialog#${id}.ipp-dialog`);
            if(el) {
                const result = {};
                $(el).find("[data-key]").each(function() {
                    const dataElement = $(this);
                    const dataKey = dataElement.attr("data-key");
                    if(["INPUT", "SELECT", "TEXTAREA"].includes(dataElement.prop("tagName"))) {
                        result[dataKey] = dataElement.val();
                    }
                    else {
                        result[dataKey] = dataElement.text();
                    }
                });
                return result;
            }
        }

        openCustomDialog(id, noEvent=false) {
            this.closeCustomDialog(id, true);
            const el = document.querySelector(`dialog#${id}.ipp-dialog`);
            if(el) {
                el.style.display = "";
                el.showModal();
                const opts = this.customDialogOptions[id];
                if(!noEvent && opts && typeof opts.onOpen === "function") {
                    opts.onOpen(opts);
                }
            }
        }

        closeCustomDialog(id, noEvent=false) {
            const el = document.querySelector(`dialog#${id}.ipp-dialog`);
            if(el) {
                el.close();
                el.style.display = "none";
                const opts = this.customDialogOptions[id];
                if(!noEvent && opts && typeof opts.onClose === "function") {
                    opts.onClose(opts);
                }
            }
        }

        destroyCustomDialog(id, noEvent=false) {
            const el = document.querySelector(`dialog#${id}.ipp-dialog`);
            if(el) {
                el.remove();
                const opts = this.customDialogOptions[id];
                if(!noEvent && opts && typeof opts.onDestroy === "function") {
                    opts.onDestroy(opts);
                }
            }
            delete this.customDialogOptions[id];
        }

        createCustomDialog(id, opts={}) {
            const self = this;
            this.destroyCustomDialog(id);
            this.customDialogOptions[id] = opts;
            const el = $("body").append(`
            	<dialog id="${id}" class="ipp-dialog" style="display: none">
            		<div class="ipp-dialog-header">
			            <h4>${opts.title||''}</h4>
            		</div>
            		<div class="ipp-dialog-content"></div>
            		<div class="ipp-dialog-actions"></div>
            	</dialog>
	            `);
            const headerElement = el.find(".ipp-dialog-header");
            const contentElement = el.find(".ipp-dialog-content");
            const actionsElement = el.find(".ipp-dialog-actions");

            if(!opts.title) {
                headerElement.hide();
            }

            if(typeof opts.content === "string") {
                contentElement.append(opts.content);
            }

            let actions = opts.actions;
            if(actions) {
                if(!Array.isArray(actions)) {
                    actions = [actions];
                }
                actions.forEach(action => {
                    let label;
                    let primary = false;
                    if(typeof action === "string") {
                        label = action;
                    }
                    else {
                        label = action.label || action.action;
                        primary = action.primary===true;
                        action = action.action;
                    }
                    actionsElement.append(`<button data-action="${action}" class="${primary?'background-primary':''}">${label}</button>`);
                });
                actionsElement.find("button").on("click", function(e) {
                    if(typeof opts.onAction === "function") {
                        e.stopPropagation();
                        const button = $(this);
                        const buttonAction = button.attr("data-action");
                        const data = self.getCustomDialogData(id);
                        const actionReturn = opts.onAction(buttonAction, data);
                        if(actionReturn) {
                            self.closeCustomDialog(id);
                        }
                    }
                });
            }
            else {
                el.find(".ipp-dialog-actions").hide();
            }

            el.click(function(e) {
                const rect = e.target.getBoundingClientRect();
                const inside =
                      rect.top <= e.clientY &&
                      rect.left <= e.clientX &&
                      e.clientX <= rect.left + rect.width &&
                      e.clientY <= rect.top + rect.height;
                if(!inside) {
                    self.closeCustomDialog(id);
                    e.stopPropagation();
                }
            });

            if(typeof opts.onCreate === "function") {
                opts.onCreate();
            }
            if(opts.openImmediately === true) {
                this.openCustomDialog(id);
            }
        }


        registerCustomChatCommand(command, f, help) {
            if(Array.isArray(command)) {
                command.forEach(cmd => this.registerCustomChatCommand(cmd, f, help));
                return;
            }
            if(typeof command !== "string" || typeof f !== "function") {
                throw new TypeError("IdlePixelPlus.registerCustomChatCommand takes the following arguments: (command:string, f:function)");
            }
            if(CHAT_COMMAND_NO_OVERRIDE.includes(command)) {
                throw new Error(`Cannot override the following chat commands: ${CHAT_COMMAND_NO_OVERRIDE.join(", ")}`);
            }
            if(command in this.customChatCommands) {
                console.warn(`IdlePixelPlus: re-registering custom chat command "${command}" which already exists.`);
            }
            this.customChatCommands[command] = f;
            if(help && typeof help === "string") {
                this.customChatHelp[command] = help.replace(/%COMMAND%/g, command);
            }
            else {
                delete this.customChatHelp[command];
            }
        }

        handleCustomChatCommand(command, message) {
            // return true if command handler exists, false otherwise
            const f = this.customChatCommands[command];
            if(typeof f === "function") {
                try {
                    f(command, message);
                }
                catch(err) {
                    console.error(`Error executing custom command "${command}"`, err);
                }
                return true;
            }
            return false;
        }

        uniqueId() {
            return this.nextUniqueId++;
        }

        setDebug(debug) {
            if(debug) {
                this.debug = true;
                localStorage.setItem(LOCAL_STORAGE_KEY_DEBUG, "1");
            }
            else {
                this.debug = false;
                localStorage.removeItem(LOCAL_STORAGE_KEY_DEBUG);
            }
        }

        getVar(name, type) {
            let s = window[`var_${name}`];
            if(type) {
                switch(type) {
                    case "int":
                    case "integer":
                        return parseInt(s);
                    case "number":
                    case "float":
                        return parseFloat(s);
                    case "boolean":
                    case "bool":
                        if(s=="true") return true;
                        if(s=="false") return false;
                        return undefined;
                }
            }
            return s;
        }

        getVarOrDefault(name, defaultValue, type) {
            let s = window[`var_${name}`];
            if(s==null || typeof s === "undefined") {
                return defaultValue;
            }
            if(type) {
                let value;
                switch(type) {
                    case "int":
                    case "integer":
                        value = parseInt(s);
                        return isNaN(value) ? defaultValue : value;
                    case "number":
                    case "float":
                        value = parseFloat(s);
                        return isNaN(value) ? defaultValue : value;
                    case "boolean":
                    case "bool":
                        if(s=="true") return true;
                        if(s=="false") return false;
                        return defaultValue;
                }
            }
            return s;
        }

        setPluginConfigUIDirty(id, dirty) {
            if(typeof id !== "string" || typeof dirty !== "boolean") {
                throw new TypeError("IdlePixelPlus.setPluginConfigUIDirty takes the following arguments: (id:string, dirty:boolean)");
            }
            const plugin = this.plugins[id];
            const button = $(`#idlepixelplus-configbutton-${plugin.id}-apply`);
            if(button) {
                button.prop("disabled", !(dirty));
            }
        }

        loadPluginConfigs(id) {
            if(typeof id !== "string") {
                throw new TypeError("IdlePixelPlus.reloadPluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            let stored;
            try {
                stored = JSON.parse(localStorage.getItem(`idlepixelplus.${id}.config`) || "{}");
            }
            catch(err) {
                console.error(`Failed to load configs for plugin with id "${id} - will use defaults instead."`);
                stored = {};
            }
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#idlepixelplus-config-${plugin.id}-${cfg.id}`);
                    let value = stored[cfg.id];
                    if(value==null || typeof value === "undefined") {
                        value = cfg.default;
                    }
                    config[cfg.id] = value;

                    if(el) {
                        if(CONFIG_TYPES_BOOLEAN.includes(cfg.type) && typeof value === "boolean") {
                            el.prop("checked", value);
                        }
                        else if(CONFIG_TYPES_INTEGER.includes(cfg.type) && typeof value === "number") {
                            el.val(value);
                        }
                        else if(CONFIG_TYPES_FLOAT.includes(cfg.type) && typeof value === "number") {
                            el.val(value);
                        }
                        else if(CONFIG_TYPES_STRING.includes(cfg.type) && typeof value === "string") {
                            el.val(value);
                        }
                        else if(CONFIG_TYPES_SELECT.includes(cfg.type) && typeof value === "string") {
                            el.val(value);
                        }
                        else if(CONFIG_TYPES_COLOR.includes(cfg.type) && typeof value === "string") {
                            el.val(value);
                        }
                    }
                });
            }
            plugin.config = config;
            this.setPluginConfigUIDirty(id, false);
            if(typeof plugin.onConfigsChanged === "function") {
                plugin.onConfigsChanged();
            }
        }

        savePluginConfigs(id) {
            if(typeof id !== "string") {
                throw new TypeError("IdlePixelPlus.savePluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#idlepixelplus-config-${plugin.id}-${cfg.id}`);
                    let value;
                    if(CONFIG_TYPES_BOOLEAN.includes(cfg.type)) {
                        config[cfg.id] = el.is(":checked");
                    }
                    else if(CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                        config[cfg.id] = parseInt(el.val());
                    }
                    else if(CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                        config[cfg.id] = parseFloat(el.val());
                    }
                    else if(CONFIG_TYPES_STRING.includes(cfg.type)) {
                        config[cfg.id] = el.val();
                    }
                    else if(CONFIG_TYPES_SELECT.includes(cfg.type)) {
                        config[cfg.id] = el.val();
                    }
                    else if(CONFIG_TYPES_COLOR.includes(cfg.type)) {
                        config[cfg.id] = el.val();
                    }
                });
            }
            plugin.config = config;
            localStorage.setItem(`idlepixelplus.${id}.config`, JSON.stringify(config));
            this.setPluginConfigUIDirty(id, false);
            if(typeof plugin.onConfigsChanged === "function") {
                plugin.onConfigsChanged();
            }
        }

        addPanel(id, title, content) {
            if(typeof id !== "string" || typeof title !== "string" || (typeof content !== "string" && typeof content !== "function") ) {
                throw new TypeError("IdlePixelPlus.addPanel takes the following arguments: (id:string, title:string, content:string|function)");
            }
            const panels = $("#panels");
            panels.append(`
            <div id="panel-${id}" style="display: none">
                <h1>${title}</h1>
                <hr>
                <div class="idlepixelplus-panel-content"></div>
            </div>
            `);
            this.panels[id] = {
                id: id,
                title: title,
                content: content
            };
            this.refreshPanel(id);
        }

        refreshPanel(id) {
            if(typeof id !== "string") {
                throw new TypeError("IdlePixelPlus.refreshPanel takes the following arguments: (id:string)");
            }
            const panel = this.panels[id];
            if(!panel) {
                throw new TypeError(`Error rendering panel with id="${id}" - panel has not be added.`);
            }
            let content = panel.content;
            if(!["string", "function"].includes(typeof content)) {
                throw new TypeError(`Error rendering panel with id="${id}" - panel.content must be a string or a function returning a string.`);
            }
            if(typeof content === "function") {
                content = content();
                if(typeof content !== "string") {
                    throw new TypeError(`Error rendering panel with id="${id}" - panel.content must be a string or a function returning a string.`);
                }
            }
            const panelContent = $(`#panel-${id} .idlepixelplus-panel-content`);
            panelContent.html(content);
            if(id === "idlepixelplus") {
                this.forEachPlugin(plugin => {
                    this.loadPluginConfigs(plugin.id);
                });
            }
        }

        registerPlugin(plugin) {
            if(!(plugin instanceof IdlePixelPlusPlugin)) {
                throw new TypeError("IdlePixelPlus.registerPlugin takes the following arguments: (plugin:IdlePixelPlusPlugin)");
            }
            if(plugin.id in this.plugins) {
                throw new Error(`IdlePixelPlusPlugin with id "${plugin.id}" is already registered. Make sure your plugin id is unique!`);
            }

            this.plugins[plugin.id] = plugin;
            this.loadPluginConfigs(plugin.id);
            let versionString = plugin.opts&&plugin.opts.about&&plugin.opts.about.version ? ` (v${plugin.opts.about.version})` : "";
            logFancy(`registered plugin "${plugin.id}"${versionString}`);
        }

        forEachPlugin(f) {
            if(typeof f !== "function") {
                throw new TypeError("IdlePixelPlus.forEachPlugin takes the following arguments: (f:function)");
            }
            Object.values(this.plugins).forEach(plugin => {
                try {
                    f(plugin);
                }
                catch(err) {
                    console.error(`Error occurred while executing function for plugin "${plugin.id}."`);
                    console.error(err);
                }
            });
        }

        setPanel(panel) {
            if(typeof panel !== "string") {
                throw new TypeError("IdlePixelPlus.setPanel takes the following arguments: (panel:string)");
            }
            window.switch_panels(`panel-${panel}`);
        }

        sendMessage(message) {
            if(typeof message !== "string") {
                throw new TypeError("IdlePixelPlus.sendMessage takes the following arguments: (message:string)");
            }
            if(window.websocket && window.websocket.connected_socket && window.websocket.connected_socket.readyState==1) {
                window.websocket.connected_socket.send(message);
            }
        }

        showToast(title, content) {
            show_toast(title, content);
        }

        hideCustomPanels() {
            Object.values(this.panels).forEach((panel) => {
                const el = $(`#panel-${panel.id}`);
                if(el) {
                    el.css("display", "none");
                }
            });
        }

        onMessageReceived(data) {
            if(this.debug) {
                console.log(`IP+ onMessageReceived: ${data}`);
            }
            if(data) {
                this.forEachPlugin((plugin) => {
                    if(typeof plugin.onMessageReceived === "function") {
                        plugin.onMessageReceived(data);
                    }
                });
                if(data.startsWith("VALID_LOGIN")) {
                    this.onLogin();
                }
                else if(data.startsWith("CHAT=")) {
                    const split = data.substring("CHAT=".length).split("~");
                    const chatData = {
                        username: split[0],
                        sigil: split[1],
                        tag: split[2],
                        level: parseInt(split[3]),
                        message: split[4]
                    };
                    this.onChat(chatData);
                    // CHAT=anwinity~none~none~1565~test
                }
                else if(data.startsWith("CUSTOM=")) {
                    const customData = data.substring("CUSTOM=".length);
                    const tilde = customData.indexOf("~");
                    if(tilde > 0) {
                        const fromPlayer = customData.substring(0, tilde);
                        const content = customData.substring(tilde+1);
                        this.onCustomMessageReceived(fromPlayer, content);
                    }
                }
            }
        }

        deleteCustomMessageCallback(callbackId) {
            if(this.debug) {
                console.log(`IP+ deleteCustomMessageCallback`, callbackId);
            }
            delete this.customMessageCallbacks[callbackId];
        }

        requestPluginManifest(player, callback, pluginId) {
            if(typeof pluginId === "string") {
                pluginId = [pluginId];
            }
            if(Array.isArray(pluginId)) {
                pluginId = JSON.stringify(pluginId);
            }
            this.sendCustomMessage(player, {
                content: "PLUGIN_MANIFEST" + (pluginId ? `:${pluginId}` : ''),
                onResponse: function(respPlayer, content) {
                    if(typeof callback === "function") {
                        callback(respPlayer, JSON.parse(content));
                    }
                    else {
                        console.log(`Plugin Manifest: ${respPlayer}`, content);
                    }
                },
                onOffline: function(respPlayer, content) {
                    if(typeof callback === "function") {
                        callback(respPlayer, false);
                    }
                },
                timeout: 10000
            });
        }

        sendCustomMessage(toPlayer, opts) {
            if(this.debug) {
                console.log(`IP+ sendCustomMessage`, toPlayer, opts);
            }
            const reply = !!(opts.callbackId);
            const content = typeof opts.content === "string" ? opts.content : JSON.stringify(opts.content);
            const callbackId = reply ? opts.callbackId : this.uniqueId();
            const responseHandler = typeof opts.onResponse === "function" ? opts.onResponse : null;
            const offlineHandler = opts.onOffline===true ? () => { this.deleteCustomMessageCallback(callbackId); } : (typeof opts.onOffline === "function" ? opts.onOffline : null);
            const timeout = typeof opts.timeout === "number" ? opts.timeout : -1;

            if(responseHandler || offlineHandler) {
                const handler = {
                    id: callbackId,
                    player: toPlayer,
                    responseHandler: responseHandler,
                    offlineHandler: offlineHandler,
                    timeout: typeof timeout === "number" ? timeout : -1,
                };
                if(callbackId) {
                    this.customMessageCallbacks[callbackId] = handler;
                    if(handler.timeout > 0) {
                        setTimeout(() => {
                            this.deleteCustomMessageCallback(callbackId);
                        }, handler.timeout);
                    }
                }
            }
            const message = `CUSTOM=${toPlayer}~IPP${reply?'R':''}${callbackId}:${content}`;
            if(message.length > 255) {
                console.warn("The resulting websocket message from IdlePixelPlus.sendCustomMessage has a length limit of 255 characters. Recipients may not receive the full message!");
            }
            this.sendMessage(message);
        }

        onCustomMessageReceived(fromPlayer, content) {
            if(this.debug) {
                console.log(`IP+ onCustomMessageReceived`, fromPlayer, content);
            }
            const offline = content == "PLAYER_OFFLINE";
            let callbackId = null;
            let originalCallbackId = null;
            let reply = false;
            const ippMatcher = content.match(/^IPP(\w+):/);
            if(ippMatcher) {
                originalCallbackId = callbackId = ippMatcher[1];
                let colon = content.indexOf(":");
                content = content.substring(colon+1);
                if(callbackId.startsWith("R")) {
                    callbackId = callbackId.substring(1);
                    reply = true;
                }
            }

            // special built-in messages
            if(content.startsWith("PLUGIN_MANIFEST")) {
                const manifest = {};
                let filterPluginIds = null;
                if(content.includes(":")) {
                    content = content.substring("PLUGIN_MANIFEST:".length);
                    filterPluginIds = JSON.parse(content).map(s => s.replace("~", ""));
                }
                this.forEachPlugin(plugin => {
                    let id = plugin.id.replace("~", "");
                    if(filterPluginIds && !filterPluginIds.includes(id)) {
                        return;
                    }
                    let version = "unknown";
                    if(plugin.opts && plugin.opts.about && plugin.opts.about.version) {
                        version = plugin.opts.about.version.replace("~", "");
                    }
                    manifest[id] = version;
                });
                manifest.IdlePixelPlus = IdlePixelPlus.version;
                this.sendCustomMessage(fromPlayer, {
                    content: manifest,
                    callbackId: callbackId
                });
                return;
            }

            const callbacks = this.customMessageCallbacks;
            if(reply) {
                const handler = callbacks[callbackId];
                if(handler && typeof handler.responseHandler === "function") {
                    try {
                        if(handler.responseHandler(fromPlayer, content, originalCallbackId)) {
                            this.deleteCustomMessageCallback(callbackId);
                        }
                    }
                    catch(err) {
                        console.error("Error executing custom message response handler.", {player: fromPlayer, content: content, handler: handler});
                    }
                }
            }
            else if(offline) {
                Object.values(callbacks).forEach(handler => {
                    try {
                        if(handler.player.toLowerCase()==fromPlayer.toLowerCase() && typeof handler.offlineHandler === "function" && handler.offlineHandler(fromPlayer, content)) {
                            this.deleteCustomMessageCallback(handler.id);
                        }
                    }
                    catch(err) {
                        console.error("Error executing custom message offline handler.", {player: fromPlayer, content: content, handler: handler});
                    }
                });
            }

            if(offline) {
                this.onCustomMessagePlayerOffline(fromPlayer, content);
            }
            else {
                this.forEachPlugin((plugin) => {
                    if(typeof plugin.onCustomMessageReceived === "function") {
                        plugin.onCustomMessageReceived(fromPlayer, content, originalCallbackId);
                    }
                });
            }
        }

        onCustomMessagePlayerOffline(fromPlayer, content) {
            if(this.debug) {
                console.log(`IP+ onCustomMessagePlayerOffline`, fromPlayer, content);
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onCustomMessagePlayerOffline === "function") {
                    plugin.onCustomMessagePlayerOffline(fromPlayer, content);
                }
            });
        }

        onCombatStart() {
            if(this.debug) {
                console.log(`IP+ onCombatStart`);
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onCombatStart === "function") {
                    plugin.onCombatStart();
                }
            });
        }

        onCombatEnd() {
            if(this.debug) {
                console.log(`IP+ onCombatEnd`);
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onCombatEnd === "function") {
                    plugin.onCombatEnd();
                }
            });
        }

        onLogin() {
            if(this.debug) {
                console.log(`IP+ onLogin`);
            }
            logFancy("login detected");
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onLogin === "function") {
                    plugin.onLogin();
                }
            });
            $("#chat-area").append(`
            <div class="ipp-chat-command-help">
              <span><strong>FYI: </strong> Use the /help command to see information on available chat commands.</span>
            </div>
            `);
            if(Chat._auto_scroll) {
                $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
            }

        }

        onVariableSet(key, valueBefore, valueAfter) {
            if(this.debug) {
                console.log(`IP+ onVariableSet "${key}": "${valueBefore}" -> "${valueAfter}"`);
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onVariableSet === "function") {
                    plugin.onVariableSet(key, valueBefore, valueAfter);
                }
            });
            if(key == "monster_name") {
                const combatBefore = !!(valueBefore && valueBefore!="none");
                const combatAfter = !!(valueAfter && valueAfter!="none");
                if(!combatBefore && combatAfter) {
                    this.onCombatStart();
                }
                else if(combatBefore && !combatAfter) {
                    this.onCombatEnd();
                }
            }
        }

        onChat(data) {
            if(this.debug) {
                console.log(`IP+ onChat`, data);
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onChat === "function") {
                    plugin.onChat(data);
                }
            });
        }

        onPanelChanged(panelBefore, panelAfter) {
            if(this.debug) {
                console.log(`IP+ onPanelChanged "${panelBefore}" -> "${panelAfter}"`);
            }
            if(panelAfter === "idlepixelplus") {
                this.refreshPanel("idlepixelplus");
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onPanelChanged === "function") {
                    plugin.onPanelChanged(panelBefore, panelAfter);
                }
            });
        }

    }

    // Add to window and init
    window.IdlePixelPlusPlugin = IdlePixelPlusPlugin;
    window.IdlePixelPlus = new IdlePixelPlus();

    window.IdlePixelPlus.customChatCommands["help"] = (command, data='') => {
        let help;
        if(data && data!="help") {
            let helpContent = window.IdlePixelPlus.customChatHelp[data.trim()] || "No help content was found for this command.";
            help = `
            <div class="ipp-chat-command-help">
              <strong><u>Command Help:</u></strong><br />
              <strong>/${data}:</strong> <span>${helpContent}</span>
            </div>
            `;
        }
        else {
            help = `
            <div class="ipp-chat-command-help">
              <strong><u>Command Help:</u></strong><br />
              <strong>Available Commands:</strong> <span>${Object.keys(window.IdlePixelPlus.customChatCommands).sort().map(s => "/"+s).join(" ")}</span><br />
              <span>Use the /help command for more information about a specific command: /help &lt;command&gt;</span>
            </div>
            `;
        }
         $("#chat-area").append(help);
        if(Chat._auto_scroll) {
            $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
        }
    };

    const SHRUG = "¯\\_(ツ)_/¯";
    window.IdlePixelPlus.registerCustomChatCommand(["shrug", "rshrug"], (command, data='') => {
        data=data.replace(/~/g, " ");
        const margin = SHRUG.length + 1;
        data = data.substring(0, 250-margin);
        window.IdlePixelPlus.sendMessage(`CHAT=${data} ${SHRUG}`);
    }, `Adds a ${SHRUG} to the end of your chat message.<br /><strong>Usage:</strong> /%COMMAND% &lt;message&gt;`);

    window.IdlePixelPlus.registerCustomChatCommand("lshrug", (command, data='') => {
        data=data.replace(/~/g, " ");
        const margin = SHRUG.length + 1;
        data = data.substring(0, 250-margin);
        window.IdlePixelPlus.sendMessage(`CHAT=${SHRUG} ${data}`);
    }, `Adds a ${SHRUG} to the beginning of your chat message.<br /><strong>Usage:</strong> /%COMMAND% &lt;message&gt;`);

    window.IdlePixelPlus.registerCustomChatCommand("clear", (command, data='') => {
        $("#chat-area").empty();
    }, `Clears all messages in chat.`);


    internal.init.call(window.IdlePixelPlus);

})();