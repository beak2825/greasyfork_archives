// ==UserScript==
// @name         Geoguessr BearSolver 🧸 
// @namespace    http://tampermonkey.net/
// @version      Alpha-v1.2.1
// @description  Displays location info and map for Geoguessr. 
// @author       @AnEntangledMind
// @license      MIT
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_webRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/528386/Geoguessr%20BearSolver%20%F0%9F%A7%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/528386/Geoguessr%20BearSolver%20%F0%9F%A7%B8.meta.js
// ==/UserScript==



/*
Copyright (c) 2025 @AnEntangledMind (greasyfork.org)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to 
the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN 
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function () {
    'use strict';

    /* =======================
       Global & Namespaced Data
       ======================= */
    const BearSolver = {
        version: "Alpha-v1.2.1",
        state: {
            lat: 0,
            lng: 0,
            label: null,
            map: null,
            mapContainer: null,
            tabs: 0
        },
        listeners: [],
        settings: {
            guiToggleKey: 'Delete',
        }
    };

    /* =======================
       Utility Functions
       ======================= */
    const applyStyles = (el, styles) => Object.assign(el.style, styles);

    const saveSettings = () => GM_setValue("BearSolver_Settings", BearSolver.settings);
    const getSettings = () => GM_getValue("BearSolver_Settings");
    const clearSettings = () => GM_deleteValue("BearSolver_Settings");

    if (getSettings() != undefined) BearSolver.settings = getSettings();

    // Append a single <style> tag to the head instead of continues styles later on
    function addGlobalStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            .bs-tab {
                position: absolute;
                top: 100px;
                left: 100px;
                width: 220px;
                background-color: rgba(15,15,15,0.95);
                border: 1px solid #5B5B5B;
                border-radius: 6px;
                font-family: sans-serif;
                color: #FFFFFF;
                z-index: 1000;
                user-select: none;
            }
            .bs-tab-header {
                background: linear-gradient(90deg, #212121, #2D2D2D);
                padding: 8px;
                border-top-left-radius: 6px;
                border-top-right-radius: 6px;
                cursor: move;
                font-weight: bold;
                font-size: 14px;
            }
            .bs-tab-content {
                padding: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    /* =======================
       Keybind Manager
       ======================= */
    const KeybindManager = (() => {
        let keybinds = [];
        document.addEventListener('keydown', (e) => {
            if (keybinds == []) return;

            keybinds.forEach((bind) => {
                if (e.key == bind.key) {
                    e.preventDefault();
                    bind.callback();
                } else if(bind.key == 'any') {
                    bind.callback(e);
                }
            });
        });

        return {
            register: (key, callback) => keybinds.push({ key, callback }),
            unregister: (key) => {
                const index = keybinds.findIndex(bind => bind.key == key);
                if (index !== -1) {
                    keybinds.splice(index, 1);
                }
            },
            unregisterall: () => {
                keybinds = [];
            }
        };
    })();

    /* =======================
       UI Classes
       ======================= */
    class UITab {
        constructor(name, parent) {
            this.name = name;
            this.parent = parent;
            this.tabElement = null;
            this.contentElement = null;
            this.init();
        }

        init() {
            const tab = document.createElement('div');
            tab.className = 'bs-tab';
            this.tabElement = tab;

            const header = document.createElement('div');
            header.className = 'bs-tab-header';
            header.innerText = this.name;
            tab.appendChild(header);

            tab.style.left = 100 + (230 * BearSolver.state.tabs) + 'px';
            BearSolver.state.tabs++;

            // Dragging logic 
            header.addEventListener('pointerdown', (e) => {
                const startX = e.clientX - tab.offsetLeft;
                const startY = e.clientY - tab.offsetTop;

                const onPointerMove = (ev) => {
                    tab.style.left = (ev.clientX - startX) + 'px';
                    tab.style.top = (ev.clientY - startY) + 'px';
                };

                const onPointerUp = () => {
                    document.removeEventListener('pointermove', onPointerMove);
                    document.removeEventListener('pointerup', onPointerUp);
                };

                document.addEventListener('pointermove', onPointerMove);
                document.addEventListener('pointerup', onPointerUp);
            });

            const content = document.createElement('div');
            content.className = 'bs-tab-content';
            this.contentElement = content;
            tab.appendChild(content);

            this.parent.mainContainer.appendChild(tab);
        }

        // Methods to add controls.

        addButton(label, onClick) {
            const btn = document.createElement('button');
            btn.innerText = label;
            applyStyles(btn, {
                width: '100%',
                marginBottom: '6px',
                padding: '6px 8px',
                backgroundColor: '#3C3C3C',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
            });
            btn.addEventListener('mouseover', () => btn.style.backgroundColor = '#5A5A5A');
            btn.addEventListener('mouseout', () => btn.style.backgroundColor = '#3C3C3C');
            btn.addEventListener('click', () => onClick && onClick());
            this.contentElement.appendChild(btn);
            return btn;
        }

        addToggle(label, uid, defaultState = false, onToggle) {
            if (BearSolver.settings[uid] != undefined) {
                defaultState = BearSolver.settings[uid];
            } else {
                BearSolver.settings[uid] = defaultState;
            }

            const container = document.createElement('div');
            applyStyles(container, {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
            });

            const text = document.createElement('span');
            text.innerText = label;

            const toggleBtn = document.createElement('button');
            applyStyles(toggleBtn, {
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                backgroundColor: defaultState ? '#7A3C8C' : '#3C3C3C',
                color: '#FFFFFF',
            });
            toggleBtn.innerText = defaultState ? 'ON' : 'OFF';
            let toggled = defaultState;
            toggleBtn.addEventListener('click', () => {
                toggled = !toggled;
                toggleBtn.innerText = toggled ? 'ON' : 'OFF';
                toggleBtn.style.backgroundColor = toggled ? '#7A3C8C' : '#3C3C3C';

                BearSolver.settings[uid] = toggled;

                onToggle && onToggle(toggled);
            });
            container.appendChild(text);
            container.appendChild(toggleBtn);
            this.contentElement.appendChild(container);
            return toggleBtn;
        }
    
        addLabel(text) {
            const labelEl = document.createElement('div');
            labelEl.innerText = text;
            applyStyles(labelEl, { margin: '4px 0', fontSize: '13px' });
            this.contentElement.appendChild(labelEl);
            return labelEl;
        }

        addSeparator() {
            const sep = document.createElement('hr');
            applyStyles(sep, {
                border: 'none',
                borderTop: '1px solid #5B5B5B',
                margin: '8px 0',
            });
            this.contentElement.appendChild(sep);
            return sep;
        }

        addKeybind(label, uid, defaultKey, onKeybindChange, callback) {
            if (BearSolver.settings[uid] != undefined) {
                defaultKey = BearSolver.settings[uid];
            } else {
                BearSolver.settings[uid] = defaultKey;
            }

            const container = document.createElement('div');
            applyStyles(container, { marginBottom: '6px' });
            const labelEl = document.createElement('div');
            labelEl.innerText = label;
            applyStyles(labelEl, { marginBottom: '2px', fontSize: '13px' });

            if (defaultKey != null && callback != null) {KeybindManager.register(defaultKey, callback);}

            const keybindBtn = document.createElement('button');
            keybindBtn.innerText = defaultKey || 'Set a keybind...';
            applyStyles(keybindBtn, {
                width: '100%',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid #555',
                backgroundColor: '#2A2A2A',
                color: '#FFF',
                cursor: 'pointer',
            });

            let waitingForKey = false;
            keybindBtn.addEventListener('click', () => {
                KeybindManager.unregister(keybindBtn.innerText)
                keybindBtn.innerText = 'Press a key...';
                waitingForKey = true;
            });
            
            function keyHandling(e) {
                if (!waitingForKey) return;
                e.preventDefault();
                waitingForKey = false;
                keybindBtn.innerText = e.key;

                BearSolver.settings[uid] = e.key;

                onKeybindChange && onKeybindChange(e);
                if (callback != null) KeybindManager.register(e.key, callback);
            }

            KeybindManager.register('any', keyHandling)

            container.appendChild(labelEl);
            container.appendChild(keybindBtn);
            this.contentElement.appendChild(container);
            return keybindBtn;
        }
    }

    class UIManager {
        constructor(title, toggleKey = BearSolver.settings.guiToggleKey) {
            this.title = title;
            this.toggleKey = toggleKey;
            this.isVisible = true;
            this.mainContainer = null;
        }

        init() {
            const container = document.createElement('div');
            this.mainContainer = container;
            applyStyles(container, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 999,
            });
            document.body.appendChild(container);

            document.addEventListener('keydown', (e) => {
                if (e.key == this.toggleKey) {
                    e.preventDefault();
                    this.isVisible = !this.isVisible;
                    container.style.display = this.isVisible ? 'block' : 'none';
                }
            });
        }

        createTab(name) {
            return new UITab(name, this);
        }

        destroy() {
            if (this.mainContainer) {
                document.body.removeChild(this.mainContainer);
            }
        }
    }

    /* =======================
       Leaflet & Map Functions
       ======================= */
    function loadLeaflet() {
        return new Promise((resolve, reject) => {
            const leafletCSS = document.createElement('link');
            leafletCSS.rel = 'stylesheet';
            leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(leafletCSS);

            const leafletJS = document.createElement('script');
            leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            leafletJS.onload = resolve;
            leafletJS.onerror = () => reject(new Error('Leaflet failed to load'));
            document.head.appendChild(leafletJS);
        });
    }

    function createMap(lat = 0, lng = 0) {
        const mapContainer = document.createElement('div');
        applyStyles(mapContainer, {
            position: 'fixed',
            display: 'block',
            top: '150px',
            right: '10px',
            width: '300px',
            height: '300px',
            zIndex: '99999',
            border: '2px solid black',
        });
        mapContainer.id = 'map';
        document.body.appendChild(mapContainer);

        BearSolver.state.map = L.map(mapContainer).setView([lat, lng], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(BearSolver.state.map);

        return mapContainer;
    }

    function addLocLabel(country = 'Unknown', city = 'Unknown') {
        const label = document.createElement('div');
        applyStyles(label, {
            position: 'fixed',
            display: 'block',
            top: '100px',
            right: '10px',
            zIndex: '99999',
            padding: '10px 15px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        });
        label.id = 'location-label';
        label.innerText = `📍 ${city}, ${country}`;
        document.body.appendChild(label);
        return label;
    }

    function displayLocation(lat, lng, city = 'Unknown', country = 'Unknown') {
        if (BearSolver.state.map && BearSolver.state.mapContainer) {
            if (BearSolver.state.marker) {
                BearSolver.state.map.removeLayer(BearSolver.state.marker);
            }

            if (BearSolver.state.label) {
                BearSolver.state.label.innerText = `📍 ${city}, ${country}`;
            }

            BearSolver.state.map.setView([lat, lng], 2);
            BearSolver.state.marker = L.marker([lat, lng]).addTo(BearSolver.state.map);
        }
    }

    function resolveLatLong(lat, lng) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const country = data.address?.country || 'Unknown';
                const city = data.address?.city ||
                             data.address?.town ||
                             data.address?.village ||
                             'Unknown';
                displayLocation(lat, lng, city, country);
            })
            .catch(error => console.error('Error resolving location:', error));
    }

    /* =======================
       XHR Interception
       ======================= */
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        if (method.toUpperCase() === 'POST') {
            const targetURLs = [
                'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata',
                'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'
            ];
            if (targetURLs.some(prefix => url.startsWith(prefix))) {
                this.addEventListener('load', function () {
                    const match = this.responseText.match(/-?\d+\.\d+,-?\d+\.\d+/);
                    if (match) {
                        const [lat, lng] = match[0].split(',').map(Number);
                        BearSolver.state.lat = lat;
                        BearSolver.state.lng = lng;
                    }
                });
            }
        }
        return originalOpen.apply(this, arguments);
    };

    /* =======================
       Cleanup / Unload Functionality
       ======================= */
    function unloadScript() {
        if (BearSolver.state.mapContainer) {
            BearSolver.state.mapContainer.remove();
        }
        if (BearSolver.state.label) {
            BearSolver.state.label.remove();
        }
        XMLHttpRequest.prototype.open = originalOpen;
        KeybindManager.unregisterall()
        console.log('Unloaded BearSolver and cleaned up events.');
    }

    /* =======================
       Overlay & Initialization UI
       ======================= */
    function showWelcomeScreen() {
        const overlay = document.createElement('div');
        overlay.id = 'welcome-overlay';
        applyStyles(overlay, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '100000',
        });

        const container = document.createElement('div');
        applyStyles(container, {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            color: '#fff',
            minWidth: '300px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
        });

        const title = document.createElement('h1');
        title.innerText = 'BearSolver 🧸';
        container.appendChild(title);

        const message = document.createElement('p');
        message.innerText = 'Welcome, User!';
        container.appendChild(message);

        const message2 = document.createElement('p');
        const changelog = `Changelog for ${BearSolver.version}:
                        - Added UserScript permissions, including @GM_setValue, @GM_getValue, and @GM_deleteValue.  
                        - Introduced quality-of-life features, such as automatic tab organization.  
                        - Added experimental saving functionality (bugs may be present despite testing). 
                        - Fixed Hide-Elements Keybind.
                        `;

        message2.innerText = 
        `Any bans received are not taken accountability for.
        
        Credits:
        @AnEntangledMind - Developer
        
        ${changelog}`;
        message2.style.color = '#a0a0a0';
        container.appendChild(message2);

        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '20px';

        const loadButton = document.createElement('button');
        loadButton.innerText = 'Load with cheat';
        applyStyles(loadButton, {
            marginRight: '10px',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        });
        loadButton.addEventListener('click', () => {
            exitButton.remove();
            loadButton.innerText = 'Loading...';
            continueCheat();
        });
        btnContainer.appendChild(loadButton);

        const exitButton = document.createElement('button');
        exitButton.innerText = 'Load without cheat';
        applyStyles(exitButton, {
            padding: '10px',
            backgroundColor: '#D32F2F',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        });
        exitButton.addEventListener('click', exitCheat);
        btnContainer.appendChild(exitButton);

        container.appendChild(btnContainer);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
    }

    function continueCheat() {
        loadLeaflet().then(() => {
            BearSolver.state.mapContainer = createMap();
            BearSolver.state.label = addLocLabel();

            if (BearSolver.settings['mapToggleID'] != undefined) BearSolver.state.mapContainer.style.display = BearSolver.settings['mapToggleID'] ? 'block' : 'none';
            if (BearSolver.settings['labelToggleID'] != undefined) BearSolver.state.label.style.display = BearSolver.settings['labelToggleID'] ? 'block' : 'none';
        }).catch(console.error);


        const overlay = document.getElementById('welcome-overlay');
        if (overlay) overlay.remove();

        // Initialize UI Manager and add tabs
        const ui = new UIManager("BearSolver 🧸", BearSolver.settings.guiToggleKey);
        ui.init();

        const resolverTab = ui.createTab("Resolver 📍");
        resolverTab.addLabel("Resolver Settings");
        resolverTab.addSeparator();
        resolverTab.addKeybind("Resolve Location", "resolveLocationKeybind", "1", () => { },
            () => resolveLatLong(BearSolver.state.lat, BearSolver.state.lng));
        resolverTab.addSeparator();


        const toggleLabel = (state) => {
            if (BearSolver.state.label) {
                BearSolver.state.label.style.display = state ? 'block' : 'none';
            }
        };
        const toggleMap = (state) => {
            if (BearSolver.state.mapContainer) {
                BearSolver.state.mapContainer.style.display = state ? 'block' : 'none';
            }
        };
        resolverTab.addToggle('Show Label', "labelToggleID", true, toggleLabel);
        resolverTab.addToggle('Show Map', "mapToggleID", true, toggleMap);
        resolverTab.addKeybind("Toggle Elements", "toggleElementsKeybind", "2", () => { },
            () => {
                toggleLabel(BearSolver.state.label.style.display != "block");
                toggleMap(BearSolver.state.mapContainer.style.display != "block");
            });

        const utilityTab = ui.createTab('Utility ⚙️');
        utilityTab.addLabel("Utility Settings");
        utilityTab.addSeparator();
        utilityTab.addButton("Save Settings", () => { saveSettings(); });
        utilityTab.addButton("Delete Settings", () => { clearSettings(); });
        utilityTab.addSeparator();
        utilityTab.addKeybind("Toggle Gui", "guiToggleKey", "Delete", (e) => { setTimeout(() => ui.toggleKey = e.key, 10)});
        utilityTab.addKeybind("Panic Key", "panicKeybind", "3", () => { },
            () => { unloadScript(); ui.destroy(); });
        utilityTab.addButton("Unload Script", () => { unloadScript(); ui.destroy(); });

        const infoTab = ui.createTab('Bearsolver Info 🧸');
        infoTab.addLabel("Current Version: " + BearSolver.version);
        infoTab.addLabel("Enjoy BearSolver 💝!");
        infoTab.addSeparator();
        infoTab.addLabel("Developer: AnEntangledMind");
        infoTab.addLabel("'Helpers': World-Wide-Web <3");
        infoTab.addSeparator();
        infoTab.addLabel("Any bans received are not taken accountability for.");
    }

    function exitCheat() {
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) overlay.remove();
        XMLHttpRequest.prototype.open = originalOpen;
        console.log('Cheat not loaded. Script stopped.');
    }

    /* =======================
       Initialization
       ======================= */
    function initialize() {
        addGlobalStyles();
        showWelcomeScreen();
    }

    initialize();

})();
