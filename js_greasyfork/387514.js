// ==UserScript==
// @name         S0urce.IO OP Hack
// @version      1.0
// @description  S0urce.io Overpowered Hack
// @author       Cozz7s
// @match        *://s0urce.io/*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/317955
// @downloadURL https://update.greasyfork.org/scripts/387514/S0urceIO%20OP%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/387514/S0urceIO%20OP%20Hack.meta.js
// ==/UserScript==
// eslint-disable-next-line prefer-const, one-var
let config, vars, app, loops, gui;

// eslint-disable-next-line prefer-const
config = {
	// the message you send to others when you hack them
	message: "Twitter @Cozz7s",
	autoTarget: true,
	autoAttack: true,
	// the base64 database url
	db: "https://raw.githubusercontent.com/snollygolly/sourceio-automation/master/db.json",
	// all things timing related
	freq: {
		// how often to guess
		word: 1500,
		// how often to attempt to upgrade mining tools
		mine: 3000,
		// how often to attempt to upgrade firewalls
		upgrade: 4500,
		// how long to wait before attempting to rehack, not enough money for hack
		broke: 6000,
		// how long to wait before restarting the hacking loop
		hack: 3500
	},
	// which player in the index of the list, 0 is the first player (the bot target a player with index between playerToAttack and playerToAttack + 3 (random).
	playerToAttack: 0,
	// how many hacks to try (and fail) before restarting
	maxHackFails: 5,
	// how high to upgrade all of your miner types except quantum-servers and botnets.
	maxMinerLevel: 20,
	// how high to upgrade quantum-servers and botnets (quantum-servers will always be purchased in priority and botnets quantity will be equal to quantum-servers quantity.
	maxQBLevel: 50,
	// the max BTC the bot will spend per upgrade. (current BTC * maxUpgradeCost).
	maxUpgradeCost: .33,
	// all the gui settings
	gui: {
		enabled: true,
		width: "320px",
		height: "412px"
	},
	// all the ocr settings, disabled by default
	ocr: {
		enabled: false,
		url: "http://api.ocr.space/parse/image",
		key: "XXX"
	}
};

// eslint-disable-next-line prefer-const
vars = {
	// the object that contains a mapping of image urls to words (built over time)
	listingURL: {},
	// the object that contains b64 hashes to words (loaded on start)
	listingB64: {},
	// how much BT you have
	balance: 0,
	flags: {
		// we're waiting for OCR to complete
		ocrBlock: false,
		// we're waiting for the bar to move in response to our word
		progressBlock: false
	},
	loops: {
		word: null,
		upgrade: null,
		miner: null
	},
	hackProgress: 0,
	hackFailures: 0,
	// the different types of miners and their current rank
	minerStatus: [
		{name: "shop-basic-miner", value: 0},
		{name: "shop-advanced-miner", value: 0},
		{name: "shop-mining-drill", value: 0},
		{name: "shop-data-center", value: 0},
		{name: "shop-bot-net", value: 0},
		{name: "shop-quantum-server", value: 0}
	],
	fireWall: [
		{name: "A", index: 1, needUpgrade: true},
		{name: "B", index: 2, needUpgrade: true},
		{name: "C", index: 3, needUpgrade: true},
		{name: "ALL", needUpgrade: true}
	],
	gui: {
		dragReady: false,
		dragOffset: {x: 0, y: 0}
	}
};

