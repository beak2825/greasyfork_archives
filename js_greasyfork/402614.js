// ==UserScript==
// @name		Florr.io Server Selector
// @namespace	Violentmonkey Scripts
// @author		ash
// @version		3.0.0
// @description	Press Tab to open Server Selector.
// @match		*://florr.io/*
// @grant		unsafeWindow
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @resource	modalCSS https://gist.githubusercontent.com/ashfr/11951eb0082892a30ef4538bbd7b972e/raw/5244f4efd286d21a03d2cb76c69cf9e590638a9e/modalCSS.txt
// @downloadURL https://update.greasyfork.org/scripts/402614/Florrio%20Server%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/402614/Florrio%20Server%20Selector.meta.js
// ==/UserScript==
let modalCSS = GM_getResourceText("modalCSS");
GM_addStyle(modalCSS);

(() => {
    "use strict";

    const Config = {
        hotkey: {
            connectUI: 'Tab'
        },
        script: {
            m28nOverride: false,
            socket: null,
            currentId: '',
            ids: []
        }
    };

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class='modal-content'>
            <span class='close'>&times;</span>
            <div class='select'>
                <label for="serverSelect">Choose a server: </label>
                <select id="serverSelect" name="serverSelect"></select>
            </div>
            <span class='author'>Made by ash.</span>
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => {
        if (modal.classList.contains('visible')) {
            modal.classList.remove("visible");
        }
    };

    const toggleModal = () => {
        modal.classList.toggle("visible");
    };

    const handleKeypress = (e) => {
        let key = e.key;
        switch (key) {
            case "Tab":
                e.preventDefault();
                e.stopPropagation();
                toggleModal();
                break;
            case "Escape":
                e.preventDefault();
                e.stopPropagation();
                closeModal();
                break;
            default:
                break;
        }
    };

    document.addEventListener("keydown", handleKeypress);
    document.querySelector(".close").addEventListener("click", closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    })

    const serverSelect = document.getElementById('serverSelect');
    serverSelect.onchange = (e) => {
        connectServer();
        closeModal();
    }

    const capitalizeFirstLetter = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const fetchServers = async () => {
        let url = "https://api.n.m28.io";

        try {
            let response = await fetch(`${url}/endpoint/florrio/findEach/`);
            let body = await response.json();

            if (body.hasOwnProperty("servers")) {
                Object.entries(body.servers).forEach(([key, val]) => {
                    if (!Config.script.ids.includes(val.id)) {
                        Config.script.ids.push(val.id);

                        let name = key.replace(/(linode-|vultr-)/, "");
                        let serverOption = document.createElement('option');

                        serverOption.setAttribute('data-value', JSON.stringify(val));
                        serverOption.innerText = capitalizeFirstLetter(name);
                        if (val.id === Config.script.currentId) {
                            serverOption.setAttribute('selected', 'selected');
                        }

                        serverSelect.appendChild(serverOption);
                    }
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    const findServerPreferenceProxy = new Proxy(unsafeWindow.m28n.findServerPreference, {
        apply(_target, _thisArgs, args) {
            if (Config.script.m28nOverride) {
                args[1](null, [JSON.parse(serverSelect.options[serverSelect.selectedIndex].dataset.value)]);
                return;
            }
            return Reflect.apply(...arguments);
        }
    })

    unsafeWindow.m28n.findServerPreference = findServerPreferenceProxy;

    const WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {
        construct (Target, args) {
            const instance = Reflect.construct(...arguments);

            const messageHandler = (e) => {
                let buffer = new DataView(e.data);
                if(buffer.getUint8(0) === 1) {
                    instance.removeEventListener("message", messageHandler);
                    Config.script.socket = instance;
                    Config.script.currentId = instance.url.match(/wss:\/\/(\w{4})\./)[1];
                    fetchServers();
                }
            }

            instance.addEventListener("message", messageHandler);

            return instance;
        }
    });

    unsafeWindow.WebSocket = WebSocketProxy;

    const connectServer = () => {
        Config.script.m28nOverride = true;
        Config.script.socket.close();
    }
})()