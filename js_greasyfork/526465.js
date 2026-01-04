// ==UserScript==
// @name         Kour.io Mod Menu (Enhanced UI)
// @match        *://kour.io/*
// @version      2.0.0
// @author       rexmine-code
// @description  Kour.io mod menu with a modern, sleek UI
// @run-at       document-start
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/1369586
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526465/Kourio%20Mod%20Menu%20%28Enhanced%20UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526465/Kourio%20Mod%20Menu%20%28Enhanced%20UI%29.meta.js
// ==/UserScript==

const Signatures = {
    ping:          "f3 07 01 00 00",
    pong:          "f3 06 01 01 01",
    anotherPing:   "f3 04 e2 03 e3",
    createGame:    "f3 02 e3 03 ff 07 06",
    updateState:   "f3 02 fd 02 f4 03 c8",
    damageTaken:   "f3 04 c8 02 f5 15 04",
    connectStarts: "f3 02 e",
    connectEnds:   "f1 1c e8 1c bf 0b 23"
};

class Kour {
    constructor() {
        this.sockets = [];
        this.config = {
            Invisible: true,
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

    hexArrayToString(hexArray) {
        let str = '';
        for (let i = 0; i < hexArray.length; i++) {
            let hex = hexArray[i];
            let decimalValue = parseInt(hex, 16);
            str += String.fromCharCode(decimalValue);
        }
        return str;
    }

    hook(socket) {
        console.debug("%c !! ", "background:#7aadff;color:#000", `Intercepted WebSocket (${socket.url})`);
        const send = socket.send;
        const onmessage = socket.onmessage;

        socket.onmessage = (event) => {
            if (event.data == null) {
                return onmessage.call(socket, event);
            }

            let hexArray = Array.from(new Uint8Array(event.data)).map(byte => byte.toString(16).padStart(2, '0'));
            let stringHexArray = hexArray.join(" ");

            if (stringHexArray.startsWith(Signatures.damageTaken) && this.config.Invisible) {
                return;
            }

            return onmessage.call(socket, event);
        };

        socket.send = (data) => {
            let hexArray = Array.from(new Uint8Array(data)).map(byte => byte.toString(16).padStart(2, '0'));
            let stringHexArray = hexArray.join(" ");

            if (stringHexArray.startsWith(Signatures.createGame)) {
                let partyId = this.hexArrayToString(hexArray.slice(7, 13));
                console.debug("%c => ", "background:#7F7;color:#000", "Creating game:", partyId);
                return send.call(socket, data);
            } else if (stringHexArray.startsWith(Signatures.updateState) && this.config.InstantKill) {
                for (let i = 0; i < 40; i++) {
                    send.call(socket, data);
                }
                return send.call(socket, data);
            }
            return send.call(socket, data);
        };
    }

    watermark() {
        let overlayCanvas = document.createElement("canvas");
        let unityContainer = document.getElementById("unity-container");
        overlayCanvas.width = unityContainer.clientWidth;
        overlayCanvas.height = unityContainer.clientHeight;
        overlayCanvas.style.position = "absolute";
        overlayCanvas.style.top = "50%";
        overlayCanvas.style.left = "50%";
        overlayCanvas.style.transform = "translate(-50%, -50%)";
        overlayCanvas.style.pointerEvents = "none";
        overlayCanvas.style.zIndex = "9999";
        unityContainer.appendChild(overlayCanvas);

        let ctx = overlayCanvas.getContext("2d");
        ctx.font = "15px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        function animate() {
            let lines = [`kour.rip (${kourInstance.packets})`];
            lines.push(kourInstance.config.Invisible ? "<c>✔ Invisible" : "<c>✖ Invisible");
            lines.push(kourInstance.config.InstantKill ? "<c>✔ Instant-Kill" : "<c>✖ Instant-Kill");

            let lineHeight = 20;
            let startY = overlayCanvas.height / 2 - ((lines.length - 1) * lineHeight) / 2 + 60;
            let centerX = overlayCanvas.width / 2;

            ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
            ctx.globalAlpha = 0.8;

            lines.forEach((line, index) => {
                ctx.fillStyle = line.includes("<c>") ? "#F8CEFF" : "#FFFFFF";
                ctx.fillText(line.replace("<c>", ""), centerX, startY + index * lineHeight);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    toggleInvisible() {
        this.config.Invisible = !this.config.Invisible;
    }

    toggleInstantKill() {
        this.config.InstantKill = !this.config.InstantKill;
    }

    createStyledButton(text, onClick) {
        let button = document.createElement('button');
        button.innerText = text;
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '12px 20px';
        button.style.margin = '8px';
        button.style.borderRadius = '8px';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        button.style.backdropFilter = 'blur(5px)';

        button.onmouseover = () => {
            button.style.backgroundColor = 'rgba(50, 50, 50, 0.7)';
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.2)';
        };

        button.onmouseout = () => {
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        };

        button.onclick = onClick;
        return button;
    }

    openModMenu() {
        let menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.top = '20px';
        menu.style.left = '20px';
        menu.style.backgroundColor = 'rgba(20, 20, 20, 0.9)';
        menu.style.color = 'white';
        menu.style.padding = '20px';
        menu.style.borderRadius = '12px';
        menu.style.zIndex = '9999';
        menu.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        menu.style.backdropFilter = 'blur(10px)';
        menu.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        menu.style.width = '200px';
        menu.style.transition = 'all 0.3s ease';
        menu.style.display = 'none';

        let title = document.createElement('h3');
        title.textContent = 'Kour.io Mod Menu';
        title.style.marginTop = '0';
        title.style.textAlign = 'center';
        title.style.color = '#F8CEFF';
        title.style.fontFamily = 'Arial, sans-serif';

        let invBtn = this.createStyledButton(
            this.config.Invisible ? 'Disable Invisible' : 'Enable Invisible',
            () => {
                this.toggleInvisible();
                invBtn.innerText = this.config.Invisible ? 'Disable Invisible' : 'Enable Invisible';
            }
        );

        let killBtn = this.createStyledButton(
            this.config.InstantKill ? 'Disable Instant-Kill' : 'Enable Instant-Kill',
            () => {
                this.toggleInstantKill();
                killBtn.innerText = this.config.InstantKill ? 'Disable Instant-Kill' : 'Enable Instant-Kill';
            }
        );

        menu.appendChild(title);
        menu.appendChild(invBtn);
        menu.appendChild(killBtn);

        document.body.appendChild(menu);
        this.menu = menu;
    }

    toggleMenu() {
        if (this.menu.style.display === 'none') {
            this.menu.style.display = 'block';
        } else {
            this.menu.style.display = 'none';
        }
    }
}

const kourInstance = new Kour();
unsafeWindow.kourInstance = kourInstance;

window.addEventListener("load", () => {
    kourInstance.openModMenu();
    window.addEventListener("keydown", (e) => {
        if (e.key === 'm') {
            kourInstance.toggleMenu();
        }
    });
});
