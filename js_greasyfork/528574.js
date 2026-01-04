// ==UserScript==
// @name         Waypoints [Sploop.io]
// @name:zh      航点 [Sploop.io]
// @name:tr      Yolu Göstergeleri [Sploop.io]
// @name:ru      Точки маршрута [Sploop.io]
// @name:vi      Điểm chỉ đường [Sploop.io]
// @name:ar      علامات الطريق [Sploop.io]
// @description  Easily traverse the world of Sploop.io with Waypoints!
// @description:zh 轻松通过航点在Sploop.io世界中穿行！
// @description:tr  Kolayca Sploop.io dünyasında yol göstergeleri ile gezin!
// @description:ru  Легко путешествуйте по миру Sploop.io с помощью точек маршрута!
// @description:vi  Dễ dàng di chuyển trong thế giới Sploop.io với các điểm chỉ đường!
// @description:ar  اجتاز عالم Sploop.io بسهولة باستخدام علامات الطريق!
// @version      2.0.0
// @author       Hori + viper
// @match        https://sploop.io/
// @icon         https://i.ibb.co/ym4LXJF7/Waypoints-3-removebg-preview.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @namespace https://greasyfork.org/users/1441649
// @downloadURL https://update.greasyfork.org/scripts/528574/Waypoints%20%5BSploopio%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/528574/Waypoints%20%5BSploopio%5D.meta.js
// ==/UserScript==

/**
 *  Authors: horizion, viper
 *
 *  Menu Keybind : ESCAPE
 *
 *  (!) - You are able to modify the script in any way, as long as it abides by the in-game rules.
 *  (!) - Contact Horizion if the script does not work.
 *
 *  Discord: horizon2025.#0000 | <@880415818142347297>
 *
 *  Official Sploop.io Discord Server: https://discord.com/invite/CYadgpyv78
 */

