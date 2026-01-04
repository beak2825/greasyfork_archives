// ==UserScript==
// @name         StakeUsPlus
// @namespace    a
// @version      2.1
// @description  StakeUs plugin framework
// @author       diehard2k0
// @match        *://stake.us/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = "1.0";

    if (window.StakeUsPlus) {
        // already loaded
        return;
    }

    const LOCAL_STORAGE_KEY_DEBUG = "StakeUsPlus:debug";
    const INFO = {};

    const CONFIG_TYPES_LABEL = ["label"];
    const CONFIG_TYPES_BOOLEAN = ["boolean", "bool", "checkbox"];
    const CONFIG_TYPES_INTEGER = ["integer", "int"];
    const CONFIG_TYPES_FLOAT = ["number", "num", "float"];
    const CONFIG_TYPES_STRING = ["string", "text"];
    const CONFIG_TYPES_SELECT = ["select"];
    const CONFIG_TYPES_COLOR = ["color"];

    function logFancy(s, color = "#00f7ff") {
        console.log("%cStakeUsPlus: %c" + s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: black; font-weight: normal; font-size: 10pt;");
    }

    class StakeUsPlusPlugin {

        constructor(id, opts) {
            if (typeof id !== "string") {
                throw new TypeError("StakeUsPlusPlugin constructor takes the following arguments: (id:string, opts?:object)");
            }
            this.id = id;
            this.opts = opts || {};
            this.config = null;
        }

        getConfig(name) {
            if (!this.config) {
                StakeUsPlus.loadPluginConfigs(this.id);
            }
            if (this.config) {
                return this.config[name];
            }
        }
    }

    const internal = {
        init() {
            const self = this;
            //document.querySelector("#svelte > div.wrap.svelte-sizi7f > div.main-content.svelte-sizi7f > div.navigation.svelte-1ekwux9 > div > div > div > div.balance-toggle.svelte-1rik8j6")

            $("#svelte > div.wrap.svelte-sizi7f > div.main-content.svelte-sizi7f > div.navigation.svelte-1ekwux9 > div > div > div > div.balance-toggle.svelte-1rik8j6").append(`
                <style>
                    .plugin-button {
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 9999;
                    }
                    .plugin-panel {
                        display: none;
                        position: fixed;
                        bottom: 70px;
                        right: 20px;
                        z-index: 9999;
                        background-color: white;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        padding: 10px;
                        max-height: 300px;
                        overflow-y: auto;
                    }
                </style>
                <button class="button variant-action size-sm align-left svelte-1pcg5q8" style="border-radius: 0 var(--border-radius-0-25) var(--border-radius-0-25) 0;" data-analytics="global-navbar-wallet-button" onclick="StakeUsPlus.togglePluginPanel()">
    <span class="content-or-loader svelte-kgkwgo">
        <span>Plugins</span>
    </span>
</button>
            `);

            // Event listener for the plugin button
            $('.plugin-button').on('click', function() {
                self.togglePluginPanel();
            });
        },

        togglePluginPanel() {
            $('.plugin-panel').toggle();
            if ($('.plugin-panel').is(':visible')) {
                this.populatePluginPanel();
            }
        },

        populatePluginPanel() {
            const plugins = window.StakeUsPlus.plugins;
            const panel = $('.plugin-panel');
            panel.empty();
            panel.append(self.addPanel("stakeusplus", "StakeUs+ Plugins", function() {
                let content = `
                <style>
                    .stakeusplus-plugin-box {
                        display: block;
                        position: relative;
                        padding: 0.25em;
                        color: white;
                        background-color: rgb(107, 107, 107);
                        border: 1px solid black;
                        border-radius: 6px;
                        margin-bottom: 0.5em;
                    }
                    .stakeusplus-plugin-box .stakeusplus-plugin-settings-button {
                        position: absolute;
                        right: 2px;
                        top: 2px;
                        cursor: pointer;
                    }
                    .stakeusplus-plugin-box .stakeusplus-plugin-config-section {
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
                    logFancy("Added Plugin " + id)
                    let name = "An StakeUs+ Plugin!";
                    let description = "";
                    let author = "unknown";
                    if(plugin.opts.about) {
                        let about = plugin.opts.about;
                        name = about.name || name;
                        description = about.description || description;
                        author = about.author || author;
                    }

                    content += `
                    <div class="stakeusplus-plugin-box" id="stakeusplus-plugin-box-${id}" class="stakeusplus-plugin-box" >
                        <strong><u>${name||id}</u></strong> (by ${author})<br />
                        <span>${description}</span><br />
                        <div class="stakeusplus-plugin-config-section" style="display: none">
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
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="stakeusplus-config-${plugin.id}-${cfg.id}" type="checkbox" style="width:10px;height:10px;appearance:auto;" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="stakeusplus-config-${plugin.id}-${cfg.id}" style="background:#0f4553;" type="number" step="1" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="stakeusplus-config-${plugin.id}-${cfg.id}" style="background:#0f4553;" type="number" step="${cfg.step || ''}" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_STRING.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="stakeusplus-config-${plugin.id}-${cfg.id}" style="background:#0f4553;" type="text" maxlength="${cfg.max || ''}" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_COLOR.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="stakeusplus-config-${plugin.id}-${cfg.id}" style="background:#0f4553;" type="color" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_SELECT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="stakeusplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <select style="background:#0f4553;" id="stakeusplus-config-${plugin.id}-${cfg.id}" onchange="StakeUsPlus.setPluginConfigUIDirty('${id}', true)">
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
                            <button id="stakeusplus-configbutton-${plugin.id}-reload" onclick="StakeUsPlus.loadPluginConfigs('${id}')">Reload</button>
                            <button id="stakeusplus-configbutton-${plugin.id}-apply" style="" onclick="StakeUsPlus.savePluginConfigs('${id}')">Apply</button>
                        </div>
                        `;
                    }
                    content += "</div>";
                    if(plugin.opts.config) {
                        content += `
                        <div class="stakeusplus-plugin-settings-button">
                            <button onclick="$('#stakeusplus-plugin-box-${id} .stakeusplus-plugin-config-section').toggle()">Settings</button>
                        </div>`;
                    }
                    content += "</div>";
                });

                return content;
            }));

            $("#chat-area-input").attr("autocomplete", "off");

            logFancy(`(v${self.version}) initialized.`);
        }
    };

    class StakeUsPlus {

        constructor() {
            this.version = VERSION;
            this.plugins = {};
            this.panels = {};
            this.debug = true;
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
        togglePluginPanel() {
            internal.togglePluginPanel();
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

        setPluginConfigUIDirty(id, dirty) {
            if(typeof id !== "string" || typeof dirty !== "boolean") {
                throw new TypeError("StakeUsPlus.setPluginConfigUIDirty takes the following arguments: (id:string, dirty:boolean)");
            }
            const plugin = this.plugins[id];
            const button = $(`#stakeusplus-configbutton-${plugin.id}-apply`);
            if(button) {
                if(button.attr("style") === "" && button.attr("disabled") == null) {button.prop("style", "text-decoration:line-through")} else {button.prop("style", "")}
                button.prop("disabled", !(dirty));

            }
        }

        loadPluginConfigs(id) {
            if(typeof id !== "string") {
                throw new TypeError("StakeUsPlus.reloadPluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            let stored;
            try {
                stored = JSON.parse(localStorage.getItem(`stakeusplus.${id}.config`) || "{}");
            }
            catch(err) {
                console.error(`Failed to load configs for plugin with id "${id} - will use defaults instead."`);
                stored = {};
            }
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#stakeusplus-config-${plugin.id}-${cfg.id}`);
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
                throw new TypeError("StakeUsPlus.savePluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#stakeusplus-config-${plugin.id}-${cfg.id}`);
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
            localStorage.setItem(`stakeusplus.${id}.config`, JSON.stringify(config));
            this.setPluginConfigUIDirty(id, false);
            if(typeof plugin.onConfigsChanged === "function") {
                plugin.onConfigsChanged();
            }
        }

        addPanel(id, title, content) {
            if(typeof id !== "string" || typeof title !== "string" || (typeof content !== "string" && typeof content !== "function") ) {
                throw new TypeError("StakeUsPlus.addPanel takes the following arguments: (id:string, title:string, content:string|function)");
            }
            const panels = $("#svelte > div.draggable.svelte-uhzn2f");
            panels.append(`
            <div data-layout class="svelte-uhzn2f" id="panel-${id}">
                <h1>${title}</h1>
                <hr>
                <div class="stakeusplus-panel-content"></div>
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
                throw new TypeError("StakeUsPlus.refreshPanel takes the following arguments: (id:string)");
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
            const panelContent = $(`#panel-${id} .stakeusplus-panel-content`);
            panelContent.html(content);
            if(id === "stakeusplus") {
                this.forEachPlugin(plugin => {
                    this.loadPluginConfigs(plugin.id);
                });
            }
        }

        registerPlugin(plugin) {
            if(!(plugin instanceof StakeUsPlusPlugin)) {
                throw new TypeError("StakeUsPlus.registerPlugin takes the following arguments: (plugin:StakeUsPlusPlugin)");
            }
            if(plugin.id in this.plugins) {
                throw new Error(`StakeUsPlusPlugin with id "${plugin.id}" is already registered. Make sure your plugin id is unique!`);
            }

            this.plugins[plugin.id] = plugin;
            this.loadPluginConfigs(plugin.id);
            let versionString = plugin.opts&&plugin.opts.about&&plugin.opts.about.version ? ` (v${plugin.opts.about.version})` : "";
            logFancy(`registered plugin "${plugin.id}"${versionString}`);
        }

        forEachPlugin(f) {
            if(typeof f !== "function") {
                throw new TypeError("StakeUsPlus.forEachPlugin takes the following arguments: (f:function)");
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

        onPanelChanged(panelBefore, panelAfter) {
            if(this.debug) {
                console.log(`SU+ onPanelChanged "${panelBefore}" -> "${panelAfter}"`);
            }
            if(panelAfter === "stakeusplus") {
                this.refreshPanel("stakeusplus");
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onPanelChanged === "function") {
                    plugin.onPanelChanged(panelBefore, panelAfter);
                }
            });
        }

    }

    // Add to window and init
    window.StakeUsPlusPlugin = StakeUsPlusPlugin;
    window.StakeUsPlus = new StakeUsPlus();

    setTimeout(function() {
        internal.init.call(window.StakeUsPlus);
    }, 5000);
    //internal.init.call(window.StakeUsPlus);

})();