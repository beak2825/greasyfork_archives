// ==UserScript==
// @name Automagic Jigidi Solver
// @license MIT
// @description Fastest way of solving Jigidi puzzles
// @match https://jigidi.com/solve*
// @match https://www.jigidi.com/solve*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @version 2.1.4
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @namespace https://banana
// @homepageURL https://greasyfork.org/en/scripts/394279
// @supportURL https://greasyfork.org/en/scripts/394279/feedback
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/457322/Automagic%20Jigidi%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/457322/Automagic%20Jigidi%20Solver.meta.js
// ==/UserScript==
(function () {
	"use strict";

	const BLOCKED = "javascript/blocked";
	const MSG_DISABLED = "<b>Solver is temporarily disabled, try again later</b>";
	const MSG_NO_MESSAGE = "<b>Puzzle has no completion message!</b>";
	const UI_DISABLE = "Disable all buttons";
	const UI_ENABLE_COPY = '"Copy" button only';
	const UI_ENABLE = "Enable all buttons";

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
		  return documentAddEventListener.apply(this, [arguments[0], (_) => {}]);
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
		  return windowAddEventListener.apply(this, [arguments[0], (_) => {}]);
		default:
		  break;
	  }

	  return windowAddEventListener.apply(this, [
		arguments[0],
		createListenerWrapper(arguments[1]),
	  ]);
	};

	const config_title = document.createElement("a");
	config_title.target = "_blank";
	config_title.textContent = "Automagic Jigidi Solver";
	config_title.href = "https://greasyfork.org/en/scripts/394279";
	config_title.rel = "noopener noreferrer";

	GM_config.init({
	  id: "AJS",
	  title: config_title,
	  fields: {
		block_ads: {
		  section: "Page settings",
		  label: "Block ads and tracking scripts",
		  labelPos: "right",
		  type: "checkbox",
		  default: true,
		},
		hide_ads: {
		  label: "Hide ad elements",
		  labelPos: "right",
		  type: "checkbox",
		  default: true,
		},
		ui: {
		  section: "Puzzle settings",
		  label: "UI buttons",
		  type: "select",
		  labelPos: "left",
		  options: [UI_DISABLE, UI_ENABLE_COPY, UI_ENABLE],
		  default: UI_ENABLE,
		},
		pause_blur: {
		  label: "Blur puzzle image when paused",
		  labelPos: "right",
		  type: "checkbox",
		  default: false,
		},
		no_message: {
		  label: "Warn if puzzle has no completion messsage",
		  labelPos: "right",
		  type: "checkbox",
		  default: true,
		},
		piece_delay: {
		  section: "Solver settings",
		  label: "Delay",
		  type: "select",
		  labelPos: "left",
		  options: [
			"4000 ms (slowest)",
			"3000 ms",
			"2000 ms",
			"1500 ms",
			"1000 ms",
			"750 ms",
			"500 ms",
			"250 ms",
			"125 ms",
			"50 ms",
			"25 ms",
			"0 ms (fastest)",
		  ],
		  default: "0 ms (fastest)",
		},
	  },
	  css:
		"#AJS .field_label { padding-left: 6px; }\n" +
		"#AJS .config_header { font-size: 16pt; padding: 0px 10px; }\n" +
		"#AJS .config_var { padding: 8px 8px; }",
	});

	const beforescriptexecute = "onbeforescriptexecute" in document;
	const block_ads = GM_config.get("block_ads");
	const debug = false;
	const deltas = [
	  [-1, 0],
	  [0, 1],
	  [1, 0],
	  [0, -1],
	];
	const copy_id = randomId();
	const download_id = randomId();
	const no_message = GM_config.get("no_message");
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const solve_id = randomId();
	const storage = "$" + randomId();
	const trap = new Map();

	let block_load = true;
	let board_data;
	let canvas;
	let dialog = null;
	let game_js_src = "";
	let game_js_sri = "";
	let game_js_ver = "";
	let jigidi;
	let piece_id;
	let piece_size;
	let puzzle;
	let renderer;

	function addScript(text) {
	  const head =
		document.getElementsByTagName("head")[0] || document.documentElement;
	  const script = document.createElement("script");
	  script.type = "text/javascript";
	  script.appendChild(document.createTextNode(text));
	  head.appendChild(script);
	  return script;
	}

	function blockScriptExecution(node) {
	  /* Firefox has this additional event which prevents scripts from beeing executed */
	  const beforeScriptExecuteListener = (event) => {
		event.preventDefault(), event.stopPropagation();
	  };
	  node.type = BLOCKED;
	  beforescriptexecute &&
		node.addEventListener(
		  "beforescriptexecute",
		  beforeScriptExecuteListener,
		  { once: true }
		);
	}

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

	function copyButtonDisplay(visible) {
	  const copy_button = document.getElementById(copy_id);
	  if (copy_button) {
		copy_button.style.display = visible ? "inline-block" : "none";
	  }
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

	function dispatchMouseEvent(eventTarget, event) {
	  return eventTarget.dispatchEvent(event);
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

	  const jigidiGame = unsafeWindow.JigidiGame;
	  unsafeWindow.JigidiGame = function (window_, document_, div_, config_) {
		/* do not report errors to Jigidi !!! */
		window.onerror = () => {};

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
		if (!GM_config.get("pause_blur")) {
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
			const image = puzzle.length == 27 ? puzzle[26] : puzzle[27];
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
F: dI {log: d3, k: 0, c: 1, B: 1664808313433, v: gB, \85}
M: null
k: 31.233333333333334
y: d3 {name: 'board', eg: 1, register: \83, debug: \83, info: \83, \85} */
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

	function loadScript(src, sri) {
	  return new Promise(function (resolve, reject) {
		const head =
		  document.getElementsByTagName("head")[0] || document.documentElement;
		const script = document.createElement("script");
		script.type = "text/javascript";
		if (sri) {
		  script.integrity = sri;
		}
		script.addEventListener(
		  "error",
		  (err) => {
			reject(err, script);
		  },
		  { once: true }
		);
		script.addEventListener(
		  "load",
		  (_) => {
			resolve(script);
		  },
		  { once: true }
		);
		script.src = src;
		head.appendChild(script);
		return script;
	  });
	}

	function log(str) {
	  debug && console.log("SOLVER " + str);
	}

	function modifyGame_v3_2248(game_js) {
	  let mod_count = 0,
		mod_total = 0;

	  /* get puzzle image */
	  game_js = game_js.replace("a.Fb=b.image;", (_) => {
		mod_count++;
		return storage + ".image_src=b.image;a.Fb=b.image;";
	  });
	  mod_total++;

	  /* disable blur when paused */
	  if (!GM_config.get("pause_blur")) {
		game_js = game_js.replace("a.C.style.filter=Aa(7692)", (_) => {
		  mod_count++;
		  return "a.C.style.filter=null";
		});
		mod_total++;
	  }

	  /* inject solver */
	  game_js = game_js.replace("}.call(this))", (_) => {
		mod_count++;
		return (
		  "" +
		  "let jigidiGame = window.JigidiGame; " +
		  " " +
		  "window.JigidiGame = function(window_, document_, div_, config_) { " +
		  " const logger = new bi(config_.logID, config_.logFilter); " +
		  ' console.log("Automagic Jigidi Solver v2.0.0"); ' +
		  " (" +
		  debug +
		  " || config_.logToConsole) || (Va = false); " +
		  " const game = new Lh(window_, document_, div_, config_); " +
		  " " +
		  storage +
		  ".game = game; " +
		  " const jigidi = new xi(game, config_); " +
		  " logger.j(game); " +
		  " return jigidi " +
		  "}; " +
		  " " +
		  "" +
		  storage +
		  ".trap.set(window.JigidiGame, jigidiGame); " +
		  "jigidiGame = null; " +
		  " " +
		  "" +
		  storage +
		  ".solver = function() { " +
		  " if (!this.solver_run) { " +
		  " return " +
		  " } " +
		  " " +
		  " if (this.solver_timer) { " +
		  " clearTimeout(this.solver_timer); " +
		  " this.solver_timer = null " +
		  " } " +
		  " " +
		  " const game = this.game.j; " +
		  " const board = game.M; " +
		  " const board_data = board.j; " +
		  " const puzzle = game.R; " +
		  " let success = false; " +
		  " " +
		  " function tryJoin(piece1, dx, dy) { " +
		  " const index = nb(board_data, piece1.index.x + dx, piece1.index.y + dy); " +
		  " if (index < 0) { " +
		  " return true " +
		  " } " +
		  " " +
		  " const piece2 = board_data.ca(index); " +
		  " if (piece1.group.id === piece2.group.id) { " +
		  " return true " +
		  " } " +
		  " " +
		  " dx = piece2.position.x - dx * board_data.N.width; " +
		  " dy = piece2.position.y - dy * board_data.N.height; " +
		  " cd.c++; " +
		  " sb(board_data, piece1.id); " +
		  ' puzzle.K("psd", piece1); ' +
		  " cd.c++; " +
		  " qb(board_data, piece1.id, dx, dy); " +
		  ' puzzle.K("ped", piece1); ' +
		  " cd.c++; " +
		  " Db(board, piece1.id); " +
		  " Jb(board, piece1.id); " +
		  " game.O.update(); " +
		  " " +
		  " return !(success = piece1.group.id === piece2.group.id) " +
		  " } " +
		  " " +
		  " function tryPiece\A9 { " +
		  " return tryJoin(c, -1, 0) && tryJoin(c, 0, 1) && tryJoin(c, 1, 0) && tryJoin(c, 0, -1)" +
		  " } " +
		  " " +
		  " Hb(board, tryPiece); " +
		  " " +
		  " if (!success) { " +
		  " this.solve(success) " +
		  " } else if (this.piece_delay > 0) { " +
		  " this.solver_timer = setTimeout(this.solver.bind(this), this.piece_delay) " +
		  " } else { " +
		  " this.solver() " +
		  " } " +
		  "}}.call(this))"
		);
	  });
	  mod_total++;

	  /* enable injection and hide mod */

	  /* document.currentScript.src.indexOf("jigidi") == 12 */
	  game_js = game_js.replace("be.d=b?b[a[2]][a[4]](a[3]):0}", (_) => {
		mod_count++;
		return "be.d=12}";
	  });
	  mod_total++;

	  /* fake script integrity */
	  game_js = game_js.replace("document.currentScript", (_) => {
		mod_count++;
		return '{integrity:"' + game_js_sri + '"}';
	  });
	  mod_total++;

	  /* ownerDocument.querySelector('script[src*="/game/js"]') */
	  game_js = game_js.replace("qd[b[0]][b[1]](b[2])", (_) => {
		mod_count++;
		return "true";
	  });
	  mod_total++;

	  return mod_count == mod_total ? game_js : "";
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
		  const message = document.getElementById("message-content").innerHTML;
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

	  const enabled = GM_config.get("ui") == UI_ENABLE;

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

	/* avoid potential reference error */
	if (block_ads) {
	  window.eval(
		"var googletag = googletag || {}; googletag.cmd = googletag.cmd || [];"
	  );
	}

	/* Hide ads */
	if (GM_config.get("hide_ads")) {
	  GM_addStyle(".ad_unit,.au-base { visibility: hidden }");
	}

	/* As this userscript runs before almost anything we are using MutationObserver to watch for changes being made to the DOM tree.
	 * Be careful with MutationObserver! As we are monitoring DOM document and all of its children for additions and removals of elements
	 * we are receiving a lot of calls.
	 */
	const observer = new MutationObserver((mutations, observer) => {
	  mutations.forEach(({ addedNodes }) => {
		addedNodes.forEach((node) => {
		  /* we are only interested in <SCRIPT> tags */
		  if (node.nodeType === 1 && node.tagName === "SCRIPT") {
			/* Inline script does not have location, make it empty */
			const src = node.src || "";
			const mimetype = node.type;

			/* Browsers have a fixed list of acceptable MIME types for Javascript.
			 * To block browser from executing the game script we are changing its MIME type.
			 * Just to be sure make the change once and only once. This blocks the script
			 * execution in Safari, Chrome, Edge & IE
			 */
			if (
			  block_load &&
			  /game\/[0-9]{2}\/js\/[0-9a-f]{32}/.test(src) &&
			  (!mimetype || mimetype !== BLOCKED)
			) {
			  /* Jigidi v17 or newer detected */
			  log("Jigidi v17 or newer detected: " + src);

			  /* game script will remove dialogs from DOM so we need modify now if needed */
			  switch (GM_config.get("ui")) {
				case UI_ENABLE_COPY:
				case UI_ENABLE:
				  modifyCompletionDialog();
				  break;
				default:
				/* nothing to do */
			  }

			  /* we will be the first in the queue when game script is loaded */
			  log("Wait game script to load");
			  unsafeWindow.jgque = [init];
			} else if (
			  block_load &&
			  /game\/js\/[0-9a.]+/.test(src) &&
			  (!mimetype || mimetype !== BLOCKED)
			) {
			  blockScriptExecution(node);

			  /* Remember the exact URL of game script */
			  game_js_src = src;
			  game_js_sri = node.integrity;
			  game_js_ver = /game\/js\/([0-9a.]+)/.exec(src) || [];
			  game_js_ver =
				game_js_ver.length == 2 ? game_js_ver[1] : "ersion unknown";

			  /* Remove the node from the DOM */
			  node.remove();
			} else if (
			  block_load &&
			  !/creator/.test(src) &&
			  /js\/release\.js/.test(src) &&
			  (!mimetype || mimetype !== BLOCKED)
			) {
			  blockScriptExecution(node);

			  /* Remember the exact URL of game script */
			  game_js_src = src;
			  game_js_sri = node.integrity;
			  game_js_ver = new URL(src).search.replace(/^\?/, "");

			  /* Remove the node from the DOM */
			  node.src = "";
			} else if (
			  block_ads &&
			  (/analytics\.js$/.test(src) ||
				/apstag\.js$/.test(src) ||
				/gpt\.js$/.test(src) ||
				/quant/.test(src)) &&
			  (!mimetype || mimetype !== BLOCKED)
			) {
			  /* Block Amazon Publisher Services, Google Analytics, Google Tag Manager, Quantcast */
			  blockScriptExecution(node);

			  /* Remove the node from the DOM */
			  log("Blocking external script " + src);
			  node.remove();
			} else if (
			  block_ads &&
			  (/apstag/.test(node.textContent) ||
				/_cd/.test(node.textContent) ||
				/ga\('send'/.test(node.textContent) ||
				/googletag/.test(node.textContent) ||
				/_tcf/.test(node.textContent) ||
				/trace/.test(node.textContent))
			) {
			  /* Remove 3rd party tracking */
			  node.textContent = "";
			  log("Blocking script");
			  node.remove();
			} else if (game_js_src && /new\sJigidi/.test(node.textContent)) {
			  /* For performance reasons only after we have seen and blocked the game script, only then we try to find Jigidi UI script.
			   * Most reliable way is to detect "new Jigidi" construction. Copy the whole JS to variable so that we can inject it later.
			   * Let the browser execute empty script and cleanup resources
			   */
			  let ui_js = node.textContent.replace("jigidi.init()", "");
			  node.textContent = "";
			  node.remove();

			  /* Now we have blocked the game and UI scripts. Use XHR to get the game script. Browsers hide/ignore this re-request as
			   * it is for same resource in same context; content is in browser cache. No additional latency and onload() is likely
			   * executed synchronously.
			   */
			  GM_xmlhttpRequest({
				method: "GET",
				url: game_js_src,
				onload: (response) => {
				  let game_js_src = response.finalUrl,
					mod_js = "",
					not_supported = false,
					show_warning = false;

				  const game_js = response.responseText;
				  if (!game_js) {
					alert("Failed to load script!");
					return;
				  }

				  /* try patching by version number */
				  switch (game_js_ver) {
					case "15.3.2248":
					case "15.3.2251":
					case "15.3.2284":
					  mod_js = modifyGame_v3_2248(game_js);
					  break;
					default:
					  /* try latest version */
					  mod_js = modifyGame_v3_2248(game_js);
					  show_warning = true;
					  break;
				  }

				  switch (GM_config.get("ui")) {
					case UI_ENABLE_COPY:
					case UI_ENABLE:
					  modifyCompletionDialog();
					  break;
					default:
					/* nothing to do */
				  }

				  /* inject our solver implementation if patching was successful */
				  if (mod_js) {
					const msg =
					  "" +
					  "Jigidi has updated to <b>v" +
					  game_js_ver +
					  "</b><br>" +
					  "but solver supports v15.3.2248 - v15.3.2284";

					addScript(mod_js);
					addScript(ui_js);
					mod_js = ui_js = "";

					try {
					  if (jigidi.load) {
						/* override load.complete function to patch UI */
						jigidi.load.complete = detour(
						  jigidi.load.complete,
						  () => {
							const config = jigidi.config();
							if (no_message && config && !config.hasMessage) {
							  jigidi.service.dialogs.open("default", {
								dlg: "default",
								txt: MSG_NO_MESSAGE,
							  });
							}
							modifyUI();
						  }
						);

						if (
						  show_warning &&
						  jigidi.service &&
						  jigidi.service.dialogs
						) {
						  /* wait user to close the dialog */
						  const dlg = jigidi.service.dialogs.open("default", {
							dlg: "default",
							txt: msg,
						  });
						  dlg.addEventListener(
							"DOMNodeRemoved",
							(_) => {
							  /* ..and now start */
							  jigidi.init();
							},
							{ once: true }
						  );
						} else {
						  /* ..and now start */
						  jigidi.init();
						}
					  } else {
						/* hide "Copy" button until game is complete */
						copyButtonDisplay(false);

						/* override loadComplete function to display warnings and patch UI */
						jigidi.loadComplete = detour(jigidi.loadComplete, () => {
						  const config = jigidi.config();
						  if (config) {
							if (show_warning) {
							  setupCompletionMessage(msg);
							  showCompletionMessage();
							} else if (no_message && !config.hasMessage) {
							  setupCompletionMessage(MSG_NO_MESSAGE);
							  showCompletionMessage();
							}
						  }
						  modifyUI();
						});

						jigidi.gameComplete = detour(jigidi.gameComplete, () => {
						  /* show "Copy" button if enabled */
						  copyButtonDisplay(true);
						});

						/* ..and now start */
						jigidi.init();
					  }
					} catch (err) {
					  /* fallback */
					  alert(msg.replaceAll(/<[^>]*>/g, " "));

					  /* ..and now start */
					  jigidi.init();
					}
				  } else {
					/* reload original game */
					const msg =
					  "" +
					  "<b>Automagic Jigidi Solver disabled!</b><br>" +
					  "Jigidi has updated to <b>v" +
					  game_js_ver +
					  "</b><br>" +
					  "but solver supports v15.3.2248 - v15.3.2284<br>";
					("Try updating the userscript and then try again.");

					/* allow reloading */
					block_load = false;
					loadScript(game_js_src)
					  .then((_) => {
						addScript(ui_js);
						ui_js = "";

						if (jigidi.service && jigidi.service.dialogs) {
						  /* wait user to close the dialog */
						  const dlg = jigidi.service.dialogs.open("default", {
							dlg: "default",
							txt: msg,
						  });
						  dlg.addEventListener(
							"DOMNodeRemoved",
							(_) => {
							  /* ..and now start */
							  jigidi.init();
							},
							{ once: true }
						  );
						} else {
						  /* hide "Copy" button until game is complete */
						  copyButtonDisplay(false);

						  jigidi.loadComplete = detour(
							jigidi.loadComplete,
							() => {
							  setupCompletionMessage(msg);
							  showCompletionMessage();
							}
						  );

						  jigidi.gameComplete = detour(
							jigidi.gameComplete,
							() => {
							  /* show "Copy" button if enabled */
							  copyButtonDisplay(true);
							}
						  );

						  /* ..and now start */
						  jigidi.init();
						}
					  })
					  .catch((_) => {
						/* fallback */
						alert(msg.replaceAll(/<[^>]*>/g, " "));

						/* ..and now start */
						jigidi.init();
					  });
				  }
				},
			  });

			  /* inject only once */
			  game_js_src = "";
			}
		  }
		});
	  });
	});

	/* define our global */
	Object.defineProperty(unsafeWindow, storage, {
	  configurable: true,
	  enumerable: false,
	  value: {},
	  writable: true,
	});

	/* add properties */
	const global = unsafeWindow[storage];
	global.piece_delay = parseInt(GM_config.get("piece_delay"), 10) || 0;
	global.trap = trap;

	/* start the observer */
	observer.observe(document, { childList: true, subtree: true });

	/* stop the observer when page is loaded */
	window.addEventListener(
	  "load",
	  (_) => {
		log("Load completed"), observer && observer.disconnect();
	  },
	  { once: true }
	);

	GM_config.onOpen = function (document, window, frame) {
	  frame.style.width = "400px";
	  frame.style.height = "450px";
	  this.center();
	};

	GM_config.onSave = function () {
	  if (!confirm("Page will be reloaded, do you want to continue?")) {
		return;
	  }
	  location.reload();
	};

	GM_registerMenuCommand("Configure", GM_config.open.bind(GM_config), "C");
 })();