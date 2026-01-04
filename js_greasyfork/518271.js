// ==UserScript==
// @name        Shell Shockers | Crosshair
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     5.0
// @author      https://greasyfork.org/en/users/1361048-wish
// @description 9/16/2024, 8:34:24 PM
// @require     https://unpkg.com/guify@0.12.0/lib/guify.min.js
// @license      MIT; https://opensource.org/licenses/MIT

// @match         *://eggshooter.best/*
// @match        *://*.shellshock.io/*
// @match        *://*.shell.onlypuppy7.online/*
// @match        *://*.algebra.best/*
// @match        *://*.algebra.vip/*
// @match        *://*.biologyclass.club/*
// @match        *://*.deadlyegg.com/*
// @match        *://*.deathegg.world/*
// @match        *://*.eggboy.club/*
// @match        *://*.eggboy.xyz/*
// @match        *://*.eggcombat.com/*
// @match        *://*.egg.dance/*
// @match        *://*.eggfacts.fun/*
// @match        *://*.egghead.institute/*
// @match        *://*.eggisthenewblack.com/*
// @match        *://*.eggsarecool.com/*
// @match        *://*.geometry.best/*
// @match        *://*.geometry.monster/*
// @match        *://*.geometry.pw/*
// @match        *://*.geometry.report/*
// @match        *://*.hardboiled.life/*
// @match        *://*.hardshell.life/*
// @match        *://*.humanorganising.org/*
// @match        *://*.mathactivity.xyz/*
// @match        *://*.mathactivity.club/*
// @match        *://*.mathdrills.info/*
// @match        *://*.mathdrills.life/*
// @match        *://*.mathfun.rocks/*
// @match        *://*.mathgames.world/*
// @match        *://*.math.international/*
// @match        *://*.mathlete.fun/*
// @match        *://*.mathlete.pro/*
// @match        *://*.overeasy.club/*
// @match        *://*.risenegg.com/*
// @match        *://*.scrambled.tech/*
// @match        *://*.scrambled.today/*
// @match        *://*.scrambled.us/*
// @match        *://*.scrambled.world/*
// @match        *://*.shellshockers.club/*
// @match        *://*.shellshockers.life/*
// @match        *://*.shellshockers.site/*
// @match        *://*.shellshockers.us/*
// @match        *://*.shellshockers.world/*
// @match        *://*.shellshockers.xyz/*
// @match        *://*.shellsocks.com/*
// @match        *://*.softboiled.club/*
// @match        *://*.urbanegger.com/*
// @match        *://*.violentegg.club/*
// @match        *://*.violentegg.fun/*
// @match        *://*.yolk.best/*
// @match        *://*.yolk.life/*
// @match        *://*.yolk.rocks/*
// @match        *://*.yolk.tech/*
// @match        *://*.yolk.quest/*
// @match        *://*.yolk.today/*
// @match        *://*.zygote.cafe/*
// @match        *://*.shellshockers.best/*
// @match        *://*.eggboy.me/*

// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require     https://cdn.jsdelivr.net/npm/tweakpane@3.1.10/dist/tweakpane.min.js
// @require      https://cdn.jsdelivr.net/npm/@tweakpane/plugin-essentials@0.1.8/dist/tweakpane-plugin-essentials.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
//
// @run-at      document-end

