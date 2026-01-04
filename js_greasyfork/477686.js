// ==UserScript==
// @name         Kewl RGB Notif
// @namespace    https://github.com/FalconiZzare
// @version      1.1
// @description  RGB Notif for TorrentBD
// @author       FalconiZzare
// @license      MIT
// @match        https://www.torrentbd.com/*
// @match        https://www.torrentbd.net/*
// @match        https://www.torrentbd.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torrentbd.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/477686/Kewl%20RGB%20Notif.user.js
// @updateURL https://update.greasyfork.org/scripts/477686/Kewl%20RGB%20Notif.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const variableSelector = "B"

    const cssVariables = {
        A: `#FFFF00, #FFFF00, #00FF00, #0099FF,
           #001AFF, #A200FF, #FF0055, #FF0000,
           #FF5900, #FF5900`,

        B: `#E84817, #B31451, #1A7EA2, #1A9E7F`,

        C: `#FF0000, #FFFF00, #00FF00, #0099FF,
            #001AFF, #A200FF, #A200FF, #FF0055,
            #FF0000, #FF0055`,

        D: `#FFFF00, #00FF00, #0099FF, #001AFF,
            #A200FF, #FF0055, #FF0000, #FF0055`
    }

    const notifCSS = `
        #notif-wrapper {
            margin-top: 1rem;
        }
        #notif-counter.z-depth-1 {
            position: relative;
            height: 42px;
            width: 350px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFF;
            font-size: 1.5em;
            font-weight: 500;
            font-family: Poppins, sans-serif;
            text-transform: capitalize;
            word-spacing: 1px;
            letter-spacing: 1px;
            background: #171B23;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }
        #notif-counter.z-depth-1 i {
            font-size: 1.2em;
            padding: 0;
        }
        #notif-counter.z-depth-1::before,
        #notif-counter.z-depth-1::after {
            content: '';
            z-index: -1;
            position: absolute;
            width: calc(100% + 6px);
            height: calc(100% + 6px);
            top: -3px;
            left: -3px;
            border-radius: 5px;
            background: linear-gradient(200deg, ${cssVariables[variableSelector]});
            background-size: 300%;
            animation: border 12s linear infinite;
        }
        #notif-counter.z-depth-1::after {
            filter: blur(12px);
        }
        #notif-container.z-depth-2 {
            position: relative;
            width: 550px;
            font-family: Poppins, sans-serif;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }
        #notif-container.z-depth-2::before,
        #notif-container.z-depth-2::after {
            content: '';
            z-index: -1;
            position: absolute;
            width: calc(100% + 6px);
            height: calc(100% + 6px);
            top: -3px;
            left: -3px;
            border-radius: 5px;
            background: linear-gradient(200deg, ${cssVariables[variableSelector]});
            background-size: 300%;
            animation: border 12s linear infinite;
        }
        #notif-container.z-depth-2::after {
            filter: blur(12px);
        }
        #notif-container-header {
            background: #171B23;
            border-radius: 4px 4px 0 0;
            align-items: center;
            padding: 4px 0 4px 0;
        }
        #notif-heading {
            margin-left: 4px;
        }
        #notif-container-header div {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #v-a-notif-btn {
            border-radius: 4px;
            transition: 300ms ease-in-out;
        }
        #v-a-notif-btn:hover {
            background: #2C3E50;
        }
        #notif-close-btn {
            background: transparent;
            border: 1px solid #CFD8DC;
            border-radius: 100px;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;
            margin-right: 8px;
            transition: 200ms ease-in-out;
        }
        #notif-close-btn:hover {
            background: #DF5353;
        }
        #notif-items-container {
            background: #2A2C32;
            border-radius: 0 0  4px 4px;
        }
        @keyframes border {
            0%,
            100% {
              background-position: 0 0;
            }

            50% {
              background-position: 100%;
            }
        }
    `;

    GM_addStyle(notifCSS);
})();
