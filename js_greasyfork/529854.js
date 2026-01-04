// ==UserScript==
// @name         Neko's Zed City Tools
// @namespace    http://tampermonkey.net/
// @version      1.1.6
// @description  Tools for the Neko faction of Zed City
// @author       LinkTheZombie (Based on the Zed City Tools script by Bot7420 & Mountain Dewd)
// @match        https://www.zed.city/*
// @connect      api.zed.city
// @icon         https://www.zed.city/icons/favicon.svg
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license      CC-BY-NC-SA-4.0
// @downloadURL https://update.greasyfork.org/scripts/529854/Neko%27s%20Zed%20City%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/529854/Neko%27s%20Zed%20City%20Tools.meta.js
// ==/UserScript==

(() => {
	'use strict';

	/* START */

	// 🎯 Hook into XMLHttpRequest to Modify API Calls (Only Declare Once)
	if (!unsafeWindow.XMLHttpRequest.prototype._open_modified) {
		const originalOpen = XMLHttpRequest.prototype.open;
		unsafeWindow.XMLHttpRequest.prototype._open_modified = true;

		unsafeWindow.XMLHttpRequest.prototype.open = function() {
			this.addEventListener("readystatechange", function() {
				if (this.readyState === 4) {
					const url = this.responseURL;

					const apiHandlers = {
						"api.zed.city/getStats": handleGetStats,
						"api.zed.city/skills": handleSkills,
						"api.zed.city/getStore?store_id=junk": handleGetStoreJunkLimit,
						"api.zed.city/startJob": handleStartJob,
						"api.zed.city/completeJob": handleCompleteJob,
						"api.zed.city/getStronghold": handleGetStronghold,
						"api.zed.city/getRadioTower": handleGetRadioTower,
						"api.zed.city/getFactionNotifications": handleGetFactionNotifications,
						"api.zed.city/doFight": handleDoFight,
						"api.zed.city/getFactionMembers": handleGetFactionMembers,
						"https://api.zed.city/getFaction": handleGetFaction
					};

					if (url.includes("api.zed.city/getFight") && !url.includes("api.zed.city/getFightLog")) {
						handleGetFight(this.response);
					} else {
						for (const [key, handler] of Object.entries(apiHandlers)) {
							if (url.includes(key)) {
								handler(this.response);
								break;
							}
						}
					}
				}
			});

			return originalOpen.apply(this, arguments);
		};
	}


	// ✅ Function to fetch updated player stats from the API
	function fetchStats() {
		console.log("🔄 Fetching fresh stats from API...");

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://api.zed.city/getStats",
			headers: {
				"Accept": "application/json",
				"Referer": "https://www.zed.city/"
			},
			onload: function(response) {
				try {
					const data = JSON.parse(response.responseText);
					localStorage.setItem("script_getStats", response.responseText);
					handleGetStats(response.responseText);
				} catch (error) {
					console.error("❌ JSON Parse Error:", error);
				}
			},
			onerror: function(error) {
				console.error("❌ API Fetch Failed:", error);
			}
		});
	}

	// ✅ Function to observe UI stat changes and fetch updated stats
	function observeStatChanges(statClass) {
		// FIX 1: Use backticks for querySelector
		let statBar = document.querySelector(`.q-linear-progress.${statClass}`);
		if (!statBar) return;

		let observer = new MutationObserver(() => {
			// FIX 2: Use backticks for console.log
			console.log(`🔄 ${statClass.toUpperCase()} Bar Changed - Fetching Fresh Stats...`);
			fetchStats(); // ✅ Ensure fresh API data is retrieved
		});

		observer.observe(statBar, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}

	// ✅ Start observing changes in UI
	observeStatChanges("energy");
	observeStatChanges("rad");
	observeStatChanges("morale");
	observeStatChanges("life");



	// ────────────────────────────────────────────────
	// Timer Container Toggle & Helper Functions
	// ────────────────────────────────────────────────

	// Returns the container element to use for timers based on the user's setting.
	function getTimerContainer() {
		// If draggable timer is NOT disabled, use the draggable container.
		if (localStorage.getItem("script_timerDraggable") !== "false") {
			let container = document.getElementById("script_timer_container");
			if (!container) {
				container = document.createElement("div");
				container.id = "script_timer_container";
				document.body.appendChild(container);
				updateContainerStyle(); // your existing function to style the draggable container
			}
			container.style.display = "flex";
			return container;
		} else {
			// Otherwise, use (or create) the fixed top container.
			let fixed = document.getElementById("script_countdowns_container");
			if (!fixed) {
				fixed = document.createElement("div");
				fixed.id = "script_countdowns_container";
				Object.assign(fixed.style, {
					position: "fixed",
					top: "0px",
					left: "0px",
					width: "100%",
					background: "rgba(0, 0, 0, 0.7)",
					padding: "10px",
					zIndex: "9999",
					display: "flex",
					justifyContent: "center",
					gap: "15px"
				});
				document.body.appendChild(fixed);
			}
			fixed.style.display = "flex";
			return fixed;
		}
	}

	// Updates which container is visible based on the draggable setting.
	function updateTimerContainerBasedOnSetting() {
		const draggableEnabled = localStorage.getItem("script_timerDraggable") !== "false";
		const draggable = document.getElementById("script_timer_container");
		const fixed = document.getElementById("script_countdowns_container");
		if (draggableEnabled) {
			if (fixed) fixed.style.display = "none";
			if (draggable) draggable.style.display = "flex";
			else createTimerContainer(); // creates #script_timer_container and applies styles
		} else {
			if (draggable) draggable.style.display = "none";
			if (!fixed) {
				const fixedContainer = document.createElement("div");
				fixedContainer.id = "script_countdowns_container";
				Object.assign(fixedContainer.style, {
					position: "fixed",
					top: "0px",
					left: "0px",
					width: "100%",
					background: "rgba(0, 0, 0, 0.7)",
					padding: "10px",
					zIndex: "9999",
					display: "flex",
					justifyContent: "center",
					gap: "15px"
				});
				document.body.appendChild(fixedContainer);
			} else {
				fixed.style.display = "flex";
			}
		}
	}

	// Adds a new toggle control to the settings UI so users can choose whether the timer container is draggable.
	function addDraggableToggleSetting() {
		if (!document.querySelector(".script_timerDraggable_toggle")) {
			const container = document.createElement("div");
			container.className = "script_timerDraggable_toggle";
			container.style.margin = "30px";
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			// Default is draggable enabled; if the stored value is "false", then it is disabled.
			checkbox.checked = localStorage.getItem("script_timerDraggable") !== "false";
			checkbox.style.marginRight = "10px";
			const label = document.createElement("label");
			label.style.fontSize = "20px";
			label.textContent = checkbox.checked ?
				"Draggable Timer Container: Enabled" :
				"Draggable Timer Container: Disabled";
			checkbox.addEventListener("change", () => {
				const enabled = checkbox.checked;
				localStorage.setItem("script_timerDraggable", enabled ? "true" : "false");
				label.textContent = enabled ?
					"Draggable Timer Container: Enabled" :
					"Draggable Timer Container: Disabled";
				updateTimerContainerBasedOnSetting();
			});
			container.appendChild(checkbox);
			container.appendChild(label);
			const settingsPanel = document.getElementById("script_settingsPanel");
			if (settingsPanel) {
				settingsPanel.appendChild(container);
			}
		}
	}

	// ────────────────────────────────────────────────
	// End Timer Container Toggle Helpers
	// ────────────────────────────────────────────────




	// 🎯 Handle Faction Data
	function handleGetFaction(response) {
		try {
			const data = JSON.parse(response);
			if (data.faction?.name) {
				localStorage.setItem("script_faction_id", data.faction.name);
				console.log("Faction Name Stored:", data.faction.name);
			}
		} catch (error) {
			console.error("Error parsing faction data:", error);
		}
	}

	// 📌 Initialize Faction Log Storage
	if (!localStorage.getItem("script_faction_raid_logs")) {
		localStorage.setItem("script_faction_raid_logs", JSON.stringify({}));
	}
	if (!localStorage.getItem("script_faction_log_records")) {
		localStorage.setItem("script_faction_log_records", JSON.stringify({}));
	}

	// 🛡️ Handle Faction Notifications (Raid Logs)
	function handleGetFactionNotifications(response) {
		const data = JSON.parse(response);
		if (!data?.notify) return;

		const raidLogs = JSON.parse(localStorage.getItem("script_faction_raid_logs")) || {}; // Initialize if null

		for (const log of data.notify) {
			if (log.type === "faction_raid" && log.data?.user_id) {
				const userId = log.data.user_id;
				const logDate = log.date;

				// Create a unique key for each user based on the raid date and user ID
				const logKey = `${logDate}_${userId}`;

				// Store the log using the new unique key
				raidLogs[logKey] = log;
			}
		}

		// Save the updated logs back to localStorage
		localStorage.setItem("script_faction_raid_logs", JSON.stringify(raidLogs));

		// Call function to update the faction log record, if necessary
		updateFactionLogRecord();
	}

	// 🏅 Handle Faction Members (Store in Local Storage)
	function handleGetFactionMembers(response) {
		try {
			const data = JSON.parse(response);

			// Ensure the response contains valid faction member data
			if (!data || !Array.isArray(data.members)) {
				console.error("Invalid faction members data received:", data);
				return;
			}

			// Store the faction members data in localStorage
			localStorage.setItem("script_faction_members", JSON.stringify(data.members));

			console.log("Faction members list successfully stored in localStorage.");
		} catch (error) {
			console.error("Error processing faction members data:", error);
		}
	}

	// 📜 Update Faction Log Records
	function updateFactionLogRecord() {
		const raidLogs = JSON.parse(localStorage.getItem("script_faction_raid_logs"));
		const result = {};

		// Iterate over each log entry in the raid logs
		for (const key in raidLogs) {
			const log = raidLogs[key];

			// Process only faction raid logs
			if (log.type === "faction_raid" && log.data) {
				const userId = log.data.user_id; // Each log now has a single user (user_id)
				if (userId) {
					// Initialize user record if not already present
					if (!result[userId]) {
						result[userId] = {
							playerId: userId,
							playerNames: [log.data.username], // Single username now
							respectFromRaids: 0,
							lastRaid: null,
						};
					}

					// Calculate respect based on raid type
					let respectValue = Number(log.data.respect ?? log.data.influence) || 0;
					if (log.data.name === "Raid a Farm") {
						respectValue /= 2; // Farm raids get respect divided by 2
					} else if (log.data.name === "Raid a Hospital") {
						respectValue /= 3; // Hospital raids get respect divided by 3
					} else if (log.data.name === "Raid a Store") {
						respectValue /= 4; // Store raids get respect divided by 4
					}

					// Update the respect value for the user
					result[userId].respectFromRaids += respectValue;

					// Update the last raid for the user if it's more recent than the previous one
					if (!result[userId].lastRaid || result[userId].lastRaid.timestamp < Number(log.date)) {
						result[userId].lastRaid = {
							timestamp: Number(log.date),
							raidName: log.data.name
						};
					}
				}
			}
		}

		// Save the updated faction log records to localStorage
		localStorage.setItem("script_faction_log_records", JSON.stringify(result));
	}

	// 📊 Rank Members by Respect
	function rankByRespect() {
		const records = JSON.parse(localStorage.getItem("script_faction_log_records"));
		return Object.values(records)
			.sort((a, b) => b.respectFromRaids - a.respectFromRaids)
			.map(record => `${record.playerNames[0]} total Respect: ${record.respectFromRaids.toFixed(1)}`)
			.join("\n");
	}

	// ⏳ Calculate Raid Timings
	function raidTimings() {
		const records = JSON.parse(localStorage.getItem("script_faction_log_records"));
		const result = [];

		for (const key in records) {
			const record = records[key];
			if (record.lastRaid) {
				let nextRaidInSec = null;
				const raidTimes = {
					"Raid a Farm": 1 * 60 * 60,
					"Raid a Hospital": 5 * 60 * 60,
					"Raid a Store": 20 * 60 * 60,
				};
				nextRaidInSec = Math.floor(record.lastRaid.timestamp + raidTimes[record.lastRaid.raidName] - Date.now() / 1000);

				if (nextRaidInSec > -172800) {
					const playerName = record.playerNames[0];
					const isReady = nextRaidInSec <= 0;
					const statusText = isReady ?
						`✅ ${playerName} - Ready to Raid` :
						`⏳ ${playerName} - Next Raid: ${timeReadable(nextRaidInSec)}`;

					result.push({
						statusText,
						nextRaidInSec
					});
				}
			}
		}

		return result.sort((a, b) => a.nextRaidInSec - b.nextRaidInSec).map(r => r.statusText).join("\n");
	}

	// 🏆 Faction Raid Logs UI
	function addFactionLogSearch() {
		if (!window.location.href.includes("zed.city/faction/activity") || !document.querySelector("div.q-infinite-scroll")) {
			return;
		}

		const insertToElem = document.querySelector("div.q-infinite-scroll");
		const searchElem = document.querySelector("#script_faction_log_container");

		if (!searchElem) {
			const container = document.createElement("div");
			container.id = "script_faction_log_container";
			container.className = "zed-grid has-title has-content";
			container.style.margin = "20px 0";
			container.innerHTML = `
            <div class="title"><div>Faction Raid Logs</div></div>
            <div class="grid-cont">
                <div class="q-pa-md">
                    <button id="script_rankRespect" class="q-btn q-btn-item non-selectable no-outline">
                        <span class="q-btn__content text-center">Members Total Respect</span>
                    </button>
                    <button id="script_raidCooldown" class="q-btn q-btn-item non-selectable no-outline">
                        <span class="q-btn__content text-center">Raid Cooldown Check</span>
                    </button>
                    <button id="script_clearLogs" class="q-btn q-btn-item non-selectable no-outline">
                        <span class="q-btn__content text-center">Clear Local History</span>
                    </button>
                    <button id="script_checkRaidPerformance" class="q-btn q-btn-item non-selectable no-outline">
                        <span class="q-btn__content text-center">Check Raid Performance</span>
                    </button>
                </div>
                <div id="script_faction_log_output" class="q-pa-md q-field row no-wrap items-start q-field--outlined q-field--dark q-field--dense"
                     style="height: 200px; overflow-y: auto; background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 5px; color: white; font-size: 14px;">
                    Faction logs are stored locally. Use the buttons to query data.<br>(First time use, CLEAR LOCAL HISTORY then manually scroll the faction activity)
                    <br><br>When checking Raid Performance, first navigate to "Faction > Base > Camp" so the team of active faction members are saved<br>
                    Next, scroll down the list of raids in the Activity section until every raid for the time frame you wish to search for is visible,<br>
                    then use the CHECK RAID PERFORMANCE button and input the start and end date for the most reliable results.<br><br>
                    If you have already gathered member and raid data using the above methods for the time period you wish to search, no need to do so again.
                </div>
            </div>
        `;

			insertToElem.parentNode.insertBefore(container, insertToElem);

			document.getElementById("script_rankRespect").addEventListener("click", () => {
				document.getElementById("script_faction_log_output").innerHTML = rankByRespect().replace(/\n/g, "<br>");
			});

			document.getElementById("script_raidCooldown").addEventListener("click", () => {
				document.getElementById("script_faction_log_output").innerHTML = raidTimings().replace(/\n/g, "<br>");
			});
			document.getElementById("script_clearLogs").addEventListener("click", () => {
				if (window.confirm("⚠️ Are you sure you want to clear all raid logs?")) {
					console.log("Faction log cleared.");
					document.getElementById("script_faction_log_output").innerHTML = "History has been cleared.";
					localStorage.setItem("script_faction_raid_logs", JSON.stringify({}));
					localStorage.setItem("script_faction_log_records", JSON.stringify({}));
				} else {
					console.log("Clear history action canceled.");
				}
			});
			document.getElementById("script_checkRaidPerformance").addEventListener("click", () => {

				updateFactionLogRecord();

				const startDate = prompt("Enter start date (DD/MM/YYYY):");
				const endDate = prompt("Enter end date (DD/MM/YYYY):");

				if (!startDate || !endDate) {
					console.log("Invalid input for start or end date.");
					return;
				}

				const startDateObj = parseDate(startDate, true); // true for start of the day
				const endDateObj = parseDate(endDate, false); // false for end of the day

				if (!startDateObj || !endDateObj) {
					console.log("Invalid date format. Please use DD/MM/YYYY.");
					return;
				}

				const raidLogs = JSON.parse(localStorage.getItem("script_faction_raid_logs"));
				const factionMembers = JSON.parse(localStorage.getItem("script_faction_members")) || [];
				const userPerformance = {};
				const userRoleMap = {};

				// Create a map for user ID to role name for quick lookup
				factionMembers.forEach(member => {
					userRoleMap[member.id] = member.role_name || "Unknown";
				});

				// Loop through each raid in the log
				for (const logKey in raidLogs) {
					const log = raidLogs[logKey];
					const [logDate, userId] = logKey.split('_'); // Split the key to get date and userId

					// Convert Unix timestamp to milliseconds
					const logDateObj = new Date(Number(logDate) * 1000); // Convert to standard date object (UTC)

					// Convert to PST timezone (UTC-08:00)
					const pstDateObj = new Date(logDateObj.toLocaleString("en-US", {
						timeZone: "America/Los_Angeles"
					}));

					// Ensure the log falls within the user-specified date range
					if (pstDateObj >= startDateObj && pstDateObj <= endDateObj) {
						if (log.type === "faction_raid" && log.data?.user_id) {
							const userId = log.data.user_id;
							const username = log.data.username;
							const raidName = log.data.name;
							const roleName = userRoleMap[userId] || "Unknown";

							if (!userPerformance[userId]) {
								userPerformance[userId] = {
									username: username,
									farmRaids: 0,
									hospitalRaids: 0,
									storeRaids: 0,
									totalPoints: 0,
									roleName: roleName
								};
							}

							// Increment respective raid count
							if (raidName === "Raid a Farm") {
								userPerformance[userId].farmRaids += 1;
							} else if (raidName === "Raid a Hospital") {
								userPerformance[userId].hospitalRaids += 1;
							} else if (raidName === "Raid a Store") {
								userPerformance[userId].storeRaids += 1;
							}

							// Update total points based on the raid type
							const raidPoints =
								userPerformance[userId].farmRaids +
								(userPerformance[userId].hospitalRaids * 2) +
								(userPerformance[userId].storeRaids * 5);
							userPerformance[userId].totalPoints = raidPoints;
						}
					}
				}

				// Now, calculate team scores after all individual scores are updated
				const teamScores = {};

				// Loop through individual players and calculate team scores
				for (const userId in userPerformance) {
					const player = userPerformance[userId];
					const roleName = player.roleName;

					if (!teamScores[roleName]) {
						teamScores[roleName] = 0;
					}

					teamScores[roleName] += player.totalPoints;
				}

				// Sort users first by total points, then by username
				const sortedUsers = Object.values(userPerformance).sort((a, b) => {
					if (b.totalPoints === a.totalPoints) {
						return a.username.localeCompare(b.username);
					}
					return b.totalPoints - a.totalPoints;
				});

				// Sort teams by total points
				const sortedTeams = Object.entries(teamScores).sort((a, b) => b[1] - a[1]);

				// Display the team scores and individual scores side by side
				let output = "<div style='display: flex; justify-content: space-around; text-align: center;'>";

				// Individual Performance Scores
				output += "<div style='flex: 1;'><strong>Username: Farm Raids, Hospital Raids, Store Raids, Total Score</strong><br>";
				sortedUsers.forEach(user => {
					output += `${user.username}: ${user.farmRaids}, ${user.hospitalRaids}, ${user.storeRaids}, ${user.totalPoints}<br>`;
				});
				output += "</div>";

				// Add extra margin to the right of the individual scores section to create space
				output += "</div>";

				// Team Scores - Added margin-left to shift it right
				output += "<div style='flex: 1; margin-left: 50px;'><strong>Team Scores:</strong><br>";
				sortedTeams.forEach(([team, score]) => {
					output += `${team}: ${score}<br>`;
				});
				output += "</div>";

				// Set the inner HTML with the updated layout
				document.getElementById("script_faction_log_output").innerHTML = output.replace(/\n/g, "<br>");
			});
		}
	}

	// Function to parse date based on PST and return the Date object
	function parseDate(dateStr, isStartOfDay = true) {
		const parts = dateStr.split('/');
		if (parts.length !== 3) return null;
		const day = parseInt(parts[0], 10);
		const month = parseInt(parts[1], 10) - 1; // Month is zero-based
		const year = parseInt(parts[2], 10);

		if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

		const dateObj = new Date(year, month, day);

		// Set the time to 00:00:00 if it's the start of the day, or to 23:59:59 if it's the end of the day
		if (isStartOfDay) {
			dateObj.setHours(0, 0, 0, 0); // Start of the day
		} else {
			dateObj.setHours(23, 59, 59, 999); // End of the day
		}

		// Return the Unix timestamp in milliseconds (UTC)
		return dateObj.getTime();
	}

	// 🔄 Run Faction Log Search Every 0.5s
	setInterval(addFactionLogSearch, 500);

	// 🎯 Ensure necessary localStorage variables exist
	const defaultLocalStorageValues = {
		script_getStats: "{}",
		script_playerXp_previous: 0,
		script_playerXp_current: 0,
		script_playerXp_max: 0,
		script_energyFullAtTimestamp: 0,
		script_radFullAtTimestamp: 0,
		script_moraleFullAtTimestamp: 0,
		script_lifeFullAtTimestamp: 0,
		script_energy: 0,
		script_vehicle_max_weight: 0,
		script_vehicle_weight: 0,
		script_weapon_durability_threshold: 50
	};

	for (const [key, value] of Object.entries(defaultLocalStorageValues)) {
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, value);
		}
	}


	// 🎯 Handle Player Statistics Update
	function handleGetStats(response) {
		localStorage.setItem("script_getStats", response);
		const data = JSON.parse(response);

		// 🟢 Player Data Tracking
		localStorage.setItem("script_playerXp_current", data.experience);
		localStorage.setItem("script_playerXp_max", data.xp_end);
		localStorage.setItem("script_playerName", data.username);
		showPlayerXpChangePopup(data.experience);

		// 🛡️ Calculate & Store Total Battle Score (BS)
		const totalBS = Number(data.stats.strength) + Number(data.stats.speed) +
			Number(data.stats.defense) + Number(data.stats.agility);
		localStorage.setItem("script_totalBS", totalBS);

		// ⏳ Raid Cooldown Tracking
		if (data.raid_cooldown) {
			const previousTimestamp = Number(localStorage.getItem("script_raidTimestamp"));
			const timestamp = Date.now() + data.raid_cooldown * 1000;
			localStorage.setItem("script_raidTimestamp", timestamp);
			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_raidIsAlreadyNotified", false);
			}
		}

		// 🚗 Vehicle Weight Tracking
		if (data.vehicle?.vars) {
			localStorage.setItem("script_vehicle_max_weight", data.vehicle.vars.max_weight);
			localStorage.setItem("script_vehicle_weight", data.vehicle.vars.weight);
		}

		// ================================
		//  🟢 Morale Regen Calculation
		// ================================
		const currentMorale = data.morale;
		const maxMorale = data.stats.max_morale;
		const moraleRegenInterval = 300; // 5 minutes = 300 seconds
		const moraleRegenAmount = 5; // Fixed regen amount per cycle
		const timeUntilNextMoraleRegen = data.morale_regen || 0; // Time left until next regen tick

		if (currentMorale >= maxMorale) {
			localStorage.setItem("script_moraleFullAtTimestamp", -1);
		} else {
			const neededMorale = maxMorale - currentMorale;

			// Calculate how many full 5-morale regen cycles are needed
			const fullCyclesNeeded = Math.floor(neededMorale / moraleRegenAmount);

			// Check if there's any remaining morale to regenerate after full cycles
			const remainingMorale = neededMorale % moraleRegenAmount;

			// Calculate total time needed to fully regenerate morale
			let timeLeftSec = (fullCyclesNeeded * moraleRegenInterval) + timeUntilNextMoraleRegen;

			// Set timestamp for when morale will be full
			const previousTimestamp = Number(localStorage.getItem("script_moraleFullAtTimestamp"));
			const timestamp = Date.now() + timeLeftSec * 1000;
			localStorage.setItem("script_moraleFullAtTimestamp", timestamp);

			// If the new full morale timestamp is more than 30 seconds different from the previous one, reset the notification flag
			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_moraleFullAlreadyNotified", false);
			}
		}

		// ================================
		//  🟢 Life Regen Calculation
		// ================================
		const currentLife = data.life;
		const maxLife = data.stats.max_life;
		const lifeRegenAmount = data.stats.life_regen || 40; // ✅ Dynamic regen per player
		const lifeRegenInterval = 900; // ✅ 15 min = 900 sec
		const timeUntilNextLifeRegen = data.life_regen || 0; // ✅ Countdown to next regen

		if (currentLife >= maxLife) {
			localStorage.setItem("script_lifeFullAtTimestamp", -1);
		} else {
			const neededLife = maxLife - currentLife;

			// ✅ Calculate full regen cycles needed
			const fullCyclesNeeded = Math.floor(neededLife / lifeRegenAmount);

			// ✅ Calculate total time needed for full regen
			let timeLeftSec = (fullCyclesNeeded * lifeRegenInterval) + timeUntilNextLifeRegen;

			// ✅ Store full life timestamp
			const previousTimestamp = Number(localStorage.getItem("script_lifeFullAtTimestamp"));
			const timestamp = Date.now() + timeLeftSec * 1000;
			localStorage.setItem("script_lifeFullAtTimestamp", timestamp);

			// ✅ Reset notification flag if the new timestamp differs by more than 30s
			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_lifeFullAlreadyNotified", false);
			}
		}

        // ================================
        //  🟢 Radiation Regen Calculation
        // ================================
        const currentRad = data.rad;
        const baseMaxRad = data.stats.max_rad;
        const radRegen = data.rad_regen || 0;
        const radRegenInterval = 300; // 5 min (300 sec)

        // Step 1: Only add string-type "max_rad_flat" bonuses
        let bonusMaxRad = 0;
        if (Array.isArray(data.effects)) {
            data.effects.forEach(effect => {
                const vars = effect.vars;
                if (vars && typeof vars.max_rad_flat === "string") {
                    const parsed = Number(vars.max_rad_flat);
                    if (!isNaN(parsed)) {
                        bonusMaxRad += parsed;
                    }
                }
            });
        }

        const totalMaxRad = baseMaxRad + bonusMaxRad;

        localStorage.setItem("script_rad", currentRad);

        if (currentRad < totalMaxRad) {
            const timeLeftSec = ((totalMaxRad - currentRad - 1) / 1) * radRegenInterval + radRegen;
            const previousTimestamp = Number(localStorage.getItem("script_radFullAtTimestamp"));
            const timestamp = Date.now() + timeLeftSec * 1000;
            localStorage.setItem("script_radFullAtTimestamp", timestamp);

            if (timestamp - previousTimestamp > 30000) {
                localStorage.setItem("script_radFullAlreadyNotified", false);
            }
        } else {
            localStorage.setItem("script_radFullAtTimestamp", -1);
        }


		// ================================
		//  🟢 Energy Calculation
		// ================================
		const currentEnergy = data.energy;
		const energyRegenIntervalMinute = data.membership ? 10 : 15;
		const maxEnergy = data.stats.max_energy + (data.membership ? 50 : 0);
		const energyRegen = data.energy_regen || 0;

		localStorage.setItem("script_energy", currentEnergy);

		if (currentEnergy < maxEnergy) {
			const timeLeftSec = ((maxEnergy - currentEnergy - 5) / 5) * energyRegenIntervalMinute * 60 + energyRegen;
			const previousTimestamp = Number(localStorage.getItem("script_energyFullAtTimestamp"));
			const timestamp = Date.now() + timeLeftSec * 1000;
			localStorage.setItem("script_energyFullAtTimestamp", timestamp);
			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_energyFullAlreadyNotified", false);
			}
		}
	}



	// 🎯 Handle Skill XP Updates
	function handleSkills(response) {
		const parsedResponse = JSON.parse(response);
		showSkillsXpChangePopup(parsedResponse.player_skills);
	}

	// 📈 Display XP Increase for Skills
	function showSkillsXpChangePopup(skillsXp) {
		const insertElem = document.body.querySelector("#script_player_level");
		if (!insertElem) return;

		const skillsXp_previous = JSON.parse(localStorage.getItem("script_skillsXp_previous"));

		if (skillsXp_previous && skillsXp) {
			for (const skill of skillsXp) {
				for (const prevSkill of skillsXp_previous) {
					if (prevSkill.name === skill.name && skill.xp !== prevSkill.xp) {
						const increase = Number(skill.xp) - Number(prevSkill.xp);
						const div = document.createElement("span");
						div.style.backgroundColor = "#0A748F";
						div.style.marginLeft = "10px";
						div.textContent = `${skill.name} +${increase}`;
						insertElem.appendChild(div);
						setTimeout(() => div.remove(), 6000);
						break;
					}
				}
			}
		}
		localStorage.setItem("script_skillsXp_previous", JSON.stringify(skillsXp));
	}

	// 🔼 Display XP Increase for Player Level
	function showPlayerXpChangePopup(playerXp) {
		const insertElem = document.body.querySelector("#script_player_level");
		if (!insertElem) return;

		const playerXp_previous = Number(localStorage.getItem("script_playerXp_previous"));
		if (playerXp_previous !== 0 && playerXp_previous !== playerXp) {
			const increase = playerXp - playerXp_previous;
			const div = document.createElement("span");
			div.style.backgroundColor = "#2e7d32";
			div.style.marginLeft = "10px";
			div.textContent = `XP +${increase}`;
			insertElem.appendChild(div);
			setTimeout(() => div.remove(), 6000);
		}
		localStorage.setItem("script_playerXp_previous", JSON.stringify(playerXp));
	}

	// ⚡ Enable Level-Up Time Estimation If Not Already Set
	if (!localStorage.getItem("script_estimate_levelup_time_switch")) {
		localStorage.setItem("script_estimate_levelup_time_switch", "enabled");
	}

	// 📊 Update Player XP Display
	function updatePlayerXpDisplay() {
		const playerXp = Number(localStorage.getItem("script_playerXp_current"));
		const currentLevelMaxXP = Number(localStorage.getItem("script_playerXp_max"));
		const xpLeft = Math.floor(currentLevelMaxXP - playerXp); // ✅ Whole number XP left

		// 🎯 Locate the currency stats row (contains Money, Points, Level, and Booster)
		const statsContainer = document.querySelector(".currency-stats");
		if (!statsContainer) return; // Prevents errors if not found

		// 🎯 Locate the user level element (trophy icon + level number)
		const levelElem = statsContainer.querySelector(".stat-level");
		if (!levelElem) return;

		let xpLeftElem = document.querySelector("#script_player_xp_left");

		if (!xpLeftElem) {
			// Insert XP Left right after the user level
			levelElem.insertAdjacentHTML(
				"afterend",
				`<div id="script_player_xp_left" style="margin-left: 8px; color: white; font-size: 12px; display: inline-flex; align-items: center;">
                XP Left: <strong>${xpLeft}</strong>
            </div>`
			);
		} else {
			xpLeftElem.innerHTML = `XP Left: <strong>${xpLeft}</strong>`;
		}

		// ✅ Insert countdown container as the last child of the parent of `.currency-stats`
		let countdownContainer = document.querySelector("#script_countdowns_container");
		if (!countdownContainer) {
			// Here we use the parent of statsContainer so it appears below all its content
			statsContainer.parentElement.insertAdjacentHTML(
				"beforeend",
				`<div id="script_countdowns_container" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 15px; margin-top: 10px;"></div>`
			);
		}
	}

	// ⏳ Update XP Display Every 0.5 Seconds
	setInterval(updatePlayerXpDisplay, 500);




	// 🔋 ENERGY TIMER
	function updateEnergyDisplay() {
		const energyBar = document.querySelector(".q-linear-progress.energy");
		if (!energyBar) return;

		const energyFullAtTimestamp = Number(localStorage.getItem("script_energyFullAtTimestamp"));
		let timeLeftSec = Math.floor((energyFullAtTimestamp - Date.now()) / 1000);
		let energyElem = document.querySelector("#script_energyBar");

		const displayText = (energyFullAtTimestamp === -1 || timeLeftSec <= 0) ?
			"<span style='color: #28a745;'>FULL</span>" :
			timeReadable(timeLeftSec);

		if (!energyElem) {
			energyBar.insertAdjacentHTML(
				"afterend",
				`<div id="script_energyBar" class="script-timer" style="
                cursor: pointer; text-align: center; background: rgba(0, 0, 0, 0.7);
                padding: 5px; border-radius: 5px; color: white; font-size: 14px; margin-top: 5px;">
                Energy ${displayText}
            </div>`
			);

			// 🏋️ Navigate to Gym on Click
			document.querySelector("#script_energyBar").addEventListener("click", () => {
				const gymID = localStorage.getItem("script_stronghold_id_gym");
				if (gymID) {
					history.pushState(null, null, `https://www.zed.city/stronghold/${gymID}`);
					history.pushState(null, null, `https://www.zed.city/stronghold/${gymID}`);
					history.go(-1);
				} else {
					console.warn("❌ No Gym ID Found in LocalStorage.");
				}
			});

		} else {
			energyElem.innerHTML = `Energy ${displayText}`;
		}
	}

	// ⏳ Update Energy Display Every 0.5s
	setInterval(updateEnergyDisplay, 500);


	// ☢️ RAD TIMER FUNCTION (Accurately Tracks API Timing)
	function updateRadDisplay() {
		const radBar = document.querySelector(".q-linear-progress.rad");
		if (!radBar) return;

		const radFullAtTimestamp = Number(localStorage.getItem("script_radFullAtTimestamp"));
		let timeLeftSec = Math.floor((radFullAtTimestamp - Date.now()) / 1000);
		let radElem = document.querySelector("#script_radBar");

		const displayText = (radFullAtTimestamp === -1 || timeLeftSec <= 0) ?
			"<span style='color: #28a745;'>FULL</span>" :
			timeReadable(timeLeftSec);

		if (!radElem) {
			radBar.insertAdjacentHTML(
				"afterend",
				`<div id="script_radBar" class="script-timer" style="
                cursor: pointer; text-align: center; background: rgba(0, 0, 0, 0.7);
                padding: 5px; border-radius: 5px; color: white; font-size: 14px; margin-top: 5px;">
                Rad ${displayText}
            </div>`
			);

			document.querySelector("#script_radBar").addEventListener("click", () => {
				history.pushState(null, null, "https://www.zed.city/scavenge");
				history.pushState(null, null, "https://www.zed.city/scavenge");
				history.go(0);
			});
		} else {
			radElem.innerHTML = `Rad ${displayText}`;
		}
	}

	// ⏳ Update Radiation Display Every 0.5s
	setInterval(updateRadDisplay, 500);


	// 🎭 MORALE TIMER FUNCTION (Syncs with API)
	function updateMoraleDisplay() {
		const moraleBar = document.querySelector(".q-linear-progress.morale");
		if (!moraleBar) return;

		const moraleFullAtTimestamp = Number(localStorage.getItem("script_moraleFullAtTimestamp"));
		let timeLeftSec = Math.floor((moraleFullAtTimestamp - Date.now()) / 1000);
		let moraleElem = document.querySelector("#script_moraleBar");

		const displayText = (moraleFullAtTimestamp === -1 || timeLeftSec <= 0) ?
			"<span style='color: #28a745;'>FULL</span>" :
			timeReadable(timeLeftSec);

		if (!moraleElem) {
			moraleBar.insertAdjacentHTML(
				"afterend",
				`<div id="script_moraleBar" class="script-timer" style="
                text-align: center; background: rgba(0, 0, 0, 0.7);
                padding: 5px; border-radius: 5px; color: white; font-size: 14px; margin-top: 5px;">
                Morale ${displayText}
            </div>`
			);
		} else {
			moraleElem.innerHTML = `Morale ${displayText}`;
		}
	}

	// ⏳ Update Morale Display Every 0.5s
	setInterval(updateMoraleDisplay, 500);


	// ❤️ LIFE TIMER FUNCTION (Syncs with API)
	function updateLifeDisplay() {
		const lifeBar = document.querySelector(".q-linear-progress.life");
		if (!lifeBar) return;

		const lifeFullAtTimestamp = Number(localStorage.getItem("script_lifeFullAtTimestamp"));
		let timeLeftSec = Math.floor((lifeFullAtTimestamp - Date.now()) / 1000);
		let lifeElem = document.querySelector("#script_lifeBar");

		const displayText = (lifeFullAtTimestamp === -1 || timeLeftSec <= 0) ?
			"<span style='color: #28a745;'>FULL</span>" :
			timeReadable(timeLeftSec);

		if (!lifeElem) {
			lifeBar.insertAdjacentHTML(
				"afterend",
				`<div id="script_lifeBar" class="script-timer" style="
                cursor: pointer; text-align: center; background: rgba(0, 0, 0, 0.7);
                padding: 5px; border-radius: 5px; color: white; font-size: 14px; margin-top: 5px;">
                Life ${displayText}
            </div>`
			);
		} else {
			lifeElem.innerHTML = `Life ${displayText}`;
		}
	}

	// ⏳ Update Life Display Every 0.5s
	setInterval(updateLifeDisplay, 500);


	// 🎯 Ensure necessary localStorage variables exist
	const junkStoreDefaults = {
		script_junkStoreResetTimestamp: 0,
		script_junkStore_ironBarStock: 0,
		script_junkStore_logsStock: 0,
		script_junkStore_scrapStock: 0,
		script_junkStore_nailsStock: 0,
		script_junkStore_limit_left: 0
	};

	for (const [key, value] of Object.entries(junkStoreDefaults)) {
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, value);
		}
	}

	/**
	 * Handles store limit data and updates local storage
	 */
	function handleGetStoreJunkLimit(response) {
		const data = JSON.parse(response);
		const secLeft = data?.limits?.reset_time;

		// ⏳ Store reset timestamp
		if (secLeft) {
			const previousTimestamp = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
			const timestamp = Date.now() + secLeft * 1000;
			localStorage.setItem("script_junkStoreResetTimestamp", timestamp);

			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_junkStoreIsAlreadyNotified", false);
			}
		}

		// 🛒 Update stock for buyable items in the Junk Store
		if (data?.storeItems) {
			const updateStock = (itemCode, storageKey) => {
				// Finds the item by its codename in the API response
				const item = data.storeItems.find(i => i.codename === itemCode);
				if (item) {
					localStorage.setItem(storageKey, item.quantity);
				}
			};

			// Use the *actual* codenames from your API (e.g. "craft_log", "craft_scrap", "craft_nails")
			updateStock("iron_bar", "script_junkStore_ironBarStock");
			updateStock("craft_log", "script_junkStore_logsStock");
			updateStock("craft_scrap", "script_junkStore_scrapStock");
			updateStock("craft_nails", "script_junkStore_nailsStock");
		}

		// 📈 Update purchase limit
		localStorage.setItem(
			"script_junkStore_limit_left",
			data?.limits?.limit_left ? data.limits.limit_left + 240 : 360
		);
	}




	// 🎯 Ensure necessary localStorage variables exist
	const jobDefaults = {
		script_forgeTimestamp: 0,
		script_scavenge_records: "{}",
		script_hunting_records: "{}",
		script_stronghold_id_gym: "",
		script_stronghold_id_radio_tower: "",
		script_stronghold_id_furnace: ""
	};

	for (const [key, value] of Object.entries(jobDefaults)) {
		if (!localStorage.getItem(key)) {
			localStorage.setItem(key, value);
		}
	}



	// Junk Store Buy Limit Display
	function addBuyLimitInfo() {
		if (!window.location.href.includes("/store/junk")) return;
		const row = document.querySelector(".title > div.row.q-col-gutter-xs.q-px-xs");
		if (!row) return;
		const cols = row.querySelectorAll(".col");
		const target = cols[1];
		if (!target) return;
		let info = document.getElementById("script_buyLimitInfo");
		if (!info) {
			info = document.createElement("div");
			info.id = "script_buyLimitInfo";
			info.style.cssText = "text-align: center; color: white; font-size: 20px; margin-left: 130px;";
			target.appendChild(info);
		}
		const limitLeft = Number(localStorage.getItem("script_junkStore_limit_left")) || 0;
		const total = 360;
		let used = total - limitLeft;
		if (used < 0) used = 0;
		const resetTs = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
		const secLeft = Math.floor((resetTs - Date.now()) / 1000);
		const resetText = secLeft > 0 ? timeReadable(secLeft) : "Refreshed";

		info.innerHTML =
			limitLeft === total ?
			`Buy Limit Remaining: ${limitLeft}` :
			limitLeft > 0 ?
			`Buy Limit Remaining: ${limitLeft} (Resets in ${resetText})` :
			`<span style="color:red;">BUY LIMIT REACHED</span> — Next reset in ${resetText}`;
	}
	setInterval(addBuyLimitInfo, 500);


	function addMaxBuySellButton() {
		const modal = document.querySelector(".small-modal");
		if (!modal) return;
		if (modal.querySelector(".script-store-btn")) return;
		const input = modal.querySelector("input");
		if (!input) return;

		const btns = modal.querySelectorAll("button");
		const buyBtn = Array.from(btns).find(b => b.textContent.trim().toLowerCase() === "buy");

		const maxBtn = document.createElement("button");
		maxBtn.className = "script-store-btn";
		maxBtn.textContent = "Max";
		maxBtn.style.cssText = `
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 1000;
    pointer-events: auto;
  `;

		const isJunk = window.location.href.includes("/store/junk");

		if (buyBtn && isJunk) {
			const imgSrc = modal.querySelector(".zed-item-img__content img")?.src || "";
			const mapping = {
				iron_bar: "script_junkStore_ironBarStock",
				logs: "script_junkStore_logsStock",
				scrap: "script_junkStore_scrapStock",
				nails: "script_junkStore_nailsStock"
			};
			// Note: This line uses a partial regex or placeholder
			const match = Object.keys(mapping).find(key => imgSrc.includes(`/${key}`));
			const storeKey = match ? mapping[match] : null;
			if (storeKey) {
				const stock = Number(localStorage.getItem(storeKey)) || 0;
				const limitLeft = Number(localStorage.getItem("script_junkStore_limit_left")) || 0;
				const buyNum = Math.max(0, Math.min(stock, limitLeft));
				if (buyNum > 0) {
					maxBtn.addEventListener("click", () => {
						input.value = buyNum;
						input.dispatchEvent(new Event("input", {
							bubbles: true
						}));
					});
				} else {
					maxBtn.disabled = true;
				}
			} else {
				maxBtn.addEventListener("click", () => {
					input.value = 999999;
					input.dispatchEvent(new Event("input", {
						bubbles: true
					}));
				});
			}
		} else {
			maxBtn.addEventListener("click", () => {
				input.value = 999999;
				input.dispatchEvent(new Event("input", {
					bubbles: true
				}));
			});
		}

		modal.style.position = "relative";
		modal.appendChild(maxBtn);
	}
	setInterval(addMaxBuySellButton, 500);



	/**
	 * Handles various jobs such as forging, scavenging, and hunting.
	 */
	function handleStartJob(response) {
		const data = JSON.parse(response);
		const jobName = data?.job?.codename;

		// 🔥 Furnace Activity Tracking
		const perActionTime = data?.job?.items?.["item_requirement-bp"]?.vars?.wait_time;
		const perActionConsumeItemNumber = data?.job?.items?.["item_requirement-bp"]?.vars?.items?.["item_requirement-1"]?.qty;
		const consumeItemNumber = data?.job?.items?.["item_requirement-1"]?.quantity;

		if (jobName === "furnace" && perActionTime && perActionConsumeItemNumber && consumeItemNumber) {
			const secLeft = perActionTime * (consumeItemNumber / perActionConsumeItemNumber);
			localStorage.setItem("script_forgeTimestamp", Date.now() + secLeft * 1000);
			localStorage.setItem("script_forgeIsAlreadyNotified", false);
			return;
		}

		// 🔍 Scavenging Activity Tracking
		if (jobName?.startsWith("job_scavenge_") || ["room_scavenge", "scavenge"].includes(data?.job?.layout)) {
			const records = JSON.parse(localStorage.getItem("script_scavenge_records")) || {};
			const mapName = data?.job?.name;

			if (!records[mapName]) {
				records[mapName] = {
					mapName,
					totalAttempts: 0,
					successCount: 0,
					itemRewards: {}
				};
			}

			records[mapName].totalAttempts += 1;

			// ✅ If scavenging was successful, track rewards
			if (data?.outcome?.rewards?.length > 0) {
				records[mapName].successCount += 1;

				for (const reward of data.outcome.rewards) {
					records[mapName].itemRewards[reward.name] = (records[mapName].itemRewards[reward.name] || 0) + Number(reward.posted_qty);
				}
			}

			localStorage.setItem("script_scavenge_records", JSON.stringify(records));
		}

		// 🎯 Hunting Activity Tracking
		handleHuntingStartJob(data);

		// 🏋️ Gym Training Tracking
		handleGymStartJob(data);

		// ⛽ Fuel Depot Trade Cooldown (3 hours)
		if (jobName?.startsWith("job_fuel_depot_fuel_trader_1")) {
			localStorage.setItem("script_exploration_fuelTrade_cooldown_at_ms", Date.now() + 10800 * 1000);
		}
	}

    /**
     * 🏋️ Handles Gym Training Details
     */
    function handleGymStartJob(response) {
        if (response?.job?.codename !== "gym") return;

        const playerName = localStorage.getItem("script_playerName");
        const getStats = JSON.parse(localStorage.getItem("script_getStats"));

        const gymLevel = response?.job?.vars?.level;
        const stat = response?.outcome?.gym_rewards?.skill; // FIXED: correct path
        const gain = response?.outcome?.gym_rewards?.gain; // FIXED: correct path
        const energy = response?.outcome?.iterations * 5;

        const statBefore = Number(getStats?.stats?.[stat] ?? 0); // safeguard if missing
        const moralBefore = Number(getStats?.morale ?? 0);
        const moralAfter = response?.reactive_items_qty?.find(item => item.codename === "morale")?.quantity ?? moralBefore;

        console.log(
            `${playerName} trained in the ${gymLevel}-star gym with ${energy} energy. ` +
            `Morale decreased from ${moralBefore} to ${moralAfter}, ${stat} increased from ${statBefore} by ${gain}.`
        );

        const insertToElem = document.body.querySelector(".q-page.q-layout-padding div");
        if (insertToElem) {
            insertToElem.insertAdjacentHTML(
                "beforeend",
                `<div class="script_do_not_translate" style="font-size: 12px;">
                ${playerName} trained in the ${gymLevel}-star gym with ${energy} energy.
                Morale decreased from ${moralBefore} to ${moralAfter}, ${stat} increased from ${statBefore} by ${gain}.
            </div>`
            );
        }
    }


	/**
	 * 🔥 Handles Job Completion for the Furnace
	 */
	function handleCompleteJob(response) {
		if (JSON.parse(response)?.job?.codename !== "furnace") return;

		localStorage.setItem("script_forgeTimestamp", Date.now());
		localStorage.setItem("script_forgeIsAlreadyNotified", true);
	}

	/**
	 * 🏰 Fetch Stronghold Room IDs
	 */
	function handleGetStronghold(response) {
		const data = JSON.parse(response);
		if (!data?.stronghold) return;

		const strongholdMapping = {
			gym: "script_stronghold_id_gym",
			radio_tower: "script_stronghold_id_radio_tower",
			furnace: "script_stronghold_id_furnace",
		};

		for (const key in data.stronghold) {
			const area = data.stronghold[key].codename;
			if (strongholdMapping[area]) {
				localStorage.setItem(strongholdMapping[area], String(key));
			}
		}

		handleFurnaceJob(data);
	}

	/**
	 * 🔥 Handle Furnace Job Status (Accurate + Sync Safe)
	 */
	function handleFurnaceJob(data) {
		for (const key in data.stronghold) {
			const area = data.stronghold[key];
			if (area.codename !== "furnace") continue;

			const perActionTime = area?.items?.["item_requirement-bp"]?.vars?.wait_time; // Time per smelt
			const perActionConsumeItemNumber = area?.items?.["item_requirement-bp"]?.vars?.items?.["item_requirement-1"]?.qty; // Items consumed per smelt
			const consumeItemNumber = area?.items?.["item_requirement-1"]?.quantity; // Total items queued
			const iterationsPassed = area?.iterationsPassed; // Completed smelts
			const timeLeft = area?.timeLeft; // Time left on current smelt

			if (perActionTime && perActionConsumeItemNumber && consumeItemNumber && iterationsPassed !== undefined && timeLeft !== undefined) {
				const remainingIterations = consumeItemNumber / perActionConsumeItemNumber - iterationsPassed;
				const secLeft = perActionTime * remainingIterations - (perActionTime - timeLeft);

				// Safety check for invalid times
				if (secLeft < 0) continue;

				const timestamp = Date.now() + secLeft * 1000;
				const previousTimestamp = Number(localStorage.getItem("script_forgeTimestamp"));

				// Update timestamp if change is significant (30s buffer)
				if (!previousTimestamp || Math.abs(timestamp - previousTimestamp) > 30000) {
					localStorage.setItem("script_forgeTimestamp", timestamp);
					localStorage.setItem("script_forgeIsAlreadyNotified", false);
				}

				// Optional: store for debug/reference
				localStorage.setItem("script_forgeTotalSecondsRemaining", secLeft.toFixed(2));
				localStorage.setItem("script_forgeRemainingIterations", remainingIterations.toFixed(2));
				localStorage.setItem("script_forgeTotalInputQty", consumeItemNumber);

				console.log(`[Addon] Furnace synced: ${consumeItemNumber} items, ${remainingIterations.toFixed(2)} iterations left. ${secLeft.toFixed(1)}s remaining. Ends at: ${new Date(timestamp).toLocaleTimeString()}`);
				break;
			} else {
				// Clear timer if furnace idle or missing data
				localStorage.removeItem("script_forgeTimestamp");
				localStorage.setItem("script_forgeIsAlreadyNotified", false);
				console.log(`[Addon] Furnace idle or data incomplete. Timer cleared.`);
			}
		}
	}


	/**
	 * 📡 Handle Radio Tower Trade Refresh
	 */
	if (!localStorage.getItem("script_radioTowerTradeTimestamp")) {
		localStorage.setItem("script_radioTowerTradeTimestamp", 0);
	}

	function handleGetRadioTower(response) {
		const data = JSON.parse(response);
		const expire = data?.expire;
		if (expire) {
			const previousTimestamp = Number(localStorage.getItem("script_radioTowerTradeTimestamp"));
			const timestamp = Date.now() + expire * 1000;
			localStorage.setItem("script_radioTowerTradeTimestamp", timestamp);
			if (timestamp - previousTimestamp > 30000) {
				localStorage.setItem("script_radioTowerIsAlreadyNotified", false);
			}
		}
	}


	// Junk Store Timer UI
	function updateStoreResetDisplay() {
		const container = getTimerContainer();
		const resetTimestamp = Number(localStorage.getItem("script_junkStoreResetTimestamp"));
		if (!container || resetTimestamp === 0) return;
		const timeLeftSec = Math.floor((resetTimestamp - Date.now()) / 1000);
		const storeHTML = timeLeftSec > 0 ?
			`<span style="font-size: 12px;">Store ${timeReadable(timeLeftSec)}</span>` :
			`<span style="background-color: #ef5350; font-size: 12px;">Store Refreshed</span>`;
		let storeElem = container.querySelector("#script_junk_store_limit_logo");
		if (!storeElem) {
			storeElem = document.createElement("div");
			storeElem.id = "script_junk_store_limit_logo";
			storeElem.style.order = "2";
			storeElem.style.cursor = "pointer";
			container.appendChild(storeElem);
			storeElem.addEventListener("click", () => {
				history.pushState(null, null, "https://www.zed.city/store/junk");
				history.pushState(null, null, "https://www.zed.city/store/junk");
				history.go(-1);
			});
		}
		storeElem.innerHTML = storeHTML;
	}
	setInterval(updateStoreResetDisplay, 500);

	// Radio Timer UI
	function updateRadioTowerDisplay() {
		const container = getTimerContainer();
		if (!container || localStorage.getItem("script_radioTowerTradeTimestamp") === "0") return;
		let radioElem = container.querySelector("#script_radio_tower_logo");
		const timeLeftSec = Math.floor((Number(localStorage.getItem("script_radioTowerTradeTimestamp")) - Date.now()) / 1000);
		const statusText = timeLeftSec > 0 ?
			`Radio ${timeReadable(timeLeftSec)}` :
			`<span style="background-color: #ef5350;">Radio Ready</span>`;
		if (!radioElem) {
			radioElem = document.createElement("div");
			radioElem.id = "script_radio_tower_logo";
			radioElem.style.cursor = "pointer";
			radioElem.style.order = "4";
			radioElem.className = "script_do_not_translate";
			container.appendChild(radioElem);
			radioElem.addEventListener("click", () => {
				const radioId = localStorage.getItem("script_stronghold_id_radio_tower");
				if (radioId) {
					history.pushState(null, null, `https://www.zed.city/stronghold/${radioId}`);
					history.pushState(null, null, `https://www.zed.city/stronghold/${radioId}`);
					history.go(-1);
				}
			});
		}
		radioElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">${statusText}</span>`;
	}
	setInterval(updateRadioTowerDisplay, 500);

	// Raid Timer UI
	function updateRaidDisplay() {
		const container = getTimerContainer();
		if (!container || localStorage.getItem("script_raidTimestamp") === "0") return;
		let raidElem = container.querySelector("#script_raidCooldown_logo");
		const timeLeftSec = Math.floor((Number(localStorage.getItem("script_raidTimestamp")) - Date.now()) / 1000);
		const statusText = timeLeftSec > 0 ?
			`Raid ${timeReadable(timeLeftSec)}` :
			`<span style="background-color: #ef5350;">Raid Ready</span>`;
		if (!raidElem) {
			raidElem = document.createElement("div");
			raidElem.id = "script_raidCooldown_logo";
			raidElem.style.cursor = "pointer";
			raidElem.style.order = "1";
			raidElem.className = "script_do_not_translate";
			container.appendChild(raidElem);
			raidElem.addEventListener("click", () => {
				history.pushState(null, null, "https://www.zed.city/raids");
				history.pushState(null, null, "https://www.zed.city/raids");
				history.go(-1);
			});
		}
		raidElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">${statusText}</span>`;
	}
	setInterval(updateRaidDisplay, 500);

	// Explore Timer UI
	function updateFuelTradeDisplay() {
		const container = getTimerContainer();
		if (!container) return;
		let fuelElem = container.querySelector("#script_fuelTrade_logo");
		const cooldownTimestamp = Number(localStorage.getItem("script_exploration_fuelTrade_cooldown_at_ms")) || 0;
		const timeLeftSec = Math.floor((cooldownTimestamp - Date.now()) / 1000);
		const statusText = timeLeftSec > 0 ?
			`Explore: ${timeReadable(timeLeftSec)}` :
			`Explore: <span style="color: #28a745;">Ready</span>`;
		if (!fuelElem) {
			fuelElem = document.createElement("div");
			fuelElem.id = "script_fuelTrade_logo";
			fuelElem.style.cursor = "pointer";
			fuelElem.style.order = "5";
			fuelElem.className = "script_do_not_translate";
			container.appendChild(fuelElem);
			fuelElem.addEventListener("click", () => {
				history.pushState(null, null, "https://www.zed.city/explore");
				history.pushState(null, null, "https://www.zed.city/explore");
				history.go(-1);
			});
		}
		fuelElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">${statusText}</span>`;
	}
	setInterval(updateFuelTradeDisplay, 500);

	// Battle Stats Timer UI
	function updateBSDisplay() {
		const container = getTimerContainer();
		if (!container) return;
		let bsElem = container.querySelector("#script_bs_logo");
		const totalBS = localStorage.getItem("script_totalBS") || 0;
		const statusText = `Total Battle Stats: ${numberFormatter(totalBS)}`;
		if (!bsElem) {
			bsElem = document.createElement("div");
			bsElem.id = "script_bs_logo";
			bsElem.style.cursor = "pointer";
			bsElem.style.order = "6";
			bsElem.className = "script_do_not_translate";
			container.appendChild(bsElem);
			bsElem.addEventListener("click", () => {
				const gymId = localStorage.getItem("script_stronghold_id_gym");
				if (gymId) {
					history.pushState(null, null, `https://www.zed.city/stronghold/${gymId}`);
					history.pushState(null, null, `https://www.zed.city/stronghold/${gymId}`);
					history.go(-1);
				}
			});
		}
		bsElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px; color: green;">${statusText}</span>`;
	}
	setInterval(updateBSDisplay, 500);

	// Furnace Timer UI
	function updateForgeDisplay() {
		const container = getTimerContainer();
		if (!container || localStorage.getItem("script_forgeTimestamp") === "0") return;
		let forgeElem = container.querySelector("#script_forge_logo");
		const timeLeftSec = Math.floor((Number(localStorage.getItem("script_forgeTimestamp")) - Date.now()) / 1000);
		const statusText = timeLeftSec > 0 ?
			`Furnace ${timeReadable(timeLeftSec)}` :
			`<span style="background-color: #ef5350;">Furnace Inactive</span>`;
		if (!forgeElem) {
			forgeElem = document.createElement("div");
			forgeElem.id = "script_forge_logo";
			forgeElem.style.cursor = "pointer";
			forgeElem.style.order = "3";
			forgeElem.className = "script_do_not_translate";
			container.appendChild(forgeElem);
			forgeElem.addEventListener("click", () => {
				const furnaceId = localStorage.getItem("script_stronghold_id_furnace");
				if (furnaceId) {
					history.pushState(null, null, `https://www.zed.city/stronghold/${furnaceId}`);
					history.pushState(null, null, `https://www.zed.city/stronghold/${furnaceId}`);
					history.go(-1);
				}
			});
		}
		forgeElem.innerHTML = `<span class="script_do_not_translate" style="font-size: 12px;">${statusText}</span>`;
	}
	setInterval(updateForgeDisplay, 500);



	/**
	 * 🏴 **Display Faction Raid Cooldown**
	 */
	if (!localStorage.getItem("script_raidTimestamp")) {
		localStorage.setItem("script_raidTimestamp", 0);
	}




	/**
	 * 🔔 **Countdown Notification System**
	 */
	function pushSystemNotifications() {
		if (localStorage.getItem("script_settings_notifications") !== "enabled") return;

		const notificationItems = [{
				key: "script_forgeTimestamp",
				notifiedKey: "script_forgeIsAlreadyNotified",
				message: "Furnace is Idle",
				url: `https://www.zed.city/stronghold/${localStorage.getItem("script_stronghold_id_furnace")}`
			},
			{
				key: "script_radioTowerTradeTimestamp",
				notifiedKey: "script_radioTowerIsAlreadyNotified",
				message: "Radio Tower has refreshed",
				url: `https://www.zed.city/stronghold/${localStorage.getItem("script_stronghold_id_radio_tower")}`
			},
			{
				key: "script_raidTimestamp",
				notifiedKey: "script_raidIsAlreadyNotified",
				message: "Faction Raid Ready",
				url: "https://www.zed.city/raids"
			},
			{
				key: "script_junkStoreResetTimestamp",
				notifiedKey: "script_junkStoreIsAlreadyNotified",
				message: "The Junk Store has refreshed",
				url: "https://www.zed.city/store/junk"
			},
			{
				key: "script_energyFullAtTimestamp",
				notifiedKey: "script_energyFullAlreadyNotified",
				message: "Energy is Full",
				url: `https://www.zed.city/stronghold/${localStorage.getItem("script_stronghold_id_gym")}`
			},
			{
				key: "script_radFullAtTimestamp",
				notifiedKey: "script_radFullAlreadyNotified",
				message: "Rad is Full",
				url: "https://www.zed.city/scavenge"
			},
		];

		notificationItems.forEach(({
			key,
			notifiedKey,
			message,
			url
		}) => {
			const timestamp = Number(localStorage.getItem(key));
			const isAlreadyNotified = localStorage.getItem(notifiedKey);
			const timeLeftSec = Math.floor((timestamp - Date.now()) / 1000);

			if (timestamp > 0 && isAlreadyNotified !== "true" && timeLeftSec > -60 && timeLeftSec < 0) {
				console.log(`pushSystemNotification: ${message}`);
				localStorage.setItem(notifiedKey, true);
				GM_notification({
					text: message,
					title: "Zed City Tools",
					url
				});
			}
		});
	}
	setInterval(pushSystemNotifications, 1000);


	// Function to create the timer container on all pages
	function createTimerContainer() {
		let timerContainer = document.querySelector("#script_timer_container");

		if (!timerContainer) {
			timerContainer = document.createElement("div");
			timerContainer.id = "script_timer_container";
			document.body.appendChild(timerContainer);
		}

		updateContainerStyle(); // Apply styles after creation
	}

	// Function to update the timer container style based on user settings
	function updateContainerStyle() {
		let timerContainer = document.querySelector("#script_timer_container");

		if (!timerContainer) {
			console.error("Timer container not found!");
			return;
		}

		let alignRight = localStorage.getItem("script_timerAlign") === "right"; // Retrieve user setting

		Object.assign(timerContainer.style, {
			position: "fixed",
			top: "230px", // Adjust vertical position
			left: alignRight ? "unset" : "400px", // Align left
			right: alignRight ? "400px" : "unset", // Align right if enabled
			width: "250px",
			background: "rgba(0, 0, 0, 0.7)",
			padding: "10px",
			borderRadius: "5px",
			color: "white",
			fontSize: "14px",
			textAlign: "center",
			display: "flex",
			flexDirection: "column",
			gap: "5px",
			zIndex: "1000",
		});


	}


	let lastFetchedTime = 0; // Prevents excessive API calls
	let dismissed = false; // Tracks if the warning was dismissed by clicking "Close"
	let doNotShow = false; // Tracks if the user selected "Do Not Show Again"
	let lastXP = null; // Stores the last XP value for change detection

	// Function to fetch XP data (only if enough time has passed)
	async function fetchXPData() {
		const now = Date.now();
		if (now - lastFetchedTime < 5000) return null;

		try {
			const response = await fetch("https://api.zed.city/getStats", {
				method: "GET",
				credentials: "include"
			});
			if (!response.ok) throw new Error("Failed to fetch XP data.");
			const data = await response.json();
			lastFetchedTime = now;
			return data;
		} catch (error) {
			console.error("❌ Error fetching XP data:", error);
			return null;
		}
	}

	// Function to check XP and display the warning if necessary
	async function checkAndDisplayWarning() {
		// If "Do Not Show Again" is active, reset when XP changes
		if (doNotShow) {
			const data = await fetchXPData();
			if (data && data.experience !== lastXP) {
				doNotShow = false;
				dismissed = false;
			}
			return;
		}

		const data = await fetchXPData();
		if (!data) return;

		const {
			experience,
			xp_end
		} = data;
		const xpNeeded = xp_end - experience;

		// Reset dismissal if XP changes
		if (dismissed && experience !== lastXP) dismissed = false;
		lastXP = experience;

		if (xpNeeded <= 25 && !dismissed) showLevelUpWarning(xpNeeded);
	}

	// Function to display the level-up warning with two options
	function showLevelUpWarning(xpNeeded) {
		if (document.getElementById("levelUpWarning")) return;

		const warning = document.createElement("div");
		warning.id = "levelUpWarning";
		Object.assign(warning.style, {
			position: "fixed",
			top: "10px",
			left: "50%",
			transform: "translateX(-50%)",
			backgroundColor: "red",
			color: "white",
			padding: "15px",
			fontSize: "18px",
			fontWeight: "bold",
			border: "2px solid black",
			borderRadius: "5px",
			zIndex: "9999",
			textAlign: "center"
		});

		// Warning message
		warning.innerHTML = `<div>⚠️ WARNING: You are ${xpNeeded} XP away from leveling up!</div>`;

		// Button container
		const btnContainer = document.createElement("div");
		btnContainer.style.marginTop = "10px";

		// "Close" button: dismisses the warning temporarily
		const closeBtn = document.createElement("button");
		closeBtn.innerText = "Close";
		closeBtn.style.marginRight = "10px";
		closeBtn.addEventListener("click", () => {
			warning.remove();
			dismissed = true;
		});

		// "Do Not Show Again" button: disables the warning until XP changes
		const dontShowBtn = document.createElement("button");
		dontShowBtn.innerText = "Do Not Show Again";
		dontShowBtn.addEventListener("click", () => {
			warning.remove();
			doNotShow = true;
		});

		btnContainer.appendChild(closeBtn);
		btnContainer.appendChild(dontShowBtn);
		warning.appendChild(btnContainer);
		document.body.appendChild(warning);

		// Auto-remove after 10 seconds
		setTimeout(() => {
			if (document.body.contains(warning)) warning.remove();
		}, 10000);
	}

	// Trigger an XP check on each click
	document.addEventListener("click", checkAndDisplayWarning);


	// Function to add settings UI in https://www.zed.city/settings
	function addSettingsUI() {
		if (!window.location.href.includes("/settings")) return; // Only run on the settings page

		let settingsContainer = document.querySelector(".zed-grid.has-title.has-content"); // Match game container

		if (!settingsContainer) {
			console.error("Settings container not found!");
			return;
		}

		// Prevent adding the settings UI multiple times
		if (document.querySelector("#script_settingsPanel")) return;

		// Create settings panel using game styling
		let settingsPanel = document.createElement("div");
		settingsPanel.id = "script_settingsPanel";
		settingsPanel.className = "zed-grid has-title has-content";
		settingsPanel.innerHTML = `

<!-- 🛠️ Durability Threshold Setting -->
<div class="title"><div>Hunting Durability Warning</div></div>
<div class="grid-cont">
    <div class="q-pa-md">
        <label class="q-field row no-wrap items-start q-field--outlined q-field--dark q-field--dense">
            <div class="q-field__inner relative-position col self-stretch">
                <div class="q-field__control relative-position row no-wrap">
                    <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <span class="q-field__label">Durability Warning Threshold:</span>
                            <strong id="script_durabilityValue" style="color: #4CAF50; font-size: 14px;">40%</strong>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <input type="range" id="script_durabilitySlider" min="0" max="100" step="1" value="40"
                                style="width: 100%; margin-top: 5px; accent-color: #2196F3;">
                        </div>
                    </div>
                </div>
            </div>
        </label>
    </div>
</div>


       <!-- 📌 Draggable Timer Toggle (Better UI) -->
       <div class="title"><div>Timer Container Settings</div></div>
       <div class="grid-cont">
           <div class="q-pa-md">
               <label class="q-field row no-wrap items-start q-field--outlined q-field--dark q-field--dense">
                   <div class="q-field__inner relative-position col self-stretch">
                       <div class="q-field__control relative-position row no-wrap">
                           <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                               <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
                                   <span class="q-field__label">Draggable Timer Container:</span>
                                   <div style="display: flex; align-items: center; gap: 10px;">
                                       <strong id="script_timerDraggableText" style="color: #4CAF50; font-size: 14px;">Enabled</strong>
                                       <input type="checkbox" id="script_timerDraggableCheckbox" style="transform: scale(1.2); accent-color: #2196F3;">
                                   </div>
                               </div>
                           </div>
                       </div>
                   </div>
               </label>
           </div>
       </div>
    `;

		// Append the panel to the settings page
		settingsContainer.appendChild(settingsPanel);

		// 🎛️ Load stored durability threshold
		let savedThreshold = localStorage.getItem("script_durability_threshold") || 40;
		let slider = document.querySelector("#script_durabilitySlider");
		let valueDisplay = document.querySelector("#script_durabilityValue");
		slider.value = savedThreshold;
		valueDisplay.textContent = `${savedThreshold}%`;

		// 🎛️ Update value display & save setting on change
		slider.addEventListener("input", () => {
			valueDisplay.textContent = `${slider.value}%`;
		});

		slider.addEventListener("change", () => {
			localStorage.setItem("script_durability_threshold", slider.value);
		});

		// 📌 Load & Apply Draggable Timer Setting
		const draggableCheckbox = document.getElementById("script_timerDraggableCheckbox");
		const draggableText = document.getElementById("script_timerDraggableText");

		draggableCheckbox.checked = localStorage.getItem("script_timerDraggable") !== "false";
		draggableText.textContent = draggableCheckbox.checked ? "Enabled" : "Disabled";
		draggableText.style.color = draggableCheckbox.checked ? "#4CAF50" : "#F44336";

		draggableCheckbox.addEventListener("change", () => {
			const enabled = draggableCheckbox.checked;
			localStorage.setItem("script_timerDraggable", enabled ? "true" : "false");
			draggableText.textContent = enabled ? "Enabled" : "Disabled";
			draggableText.style.color = enabled ? "#4CAF50" : "#F44336";
			updateTimerContainerBasedOnSetting();
		});

		console.log("Settings panel added successfully.");
	}


	// Fix: Use MutationObserver to detect SPA page changes
	function observePageChanges() {
		const observer = new MutationObserver(() => {
			if (window.location.href.includes("/settings")) {
				addSettingsUI(); // Add settings UI when on settings page
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// Ensure the timer container is always visible
	createTimerContainer();

	// Run observer to detect SPA changes
	observePageChanges();

	// ============================
	// End New Timer Container Code
	// ============================


	function makeTimerContainerDraggable() {
		const container = document.getElementById("script_timer_container");
		if (!container) return;

		// Create a handle bar at the top
		let dragHandle = document.createElement("div");
		dragHandle.id = "script_timer_dragHandle";
		dragHandle.style.background = "rgba(255,255,255,0.1)";
		dragHandle.style.cursor = "move";
		dragHandle.style.padding = "5px";
		dragHandle.style.fontWeight = "bold";
		dragHandle.style.textAlign = "center";
		dragHandle.textContent = "ZCTools (Drag me)";

		// Insert the handle as the first child of the container
		container.insertBefore(dragHandle, container.firstChild);

		let offsetX = 0,
			offsetY = 0;

		// When user clicks down on the handle, begin the drag
		dragHandle.addEventListener("mousedown", function(e) {
			e.preventDefault();
			// Calculate the mouse's offset from the container's top-left corner
			offsetX = e.clientX - container.offsetLeft;
			offsetY = e.clientY - container.offsetTop;

			// Listen for mousemove & mouseup on the entire document
			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);
		});

		// Move the container as the mouse moves
		function onMouseMove(e) {
			container.style.left = (e.clientX - offsetX) + "px";
			container.style.top = (e.clientY - offsetY) + "px";
		}

		// When user releases the mouse, stop dragging
		function onMouseUp() {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		}
	}

	/**
	 * 📌 **Utility Functions**
	 */
	function getOriTextFromElement(elem) {
		if (!elem) {
			console.error("getTextFromElement: element is null");
			return "";
		}
		return elem.getAttribute("script_translated_from") || elem.textContent;
	}

	function numberFormatter(num, digits = 1) {
		if (num == null) return null;
		if (num < 0) return "-" + numberFormatter(-num);

		const units = [{
				value: 1,
				symbol: ""
			},
			{
				value: 1e3,
				symbol: "k"
			},
			{
				value: 1e6,
				symbol: "M"
			},
			{
				value: 1e9,
				symbol: "B"
			}
		];

		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
		let unit = units.slice().reverse().find(u => num >= u.value);

		return unit ? (num / unit.value).toFixed(digits).replace(rx, "$1") + unit.symbol : "0";
	}

	function timeReadable(sec) {
		if (sec >= 86400) return `${(sec / 86400).toFixed(1)} Days`;

		const d = new Date(sec * 1000);
		const pad = (n) => ("0" + n).slice(-2);

		let hours = d.getUTCHours() ? d.getUTCHours() + ":" : "";
		return hours + pad(d.getUTCMinutes()) + ":" + pad(d.getUTCSeconds());
	}

	function timeReadableNoSec(sec) {
		return sec >= 86400 ? `${(sec / 86400).toFixed(1)} Days` : `${(sec / 3600).toFixed(1)} Hours`;
	}

	/**
	 * 🏋️ **Gym Lock & Max Button System**
	 */
	const processedElements = new Set();

	function lockElement(element, isLocked) {
		element.style.pointerEvents = isLocked ? "none" : "";
		element.style.opacity = isLocked ? "0.5" : "";
	}

	function getCheckboxStates() {
		return JSON.parse(localStorage.getItem("script_gymCheckboxes")) || {};
	}

	function saveCheckboxStates(states) {
		localStorage.setItem("script_gymCheckboxes", JSON.stringify(states));
	}

	function addGymLocks() {
		const gymElements = document.querySelectorAll(".grid-cont.text-center.gym-cont");
		const states = getCheckboxStates();

		gymElements.forEach((element, index) => {
			if (processedElements.has(element)) return;

			/* 🔒 Lock Checkbox */
			const checkbox = document.createElement("input");
			checkbox.type = "checkbox";
			checkbox.className = "lock-checkbox";
			checkbox.style.cssText = "position: absolute; bottom: 10px; left: 10px; z-index: 1000; pointer-events: auto;";

			const key = `checkbox-${element.dataset.id || index}`;
			checkbox.checked = states[key] || false;
			lockElement(element, checkbox.checked);

			checkbox.addEventListener("change", () => {
				states[key] = checkbox.checked;
				saveCheckboxStates(states);
				lockElement(element, checkbox.checked);
			});

			/* 🔼 Max Button */
			const maxBtn = document.createElement("button");
			maxBtn.textContent = "Max";
			maxBtn.style.cssText = "position: absolute; bottom: 10px; right: 10px; z-index: 1000; pointer-events: auto;";

			maxBtn.addEventListener("click", () => {
				const input = element.querySelector("input");
				let maxTrainTimes = Math.floor(Number(localStorage.getItem("script_energy")) / 5);
				maxTrainTimes = maxTrainTimes > 0 ? maxTrainTimes : 1;

				/* 🎯 React Input Hack */
				let lastValue = input.value;
				input.value = maxTrainTimes;

				let event = new Event("input", {
					bubbles: true
				});
				event.simulated = true;

				let tracker = input._valueTracker;
				if (tracker) tracker.setValue(lastValue);

				input.dispatchEvent(event);
			});

			/* 🏗️ Append Elements */
			element.style.position = "relative";
			element.appendChild(checkbox);
			element.appendChild(maxBtn);
			processedElements.add(element);
		});
	}
	setInterval(addGymLocks, 500);

	//Junk Store Buy Limit Display



	/**
	 * 🔍 **Scavenger Records UI (Table Format)**
	 */
	function addScavengeRecords() {
		if (!window.location.href.match(/zed\.city\/(scavenge|exploring|outposts)/)) return;

		const insertToElem = document.body.querySelector(".q-page.q-layout-padding");
		if (!insertToElem) return;

		const isHidden = localStorage.getItem("script_scavenge_records_hidden") === "true";
		const records = JSON.parse(localStorage.getItem("script_scavenge_records")) || {};

		let htmlContent = `
        <div id="script_scavenge_records_container" style="margin: 20px 0;">
           <div style="display: flex; align-items: center; background: rgba(0, 0, 0, 0.85); padding: 10px; border-radius: 5px;">
    <!-- Empty div for centering trick -->
    <div style="flex: 1;"></div>

    <!-- Centered Title -->
    <span style="font-size: 20px; font-weight: bold; color: white; text-align: center;">Scavenger Records</span>

    <!-- Right-aligned controls -->
    <div style="flex: 1; display: flex; justify-content: flex-end; gap: 10px;">
        <label style="color: white; font-size: 14px; display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="script_toggle_scavenge_records" ${isHidden ? "" : "checked"} style="margin-right: 5px;">
            Show
        </label>
        <button id="script_clear_scavenge_history" class="q-btn q-btn-item non-selectable no-outline"
            style="background: rgba(160, 0, 0, 0.5); color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">
            Clear History
        </button>
    </div>
</div>
            <div id="script_scavenge_records" class="zed-grid has-title has-content" style="margin-top: 10px; ${isHidden ? "display: none;" : ""}">
                <div class="grid-cont" style="background: rgba(0, 0, 0, 0.7); padding: 15px; border-radius: 5px; color: white;">
    `;

		let hasData = false;

		for (const mapKey in records) {
			hasData = true;
			const map = records[mapKey];
			const successCount = map.successCount || 0;
			const failCount = map.totalAttempts ? map.totalAttempts - successCount : 0;
			const successRate = (successCount + failCount) > 0 ? ((successCount / (successCount + failCount)) * 100).toFixed(1) + "%" : "0.0%";
			const sortedItems = Object.entries(map.itemRewards || {}).sort((a, b) => b[1] - a[1]);

			htmlContent += `
            <div style="text-align: center; font-weight: bold; margin-top: 10px;">
                ${map.mapName} - ${successCount} Successes | ${failCount} Fails (${successRate})
            </div>
            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <table style="width: 80%; border-collapse: collapse; color: white; text-align: center;">
                    <thead>
                        <tr style="background: rgba(0, 0, 0, 0.8);">
                            <th style="padding: 8px; border: 1px solid #555;">Item</th>
                            <th style="padding: 8px; border: 1px solid #555;">Quantity</th>
                            <th style="padding: 8px; border: 1px solid #555;">Drop Rate</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

			let itemHtml = []; // Store rows separately
			sortedItems.forEach(([itemKey, itemQty]) => {
				const dropRate = successCount > 0 ? ((itemQty / successCount) * 100).toFixed(1) + "%" : "0.0%";
				itemHtml.push(`
                <tr>
                    <td style="padding: 8px; border: 1px solid #555;">${itemKey}</td>
                    <td style="padding: 8px; border: 1px solid #555;">x ${itemQty}</td>
                    <td style="padding: 8px; border: 1px solid #555;">${dropRate}</td>
                </tr>
            `);
			});

			htmlContent += itemHtml.join("") + "</tbody></table></div>";
		}

		if (!hasData) {
			htmlContent += `<div style="text-align: center; font-size: 14px; color: #888;">No data available.</div>`;
		}

		htmlContent += `</div></div>`;

		document.getElementById("script_scavenge_records_container")?.remove();
		insertToElem.insertAdjacentHTML("beforeend", htmlContent);

		// ✅ Toggle Visibility
		document.getElementById("script_toggle_scavenge_records").addEventListener("change", function() {
			const isChecked = this.checked;
			localStorage.setItem("script_scavenge_records_hidden", !isChecked);
			document.getElementById("script_scavenge_records").style.display = isChecked ? "block" : "none";
		});

		// ✅ Clear History
		document.getElementById("script_clear_scavenge_history").addEventListener("click", function() {
			if (confirm("⚠️ Are you sure you want to clear all scavenger records?")) {
				console.log("Scavenger history cleared.");
				localStorage.setItem("script_scavenge_records", JSON.stringify({}));
				addScavengeRecords(); // Refresh UI
			} else {
				console.log("Clear history action canceled.");
			}
		});
	}

	// 🔄 **Refresh scavenger records every 500ms**
	setInterval(addScavengeRecords, 500);



	// HUNTING DURABILITY


	// 🔍 Detect When User Enters Hunting Page
	function observeHuntingPage() {
		let lastUrl = window.location.href;
		const observer = new MutationObserver(() => {
			if (window.location.href !== lastUrl) {
				lastUrl = window.location.href;
				if (window.location.href.match(/\/hunting\/[0-6]/)) {
					checkWeaponDurability();
				}
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	// 🛑 Create Warning Overlay Instantly
	function createWarningOverlay(message) {
		// Remove any existing warning box
		const existingOverlay = document.getElementById("durabilityWarningOverlay");
		if (existingOverlay) existingOverlay.remove();

		// Create overlay
		const overlay = document.createElement("div");
		overlay.id = "durabilityWarningOverlay";
		overlay.style.position = "fixed";
		overlay.style.top = "0";
		overlay.style.left = "0";
		overlay.style.width = "100%";
		overlay.style.height = "100%";
		overlay.style.background = "rgba(0, 0, 0, 0.85)";
		overlay.style.color = "white";
		overlay.style.display = "flex";
		overlay.style.justifyContent = "center";
		overlay.style.alignItems = "center";
		overlay.style.flexDirection = "column";
		overlay.style.zIndex = "99999";
		overlay.style.fontSize = "20px";

		// Warning Box
		const warningBox = document.createElement("div");
		warningBox.style.background = "#222";
		warningBox.style.padding = "20px";
		warningBox.style.border = "2px solid red";
		warningBox.style.borderRadius = "10px";
		warningBox.style.textAlign = "center";

		// Warning Text
		const warningText = document.createElement("p");
		warningText.innerHTML = message;
		warningBox.appendChild(warningText);

		// OK Button
		const okButton = document.createElement("button");
		okButton.innerText = "I Understand";
		okButton.style.padding = "10px 20px";
		okButton.style.marginTop = "10px";
		okButton.style.background = "red";
		okButton.style.color = "white";
		okButton.style.border = "none";
		okButton.style.cursor = "pointer";
		okButton.style.fontSize = "16px";
		okButton.style.borderRadius = "5px";

		// Remove overlay when clicking OK
		okButton.addEventListener("click", () => {
			overlay.remove();
		});

		warningBox.appendChild(okButton);
		overlay.appendChild(warningBox);
		document.body.appendChild(overlay);
	}

	// 🔍 Fetch Equipped Weapon and Check Durability
	async function checkWeaponDurability() {
		try {
			const response = await fetch("https://api.zed.city/loadItems", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				throw new Error(`HTTP Error ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				console.error("API Error:", data.error);
				return;
			}

			// 🎯 Get Equipped Primary Weapon
			const equippedWeapon = data.equip?.primary;

			if (!equippedWeapon || equippedWeapon.name === "Empty" || !equippedWeapon.vars?.condition) {
				console.warn("No valid weapon equipped or condition data missing.");
				return;
			}

			const weaponCondition = parseFloat(equippedWeapon.vars.condition);
			const userThreshold = parseFloat(localStorage.getItem("script_durability_threshold")) || 20;

			// 🛑 INSTANTLY Show Warning Box
			if (weaponCondition < userThreshold) {
				createWarningOverlay(`⚠️ Your <strong>${equippedWeapon.name}</strong> has low durability (<strong>${weaponCondition}%</strong>).<br><br>Your threshold is set to <strong>${userThreshold}%</strong>.<br><br>Consider repairing or switching weapons before hunting.`);
			}
		} catch (error) {
			console.error("Failed to fetch equipped weapon data:", error);
		}
	}

	// 🔄 Ensure Warning Loads Instantly
	document.addEventListener("DOMContentLoaded", () => {
		if (window.location.href.match(/\/hunting\/[0-6]/)) {
			checkWeaponDurability();
		}
	});

	// 🔄 Start Monitoring Hunting Pages
	observeHuntingPage();



	//HUNTING DURABILITY END


	/**
	 * 🎯 Hunting Statistics & Tracking
	 * Combat Status:
	 * 0 - No fight
	 * 1 - Started Job (Got Map)
	 * 2 - Got Fight (Got Monster)
	 * 3 - Completed Fight (Got Loot)
	 */
	const pendingFight = {
		status: 0,
		mapName1: "",
		mapName2: "",
		monsterName: "",
		winner: "",
		lootItems: {}
	};

	/**
	 * Called when a hunting job starts.
	 * Simply parses the job codename to get a map identifier.
	 */
	function handleHuntingStartJob(response) {
		const job = response?.job?.codename;
		if (!job || !job.startsWith("job_hunting_")) return;
		// Simple approach: parse map from codename (e.g. "job_hunting_5_1" → "5")
		let map1 = job.replace("job_hunting_", "").slice(0, -2);
		Object.assign(pendingFight, {
			status: 1,
			mapName1: map1,
			mapName2: response?.job?.name || "",
			monsterName: "",
			winner: "",
			lootItems: {}
		});
	}

	/**
	 * Called when fight data is received.
	 * Sets the monster name from the victim's username.
	 */
	function handleGetFight(r) {
		const resp = JSON.parse(r);
		pendingFight.status = 2;
		pendingFight.monsterName = resp?.victim?.user?.username || "Unknown Monster";
	}

	/**
	 * Called when a fight is completed.
	 * Updates pendingFight with the winner and merges any loot.
	 */
	function handleDoFight(r) {
		const resp = JSON.parse(r);
		if (!resp?.winner) return;
		pendingFight.status = 3;
		pendingFight.winner = String(resp.winner);
		if (resp?.loot) {
			for (const item of resp.loot) {
				pendingFight.lootItems[item.name] = (pendingFight.lootItems[item.name] || 0) + item.quantity;
			}
		}
		saveFight();
	}

	/**
	 * Saves the current pendingFight data into persistent localStorage records,
	 * then resets pendingFight.
	 */
	function saveFight() {
		const records = JSON.parse(localStorage.getItem("script_hunting_records")) || {};
		if (!records[pendingFight.mapName1]) records[pendingFight.mapName1] = {};
		if (!records[pendingFight.mapName1][pendingFight.mapName2]) {
			records[pendingFight.mapName1][pendingFight.mapName2] = {
				wonTimes: 0,
				lostTimes: 0,
				monsters: {}
			};
		}
		const isWin = !pendingFight.winner.startsWith("npc_");
		if (isWin) {
			records[pendingFight.mapName1][pendingFight.mapName2].wonTimes++;
		} else {
			records[pendingFight.mapName1][pendingFight.mapName2].lostTimes++;
		}
		if (!records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName]) {
			records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName] = {
				wonTimes: 0,
				lostTimes: 0,
				itemLoots: {}
			};
		}
		if (isWin) {
			records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].wonTimes++;
		} else {
			records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].lostTimes++;
		}
		Object.entries(pendingFight.lootItems).forEach(([itemName, qty]) => {
			records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].itemLoots[itemName] =
				(records[pendingFight.mapName1][pendingFight.mapName2].monsters[pendingFight.monsterName].itemLoots[itemName] || 0) + qty;
		});
		localStorage.setItem("script_hunting_records", JSON.stringify(records));
		Object.assign(pendingFight, {
			status: 0,
			mapName1: "",
			mapName2: "",
			monsterName: "",
			winner: "",
			lootItems: {}
		});
	}

	/**
	 * Builds and displays the Hunting Records UI on the /hunting page.
	 */
	function addHuntingRecordsToPage() {
		if (!window.location.href.includes("zed.city/hunting")) return;
		const container = document.querySelector(".q-page.q-layout-padding");
		if (!container) return;

		const hidden = localStorage.getItem("script_huntingRecords_hidden") === "true";
		let html = `
    <div id="script_hunting_records_container" style="margin: 20px 0;">
      <div style="display: flex; align-items: center; justify-content: center; position: relative; background: rgba(0,0,0,0.85); padding: 10px; border-radius: 5px;">
        <span style="font-size: 20px; font-weight: bold; color: white;">Hunting Records</span>
        <div style="position: absolute; right: 10px; display: flex; gap: 10px;">
          <label style="color: white; font-size: 14px; display: flex; align-items: center; cursor: pointer;">
            <input type="checkbox" id="script_toggle_hunting_records" ${hidden ? "" : "checked"} style="margin-right: 5px;"> Show
          </label>
          <button id="script_clear_hunting_history" class="q-btn q-btn-item non-selectable no-outline"
                  style="background: rgba(160,0,0,0.5); color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;">
            Clear History
          </button>
        </div>
      </div>
      <div id="script_hunting_records" class="zed-grid has-title has-content" style="margin-top: 10px; ${hidden ? "display: none;" : ""}">
        <div class="grid-cont" style="background: rgba(0,0,0,0.7); padding: 15px; border-radius: 5px; color: white;">
  `;
		const records = JSON.parse(localStorage.getItem("script_hunting_records")) || {};
		let hasData = false;
		Object.keys(records).forEach(map1 => {
			hasData = true;
			html += `<div style="font-size: 16px; font-weight: bold; text-align: center; border-bottom: 2px solid #555; padding: 8px 0; margin-top: 10px;">${map1}</div>`;
			Object.keys(records[map1]).forEach(map2 => {
				const data = records[map1][map2];
				html += `<div style="text-align: center; font-weight: bold; margin-top: 10px; font-size: 14px;">${map2} - ${data.wonTimes} Wins, ${data.lostTimes} Losses</div>`;
				html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 10px; margin-top: 10px;">`;
				Object.entries(data.monsters)
					.sort((a, b) => (b[1].wonTimes + b[1].lostTimes) - (a[1].wonTimes + a[1].lostTimes))
					.forEach(([monster, stats]) => {
						html += `
            <div style="background: rgba(0,0,0,0.85); padding: 10px; border-radius: 5px; text-align: center;">
              <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${monster} (${stats.wonTimes} Kills)</div>
              <div style="display: flex; flex-direction: column; gap: 3px;">`;
						Object.entries(stats.itemLoots)
							.sort((a, b) => b[1] - a[1])
							.forEach(([item, qty]) => {
								const avg = stats.wonTimes > 0 ? (qty / stats.wonTimes).toFixed(2) : "0.00";
								html += `<div style="display: flex; justify-content: space-between; padding: 3px 5px; font-size: 13px;">
                <span>${item}</span>
                <span>x ${qty}</span>
                <span>Avg/Kill: ${avg}</span>
              </div>`;
							});
						html += `</div></div>`;
					});
				html += `</div>`;
			});
		});
		if (!hasData) {
			html += `<div style="text-align: center; font-size: 14px; color: #888;">No data available.</div>`;
		}
		html += `</div></div></div>`;
		const existing = document.getElementById("script_hunting_records_container");
		if (existing) existing.remove();
		container.insertAdjacentHTML("beforeend", html);

		document.getElementById("script_toggle_hunting_records").addEventListener("change", function(e) {
			const show = e.target.checked;
			localStorage.setItem("script_huntingRecords_hidden", !show);
			document.getElementById("script_hunting_records").style.display = show ? "block" : "none";
		});

		document.getElementById("script_clear_hunting_history").addEventListener("click", () => {
			if (confirm("⚠️ Are you sure you want to clear all hunting history?")) {
				localStorage.setItem("script_hunting_records", "{}");
				addHuntingRecordsToPage();
			}
		});
	}
	setInterval(addHuntingRecordsToPage, 500);

	// Ensure the timer container is created
	createTimerContainer();
	// Make it draggable
	makeTimerContainerDraggable();

	/* **END** */
})();