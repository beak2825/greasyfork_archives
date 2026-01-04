// ==UserScript==
// @name         _N0N4M3's Diep.io Mod
// @namespace    http://tampermonkey.net/
// @version      2024-11-06
// @description  Dark theme, FPS & Ping display, ESP, Aim helper, Factory helper
// @author       _N0N4M3
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515259/_N0N4M3%27s%20Diepio%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/515259/_N0N4M3%27s%20Diepio%20Mod.meta.js
// ==/UserScript==

let darkThemeEnabled = 0;
let info = 0;
let currentElem = {};
let fill = CanvasRenderingContext2D.prototype.fill;
let X = 200;
let Y = X * (innerHeight / innerWidth);
let aimLine = 0;
let esp = 0;
let factoryHelper = 0;
let D = Math.hypot(innerWidth / 2, innerHeight / 2);
let cursorX = 0;
let cursorY = 0;
let closestCircleX = innerWidth / 2;
let closestCircleY = innerHeight / 2;
 
function darkTheme() {
	input.execute("ren_background false");
	input.execute("net_replace_colors 0x1c1c1c 0x333333 0x003b4b 0x003b4b 0x501a1c 0x3f2a51 0x004b24 0x2e5523 0x554d23 0x542727 0x272f54 0x502749 0x554d23 0x165530 0x3e3e3e 0x501a1c 0x544127 0x404040");
	input.execute("ren_minimap_background_color 0x444444");
	input.execute("ren_minimap_border_color 0x444444");
	input.execute("ren_stroke_soft_color_intensity -2");
	input.execute("ren_health_background_color 0x222222");
	input.execute("ren_health_fill_color 0x00FF00");
	input.execute("ren_score_bar_fill_color 0xFF0000");
	input.execute("ren_xp_bar_fill_color 0xFFFF80");
	input.execute("ren_bar_background_color 0x111111");

	darkThemeEnabled = 1;
}

function lightTheme() {
	input.execute("ren_background true");
	input.execute("net_replace_colors 0x555555 0x999999 0x00B2E1 0x00B2E1 0xF14E54 0xBF7FF5 0x00E16E 0x8AFF69 0xFFE869 0xFC7677 0x768DFC 0xF177DD 0xFFE869 0x43FF91 0xBBBBBB 0xF14E54 0xFCC376 0xC0C0C0");
	input.execute("ren_minimap_background_color 0xCDCDCD");
	input.execute("ren_minimap_border_color 0x555555");
	input.execute("ren_stroke_soft_color_intensity 0.25");
	input.execute("ren_health_background_color 0x555555");
	input.execute("ren_health_fill_color 0x85E37D");
	input.execute("ren_score_bar_fill_color 0x43FF91");
	input.execute("ren_xp_bar_fill_color 0xFFDE43");
	input.execute("ren_bar_background_color 0x000000");

	darkThemeEnabled = 0;
}
 
function showInfo() {
	input.execute("ren_debug_info true");
	input.execute("ren_fps true");
}
 
function hideInfo() {
	input.execute("ren_debug_info false");
	input.execute("ren_fps false");
}

function canUseKey(e) {
    return input.doesHaveTank() && !e.ctrlKey && currentElem.tagName != "INPUT" && document.activeElement && document.activeElement.tagName != "INPUT";
}

function drawLine(ctx, x, y) {
	if ((x < X || x > innerWidth - X) || (y < Y || y > innerHeight - Y)) {
		let cX = innerWidth / 2;
		let cY = innerHeight / 2;
		let p1X = x;
		let p1Y = y;
		let p2X = p1X + (cX - p1X) * 0.4;
		let p2Y = p1Y + (cY - p1Y) * 0.4;

		ctx.beginPath();
		ctx.moveTo(p1X, p1Y);
		ctx.lineTo(p2X, p2Y);
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#FF0";
		ctx.stroke();
		ctx.closePath();
	}
}

function resize(canvas) {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	Y = X * (innerHeight / innerWidth);
	D = Math.hypot(innerWidth / 2, innerHeight / 2);
}

