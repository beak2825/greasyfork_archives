// ==UserScript==
// @name         PokeClicker+
// @namespace    pokeclicker.com
// @version      1.0.0
// @description  PokeClicker plugin framework
// @author       TwoCon
// @match         *://www.pokeclicker.com/*
// @icon          https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant         none
// ==/UserScript==

(function() {
    'use strict';
    const VERSION = "1.0.0";

    if(window.PokeClickerPlus) {
        // already loaded
        return;
    }

    const LOCAL_STORAGE_KEY_DEBUG = "PokeClickerPlus:debug";

    const CONFIG_TYPES_LABEL = ["label"];
    const CONFIG_TYPES_BOOLEAN = ["boolean", "bool", "checkbox"];
    const CONFIG_TYPES_INTEGER = ["integer", "int"];
    const CONFIG_TYPES_FLOAT = ["number", "num", "float"];
    const CONFIG_TYPES_STRING = ["string", "text"];
    const CONFIG_TYPES_SELECT = ["select"];
    const CONFIG_TYPES_COLOR = ["color"];


    function logFancy(s, color="#00f7ff") {
        console.log("%cPokeClickerPlus: %c"+s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: black; font-weight: normal; font-size: 10pt;");
    }

    class PokeClickerPlusPlugin {

        constructor(id, opts) {
            if(typeof id !== "string") {
                throw new TypeError("PokeClickerPlusPlugin constructor takes the following arguments: (id:string, opts?:object)");
            }
            this.id = id;
            this.opts = opts || {};
            this.config = null;
        }

        getConfig(name) {
            if(!this.config) {
                PokeClickerPlus.loadPluginConfigs(this.id);
            }
            if(this.config) {
                return this.config[name];
            }
        }
    }

    const internal = {
        init() {
            const self = this;

            $("body").append(`
<div class="modal fade noselect" id="pluginModal" tabindex="-1" role="dialog" aria-labelledby="pluginModalLabel">
<div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
   <div class="modal-content">
       <div class="modal-header">
           <h5 class="modal-title">Plugins</h5>
               <button type="button" class="btn mr-auto"
                    data-bind="tooltip: {
                        title: 'Plugins',
                        trigger: 'hover',
                        placement:'top',
                        html: true,
                    }">ⓘ</button>
           <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
           </button>
       </div>
       <div class="modal-body">
<div data-bind="foreach: Object.entries(BadgeCaseController.getDisplayableBadges())">
                </div>
            </div>
        </div>

       <div class="modal-footer">
           <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
       </div>
   </div>
</div>
</div>



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
            //const lastMenuItem = document.querySelector("#startMenu > ul > li:nth-child(1)");
            /*lastMenuItem.before(`
            <li>
            <a class="dropdown-item" href="#Test" data-toggle="modal">Plugins</a>
            </li>
            `);*/

            // TESTING
            var scriptElement = document.createElement('div')
            scriptElement.id = 'scriptHandler'
            document.body.appendChild(scriptElement)
            function loadSettings(){
                var addSettings = setInterval(function(){
                    try{
                        //Fixes the Scripts nav item getting wrapped to the bottom by increasing the max width of the window
                        document.getElementById('settingsModal').querySelector('div').style.maxWidth = '850px'

                        //Select the top header row of tabs in Settings
                        const settingTabs = document.querySelector("#startMenu > ul");

                        //Create and append the new tab for scripts to Settings
                        let scriptFrag = new DocumentFragment();
                        let li = document.createElement('li');
                        //li.classList.add('nav-item');
                        li.innerHTML = `<a class="dropdown-item" href="#pluginModal" data-toggle="modal">Plugins</a>`;
                        scriptFrag.appendChild(li);
                        settingTabs.appendChild(scriptFrag);

                        //Select the parent element that contains the content of the tabs
                        const tabContent = document.querySelectorAll('.tab-content')[3];

                        //Create and append the content for the script tab to Settings
                        scriptFrag = new DocumentFragment();
                        let div = document.createElement('biv');
                        div.classList.add('tab-pane');
                        div.setAttribute('id', 'pokeplugs')

                        //Add the table and tbody elements to match the other tabs
                        const scriptTabContent =
                              `<table class="table table-striped table-hover m-0"><tbody></tbody></table>`
                div.innerHTML = `${scriptTabContent}`;
                        scriptFrag.appendChild(div);
                        tabContent.appendChild(scriptFrag);

                        //Add a setting to enable each script in the scripts settings menu
                        document.getElementById('scriptHandler').childNodes.forEach(childNode => {
                            var setting = document.createElement('tr')
                            setting.innerHTML =
                                `<td class="p-2">
                            <label class="m-0">Enable ` + childNode.id + `</label>
                        </td>
                        <td class="p-2 tight">
                            <input id="Toggle-`+ childNode.id + `" type="checkbox">
                        </td>`

                    document.getElementById('pokeplugs').querySelector('table tbody').prepend(setting)
                    //Check if the checkbox should be filled or not
                    document.getElementById('Toggle-'+ childNode.id).checked = localStorage.getItem(childNode.id) == 'true' ? true : false
                    document.getElementById('Toggle-'+ childNode.id).addEventListener('change', event => {
                        if (event.target.checked == false) {
                            localStorage.setItem(childNode.id, "false");
                        } else {
                            localStorage.setItem(childNode.id, "true");
                        }
                    });
                })
                        //Add info about restarting to the top
                        var info = document.createElement('tr')
                        info.innerHTML =
                            `<td class="p-2">
                        <label class="m-0">The script settings will take effect on restart</label>
                    </td>`
                document.getElementById('pokeplugs').querySelector('table tbody').prepend(info)

                        clearInterval(addSettings)
                    } catch(err) { }
                }, 100)
                logFancy("Settings Loaded");
            }




            loadSettings()
            // END TESTING


            self.addPanel("pokeclickerplus", "PokeClicker+ Plugins", function() {
                let content = `
                <style>
                    .pokeclickerplus-plugin-box {
                        display: block;
                        position: relative;
                        padding: 0.25em;
                        color: white;
                        background-color: rgb(107, 107, 107);
                        border: 1px solid black;
                        border-radius: 6px;
                        margin-bottom: 0.5em;
                    }
                    .pokeclickerplus-plugin-box .pokeclickerplus-plugin-settings-button {
                        position: absolute;
                        right: 2px;
                        top: 2px;
                        cursor: pointer;
                    }
                    .pokeclickerplus-plugin-box .pokeclickerplus-plugin-config-section {
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
                    let name = "A PokeClicker+ Plugin!";
                    let description = "";
                    let author = "unknown";
                    if(plugin.opts.about) {
                        let about = plugin.opts.about;
                        name = about.name || name;
                        description = about.description || description;
                        author = about.author || author;
                    }
                    content += `
                    <div id="pokeclickerplus-plugin-box-${id}" class="pokeclickerplus-plugin-box">
                        <strong><u>${name||id}</u></strong> (by ${author})<br />
                        <span>${description}</span><br />
                        <div class="pokeclickerplus-plugin-config-section" style="display: none">
                            <hr style="grid-column: span 2">
                    `;
                    logFancy("Adding Plugin" & name)
                    if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                        plugin.opts.config.forEach(cfg => {
                            if(CONFIG_TYPES_LABEL.includes(cfg.type)) {
                                content += `<h5 style="grid-column: span 2; margin-bottom: 0; font-weight: 600">${cfg.label}</h5>`;
                            }
                            else if(CONFIG_TYPES_BOOLEAN.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="pokeclickerplus-config-${plugin.id}-${cfg.id}" type="checkbox" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_INTEGER.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="pokeclickerplus-config-${plugin.id}-${cfg.id}" type="number" step="1" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_FLOAT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="pokeclickerplus-config-${plugin.id}-${cfg.id}" type="number" step="${cfg.step || ''}" min="${cfg.min || ''}" max="${cfg.max || ''}" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_STRING.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="pokeclickerplus-config-${plugin.id}-${cfg.id}" type="text" maxlength="${cfg.max || ''}" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_COLOR.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <input id="pokeclickerplus-config-${plugin.id}-${cfg.id}" type="color" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)" />
                                    </div>
                                    `;
                            }
                            else if(CONFIG_TYPES_SELECT.includes(cfg.type)) {
                                content += `
                                    <div>
                                        <label for="pokeclickerplus-config-${plugin.id}-${cfg.id}">${cfg.label || cfg.id}</label>
                                    </div>
                                    <div>
                                        <select id="pokeclickerplus-config-${plugin.id}-${cfg.id}" onchange="PokeClickerPlus.setPluginConfigUIDirty('${id}', true)">
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
                            <button id="pokeclickerplus-configbutton-${plugin.id}-reload" onclick="PokeClickerPlus.loadPluginConfigs('${id}')">Reload</button>
                            <button id="pokeclickerplus-configbutton-${plugin.id}-apply" onclick="PokeClickerPlus.savePluginConfigs('${id}')">Apply</button>
                        </div>
                        `;
                    }
                    content += "</div>";
                    if(plugin.opts.config) {
                        content += `
                        <div class="pokeclickerplus-plugin-settings-button">
                            <button onclick="$('#pokeclickerplus-plugin-box-${id} .pokeclickerplus-plugin-config-section').toggle()">Settings</button>
                        </div>`;
                    }
                    content += "</div>";
                });

                return content;
            });

            logFancy(`(v${self.version}) initialized.`);
        }
    };

    class PokeClickerPlus {

        constructor() {
            this.version = VERSION;
            this.plugins = {};
            this.panels = {};
            this.debug = false;
            this.nextUniqueId = 1;

            if(localStorage.getItem(LOCAL_STORAGE_KEY_DEBUG) == "1") {
                this.debug = true;
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
                throw new TypeError("PokeClickerPlus.setPluginConfigUIDirty takes the following arguments: (id:string, dirty:boolean)");
            }
            const plugin = this.plugins[id];
            const button = $(`#pokeclickerplus-configbutton-${plugin.id}-apply`);
            if(button) {
                button.prop("disabled", !(dirty));
            }
        }

        loadPluginConfigs(id) {
            if(typeof id !== "string") {
                throw new TypeError("PokeClickerPlus.reloadPluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            let stored;
            try {
                stored = JSON.parse(localStorage.getItem(`pokeclickerplus.${id}.config`) || "{}");
            }
            catch(err) {
                console.error(`Failed to load configs for plugin with id "${id} - will use defaults instead."`);
                stored = {};
            }
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#pokeclickerplus-config-${plugin.id}-${cfg.id}`);
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
                throw new TypeError("PokeClickerPlus.savePluginConfigs takes the following arguments: (id:string)");
            }
            const plugin = this.plugins[id];
            const config = {};
            if(plugin.opts.config && Array.isArray(plugin.opts.config)) {
                plugin.opts.config.forEach(cfg => {
                    const el = $(`#pokeclickerplus-config-${plugin.id}-${cfg.id}`);
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
            localStorage.setItem(`pokeclickerplus.${id}.config`, JSON.stringify(config));
            this.setPluginConfigUIDirty(id, false);
            if(typeof plugin.onConfigsChanged === "function") {
                plugin.onConfigsChanged();
            }
        }

        addPanel(id, title, content) {
            if(typeof id !== "string" || typeof title !== "string" || (typeof content !== "string" && typeof content !== "function") ) {
                throw new TypeError("PokeClickerPlus.addPanel takes the following arguments: (id:string, title:string, content:string|function)");
            }
            const panels = $("#pluginModal");
            panels.append(`
            <div id="panel-${id}" style="display: none">
                <h1>${title}</h1>
                <hr>
                <div class="pokeclickerplus-panel-content"></div>
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
                throw new TypeError("PokeClickerPlus.refreshPanel takes the following arguments: (id:string)");
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
            const panelContent = $(`#panel-${id} .pokeclickerplus-panel-content`);
            panelContent.html(content);
            if(id === "pokeclickerplus") {
                this.forEachPlugin(plugin => {
                    this.loadPluginConfigs(plugin.id);
                });
            }
        }

        registerPlugin(plugin) {
            if(!(plugin instanceof PokeClickerPlusPlugin)) {
                throw new TypeError("PokeClickerPlus.registerPlugin takes the following arguments: (plugin:PokeClickerPlusPlugin)");
            }
            if(plugin.id in this.plugins) {
                throw new Error(`PokeClickerPlusPlugin with id "${plugin.id}" is already registered. Make sure your plugin id is unique!`);
            }

            this.plugins[plugin.id] = plugin;
            this.loadPluginConfigs(plugin.id);
            let versionString = plugin.opts&&plugin.opts.about&&plugin.opts.about.version ? ` (v${plugin.opts.about.version})` : "";
            logFancy(`registered plugin "${plugin.id}"${versionString}`);
        }

        forEachPlugin(f) {
            if(typeof f !== "function") {
                throw new TypeError("PokeClickerPlus.forEachPlugin takes the following arguments: (f:function)");
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
                throw new TypeError("PokeClickerPlus.setPanel takes the following arguments: (panel:string)");
            }
            window.switch_panels(`panel-${panel}`);
        }

        hideCustomPanels() {
            Object.values(this.panels).forEach((panel) => {
                const el = $(`#panel-${panel.id}`);
                if(el) {
                    el.css("display", "none");
                }
            });
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

        onPanelChanged(panelBefore, panelAfter) {
            if(this.debug) {
                console.log(`IP+ onPanelChanged "${panelBefore}" -> "${panelAfter}"`);
            }
            if(panelAfter === "pokeclickerplus") {
                this.refreshPanel("pokeclickerplus");
            }
            this.forEachPlugin((plugin) => {
                if(typeof plugin.onPanelChanged === "function") {
                    plugin.onPanelChanged(panelBefore, panelAfter);
                }
            });
        }

    }

    // Add to window and init
    window.PokeClickerPlusPlugin = PokeClickerPlusPlugin;
    window.PokeClickerPlus = new PokeClickerPlus();


    internal.init.call(window.PokeClickerPlus);

})();