(function () {
	"use strict";
	const win = window;
	const log = console.log;
	const version = `2.0.0`;

	const ARROW_DISTANCE_FROM_PLAYER = 210;
	const COLORS = [
		"red",
		"orange",
		"yellow",
		"green",
		"dark_blue",
		"light_blue",
		"purple",
		"violet",
		"pink",
		"rose",
	];
	const MARKER_IMAGES = [
		"https://i.ibb.co/20h3vpRG/map-cross-red.png",
		"https://i.ibb.co/VWZCzbgK/map-cross-orange.png",
		"https://i.ibb.co/x8jT4J4x/map-cross-yellow.png",
		"https://i.ibb.co/dstqTPQP/map-cross-darkgreen.png",
		"https://i.ibb.co/dsSZtg0Q/map-cross-darkblue.png",
		"https://i.ibb.co/4RPBRMH7/map-cross-lightblue.png",
		"https://i.ibb.co/84KYxdNd/map-cross-purple.png",
		"https://i.ibb.co/8LJ4FbbW/map-cross-indigo.png",
		"https://i.ibb.co/bgNv5NB7/map-cross-pink.png",
		"https://i.ibb.co/5WMsX1f1/map-cross-main.png",
	];
	const ARROW_IMAGES = [
		"https://i.ibb.co/chgGndnF/arrow-red.png",
		"https://i.ibb.co/LdkChynd/arrow-orange.png",
		"https://i.ibb.co/v6x76XN6/arrow-yellow.png",
		"https://i.ibb.co/2YYvqNHj/arrow-darkgreen.png",
		"https://i.ibb.co/6RrD7MvR/arrow-darkblue.png",
		"https://i.ibb.co/9kqtG2k4/arrow-lightblue.png",
		"https://i.ibb.co/ZzjZhK0g/arrow-purple.png",
		"https://i.ibb.co/sdgDvP0Y/arrow-indigo.png",
		"https://i.ibb.co/yFFq6jBN/arrow-pink.png",
		"https://i.ibb.co/zT2rYdFT/arrow-main.png",
	];
	const MARKER_COLOR_IMAGES = {
		red: "https://i.ibb.co/ksRyM6FY/circle-red.png",
		orange: "https://i.ibb.co/4gNKXnp6/circle-orange.png",
		yellow: "https://i.ibb.co/60rHrBWP/circle-yellow.png",
		green: "https://i.ibb.co/kVGgcVKT/circle-green.png",
		dark_blue: "https://i.ibb.co/9mbLDCLq/circle-darkblue.png",
		light_blue: "https://i.ibb.co/LhNv7JXx/circle-lightblue.png",
		purple: "https://i.ibb.co/WvddsXyk/circle-purple.png",
		violet: "https://i.ibb.co/PZKjyN2g/circle-indigo.png",
		pink: "https://i.ibb.co/bf2LzgM/circle-pink.png",
		rose: "https://i.ibb.co/0pMvXrMS/circle-main.png",
	};

	let waypointID = 0;
	let waypoints = [];
	let cards = [];

	win.showWaypointArrows = 1;

	//** Styling DOM */

	const style = document.createElement("style");
	style.type = "text/css";
	style.textContent = `
        :root {
            --main: #de5978;
            --secondary: rgb(43, 37, 37, 1);
        }
        button:focus {
            border: none;
            outline: none;
        }
        input:focus {
            outline: none;
            border: none;
        }

        /* Making scroll bar more pro */

        ::-webkit-scrollbar {
            width: 7px;
        }

        ::-webkit-scrollbar-thumb {
            background-color: var(--main);
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        ::-webkit-scrollbar-track {
            background-color: var(--secondary);
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        /* Main menu styling */

        #wayMenu {
            display: none;
            position: fixed;
            top: 160px;
            left: 293px;
            z-index: 99999;
            padding: 20px;
            background: var(--secondary);
            border-radius: 10px;
            max-height: 60%;
            overflow-y: auto;
            width: 400px;
            border: 1.5px solid var(--main);
        }
        .wayHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .wayTitle {
            font-size: 20px;
            color: var(--main);
        }
        .version {
            font-size: 15px;
            color: rgba(100, 100, 100,1);
        }
        .wayArrowToggle {
            display: flex;
            align-items: center;
            gap: 5px;
            opacity: 0;
            transition: all 0.3s ease-in-out;
            pointer-events: none;
        }
        .wayArrowToggle i {
            color: var(--main);
            font-size: 18px;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 20px;
        }

        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgb(41, 41, 41);
            transition: 0.3s;
            border-radius: 20px;
            border: 1px solid rgb(112, 53, 74);
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 14px;
            width: 14px;
            left: 3px;
            background-color: var(--main);
            bottom: 3px;
            transition: 0.3s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: rgba(187, 75, 101,0.6);
        }

        input:checked + .slider:before {
            transform: translateX(20px);
        }
        .wayCreateNewButton {
            margin-top: 25px;
            border: none;
            color: white;
            width: 250px;
            text-align: center;
            border-radius: 10px;
            padding: 7px;
            background: var(--main);
            font-size: 18px;
            cursor: pointer;
            font-weight: 990;
            height:35px;
            transition: transform 0.4s ease;
            border: 1px solid var(--secondary);
        }
        .wayCreateNewButton:hover {
            transform: translateY(-1px);
        }
        .wayCreateNewButton:disabled {
            background:rgb(187, 75, 101);
            color:rgba(156, 156, 156, 0.99);
            cursor: not-allowed;
            opacity: 0.85;
            transform: none;
        }
        .wayNotFound {
            text-align: center;
            display: block;
            font-size: 15px;
            color: white;
            margin-top: 20px;
        }
        .wayCreate {
        text-align: center;
        }

        /* popup styling */

        #wayPopMenu {
            display: block;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 25px;
            background: var(--secondary);
            border-radius: 10px;
            max-height: 50%;
            overflow-y: auto;
            text-align: center;
        }
        .popupHeader {
            position: absolute;
            top: 0;
            right: 8px;
            margin-bottom: 8px;
        }
        .closePopup {
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: #fff;
        }
        .popupHeader:hover {
            transform: translateY(-1px);
        }
        #markerName {
            border-radius: 10px;
            height:35px;
            text-align: center;
            font-size: 16px;
            border: none;
            width: 200px;
        }
        #wayColors {
            padding: 7px;
            height:35px;
            width: 200px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            margin-bottom: 16px;
            background: #fff;
            color: #333;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            text-align: center;
            font-weight: 800;
            cursor: pointer;
        }
        .wayCreateButton {
            border: none;
            color: white;
            width: 200px;
            text-align: center;
            border-radius: 10px;
            padding: 7px;
            background: var(--main);
            cursor: pointer;
            font-weight: 560;
            font-size: 16px;
            height:35px;
            transition: transform 0.4s ease;
        }
        .wayCreateButton:focus{
            border:none;
        }
        .wayCreateButton:hover {
            transform: translateY(-1px);
        }

        /* Card Styling */

        .card {
            display: flex;
            align-items: center;
            background:rgb(41, 41, 41);
            border-radius: 10px;
            padding: 10px;
            margin-top: 10px;
            color: white;
            border: 1px solid rgb(112, 53, 74);
        }

        .card img {
            width: 22px;
            height: 22px;
            margin-right: 10px;
            border-radius: 50%;
        }

        .card .card-name {
            flex: 4;
            font-size: 16px;
            margin-right: 10px;
            max-width: 145px;
        }

        .card .card-coords {
            flex: 3;
            font-size: 16px;
            margin-right: 10px;
            color: rgba(100, 100, 100,1);
        }

        .card .card-remove {
            background: #e43939;
            border: none;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        .card .card-remove:hover {
            transform: translateY(-1px);
        }
        #trash:hover {
            cursor: pointer;
        }
    `;
	document.head.appendChild(style);

	//** Main */

	document.addEventListener("DOMContentLoaded", () => {
		log(
			`%cWaypoints %cVersion ${version}\n%cCreators: %cviper + Hori`,
			"font-size: 90px; font-weight: 900; color: #de5978;",
			"font-size: 20px; color: gray;",
			"font-size: 20px; font-weight: 900; color:rgb(255, 255, 255); margin-top: 8px; margin-bottom: 10px;",
			"font-size: 20px; color:rgb(235, 187, 97); margin-top: 8px; margin-bottom: 10px;"
		);

		const wayMenu = document.createElement("div");
		wayMenu.id = "wayMenu";
		wayMenu.innerHTML = `
            <div class="wayHeader">
                <span class="wayTitle">Waypoints <span class="version">- v${version}</span></span>
                <div class="wayArrowToggle">
                    <i class="fa-solid fa-location-arrow"></i>
                    <label class="switch">
                        <input type="checkbox" id="waypointToggle" checked>
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            <div class="wayContent">
                <div id="wayNotFound" class="wayNotFound">
                    No Waypoints Found
                    <i class="fa-solid fa-magnifying-glass"></i>
                </div>
            </div>
            <div class="wayCreate">
                <button id="wayCreateNewButton" class="wayCreateNewButton" disabled>+</button>
            </div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css" integrity="sha512-SzlrxWUlpfuzQ+pcUCosxcglQRNAq/DZjVsC0lE40xsADsfeQoEypE+enwcOiGjk/bSuGGKHEyjSoQ1zVisanQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
        `;
		document.body.append(wayMenu);

		let isDragging = false,
			displayToggled = false,
			offsetX,
			offsetY;

		wayMenu.addEventListener("mousedown", function (event) {
			isDragging = true;
			offsetX = event.clientX - wayMenu.getBoundingClientRect().left;
			offsetY = event.clientY - wayMenu.getBoundingClientRect().top;
		});
		document.addEventListener("mousemove", function (event) {
			if (isDragging) {
				const newX = event.clientX - offsetX;
				const newY = event.clientY - offsetY;
				wayMenu.style.left = newX + "px";
				wayMenu.style.top = newY + "px";
			}
		});
		document.addEventListener("mouseup", () => {
			isDragging = false;
		});

		document
			.getElementById("wayCreateNewButton")
			.addEventListener("click", () => {
				if (!document.getElementById("wayPopMenu")) {
					createPopup();
				}
			});

		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape" && !isChatWrapperVisible()) {
				wayMenu.style.display = displayToggled ? "none" : "block";
				displayToggled = !displayToggled;
			}
		});

		document
			.getElementById("waypointToggle")
			.addEventListener("change", function () {
				if (this.checked) {
					win.showWaypointArrows = 1;
				} else {
					win.showWaypointArrows = 0;
				}
			});

		const observer = new MutationObserver(() => {
			updateCreateButton();
		});
		const homepage = document.getElementById("homepage");
		if (homepage) {
			observer.observe(homepage, {
				attributes: true,
				attributeFilter: ["style"],
			});
		}
	});

	const addWaypoint = new Proxy(waypoints, {
		set(target, property, value, receiver) {
			const result = Reflect.set(target, property, value, receiver);
			if (!isNaN(property)) {
				createCard(value);
			}
			return result;
		},
	});

	function createPopup() {
		let wayPopMenu = document.createElement("div");
		wayPopMenu.id = "wayPopMenu";
		wayPopMenu.innerHTML = `
            <div class="popupHeader">
                <span id="closePopup" class="closePopup">x</span>
            </div>
            <div class="inputContainer">
                <input type="text" id="markerName"placeholder="New Waypoint" maxLength="13"><br><br>
            </div>
            <div class="wayColor">
                <select name="colors" id="wayColors">
                    <option value="0">Red</option>
                    <option value="1">Orange</option>
                    <option value="2">Yellow</option>
                    <option value="3">Green</option>
                    <option value="4">Dark Blue</option>
                    <option value="5">Light Blue</option>
                    <option value="6">Purple</option>
                    <option value="7">Violet</option>
                    <option value="8">Pink</option>
                    <option value="9">Rose</option>
                </select>
            </div>
            <div class="wayCreate">
                <button id="createButton" class="wayCreateButton">Create</button>
            </div>
        `;
		document.body.appendChild(wayPopMenu);

		document
			.getElementById("markerName")
			.addEventListener("keydown", function (event) {
				event.stopPropagation();
			});
		document.getElementById("closePopup").addEventListener("click", () => {
			wayPopMenu.remove();
		});
		document
			.getElementById("createButton")
			.addEventListener("click", getOption);
	}

	function createCard(waypoint) {
		cards.push({
			name: waypoint.name,
			id: waypoint.id,
		});

		const card = document.createElement("div");
		card.className = "card";
		card.innerHTML = `
            <img src="${MARKER_COLOR_IMAGES[waypoint.color]}" alt="color">
            <div class="card-name">${waypoint.name}</div>
            <div class="card-coords">[${Math.round(waypoint.x)},${Math.round(waypoint.y)}]</div>
            <button class="card-remove"><i class="fa-solid fa-trash" id="trash"></i></button>
        `;

		document.querySelector(".wayContent").appendChild(card);

		updateArrowToggleAlpha();

		const removeButton = card.querySelector(".card-remove");

		removeButton.addEventListener("click", function () {
			const waypointIndex = waypoints.findIndex(
				(way) => way.id === waypoint.id
			);
			if (waypointIndex > -1) {
				waypoints.splice(waypointIndex, 1);
			}
			const cardIndex = cards.findIndex(
				(card) => card.id === waypoint.id
			);
			if (cardIndex > -1) {
				cards.splice(cardIndex, 1);
			}
			card.remove();
			if (cards.length === 0) {
				document.getElementById("wayNotFound").style.display = "block";
			}
			updateArrowToggleAlpha();
		});
	}

	function createWaypoint(name, color) {
		const chosenMarker = MARKER_IMAGES[color];
		const chosenArrow = ARROW_IMAGES[color];

		const markerImg = createImage(chosenMarker);
		const arrowImg = createImage(chosenArrow);

		const newWaypoint = {
			name,
			id: waypointID++,
			arrow: arrowImg,
			marker: markerImg,
			x: win.coords.x,
			y: win.coords.y,
			color: COLORS[color],
		};

		addWaypoint.push(newWaypoint);
	}
	function getOption() {
		const markerName = document.getElementById("markerName").value;
		const wayColor = document.getElementById("wayColors");
		const color = wayColor.value;
		if (markerName !== "") {
			createWaypoint(markerName, color);
			document.getElementById("wayNotFound").style.display = "none";
			document.getElementById("wayPopMenu").remove();
		}
	}
	function updateCreateButton() {
		const button = document.getElementById("wayCreateNewButton");
		const homepage = document.getElementById("homepage");

		if (homepage && homepage.style.display === "flex") {
			button.disabled = true;
		} else {
			button.disabled = false;
		}
	}
	function updateArrowToggleAlpha() {
		const toggle = document.querySelector(".wayArrowToggle");
		if (toggle) {
			toggle.style.opacity = cards.length === 0 ? "0" : "1";
			toggle.style.pointerEvents = cards.length === 0 ? "none" : "auto";
		}
	}
	function createImage(URL) {
		const image = new Image();
		image.src = URL;
		return image;
	}
	function isChatWrapperVisible() {
		return (
			document.getElementById("chat-wrapper").style.display === "block"
		);
	}

	//** Draw Waypoints, Arrows, Names */

	class Drawing {
		arrows(context, arrow, angle, x, y) {
			context.save();
			context.globalAlpha = 0.52;
			context.translate(x, y);
			context.rotate(angle);
			context.drawImage(arrow, -25 / 2, -25 / 2, 25, 25);
			context.restore();
		}
		name(context, waypoint) {
			const x = waypoint.x;
			const y = waypoint.y - 42;

			context.font = "24px Baloo Paaji";
			context.textAlign = "center";
			context.lineWidth = 8;
			context.strokeStyle = "#414141";
			context.lineJoin = "round";
			context.strokeText(waypoint.name, x, y);
			context.fillStyle = "white";
			context.fillText(waypoint.name, x, y);
		}
		waypoint(context, waypoint) {
			context.drawImage(
				waypoint.marker,
				waypoint.x - 70 / 2,
				waypoint.y - 70 / 2,
				70,
				70
			);
		}
	}
	const Draw = new Drawing();

	win.draw = (context) => {
		waypoints.forEach((waypoint) => {
			const distance = Math.hypot(
				waypoint.x - win.coords.x,
				waypoint.y - win.coords.y
			);

			if (distance < 1200) {
				Draw.waypoint(context, waypoint);
				Draw.name(context, waypoint);
			}
			if (win.showWaypointArrows && distance > 450) {
				const angle = Math.atan2(
					waypoint.y - win.coords.y,
					waypoint.x - win.coords.x
				);
				let radius = ARROW_DISTANCE_FROM_PLAYER;

				const x = win.coords.x + Math.cos(angle) * radius;
				const y = win.coords.y + Math.sin(angle) * radius;

				Draw.arrows(context, waypoint.arrow, angle, x, y);
			}
		});
	};

	//** Hooking onto the game */

	const TYPEOF = (value) =>
		Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
	const NumberSystem = [
		{
			radix: 2,
			prefix: "0b0*",
		},
		{
			radix: 8,
			prefix: "0+",
		},
		{
			radix: 10,
			prefix: "",
		},
		{
			radix: 16,
			prefix: "0x0*",
		},
	];
	class Regex {
		constructor(code, unicode, namespace) {
			if (!namespace)
				namespace =
					"new_script_" + Math.random().toString(36).substr(2, 8);
			this.code = code;
			this.COPY_CODE = code;
			this.unicode = unicode || false;
			this.hooks = {};
			this.namespace = namespace;
			this.totalHooks = 0;
		}

		static parseValue(value) {
			try {
				return Function(`return (${value})`)();
			} catch (err) {
				return null;
			}
		}

		isRegexp(value) {
			return TYPEOF(value) === "regexp";
		}

		generateNumberSystem(int) {
			const template = NumberSystem.map(
				({ prefix, radix }) => prefix + int.toString(radix)
			);
			return `(?:${template.join("|")})`;
		}

		parseVariables(regex) {
			regex = regex.replace(/\{VAR\}/g, "(?:let|var|const)");
			regex = regex.replace(/\{QUOTE\}/g, "['\"`]");
			regex = regex.replace(/ARGS\{(\d+)\}/g, (...args) => {
				let count = Number(args[1]),
					arr = [];
				while (count--) arr.push("\\w+");
				return arr.join("\\s*,\\s*");
			});
			regex = regex.replace(/NUMBER\{(\d+)\}/g, (...args) => {
				const int = Number(args[1]);
				return this.generateNumberSystem(int);
			});
			return regex;
		}

		_hookName(name) {
			return `${this.namespace}:${name}`;
		}

		format(name, inputRegex, flags) {
			this.totalHooks++;
			let regex = "";
			if (Array.isArray(inputRegex)) {
				regex = inputRegex
					.map((exp) => (this.isRegexp(exp) ? exp.source : exp))
					.join("\\s*");
			} else if (this.isRegexp(inputRegex)) {
				regex = inputRegex.source;
			}
			regex = this.parseVariables(regex);
			if (this.unicode) {
				regex = regex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
			}
			const expression = new RegExp(
				regex.replace(/\{INSERT\}/, ""),
				flags
			);
			return regex.includes("{INSERT}")
				? new RegExp(regex, flags)
				: expression;
		}

		template(type, name, regex, substr) {
			const hookName = this._hookName(name);
			const expression = new RegExp(
				`(${this.format(hookName, regex).source})`
			);
			const match = this.code.match(expression) || [];
			this.code = this.code.replace(
				expression,
				type === 0 ? "$1" + substr : substr + "$1"
			);
			this.hooks[hookName] = { expression, match };
			return match;
		}

		logHooks() {
			log(
				"%cApplied Hooks:",
				"font-weight: bold; font-size: 24px; color:rgb(255, 255, 255); margin-top: 20px;"
			);
			let index = 1;
			for (const hookName in this.hooks) {
				const hook = this.hooks[hookName];
				const matches = Array.isArray(hook.match)
					? hook.match
					: [hook.match];
				const status =
					matches && matches.length > 0
						? "successful"
						: "unsuccessful";
				const style =
					matches && matches.length > 0
						? "color:rgb(134, 204, 125); font-size: 14px;"
						: "color:rgb(221, 94, 113); font-size: 14px;";
				log(`%c${index}. ${hookName} | ${status}`, style);
				index++;
			}
			log(
				"%c-----------------",
				"font-weight: bold; color: gray; margin-bottom: 5px; margin-top: 20px;"
			);
		}

		match(name, regex, flags) {
			const hookName = this._hookName(name);
			const expression = this.format(hookName, regex, flags);
			const match = this.code.match(expression) || [];
			this.hooks[hookName] = { expression, match };
			return match;
		}

		replace(name, regex, substr, flags) {
			const hookName = this._hookName(name);
			const expression = this.format(hookName, regex, flags);
			const preMatch = this.code.match(expression) || [];
			this.code = this.code.replace(expression, substr);
			this.hooks[hookName] = {
				expression,
				match: preMatch,
				replaced: preMatch.length > 0,
			};
			return this.code.match(expression) || [];
		}

		append(name, regex, substr) {
			return this.template(0, name, regex, substr);
		}

		prepend(name, regex, substr) {
			return this.template(1, name, regex, substr);
		}
	}

	const applyHooks = (code) => {
		const namespace = `waypoints_v${version}`;
		const Hook = new Regex(window.HOOKED_CODE || code, true, namespace);

		window.COPY_CODE = (Hook.COPY_CODE.match(
			/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/
		) || [])[1];
		// log(Hook.COPY_CODE);

		if (!window.HOOKED_CODE)
			Hook.append(
				"EXTERNAL fix",
				/\(function (\w+)\(\w+\)\{/,
				"let $2 = eval(`(() => ${COPY_CODE})()`); delete window.COPY_CODE;"
			);
		Hook.replace("LOADER", /Loading Sploop.io/, `Loading...`);
		Hook.append(
			"COORDS",
			/,this\.\w{2}=0\},this\.\w{2}=\w+\((\w),(\w),\w\)\{/,
			`window.coords = { x: $2, y: $3 };`
		);
		Hook.prepend("DRAW",/\w=\w\[\w\(\)\.\w+\],\w=\w.{7,8};for\(let \w=\d;\w\W\w;\w\+\+\)!\(\w\[\w\]\.\w+&\w\(\)\.\w+\)&&\w+\(\w\[\w\],(\w),\w\);/,"/*55306335646D457A5457645A4D3070735756685362467044516D6C6C553046335A555657616D4649546C5A50626B70365756453950513D3D*/window.draw($2);");

		// log(Hook.code);
		window.HOOKED_CODE = Hook.code;

		Hook.logHooks();
		return Hook.code;
	};
	window.eval = new Proxy(window.eval, {
		apply(target, _this, args) {
			const code = args[0];
			if (code.length > 1e5) {
				args[0] = applyHooks(code);
				window.eval = target;
				target.apply(_this, args);
				return;
			}
			return target.apply(_this, args);
		},
	});
})();