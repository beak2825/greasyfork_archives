// ==UserScript==
// @name         IdlePixel Criptoe Wallet Enhancer
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  Add criptoe to a wallet by percentage of total available criptoe
// @author       banban
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/490398/IdlePixel%20Criptoe%20Wallet%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/490398/IdlePixel%20Criptoe%20Wallet%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class UnwantedPopupSuppressorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("badPopups", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "criptoeSaveValue",
                        label: "Save this much criptoe when distributing percentages (useful for saving criptoe for cards)",
                        type: "number",
                        default: 1000000
                    }
                ]
            });
            this.previous = "";
        }
    }

    // Your code here...
})();