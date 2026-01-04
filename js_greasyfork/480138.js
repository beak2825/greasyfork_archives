// ==UserScript==
// @name         StakeUsPlus
// @namespace    a
// @version      1.2
// @description  StakeUs plugin framework
// @author       diehard2k0
// @match        *://stake.us/*
// @grant        none
// ==/UserScript==

(function() {
    const VERSION = '1.0.0';
    const INFO = 'Plugin Management';
    const LOCAL_STORAGE_KEY_DEBUG = 'debug';

    // Utility function to log in a fancy way
    function logFancy(s, color="#00f7ff") {
        console.log("%cStakeUsPlus: %c"+s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: black; font-weight: normal; font-size: 10pt;");
    }

    // Define the StakeUsPlusPlugin and StakeUsPlus classes
    class StakeUsPlusPlugin {
        constructor(id, opts) {
            this.id = id;
            this.opts = opts;
        }
    }

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

            if (localStorage.getItem(LOCAL_STORAGE_KEY_DEBUG) == "1") {
                this.debug = true;
            }
        }

        // Register a plugin
        registerPlugin(plugin) {
            if (!(plugin instanceof StakeUsPlusPlugin)) {
                throw new TypeError("StakeUsPlus.registerPlugin takes the following arguments: (plugin:StakeUsPlusPlugin)");
            }
            if (plugin.id in this.plugins) {
                throw new Error(`StakeUsPlusPlugin with id "${plugin.id}" is already registered. Make sure your plugin id is unique!`);
            }

            this.plugins[plugin.id] = plugin;
            let versionString = plugin.opts && plugin.opts.about && plugin.opts.about.version ? ` (v${plugin.opts.about.version})` : "";
            logFancy(`registered plugin "${plugin.id}"${versionString}`);
        }

        // Add a panel (e.g., plugin settings panel)
        addPanel(id, title, content) {
            if (typeof id !== "string" || typeof title !== "string" || (typeof content !== "string" && typeof content !== "function")) {
                throw new TypeError("StakeUsPlus.addPanel takes the following arguments: (id:string, title:string, content:string|function)");
            }
            const panels = document.querySelector("#svelte > div.draggable.svelte-uhzn2f");
            panels.append(`
                <div data-layout class="svelte-uhzn2f" id="panel-${id}">
                    <h1>${title}</h1>
                    <hr>
                    <div class="stakeusplus-panel-content"></div>
                </div>
            `);
            this.panels[id] = { id: id, title: title, content: content };
            this.refreshPanel(id);
        }

        // Refresh a panel's content
        refreshPanel(id) {
            if (typeof id !== "string") {
                throw new TypeError("StakeUsPlus.refreshPanel takes the following arguments: (id:string)");
            }
            const panel = this.panels[id];
            if (!panel) {
                throw new TypeError(`Error rendering panel with id="${id}" - panel has not been added.`);
            }
            let content = panel.content;
            if (!["string", "function"].includes(typeof content)) {
                throw new TypeError(`Error rendering panel with id="${id}" - panel.content must be a string or a function returning a string.`);
            }
            if (typeof content === "function") {
                content = content();
                if (typeof content !== "string") {
                    throw new TypeError(`Error rendering panel with id="${id}" - panel.content must be a string or a function returning a string.`);
                }
            }
            const panelContent = document.querySelector(`#panel-${id} .stakeusplus-panel-content`);
            panelContent.innerHTML = content;
        }

        // Show modal
        showModal() {
            document.getElementById("pluginPanel").style.display = 'block'; // Show the modal
        }

        // Toggle plugin panel (e.g., visibility of a plugin settings panel)
        togglePluginPanel() {
            var pluginPanel = document.querySelector("#svelte > div.draggable.svelte-uhzn2f");
            if (pluginPanel.style.display === "none") {
                console.log("Plugin Panel Turned On");
                pluginPanel.style.display = "flex";
            } else {
                console.log("Plugin Panel Turned Off");
                pluginPanel.style.display = "none";
            }
        }

        // Show the plugin modal and set up its draggable behavior
        initModal() {
            const pluginPanel = document.getElementById("pluginPanel");
            const pluginPanelHeader = document.getElementById("pluginPanelHeader");

            let isDragging = false;
            let offsetX, offsetY;

            // Make the header draggable
            pluginPanelHeader.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - pluginPanel.offsetLeft;
                offsetY = e.clientY - pluginPanel.offsetTop;
                document.addEventListener("mousemove", handleDrag);
                document.addEventListener("mouseup", () => {
                    isDragging = false;
                    document.removeEventListener("mousemove", handleDrag);
                });
            });

            // Handle the dragging movement
            function handleDrag(e) {
                if (isDragging) {
                    pluginPanel.style.left = `${e.clientX - offsetX}px`;
                    pluginPanel.style.top = `${e.clientY - offsetY}px`;
                }
            }
        }
    }

    // Modal HTML structure
    document.body.insertAdjacentHTML('beforeend', `
        <div class="plugin-panel" id="pluginPanel">
            <div class="plugin-panel-header" id="pluginPanelHeader">Plugin Settings</div>
            <div class="plugin-panel-content">
                <p>Welcome to the plugin settings page!</p>
                <p>More content goes here.</p>
            </div>
        </div>
    `);

    // Styles for modal and draggable behavior
    const style = document.createElement('style');
    style.innerHTML = `
        .plugin-panel {
            display: none;
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            max-height: 300px;
            overflow-y: auto;
            cursor: move;
        }
        .plugin-panel-header {
            padding: 10px;
            background: #ddd;
            cursor: move;
            border-radius: 5px 5px 0 0;
            text-align: center;
            font-weight: bold;
        }
        .plugin-panel-content {
            padding: 10px;
            font-size: 14px;
        }
    `;
    document.head.appendChild(style);

    // Initialize the StakeUsPlus instance
    window.StakeUsPlusPlugin = StakeUsPlusPlugin;
    window.StakeUsPlus = new StakeUsPlus();

    // Initialize modal dragging functionality
    window.StakeUsPlus.initModal();

    // Example to show modal
    setTimeout(() => {
        window.StakeUsPlus.showModal();
    }, 1000);

})();
