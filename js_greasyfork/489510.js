// ==UserScript==
// @name         IdlePixel Brewing Quick Filter
// @namespace    com.zlef.idlepixel
// @version      1.1.0
// @description  Adds quick filter buttons for monster, rocket and rotten, as well as a clear button. Can be configured in the plugin options.
// @author       Zlef
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/489510/IdlePixel%20Brewing%20Quick%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/489510/IdlePixel%20Brewing%20Quick%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class BrewFilter extends IdlePixelPlusPlugin {
        constructor() {
            super("brew_filter", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: "label",
                        label: "Specify filter buttons. Separate by comma only:"
                    },
                    {
                        id: "filters",
                        label: "Brewing filter buttons",
                        type: "string",
                        max: 200000,
                        default: "monster,rocket,rotten"
                    }
                ]
            });

            this.filterButtons = [];
            this.buttonElements = {};
            this.first_load = true;
        }

        onConfigsChanged() {
            this.filterButtons = IdlePixelPlus.plugins.brew_filter.getConfig("filters").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
            if (this.first_load){
                this.first_load = false;
            } else {
                this.updateFilterButtons();
            }
        }

        onLogin() {
            this.searchBarInput = document.querySelector('input[onkeyup="Brewing.search(this)"]');
            this.searchBarDiv = this.searchBarInput.parentElement;

            if (!this.clearButton) { // Check if clearButton already exists
                this.clearButton = this.createButton('Clear', () => {
                    this.searchBarInput.value = '';
                    Brewing.search(this.searchBarInput);
                });
                this.searchBarDiv.appendChild(this.clearButton);
            }

            this.updateFilterButtons();
        }

        updateFilterButtons() {
            // Remove buttons that are not in the filterButtons array anymore
            for (let key in this.buttonElements) {
                if (!this.filterButtons.includes(key)) {
                    this.searchBarDiv.removeChild(this.buttonElements[key]);
                    delete this.buttonElements[key];
                }
            }

            // Add new buttons
            this.filterButtons.forEach(filter => {
                if (!this.buttonElements[filter]) { // Check if button for this filter already exists
                    const button = this.createButton(filter, () => {
                        this.searchBarInput.value = filter;
                        Brewing.search(this.searchBarInput);
                    });
                    this.searchBarDiv.appendChild(button);
                    this.buttonElements[filter] = button;
                }
            });
        }

        createButton(text, onclickFunction) {
            const button = document.createElement('button');
            button.textContent = text;
            button.type = 'button';
            button.onclick = onclickFunction;
            button.style.marginLeft = '5px';
            button.classList.add('btn-sm');
            return button;
        }
    }

    const plugin = new BrewFilter();
    IdlePixelPlus.registerPlugin(plugin);
})();


