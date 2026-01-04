// ==UserScript==
// @name         F95Zone Thread Watcher & Metrics
// @icon         https://external-content.duckduckgo.com/iu/?u=https://f95zone.to/data/avatars/l/1963/1963870.jpg?1744969685
// @namespace    https://f95zone.to/members/x-death.1963870/
// @homepage     https://greasyfork.org/en/scripts/546563
// @homepageURL  https://greasyfork.org/en/scripts/546563
// @author       X Death on F95zone
// @match        https://f95zone.to/
// @grant        GM.setValue
// @grant        GM.getValues
// @run-at       document-idle
// @version      2.0.0
// @description  Alerts on new threads & user notifications, tracks upload frequency with data metrics, manages ignored prefixes, and adds colorful UI enhancements.
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/546563/F95Zone%20Thread%20Watcher%20%20Metrics.user.js
// @updateURL https://update.greasyfork.org/scripts/546563/F95Zone%20Thread%20Watcher%20%20Metrics.meta.js
// ==/UserScript==


(async () => {
  /** ----------------------------
   *  GLOBAL VARIABLE
   * ---------------------------- */
  const manualRefresh = false;
  const intervalManualRefresh = 60000;
  const debug = false;
  let defaultData = {
    previousData: [],
    newGameLog: [],
    uploadTimestamps: [],
    notification: true,
    configVisibility: true,
    userAlert: false,
    knownPrefixes: [],
    ignoredPrefix: [],
    totalEntries: 100,
    manualCheck: false,
    manualCheckInterval: 1,
  }
  let currentData = {};
  let newDataExist = false;
  let newGameNotif = false;
  let isNotifAllowed = false;
  let firstNotif = true;
  let modalInjected = false;
  let curTotalAlert = 0;
  let isThreadSafe = false;
  let isAlertSafe = false;
  let errorMsg = "";
  let manualCheckTimer = null;
  let threadLostFocus = true;
  let isObserverAlertInit = false;
  let isObserverThreadInit = false;
  /** ----------------------------
   *  Storage
   * ---------------------------- */
  //load datas
  async function loadData() {
    let parsed = {};
    try {
      parsed = (await GM.getValues(Object.keys(defaultData))) ?? {};
    } catch (e) {
      parsed = {};
    }

    return {
      previousData: Array.isArray(parsed.previousData) ? parsed.previousData : [],

      newGameLog: Array.isArray(parsed.newGameLog) ?
        parsed.newGameLog.map(item => {
          if (typeof item === "string") return {
            title: item,
            link: ""
          };
          return {
            title: item.title || "",
            link: item.link || ""
          };
        }) :
        [],

      uploadTimestamps: Array.isArray(parsed.uploadTimestamps) ? parsed.uploadTimestamps : [],
      notification: !!parsed.notification,
      configVisibility: parsed.configVisibility === undefined ? true : !!parsed.configVisibility,
      userAlert: !!parsed.userAlert,
      knownPrefixes: Array.isArray(parsed.knownPrefixes) ? parsed.knownPrefixes : [],
      ignoredPrefix: Array.isArray(parsed.ignoredPrefix) ? parsed.ignoredPrefix : [],
      totalEntries: parsed.totalEntries ?? 100,
      manualCheck: !!parsed.manualCheck,
      manualCheckInterval: parsed.manualCheckInterval ?? 1,
    };
  }

  //save data
  async function saveDatas(data, restart = false) {
    const ops = [];
    for (const [key, value] of Object.entries(data)) {
      ops.push(GM.setValue(key, value));
    }
    await Promise.all(ops);
    if (restart) await reload();
  }

  async function reload() {
    if ((currentData.notification || currentData.userAlert)) {
      isNotifAllowed = await askForPermission();
    }

    return true;
  }

  async function backupData() {
    try {
      const currentData = await loadData();

      const blob = new Blob([JSON.stringify(currentData, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `game-data-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);
      alert("Backup created successfully!");
    } catch (e) {
      console.error("Backup failed", e);
      alert("Failed to create backup");
    }
  }

  function restoreData(data) {
    // Simple validation: check expected keys
    const requiredKeys = [
      "previousData",
      "newGameLog",
      "uploadTimestamps",
      "notification",
      "configVisibility",
      "userAlert",
      "knownPrefixes",
      "ignoredPrefix",
      "totalEntries",
      "manualCheck",
      "manualCheckInterval"
    ];

    const missingKeys = requiredKeys.filter(key => !(key in data));
    if (missingKeys.length) {
      alert("JSON is missing keys: " + missingKeys.join(", "));
      return;
    }

    // Optional: coerce newGameLog entries to { title, link } if needed
    data.newGameLog = data.newGameLog.map(item => {
      if (typeof item === "string") return {
        title: item,
        link: ""
      };
      return {
        title: item.title || "",
        link: item.link || ""
      };
    });

    // Replace currentData and save
    currentData = data;
    saveDatas(currentData);
    renderUI();
    alert("Data restored successfully!");
  }

  /** ----------------------------
   *  UI
   * ---------------------------- */
  function injectButton() {
    const button = document.createElement("button");
    button.textContent = "⛯";
    button.id = "tag-config-button";
    button.addEventListener("click", () => openModal());
    document.body.appendChild(button);
  }

  function injectModal() {
    modalInjected = true;
    const modal = document.createElement("div");
    modal.id = "tag-config-modal";
    Object.assign(modal.style, {
      display: "none",
      position: "fixed",
      zIndex: 9999,
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
    });
    modal.innerHTML = `
		  <div class="modal-content" style="background:#191b1e; max-width:400px; margin:100px auto; border-radius:10px;">
			<h2 style="text-align: center;">MENU</h2>
			<div class="modal-settings-spacing">
			<div id="modal-warning-msg"></div>
			<div class="modal-settings-spacing">
			<details class="config-list-details">
				<summary>New game Lists</summary>
				<div style="padding:10px; color:#ccc; font-size:14px;">
				  <div id="metrics-info" style="line-height:1.6;">
					<div id="new-game-list-container" style="max-height: 300px; overflow-y: auto; padding:5px; border:1px solid #555; background:#2c3032; border-radius:4px;"></div>

					<div id="new-game-info" style="color: #c15858;text-align: center;"></div>

					<div style="padding:10px;display:flex;justify-content:center;">
					  <button class="modal-btn" id="resetNewGameLog" title="Reset previous data" style="margin-right:5px;">Reset new game log</button>
					  <button class="modal-btn" id="check-manually" title="Check manually">Check manually</button>
					</div>
				  </div>
				</div>
			  </details>
			</div>
			<!-- Ignore prefix --!>
			
			<hr class="thick-line" />
			<div class="modal-settings-spacing">
			<details class="config-list-details">
				<summary>Ignore prefix</summary>
				<div style="padding:10px; color:#ccc; font-size:14px;">
				  <div id="metrics-info" style="line-height:1.6;">
					<div id="search-container" style="position: relative; display: inline-block; min-height: 250px; width:100%;">
						<input type="text" id="prefix-search" placeholder="Search prefixes..." autocomplete="off">
						<ul id="search-results">
						</ul>
						<div id="ignored-prefix-list"></div>
					</div>
				  </div>
				</div>
			  </details>
			</div>
			<!-- Metrics --!>
			<hr class="thick-line" />
			<div class="modal-settings-spacing">
			<details class="config-list-details">
				<summary>Upload Statistics</summary>
				<div style="padding:10px; color:#ccc; font-size:14px;">
				  <div id="metrics-info" style="line-height:1.6;">
					<div>Previous Data Count: <span id="metric-prev">0</span>
					</div>
					<div>New Game Log Count: <span id="metric-newgame">0</span>
					</div>
					<div>Upload Timestamps (last 30 days): <span id="metric-upload">0</span>
					</div>
					<pre id="upload-frequency"></pre>
					<div class="config-row">
					  <label for="restore-data">Restore Data</label>
					  <input type="file" id="restore-data" accept=".json">
					</div>
					<div class="modal-btn-section" style="margin-top: 10px;">
					  <button class="modal-btn modal-btn-reset" id="backup-data" title="Backup data">Backup data</button>
					</div>

				  </div>
				</div>
			  </details>
			</div>
			<hr class="thick-line" />
			<!-- General -->
			<div class="modal-settings-spacing">
			<details class="config-list-details">
				<summary>Settigns</summary>
					<div id="config-container">
					  <div id="alert-notif" style="margin-top: 10px;" class="config-row">
						<label for="user-alert" style="width: 160px;">User Alert</label>
						<input type="checkbox" id="user-alert">
					  </div>
					  <div style="margin-top: 10px;" class="config-row">
						<label for="notification" style="width: 160px;">Notification</label>
						<input type="checkbox" id="notification">
					  </div>
					  <div style="margin-top: 10px;" class="config-row">
						<label for="config-visibility" style="width: 160px;">Config Visibility</label>
						<input type="checkbox" id="config-visibility">
					  </div>
					  <div style="margin-top: 10px;" class="config-row">
						<label for="manual-check" style="width: 160px;">manual check</label>
						<input type="checkbox" id="manual-check">
					  </div>
						<div style="margin-top: 10px;" class="config-row">
						  <label for="manual-check-interval" style="width: 160px;">manual check interval(m)</label>
						  <input type="number" id="manual-check-interval" min="1" value="1" step="1" required>
						</div>
					  <div style="margin-top: 10px;" class="config-row">
						  <label for="total-entries" style="width: 160px;">Total Entries</label>
						  <select id="total-entries">
							<option value="20">20</option>
							<option value="40">40</option>
							<option value="60">60</option>
							<option value="80">80</option>
							<option value="100">100</option>
						  </select>
						</div>
					<div style="padding:10px;display:flex;justify-content:center;">
			  <button id="save-config" class="modal-btn" style="margin-right:5px;">⭳ Save</button>
			</div>
				</div>
				</details>
			  
			</div>
			  <hr class="thick-line" />
		<div class="modal-settings-spacing">
			<details class="config-list-details">
				<summary>Resets</summary>
					<div class="modal-btn-section">
					  <button class="modal-btn modal-btn-reset" id="resetPreviousData" title="Reset previous data">Reset Previous Data</button>
					</div>

					<div class="modal-btn-section">
					  <button class="modal-btn modal-btn-reset" id="resetUploadMetrics" title="Refreshes the tag list gathered from Latest Updates page">Reset upload Metrics</button>
					</div>
					<div class="modal-btn-section">
					  <button class="modal-btn modal-btn-reset" id="reset-data" title="Refreshes the tag list gathered from Latest Updates page">Reset data</button>
					</div>
				</details>
			  
			</div>
			  <hr class="thick-line" />
			
			
			<div style="padding:10px;display:flex;justify-content:center;">
			  <button id="close-modal" class="modal-btn">🗙 Close</button>
			</div>
		  </div>
	`;
    document.body.appendChild(modal);
    //event listeners
    setEventById("close-modal", closeModal);
    setEventById("save-config", saveAndClose);
    setEventById("user-alert", updateUserAlert);
    setEventById("notification", updateNotification);
    setEventById("config-visibility", updateConfigVisibility);
    setEventById("resetPreviousData", resetPreviousData);
    setEventById("resetNewGameLog", resetNewGameLog);
    setEventById("resetUploadMetrics", resetUploadMetrics);
    setEventById("reset-data", resetData);
    setEventById("total-entries", updateTotalEntries);
    setEventById("prefix-search", updateSearch, "input");
    setEventById("prefix-search", updateSearchInput, 'focus');
    setEventById("backup-data", backupData);
    setEventById("check-manually", checkManually);
    setEventById("manual-check", updateManualCheck);
    setEventById("manual-check-interval", checkInputManualCheckInterval, "blur");
    setEventById("restore-data", loadJsonBackup, "change");

    //clicking outside
    document.addEventListener('click', (e) => {
      const input = document.getElementById('prefix-search');
      const results = document.getElementById('search-results');
      if (!input.contains(e.target) && !results.contains(e.target)) {
        results.style.display = 'none';
      }
    });
    modal.addEventListener("click", (e) => {
      const content = modal.querySelector(".modal-content");
      if (!content.contains(e.target)) {
        closeModal();
      }
    });
  }

  function applyCustomCSS() {
    const hasStyle =
      document.head.lastElementChild.textContent.includes("#tag-config-button");
    const customCSS = hasStyle ?
      document.head.lastElementChild :
      document.createElement("style");
    customCSS.textContent = `
	#restore-data {
  width: 100%;      /* fill the parent container */
  max-width: 200px; /* optional, limit max size */
  box-sizing: border-box;
}
		#ignored-prefix-list {
			display: flex;
			flex-wrap: wrap;
			gap: 6px;
			margin-top: 8px;
		}

		.ignored-prefix-item {
			display: inline-flex;
			align-items: center;
			padding: 4px 8px;
			background-color: #333;
			color: #fff;
			border-radius: 4px;
			font-size: 14px;
		}

		.ignored-prefix-item span {
			margin-right: 6px;
		}

		.ignored-prefix-remove {
			background-color: #c15858;
			color: #fff;
			border: none;
			border-radius: 4px;
			padding: 0 4px;
			cursor: pointer;
			font-size: 12px;
		}

		.ignored-prefix-remove:hover {
			background-color: #a34040;
		}

		#prefix-search {
			background-color: #222;
			color: #fff;
			border: 1px solid #555;
			border-radius: 4px;
			padding: 6px 8px;
			width:100%;
		}

		#prefix-search:focus {
			outline: none;
			border: 1px solid #c15858;
		}

		/* Search results dropdown */
		#search-results {
			position: absolute;
			left: 0;
			right: 0;
			max-height: 200px;
			overflow-y: auto;
			background-color: #222; /* same as inputs */
			border: 1px solid #555; /* same border as input */
			border-radius: 4px;
			margin: 2px 0 0 0; /* small gap below input */
			padding: 0;
			list-style: none;
			display: none;
			z-index: 1000;
			box-shadow: 0 4px 8px rgba(0,0,0,0.5); /* subtle shadow */
		}

		/* Individual list items */
		#search-results li {
			padding: 6px 8px;
			cursor: pointer;
			color: #fff;
			background-color: #222;
		}

		#search-results li:hover {
			background-color: #333; /* slightly lighter on hover */
		}
			/* All text inputs, textareas, selects */
			#tag-config-modal input,
			#tag-config-modal textarea,
			#tag-config-modal select {
				background-color: #222;
				color: #fff;
				border: 1px solid #555;
				border-radius: 4px;
			}

			#tag-config-modal input:focus,
			#tag-config-modal textarea:focus,
			#tag-config-modal select:focus {
				outline: none;
				border: 1px solid #c15858;
			}

			/* Checkboxes and radios */
			#tag-config-modal input[type="checkbox"],
			#tag-config-modal input[type="radio"] {
				accent-color: #c15858;
				background-color: #222;
				border: 1px solid #555;
			}

			#tag-config-modal .config-color-input {
				border: 2px solid #3f4043;
				border-radius: 5px;
				padding: 2px;
				width: 40px;
				height: 28px;
				cursor: pointer;
				background-color: #181a1d;
			}

			#tag-config-modal .config-color-input::-webkit-color-swatch-wrapper {
				padding: 0;
			}

			#tag-config-modal .config-color-input::-webkit-color-swatch {
				border-radius: 4px;
				border: none;
			}

			.modal-btn {
				background-color: #893839;
				color: white;
				border: 2px solid #893839;
				border-radius: 6px;
				padding: 8px 16px;
				font-weight: 600;
				font-size: 14px;
				cursor: pointer;
				transition: background-color 0.3s ease, border-color 0.3s ease;
				box-shadow: 0 4px 8px rgba(137, 56, 56, 0.5);
			}

			.modal-btn:hover {
				background-color: #b94f4f;
				border-color: #b94f4f;
			}

			.modal-btn:active {
				background-color: #6e2b2b;
				border-color: #6e2b2b;
				box-shadow: none;
			}

			.config-row {
				display: flex;
				gap: 10px;
				margin-bottom: 8px;
			}

			.config-row label {
				flex-shrink: 0;
				width: 140px;
				/* fixed width for all labels */
				text-align: left;
				user-select: none;
			}

			.config-row input[type="checkbox"],
			.config-row input[type="color"],
			.config-row input[type="number"],
			.config-row select {
				flex-grow: 1;
			}

			#tag-config-button {
				position: fixed;
				bottom: 20px;
				right: 20px;
				left: 20px;
				padding: 8px 12px;
				font-size: 20px;
				z-index: 7;
				cursor: pointer;
				border: 2px inset #461616;
				background: #cc3131;
				color: white;
				border-radius: 8px;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
				max-width: 70px;
				width: auto;
				opacity: 0.75;
				transition: opacity 0.2s ease, transform 0.2s ease;

				@media (width < 480px) {
					bottom: 60px;
				}
			}

			/* Hover effect */
			#tag-config-button:hover {
				opacity: 1;
			}

			#tag-config-button:active {
				transform: scale(0.9);
			}

			#tag-config-button.hidden {
				opacity: 0;
				pointer-events: auto;
				transition: opacity 0.3s ease;
			}

			#tag-config-button.hidden:hover {
				opacity: 0.75;
			}

			#tag-config-modal .modal-content {
				background: black;
				border-radius: 10px;
				min-width: 300px;
				max-height: 80vh;
				overflow-y: scroll;
				/* always show vertical scrollbar */
			}

			#tag-config-modal.show {
				display: flex;
			}

			.config-list-details {
				overflow: hidden;
				transition: border-width 1s, max-height 1s ease;
				max-height: 40px;
			}

			.config-list-details[open] {
				border-width: 2px;
				max-height: 1300px;
			}

			.config-list-details summary {
				text-align: center;
				background: #353535;
				border-radius: 8px;
				padding-top: 5px;
				padding-bottom: 5px;
				cursor: pointer;
			}

			.thick-line {
				border: none;
				height: 1px;
				background-color: #3f4043;
			}

			.custom-overlay-reason {
				position: absolute;
				top: 4px;
				left: 4px;
				background: rgba(0, 0, 0, 0.7);
				color: white;
				padding: 2px 6px;
				font-size: 12px;
				border-radius: 4px;
				z-index: 2;
				pointer-events: none;
			}

			.resource-tile_thumb-wrap {
				position: relative;
			}

			.tagItem,
			.config-tag-item {
				border-radius: 8px;
			}

			.config-tag-item {
				margin-left: 5px;
				cursor: pointer;
			}


			#modal-background-save,
			#modal-background-close {
				background: black;
				position: absolute;
				width: 50vw;
				height: 100vh;
				z-index: -1;
				top: 0;
				cursor: pointer;
				opacity: 0.2;
				transition: 0.2s opacity;

				&:hover {
					opacity: 0.5;
				}
			}

			#modal-save-text,
			#modal-close-text {
				position: absolute;
				z-index: -1;
				font-size: 4em;
				color: white;
				font-weight: bolder;
				margin: 0;
				top: 0;
				transition: 0.2s opacity;
				opacity: 1;

				&:hover {
					cursor: pointer;
					opacity: 0.8;
				}
			}

			#modal-save-text {
				left: 5vw;
			}

			#modal-close-text {
				right: 5vw;
			}

			#modal-background-save {
				border-right: 1px solid white;
				left: 0;
			}

			#modal-background-close {
				border-left: 1px solid white;
				right: 0;
			}


			.modal-btn-section {
				text-align: center;
			}

			.modal-btn-reset {
				margin-top: 10px;
			}

			#tag-list {
				list-style: none;
				text-align: center;
				margin: 0;
				display: flex;
				justify-content: start;
				flex-wrap: wrap;
				gap: 5px;
			}

			.modal-list-padding {
				padding: 15px 10px 0 10px;
			}

			.modal-settings-spacing {
				padding: 10px;
			}
