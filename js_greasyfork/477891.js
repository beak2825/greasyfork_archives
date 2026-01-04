// ==UserScript==
// @name         Better AutomationAnywhere
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  Enhanced Automation Anywhere developer experience. Working at CR Version 38.0.0
// @author       jamir-boop
// @match        *://*.automationanywhere.digital/*
// @icon         https://cmpc-1dev.my.automationanywhere.digital/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477891/Better%20AutomationAnywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/477891/Better%20AutomationAnywhere.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// =========================
	// Section: State & Constants
	// =========================

	/** @type {number} Tracks the active (highlighted) prediction in the command palette */
	let activePredictionIndex = -1;

	/** @type {Object[]} Stores current predictions' actions for keyboard navigation */
	let currentPredictionActions = [];

	let initialized = false;
	let updateActiveButtonIntervalId = null;

	// =========================
	// Section: Utility Functions
	// =========================

	/**
	 * Waits for a DOM element to appear, then resolves.
	 * @param {string} selector - CSS selector for the element.
	 * @param {number} timeout - Max wait time in ms.
	 * @returns {Promise<Element|null>}
	 */
	function waitForElement(selector, timeout = 5000) {
		return new Promise((resolve) => {
			const el = document.querySelector(selector);
			if (el) return resolve(el);

			const observer = new MutationObserver(() => {
				const found = document.querySelector(selector);
				if (found) {
					observer.disconnect();
					resolve(found);
				}
			});

			observer.observe(document.body, { childList: true, subtree: true });

			setTimeout(() => {
				observer.disconnect();
				resolve(null);
			}, timeout);
		});
	}

	/**
	 * Sleep for a given number of milliseconds.
	 * @param {number} ms
	 * @returns {Promise<void>}
	 */
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Safely query a DOM element and log a warning if not found.
	 * @param {string} selector
	 * @param {string} [context]
	 * @returns {Element|null}
	 */
	function safeQuery(selector, context = "") {
		const el = document.querySelector(selector);
		if (!el) {
			console.warn(`Element not found: ${selector}${context ? " (" + context + ")" : ""}`);
		}
		return el;
	}

	/**
	 * Adds a click event listener to an element if it exists.
	 * @param {Element|null} el
	 * @param {Function} handler
	 */
	function safeAddClick(el, handler) {
		if (el) el.addEventListener("click", handler);
	}

	// =========================
	// Section: Command Definitions
	// =========================

	/** @type {Object.<string, {action: Function, aliases: string[], description: string}>} */
	const commandsWithAliases = {
		addVariable: {
			action: addVariable,
			aliases: ["adv", "addvar", "add variable"],
			description: "Shows dialog to create a new variable",
		},
		showVariables: {
			action: showVariables,
			aliases: ["v", "showvars", "list variables", "variables"],
			description: "Shows variables in sidebar",
		},
		deleteUnusedVariables: {
			action: deleteUnusedVariables,
			aliases: ["duv", "delete unused", "remove unused variables"],
			description: "Shows dialog to select and delete unused variables",
		},
		redirectToPrivateRepository: {
			action: redirectToPrivateRepository,
			aliases: ["p", "private", "private bots"],
			description: "Redirects to the private bots folder",
		},
		redirectToPublicRepository: {
			action: redirectToPublicRepository,
			aliases: ["pub", "public", "public bots"],
			description: "Redirects to the public bots folder",
		},
		redirectToActivityHistorical: {
			action: redirectToActivityHistorical,
			aliases: ["historical", "history", "activity historical"],
			description: "Redirects to the activities historical tab",
		},
		redirectToInProgress: {
			action: redirectToInProgress,
			aliases: ["inprogress", "progress", "in progress"],
			description: "Redirects to the in-progress activities tab",
		},
		redirectToAuditLog: {
			action: redirectToAuditLog,
			aliases: ["audit", "audit log"],
			description: "Redirects to the activities historical tab",
		},
		redirectToAdminUsers: {
			action: redirectToAdminUsers,
			aliases: ["users", "admin users", "manage users"],
			description: "Redirects to the admin users page",
		},
		redirectToAdminRoles: {
			action: redirectToAdminRoles,
			aliases: ["roles", "admin roles", "manage roles"],
			description: "Redirects to the admin roles page",
		},
		redirectToAdminDevices: {
			action: redirectToAdminDevices,
			aliases: ["devices", "admin devices", "manage devices"],
			description: "Redirects to the admin devices page",
		},
		redirectToHome: {
			action: redirectToHome,
			aliases: ["home", "dashboard", "overview"],
			description: "Redirects to the dashboard home overview",
		},
		showHelp: {
			action: showHelp,
			aliases: ["help", "man", "show help"],
			description: "Displays help information for available commands",
		},
		universalCopy: {
			action: universalCopyCommandPalette,
			aliases: ["universal copy", "copy universal", "rocket copy"],
			description: "Copy actions between control rooms.",
		},
		universalPaste: {
			action: universalPasteCommandPalette,
			aliases: ["universal paste", "paste universal", "rocket paste"],
			description: "Paste actions between control rooms.",
		},
		exportActionToClipboard: {
			action: exportActionToClipboard,
			aliases: ["export action", "copy action json", "export copied action", "share action"],
			description: "Export the currently copied action as JSON to your clipboard.",
		},
		importActionFromJson: {
			action: importActionFromJson,
			aliases: ["import action", "paste action json", "import shared action", "load action json"],
			description: "Import an action from JSON and paste it as if copied locally.",
		},
	};

	// =========================
	// Section: Command Palette
	// =========================

	/**
	 * Returns the command palette element.
	 * @returns {HTMLElement|null}
	 */
	function getCommandPalette() {
		return document.getElementById("commandPalette");
	}

	/**
	 * Returns the command input element.
	 * @returns {HTMLInputElement|null}
	 */
	function getCommandInput() {
		return document.getElementById("commandInput");
	}

	/**
	 * Returns the command predictions container.
	 * @returns {HTMLElement|null}
	 */
	function getCommandPredictions() {
		return document.getElementById("commandPredictions");
	}

	/**
	 * Toggles the command palette visibility.
	 */
	function togglePaletteVisibility() {
		const commandPalette = getCommandPalette();
		if (!commandPalette) return;
		const input = getCommandInput();
		if (commandPalette.classList.contains("command_palette--visible")) {
			commandPalette.classList.remove("command_palette--visible");
			commandPalette.classList.add("command_palette--hidden");
			if (input) {
				input.value = "";
				input.blur();
			}
			clearPredictions();
			activePredictionIndex = -1;
		} else {
			commandPalette.classList.remove("command_palette--hidden");
			commandPalette.classList.add("command_palette--visible");
			if (input) {
				input.focus();
			}
		}
	}

	/**
	 * Clears command predictions.
	 */
	function clearPredictions() {
		const predictions = getCommandPredictions();
		if (predictions) predictions.innerHTML = "";
	}

	/**
	 * Updates command predictions based on input.
	 * @param {string} input
	 */
	function updatePredictions(input) {
		clearPredictions();
		if (!input) {
			activePredictionIndex = -1;
			return;
		}

		// Check for ":<number>" syntax to scroll to a line
		const jumpToLineMatch = input.match(/^:(\d+)$/);
		if (jumpToLineMatch) {
			const lineNumber = parseInt(jumpToLineMatch[1], 10);
			const predictionItem = document.createElement("div");
			predictionItem.classList.add("command_prediction-item");
			predictionItem.innerHTML = `<strong>Go to line ${lineNumber}</strong>`;
			safeAddClick(predictionItem, () => {
				scrollToLineNumber(lineNumber);
				clearPredictions();
				togglePaletteVisibility();
			});
			getCommandPredictions().appendChild(predictionItem);
			return;
		}

		Object.entries(commandsWithAliases).forEach(
			([, { action, aliases, description }]) => {
				const match = aliases.find((alias) =>
					alias.startsWith(input.toLowerCase())
				);
				if (match) {
					const predictionItem = document.createElement("div");
					predictionItem.classList.add("command_prediction-item");
					predictionItem.innerHTML = `<strong>${match}</strong> - ${description}`;
					safeAddClick(predictionItem, () => {
						const inputEl = getCommandInput();
						if (inputEl) inputEl.value = match;
						executeCommand(action);
						clearPredictions();
					});
					getCommandPredictions().appendChild(predictionItem);
				}
			}
		);

		// Always select the first prediction if any
		const predictionsContainer = getCommandPredictions();
		const items = predictionsContainer ? predictionsContainer.getElementsByClassName("command_prediction-item") : [];
		if (items.length > 0) {
			activePredictionIndex = 0;
			updateActivePrediction(items);
		} else {
			activePredictionIndex = -1;
		}
	}

	/**
	 * Sets up event listeners for the command input.
	 */
	function setupCommandInputEventListeners() {
		const commandInput = getCommandInput();
		if (!commandInput) return;

		commandInput.addEventListener("input", function () {
			updatePredictions(this.value);
		});

		commandInput.addEventListener("keydown", navigatePredictions);
	}

	/**
	 * Executes a command action.
	 * @param {Function} action
	 */
	function executeCommand(action) {
		if (action) {
			action();
		} else {
			showHelp();
		}
		togglePaletteVisibility();
	}

	/**
	 * Handles keyboard navigation in the command palette.
	 * @param {KeyboardEvent} e
	 */
	function navigatePredictions(e) {
		const commandPredictions = getCommandPredictions();
		if (!commandPredictions) return;
		const items = commandPredictions.getElementsByClassName("command_prediction-item");
		if (!items.length) {
			if (e.key === "Escape") {
				togglePaletteVisibility();
				e.preventDefault();
			}
			return;
		}

		if (items.length === 1 && e.key === "Enter") {
			items[0].click();
			e.preventDefault();
			return;
		}

		if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
			e.preventDefault();
			if (e.key === "ArrowDown") {
				activePredictionIndex = (activePredictionIndex + 1) % items.length;
				updateActivePrediction(items);
			} else if (e.key === "ArrowUp") {
				activePredictionIndex = activePredictionIndex <= 0 ? items.length - 1 : activePredictionIndex - 1;
				updateActivePrediction(items);
			} else if (e.key === "Enter" && activePredictionIndex >= 0) {
				items[activePredictionIndex].click();
			}
		} else if (e.key === "Escape") {
			togglePaletteVisibility();
			e.preventDefault();
		}
	}

	/**
	 * Updates the active prediction item in the command palette.
	 * @param {HTMLCollectionOf<Element>} items
	 */
	function updateActivePrediction(items) {
		Array.from(items).forEach((item, index) => {
			item.classList.toggle("active", index === activePredictionIndex);
		});
	}

	// =========================
	// Section: Keyboard Shortcuts
	// =========================

	/**
	 * Registers all keyboard shortcuts.
	 */
	function registerKeyboardShortcuts() {
		document.addEventListener("keydown", function (e) {
			if (e.altKey && e.key === "p") {
				e.preventDefault();
				insertCustomEditorPaletteButtons();
				togglePaletteVisibility();
			}
		});

		document.addEventListener("keydown", function (e) {
			if (e.code === "KeyA" && e.altKey) {
				showActions();
				e.preventDefault();
			}
		});

		document.addEventListener("keydown", function (e) {
			if (e.code === "KeyV" && e.altKey) {
				showVariables();
				e.preventDefault();
			}
		});

		document.addEventListener("keydown", function (e) {
			if (e.ctrlKey && e.code === "KeyD") {
				toggleToolbar();
				e.preventDefault();
			}
		});
	}

	// =========================
	// Section: Toolbar & Sidebar
	// =========================

	/**
	 * Toggles the toolbar open/closed.
	 */
	function toggleToolbar() {
		const btn = safeQuery(
			"div.editor-layout__resize:nth-child(2) > button:nth-child(2)",
			"toggleToolbar"
		);
		if (btn) btn.click();
	}

	/**
	 * Checks if the palette sidebar is open or closed.
	 * @returns {"opened"|"closed"}
	 */
	function getPaletteState() {
		const paletteElement = safeQuery(".editor-layout__palette", "getPaletteState");
		if (!paletteElement) return "closed";
		return paletteElement.offsetWidth <= 8 ? "closed" : "opened";
	}

	// =========================
	// Section: Feature Functions
	// =========================

	/**
	 * Shows the Actions section in the palette.
	 */
	function showActions() {
		if (getPaletteState() === "closed") {
			toggleToolbar();
		}
		try {
			safeQuery(
				"div.editor-palette__accordion:nth-child(2) > div:nth-child(1) > header:nth-child(1) > div:nth-child(1) > button:nth-child(1) > div:nth-child(1) > div:nth-child(2)",
				"showActions"
			)?.click();
		} catch (e) {
			console.warn("Failed to show Actions:", e);
		}
		try {
			safeQuery(
				'.editor-palette-search__cancel button[type="button"][tabindex="-1"]',
				"showActions"
			)?.click();
		} catch (e) {
			console.warn("Failed to cancel search:", e);
		}
	}

	/**
	 * Shows the Variables section in the palette.
	 */
	async function showVariables() {
	  if (getPaletteState() === "closed") {
		toggleToolbar();
		await sleep(1000);
	  }

	  const selector =
		'button[data-path="EditorPalette.section.button"][aria-label="Variables"]';

	  for (let i = 0; i < 10; i++) {
		const el = document.querySelector(selector);
		if (el) {
		  el.click();
		  return;
		}
		await sleep(300);
	  }

	  throw new Error(`Variables button not found: ${selector}`);
	}


	/**
	 * Shows the Triggers section in the palette.
	 */
	function showTriggers() {
	  if (getPaletteState() === "closed") {
		toggleToolbar();
	  }
	  safeQuery(
		'button.editor-palette-section__header-button[data-path="EditorPalette.section.button"][aria-label="Triggers"]',
		"showTriggers"
	  )?.click();
	}



	/**
	 * Adds a new variable via the UI.
	 */
	async function addVariable() {
		if (getPaletteState() === "closed") {
			toggleToolbar();
			await sleep(800);
		}
		const addButton = safeQuery('div.editor-palette__accordion header button', "addVariable");
		if (addButton) {
			addButton.click();
		} else {
			console.warn("Add Variable button not found");
			return;
		}
		await sleep(500);
		const createButton = safeQuery('button[name="create"]', "addVariable");
		if (createButton) {
			createButton.click();
		} else {
			console.warn("Create button not found");
			return;
		}
		await sleep(500);
		const confirmButton = safeQuery('div.action-bar--theme_default button:nth-child(2)', "addVariable");
		if (confirmButton) {
			confirmButton.click();
		} else {
			console.warn("Confirm button not found");
		}
	}

	/**
	 * Deletes unused variables via the UI.
	 */
	async function deleteUnusedVariables() {
		await showVariables();
		await sleep(1000);
		const dropdownMenu = safeQuery("button.action-bar__item--is_menu:nth-child(5)", "deleteUnusedVariables");
		if (dropdownMenu) dropdownMenu.click();
		await sleep(1000);
		const duvButton = safeQuery(".dropdown-options.g-scroller button.rio-focus--inset_4px:nth-child(2)", "deleteUnusedVariables");
		if (duvButton) duvButton.click();
	}

	/**
	 * Scrolls to a specific line number in the editor.
	 * @param {number} lineNumber
	 */
	function scrollToLineNumber(lineNumber) {
		const lineElements = document.querySelectorAll('.taskbot-canvas-list-node > .taskbot-canvas-list-node__number');
		if (lineNumber < 1 || lineNumber > lineElements.length) {
			console.warn(`Line ${lineNumber} is out of range. Total lines: ${lineElements.length}`);
			return;
		}
		const targetElement = lineElements[lineNumber - 1];
		document.querySelectorAll('.line-highlighted').forEach(el => el.classList.remove('line-highlighted'));
		targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		targetElement.classList.add('line-highlighted');
		setTimeout(() => {
			targetElement.classList.remove('line-highlighted');
		}, 2000);
	}

	/**
	 * Shows the help modal.
	 */
	function showHelp() {
		const modalOverlay = document.createElement('div');
		const modal = document.createElement('div');
		const modalContent = document.createElement('div');
		const closeButton = document.createElement('button');
		const signature = document.createElement('div');

		modalOverlay.style.position = 'fixed';
		modalOverlay.style.top = '0';
		modalOverlay.style.left = '0';
		modalOverlay.style.width = '100vw';
		modalOverlay.style.height = '100vh';
		modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		modalOverlay.style.display = 'flex';
		modalOverlay.style.justifyContent = 'center';
		modalOverlay.style.alignItems = 'center';
		modalOverlay.style.zIndex = '1000';
		modalOverlay.style.fontSize = '16px';

		modal.style.backgroundColor = 'white';
		modal.style.color = 'black';
		modal.style.padding = '20px';
		modal.style.borderRadius = '8px';
		modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
		modal.style.maxWidth = '800px';
		modal.style.width = '80%';
		modal.style.position = 'relative';

		let helpContent = "<h3>List of Commands:</h3><ul>";

		for (let command in commandsWithAliases) {
			const { aliases, description } = commandsWithAliases[command];
			helpContent += `<li><b>${aliases.join(', ')}</b>: ${description}</li>`;
		}
		helpContent += `<li><b>:<i>line</i></b>: Scrolls to a specific line number (e.g. <code>:25</code>)</li>`;
		helpContent += "</ul>";

		helpContent += `
			<h4>Keyboard Shortcuts:</h4>
			<ul>
				<li><b>Alt + P</b>: Open the command palette</li>
				<li><b>Alt + V</b>: Show variables</li>
				<li><b>Alt + A</b>: Show actions</li>
			</ul>

			<h4>Clipboard Slots:</h4>
			<ul>
				<li>Use the context menu (Tampermonkey menu) to:
					<ul>
						<li><code>Copy to Slot 1</code>, <code>Slot 2</code>, <code>Slot 3</code></li>
						<li><code>Paste from Slot 1</code>, <code>Slot 2</code>, <code>Slot 3</code></li>
					</ul>
				</li>
				<li>You can also use the rocket icons in the top action bar to quickly copy/paste</li>
			</ul>
		`;

		const style = document.createElement('style');
			style.innerHTML = `
				h1, h2, h3, h4, h5 {
					color: black !important;
				}
			`;
		document.head.appendChild(style);

		modalContent.innerHTML = helpContent;

		closeButton.textContent = 'Close';
		closeButton.style.marginTop = '10px';
		closeButton.style.padding = '8px 16px';
		closeButton.style.border = 'none';
		closeButton.style.backgroundColor = 'var(--color_background_interactive)';
		closeButton.style.color = 'white';
		closeButton.style.cursor = 'pointer';
		closeButton.style.borderRadius = '4px';

		signature.innerHTML = `<a href="https://github.com/Jamir-boop/automationanywhere-improvements.git" target="_blank" style="text-decoration: none; color: #888; font-size: 12px;">made by jamir-boop</a>`;
		signature.style.position = 'absolute';
		signature.style.bottom = '8px';
		signature.style.right = '12px';

		modal.appendChild(modalContent);
		modal.appendChild(closeButton);
		modal.appendChild(signature);
		modalOverlay.appendChild(modal);
		document.body.appendChild(modalOverlay);

		function closeModal() {
			document.body.removeChild(modalOverlay);
		}

		modalOverlay.addEventListener('click', (e) => {
			if (e.target === modalOverlay) {
				closeModal();
			}
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		});
		closeButton.addEventListener('click', closeModal);
	}

	// =========================
	// Section: Custom Palette Buttons
	// =========================

	/**
	 * Updates the active button in the custom palette toolbar.
	 */
	function updateActiveButton() {
		const activeSection = document.querySelector(
			".editor-palette-section__header--is_active .clipped-text__string--for_presentation"
		)?.innerText;
		const buttons = document.querySelectorAll(".customActionVariableButton");
		buttons.forEach((button) => {
			if (button.textContent === activeSection) {
				button.classList.add("buttonToolbarActive");
			} else {
				button.classList.remove("buttonToolbarActive");
			}
		});
	}

	/**
	 * Inserts custom palette buttons for Variables, Actions, and Triggers.
	 */
	function insertCustomEditorPaletteButtons() {
		if (document.getElementById("customActionVariableButtons")) {
			return;
		}
		const containerDiv = document.createElement("div");
		containerDiv.id = "customActionVariableButtons";

		const variableButton = document.createElement("button");
		variableButton.className = "customActionVariableButton";
		variableButton.textContent = "Variables";
		variableButton.onclick = function () {
			showVariables();
			updateActiveButton();
		};

		const actionButton = document.createElement("button");
		actionButton.className = "customActionVariableButton";
		actionButton.textContent = "Actions";
		actionButton.onclick = function () {
			showActions();
			updateActiveButton();
		};

		const triggerButton = document.createElement("button");
		triggerButton.className = "customActionVariableButton";
		triggerButton.textContent = "Triggers";
		triggerButton.onclick = function () {
			showTriggers();
			updateActiveButton();
		};

		containerDiv.appendChild(variableButton);
		containerDiv.appendChild(actionButton);
		containerDiv.appendChild(triggerButton);

		const palette = safeQuery(".editor-layout__palette", "insertCustomEditorPaletteButtons");
		if (palette) {
			palette.appendChild(containerDiv);
		}

		if (!document.getElementById("customActionVariableButtons-style")) {
			const style = document.createElement("style");
			style.id = "customActionVariableButtons-style";
			style.textContent = `
				#customActionVariableButtons {
					display: flex;
					width: 100%;
					height: 38px !important;
					background: white;
				}
				#customActionVariableButtons button {
					all: unset;
					font-size: .85rem;
					font-weight: 300;
					cursor: pointer;
					margin: 4px;
					border-radius: 5px;
					border: 1px solid transparent;
					background-color: transparent;
					color: #3c5e83;
					flex-grow: 1;
					text-align: center;
					transition: background-color 0.3s;
				}
				#customActionVariableButtons button:hover {
					background-color: #dae9f3;
				}
				.buttonToolbarActive {
					border: 1px solid #3c5e83 !important;
					text-shadow: 0.5px 0 0 #3c5e83 , -0.01px 0 0 #3c5e83 !important;
				}
				.editor-palette.g-box-sizing_border-box {
					margin-top: 38px;
				}
			`;
			document.head.appendChild(style);
		}
	}

	// =========================
	// Section: Universal Copy/Paste
	// =========================

	/**
	 * Generates a random emoji string for UID.
	 * @returns {string}
	 */
	function generateEmojiString() {
		const emojis = [
			"😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
			"😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "😣",
			"😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓",
			"🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪",
			"😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀",
			"☠️", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"
		];
		let uniqueString = "";
		for (let i = 0; i < 10; i++) {
			uniqueString += emojis[Math.floor(Math.random() * emojis.length)];
		}
		return uniqueString;
	}

	/**
	 * Recursively clears sensitive fields in an object.
	 * @param {object} obj
	 */
	function clearSensitiveFields(obj) {
		if (!obj || typeof obj !== "object") return;
		for (const key in obj) {
			if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
			if (key === "blob" || key === "thumbnailMetadataPath" || key === "screenshotMetadataPath") {
				obj[key] = "";
			} else if (typeof obj[key] === "object" && obj[key] !== null) {
				clearSensitiveFields(obj[key]);
			}
		}
	}

	/**
	 * Cleans Automation Anywhere node JSON by removing sensitive metadata paths and blobs.
	 * @param {string} jsonString - The input JSON string.
	 * @returns {string} - The cleaned, minified JSON string.
	 */
	function cleanAutomationAnywhereJson(jsonString) {
		let data;
		try {
			data = JSON.parse(jsonString);
		} catch (e) {
			console.error("Invalid JSON input", e);
			return jsonString;
		}

		if (!Array.isArray(data.nodes)) return JSON.stringify(data);

		for (const node of data.nodes) {
			if (!Array.isArray(node.attributes)) continue;
			for (const attr of node.attributes) {
				if (attr.value && typeof attr.value === "object") {
					clearSensitiveFields(attr.value);
				}
			}
		}
		return JSON.stringify(data);
	}

	/**
	 * Copies data to the specified clipboard slot.
	 * @param {number} slot
	 */
	function copyToSlot(slot) {
		const copyButton = safeQuery(".aa-icon-action-clipboard-copy--shared", "copyToSlot");
		if (copyButton) {
			copyButton.click();
			const globalClipboardJSON = localStorage.getItem('globalClipboard');
			try {
				const clipboardData = JSON.parse(globalClipboardJSON);
				clipboardData.uid = "🔥🔥🔥";
				GM_setValue(`universalClipboardSlot${slot}`, JSON.stringify(clipboardData));
			} catch (error) {
				console.error("Failed to copy data to slot:", error);
			}
		}
	}

	/**
	 * Pastes data from the specified clipboard slot.
	 * @param {number} slot
	 */
	function pasteFromSlot(slot) {
		const clipboardData = GM_getValue(`universalClipboardSlot${slot}`);
		if (!clipboardData) {
			return;
		}
		let emojiUid = generateEmojiString();
		let modifiedData = clipboardData.replace(/🔥🔥🔥/g, emojiUid);

		// Clean the JSON before pasting
		let cleanedData = cleanAutomationAnywhereJson(modifiedData);

		localStorage.setItem('globalClipboard', cleanedData);
		localStorage.setItem('globalClipboardUid', `"${emojiUid}"`);
		const pasteButton = safeQuery(".aa-icon-action-clipboard-paste--shared", "pasteFromSlot");
		if (pasteButton) {
			setTimeout(() => {
				pasteButton.click();
			}, 500);
		}
	}

	function universalCopyCommandPalette() {
		const btn = document.querySelector(".universalCopy");
		if (btn) {
			btn.click();
		} else {
			universalCopy(); // fallback
		}
	}

	function universalPasteCommandPalette() {
		const btn = document.querySelector(".universalPaste");
		if (btn) {
			btn.click();
		} else {
			universalPaste(); // fallback
		}
	}

	/**
	 * Inserts universal copy/paste buttons into the action bar.
	 * @param {number} attempt
	 */
	function insertUniversalCopyPasteButtons(attempt = 1) {
		setTimeout(() => {
			const actionBar = document.querySelector('.action-bar--theme_info');
			if (actionBar && !actionBar.querySelector('.universalCopy')) {
				const separator = document.createElement('div');
				separator.className = 'action-bar__separator';
				actionBar.appendChild(separator);

				// Universal Copy button
				const copyButton = document.createElement('button');
				copyButton.className = 'universalCopy rio-focus rio-focus--inset_0 rio-focus--border-radius_4px rio-focus--has_element-focus-visible rio-bare-button g-reset-element rio-bare-button--is_interactive rio-bare-button--rio_interactive-softest rio-bare-button--is_parent rio-bare-button--is_clickable rio-bare-button--size_14px rio-bare-button--is_square rio-bare-button--square_26x26 action-bar__item action-bar__item--is_action taskbot-editor__toolbar__action';
				copyButton.innerHTML = `<span class="icon fa fa-rocket icon--block"></span>`;
				copyButton.title = 'Universal Copy';
				copyButton.onclick = universalCopy;
				actionBar.appendChild(copyButton);

				// Universal Paste button
				const pasteButton = document.createElement('button');
				pasteButton.className = 'universalPaste rio-focus rio-focus--inset_0 rio-focus--border-radius_4px rio-focus--has_element-focus-visible rio-bare-button g-reset-element rio-bare-button--is_interactive rio-bare-button--rio_interactive-softest rio-bare-button--is_parent rio-bare-button--is_clickable rio-bare-button--size_14px rio-bare-button--is_square rio-bare-button--square_26x26 action-bar__item action-bar__item--is_action taskbot-editor__toolbar__action';
				pasteButton.innerHTML = `<span class="icon fa fa-rocket icon--block" style="transform: rotate(180deg);"></span>`;
				pasteButton.title = 'Universal Paste';
				pasteButton.onclick = universalPaste;
				actionBar.appendChild(pasteButton);
			} else if (attempt < 3) {
				insertUniversalCopyPasteButtons(attempt + 1);
			}
		}, 1000 * attempt);
	}

	/**
	 * Universal copy action.
	 */
	function universalCopy() {
		const copyBtn = safeQuery(".aa-icon-action-clipboard-copy--shared", "universalCopy");
		if (copyBtn) copyBtn.click();
		const globalClipboardJSON = localStorage.getItem('globalClipboard');
		let globalClipboard = {};
		try {
			globalClipboard = JSON.parse(globalClipboardJSON);
		} catch (e) {
			console.error("Error parsing JSON:", e);
			return;
		}
		globalClipboard.uid = "🔥🔥🔥";
		GM_setValue('universalClipboard', JSON.stringify(globalClipboard));
	}

	/**
	 * Universal paste action.
	 */
	function universalPaste() {
		const copyBtn = safeQuery(".aa-icon-action-clipboard-copy--shared", "universalPaste");
		if (copyBtn) copyBtn.click();
		let universalClipboard = GM_getValue('universalClipboard');
		if (universalClipboard) {
			let emojiUid = generateEmojiString();
			universalClipboard = universalClipboard.replace(/'/g, '"');
			universalClipboard = universalClipboard.replace(/🔥🔥🔥/g, emojiUid);

			// Clean the JSON before pasting
			let cleanedData = cleanAutomationAnywhereJson(universalClipboard);

			localStorage.setItem("globalClipboard", cleanedData);
			localStorage.setItem("globalClipboardUid", `"${emojiUid}"`);
		}
		setTimeout(() => {
			const pasteBtn = safeQuery(".aa-icon-action-clipboard-paste--shared", "universalPaste");
			if (pasteBtn) pasteBtn.click();
		}, 1000);
	}

	// =========================
	// Section: Redirect Utility
	// =========================

	/**
	 * Redirects to a given path within the Automation Anywhere domain.
	 * @param {string} targetPath
	 */
	function redirectToPath(targetPath) {
		const currentUrl = window.location.href;
		const pattern = /^(https:\/\/[^\/]*\.automationanywhere\.digital)/;
		const match = currentUrl.match(pattern);
		if (match) {
			const baseUrl = match[1];
			const newUrl = baseUrl + targetPath;
			window.location.href = newUrl;
		} else {
			console.error("Pattern didn't match. The URL might not be in the expected format.");
		}
	}

	function redirectToPublicRepository() {
		redirectToPath('/#/bots/repository/public/');
	}
	function redirectToPrivateRepository() {
		redirectToPath('/#/bots/repository/private/');
	}
	function redirectToActivityHistorical() {
		redirectToPath('/#/activity/historical/');
	}
	function redirectToInProgress() {
		redirectToPath('/#/activity/inprogress/');
	}
	function redirectToAuditLog() {
		redirectToPath('/#/audit');
	}
	function redirectToAdminUsers() {
		redirectToPath('/#/admin/users/');
	}
	function redirectToAdminRoles() {
		redirectToPath('/#/admin/roles/');
	}
	function redirectToAdminDevices() {
		redirectToPath('/#/devices/');
	}
	function redirectToHome() {
		redirectToPath('/#/dashboard/home/overview');
	}

	// =========================
	// Section: Command Palette Insertion
	// =========================

	/**
	 * Inserts the command palette into the DOM.
	 * @param {number} retryCount
	 */
	function insertCommandPalette(retryCount = 0) {
		if (document.querySelector("#commandPalette")) {
			return;
		}
		const containerDiv = document.createElement("div");
		containerDiv.id = "commandPalette";
		containerDiv.className = "command_palette--hidden";
		containerDiv.innerHTML = `
			<input type="text" id="commandInput" placeholder="Enter command...">
			<div id="commandPredictions" class="command_predictions"></div>
		`;
		document.body.appendChild(containerDiv);

		if (!document.getElementById("commandPalette-style")) {
			const style = document.createElement("style");
			style.id = "commandPalette-style";
			style.type = "text/css";
			style.appendChild(document.createTextNode(`
				#commandPalette * { font-size: 1.15rem; font-family: Museo Sans,sans-serif; color: black;}
				#commandPalette { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
					background-color: white; border-radius: 10px 10px 0 0; display: flex; flex-direction: column;
					align-items: center; min-width: 30vw; max-width: 80vw; width: 600px; z-index: 99999;
					box-shadow: 0px 0px 0px 5000px #00000054; }
				#commandInput, #commandInput:focus-visible, #commandInput:active {
					unset: all; padding: 10px; width: 93%; margin-bottom: 10px; border: 2px solid transparent; border-radius: 5px;
				}
				#commandPalette:focus, #commandPalette:active { border-color: orange; }
				#commandPredictions { position: absolute; top: 100%; left: 0; width: 100%; background-color: white;
					box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 0 0 10px 10px; max-height: 200px; overflow-y: auto; z-index: 100000; }
				.command_prediction-item.active { background-color: #f0f0f0; }
				.command_prediction-item strong { font-weight: bold; }
				.command_prediction-item { padding: 8px; cursor: pointer;}
				.command_prediction-item:hover, .command_prediction-item.active { background-color: #f0f0f0; }
				@keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
					to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
				@keyframes fadeOut { from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
					to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); } }
				.command_palette--visible { display: block; animation: fadeIn 0.25s ease-out forwards; }
				.command_palette--hidden { animation: fadeOut 0.25s ease-out forwards; display: none; pointer-events: none; opacity: 0; z-index: -1; }
			`));
			document.head.appendChild(style);
		}

		setupCommandInputEventListeners();

		if (!document.querySelector("#commandPalette")) {
			if (retryCount < 5) {
				setTimeout(() => insertCommandPalette(retryCount + 1), 3000);
			} else {
				console.error("Failed to insert command palette after 5 retries.");
			}
		}
	}

	/**
	 * Exports the currently copied action as JSON to the user's clipboard,
	 * with uid set to 🔥🔥🔥 (for universal sharing).
	 */
	async function exportActionToClipboard() {
		try {
			// Use universalCopy to set GM storage with 🔥🔥🔥 as uid
			universalCopy();
			// Wait a short moment to ensure GM_setValue is complete
			await sleep(200);
			const universalClipboard = GM_getValue('universalClipboard');
			if (!universalClipboard) {
				return;
			}
			await navigator.clipboard.writeText(universalClipboard);
		} catch (e) {
			console.warn("Failed to export action to clipboard:", e);
		}
	}

	function importActionFromJson() {
		// Modal setup
		const overlay = document.createElement('div');
		overlay.style.position = 'fixed';
		overlay.style.top = '0';
		overlay.style.left = '0';
		overlay.style.width = '100vw';
		overlay.style.height = '100vh';
		overlay.style.background = 'rgba(0,0,0,0.5)';
		overlay.style.zIndex = '100000';
		overlay.style.display = 'flex';
		overlay.style.justifyContent = 'center';
		overlay.style.alignItems = 'center';

		const modal = document.createElement('div');
		modal.style.background = 'white';
		modal.style.padding = '24px';
		modal.style.borderRadius = '8px';
		modal.style.maxWidth = '600px';
		modal.style.width = '90%';
		modal.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
		modal.style.display = 'flex';
		modal.style.flexDirection = 'column';
		modal.style.alignItems = 'stretch';

		const label = document.createElement('label');
		label.textContent = "Paste Automation Anywhere Action JSON:";
		label.style.marginBottom = '8px';

		const textarea = document.createElement('textarea');
		textarea.style.width = '100%';
		textarea.style.height = '180px';
		textarea.style.marginBottom = '12px';
		textarea.style.fontFamily = 'monospace';
		textarea.style.fontSize = '1rem';

		const buttonRow = document.createElement('div');
		buttonRow.style.display = 'flex';
		buttonRow.style.justifyContent = 'flex-end';
		buttonRow.style.gap = '8px';

		const importBtn = document.createElement('button');
		importBtn.textContent = "Import & Paste";
		importBtn.style.padding = '8px 16px';
		importBtn.style.background = 'var(--color_background_interactive, #3c5e83)';
		importBtn.style.color = 'white';
		importBtn.style.border = 'none';
		importBtn.style.borderRadius = '4px';
		importBtn.style.cursor = 'pointer';

		const cancelBtn = document.createElement('button');
		cancelBtn.textContent = "Cancel";
		cancelBtn.style.padding = '8px 16px';
		cancelBtn.style.background = '#ccc';
		cancelBtn.style.color = '#222';
		cancelBtn.style.border = 'none';
		cancelBtn.style.borderRadius = '4px';
		cancelBtn.style.cursor = 'pointer';

		buttonRow.appendChild(cancelBtn);
		buttonRow.appendChild(importBtn);

		modal.appendChild(label);
		modal.appendChild(textarea);
		modal.appendChild(buttonRow);
		overlay.appendChild(modal);
		document.body.appendChild(overlay);
		textarea.focus();

		function closeModal() {
			document.body.removeChild(overlay);
		}

		cancelBtn.onclick = closeModal;
		overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
		document.addEventListener('keydown', function escListener(e) {
			if (e.key === 'Escape') {
				closeModal();
				document.removeEventListener('keydown', escListener);
			}
		});

		importBtn.onclick = async function () {
			let input = textarea.value.trim();
			if (!input) {
				return;
			}
			try {
				// Validate JSON
				JSON.parse(input);
			} catch (e) {
				return;
			}
			// Set GM storage for universal paste
			GM_setValue('universalClipboard', input);
			closeModal();
			// Wait a short moment to ensure GM_setValue is complete
			await sleep(200);
			universalPaste();
		};
	}

	// =========================
	// Section: Initialization
	// =========================

	/**
	 * Runs all startup functions, using MutationObserver for palette and action bar.
	 */
	function initialize() {
		if (!document.querySelector("#commandPalette")) {
			insertCommandPalette();
		}
		if (!document.getElementById("customActionVariableButtons")) {
			insertCustomEditorPaletteButtons();
		}
		insertUniversalCopyPasteButtons();
		removeInlineWidth();

		// Only set up listeners and intervals once
		if (!initialized) {
			registerKeyboardShortcuts();
			updateActiveButtonIntervalId = setInterval(updateActiveButton, 1000);
			initialized = true;

			// Observe for SPA navigation changes
			let lastHref = document.location.href;
			setInterval(function () {
				const currentHref = document.location.href;
				if (lastHref !== currentHref) {
					lastHref = currentHref;
					insertCommandPalette();
					insertCustomEditorPaletteButtons();
					insertUniversalCopyPasteButtons();
					removeInlineWidth();
				}
			}, 5000);
		}
	}

	/**
	 * Removes inline width from the navigation panel.
	 */
	function removeInlineWidth() {
		const nav = document.querySelector('.main-layout__navigation');
		const pathfinderCollapsed = document.querySelector('.pathfinder--is_collapsed');
		if (pathfinderCollapsed) {
			if (nav?.style?.width) {
				nav.style.removeProperty('width');
			}
			return;
		}
		const collapseButton = document.querySelector('button[aria-label="Collapse"]');
		if (collapseButton) {
			collapseButton.click();
			setTimeout(() => {
				if (nav?.style?.width) {
					nav.style.removeProperty('width');
				}
			}, 500);
		} else {
			console.warn('Collapse button not found');
		}
	}

	// =========================
	// Section: Tampermonkey Menu Commands
	// =========================

	// Register menu commands for selecting copy/paste slots
	GM_registerMenuCommand("Copy to Slot 1", () => copyToSlot(1));
	GM_registerMenuCommand("Copy to Slot 2", () => copyToSlot(2));
	GM_registerMenuCommand("Copy to Slot 3", () => copyToSlot(3));
	GM_registerMenuCommand("Paste from Slot 1", () => pasteFromSlot(1));
	GM_registerMenuCommand("Paste from Slot 2", () => pasteFromSlot(2));
	GM_registerMenuCommand("Paste from Slot 3", () => pasteFromSlot(3));

	// =========================
	// Section: DOM Ready
	// =========================

	function callInitializeRepeatedly(times = 3, interval = 5000) {
		let count = 0;
		const intervalId = setInterval(() => {
			initialize();
			count++;
			if (count >= times) {
				clearInterval(intervalId);
			}
		}, interval);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => callInitializeRepeatedly());
	} else {
		callInitializeRepeatedly();
	}
})();