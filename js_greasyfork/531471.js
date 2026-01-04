// ==UserScript==
// @name         Tank Trouble "Helpers"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help you play tank trouble better
// @author       Psykos
// @match        https://tanktrouble.com/*
// @license      GPL-3.0
// @grant        none
// @require      https://update.greasyfork.org/scripts/482092/1309099/TankTrouble%20Development%20Library.js
// @downloadURL https://update.greasyfork.org/scripts/531471/Tank%20Trouble%20%22Helpers%22.user.js
// @updateURL https://update.greasyfork.org/scripts/531471/Tank%20Trouble%20%22Helpers%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class AprilFoolsMod extends TT.Mod {
        constructor() {
            super({
                id: 'april-fools',
                name: 'April Fools Message',
                version: '1.0'
            });
        }

        onLoad() {
            this.setupMessage();
        }

        setupMessage() {
            const message = document.createElement('div');
            message.innerHTML = `
                <style>
                    #april-fools-message {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 48px;
                        color: #ff4444;
                        text-align: center;
                        padding: 20px;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        z-index: 1000;
                    }
                </style>
                <div id="april-fools-message">April Fools!</div>
            `;
            document.body.appendChild(message);
        }
    }

    TT.registerMod(new AprilFoolsMod());
})();