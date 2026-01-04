// ==UserScript==
// @name         Alienware Arena Helper Reloaded
// @namespace    https://github.com/marcodallagatta/userscripts/raw/main/alienware-arena-helper-reloaded
// @version      2022.12.02.17.44
// @description  Makes earning daily ARP easier
// @author       Marco Dalla Gatta
// @match        https://*.alienwarearena.com/*
// @license      MIT
// @icon         https://www.alienwarearena.com/favicon.ico
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/450229/Alienware%20Arena%20Helper%20Reloaded.user.js
// @updateURL https://update.greasyfork.org/scripts/450229/Alienware%20Arena%20Helper%20Reloaded.meta.js
// ==/UserScript==

function awaHelper() {
	// You can configure options through the user interface. It is not recommended to edit the script for these purposes.
	const version = "2.1.0";

	let contentToCheck = [];
	let saveOptionsTimer;

	// Embed style
	document.head.appendChild(document.createElement("style")).textContent = `
    /* script buttons */
    .awah-btn-cons,
    .awah-btn-cons:hover {color: gold;}
    .list-group-item > .awah-btn-cons {width: 50%;}
    .list-profile-actions > li > .awah-btn-cons {width: 50%;}
    .awah-btn-cons.disabled {position: relative;}
    .awah-btn-quest.disabled::before,
    .awah-btn-cons.disabled::before {content: ''; width: 100%; height: 100%; position: absolute; top: 0; left: 0; background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACAQMAAABIeJ9nAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABlBMVEUAAAAAAAClZ7nPAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAMSURBVAjXY2hgYAAAAYQAgSjdetcAAAAASUVORK5CYII=');}
    .awah-btn-quest {padding-left: 0.25rem; padding-right: 0.25rem;}
    .awah-btn-quest.disabled::before {filter: invert(60%)}
    .awah-panel {margin: 20px 0;}
    .awah-activate-steam-key-btn {text-decoration: none !important; padding: 1px 5px; background-color: rgba( 48, 95, 128, 0.9 ); vertical-align: inherit;}
    .awah-activate-steam-key-btn:hover {background: linear-gradient( -60deg, #417a9b 5%,#67c1f5 95%);}

    /* script tooltips */
    .awah-info-btn {cursor: pointer; opacity: 0.4; transition: opacity 0.25s ease-in-out;}
    .awah-info-btn:hover {opacity: 1;}
    [data-awah-tooltip] {position: relative;}
    [data-awah-tooltip]:after {content: attr(data-awah-tooltip); pointer-events: none; padding: 4px 8px; color: white; position: absolute; left: 0; bottom: 100%; opacity: 0; font-weight: normal; text-transform: none; font-size: 0.9rem; white-space: pre; box-shadow: 0px 0px 3px 0px #54bbdb; background-color: #0e0e0e; transition: opacity 0.25s ease-out, bottom 0.25s ease-out; z-index: 1000;}
    [data-awah-tooltip]:hover:after {bottom: -100%; opacity: 1;}

    /* script GUI */
    #awah-status-overlay {display: flex; flex-flow: column nowrap; align-items: flex-end; color: white; font-size: smaller !important; pointer-events: none; position: fixed; bottom: 0; right: 0; max-width: 40%; min-width: 20%; padding: 1rem 0.5rem 0 0; text-shadow: 2px 2px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0), 2px 2px 5px rgb(0, 0, 0), -1px -1px 5px rgb(0, 0, 0), 0px 0px 10px rgb(0, 0, 0); text-align: right; background: rgba(0, 0, 0, 0) linear-gradient(to right bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.85) 85%, rgba(0, 0, 0, 0.85) 100%) no-repeat scroll 0 0; z-index: 9001;}
    #awah-status-overlay .fa-exclamation-triangle {color: red;}
    #awah-status-overlay a,
    #awah-status-overlay button {pointer-events: all;}
    #awah-status-overlay button {background-color: rgba(255, 255, 255, 0.6);}
    #awah-status-messages {display: flex; flex-flow: column nowrap; align-items: flex-end; white-space: nowrap; border-bottom: 1px solid #1c1e22;}
    #awah-status-messages > div {clear: both; position: relative; animation: awah-slide-from-bottom 0.3s ease-out 1 forwards;}
    .awah-arp-pts {clear: both; width: 100%}
    .awah-arp-pts > div {clear: both; width: 100%; background-position: 50% 50%; background-repeat: no-repeat; background-size: 100% 14px;}
    .awah-arp-pts > div::after {content: ""; display: block; height: 0; clear: both;}
    .awah-grey {color: #767676;}
    .awah-casper-out {overflow: hidden !important; animation: awah-casper-out 0.6s ease-in !important;}
    .awah-rotating {animation: awah-rotating 2s linear infinite;}

    li.awah-nav-panel {}
    li.awah-nav-panel > a.nav-link {width: 2.5rem; height: 2.5rem; float: left; cursor: pointer;}
    li.awah-nav-panel > a.nav-link > i {font-size: 26px;}

    .awah-daily-reset-timer {min-width: 22%;}
    .toast-body table tbody > :nth-child(2n) {background: #090909}

    /* script options */
    .awah-options-btn {float: left; padding-left: 16px; cursor: pointer; transition: text-shadow 0.25s ease-in-out;}
    .awah-options-btn:hover {text-shadow: 0px 0px 3px rgba(75, 201, 239, 1), 0px 0px 12px rgba(75, 201, 239, 1); /* animation: awah-breathing-text-neon 2s ease 0s infinite alternate; */}
    #awah-options {display: flex; flex-flow: column nowrap; overflow: auto; position: fixed; height: 100vh; width: 30vw; right: calc(-5px - 30vw); padding: 0 11px 2rem 11px; text-shadow: 2px 2px 2px rgb(0, 0, 0), -1px -1px 2px rgb(0, 0, 0); text-align: right; background: rgba(0, 0, 0, 0.85) repeat scroll 0 0; box-shadow: 0px 0px 3px 0px #54bbdb; transition: right 0.3s; z-index: 9000;}
    .awah-option {border-bottom: 1px solid #1c1e22; margin-bottom: 11px;}
    .awah-option label {display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: baseline; color: whitesmoke;}
    #awah-options > :first-child {display: flex; flex-flow: row nowrap; justify-content: space-between; align-items: baseline;}
    .awah-opt-input {width: 24%; text-align: right; padding: 0 5px; height: auto; background: transparent; color: white; border-width: 0px 0px 1px 0px;}
    .awah-opt-desc {font-size: smaller;}
    .awah-option > .btn-danger {width: 100%;}
    #awah-options .dismiss-menu {font-size: 32px;}

    /* custom checkbox */
    input.awah-opt-input[type="checkbox"] {position: absolute; right: 0; opacity: 0;}
    input.awah-opt-input[type="checkbox"]:focus + div {border-color: #66afe9; outline: 0; -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);}
    .awah-opt-input[type="checkbox"] + div {transition: 0.25s all ease; position: relative; overflow: hidden; cursor: pointer;}
    .awah-opt-input[type="checkbox"] + div > div {transition: 0.25s all ease; background-color: #428bca; width: 50%; height: 100%; position: absolute; left: 0;}
    input.awah-opt-input[type="checkbox"]:checked + div {background-color: rgb(66, 139, 202, 0.4);}
    input.awah-opt-input[type="checkbox"]:checked + div > div {left: calc(100% - 50%);}
    .awah-opt-input[type="checkbox"] + div > div::before {content: 'ON'; position: absolute; right: 120%;}
    .awah-opt-input[type="checkbox"] + div > div::after {content: 'OFF'; color: #767676; position: absolute; left: 120%;}

    /* comments */
    .insignia-label::before {content: attr(data-arp-level); font-size: 10px; width: 35px; /* 30 for master */ line-height: 30px; /* 26 for master */ position: absolute; text-align: center; pointer-events: none;}

    /* user profile */
    .awah-sub-recent-activity {text-align: center; font-size: smaller; margin-bottom: 10px; margin-top: -10px;}
    section.um-profile__friends {flex-wrap: wrap;}

    @keyframes awah-slide-from-bottom {
      from {opacity: 0.5; bottom: -90px; max-height: 0px;}
      to {opacity: 1; bottom: 0px; max-height: 70px;}
    }
    @keyframes awah-casper-out {
      0%		{filter: blur(0px); max-height: 50px;}
      100%	{filter: blur(15px); max-height: 0px;}
    }
    @keyframes awah-breathing-text-neon {
      from {text-shadow: 0px 0px 3px rgba(75, 201, 239, 0.25), 0px 0px 12px rgba(75, 201, 239, 0.25);}
      to {text-shadow: 0px 0px 3px rgba(75, 201, 239, 1), 0px 0px 12px rgba(75, 201, 239, 1);}
    }
    @keyframes awah-rotating {
      from {transform: rotate(0deg);}
      to {transform: rotate(360deg);}
    }
    @keyframes awah-element-appears-hook {
      from {opacity: 0.99;}
      to {opacity: 1;}
    }
    .giveaways__listing .row > div {animation-duration: 0.001s; animation-name: awah-element-appears-hook;}
    #giveaway-flash-message {animation-duration: 0.001s; animation-name: awah-element-appears-hook;}

    /* Fix for Alienware Arena design bugs */
    .overlay {position: fixed !important;} /* without it .overlay sticks to top of the site and can be skipped by scrolling */
    .videos__listing .videos__listing-post img {max-height: 299px;} /* videos without thumbnail have bigger height and stretching out of the general row */
    `;

	class Options {
		constructor() {
			this.load();
		}

		default () {
			return {
				statusMessageDelay: 10000,
				actionsDelayMin: 500,
				actionsDelayMax: 2000,
				twitchPlayerRemove: false,
				twitchWatchAutomate: true,
				timeOnSiteCheck: true,
				version
			};
		}

		load() {
			let defaultOptions = this.default();
			Object.keys(defaultOptions).forEach((key) => (this[key] = defaultOptions[key]));

			let savedOptions = JSON.parse(localStorage.getItem("AlienwareArenaHelperOptions"));
			if (savedOptions !== null) {
				Object.keys(savedOptions).forEach((key) => (this[key] = savedOptions[key]));
			}
		}

		save() {
			this.actionsDelayMin = parseInt(document.querySelector("#awah-actions-delay-min").value, 10);
			this.actionsDelayMax = parseInt(document.querySelector("#awah-actions-delay-max").value, 10);
			this.twitchPlayerRemove = document.querySelector("#awah-twitchPlayerRemove").checked;
			this.twitchWatchAutomate = document.querySelector("#awah-twitchWatchAutomate").checked;
			this.timeOnSiteCheck = document.querySelector("#awah-timeOnSiteCheck").checked;
			this.statusMessageDelay = parseInt(document.querySelector("#awah-status-message-delay").value, 10);

			try {
				localStorage.setItem("AlienwareArenaHelperOptions", JSON.stringify(this));
				return true;
			} catch (e) {
				console.warn(e);
				return false;
			}
		}
	}

	let options = new Options();

	class UI {
		constructor() {
			this.hideOverlayAdditionalFunctions = [];
			this.hideOverlayHook();
			this.initNavPanel();
			this.initStatusOverlay();
			this.initOptionsUI();

			document.addEventListener(
				"animationend",
				function(event) {
					if (event.animationName === "awah-casper-out") {
						event.target.remove();
					}
				},
				false
			);
		}

		initNavPanel() {
			let anchor = document.querySelector("li#notification-dropdown");
			this.navPanel = document.createElement("li");
			this.navPanel.classList.add("nav-item", "awah-nav-panel");
			anchor.insertAdjacentElement("beforebegin", this.navPanel);
		}

		initStatusOverlay() {
			let statusOverlayElement = document.createElement("div");
			statusOverlayElement.id = "awah-status-overlay";
			statusOverlayElement.insertAdjacentHTML("afterbegin", '<div id="awah-status-messages"></div><div class="awah-arp-pts"></div>');
			this.messagesContainerElement = statusOverlayElement.querySelector("#awah-status-messages");
			this.messagesContainerElement.insertAdjacentHTML("beforeend", `<div class="awah-con-check-queue" style="display: none;">content to check: <span class="awah-con-check-queue-length">${contentToCheck.length}</span> <span class="fa fa-fw fa-search"></span></div>`);
			document.getElementById("content").appendChild(statusOverlayElement);
		}

		initOptionsUI() {
			this.navPanel.insertAdjacentHTML("beforeend", '<a class="nav-link awah-options-btn" data-awah-tooltip="AWA Helper options"><i aria-hidden="true" class="fa fa-fw fa-cog"></i></a>');

			document.querySelector("div.wrapper").insertAdjacentHTML(
				"beforebegin",
				`<div id="awah-options" style="visibility: hidden;">
        <div class="awah-option">
        <a class="dismiss-menu" data-awah-tooltip="Close options"><i aria-hidden="true" class="fas fa-times"></i></a>
        <span class="awah-opt-desc awah-grey">Alienware Arena Helper Realoaded v<b>${version}</b></span>
        </div>

        <div class="awah-option">
        <label><span class="awah-opt-title">actionsDelayMin</span><input id="awah-actions-delay-min" class="form-control awah-opt-input" type="text" value="${options.actionsDelayMin}"></label>
        <label><span class="awah-opt-title">actionsDelayMax</span><input id="awah-actions-delay-max" class="form-control awah-opt-input" type="text" value="${options.actionsDelayMax}"></label>
        <span class="awah-opt-desc awah-grey">Minimum and maximum random delay time between network actions. (milliseconds)<br>Default minimum: ${options.default().actionsDelayMin} || Default maximum: ${options.default().actionsDelayMax}</span>
        </div>

        <div class="awah-option">
        <label><span class="awah-opt-title">Remove Twitch Player from Homepage</span><input id="awah-twitchPlayerRemove" class="form-control awah-opt-input" type="checkbox" ${options.twitchPlayerRemove ? "checked" : ""}><div class="form-control awah-opt-input"><div>&nbsp;</div>&nbsp;</div></label>
        <span class="awah-opt-desc awah-grey">Removes the player to save resources. Default: ${options.default().twitchPlayerRemove ? "ON" : "OFF"}</span>
        </div>

        <div class="awah-option">
        <label><span class="awah-opt-title">Automate Twitch Watching</span><input id="awah-twitchWatchAutomate" class="form-control awah-opt-input" type="checkbox" ${options.twitchWatchAutomate ? "checked" : ""}><div class="form-control awah-opt-input"><div>&nbsp;</div>&nbsp;</div></label>
        <span class="awah-opt-desc awah-grey">A popup will appear to open the AWA Twitch page, that page will automatically refresh if no streamers are live and open a stream if they are. Default: ${options.default().twitchWatchAutomate ? "ON" : "OFF"}</span>
        </div>

        <div class="awah-option">
        <label><span class="awah-opt-title">Time On Site Notification</span><input id="awah-timeOnSiteCheck" class="form-control awah-opt-input" type="checkbox" ${options.timeOnSiteCheck ? "checked" : ""}><div class="form-control awah-opt-input"><div>&nbsp;</div>&nbsp;</div></label>
        <span class="awah-opt-desc awah-grey">A popup will appear when you haven't spent enough time on AWA to get the daily points. Default: ${options.default().timeOnSiteCheck ? "ON" : "OFF"}</span>
        </div>

        <div class="awah-option">
        <label><span class="awah-opt-title">statusMessageDelay</span><input id="awah-status-message-delay" class="form-control awah-opt-input" type="text" value="${options.statusMessageDelay}"></label>
        <span class="awah-opt-desc awah-grey">How long the status messages will be displayed before they disappear. This doesn't affect persistent notifications such as uncompleted quests. (milliseconds)<br>Default: ${options.default().statusMessageDelay}</span>
        </div>

        <div class="awah-option">
        <button id="awah_restore_default" class="btn btn-danger"><span class="fa fa-exclamation-triangle"></span> Restore default</button>
        <span class="awah-opt-desc awah-grey">Restore default settings.</span>
        </div>

        </div>`
			);

			document.querySelectorAll('input.awah-opt-input[type="text"]').forEach((elem) => {
				elem.addEventListener("input", function() {
					this.value = this.value.replace(/[^\d]/, "");
					this.value = this.value.slice(0, 5);
				});
			});

			document.querySelectorAll("input.awah-opt-input").forEach((elem) => {
				elem.addEventListener("change", function() {
					clearTimeout(saveOptionsTimer);
					saveOptionsTimer = setTimeout(function() {
						if (options.save()) {
							ui.newStatusMessage('Settings saved! <span class="fa fa-fw fa-floppy-o"></span>');
						} else {
							ui.newStatusMessage('Error! See console for details. <span class="fa fa-fw fa-exclamation-triangle"></span>');
						}
					}, 400);
				});
			});

			document.querySelector("#awah_restore_default").addEventListener("click", function() {
				if (!confirm("Are you damn sure about this?!")) return;
				localStorage.removeItem("AlienwareArenaHelperOptions");
				ui.newStatusMessage("Default options settings restored! Realoding...");
				setTimeout(function() {
					window.location.reload();
				}, 2500);
			});

			document.querySelector(".awah-options-btn").addEventListener("click", this.toggleOptionsDisplay, false);

			this.hideOverlayAdditionalFunctions.push(function() {
				let awahOptions = document.getElementById("awah-options");
				setTimeout(() => {
					awahOptions.style.visibility = "hidden";
				}, 300);
				awahOptions.style.right = "";
			});
		}

		hideOverlayHook() {
			hideOverlay = new Proxy(hideOverlay, {
				apply(target, thisArg, args) {
					for (const additionalHideFunction of ui.hideOverlayAdditionalFunctions) {
						additionalHideFunction.apply(thisArg, args);
					}
					target.apply(thisArg, args);
				}
			});
		}

		toggleOptionsDisplay() {
			let overlayElement = document.querySelector(".overlay");
			let awahOptions = document.getElementById("awah-options");
			if (awahOptions.style.visibility === "hidden") {
				overlayElement.classList.add("active");
				awahOptions.style.visibility = "visible";
				awahOptions.style.right = "0";
			} else {
				hideOverlay();
			}
		}

		newStatusMessage(text, sticky = false) {
			let statusMessageElement = document.createElement("div");
			statusMessageElement.innerHTML = text;
			this.messagesContainerElement.appendChild(statusMessageElement);
			if (!sticky) {
				setTimeout(() => statusMessageElement.classList.add("awah-casper-out"), options.statusMessageDelay);
			}
			return statusMessageElement;
		}
	}

	let ui = new UI();

	///////////////////////////////////////
	/// DAILY QUESTS //////////////////////
	///////////////////////////////////////

	async function showDailyQuestButton() {
		while (!document.querySelector(".quest-title")) {
			await new Promise((r) => setTimeout(r, 500));
		}

		const dailyQuest = document.querySelector(".quest-title").textContent.toLowerCase().trim();
		console.log(`👽 QUEST: ${dailyQuest}`);
		if (document.querySelector(".quest-item-progress").textContent === "Complete") {
			document.querySelector(".awah-btn-quest").addClass("disabled");
		} else {
			switch (dailyQuest) {
				case "show some id":
				case "new bling":
				case "new sheriff in town":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/account/personalization#badges">Daily Quest: change badge</a>`, true);
					break;
				case "town crier":
				case "town gossip":
				case "spread the love":
				case "sharing is caring!":
				case "spread the good word":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/ucf/show/2082495/boards/awa-on-topic/ForumPost/rules-on-old-dead-topics">Daily Quest: share a post</a>`, true);
					break;
				case "librarian approved":
				case "feed the mind":
				case "get smart!":
				case "brush up":
				case "booksmarts":
				case "don the glasses":
				case "check out the headline":
					ui.newStatusMessage(`<a href="https://eu.alienwarearena.com/ucf/News">Daily Quest: open a news</a>`, true);
					break;
				case "chatter box":
				case "water cooler":
				case "chit chat":
				case "make some friends!":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/forums/board/113/awa-on-topic?sort=topic">Daily Quest: write in any thread</a>`, true);
					break;
				case "rank":
				case "who's #1?":
				case "climb the ranks":
				case "i want to be the very best...":
				case "compare notes":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/rewards/leaderboard">Daily Quest: check the Leaderboard</a>`, true);
					break;
				case "frame it":
				case "picture day!":
				case "fresh siding!":
				case "give your alien a new home.":
				case "new space":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/account/personalization#borders">Daily Quest: change your avatar's border</a>`, true);
					break;
				case "go shopping":
				case "window shopping":
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/marketplace/">Daily Quest: go to the Market</a>`, true);
					break;
				default:
					ui.newStatusMessage(`<a href="https://www.alienwarearena.com/forums/board/113/awa-on-topic?sort=topic">Special Daily Quest, please check the forum</a>`, true);
					break;
			}
		}
	}
	showDailyQuestButton();

	///////////////////////////////////////
	/// ELEMENTS REMOVAL///////////////////
	///////////////////////////////////////

	// removes twitch player on home page
	if (options.twitchPlayerRemove) {
		if (window.location.pathname === "/") {
			document.querySelector(".embed-responsive-item").remove();
		}
	}

	///////////////////////////////////////
	/// TWITCH ON AWA AUTOMATION //////////
	///////////////////////////////////////

	function awaTwitchPageRedir() {
		const targetLink = document.querySelectorAll("a.btn-primary");

		if (targetLink.length) {
			setTimeout(function() {
				window.location.href = targetLink[targetLink.length - 1].href;
			}, 3000);
		} else {
			ui.newStatusMessage(`The page will refresh in 5 minutes to check for online streamers`);
			setTimeout(function() {
				location.reload(true);
			}, 300000); // 5 minutes in milliseconds
		}
	}

	if (options.twitchWatchAutomate) {
		const twitchPoints = document.querySelector("div > div > section:nth-child(9) > div > div:nth-child(2) > center > b");
		// if on another page of awa that is not the twitch one, notify to open it, if points are less than maximum
		if (window.location.pathname != "/twitch/live" && twitchPoints.innerText < 15) {
			ui.newStatusMessage(`<a href="https://www.alienwarearena.com/twitch/live">Open AWA Twitch page and automate watching</a>`, true);
		}
		// on the awa twitch page, execute actions
		if (window.location.pathname === "/twitch/live" && twitchPoints.innerText < 15) {
			awaTwitchPageRedir();
		}
	}

	///////////////////////////////////////
	/// DAILY TIME SPENT ON AWA ///////////
	///////////////////////////////////////

	if (options.timeOnSiteCheck) {
		const timeOnSitePoints = document.querySelector("#um div center b");
		if (timeOnSitePoints.innerHTML < 5) {
			ui.newStatusMessage(`You still havent't spent enough time to clear the daily rewards, please keep AWA open`);
		}
	}
	let path = window.location.pathname;
	path = path.replace(/\/+/g, "/");
}

///////////////////////////////////////
/// ACTUAL CALLING ////////////////////
///////////////////////////////////////

if (window.location.hostname.split(".").slice(1).join(".") === "alienwarearena.com") {
	awaHelper(window);
}
