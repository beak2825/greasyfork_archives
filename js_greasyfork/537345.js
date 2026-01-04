// ==UserScript==
// @name         Piccolo's Agario Modded 3.2
// @namespace    New Jack redoes agar.io after 10 years
// @version      3.1
// @description  Advanced controls, features, freeze/pause, change everyones skins, vertical split, use urls as skins
// @author       𝓝𝑒ⓦ 𝓙ⓐ¢K🕹️
// @icon         https://i.ibb.co/C3gdJwTP/piccolo.png
// @match        https://agar.io/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537345/Piccolo%27s%20Agario%20Modded%2032.user.js
// @updateURL https://update.greasyfork.org/scripts/537345/Piccolo%27s%20Agario%20Modded%2032.meta.js
// ==/UserScript==
/*
 * Notes:
 *  - Combined player data collector and skin manager in a single UI
 *  - Acid mode as a toggle switch
 *  - Pause/freeze functionality using keyboard (Hybrid freeze)
 *  - Copy Names, see all the free skin names
 *  - Vertical Split -  hold V and split just right to line split up and down
 *  - Name collection, scoreboard data, and extended nick limit
 *  - Slider to call MC.activateAllOffers() from console
 *  - For best results use Chrome or Oprea on this mod, pause might not work on edge
 *  - Custom Skin Maker  - drag and drop, upload from a url
 *  - Contact discord new_jack_9999  for any new ideas  (no bots, full map, disconnect or spectator requests ---Agar.io is for everyone, not your ego)
 *  - Feel free to use all this code or any of this code for your own mod
 *  - FYI, imgur has been giving me trouble lately and might not display. This mod accepts any image from anywhere.  Try https://imgbb.com/
 */
