// ==UserScript==
// @name          Agar Extras
// @description   Improves the functionality and aesthetic of agar.io
// @include       *agar.io/*
// @grant         none
// @run-at        document-start
// @version       1.7
// @author        Tom Burris
// @namespace     https://greasyfork.org/en/users/46159
// @icon          http://bit.ly/2oT4wRk
// @compatible    chrome
// @downloadURL https://update.greasyfork.org/scripts/30150/Agar%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/30150/Agar%20Extras.meta.js
// ==/UserScript==

"use strict";

const byId = (id, prnt) => (prnt || document).getElementById(id);
const byClass = (clss, prnt) => (prnt || document).getElementsByClassName(clss);
const byTag = (tag, prnt) => (prnt || document).getElementsByTagName(tag);
const hsl = hue => `hsl(${hue},100%,50%)`;
const listen = (elm, evnt, cb) => elm.addEventListener(evnt, cb);

/* document-start */
(() => {
	const WebSocketOld = WebSocket;
	window.WebSocket = function(url) {
		window.wsURL = byId("wsTextInput").value = url;
		/*.replace(/\?.*$/, "")*/
		return new WebSocketOld(window.wsURL);
	};
})();

/* document-end */
listen(document, "DOMContentLoaded", () => {
	let css = "";

	const nick = byId("nick");
	const profilePanel = byClass("agario-profile-panel")[0];
	const dailyQuests = byId("dailyQuests");
	const potionsBtn = byId("potions");
	const timers = byClass("timer menu-timer");
	const shopPanel = byClass("agario-shop-panel")[0];
	const options = byId("options");
	const rightPanel = byId("rightPanel");
	const playBtn = byClass("btn-play")[0];
	const prevent = event => event.preventDefault();
	const spectateBtn = byClass("btn-spectate")[0];
	const loginBtn = byClass("btn-login-play")[0];
	const subscribeBox = byId("agarYoutube");

	/* Fixes */
	css += "body {line-height: normal !important;}"; // blurry font.
	nick.type = "text"; // improper input.

	/* Compact Left Panel */
	css += ".quest-timer {width: auto; margin-left: 20px;}";
	profilePanel.appendChild(dailyQuests);
	dailyQuests.appendChild(timers[0]);
	profilePanel.appendChild(potionsBtn);
	potionsBtn.appendChild(timers[1]);
	const shopStuff = shopPanel.childNodes;
	while (shopStuff.length) {
		profilePanel.appendChild(shopStuff[0]);
	}
	css += "#freeCoins, #dailyQuests, #potions {margin: 0 0 5px 0;}";
	css += "#dailyquests-panel, .agario-shop-panel, #giftButton {display: none !important;}";

	/* Center Options */
	css += `#tags-container {display: none;} #options {margin-left: 25px;}`;
	for (let span of byTag("span", options)) {
		if (span.textContent == "Show Online Status") {
			span.textContent = "Show Online";
		}
	}

	/* Add Acid Mode */
	let acidLabel = document.createElement("label");
	acidLabel.innerHTML = `<input type="checkbox" id="acidMode" style="margin-top: 1px"><span>Acid mode</span>`;
	options.appendChild(acidLabel);
	const acidCheckbox = byId("acidMode");
	listen(acidCheckbox, "click", () => window.core.setAcid(window.checkbox.checked));

	/* FPS */
	let fpsBox = document.createElement("div");
	fpsBox.style = `
		position: absolute;
		top: 0px;
		left: 0px;
		color: white;
		background: black;
	`;
	document.body.appendChild(fpsBox);
	let frames = 0;
	setInterval(() => {
		fpsBox.textContent = "fps: " + frames;
		fpsBox.style.color = hsl(frames * 2);
		frames = 0;
	}, 1E3);
	const clearRectOld = CanvasRenderingContext2D.prototype.clearRect;
	CanvasRenderingContext2D.prototype.clearRect = function() {
		if (this.canvas === window.canvas) {
			frames++;
		}
		return clearRectOld.apply(this, arguments);
	};

	/* Server Connection */
	let wsBox = document.createElement("div");
	wsBox.innerHTML = `<input type="text" id="wsTextInput" class="agario-panel agario-side-panel" spellcheck="false"></input>`;
	rightPanel.appendChild(wsBox);
	const wsTextInput = byId("wsTextInput");
	listen(wsTextInput, "focus", wsTextInput.select.bind(wsTextInput));
	listen(wsTextInput, "blur", () => wsTextInput.value = window.wsURL);
	listen(wsTextInput, "keypress", ({keyCode: code}) => {
		if (code == 13) {
			window.core.disconnect();
			window.core.connect(wsTextInput.value);
			playBtn.click();
		}
	});
	css += `
		#wsTextInput {
			text-overflow: ellipsis;
			padding: 6px;
			display: inline-block;
			width: 293px;
			height: 34px;
		}
		#wsTextInput:focus {
			outline: 0px !important;
			box-shadow: 0 0 3px 1px white;
		}
		::selection {
			background: #0d0 !important;
		}
	`;

	/* Mouse Controls */
	const speed = 50;
	const eject = () => {
		if (ejectDown) {
			window.core.eject();
			setTimeout(eject, speed);
		}
	};
	let ejectDown = false;
	window.canvas.addEventListener("mousedown", ({which}) => {
		if (which === 1) window.core.split();
		else if (which === 3) eject(ejectDown = true);
	});
	listen(window, "mouseup", ({which}) => which === 3 && (ejectDown = false));
	window.canvas.addEventListener("contextmenu", prevent);
	window.canvas.addEventListener("dragstart", prevent);

	/* Freeze */
	listen(window, "keydown", ({key}) => {
		if (key === "p") window.canvas.dispatchEvent(new MouseEvent("mousemove", {
			clientX: window.innerWidth / 2,
			clientY: window.innerHeight / 2
		}));
	});

	/* Arrow Keys */
	const keychange = ({keyCode: code, type}) => {
		const dir = code - 37;
		if (dir >= 0 && dir < 4 && (!keysDown[dir] || type == "keyup")) {
			keysDown[dir] = type == "keydown";
			update();
		}
	};
	const update = () => {
		let pos = [window.innerWidth / 2, window.innerHeight / 2];
		for (let n = 4; n--;) {
			if (keysDown[n]) {
				const min = Math.min(window.innerWidth, window.innerHeight);
				pos[n % 2] += [-1, 1][n / 2 | 0] * min / 2;
			}
		}
		window.canvas.dispatchEvent(new MouseEvent("mousemove", {
			clientX: pos[0],
			clientY: pos[1]
		}));
	};
	const keysDown = [];
	listen(document, "keydown", keychange);
	listen(document, "keyup", keychange);

	/* Music Player */
	const src = "//www.youtube.com/embed/TBGdEeYPYgg" + "?controls=0;";
	const player = document.createElement("div");
	player.className = "agario-panel agario-side-panel";
	player.style = "padding: 0px; width: 293px; height: 168px; margin-top: 5px;";
	player.innerHTML = `<iframe id="YTVideo" src="${src}" style="border: 0px; width: 100%; height: 100%;"></iframe>`;
	rightPanel.appendChild(player);

	/* Ubuntu Font */
	css += "@import url('https://fonts.googleapis.com/css?family=Ubuntu');";
	css += "body {font-family: 'Ubuntu', sans-serif !important;}";
	css += "#statsSubtext {white-space: nowrap;}";

	/* Vertically center main panel */
	css += `
		#helloContainer {
			position: relative;
			top: 50% !important;
			transform: perspective(1px) translate(-50%, -50%) !important;
			display: inline-block !important;
			width: auto !important;
		}
		#leftPanel {
			margin: 0px;
			width: 222px;
		}
	`;

	/* Always display settings and intructions, also move the login button */
	css += `
		#settings {
			display: block !important;
		}
		.btn-settings {
			display: none;
		}
		.btn-play-guest {
			width: 100%;
			margin: 0px !important;
		}
		.btn-play {
			width: 100% !important;
			margin: 0px !important;
		}
		.btn-login-play {
			width: 110px !important;
			float: right;
		}
		#instructions,
		#options,
		.text-muted,
		#mainPanel {
			cursor: default !important;
		}
		input,
		select {
			cursor: pointer !important;
		}
	`;
	spectateBtn.parentNode.appendChild(loginBtn);

	/* Darken Stuff */
	css += `
		select,
		.agario-panel,
		.shop-blocker,
		#blocker,
		input[type=text],
		footer,
		.progress,
		.party-token,
		.agario-profile-picture {
			background: black !important;
			color: white !important;
			border: 0px !important;
			border-radius: 0px !important;
			outline: 1px solid white !important;
		}
		span {
			color: white !important;
		}
		.party-icon-back {
			background: black !important;
		}
		.btn {
			border-radius: 0px !important;
		}
	`;

	/* Hide Static Ads */
	css += `
		.agario-promo-container,
		#advertisement,
		.diep-cross,
		#promo-badge-container,
		#agario-web-incentive,
		#mcbanners-container,
		#adsBottom {
			display: none !important;
		}
	`;
	subscribeBox.parentElement.style.display = "none";

	/* Append CSS To DOM */
	const style = document.createElement("style");
	style.innerHTML = css;
	document.head.appendChild(style);
});

/* document-idle */
listen(window, "load", () => {
	// The page javascript changes the textContent (I think).
	byClass("btn-login-play")[0].textContent = "Login";

	/* Remove Video Ads */
	const good = () => {
		window.MC.notifyFullscreenAdFinished();
		//window.onDone();
	};
	window.initAdsController = good;
	window.requestAds = good;
	window.onAdLoaded = good;
	//window.adSlots = {};
	//window.googleAdsModule = {};
	//window.mc.Events.ads = {};
	//window.mc.services.ads = {};
	window.openOfferwall = good;
	window.openVideoAd = good;
	window.refreshAd = good;
	//window.supersonicAds = {};
	//window.startAd = function() {}; // banner.js line 1
	//console.log("%cDone!", "color:black;font-weight:bold;font-size:20px;");
});
