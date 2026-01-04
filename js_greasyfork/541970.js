// ==UserScript==
// @name         IdlePixel Combat Preset Module (5+5)
// @namespace    theemarcel.idle-pixel
// @version      1.0.2
// @description  CombatPresets (5+5)
// @author       TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/541970/IdlePixel%20Combat%20Preset%20Module%20%285%2B5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541970/IdlePixel%20Combat%20Preset%20Module%20%285%2B5%29.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// Overall Declarations for different variables used throughout the script
	let IPP, getVar, getThis;
	const IMAGE_URL_BASE = document
	.querySelector("itembox[data-item=copper] img")
	.src.replace(/\/[^/]+.png$/, "");
	let loaded = false;
	let onLoginLoaded = false;

	// Start New Code Base Const/Functions
	const CpmMisc = function () {
		return {
			initStyles: function () {
				var style = document.createElement("style");
				style.id = "styles-presets";
				style.innerHTML = `
					#slapchop-quickpreset {
                        position: relative;
                    }

                    #slapchop-quickpreset > .slapchop-quickpreset-buttons {
						display: flex;
						flex-direction: row;
						justify-content: start;
					}

					#slapchop-quickpreset > .slapchop-quickpreset-buttons > div {
						display: flex;
						flex-direction: column;
						justify-content: start;
					}

					#slapchop-quickpreset button {
					margin: 0.125em;
					}

					.combat-presets-area,
					.combat-potions-area,
					.combat-cannon-area {
						vertical-align: text-top;
					}
				`;
				document.head.appendChild(style);
			},
		};
	};

	const CpmCombat = function () {
	window.SCUSERNAME = getVar("username", "", "string");

	window.SCRINGS = [
        "accuracy_ring",
        "ancient_accuracy_ring",
        "ancient_damage_ring",
        "ancient_defence_ring",
        "damage_ring",
        "defence_ring",
        "good_accuracy_ring",
        "good_damage_ring",
        "good_defence_ring",
        "great_accuracy_ring",
        "great_damage_ring",
        "great_defence_ring",
        "master_ring",
        "perfect_accuracy_ring",
        "perfect_damage_ring",
        "perfect_defence_ring",
        "weak_accuracy_ring",
        "weak_damage_ring",
        "weak_defence_ring",
    ];

		// Define keys for localStorage in a centralized manner
		const COMBAT_PRESETS_KEY = SCUSERNAME + ".combat_presets";

	return {
		loadPresets: function (buttonNum) {
			// Suppress popup "Combat preset saved"
			const openImageModalOriginal = Modals.open_image_modal;
			Modals.open_image_modal = (title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable) => {
				if (message === "Successfully saved preset based on what you are currently wearing.") {
					return;
				}
				openImageModalOriginal(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable);
			}

			// Retrieve all presets from local storage
			let allPresets =
				JSON.parse(localStorage.getItem(COMBAT_PRESETS_KEY)) ||
				{};

			// Check if the requested preset exists
			if (!allPresets[buttonNum]) {
				console.error("Preset not found for button number:", buttonNum);
				return;
			}

			// Load the preset and equip each item
			IdlePixelPlus.sendMessage("UNEQUIP_ALL");
			allPresets[buttonNum].forEach((item) => {
				if (item) {
					IdlePixelPlus.sendMessage("EQUIP=" + item);
				}
			});
		},

		savePresets: function (buttonNum) {
			// Retrieve all presets from local storage, or initialize a new object if none exist
			let allPresets =
				JSON.parse(localStorage.getItem(COMBAT_PRESETS_KEY)) ||
				{};

			// Save current equipment settings into the relevant key of the allPresets object
			allPresets[buttonNum] = [
				getVar("head", null, "string"),
                getVar("body", null, "string"),
                getVar("legs", null, "string"),
                getVar("boots", null, "string"),
                getVar("gloves", null, "string"),
                getVar("amulet", null, "string"),
                getVar("weapon", null, "string"),
                getVar("shield", null, "string"),
                getVar("arrows", null, "string"),
			];

			// Update the single entry in local storage with the modified allPresets object
			localStorage.setItem(COMBAT_PRESETS_KEY, JSON.stringify(allPresets));
		},

		initQuickFight: async function () {
			let html = `
					<div id="slapchop-quickpreset">
						<h5>Quick Presets:</h5>
						<div class="slapchop-quickpreset-buttons">
							<div>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=1')">Save 1</button>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=1~1')">Load 1</button>
							</div>
							<div>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=2')">Save 2</button>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=2~1')">Load 2</button>
							</div>
							<div>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=3')">Save 3</button>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=3~1')">Load 3</button>
							</div>
							<div>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=4')">Save 4</button>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=4~1')">Load 4</button>
							</div>
							<div>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=5')">Save 5</button>
								<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=5~1')">Load 5</button>
							</div>
							<div>
								<button onclick="CpmCombat().savePresets(6)">Save 6</button>
								<button onclick="CpmCombat().loadPresets(6)">Load 6</button>
							</div>
							<div>
								<button onclick="CpmCombat().savePresets(7)">Save 7</button>
								<button onclick="CpmCombat().loadPresets(7)">Load 7</button>
							</div>
							<div>
								<button onclick="CpmCombat().savePresets(8)">Save 8</button>
								<button onclick="CpmCombat().loadPresets(8)">Load 8</button>
							</div>
							<div>
								<button onclick="CpmCombat().savePresets(9)">Save 9</button>
								<button onclick="CpmCombat().loadPresets(9)">Load 9</button>
							</div>
							<div>
								<button onclick="CpmCombat().savePresets(10)">Save 10</button>
								<button onclick="CpmCombat().loadPresets(10)">Load 10</button>
							</div>
						</div>
					</div>
					<div id="slapchop-managepresets">
                        <br>
                        <h5>Manage Presets:</h5>
                        <div>
                            <button style="margin-bottom: 0.2em" onclick="CpmCombat().importPresets()">&ensp;Import&ensp;</button>
                            <button style="margin-bottom: 0.2em" onclick="CpmCombat().exportPresets()">&ensp;Export&ensp;</button>
                        </div>
                        <div>
                            <input id="presets_text" type="text" style="width: 42%" readonly>
                        </div>
                    </div>
                    <div id="slapchop-rings">
                        <br>
                        <h5>Rings:</h5>
                        <div>
                            <button onclick="CpmCombat().equipAllRings()">&ensp;All&ensp;</button>
                            <button onclick="CpmCombat().unEquipAllRings()">&ensp;None&ensp;</button>
                        </div>
                    </div>
                    <hr>
                `;
				const slapchop_location = document.getElementById("slapchop-quickfight");
				const standard_location = document.getElementById("combat-stats").querySelectorAll("div")[4];
				if (slapchop_location) {
					slapchop_location.insertAdjacentHTML("afterend", html);
				} else if (standard_location) {
					standard_location.insertAdjacentHTML("afterend", html);
				}
			},

			initPresets: function () {
				const combatPresetsHtml = `
					<br />
					<br />
					<img data-tooltip="Presets 6" id="in-combat-presets-icon-6" onclick="CpmCombat().loadPresets(6)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets 7" id="in-combat-presets-icon-7" onclick="CpmCombat().loadPresets(7)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets 8" id="in-combat-presets-icon-8" onclick="CpmCombat().loadPresets(8)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets 9" id="in-combat-presets-icon-9" onclick="CpmCombat().loadPresets(9)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets 10" id="in-combat-presets-icon-10" onclick="CpmCombat().loadPresets(10)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<br />
                    <br />
                    <img id="in-combat-presets-equip-rings" onclick="CpmCombat().equipAllRings()" class="combat-presets-combat-icon hover w30" style="background-color: darkgreen" src="${IMAGE_URL_BASE}/rings_icon.png" title="Equip All Rings">
                    <img id="in-combat-presets-unequip-rings" onclick="CpmCombat().unEquipAllRings()" class="combat-presets-combat-icon hover w30" style="background-color: darkred" src="${IMAGE_URL_BASE}/rings_icon.png" title="All Rings">
				`;

				const combatPresetsArea = document.getElementById(
					"combat-presets-area"
				);
				if (combatPresetsArea) {
					combatPresetsArea.insertAdjacentHTML("beforeend", combatPresetsHtml);
				}
			},

			initPresetListener: function () {
				const KEY_ACTIONS = {
					"Digit6": () => CpmCombat().loadPresets(6), //key [6]
					"Digit7": () => CpmCombat().loadPresets(7), //key [7]
					"Digit8": () => CpmCombat().loadPresets(8), //key [8]
					"Digit9": () => CpmCombat().loadPresets(9), //key [9]
					"Digit0": () => CpmCombat().loadPresets(10), //key [0]
					"Minus": () => CpmCombat().equipAllRings(), //key [-]
					"Equal": () => CpmCombat().unEquipAllRings(), //key [=]
				};

				document.addEventListener("keyup", (e) => {
					const chatInput = document.getElementById("chat-area-input");
					let chatFocused = chatInput && document.activeElement === chatInput;
					let isRelevantPanel = [
						"panel-combat-canvas",
						"panel-combat",
						"panel-combat-canvas-raids",
					].includes(Globals.currentPanel);

					if (chatFocused || !isRelevantPanel) {
						return; // Early exit if chat is focused or the panel is not relevant
					}

					const action = KEY_ACTIONS[e.code];
					if (action) {
						action(); // Execute the action associated with the code
					}
				});
			},
			
			importPresets: function () {
                const raw_input = prompt("Paste here:");

                if (raw_input == null){return;}

                localStorage.setItem(`${SCUSERNAME}.combat_presets`, raw_input);
            },

            exportPresets: function () {
                const raw_input = localStorage.getItem(`${SCUSERNAME}.combat_presets`);

                if (raw_input == null){return;}

                document.getElementById("presets_text").value = raw_input;
            },

            equipAllRings: function () {
                SCRINGS.forEach((ring) => {
                    if (
                        getVar(ring, 0, "int") != 0 &&
                        getVar(ring + "_equipped", 0, "int") == 0 &&
                        (getVar(ring + "_crafted", 0, "int") == 1 ||
                         getVar(ring + "_assembled", 0, "int") == 1)
                    ) {
                        IdlePixelPlus.sendMessage(`EQUIP_RING=${ring}`);
                    }
                });
            },

			unEquipAllRings: function () {
                SCRINGS.forEach((ring) => {
                    if (getVar(ring + "_equipped", 0, "int") == 1) {
                        IdlePixelPlus.sendMessage(`EQUIP_RING=${ring}`);
                    }
                });
            },
		};
	};

	window.CpmMisc = CpmMisc;
	window.CpmCombat = CpmCombat;

	// End New Code Base Const/Functions

	class PresetModule extends IdlePixelPlusPlugin {
		constructor() {
			super("PresetModule2", {
				about: {
					name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description,
				},
				config: [
					{
                        label:
                        "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label",
                    },
					{
                        id: "quickManagePresetsEnabled",
                        label: "Manage Presets: Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickRingsEnabled",
                        label: "Quick Rings: Enabled",
                        type: "boolean",
                        default: true,
                    },
				],
			});
		}
		
		onConfigsChanged() {
			if (onLoginLoaded) {
				const slapchopQuickManagePreset = document.getElementById(
                    "slapchop-managepresets"
                );
                const slapchopQuickRings = document.getElementById(
                    "slapchop-rings"
                );
				
				if (getThis.getConfig("quickManagePresetsEnabled")) {
                    slapchopQuickManagePreset.style.display = "block";
                } else {
                    slapchopQuickManagePreset.style.display = "none";
                }

                if (getThis.getConfig("quickRingsEnabled")) {
                    slapchopQuickRings.style.display = "block";
                } else {
                    slapchopQuickRings.style.display = "none";
                }
			}
		}

		onLogin() {
			IPP = IdlePixelPlus;
			getVar = IdlePixelPlus.getVarOrDefault;
			getThis = IdlePixelPlus.plugins.PresetModule2;
            if (getVar("combat_presets", 0, "int") == 1) {
                CpmMisc().initStyles();
                CpmCombat().initQuickFight();
                CpmCombat().initPresets();
                CpmCombat().initPresetListener();
				
				setTimeout(function () {
					onLoginLoaded = true;
					IdlePixelPlus.plugins.slapchop.onConfigsChanged();
					}, 5000);
				loaded = true;
			}
		}
	}

	const plugin = new PresetModule();
	IdlePixelPlus.registerPlugin(plugin);
})();