// eslint-disable-next-line prefer-const
app = {
	start: () => {
		$.get(config.db).done((data) => {
			vars.listingB64 = JSON.parse(data);
			// first check the windows are open, and open them if they aren't
			if ($("#player-list").is(":visible") === false) {
				log("* Target list must be open");
				$("#desktop-list").children("img").click();
			}
			if ($("#window-shop").is(":visible") === false) {
				log("* Black market must be open");
				$("#desktop-shop").children("img").click();
				$("#desktop-miner").children("img").click();
			}
			if ($("#window-computer").is(":visible") === false) {
				log("* My computer must be open");
				$("#desktop-computer").children("img").click();
			}
			if (config.gui.enabled === true) {
				if ($("#custom-gui").is(":visible") === false) {
					log("* Opening bot window");
					gui.show();
				}
			} else {
				log("* GUI disabled, skipping...");
			}
			// start the automation
			app.automate();
		});
	},

	restart: () => {
		app.stop();
		log(". Waiting for restart...");
		setTimeout(() => {
			log(". Restarting!");
			app.automate();
		}, config.freq.hack);
	},

	stop: () => {
		// check and disable all loops
		for (const loop in vars.loops) {
			if (vars.loops[loop] === null) {
				log(`! Can't stop ${loop} loop`);
				continue;
			}
			clearInterval(vars.loops[loop]);
			vars.loops[loop] = null;
		}
		vars.hackProgress = 0;
		// reset flags
		vars.flags.ocrBlock = false;
		vars.flags.progressBlock = false;
		log("* Stopped all hacking");
	},

	automate: () => {
		// does everything to prep for hacking except word guessing
		app.attack();
		// start the loop for btc monitoring
		vars.loops.miner = setInterval(loops.miner, config.freq.mine);
		// start the loop for upgrades
		vars.loops.upgrade = setInterval(loops.upgrade, config.freq.upgrade);
	},

	attack: () => {

		// if the auto target is toggled, choose the target.
		if (config.autoTarget) {
		// with playerToAttack = 0 choose between the 4 first players from the player list
			const rndTarget = getRandomInt(config.playerToAttack, config.playerToAttack + 3);
			// playerToAttack is an int, the index of the player list
			const targetName = $("#player-list").children("tr").eq(rndTarget)[0].innerText;
			log(`. Now attacking ${targetName}`);
			// click it, and then hack, and then a random port
			$("#player-list").children("tr").eq(rndTarget)[0].click();
			$("#window-other-button").click();
		}
		// if the auto attack port is toggled, choose the port and click
		if (config.autoAttack) {
			const portNumber = getRandomInt(1,3);
			// do a check for money
			const portStyle = $(`#window-other-port${portNumber}`).attr("style");
			if (portStyle.indexOf("opacity: 1") === -1) {
			// this port costs too much, let's wait a bit
				log("* Hack too expensive, waiting");
				setTimeout(app.attack, config.freq.broke);
				return;
			}
			$(`#window-other-port${portNumber}`).click();
		}

		vars.loops.word = setInterval(loops.word, config.freq.word);
	},

	findWord: () => {
		const wordLink = $(".tool-type-img").prop("src");
		if (!wordLink.endsWith("s0urce.io/client/img/words/template.png")) {
			if (vars.listingURL.hasOwnProperty(wordLink) === true) {
				const word = vars.listingURL[wordLink];
				log(`. Found word (URL): [${word}]`);
				app.submit(word);
				return;
			}
			toDataURL(wordLink).then((dataUrl) => {
				const hash = getHashCode(dataUrl);
				if (vars.listingB64.hasOwnProperty(hash) === true) {
					const word = vars.listingB64[hash];
					log(`. Found word (B64): [${word}]`);
					app.learn(word);
					return;
				}
				if (config.ocr.enabled === true) {
					log("* Not seen, trying OCR...");
					app.doOCR(config.ocr.url, {
						apikey: config.ocr.key,
						language: "eng",
						url: wordLink
					});
				} else {
					log("* OCR disabled, skipping...");
				}
			});
		} else {
			log("* Can't find the word link...");
			// if the target is disconnected and autoTarget disabled, re-enable it.
			if ($("#cdm-text-container span:last").text() === "Target is disconnected from the Server." && !config.autoTarget) {
				$("#custom-autoTarget-button").click();
			}
			app.restart();
		}
	},

	learn: (word) => {
		const wordLink = $(".tool-type-img").prop("src");
		vars.listingURL[wordLink] = word;
		app.submit(word);
	},

	submit: (word) => {
		$("#tool-type-word").val(word);
		$("#tool-type-word").submit();
	},

	doOCR: (link, payload) => {
		vars.flags.ocrBlock = true;
		// this is made somewhat generic to allow different ocr vendors
		$.post(link, payload).done((data) => {
			const word = String(data["ParsedResults"][0]["ParsedText"]).trim().toLowerCase().split(" ").join("");
			if (word.length > 2) {
				log(`. Got data: [${word}]`);
				$("#tool-type-word").val(word);
				app.learn(word);
				vars.flags.ocrBlock = false;
			} else {
				log("* OCR failed");
				app.restart();
			}
		});
	}
};

