// ==UserScript==
// @name         MooVisuals
// @namespace    https://www.example.com
// @version      1.6
// @description  Custom visuals created by chat gpt and Auto "gg" on kill in MooMoo.io
// @author       NuK3r_101 and _VcrazY_
// @match        *://*.moomoo.io/*
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js
// @downloadURL https://update.greasyfork.org/scripts/470158/MooVisuals.user.js
// @updateURL https://update.greasyfork.org/scripts/470158/MooVisuals.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Custom visuals code from MooVisuals

    const { style: o } = document.querySelector("#topInfoHolder");
    o.setProperty("background-image", "url('https://tinyurl.com/8bu583v8')");

    // Modificar colores de los materiales
    GM_addStyle(`
        #woodDisplay, #stoneDisplay, #foodDisplay {
            color: #8ad689 !important;
        }
    `);

    // Modificar colores del leaderboard
    GM_addStyle(`
        #leaderboard {
            border: 4px solid #8ad689;
            border-radius: 5px;
            color: #8ad689;
        }

        .leaderboard-entry {
            background-color: #b3c1ff;
        }

        .leaderboard-entry-name {
            color: #8ad689 !important;
        }
    `);

    // Agregar imagen de fondo en el lobby
    GM_addStyle(`
        .app {
            background-image: url('https://cdn.discordapp.com/attachments/1111932901500670005/1126470856227434556/24_sin_titulo_20230706131056.png') !important;
            background-size: cover !important;
        }
    `);

    // Agregar imagen de fondo en el mapa
    GM_addStyle(`
        #mapDisplay {
            background-image: url('https://media.discordapp.net/attachments/1129277020661100605/1157589876204646460/e9700a728c284924312f1a1479d8ee35.jpg?ex=65192915&is=6517d795&hm=44d41324182d77ade3d0420b31ebfac244f6b75b63c5dd88947bad94ebde53ba&');
            background-size: cover;
            background-position: center;
            background-repeat: repeat;
            border: 4px solid #8ad689;
            border-radius: 5px;
        }
    `);

    // Establecer un cursor personalizado
    GM_addStyle(`
        body {
            cursor: url('URL_DEL_CURSOR'), auto !important; // Reemplaza 'URL_DEL_CURSOR' con la URL de tu cursor personalizado
        }
    `);

    // Auto "gg" on kill code

    // Constants
    const msgpack5 = window.msgpack;

    // Variables
    let ws, prevCount = 0;

    // Functions

    const attachWebSocketListener = (e) => {
        e.addEventListener("message", hookWS);
    };

    const hookWS = (e) => {
    };

    const sendPacket = (e) => {
        if (ws) {
            ws.send(msgpack5.encode(e));
        }
    };

    const chat = (e) => {
        sendPacket(["6", [e]]);
    };

    // Override WebSocket's send method
    WebSocket.prototype.oldSend = WebSocket.prototype.send;

    WebSocket.prototype.send = function (e) {
        if (!ws) {
            [document.ws, ws] = [this, this];
            attachWebSocketListener(this);
        }
        this.oldSend(e);
    };

    // Mutation Observer
    const handleMutations = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.target.id === "killCounter") {
                const count = parseInt(mutation.target.innerText, 10) || 0;
                if (count > prevCount) {
                    chat("gg - MooVisuals v1.5");
                    prevCount = count;
                }
            }
        }
    };

    const observer = new MutationObserver(handleMutations);
    observer.observe(document, {
        subtree: true,
        childList: true,
    });

})();