function createCanvas() {
	let canvas = document.createElement("canvas");

	resize(canvas);

	canvas.style.display = "block";
	canvas.style.position = "absolute";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.zIndex = 1000;
	canvas.style.pointerEvents = "none";

	document.body.append(canvas);

	return canvas;
}

function drawAimLine(ctx) {
	let p1X = closestCircleX;
	let p1Y = closestCircleY;
	let a = Math.atan2(cursorY - p1Y, cursorX - p1X);
	let p2X = p1X + Math.cos(a) * D;
	let p2Y = p1Y + Math.sin(a) * D;

	ctx.beginPath();
	ctx.moveTo(p1X, p1Y);
	ctx.lineTo(p2X, p2Y);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#EEE";
	ctx.stroke();
	ctx.closePath();
}

function drawCircle(ctx, r) {
	ctx.beginPath();
	ctx.arc(cursorX, cursorY, r, 0, Math.PI * 2);
	ctx.stroke();
	ctx.closePath();
}

function drawFactoryHelperCircles(ctx) {
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#EEE";
	
	drawCircle(ctx, 315);
	drawCircle(ctx, 85);
}
 
document.addEventListener("keydown", e => {
    let canUse = canUseKey(e);

	if (canUse) {
		let code = e.code;
 
		if (code == "KeyR") {
			darkTheme();
		}
 
		if (code == "KeyT") {
			lightTheme();
		}

		if (code == "KeyF") {
			aimLine = !aimLine;
		}

		if (code == "KeyG") {
			esp = !esp;
		}

		if (code == "KeyJ") {
			factoryHelper = !factoryHelper;
		}

		if (code == "KeyB") {
			// openBuilds();
		}

		if (code == "KeyN") {
			// openScoreHistory();
		}
	}
});
 
document.addEventListener("keyup", e => {
    let canUse = canUseKey(e);

	if (canUse) {
		let code = e.code;
 
		if (code == "KeyL") {
			info = !info;
 
			if (info) {
				showInfo();
			} else {
				hideInfo();
			}
		}
	}
});

document.addEventListener("mousemove", e => {
	cursorX = e.clientX;
	cursorY = e.clientY;
});

window.addEventListener("beforeunload", () => {
	lightTheme();
});

CanvasRenderingContext2D.prototype.fill = function() {
	if (darkThemeEnabled && this.fillStyle == "#000000") {
		this.fillStyle = "#EEEEEE";
	}

	fill.apply(this);
}

let interval = setInterval(function() {
	let img = document.getElementById("backdrop-asset");
	let canvas1 = document.getElementById("canvas");

	if (img && canvas1) {
		clearInterval(interval);

		img.remove();

		let ctx1 = canvas1.getContext("2d");
		let fill = ctx1.fill.bind(ctx1);
		let arc = ctx1.arc.bind(ctx1);
		let clearRect = ctx1.clearRect.bind(ctx1);

		let canvas2 = createCanvas();
		let ctx2 = canvas2.getContext("2d");

		document.body.addEventListener("resize", function() {
			resize(canvas2);
		});

		ctx1.arc = function(x, y, r, sA, eA, cc = false) {
			arc(x, y, r, sA, eA, cc);

			let transform = ctx1.getTransform();
			let x1 = transform.e;
			let y1 = transform.f;
			let r1 = transform.a;

			if (esp && r1 >= 20 && ctx1.globalAlpha == 1) {
				drawLine(ctx2, x1, y1);
			}

			if (Math.abs(x1 - innerWidth / 2) < 70 && Math.abs(y1 - innerHeight / 2) < 70 && r1 >= 20 && ctx1.globalAlpha == 1) {
				closestCircleX = x1;
				closestCircleY = y1;
			}
		}

		ctx1.clearRect = function(x, y, w, h) {
			clearRect(x, y, w, h);
			ctx2.clearRect(0, 0, innerWidth, innerHeight);

			if (aimLine && input.doesHaveTank()) {
				drawAimLine(ctx2);
			}

			if (factoryHelper && input.doesHaveTank()) {
				drawFactoryHelperCircles(ctx2);
			}
		}
	}
}, 100);