loops = {
	word: () => {
		// block is true is we're mid-OCR
		if (vars.flags.ocrBlock === true) {
			return;
		}
		if ($("#targetmessage-input").is(":visible") === true) {
			// we're done!
			$("#targetmessage-input").val(config.message);
			$("#targetmessage-button-send").click();
			app.restart();
			return;
		}
		// if we're waiting on the progress bar to move...
		if (vars.flags.progressBlock === true) {
			const newHackProgress = parseHackProgress($("#progressbar-firewall-amount").attr("style"));
			// check to see if it's new
			if (vars.hackProgress === newHackProgress) {
				// the bar hasn't moved
				log("* Progress bar hasn't moved, waiting");
				vars.hackFails++;
				if (vars.hackFails >= config.maxHackFails) {
					vars.hackFails = 0;
					log("* Progress bar is stuck, restarting");
					// maybe the URLs have changed
					vars.listingURL = {};
					app.restart();
				}
				return;
			}
			// the bar has moved
			vars.hackFails = 0;
			vars.hackProgress = newHackProgress;
			vars.flags.progressBlock = false;
		}
		// actually do the word stuff
		vars.flags.progressBlock = true;
		app.findWord();
	},

	miner: () => {
		// first, get the status of our miners
		for (const miner of vars.minerStatus) {
			// set value
			miner.value = parseInt($(`#${miner.name}-amount`).text());
			// this is available to buy
			if ($(`#${miner.name}`).attr("style") === "opacity: 1;") {
				// buy more quantum servers and botnets, buy botnets at the same rate as the quantum servers.
				if (miner.value >= config.maxQBLevel) {
					// we're beyond or at the max QB level, no updates needed
					continue;
				}
				// is this an advanced miner?
				const isAdvancedMiner = (miner.name === "shop-quantum-server" || miner.name === "shop-bot-net") ? true : false;
				if (miner.value >= config.maxMinerLevel && isAdvancedMiner === false) {
					// this isn't an advanced miner and it's beyond the max level, no updates needed
					continue;
				}
				// we should buy this
				$(`#${miner.name}`).click();
			}
		}
	},

	upgrade: () => {
		// leave if all firewalls are upgraded to max
		if (!vars.fireWall[3].needUpgrade)
			return;
		// get a random firewall
		// i refers to the location in the vars.firewall array
		const i = getRandomInt(0,2);
		// index refers to 1,2,3, the index in the DOM (use for selectors)
		const index = vars.fireWall[i].index;
		// if this fireWall is already fully upgraded, get an other random firewall.
		if (!vars.fireWall[i].needUpgrade)
			vars.loops.upgrade();
		vars.balance = parseInt($("#window-my-coinamount").text());
		// if the back button is visible, we're on a page, let's back out and hide the firewall warning.
		if ($("#window-firewall-pagebutton").is(":visible") === true) {
			$("#tutorial-firewall").css("display","none");
			$("#window-firewall-pagebutton").click();
		}

		// click on the firewall
		log(`. Handling upgrades to firewall ${vars.fireWall[i].name}`);
		$(`#window-firewall-part${index}`).click();
		// get stats
		const stats = [
			parseInt($("#shop-max-charges").text()), parseInt($("#shop-strength").text()), parseInt($("#shop-regen").text())
		];
		const statLookup = [
			"max_charge10", "difficulty", "regen"
		];
		const maxStats = [
			30, 4, 10
		];
		let maxUpgradeCount = 0;
		for (const stat in maxStats) {
			if (stats[stat] < maxStats[stat]) {
				const statPrice = parseInt($(`#shop-firewall-${statLookup[stat]}-value`).text());
				if (statPrice < (vars.balance * config.maxUpgradeCost)) {
					log(`. Buying: ${$(".window-shop-element-info b").eq(stat).text()}`);
					$(`#shop-firewall-${statLookup[stat]}`).click();
					// buy more than one upgrade, but only if they cost less than a third of the bitcoin balance.
					// return;
				}
			} else {
				maxUpgradeCount++;
				if (maxUpgradeCount === 3) {
					vars.fireWall[i].needUpgrade = false;
					if (vars.fireWall.every(checkFirewallsUpgrades))
						vars.fireWall[3].needUpgrade = false;
				}
			}
		}
		// let's go back
		if ($("#window-firewall-pagebutton").is(":visible") === true) {
			$("#window-firewall-pagebutton").click();
		}
	}
};

