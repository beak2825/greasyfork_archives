// ==UserScript==
// @name         Kour.io Invisible hack
// @match        *://kour.io/*
// @license MIT
// @version      1.3.0
// @description  kour.io hacks with togglable options for invisibility and instant kill
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1422179
// @downloadURL https://update.greasyfork.org/scripts/523491/Kourio%20Invisible%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/523491/Kourio%20Invisible%20hack.meta.js
// ==/UserScript==

const Signatures = {
    ping:              "f3 07 01 00 00",
    pong:              "f3 06 01 01 01",
    anotherPing:       "f3 04 e2 03 e3",
    createGame:        "f3 02 e3 03 ff 07 06",
    updateState:       "f3 02 fd 02 f4 03 c8",
    damageTaken:       "f3 04 c8 02 f5 15 04",
    connectStarts:     "f3 02 e",
    connectEnds:       "f1 1c e8 1c bf 0b 23"
};

class Kour {
    constructor() {
        this.sockets = [];
        this.config = {
            Invisible: false,
            InstantKill: false
        };
        this.packets = 0;

        unsafeWindow.WebSocket = class extends WebSocket {
            constructor() {
                super(...arguments);
                this.addEventListener("open", event => {
                    kourInstance.sockets.push(this);
                    kourInstance.hook(this);
                });
            }
        };
    }

    hook(socket) {
        const send = socket.send;
        const onmessage = socket.onmessage;

        socket.onmessage = (event) => {
            if (!event.data) return onmessage.call(socket, event);

            this.packets++;

            let hexArray = Array.from(new Uint8Array(event.data)).map(byte => byte.toString(16).padStart(2, '0'));
            let stringHexArray = hexArray.join(" ");

            if (stringHexArray.startsWith(Signatures.ping) || stringHexArray.startsWith(Signatures.anotherPing)) {
                return onmessage.call(socket, event);
            }

            if (stringHexArray.startsWith(Signatures.damageTaken) && this.config.Invisible) {
                return;
            }

            return onmessage.call(socket, event);
        };

        socket.send = (data) => {
            this.packets++;

            let hexArray = Array.from(new Uint8Array(data)).map(byte => byte.toString(16).padStart(2, '0'));
            let stringHexArray = hexArray.join(" ");

            if (stringHexArray.startsWith(Signatures.pong)) {
                return send.call(socket, data);
            }

            if (stringHexArray.startsWith(Signatures.updateState) && this.config.InstantKill) {
                for (let i = 0; i < 40; i++) {
                    send.call(socket, data);
                }
                return send.call(socket, data);
            }

            return send.call(socket, data);
        };
    }

    createMenu() {
        const menu = document.createElement("div");
        menu.style.position = "fixed";
        menu.style.top = "20px";
        menu.style.right = "20px";
        menu.style.background = "linear-gradient(145deg, #4f4f4f, #2f2f2f)";
        menu.style.padding = "15px";
        menu.style.borderRadius = "10px";
        menu.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3), 0 -4px 6px rgba(0, 0, 0, 0.2)";
        menu.style.color = "white";
        menu.style.fontFamily = "'Roboto', sans-serif";
        menu.style.fontSize = "14px";
        menu.style.zIndex = "9999";
        menu.style.cursor = "move";
        menu.style.display = "flex";
        menu.style.flexDirection = "column";
        menu.style.alignItems = "center";
        menu.style.transition = "none"; // Remover transição aqui para evitar a borda preta

        // Título estilizado "LC Mod Menu"
        const title = document.createElement("div");
        title.textContent = "LC Mod Menu";
        title.style.fontSize = "22px";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "15px";
        title.style.color = "#ff6f61";
        title.style.textShadow = "2px 2px 5px rgba(0, 0, 0, 0.3)";
        title.style.fontFamily = "'Poppins', sans-serif";
        menu.appendChild(title);

        let isDragging = false;
        let offsetX, offsetY;

        menu.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
        });

        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                menu.style.left = `${e.clientX - offsetX}px`;
                menu.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            menu.style.transition = "transform 0.2s ease-in-out"; // Adicionar transição após o movimento
        });

        const createOption = (label, configKey) => {
            const button = document.createElement("button");
            button.textContent = `${label}: OFF`;
            button.style.margin = "5px";
            button.style.padding = "10px 15px";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.backgroundColor = "#444";
            button.style.color = "white";
            button.style.cursor = "pointer";
            button.style.fontWeight = "bold";
            button.style.transition = "all 0.3s";

            button.addEventListener("mouseover", () => {
                button.style.backgroundColor = "#555";
            });

            button.addEventListener("mouseout", () => {
                button.style.backgroundColor = this.config[configKey] ? "#4CAF50" : "#444";
            });

            button.addEventListener("click", () => {
                this.config[configKey] = !this.config[configKey];
                button.textContent = `${label}: ${this.config[configKey] ? 'ON' : 'OFF'}`;
                button.style.backgroundColor = this.config[configKey] ? "#4CAF50" : "#444";
            });

            menu.appendChild(button);
        };

        createOption("INSTANT KILL", "InstantKill");
        createOption("INVISIBLE", "Invisible");

        document.body.appendChild(menu);
    }
}

const kourInstance = new Kour();
window.addEventListener("load", () => {
    kourInstance.createMenu();
});
