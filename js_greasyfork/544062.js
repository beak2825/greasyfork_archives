// ==UserScript==
// @name         FlatMMOPlus
// @namespace    com.dounford.flatmmo
// @version      1.3
// @description  FlatMMO plugin framework
// @author       Dounford adapted from Anwinity IPP
// @match        *://flatmmo.com/play.php*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	const VERSION = "1.3";

    Set.prototype.some = function(predicate) {
        for (const item of this) {
            if (predicate(item)) {
                return true;
            }
        }
        return false;
    };

    Set.prototype.toggle = function(item) {
        if (this.has(item)) {
            this.delete(item)
        } else {
            this.add(item)
        }
    };

	const LOCAL_STORAGE_KEY_DEBUG = "FlatMMOPlus:debug";
 
    const CONFIG_TYPES_LABEL = ["label"];
    const CONFIG_TYPES_PANEL = ["panel"];
    const CONFIG_TYPES_BOOLEAN = ["boolean", "bool", "checkbox"];
    const CONFIG_TYPES_INTEGER = ["integer", "int"];
    const CONFIG_TYPES_FLOAT = ["number", "num", "float"];
    const CONFIG_TYPES_RANGE = ["range"];
    const CONFIG_TYPES_STRING = ["string", "text"];
    const CONFIG_TYPES_SELECT = ["select"];
    const CONFIG_TYPES_COLOR = ["color"];
    const CONFIG_TYPES_LIST = ["list", "array"];
    const CONFIG_TYPES_RELATION = ["relation", "key", "object"];

	const CHAT_COMMAND_NO_OVERRIDE = ["help"];

    //This is used for hot updates
    let plugins = {};
    let panels = {};
    let nextUniqueId = 1;
    let customChatCommands = {
        help: (command, data) => {
            console.log("help", command, data);
        }
    }
    let customChatHelp = {};
    let currentPanel = "inventory";
    let loggedIn = false;
    let isFighting = false;
    let original_onmessage;
    let original_switch_panels;
    let flatnotifications = {};

	if (window.FlatMMOPlus) {
        if(window.FlatMMOPlus.version >= VERSION) {
            return
        }
        plugins = window.FlatMMOPlus.plugins;
        panels = window.FlatMMOPlus.panels;
        nextUniqueId = window.FlatMMOPlus.nextUniqueId;
        customChatCommands = window.FlatMMOPlus.customChatCommands;
        customChatHelp = window.FlatMMOPlus.customChatHelp;
        currentPanel = window.FlatMMOPlus.currentPanel;
        loggedIn = window.FlatMMOPlus.loggedIn;
        isFighting = window.FlatMMOPlus.isFighting;
        original_onmessage = window.FlatMMOPlus.original_onmessage || null;
        original_switch_panels = window.FlatMMOPlus.original_switch_panels || null;
        //This is required for users that have a FMP version lower than 1.0.0
        if (original_onmessage === null) {
            original_onmessage = function(event) {
                if(!event.data.includes("=")) {
                    server_command(event.data, "none");
                    return;
                }
                let array = event.data.split("=");
                let values = array[1].split("~");

                // if(array[0] == "REFRESH_PLAYER" || array[0] == "START_CLIENTSIDE_MOVEMENT") {} else console.log("FROM SERVER: " + event.data);
                server_command(array[0], values)
            }
        }
        if (original_switch_panels === null) {
            original_switch_panels = (id) => {
                //reset btns
                document.getElementById('ui-button-inventory').style.backgroundColor = "";
                document.getElementById('ui-button-skills').style.backgroundColor = "";
                document.getElementById('ui-button-quests').style.backgroundColor = "";
                document.getElementById('ui-button-achievements').style.backgroundColor = "";
                document.getElementById('ui-button-settings').style.backgroundColor = "";
                document.getElementById('ui-button-equipement_stats').style.backgroundColor = "";
                document.getElementById('ui-button-monster_log').style.backgroundColor = "";
                document.getElementById('ui-button-worship').style.backgroundColor = "";
                document.getElementById('ui-button-donor-shop').style.backgroundColor = "";
                document.getElementById('ui-button-database').style.backgroundColor = "";
                

                //hide panels
                document.getElementById('ui-panel-inventory').style.display = "none";
                document.getElementById('ui-panel-skills').style.display = "none";
                document.getElementById('ui-panel-quests').style.display = "none";
                document.getElementById('ui-panel-achievements').style.display = "none";
                document.getElementById('ui-panel-settings').style.display = "none";
                document.getElementById('ui-panel-equipement_stats').style.display = "none";
                document.getElementById('ui-panel-monster_log').style.display = "none";
                document.getElementById('ui-panel-worship').style.display = "none";
                document.getElementById('ui-panel-database').style.display = "none";
                document.getElementById('ui-panel-donor-shop').style.display = "none";
                document.getElementById('ui-panel-hunting').style.display = "none";

                //do what you need
                document.getElementById('ui-panel-' + id).style.display = "";
                if(document.getElementById('ui-button-' + id) != null) {
                    document.getElementById('ui-button-' + id).style.backgroundColor = "pink";
                }
                
                switch(id) {
                    case "settings":
                        refresh_sound_ui_image();
                        refresh_music_ui_image();
                    break;
                }
                Globals.websocket.send('SWITCH_UI_PANEL=' + id);

                play_sound("sounds/menu1.wav");
            }
        }
        
        flatnotifications = window.FlatMMOPlus.notifications || {};
        window.removeEventListener("keypress", window.FlatMMOPlus.fmpKeyPress, false);
        document.getElementById("ui-panel-flatmmoplus").remove();
        document.querySelector(".settings-ui tbody tr:last-child").remove()
	} else {
        document.head.insertAdjacentHTML("beforeend", `<style>
            .displaynone {
                display: none !important;
            }
        </style>`);
        //For some reason I was unable to change the original function, so I just deleted and added a new one
        window.removeEventListener("keypress", keypress_listener, false);
        document.getElementById("chat-text-input").onkeypress = null
        original_onmessage = Globals.websocket.onmessage;
        original_switch_panels = window.switch_panels;
    }

	function logFancy(s, color="#00f7ff") {
		console.log("%cFlatMMOPlus: %c"+s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: silver; font-weight: normal; font-size: 10pt;");
	}

    class AnimationSheetPlus {
        constructor(filename, frames, speed, images) {
            this.filename = filename;
            this.running = false;
            this.frame_at = 0;
            this.FRAMES = frames;
            this.SPEED = speed;
            this.speed_at = 0;
            this.animation_tick_at = animation_tick;
            this.images = []
            for(var i = 1; i <= this.FRAMES; i++) {
                let image = new Image();
                image.src = images[i - 1]
                this.images.push(image);
            }
        }

        get_frame() {
            if(this.FRAMES > 0) {
                if(this.SPEED == this.speed_at) {
                    //swtich frames
                    if(this.animation_tick_at != animation_tick) {
                        this.frame_at++;
                        this.animation_tick_at = animation_tick;
                    }
                    
                    if(this.FRAMES == this.frame_at) {
                        this.frame_at = 0;
                    }
                    this.speed_at = 0;
                } else {
                    this.speed_at++;
                }
                return this.images[this.frame_at];
            } else {
                return this.images[0];
            } 
        }
    }

	class FlatMMOPlusPlugin {

		constructor(id, opts) {
			if(typeof id !== "string") {
				throw new TypeError("FlatMMOPlusPlugin constructor takes the following arguments: (id:string, opts?:object)");
			}
			this.id = id;
			this.opts = opts || {};
			this.config = null;
			this.changedConfigs = new Set();
		}

		getConfig(name) {
			if(!this.config) {
				FlatMMOPlus.loadPluginConfigs(this.id);
			}
			if(this.config) {
				return this.config[name];
			}
		}

		/*
        onConfigsChanged() { }
        onLogin() { }
        onMessageReceived(data) { }
        onChat(data) { }
		onPanelChanged(panelBefore, panelAfter)
        onMapChanged(mapBefore, mapAfter) { }
        onInventoryChanged(inventoryBefore, inventoryAfter) { }
        */
	}

    class FlatMMOPlus {
		constructor() {
			this.version = VERSION;
			this.plugins = plugins;
			this.panels = panels;
			this.debug = false;
			this.nextUniqueId = nextUniqueId;
			this.customChatCommands = customChatCommands
			this.customChatHelp = customChatHelp;
			this.currentPanel = currentPanel;
			this.loggedIn = loggedIn;
            this.isFighting = isFighting;
            this.in_combat_ticker = 0;
            this.currentAction = this.currentAction;
            this.original_onmessage = original_onmessage;
            this.original_switch_panels = original_switch_panels;
            this.notifications = flatnotifications;
            this.level = [
                0,0,108,177,265,380,527,717,956,1254,1622,2068,2605,3245,4000,4885,5913,7100,8464,10022,11794,13799,16060,18599,21442,24614,28145,32063,36400,41191,46470,52277,58652,65637,73279,81625,90728,100642,111424,123135,135841,149611,164516,180634,198047,216840,237105,258938,282440,307721,334893,364077,395399,428994,465003,503577,544871,589054,636300,686794,740732,798320,859775,925326,995213,1069691,1149027,1233503,1323417,1419081,1520824,1628993,1743952,1866086,1995798,2133515,2279683,2434772,2599278,2773721,2958649,3154637,3362289,3582243,3815166,4061762,4322767,4598959,4891153,5200203,5527011,5872521,6237725,6623665,7031436,7462185,7917120,8397507,8904674,9440017,10004999,10601158,11230106,11893534,12593217,13331018,14108890,14928883,15793144,16703929,17663602,18674641,19739647,20861344,22042590,23286382,24595860,25974317,27425202,28952134,30558903,32249481,34028033,35898920,37866713,39936202,42112405,44400579,46806231,49335129,51993317,54787124,57723179,60808425,64050133,67455918,71033752,74791986,78739361,82885031,87238578,91810037,96609909,101649191,106939392,112492559,118321304,124438823,130858933,137596089,144665421,152082764,159864685,168028523,176592418,185575354,194997190,204878707,215241643,226108743,237503800,249451703,261978489,275111393,288878903,303310817,318438300,334293948,350911852,368327667,386578678,405703877,425744040,446741808,468741765,491790534,515936862,541231719,567728396,595482609,624552610,654999299,686886341,720280294,755250734,791870395,830215305,870364937,912402361,956414404,1002491823,1050729473,1101226494,1154086502,1209417785,1267333518,1327951974,1391396753,1457797021,1527287754,1600009999
            ];

			if(localStorage.getItem(LOCAL_STORAGE_KEY_DEBUG) == "1") {
                this.debug = true;
            }
		}
    }

    FlatMMOPlus.prototype.fmpKeyPress = function(e){
        //This should make the dialogs hotkeys work even with flatChat
        if(has_npc_chat_options_modal_open() || has_npc_chat_message_modal_open()) {
            keypress_listener(e);
            return;
        }
        //flatChat handles messages in another way, but checks for custom commands inside it
        if ("flatChat" in window.FlatMMOPlus.plugins) {
            return;
        }
        if(e.keyCode === 13){
            if (chat_ele.value.trim().startsWith("/")) {
                const message = chat_ele.value.trim();
                const space = message.indexOf(" ");
                let command;
                let data;
                if (space <= 0) {
                    command = message.substring(1);
                    data = "";
                } else {
                    command = message.substring(1, space);
                    data = message.substring(space + 1);
                }

                if(command in window.FlatMMOPlus.customChatCommands) {
                    window.FlatMMOPlus.handleCustomChatCommand(command, data);
                    chat_ele.value = "";
                } else {
                    enter_pressed(e);
                }
            } else {
                enter_pressed(e);
            }
        } else {
            keypress_listener(e);
        }
    }
    
	FlatMMOPlus.prototype.registerCustomChatCommand = function(command, f, help) {
        if (Array.isArray(command)) {
            command.forEach(cmd => this.registerCustomChatCommand(cmd, f, help))
            return;
        }
        if(typeof command !== "string" || typeof f !== "function") {
            throw new TypeError("FlatMMOPlus.registerCustomChatCommand takes the following arguments: (command:string, f:function)");
        }
        if(CHAT_COMMAND_NO_OVERRIDE.includes(command)) {
            throw new Error(`Cannot override the following chat commands: ${CHAT_COMMAND_NO_OVERRIDE.join(", ")}`);
        }
        if(command in this.customChatCommands) {
            console.warn(`FlatMMOPlus: re-registering custom chat command "${command}" which already exists.`);
        }
        this.customChatCommands[command] = f;
        if(help && typeof help === "string") {
            this.customChatHelp[command] = help.replace(/%COMMAND%/g, command);
        } else {
            delete this.customChatHelp[command];
        }
    }

    FlatMMOPlus.prototype.handleCustomChatCommand = function(command, message) {
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

    FlatMMOPlus.prototype.uniqueId = function() {
        return this.nextUniqueId++;
    }

    FlatMMOPlus.prototype.setDebug = function(debug) {
        if(debug) {
            this.debug = true;
            localStorage.setItem(LOCAL_STORAGE_KEY_DEBUG, "1");
        }
        else {
            this.debug = false;
            localStorage.removeItem(LOCAL_STORAGE_KEY_DEBUG);
        }
    }

    FlatMMOPlus.prototype.setPluginConfigUIDirty = function(id, dirty, configId) {
        if(typeof id !== "string" || typeof dirty !== "boolean") {
            throw new TypeError("FlatMMOPlus.setPluginConfigUIDirty takes the following arguments: (id:string, dirty:boolean)");
        }
        const plugin = this.plugins[id];
        if(configId) {
            plugin.changedConfigs.add(configId);
        }
        const button = document.getElementById(`flatmmoplus-configbutton-${plugin.id}-apply`);
        if(button) {
            button.disabled = !dirty;
        }
    }

    FlatMMOPlus.prototype.newListField = function(pluginId, configId, text = "New Field") {
        if(typeof pluginId !== "string" || typeof configId !== "string" || typeof text !== "string") {
            throw new TypeError("FlatMMOPlus.newListField takes the following arguments: (id:string, text:string)");
        }
        const plugin = this.plugins[pluginId];
        const parentDiv = document.getElementById(`flatmmoplus-config-${pluginId}-${configId}`);

        const item = document.createElement("div");
        const textDiv = document.createElement("div");
        const closeSpan = document.createElement("span");

        item.className = "fmp-list-item";
        item.addEventListener("dblclick", function(e){
            e.preventDefault();
            textDiv.contentEditable = true;
            textDiv.focus();
        })
        item.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            textDiv.contentEditable = true;
            textDiv.focus();
        });


        textDiv.innerText = text;
        textDiv.spellcheck = false;
        textDiv.autocorrect = false;
        textDiv.addEventListener("focusout", function(e) {
            this.contentEditable = false;
            plugin.changedConfigs.add(configId);
            window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        });

        
        closeSpan.innerText = "×";
        closeSpan.className = "fmp-list-close";
        closeSpan.addEventListener("click", function(){
            item.remove();
            window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        })

        item.appendChild(textDiv);
        item.appendChild(closeSpan);
        parentDiv.appendChild(item);

        parentDiv.scrollTop = parentDiv.scrollHeight;

        plugin.changedConfigs.add(configId);
        window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        if(text = "New Field") {
            textDiv.contentEditable = true;
            textDiv.focus();
        }
    }

    FlatMMOPlus.prototype.newObjectField = function(pluginId, configId, key = "Key", value = "Value") {
        if(typeof pluginId !== "string" || typeof configId !== "string" || typeof key !== "string") {
            throw new TypeError("FlatMMOPlus.newObjectField takes the following arguments: (id:string, key:string, value:string)");
        }
        const plugin = this.plugins[pluginId];
        const parentDiv = document.getElementById(`flatmmoplus-config-${pluginId}-${configId}`);

        const item = document.createElement("div");
        const keyDiv = document.createElement("div");
        const valueDiv = document.createElement("div");
        const closeSpan = document.createElement("span");

        item.className = "fmp-list-item";
        function editField(e) {
            e.preventDefault();
            const el = e.target;
            el.contentEditable = true;
            el.focus();
        }
        keyDiv.ondblclick = (e) => editField(e);
        keyDiv.oncontextmenu = (e) => editField(e);
        valueDiv.ondblclick = (e) => editField(e);
        valueDiv.oncontextmenu = (e) => editField(e);

        keyDiv.innerText = key;
        keyDiv.spellcheck = false;
        keyDiv.autocorrect = false;

        valueDiv.innerText = value;
        valueDiv.spellcheck = false;
        valueDiv.autocorrect = false;

        function focusOut(e) {
            e.preventDefault();
            const el = e.target;
            el.contentEditable = false;
            plugin.changedConfigs.add(configId);
            window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        }
        keyDiv.onblur = (e) => focusOut(e);
        valueDiv.onblur = (e) => focusOut(e);

        closeSpan.innerText = "×";
        closeSpan.className = "fmp-list-close";
        closeSpan.addEventListener("click", function(){
            item.remove();
            window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        })

        item.appendChild(keyDiv);
        item.appendChild(valueDiv);
        item.appendChild(closeSpan);
        parentDiv.appendChild(item);

        parentDiv.scrollTop = parentDiv.scrollHeight;

        plugin.changedConfigs.add(configId);
        window.FlatMMOPlus.setPluginConfigUIDirty(pluginId, true, configId)
        if(key = "Key") {
            keyDiv.contentEditable = true;
            keyDiv.focus();
        }
    }

    FlatMMOPlus.prototype.loadPluginConfigs = function(id) {
        if (typeof id !== "string") {
            throw new TypeError("FlatMMOPlus.reloadPluginConfigs takes the following arguments: (id:string)");
        }
        const plugin = this.plugins[id];
        const config = {};
        let stored;
        try {
            stored = JSON.parse(localStorage.getItem(`flatmmoplus.${id}.config`) || "{}");
        } catch(err) {
            console.error(`Failed to load configs for plugin with id "${id} - will use defaults instead."`);
            stored = {};
        }
        if (plugin.opts.config && Array.isArray(plugin.opts.config)) {
            plugin.opts.config.forEach(cfg => {
                const el = document.getElementById(`flatmmoplus-config-${plugin.id}-${cfg.id}`);
                let value = stored[cfg.id];
                if (value == null || typeof value === "undefined") {
                    value = cfg.default;
                }
                config[cfg.id] = value;

                if (el) {
                    if (CONFIG_TYPES_BOOLEAN.includes(cfg.type) && typeof value === "boolean") {
                        el.checked = value;
                    } else if (CONFIG_TYPES_INTEGER.includes(cfg.type) && typeof value === "number") {
                        el.value = value;
                    } else if (CONFIG_TYPES_FLOAT.includes(cfg.type) && typeof value === "number") {
                        el.value = value;
                    } else if (CONFIG_TYPES_RANGE.includes(cfg.type) && typeof value === "number") {
                        el.value = value;
                        document.getElementById(`flatmmoplus-config-${plugin.id}-${cfg.id}-value`).innerText = value
                    } else if (CONFIG_TYPES_STRING.includes(cfg.type) && typeof value === "string") {
                        el.value = value;
                    } else if (CONFIG_TYPES_SELECT.includes(cfg.type) && typeof value === "string") {
                        el.value = value;
                    } else if (CONFIG_TYPES_COLOR.includes(cfg.type) && typeof value === "string") {
                        el.value = value;
                    } else if (CONFIG_TYPES_LIST.includes(cfg.type)) {
                        el.innerHTML = "";
                        if(typeof value === "string") {
                            value = value.split(",")
                            .map(item => item.trim())
                            .filter(item=> item !== "");
                            if(cfg.unique) {
                                const valuesSet = new Set(value);
                                value = Array.from(valuesSet);
                            }
                            config[cfg.id] = value;
                        }
                        value.forEach(item => {
                            window.FlatMMOPlus.newListField(id, cfg.id, item);
                        })
                    } else if (CONFIG_TYPES_RELATION.includes(cfg.type)) {
                        el.innerHTML = "";
                        for(let item in value) {
                            window.FlatMMOPlus.newObjectField(id, cfg.id, item, value[item]);
                        }
                    } 
                }
            });
        }
        plugin.config = config;
        plugin.changedConfigs.clear();
        this.setPluginConfigUIDirty(id, false);
        if (typeof plugin.onConfigsChanged === "function") {
            plugin.onConfigsChanged();
        }
    }

    FlatMMOPlus.prototype.savePluginConfigs = function(id) {
        if (typeof id !== "string") {
            throw new TypeError("FlatMMOPlus.savePluginConfigs takes the following arguments: (id:string)");
        }
        const plugin = this.plugins[id];
        const config = {};
        if (plugin.opts.config && Array.isArray(plugin.opts.config)) {
            plugin.opts.config.forEach(cfg => {
                const el = document.getElementById(`flatmmoplus-config-${plugin.id}-${cfg.id}`);
                if (CONFIG_TYPES_BOOLEAN.includes(cfg.type)) {
                    config[cfg.id] = el.checked;
                } else if (CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                    config[cfg.id] = parseInt(el.value);
                } else if (CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                    config[cfg.id] = parseFloat(el.value);
                } else if (CONFIG_TYPES_RANGE.includes(cfg.type)) {
                    config[cfg.id] = parseInt(el.value);
                } else if (CONFIG_TYPES_STRING.includes(cfg.type)) {
                    config[cfg.id] = el.value;
                } else if (CONFIG_TYPES_SELECT.includes(cfg.type)) {
                    config[cfg.id] = el.value;
                } else if (CONFIG_TYPES_COLOR.includes(cfg.type)) {
                    config[cfg.id] = el.value;
                } else if (CONFIG_TYPES_LIST.includes(cfg.type)) {
                    let values = [];
                    document.querySelectorAll(`#flatmmoplus-config-${plugin.id}-${cfg.id} div div`).forEach(el => {
                        values.push(el.innerText)
                    })

                    //This will remove duplicates
                    if(cfg.unique) {
                        const valuesSet = new Set(values);
                        values = Array.from(valuesSet);
                    }
                    config[cfg.id] = values;
                } else if (CONFIG_TYPES_RELATION.includes(cfg.type)) {
                    const values = {};
                    document.querySelectorAll(`#flatmmoplus-config-${plugin.id}-${cfg.id}>div`).forEach(el => {
                        values[el.children[0].innerText] = el.children[1].innerText;
                    })

                    config[cfg.id] = values;
                }
            });
        }
        plugin.config = config;
        localStorage.setItem(`flatmmoplus.${id}.config`, JSON.stringify(config));
        this.setPluginConfigUIDirty(id, false);
        if (typeof plugin.onConfigsChanged === "function") {
            plugin.onConfigsChanged();
        }
        plugin.changedConfigs.clear();
    }

    FlatMMOPlus.prototype.addPanel = function(id, title, content) {
        if(typeof id !== "string" || typeof title !== "string" || (typeof content !== "string" && typeof content !== "function") ) {
            throw new TypeError("FlatMMOPlus.addPanel takes the following arguments: (id:string, title:string, content:string|function)");
        }
        const lastPanel = document.querySelector("#ui-panel-worship");
        lastPanel.insertAdjacentHTML("afterend",`
        <div id="ui-panel-${id}" style="display: none" class="ui-panel">
            <div class="ui-panel-title">${title}</div>
            <hr>
            <div id="ui-panel-${id}-content"></div>
        </div>
        `);
        this.panels[id] = {
            id: id,
            title: title,
            content: content
        };
        this.refreshPanel(id);
    }

    FlatMMOPlus.prototype.refreshPanel = function(id) {
        if(typeof id !== "string") {
            throw new TypeError("FlatMMOPlus.refreshPanel takes the following arguments: (id:string)");
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
        const panelContent = document.getElementById(`ui-panel-${id}-content`);
        panelContent.innerHTML = content;
        if(id === "flatmmoplus") {
            this.forEachPlugin(plugin => {
                this.loadPluginConfigs(plugin.id);
            });
        }
    }

    FlatMMOPlus.prototype.registerPlugin = function(plugin) {
        if(!(plugin instanceof FlatMMOPlusPlugin)) {
            throw new TypeError("FlatMMOPlus.registerPlugin takes the following arguments: (plugin:FlatMMOPlusPlugin)");
        }
        if(plugin.id in this.plugins) {
            throw new Error(`FlatMMOPlusPlugin with id "${plugin.id}" is already registered. Make sure your plugin id is unique!`);
        }

        this.plugins[plugin.id] = plugin;
        this.loadPluginConfigs(plugin.id);
        let versionString = plugin.opts&&plugin.opts.about&&plugin.opts.about.version ? ` (v${plugin.opts.about.version})` : "";
        logFancy(`registered plugin "${plugin.id}"${versionString}`);

        //Calls onlogin when the plugin is loaded with delay
        if(this.loggedIn) {
            plugin.onLogin();
        }
    }

    FlatMMOPlus.prototype.forEachPlugin = function(f) {
        if(typeof f !== "function") {
            throw new TypeError("FlatMMOPlus.forEachPlugin takes the following arguments: (f:function)");
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

    FlatMMOPlus.prototype.setPanel = function(panel) {
        if(typeof panel !== "string") {
            throw new TypeError("FlatMMOPlus.setPanel takes the following arguments: (panel:string)");
        }
        window.switch_panels(panel);
    }

    FlatMMOPlus.prototype.sendMessage = function(message) {
        if(typeof message !== "string") {
            throw new TypeError("FlatMMOPlus.sendMessage takes the following arguments: (message:string)");
        }
        if(Globals.websocket && Globals.websocket.readyState == 1) {
            Globals.websocket.send(message);
        }
    }

    FlatMMOPlus.prototype.hideCustomPanels = function() {
        Object.values(this.panels).forEach((panel) => {
            const el = document.getElementById(`ui-panel-${panel.id}`);
            if(el) {
                el.style.display = "none";
            }
        });
    }

    FlatMMOPlus.prototype.onMessageReceived = function(data) {
        if(this.debug) {
            console.log(`FM+ onMessageReceived: ${data}`);
        }
        if(data) {
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onMessageReceived === "function") {
                    plugin.onMessageReceived(data);
                }
            });
            if(data.startsWith("LOGGED_IN")) {
                this.onLogin();

            } else if (data.startsWith("YELL")) {
                const split = data.substring("YELL=".length).split("~");

                const chatData = {
                    username: split[0].split("yelled")[0].trim(),
                    tag: split[1],
                    sigil: split[2],
                    color: split[3],
                    message: split[4],
                    yell: true
                }
                this.onChat(chatData);
            } else if (data.startsWith("CHAT_LOCAL_MESSAGE=")) {
                const split = data.substring("CHAT_LOCAL_MESSAGE=".length).split("~");
                let [sender, message] = split[1].split(" yelled: ");
                //Server messages don't have the "yelled"
                if (!message) {
                    message = sender;
                    sender = "";
                }
                const chatData = {
                    username: sender,
                    tag: "none",
                    sigil: "none",
                    color: split[0],
                    message: message,
                    yell: true
                }
                this.onChat(chatData);

            } else if (data.startsWith("CHAT=")) {
                const split = data.substring("CHAT=".length).split("~");
                
                const chatData = {
                    username: split[0],
                    tag: split[1],
                    sigil: split[2],
                    color: split[3],
                    message: split[4],
                    yell: false
                }
                this.onChat(chatData);
            } else if (data.startsWith("REFRESH_PLAYER_HP_BAR=")) {
                const split = data.substring("REFRESH_PLAYER_HP_BAR=".length).split("~");
                if(split[0] === Globals.local_username) {
                    if(this.isFighting && split[3] === "false") {
                        this.onFightEnded();
                    } else if (!this.isFighting && split[3] === "true") {
                        this.onFightStarted();
                    }
                }
            } else if (data.startsWith(`SET_PLAYER_ANIMATION=${Globals.local_username}`)) {
                const split = data.substring("SET_PLAYER_ANIMATION=".length).split("~");
                this.currentAction = split[1];
                this.onActionChanged();
            } else if (data.startsWith("CUSTOM")) {
                const [sender, content] = data.substring("CUSTOM=".length).split("~");
                let plugin = "unknown";
                let command = "unknown";
                let payload = content;

                const splitContent = content.split(":");
                if (splitContent.length >= 3) {
                    plugin = splitContent[0];
                    command = splitContent[1];
                    payload = splitContent.slice(2).join(":");
                }
                this.onCustomReceived(sender, plugin, command, payload);
            }
        }
    }

    FlatMMOPlus.prototype.onCustomReceived = function(sender, script, command, payload) {
        if(this.debug) {
            console.log(`FMMO+ onCustomReceived: ${sender} ${message}`);
        }

        this.forEachPlugin((plugin) => {
            if (typeof plugin.onCustomReceived === "function") {
                plugin.onCustomReceived(sender, script, command, payload);
            }
        })
    }

    FlatMMOPlusPlugin.prototype.sendCustom = function(user, command, payload) {
        let message = `CUSTOM=${user}~${this.id}`;
        message += command ? `:${command}` : ":ping";
        message += payload ? `:${payload}` : ":";
        window.FlatMMOPlus.sendMessage(message);
    }

    FlatMMOPlus.prototype.sendCustomMessage = function(toPlayer, content) {
        if(this.debug) {
            console.log(`FMMO+ sendCustomMessage`, toPlayer, opts);
        }

        const message = `CUSTOM=${toPlayer}~${content}`;
        this.sendMessage(message);
    }

    FlatMMOPlus.prototype.onLogin = function() {
        if(this.debug) {
            console.log(`FM+ onLogin`);
        }
        logFancy("login detected");
        
        document.getElementById("chat").insertAdjacentHTML("beforeend",`<div style="color: white;">
            <span><strong style="color:cyan">FYI: </strong> Use the /help command to see information on available chat commands.</span>
            <br>
        </div>`)

        this.forEachPlugin((plugin) => {
            if(typeof plugin.onLogin === "function") {
                plugin.onLogin();
            }
        });
        this.loggedIn = true;

        setTimeout(() => {
            Object.defineProperty(players[Globals.local_username], 'in_combat_ticker', {
                get: function() {
                    return FlatMMOPlus.in_combat_ticker;
                },
                set: function(newValue) {
                    FlatMMOPlus.in_combat_ticker = newValue;
                    if(newValue === 0) {
                        window.FlatMMOPlus.onFightEnded();
                    }
                }
            });
        }, 3000);

        //Chat auto scroll is always true for now
        chat_div_element.scrollTop = chat_div_element.scrollHeight;

        const original_paint = window.paint_effects;

        window.paint_effects = function() {
            original_paint();

            try {
                window.FlatMMOPlus.onPaint();
            } catch (error) {
                console.warn("Error on FlatMMO+ onPaint", error.message)
            }
        };

        const originalLayer1 = window.paint_layer_1;
        window.paint_layer_1 = function() {
            originalLayer1();

            try {
                window.FlatMMOPlus.onPaintObjects();
            } catch (error) {
                console.warn("Error on FlatMMO+ paint_layer_1", error.message)
            }
        };

        const originalGroundItems = window.paint_ground_items;
        window.paint_ground_items = function() {
            originalGroundItems();

            try {
                window.FlatMMOPlus.onPaintNpcs();
            } catch (error) {
                console.warn("Error on FlatMMO+ paint_ground_items", error.message)
            }
        };
    }

    FlatMMOPlus.prototype.onChat = function(data) {
        if(this.debug) {
            console.log(`FM+ onChat`, data);
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onChat === "function") {
                plugin.onChat(data);
            }
        });
    }

    FlatMMOPlus.prototype.addNotification = function(name, imageSrc, title = "", text = "", ticks = 900, color = "white") {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            this.notifications[name] = {
                image: img,
                title,
                text,
                color,
                ticks
            }
        }
    }

    FlatMMOPlus.prototype.paintNotifications = function() {
        const PADDING = 10;
        let yOffset = 0;
        let y = 13 * TILE_SIZE;
        for (let notification in this.notifications) {
            const not = this.notifications[notification];
            if(not.ticks <= 0) {
                delete this.notifications[notification];
                return;
            }
            not.ticks--;
            ctx.font = "20px serif";
            ctx.fillStyle = "white";
            ctx.globalAlpha = 0.2;
            ctx.fillRect(21 * TILE_SIZE, y - yOffset, TILE_SIZE * 3 - PADDING, TILE_SIZE - PADDING);
            ctx.globalAlpha = 1.0;
            ctx.drawImage(not.image, 21 * TILE_SIZE + PADDING, y + 10 - yOffset, 32, 32); 
            ctx.fillStyle = not.color;
            ctx.fillText(not.title, 21 * TILE_SIZE + 50, y + 20 - yOffset);
            ctx.font = "16px serif";
            ctx.fillText(not.text, 21 * TILE_SIZE + 50, y + 40 - yOffset);
            yOffset += TILE_SIZE;
        }
    }

    //After vanilla paint
    FlatMMOPlus.prototype.onPaint = function() {
        if(this.debug) {
            console.log("FM+ onPaint");
        }

        this.forEachPlugin((plugin) => {
            if(typeof plugin.onPaint === "function") {
                plugin.onPaint();
            }
        });

        this.paintNotifications();
    }

    //Between paint_layer_1 and paint_map_objects_lower_shadows
    FlatMMOPlus.prototype.onPaintObjects = function() {
        if(this.debug) {
            console.log("FM+ onPaintObjects");
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onPaintObjects === "function") {
                plugin.onPaintObjects();
            }
        });
    }

    //Between paint_ground_items and paint_npcs
    FlatMMOPlus.prototype.onPaintNpcs = function() {
        if(this.debug) {
            console.log("FM+ onPaintNpcs");
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onPaintNpcs === "function") {
                plugin.onPaintNpcs();
            }
        });
    }

    FlatMMOPlus.prototype.onPanelChanged = function(panelBefore, panelAfter) {
        if(this.debug) {
            console.log(`FM+ onPanelChanged "${panelBefore}" -> "${panelAfter}"`);
        }
        if(panelAfter === "flatmmoplus") {
            this.refreshPanel("flatmmoplus");
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onPanelChanged === "function") {
                plugin.onPanelChanged(panelBefore, panelAfter);
            }
        });
    }

    FlatMMOPlus.prototype.onMapChanged = function(mapBefore, mapAfter) {
        if(this.debug) {
            console.log(`FMMO+ onMapChanged "${mapBefore}" -> "${mapAfter}"`);
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onMapChanged === "function") {
                plugin.onMapChanged(mapBefore, mapAfter);
            }
        });
    }

    FlatMMOPlus.prototype.onInventoryChanged = function(inventoryBefore, inventoryAfter) {
        if(this.debug) {
            console.log(`FMMO+ onInventoryChanged "${inventoryBefore}" -> "${inventoryAfter}"`);
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onInventoryChanged === "function") {
                plugin.onInventoryChanged(inventoryBefore, inventoryAfter);
            }
        });
    }

    FlatMMOPlus.prototype.onFightStarted = function() {
        if(this.debug) {
            console.log(`FMMO+ onFightStarted`);
        }
        this.isFighting = true;
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onFightStarted === "function") {
                plugin.onFightStarted();
            }
        });
    }
    
    FlatMMOPlus.prototype.onFightEnded = function() {
        if(this.debug) {
            console.log(`FMMO+ onFightEnded`);
        }
        this.isFighting = false;
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onFightEnded === "function") {
                plugin.onFightEnded();
            }
        });
    }

    FlatMMOPlus.prototype.onActionChanged = function() {
        if(this.debug) {
            console.log(`FMMO+ onActionChanged`);
        }
        this.forEachPlugin((plugin) => {
            if(typeof plugin.onActionChanged === "function") {
                plugin.onActionChanged();
            }
        });
    }

    FlatMMOPlus.prototype.init = function(){
        //Tries to hook into the websocket messages
        const hookIntoOnMessage = () => {
            try {
                if (typeof this.original_onmessage === "function") {
                    Globals.websocket.onmessage = (event) => {
                        if(event.data.startsWith("SET_MAP")) {
                            const mapBefore = current_map;
                            this.original_onmessage(event);
                            const mapAfter = current_map;
                            this.onMapChanged(mapBefore, mapAfter);
                            return;
                        } else if (event.data.startsWith("SET_INVENTORY_ITEMS")) {
                            const inventoryBefore = items;
                            this.original_onmessage(event);
                            const inventoryAfter = items;
                            this.onInventoryChanged(inventoryBefore, inventoryAfter);
                            return;
                        }
                        this.original_onmessage(event);
                        this.onMessageReceived(event.data);
                    }
                }
                return true;
            } catch (err) {
                console.error("Had trouble hooking into websocket...");
                return false;
            }
        }
        //This will call itthis
        (function(){
            if(!hookIntoOnMessage()) {
                // try once more
                setTimeout(hookIntoOnMessage, 40);
            }
        })()


        window.addEventListener("keypress", this.fmpKeyPress, false);

        // hook into switch_panels, which is called when the main panel is changed. This is used for custom panels.
        window.switch_panels = (id) => {
            let panelBefore = this.currentPanel;
            this.hideCustomPanels();
            this.original_switch_panels(id);
            this.currentPanel = id;
            let panelAfter = id;
            this.onPanelChanged(panelBefore, panelAfter);
        }

        // create plugin menu item and panel
        const settingsBody = document.querySelector(".settings-ui tbody")
        settingsBody.insertAdjacentHTML("beforeend",`<tr onclick="FlatMMOPlus.setPanel('flatmmoplus')">
            <td colspan="2" style="cursor: pointer;text-align: center;font-size: 2rem;font-weight: bold;">PLUGINS</td>
        </tr>`)

        this.addPanel("flatmmoplus", "FlatMMO+ Plugins", () => {
            let content = `<style>
                #ui-panel-flatmmoplus {
                    height: 550px;
                    overflow-y: scroll;
                    scrollbar-width: thin;
                    text-align: justify;

                    textarea {
                        width: -webkit-fill-available;
                        width: -moz-available;
                        width: stretch;
                        resize: none;
                    }

                    input[type=checkbox] {
                        -webkit-appearance: none;
                        appearance: none;
                        position: relative;
                        width: 20px;
                        height: 10px;
                        border-radius: 15px;
                        background-color: #ccc;
                        outline: none;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        top: 0.5rem
                    }

                    input[type=checkbox]::before {
                        content: '';
                        position: absolute;
                        top: 1px;
                        left: 1px;
                        width: 8px;
                        height: 8px;
                        background-color: #fff;
                        border-radius: 50%;
                        transition: transform 0.3s;
                    }

                    input[type=checkbox]:checked {
                        background-color: #4CAF50;
                    }

                    input[type=checkbox]:checked::before {
                        transform: translateX(10px);
                    }

                    label {
                        font-size: 1.17em;
                        font-weight: bold;
                    }
                }
                .flatmmoplus-plugin-config-section >div {
                    margin: 5px 0;
                }
                .fmp-list-div {
                    max-height: calc(5em + 60px);
                    overflow-y: auto;
                }
                .fmp-list-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    div {
                        width: 100%;
                        padding: 5px;
                    }
                }
                .fmp-list-item:nth-child(odd) {
                    background-color: rgba(0, 0, 0, 0.3);
                }
                .fmp-list-close {
                    cursor: pointer;
                    float: right;
                }
                .fmp-objectLabel {
                    display: grid;
                    grid-template-columns: auto auto;
                    justify-items: center;
                }
            </style>`;
            this.forEachPlugin(plugin => {
                let id = plugin.id;
                let name = "An FlatMMO+ Plugin!";
                let description = "";
                let author = "unknown";
                if(plugin.opts.about) {
                    let about = plugin.opts.about;
                    name = about.name || name;
                    description = about.description || description;
                    author = about.author || author;
                }
                content += `
                <div id="flatmmoplus-plugin-box-${id}" class="flatmmoplus-plugin-box">
                    <div style="display:flex" align-items:center;>
                        <div>
                            <strong><u>${name||id}</u></strong><br>(by ${author})<br />
                            <span>${description}</span><br />
                        </div>
                        ${plugin.opts.config ? `<div class="flatmmoplus-plugin-settings-button">
                        <button onclick="document.querySelector('#flatmmoplus-plugin-box-${id} .flatmmoplus-plugin-config-section').classList.toggle('displaynone')">Settings</button>
                    </div>` : ""}
                    </div>
                    <div class="flatmmoplus-plugin-config-section displaynone">
                        <hr style="grid-column: span 2">
                `;
                if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                    plugin.opts.config.forEach(cfg => {
                        if(CONFIG_TYPES_LABEL.includes(cfg.type)) {
                            content += `<h5 style="grid-column: span 2; margin-bottom: 0; font-weight: 600">${cfg.label}</h5>`;
                        } else if (CONFIG_TYPES_PANEL.includes(cfg.type)) {
                            content += `<div onclick="FlatMMOPlus.setPanel('${cfg.panel}')" style="cursor: pointer;">
                                <h2 style="text-align: center;">${cfg.label}</h2>
                            </div>`
                        } else if(CONFIG_TYPES_BOOLEAN.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <input id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="checkbox" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}')" />
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <input id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="number" step="1" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}')" />
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <input id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="number" step="${cfg.step || ''}" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}');" />
                                </div>
                                `;
                        } else if (CONFIG_TYPES_RANGE.includes(cfg.type)) {
                            content += `<div>
                                <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                <div>
                                    <input id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="range" step="${cfg.step || ''}" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}');" oninput="document.getElementById('flatmmoplus-config-${plugin.id}-${cfg.id}-value').innerText = this.value" />
                                    <span id="flatmmoplus-config-${plugin.id}-${cfg.id}-value"></span>
                                </div>
                            </div>`;
                        }
                        else if(CONFIG_TYPES_STRING.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <textarea id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="text" maxlength="${cfg.max || ''}" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}')" rows="5" autocomplete="off" spellcheck="false"></textarea>
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_COLOR.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <input id="flatmmoplus-config-${plugin.id}-${cfg.id}" type="color" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true, '${cfg.id}')" />
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_LIST.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label>${cfg.label || cfg.id}</label>
                                    <div class="fmp-list-div" id="flatmmoplus-config-${plugin.id}-${cfg.id}"></div>
                                    <button style="cursor:pointer;font-size: 1rem;" onclick="FlatMMOPlus.newListField('${plugin.id}', '${cfg.id}')">Add new field</button>
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_RELATION.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label>${cfg.label || cfg.id}</label>
                                    <div class="fmp-objectLabel">
                                        <label>${cfg.key || "Key"}</label>
                                        <label>${cfg.value || "Value"}</label>
                                    </div>
                                    <div class="fmp-list-div" id="flatmmoplus-config-${plugin.id}-${cfg.id}"></div>
                                    <button style="cursor:pointer;font-size: 1rem;" onclick="FlatMMOPlus.newObjectField('${plugin.id}', '${cfg.id}')">Add new field</button>
                                </div>
                                `;
                        }
                        else if(CONFIG_TYPES_SELECT.includes(cfg.type)) {
                            content += `
                                <div>
                                    <label for="flatmmoplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    <div>
                                        <select id="flatmmoplus-config-${plugin.id}-${cfg.id}" onchange="FlatMMOPlus.setPluginConfigUIDirty('${id}', true,'${cfg.id}')">
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
                                </div>`;
                        }
                    });
                    content += `
                    <div style="grid-column: span 2">
                        <button id="flatmmoplus-configbutton-${plugin.id}-reload" onclick="FlatMMOPlus.loadPluginConfigs('${id}')">Reload</button>
                        <button id="flatmmoplus-configbutton-${plugin.id}-apply" onclick="FlatMMOPlus.savePluginConfigs('${id}')">Apply</button>
                    </div>
                    `;
                }
                content += "</div>";
                content += "</div>";
            });

            return content;
        });
        
        logFancy(`(v${this.version}) initialized.`);
        if(this.loggedIn === false && Object.keys(item_sell_prices).length !== 0) {
            this.onLogin();
        }
    }

    FlatMMOPlus.prototype.upDateSelf = async function(){
        try {
            let script;
            await fetch('https://scripts.dounford.tech/scripts/fmp').then(async (response) => {
                script = await response.text()
                script = JSON.parse(script);
            })

            const scriptTag = document.createElement("script");
			scriptTag.textContent = script.code;
			document.head.appendChild(scriptTag);
        } catch(err) {
            console.error("FMP was not loaded, please reload the page")
        }
    }

	// Add to window and init
    window.AnimationSheetPlus = AnimationSheetPlus;
    window.FlatMMOPlusPlugin = FlatMMOPlusPlugin;
    window.FlatMMOPlus = new FlatMMOPlus();

	window.FlatMMOPlus.customChatCommands["help"] = (command, data='') => {
        let help;
        if(data && data!="help") {
            let helpContent = window.FlatMMOPlus.customChatHelp[data.trim()] || "No help content was found for this command.";
			help = `<div style="color: white;">
              	<strong><u>Command Help:</u></strong><br />
				<span><strong style="color:cyan">/${data}:</strong> <span>${helpContent}</span>
				<br>`
        }
        else {
			help = `<div style="color: white;">
              	<strong><u>Command Help:</u></strong><br />
              	<strong>Available Commands:</strong> <span>${Object.keys(window.FlatMMOPlus.customChatCommands).sort().map(s => "/"+s).join(" ")}</span><br />
              	<span>Use the /help command for more information about a specific command: /help &lt;command&gt;</span>
			</div>`
        }
		if (window.FlatMMOPlus.plugins.hasOwnProperty("flatChat")) {
			window.FlatMMOPlus.plugins.flatChat.showWarning(help, "white");
		} else {
			document.getElementById("chat").insertAdjacentHTML("beforeend",help)
		}
        //Chat auto scroll is always true for now
		chat_div_element.scrollTop = chat_div_element.scrollHeight;
    };

	//flatChat overrides this
	window.FlatMMOPlus.registerCustomChatCommand(["clear", "clean"], (command, data='') => {
        document.getElementById("chat").innerHTML = "";
    }, "Clears all messages in chat.");

	window.FlatMMOPlus.registerCustomChatCommand(["y", "yell"], (command, data='') => {
        Globals.websocket.send('CHAT=/yell ' + data);
    }, "Chat to everyone on server.<br><strong>Usage:</strong> /yell [message]");

	window.FlatMMOPlus.registerCustomChatCommand("pm", (command, data='') => {
        Globals.websocket.send('CHAT=/pm ' + data);
    }, "Send a private message to someone.<br><strong>Usage:</strong> /pm [username] [message]");

	window.FlatMMOPlus.registerCustomChatCommand("stuck", (command, data='') => {
        Globals.websocket.send('CHAT=/stuck');
    }, "`Use if your character is stuck and cannot move.");

    window.FlatMMOPlus.registerCustomChatCommand(["players","who"], (command, data='') => {
        Globals.websocket.send('CHAT=/players');
    }, "Show all players online.");

	window.FlatMMOPlus.init();
	window.FlatMMOPlus.upDateSelf();
})();