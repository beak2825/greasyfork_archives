// ==UserScript==
// @name         IdlePixel Armour Uncrafter
// @namespace    lbtechnology.info
// @version      1.0.0
// @description  Uses needle to uncraft all armour pieces.
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idle-pixel.com
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/487943/IdlePixel%20Armour%20Uncrafter.user.js
// @updateURL https://update.greasyfork.org/scripts/487943/IdlePixel%20Armour%20Uncrafter.meta.js
// ==/UserScript==


(function() {
    'use strict';

    class LazyMode extends IdlePixelPlusPlugin {
        constructor() {
            super("uncrafter", {
                about: {
                    name: "IdlePixel Armour Uncrafter",
                    version: "1.0.1",
                    author: "Lux-Ferre",
                    description: "Uses needle to uncraft all armour pieces."
                }
            });
            this.autosmeltEnabled = false;
            this.selectedOreForAutosmelt = 'copper';

            this.autochopEnabled = false;

            this.autoFarmEnabled = false;
            this.selectedSeedForAutoFarm = 'dotted_green_leaf_seeds';

            this.autoBoatEnabled = false;
            this.selectedBoatForAutoBoat = 'canoe_boat';
        }

        onLogin() {
            this.username = document.querySelector('item-display[data-key="username"]').innerText;
            //if (this.username === "robozlef" || this.username === "zlef") {
            this.addControls();

            setTimeout(() => {
                this.clickAutosmeltBtn();
                this.checkForTreesReady();
            }, 3000);
            //}
        }

        addControls() {
            const topBar = document.getElementById('top-bar');
            if (topBar) {
                this.addAutosmeltControls(topBar);
                this.addAutochopControls(topBar);
                this.addAutoFarmControls(topBar);
                this.addAutoBoatControls(topBar);
            }
        }

        addAutosmeltControls() {
            const topBar = document.getElementById('top-bar');
            if (topBar) {
                // Dictionary for ore selection
                const oreDict = {'c': 'copper', 'i': 'iron', 's': 'silver', 'g': 'gold',
                                 'p': 'promethium', 't': 'titanium', 'a': 'ancient_ore',
                                 'd': 'dragon_ore'};

                // Dropdown for autosmelt ore selection
                const autosmeltOreSelect = document.createElement('select');
                for (const [key, value] of Object.entries(oreDict)) {
                    const option = document.createElement('option');
                    option.value = key;
                    option.textContent = key.toUpperCase();
                    autosmeltOreSelect.appendChild(option);
                }
                autosmeltOreSelect.addEventListener('change', () => {
                    this.selectedOreForAutosmelt = oreDict[autosmeltOreSelect.value];
                });
                autosmeltOreSelect.disabled = this.autosmeltEnabled;
                topBar.appendChild(autosmeltOreSelect);

                // Toggle button for autosmelt
                const autosmeltToggleButton = document.createElement('button');
                autosmeltToggleButton.textContent = 'Enable Autosmelt';
                autosmeltToggleButton.addEventListener('click', () => {
                    this.toggleAutosmeltFeature(autosmeltOreSelect, autosmeltToggleButton);
                });
                topBar.appendChild(autosmeltToggleButton);
            }
        }

        addAutoharvestControls(topBar) {
            // Toggle button for autoharvest
            const autoharvestToggleButton = document.createElement('button');
            autoharvestToggleButton.textContent = 'Enable Autoharvest';
            autoharvestToggleButton.addEventListener('click', () => {
                this.toggleAutoharvestFeature(autoharvestToggleButton);
            });
            topBar.appendChild(autoharvestToggleButton);
        }

        addAutochopControls(topBar) {
            // Toggle button for autochop
            const autochopToggleButton = document.createElement('button');
            autochopToggleButton.textContent = 'Enable Autochop';
            autochopToggleButton.addEventListener('click', () => {
                this.toggleAutochopFeature(autochopToggleButton);
            });
            topBar.appendChild(autochopToggleButton);
        }

        toggleAutosmeltFeature(autosmeltOreSelect, autosmeltToggleButton) {
            this.autosmeltEnabled = !this.autosmeltEnabled;
            autosmeltOreSelect.disabled = this.autosmeltEnabled;
            autosmeltToggleButton.textContent = this.autosmeltEnabled ? 'Disable Autosmelt' : 'Enable Autosmelt';
        }

        toggleAutochopFeature(autochopToggleButton) {
            this.autochopEnabled = !this.autochopEnabled;
            autochopToggleButton.textContent = this.autochopEnabled ? 'Disable Autochop' : 'Enable Autochop';
        }

        checkForTreesReady() {
            const treesReady = document.getElementById('notification-trees-ready');
            if (this.autochopEnabled && treesReady && treesReady.style.display !== 'none') {
                //treesReady.click();
                this.quickChop();
            }

            setTimeout(() => this.checkForTreesReady(), 1000);
        }

        quickChop() {
            for(let i = 1; i <= 5; i++) {
                let status = IdlePixelPlus.getVarOrDefault("tree_stage_"+i, 0, "int");
                if (status == 4){
                    IdlePixelPlus.sendMessage("CHOP_TREE="+i);
                }
                // let treeType = IdlePixelPlus.getVarOrDefault("tree_"+i, "none");
                // let sdCut = this.getConfig("quickChopSDTreesEnabled");
                // if((status == 4 && treeType != "stardust_tree" && treeType != "tree") || (status == 4 && treeType == "stardust_tree" && sdCut) || (status == 4 && treeType == "tree" && regCut)) {
                //     IdlePixelPlus.sendMessage("CHOP_TREE="+i);
                // }
            }
        }

        clickAutosmeltBtn() {
            const furnaceIdle = document.getElementById('notification-furnace-idle');
            if (this.autosmeltEnabled && furnaceIdle && furnaceIdle.style.display !== 'none') {
                const autosmeltButton = document.querySelector(`button[onclick="IdlePixelPlus.plugins.slapchop.quickSmelt('${this.selectedOreForAutosmelt}')"]`);
                if (autosmeltButton) {
                    autosmeltButton.click();
                }
            }
            setTimeout(() => this.clickAutosmeltBtn(), 1000);
        }

        addAutoFarmControls(topBar) {
            const donor = DonorShop.has_donor_active(Items.getItem("donor_farm_patches_timestamp"));
            this.maxPlot = donor ? 5 : 3;
            this.loopDelay = 500;
            const seedDict = {'dgl': 'dotted_green_leaf_seeds', 'grl': 'green_leaf_seeds',
                              'll': 'lime_leaf_seeds', 'gL': 'gold_leaf_seeds',
                              'cl': 'crystal_leaf_seeds', 'rms': 'red_mushroom_seeds',
                              'sds': 'stardust_seeds', 'tt': 'tree_seeds', 'ot': 'oak_tree_seeds',
                              'wt': 'willow_tree_seeds', 'mt': 'maple_tree_seeds',
                              'sdt': 'stardust_tree_seeds', 'pt': 'pine_tree_seeds',
                              'rt': 'redwood_tree_seeds'};

            // Dropdown for autofarm seed selection
            const autoFarmSeedSelect = document.createElement('select');
            for (const [key, value] of Object.entries(seedDict)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key.toUpperCase();
                autoFarmSeedSelect.appendChild(option);
            }
            autoFarmSeedSelect.addEventListener('change', () => {
                this.selectedSeedForAutoFarm = seedDict[autoFarmSeedSelect.value];
            });
            autoFarmSeedSelect.disabled = this.autoFarmEnabled;
            topBar.appendChild(autoFarmSeedSelect);

            // Toggle button for autofarm
            const autoFarmToggleButton = document.createElement('button');
            autoFarmToggleButton.textContent = 'Enable Autofarm';
            autoFarmToggleButton.addEventListener('click', () => {
                this.autoFarmEnabled = !this.autoFarmEnabled;
                autoFarmSeedSelect.disabled = this.autoFarmEnabled;
                autoFarmToggleButton.textContent = this.autoFarmEnabled ? 'Disable Autofarm' : 'Enable Autofarm';
                if (this.autoFarmEnabled) {
                    this.autoFarm(); // Start the farming loop
                }
            });
            topBar.appendChild(autoFarmToggleButton);
        }

        autoFarm() {
            if (this.autoFarmEnabled) {
                this.manageFarming();
                setTimeout(() => this.autoFarm(), this.loopDelay); // Recursive call with delay
            }
        }

        manageFarming() {
            for (let i = 1; i <= this.maxPlot; i++) {
                let farmStatus = IdlePixelPlus.getVarOrDefault(`farm_${i}`, 0, "int");
                let cropStage = IdlePixelPlus.getVarOrDefault(`farm_timer_${i}`, 0, "int");
                if (farmStatus === 0) {
                    IdlePixelPlus.sendMessage(`PLANT=${this.selectedSeedForAutoFarm}~${i}`); // Plant
                }
                if (cropStage === 1) {
                    IdlePixelPlus.sendMessage(`CLICKS_PLOT=${i}`); // Harvest
                }
            }
        }

        addAutoBoatControls(topBar) {
            const boatDict = {'r': 'row_boat', 'c': 'canoe_boat', 'sd': 'stardust_boat', 'p': 'pirate_ship', 's': 'submarine_boat'};

            // Dropdown for auto-boat selection
            const autoBoatSelect = document.createElement('select');
            for (const [key, value] of Object.entries(boatDict)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key.toUpperCase();
                autoBoatSelect.appendChild(option);
            }
            autoBoatSelect.addEventListener('change', () => {
                this.selectedBoatForAutoBoat = boatDict[autoBoatSelect.value];
            });
            autoBoatSelect.disabled = this.autoBoatEnabled;
            autoBoatSelect.value = 'c'; // Set canoe as default
            topBar.appendChild(autoBoatSelect);

            // Toggle button for auto-boat
            const autoBoatToggleButton = document.createElement('button');
            autoBoatToggleButton.textContent = 'Enable AutoBoat';
            autoBoatToggleButton.addEventListener('click', () => {
                this.autoBoatEnabled = !this.autoBoatEnabled;
                autoBoatSelect.disabled = this.autoBoatEnabled;
                autoBoatToggleButton.textContent = this.autoBoatEnabled ? 'Disable AutoBoat' : 'Enable AutoBoat';
                if (this.autoBoatEnabled) {
                    this.autoBoat();  // Start the boat loop
                }
            });
            topBar.appendChild(autoBoatToggleButton);
        }

        autoBoat() {
            if (this.autoBoatEnabled) {
                this.checkForBoatReady();  // Now we check for boats being ready
            }
        }

        checkForBoatReady() {
            if (!this.autoBoatEnabled) {
                // console.log("AutoBoat is disabled, exiting function.");
                return;
            }

            const boatReady = document.getElementById(`notification-${this.selectedBoatForAutoBoat}`);
            const boatIdle = document.getElementById('notification-boats-idle');
            const boatingDock = document.querySelector('[data-item="boating_dock"]');

            // console.log(`boatReady: ${!!boatReady}, boatIdle: ${!!boatIdle}, boatingDock: ${!!boatingDock}`);

            let activeBoats = 0;
            const boatTypes = ['row_boat', 'canoe_boat', 'stardust_boat', 'pirate_ship', 'submarine_boat'];

            for (const boatType of boatTypes) {
                const boatLabel = document.getElementById(`label-${boatType}`);
                if (boatLabel && boatLabel.textContent !== 'Idle') {
                    // console.log(`${boatType} is active.`);
                    activeBoats++;
                }
            }

            // console.log(`Total active boats: ${activeBoats}`);

            if (boatReady && boatReady.style.display !== 'none') {
                // console.log("Boat ready to collect from notification is visible, collecting boat.");
                IdlePixelPlus.sendMessage(`BOAT_COLLECT=${this.selectedBoatForAutoBoat}`);
            } else if (boatingDock && activeBoats === 1) {
                // console.log("Boating dock is visible and 1 boat is active, sending boat.");
                IdlePixelPlus.sendMessage(`BOAT_SEND=${this.selectedBoatForAutoBoat}`);
            } else if (activeBoats === 0) {
                // console.log("No active boats, sending boat.");
                IdlePixelPlus.sendMessage(`BOAT_SEND=${this.selectedBoatForAutoBoat}`);
            } else {
                // console.log("No matching conditions found.");
            }

            // console.log("Exiting checkForBoatReady function, will recheck in 5 seconds.");
            setTimeout(() => this.checkForBoatReady(), 5000); // Check again in 5 seconds
        }

    }

    const plugin = new LazyMode();
    IdlePixelPlus.registerPlugin(plugin);

})();