// ==UserScript==
// @name         Idle Pixel Audio Alerts
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Audio Alerts for DHP
// @author       Felipe Dounford
// @require      https://greasyfork.org/scripts/461221-hack-timer-js-by-turuslan/code/Hack%20Timerjs%20By%20Turuslan.js?version=1159560
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @match        *://idle-pixel.com/login/play*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481988/Idle%20Pixel%20Audio%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/481988/Idle%20Pixel%20Audio%20Alerts.meta.js
// ==/UserScript==

(function() {
    'use strict';

	//Change ding url to set default sound
	let ding = 'https://raw.githubusercontent.com/Dounford-Felipe/Audio-Alerts/main/ding.wav'
	//Change defaultText to set default TTS Text
	let defaultText = 'Ready'
	let dropdownPresets = {
		"Key Items": ["Treasure Map", "Green Treasure Map", "Red Treasure Map","Moon Distance","Sun Distance"],
		Geodes: ["Grey Geode", "Blue Geode", "Green Geode", "Red Geode", "Cyan Geode", "Ancient Geode"],
		Resources: ["Oil", "Stardust", "Energy"],
		"Potions Timers": ["Stardust Potion", "Anti Disease", "Tree Speed", "Great Stardust", "Farming Speed", "Super Stardust", "Unique Gathering", "Heat", "Bait", "Bone", "Promethium", "Ultra Stardust", "Rocket Speed", "Titanium", "Geode", "Stone Converter", "Combat Loot", "Rotten", "Merchant Speed", "Ancient Ore", "Guardian Key"],
		Timers: ["Rocket", "Rocket Idle", "Beehive", "Aquarium", "Birdhouse", "Cook Book", "Crystal Ball", "Event Upcomming", "Row Boat", "Canoe Boat", "Stardust Boat", "Farm Timer 1", "Farm Timer 2", "Farm Timer 3", "Farm Timer 4", "Farm Timer 5", "Tree Timer 1", "Tree Timer 2", "Tree Timer 3", "Tree Timer 4", "Tree Timer 5"],
		"Fight Points": ["Fields", "Forest", "Caves", "Volcano", "Northern Fields", "Haunted Mansion", "Beach", "Blood Fields", "Blood Forest", "Blood Caves", "Blood Volcano", "Guardian 1", "Guardian 2", "Guardian 3", "Guardian 4"]
	}
	let Presets = {
		"treasureMap": {
			"name": "treasure_map",
			"type": "eq",
			"value": "1"
		},
		"greenTreasureMap": {
			"name": "green_treasure_map",
			"type": "eq",
			"value": "1"
		},
		"redTreasureMap": {
			"name": "red_treasure_map",
			"type": "eq",
			"value": "1"
		},
		"moonDistance": {
			"name": "moon_distance",
			"type": "le",
			"value": "300000"
		},
		"sunDistance": {
			"name": "sun_distance",
			"type": "le",
			"value": "130000000"
		},
		"greyGeode": {
			"name": "grey_geode",
			"type": "gt",
			"value": "5"
		},
		"blueGeode": {
			"name": "blue_geode",
			"type": "gt",
			"value": "5"
		},
		"greenGeode": {
			"name": "green_geode",
			"type": "gt",
			"value": "5"
		},
		"redGeode": {
			"name": "red_geode",
			"type": "gt",
			"value": "5"
		},
		"cyanGeode": {
			"name": "cyan_geode",
			"type": "gt",
			"value": "5"
		},
		"ancientGeode": {
			"name": "ancient_geode",
			"type": "gt",
			"value": "5"
		},
		"oil": {
			"name": "oil",
			"type": "ge",
			"value": "25000"
		},
		"stardust": {
			"name": "stardust",
			"type": "ge",
			"value": "2000000"
		},
		"energy": {
			"name": "energy",
			"type": "lt",
			"value": "10000"
		},
		"stardustPotion": {
			"name": "stardust_potion_timer",
			"type": "le",
			"value": "10"
		},
		"antiDisease": {
			"name": "anti_disease_potion_timer",
			"type": "le",
			"value": "10"
		},
		"treeSpeed": {
			"name": "tree_speed_potion_timer",
			"type": "le",
			"value": "10"
		},
		"greatStardust": {
			"name": "great_stardust_potion_timer",
			"type": "le",
			"value": "10"
		},
		"farmingSpeed": {
			"name": "farming_speed_potion_timer",
			"type": "le",
			"value": "10"
		},
		"superStardust": {
			"name": "super_stardust_potion_timer",
			"type": "le",
			"value": "10"
		},
		"uniqueGathering": {
			"name": "gathering_unique_potion_timer",
			"type": "le",
			"value": "10"
		},
		"heat": {
			"name": "heat_potion_timer",
			"type": "le",
			"value": "10"
		},
		"bait": {
			"name": "bait_potion_timer",
			"type": "le",
			"value": "10"
		},
		"bone": {
			"name": "bone_potion_timer",
			"type": "le",
			"value": "10"
		},
		"promethium": {
			"name": "promethium_potion_timer",
			"type": "le",
			"value": "10"
		},
		"ultraStardust": {
			"name": "ultra_stardust_potion_timer",
			"type": "le",
			"value": "10"
		},
		"rocketSpeed": {
			"name": "rocket_potion_timer",
			"type": "le",
			"value": "10"
		},
		"titanium": {
			"name": "titanium_potion_timer",
			"type": "le",
			"value": "10"
		},
		"geode": {
			"name": "geode_potion_timer",
			"type": "le",
			"value": "10"
		},
		"stoneConverter": {
			"name": "stone_converter_potion_timer",
			"type": "le",
			"value": "10"
		},
		"combatLoot": {
			"name": "combat_loot_potion_timer",
			"type": "le",
			"value": "10"
		},
		"rotten": {
			"name": "rotten_potion_timer",
			"type": "le",
			"value": "10"
		},
		"merchantSpeed": {
			"name": "merchant_speed_potion_timer",
			"type": "le",
			"value": "10"
		},
		"ancientOre": {
			"name": "ancient_ore_potion_timer",
			"type": "le",
			"value": "10"
		},
		"guardianKey": {
			"name": "guardian_key_potion_timer",
			"type": "le",
			"value": "10"
		},
		"rocket": {
			"name": "rocket_km",
			"type": "eq",
			"value": "0"
		},
		"rocketIdle": {
			"name": "rocket_status",
			"type": "eq",
			"value": "none"
		},
		"beehive": {
			"name": "beehive_timer",
			"type": "eq",
			"value": "1"
		},
		"aquarium": {
			"name": "aquarium_timer",
			"type": "eq",
			"value": "0"
		},
		"birdhouse": {
			"name": "birdhouse_timer",
			"type": "eq",
			"value": "1"
		},
		"cookBook": {
			"name": "cooks_book_timer",
			"type": "eq",
			"value": "1"
		},
		"crystalBall": {
			"name": "crystal_ball_timer",
			"type": "eq",
			"value": "0"
		},
		"eventUpcomming": {
			"name": "event_upcomming_timer",
			"type": "ne",
			"value": "0"
		},
		"rowBoat": {
			"name": "row_boat_timer",
			"type": "eq",
			"value": "1"
		},
		"canoeBoat": {
			"name": "canoe_boat_timer",
			"type": "eq",
			"value": "1"
		},
		"stardustBoat": {
			"name": "stardust_boat_timer",
			"type": "eq",
			"value": "1"
		},
		"farmTimer1": {
			"name": "farm_timer_1",
			"type": "eq",
			"value": "1"
		},
		"farmTimer2": {
			"name": "farm_timer_2",
			"type": "eq",
			"value": "1"
		},
		"farmTimer3": {
			"name": "farm_timer_3",
			"type": "eq",
			"value": "1"
		},
		"farmTimer4": {
			"name": "farm_timer_4",
			"type": "eq",
			"value": "1"
		},
		"farmTimer5": {
			"name": "farm_timer_5",
			"type": "eq",
			"value": "1"
		},
		"treeTimer1": {
			"name": "tree_timer_1",
			"type": "eq",
			"value": "1"
		},
		"treeTimer2": {
			"name": "tree_timer_2",
			"type": "eq",
			"value": "1"
		},
		"treeTimer3": {
			"name": "tree_timer_3",
			"type": "eq",
			"value": "1"
		},
		"treeTimer4": {
			"name": "tree_timer_4",
			"type": "eq",
			"value": "1"
		},
		"treeTimer5": {
			"name": "tree_timer_5",
			"type": "eq",
			"value": "1"
		},
		"fields": {
			"name": "fight_points",
			"type": "ge",
			"value": "300"
		},
		"forest": {
			"name": "fight_points",
			"type": "ge",
			"value": "600"
		},
		"caves": {
			"name": "fight_points",
			"type": "ge",
			"value": "900"
		},
		"volcano": {
			"name": "fight_points",
			"type": "ge",
			"value": "1500"
		},
		"northernFields": {
			"name": "fight_points",
			"type": "ge",
			"value": "2000"
		},
		"hauntedMansion": {
			"name": "fight_points",
			"type": "ge",
			"value": "3500"
		},
		"beach": {
			"name": "fight_points",
			"type": "ge",
			"value": "5000"
		},
		"bloodFields": {
			"name": "fight_points",
			"type": "ge",
			"value": "1000"
		},
		"bloodForest": {
			"name": "fight_points",
			"type": "ge",
			"value": "2000"
		},
		"bloodCaves": {
			"name": "fight_points",
			"type": "ge",
			"value": "3500"
		},
		"bloodVolcano": {
			"name": "fight_points",
			"type": "ge",
			"value": "5000"
		},
		"guardian1": {
			"name": "fight_points",
			"type": "ge",
			"value": "4000"
		},
		"guardian2": {
			"name": "fight_points",
			"type": "ge",
			"value": "6000"
		},
		"guardian3": {
			"name": "fight_points",
			"type": "ge",
			"value": "10000"
		},
		"guardian4": {
			"name": "fight_points",
			"type": "ge",
			"value": "10000"
		}
	}



    class AlertsPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("alerts", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
			this.muteAllAlerts = false;
			this.alertVolume = 100;
			this.alertVoices = [];
			this.alertVoice = '';
			this.alerts = [];
        }
 
        onLogin() {
			IdlePixelPlus.plugins.alerts.addUI()
			IdlePixelPlus.plugins.alerts.loadAlerts()
			IdlePixelPlus.plugins.alerts.addDropdown()
			speechSynthesis.onvoiceschanged = function () {
				IdlePixelPlus.plugins.alerts.getVoices()
			}
			const alertLoopInterval = setInterval(function(){
				IdlePixelPlus.plugins.alerts.newValue()
				IdlePixelPlus.plugins.alerts.alertLoop()
			}, 1000);
        }
    
		//Gets the tts voices, populate the select with them and set the current voice
		getVoices() {
			IdlePixelPlus.plugins.alerts.alertVoices = speechSynthesis.getVoices();
			const voiceSelect = document.getElementById('ttsVoices');
			IdlePixelPlus.plugins.alerts.alertVoices.forEach((voice, index) => {
				const option = document.createElement('option');
				option.value = index;
				option.textContent = voice.name;
				voiceSelect.appendChild(option);
			});
			// Set the current voice based on the value stored in localStorage or use the first voice
			IdlePixelPlus.plugins.alerts.alertVoice = localStorage.getItem('audioAlertsVoice') ? IdlePixelPlus.plugins.alerts.alertVoices[localStorage.getItem('audioAlertsVoice')] : IdlePixelPlus.plugins.alerts.alertVoices[0]
			document.getElementById('ttsVoices').value = localStorage.getItem('audioAlertsVoice') ? localStorage.getItem('audioAlertsVoice') : 0
		}

		//Adds the table and Style
		addUI() {
			if (document.querySelector('.dounModalDim') == null) {
				let style = document.createElement('style');
				style.innerHTML = `
					.dounModalParent {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0px;
					}
					.dounModalDim {
						background-color: black;
						opacity: 0.7;
						width: 100%;
						height: 100%;
						position: absolute;
					}
					.dounModalContent {
						margin-right: auto;
						margin-left: auto;
						width: 35%;
						border-radius: 5px;
						top: 100px;
						position: sticky;
					}`;
				document.head.appendChild(style);	
			}
			let alertTable = `<table class="table table-secondary table-bordered table-striped" style="text-align: center;font-weight: bold;text-shadow: 1px 1px white;">
				<thead style="vertical-align: middle;">
					<tr>
						<th style="width: 30%;">Variable</th>
						<th style="width: 10%;" colspan="2">Trigger</th>
						<th style="width: 10%;">Current Value</th>
						<th style="width: 10%;">Sound Type</th>
						<th style="width: 20%;">Option</th>
						<th style="width: 10%;">Enabled</th>
						<th></th>
					</tr>
				</thead>
				<tbody id="alertsBody">
				</tbody>
				<tfoot>
					<tr id="alertsFooter">
						<td colspan="3">
							<select id="ttsVoices" onchange="IdlePixelPlus.plugins.alerts.alertVoice = IdlePixelPlus.plugins.alerts.alertVoices[this.value]" style="width:100%"></select>
						</td>
						<td colspan="2">
							<input type="checkbox" onclick="IdlePixelPlus.plugins.alerts.muteAllAlerts = !IdlePixelPlus.plugins.alerts.muteAllAlerts" style="margin-right: 10px;"> Mute ALL
						</td>
						<td>
							<input type="range" min="1" max="100" value="100" id="alertVolume" onchange="IdlePixelPlus.plugins.alerts.alertVolume = this.value"> Volume
						</td>
						<td>
							<button onclick="IdlePixelPlus.plugins.alerts.saveAlerts()">Save</button>
						</td>
						<td>
							<button onclick="IdlePixelPlus.plugins.alerts.addAlert()">ADD</button>
						</td>
					</tr>
					<tr>
						<td colspan="4">
							<button onclick="IdlePixelPlus.plugins.alerts.openImportModal()">Import Alerts</button>
						</td>
						<td colspan="4">
							<button onclick="IdlePixelPlus.plugins.alerts.exportAlerts()" style="margin-left: 30;">Export Alerts</button>
						</td>
					</tr>
				</tfoot>
			</table>
			<br>
			<br>
			<table class="table table-secondary table-borderless" style="text-align: center;text-shadow: 1px 1px white;width: 60%;margin: auto;border: 1px solid black;">
				<thead>
					<tr>
						<th style="width: 20%;">Preset Type</th>
						<th style="width: 20%;">Preset</th>
						<th style="width: 10%;"></th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td style="padding-bottom: 10px;">
							<select id="dropdownPresetsType" size="1">
								<option value="" selected="selected">Select Type</option>
							</select>
						</td>
						<td style="padding-bottom: 10px;">
							<select id="dropdownPresetsPreset" size="1">
								<option value="" selected="selected">Select Preset</option>
							</select>
						</td>
						<td style="padding-bottom: 10px;">
							<button onclick="IdlePixelPlus.plugins.alerts.addPreset()">ADD</button>
						</td>
					</tr>
				</tbody>
			</table>`
			IdlePixelPlus.addPanel("audioAlerts", "Audio Alerts", alertTable);
			
			let alertButton = `<div onclick="IdlePixelPlus.setPanel('audioAlerts')" class="hover hover-menu-bar-item left-menu-item">
				<table class="game-menu-bar-left-table-btn left-menu-item-other" style="width: 100%;">
					<tbody>
						<tr>
							<td style="width: 30px;"><img id="menu-bar-idlepixelplus-icon" src="https://dhm.idle-pixel.com/images/soundOn.png" class="w20" title="alerts"></td>
							<td>AUDIO ALERTS</td>
						</tr>
					</tbody>
				</table>
			</div>`
			document.getElementById('menu-bar-buttons').insertAdjacentHTML('beforeend', alertButton);
			
			let importAlertsModal = `<div class="dounModalParent" style="display:none" id="importAlertsModal">
				<div class="dounModalDim" onclick="document.getElementById('importAlertsModal').style.display='none'"></div>
				<div class="modal-content dounModalContent">
					<div class="modal-header">
						<h5 class="modal-title text-secondary">Import Alerts</h5>
						<button type="button" class="btn-close" onclick="document.getElementById('importAlertsModal').style.display = 'none'"></button>
					</div>
					<div class="modal-body" style="text-align: center;">
						<center>
							Enter Alerts JSON<br>
							<input type="text" id="importAlerts">
						</center>
					</div>
					<div class="modal-footer">
						<button onclick="document.getElementById('importAlertsModal').style.display = 'none'"><span class="font-pixel hover">Close</span></button>
						<button onclick="IdlePixelPlus.plugins.alerts.importAlerts()" class="background-primary"><span class="font-pixel hover">Import</span></button>
					</div>
				</div>
			</div>`
			document.getElementById('content').insertAdjacentHTML('beforeend', importAlertsModal)
		}

		//Adds new alert row and a new key to alerts array
		addAlert = function() {
			let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
			let totalAlerts = alertRows.length
			let alertRow = document.createElement('tr')
			alertRow.id = `alert${totalAlerts+1}`
			alertRow.innerHTML = `<td>
						<input placeholder="Variable Name" id="variableName${totalAlerts+1}" style="width:100%">
					</td>
					<td>
						<select id="variableType${totalAlerts+1}">
							<option value="lt">&lt;</option>
							<option value="le">&le;</option>
							<option value="gt">&gt;</option>
							<option value="ge">&ge;</option>
							<option value="mod">&#37;</option>
							<option value="eq">&equals;</option>
							<option value="ne">&ne;</option>
						</select>
					</td>
					<td>
						<input placeholder="Value to Trigger" id="wantedValue${totalAlerts+1}">
					</td>
					<td><span id="variableValue${totalAlerts+1}"></span></td>
					<td>
						<select id="audioType${totalAlerts+1}">
							<option value="audio" selected="">Audio File</option>
							<option value="tts">Text To Speech</option>
							<option value="eval">Eval (Advanced Users Only!)</option>
						</select>
					</td>
					<td>
						<input placeholder="Text to Speech or sound URL" id="soundOption${totalAlerts+1}">
					</td>
					<td>
						<input type="checkbox" id="enabled${totalAlerts+1}">
					</td>
					<td style="padding-right: 6px;">
						<button onclick="IdlePixelPlus.plugins.alerts.removeAlert(this.parentNode.parentNode)">Delete</button>
					</td>`
			document.getElementById('alertsBody').append(alertRow)
			IdlePixelPlus.plugins.alerts.alerts[totalAlerts] = {type:'lt',variableName:'',wantedValue:'',soundType:'audio',sound:ding,enabled:false,triggered:false}
		}

		//Remove alert row and the array key, also changes the id of the remaining rows
		removeAlert = function(row) {
			let oldRows = document.getElementById('alertsBody').getElementsByTagName("tr").length
			let newId = 1
			let id = row.id.slice(5)
			IdlePixelPlus.plugins.alerts.alerts.splice(id-1,1)
			row.remove()
			let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
			// Update remaining row IDs
			for (let i = 0; i < alertRows.length; i++) {alertRows[i].id = `alert${i+1}`}
			for (let i = 0; i <= oldRows; i++){
				if(document.getElementById("variableName"+i)){
					document.getElementById("variableName"+i).id = "variableName"+newId
					document.getElementById("variableType"+i).id = "variableType"+newId
					document.getElementById("wantedValue"+i).id = "wantedValue"+newId
					document.getElementById("variableValue"+i).id = "variableValue"+newId
					document.getElementById("audioType"+i).id = "audioType"+newId
					document.getElementById("soundOption"+i).id = "soundOption"+newId
					document.getElementById("enabled"+i).id = "enabled"+newId
					newId++
				}
			}
			// Add a new alert if there are no rows remaining
			if (alertRows.length == 0) {IdlePixelPlus.plugins.alerts.addAlert()}
		}

		//Save the alerts, also sets the alerts, volume and current voice on localStorage
		saveAlerts = function() {
			let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
			for (let i = 0; i < alertRows.length; i++) {
				IdlePixelPlus.plugins.alerts.alerts[i].type = alertRows[i].getElementsByTagName('select')[0].value
				IdlePixelPlus.plugins.alerts.alerts[i].variableName = 'var_' + alertRows[i].getElementsByTagName('input')[0].value
				IdlePixelPlus.plugins.alerts.alerts[i].wantedValue = alertRows[i].getElementsByTagName('input')[1].value
				IdlePixelPlus.plugins.alerts.alerts[i].soundType = alertRows[i].getElementsByTagName('select')[1].value
				IdlePixelPlus.plugins.alerts.alerts[i].sound = alertRows[i].getElementsByTagName('input')[2].value == '' ? ding : alertRows[i].getElementsByTagName('input')[2].value
				IdlePixelPlus.plugins.alerts.alerts[i].enabled = alertRows[i].getElementsByTagName("input")[3].checked
				IdlePixelPlus.plugins.alerts.alerts[i].triggered = document.getElementById('alertsBody').getElementsByTagName("tr")[i].getElementsByTagName('td')[3].style.cssText == '--bs-table-accent-bg: yellow;' ? true : false;
			}
			let key = `audioAlerts`;
			localStorage.setItem(key, JSON.stringify(IdlePixelPlus.plugins.alerts.alerts));
			localStorage.setItem('audioAlertsVolume', IdlePixelPlus.plugins.alerts.alertVolume);
			let voiceIndex = document.getElementById('ttsVoices').value
			localStorage.setItem('audioAlertsVoice', voiceIndex);
			localStorage.setItem('audioAlertsMuted', IdlePixelPlus.plugins.alerts.muteAllAlerts);
		}

		//Loads both volume and alerts from the localStorage
		loadAlerts() {
			let key = `audioAlerts`;
			let audioAlerts = localStorage.getItem(key);
			if (audioAlerts) {
				audioAlerts = JSON.parse(audioAlerts);
				let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
				for (let i = 0; i < audioAlerts.length; i++) {
					IdlePixelPlus.plugins.alerts.addAlert()
					alertRows[i].getElementsByTagName('select')[0].value = audioAlerts[i].type
					alertRows[i].getElementsByTagName('input')[0].value = audioAlerts[i].variableName.slice(4)
					alertRows[i].getElementsByTagName('input')[1].value = audioAlerts[i].wantedValue
					alertRows[i].getElementsByTagName('select')[1].value = audioAlerts[i].soundType
					alertRows[i].getElementsByTagName('input')[3].checked = audioAlerts[i].enabled
					alertRows[i].getElementsByTagName('input')[2].value = audioAlerts[i].sound == ding ? '' : audioAlerts[i].sound;
					alertRows[i].getElementsByTagName('td')[3].style.cssText = audioAlerts[i].triggered == true ? '--bs-table-accent-bg: yellow;' : ''
				}
				IdlePixelPlus.plugins.alerts.alerts = audioAlerts;
			} else {IdlePixelPlus.plugins.alerts.addAlert()}
			IdlePixelPlus.plugins.alerts.alertVolume = localStorage.getItem('audioAlertsVolume') ? localStorage.getItem('audioAlertsVolume') : 100;
			IdlePixelPlus.plugins.alerts.muteAllAlerts = localStorage.getItem('audioAlertsMuted') ? localStorage.getItem('audioAlertsMuted') : false;
			document.getElementById('alertVolume').value = IdlePixelPlus.plugins.alerts.alertVolume
		}

		//Displays the current value of the alert variables
		newValue() {
			let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
			for (let i = 0; i < alertRows.length; i++) {
				alertRows[i].getElementsByTagName('span')[0].innerText = window[IdlePixelPlus.plugins.alerts.alerts[i].variableName] == undefined ? '' : window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]
			}
		}

		//This is were the alert is checked
		alertLoop() {
			let alertNumber = IdlePixelPlus.plugins.alerts.alerts.length;
			for (let i = 0; i < alertNumber; i++) {
				if (IdlePixelPlus.plugins.alerts.alerts[i].enabled) {
					let type = IdlePixelPlus.plugins.alerts.alerts[i].type
					let triggered = 0
					switch(type) {
						case "lt": {
							triggered =  parseInt(window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]) < parseInt(IdlePixelPlus.plugins.alerts.alerts[i].wantedValue) ? 1 : 0
							break;
						}
						case "le": {
							triggered =  parseInt(window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]) <= parseInt(IdlePixelPlus.plugins.alerts.alerts[i].wantedValue) ? 1 : 0
							break;
						}
						case "gt": {
							triggered =  parseInt(window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]) > parseInt(IdlePixelPlus.plugins.alerts.alerts[i].wantedValue) ? 1 : 0
							break;
						}
						case "ge": {
							triggered =  parseInt(window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]) >= parseInt(IdlePixelPlus.plugins.alerts.alerts[i].wantedValue) ? 1 : 0
							break;
						}
						case "mod": {
							const [mod, remainder] = IdlePixelPlus.plugins.alerts.alerts[i].wantedValue.split(",");
							triggered =  parseInt(window[IdlePixelPlus.plugins.alerts.alerts[i].variableName]) % parseInt(mod) == parseInt(remainder) ? 1 : 0
							break;
						}
						case "eq": {
							triggered =  window[IdlePixelPlus.plugins.alerts.alerts[i].variableName] === IdlePixelPlus.plugins.alerts.alerts[i].wantedValue ? 1 : 0
							break;
						}
						case "ne": {
							triggered =  window[IdlePixelPlus.plugins.alerts.alerts[i].variableName] !== IdlePixelPlus.plugins.alerts.alerts[i].wantedValue && typeof window[IdlePixelPlus.plugins.alerts.alerts[i].variableName] != 'undefined' ? 1 : 0
							break;
						}
					}
					if (triggered == 1 && IdlePixelPlus.plugins.alerts.alerts[i].triggered == false) {
						IdlePixelPlus.plugins.alerts.triggerAlert(i);
					} 
					if (triggered == 0 && IdlePixelPlus.plugins.alerts.alerts[i].triggered == true) {
						IdlePixelPlus.plugins.alerts.alerts[i].triggered = false
						document.getElementById('alertsBody').getElementsByTagName("tr")[i].getElementsByTagName('td')[3].style.cssText=''
					}
				}
			}
		}

		//This is were the alert happen
		triggerAlert(i) {
			IdlePixelPlus.plugins.alerts.alerts[i].triggered = true
			document.getElementById('alertsBody').getElementsByTagName("tr")[i].getElementsByTagName('td')[3].style.cssText = '--bs-table-accent-bg: yellow;';
			if (IdlePixelPlus.plugins.alerts.muteAllAlerts != true) {
				if(IdlePixelPlus.plugins.alerts.alerts[i].soundType == "audio") {
					let sound = new Audio(IdlePixelPlus.plugins.alerts.alerts[i].sound)
					sound = isNaN(sound.duration) ? new Audio(ding) : sound
					sound.volume = IdlePixelPlus.plugins.alerts.alertVolume / 100
					sound.play()
				} else if (IdlePixelPlus.plugins.alerts.alerts[i].soundType == "tts") {
					const message = new SpeechSynthesisUtterance();
					message.text = IdlePixelPlus.plugins.alerts.alerts[i].sound == ding ? defaultText : IdlePixelPlus.plugins.alerts.alerts[i].sound
					message.voice = IdlePixelPlus.plugins.alerts.alertVoice
					message.volume = IdlePixelPlus.plugins.alerts.alertVolume / 100
					window.speechSynthesis.speak(message);
				} else if (IdlePixelPlus.plugins.alerts.alerts[i].soundType == "eval") {// Remove from here
					let command = IdlePixelPlus.plugins.alerts.alerts[i].sound == 'https://raw.githubusercontent.com/Dounford-Felipe/Audio-Alerts/main/ding.wav' ? `console.log('You need to set ' + IdlePixelPlus.plugins.alerts.alerts[i].variableName + ' command')` : IdlePixelPlus.plugins.alerts.alerts[i].sound
					eval(command) // To here if you don't want eval
				}
				IdlePixelPlus.plugins.alerts.saveAlerts()
			}
		}

		//Presets are added here
		addPreset() {
			IdlePixelPlus.plugins.alerts.addAlert()
			let alertRows = document.getElementById('alertsBody').getElementsByTagName("tr")
			let alertRow = alertRows.length - 1;
			let preset = document.getElementById("dropdownPresetsPreset").value;
			alertRows[alertRow].getElementsByTagName('select')[0].value = Presets[preset].type
			alertRows[alertRow].getElementsByTagName('input')[0].value = Presets[preset].name
			alertRows[alertRow].getElementsByTagName('input')[1].value = Presets[preset].value
			alertRows[alertRow].getElementsByTagName('input')[3].checked = true
			IdlePixelPlus.plugins.alerts.saveAlerts()
		}
	
		addDropdown() {
			let typeSel = document.getElementById("dropdownPresetsType");
			let fieldSel = document.getElementById("dropdownPresetsPreset");
			for (let type in dropdownPresets) {
				typeSel.options[typeSel.options.length] = new Option(type, type);
			}
			typeSel.onchange = function () {
				fieldSel.length = 1; // remove all options bar first
				if (this.selectedIndex < 1) return; // done  
				let ft = dropdownPresets[this.value];
				for (let field in dropdownPresets[this.value]) {
					fieldSel.options[fieldSel.options.length] = new Option(ft[field], ft[field].charAt(0).toLocaleLowerCase() + ft[field].slice(1).replaceAll(' ',''));
				}
			}
			typeSel.onchange();
		}
	
		openImportModal() {
			document.getElementById('importAlertsModal').style.display=''
		}
	
		importAlerts() {
			let importedJSON = '';
			if (document.getElementById('importAlerts').value == '') {return} else {importedJSON = JSON.parse(document.getElementById('importAlerts').value)};
			let currentRows = document.getElementById('alertsBody').getElementsByTagName("tr").length;
			if (document.getElementById("variableName"+currentRows).value !== '') {currentRows++};
			importedJSON.forEach(function(alert){
				IdlePixelPlus.plugins.alerts.addAlert()
				document.getElementById("variableName"+currentRows).value = alert.variableName.slice(4)
				document.getElementById("variableType"+currentRows).value = alert.type
				document.getElementById("wantedValue"+currentRows).value = alert.wantedValue
				document.getElementById("audioType"+currentRows).value = alert.soundType
				document.getElementById("soundOption"+currentRows).value = alert.sound == ding ? '' : alert.sound;
				document.getElementById("variableValue"+currentRows).parentNode.cssText = alert.triggered == true ? '--bs-table-accent-bg: yellow;' : ''
				document.getElementById("enabled"+currentRows).checked = alert.enabled
				currentRows++
			})
			document.getElementById('importAlerts').value = ''
			document.getElementById('importAlertsModal').style.display='none';
			IdlePixelPlus.plugins.alerts.saveAlerts();
		}
		
		exportAlerts () {
			let saveData = JSON.stringify(IdlePixelPlus.plugins.alerts.alerts);
			const blob = new Blob([saveData], { type: "application/json" });
			const a = document.createElement("a");
			a.href = window.URL.createObjectURL(blob);
			a.download = 'DHP-Alerts-' + var_username;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
 
    const plugin = new AlertsPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();