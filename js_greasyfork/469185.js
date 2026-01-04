// ==UserScript==
// @name		Automagic Jigidi Solver
// @description	Fastest way of solving Jigidi puzzles
// @match		https://jigidi.com/solve*
// @match		https://www.jigidi.com/solve*
// @match		https://jigidi.com/*/solve*
// @match		https://www.jigidi.com/*/solve*
// @grant		GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @grant		GM_unregisterMenuCommand
// @grant		GM_xmlhttpRequest
// @grant		unsafeWindow
// @version		2.4.0
// @icon https://www.jigidi.com/favicon.ico
// @namespace https://greasyfork.org/en/scripts/469185
// @homepageURL https://greasyfork.org/en/scripts/469185
// @supportURL https://greasyfork.org/en/scripts/469185/feedback
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/469185/Automagic%20Jigidi%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/469185/Automagic%20Jigidi%20Solver.meta.js
// ==/UserScript==
(function () {
	"use strict";

	const BLOCKED = "javascript/blocked";
	const MSG_DISABLED = "<b>Solver is temporarily disabled, try again later</b>";
	const MSG_NO_MESSAGE = "<b>Puzzle has no completion message!</b>";

	let collections = {
		collectListeners: false,
		collectObjects: false,
		mousedown: [],
		mousemove: [],
		mouseup: [],
		objects: new Set(),
		clear: function () {
			this.mousedown.length = 0;
			this.mousemove.length = 0;
			this.mouseup.length = 0;
			this.objects.clear();
		},
	};

	/* Note that function ordering is important as we are overwriting prototype functions.
	 * All overrides must be done before first use.
	 */

	/* "original" functions */
	const documentAddEventListener = HTMLDocument.prototype.addEventListener;
	const elementAddEventListener = Element.prototype.addEventListener;
	const functionApply = Function.prototype.apply;
	const functionToString = Function.prototype.toString;
	const objectGetOwnPropertyDescriptors = Object.getOwnPropertyDescriptors;
	const objectGetOwnPropertyNames = Object.getOwnPropertyNames;
	const reflectOwnKeys = Reflect.ownKeys;
	const windowAddEventListener = unsafeWindow.addEventListener;

	/* avoid calling our override */
	documentAddEventListener.apply = functionApply;
	elementAddEventListener.apply = functionApply;
	functionApply.apply = functionApply;
	functionToString.apply = functionApply;
	objectGetOwnPropertyNames.apply = functionApply;
	objectGetOwnPropertyDescriptors.apply = functionApply;
	reflectOwnKeys.apply = functionApply;
	windowAddEventListener.apply = functionApply;

	Element.prototype.addEventListener = function addEventListener() {
		if (!collections.collectListeners) {
			return elementAddEventListener.apply(this, arguments);
		}

		switch (arguments[0]) {
			case "mousedown":
				collections.mousedown.push(arguments[1]);
				break;
			case "mousemove":
				collections.mousemove.push(arguments[1]);
				break;
			case "mouseup":
				collections.mouseup.push(arguments[1]);
				break;
			default:
				break;
		}

		return elementAddEventListener.apply(this, [
			arguments[0],
			createListenerWrapper(arguments[1]),
		]);
	};

	Function.prototype.apply = function apply() {
		collections.collectObjects &&
			arguments[0] &&
			collections.objects.add(arguments[0]);
		return functionApply.apply(this, arguments);
	};

	Function.prototype.toString = function toString() {
		switch (this) {
			case Element.prototype.addEventListener:
				return functionToString.apply(elementAddEventListener, arguments);
			case Function.prototype.apply:
				return functionToString.apply(functionApply, arguments);
			case Function.prototype.toString:
				return functionToString.apply(functionToString, arguments);
			case HTMLDocument.prototype.addEventListener:
				return functionToString.apply(documentAddEventListener, arguments);
			case Object.getOwnPropertyDescriptors:
				return functionToString.apply(
					objectGetOwnPropertyDescriptors,
					arguments
				);
			case Object.getOwnPropertyNames:
				return functionToString.apply(objectGetOwnPropertyNames, arguments);
			case Reflect.ownKeys:
				return functionToString.apply(reflectOwnKeys, arguments);
			case unsafeWindow.addEventListener:
				return functionToString.apply(windowAddEventListener, arguments);
			default:
				return functionToString.apply(trap.get(this) || this, arguments);
		}
	};

	HTMLDocument.prototype.addEventListener = function addEventListener() {
		if (!collections.collectListeners) {
			return documentAddEventListener.apply(this, arguments);
		}

		switch (arguments[0]) {
			case "mousedown":
				collections.mousedown.push(arguments[1]);
				break;
			case "mousemove":
				collections.mousemove.push(arguments[1]);
				break;
			case "mouseup":
				collections.mouseup.push(arguments[1]);
				break;
			case "blur":
			case "visibilitychange":
				return documentAddEventListener.apply(this, [arguments[0], (_) => { }]);
			default:
				break;
		}

		return documentAddEventListener.apply(this, [
			arguments[0],
			createListenerWrapper(arguments[1]),
		]);
	};

	Object.getOwnPropertyNames = function getOwnPropertyNames() {
		return filterStorage(objectGetOwnPropertyNames.apply(this, arguments));
	};

	Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors() {
		const descriptors = objectGetOwnPropertyDescriptors.apply(this, arguments);
		delete descriptors[storage];
		return descriptors;
	};

	Reflect.ownKeys = function ownKeys() {
		return filterStorage(reflectOwnKeys.apply(this, arguments));
	};

	unsafeWindow.addEventListener = function addEventListener() {
		if (!collections.collectListeners) {
			return windowAddEventListener.apply(this, arguments);
		}

		switch (arguments[0]) {
			case "mousedown":
				collections.mousedown.push(arguments[1]);
				break;
			case "mousemove":
				collections.mousemove.push(arguments[1]);
				break;
			case "mouseup":
				collections.mouseup.push(arguments[1]);
				break;
			case "blur":
			case "visibilitychange":
				return windowAddEventListener.apply(this, [arguments[0], (_) => { }]);
			default:
				break;
		}

		return windowAddEventListener.apply(this, [
			arguments[0],
			createListenerWrapper(arguments[1]),
		]);
	};

	const debug = false;
	const deltas = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	];
	const copy_id = randomId();
	const download_id = randomId();
	const no_message = GM_getValue("no_message", true);
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const solve_id = randomId();
	const storage = "$" + randomId();
	const trap = new Map();

	let board_data;
	let canvas;
	let jigidi;
	let piece_id;
	let piece_size;
	let puzzle;
	let renderer;

	function calculateDistancesToNeighbors(piece1) {
		/* get piece cell (col/row) */
		const cell = Object.values(piece1[3]);

		/* get piece local position */
		let pos1 = Object.values(piece1[0]);

		/* calculate square distance to each neighbor */
		const neighbors = [];
		for (const delta of deltas) {
			/* calculate neighbor id */
			const id = piece_id(cell[0] + delta[0], cell[1] + delta[1]);
			if (id < 0) {
				continue;
			}

			/* get neighbor piece */
			const piece2 = Object.values(board_data[5][id]);

			/* compare group ids */
			if (getGroupId(piece1) === getGroupId(piece2)) {
				continue;
			}

			/* calculate target position */
			let pos2 = Object.values(piece2[0]);
			pos2[0] -= delta[0] * piece_size[0];
			pos2[1] -= delta[1] * piece_size[1];

			/* calculate delta */
			const dx = pos2[0] - pos1[0];
			const dy = pos2[1] - pos1[1];
			neighbors.push([id, delta, dx * dx + dy * dy]);
		}

		/* sort by distance */
		return neighbors.sort((lhs, rhs) => {
			return lhs[2] - rhs[2];
		});
	}

	function calculatePieceId(boardConfig) {
		const grid = Object.values(Object.values(boardConfig)[0]);
		return function calculatePieceId(col, row) {
			return 0 > col || 0 > row || col >= grid[0] || row >= grid[1]
				? -1
				: row * grid[0] + col;
		};
	}

	function convertCanvasPosToScreenPos(canvas, x, y) {
		let rect, screenX, screenY;

		try {
			rect = canvas.getBoundingClientRect();
		} catch (err) {
			rect = {
				top: canvas.offsetTop,
				left: canvas.offsetLeft,
				width: canvas.offsetWidth,
				height: canvas.offsetHeight,
			};
		}

		const marginX =
			(window.pageXOffset || document.scrollLeft || 0) -
			(document.clientLeft || document.body.clientLeft || 0);
		const marginY =
			(window.pageYOffset || document.scrollTop || 0) -
			(document.clientTop || document.body.clientTop || 0);
		const style = window.getComputedStyle
			? getComputedStyle(canvas)
			: canvas.currentStyle;
		const left =
			rect.left +
			marginX +
			(parseInt(style.paddingLeft, 10) + parseInt(style.borderLeftWidth, 10));
		const right =
			rect.right +
			marginX -
			(parseInt(style.paddingRight, 10) + parseInt(style.borderRightWidth, 10));
		const top =
			rect.top +
			marginY +
			(parseInt(style.paddingTop, 10) + parseInt(style.borderTopWidth, 10));
		const bottom =
			rect.bottom +
			marginY -
			(parseInt(style.paddingBottom, 10) +
				parseInt(style.borderBottomWidth, 10));

		if (y === undefined) {
			screenX = left + (x.x * (right - left)) / canvas.width;
			screenY = top + (x.y * (bottom - top)) / canvas.height;
		} else {
			screenX = left + (x * (right - left)) / canvas.width;
			screenY = top + (y * (bottom - top)) / canvas.height;
		}

		return { x: screenX, y: screenY };
	}

	function convertLocalToGlobal(matrix, pos) {
		let globalX, globalY;

		if (!matrix) {
			globalX = 0;
			globalY = 0;
		} else {
			globalX = matrix[0] * pos[0] + matrix[2] * pos[1] + matrix[4];
			globalY = matrix[1] * pos[0] + matrix[3] * pos[1] + matrix[5];
		}

		return { x: globalX, y: globalY };
	}

	function createListenerWrapper(listener) {
		return function wrapper(event) {
			if (global.solver_run && !event.shiftKey) {
				return;
			}
			return listener(event);
		};
	}

	function createMouseEvent(eventType, x, y, dx, dy) {
		let TrustedMouseEvent = function (eventType, x, y, dx, dy) {
			let defaultPrevented = false;
			return Object.create(MouseEvent.prototype, {
				button: {
					value: 0,
				},
				buttons: {
					value: +(eventType == "mousedown" || eventType == "mousemove"),
				},
				clientX: {
					value: x,
				},
				clientY: {
					value: y,
				},
				defaultPrevented: {
					get: () => {
						return defaultPrevented;
					},
				},
				isTrusted: {
					enumerable: true,
					value: true,
				},
				movementX: {
					value: dx || 0,
				},
				movementY: {
					value: dy || 0,
				},
				preventDefault: {
					value: () => {
						defaultPrevented = true;
					},
				},
				type: {
					value: eventType,
				},
			});
		};
		return new TrustedMouseEvent(eventType, x, y, dx, dy);
	}

	function detour(self, func) {
		const detour = function () {
			try {
				func.apply(this, arguments);
				return self.apply(this, arguments);
			} catch (err) {
				log("Detour caught error: " + err.message);
			}
		};
		try {
			const name = "name" in self ? self.name : "";
			Object.defineProperty(detour, "name", {
				value: name,
				configurable: true,
			});
		} catch (err) {
			log("Detour caught error: " + err.message);
		}
		trap.set(detour, self);
		return detour;
	}

	function filterStorage(arr) {
		return arr.filter((name) => {
			return name !== storage;
		});
	}

	function getGroupId(piece) {
		return Object.values(piece[4])[0];
	}

	function init() {
		log("Game script load complete, replace and wait window.JigidiGame");


		if (GM_getValue("ui", true)) {
			modifyCompletionDialog();
		}

		const jigidiGame = unsafeWindow.JigidiGame;
		unsafeWindow.JigidiGame = function (window_, document_, div_, config_) {
			/* do not report errors to Jigidi !!! */
			window.onerror = () => { };

			/* reset and start collecting */
			collections.clear();
			collections.collectListeners = true;

			/* enable debugging */
			config_.logToConsole = debug;
			window_["Event"] = MouseEvent;
			log(
				"window.JigidiGame() called, initialize new game: " +
				JSON.stringify(config_)
			);
			jigidi = new jigidiGame(window_, document_, div_, config_);

			/* stop collecting listeners */
			collections.collectListeners = false;

			if (
				collections.mousedown.length != 1 ||
				collections.mousemove.length != 1 ||
				collections.mouseup.length != 1
			) {
				alert("Wrong number of listeners !!!");
			}

			/* extract canvas from element */
			canvas = div_.firstChild;

			/* disable blur when paused */
			if (!GM_getValue("pause_blur", true)) {
				/* assign id from canvas and override CSS filter with importance */
				const canvas_id = randomId();
				canvas.id = canvas_id;
				GM_addStyle("#" + canvas_id + " { filter: none !important }");
			}

			jigidi.init = detour(jigidi.init, () => {
				log("Jigidi.init() called");
				let gameState = null;

				jigidi.game.stateChange = detour(jigidi.game.stateChange, (state) => {
					gameState = state;
				});

				jigidi.load.begin = detour(jigidi.load.begin, () => {
					log("jigidi.load.begin() called");

					/* reset and start collecting objects */
					collections.objects.clear();
					collections.collectObjects = true;
				});

				jigidi.load.complete = detour(jigidi.load.complete, () => {
					log("jigidi.load.complete() called");

					/* stop collecting objects */
					collections.collectObjects = false;

					/* extract Jigidi objects */
					let objects = [];
					collections.objects.forEach((obj) => {
						obj.log && objects.push(obj);
					});
					collections.objects.clear();

					/* check number of objects */
					if (
						objects.length == 0 ||
						(objects.length != 2 && gameState != "state-complete")
					) {
						try {
							jigidi.service.dialogs.open("default", {
								dlg: "default",
								txt: MSG_DISABLED,
							});
						} catch (err) {
							alert(MSG_DISABLED.replaceAll(/<[^>]*>/g, " "));
						}
						return;
					}

					/* assume that the first object is always puzzle */
					puzzle = Object.values(objects[0]);

					/* get puzzle image */
					const image = puzzle[puzzle.length == 28 ? 27 : 28]; // solved vs unsolved
					global.image_src =
						image instanceof HTMLImageElement ? image.src : undefined;

					/* disable solver if game is complete */
					if (gameState == "state-complete") {
						global.solver = function () {
							return this.solve(false);
						};
					} else {
						/* get board -- puzzle[28] === renderer[22] */
						/* puzzle[29] should look like:
			B: 1664808313434
F: dI {log: d3, k: 0, c: 1, B: 1664808313433, v: gB, …}
M: null
k: 31.233333333333334
y: d3 {name: 'board', eg: 1, register: ƒ, debug: ƒ, info: ƒ, …} */
						const board = Object.values(puzzle[29]);
						board_data = Object.values(board[1]);

						/* prepare helpers */
						piece_id = calculatePieceId(board_data[6]);
						piece_size = Object.values(board_data[10]);

						/* assume that the second object is always renderer */
						renderer = objects[1];

						global.solver = async function () {
							while (this.solver_run) {
								let start = Date.now();

								if (this.solver_timer) {
									clearTimeout(this.solver_timer);
									this.solver_timer = null;
								}

								let success = await tryPiecesFromTopToBottom(this.piece_delay);
								if (!success) {
									return this.solve(success);
								} else {
									let delay = start + this.piece_delay - Date.now();
									if (delay > 0) {
										this.solver_timer = setTimeout(
											this.solver.bind(this),
											delay
										);
										return;
									}
								}
							}
						};
					}

					/* check if there is completion message */
					const config = jigidi.config();
					if (no_message && config && !config.hasMessage) {
						jigidi.service.dialogs.open("default", {
							dlg: "default",
							txt: MSG_NO_MESSAGE,
						});
					}

					modifyUI();
					log("solver is ready!");
				});
			});

			log("Wait Jigidi init");
			return jigidi;
		};

		trap.set(unsafeWindow.JigidiGame, jigidiGame);
	}

	function log(str) {
		debug && console.log("SOLVER " + str);
	}

	function modifyCompletionDialog() {
		if (document.getElementById(copy_id)) {
			return;
		}

		const dialog = document.getElementById("completion-message");
		if (!dialog) {
			return;
		}

		/* add "Copy" button to completion message dialog */
		const buttons = dialog.getElementsByTagName("button");
		if (!buttons.length) {
			return;
		}

		const copy = document.createElement("button");
		copy.id = copy_id;
		copy.title = "Copy to clipboard";
		copy.innerHTML = "Copy";
		copy.style.marginRight = "10px";
		dialog.insertBefore(copy, buttons[0]);

		document.addEventListener("click", (event) => {
			if (event.target.id === copy_id) {
				event.preventDefault(), event.stopPropagation();

				/* clipboard copying requires a user action for security reasons */
				const message = document.getElementById("message-content").innerHTML.replace(/<br>/g, "\r\n");
				const fail = () => {
					alert("Clipboard copying failed!");
				};
				const listener = (event) => {
					event.preventDefault();
					event.clipboardData
						? event.clipboardData.setData("text/plain", message)
						: document.clipboardData
							? document.clipboardData.setData("Text", message)
							: fail();
				};
				document.addEventListener("copy", listener, { once: true });
				document.execCommand("copy") || fail();
			}
		});
	}

	function modifyUI() {
		if (global.solve) {
			return;
		}

		const enabled = GM_getValue("ui", true);

		/* add "Solve" button to UI */
		const zoom_in = document.getElementById("game-zoom-in");
		const solve = document.createElement("button");
		solve.id = solve_id;
		solve.title = "Solve";
		solve.className = "btn";

		/* Jigidi is using Fontello webfonts for most of symbols, embedded WOFF in CSS.
		 * To have same style, this new "heart" is derivated from Fontello Modern Pictograms Heart.
		 * SVG is rounded to integers and rewritten by hand to minimize its size.
		 */
		solve.style.backgroundImage =
			"url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='-230 -300 1200 1100'>" +
			"<path d='M380 665L95 382q-48-47-72-101-23-50-23-99 0-54 23-95t65-64 96-22q46 0 79 13 29 12 57 37 16 15 51 55l10 12 10-12" +
			"q34-39 51-55 28-25 57-37 34-13 80-13 54 0 96 23t64 64 23 96q0 49-23 99-24 54-72 101z'/></svg>\")";

		/* this is UI side of Jigidi solver */
		global.solver_run = 0;
		global.solve = (run) => {
			if (!global.solver) {
				try {
					jigidi.service.dialogs.open("default", {
						dlg: "default",
						txt: MSG_DISABLED,
					});
				} catch (err) {
					alert(MSG_DISABLED.replaceAll(/<[^>]*>/g, " "));
				}
			} else {
				const solve = document.getElementById(solve_id);
				global.solver_run = run;
				if (run) {
					if (solve) solve.style.backgroundColor = "#fc5b1f";
					jigidi.game ? jigidi.game.resume() : jigidi.resume;
					global.solver();
				} else if (solve) {
					solve.style.backgroundColor = "";
				}
			}
		};
		solve.addEventListener("click", (event) => {
			event.preventDefault(), event.stopPropagation();
			global.solve(!global.solver_run);
		});

		enabled && zoom_in.parentNode.insertBefore(solve, zoom_in);
		GM_registerMenuCommand(
			"Solve",
			(_) => {
				global.solve && global.solve(!global.solver_run);
			},
			"S"
		);

		/* add "Download image" button to UI */
		if (global.image_src) {
			fetch(global.image_src)
				.then((response) => {
					return response.blob();
				})
				.then((blob) => {
					const download_image = document.createElement("a");
					const og_url = document.querySelector('meta[property~="og:url"]');
					const url = og_url
						? new URL(og_url.getAttribute("content"))
						: document.location;
					const parts = url.pathname.split("/");
					download_image.crossOrigin = "";
					download_image.download =
						(parts.length == 5 ? parts[3] : "jigidi") + ".jpg";
					download_image.href = URL.createObjectURL(blob);
					download_image.id = download_id;
					download_image.title = "Download image";
					download_image.className = "btn";
					download_image.style.backgroundImage =
						"url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'>" +
						"<path d='M25 19v7H5v-7H0v9c0 1 1 2 3 2h24c2 0 2-1 2-2v-9h-4zM15 18l-6-7s-1 0 0 0h3V9 0h6v10h3v1l-5 7h-1z'/></svg>\")";
					enabled && zoom_in.parentNode.insertBefore(download_image, solve);
					GM_registerMenuCommand(
						"Download image",
						(_) => {
							download_image.click();
						},
						"D"
					);
				});
		}
		addSettingsMenu();
	}

	function randomId() {
		return randomString(Math.random() * 5 + 5);
	}

	function randomString(len) {
		let str = "";
		for (let i = 0; i < len; i++) {
			let rand = Math.floor(Math.random() * 62);
			str += String.fromCharCode(
				(rand += (rand > 9 && ((rand < 36 && 55) || 61)) || 48)
			);
		}
		return str;
	}

	async function tryPiecesFromTopToBottom(piece_delay) {
		const z_order = board_data[9];
		for (let i = z_order.length - 1; i >= 0; --i) {
			let piece1 = Object.values(z_order[i]);

			/* try nearest neighbor first */
			for (const neighbor of calculateDistancesToNeighbors(piece1)) {
				/* get neighbor piece */
				const piece2 = Object.values(board_data[5][neighbor[0]]);
				const delta = neighbor[1];

				/* get piece local position */
				let pos1 = Object.values(piece1[0]);
				let pos2 = Object.values(piece2[0]);
				pos2[0] -= delta[0] * piece_size[0];
				pos2[1] -= delta[1] * piece_size[1];

				/* convert local position to screen position */
				/* Object.values(renderer)[16]
D: 0
G: 688.7856569506727
H: 0.7481233183856502
X: 200.037533632287
i: 0
y: 0.7481233183856502
		*/
				const globalTransform = Object.values(Object.values(renderer)[16]);
				pos1 = convertCanvasPosToScreenPos(
					canvas,
					convertLocalToGlobal(globalTransform, pos1)
				);
				pos2 = convertCanvasPosToScreenPos(
					canvas,
					convertLocalToGlobal(globalTransform, pos2)
				);

				/* trigger mousedown */
				let event = createMouseEvent("mousedown", pos1.x, pos1.y);
				for (const listener of collections.mousedown) {
					listener(event);
				}
				piece_delay && (await sleep(Math.floor(0.05 * piece_delay)));

				/* calculate mousemove steps -- step must be less than 10 pixels */
				let dx = pos2.x - pos1.x,
					dy = pos2.y - pos1.y;
				const step = Math.ceil(0.1 * Math.sqrt(dx * dx + dy * dy));
				(dx /= step), (dy /= step);
				for (let s = 0; s < step; ++s) {
					const x = pos1.x + dx,
						y = pos1.y + dy;
					event = createMouseEvent("mousemove", x, y, x - pos1.x, y - pos1.y);
					for (let listener of collections.mousemove) {
						listener(event);
					}
					(pos1.x = x), (pos1.y = y);
					piece_delay && (await sleep(Math.floor((0.4 * piece_delay) / step)));
				}

				/* yield to allow Jigidi to update status */
				!piece_delay && (await sleep(0));

				/* trigger mouseup */
				event = createMouseEvent("mouseup", pos2.x, pos2.y);
				for (const listener of collections.mouseup) {
					listener(event);
				}
				piece_delay && (await sleep(Math.floor(0.05 * piece_delay)));

				/* update stale piece and compare group ids */
				piece1 = Object.values(board_data[5][piece1[2]]);
				if (getGroupId(piece1) === getGroupId(piece2)) {
					return true;
				}
			}
		}

		return false;
	}

	/* define our global */
	Object.defineProperty(unsafeWindow, storage, {
		configurable: true,
		enumerable: false,
		value: {},
		writable: true,
	});

	/* add properties */
	const global = unsafeWindow[storage];
	/* we will be the first in the queue when game script is loaded */
	log("Wait game script to load");
	unsafeWindow.jgque = [init];

	global.piece_delay = parseInt(GM_getValue("piece_delay", 0)) || 0;
	global.trap = trap;

	const settings = {
		ui: "Show Puzzle/Copy buttons",
		pause_blur: "Blur when paused",
		no_message: "Warn for no completion messsage",
	};

	function settings_toggleBool(setting) {
		GM_unregisterMenuCommand(
			"Settings: " + settings[setting] + ": " + (GM_getValue(setting, true) ? "On" : "Off")
		);
		GM_setValue(setting, !GM_getValue(setting, true));
		GM_registerMenuCommand(
			"Settings: " + settings[setting] + ": " + (GM_getValue(setting, true) ? "On" : "Off"),
			() => {
				settings_toggleBool(setting);
			}
		);
	}

	function settings_pieceDelay() {
		let delay = prompt("Delay between moves in milliseconds", GM_getValue("piece_delay", 0));
		if (!/^\d+$/.test(delay)) {
			alert("Invalid input, only numbers allowed!");
		} else {
			GM_unregisterMenuCommand(
				"Settings: Delay between moves: " + GM_getValue("piece_delay", 0)
			);
			GM_setValue("piece_delay", delay);
			global.piece_delay = parseInt(delay, 0);
			GM_registerMenuCommand(
				"Settings: Delay between moves: " + GM_getValue("piece_delay", 0), () => {
					settings_pieceDelay();
				}
			);
		}
	}

	function addSettingsMenu() {
		Object.keys(settings).forEach((setting) => {
			GM_registerMenuCommand(
				"Settings: " + settings[setting] + ": " + (GM_getValue(setting, true) ? "On" : "Off"), () => {
					settings_toggleBool(setting);
				}
			);
		});
		GM_registerMenuCommand(
			"Settings: Delay between moves: " + GM_getValue("piece_delay", 0), () => {
				settings_pieceDelay();
			}
		);
	}
})();