// @downloadURL https://update.greasyfork.org/scripts/518271/Shell%20Shockers%20%7C%20Crosshair.user.js
// @updateURL https://update.greasyfork.org/scripts/518271/Shell%20Shockers%20%7C%20Crosshair.meta.js
// ==/UserScript==
(function () {
	function waitForElement(selector) {
		return new Promise((resolve) => {
			const intervalId = setInterval(() => {
				const element = document.getElementById(selector);
				console.log("looking for", selector);
				if (element) {
					console.dir(`found: ${element}`);
					clearInterval(intervalId);
					resolve(element);
				}
			}, 100);
		});
	}
	waitForElement("crosshairContainer").then((e) => {
		const tp = {
			mainCH: {
				color: "#fff",
				length: 0.8,
				width: 0.3,
				opacity: 0.7,
				border: "#000000",
				rotate: 0,
			},
			middleDot: {
				opacity: 1,
				color: "#000",
				border: "#000",
				size: 0.3,
				round: false,
				shape: "Dot",
				length: 0.5,
				width: 0.5,
			},
			paneSettings: {
				width: 300,
				tabout: "`",
				hidePanel: "h",
			},
		};

		function createFolders(NFolder) {
			let test = pane.addFolder({
				title: NFolder,
				expanded: false,
			});
			return test;
		}

		function createInput(folder, obj, property, options, callback) {
			const x = folder.addInput(obj, property, options).on("change", callback);
			return x;
		}

		const makeDraggable = function (element, notMenu) {
			if (element) {
				let offsetX, offsetY;
				element.addEventListener("mousedown", function (e) {
					const dragElement = function (e) {
						const x = ((e.clientX - offsetX) / unsafeWindow.innerWidth) * 100;
						const y = ((e.clientY - offsetY) / unsafeWindow.innerHeight) * 100;
						const maxX = 100 - (element.offsetWidth / unsafeWindow.innerWidth) * 100;
						const maxY = 100 - (element.offsetHeight / unsafeWindow.innerHeight) * 100;
						element.style.left = `${Math.max(0, Math.min(x, maxX))}%`;
						element.style.top = `${Math.max(0, Math.min(y, maxY))}%`;
					};
					if (notMenu || e.target.classList.contains("tp-rotv_t")) {
						offsetX = e.clientX - element.getBoundingClientRect().left;
						offsetY = e.clientY - element.getBoundingClientRect().top;
						document.addEventListener("mousemove", dragElement);
						document.addEventListener("mouseup", function () {
							document.removeEventListener("mousemove", dragElement);
						});
						e.preventDefault(); // Prevent text selection during drag
					}
				});
			}
		};

		function loadExistingSettings(name, target, callback) {
			const stuff = localStorage.getItem(name);

			if (stuff) {
				const parsed = JSON.parse(stuff);

				Object.assign(target, parsed);
				if (typeof callback === "function") callback();
			}
		}

		function addInputWithValidation(folder, obj, property, label) {
			const df = structuredClone(obj[property]);
			folder.addInput(obj, property, { label: label }).on("change", (value) => {
				if (value.value.length > 1) {
					value.value = df;
					obj[property] = df;
					console.log(obj[property]);
					value.target.controller_.binding.value.rawValue_ = df;
					unsafeWindow.alert("Please enter a single key");
				} else {
					const store = value.value.replace(/"/g, "");
					localStorage.setItem(`tp-${property}`, store);
				}
			});
		}

		const changeMainCH = (obj) => {
			const previousStyle = document.getElementById("custom-mainCH");
			const containerCH = document.getElementById("crosshairContainer");
			containerCH.style.transform = `rotate(${obj.rotate}deg)`;

			if (previousStyle) {
				previousStyle.remove();
			}
			// Create a new stylesheet
			const style = document.createElement("style");
			style.id = "custom-mainCH";
			style.innerHTML = `
			.crosshair {
				position: absolute;
				transform-origin: 50% top;
				top: 50%;
				border: solid 0.05em ${obj.border};
				height: ${obj.length}em;
				opacity: ${obj.opacity};
				transform: rotate(${obj.angle || 0}deg);
			}
			.crosshair.normal {
				left: calc(50% - ${obj.width / 2}em);
				background: ${obj.color};
				width: ${obj.width}em;
			}
			.crosshair.powerful {
				left: calc(50% - ${obj.width / 2}em);
				background: red;
				width: ${obj.width}em;
			}
			.shotReticle.fill.normal {
				border-color: ${obj.color};
				border-left: solid transparent;
				border-right: solid transparent;
				border-width: 0.18em;
				padding: 0.18em;
			}
		`;

			document.body.appendChild(style);
		};

		const changeMiddleDot = (obj) => {
			const previousStyle = document.getElementById("custom-middleDot");
			if (previousStyle) previousStyle.remove();

			const dot = document.getElementById("reticleDot");

			dot.innerHTML = "";

			const style = document.createElement("style");
			style.id = "custom-middleDot";

			if (obj.shape === "plus") {
				style.innerHTML = `
				#reticleDot {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					width: 0;
					height: 0;
					background: none !important;
					border: none !important;
					opacity: ${obj.opacity};
				}
				#reticleDot .bar {
					position: absolute;
					background-color: ${obj.color};
					border: solid 0.05em ${obj.border}
				}
				#reticleDot .bar.horizontal {
					top: 50%;
					left: 50%;
					width: ${obj.width}px;
					height: ${obj.length}px;
					transform: translate(-50%, -50%) rotate(90deg);
				}
				#reticleDot .bar.vertical {
					left: 50%;
					top: 50%;
					width: ${obj.width}px;
					height: ${obj.length}px;
					transform: translate(-50%, -50%);
				}
			`;
				dot.innerHTML = `
				<div class="bar horizontal"></div>
				<div class="bar vertical"></div>
			`;
			} else {
				style.innerHTML = `
				#reticleDot {
					display: block;
					position: absolute;
					transform: translate(-50%, -50%);
					top: 50%;
					left: 50%;
					background-color: ${obj.color};
					border: solid 0.05em ${obj.border};
					width: ${obj.size}em;
					height: ${obj.size}em;
					opacity: ${obj.opacity};
					${obj.round ? "border-radius: 100%;" : ""}
				}
			`;
			}

			document.body.appendChild(style);
		};

		const Tweakpane = window.Tweakpane;
		const pane = new Tweakpane.Pane({
			title: "WISH",
			expanded: true,
		});
		const paneEl = document.querySelector("div.tp-dfwv");
		paneEl.style.zIndex = 1000;
		paneEl.style.width = `300px`;
		makeDraggable(document.querySelector(".tp-dfwv"));

		const folderMainCH = createFolders("Crosshair");
		const folderMiddleDot = createFolders("Middle Dot");
		const folderPaneSettings = createFolders("Panel Settings");

		loadExistingSettings("tp-mainCH", tp.mainCH, () => changeMainCH(tp.mainCH));
		loadExistingSettings("tp-middleDot", tp.middleDot, () => changeMiddleDot(tp.middleDot));
		loadExistingSettings("tp-paneSettings", tp.paneSettings, () => {
			const paneEl = document.querySelector("div.tp-dfwv");
			paneEl.style.width = `${tp.paneSettings.width}px`;
		});

		createInput(folderMainCH, tp.mainCH, "color", { label: "Color" }, () => {});
		createInput(folderMainCH, tp.mainCH, "border", { label: "Border Color" }, () => {});
		createInput(folderMainCH, tp.mainCH, "length", { label: "Length", min: 0, max: 10, step: 0.1 }, () => {});
		createInput(folderMainCH, tp.mainCH, "width", { label: "Width", min: 0, max: 10, step: 0.1 }, () => {});
		createInput(folderMainCH, tp.mainCH, "opacity", { label: "Opacity", min: 0, max: 1, step: 0.01 }, () => {});
		createInput(folderMainCH, tp.mainCH, "rotate", { label: "Rotate", min: 0, max: 360, step: 1.0 }, () => {});

		folderMainCH.on("change", (data) => {
			localStorage.setItem("tp-mainCH", JSON.stringify(tp.mainCH));
			changeMainCH(tp.mainCH);
		});

		createInput(folderMiddleDot, tp.middleDot, "color", { label: "Color" }, () => {});
		createInput(folderMiddleDot, tp.middleDot, "border", { label: "Border Color" }, () => {});
		const s = createInput(folderMiddleDot, tp.middleDot, "size", { label: "Size", min: 0, max: 5, step: 0.1 }, () => {});
		const r = createInput(folderMiddleDot, tp.middleDot, "round", { label: "Round" }, () => {});
		createInput(folderMiddleDot, tp.middleDot, "opacity", { label: "Opacity", min: 0, max: 1, step: 0.01 }, () => {});
		createInput(
			folderMiddleDot,
			tp.middleDot,
			"shape",
			{
				view: "list",
				label: "Shape",
				options: [
					{ text: "Dot", value: "dot" },
					{ text: "Plus", value: "plus" },
				],
			},
			() => {}
		);
		const i = createInput(folderMiddleDot, tp.middleDot, "length", { label: "Length", min: 0, max: 100, step: 1 }, () => {});
		const x = createInput(folderMiddleDot, tp.middleDot, "width", { label: "Width", min: 0, max: 5, step: 0.1 }, () => {});

		if (tp.middleDot.shape === "dot") {
			i.disabled = true;
			x.disabled = true;
		} else {
			s.disabled = true;
			r.disabled = true;
		}

		folderMiddleDot.on("change", (data) => {
			localStorage.setItem("tp-middleDot", JSON.stringify(tp.middleDot));
			changeMiddleDot(tp.middleDot);
			// console.log(tp.middleDot);
			if (tp.middleDot.shape === "dot") {
				i.disabled = true;
				x.disabled = true;
				s.disabled = false;
				r.disabled = false;
			} else {
				i.disabled = false;
				x.disabled = false;
				s.disabled = true;
				r.disabled = true;
			}
		});

		addInputWithValidation(folderPaneSettings, tp.paneSettings, "hidePanel", "Hide Panel");
		addInputWithValidation(folderPaneSettings, tp.paneSettings, "tabout", "Tabout");
		createInput(folderPaneSettings, tp.paneSettings, "width", { label: "Panel Width", min: 300, max: 1000, step: 1 }, () => {});
		folderPaneSettings.on("change", (data) => {
			setTimeout(() => {
				const paneEl = document.querySelector("div.tp-dfwv");
				paneEl.style.width = `${tp.paneSettings.width}px`;
				localStorage.setItem("tp-paneSettings", JSON.stringify(tp.paneSettings));
			}, 1000);
		});

		let oldPointerLock;
		let disable = () => {
			if (document.onpointerlockchange == null) return;
			oldPointerLock = document.onpointerlockchange;
			document.onpointerlockchange = null;
			document.exitPointerLock();
		};

		let enable = () => {
			if (document.onpointerlockchange) return;
			canvas.requestPointerLock();
			document.onpointerlockchange = oldPointerLock;
		};

		let handle = (event) => {
			let isPaused = vueApp?.game?.isPaused;
			let chatOpened = document.activeElement.id == "chatIn";
			if (chatOpened || isPaused) return; // hopefully this also helps prevent people from spamming it
			let inGame = extern?.inGame; // uncertain if this is needed?
			if (!inGame) return;
			document.onpointerlockchange == null ? enable() : disable(); // toggle :blobshrug:
		};

		document.addEventListener("keydown", (event) => {
			if (event.key === tp.paneSettings.hidePanel) {
				let chatOpened = document.activeElement.id == "chatIn";
				if (chatOpened) return;
				const element = document.querySelector(".tp-dfwv");
				element.style.display = element.style.display === "none" ? "block" : "none";
			}

			if (event.key === tp.paneSettings.tabout) {
				handle(event);
			}
		});
	});
})();
