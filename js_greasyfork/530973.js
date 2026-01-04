// ==UserScript==
// @name         Heat Calculator
// @namespace    com.fargblindsmu.idlepixel
// @version      0.1
// @description  Calculates heat based on owned logs
// @author       fargblindsmurf
// @match        *://idle-pixel.com/login/play*
// @license      MIT
// @grant        none
// @icon https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/530973/Heat%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/530973/Heat%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const calculatorSettings = {
        crafting: {
            hide: true, // Default state: hidden
        }
    };

    const HEAT_OUTPUT_WITH_COOKING_PERK = {
        "normal_logs_output": 2,
        "oak_logs_output": 3,
        "willow_logs_output": 4,
        "maple_logs_output": 5,
        "stardust_logs_output": 6,
        "pine_logs_output": 7,
        "redwood_logs_output": 8
    };

    class HeatCalculatorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("HeatCalculator", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });

            this.logsCollected = 0; // Default
            this.normalLogsOutput = HEAT_OUTPUT_WITH_COOKING_PERK["normal_logs_output"];
        }

        /** Retrieves log count from the <item-display> element **/
        getLogsCollected() {
            let logElement = document.querySelector('item-display[data-key="maple_logs"]');

            if (logElement) {
                let logCount = parseInt(logElement.textContent.trim(), 10);
                console.log("Extracted log count:", logCount);
                return isNaN(logCount) ? 0 : logCount;
            } else {
                console.warn("Log count element not found!");
                return 0;
            }
        }

        injectHeatCalcUI() {
            this.logsCollected = this.getLogsCollected(); // Get the log count
            let totalHeat = this.logsCollected * this.normalLogsOutput;

            let target = $('#cooking').length ? '#cooking' : '#panel-cooking .progress-bar';

            if ($(target).length) {
                $(target).after(`
                    <hr>
                    <div style="display: flex; flex-direction: column;">
                        <h5>Heat Calculator: <button id="crafting-visibility-button">Hide</button></h5>
                        <div id="crafting-calculator-div" style="display: ${calculatorSettings.crafting.hide ? 'none' : 'block'};">
                            <div>
                                <span>
                                    Heat:
                                    <span id="heat-value">${totalHeat}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                `);

                document.querySelector("#crafting-visibility-button").addEventListener("click", () => {
                    handleVisibility("crafting");
                });
            } else {
                console.warn("Target element not found for UI injection!");
            }
        }

        updateHeatValue() {
            this.logsCollected = this.getLogsCollected(); // Refresh log count
            let totalHeat = this.logsCollected * this.normalLogsOutput;

            let heatElement = document.getElementById("heat-value");
            if (heatElement) {
                heatElement.textContent = totalHeat;
            }
        }

        onConfigsChanged() {
            this.updateHeatValue(); // Update heat when logs count changes
        }

        onLogin() {
            this.injectHeatCalcUI();
        }
    }

    function handleVisibility(key) {
        calculatorSettings[key].hide = !calculatorSettings[key].hide;

        document.querySelector(`#${key}-calculator-div`).style.display = calculatorSettings[key].hide ? 'none' : 'block';
        document.querySelector(`#crafting-visibility-button`).textContent = calculatorSettings[key].hide ? 'Show' : 'Hide';
    }

    const plugin = new HeatCalculatorPlugin();
    IdlePixelPlus.registerPlugin(plugin);

    // Update heat value every 5 seconds (in case logs change dynamically)
    setInterval(() => {
        plugin.updateHeatValue();
    }, 5000);
})();