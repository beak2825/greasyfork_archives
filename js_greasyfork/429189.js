// ==UserScript==
// @name         3DNexus
// @namespace    https://duelingnexus.com/
// @version      0.2
// @description  Adding perspective view to Nexus.
// @author       yaya
// @match        https://ptr.duelingnexus.com/game/*
// @icon         https://www.google.com/s2/favicons?domain=duelingnexus.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429189/3DNexus.user.js
// @updateURL https://update.greasyfork.org/scripts/429189/3DNexus.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const gameHandContainer = document.createElement("div");
    document.getElementById("game-field-container").parentNode.appendChild(gameHandContainer);
    gameHandContainer.appendChild(document.getElementById("game-field-player-hand"));
    gameHandContainer.appendChild(document.getElementById("game-field-opponent-hand"));

    document.getElementById("game-turn-display").parentNode.setAttribute("id", "game-phases");

    GM_addStyle(`
        /*3D Styling*/
        #game-field-container {
            transform: perspective(30rem) rotateX(
        22deg
        ) translate(1.7%, -10%) scaleX(1.1);
            image-rendering: pixelated;
        }
        #game-field-player-hand {
            transform: translate(22%, -98%) scale(1.1);
            position: absolute;
        }
        #game-field-opponent-hand {
            transform: translate(22%, -671%) scale(0.7);
            position: absolute;
        }

        /*Essential Fixes*/
        #game-cancel-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 110px !important;
        }
        #game-force-chain-button {
            position: fixed;
            bottom: 70px;
            right: 30px;
            width: 110px !important;
        }
        #game-phases {
            transform: translate(-74%, -55%);
        }

        /*Non-essential fixes*/
        .engine-window {
            margin-left: 55.2%;
        }
    `)
})();