// ==UserScript==
// @name         IdlePixel Loopy
// @namespace    com.zlef.idlepixel
// @version      1.0.0
// @description  Very important loopy
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/489834/IdlePixel%20Loopy.user.js
// @updateURL https://update.greasyfork.org/scripts/489834/IdlePixel%20Loopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Loopy extends IdlePixelPlusPlugin {
        constructor() {
            super("loopy", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            const username = IdlePixelPlus.getVar('username');
            const tcg_active = IdlePixelPlus.getVarOrDefault('tcg_active', 0, "int");
            console.log(username);
            this.checkRottenPotionTimer();

            if (tcg_active == 1){
                console.log("tcg timer active");
                this.checkTCGTimer();
            } else{
                console.log("tcg timer not active");
            }

        }

        checkTCGTimer() {
            const checkTCG = async () => {
                let tcg_timer = IdlePixelPlus.getVarOrDefault(`tcg_timer`, 0, "int");
                let criptoe = IdlePixelPlus.getVarOrDefault(`criptoe`, 0, "int");
                if (tcg_timer === 0 && criptoe >= 50000) {
                    IdlePixelPlus.sendMessage(`BUY_TCG=3`);
                    // Check every 10 seconds for a confirmation of purchase
                    const confirmBuy = setInterval(async () => {
                        tcg_timer = IdlePixelPlus.getVarOrDefault(`tcg_timer`, 0, "int");
                        if (tcg_timer > 0) {
                            clearInterval(confirmBuy);
                            console.log("TCG purchase confirmed.");
                        }
                    }, 10000);
                }
            };

            setInterval(() => {
                checkTCG();
            }, 60000);
        }

        checkRottenPotionTimer() {
            const checkRottenPotion = async () => {
                let rotten_potion = IdlePixelPlus.getVarOrDefault(`rotten_potion`, 0, "int");
                let rotten_potion_timer = IdlePixelPlus.getVarOrDefault(`rotten_potion_timer`, 0, "int");
                if (rotten_potion > 0 && rotten_potion_timer === 0) {
                    IdlePixelPlus.sendMessage('BREWING_DRINK_ROTTEN_POTION');
                    // Check every 10 seconds for a confirmation of brewing
                    const confirmBrew = setInterval(async () => {
                        rotten_potion_timer = IdlePixelPlus.getVarOrDefault(`rotten_potion_timer`, 0, "int");
                        if (rotten_potion_timer > 0) {
                            clearInterval(confirmBrew);
                            console.log("Rotten potion brewing confirmed.");
                        }
                    }, 10000);
                }
            };

            setInterval(() => {
                checkRottenPotion();
            }, 60000);
        }
    }

    // Update class initializer
    const plugin = new Loopy();
    IdlePixelPlus.registerPlugin(plugin);

})();
