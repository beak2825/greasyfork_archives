// ==UserScript==
// @name         Florr.io Shadows v1.2
// @namespace    https://florr.io
// @version      1.21
// @description  Adds some stylistic shadow effects to florr.io
// @author       Jekyll#1984
// @match        https://florr.io/*
// @run-at       document-end
// @icon         https://media.discordapp.net/attachments/843395236537434192/1054562690925867108/preview.gif
// @downloadURL https://update.greasyfork.org/scripts/450281/Florrio%20Shadows%20v12.user.js
// @updateURL https://update.greasyfork.org/scripts/450281/Florrio%20Shadows%20v12.meta.js
// ==/UserScript==

! function() {
	"use strict";
	let menuStatus = false;
	let menuAlpha = 0;
	let menuHasOpened = localStorage.getItem("Shader Menu Opened") != null ? JSON.parse(localStorage.getItem("Shader Menu Opened")) : false;
	let helpAlpha = 0;

	const lerp = (a, b, c) => a + c * (b - a);
	const holder = document.createElement("div");

	const shadowProperties = {};

	function HandleColor(self, color, isStroke, isOffscreen) {
		if (isOffscreen && !shadowProperties.shadowOffscreenCanvas) return color;
		for (let key in shadowProperties) self[key] = shadowProperties[key];
		if (shadowProperties.shadowColorInherit) self.shadowColor = color;
		return color;
	}

	codeblock_one: {
		const {
			set: _setFillStyle,
			get: _getFillStyle
		} = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'fillStyle');
		Object.defineProperty(CanvasRenderingContext2D.prototype, 'fillStyle', {
			get() {
				return _getFillStyle.call(this);
			},
			set(v) {
				_setFillStyle.call(this, HandleColor(this, v, false, false));
			}
		});
		const {
			set: _setStrokeStyle,
			get: _getStrokeStyle
		} = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, 'strokeStyle');
		Object.defineProperty(CanvasRenderingContext2D.prototype, 'strokeStyle', {
			get() {
				return _getStrokeStyle.call(this);
			},
			set(v) {
				_setStrokeStyle.call(this, HandleColor(this, v, true, false));
			}
		});
	}

	codeblock_two: {
		const {
			set: _setFillStyle,
			get: _getFillStyle
		} = Object.getOwnPropertyDescriptor(OffscreenCanvasRenderingContext2D.prototype, 'fillStyle');
		Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'fillStyle', {
			get() {
				return _getFillStyle.call(this);
			},
			set(v) {
				_setFillStyle.call(this, HandleColor(this, v, false, true));
			}
		});
		const {
			set: _setStrokeStyle,
			get: _getStrokeStyle
		} = Object.getOwnPropertyDescriptor(OffscreenCanvasRenderingContext2D.prototype, 'strokeStyle');
		Object.defineProperty(OffscreenCanvasRenderingContext2D.prototype, 'strokeStyle', {
			get() {
				return _getStrokeStyle.call(this);
			},
			set(v) {
				_setStrokeStyle.call(this, HandleColor(this, v, true, true));
			}
		});
	}

	const help = document.createElement("p");
	help.style.position = "absolute";
	help.style.top = "0%";
	help.style.left = "50%";
	help.style.fontFamily = "Ubuntu";
	help.style.fontSize = "3vw";
	help.innerText = "Press F2 to open the Shadow Menu";
	help.style.color = "#FFFFFF";
	help.style.transform = "translate(-50%, -50%)";
	help.style.pointerEvents = "none";
	document.body.appendChild(help);

	holder.style.position = "absolute";
	holder.style.backgroundColor = "#1a1a1a";
	holder.style.border = "1.6vw ridge #333333";
	holder.style.top = "50%";
	holder.style.left = "50%";
	holder.style.fontFamily = "Ubuntu";
	holder.style.transform = "translate(-50%, -50%)";
	holder.style.padding = "0.5vw";
	const settings = [
		["Shadow Offset X", 0, "slider", [-20, 20], "shadowOffsetX"],
		["Shadow Offset Y", 0, "slider", [-20, 20], "shadowOffsetY"],
		["Shadow Strength", 0, "slider", [0, 30], "shadowBlur"],
		["Shadow Color", "#FFFFFF", "color", [], "shadowColor"],
		["Shadow Inherits Color", false, "checkbox", [], "shadowColorInherit"],
		["Shadow on GUI (Reload Required)", false, "checkbox", [], "shadowOffscreenCanvas"],
	].map(data => {
		data[1] = localStorage.getItem(data[0]) != null ? localStorage.getItem(data[0]) : data[1];
		const div = document.createElement("div");
		div.style.width = "100%";
		div.style.height = "4vw";
		div.style.fontSize = "2vw";
		div.style.color = "#ffffff";
		const text = document.createElement("p");
		text.style.margin = "0px";
		text.style.padding = "0px";
		text.style.display = "inline";
		div.appendChild(text);
		let pussyshittereatcumlol = null;
		switch (data[2]) {
			case "slider": {
				const slider = document.createElement('input');
				slider.style.verticalAlign = 'middle';
				slider.style.width = '40%';
				slider.type = 'range';
				text.innerText = `${data[0]} (${data[1]})`;
				slider.min = data[3][0];
				slider.max = data[3][1];
				slider.value = JSON.parse(data[1]);
				slider.style.margin = "0px";
				slider.style.display = "inline";
				slider.style.marginLeft = "1.5vw";
				slider.style.float = "right";

				slider.style["-webkit-appearance"] = "none";
				slider.style.height = "1vw";

				slider.addEventListener('input', event => {
					text.innerText = `${data[0]} (${event.target.value})`;
					localStorage.setItem(data[0], event.target.value);
				});

				slider.step = 1;
				pussyshittereatcumlol = slider;
				div.appendChild(slider);
			};
			break;
			case "color": {
				const input = document.createElement('input');
				input.style.verticalAlign = "middle";
				input.type = "color";
				input.value = data[1];

				input.style.margin = "0px";
				input.style.display = "inline";
				input.style.marginLeft = "1.5vw";
				input.style.float = "right";

				input.style.width = '40%';
				input.style.border = "0px";
				pussyshittereatcumlol = input;
				text.innerText = `${data[0]}`;

				input.addEventListener('input', event => {
					localStorage.setItem(data[0], event.target.value);
				});

				div.appendChild(input);
			};
			break;
			case "checkbox": {
				const box = document.createElement("input");
				box.style.verticalAlign = "middle";
				box.type = "checkbox";
				text.innerText = `${data[0]}`;
				box.style.display = "inline";
				box.style.float = "right";
				box.checked = JSON.parse(data[1]);

				box.style.width = "1.5vw";
				box.style.height = "1.5vw";

				box.addEventListener('input', event => {
					localStorage.setItem(data[0], event.target.checked);
					console.log(event.target.checked);
				});

				pussyshittereatcumlol = box;
				div.appendChild(box);
				/*const slider = document.createElement('input');
				slider.style.verticalAlign = 'middle';
				slider.style.width = '40%';
				slider.type = 'range';
				text.innerText = `${data[0]} (${data[1]})`;
				slider.min = data[3][0];
				slider.max = data[3][1];
                slider.value = JSON.parse(data[1]);
				slider.style.margin = "0px";
				slider.style.display = "inline";
				slider.style.marginLeft = "1.5vw";
				slider.style.float = "right";

				slider.style["-webkit-appearance"] = "none";
				slider.style.height = "1vw";

				slider.addEventListener('input', event => {
					text.innerText = `${data[0]} (${event.target.value})`;
					localStorage.setItem(data[0], event.target.value);
				});

				slider.step = 1;
				pussyshittereatcumlol = slider;
				div.appendChild(slider);*/
			}
			break;
		}

		holder.appendChild(div);

		return {
			getValue: () => pussyshittereatcumlol.value === "on" ? pussyshittereatcumlol.checked : pussyshittereatcumlol.value,
			property: data[4]
		};
	});

	const div = document.createElement("div");
	div.style.width = "100%";
	div.style.height = "1.5vw";
	div.style.fontSize = "1vw";
	div.style.color = "#ffffff";
	div.style.position = "absolute";
	div.style.bottom = "0px";
	const text = document.createElement("a");
	text.text = "Script by Jekyll#1984, Enjoy!";
	text.title = "Skara's Biolink";
	text.href = "https://skara.glitch.me/";
	text.style.float = "right";
	text.style.padding = "0px";
	text.style.margin = "0px";
	text.style.marginRight = "1vw";

	div.appendChild(text);
	holder.appendChild(div);

	document.body.appendChild(holder);

	const animationLoop = () => {
		menuAlpha = lerp(menuAlpha, menuStatus, 0.2);
		holder.style.opacity = menuAlpha;
		holder.style.top = `${50 * menuAlpha | 0}%`;

		helpAlpha = lerp(helpAlpha, !menuHasOpened, 0.2);
		help.style.opacity = helpAlpha;
		//holder.style.top = `${50 * menuAlpha | 0}%`;

		if (menuAlpha > 0.8) holder.style.pointerEvents = "auto";
		else holder.style.pointerEvents = "none";

		const ratio = Math.min(innerWidth, innerHeight) / 1080;
		holder.style.width = `${800 * ratio}px`;
		holder.style.height = `${500 * ratio}px`;

		requestAnimationFrame(animationLoop);
		for (let setting of settings) {
			let value = isNaN(setting.getValue()) ? setting.getValue() : +(setting.getValue());
			shadowProperties[setting.property] = value;
		};
	}
	animationLoop();

	window.addEventListener("keydown", event => {
		if (event.keyCode === 113) {
			event.preventDefault();
			menuStatus = !menuStatus
			localStorage.setItem("Shader Menu Opened", true);
			menuHasOpened = true;
		};
	});
}();