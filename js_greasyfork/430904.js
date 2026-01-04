// ==UserScript==
// @name          GeoHintr
// @namespace     MrMike/GeoGuessr/GeoHintr
// @description   GeoHintr - Allows you to place written hints on your maps
// @author        MrMike & Alok
// @version       0.4
// @include       /^(https?)?(\:)?(\/\/)?([^\/]*\.)?geoguessr\.com($|\/.*)/
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/430904/GeoHintr.user.js
// @updateURL https://update.greasyfork.org/scripts/430904/GeoHintr.meta.js
// ==/UserScript==

const GH = {
	MYHINTS: [],
	round: 0,
	hintDiv: null,
	uiDiv: null,
	bigImage: false,
	tokens: [],
	setHints: (hints) => {
		GH.MYHINTS = hints;
	},
	init: () => {
		const targetNode = document.getElementsByTagName("body")[0];
		const config = {
			attributes: false,
			childList: true,
			subtree: false,
			characterData: false
		};
		const observer = new MutationObserver((mutationsList, observer) => {
			for (const mutation of mutationsList) {
				if (mutation.type === "childList") {
					GH.checkRound();
				}
			}
		});
		observer.observe(targetNode, config);
		if (!GH.hintDiv) {
			GH.hintDiv = document.createElement("div");
			GH.hintDiv.setAttribute("class", "game-statuses");
			GH.hintDiv.setAttribute("id", "GH-hint");
			GH.hintDiv.setAttribute("style", "display: inline-flex; padding: 5px 0.5rem 0px; margin-top: 2px;");
			GH.hintDiv.style.display = "none";
		}
		GH.handleStorage();
		GH.createUI();
		GH.keyListener();
	},
	handleStorage: () => {
		GH.tokens = JSON.parse(sessionStorage.getItem("GH-TOKENS"));
		if (GH.tokens && GH.tokens.length > 0) {
		}
		else {
			sessionStorage.setItem("GH-TOKENS", JSON.stringify([]));
			GH.tokens = JSON.parse(sessionStorage.getItem("GH-TOKENS"));
		}
	},
	storeTokens: () => {
		sessionStorage.setItem("GH-TOKENS", JSON.stringify(GH.tokens));
	},
	removeToken: (token) => {
		for (let i = 0; i < GH.tokens.length; i++) {
			if (GH.tokens[i].token === token) {
				GH.tokens.splice(i, 1);
			}
		}
		GH.storeTokens();
		GH.redrawUI();
	},
	checkRound: () => {
		const roundData = document.querySelector("div[data-qa='round-number']");
		if (roundData) {
			let roundElement = roundData.querySelector("[class^='status_value']");
			if (roundElement) {
				let round = parseInt(roundElement.innerText.charAt(0));
				if (!isNaN(round) && round >= 1 && round <= 5) {
					if (round != GH.round) {
						GH.round = round;
						GH.doMagic();
					}
				}
			}
		}
	},
	doMagic: () => {
		let URL = null;
		if (window.location.pathname.includes("game")) {
			URL = `https://www.geoguessr.com/api/v3/games/${window.location.pathname.substring(6)}`;
		}
		else if (window.location.pathname.includes("challenge")) {
			URL = `https://www.geoguessr.com/api/v3/challenges/${window.location.pathname.substring(11)}/game`;
		}
		if (URL) {
			fetch(URL)
				.then((response) => response.json())
				.then((data) => {
					const { lat, lng } = data.rounds[data.round - 1];
					let coordinates = { lat, lng };
					GH.checkForHints(coordinates);
				})
				.catch((error) => {
					console.log("Something went wrong");
					console.log(error);
				});
		}
	},
	checkForHints: (coordinates) => {
		let removeHint = true;
		GH.MYHINTS.forEach(hint => {
			if (GH.coordinatesInRange(coordinates, { lat: hint.lat, lng: hint.lng })) {
				GH.updateHint(hint);
				removeHint = false;
			}
		});
		if (removeHint) {
			GH.hintDiv.style.display = "none";
		}
	},
	handleSpoilers: (hint) => {

		return "";
	},
	updateHint: (hint) => {
		GH.hintDiv.innerHTML = `
			<div class="game-status__body">
				<style>
				#wrapper {
					text-align: center;
					background-color: #FFFFFF66;
					color: black;
					border-radius: 12px;
					padding: 12px;
					font-size: 1.2rem;
					max-width: 0.5vw;
					max-height: 0vh;
					padding-top: 24px;
					position: relative;
					float: right;
					overflow: hidden;
					transition: all 0.5s ease-in-out;
				}
				#shrink {
					position: absolute;
					right: 4px;
					top: -10px;
					cursor: pointer;
					font-size: 2.5rem;
					transition: all 0.5s ease-in-out;
				}
				#hint{
					margin-top: 12px;
					transition: all 0.5s ease-in-out;
				}
				</style>
				<div id="wrapper">
					<div id="shrink" title="Show hint">&#164;</div>
					<p id="hint"></p>
					<div class="spacer" style="clear: both;"></div>
				</div>
			</div>
		`;

		if (document.getElementById("GH-hint")) {
			GH.hintDiv.style.display = "";
		}
		else {
			document.querySelector(".game-layout__status").appendChild(GH.hintDiv);
			GH.hintDiv.style.display = "";
		}

		document.getElementById("hint").innerText = hint.hint;

		let wrapper = document.getElementById("wrapper");
		let shrink = document.getElementById("shrink");
		shrink.addEventListener("click", () => {
			if (shrink.title == "Hide") {
				shrink.setAttribute("title", "Show hint");
				shrink.style.fontSize = "2.5rem";
				shrink.style.top = "-10px";
				shrink.style.right = "4px";
				wrapper.style.maxWidth = "0.5vw";
				wrapper.style.maxHeight = "0vh";
				wrapper.style.paddingTop = "20px";
				//document.getElementById("hint").style.marginTop = "12px";
			}
			else {
				shrink.setAttribute("title", "Hide");
				shrink.style.fontSize = "1.75rem";
				shrink.style.top = "0px";
				shrink.style.right = "8px";
				wrapper.style.maxWidth = "30vw";
				wrapper.style.maxHeight = "75vh";
				wrapper.style.paddingTop = "12px";
				//document.getElementById("hint").style.marginTop = "0px";
			}
		});

		if (hint.img) {
			let image = document.createElement("img");
			image.setAttribute("title", "Click to enlarge");
			image.src = hint.img;
			image.style.maxHeight = "25vh";
			image.style.cursor = "pointer";
			image.style.transition = "all 0.5s ease-in-out";
			let wrapper = document.getElementById("wrapper");
			image.addEventListener("click", () => {
				if (shrink.title == "Hide") {
					if (GH.bigImage) {
						image.style.maxHeight = "25vh";
						wrapper.style.backgroundColor = "#FFFFFF66";
						wrapper.style.maxWidth = "30vw";
					}
					else {
						image.style.maxHeight = "75vh";
						wrapper.style.backgroundColor = "#FFFFFFCC";
						wrapper.style.maxWidth = "50vw";
					}
					GH.bigImage = !GH.bigImage;
				}
			});
			wrapper.appendChild(image);
		}
		if (hint.video) {
			let iframe = document.createElement("iframe");
			iframe.src = `https://www.youtube.com/embed/${hint.video}`;
			iframe.width = "100%";
			iframe.style.width = "25vw";
			iframe.style.height = "14.0625vw";
			iframe.setAttribute("allowfullscreen", "");
			iframe.setAttribute("frameborder", "0");
			wrapper.appendChild(iframe);
		}
	},
	loadHints: (token, name) => {
		document.getElementById("GH-message").innerText = "Loading...";
		fetch(`https://dongles.vercel.app/dongle/paste`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ token: token })
		})
			.then((results) => {
				return results.json();
			})
			.then((data) => {
				if (data.error) {
					console.log(data);
					throw new Error(data.error.message);
				}
				GH.setHints(data);
				document.getElementById("GH-message").innerText = "Hints loaded...";
				GH.doMagic();
				setTimeout(() => {
					GH.hideUI();
				}, 2000);
			})
			.catch((error) => {
				console.log(error);
				document.getElementById("GH-message").innerText = "Something went wrong...";
			});
		let exists = false;
		GH.tokens.forEach((tok) => {
			if (tok.token === token) {
				exists = true;
			}
		});
		if (!exists) {
			GH.tokens.push({ token, name });
		}
		GH.storeTokens();
		GH.redrawUI();
	},
	coordinatesInRange: (original, hint) => {
		let ky = 40000 / 360;
		let kx = Math.cos(Math.PI * hint.lat / 180.0) * ky;
		let dx = Math.abs(hint.lng - original.lng) * kx;
		let dy = Math.abs(hint.lat - original.lat) * ky;
		return Math.sqrt(dx * dx + dy * dy) <= 0.050;
	},
	keyListener: () => {
		document.addEventListener("keydown", (event) => {
			if (event.code === "KeyH" && event.ctrlKey && event.altKey && !event.shiftKey && !event.metaKey && !event.repeat) {
				if (GH.uiDiv.style.display === "block") {
					GH.hideUI();
				}
				else {
					GH.showUI();
				}
			}
		});
	},
	createUI: () => {
		if (!GH.uiDiv) {
			GH.uiDiv = document.createElement("div");
			GH.uiDiv.setAttribute("id", "GH-ui")

			Object.assign(GH.uiDiv.style, {
				display: "none",
				position: "fixed",
				backgroundColor: "#eee9e0",
				zIndex: "1000",
				width: "fit-content",
				height: "fit-content",
				top: "48px",
				left: "8px",
				padding: "20px",
				borderRadius: "10px",
				boxShadow: "0 2px 2px 0",
				overflow: "hidden"
			});

			GH.uiDiv.innerHTML = ``;
			GH.tokens.forEach((token) => {
				GH.uiDiv.innerHTML += `
					<input type="text" size="10" id="${token.token}" value="${token.token}" />
					<input type="text" value="${token.name}" />
					<button id="GH-${token.token}">LOAD</button>
					<button id="GHR-${token.token}">X</button>
					<br />
				`;
			});
			GH.uiDiv.innerHTML += `
				<input type="text" placeholder="Pastebin Token" size="10" id="pastebin_token" />
				<input type="text" placeholder="Description" id="pastebin_name" />
				<button id="GH-load">LOAD</button>
				<br />
			`;
			GH.uiDiv.innerHTML += `
				<div style="text-align: center; margin-top: 8px">
					<p id="GH-message"></p>
				</div>
			`;
		}
		document.body.appendChild(GH.uiDiv);
		document.getElementById("GH-load").addEventListener("click", () => {
			GH.loadHints(document.getElementById("pastebin_token").value, document.getElementById("pastebin_name").value);
		});
		GH.tokens.forEach((token) => {
			document.getElementById(`GH-${token.token}`).addEventListener("click", () => GH.loadHints(token.token, token.name));
		});
		GH.tokens.forEach((token) => {
			document.getElementById(`GHR-${token.token}`).addEventListener("click", () => GH.removeToken(token.token));
		});
	},
	redrawUI: () => {
		GH.hideUI();
		document.getElementById("GH-ui").remove();
		GH.uiDiv = null;
		GH.createUI();
		GH.showUI();
	},
	showUI: () => {
		GH.uiDiv.style.display = "block";
	},
	hideUI: () => {
		GH.uiDiv.style.display = "none";
	}
}

GH.init();
