// ==UserScript==
// @name         FlatChat+
// @namespace    com.dounford.flatmmo.flatChat
// @version      2.1
// @description  Better chat for FlatMMO
// @author       Dounford
// @license      MIT
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @downloadURL https://update.greasyfork.org/scripts/544709/FlatChat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/544709/FlatChat%2B.meta.js
// ==/UserScript==

(function() {
	'use strict';

	//Which css variable corresponds to each color
	const messageColors = {
		white: "messagesColor",//local message
		grey: "messagesColor", //global message
		server: "serverMessages",
		pink: "milestoneMessages", //server messages
		red: "warningMessages", //errors (trade declines, no energy)
		lime: "restMessages", //rest message
		green: "lvlUpMessages", //level up
		cyan: "areaChangeMessages", //Leaving/Entering town
		pmReceived: "pmReceivedMessages", //private messages
		pmSent: "pmSentMessages",
		gold: "pingMessages",
	};
	const ding = new Audio("https://github.com/Dounford-Felipe/DHM-Idle-Again/raw/refs/heads/main/ding.wav");
	const IPSigils = new Set([
		'images/ui/basket_egg_sigil.png', 'images/ui/basket_sigil.png', 'images/ui/bat_sigil.png', 'images/ui/bell_sigil.png', 'images/ui/blue_party_hat_sigil.png', 'images/ui/broken_bell_sigil.png', 'images/ui/bronze_event_2_sigil.png', 'images/ui/bronze_event_sigil.png', 'images/ui/bunny_sigil.png', 'images/ui/candy_cane_sigil.png', 'images/ui/carrot_sigil.png', 'images/ui/cat_sigil.png', 'images/ui/chocolate_sigil.png', 'images/ui/dh1_max_sigil.png', 'images/ui/easter_egg_sigil.png', 'images/ui/event_2_sigil.png', 'images/ui/event_sigil.png', 'images/ui/fake_bell_sigil.png', 'images/ui/fancy_bell_sigil.png', 'images/ui/ghost_sigil.png', 'images/ui/gift_sigil.png', 'images/ui/gold_event_2_sigil.png', 'images/ui/gold_event_sigil.png', 'images/ui/green_party_hat_sigil.png', 'images/ui/hatching_chicken_sigil.png', 'images/ui/mad_bunny_sigil.png', 'images/ui/mummy_head_sigil.png', 'images/ui/mummy_sigil.png', 'images/ui/pink_party_hat_sigil.png', 'images/ui/pumpkin_sigil.png', 'images/ui/red_party_hat_sigil.png', 'images/ui/reindeer_sigil.png', 'images/ui/santa_hat_sigil.png', 'images/ui/silver_event_2_sigil.png', 'images/ui/silver_event_sigil.png', 'images/ui/skull_sigil.png', 'images/ui/snowflake_sigil.png', 'images/ui/snowman_sigil.png', 'images/ui/spider_sigil.png', 'images/ui/tree_sigil.png', 'images/ui/white_party_hat_sigil.png', 'images/ui/yellow_party_hat_sigil.png', 'images/ui/zombie_sigil.png'
	])
	const defaultThemes = {
		dark: {
            chatBackground: "#191b24",
            /*Top bar*/
            topBarBackground: "#131c37",
            tabsBackground: "#393a5b",
            activeTabBackground: "#4357af",
            hoverTabBackground: "#D3D3D3",
            tabsTextColor: "#e7e7e7",
            unreadMessagesBackground: "#000090",
            unreadMessagesTextColor: "#e7e7e7",
            /*Channels*/
            oddMessageBackground: "#191b24",
            evenMessageBackground: "#191b24",
            messageTimeColor: "#ffffff",
            messageSenderUsernameColor: "#ffffff",
            regularMessageColor: "#E1E1E1",
            serverMessageColor: "#6495ED",
            milestoneMessageColor: "#FF1493",
            warningMessageColor: "#FF0000",
            restMessageColor: "#00FF00",
            lvlUpMessageColor: "#008000",
            areaChangeMessageColor: "#00FFFF",
            pmReceivedMessageColor: "#ffdea1",
            pmSentMessageColor: "#78ffb5",
            pingBackground: "#3F51B5",
            pingTextColor: "#ffffff",
			tooltipBorder: "#808080",
			tooltipBackground: "#aaaaaa",
			tooltipTextColor: "#000000",
            /*Bottom bar*/
            chatBarBackground: "#131419",
            usernameBottomBar: "#C0C0C0",
            chatBarTextColor: "#ffffff",
            buttonsBackground: "#000090",
            buttonsTextColor: "#C0C0C0",
            /*Context Menu*/
            contextMenuBackground: "#191b24",
            contextMenuUsernameColor: "#C0C0C0",
            contextMenuButtonBackground: "#000090",
            contextMenuWarningButtonBackground: "#ff0000",
            contextMenuTextColor: "#ffffff",
            /*Misc*/
            hyperlinkTextColor: "#00FFFF",
            visitedHyperlinkTextColor: "#00FFFF",
        },
		light: {
			chatBackground: "#F5F7FA",
			/*Top bar*/
			topBarBackground: "#E3E8F0",
			tabsBackground: "#D1DAE6",
			activeTabBackground: "#4A90E2",
			hoverTabBackground: "#B8C7D9",
			tabsTextColor: "#2C3E50",
			unreadMessagesBackground: "#FF6B6B",
			unreadMessagesTextColor: "#FFFFFF",
			/*Channels*/
			oddMessageBackground: "#F5F7FA",
			evenMessageBackground: "#FFFFFF",
			messageTimeColor: "#7F8C8D",
			messageSenderUsernameColor: "#2C3E50",
			regularMessageColor: "#34495E",
			serverMessageColor: "#3498DB",
			milestoneMessageColor: "#9B59B6",
			warningMessageColor: "#E74C3C",
			restMessageColor: "#27AE60",
			lvlUpMessageColor: "#2ECC71",
			areaChangeMessageColor: "#1ABC9C",
			pmReceivedMessageColor: "#E67E22",
			pmSentMessageColor: "#D35400",
			pingBackground: "#F1C40F",
			pingTextColor: "#2C3E50",
			tooltipBorder: "#BDC3C7",
			tooltipBackground: "#ECF0F1",
			tooltipTextColor: "#2C3E50",
			/*Bottom bar*/
			chatBarBackground: "#E3E8F0",
			usernameBottomBar: "#7F8C8D",
			chatBarTextColor: "#2C3E50",
			buttonsBackground: "#4A90E2",
			buttonsTextColor: "#FFFFFF",
			/*Context Menu*/
			contextMenuBackground: "#FFFFFF",
			contextMenuUsernameColor: "#34495E",
			contextMenuButtonBackground: "#4A90E2",
			contextMenuWarningButtonBackground: "#E74C3C",
			contextMenuTextColor: "#2C3E50",
			/*Misc*/
			hyperlinkTextColor: "#2980B9",
			visitedHyperlinkTextColor: "#8E44AD",
		},
	}
	const themesText = {
		chatBackground: "Chat Background",
		/*Top bar*/
		topBarBackground: "Top Bar Background",
		tabsBackground: "Tabs Background",
		activeTabBackground: "Active Tab Background",
		hoverTabBackground: "Hover Tab Background",
		tabsTextColor: "Tabs Text",
		unreadMessagesBackground: "Unread Background",
		unreadMessagesTextColor: "Unread Text",
		/*Channels*/
		oddMessageBackground: "Odd Messages Background",
		evenMessageBackground: "Even Messages Background",
		messageTimeColor: "Message Time Color (#fff = unset)",
		messageSenderUsernameColor: "Sender Color (#fff = unset)",
		regularMessageColor: "Regular Message Color",
		serverMessageColor: "Server Message",
		milestoneMessageColor: "Milestone Message",
		warningMessageColor: "Error/Warning Message",
		restMessageColor: "Rest Messages",
		lvlUpMessageColor: "LVL UP Messages",
		areaChangeMessageColor: "Entering/Leaving Town",
		pmReceivedMessageColor: "Private Messages Received",
		pmSentMessageColor: "Private Messages Sent",
		pingBackground: "Ping Messages Background",
		pingTextColor: "Ping Messages Text",
		tooltipBorder: "!lvl Tooltip Border",
		tooltipBackground: "!lvl Tooltip Background",
		tooltipTextColor: "!lvl Tooltip Text",
		/*Bottom bar*/
		chatBarBackground: "Chat Bar Background",
		usernameBottomBar: "Username Color",
		chatBarTextColor: "Chat Text",
		buttonsBackground: "Buttons Background",
		buttonsTextColor: "Buttons Text",
		/*Context Menu*/
		contextMenuBackground: "Context Menu Background",
		contextMenuUsernameColor: "Context Menu Username",
		contextMenuButtonBackground: "Context Menu Button Background",
		contextMenuWarningButtonBackground: "Context Menu Warning Button Background",
		contextMenuTextColor: "Context Menu Text",
		/*Misc*/
		hyperlinkTextColor: "Hyperlink Color",
		visitedHyperlinkTextColor: "Visited Hyperlink Color",
	};
	const chatInset = {
		bottomRight: "auto 0 0 auto",
		bottomLeft: "auto auto 0 auto",
		topRight: "0 0 auto auto",
		topLeft: "0 auto auto"
	}

	const textToNotification = {
		nessieTime: {
			blocked: " seconds left.",
			name: "nessieTime",
			image: "https://flatmmo.com/images/npcs/lochness_monster_stand1.png",
			title: "TIMER",
			text: "0 seconds left",
			ticks: 3600,
			color: "white"
		},
		cannonFixed: {
			blocked: "has fixed the cannon",
			name: "cannonFix",
			image: "https://flatmmo.com/images/objects/cannon1_lower.png",
			title: "CANNON",
			text: "FIXED",
			ticks: 900,
			color: "white"
		},
		cannonBroken: {
			blocked: "The cannon broke",
			name: "cannonFix",
			image: "https://flatmmo.com/images/objects/broken_cannon1_lower.png",
			title: "CANNON",
			text: "BROKEN",
			ticks: 900,
			color: "white"
		},
		fireFish: {
			blocked: "fires fish",
			name: "fishFired",
			image: "https://flatmmo.com/images/items/yellow_fish.png",
			title: "FISH FIRED",
			text: "0/0",
			ticks: 900,
			color: "white"
		},
		bondfirePoints: {
			blocked: "1 bondfire",
			name: "bondfirePoint",
			image: "https://flatmmo.com/images/objects/bondfire1_lower.png",
			title: "BONDFIRE",
			text: "0 points",
			ticks: 900,
			color: "white"
		},
		prepareFire: {
			blocked: "prepare to light",
			name: "ignore",
			image: "https://flatmmo.com/images/items/none.png",
			title: "",
			text: "",
			ticks: 0,
			color: "white"
		},
		lightFire: {
			blocked: "successfully light",
			name: "lightFire",
			image: "https://flatmmo.com/images/objects/fire1_lower.png",
			title: "FIRE",
			text: "0 seconds",
			ticks: 600,
			color: "white"
		},
		lowEnergy: {
			blocked: "too tired",
			name: "lowEnergy",
			image: "https://flatmmo.com/images/ui/sleep.png",
			title: "TIRED",
			text: "0 energy",
			ticks: 600,
			color: "white"
		},
		dehydration: {
			blocked: "due to dehydration",
			name: "dehydration",
			image: "https://flatmmo.com/images/items/water_bucket.png",
			title: "DEHYDRATION",
			text: "-10 hp",
			ticks: 600,
			color: "white"
		},
		sipOfWater: {
			blocked: "sip of water",
			name: "sipOfWater",
			image: "https://flatmmo.com/images/items/water_bucket.png",
			title: "-1 BUCKET",
			text: "",
			ticks: 600,
			color: "white"
		},
		orbDig: {
			blocked: "start digging",
			name: "orbDig",
			image: "https://flatmmo.com/images/items/none.png",
			title: "",
			text: "",
			ticks: 0,
			color: "white"
		},
		noRunning: {
			blocked: "combat has interrupetd",
			name: "noRunning",
			image: "https://flatmmo.com/images/worship/run.png",
			title: "COMBAT",
			text: "No longer Running",
			ticks: 600,
			color: "white"
		},
		fastBite: {
			blocked: "between bites!",
			name: "fastBite",
			image: "https://flatmmo.com/images/items/raw_tuna.png",
			title: "FAST BITE",
			text: "Wait 3 seconds",
			ticks: 600,
			color: "white"
		},
		alreadyRunning: {
			blocked: "already running",
			name: "alreadyRunning",
			image: "https://flatmmo.com/images/worship/run.png",
			title: "",
			text: "",
			ticks: 0,
			color: "white"
		},
		lavaFishing: {
			blocked: "lava to catch",
			name: "lavaFishing",
			image: "https://flatmmo.com/images/worship/run.png",
			title: "",
			text: "",
			ticks: 0,
			color: "white"
		},
	}

	class flatChatPlugin extends FlatMMOPlusPlugin {
		constructor() {
			super("flatChat", {
				about: {
					name: GM_info.script.name,
					version: GM_info.script.version,
					author: GM_info.script.author,
					description: GM_info.script.description
				},
				config: [
					{
						id: "ignorePings",
						label: "Silence Pings",
						type: "boolean",
						default: false
					},
					{
						id: "pingVolume",
						label: "Ping Volume",
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						default: 100,
					},
					{
						id: "showTime",
						label: "Mssage Received Time",
						type: "boolean",
						default: true
					},
					{
						id: "showSpam",
						label: "Show Spam Messages",
						type: "boolean",
						default: false
					},
					{
						id: "hideUnwanted",
						label: "Mark Ignored Words as spoiler",
						type: "boolean",
						default: true
					},
					{
						id: "fontSize",
						label: "Message Font Size",
						type: "number",
						min: 0,
						max: 10,
						step: 0.1,
						default: 1.5
					},
					{
						id: "theme",
						label: "Theme",
						type: "select",
						options: [
							{value: "light", label: "Light"},
							{value: "dark", label: "Dark"},
						],
						default: "dark"
					},
					{
						id: "chatWidth",
						label: "Chat Width",
						type: "range",
						min: 0,
						max: 100,
						step: 1,
						default: 50,
					},
					{
						id: "chatHeight",
						label: "Chat Height",
						type: "number",
						step: 5,
						default: 190
					},
					{
						id: "chatPosition",
						label: "Chat Position",
						type: "select",
						options: [
							{value: "bottomRight", label: "Bottom Right"},
							{value: "bottomLeft", label: "Bottom Left"},
							{value: "topRight", label: "Top Right"},
							{value: "topLeft", label: "Top Left"},
							{value: "outside", label: "Outside"},
							{value: "outsideSideTab", label: "Outside (Side Tabs)"},
						],
						default: "bottomRight"
					},
					{
						id: "profilePage",
						label: "Default Profile",
						type: "select",
						options: [
							{value: "ingame", label: "In-game Profile"},
							{value: "page", label: "Profile Page"},
							{value: "stats", label: "FlatMMO Stats"},
						],
						default: "ingame"
					},
					{
						id: "alwaysOnFocus",
						label: "Keep chat on focus all the time",
						type: "boolean",
						default: false
					},
					{
						id: "pingChat",
						label: "Copy all ping messages on the ping chat",
						type: "boolean",
						default: true
					},
					{
						id: "alwaysTabsPM",
						label: "Always create tabs for PMs",
						type: "boolean",
						default: false
					},
					{
						id: "hideCloseBtn",
						label: "Hide Close Button",
						type: "boolean",
						default: false
					},
					{
						id: "defaultPmChat",
						label: "Default PM Chat Tab",
						type: "select",
						options: [
							{value: "whisper", label: "Whisper"},
							{value: "local", label: "Local"},
							{value: "global", label: "Global"},
						],
						default: "whisper"
					},
					{
						id: "shortcuts",
						label: "Shortcuts List (Use the key between [])",
						type: "object",
						default: {gz: "gratz"},
						key: "Shortcut",
						value: "Message"
					},
					{
						id: "nicknames",
						label: "Nicknames List",
						type: "object",
						default: {dounbot2: "dounbot", felipewolf: "Liam"},
						key: "Username",
						value: "Nickname"
					},
					{
						id: "ignoredPlayers",
						label: "Players Ignored",
						type: "list",
						default: []
					},
					{
						id: "ignoredWords",
						label: "Blocked Words",
						type: "list",
						default: []
					},
					{
						id: "watchedPlayers",
						label: "Watched Players",
						type: "list",
						default: []
					},
					{
						id: "watchedWords",
						label: "Watched Words",
						type: "list",
						default: []
					},
					{
						id: "scriptsToLoad",
						label: "Scripts to Load",
						type: "list",
						unique: true,
						default: []
					},
					{
						id: "themeEditor",
						label: "THEME EDITOR",
						panel: "flatChat-ThemeEditor",
						type: "panel"
					}
				]
			});

			this.defaultChannels = new Set(["channel_local","channel_global","channel_pings","channel_whisper"])
			this.channels = {};
			this.currentChannel = "channel_local";

			//This is for messages received before the chat loads
			this.messagesWaiting = [];

			//This is for the up and down arrows feature
			this.chatHistory = [];
			this.historyPosition = -1;

			this.ignoreClick = false;

			this.lastPM = ""; //Used for /r

			this.themes = {};

			//This is for the /load feature
			this.loadedScripts = new Set();
			this.loadedDependencies = new Set();

			//Versions after 1.0.8 will always auto update
			if(FlatMMOPlus.version < "1.0.8") {
				this.loadScript("fmp");
			}
		}

		async loadScript(id) {
			try {
				if(this.loadedScripts.has(id)) {
					this.showWarning(id + " is already loaded", "red");
					return false;
				}
				let script;
				await fetch('https://scripts.dounford.tech/scripts/' + id).then(async (response) => {
					script = await response.text()
					script = JSON.parse(script);
				})
				for (let dependency in script.dependencies) {

					//Don't load the same dependency more than once
					if(this.loadedDependencies.has(dependency)) {
						break;
					}

					this.createScript(script.dependencies[dependency]);
					this.loadedDependencies.add(dependency);
				}

				this.createScript(script.code);
				this.loadedScripts.add(id);
				return true;
			} catch(err) {
				console.error(id + " was not loaded");
				return false;
			}
		}

		createScript(code) {
			const script = document.createElement("script");
			script.textContent = code;
			document.head.appendChild(script);
		}

		onLogin() {
			this.removeOriginalChat();
			this.addStyle();
			this.addUI();
			this.loadChannels();
			this.switchChannel("local", false);
			this.messagesWaiting.forEach((message)=>{
				if(message.username === "") {
					this.showServerMessage(message);
					return
				}
				this.showMessage(message);
			});
			this.defineCommands();
			ding.volume = this.config.pingVolume / 100;
			this.addThemeEditor();
			this.changeThemeEditor();
			this.showWarning("Welcome to flatmmo.com", "orange");
			this.showWarning(document.querySelectorAll("#chat span")[1].innerHTML, "white");
			this.showWarning(`<span><strong style="color:cyan">FYI: </strong> Use the /help command to see information on available chat commands.</span>`, "white");
			this.configurePosition();

			this.config.scriptsToLoad.forEach(async script => {
				await this.loadScript(script)
			})
		}

		onChat(data) {
			if (data.yell) {
				data.channel = "channel_global";
			} else {
				data.channel = "channel_local";
			}

			if (data.username === "" && data.color === "white") {
				data.color = "server"
			};

			if (data.color === "pink" && data.message.startsWith("[PM")) {
				let match = data.message.match(/\[PM (?:to|from) (.*?)\](.*)/);
				if(match) {
					if(data.message.startsWith("[PM to")) {
						data.color = "pmSent";
					} else {
						data.color = "pmReceived";
					}
					data.username = match[1].trim().replaceAll(" ", "_");
					data.message = match[2].trim();
					if(this.config.ignoredPlayers.includes(data.username)) {
						return
					}
					if(this.config["alwaysTabsPM"] && !this.channels["private_" + data.username]) {
						this.newChannel(data.username, true)
					}
					data.channel = this.channels["private_" + data.username] ? "private_" + data.username : "channel_" + this.config.defaultPmChat;
					this.lastPM = data.username;
				} else {
					console.warn("There was something wrong with this pm:", data.message)
				}
			};

			if(FlatMMOPlus.loggedIn) {
				if(data.username === "") {
					this.showServerMessage(data);
					return
				}
				this.showMessage(data);
			} else {
				this.messagesWaiting.push(data);
			}
		}

		onConfigsChanged() {
			this.changedConfigs.forEach(config => {
				switch (config) {
					case "pingVolume": {
						ding.volume = this.config.pingVolume / 100;
					} break;
					case "fontSize": {
						document.getElementById("flatChatChannels").style.setProperty("--fc-messageFontSize", this.config.fontSize + "rem");
					} break;
					case "theme": {
						const flatChat = document.getElementById("flatChat");
						flatChat.classList.forEach(className => {
							if(className.startsWith("flatChatTheme-")) {
								flatChat.classList.remove(className);
							}
						})
						flatChat.classList.add("flatChatTheme-" + this.config.theme);
					} break;
					case "pingChat": {
						if(this.config.pingChat) {
							document.querySelector(".flatChatTab[data-channel='channel_pings']").classList.remove("displaynone")
						} else {
							document.querySelector(".flatChatTab[data-channel='channel_pings']").classList.add("displaynone")
						}
					} break;
					case "defaultPmChat": {
						if(this.config.defaultPmChat === "whisper") {
							document.querySelector(".flatChatTab[data-channel='channel_whisper']").classList.remove("displaynone")
						} else {
							document.querySelector(".flatChatTab[data-channel='channel_whisper']").classList.add("displaynone")
						}
					} break;
					case "chatWidth": {
						const flatChat = document.getElementById("flatChat");
						flatChat.style.setProperty("--fc-chatWidth", this.config.chatWidth + "%");
					} break;
					case "chatHeight": {
						const flatChat = document.getElementById("flatChat");
						flatChat.style.setProperty("--fc-chatHeight", this.config.chatHeight + "px");
					} break;
					case "chatPosition": {
						this.configurePosition()
					} break;
					case "hideCloseBtn": {
						const closeBtn = document.getElementById("flatChatCloseBtn");
						closeBtn.style.display = this.config.hideCloseBtn ? "none" : "";
					} break;
				}
			})
		}

		saveConfig() {
			localStorage.setItem("flatmmoplus.flatChat.config", JSON.stringify(this.config));
		}

		removeOriginalChat() {
			add_to_chat = function(){};
			refresh_chat_div = function(){};
			paint_chat = function(){};
			document.getElementById("chat").style.display = "none";
			document.querySelector(".chat-input").style.display = "none"

			window.FlatMMOPlus.registerCustomChatCommand(["clear","clean"], (command, data='') => {
				document.querySelector(`#flatChatChannels [data-channel=${FlatMMOPlus.plugins.flatChat.currentChannel}]`).innerHTML = "";
			}, `Clears all messages in chat.`);
		}

		addStyle() {
			document.querySelector(".td-ui").style.height = "auto"
			const style = document.createElement("style");
			style.innerHTML = `#game>table>tbody>tr:nth-child(2) td {
				position: relative;
			}
			#flatChat {
				position: absolute;
				width: var(--fc-chatWidth, 50%);
				background-color: var(--fc-chatBackground);
				border-radius: 0 0 3% 3%;
				user-select: text;
			}
			#flatChatExpandBtn{
				width: 2rem;
				cursor: pointer;
			}
			#flatChatTopBar {
				background-color: var(--fc-topBarBackground);
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				color: var(--fc-tabsTextColor);
				fill: var(--fc-tabsTextColor);
			}
			#flatChatTabs {
				display: flex;
				flex-direction: row;
				font-size: var(--fc-tabFontSize, 1rem);
			}
			.flatChatTab {
				background-color: var(--fc-tabsBackground);
				position: relative;
				border-radius: 15% 15% 0 0;
				margin-right: 1px;
				padding: 0.375rem;
				&:hover {
					background-color: var(--fc-hoverTabBackground);
					cursor: pointer;
				}
			}
			.flatChatTabActive {
				background-color: var(--fc-activeTabBackground);
			}
			.flatChatUnread {
				position: absolute;
				right: 10%;
				top: 0;
				background-color: var(--fc-unreadMessagesBackground);
				color: var(--fc-unreadMessagesTextColor);
				padding: 0 0.3rem;
				border-radius: 0.5rem;
			}
			.flatChatTopBarCollapsed {
				transform: rotate(180deg);
			}
			#flatChatMainArea[closed] {
				display: none;
			}
			#flatChatChannels {
				height: var(--fc-chatHeight, 150px);
				font-size: var(--fc-messageFontSize, 1rem);
			}
			.flatChatChannel {
				width: 100%;
				height: 100%;
				overflow-y: auto;
				scrollbar-width: thin;
			}
			/*messages*/
			.flatChatChannel div {
				overflow-wrap: anywhere;
				color: var(--fc-regularMessageColor);

				span {
					margin-left: 5px;
				}

				a {
					text-decoration: none;
					color: var(--fc-hyperlinkTextColor) !important;

					&:visited {
						color: var(--fc-visitedHyperlinkTextColor) !important;
					}
				}
			}
			.flatChatChannel div:nth-child(even) {
				background-color: var(--fc-evenMessageBackground, var(--fc-chatBackground));
			}
			.flatChatChannel div:nth-child(odd) {
				background-color: var(--fc-oddMessageBackground, var(--fc-chatBackground));
			}
			.fc-timestamp {
				color: var(--fc-messageTimeColor);
			}
			.fc-playerName {
				color: var(--fc-messageSenderUsernameColor);
			}
			.fc-serverMessages {
				color: var(--fc-serverMessageColor) !important;
			}
			.fc-milestoneMessages {
				color: var(--fc-milestoneMessageColor) !important;
			}
			.fc-warningMessages {
				color: var(--fc-warningMessageColor) !important;
			}
			.fc-restMessages {
				color: var(--fc-restMessageColor) !important;
			}
			.fc-lvlUpMessages {
				color: var(--fc-lvlUpMessageColor) !important;
			}
			.fc-areaChangeMessages {
				color: var(--fc-areaChangeMessageColor) !important;
			}
			.fc-pmReceivedMessages {
				color: var(--fc-pmReceivedMessageColor) !important;
			}
			.fc-pmSentMessages {
				color: var(--fc-pmSentMessageColor) !important;
			}
			.fc-pingMessages {
				background-color: var(--fc-pingBackground) !important;
				color: var(--fc-pingTextColor) !important;
			}
			#flatChatBottomBar {
				display: flex;
			}
			#flatChatInputDiv {
				flex: auto;
				display: flex;
				align-items: center;
				border-radius: 0 0 3% 3%;
				background-color: var(--fc-chatBarBackground);
				color: var(--fc-chatBarTextColor);
			}
			#flatChatInput {
				flex: auto;
				border: 0;
				padding: 0;
				margin: 5px;
				background-color: transparent;
				color: var(--fc-chatBarTextColor);
				outline: transparent;
				&::placeholder {
					color: var(--fc-usernameBottomBar);
				}
			}
			.flatChatBtn {
				background-color: var(--fc-buttonsBackground) !important;
				color: var(--fc-buttonsTextColor) !important;
				border: 0 !important;
				padding: 5px;
				height: 100%;
				display: flex;
				align-self: center;
				align-items: center;
				margin-left: 3px;
			}
			.chatSigil {
				width: var(--fc-messageFontSize, 1rem);
				vertical-align: bottom;
				margin-right: 5px;
			}
			.chatName {
				-webkit-background-clip: text;
				background-clip: text;
				color: transparent;
			}
			.flatChatHidden {
				background-color: black;
				color: transparent;
				a {
					color: transparent;
				}
			}
			.flatChatSideTabs {
				display: flex;
				#flatChatTopBar {
					flex-direction: column;
				}
				#flatChatTabs {
					flex-direction: column;
				}
				#flatChatMainArea {
					width: var(--fc-chatWidth, 50%);
				}
			}
			.flatChatLevelTooltip {
				background-color: var(--fc-tooltipBorder, gray) !important;
				div {
					background-color: var(--fc-tooltipBackground, gray) !important;
					color: var(--fc-tooltipTextColor, black) !important;
				}
			}
			#flatChatContextMenu {
				display: flex;
				flex-direction: column;
				align-items: center;
				row-gap: 5px;
				position: absolute;
				padding: 5px;
				background-color: var(--fc-contextMenuBackground) !important;
				border-radius: 5%;
				bottom: 0;
				}
			#flatChatContextMenu button {
				width: 80%;
				color: var(--fc-contextMenuTextColor) !important;
				cursor: pointer;
				font-size: var(--fc-messageFontSize);
				&:hover {
					filter: brightness(0.8);
				}
			}
			#flatChatContextUsername {
				color: var(--fc-contextMenuUsernameColor);
				cursor: text;
				font-size: var(--fc-messageFontSize);
			}
			.flatChatContextBtn {
				background-color: var(--fc-contextMenuButtonBackground) !important;
			}
			.flatChatContextWarningBtn {
				background-color: var(--fc-contextMenuWarningButtonBackground) !important;
			}
			#flatChatCopyUsername {
				visibility: hidden;
				position: absolute;
				top: 0;
				padding: 3px;
				border-radius: 5px;
				background-color: var(--fc-contextMenuBackground);
				color: var(--fc-contextMenuTextColor);
				font-size: var(--fc-messageFontSize);
			}`
			document.head.append(style);

			//Get saved themes
			if(localStorage.getItem("flatChat2-themes")) {
				this.themes = JSON.parse(localStorage.getItem("flatChat2-themes"));
			}

			//Default themes can't be removed
			for (let theme in defaultThemes) {
				if (!this.themes.hasOwnProperty(theme)) {
					this.themes[theme] = defaultThemes[theme];
				}
			}

			for (let theme in this.themes) {
				this.addTheme(theme)
				this.opts.config[6].options = this.opts.config[6].options.filter(t => t.value !== theme)
				this.opts.config[6].options.push({value: theme, label: this.toTitleCase(theme)})
			}
		}

		addUI() {
			const chatDiv = document.createElement("div");
			chatDiv.innerHTML = `<div id="flatChatTopBar">
				<div id="flatChatTabs"></div>
				<div id="flatChatExpandBtn" style="fill:var(--fc-tabsTextColor, white)">
					<svg id="Layer_1" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="
						height: 30px;
						">
						<path d="M256,298.3L256,298.3L256,298.3l174.2-167.2c4.3-4.2,11.4-4.1,15.8,0.2l30.6,29.9c4.4,4.3,4.5,11.3,0.2,15.5L264.1,380.9  c-2.2,2.2-5.2,3.2-8.1,3c-3,0.1-5.9-0.9-8.1-3L35.2,176.7c-4.3-4.2-4.2-11.2,0.2-15.5L66,131.3c4.4-4.3,11.5-4.4,15.8-0.2L256,298.3  z"></path>
					</svg>
				</div>
			</div>
			<div id="flatChatMainArea">
				<div id="flatChatChannels" style="height: var(--fc-chatHeight, 190px);"></div>
				<div id="flatChatBottomBar">
					<button type="text" id="flatChatCloseBtn" class="flatChatBtn">
						<img src="https://cdn.idle-pixel.com/images/x.png">
					</button>
					<div id="flatChatInputDiv">
						<input type="text" id="flatChatInput" autocomplete="off" placeholder="">
						<button type="text" id="flatChatSendBtn" class="flatChatBtn">Send</button>
					</div>
					<button type="button" id="flatChatAutoScrollBtn" class="flatChatBtn">
						<img src="https://cdn.idle-pixel.com/images/x.png" id="flatChatAutoScrollfalse" alt="" class="displaynone">
						<img src="https://cdn.idle-pixel.com/images/check.png" id="flatChatAutoScrolltrue" alt="">
					</button>
				</div>
				<div id="flatChatContextMenu" style="visibility:hidden">
					<span id="flatChatContextUsername" data-user="" class="flatChatContextUsername"></span>
					<button data-action="message" class="flatChatContextBtn">Message</button>
					<button data-action="tabMessage" class="flatChatContextBtn">Message (Tab)</button>
					<button data-action="profile" class="flatChatContextBtn">Profile</button>
					<button data-action="trade" class="flatChatContextBtn">Trade</button>
					<button data-action="stalk" class="flatChatContextWarningBtn">Stalk</button>
					<button data-action="ignore" class="flatChatContextWarningBtn">Ignore</button>
				</div>
				<div id="flatChatCopyUsername" style="visibility:hidden">USERNAME COPIED</div>`
			chatDiv.id = "flatChat";
			chatDiv.style.inset = "auto 0 0 auto";
			chatDiv.style.setProperty("--fc-messageFontSize", this.config.fontSize + "rem")
			chatDiv.style.setProperty("--fc-chatWidth", this.config.chatWidth + "%")
			chatDiv.style.setProperty("--fc-chatHeight", this.config.chatHeight + "px")
			let currentTheme = this.config.theme
			if(this.themes[currentTheme]) {
				chatDiv.classList = "flatChat flatChatTheme-" + this.config.theme;
			} else {
				this.config.theme = "dark";
				chatDiv.classList = "flatChat flatChatTheme-dark";
				this.saveConfig();
			}

			document.getElementById("chat").insertAdjacentElement("beforebegin", chatDiv);

			document.getElementById("flatChatExpandBtn").addEventListener("click", function(){
				this.classList.toggle("flatChatTopBarCollapsed")
				document.getElementById("flatChatMainArea").toggleAttribute("closed");
			})

			document.getElementById("flatChatInput").placeholder = Globals.local_username;

			const closeBtn = document.getElementById("flatChatCloseBtn");
			closeBtn.style.display = this.config.hideCloseBtn ? "none" : "";
			closeBtn.onclick = () => this.closeChannel();

			document.getElementById("flatChatAutoScrollBtn").onclick = () => this.toggleAutoScroll();

			const channelsDiv = document.getElementById("flatChatChannels");

			channelsDiv.onwheel = (event)=>{
				this.scrollChannel(event);
			}

			channelsDiv.addEventListener("click", async (e) => {
				const sender = e.target.closest("[data-sender]");
				if (sender) {
					const username = sender.dataset.sender;
					await navigator.clipboard.writeText(username.replaceAll("_", " "));

					const copyMessage = document.getElementById("flatChatCopyUsername");
					copyMessage.style.visibility = "visible"
					setTimeout(()=>{copyMessage.style.visibility = "hidden"}, 1000);
				}
			});

			//Shows custom context menu on right click
			channelsDiv.addEventListener("contextmenu", (e) => {
				const sender = e.target.closest("[data-sender]");
				if (sender) {
					e.preventDefault()
					const username = sender.dataset.sender;

					const contestUser = document.getElementById("flatChatContextUsername");					
					contestUser.setAttribute("data-user", username);
					contestUser.innerText = username;
					
					const contextMenu = document.getElementById("flatChatContextMenu");
					contextMenu.style.visibility = "visible";
				}
			});

			document.getElementById("flatChatContextMenu").addEventListener("click", (e) => {this.contextMenu(e)})

			//Context menu should close if you click outside
			document.addEventListener("click", (e) => {
				const contextMenu = document.getElementById("flatChatContextMenu");
				if (!contextMenu.contains(e.target)) {
					contextMenu.style.visibility = "hidden";
				}
			});

			document.addEventListener("keydown", (e) => {
				if (e.key === "F4") {
					e.preventDefault();
					this.ignoreClick = !this.ignoreClick;
					if(this.ignoreClick) {
						chatDiv.style.opacity = "0.2";
						chatDiv.style.pointerEvents = "none";
					} else {
						chatDiv.style.opacity = "1";
						chatDiv.style.pointerEvents = "unset";
					}
				}
				//Switch back and forth between channels with tab and shift+tab
				if (e.key === "Tab" && e.target.closest('#flatChat')) {
					e.preventDefault();
					let sibling = null;
					if(e.shiftKey) {
						sibling = document.querySelector(".flatChatTabActive").previousElementSibling || document.querySelector("#flatChatTabs").lastElementChild;
					} else {
						sibling = document.querySelector(".flatChatTabActive").nextElementSibling || document.querySelector("#flatChatTabs").firstElementChild;
					}
					const channel = sibling.dataset.channel
					const match = channel.match(/(.*?)_(.*)/);
					if (match) {
						const type = match[1];
						const channel = match[2];
						this.switchChannel(channel, type === "private")
					}
					return;
				}
				if(document.activeElement === document.getElementById("flatChatInput")) {
					if(e.key === "Enter") {
						if(has_modal_open()) return;
						this.sendMessage();
					}

					const input = document.getElementById("flatChatInput");

					//Navigate between sent messages
					if (e.key === "ArrowUp" && input.selectionStart === 0) {
						if(this.historyPosition + 1 === this.chatHistory.length) {return}
						input.value = this.chatHistory[++this.historyPosition] || "";
						input.selectionStart = input.value.length
					} else if (e.key === "ArrowDown" && input.selectionStart === input.value.length) {
						if(this.historyPosition - 1 < -1) {return}
						input.value = this.chatHistory[--this.historyPosition] || "";
						input.selectionStart = input.value.length
					}
				} else if(e.key === "Enter") {
					if(has_modal_open()) return;
					document.getElementById("flatChatInput").focus({
						preventScroll: true
					})
				}
			}, true)

			document.getElementById("flatChatInput").addEventListener("blur", function(){
				setTimeout(function() {
					if(FlatMMOPlus.plugins.flatChat.config["alwaysOnFocus"] && document.activeElement.tagName !== "INPUT" && document.activeElement.contentEditable !== "true"){
						document.getElementById("flatChatInput").focus({
							preventScroll: true
						})
					}
				}, 1)
			})
		}

		configurePosition() {
			const flatChat = document.getElementById("flatChat");
			if(this.config.chatPosition === "outsideSideTab") {
				flatChat.classList.add("flatChatSideTabs");
				flatChat.style.position = "unset";
			} else {
				flatChat.classList.remove("flatChatSideTabs");
				if(this.config.chatPosition === "outside") {
					flatChat.style.position = "unset";
				} else {
					flatChat.style.position = "absolute";
					flatChat.style.inset = chatInset[this.config.chatPosition];
				}
			}
		}

		addTheme(theme) {
			if(!this.themes[theme]) {return};
			let themeSyle;
			if(document.getElementById("fc-themeStyle-" + theme)) {
				themeSyle = document.getElementById("fc-themeStyle-" + theme)
				themeSyle.innerHTML = "";
			} else {
				themeSyle = document.createElement("style");
				themeSyle.id = "fc-themeStyle-" + theme;
				document.head.appendChild(themeSyle);
			}
			themeSyle.innerHTML = `.flatChatTheme-${theme} {`
			for (let option in this.themes[theme]) {
				themeSyle.innerHTML += `\n\t--fc-${option}: ${this.themes[theme][option]};`
			}
			themeSyle.innerHTML += "\n}"
		}

		addThemeEditor() {
			FlatMMOPlus.addPanel("flatChat-ThemeEditor", "Theme Editor", ()=>{
				let content = `
				<style>
					#ui-panel-flatChat-ThemeEditor-content {
						display: grid;
						grid-template-columns: auto auto;
						font-size: larger;
						height: 550px;
						overflow-y: scroll;

						* {
							border-top: solid 1px black;
							margin-bottom: 5px;
							padding: 5px;
						}

						select {
							grid-column: 1 / span 2;
							text-align: center;
							font-size: large;
						}

						input[type="color"] {
							width: 50px;
							height: 50px;
						}
					}
				</style>
				<select id="flatChat-ThemeEditor-theme" onchange="FlatMMOPlus.plugins.flatChat.changeThemeEditor()">`
				FlatMMOPlus.plugins.flatChat.opts.config[6].options.forEach(theme=>{
					content += `<option value="${theme.value}">${theme.label}</option>`
				})
				content += "</select>"

				for (let option in themesText) {
					content += `<label for="fc-${option}-editor">${themesText[option]}</label>
					<input type="color" id="fc-${option}-editor">`
				}

				content += `<div style="display: grid;grid-template-columns: auto auto;grid-column: 1 / span 2;">
					<input type="text" id="fc-themeName-editor" placeholder="Theme Name" style="grid-column: 1 / span 2;">
					<button type="button" onclick="FlatMMOPlus.plugins.flatChat.saveTheme()">Save</button>
					<button type="button" onclick="FlatMMOPlus.plugins.flatChat.deleteTheme()">Delete Theme</button>

					<input type="text" id="fc-import-editor" placeholder="Import/Export" style="grid-column: 1 / span 2;">
					<button type="button" onclick="FlatMMOPlus.plugins.flatChat.importTheme()">Import</button>
					<button type="button" onclick="FlatMMOPlus.plugins.flatChat.exportTheme()">Export</button>
				</div>
				`
				return content;
			})

		}

		changeThemeEditor() {
			const theme = document.getElementById("flatChat-ThemeEditor-theme").value;
			document.getElementById("fc-themeName-editor").value = document.querySelector(`#flatChat-ThemeEditor-theme option[value=${theme}]`).innerText;
			for (let option in this.themes[theme]) {
				document.getElementById("fc-" + option + "-editor").value = this.themes[theme][option]
			}
		}

		saveTheme() {
			const theme = document.getElementById("fc-themeName-editor").value;
			if(!theme) {return};
			const themeName = this.toCamelCase(theme);

			//Make sure it doesn't duplicate
			if(this.themes[themeName]) {
				this.opts.config[6].options = this.opts.config[6].options.filter(t => t.value !== themeName)
				document.querySelector(`#flatChat-ThemeEditor-theme option[value=${themeName}]`).remove();
			} else {
				this.themes[themeName] = {};
			}

			for (let option in this.themes.dark) {
				const value = document.getElementById("fc-" + option + "-editor").value;
				this.themes[themeName][option] = value;
				if((option === "messageTimeColor" || option === "messageSenderUsernameColor") && value == "#ffffff") {
					this.themes[themeName][option] = "unset";
				}
			}


			this.opts.config[6].options.push({value: themeName, label: theme})

			document.getElementById("flatChat-ThemeEditor-theme").innerHTML += `<option value="${themeName}">${theme}</option>`
			document.getElementById("flatChat-ThemeEditor-theme").value = themeName;

			//Change to new theme
			this.config.theme =  themeName;
			const flatChat = document.getElementById("flatChat");
			flatChat.classList = "flatChat flatChatTheme-" + this.config.theme;
			this.saveConfig();

			localStorage.setItem("flatChat2-themes", JSON.stringify(this.themes));

			this.addTheme(themeName);
		}

		deleteTheme() {
			const theme = document.getElementById("flatChat-ThemeEditor-theme").value;
			console.log(theme)

			//Return if it doesn't exist
			if(!this.themes[theme]) {return};

			//Default themes can't be removed, they will be go back to default instead
			if(theme in defaultThemes)  {
				this.themes[theme] = structuredClone(defaultThemes[theme]);
				this.changeThemeEditor();
				this.saveTheme();
				return;
			};

			//remove from themes
			delete this.themes[theme];

			//remove from fm+ config
			this.opts.config[6].options = this.opts.config[6].options.filter(t => t.value !== theme);

			//Remove the option on theme editor
			document.querySelector(`#flatChat-ThemeEditor-theme option[value=${theme}]`).remove();

			//save themes on localstorage
			localStorage.setItem("flatChat2-themes", JSON.stringify(this.themes));

			//If there is a theme style (it should exist) remove it
			if (document.getElementById("fc-themeStyle-" + theme)) {
				document.getElementById("fc-themeStyle-" + theme).remove();
			}

			this.config.theme =  "dark";
			const flatChat = document.getElementById("flatChat");
			flatChat.classList = "flatChat flatChatTheme-dark";
		}

		importTheme() {
			const themeString = document.getElementById("fc-import-editor").value;
			try {
				const themeObj = JSON.parse(themeString);
				if(!themeObj.name) {return};
				document.getElementById("fc-themeName-editor").value = this.toTitleCase(themeObj.name);
				for (let option in themeObj.theme) {
					document.getElementById("fc-" + option + "-editor").value = themeObj.theme[option]
				}
				this.saveTheme()
			} catch (error) {
				console.error("What you are trying to import is not a valid theme");
			}
		}

		exportTheme() {
			const theme = document.getElementById("flatChat-ThemeEditor-theme").value;
			const themeString = JSON.stringify({name: theme, "theme": this.themes[theme]});
			document.getElementById("fc-import-editor").value = themeString;
		}

		defineCommands() {
			window.FlatMMOPlus.registerCustomChatCommand("ohelp", (command, data='') => {
				Globals.websocket.send(`CHAT=/help`);
			}, `Shows the original vanilla /help`);

			window.FlatMMOPlus.registerCustomChatCommand(["players","who"], (command, data='') => {
				if (this.currentChannel === "channel_global") {
					Globals.websocket.send('CHAT=/players');
				} else if (this.currentChannel === "channel_local") {
					this.showWarning(Object.keys(players).join(", "), "white");
				} else if (this.currentChannel.startsWith("private_")) {
					this.showWarning(`${this.currentChannel.slice(8)} & ${Globals.local_username}`, "white");
				}
			}, `Show all players in room or global.`);

			//Pm will only open a tab if a message is not specified
			window.FlatMMOPlus.registerCustomChatCommand("pm", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				const space = data.indexOf(" ");
				if (space <= 0) {
					this.newChannel(data, true);
					this.switchChannel(data, true);
				} else {
					const receiver = data.substring(0, space);
					const message = data.substring(space + 1);

					Globals.websocket.send(`CHAT=/pm ${receiver} ${message}`);
				}
			}, `Send a private message to someone.<br><strong>Usage:</strong> /pm [username] [message]`);

			window.FlatMMOPlus.registerCustomChatCommand("r", (command, data='') => {
				if (this.lastPM === "") {
					return
				}
				if (data === "") {
					this.newChannel(this.lastPM, true);
					this.switchChannel(this.lastPM, true);
					return;
				}
				const receiver = this.lastPM;
				const message = data;
				Globals.websocket.send(`CHAT=/pm ${receiver} ${message}`);
			}, `Auto respond the last pm.`);

			//pm* will always open a new tab
			window.FlatMMOPlus.registerCustomChatCommand("pm*", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				const space = data.indexOf(" ");
				if (space <= 0) {
					this.newChannel(data, true);
					this.switchChannel(data, true);
				} else {
					const receiver = data.substring(0, space);
					const message = data.substring(space + 1);
					this.newChannel(receiver, true);
					this.switchChannel(receiver, true);
					Globals.websocket.send(`CHAT=/pm ${receiver} ${message}`);
				}
			}, `Opens a private channel in a new tab.<br><b>Usage:</b>/pm* [username] <message (optional)>`);

			window.FlatMMOPlus.registerCustomChatCommand("page", (command, data='') => {
				if (data === "") {
					window.open(`https://flatstats.ravenwoodsoftware.org/player/${Globals.local_username}`,"_blank")
					return;
				}
				window.open(`https://flatstats.ravenwoodsoftware.org/player/${data}`,"_blank");
			}, `Opens the Player Profile Page in a new tab.<br><b>Usage:</b>/page [username]`);

			window.FlatMMOPlus.registerCustomChatCommand("profile", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				Globals.websocket.send("RIGHT_CLICKED_PLAYER=" + data.replaceAll("_", " "));
			}, `Opens the player profile.<br><b>Usage:</b>/profile [username]`);

			window.FlatMMOPlus.registerCustomChatCommand("trade", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				Globals.websocket.send("SEND_TRADE_REQUEST=" + data.replaceAll("_", " "));
			}, `Send a trade request if the player is in the same map.<br><b>Usage:</b>/trade [username]`);

			window.FlatMMOPlus.registerCustomChatCommand("leave", (command, data='') => {
				if (data === "") {
					this.closeChannel();
					return;
				};
				if(data in this.channels) {
					this.closeChannel(data);
				};
			}, `Closes a chat tab.<br><b>Usage:</b>/leave <channel (optional)>`);

			window.FlatMMOPlus.registerCustomChatCommand("ignore", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				this.watchIgnorePlayersWords("ignoredPlayers", data)
			}, `Ignores all messages from user.<br><b>Usage:</b>/ignore [username] (use _ for names with space)`);

			window.FlatMMOPlus.registerCustomChatCommand("unignore", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				this.config.ignoredPlayers = this.config.ignoredPlayers.filter(player => player !== data);
				this.saveConfig();
				this.showWarning(data + " removed from Ignored List");
			}, `Removes someone from the Ignored List.<br><b>Usage:</b>/unignore [username] (use _ for names with space)`);

			window.FlatMMOPlus.registerCustomChatCommand("watch", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				this.watchIgnorePlayersWords("watchedPlayers",data);
			}, `Highlights all messages from user.<br><b>Usage:</b>/watch [username] (use _ for names with space)`);

			window.FlatMMOPlus.registerCustomChatCommand("unwatch", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the username", "red");
					return;
				}
				this.config.watchedPlayers = this.config.watchedPlayers.filter(player => player !== data);
				this.saveConfig();
				this.showWarning(data + " removed from Watched List");
			}, `Removes someone from the Watched List.<br><b>Usage:</b>/unwatch [username] (use _ for names with space)`);

			window.FlatMMOPlus.registerCustomChatCommand("ignoreword", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify one term", "red");
					return;
				}
				this.watchIgnorePlayersWords("ignoredWords",data);
			}, `Ignores all messages that contains this term.<br><b>Usage:</b>/ignoreword [term]`);

			window.FlatMMOPlus.registerCustomChatCommand("unignoreword", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the word", "red");
					return;
				}
				this.config.ignoredWords = this.config.ignoredWords.filter(word => word !== data);
				this.saveConfig();
				this.showWarning(data + " removed from Ignored List");
			}, `Removes a term from the Ignored List.<br><b>Usage:</b>/unignoreword [term]`);

			window.FlatMMOPlus.registerCustomChatCommand("watchword", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify at least one word", "red");
					return;
				}
				this.watchIgnorePlayersWords("watchedWords",data);
			}, `Ping you every time this word is sent.<br><b>Usage:</b>/watchword [word] (use _ for words with space)`);

			window.FlatMMOPlus.registerCustomChatCommand("unwatchword", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the word", "red");
					return;
				}
				this.config.watchedWords = this.config.watchedWords.filter(word => word !== data);
				this.saveConfig();
				this.showWarning(data + " removed from Watched List");
			}, `Removes a term from the Watched List.<br><b>Usage:</b>/unwatchword [term]`);

			window.FlatMMOPlus.registerCustomChatCommand("tick", (command, data='') => {
				this.showWarning(`The current action takes ${progress_bar_target + 1} ticks (${(progress_bar_target + 1) / 2} seconds)`);
			}, `Shows the time needed to complete the current action`);

			window.FlatMMOPlus.registerCustomChatCommand("scripts", async (command, data='') => {
				let scriptList;
				await fetch('https://scripts.dounford.tech/scripts').then(async (response) => {
					scriptList = await response.text()
					scriptList = scriptList.slice(0,-1).split(";");
				})

				scriptList.forEach(item => this.showWarning(item, "cyan"));
				this.showWarning("Use /load [name]", "cyan");
			}, "List all scripts that can be loaded with /load [name]");

			window.FlatMMOPlus.registerCustomChatCommand("load", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the script you want to load", "red");
					return;
				}

				//Only adds to auto load if it exists
				if (this.loadScript(data)) {
					this.config.scriptsToLoad.push(data);
					this.saveConfig();
				}
			}, "Loads a script");

			window.FlatMMOPlus.registerCustomChatCommand("unload", (command, data='') => {
				if (data === "") {
					this.showWarning("You need to specify the script you want to unload", "red");
					return;
				}

				this.config.scriptsToLoad = this.config.scriptsToLoad.filter(script=> script !== data);
				this.saveConfig();
				this.showWarning(data + " will not auto load anymore");
			}, "Remove a script from auto load (it doesn't unload, you need to refresh the page)");

		}

		newChannel(channel, isPrivate) {
			console.log(channel, isPrivate)
			const channelName = (isPrivate ? "private_" : "channel_") + channel;
			if(this.channels[channelName]) {return};
			this.channels[channelName] = {
				name: channel,
				isPrivate,
				autoScroll: true,
				unreadMessages: 0,
				inputText: "",
				lastMessage: "",
				lastSender: "",
			}
			const tabBtn = document.createElement("div");
			tabBtn.className = "flatChatTab";
			tabBtn.setAttribute("data-channel", channelName);
			tabBtn.innerHTML = `<span class="flatChatTabName">${channel.replaceAll("_", " ")}</span>
				<div class="flatChatUnread"></div>`
			document.getElementById("flatChatTabs").appendChild(tabBtn);

			tabBtn.onclick = () => {
				this.switchChannel(channel, isPrivate);
			}

			document.getElementById("flatChatChannels").insertAdjacentHTML("beforeend",`<div class="flatChatChannel" data-channel="${channelName}" style="display:none"></div>`);
			if(isPrivate) {
				const privateChannel = document.querySelector(`#flatChatChannels [data-channel=${channelName}]`);
				privateChannel.insertAdjacentHTML("beforeend",`
				<div class="fc-lvlUpMessages"><strong>${this.getDateStr()}</strong><span>New chat with ${channel}</span></div>`)
				document.querySelectorAll(`[data-channel=${this.config.defaultPmChat}] .fc-pmReceivedMessages,.fc-pmSentMessages`).forEach(el => {
				const match = el.innerText.match(/(?:>|<) (?:\[[0-9][0-9]:[0-9][0-9]])?(.*?):/)
					if(match && match[1] === channel) {
						privateChannel.appendChild(el);
					}
				})
			}
			this.saveChannels();
		}

		closeChannel(channel) {
			const oldChannel = channel || this.currentChannel;
			if(this.defaultChannels.has(oldChannel)) {
				return;
			}

			this.switchChannel("local", false);

			delete this.channels[oldChannel];
			document.querySelector(`#flatChatTabs [data-channel=${oldChannel}]`).remove();
			document.querySelector(`#flatChatChannels [data-channel=${oldChannel}]`).remove();

			this.saveChannels();
		}

		saveChannels() {
			const channels = Object.keys(this.channels);
			localStorage.setItem("flatChat-channels",JSON.stringify(channels))
		}

		loadChannels() {
			const channels = JSON.parse(localStorage.getItem("flatChat-channels") || '["channel_local","channel_global","channel_pings","channel_whisper"]');

			//It should not be possible to remove default channels, but just in case
			this.defaultChannels.forEach(channel => {
				if(!channels.includes(channel)) {
					channels.push(channel)
				}
			})
			channels.forEach(channel => {
				const match = channel.match(/(.*?)_(.*)/);
				if (match) {
					const type = match[1];
					const name = match[2];
					this.newChannel(name, type === "private");
				}
			})

			if(this.config.pingChat) {
				document.querySelector(".flatChatTab[data-channel='channel_pings']")?.classList.remove("displaynone")
			} else {
				document.querySelector(".flatChatTab[data-channel='channel_pings']")?.classList.add("displaynone")
			}
			if(this.config.defaultPmChat === "whisper") {
				document.querySelector(".flatChatTab[data-channel='channel_whisper']")?.classList.remove("displaynone")
			} else {
				document.querySelector(".flatChatTab[data-channel='channel_whisper']")?.classList.add("displaynone")
			}

			document.querySelector(`.flatChatChannel[data-channel=channel_pings]`).addEventListener("click", async (e) => {
				const message = e.target.closest("[data-mid]");
				if (message) {
					const id = message.dataset.mid;
					const channelName = message.dataset.channelname;
					const isPrivate = channelName.slice(0,7) === "private";
					const channel = channelName.slice(8);

					this.switchChannel(channel, isPrivate)
					document.querySelector(`[data-omid="${id}"]`)?.scrollIntoView();
				}
			});
		}

		switchChannel(channel, isPrivate) {
			const input = document.getElementById("flatChatInput");
			//remove old
			document.querySelector(`.flatChatTab[data-channel=${this.currentChannel}]`).classList.remove("flatChatTabActive");
			document.querySelector(`.flatChatChannel[data-channel=${this.currentChannel}]`).style.display = "none";
			this.channels[this.currentChannel].inputText = input.value;

			//update current chat
			const newChannel = (isPrivate ? "private_" : "channel_") + channel
			//Makes sure the channel exists
			if (!this.channels[newChannel]) {
				newChannel = "channel_local"
			};
			this.currentChannel = newChannel;

			//Removes unreadMessages number
			this.channels[this.currentChannel].unreadMessages = 0;
			const unreadDiv = document.querySelector(`.flatChatTab[data-channel=${this.currentChannel}] .flatChatUnread`);
			unreadDiv.style.visibility = "hidden";

			//Change auto scroll icon
			const autoScroll = this.channels[this.currentChannel].autoScroll;
			document.getElementById("flatChatAutoScroll" + autoScroll).className = "";
			document.getElementById("flatChatAutoScroll" + !autoScroll).className = "displaynone";

			//shows the new chat
			document.querySelector(`.flatChatTab[data-channel=${this.currentChannel}]`).classList.add("flatChatTabActive");
			const messageArea = document.querySelector(`.flatChatChannel[data-channel=${this.currentChannel}]`);
			messageArea.style.display = "block";
			input.value = this.channels[this.currentChannel].inputText;

			//Auto scrolls if needed
			if (this.channels[this.currentChannel].autoScroll) {
				messageArea.scrollTop = messageArea.scrollHeight;
			}
		}

		scrollChannel(e) {
			//Zoom in/out chat messages
			if (e.shiftKey) {
				let chat = document.getElementById("flatChat");
				let size = this.config.fontSize || 1
				if (e.deltaY < 0) {
					size = parseFloat((size + 0.1).toFixed(1));
				} else {
					size = parseFloat((size - 0.1).toFixed(1));
				}
				chat.style.setProperty("--fc-messageFontSize", size + "rem")
				this.config.fontSize = size;
				this.saveConfig();
				return;
			}
		}

		toggleAutoScroll() {
			this.channels[this.currentChannel].autoScroll = !this.channels[this.currentChannel].autoScroll;
			document.getElementById("flatChatAutoScrolltrue").classList.toggle("displaynone");
			document.getElementById("flatChatAutoScrollfalse").classList.toggle("displaynone");
		}

		watchIgnorePlayersWords(type, word) {
			//type can be watchedWords, ignoredWords, watchedPlayers, ignoredPlayers
			//Warning first because of the ignoredWord list
			this.showWarning(word + " added to " + type + " list");
			this.config[type].push(word)
			this.saveConfig();
		}

		contextMenu(e) {
			const data = e.target.closest("[data-action]");
			if (data) {
				const username = document.getElementById("flatChatContextUsername").dataset.user;
				const action = data.dataset.action;
				const input = document.getElementById("flatChatInput");
				switch (action) {
					case "message": {
						input.value = "/pm " + username + " ";
						input.focus();
					} break;
					case "tabMessage": {
						this.newChannel(username, true);
						this.switchChannel(username, true);
					} break;
					case "profile": {
						switch(this.config.profilePage) {
							case "ingame": {
								Globals.websocket.send("RIGHT_CLICKED_PLAYER=" + username.replaceAll("_", " "));
							} break;
							case "page": {
								window.open(`https://flatmmo.com/profile/?user=${username.replaceAll("_", " ")}`, '_blank');
							} break;
							case "stats": {
								window.open(`https://flatstats.ravenwoodsoftware.org/player/${username.replaceAll("_", " ")}`, '_blank');
							} break;
						}
					} break;
					case "trade": {
						Globals.websocket.send("SEND_TRADE_REQUEST=" + username.replaceAll("_", " "));
					} break;
					case "stalk": {
						this.watchIgnorePlayersWords("watchedPlayers", username);
					} break;
					case "ignore": {
						this.watchIgnorePlayersWords("ignoredPlayers", username);
					} break;
				}

				const contextMenu = document.getElementById("flatChatContextMenu");
				contextMenu.style.visibility = "hidden";
			}
		}

		updateUnread(channel) {
			if(channel !== this.currentChannel) {
				const unreadMessages = ++this.channels[channel].unreadMessages;
				const unreadDiv = document.querySelector(`.flatChatTab[data-channel=${channel}] .flatChatUnread`);
				unreadDiv.innerText = unreadMessages
				unreadDiv.style.visibility = "visible";
			}
		}

		//Server messages don't require some of the checks, most is the same as user messages, but I think it is better to have them as different functions now
		showServerMessage(data, html = false) {
			// data = {
			//     username: "",
			//     tag: "none",
			//     sigil: "none",
			//     color: "white",
			//     message: "oi gente",
			//     yell: false,
			//     channel: "channel_local"
			//     channel: "private_dounford"
			//     usernameColor: "red"
			// }

			//If for some reason the channel does not exist
			if(!data.channel in this.channels) {
				data.channel = "channel_local"
			}

			let message = data.message;

			for (const not in textToNotification) {
				if(message.includes(textToNotification[not].blocked)) {
					this.updateNotification(message, not);
					this.showNotification(not);
					return;
				}
			}

			let messageContainer = document.createElement('div');

			if (messageColors[data.color]) {
				messageContainer.className += " fc-" + messageColors[data.color]
			} else {
				//In case a color that doesn't has a variable yet is used
				messageContainer.style.color = data.color || "white";
			}

			//Message reiceived time [12:43]
			if (this.config.showTime) {
				const timeStrong = document.createElement("strong");
				timeStrong.className = "fc-timestamp"
				timeStrong.innerHTML = this.getDateStr();
				messageContainer.appendChild(timeStrong);
			}

			//For now it will never use html, but maybe Smitty changes something in the future
			const messageSpan = document.createElement('span');
			if (html) {
				messageSpan.innerHTML = message;
			} else {
				messageSpan.innerText = message;
			}

			//I find it hard to believe that the server will ever send links, but just in case...
			messageSpan.innerHTML = anchorme({
				input: messageSpan.innerHTML,
				options: {
					attributes: {
						target: "_blank",
						class: "detected"
					}
				},
			});

			//If the message contains any ignored word it will ignore the message or mark as spoiler
			if(this.config.ignoredWords.some(word => message.includes(word))) {
				if(this.config["hideUnwanted"]) {
					messageSpan.style.cursor = "pointer";
					messageSpan.classList.add("flatChatHidden");
					messageSpan.onclick = ()=>{
						messageSpan.classList.toggle("flatChatHidden")
					}
				} else {
					return;
				}
			}

			messageContainer.appendChild(messageSpan);

			const messageArea = document.querySelector(`#flatChatChannels [data-channel=${data.channel}]`);
			messageArea.appendChild(messageContainer);

			//Update the unread messages number if needed
			this.updateUnread(data.channel);

			if (this.channels[data.channel].autoScroll) {
				messageArea.scrollTop = messageArea.scrollHeight;
			}
		}

		showMessage(data, html = false) {
			// data = {
			//     username: "dounford",
			//     tag: "none",
			//     sigil: "none",
			//     color: "white",
			//     message: "oi gente",
			//     yell: false,
			//     channel: "channel_local"
			//     channel: "private_dounford"
			//     usernameColor: "red"
			// }

			//If for some reason the channel does not exist
			if(!data.channel in this.channels) {
				data.channel = "channel_local"
			}

			let message = data.message;

			//This should prevent some spam to show
			const lastSender = this.channels[data.channel]?.lastSender || "";
			const lastMessage = this.channels[data.channel]?.lastMessage || "";
			if (lastSender === data.username && lastMessage === data.message && !this.getConfig("showSpam")) {
				return;
			}

			//If the message sender is blocked the message will be ignored
			if(this.config.ignoredPlayers.includes(data.username)) {
				return;
			}

			let messageContainer = document.createElement('div');

			//Ping if any watched word is present or if the message contains the username
			//Doesn't ping if it is yours message
			const isMention = message.includes("@" + Globals.local_username);
			const hasWatchedWord = this.config.watchedWords.some(word => message.includes(word));
			let isPing = false;
			if (data.username !== Globals.local_username && (isMention || hasWatchedWord)) {
				isPing = this.config.pingChat;
				messageContainer.className = "fc-pingMessages";
				//Ignore ping is just about the sound
				if(!this.config.ignorePings) {
					ding.play();
				}
			}

			if (data.color && data.color !== "white" && data.color !== "grey") {
				if (messageColors[data.color]) {
					messageContainer.className += " fc-" + messageColors[data.color]
				} else {
					//In case a color that doesn't has a variable yet is used
					messageContainer.style.color = data.color;
				}
			}

			//Message reiceived time [12:43]
			if (this.config.showTime) {
				const timeStrong = document.createElement("strong");
				timeStrong.className = "fc-timestamp"
				timeStrong.innerHTML = this.getDateStr();
				messageContainer.appendChild(timeStrong);
			}

			if (data.tag && data.tag !== "none") {
				let tag = document.createElement("span");

				tag.innerText = data.tag === "investor-plus" ? "INVESTOR" : data.tag === "moderator" ? "MOD" : data.tag.toUpperCase();
				tag.classList.add("chat-tag-" + data.tag);
				messageContainer.appendChild(tag);
			}

			if (data.sigil && data.sigil !== "none") {
				const sigilImg = new Image();
				sigilImg.className = "chatSigil"

				if (IPSigils.has(data.sigil)) {
					//I'm using IP sigils for now, FMMO sigils have terrible resolution
					sigilImg.src = "https://cdn.idle-pixel.com/images/" + data.sigil.slice(10);
				} else {
					sigilImg.src = "https://flatmmo.com/" + data.sigil;
				}

				messageContainer.appendChild(sigilImg);
			}

			let isPm = data.channel.startsWith("private_");

			if (data.username) {
				const senderStrong = document.createElement("strong");
				let username = data.username.replaceAll("_", " ");
				if(isPm && data.color === "pmSent") {
					username = Globals.local_username;
				}
				username = this.config.nicknames[username] || username;
				senderStrong.innerText = username + ":";
				senderStrong.className = "fc-playerName";
				senderStrong.setAttribute("data-sender", data.username.replaceAll(" ", "_"));
				messageContainer.appendChild(senderStrong);

				if(this.config.watchedPlayers.includes(data.username) && !isPm) {
					messageContainer.className = "fc-pingMessages";
				}
			} else {
				for (const not in textToNotification) {
					if(message.includes(textToNotification[not].blocked)) {
						this.updateNotification(message, not);
						this.showNotification(not);
						return;
					}
				}
			}

			const messageSpan = document.createElement('span');
			const match = message.match(/My (.*?) level is: (.*?) \((.*?) xp\)/);
			if(match) {
				const [_, skill, level, xp] = match;
				this.createLevelTooltip(messageSpan, this.toTitleCase(skill), level, xp);
			} else if (html) {
				messageSpan.innerHTML = message;
			} else {
				messageSpan.innerText = message;
			}

			messageSpan.innerHTML = anchorme({
				input: messageSpan.innerHTML,
				options: {
					attributes: {
						target: "_blank",
						class: "detected"
					}
				},
			});

			//If the message contains any ignored word it will ignore the message or mark as spoiler
			if(this.config.ignoredWords.some(word => message.includes(word))) {
				if(this.config["hideUnwanted"]) {
					messageSpan.style.cursor = "pointer";
					messageSpan.classList.add("flatChatHidden");
					messageSpan.onclick = ()=>{
						messageSpan.classList.toggle("flatChatHidden")
					}
				} else {
					return;
				}
			}
			messageContainer.appendChild(messageSpan);

			const messageArea = document.querySelector(`#flatChatChannels [data-channel=${data.channel}]`);
			messageArea.appendChild(messageContainer);
			//Clones the message on the ping channel
			if(isPing) {
				const pingElement = messageContainer.cloneNode(true);
				pingElement.className = ""; //Every message is a ping, there is no reason to highlight them

				const mid = Date.now();
				messageContainer.setAttribute("data-omid", mid);
				pingElement.setAttribute("data-mid", mid);
				pingElement.setAttribute("data-channelname", data.channel);

				document.querySelector(`.flatChatChannel[data-channel=channel_pings]`).appendChild(pingElement);
				
				//Update the unread messages number if needed
				if(this.currentChannel !== "channel_pings") {
					this.updateUnread("channel_pings");
				}
			}
			
			if(data.channel !== this.currentChannel) {
				//Update the unread messages number if needed
				this.updateUnread(data.channel);
			}

			if (this.channels[data.channel].autoScroll) {
				messageArea.scrollTop = messageArea.scrollHeight;
			}

			this.channels[data.channel].lastSender = data.username;
			this.channels[data.channel].lastMessage = data.message;
		}

		createLevelTooltip(element, skill, level, xp) {
			const ixp = parseInt(xp.replaceAll(",",""));
			level = parseInt(level);
			let nextLvl = "";
			if(skill !== "Global" && level !== 100) {
				const value = format_number(FlatMMOPlus.level[level + 1] - ixp);
				nextLvl = `<div>XP to Level Up: ${value}</div>`
			}
			element.innerHTML = `<span class="flatChatLevelSpan">Lvl ${level} ${skill}</span>
			<div class="tooltiptext flatChatLevelTooltip">
				<div>${skill}</div>
				<div>Level: ${level}</div>
				<div>XP: ${xp}</div>
				${nextLvl}
			</div>`;
			element.classList.add("tooltip");
		}

		updateNotification(message, blocked) {
			switch (blocked) {
				case "nessieTime": {
					textToNotification[blocked].text = message.slice(0,-1);
				} break;
				case "fireFish": {
					const match = message.match(/\((.*)\)/);
					if (match) {
						textToNotification[blocked].text = match[1];
					} else {
						textToNotification[blocked].text = "0/0";
					}
				} break;
				case "bondfirePoints": {
					const match = message.match(/\((.*) /);
					if (match) {
						textToNotification[blocked].text = match[1] + " points";
					} else {
						textToNotification[blocked].text = "0 points";
					}
				} break;
				case "lightFire": {
					const match = message.match(/last (.*) /)
					if (match) {
						textToNotification[blocked].text = match[1] + " seconds";
					} else {
						textToNotification[blocked].text = "0 seconds";
					}
				} break;

			}
		}

		showNotification(blocked) {
			const not = textToNotification[blocked];
			FlatMMOPlus.addNotification(not.name, not.image, not.title, not.text, not.ticks, not.color);
		}

		showWarning(message, color = "aquamarine") {
			const data = {
				username: "",
				tag: "none",
				sigil: "none",
				color: color,
				message: message,
				yell: false,
				channel: this.currentChannel
			}
			this.showMessage(data, true);
		}

		sendMessage() {
			let message = document.getElementById("flatChatInput").value.trim();
			if (!message) {return};

			//[here] can't be modified, it will always use the current_map id
			message = message.replace("[here]", current_map);
			//This replaces all [shortcuts]
			Object.keys(this.config.shortcuts).forEach(shortcut => message = message.replaceAll(`[${shortcut}]`, this.config.shortcuts[shortcut]));

			document.getElementById("flatChatInput").value = "";
			this.channels[this.currentChannel].inputText = "";

			if(message !== this.chatHistory[0]) {
				this.chatHistory.unshift(message);
			}
			this.historyPosition = -1;


			if(message.startsWith("/")) {
				const space = message.indexOf(" ");
				let command;
				let data;
				if (space <= 0) {
					command = message.substring(1);
					data = "";
				} else {
					command = message.substring(1, space);
					data = message.substring(space + 1);
				}

				if (window.FlatMMOPlus.handleCustomChatCommand(command, data)) {
					return
				} else {
					Globals.websocket.send('CHAT=' + message);
					return;
				}
			}

			const maxlength = this.currentChannel.startsWith("channel") ? 95 : 85;
			const messageArray = this.divideStringByLength(message, maxlength);
			const isPM = message.startsWith("/pm");
			for (let i = 0; i < messageArray.length; i++) {
				if(this.currentChannel === "channel_whisper" || (isPM && i > 0)) {
					FlatMMOPlus.customChatCommands.r("r", messageArray[i])
				} else if(this.currentChannel === "channel_local") {
					Globals.websocket.send('CHAT=' + messageArray[i]);
				} else if(this.currentChannel === "channel_global") {
					Globals.websocket.send('CHAT=/yell ' + messageArray[i]);
				} else if (this.currentChannel.startsWith("private_")) {
					const username = this.currentChannel.slice(8);
					Globals.websocket.send(`CHAT=/pm ${username} ${messageArray[i]}`);
				}
			}
		}

		//Utilities functions
		getDateStr(timestamp) {
			const date = timestamp ? new Date(timestamp) : new Date();
			const hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
			const min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
			const dataStr = '[' + hour + ':' + min + ']'
			return dataStr;
		}

		toCamelCase(str) {
			if (!str || typeof str !== 'string') {
				return '';
			}

			const words = str.split(/[\s_-]+/);

			const camelCaseWords = words.map((word, index) => {
				if (index === 0) {
					return word.toLowerCase();
				} else {
					return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
				}
			});

			return camelCaseWords.join('');
		}

		toTitleCase(str) {
			const result = str.replace(/([A-Z])/g, " $1");
			return result.charAt(0).toUpperCase() + result.slice(1)
		}

		divideStringByLength(str, l, delimiterChat = " "){
			const strs = [];
			while(str.length > l){
				let pos = str.substring(0, l).lastIndexOf(delimiterChat);
				pos = pos <= 0 ? l : pos;
				strs.push(str.substring(0, pos));
				let i = str.indexOf(delimiterChat, pos)+1;
				if(i < pos || i > pos+l)
					i = pos;
				str = str.substring(i);
			}
			strs.push(str);
			return strs;
		}
	}

	const plugin = new flatChatPlugin();
	FlatMMOPlus.registerPlugin(plugin);

})();