(function () {
	"use strict";
	let gameCanvas = null;
	let mainOverlay = null;
	let showControlsButton = null;
	let playerDataManagerBox = null;
	let modUIVisible = false;
	let isMacroFeeding = false;
	let macroFeedInterval = null;
	let isPaused = false;
	let isInputFocused = false;
	let isStraightLineMode = false;
	let verticalSplitEnabled = false;
	let verticalPositionReady = false;
	let fpsCounter = null;
	let frameCount = 0;
	let fpsValue = 0;
	let lastFpsUpdate = performance.now();
	let enemySkins = {};
	let leaderboardData = {};
	let cellNames = new Set();
	let playerScore = 0;
	let startingMousePosition = {
		x: 0,
		y: 0,
	};
	let currentMousePosition = {
		x: 0,
		y: 0,
	};
	let lockPosition = {
		x: 0,
		y: 0,
	};
	let lockInterval = null;
	let originalSetTarget = null;
	let originalSendFunction = null;
	let cursorLockEnabled = true;
	let packetFreezeEnabled = true;
	let autoRespawnInterval = null;

	let potionInterval = null;
	let coinInterval = null;
	let userInfoUpdateInterval = null;
	let currentPotionSlot = 1;
	const STORAGE_KEY = "piccolosmod";
	const COLORS = {
		headingText: "#343434",
		normalText: "#000000",
		functionChoice: "#00d3ff",
		activePicked: "#1e67e0",
		buttonBg: "#54c800",
		buttonBgPress: "#357f00",
		sliderOff: "#f03737",
	};
	const TAB_ACTIVE_COLOR = "#003366";
	const TAB_INACTIVE_COLOR = "#66a3ff";
	const BACKGROUND_COLOR = "#ffffff";
	const TEXT_COLOR = "#000";
	const FONT_SIZE = "20px";
	const SLIDER_SETTINGS = {
		width: 60,
		height: 30,
		circleSize: 22,
		circleOffset: {
			on: "34px",
			off: "4px",
		},
		colors: {
			on: COLORS.buttonBg,
			off: COLORS.sliderOff,
		},
		borderRadius: "30px",
	};
	const defaultConfig = {
		enableMod: true,
		leftMouseAction: "macroFeed",
		middleMouseAction: "none",
		rightMouseAction: "split",
		singleFeedKey: "w",
		macroFeedKey: "m",
		doubleSplitKey: "d",
		tripleSplitKey: "t",
		quadSplitKey: "q",
		verticalLineKey: "v",
		acidModeKey: "a",
		skinSwitcherKey: "s",
		toggleUIKey: "h",
		verticalSplitKey: "u",
		pauseMovementKey: "p",
		enableAcidMode: false,
		showFpsCounter: true,
		activateAllOffers: true,
		unlimitedFps: false,
		enableMinimap: true,
		minimizeMap: false,
		showPlayersOnMap: true,
		enableCustomSkin: true,
		customSkinUrl: "",
		feedRate: 10,
		splitDelay: 50,
		maxSavedSkins: 21,
		autoCoinCollector: true,
		potionOpener: false,
		hideUserInfo: true,
		changeTheme: false,
		hideToasters: false,
		autoRespawn: false,
		skipStats: false,
	};

	function loadConfig() {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				const parsed = JSON.parse(stored);
				return {
					...defaultConfig,
					...parsed,
				};
			}
		} catch (e) {
			console.log("Error loading config from localStorage:", e);
		}
		return {
			...defaultConfig,
		};
	}

	function saveConfig(config) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
		} catch (e) {
			console.log("Error saving config to localStorage:", e);
		}
	}
	let CONFIG = loadConfig();
	const originalClearRect = CanvasRenderingContext2D.prototype.clearRect;
	CanvasRenderingContext2D.prototype.clearRect = function (...args) {
		if (this.canvas && this.canvas.width > 500) {
			const now = performance.now();
			frameCount++;
			if (now - lastFpsUpdate > 500) {
				fpsValue = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
				frameCount = 0;
				lastFpsUpdate = now;
				updateFpsCounter();
			}
		}
		return originalClearRect.apply(this, args);
	};

	function createFunctionToggle(label, configKey) {
		const toggleRow = document.createElement("div");
		toggleRow.style.cssText = `
            padding: 10px;
            background: rgba(255,255,255,0.05);
            border-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
        `;
		const labelElement = document.createElement("span");
		labelElement.textContent = label;
		labelElement.style.cssText = `font-weight: bold; color: ${COLORS.normalText};`;
		toggleRow.appendChild(labelElement);
		const toggle = document.createElement("label");
		toggle.style.cssText = `
            position: relative; display: inline-block; width:60px; height:30px; cursor: pointer;
        `;
		const checkboxInput = document.createElement("input");
		checkboxInput.type = "checkbox";
		if (CONFIG[configKey] === undefined) {
			CONFIG[configKey] = false;
		}
		checkboxInput.checked = CONFIG[configKey];
		checkboxInput.style.cssText = "opacity:0; width:0; height:0;";
		const sliderElement = document.createElement("span");
		sliderElement.style.cssText = `
            position:absolute; top:0; left:0; right:0; bottom:0; transition:0.4s; border-radius:30px;
            background-color:${CONFIG[configKey] ? COLORS.buttonBg : COLORS.sliderOff};
        `;
		const circleElement = document.createElement("span");
		circleElement.style.cssText = `
            position:absolute; content:''; height:22px; width:22px; bottom:4px;
            left:${CONFIG[configKey] ? "34px" : "4px"};
            background-color:#fff; transition:0.4s; border-radius:50%;
        `;
		sliderElement.appendChild(circleElement);
		toggle.appendChild(checkboxInput);
		toggle.appendChild(sliderElement);
		checkboxInput.addEventListener("change", function () {
			CONFIG[configKey] = this.checked;
			sliderElement.style.backgroundColor = this.checked
				? COLORS.buttonBg
				: COLORS.sliderOff;
			circleElement.style.left = this.checked ? "34px" : "4px";
			saveConfig(CONFIG);
			handleFunctionToggle(configKey, this.checked);
		});
		toggleRow.appendChild(toggle);
		return toggleRow;
	}
	const toggleLabel = document.createElement("span");
	toggleLabel.textContent = "Sync Username/Picture";
	toggleLabel.style.cssText = `font-weight: bold; color: ${COLORS.normalText};`;

	function handleFunctionToggle(configKey, isEnabled) {
		switch (configKey) {
			case "autoCoinCollector":
				showNotification(`Auto Coin Collector: ${isEnabled ? "ON" : "OFF"}`);
				toggleCoinCollector(isEnabled);
				break;
			case "potionOpener":
				showNotification(`Potion Opener: ${isEnabled ? "ON" : "OFF"}`);
				togglePotionManager(isEnabled);
				break;
			case "hideUserInfo":
				showNotification(`Username Sync: ${isEnabled ? "ON" : "OFF"}`);
				toggleUserInfoDisplay(isEnabled);
				break;
			case "changeTheme":
				CONFIG.changeTheme = isEnabled;
				showNotification(`Theme Change: ${isEnabled ? "DARK" : "LIGHT"}`);
				if (window.core && typeof window.core.setDarkTheme === "function") {
					window.core.setDarkTheme(isEnabled);
				}
				applyTheme(isEnabled ? "dark" : "light");
				saveConfig(CONFIG);
				break;
			case "autoRespawn":
				if (isEnabled) {
					setupAutoRespawn();
					showNotification("Auto Respawn Enabled");
				} else {
					disableAutoRespawn();
					if (window.MC && typeof window.MC.updateUserSettings === "function") {
						window.MC.updateUserSettings({
							skipStats: false,
						});
					}
					showNotification("Auto Respawn Disabled");
				}
				break;
			case "hideToasters":
				showNotification(
					`Toaster Notifications: ${isEnabled ? "HIDDEN" : "VISIBLE"}`,
				);
				toggleToasters(!isEnabled);
				break;
		}
	}

	function togglePotionManager(enabled) {
		if (enabled) {
			if (!potionInterval) {
				potionInterval = setInterval(checkPotionSlots, 2000);
				console.log("Potion manager started");
				checkPotionSlots();
			}
		} else {
			if (potionInterval) {
				clearInterval(potionInterval);
				potionInterval = null;
				console.log("Potion manager stopped");
			}
		}
	}

	function toggleToasters(shouldShow) {
		try {
			let toasterStyle = document.getElementById("toaster-hide-style");
			if (!shouldShow) {
				if (!toasterStyle) {
					toasterStyle = document.createElement("style");
					toasterStyle.id = "toaster-hide-style";
					toasterStyle.textContent = `
                        #agario-mod-notification,
                        #controls-toast,
                        .toaster,
                        .notification,
                        .toast-container,
                        [id*="toast"],
                        [class*="toast"],
                        [id*="notification"],
                        [class*="notification"] {
                            display: none !important;
                            opacity: 0 !important;
                            visibility: hidden !important;
                        }
                    `;
					document.head.appendChild(toasterStyle);
				}
			} else {
				if (toasterStyle) {
					toasterStyle.remove();
				}
			}
			console.log(`Toaster notifications: ${shouldShow ? "shown" : "hidden"}`);
		} catch (err) {
			console.error("Error toggling toasters:", err);
		}
	}

	function toggleTheme() {
		const isDarkMode = !CONFIG.changeTheme;
		CONFIG.changeTheme = isDarkMode;
		applyTheme(isDarkMode ? "dark" : "light");
		if (window.core && typeof window.core.setDarkTheme === "function") {
			window.core.setDarkTheme(isDarkMode);
		}
		saveConfig(CONFIG);
		showNotification(`Theme: ${isDarkMode ? "Dark" : "Light"}`);
	}

	function toggleUserInfoDisplay(shouldCopy) {
		try {
			if (shouldCopy) {
				if (!window.userInfoUpdateInterval) {
					window.userInfoUpdateInterval = setInterval(() => {
						updateUserName();
						updateUserPicture();
					}, 1000);
					console.log("User info update interval started");
					updateUserName();
					updateUserPicture();
				}
			} else {
				if (window.userInfoUpdateInterval) {
					clearInterval(window.userInfoUpdateInterval);
					window.userInfoUpdateInterval = null;
					console.log("User info update interval stopped");
				}
			}
			console.log(
				`User info synchronization: ${shouldCopy ? "active" : "inactive"}`,
			);
		} catch (err) {
			console.error("Error toggling user info:", err);
		}
	}

	function setupAutoRespawn() {
		if (autoRespawnInterval) clearInterval(autoRespawnInterval);
		if (!window.originalOnPlayerDeath && window.MC && window.MC.onPlayerDeath) {
			window.originalOnPlayerDeath = window.MC.onPlayerDeath;
			window.MC.onPlayerDeath = function (...args) {
				window.originalOnPlayerDeath.apply(this, args);
				if (CONFIG.autoRespawn) {
					console.log("Player died, auto respawning in 1 second...");
					showNotification("Died! Auto-respawning...");
					if (window.MC && window.MC.updateUserSettings) {
						window.MC.updateUserSettings({
							skipStats: true,
						});
					}
					setTimeout(() => {
						try {
							const playButton = document.querySelector(
								'.btn-play, .btn-play-again, #play, [data-v-action="play"]',
							);
							if (playButton) {
								playButton.click();
								console.log("Play button clicked for auto-respawn");
							} else if (
								window.MC &&
								typeof window.MC.onPlayerSpawn === "function"
							) {
								console.log("Using MC.onPlayerSpawn for auto-respawn");
								window.MC.onPlayerSpawn();
							} else {
								console.log("No respawn method found");
							}
						} catch (err) {
							console.error("Auto-respawn failed:", err);
						}
					}, 1000);
				}
			};
		}
		autoRespawnInterval = setInterval(() => {
			if (
				CONFIG.enableAutoRespawn &&
				window.MC &&
				window.core &&
				typeof window.core.playerHasCells === "function"
			) {
				if (!window.core.playerHasCells()) {
					console.log("Interval check: player has no cells, respawning...");
					try {
						const playButton = document.querySelector(
							'.btn-play, .btn-play-again, #play, [data-v-action="play"]',
						);
						if (playButton) {
							playButton.click();
						} else if (
							window.MC &&
							typeof window.MC.onPlayerSpawn === "function"
						) {
							window.MC.onPlayerSpawn();
						}
					} catch (err) {
						console.error("Interval auto-respawn failed:", err);
					}
				}
			}
		}, 3000);
		console.log("Auto respawn system initialized");
	}

	function disableAutoRespawn() {
		if (autoRespawnInterval) {
			clearInterval(autoRespawnInterval);
			autoRespawnInterval = null;
		}
		if (window.originalOnPlayerDeath && window.MC) {
			window.MC.onPlayerDeath = window.originalOnPlayerDeath;
			window.originalOnPlayerDeath = null;
		}
		if (window.MC && window.MC.updateUserSettings) {
			window.MC.updateUserSettings({
				skipStats: false,
			});
		}
		console.log("Auto respawn system disabled");
	}

	function applyTheme(themeName) {
		try {
			if (themeName === "dark") {
				document.body.style.backgroundColor = "#222";
				const elements = document.querySelectorAll(
					".controls-container, .menu-panel",
				);
				elements.forEach((el) => {
					el.style.backgroundColor = "#333";
					el.style.color = "#eee";
				});
			} else {
				document.body.style.backgroundColor = "";
				const elements = document.querySelectorAll(
					".controls-container, .menu-panel",
				);
				elements.forEach((el) => {
					el.style.backgroundColor = "";
					el.style.color = "";
				});
			}
			console.log(`Theme set to: ${themeName}`);
		} catch (err) {
			console.error("Error changing theme:", err);
		}
	}

	function startUserInfoSync() {
		if (!userInfoUpdateInterval) {
			userInfoUpdateInterval = setInterval(() => {
				updateUserName();
				updateUserPicture();
			}, 1000);
			console.log("User info sync started");
			updateUserName();
			updateUserPicture();
		}
	}

	function stopUserInfoSync() {
		if (userInfoUpdateInterval) {
			clearInterval(userInfoUpdateInterval);
			userInfoUpdateInterval = null;
			console.log("User info sync stopped");
		}
	}

	function updateUserName() {
		const nickInput = document.getElementById("nick");
		if (!nickInput) return;
		const newName = nickInput.value;
		const nameElems = document.querySelectorAll(".user-name");
		if (nameElems.length > 0) {
			nameElems.forEach((elem) => {
				elem.textContent = newName;
				elem.style.display = "block";
			});
		}
	}

	function updateUserPicture() {
		const avatarImg = document.querySelector("#skinButton .skinWrapper img");
		if (!avatarImg) return;
		const avatarUrl = avatarImg.src;
		const picElems = document.querySelectorAll(".user-picture");
		if (picElems.length > 0) {
			picElems.forEach((elem) => {
				if (elem.tagName.toLowerCase() === "img") {
					elem.src = avatarUrl;
					elem.style.display = "block";
				}
			});
		}
	}

	function startPotionManager() {
		if (!potionInterval) {
			potionInterval = setInterval(checkPotionSlots, 2000);
			console.log("Potion manager started");
			checkPotionSlots();
		}
	}

	function stopPotionManager() {
		if (potionInterval) {
			clearInterval(potionInterval);
			potionInterval = null;
			console.log("Potion manager stopped");
		}
	}

	function checkPotionSlots() {
		if (window.agarApp && window.agarApp.API && window.agarApp.API.isGuest()) {
			console.log("Guest user detected, not using potions");
			return;
		}
		let foundOrange = false;
		for (let slot = 1; slot <= 3; slot++) {
			let slotElement = document.querySelector(getPotionSlotSelector(slot));
			if (slotElement && slotElement.classList.contains("orange")) {
				console.log("Opening potion in slot " + slot + "...");
				try {
					if (window.MC && typeof window.MC.openPotion === "function") {
						window.MC.openPotion(slot);
						setTimeout(() => {
							if (window.MC && typeof window.MC.closeAllViews === "function") {
								window.MC.closeAllViews();
							}
						}, 500);
					}
				} catch (error) {
					console.error("Error opening potion:", error);
				}
				currentPotionSlot = slot + 1;
				if (currentPotionSlot > 3) currentPotionSlot = 1;
				foundOrange = true;
				break;
			}
		}
		if (!foundOrange) {
			let slotElement = document.querySelector(
				getPotionSlotSelector(currentPotionSlot),
			);
			if (slotElement && slotElement.classList.contains("blue")) {
				try {
					if (window.MC && typeof window.MC.startPotion === "function") {
						console.log(
							"Starting blue potion in slot " + currentPotionSlot + "...",
						);
						window.MC.startPotion(currentPotionSlot);
					}
				} catch (error) {
					console.error("Error starting potion:", error);
				}
			}
			currentPotionSlot++;
			if (currentPotionSlot > 3) currentPotionSlot = 1;
		}
	}

	function getPotionSlotSelector(slot) {
		switch (slot) {
			case 1:
				return ".mini.left .potion-slot-shape";
			case 2:
				return ".mini.middle .potion-slot-shape";
			case 3:
				return ".mini.right .potion-slot-shape";
			default:
				return "";
		}
	}

	function startCoinCollector() {
		if (coinInterval) {
			clearInterval(coinInterval);
			coinInterval = null;
		}
		console.log("Starting coin collector");
		checkAndCollectCoins();
		coinInterval = setInterval(checkAndCollectCoins, 30000);
		console.log("Coin collector started successfully");
		return true;
	}

	function stopCoinCollector() {
		if (coinInterval) {
			clearInterval(coinInterval);
			coinInterval = null;
			console.log("Coin collector stopped");
		}
	}

	function toggleCoinCollector(enabled) {
		if (enabled) {
			return startCoinCollector();
		} else {
			return stopCoinCollector();
		}
	}

	function collectCoins() {
		try {
			console.log("Collecting free coins...");
			const hideStyle = document.createElement("style");
			hideStyle.id = "temp-hide-notifications";
			hideStyle.textContent = `
            .toaster, .notification, .toast, .popup,
            [class*="toast"], [class*="notification"],
            .coins-received, .coins-container {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
			document.head.appendChild(hideStyle);
			if (window.MC && typeof window.MC.getFreeCoins === "function") {
				console.log("Collecting coins using MC.getFreeCoins()");
				window.MC.getFreeCoins();
				setTimeout(() => {
					if (window.MC && typeof window.MC.closeAllViews === "function") {
						console.log("Closing popups with MC.closeAllViews()");
						window.MC.closeAllViews();
					}
				}, 500);
				setTimeout(() => {
					if (document.getElementById("temp-hide-notifications")) {
						document.getElementById("temp-hide-notifications").remove();
					}
				}, 1000);
				return true;
			} else if (
				window.agarApp &&
				window.agarApp.API &&
				typeof window.agarApp.API.getFreeCoins === "function"
			) {
				console.log("Collecting coins using agarApp.API.getFreeCoins()");
				window.agarApp.API.getFreeCoins();
				setTimeout(() => {
					if (document.getElementById("temp-hide-notifications")) {
						document.getElementById("temp-hide-notifications").remove();
					}
				}, 1000);
				return true;
			} else {
				console.warn("No method available to collect coins");
				if (document.getElementById("temp-hide-notifications")) {
					document.getElementById("temp-hide-notifications").remove();
				}
				return false;
			}
		} catch (error) {
			console.error("Error collecting coins:", error);
			if (document.getElementById("temp-hide-notifications")) {
				document.getElementById("temp-hide-notifications").remove();
			}
			return false;
		}
	}

	function checkAndCollectCoins() {
		try {
			let timerComponent = null;
			let timeLeft = Infinity;
			const components = document.querySelectorAll("*");
			for (let i = 0; i < components.length; i++) {
				if (
					components[i].__vue__ &&
					components[i].__vue__.freeCoinsTimeLeft !== undefined
				) {
					timerComponent = components[i].__vue__;
					timeLeft = timerComponent.freeCoinsTimeLeft;
					const minutes = Math.floor(timeLeft / 1000 / 60);
					const seconds = Math.floor((timeLeft / 1000) % 60);
					console.log(
						`Free coins time left: ${minutes}m ${seconds}s (${timeLeft}ms)`,
					);
					if (timeLeft <= 0) {
						console.log("Timer has expired! Collecting coins...");
						return collectCoins();
					} else {
						console.log("Coins not ready yet, waiting...");
						return false;
					}
				}
			}
			const freeCoinsButton = document.querySelector(
				"#freeCoins:not(.wait), .free-coins:not(.wait)",
			);
			if (freeCoinsButton) {
				console.log("Free coins button is active! Collecting...");
				return collectCoins();
			}
			console.log("Could not determine if free coins are available");
			return false;
		} catch (error) {
			console.error("Error checking for free coins:", error);
			return false;
		}
	}

	function hideToasters() {
		try {
			let toasterStyle = document.getElementById("toaster-hide-style");
			if (!toasterStyle) {
				toasterStyle = document.createElement("style");
				toasterStyle.id = "toaster-hide-style";
				toasterStyle.textContent = `
                #agario-mod-notification,
                #controls-toast,
                .toaster,
                .notification,
                .toast-container,
                [id*="toast"],
                [class*="toast"],
                [id*="notification"],
                [class*="notification"] {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
            `;
				document.head.appendChild(toasterStyle);
			}
			console.log("Toaster notifications hidden");
		} catch (err) {
			console.error("Error hiding toasters:", err);
		}
	}

	function showToasters() {
		try {
			const toasterStyle = document.getElementById("toaster-hide-style");
			if (toasterStyle) {
				toasterStyle.remove();
			}
			console.log("Toaster notifications visible");
		} catch (err) {
			console.error("Error showing toasters:", err);
		}
	}

	function createFpsCounter() {
		fpsCounter = document.createElement("div");
		fpsCounter.id = "fps-counter";
		fpsCounter.style.cssText = `
            position: fixed;
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.3);
            color: white;
            padding: 4px 8px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 20px;
            z-index: 99999;
        `;
		document.body.appendChild(fpsCounter);
		updateFpsCounter();
	}

	function updateFpsCounter() {
		if (fpsCounter && CONFIG.showFpsCounter) {
			fpsCounter.textContent = `${fpsValue} FPS`;
			fpsCounter.style.display = "block";
		} else if (fpsCounter) {
			fpsCounter.style.display = "none";
		}
	}

	function setUnlimitedFps(enable) {
		CONFIG.unlimitedFps = enable;
		if (window.core && typeof window.core.setFpsCap === "function") {
			window.core.setFpsCap(enable ? 0 : 60);
			showNotification(`FPS Cap: ${enable ? "UNLIMITED" : "60"}`);
		} else {
			console.error("No setFpsCap method available");
			showNotification("Failed to set FPS cap", true);
		}
		saveConfig(CONFIG);
	}

	function showNotification(message, isPinned = false) {
		let notification = document.getElementById("agario-mod-notification");
		if (!notification) {
			notification = document.createElement("div");
			notification.id = "agario-mod-notification";
			notification.style.cssText = `
                position: absolute;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0,0,0,0.7);
                color: #fff;
                padding: 10px 20px;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                font-size: 16px;
                z-index: 1000;
                transition: opacity 0.5s;
                pointer-events: none;
            `;
			document.body.appendChild(notification);
		}
		notification.textContent = message;
		notification.style.opacity = "1";
		if (!isPinned) {
			clearTimeout(notification.fadeTimeout);
			notification.fadeTimeout = setTimeout(() => {
				notification.style.opacity = "0";
			}, 2000);
		}
	}
	const originalDrawImage = CanvasRenderingContext2D.prototype.drawImage;
	CanvasRenderingContext2D.prototype.drawImage = function (img, ...args) {
		if (img && img.src === "https://agar.io/img/background.png") {
			return;
		}
		return originalDrawImage.apply(this, [img, ...args]);
	};

	function findGameCanvas() {
		const canvases = document.getElementsByTagName("canvas");
		if (canvases.length > 0) {
			for (let i = 0; i < canvases.length; i++) {
				if (canvases[i].width > 500 && canvases[i].height > 500) {
					gameCanvas = canvases[i];
					break;
				}
			}
			if (gameCanvas) {
				console.log("Game canvas found!");
				gameCanvas.addEventListener("mousedown", handleMouseDown);
				gameCanvas.addEventListener("mouseup", handleMouseUp);
				gameCanvas.addEventListener("contextmenu", (e) => e.preventDefault());
				gameCanvas.addEventListener("mousemove", (e) => {
					currentMousePosition.x = e.clientX;
					currentMousePosition.y = e.clientY;
					if (isStraightLineMode) applyLineConstraint();
				});
				document.addEventListener("pointerlockchange", onPointerLockChange);
				showNotification(
					`Advanced Controls Active! Press "${CONFIG.toggleUIKey.toUpperCase()}" to toggle UI`,
				);
			} else {
				console.log("No large canvas found, retrying...");
				setTimeout(findGameCanvas, 2000);
			}
		} else {
			console.log("No canvas found, retrying...");
			setTimeout(findGameCanvas, 2000);
		}
	}
	function doMouseAction(action, phase) {
		if (!CONFIG.enableMod) return;
		if (isPaused) return;
		if (isInputFocused) return;
		if (action === "none") return;

		handleAction(action, phase);
	}
	function handleMouseDown(e) {
		if (!CONFIG.enableMod) return;
		if (isPaused) return;
		if (!window.core) return;
		if (isInputFocused) return;
		if (e.button === 0) {
			doMouseAction(CONFIG.leftMouseAction, "down");
		} else if (e.button === 1) {
			e.preventDefault();
			doMouseAction(CONFIG.middleMouseAction, "down");
		} else if (e.button === 2) {
			doMouseAction(CONFIG.rightMouseAction, "down");
		}
	}

	function handleMouseUp(e) {
		if (!CONFIG.enableMod) return;
		if (isPaused) return;
		if (isInputFocused) return;
		if (e.button === 0) {
			doMouseAction(CONFIG.leftMouseAction, "up");
		} else if (e.button === 1) {
			doMouseAction(CONFIG.middleMouseAction, "up");
		} else if (e.button === 2) {
			doMouseAction(CONFIG.rightMouseAction, "up");
		}
	}

	function handleAction(action, phase) {
		if (!window.core) return;
		if (action === "none") return;
		switch (action) {
			case "singleFeed":
				if (phase === "down") window.core.eject?.();
				break;
			case "macroFeed":
				if (phase === "down") startMacroFeed();
				else if (phase === "up") stopMacroFeed();
				break;
			case "split":
				if (phase === "down") window.core.split?.();
				break;
		}
	}

	function handleKeyDown(e) {
		const key = e.key.toLowerCase();
		if (key === CONFIG.toggleUIKey) {
			toggleMainOverlay();
			return;
		}
		if (isInputFocused) return;
		if (!CONFIG.enableMod) return;
		if (isPaused && key !== CONFIG.pauseMovementKey) return;
		switch (key) {
			case CONFIG.singleFeedKey:
				window.core?.eject?.();
				break;
			case CONFIG.macroFeedKey:
				startMacroFeed();
				break;
			case CONFIG.doubleSplitKey:
				performMultiSplit(2);
				break;
			case CONFIG.tripleSplitKey:
				performMultiSplit(3);
				break;
			case CONFIG.quadSplitKey:
				performMultiSplit(4);
				break;
			case CONFIG.verticalLineKey:
				setVerticalLinePosition();
				break;
			case CONFIG.skinSwitcherKey:
				openSkinSwitcherUI();
				break;
			case CONFIG.pauseMovementKey:
				togglePause();
				break;
			case CONFIG.verticalSplitKey:
				performVerticalSplit();
				break;
		}
	}

	function handleKeyUp(e) {
		if (!CONFIG.enableMod) return;
		if (isPaused) return;
		if (isInputFocused) return;
		if (e.key.toLowerCase() === CONFIG.macroFeedKey) {
			stopMacroFeed();
		}
	}

	function setupKeyHandlers() {
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);
	}

	function startMacroFeed() {
		if (isMacroFeeding) return;
		isMacroFeeding = true;
		showNotification("Macro feeding started");
		window.core?.eject?.();
		macroFeedInterval = setInterval(() => {
			window.core?.eject?.();
		}, CONFIG.feedRate);
	}

	function stopMacroFeed() {
		if (!isMacroFeeding) return;
		clearInterval(macroFeedInterval);
		macroFeedInterval = null;
		isMacroFeeding = false;
		showNotification("Macro feeding stopped");
	}

	function performMultiSplit(count) {
		if (!window.core?.playerHasCells || !window.core.playerHasCells()) {
			showNotification("Cannot split when dead");
			return;
		}
		showNotification(`${count}x Split`);
		for (let i = 0; i < count; i++) {
			setTimeout(() => {
				window.core.split?.();
			}, CONFIG.splitDelay * i);
		}
	}

	function performVerticalSplit() {
		if (!gameCanvas || !window.core) return;
		showNotification("Vertical Quad Split Activated");
		if (window.app && window.app.world) {
			const X = window.app.world.viewX || window.innerWidth / 2;
			const Y = window.app.world.viewY || window.innerHeight / 2;
			window.core.setTarget(X, Y);
		} else {
			const X = window.innerWidth / 2.006;
			const Y = window.innerHeight / 2;
			window.core.setTarget(X, Y);
		}
		isPaused = true;
		enableFreeze();
		setTimeout(() => {
			if (window.core && window.core.split) {
				for (let i = 0; i < 4; i++) {
					setTimeout(() => {
						window.core.split();
					}, 250 * i);
				}
				setTimeout(() => {
					isPaused = false;
					disableFreeze();
					showNotification("Vertical Quad Split Complete");
				}, 2000);
			}
		}, 200);
	}

	function toggleStraightLineMode() {
		isStraightLineMode = !isStraightLineMode;
		if (isStraightLineMode) {
			startingMousePosition.x = currentMousePosition.x;
			startingMousePosition.y = currentMousePosition.y;
			showNotification("Straight line mode ON");
		} else {
			showNotification("Straight line mode OFF");
		}
	}

	function applyLineConstraint() {
		if (!isStraightLineMode) return;
		const dx = currentMousePosition.x - startingMousePosition.x;
		const dy = currentMousePosition.y - startingMousePosition.y;
		const angle = Math.atan2(dy, dx);
		const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
		const distance = Math.sqrt(dx * dx + dy * dy);
		const newX = startingMousePosition.x + Math.cos(snappedAngle) * distance;
		const newY = startingMousePosition.y + Math.sin(snappedAngle) * distance;
		window.core?.setTarget?.(newX, newY);
	}

	function setVerticalLinePosition() {
		if (!gameCanvas || !window.core) return;
		if (window.app && window.app.world) {
			const X = window.app.world.viewX || window.innerWidth / 2;
			const Y = window.app.world.viewY || window.innerHeight / 2.006;
			window.core.setTarget(X, Y);
		} else {
			const X = window.innerWidth / 2;
			const Y = window.innerHeight / 2.006;
			window.core.setTarget(X, Y);
		}
		showNotification("Vertical Line Position");
	}

	function onPointerLockChange() {
		if (document.pointerLockElement !== gameCanvas) {
			isPaused = false;
			disableFreeze();
		}
	}

	function togglePause() {
		isPaused = !isPaused;
		if (isPaused) {
			enableFreeze();
			showNotification("⏸️ GAME PAUSED ⏸️", true);
		} else {
			disableFreeze();
			showNotification("▶️ GAME RESUMED");
		}
	}

	function enableFreeze() {
		const canvas = document.querySelector("canvas");
		if (canvas) {
			if (window.app && window.app.world) {
				lockPosition.x = window.app.world.viewX || canvas.width / 2;
				lockPosition.y = window.app.world.viewY || canvas.height / 2;
			} else {
				const rect = canvas.getBoundingClientRect();
				lockPosition.x = rect.left + rect.width / 2;
				lockPosition.y = rect.top + rect.height / 2;
			}
		} else {
			lockPosition.x = window.innerWidth / 2;
			lockPosition.y = window.innerHeight / 2;
		}
		if (cursorLockEnabled) {
			startCursorLock();
		}
	}

	function disableFreeze() {
		if (lockInterval) {
			clearInterval(lockInterval);
			lockInterval = null;
		}
	}

	function startCursorLock() {
		if (lockInterval) clearInterval(lockInterval);
		lockInterval = setInterval(() => {
			if (
				isPaused &&
				window.core &&
				typeof window.core.setTarget === "function"
			) {
				window.core.setTarget(lockPosition.x, lockPosition.y);
			}
		}, 1);
	}

	function interceptCoreForFreeze() {
		const checkForCore = setInterval(() => {
			if (window.core && typeof window.core.setTarget === "function") {
				originalSetTarget = window.core.setTarget;
				window.core.setTarget = function (x, y) {
					if (isPaused) {
						if (x === lockPosition.x && y === lockPosition.y) {
							return originalSetTarget.call(this, x, y);
						}
						return;
					}
					return originalSetTarget.call(this, x, y);
				};
				clearInterval(checkForCore);
			}
		}, 100);
	}

	function interceptWebSocket() {
		const OriginalWebSocket = window.WebSocket;
		window.WebSocket = function (url, protocols) {
			console.log("WebSocket intercepted:", url);
			const ws = new OriginalWebSocket(url, protocols);
			const originalSendFunction = ws.send;
			ws.send = function (data) {
				if (isPaused && isMouseMovementPacket(data)) {
					console.log("Blocked movement packet while paused");
					return;
				}
				return originalSendFunction.apply(this, arguments);
			};
			return ws;
		};
		Object.assign(window.WebSocket, OriginalWebSocket);
		window.WebSocket.prototype = OriginalWebSocket.prototype;
		window.WebSocket.prototype.constructor = window.WebSocket;
		console.log("WebSocket proxy established");
	}

	function isMouseMovementPacket(data) {
		if (!(data instanceof ArrayBuffer) && !(data instanceof Uint8Array)) {
			return false;
		}
		const dataView = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
		const movementOpcodes = [16, 0x10, 33, 0x21];
		if (dataView.length > 0 && movementOpcodes.includes(dataView[0])) {
			return true;
		}
		if (dataView.length >= 9 && dataView.length <= 13) {
			return true;
		}
		return false;
	}

	function toggleAcidMode(enable) {
		CONFIG.enableAcidMode = enable;
		if (window.core) {
			window.core.setAcid(CONFIG.enableAcidMode);
		}
		saveConfig(CONFIG);
		showNotification(
			CONFIG.enableAcidMode ? "Acid Mode: ON" : "Acid Mode: OFF",
		);
	}

	function toggleMinimap(enable) {
		if (!window.core) return;
		CONFIG.enableMinimap = enable;
		window.core.setMinimap(CONFIG.enableMinimap);
		if (CONFIG.enableMinimap) {
			window.core.minimizeMinimap(CONFIG.minimizeMap);
			window.core.playersMinimap(CONFIG.showPlayersOnMap);
			showNotification("Minimap: ON");
		} else {
			showNotification("Minimap: OFF");
		}
		saveConfig(CONFIG);
	}

	function togglePlayersOnMap(enable) {
		if (!window.core || !CONFIG.enableMinimap) return;
		CONFIG.showPlayersOnMap = enable;
		window.core.playersMinimap(CONFIG.showPlayersOnMap);
		showNotification(
			CONFIG.showPlayersOnMap ? "Players on Map: ON" : "Players on Map: OFF",
		);
		saveConfig(CONFIG);
	}

	function setupNameCollection() {
		if (window._namesToolInitialized) return;
		window._namesToolInitialized = true;
		const originalFillText = CanvasRenderingContext2D.prototype.fillText;
		CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {
			if (text.match(/^([0-9]+)\.(.+)$/)) {
				const parts = text.split(".");
				const position = parseInt(parts[0]);
				const name = parts[1].trim();
				leaderboardData[position] = name;
			} else if (text.match(/^score:\s([0-9]+)$/i)) {
				playerScore = parseInt(text.split(/score:\s([0-9]+)?/i)[1]);
			} else if (
				text &&
				text.length <= 15 &&
				!text.match(
					/(leaderboard|connect|loading|starting\smass|xp\sboost|open\sshop|([0-9]{2})m\s(([0-9]{2})h\s)?([0-9]{2})s)/i,
				) &&
				!isScoreNumber(text)
			) {
				cellNames.add(text);
			}
			return originalFillText.call(this, text, x, y);
		};
	}

	function isScoreNumber(text) {
		const onlyDigits = /^\d+$/.test(text);
		if (onlyDigits) {
			const num = parseInt(text);
			return num >= 10 && num <= 22500;
		}
		return false;
	}
	let originalSkin = null;

	function captureOriginalSkin() {
		try {
			const localData = localStorage.getItem("ogarioSettings");
			if (localData) {
				const settings = JSON.parse(localData);
				if (settings && settings.skin) {
					originalSkin = settings.skin;
				}
			}
		} catch (e) {}
		const obs = new MutationObserver((mutations, o) => {
			const sp = document.querySelector("#skin-preview img");
			if (sp && sp.src) {
				originalSkin = sp.src;
				o.disconnect();
			}
		});
		obs.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	function applyCustomSkin(url) {
		if (!window.core) return;
		try {
			if (!originalSkin) captureOriginalSkin();
			window.core.registerSkin(null, "customskin", url, 0, 0);
			window.core.loadSkin("customskin");
			CONFIG.customSkinUrl = url;
			CONFIG.enableCustomSkin = true;
			saveConfig(CONFIG);
			showNotification("Custom skin applied");
		} catch (e) {
			showNotification("Failed to apply skin: " + e.message);
		}
	}

	function registerEnemySkin(name, url) {
		if (!window.core) return false;
		try {
			window.core.registerSkin(name.toLowerCase(), null, url, 2, null);
			return true;
		} catch (e) {
			console.error("Error registering skin:", e);
			return false;
		}
	}

	function applyAllEnemySkins() {
		let count = 0;
		for (const name in enemySkins) {
			if (registerEnemySkin(name, enemySkins[name])) {
				count++;
			}
		}
		showNotification(`Applied ${count} enemy skins`);
	}

	function loadSkinsFromStorage() {
		try {
			const stored = localStorage.getItem("myCustomSkins");
			return stored ? JSON.parse(stored) : [];
		} catch (e) {
			return [];
		}
	}

	function saveSkinsToStorage(arr) {
		localStorage.setItem("myCustomSkins", JSON.stringify(arr));
	}

	function loadEnemySkins() {
		try {
			const stored = localStorage.getItem("agarioEnemySkins");
			if (stored) enemySkins = JSON.parse(stored);
		} catch (e) {
			console.error("Error loading enemy skins:", e);
			enemySkins = {};
		}
	}

	function saveEnemySkins() {
		localStorage.setItem("agarioEnemySkins", JSON.stringify(enemySkins));
	}

	function applyInitialSettings() {
		console.log("Applying initial settings from configuration");
		if (window.core) {
			if (CONFIG.enableMinimap) {
				console.log("Enabling minimap from saved config");
				window.core.setMinimap(CONFIG.enableMinimap);
				window.core.minimizeMinimap(CONFIG.minimizeMap);
				window.core.playersMinimap(CONFIG.showPlayersOnMap);
			}
			if (CONFIG.unlimitedFps) {
				window.core.setFpsCap(0);
				console.log("Unlimited FPS set from saved config");
			}
			if (CONFIG.enableAcidMode) {
				window.core.setAcid(true);
				console.log("Acid mode enabled from saved config");
			}
			if (CONFIG.enableCustomSkin && CONFIG.customSkinUrl) {
				console.log("Applying custom skin from saved config");
				window.core.registerSkin(
					null,
					"customskin",
					CONFIG.customSkinUrl,
					0,
					0,
				);
				window.core.loadSkin("customskin");
			}
			if (
				CONFIG.changeTheme &&
				typeof window.core.setDarkTheme === "function"
			) {
				console.log("Applying dark theme from saved config");
				window.core.setDarkTheme(true);
			}
		} else {
			console.log("Core not available yet, will retry applying settings");
			setTimeout(applyInitialSettings, 1000);
			return;
		}
		if (CONFIG.potionOpener) {
			console.log("Starting potion manager from saved config");
			togglePotionManager(true);
		}
		if (CONFIG.autoCoinCollector) {
			console.log("Starting coin collector from saved config");
			toggleCoinCollector(true);
		}
		if (CONFIG.hideUserInfo) {
			console.log("Starting user info sync from saved config");
			toggleUserInfoDisplay(true);
		}
		if (CONFIG.changeTheme) {
			console.log("Applying dark theme from saved config");
			applyTheme("dark");
		}
		if (CONFIG.hideToasters) {
			console.log("Hiding toasters from saved config");
			toggleToasters(false);
		}
		if (CONFIG.autoRespawn) {
			console.log("Setting up auto respawn from saved config");
			setupAutoRespawn();
		}
		if (Object.keys(enemySkins).length > 0) {
			console.log("Applying enemy skins from saved config");
			applyAllEnemySkins();
		}
		console.log("Initial settings applied from configuration");
	}

	function checkCoreAccess() {
		if (typeof window.core === "undefined") {
			setTimeout(checkCoreAccess, 1000);
			return;
		}
		console.log("Core access established!");
		applyInitialSettings();
		if (window.MC) {
			const originalOnPlayerDeath = window.MC.onPlayerDeath;
			window.MC.onPlayerDeath = function (...args) {
				originalOnPlayerDeath.apply(this, args);
				console.log("Player died!");
				if (CONFIG.autoRespawn) {
					console.log("Auto-respawn is enabled, about to respawn...");
					showNotification("Died! Auto-respawning...");
					if (typeof window.MC.updateUserSettings === "function") {
						window.MC.updateUserSettings({
							skipStats: true,
						});
					}
					setTimeout(() => {
						try {
							const playButton = document.querySelector(
								'.btn-play-again, .btn-play, #play, [data-v-action="play"]',
							);
							if (playButton) {
								playButton.click();
								console.log("Clicked the play button for auto-respawn");
							} else if (typeof window.MC.onPlayerSpawn === "function") {
								window.MC.onPlayerSpawn();
								console.log("Used MC.onPlayerSpawn() to auto-respawn");
							} else {
								console.log("No known method to respawn found.");
							}
						} catch (err) {
							console.error("Auto-respawn failed:", err);
						}
					}, 1000);
				}
			};
			console.log("Player death hook for auto-respawn initialized");
		}
	}

	function initRussiaToUkraine() {
		function replaceText() {
			const options = document.querySelectorAll('option[value="RU-Russia"]');
			options.forEach((opt) => {
				if (opt.textContent.includes("Russia")) {
					opt.textContent = opt.textContent.replace("Russia", "Ukraine");
				}
			});
		}
		replaceText();
		if (document.body) {
			const obs = new MutationObserver(replaceText);
			obs.observe(document.body, {
				childList: true,
				subtree: true,
			});
		} else {
			document.addEventListener("DOMContentLoaded", () => {
				const obs = new MutationObserver(replaceText);
				obs.observe(document.body, {
					childList: true,
					subtree: true,
				});
			});
		}
	}

	function patchNickLimit() {
		/* 1.  Keep every future <input id="nick"> unlimited  */
		const setLimit = (inp) => {
			inp.removeAttribute("maxlength");
			inp.maxLength = 50;
		};

		/* Apply immediately to anything that exists now … */
		document
			.querySelectorAll('#nick,input[placeholder="Nick"]')
			.forEach(setLimit);

		/* … and to anything that appears later */
		new MutationObserver((muts) => {
			muts.forEach((m) =>
				m.addedNodes.forEach((n) => {
					if (n.nodeType === 1)
						n.querySelectorAll?.('#nick,input[placeholder="Nick"]').forEach(
							setLimit,
						);
				}),
			);
		}).observe(document.body, {childList: true, subtree: true});

		/* 2.  Bypass the new client‑side validator */
		const hook = setInterval(() => {
			if (window.core?.joinGame) {
				clearInterval(hook);
				const original = core.joinGame;
				core.joinGame = function (nick, ...rest) {
					/* leave the UI unlimited; just clip at 50 when the game starts */
					if (typeof nick === "string" && nick.length > 50)
						nick = nick.slice(0, 50);
					return original.call(this, nick, ...rest);
				};
				console.log("[Mod] 50‑char nick patch attached");
			}
		}, 250);
	}

	function createShowControlsButton() {
		const buttonContainer = document.createElement("div");
		buttonContainer.id = "controls-button-container";
		buttonContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 99999;
        display: flex;
        gap: 5px;
    `;
		showControlsButton = document.createElement("button");
		showControlsButton.id = "show-controls-button";
		showControlsButton.textContent = "Show Controls";
		showControlsButton.style.cssText = `
        padding: 5px 10px;
        background-color: ${COLORS.buttonBg};
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        transition: background-color 0.2s ease;
    `;
		const closeButton = document.createElement("button");
		closeButton.id = "close-controls-button";
		closeButton.textContent = "×";
		closeButton.style.cssText = `
        padding: 5px 8px;
        background-color: #f44336;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        font-size: 16px;
        font-weight: bold;
        transition: background-color 0.2s ease;
    `;
		showControlsButton.addEventListener("mouseover", () => {
			showControlsButton.style.backgroundColor = COLORS.buttonBgPress;
		});
		showControlsButton.addEventListener("mouseout", () => {
			showControlsButton.style.backgroundColor = COLORS.buttonBg;
		});
		showControlsButton.addEventListener("mousedown", () => {
			showControlsButton.style.backgroundColor = COLORS.buttonBgPress;
		});
		showControlsButton.addEventListener("mouseup", () => {
			showControlsButton.style.backgroundColor = COLORS.buttonBg;
		});
		closeButton.addEventListener("mouseover", () => {
			closeButton.style.backgroundColor = "#d32f2f";
		});
		closeButton.addEventListener("mouseout", () => {
			closeButton.style.backgroundColor = "#f44336";
		});
		showControlsButton.onclick = toggleMainOverlay;
		closeButton.onclick = () => {
			buttonContainer.style.display = "none";
			showToast(
				`Controls hidden. Press "${CONFIG.toggleUIKey.toUpperCase()}" to show again.`,
			);
		};
		buttonContainer.appendChild(showControlsButton);
		buttonContainer.appendChild(closeButton);
		document.body.appendChild(buttonContainer);
		setTimeout(() => {
			showToast(
				`Tip: Press "${CONFIG.toggleUIKey.toUpperCase()}" to toggle controls panel.`,
			);
		}, 2000);
	}

	function showToast(message, duration = 3000) {
		let toast = document.getElementById("controls-toast");
		if (!toast) {
			toast = document.createElement("div");
			toast.id = "controls-toast";
			toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px 20px;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 1000000;
            transition: opacity 0.5s;
            pointer-events: none;
        `;
			document.body.appendChild(toast);
		}
		toast.textContent = message;
		toast.style.opacity = "1";
		if (toast.hideTimeout) {
			clearTimeout(toast.hideTimeout);
		}
		toast.hideTimeout = setTimeout(() => {
			toast.style.opacity = "0";
		}, duration);
	}

	function createMainOverlay() {
		if (mainOverlay) return;
		mainOverlay = document.createElement("div");
		mainOverlay.id = "main-overlay";
		mainOverlay.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.95);
            padding: 20px;
            border-radius: 10px;
            z-index: 999999;
            width: 1200px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            color: ${COLORS.normalText};
            font-family: Arial, sans-serif;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        `;
		const topBar = document.createElement("div");
		topBar.style.cssText =
			"display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;";
		const title = document.createElement("h2");
		title.textContent = "🕹️ Mod";
		title.style.cssText = `margin: 0; color: ${COLORS.headingText};`;
		topBar.appendChild(title);
		const closeOverlayBtn = document.createElement("button");
		closeOverlayBtn.textContent = "Close";
		closeOverlayBtn.style.cssText = `
            background-color: ${COLORS.buttonBg};
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
        `;
		closeOverlayBtn.addEventListener("mouseover", () => {
			closeOverlayBtn.style.backgroundColor = COLORS.buttonBgPress;
		});
		closeOverlayBtn.addEventListener("mouseout", () => {
			closeOverlayBtn.style.backgroundColor = COLORS.buttonBg;
		});
		closeOverlayBtn.addEventListener("click", () => {
			mainOverlay.style.display = "none";
			modUIVisible = false;
			if (showControlsButton) {
				showControlsButton.textContent = "Show Controls";
			}
		});
		topBar.appendChild(closeOverlayBtn);
		mainOverlay.appendChild(topBar);
		const contentContainer = document.createElement("div");
		contentContainer.style.cssText =
			"display: flex; flex-wrap: wrap; gap: 20px;";
		mainOverlay.appendChild(contentContainer);
		const leftColumn = document.createElement("div");
		leftColumn.style.cssText = "flex: 1; min-width: 320px;";
		contentContainer.appendChild(leftColumn);
		const rightColumn = document.createElement("div");
		rightColumn.style.cssText = "flex: 1; min-width: 320px;";
		contentContainer.appendChild(rightColumn);
		const mouseBindingsDiv = document.createElement("div");
		mouseBindingsDiv.innerHTML = `
            <h3 style="color: ${COLORS.headingText}; border-bottom: 1px solid ${COLORS.headingText}; padding-bottom: 5px;">
                Mouse Actions & Skins
            </h3>
        `;
		buildMouseBindingsUI(mouseBindingsDiv);
		leftColumn.appendChild(mouseBindingsDiv);
		const hotkeysContainer = document.createElement("div");
		hotkeysContainer.style.marginBottom = "10px";
		hotkeysContainer.innerHTML = `
            <h3 style="color: ${COLORS.headingText}; border-bottom: 1px solid ${COLORS.headingText}; padding-bottom: 5px;">
                Hotkeys
            </h3>
        `;
		buildPCHotkeysUI(hotkeysContainer);
		leftColumn.appendChild(hotkeysContainer);
		const optionsContainer = document.createElement("div");
		optionsContainer.innerHTML = `
            <h3 style="color: ${COLORS.headingText}; border-bottom: 1px solid ${COLORS.headingText}; padding-bottom: 5px;">
                Game Options
            </h3>
        `;
		buildGameOptionsUI(optionsContainer);
		rightColumn.appendChild(optionsContainer);
		const playerDataContainer = document.createElement("div");
		playerDataContainer.innerHTML = `
            <h3 style="color: ${COLORS.headingText}; border-bottom: 1px solid ${COLORS.headingText}; padding-bottom: 5px;">
                Player Data & Skins
            </h3>
        `;
		buildPlayerDataButton(playerDataContainer);
		rightColumn.appendChild(playerDataContainer);
		const skinsLinkContainer = document.createElement("div");
		skinsLinkContainer.style.cssText = "margin-top: 20px;";
		const linkHeading = document.createElement("h4");
		linkHeading.textContent = "Free Skin URLs:";
		linkHeading.style.cssText = `color: ${COLORS.headingText}; margin-bottom: 5px; text-shadow: 1px 1px 1px grey;`;
		skinsLinkContainer.appendChild(linkHeading);
		const link1 = document.createElement("a");
		link1.href = "https://agario-skin.glitch.me/";
		link1.target = "_blank";
		link1.textContent = "https://agario-skin.glitch.me/";
		link1.style.cssText = `
    display: block; color: black; margin-bottom: 5px; text-decoration: underline; text-shadow: 1px 1px 1px grey;
`;
		skinsLinkContainer.appendChild(link1);
		const link2 = document.createElement("a");
		link2.href = "https://www.legendmod.ml/skins/";
		link2.target = "_blank";
		link2.textContent = "https://www.legendmod.ml/skins/";
		link2.style.cssText = `
    display: block; color: black; margin-bottom: 5px; text-decoration: underline; text-shadow: 1px 1px 1px grey;
`;
		skinsLinkContainer.appendChild(link2);
		const link3 = document.createElement("a");
		link3.href = "https://www.agario-skins.net/";
		link3.target = "_blank";
		link3.textContent = "https://www.agario-skins.net/";
		link3.style.cssText = `
    display: block; color: black; text-decoration: underline; text-shadow: 1px 1px 1px grey;
`;
		skinsLinkContainer.appendChild(link3);
		rightColumn.appendChild(skinsLinkContainer);
		const thanksSection = document.createElement("div");
		thanksSection.style.cssText = "margin-top: 10px;";
		const thanksHeader = document.createElement("h4");
		thanksHeader.textContent = "Special Thank You Note:";
		thanksHeader.style.cssText = `color: ${COLORS.headingText}; margin-bottom: 6px;`;
		thanksSection.appendChild(thanksHeader);
		const thanksNote = document.createElement("p");
		thanksNote.style.cssText = `color: ${COLORS.normalText}; font-style: italic;`;
		thanksNote.innerHTML =
			'Special thanks to <a href="https://imsolo.pro/web/" target="_blank" style="color: inherit; text-decoration: underline;">imsolo.pro/web</a> for helping me out – click their link for a different Agar.io game. ' +
			'Also, thanks to <a href="https://www.legendmod.ml/" target="_blank" style="color: inherit; text-decoration: underline;">legendmod.ml</a> for helping out. Check out their mod for chat and for playing in private servers. ' +
			'Special thanks to <a href="https://www.youtube.com/@BeeChasnyAgario" target="_blank" style="color: inherit; text-decoration: underline;">@BeeChasnyAgario</a> for sharing the first code I ever used – visit his ' +
			'<a href="https://www.youtube.com/@BeeChasnyAgario" target="_blank" style="color: inherit; text-decoration: underline;">YouTube channel</a> and Thank You to the ' +
			"Agar.io community.";
		thanksSection.appendChild(thanksNote);
		rightColumn.appendChild(thanksSection);
		document.body.appendChild(mainOverlay);
	}

	function toggleMainOverlay() {
		modUIVisible = !modUIVisible;
		if (mainOverlay) {
			mainOverlay.style.display = modUIVisible ? "block" : "none";
		}
		if (showControlsButton) {
			showControlsButton.textContent = modUIVisible
				? "Hide Controls"
				: "Show Controls";
		}
	}

	function buildMouseBindingsUI(container) {
		const wrapper = document.createElement("div");
		wrapper.style.cssText = "display: flex; flex-wrap: wrap; gap: 20px;";
		const mouseSection = document.createElement("div");
		mouseSection.style.cssText = "flex: 1; min-width: 100px;";
		const rowStyle =
			"display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;";
		const possibleActions = ["none", "singleFeed", "macroFeed", "split"];

		function makeDropdownRow(labelText, configKey) {
			const row = document.createElement("div");
			row.style.cssText = rowStyle;
			const lbl = document.createElement("label");
			lbl.textContent = labelText;
			lbl.style.cssText = `font-weight: bold; margin-right: 8px; color: ${COLORS.normalText};`;
			row.appendChild(lbl);
			const sel = document.createElement("select");
			sel.style.cssText = `
            flex:1; margin-left:10px; background:#f0f0f0; color:#000; border-radius:4px;
            border:1px solid #444; padding:8px; cursor: pointer; font-family: Arial, sans-serif;
        `;
			possibleActions.forEach((act) => {
				const opt = document.createElement("option");
				opt.value = act;
				opt.textContent = act;
				sel.appendChild(opt);
			});
			sel.value = CONFIG[configKey];
			sel.addEventListener("change", () => {
				CONFIG[configKey] = sel.value;
				saveConfig(CONFIG);
				showNotification(`${labelText} => ${sel.value}`);
			});
			row.appendChild(sel);
			return row;
		}
		mouseSection.appendChild(makeDropdownRow("Left Mouse", "leftMouseAction"));
		mouseSection.appendChild(
			makeDropdownRow("Middle Mouse", "middleMouseAction"),
		);
		mouseSection.appendChild(
			makeDropdownRow("Right Mouse", "rightMouseAction"),
		);
		wrapper.appendChild(mouseSection);
		const skinsSection = document.createElement("div");
		skinsSection.style.cssText = "flex: 1; min-width: 200px;";
		const namedSkinsLabel = document.createElement("label");
		namedSkinsLabel.textContent = "Free Named Skins List:";
		namedSkinsLabel.style.cssText = `
        display: block; margin-bottom: 3px; font-weight: bold; color: ${COLORS.normalText};
    `;
		skinsSection.appendChild(namedSkinsLabel);
		const namedSkinsSelect = document.createElement("select");
		namedSkinsSelect.style.cssText = `
        width: 50%; background:#f0f0f0; color: #000; border-radius: 4px;
        border:1px solid #444; padding:8px; margin-bottom: 15px; cursor: pointer;
    `;
		const skinNames = [
			"2Ch.Hk",
			"3Ezzy",
			"3Lk",
			"4Chan",
			"7Modka",
			"8",
			"9Gag",
			"Agar.ionews",
			"Agario",
			"Agarmurfs",
			"Albania",
			"Alejo",
			"Alejoyoutube",
			"Alejoyt",
			"Alejoyt2",
			"Araizon",
			"Argentina",
			"Ashwin",
			"Ashwinyt",
			"Australia",
			"Austria",
			"Ayy Lmao",
			"Babadook",
			"Bahrain",
			"Bait",
			"Bang",
			"Bangladesh",
			"Belgium",
			"Berlusconi",
			"Blatter",
			"Boris",
			"Bosnia",
			"Botswana",
			"Brax",
			"Brazil",
			"Bulba",
			"Bulgaria",
			"Bush",
			"Byzantium",
			"Cambodia",
			"Cameron",
			"Canada",
			"Chaplin",
			"Char",
			"Chavez",
			"Chile",
			"China",
			"Cia",
			"Clinton",
			"Colombia",
			"Croatia",
			"Crystal",
			"Cuba",
			"Demon",
			"Denmark",
			"Dilma",
			"Dna Clan",
			"Doge",
			"Ea",
			"Earth",
			"Egypt",
			"Estonia",
			"European Union",
			"Evilmonkey",
			"Facebook",
			"Facepunch",
			"Feminism",
			"Fidel",
			"Finland",
			"Football",
			"France",
			"French Kingdom",
			"Gdk Xmas",
			"German Empire",
			"Germany",
			"Getdeadkid",
			"Greece",
			"Guri",
			"Hero",
			"Hillary",
			"Hollande",
			"Hong Kong",
			"Hungary",
			"Imperial Japan",
			"India",
			"Indiana",
			"Indonesia",
			"Iran",
			"Iraq",
			"Ireland",
			"Irs",
			"Italy",
			"Jamaica",
			"Japan",
			"Jonnn",
			"Jordan",
			"Kbkb",
			"Kim Jong-Un",
			"Kristoffer",
			"Kurdistan",
			"Kuwait",
			"Latvia",
			"Lebanon",
			"Lithuania",
			"Luxembourg",
			"Majnoon",
			"Maldives",
			"Mars",
			"Matjoy",
			"Matriarchy",
			"Merkel",
			"Mexico",
			"Minhvu",
			"Mister",
			"Mistik",
			"Moon",
			"N0Psa",
			"Nasa",
			"Nbrhmi",
			"Netherlands",
			"Nigeria",
			"North Korea",
			"Norway",
			"Obama",
			"Origin",
			"Pakistan",
			"Palin",
			"Patriarchy",
			"Peru",
			"Piccolo",
			"Pika",
			"Pok",
			"Pokerface",
			"Pokyt",
			"Poland",
			"Portugal",
			"Prodota",
			"Prussia",
			"Qing Dynasty",
			"Quebec",
			"Queen",
			"Rayday",
			"Receita Federal",
			"Reddit",
			"Romania",
			"Sanik",
			"Sarok1",
			"Sarok2",
			"Saudi Arabia",
			"Scotland",
			"Sealand",
			"Silver",
			"Sir",
			"Sirius",
			"Skills",
			"Skillsyt",
			"Sneddy Gaming",
			"Somalia",
			"Sonic",
			"Sonicgames",
			"South Africa",
			"South Korea",
			"Spain",
			"Sparky",
			"Squi",
			"Stalin",
			"Statik",
			"Steam",
			"Strike",
			"Stussy",
			"Sweden",
			"Switzerland",
			"Taiwan",
			"Texas",
			"Thailand",
			"Timid",
			"Togoman",
			"Togomanyt",
			"Trump",
			"Tsipras",
			"Tumblr",
			"Turkey",
			"Twisted",
			"Tyt",
			"Uae",
			"Ukraine",
			"United Kingdom",
			"Usa",
			"Varoufakis",
			"Venezuela",
			"Vinesauce",
			"Wojak",
			"Woobs",
			"Xxnetro",
			"Xxnetro2",
			"Yaranaika",
			"Yemeni",
			"Yemeniyt",
			"Zanax",
			"Zone",
		];
		namedSkinsSelect.innerHTML = "";
		skinNames.forEach((name) => {
			const option = document.createElement("option");
			option.value = name;
			option.textContent = name;
			namedSkinsSelect.appendChild(option);
		});
		skinsSection.appendChild(namedSkinsSelect);
		const copySkinButton = document.createElement("button");
		copySkinButton.textContent = "Copy Name";
		copySkinButton.style.cssText = `
    margin-top: 3px;
    cursor: pointer;
    background-color: #54c800;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background-color 0.2s ease;
`;
		copySkinButton.addEventListener("mouseover", () => {
			copySkinButton.style.backgroundColor = "#45a800";
		});
		copySkinButton.addEventListener("mouseout", () => {
			copySkinButton.style.backgroundColor = "#54c800";
		});
		copySkinButton.addEventListener("mousedown", () => {
			copySkinButton.style.backgroundColor = "#357f00";
		});
		copySkinButton.addEventListener("mouseup", () => {
			copySkinButton.style.backgroundColor = "#45a800";
		});
		copySkinButton.addEventListener("click", () => {
			const selectedSkin = namedSkinsSelect.value;
			navigator.clipboard
				.writeText(selectedSkin)
				.then(() => {
					showNotification(`Copied skin name: ${selectedSkin}`);
					copySkinButton.style.backgroundColor = "#357f00";
					setTimeout(() => {
						copySkinButton.style.backgroundColor = "#54c800";
					}, 300);
				})
				.catch((err) => showNotification(`Failed to copy skin name: ${err}`));
		});
		skinsSection.appendChild(copySkinButton);
		const emojiLabel = document.createElement("label");
		emojiLabel.textContent = "Emoji List:";
		emojiLabel.style.cssText = `
        display: block; margin-bottom: 3px; font-weight: bold; color: ${COLORS.normalText};
    `;
		skinsSection.appendChild(emojiLabel);
		const emojiSelect = document.createElement("select");
		emojiSelect.style.cssText = `
        width: 30%; background:#f0f0f0; color: #000; border-radius: 4px;
        border:1px solid #444; padding:8px; cursor: pointer;
    `;
		const emojis = [
			"😀",
			"😂",
			"🤣",
			"😊",
			"😍",
			"😘",
			"😜",
			"🤪",
			"😎",
			"😏",
			"😢",
			"😭",
			"😡",
			"👍",
			"👏",
			"🙏",
			"💯",
			"🎉",
			"❤️",
			"🧡",
			"💛",
			"💚",
			"💙",
			"💜",
			"🤍",
			"🤎",
			"🥰",
			"🤗",
			"🤩",
			"🥳",
			"🤔",
			"🤭",
			"🤫",
			"🤯",
			"😤",
			"😴",
			"😇",
			"😲",
			"🤤",
			"😋",
			"🤠",
			"😺",
			"😻",
			"😼",
			"😽",
			"😹",
			"😿",
			"😸",
			"🙀",
			"😾",
		];
		emojiSelect.innerHTML = "";
		emojis.forEach((emoji) => {
			const option = document.createElement("option");
			option.value = emoji;
			option.textContent = emoji;
			emojiSelect.appendChild(option);
		});
		skinsSection.appendChild(emojiSelect);
		const copyEmojiButton = document.createElement("button");
		copyEmojiButton.textContent = "Copy Emoji";
		copyEmojiButton.style.cssText = `
    margin-top: 3px;
    cursor: pointer;
    background-color: #54c800;
    color: white;
    font-weight: bold;
    border: none;
    border-radius: 5%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background-color 0.2s ease;
`;
		copyEmojiButton.addEventListener("mouseover", () => {
			copyEmojiButton.style.backgroundColor = "#45a800";
		});
		copyEmojiButton.addEventListener("mouseout", () => {
			copyEmojiButton.style.backgroundColor = "#54c800";
		});
		copyEmojiButton.addEventListener("mousedown", () => {
			copyEmojiButton.style.backgroundColor = "#357f00";
		});
		copyEmojiButton.addEventListener("mouseup", () => {
			copyEmojiButton.style.backgroundColor = "#45a800";
		});
		copyEmojiButton.addEventListener("click", () => {
			const selectedEmoji = emojiSelect.value;
			navigator.clipboard
				.writeText(selectedEmoji)
				.then(() => {
					showNotification(`Copied emoji: ${selectedEmoji}`);
					copyEmojiButton.style.backgroundColor = "#357f00";
					setTimeout(() => {
						copyEmojiButton.style.backgroundColor = "#54c800";
					}, 300);
				})
				.catch((err) => showNotification(`Failed to copy emoji: ${err}`));
		});
		skinsSection.appendChild(copyEmojiButton);
		wrapper.appendChild(skinsSection);
		container.appendChild(wrapper);
	}

	function buildPCHotkeysUI(container) {
		const keysToDisplay = [
			{
				label: "Single Feed",
				key: "singleFeedKey",
			},
			{
				label: "Macro Feed",
				key: "macroFeedKey",
			},
			{
				label: "Double Split",
				key: "doubleSplitKey",
			},
			{
				label: "Triple Split",
				key: "tripleSplitKey",
			},
			{
				label: "Quad Split",
				key: "quadSplitKey",
			},
			{
				label: "Vertical Split",
				key: "verticalSplitKey",
			},
			{
				label: "Vertical Line",
				key: "verticalLineKey",
			},
			{
				label: "Skin Switcher",
				key: "skinSwitcherKey",
			},
			{
				label: "Toggle UI",
				key: "toggleUIKey",
			},
			{
				label: "Pause Movement",
				key: "pauseMovementKey",
			},
		];
		const hotkeyWrapper = document.createElement("div");
		hotkeyWrapper.style.cssText = "display: flex; gap: 20px;";
		container.appendChild(hotkeyWrapper);
		const hotkeyColumn = document.createElement("div");
		hotkeyColumn.style.cssText = "flex: 3;";
		hotkeyWrapper.appendChild(hotkeyColumn);
		const specialColumn = document.createElement("div");
		specialColumn.style.cssText = "flex: 1;";
		hotkeyWrapper.appendChild(specialColumn);
		keysToDisplay.forEach((item) => {
			hotkeyColumn.appendChild(createHotkeyRow(item.label, item.key));
		});
		const specialHeading = document.createElement("div");
		specialHeading.textContent = "Special Functions";
		specialHeading.style.cssText = `
        font-weight: bold;
        margin-bottom: 15px;
        color: ${COLORS.normalText};
        font-size: 16px;
        padding-bottom: 5px;
        border-bottom: 1px solid rgba(0,0,0,0.1);
    `;
		specialColumn.appendChild(specialHeading);
		const offersToggleRow = document.createElement("div");
		offersToggleRow.style.cssText = `
        padding: 5px;
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    `;
		const offersLabel = document.createElement("span");
		offersLabel.textContent = "Activate All Offers";
		offersLabel.style.cssText = `font-weight: bold; color: ${COLORS.normalText};`;
		offersToggleRow.appendChild(offersLabel);
		const toggleSwitch = document.createElement("label");
		toggleSwitch.style.cssText = `
        position: relative; display: inline-block; width:60px; height:30px; cursor: pointer;
    `;
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = CONFIG.activateAllOffers;
		checkbox.style.cssText = "opacity:0; width:0; height:0;";
		toggleSwitch.appendChild(checkbox);
		const slider = document.createElement("span");
		slider.style.cssText = `
        position:absolute; top:0; left:0; right:0; bottom:0; transition:0.4s; border-radius:30px;
        background-color:${CONFIG.activateAllOffers ? COLORS.buttonBg : COLORS.sliderOff};
    `;
		const circle = document.createElement("span");
		circle.style.cssText = `
        position:absolute; content:''; height:22px; width:22px; bottom:4px;
        left:${CONFIG.activateAllOffers ? "34px" : "4px"};
        background-color:#fff; transition:0.4s; border-radius:50%;
    `;
		slider.appendChild(circle);
		toggleSwitch.appendChild(slider);
		checkbox.addEventListener("change", function () {
			CONFIG.activateAllOffers = this.checked;
			slider.style.backgroundColor = this.checked
				? COLORS.buttonBg
				: COLORS.sliderOff;
			circle.style.left = this.checked ? "34px" : "4px";
			saveConfig(CONFIG);
			if (this.checked) {
				console.log(
					"ActivateAllOffers slider ON: trying MC.activateAllOffers()...",
				);
				try {
					if (
						typeof MC !== "undefined" &&
						typeof MC.activateAllOffers === "function"
					) {
						MC.activateAllOffers();
						showNotification("All Offers Activated!");
					} else {
						console.warn("MC.activateAllOffers() not found.");
						showNotification("MC.activateAllOffers() not found in console.");
					}
				} catch (err) {
					console.error("Error calling MC.activateAllOffers():", err);
				}
			}
		});
		offersToggleRow.appendChild(toggleSwitch);
		specialColumn.appendChild(offersToggleRow);
		specialColumn.appendChild(
			createFunctionToggle("Auto Coin Collector", "autoCoinCollector"),
		);
		specialColumn.appendChild(
			createFunctionToggle("Potion Opener", "potionOpener"),
		);
		specialColumn.appendChild(
			createFunctionToggle("Sync Username/Picture", "hideUserInfo"),
		);
		specialColumn.appendChild(
			createFunctionToggle("Change Theme", "changeTheme"),
		);
		specialColumn.appendChild(
			createFunctionToggle("Auto Reenter", "autoRespawn"),
		);
		specialColumn.appendChild(
			createFunctionToggle("Hide Toasters", "hideToasters"),
		);

		const serverInfoRow = document.createElement("div");
		serverInfoRow.style.cssText = `
        padding: 10px;
        background: rgba(255,255,255,0.05);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
    `;
		const serverLabel = document.createElement("span");
		serverLabel.textContent = "Your Game Server:";
		serverLabel.style.cssText = `
        font-weight: bold;
        color: ${COLORS.normalText};
        margin-bottom: 8px;
    `;
		serverInfoRow.appendChild(serverLabel);
		const serverDisplay = document.createElement("div");
		serverDisplay.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
		const serverInfo = document.createElement("input");
		serverInfo.id = "server-info";
		serverInfo.readOnly = true;
		serverInfo.style.cssText = `
        flex: 1;
        padding: 8px;
        margin-right: 10px;
        border: 1px solid #777;
        border-radius: 4px;
        background: #f0f0f0;
        color: #333;
        font-family: monospace;
        font-size: 12px;
    `;
		const refreshBtn = document.createElement("button");
		refreshBtn.textContent = "🔄";
		refreshBtn.title = "Refresh Server Info";
		refreshBtn.style.cssText = `
        background-color: ${COLORS.buttonBg};
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;
    `;
		refreshBtn.addEventListener("mouseover", () => {
			refreshBtn.style.backgroundColor = COLORS.buttonBgPress;
		});
		refreshBtn.addEventListener("mouseout", () => {
			refreshBtn.style.backgroundColor = COLORS.buttonBg;
		});
		const copyBtn = document.createElement("button");
		copyBtn.textContent = "📋";
		copyBtn.title = "Copy Server Info";
		copyBtn.style.cssText = `
        background-color: ${COLORS.buttonBg};
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
        font-weight: bold;
        margin-left: 5px;
        transition: background-color 0.2s;
    `;
		copyBtn.addEventListener("mouseover", () => {
			copyBtn.style.backgroundColor = COLORS.buttonBgPress;
		});
		copyBtn.addEventListener("mouseout", () => {
			copyBtn.style.backgroundColor = COLORS.buttonBg;
		});
		serverDisplay.appendChild(serverInfo);
		serverDisplay.appendChild(refreshBtn);
		serverDisplay.appendChild(copyBtn);
		serverInfoRow.appendChild(serverDisplay);
		const helpText = document.createElement("div");
		helpText.textContent = "Share this with friends to play on the same server";
		helpText.style.cssText = `
        font-size: 12px;
        color: #888;
        margin-top: 5px;
        font-style: italic;
    `;
		serverInfoRow.appendChild(helpText);

		refreshBtn.addEventListener("click", () => {
			try {
				if (typeof MC !== "undefined" && typeof MC.getHost === "function") {
					const serverAddress = MC.getHost();
					let displayAddress = serverAddress;
					if (
						displayAddress.includes(
							"web-arenas-live-v25-0.agario.miniclippt.com/",
						)
					) {
						const parts = displayAddress.split("/");
						displayAddress = parts[parts.length - 1] || displayAddress;
					}
					serverInfo.value = displayAddress;
					showNotification("Server info updated!");
				} else {
					console.warn("MC.getHost() not found.");
					serverInfo.value = "Server info not available";
					showNotification("Server info not available");
				}
			} catch (err) {
				console.error("Error getting server info:", err);
				serverInfo.value = "Error: " + err.message;
			}
		});
		copyBtn.addEventListener("click", () => {
			if (serverInfo.value) {
				navigator.clipboard
					.writeText(serverInfo.value)
					.then(() => {
						showNotification("Server info copied to clipboard!");
						copyBtn.style.backgroundColor = COLORS.buttonBgPress;
						setTimeout(() => {
							copyBtn.style.backgroundColor = COLORS.buttonBg;
						}, 300);
					})
					.catch((err) => {
						showNotification("Failed to copy: " + err);
					});
			} else {
				showNotification("No server info to copy");
			}
		});
		setTimeout(() => {
			try {
				if (typeof MC !== "undefined" && typeof MC.getHost === "function") {
					const serverAddress = MC.getHost();
					let displayAddress = serverAddress;
					if (
						displayAddress.includes(
							"web-arenas-live-v25-0.agario.miniclippt.com/",
						)
					) {
						const parts = displayAddress.split("/");
						displayAddress = parts[parts.length - 1] || displayAddress;
					}
					serverInfo.value = displayAddress;
				} else {
					serverInfo.value = "Click refresh to check";
				}
			} catch (err) {
				serverInfo.value = "Click refresh to check";
			}
		}, 1000);
		specialColumn.appendChild(serverInfoRow);
	}

	function createHotkeyRow(label, configKey) {
		const row = document.createElement("div");
		row.style.cssText = "display:flex; align-items:center; margin-bottom:8px;";
		const lbl = document.createElement("span");
		lbl.textContent = label + ": ";
		lbl.style.cssText = `width: 100px; color: ${COLORS.normalText};`;
		row.appendChild(lbl);
		const inp = document.createElement("input");
		inp.type = "text";
		inp.readOnly = true;
		inp.value = CONFIG[configKey];
		inp.style.cssText = `
            width: 40px; text-align:center; border:1px solid #777;
            border-radius:3px; background:#f0f0f0; color:black; cursor:pointer;
            padding: 5px; font-family: Arial, sans-serif;
        `;
		row.appendChild(inp);
		let waitingForKey = false;
		inp.addEventListener("focus", () => {
			isInputFocused = true;
		});
		inp.addEventListener("blur", () => {
			setTimeout(() => {
				isInputFocused = false;
			}, 100);
		});
		inp.addEventListener("click", () => {
			waitingForKey = true;
			inp.value = "???";
			inp.focus();
		});
		inp.addEventListener("keydown", (evt) => {
			if (!waitingForKey) return;
			evt.preventDefault();
			evt.stopPropagation();
			const newKey = evt.key.toLowerCase();
			CONFIG[configKey] = newKey;
			inp.value = newKey;
			waitingForKey = false;
			saveConfig(CONFIG);
			showNotification(`${label} => ${newKey.toUpperCase()}`);
		});
		return row;
	}

	function buildGameOptionsUI(container) {
		container.appendChild(
			createToggleRow(
				"Acid Mode",
				"Enable colorful visual effects",
				CONFIG.enableAcidMode,
				function () {
					CONFIG.enableAcidMode = this.checked;
					toggleAcidMode(this.checked);
				},
			),
		);
		container.appendChild(
			createToggleRow(
				"Show FPS Counter",
				"Display frames per second counter",
				CONFIG.showFpsCounter,
				function () {
					CONFIG.showFpsCounter = this.checked;
					updateFpsCounter();
					saveConfig(CONFIG);
				},
			),
		);
		container.appendChild(
			createToggleRow(
				"Unlimited FPS",
				"Remove 60 FPS cap (may cause higher CPU/GPU usage)",
				CONFIG.unlimitedFps,
				function () {
					setUnlimitedFps(this.checked);
				},
			),
		);
		container.appendChild(
			createToggleRow(
				"Show Minimap",
				"Display the game minimap",
				CONFIG.enableMinimap,
				function () {
					CONFIG.enableMinimap = this.checked;
					toggleMinimap(this.checked);
				},
			),
		);
		container.appendChild(
			createToggleRow(
				"Players on Minimap",
				"Show other players on the minimap",
				CONFIG.showPlayersOnMap,
				function () {
					CONFIG.showPlayersOnMap = this.checked;
					togglePlayersOnMap(this.checked);
				},
			),
		);
	}

	function createToggleRow(label, description, isChecked, onChange) {
		const row = document.createElement("div");
		row.style.cssText = `
            margin-bottom:15px; background: rgba(255,255,255,0.05);
padding: 10px; border-radius: 5px;
`;
		const labelDiv = document.createElement("div");
		labelDiv.style.cssText =
			"display:flex; justify-content:space-between; margin-bottom:5px;";
		const labelSpan = document.createElement("span");
		labelSpan.textContent = label;
		labelSpan.style.cssText = `font-weight: bold; color: ${COLORS.normalText};`;
		labelDiv.appendChild(labelSpan);
		const toggleSwitch = document.createElement("label");
		toggleSwitch.style.cssText = `
            position: relative; display: inline-block; width:60px; height:30px; cursor: pointer;
`;
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = isChecked;
		checkbox.style.cssText = "opacity:0; width:0; height:0;";
		checkbox.addEventListener("change", onChange);
		const slider = document.createElement("span");
		slider.style.cssText = `
            position:absolute; top:0; left:0; right:0; bottom:0;
background-color:${isChecked ? COLORS.buttonBg : COLORS.sliderOff};
transition:0.4s; border-radius:30px;
`;
		const circle = document.createElement("span");
		circle.style.cssText = `
            position:absolute; content:''; height:22px; width:22px; bottom:4px;
left:${isChecked ? "34px" : "4px"};
background-color:white; transition:0.4s; border-radius:50%;
`;
		slider.appendChild(circle);
		toggleSwitch.appendChild(checkbox);
		toggleSwitch.appendChild(slider);
		checkbox.addEventListener("change", function () {
			slider.style.backgroundColor = this.checked
				? COLORS.buttonBg
				: COLORS.sliderOff;
			circle.style.left = this.checked ? "34px" : "4px";
		});
		labelDiv.appendChild(toggleSwitch);
		row.appendChild(labelDiv);
		if (description) {
			const desc = document.createElement("div");
			desc.style.cssText = `font-size:14px; color:#000; margin-top:5px;`;
			desc.textContent = description;
			row.appendChild(desc);
		}
		return row;
	}

	function buildPlayerDataButton(container) {
		const btn = document.createElement("button");
		btn.textContent = "Open Player Data & Skins Manager";
		btn.style.cssText = `
        background-color: blue;
color: white;
font-weight: bold;
border: none;
border-radius: 5px;
padding: 10px 15px;
width: 100%;
font-size: 24px;
margin-top: 10px;
cursor: pointer;
transition: background-color 0.2s ease;
`;
		btn.addEventListener("mouseover", () => {
			btn.style.backgroundColor = "#1E90FF";
		});
		btn.addEventListener("mouseout", () => {
			btn.style.backgroundColor = "#4169E1";
		});
		btn.addEventListener("mousedown", () => {
			btn.style.backgroundColor = "#0000CD";
		});
		btn.addEventListener("mouseup", () => {
			btn.style.backgroundColor = "#1E90FF";
		});
		btn.addEventListener("click", openPlayerDataManager);
		const description = document.createElement("p");
		description.textContent =
			"View player names and manage custom skins for yourself and other players.";
		description.style.cssText = `
        font-size: 16px;
margin-top: 10px;
color: ${TEXT_COLOR};
`;
		container.appendChild(btn);
		container.appendChild(description);
	}
	let playerDataManager = null;

	function openPlayerDataManager() {
		if (mainOverlay) {
			mainOverlay.style.display = "none";
			modUIVisible = false;
			if (showControlsButton) {
				showControlsButton.textContent = "Show Controls";
			}
		}
		if (playerDataManager) {
			playerDataManager.style.display = "block";
			return;
		}
		playerDataManager = document.createElement("div");
		playerDataManager.id = "player-data-manager";
		playerDataManager.style.cssText = `
        position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 900px;
max-width: 90vw;
height: 600px;
max-height: 90vh;
background-color: ${BACKGROUND_COLOR};
border-radius: 10px;
padding: 20px;
z-index: 1000000;
color: ${TEXT_COLOR};
font-family: Arial, sans-serif;
display: flex;
flex-direction: column;
box-shadow: 0 0 20px rgba(0,0,0,0.7);
`;
		const header = document.createElement("div");
		header.style.cssText = `
        display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
`;
		const title = document.createElement("h2");
		title.textContent = "Player Data & Skins Manager";
		title.style.cssText = `
        margin: 0;
font-size: ${FONT_SIZE};
color: ${TEXT_COLOR};
`;
		header.appendChild(title);
		const closeBtn = document.createElement("button");
		closeBtn.textContent = "X";
		closeBtn.style.cssText = `
        background: none;
border: 2px solid #f33;
color: #f33;
width: 30px;
height: 30px;
font-size: 18px;
border-radius: 50%;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s;
`;
		closeBtn.addEventListener("mouseover", () => {
			closeBtn.style.backgroundColor = "#f33";
			closeBtn.style.color = "#fff";
		});
		closeBtn.addEventListener("mouseout", () => {
			closeBtn.style.backgroundColor = "transparent";
			closeBtn.style.color = "#f33";
		});
		closeBtn.onclick = () => {
			playerDataManager.style.display = "none";
			isInputFocused = false;
		};
		header.appendChild(closeBtn);
		playerDataManager.appendChild(header);
		const contentContainer = document.createElement("div");
		contentContainer.style.cssText = `
        display: flex;
flex: 1;
gap: 20px;
height: calc(100% - 70px);
`;
		playerDataManager.appendChild(contentContainer);
		const leftColumn = document.createElement("div");
		leftColumn.style.cssText =
			"flex: 1; display: flex; flex-direction: column; height: 100%;";
		contentContainer.appendChild(leftColumn);
		buildPlayerNamesSection(leftColumn);
		const rightColumn = document.createElement("div");
		rightColumn.style.cssText =
			"flex: 1; display: flex; flex-direction: column; height: 100%;";
		contentContainer.appendChild(rightColumn);
		buildSkinsSection(rightColumn);
		document.body.appendChild(playerDataManager);
		updatePlayerDataDisplays();
	}

	function buildPlayerNamesSection(container) {
		const nameHeader = document.createElement("h3");
		nameHeader.textContent = "Player Names";
		nameHeader.style.cssText = `
        margin-top: 0;
font-size: ${FONT_SIZE};
color: ${TEXT_COLOR};
border-bottom: 2px solid ${TAB_ACTIVE_COLOR};
padding-bottom: 5px;
`;
		container.appendChild(nameHeader);
		const tabsContainer = document.createElement("div");
		tabsContainer.style.cssText = "display: flex; margin-bottom: 15px;";

		function createTab(text, isActive = false) {
			const tab = document.createElement("div");
			tab.textContent = text;
			tab.style.cssText = `
            padding: 8px 15px;
cursor: pointer;
border-radius: 4px 4px 0 0;
margin-right: 5px;
transition: background-color 0.2s;
font-size: 18px;
background-color: ${isActive ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR};
color: #fff;
`;
			return tab;
		}
		const leaderboardTab = createTab("Leaderboard", true);
		const cellNamesTab = createTab("Cell Names");
		const scoreTab = createTab("Your Score");
		tabsContainer.appendChild(leaderboardTab);
		tabsContainer.appendChild(cellNamesTab);
		tabsContainer.appendChild(scoreTab);
		container.appendChild(tabsContainer);
		const leaderboardContent = document.createElement("div");
		leaderboardContent.id = "leaderboard-content";
		leaderboardContent.style.cssText = `
        flex: 1;
overflow-y: auto;
background-color: #f2f2f2;
padding: 10px;
border-radius: 4px;
margin-bottom: 10px;
`;
		const cellNamesContent = document.createElement("div");
		cellNamesContent.id = "cell-names-content";
		cellNamesContent.style.cssText = `
        display: none;
flex: 1;
overflow-y: auto;
background-color: #f2f2f2;
padding: 10px;
border-radius: 4px;
margin-bottom: 10px;
`;
		const scoreContent = document.createElement("div");
		scoreContent.id = "score-content";
		scoreContent.style.cssText = `
        display: none;
flex: 1;
overflow-y: auto;
background-color: #f2f2f2;
padding: 10px;
border-radius: 4px;
margin-bottom: 10px;
`;
		container.appendChild(leaderboardContent);
		container.appendChild(cellNamesContent);
		container.appendChild(scoreContent);
		leaderboardTab.addEventListener("click", () => {
			leaderboardTab.style.backgroundColor = TAB_ACTIVE_COLOR;
			cellNamesTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			scoreTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			leaderboardContent.style.display = "block";
			cellNamesContent.style.display = "none";
			scoreContent.style.display = "none";
		});
		cellNamesTab.addEventListener("click", () => {
			leaderboardTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			cellNamesTab.style.backgroundColor = TAB_ACTIVE_COLOR;
			scoreTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			leaderboardContent.style.display = "none";
			cellNamesContent.style.display = "block";
			scoreContent.style.display = "none";
		});
		scoreTab.addEventListener("click", () => {
			leaderboardTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			cellNamesTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			scoreTab.style.backgroundColor = TAB_ACTIVE_COLOR;
			leaderboardContent.style.display = "none";
			cellNamesContent.style.display = "none";
			scoreContent.style.display = "block";
		});
		const refreshBtnContainer = document.createElement("div");
		refreshBtnContainer.style.cssText =
			"display: flex; justify-content: flex-end; margin-top: 10px;";
		const refreshBtn = document.createElement("button");
		refreshBtn.textContent = "Refresh Data";
		refreshBtn.style.cssText = `
        background-color: ${TAB_INACTIVE_COLOR};
color: #fff;
border: none;
border-radius: 4px;
padding: 8px 15px;
cursor: pointer;
font-size: 16px;
`;
		refreshBtn.addEventListener("click", updatePlayerDataDisplays);
		refreshBtn.addEventListener("mouseover", () => {
			refreshBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		refreshBtn.addEventListener("mouseout", () => {
			refreshBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
		});
		refreshBtnContainer.appendChild(refreshBtn);
		container.appendChild(refreshBtnContainer);
	}

	function buildSkinsSection(container) {
		const skinsHeader = document.createElement("h3");
		skinsHeader.textContent = "Skins Manager";
		skinsHeader.style.cssText = `
        margin-top: 0;
font-size: ${FONT_SIZE};
color: ${TEXT_COLOR};
border-bottom: 2px solid ${TAB_ACTIVE_COLOR};
padding-bottom: 5px;
`;
		container.appendChild(skinsHeader);
		const tabsContainer = document.createElement("div");
		tabsContainer.style.cssText = "display: flex; margin-bottom: 15px;";

		function createTab(text, isActive = false) {
			const tab = document.createElement("div");
			tab.textContent = text;
			tab.style.cssText = `
            padding: 8px 15px;
cursor: pointer;
border-radius: 4px 4px 0 0;
margin-right: 5px;
transition: background-color 0.2s;
font-size: 18px;
background-color: ${isActive ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR};
color: #fff;
`;
			return tab;
		}
		const yourSkinTab = createTab("Your Skin", true);
		const enemySkinTab = createTab("Enemy Skins");
		tabsContainer.appendChild(yourSkinTab);
		tabsContainer.appendChild(enemySkinTab);
		container.appendChild(tabsContainer);
		const yourSkinContent = document.createElement("div");
		yourSkinContent.id = "your-skin-content";
		yourSkinContent.style.cssText = `
        display: flex;
flex-direction: column;
flex: 1;
overflow-y: auto;
background-color: #f2f2f2;
padding: 15px;
border-radius: 4px;
margin-bottom: 10px;
`;
		const enemySkinContent = document.createElement("div");
		enemySkinContent.id = "enemy-skin-content";
		enemySkinContent.style.cssText = `
        display: none;
flex-direction: column;
flex: 1;
overflow-y: auto;
background-color: #f2f2f2;
padding: 15px;
border-radius: 4px;
margin-bottom: 10px;
`;
		container.appendChild(yourSkinContent);
		container.appendChild(enemySkinContent);
		yourSkinTab.addEventListener("click", () => {
			yourSkinTab.style.backgroundColor = TAB_ACTIVE_COLOR;
			enemySkinTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			yourSkinContent.style.display = "flex";
			enemySkinContent.style.display = "none";
		});
		enemySkinTab.addEventListener("click", () => {
			yourSkinTab.style.backgroundColor = TAB_INACTIVE_COLOR;
			enemySkinTab.style.backgroundColor = TAB_ACTIVE_COLOR;
			yourSkinContent.style.display = "none";
			enemySkinContent.style.display = "flex";
		});
		buildYourSkinUI(yourSkinContent);
		buildEnemySkinUI(enemySkinContent);
		const openSkinSitesBtn = document.createElement("button");
		openSkinSitesBtn.textContent = "Open Additional Skin Pages";
		openSkinSitesBtn.style.cssText = `
        background-color: ${TAB_INACTIVE_COLOR};
color: #fff;
border: none;
border-radius: 4px;
padding: 8px 15px;
cursor: pointer;
font-size: 16px;
margin-top: 10px;
font-weight: bold;
`;
		openSkinSitesBtn.addEventListener("mouseover", () => {
			openSkinSitesBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		openSkinSitesBtn.addEventListener("mouseout", () => {
			openSkinSitesBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
		});
		openSkinSitesBtn.addEventListener("click", openSkinSitesPopup);
		container.appendChild(openSkinSitesBtn);
	}

	function openSkinSitesPopup() {
		let existing = document.getElementById("skin-sites-popup");
		if (existing) {
			existing.style.display = "block";
			return;
		}
		const popup = document.createElement("div");
		popup.id = "skin-sites-popup";
		popup.style.cssText = `
        position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 1000px;
max-width: 90vw;
height: 600px;
max-height: 90vh;
background-color: ${BACKGROUND_COLOR};
border-radius: 10px;
padding: 20px;
z-index: 1000001;
color: ${TEXT_COLOR};
font-family: Arial, sans-serif;
display: flex;
flex-direction: column;
box-shadow: 0 0 20px rgba(0,0,0,0.7);
`;
		document.body.appendChild(popup);
		const header = document.createElement("div");
		header.style.cssText = `
        display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 20px;
`;
		popup.appendChild(header);
		const title = document.createElement("h2");
		title.textContent = "Additional Skin Pages";
		title.style.cssText = `
        margin: 0;
font-size: ${FONT_SIZE};
color: ${TEXT_COLOR};
`;
		header.appendChild(title);
		const closeBtn = document.createElement("button");
		closeBtn.textContent = "X";
		closeBtn.style.cssText = `
        background: none;
border: 2px solid #f33;
color: #f33;
width: 30px;
height: 30px;
font-size: 18px;
border-radius: 50%;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: all 0.2s;
`;
		closeBtn.addEventListener("mouseover", () => {
			closeBtn.style.backgroundColor = "#f33";
			closeBtn.style.color = "#fff";
		});
		closeBtn.addEventListener("mouseout", () => {
			closeBtn.style.backgroundColor = "transparent";
			closeBtn.style.color = "#f33";
		});
		closeBtn.onclick = () => {
			popup.style.display = "none";
		};
		header.appendChild(closeBtn);
		const tabContainer = document.createElement("div");
		tabContainer.style.cssText =
			"display: flex; gap: 10px; margin-bottom: 15px;";
		popup.appendChild(tabContainer);
		const iframeContainer = document.createElement("div");
		iframeContainer.style.cssText = `
        flex: 1;
border: 2px solid ${TAB_ACTIVE_COLOR};
border-radius: 5px;
overflow: hidden;
position: relative;
`;
		popup.appendChild(iframeContainer);
		const sites = [
			{
				name: "Current Skins",
				url: "https://agario-skin.glitch.me/index.html",
				type: "iframe",
			},
			{
				name: "Og Skins",
				url: "https://agario-skin.glitch.me/og-skins.html",
				type: "iframe",
			},
			{
				name: "Ur Skins",
				url: "",
				type: "custom",
			},
			{
				name: "Enemy List",
				url: "",
				type: "custom",
			},
		];
		let currentView = null;
		sites.forEach((site, i) => {
			const tabBtn = document.createElement("button");
			tabBtn.textContent = site.name;
			tabBtn.style.cssText = `
            background-color: ${i === 0 ? TAB_ACTIVE_COLOR : TAB_INACTIVE_COLOR};
color: #fff;
border: none;
padding: 10px 20px;
border-radius: 4px 4px 0 0;
cursor: pointer;
font-size: 16px;
`;
			tabBtn.addEventListener("mouseover", () => {
				if (tabBtn.style.backgroundColor !== TAB_ACTIVE_COLOR) {
					tabBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
					tabBtn.style.color = "#fff";
				}
			});
			tabBtn.addEventListener("mouseout", () => {
				if (currentView !== site) {
					tabBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
					tabBtn.style.color = "#fff";
				}
			});
			tabBtn.addEventListener("click", () => {
				if (site.type === "iframe") {
					switchIframe(site.url);
				} else if (site.type === "custom") {
					if (site.name === "Enemy List") {
						showEnemySkinsList();
					} else if (site.name === "Ur Skins") {
						showUrSkins();
					}
				}
				Array.from(tabContainer.children).forEach((btn) => {
					btn.style.backgroundColor = TAB_INACTIVE_COLOR;
				});
				tabBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
				currentView = site;
			});
			tabContainer.appendChild(tabBtn);
			if (i === 0) {
				switchIframe(site.url);
				currentView = site;
			}
		});

		function switchIframe(url) {
			iframeContainer.innerHTML = "";
			if (url) {
				const iframe = document.createElement("iframe");
				iframe.src = url;
				iframe.style.cssText = `
            width: 100%;
            height: 500px;
border: none;
`;
				iframe.setAttribute("allow", "clipboard-read; clipboard-write");
				iframeContainer.appendChild(iframe);
			}
		}

		function showUrSkins() {
			iframeContainer.innerHTML = "";
			const savedSkinsContainer = document.createElement("div");
			savedSkinsContainer.style.cssText = `
        width: 100%;
        height: 500px;
padding: 15px;
overflow-y: auto;
background-color: #f8f8f8;
`;
			const listHeader = document.createElement("h3");
			listHeader.textContent = "Your Saved Skins";
			listHeader.style.cssText = `
        color: ${TAB_ACTIVE_COLOR};
font-size: 24px;
margin-bottom: 20px;
border-bottom: 2px solid ${TAB_ACTIVE_COLOR};
padding-bottom: 10px;
`;
			savedSkinsContainer.appendChild(listHeader);
			const galleryGrid = document.createElement("div");
			galleryGrid.style.cssText = `
        display: grid;
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
gap: 15px;
padding: 10px;
`;
			const skins = loadSkinsFromStorage();
			if (skins.length === 0) {
				const emptyMsg = document.createElement("p");
				emptyMsg.textContent = "No skins saved yet.";
				emptyMsg.style.cssText =
					"grid-column: 1 / -1; text-align: center; color: #555; font-size: 18px;";
				galleryGrid.appendChild(emptyMsg);
			} else {
				skins.forEach((url, index) => {
					const item = document.createElement("div");
					item.style.cssText = `
                width: 100%;
                aspect-ratio: 1;
border-radius: 8px;
overflow: hidden;
position: relative;
border: 2px solid #999;
background: #ddd;
cursor: pointer;
`;
					const img = document.createElement("img");
					img.src = url;
					img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
					img.onerror = () => {
						img.src =
							"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
					};
					item.appendChild(img);
					const overlay = document.createElement("div");
					overlay.style.cssText = `
                position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.7);
display: flex;
justify-content: center;
align-items: center;
opacity: 0;
transition: opacity 0.2s;
`;
					item.appendChild(overlay);
					const btnContainer = document.createElement("div");
					btnContainer.style.cssText =
						"display: flex; gap: 5px; flex-direction: column;";
					overlay.appendChild(btnContainer);
					const useBtn = document.createElement("button");
					useBtn.textContent = "✓ Use";
					useBtn.title = "Use Skin";
					useBtn.style.cssText = `
                background-color: #66a3ff;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 12px;
padding: 5px 10px;
margin-bottom: 5px;
`;
					useBtn.addEventListener("click", (e) => {
						e.stopPropagation();
						applyCustomSkin(url);
						const preview = document.getElementById("skin-preview-image");
						if (preview) preview.src = url;
						const urlInput = document.querySelector(
							'#your-skin-content input[type="text"]',
						);
						if (urlInput) urlInput.value = url;
						showNotification("Skin applied!");
					});
					btnContainer.appendChild(useBtn);
					const copyBtn = document.createElement("button");
					copyBtn.textContent = "📋 Copy URL";
					copyBtn.title = "Copy URL";
					copyBtn.style.cssText = `
                background-color: #66a3ff;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 12px;
padding: 5px 10px;
margin-bottom: 5px;
`;
					copyBtn.addEventListener("click", (e) => {
						e.stopPropagation();
						navigator.clipboard
							.writeText(url)
							.then(() => showNotification("URL copied!"))
							.catch(() => showNotification("Failed to copy URL"));
					});
					btnContainer.appendChild(copyBtn);
					const delBtn = document.createElement("button");
					delBtn.textContent = "× Delete";
					delBtn.title = "Delete Skin";
					delBtn.style.cssText = `
                background-color: #f33;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 12px;
padding: 5px 10px;
`;
					delBtn.addEventListener("click", (e) => {
						e.stopPropagation();
						removeSkinFromGallery(index);
						showUrSkins();
						showNotification("Skin deleted");
					});
					btnContainer.appendChild(delBtn);
					item.addEventListener("mouseover", () => {
						overlay.style.opacity = "1";
					});
					item.addEventListener("mouseout", () => {
						overlay.style.opacity = "0";
					});
					galleryGrid.appendChild(item);
				});
			}
			savedSkinsContainer.appendChild(galleryGrid);
			const addSkinSection = document.createElement("div");
			addSkinSection.style.cssText = `
        margin-top: 30px;
padding: 15px;
background-color: #e6e6e6;
border-radius: 8px;
`;
			const addSkinHeader = document.createElement("h4");
			addSkinHeader.textContent = "Add New Skin";
			addSkinHeader.style.cssText = `
        color: ${TAB_ACTIVE_COLOR};
margin-top: 0;
margin-bottom: 10px;
`;
			addSkinSection.appendChild(addSkinHeader);
			const urlInput = document.createElement("input");
			urlInput.type = "text";
			urlInput.placeholder = "Enter skin URL";
			urlInput.style.cssText = `
        width: 100%;
        padding: 8px;
margin-bottom: 10px;
border-radius: 4px;
border: 1px solid #999;
`;
			urlInput.addEventListener("focus", () => {
				isInputFocused = true;
			});
			urlInput.addEventListener("blur", () => {
				setTimeout(() => {
					isInputFocused = false;
				}, 100);
			});
			addSkinSection.appendChild(urlInput);
			const addButton = document.createElement("button");
			addButton.textContent = "Save Skin";
			addButton.style.cssText = `
        background-color: ${TAB_INACTIVE_COLOR};
color: white;
border: none;
padding: 8px 15px;
border-radius: 4px;
cursor: pointer;
font-weight: bold;
`;
			addButton.addEventListener("mouseover", () => {
				addButton.style.backgroundColor = TAB_ACTIVE_COLOR;
			});
			addButton.addEventListener("mouseout", () => {
				addButton.style.backgroundColor = TAB_INACTIVE_COLOR;
			});
			addButton.addEventListener("click", () => {
				const url = urlInput.value.trim();
				if (url) {
					saveSkinToGallery(url);
					urlInput.value = "";
					showUrSkins();
					showNotification("Skin saved!");
				} else {
					showNotification("Please enter a valid URL");
				}
			});
			addSkinSection.appendChild(addButton);
			savedSkinsContainer.appendChild(addSkinSection);
			iframeContainer.appendChild(savedSkinsContainer);
		}

		function showEnemySkinsList() {
			iframeContainer.innerHTML = "";
			const enemyListContainer = document.createElement("div");
			enemyListContainer.style.cssText = `
            width: 100%;
            height: 500px;
padding: 15px;
overflow-y: auto;
background-color: #f8f8f8;
`;
			const listHeader = document.createElement("h3");
			listHeader.textContent = "Your Enemy Skin Mappings";
			listHeader.style.cssText = `
            color: ${TAB_ACTIVE_COLOR};
font-size: 24px;
margin-bottom: 20px;
border-bottom: 2px solid ${TAB_ACTIVE_COLOR};
padding-bottom: 10px;
`;
			enemyListContainer.appendChild(listHeader);
			const skinsGrid = document.createElement("div");
			skinsGrid.style.cssText = `
            display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 15px;
`;
			if (Object.keys(enemySkins).length === 0) {
				const emptyMessage = document.createElement("div");
				emptyMessage.textContent = "No enemy skins have been added yet.";
				emptyMessage.style.cssText = `
                grid-column: 1 / -1;
text-align: center;
color: #666;
font-size: 18px;
padding: 30px;
`;
				skinsGrid.appendChild(emptyMessage);
			} else {
				for (const name in enemySkins) {
					const url = enemySkins[name];
					const card = document.createElement("div");
					card.style.cssText = `
                    background-color: white;
border-radius: 8px;
padding: 15px;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
display: flex;
flex-direction: column;
align-items: center;
position: relative;
`;
					const preview = document.createElement("div");
					preview.style.cssText = `
                    width: 100px;
height: 100px;
border-radius: 50%;
overflow: hidden;
background-color: #f2f2f2;
margin-bottom: 10px;
border: 2px solid ${TAB_INACTIVE_COLOR};
`;
					const img = document.createElement("img");
					img.src = url;
					img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
					img.onerror = () => {
						img.src =
							"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
					};
					preview.appendChild(img);
					const nameLabel = document.createElement("div");
					nameLabel.textContent = name;
					nameLabel.style.cssText = `
                    font-weight: bold;
text-align: center;
margin-bottom: 5px;
word-break: break-word;
`;
					const urlLabel = document.createElement("div");
					const shortenedUrl =
						url.length > 25 ? url.substring(0, 22) + "..." : url;
					urlLabel.textContent = shortenedUrl;
					urlLabel.title = url;
					urlLabel.style.cssText = `
                    font-size: 12px;
color: #666;
text-align: center;
margin-bottom: 10px;
word-break: break-word;
`;
					const buttonsContainer = document.createElement("div");
					buttonsContainer.style.cssText =
						"display: flex; gap: 5px; width: 100%;";
					const copyBtn = document.createElement("button");
					copyBtn.textContent = "Copy URL";
					copyBtn.style.cssText = `
                    flex: 1;
background-color: ${TAB_INACTIVE_COLOR};
color: white;
border: none;
border-radius: 4px;
padding: 5px;
cursor: pointer;
font-size: 12px;
`;
					copyBtn.addEventListener("click", () => {
						navigator.clipboard
							.writeText(url)
							.then(() => {
								showToast(`Copied URL for "${name}"`);
							})
							.catch((err) => {
								showToast(`Failed to copy: ${err}`);
							});
					});
					const removeBtn = document.createElement("button");
					removeBtn.textContent = "Remove";
					removeBtn.style.cssText = `
                    flex: 1;
background-color: #f33;
color: white;
border: none;
border-radius: 4px;
padding: 5px;
cursor: pointer;
font-size: 12px;
`;
					removeBtn.addEventListener("click", () => {
						delete enemySkins[name];
						saveEnemySkins();
						showToast(`Removed skin for "${name}"`);
						showEnemySkinsList();
					});
					buttonsContainer.appendChild(copyBtn);
					buttonsContainer.appendChild(removeBtn);
					card.appendChild(preview);
					card.appendChild(nameLabel);
					card.appendChild(urlLabel);
					card.appendChild(buttonsContainer);
					skinsGrid.appendChild(card);
				}
			}
			enemyListContainer.appendChild(skinsGrid);
			iframeContainer.appendChild(enemyListContainer);
		}
	}

	function buildYourSkinUI(container) {
		const previewContainer = document.createElement("div");
		previewContainer.style.cssText = `
        width: auto;
height: auto;
border-radius: 50%;
margin: 0 auto 20px;
background: #ccc;
overflow: hidden;
display: flex;
justify-content: center;
align-items: center;
border: 3px solid ${TAB_ACTIVE_COLOR};
`;
		container.appendChild(previewContainer);
		const previewImg = document.createElement("img");
		previewImg.id = "skin-preview-image";
		previewImg.style.cssText = "width: 100%; height: 100%;";
		previewImg.onerror = () => {
			previewImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		};
		previewContainer.appendChild(previewImg);
		const inputArea = document.createElement("div");
		inputArea.style.cssText = "margin-bottom: 20px;";
		container.appendChild(inputArea);
		const urlLabel = document.createElement("label");
		urlLabel.textContent = "Skin URL:";
		urlLabel.style.cssText = `
        display: block;
margin-bottom: 5px;
font-weight: bold;
color: ${TEXT_COLOR};
font-size: 18px;
`;
		inputArea.appendChild(urlLabel);
		const urlInput = document.createElement("input");
		urlInput.type = "text";
		urlInput.placeholder = "https://example.com/yourskin.png";
		urlInput.style.cssText = `
        width: 100%;
        padding: 8px;
margin-bottom: 10px;
border-radius: 4px;
border: 1px solid #999;
background: #fff;
color: ${TEXT_COLOR};
font-family: Arial, sans-serif;
`;
		urlInput.addEventListener("focus", () => {
			isInputFocused = true;
		});
		urlInput.addEventListener("blur", () => {
			setTimeout(() => {
				isInputFocused = false;
			}, 100);
		});
		urlInput.addEventListener("input", () => {
			previewImg.src = urlInput.value.trim();
		});
		inputArea.appendChild(urlInput);
		const buttonsContainer = document.createElement("div");
		buttonsContainer.style.cssText = "display: flex; gap: 10px;";
		inputArea.appendChild(buttonsContainer);
		const applyBtn = document.createElement("button");
		applyBtn.textContent = "Apply Skin";
		applyBtn.style.cssText = `
        flex: 1;
background-color: ${TAB_INACTIVE_COLOR};
color: #fff;
border: none;
border-radius: 4px;
padding: 8px 15px;
cursor: pointer;
font-weight: bold;
`;
		applyBtn.addEventListener("mouseover", () => {
			applyBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		applyBtn.addEventListener("mouseout", () => {
			applyBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
		});
		applyBtn.addEventListener("click", () => {
			const url = urlInput.value.trim();
			if (url) {
				applyCustomSkin(url);
				saveSkinToGallery(url);
			} else {
				showNotification("Please enter a valid URL");
			}
		});
		buttonsContainer.appendChild(applyBtn);
		const clearBtn = document.createElement("button");
		clearBtn.textContent = "Clear";
		clearBtn.style.cssText = `
        background-color: #999;
color: #fff;
border: none;
border-radius: 4px;
padding: 8px 15px;
cursor: pointer;
`;
		clearBtn.addEventListener("click", () => {
			urlInput.value = "";
			previewImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		});
		buttonsContainer.appendChild(clearBtn);
		const gallerySection = document.createElement("div");
		gallerySection.style.cssText = "margin-top: 20px; display: block;";
		container.appendChild(gallerySection);
		const urSkinsNote = document.createElement("div");
		urSkinsNote.style.cssText =
			"margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px; text-align: center;";
		const noteText = document.createElement("p");
		noteText.textContent =
			'Your saved skins are now available in the "Your Skins" tab of the Skin Pages popup.';
		noteText.style.cssText = "margin: 0; color: #555;";
		urSkinsNote.appendChild(noteText);
		const openBtn = document.createElement("button");
		openBtn.textContent = "Open Skin Pages";
		openBtn.style.cssText = `
    margin-top: 10px;
background-color: ${TAB_INACTIVE_COLOR};
color: white;
border: none;
padding: 8px 15px;
border-radius: 4px;
cursor: pointer;
`;
		openBtn.addEventListener("click", () => {
			openSkinSitesPopup();
			setTimeout(() => {
				const tabs = document.querySelectorAll("#skin-sites-popup button");
				for (const tab of tabs) {
					if (tab.textContent === "Ur Skins") {
						tab.click();
						break;
					}
				}
			}, 100);
		});
		urSkinsNote.appendChild(openBtn);
		container.appendChild(urSkinsNote);
	}

	function updateSkinGallery() {
		const galleryGrid = document.getElementById("skin-gallery-grid");
		if (!galleryGrid) return;
		galleryGrid.innerHTML = "";
		const skins = loadSkinsFromStorage();
		if (skins.length === 0) {
			const emptyMsg = document.createElement("p");
			emptyMsg.textContent = "No skins saved yet.";
			emptyMsg.style.cssText =
				"grid-column: 1 / -1; text-align: center; color: #555;";
			galleryGrid.appendChild(emptyMsg);
		} else {
			skins.forEach((url, index) => {
				const item = document.createElement("div");
				item.style.cssText = `
                width: 100%;
                aspect-ratio: 1;
border-radius: 8px;
overflow: hidden;
position: relative;
border: 2px solid #999;
background: #ddd;
cursor: pointer;
`;
				const img = document.createElement("img");
				img.src = url;
				img.style.cssText = "width: 100%; height: 100%; object-fit: cover;";
				img.onerror = () => {
					img.src =
						"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
				};
				item.appendChild(img);
				const overlay = document.createElement("div");
				overlay.style.cssText = `
                position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0,0,0,0.7);
display: flex;
justify-content: center;
align-items: center;
opacity: 0;
transition: opacity 0.2s;
`;
				item.appendChild(overlay);
				const btnContainer = document.createElement("div");
				btnContainer.style.cssText = "display: flex; gap: 5px;";
				overlay.appendChild(btnContainer);
				const useBtn = document.createElement("button");
				useBtn.textContent = "✓";
				useBtn.title = "Use Skin";
				useBtn.style.cssText = `
                width: 24px;
height: 24px;
background-color: #66a3ff;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 12px;
`;
				useBtn.addEventListener("click", (e) => {
					e.stopPropagation();
					applyCustomSkin(url);
					const preview = document.getElementById("skin-preview-image");
					if (preview) preview.src = url;
					const urlInput = document.querySelector(
						'#your-skin-content input[type="text"]',
					);
					if (urlInput) urlInput.value = url;
				});
				btnContainer.appendChild(useBtn);
				const delBtn = document.createElement("button");
				delBtn.textContent = "×";
				delBtn.title = "Delete Skin";
				delBtn.style.cssText = `
                width: 24px;
height: 24px;
background-color: #f33;
color: #fff;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 12px;
`;
				delBtn.addEventListener("click", (e) => {
					e.stopPropagation();
					removeSkinFromGallery(index);
					updateSkinGallery();
				});
				btnContainer.appendChild(delBtn);
				item.addEventListener("mouseover", () => {
					overlay.style.opacity = "1";
				});
				item.addEventListener("mouseout", () => {
					overlay.style.opacity = "0";
				});
				item.addEventListener("click", () => {
					const preview = document.getElementById("skin-preview-image");
					if (preview) preview.src = url;
					const urlInput = document.querySelector(
						'#your-skin-content input[type="text"]',
					);
					if (urlInput) urlInput.value = url;
				});
				galleryGrid.appendChild(item);
			});
		}
	}

	function saveSkinToGallery(url) {
		const skins = loadSkinsFromStorage();
		if (skins.includes(url)) return;
		skins.unshift(url);
		if (skins.length > CONFIG.maxSavedSkins) skins.pop();
		saveSkinsToStorage(skins);
	}

	function removeSkinFromGallery(index) {
		const skins = loadSkinsFromStorage();
		skins.splice(index, 1);
		saveSkinsToStorage(skins);
	}

	function buildEnemySkinUI(container) {
		const form = document.createElement("div");
		form.style.cssText = `
        margin-bottom: 20px;
background: #e6e6e6;
padding: 15px;
border-radius: 5px;
`;
		const nameLabel = document.createElement("label");
		nameLabel.textContent = "Enemy Name:";
		nameLabel.style.cssText = `
        display: block;
margin-bottom: 5px;
font-weight: bold;
color: ${TEXT_COLOR};
font-size: 18px;
`;
		form.appendChild(nameLabel);
		const nameInput = document.createElement("input");
		nameInput.id = "enemy-name-input";
		nameInput.type = "text";
		nameInput.placeholder = "Enter exact enemy name";
		nameInput.style.cssText = `
        width: 100%;
        padding: 8px;
margin-bottom: 10px;
border-radius: 4px;
border: 1px solid #999;
background: #fff;
color: ${TEXT_COLOR};
font-family: Arial, sans-serif;
`;
		nameInput.addEventListener("focus", () => {
			isInputFocused = true;
		});
		nameInput.addEventListener("blur", () => {
			setTimeout(() => {
				isInputFocused = false;
			}, 100);
		});
		form.appendChild(nameInput);
		const urlLabel = document.createElement("label");
		urlLabel.textContent = "Skin URL:";
		urlLabel.style.cssText = `
        display: block;
margin-bottom: 5px;
font-weight: bold;
color: ${TEXT_COLOR};
font-size: 18px;
`;
		form.appendChild(urlLabel);
		const urlInput = document.createElement("input");
		urlInput.id = "enemy-skin-url-input";
		urlInput.type = "text";
		urlInput.placeholder = "https://example.com/enemyskin.png";
		urlInput.style.cssText = `
        width: 100%;
        padding: 8px;
margin-bottom: 15px;
border-radius: 4px;
border: 1px solid #999;
background: #fff;
color: ${TEXT_COLOR};
font-family: Arial, sans-serif;
`;
		urlInput.addEventListener("focus", () => {
			isInputFocused = true;
		});
		urlInput.addEventListener("blur", () => {
			setTimeout(() => {
				isInputFocused = false;
			}, 100);
		});
		const previewImg = document.createElement("img");
		previewImg.id = "enemy-skin-preview";
		previewImg.style.cssText = `
        width: 60px;
height: 60px;
border-radius: 50%;
margin: 0 auto 15px;
background: #ccc;
display: block;
object-fit: cover;
border: 2px solid #999;
`;
		previewImg.onerror = () => {
			previewImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		};
		form.appendChild(urlInput);
		form.appendChild(previewImg);
		urlInput.addEventListener("input", () => {
			previewImg.src = urlInput.value.trim();
		});
		const buttonRow = document.createElement("div");
		buttonRow.style.cssText = "display: flex; gap: 10px;";
		form.appendChild(buttonRow);
		const addBtn = document.createElement("button");
		addBtn.textContent = "Add Skin Mapping";
		addBtn.style.cssText = `
        flex: 1;
background-color: ${TAB_INACTIVE_COLOR};
color: #fff;
border: none;
padding: 8px 15px;
border-radius: 4px;
cursor: pointer;
font-weight: bold;
`;
		addBtn.addEventListener("mouseover", () => {
			addBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		addBtn.addEventListener("mouseout", () => {
			addBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
		});
		addBtn.addEventListener("click", () => {
			const name = nameInput.value.trim();
			const url = urlInput.value.trim();
			if (!name || !url) {
				showNotification("Please enter both a name and URL");
				return;
			}
			enemySkins[name] = url;
			saveEnemySkins();
			registerEnemySkin(name, url);
			updateEnemySkinList();
			nameInput.value = "";
			urlInput.value = "";
			previewImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
			showNotification(`Added skin for "${name}"`);
		});
		buttonRow.appendChild(addBtn);
		const clearBtn = document.createElement("button");
		clearBtn.textContent = "Clear";
		clearBtn.style.cssText = `
        background-color: #999;
color: #fff;
border: none;
border-radius: 4px;
padding: 8px 15px;
cursor: pointer;
`;
		clearBtn.addEventListener("click", () => {
			nameInput.value = "";
			urlInput.value = "";
			previewImg.src =
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
		});
		buttonRow.appendChild(clearBtn);
		container.appendChild(form);
		const listContainer = document.createElement("div");
		listContainer.style.cssText = "flex: 1; overflow-y: auto;";
		container.appendChild(listContainer);
		const listTitle = document.createElement("h4");
		listTitle.textContent = "Enemy Skin Mappings";
		listTitle.style.cssText = `
        margin-top: 0;
margin-bottom: 10px;
color: ${TEXT_COLOR};
font-size: 18px;
font-weight: bold;
`;
		listContainer.appendChild(listTitle);
		const enemySkinList = document.createElement("div");
		enemySkinList.id = "enemy-skin-list";
		enemySkinList.style.cssText = "max-height: 400px; overflow-y: auto;";
		listContainer.appendChild(enemySkinList);
		const applyAllBtn = document.createElement("button");
		applyAllBtn.textContent = "Apply All Enemy Skins";
		applyAllBtn.style.cssText = `
        background-color: #66c2ff;
color: #fff;
border: none;
padding: 10px;
border-radius: 4px;
cursor: pointer;
width: 100%;
margin-top: 15px;
font-weight: bold;
font-size: 16px;
`;
		applyAllBtn.addEventListener("click", applyAllEnemySkins);
		applyAllBtn.addEventListener("mouseover", () => {
			applyAllBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		applyAllBtn.addEventListener("mouseout", () => {
			applyAllBtn.style.backgroundColor = "#66c2ff";
		});
		container.appendChild(applyAllBtn);
		loadEnemySkins();
		updateEnemySkinList();
	}

	function updateEnemySkinList() {
		const listContainer = document.getElementById("enemy-skin-list");
		if (!listContainer) return;
		listContainer.innerHTML = "";
		if (Object.keys(enemySkins).length === 0) {
			const emptyMsg = document.createElement("p");
			emptyMsg.textContent = "No skin mappings added yet";
			emptyMsg.style.textAlign = "center";
			emptyMsg.style.color = "#666";
			listContainer.appendChild(emptyMsg);
			return;
		}
		for (const name in enemySkins) {
			const url = enemySkins[name];
			const item = document.createElement("div");
			item.style.cssText = `
            display: flex;
justify-content: space-between;
align-items: center;
padding: 8px;
border-bottom: 1px solid rgba(0,0,0,0.1);
margin-bottom: 5px;
background: #fff;
border-radius: 4px;
`;
			const nameDisplay = document.createElement("div");
			nameDisplay.textContent = name;
			nameDisplay.style.cssText = `
            flex: 1;
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
color: ${TEXT_COLOR};
font-size: 16px;
`;
			item.appendChild(nameDisplay);
			const preview = document.createElement("img");
			preview.src = url;
			preview.style.cssText = `
            width: 30px;
height: 30px;
border-radius: 50%;
margin: 0 10px;
border: 1px solid #999;
object-fit: cover;
`;
			preview.onerror = () => {
				preview.src =
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
			};
			item.appendChild(preview);
			const removeBtn = document.createElement("button");
			removeBtn.textContent = "×";
			removeBtn.style.cssText = `
            background-color: #f33;
color: #fff;
border: none;
width: 24px;
height: 24px;
border-radius: 50%;
cursor: pointer;
font-size: 16px;
display: flex;
align-items: center;
justify-content: center;
`;
			removeBtn.addEventListener("click", () => {
				delete enemySkins[name];
				saveEnemySkins();
				updateEnemySkinList();
				showNotification(`Removed skin for "${name}"`);
			});
			item.appendChild(removeBtn);
			listContainer.appendChild(item);
		}
	}

	function updatePlayerDataDisplays() {
		updateLeaderboard();
		updateCellNames();
		updateScore();
	}

	function updateLeaderboard() {
		const container = document.getElementById("leaderboard-content");
		if (!container) return;
		container.innerHTML = "";
		const keys = Object.keys(leaderboardData);
		if (keys.length === 0) {
			container.innerHTML = `<p style="color: #666; text-align: center;">No leaderboard data collected yet</p>`;
			return;
		}
		const positions = keys.sort((a, b) => parseInt(a) - parseInt(b));
		positions.forEach((pos) => {
			const name = leaderboardData[pos];
			const item = document.createElement("div");
			item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            margin-bottom: 5px;
            background: #fff;
            border-radius: 4px;
        `;
			const posDisplay = document.createElement("span");
			posDisplay.textContent = pos + ".";
			posDisplay.style.marginRight = "10px";
			item.appendChild(posDisplay);
			const nameDisplay = document.createElement("span");
			nameDisplay.textContent = name;
			nameDisplay.style.flex = "1";
			item.appendChild(nameDisplay);
			const copyBtn = document.createElement("button");
			copyBtn.textContent = "Copy";
			copyBtn.style.cssText = `
            background-color: ${TAB_INACTIVE_COLOR};
            border: none;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        `;
			copyBtn.addEventListener("mouseover", () => {
				copyBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
			});
			copyBtn.addEventListener("mouseout", () => {
				copyBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
			});
			copyBtn.addEventListener("click", () => {
				copyToClipboard(name);
				showNotification(`Copied "${name}" to clipboard`);
			});
			item.appendChild(copyBtn);
			const addSkinBtn = document.createElement("button");
			addSkinBtn.textContent = "Add Skin";
			addSkinBtn.style.cssText = `
            background-color: #66c2ff;
            border: none;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
        `;
			addSkinBtn.addEventListener("mouseover", () => {
				addSkinBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
			});
			addSkinBtn.addEventListener("mouseout", () => {
				addSkinBtn.style.backgroundColor = "#66c2ff";
			});
			addSkinBtn.addEventListener("click", () => {
				addNameToSkinManager(name);
			});
			item.appendChild(addSkinBtn);
			container.appendChild(item);
		});
	}

	function updateCellNames() {
		const container = document.getElementById("cell-names-content");
		if (!container) return;
		container.innerHTML = "";
		if (cellNames.size === 0) {
			container.innerHTML = `<p style="color: #666; text-align: center;">No cell names collected yet</p>`;
			return;
		}
		const namesArray = Array.from(cellNames).sort();
		namesArray.forEach((name) => {
			const item = document.createElement("div");
			item.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-bottom: 1px solid rgba(0,0,0,0.1);
            margin-bottom: 5px;
            background: #fff;
            border-radius: 4px;
        `;
			const nameDisplay = document.createElement("span");
			nameDisplay.textContent = name;
			nameDisplay.style.flex = "1";
			item.appendChild(nameDisplay);
			const copyBtn = document.createElement("button");
			copyBtn.textContent = "Copy";
			copyBtn.style.cssText = `
            background-color: ${TAB_INACTIVE_COLOR};
            border: none;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 5px;
        `;
			copyBtn.addEventListener("mouseover", () => {
				copyBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
			});
			copyBtn.addEventListener("mouseout", () => {
				copyBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
			});
			copyBtn.addEventListener("click", () => {
				copyToClipboard(name);
				showNotification(`Copied "${name}" to clipboard`);
			});
			item.appendChild(copyBtn);
			const addSkinBtn = document.createElement("button");
			addSkinBtn.textContent = "Add Skin";
			addSkinBtn.style.cssText = `
            background-color: #66c2ff;
            border: none;
            color: #fff;
            padding: 3px 8px;
            border-radius: 3px;
            cursor: pointer;
        `;
			addSkinBtn.addEventListener("mouseover", () => {
				addSkinBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
			});
			addSkinBtn.addEventListener("mouseout", () => {
				addSkinBtn.style.backgroundColor = "#66c2ff";
			});
			addSkinBtn.addEventListener("click", () => {
				addNameToSkinManager(name);
			});
			item.appendChild(addSkinBtn);
			container.appendChild(item);
		});
	}

	function updateScore() {
		const container = document.getElementById("score-content");
		if (!container) return;
		container.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: ${TEXT_COLOR}; font-size: 24px;">Your Current Score</h3>
            <div style="font-size: 36px; margin: 20px 0; font-weight: bold; color: ${TEXT_COLOR};">${playerScore.toLocaleString()}</div>
            <button id="copy-score-btn"
                style="background-color: ${TAB_INACTIVE_COLOR}; border: none; color: #fff; padding: 8px 15px; border-radius: 4px; cursor: pointer; font-size: 16px;">
                Copy Score
            </button>
        </div>
    `;
		const copyBtn = document.getElementById("copy-score-btn");
		copyBtn?.addEventListener("click", () => {
			copyToClipboard(playerScore.toString());
			showNotification("Score copied to clipboard");
		});
		copyBtn?.addEventListener("mouseover", () => {
			copyBtn.style.backgroundColor = TAB_ACTIVE_COLOR;
		});
		copyBtn?.addEventListener("mouseout", () => {
			copyBtn.style.backgroundColor = TAB_INACTIVE_COLOR;
		});
	}

	function copyToClipboard(text) {
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		document.body.removeChild(textarea);
	}

	function addNameToSkinManager(name) {
		openPlayerDataManager();
		const tabs = document.querySelectorAll("#player-data-manager div");
		for (const tab of tabs) {
			if (tab.textContent === "Enemy Skins") {
				tab.click();
				break;
			}
		}
		const nameInput = document.getElementById("enemy-name-input");
		if (nameInput) {
			nameInput.value = name;
			nameInput.focus();
			setTimeout(() => {
				document.getElementById("enemy-skin-url-input")?.focus();
			}, 100);
			showNotification(`Added "${name}" to skin manager`);
		}
	}

	function openSkinSwitcherUI() {
		openPlayerDataManager();
		const tabs = document.querySelectorAll("#player-data-manager div");
		for (const tab of tabs) {
			if (tab.textContent === "Your Skin") {
				tab.click();
				break;
			}
		}
	}

	function initialize() {
		setupKeyHandlers();
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", initOnReady);
		} else {
			initOnReady();
		}
	}

	function initOnReady() {
		document.documentElement.removeAttribute("style");
		const adDiv = document.querySelector("#agar-io_970x90");
		if (adDiv) adDiv.remove();
		createShowControlsButton();
		createMainOverlay();
		createFpsCounter();

		/* -- monkey‑patches & misc tweaks ---------------------------------------- */
		initRussiaToUkraine();
		patchNickLimit();
		interceptWebSocket();
		interceptCoreForFreeze();
		setupNameCollection();

		/* -- state that needs to be restored ------------------------------------- */
		captureOriginalSkin();
		loadEnemySkins();

		/* -- defer things that require the canvas / core engine ------------------ */
		setTimeout(findGameCanvas, 2000);
		checkCoreAccess();

		/* -- all done! ----------------------------------------------------------- */
		showNotification("Piccolo’s Agario Mod initialised! 🎉", true);
		console.info(
			"%cPiccolo Agario Mod initialised successfully!",
			"color:#0f0",
		);
	}

	initialize();
})();

(function () {
	"use strict";
	const config = {
		containerWidth: "400px",
		maxPreviewSize: 180,
		buttonColor: "#54c800",
		buttonHoverColor: "#45a800",
		dropZoneHeight: "120px",
		dropZoneBorderColor: "#ccc",
		dropZoneActiveColor: "#54c800",
		agarioColors: {
			green: "#54c800",
			blue: "#0078fa",
			red: "#ff3d3d",
			yellow: "#ffcc00",
			background: "rgb(255, 255, 255)",
			text: "#000000",
		},
	};
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.addedNodes && mutation.addedNodes.length > 0) {
				for (let i = 0; i < mutation.addedNodes.length; i++) {
					const node = mutation.addedNodes[i];
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (
							node.querySelector("#skin-editor-canvas") ||
							node.id === "skin-editor-canvas"
						) {
							console.log("Skin editor detected!");
							setTimeout(initializeImageUploader, 500);
							return;
						}
					}
				}
			}
			if (mutation.removedNodes && mutation.removedNodes.length > 0) {
				for (let i = 0; i < mutation.removedNodes.length; i++) {
					const node = mutation.removedNodes[i];
					if (node.nodeType === Node.ELEMENT_NODE) {
						if (
							node.querySelector &&
							(node.querySelector("#skin-editor-canvas") ||
								node.id === "skin-editor-canvas" ||
								(node.classList &&
									(node.classList.contains("skin-editor") ||
										node.classList.contains("skin-editor-dialog"))))
						) {
							console.log("Skin editor closed!");
							removeImageUploader();
							return;
						}
						const editorCloseIndicators = [
							".sk-app",
							".editor-app",
							".skin-editor",
							"[data-v-skin-editor]",
							"#skin-editor",
						];
						for (const selector of editorCloseIndicators) {
							if (node.matches && node.matches(selector)) {
								console.log("Possible skin editor close detected!");
								setTimeout(checkIfEditorClosed, 100);
								return;
							}
						}
					}
				}
			}
		});
	});
	function startObserver() {
		if (document.body) {
			observer.observe(document.body, {childList: true, subtree: true});
			console.log("Observer started successfully");
		} else {
			console.log("Body not ready, waiting...");
			setTimeout(startObserver, 100);
		}
	}
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", startObserver);
	} else {
		startObserver();
	}
	function initializeImageUploader() {
		if (document.getElementById("custom-image-uploader-container")) {
			return;
		}
		console.log("Initializing image uploader...");
		const uploadContainer = createUploadContainer();
		document.body.appendChild(uploadContainer);
		positionUploaderNextToEditor(uploadContainer);
		console.log("Image uploader initialized successfully!");
	}
	function findControlsContainer() {
		const canvas = document.getElementById("skin-editor-canvas");
		if (!canvas) return null;
		const toolsSelector =
			".tools, .colors, .controls, .editor-controls, .skin-editor-tools";
		const toolsContainer = document.querySelector(toolsSelector);
		if (toolsContainer) return toolsContainer;
		const skinEditorContainer = document.querySelector(
			".skin-editor, #skin-editor, [data-v-skin-editor]",
		);
		if (skinEditorContainer) {
			const controls = skinEditorContainer.querySelector(".controls, .tools");
			if (controls) return controls;
			return skinEditorContainer;
		}
		let parent = canvas.parentElement;
		for (let i = 0; i < 5 && parent; i++) {
			if (
				parent.classList.contains("sk-app") ||
				parent.classList.contains("editor") ||
				parent.id === "skin-editor" ||
				parent.classList.contains("skin-editor")
			) {
				return parent;
			}
			const controlElements = parent.querySelectorAll(
				"button, .color, input, select",
			);
			if (controlElements.length > 3) {
				return parent;
			}
			parent = parent.parentElement;
		}
		const canvasParent = canvas.parentElement;
		const fallbackContainer = document.createElement("div");
		fallbackContainer.id = "skin-editor-controls-fallback";
		fallbackContainer.style.marginTop = "10px";
		canvasParent.appendChild(fallbackContainer);
		console.log("Created fallback container for skin editor controls");
		return fallbackContainer;
	}
	function createUploadContainer() {
		const container = document.createElement("div");
		container.id = "custom-image-uploader-container";
		container.style.position = "absolute";
		container.style.right = "50px";
		container.style.top = "70px";
		container.style.width = config.containerWidth;
		container.style.padding = "15px";
		container.style.backgroundColor = config.agarioColors.background;
		container.style.color = config.agarioColors.text;
		container.style.borderRadius = "8px";
		container.style.boxSizing = "border-box";
		container.style.zIndex = "9999";
		container.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.5)";
		container.style.fontFamily = "Ubuntu, Arial, sans-serif";
		container.style.border = "2px solid " + config.agarioColors.green;
		const header = document.createElement("div");
		header.style.display = "flex";
		header.style.justifyContent = "space-between";
		header.style.alignItems = "center";
		header.style.marginBottom = "15px";
		header.style.borderBottom = "1px solid " + config.agarioColors.green;
		header.style.paddingBottom = "8px";
		const title = document.createElement("h3");
		title.textContent = "New Jacks 🕹️ Skin Editor";
		title.style.margin = "0";
		title.style.color = config.agarioColors.blue;
		title.style.fontSize = "24px";
		title.style.fontWeight = "bold";
		const toggleBtn = document.createElement("button");
		toggleBtn.textContent = "−";
		toggleBtn.style.backgroundColor = config.agarioColors.green;
		toggleBtn.style.border = "none";
		toggleBtn.style.color = "#ccc";
		toggleBtn.style.fontSize = "18px";
		toggleBtn.style.cursor = "pointer";
		toggleBtn.style.width = "24px";
		toggleBtn.style.height = "24px";
		toggleBtn.style.display = "flex";
		toggleBtn.style.justifyContent = "center";
		toggleBtn.style.alignItems = "center";
		toggleBtn.style.borderRadius = "4px";
		const contentContainer = document.createElement("div");
		contentContainer.id = "image-uploader-content";
		toggleBtn.addEventListener("click", () => {
			if (contentContainer.style.display === "none") {
				contentContainer.style.display = "block";
				toggleBtn.textContent = "−";
			} else {
				contentContainer.style.display = "none";
				toggleBtn.textContent = "+";
			}
		});
		header.appendChild(title);
		header.appendChild(toggleBtn);
		container.appendChild(header);
		container.appendChild(contentContainer);
		const urlContainer = document.createElement("div");
		urlContainer.style.marginBottom = "12px";
		urlContainer.style.display = "flex";
		const urlInput = document.createElement("input");
		urlInput.type = "text";
		urlInput.placeholder = "Enter image URL... ibb.co best";
		urlInput.style.flex = "1";
		urlInput.style.padding = "10px";
		urlInput.style.border = "1px solid #444";
		urlInput.style.backgroundColor = "rgba (135, 135, 135, 0.3)";
		urlInput.style.color = "#000";
		urlInput.style.borderRadius = "4px";
		urlInput.style.marginRight = "5px";
		urlInput.style.fontSize = "18px";
		const urlButton = document.createElement("button");
		urlButton.textContent = "Load";
		urlButton.style.padding = "10px";
		urlButton.style.backgroundColor = config.agarioColors.green;
		urlButton.style.color = "black";
		urlButton.style.border = "none";
		urlButton.style.borderRadius = "4px";
		urlButton.style.cursor = "pointer";
		urlButton.style.fontWeight = "bold";
		urlContainer.appendChild(urlInput);
		urlContainer.appendChild(urlButton);
		contentContainer.appendChild(urlContainer);
		const uploadButtons = document.createElement("div");
		uploadButtons.style.display = "flex";
		uploadButtons.style.gap = "5px";
		uploadButtons.style.marginBottom = "12px";
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.id = "custom-skin-file";
		fileInput.accept = "image/*";
		fileInput.style.display = "none";
		const fileButton = document.createElement("button");
		fileButton.textContent = "Upload From Computer";
		fileButton.style.flex = "1";
		fileButton.style.padding = "10px";
		fileButton.style.backgroundColor = config.agarioColors.blue;
		fileButton.style.color = "white";
		fileButton.style.border = "none";
		fileButton.style.borderRadius = "4px";
		fileButton.style.cursor = "pointer";
		fileButton.style.fontWeight = "bold";
		uploadButtons.appendChild(fileInput);
		uploadButtons.appendChild(fileButton);
		contentContainer.appendChild(uploadButtons);
		const dropZone = document.createElement("div");
		dropZone.id = "custom-skin-drop-zone";
		dropZone.textContent = "Drop Image Here";
		dropZone.style.height = config.dropZoneHeight;
		dropZone.style.border = `2px dashed ${config.agarioColors.yellow}`;
		dropZone.style.borderRadius = "4px";
		dropZone.style.display = "flex";
		dropZone.style.flexDirection = "column";
		dropZone.style.alignItems = "center";
		dropZone.style.justifyContent = "center";
		dropZone.style.color = "#ccc";
		dropZone.style.marginBottom = "12px";
		dropZone.style.fontSize = "16px";
		dropZone.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
		const dropIcon = document.createElement("div");
		dropIcon.innerHTML = "⬇️";
		dropIcon.style.fontSize = "24px";
		dropIcon.style.marginBottom = "8px";
		dropZone.appendChild(dropIcon);
		dropZone.appendChild(document.createTextNode("Drag & Drop Image Here"));
		contentContainer.appendChild(dropZone);
		const previewContainer = document.createElement("div");
		previewContainer.style.textAlign = "center";
		previewContainer.style.marginTop = "12px";
		previewContainer.style.display = "none";
		previewContainer.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
		previewContainer.style.padding = "10px";
		previewContainer.style.borderRadius = "4px";
		const previewLabel = document.createElement("div");
		previewLabel.textContent = "Preview:";
		previewLabel.style.marginBottom = "8px";
		previewLabel.style.color = config.agarioColors.yellow;
		previewLabel.style.fontSize = "14px";
		previewLabel.style.fontWeight = "bold";
		const previewImg = document.createElement("img");
		previewImg.id = "custom-skin-preview";
		previewImg.style.maxWidth = "100%";
		previewImg.style.maxHeight = `${config.maxPreviewSize}px`;
		previewImg.style.border = "1px solid #444";
		previewImg.style.borderRadius = "50%";
		previewContainer.appendChild(previewLabel);
		previewContainer.appendChild(previewImg);
		contentContainer.appendChild(previewContainer);
		const helpText = document.createElement("div");
		helpText.style.fontSize = "20px";
		helpText.style.color = "#000";
		helpText.style.textShadow = "1px 1px 1px #444";
		helpText.style.marginTop = "16px";
		helpText.style.lineHeight = "1.4";
		helpText.style.padding = "8px";
		helpText.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
		helpText.style.borderRadius = "4px";
		helpText.style.borderLeft = "3px solid " + config.agarioColors.yellow;
		helpText.innerHTML = `
            <b style="color:${config.agarioColors.blue}">Tips:</b><br>
            • If image doesn't appear clearly, try <a href="https://picwish.com/unblur-image-portrait" target="_blank" style="color:${config.agarioColors.blue};">unblurring it PicWish.com</a><br>
            • Use <a href="https://crop-circle.imageonline.co/" target="_blank" style="color:${config.agarioColors.blue};">Crop Circle Tool</a> for best results<br>
            • Simple designs with few colors work best<br>
            • The image will be centered and scaled
        `;
		contentContainer.appendChild(helpText);
		urlInput.addEventListener("keypress", (e) => {
			if (e.key === "Enter") {
				loadImageFromUrl(urlInput.value);
			}
		});
		urlButton.addEventListener("click", () => {
			loadImageFromUrl(urlInput.value);
		});
		fileButton.addEventListener("click", () => {
			fileInput.click();
		});
		fileInput.addEventListener("change", () => {
			if (fileInput.files && fileInput.files[0]) {
				handleFileUpload(fileInput.files[0]);
			}
		});
		dropZone.addEventListener("dragover", (e) => {
			e.preventDefault();
			dropZone.style.borderColor = config.agarioColors.green;
			dropZone.style.backgroundColor = "rgba(84, 200, 0, 0.1)";
		});
		dropZone.addEventListener("dragleave", () => {
			dropZone.style.borderColor = config.agarioColors.yellow;
			dropZone.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
		});
		dropZone.addEventListener("drop", (e) => {
			e.preventDefault();
			dropZone.style.borderColor = config.agarioColors.yellow;
			dropZone.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				handleFileUpload(e.dataTransfer.files[0]);
			}
		});
		[fileButton, urlButton].forEach((button) => {
			button.addEventListener("mouseover", () => {
				const originalColor = button.style.backgroundColor;
				const darkerColor =
					originalColor === config.agarioColors.green
						? config.buttonHoverColor
						: originalColor === config.agarioColors.blue
							? "#0060cc"
							: originalColor;
				button.style.backgroundColor = darkerColor;
			});
			button.addEventListener("mouseout", () => {
				button.style.backgroundColor =
					button === fileButton
						? config.agarioColors.blue
						: config.agarioColors.green;
			});
		});
		makeDraggable(container, header);
		return container;
	}
	function makeDraggable(element, handle) {
		let pos1 = 0,
			pos2 = 0,
			pos3 = 0,
			pos4 = 0;
		handle.style.cursor = "move";
		handle.onmousedown = dragMouseDown;
		function dragMouseDown(e) {
			e.preventDefault();
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			document.onmousemove = elementDrag;
		}
		function elementDrag(e) {
			e.preventDefault();
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			element.style.top = element.offsetTop - pos2 + "px";
			element.style.left = element.offsetLeft - pos1 + "px";
			element.style.right = "auto";
		}
		function closeDragElement() {
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}
	function removeImageUploader() {
		const uploader = document.getElementById("custom-image-uploader-container");
		if (uploader) {
			uploader.remove();
			console.log("Image uploader removed");
		}
	}
	function checkIfEditorClosed() {
		const canvas = document.getElementById("skin-editor-canvas");
		if (!canvas) {
			removeImageUploader();
		}
	}
	function positionUploaderNextToEditor(uploader) {
		const canvas = document.getElementById("skin-editor-canvas");
		if (!canvas) return;
		const canvasRect = canvas.getBoundingClientRect();
		const editorWidth = canvas.clientWidth || canvas.offsetWidth;
		uploader.style.top = `${canvasRect.top}px`;
		uploader.style.left = "auto";
		uploader.style.right = "20px";
	}
	function loadImageFromUrl(url) {
		if (!url) return;
		if (!url.match(/^https?:\/\/.+\..+/i)) {
			alert("Please enter a valid URL");
			return;
		}
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.onload = () => {
			updatePreview(img.src);
			drawImageToCanvas(img);
		};
		img.onerror = () => {
			alert(
				"Error loading image. The URL might be invalid or the server does not allow cross-origin requests.",
			);
		};
		img.src = url;
	}
	function handleFileUpload(file) {
		if (!file || !file.type.startsWith("image/")) {
			alert("Please select a valid image file");
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const img = new Image();
			img.onload = () => {
				updatePreview(e.target.result);
				drawImageToCanvas(img);
			};
			img.src = e.target.result;
		};
		reader.readAsDataURL(file);
	}
	function updatePreview(src) {
		const preview = document.getElementById("custom-skin-preview");
		const previewContainer = preview.parentElement;
		preview.src = src;
		previewContainer.style.display = "block";
		const successMsg = document.createElement("div");
		successMsg.textContent = "Image loaded successfully!";
		successMsg.style.color = config.agarioColors.green;
		successMsg.style.fontWeight = "bold";
		successMsg.style.marginTop = "5px";
		successMsg.style.fontSize = "12px";
		const existingMsg = previewContainer.querySelector(".success-msg");
		if (existingMsg) {
			previewContainer.removeChild(existingMsg);
		}
		successMsg.className = "success-msg";
		previewContainer.appendChild(successMsg);
		setTimeout(() => {
			successMsg.style.transition = "opacity 1s";
			successMsg.style.opacity = "0";
		}, 3000);
	}
	function drawImageToCanvas(img) {
		const canvas = document.getElementById("skin-editor-canvas");
		if (!canvas) {
			console.error("Skin editor canvas not found");
			return;
		}
		const ctx = canvas.getContext("2d");
		const originalWidth = canvas.width;
		const originalHeight = canvas.height;
		ctx.clearRect(0, 0, originalWidth, originalHeight);
		const scale = Math.min(
			originalWidth / img.width,
			originalHeight / img.height,
		);
		const x = (originalWidth - img.width * scale) / 2;
		const y = (originalHeight - img.height * scale) / 2;
		const width = img.width * scale;
		const height = img.height * scale;
		ctx.drawImage(img, x, y, width, height);
		const changeEvent = new Event("change", {bubbles: true});
		canvas.dispatchEvent(changeEvent);
		try {
			if (window.drawApp && typeof window.drawApp.render === "function") {
				window.drawApp.render(true);
			}
		} catch (e) {
			console.log("Internal draw method not available:", e);
		}
	}
})();
/* ─── Ad‑blocker for #agar-io_160x600 & #agar-io_160x600_2 ─────────────── */
(function zapAdsAndTos() {
	/* selectors for anything we want gone */
	const SELECTORS = ["#agar-io_160x600", "#agar-io_160x600_2", ".tosBox.right"];

	/* utility – delete any element matching our selectors */
	const removeMatches = (root) =>
		SELECTORS.forEach((sel) =>
			root.querySelectorAll(sel).forEach((el) => el.remove()),
		);

	/* 1. Immediately clean whatever is already in the DOM */
	removeMatches(document);

	/* 2. Keep cleaning with a MutationObserver */
	const obs = new MutationObserver((muts) =>
		muts.forEach((m) =>
			m.addedNodes.forEach((n) => n.nodeType === 1 && removeMatches(n)),
		),
	);
	obs.observe(document.documentElement, {childList: true, subtree: true});

	console.log("[Mod] Ad & TOS blocker initialised");
})();

(function () {
	"use strict";

	const BANNER_URL = "https://i.ibb.co/zWcCmyfp/pm3.gif"; // your image
	const TARGET_LINK = "https://www.youtube.com/@maroooc/videos";

	/** Replace the built‑in promo with our own banner */
	function replacePromoBanner() {
		const promo = document.querySelector("#mainui-promo");
		if (!promo) return false; // not in DOM yet

		// Build replacement <img>
		const img = document.createElement("img");
		img.src = BANNER_URL;
		img.alt = "Custom banner";
		img.style.display = "block";
		img.style.maxWidth = "325px";
		img.style.maxHeight = "290px";
		img.style.cursor = "pointer";
		img.addEventListener("click", () =>
			window.open(TARGET_LINK, "_blank", "noopener"),
		);

		// Swap in the new banner
		promo.replaceWith(img);
		return true;
	}

	/** Poll until the promo div exists, then swap it out */
	(function waitForPromo() {
		if (replacePromoBanner()) return; // success → stop
		requestAnimationFrame(waitForPromo); // keep checking



// Detectar color 1 y 2 para cambiar borde visible (mod Bite VIP)
const originalGetColor = window.getColor;
window.getColor = function (index) {
    if (index === 1) return "#FFFFFF"; // blanco
    if (index === 2) return "#000000"; // negro
    return originalGetColor ? originalGetColor(index) : "#FF0000"; // rojo por defecto
};
	})();
})();
