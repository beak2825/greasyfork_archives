// ==UserScript==
// @name          AFK Script - Diep.io (Unmaintained)
// @author        Excigma
// @namespace     https://greasyfork.org/users/416480
// @version       3.1.2
// @description   Keeps your tank in the base while you're AFK in TDM Gamemodes
// @match         *://*.diep.io/*
// @namespace    https://diep.io/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/407788/AFK%20Script%20-%20Diepio%20%28Unmaintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407788/AFK%20Script%20-%20Diepio%20%28Unmaintained%29.meta.js
// ==/UserScript==

(async () => {
	const scriptLoaded = true;

	const
		canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	const
		snacktext = document.createElement("div"),
		snackbar = document.createElement("div"),
		span = document.createElement("span"),
		additionalInfo = document.createElement("p"),
		link = document.createElement("link");


	const points = [
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div"),
		document.createElement("div")
	];


	for (const point of points) {
		point.classList = "point";
		point.innerText = "✖";
		point.style.pointerEvents = "none";
		point.style.visibility = "hidden";
		document.body.appendChild(point);
	}

	const sleep = (ms) => {
			return new Promise(resolve => setTimeout(resolve, ms));
		},
		getCoords = (w, h) => {
			return [
				[w * 0.05, h * 0.05],
				[w * 0.3, h * 0.05],
				[w * 0.4, h * 0.05],
				[w * 0.6, h * 0.05],
				[w * 0.7, h * 0.05],
				[w * 0.95, h * 0.05],

				[w * 0.05, h * 0.15],
				[w * 0.3, h * 0.15],
				[w * 0.4, h * 0.15],
				[w * 0.6, h * 0.15],
				[w * 0.7, h * 0.15],
				[w * 0.95, h * 0.15],

				[w * 0.05, h * 0.4],
				[w * 0.3, h * 0.4],
				[w * 0.4, h * 0.4],
				[w * 0.6, h * 0.4],
				[w * 0.7, h * 0.4],
				[w * 0.95, h * 0.4],

				[w * 0.05, h * 0.6],
				[w * 0.3, h * 0.6],
				[w * 0.4, h * 0.6],
				[w * 0.6, h * 0.6],
				[w * 0.7, h * 0.6],
				[w * 0.95, h * 0.6],

				[w * 0.05, h * 0.85],
				[w * 0.3, h * 0.85],
				[w * 0.4, h * 0.85],
				[w * 0.6, h * 0.85],
				[w * 0.7, h * 0.85],
				[w * 0.95, h * 0.85],

				[w * 0.05, h * 0.95],
				[w * 0.3, h * 0.95],
				[w * 0.4, h * 0.95],
				[w * 0.6, h * 0.95],
				[w * 0.7, h * 0.95],
				[w * 0.95, h * 0.95],
			];
		};

	await sleep(500);


	let pressingUp = false,
		pressingDown = false,
		pressingLeft = false,
		pressingRight = false;

	let
		afk = false,
		ren_background_color,
		ren_border_color,
		ren_grid_base_alpha,
		ren_ui,
		detect;
	let
		leftPoints = 0,
		rightPoints = 0,
		topPoints = 0,
		bottomPoints = 0;


	additionalInfo.innerText = "Press Ctrl + Alt + B to activate";
	snacktext.innerText = "AFK Script by Excigma";
	span.innerText = "Press any key to dismiss";

	link.rel = "stylesheet";
	link.href = "https://diep-afk-script.glitch.me/afkscript.css";
	snackbar.id = "snackbar";

	document.body.appendChild(snackbar);


	snackbar.appendChild(snacktext);
	snackbar.appendChild(additionalInfo);
	snackbar.appendChild(span);
	document.head.appendChild(link);

	snackbar.classList = ["show"];


	document.addEventListener("keydown", async (e) => {
		if (!afk && snackbar.classList.contains("show")) snackbar.classList = [];

		if (e.ctrlKey == true) {
			switch (e.key) {
			case "b":
				if (!afk) {
					afk = true;
					additionalInfo.innerText = "Please wait...";
					snacktext.innerText = "Changing colors";
					snackbar.classList = ["show"];

					canvas.width = canvas.width;

					ren_ui = await input.get_convar("ren_ui");
					ren_background_color = await input.get_convar("ren_background_color");
					ren_border_color = await input.get_convar("ren_border_color");
					ren_grid_base_alpha = await input.get_convar("ren_grid_base_alpha");

					for (const point of points) {
						point.style.visibility = "visible";
					}

					canvas.width = canvas.width;
					snacktext.innerText = "AFK: On";
					additionalInfo.innerText = "";


					input.set_convar("ren_background_color", "0x0f111a");
					input.set_convar("ren_border_color", "0x0f111a");
					input.set_convar("ren_grid_base_alpha", 0);
					input.set_convar("ren_ui", false);



					let coods = getCoords(canvas.offsetWidth, canvas.offsetHeight);
					let coods2 = getCoords(canvas.width, canvas.height);


					canvas.width = canvas.width + 1;
					for (const [i, cood] of coods.entries()) {
						points[i].style.left = cood[0] + "px";
						points[i].style.top = cood[1] + "px";
					}

					canvas.width = canvas.width - 500;

					detect = setInterval(async () => {
						let column = 0;
						let row = 1;

						for (const [i, cood] of coods2.entries()) {
							canvas.width = canvas.width + 500;
							column++;

							const color = ctx.getImageData(cood[0], cood[1], 1, 1).data;
							if (color[0] === 15 && color[1] === 17 && color[2] === 26) {
								points[i].style.color = "#f00";
								if (column == 1 || column == 2) {
									leftPoints++;
								} else if (column == 5 || column == 6) {
									rightPoints++;
								}

								if (row == 1 || row == 2) {
									topPoints++;
								} else if (row == 5 || row == 6) {
									bottomPoints++;
								}
							} else {
								points[i].style.color = "#fff";
							}


							if (column == 6) {
								column = 0;
								if (row == 6) {
									row = 1;
								} else {
									row++;
								}
							}
						}

						if (topPoints > 8 && bottomPoints < 8) {
							input.keyDown(40);
							if (!additionalInfo.innerText.includes("Pressing Down\n")) {
								additionalInfo.innerText = additionalInfo.innerText += "Pressing Down\n";
							}
							pressingDown = true;
						} else if (pressingDown) {
							input.keyUp(40);
							additionalInfo.innerText = additionalInfo.innerText.replace("Pressing Down\n", "");
							pressingDown = false;
						}


						if (bottomPoints > 8 && topPoints < 8) {
							input.keyDown(38);
							if (!additionalInfo.innerText.includes("Pressing Up\n")) {
								additionalInfo.innerText = additionalInfo.innerText += "Pressing Up\n";
							}
							pressingUp = true;
						} else if (pressingUp) {
							input.keyUp(38);
							additionalInfo.innerText = additionalInfo.innerText.replace("Pressing Up\n", "");
							pressingUp = false;
						}


						if (leftPoints > 8 && rightPoints < 8) {
							input.keyDown(39);
							if (!additionalInfo.innerText.includes("Pressing Right\n")) {
								additionalInfo.innerText = additionalInfo.innerText += "Pressing Right\n";
							}
							pressingRight = true;
						} else if (pressingRight) {
							input.keyUp(39);
							additionalInfo.innerText = additionalInfo.innerText.replace("Pressing Right\n", "");
							pressingRight = false;
						}


						if (rightPoints > 8 && leftPoints < 8) {
							input.keyDown(37);
							if (!additionalInfo.innerText.includes("Pressing Left\n")) {
								additionalInfo.innerText = additionalInfo.innerText += "Pressing Left\n";
							}
							pressingLeft = true;
						} else if (pressingLeft) {
							input.keyUp(37);
							additionalInfo.innerText = additionalInfo.innerText.replace("Pressing Left\n", "");
							pressingLeft = false;
						}

						topPoints = 0;
						bottomPoints = 0;
						leftPoints = 0;
						rightPoints = 0;
					}, 200);
				} else {
					snackbar.classList = [];
					clearInterval(detect);

					input.keyUp(37),
					input.keyUp(40),
					input.keyUp(38),
					input.keyUp(39);

					input.set_convar("ren_border_color", ren_border_color);
					input.set_convar("ren_background_color", ren_background_color);
					input.set_convar("ren_grid_base_alpha", ren_grid_base_alpha);
					input.set_convar("ren_ui", ren_ui);

					for (const point of points) {
						point.style.visibility = "hidden";
					}

					afk = false;
				}
			}
		}
	});
})();
