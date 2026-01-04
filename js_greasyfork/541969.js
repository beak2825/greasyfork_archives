// ==UserScript==
// @name         IdlePixel Combat Preset Module (5x5)
// @namespace    theemarcel.idle-pixel
// @version      1.0.2
// @description  CombatPresets (5x5)
// @author       TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/541969/IdlePixel%20Combat%20Preset%20Module%20%285x5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541969/IdlePixel%20Combat%20Preset%20Module%20%285x5%29.meta.js
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

					#combat-stats #slapchop-quickpreset > .slapchop-quickpreset-buttons {
						display: grid;
						grid-template-columns: auto auto;
						justify-content: start;
						column-gap: 1em;
					}

					#combat-stats #slapchop-quickpreset > .slapchop-quickpreset-buttons > div {
						display: flex;
						flex-direction: row;
						justify-content: flex-start;
					}

					#combat-stats #slapchop-quickpreset > .slapchop-quickpreset-buttons > div > div {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
					}

					#slapchop-quickpreset-buttons-unlink,
					#slapchop-quickpreset-buttons-unlink-lock {
					font-size: 0.8em;
					}

					#slapchop-quickpreset-buttons-unlink.current-group-0,
					#slapchop-quickpreset-buttons-unlink-lock.current-group-99,
					#combat-stats #slapchop-quickpreset-buttons-groups.current-group-6 > .slapchop-quickpreset-buttons-group6 > button,
					#combat-stats #slapchop-quickpreset-buttons-groups.current-group-7 > .slapchop-quickpreset-buttons-group7 > button,
					#combat-stats #slapchop-quickpreset-buttons-groups.current-group-8 > .slapchop-quickpreset-buttons-group8 > button,
					#combat-stats #slapchop-quickpreset-buttons-groups.current-group-9 > .slapchop-quickpreset-buttons-group9 > button,
					#combat-stats #slapchop-quickpreset-buttons-groups.current-group-10 > .slapchop-quickpreset-buttons-group10 > button,
					#in-combat-presets-icon-6.current,
					#in-combat-presets-icon-7.current,
					#in-combat-presets-icon-8.current,
					#in-combat-presets-icon-9.current,
					#in-combat-presets-icon-10.current {
						background-color: limegreen;
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
		const COMBAT_PRESETS_LINK_KEY = SCUSERNAME + ".combat_presets_link";

	return {
		loadPresetGroups: function (buttonNum) {
			// Suppress popup "Combat preset saved"
			const openImageModalOriginal = Modals.open_image_modal;
			Modals.open_image_modal = (title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable) => {
				if (message === "Successfully saved preset based on what you are currently wearing.") {
					return;
				}
				openImageModalOriginal(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable);
			}

			// Set shortcut number presets to 1-5
			for (let combatpresetNum = 1; combatpresetNum < 6; combatpresetNum++) {
				let presetName = `CombatPreset ${buttonNum * 10 + combatpresetNum}`;

				// Retrieve all presets from local storage
				let allPresets =
					JSON.parse(localStorage.getItem(COMBAT_PRESETS_KEY)) ||
					{};

				// Check if the requested preset exists
				if (!allPresets[presetName]) {
					console.error("Preset not found for button number:", presetName);
					return;
				}

				// Load the preset and equip each item
				IdlePixelPlus.sendMessage("UNEQUIP_ALL");
				allPresets[presetName].forEach((item) => {
					if (item) {
						IdlePixelPlus.sendMessage("EQUIP=" + item);
					}
				});
				IdlePixelPlus.sendMessage(`PRESET_SAVE=${combatpresetNum}`);
			}
			IdlePixelPlus.sendMessage('PRESET_LOAD=1~1');

			CpmCombat().saveLinkedPresetNum(buttonNum);
		},

		savePresetGroups: function (buttonNum) {
			// Presets 1-5 are saved as shortcut numbers
			for (let combatpresetNum = 1; combatpresetNum < 6; combatpresetNum++) {
				let presetName = `CombatPreset ${buttonNum * 10 + combatpresetNum}`;

				// Retrieve all presets from local storage, or initialize a new object if none exist
				let allPresets =
					JSON.parse(localStorage.getItem(COMBAT_PRESETS_KEY)) ||
					{};

				// Save current equipment settings into the relevant key of the allPresets object
				allPresets[presetName] = [
					getVar(`preset_head_${combatpresetNum}`, null, "string"),
					getVar(`preset_body_${combatpresetNum}`, null, "string"),
					getVar(`preset_legs_${combatpresetNum}`, null, "string"),
					getVar(`preset_boots_${combatpresetNum}`, null, "string"),
					getVar(`preset_gloves_${combatpresetNum}`, null, "string"),
					getVar(`preset_amulet_${combatpresetNum}`, null, "string"),
					getVar(`preset_weapon_${combatpresetNum}`, null, "string"),
					getVar(`preset_shield_${combatpresetNum}`, null, "string"),
					getVar(`preset_arrows_${combatpresetNum}`, null, "string"),
				];

				// Update the single entry in local storage with the modified allPresets object
				localStorage.setItem(COMBAT_PRESETS_KEY, JSON.stringify(allPresets));
			}

			CpmCombat().saveLinkedPresetNum(buttonNum);
		},

		saveCurrentPresets: function (buttonNum) {
			IdlePixelPlus.sendMessage(`PRESET_SAVE=${buttonNum}`)

			// Get linked preset numbers
			const LinkedPresetNum =
				  JSON.parse(localStorage.getItem(COMBAT_PRESETS_LINK_KEY)) ||
				  0;
			if (LinkedPresetNum === 0 || LinkedPresetNum === 99) {
				return;
			}

			CpmCombat().savePresetGroups(LinkedPresetNum);

			let presetName = `CombatPreset ${LinkedPresetNum * 10 + buttonNum}`;

			// Retrieve all presets from local storage, or initialize a new object if none exist
			let allPresets =
				JSON.parse(localStorage.getItem(COMBAT_PRESETS_KEY)) ||
				{};

			// Save current equipment settings into the relevant key of the allPresets object
			allPresets[presetName] = [
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

		saveLinkedPresetNum: function (buttonNum) {
			const LinkedPresetNum =
				  JSON.parse(localStorage.getItem(COMBAT_PRESETS_LINK_KEY)) ||
				  0;

			// Lock button on/off switching
			if (LinkedPresetNum === 99) {
				if (buttonNum === 99) {
					buttonNum = 0;
				} else {
					return;
				}
			}

			localStorage.setItem(COMBAT_PRESETS_LINK_KEY, buttonNum);

			CpmCombat().removeHighlightPresetButtons();
			CpmCombat().highlightPresetButtons();
		},

		highlightPresetButtons: function () {
			// Retrieve the preset number from localStorage (default to 0 if not found)
			const LinkedPresetNum =
				  JSON.parse(localStorage.getItem(COMBAT_PRESETS_LINK_KEY)) || 0;

			if (LinkedPresetNum >= 6 && LinkedPresetNum <= 10) {
				// For numbers between 6 and 10, apply a highlight to the corresponding group and icon
				const groupElem = document.getElementById("slapchop-quickpreset-buttons-groups");
				if (groupElem) {
					groupElem.className = "current-group-" + LinkedPresetNum;
				}
				const iconElem = document.getElementById("in-combat-presets-icon-" + LinkedPresetNum);
				if (iconElem) {
					iconElem.classList.add("current");
				}
			} else {
				const unlinkElem = document.getElementById("slapchop-quickpreset-buttons-unlink");
				if (unlinkElem) {
					// If LinkedPresetNum is 0, apply highlight to the unlink button
					unlinkElem.className = "current-group-0";
				}
				if (LinkedPresetNum === 99) {
					// If LinkedPresetNum is 99, apply highlight to the unlink-lock button
					const unlinkLockElem = document.getElementById("slapchop-quickpreset-buttons-unlink-lock");
					if (unlinkLockElem) {
						unlinkLockElem.className = "current-group-99";
					}
				}
			}
		},

		removeHighlightPresetButtons: function () {
			// Remove highlight for the entire preset group container
			const groupElem = document.getElementById("slapchop-quickpreset-buttons-groups");
			if (groupElem) {
				groupElem.className = ""; // Reset the container's class
			}

			// Remove highlights from preset icons for groups 6 to 10
			for (let i = 6; i <= 10; i++) {
				const iconElem = document.getElementById("in-combat-presets-icon-" + i);
				if (iconElem) {
					iconElem.classList.remove("current");
				}
			}

			// Remove highlights from the unlink and unlink-lock buttons
			const unlinkElem = document.getElementById("slapchop-quickpreset-buttons-unlink");
			if (unlinkElem) {
				unlinkElem.className = "";
			}
			const unlinkLockElem = document.getElementById("slapchop-quickpreset-buttons-unlink-lock");
			if (unlinkLockElem) {
				unlinkLockElem.className = "";
			}
		},

		initQuickFight: async function () {
			let html = `
					<div id="slapchop-quickpreset">
						<div class="slapchop-quickpreset-buttons">
							<h5>Quick Current Presets:</h5>
							<h5>Current Preset Groups:
								<button id="slapchop-quickpreset-buttons-unlink" onclick="CpmCombat().saveLinkedPresetNum(0)">Unlink Current Gr</button>
								≪
								<button id="slapchop-quickpreset-buttons-unlink-lock" onclick="CpmCombat().saveLinkedPresetNum(99)">Lock</button>
							</h5>
							<div>
								<div>
									<button onclick="CpmCombat().saveCurrentPresets(1);">Save 1</button>
									<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=1~1')">Load 1</button>
								</div>
								<div>
									<button onclick="CpmCombat().saveCurrentPresets(2);">Save 2</button>
									<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=2~1')">Load 2</button>
								</div>
								<div>
									<button onclick="CpmCombat().saveCurrentPresets(3);">Save 3</button>
									<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=3~1')">Load 3</button>
								</div>
								<div>
									<button onclick="CpmCombat().saveCurrentPresets(4);">Save 4</button>
									<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=4~1')">Load 4</button>
								</div>
								<div>
									<button onclick="CpmCombat().saveCurrentPresets(5);">Save 5</button>
									<button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=5~1')">Load 5</button>
								</div>
							</div>
							<div id="slapchop-quickpreset-buttons-groups" class="">
								<div class="slapchop-quickpreset-buttons-group6">
									<button onclick="CpmCombat().savePresetGroups(6)">Save Gr6</button>
									<button onclick="CpmCombat().loadPresetGroups(6)">Load Gr6</button>
								</div>
								<div class="slapchop-quickpreset-buttons-group7">
									<button onclick="CpmCombat().savePresetGroups(7)">Save Gr7</button>
									<button onclick="CpmCombat().loadPresetGroups(7)">Load Gr7</button>
								</div>
								<div class="slapchop-quickpreset-buttons-group8">
									<button onclick="CpmCombat().savePresetGroups(8)">Save Gr8</button>
									<button onclick="CpmCombat().loadPresetGroups(8)">Load Gr8</button>
								</div>
								<div class="slapchop-quickpreset-buttons-group9">
									<button onclick="CpmCombat().savePresetGroups(9)">Save Gr9</button>
									<button onclick="CpmCombat().loadPresetGroups(9)">Load Gr9</button>
								</div>
								<div class="slapchop-quickpreset-buttons-group10">
									<button onclick="CpmCombat().savePresetGroups(10)">Save Gr10</button>
									<button onclick="CpmCombat().loadPresetGroups(10)">Load Gr10</button>
								</div>
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
					<img data-tooltip="Presets group 6" id="in-combat-presets-icon-6" onclick="CpmCombat().loadPresetGroups(6)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets group 7" id="in-combat-presets-icon-7" onclick="CpmCombat().loadPresetGroups(7)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets group 8" id="in-combat-presets-icon-8" onclick="CpmCombat().loadPresetGroups(8)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets group 9" id="in-combat-presets-icon-9" onclick="CpmCombat().loadPresetGroups(9)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
					<img data-tooltip="Presets group 10" id="in-combat-presets-icon-10" onclick="CpmCombat().loadPresetGroups(10)" class="combat-presets-combat-icon hover w30" src="${IMAGE_URL_BASE}/melee.png" />
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
					"Digit6": () => CpmCombat().loadPresetGroups(6), //key [6]
					"Digit7": () => CpmCombat().loadPresetGroups(7), //key [7]
					"Digit8": () => CpmCombat().loadPresetGroups(8), //key [8]
					"Digit9": () => CpmCombat().loadPresetGroups(9), //key [9]
					"Digit0": () => CpmCombat().loadPresetGroups(10), //key [0]
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
			super("PresetModule1", {
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
			getThis = IdlePixelPlus.plugins.PresetModule1;
            if (getVar("combat_presets", 0, "int") == 1) {
                CpmMisc().initStyles();
                CpmCombat().initQuickFight();
                CpmCombat().initPresets();
                CpmCombat().initPresetListener();
                CpmCombat().highlightPresetButtons();
				
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