`;
    document.head.appendChild(customCSS);
  }
  /** ----------------------------
   *  LISTENERS FUNCTIONS
   * ---------------------------- */

  function updateUserAlert(event) {
    currentData.userAlert = event.target.checked;
  }

  function updateNotification(event) {
    currentData.notification = event.target.checked;
  }

  function updateTotalEntries(event) {
    currentData.totalEntries = event.target.checked;
  }

  function updateConfigVisibility(event) {
    currentData.configVisibility = event.target.checked;
  }

  function resetPreviousData(event) {
    if (confirm("Are you sure you want to reset Previous Data?")) {
      currentData.previousData.length = 0;
      saveDatas(currentData);
      handleNewThreads();
      renderUI();
    }
  }

  function resetNewGameLog(event) {
    if (confirm("Are you sure you want to reset New Game Log?")) {
      currentData.newGameLog.length = 0;
      saveDatas(currentData);
      rewriteLatestUpdate(0);
      renderUI();
    }
  }

  function resetUploadMetrics(event) {
    if (confirm("Are you sure you want to reset Upload Metrics?")) {
      currentData.uploadTimestamps.length = 0;
      saveDatas(currentData);
      handleNewThreads();
      renderUI();
    }
  }

  function resetData(event) {
    if (confirm("⚠️ This will reset ALL data to defaults. Continue?")) {
      currentData = JSON.parse(JSON.stringify(defaultData));
      saveDatas(currentData);
      handleNewThreads();
      renderUI();
    }
  }

  function updateSearch(event) {
    const query = event.target.value.toLowerCase(); // <-- correct
    const filtered = currentData.knownPrefixes.filter(prefix =>
      prefix.toLowerCase().includes(query)
    );
    renderList(filtered);
  }

  function updateSearchInput(event) {
    if (event.target.value === '') renderList(currentData.knownPrefixes);
  }

  function checkManually() {
    const btn = document.querySelector(".brmsConfigBtn.brmsRefresh a.brmsIcoRefresh");
    if (btn) {
      btn.click();
      document.getElementById("new-game-info").innerHTML = "New game checked";
    } else console.warn("Refresh button not found!");
  }


  function checkInputManualCheckInterval(event) {
    const input = event.target;
    let val = parseInt(input.value, 10);

    // If blank, 0, or negative, reset to 1
    if (!val || val < 1) {
      input.value = 1;
      val = 1;
      // Optional visual feedback
      input.style.borderColor = "red";
      setTimeout(() => input.style.borderColor = "", 300);
    }
    currentData.manualCheckInterval = val;
  }

  function updateManualCheck(event) {
    currentData.manualCheck = event.target.checked;
    manualCheckInit();
  }

  async function loadJsonBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      alert("Invalid JSON file.");
      return;
    }

    restoreData(parsed);
  }
  /** ----------------------------
   *  UI CONTROL
   * ---------------------------- */
  function openModal() {
    if (!modalInjected) injectModal();
    document.getElementById("tag-config-modal").style.display = "block";
    renderUI();
    renderMetrics();
  }

  function closeModal() {
    document.getElementById("tag-config-modal").style.display = "none";
  }

  function saveAndClose() {
    updateButtonVisibility();
    saveDatas(currentData);
    reload();
    closeModal();
  }

  function renderUI() {
    ({
      isThreadSafe,
      isAlertSafe
    } = safetyCheck());
    if (!isThreadSafe || !isAlertSafe) {
      updateErrorMsg();
    }
    const restoreInput = document.getElementById("restore-data");
    if (restoreInput) restoreInput.value = "";

    const userAlertEl = document.getElementById("user-alert");
    if (userAlertEl) userAlertEl.checked = !!currentData.userAlert;

    const newGameInfoEl = document.getElementById("new-game-info");
    if (newGameInfoEl) newGameInfoEl.innerHTML = "";

    const notificationEl = document.getElementById("notification");
    if (notificationEl) notificationEl.checked = !!currentData.notification;

    const configVisibilityEl = document.getElementById("config-visibility");
    if (configVisibilityEl) configVisibilityEl.checked = !!currentData.configVisibility;

    const manualCheckEl = document.getElementById("manual-check");
    if (manualCheckEl) manualCheckEl.checked = !!currentData.manualCheck;

    const manualCheckIntervalEl = document.getElementById("manual-check-interval");
    if (manualCheckIntervalEl) manualCheckIntervalEl.value = parseInt(currentData.manualCheckInterval) || 1;

    renderNewGameLog();

    renderIgnoredPrefixes();

    const warningMsgEl = document.getElementById("modal-warning-msg");
    if (warningMsgEl) warningMsgEl.innerHTML = errorMsg || "";
  }

  function renderNewGameLog(containerId = "new-game-list-container") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // clear first

    const games = currentData.newGameLog;
    if (!games || games.length === 0) {
      container.textContent = "No new game yet";
      return;
    }

    games.forEach((item, index) => {
      const title = item.title || "Untitled";

      // Create container div for each game
      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "space-between";
      wrapper.style.marginBottom = "3px";

      // Game title as link
      if (item.link) {
        const linkEl = document.createElement("a");
        linkEl.href = item.link;
        linkEl.target = "_blank";
        linkEl.rel = "noopener noreferrer";
        linkEl.textContent = title;
        wrapper.appendChild(linkEl);
      } else {
        const textEl = document.createTextNode(title);
        wrapper.appendChild(textEl);
      }

      // Remove/X button
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "✖";
      removeBtn.style.marginLeft = "8px";
      removeBtn.style.cursor = "pointer";
      removeBtn.title = "Remove this game from the list";
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        renderUI;
        currentData.newGameLog.splice(index, 1);
        saveDatas(currentData);
        renderNewGameLog(containerId); // re-render to update UI
      });

      wrapper.appendChild(removeBtn);
      container.appendChild(wrapper);
    });
  }



  function renderMetrics() {
    document.getElementById("upload-frequency").innerHTML = analyzeUploadFrequencies().replace(/\n/g, "<br>");

    document.getElementById("metric-prev").textContent = currentData.previousData.length;
    document.getElementById("metric-newgame").textContent = currentData.newGameLog.length;
    document.getElementById("total-entries").value = currentData.totalEntries;

    // only count timestamps from the last 30 days
    const cutoff = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    const recentUploads = currentData.uploadTimestamps.filter(ts => ts >= cutoff);
    document.getElementById("metric-upload").textContent = recentUploads.length;
  }
  /** ----------------------------
   *  utility
   * ---------------------------- */
  function renderIgnoredPrefixes() {
    const container = document.getElementById('ignored-prefix-list');
    if (!container) return;

    container.innerHTML = ''; // clear previous

    currentData.ignoredPrefix.forEach((prefix, index) => {
      const item = document.createElement('div');
      item.classList.add('ignored-prefix-item');

      const text = document.createElement('span');
      text.textContent = prefix;

      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.classList.add('ignored-prefix-remove');
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        currentData.ignoredPrefix.splice(index, 1);
        saveDatas(currentData);
        renderIgnoredPrefixes(currentData);
      });

      item.appendChild(text);
      item.appendChild(removeBtn);
      container.appendChild(item);
    });
  }

  function manualCheckInit() {
    // Clear any existing timer
    if (manualCheckTimer) clearInterval(manualCheckTimer);

    // Only start if manualCheck is enabled
    if (!currentData.manualCheck) return;

    const intervalMs = Math.max(1, parseInt(currentData.manualCheckInterval)) * 60 * 1000; // convert minutes to ms
    console.log(intervalMs);
    manualCheckTimer = setInterval(() => {
      ({
        isThreadSafe,
        isAlertSafe
      } = safetyCheck());

      if (isThreadSafe) {
        console.warn("Thread observer cannot run: thread container not ready or inaccessible.");
        return;
      }

      // Or simulate a click on the refresh button
      const refreshBtn = document.querySelector(".brmsConfigBtn.brmsRefresh a.brmsIcoRefresh");
      if (refreshBtn) refreshBtn.click();
      // You can trigger the thread observer manually
      const container = document.querySelector('.brmsTabContent_2 ol.brmsContentList');
      if (container) {
        handleNewThreads();
      }
    }, intervalMs);
    console.log("Manual check initiated");
  }

  // Helper to render the filtered list
  function renderList(filtered) {
    const input = document.getElementById('prefix-search');
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    // remove already ignored items
    const visibleItems = filtered.filter(item => !currentData.ignoredPrefix.includes(item));

    if (visibleItems.length === 0) {
      results.style.display = 'none';
      return;
    }

    visibleItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.classList.add('search-result-item');
      li.addEventListener('click', () => {
        // Add to ignored list if not already present
        currentData.ignoredPrefix.push(item);
        renderIgnoredPrefixes();
        saveDatas(currentData);

        // Reset input and hide results
        input.value = '';
        results.style.display = 'none';
      });
      results.appendChild(li);
    });

    results.style.display = 'block';
  }

  function updateButtonVisibility() {
    const button = document.getElementById("tag-config-button");
    if (!button) return;

    if (currentData.configVisibility === false) {

      // Blink 3 times
      let blinkCount = 0;
      const maxBlinks = 3;
      const blinkInterval = 400; // ms

      if (button.blinkIntervalId) {
        clearInterval(button.blinkIntervalId);
      }
      button.classList.add("hidden");

      button.blinkIntervalId = setInterval(() => {
        button.classList.toggle("hidden");

        blinkCount++;
        if (blinkCount >= maxBlinks * 2) {
          clearInterval(button.blinkIntervalId);
          button.classList.add("hidden");
          button.blinkIntervalId = undefined;
        }
      }, blinkInterval);
    } else {
      // Show button normally
      if (button.blinkIntervalId) {
        clearInterval(button.blinkIntervalId);
        button.blinkIntervalId = undefined;
      }
      button.classList.remove("hidden");
    }
  }
  //Alert
  function checkAlert() {
    const alertLink = document.querySelector('.p-navgroup-link--alerts');
    const badgeValue = alertLink.getAttribute('data-badge');

    return badgeValue;
  }
  /** ----------------------------
   *  analyze upload pattern
   * ---------------------------- */
  function filterRecentTimestamps(timestamps, days = 30) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    return timestamps.filter(ts => ts * 1000 >= cutoffTime);
  }

  function countUploads(timestamps) {
    const hourCounter = Array(24).fill(0);
    const dailyCounter = {};
    const activeDays = new Set();

    for (const ts of timestamps) {
      const dt = new Date(ts * 1000);
      const dateStr = dt.toISOString().split("T")[0];

      hourCounter[dt.getHours()]++;
      dailyCounter[dateStr] = (dailyCounter[dateStr] || 0) + 1;
      activeDays.add(dateStr);
    }

    return {
      hourCounter,
      dailyCounter,
      activeDays
    };
  }

  function getExtremeDays(dailyCounter) {
    const sortedDates = Object.keys(dailyCounter).sort();
    if (sortedDates.length <= 2) return {
      highest: null,
      lowest: null
    };

    const filtered = Object.fromEntries(
      Object.entries(dailyCounter).filter(([date]) => date !== sortedDates[0] && date !== sortedDates[sortedDates.length - 1])
    );

    const [highestDate, highest] = Object.entries(filtered).reduce((a, b) => b[1] > a[1] ? b : a);
    const [lowestDate, lowest] = Object.entries(filtered).reduce((a, b) => b[1] < a[1] ? b : a);

    return {
      highestDate,
      highest,
      lowestDate,
      lowest
    };
  }

  function calculateDailyAverage(totalUploads, activeDays) {
    const totalDays = activeDays.size > 1 ? activeDays.size - 1 : 1;
    return totalUploads / totalDays;
  }

  function calculateDailyAverage(totalUploads, activeDays) {
    const totalDays = activeDays.size > 1 ? activeDays.size - 1 : 1;
    return totalUploads / totalDays;
  }

  function calculateCurrentHourProbability(hourCounter) {
    if (!hourCounter || hourCounter.length !== 24) return 0;

    const totalUploads = hourCounter.reduce((sum, count) => sum + count, 0);
    if (totalUploads === 0) return 0;

    const currentHour = new Date().getHours();
    const uploadsThisHour = hourCounter[currentHour];

    return uploadsThisHour / totalUploads;
  }


  function analyzeUploadFrequencies() {
    const recentTimestamps = filterRecentTimestamps(currentData.uploadTimestamps);

    const {
      hourCounter,
      dailyCounter,
      activeDays
    } = countUploads(recentTimestamps);

    const todayDateStr = new Date().toISOString().split("T")[0];
    const uploadsToday = dailyCounter[todayDateStr] || 0;

    const {
      highestDate,
      highest,
      lowestDate,
      lowest
    } = getExtremeDays(dailyCounter);
    const dailyAverage = calculateDailyAverage(recentTimestamps.length, activeDays);

    const probability = calculateCurrentHourProbability(hourCounter);

    const result = [];
    result.push("Upload frequency (last 30 days):");
    result.push(`<div style="margin:0;">${makeSparklineTable(hourCounter)}</div>`);
    result.push(makeLegend());

    result.push(`\nDaily average: ${dailyAverage.toFixed(2)} uploads`);
    result.push(`Today's uploads so far: ${uploadsToday}`);
    result.push(`Probability of upload this hour: ${(probability * 100).toFixed(2)}%`);

    if (uploadsToday < dailyAverage) {
      const remainingEstimate = dailyAverage - uploadsToday;
      result.push(`Estimated remaining uploads : ~${remainingEstimate.toFixed(2)}`);
    } else {
      result.push("Today's upload is above expected.");
    }

    if (highestDate) result.push(`📈 Highest total upload: ${highestDate} (${highest})`);
    if (lowestDate) result.push(`📉 Lowest total upload: ${lowestDate} (${lowest})`);

    return result.join("\n");
  }

  function makeSparklineTable(hourCounter) {
    const blocks = "▁▂▃▅▆▇▉█";
    const max = Math.max(...hourCounter, 1);

    const sparklineCells = hourCounter.map((val, hour) => {
      const level = Math.floor((val / max) * (blocks.length - 1));
      const shade = Math.round((level / (blocks.length - 1)) * 100);
      const color = `hsl(0, 60%, ${40 + shade * 0.4}%)`;
      const tooltip = `${hour.toString().padStart(2,"0")}:00 — ${val} uploads`;
      return `<td style="text-align:center;padding:0;margin:0;"><span style="color:${color}" title="${tooltip}">${blocks[level]}</span></td>`;
    }).join("");

    const labelCells = hourCounter.map((_, hour) => {
      if ([0, 6, 12, 18, 23].includes(hour))
        return `<td style="text-align:center;padding:0;margin:0;">${hour}</td>`;
      return `<td style="text-align:center;padding:0;margin:0;">·</td>`;
    }).join("");

    // use template literals for readability, then remove newlines before returning
    const html = `
    <table cellspacing="0" cellpadding="0" style="border-collapse: collapse; font-family: monospace; text-align:center;">
      <tr>${sparklineCells}</tr>
      <tr>${labelCells}</tr>
    </table>
  `;

    return html.replace(/\n\s*/g, ""); // remove all newlines and leading spaces
  }


  function makeLegend() {
    const levels = ["▁", "▃", "▅", "█"];
    const legend = levels.map((block, i) => {
      const shade = Math.round((i / (levels.length - 1)) * 100);
      const color = `hsl(0, 60%, ${40 + shade * 0.4}%)`; // same red gradient style
      return `<span style="color:${color}">${block}</span>`;
    }).join(" ");

    return `Legend: ${legend} (low → high)<br>Hover to see the details.`;
  }

  // Ask the user for notification permission if not already granted
  async function askForPermission() {
    if (Notification.permission === "granted") {
      return true;
    }
    if (Notification.permission === "denied") {
      return false;
    }
    // Ask for permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      return true;
    } else {
      console.log("Notification permission denied.");
      return false;
    }
  }
  // Fire a notification based on how many new games are in currentData.newGameLog
  function fireUpNotif(title, body, icon = "") {
    const notif = new Notification(title, {
      body: body,
      icon: icon // optional icon
    });
    setTimeout(() => notif.close(), 5000);
  }

  function showNewGameAlert() {
    const count = currentData.newGameLog.length;
    if (count > 0) {
      fireUpNotif("New Game Alert 🎮", `You have ${count} not read new game(s).`, icon = "");
      rewriteLatestUpdate(count);
    }
  }

  function showNewAlert() {
    const newAlertTotal = checkAlert();
    if (newAlertTotal > curTotalAlert) {
      curTotalAlert = newAlertTotal;
      fireUpNotif("Account alert ", `You have ${curTotalAlert} not read notification(s).`, icon = "")
    } else {
      curTotalAlert = newAlertTotal;
    }
  }

  function rewriteLatestUpdate(total) {
    document.querySelector('a[data-nav-id="LatestUpdates"]').innerHTML = `Latest Updates (${total})`
  }

  function cleanNotif() {
    currentData.newGameLog.length = 0;
    saveDatas(currentData);
  }

  function setEventById(idSelector, callback, eventType = "click") {
    document.getElementById(idSelector).addEventListener(eventType, callback);
  }

  function hijackLatestUpdate() {
    const latestLink = document.querySelector('a[data-nav-id="LatestUpdates"]');
    if (!latestLink) return;

    latestLink.addEventListener('click', function(e) {
      e.preventDefault();
      cleanNotif();
      rewriteLatestUpdate(0);
      window.open(this.href, '_blank');
    });
  }

  function getCurrentDate() {
    const now = Math.floor(Date.now() / 1000);
    const result = now - (30 * 24 * 60 * 60);
    return result;
  }
  /** ----------------------------
   *  MAIN FUNCTIONS
   * ---------------------------- */
  function checkPrefix(prefixes) {
    let isNewPrefix = false;
    prefixes.forEach(prefix => {
      const exists = currentData.knownPrefixes.some(
        known => known.toLowerCase() === prefix.toLowerCase()
      );
      if (!exists) {
        currentData.knownPrefixes.push(prefix);
        isNewPrefix = true;
      }
    });
    isNewPrefix && saveDatas(currentData);
  }

  function getNewData() {
    const items = document.querySelectorAll('.brmsTabContent_2 li.itemThread');
    const threadData = [];

    items.forEach(li => {
      // Grab the main thread link
      const a = li.querySelector('.listBlock.itemTitle a[href*="/threads/"]');
      if (!a) return;

      const spansText = Array.from(a.querySelectorAll("span"))
        .map(el => el.textContent.trim())
        .filter(p => p.length > 0);

      checkPrefix(spansText);

      if (currentData.ignoredPrefix.some(tag =>
          spansText.some(span => span.toLowerCase() === tag.toLowerCase())
        )) return;

      const idMatch = a.href.match(/\.([0-9]+)(\/|$)/);
      if (!idMatch) return;
      const threadId = idMatch[1];

      const title = Array.from(a.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE)
        .map(node => node.textContent.trim())
        .filter(text => text.length > 0)
        .join(" ");

      // Grab the timestamp element
      const timeEl = li.querySelector('.listBlock.itemDetail.itemDetailDate time.u-dt');
      let timestamp = null;
      if (timeEl) {
        timestamp = Math.floor(new Date(timeEl.getAttribute('datetime')).getTime() / 1000);
      }

      threadData.push({
        id: threadId,
        title,
        link: a.href, // <<< store the original link here
        timestamp
      });
    });

    threadData.sort((a, b) => a.timestamp - b.timestamp);
    debug && console.log(threadData);

    return threadData;
  }


  // ---- THREAD OBSERVER ----
  function startThreadObserver() {

    const container = document.querySelector('.brmsTabContent_2 ol.brmsContentList');
    if (!container) {
      setTimeout(startThreadObserver, 300);
      return;
    }

    console.log("thread observer initiated");

    // Check existing nodes on first run
    if (container.querySelector('li.itemThread')) {
      handleNewThreads();
    }

    const observer = new MutationObserver((mutationsList) => {
      ({
        isThreadSafe,
        isAlertSafe
      } = safetyCheck());

      if (!isThreadSafe) {
        console.warn("Thread observer cannot run: thread container not ready or inaccessible.");
        return;
      }
      let newThreadsDetected = false;

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1 && node.matches('li.itemThread')) {
              newThreadsDetected = true;
              break;
            }
          }
        }
      }

      if (newThreadsDetected) {
        handleNewThreads();
      }
    });

    // Watch direct children + subtree (in case threads get wrapped inside another element)
    observer.observe(container, {
      childList: true,
      subtree: true
    });

  }


  // ---- ALERT OBSERVER ----
  function startAlertObserver() {
    const alertLink = document.querySelector('.p-navgroup-link--alerts');
    if (!alertLink) return;

    const observer = new MutationObserver(() => {
      ({
        isThreadSafe,
        isAlertSafe
      } = safetyCheck());

      if (isAlertSafe) {
        console.warn("Thread observer cannot run: thread container not ready or inaccessible.");
        return;
      }
      currentData.userAlert && showNewAlert();
    });

    observer.observe(alertLink, {
      attributes: true,
      attributeFilter: ['data-badge']
    });
  }

  function handleNewThreads() {
    const items = document.querySelectorAll('.brmsTabContent_2 li.itemThread');
    const newDatas = getNewData();
    checkData(newDatas);
  }

  let gettingData = false;

  function checkData(data) {
    if (gettingData) return;
    gettingData = true;

    const cutoff = getCurrentDate();

    data.forEach(item => {
      const {
        id,
        title,
        link,
        timestamp
      } = item;

      // Skip if timestamp too old
      if (!timestamp || timestamp < cutoff) return;

      // Skip if ID already exists
      if (currentData.previousData.includes(id)) return;

      newDataExist = true;
      newGameNotif = true;

      // Enforce max entries
      if (currentData.previousData.length >= currentData.totalEntries) {
        currentData.previousData.shift(); // drop oldest id
        currentData.newGameLog.shift(); // drop oldest {title, link}
        currentData.uploadTimestamps.shift(); // drop oldest timestamp
      }

      // Add new entry
      currentData.previousData.push(id);
      currentData.newGameLog.push({
        title,
        link
      }); // store as object
      currentData.uploadTimestamps.push(timestamp);
    });

    // Clean up old timestamps
    while (currentData.uploadTimestamps.length > 0 && currentData.uploadTimestamps[0] < cutoff) {
      currentData.previousData.shift();
      currentData.newGameLog.shift();
      currentData.uploadTimestamps.shift();
    }

    debug && console.log(currentData);

    if (newDataExist) {
      newDataExist = false;
      saveDatas(currentData);
    }

    if (currentData.notification && (newGameNotif || firstNotif)) {
      firstNotif = false;
      newGameNotif = false;
      isNotifAllowed && showNewGameAlert();
    }

    gettingData = false;
  }

  //safety
  function safetyCheck() {
    // Thread tab <li> must exist and have 'current' class
    const threadTabLi = document.querySelector('li.brmlShow[data-tabid="2"], li.brmlShow.current');

    // Optional: you can make the selector more precise if needed
    const threadTab = document.querySelector('[data-tabid="2"]');

    // Thread entry must exist
    const threadEntry = document.querySelector(`.brmsNumberEntry[data-limit="${currentData.totalEntries}"]`);

    // Alert tab
    const alertTab = document.querySelector('.p-navgroup-link--alerts');
    if (threadTabLi && threadEntry) threadLostFocus = !threadTabLi.classList.contains('current');
    // Thread safe if both the tab is visible/current and the entry exists
    const isThreadSafe = !!(threadTabLi && threadEntry && threadTabLi.classList.contains('current'));

    return {
      isThreadSafe,
      isAlertSafe: !!alertTab
    };
  }

  //init script
  function waitForBody(callback) {
    if (document.body) {
      callback();
    } else {
      requestAnimationFrame(() => waitForBody(callback));
    }
  }

  function updateErrorMsg() {
    errorMsg = ""; // reset each call

    const notifBlocked = !isNotifAllowed && (currentData.notification || currentData.userAlert);
    const threadObserverFailed = !isObserverThreadInit;
    const alertObserverFailed = !isObserverAlertInit;
    const threadNotFocused = threadLostFocus;
    const threadUnsafe = !isThreadSafe;
    const alertUnsafe = !isAlertSafe;

    if (notifBlocked || threadObserverFailed || alertObserverFailed || threadNotFocused || threadUnsafe || alertUnsafe) {
      errorMsg = `<div style="border:1px solid #c15858; background:#ffe5e5; padding:10px; border-radius:5px; color:#a94442; font-weight:bold;">
                  ⚠️ <span style="text-decoration:underline;">Detected issues:</span>
                  <ul style="margin:5px 0 0 20px; padding:0; font-weight:normal; color:#5a2121;">
    `;

      if (notifBlocked) {
        errorMsg += `<li>Notifications are blocked. Alerts will not be shown.</li>`;
      }

      if (threadObserverFailed) {
        errorMsg += `<li>Thread observer failed to initialize. You will not receive thread updates.</li>`;
      }

      if (alertObserverFailed) {
        errorMsg += `<li>Alert observer failed to initialize. You will not receive alerts.</li>`;
      }

      if (threadNotFocused) {
        errorMsg += `<li>Thread tab is not focused. Refresh the page or click on 'Latest Updates' below the site feedback menu.</li>`;
      }

      errorMsg += `</ul>
                 <div style="margin-top:5px;">Try logging in and refreshing the page.</div>
               </div>`;
    }
  }



  waitForBody(async () => {
    const threadTab = document.querySelector('[data-tabid="2"]');
    if (threadTab) threadTab.click();
    currentData = await loadData();
    ({
      isThreadSafe,
      isAlertSafe
    } = safetyCheck());

    if (isThreadSafe) {
      isObserverAlertInit = true;
      const entry = document.querySelector(`.brmsNumberEntry[data-limit="${currentData.totalEntries}"]`);
      if (entry) {
        entry.dispatchEvent(new MouseEvent("click", {
          bubbles: true
        }));
        entry.blur();
        const menu = entry.closest('.brmsLimitList')?.querySelector('.brmsDropdownMenu');
        if (menu) menu.style.display = 'none';
        document.body.focus();
      }
      startThreadObserver();
      manualCheckInit();
    }


    await reload();
    injectButton();
    applyCustomCSS();
    hijackLatestUpdate();
    updateButtonVisibility();

    if (isAlertSafe) {
      isObserverThreadInit = true;
      console.log("alert observer initiated");
      startAlertObserver();
    }

    updateErrorMsg();
  });

})();