gui = {
	show: () => {
		if ($("#custom-gui").length > 0) {
			$("#custom-gui").show();
		}
		const sizeCSS = `height: ${config.gui.height}; width: ${config.gui.width};`;
		const labelMap = {
			word: "Word Speed",
			mine: "Miner Upgrade",
			upgrade: "Firewall Upgrade",
			hack: "Hack Wait"
		};
		const freqInput = (type) => {
			return `<span style="font-size:15px">
				${labelMap[type]}:
				<input type="text" class="custom-gui-freq input-form" style="width:50px;margin:0px 0px 15px 5px;border:" value="${config.freq[type]}" data-type="${type}">
				<span>(ms)</span><br>
			</span>`;
		};
		const botWindowHTML = `
		<div id="custom-gui" class="window" style="border-color: rgb(62, 76, 95); color: rgb(191, 207, 210); ${sizeCSS} z-index: 10; top: 11.5%; left: 83%;">
			<div id="custom-gui-bot-title" class="window-title" style="background-color: rgb(62, 76, 95);">
				Source.io Bot
				<span class="window-close-style">
					<img class="window-close-img" src="http://s0urce.io/client/img/icon-close.png">
				</span>
			</div>
			<div class="window-content" style="${sizeCSS}">
				<div id="custom-restart-button" class="button" style="display: block; margin-bottom: 15px">
					Restart Bot
				</div>
				<div id="custom-stop-button" class="button" style="display: block; margin-bottom: 15px">
					Stop Bot
				</div>
				<div id="custom-autoTarget-button" class="button" style="display: block; margin-bottom: 15px">
					Target Auto
				</div>
				<div id="custom-autoAttack-button" class="button" style="display: block; margin-bottom: 15px">
					Port Attack Auto
				</div>
				<span>Message to victim:</span>
				<br>
				<input type="text" class="custom-gui-msg input-form" style="width:250px;height:30px;border:;background:lightgrey;color:black" value="${config.message}" >
				<br><br>
				${freqInput("word")}
				${freqInput("mine")}
				${freqInput("upgrade")}
				${freqInput("hack")}
				<div id="custom-github-button" class="button" style="display: block;">
					This script is on Github!
				</div>
			</div>
		</div>`;
		$(".window-wrapper").append(botWindowHTML);
		// color the toggle buttons
		$("#custom-autoTarget-button").css("color", config.autoTarget ? "green" : "red");
		$("#custom-autoAttack-button").css("color", config.autoAttack ? "green" : "red");
		// bind functions to the gui's buttons
		$("#custom-gui-bot-title > span.window-close-style").on("click", () => {
			$("#custom-gui").hide();
		});
		$("#custom-restart-button").on("click", () => {
			app.restart();
		});
		$("#custom-stop-button").on("click", () => {
			app.stop();
		});
		$("#custom-autoTarget-button").on("click", () => {
			config.autoTarget = !config.autoTarget;
			$("#custom-autoTarget-button").css("color", config.autoTarget ? "green" : "red");
		});
		$("#custom-autoAttack-button").on("click", () => {
			config.autoAttack = !config.autoAttack;
			$("#custom-autoAttack-button").css("color", config.autoAttack ? "green" : "red");
		});
		$("#custom-github-button").on("click", () => {
			window.open("https://github.com/snollygolly/sourceio-automation");
		});
		$(".custom-gui-freq").on("keypress", (e) => {
			if (e.keyCode !== 13) {
				return;
			}
			const type = $(e.target).attr("data-type");
			if (!config.freq[type]) {
				// invalid input, disregard i guess?
				return;
			}
			config.freq[type] = $(e.target).val();
			log(`* Frequency for '${type}' set to ${config.freq[type]}`);
		});
		$(".custom-gui-msg").on("keypress", (e) => {
			if (e.keyCode !== 13) {
				return;
			}
			config.message = $(e.target).val();
			log(`* Message for  set to : ${config.message}`);
		});
		// make the bot window draggable
		const botWindow = ("#custom-gui");
		$(document).on("mousedown", botWindow, (e) => {
			vars.gui.dragReady = true;
			vars.gui.dragOffset.x = e.pageX - $(botWindow).position().left;
			vars.gui.dragOffset.y = e.pageY - $(botWindow).position().top;
		});
		$(document).on("mouseup", botWindow, () => {
			vars.gui.dragReady = false;
		});
		$(document).on("mousemove", (e) => {
			if (vars.gui.dragReady) {
				$(botWindow).css("top", `${e.pageY - vars.gui.dragOffset.y}px`);
				$(botWindow).css("left", `${e.pageX - vars.gui.dragOffset.x}px`);
			}
		});
	}
};

function checkFirewallsUpgrades(FW, index) {
	if (index === 3)
		return true;
	return FW.needUpgrade === false;
}

function parseHackProgress(progress) {
	// remove the %;
	const newProgress = progress.slice(0, -2);
	const newProgressParts = newProgress.split("width: ");
	return parseInt(newProgressParts.pop());
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getHashCode(data) {
	let hash = 0;
	if (data.length === 0) {
		return hash;
	}
	for (let i = 0; i < data.length; i++) {
		const c = data.charCodeAt(i);
		hash = ((hash << 5) - hash) + c;
		hash &= hash;
	}
	return hash.toString();
}

function toDataURL(url) {
	return fetch(url)
		.then(response => response.blob())
		.then(blob => new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		}));
}

function log(message) {
	console.log(`:: ${message}`);
}