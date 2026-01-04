// ==UserScript==
// @name         betteR20-5etools-edit
// @namespace    https://5e.tools/
// @license      MIT (https://opensource.org/licenses/MIT)
// @version      1.16.22
// @description  Enhance your Roll20 experience WITH 3D DICE!
// @original-author       5egmegaanon/astranauta/MrLabRat/TheGiddyLimit/DBAWiseMan/BDeveau/Remuz/Callador Julaan/Erogroth/Stormy/FlayedOne
// @author       Cyelis1224
// @match        https://app.roll20.net/editor
// @match        https://app.roll20.net/editor#*
// @match        https://app.roll20.net/editor?*
// @match        https://app.roll20.net/editor/
// @match        https://app.roll20.net/editor/#*
// @match        https://app.roll20.net/editor/?*

// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/401477/betteR20-5etools-edit.user.js
// @updateURL https://update.greasyfork.org/scripts/401477/betteR20-5etools-edit.meta.js
// ==/UserScript==


ART_HANDOUT = "betteR20-art";
CONFIG_HANDOUT = "betteR20-config";

BASE_SITE_URL = "https://5e.tools/"; // TODO automate to use mirror if main site is unavailable
SITE_JS_URL = BASE_SITE_URL + "js/";
DATA_URL = BASE_SITE_URL + "data/";

SCRIPT_EXTENSIONS = [];

CONFIG_OPTIONS = {
	interface: {
		_name: "Interface",
		showCustomArtPreview: {
			name: "Show Custom Art Previews",
			default: true,
			_type: "boolean"
		}
	}
};

addConfigOptions = function (category, options) {
	if (!CONFIG_OPTIONS[category]) CONFIG_OPTIONS[category] = options;
	else CONFIG_OPTIONS[category] = Object.assign(CONFIG_OPTIONS[category], options);
};

OBJECT_DEFINE_PROPERTY = Object.defineProperty;
ACCOUNT_ORIGINAL_PERMS = {
	largefeats: false,
	xlfeats: false
};
Object.defineProperty = function (obj, prop, vals) {
	try {
		if (prop === "largefeats" || prop === "xlfeats") {
			ACCOUNT_ORIGINAL_PERMS[prop] = vals.value;
			vals.value = true;
		}
		OBJECT_DEFINE_PROPERTY(obj, prop, vals);
	} catch (e) {
		console.log("failed to define property:");
		console.log(e);
		console.log(obj, prop, vals);
	}
};

FINAL_CANVAS_MOUSEDOWN_LIST = [];
FINAL_CANVAS_MOUSEMOVE_LIST = [];
FINAL_CANVAS_MOUSEDOWN = null;
FINAL_CANVAS_MOUSEMOVE = null;
EventTarget.prototype.addEventListenerBase = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options, ...others) {
	if (typeof d20 !== "undefined") {
		if (type === "mousedown" && this === d20.engine.final_canvas) FINAL_CANVAS_MOUSEDOWN = listener;
		if (type === "mousemove" && this === d20.engine.final_canvas) FINAL_CANVAS_MOUSEMOVE = listener;
	} else {
		if (type === "mousedown") FINAL_CANVAS_MOUSEDOWN_LIST.push({listener, on: this});
		if (type === "mousemove") FINAL_CANVAS_MOUSEMOVE_LIST.push({listener, on: this});
	}
	this.addEventListenerBase(type, listener, options, ...others);
};


function baseUtil () {
	d20plus.ut = {};

	d20plus.ut.log = (...args) => {
		console.log("%cD20Plus > ", "color: #3076b9; font-size: large", ...args);
	};

	d20plus.ut.error = (...args) => {
		console.error("%cD20Plus > ", "color: #b93032; font-size: large", ...args);
	};

	d20plus.ut.chatLog = (arg) => {
		d20.textchat.incoming(
			false,
			{
				who: "betteR20",
				type: "general",
				content: (arg || "").toString(),
				playerid: window.currentPlayer.id,
				id: d20plus.ut.generateRowId(),
				target: window.currentPlayer.id,
				avatar: "https://i.imgur.com/bBhudno.png"
			}
		);
	};

	d20plus.ut.ascSort = (a, b) => {
		if (b === a) return 0;
		return b < a ? 1 : -1;
	};

	//d20plus.ut.disable3dDice = () => {
		//d20plus.ut.log("Disabling 3D dice");
		//const $cb3dDice = $(`#enable3ddice`);
		//$cb3dDice.prop("checked", false).attr("disabled", true);
		//$cb3dDice.closest("p").after(`<p><i>3D dice are incompatible with betteR20. We apologise for any inconvenience caused.</i></p>`);
//
		//$(`#autoroll`).prop("checked", false).attr("disabled", true);;
//
		//d20.tddice.canRoll3D = () => false;
	//};

	d20plus.ut.checkVersion = (scriptType) => {
		d20plus.ut.log("Checking current version");

		function cmpVersions (a, b) {
			const regExStrip0 = /(\.0+)+$/;
			const segmentsA = a.replace(regExStrip0, '').split('.');
			const segmentsB = b.replace(regExStrip0, '').split('.');
			const l = Math.min(segmentsA.length, segmentsB.length);

			for (let i = 0; i < l; i++) {
				const diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
				if (diff) {
					return diff;
				}
			}
			return segmentsA.length - segmentsB.length;
		}

		let scriptUrl;
		switch (scriptType) {
			case "core": scriptType = `https://get.5e.tools/script/betteR20-core.user.js${d20plus.ut.getAntiCacheSuffix()}`; break;
			case "5etools": scriptType = `https://get.5e.tools/script/betteR20-5etools.user.js${d20plus.ut.getAntiCacheSuffix()}`; break;
			default: scriptUrl = "https://get.5e.tools/"; break;
		}

		$.ajax({
			url: `https://get.5e.tools`,
			success: (data) => {
				const m = /<!--\s*(\d+\.\d+\.\d+)\s*-->/.exec(data);
				if (m) {
					const curr = d20plus.version;
					const avail = m[1];
					const cmp = cmpVersions(curr, avail);
					if (cmp < 0) {
						setTimeout(() => {
							d20plus.ut.sendHackerChat(`A newer version of betteR20 is available. Get ${avail} <a href="https://get.5e.tools/">here</a>. For help and support, see our <a href="https://wiki.5e.tools/index.php/BetteR20_FAQ">wiki</a> or join our <a href="https://discord.gg/nGvRCDs">Discord</a>.`);
						}, 1000);
					}
				}
			},
			error: () => {
				d20plus.ut.log("Failed to check version");
			}
		})
	};

	d20plus.ut.chatTag = (message) => {
		const isStreamer = !!d20plus.cfg.get("interface", "streamerChatTag");
		d20plus.ut.sendHackerChat(`
				${isStreamer ? "Script" : message} initialised.
				${window.enhancementSuiteEnabled ? `<br><br>Roll20 Enhancement Suite detected.` : ""}
				${isStreamer ? "" : `
				<br>
				<br>
				Need help? Visit our <a href="https://wiki.5e.tools/index.php/Feature:_BetteR20">Wiki</a> or Join our <a href="https://discord.gg/nGvRCDs">Discord</a>.
				<br>
				<br>
				<span title="You'd think this would be obvious.">
				Please DO NOT post about this script or any related content in official channels, including the Roll20 forums.
				<br>
				<br>
				Before reporting a bug on the Roll20 forums, please disable the script and check if the problem persists.
				`}
				</span>
			`);
	};

	d20plus.ut.showLoadingMessage = (message) => {
		const isStreamer = !!d20plus.cfg.get("interface", "streamerChatTag");
		d20plus.ut.sendHackerChat(`
			${isStreamer ? "Script" : message} initialising, please wait...<br><br>
		`);
	};

	d20plus.ut.sendHackerChat = (message) => {
		d20.textchat.incoming(false, ({
			who: "system",
			type: "system",
			content: `<span class="hacker-chat">
				${message}
			</span>`
		}));
	};

	d20plus.ut.addCSS = (sheet, selectors, rules) => {
		if (!(selectors instanceof Array)) selectors = [selectors];

		selectors.forEach(selector => {
			const index = sheet.cssRules.length;
			try {
				if ("insertRule" in sheet) {
					sheet.insertRule(selector + "{" + rules + "}", index);
				} else if ("addRule" in sheet) {
					sheet.addRule(selector, rules, index);
				}
			} catch (e) {
				if ((!selector && selector.startsWith("-webkit-"))) {
					console.error(e);
					console.error(`Selector was "${selector}"; rules were "${rules}"`);
				}
			}
		});
	};

	d20plus.ut.addAllCss = () => {
		d20plus.ut.log("Adding CSS");

		const targetSheet =  [...window.document.styleSheets]
			.filter(it => it.href && (!it.href.startsWith("moz-extension") && !it.href.startsWith("chrome-extension")))
			.find(it => it.href.includes("app.css"));

		_.each(d20plus.css.baseCssRules, function (r) {
			d20plus.ut.addCSS(targetSheet, r.s, r.r);
		});
		if (!window.is_gm) {
			_.each(d20plus.css.baseCssRulesPlayer, function (r) {
				d20plus.ut.addCSS(targetSheet, r.s, r.r);
			});
		}
		_.each(d20plus.css.cssRules, function (r) {
			d20plus.ut.addCSS(targetSheet, r.s, r.r);
		});
	};

	d20plus.ut.getAntiCacheSuffix = () => {
		return "?" + (new Date()).getTime();
	};

	d20plus.ut.generateRowId = () => {
		return window.generateUUID().replace(/_/g, "Z");
	};

	d20plus.ut.randomRoll = (roll, success, error) => {
		d20.textchat.diceengine.process(roll, success, error);
	};

	d20plus.ut.getJournalFolderObj = () => {
		d20.journal.refreshJournalList();
		let journalFolder = d20.Campaign.get("journalfolder");
		if (journalFolder === "") {
			d20.journal.addFolderToFolderStructure("Characters");
			d20.journal.refreshJournalList();
			journalFolder = d20.Campaign.get("journalfolder");
		}
		return JSON.parse(journalFolder);
	};

	d20plus.ut._lastInput = null;
	d20plus.ut.getNumberRange = (promptText, min, max) => {
		function alertInvalid () {
			alert("Please enter a valid range.");
		}

		function isOutOfRange (num) {
			return num < min || num > max;
		}

		function addToRangeVal (range, num) {
			range.add(num);
		}

		function addToRangeLoHi (range, lo, hi) {
			for (let i = lo; i <= hi; ++i) {
				range.add(i);
			}
		}

		function alertOutOfRange () {
			alert(`Please enter numbers in the range ${min}-${max} (inclusive).`);
		}

		while (true) {
			const res =  prompt(promptText, d20plus.ut._lastInput || "E.g. 1-5, 8, 11-13");
			if (res && res.trim()) {
				d20plus.ut._lastInput = res;
				const clean = res.replace(/\s*/g, "");
				if (/^((\d+-\d+|\d+),)*(\d+-\d+|\d+)$/.exec(clean)) {
					const parts = clean.split(",");
					const out = new Set();
					let failed = false;

					for (const part of parts) {
						if (part.includes("-")) {
							const spl = part.split("-");
							const numLo = Number(spl[0]);
							const numHi = Number(spl[1]);

							if (isNaN(numLo) || isNaN(numHi) || numLo === 0 || numHi === 0 || numLo > numHi) {
								alertInvalid();
								failed = true;
								break;
							}

							if (isOutOfRange(numLo) || isOutOfRange(numHi)) {
								alertOutOfRange();
								failed = true;
								break;
							}

							if (numLo === numHi) {
								addToRangeVal(out, numLo);
							} else {
								addToRangeLoHi(out, numLo, numHi);
							}
						} else {
							const num = Number(part);
							if (isNaN(num) || num === 0) {
								alertInvalid();
								failed = true;
								break;
							} else {
								if (isOutOfRange(num)) {
									alertOutOfRange();
									failed = true;
									break;
								}
								addToRangeVal(out, num);
							}
						}
					}

					if (!failed) {
						d20plus.ut._lastInput = null;
						return out;
					}
				} else {
					alertInvalid();
				}
			} else {
				d20plus.ut._lastInput = null;
				return null;
			}
		}
	};

	d20plus.ut.getPathById = (pathId) => {
		return d20plus.ut._getCanvasElementById(pathId, "thepaths");
	};

	d20plus.ut.getTokenById = (tokenId) => {
		return d20plus.ut._getCanvasElementById(tokenId, "thegraphics");
	};

	d20plus.ut._getCanvasElementById = (id, prop) => {
		const foundArr = d20.Campaign.pages.models.map(model => model[prop] && model[prop].models ? model[prop].models.find(it => it.id === id) : null).filter(it => it);
		return foundArr.length ? foundArr[0] : null;
	};

	d20plus.ut.getMacroByName = (macroName) => {
		const macros = d20.Campaign.players.map(p => p.macros.find(m => m.get("name") === macroName && (p.id === window.currentPlayer.id || m.visibleToCurrentPlayer())))
			.filter(Boolean);
		if (macros.length) {
			return macros[0];
		}
		return null;
	};

	d20plus.ut._BYTE_UNITS = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	d20plus.ut.getReadableFileSizeString = (fileSizeInBytes) => {
		let i = -1;
		do {
			fileSizeInBytes = fileSizeInBytes / 1024;
			i++;
		} while (fileSizeInBytes > 1024);
		return Math.max(fileSizeInBytes, 0.1).toFixed(1) + d20plus.ut._BYTE_UNITS[i];
	};

	d20plus.ut.sanitizeFilename = function (str) {
		return str.trim().replace(/[^\w\-]/g, "_");
	};

	// based on:
	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/src/FileSaver.js */
	d20plus.ut.saveAs = function() {
		const view = window;
		var
			doc = view.document
			// only get URL when necessary in case Blob.js hasn't overridden it yet
			, get_URL = function() {
				return view.URL || view.webkitURL || view;
			}
			, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
			, can_use_save_link = "download" in save_link
			, click = function(node) {
				var event = new MouseEvent("click");
				node.dispatchEvent(event);
			}
			, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
			, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
			, setImmediate = view.setImmediate || view.setTimeout
			, throw_outside = function(ex) {
				setImmediate(function() {
					throw ex;
				}, 0);
			}
			, force_saveable_type = "application/octet-stream"
			// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
			, arbitrary_revoke_timeout = 1000 * 40 // in ms
			, revoke = function(file) {
				var revoker = function() {
					if (typeof file === "string") { // file is an object URL
						get_URL().revokeObjectURL(file);
					} else { // file is a File
						file.remove();
					}
				};
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
			, dispatch = function(filesaver, event_types, event) {
				event_types = [].concat(event_types);
				var i = event_types.length;
				while (i--) {
					var listener = filesaver["on" + event_types[i]];
					if (typeof listener === "function") {
						try {
							listener.call(filesaver, event || filesaver);
						} catch (ex) {
							throw_outside(ex);
						}
					}
				}
			}
			, auto_bom = function(blob) {
				// prepend BOM for UTF-8 XML and text/* types (including HTML)
				// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
				if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
					return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
				}
				return blob;
			}
			, FileSaver = function(blob, name, no_auto_bom) {
				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				// First try a.download, then web filesystem, then object URLs
				var
					filesaver = this
					, type = blob.type
					, force = type === force_saveable_type
					, object_url
					, dispatch_all = function() {
						dispatch(filesaver, "writestart progress write writeend".split(" "));
					}
					// on any filesys errors revert to saving with object URLs
					, fs_error = function() {
						if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
							// Safari doesn't allow downloading of blob urls
							var reader = new FileReader();
							reader.onloadend = function() {
								var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
								var popup = view.open(url, '_blank');
								if(!popup) view.location.href = url;
								url=undefined; // release reference before dispatching
								filesaver.readyState = filesaver.DONE;
								dispatch_all();
							};
							reader.readAsDataURL(blob);
							filesaver.readyState = filesaver.INIT;
							return;
						}
						// don't create more object URLs than needed
						if (!object_url) {
							object_url = get_URL().createObjectURL(blob);
						}
						if (force) {
							view.location.href = object_url;
						} else {
							var opened = view.open(object_url, "_blank");
							if (!opened) {
								// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
								view.location.href = object_url;
							}
						}
						filesaver.readyState = filesaver.DONE;
						dispatch_all();
						revoke(object_url);
					};
				filesaver.readyState = filesaver.INIT;

				if (can_use_save_link) {
					object_url = get_URL().createObjectURL(blob);
					setImmediate(function() {
						save_link.href = object_url;
						save_link.download = name;
						click(save_link);
						dispatch_all();
						revoke(object_url);
						filesaver.readyState = filesaver.DONE;
					}, 0);
					return;
				}

				fs_error();
			}
			, FS_proto = FileSaver.prototype
			, saveAs = function(blob, name, no_auto_bom) {
				return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
			};
		// IE 10+ (native saveAs)
		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function(blob, name, no_auto_bom) {
				name = name || blob.name || "download";

				if (!no_auto_bom) {
					blob = auto_bom(blob);
				}
				return navigator.msSaveOrOpenBlob(blob, name);
			};
		}
		FS_proto.abort = function(){};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;
		FS_proto.error =
			FS_proto.onwritestart =
				FS_proto.onprogress =
					FS_proto.onwrite =
						FS_proto.onabort =
							FS_proto.onerror =
								FS_proto.onwriteend =
									null;

		return saveAs;
	}();

	d20plus.ut.promiseDelay = function (delay) {
		return new Promise(resolve => {
			setTimeout(() => resolve(), delay);
		})
	};

	d20plus.ut.LAYERS = ["map", "background", "objects", "foreground", "gmlayer", "walls", "weather"];
	d20plus.ut.layerToName = (l) => {
		switch (l) {
			case "map": return "Map";
			case "background": return "Background";
			case "objects": return "Objects & Tokens";
			case "foreground": return "Foreground";
			case "gmlayer": return "GM Info Overlay";
			case "walls":  return "Dynamic Lighting";
			case "weather": return "Weather Exclusions";
		}
	};

	d20plus.ut.get$SelValue = ($sel) => {
		return $sel[0].options[$sel[0].selectedIndex].value;
	};

	d20plus.ut.isUseSharedJs = () => {
		return BASE_SITE_URL.includes("://5e.tools") || BASE_SITE_URL.includes("://5etools.com");
	};

	d20plus.ut.fixSidebarLayout = () => {
		$(`#textchat-input`).insertAfter(`#textchat`);
		const cached = d20.textchat.showPopout;
		d20.textchat.showPopout = function () {
			cached();
			const cached2 = d20.textchat.childWindow.onbeforeunload;
			d20.textchat.childWindow.onbeforeunload = function () {
				cached2();
				$(`#textchat-input`).insertAfter(`#textchat`);
			}
		}
	};

	/**
	 * Assumes any other lists have been searched using the same term
	 */
	d20plus.ut.getSearchTermAndReset = (list, ...otherLists) => {
		let lastSearch = null;
		if (list.searched) {
			lastSearch = $(`#search`).val();
			list.search();
			otherLists.forEach(l => l.search());
		}
		list.filter();
		otherLists.forEach(l => l.filter());
		return lastSearch;
	};
}

SCRIPT_EXTENSIONS.push(baseUtil);

/*

map
afow
grid
background
objects
foreground
gmlayer
walls
weather

 */


function baseJsLoad () {
	d20plus.js = {};

	d20plus.js.scripts = [
		{name: "listjs", url: "https://raw.githubusercontent.com/javve/list.js/v1.5.0/dist/list.min.js"},
		{name: "localforage", url: "https://raw.githubusercontent.com/localForage/localForage/1.7.3/dist/localforage.min.js"},
		{name: "JSZip", url: `https://raw.githubusercontent.com/Stuk/jszip/master/dist/jszip.min.js`},
	];

	if (d20plus.ut.isUseSharedJs()) d20plus.js.scripts.push({name: "5etoolsShared", url: `${SITE_JS_URL}shared.js`});
	else d20plus.js.scripts.push({name: "5etoolsUtils", url: `${SITE_JS_URL}utils.js`});

	d20plus.js.apiScripts = [
		{name: "VecMath", url: "https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/Vector%20Math/1.0/VecMath.js"},
		{name: "MatrixMath", url: "https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/MatrixMath/1.0/matrixMath.js"},
		{name: "PathMath", url: "https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/PathMath/1.5/PathMath.js"}
	];

	d20plus.js.pAddScripts = async () => {
		d20plus.ut.log("Add JS");

		await Promise.all(d20plus.js.scripts.map(async it => {
			const js = await d20plus.js.pLoadWithRetries(it.name, it.url);
			d20plus.js._addScript(it.name, js)
		}));

		// Monkey patch JSON loading
		const cached = DataUtil.loadJSON;
		DataUtil.loadJSON = (...args) => {
			if (args.length > 0 && typeof args[0] === "string" && args[0].startsWith("data/")) {
				args[0] = BASE_SITE_URL + args[0];
			}
			return cached.bind(DataUtil)(...args);
		};
	};

	d20plus.js.pAddApiScripts = async () => {
		d20plus.ut.log("Add Builtin API Scripts");

		await Promise.all(d20plus.js.apiScripts.map(async it => {
			const js = await d20plus.js.pLoadWithRetries(it.name, it.url);
			d20plus.js._addScript(it.name, js);
		}));
	};

	d20plus.js._addScript = (name, js) => {
		// sanity check
		if (js instanceof Promise) throw new Error(`Promise was passed instead of text! This is a bug.`);
		try {
			window.eval(js);
			d20plus.ut.log(`JS [${name}] Loaded`);
		} catch (e) {
			d20plus.ut.log(`Error loading [${name}]`);
			d20plus.ut.log(e);
			throw e;
		}
	};

	d20plus.js.pLoadWithRetries = async (name, url, isJson) => {
		let retries = 3;

		function pFetchData () {
			return new Promise((resolve, reject) => {
				$.ajax({
					type: "GET",
					url: `${url}${d20plus.ut.getAntiCacheSuffix()}${retries}`,
					success: function (data) {
						if (isJson && typeof data === "string") resolve(JSON.parse(data));
						else resolve(data);
					},
					error: function (resp, qq, pp) {
						if (resp && resp.status >= 400 && retries-- > 0) {
							console.error(resp, qq, pp);
							d20plus.ut.log(`Error loading ${name}; retrying`);
							setTimeout(() => {
								reject(new Error(`Loading "${name}" failed (status ${resp.status}): ${resp} ${qq} ${pp}`));
							}, 500);
						} else {
							console.error(resp, qq, pp);
							setTimeout(() => {
								reject(new Error(`Loading "${name}" failed (status ${resp.status}): ${resp} ${qq} ${pp}`));
							}, 500);
						}
					}
				});
			})
		}

		let data;
		do {
			try {
				data = await pFetchData();
			} catch (e) {} // error handling is done as part of data fetching
		} while (!data && --retries > 0);

		if (data) return data;
		else throw new Error(`Failed to load ${name} from URL ${url} (isJson: ${!!isJson})`);
	};
}

SCRIPT_EXTENSIONS.push(baseJsLoad);


function baseQpi () {
	const qpi = {
		_version: "0.01-pre-pre-alpha",
		_: {
			log: {
				_ (...args) {
					qpi._log(...args)
				},
				works: 1
			},

			// Campaign: { // FIXME this overwrites the window's campaign, which breaks stuff
			// 	_ () {
			// 		return Campaign;
			// 	},
			// 	works: 0
			// },

			on: {
				_preInit () {
					qpi._on_chatHandlers = [];
					const seenMessages = new Set();
					d20.textchat.chatref = d20.textchat.shoutref.parent().child("chat");
					const handleChat = (e) => {
						if (!d20.textchat.chatstartingup) {
							e.id = e.key();
							if (!seenMessages.has(e.id)) {
								seenMessages.add(e.id);

								var t = e.val();
								if (t) {
									if (window.DEBUG) console.log("CHAT: ", t);

									qpi._on_chatHandlers.forEach(fn => fn(t));
								}
							}
						}
					};
					d20.textchat.chatref.on("child_added", handleChat);
					d20.textchat.chatref.on("child_changed", handleChat);
				},
				_ (evtType, fn, ...others) {
					switch (evtType) {
						case "chat:message":
							qpi._on_chatHandlers.push(fn);
							break;
						default:
							console.error("Unhandled message type: ", evtType, "with args", fn, others)
							break;
					}
				},
				works: 0.01,
				notes: [
					`"chat:message" is the only available event.`
				]
			},

			createObj: {
				_ (objType, obj, ...others) {
					switch (objType) {
						case "path": {
							const page = d20.Campaign.pages._byId[obj._pageid];
							obj.scaleX = obj.scaleX || 1;
							obj.scaleY = obj.scaleY || 1;
							obj.path = obj.path || obj._path
							return page.thepaths.create(obj)
							break;
						}
						default:
							console.error("Unhandled object type: ", objType, "with args", obj, others)
							break;
					}
				},
				works: 0.01,
				notes: [
					`Only supports "path" obects.`
				]
			},

			sendChat: { // TODO lift code from doChatInput
				_ (speakingAs, input, callback, options) {
					const message = {
						who: speakingAs,
						type: "general",
						content: input,
						playerid: window.currentPlayer.id,
						avatar: null,
						inlinerolls: []
					};

					const key = d20.textchat.chatref.push().key();
					d20.textchat.chatref.child(key).setWithPriority(message, Firebase.ServerValue.TIMESTAMP)
				},
				works: 0.01,
				notes: [
					`speakingAs: String only.`,
					`input: String only.`,
					`callback: Unimplemented.`,
					`options: Unimplemented.`,
					`Messages are always sent with the player ID of the QPI user.`
				]
			},

			// findObjs: {
			// 	_ (attrs) {
			// 		// TODO
			// 		// const getters = {
			// 		// 	attribute: () => {},
			// 		// 	character: () => {},
			// 		// 	handout: () => {}
			// 		// };
			// 		// const getAll = () => {
			// 		// 	const out = [];
			// 		// 	Object.values(getters).forEach(fn => out.push(...fn()));
			// 		// 	return out;
			// 		// };
			//
			// 		// let out = attrs._type ? getters[attrs._type]() : getAll();
			//
			// 		throw new Error("findObjs is unimplemented!");
			// 	},
			// 	works: 0.00,
			// 	notes: [
			// 		`Unimplemented.`
			// 	]
			// }
		},

		_loadedScripts: null,
		async _init () {
			Object.keys(qpi._).forEach(k => {
				const it = qpi._[k];
				if (it._preInit) it._preInit();
				window[k] = it._;
			});

			qpi._loadedScripts = await StorageUtil.pGet("VeQpi") || {};

			$(`body`).append(`
				<div id="qpi-manager" title="QPI Script Manager - v${qpi._version}">
					<div class="qpi-table"></div>
					<div>
						<input placeholder="URL*" class="qpi-url">
						<button class="btn qpi-add-url">Add URL</button>
					</div>
					<hr>
					<div>
						<input placeholder="Name*" class="qpi-name">
						<button class="btn qpi-add-text">Load Script</button>
						<br>
						<textarea class="qpi-text" style="width: 100%; height: 300px; resize: vertical;"></textarea>
					</div>
					<hr>
					<button class="btn qpi-help">Help/README</button> <i>Note that this tool is a for-testing faceplate over some internal code. It is intended for internal use only.</i>
				</div>	
			`);
			$(`#qpi-manager`).dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});

			$(`body`).append(`
				<div id="qpi-manager-readme" title="QPI README - v${qpi._version}">
					<div class="qpi-readme"></div>
				</div>	
			`);
			$(`#qpi-manager-readme`).dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});

			qpi._log("Initialised!");
		},

		man (name) {
			if (!name) {
				qpi._log(`Showing all...\n==== Available API Mimics ====\n  - ${Object.keys(qpi._).join("()\n  - ")}()`);
				return;
			}

			const found = Object.keys(qpi._).find(k => k === name);
			if (!found) qpi._log(`No mimic with ${name} found -- perhaps it's unimplemented?`);
			else {
				const it = qpi._[found];
				qpi._log(`Showing "${name}"...\n==== ${name} :: ${it.works * 100}% functional ====\n${(it.notes || []).join("\n")}`);
			}
		},

		_manHtml () {
			let stack = "";
			Object.keys(qpi._).forEach(k => {
				stack += `<h5>${k}</h5>`;
				const it = qpi._[k];
				stack += `<p><i>Estimated ${it.works * 100}% functional</i><br>${(it.notes || []).join("<br>")}</p>`;
			});
			return stack;
		},

		_openManager () {
			const $win = $(`#qpi-manager`);

			$win.find(`.qpi-help`).off("click").on("click", () => {
				const $winReadme = $(`#qpi-manager-readme`);
				$winReadme.dialog("open");

				$winReadme.find(`.qpi-readme`).html(qpi._manHtml());
			});

			$win.find(`.qpi-add-url`).off("click").on("click", () => {
				const url = $win.find(`.qpi-url`).val();
				if (url && script.trim()) {
					qpi._log(`Attempting to load: "${url}"`);
					d20plus.js.pLoadWithRetries(
						url,
						url,
						(data) => {
							d20plus.js._addScript(url, data).then(() => {
								alert("Loaded successfully!");
								$win.find(`.qpi-url`).val("");
							}).catch(() => {
								alert("Failed to load script! See the console for more details (CTRL-SHIFT-J on Chrome)");
							});
						}
					)
				} else {
					alert("Please enter a URL!");
				}
			});

			$win.find(`.qpi-add-text`).off("click").on("click", () => {
				const name = $win.find(`.qpi-name`).val();
				const script = $win.find(`.qpi-text`).val();
				if (name && script && name.trim() && script.trim()) {
					qpi._log(`Attempting to eval user script: ${name}`);
					d20plus.js._addScript(name, script).then(() => {
						alert("Loaded successfully!");
						$win.find(`.qpi-name`).val("");
						$win.find(`.qpi-text`).val("");
					}).catch(() => {
						alert("Failed to load script! See the console for more details (CTRL-SHIFT-J on Chrome)");
					});
				} else {
					alert("Please enter a name and some code!");
				}
			});

			$win.dialog("open");
		},

		_log (...args) {
			console.log("%cQPI > ", "color: #ff00ff; font-size: large", ...args);
		}
	};
	window.qpi = qpi;

	d20plus.qpi = {};
	d20plus.qpi.pInitMockApi = async () => { // TODO check if this needs to be enabled for players too
		d20plus.ut.log("Initialising mock API");
		await qpi._init();
	};
}

SCRIPT_EXTENSIONS.push(baseQpi);


// Borrowed with <3 from Stormy's JukeboxIO
function baseJukebox () {
	d20plus.jukebox = {
		playPlaylist (playlistId) {
			$(document)
				.find(`#jukeboxfolderroot .dd-folder[data-globalfolderid="${playlistId}"]`)
				.find("> .dd-content .play[data-isplaying=false]")
				.trigger("click");
		},

		playTrack (trackId) {
			$(document)
				.find(`#jukeboxfolderroot .dd-item[data-itemid="${trackId}"]`)
				.find("> .dd-content .play[data-isplaying=false]")
				.trigger("click");
		},

		stopPlaylist (playlistId) {
			$(document)
				.find(`#jukeboxfolderroot .dd-folder[data-globalfolderid="${playlistId}"]`)
				.find("> .dd-content .play[data-isplaying=true]")
				.trigger("click");
		},

		stopTrack (trackId) {
			$(document)
				.find(`#jukeboxfolderroot .dd-item[data-itemid="${trackId}"]`)
				.find("> .dd-content .play[data-isplaying=true]")
				.trigger("click");
		},

		play (id) {
			d20plus.jukebox.playPlaylist(id);
			d20plus.jukebox.playTrack(id);
		},

		stop (id) {
			d20plus.jukebox.stopPlaylist(id);
			d20plus.jukebox.stopTrack(id);
		},

		stopAll () {
			d20.jukebox.stopAllTracks();
		},

		skip () {
			const playlistId = d20plus.jukebox.getCurrentPlayingPlaylist();
			d20.jukebox.stopAllTracks();
			d20plus.jukebox.playPlaylist(playlistId);
		},

		getCurrentPlayingTracks () {
			let playlingTracks = [];
			window.Jukebox.playlist.each((track) => {
				if (track.get("playing")) {
					playlingTracks.push(track.attributes);
				}
			});
			return playlingTracks;
		},

		getCurrentPlayingPlaylist () {
			const id = d20.Campaign.attributes.jukeboxplaylistplaying;
			return id ? id.split("|")[0] : id;
		},

		addJukeboxChangeHandler (func) {
			d20plus.jukebox.addPlaylistChangeHandler(func);
			d20plus.jukebox.addTrackChangeHandler(func);
		},

		addPlaylistChangeHandler (func) {
			d20.Campaign.on("change:jukeboxplaylistplaying change:jukeboxfolder", func);
		},

		addTrackChangeHandler (func) {
			window.Jukebox.playlist.each((track) => {
				track.on("change:playing", func);
			});
		},

		getJukeboxFileStructure () {
			d20plus.jukebox.forceJukeboxRefresh();
			return window.d20.jukebox.lastFolderStructure;
		},

		getTrackById (id) {
			return window.Jukebox.playlist.get(id);
		},

		getJukeboxPlaylists () {
			const fs = d20plus.jukebox.getJukeboxFileStructure();
			const retVals = [];

			for (const fsItem of fs) {
				if (typeof (fsItem) === "string") continue;

				const rawPlaylist = fsItem;

				const playlist = {
					name: rawPlaylist.n,
					mode: rawPlaylist.s,
					tracks: [],
				};

				for (const trackId of rawPlaylist.i) {
					const track = d20plus.jukebox.getTrackById(trackId);
					if (!track) {
						console.warn(`Tried to get track id ${trackId} but the query returned a falsy value. Skipping`);
						continue;
					}

					playlist.tracks.push(track);
				}

				retVals.push(playlist);
			}

			return retVals;
		},

		getJukeboxTracks () {
			const fs = d20plus.jukebox.getJukeboxFileStructure();

			const retVals = [];

			for (const fsItem of fs) {
				if (typeof (fsItem) !== "string") continue;

				const track = d20plus.jukebox.getTrackById(fsItem);
				if (!track) {
					console.warn(`Tried to get track id ${fsItem} but the query returned a falsy value. Skipping`);
					continue;
				}

				retVals.push(track);
			}

			return retVals;
		},

		_getExportableTrack (s) {
			return {
				loop: s.attributes.loop,
				playing: s.attributes.playing,
				softstop: s.attributes.softstop,
				source: s.attributes.source,
				tags: s.attributes.tags,
				title: s.attributes.title,
				track_id: s.attributes.track_id,
				volume: s.attributes.volume,
			};
		},

		getExportablePlaylists () {
			return d20plus.jukebox.getJukeboxPlaylists().map(p => {
				return {
					name: p.name,
					mode: p.mode,
					tracks: p.tracks.map(d20plus.jukebox._getExportableTrack),
				};
			});
		},

		getExportableTracks () {
			return d20plus.jukebox.getJukeboxTracks().map(d20plus.jukebox._getExportableTrack);
		},

		importWrappedData (data) {
			d20plus.jukebox.forceJukeboxRefresh();

			const tracks = (data.tracks || []).map(t => d20plus.jukebox.createTrack(t).id);

			const playlists = (data.playlists || []).map(p => {
				const trackIds = p.tracks.map(s => d20plus.jukebox.createTrack(s).id);
				return d20plus.jukebox.makePlaylistStructure(p.name, p.mode, trackIds);
			});

			let fs = JSON.parse(d20.Campaign.attributes.jukeboxfolder);
			fs = fs.concat(tracks, playlists);

			d20.Campaign.save({
				jukeboxfolder: JSON.stringify(fs)
			});
		},

		createTrack (data) {
			return window.Jukebox.playlist.create(data);
		},

		makePlaylistStructure (name, mode, trackIds) {
			return {
				id: window.generateUUID(),
				n: name,
				s: mode,
				i: trackIds || []
			};
		},

		forceJukeboxRefresh () {
			const $jukebox = $("#jukebox");
			const serializable = $jukebox.find("#jukeboxfolderroot").nestable("serialize");
			serializable && d20.Campaign.save({
				jukeboxfolder: JSON.stringify(serializable)
			});
		}
	};
}

SCRIPT_EXTENSIONS.push(baseJukebox);


function baseMath () {
	d20plus.math = {
		vec2: {
			/**
			 * Normalize a 2d vector.
			 * @param out Result storage
			 * @param a Vector to normalise
			 */
			normalize (out, a) {
				const x = a[0],
					y = a[1];
				let len = x*x + y*y;
				if (len > 0) {
					len = 1 / Math.sqrt(len);
					out[0] = a[0] * len;
					out[1] = a[1] * len;
				}
				return out;
			},

			/**
			 * Scale a 2d vector.
			 * @param out Resulst storage
			 * @param a Vector to scale
			 * @param b Value to scale by
			 */
			scale (out, a, b) {
				out[0] = a[0] * b;
				out[1] = a[1] * b;
				return out;
			},

			/**
			 * Rotate a 2D vector
			 * @param {vec2} out The receiving vec2
			 * @param {vec2} a The vec2 point to rotate
			 * @param {vec2} b The origin of the rotation
			 * @param {Number} c The angle of rotation
			 * @returns {vec2} out
			 */
			rotate (out, a, b, c) {
				//Translate point to the origin
				let p0 = a[0] - b[0],
					p1 = a[1] - b[1],
					sinC = Math.sin(c),
					cosC = Math.cos(c);

				//perform rotation and translate to correct position
				out[0] = p0*cosC - p1*sinC + b[0];
				out[1] = p0*sinC + p1*cosC + b[1];
				return out;
			},

			/**
			 * Adds two vec2's
			 *
			 * @param {vec2} out the receiving vector
			 * @param {vec2} a the first operand
			 * @param {vec2} b the second operand
			 * @returns {vec2} out
			 */
			add (out, a, b) {
				out[0] = a[0] + b[0];
				out[1] = a[1] + b[1];
				return out;
			},

			/**
			 * Subtracts vector b from vector a
			 *
			 * @param {vec2} out the receiving vector
			 * @param {vec2} a the first operand
			 * @param {vec2} b the second operand
			 * @returns {vec2} out
			 */
			sub (out, a, b) {
				out[0] = a[0] - b[0];
				out[1] = a[1] - b[1];
				return out;
			},

			/**
			 * Computes the cross product of two vec2's
			 * Note that the cross product must by definition produce a 3D vector
			 *
			 * @param {vec3} out the receiving vector
			 * @param {vec2} a the first operand
			 * @param {vec2} b the second operand
			 * @returns {vec3} out
			 */
			cross (out, a, b) {
				let z = a[0] * b[1] - a[1] * b[0];
				out[0] = out[1] = 0;
				out[2] = z;
				return out;
			},

			/**
			 * Multiplies two vec2's
			 *
			 * @param {vec2} out the receiving vector
			 * @param {vec2} a the first operand
			 * @param {vec2} b the second operand
			 * @returns {vec2} out
			 */
			mult (out, a, b) {
				out[0] = a[0] * b[0];
				out[1] = a[1] * b[1];
				return out;
			},

			/**
			 * Calculates the length of a vec2
			 *
			 * @param {vec2} a vector to calculate length of
			 * @returns {Number} length of a
			 */
			len (a) {
				const x = a[0], y = a[1];
				return Math.sqrt(x * x + y * y);
			}
		},

		/**
		 * Helper function to determine whether there is an intersection between the two polygons described
		 * by the lists of vertices. Uses the Separating Axis Theorem
		 *
		 * @param a an array of connected points [[x, y], [x, y],...] that form a closed polygon
		 * @param b an array of connected points [[x, y], [x, y],...] that form a closed polygon
		 * @return boolean true if there is any intersection between the 2 polygons, false otherwise
		 */
		doPolygonsIntersect (a, b) {
			const polygons = [a, b];
			let minA, maxA, projected, i, i1, j, minB, maxB;

			for (i = 0; i < polygons.length; i++) {
				// for each polygon, look at each edge of the polygon, and determine if it separates
				// the two shapes
				const polygon = polygons[i];
				for (i1 = 0; i1 < polygon.length; i1++) {
					// grab 2 vertices to create an edge
					const i2 = (i1 + 1) % polygon.length;
					const p1 = polygon[i1];
					const p2 = polygon[i2];

					// find the line perpendicular to this edge
					const normal = [p2[1] - p1[1], p1[0] - p2[0]];

					minA = maxA = undefined;
					// for each vertex in the first shape, project it onto the line perpendicular to the edge
					// and keep track of the min and max of these values
					for (j = 0; j < a.length; j++) {
						projected = normal[0] * a[j][0] + normal[1] * a[j][1];
						if (minA === undefined || projected < minA) minA = projected;
						if (maxA === undefined || projected > maxA) maxA = projected;
					}

					// for each vertex in the second shape, project it onto the line perpendicular to the edge
					// and keep track of the min and max of these values
					minB = maxB = undefined;
					for (j = 0; j < b.length; j++) {
						projected = normal[0] * b[j][0] + normal[1] * b[j][1];
						if (minB === undefined || projected < minB) minB = projected;
						if (maxB === undefined || projected > maxB) maxB = projected;
					}

					// if there is no overlap between the projects, the edge we are looking at separates the two
					// polygons, and we know there is no overlap
					if (maxA < minB || maxB < minA) {
						return false;
					}
				}
			}
			return true;
		}
	};
}

SCRIPT_EXTENSIONS.push(baseMath);


function baseConfig() {
	d20plus.cfg = {current: {}};

	d20plus.cfg.pLoadConfigFailed = false;

	d20plus.cfg.pLoadConfig = async () => {
		d20plus.ut.log("Reading Config");
		let configHandout = d20plus.cfg.getConfigHandout();

		if (!configHandout) {
			d20plus.ut.log("No config found! Initialising new config...");
			await d20plus.cfg.pMakeDefaultConfig();
		}

		configHandout = d20plus.cfg.getConfigHandout();
		if (configHandout) {
			configHandout.view.render();
			return new Promise(resolve => {
				configHandout._getLatestBlob("gmnotes", async function (gmnotes) {
					try {
						const decoded = decodeURIComponent(gmnotes);

						d20plus.cfg.current = JSON.parse(decoded);

						d20plus.ut.log("Config Loaded:");
						d20plus.ut.log(d20plus.cfg.current);
						resolve();
					} catch (e) {
						console.error(e);
						if (!d20plus.cfg.pLoadConfigFailed) {
							// prevent infinite loops
							d20plus.cfg.pLoadConfigFailed = true;

							d20plus.ut.log("Corrupted config! Rebuilding...");
							await d20plus.cfg.pMakeDefaultConfig();
							await d20plus.cfg.pLoadConfig();
							resolve();
						} else {
							// if the config fails, continue to load anyway
							resolve();
						}
					}
				});
			});
		} else d20plus.ut.log("Failed to create config handout!");
	};

	d20plus.cfg.pLoadPlayerConfig = async () => {
		d20plus.ut.log("Reading player Config");
		const loaded = await StorageUtil.pGet(`Veconfig`);
		if (!loaded) {
			d20plus.ut.log("No player config found! Initialising new config...");
			const dfltConfig = d20plus.cfg.getDefaultConfig();
			d20plus.cfg.current = Object.assign(d20plus.cfg.current, dfltConfig);
			await StorageUtil.pSet(`Veconfig`, d20plus.cfg.current);
		} else {
			d20plus.cfg.current = loaded;
		}
		d20plus.ut.log("Player config Loaded:");
		d20plus.ut.log(d20plus.cfg.current);
	};

	d20plus.cfg.pMakeDefaultConfig = () => {
		return new Promise(resolve => {
			d20.Campaign.handouts.create({
				name: CONFIG_HANDOUT,
				archived: true
			}, {
				success: function (handout) {
					notecontents = "The GM notes contain config options saved between sessions. If you want to wipe your saved settings, delete this handout and reload roll20. If you want to edit your settings, click the \"Edit Config\" button in the <b>Settings</b> (cog) panel.";

					// default settings
					// token settings mimic official content; other settings as vanilla as possible
					const gmnotes = JSON.stringify(d20plus.cfg.getDefaultConfig());

					handout.updateBlobs({notes: notecontents, gmnotes: gmnotes});
					handout.save({notes: (new Date).getTime(), inplayerjournals: ""});

					resolve();
				}
			});
		});
	};

	d20plus.cfg.getConfigHandout = () => {
		d20plus.ut.getJournalFolderObj(); // ensure journal init

		return d20.Campaign.handouts.models.find(function (handout) {
			return handout.attributes.name === CONFIG_HANDOUT;
		});
	};

	d20plus.cfg.getCfgKey = (group, val) => {
		if (val === undefined || d20plus.cfg.current[group] === undefined) return undefined;
		const gr = d20plus.cfg.current[group];
		for (const key of Object.keys(d20plus.cfg.current[group])) {
			if (gr[key] !== undefined && gr[key] === val) {
				return key;
			}
		}
		return undefined;
	};

	d20plus.cfg.getRawCfgVal = (group, key) => {
		if (d20plus.cfg.current[group] === undefined) return undefined;
		if (d20plus.cfg.current[group][key] === undefined) return undefined;
		return d20plus.cfg.current[group][key];
	};

	d20plus.cfg.get = (group, key) => {
		if (d20plus.cfg.current[group] === undefined) return undefined;
		if (d20plus.cfg.current[group][key] === undefined) return undefined;
		if (CONFIG_OPTIONS[group][key]._type === "_SHEET_ATTRIBUTE") {
			if (!NPC_SHEET_ATTRIBUTES[d20plus.cfg.current[group][key]]) return undefined;
			return NPC_SHEET_ATTRIBUTES[d20plus.cfg.current[group][key]][d20plus.sheet];
		}
		if (CONFIG_OPTIONS[group][key]._type === "_SHEET_ATTRIBUTE_PC") {
			if (!PC_SHEET_ATTRIBUTES[d20plus.cfg.current[group][key]]) return undefined;
			return PC_SHEET_ATTRIBUTES[d20plus.cfg.current[group][key]][d20plus.sheet];
		}
		return d20plus.cfg.current[group][key];
	};

	d20plus.cfg.getDefault = (group, key) => {
		return d20plus.cfg._getProp("default", group, key);
	};

	d20plus.cfg.getPlaceholder = (group, key) => {
		return d20plus.cfg._getProp("_placeholder", group, key);
	};

	d20plus.cfg._getProp = (prop, group, key) => {
		if (CONFIG_OPTIONS[group] === undefined) return undefined;
		if (CONFIG_OPTIONS[group][key] === undefined) return undefined;
		return CONFIG_OPTIONS[group][key][prop];
	};

	d20plus.cfg.getOrDefault = (group, key) => {
		if (d20plus.cfg.has(group, key)) return d20plus.cfg.get(group, key);
		return d20plus.cfg.getDefault(group, key);
	};

	d20plus.cfg.getCfgEnumVals = (group, key) => {
		if (CONFIG_OPTIONS[group] === undefined) return undefined;
		if (CONFIG_OPTIONS[group][key] === undefined) return undefined;
		return CONFIG_OPTIONS[group][key].__values
	};

	d20plus.cfg.getCfgSliderVals = (group, key) => {
		if (CONFIG_OPTIONS[group] === undefined) return undefined;
		if (CONFIG_OPTIONS[group][key] === undefined) return undefined;
		const it = CONFIG_OPTIONS[group][key];
		return {
			min: it.__sliderMin,
			max: it.__sliderMax,
			step: it.__sliderStep
		}
	};

	d20plus.cfg.getDefaultConfig = () => {
		const outCpy = {};
		$.each(CONFIG_OPTIONS, (sectK, sect) => {
			if (window.is_gm || sect._player) {
				outCpy[sectK] = outCpy[sectK] || {};
				$.each(sect, (k, data) => {
					if (!k.startsWith("_") && (window.is_gm || data._player)) {
						outCpy[sectK][k] = data.default;
					}
				});
			}
		});
		return outCpy;
	};

	// Helpful for checking if a boolean option is set even if false
	d20plus.cfg.has = (group, key) => {
		if (d20plus.cfg.current[group] === undefined) return false;
		return d20plus.cfg.current[group][key] !== undefined;
	};

	d20plus.cfg.setCfgVal = (group, key, val) => {
		if (d20plus.cfg.current[group] === undefined) d20plus.cfg.current[group] = {};
		d20plus.cfg.current[group][key] = val;
	};

	d20plus.cfg.makeTabPane = ($addTo, headers, content) => {
		if (headers.length !== content.length) throw new Error("Tab header and content length were not equal!");

		if ($addTo.attr("hastabs") !== "YES") {
			const $tabBar = $(`<ul class="nav nav-tabs"/>`);

			const tabList = [];
			const paneList = [];
			const $tabPanes = $(`<div class="tabcontent"/>`);

			$.each(content, (i, e) => {
				const toAdd = $(`<div class="plustab${i} tab-pane" ${i === 0 ? "" : `style="display: none"`}/>`);
				toAdd.append(e);
				paneList[i] = toAdd;
				$tabPanes.append(toAdd);
			});

			$.each(headers, (i, e) => {
				const toAdd = $(`<li ${i === 0 ? `class="active"` : ""}><a data-tab="plustab${i}" href="#">${e}</a></li>`).on("click", () => {
					paneList.forEach((p, i2) => {
						if (i2 === i) {
							tabList[i2].addClass("active");
							paneList[i2].show();
						} else {
							tabList[i2].removeClass("active");
							paneList[i2].hide();
						}
					});
				});
				tabList[i] = (toAdd);
				$tabBar.append(toAdd);
			});

			$addTo
				.append($tabBar)
				.append($tabPanes);

			$addTo.attr("hastabs", "YES");
		}
	};

	d20plus.cfg.openConfigEditor = () => {
		const cEdit = $("#d20plus-configeditor");
		cEdit.dialog("open");

		if (cEdit.attr("hastabs") !== "YES") {
			cEdit.attr("hastabs", "YES");
			const appendTo = $(`<div/>`);
			cEdit.prepend(appendTo);

			const configFields = {};

			let sortedKeys = Object.keys(CONFIG_OPTIONS).sort((a, b) => d20plus.ut.ascSort(CONFIG_OPTIONS[a]._name, CONFIG_OPTIONS[b]._name));
			if (!window.is_gm) sortedKeys = sortedKeys.filter(k => CONFIG_OPTIONS[k]._player);

			const tabList = sortedKeys.map(k => CONFIG_OPTIONS[k]._name);
			const contentList = sortedKeys.map(k => makeTab(k));

			function makeTab (cfgK) {
				const cfgGroup = CONFIG_OPTIONS[cfgK];
				configFields[cfgK] = {};

				const content = $(`
						<div class="config-table-wrapper">
							<table class="config-table">
								<thead><tr><th>Property</th><th>Value</th></tr></thead>
								<tbody></tbody>
							</table>
						</div>
					`);
				const tbody = content.find(`tbody`);

				let sortedTabKeys = Object.keys(cfgGroup).filter(k => !k.startsWith("_"));
				if (!window.is_gm) sortedTabKeys = sortedTabKeys.filter(k => cfgGroup[k]._player);

				sortedTabKeys.forEach((grpK, idx) => {
					const prop = cfgGroup[grpK];

					// IDs only used for label linking
					const toAdd = $(`<tr><td><label for="conf_field_${idx}" class="config-name">${prop.name}</label></td></tr>`);

					// Each config `_type` should have a case here. Each case should add a function to the map [configFields:[cfgK:grpK]]. These functions should return the value of the input.
					switch (prop._type) {
						case "boolean": {
							const field = $(`<input type="checkbox" id="conf_field_${idx}" ${d20plus.cfg.getOrDefault(cfgK, grpK) ? `checked` : ""}>`);

							configFields[cfgK][grpK] = () => {
								return field.prop("checked")
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
						case "String": {
							const curr = d20plus.cfg.get(cfgK, grpK) || "";
							const placeholder = d20plus.cfg.getPlaceholder(cfgK, grpK);
							const def = d20plus.cfg.getDefault(cfgK, grpK) || "";
							const field = $(`<input id="conf_field_${idx}" value="${curr}" ${placeholder ? `placeholder="${placeholder}"` : def ? `placeholder="Default: ${def}"` : ""}>`);

							configFields[cfgK][grpK] = () => {
								return field.val() ? field.val().trim() : "";
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
						case "_SHEET_ATTRIBUTE_PC":
						case "_SHEET_ATTRIBUTE": {
							const DICT = prop._type === "_SHEET_ATTRIBUTE" ? NPC_SHEET_ATTRIBUTES : PC_SHEET_ATTRIBUTES;
							const sortedNpcsAttKeys = Object.keys(DICT).sort((at1, at2) => d20plus.ut.ascSort(DICT[at1].name, DICT[at2].name));
							const field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${sortedNpcsAttKeys.map(npcK => `<option value="${npcK}">${DICT[npcK].name}</option>`)}</select>`);
							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								field.val(cur);
							}

							configFields[cfgK][grpK] = () => {
								return field.val()
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
						case "float":
						case "integer": {
							const def = d20plus.cfg.getDefault(cfgK, grpK);
							const curr = d20plus.cfg.get(cfgK, grpK);
							const field = $(`<input id="conf_field_${idx}" type="number" ${curr != null ? `value="${curr}"` : ""} ${def != null ? `placeholder="Default: ${def}"` : ""} step="any">`);

							configFields[cfgK][grpK] = () => {
								return Number(field.val());
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
						case "_FORMULA": {
							const $field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${d20plus.formulas._options.sort().map(opt => `<option value="${opt}">${opt}</option>`)}</select>`);

							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								$field.val(cur);
							}

							configFields[cfgK][grpK] = () => {
								return $field.val();
							};

							const td = $(`<td/>`).append($field);
							toAdd.append(td);
							break;
						}
						case "_WHISPERMODE": {
							const $field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${d20plus.whisperModes.map(mode => `<option value="${mode}">${mode}</option>`)}</select>`);

							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								$field.val(cur);
							}

							configFields[cfgK][grpK] = () => {
								return $field.val();
							};

							const td = $(`<td/>`).append($field);
							toAdd.append(td);
							break;
						}
						case "_ADVANTAGEMODE": {
							const $field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${d20plus.advantageModes.map(mode => `<option value="${mode}">${mode}</option>`)}</select>`);

							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								$field.val(cur);
							}

							configFields[cfgK][grpK] = () => {
								return $field.val();
							};

							const td = $(`<td/>`).append($field);
							toAdd.append(td);
							break;
						}
						case "_DAMAGEMODE": {
							const $field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${d20plus.damageModes.map(mode => `<option value="${mode}">${mode}</option>`)}</select>`);

							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								$field.val(cur);
							}

							configFields[cfgK][grpK] = () => {
								return $field.val();
							};

							const td = $(`<td/>`).append($field);
							toAdd.append(td);
							break;
						}
						case "_enum": { // for generic String enums not covered above
							const $field = $(`<select id="conf_field_${idx}" class="cfg_grp_${cfgK}" data-item="${grpK}">${d20plus.cfg.getCfgEnumVals(cfgK, grpK).map(it => `<option value="${it}">${it}</option>`)}</select>`);

							const cur = d20plus.cfg.get(cfgK, grpK);
							if (cur !== undefined) {
								$field.val(cur);
							} else {
								const def = d20plus.cfg.getDefault(cfgK, grpK);
								if (def !== undefined) {
									$field.val(def);
								}
							}

							configFields[cfgK][grpK] = () => {
								return $field.val();
							};

							const td = $(`<td/>`).append($field);
							toAdd.append(td);
							break;
						}
						case "_slider": {
							const def = d20plus.cfg.getDefault(cfgK, grpK);
							const curr = d20plus.cfg.get(cfgK, grpK);
							const sliderMeta = d20plus.cfg.getCfgSliderVals(cfgK, grpK);

							const field = $(`<input style="max-width: calc(100% - 40px);" type="range" min="${sliderMeta.min || 0}" max="${sliderMeta.max || 0}" step="${sliderMeta.step || 1}" value="${curr == null ? def : curr}">`);

							configFields[cfgK][grpK] = () => {
								return Number(field.val());
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
						case "_color": {
							const value = d20plus.cfg.getOrDefault(cfgK, grpK);

							const field = $(`<input type="color" value="${value == null ? "" : value}">`);

							configFields[cfgK][grpK] = () => {
								return field.val();
							};

							const td = $(`<td/>`).append(field);
							toAdd.append(td);
							break;
						}
					}
					tbody.append(toAdd);
				});

				return content;
			}

			d20plus.cfg.makeTabPane(
				appendTo,
				tabList,
				contentList
			);

			const saveButton = $(`#configsave`);
			saveButton.unbind("click");
			saveButton.bind("click", () => {
				function _updateLoadedConfig () {
					$.each(configFields, (cfgK, grp) => {
						$.each(grp, (grpK, grpVField) => {
							d20plus.cfg.setCfgVal(cfgK, grpK, grpVField());
						})
					});
				}

				if (window.is_gm) {
					let handout = d20plus.cfg.getConfigHandout();
					if (!handout) {
						d20plus.cfg.pMakeDefaultConfig(doSave);
					} else {
						doSave();
					}

					function doSave () {
						_updateLoadedConfig();

						const gmnotes = JSON.stringify(d20plus.cfg.current).replace(/%/g, "%25");
						handout.updateBlobs({gmnotes: gmnotes});
						handout.save({notes: (new Date).getTime()});

						d20plus.ut.log("Saved config");

						d20plus.cfg.baseHandleConfigChange();
						if (d20plus.handleConfigChange) d20plus.handleConfigChange();
					}
				} else {
					_updateLoadedConfig();
					StorageUtil.pSet(`Veconfig`, d20plus.cfg.current);
					d20plus.cfg.baseHandleConfigChange();
					if (d20plus.handleConfigChange) d20plus.handleConfigChange();
				}
			});
		}
	};

	/*
	// Left here for future use, in case anything similar is required
	d20plus.cfg._handleWeatherConfigChange = () => {
		function handleProp (prop) {
			const campaignKey = `bR20cfg_${prop}`;
			if (d20plus.cfg.has("weather", prop)) {
				Campaign && Campaign.save({[campaignKey]: d20plus.cfg.get("weather", prop)});
			} else {
				if (Campaign) {
					delete Campaign[campaignKey];
					Campaign.save();
				}
			}
		}
		if (window.is_gm) {
			handleProp("weatherType1");
			handleProp("weatherTypeCustom1");
			handleProp("weatherSpeed1");
			handleProp("weatherDir1");
			handleProp("weatherDirCustom1");
			handleProp("weatherOscillate1");
			handleProp("weatherOscillateThreshold1");
			handleProp("weatherIntensity1");
			handleProp("weatherTint1");
			handleProp("weatherTintColor1");
			handleProp("weatherEffect1");
		}
	};
	*/

	d20plus.cfg.baseHandleConfigChange = () => {
		// d20plus.cfg._handleWeatherConfigChange();
		if (d20plus.cfg.has("interface", "toolbarOpacity")) {
			const v = Math.max(Math.min(Number(d20plus.cfg.get("interface", "toolbarOpacity")), 100), 0);
			$(`#secondary-toolbar`).css({opacity: v * 0.01});
		}

		$(`#floatinglayerbar`).toggle(d20plus.cfg.getOrDefault("interface", "quickLayerButtons"));
		$(`#init-quick-sort-desc`).toggle(d20plus.cfg.getOrDefault("interface", "quickInitButtons"));
		$(`input[placeholder="Search by tag or name..."]`).parent().toggle(!d20plus.cfg.getOrDefault("interface", "hideDefaultJournalSearch"))
	};

	d20plus.cfg.startPlayerConfigHandler = () => {
		function handlePlayerCfg () {
			d20plus.cfg.baseHandleConfigChange();
			if (d20plus.handleConfigChange) d20plus.handleConfigChange(true);
		}

		// every 5 seconds, poll and apply any config changes the GM might have made
		if (!window.is_gm) {
			setInterval(() => {
				handlePlayerCfg();
			}, 5000);
		}
		handlePlayerCfg();
	};
}

SCRIPT_EXTENSIONS.push(baseConfig);


function baseTool() {
	d20plus.tool = {};

	/**
	 * Each tool should have:
	 *  - `name` List display name.
	 *  - `desc` List display description.
	 *  - `dialogFn` Function called to initialize dialog.
	 *  - `openFn` Function called when tool is opened.
	 */
	d20plus.tool.tools = [
		{
			name: "Journal Cleaner",
			desc: "Quickly select and delete journal items, especially useful for cleaning up loose items after deleting a folder.",
			html: `
				<div id="d20plus-quickdelete" title="Journal Root Cleaner">
				<p>A list of characters and handouts in the journal folder root, which allows them to be quickly deleted.</p>
				<label style="font-weight: bold">Root Only <input type="checkbox" class="cb-deep" checked></label>
				<hr>
				<p style="display: flex; justify-content: space-between"><label><input type="checkbox" title="Select all" id="deletelist-selectall"> Select All</label> <a class="btn" href="#" id="quickdelete-btn-submit">Delete Selected</a></p>
				<div id="delete-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<br><br>
					<ul class="list deletelist" style="max-height: 420px; overflow-y: scroll; display: block; margin: 0;"></ul>
				</div>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-quickdelete").dialog({
					autoOpen: false,
					resizable: true,
					width: 800,
					height: 700,
				});
			},
			openFn: () => {
				const $win = $("#d20plus-quickdelete");
				$win.dialog("open");
				const $cbDeep = $win.find(`.cb-deep`);

				const $cbAll = $("#deletelist-selectall").unbind("click");

				const $btnDel = $(`#quickdelete-btn-submit`).off("click");

				$cbDeep.off("change").on("change", () => populateList());

				populateList();

				function populateList () {
					// collect a list of all journal items
					function getAllJournalItems () {
						const out = [];

						function recurse (entry, pos, isRoot) {
							if (entry.i) {
								if (!isRoot) pos.push(entry.n);
								entry.i.forEach(nxt => recurse(nxt, pos));
								pos.pop();
							} else out.push({id: entry, path: MiscUtil.copy(pos)});
						}

						const root = {i: d20plus.ut.getJournalFolderObj()};
						recurse(root, [], true);
						return out.map(it => getItemFromId(it.id, it.path.join(" / ")));
					}

					function getRootJournalItems () {
						const rootItems = [];
						const journal = d20plus.ut.getJournalFolderObj();
						journal.forEach(it => {
							if (it.i) return; // skip folders
							rootItems.push(getItemFromId(it));
						});
						return rootItems;
					}

					function getItemFromId (itId, path = "") {
						const handout = d20.Campaign.handouts.get(itId);
						if (handout && (handout.get("name") === CONFIG_HANDOUT || handout.get("name") === ART_HANDOUT)) return null; // skip 5etools handouts
						const character = d20.Campaign.characters.get(itId);
						if (handout) return {type: "handouts", id: itId, name: handout.get("name"), path: path};
						if (character) return {type: "characters", id: itId, name: character.get("name"), path: path};
					}

					function getJournalItems () {
						if ($cbDeep.prop("checked")) return getRootJournalItems().filter(it => it);
						else return getAllJournalItems().filter(it => it);
					}

					const journalItems = getJournalItems();

					const $delList = $win.find(`.list`);
					$delList.empty();

					journalItems.forEach((it, i) => {
						$delList.append(`
							<label class="import-cb-label" data-listid="${i}">
								<input type="checkbox">
								<span class="name readable">${it.path ? `${it.path} / ` : ""}${it.name}</span>
							</label>
						`);
					});

					// init list library
					const delList = new List("delete-list-container", {
						valueNames: ["name"],
						listClass: "deletelist"
					});

					$cbAll.prop("checked", false);
					$cbAll.off("click").click(() => d20plus.importer._importToggleSelectAll(delList, $cbAll));

					$btnDel.off("click").on("click", () => {
						const sel = delList.items
							.filter(it => $(it.elm).find(`input`).prop("checked"))
							.map(it => journalItems[$(it.elm).attr("data-listid")]);

						if (!sel.length) {
							alert("No items selected!");
						} else if (confirm(`Are you sure you want to delete the ${sel.length} selected item${sel.length > 1 ? "s" : ""}?`)) {
							$win.dialog("close");
							$("a.ui-tabs-anchor[href='#journal']").trigger("click");
							sel.forEach(toDel => {
								d20.Campaign[toDel.type].get(toDel.id).destroy();
							});
							$("#journalfolderroot").trigger("change");
						}
					});
				}
			}
		},
		{
			name: "SVG Draw",
			desc: "Paste SVG data as text to automatically draw the paths.",
			html: `
				<div id="d20plus-svgdraw" title="SVG Drawing Tool">
				<p>Paste SVG data as text to automatically draw any included &lt;path&gt;s. Draws to the current layer, in the top-left corner, with no scaling. Takes colour information from &quot;stroke&quot; attributes.</p>
				<p>Line width (px; default values are 1, 3, 5, 8, 14): <input name="stroke-width" placeholder="5" value="5" type="number"></p>
				<textarea rows="10" cols="100" placeholder="Paste SVG data here"></textarea>
				<br>
				<button class="btn">Draw</button>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-svgdraw").dialog({
					autoOpen: false,
					resizable: true,
					width: 800,
					height: 650,
				});
			},
			openFn: () => {
				// adapted from `d20.engine.finishCurrentPolygon`
				function addShape(path, pathStroke, strokeWidth) {
					let i = d20.engine.convertAbsolutePathStringtoFabric(path);
					i = _.extend(i, {
						strokeWidth: strokeWidth,
						fill: "transparent",
						stroke: pathStroke,
						path: JSON.parse(i.path)
					});
					d20.Campaign.activePage().addPath(i);
					d20.engine.redrawScreenNextTick();
				}

				const $win = $("#d20plus-svgdraw");
				$win.dialog("open");

				$win.find(`button`).off("click").on("click", () => {
					d20plus.ut.log("Drawing paths");
					const input = $win.find(`textarea`).val();
					const svg = $.parseXML(input);

					const toDraw = $(svg).find("path").map((i, e) => {
						const $e = $(e);
						return {stroke: $e.attr("stroke") || "black", d: $e.attr("d")}
					}).get();

					const strokeWidth = Math.max(1, Number($win.find(`input[name="stroke-width"]`).val()));

					toDraw.forEach(it => {
						addShape(it.d, it.stroke, strokeWidth)
					});
				});
			}
		},
		{
			name: "Multi-Whisper",
			desc: "Send whispers to multiple players ",
			html: `
				<div id="d20plus-whispers" title="Multi-Whisper Tool">
				<div>
					<button class="btn toggle-dc">Show Disconnected Players</button>
					<button class="btn send-all">Send All Messages</button>
					<button class="btn clear-all">Clear All Messages</button>
				</div>
				<hr>
				<div class="messages" style="max-height: 600px; overflow-y: auto; overflow-x: hidden; transform: translateZ(0)">
					<!-- populate with JS -->
				</div>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-whispers").dialog({
					autoOpen: false,
					resizable: true,
					width: 1000,
					height: 760,
				});
			},
			openFn: () => {
				$("a.ui-tabs-anchor[href='#textchat']").trigger("click");

				const $win = $("#d20plus-whispers");
				$win.dialog("open");

				const $btnToggleDc = $win.find(`.toggle-dc`).off("click").text("Show Disconnected Players");
				const $btnSendAll = $win.find(`.send-all`).off("click");
				const $btnClearAll = $win.find(`.clear-all`).off("click");

				const $pnlMessages = $win.find(`.messages`).empty();
				const players = d20.Campaign.players.toJSON();
				players.forEach((p, i) => {
					const $btnSend = $(`<button class="btn send" style="margin-right: 5px;">Send</button>`).on("click", function () {
						const $btn = $(this);
						const $wrp = $btn.closest(`.wrp-message`);
						const toMsg = $wrp.find(`input[data-player-id]:checked`).filter(":visible").map((ii, e) => $(e).attr("data-player-id")).get();
						const content = $wrp.find(`.message`).val().trim();
						toMsg.forEach(targetId => {
							d20.textchat.doChatInput(`/w ${d20.Campaign.players.get(targetId).get("displayname").split(" ")[0]} ${content}`);

							// This only posts to local player's chat, sadly
							// d20.textchat.incoming(
							// 	false,
							// 	{
							// 		avatar: `/users/avatar/${window.currentPlayer.get("d20userid")}/30`,
							// 		who: d20.textchat.$speakingas.find("option:first-child").text(),
							// 		type: "whisper",
							// 		content: content,
							// 		playerid: window.currentPlayer.id,
							// 		id: d20plus.ut.generateRowId(),
							// 		target: targetId,
							// 		target_name: d20.Campaign.players.get(targetId).get("displayname") || ""
							// 	}
							// );
						})
					});

					const $btnClear =  $(`<button class="btn msg-clear">Clear</button>`).on("click", function () {
						$(this).closest(`.wrp-message`).find(`.message`).val("");
					});

					$pnlMessages.append($(`
							<div ${p.online || `style="display: none;"`} data-online="${p.online}" class="wrp-message">
								<div>
									${players.map((pp, ii) => `<label style="margin-right: 10px; ${pp.online || ` display: none;`}" data-online="${pp.online}" class="display-inline-block">${pp.displayname} <input data-player-id="${pp.id}" type="checkbox" ${i === ii ? `checked="true"` : ""}></label>`).join("")}
								</div>
								<textarea style="display: block; width: 95%;" placeholder="Enter whisper" class="message"></textarea>
							</div>						
						`).append($btnSend).append($btnClear).append(`<hr>`));
				});

				$btnToggleDc.on("click", () => {
					$btnToggleDc.text($btnToggleDc.text().startsWith("Show") ? "Hide Disconnected Players" : "Show Disconnected Players");
					$pnlMessages.find(`[data-online="false"]`).toggle();
				});

				$btnSendAll.on("click", () => {
					$pnlMessages.find(`button.send`).click();
				});

				$btnClearAll.on("click", () => $pnlMessages.find(`button.msg-clear`).click());
			}
		},
		{
			name: "Table Importer",
			desc: "Import TableExport data",
			html: `
				<div id="d20plus-tables" title="Table Importer">
					<div>
					<button class="btn paste-clipboard">Paste from Clipboard</button> <i>Accepts <a href="https://app.roll20.net/forum/post/1144568/script-tableexport-a-script-for-exporting-and-importing-rollable-tables-between-accounts">TableExport</a> format.</i>
					</div>
					<br>
					<div id="table-list">
						<input type="search" class="search" placeholder="Search tables...">
						<div class="list" style="transform: translateZ(0); max-height: 490px; overflow-y: scroll; overflow-x: hidden;"><i>Loading...</i></div>
					</div>
				<br>
				<button class="btn start-import">Import</button>
				</div>
				
				<div id="d20plus-tables-clipboard" title="Paste from Clipboard"/>
				`,
			dialogFn: () => {
				$("#d20plus-tables").dialog({
					autoOpen: false,
					resizable: true,
					width: 650,
					height: 720,
				});
				$(`#d20plus-tables-clipboard`).dialog({
					autoOpen: false,
					resizable: true,
					width: 640,
					height: 480,
				});
			},
			openFn: () => {
				const $win = $("#d20plus-tables");
				$win.dialog("open");

				const $btnImport = $win.find(`.start-import`).off("click");
				const $btnClipboard = $win.find(`.paste-clipboard`).off("click");

				const url = `${BASE_SITE_URL}/data/roll20-tables.json`;
				DataUtil.loadJSON(url).then((data) => {
					function createTable (t) {
						const r20t = d20.Campaign.rollabletables.create({
							name: t.name.replace(/\s+/g, "-"),
							showplayers: t.isShown,
							id: d20plus.ut.generateRowId()
						});

						r20t.tableitems.reset(t.items.map(i => {
							const out = {
								id: d20plus.ut.generateRowId(),
								name: i.row
							};
							if (i.weight !== undefined) out.weight = i.weight;
							if (i.avatar) out.avatar = i.avatar;
							return out;
						}));
						r20t.tableitems.forEach(it => it.save());
					}

					// Allow pasting of custom tables
					$btnClipboard.on("click", () => {
						const $wrpClip = $(`#d20plus-tables-clipboard`);
						const $iptClip = $(`<textarea placeholder="Paste TableExport data here" style="display: block; width: 600px; height: 340px;"/>`).appendTo($wrpClip);
						const $btnCheck = $(`<button class="btn" style="margin-right: 5px;">Check if Valid</button>`).on("click", () => {
							let error = false;
							try {
								getFromPaste($iptClip.val());
							} catch (e) {
								console.error(e);
								window.alert(e.message);
								error = true;
							}
							if (!error) window.alert("Looking good!");
						}).appendTo($wrpClip);
						const $btnImport = $(`<button class="btn">Import</button>`).on("click", () => {
							$("a.ui-tabs-anchor[href='#deckstables']").trigger("click");
							const ts = getFromPaste($iptClip.val());
							ts.forEach(t => createTable(t));
							window.alert("Import complete");
						}).appendTo($wrpClip);

						$wrpClip.dialog("open");
					});

					function getFromPaste (paste) {
						const tables = [];
						let tbl = null;

						paste.split("\n").forEach(line => parseLine(line.trim()));
						parseLine(""); // ensure trailing newline
						return tables;

						function parseLine (line) {
							if (line.startsWith("!import-table-item")) {
								if (!tbl) {
									throw new Error("No !import-table statement found");
								}
								const [junk, tblName, row, weight, avatar] = line.split("--").map(it => it.trim());
								tbl.items.push({
									row,
									weight,
									avatar
								})
							} else if (line.startsWith("!import-table")) {
								if (tbl) {
									throw new Error("No blank line found between tables")
								}
								const [junk, tblName, showHide] = line.split("--").map(it => it.trim());
								tbl = {
									name: tblName,
									isShown: (showHide || "").toLowerCase() === "show"
								};
								tbl.items = [];
							} else if (line.trim()) {
								throw new Error("Non-empty line which didn't match !import-table or !import-table-item")
							} else {
								if (tbl) {
									tables.push(tbl);
									tbl = null;
								}
							}
						}
					}

					// Official tables
					const $lst = $win.find(`.list`);
					const tables = data.table.sort((a, b) => SortUtil.ascSort(a.name, b.name));
					let tmp = "";
					tables.forEach((t, i) => {
						tmp += `
								<label class="import-cb-label" data-listid="${i}">
									<input type="checkbox">
									<span class="name col-10">${t.name}</span>
									<span title="${t.source ? Parser.sourceJsonToFull(t.source) : "Unknown Source"}" class="source">SRC[${t.source ? Parser.sourceJsonToAbv(t.source) : "UNK"}]</span>
								</label>
							`;
					});
					$lst.html(tmp);
					tmp = null;

					const tableList = new List("table-list", {
						valueNames: ["name", "source"]
					});

					$btnImport.on("click", () => {
						$("a.ui-tabs-anchor[href='#deckstables']").trigger("click");
						const sel = tableList.items
							.filter(it => $(it.elm).find(`input`).prop("checked"))
							.map(it => tables[$(it.elm).attr("data-listid")]);

						sel.forEach(t => createTable(t));
					});
				});
			}
		},
		{
			name: "Token Avatar URL Fixer",
			desc: "Change the root URL for tokens en-masse.",
			html: `
				<div id="d20plus-avatar-fixer" title="Avatar Fixer">
				<p><b>Warning:</b> this thing doesn't really work.</p>
				<p>Current URLs (view only): <select class="view-only"></select></p>
				<p><label>Replace:<br><input name="search" value="https://5etools.com/"></label></p>
				<p><label>With:<br><input name="replace" value="https://thegiddylimit.github.io/"></label></p>
				<p><button class="btn">Go!</button></p>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-avatar-fixer").dialog({
					autoOpen: false,
					resizable: true,
					width: 400,
					height: 400,
				});
			},
			openFn: () => {
				// FIXME this doesn't work, because it saves a nonsensical blob (imgsrc) instead of defaulttoken
				// see the working code in `initArtFromUrlButtons` for how this _should_ be done

				function replaceAll (str, search, replacement) {
					return str.split(search).join(replacement);
				}

				const $win = $("#d20plus-avatar-fixer");
				$win.dialog("open");

				const $selView = $win.find(`.view-only`);
				const toView = [];
				d20.Campaign.characters.toJSON().forEach(c => {
					if (c.avatar && c.avatar.trim()) {
						toView.push(c.avatar);
					}
				});
				toView.sort(SortUtil.ascSort).forEach(url => $selView.append(`<option disabled>${url}</option>`));

				const $btnGo = $win.find(`button`).off("click");
				$btnGo.on("click", () => {
					let count = 0;
					$("a.ui-tabs-anchor[href='#journal']").trigger("click");

					const search = $win.find(`[name="search"]`).val();
					const replace = $win.find(`[name="replace"]`).val();

					d20.Campaign.characters.toJSON().forEach(c => {
						const id = c.id;

						const realC = d20.Campaign.characters.get(id);

						const curr = realC.get("avatar");
						let toSave = false;
						if (curr.includes(search)) {
							count++;
							realC.set("avatar", replaceAll(curr, search, replace));
							toSave = true;
						}
						if (realC.get("defaulttoken")) {
							realC._getLatestBlob("defaulttoken", (bl) => {
								if (bl && bl.imgsrc && bl.imgsrc.includes(search)) {
									count++;
									realC.updateBlobs({imgsrc: replaceAll(bl.imgsrc, search, replace)});
									toSave = true;
								}
							});
						}
						if (toSave) {
							realC.save();
						}
					});
					window.alert(`Replaced ${count} item${count === 0 || count > 1 ? "s" : ""}.`)
				});
			}
		},
		{
			name: "Mass-Delete Pages",
			desc: "Quickly delete multiple pages.",
			html: `
				<div id="d20plus-mass-page-delete" title="Mass-Delete Pages">
					<div id="del-pages-list">
						<div class="list" style="transform: translateZ(0); max-height: 490px; overflow-y: scroll; overflow-x: hidden; margin-bottom: 10px;"><i>Loading...</i></div>
					</div>
					<hr>
					<p><label class="ib"><input type="checkbox" class="select-all"> Select All</label> | <button class="btn btn-danger deleter">Delete</button></p>
					<p><i>This tool will delete neither your active page, nor a page active for players.</i></p>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-mass-page-delete").dialog({
					autoOpen: false,
					resizable: true,
					width: 600,
					height: 800,
				});
			},
			openFn: () => {
				function deletePage (model, pageList) {
					if ($("#page-toolbar .availablepage[data-pageid=" + model.id + "]").remove()) {
						var n = d20.Campaign.getPageIndex(model.id);
						if (model.thegraphics) {
							model.thegraphics.massdelete = true;
							model.thegraphics.backboneFirebase.reference.set(null);
						}
						if (model.thetexts) {
							model.thetexts.massdelete = true;
							model.thetexts.backboneFirebase.reference.set(null);
						}
						if (model.thepaths) {
							model.thepaths.backboneFirebase.reference.set(null);
							model.thepaths.massdelete = true;
						}
						let i = d20.Campaign.get("playerspecificpages");
						let o = false;
						_.each(i, function(e, n) {
							if (e === model.id) {
								delete i[n];
								o = true;
							}
						});
						o && d20.Campaign.save({
							playerspecificpages: i
						});
						model.destroy();
						d20.Campaign.activePageIndex > n && (d20.Campaign.activePageIndex -= 1);

						pageList.remove("page-id", model.id);
					}
				}

				const $win = $("#d20plus-mass-page-delete");
				$win.dialog("open");

				const $lst = $win.find(`.list`).empty();

				d20.Campaign.pages.models.forEach(m => {
					$lst.append(`
							<label class="import-cb-label import-cb-label--img" data-listid="${m.id}">
								<input type="checkbox">
								<img class="import-label__img" src="${m.attributes.thumbnail}">
								<span class="name col-9">${m.attributes.name}</span>
								<span style="display: none;" class="page-id">${m.id}</span>
							</label>
						`);
				});

				const pageList = new List("del-pages-list", {
					valueNames: ["name", "page-id"]
				});

				const $cbAll = $win.find(`.select-all`).off("click").click(() => {
					pageList.items.forEach(it => {
						$(it.elm).find(`input[type="checkbox"]`).prop("checked", $cbAll.prop("checked"));
					});
				});

				const $btnDel = $win.find(`.deleter`).off("click").click(() => {
					const sel = pageList.items
						.filter(it => $(it.elm).find(`input`).prop("checked"))
						.map(it => $(it.elm).attr("data-listid"))
						.map(pId => d20.Campaign.pages.models.find(it => it.id === pId))
						.filter(it => it);

					sel.forEach(m => {
						if (m.id !== d20.Campaign.get("playerpageid") && m.id !== d20.Campaign.activePage().id) {
							deletePage(m, pageList);
						}
					});
					$cbAll.prop("checked", false);
				});
			}
		},
		{
			name: "Quantum Token Entangler",
			desc: "Connect tokens between pages, linking their positions.",
			html: `
				<div id="d20plus-token-entangle" title="Quantum Token Entangler">
					<p><i>Please note that this feature is highly experimental.
					<br>
					You can learn Token IDs by rightclicking a token -> "Advanced" -> "View Token ID."</i></p>
					<hr>
					<input id="token-entangle-id-1" placeholder="Master ID">
					Type: 
					<select id="token-entangle-type-1">
						<option value="0">Token</option>
						<option value="1">Path</option>
					</select>
					<br>
					<input id="token-entangle-id-2" placeholder="Slave ID">
					Type:  
					<select id="token-entangle-type-2">
						<option value="0">Token</option>
						<option value="1">Path</option>
					</select>
					<br>
					<button class="btn btn-default" id="token-entangle-go">Entangle</button>
					<hr>
					<input id="token-clear-entangles" placeholder="ID to Clear">
					Type:  
					<select id="token-clear-type">
						<option value="0">Token</option>
						<option value="1">Path</option>
					</select>
					<button class="btn btn-default" id="token-entangle-clear">Clear Entangles</button>
				</div>
				`,
			dialogFn: () => {
				const $win = $("#d20plus-token-entangle");

				const entangleTracker = {};
				const ALLOWED_TYPES = ["path", "image"];
				const SYNCABLE_ATTRS_IMAGE = [
					"rotation",
					"width",
					"height",
					"top",
					"left",
					"scaleX",
					"scaleY",
					"fliph",
					"flipv"
				];
				const SYNCABLE_ATTRS_PATH = [
					"rotation",
					"top",
					"left",
					"scaleX",
					"scaleY"
				];

				$win.data("VE_DO_ENTANGLE", (master) => {
					if (!ALLOWED_TYPES.includes(master.attributes.type)) return;

					// prevent double-binding
					if (entangleTracker[master.id]) return;

					const TO_SYNC = master.attributes.type === "image" ? SYNCABLE_ATTRS_IMAGE : SYNCABLE_ATTRS_PATH;

					master.on("change", (it) => {
						let anyUpdates = false;

						if (master.attributes.entangledImages && master.attributes.entangledImages.length) {
							if (TO_SYNC.filter(attr => it.changed[attr] !== undefined).length) {
								master.attributes.entangledImages = master.attributes.entangledImages.filter(id => {
									const slave = d20plus.ut.getTokenById(id);
									const SLAVE_ATTRS = slave.attributes.type === "image" ? SYNCABLE_ATTRS_IMAGE : SYNCABLE_ATTRS_PATH;
									if (slave) {
										TO_SYNC
											.filter(attr => SLAVE_ATTRS.includes(attr))
											.filter(attr => master.attributes[attr] != null)
											.forEach(attr => slave.attributes[attr] = master.attributes[attr]);
										slave.save();
										return true;
									} else {
										console.warn(`Cound not find entangled token with ID "${id}", removing...`);
										anyUpdates = true;
									}
								});

							}
						}

						if (master.attributes.entangledPaths && master.attributes.entangledPaths.length) {
							if (TO_SYNC.filter(attr => it.changed[attr] !== undefined).length) {
								master.attributes.entangledPaths = master.attributes.entangledPaths.filter(id => {
									const slave = d20plus.ut.getPathById(id);
									const SLAVE_ATTRS = slave.attributes.type === "image" ? SYNCABLE_ATTRS_IMAGE : SYNCABLE_ATTRS_PATH;
									if (slave) {
										TO_SYNC
											.filter(attr => SLAVE_ATTRS.includes(attr))
											.filter(attr => master.attributes[attr] != null)
											.forEach(attr => slave.attributes[attr] = master.attributes[attr]);
										slave.save();
										return true;
									} else {
										console.warn(`Cound not find entangled path with ID "${id}", removing...`);
										anyUpdates = true;
									}
								});
							}
						}

						if (anyUpdates) master.save();
					})
				});

				// do initial entangles
				const runInitial = () => {
					const pages = d20.Campaign.pages;
					if (pages && pages.models) {
						d20plus.ut.log("Initialisng existing entangles...");
						d20.Campaign.pages.models
							.forEach(model => {
								const PROPS = {
									thegraphics: "entangledImages",
									thepaths: "entangledPaths"
								};
								Object.keys(PROPS).forEach(prop => {
									Object.values(PROPS).forEach(attrK => {
										if (model[prop] && model[prop].models) {
											model[prop].models.filter(it => it.attributes[attrK] && it.attributes[attrK].length).forEach(it => {
												$win.data("VE_DO_ENTANGLE")(it);
											})
										}
									});
								});
							});
					} else {
						console.log("Pages uninitialised, waiting...");
						setTimeout(runInitial, 1000);
					}
				};

				runInitial();

				$win.dialog({
					autoOpen: false,
					resizable: true,
					width: 800,
					height: 400,
				});
			},
			openFn: () => {
				const ATTR_PROPS = ["entangledImages", "entangledPaths"];

				const notFound = (id, type) => alert(`${type === "image" ? "Token" : "Path"} with ID ${id} didn't exist!`);

				const $win = $("#d20plus-token-entangle");
				$win.dialog("open");

				const $ipt1 = $(`#token-entangle-id-1`);
				const $ipt2 = $(`#token-entangle-id-2`);
				const $selType1 = $(`#token-entangle-type-1`);
				const $selType2 = $(`#token-entangle-type-2`);

				const $btnGo = $(`#token-entangle-go`)
					.off("click")
					.click(() => {
						const id1 = $ipt1.val();
						const id2 = $ipt2.val();
						const checkExisting = (a, b) => {
							const _check = (p, q) => ATTR_PROPS.some(prop => p.attributes[prop] && a.attributes[prop].includes(q.id));

							if (_check(a, b)) return `"${a.id}" is already entangled to "${b.id}"!`;
							if (_check(b, a)) return `"${b.id}" is already entangled to "${a.id}"!`;
							return false;
						};

						const entity1 = $selType1.val() === "0" ? d20plus.ut.getTokenById(id1) : d20plus.ut.getPathById(id1);
						const entity2 = $selType2.val() === "0" ? d20plus.ut.getTokenById(id2) : d20plus.ut.getPathById(id2);

						if (!entity1) return notFound(id1, $selType1.val() === "0" ? "image" : "path");
						if (!entity2) return notFound(id2, $selType2.val() === "0" ? "image" : "path");

						const existing = checkExisting(entity1, entity2);
						if (existing) return alert(existing);

						const prop1 = entity2.attributes.type === "image" ? "entangledImages" : "entangledPaths";
						const prop2 = entity1.attributes.type === "image" ? "entangledImages" : "entangledPaths";

						(entity1.attributes[prop1] = entity1.attributes[prop1] || []).push(id2);
						entity1.save();
						(entity2.attributes[prop2] = entity2.attributes[prop2] || []).push(id1);
						entity2.save();

						$win.data("VE_DO_ENTANGLE")(entity1);
						$win.data("VE_DO_ENTANGLE")(entity2);
						alert("Entangled!");
					});

				const $iptClear = $(`#token-clear-entangles`);

				const $selTypeClear = $(`#token-clear-type`);

				const $btnClear = $(`#token-entangle-clear`)
					.off("click")
					.click(() => {
						const id = $iptClear.val();
						const entity = $selTypeClear.val() === "0" ? d20plus.ut.getTokenById(id) : d20plus.ut.getPathById(id);
						if (!entity) return notFound(id, $selTypeClear.val() === "0" ? "image" : "path");

						const count = (entity.attributes.entangledImages ? entity.attributes.entangledImages.length : 0) + (entity.attributes.entangledPaths ? entity.attributes.entangledPaths.length : 0);

						(entity.attributes.entangledImages || []).forEach(eId => {
							const ent = d20plus.ut.getTokenById(eId);
							if (ent && ent.attributes.entangledImages && ent.attributes.entangledImages.includes(id)) {
								ent.attributes.entangledImages.splice(ent.attributes.entangledImages.indexOf(id), 1);
								ent.save();
							}
						});

						(entity.attributes.entangledPaths || []).forEach(eId => {
							const ent = d20plus.ut.getPathById(eId);
							if (ent && ent.attributes.entangledPaths && ent.attributes.entangledPaths.includes(id)) {
								ent.attributes.entangledPaths.splice(ent.attributes.entangledPaths.indexOf(id), 1);
								ent.save();
							}
						});

						entity.attributes.entangledImages = [];
						entity.attributes.entangledPaths = [];
						entity.save();
						alert(`${count} entangle${count === 1 ? "" : "s"} cleared.`);
					});
			}
		}
	];

	d20plus.tool.get = (toolId) => {
		return d20plus.tool.tools.find(it => it.toolId === toolId);
	};

	d20plus.tool.addTools = () => {
		const $body = $(`body`);
		const $tools = $(`#d20-tools-list`);
		const $toolsList = $tools.find(`.tools-list`);
		d20plus.tool.tools.sort((a, b) => SortUtil.ascSortLower(a.name || "", b.name || "")).forEach(t => {
			$body.append(t.html); // add HTML
			try {
				t.dialogFn(); // init window
				// add tool row
				const $wrp = $(`<div class="tool-row"/>`);
				$wrp.append(`<span style="width: 20%; padding: 4px;">${t.name}</span>`);
				$wrp.append(`<span style="width: calc(60% - 8px); padding: 4px;">${t.desc}</span>`);
				$(`<a style="width: 15%;" class="btn" href="#">Open</a>`).on(mousedowntype, () => {
					t.openFn.bind(t)();
					$tools.dialog("close");
				}).appendTo($wrp);
				$toolsList.append($wrp);
			} catch (e) {
				console.error(`Failed to initialise tool "${t.name}"`);
				setTimeout(() => {
					throw e;
				}, 1);
			}
		});

		$tools.dialog({
			autoOpen: false,
			resizable: true,
			width: 800,
			height: 650,
		});
		$(`#button-view-tools`).on(mousedowntype, () => {
			$tools.dialog("open");
		});
	};
}

SCRIPT_EXTENSIONS.push(baseTool);


function baseToolModule () {
	d20plus.tool.tools.push({
		toolId: "MODULES",
		name: "Module Importer/Exporter",
		desc: "Import full games (modules), or import/export custom games",
		html: `
				<div id="d20plus-module-importer" title="Module Importer/Exporter">
				<p style="margin-bottom: 4px;"><b style="font-size: 110%;">Exporter: </b> <button class="btn" name="export">Export Game to File</button> <i>The exported file can later be used with the "Upload File" option, below.</i></p>
				<hr style="margin: 4px;">
				<p style="margin-bottom: 4px;">
					<b style="font-size: 110%;">Importer:</b>
					<button class="btn readme" style="float: right;">Help/README</button>
					<div style="clear: both;"></div>
				</p>
				<div style="border-bottom: 1px solid #ccc; margin-bottom: 3px; padding-bottom: 3px;">
					<button class="btn" name="load-Vetools">Load from 5etools</button>
					<button class="btn" name="load-file">Upload File</button>
				</div>
				<div>
					<div name="data-loading-message"></div>
					<select name="data-type" disabled style="margin-bottom: 0;">
						<option value="characters">Characters</option>
						<option value="decks">Decks</option>
						<option value="handouts">Handouts</option>
						<option value="playlists">Jukebox Playlists</option>
						<option value="tracks">Jukebox Tracks</option>
						<option value="maps">Maps</option>
						<option value="rolltables">Rollable Tables</option>
					</select>
					<button class="btn" name="view-select-entries">View/Select Entries</button>
					<br>
					<button class="btn" name="select-all-entries">Select Everything</button>
					<div name="selection-summary" style="margin-top: 5px;"></div>
				</div>
				<hr>
				<p><button class="btn" style="float: right;" name="import">Import Selected</button></p>
				</div>
				
				<div id="d20plus-module-importer-list" title="Select Entries">					
					<div id="module-importer-list">
						<input type="search" class="search" placeholder="Search..." disabled>
						<div class="list" style="transform: translateZ(0); max-height: 650px; overflow-y: auto; overflow-x: hidden; margin-bottom: 10px;">
						<i>Load a file to view the contents here</i>
						</div>
					</div>
					<div>
						<label class="ib"><input type="checkbox" class="select-all"> Select All</label>
						<button class="btn" style="float: right;" name="confirm-selection">Confirm Selection</button>
					</div>
				</div>
				
				<div id="d20plus-module-importer-progress" title="Import Progress">					
					<h3 class="name"></h3>
					<span class="remaining"></span> 
					<p>Errors: <span class="errors">0</span> <span class="error-names"></span></p>
					<p><button class="btn cancel">Cancel</button></p>
				</div>
				
				<div id="d20plus-module-importer-help" title="Readme">
					<p>First, either load a module from 5etools, or upload one from a file. Then, choose the category you wish to import, and "View/Select Entries." Once you've selected everything you wish to import from the module, hit "Import Selected." This ensures entries are imported in the correct order.</p>
					<p><b>Note:</b> The script-wide configurable "rest time" options affect how quickly each category of entries is imported (tables and decks use the "Handout" rest time).</p>
					<p><b>Note:</b> Configuration options (aside from "rest time" as detailed above) <i>do not</i> affect the module importer. It effectively "clones" the content as-exported from the original module, including any whisper/advantage/etc settings.</p>
				</div>
				
				<div id="d20plus-module-importer-5etools" title="Select Module">
					<div id="module-importer-list-5etools">
						<input type="search" class="search" placeholder="Search modules...">
						<div>
							<div style="display: inline-block; width: 13px; height: 1px;"></div>
							<div class="col-5 col">Name</div>
							<div class="col-1 col" style="text-align: center;">Version</div>
							<div class="col-2 col" style="text-align: center;">Last Modified</div>
							<div class="col-1 col" style="text-align: center;">Size</div>
							<div class="col-2 col" style="text-align: center;">Source</div>
						</div>
						<div class="list" style="transform: translateZ(0); max-height: 480px; overflow-y: auto; overflow-x: hidden; margin-bottom: 10px;">
						<i>Loading...</i>
						</div>
					</div>
					<p><button class="btn load">Load Module Data</button></p>
				</div>
				
				<div id="d20plus-module-importer-select-exports-p1" title="Select Categories to Export">
					<div>
						<label>Characters <input type="checkbox" class="float-right" name="cb-characters"></label>
						<label>Decks <input type="checkbox" class="float-right" name="cb-decks"></label>
						<label>Handouts <input type="checkbox" class="float-right" name="cb-handouts"></label>
						<label>Jukebox Playlists <input type="checkbox" class="float-right" name="cb-playlists"></label>
						<label>Jukebox Tracks <input type="checkbox" class="float-right" name="cb-tracks"></label>
						<label>Maps <input type="checkbox" class="float-right" name="cb-maps"></label>
						<label>Rollable Tables <input type="checkbox" class="float-right" name="cb-rolltables"></label>
					</div>
					<div class="clear" style="width: 100%; border-bottom: #ccc solid 1px;"></div>
					<p style="margin-top: 5px;"><label>Select All <input type="checkbox" class="float-right" name="cb-all"></label></p>
					<p><button class="btn">Export</button></p>
				</div>
				`,
		dialogFn: () => {
			$("#d20plus-module-importer").dialog({
				autoOpen: false,
				resizable: true,
				width: 750,
				height: 360,
			});
			$(`#d20plus-module-importer-progress`).dialog({
				autoOpen: false,
				resizable: false
			});
			$("#d20plus-module-importer-5etools").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});
			$("#d20plus-module-importer-help").dialog({
				autoOpen: false,
				resizable: true,
				width: 600,
				height: 400,
			});
			$("#d20plus-module-importer-select-exports-p1").dialog({
				autoOpen: false,
				resizable: true,
				width: 400,
				height: 275,
			});
			$("#d20plus-module-importer-list").dialog({
				autoOpen: false,
				resizable: true,
				width: 600,
				height: 800,
			});
		},
		openFn: () => {
			const DISPLAY_NAMES = {
				maps: "Maps",
				rolltables: "Rollable Tables",
				decks: "Decks",
				handouts: "Handouts",
				playlists: "Jukebox Playlists",
				tracks: "Jukebox Tracks",
				characters: "Characters",
			};

			const $win = $("#d20plus-module-importer");
			$win.dialog("open");

			const $winProgress = $(`#d20plus-module-importer-progress`);
			const $btnCancel = $winProgress.find(".cancel").off("click");

			const $win5etools = $(`#d20plus-module-importer-5etools`);

			const $winHelp = $(`#d20plus-module-importer-help`);
			const $btnHelp = $win.find(`.readme`).off("click").click(() => $winHelp.dialog("open"));

			const $winList = $(`#d20plus-module-importer-list`);
			const $wrpLst = $(`#module-importer-list`);
			const $lst = $winList.find(`.list`).empty();
			const $cbAll = $winList.find(`.select-all`).off("click").prop("disabled", true);
			const $iptSearch = $winList.find(`.search`).prop("disabled", true);
			const $btnConfirmSel = $winList.find(`[name="confirm-selection"]`).off("click");

			const $wrpSummary = $win.find(`[name="selection-summary"]`);
			const $wrpDataLoadingMessage = $win.find(`[name="data-loading-message"]`);

			const $btnImport = $win.find(`[name="import"]`).off("click").prop("disabled", true);
			const $btnViewCat = $win.find(`[name="view-select-entries"]`).off("click").prop("disabled", true);
			const $btnSelAllContent = $win.find(`[name="select-all-entries"]`).off("click").prop("disabled", true);

			const $selDataType = $win.find(`[name="data-type"]`).prop("disabled", true);
			let lastDataType = $selDataType.val();
			let genericFolder;
			let lastLoadedData = null;

			const getFreshSelected = () => ({
				characters: [],
				decks: [],
				handouts: [],
				maps: [],
				playlists: [],
				tracks: [],
				rolltables: []
			});

			let selected = getFreshSelected();

			function handleLoadedData (data) {
				lastLoadedData = data;
				selected = getFreshSelected();
				$selDataType.prop("disabled", false);

				function updateSummary () {
					$wrpSummary.text(Object.entries(selected).filter(([prop, ents]) => ents && ents.length).map(([prop, ents]) => `${DISPLAY_NAMES[prop]}: ${ents.length} selected`).join("; "));
				}

				$btnViewCat.prop("disabled", false);
				$btnViewCat.off("click").click(() => {
					$winList.dialog("open");
					$iptSearch.prop("disabled", false);

					let prop = "";
					switch (lastDataType) {
						case "rolltables":
						case "decks":
						case "playlists":
						case "tracks":
						case "maps": {
							prop = lastDataType;
							break;
						}
						case "handouts": {
							prop = "handouts";
							genericFolder = d20plus.journal.makeDirTree(`Handouts`);
							break;
						}
						case "characters": {
							prop = "characters";
							genericFolder = d20plus.journal.makeDirTree(`Characters`);
							break;
						}
						default: throw new Error(`Unhandled data type: ${lastDataType}`);
					}

					const moduleData = data[prop] || [];
					moduleData.sort((a, b) => SortUtil.ascSortLower(
						(a.attributes && a.attributes.name) || a.name || a.title || "",
						(b.attributes && a.attributes.name) || a.name || b.title || ""
					));

					$lst.empty();
					moduleData.forEach((m, i) => {
						const img = lastDataType === "maps" ? m.attributes.thumbnail :
							(lastDataType === "characters" || lastDataType === "handouts" || lastDataType === "decks") ? m.attributes.avatar : "";

						$lst.append(`
									<label class="import-cb-label ${img ? `import-cb-label--img` : ""}" data-listid="${i}">
										<input type="checkbox">
										${img && img.trim() ? `<img class="import-label__img" src="${img}">` : ""}
										<span class="name col-9 readable">${(m.attributes && m.attributes.name) || m.name || m.title || ""}</span>
									</label>
								`);
					});

					const entryList = new List("module-importer-list", {
						valueNames: ["name"]
					});

					$cbAll.prop("disabled", false).off("click").click(() => {
						entryList.items.forEach(it => {
							$(it.elm).find(`input[type="checkbox"]`).prop("checked", $cbAll.prop("checked"));
						});
					});

					$btnConfirmSel.off("click").click(() => {
						const sel = entryList.items
							.filter(it => $(it.elm).find(`input`).prop("checked"))
							.map(it => moduleData[$(it.elm).attr("data-listid")]);

						$cbAll.prop("checked", false);
						$winList.dialog("close");
						selected[prop] = sel;
						updateSummary();
					});
				});

				$btnSelAllContent.prop("disabled", false);
				$btnSelAllContent.off("click").click(() => {
					Object.keys(selected).forEach(k => {
						selected[k] = data[k];
						updateSummary();
					});
				});

				$btnImport.prop("disabled", false).off("click").click(() => {
					const totalSelected = Object.values(selected).map(it => it ? it.length : 0).reduce((a, b) => a + b, 0);
					if (!totalSelected) return alert("No entries selected!");

					const $name = $winProgress.find(`.name`);
					const $remain = $winProgress.find(`.remaining`).text(`${totalSelected} remaining...`);
					const $errCount = $winProgress.find(`.errors`);
					const $errReasons = $winProgress.find(`.error-names`);
					let errCount = 0;

					$winProgress.dialog("open");

					const journal = data.journal ? MiscUtil.copy(data.journal).reverse() : null;

					let queue = [];
					let jukebox = {};
					Object.entries(selected).filter(([k, v]) => v && v.length).forEach(([prop, ents]) => {
						if (prop === "playlists") return jukebox.playlists = (jukebox.playlists || []).concat(ents);
						else if (prop === "tracks") return jukebox.tracks = (jukebox.tracks || []).concat(ents);

						ents = MiscUtil.copy(ents);

						// if importing journal items, make sure they get put back in the right order
						if (journal && (prop === "characters" || prop === "handouts")) {
							const nuQueue = [];

							journal.forEach(jIt => {
								const qIx = ents.findIndex(qIt => qIt.attributes.id === jIt.id);
								if (~qIx) nuQueue.push(ents.splice(qIx, 1)[0]);
							});
							ents.forEach(qIt => nuQueue.push(qIt)); // add anything that wasn't in the journal to the end of the queue
							ents = nuQueue;
						}

						const toAdd = ents.map(entry => ({entry, prop}));
						// do maps first
						if (prop === "maps") queue = toAdd.concat(queue);
						else queue = queue.concat(toAdd);
					});

					// reset the tool
					selected = getFreshSelected();
					$wrpSummary.text("");

					let isCancelled = false;
					let lastTimeout = null;
					$btnCancel.off("click").click(() => {
						isCancelled = true;
						if (lastTimeout != null) {
							clearTimeout(lastTimeout);
							doImport();
						}
					});
					const mapTimeout = d20plus.cfg.get("import", "importIntervalMap") || d20plus.cfg.getDefault("import", "importIntervalMap");
					const charTimeout = d20plus.cfg.get("import", "importIntervalCharacter") || d20plus.cfg.getDefault("import", "importIntervalCharacter");
					const handoutTimeout = d20plus.cfg.get("import", "importIntervalHandout") || d20plus.cfg.getDefault("import", "importIntervalHandout");
					const timeouts = {
						characters: charTimeout,
						decks: handoutTimeout,
						handouts: handoutTimeout,
						playlists: 0,
						tracks: 0,
						maps: mapTimeout,
						rolltables: handoutTimeout
					};

					const addToJournal = (originalId, itId) => {
						let handled = false;
						if (journal) {
							const found = journal.find(it => it.id === originalId);
							if (found) {
								const rawPath = found.path;
								const cleanPath = rawPath.slice(1); // paths start with "Root"
								const folder = d20plus.journal.makeDirTree(...cleanPath);
								d20.journal.addItemToFolderStructure(itId, folder.id);
								handled = true;
							}
						}

						if (!handled) d20.journal.addItemToFolderStructure(itId, genericFolder.id);
					};

					const doImport = () => {
						if (isCancelled) {
							$name.text("Import cancelled.");
							$remain.text(`Cancelled with ${queue.length} remaining.`);
						} else if (queue.length && !isCancelled) {
							$remain.text(`${queue.length} remaining...`);
							const {entry, prop} = queue.shift();
							const timeout = timeouts[prop];
							const name = entry.attributes.name;
							try {
								$name.text(`Importing ${name}`);

								switch (prop) {
									case "maps": {
										const map = d20.Campaign.pages.create(entry.attributes);
										entry.graphics.forEach(it => map.thegraphics.create(it));
										entry.paths.forEach(it => map.thepaths.create(it));
										entry.text.forEach(it => map.thetexts.create(it));
										map.save();
										break;
									}
									case "rolltables": {
										const table = d20.Campaign.rollabletables.create(entry.attributes);
										table.tableitems.reset();
										const toSave = entry.tableitems.map(it => table.tableitems.push(it));
										toSave.forEach(s => s.save());
										table.save();
										break;
									}
									case "decks": {
										const deck = d20.Campaign.decks.create(entry.attributes);
										deck.cards.reset();
										const toSave = entry.cards.map(it => deck.cards.push(it));
										toSave.forEach(s => s.save());
										deck.save();
										break;
									}
									case "handouts": {
										d20.Campaign.handouts.create(entry.attributes,
											{
												success: function (handout) {
													handout.updateBlobs({
														notes: entry.blobNotes,
														gmnotes: entry.blobGmNotes
													});

													addToJournal(entry.attributes.id, handout.id);
												}
											}
										);
										break;
									}
									case "characters": {
										d20.Campaign.characters.create(entry.attributes,
											{
												success: function (character) {
													character.attribs.reset();
													const toSave = entry.attribs.map(a => character.attribs.push(a));
													toSave.forEach(s => s.syncedSave());

													character.abilities.reset();
													if (entry.abilities) entry.abilities.map(a => character.abilities.push(a)).forEach(s => s.save());

													character.updateBlobs({
														bio: entry.blobBio,
														gmnotes: entry.blobGmNotes,
														defaulttoken: entry.blobDefaultToken
													});

													addToJournal(entry.attributes.id, character.id);
												}
											}
										);
										break;
									}
									default: throw new Error(`Unhandled data type: ${prop}`);
								}
							} catch (e) {
								console.error(e);

								errCount++;
								$errCount.text(errCount);
								const prevReasons = $errReasons.text().trim();
								$errReasons.append(`${prevReasons.length ? ", " : ""}${name}: "${e.message}"`)
							}

							// queue up the next import
							lastTimeout = setTimeout(doImport, timeout);
						} else {
							$name.text("Import complete!");
							$remain.text(`${queue.length} remaining.`);
						}
					};

					if (Object.keys(jukebox).length) d20plus.jukebox.importWrappedData(jukebox);
					doImport();
				});
			}

			$selDataType.off("change").on("change", () => {
				lastDataType = $selDataType.val();
			});

			const $btnLoadVetools = $win.find(`[name="load-Vetools"]`);
			$btnLoadVetools.off("click").click(() => {
				$win5etools.dialog("open");
				const $btnLoad = $win5etools.find(`.load`).off("click");

				DataUtil.loadJSON(`${DATA_URL}roll20-module/roll20-module-index.json`).then(data => {
					const $lst = $win5etools.find(`.list`);
					const modules = data.map.sort((a, b) => SortUtil.ascSortLower(a.name, b.name));
					let tmp = "";
					modules.forEach((t, i) => {
						tmp += `
								<label class="import-cb-label" data-listid="${i}">
									<input type="radio" name="map-5etools">
									<span class="name col-5 readable">${t.name}</span>
									<span class="version col-1 readable" style="text-align: center;">${t.version || ""}</span>
									<span class="lat-modified col-2 readable" style="text-align: center;">${t.dateLastModified ? MiscUtil.dateToStr(new Date(t.dateLastModified * 1000), true) : ""}</span>
									<span class="size col-1 readable" style="text-align: right;">${d20plus.ut.getReadableFileSizeString(t.size)}</span>
									<span title="${Parser.sourceJsonToFull(t.id)}" class="source readable" style="text-align: right;">SRC[${Parser.sourceJsonToAbv(t.id)}]</span>
								</label>
							`;
					});
					$lst.html(tmp);
					tmp = null;

					const list5etools = new List("module-importer-list-5etools", {
						valueNames: ["name"]
					});

					$btnLoad.on("click", () => {
						const sel = list5etools.items
							.filter(it => $(it.elm).find(`input`).prop("checked"))
							.map(it => modules[$(it.elm).attr("data-listid")])[0];

						$win5etools.dialog("close");
						$win.dialog("open");
						$wrpDataLoadingMessage.html("<i>Loading...</i>");
						DataUtil.loadJSON(`${DATA_URL}roll20-module/roll20-module-${sel.id.toLowerCase()}.json`)
							.then(moduleFile => {
								$wrpDataLoadingMessage.html("");
								return handleLoadedData(moduleFile);
							})
							.catch(e => {
								$wrpDataLoadingMessage.html("");
								console.error(e);
								alert(`Failed to load data! See the console for more information.`);
							});
					});
				}).catch(e => {
					console.error(e);
					alert(`Failed to load data! See the console for more information.`);
				});
			});

			const $btnLoadFile = $win.find(`[name="load-file"]`);
			$btnLoadFile.off("click").click(async () => {
				const data = await DataUtil.pUserUpload();
				handleLoadedData(data);
			});

			const $winExportP1 = $("#d20plus-module-importer-select-exports-p1");
			const $cbAllExport = $winExportP1.find(`[name="cb-all"]`);

			const $btnExport = $win.find(`[name="export"]`);
			$btnExport.off("click").click(() => {
				const CATS = [
					"characters",
					"decks",
					"handouts",
					"playlists",
					"tracks",
					"maps",
					"rolltables",
				];

				$winExportP1.dialog("open");

				$cbAllExport.off("change").on("change", () => {
					CATS.forEach(cat => $winExportP1.find(`input[name="cb-${cat}"]`).prop("checked", $cbAllExport.prop("checked")))
				});

				$winExportP1.find("button").off("click").click(async () => {
					const isCatSelected = (name) => $winExportP1.find(`input[name="cb-${name}"]`).prop("checked");

					const catsToExport = new Set(CATS.filter(it => isCatSelected(it)));

					console.log("Exporting journal...");
					const journal = d20plus.journal.getExportableJournal();

					let maps;
					if (catsToExport.has("maps")) {
						console.log("Exporting maps..."); // shoutouts to Stormy
						maps = await Promise.all(d20.Campaign.pages.models.map(async map => {
							const getOut = () => {
								return {
									attributes: map.attributes,
									graphics: (map.thegraphics || []).map(g => g.attributes),
									text: (map.thetexts || []).map(t => t.attributes),
									paths: (map.thepaths || []).map(p => p.attributes)
								};
							};

							if (map.get("archived")) {
								map.set({archived: false});
								await d20plus.ut.promiseDelay(d20plus.cfg.getOrDefault("import", "importIntervalHandout") * 2);
								const out = getOut();
								map.set({archived: true});
								return out;
							} else {
								return getOut();
							}
						}));
					}

					let rolltables;
					if (catsToExport.has("rolltables")) {
						console.log("Exporting rolltables...");
						rolltables = d20.Campaign.rollabletables.models.map(rolltable => ({
							attributes: rolltable.attributes,
							tableitems: (rolltable.tableitems.models || []).map(tableitem => tableitem.attributes)
						}));
					}

					let decks;
					if (catsToExport.has("decks")) {
						console.log("Exporting decks...");
						decks = d20.Campaign.decks.models.map(deck => {
							if (deck.name && deck.name.toLowerCase() === "playing cards") return;
							return {
								attributes: deck.attributes,
								cards: (deck.cards.models || []).map(card => card.attributes)
							};
						}).filter(it => it);
					}

					let playlists;
					if (catsToExport.has("playlists")) {
						console.log("Exporting jukebox playlists...");
						playlists = d20plus.jukebox.getExportablePlaylists();
					}

					let tracks;
					if (catsToExport.has("tracks")) {
						console.log("Exporting jukebox tracks...");
						tracks = d20plus.jukebox.getExportableTracks();
					}

					let blobCount = 0;
					let onBlobsReady = null;
					let anyBlobs = false;

					const handleBlob = (addTo, asKey, data) => {
						addTo[asKey] = data;
						blobCount--;
						if (onBlobsReady && blobCount === 0) onBlobsReady();
					};

					let characters;
					if (catsToExport.has("characters")) {
						anyBlobs = true;
						console.log("Exporting characters...");
						characters = d20.Campaign.characters.models.map(character => {
							const out = {
								attributes: character.attributes,
								attribs: character.attribs,
							};
							const abilities = (character.abilities || {models: []}).models.map(ability => ability.attributes);
							if (abilities && abilities.length) out.abilities = abilities;
							blobCount += 3;
							character._getLatestBlob("bio", (data) => handleBlob(out, "blobBio", data));
							character._getLatestBlob("gmnotes", (data) => handleBlob(out, "blobGmNotes", data));
							character._getLatestBlob("defaulttoken", (data) => handleBlob(out, "blobDefaultToken", data));
							return out;
						});
					}

					let handouts;
					if (catsToExport.has("handouts")) {
						anyBlobs = true;
						console.log("Exporting handouts...");
						handouts = d20.Campaign.handouts.models.map(handout => {
							if (handout.attributes.name === ART_HANDOUT || handout.attributes.name === CONFIG_HANDOUT) return;

							const out = {
								attributes: handout.attributes
							};
							blobCount += 2;
							handout._getLatestBlob("notes", (data) => handleBlob(out, "blobNotes", data));
							handout._getLatestBlob("gmnotes", (data) => handleBlob(out, "blobGmNotes", data));
							return out;
						}).filter(it => it);
					}

					if (anyBlobs) console.log("Waiting for blobs...");
					onBlobsReady = () => {
						if (anyBlobs) console.log("Blobs are ready!");

						console.log("Preparing payload");

						const payload = {
							schema_version: 1, // version number from r20es
						};
						if (maps) payload.maps = maps;
						if (rolltables) payload.rolltables = rolltables;
						if (decks) payload.decks = decks;
						if (journal) payload.journal = journal;
						if (handouts) payload.handouts = handouts;
						if (characters) payload.characters = characters;
						if (playlists) payload.playlists = playlists;
						if (tracks) payload.tracks = tracks;

						const filename = document.title.replace(/\|\s*Roll20$/i, "").trim().replace(/[^\w\-]/g, "_");
						const data = JSON.stringify(payload, null, "\t");

						console.log("Saving");
						const blob = new Blob([data], {type: "application/json"});
						d20plus.ut.saveAs(blob, `${filename}.json`);
					};
					if (!anyBlobs || blobCount === 0) onBlobsReady();
				});


				// TODO
				/*
				macro
				 */
			});
		}
	})
}

SCRIPT_EXTENSIONS.push(baseToolModule);


function baseToolUnlock () {
	d20plus.tool.tools.push({
		toolId: "UNLOCKER",
		name: "Token Unlocker",
		desc: "Unlock previously-locked tokens",
		html: `
			<div id="d20plus-token-unlocker" title="Token Unlocker">
				<p>
					<button class="btn" name="btn-refresh">Refresh</button>
				</p>
				<p class="split">
					<label><input type="checkbox" title="Select all" name="cb-all"> Select All</label> 
					<button class="btn" name="btn-unlock">Unlock Selected</button>
				</p>
				<div id="token-unlocker-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<br><br>
					<ul class="list unlock-list" style="max-height: 420px; overflow-y: scroll; display: block; margin: 0;"></ul>
				</div>
			</div>
		`,
		dialogFn: () => {
			const $win = $("#d20plus-token-unlocker").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			}).data("VE_HANDLE_UPDATE", () => {
				d20.engine.canvas._objects.forEach(ob => {
					if (ob.model) {
						const locked = ob.model.get("VeLocked");
						if (locked) {
							ob.lockMovementX = true;
							ob.lockMovementY = true;
							ob.lockScalingX = true;
							ob.lockScalingY = true;
							ob.lockRotation = true;
							ob.saveState();
						}
					}
				});
			});

			document.addEventListener("VePageChange", () => {
				$win.data("VE_HANDLE_UPDATE")();
			});

			document.addEventListener("VeLayerChange", () => {
				$win.data("VE_HANDLE_UPDATE")();
			});

			try {
				$win.data("VE_HANDLE_UPDATE")();
			} catch (e) {
				d20plus.ut.error("Failed to re-lock tokens!")
			}
		},
		openFn: () => {
			const $win = $("#d20plus-token-unlocker");
			$win.dialog("open");
			const $wrpCbs = $(`#token-unlocker-list-container`).find(`.unlock-list`);
			const $cbAll = $win.find(`[name="cb-all"]`);
			const $btnUnlock = $win.find(`[name="btn-unlock"]`);
			const $btnRefresh = $win.find(`[name="btn-refresh"]`).click(() => populateList());

			function populateList () {
				const objects = d20.engine.canvas._objects.filter(it => it.model && it.model.get("VeLocked"));
				$wrpCbs.empty();

				objects.forEach(it => {
					$wrpCbs.append(`
						<label class="import-cb-label" data-listid="${it.model.get("id")}">
							<input type="checkbox">
							<span class="name readable">${it.model.get("name") || `Unnamed${it.type ? ` ${it.type}` : ""}`}</span>
						</label>
					`);
				});

				// init list library
				const unlockList = new List("token-unlocker-list-container", {
					valueNames: ["name"],
					listClass: "unlock-list"
				});

				$cbAll.prop("checked", false);
				$cbAll.off("click").click(() => d20plus.importer._importToggleSelectAll(unlockList, $cbAll));

				$btnUnlock.off("click").on("click", () => {
					const sel = unlockList.items
						.filter(it => $(it.elm).find(`input`).prop("checked"))
						.map(it => $(it.elm).attr("data-listid"));

					if (!sel.length) {
						alert("No items selected!");
					} else {
						const currObjects = d20.engine.canvas._objects.filter(it => it.model);
						let counter = 0;
						sel.forEach(toUnlock => {
							const ob = currObjects.find(it => it.model && it.model.get("id") === toUnlock);
							if (ob) {
								counter++;
								ob.lockMovementX = false;
								ob.lockMovementY = false;
								ob.lockScalingX = false;
								ob.lockScalingY = false;
								ob.lockRotation = false;
								ob.saveState();

								ob.model.set("VeLocked", false);
								ob.model.save();
							}
						});
						alert(`${counter} item${counter === 1 ? "" : "s"} unlocked.`);
						populateList();
					}
				});
			}

			populateList();
		}
	})
}

SCRIPT_EXTENSIONS.push(baseToolUnlock);


function baseToolAnimator () {
	function cleanNulls (obj) {
		Object.entries(obj).filter(([k, v]) => v == null).forEach(([k]) => delete obj[k]);
		return obj;
	}

	d20plus.anim = {
		lineFromParsed (parsed) {
			const stack = [];
			const add = (...parts) => parts.forEach(p => stack.push(p == null ? "-" : p));

			stack.push(d20plus.anim.COMMAND_TO_SHORT[parsed._type]);
			stack.push(parsed.start || 0);

			switch (parsed._type) {
				case "Move":
				case "MoveExact": {
					stack.push(parsed.duration || 0);
					add(parsed.x, parsed.y, parsed.z);
					break;
				}
				case "Rotate":
				case "RotateExact": {
					stack.push(parsed.duration || 0);
					add(parsed.degrees);
					break;
				}
				case "Copy": {
					add(parsed.animation);
					break;
				}
				case "Flip":
				case "FlipExact": {
					add(parsed.flipH, parsed.flipV);
					break;
				}
				case "Scale":
				case "ScaleExact": {
					stack.push(parsed.duration || 0);
					add(parsed.scaleX, parsed.scaleY);
					break;
				}
				case "Layer": {
					add(parsed.layer);
					break;
				}
				case "Lighting":
				case "LightingExact": {
					stack.push(parsed.duration || 0);
					add(parsed.lightRadius, parsed.dimStart, parsed.degrees);
					break;
				}
				case "SetProperty":
				case "SumProperty": {
					add(parsed.prop, parsed.value);
					break;
				}
				case "TriggerMacro": {
					add(parsed.macro);
					break;
				}
				case "TriggerAnimation": {
					add(parsed.animation);
					break;
				}
				default: throw new Error(`Unhandled type "${parsed._type}"`);
			}

			return stack.join(" ");
		},

		deserialize: function (json) {
			let out;
			switch (json._type) {
				case "Nop": out = new d20plus.anim.Nop(); break;
				case "Move": out = new d20plus.anim.Move(json.startTime, json.duration, json.x, json.y, json.z); break;
				case "MoveExact": out = new d20plus.anim.MoveExact(json.startTime, json.duration, json.x, json.y, json.z); break;
				case "Copy": out = new d20plus.anim.Copy(json.startTime, json.childAnimation); break;
				case "Rotate": out = new d20plus.anim.Rotate(json.startTime, json.duration, json.degrees); break;
				case "RotateExact": out = new d20plus.anim.RotateExact(json.startTime, json.duration, json.degrees); break;
				case "Flip": out = new d20plus.anim.Flip(json.startTime, json.isHorizontal, json.isVertical); break;
				case "FlipExact": out = new d20plus.anim.FlipExact(json.startTime, json.isHorizontal, json.isVertical); break;
				case "Scale": out = new d20plus.anim.Scale(json.startTime, json.duration, json.scaleFactorX, json.scaleFactorY); break;
				case "ScaleExact": out = new d20plus.anim.ScaleExact(json.startTime, json.duration, json.scaleFactorX, json.scaleFactorY); break;
				case "Layer": out = new d20plus.anim.Layer(json.startTime, json.layer); break;
				case "SetProperty": out = new d20plus.anim.SetProperty(json.startTime, json.prop, json.value); break;
				case "SumProperty": out = new d20plus.anim.SumProperty(json.startTime, json.prop, json.value); break;
				case "Lighting": out = new d20plus.anim.Lighting(json.startTime, json.duration, json.lightRadius, json.dimStart, json.degrees); break;
				case "LightingExact": out = new d20plus.anim.LightingExact(json.startTime, json.duration, json.lightRadius, json.dimStart, json.degrees); break;
				case "TriggerMacro": out = new d20plus.anim.TriggerMacro(json.startTime, json.macroName); break;
				case "TriggerAnimation": out = new d20plus.anim.TriggerAnimation(json.startTime, json.animation); break;
				default: throw new Error(`Unhandled type "${json._type}"`);
			}
			out._hasRun = json._hasRun;
			out._offset = json._offset;
			out._progress = json._progress;
			out._snapshotDiff = json._snapshotDiff;
			return out;
		},

		// region animations
		// Each has `animate` which accepts up to four parameters:
		//   token: the token object being animated
		//   alpha: the absolute time since the start of the animation's life
		//   delta: the time delta from the last time the `animate` function was run
		//   queue: the queue this animation is part of
		// The `animate` function returns `true` if the token needs to be saved, `false` otherwise
		// Each should also have:
		//   `serialize` function
		//   `hasRun` function; returns `true` if the animation has been run, and can therefore be safely removed from any queues
		//   `setOffset` function; sets a start time offset for the animation. Used when triggering child animations
		_Base: function () {
			this._hasRun = false;
			this._offset = 0;
			this._progress = 0; // 0 - 1f
			this._snapshotDiff = null;

			this.hasRun = () => this._hasRun;
			this.setOffset = offset => this._offset = offset;
			this.isLastTick = () => !(this._progress < (1 - Number.EPSILON));
			this._serialize = () => {
				// remove any undefined properties
				const rawOut = {
					_type: this.constructor.name,
					_hasRun: this._hasRun,
					_offset: this._offset,
					_progress: this._progress,
					_snapshotDiff: this._snapshotDiff
				};
				const out = {};
				Object.entries(rawOut).forEach(([k, v]) => {
					if (v != null) out[k] = v;
				});
				return out;
			};

			this._getTickProgress = (duration, delta) => {
				let mProgress = duration === 0 ? 1 : Math.min(1, delta / duration);
				// prevent progress from going past 100%
				if (this._progress + mProgress > 1) mProgress = 1 - this._progress;
				return mProgress;
			};
		},

		Nop: function () {
			d20plus.anim._Base.call(this);

			this.animate = function () {
				return false;
			};

			this.hasRun = () => true;
			this.serialize = () => {};
		},

		_BaseMove: function (startTime, duration, x, y, z) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, duration, x, y, z
				})
			};

			this._getCurrentZ = (token) => {
				const statuses = (token.attributes.statusmarkers || "").split(",");
				let total = 0;
				let pow = 1;
				let stack = "";

				// reverse loop through the fluffy wings, multiplying vals by 1/10/100...
				const len = statuses.length;
				for (let i = len - 1; i >= 0; --i) {
					const [name, val] = statuses[i].split("@");
					if (name === "fluffy-wing") {
						total += pow * Number(val);
						pow = pow * 10;
					} else {
						stack += statuses[i] + ",";
					}
				}

				return {total, stack};
			};

			this._setCurrentZ = (token, stack, total) => {
				if (total) {
					const nums = String(Math.round(total)).split("");
					for (let i = 0; i < nums.length; ++i) {
						stack += `fluffy-wing@${nums[i]}${i < nums.length - 1 ? "," : ""}`;
					}
				} else stack = stack.replace(/,$/, "");

				token.attributes.statusmarkers = stack;
			};
		},

		Move: function (startTime, duration, x, y, z) {
			d20plus.anim._BaseMove.call(this, startTime, duration, x, y, z);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle movement
						if (x != null) token.attributes.left += mProgress * x;
						if (y != null) token.attributes.top -= mProgress * y;
						if (z != null) {
							let {total, stack} = this._getCurrentZ(token);
							total += mProgress * z;
							this._setCurrentZ(token, stack, total);
						}

						// update progress
						this._progress += mProgress;

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		MoveExact: function (startTime, duration, x, y, z) {
			d20plus.anim._BaseMove.call(this, startTime, duration, x, y, z);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._snapshotDiff == null) {
						const {total} = this._getCurrentZ(token);
						this._snapshotDiff = {
							x: (x || 0) - (token.attributes.left || 0),
							y: (y || 0) - (token.attributes.top || 0),
							z: (z || 0) - (total),
						};
					}

					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle movement
						if (x != null) token.attributes.left += mProgress * this._snapshotDiff.x;
						if (y != null) token.attributes.top -= mProgress * this._snapshotDiff.y;
						if (z != null) {
							let {total, stack} = this._getCurrentZ(token);
							total += mProgress * this._snapshotDiff.z;
							this._setCurrentZ(token, stack, total);
						}

						// update progress
						this._progress += mProgress;

						// on the last tick, update to precise values
						if (this.isLastTick()) {
							if (x != null) token.attributes.left = x;
							if (y != null) token.attributes.top = -y;
							if (z != null) {
								let {stack} = this._getCurrentZ(token);
								this._setCurrentZ(token, stack, z);
							}
						}

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		Copy: function (startTime, childAnimation = false) {
			d20plus.anim._Base.call(this);

			this.animate = function (token, alpha, delta, queue) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					// based on "d20.clipboard.doCopy"
					const graphic = token.view.graphic;
					const attrs = {
						...MiscUtil.copy(graphic)
					};

					const modelattrs = {};
					const json = token.toJSON();
					d20.token_editor.tokenkeys.forEach(k => modelattrs[k] = json[k]);

					const cpy = {
						type: token.attributes.type,
						attrs,
						modelattrs,
						oldid: token.id,
						groupwith: ""
					};

					// based on "d20.clipboard.doPaste"
					let childToken;
					const page = d20.Campaign.pages.models.find(model => model.thegraphics.models.find(it => it.id === token.id));
					if ("image" === cpy.type) {
						attrs.imgsrc = attrs.src;
						childToken = page.addImage(attrs, true, false, false, false, true);
						if (cpy.modelattrs && cpy.modelattrs.represents) {
							const char = d20.Campaign.characters.get(cpy.modelattrs.represents);

							if (char) {
								const updateBarN = (n) => {
									const prop = `bar${n}_link`;
									if ("" !== cpy.modelattrs[prop] && (-1 !== cpy.modelattrs[prop].indexOf("sheetattr_"))) {
										const l = cpy.modelattrs[prop].split("sheetattr_")[1];
										setTimeout(() => char.updateTokensByName(l), 0.5);
									} else {
										const s = char.attribs.get(cpy.modelattrs[prop]);
										const l = s.get("name");
										setTimeout(() => char.updateTokensByName(l, cpy.modelattrs[prop]), 0.5);
									}
								};
								updateBarN(1);
								updateBarN(2);
								updateBarN(3);
							}
						}

						childToken && childToken.save(cpy.modelattrs);
					}

					if (childToken && childAnimation) {
						const nxt = new d20plus.anim.TriggerAnimation(startTime, childAnimation);
						nxt.animate(childToken, alpha, delta, queue);
					}
				}
				return false;
			};

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, childAnimation
				})
			};
		},

		_BaseRotate: function (startTime, duration, degrees) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, duration, degrees
				})
			};
		},

		Rotate: function (startTime, duration, degrees) {
			d20plus.anim._BaseRotate.call(this, startTime, duration, degrees);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle rotation
						if (degrees != null) {
							const rot = mProgress * degrees;
							token.attributes.rotation += rot;
						}

						// update progress
						this._progress += mProgress;

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		RotateExact: function (startTime, duration, degrees) {
			d20plus.anim._BaseRotate.call(this, startTime, duration, degrees);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._snapshotDiff == null) {
						this._snapshotDiff = {
							degrees: (degrees || 0) - Number(token.attributes.rotation || 0)
						};
					}

					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle rotation
						if (degrees != null) token.attributes.rotation += mProgress * this._snapshotDiff.degrees;

						// update progress
						this._progress += mProgress;

						// on the last tick, update to precise values
						if (this.isLastTick()) {
							if (degrees != null) token.attributes.rotation = degrees;
						}

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		_BaseFlip: function (startTime, isHorizontal, isVertical) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, isHorizontal, isVertical
				})
			};
		},

		Flip: function (startTime, isHorizontal, isVertical) {
			d20plus.anim._BaseFlip.call(this, startTime, isHorizontal, isVertical);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (isHorizontal != null && isHorizontal) token.set("fliph", !(typeof token.get("fliph") === "string" ? token.get("fliph") === "true" : token.get("fliph")));
					if (isVertical != null && isVertical) token.set("flipv", !(typeof token.get("flipv") === "string" ? token.get("flipv") === "true" : token.get("flipv")));

					return true;
				}
				return false;
			};
		},

		FlipExact: function (startTime, isHorizontal, isVertical) {
			d20plus.anim._BaseFlip.call(this, startTime, isHorizontal, isVertical);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (isHorizontal != null) token.set("fliph", isHorizontal);
					if (isVertical != null) token.set("fliph", isVertical);

					return true;
				}
				return false;
			};
		},

		_BaseScale: function (startTime, duration, scaleFactorX, scaleFactorY) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, duration, scaleFactorX, scaleFactorY
				})
			};
		},

		Scale: function (startTime, duration, scaleFactorX, scaleFactorY) {
			d20plus.anim._BaseScale.call(this, startTime, duration, scaleFactorX, scaleFactorY);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle scaling
						if (scaleFactorX != null) {
							const mScaleX = mProgress * scaleFactorX;
							token.view.graphic.scaleX = Number(token.view.graphic.scaleX || 0) + mScaleX;
							token.attributes.scaleX = token.view.graphic.scaleX;
						}

						if (scaleFactorY != null) {
							const mScaleY = mProgress * scaleFactorY;
							token.view.graphic.scaleY = Number(token.view.graphic.scaleY || 0) + mScaleY;
							token.attributes.scaleY = token.view.graphic.scaleY;
						}

						// update progress
						this._progress += mProgress;

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		ScaleExact: function (startTime, duration, scaleFactorX, scaleFactorY) {
			d20plus.anim._BaseScale.call(this, startTime, duration, scaleFactorX, scaleFactorY);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._snapshotDiff == null) {
						this._snapshotDiff = {
							scaleX: (scaleFactorX || 0) - (token.view.graphic.scaleX || 0),
							scaleY: (scaleFactorY || 0) - (token.view.graphic.scaleY || 0),
						};
					}

					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle scaling
						if (scaleFactorX != null) {
							token.view.graphic.scaleX += mProgress * this._snapshotDiff.scaleX;
							token.attributes.scaleX = token.view.graphic.scaleX;
						}

						if (scaleFactorY != null) {
							token.view.graphic.scaleY += mProgress * this._snapshotDiff.scaleY;
							token.attributes.scaleY = token.view.graphic.scaleY;
						}

						// update progress
						this._progress += mProgress;

						// on the last tick, update to precise values
						if (this.isLastTick()) {
							if (scaleFactorX != null) {
								token.view.graphic.scaleX = scaleFactorX;
								token.attributes.scaleX = token.view.graphic.scaleX;
							}

							if (scaleFactorY != null) {
								token.view.graphic.scaleY = scaleFactorY;
								token.attributes.scaleY = token.view.graphic.scaleY;
							}
						}

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		Layer: function (startTime, layer) {
			d20plus.anim._Base.call(this);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (layer != null) {
						token.attributes.layer = layer;
					}

					return true;
				}
				return false;
			};

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, layer
				})
			};
		},

		_BaseProperty: function (startTime, prop, value) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, prop, value
				})
			};
		},

		SumProperty: function (startTime, prop, value) {
			d20plus.anim._BaseProperty.call(this, startTime, prop, value);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (prop != null) {
						const curNum = Number(token.attributes[prop]);
						token.attributes[prop] = (isNaN(curNum) ? 0 : curNum) + eval(value);
					}

					return true;
				}
				return false;
			};
		},

		// TODO consider making an alternate version which sets a property on the character
		// TODO consider the ability to set properties on _other_ tokens -- might not be performant enough?
		SetProperty: function (startTime, prop, value) {
			d20plus.anim._BaseProperty.call(this, startTime, prop, value);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (prop != null) {
						if (prop === "gmnotes") value = escape(value);
						else if (prop === "sides") value = value.split("|").map(it => escape(it)).join("|");
						token.attributes[prop] = value;
					}

					return true;
				}
				return false;
			};
		},

		_BaseLighting: function (startTime, duration, lightRadius, dimStart, degrees) {
			d20plus.anim._Base.call(this);

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, duration, lightRadius, dimStart, degrees
				})
			};
		},

		Lighting: function (startTime, duration, lightRadius, dimStart, degrees) {
			d20plus.anim._BaseLighting.call(this, startTime, duration, lightRadius, dimStart, degrees);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle lighting changes
						if (lightRadius != null) token.attributes.light_radius = Number(token.attributes.light_radius || 0) + mProgress * lightRadius;
						if (dimStart != null) token.attributes.light_dimradius = Number(token.attributes.light_dimradius || 0) + mProgress * dimStart;
						if (degrees != null) {
							if (token.attributes.light_angle === "") token.attributes.light_angle = 360;
							token.attributes.light_angle = Number(token.attributes.light_angle || 0) + mProgress * degrees;
						}

						// update progress
						this._progress += mProgress;

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		LightingExact: function (startTime, duration, lightRadius, dimStart, degrees) {
			d20plus.anim._BaseLighting.call(this, startTime, duration, lightRadius, dimStart, degrees);

			this.animate = function (token, alpha, delta) {
				alpha = alpha - this._offset;

				if (alpha >= startTime) {
					if (this._snapshotDiff == null) {
						this._snapshotDiff = {
							lightRadius: (lightRadius || 0) - Number(token.attributes.light_radius || 0),
							dimStart: (dimStart || 0) - Number(token.attributes.light_dimradius || 0),
							degrees: (degrees || 0) - Number(token.attributes.light_angle || 0),
						};
					}

					if (this._progress < (1 - Number.EPSILON)) {
						const mProgress = this._getTickProgress(duration, delta);

						// handle lighting changes
						if (lightRadius != null) token.attributes.light_radius = Number(token.attributes.light_radius) + mProgress * this._snapshotDiff.lightRadius;
						if (dimStart != null) token.attributes.light_dimradius = Number(token.attributes.light_dimradius) + mProgress * this._snapshotDiff.dimStart;
						if (degrees != null) token.attributes.light_angle = Number(token.attributes.light_angle) + mProgress * this._snapshotDiff.degrees;

						// update progress
						this._progress += mProgress;

						if (this.isLastTick()) {
							if (lightRadius != null) token.attributes.light_radius = lightRadius;
							if (dimStart != null) token.attributes.light_dimradius = dimStart;
							if (degrees != null) token.attributes.light_angle = degrees;
						}

						return true;
					} else this._hasRun = true;
				}
				return false;
			};
		},

		TriggerMacro: function (startTime, macroName) {
			d20plus.anim._Base.call(this);

			this.animate = function (token, alpha) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (macroName != null) {
						d20.textchat.doChatInput(`#${macroName}`)
					}
				}
				return false;
			};

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, macroName
				})
			};
		},

		TriggerAnimation: function (startTime, animation) {
			d20plus.anim._Base.call(this);

			this.animate = function (token, alpha, delta, queue) {
				alpha = alpha - this._offset;

				if (!this._hasRun && alpha >= startTime) {
					this._hasRun = true;

					if (animation != null) {
						const anim = d20plus.anim.animatorTool.getAnimationByName(animation);

						if (!anim) return false; // if it has been deleted/etc

						const nxtQueue = d20plus.anim.animatorTool.getAnimQueue(anim);
						nxtQueue.forEach(it => it.setOffset(alpha + this._offset));
						queue.push(...nxtQueue);
					}
				}
				return false;
			};

			this.serialize = () => {
				return cleanNulls({
					...this._serialize(),
					startTime, animation
				})
			};
		}
		// endregion animations
	};

	function Command (line, error, cons = null, parsed = null) {
		this.line = line;
		this.error = error;
		this.isRunnable = !!cons;
		this.parsed = parsed;

		this.getInstance = function () {
			return new cons();
		};
	}

	Command.errInvalidArgCount = function (line, ...counts) { return new Command(line, `Invalid argument count; expected ${counts.joinConjunct(", ", " or ")}`)};
	Command.errPropNum = function (line, prop, val) { return new Command(line, `${prop} "${val}" was not a number`)};
	Command.errPropBool = function (line, prop, val) { return new Command(line, `${prop} "${val}" was not a boolean`)};
	Command.errPropLayer = function (line, prop, val) { return new Command(line, `${prop} "${val}" was not a layer (valid layers are: ${d20plus.ut.LAYERS.joinConjunct(", ", " or ")})`)};
	Command.errPropToken = function (line, prop, val) { return new Command(line, `${prop} "${val}" was not a token property`)};
	Command.errValNeg = function (line, prop, val) { return new Command(line, `${prop} "${val}" was negative`)};

	Command.errStartNum = function (line, val) { return Command.errPropNum(line, "start time", val)};
	Command.errStartNeg = function (line, val) { return Command.errValNeg(line, "start time", val)};
	Command.errDurationNum = function (line, val) { return Command.errPropNum(line, "duration", val)};
	Command.errDurationNeg = function (line, val) { return Command.errValNeg(line, "duration", val)};

	Command.fromString = function (line) {
		const cleanLine = line
			.split("/\/\//g")[0] // handle comments
			.trim();
		const tokens = cleanLine.split(/ +/g).filter(Boolean);
		if (!tokens.length) return new Command(line);

		const op = tokens.shift();
		switch (op) {
			case "mv":
			case "mvx": {
				if (tokens.length !== 5) return Command.errInvalidArgCount(line, 5);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);
				const nDuration = Number(tokens[1]);
				if (isNaN(nDuration)) return Command.errDurationNum(line, tokens[1]);
				if (nDuration < 0) return Command.errDurationNeg(line, tokens[1]);

				const nX = tokens[2] === "-" ? null : Number(tokens[2]);
				if (nX != null && isNaN(nX)) return Command.errPropNum(line, "x", tokens[2]);
				const nY = tokens[3] === "-" ? null : Number(tokens[3]);
				if (nY != null && isNaN(nY)) return Command.errPropNum(line, "y", tokens[3]);
				const nZ = tokens[4] === "-" ? null : Number(tokens[4]);
				if (nZ != null && isNaN(nY)) return Command.errPropNum(line, "z", tokens[4]);

				if (op === "mv") {
					return new Command(
						line,
						null,
						d20plus.anim.Move.bind(null, nStart, nDuration, nX, nY, nZ),
						{
							_type: "Move",
							start: nStart,
							duration: nDuration,
							x: nX,
							y: nY,
							z: nZ
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.MoveExact.bind(null, nStart, nDuration, nX, nY, nZ),
						{
							_type: "MoveExact",
							start: nStart,
							duration: nDuration,
							x: nX,
							y: nY,
							z: nZ
						}
					);
				}
			}

			case "rot":
			case "rotx": {
				if (tokens.length !== 3) return Command.errInvalidArgCount(line, 3);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);
				const nDuration = Number(tokens[1]);
				if (isNaN(nDuration)) return Command.errDurationNum(line, tokens[1]);
				if (nDuration < 0) return Command.errDurationNeg(line, tokens[1]);

				const nRot = tokens[2] === "-" ? null : Number(tokens[2]);
				if (nRot != null && isNaN(nRot)) return Command.errPropNum(line, "degrees", tokens[2]);

				if (op === "rot") {
					return new Command(
						line,
						null,
						d20plus.anim.Rotate.bind(null, nStart, nDuration, nRot),
						{
							_type: "Rotate",
							start: nStart,
							duration: nDuration,
							degrees: nRot
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.RotateExact.bind(null, nStart, nDuration, nRot),
						{
							_type: "RotateExact",
							start: nStart,
							duration: nDuration,
							degrees: nRot
						}
					);
				}
			}

			case "cp": {
				if (tokens.length < 1 || tokens.length > 2) return Command.errInvalidArgCount(line, 1, 2);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				const childAnim = tokens[1] === "-" ? null : tokens[1];

				return new Command(
					line,
					null,
					d20plus.anim.Copy.bind(null, nStart, childAnim),
					{
						_type: "Copy",
						start: nStart,
						animation: childAnim
					}
				);
			}

			case "flip":
			case "flipx": {
				if (tokens.length !== 3) return Command.errInvalidArgCount(line, 3);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				const flipH = tokens[1] === "-" ? null : tokens[1] === "true" ? true : tokens[1] === "false" ? false : undefined;
				if (flipH === undefined) return Command.errPropBool(line, "flipH", tokens[1]);
				const flipV = tokens[2] === "-" ? null : tokens[2] === "true" ? true : tokens[2] === "false" ? false : undefined;
				if (flipV === undefined) return Command.errPropBool(line, "flipV", tokens[2]);

				if (op === "flip") {
					return new Command(
						line,
						null,
						d20plus.anim.Flip.bind(null, nStart, flipH, flipV),
						{
							_type: "Flip",
							start: nStart,
							flipH: flipH,
							flipV: flipV
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.FlipExact.bind(null, nStart, flipH, flipV),
						{
							_type: "FlipExact",
							start: nStart,
							flipH: flipH,
							flipV: flipV
						}
					);
				}
			}

			case "scale":
			case "scalex": {
				if (tokens.length !== 4) return Command.errInvalidArgCount(line, 4);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);
				const nDuration = Number(tokens[1]);
				if (isNaN(nDuration)) return Command.errDurationNum(line, tokens[1]);
				if (nDuration < 0) return Command.errDurationNeg(line, tokens[1]);

				const nScaleX = tokens[2] === "-" ? null : Number(tokens[2]);
				if (nScaleX != null && isNaN(nScaleX)) return Command.errPropNum(line, "scaleX", tokens[2]);
				if (nScaleX != null && nScaleX < 0) return Command.errValNeg(line, "scaleX", tokens[2]);
				const nScaleY = tokens[3] === "-" ? null : Number(tokens[3]);
				if (nScaleY != null && isNaN(nScaleY)) return Command.errPropNum(line, "scaleY", tokens[3]);
				if (nScaleY != null && nScaleY < 0) return Command.errValNeg(line, "scaleY", tokens[3]);

				if (op === "scale") {
					return new Command(
						line,
						null,
						d20plus.anim.Scale.bind(null, nStart, nDuration, nScaleX, nScaleY),
						{
							_type: "Scale",
							start: nStart,
							duration: nDuration,
							scaleX: nScaleX,
							scaleY: nScaleY
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.ScaleExact.bind(null, nStart, nDuration, nScaleX, nScaleY),
						{
							_type: "ScaleExact",
							start: nStart,
							duration: nDuration,
							scaleX: nScaleX,
							scaleY: nScaleY
						}
					);
				}
			}

			case "layer": {
				if (tokens.length !== 2) return Command.errInvalidArgCount(line, 2);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				const layer = tokens[1] === "-" ? null : tokens[1];
				if (layer != null && !d20plus.anim.VALID_LAYER.has(layer)) return Command.errPropLayer(line, "layer", layer);

				return new Command(
					line,
					null,
					d20plus.anim.Layer.bind(null, nStart, layer),
					{
						_type: "Layer",
						start: nStart,
						layer: layer
					}
				);
			}

			case "light":
			case "lightx": {
				if (tokens.length !== 5) return Command.errInvalidArgCount(line, 5);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);
				const nDuration = Number(tokens[1]);
				if (isNaN(nDuration)) return Command.errDurationNum(line, tokens[1]);
				if (nDuration < 0) return Command.errDurationNeg(line, tokens[1]);

				const nLightRadius = tokens[2] === "-" ? null : Number(tokens[2]);
				if (nLightRadius != null && isNaN(nLightRadius)) return Command.errPropNum(line, "lightRadius", tokens[2]);
				const nDimStart = tokens[3] === "-" ? null : Number(tokens[3]);
				if (nDimStart != null && isNaN(nDimStart)) return Command.errPropNum(line, "dimStart", tokens[3]);
				const nDegrees = tokens[4] === "-" ? null : Number(tokens[4]);
				if (nDegrees != null && isNaN(nDegrees)) return Command.errPropNum(line, "degrees", tokens[4]);

				if (op === "light") {
					return new Command(
						line,
						null,
						d20plus.anim.Lighting.bind(null, nStart, nDuration, nLightRadius, nDimStart, nDegrees),
						{
							_type: "Lighting",
							start: nStart,
							duration: nDuration,
							lightRadius: nLightRadius,
							dimStart: nDimStart,
							degrees: nDegrees
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.LightingExact.bind(null, nStart, nDuration, nLightRadius, nDimStart, nDegrees),
						{
							_type: "LightingExact",
							start: nStart,
							duration: nDuration,
							lightRadius: nLightRadius,
							dimStart: nDimStart,
							degrees: nDegrees
						}
					);
				}
			}

			case "prop":
			case "propSum": {
				if (tokens.length < 2) return Command.errInvalidArgCount(line, 3);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				const prop = tokens[1] === "-" ? null : tokens[1];
				if (prop != null && !d20plus.anim.VALID_PROP_TOKEN.has(prop)) return Command.errPropToken(line, "prop", prop);
				let val = "";
				if (tokens.length > 2) val = tokens.slice(2, tokens.length).join(" "); // combine trailing tokens
				try { val = JSON.parse(val); } catch (ignored) { console.warn(`Failed to parse "${val}" as JSON, treating as raw string...`) }

				if (op === "propSum") {
					return new Command(
						line,
						null,
						d20plus.anim.SumProperty.bind(null, nStart, prop, val),
						{
							_type: "SumProperty",
							start: nStart,
							prop: prop,
							value: val
						}
					);
				} else {
					return new Command(
						line,
						null,
						d20plus.anim.SetProperty.bind(null, nStart, prop, val),
						{
							_type: "SetProperty",
							start: nStart,
							prop: prop,
							value: val
						}
					);
				}
			}

			case "macro": {
				if (tokens.length !== 2) return Command.errInvalidArgCount(line, 2);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				// no validation for macro -- it might exist in the future if it doesn't now, or vice-versa
				const macro = tokens[1] === "-" ? null : tokens[1];

				return new Command(
					line,
					null,
					d20plus.anim.TriggerMacro.bind(null, nStart, macro),
					{
						_type: "TriggerMacro",
						start: nStart,
						macro: macro
					}
				);
			}

			case "anim": {
				if (tokens.length !== 2) return Command.errInvalidArgCount(line, 2);
				const nStart = Number(tokens[0]);
				if (isNaN(nStart)) return Command.errStartNum(line, tokens[0]);
				if (nStart < 0) return Command.errStartNeg(line, tokens[0]);

				// no validation for animation -- it might exist in the future if it doesn't now, or vice-versa
				const animation = tokens[1] === "-" ? null : tokens[1];

				return new Command(
					line,
					null,
					d20plus.anim.TriggerAnimation.bind(null, nStart, animation),
					{
						_type: "TriggerAnimation",
						start: nStart,
						animation: animation
					}
				);
			}
		}
	};

	d20plus.anim.animatorTool = {
		name: "Token Animator",
		desc: "Manage token animations",
		html: `
			<div id="d20plus-token-animator" title="Token Animator" class="anm__win">
				<div class="split mb-2">
					<div>
						<button class="btn" name="btn-scenes">Edit Scenes</button>
						<button class="btn" name="btn-disable">Stop Animations</button>
						<button class="btn" name="btn-rescue">Rescue Tokens</button>
					</div>
					<div>
						<button class="btn" name="btn-saving" title="If enabled, can have a serious performance impact. If disabled, animations will not resume when reloading the game.">Save Active Animations</button>
					</div>
				</div>
				<div class="split mb-2">
					<button class="btn" name="btn-add">Add Animation</button>
					<button class="btn mr-2" name="btn-import">Import Animation</button>
				</div>
				
				<div class="anm__wrp-sel-all">
					<label class="flex-label"><input type="checkbox" title="Select all" name="cb-all" class="mr-2"> <span>Select All</span></label>
					<div>
						<button class="btn" name="btn-export">Export Selected</button>
						<button class="btn btn-danger" name="btn-delete">Delete Selected</button>
					</div>
				</div>
				
				<div id="token-animator-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<br><br>
					<ul class="list" style="max-height: 420px; overflow-y: auto; display: block; margin: 0;"></ul>
				</div>
			</div>
			
			<div id="d20plus-token-animator-disable" title="Stop Animation" class="anm__win">
				<p>
					<button class="btn" name="btn-refresh">Refresh</button>
				</p>
				
				<p class="anm__wrp-sel-all">
					<label class="flex-label"><input type="checkbox" title="Select all" name="cb-all" class="mr-2"> <span>Select All</span></label> 
					<button class="btn" name="btn-stop">Stop Selected</button>
				</p>
				
				<div id="token-animator-disable-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<div class="bold flex-v-center mt-2">
						<div class="col-1"></div>
						<div class="col-3 text-center">Page</div>
						<div class="col-2 text-center">Image</div>
						<div class="col-3 text-center">Name</div>
						<div class="col-3 text-center">Animation</div>
					</div>
					<ul class="list" style="max-height: 420px; overflow-y: auto; display: block; margin: 0;"></ul>
				</div>
			</div>
			
			<div id="d20plus-token-animator-rescue" title="Token Rescue" class="anm__win">
				<p>
					<button class="btn mr-2" name="btn-refresh">Refresh</button>
				</p>
				
				<p class="anm__wrp-sel-all">
					<label class="flex-label"><input type="checkbox" title="Select all" name="cb-all" class="mr-2"> <span>Select All</span></label> 
					<button class="btn" name="btn-rescue">Rescue Selected</button>
				</p>
				
				<div id="token-animator-rescue-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<div class="bold flex-v-center mt-2">
						<div class="col-1"></div>
						<div class="col-4 text-center">Page</div>
						<div class="col-2 text-center">Image</div>
						<div class="col-5 text-center">Name</div>
					</div>
					<ul class="list" style="max-height: 420px; overflow-y: auto; display: block; margin: 0;"></ul>
				</div>
			</div>
			
			<div id="d20plus-token-animator-scene" title="Scene List" class="anm__win">
				<div class="split mb-2">
					<button class="btn" name="btn-add">Add Scene</button>
					<button class="btn mr-2" name="btn-import">Import Scene</button>
				</div>
				
				<div class="anm__wrp-sel-all">
					<label class="flex-label"><input type="checkbox" title="Select all" name="cb-all" class="mr-2"> <span>Select All</span></label>
					<div>
						<button class="btn" name="btn-export">Export Selected</button>
						<button class="btn btn-danger" name="btn-delete">Delete Selected</button>
					</div>
				</div>
				
				<div id="token-animator-scene-list-container">
					<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
					<br><br>
					<ul class="list" style="max-height: 420px; overflow-y: auto; display: block; margin: 0;"></ul>
				</div>
			</div>
		`,
		_html_template_editor: `
			<div title="Animation Editor" class="anm__win anm-edit__gui flex-col">
				<div class="mb-2 no-shrink split flex-vh-center">
					<input name="ipt-name" placeholder="Name">
					
					<div class="flex">
						<button class="btn mr-1" name="btn-save">Save</button>
						<button class="btn" name="btn-export-file">Export to File</button>
						
						<div class="anm-edit__gui-hidden flex">
							<button class="btn ml-2" name="btn-help">View Help</button>
							<button class="btn ml-1" name="btn-validate">Validate</button>
						</div>
						
						<div class="anm-edit__gui-visible flex">
							<button class="btn ml-2" name="btn-add-command">Add Command</button>
						</div>
						
						<button class="btn ml-2" name="btn-edit-text">Edit as Text</button>
					</div>
				</div>
				
				<div class="anm-edit__ipt-lines-wrp anm-edit__ipt-lines-wrp--gui anm-edit__gui-visible">
					
				</div>
				
				<div class="anm-edit__ipt-lines-wrp anm-edit__ipt-lines-wrp--text anm-edit__gui-hidden">
					<textarea name="ipt-lines" placeholder="mv 0 100 50 -50" class="anm-edit__ipt-lines"></textarea>
				</div>
			</div>
		`,
		_html_template_scene_editor: `
			<div title="Scene Editor" class="anm__win flex-col">
				<div class="mb-2 no-shrink split">
					<input name="ipt-name" placeholder="Name">
					
					<div>
						<button class="btn" name="btn-save">Save</button>
						<button class="btn" name="btn-export-file">Export to File</button>
					</div>
				</div>
				<div class="mb-2">
					<button class="btn" name="btn-add">Add Part</button>
				</div>
				<div class="bold flex-v-center mt-2">
					<div class="col-3 text-center">Token</div>
					<div class="col-2"></div>
					<div class="col-2 text-center">Animation</div>
					<div class="col-2"></div>
					<div class="col-2 text-center help" title="Delay period upon starting the scene before this animation is run (in milliseconds)">Start Time</div>
					<div class="col-1"></div>
				</div>
				<div class="anm-edit__ipt-rows-wrp">
					
				</div>
			</div>
		`,

		dialogFn () {
			$("#d20plus-token-animator").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			}).data("initialised", false);

			$("#d20plus-token-animator-disable").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});

			$("#d20plus-token-animator-rescue").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});

			$("#d20plus-token-animator-scene").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 600,
			});
		},

		openFn () {
			this.init();
			this.$win.dialog("open");
		},

		// region public
		init () {
			this.$win = this.$win || $("#d20plus-token-animator");
			if (!this.$win.data("initialised")) {
				this._meta_init();
				// init the runner after, as we need to first load the animations
				d20plus.anim.animator.init();
			}
		},

		getAnimation (uid) {
			return this._anims[uid];
		},

		getAnimationByName (name) {
			const fauxAnim = d20plus.anim.animatorTool.getAnimations().find(it => it.name === name);
			if (!fauxAnim) return null;
			return d20plus.anim.animatorTool.getAnimation(fauxAnim.uid);
		},

		getAnimQueue (anim, additionalOffset) {
			additionalOffset = additionalOffset || 0;
			this._edit_convertLines(anim);
			const queue = anim.lines.filter(it => it.isRunnable).map(it => it.getInstance());
			queue.forEach(it => it._offset += additionalOffset);
			return queue;
		},

		_getUidItems (fromObj) {
			return Object.entries(fromObj).map(([k, v]) => ({
				uid: k,
				name: v.name
			}))
		},

		getAnimations () {
			return this._getUidItems(this._anims);
		},

		getScenes () {
			return this._getUidItems(this._scenes);
		},

		isSavingActive () {
			return !!this._isSaveActive;
		},

		_pSelectUid (fnGetAll, msgNoneFound, title, defaultSelUid) {
			// convert, as the UIDs are object keys
			if (defaultSelUid != null) defaultSelUid = String(defaultSelUid);

			const selFrom = fnGetAll();
			if (!selFrom.length) return d20plus.ut.chatLog(msgNoneFound);

			return new Promise(resolve => {
				const $selUid = $(`<select>
				<option disabled value="-1">${title}</option>
				${selFrom.map(it => `<option value="${it.uid}">${it.name}</option>`).join("")}
				</select>`);
				if (defaultSelUid != null && selFrom.find(it => it.uid === defaultSelUid)) $selUid.val(defaultSelUid);
				else $selUid[0].selectedIndex = 0;

				const $dialog = $$`
					<div title="${title}">
						${$selUid}
					</div>
				`.appendTo($("body"));

				$dialog.dialog({
					dialogClass: "no-close",
					buttons: [
						{
							text: "Cancel",
							click: function () {
								$(this).dialog("close");
								$dialog.remove();
							}
						},
						{
							text: "OK",
							click: function () {
								const selected = Number(d20plus.ut.get$SelValue($selUid));
								$(this).dialog("close");
								$dialog.remove();

								if (~selected) resolve(selected);
								else resolve(null);
							}
						}
					]
				});
			});
		},

		pSelectAnimation (defaultSelUid) {
			return this._pSelectUid(
				this.getAnimations.bind(this),
				`No animations available! Use the Token Animator tool to define some first. See <a href="https://wiki.5e.tools/index.php/Feature:_Animator" target="_blank">the Wiki for help.</a>`,
				"Select Animation",
				defaultSelUid
			);
		},

		pSelectScene (defaultSelUid) {
			return this._pSelectUid(
				this.getScenes.bind(this),
				`No scenes available! Use Edit Scenes in the Token Animator tool to define some first. See <a href="https://wiki.5e.tools/index.php/Feature:_Animator" target="_blank">the Wiki for help.</a>`,
				"Select Scene",
				defaultSelUid
			);
		},

		doStartScene (sceneUid) {
			const scene = this._scenes[sceneUid];
			if (!scene) return d20plus.ut.chatLog(`Could not find scene!`);

			(scene.anims || []).forEach(animMeta => {
				if (animMeta.tokenId && animMeta.animUid) {
					const token = d20plus.ut.getTokenById(animMeta.tokenId);
					if (!token) return;
					const anim = this.getAnimation(animMeta.animUid);
					if (!anim) return;
					d20plus.anim.animator.startAnimation(token, animMeta.animUid, {offset: animMeta.offset || 0});
				}
			});
		},
		// endregion public

		// region meta
		_meta_doSaveState () {
			// copy, and return any parsed commands to strings
			const saveableAnims = {};
			Object.entries(this._anims).forEach(([k, v]) => {
				saveableAnims[k] = {
					...v,
					lines: [...(v.lines || [])].map(it => typeof it === "string" ? it : it.line)
				}
			});

			Campaign.save({
				bR20tool__anim_id: this._anim_id,
				bR20tool__anim_animations: saveableAnims,
				bR20tool__anim_save: this._isSaveActive,
				bR20tool__anim_scene_id: this._scene_id,
				bR20tool__anim_scenes: this._scenes,
			});
		},

		_meta_doLoadState () {
			this._anim_id = Campaign.attributes.bR20tool__anim_id || 1;
			this._scene_id = Campaign.attributes.bR20tool__anim_scene_id || 1;

			// convert legacy "array" versions to objects
			this._anims = {};
			if (Campaign.attributes.bR20tool__anim_animations) {
				const loadedAnims = MiscUtil.copy(Campaign.attributes.bR20tool__anim_animations);
				Object.entries(loadedAnims).filter(([k, v]) => !!v).forEach(([k, v]) => this._anims[k] = v);
			}

			this._scenes = {};
			if (Campaign.attributes.bR20tool__anim_scenes) {
				const loadedScenes = MiscUtil.copy(Campaign.attributes.bR20tool__anim_scenes);
				Object.entries(loadedScenes).filter(([k, v]) => !!v).forEach(([k, v]) => this._scenes[k] = v);
			}

			this._isSaveActive = Campaign.attributes.bR20tool__anim_save || false;
		},

		_meta_init () {
			this._meta_doLoadState();
			this._doSaveStateDebounced = MiscUtil.debounce(this._meta_doSaveState, 100);

			this._$winScene = $(`#d20plus-token-animator-scene`);
			this._$winDisable = $(`#d20plus-token-animator-disable`);
			this._$winRescue = $(`#d20plus-token-animator-rescue`);

			this._main_init();
			this._scene_init();
			this._rescue_init();
			this._dis_init();
			this.$win.data("initialised", true);
		},
		// endregion meta

		// region shared
		async _shared_doImport (prop, name, fnNextId, fnNextName, fnGetValidMsg, fnAdd, ...requiredProps) {
			let data;
			try {
				data = await DataUtil.pUserUpload();
			} catch (e) {
				d20plus.ut.chatLog("File was not valid JSON!");
				console.error(e);
				return;
			}

			if (data[prop] && data[prop].length) {
				let messages = [];
				data[prop].forEach((it, i) => {
					const missingProp = requiredProps.find(rp => it[rp] == null);
					if (missingProp != null) messages.push(`${name.uppercaseFirst()} at index ${i} is missing required fields!`);
					else {
						const originalName = it.name;
						it.uid = fnNextId();
						it.name = fnNextName(it.name);
						const msg = fnGetValidMsg(it);
						if (msg) {
							messages.push(`${originalName} was invalid: ${msg}`);
						} else {
							fnAdd(it);
							messages.push(`Added ${originalName}${it.name !== originalName ? ` (renamed as ${it.name})` : ""}!`);
						}
					}
				});

				if (messages.length) {
					console.log(messages.join("\n"));
					return d20plus.ut.chatLog(messages.join("\n"))
				}
			} else {
				return d20plus.ut.chatLog(`File contained no ${name}s!`);
			}
		},

		_shared_getValidNameMsg (obj, peers) {
			if (!obj.name.length) return "Did not have a name!";
			const illegalNameChars = obj.name.split(/[_0-9a-zA-Z]/g).filter(Boolean);
			if (illegalNameChars.length) return `Illegal characters in name: ${illegalNameChars.map(it => `"${it}"`).join(", ")}`;
			const sameName = Object.values(peers).filter(it => it.uid !== obj.uid).find(it => it.name === obj.name);
			if (sameName) return "Name must be unique!";
		},

		_shared_getNextName (obj, baseName) {
			let nxtName = baseName;
			let suffix = 1;
			while (Object.values(obj).find(it => it.name === nxtName)) nxtName = `${baseName}_${suffix++}`;
			return nxtName;
		},
		// endregion

		// region main
		_main_init () {
			const $btnAdd = this.$win.find(`[name="btn-add"]`);
			const $btnImport = this.$win.find(`[name="btn-import"]`);
			const $btnDisable = this.$win.find(`[name="btn-disable"]`);
			const $btnScenes = this.$win.find(`[name="btn-scenes"]`);
			const $btnRescue = this.$win.find(`[name="btn-rescue"]`);
			const $btnToggleSave = this.$win.find(`[name="btn-saving"]`);

			const $btnSelExport = this.$win.find(`[name="btn-export"]`);
			const $btnSelDelete = this.$win.find(`[name="btn-delete"]`);

			const $cbAll = this.$win.find(`[name="cb-all"]`);
			this._$list = this.$win.find(`.list`);

			$btnAdd.click(() => this._main_addAnim(this._main_getNewAnim()));

			$btnImport.click(async () => {
				await this._shared_doImport(
					"animations",
					"animation",
					this._main_getNextId.bind(this),
					this._shared_getNextName.bind(this, this._anims),
					this._edit_getValidationMessage.bind(this),
					this._main_addAnim.bind(this),
					"uid", "name", "lines" // required properties
				);
			});

			$btnScenes.click(() => {
				this._scene_doPopulateList();
				this._$winScene.dialog("open");
			});

			$btnDisable.click(() => {
				this._dis_doPopulateList();
				this._$winDisable.dialog("open");
			});

			$btnRescue.click(() => {
				this._rescue_doPopulateList();
				this._$winRescue.dialog("open")
			});

			$btnToggleSave.toggleClass("active", this._isSaveActive);
			$btnToggleSave.click(() => {
				this._isSaveActive = !this._isSaveActive;
				$btnToggleSave.toggleClass("active", this._isSaveActive);
				this._doSaveStateDebounced();

				// on disable, clear existing running animations
				// prevents next load from re-loading old running state
				if (!this._isSaveActive) {
					setTimeout(() => Campaign.save({bR20tool__anim_running: {}}), 100);
				}
			});

			const getSelButtons = ofClass => {
				return this._anim_list.items
					.map(it => $(it.elm))
					.filter($it => $it.find(`input`).prop("checked"))
					.map($it => $it.find(`.${ofClass}`));
			};

			$btnSelExport.click(() => {
				const out = {
					animations: this._anim_list.items
						.filter(it => $(it.elm).find(`input`).prop("checked"))
						.map(it => this._main_getExportableAnim(this._anims[it.values().uid]))
				};
				DataUtil.userDownload("animations", out);
			});

			$cbAll.click(() => {
				const val = $cbAll.prop("checked");
				this._anim_list.items.forEach(it => {
					$(it.elm.children[0].children[0]).prop("checked", val);
				})
			});

			$btnSelDelete.click(() => {
				const $btns = getSelButtons(`.anm__btn-delete`);
				if (!$btns.length) return;
				if (!confirm("Are you sure?")) return;
				$btns.forEach($btn => $btn.click());
			});

			this._main_doPopulateList();
		},

		_main_getExportableAnim (anim) {
			const out = {...anim};
			out.lines = out.lines.map(it => typeof it === "string" ? it : it.line);
			return out;
		},

		_main_doPopulateList () {
			this._$list.empty();
			Object.values(this._anims).forEach(anim => this._$list.append(this._main_getListItem(anim)));

			this._anim_list = new List("token-animator-list-container", {
				valueNames: ["name", "uid"]
			});
		},

		_main_addAnim (anim) {
			const lastSearch = d20plus.ut.getSearchTermAndReset(this._anim_list);
			this._anims[anim.uid] = anim;
			this._$list.append(this._main_getListItem(anim));

			this._anim_list.reIndex();
			if (lastSearch) this._anim_list.search(lastSearch);
			this._anim_list.sort("name");

			this._doSaveStateDebounced();
		},

		_main_getNewAnim () {
			return {
				uid: this._main_getNextId(),
				name: this._shared_getNextName(this._anims, "new_animation"),
				lines: []
			}
		},

		_main_getNextId () {
			return this._anim_id++;
		},

		_main_getListItem (anim) {
			const $name = $(`<div class="name readable col-9 clickable" title="Edit Animation">${anim.name}</div>`)
				.click(() => this._edit_openEditor(anim));

			const $btnDuplicate = $(`<div class="btn anm__row-btn pictos mr-2" title="Duplicate">F</div>`)
				.click(() => {
					const copy = MiscUtil.copy(anim);
					copy.name = `${copy.name}_copy`;
					copy.uid = this._anim_id++;
					this._main_addAnim(copy);
				});

			const $btnExport = $(`<div class="btn anm__row-btn pictos mr-2" title="Export to File">I</div>`)
				.click(() => {
					const out = {animations: [this._main_getExportableAnim(anim)]};
					DataUtil.userDownload(`${anim.name}`, out);
				});

			const $btnDelete = $(`<div class="btn anm__row-btn btn-danger pictos anm__btn-delete mr-2" title="Delete">#</div>`)
				.click(() => {
					delete this._anims[anim.uid];
					this._anim_list.remove("uid", anim.uid);
					this._doSaveStateDebounced();
				});

			return $$`<div class="anm__row">
				<label class="col-1 flex-vh-center full-height"><input type="checkbox"></label>
				${$name}
				<div class="anm__row-controls col-2 text-center">
					${$btnDuplicate}
					${$btnExport}
					${$btnDelete}
				</div>
				<div class="hidden uid">${anim.uid}</div>
			</div>`;
		},
		// endregion main

		// region scene
		_scene_getSelected () {
			return this._scene_list.items.filter(it => $(it.elm).find("input[type=checkbox]").prop("checked"));
		},

		_scene_addScene (scene) {
			if (scene == null) return console.error(`Scene was null!`);

			const lastSearch = d20plus.ut.getSearchTermAndReset(this._scene_list);
			this._scenes[scene.uid] = scene;
			this._scene_$wrpList.append(this._scene_$getListItem(scene));

			this._scene_list.reIndex();
			if (lastSearch) this._scene_list.search(lastSearch);
			this._scene_list.sort("name");

			this._doSaveStateDebounced();
		},

		_scene_$getListItem (scene) {
			const $name = $(`<div class="name readable col-9 clickable" title="Edit Animation">${scene.name}</div>`)
				.click(() => this._scene_openEditor(scene));

			const $btnDuplicate = $(`<div class="btn anm__row-btn pictos mr-2" title="Duplicate">F</div>`)
				.click(() => {
					const copy = MiscUtil.copy(scene);
					copy.name = `${copy.name}_copy`;
					copy.uid = this._scene_id++;
					this._scene_addScene(copy);
				});

			const $btnExport = $(`<div class="btn anm__row-btn pictos mr-2" title="Export to File">I</div>`)
				.click(() => {
					const out = {scenes: [scene]};
					DataUtil.userDownload(`${scene.name}`, out);
				});

			const $btnDelete = $(`<div class="btn anm__row-btn btn-danger pictos anm__btn-delete mr-2" title="Delete">#</div>`)
				.click(() => {
					delete this._scenes[scene.uid];
					this._scene_list.remove("uid", scene.uid);
					this._doSaveStateDebounced();
				});

			return $$`<div class="flex-v-center mb-2">
				<label class="col-1 flex-vh-center full-height"><input type="checkbox"></label>
				${$name}
				<div class="anm__row-controls col-2 text-center">
					${$btnDuplicate}
					${$btnExport}
					${$btnDelete}
				</div>
				<div class="uid hidden">${scene.uid}</div>
			</div>`
		},

		_scene_doPopulateList () {
			this._scene_$wrpList.empty();
			Object.values(this._scenes).forEach(scene => this._scene_$wrpList.append(this._scene_$getListItem(scene)));

			this._scene_list = new List("token-animator-scene-list-container", {
				valueNames: [
					"name",
					"uid"
				]
			});
		},

		_scene_init () {
			this._scene_$btnAdd = this._$winScene.find(`[name="btn-add"]`);
			this._scene_$btnImport = this._$winScene.find(`[name="btn-import"]`);
			this._scene_$btnExport = this._$winScene.find(`[name="btn-export"]`);
			this._scene_$btnDelete = this._$winScene.find(`[name="btn-delete"]`);
			this._scene_$cbAll = this._$winScene.find(`[name="cb-all"]`);
			this._scene_$wrpList = this._$winScene.find(`.list`);

			this._scene_list = null;

			this._scene_$cbAll.click(() => {
				const toVal = this._scene_$cbAll.prop("checked");
				this._scene_list.items.forEach(it => $(it.elm).find("input[type=checkbox]").prop("checked", toVal));
			});

			this._scene_$btnAdd.off("click").click(() => this._scene_addScene(this._scene_getNewScene()));

			this._scene_$btnImport.click(async () => {
				await this._shared_doImport(
					"scenes",
					"scene",
					this._scene_getNextId.bind(this),
					this._shared_getNextName.bind(this, this._scenes),
					this._scene_getValidationMessage.bind(this),
					this._scene_addScene.bind(this),
					"uid", "name", "anims" // required properties
				);
			});

			this._scene_$btnExport.click(() => {
				const out = {
					scenes: this._scene_getSelected()
						.map(it => this._scenes[it.values().uid])
				};
				DataUtil.userDownload("scenes", out);
			});

			this._scene_$btnDelete.click(() => {
				const sel = this._scene_getSelected();
				if (!sel.length) return;
				if (!confirm("Are you sure?")) return;
				sel.forEach(it => {
					const uid = it.values()._scene_id;
					delete this._scenes[uid];
					this._scene_list.remove("uid", uid);
				});
				this._doSaveStateDebounced();
			});
		},

		_scene_getNextId () {
			return this._scene_id++;
		},

		_scene_getNewScene () {
			return {
				uid: this._scene_getNextId(),
				name: this._shared_getNextName(this._scenes, "new_scene"),
				anims: []
				/*
				Anims array structure:
				[
					...,
					{
						tokenId: "",
						animUid: "",
						offset: 0
					},
					...
				]
				 */
			}
		},

		_scene_openEditor (scene) {
			scene = MiscUtil.copy(scene);
			scene.anims = scene.anims || []; // handle legacy data
			const editorOptions = {};

			const $winEditor = $(this._html_template_scene_editor)
				.attr("title", `Scene Editor - ${scene.name}`)
				.appendTo($("body"));

			const $iptName = $winEditor.find(`[name="ipt-name"]`).disableSpellcheck()
				.val(scene.name)
				.change(() => {
					scene.name = $iptName.val().trim();
					$winEditor.dialog("option", "title", `Scene Editor - ${$iptName.val()}`);
				});
			const $btnSave = $winEditor.find(`[name="btn-save"]`);
			const $btnExportFile = $winEditor.find(`[name="btn-export-file"]`);
			const $btnAdd = $winEditor.find(`[name="btn-add"]`);
			const $wrpRows = $winEditor.find(`.anm-edit__ipt-rows-wrp`);

			$btnSave.off("click").click(() => {
				const msg = this._scene_getValidationMessage(scene);
				if (msg) return d20plus.ut.chatLog(msg);

				// we passed validation
				this._scenes[scene.uid] = scene;

				this._doSaveStateDebounced();

				const matches = this._scene_list.get("uid", scene.uid);
				if (matches.length) {
					matches[0].values({name: scene.name})
				}

				d20plus.ut.chatLog("Saved!");
			});

			$btnExportFile.off("click").click(() => {
				const out = {scenes: [scene]};
				DataUtil.userDownload(`${scene.name}`, out);
			});

			$btnAdd.off("click").click(() => $wrpRows.append(this._scene_$getEditorRow(editorOptions, scene)));

			$wrpRows.empty();
			scene.anims.forEach(animMeta => $wrpRows.append(this._scene_$getEditorRow(editorOptions, scene, animMeta)));

			$winEditor.dialog({
				resizable: true,
				width: 800,
				height: 600,
				close: () => {
					setTimeout(() => $winEditor.remove())
				}
			});
		},

		_scene_$getEditorRow (editorOptions, scene, animMeta) {
			if (!animMeta) {
				animMeta = {
					offset: 0
				};
				scene.anims.push(animMeta);
			}

			const $btnSelToken = $(`<button class="btn anm__row-btn">Select Token</button>`)
				.click(() => {
					let lastSelectedTokenId = null;
					const $wrpTokens = $$`<div class="anm-scene__wrp-tokens"></div>`;

					const $selPage = $(`<select><option disabled value="">Select Page</option></select>`)
						.change(() => {
							lastSelectedTokenId = null;
							$wrpTokens.empty();

							const page = d20.Campaign.pages.get(d20plus.ut.get$SelValue($selPage));
							editorOptions.lastPageId = d20plus.ut.get$SelValue($selPage);

							if (page.thegraphics && page.thegraphics.length) {
								const tokens = page.thegraphics.models
									.filter(it => it.attributes.type === "image")
									.map(it => ({
										id: it.id,
										name: it.attributes.name || "(Unnamed)",
										imgsrc: it.attributes.imgsrc
									}))
									.sort((a, b) => SortUtil.ascSortLower(a.name, b.name));
								tokens.forEach(it => {
									const $wrpToken = $$`<div class="anm-scene__wrp-token">
											<div class="no-shrink flex-vh-center" style="width: 80px; height: 80px;">
												<img 
													class="no-shrink" 
													style="max-width: 80px; max-height: 80px;" 
													src="${it.imgsrc}"
												>
											</div>
											<div class="no-shrink full-width flex-vh-center anm-scene__wrp-token-name">
												<span title="${it.name}" class="anm-scene__wrp-token-name-inner">${it.name}</span>
											</div>
										</div>`.click(() => {
										$wrpTokens.find(`.anm-scene__wrp-token`).removeClass(`anm-scene__wrp-token--active`);
										$wrpToken.addClass(`anm-scene__wrp-token--active`);
										lastSelectedTokenId = it.id;
									}).appendTo($wrpTokens);
								});
							} else $wrpTokens.append("There are no tokens on this page!");
						});
					// TODO alphabetise pages
					d20.Campaign.pages
						.forEach(it => $(`<option value="${it.id}"></option>`).text(it.attributes.name || "(Unnamed)").appendTo($selPage));
					// default re-display last page
					if (editorOptions.lastPageId && d20.Campaign.pages.get(editorOptions.lastPageId)) $selPage.val(editorOptions.lastPageId).change();
					else $selPage[0].selectedIndex = 0;

					const $dialog = $$`
							<div title="Select Token">
								<div class="flex-col full-width full-height">
									<div class="mb-2 no-shrink">${$selPage}</div>
									${$wrpTokens}
								</div>
							</div>
						`.appendTo($("body"));

					$dialog.dialog({
						dialogClass: "no-close",
						buttons: [
							{
								text: "Cancel",
								click: function () {
									$(this).dialog("close");
									$dialog.remove();
								}
							},
							{
								text: "OK",
								click: function () {
									$(this).dialog("close");
									$dialog.remove();

									if (lastSelectedTokenId != null) {
										animMeta.tokenId = lastSelectedTokenId;
										$wrpToken.html(getTokenPart());
										$wrpTokenName.html(getTokenNamePart());
									}
								}
							}
						],
						width: 640,
						height: 480
					});
				});
			const getTokenPart = () => {
				const token = animMeta.tokenId ? d20plus.ut.getTokenById(animMeta.tokenId) : null;
				return token ? `<img src="${token.attributes.imgsrc}" style="max-width: 40px; max-height: 40px;">` : "";
			};
			const getTokenNamePart = () => {
				const token = animMeta.tokenId ? d20plus.ut.getTokenById(animMeta.tokenId) : null;
				return token ? token.attributes.name : "";
			};
			const $wrpToken = $(`<div>${getTokenPart()}</div>`);
			const $wrpTokenName = $(`<div>${getTokenNamePart()}</div>`);

			const $btnSelAnim = $(`<button class="btn anm__row-btn">Select Animation</button>`)
				.click(async () => {
					const anim = await this.pSelectAnimation(editorOptions.lastAnimUid);
					if (anim != null) {
						editorOptions.lastAnimUid = anim;
						animMeta.animUid = anim;
						$wrpAnim.html(getAnimPart())
					}
				});
			const getAnimPart = () => {
				const anim = animMeta.animUid ? this.getAnimation(animMeta.animUid) : null;
				return anim ? anim.name : "";
			};
			const $wrpAnim = $(`<div>${getAnimPart()}</div>`);

			const $iptOffset = $(`<input type="number" min="0" style="max-width: 100%;" class="text-right">`)
				.val(animMeta.offset || 0)
				.change(() => {
					const rawNum = Number($iptOffset.val());
					const num = isNaN(rawNum) ? 0 : rawNum;
					animMeta.offset = Math.max(0, num);
					$iptOffset.val(animMeta.offset);
				});

			const $btnDelete = $(`<button class="btn btn-danger anm__row-btn pictos">#</button>`)
				.click(() => {
					scene.anims.splice(scene.anims.indexOf(animMeta), 1);
					$out.remove();
				});

			const $out = $$`<div class="flex-vh-center mb-1">
					<div class="col-1 text-center">${$wrpToken}</div>
					<div class="col-2 text-center">${$wrpTokenName}</div>
					<div class="col-2 text-center">${$btnSelToken}</div>
					
					<div class="col-2 text-center">${$wrpAnim}</div>
					<div class="col-2 text-center">${$btnSelAnim}</div>
					
					<div class="col-2">${$iptOffset}</div>
					
					<div class="col-1 text-center">${$btnDelete}</div>
				</div>`;
			return $out;
		},

		_scene_getValidationMessage (scene) {
			// validate name
			return this._shared_getValidNameMsg(scene, this._scenes);
		},
		// endregion

		// region rescue
		_rescue_getSelected () {
			return this._rescue_list.items.filter(it => $(it.elm).find("input[type=checkbox]").prop("checked"));
		},

		_rescue_getListItem (page, imgUrl, tokenName, _tokenId) {
			return `<label class="flex-v-center">
				<div class="col-1 flex-vh-center full-height"><input type="checkbox"></div>
				<div class="page col-4">${page}</div>				
				<div class="col-2">
					<a href="${imgUrl}" target="_blank"><img src="${imgUrl}" style="max-width: 40px; max-height: 40px;"></a>
				</div>				
				<div class="col-5 tokenName">${tokenName || "(unnamed)"}</div>
				<div class="_tokenId hidden">${_tokenId}</div>		
			</label>`
		},

		_rescue_doPopulateList () {
			let temp = "";

			const pageW = d20.Campaign.activePage().attributes.width * 70;
			const pageH = d20.Campaign.activePage().attributes.height * 70;

			const outOfBounds = d20.Campaign.activePage().thegraphics.models.filter(tokenModel => {
				return tokenModel.view.graphic.scaleX < 0.01 ||
					tokenModel.view.graphic.scaleX > 50.0 ||
					tokenModel.view.graphic.scaleY < 0.01 ||
					tokenModel.view.graphic.scaleY > 50.0 ||
					tokenModel.attributes.left < 0 ||
					tokenModel.attributes.left > pageW ||
					tokenModel.attributes.top < 0 ||
					tokenModel.attributes.top > pageH;
			});

			outOfBounds.forEach(token => {
				const pageId = token.attributes.page_id;
				const pageName = (d20.Campaign.pages.get(pageId) || {attributes: {name: "(unknown)"}}).attributes.name;

				temp += this._rescue_getListItem(
					pageName,
					token.attributes.imgsrc,
					token.attributes.name,
					token.attributes.id,
				)
			});

			this._rescue_$wrpList.empty().append(temp);

			this._rescue_list = new List("token-animator-rescue-list-container", {
				valueNames: [
					"page",
					"tokenName",
					"_tokenId",
				]
			});
		},

		_rescue_init () {
			this._rescue_$btnRefresh = this._$winRescue.find(`[name="btn-refresh"]`);
			this._rescue_$btnRescue = this._$winRescue.find(`[name="btn-rescue"]`);
			this._rescue_$cbAll = this._$winRescue.find(`[name="cb-all"]`);
			this._rescue_$wrpList = this._$winRescue.find(`.list`);

			this._rescue_list = null;

			this._rescue_$cbAll.click(() => {
				const toVal = this._rescue_$cbAll.prop("checked");
				this._rescue_list.items.forEach(it => $(it.elm).find("input[type=checkbox]").prop("checked", toVal));
			});

			this._rescue_$btnRefresh.click(() => this._rescue_doPopulateList());

			this._rescue_$btnRescue.off("click").click(() => {
				const sel = this._rescue_getSelected();
				if (!sel.length) return d20plus.ut.chatLog("Please select some items from the list!");

				sel.map(it => it.values()).forEach(it => {
					// disable animations for token
					delete d20plus.anim.animator._tracker[it._tokenId];

					// reset token properties; place in the top-left corner of the canvas on the GM layer
					const token = d20plus.ut.getTokenById(it._tokenId);
					token.attributes.scaleX = 1.0;
					token.view.graphic.scaleX = token.attributes.scaleX;
					token.attributes.scaleY = 1.0;
					token.view.graphic.scaleY = token.attributes.scaleY;
					token.attributes.flipv = false;
					token.attributes.fliph = false;
					token.attributes.left = 35;
					token.attributes.top = 35;
					token.attributes.width = 70;
					token.attributes.height = 70;
					token.attributes.rotation = 0;
					token.attributes.layer = "gmlayer";
					token.save();
				});

				d20plus.ut.chatLog("Rescued tokens will be placed on the GM layer, in the top-left corner of the map");
				this._rescue_doPopulateList();
			});
		},
		// endregion rescue

		// region disabler
		_dis_getSelected () {
			return this._dis_list.items.filter(it => $(it.elm).find("input[type=checkbox]").prop("checked"));
		},

		_dis_getListItem (page, imgUrl, tokenName, animName, _tokenId, _animUid) {
			return `<label class="flex-v-center">
				<div class="col-1 flex-vh-center full-height"><input type="checkbox"></div>
				<div class="page col-3">${page}</div>				
				<div class="col-2">
					<a href="${imgUrl}" target="_blank"><img src="${imgUrl}" style="max-width: 40px; max-height: 40px;"></a>
				</div>				
				<div class="col-3 tokenName">${tokenName || "(unnamed)"}</div>				
				<div class="col-3 animName">${animName}</div>
				<div class="_tokenId hidden">${_tokenId}</div>				
				<div class="_animUid hidden">${_animUid}</div>				
			</label>`
		},

		_dis_doPopulateList () {
			let temp = "";

			Object.entries(d20plus.anim.animator._tracker).forEach(([tokenId, tokenMeta]) => {
				const imgUrl = tokenMeta.token.attributes.imgsrc;
				const pageId = tokenMeta.token.attributes.page_id;
				const pageName = (d20.Campaign.pages.get(pageId) || {attributes: {name: "(unknown)"}}).attributes.name;

				Object.entries(tokenMeta.active).forEach(([animUid, animMeta]) => {
					temp += this._dis_getListItem(
						pageName,
						imgUrl,
						tokenMeta.token.attributes.name,
						d20plus.anim.animatorTool.getAnimation(animUid).name,
						tokenId,
						animUid
					)
				});
			});

			this._dis_$wrpList.empty().append(temp);

			this._dis_list = new List("token-animator-disable-list-container", {
				valueNames: [
					"page",
					"tokenName",
					"animName",
					"_tokenId",
					"_animUid"
				]
			});
		},

		_dis_init () {
			this._dis_$btnRefresh = this._$winDisable.find(`[name="btn-refresh"]`);
			this._dis_$btnStop = this._$winDisable.find(`[name="btn-stop"]`);
			this._dis_$cbAll = this._$winDisable.find(`[name="cb-all"]`);
			this._dis_$wrpList = this._$winDisable.find(`.list`);

			this._dis_list = null;

			this._dis_$cbAll.click(() => {
				const toVal = this._dis_$cbAll.prop("checked");
				this._dis_list.items.forEach(it => $(it.elm).find("input[type=checkbox]").prop("checked", toVal));
			});

			this._dis_$btnRefresh.click(() => this._dis_doPopulateList());

			this._dis_$btnStop.off("click").click(() => {
				const sel = this._dis_getSelected();
				if (!sel.length) return d20plus.ut.chatLog("Please select some items from the list!");
				if (!confirm("Are you sure?")) return;

				sel.map(it => it.values()).forEach(it => {
					delete d20plus.anim.animator._tracker[it._tokenId].active[it._animUid];

					if (!hasAnyKey(d20plus.anim.animator._tracker[it._tokenId].active)) {
						delete d20plus.anim.animator._tracker[it._tokenId];
					}
				});

				d20plus.anim.animator.saveState();
				this._dis_doPopulateList();
			});
		},
		// endregion disabler

		// region editor
		_edit_openEditor (anim) {
			const $winEditor = $(this._html_template_editor)
				.attr("title", `Animation Editor - ${anim.name}`)
				.appendTo($("body"));

			$winEditor.dialog({
				resizable: true,
				width: 800,
				height: 600,
				close: () => {
					setTimeout(() => $winEditor.remove())
				}
			});

			const $iptName = $winEditor.find(`[name="ipt-name"]`).disableSpellcheck();
			const $btnSave = $winEditor.find(`[name="btn-save"]`);
			const $btnHelp = $winEditor.find(`[name="btn-help"]`);
			const $btnAddCommand = $winEditor.find(`[name="btn-add-command"]`);
			const $btnExportFile = $winEditor.find(`[name="btn-export-file"]`);
			const $btnValidate = $winEditor.find(`[name="btn-validate"]`);
			const $btnEditText = $winEditor.find(`[name="btn-edit-text"]`);
			const $iptLines = $winEditor.find(`[name="ipt-lines"]`);
			const $wrpRows = $winEditor.find(`.anm-edit__ipt-lines-wrp--gui`);

			anim.lines = anim.lines || [];
			$iptName
				.val(anim.name)
				.change(() => {
					$winEditor.dialog("option", "title", `Animation Editor - ${$iptName.val()}`);
				});

			// map to strings to ensure fresh array
			let myLines = anim.lines.map(it => typeof it === "string" ? it : it.line);

			const doDisplayLines = () => {
				$iptLines.val(myLines.map(it => typeof it === "string" ? it : it.line).join("\n"));
			};

			const gui_getTitleFromType = (type, doRemoveExact) => {
				const clean = doRemoveExact ? type.replace(/exact/gi, "") : type;

				const splCaps = clean.split(/([A-Z])/g).filter(it => it.trim());
				const stack = [];
				for (let i = 0; i < splCaps.length; ++i) {
					const tok = splCaps[i];
					if (i % 2 === 0) stack.push(tok);
					else stack[stack.length - 1] = `${stack.last()}${tok}`;
				}
				return stack.join(" ");
			};

			const gui_getBasicRowMeta = (myLines, line, isDuration) => {
				const parsed = line.parsed;

				const _getTitleMeta = () => {
					const clean = parsed._type.replace(/exact/gi, "");

					const text = gui_getTitleFromType(parsed._type, true);

					return {
						text,
						className: `anm-edit__gui-row-name--${clean}`
					}
				};

				const doUpdate = () => {
					parsed.start = Math.round(Number($iptStart.val()));
					if (isDuration) parsed.duration = Math.round(Number($iptDuration.val()));
					line.line = d20plus.anim.lineFromParsed(parsed);
				};

				const $btnRemove = $(`<button class="btn btn-danger mr-2">Delete</button>`).click(() => {
					myLines.splice(myLines.indexOf(line), 1);
					$row.remove();
				});

				const $iptStart = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.start);
				const $iptDuration = isDuration ? $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.duration) : null;

				const $wrpHeaders = $$`<div class="flex-v-center mb-2">
						<div class="col-2 bold flex-vh-center">Start Time (ms)</div>
						${isDuration ? `<div class="col-2 bold flex-vh-center">Duration (ms)</div>` : ""}
					</div>`;

				const $wrpInputs = $$`<div class="flex-v-center">
						<div class="col-2 flex-vh-center">${$iptStart}</div>
						${isDuration ? $$`<div class="col-2 flex-vh-center">${$iptDuration}</div>` : ""}
					</div>`;

				const titleMeta = _getTitleMeta();
				const $dispName = $(`<div class="bold anm-edit__gui-row-name ${titleMeta.className}">${titleMeta.text}</div>`);
				const $row = $$`<div class="flex-col full-width anm-edit__gui-row">
						<div class="split flex-v-center mb-2">
							<div class="full-width flex-v-center full-height">${$dispName}</div>
							${$btnRemove}
						</div>			
						${$wrpHeaders}
						${$wrpInputs}
					</div>`;

				return {$row, doUpdate, $wrpHeaders, $wrpInputs, $dispName};
			};

			const gui_$getBtnAnim = (fnUpdate, $iptAnim) => {
				return $(`<button class="btn btn-xs mr-2 pictos">s</button>`)
					.click(async () => {
						const name = await new Promise(resolve => {
							const $selAnim = $(`<select>
							<option value="-1">(None)</option>
							${d20plus.anim.animatorTool.getAnimations().map(it => `<option value="${it.uid}">${it.name}</option>`).join("")} 
							</select>`);
							$selAnim[0].selectedIndex = 0;

							const $dialog = $$`<div title="Select Animation">${$selAnim}</div>`.appendTo($("body"));

							$dialog.dialog({
								dialogClass: "no-close",
								buttons: [
									{
										text: "Cancel",
										click: function () {
											$(this).dialog("close");
											$dialog.remove();
										}
									},
									{
										text: "OK",
										click: function () {
											const selected = Number(d20plus.ut.get$SelValue($selAnim));
											$(this).dialog("close");
											$dialog.remove();

											if (~selected) resolve((d20plus.anim.animatorTool.getAnimation(selected) || {}).name);
											else resolve(null);
										}
									}
								]
							});
						});

						if (name != null) {
							$iptAnim.val(name);
							fnUpdate();
						} else if (!allowNone) {
							$iptAnim.val("-");
							fnUpdate();
						}
					});
			};

			const gui_$getWrapped = (it, width, bold) =>  $$`<div class="col-${width} flex-vh-center ${bold ? "bold" : ""}">${it}</div>`;

			const gui_doAddRow = (myLines, line) => {
				const parsed = line.parsed;
				switch (parsed._type) {
					case "Move":
					case "MoveExact": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, true);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.x = $iptX.val().trim() ? Math.round(Number($iptX.val())) : null;
							parsed.y = $iptY.val().trim() ? Math.round(Number($iptY.val())) : null;
							parsed.z = $iptZ.val().trim() ? Math.round(Number($iptZ.val())) : null;
							parsed._type = $cbExact.prop("checked") ? "MoveExact" : "Move";
							line.line = d20plus.anim.lineFromParsed(parsed);
							baseMeta.$dispName.text(parsed._type);
						};

						const $iptX = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.x);
						const $iptY = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.y);
						const $iptZ = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.z);
						const $cbExact = $(`<input type="checkbox">`).prop("checked", parsed._type === "MoveExact").change(() => doUpdate());

						gui_$getWrapped("X", 1, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Y", 1, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Z", 1, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 4).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Is Exact", 1, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptX, 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptY, 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptZ, 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 4).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($cbExact, 1).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Rotate":
					case "RotateExact": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, true);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.degrees = $iptDegrees.val().trim() ? Math.round(Number($iptDegrees.val().trim())) : null;
							parsed._type = $cbExact.prop("checked") ? "RotateExact" : "Rotate";
							line.line = d20plus.anim.lineFromParsed(parsed);
							baseMeta.$dispName.text(parsed._type);
						};

						const $iptDegrees = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.degrees);
						const $cbExact = $(`<input type="checkbox">`).prop("checked", parsed._type === "RotateExact").change(() => doUpdate());

						gui_$getWrapped("Degrees", 2, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 6).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Is Exact", 1, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptDegrees, 2).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 6).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($cbExact, 1).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Copy": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.animation = $iptAnim.val().trim() || null;
							line.line = d20plus.anim.lineFromParsed(parsed);
						};

						const $iptAnim = $(`<input class="full-width mr-1">`).change(() => doUpdate()).val(parsed.animation);
						const $btnSelAnim = gui_$getBtnAnim(doUpdate, $iptAnim);

						gui_$getWrapped("Animation", 3, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptAnim, 3).append($btnSelAnim).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Flip":
					case "FlipExact": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.flipH = $selFlipH.val() === "0" ? null : $selFlipH.val() !== "1";
							parsed.flipV = $selFlipV.val() === "0" ? null : $selFlipV.val() !== "1";
							parsed._type = $cbExact.prop("checked") ? "FlipExact" : "Flip";
							line.line = d20plus.anim.lineFromParsed(parsed);
							baseMeta.$dispName.text(parsed._type);
						};

						const $getSelFlip = () => {
							const VALS = ["(None)", "No", "Yes"];
							return $(`<select class="sel-xs mr-2">${VALS.map((it, i) => `<option value="${i}">${it}</option>`).join("")}</select>`);
						};

						const $selFlipH = $getSelFlip().val(parsed.flipH == null ? "0" : parsed.flipH ? "2" : "1").change(() => doUpdate());
						const $selFlipV = $getSelFlip().val(parsed.flipV == null ? "0" : parsed.flipV ? "2" : "1").change(() => doUpdate());
						const $cbExact = $(`<input type="checkbox">`).prop("checked", parsed._type === "FlipExact").change(() => doUpdate());

						gui_$getWrapped("Flip Horizontally", 3, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Flip Vertically", 3, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 3).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Is Exact", 1, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($selFlipH, 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($selFlipV, 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($cbExact, 1).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Scale":
					case "ScaleExact": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, true);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.scaleX = $iptScaleX.val().trim() ? Number($iptScaleX.val()) : null;
							parsed.scaleY = $iptScaleY.val().trim() ? Number($iptScaleY.val()) : null;
							parsed._type = $cbExact.prop("checked") ? "ScaleExact" : "Scale";
							line.line = d20plus.anim.lineFromParsed(parsed);
							baseMeta.$dispName.text(parsed._type);
						};

						const $iptScaleX = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.scaleX);
						const $iptScaleY = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.scaleY);
						const $cbExact = $(`<input type="checkbox">`).prop("checked", parsed._type === "ScaleExact").change(() => doUpdate());

						gui_$getWrapped("Horizontal Scale", 3, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Vertical Scale", 3, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Is Exact", 1, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptScaleX, 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptScaleY, 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($cbExact, 1).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Layer": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.layer = $selLayer.val().trim() ? $selLayer.val() : null;
							line.line = d20plus.anim.lineFromParsed(parsed);
						};

						const $selLayer = $(`<select class="mr-2 sel-xs">
							<option value="">Select a layer...</option>
							${d20plus.ut.LAYERS.map(l => `<option value="${l}">${d20plus.ut.layerToName(l)}</option>`).join("")}
							</select>`)
							.change(() => doUpdate()).val(parsed.layer);

						gui_$getWrapped("Layer", 3, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($selLayer, 3).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "Lighting":
					case "LightingExact": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, true);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.lightRadius = $iptLightRadius.val().trim() ? Math.round(Number($iptLightRadius.val())) : null;
							parsed.dimStart = $iptDimStart.val().trim() ? Math.round(Number($iptDimStart.val())) : null;
							parsed.degrees = $iptDegrees.val().trim() ? Math.round(Number($iptDegrees.val())) : null;
							parsed._type = $cbExact.prop("checked") ? "LightingExact" : "Lighting";
							line.line = d20plus.anim.lineFromParsed(parsed);
							baseMeta.$dispName.text(parsed._type);
						};

						const $iptLightRadius = $(`<input type="number" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.lightRadius);
						const $iptDimStart = $(`<input type="number" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.dimStart);
						const $iptDegrees = $(`<input type="number" min="0" class="full-width mr-2">`).change(() => doUpdate()).val(parsed.degrees);
						const $cbExact = $(`<input type="checkbox">`).prop("checked", parsed._type === "MoveExact").change(() => doUpdate());

						gui_$getWrapped("Light Radius", 2, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Dim Start", 2, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Angle", 2, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Is Exact", 1, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptLightRadius, 2).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptDimStart, 2).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptDegrees, 2).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($cbExact, 1).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "SetProperty":
					case "SumProperty": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.prop = $selProp.val();
							try { parsed.value = JSON.parse($iptVal().trim()); }
							catch (ignored) { parsed.value = $iptVal.val(); }
							line.line = d20plus.anim.lineFromParsed(parsed);
							parsed._type = $selMode.val();
							baseMeta.$dispName.text(parsed._type);
						};

						const $selProp = $(`<select class="mr-2 sel-xs">${d20plus.anim._PROP_TOKEN.sort(SortUtil.ascSortLower).map(it => `<option>${it}</option>`).join("")}</select>`)
							.change(() => doUpdate()).val(parsed.prop);
						const $iptVal = $(`<textarea class="full-width my-0" style="resize: vertical;"></textarea>`).change(() => doUpdate()).val(parsed.value);
						const $selMode = $(`<select class="mr-2 sel-xs">
							<option value="SetProperty">Set</option>
							<option value="SumProperty">Sum</option>
						</select>`)
							.val(parsed._type)
							.change(() => doUpdate());

						gui_$getWrapped("Property", 4, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Value", 3, true).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpHeaders);
						gui_$getWrapped("Mode", 2, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($selProp, 4).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($iptVal, 3).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped("", 1).appendTo(baseMeta.$wrpInputs);
						gui_$getWrapped($selMode, 2).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "TriggerMacro": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.macro = $iptMacro.val().trim() ? $iptMacro.val().trim() : null;
							line.line = d20plus.anim.lineFromParsed(parsed);
						};

						const $iptMacro = $(`<input class="full-width mr-2">`).change(() => doUpdate()).val(parsed.macro);
						// TODO add macro search button?

						gui_$getWrapped("Macro Name", 4, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptMacro, 4).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					case "TriggerAnimation": {
						const baseMeta = gui_getBasicRowMeta(myLines, line, false);

						const doUpdate = () => {
							baseMeta.doUpdate();
							parsed.animation = $iptAnim.val().trim() ? $iptAnim.val().trim() : null;
							line.line = d20plus.anim.lineFromParsed(parsed);
						};

						const $iptAnim = $(`<input class="full-width mr-1">`).change(() => doUpdate()).val(parsed.animation);
						const $btnSelAnim = gui_$getBtnAnim(doUpdate, $iptAnim);

						gui_$getWrapped("Animation", 3, true).appendTo(baseMeta.$wrpHeaders);

						gui_$getWrapped($iptAnim, 3).append($btnSelAnim).appendTo(baseMeta.$wrpInputs);

						$wrpRows.append(baseMeta.$row);

						break;
					}
					default: throw new Error(`Unhandled type "${parsed._type}"`);
				}
			};

			const doDisplayRows = () => {
				$wrpRows.empty();
				const wrpMyLines = {lines: myLines};
				this._edit_convertLines(wrpMyLines);

				myLines.forEach(line => {
					if (line.error) {
						console.error(`Failed to create GUI row from line "${line.line}"!`);
						console.error(line.error)
					} else gui_doAddRow(myLines, line);
				});
			};

			const getValidationMessage = () => {
				if ($btnEditText.hasClass("active")) {
					// create a fake animation object, and check it for errors
					const toValidate = {
						uid: anim.uid, // pass out UID, so the validator can ignore our old data when checking duplicate names
						name: $iptName.val(),
						lines: $iptLines.val().split("\n")
					};
					return this._edit_getValidationMessage(toValidate);
				}
				// (assume the GUI version passes validation)
				return null;
			};

			$btnSave.off("click").click(() => {
				if ($btnEditText.hasClass("active")) {
					const msg = getValidationMessage();
					if (msg) return d20plus.ut.chatLog(msg);

					// we passed validation
					anim.name = $iptName.val();
					anim.lines = $iptLines.val().split("\n");
				} else {
					const nameMsg = this._shared_getValidNameMsg({name: $iptName.val(), uid: anim.uid}, this._anims);
					if (nameMsg) return d20plus.ut.chatLog(nameMsg);

					anim.name = $iptName.val();
					anim.lines = myLines.map(it => typeof it === "string" ? it : it.line);
				}
				this._doSaveStateDebounced();

				const matches = this._anim_list.get("uid", anim.uid);
				if (matches.length) matches[0].values({name: anim.name});

				d20plus.ut.chatLog("Saved!");
			});

			$btnExportFile.off("click").click(() => {
				const out = {animations: [this._main_getExportableAnim(anim)]};
				DataUtil.userDownload(`${anim.name}`, out);
			});

			$btnValidate.off("click").click(() => {
				const msg = getValidationMessage();
				d20plus.ut.chatLog(msg || "Valid!");
			});

			$btnHelp.click(() => {
				d20plus.ut.chatLog(`<a href="https://wiki.5e.tools/index.php/Feature:_Animator" target="_blank">View the Wiki page for help!</a>`);
				window.open("https://wiki.5e.tools/index.php/Feature:_Animator");
			});

			let lastSelCommand = null;
			$btnAddCommand.click(async () => {
				const _KEYS = [...new Set(Object.keys(d20plus.anim.COMMAND_TO_SHORT).map(it => it.replace(/exact/gi, "")))];

				const type = await new Promise(resolve => {
					const $selCommand = $(`<select>
					<option disabled value="-1">Select Command...</option>
					${_KEYS.map((it, i) => `<option value="${i}">${gui_getTitleFromType(it, false)}</option>`).join("")}
					</select>`);

					if (lastSelCommand != null) $selCommand.val(lastSelCommand);
					else $selCommand[0].selectedIndex = 0;

					const $dialog = $$`<div title="Select Command">${$selCommand}</div>`.appendTo($("body"));

					$dialog.dialog({
						dialogClass: "no-close",
						buttons: [
							{
								text: "Cancel",
								click: function () {
									$(this).dialog("close");
									$dialog.remove();
								}
							},
							{
								text: "OK",
								click: function () {
									const ix = Number(d20plus.ut.get$SelValue($selCommand));
									$(this).dialog("close");
									$dialog.remove();

									if (~ix) {
										resolve(_KEYS[ix]);
										lastSelCommand = String(ix);
									} else resolve(null);
								}
							}
						]
					});
				});

				if (type == null) return;

				const nuLine = (() => {
					const short = d20plus.anim.COMMAND_TO_SHORT[type];
					if (!short) throw new Error(`No short form found for "${short}"`);
					const args = d20plus.anim.SHORT_TO_DEFAULT_ARGS[short];
					if (!args) throw new Error(`No default args found for "${short}"`);
					return `${short} ${args}`;
				})();

				myLines.push(nuLine);
				const wrpMyLines = {lines: myLines};
				this._edit_convertLines(wrpMyLines);
				gui_doAddRow(myLines, myLines.last());
			});

			$btnEditText.click(() => {
				const isTextModeNxt = !$btnEditText.hasClass("active");
				if (isTextModeNxt) {
					// myLines will already be up-to-date due to UI state changes; simply switch to text display
					doDisplayLines();
				} else {
					// validate + update state
					const msg = getValidationMessage();
					if (msg) return d20plus.ut.chatLog(msg);

					myLines = $iptLines.val().split("\n").map(it => it.trim()).filter(Boolean);
					doDisplayRows();
				}

				$btnEditText.toggleClass("active");
				$winEditor.toggleClass("anm-edit__text", isTextModeNxt);
				$winEditor.toggleClass("anm-edit__gui", !isTextModeNxt);
			});

			doDisplayRows();
		},

		/**
		 * Returns `null` if valid, or an error message if invalid.
		 * @private
		 */
		_edit_getValidationMessage (anim) {
			// validate name
			const nameMsg = this._shared_getValidNameMsg(anim, this._anims);
			if (nameMsg) return nameMsg;

			// validate lines
			this._edit_convertLines(anim);

			const badLines = anim.lines.filter(c => c.error);
			if (badLines.length) {
				return `Invalid, the following lines could not be parsed:\n${badLines.map(c => `${c.error} at line "${c.line}"`).join("\n")}`;
			}

			return null;
		},

		_edit_convertLines (anim) {
			for (let i = 0; i < anim.lines.length; ++i) {
				const line = anim.lines[i];
				if (typeof line === "string") anim.lines[i] = Command.fromString(line);
			}
		},
		// endregion editor
	};

	d20plus.tool.tools.push(d20plus.anim.animatorTool);

	function hasAnyKey (object) {
		for (const k in object) {
			if (!object.hasOwnProperty(k)) continue;
			return true;
		}
		return false;
	}

	d20plus.anim.animator = {
	   /*
		_tracker: {
			tokenId: {
				token: {...}, // Roll20 token
				active: {
					// only one instance of an animation can be active on a token at a time
					animUid: {
						queue: [...], // returned by getAnimQueue
						start, // start time
						lastTick, // last tick time
						lastAlpha // last alpha value passed -- used for deserialization
					},
					... // other animations
				}
			}
		}
		*/
		_tracker: {},
		_restTicks: 1,

		__tickCount: 0,

		startAnimation (token, animUid, options) {
			options = options || {};

			const anim = d20plus.anim.animatorTool.getAnimation(animUid);
			const queue = d20plus.anim.animatorTool.getAnimQueue(anim, options.offset || 0);

			this._tracker[token.id] = this._tracker[token.id] || {token, active: {}};
			const time = (new Date).getTime();
			this._tracker[token.id].active[animUid] = {
				queue,
				start: time,
				lastTick: time
			};
		},

		endAnimation (token, animUid) {
			if (this._tracker[token.id] && this._tracker[token.id].active[animUid]) {
				delete this._tracker[token.id].active[animUid];

				if (hasAnyKey(this._tracker[token.id].active)) delete this._tracker[token.id];
			}
		},

		setRestTicks (tickRate) {
			this._restTicks = tickRate;
		},

		_lastTickActive: false,
		_tickTimeout: null,
		doTick () {
			if (this._tickTimeout) clearTimeout(this._tickTimeout);

			if (this._hasAnyActive()) {
				// if we've been sleeping, reset start times
				// prevents an initial "jolt" as anims suddenly have catch up on 1.5s of lag
				if (!this._lastTickActive) {
					this._lastTickActive = true;
					const time = (new Date()).getTime();

					for (const tokenId in this._tracker) {
						if (!this._tracker.hasOwnProperty(tokenId)) continue;
						const tokenMeta = this._tracker[tokenId];

						for (const animUid in tokenMeta.active) {
							if (!tokenMeta.active.hasOwnProperty(animUid)) continue;
							const instance = tokenMeta.active[animUid];
							instance.start = time;
							instance.lastTick = time;
						}
					}
				}

				this._doTick();
			} else {
				this._lastTickActive = false;
				// if none are active, sleep for 1.5 seconds
				this._tickTimeout = setTimeout(() => this.doTick(), 1500);
			}
		},

		_saveState () {
			const toSave = {};
			Object.entries(this._tracker).forEach(([tokenId, tokenMeta]) => {
				const saveableTokenMeta = {active: {}};

				Object.entries(tokenMeta.active).forEach(([animUid, state]) => {
					saveableTokenMeta.active[animUid] = {
						queue: state.queue.map(it => it.serialize()),
						lastAlpha: state.lastAlpha
					};
				});

				toSave[tokenId] = saveableTokenMeta;
			});

			Campaign.save({
				bR20tool__anim_running: toSave
			});
		},

		saveState () {
			if (d20plus.anim.animatorTool.isSavingActive()) this._doSaveStateThrottled();
		},

		loadState () {
			const time = (new Date()).getTime();
			const saved = Campaign.attributes.bR20tool__anim_running ? MiscUtil.copy(Campaign.attributes.bR20tool__anim_running) : {};
			const toLoad = {};
			Object.entries(saved).forEach(([tokenId, savedTokenMeta]) => {
				// load real token
				const token = d20plus.ut.getTokenById(tokenId);
				if (!token) return console.log(`Token ${tokenId} not found!`);
				const tokenMeta = {};
				tokenMeta.token = token;

				const active = {};
				Object.entries(savedTokenMeta.active).forEach(([animUid, savedState]) => {
					const anim = d20plus.anim.animatorTool.getAnimation(animUid);
					if (!anim) return console.log(`Animation ${animUid} not found!`);

					active[animUid] = {
						queue: savedState.queue.map(it => d20plus.anim.deserialize(it)),
						start: time - savedState.lastAlpha,
						lastTick: time
					}
				});

				tokenMeta.active = active;

				toLoad[tokenId] = tokenMeta;
			});

			this._tracker = toLoad;
		},

		_hasAnyActive () {
			return hasAnyKey(this._tracker);
		},

		_doTick () {
			// higher tick rate = slower
			if (++this.__tickCount >= this._restTicks) {
				this.__tickCount = 0;
				let anyGlobalModifications = false;

				const time = (new Date()).getTime();

				for (const tokenId in this._tracker) {
					if (!this._tracker.hasOwnProperty(tokenId)) continue;
					const tokenMeta = this._tracker[tokenId];

					let anyModification = false;
					for (const animUid in tokenMeta.active) {
						if (!tokenMeta.active.hasOwnProperty(animUid)) continue;
						const instance = tokenMeta.active[animUid];

						const alpha = time - instance.start;
						const delta = time - instance.lastTick;

						// avoid using fast-loop length optimization, as we'll splice out completed animations
						for (let i = 0; i < instance.queue.length; ++i) {
							anyModification = instance.queue[i].animate(
								tokenMeta.token,
								alpha,
								delta,
								instance.queue
							) || anyModification;

							if (instance.queue[i].hasRun()) {
								instance.queue.splice(i, 1);
								--i;
							}
						}

						// queue empty -> this animation is no longer active
						if (!instance.queue.length) delete tokenMeta.active[animUid];
						else {
							instance.lastTick = time;
							instance.lastAlpha = alpha;
						}
					}

					// no active animations -> stop tracking this token
					if (!hasAnyKey(tokenMeta.active)) delete this._tracker[tokenId];

					// save after applying animations
					if (anyModification) tokenMeta.token.save();
					anyGlobalModifications = anyGlobalModifications || anyModification;
				}

				this.saveState();
				if (anyGlobalModifications) d20.engine.canvas.renderAll();
			}

			requestAnimationFrame(this.doTick.bind(this))
		},

		init () {
			this._doSaveStateThrottled = _.throttle(this._saveState, 100);
			setTimeout(() => {
				this.loadState();
				this._lastTickActive = true;
				this.doTick();
			}, 5000);
		},
	};

	// all properties that can be set via the 'prop' command
	d20plus.anim._PROP_TOKEN = [
		"left",
		"top",
		"width",
		"height",
		"z_index",
		"imgsrc",
		"rotation",
		"type",
		"layer",
		"locked",
		"flipv",
		"fliph",
		"anim_loop",
		"anim_paused_at",
		"anim_autoplay",
		"name",
		"gmnotes", // `escape`d HTML
		"controlledby",
		"represents",
		"bar1_value",
		"bar1_max",
		"bar1_link",
		"bar2_value",
		"bar2_max",
		"bar2_link",
		"bar3_value",
		"bar3_max",
		"bar3_link",
		"aura1_radius",
		"aura1_color",
		"aura1_square",
		"aura2_radius",
		"aura2_color",
		"aura2_square",
		"tint_color",
		"status_dead",
		"statusmarkers",
		"showname",
		"showplayers_name",
		"showplayers_bar1",
		"showplayers_bar2",
		"showplayers_bar3",
		"showplayers_aura1",
		"showplayers_aura2",
		"playersedit_name",
		"playersedit_bar1",
		"playersedit_bar2",
		"playersedit_bar3",
		"playersedit_aura1",
		"playersedit_aura2",
		"light_radius",
		"light_dimradius",
		"light_otherplayers",
		"light_hassight",
		"light_angle",
		"light_losangle",
		"light_multiplier",
		"adv_fow_view_distance",
		"groupwith",
		"sides", // pipe-separated list of `escape`d image URLs
		"currentSide"
	];
	d20plus.anim.VALID_PROP_TOKEN = new Set(d20plus.anim._PROP_TOKEN);

	d20plus.anim.VALID_LAYER = new Set(d20plus.ut.LAYERS);

	d20plus.anim.COMMAND_TO_SHORT = {
		"Move": "mv",
		"MoveExact": "mvx",
		"Rotate": "rot",
		"RotateExact": "rotx",
		"Copy": "cp",
		"Flip": "flip",
		"FlipExact": "flipx",
		"Scale": "scale",
		"ScaleExact": "scalex",
		"Layer": "layer",
		"Lighting": "light",
		"LightingExact": "lightx",
		"SetProperty": "prop",
		"SumProperty": "propSum",
		"TriggerMacro": "macro",
		"TriggerAnimation": "anim",
	};

	d20plus.anim.SHORT_TO_DEFAULT_ARGS = {
		"mv": "0 0 - - -",
		"mvx": "0 0 - - -",
		"rot": "0 0 -",
		"rotx": "0 0 -",
		"cp": "0",
		"flip": "0 - -",
		"flipx": "0 - -",
		"scale": "0 0 - -",
		"scalex": "0 0 - -",
		"layer": "0 -",
		"light": "0 0 - - -",
		"lightx": "0 0 - - -",
		"prop": "0 -",
		"propSum": "0 -",
		"macro": "0 -",
		"anim": "0 -",
	};
}

SCRIPT_EXTENSIONS.push(baseToolAnimator);


function d20plusArt () {
	d20plus.art = {
		button: () => {
			// add external art button was clicked
			const $art = $("#d20plus-artfolder");
			$art.dialog("open");
			const $artList = $art.find(`.list`);
			$artList.empty();

			if (d20plus.art.custom) {
				d20plus.art.custom.forEach(a => {
					const $liArt = getArtLi(a.name, a.url);
					$artList.append($liArt);
				});
			}

			// init list library
			const artList = new List("art-list-container", {
				valueNames: ["name"],
				listClass: "artlist"
			});

			const $btnAdd = $(`#art-list-add-btn`);
			const $iptAddName = $(`#art-list-add-name`);
			const $iptAddUrl = $(`#art-list-add-url`);
			$btnAdd.off("click");
			$btnAdd.on("click", () => {
				const name = $iptAddName.val().trim();
				const url = $iptAddUrl.val().trim();
				if (!name || !url) {
					alert("Missing required fields!")
				} else {
					artList.search();
					artList.filter();
					const $liArt = getArtLi(name, url);
					$artList.append($liArt);
					refreshCustomArtList();
				}
			});

			const $btnMassAdd = $(`#art-list-multi-add-btn`);
			$btnMassAdd.off("click");
			$btnMassAdd.on("click", () => {
				$("#d20plus-artmassadd").dialog("open");
				const $btnMassAddSubmit = $(`#art-list-multi-add-btn-submit`);
				$btnMassAddSubmit.off("click");
				$btnMassAddSubmit.on("click", () => {
					artList.search();
					artList.filter();
					const $iptUrls = $(`#art-list-multi-add-area`);
					const massUrls = $iptUrls.val();
					const spl = massUrls.split("\n").map(s => s.trim()).filter(s => s);
					if (!spl.length) return;
					else {
						const delim = "---";
						const toAdd = [];
						for (const s of spl) {
							if (!s.includes(delim)) {
								alert(`Badly formatted line: ${s}`);
								return;
							} else {
								const parts = s.split(delim);
								if (parts.length !== 2) {
									alert(`Badly formatted line: ${s}`);
									return;
								} else {
									toAdd.push({
										name: parts[0],
										url: parts[1]
									});
								}
							}
						}
						toAdd.forEach(a => {
							$artList.append(getArtLi(a.name, a.url));
						});
						refreshCustomArtList();
						$("#d20plus-artmassadd").dialog("close");
					}
				});
			});

			const $btnDelAll = $(`#art-list-delete-all-btn`);
			$btnDelAll.off("click").on("click", () => {
				$artList.empty();
				refreshCustomArtList();
			});

			makeDraggables();
			d20plus.art.refreshList = refreshCustomArtList;

			function getArtLi (name, url) {
				const showImage = d20plus.cfg.get("interface", "showCustomArtPreview");
				const $liArt = $(`
						<li class="dd-item library-item draggableresult Vetools-draggable-art ui-draggable" data-fullsizeurl="${url}">
							${showImage ? `<img src="${url}" style="width: 30px; max-height: 30px; display: inline-block" draggable="false">` : ""}
							<div class="dd-content name" style="display: inline-block; width: 35%;" data-url="${url}">${name}</div>
							<a href="${url}"><span class="url" style="display: inline-block; width: ${showImage ? "40%" : "55%"};">${url}</span></a>
						</li>
					`);
				if (!showImage) {
					$liArt.on("mousedown", () => {
						const $loader = $(`<div class="temp-warning">Loading image - don't drop yet!</div>`);
						const $img = $(`<img src="${url}" style="width: 30px; max-height: 30px; display: none">`);
						if (!$img.prop("complete")) {
							$(`body`).append($loader);
							$img.on("load", () => {
								$loader.remove();
							});
							$loader.append($img);
						}
					});
				}

				const $btnDel = $(`<span class="delete btn btn-danger"><span class="pictos">#</span></span>`).on("click", () => {
					$liArt.remove();
					refreshCustomArtList();
				});
				$liArt.append($btnDel);
				return $liArt;
			}

			function refreshCustomArtList () {
				artList.reIndex();
				const custom = [];
				artList.items.forEach(i => {
					const $ele = $(i.elm);
					custom.push({
						name: $ele.find(`.name`).text(),
						url: $ele.find(`.url`).text()
					});
				});
				d20plus.art.custom = custom;
				makeDraggables();
				d20plus.art.saveToHandout();
			}

			function makeDraggables () {
				$(`.Vetools-draggable-art`).draggable({
					handle: ".dd-content",
					revert: true,
					revertDuration: 0,
					helper: "clone",
					appendTo: "body"
				})
			}
		},

		saveToHandout () {
			const handout = d20plus.art.getArtHandout();
			if (!handout) {
				d20.Campaign.handouts.create({
					name: ART_HANDOUT,
					archived: true
				}, {
					success: function (handout) {
						notecontents = "This handout is used to store custom art URLs.";

						const gmnotes = JSON.stringify(d20plus.art.custom);
						handout.updateBlobs({notes: notecontents, gmnotes: gmnotes});
						handout.save({notes: (new Date).getTime(), inplayerjournals: ""});
					}
				});
			} else {
				const gmnotes = JSON.stringify(d20plus.art.custom);
				handout.updateBlobs({gmnotes: gmnotes});
				handout.save({notes: (new Date).getTime()});
			}
		},

		/**
		 * @param items Array of Objects with "name" and "url" properties.
		 * @private
		 */
		addToHandout (items) {
			const invalid = items.find(it => !it.name || !it.url);
			if (invalid) throw new Error(`Invalid item ${JSON.stringify(invalid)} did not contain required name and URL properties!`);
			d20plus.art.custom = (d20plus.art.custom || []).concat(items);
			d20plus.art.saveToHandout();
		},

		// TODO load a decent default art library from somewhere
		default: [
			// {
			// 	name: "Phoenix",
			// 	url: "http://www.discgolfbirmingham.com/wordpress/wp-content/uploads/2014/04/phoenix-rising.jpg"
			// }
		]
	};

	d20plus.art.getArtHandout = () => {
		return d20.Campaign.handouts.models.find((handout) => {
			return handout.attributes.name === ART_HANDOUT;
		});
	};

	d20plus.art.pLoadArt = async () => {
		d20plus.ut.log("Loading custom art");
		const handout = d20plus.art.getArtHandout();
		if (handout) {
			handout.view.render();
			return new Promise(resolve => {
				handout._getLatestBlob("gmnotes", function (gmnotes) {
					const decoded = decodeURIComponent(gmnotes);
					try {
						d20plus.art.custom = JSON.parse(decoded);
						resolve();
					} catch (e) {
						console.error(e);
						resolve();
					}
				});
			});
		}
	};

	d20plus.art.addCustomArtSearch = () => {
		d20plus.ut.log("Add custom art search");
		const $afterTo = $(`#libraryresults`);
		$afterTo.after(d20plus.artListHTML);

		const $olNone = $(`#image-search-none`);
		const $olHasResults = $(`#image-search-has-results`);

		const $olArt = $(`#custom-art-results`);
		const $srchImages = $(`#imagedialog .searchbox input.keywords`);
		$srchImages.on("keyup", () => {
			$olArt.empty();
			const searched = $srchImages.val().trim().toLowerCase();
			if (searched.length < 2) {
				$olNone.show();
				$olHasResults.hide();
				return;
			}

			let toShow = d20plus.art.default.filter(a => a.name.toLowerCase().includes(searched));
			if (d20plus.art.custom) toShow = toShow.concat(d20plus.art.custom.filter(a => a.name.toLowerCase().includes(searched)));

			if (!toShow.length) {
				$olNone.show();
				$olHasResults.hide();
			} else {
				$olNone.hide();
				$olHasResults.show();

				toShow.forEach(a => {
					$olArt.append(`
						<li class="dd-item library-item draggableresult Vetoolsresult ui-draggable" data-fullsizeurl="${a.url}">
							<div class="dd-content">
								<div class="token"><img src="${a.url}" draggable="false"></div>
								<div class="name">
									<div class="namecontainer"><a href="${a.url}" rel="external">${a.name}</a></div>
								</div>
							</div>
						</li>
					`);
				});
			}

			$("#imagedialog #Vetoolsresults .draggableresult").draggable({
				handle: ".dd-content",
				revert: true,
				revertDuration: 0,
				helper: "clone",
				appendTo: "body"
			}).addTouch();
		});
	};

	d20plus.art.initArtFromUrlButtons = () => {
		d20plus.ut.log("Add direct URL art buttons");
		// requires templates to be swapped, which happens ASAP during Init

		$(`.character-image-by-url`).live("click", function () {
			const cId = $(this).closest(`[data-characterid]`).attr(`data-characterid`);
			const url = window.prompt("Enter a URL", d20plus.art.getLastImageUrl());
			if (url) {
				d20plus.art.setLastImageUrl(url);
				d20.Campaign.characters.get(cId).set("avatar", url);
			}
		});

		$(`.handout-image-by-url`).live("click", function () {
			const hId = $(this).closest(`[data-handoutid]`).attr(`data-handoutid`);
			const url = window.prompt("Enter a URL", d20plus.art.getLastImageUrl());
			if (url) {
				d20plus.art.setLastImageUrl(url);
				d20.Campaign.handouts.get(hId).set("avatar", url);
			}
		});

		$(`.token-image-by-url`).live("click", function () {
			const cId = $(this).closest(`[data-characterid]`).attr(`data-characterid`);
			const url = window.prompt("Enter a URL", d20plus.art.getLastImageUrl());
			if (url) {
				d20plus.art.setLastImageUrl(url);
				const char = d20.Campaign.characters.get(cId);
				char._getLatestBlob("defaulttoken", (blob) => {
					blob = blob && blob.trim() ? JSON.parse(blob) : {};
					blob.imgsrc = url;
					char.updateBlobs({defaulttoken: JSON.stringify(blob)});
				});
			}
		});

		$(`.deck-image-by-url`).live("click", function () {
			const dId = $(this).attr("data-deck-id");
			const url = window.prompt("Enter a URL", d20plus.art.getLastImageUrl());
			if (url) {
				d20plus.art.setLastImageUrl(url);
				d20.Campaign.decks.get(dId).set("avatar", url)
			}
		});

		$(`.card-image-by-url`).live("click", function () {
			const cId = $(this).attr("data-card-id");
			const url = window.prompt("Enter a URL", d20plus.art.getLastImageUrl());
			if (url) {
				d20plus.art.setLastImageUrl(url);
				const card = d20.Campaign.decks.find(it => it.cards.find(c => c.id === cId)).cards.find(c => c.id === cId);
				card.set("avatar", url);
			}
		});

		$(`.deck-mass-cards-by-url`).live("click", function () {
			const dId = $(this).attr("data-deck-id");

			const deck = d20.Campaign.decks.get(dId);

			const cleanTemplate = d20plus.addArtMassAdderHTML.replace(/id="[^"]+"/gi, "");
			const $dialog = $(cleanTemplate).appendTo($("body"));
			const $iptTxt = $dialog.find(`textarea`);
			const $btnAdd = $dialog.find(`button`).click(() => {
				const lines = ($iptTxt.val() || "").split("\n");
				const toSaveAll = [];
				lines.filter(it => it && it.trim()).forEach(l => {
					const split = l.split("---").map(it => it.trim()).filter(Boolean);
					if (split.length >= 2) {
						const [name, url] = split;
						const toSave = deck.cards.push({
							avatar: url,
							id: d20plus.ut.generateRowId(),
							name,
							placement: 99
						});
						toSaveAll.push(toSave);
					}
				});
				$dialog.dialog("close");

				toSaveAll.forEach(s => s.save());
				deck.save();
			});

			$dialog.dialog({
				width: 800,
				height: 650
			});
		});
	};

	d20plus.art._lastImageUrl = "https://example.com/pic.png";
	d20plus.art.getLastImageUrl = () => {
		return d20plus.art._lastImageUrl;
	};
	d20plus.art.setLastImageUrl = (url) => {
		d20plus.art._lastImageUrl = url || d20plus.art._lastImageUrl;
	};
}

SCRIPT_EXTENSIONS.push(d20plusArt);


function d20plusArtBrowser () {
	d20plus.artBrowse = {};

	// ART IMPORTER 2.0
	d20plus.artBrowse.initRepoBrowser = () => {
		const TIME = (new Date()).getTime();
		const STATES = ["0", "1", "2"]; // off, blue, red

		function pGetJson (url) { // avoid using the main site method's caching
			return new Promise(resolve => $.getJSON(url, data => resolve(data)));
		}

		const $win = $(`<div title="Art Repository" class="artr__win"/>`)
			.appendTo($(`body`))
			.dialog({
				autoOpen: false,
				resizable: true,
				width: 1,
				height: 1
			})
			// bind droppable, so that elements dropped back onto the browser don't get caught by the canvas behind
			.droppable({
				accept: ".draggableresult",
				tolerance: "pointer",
				drop: (event, ui) => {
					event.preventDefault();
					event.stopPropagation();
					event.originalEvent.dropHandled = true;
					d20plus.ut.log(`Dropped back onto art browser!`);
				}
			});

		async function doInit () {
			const $sidebar = $(`<div class="artr__side"/>`).appendTo($win);
			const $mainPane = $(`<div class="artr__main"/>`).appendTo($win);
			const $loadings = [
				$(`<div class="artr__side__loading" title="Caching repository data, this may take some time">Loading...</div>`).appendTo($sidebar),
				$(`<div class="artr__main__loading" title="Caching repository data, this may take some time">Loading...</div>`).appendTo($mainPane)
			];

			const start = (new Date()).getTime();
			const GH_PATH = `https://raw.githubusercontent.com/DMsGuild201/Roll20_resources/master/ExternalArt/dist/`;
			const [enums, index] = await Promise.all([pGetJson(`${GH_PATH}_meta_enums.json`), pGetJson(`${GH_PATH}_meta_index.json`)]);
			d20plus.ut.log(`Loaded metadata in ${((new Date()).getTime() - start) / 1000} secs.`);

			Object.keys(index).forEach(k => index[k]._key = k);

			let filters = {};
			let search = "";
			let currentItem = null;
			let currentIndexKey = null;

			function _searchFeatures (item, doLowercase) {
				// features are lowercase in index
				return !!(item.features || []).find(x => (doLowercase ? x.toLowerCase() : x).includes(search));
			}

			function _filterProps (item) {
				if (Object.keys(filters).length) {
					const missingOrUnwanted = Object.keys(filters).find(prop => {
						if (!item[prop]) return true;
						const requiredVals = Object.keys(filters[prop]).filter(k => filters[prop][k]);
						const missingEnum = !!requiredVals.find(x => !item[prop].includes(x));
						const excludedVals = Object.keys(filters[prop]).filter(k => !filters[prop][k]);
						const unwantedEnum = !!excludedVals.find(x => item[prop].includes(x));
						return missingEnum || unwantedEnum;
					});
					if (missingOrUnwanted) return false;
				}
				return true;
			}

			function applyFilterAndSearchToIndex () {
				search = search.toLowerCase();

				// require the user to search or apply a filter before displaying any results
				if (Object.keys(filters).length === 0 && search.length < 2) return [];

				return Object.values(index).filter(it => {
					if (search) {
						const searchVisible = it._set.toLowerCase().includes(search)
							|| it._artist.toLowerCase().includes(search)
							|| _searchFeatures(it);
						if (!searchVisible) return false;
					}
					return _filterProps(it, 1);
				});
			}

			function applyFilterAndSearchToItem () {
				const cpy = MiscUtil.copy(currentItem);
				const filterItem = $cbMirrorFilters.prop("checked");
				cpy.data = cpy.data.filter(it => {
					if (search) if (!_searchFeatures(it, true)) return false;
					if (filterItem) return _filterProps(it);
					return true;
				});
				return cpy;
			}

			$loadings.forEach($l => $l.remove());

			// SIDEBAR /////////////////////////////////////////////////////////////////////////////////////////
			const $sideHead = $(`<div class="p-2 artr__side__head"><div class="artr__side__head__title">Filters</div></div>`).appendTo($sidebar);
			// This functionality is contained in the filter buttons, but might need to be done here to improve performance in the future
			// $(`<button class="btn">Apply</button>`).click(() => {
			// 	if (currentItem) doRenderItem(applyFilterAndSearchToItem());
			// 	else doRenderIndex(applyFilterAndSearchToIndex())
			// }).appendTo($sideHead);
			const $lbMirrorFilters = $(`<label class="split" title="Apply filters to results inside folders (as well as the index)"><span>Filter within folders</span></label>`).appendTo($sideHead);
			const $cbMirrorFilters = $(`<input type="checkbox" checked>`).appendTo($lbMirrorFilters).change(() => {
				if (currentItem) {
					doRenderItem(applyFilterAndSearchToItem());
				}
			});

			const $sideBody = $(`<div class="artr__side__body"/>`).appendTo($sidebar);
			const addSidebarSection = (prop, ix) => {
				const fullName = (() => {
					switch (prop) {
						case "imageType": return "Image Type";
						case "grid": return "Grid Type";
						case "monster": return "Monster Type";
						case "audience": return "Intended Audience";
						default:
							return prop.uppercaseFirst();
					}
				})();

				const $tagHead = $(`<div class="artr__side__tag_header"><div>${fullName}</div><div>[\u2013]</div></div>`).appendTo($sideBody).click(() => {
					$tagGrid.toggle();
					$tagHead.html($tagHead.html().replace(/\[.]/, (...m) => m[0] === "[+]" ? "[\u2013]" : "[+]"));
				});

				const $tagGrid = $(`<div class="artr__side__tag_grid"/>`).appendTo($sideBody);
				const getNextState = (state, dir) => {
					const ix = STATES.indexOf(state) + dir;
					if (ix > STATES.length - 1) return STATES[0];
					if (ix < 0) return STATES.last();
					return STATES[ix];
				};

				if (ix) $tagHead.click(); // hide by default

				enums[prop].sort((a, b) => SortUtil.ascSort(b.c, a.c)).forEach(enm => {
					const cycleState = dir => {
						const nxtState = getNextState($btn.attr("data-state"), dir);
						$btn.attr("data-state", nxtState);

						if (nxtState === "0") {
							delete filters[prop][enm.v];
							if (!Object.keys(filters[prop]).length) delete filters[prop];
						} else (filters[prop] = filters[prop] || {})[enm.v] = nxtState === "1";

						if (currentItem) doRenderItem(applyFilterAndSearchToItem());
						else doRenderIndex(applyFilterAndSearchToIndex());
					};

					const $btn = $(`<button class="btn artr__side__tag" data-state="0">${enm.v} (${enm.c})</button>`)
						.click(() => cycleState(1))
						.contextmenu((evt) => {
							if (!evt.ctrlKey) {
								evt.preventDefault();
								cycleState(-1);
							}
						})
						.appendTo($tagGrid);
				});
			};
			Object.keys(enums).forEach((k, i) => addSidebarSection(k, i));

			// MAIN PAGE ///////////////////////////////////////////////////////////////////////////////////////
			const $mainHead = $(`<div class="p-2 artr__search"/>`).appendTo($mainPane);

			const $wrpBread = $(`<div class="artr__bread"/>`).appendTo($mainHead);
			const updateCrumbs = () => {
				$wrpBread.empty();
				const $txtIndex = $(`<span class="artr__crumb btn">Index</span>`)
					.appendTo($wrpBread)
					.click(() => doRenderIndex(applyFilterAndSearchToIndex()));

				if (currentItem) {
					const $txtSlash = $(`<span class="artr__crumb artr__crumb--sep">/</span>`).appendTo($wrpBread);
					const $txtItem = $(`<span class="artr__crumb btn">${currentItem.set} \u2013 ${currentItem.artist}</span>`)
						.appendTo($wrpBread)
						.click(() => {
							$iptSearch.val("");
							search = "";
							doRenderItem(applyFilterAndSearchToItem(), true);
						});
				}
			};
			updateCrumbs();

			let searchTimeout;
			const doSearch = () => {
				search = ($iptSearch.val() || "").trim();
				if (currentItem) doRenderItem(applyFilterAndSearchToItem());
				else doRenderIndex(applyFilterAndSearchToIndex())
			};
			const $iptSearch = $(`<input placeholder="Search..." class="artr__search__field">`).on("keydown", (e) => {
				clearTimeout(searchTimeout);
				if (e.which === 13) {
					doSearch();
				} else {
					searchTimeout = setTimeout(() => {
						doSearch();
					}, 100);
				}
			}).appendTo($mainHead);

			const $mainBody = $(`<div class="artr__view"/>`).appendTo($mainPane);
			const $mainBodyInner = $(`<div class="artr__view_inner"/>`).appendTo($mainBody);

			const $itemBody = $(`<div class="artr__view"/>`).hide().appendTo($mainPane);
			const $itemBodyInner = $(`<div class="artr__view_inner"/>`).appendTo($itemBody);

			function doRenderIndex (indexSlice) {
				currentItem = false;
				currentIndexKey = false;
				$mainBody.show();
				$itemBody.hide();
				$mainBodyInner.empty();
				updateCrumbs();

				if (!indexSlice.length) {
					$(`<div class="artr__no_results_wrp"><div class="artr__no_results"><div class="text-center"><span class="artr__no_results_headline">No results found</span><br>Please adjust the filters (on the left) or refine your search (above).</div></div></div>`).appendTo($mainBodyInner)
				} else {
					indexSlice.forEach(it => {
						const $item = $(`<div class="artr__item artr__item--index"/>`).appendTo($mainBodyInner).click(() => doLoadAndRenderItem(it));

						const $itemTop = $(`
							<div class="artr__item__top artr__item__top--quart">
								${[...new Array(4)].map((_, i) => `<div class="atr__item__quart">${it._sample[i] ? `<img class="artr__item__thumbnail" src="${GH_PATH}${it._key}--thumb-${it._sample[i]}.jpg">` : ""}</div>`).join("")}								
							</div>
						`).appendTo($item);

						const $itemStats = $(`<div class="artr__item__stats"/>`).appendTo($itemTop);
						const $statsImages = $(`<div class="artr__item__stats_item help--subtle" title="Number of images">×${it._size.toLocaleString()}</div>`).appendTo($itemStats);

						const $itemMenu = $(`<div class="artr__item__menu"/>`).appendTo($itemTop);
						const $btnExternalArt = $(`<div class="artr__item__menu_item pictos btn" title="Add to External Art list (${it._size} image${it._size === 1 ? "" : "s"})">P</div>`)
							.appendTo($itemMenu)
							.click(async (evt) => {
								evt.stopPropagation();
								const file = await pGetJson(`${GH_PATH}${it._key}.json`);
								const toAdd = file.data.map((it, i) => ({
									name: `${file.set} \u2014 ${file.artist} (${i})`,
									url: it.uri
								}));
								d20plus.art.addToHandout(toAdd);
								alert(`Added ${file.data.length} image${file.data.length === 1 ? "" : "s"} to the External Art list.`);
							});
						const $btnDownload = $(`<div class="artr__item__menu_item pictos btn" title="Download ZIP (SHIFT to download a text file of URLs)">}</div>`)
							.appendTo($itemMenu)
							.click(async (evt) => {
								evt.stopPropagation();
								const file = await pGetJson(`${GH_PATH}${it._key}.json`);
								if (evt.shiftKey) {
									d20plus.artBrowse._downloadUrls(file);
								} else {
									d20plus.artBrowse._downloadZip(file);
								}
							});

						const $itemBottom = $(`
							<div class="artr__item__bottom">
								<div class="artr__item__bottom__row" style="padding-bottom: 2px;" title="${it._set}">${it._set}</div>
								<div class="artr__item__bottom__row" style="padding-top: 2px;" title="${it._artist}"><i>By</i> ${it._artist}</div>
							</div>
						`).appendTo($item);
					});
				}
			}

			function doLoadAndRenderItem (indexItem) {
				pGetJson(`${GH_PATH}${indexItem._key}.json`).then(file => {
					currentItem = file;
					currentIndexKey = indexItem._key;
					doRenderItem(applyFilterAndSearchToItem(), true);
				});
			}

			function doRenderItem (file, resetScroll) {
				$mainBody.hide();
				$itemBody.show();
				$itemBodyInner.empty();
				updateCrumbs();
				if (resetScroll) $itemBodyInner.scrollTop(0);
				const $itmUp = $(`<div class="artr__item artr__item--item artr__item--back"><div class="pictos">[</div></div>`)
					.click(() => doRenderIndex(applyFilterAndSearchToIndex()))
					.appendTo($itemBodyInner);

				file.data.sort((a, b) => SortUtil.ascSort(a.hash, b.hash)).forEach((it, i) => {
					// "library-item" and "draggableresult" classes required for drag/drop
					const $item = $(`<div class="artr__item artr__item--item library-item draggableresult" data-fullsizeurl="${it.uri}"/>`)
						.appendTo($itemBodyInner)
						.click(() => {
							const $wrpBigImg = $(`<div class="artr__wrp_big_img"><img class="artr__big_img" src="${it.uri}"></div>`)
								.click(() => $wrpBigImg.remove()).appendTo($(`body`));
						});
					const $wrpImg = $(`<div class="artr__item__full"/>`).appendTo($item);
					const $img = $(`<img class="artr__item__thumbnail" src="${GH_PATH}${currentIndexKey}--thumb-${it.hash}.jpg">`).appendTo($wrpImg);

					const $itemMenu = $(`<div class="artr__item__menu"/>`).appendTo($item);
					const $btnExternalArt = $(`<div class="artr__item__menu_item pictos" title="Add to External Art list">P</div>`)
						.appendTo($itemMenu)
						.click((evt) => {
							evt.stopPropagation();
							d20plus.art.addToHandout([{name: `${file.set} \u2014 ${file.artist} (${i})`, url: it.uri}]);
							alert(`Added image to the External Art list.`);
						});
					const $btnDownload = $(`<div class="artr__item__menu_item pictos" title="Download">}</div>`)
						.appendTo($itemMenu)
						.click((evt) => {
							evt.stopPropagation();
							window.open(it.uri, "_blank");
						});
					const $btnCopyUrl = $(`<div class="artr__item__menu_item pictos" title="Copy URL">A</div>`)
						.appendTo($itemMenu)
						.click(async (evt) => {
							evt.stopPropagation();
							await MiscUtil.pCopyTextToClipboard(it.uri);
							JqueryUtil.showCopiedEffect($btnDownload, "Copied URL!");
						});
					if (it.support) {
						const $btnSupport = $(`<div class="artr__item__menu_item pictos" title="Support Artist">$</div>`)
							.appendTo($itemMenu)
							.click((evt) => {
								evt.stopPropagation();
								window.open(it.support, "_blank");
							});
					}

					$item.draggable({
						handle: ".artr__item",
						revert: true,
						revertDuration: 0,
						helper: "clone",
						appendTo: "body"
					});
				});
			}

			doRenderIndex(applyFilterAndSearchToIndex());
		}

		let firstClick = true;
		const calcWidth = () => {
			const base = d20.engine.canvasWidth * 0.66;
			return (Math.ceil((base - 300) / 190) * 190) + 320;
		};
		const $btnBrowse = $(`#button-browse-external-art`).click(() => {
			$win.dialog(
				"option",
				{
					width: calcWidth(),
					height: d20.engine.canvasHeight - 100,
					position: {
						my: "left top",
						at: "left+75 top+15",
						collision: "none"
					}
				}
			).dialog("open");

			if (firstClick) {
				doInit();
				firstClick = false;
			}
		});
	};

	d20plus.artBrowse._downloadZip = async item => {
		function doCreateIdChat (str, isError) {
			const uid = d20plus.ut.generateRowId();
			d20.textchat.incoming(false, ({
				who: "system",
				type: "system",
				content: `<span id="${uid}" class="hacker-chat inline-block ${isError ? "is-error" : ""}">${str}</span>`
			}));
			return uid;
		}

		function doUpdateIdChat (id, str, isError = false) {
			$(`#userscript-${id}`).toggleClass("is-error", isError).html(str);
		}

		let isHandled = false;
		function handleCancel (id) {
			if (isHandled) return;
			isHandled = true;
			doUpdateIdChat(id, "Download cancelled.");
		}

		function pAjaxLoad (url) {
			const oReq = new XMLHttpRequest();
			const p = new Promise((resolve, reject) => {
				// FIXME cors-anywhere has a usage limit, which is pretty easy to hit when downloading many files
				oReq.open("GET", `https://cors-anywhere.herokuapp.com/${url}`, true);
				oReq.responseType = "arraybuffer";
				let lastContentType = null;
				oReq.onreadystatechange = () => {
					const h = oReq.getResponseHeader("content-type");
					if (h) {
						lastContentType = h;
					}
				};
				oReq.onload = function() {
					const arrayBuffer = oReq.response;
					resolve({buff: arrayBuffer, contentType: lastContentType});
				};
				oReq.onerror = (e) => reject(new Error(`Error during request: ${e}`));
				oReq.send();
			});
			p.abort = () => oReq.abort();
			return p;
		}

		$(`#rightsidebar a[href="#textchat"]`).click();
		const chatId = doCreateIdChat(`Download starting...`);
		let isCancelled = false;
		let downloadTasks = [];
		const $btnStop = $(`<button class="btn btn-danger Ve-btn-chat" id="button-${chatId}">Stop</button>`)
			.insertAfter($(`#userscript-${chatId}`))
			.click(() => {
				isCancelled = true;
				downloadTasks.forEach(p => p.abort());
				handleCancel(chatId);
				$btnStop.remove();
			});
		try { $btnStop[0].scrollIntoView() }
		catch (e) { console.error(e) }

		if (isCancelled) return handleCancel(chatId);

		try {
			const toSave = [];
			let downloaded = 0;
			let errorCount = 0;

			const getWrappedPromise = dataItem => {
				const pAjax = pAjaxLoad(dataItem.uri);
				const p = new Promise(async resolve => {
					try {
						const data = await pAjax;
						toSave.push(data);
					} catch (e) {
						d20plus.ut.error(`Error downloading "${dataItem.uri}":`, e);
						++errorCount;
					}
					++downloaded;
					doUpdateIdChat(chatId, `Downloading ${downloaded}/${item.data.length}... (${Math.floor(100 * downloaded / item.data.length)}%)${errorCount ? ` (${errorCount} error${errorCount === 1 ? "" : "s"})` : ""}`);
					resolve();
				});
				p.abort = () => pAjax.abort();
				return p;
			};

			downloadTasks = item.data.map(dataItem => getWrappedPromise(dataItem));
			await Promise.all(downloadTasks);

			if (isCancelled) return handleCancel(chatId);

			doUpdateIdChat(chatId, `Building ZIP...`);

			const zip = new JSZip();
			toSave.forEach((data, i) => {
				const extension = (data.contentType || "unknown").split("/").last();
				zip.file(`${`${i}`.padStart(3, "0")}.${extension}`, data.buff, {binary: true});
			});

			if (isCancelled) return handleCancel(chatId);

			zip.generateAsync({type:"blob"})
				.then((content) => {
					if (isCancelled) return handleCancel(chatId);

					doUpdateIdChat(chatId, `Downloading ZIP...`);
					d20plus.ut.saveAs(content, d20plus.ut.sanitizeFilename(`${item.set}__${item.artist}`));
					doUpdateIdChat(chatId, `Download complete.`);
					$btnStop.remove();
				});
		} catch (e) {
			doUpdateIdChat(chatId, `Download failed! Error was: ${e.message}<br>Check the log for more information.`, true);
			console.error(e);
		}
	};

	d20plus.artBrowse._downloadUrls = async item => {
		const contents = item.data.map(it => it.uri).join("\n");
		const blob = new Blob([contents], {type: "text/plain"});
		d20plus.ut.saveAs(blob, d20plus.ut.sanitizeFilename(`${item.set}__${item.artist}`));
	};
}

SCRIPT_EXTENSIONS.push(d20plusArtBrowser);


function d20plusEngine () {
	d20plus.engine = {};

	d20plus.engine.addProFeatures = () => {
		d20plus.ut.log("Add Pro features");

		d20plus.setMode = d20plus.mod.setMode;
		window.setMode = d20plus.mod.setMode;

		// rebind buttons with new setMode
		const $drawTools = $("#drawingtools");
		const $rect = $drawTools.find(".chooserect");
		const $path = $drawTools.find(".choosepath");
		const $poly = $drawTools.find(".choosepolygon");
		$drawTools.unbind(clicktype).bind(clicktype, function () {
			$(this).hasClass("rect") ? setMode("rect") : $(this).hasClass("text") ? setMode("text") : $(this).hasClass("path") ? setMode("path") : $(this).hasClass("drawselect") ? setMode("drawselect") : $(this).hasClass("polygon") && setMode("polygon")
		});
		$rect.unbind(clicktype).bind(clicktype, () => {
			setMode("rect");
			return false;
		});
		$path.unbind(clicktype).bind(clicktype, () => {
			setMode("path");
			return false;
		});
		$poly.unbind(clicktype).bind(clicktype, () => {
			setMode("polygon");
			return false;
		});
		$("#rect").unbind(clicktype).bind(clicktype, () => setMode("rect"));
		$("#path").unbind(clicktype).bind(clicktype, () => setMode("path"));

		if (!$(`#fxtools`).length) {
			const $fxMode = $(`<li id="fxtools"/>`).append(`<span class="pictos">e</span>`);
			$fxMode.on("click", () => {
				d20plus.setMode("fxtools");
			});
			$(`#drawingtools`).after($fxMode);
		}

		// bind new hotkeys
		Mousetrap.bind("q q", function () { // default ruler on q-q
			setMode("measure");
			$(`#measure_mode`).val("1").trigger("change");
			return false;
		});

		Mousetrap.bind("q r", function () { // radius
			setMode("measure");
			$(`#measure_mode`).val("2").trigger("change");
			return false;
		});

		Mousetrap.bind("q c", function () { // cone
			setMode("measure");
			$(`#measure_mode`).val("3").trigger("change");
			return false;
		});

		Mousetrap.bind("q e", function () { // box
			setMode("measure");
			$(`#measure_mode`).val("4").trigger("change");
			return false;
		});

		Mousetrap.bind("q w", function () { // line
			setMode("measure");
			$(`#measure_mode`).val("5").trigger("change");
			return false;
		});

		if (window.is_gm) {
			// add lighting layer tool
			if (!$(`#editinglayer .choosewalls`).length) {
				$(`#editinglayer .choosegmlayer`).after(`<li class="choosewalls"><span class="pictostwo">r</span> Dynamic Lighting</li>`);
			}

			// ensure tokens have editable sight
			$("#tmpl_tokeneditor").replaceWith(d20plus.template_TokenEditor);
			// show dynamic lighting/etc page settings
			$("#tmpl_pagesettings").replaceWith(d20plus.template_pageSettings);
			$("#page-toolbar").on("mousedown", ".settings", function () {
				var e = d20.Campaign.pages.get($(this).parents(".availablepage").attr("data-pageid"));
				e.view._template = $.jqotec("#tmpl_pagesettings");
			});
		}
	};

	d20plus.engine.enhanceMeasureTool = () => {
		d20plus.ut.log("Enhance Measure tool");

		// add extra toolbar
		const $wrpBar = $(`#secondary-toolbar`);
		const toAdd = `
				<ul class="mode measure" style="display: none;">
					<li>
						<select id="measure_mode" style="width: 100px;">
							<option value="1" selected>Ruler</option>
							<option value="2">Radius</option>
							<option value="3">Cone</option>
							<option value="4">Box</option>
							<option value="5">Line</option>
						</select>
					</li>
					<li class="measure_mode_sub measure_mode_sub_2" style="display: none;">
						<select id="measure_mode_sel_2" style="width: 100px;">
							<option value="1" selected>Burst</option>
							<option value="2">Blast</option>
						</select>
					</li>
					<li class="measure_mode_sub measure_mode_sub_3" style="display: none;">
						<input type="number" min="0" id="measure_mode_ipt_3" style="width: 45px;" value="1">
						<label style="display: inline-flex;" title="The PHB cone rules are the textbook definition of one radian.">rad.</label>
						<select id="measure_mode_sel_3" style="width: 120px;">
							<option value="1" selected>Edge: Flat</option>
							<option value="2">Edge: Rounded</option>
						</select>
					</li>
					<li class="measure_mode_sub measure_mode_sub_4" style="display: none;">
						<select id="measure_mode_sel_4" style="width: 100px;">
							<option value="1" selected>Burst</option>
							<option value="2">Blast</option>
						</select>
					</li>
					<li class="measure_mode_sub measure_mode_sub_5" style="display: none;">
						<select id="measure_mode_sel_5" style="width: 120px;">
							<option value="1" selected>Total Width: </option>
							<option value="2">Width To Edge: </option>
						</select>
						<input type="number" min="0" id="measure_mode_ipt_5" style="width: 40px;" value="5">
						<label style="display: inline-flex;">units</label>
					</li>
				</ul>`;
		$wrpBar.append(toAdd);

		$(`#measure`).click(() => {
			d20plus.setMode("measure");
		});
		const $selMeasure = $(`#measure_mode`);
		$selMeasure.on("change", () => {
			$(`.measure_mode_sub`).hide();
			$(`.measure_mode_sub_${$selMeasure.val()}`).show();
		});

		// 	const event = {
		// 		type: "Ve_measure_clear_sticky",
		// 		player: window.currentPlayer.id,
		// 		time: (new Date).getTime()
		// 	};
		// 	d20.textchat.sendShout(event)

		d20.textchat.shoutref.on("value", function(e) {
			if (!d20.textchat.chatstartingup) {
				var t = e.val();
				if (t) {
					const msg = JSON.parse(t);
					if (window.DEBUG) console.log("SHOUT: ", msg);

					switch (msg.type) {
						// case "Ve_measure_clear_sticky": {
						// 	delete d20plus._stickyMeasure[msg.player];
						// 	d20.engine.redrawScreenNextTick();
						// }
					}
				}
			}
		});

		d20plus.mod.drawMeasurements();
	};

	d20plus.engine._removeStatusEffectEntries = () => {
		$(`#5etools-status-css`).html("");
		Object.keys(d20.token_editor.statusmarkers).filter(k => k.startsWith("5etools_")).forEach(k => delete d20.token_editor.statusmarkers[k]);
	};

	d20plus.engine.enhanceStatusEffects = () => {
		d20plus.ut.log("Enhance status effects");
		$(`head`).append(`<style id="5etools-status-css"/>`);

		d20plus.mod.overwriteStatusEffects();

		d20.engine.canvas.off("object:added");
		d20.engine.canvas.on("object:added", d20plus.mod.overwriteStatusEffects);

		// the holy trinity
		// d20.engine.canvas.on("object:removed", () => console.log("added"));
		// d20.engine.canvas.on("object:removed", () => console.log("removed"));
		// d20.engine.canvas.on("object:modified", () => console.log("modified"));

		$(document).off("mouseenter", ".markermenu");
		$(document).on("mouseenter", ".markermenu", d20plus.mod.mouseEnterMarkerMenu)
	};

	d20plus.engine.enhancePageSelector = () => {
		d20plus.ut.log("Enhancing page selector");

		var updatePageOrder = function () {
			d20plus.ut.log("Saving page order...");
			var pos = 0;
			$("#page-toolbar .pages .chooseablepage").each(function () {
				var page = d20.Campaign.pages.get($(this).attr("data-pageid"));
				page && page.save({
					placement: pos
				});
				pos++;
			});
			d20.pagetoolbar.noReload = false;
			d20.pagetoolbar.refreshPageListing();
		};

		function overwriteDraggables () {
			// make them draggable on both axes
			$("#page-toolbar .pages").sortable("destroy");
			$("#page-toolbar .pages").sortable({
				items: "> .chooseablepage",
				start: function () {
					d20.pagetoolbar.noReload = true;
				},
				stop: function () {
					updatePageOrder()
				},
				distance: 15
			}).addTouch();
			$("#page-toolbar .playerbookmark").draggable("destroy");
			$("#page-toolbar .playerbookmark").draggable({
				revert: "invalid",
				appendTo: "#page-toolbar",
				helper: "original"
			}).addTouch();
			$("#page-toolbar .playerspecificbookmark").draggable("destroy");
			$("#page-toolbar .playerspecificbookmark").draggable({
				revert: "invalid",
				appendTo: "#page-toolbar",
				helper: "original"
			}).addTouch();
		}

		overwriteDraggables();
		$(`#page-toolbar`).css("top", "calc(-90vh + 40px)");

		const originalFn = d20.pagetoolbar.refreshPageListing;
		// original function is debounced at 100ms, so debounce this at 110ms and hope for the best
		const debouncedOverwrite = _.debounce(() => {
			overwriteDraggables();
			// fire an event for other parts of the script to listen for
			const pageChangeEvt = new Event(`VePageChange`);
			d20plus.ut.log("Firing page-change event");
			document.dispatchEvent(pageChangeEvt);
		}, 110);
		d20.pagetoolbar.refreshPageListing = () => {
			originalFn();
			debouncedOverwrite();
		}
	};

	d20plus.engine.initQuickSearch = ($iptSearch, $outSearch) => {
		$iptSearch.on("keyup", () => {
			const searchVal = ($iptSearch.val() || "").trim();
			$outSearch.empty();
			if (searchVal.length <= 2) return; // ignore 2 characters or less, for performance reasons
			const found = $(`#journal .content`).find(`li[data-itemid]`).filter((i, ele) => {
				const $ele = $(ele);
				return $ele.find(`.name`).text().trim().toLowerCase().includes(searchVal.toLowerCase());
			});
			if (found.length) {
				$outSearch.append(`<p><b>Search results:</b></p>`);
				const $outList = $(`<ol class="dd-list Vetools-search-results"/>`);
				$outSearch.append($outList);
				found.clone().addClass("Vetools-draggable").appendTo($outList);
				$outSearch.append(`<hr>`);
				$(`.Vetools-search-results .Vetools-draggable`).draggable({
					revert: true,
					distance: 10,
					revertDuration: 0,
					helper: "clone",
					handle: ".namecontainer",
					appendTo: "body",
					scroll: true,
					start: function () {
						$("#journalfolderroot").addClass("externaldrag")
					},
					stop: function () {
						$("#journalfolderroot").removeClass("externaldrag")
					}
				});
			}
		});
	};

	d20plus.engine.addSelectedTokenCommands = () => {
		d20plus.ut.log("Add token rightclick commands");
		$("#tmpl_actions_menu").replaceWith(d20plus.template_actionsMenu);

		const getTokenWhisperPart = () => d20plus.cfg.getOrDefault("token", "massRollWhisperName") ? "/w gm Rolling for @{selected|token_name}...\n" : "";

		Mousetrap.bind("b b", function () { // back on layer
			const n = d20plus.engine._getSelectedToMove();
			d20plus.engine.backwardOneLayer(n);
			return false;
		});

		Mousetrap.bind("b f", function () { // forward one layer
			const n = d20plus.engine._getSelectedToMove();
			d20plus.engine.forwardOneLayer(n);
			return false;
		});

		/**
		 * @param token A token.
		 * @return {number} 0 for unknown, 1 for NPC, 2 for PC.
		 */
		function getTokenType (token) {
			if (token && token.model && token.model.toJSON && token.model.toJSON().represents) {
				const charIdMaybe = token.model.toJSON().represents;
				if (!charIdMaybe) return 0; //
				const charMaybe = d20.Campaign.characters.get(charIdMaybe);
				if (charMaybe) {
					const atbs = charMaybe.attribs.toJSON();
					const npcAtbMaybe = atbs.find(it => it.name === "npc");

					if (npcAtbMaybe && npcAtbMaybe.current == 1) {
						return 1;
					} else {
						return 2;
					}
				} else return 0;
			} else return 0;
		}

		const lastContextSelection = {
			lastAnimUid: null,
			lastSceneUid: null,
		};

		// BEGIN ROLL20 CODE
		var e, t = !1, n = [];
		var i = function() {
			t && (t.remove(),
				t = !1),
			e && clearTimeout(e)
		};
		var r = function (r) {
			var o, a;
			r.changedTouches && r.changedTouches.length > 0 ? (o = r.changedTouches[0].pageX,
				a = r.changedTouches[0].pageY) : (o = r.pageX,
				a = r.pageY),
				i(),
				n = [];
			for (var s = [], l = d20.engine.selected(), c = 0; c < l.length; c++)
				n.push(l[c]),
					s.push(l[c].type);
			if (s = _.uniq(s),
			n.length > 0)
				if (1 == s.length) {
					var u = n[0];
					t = $("image" == u.type && 0 == u.model.get("isdrawing") ? $("#tmpl_actions_menu").jqote(u.model) : $("#tmpl_actions_menu").jqote(u.model))
				} else {
					var u = n[0];
					t = $($("#tmpl_actions_menu").jqote(u.model))
				}
			else
				t = $($("#tmpl_actions_menu").jqote({}));
			if (!window.is_gm && t[0].lastElementChild.childElementCount < 1)
				return !1;
			t.appendTo("body");
			var d = t.height()
				, h = t.width()
				, p = {};
			return p.top = a > $("#editor-wrapper").height() - $("#playerzone").height() - d - 100 ? a - d + "px" : a + "px",
				p.left = o > $("#editor-wrapper").width() - h ? o + 10 - h + "px" : o + 10 + "px",
				t.css(p),
				$(".actions_menu").bind("mousedown mouseup touchstart", function(e) {
					e.stopPropagation()
				}),
				$(".actions_menu ul > li").bind("mouseover touchend", function() {
					if (e && (clearTimeout(e),
						e = !1),
					$(this).parents(".hasSub").length > 0)
						;
					else if ($(this).hasClass("hasSub")) {
						$(".actions_menu").css({
							width: "215px",
							height: "250px"
						});
						var t = this;
						_.defer(function() {
							$(".actions_menu ul.submenu").hide(),
								$(t).find("ul.submenu:hidden").show()
						})
					} else
						$(".actions_menu ul.submenu").hide()
				}),
				$(".actions_menu ul.submenu").live("mouseover", function() {
					e && (clearTimeout(e),
						e = !1)
				}),
				$(".actions_menu, .actions_menu ul.submenu").live("mouseleave", function() {
					e || (e = setTimeout(function() {
						$(".actions_menu ul.submenu").hide(),
							$(".actions_menu").css("width", "100px").css("height", "auto"),
							e = !1
					}, 500))
				}),
				$(".actions_menu li").on(clicktype, function() {
					var e = $(this).attr("data-action-type");
					if (null != e) {
						if ("copy" == e)
							d20.clipboard.doCopy(),
								i();
						else if ("paste" == e)
							d20.clipboard.doPaste(),
								i();
						else if ("delete" == e) {
							var t = d20.engine.selected();
							d20.engine.canvas.deactivateAllWithDispatch();
							for (var r = 0; r < t.length; r++)
								t[r].model.destroy();
							i()
						} else if ("undo" == e)
							d20.undo && d20.undo.doUndo(),
								i();
						else if ("tofront" == e)
							d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
								_.each(n, function(e) {
									d20.engine.canvas.bringToFront(e)
								}),
								d20.Campaign.activePage().debounced_recordZIndexes(),
								i();
						else if ("toback" == e)
							d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
								_.each(n, function(e) {
									d20.engine.canvas.sendToBack(e)
								}),
								d20.Campaign.activePage().debounced_recordZIndexes(),
								i();
						else if (-1 !== e.indexOf("tolayer_")) {
							d20.engine.unselect();
							var o = e.replace("tolayer_", "");
							_.each(n, function(e) {
								e.model.save({
									layer: o
								})
							}),
								i(),
								d20.token_editor.removeRadialMenu()
						} else if ("addturn" == e)
							_.each(n, function(e) {
								d20.Campaign.initiativewindow.addTokenToList(e.model.id)
							}),
								i(),
							d20.tutorial && d20.tutorial.active && $(document.body).trigger("addedTurn");
						else if ("group" == e) {
							var a = [];
							d20.engine.unselect(),
								_.each(n, function(e) {
									a.push(e.model.id)
								}),
								_.each(n, function(e) {
									e.model.addToGroup(a)
								}),
								i();
							var s = n[0];
							d20.engine.select(s)
						} else if ("ungroup" == e)
							d20.engine.unselect(),
								_.each(n, function(e) {
									e.model.clearGroup()
								}),
								d20.token_editor.removeRadialMenu(),
								i();
						else if ("toggledrawing" == e)
							d20.engine.unselect(),
								_.each(n, function(e) {
									e.model.set({
										isdrawing: !e.model.get("isdrawing")
									}).save()
								}),
								i(),
								d20.token_editor.removeRadialMenu();
						else if ("toggleflipv" == e)
							d20.engine.unselect(),
								_.each(n, function(e) {
									e.model.set({
										flipv: !e.model.get("flipv")
									}).save()
								}),
								i(),
								d20.token_editor.removeRadialMenu();
						else if ("togglefliph" == e)
							d20.engine.unselect(),
								_.each(n, function(e) {
									e.model.set({
										fliph: !e.model.get("fliph")
									}).save()
								}),
								i(),
								d20.token_editor.removeRadialMenu();
						else if ("takecard" == e)
							d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
								_.each(n, function(e) {
									var t = d20.decks.cardByID(e.model.get("cardid"));
									if (e.model.get("isdrawing") === !1)
										var n = {
											bar1_value: e.model.get("bar1_value"),
											bar1_max: e.model.get("bar1_max"),
											bar2_value: e.model.get("bar2_value"),
											bar2_max: e.model.get("bar2_max"),
											bar3_value: e.model.get("bar3_value"),
											bar3_max: e.model.get("bar3_max")
										};
									d20.Campaign.hands.addCardToHandForPlayer(t, window.currentPlayer, n ? n : void 0),
										_.defer(function() {
											e.model.destroy()
										})
								}),
								d20.engine.unselect(),
								i();
						else if ("flipcard" == e)
							d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
								_.each(n, function(e) {
									var t = e.model.get("sides").split("|")
										, n = e.model.get("currentSide")
										, i = n + 1;
									i > t.length - 1 && (i = 0),
										e.model.set({
											currentSide: i,
											imgsrc: unescape(t[i])
										}).save()
								}),
								i();
						else if ("setdimensions" == e) {
							var l = n[0]
								, c = $($("#tmpl_setdimensions").jqote()).dialog({
								title: "Set Dimensions",
								width: 325,
								height: 225,
								buttons: {
									Set: function() {
										var e, t;
										"pixels" == c.find(".dimtype").val() ? (e = parseInt(c.find("input.width").val(), 10),
											t = parseInt(c.find("input.height").val(), 10)) : (e = parseFloat(c.find("input.width").val()) * window.dpi,
											t = parseFloat(c.find("input.height").val()) * window.dpi),
											l.model.save({
												width: e,
												height: t
											}),
											c.off("change"),
											c.dialog("destroy").remove()
									},
									Cancel: function() {
										c.off("change"),
											c.dialog("destroy").remove()
									}
								},
								beforeClose: function() {
									c.off("change"),
										c.dialog("destroy").remove()
								}
							});
							c.on("change", ".dimtype", function() {
								"pixels" == $(this).val() ? (c.find("input.width").val(Math.round(l.get("width"))),
									c.find("input.height").val(Math.round(l.get("height")))) : (c.find("input.width").val(l.get("width") / window.dpi),
									c.find("input.height").val(l.get("height") / window.dpi))
							}),
								c.find(".dimtype").trigger("change"),
								i()
						} else if ("aligntogrid" == e)
							if (0 === d20.Campaign.activePage().get("snapping_increment")) {
								i();
								var u = $($("#tmpl_grid-disabled").jqote(h)).dialog({
									title: "Grid Off",
									buttons: {
										Ok: function() {
											u.off("change"),
												u.dialog("destroy").remove()
										}
									},
									beforeClose: function() {
										u.off("change"),
											u.dialog("destroy").remove()
									}
								})
							} else
								d20.engine.gridaligner.target = n[0],
									d20plus.setMode("gridalign"),
									i();
						else if ("side_random" == e) {
							d20.engine.canvas.getActiveGroup() && d20.engine.unselect();
							var d = [];
							_.each(n, function(e) {
								if (e.model && "" != e.model.get("sides")) {
									var t = e.model.get("sides").split("|")
										, n = t.length
										, i = d20.textchat.diceengine.random(n);
									// BEGIN MOD
									const imgUrl = unescape(t[i]);
									e.model.save(getRollableTokenUpdate(imgUrl, i)),
									// END MOD
										d.push(t[i])
								}
							}),
								d20.textchat.rawChatInput({
									type: "tokenroll",
									content: d.join("|")
								}),
								i()
						} else if ("side_choose" == e) {
							const e = n[0]
								, t = e.model.toJSON()
								, o = t.sides.split("|");
							let r = t.currentSide;
							const a = $($("#tmpl_chooseside").jqote()).dialog({
								title: "Choose Side",
								width: 325,
								height: 225,
								buttons: {
									Choose: function() {
										const imgUrl = unescape(o[r]);
										d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
											// BEGIN MOD
											e.model.save(getRollableTokenUpdate(imgUrl, r)),
											// END MOD
											a.off("slide"),
											a.dialog("destroy").remove()
									},
									Cancel: function() {
										a.off("slide"),
											a.dialog("destroy").remove()
									}
								},
								beforeClose: function() {
									a.off("slide"),
										a.dialog("destroy").remove()
								}
							})
								, s = a.find(".sidechoices");
							for (const e of o) {
								const t = unescape(e);
								let n = d20.utils.isVideo(t) ? `<video src="${t.replace("/med.webm", "/thumb.webm")}" muted autoplay loop />` : `<img src="${t}" />`;
								n = `<div class="sidechoice">${n}</div>`,
									s.append(n)
							}
							s.children().attr("data-selected", !1).eq(r).attr("data-selected", !0),
								a.find(".sideslider").slider({
									min: 0,
									max: o.length - 1,
									step: 1,
									value: r
								}),
								a.on("slide", function(e, t) {
									t.value != r && (r = t.value,
										a.find(".sidechoices .sidechoice").attr("data-selected", !1).eq(t.value).attr("data-selected", !0))
								}),
								i(),
								d20.token_editor.removeRadialMenu()
						}
						// BEGIN MOD
						const showRollOptions = (formula, options) => {
							const sel = d20.engine.selected();

							options = options.map(it => `<option>${it}</option>`);

							const dialog= $("<div><p style='font-size: 1.15em;'><strong>" + d20.utils.strip_tags("Select Save") + ":</strong> <select style='width: 150px; margin-left: 5px;'>" + options.join("") + "</select></p></div>");

							dialog.dialog({
								title: "Input Value",
								beforeClose: function() {
									return false;
								},
								buttons: {
									Submit: function() {
										const val = dialog.find("select").val();
										console.log(val);
										d20.engine.unselect();
										sel.forEach(it => {
											d20.engine.select(it);
											const toRoll = formula(it, val);
											d20.textchat.doChatInput(toRoll);
											d20.engine.unselect();
										});

										dialog.off();
										dialog.dialog("destroy").remove();
										d20.textchat.$textarea.focus();
									},
									Cancel: function() {
										dialog.off();
										dialog.dialog("destroy").remove();
									}
								}
							});

							i();
						};

						if ("rollsaves" === e) {
							// Mass roll: Saves
							const options = ["str", "dex", "con", "int", "wis", "cha"].map(it => Parser.attAbvToFull(it));
							if (d20plus.sheet === "ogl") {
								showRollOptions(
									(token, val) => {
										if (getTokenType(token) === 1) {
											const short = val.substring(0, 3);
											return `${getTokenWhisperPart()}@{selected|wtype}&{template:npc} @{selected|npc_name_flag} {{type=Save}} @{selected|rtype} + [[@{selected|npc_${short.toLowerCase()}_save}]][${short.toUpperCase()}]]]}} {{rname=${val} Save}} {{r1=[[1d20 + [[@{selected|npc_${short.toLowerCase()}_save}]][${short.toUpperCase()}]]]}}`;
										} else {
											return `@{selected|wtype} &{template:simple} {{charname=@{selected|token_name}}} {{always=1}} {{rname=${val} Save}} {{mod=@{selected|${val.toLowerCase()}_save_bonus}}} {{r1=[[1d20+@{selected|${val.toLowerCase()}_save_bonus}]]}} {{r2=[[1d20+@{selected|${val.toLowerCase()}_save_bonus}]]}}`;
										}
									},
									options
								);
							}
							else if (d20plus.sheet === "shaped") {
								showRollOptions(
									(token, val) => `@{selected|output_option}} &{template:5e-shaped} {{ability=1}} {{character_name=@{selected|token_name}}} {{title=${val} Save}} {{mod=@{selected|${val.toLowerCase()}_mod}}} {{roll1=[[1d20+@{selected|${val.toLowerCase()}_mod}]]}} {{roll2=[[1d20+@{selected|${val.toLowerCase()}_mod}]]}}`,
									options
								);
							}
						} else if ("rollinit" === e) {
							// Mass roll: Initiative
							const sel = d20.engine.selected();
							d20.engine.unselect();
							sel.forEach(it => {
								d20.engine.select(it);
								let toRoll = ``;
								if (d20plus.sheet === "ogl") {
									toRoll = `%{selected|Initiative}`;
								} else if (d20plus.sheet === "shaped") {
									toRoll = `@{selected|output_option} &{template:5e-shaped} {{ability=1}} {{title=INITIATIVE}} {{roll1=[[@{selected|initiative_formula}]]}}`;
								}
								d20.textchat.doChatInput(toRoll);
								d20.engine.unselect();
							});
							i();
						} else if ("rollskills" === e) {
							// TODO a "roll abilitiy check" option? NPC macro: @{selected|wtype}&{template:npc} @{selected|npc_name_flag} {{type=Check}} @{selected|rtype} + [[@{selected|strength_mod}]][STR]]]}} {{rname=Strength Check}} {{r1=[[1d20 + [[@{selected|strength_mod}]][STR]]]}}

							// Mass roll: Skills
							const options = [
								"Athletics",
								"Acrobatics",
								"Sleight of Hand",
								"Stealth",
								"Arcana",
								"History",
								"Investigation",
								"Nature",
								"Religion",
								"Animal Handling",
								"Insight",
								"Medicine",
								"Perception",
								"Survival",
								"Deception",
								"Intimidation",
								"Performance",
								"Persuasion"
							].sort();

							showRollOptions(
								(token, val) => {
									const clean = val.toLowerCase().replace(/ /g, "_");
									const abil = `${Parser.attAbvToFull(Parser.skillToAbilityAbv(val.toLowerCase())).toLowerCase()}_mod`;

									let doRoll = '';
									if (d20plus.sheet === "ogl") {
										doRoll = (atb = abil) => {
											if (getTokenType(token) === 1) {
												const slugged = val.replace(/\s/g, "_").toLowerCase();
												return `${getTokenWhisperPart()}@{selected|wtype}&{template:npc} @{selected|npc_name_flag} {{type=Skill}} @{selected|rtype} + [[@{selected|npc_${slugged}}]]]]}}; {{rname=${val}}}; {{r1=[[1d20 + [[@{selected|npc_${slugged}}]]]]}}
`
											} else {
												return `@{selected|wtype} &{template:simple} {{charname=@{selected|token_name}}} {{always=1}} {{rname=${val}}} {{mod=@{selected|${atb}}}} {{r1=[[1d20+@{selected|${atb}}]]}} {{r2=[[1d20+@{selected|${atb}}]]}}`;
											}
										}
									} else if (d20plus.sheet === "shaped"){
										doRoll = (atb = abil) => {
											return `@{selected|output_option} &{template:5e-shaped} {{ability=1}} {{character_name=@{selected|token_name}}} {{title=${val}}} {{mod=@{selected|${atb}}}} {{roll1=[[1d20+@{selected|${atb}}]]}} {{roll2=[[1d20+@{selected|${atb}}]]}}`;
										}
									}

									try {
										if (token && token.model && token.model.toJSON && token.model.toJSON().represents) {
											const charIdMaybe = token.model.toJSON().represents;
											if (!charIdMaybe) return doRoll();
											const charMaybe = d20.Campaign.characters.get(charIdMaybe);
											if (charMaybe) {
												const atbs = charMaybe.attribs.toJSON();
												const npcAtbMaybe = atbs.find(it => it.name === "npc");

												if (npcAtbMaybe && npcAtbMaybe.current == 1) {
													const npcClean = `npc_${clean}`;
													const bonusMaybe = atbs.find(it => it.name === npcClean);
													if (bonusMaybe) return doRoll(npcClean);
													else return doRoll();
												} else {
													const pcClean = `${clean}_bonus`;
													const bonusMaybe = atbs.find(it => it.name === pcClean);
													if (bonusMaybe) return doRoll(pcClean);
													else return doRoll();
												}
											} else return doRoll();
										} else return doRoll();
									} catch (x) {
										console.error(x);
										return doRoll();
									}
								},
								options
							);
						} else if ("forward-one" === e) {
							d20plus.engine.forwardOneLayer(n);
							i();
						} else if ("back-one" === e) {
							d20plus.engine.backwardOneLayer(n);
							i();
						} else if ("rollertokenresize" === e) {
							resizeToken();
							i();
						} else if ("copy-tokenid" === e) {
							const sel = d20.engine.selected();
							window.prompt("Copy to clipboard: Ctrl+C, Enter", sel[0].model.id);
							i();
						} else if ("copy-pathid" === e) {
							const sel = d20.engine.selected();
							window.prompt("Copy to clipboard: Ctrl+C, Enter", sel[0].model.id);
							i();
						} else if ("token-fly" === e) {
							const sel = d20.engine.selected().filter(it => it && it.type === "image");
							new Promise((resolve, reject) => {
								const $dialog = $(`
									<div title="Flight Height">
										<input type="number" placeholder="Flight height" name="flight">
									</div>
								`).appendTo($("body"));
								const $iptHeight = $dialog.find(`input[name="flight"]`).on("keypress", evt => {
									if (evt.which === 13) { // return
										doHandleOk();
									}
								});

								const doHandleOk = () => {
									const selected = Number($iptHeight.val());
									$dialog.dialog("close");
									if (isNaN(selected)) reject(`Value "${$iptHeight.val()}" was not a number!`);
									else resolve(selected);
								};

								$dialog.dialog({
									dialogClass: "no-close",
									buttons: [
										{
											text: "Cancel",
											click: function () {
												$(this).dialog("close");
												$dialog.remove();
												reject(`User cancelled the prompt`);
											}
										},
										{
											text: "OK",
											click: function () {
												doHandleOk();
											}
										}
									]
								});
							}).then(num => {
								const STATUS_PREFIX = `fluffy-wing@`;
								const statusString = `${num}`.split("").map(it => `${STATUS_PREFIX}${it}`).join(",");
								sel.forEach(s => {
									const existing = s.model.get("statusmarkers");
									if (existing && existing.trim()) {
										s.model.set("statusmarkers", [statusString, ...existing.split(",").filter(it => it && it && !it.startsWith(STATUS_PREFIX))].join(","));
									} else {
										s.model.set("statusmarkers", statusString);
									}
									s.model.save();
								});
							});
							i();
						} else if ("token-light" === e) {
							const SOURCES = {
								"None (Blind)": {
									bright: 0,
									dim: 0
								},
								"Torch/Light (Spell)": {
									bright: 20,
									dim: 20
								},
								"Lamp": {
									bright: 15,
									dim: 30
								},
								"Lantern, Bullseye": {
									bright: 60,
									dim: 60,
									angle: 30
								},
								"Lantern, Hooded": {
									bright: 30,
									dim: 30
								},
								"Lantern, Hooded (Dimmed)": {
									bright: 0,
									dim: 5
								},
								"Candle": {
									bright: 5,
									dim: 5
								},
								"Darkvision": {
									bright: 0,
									dim: 60,
									hidden: true
								},
								"Superior Darkvision": {
									bright: 0,
									dim: 120,
									hidden: true
								}
							};

							const sel = d20.engine.selected().filter(it => it && it.type === "image");
							new Promise((resolve, reject) => {
								const $dialog = $(`
									<div title="Light">
										<label class="flex">
											<span>Set Light Style</span>
											 <select style="width: 250px;">
												${Object.keys(SOURCES).map(it => `<option>${it}</option>`).join("")}
											</select>
										</label>
									</div>
								`).appendTo($("body"));
								const $selLight = $dialog.find(`select`);

								$dialog.dialog({
									dialogClass: "no-close",
									buttons: [
										{
											text: "Cancel",
											click: function () {
												$(this).dialog("close");
												$dialog.remove();
												reject(`User cancelled the prompt`);
											}
										},
										{
											text: "OK",
											click: function () {
												const selected = $selLight.val();
												$dialog.dialog("close");
												if (!selected) reject(`No value selected!`);
												else resolve(selected);
											}
										}
									]
								});
							}).then(key => {
								const light = SOURCES[key];

								const light_otherplayers = !light.hidden;
								// these are all stored as strings
								const dimRad = (light.dim || 0);
								const brightRad = (light.bright || 0);
								const totalRad = dimRad + brightRad;
								const light_angle = `${light.angle}` || "";
								const light_dimradius = `${totalRad - dimRad}`;
								const light_radius = `${totalRad}`;

								sel.forEach(s => {
									s.model.set("light_angle", light_angle);
									s.model.set("light_dimradius", light_dimradius);
									s.model.set("light_otherplayers", light_otherplayers);
									s.model.set("light_radius", light_radius);
									s.model.save();
								});
							});
							i();
						} else if ("unlock-tokens" === e) {
							d20plus.tool.get("UNLOCKER").openFn();
							i();
						} else if ("lock-token" === e) {
							d20.engine.selected().forEach(it => {
								if (it.model) {
									if (it.model.get("VeLocked")) {
										it.lockMovementX = false;
										it.lockMovementY = false;
										it.lockScalingX = false;
										it.lockScalingY = false;
										it.lockRotation = false;

										it.model.set("VeLocked", false);
									} else {
										it.lockMovementX = true;
										it.lockMovementY = true;
										it.lockScalingX = true;
										it.lockScalingY = true;
										it.lockRotation = true;

										it.model.set("VeLocked", true);
									}
									it.saveState();
									it.model.save();
								}
							});
							i();
						} else if ("token-animate" === e) {
							d20plus.anim.animatorTool.pSelectAnimation(lastContextSelection.lastAnimUid).then(animUid => {
								if (animUid == null) return;

								lastContextSelection.lastAnimUid = animUid;
								const selected = d20.engine.selected();
								d20.engine.unselect();
								selected.forEach(it => {
									if (it.model) {
										d20plus.anim.animator.startAnimation(it.model, animUid)
									}
								});
							});
							i();
						} else if ("util-scenes" === e) {
							d20plus.anim.animatorTool.pSelectScene(lastContextSelection.lastSceneUid).then(sceneUid => {
								if (sceneUid == null) return;

								lastContextSelection.lastSceneUid = sceneUid;
								d20plus.anim.animatorTool.doStartScene(sceneUid);
							});
							i();
						}
						// END MOD
						return !1
					}
				}),
				!1
		};
		// END ROLL20 CODE

		function getRollableTokenUpdate (imgUrl, curSide) {
			const m = /\?roll20_token_size=(.*)/.exec(imgUrl);
			const toSave = {
				currentSide: curSide,
				imgsrc: imgUrl
			};
			if (m) {
				toSave.width = 70 * Number(m[1]);
				toSave.height = 70 * Number(m[1])
			}
			return toSave;
		}

		function resizeToken () {
			const sel = d20.engine.selected();

			const options = [["Tiny", 0.5], ["Small", 1], ["Medium", 1], ["Large", 2], ["Huge", 3], ["Gargantuan", 4], ["Colossal", 5]].map(it => `<option value='${it[1]}'>${it[0]}</option>`);
			const dialog = $(`<div><p style='font-size: 1.15em;'><strong>${d20.utils.strip_tags("Select Size")}:</strong> <select style='width: 150px; margin-left: 5px;'>${options.join("")}</select></p></div>`);
			dialog.dialog({
				title: "New Size",
				beforeClose: function () {
					return false;
				},
				buttons: {
					Submit: function () {
						const size = dialog.find("select").val();
						d20.engine.unselect();
						sel.forEach(it => {
							const nxtSize = size * 70;
							const sides = it.model.get("sides");
							if (sides) {
								const ueSides = unescape(sides);
								const cur = it.model.get("currentSide");
								const split = ueSides.split("|");
								if (split[cur].includes("roll20_token_size")) {
									split[cur] = split[cur].replace(/(\?roll20_token_size=).*/, `$1${size}`);
								} else {
									split[cur] += `?roll20_token_size=${size}`;
								}
								const toSaveSides = split.map(it => escape(it)).join("|");
								const toSave = {
									sides: toSaveSides,
									width: nxtSize,
									height: nxtSize
								};
								console.log(`Updating token:`, toSave);
								it.model.save(toSave);
							} else {
								console.warn("Token had no side data!")
							}
						});
						dialog.off();
						dialog.dialog("destroy").remove();
						d20.textchat.$textarea.focus();
					},
					Cancel: function () {
						dialog.off();
						dialog.dialog("destroy").remove();
					}
				}
			});
		}

		d20.token_editor.showContextMenu = r;
		d20.token_editor.closeContextMenu = i;
		$(`#editor-wrapper`).on("click", d20.token_editor.closeContextMenu);
	};

	d20plus.engine._getSelectedToMove = () => {
		const n = [];
		for (var l = d20.engine.selected(), c = 0; c < l.length; c++)
			n.push(l[c]);
	};

	d20plus.engine.forwardOneLayer = (n) => {
		d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
			_.each(n, function (e) {
				d20.engine.canvas.bringForward(e)
			}),
			d20.Campaign.activePage().debounced_recordZIndexes()
	};

	d20plus.engine.backwardOneLayer = (n) => {
		d20.engine.canvas.getActiveGroup() && d20.engine.unselect(),
			_.each(n, function (e) {
				d20.engine.canvas.sendBackwards(e)
			}),
			d20.Campaign.activePage().debounced_recordZIndexes()
	};

	d20plus.engine._tempTopRenderLines = {}, // format: {x: ..., y: ..., to_x: ..., to_y: ..., ticks: ..., offset: ...}
	// previously "enhanceSnap"
	d20plus.engine.enhanceMouseDown = () => {
		/**
		 * Dumb variable names copy-pasted from uglified code
		 * @param c x co-ord
		 * @param u y c-ord
		 * @returns {*[]} 2-len array; [0] = x and [1] = y
		 */
		function getClosestHexPoint (c, u) {
			function getEuclidDist (x1, y1, x2, y2) {
				return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
			}

			const hx = d20.canvas_overlay.activeHexGrid.GetHexAt({
				X: c,
				Y: u
			});

			let minDist = 1000000;
			let minPoint = [c, u];

			function checkDist(x1, y1) {
				const dist = getEuclidDist(x1, y1, c, u);
				if (dist < minDist) {
					minDist =  dist;
					minPoint = [x1, y1];
				}
			}
			hx.Points.forEach(pt => {
				checkDist(pt.X, pt.Y);
			});
			checkDist(hx.MidPoint.X, hx.MidPoint.Y);

			return minPoint;
		}

		// original roll20 mousedown code, minified as "T" (as of 2019-06-08)
		// BEGIN ROLL20 CODE
		var S = !1;
		const T = function(e) {
			// BEGIN MOD
			var i = d20.engine.canvas;
			var r = $("#editor-wrapper");
			// END MOD
			var n, o;
			if (d20.tddice && d20.tddice.handleInteraction && d20.tddice.handleInteraction(),
				e.touches) {
				if ("pan" == d20.engine.mode)
					return;
				e.touches.length > 1 && (S = d20.engine.mode,
					d20.engine.mode = "pan",
					d20.engine.leftMouseIsDown = !0),
					d20.engine.lastTouchStarted = (new Date).getTime(),
					n = e.touches[0].pageX,
					o = e.touches[0].pageY,
					e.preventDefault()
			} else
				n = e.pageX,
					o = e.pageY;
			for (var a = d20.engine.showLastPaths.length; a--; )
				"selected" == d20.engine.showLastPaths[a].type && d20.engine.showLastPaths.splice(a, 1);
			d20.engine.handleMetaKeys(e),
			"select" != d20.engine.mode && "path" != d20.engine.mode || i.__onMouseDown(e),
			(0 === e.button || e.touches && 1 == e.touches.length) && (d20.engine.leftMouseIsDown = !0),
			2 === e.button && (d20.engine.rightMouseIsDown = !0);
			var s = Math.floor(n / d20.engine.canvasZoom + d20.engine.currentCanvasOffset[0] - d20.engine.paddingOffset[0] / d20.engine.canvasZoom)
				, l = Math.floor(o / d20.engine.canvasZoom + d20.engine.currentCanvasOffset[1] - d20.engine.paddingOffset[1] / d20.engine.canvasZoom);
			if (d20.engine.lastMousePos = [s, l],
				d20.engine.mousePos = [s, l],
			!d20.engine.leftMouseIsDown || "fog-reveal" != d20.engine.mode && "fog-hide" != d20.engine.mode && "gridalign" != d20.engine.mode) {
				if (d20.engine.leftMouseIsDown && "fog-polygonreveal" == d20.engine.mode) {
					// BEGIN MOD
					var c = s, u = l;

					if (0 != d20.engine.snapTo && (e.shiftKey && !d20.Campaign.activePage().get("adv_fow_enabled") || !e.shiftKey && d20.Campaign.activePage().get("adv_fow_enabled"))) {
						if ("square" == d20.Campaign.activePage().get("grid_type")) {
							c = d20.engine.snapToIncrement(c, d20.engine.snapTo);
							u = d20.engine.snapToIncrement(u, d20.engine.snapTo);
						} else {
							const minPoint = getClosestHexPoint(c, u);
							c = minPoint[0];
							u = minPoint[1];
						}
					}

					d20.engine.fog.points.length > 0 && Math.abs(d20.engine.fog.points[0][0] - c) + Math.abs(d20.engine.fog.points[0][1] - u) < 15 ? (d20.engine.fog.points.push([d20.engine.fog.points[0][0], d20.engine.fog.points[0][1]]),
						d20.engine.finishPolygonReveal()) : d20.engine.fog.points.push([c, u]),
						d20.engine.redrawScreenNextTick(!0)
					// END MOD
				} else if (d20.engine.leftMouseIsDown && "measure" == d20.engine.mode)
					if (2 === e.button)
						d20.engine.addWaypoint(e);
					else {
						d20.engine.measure.sticky && d20.engine.endMeasure(),
							d20.engine.measure.down[0] = s,
							d20.engine.measure.down[1] = l,
							d20.engine.measure.sticky = e.shiftKey;
						let t = d20.Campaign.activePage().get("grid_type")
							, n = "snap_center" === d20.engine.ruler_snapping && !e.altKey;
						if (n |= "no_snap" === d20.engine.ruler_snapping && e.altKey,
							n &= 0 !== d20.engine.snapTo)
							if ("square" === t)
								d20.engine.measure.down[1] = d20.engine.snapToIncrement(d20.engine.measure.down[1] + Math.floor(d20.engine.snapTo / 2), d20.engine.snapTo) - Math.floor(d20.engine.snapTo / 2),
									d20.engine.measure.down[0] = d20.engine.snapToIncrement(d20.engine.measure.down[0] + Math.floor(d20.engine.snapTo / 2), d20.engine.snapTo) - Math.floor(d20.engine.snapTo / 2);
							else {
								let e = d20.canvas_overlay.activeHexGrid.GetHexAt({
									X: d20.engine.measure.down[0],
									Y: d20.engine.measure.down[1]
								});
								e && (d20.engine.measure.down[1] = e.MidPoint.Y,
									d20.engine.measure.down[0] = e.MidPoint.X)
							}
						else if (0 === d20.engine.snapTo || "snap_corner" !== d20.engine.ruler_snapping || e.altKey)
							d20.engine.measure.flags |= 1;
						else {
							if ("square" === t)
								d20.engine.measure.down[0] = d20.engine.snapToIncrement(d20.engine.measure.down[0], d20.engine.snapTo),
									d20.engine.measure.down[1] = d20.engine.snapToIncrement(d20.engine.measure.down[1], d20.engine.snapTo);
							else {
								let e = d20.engine.snapToHexCorner([d20.engine.measure.down[0], d20.engine.measure.down[1]]);
								e && (d20.engine.measure.down[0] = e[0],
									d20.engine.measure.down[1] = e[1])
							}
							d20.engine.measure.flags |= 1
						}
					}
				else if (d20.engine.leftMouseIsDown && "fxtools" == d20.engine.mode)
					d20.engine.fx.current || (d20.engine.fx.current = d20.fx.handleClick(s, l));
				else if (d20.engine.leftMouseIsDown && "text" == d20.engine.mode) {
					const e = {
						fontFamily: $("#font-family").val(),
						fontSize: $("#font-size").val(),
						fill: $("#font-color").val(),
						text: "",
						left: s,
						top: l
					}
						, t = d20.Campaign.activePage().addText(e);
					$("body").on("mouseup.create_text_editor", ()=>{
							$("body").off("mouseup.create_text_editor"),
								d20.engine.editText(t.view.graphic, e.top, e.left),
								$(".texteditor").focus()
						}
					)
				} else if (d20.engine.leftMouseIsDown && "rect" == d20.engine.mode) {
					var p = parseInt($("#path_width").val(), 10)
						, f = d20.engine.drawshape.shape = {
						strokewidth: p,
						x: 0,
						y: 0,
						width: 10,
						height: 10,
						type: e.altKey ? "circle" : "rect"
					};
					c = s,
						u = l;
					0 != d20.engine.snapTo && e.shiftKey && (c = d20.engine.snapToIncrement(c, d20.engine.snapTo),
						u = d20.engine.snapToIncrement(u, d20.engine.snapTo)),
						f.x = c,
						f.y = u,
						f.fill = $("#path_fillcolor").val(),
						f.stroke = $("#path_strokecolor").val(),
						d20.engine.drawshape.start = [n + d20.engine.currentCanvasOffset[0] - d20.engine.paddingOffset[0], o + d20.engine.currentCanvasOffset[1] - d20.engine.paddingOffset[1]],
						d20.engine.redrawScreenNextTick()
				} else if (d20.engine.leftMouseIsDown && "polygon" == d20.engine.mode) {
					if (d20.engine.drawshape.shape)
						f = d20.engine.drawshape.shape;
					else {
						p = parseInt($("#path_width").val(), 10);
						(f = d20.engine.drawshape.shape = {
							strokewidth: p,
							points: [],
							type: "polygon"
						}).fill = $("#path_fillcolor").val(),
							f.stroke = $("#path_strokecolor").val()
					}
					// BEGIN MOD
					c = s, u = l;

					if (0 != d20.engine.snapTo && e.shiftKey) {
						if ("square" == d20.Campaign.activePage().get("grid_type")) {
							c = d20.engine.snapToIncrement(c, d20.engine.snapTo);
							u = d20.engine.snapToIncrement(u, d20.engine.snapTo);
						} else {
							const minPoint = getClosestHexPoint(c, u);
							c = minPoint[0];
							u = minPoint[1];
						}
					}

					f.points.length > 0 && Math.abs(f.points[0][0] - c) + Math.abs(f.points[0][1] - u) < 15 ? (f.points.push([f.points[0][0], f.points[0][1]]),
						d20.engine.finishCurrentPolygon()) : f.points.push([c, u]),
						d20.engine.redrawScreenNextTick()
					// END MOD
				} else if (d20.engine.leftMouseIsDown && "targeting" === d20.engine.mode) {
					var g = d20.engine.canvas.findTarget(e, !0, !0);
					return void (g !== undefined && "image" === g.type && g.model && d20.engine.nextTargetCallback(g))
				}
				// BEGIN MOD
				else if (d20.engine.leftMouseIsDown && "line_splitter" === d20.engine.mode) {
					const lastPoint = {x: d20.engine.lastMousePos[0], y: d20.engine.lastMousePos[1]};
					(d20.engine.canvas._objects || []).forEach(o => {
						if (o.type === "path" && o.containsPoint(lastPoint)) {
							const asObj = o.toObject();
							const anyCurves = asObj.path.filter(it => it instanceof Array && it.length > 0  && it[0] === "C");
							if (!anyCurves.length) {
								// PathMath expects these
								o.model.set("_pageid", d20.Campaign.activePage().get("id"));
								o.model.set("_path", JSON.stringify(o.path));

								console.log("SPLITTING PATH: ", o.model.toJSON());
								const mainPath = o.model;

								// BEGIN PathSplitter CODE
								let mainSegments = PathMath.toSegments(mainPath);
								// BEGIN MOD
								// fake a tiny diagonal line
								const SLICE_LEN = 10;
								const slicePoint1 = [lastPoint.x + (SLICE_LEN / 2), lastPoint.y + (SLICE_LEN / 2), 1];
								const slicePoint2 = [lastPoint.x - (SLICE_LEN / 2), lastPoint.y - (SLICE_LEN / 2), 1];
								const nuId = d20plus.ut.generateRowId();
								d20plus.engine._tempTopRenderLines[nuId] = {
									ticks: 2,
									x: slicePoint1[0],
									y: slicePoint1[1],
									to_x: slicePoint2[0],
									to_y: slicePoint2[1],
									offset: [...d20.engine.currentCanvasOffset]
								};
								setTimeout(() => {
									d20.engine.redrawScreenNextTick();
								}, 1);
								let splitSegments = [
									[slicePoint1, slicePoint2]
								];
								// END MOD
								let segmentPaths = _getSplitSegmentPaths(mainSegments, splitSegments);

								// (function moved into this scope)
								function _getSplitSegmentPaths(mainSegments, splitSegments) {
									let resultSegPaths = [];
									let curPathSegs = [];

									_.each(mainSegments, seg1 => {

										// Find the points of intersection and their parametric coefficients.
										let intersections = [];
										_.each(splitSegments, seg2 => {
											let i = PathMath.segmentIntersection(seg1, seg2);
											if(i) intersections.push(i);
										});

										if(intersections.length > 0) {
											// Sort the intersections in the order that they appear along seg1.
											intersections.sort((a, b) => {
												return a[1] - b[1];
											});

											let lastPt = seg1[0];
											_.each(intersections, i => {
												// Complete the current segment path.
												curPathSegs.push([lastPt, i[0]]);
												resultSegPaths.push(curPathSegs);

												// Start a new segment path.
												curPathSegs = [];
												lastPt = i[0];
											});
											curPathSegs.push([lastPt, seg1[1]]);
										}
										else {
											curPathSegs.push(seg1);
										}
									});
									resultSegPaths.push(curPathSegs);

									return resultSegPaths;
								};
								// (end function moved into this scope)

								// Convert the list of segment paths into paths.
								let _pageid = mainPath.get('_pageid');
								let controlledby = mainPath.get('controlledby');
								let fill = mainPath.get('fill');
								let layer = mainPath.get('layer');
								let stroke = mainPath.get('stroke');
								let stroke_width = mainPath.get('stroke_width');

								let results = [];
								_.each(segmentPaths, segments => {
									// BEGIN MOD
									if (!segments) {
										d20plus.chatLog(`A path had no segments! This is probably a bug. Please report it.`);
										return;
									}
									// END MOD

									let pathData = PathMath.segmentsToPath(segments);
									_.extend(pathData, {
										_pageid,
										controlledby,
										fill,
										layer,
										stroke,
										stroke_width
									});
									let path = createObj('path', pathData);
									results.push(path);
								});

								// Remove the original path and the splitPath.
								// BEGIN MOD
								mainPath.destroy();
								// END MOD
								// END PathSplitter CODE
							}
						}
					});
				}
				// END MOD
			} else
				d20.engine.fog.down[0] = s,
					d20.engine.fog.down[1] = l,
				0 != d20.engine.snapTo && "square" == d20.Campaign.activePage().get("grid_type") && ("gridalign" == d20.engine.mode ? e.shiftKey && (d20.engine.fog.down[0] = d20.engine.snapToIncrement(d20.engine.fog.down[0], d20.engine.snapTo),
					d20.engine.fog.down[1] = d20.engine.snapToIncrement(d20.engine.fog.down[1], d20.engine.snapTo)) : (e.shiftKey && !d20.Campaign.activePage().get("adv_fow_enabled") || !e.shiftKey && d20.Campaign.activePage().get("adv_fow_enabled")) && (d20.engine.fog.down[0] = d20.engine.snapToIncrement(d20.engine.fog.down[0], d20.engine.snapTo),
					d20.engine.fog.down[1] = d20.engine.snapToIncrement(d20.engine.fog.down[1], d20.engine.snapTo)));
			if (window.currentPlayer && d20.engine.leftMouseIsDown && "select" == d20.engine.mode) {
				if (2 === e.button && d20.engine.addWaypoint(e),
				d20.engine.pings[window.currentPlayer.id] && d20.engine.pings[window.currentPlayer.id].radius > 20)
					return;
				var m = {
					left: s,
					top: l,
					radius: -5,
					player: window.currentPlayer.id,
					pageid: d20.Campaign.activePage().id,
					currentLayer: window.currentEditingLayer
				};
				window.is_gm && e.shiftKey && (m.scrollto = !0),
					d20.engine.pings[window.currentPlayer.id] = m,
					d20.engine.pinging = {
						downx: n,
						downy: o
					},
					d20.engine.redrawScreenNextTick(!0)
			}
			d20.engine.rightMouseIsDown && ("select" == d20.engine.mode || "path" == d20.engine.mode || "text" == d20.engine.mode) || d20.engine.leftMouseIsDown && "pan" == d20.engine.mode ? (d20.engine.pan.beginPos = [r.scrollLeft(), r.scrollTop()],
				d20.engine.pan.panXY = [n, o],
				d20.engine.pan.panning = !0) : d20.engine.pan.panning = !1,
			2 === e.button && !d20.engine.leftMouseIsDown && d20.engine.measurements[window.currentPlayer.id] && d20.engine.measurements[window.currentPlayer.id].sticky && (d20.engine.endMeasure(),
				d20.engine.announceEndMeasure({
					player: window.currentPlayer.id
				})),
				// BEGIN MOD
			$(`#finalcanvas`).hasClass("hasfocus") || $(`#finalcanvas`).focus()
			// END MOD
		};
		// END ROLL20 CODE

		if (FINAL_CANVAS_MOUSEDOWN_LIST.length) {
			FINAL_CANVAS_MOUSEDOWN = (FINAL_CANVAS_MOUSEDOWN_LIST.find(it => it.on === d20.engine.final_canvas) || {}).listener;
		}

		if (FINAL_CANVAS_MOUSEDOWN) {
			d20plus.ut.log("Enhancing hex snap");
			d20.engine.final_canvas.removeEventListener("mousedown", FINAL_CANVAS_MOUSEDOWN);
			d20.engine.final_canvas.addEventListener("mousedown", T);
		}

		// add sub-grid snap
		d20.engine.snapToIncrement = function(e, t) {
			t *= Number(d20plus.cfg.getOrDefault("canvas", "gridSnap"));
			return t * Math.round(e / t);
		}
	};

	d20plus.engine.enhanceMouseUp = () => { // P

	};

	d20plus.engine.enhanceMouseMove = () => {
		// needs to be called after `enhanceMeasureTool()`
		const $selMeasureMode = $(`#measure_mode`);
		const $selRadMode = $(`#measure_mode_sel_2`);
		const $iptConeWidth = $(`#measure_mode_ipt_3`);
		const $selConeMode = $(`#measure_mode_sel_3`);
		const $selBoxMode = $(`#measure_mode_sel_4`);
		const $selLineMode = $(`#measure_mode_sel_5`);
		const $iptLineWidth = $(`#measure_mode_ipt_5`);

		// BEGIN ROLL20 CODE
		// not used?
		var x = function(e) {
			e.type = "measuring",
				e.time = (new Date).getTime(),
				d20.textchat.sendShout(e)
		}
			, k = _.throttle(x, 200)
			, E = function(e) {
			k(e),
			d20.tutorial && d20.tutorial.active && $(document.body).trigger("measure"),
				d20.engine.receiveMeasureUpdate(e)
		};
		// END ROLL20 CODE

		// add missing vars
		var i = d20.engine.canvas;
		var r = $("#editor-wrapper");

		// Roll20 bug (present as of 2019-5-25) workaround
		//   when box-selecting + moving tokens, the "object:moving" event throws an exception
		//   try-catch-ignore this, because it's extremely annoying
		const cachedFire = i.fire.bind(i);
		i.fire = function (namespace, opts) {
			if (namespace === "object:moving") {
				try {
					cachedFire(namespace, opts);
				} catch (e) {}
			} else {
				cachedFire(namespace, opts);
			}
		};

		// mousemove handler from Roll20 @ 2019-06-04
		// BEGIN ROLL20 CODE
		const A = function(e) {
			var t, n;
			if (e.changedTouches ? ((e.changedTouches.length > 1 || "pan" == d20.engine.mode) && (delete d20.engine.pings[window.currentPlayer.id],
				d20.engine.pinging = !1),
				e.preventDefault(),
				t = e.changedTouches[0].pageX,
				n = e.changedTouches[0].pageY) : (t = e.pageX,
				n = e.pageY),
			"select" != d20.engine.mode && "path" != d20.engine.mode && "targeting" != d20.engine.mode || i.__onMouseMove(e),
			d20.engine.leftMouseIsDown || d20.engine.rightMouseIsDown) {
				var o = Math.floor(t / d20.engine.canvasZoom + d20.engine.currentCanvasOffset[0] - d20.engine.paddingOffset[0] / d20.engine.canvasZoom)
					, a = Math.floor(n / d20.engine.canvasZoom + d20.engine.currentCanvasOffset[1] - d20.engine.paddingOffset[1] / d20.engine.canvasZoom);
				if (d20.engine.mousePos = [o, a],
				!d20.engine.leftMouseIsDown || "fog-reveal" != d20.engine.mode && "fog-hide" != d20.engine.mode && "gridalign" != d20.engine.mode) {
					if (d20.engine.leftMouseIsDown && "measure" == d20.engine.mode && d20.engine.measure.down[0] !== undefined && d20.engine.measure.down[1] !== undefined) {
						d20.engine.measure.down[2] = o,
							d20.engine.measure.down[3] = a,
							d20.engine.measure.sticky |= e.shiftKey;
						let t = d20.Campaign.activePage().get("grid_type")
							, n = "snap_corner" === d20.engine.ruler_snapping && !e.altKey && 0 !== d20.engine.snapTo
							, i = "snap_center" === d20.engine.ruler_snapping && !e.altKey;
						if (i |= "no_snap" === d20.engine.ruler_snapping && e.altKey,
							i &= 0 !== d20.engine.snapTo) {
							if ("square" === t)
								d20.engine.measure.down[2] = d20.engine.snapToIncrement(d20.engine.measure.down[2] + Math.floor(d20.engine.snapTo / 2), d20.engine.snapTo) - Math.floor(d20.engine.snapTo / 2),
									d20.engine.measure.down[3] = d20.engine.snapToIncrement(d20.engine.measure.down[3] + Math.floor(d20.engine.snapTo / 2), d20.engine.snapTo) - Math.floor(d20.engine.snapTo / 2);
							else {
								let e = d20.canvas_overlay.activeHexGrid.GetHexAt({
									X: d20.engine.measure.down[2],
									Y: d20.engine.measure.down[3]
								});
								e && (d20.engine.measure.down[3] = e.MidPoint.Y,
									d20.engine.measure.down[2] = e.MidPoint.X)
							}
							d20.engine.measure.flags &= -3
						} else if (n) {
							if ("square" === t)
								d20.engine.measure.down[2] = d20.engine.snapToIncrement(d20.engine.measure.down[2], d20.engine.snapTo),
									d20.engine.measure.down[3] = d20.engine.snapToIncrement(d20.engine.measure.down[3], d20.engine.snapTo);
							else {
								let e = d20.engine.snapToHexCorner([d20.engine.measure.down[2], d20.engine.measure.down[3]]);
								e && (d20.engine.measure.down[2] = e[0],
									d20.engine.measure.down[3] = e[1])
							}
							d20.engine.measure.flags |= 2
						} else
							d20.engine.measure.flags |= 2;
						var s = {
							x: d20.engine.measure.down[0],
							y: d20.engine.measure.down[1],
							to_x: d20.engine.measure.down[2],
							to_y: d20.engine.measure.down[3],
							player: window.currentPlayer.id,
							pageid: d20.Campaign.activePage().id,
							currentLayer: window.currentEditingLayer,
							waypoints: d20.engine.measure.waypoints,
							sticky: d20.engine.measure.sticky,
							flags: d20.engine.measure.flags,
							hide: d20.engine.measure.hide
							// BEGIN MOD
							,
							Ve: {
								mode: $selMeasureMode.val(),
								radius: {
									mode: $selRadMode.val()
								},
								cone: {
									arc: $iptConeWidth.val(),
									mode: $selConeMode.val()
								},
								box: {
									mode: $selBoxMode.val(),
								},
								line: {
									mode: $selLineMode.val(),
									width: $iptLineWidth.val()
								}
							}
							// END MOD
						};
						d20.engine.announceMeasure(s)
					} else if (d20.engine.leftMouseIsDown && "fxtools" == d20.engine.mode) {
						if (d20.engine.fx.current) {
							var l = (new Date).getTime();
							l - d20.engine.fx.lastMoveBroadcast > d20.engine.fx.MOVE_BROADCAST_FREQ ? (d20.fx.moveFx(d20.engine.fx.current, o, a),
								d20.engine.fx.lastMoveBroadcast = l) : d20.fx.moveFx(d20.engine.fx.current, o, a, !0)
						}
					} else if (d20.engine.leftMouseIsDown && "rect" == d20.engine.mode) {
						var c = (t + d20.engine.currentCanvasOffset[0] - d20.engine.paddingOffset[0] - d20.engine.drawshape.start[0]) / d20.engine.canvasZoom
							, u = (n + d20.engine.currentCanvasOffset[1] - d20.engine.paddingOffset[1] - d20.engine.drawshape.start[1]) / d20.engine.canvasZoom;
						0 != d20.engine.snapTo && e.shiftKey && (c = d20.engine.snapToIncrement(c, d20.engine.snapTo),
							u = d20.engine.snapToIncrement(u, d20.engine.snapTo));
						var d = d20.engine.drawshape.shape;
						d.width = c,
							d.height = u,
							d20.engine.redrawScreenNextTick()
					}
				} else
					d20.engine.fog.down[2] = o,
						d20.engine.fog.down[3] = a,
					0 != d20.engine.snapTo && "square" == d20.Campaign.activePage().get("grid_type") && ("gridalign" == d20.engine.mode ? e.shiftKey && (d20.engine.fog.down[2] = d20.engine.snapToIncrement(d20.engine.fog.down[2], d20.engine.snapTo),
						d20.engine.fog.down[3] = d20.engine.snapToIncrement(d20.engine.fog.down[3], d20.engine.snapTo)) : (e.shiftKey && !d20.Campaign.activePage().get("adv_fow_enabled") || !e.shiftKey && d20.Campaign.activePage().get("adv_fow_enabled")) && (d20.engine.fog.down[2] = d20.engine.snapToIncrement(d20.engine.fog.down[2], d20.engine.snapTo),
						d20.engine.fog.down[3] = d20.engine.snapToIncrement(d20.engine.fog.down[3], d20.engine.snapTo))),
						d20.Campaign.activePage().get("showdarkness") ? d20.engine.redrawScreenNextTick(!0) : d20.engine.clearCanvasOnRedraw("fog");
				if (d20.engine.pinging)
					(c = Math.abs(d20.engine.pinging.downx - t)) + (u = Math.abs(d20.engine.pinging.downy - n)) > 10 && (delete d20.engine.pings[window.currentPlayer.id],
						d20.engine.pinging = !1);
				if (d20.engine.pan.panning) {
					c = 2 * (t - d20.engine.pan.panXY[0]),
						u = 2 * (n - d20.engine.pan.panXY[1]);
					if (d20.engine.pan.lastPanDist += Math.abs(c) + Math.abs(u),
					d20.engine.pan.lastPanDist < 10)
						return;
					var h = d20.engine.pan.beginPos[0] - c
						, p = d20.engine.pan.beginPos[1] - u;
					r.stop().animate({
						scrollLeft: h,
						scrollTop: p
					}, {
						duration: 1500,
						easing: "easeOutExpo",
						queue: !1
					})
				}
			}
		};
		// END ROLL20 CODE

		if (FINAL_CANVAS_MOUSEMOVE_LIST.length) {
			FINAL_CANVAS_MOUSEMOVE = (FINAL_CANVAS_MOUSEMOVE_LIST.find(it => it.on === d20.engine.final_canvas) || {}).listener;
		}

		if (FINAL_CANVAS_MOUSEMOVE) {
			d20plus.ut.log("Enhancing mouse move");
			d20.engine.final_canvas.removeEventListener("mousemove", FINAL_CANVAS_MOUSEMOVE);
			d20.engine.final_canvas.addEventListener("mousemove", A);
		}
	};

	d20plus.engine.addLineCutterTool = () => {
		const $btnTextTool = $(`.choosetext`);

		const $btnSplitTool = $(`<li class="choosesplitter">✂️ Line Splitter</li>`).click(() => {
			d20plus.setMode("line_splitter");
		});

		$btnTextTool.after($btnSplitTool);
	};

	d20plus.engine._tokenHover = null;
	d20plus.engine._drawTokenHover = () => {
		$(`.Vetools-token-hover`).remove();
		if (!d20plus.engine._tokenHover || !d20plus.engine._tokenHover.text) return;

		const pt = d20plus.engine._tokenHover.pt;
		const txt = unescape(d20plus.engine._tokenHover.text);

		$(`body`).append(`<div class="Vetools-token-hover" style="top: ${pt.y * d20.engine.canvasZoom}px; left: ${pt.x * d20.engine.canvasZoom}px">${txt}</div>`);
	};
	d20plus.engine.addTokenHover = () => {
		// gm notes on shift-hover
		const cacheRenderLoop = d20.engine.renderLoop;
		d20.engine.renderLoop = () => {
			d20plus.engine._drawTokenHover();
			cacheRenderLoop();
		};

		// store data for the rendering function to access
		d20.engine.canvas.on("mouse:move", (data, ...others) => {
			// enable hover from GM layer -> token layer
			let hoverTarget = data.target;
			if (data.e && window.currentEditingLayer === "gmlayer") {
				const cache = window.currentEditingLayer;
				window.currentEditingLayer = "objects";
				hoverTarget = d20.engine.canvas.findTarget(data.e, null, true);
				window.currentEditingLayer = cache;
			}

			if (data.e.shiftKey && hoverTarget && hoverTarget.model) {
				d20.engine.redrawScreenNextTick();
				const gmNotes = hoverTarget.model.get("gmnotes");
				const pt = d20.engine.canvas.getPointer(data.e);
				pt.x -= d20.engine.currentCanvasOffset[0];
				pt.y -= d20.engine.currentCanvasOffset[1];
				d20plus.engine._tokenHover = {
					pt: pt,
					text: gmNotes,
					id: hoverTarget.model.id
				};
			} else {
				if (d20plus.engine._tokenHover) d20.engine.redrawScreenNextTick();
				d20plus.engine._tokenHover = null;
			}
		})
	};

	d20plus.engine.enhanceMarkdown = () => {
		const OUT_STRIKE = "<span style='text-decoration: line-through'>$1</span>";

		// BEGIN ROLL20 CODE
		window.Markdown.parse = function(e) {
			{
				var t = e
					, n = []
					, i = [];
				-1 != t.indexOf("\r\n") ? "\r\n" : -1 != t.indexOf("\n") ? "\n" : ""
			}
			return t = t.replace(/{{{([\s\S]*?)}}}/g, function(e) {
				return n.push(e.substring(3, e.length - 3)),
					"{{{}}}"
			}),
				t = t.replace(new RegExp("<pre>([\\s\\S]*?)</pre>","gi"), function(e) {
					return i.push(e.substring(5, e.length - 6)),
						"<pre></pre>"
				}),
				// BEGIN MOD
				t = t.replace(/~~(.*?)~~/g, OUT_STRIKE),
				// END MOD
				t = t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
				t = t.replace(/\*(.*?)\*/g, "<em>$1</em>"),
				t = t.replace(/``(.*?)``/g, "<code>$1</code>"),
				t = t.replace(/\[([^\]]+)\]\(([^)]+(\.png|\.gif|\.jpg|\.jpeg))\)/g, '<a href="$2"><img src="$2" alt="$1" /></a>'),
				t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>'),
				t = t.replace(new RegExp("<pre></pre>","g"), function() {
					return "<pre>" + i.shift() + "</pre>"
				}),
				t = t.replace(/{{{}}}/g, function() {
					return n.shift()
				})
		};
		// END ROLL20 CODE

		// after a short delay, replace any old content in the chat
		setTimeout(() => {
			$(`.message`).each(function () {
				$(this).html($(this).html().replace(/~~(.*?)~~/g, OUT_STRIKE))
			})
		}, 2500);
	};

	d20plus.engine.enhancePathWidths = () => {
		const $selThicc = $(`#path_width`).css("width", "150px");
		$selThicc.append(`
				<option value="5">Custom 1 (5 px.)</option>
				<option value="5">Custom 2 (5 px.)</option>
				<option value="5">Custom 3 (5 px.)</option>
			`);
		const $iptThicc = $(`<input type="number" style="max-width: 50px;">`).hide();
		const $lblPixels = $(`<label style="display: inline-flex;"> pixels</label>`).hide();
		$selThicc.after($lblPixels).after($iptThicc);

		let $selOpt = null;
		$selThicc.on("change", () => {
			$selOpt = $selThicc.find(`option:selected`);
			const txt = $selOpt.text();
			if (txt.startsWith("Custom")) {
				const thicc = /\((.*?) px\.\)/.exec(txt)[1];
				$lblPixels.show();
				$iptThicc.show().val(Number(thicc));
			} else {
				$lblPixels.hide();
				$iptThicc.hide();
			}
		});

		$iptThicc.on("keyup", () => {
			if (!$selOpt) $selOpt = $selThicc.find(`option:selected`);
			if ($selOpt) {
				const clean = Math.round(Math.max(1, Number($iptThicc.val())));
				$selOpt.val(`${clean}`);
				$selOpt.text($selOpt.text().replace(/\(\d+ px\.\)/, `(${clean} px.)`));
				d20.engine.canvas.freeDrawingBrush.width = clean;
			}
		});
	};

	d20plus.engine.enhanceTransmogrifier = () => {
		JqueryUtil.addSelectors();

		$("#transmogrifier").on("click", () => {
			setTimeout(() => {
				const $btnAlpha = $(`#vetools-transmog-alpha`);
				if (!$btnAlpha.length) {
					const $prependTarget = $(`.ui-dialog-title:textEquals(transmogrifier)`).first().parent().parent().find(`.ui-dialog-content`);
					$(`<button id="#vetools-transmog-alpha" class="btn btn default" style="margin-bottom: 5px;">Sort Items Alphabetically</button>`).on("click", () => {
						// coped from a bookmarklet
						$('iframe').contents().find('.objects').each((c,e)=>{ let $e=$(e); $e.children().sort( (a,b)=>{ let name1=$(a).find(".name").text().toLowerCase(), name2=$(b).find(".name").text().toLowerCase(), comp = name1.localeCompare(name2); return comp; }) .each((i,c)=>$e.append(c)); });
					}).prependTo($prependTarget);
				}
			}, 35);
		})
	};

	d20plus.engine.addLayers = () => {
		d20plus.ut.log("Adding layers");

		d20plus.mod.editingLayerOnclick();
		if (window.is_gm) {
			$(`#floatingtoolbar .choosemap`).html(`<span class="pictos" style="padding: 0 3px 0 3px;">@</span> Map`);
			$(`#floatingtoolbar .choosemap`).after(`
				<li class="choosebackground">
					<span class="pictos">a</span>
					Background
				</li>
			`);
			$(`#floatingtoolbar .chooseobjects`).after(`
				<li class="chooseforeground">
					<span class="pictos">B</span>
					Foreground
				</li>
			`);
			$(`#floatingtoolbar .choosewalls`).after(`
				<li class="chooseweather">
					<span class="pictos">C</span>
					Weather Exclusions
				</li>
			`);
		}

		d20.engine.canvas._renderAll = _.bind(d20plus.mod.renderAll, d20.engine.canvas);
		d20.engine.canvas._layerIteratorGenerator = d20plus.mod.layerIteratorGenerator;
	};

	d20plus.engine.removeLinkConfirmation = function () {
		d20.utils.handleURL = d20plus.mod.handleURL;
		$(document).off("click", "a").on("click", "a", d20.utils.handleURL);
	};

	d20plus.engine.repairPrototypeMethods = function () {
		d20plus.mod.fixHexMethods();
		d20plus.mod.fixVideoMethods();
	};

	d20plus.engine.disableFrameRecorder = function () {
		if (d20.engine.frame_recorder) {
			d20.engine.frame_recorder.active = false;
			d20.engine.frame_recorder._active = false;
		}
	};
}

SCRIPT_EXTENSIONS.push(d20plusEngine);


function baseWeather () {
	d20plus.weather = {};

	d20plus.weather._lastSettingsPageId = null;
	d20plus.weather._initSettingsButton = () => {
		$(`body`).on("click", ".Ve-btn-weather", function () {
			// close the parent page settings + hide the page overlay
			const $this = $(this);
			$this.closest(`[role="dialog"]`).find(`.ui-dialog-buttonpane button:contains("OK")`).click();
			const $barPage = $(`#page-toolbar`);
			if (!$barPage.hasClass("closed")) {
				$barPage.find(`.handle`).click()
			}

			function doShowDialog (page) {
				const $dialog = $(`
					<div title="Weather Configuration">
						<label class="split wth__row">
							<span>Weather Type</span>
							<select name="weatherType1">
								<option>None</option>
								<option>Fog</option>
								<option>Rain</option>
								<option>Ripples</option>
								<option>Snow</option>
								<option>Waves</option>
								<option>Blood Rain</option>
								<option>Custom (see below)</option>
							</select>
						</label>
						<label class="split wth__row">
							<span  class="help" title="When &quot;Custom&quot; is selected, above">Custom Weather Image</span>
							<input name="weatherTypeCustom1" placeholder="https://example.com/pic.png">
						</label>
						<label class="flex wth__row">
							<span>Weather Speed</span>
							<input type="range" name="weatherSpeed1" min="0.01" max="1" step="0.01">
						</label>
						<label class="split wth__row">
							<span>Weather Direction</span>
							<select name="weatherDir1">
								<option>Northerly</option>
								<option>North-Easterly</option>
								<option>Easterly</option>
								<option>South-Easterly</option>
								<option>Southerly</option>
								<option>South-Westerly</option>
								<option>Westerly</option>
								<option>North-Westerly</option>
								<option>Custom (see below)</option>
							</select>
						</label>
						<label class="flex wth__row">
							<span class="help" title="When &quot;Custom&quot; is selected, above">Custom Weather Direction</span>
							<input type="range" name="weatherDirCustom1" min="0" max="360" step="1">
						</label>
						<label class="flex wth__row">
							<span>Weather Opacity</span>
							<input type="range" name="weatherOpacity1" min="0.05" max="1" step="0.01">
						</label>
						<label class="split wth__row">
							<span>Oscillate</span>
							<input type="checkbox" name="weatherOscillate1">
						</label>
						<label class="flex wth__row">
							<span>Oscillation Threshold</span>
							<input type="range" name="weatherOscillateThreshold1" min="0.05" max="1" step="0.01">
						</label>
						<label class="split wth__row">
							<span>Intensity</span>
							<select name="weatherIntensity1">
								<option>Normal</option>
								<option>Heavy</option>
							</select>
						</label>
						<label class="split wth__row">
							<span>Tint</span>
							<input type="checkbox" name="weatherTint1">
						</label>
						<label class="split wth__row">
							<span>Tint Color</span>
							<input type="color" name="weatherTintColor1" value="#4c566d">
						</label>
						<label class="split wth__row">
							<span>Special Effects</span>
							<select name="weatherEffect1">
								<option>None</option>
								<option>Lightning</option>
							</select>
						</label>
					</div>
				`).appendTo($("body"));

				const handleProp = (propName) => $dialog.find(`[name="${propName}"]`).each((i, e) => {
					const $e = $(e);
					if ($e.is(":checkbox")) {
						$e.prop("checked", !!page.get(`bR20cfg_${propName}`));
					} else {
						$e.val(page.get(`bR20cfg_${propName}`));
					}
				});
				const props = [
					"weatherType1",
					"weatherTypeCustom1",
					"weatherSpeed1",
					"weatherDir1",
					"weatherDirCustom1",
					"weatherOpacity1",
					"weatherOscillate1",
					"weatherOscillateThreshold1",
					"weatherIntensity1",
					"weatherTint1",
					"weatherTintColor1",
					"weatherEffect1"
				];
				props.forEach(handleProp);

				function doSaveValues () {
					props.forEach(propName => {
						page.set(`bR20cfg_${propName}`, (() => {
							const $e = $dialog.find(`[name="${propName}"]`);
							if ($e.is(":checkbox")) {
								return !!$e.prop("checked");
							} else {
								return $e.val();
							}
						})())
					});
					page.save();
				}

				$dialog.dialog({
					width: 500,
					dialogClass: "no-close",
					buttons: [
						{
							text: "OK",
							click: function () {
								$(this).dialog("close");
								$dialog.remove();
								doSaveValues();
							}
						},
						{
							text: "Apply",
							click: function () {
								doSaveValues();
							}
						},
						{
							text: "Cancel",
							click: function () {
								$(this).dialog("close");
								$dialog.remove();
							}
						}
					]
				});
			}

			if (d20plus.weather._lastSettingsPageId) {
				const page = d20.Campaign.pages.get(d20plus.weather._lastSettingsPageId);
				if (page) {
					doShowDialog(page);
				} else d20plus.ut.error(`No page found with ID "${d20plus.weather._lastSettingsPageId}"`);
			} else d20plus.ut.error(`No page settings button was clicked?!`);
		}).on("mousedown", ".chooseablepage .settings", function () {
			const $this = $(this);
			d20plus.weather._lastSettingsPageId = $this.closest(`[data-pageid]`).data("pageid");
		});
	};

	d20plus.weather.addWeather = () => {
		d20plus.weather._initSettingsButton();

		window.force = false; // missing variable in Roll20's code(?); define it here

		d20plus.ut.log("Adding weather");

		const MAX_ZOOM = 2.5; // max canvas zoom
		const tmp = []; // temp vector
		// cache images
		const IMAGES = {
			"Rain": new Image,
			"Snow": new Image,
			"Fog": new Image,
			"Waves": new Image,
			"Ripples": new Image,
			"Blood Rain": new Image
		};
		IMAGES.Rain.src = "https://i.imgur.com/lZrqiVk.png";
		IMAGES.Snow.src = "https://i.imgur.com/uwLQjWY.png";
		IMAGES.Fog.src = "https://i.imgur.com/SRsUpHW.png";
		IMAGES.Waves.src = "https://i.imgur.com/iYEzmvB.png";
		IMAGES.Ripples.src = "https://i.imgur.com/fFCr0yx.png";
		IMAGES["Blood Rain"].src = "https://i.imgur.com/SP2aoeq.png";
		const SFX = {
			lightning: []
		};

		// FIXME find a better way of handling this; `clip` is super-slow
		const clipMode = "EXCLUDE";

		function SfxLightning () {
			this.brightness = 255;
		}

		const $wrpEditor = $("#editor-wrapper");

		// add custom canvas
		const $wrpCanvas = $wrpEditor.find(".canvas-container");

		// make buffer canvas
		const $canBuf = $("<canvas style='position: absolute; z-index: -100; left:0; top: 0; pointer-events: none;' tabindex='-1'/>").appendTo($wrpCanvas);
		const cvBuf = $canBuf[0];
		const ctxBuf = cvBuf.getContext("2d");

		// make weather canvas
		const $canvasWeather = $("<canvas id='Vet-canvas-weather' style='position: absolute; z-index: 2; left:0; top: 0; pointer-events: none;' tabindex='-1'/>").appendTo($wrpCanvas);
		const cv = $canvasWeather[0];
		d20.engine.weathercanvas = cv;

		// add our canvas to those adjusted when canvas size changes
		const cachedSetCanvasSize = d20.engine.setCanvasSize;
		d20.engine.setCanvasSize = function (e, n) {
			cv.width = e;
			cv.height = n;

			cvBuf.width = e;
			cvBuf.height = n;

			cachedSetCanvasSize(e, n);
		};

		cv.width = cvBuf.width = d20.engine.canvas.width;
		cv.height = cvBuf.height = d20.engine.canvas.height;

		const ctx = cv.getContext("2d");

		const CTX = {
			_hasWarned: new Set()
		};

		function ofX (x) { // offset X
			return x - d20.engine.currentCanvasOffset[0];
		}

		function ofY (y) { // offset Y
			return y - d20.engine.currentCanvasOffset[1];
		}

		function lineIntersectsBounds (points, bounds) {
			return d20plus.math.doPolygonsIntersect([points[0], points[2], points[3], points[1]], bounds);
		}

		function copyPoints (toCopy) {
			return [...toCopy.map(pt => [...pt])];
		}

		function getImage (page) {
			const imageName = page.get("bR20cfg_weatherType1");

			switch (imageName) {
				case "Rain":
				case "Snow":
				case "Fog":
				case "Waves":
				case "Ripples":
				case "Blood Rain":
					IMAGES["Custom"] = null;
					return IMAGES[imageName];
				case "Custom (see below)":
					if (!IMAGES["Custom"] || (
						(IMAGES["Custom"].src !== page.get("bR20cfg_weatherTypeCustom1") && IMAGES["Custom"]._errorSrc == null) ||
						(IMAGES["Custom"]._errorSrc != null && IMAGES["Custom"]._errorSrc !== page.get("bR20cfg_weatherTypeCustom1")))
					) {
						IMAGES["Custom"] = new Image;
						IMAGES["Custom"]._errorSrc = null;
						IMAGES["Custom"].onerror = () => {
							if (IMAGES["Custom"]._errorSrc == null) {
								IMAGES["Custom"]._errorSrc = page.get("bR20cfg_weatherTypeCustom1");
								alert(`Custom weather image "${IMAGES["Custom"].src}" failed to load!`);
							}
							IMAGES["Custom"].src = IMAGES["Rain"].src;
						};
						IMAGES["Custom"].src = page.get("bR20cfg_weatherTypeCustom1");
					}
					return IMAGES["Custom"];
				default:
					IMAGES["Custom"] = null;
					return null;
			}
		}

		function getDirectionRotation (page) {
			const dir = page.get("bR20cfg_weatherDir1");
			switch (dir) {
				case "Northerly": return 0.25 * Math.PI;
				case "North-Easterly": return 0.5 * Math.PI;
				case "Easterly": return 0.75 * Math.PI;
				case "South-Easterly": return Math.PI;
				case "Southerly": return 1.25 * Math.PI;
				case "South-Westerly": return 1.5 * Math.PI;
				case "Westerly": return 1.75 * Math.PI;
				case "North-Westerly": return 0;
				case "Custom (see below)":
					return Number(page.get("bR20cfg_weatherDirCustom1") || 0) * Math.PI / 180;
				default: return 0;
			}
		}

		function getOpacity (page) {
			return page.get("bR20cfg_weatherOpacity1") || 1;
		}

		let oscillateMode = null;
		function isOscillating (page) {
			return !!page.get("bR20cfg_weatherOscillate1");
		}

		function getOscillationThresholdFactor (page) {
			return page.get("bR20cfg_weatherOscillateThreshold1") || 1;
		}

		function getIntensity (page) {
			const tint = page.get("bR20cfg_weatherIntensity1");
			switch (tint) {
				case "Heavy": return 1;
				default: return 0;
			}
		}

		function getTintColor (page) {
			const tintEnabled = page.get("bR20cfg_weatherTint1");
			if (tintEnabled) {
				return `${(page.get("bR20cfg_weatherTintColor1") || "#4c566d")}80`;
			} else return null;
		}

		function getEffect (page) {
			const effect = page.get("bR20cfg_weatherEffect1");
			switch (effect) {
				case "Lightning": return "lightning";
				default: return null;
			}
		}

		function handleSvgCoord (coords, obj, basesXY, center, angle) {
			const vec = [
				ofX(coords[0] * obj.scaleX) + basesXY[0],
				ofY(coords[1] * obj.scaleY) + basesXY[1]
			];
			d20plus.math.vec2.scale(vec, vec, d20.engine.canvasZoom);
			if (angle) d20plus.math.vec2.rotate(vec, vec, center, angle);
			return vec;
		}

		let accum = 0;
		let then = 0;
		let image;
		let currentSfx;
		let hasWeather = false;
		function drawFrame (now) {
			const deltaTime = now - then;
			then = now;

			const page = d20 && d20.Campaign && d20.Campaign.activePage ? d20.Campaign.activePage() : null;
			if (page && page.get("bR20cfg_weatherType1") !== "None") {
				image = getImage(page);
				currentSfx = getEffect(page);

				// generate SFX
				if (currentSfx) {
					if (currentSfx === "lightning" && Math.random() > 0.999) SFX.lightning.push(new SfxLightning());
				} else {
					SFX.lightning = [];
				}

				if (hasWeather) ctx.clearRect(0, 0, cv.width, cv.height);
				const hasImage = image && image.complete;
				const tint = getTintColor(page);
				const scaledW = hasImage ? Math.ceil((image.width * d20.engine.canvasZoom) / MAX_ZOOM) : -1;
				const scaledH = hasImage ? Math.ceil((image.height * d20.engine.canvasZoom) / MAX_ZOOM) : -1;
				const hasSfx = SFX.lightning.length;
				if (hasImage || tint || hasSfx) {
					hasWeather = true;

					// draw weather
					if (
						hasImage &&
						!(scaledW <= 0 || scaledH <= 0) // sanity check
					) {
						// mask weather
						const doMaskStep = () => {
							ctxBuf.clearRect(0, 0, cvBuf.width, cvBuf.height);

							ctxBuf.fillStyle = "#ffffffff";

							const objectLen = d20.engine.canvas._objects.length;
							for (let i = 0; i < objectLen; ++i) {
								const obj = d20.engine.canvas._objects[i];
								if (obj.type === "path" && obj.model && obj.model.get("layer") === "weather") {
									// obj.top is X pos of center of object
									// obj.left is Y pos of center of object
									const xBase = (obj.left - (obj.width * obj.scaleX / 2));
									const yBase = (obj.top - (obj.height * obj.scaleY / 2));
									const basesXY = [xBase, yBase];
									const angle = (obj.angle > 360 ? obj.angle - 360 : obj.angle) / 180 * Math.PI;
									const center = [ofX(obj.left), ofY(obj.top)];
									d20plus.math.vec2.scale(center, center, d20.engine.canvasZoom);

									ctxBuf.beginPath();
									obj.path.forEach(opp => {
										const [op, x, y, ...others] = opp;
										switch (op) {
											case "M": {
												const vec = handleSvgCoord([x, y], obj, basesXY, center, angle);
												ctxBuf.moveTo(vec[0], vec[1]);
												break;
											}
											case "L": {
												const vec = handleSvgCoord([x, y], obj, basesXY, center, angle);
												ctxBuf.lineTo(vec[0], vec[1]);
												break;
											}
											case "C": {
												const control1 = handleSvgCoord([x, y], obj, basesXY, center, angle);
												const control2 = handleSvgCoord([others[0], others[1]], obj, basesXY, center, angle);
												const end = handleSvgCoord([others[2], others[3]], obj, basesXY, center, angle);
												ctxBuf.bezierCurveTo(...control1, ...control2, ...end);
												break;
											}
											default:
												if (!CTX._hasWarned.has(op)) {
													CTX._hasWarned.add(op);
													console.error(`UNHANDLED OP!: ${op}`);
												}
										}
									});
									ctxBuf.fill();
									ctxBuf.closePath();
								}
							}

							// draw final weather mask
							//// change drawing mode
							ctx.globalCompositeOperation = "destination-out";
							ctx.drawImage(cvBuf, 0, 0);

							// handle opacity
							const opacity = Number(getOpacity(page));
							if (opacity !== 1) {
								ctxBuf.clearRect(0, 0, cvBuf.width, cvBuf.height);
								ctxBuf.fillStyle = `#ffffff${Math.round((1 - opacity) * 255).toString(16)}`;
								ctxBuf.fillRect(0, 0, cvBuf.width, cvBuf.height);
								ctx.drawImage(cvBuf, 0, 0);
							}

							//// reset drawing mode
							ctx.globalCompositeOperation = "source-over";
						};

						// if (clipMode === "INCLUDE") doMaskStep(true);

						const speed = page.get("bR20cfg_weatherSpeed1") || 0.1;
						const speedFactor = speed * d20.engine.canvasZoom;
						const maxAccum = Math.floor(scaledW / speedFactor);
						const rot = getDirectionRotation(page);
						const w = scaledW;
						const h = scaledH;
						const boundingBox = [
							[
								-1.5 * w,
								-1.5 * h
							],
							[
								-1.5 * w,
								cv.height + (1.5 * h) + d20.engine.currentCanvasOffset[1]
							],
							[
								cv.width + (1.5 * w) + d20.engine.currentCanvasOffset[0],
								cv.height + (1.5 * h) + d20.engine.currentCanvasOffset[1]
							],
							[
								cv.width + (1.5 * w) + d20.engine.currentCanvasOffset[0],
								-1.5 * h
							]
						];
						const BASE_OFFSET_X = -w / 2;
						const BASE_OFFSET_Y = -h / 2;

						// calculate resultant points of a rotated shape
						const pt00 = [0, 0];
						const pt01 = [0, 1];
						const pt10 = [1, 0];
						const pt11 = [1, 1];
						const basePts = [
							pt00,
							pt01,
							pt10,
							pt11
						].map(pt => [
							(pt[0] * w) + BASE_OFFSET_X - d20.engine.currentCanvasOffset[0],
							(pt[1] * h) + BASE_OFFSET_Y - d20.engine.currentCanvasOffset[1]
						]);
						basePts.forEach(pt => d20plus.math.vec2.rotate(pt, pt, [0, 0], rot));

						// calculate animation values
						(() => {
							if (isOscillating(page)) {
								const oscThreshFactor = getOscillationThresholdFactor(page);

								if (oscillateMode == null) {
									oscillateMode = 1;
									accum += deltaTime;
									if (accum >= maxAccum * oscThreshFactor) accum -= maxAccum;
								} else {
									if (oscillateMode === 1) {
										accum += deltaTime;
										if (accum >= maxAccum * oscThreshFactor) {
											accum -= 2 * deltaTime;
											oscillateMode = -1;
										}
									} else {
										accum -= deltaTime;
										if (accum <= 0) {
											oscillateMode = 1;
											accum += 2 * deltaTime;
										}
									}
								}
							} else {
								oscillateMode = null;
								accum += deltaTime;
								if (accum >= maxAccum) accum -= maxAccum;
							}
						})();

						const intensity = getIntensity(page) * speedFactor;
						const timeOffsetX = Math.ceil(speedFactor * accum);
						const timeOffsetY = Math.ceil(speedFactor * accum);

						//// rotate coord space
						ctx.rotate(rot);

						// draw base image
						doDraw(0, 0);

						function doDraw (offsetX, offsetY) {
							const xPos = BASE_OFFSET_X + timeOffsetX + offsetX - d20.engine.currentCanvasOffset[0];
							const yPos = BASE_OFFSET_Y + timeOffsetY + offsetY - d20.engine.currentCanvasOffset[1];
							ctx.drawImage(
								image,
								xPos,
								yPos,
								w,
								h
							);

							if (intensity) {
								const offsetIntensity = -Math.floor(w / 4);
								ctx.drawImage(
									image,
									xPos + offsetIntensity,
									yPos + offsetIntensity,
									w,
									h
								);
							}
						}

						function inBounds (nextPts) {
							return lineIntersectsBounds(nextPts, boundingBox);
						}

						function moveXDir (pt, i, isAdd) {
							if (i % 2) d20plus.math.vec2.sub(tmp, basePts[3], basePts[1]);
							else d20plus.math.vec2.sub(tmp, basePts[2], basePts[0]);

							if (isAdd) d20plus.math.vec2.add(pt, pt, tmp);
							else d20plus.math.vec2.sub(pt, pt, tmp);
						}

						function moveYDir (pt, i, isAdd) {
							if (i > 1) d20plus.math.vec2.sub(tmp, basePts[3], basePts[2]);
							else d20plus.math.vec2.sub(tmp, basePts[1], basePts[0]);

							if (isAdd) d20plus.math.vec2.add(pt, pt, tmp);
							else d20plus.math.vec2.sub(pt, pt, tmp);
						}

						const getMaxMoves = () => {
							const hyp = [];
							d20plus.math.vec2.sub(hyp, boundingBox[2], boundingBox[0]);

							const dist = d20plus.math.vec2.len(hyp);
							const maxMoves = dist / Math.min(w, h);
							return [Math.abs(hyp[0]) > Math.abs(hyp[1]) ? "x" : "y", maxMoves];
						};

						const handleXAxisYIncrease = (nxtPts, maxMoves, moves, xDir) => {
							const handleY = (dir) => {
								let subNxtPts, subMoves;
								subNxtPts = copyPoints(nxtPts);
								subMoves = 0;
								while(subMoves <= maxMoves[1]) {
									subNxtPts.forEach((pt, i) => moveYDir(pt, i, dir > 0));
									subMoves++;
									if (inBounds(subNxtPts)) doDraw(xDir * moves * w, dir * (subMoves * h));
								}
							};

							handleY(1); // y axis increasing
							handleY(-1); // y axis decreasing
						};

						const handleYAxisXIncrease = (nxtPts, maxMoves, moves, yDir) => {
							const handleX = (dir) => {
								let subNxtPts, subMoves;
								subNxtPts = copyPoints(nxtPts);
								subMoves = 0;
								while(subMoves <= maxMoves[1]) {
									subNxtPts.forEach((pt, i) => moveXDir(pt, i, dir > 0));
									subMoves++;
									if (lineIntersectsBounds(subNxtPts, boundingBox)) doDraw(dir * (subMoves * w), yDir * moves * h);
								}
							};

							handleX(1); // x axis increasing
							handleX(-1); // x axis decreasing
						};

						const handleBasicX = (maxMoves) => {
							const handleX = (dir) => {
								let nxtPts, moves;
								nxtPts = copyPoints(basePts);
								moves = 0;
								while(moves < maxMoves) {
									nxtPts.forEach((pt, i) => moveXDir(pt, i, dir > 0));
									moves++;
									if (lineIntersectsBounds(nxtPts, boundingBox)) doDraw(dir * (moves * w), 0);
								}
							};

							handleX(1); // x axis increasing
							handleX(-1); // x axis decreasing
						};

						const handleBasicY = (maxMoves) => {
							const handleY = (dir) => {
								let nxtPts, moves;
								nxtPts = copyPoints(basePts);
								moves = 0;
								while(moves < maxMoves) {
									nxtPts.forEach((pt, i) => moveYDir(pt, i, dir > 0));
									moves++;
									if (lineIntersectsBounds(nxtPts, boundingBox)) doDraw(0, dir * (moves * h));
								}
							};

							handleY(1); // y axis increasing
							handleY(-1); // y axis decreasing
						};

						(() => {
							// choose largest axis
							const maxMoves = getMaxMoves();

							if (maxMoves[0] === "x") {
								const handleX = (dir) => {
									let nxtPts, moves;
									nxtPts = copyPoints(basePts);
									moves = 0;
									while(moves < maxMoves[1]) {
										nxtPts.forEach((pt, i) => moveXDir(pt, i, dir > 0));
										moves++;
										if (lineIntersectsBounds(nxtPts, boundingBox)) doDraw(dir * (moves * w), 0);
										handleXAxisYIncrease(nxtPts, maxMoves, moves, dir);
									}
								};

								handleBasicY(maxMoves[1]);
								handleX(1); // x axis increasing
								handleX(-1); // x axis decreasing
							} else {
								const handleY = (dir) => {
									let nxtPts, moves;
									nxtPts = copyPoints(basePts);
									moves = 0;
									while(moves < maxMoves[1]) {
										nxtPts.forEach((pt, i) => moveYDir(pt, i, dir > 0));
										moves++;
										if (lineIntersectsBounds(nxtPts, boundingBox)) doDraw(0, dir * (moves * h));
										handleYAxisXIncrease(nxtPts, maxMoves, moves, dir);
									}
								};

								handleBasicX(maxMoves[1]);
								handleY(1); // y axis increasing
								handleY(-1); // y axis decreasing
							}
						})();

						//// revert coord space rotation
						ctx.rotate(-rot);

						if (clipMode === "EXCLUDE") doMaskStep(false);
					}

					// draw sfx
					if (hasSfx) {
						for (let i = SFX.lightning.length - 1; i >= 0; --i) {
							const l = SFX.lightning[i];
							if (l.brightness <= 5) {
								SFX.lightning.splice(i, 1);
							} else {
								ctx.fillStyle = `#effbff${l.brightness.toString(16).padStart(2, "0")}`;
								ctx.fillRect(0, 0, cv.width, cv.height);
								l.brightness -= Math.floor(deltaTime);
							}
						}
					}

					// draw tint
					if (tint) {
						ctx.fillStyle = tint;
						ctx.fillRect(0, 0, cv.width, cv.height);
					}
				}

				requestAnimationFrame(drawFrame);
			} else {
				// if weather is disabled, maintain a background tick
				if (hasWeather) {
					ctx.clearRect(0, 0, cv.width, cv.height);
					hasWeather = false;
				}
				setTimeout(() => {
					drawFrame(0);
				}, 1000);
			}
		}

		requestAnimationFrame(drawFrame);
	};
}

SCRIPT_EXTENSIONS.push(baseWeather);


function d20plusJournal () {
	d20plus.journal = {};

	d20plus.journal.lastClickedFolderId = null;

	d20plus.journal.addJournalCommands = () => {
		// Create new Journal commands
		// stash the folder ID of the last folder clicked
		$("#journalfolderroot").on("contextmenu", ".dd-content", function (e) {
			if ($(this).parent().hasClass("dd-folder")) {
				const lastClicked = $(this).parent();
				d20plus.journal.lastClickedFolderId = lastClicked.attr("data-globalfolderid");
			}


			if ($(this).parent().hasClass("character")) {
				$(`.Vetools-make-tokenactions`).show();
			} else {
				$(`.Vetools-make-tokenactions`).hide();
			}
		});

		var first = $("#journalitemmenu ul li").first();
		// "Make Tokenactions" option
		first.after(`<li class="Vetools-make-tokenactions" data-action-type="additem">Make Tokenactions</li>`);
		$("#journalitemmenu ul").on(window.mousedowntype, "li[data-action-type=additem]", function () {
			var id = $currentItemTarget.attr("data-itemid");
			var character = d20.Campaign.characters.get(id);
			d20plus.ut.log("Making Token Actions..");
			if (character) {
				var npc = character.attribs.find(function (a) {
					return a.get("name").toLowerCase() == "npc";
				});
				var isNPC = npc ? parseInt(npc.get("current")) : 0;
				if (isNPC) {
					//Npc specific tokenactions
					character.abilities.create({
						name: "Perception",
						istokenaction: true,
						action: d20plus.actionMacroPerception
					});
					character.abilities.create({
						name: "DR/Immunities",
						istokenaction: true,
						action: d20plus.actionMacroDrImmunities
					});
					character.abilities.create({
						name: "Stats",
						istokenaction: true,
						action: d20plus.actionMacroStats
					});
					character.abilities.create({
						name: "Saves",
						istokenaction: true,
						action: d20plus.actionMacroSaves
					});
					character.abilities.create({
						name: "Skill-Check",
						istokenaction: true,
						action: d20plus.actionMacroSkillCheck
					});
					character.abilities.create({
						name: "Ability-Check",
						istokenaction: true,
						action: d20plus.actionMacroAbilityCheck
					});
				} else {
					//player specific tokenactions
					//@{selected|repeating_attack_$0_atkname}
					character.abilities.create({
						name: "Attack 1",
						istokenaction: true,
						action: "%{selected|repeating_attack_$0_attack}"
					});
					character.abilities.create({
						name: "Attack 2",
						istokenaction: true,
						action: "%{selected|repeating_attack_$1_attack}"
					});
					character.abilities.create({
						name: "Attack 3",
						istokenaction: true,
						action: "%{selected|repeating_attack_$2_attack}"
					});
					character.abilities.create({
						name: "Tool 1",
						istokenaction: true,
						action: "%{selected|repeating_tool_$0_tool}"
					});
					//" + character.get("name") + "
					character.abilities.create({
						name: "Whisper GM",
						istokenaction: true,
						action: "/w gm ?{Message to whisper the GM?}"
					});
					character.abilities.create({
						name: "Favorite Spells",
						istokenaction: true,
						action: "/w @{character_name} &{template:npcaction} {{rname=Favorite Spells}} {{description=Favorite Spells are the first spells in each level of your spellbook.\n\r[Cantrip](~selected|repeating_spell-cantrip_$0_spell)\n[1st Level](~selected|repeating_spell-1_$0_spell)\n\r[2nd Level](~selected|repeating_spell-2_$0_spell)\n\r[3rd Level](~selected|repeating_spell-3_$0_spell)\n\r[4th Level](~selected|repeating_spell-4_$0_spell)\n\r[5th Level](~selected|repeating_spell-5_$0_spell)}}"
					});
					character.abilities.create({
						name: "Dual Attack",
						istokenaction: false,
						action: "%{selected|repeating_attack_$0_attack}\n\r%{selected|repeating_attack_$0_attack}"
					});
					character.abilities.create({
						name: "Saves",
						istokenaction: true,
						action: "@{selected|wtype}&{template:simple} @{selected|rtype}?{Save|Strength, +@{selected|strength_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Strength Save&#125;&#125 {{mod=@{selected|strength_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|strength_save_bonus}@{selected|pbd_safe}]]&#125;&#125; |Dexterity, +@{selected|dexterity_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Dexterity Save&#125;&#125 {{mod=@{selected|dexterity_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|dexterity_save_bonus}@{selected|pbd_safe}]]&#125;&#125; |Constitution, +@{selected|constitution_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Constitution Save&#125;&#125 {{mod=@{selected|constitution_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|constitution_save_bonus}@{selected|pbd_safe}]]&#125;&#125; |Intelligence, +@{selected|intelligence_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Intelligence Save&#125;&#125 {{mod=@{selected|intelligence_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|intelligence_save_bonus}@{selected|pbd_safe}]]&#125;&#125; |Wisdom, +@{selected|wisdom_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Wisdom Save&#125;&#125 {{mod=@{selected|wisdom_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|wisdom_save_bonus}@{selected|pbd_safe}]]&#125;&#125; |Charisma, +@{selected|charisma_save_bonus}@{selected|pbd_safe}]]&#125;&#125; {{rname=Charisma Save&#125;&#125 {{mod=@{selected|charisma_save_bonus}&#125;&#125; {{r1=[[@{selected|d20}+@{selected|charisma_save_bonus}@{selected|pbd_safe}]]&#125;&#125;}@{selected|global_save_mod}@{selected|charname_output"
					});
					character.abilities.create({
						name: "Skill-Check",
						istokenaction: true,
						action: "@{selected|wtype}&{template:simple} @{selected|rtype}?{Ability|Acrobatics, +@{selected|acrobatics_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Acrobatics&#125;&#125; {{mod=@{selected|acrobatics_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|acrobatics_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Animal Handling, +@{selected|animal_handling_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Animal Handling&#125;&#125; {{mod=@{selected|animal_handling_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|animal_handling_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Arcana, +@{selected|arcana_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Arcana&#125;&#125; {{mod=@{selected|arcana_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|arcana_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Athletics, +@{selected|athletics_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Athletics&#125;&#125; {{mod=@{selected|athletics_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|athletics_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Deception, +@{selected|deception_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Deception&#125;&#125; {{mod=@{selected|deception_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|deception_bonus}@{selected|pbd_safe} ]]&#125;&#125; |History, +@{selected|history_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=History&#125;&#125; {{mod=@{selected|history_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|history_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Insight, +@{selected|insight_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Insight&#125;&#125; {{mod=@{selected|insight_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|insight_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Intimidation, +@{selected|intimidation_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Intimidation&#125;&#125; {{mod=@{selected|intimidation_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|intimidation_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Investigation, +@{selected|investigation_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Investigation&#125;&#125; {{mod=@{selected|investigation_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|investigation_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Medicine, +@{selected|medicine_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Medicine&#125;&#125; {{mod=@{selected|medicine_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|medicine_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Nature, +@{selected|nature_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Nature&#125;&#125; {{mod=@{selected|nature_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|nature_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Perception, +@{selected|perception_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Perception&#125;&#125; {{mod=@{selected|perception_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|perception_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Performance, +@{selected|performance_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Performance&#125;&#125; {{mod=@{selected|performance_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|performance_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Persuasion, +@{selected|persuasion_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Persuasion&#125;&#125; {{mod=@{selected|persuasion_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|persuasion_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Religion, +@{selected|religion_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Religion&#125;&#125; {{mod=@{selected|religion_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|religion_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Sleight of Hand, +@{selected|sleight_of_hand_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Sleight of Hand&#125;&#125; {{mod=@{selected|sleight_of_hand_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|sleight_of_hand_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Stealth, +@{selected|stealth_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Stealth&#125;&#125; {{mod=@{selected|stealth_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|stealth_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Survival, +@{selected|survival_bonus}@{selected|pbd_safe} ]]&#125;&#125; {{rname=Survival&#125;&#125; {{mod=@{selected|survival_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|survival_bonus}@{selected|pbd_safe} ]]&#125;&#125; |Strength, +@{selected|strength_mod}@{selected|jack_attr}[STR]]]&#125;&#125; {{rname=Strength&#125;&#125; {{mod=@{selected|strength_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|strength_mod}@{selected|jack_attr}[STR]]]&#125;&#125; |Dexterity, +@{selected|dexterity_mod}@{selected|jack_attr}[DEX]]]&#125;&#125; {{rname=Dexterity&#125;&#125; {{mod=@{selected|dexterity_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|dexterity_mod}@{selected|jack_attr}[DEX]]]&#125;&#125; |Constitution, +@{selected|constitution_mod}@{selected|jack_attr}[CON]]]&#125;&#125; {{rname=Constitution&#125;&#125; {{mod=@{selected|constitution_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|constitution_mod}@{selected|jack_attr}[CON]]]&#125;&#125; |Intelligence, +@{selected|intelligence_mod}@{selected|jack_attr}[INT]]]&#125;&#125; {{rname=Intelligence&#125;&#125; {{mod=@{selected|intelligence_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|intelligence_mod}@{selected|jack_attr}[INT]]]&#125;&#125; |Wisdom, +@{selected|wisdom_mod}@{selected|jack_attr}[WIS]]]&#125;&#125; {{rname=Wisdom&#125;&#125; {{mod=@{selected|wisdom_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|wisdom_mod}@{selected|jack_attr}[WIS]]]&#125;&#125; |Charisma, +@{selected|charisma_mod}@{selected|jack_attr}[CHA]]]&#125;&#125; {{rname=Charisma&#125;&#125; {{mod=@{selected|charisma_mod}@{selected|jack_bonus}&#125;&#125; {{r1=[[ @{selected|d20} + @{selected|charisma_mod}@{selected|jack_attr}[CHA]]]&#125;&#125; } @{selected|global_skill_mod} @{selected|charname_output}"
					});
				}
				//for everyone
				character.abilities.create({
					name: "Initiative",
					istokenaction: true,
					action: d20plus.actionMacroInit
				});
			}
		});

		// "Duplicate" option
		first.after("<li data-action-type=\"cloneitem\">Duplicate</li>");
		first.after("<li style=\"height: 10px;\">&nbsp;</li>");
		$("#journalitemmenu ul").on(window.mousedowntype, "li[data-action-type=cloneitem]", function () {
			var id = $currentItemTarget.attr("data-itemid");
			var character = d20.Campaign.characters.get(id);
			var handout = d20.Campaign.handouts.get(id);
			d20plus.ut.log("Duplicating..");
			if (character) {
				character.editview.render();
				character.editview.$el.find("button.duplicate").trigger("click");
			}
			if (handout) {
				handout.view.render();
				var json = handout.toJSON();
				delete json.id;
				json.name = "Copy of " + json.name;
				handout.collection.create(json, {
					success: function (h) {
						handout._getLatestBlob("gmnotes", function (gmnotes) {
							h.updateBlobs({gmnotes: gmnotes});
						});
						handout._getLatestBlob("notes", function (notes) {
							h.updateBlobs({notes: notes});
						});
					}
				});
			}
		});

		// New command on FOLDERS
		const last = $("#journalmenu ul li").last();
		last.after("<li style=\"background-color: #FA5050; color: white;\" data-action-type=\"fulldelete\">Delete Folder + Contents</li>");
		last.after("<li data-action-type=\"archiveall\">Archive All Contents</li>");

		const $journalUl = $("#journalmenu ul");

		$journalUl.on(window.mousedowntype, "li[data-action-type=fulldelete]", function () {
			d20plus.journal.recursiveRemoveDirById(d20plus.journal.lastClickedFolderId, true);
			d20plus.journal.lastClickedFolderId = null;
			$("#journalmenu").hide();
		});

		$journalUl.on(window.mousedowntype, "li[data-action-type=archiveall]", function () {
			d20plus.journal.recursiveArchiveDirById(d20plus.journal.lastClickedFolderId, true);
			$("#journalmenu").hide();
		});
	};

	/**
	 * Takes a path made up of strings and arrays of strings, and turns it into one flat array of strings
	 */
	d20plus.journal.getCleanPath = function (...path) {
		const clean = [];
		getStrings(clean, path);
		return clean.map(s => s.trim()).filter(s => s);

		function getStrings (stack, toProc) {
			toProc.forEach(tp => {
				if (typeof tp === "string") {
					stack.push(tp);
				} else if (tp instanceof Array) {
					getStrings(stack, tp);
				} else {
					throw new Error("Object in path was not a string or an array")
				}
			});
		}
	};

	d20plus.journal.makeDirTree = function (...path) {
		const parts = d20plus.journal.getCleanPath(path);
		// path e.g. d20plus.journal.makeDirTree("Spells", "Cantrips", "1")
		// roll20 allows a max directory depth of 4 :joy: (5, but the 5th level is unusable)
		if (parts.length > 4) throw new Error("Max directory depth exceeded! The maximum is 4.")

		const madeSoFar = [];

		const root = {i: d20plus.ut.getJournalFolderObj()};

		// roll20 folder management is dumb, so just pick the first folder with the right name if there's multiple
		let curDir = root;
		parts.forEach(toMake => {
			const existing = curDir.i.find((it) => {
				// n is folder name (only folders have the n property)
				return it.n && it.n === toMake && it.i;
			});
			if (!existing) {
				if (curDir.id) {
					d20.journal.addFolderToFolderStructure(toMake, curDir.id);
				} else {
					// root has no id
					d20.journal.addFolderToFolderStructure(toMake);
				}
			}
			d20.journal.refreshJournalList();
			madeSoFar.push(toMake);

			// we have to save -> reread the entire directory JSON -> walk back to where we were
			let nextDir = {i: JSON.parse(d20.Campaign.get("journalfolder"))};
			madeSoFar.forEach(f => {
				nextDir = nextDir.i.find(dir => dir.n && (dir.n.toLowerCase() === f.toLowerCase()));
			});

			curDir = nextDir;
		});
		return curDir;
	};

	d20plus.journal.recursiveRemoveDirById = function (folderId, withConfirmation) {
		if (!withConfirmation || confirm("Are you sure you want to delete this folder, and everything in it? This cannot be undone.")) {
			const folder = $(`[data-globalfolderid='${folderId}']`);
			if (folder.length) {
				d20plus.ut.log("Nuking directory...");
				const childItems = folder.find("[data-itemid]").each((i, e) => {
					const $e = $(e);
					const itemId = $e.attr("data-itemid");
					let toDel = d20.Campaign.handouts.get(itemId);
					toDel || (toDel = d20.Campaign.characters.get(itemId));
					if (toDel) toDel.destroy();
				});
				const childFolders = folder.find(`[data-globalfolderid]`).remove();
				folder.remove();
				$("#journalfolderroot").trigger("change");
			}
		}
	};

	d20plus.journal.recursiveArchiveDirById = function (folderId, withConfirmation) {
		if (!withConfirmation || confirm("Are you sure you want to archive this folder, and everything in it? This cannot be undone.")) {
			const folder = $(`[data-globalfolderid='${folderId}']`);
			if (folder.length) {
				d20plus.ut.log("Archiving directory...");
				folder.find("[data-itemid]").each((i, e) => {
					const $e = $(e);
					const itemId = $e.attr("data-itemid");
					let toArchive = d20.Campaign.handouts.get(itemId);
					toArchive || (toArchive = d20.Campaign.characters.get(itemId));
					if (toArchive && toArchive.attributes) {
						toArchive.attributes.archived = true;
						toArchive.save()
					}
				});
			}
		}
	};

	d20plus.journal.removeDirByPath = function (...path) {
		path = d20plus.journal.getCleanPath(path);
		return d20plus.journal._checkOrRemoveDirByPath(true, path);
	};

	d20plus.journal.checkDirExistsByPath = function (...path) {
		path = d20plus.journal.getCleanPath(path);
		return d20plus.journal._checkOrRemoveDirByPath(false, path);
	};

	d20plus.journal._checkOrRemoveDirByPath = function (doDelete, path) {
		const parts = d20plus.journal.getCleanPath(path);

		const root = {i: d20plus.ut.getJournalFolderObj()};

		let curDir = root;
		for (let i = 0; i < parts.length; ++i) {
			const p = parts[i];
			let lastId;
			const existing = curDir.i.find((it) => {
				lastId = it.id;
				// n is folder name (only folders have the n property)
				return it.n && it.n === p;
			});
			if (!existing) return false;
			curDir = existing;
			if (i === parts.length - 1) {
				d20plus.journal.recursiveRemoveDirById(lastId, false);
				return true;
			}
		}
	};

	d20plus.journal.getExportableJournal = () => {
		// build a list of (id, path) pairs
		const out = [];

		function recurse (entry, pos) {
			if (entry.i) {
				// pos.push({name: entry.n, id: entry.id}); // if IDs are required, use this instead?
				pos.push(entry.n);
				entry.i.forEach(nxt => recurse(nxt, pos));
				pos.pop();
			} else {
				out.push({id: entry, path: MiscUtil.copy(pos)});
			}
		}

		const root = {i: d20plus.ut.getJournalFolderObj(), n: "Root", id: "root"};
		recurse(root, []);
		return out;
	};

	d20plus.journal.removeFileByPath = function (...path) {
		path = d20plus.journal.getCleanPath(path);
		return d20plus.journal._checkOrRemoveFileByPath(true, path);
	};

	d20plus.journal.checkFileExistsByPath = function (...path) {
		path = d20plus.journal.getCleanPath(path);
		return d20plus.journal._checkOrRemoveFileByPath(false, path);
	};

	d20plus.journal._checkOrRemoveFileByPath = function (doDelete, path) {
		const parts = d20plus.journal.getCleanPath(path);

		const root = {i: d20plus.ut.getJournalFolderObj()};

		let curDir = root;
		for (let i = 0; i < parts.length; ++i) {
			const p = parts[i];
			let lastId;
			const existing = curDir.i.find((it) => {
				if (i === parts.length - 1) {
					// for the last item, check handouts/characters to see if the match it (which could be a string ID)
					const char = d20.Campaign.characters.get(it);
					const handout = d20.Campaign.handouts.get(it);
					if ((char && char.get("name") === p) || (handout && handout.get("name") === p)) {
						lastId = it;
						return true;
					}
				} else {
					lastId = it.id;
					// n is folder name (only folders have the n property)
					return it.n && it.n === p;
				}
				return false;
			});
			if (!existing) return false;
			curDir = existing;
			if (i === parts.length - 1) {
				if (doDelete) {
					// on the last item, delete
					let toDel = d20.Campaign.handouts.get(lastId);
					toDel || (toDel = d20.Campaign.characters.get(lastId))
					if (toDel) toDel.destroy();
				}
				return true;
			}
		}
		return false;
	};
}

SCRIPT_EXTENSIONS.push(d20plusJournal);


function baseCss () {
	d20plus.css = {};

	// Convert to regular CSS:
	// `[ ... rules ... ].map(it => `${it.s} {\n${it.r.split(";").map(str => str.trim()).join(";\n")}}\n`).join("\n")`
	d20plus.css.baseCssRules = [
		// generic
		{
			s: ".inline-block, .display-inline-block",
			r: "display: inline-block;"
		},
		{
			s: ".bold",
			r: "font-weight: bold;"
		},
		{
			s: ".clickable",
			r: "cursor: pointer;"
		},
		{
			s: ".split",
			r: "display: flex; justify-content: space-between;"
		},
		{
			s: ".relative",
			r: "position: relative !important;"
		},
		{
			s: ".flex",
			r: "display: flex;"
		},
		{
			s: ".flex-col",
			r: "display: flex; flex-direction: column;"
		},
		{
			s: ".flex-v-center",
			r: "display: flex; align-items: center;"
		},
		{
			s: ".flex-vh-center",
			r: "display: flex; justify-content: center; align-items: center;"
		},
		{
			s: ".no-shrink",
			r: "flex-shrink: 0;"
		},
		{
			s: ".flex-1",
			r: "flex: 1"
		},
		{
			s: ".full-width",
			r: "width: 100%;"
		},
		{
			s: ".full-height",
			r: "height: 100%;"
		},
		{
			s: ".text-center",
			r: "text-align: center;"
		},
		{
			s: ".text-right",
			r: "text-align: right;"
		},
		{
			s: ".is-error",
			r: "color: #d60000;"
		},
		{
			s: ".flex-label",
			r: "display: inline-flex; align-items: center;"
		},
		{
			s: ".sel-xs",
			r: `
				height: 18px;
				line-height: 18px;
				margin: 0;
				padding: 0;
			`
		},
		{
			s: ".btn-xs",
			r: `
				height: 18px;
				line-height: 18px;
				margin: 0;
				padding: 0 4px;
			`
		},
		// // fix Roll20's <p> margins in the text editor // FIXME make this configurable
		// {
		// 	s: ".note-editable p",
		// 	r: "margin-bottom: 0;"
		// },
		// ensure rightclick menu width doesn't break layout // FIXME might be fixing the symptoms and not the cause
		{
			s: ".actions_menu.d20contextmenu > ul > li",
			r: "max-width: 100px;"
		},
		// page view enhancement
		{
			s: "#page-toolbar",
			r: "height: calc(90vh - 40px);"
		},
		{
			s: "#page-toolbar .container",
			r: "height: 100%; white-space: normal;"
		},
		{
			s: "#page-toolbar .pages .availablepage",
			r: "width: 100px; height: 100px;"
		},
		{
			s: "#page-toolbar .pages .availablepage img.pagethumb",
			r: "max-width: 60px; max-height: 60px;"
		},
		{
			s: "#page-toolbar .pages .availablepage span",
			r: "bottom: 1px;"
		},
		{
			s: "#page-toolbar",
			r: "background: #a8aaad80;"
		},
		// search
		{
			s: ".Vetoolsresult",
			r: "background: #ff8080;"
		},
		// config editor
		{
			s: "div.config-table-wrapper",
			r: "min-height: 200px; width: 100%; height: 100%; max-height: 460px; overflow-y: auto; transform: translateZ(0);"
		},
		{
			s: "table.config-table",
			r: "width: 100%; table-layout: fixed;"
		},
		{
			s: "table.config-table tbody tr:nth-child(odd)",
			r: "background-color: #f8f8f8;"
		},
		{
			s: "table.config-table tbody td > *",
			r: "vertical-align: middle; margin: 0;"
		},
		{
			s: ".config-name",
			r: "display: inline-block; line-height: 35px; width: 100%;"
		},
		// tool list
		{
			s: ".tools-list",
			r: "max-height: 70vh;"
		},
		{
			s: ".tool-row",
			r: "min-height: 40px; display: flex; flex-direction: row; align-items: center;"
		},
		{
			s: ".tool-row:nth-child(odd)",
			r: "background-color: #f0f0f0;"
		},
		{
			s: ".tool-row > *",
			r: "flex-shrink: 0;"
		},
		// warning overlay
		{
			s: ".temp-warning",
			r: "position: fixed; top: 12px; left: calc(50vw - 200px); z-index: 10000; width: 320px; background: transparent; color: red; font-weight: bold; font-size: 150%; font-variant: small-caps; border: 1px solid red; padding: 4px; text-align: center; border-radius: 4px;"
		},
		// GM hover text
		{
			s: ".Vetools-token-hover",
			r: "pointer-events: none; position: fixed; z-index: 100000; background: white; padding: 5px 5px 0 5px; border-radius: 5px;     border: 1px solid #ccc; max-width: 450px;"
		},
		// drawing tools bar
		{
			s: "#drawingtools.line_splitter .currentselection:after",
			r: "content: '✂️';"
		},
		// chat tag
		{
			s: ".userscript-hacker-chat",
			r: "margin-left: -45px; margin-right: -5px; margin-bottom: -7px; margin-top: -15px; display: inline-block; font-weight: bold; font-family: 'Lucida Console', Monaco, monospace; color: #20C20E; background: black; padding: 3px; min-width: calc(100% + 60px);"
		},
		{
			s: ".userscript-hacker-chat a",
			r: "color: white;"
		},
		{
			s: ".withoutavatars .userscript-hacker-chat",
			r: "margin-left: -15px; min-width: calc(100% + 30px);"
		},
		{
			s: ".Ve-btn-chat",
			r: "margin-top: 10px; margin-left: -35px;"
		},
		{
			s: ".withoutavatars .Ve-btn-chat",
			r: "margin-left: -5px;"
		},
		// Bootstrap-alikes
		{
			s: ".col",
			r: "display: inline-block;"
		},
		{
			s: ".col-1",
			r: "width: 8.333%;"
		},
		{
			s: ".col-2",
			r: "width: 16.666%;"
		},
		{
			s: ".col-3",
			r: "width: 25%;"
		},
		{
			s: ".col-4",
			r: "width: 33.333%;"
		},
		{
			s: ".col-5",
			r: "width: 41.667%;"
		},
		{
			s: ".col-6",
			r: "width: 50%;"
		},
		{
			s: ".col-7",
			r: "width: 58.333%;"
		},
		{
			s: ".col-8",
			r: "width: 66.667%;"
		},
		{
			s: ".col-9",
			r: "width: 75%;"
		},
		{
			s: ".col-10",
			r: "width: 83.333%;"
		},
		{
			s: ".col-11",
			r: "width: 91.667%;"
		},
		{
			s: ".col-12",
			r: "width: 100%;"
		},
		{
			s: ".ib",
			r: "display: inline-block;"
		},
		{
			s: ".float-right",
			r: "float: right;"
		},
		{
			s: ".my-0",
			r: "margin-top: 0 !important; margin-bottom: 0 !important;"
		},
		{
			s: ".m-1",
			r: "margin: 0.25rem !important;"
		},
		{
			s: ".mt-2",
			r: "margin-top: 0.5rem !important;"
		},
		{
			s: ".mr-1",
			r: "margin-right: 0.25rem !important;"
		},
		{
			s: ".ml-1",
			r: "margin-left: 0.25rem !important;"
		},
		{
			s: ".mr-2",
			r: "margin-right: 0.5rem !important;"
		},
		{
			s: ".ml-2",
			r: "margin-left: 0.5rem !important;"
		},
		{
			s: ".mb-2",
			r: "margin-bottom: 0.5rem !important;"
		},
		{
			s: ".mb-1",
			r: "margin-bottom: 0.25rem !important;"
		},
		{
			s: ".p-2",
			r: "padding: 0.5rem !important;"
		},
		{
			s: ".p-3",
			r: "padding: 1rem !important;"
		},
		{
			s: ".split",
			r: "display: flex; justify-content: space-between;"
		},
		{
			s: ".split--center",
			r: "align-items: center;"
		},
		// image rows
		{
			s: ".import-cb-label--img",
			r: "display: flex; height: 64px; align-items: center; padding: 4px;"
		},
		{
			s: ".import-label__img",
			r: "display: inline-block; width: 60px; height: 60px; padding: 0 5px;"
		},
		// importer
		{
			s: ".import-cb-label",
			r: "display: block; margin-right: -13px !important;"
		},
		{
			s: ".import-cb-label span",
			r: "display: inline-block; overflow: hidden; max-height: 18px; letter-spacing: -1px; font-size: 12px;"
		},
		{
			s: ".import-cb-label span.readable",
			r: "letter-spacing: initial"
		},
		{
			s: ".import-cb-label .source",
			r: "width: calc(16.667% - 28px);'"
		},
		// horizontal toolbar
		{
			s: "#secondary-toolbar:hover",
			r: "opacity: 1 !important;"
		},
		// addon layer bar
		{
			s: "#floatinglayerbar ul",
			r: "margin: 0; padding: 0;"
		},
		{
			s: "#floatinglayerbar li:hover, #floatinglayerbar li.activebutton",
			r: "color: #333; background-color: #54C3E8; cursor: pointer;"
		},
		{
			s: "#floatinglayerbar li",
			r: "padding: 3px; margin: 0; border-bottom: 1px solid #999; display: block; text-align: center; line-height: 22px; font-size: 22px; color: #999; position: relative;"
		},
		{
			s: "#floatinglayerbar.map li.choosemap, #floatinglayerbar.objects li.chooseobjects, #floatinglayerbar.gmlayer li.choosegmlayer, #floatinglayerbar.walls li.choosewalls, #floatinglayerbar.weather li.chooseweather, #floatinglayerbar.foreground li.chooseforeground, #floatinglayerbar.background li.choosebackground",
			r: "background-color: #54C3E8; color: #333;"
		},
		// extra layer buttons
		{
			s: "#editinglayer.weather div.submenu li.chooseweather, #editinglayer.foreground div.submenu li.chooseforeground, #editinglayer.background div.submenu li.choosebackground",
			r: "background-color: #54C3E8; color: #333;"
		},
		{
			s: "#editinglayer.weather .currentselection:after",
			r: "content: \"C\";"
		},
		{
			s: "#editinglayer.foreground .currentselection:after",
			r: "content: \"B\";"
		},
		{
			s: "#editinglayer.background .currentselection:after",
			r: "content: \"a\";"
		},
		// adjust the "Talking to Yourself" box
		{
			s: "#textchat-notifier",
			r: "top: -5px; background-color: red; opacity: 0.5; color: white;"
		},
		{
			s: "#textchat-notifier:after",
			r: "content: '!'"
		},
		{
			s: ".ctx__layer-icon",
			r: `
			display: inline-block;
			width: 12px;
			text-align: center;
			`
		},
		// fix the shitty undersized "fire" icon
		{
			s: ".choosewalls > .pictostwo",
			r: "width: 15px; height: 17px; display: inline-block; text-align: center;"
		},
		{
			s: "#editinglayer.walls > .pictos",
			r: "width: 20px; height: 22px; display: inline-block; text-align: center; font-size: 0.9em;"
		},
		// weather config window
		{
			s: ".ui-dialog .wth__row",
			r: "margin-bottom: 10px; align-items: center; padding: 0 0 5px; border-bottom: 1px solid #eee;"
		},
		{
			s: ".wth__row select",
			r: "margin-bottom: 0"
		},
		{
			s: `.wth__row input[type="range"]`,
			r: "width: calc(100% - 8px);"
		},
		// context menu
		{
			s: `.ctx__divider`,
			r: "width: calc(100% - 2px); border: 1px solid black;"
		},
		// sidebar fix
		// {
		// 	s: `#rightsidebar`,
		// 	r: `
		// 	    display: flex;
		// 	    flex-direction: column;
		// 	`
		// },
		// {
		// 	s: `#rightsidebar ul.tabmenu`,
		// 	r: `
		// 	    padding: 0;
    	// 		flex-shrink: 0;
    	// 		position: relative;
    	// 		top: 0;
    	// 		width: 100%;
		// 	`
		// },
		// {
		// 	s: `#rightsidebar .ui-tabs-panel`,
		// 	r: `
		// 		height: 100% !important;
		// 		display: block;
		// 		top: 0;
		// 	`
		// },
		// {
		// 	s: `#textchat-input`,
		// 	r: `
		// 		position: relative;
    	// 		flex-shrink: 0;
		// 	`
		// },
		// {
		// 	s: `#textchat-input textarea`,
		// 	r: `
		// 		width: calc(100% - 8px) !important;
		// 		resize: vertical;
		// 	`
		// },
	];

	d20plus.css.baseCssRulesPlayer = [
		{
			s: ".player-hidden",
			r: "display: none !important;"
		}
	];

	d20plus.css.cssRules = []; // other scripts should populate this

	// Mirrors of 5etools CSS
	d20plus.css.cssRules = d20plus.css.cssRules.concat([
		{
			s: ".copied-tip",
			r: "pointer-events: none; position: fixed; background: transparent; user-select: none; z-index: 100000; width: 80px; height: 24px; line-height: 24px;"
		},
		{
			s: ".copied-tip > span",
			r: "display: inline-block; width: 100%; text-align: center;"
		},
		{
			s: ".help",
			r: "cursor: help; text-decoration: underline; text-decoration-style: dotted;"
		},
		{
			s: ".help--subtle",
			r: "cursor: help;"
		}
	]);

	// Art repo browser CSS
	d20plus.css.cssRules = d20plus.css.cssRules.concat([
		// full-width images search header
		{
			s: "#imagedialog .searchbox",
			r: "width: calc(100% - 10px)"
		},
		///////////////
		{
			s: ".artr__win",
			r: "display: flex; align-items: stretch; width: 100%; height: 100%; padding: 0 !important;"
		},
		// fix box sizing
		{
			s: ".artr__win *",
			r: "box-sizing: border-box;"
		},
		// custom scrollbars
		{
			s: ".artr__win *::-webkit-scrollbar",
			r: "width: 9px; height: 9px;"
		},
		{
			s: ".artr__win *::-webkit-scrollbar-track",
			r: "background: transparent;"
		},
		{
			s: ".artr__win *::-webkit-scrollbar-thumb",
			r: "background: #cbcbcb;"
		},
		///////////////
		{
			s: ".artr__side",
			r: "width: 300px; height: 100%; border-right: 1px solid #ccc; background: #f8f8f8; position: relative; flex-shrink: 0; display: flex; flex-direction: column;"
		},
		{
			s: ".artr__side__head",
			r: "flex-shrink: 0; font-weight: bold; margin-bottom: 7px; margin-bottom: 7px; border-bottom: 3px solid #ccc; background: white;"
		},
		{
			s: ".artr__side__head__title",
			r: "font-size: 16px; font-weight: bold;"
		},
		{
			s: ".artr__side__body",
			r: "flex-shrink: 0; overflow-y: auto; transform: translateZ(0);"
		},
		{
			s: ".artr__side__tag_header",
			r: "width: 100%; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; padding: 0 6px; cursor: pointer; margin-bottom: 10px;"
		},
		{
			s: ".artr__side__tag_grid",
			r: "display: flex; width: 100%; flex-wrap: wrap; margin-bottom: 15px; background: #f0f0f0; border-radius: 5px;"
		},
		{
			s: ".artr__side__tag",
			r: "padding: 2px 4px; margin: 2px 4px; font-size: 11px;"
		},
		{
			s: `.artr__side__tag[data-state="1"]`,
			r: "background-image: linear-gradient(#fff, #337ab7);"
		},
		{
			s: `.artr__side__tag[data-state="1"]:hover`,
			r: "background-image: linear-gradient(rgb(#337ab7), rgb(#337ab7)); background-position: 0; transition: none;"
		},
		{
			s: `.artr__side__tag[data-state="2"]`,
			r: "background-image: linear-gradient(#fff, #8a1a1b);"
		},
		{
			s: `.artr__side__tag[data-state="2"]:hover`,
			r: "background-image: linear-gradient(rgb(#8a1a1b), rgb(#8a1a1b)); background-position: 0; transition: none;"
		},
		{
			s: ".artr__main",
			r: "width: 100%; height: 100%; display: flex; overflow-y: auto; flex-direction: column; position: relative;"
		},
		{
			s: ".artr__side__loading, .artr__main__loading",
			r: "width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;     font-style: italic;"
		},
		{
			s: ".artr__bread",
			r: "width: 100%; margin-bottom: 2px;"
		},
		{
			s: ".artr__crumb",
			r: "border: 1px solid #ccc; border-radius: 5px; padding: 0 5px; display: inline-block; cursor: pointer; user-select: none;"
		},
		{
			s: ".artr__crumb--sep",
			r: "border: 0; cursor: default;"
		},
		{
			s: ".artr__search",
			r: "flex-shrink: 0; width: 100%; border-bottom: 1px solid #ccc; display: flex; flex-direction: column;"
		},
		{
			s: ".artr__search__field",
			r: "width: 100%; height: 26px;"
		},
		{
			s: ".artr__view",
			r: "position: absolute; top: 64px; bottom: 0; left: 0; right: 0; overflow-y: auto; transform: translateZ(0); background-color: whitesmoke;"
		},
		{
			s: ".artr__view_inner",
			r: "display: flex; width: 100%; height: 100%; flex-wrap: wrap; align-content: flex-start;"
		},
		{
			s: ".artr__no_results_wrp",
			r: "width: 100%; height: 100%; display: flex; justify-content: center;"
		},
		{
			s: ".artr__no_results",
			r: "width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;"
		},
		{
			s: ".artr__no_results_headline",
			r: "font-size: 125%; font-weight: bold;"
		},
		{
			s: ".artr__item",
			r: "width: 180px; margin: 5px; box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.75); display: block; background: white; position: relative;"
			// Using flex makes scrolling extremely sluggish
			// display: flex; flex-direction: column; cursor: pointer; float: left;
		},
		{
			s: ".artr__item__stats",
			r: "position: absolute; left: 0; top: 0; display: none;"
		},
		{
			s: ".artr__item:hover .artr__item__stats",
			r: "display: block;"
		},
		{
			s: ".artr__item__stats_item",
			r: "color: grey; background: white; border-radius: 5px; margin: 4px 2px; padding: 0 2px; text-align: center; border: 1px solid #e0e0e0"
		},
		{
			s: ".artr__item__menu",
			r: "position: absolute; right: 0; top: 0; display: none;"
		},
		{
			s: ".artr__item:hover .artr__item__menu",
			r: "display: block;"
		},
		{
			s: ".artr__item__menu_item",
			r: "cursor: pointer; color: grey; font-size: 26px; line-height: 24px; border-radius: 5px; margin: 4px; padding: 2px; text-align: center; display: block; border: 1px solid #ccc; background: white;"
		},
		{
			s: ".artr__item--index",
			r: "height: 240px;"
		},
		{
			s: ".artr__item--item",
			r: "height: 180px;"
		},
		{
			s: ".artr__item:hover",
			r: "box-shadow: 0 0 8px 0 rgba(38, 167, 242, 1); opacity: 0.95;"
		},
		{
			s: ".artr__item--back",
			r: "display: flex; justify-content: center; align-items: center; font-size: 24px; color: #888;"
		},
		{
			s: ".artr__item__top",
			r: "width: 100%; height: 180px; flex-shrink: 0; margin: 0 auto; display: flex; align-items: center;"
		},
		{
			s: ".artr__item__top--quart",
			r: "display: flex; flex-wrap: wrap;"
		},
		{
			s: ".artr__item__bottom",
			r: "width: 100%; height: 60px; flex-shrink: 0;  border-top: 1px solid #ccc; background: #f8f8f8; display: flex; flex-direction: column; font-size: 12px; justify-content: space-evenly;"
		},
		{
			s: ".artr__item__bottom__row",
			r: "width: 100% height: 20px; flex-shrink: 0; padding: 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
		},
		{
			s: ".artr__item__thumbnail",
			r: "max-width: 100%; max-height: 100%; display: block; margin: 0 auto;"
		},
		{
			s: ".atr__item__quart",
			r: "width: 50%; height: 50%; display: block; margin: 0;"
		},
		{
			s: ".atr__item__quart--more",
			r: "display: flex; justify-content: center; align-items: center;"
		},
		{
			s: ".artr__item__full",
			r: "width: 100%; height: 180px; margin: 0 auto; display: flex; align-items: center; padding: 3px;"
		},
		{
			s: ".artr__wrp_big_img",
			r: "position: fixed; top: 0; bottom: 0; right: 0; left: 0; background: #30303080; padding: 30px; display: flex; justify-content: center; align-items: center; z-index: 99999;"
		},
		{
			s: ".artr__big_img",
			r: "display: block; max-width: 100%; max-height: 100%;"
		},
	]);

	// Animator CSS -- `anm__` prefix
	d20plus.css.cssRules = d20plus.css.cssRules.concat([
		// fix box sizing
		{
			s: ".anm__win *",
			r: "box-sizing: border-box;"
		},
		{
			s: ".ui-dialog .anm__row",
			r: `
    			display: flex;
    			align-items: center;
    			margin-bottom: 3px;
    			height: 20px;
			`
		},
		{
			s: ".anm__row > div",
			r: `
				display: inline-flex;
			`
		},
		{
			s: ".anm__row-btn",
			r: `
				padding: 0 6px;
			`
		},
		{
			s: ".anm__row-wrp-cb",
			r: `
				justify-content: center;
				align-items: center;
			`
		},
		{
			s: ".anm__wrp-sel-all",
			r: `
				align-items: center; 
				margin-bottom: 5px;
				display: flex;
				justify-content: space-between;
			`
		},
		{
			s: ".anm-edit__ipt-lines-wrp",
			r: `
				flex-basis: 100%;
				flex-shrink: 100;
			`
		},
		{
			s: ".anm-edit__gui .anm-edit__gui-hidden",
			r: `
				display: none;
			`
		},
		{
			s: ".anm-edit__text .anm-edit__gui-visible",
			r: `
				display: none;
			`
		},
		{
			s: ".anm-edit__ipt-lines-wrp--gui",
			r: `
				overflow-y: auto;
				display: flex;
				flex-direction: column;
			`
		},
		{
			s: ".anm-edit__ipt-lines-wrp--gui > *",
			r: `
				flex-shrink: 0;
			`
		},
		{
			s: ".anm-edit__ipt-lines",
			r: `
				resize: none;
				width: 100%;
				height: 100%;
				margin-bottom: 0;
			`
		},
		{
			s: ".anm-edit__gui-row",
			r: `
				padding: 4px;
				border: 1px solid #ccc;
				border-radius: 3px;
				margin-bottom: 3px;
			`
		},
		{
			s: ".anm-edit__gui-row:nth-child(even)",
			r: `
				background: #f8f8f8;
			`
		},
		{
			s: ".anm-edit__gui-row-name",
			r: `
				color: white; 
				-webkit-text-stroke: 1px #555; 
				text-stroke: 1px black; 
				padding: 3px 5px; 
				border-radius: 3px; 
				font-size: 16px; 
				display: inline-block; 
				min-width: 150px;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Move",
			r: `
				background: #ff0004;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Rotate",
			r: `
				background: #ff6c00;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Copy",
			r: `
				background: #fff700;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Flip",
			r: `
				background: #a3ff00;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Scale",
			r: `
				background: #5eff00;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Layer",
			r: `
				background: #00ff25;
			`
		},
		{
			s: ".anm-edit__gui-row-name--Lighting",
			r: `
				background: #00ffb6;
			`
		},
		{
			s: [
				".anm-edit__gui-row-name--SetProperty",
				".anm-edit__gui-row-name--SumProperty"
			],
			r: `
				background: #006bff;
			`
		},
		{
			s: ".anm-edit__gui-row-name--TriggerMacro",
			r: `
				background: #0023ff;
			`
		},
		{
			s: ".anm-edit__gui-row-name--TriggerAnimation",
			r: `
				background: #9800ff;
			`
		},
		{
			s: ".anm-scene__wrp-tokens",
			r: `
				width: 100%;
				max-height: 100%;
				overflow-y: auto;
				display: flex;
				flex-wrap: wrap;
			`
		},
		{
			s: ".anm-scene__wrp-token",
			r: `
				width: 80px;
				height: 100px;
				background: #f0f0f0;
				box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.75);
				margin: 4px;
				display: flex;
				flex-direction: column;
				padding: 3px;
			`
		},
		{
			s: ".anm-scene__wrp-token--active",
			r: `
				background: #a0f0ff;
			`
		},
		{
			s: ".anm-scene__wrp-token-name",
			r: `
				height: 20px;
				overflow: hidden;
			`
		},
		{
			s: ".anm-scene__wrp-token-name-inner",
			r: `
				height: 20px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap; 
			`
		}
	]);

	// Jukebox CSS
	d20plus.css.cssRules = d20plus.css.cssRules.concat([
		{
			s: ".jukebox-widget-button",
			r: `
    			flex: 1;
    			text-overflow: ellipsis;
    			overflow: hidden;
    			min-width: 50px;
			`
		},
		{
			s: ".jukebox-widget-slider",
			r: `
    			margin: 10px;
    			display: inline-block;
    			flex: 15;
			`
		},
		{
			s: ".jukebox-widget-button",
			r: `
    			letter-spacing: -1px
			`
		},
	]);
}

SCRIPT_EXTENSIONS.push(baseCss);


function baseUi () {
	d20plus.ui = {};

	d20plus.ui.addHtmlHeader = () => {
		d20plus.ut.log("Add HTML");
		const $body = $("body");

		const $wrpSettings = $(`<div id="betteR20-settings"/>`);
		$("#mysettings > .content").children("hr").first().before($wrpSettings);

		$wrpSettings.append(d20plus.settingsHtmlHeader);
		$body.append(d20plus.configEditorHTML);
		if (window.is_gm) {
			$(`#imagedialog`).find(`.searchbox`).find(`.tabcontainer`).first().after(d20plus.artTabHtml);
			$(`#button-add-external-art`).on(window.mousedowntype, d20plus.art.button);

			$body.append(d20plus.addArtHTML);
			$body.append(d20plus.addArtMassAdderHTML);
			$body.append(d20plus.tool.toolsListHtml);
			$("#d20plus-artfolder").dialog({
				autoOpen: false,
				resizable: true,
				width: 1000,
				height: 800,
			});
			$("#d20plus-artmassadd").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 650,
			});
		}
		const $cfgEditor = $("#d20plus-configeditor");
		$cfgEditor.dialog({
			autoOpen: false,
			resizable: true,
			width: 800,
			height: 650,
		});
		$cfgEditor.parent().append(d20plus.configEditorButtonBarHTML);

		// shared GM/player conent
		// quick search box
		const $iptSearch = $(`<input id="player-search" class="ui-autocomplete-input" autocomplete="off" placeholder="Quick search by name...">`);
		const $wrprResults = $(`<div id="player-search-results" class="content searchbox"/>`);

		if (window.is_gm) {
			$iptSearch.css("width", "calc(100% - 5px)");
			const $addPoint = $("#journal").find("button.btn.superadd");
			$addPoint.after($wrprResults);
			$addPoint.after(`<br>`);
			$addPoint.after($iptSearch);
			$addPoint.after(`<br><br>`);
		} else {
			const $wrprControls = $(`<div class="content searchbox" id="search-wrp-controls"/>`);
			$(`#journal .content`).before($wrprControls).before($wrprResults);
			$iptSearch.css("max-width", "calc(100% - 140px)");
			$wrprControls.append($iptSearch);
		}
		d20plus.engine.initQuickSearch($iptSearch, $wrprResults);
	};

	d20plus.ui.addHtmlFooter = () => {
		const $wrpSettings = $(`#betteR20-settings`);
		$wrpSettings.append(d20plus.settingsHtmlPtFooter);

		$("#mysettings > .content a#button-edit-config").on(window.mousedowntype, d20plus.cfg.openConfigEditor);
		$("#button-manage-qpi").on(window.mousedowntype, qpi._openManager);
		d20plus.tool.addTools();
	};

	d20plus.ui.addQuickUiGm = () => {
		const $wrpBtnsMain = $(`#floatingtoolbar`);

		// add quick layer selection panel
		const $ulBtns = $(`<div id="floatinglayerbar"><ul/></div>`)
			.css({
				width: 30,
				position: "absolute",
				left: 20,
				top: $wrpBtnsMain.height() + 45,
				border: "1px solid #666",
				boxShadow: "1px 1px 3px #666",
				zIndex: 10600,
				backgroundColor: "rgba(255,255,255,0.80)"
			})
			.appendTo($(`body`)).find(`ul`);

		const handleClick = (clazz, evt) => $wrpBtnsMain.find(`.${clazz}`).trigger("click", evt);
		$(`<li title="Map" class="choosemap"><span class="pictos" style="padding: 0 3px;">@</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`choosemap`, evt));
		$(`<li title="Background" class="choosebackground"><span class="pictos">a</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`choosebackground`, evt));
		$(`<li title="Objects & Tokens" class="chooseobjects"><span class="pictos">b</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`chooseobjects`, evt));
		$(`<li title="Foreground" class="chooseforeground"><span class="pictos">B</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`chooseforeground`, evt));
		$(`<li title="GM Info Overlay" class="choosegmlayer"><span class="pictos">E</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`choosegmlayer`, evt));
		$(`<li title="Dynamic Lighting" class="choosewalls"><span class="pictostwo">r</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`choosewalls`, evt));
		$(`<li title="Weather Exclusions" class="chooseweather"><span class="pictos">C</span></li>`).appendTo($ulBtns).click((evt) => handleClick(`chooseweather`, evt));

		$("body").on("click", "#editinglayer li", function () {
			$("#floatinglayerbar").removeClass("map")
				.removeClass("background")
				.removeClass("objects")
				.removeClass("foreground")
				.removeClass("gmlayer")
				.removeClass("walls")
				.removeClass("weather");
			setTimeout(() => {
				$("#floatinglayerbar").addClass(window.currentEditingLayer)
			}, 1);
		});

		// add "desc sort" button to init tracker
		const $initTracker = $(`#initiativewindow`);
		const addInitSortBtn = () => {
			$(`<div class="btn" id="init-quick-sort-desc" style="margin-right: 5px;"><span class="pictos">}</span></div>`).click(() => {
				// this will throw a benign error if the settings dialog has never been opened
				$("#initiativewindow_settings .sortlist_numericdesc").click();
			}).prependTo($initTracker.parent().find(`.ui-dialog-buttonset`));
		};
		if (d20.Campaign.initiativewindow.model.attributes.initiativepage) {
			addInitSortBtn();
		} else {
			d20.Campaign.initiativewindow.model.on("change", (e) => {
				if (d20.Campaign.initiativewindow.model.attributes.initiativepage && $(`#init-quick-sort-desc`).length === 0) {
					addInitSortBtn();
					d20plus.cfg.baseHandleConfigChange();
				}
			})
		}
	};
}

SCRIPT_EXTENSIONS.push(baseUi);


/**
 * All the modified minified based on parts of Roll20's `app.js`
 */
function d20plusMod() {
	d20plus.mod = {};

	// modified to allow players to use the FX tool, and to keep current colour selections when switching tool
	// BEGIN ROLL20 CODE
	d20plus.mod.setMode = function (e) {
		d20plus.ut.log("Setting mode " + e);
		// BEGIN MOD
		// "text" === e || "rect" === e || "polygon" === e || "path" === e || "pan" === e || "select" === e || "targeting" === e || "measure" === e || window.is_gm || (e = "select"),
		// END MOD
		"text" == e ? $("#editor").addClass("texteditmode") : $("#editor").removeClass("texteditmode"),
			$("#floatingtoolbar li").removeClass("activebutton"),
			$("#" + e).addClass("activebutton"),
		"fog" == e.substring(0, 3) && $("#fogcontrols").addClass("activebutton"),
		"rect" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("text path polygon line_splitter").addClass("rect")),
		"text" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("rect path polygon line_splitter").addClass("text")),
		"path" == e && $("#drawingtools").addClass("activebutton").removeClass("text rect polygon line_splitter").addClass("path"),
			"polygon" == e ? $("#drawingtools").addClass("activebutton").removeClass("text rect path line_splitter").addClass("polygon") : d20.engine.finishCurrentPolygon(),
			// BEGIN MOD (also line_splitter added to above removeClass calls
		"line_splitter" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("rect path polygon text").addClass("line_splitter")),
			// END MOD
		"pan" !== e && "select" !== e && d20.engine.unselect(),
			"pan" == e ? ($("#select").addClass("pan").removeClass("select").addClass("activebutton"),
				d20.token_editor.removeRadialMenu(),
				$("#editor-wrapper").addClass("panning")) : $("#editor-wrapper").removeClass("panning"),
		"select" == e && $("#select").addClass("select").removeClass("pan").addClass("activebutton"),
			$("#floatingtoolbar .mode").hide(),
		("text" == e || "select" == e) && $("#floatingtoolbar ." + e).show(),
			"gridalign" == e ? $("#gridaligninstructions").show() : "gridalign" === d20.engine.mode && $("#gridaligninstructions").hide(),
			"targeting" === e ? ($("#targetinginstructions").show(),
				$("#finalcanvas").addClass("targeting"),
				d20.engine.canvas.hoverCursor = "crosshair") : "targeting" === d20.engine.mode && ($("#targetinginstructions").hide(),
				$("#finalcanvas").removeClass("targeting"),
			d20.engine.nextTargetCallback && _.defer(function () {
				d20.engine.nextTargetCallback && d20.engine.nextTargetCallback(!1)
			}),
				d20.engine.canvas.hoverCursor = "move"),
			// BEGIN MOD
			// console.log("Switch mode to " + e),
			d20.engine.mode = e,
		"measure" !== e && window.currentPlayer && d20.engine.measurements[window.currentPlayer.id] && !d20.engine.measurements[window.currentPlayer.id].sticky && (d20.engine.announceEndMeasure({
			player: window.currentPlayer.id
		}),
			d20.engine.endMeasure()),
			d20.engine.canvas.isDrawingMode = "path" == e ? !0 : !1;
		if ("text" == e || "path" == e || "rect" == e || "polygon" == e || "fxtools" == e
			// BEGIN MOD
			|| "measure" == e) {
			// END MOD
			$("#secondary-toolbar").show();
			$("#secondary-toolbar .mode").hide();
			$("#secondary-toolbar ." + e).show();
			("path" == e || "rect" == e || "polygon" == e) && ("" === $("#path_strokecolor").val() && ($("#path_strokecolor").val("#000000").trigger("change-silent"),
				$("#path_fillcolor").val("transparent").trigger("change-silent")),
				d20.engine.canvas.freeDrawingBrush.color = $("#path_strokecolor").val(),
				d20.engine.canvas.freeDrawingBrush.fill = $("#path_fillcolor").val() || "transparent",
				$("#path_width").trigger("change")),
			"fxtools" == e && "" === $("#fxtools_color").val() && $("#fxtools_color").val("#a61c00").trigger("change-silent"),
				$("#floatingtoolbar").trigger("blur")
		} else {
			$("#secondary-toolbar").hide();
			$("#floatingtoolbar").trigger("blur");
		}
		// END MOD
	};
	// END ROLL20 CODE

	d20plus.mod.drawMeasurements = function () {
		// BEGIN ROLL20 CODE
		var k = function(e, t) {
			let n = {
				scale: 0,
				grid: 0
			}
				, i = 0
				, o = -1;
			_.each(t.waypoints, r=>{
					let a = {
						to_x: r[0],
						to_y: r[1],
						color: t.color,
						flags: t.flags,
						hide: t.hide
					};
					o > -1 ? (a.x = t.waypoints[o][0],
						a.y = t.waypoints[o][1]) : (a.x = t.x,
						a.y = t.y);
					let s = E(e, a, !0, "nub", n, i);
					n.scale += s.scale_distance,
						n.grid += s.grid_distance,
						i = s.diagonals % 2,
						++o
				}
			);
			let r = {
				to_x: t.to_x,
				to_y: t.to_y,
				color: t.color,
				flags: t.flags,
				hide: t.hide
				// BEGIN MOD
				,
				Ve: t.Ve
				// END MOD
			};
			-1 === o ? (r.x = t.x,
				r.y = t.y) : (r.x = t.waypoints[o][0],
				r.y = t.waypoints[o][1]),
				E(e, r, !0, "arrow", n, i)
		}
			, E = function(e, t, n, i, o, r) {
			let a = e=>e / d20.engine.canvasZoom
				, s = d20.engine.getDistanceInScale({
				x: t.x,
				y: t.y
			}, {
				x: t.to_x,
				y: t.to_y
			}, r, 15 & t.flags);
			e.save(),
				e.globalCompositeOperation = "source-over",
				e.globalAlpha = 1,
				e.strokeStyle = t.color,
				e.fillStyle = e.strokeStyle,
				e.lineWidth = a(3);
			let l = {
				line: [t.to_x - t.x, t.to_y - t.y],
				arrow: [[-10.16, -24.53], [0, -20.33], [10.16, -24.53]],
				x: [1, 0],
				y: [0, 1]
			};
			if (e.beginPath(),
				e.moveTo(t.x, t.y),
				e.lineTo(t.to_x, t.to_y),
			!0 === i || "arrow" === i) {
				let n = Math.atan2(l.line[1], l.line[0]);
				l.forward = [Math.cos(n), Math.sin(n)],
					l.right = [Math.cos(n + Math.PI / 2), Math.sin(n + Math.PI / 2)],
					l.arrow = _.map(l.arrow, e=>[d20.math.dot(e, l.right), d20.math.dot(e, l.forward)]),
					l.arrow = _.map(l.arrow, e=>[d20.math.dot(e, l.x), d20.math.dot(e, l.y)]),
					e.moveTo(t.to_x, t.to_y),
					_.each(l.arrow, n=>e.lineTo(t.to_x + a(n[0]), t.to_y + a(n[1]))),
					e.closePath(),
					e.fill()
			}
			if (e.closePath(),
				e.stroke(),
			"nub" === i && (e.beginPath(),
				e.arc(t.to_x, t.to_y, a(7), 0, 2 * Math.PI, !0),
				e.closePath(),
				e.fill()),
				n) {
				let n = Math.round(a(16))
					, i = Math.round(a(14));
				e.font = `${n}px Arial Black`,
					e.textBaseline = "alphabetic",
					e.textAlign = "center";
				let r = {
					distance: Math.round(10 * (s.scale_distance + (o ? o.scale : 0))) / 10,
					units: d20.Campaign.activePage().get("scale_units")
				};
				r.text = `${r.distance} ${r.units}`,
					r.text_metrics = e.measureText(r.text);
				let l = {
					active: d20.Campaign.activePage().get("showgrid") && d20.engine.snapTo > 0 && "sq" !== r.units && "hex" !== r.units,
					text: ""
				};
				if (l.active) {
					let t = d20.Campaign.activePage().get("grid_type")
						, n = "hex" === t || "hexr" === t ? "hex" : "sq";
					e.font = `${i}px Arial`,
						l.distance = Math.round(10 * (s.grid_distance + (o ? o.grid : 0))) / 10,
						l.text = `${l.distance} ${n}`,
						l.text_metrics = e.measureText(l.text)
				}
				let c = n - Math.round(a(4))
					, u = i - Math.round(a(3.5))
					, d = {
					x: t.to_x - Math.round(a(35)),
					y: t.to_y - Math.round(a(35)),
					width: Math.max(r.text_metrics.width, l.active ? l.text_metrics.width : 0),
					height: c,
					padding: Math.round(a(5)),
					scale_baseline_offset: 0,
					cell_baseline_offset: 0,
					text_horizontal_offset: 0,
					line_spacing: Math.ceil(a(4)),
					image_width: a(20),
					image_height: a(20),
					image_padding_left: a(5)
				};
				d.height += 2 * d.padding,
					d.width += 2 * d.padding,
					d.text_horizontal_offset = .5 * d.width,
					d.scale_baseline_offset = d.height - d.padding,
				l.active && (d.height += u + d.line_spacing,
					d.cell_baseline_offset = d.height - d.padding),
				t.hide && (d.width += d.image_width + d.image_padding_left,
					d.height = Math.max(d.height, d.image_height + 2 * d.padding),
					d.text_width = Math.max(r.text_metrics.width, l.active ? l.text_metrics.width : 0)),
					e.fillStyle = "rgba(255,255,255,0.75)",
					e.fillRect(d.x, d.y, d.width, d.height),
					e.fillStyle = "rgba(0,0,0,1)",
					e.font = `${n}px Arial Black`,
					e.fillText(r.text, d.x + d.text_horizontal_offset, d.y + d.scale_baseline_offset),
					e.font = `${i}px Arial`,
					e.fillText(l.text, d.x + d.text_horizontal_offset, d.y + d.cell_baseline_offset),
				t.hide && (d.image_vertical_offset = .5 * d.height - .5 * d.image_height,
					d.image_horizontal_offset = d.padding + d.text_width + d.image_padding_left,
					e.drawImage($("#measure li.rulervisibility[mode='hide'] > img")[0], d.x + d.image_horizontal_offset, d.y + d.image_vertical_offset, d.image_width, d.image_height))
			}

			// BEGIN MOD
			if (t.Ve) {
				const RAD_90_DEG = 1.5708;

				const euclid = (x1, y1, x2, y2) => {
					const a = x1 - x2;
					const b = y1 - y2;
					return Math.sqrt(a * a + b * b)
				};

				const rotPoint = (angleRad, pX, pY) => {
					const s = Math.sin(angleRad);
					const c = Math.cos(angleRad);

					pX -= t.x;
					pY -= t.y;

					const xNew = pX * c - pY * s;
					const yNew = pX * s + pY * c;

					pX = xNew + t.x;
					pY = yNew + t.y;
					return [pX, pY];
				};

				const getLineEquation = (x1, y1, x2, y2) => {
					const getM = () => {
						return (y2 - y1) / (x2 - x1)
					};
					const m = getM();

					const getC = () => {
						return y1 - (m * x1);
					};

					const c = getC();

					return {
						fn: (x) => (m * x) + c,
						m, c
					}
				};

				const getPerpLineEquation = (x, y, line) => {
					const m2 = -1 / line.m
					const c2 = y - (m2 * x);
					return {
						fn: (x) => (m2 * x) + c2,
						m: m2, c: c2
					}
				};

				const getIntersect = (pointPerp, line1, line2) => {
					if (Math.abs(line1.m) === Infinity) {
						// intersecting with the y-axis...
						return [pointPerp[0], line2.fn(pointPerp[0])];
					} else {
						const x = (line2.c - line1.c) / (line1.m - line2.m);
						const y = line1.fn(x);
						return [x, y];
					}
				};

				switch (t.Ve.mode) {
					case "1": // standard ruler
						break;
					case "2": { // radius
						const drawCircle = (cx, cy, rad) => {
							e.beginPath();
							e.arc(cx, cy, rad, 0, 2*Math.PI);
							e.stroke();
							e.closePath();
						};

						switch (t.Ve.radius.mode) {
							case "1": // origin
								drawCircle(t.x, t.y, euclid(t.x, t.y, t.to_x, t.to_y));
								break;
							case "2": { // halfway
								const dx = t.to_x - t.x;
								const dy = t.to_y - t.y;
								const cX = t.x + (dx / 2);
								const cY = t.y + (dy / 2);

								drawCircle(cX, cY, euclid(cX, cY, t.to_x, t.to_y));
								break;
							}
						}

						break;
					}
					case "3": { // cone
						const arcRadians = (Number(t.Ve.cone.arc) || 0.017) / 2; // 1 degree minimum

						const r = euclid(t.x, t.y, t.to_x, t.to_y);
						const dx = t.to_x - t.x;
						const dy = t.to_y - t.y;
						const startR = Math.atan2(dy, dx);

						if (t.Ve.cone.mode === "1") {
							const line = getLineEquation(t.x, t.y, t.to_x, t.to_y);
							const perpLine = getPerpLineEquation(t.to_x, t.to_y, line);

							const pRot1 = rotPoint(arcRadians, t.to_x, t.to_y);
							const lineRot1 = getLineEquation(t.x, t.y, pRot1[0], pRot1[1]);
							const intsct1 = getIntersect([t.to_x, t.to_y], perpLine, lineRot1);

							// border line 1
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(intsct1[0], intsct1[1]);
							e.stroke();
							e.closePath();

							// perp line 1
							e.beginPath();
							e.moveTo(t.to_x, t.to_y);
							e.lineTo(intsct1[0], intsct1[1]);
							e.stroke();
							e.closePath();

							const pRot2 = rotPoint(-arcRadians, t.to_x, t.to_y);
							const lineRot2 = getLineEquation(t.x, t.y, pRot2[0], pRot2[1]);
							const intsct2 = getIntersect([t.to_x, t.to_y], perpLine, lineRot2);

							// border line 2
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(intsct2[0], intsct2[1]);
							e.stroke();
							e.closePath();

							// perp line 2
							e.beginPath();
							e.moveTo(t.to_x, t.to_y);
							e.lineTo(intsct2[0], intsct2[1]);
							e.stroke();
							e.closePath();
						} else {
							// arc 1
							e.beginPath();
							e.arc(t.x, t.y, r, startR, startR + arcRadians);
							e.stroke();
							e.closePath();
							// arc 2
							e.beginPath();
							e.arc(t.x, t.y, r, startR, startR - arcRadians, true); // draw counter-clockwise
							e.stroke();
							e.closePath();

							// border line 1
							const s1 = Math.sin(arcRadians);
							const c1 = Math.cos(arcRadians);
							const xb1 = dx * c1 - dy * s1;
							const yb1 = dx * s1 + dy * c1;
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(t.x + xb1, t.y + yb1);
							e.stroke();
							e.closePath();

							// border line 2
							const s2 = Math.sin(-arcRadians);
							const c2 = Math.cos(-arcRadians);
							const xb2 = dx * c2 - dy * s2;
							const yb2 = dx * s2 + dy * c2;
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(t.x + xb2, t.y + yb2);
							e.stroke();
							e.closePath();
						}
						break;
					}
					case "4": { // box
						const dxHalf = (t.to_x - t.x) / 2;
						const dyHalf = (t.to_y - t.y) / 2;

						e.beginPath();
						switch (t.Ve.box.mode) {
							case "1": // origin
								const dx = t.to_x - t.x;
								const dy = t.to_y - t.y;

								const [x1, y1] = rotPoint(RAD_90_DEG, t.to_x, t.to_y);
								const [x3, y3] = rotPoint(-RAD_90_DEG, t.to_x, t.to_y);

								e.moveTo(x1, y1);
								e.lineTo(x1 + dx, y1 + dy);
								e.lineTo(x3 + dx, y3 + dy);
								e.lineTo(x3 - dx, y3 - dy);
								e.lineTo(x1 - dx, y1 - dy);
								e.lineTo(x1 + dx, y1 + dy);

								break;
							case "2": { // halfway
								const [x1, y1] = rotPoint(RAD_90_DEG, t.to_x - dxHalf, t.to_y - dyHalf);
								const [x3, y3] = rotPoint(-RAD_90_DEG, t.to_x - dxHalf, t.to_y - dyHalf);

								e.moveTo(t.x, t.y);
								e.lineTo(x1, y1);
								e.lineTo(x3, y3);

								const dx3 = (x3 - t.x);
								const dy3 = (y3 - t.y);
								e.lineTo(t.to_x + dx3, t.to_y + dy3);

								const dx1 = (x1 - t.x);
								const dy1 = (y1 - t.y);
								e.lineTo(t.to_x + dx1, t.to_y + dy1);

								e.lineTo(x1, y1);

								break;
							}
						}
						e.stroke();
						e.closePath();
						break;
					}
					case "5": { // line
						e.beginPath();

						const div = t.Ve.line.mode === "2" ? 1 : 2;

						const norm = [];
						d20plus.math.vec2.normalize(norm, [t.to_x - t.x, t.to_y - t.y]);
						const width = (Number(t.Ve.line.width) || 0.1) / div;
						const scaledWidth = (width / d20.Campaign.activePage().get("scale_number")) * 70;
						d20plus.math.vec2.scale(norm, norm, scaledWidth);

						const xRot = t.x + norm[0];
						const yRot = t.y + norm[1];

						const [x1, y1] = rotPoint(RAD_90_DEG, xRot, yRot);
						const [x3, y3] = rotPoint(-RAD_90_DEG, xRot, yRot);
						console.log(t.x, t.y, norm, xRot, yRot);

						e.moveTo(t.x, t.y);
						e.lineTo(x1, y1);
						e.lineTo(x3, y3);

						const dx3 = (x3 - t.x);
						const dy3 = (y3 - t.y);
						e.lineTo(t.to_x + dx3, t.to_y + dy3);

						const dx1 = (x1 - t.x);
						const dy1 = (y1 - t.y);
						e.lineTo(t.to_x + dx1, t.to_y + dy1);

						e.lineTo(x1, y1);

						e.stroke();
						e.closePath();
						break;
					}
				}
			}
			// END MOD

			return e.restore(),
				s
		};

		d20.engine.drawMeasurements = function (e) {
			_.each(d20.engine.measurements, function(t) {
				if (t.pageid !== d20.Campaign.activePage().id)
					return;
				let n = {
					color: d20.Campaign.players.get(t.player).get("color"),
					to_x: t.to_x - d20.engine.currentCanvasOffset[0],
					to_y: t.to_y - d20.engine.currentCanvasOffset[1],
					x: t.x - d20.engine.currentCanvasOffset[0],
					y: t.y - d20.engine.currentCanvasOffset[1],
					flags: t.flags,
					hide: t.hide,
					waypoints: _.map(t.waypoints, e=>[e[0] - d20.engine.currentCanvasOffset[0], e[1] - d20.engine.currentCanvasOffset[1]])
					// BEGIN MOD
					,
					Ve: t.Ve ? JSON.parse(JSON.stringify(t.Ve)) : undefined
					// END MOD
				};
				k(e, n)
			}),
				e.restore()

			// BEGIN MOD
			const offset = (num, offset, xy) => {
				return (num + offset[xy]) - d20.engine.currentCanvasOffset[xy];
			};

			// unrelated code, but throw it in the render loop here
			let doRender = false;
			$.each(d20plus.engine._tempTopRenderLines, (id, toDraw) => {
				console.log("DRAWING", toDraw.ticks, toDraw.offset)
				e.beginPath();
				e.strokeStyle = window.currentPlayer.get("color");
				e.lineWidth = 2;

				const nuX = offset(toDraw.x - d20.engine.currentCanvasOffset[0], toDraw.offset, 0);
				const nuY = offset(toDraw.y - d20.engine.currentCanvasOffset[1], toDraw.offset, 1);
				const nuToX = offset(toDraw.to_x - d20.engine.currentCanvasOffset[0], toDraw.offset, 0);
				const nuToY = offset(toDraw.to_y - d20.engine.currentCanvasOffset[1], toDraw.offset, 1);

				e.moveTo(nuX, nuY);
				e.lineTo(nuToX, nuToY);

				e.moveTo(nuToX, nuY);
				e.lineTo(nuX, nuToY);

				e.stroke();
				e.closePath();

				toDraw.ticks--;
				doRender = true;
				if (toDraw.ticks <= 0) {
					delete d20plus.engine._tempTopRenderLines[id];
				}
			});
			if (doRender) {
				d20.engine.redrawScreenNextTick();
			}
			// END MOD
		}
		// END ROLL20 CODE
	};

	d20plus.mod.overwriteStatusEffects = function () {
		d20.engine.canvasDirty = true;
		d20.engine.canvasTopDirty = true;
		d20.engine.canvas._objects.forEach(it => {
			// avoid adding it to any objects that wouldn't have it to begin with
			if (!it.model || !it.model.view || !it.model.view.updateBackdrops) return;

			// BEGIN ROLL20 CODE
			it.model.view.updateBackdrops = function (e) {
				if (!this.nohud && ("objects" == this.model.get("layer") || "gmlayer" == this.model.get("layer")) && "image" == this.model.get("type") && this.model && this.model.collection && this.graphic) {
					// BEGIN MOD
					const scaleFact = (d20plus.cfg.get("canvas", "scaleNamesStatuses") && d20.Campaign.activePage().get("snapping_increment"))
						? d20.Campaign.activePage().get("snapping_increment")
						: 1;
					// END MOD
					var t = this.model.collection.page
						, n = e || d20.engine.canvas.getContext();
					n.save(),
					(this.graphic.get("flipX") || this.graphic.get("flipY")) && n.scale(this.graphic.get("flipX") ? -1 : 1, this.graphic.get("flipY") ? -1 : 1);
					var i = this
						, r = Math.floor(this.graphic.get("width") / 2)
						, o = Math.floor(this.graphic.get("height") / 2)
						, a = (parseFloat(t.get("scale_number")),
						this.model.get("statusmarkers").split(","));
					-1 !== a.indexOf("dead") && (n.strokeStyle = "rgba(189,13,13,0.60)",
						n.lineWidth = 10,
						n.beginPath(),
						n.moveTo(-r + 7, -o + 15),
						n.lineTo(r - 7, o - 5),
						n.moveTo(r - 7, -o + 15),
						n.lineTo(-r + 7, o - 5),
						n.closePath(),
						n.stroke()),
						n.rotate(-this.graphic.get("angle") * Math.PI / 180),
						n.strokeStyle = "rgba(0,0,0,0.65)",
						n.lineWidth = 1;
					var s = 0
						, l = i.model.get("bar1_value")
						, c = i.model.get("bar1_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar1") || this.model.currentPlayerControls() && this.model.get("playersedit_bar1"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 0;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar1_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke(),
							s++
					}
					var l = i.model.get("bar2_value")
						, c = i.model.get("bar2_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar2") || this.model.currentPlayerControls() && this.model.get("playersedit_bar2"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 12;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar2_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke(),
							s++
					}
					var l = i.model.get("bar3_value")
						, c = i.model.get("bar3_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar3") || this.model.currentPlayerControls() && this.model.get("playersedit_bar3"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 24;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar3_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke()
					}
					var h, p, g = 1, f = !1;
					switch (d20.Campaign.get("markers_position")) {
						case "bottom":
							h = o - 10,
								p = r;
							break;
						case "left":
							h = -o - 10,
								p = -r,
								f = !0;
							break;
						case "right":
							h = -o - 10,
								p = r - 18,
								f = !0;
							break;
						default:
							h = -o + 10,
								p = r
					}
					// BEGIN MOD
					n.strokeStyle = "white";
					n.lineWidth = 3 * scaleFact;
					const scaledFont = 14 * scaleFact;
					n.font = "bold " + scaledFont + "px Arial";
					// END MOD
					_.each(a, function (e) {
						var t = d20.token_editor.statusmarkers[e.split("@")[0]];
						if (!t)
							return !0;
						if ("dead" === e)
							return !0;
						var i = 0;
						if (g--,
						"#" === t.substring(0, 1))
							n.fillStyle = t,
								n.beginPath(),
								f ? h += 16 : p -= 16,
								n.arc(p + 8, f ? h + 4 : h, 6, 0, 2 * Math.PI, !0),
								n.closePath(),
								n.stroke(),
								n.fill(),
								i = f ? 10 : 4;
						else {
							// BEGIN MOD
							if (!d20.token_editor.statussheet_ready) return;
							const scaledWH = 21 * scaleFact;
							const scaledOffset = 22 * scaleFact;
							f ? h += scaledOffset : p -= scaledOffset;

							if (d20.engine.canvasZoom <= 1) {
								n.drawImage(d20.token_editor.statussheet_small, parseInt(t, 10), 0, 21, 21, p, h - 9, scaledWH, scaledWH);
							} else {
								n.drawImage(d20.token_editor.statussheet, parseInt(t, 10), 0, 24, 24, p, h - 9, scaledWH, scaledWH)
							}

							i = f ? 14 : 12;
							i *= scaleFact;
							// END MOD
						}
						if (-1 !== e.indexOf("@")) {
							var r = e.split("@")[1];
							// BEGIN MOD
							// bing backtick to "clear counter"
							if (r === "`") return;
							n.fillStyle = "rgb(222,31,31)";
							var o = f ? 9 : 14;
							o *= scaleFact;
							o -= (14 - (scaleFact * 14));
							n.strokeText(r + "", p + i, h + o);
							n.fillText(r + "", p + i, h + o);
							// END MOD
						}
					});
					var m = i.model.get("name");
					if ("" != m && 1 == this.model.get("showname") && (window.is_gm || this.model.get("showplayers_name") || this.model.currentPlayerControls() && this.model.get("playersedit_name"))) {
						n.textAlign = "center";
						// BEGIN MOD
						const fontSize = 14;
						var scaledFontSize = fontSize * scaleFact;
						const scaledY = 22 * scaleFact;
						const scaled6 = 6 * scaleFact;
						const scaled8 = 8 * scaleFact;
						n.font = "bold " + scaledFontSize + "px Arial";
						var v = n.measureText(m).width;

						/*
							Note(stormy): compatibility with R20ES's ScaleTokenNamesBySize module.
						 */
						if(window.r20es && window.r20es.drawNameplate) {
							window.r20es.drawNameplate(this.model, n, v, o, fontSize, m);
						} else {
							n.fillStyle = "rgba(255,255,255,0.50)";
							n.fillRect(-1 * Math.floor((v + scaled6) / 2), o + scaled8, v + scaled6, scaledFontSize + scaled6);
							n.fillStyle = "rgb(0,0,0)";
							n.fillText(m + "", 0, o + scaledY, v);
						}
						// END MOD
					}
					n.restore()
				}
			}
			// END ROLL20 CODE
		});
	};

	d20plus.mod.mouseEnterMarkerMenu = function () {
		var e = this;
		$(this).on("mouseover.statusiconhover", ".statusicon", function () {
			a = $(this).attr("data-action-type").replace("toggle_status_", "")
		}),
			$(document).on("keypress.statusnum", function (t) {
				// BEGIN MOD // TODO see if this clashes with keyboard shortcuts
				if ("dead" !== a && currentcontexttarget) {
					// END MOD
					var n = String.fromCharCode(t.which)
						,
						i = "" == currentcontexttarget.model.get("statusmarkers") ? [] : currentcontexttarget.model.get("statusmarkers").split(",")
						, r = (_.map(i, function (e) {
							return e.split("@")[0]
						}),
							!1);
					i = _.map(i, function (e) {
						return e.split("@")[0] == a ? (r = !0,
						a + "@" + n) : e
					}),
					r || ($(e).find(".statusicon[data-action-type=toggle_status_" + a + "]").addClass("active"),
						i.push(a + "@" + n)),
						currentcontexttarget.model.save({
							statusmarkers: i.join(",")
						})
				}
			})
	};

	// BEGIN ROLL20 CODE
	d20plus.mod.handleURL = function(e) {
		if (!($(this).hasClass("lightly") || $(this).parents(".note-editable").length > 0)) {
			var t = $(this).attr("href");
			if (void 0 === t)
				return !1;
			if (-1 !== t.indexOf("journal.roll20.net") || -1 !== t.indexOf("wiki.roll20.net")) {
				var n = t.split("/")[3]
					, i = t.split("/")[4]
					, o = d20.Campaign[n + "s"].get(i);
				if (o) {
					var r = o.get("inplayerjournals").split(",");
					(window.is_gm || -1 !== _.indexOf(r, "all") || window.currentPlayer && -1 !== _.indexOf(r, window.currentPlayer.id)) && o.view.showDialog()
				}
				return $("#existing" + n + "s").find("tr[data-" + n + "id=" + i + "]").trigger("click"),
					!1
			}
			var a = /(?:(?:http(?:s?):\/\/(?:app\.)?roll20(?:staging)?\.(?:net|local:5000)\/|^\/?)compendium\/)([^\/]+)\/([^\/#?]+)/i
				, s = t.match(a);
			if (s)
				return d20.utils.openCompendiumPage(s[1], s[2]),
					e.stopPropagation(),
					void e.preventDefault();
			if (-1 !== t.indexOf("javascript:"))
				return !1;
			if ("`" === t.substring(0, 1))
				return d20.textchat.doChatInput(t.substring(1)),
					!1;
			if ("!" === t.substring(0, 1))
				return d20.textchat.doChatInput(t),
					!1;
			if ("~" === t.substring(0, 1))
				return d20.textchat.doChatInput("%{" + t.substring(1, t.length) + "}"),
					!1;
			if (t !== undefined && ("external" === $(this).attr("rel") || -1 === t.indexOf("javascript:") && -1 !== t.indexOf("://"))) {
				// BEGIN MOD
				e.stopPropagation();
				e.preventDefault();
				window.open(t);
				// END MOD
			}
		}
	};
	// END ROLL20 CODE

	d20plus.mod._renderAll_middleLayers = new Set(["objects", "background", "foreground"]);
	// BEGIN ROLL20 CODE
	d20plus.mod.renderAll = function (e) {
		const t = e && e.context || this.contextContainer
			, n = this.getActiveGroup()
			, i = [d20.engine.canvasWidth / d20.engine.canvasZoom, d20.engine.canvasHeight / d20.engine.canvasZoom]
			, o = new d20.math.Rectangle(...d20.math.add(d20.engine.currentCanvasOffset,d20.math.div(i,2)),...i,0);
		n && !window.is_gm && (n.hideResizers = !0),
			this.clipTo ? fabric.util.clipContext(this, t) : t.save();
		const r = {
			map: [],
			// BEGIN MOD
			background: [],
			// END MOD
			walls: [],
			objects: [],
			// BEGIN MOD
			foreground: [],
			// END MOD
			gmlayer: []
			// BEGIN MOD
			, weather: []
			// END MOD
		};
		r[Symbol.iterator] = this._layerIteratorGenerator.bind(r, e);
		const a = e && e.tokens_to_render || this._objects;
		for (let e of a)
			if (e.model) {
				const t = e.model.get("layer");
				if (!r[t])
					continue;
				r[t].push(e)
			} else
				r[window.currentEditingLayer].push(e);
		for (const [i,a] of r) {
			switch (a) {
				case "grid":
					d20.canvas_overlay.drawGrid(t);
					continue;
				case "afow":
					d20.canvas_overlay.drawAFoW(d20.engine.advfowctx, d20.engine.work_canvases.floater.context);
					continue;
				case "gmlayer":
					t.globalAlpha = d20.engine.gm_layer_opacity;
					break;
				// BEGIN MOD
				case "background":
				case "foreground":
					if (d20plus.mod._renderAll_middleLayers.has(window.currentEditingLayer) && window.currentEditingLayer !== a && window.currentEditingLayer !== "objects") {
						t.globalAlpha = .45;
						break;
					}
				// END MOD
				case "objects":
					if ("map" === window.currentEditingLayer || "walls" === window.currentEditingLayer) {
						t.globalAlpha = .45;
						break
					}
				default:
					t.globalAlpha = 1
			}
			_.chain(i).filter(i=>{
				// BEGIN MOD
				// forcibly render foreground elements over everything
				// if (a === "foreground") return true;
				// END MOD

				let r;
				return n && i && n.contains(i) ? (i.renderingInGroup = n,
					i.hasControls = !1) : (i.renderingInGroup = null,
					i.hasControls = !0,
					"text" !== i.type && window.is_gm ? i.hideResizers = !1 : i.hideResizers = !0),
					e && e.invalid_rects ? (r = i.intersects([o]) && (i.needsToBeDrawn || i.intersects(e.invalid_rects)),
					!e.skip_prerender && i.renderPre && i.renderPre(t)) : (r = i.needsRender(o),
					(!e || !e.skip_prerender) && r && i.renderPre && i.renderPre(t, {
						should_update: !0
					})),
					r
				}
			).each(n=>{
				const i = "image" === n.type.toLowerCase() && n.model.controlledByPlayer(window.currentPlayer.id)
					, o = n._model && n._model.get("light_hassight")
					, r = e && e.owned_with_sight_auras_only;
				r && (!r || i && o) || this._draw(t, n),
					n.renderingInGroup = null
			})
		}
		return t.restore(),
			this
	};
	// END ROLL20 CODE

	// shoutouts to Roll20 for making me learn how `yield` works
	// BEGIN ROLL20 CODE
	d20plus.mod.layerIteratorGenerator = function*(e) { // e is just an options object
		yield[this.map, "map"],
		window.is_gm && "walls" === window.currentEditingLayer && (yield[this.walls, "walls"]);
		const t = e && e.grid_before_afow
			, n = !d20.Campaign.activePage().get("adv_fow_enabled") || e && e.disable_afow
			, i = !d20.Campaign.activePage().get("showgrid") || e && e.disable_grid;
		t && !i && (yield[null, "grid"]),
		!n && window.largefeats && (yield[null, "afow"]),
		t || i || (yield[null, "grid"]),
			// BEGIN MOD
			yield[this.background, "background"],
			// END MOD
			yield[this.objects, "objects"],
			// BEGIN MOD
			yield[this.foreground, "foreground"],
			// END MOD
		window.is_gm && (yield[this.gmlayer, "gmlayer"])
		// BEGIN MOD
		window.is_gm && "weather" === window.currentEditingLayer && (yield[this.weather, "weather"]);
		// END MOD
	};
	// END ROLL20 CODE

	// BEGIN ROLL20 CODE
	d20plus.mod.editingLayerOnclick = () => {
		$("#editinglayer").off(clicktype).on(clicktype, "li", function() {
			var e = $(this);
			$("#editinglayer").removeClass(window.currentEditingLayer);
			$("#drawingtools .choosepath").show();
			"polygon" !== d20.engine.mode && $("#drawingtools").hasClass("polygon") && $("#drawingtools").removeClass("polygon").addClass("path");

			// BEGIN MOD
			if (e.hasClass("chooseweather")) {
				window.currentEditingLayer = "weather";
				$("#drawingtools .choosepath").hide();
				"path" !== d20.engine.mode && $("#drawingtools").removeClass("path").addClass("polygon")
			} else {
				e.hasClass("choosebackground") ? window.currentEditingLayer = "background" : e.hasClass("chooseforeground") ? window.currentEditingLayer = "foreground" : e.hasClass("chooseobjects") ? window.currentEditingLayer = "objects" : e.hasClass("choosemap") ? window.currentEditingLayer = "map" : e.hasClass("choosegmlayer") ? window.currentEditingLayer = "gmlayer" : e.hasClass("choosewalls") && (window.currentEditingLayer = "walls",
					$("#drawingtools .choosepath").hide(),
				"path" !== d20.engine.mode && $("#drawingtools").removeClass("path").addClass("polygon"));
			}
			// END MOD
			$("#editinglayer").addClass(window.currentEditingLayer);
			$(document).trigger("d20:editingLayerChanged");
		});
	};
	// END ROLL20 CODE

	// prevent prototype methods from breaking some poorly-written property loops
	d20plus.mod.fixHexMethods = () => {
		try {
			// BEGIN ROLL20 CODE
			HT.Grid.prototype.GetHexAt = function(e) {
				// BEGIN MOD
				for (const t of this.Hexes)
					if (t.Contains(e))
						return t;
				// END MOD
				return null
			};
			// END ROLL20 CODE
		} catch (ignored) {
			console.error(ignored)
		}

		try {
			// BEGIN ROLL20 CODE
			HT.Grid.prototype.GetHexById = function(e) {
				// BEGIN MOD
				for (const t of this.Hexes)
					if (t.Id == e)
						return t;
				// END MOD
				return null
			};
			// END ROLL20 CODE
		} catch (ignored) {
			console.error(ignored)
		}
	};

	// prevent prototype methods from breaking some poorly-written property loops
	d20plus.mod.fixVideoMethods = () => {
		const arr = [];
		for (const k in arr) {
			const v = arr[k];
			if (typeof v === "function") {
				v.getReceiver = v.getReceiver || (() => null);
				v.getSender = v.getSender || (() => null);
			}
		}
	};
}

SCRIPT_EXTENSIONS.push(d20plusMod);


const baseTemplate = function () {
	d20plus.template = {};

	d20plus.template.swapTemplates = () => {
		d20plus.ut.log("Swapping templates...");
		$("#tmpl_charactereditor").html($(d20plus.template_charactereditor).html());
		$("#tmpl_handouteditor").html($(d20plus.template_handouteditor).html());
		$("#tmpl_deckeditor").html($(d20plus.template.deckeditor).html());
		$("#tmpl_cardeditor").html($(d20plus.template.cardeditor).html());
	};

	d20plus.settingsHtmlPtFooter = `<p>
			<a class="btn " href="#" id="button-edit-config" style="margin-top: 3px; width: calc(100% - 22px);">Edit Config</a>
			</p>
			<p>
			For help, advice, and updates, <a href="https://discord.gg/nGvRCDs" target="_blank" style="color: #08c;">join our Discord!</a>
			</p>
			<p>
			<a class="btn player-hidden" href="#" id="button-view-tools" style="margin-top: 3px; margin-right: 7px;">Open Tools List</a>
			<a class="btn" href="#" id="button-manage-qpi" style="margin-top: 3px;" title="It's like the Roll20 API, but even less useful">Manage QPI Scripts</a>
			</p>
			<style id="dynamicStyle"></style>
		`;

	d20plus.artTabHtml = `
	<p style="display: flex; width: 100%; justify-content: space-between;">
		<button class="btn" id="button-add-external-art" style="margin-right: 5px; width: 100%;">Manage External Art</button>
		<button class="btn" id="button-browse-external-art" style="width: 100%;">Browse Repo</button>
	</p>
	`;

	d20plus.addArtHTML = `
	<div id="d20plus-artfolder" title="External Art" style="position: relative">
	<p>Add external images by URL. Any direct link to an image should work.</p>
	<p>
	<input placeholder="Name*" id="art-list-add-name">
	<input placeholder="URL*" id="art-list-add-url">
	<a class="btn" href="#" id="art-list-add-btn">Add URL</a>
	<a class="btn" href="#" id="art-list-multi-add-btn">Add Multiple URLs...</a>
	<a class="btn btn-danger" href="#" id="art-list-delete-all-btn" style="margin-left: 12px;">Delete All</a>
	<p/>
	<hr>
	<div id="art-list-container">
	<input class="search" autocomplete="off" placeholder="Search list..." style="width: 100%;">
	<br>
	<p>
		<span style="display: inline-block; width: 40%; font-weight: bold;">Name</span>
		<span style="display: inline-block; font-weight: bold;">URL</span>
	</p>
	<ul class="list artlist" style="max-height: 600px; overflow-y: scroll; display: block; margin: 0; transform: translateZ(0);"></ul>
	</div>
	</div>`;

	d20plus.addArtMassAdderHTML = `
	<div id="d20plus-artmassadd" title="Mass Add Art URLs">
	<p>One entry per line; entry format: <b>[name]---[URL (direct link to image)]</b> <button class="btn" id="art-list-multi-add-btn-submit">Add URLs</button></p>
	<p><textarea id="art-list-multi-add-area" style="width: 100%; height: 100%; min-height: 500px;" placeholder="My Image---http://example.com/img1.png"></textarea></p>
	</div>`;

	d20plus.artListHTML = `
	<div id="Vetoolsresults">
	<ol class="dd-list" id="image-search-none"><div class="alert white">No results found in 5etools for those keywords.</div></ol>
	
	<ol class="dd-list" id="image-search-has-results">
		<li class="dd-item dd-folder Vetoolsresult">
			<div class="dd-content">
				<div class="folder-title">From 5etools</div>
			</div>
	
			<ol class="dd-list Vetoolsresultfolder" id="custom-art-results"></ol>
		</li>
	</ol>
	</div>`;

	d20plus.configEditorHTML = `
	<div id="d20plus-configeditor" title="Config Editor" style="position: relative">
	<!-- populate with js -->
	</div>`;

	d20plus.configEditorButtonBarHTML = `
	<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
	<div class="ui-dialog-buttonset">
		<button type="button" id="configsave" alt="Save" title="Save Config" class="btn" role="button" aria-disabled="false">
			<span>Save</span>
		</button>
	</div>
	</div>
	`;

	d20plus.tool.toolsListHtml = `
		<div id="d20-tools-list" title="Tools List" style="position: relative">
		<div class="tools-list">
		<!-- populate with js -->
		</div>
		</div>
		`;

	// no mods; just switched in to grant full features to non-pro
	d20plus.template_TokenEditor = `<script id='tmpl_tokeneditor' type='text/html'>
  <div class='dialog largedialog tokeneditor' style='display: block;'>
    <ul class='nav nav-tabs'>
      <li class='active'>
        <a data-tab='basic' href='javascript:void(0);'>Basic</a>
      </li>
      <li>
        <a data-tab='advanced' href='javascript:void(0);'>Advanced</a>
      </li>
    </ul>
    <div class='tab-content'>
      <div class='basic tab-pane'>
        <div style='float: left; width: 300px;'>
          <div style='float: right; margin-right: 85px; font-size: 1.2em; position: relative; top: -4px; cursor: help;'>
            <a class='showtip pictos' title='You can choose to have the token represent a Character from the Journal. If you do, the token&#39;s name, controlling players, and bar values will be based on the Character. Most times you&#39;ll just leave this set to None/Generic.'>?</a>
          </div>
          <label>Represents Character</label>
          <select class='represents'>
            <option value=''>None/Generic Token</option>
            <$ _.each(window.Campaign.activeCharacters(), function(char) { $>
            <option value="<$!char.id$>"><$!char.get("name")$></option>
            <$ }); $>
          </select>
          <div class='clear'></div>
          <div style='float: right; margin-right: 75px;'>
            <label>
              <input class='showname' type='checkbox' value='1'>
              Show nameplate?
            </label>
          </div>
          <label>Name</label>
          <input class='name' style='width: 210px;' type='text'>
          <div class='clear'></div>
          <label>Controlled By</label>
          <$ if(this.character) { $>
          <p>(Determined by Character settings)</p>
          <$ } else { $>
          <select class='controlledby selectize' multiple='true'>
            <option value='all'>All Players</option>
            <$ window.Campaign.players.each(function(player) { $>
            <option value="<$!player.id$>"><$!player.get("displayname")$></option>
            <$ }); $>
          </select>
          <$ } $>
          <div class='clear' style='height: 10px;'></div>
          <label>
            Tint Color
          </label>
          <input class='tint_color colorpicker' type='text'>
          <div class='clear'></div>
        </div>
        <div style='float: left; width: 300px;'>
          <label>
            <span class='bar_color_indicator' style='background-color: <$!window.Campaign.get('bar1_color')$>'></span>
            Bar 1
          </label>
          <div class='clear' style='height: 1px;'></div>
          <div class='inlineinputs' style='margin-top: 5px; margin-bottom: 5px;'>
            <input class='bar1_value' type='text'>
            /
            <input class='bar1_max' type='text'>
            <$ if(this.character) { $>
            <div style='float: right;'>
              <select class='bar1_link' style='width: 125px;'>
                <option value=''>None</option>
                <$ _.each(this.tokensettingsview.availAttribs(), function(attrib) { $>
                <option value="<$!attrib.id$>"><$!attrib.name$>
                  <$ }); $>
              </select>
              <a class='pictos showtip' style='font-size: 1.2em; position: relative; top: -5px; margin-left: 10px; cursor: help;' title='You can choose an Attribute from the Character this token represents. The values for this bar will be synced to the values of that Attribute.'>?</a>
            </div>
            <$ } $>
          </div>
          <span style='color: #888;'>(Leave blank for no bar)</span>
          <div class='clear'></div>
          <label>
            <span class='bar_color_indicator' style='background-color: <$!window.Campaign.get('bar2_color')$>'></span>
            Bar 2
          </label>
          <div class='inlineinputs' style='margin-top: 5px; margin-bottom: 5px;'>
            <input class='bar2_value' type='text'>
            /
            <input class='bar2_max' type='text'>
            <$ if(this.character) { $>
            <div style='float: right; margin-right: 30px;'>
              <select class='bar2_link' style='width: 125px;'>
                <option value=''>None</option>
                <$ _.each(this.tokensettingsview.availAttribs(), function(attrib) { $>
                <option value="<$!attrib.id$>"><$!attrib.name$>
                  <$ }); $>
              </select>
            </div>
            <$ } $>
          </div>
          <span style='color: #888;'>(Leave blank for no bar)</span>
          <div class='clear'></div>
          <label>
            <span class='bar_color_indicator' style='background-color: <$!window.Campaign.get('bar3_color')$>'></span>
            Bar 3
          </label>
          <div class='inlineinputs' style='margin-top: 5px; margin-bottom: 5px;'>
            <input class='bar3_value' type='text'>
            /
            <input class='bar3_max' type='text'>
            <$ if(this.character) { $>
            <div style='float: right; margin-right: 30px;'>
              <select class='bar3_link' style='width: 125px;'>
                <option value=''>None</option>
                <$ _.each(this.tokensettingsview.availAttribs(), function(attrib) { $>
                <option value="<$!attrib.id$>"><$!attrib.name$>
                  <$ }); $>
              </select>
            </div>
            <$ } $>
          </div>
          <span style='color: #888;'>(Leave blank for no bar)</span>
          <div class='clear' style='height: 10px;'></div>
          <div style='float: left; width: 130px;'>
            <div style='float: right;'>
              <label>
                <input class='aura1_square' type='checkbox'>
                Square
              </label>
            </div>
            <label>
              Aura 1
            </label>
            <div class='inlineinputs' style='margin-top: 5px;'>
              <input class='aura1_radius' type='text'>
              <$!window.Campaign.activePage().get("scale_units")$>.
              <input class='aura1_color colorpicker' type='text'>
            </div>
          </div>
          <div style='float: left; width: 130px; margin-left: 20px;'>
            <div style='float: right;'>
              <label>
                <input class='aura2_square' type='checkbox'>
                Square
              </label>
            </div>
            <label>
              Aura 2
            </label>
            <div class='inlineinputs' style='margin-top: 5px;'>
              <input class='aura2_radius' type='text'>
              <$!window.Campaign.activePage().get("scale_units")$>.
              <input class='aura2_color colorpicker' type='text'>
            </div>
          </div>
          <div class='clear'></div>
        </div>
        <div class='clear'></div>
        <hr>
        <h4>
          GM Notes
          <span style='font-weight: regular; font-size: 0.9em;'>(Only visible to GMs)</span>
        </h4>
        <textarea class='gmnotes summernote'></textarea>
        <div class='clear'></div>
        <label>&nbsp;</label>
      </div>
      <div class='advanced tab-pane'>
        <div class='row-fluid'>
          <div class='span6'>
            <h4>Player Permissions</h4>
            <div style='margin-left: 5px;'>
              <div class='permission_section'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Name</label>
                  <label>
                    <input class='showplayers_name' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_name' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
              </div>
              <hr>
              <div class='permission_section bar1'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Bar 1</label>
                  <label>
                    <input class='showplayers_bar1' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_bar1' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
                <label class='bar_val_permission'>
                  Text Overlay:
                  <select class='bar1options'>
                    <option value='hidden'>
                      Hidden
                    </option>
                    <option selected value='editors'>
                      Visible to Editors
                    </option>
                    <option value='everyone'>
                      Visible to Everyone
                    </option>
                  </select>
                </label>
              </div>
              <hr>
              <div class='permission_section bar2'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Bar 2</label>
                  <label>
                    <input class='showplayers_bar2' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_bar2' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
                <label class='bar_val_permission'>
                  Text Overlay:
                  <select class='bar2options'>
                    <option value='hidden'>
                      Hidden
                    </option>
                    <option selected value='editors'>
                      Visible to Editors
                    </option>
                    <option value='everyone'>
                      Visible to Everyone
                    </option>
                  </select>
                </label>
              </div>
              <hr>
              <div class='permission_section bar3'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Bar 3</label>
                  <label>
                    <input class='showplayers_bar3' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_bar3' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
                <label class='bar_val_permission'>
                  Text Overlay:
                  <select class='bar3options'>
                    <option value='hidden'>
                      Hidden
                    </option>
                    <option selected value='editors'>
                      Visible to Editors
                    </option>
                    <option value='everyone'>
                      Visible to Everyone
                    </option>
                  </select>
                </label>
                <div class='clear'></div>
              </div>
              <hr>
              <div class='permission_section barLocation'>
                <label class='movable_token_bar'>
                  Bar Location:
                  <select>
                    <option selected value='above'>
                      Above
                    </option>
                    <option value='overlap_top'>
                      Top Overlapping
                    </option>
                    <option value='overlap_bottom'>
                      Bottom Overlapping
                    </option>
                    <option value='below'>
                      Below
                    </option>
                  </select>
                  <a class='showtip pictos' style='padding-left: 26px;' title='&lt;b&gt;Above:&lt;/b&gt; &lt;br&gt; All bars are above the token. (Default for new games) &lt;br&gt; &lt;b&gt;Top Overlapping:&lt;/b&gt; &lt;br&gt; The bottom-most bar overlaps the top of the token. Other bars float above it. &lt;br&gt; &lt;b&gt;Bottom Overlapping:&lt;/b&gt; &lt;br&gt; Bars fill the token from the bottom up. &lt;br&gt; &lt;b&gt;Below:&lt;/b&gt; &lt;br&gt; All bars are below the token.'>?</a>
                </label>
                <label class='compact_bar'>
                  Bar Style:
                  <div class='radio'>
                    <label>
                      <input name='barStyle' type='radio' value='standard'>
                      Standard
                    </label>
                  </div>
                  <div class='radio'>
                    <label style='width:50px;'>
                      <input name='barStyle' type='radio' value='compact'>
                      Compact
                    </label>
                  </div>
                  <a class='showtip pictos' id='barstyletip' title='&lt;b&gt;Standard:&lt;/b&gt;&lt;br&gt; Full sized token bar, displays text overlays. &lt;br&gt; &lt;b&gt;Compact:&lt;/b&gt; &lt;br&gt;Narrow token bars. No text overlay.'>?</a>
                </label>
              </div>
              <hr>
              <div class='permission_section'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Aura 1</label>
                  <label>
                    <input class='showplayers_aura1' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_aura1' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
              </div>
              <hr>
              <div class='permission_section'>
                <div class='inlineinputs'>
                  <label class='permissions_category'>Aura 2</label>
                  <label>
                    <input class='showplayers_aura2' type='checkbox'>
                    See
                  </label>
                  <label>
                    <input class='playersedit_aura2' type='checkbox'>
                    Edit
                  </label>
                </div>
                <div class='clear'></div>
              </div>
              <hr>
              <small style='text-align: left; font-size: 0.9em;'>
                See: All Players can view
                <br>
                Edit: Controlling players can view and change
              </small>
            </div>
            <div class='clear'></div>
          </div>
          <div class='span6'>
            <h4>Emits Light</h4>
            <div class='inlineinputs' style='margin-top: 5px; margin-bottom: 5px;'>
              <input class='light_radius' type='text'>
              <$!window.Campaign.activePage().get("scale_units")$>.
              <input class='light_dimradius' type='text'>
              <$!window.Campaign.activePage().get("scale_units")$>.
              <input class='light_angle' placeholder='360' type='text'>
              <span style='font-size: 2.0em;'>&deg;</span>
            </div>
            <span style='color: #888; padding-left: 5px;'>Light Radius / (optional) Start of Dim / Angle</span>
            <div class='inlineinputs' style='margin-top: 5px;'>
              <label style='margin-left: 7px;'>
                <input class='light_otherplayers' type='checkbox'>
                All Players See Light
              </label>
            </div>
            <div class='inlineinputs' style='margin-top: 2px;'>
              <label style='margin-left: 7px;'>
                <input class='light_hassight' type='checkbox'>
                Has Sight
              </label>
              <span style="margin-left: 9px; margin-right: 28px;">/</span>
              Angle:
              <input class='light_losangle' placeholder='360' type='text'>
              <span style='font-size: 2.0em;'>&deg;</span>
            </div>
            <div class='inlineinputs' style='margin-left: 90px; margin-top: 5px;'>
              <span style="margin-left: 8px; margin-right: 12px;">/</span>
              Multiplier:
              <input class='light_multiplier' placeholder='1.0' style='margin-right: 10px;' type='text'>x</input>
            </div>
            <h4>Advanced Fog of War</h4>
            <div class='inlineinputs' style='margin-top: 5px; margin-bottom: 5px;'>
              <input class='advfow_viewdistance' type='text'>
              <$!window.Campaign.activePage().get("scale_units")$>.
            </div>
            <span style='color: #888; padding-left: 5px;'>Reveal Distance</span>
            <!-- %h4 -->
            <!-- Token Actions -->
            <!-- %a.pictos.showtip(style="margin-left: 15px; cursor: help; font-size: 1.1em; position: relative; top: -2px;" title="Choose from Macros and Abilities of linked Character to show when token is selected") ? -->
            <!-- %p -->
            <!-- %strong Add New Token Action: -->
            <!-- %br -->
            <!-- %select.chosen(placeholder="Choose from the list...") -->
            <!-- %option(value="") Choose from the list... -->
            <!-- <$ if(this.character) { $> -->
            <!-- <optgroup label="Abilities"> -->
            <!-- <$ this.character.abilities.each(function(abil) { $> -->
            <!-- <option value="ability|<$!abil.get('id')$>"><$!abil.get('name')$></option> -->
            <!-- <$ }); $> -->
            <!-- </optgroup> -->
            <!-- <$ } $> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</script>
	`;

	d20plus.template_pageSettings = `
	<script id="tmpl_pagesettings" type="text/html">
		<label style='padding-top: 4px;'>
			<strong>Page Size</strong>
		</label>
		<!-- BEGIN MOD -->
		X: <input type="number" class="width" style="width: 50px;" value="<$!this.model.get("width")$>" /> un. (<$!this.model.get("width") * 70$> px)
		<div style="margin-left: 110px; margin-top: 2px;">Y: <input type="number" class="height" style="width: 50px;" value="<$!this.model.get("height")$>" /> un. (<$!this.model.get("height") * 70$> px)</div>
		<!-- END MOD -->
		<small style='display: block; font-size: 0.9em; margin-left: 110px;'>width by height, 1 unit = 70 pixels</small>
		<div class='clear' style='height: 15px;'></div>
		<label style='margin-left: 55px; position: relative; top: 6px;'><strong>Scale:</strong> 1 unit =</label>
		<input type="number" class="scale_number" style="width: 35px;" value="<$!this.model.get("scale_number")$>" />
		<select class='scale_units' style='width: 65px; position: relative;'>
			<option value='ft'>ft.</option>
			<option value='m'>m.</option>
			<option value='km'>km.</option>
			<option value='mi'>mi.</option>
			<option value='in'>in.</option>
			<option value='cm'>cm.</option>
			<option value='un'>un.</option>
			<option value='hex'>hex</option>
			<option value='sq'>sq.</option>
			<option value='custom'>Custom...</option>
		</select>
		<div class='hidden' id='custom_scale_units'>
			<label style='margin-left: 55px; position: relative; top: 6px;'><strong>Custom Unit</strong></label>
			<input style='width: 60px;' type='text'>
		</div>
		<div class='clear' style='height: 15px;'></div>
		<label>
			<strong>Background</strong>
		</label>
		<input class='pagebackground' type='text'>
		<hr>
		<div data-feature_enabled='showgrid' id='grid_settings'>
			<label style='position: relative; top: 8px;'>
				<strong>Grid</strong>
			</label>
			<input class='gridenabled' type='checkbox' value='1'>
			<label class='checkbox'>&nbsp; Enabled, Size:</label>
			<input type="number" class="snappingincrement" style="width: 35px;" value="<$!this.model.get("snapping_increment")$>" /> units
			<div class='clear' style='height: 7px;'></div>
			<label style='margin-left: 55px; position: relative; top: 4px;'>Type</label>
			<select id='gridtype' style='width: 100px;'>
				<option selected value='square'>Square</option>
				<option value='hex'>Hex (V)</option>
				<option value='hexr'>Hex (H)</option>
			</select>
			<div class='clear' style='height: 7px;'></div>
			<label class='checkbox' id='hexlabels' style='margin-left: 130px;'>
				<input class='gridlabels' type='checkbox' value='1'>&nbsp; Show Labels</input>
			</label>
			<div class='clear' style='height: 2px;'></div>
			<label style='margin-left: 55px; position: relative; top: 4px;'>
				<a class='showtip pictos' href='https://wiki.roll20.net/Ruler' target='_blank'>?</a>
				Measurement
			</label>
			<select id='diagonaltype' style='width: 100px;'>
				<option class='squareonly' selected value='foure'>D&D 5E/4E Compatible</option>
				<option class='squareonly' value='threefive'>Pathfinder/3.5E Compatible</option>
				<option class='squareonly' value='manhattan'>Manhattan</option>
				<option class='hexonly' value='hex'>Hex Path</option>
				<option value='pythagorean'>Euclidean</option>
			</select>
			<div class='clear' style='height: 10px;'></div>
			<label style='margin-left: 55px;'>Color</label>
			<input class='gridcolor' type='text'>
			<div class='clear' style='height: 7px;'></div>
			<label style='margin-left: 55px;'>Opacity</label>
			<div class='gridopacity'></div>
		</div>
		<div class='clear' style='height: 10px'></div>
		<hr>
		<!-- BEGIN MOD -->
		<label style='position: relative; top: -2px;'>
			<strong>Weather</strong>
		</label>
		<button class='btn Ve-btn-weather'>
			Configure
		</button>
		<hr>
		<!-- END MOD -->
		<div class='lighting_feature' data-feature_enabled='showdarkness' id='fog_settings'>
			<label class='feature_name'>
				<strong>Fog of War</strong>
			</label>
			<div class='feature_options'>
				<input class='darknessenabled feature_enabled' type='checkbox' value='1'>
				<label class='checkbox'>&nbsp; Enabled</label>
			</div>
		</div>
		<div class='lighting_feature' data-feature_enabled='adv_fow_enabled' id='afow_settings'>
			<!-- BEGIN MOD -->
			<hr>
			<strong style="display: block; margin-bottom: 10px;"><i>Requires a paid subscription or all players to use a betteR20 script</i></strong>
			<!-- END MOD -->
			<label class='feature_name'>
				<strong>Advanced Fog of War</strong>
			</label>
			<div class='feature_options'>
				<input class='advancedfowenabled feature_enabled showtip' type='checkbox' value='1'>
				<label class='checkbox'>&nbsp; Enabled</label>
				<div class='subsettings'>
					<div id='afow_grid_size'>
						Size:
						<input type="number" class="advancedfowgridsize" style="width: 30px; margin-bottom: 3px;" value="<$!this.model.get("adv_fow_grid_size")$>" />
						units
					</div>
					<div>
						<input class='advancedfowshowgrid showtip' title='By default the Advanced Fog of War hides the map grid anywhere revealed but the player can no longer see because of Dynamic Lighting. This option makes the grid always visible.' type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Show Grid</label>
					</div>
					<div>
						<input class='dimlightreveals showtip' title='By default the Advanced Fog of War will not be permanently revealed by Dynamic Lighting that is not bright. This option allows dim lighting to also reveal the fog.' type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Dim Light Reveals</label>
					</div>
					<div>
						<input class='showtip' id='afow_gm_see_all' title='By default, Advanced Fog of War is only revealed by tokens with sight that are controlled by at least one player.&lt;br&gt;This option allows tokens with sight which are not controlled by anyone to reveal Advanced Fog of War for the GM only.' type='checkbox' value='0'>
						<label class='checkbox'>&nbsp; All Tokens Reveal (GM)</label>
					</div>
				</div>
			</div>
		</div>
		<div class='lighting_feature' data-feature_enabled='showlighting' id='dynamic_lighting_settings'>
			<label class='feature_name'>
				<strong>Dynamic Lighting</strong>
			</label>
			<div class='feature_options'>
				<input class='lightingenabled feature_enabled showtip' type='checkbox' value='1'>
				<label class='checkbox'>&nbsp; Enabled</label>
				<div class='subsettings'>
					<div>
						<input class='lightenforcelos showtip' title="Player's line of sight set by what tokens they can control." type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Enforce Line of Sight</label>
					</div>
					<div>
						<input class='lightingupdate' type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Only Update on Drop</label>
					</div>
					<div>
						<input class='lightrestrictmove showtip' title="Don't allow player tokens to move through Dynamic Lighting walls. Can be enabled even if lighting is not used." type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Restrict Movement</label>
					</div>
					<div>
						<input class='lightglobalillum showtip' title='Instead of darkness show light in all places players can see.' type='checkbox' value='1'>
						<label class='checkbox'>&nbsp; Global Illumination</label>
					</div>
				</div>
			</div>
		</div>
		<div id='gm_darkness_opacity'>
			<label class='feature_name'>
				<strong>Darkness Opacity (GM)</strong>
			</label>
			<div class='fogopacity showtip' title='The GM can see through dark areas hidden from the players when using Fog of War, Advanced Fog of War, and/or Dynamic Lighting. This setting adjusts the opacity of those dark areas for the GM only.'></div>
		</div>
		<div class='clear'></div>
		<hr>
		<label style='font-weight: bold;'>Play on Load</label>
		<select class='pagejukeboxtrigger' style='width: 180px;'></select>
		<div class='clear'></div>
		<hr>
		<button class='delete btn btn-danger' style='float: right;'>
			Delete Page
		</button>
		<button class='archive btn'>
			Archive Page
		</button>
		<div class='clear'></div>
	</script>
	`;

	d20plus.template_actionsMenu = `
		<script id='tmpl_actions_menu' type='text/html'>
			<div class='actions_menu d20contextmenu'>
				<ul>
					<$ if (Object.keys(this).length === 0) { $>
						<li data-action-type='unlock-tokens'>Unlock...</li>
					<$ } $>
					<$ if(this.view && this.view.graphic.type == "image" && this.get("cardid") !== "") { $>
						<li class='head hasSub' data-action-type='takecard'>Take Card</li>
						<li class='head hasSub' data-action-type='flipcard'>Flip Card</li>
					<$ } $>
					<$ if(window.is_gm) { $>
						<$ if(this.view && this.get("isdrawing") === false && window.currentEditingLayer != "map") { $>
							<!-- BEGIN MOD -->
							<li class='head hasSub' data-menuname='massroll'>
								Mass Roll &raquo;
								<ul class='submenu' data-menuname='massroll'>
									<li class='head hasSub' data-action-type='rollinit'>Initiative</li>
									<li class='head hasSub' data-action-type='rollsaves'>Save</li>
									<li class='head hasSub' data-action-type='rollskills'>Skill</li>
								</ul>
							</li>
							<!-- END MOD -->
							<li class='head hasSub' data-action-type='addturn'>Add Turn</li>
						<$ } $>
						<!-- BEGIN MOD -->
						<!-- <li class='head'>Edit</li> -->
						<!-- END MOD -->
						<$ if(this.view) { $>
							<li data-action-type='delete'>Delete</li>
							<li data-action-type='copy'>Copy</li>
						<$ } $>
						<li data-action-type='paste'>Paste</li>
						<!-- BEGIN MOD -->
						<$ if(!this.view) { $>
							<li data-action-type='undo'>Undo</li>
						<$ } $>
						<!-- END MOD -->
						
						<!-- BEGIN MOD -->          
						<$ if(this.view) { $>
							<li class='head hasSub' data-menuname='move'>
							Move &raquo;
								<ul class='submenu' data-menuname='move'>
									<li data-action-type='tofront'>To Front</li>
									<li data-action-type='forward-one'>Forward One<!-- (B-F)--></li>
									<li data-action-type='back-one'>Back One<!-- (B-B)--></li>
									<li data-action-type='toback'>To Back</li>    
								</ul>
							</li>
						<$ } $>
						
						<li class='head hasSub' data-menuname='VeUtil'>
							Utilities &raquo;
							<ul class='submenu' data-menuname='VeUtil'>
								<li data-action-type='util-scenes'>Start Scene</li>
								<$ if(this.get && this.get("type") == "image") { $>
									<div class="ctx__divider"></div>
									<li data-action-type='token-animate'>Animate</li>
									<li data-action-type='token-fly'>Set&nbsp;Flight&nbsp;Height</li>        
									<li data-action-type='token-light'>Set&nbsp;Light</li>
								<$ } $>
							</ul>
						</li>
						<!-- END MOD -->
						
						<li class='head hasSub' data-menuname='advanced'>
							Advanced &raquo;
							<ul class='submenu' data-menuname='advanced'>
								<li data-action-type='group'>Group</li>
								<li data-action-type='ungroup'>Ungroup</li>
								<$ if(this.get && this.get("type") == "image") { $>
									<li class="<$ if (this && this.get("isdrawing")) { $>active<$ } $>" data-action-type="toggledrawing">Is Drawing</li>
									<li class="<$ if (this && this.get("fliph")) { $>active<$ } $>" data-action-type="togglefliph">Flip Horizontal</li>
									<li class="<$ if (this && this.get("flipv")) { $>active<$ } $>" data-action-type="toggleflipv">Flip Vertical</li>
									<li data-action-type='setdimensions'>Set Dimensions</li>
									<$ if(window.currentEditingLayer == "map") { $>
										<li data-action-type='aligntogrid'>Align to Grid</li>
									<$ } $>
								<$ } $>
								
								<$ if(this.view) { $>
									<li data-action-type='lock-token'>Lock/Unlock Position</li>
								<$ } $>
								
								<$ if(this.get && this.get("type") == "image") { $>
									<li data-action-type='copy-tokenid'>View Token ID</li>
								<$ } $>
								<$ if(this.get && this.get("type") == "path") { $>
									<li data-action-type='copy-pathid'>View Path ID</li>
								<$ } $>
							</ul>
						</li>

						<li class='head hasSub' data-menuname='positioning'>
							Layer &raquo;
							<ul class='submenu' data-menuname='positioning'>
								<li data-action-type="tolayer_map" class='<$ if(this && this.get && this.get("layer") == "map") { $>active<$ } $>'><span class="pictos ctx__layer-icon">@</span> Map Layer</li>
								<!-- BEGIN MOD -->
								<li data-action-type="tolayer_background" class='<$ if(this && this.get && this.get("layer") == "background") { $>active<$ } $>'><span class="pictos ctx__layer-icon">a</span> Background Layer</li>
								<!-- END MOD -->
								<li data-action-type="tolayer_objects" class='<$ if(this && this.get && this.get("layer") == "objects") { $>active<$ } $>'><span class="pictos ctx__layer-icon">b</span> Token Layer</li>
								<!-- BEGIN MOD -->
								<li data-action-type="tolayer_foreground" class='<$ if(this && this.get && this.get("layer") == "foreground") { $>active<$ } $>'><span class="pictos ctx__layer-icon">B</span> Foreground Layer</li>
								<!-- END MOD -->
								<li data-action-type="tolayer_gmlayer" class='<$ if(this && this.get && this.get("layer") == "gmlayer") { $>active<$ } $>'><span class="pictos ctx__layer-icon">E</span> GM Layer</li>
								<li data-action-type="tolayer_walls" class='<$ if(this && this.get && this.get("layer") == "walls") { $>active<$ } $>'><span class="pictostwo ctx__layer-icon">r</span> Lighting Layer</li>
								<!-- BEGIN MOD -->
								<li data-action-type="tolayer_weather" class='<$ if(this && this.get && this.get("layer") == "weather") { $>active<$ } $>'><span class="pictos ctx__layer-icon">C</span> Weather Layer</li>
								<!-- END MOD -->
							</ul>
						</li>
					<$ } $>

					<$ if(this.view && this.get && this.get("sides") !== "" && this.get("cardid") === "") { $>
						<li class='head hasSub' data-menuname='mutliside'>
							Multi-Sided &raquo;
							<ul class='submenu' data-menuname='multiside'>
								<li data-action-type='side_random'>Random Side</li>
								<li data-action-type='side_choose'>Choose Side</li>
								<li data-action-type='rollertokenresize'>Set Side Size</li>
							</ul>
						</li>
					<$ } $>
				</ul>
			</div>
		</script>
		`;

	d20plus.template_charactereditor = `<script id='tmpl_charactereditor' type='text/html'>
  <div class='dialog largedialog charactereditor' style='display: block;'>
    <div class='tab-content'>
      <div class='bioinfo tab-pane'>
        <div class='row-fluid'>
          <div class='span5'>
            <label>
              <strong>Avatar</strong>
            </label>
            <$ if(true) { $>
            <div class="avatar dropbox <$! this.get("avatar") != "" ? "filled" : "" $>" style="width: 95%;">
            <div class="status"></div>
            <div class="inner">
              <$ if(this.get("avatar") == "") { $>
              <h4 style="padding-bottom: 0px; marigin-bottom: 0px; color: #777;">Drop a file from your <br>Art Library or computer<small>(JPG, GIF, PNG, WEBM, WP4)</small></h4>
              <br /> or
              <button class="btn">Click to Upload</button>
              <input class="manual" type="file" />
              <$ } else { $>
              <$ if(/.+\\.webm(\\?.*)?$/i.test(this.get("avatar"))) { $>
              <video src="<$!this.get("avatar")$>" draggable="false" muted autoplay loop />
              <$ } else { $>
              <img src="<$!this.get("avatar")$>" draggable="false" />
              <$ } $>
              <div class='remove'><a href='#'>Remove</a></div>
              <$ } $>
            </div>
          </div>
          <$ } else { $>
          <div class='avatar'>
            <$ if(this.get("avatar") != "") { $>
            <img src="<$!this.get("avatar")$>" draggable="false" />
            <$ } $>
          </div>
          <$ } $>
          <div class='clear'></div>
          <!-- BEGIN MOD -->
          <button class="btn character-image-by-url">Set Image from URL</button>
          <div class='clear'></div>
          <!-- END MOD -->
          <$ if (window.is_gm) { $>
          <label>
            <strong>Default Token (Optional)</strong>
          </label>
          <div class="defaulttoken tokenslot <$! this.get("defaulttoken") !== "" ? "filled" : "" $> style="width: 95%;">
          <$ if(this.get("defaulttoken") !== "") { $>
          <img src="" draggable="false" />
          <div class="remove"><a href="#">Remove</a></div>
          <$ } else { $>
          <button class="btn">Use Selected Token</button>
          <small>Select a token on the tabletop to use as the Default Token</small>
          <$ } $>
        </div>
        <!-- BEGIN MOD -->
        <button class="btn token-image-by-url">Set Token Image from URL</button>
        <small style="text-align: left;">(Update will only be visible upon re-opening the sheet)</small>
        <div class='clear'></div>
        <!-- END MOD -->
        <$ } $>
      </div>
      <div class='span7'>
        <label>
          <strong>Name</strong>
        </label>
        <input class='name' type='text'>
        <div class='clear'></div>
        <$ if(window.is_gm) { $>
        <label>
          <strong>In Player's Journals</strong>
        </label>
        <select class='inplayerjournals selectize' multiple='true' style='width: 100%;'>
          <option value="all">All Players</option>
          <$ window.Campaign.players.each(function(player) { $>
          <option value="<$!player.id$>"><$!player.get("displayname")$></option>
          <$ }); $>
        </select>
        <div class='clear'></div>
        <label>
          <strong>Can Be Edited &amp; Controlled By</strong>
        </label>
        <select class='controlledby selectize' multiple='true' style='width: 100%;'>
          <option value="all">All Players</option>
          <$ window.Campaign.players.each(function(player) { $>
          <option value="<$!player.id$>"><$!player.get("displayname")$></option>
          <$ }); $>
        </select>
        <div class='clear'></div>
        <label>
          <strong>Tags</strong>
        </label>
        <input class='tags'>
        <div class='clear'></div>
        <hr>
        <button class='delete btn btn-danger' style='float: right;'>
          Delete
        </button>
        <button class='duplicate btn' style='margin-right: 10px;'>
          Duplicate
        </button>
        <button class='archive btn'>
          <$ if(this.get("archived")) { $>Restore from Archive<$ } else { $>Archive<$ } $>
        </button>
        <div class='clear'></div>
        <$ } $>
        <div class='clear'></div>
      </div>
    </div>
    <div class='row-fluid'>
      <div class='span12'>
        <hr>
        <label>
          <strong>Bio & Info</strong>
        </label>
        <textarea class='bio'></textarea>
        <div class='clear'></div>
        <$ if(window.is_gm) { $>
        <label>
          <strong>GM Notes (Only visible to GM)</strong>
        </label>
        <textarea class='gmnotes'></textarea>
        <div class='clear'></div>
        <$ } $>
      </div>
    </div>
  </div>
  </div>
  </div>
</script>
		`;

	d20plus.template_handouteditor = `<script id='tmpl_handouteditor' type='text/html'>
  <div class='dialog largedialog handouteditor' style='display: block;'>
    <div class='row-fluid'>
      <div class='span12'>
        <label>
          <strong>Name</strong>
        </label>
        <input class='name' type='text'>
        <div class='clear'></div>
        <$ if (window.is_gm) { $>
        <label>
          <strong>In Player's Journals</strong>
        </label>
        <select class='inplayerjournals chosen' multiple='true' style='width: 100%;'>
          <option value="all">All Players</option>
          <$ window.Campaign.players.each(function(player) { $>
          <option value="<$!player.id$>"><$!player.get("displayname")$></option>
          <$ }); $>
        </select>
        <div class='clear'></div>
        <label>
          <strong>Can Be Edited By</strong>
        </label>
        <select class='controlledby chosen' multiple='true' style='width: 100%;'>
          <option value="all">All Players</option>
          <$ window.Campaign.players.each(function(player) { $>
          <option value="<$!player.id$>"><$!player.get("displayname")$></option>
          <$ }); $>
        </select>
        <div class='clear'></div>
        <label>
          <strong>Tags</strong>
        </label>
        <input class='tags'>
        <div class='clear'></div>
        <$ } $>
      </div>
    </div>
    <div class='row-fluid'>
      <div class='span12'>
        <div class="avatar dropbox <$! this.get("avatar") != "" ? "filled" : "" $>">
        <div class="status"></div>
        <div class="inner">
          <$ if(this.get("avatar") == "") { $>
          <h4 style="padding-bottom: 0px; marigin-bottom: 0px; color: #777;">Drop a file</h4>
          <br /> or
          <button class="btn">Choose a file...</button>
          <input class="manual" type="file" />
          <$ } else { $>
          <$ if(/.+\\.webm(\\?.*)?$/i.test(this.get("avatar"))) { $>
          <video src="<$!this.get("avatar")$>" draggable="false" muted autoplay loop />
          <$ } else { $>
          <img src="<$!this.get("avatar")$>" />
          <$ } $>
          <div class='remove'><a href='#'>Remove</a></div>
          <$ } $>
        </div>
      </div>
      <div class='clear'></div>
    </div>
  </div>
  <!-- BEGIN MOD -->
  <div class='row-fluid'>
  <button class="btn handout-image-by-url">Set Image from URL</button>
  <div class='clear'></div>
  </div>
  <!-- END MOD -->
  <div class='row-fluid'>
    <div class='span12'>
      <label>
        <strong>Description & Notes</strong>
      </label>
      <textarea class='notes'></textarea>
      <div class='clear'></div>
      <$ if(window.is_gm) { $>
      <label>
        <strong>GM Notes (Only visible to GM)</strong>
      </label>
      <textarea class='gmnotes'></textarea>
      <div class='clear'></div>
      <hr>
      <button class='delete btn btn-danger' style='float: right;'>
        Delete Handout
      </button>
      <button class='duplicate btn' style='margin-right: 10px;'>
        Duplicate
      </button>
      <button class='archive btn'>
        <$ if(this.get("archived")) { $>Restore Handout from Archive<$ } else { $>Archive<$ } $>
      </button>
      <div class='clear'></div>
      <$ } $>
    </div>
  </div>
  </div>
</script>
<script id='tmpl_handoutviewer' type='text/html'>
  <div class='dialog largedialog handoutviewer' style='display: block;'>
    <div style='padding: 10px;'>
      <$ if(this.get("avatar") != "") { $>
      <div class='row-fluid'>
        <div class='span12'>
          <div class='avatar'>
            <a class="lightly" target="_blank" href="<$!(this.get("avatar").indexOf("d20.io/") !== -1 ? this.get("avatar").replace(/\\/med\\.(?!webm)/, "/max.") : this.get("avatar"))$>">
            <$ if(/.+\\.webm(\\?.*)?$/i.test(this.get("avatar"))) { $>
            <video src="<$!this.get("avatar")$>" draggable="false" loop muted autoplay />
            <$ } else { $>
            <img src="<$!this.get("avatar")$>" draggable="false" />
            <$ } $>
            <div class='mag-glass pictos'>s</div></a>
            </a>
          </div>
          <div class='clear'></div>
        </div>
      </div>
      <$ } $>
      <div class='row-fluid'>
        <div class='span12'>
          <div class='content note-editor notes'></div>
          <div class='clear'></div>
        </div>
      </div>
      <$ if(window.is_gm) { $>
      <div class='row-fluid'>
        <div class='span12'>
          <hr>
          <label>
            <strong>GM Notes (Only visible to GM)</strong>
          </label>
          <div class='content note-editor gmnotes'></div>
          <div class='clear'></div>
        </div>
      </div>
      <$ } $>
    </div>
  </div>
</script>
	`;

	d20plus.template.deckeditor = `
	<script id='tmpl_deckeditor' type='text/html'>
      <div class='dialog largedialog deckeditor' style='display: block;'>
        <label>Name</label>
        <input class='name' type='text'>
        <div class='clear' style='height: 14px;'></div>
        <label>
          <input class='showplayers' type='checkbox'>
          Show deck to players?
        </label>
        <div class='clear' style='height: 7px;'></div>
        <label>
          <input class='playerscandraw' type='checkbox'>
          Players can draw cards?
        </label>
        <div class='clear' style='height: 7px;'></div>
        <label>
          <input class='infinitecards' type='checkbox'>
          Cards in deck are infinite?
        </label>
        <p class='infinitecardstype'>
          <label>
            <input name='infinitecardstype' type='radio' value='random'>
            Always a random card
          </label>
          <label>
            <input name='infinitecardstype' type='radio' value='cycle'>
            Draw through deck, shuffle, repeat
          </label>
        </p>
        <div class='clear' style='height: 7px;'></div>
        <label>
          Allow choosing specific cards from deck:
          <select class='deckpilemode'>
            <option value='none'>Disabled</option>
            <option value='choosebacks_gm'>GM Choose: Show Backs</option>
            <option value='choosefronts_gm'>GM Choose: Show Fronts</option>
            <option value='choosebacks'>GM + Players Choose: Show Backs</option>
            <option value='choosefronts'>GM + Players Choose: Show Fronts</option>
          </select>
        </label>
        <div class='clear' style='height: 7px;'></div>
        <label>
          Discard Pile:
          <select class='discardpilemode'>
            <option value='none'>No discard pile</option>
            <option value='choosebacks'>Choose: Show Backs</option>
            <option value='choosefronts'>Choose: Show Fronts</option>
            <option value='drawtop'>Draw most recent/top card</option>
            <option value='drawbottom'>Draw oldest/bottom card</option>
          </select>
        </label>
        <div class='clear' style='height: 7px;'></div>
        <hr>
        <strong>When played to the tabletop...</strong>
        <div class='clear' style='height: 5px;'></div>
        <label>
          Played Facing:
          <select class='cardsplayed' style='display: inline-block; width: auto; position: relative; top: 3px;'>
            <option value='facedown'>Face Down</option>
            <option value='faceup'>Face Up</option>
          </select>
        </label>
        <div class='clear' style='height: 7px;'></div>
        <label>
          Considered:
          <select class='treatasdrawing' style='display: inline-block; width: auto; position: relative; top: 3px;'>
            <option value='true'>Drawings (No Bubbles/Stats)</option>
            <option value='false'>Tokens (Including Bubbles and Stats)</option>
          </select>
        </label>
        <div class='clear' style='height: 7px;'></div>
        <div class='inlineinputs'>
          Card Size:
          <input class='defaultwidth' type='text'>
          x
          <input class='defaultheight' type='text'>
          px
        </div>
        <small style='text-align: left; padding-left: 135px; width: auto;'>Leave blank for default auto-sizing</small>
        <div class='clear' style='height: 7px;'></div>
        <!-- %label -->
        <!-- %input.showalldrawn(type="checkbox") -->
        <!-- Everyone sees what card is drawn onto top of deck? -->
        <!-- .clear(style="height: 7px;") -->
        <hr>
        <strong>In other's hands...</strong>
        <div class='clear' style='height: 5px;'></div>
        <div class='inlineinputs'>
          <label style='width: 75px;'>Players see:</label>
          <label>
            <input class='players_seenumcards' type='checkbox'>
            Number of Cards
          </label>
          <label>
            <input class='players_seefrontofcards' type='checkbox'>
            Front of Cards
          </label>
        </div>
        <div class='clear' style='height: 5px;'></div>
        <div class='inlineinputs'>
          <label style='width: 75px;'>GM sees:</label>
          <label>
            <input class='gm_seenumcards' type='checkbox'>
            Number of Cards
          </label>
          <label>
            <input class='gm_seefrontofcards' type='checkbox'>
            Front of Cards
          </label>
        </div>
        <div class='clear' style='height: 5px;'></div>
        <hr>
        <!-- BEGIN MOD -->
        <button class='btn deck-mass-cards-by-url' style='float: right; margin-left: 5px;' data-deck-id="<$!this.id$>">
          Add Cards from URLs
        </button>
        <!-- END MOD -->
        <button class='addcard btn' style='float: right;'>
          <span class='pictos'>&</span>
          Add Card
        </button>
        <h3>Cards</h3>
        <div class='clear' style='height: 7px;'></div>
        <table class='table table-striped'>
          <tbody></tbody>
        </table>
        <div class='clear' style='height: 15px;'></div>
        <label>
          <strong>Card Backing (Required)</strong>
        </label>
        <div class='clear' style='height: 7px;'></div>
        <!-- BEGIN MOD -->
        <button class='btn deck-image-by-url' style="margin-bottom: 10px" data-deck-id="<$!this.id$>">Set image from URL...</button>
        <!-- END MOD -->
        <div class="avatar dropbox <$! this.get("avatar") != "" ? "filled" : "" $>">
        <div class='status'></div>
        <div class='inner'></div>
        <$ if(this.get("avatar") == "") { $>
        <h4 style='padding-bottom: 0px; marigin-bottom: 0px; color: #777;'>Drop a file</h4>
        <br>or</br>
        <button class='btn'>Choose a file...</button>
        <input class='manual' type='file'>
        <$ } else { $>
        <img src="<$!this.get("avatar")$>" />
        <div class='remove'>
          <a href='javascript:void(0);'>Remove</a>
        </div>
        <$ } $>
        </div>
        </div>
        <div class='clear' style='height: 20px;'></div>
        <p style='float: left;'>
          <button class='btn dupedeck'>Duplicate Deck</button>
        </p>
        <$ if(this.id != "A778E120-672D-49D0-BAF8-8646DA3D3FAC") { $>
        <p style='text-align: right;'>
          <button class='btn btn-danger deletedeck'>Delete Deck</button>
        </p>
        <$ } $>
      </div>
    </script>
	`;
	d20plus.template.cardeditor = `
    <script id='tmpl_cardeditor' type='text/html'>
      <div class='dialog largedialog cardeditor' style='display: block;'>
        <label>Name</label>
        <input class='name' type='text'>
        <div class='clear'></div>
        <!-- BEGIN MOD -->
        <button class='btn card-image-by-url' style="margin-bottom: 10px" data-card-id="<$!this.id$>">Set image from URL...</button>
        <!-- END MOD -->
        <div class="avatar dropbox <$! this.get("avatar") != "" ? "filled" : "" $>">
        <div class="status"></div>
        <div class="inner">
        <$ if(this.get("avatar") == "") { $>
        <h4 style='padding-bottom: 0px; marigin-bottom: 0px; color: #777;'>Drop a file</h4>
        <br>or</br>
        <button class='btn'>Choose a file...</button>
        <input class='manual' type='file'>
        <$ } else { $>
        <img src="<$!this.get("avatar")$>" />
        <div class='remove'>
          <a href='javascript:void(0);'>Remove</a>
        </div>
        <$ } $>
        </div>
        </div>
        <div class='clear'></div>
        <label>&nbsp;</label>
        <button class='deletecard btn btn-danger'>Delete Card</button>
      </div>
    </script>
	`
};

SCRIPT_EXTENSIONS.push(baseTemplate);


const betteR20Emoji = function () {
	d20plus.chat = {};

	// to dump the keys as one-per-line colon-fotmatted: `JSON.stringify(Object.keys(d20plus.chat.emojiIndex).sort(SortUtil.ascSortLower), null, 1).replace(/",/g, ":").replace(/"/g, ":").replace(/[ \[\]]/g, "").trim()`
	d20plus.chat.emojiIndex = {
		joy: !0,
		heart: !0,
		heart_eyes: !0,
		sob: !0,
		blush: !0,
		unamused: !0,
		kissing_heart: !0,
		two_hearts: !0,
		weary: !0,
		ok_hand: !0,
		pensive: !0,
		smirk: !0,
		grin: !0,
		recycle: !0,
		wink: !0,
		thumbsup: !0,
		pray: !0,
		relieved: !0,
		notes: !0,
		flushed: !0,
		raised_hands: !0,
		see_no_evil: !0,
		cry: !0,
		sunglasses: !0,
		v: !0,
		eyes: !0,
		sweat_smile: !0,
		sparkles: !0,
		sleeping: !0,
		smile: !0,
		purple_heart: !0,
		broken_heart: !0,
		expressionless: !0,
		sparkling_heart: !0,
		blue_heart: !0,
		confused: !0,
		information_desk_person: !0,
		stuck_out_tongue_winking_eye: !0,
		disappointed: !0,
		yum: !0,
		neutral_face: !0,
		sleepy: !0,
		clap: !0,
		cupid: !0,
		heartpulse: !0,
		revolving_hearts: !0,
		arrow_left: !0,
		speak_no_evil: !0,
		kiss: !0,
		point_right: !0,
		cherry_blossom: !0,
		scream: !0,
		fire: !0,
		rage: !0,
		smiley: !0,
		tada: !0,
		tired_face: !0,
		camera: !0,
		rose: !0,
		stuck_out_tongue_closed_eyes: !0,
		muscle: !0,
		skull: !0,
		sunny: !0,
		yellow_heart: !0,
		triumph: !0,
		new_moon_with_face: !0,
		laughing: !0,
		sweat: !0,
		point_left: !0,
		heavy_check_mark: !0,
		heart_eyes_cat: !0,
		grinning: !0,
		mask: !0,
		green_heart: !0,
		wave: !0,
		persevere: !0,
		heartbeat: !0,
		arrow_forward: !0,
		arrow_backward: !0,
		arrow_right_hook: !0,
		leftwards_arrow_with_hook: !0,
		crown: !0,
		kissing_closed_eyes: !0,
		stuck_out_tongue: !0,
		disappointed_relieved: !0,
		innocent: !0,
		headphones: !0,
		white_check_mark: !0,
		confounded: !0,
		arrow_right: !0,
		angry: !0,
		grimacing: !0,
		star2: !0,
		gun: !0,
		raising_hand: !0,
		thumbsdown: !0,
		dancer: !0,
		musical_note: !0,
		no_mouth: !0,
		dizzy: !0,
		fist: !0,
		point_down: !0,
		red_circle: !0,
		no_good: !0,
		boom: !0,
		thought_balloon: !0,
		tongue: !0,
		poop: !0,
		cold_sweat: !0,
		gem: !0,
		ok_woman: !0,
		pizza: !0,
		joy_cat: !0,
		sun_with_face: !0,
		leaves: !0,
		sweat_drops: !0,
		penguin: !0,
		zzz: !0,
		walking: !0,
		airplane: !0,
		balloon: !0,
		star: !0,
		ribbon: !0,
		ballot_box_with_check: !0,
		worried: !0,
		underage: !0,
		fearful: !0,
		four_leaf_clover: !0,
		hibiscus: !0,
		microphone: !0,
		open_hands: !0,
		ghost: !0,
		palm_tree: !0,
		bangbang: !0,
		nail_care: !0,
		x: !0,
		alien: !0,
		bow: !0,
		cloud: !0,
		soccer: !0,
		angel: !0,
		dancers: !0,
		exclamation: !0,
		snowflake: !0,
		point_up: !0,
		kissing_smiling_eyes: !0,
		rainbow: !0,
		crescent_moon: !0,
		heart_decoration: !0,
		gift_heart: !0,
		gift: !0,
		beers: !0,
		anguished: !0,
		earth_africa: !0,
		movie_camera: !0,
		anchor: !0,
		zap: !0,
		heavy_multiplication_x: !0,
		runner: !0,
		sunflower: !0,
		earth_americas: !0,
		bouquet: !0,
		dog: !0,
		moneybag: !0,
		herb: !0,
		couple: !0,
		fallen_leaf: !0,
		tulip: !0,
		birthday: !0,
		cat: !0,
		coffee: !0,
		dizzy_face: !0,
		point_up_2: !0,
		open_mouth: !0,
		hushed: !0,
		basketball: !0,
		christmas_tree: !0,
		ring: !0,
		full_moon_with_face: !0,
		astonished: !0,
		two_women_holding_hands: !0,
		money_with_wings: !0,
		crying_cat_face: !0,
		hear_no_evil: !0,
		dash: !0,
		cactus: !0,
		hotsprings: !0,
		telephone: !0,
		maple_leaf: !0,
		princess: !0,
		massage: !0,
		love_letter: !0,
		trophy: !0,
		person_frowning: !0,
		us: !0,
		confetti_ball: !0,
		blossom: !0,
		lips: !0,
		fries: !0,
		doughnut: !0,
		frowning: !0,
		ocean: !0,
		bomb: !0,
		ok: !0,
		cyclone: !0,
		rocket: !0,
		umbrella: !0,
		couplekiss: !0,
		couple_with_heart: !0,
		lollipop: !0,
		clapper: !0,
		pig: !0,
		smiling_imp: !0,
		imp: !0,
		bee: !0,
		kissing_cat: !0,
		anger: !0,
		musical_score: !0,
		santa: !0,
		earth_asia: !0,
		football: !0,
		guitar: !0,
		panda_face: !0,
		speech_balloon: !0,
		strawberry: !0,
		smirk_cat: !0,
		banana: !0,
		watermelon: !0,
		snowman: !0,
		smile_cat: !0,
		top: !0,
		eggplant: !0,
		crystal_ball: !0,
		fork_and_knife: !0,
		calling: !0,
		iphone: !0,
		partly_sunny: !0,
		warning: !0,
		scream_cat: !0,
		small_orange_diamond: !0,
		baby: !0,
		feet: !0,
		footprints: !0,
		beer: !0,
		wine_glass: !0,
		o: !0,
		video_camera: !0,
		rabbit: !0,
		tropical_drink: !0,
		smoking: !0,
		space_invader: !0,
		peach: !0,
		snake: !0,
		turtle: !0,
		cherries: !0,
		kissing: !0,
		frog: !0,
		milky_way: !0,
		rotating_light: !0,
		hatching_chick: !0,
		closed_book: !0,
		candy: !0,
		hamburger: !0,
		bear: !0,
		tiger: !0,
		fast_forward: !0,
		icecream: !0,
		pineapple: !0,
		ear_of_rice: !0,
		syringe: !0,
		put_litter_in_its_place: !0,
		chocolate_bar: !0,
		black_small_square: !0,
		tv: !0,
		pill: !0,
		octopus: !0,
		jack_o_lantern: !0,
		grapes: !0,
		smiley_cat: !0,
		cd: !0,
		cocktail: !0,
		cake: !0,
		video_game: !0,
		arrow_down: !0,
		no_entry_sign: !0,
		lipstick: !0,
		whale: !0,
		cookie: !0,
		dolphin: !0,
		loud_sound: !0,
		man: !0,
		hatched_chick: !0,
		monkey: !0,
		books: !0,
		japanese_ogre: !0,
		guardsman: !0,
		loudspeaker: !0,
		scissors: !0,
		girl: !0,
		mortar_board: !0,
		fr: !0,
		baseball: !0,
		vertical_traffic_light: !0,
		woman: !0,
		fireworks: !0,
		stars: !0,
		sos: !0,
		mushroom: !0,
		pouting_cat: !0,
		left_luggage: !0,
		high_heel: !0,
		dart: !0,
		swimmer: !0,
		key: !0,
		bikini: !0,
		family: !0,
		pencil2: !0,
		elephant: !0,
		droplet: !0,
		seedling: !0,
		apple: !0,
		cool: !0,
		telephone_receiver: !0,
		dollar: !0,
		house_with_garden: !0,
		book: !0,
		haircut: !0,
		computer: !0,
		bulb: !0,
		question: !0,
		back: !0,
		boy: !0,
		closed_lock_with_key: !0,
		person_with_pouting_face: !0,
		tangerine: !0,
		sunrise: !0,
		poultry_leg: !0,
		blue_circle: !0,
		oncoming_automobile: !0,
		shaved_ice: !0,
		bird: !0,
		first_quarter_moon_with_face: !0,
		eyeglasses: !0,
		goat: !0,
		night_with_stars: !0,
		older_woman: !0,
		black_circle: !0,
		new_moon: !0,
		two_men_holding_hands: !0,
		white_circle: !0,
		customs: !0,
		tropical_fish: !0,
		house: !0,
		arrows_clockwise: !0,
		last_quarter_moon_with_face: !0,
		round_pushpin: !0,
		full_moon: !0,
		athletic_shoe: !0,
		lemon: !0,
		baby_bottle: !0,
		spaghetti: !0,
		wind_chime: !0,
		fish_cake: !0,
		evergreen_tree: !0,
		up: !0,
		arrow_up: !0,
		arrow_upper_right: !0,
		arrow_lower_right: !0,
		arrow_lower_left: !0,
		performing_arts: !0,
		nose: !0,
		pig_nose: !0,
		fish: !0,
		man_with_turban: !0,
		koala: !0,
		ear: !0,
		eight_spoked_asterisk: !0,
		small_blue_diamond: !0,
		shower: !0,
		bug: !0,
		ramen: !0,
		tophat: !0,
		bride_with_veil: !0,
		fuelpump: !0,
		checkered_flag: !0,
		horse: !0,
		watch: !0,
		monkey_face: !0,
		baby_symbol: !0,
		new: !0,
		free: !0,
		sparkler: !0,
		corn: !0,
		tennis: !0,
		alarm_clock: !0,
		battery: !0,
		grey_exclamation: !0,
		wolf: !0,
		moyai: !0,
		cow: !0,
		mega: !0,
		older_man: !0,
		dress: !0,
		link: !0,
		chicken: !0,
		whale2: !0,
		arrow_upper_left: !0,
		deciduous_tree: !0,
		bento: !0,
		pushpin: !0,
		soon: !0,
		repeat: !0,
		dragon: !0,
		hamster: !0,
		golf: !0,
		surfer: !0,
		mouse: !0,
		waxing_crescent_moon: !0,
		blue_car: !0,
		a: !0,
		interrobang: !0,
		u5272: !0,
		electric_plug: !0,
		first_quarter_moon: !0,
		cancer: !0,
		trident: !0,
		bread: !0,
		cop: !0,
		tea: !0,
		fishing_pole_and_fish: !0,
		bike: !0,
		rice: !0,
		radio: !0,
		baby_chick: !0,
		arrow_heading_down: !0,
		waning_crescent_moon: !0,
		arrow_up_down: !0,
		last_quarter_moon: !0,
		radio_button: !0,
		sheep: !0,
		person_with_blond_hair: !0,
		waning_gibbous_moon: !0,
		lock: !0,
		green_apple: !0,
		japanese_goblin: !0,
		curly_loop: !0,
		triangular_flag_on_post: !0,
		arrows_counterclockwise: !0,
		racehorse: !0,
		fried_shrimp: !0,
		sunrise_over_mountains: !0,
		volcano: !0,
		rooster: !0,
		inbox_tray: !0,
		wedding: !0,
		sushi: !0,
		wavy_dash: !0,
		ice_cream: !0,
		rewind: !0,
		tomato: !0,
		rabbit2: !0,
		eight_pointed_black_star: !0,
		small_red_triangle: !0,
		high_brightness: !0,
		heavy_plus_sign: !0,
		man_with_gua_pi_mao: !0,
		convenience_store: !0,
		busts_in_silhouette: !0,
		beetle: !0,
		small_red_triangle_down: !0,
		arrow_heading_up: !0,
		name_badge: !0,
		bath: !0,
		no_entry: !0,
		crocodile: !0,
		dog2: !0,
		cat2: !0,
		hammer: !0,
		meat_on_bone: !0,
		shell: !0,
		sparkle: !0,
		b: !0,
		m: !0,
		poodle: !0,
		aquarius: !0,
		stew: !0,
		jeans: !0,
		honey_pot: !0,
		musical_keyboard: !0,
		unlock: !0,
		black_nib: !0,
		statue_of_liberty: !0,
		heavy_dollar_sign: !0,
		snowboarder: !0,
		white_flower: !0,
		necktie: !0,
		diamond_shape_with_a_dot_inside: !0,
		aries: !0,
		womens: !0,
		ant: !0,
		scorpius: !0,
		city_sunset: !0,
		hourglass_flowing_sand: !0,
		o2: !0,
		dragon_face: !0,
		snail: !0,
		dvd: !0,
		shirt: !0,
		game_die: !0,
		heavy_minus_sign: !0,
		dolls: !0,
		sagittarius: !0,
		"8ball": !0,
		bus: !0,
		custard: !0,
		crossed_flags: !0,
		part_alternation_mark: !0,
		camel: !0,
		curry: !0,
		steam_locomotive: !0,
		hospital: !0,
		large_blue_diamond: !0,
		tanabata_tree: !0,
		bell: !0,
		leo: !0,
		gemini: !0,
		pear: !0,
		large_orange_diamond: !0,
		taurus: !0,
		globe_with_meridians: !0,
		door: !0,
		clock6: !0,
		oncoming_police_car: !0,
		envelope_with_arrow: !0,
		closed_umbrella: !0,
		saxophone: !0,
		church: !0,
		bicyclist: !0,
		pisces: !0,
		dango: !0,
		capricorn: !0,
		office: !0,
		rowboat: !0,
		womans_hat: !0,
		mans_shoe: !0,
		love_hotel: !0,
		mount_fuji: !0,
		dromedary_camel: !0,
		handbag: !0,
		hourglass: !0,
		negative_squared_cross_mark: !0,
		trumpet: !0,
		school: !0,
		cow2: !0,
		construction_worker: !0,
		toilet: !0,
		pig2: !0,
		grey_question: !0,
		beginner: !0,
		violin: !0,
		on: !0,
		credit_card: !0,
		id: !0,
		secret: !0,
		ferris_wheel: !0,
		bowling: !0,
		libra: !0,
		virgo: !0,
		barber: !0,
		purse: !0,
		roller_coaster: !0,
		rat: !0,
		date: !0,
		rugby_football: !0,
		ram: !0,
		arrow_up_small: !0,
		black_square_button: !0,
		mobile_phone_off: !0,
		tokyo_tower: !0,
		congratulations: !0,
		kimono: !0,
		ship: !0,
		mag_right: !0,
		mag: !0,
		fire_engine: !0,
		clock1130: !0,
		police_car: !0,
		black_joker: !0,
		bridge_at_night: !0,
		package: !0,
		oncoming_taxi: !0,
		calendar: !0,
		horse_racing: !0,
		tiger2: !0,
		boot: !0,
		ambulance: !0,
		white_square_button: !0,
		boar: !0,
		school_satchel: !0,
		loop: !0,
		pound: !0,
		information_source: !0,
		ox: !0,
		rice_ball: !0,
		vs: !0,
		end: !0,
		parking: !0,
		sandal: !0,
		tent: !0,
		seat: !0,
		taxi: !0,
		black_medium_small_square: !0,
		briefcase: !0,
		newspaper: !0,
		circus_tent: !0,
		six_pointed_star: !0,
		mens: !0,
		european_castle: !0,
		flashlight: !0,
		foggy: !0,
		arrow_double_up: !0,
		bamboo: !0,
		ticket: !0,
		helicopter: !0,
		minidisc: !0,
		oncoming_bus: !0,
		melon: !0,
		white_small_square: !0,
		european_post_office: !0,
		keycap_ten: !0,
		notebook: !0,
		no_bell: !0,
		oden: !0,
		flags: !0,
		carousel_horse: !0,
		blowfish: !0,
		chart_with_upwards_trend: !0,
		sweet_potato: !0,
		ski: !0,
		clock12: !0,
		signal_strength: !0,
		construction: !0,
		black_medium_square: !0,
		satellite: !0,
		euro: !0,
		womans_clothes: !0,
		ledger: !0,
		leopard: !0,
		low_brightness: !0,
		clock3: !0,
		department_store: !0,
		truck: !0,
		sake: !0,
		railway_car: !0,
		speedboat: !0,
		vhs: !0,
		clock1: !0,
		arrow_double_down: !0,
		water_buffalo: !0,
		arrow_down_small: !0,
		yen: !0,
		mute: !0,
		running_shirt_with_sash: !0,
		white_large_square: !0,
		wheelchair: !0,
		clock2: !0,
		paperclip: !0,
		atm: !0,
		cinema: !0,
		telescope: !0,
		rice_scene: !0,
		blue_book: !0,
		white_medium_square: !0,
		postbox: !0,
		"e-mail": !0,
		mouse2: !0,
		bullettrain_side: !0,
		ideograph_advantage: !0,
		nut_and_bolt: !0,
		ng: !0,
		hotel: !0,
		wc: !0,
		izakaya_lantern: !0,
		repeat_one: !0,
		mailbox_with_mail: !0,
		chart_with_downwards_trend: !0,
		green_book: !0,
		tractor: !0,
		fountain: !0,
		metro: !0,
		clipboard: !0,
		no_mobile_phones: !0,
		clock4: !0,
		no_smoking: !0,
		black_large_square: !0,
		slot_machine: !0,
		clock5: !0,
		bathtub: !0,
		scroll: !0,
		station: !0,
		rice_cracker: !0,
		bank: !0,
		wrench: !0,
		u6307: !0,
		articulated_lorry: !0,
		page_facing_up: !0,
		ophiuchus: !0,
		bar_chart: !0,
		no_pedestrians: !0,
		vibration_mode: !0,
		clock10: !0,
		clock9: !0,
		bullettrain_front: !0,
		minibus: !0,
		tram: !0,
		clock8: !0,
		u7a7a: !0,
		traffic_light: !0,
		mountain_bicyclist: !0,
		microscope: !0,
		japanese_castle: !0,
		bookmark: !0,
		bookmark_tabs: !0,
		pouch: !0,
		ab: !0,
		page_with_curl: !0,
		flower_playing_cards: !0,
		clock11: !0,
		fax: !0,
		clock7: !0,
		white_medium_small_square: !0,
		currency_exchange: !0,
		sound: !0,
		chart: !0,
		cl: !0,
		floppy_disk: !0,
		post_office: !0,
		speaker: !0,
		japan: !0,
		u55b6: !0,
		mahjong: !0,
		incoming_envelope: !0,
		orange_book: !0,
		restroom: !0,
		u7121: !0,
		u6709: !0,
		triangular_ruler: !0,
		train: !0,
		u7533: !0,
		trolleybus: !0,
		u6708: !0,
		notebook_with_decorative_cover: !0,
		u7981: !0,
		u6e80: !0,
		postal_horn: !0,
		factory: !0,
		children_crossing: !0,
		train2: !0,
		straight_ruler: !0,
		pager: !0,
		accept: !0,
		u5408: !0,
		lock_with_ink_pen: !0,
		clock130: !0,
		sa: !0,
		outbox_tray: !0,
		twisted_rightwards_arrows: !0,
		mailbox: !0,
		light_rail: !0,
		clock930: !0,
		busstop: !0,
		open_file_folder: !0,
		file_folder: !0,
		potable_water: !0,
		card_index: !0,
		clock230: !0,
		monorail: !0,
		clock1230: !0,
		clock1030: !0,
		abc: !0,
		mailbox_closed: !0,
		clock430: !0,
		mountain_railway: !0,
		do_not_litter: !0,
		clock330: !0,
		heavy_division_sign: !0,
		clock730: !0,
		clock530: !0,
		capital_abcd: !0,
		mailbox_with_no_mail: !0,
		symbols: !0,
		aerial_tramway: !0,
		clock830: !0,
		clock630: !0,
		abcd: !0,
		mountain_cableway: !0,
		koko: !0,
		passport_control: !0,
		"non-potable_water": !0,
		suspension_railway: !0,
		baggage_claim: !0,
		no_bicycles: !0,
		skull_crossbones: !0,
		hugging: !0,
		thinking: !0,
		nerd: !0,
		zipper_mouth: !0,
		rolling_eyes: !0,
		upside_down: !0,
		slight_smile: !0,
		middle_finger: !0,
		writing_hand: !0,
		dark_sunglasses: !0,
		eye: !0,
		man_in_suit: !0,
		golfer: !0,
		heart_exclamation: !0,
		star_of_david: !0,
		cross: !0,
		"fleur-de-lis": !0,
		atom: !0,
		wheel_of_dharma: !0,
		yin_yang: !0,
		peace: !0,
		star_and_crescent: !0,
		orthodox_cross: !0,
		biohazard: !0,
		radioactive: !0,
		place_of_worship: !0,
		anger_right: !0,
		menorah: !0,
		om_symbol: !0,
		coffin: !0,
		gear: !0,
		alembic: !0,
		scales: !0,
		crossed_swords: !0,
		keyboard: !0,
		shield: !0,
		bed: !0,
		shopping_bags: !0,
		sleeping_accommodation: !0,
		ballot_box: !0,
		compression: !0,
		wastebasket: !0,
		file_cabinet: !0,
		trackball: !0,
		printer: !0,
		joystick: !0,
		hole: !0,
		candle: !0,
		prayer_beads: !0,
		camera_with_flash: !0,
		amphora: !0,
		label: !0,
		flag_black: !0,
		flag_white: !0,
		film_frames: !0,
		control_knobs: !0,
		level_slider: !0,
		thermometer: !0,
		airplane_arriving: !0,
		airplane_departure: !0,
		railway_track: !0,
		motorway: !0,
		synagogue: !0,
		mosque: !0,
		kaaba: !0,
		stadium: !0,
		desert: !0,
		classical_building: !0,
		cityscape: !0,
		camping: !0,
		bow_and_arrow: !0,
		rosette: !0,
		volleyball: !0,
		medal: !0,
		reminder_ribbon: !0,
		popcorn: !0,
		champagne: !0,
		hot_pepper: !0,
		burrito: !0,
		taco: !0,
		hotdog: !0,
		shamrock: !0,
		comet: !0,
		turkey: !0,
		scorpion: !0,
		lion_face: !0,
		crab: !0,
		spider_web: !0,
		spider: !0,
		chipmunk: !0,
		wind_blowing_face: !0,
		fog: !0,
		play_pause: !0,
		track_previous: !0,
		track_next: !0,
		beach_umbrella: !0,
		chains: !0,
		pick: !0,
		stopwatch: !0,
		ferry: !0,
		mountain: !0,
		shinto_shrine: !0,
		ice_skate: !0,
		skier: !0,
		flag_ac: !0,
		flag_ad: !0,
		flag_ae: !0,
		flag_af: !0,
		flag_ag: !0,
		flag_ai: !0,
		flag_al: !0,
		flag_am: !0,
		"flag-ao": !0,
		"flag-aq": !0,
		"flag-ar": !0,
		"flag-as": !0,
		"flag-at": !0,
		"flag-au": !0,
		"flag-aw": !0,
		"flag-ax": !0,
		"flag-az": !0,
		"flag-ba": !0,
		"flag-bb": !0,
		"flag-bd": !0,
		"flag-be": !0,
		"flag-bf": !0,
		"flag-bg": !0,
		"flag-bh": !0,
		"flag-bi": !0,
		"flag-bj": !0,
		"flag-bl": !0,
		"flag-bm": !0,
		"flag-bn": !0,
		"flag-bo": !0,
		"flag-bq": !0,
		"flag-br": !0,
		"flag-bs": !0,
		"flag-bt": !0,
		"flag-bv": !0,
		"flag-bw": !0,
		"flag-by": !0,
		"flag-bz": !0,
		"flag-ca": !0,
		"flag-cc": !0,
		"flag-cd": !0,
		"flag-cf": !0,
		"flag-cg": !0,
		"flag-ch": !0,
		"flag-ci": !0,
		"flag-ck": !0,
		"flag-cl": !0,
		"flag-cm": !0,
		"flag-cn": !0,
		"flag-co": !0,
		"flag-cp": !0,
		"flag-cr": !0,
		"flag-cu": !0,
		"flag-cv": !0,
		"flag-cw": !0,
		"flag-cx": !0,
		"flag-cy": !0,
		"flag-cz": !0,
		"flag-de": !0,
		"flag-dg": !0,
		"flag-dj": !0,
		"flag-dk": !0,
		"flag-dm": !0,
		"flag-do": !0,
		"flag-dz": !0,
		"flag-ea": !0,
		"flag-ec": !0,
		"flag-ee": !0,
		"flag-eg": !0,
		"flag-eh": !0,
		"flag-er": !0,
		"flag-es": !0,
		"flag-et": !0,
		"flag-eu": !0,
		"flag-fi": !0,
		"flag-fj": !0,
		"flag-fk": !0,
		"flag-fm": !0,
		"flag-fo": !0,
		"flag-fr": !0,
		"flag-ga": !0,
		"flag-gb": !0,
		"flag-gd": !0,
		"flag-ge": !0,
		"flag-gf": !0,
		"flag-gg": !0,
		"flag-gh": !0,
		"flag-gi": !0,
		"flag-gl": !0,
		"flag-gm": !0,
		"flag-gn": !0,
		"flag-gp": !0,
		"flag-gq": !0,
		"flag-gr": !0,
		"flag-gs": !0,
		"flag-gt": !0,
		"flag-gu": !0,
		"flag-gw": !0,
		"flag-gy": !0,
		"flag-hk": !0,
		"flag-hm": !0,
		"flag-hn": !0,
		"flag-hr": !0,
		"flag-ht": !0,
		"flag-hu": !0,
		"flag-ic": !0,
		"flag-id": !0,
		"flag-ie": !0,
		"flag-il": !0,
		"flag-im": !0,
		"flag-in": !0,
		"flag-io": !0,
		"flag-iq": !0,
		"flag-ir": !0,
		"flag-is": !0,
		"flag-it": !0,
		"flag-je": !0,
		"flag-jm": !0,
		"flag-jo": !0,
		"flag-jp": !0,
		"flag-ke": !0,
		"flag-kg": !0,
		"flag-kh": !0,
		"flag-ki": !0,
		"flag-km": !0,
		"flag-kn": !0,
		"flag-kp": !0,
		"flag-kr": !0,
		"flag-kw": !0,
		"flag-ky": !0,
		"flag-kz": !0,
		"flag-la": !0,
		"flag-lb": !0,
		"flag-lc": !0,
		"flag-li": !0,
		"flag-lk": !0,
		"flag-lr": !0,
		"flag-ls": !0,
		"flag-lt": !0,
		"flag-lu": !0,
		"flag-lv": !0,
		"flag-ly": !0,
		"flag-ma": !0,
		"flag-mc": !0,
		"flag-md": !0,
		"flag-me": !0,
		"flag-mf": !0,
		"flag-mg": !0,
		"flag-mh": !0,
		"flag-mk": !0,
		"flag-ml": !0,
		"flag-mm": !0,
		"flag-mn": !0,
		"flag-mo": !0,
		"flag-mp": !0,
		"flag-mq": !0,
		"flag-mr": !0,
		"flag-ms": !0,
		"flag-mt": !0,
		"flag-mu": !0,
		"flag-mv": !0,
		"flag-mw": !0,
		"flag-mx": !0,
		"flag-my": !0,
		"flag-mz": !0,
		"flag-na": !0,
		"flag-nc": !0,
		"flag-ne": !0,
		"flag-nf": !0,
		"flag-ng": !0,
		"flag-ni": !0,
		"flag-nl": !0,
		"flag-no": !0,
		"flag-np": !0,
		"flag-nr": !0,
		"flag-nu": !0,
		"flag-nz": !0,
		"flag-om": !0,
		"flag-pa": !0,
		"flag-pe": !0,
		"flag-pf": !0,
		"flag-pg": !0,
		"flag-ph": !0,
		"flag-pk": !0,
		"flag-pl": !0,
		"flag-pm": !0,
		"flag-pn": !0,
		"flag-pr": !0,
		"flag-ps": !0,
		"flag-pt": !0,
		"flag-pw": !0,
		"flag-py": !0,
		"flag-qa": !0,
		"flag-re": !0,
		"flag-ro": !0,
		"flag-rs": !0,
		"flag-ru": !0,
		"flag-rw": !0,
		"flag-sa": !0,
		"flag-sb": !0,
		"flag-sc": !0,
		"flag-sd": !0,
		"flag-se": !0,
		"flag-sg": !0,
		"flag-sh": !0,
		"flag-si": !0,
		"flag-sj": !0,
		"flag-sk": !0,
		"flag-sl": !0,
		"flag-sm": !0,
		"flag-sn": !0,
		"flag-so": !0,
		"flag-sr": !0,
		"flag-ss": !0,
		"flag-st": !0,
		"flag-sv": !0,
		"flag-sx": !0,
		"flag-sy": !0,
		"flag-sz": !0,
		"flag-ta": !0,
		"flag-tc": !0,
		"flag-td": !0,
		"flag-tf": !0,
		"flag-tg": !0,
		"flag-th": !0,
		"flag-tj": !0,
		"flag-tk": !0,
		"flag-tl": !0,
		"flag-tm": !0,
		"flag-tn": !0,
		"flag-to": !0,
		"flag-tr": !0,
		"flag-tt": !0,
		"flag-tv": !0,
		"flag-tw": !0,
		"flag-tz": !0,
		"flag-ua": !0,
		"flag-ug": !0,
		"flag-um": !0,
		"flag-us": !0,
		"flag-uy": !0,
		"flag-uz": !0,
		"flag-va": !0,
		"flag-vc": !0,
		"flag-ve": !0,
		"flag-vg": !0,
		"flag-vi": !0,
		"flag-vn": !0,
		flag_vu: !0,
		flag_wf: !0,
		flag_ws: !0,
		flag_xk: !0,
		flag_ye: !0,
		flag_yt: !0,
		flag_za: !0,
		flag_zm: !0,
		flag_zw: !0,
		black_heart: !0,
		speech_left: !0,
		egg: !0,
		octagonal_sign: !0,
		spades: !0,
		hearts: !0,
		diamonds: !0,
		clubs: !0,
		drum: !0,
		left_right_arrow: !0,
		tm: !0,
		"100": !0
	};

	addConfigOptions(
		"interface", {
			_name: "Interface",
			emoji: {
				name: "Add Emoji Replacement to Chat",
				default: true,
				_type: "boolean",
				_player: true
			}
		}
	);

	d20plus.chat.enhanceChat = () => {
		d20plus.ut.log("Enhancing chat");
		const tc = d20.textchat.$textarea;
		$("#textchat-input").off("click", "button")
		$("#textchat-input").on("click", "button", function () {
			if (d20plus.cfg.getOrDefault("interface", "emoji")) {
				tc.val(tc.val().replace(/(:\w*?:)/g, (m0, m1) => {
					const clean = m1.replace(/:/g, "");
					return d20plus.chat.emojiIndex && d20plus.chat.emojiIndex[clean] ? `[${clean}](https://github.com/TheGiddyLimit/emoji-dump/raw/master/out/${clean}.png)` : m1;
				}));
			}

			// add custom commands
			tc.val(tc.val().replace(/^\/ttms( |$)/, "/talktomyself$1"));

			const toSend = $.trim(tc.val());
			d20.textchat.doChatInput(toSend);
			tc.val("").focus();
		});
	};
};

SCRIPT_EXTENSIONS.push(betteR20Emoji);


function remoteLibre () {
	d20plus.remoteLibre = {
		getRemotePlaylists () {
			return fetch('https://api.github.com/repos/DMsGuild201/Roll20_resources/contents/playlist')
				.then(response => response.json())
				.then(data => {
					const promises = data.filter(file => file.download_url.toLowerCase().endsWith(".json"))
						.map(file => d20plus.remoteLibre.downloadPlaylist(file.download_url));
					return Promise.all(promises).then(res => d20plus.remoteLibre.processRemotePlaylists(res));
				})
				.catch(error => console.error(error));
		},

		downloadPlaylist (url) {
			return fetch(url)
				.then(response => response.json())
				.catch(error => console.error("Error when fetching", url, error));
		},

		processRemotePlaylists (imports) {
			return $.map(imports.filter(p => !!p), entry => {
				return $.map(entry.playlists, playlist => playlist.songs);
			}).filter(track => track.source === "My Audio");
		},

		drawRemoteLibreResults (tracks) {
			return tracks.map((t, i) => `
                <p style="margin-top:15px">${t.title}</p>
                <div class="br20-result" style="display: flex">
                    <audio class="audio" controls preload="none" style="flex: 35" src="${t.track_id}"></audio>
                    
                    <button class="remote-track btn" data-id=${i} style="margin-top:auto;margin-bottom:auto;flex:1;font-size:15px;margin-left:10px;">
                        <span class="pictos">&amp;</span>
                    </button>
                </div>
            `);
		},

		drawJukeBoxTab (tracks) {
			const trackHtml = d20plus.remoteLibre.drawRemoteLibreResults(tracks);
			return `
            <div class="betteR20 tab-pane" style="display: none;">
                <div class="row-fluid">
                    <div class="span12">
                        <h3 style="margin-top: 6px; margin-bottom: 10px; text-align:initial;">Search for:</h3>
                        <input id="remoteLibreSearch" type="text" placeholder="Begin typing to choose tracks by title..." style="width: 100%;">
                        <div id="remoteLibreResults">
                            ${trackHtml.join("")}
                        </div>
                    </div>
                </div>
            </div>`;
		},

		wireTrackButtons () {
			$(".remote-track.btn").click((e) => {
				const id = $(e.currentTarget).data().id;
				d20plus.jukebox.createTrack(d20plus.remoteLibre.filteredResults[id]);
			});
		},

		init () {
			d20plus.remoteLibre.jukeboxInjected = false;
			d20plus.remoteLibre.remoteLibreTracks = {};
			d20plus.remoteLibre.filteredResults = {};

			d20plus.remoteLibre.getRemotePlaylists().then((tracks) => {
				d20plus.remoteLibre.remoteLibreTracks = tracks;
				d20plus.remoteLibre.filteredResults = tracks;
			});

			$("#addjukebox").click(() => {
				if (!d20plus.remoteLibre.jukeboxInjected) {
					setTimeout(() => {
						const html = d20plus.remoteLibre.drawJukeBoxTab(d20plus.remoteLibre.filteredResults);
						$(".nav.nav-tabs").append(`<li><a data-tab="betteR20" href="javascript:void(0);">BetteR20</a></li>`);
						$(".tab-content").append(html);
						d20plus.remoteLibre.wireTrackButtons();
						$("#remoteLibreSearch").bind("paste keyup", function () {
							if ($(this).val()) {
								d20plus.remoteLibre.filteredResults = d20plus.remoteLibre.remoteLibreTracks.filter(t => t.title.toLowerCase().indexOf($(this).val()) >= 0);
							} else {
								d20plus.remoteLibre.filteredResults = d20plus.remoteLibre.remoteLibreTracks;
							}
							const results = d20plus.remoteLibre.drawRemoteLibreResults(d20plus.remoteLibre.filteredResults);
							$("#remoteLibreResults").html(results);
							d20plus.remoteLibre.wireTrackButtons();
						});
						// this needs to be moved
						d20plus.remoteLibre.jukeboxInjected = true;
					}, 100);
				}
			});
		},

	};
}

SCRIPT_EXTENSIONS.push(remoteLibre);


function jukeboxWidget () {
	d20plus.jukeboxWidget = {
		getPlaylistButtonsHtml () {
			const buttons = d20plus.jukebox.getJukeboxFileStructure()
				.map((playlist, i) => {
					const hotkey = i + 1 < 10 ? i + 1 : false;
					let baseName, id;
					if (typeof playlist === "object") {
						baseName = playlist.n;
						id = playlist.id;
					} else {
						baseName = d20plus.jukebox.getTrackById(playlist).attributes.title;
						id = playlist;
					}
					const title = `${hotkey ? `[ALT+${hotkey}] ` : ""}${baseName}`;

					return `
						<div
							class="btn btn-xs jukebox-widget-button m-1"
							title="${title}"
							data-id=${id}
						>
							<span>${hotkey ? `[${i + 1}] ` : ""}${baseName}</span>
						</div>
					`;
				})
				.filter(p => !!p);

			return buttons.join("");
		},

		init () {
			const changeTrackVolume = (trackId, value) => {
				const track = d20plus.jukebox.getTrackById(trackId);
				if (track && value) {
					track.changeVolume(value);
				}
			};

			$(`<div id="masterVolume" style="margin:10px;display:inline-block;width:80%;"></div>`)
				.insertAfter("#jukeboxwhatsplaying").slider({
				slide: (e, ui) => {
					if ($("#masterVolumeEnabled").prop("checked")) {
						window.d20.jukebox.lastFolderStructure.forEach(playlist => {
							// The track is outside a playlist
							if (!playlist.i) {
								changeTrackVolume(playlist, ui.value);
							} else {
								playlist.i.forEach(trackId => changeTrackVolume(trackId, ui.value))
							}
						});
					}
					$("#jbwMasterVolume").slider("value", ui.value);
				},
				value: 50,
			});
			$("<h4>Master Volume</h4>").insertAfter("#jukeboxwhatsplaying").css("margin-left", "10px");
			$(`<input type="checkbox" id="masterVolumeEnabled" style="position:relative;top:-11px;" title="Enable this to change the volume of all the tracks at the same time"/>`).insertAfter("#masterVolume").tooltip();

			//TODO: Make the slider a separate component at some point
			const slider = $(`<div id="jbwMasterVolume" class="jukebox-widget-slider"></div>`)
				.slider({
					slide: (e, ui) => {
						if ($("#masterVolumeEnabled").prop("checked")) {
							window.d20.jukebox.lastFolderStructure.forEach(playlist => {
								// The track is outside a playlist
								if (!playlist.i) {
									changeTrackVolume(playlist, ui.value);
								} else {
									playlist.i.forEach(trackId => changeTrackVolume(trackId, ui.value));
								}
							});
						}
						$("#masterVolume").slider("value", ui.value);
					},
					value: 50,
				});

			// Stop and skip buttons
			const controls = $(`
			<div class="flex mb-2">
				<div id="jbwStop" title="ALT+S" class="btn btn-inverse flex-1 mr-2"><span class="pictos">6</span></div>
				<div id="jbwSkip" title="ALT+D" class="btn btn-inverse flex-1 mr-2"><span class="pictos">7</span></div>
			</div>
			`).append(slider);

			// Jukebox widget layout
			const dialog = $(`<div id="jukeboxWidget" title="Jukebox Player" style="margin-top:10px"></div>`)
				.dialog({
					autoOpen: false,
					resizable: true,
					width: 350,
				})
				.append("body")
				.css("padding-top", "0")
				.html(`<div id="jbwButtons" style="display:flex;flex-wrap:wrap">${d20plus.jukeboxWidget.getPlaylistButtonsHtml()}</div>`)
				.prepend(controls)
				.prepend(`<div id="widgeNowPlaying"></div>`);

			dialog.parent().find(".ui-dialog-title").css("margin", "0").css("padding", "0");
			$("#jbwStop").click(d20plus.jukebox.stopAll);
			$("#jbwSkip").click(d20plus.jukebox.skip);

			// Start listening to jukebox state changes
			d20plus.jukebox.addJukeboxChangeHandler(() => {
				$("#jbwButtons").html(d20plus.jukeboxWidget.getPlaylistButtonsHtml());
				$(".jukebox-widget-button")
					.removeClass("active")
					.click((e) => {
						const id = e.currentTarget.dataset.id;
						if (d20plus.jukebox.getCurrentPlayingPlaylist() === id || d20plus.jukebox.getCurrentPlayingTracks().find(t => t.id === id)) {
							d20plus.jukebox.stop(e.currentTarget.dataset.id);
						} else {
							d20plus.jukebox.play(e.currentTarget.dataset.id);
						}
					});
				$(`.jukebox-widget-button[data-id=${d20plus.jukebox.getCurrentPlayingPlaylist()}]`).addClass("active");
				d20plus.jukebox.getCurrentPlayingTracks().forEach(t => {
					$(`.jukebox-widget-button[data-id=${t.id}]`).addClass("active");
				});
			});

			// Add widget button in the Jukebox tab
			$(`<button class="btn" style="margin-right:10px;"><span class="pictos">|</span>Widget</button>`)
				.click(() => {
					dialog.dialog("open");
				})
				.insertAfter("[href=#superjukeboxadd]");

			// Add keyboard shortcuts
			$(document).keyup((e) => {
				if (e.altKey) {
					if (e.keyCode > 48 && e.keyCode < 58) {
						const numberKey = e.keyCode - 48;
						const playElement = d20plus.jukebox.getJukeboxFileStructure()[numberKey - 1];
						if (typeof playElement === "object") {
							if (d20plus.jukebox.getCurrentPlayingPlaylist() === playElement.id) {
								d20plus.jukebox.stopPlaylist(playElement.id);
							} else {
								d20plus.jukebox.playPlaylist(playElement.id);
							}
						} else {
							if (d20plus.jukebox.getCurrentPlayingTracks().find(t => t.id === playElement)) {
								d20plus.jukebox.stopTrack(playElement);
							} else {
								d20plus.jukebox.playTrack(playElement);
							}
						}
					} else if (e.keyCode === 83) {
						d20plus.jukebox.stopAll();
					} else if (e.keyCode === 68) {
						d20plus.jukebox.skip();
					}
				}
			});
		}
	};
}

SCRIPT_EXTENSIONS.push(jukeboxWidget);


const betteR205etools = function () {
	// Page fully loaded and visible
	d20plus.Init = async function () {
		const scriptName = `betteR20-5etools v${d20plus.version}`;
		try {
			d20plus.ut.log("Init (v" + d20plus.version + ")");
			d20plus.ut.showLoadingMessage(scriptName);

			d20plus.ut.checkVersion("5etools");
			d20plus.settingsHtmlHeader = `<hr><h3>betteR20-5etools v${d20plus.version}</h3>`;

			d20plus.template.swapTemplates();

			d20plus.ut.addAllCss();
			if (window.is_gm) {
				d20plus.ut.log("Is GM");
				d20plus.engine.enhancePageSelector();
			} else d20plus.ut.log("Not GM. Some functionality will be unavailable.");

			d20plus.setSheet();
			await d20plus.js.pAddScripts();
			await d20plus.qpi.pInitMockApi();
			await d20plus.js.pAddApiScripts();

			JqueryUtil.initEnhancements();
			await loadHomebrewMetadata();

			await d20plus.pAddJson();
			await monkeyPatch5etoolsCode();

			if (window.is_gm) await d20plus.cfg.pLoadConfig();
			else await d20plus.cfg.pLoadPlayerConfig();

			if (window.is_gm) await d20plus.art.pLoadArt();

			d20plus.bindDropLocations();
			d20plus.ui.addHtmlHeader();
			d20plus.addCustomHTML();
			d20plus.ui.addHtmlFooter();
			d20plus.engine.enhanceMarkdown();
			d20plus.engine.addProFeatures();
			d20plus.art.initArtFromUrlButtons();
			if (window.is_gm) {
				d20plus.journal.addJournalCommands();
				d20plus.engine.addSelectedTokenCommands();
				d20plus.art.addCustomArtSearch();
				d20plus.engine.addTokenHover();
				d20plus.engine.enhanceTransmogrifier();
				d20plus.engine.removeLinkConfirmation();
				d20plus.artBrowse.initRepoBrowser();
				d20plus.ui.addQuickUiGm();
				d20plus.anim.animatorTool.init();
				// Better20 jukebox tab
				d20plus.remoteLibre.init();
				d20plus.jukeboxWidget.init();
			}
			d20.Campaign.pages.each(d20plus.bindGraphics);
			d20.Campaign.activePage().collection.on("add", d20plus.bindGraphics);
			d20plus.engine.addSelectedTokenCommands();
			d20plus.engine.enhanceStatusEffects();
			d20plus.engine.enhanceMeasureTool();
			d20plus.engine.enhanceMouseDown();
			d20plus.engine.enhanceMouseMove();
			d20plus.engine.addLineCutterTool();
			d20plus.engine.enhancePathWidths();
			//d20plus.ut.disable3dDice();
			d20plus.engine.addLayers();
			d20plus.weather.addWeather();
			d20plus.engine.repairPrototypeMethods();
			d20plus.engine.disableFrameRecorder();
			// d20plus.ut.fixSidebarLayout();
			d20plus.chat.enhanceChat();

			// apply config
			if (window.is_gm) {
				d20plus.cfg.baseHandleConfigChange();
				d20plus.handleConfigChange();
			} else {
				d20plus.cfg.startPlayerConfigHandler();
			}

			d20plus.ut.log("All systems operational");
			d20plus.ut.chatTag(`betteR20-5etools v${d20plus.version}`);
		} catch (e) {
			console.error(e);
			alert(`${scriptName} failed to initialise! See the logs (CTRL-SHIFT-J) for more information.`)
		}
	};

	async function loadHomebrewMetadata () {
		d20plus.ut.log("Loading homebrew metadata");
		const brewUrl = DataUtil.brew.getDirUrl("creature");
		try {
			const brewMeta = await DataUtil.loadJSON(brewUrl);
			brewMeta.forEach(it => {
				const url = `${it.download_url}${d20plus.ut.getAntiCacheSuffix()}`;
				const name = `Homebrew: ${it.name.trim().replace(/\.json$/i, "")}`;
				monsterBrewDataUrls.push({url, name});
			});
		} catch (e) {
			d20plus.ut.error(`Failed to load bestiary homebrew metadata!`);
		}

		try {
			brewCollectionIndex = await DataUtil.brew.pLoadCollectionIndex();
		} catch (e) {
			d20plus.ut.error("Failed to pre-load homebrew collection index");
		}
	}

	async function monkeyPatch5etoolsCode () {
		IS_VTT = true; // global variable from 5etools' utils.js
		BrewUtil._buildSourceCache = function () {
			// no-op when building source cache; we'll handle this elsewhere
			BrewUtil._sourceCache = BrewUtil._sourceCache || {};
		};
		// dummy values
		BrewUtil.homebrew = {};
		BrewUtil.homebrewMeta = {};

		Renderer.get().setBaseUrl(BASE_SITE_URL);
	}
};

SCRIPT_EXTENSIONS.push(betteR205etools);


const betteR205etoolsMain = function () {
	const IMG_URL = BASE_SITE_URL + "img/";

	const SPELL_DATA_DIR = `${DATA_URL}spells/`;
	const SPELL_META_URL = `${SPELL_DATA_DIR}roll20.json`;
	const MONSTER_DATA_DIR = `${DATA_URL}bestiary/`;
	const ADVENTURE_DATA_DIR = `${DATA_URL}adventure/`;
	const CLASS_DATA_DIR = `${DATA_URL}class/`;

	const ITEM_DATA_URL = `${DATA_URL}items.json`;
	const FEAT_DATA_URL = `${DATA_URL}feats.json`;
	const PSIONIC_DATA_URL = `${DATA_URL}psionics.json`;
	const OBJECT_DATA_URL = `${DATA_URL}objects.json`;
	const BACKGROUND_DATA_URL = `${DATA_URL}backgrounds.json`;
	const OPT_FEATURE_DATA_URL = `${DATA_URL}optionalfeatures.json`;
	const RACE_DATA_URL = `${DATA_URL}races.json`;

	// the GitHub API has a 60 requests/hour limit per IP which we quickly hit if the user refreshes their Roll20 a couple of times
	// embed shitty OAth2 details here to enable 5k/hour requests per IP (sending them with requests to the API relaxes the limit)
	// naturally these are client-visible and should not be used to secure anything
	const HOMEBREW_CLIENT_ID = `67e57877469da38a85a7`;
	const HOMEBREW_CLIENT_SECRET = `c00dede21ca63a855abcd9a113415e840aca3f92`;

	const REQUIRED_PROPS = {
		"monster": [
			"ac",
			"alignment",
			"cha",
			"con",
			"cr",
			"dex",
			"hp",
			"int",
			"name",
			"passive",
			"size",
			"source",
			"speed",
			"str",
			"type",
			"wis"
		],
		"spell": [
			"name",
			"level",
			"school",
			"time",
			"range",
			"components",
			"duration",
			"classes",
			"entries",
			"source"
		],
		"item": [
			"name",
			"rarity",
			"source"
		],
		"psionic": [
			"name",
			"source",
			"type"
		],
		"feat": [
			"name",
			"source",
			"entries"
		],
		"object": [
			"name",
			"source",
			"size",
			"type",
			"ac",
			"hp",
			"immune",
			"entries"
		],
		"class": [
			"name",
			"source",
			"hd",
			"proficiency",
			"classTableGroups",
			"startingProficiencies",
			"startingEquipment",
			"classFeatures",
			"subclassTitle",
			"subclasses"
		],
		"subclass": [

		],
		"background": [
			"name",
			"source",
			"skillProficiencies",
			"entries"
		],
		"race": [
			"name",
			"source"
		],
		"optionalfeature": [
			"name",
			"source",
			"entries"
		]
	};

	let spellDataUrls = {};
	let spellMetaData = {};
	let monsterDataUrls = {};
	let monsterFluffDataUrls = {};
	let monsterFluffData = {};
	let monsterMetadata = {};
	let adventureMetadata = {};
	let itemMetadata = {};
	let classDataUrls = {};
	let brewCollectionIndex = {};

	let monsterBrewDataUrls = [];

// build a big dictionary of sheet properties to be used as reference throughout // TODO use these as reference throughout
	function SheetAttribute (name, ogl, shaped) {
		this.name = name;
		this.ogl = ogl;
		this.shaped = shaped;
	}

	NPC_SHEET_ATTRIBUTES = {};
// these (other than the name, which is for display only) are all lowercased; any comparison should be lowercased
	NPC_SHEET_ATTRIBUTES["empty"] = new SheetAttribute("--Empty--", "", "");
// TODO: implement custom entry (enable textarea)
//NPC_SHEET_ATTRIBUTES["custom"] = new SheetAttribute("-Custom-", "-Custom-", "-Custom-");
	NPC_SHEET_ATTRIBUTES["npc_hpbase"] = new SheetAttribute("HP", "npc_hpbase", "npc_hpbase");
	NPC_SHEET_ATTRIBUTES["npc_ac"] = new SheetAttribute("AC", "npc_ac", "ac");
	NPC_SHEET_ATTRIBUTES["passive"] = new SheetAttribute("Passive Perception", "passive", "passive");
	NPC_SHEET_ATTRIBUTES["npc_hpformula"] = new SheetAttribute("HP Formula", "npc_hpformula", "npc_hpformula");
	NPC_SHEET_ATTRIBUTES["npc_speed"] = new SheetAttribute("Speed", "npc_speed", "npc_speed");
	NPC_SHEET_ATTRIBUTES["spell_save_dc"] = new SheetAttribute("Spell Save DC", "spell_save_dc", "spell_save_DC");
	NPC_SHEET_ATTRIBUTES["npc_legendary_actions"] = new SheetAttribute("Legendary Actions", "npc_legendary_actions", "npc_legendary_actions");
	NPC_SHEET_ATTRIBUTES["npc_challenge"] = new SheetAttribute("CR", "npc_challenge", "challenge");

	PC_SHEET_ATTRIBUTES = {};
	PC_SHEET_ATTRIBUTES["empty"] = new SheetAttribute("--Default--", "", "");
	PC_SHEET_ATTRIBUTES["hp"] = new SheetAttribute("Current HP", "hp", "HP");
	PC_SHEET_ATTRIBUTES["ac"] = new SheetAttribute("AC", "ac", "ac"); // TODO check shaped
	PC_SHEET_ATTRIBUTES["passive_wisdom"] = new SheetAttribute("Passive Perception", "passive_wisdom", "passive_wisdom"); // TODO check shaped
	PC_SHEET_ATTRIBUTES["speed"] = new SheetAttribute("Speed", "speed", "speed"); // TODO check shaped
	PC_SHEET_ATTRIBUTES["spell_save_dc"] = new SheetAttribute("Spell Save DC", "spell_save_dc", "spell_save_dc"); // TODO check shaped

	addConfigOptions("token", {
		"_name": "Tokens",
		"_player": true,
		"bar1": {
			"name": "Bar 1 (NPC)",
			"default": "npc_hpbase",
			"_type": "_SHEET_ATTRIBUTE",
			"_player": true
		},
		"bar1_pc": {
			"name": "Bar 1 (PC)",
			"default": "",
			"_type": "_SHEET_ATTRIBUTE_PC"
		},
		"bar1_max": {
			"name": "Set Bar 1 Max",
			"default": true,
			"_type": "boolean",
			"_player": true
		},
		"bar1_reveal": {
			"name": "Reveal Bar 1",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"bar2": {
			"name": "Bar 2 (NPC)",
			"default": "npc_ac",
			"_type": "_SHEET_ATTRIBUTE",
			"_player": true
		},
		"bar2_pc": {
			"name": "Bar 2 (PC)",
			"default": "",
			"_type": "_SHEET_ATTRIBUTE_PC"
		},
		"bar2_max": {
			"name": "Set Bar 2 Max",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"bar2_reveal": {
			"name": "Reveal Bar 2",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"bar3": {
			"name": "Bar 3 (NPC)",
			"default": "passive",
			"_type": "_SHEET_ATTRIBUTE",
			"_player": true
		},
		"bar3_pc": {
			"name": "Bar 3 (PC)",
			"default": "",
			"_type": "_SHEET_ATTRIBUTE_PC"
		},
		"bar3_max": {
			"name": "Set Bar 3 Max",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"bar3_reveal": {
			"name": "Reveal Bar 3",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"rollHP": {
			"name": "Roll Token HP",
			"default": false,
			"_type": "boolean"
		},
		"maximiseHp": {
			"name": "Maximise Token HP",
			"default": false,
			"_type": "boolean"
		},
		"name": {
			"name": "Show Nameplate",
			"default": true,
			"_type": "boolean",
			"_player": true
		},
		"name_reveal": {
			"name": "Reveal Nameplate",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
		"barLocation": {
			"name": "Bar Location",
			"default": "above",
			"_type": "_enum",
			"__values": [
				"Above",
				"Top Overlapping",
				"Bottom Overlapping",
				"Below"
			],
			"_player": true
		},
		"isCompactBars": {
			"name": "Compact Bars",
			"default": false,
			"_type": "boolean",
			"_player": true
		},
	});
	addConfigOptions("import", {
		"_name": "Import",
		"allSourcesIncludeUnofficial": {
			"name": `Include Unofficial (UA/etc) Content in "Import Monsters From All Sources" List`,
			"default": false,
			"_type": "boolean"
		},
		"allSourcesIncludeHomebrew": {
			"name": `Include Homebrew in "Import Monsters From All Sources" List (Warning: Slow)`,
			"default": false,
			"_type": "boolean"
		},
		"importIntervalHandout": {
			"name": "Rest Time between Each Handout (msec)",
			"default": 100,
			"_type": "integer"
		},
		"importIntervalCharacter": {
			"name": "Rest Time between Each Character (msec)",
			"default": 2500,
			"_type": "integer"
		},
		"importFluffAs": {
			"name": "Import Creature Fluff As...",
			"default": "Bio",
			"_type": "_enum",
			"__values": ["Bio", "GM Notes"]
		},
		"importCharAvatar": {
			"name": "Set Character Avatar As...",
			"default": "Portrait (where available)",
			"_type": "_enum",
			"__values": ["Portrait (where available)", "Token"]
		},
		"whispermode": {
			"name": "Sheet Whisper Mode on Import",
			"default": "Toggle (Default GM)",
			"_type": "_WHISPERMODE"
		},
		"advantagemode": {
			"name": "Sheet Advantage Mode on Import",
			"default": "Toggle (Default Advantage)",
			"_type": "_ADVANTAGEMODE"
		},
		"damagemode": {
			"name": "Sheet Auto Roll Damage Mode on Import",
			"default": "Auto Roll",
			"_type": "_DAMAGEMODE"
		},
		"hideActionDescs": {
			"name": "Hide Action Descriptions on Import",
			"default": false,
			"_type": "boolean"
		},
		"skipSenses": {
			"name": "Skip Importing Creature Senses",
			"default": false,
			"_type": "boolean"
		},
		"showNpcNames": {
			"name": "Show NPC Names in Rolls",
			"default": true,
			"_type": "boolean"
		},
		"dexTiebreaker": {
			"name": "Add DEX Tiebreaker to Initiative",
			"default": false,
			"_type": "boolean"
		},
		"tokenactions": {
			"name": "Add TokenAction Macros on Import (Actions)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsTraits": {
			"name": "Add TokenAction Macros on Import (Traits)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsSkills": {
			"name": "Add TokenAction Macros on Import (Skills)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsPerception": {
			"name": "Add TokenAction Macros on Import (Perception)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsSaves": {
			"name": "Add TokenAction Macros on Import (Saves)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsInitiative": {
			"name": "Add TokenAction Macros on Import (Initiative)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsChecks": {
			"name": "Add TokenAction Macros on Import (Checks)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsOther": {
			"name": "Add TokenAction Macros on Import (Other)",
			"default": true,
			"_type": "boolean"
		},
		"tokenactionsSpells": {
			"name": "Add TokenAction Macros on Import (Spells)",
			"default": true,
			"_type": "boolean"
		},
		"namesuffix": {
			"name": "Append Text to Names on Import",
			"default": "",
			"_type": "String"
		}
	});
	addConfigOptions("interface", {
		"_name": "Interface",
		"_player": true,
		"customTracker": {
			"name": "Add Additional Info to Tracker",
			"default": true,
			"_type": "boolean"
		},
		"trackerCol1": {
			"name": "Tracker Column 1",
			"default": "HP",
			"_type": "_FORMULA"
		},
		"trackerCol2": {
			"name": "Tracker Column 2",
			"default": "AC",
			"_type": "_FORMULA"
		},
		"trackerCol3": {
			"name": "Tracker Column 3",
			"default": "PP",
			"_type": "_FORMULA"
		},
		"trackerSheetButton": {
			"name": "Add Sheet Button To Tracker",
			"default": false,
			"_type": "boolean"
		},
		"minifyTracker": {
			"name": "Shrink Initiative Tracker Text",
			"default": false,
			"_type": "boolean"
		},
		"showDifficulty": {
			"name": "Show Difficulty in Tracker",
			"default": true,
			"_type": "boolean"
		},
		"emoji": {
			"name": "Add Emoji Replacement to Chat",
			"default": true,
			"_type": "boolean",
			"_player": true
		},
		"showCustomArtPreview": {
			"name": "Show Custom Art Previews",
			"default": true,
			"_type": "boolean"
		}
	});

	d20plus.sheet = "ogl";
	d20plus.psionics = {};
	d20plus.races = {};
	d20plus.objects = {};
	d20plus.adventures = {};
	d20plus.optionalfeatures = {};

	d20plus.advantageModes = ["Toggle (Default Advantage)", "Toggle", "Toggle (Default Disadvantage)", "Always", "Query", "Never"];
	d20plus.whisperModes = ["Toggle (Default GM)", "Toggle (Default Public)", "Always", "Query", "Never"];
	d20plus.damageModes = ["Auto Roll", "Don't Auto Roll"];

	d20plus.formulas = {
		_options: ["--Empty--", "AC", "HP", "Passive Perception", "Spell DC"],
		"ogl": {
			"cr": "@{npc_challenge}",
			"ac": "@{ac}",
			"npcac": "@{npc_ac}",
			"hp": "@{hp}",
			"pp": "@{passive_wisdom}",
			"macro": "",
			"spellDc": "@{spell_save_dc}"
		},
		"community": {
			"cr": "@{npc_challenge}",
			"ac": "@{AC}",
			"npcac": "@{AC}",
			"hp": "@{HP}",
			"pp": "10 + @{perception}",
			"macro": "",
			"spellDc": "@{spell_save_dc}"
		},
		"shaped": {
			"cr": "@{challenge}",
			"ac": "@{AC}",
			"npcac": "@{AC}",
			"hp": "@{HP}",
			"pp": "@{repeating_skill_$11_passive}",
			"macro": "shaped_statblock",
			"spellDc": "@{spell_save_dc}"
		}
	};

	if (!d20plus.ut.isUseSharedJs()) {
		d20plus.js.scripts.push({name: "5etoolsRender", url: `${SITE_JS_URL}render.js`});
		d20plus.js.scripts.push({name: "5etoolsScalecreature", url: `${SITE_JS_URL}scalecreature.js`});
	}

	d20plus.json = [
		{name: "class index", url: `${CLASS_DATA_DIR}index.json`, isJson: true},
		{name: "spell index", url: `${SPELL_DATA_DIR}index.json`, isJson: true},
		{name: "spell metadata", url: SPELL_META_URL, isJson: true},
		{name: "bestiary index", url: `${MONSTER_DATA_DIR}index.json`, isJson: true},
		{name: "bestiary fluff index", url: `${MONSTER_DATA_DIR}fluff-index.json`, isJson: true},
		{name: "bestiary metadata", url: `${MONSTER_DATA_DIR}legendarygroups.json`, isJson: true},
		{name: "adventures index", url: `${DATA_URL}adventures.json`, isJson: true},
		{name: "base items", url: `${DATA_URL}items-base.json`, isJson: true},
		{name: "item modifiers", url: `${DATA_URL}roll20-items.json`, isJson: true},
	];

	// add JSON index/metadata
	d20plus.pAddJson = async function () {
		d20plus.ut.log("Load JSON");

		await Promise.all(d20plus.json.map(async it => {
			const data = await d20plus.js.pLoadWithRetries(it.name, it.url, true);

			if (it.name === "class index") classDataUrls = data;
			else if (it.name === "spell index") spellDataUrls = data;
			else if (it.name === "spell metadata") spellMetaData = data;
			else if (it.name === "bestiary index") monsterDataUrls = data;
			else if (it.name === "bestiary fluff index") monsterFluffDataUrls = data;
			else if (it.name === "bestiary metadata") monsterMetadata = data;
			else if (it.name === "adventures index") adventureMetadata = data;
			else if (it.name === "base items") {
				data.itemProperty.forEach(p => Renderer.item._addProperty(p));
				data.itemType.forEach(t => Renderer.item._addType(t));
			}
			else if (it.name === "item modifiers") itemMetadata = data;
			else throw new Error(`Unhandled data from JSON ${it.name} (${it.url})`);

			d20plus.ut.log(`JSON [${it.name}] Loaded`);
		}));
	};

	d20plus.handleConfigChange = function (isSyncingPlayer) {
		if (!isSyncingPlayer) d20plus.ut.log("Applying config");
		if (window.is_gm) {
			d20plus.setInitiativeShrink(d20plus.cfg.get("interface", "minifyTracker"));
			d20.Campaign.initiativewindow.rebuildInitiativeList();
			d20plus.updateDifficulty();
			if (d20plus.art.refreshList) d20plus.art.refreshList();
		}
	};

	// get the user config'd token HP bar
	d20plus.getCfgHpBarNumber = function () {
		const bars = [
			d20plus.cfg.get("token", "bar1"),
			d20plus.cfg.get("token", "bar2"),
			d20plus.cfg.get("token", "bar3")
		];
		return bars[0] === "npc_hpbase" ? 1 : bars[1] === "npc_hpbase" ? 2 : bars[2] === "npc_hpbase" ? 3 : null;
	};

	// Bind Graphics Add on page
	d20plus.bindGraphics = function (page) {
		d20plus.ut.log("Bind Graphics");
		try {
			if (page.get("archived") === false) {
				page.thegraphics.on("add", function (e) {
					var character = e.character;
					if (character) {
						var npc = character.attribs.find(function (a) {
							return a.get("name").toLowerCase() == "npc";
						});
						var isNPC = npc ? parseInt(npc.get("current")) : 0;
						// Set bars if configured to do so
						var barsList = ["bar1", "bar2", "bar3"];
						$.each(barsList, (i, barName) => {
							// PC config keys are suffixed "_pc"
							const confVal = d20plus.cfg.get("token", `${barName}${isNPC ? "" : "_pc"}`);
							if (confVal) {
								const charAttr = character.attribs.find(a => a.get("name").toLowerCase() == confVal);
								if (charAttr) {
									e.attributes[barName + "_value"] = charAttr.get("current");
									if (d20plus.cfg.has("token", barName + "_max")) {
										if (d20plus.cfg.get("token", barName + "_max") && !isNPC && confVal === "hp") { // player HP is current; need to set max to max
											e.attributes[barName + "_max"] = charAttr.get("max");
										} else {
											if (isNPC) {
												// TODO: Setting a value to empty/null does not overwrite existing values on the token.
												// setting a specific value does. Must figure this out.
												e.attributes[barName + "_max"] = d20plus.cfg.get("token", barName + "_max") ? charAttr.get("current") : "";
											} else {
												// preserve default token for player tokens
												if (d20plus.cfg.get("token", barName + "_max")) {
													e.attributes[barName + "_max"] = charAttr.get("current");
												}
											}
										}
									}
									if (d20plus.cfg.has("token", barName + "_reveal")) {
										e.attributes["showplayers_" + barName] = d20plus.cfg.get("token", barName + "_reveal");
									}
								}
							}
						});

						// NPC-only settings
						if (isNPC) {
							// Set Nametag
							if (d20plus.cfg.has("token", "name")) {
								e.attributes["showname"] = d20plus.cfg.get("token", "name");
								if (d20plus.cfg.has("token", "name_reveal")) {
									e.attributes["showplayers_name"] = d20plus.cfg.get("token", "name_reveal");
								}
							}

							// Roll HP
							// TODO: npc_hpbase appears to be hardcoded here? Refactor for NPC_SHEET_ATTRIBUTES?
							if ((d20plus.cfg.get("token", "rollHP") || d20plus.cfg.get("token", "maximiseHp")) && d20plus.cfg.getCfgKey("token", "npc_hpbase")) {
								var hpf = character.attribs.find(function (a) {
									return a.get("name").toLowerCase() == NPC_SHEET_ATTRIBUTES["npc_hpformula"][d20plus.sheet];
								});
								var barName = d20plus.cfg.getCfgKey("token", "npc_hpbase");

								if (hpf && hpf.get("current")) {
									var hpformula = hpf.get("current");
									if (d20plus.cfg.get("token", "maximiseHp")) {
										const maxSum = hpformula.replace("d", "*");
										try {
											const max = eval(maxSum);
											if (!isNaN(max)) {
												e.attributes[barName + "_value"] = max;
												e.attributes[barName + "_max"] = max;
											}
										} catch (error) {
											d20plus.ut.log("Error Maximising HP");
											console.log(error);
										}
									} else {
										d20plus.ut.randomRoll(hpformula, function (result) {
											e.attributes[barName + "_value"] = result.total;
											e.attributes[barName + "_max"] = result.total;
											d20plus.ut.log("Rolled HP for [" + character.get("name") + "]");
										}, function (error) {
											d20plus.ut.log("Error Rolling HP Dice");
											console.log(error);
										});
									}
								}
							}
						}
					}
				});
			}
		} catch (e) {
			console.log("D20Plus bindGraphics Exception", e);
			console.log("PAGE", page);
		}
	};

// bind token HP to initiative tracker window HP field
	d20plus.bindToken = function (token) {
		function getInitTrackerToken () {
			const $window = $("#initiativewindow");
			if (!$window.length) return [];
			return $window.find(`li.token`).filter((i, e) => {
				return $(e).data("tokenid") === token.id;
			});
		}

		const $initToken = getInitTrackerToken();
		if (!$initToken.length) return;
		const $iptHp = $initToken.find(`.hp.editable`);
		const npcFlag = token.character ? token.character.attribs.find((a) => {
			return a.get("name").toLowerCase() === "npc";
		}) : null;
		// if there's a HP column enabled
		if ($iptHp.length) {
			let toBind;
			if (!token.character || npcFlag && npcFlag.get("current") == "1") {
				const hpBar = d20plus.getCfgHpBarNumber();
				// and a HP bar chosen
				if (hpBar) {
					$iptHp.text(token.attributes[`bar${hpBar}_value`])
				}

				toBind = (token, changes) => {
					const $initToken = getInitTrackerToken();
					if (!$initToken.length) return;
					const $iptHp = $initToken.find(`.hp.editable`);
					const hpBar = d20plus.getCfgHpBarNumber();

					if ($iptHp && hpBar) {
						if (changes.changes[`bar${hpBar}_value`]) {
							$iptHp.text(token.changed[`bar${hpBar}_value`]);
						}
					}
				};
			} else {
				toBind = (token, changes) => {
					const $initToken = getInitTrackerToken();
					if (!$initToken.length) return;
					const $iptHp = $initToken.find(`.hp.editable`);
					if ($iptHp) {
						$iptHp.text(token.character.autoCalcFormula(d20plus.formulas[d20plus.sheet].hp));
					}
				}
			}
			// clean up old handler
			if (d20plus.tokenBindings[token.id]) token.off("change", d20plus.tokenBindings[token.id]);
			// add new handler
			d20plus.tokenBindings[token.id] = toBind;
			token.on("change", toBind);
		}
	};
	d20plus.tokenBindings = {};

// Determine difficulty of current encounter (iniativewindow)
	d20plus.getDifficulty = function () {
		var difficulty = "Unknown";
		var partyXPThreshold = [0, 0, 0, 0];
		var players = [];
		var npcs = [];
		try {
			$.each(d20.Campaign.initiativewindow.cleanList(), function (i, v) {
				var page = d20.Campaign.pages.get(v._pageid);
				if (page) {
					var token = page.thegraphics.get(v.id);
					if (token) {
						var char = token.character;
						if (char) {
							var npc = char.attribs.find(function (a) {
								return a.get("name").toLowerCase() === "npc";
							});
							if (npc && (npc.get("current") === 1 || npc.get("current") === "1")) { // just in casies
								npcs.push(char);
							} else {
								var level = char.attribs.find(function (a) {
									return a.get("name").toLowerCase() === "level";
								});
								// Can't determine difficulty without level
								if (!level || partyXPThreshold === null) {
									partyXPThreshold = null;
									return;
								}
								// Total party threshold
								for (i = 0; i < partyXPThreshold.length; i++) partyXPThreshold[i] += Parser.levelToXpThreshold(level.get("current"))[i];
								players.push(players.length + 1);
							}
						}
					}
				}
			});
			if (!players.length) return difficulty;
			// If a player doesn't have level set, fail out.
			if (partyXPThreshold !== null) {
				var len = npcs.length;
				var multiplier = 0;
				var adjustedxp = 0;
				var xp = 0;
				var index = 0;
				// Adjust for number of monsters
				if (len < 2) index = 0;
				else if (len < 3) index = 1;
				else if (len < 7) index = 2;
				else if (len < 11) index = 3;
				else if (len < 15) index = 4;
				else
					index = 5;
				// Adjust for smaller parties
				if (players.length < 3) index++;
				// Set multiplier
				multiplier = d20plus.multipliers[index];
				// Total monster xp
				$.each(npcs, function (i, v) {
					var cr = v.attribs.find(function (a) {
						return a.get("name").toLowerCase() === "npc_challenge";
					});
					if (cr && cr.get("current")) xp += parseInt(Parser.crToXpNumber(cr.get("current")));
				});
				// Encounter's adjusted xp
				adjustedxp = xp * multiplier;
				console.log("Party XP Threshold", partyXPThreshold);
				console.log("Adjusted XP", adjustedxp);
				// Determine difficulty
				if (adjustedxp < partyXPThreshold[0]) difficulty = "Trivial";
				else if (adjustedxp < partyXPThreshold[1]) difficulty = "Easy";
				else if (adjustedxp < partyXPThreshold[2]) difficulty = "Medium";
				else if (adjustedxp < partyXPThreshold[3]) difficulty = "Hard";
				else difficulty = "Deadly";
			}
		} catch (e) {
			console.log("D20Plus getDifficulty Exception", e);
		}
		return difficulty;
	};

	d20plus.formSrcUrl = function (dataDir, fileName) {
		return dataDir + fileName;
	};

	d20plus.addCustomHTML = function () {
		function populateDropdown (dropdownId, inputFieldId, baseUrl, srcUrlObject, defaultSel, homebrewDir) {
			const defaultUrl = defaultSel ? d20plus.formSrcUrl(baseUrl, srcUrlObject[defaultSel]) : "";
			$(inputFieldId).val(defaultUrl);
			const dropdown = $(dropdownId);
			$.each(Object.keys(srcUrlObject), function (i, src) {
				dropdown.append($('<option>', {
					value: d20plus.formSrcUrl(baseUrl, srcUrlObject[src]),
					text: homebrewDir === "class" ? src.uppercaseFirst() : Parser.sourceJsonToFullCompactPrefix(src)
				}));
			});
			dropdown.append($('<option>', {
				value: "",
				text: "Custom"
			}));

			const brewUrl = DataUtil.brew.getDirUrl(homebrewDir);
			DataUtil.loadJSON(brewUrl).then(async (data, debugUrl) => {
				if (data.message) console.error(debugUrl, data.message);

				const collectionItems = Object.keys(brewCollectionIndex).filter(k => brewCollectionIndex[k].includes(BrewUtil._pRenderBrewScreen_dirToCat(homebrewDir)));
				if (collectionItems.length) {
					data = MiscUtil.copy(data);
					const collectionIndex = await DataUtil.loadJSON(DataUtil.brew.getDirUrl("collection"));
					collectionIndex.filter(it => collectionItems.includes(it.name)).forEach(it => data.push(it));
				}

				data.sort((a, b) => SortUtil.ascSortLower(a.name, b.name)).forEach(it => {
					dropdown.append($('<option>', {
						value: `${it.download_url}${d20plus.ut.getAntiCacheSuffix()}`,
						text: `Homebrew: ${it.name.trim().replace(/\.json$/i, "")}`
					}));
				});
			}, brewUrl);

			dropdown.val(defaultUrl);
			dropdown.change(function () {
				$(inputFieldId).val(this.value);
			});
		}

		function populateBasicDropdown (dropdownId, inputFieldId, defaultSel, homebrewDir, addForPlayers) {
			function doPopulate (dropdownId, inputFieldId) {
				const $sel = $(dropdownId);
				const existingItems = !!$sel.find(`option`).length;
				if (defaultSel) {
					$(inputFieldId).val(defaultSel);
					$sel.append($('<option>', {
						value: defaultSel,
						text: "Official Sources"
					}));
				}
				if (!existingItems) {
					$sel.append($('<option>', {
						value: "",
						text: "Custom"
					}));
				}

				const brewUrl = DataUtil.brew.getDirUrl(homebrewDir);
				DataUtil.loadJSON(brewUrl).then(async (data, debugUrl) => {
					if (data.message) console.error(debugUrl, data.message);

					const collectionItems = Object.keys(brewCollectionIndex).filter(k => brewCollectionIndex[k].includes(homebrewDir));
					if (collectionItems.length) {
						data = MiscUtil.copy(data);
						const collectionIndex = await DataUtil.loadJSON(DataUtil.brew.getDirUrl("collection"));
						collectionIndex.filter(it => collectionItems.includes(it.name)).forEach(it => data.push(it));
					}

					data.forEach(it => {
						$sel.append($('<option>', {
							value: `${it.download_url}${d20plus.ut.getAntiCacheSuffix()}`,
							text: `Homebrew: ${it.name.trim().replace(/\.json$/i, "")}`
						}));
					});
				}, brewUrl);

				$sel.val(defaultSel);
				$sel.change(function () {
					$(inputFieldId).val(this.value);
				});
			}

			doPopulate(dropdownId, inputFieldId, defaultSel, homebrewDir);
			if (addForPlayers) doPopulate(`${dropdownId}-player`, `${inputFieldId}-player`, defaultSel, homebrewDir);
		}

		const $body = $("body");
		if (window.is_gm) {
			const $wrpSettings = $(`#betteR20-settings`);

			$wrpSettings.append(d20plus.settingsHtmlImportHeader);
			$wrpSettings.append(d20plus.settingsHtmlSelector);
			$wrpSettings.append(d20plus.settingsHtmlPtMonsters);
			$wrpSettings.append(d20plus.settingsHtmlPtItems);
			$wrpSettings.append(d20plus.settingsHtmlPtSpells);
			$wrpSettings.append(d20plus.settingsHtmlPtPsionics);
			$wrpSettings.append(d20plus.settingsHtmlPtRaces);
			$wrpSettings.append(d20plus.settingsHtmlPtFeats);
			$wrpSettings.append(d20plus.settingsHtmlPtObjects);
			$wrpSettings.append(d20plus.settingsHtmlPtClasses);
			$wrpSettings.append(d20plus.settingsHtmlPtSubclasses);
			$wrpSettings.append(d20plus.settingsHtmlPtBackgrounds);
			$wrpSettings.append(d20plus.settingsHtmlPtOptfeatures);
			const $ptAdventures = $(d20plus.settingsHtmlPtAdventures);
			$wrpSettings.append($ptAdventures);
			$ptAdventures.find(`.Vetools-module-tool-open`).click(() => d20plus.tool.get('MODULES').openFn());
			$wrpSettings.append(d20plus.settingsHtmlPtImportFooter);

			$("#mysettings > .content a#button-monsters-load").on(window.mousedowntype, d20plus.monsters.button);
			$("#mysettings > .content a#button-monsters-load-all").on(window.mousedowntype, d20plus.monsters.buttonAll);
			$("#mysettings > .content a#import-objects-load").on(window.mousedowntype, d20plus.objects.button);
			$("#mysettings > .content a#button-adventures-load").on(window.mousedowntype, d20plus.adventures.button);

			$("#mysettings > .content a#bind-drop-locations").on(window.mousedowntype, d20plus.bindDropLocations);
			$("#initiativewindow .characterlist").before(d20plus.initiativeHeaders);

			d20plus.setTurnOrderTemplate();
			d20.Campaign.initiativewindow.rebuildInitiativeList();
			d20plus.hpAllowEdit();
			d20.Campaign.initiativewindow.model.on("change:turnorder", function () {
				d20plus.updateDifficulty();
			});
			d20plus.updateDifficulty();

			populateDropdown("#button-monsters-select", "#import-monster-url", MONSTER_DATA_DIR, monsterDataUrls, "MM", "creature");
			populateBasicDropdown("#button-objects-select", "#import-objects-url", OBJECT_DATA_URL, "object");

			populateAdventuresDropdown();

			function populateAdventuresDropdown () {
				const defaultAdvUrl = d20plus.formSrcUrl(ADVENTURE_DATA_DIR, "adventure-lmop.json");
				const $iptUrl = $("#import-adventures-url");
				$iptUrl.val(defaultAdvUrl);
				$iptUrl.data("id", "lmop");
				const $sel = $("#button-adventures-select");
				adventureMetadata.adventure.forEach(a => {
					$sel.append($('<option>', {
						value: d20plus.formSrcUrl(ADVENTURE_DATA_DIR, `adventure-${a.id.toLowerCase()}.json|${a.id}`),
						text: a.name
					}));
				});
				$sel.append($('<option>', {
					value: "",
					text: "Custom"
				}));
				$sel.val(defaultAdvUrl);
				$sel.change(() => {
					const [url, id] = $sel.val().split("|");
					$($iptUrl).val(url);
					$iptUrl.data("id", id);
				});
			}

			// import
			$("a#button-spells-load").on(window.mousedowntype, () => d20plus.spells.button());
			$("a#button-spells-load-all").on(window.mousedowntype, () => d20plus.spells.buttonAll());
			$("a#import-psionics-load").on(window.mousedowntype, () => d20plus.psionics.button());
			$("a#import-items-load").on(window.mousedowntype, () => d20plus.items.button());
			$("a#import-races-load").on(window.mousedowntype, () => d20plus.races.button());
			$("a#import-feats-load").on(window.mousedowntype, () => d20plus.feats.button());
			$("a#button-classes-load").on(window.mousedowntype, () => d20plus.classes.button());
			$("a#button-classes-load-all").on(window.mousedowntype, () => d20plus.classes.buttonAll());
			$("a#import-subclasses-load").on(window.mousedowntype, () => d20plus.subclasses.button());
			$("a#import-backgrounds-load").on(window.mousedowntype, () => d20plus.backgrounds.button());
			$("a#import-optionalfeatures-load").on(window.mousedowntype, () => d20plus.optionalfeatures.button());
			$("select#import-mode-select").on("change", () => d20plus.importer.importModeSwitch());
		} else {
			// player-only HTML if required
		}

		$body.append(d20plus.playerImportHtml);
		const $winPlayer = $("#d20plus-playerimport");
		const $appTo = $winPlayer.find(`.append-target`);
		$appTo.append(d20plus.settingsHtmlSelectorPlayer);
		$appTo.append(d20plus.settingsHtmlPtItemsPlayer);
		$appTo.append(d20plus.settingsHtmlPtSpellsPlayer);
		$appTo.append(d20plus.settingsHtmlPtPsionicsPlayer);
		$appTo.append(d20plus.settingsHtmlPtRacesPlayer);
		$appTo.append(d20plus.settingsHtmlPtFeatsPlayer);
		$appTo.append(d20plus.settingsHtmlPtClassesPlayer);
		$appTo.append(d20plus.settingsHtmlPtSubclassesPlayer);
		$appTo.append(d20plus.settingsHtmlPtBackgroundsPlayer);
		$appTo.append(d20plus.settingsHtmlPtOptfeaturesPlayer);

		$winPlayer.dialog({
			autoOpen: false,
			resizable: true,
			width: 800,
			height: 650,
		});

		const $wrpPlayerImport = $(`
			<div style="padding: 0 10px">
				<div style="clear: both"></div>
			</div>`);
		const $btnPlayerImport = $(`<button class="btn" href="#" title="A tool to import temporary copies of various things, which can be drag-and-dropped to character sheets." style="margin-top: 5px">Temp Import Spells, Items, Classes,...</button>`)
			.on("click", () => {
				$winPlayer.dialog("open");
			});
		$wrpPlayerImport.prepend($btnPlayerImport);
		$(`#journal`).prepend($wrpPlayerImport);

		// SHARED WINDOWS/BUTTONS
		// import
		$("a#button-spells-load-player").on(window.mousedowntype, () => d20plus.spells.button(true));
		$("a#button-spells-load-all-player").on(window.mousedowntype, () => d20plus.spells.buttonAll(true));
		$("a#import-psionics-load-player").on(window.mousedowntype, () => d20plus.psionics.button(true));
		$("a#import-items-load-player").on(window.mousedowntype, () => d20plus.items.button(true));
		$("a#import-races-load-player").on(window.mousedowntype, () => d20plus.races.button(true));
		$("a#import-feats-load-player").on(window.mousedowntype, () => d20plus.feats.button(true));
		$("a#button-classes-load-player").on(window.mousedowntype, () => d20plus.classes.button(true));
		$("a#button-classes-load-all-player").on(window.mousedowntype, () => d20plus.classes.buttonAll(true));
		$("a#import-subclasses-load-player").on(window.mousedowntype, () => d20plus.subclasses.button(true));
		$("a#import-backgrounds-load-player").on(window.mousedowntype, () => d20plus.backgrounds.button(true));
		$("a#import-optionalfeatures-load-player").on(window.mousedowntype, () => d20plus.optionalfeatures.button(true));
		$("select#import-mode-select-player").on("change", () => d20plus.importer.importModeSwitch());

		$body.append(d20plus.importDialogHtml);
		$body.append(d20plus.importListHTML);
		$body.append(d20plus.importListPropsHTML);
		$("#d20plus-import").dialog({
			autoOpen: false,
			resizable: false
		});
		$("#d20plus-importlist").dialog({
			autoOpen: false,
			resizable: true,
			width: 1000,
			height: 700
		});
		$("#d20plus-import-props").dialog({
			autoOpen: false,
			resizable: true,
			width: 300,
			height: 600
		});

		populateDropdown("#button-spell-select", "#import-spell-url", SPELL_DATA_DIR, spellDataUrls, "PHB", "spell");
		populateDropdown("#button-spell-select-player", "#import-spell-url-player", SPELL_DATA_DIR, spellDataUrls, "PHB", "spell");
		populateDropdown("#button-classes-select", "#import-classes-url", CLASS_DATA_DIR, classDataUrls, "", "class");
		populateDropdown("#button-classes-select-player", "#import-classes-url-player", CLASS_DATA_DIR, classDataUrls, "", "class");

		// add class subclasses to the subclasses dropdown(s)
		populateDropdown("#button-subclasses-select", "#import-subclasses-url", CLASS_DATA_DIR, classDataUrls, "", "class");
		populateDropdown("#button-subclasses-select-player", "#import-subclasses-url-player", CLASS_DATA_DIR, classDataUrls, "", "class");

		populateBasicDropdown("#button-items-select", "#import-items-url", ITEM_DATA_URL, "item", true);
		populateBasicDropdown("#button-psionics-select", "#import-psionics-url", PSIONIC_DATA_URL, "psionic", true);
		populateBasicDropdown("#button-feats-select", "#import-feats-url", FEAT_DATA_URL, "feat", true);
		populateBasicDropdown("#button-races-select", "#import-races-url", RACE_DATA_URL, "race", true);
		populateBasicDropdown("#button-subclasses-select", "#import-subclasses-url", "", "subclass", true);
		populateBasicDropdown("#button-backgrounds-select", "#import-backgrounds-url", BACKGROUND_DATA_URL, "background", true);
		populateBasicDropdown("#button-optionalfeatures-select", "#import-optionalfeatures-url", OPT_FEATURE_DATA_URL, "optionalfeature", true);

		// bind tokens button
		const altBindButton = $(`<button id="bind-drop-locations-alt" class="btn bind-drop-locations" title="Bind drop locations and handouts">Bind Drag-n-Drop</button>`);
		altBindButton.on("click", function () {
			d20plus.bindDropLocations();
		});

		if (window.is_gm) {
			const $addPoint = $(`#journal button.btn.superadd`);
			altBindButton.css("margin-right", "5px");
			$addPoint.after(altBindButton);
		} else {
			altBindButton.css("margin-top", "5px");
			const $wrprControls = $(`#search-wrp-controls`);
			$wrprControls.append(altBindButton);
		}
		$("#journal #bind-drop-locations").on(window.mousedowntype, d20plus.bindDropLocations);
	};

	d20plus.updateDifficulty = function () {
		const $initWindow = $("div#initiativewindow");
		if (!$initWindow.parent().is("body")) {
			const $btnPane = $initWindow.parent().find(".ui-dialog-buttonpane");

			let $span = $btnPane.find("span.difficulty");

			if (!$span.length) {
				$btnPane.prepend(d20plus.difficultyHtml);
				$span = $btnPane.find("span.difficulty");
			}

			if (d20plus.cfg.get("interface", "showDifficulty")) {
				$span.text("Difficulty: " + d20plus.getDifficulty());
				$span.show();
			} else {
				$span.hide();
			}
		}
	};

// bind tokens to the initiative tracker
	d20plus.bindTokens = function () {
		// Gets a list of all the tokens on the current page:
		const curTokens = d20.Campaign.pages.get(d20.Campaign.activePage()).thegraphics.toArray();
		curTokens.forEach(t => {
			d20plus.bindToken(t);
		});
	};

// bind drop locations on sheet to accept custom handouts
	d20plus.bindDropLocations = function () {
		if (window.is_gm) {
			// Bind Spells and Items, add compendium-item to each of them
			var journalFolder = d20.Campaign.get("journalfolder");
			if (journalFolder === "") {
				d20.journal.addFolderToFolderStructure("Spells");
				d20.journal.addFolderToFolderStructure("Psionics");
				d20.journal.addFolderToFolderStructure("Items");
				d20.journal.addFolderToFolderStructure("Feats");
				d20.journal.addFolderToFolderStructure("Classes");
				d20.journal.addFolderToFolderStructure("Subclasses");
				d20.journal.addFolderToFolderStructure("Backgrounds");
				d20.journal.addFolderToFolderStructure("Races");
				d20.journal.addFolderToFolderStructure("Optional Features");
				d20.journal.refreshJournalList();
				journalFolder = d20.Campaign.get("journalfolder");
			}
		}

		function addClasses (folderName) {
			$(`#journalfolderroot > ol.dd-list > li.dd-folder > div.dd-content:contains(${folderName})`).parent().find("ol li[data-itemid]").addClass("compendium-item").addClass("ui-draggable").addClass("Vetools-draggable");
		}

		addClasses("Spells");
		addClasses("Psionics");
		addClasses("Items");
		addClasses("Feats");
		addClasses("Classes");
		addClasses("Subclasses");
		addClasses("Backgrounds");
		addClasses("Races");
		addClasses("Optional Features");

		// if player, force-enable dragging
		if (!window.is_gm) {
			$(`.Vetools-draggable`).draggable({
				revert: true,
				distance: 10,
				revertDuration: 0,
				helper: "clone",
				handle: ".namecontainer",
				appendTo: "body",
				scroll: true,
				start: function () {
					$("#journalfolderroot").addClass("externaldrag")
				},
				stop: function () {
					$("#journalfolderroot").removeClass("externaldrag")
				}
			});
		}

		class CharacterAttributesProxy {
			constructor (character) {
				this.character = character;
				this._changedAttrs = [];
			}

			findByName (attrName) {
				return this.character.model.attribs.toJSON()
					.find(a => a.name === attrName) || {};
			}

			findOrGenerateRepeatingRowId (namePattern, current) {
				const [namePrefix, nameSuffix] = namePattern.split(/\$\d?/);
				const attr = this.character.model.attribs.toJSON()
					.find(a => a.name.startsWith(namePrefix) && a.name.endsWith(nameSuffix) && a.current == current);
				return attr ?
					attr.name.replace(RegExp(`^${namePrefix}(.*)${nameSuffix}$`), "$1") :
					d20plus.ut.generateRowId();
			}

			add (name, current, max) {
				this.character.model.attribs.create({
					name: name,
					current: current,
					...(max == undefined ? {} : {max: max})
				}).save();
				this._changedAttrs.push(name);
			}

			addOrUpdate (name, current, max) {
				const id = this.findByName(name).id;
				if (id) {
					this.character.model.attribs.get(id).set({
						current: current,
						...(max == undefined ? {} : {max: max})
					}).save();
					this._changedAttrs.push(name);
				} else {
					this.add(name, current, max);
				}
			}

			notifySheetWorkers () {
				d20.journal.notifyWorkersOfAttrChanges(this.character.model.id, this._changedAttrs);
				this._changedAttrs = [];
			}
		}

		function importFeat (character, data) {
			const featName = data.name;
			const featText = data.Vetoolscontent;
			const attrs = new CharacterAttributesProxy(character);
			const rowId = d20plus.ut.generateRowId();

			if (d20plus.sheet == "ogl") {
				attrs.add(`repeating_traits_${rowId}_options-flag`, "0");
				attrs.add(`repeating_traits_${rowId}_name`, featName);
				attrs.add(`repeating_traits_${rowId}_description`, featText);
				attrs.add(`repeating_traits_${rowId}_source`, "Feat");
			} else if (d20plus.sheet == "shaped") {
				attrs.add(`repeating_feat_${rowId}_name`, featName);
				attrs.add(`repeating_feat_${rowId}_content`, featText);
				attrs.add(`repeating_feat_${rowId}_content_toggle`, "1");
			} else {
				console.warn(`Feat import is not supported for ${d20plus.sheet} character sheet`);
			}

			attrs.notifySheetWorkers();
		}

		async function importBackground (character, data) {
			const bg = data.Vetoolscontent;

			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);
			const renderStack = [];
			let feature = {};
			bg.entries.forEach(e => {
				if (e.name && e.name.includes("Feature:")) {
					feature = JSON.parse(JSON.stringify(e));
					feature.name = feature.name.replace("Feature:", "").trim();
				}
			});
			if (feature) renderer.recursiveRender({entries: feature.entries}, renderStack);
			feature.text = renderStack.length ? d20plus.importer.getCleanText(renderStack.join("")) : "";

			async function chooseSkills (from, count) {
				return new Promise((resolve, reject) => {
					const $dialog = $(`
						<div title="Choose Skills">
							<div name="remain" style="font-weight: bold">Remaining: ${count}</div>
							<div>
								${from.map(it => `<label class="split"><span>${it.toTitleCase()}</span> <input data-skill="${it}" type="checkbox"></label>`).join("")}
							</div>
						</div>
					`).appendTo($("body"));
					const $remain = $dialog.find(`[name="remain"]`);
					const $cbSkill = $dialog.find(`input[type="checkbox"]`);

					$cbSkill.on("change", function () {
						const $e = $(this);
						let selectedCount = getSelected().length;
						if (selectedCount > count) {
							$e.prop("checked", false);
							selectedCount--;
						}
						$remain.text(`Remaining: ${count - selectedCount}`);
					});

					function getSelected () {
						return $cbSkill.map((i, e) => ({skill: $(e).data("skill"), selected: $(e).prop("checked")})).get()
							.filter(it => it.selected).map(it => it.skill);
					}

					$dialog.dialog({
						dialogClass: "no-close",
						buttons: [
							{
								text: "Cancel",
								click: function () {
									$(this).dialog("close");
									$dialog.remove();
									reject(`User cancelled the prompt`);
								}
							},
							{
								text: "OK",
								click: function () {
									const selected = getSelected();
									if (selected.length === count) {
										$(this).dialog("close");
										$dialog.remove();
										resolve(selected);
									} else {
										alert(`Please select ${count} skill${count === 1 ? "" : "s"}`);
									}
								}
							}
						]
					})
				});
			}

			async function chooseSkillsGroup (options) {
				return new Promise((resolve, reject) => {
					const $dialog = $(`
						<div title="Choose Skills">
							<div>
								${options.map((it, i) => `<label class="split"><input name="skill-group" data-ix="${i}" type="radio" ${i === 0 ? `checked` : ""}> <span>${it}</span></label>`).join("")}
							</div>
						</div>
					`).appendTo($("body"));
					const $rdOpt = $dialog.find(`input[type="radio"]`);

					$dialog.dialog({
						dialogClass: "no-close",
						buttons: [
							{
								text: "Cancel",
								click: function () {
									$(this).dialog("close");
									$dialog.remove();
									reject(`User cancelled the prompt`);
								}
							},
							{
								text: "OK",
								click: function () {
									const selected = $rdOpt.filter((i, e) => $(e).prop("checked"))
										.map((i, e) => $(e).data("ix")).get()[0];
									$(this).dialog("close");
									$dialog.remove();
									resolve(selected);
								}
							}
						]
					})
				});
			}

			const skills = [];

			async function handleSkillsItem (item) {
				Object.keys(item).forEach(k => {
					if (k !== "choose") skills.push(k);
				});

				if (item.choose) {
					const choose = item.choose;
					const sansExisting = choose.from.filter(it => !skills.includes(it));
					const count = choose.count || 1;
					const chosenSkills = await chooseSkills(sansExisting, count);
					chosenSkills.forEach(it => skills.push(it));
				}
			}

			if (bg.skillProficiencies && bg.skillProficiencies.length) {
				if (bg.skillProficiencies.length > 1) {
					const options = bg.skillProficiencies.map(item => Renderer.background.getSkillSummary([item], true, []))
					const chosenIndex = await chooseSkillsGroup(options);
					await handleSkillsItem(bg.skillProficiencies[chosenIndex]);
				} else {
					await handleSkillsItem(bg.skillProficiencies[0]);
				}
			}

			const attrs = new CharacterAttributesProxy(character);
			const fRowId = d20plus.ut.generateRowId();

			if (d20plus.sheet === "ogl") {
				attrs.addOrUpdate("background", bg.name);

				attrs.add(`repeating_traits_${fRowId}_name`, feature.name);
				attrs.add(`repeating_traits_${fRowId}_source`, "Background");
				attrs.add(`repeating_traits_${fRowId}_source_type`, bg.name);
				attrs.add(`repeating_traits_${fRowId}_options-flag`, "0");
				if (feature.text) {
					attrs.add(`repeating_traits_${fRowId}_description`, feature.text);
				}

				skills.map(s => s.toLowerCase().replace(/ /g, "_")).forEach(s => {
					attrs.addOrUpdate(`${s}_prof`, `(@{pb}*@{${s}_type})`);
				});
			} else if (d20plus.sheet === "shaped") {
				attrs.addOrUpdate("background", bg.name);
				attrs.add(`repeating_trait_${fRowId}_name`, `${feature.name} (${bg.name})`);
				if (feature.text) {
					attrs.add(`repeating_trait_${fRowId}_content`, feature.text);
					attrs.add(`repeating_trait_${fRowId}_content_toggle`, "1");
				}

				skills.map(s => s.toUpperCase().replace(/ /g, "")).forEach(s => {
					const rowId = attrs.findOrGenerateRepeatingRowId("repeating_skill_$0_storage_name", s);
					attrs.addOrUpdate(`repeating_skill_${rowId}_proficiency`, "proficient");
				});
			} else {
				console.warn(`Background import is not supported for ${d20plus.sheet} character sheet`);
			}

			attrs.notifySheetWorkers();
		}

		function importRace (character, data) {
			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);

			const race = data.Vetoolscontent;

			race.entries.filter(it => typeof it !== "string").forEach(e => {
				const renderStack = [];
				renderer.recursiveRender({entries: e.entries}, renderStack);
				e.text = d20plus.importer.getCleanText(renderStack.join(""));
			});

			const attrs = new CharacterAttributesProxy(character);

			if (d20plus.sheet === "ogl") {
				attrs.addOrUpdate(`race`, race.name);
				attrs.addOrUpdate(`race_display`, race.name);
				attrs.addOrUpdate(`speed`, Parser.getSpeedString(race));

				race.entries.filter(it => it.text).forEach(e => {
					const fRowId = d20plus.ut.generateRowId();
					attrs.add(`repeating_traits_${fRowId}_name`, e.name);
					attrs.add(`repeating_traits_${fRowId}_source`, "Race");
					attrs.add(`repeating_traits_${fRowId}_source_type`, race.name);
					attrs.add(`repeating_traits_${fRowId}_description`, e.text);
					attrs.add(`repeating_traits_${fRowId}_options-flag`, "0");
				});

				if (race.languageProficiencies && race.languageProficiencies.length) {
					// FIXME this discards information
					const profs = race.languageProficiencies[0];
					const asText = Object.keys(profs).filter(it => it !== "choose").map(it => it === "anyStandard" ? "any" : it).map(it => it.toTitleCase()).join(", ");

					const lRowId = d20plus.ut.generateRowId();
					attrs.add(`repeating_proficiencies_${lRowId}_name`, asText);
					attrs.add(`repeating_proficiencies_${lRowId}_options-flag`, "0");
				}
			} else if (d20plus.sheet === "shaped") {
				attrs.addOrUpdate("race", race.name);
				attrs.addOrUpdate("size", Parser.sizeAbvToFull(race.size).toUpperCase());
				attrs.addOrUpdate("speed_string", Parser.getSpeedString(race));

				if (race.speed instanceof Object) {
					for (const locomotion of ["walk", "burrow", "climb", "fly", "swim"]) {
						if (race.speed[locomotion]) {
							const attrName = locomotion === "walk" ? "speed" : `speed_${locomotion}`;
							if (locomotion !== "walk") {
								attrs.addOrUpdate("other_speeds", "1");
							}
							// note: this doesn't cover hover
							attrs.addOrUpdate(attrName, race.speed[locomotion]);
						}
					}
				} else {
					attrs.addOrUpdate("speed", race.speed);
				}

				// really there seems to be only darkvision for PCs
				for (const vision of ["darkvision", "blindsight", "tremorsense", "truesight"]) {
					if (race[vision]) {
						attrs.addOrUpdate(vision, race[vision]);
					}
				}

				race.entries.filter(it => it.text).forEach(e => {
					const fRowId = d20plus.ut.generateRowId();
					attrs.add(`repeating_racialtrait_${fRowId}_name`, e.name);
					attrs.add(`repeating_racialtrait_${fRowId}_content`, e.text);
					attrs.add(`repeating_racialtrait_${fRowId}_content_toggle`, "1");
				});

				const fRowId = d20plus.ut.generateRowId();
				attrs.add(`repeating_modifier_${fRowId}_name`, race.name);
				attrs.add(`repeating_modifier_${fRowId}_ability_score_toggle`, "1");
				(race.ability || []).forEach(raceAbility => {
					Object.keys(raceAbility).filter(it => it !== "choose").forEach(abilityAbv => {
						const value = raceAbility[abilityAbv];
						const ability = Parser.attAbvToFull(abilityAbv).toLowerCase();
						attrs.add(`repeating_modifier_${fRowId}_${ability}_score_modifier`, value);
					});
				});
			} else {
				console.warn(`Race import is not supported for ${d20plus.sheet} character sheet`);
			}

			attrs.notifySheetWorkers();
		}

		function importOptionalFeature (character, data) {
			const optionalFeature = data.Vetoolscontent;
			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);
			const rendered = renderer.render({entries: optionalFeature.entries});
			const optionalFeatureText = d20plus.importer.getCleanText(rendered);

			const attrs = new CharacterAttributesProxy(character);
			const fRowId = d20plus.ut.generateRowId();

			if (d20plus.sheet == "ogl") {
				attrs.add(`repeating_traits_${fRowId}_name`, optionalFeature.name);
				attrs.add(`repeating_traits_${fRowId}_source`, Parser.optFeatureTypeToFull(optionalFeature.featureType));
				attrs.add(`repeating_traits_${fRowId}_source_type`, optionalFeature.name);
				attrs.add(`repeating_traits_${fRowId}_description`, optionalFeatureText);
				attrs.add(`repeating_traits_${fRowId}_options-flag`, "0");
			} else if (d20plus.sheet == "shaped") {
				attrs.add(`repeating_classfeature_${fRowId}_name`, optionalFeature.name);
				attrs.add(`repeating_classfeature_${fRowId}_content`, optionalFeatureText);
				attrs.add(`repeating_classfeature_${fRowId}_content_toggle`, "1");
			} else {
				console.warn(`Optional feature (invocation, maneuver, or metamagic) import is not supported for ${d20plus.sheet} character sheet`);
			}

			attrs.notifySheetWorkers();
		}

		function importClass (character, data) {
			let levels = d20plus.ut.getNumberRange("What levels?", 1, 20);
			if (!levels) return;

			const maxLevel = Math.max(...levels);

			const clss = data.Vetoolscontent;
			const renderer = Renderer.get().setBaseUrl(BASE_SITE_URL);
			const shapedSheetPreFilledFeaturesByClass = {
				"Artificer": [
					"Magic Item Analysis",
					"Tool Expertise",
					"Wondrous Invention",
					"Infuse Magic",
					"Superior Attunement",
					"Mechanical Servant",
					"Soul of Artifice",
				],
				"Barbarian": [
					"Rage",
					"Unarmored Defense",
					"Reckless Attack",
					"Danger Sense",
					"Extra Attack",
					"Fast Movement",
					"Feral Instinct",
					"Brutal Critical",
					"Relentless Rage",
					"Persistent Rage",
					"Indomitable Might",
					"Primal Champion",
				],
				"Bard": [
					"Bardic Inspiration",
					"Jack of All Trades",
					"Song of Rest",
					"Expertise",
					"Countercharm",
					"Magical Secrets",
					"Superior Inspiration",
				],
				"Cleric": [
					"Channel Divinity",
					"Turn Undead",
					"Divine Intervention",
				],
				"Druid": [
					"Druidic",
					"Wild Shape",
					"Timeless Body",
					"Beast Spells",
					"Archdruid",
				],
				"Fighter": [
					"Fighting Style",
					"Second Wind",
					"Action Surge",
					"Extra Attack",
					"Indomitable",
				],
				"Monk": [
					"Unarmored Defense",
					"Martial Arts",
					"Ki",
					"Flurry of Blows",
					"Patient Defense",
					"Step of the Wind",
					"Unarmored Movement",
					"Deflect Missiles",
					"Slow Fall",
					"Extra Attack",
					"Stunning Strike",
					"Ki-Empowered Strikes",
					"Evasion",
					"Stillness of Mind",
					"Purity of Body",
					"Tongue of the Sun and Moon",
					"Diamond Soul",
					"Timeless Body",
					"Empty Body",
					"Perfect Soul",
				],
				"Paladin": [
					"Divine Sense",
					"Lay on Hands",
					"Fighting Style",
					"Divine Smite",
					"Divine Health",
					"Channel Divinity",
					"Extra Attack",
					"Aura of Protection",
					"Aura of Courage",
					"Improved Divine Smite",
					"Cleansing Touch",
				],
				"Ranger": [
					"Favored Enemy",
					"Natural Explorer",
					"Fighting Style",
					"Primeval Awareness",
					"Land’s Stride",
					"Hide in Plain Sight",
					"Vanish",
					"Feral Senses",
					"Foe Slayer",
				],
				"Ranger (Revised)": [ // "Ranger UA (2016)"
					"Favored Enemy",
					"Natural Explorer",
					"Fighting Style",
					"Primeval Awareness",
					"Greater Favored Enemy",
					"Fleet of Foot",
					"Hide in Plain Sight",
					"Vanish",
					"Feral Senses",
					"Foe Slayer",
				],
				"Rogue": [
					"Expertise",
					"Sneak Attack",
					"Thieves' Cant",
					"Cunning Action",
					"Uncanny Dodge",
					"Evasion",
					"Reliable Talent",
					"Blindsense",
					"Slippery Mind",
					"Elusive",
					"Stroke of Luck",
				],
				"Sorcerer": [
					"Sorcery Points",
					"Flexible Casting",
					"Metamagic",
					"Sorcerous Restoration",
				],
				"Warlock": [
					"Eldritch Invocations",
					"Pact Boon",
					"Mystic Arcanum",
					"Eldritch Master",
				],
				"Wizard": [
					"Arcane Recovery",
					"Spell Mastery",
					"Signature Spells",
				],
			};
			const shapedSheetPreFilledFeatures = shapedSheetPreFilledFeaturesByClass[clss.name] || [];

			const attrs = new CharacterAttributesProxy(character);

			importClassGeneral(attrs, clss, maxLevel);

			for (let i = 0; i < maxLevel; i++) {
				const level = i + 1;
				if (!levels.has(level)) continue;

				const lvlFeatureList = clss.classFeatures[i];
				for (let j = 0; j < lvlFeatureList.length; j++) {
					const feature = lvlFeatureList[j];
					// don't add "you gain a subclass feature" or ASI's
					if (!feature.gainSubclassFeature && feature.name !== "Ability Score Improvement") {
						const renderStack = [];
						renderer.recursiveRender({entries: feature.entries}, renderStack);
						feature.text = d20plus.importer.getCleanText(renderStack.join(""));
						importClassFeature(attrs, clss, level, feature);
					}
				}
			}

			function importClassGeneral (attrs, clss, maxLevel) {
				if (d20plus.sheet === "ogl") {
					setTimeout(() => {
						attrs.addOrUpdate("pb", d20plus.getProfBonusFromLevel(Number(maxLevel)));
						attrs.addOrUpdate("class", clss.name);
						attrs.addOrUpdate("level", maxLevel);
						attrs.addOrUpdate("base_level", String(maxLevel));
					}, 500);
				} else if (d20plus.sheet === "shaped") {
					const isSupportedClass = clss.source === "PHB" || ["Artificer", "Ranger (Revised)"].includes(clss.name);
					let className = "CUSTOM";
					if (isSupportedClass) {
						className = clss.name.toUpperCase();
						if (clss.name === "Ranger (Revised)")
							className = "RANGERUA";
					}

					const fRowId = attrs.findOrGenerateRepeatingRowId("repeating_class_$0_name", className);
					attrs.addOrUpdate(`repeating_class_${fRowId}_name`, className);
					attrs.addOrUpdate(`repeating_class_${fRowId}_level`, maxLevel);
					if (!isSupportedClass) {
						attrs.addOrUpdate(`repeating_class_${fRowId}_hd`, `d${clss.hd.faces}`);
						attrs.addOrUpdate(`repeating_class_${fRowId}_custom_class_toggle`, "1");
						attrs.addOrUpdate(`repeating_class_${fRowId}_custom_name`, clss.name);
					}

					if (!isSupportedClass && clss.name === "Mystic") {
						const classResourcesForLevel = clss.classTableGroups[0].rows[maxLevel - 1];
						const [talentsKnown, disciplinesKnown, psiPoints, psiLimit] = classResourcesForLevel;

						attrs.addOrUpdate("spell_points_name", "PSI");
						attrs.addOrUpdate("show_spells", "1");
						attrs.addOrUpdate("spell_points_toggle", "1");
						attrs.addOrUpdate("spell_ability", "INTELLIGENCE");
						attrs.addOrUpdate("spell_points_limit", psiLimit);
						attrs.addOrUpdate("spell_points", psiPoints, psiPoints);
						// talentsKnown, disciplinesKnown;	// unused

						for (let i = 1; i <= 7; i++) {
							attrs.addOrUpdate(`spell_level_${i}_cost`, i);
						}
						for (let i = 0; i <= psiLimit; i++) {
							attrs.addOrUpdate(`spell_level_filter_${i}`, "1");
						}
					}

					attrs.notifySheetWorkers();
				} else {
					console.warn(`Class import is not supported for ${d20plus.sheet} character sheet`);
				}
			}

			function importClassFeature (attrs, clss, level, feature) {
				if (d20plus.sheet == "ogl") {
					const fRowId = d20plus.ut.generateRowId();
					attrs.add(`repeating_traits_${fRowId}_name`, feature.name);
					attrs.add(`repeating_traits_${fRowId}_source`, "Class");
					attrs.add(`repeating_traits_${fRowId}_source_type`, `${clss.name} ${level}`);
					attrs.add(`repeating_traits_${fRowId}_description`, feature.text);
					attrs.add(`repeating_traits_${fRowId}_options-flag`, "0");
				} else if (d20plus.sheet == "shaped") {
					if (shapedSheetPreFilledFeatures.includes(feature.name))
						return;

					const fRowId = d20plus.ut.generateRowId();
					attrs.add(`repeating_classfeature_${fRowId}_name`, `${feature.name} (${clss.name} ${level})`);
					attrs.add(`repeating_classfeature_${fRowId}_content`, feature.text);
					attrs.add(`repeating_classfeature_${fRowId}_content_toggle`, "1");
				}

				attrs.notifySheetWorkers();
			}
		}

		function importSubclass (character, data) {
			if (d20plus.sheet != "ogl" && d20plus.sheet != "shaped") {
				console.warn(`Subclass import is not supported for ${d20plus.sheet} character sheet`);
				return;
			}

			const attrs = new CharacterAttributesProxy(character);
			const sc = data.Vetoolscontent;

			const desiredIxs = new Set(); // indexes into the subclass feature array
			const gainLevels = [];

			// _gainAtLevels should be a 20-length array of booleans
			if (sc._gainAtLevels) {
				const levels = d20plus.ut.getNumberRange("What levels?", 1, 20);
				if (levels) {
					let scFeatureIndex = 0;
					for (let i = 0; i < 20; i++) {
						if (sc._gainAtLevels[i]) {
							if (levels.has(i + 1)) {
								desiredIxs.add(scFeatureIndex);
							}
							scFeatureIndex++;
							gainLevels.push(i + 1);
						}
					}
				} else {
					return;
				}
			} else {
				throw new Error("No subclass._gainAtLevels supplied!");
			}

			if (!desiredIxs.size) {
				alert("No subclass features were found within the range specified.");
				return;
			}

			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);
			let firstFeatures = true;
			for (let i = 0; i < sc.subclassFeatures.length; i++) {
				if (!desiredIxs.has(i)) continue;

				const lvlFeatureList = sc.subclassFeatures[i];
				for (let j = 0; j < lvlFeatureList.length; j++) {
					const featureCpy = JSON.parse(JSON.stringify(lvlFeatureList[j]));
					let feature = lvlFeatureList[j];

					try {
						while (!feature.name || (feature[0] && !feature[0].name)) {
							if (feature.entries && feature.entries.name) {
								feature = feature.entries;
								continue;
							} else if (feature.entries[0] && feature.entries[0].name) {
								feature = feature.entries[0];
								continue;
							} else {
								feature = feature.entries;
							}

							if (!feature) {
								// in case something goes wrong, reset break the loop
								feature = featureCpy;
								break;
							}
						}
					} catch (e) {
						console.error("Failed to find feature");
						// in case something goes _really_ wrong, reset
						feature = featureCpy;
					}

					// for the first batch of subclass features, try to split them up
					if (firstFeatures && feature.name && feature.entries) {
						const subFeatures = [];
						const baseFeatures = feature.entries.filter(f => {
							if (f.name && f.type === "entries") {
								subFeatures.push(f);
								return false;
							} else return true;
						});
						importSubclassFeature(attrs, sc, gainLevels[i],
								{name: feature.name, type: feature.type, entries: baseFeatures});
						subFeatures.forEach(sf => {
							importSubclassFeature(attrs, sc, gainLevels[i], sf);
						})
					} else {
						importSubclassFeature(attrs, sc, gainLevels[i], feature);
					}

					firstFeatures = false;
				}
			}

			function importSubclassFeature (attrs, sc, level, feature) {
				const renderStack = [];
				renderer.recursiveRender({entries: feature.entries}, renderStack);
				feature.text = d20plus.importer.getCleanText(renderStack.join(""));

				const fRowId = d20plus.ut.generateRowId();

				if (d20plus.sheet == "ogl") {
					attrs.add(`repeating_traits_${fRowId}_name`, feature.name);
					attrs.add(`repeating_traits_${fRowId}_source`, "Class");
					attrs.add(`repeating_traits_${fRowId}_source_type`, `${sc.class} (${sc.name} ${level})`);
					attrs.add(`repeating_traits_${fRowId}_description`, feature.text);
					attrs.add(`repeating_traits_${fRowId}_options-flag`, "0");
				} else if (d20plus.sheet == "shaped") {
					attrs.add(`repeating_classfeature_${fRowId}_name`, `${feature.name} (${sc.name} ${level})`);
					attrs.add(`repeating_classfeature_${fRowId}_content`, feature.text);
					attrs.add(`repeating_classfeature_${fRowId}_content_toggle`, "1");
				}

				attrs.notifySheetWorkers();
			}
		}

		function importPsionicAbility (character, data) {
			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);

			const attrs = new CharacterAttributesProxy(character);
			data = data.Vetoolscontent;
			if (!data) {
				alert("Missing data. Please re-import Psionics.");
				return;
			}

			function getCostStr (cost) {
				return cost.min === cost.max ? cost.min : `${cost.min}-${cost.max}`;
			}

			function getCleanText (entries) {
				if (typeof entries == "string") {
					return d20plus.importer.getCleanText(renderer.render(entries));
				} else {
					const renderStack = [];
					renderer.recursiveRender({entries: entries}, renderStack, {depth: 2});
					return d20plus.importer.getCleanText(renderStack.join(""));
				}
			}

			if (d20plus.sheet == "ogl") {
				const makeSpellTrait = function (level, rowId, propName, content) {
					const attrName = `repeating_spell-${level}_${rowId}_${propName}`;
					attrs.add(attrName, content);
				}

				// disable all components
				const noComponents = function (level, rowId, hasM) {
					makeSpellTrait(level, rowId, "spellcomp_v", 0);
					makeSpellTrait(level, rowId, "spellcomp_s", 0);
					if (!hasM) {
						makeSpellTrait(level, rowId, "spellcomp_m", 0);
					}
					makeSpellTrait(level, rowId, "options-flag", 0);
				}

				if (data.type === "D") {
					const rowId = d20plus.ut.generateRowId();

					// make focus
					const focusLevel = "cantrip";
					makeSpellTrait(focusLevel, rowId, "spelllevel", "cantrip");
					makeSpellTrait(focusLevel, rowId, "spellname", `${data.name} Focus`);
					makeSpellTrait(focusLevel, rowId, "spelldescription", getCleanText(data.focus));
					makeSpellTrait(focusLevel, rowId, "spellcastingtime", "1 bonus action");
					noComponents(focusLevel, rowId);

					data.modes.forEach(m => {
						if (m.submodes) {
							m.submodes.forEach(sm => {
								const rowId = d20plus.ut.generateRowId();
								const smLevel = sm.cost.min;
								makeSpellTrait(smLevel, rowId, "spelllevel", smLevel);
								makeSpellTrait(smLevel, rowId, "spellname", `${m.name} (${sm.name})`);
								makeSpellTrait(smLevel, rowId, "spelldescription", getCleanText(sm.entries));
								makeSpellTrait(smLevel, rowId, "spellcomp_materials", `${getCostStr(sm.cost)} psi points`);
								noComponents(smLevel, rowId, true);
							});
						} else {
							const rowId = d20plus.ut.generateRowId();
							const mLevel = m.cost.min;
							makeSpellTrait(mLevel, rowId, "spelllevel", mLevel);
							makeSpellTrait(mLevel, rowId, "spellname", `${m.name}`);
							makeSpellTrait(mLevel, rowId, "spelldescription", `Psionic Discipline mode\n\n${getCleanText(m.entries)}`);
							makeSpellTrait(mLevel, rowId, "spellcomp_materials", `${getCostStr(m.cost)} psi points`);
							if (m.concentration) {
								makeSpellTrait(mLevel, rowId, "spellduration", `${m.concentration.duration} ${m.concentration.unit}`);
								makeSpellTrait(mLevel, rowId, "spellconcentration", "Yes");
							}
							noComponents(mLevel, rowId, true);
						}
					});
				} else {
					const rowId = d20plus.ut.generateRowId();
					const level = "cantrip";
					makeSpellTrait(level, rowId, "spelllevel", "cantrip");
					makeSpellTrait(level, rowId, "spellname", data.name);
					makeSpellTrait(level, rowId, "spelldescription", `Psionic Talent\n\n${getCleanText(Renderer.psionic.getBodyText(data, renderer))}`);
					noComponents(level, rowId, false);
				}
			} else if (d20plus.sheet == "shaped") {
				const makeSpellTrait = function (level, rowId, propName, content) {
					const attrName = `repeating_spell${level}_${rowId}_${propName}`;
					attrs.add(attrName, content);
				}

				const shapedSpellLevel = function (level) {
					return level ? `${Parser.getOrdinalForm(String(level))}_LEVEL`.toUpperCase() : "CANTRIP";
				}

				const shapedConcentration = function (conc) {
					const CONC_ABV_TO_FULL = {
						rnd: "round",
						min: "minute",
						hr: "hour",
					};
					return `CONCENTRATION_UP_TO_${conc.duration}_${CONC_ABV_TO_FULL[conc.unit]}${conc.duration > 1 ? "S" : ""}`.toUpperCase();
				}

				const inferCastingTime = function (content) {
					if (content.search(/\b(as an action)\b/i) >= 0) {
						return "1_ACTION";
					} else if (content.search(/\b(as a bonus action)\b/i) >= 0) {
						return "1_BONUS_ACTION";
					} else if (content.search(/\b(as a reaction)\b/i) >= 0) {
						return "1_REACTION";
					}
					return "1_ACTION";
				}

				const inferDuration = function (content) {
					let duration, unit, match;
					if ((match = content.match(/\b(?:for the next|for 1) (round|minute|hour)\b/i))) {
						[duration, unit] = [1, match[1]];
					} else if ((match = content.match(/\b(?:for|for the next) (\d+) (minutes|hours|days)\b/i))) {
						[duration, unit] = [match[1], match[2]];
					}

					return (duration && unit) ? `${duration}_${unit}`.toUpperCase() : `INSTANTANEOUS`;
				}

				if (data.type === "D") {
					const typeStr = `**Psionic Discipline:** ${data.name}\n**Psionic Order:** ${data.order}\n`;
					const rowId = d20plus.ut.generateRowId();

					// make focus
					const focusLevel = 0;
					makeSpellTrait(focusLevel, rowId, "spell_level", shapedSpellLevel(focusLevel));
					makeSpellTrait(focusLevel, rowId, "name", `${data.name} Focus`);
					makeSpellTrait(focusLevel, rowId, "content", `${typeStr}\n${getCleanText(data.focus)}`);
					makeSpellTrait(focusLevel, rowId, "content_toggle", "1");
					makeSpellTrait(focusLevel, rowId, "casting_time", "1_BONUS_ACTION");
					makeSpellTrait(focusLevel, rowId, "components", "COMPONENTS_M");
					makeSpellTrait(focusLevel, rowId, "duration", "SPECIAL");

					data.modes.forEach(m => {
						const modeContent = `${typeStr}\n${getCleanText(m.entries)}`;

						if (m.submodes) {
							m.submodes.forEach(sm => {
								const rowId = d20plus.ut.generateRowId();
								const smLevel = sm.cost.min;
								const costStr = getCostStr(sm.cost);
								const content = `${modeContent}\n${getCleanText(sm.entries)}`;
								makeSpellTrait(smLevel, rowId, "spell_level", shapedSpellLevel(smLevel));
								makeSpellTrait(smLevel, rowId, "name", `${m.name} (${sm.name})` + (sm.cost.min < sm.cost.max ? ` (${costStr} psi)` : ""));
								makeSpellTrait(smLevel, rowId, "content", content);
								makeSpellTrait(smLevel, rowId, "content_toggle", "1");
								makeSpellTrait(smLevel, rowId, "casting_time", inferCastingTime(content));
								makeSpellTrait(smLevel, rowId, "materials", `${costStr} psi points`);
								makeSpellTrait(smLevel, rowId, "components", "COMPONENTS_M");
								makeSpellTrait(smLevel, rowId, "duration", inferDuration(content));
							});
						} else {
							const rowId = d20plus.ut.generateRowId();
							const mLevel = m.cost.min;
							const costStr = getCostStr(m.cost);
							makeSpellTrait(mLevel, rowId, "spell_level", shapedSpellLevel(mLevel));
							makeSpellTrait(mLevel, rowId, "name", m.name + (m.cost.min < m.cost.max ? ` (${costStr} psi)` : ""));
							makeSpellTrait(mLevel, rowId, "content", modeContent);
							makeSpellTrait(mLevel, rowId, "content_toggle", "1");
							makeSpellTrait(mLevel, rowId, "casting_time", inferCastingTime(modeContent));
							makeSpellTrait(mLevel, rowId, "materials", `${costStr} psi points`);
							makeSpellTrait(mLevel, rowId, "components", "COMPONENTS_M");
							if (m.concentration) {
								makeSpellTrait(mLevel, rowId, "duration", shapedConcentration(m.concentration));
								makeSpellTrait(mLevel, rowId, "concentration", "Yes");
							} else {
								makeSpellTrait(mLevel, rowId, "duration", inferDuration(modeContent));
							}
						}
					});
				} else {
					const typeStr = `**Psionic Talent**\n`;
					const talentContent = `${typeStr}\n${getCleanText(Renderer.psionic.getBodyText(data, renderer))}`;
					const rowId = d20plus.ut.generateRowId();
					const level = 0;
					makeSpellTrait(level, rowId, "spell_level", shapedSpellLevel(level));
					makeSpellTrait(level, rowId, "name", data.name);
					makeSpellTrait(level, rowId, "content", talentContent);
					makeSpellTrait(level, rowId, "content_toggle", "1");
					makeSpellTrait(level, rowId, "casting_time", inferCastingTime(talentContent));
					makeSpellTrait(level, rowId, "components", "COMPONENTS_M");
					makeSpellTrait(level, rowId, "duration", inferDuration(talentContent));
				}
			} else {
				console.warn(`Psionic ability import is not supported for ${d20plus.sheet} character sheet`);
			}

			attrs.notifySheetWorkers();
		}

		function importItem (character, data, event) {
			if (d20plus.sheet == "ogl") {
				if (data.data._versatile) {
					setTimeout(() => {
						const rowId = d20plus.ut.generateRowId();

						function makeItemTrait (key, val) {
							const toSave = character.model.attribs.create({
								name: `repeating_attack_${rowId}_${key}`,
								current: val
							}).save();
							toSave.save();
						}

						const attr = (data.data["Item Type"] || "").includes("Melee") ? "strength" : "dexterity";
						const attrTag = `@{${attr}_mod}`;

						const proficiencyBonus = character.model.attribs.toJSON().find(it => it.name.includes("pb"));
						const attrToFind = character.model.attribs.toJSON().find(it => it.name === attr);
						const attrBonus = attrToFind ? Parser.getAbilityModNumber(Number(attrToFind.current)) : 0;

						// This links the item to the attack, and vice-versa.
						// Unfortunately, it doesn't work,
						//   because Roll20 thinks items<->attacks is a 1-to-1 relationship.
						/*
						let lastItemId = null;
						try {
							const items = character.model.attribs.toJSON().filter(it => it.name.includes("repeating_inventory"));
							const lastItem = items[items.length - 1];
							lastItemId = lastItem.name.replace(/repeating_inventory_/, "").split("_")[0];

							// link the inventory item to this attack
							const toSave = character.model.attribs.create({
								name: `repeating_inventory_${lastItemId}_itemattackid`,
								current: rowId
							});
							toSave.save();
						} catch (ex) {
							console.error("Failed to get last item ID");
							console.error(ex);
						}

						if (lastItemId) {
							makeItemTrait("itemid", lastItemId);
						}
						*/

						makeItemTrait("options-flag", "0");
						makeItemTrait("atkname", data.name);
						makeItemTrait("dmgbase", data.data._versatile);
						makeItemTrait("dmgtype", data.data["Damage Type"]);
						makeItemTrait("atkattr_base", attrTag);
						makeItemTrait("dmgattr", attrTag);
						makeItemTrait("rollbase_dmg", `@{wtype}&{template:dmg} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[${data.data._versatile}+${attrBonus}]]}} {{dmg1type=${data.data["Damage Type"]} }} @{dmg2flag} {{dmg2=[[0]]}} {{dmg2type=}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} {{globaldamage=[[0]]}} {{globaldamagetype=@{global_damage_mod_type}}} @{charname_output}`);
						makeItemTrait("rollbase_crit", `@{wtype}&{template:dmg} {{crit=1}} {{rname=@{atkname}}} @{atkflag} {{range=@{atkrange}}} @{dmgflag} {{dmg1=[[${data.data._versatile}+${attrBonus}]]}} {{dmg1type=${data.data["Damage Type"]} }} @{dmg2flag} {{dmg2=[[0]]}} {{dmg2type=}} {{crit1=[[${data.data._versatile}]]}} {{crit2=[[0]]}} @{saveflag} {{desc=@{atk_desc}}} @{hldmg}  {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} {{globaldamage=[[0]]}} {{globaldamagecrit=[[0]]}} {{globaldamagetype=@{global_damage_mod_type}}} @{charname_output}`);
						if (proficiencyBonus) {
							makeItemTrait("atkbonus", `+${Number(proficiencyBonus.current) + attrBonus}`);
						}
						makeItemTrait("atkdmgtype", `${data.data._versatile}${attrBonus > 0 ? `+${attrBonus}` : attrBonus < 0 ? attrBonus : ""} ${data.data["Damage Type"]}`);
						makeItemTrait("rollbase", "@{wtype}&{template:atk} {{mod=@{atkbonus}}} {{rname=[@{atkname}](~repeating_attack_attack_dmg)}} {{rnamec=[@{atkname}](~repeating_attack_attack_crit)}} {{r1=[[@{d20}cs>@{atkcritrange} + 2[PROF]]]}} @{rtype}cs>@{atkcritrange} + 2[PROF]]]}} {{range=@{atkrange}}} {{desc=@{atk_desc}}} {{spelllevel=@{spelllevel}}} {{innate=@{spell_innate}}} {{globalattack=@{global_attack_mod}}} ammo=@{ammo} @{charname_output}");
					}, 350); // defer this, so we can hopefully pull item ID
				}

				// for packs, etc
				if (data._subItems) {
					const queue = [];
					data._subItems.forEach(si => {
						function makeProp (rowId, propName, content) {
							character.model.attribs.create({
								"name": `repeating_inventory_${rowId}_${propName}`,
								"current": content
							}).save();
						}

						if (si.count) {
							const rowId = d20plus.ut.generateRowId();
							const siD = typeof si.subItem === "string" ? JSON.parse(si.subItem) : si.subItem;

							makeProp(rowId, "itemname", siD.name);
							const w = (siD.data || {}).Weight;
							if (w) makeProp(rowId, "itemweight", w);
							makeProp(rowId, "itemcontent", Object.entries(siD.data).map(([k, v]) => `${k}: ${v}`).join(", "));
							makeProp(rowId, "itemcount", String(si.count));

						} else {
							queue.push(si.subItem);
						}
					});

					const interval = d20plus.cfg.get("import", "importIntervalHandout") || d20plus.cfg.getDefault("import", "importIntervalHandout");
					queue.map(it => typeof it === "string" ? JSON.parse(it) : it).forEach((item, ix) => {
						setTimeout(() => {
							d20plus.importer.doFakeDrop(event, character, item, null);
						}, (ix + 1) * interval);
					});

					return;
				}
			}

			// Fallback to native drag-n-drop
			d20plus.importer.doFakeDrop(event, character, data, null);
		}

		function importData (character, data, event) {
			// TODO remove feature import workarounds below when roll20 and sheets supports their drag-n-drop properly
			if (data.data.Category === "Feats") {
				importFeat(character, data);
			} else if (data.data.Category === "Backgrounds") {
				importBackground(character, data);
			} else if (data.data.Category === "Races") {
				importRace(character, data);
			} else if (data.data.Category === "Optional Features") {
				importOptionalFeature(character, data);
			} else if (data.data.Category === "Classes") {
				importClass(character, data);
			} else if (data.data.Category === "Subclasses") {
				importSubclass(character, data);
			} else if (data.data.Category === "Psionics") {
				importPsionicAbility(character, data);
			} else if (data.data.Category === "Items") {
				importItem(character, data, event);
			} else {
				d20plus.importer.doFakeDrop(event, character, data, null);
			}
		}

		d20.Campaign.characters.models.each(function (v, i) {
			v.view.rebindCompendiumDropTargets = function () {
				// ready character sheet for draggable
				$(".sheet-compendium-drop-target").each(function () {
					$(this).droppable({
						hoverClass: "dropping",
						tolerance: "pointer",
						activeClass: "active-drop-target",
						accept: ".compendium-item",
						drop: function (t, i) {
							var characterid = $(".characterdialog").has(t.target).attr("data-characterid");
							var character = d20.Campaign.characters.get(characterid).view;
							var inputData;
							const $hlpr = $(i.helper[0]);

							if ($hlpr.hasClass("handout")) {
								console.log("Handout item dropped onto target!");
								t.originalEvent.dropHandled = !0;

								if ($hlpr.hasClass(`player-imported`)) {
									const data = d20plus.importer.retrievePlayerImport($hlpr.attr("data-playerimportid"));
									importData(character, data, t);
								} else {
									var id = $hlpr.attr("data-itemid");
									var handout = d20.Campaign.handouts.get(id);
									console.log(character);
									var data = "";
									if (window.is_gm) {
										handout._getLatestBlob("gmnotes", function (gmnotes) {
											data = gmnotes;
											handout.updateBlobs({gmnotes: gmnotes});
											importData(character, JSON.parse(data), t);
										});
									} else {
										handout._getLatestBlob("notes", function (notes) {
											data = $(notes).filter("del").html();
											importData(character, JSON.parse(data), t);
										});
									}
								}
							} else {
								// rename some variables...
								const e = character;
								const n = i;

								// BEGIN ROLL20 CODE
								console.log("Compendium item dropped onto target!"),
									t.originalEvent.dropHandled = !0,
									window.wantsToReceiveDrop(this, t, function() {
										var i = $(n.helper[0]).attr("data-pagename");
										console.log(d20.compendium.compendiumBase + "compendium/" + COMPENDIUM_BOOK_NAME + "/" + i + ".json?plaintext=true"),
											$.get(d20.compendium.compendiumBase + "compendium/" + COMPENDIUM_BOOK_NAME + "/" + i + ".json?plaintext=true", function(n) {
												var o = _.clone(n.data);
												o.Name = n.name,
													o.data = JSON.stringify(n.data),
													o.uniqueName = i,
													o.Content = n.content,
													$(t.target).find("*[accept]").each(function() {
														var t = $(this)
															, n = t.attr("accept");
														o[n] && ("input" === t[0].tagName.toLowerCase() && "checkbox" === t.attr("type") ? t.val() == o[n] ? t.prop("checked", !0) : t.prop("checked", !1) : "input" === t[0].tagName.toLowerCase() && "radio" === t.attr("type") ? t.val() == o[n] ? t.prop("checked", !0) : t.prop("checked", !1) : "select" === t[0].tagName.toLowerCase() ? t.find("option").each(function() {
															var e = $(this);
															e.val() !== o[n] && e.text() !== o[n] || e.prop("selected", !0)
														}) : $(this).val(o[n]),
															e.saveSheetValues(this))
													})
											})
									});
								// END ROLL20 CODE
							}
						}
					});
				});
			};
		});
	};

	d20plus.getProfBonusFromLevel = function (level) {
		if (level < 5) return "2";
		if (level < 9) return "3";
		if (level < 13) return "4";
		if (level < 17) return "5";
		return "6";
	};

	// Import dialog showing names of monsters failed to import
	d20plus.addImportError = function (name) {
		var $span = $("#import-errors");
		if ($span.text() == "0") {
			$span.text(name);
		} else {
			$span.text($span.text() + ", " + name);
		}
	};

	// Get NPC size from chr
	d20plus.getSizeString = function (chr) {
		const result = Parser.sizeAbvToFull(chr);
		return result ? result : "(Unknown Size)";
	};

	// Create editable HP variable and autocalculate + or -
	d20plus.hpAllowEdit = function () {
		$("#initiativewindow").on(window.mousedowntype, ".hp.editable", function () {
			if ($(this).find("input").length > 0) return void $(this).find("input").focus();
			var val = $.trim($(this).text());
			const $span = $(this);
			$span.html(`<input type='text' value='${val}'/>`);
			const $ipt = $(this).find("input");
			$ipt[0].focus();
		});
		$("#initiativewindow").on("keydown", ".hp.editable", function (event) {
			if (event.which == 13) {
				const $span = $(this);
				const $ipt = $span.find("input");
				if (!$ipt.length) return;

				var el, token, id, char, hp,
					val = $.trim($ipt.val());

				// roll20 token modification supports plus/minus for a single integer; mimic this
				const m = /^((\d+)?([+-]))?(\d+)$/.exec(val);
				if (m) {
					let op = null;
					if (m[3]) {
						op = m[3] === "+" ? "ADD" : "SUB";
					}
					const base = m[2] ? eval(m[0]) : null;
					const mod = Number(m[4]);

					el = $(this).parents("li.token");
					id = el.data("tokenid");
					token = d20.Campaign.pages.get(d20.Campaign.activePage()).thegraphics.get(id);
					char = token.character;

					npc = char.attribs ? char.attribs.find(function (a) {
						return a.get("name").toLowerCase() === "npc";
					}) : null;
					let total;
					// char.attribs doesn't exist for generico tokens, in this case stick stuff in an appropriate bar
					if (!char.attribs || npc && npc.get("current") == "1") {
						const hpBar = d20plus.getCfgHpBarNumber();
						if (hpBar) {
							total;
							if (base !== null) {
								total = base;
							} else if (op) {
								const curr = token.attributes[`bar${hpBar}_value`];
								if (op === "ADD") total = curr + mod;
								else total = curr - mod;
							} else {
								total = mod;
							}
							token.attributes[`bar${hpBar}_value`] = total;
						}
					} else {
						hp = char.attribs.find(function (a) {
							return a.get("name").toLowerCase() === "hp";
						});
						if (hp) {
							total;
							if (base !== null) {
								total = base;
							} else if (op) {
								if (op === "ADD") total = hp.attributes.current + mod;
								else total = hp.attributes.current - mod;
							} else {
								total = mod;
							}
							hp.syncedSave({current: total});
						} else {
							total;
							if (base !== null) {
								total = base;
							} else if (op) {
								if (op === "ADD") total = mod;
								else total = 0 - mod;
							} else {
								total = mod;
							}
							char.attribs.create({name: "hp", current: total});
						}
					}
					// convert the field back to text
					$span.html(total);
				}
				d20.Campaign.initiativewindow.rebuildInitiativeList();
			}
		});
	};

// Change character sheet formulas
	d20plus.setSheet = function () {
		d20plus.ut.log("Switched Character Sheet Template");
		d20plus.sheet = "ogl";
		if (window.is_gm && (!d20.journal.customSheets || !d20.journal.customSheets)) {
			const $body = $(`body`);
			$body.addClass("ve-nosheet__body");
			const $btnClose = $(`<button class="btn btn-danger ve-nosheet__btn-close">X</button>`)
				.click(() => {
					$overlay.remove();
					$body.removeClass("ve-nosheet__body");
				});
			const $overlay = $(`<div class="flex-col flex-vh-center ve-nosheet__overlay"/>`);
			$btnClose.appendTo($overlay);
			$overlay.append(`<div class="flex-col flex-vh-center">
				<div class="ve-nosheet__title mb-2">NO CHARACTER SHEET</div>
				<div><i>Your game does not have a character sheet template selected.<br>
				Please either disable betteR20, or visit the settings page for your game to choose one. We recommend the OGL sheet, which is listed as &quot;D&D 5E by Roll20.&quot;</i></div>
			</div>`).appendTo($body);

			d20.textchat.incoming(false, ({
				who: "system",
				type: "system",
				content: `<span style="color: red;">5etoolsR20: no character sheet selected! Exiting...</span>`
			}));
			throw new Error("No character sheet selected!");
		}
		if (d20.journal.customSheets.layouthtml.indexOf("shaped_d20") > 0) d20plus.sheet = "shaped";
		if (d20.journal.customSheets.layouthtml.indexOf("DnD5e_Character_Sheet") > 0) d20plus.sheet = "community";
		d20plus.ut.log("Switched Character Sheet Template to " + d20plus.sheet);
	};

	// Return Initiative Tracker template with formulas
	d20plus.initErrorHandler = null;
	d20plus.setTurnOrderTemplate = function () {
		if (!d20plus.turnOrderCachedFunction) {
			d20plus.turnOrderCachedFunction = d20.Campaign.initiativewindow.rebuildInitiativeList;
			d20plus.turnOrderCachedTemplate = $("#tmpl_initiativecharacter").clone();
		}

		d20.Campaign.initiativewindow.rebuildInitiativeList = function () {
			var html = d20plus.initiativeTemplate;
			var columnsAdded = [];
			$(".tracker-header-extra-columns").empty();

			const cols = [
				d20plus.cfg.get("interface", "trackerCol1"),
				d20plus.cfg.get("interface", "trackerCol2"),
				d20plus.cfg.get("interface", "trackerCol3")
			];

			const headerStack = [];
			const replaceStack = [
				// this is hidden by CSS
				`<span class='cr' alt='CR' title='CR'>
					<$ if(npc && npc.get("current") == "1") { $>
						<$ var crAttr = char.attribs.find(function(e) { return e.get("name").toLowerCase() === "npc_challenge" }); $>
						<$ if(crAttr) { $>
							<$!crAttr.get("current")$>
						<$ } $>
					<$ } $>
				</span>`
			];
			cols.forEach((c, i) => {
				switch (c) {
					case "HP": {
						const hpBar = d20plus.getCfgHpBarNumber();
						replaceStack.push(`
							<span class='hp editable tracker-col' alt='HP' title='HP'>
								<$ if(npc && npc.get("current") == "1") { $>
									${hpBar ? `<$!token.attributes.bar${hpBar}_value$>` : ""}
								<$ } else if (typeof char !== "undefined" && char && typeof char.autoCalcFormula !== "undefined") { $>
									<$!char.autoCalcFormula('${d20plus.formulas[d20plus.sheet].hp}')$>
								<$ } else { $>
									<$!"\u2014"$>
								<$ } $>
							</span>
						`);
						headerStack.push(`<span class='tracker-col'>HP</span>`);
						break;
					}
					case "AC": {
						replaceStack.push(`
							<span class='ac tracker-col' alt='AC' title='AC'>
								<$ if(npc && npc.get("current") == "1" && typeof char !== "undefined" && char && typeof char.autoCalcFormula !== "undefined") { $>
									<$!char.autoCalcFormula('${d20plus.formulas[d20plus.sheet].npcac}')$>
								<$ } else if (typeof char !== "undefined" && char && typeof char.autoCalcFormula !== "undefined") { $>
									<$!char.autoCalcFormula('${d20plus.formulas[d20plus.sheet].ac}')$>
								<$ } else { $>
									<$!"\u2014"$>
								<$ } $>
							</span>
						`);
						headerStack.push(`<span class='tracker-col'>AC</span>`);
						break;
					}
					case "Passive Perception": {
						replaceStack.push(`
							<$ var passive = (typeof char !== "undefined" && char && typeof char.autoCalcFormula !== "undefined") ? (char.autoCalcFormula('@{passive}') || char.autoCalcFormula('${d20plus.formulas[d20plus.sheet].pp}')) : "\u2014"; $>
							<span class='pp tracker-col' alt='Passive Perception' title='Passive Perception'><$!passive$></span>
						`);
						headerStack.push(`<span class='tracker-col'>PP</span>`);
						break;
					}
					case "Spell DC": {
						replaceStack.push(`
							<$ var dc = (typeof char !== "undefined" && char && typeof char.autoCalcFormula !== "undefined") ? (char.autoCalcFormula('${d20plus.formulas[d20plus.sheet].spellDc}')) : "\u2014"; $>
							<span class='dc tracker-col' alt='Spell DC' title='Spell DC'><$!dc$></span>
						`);
						headerStack.push(`<span class='tracker-col'>DC</span>`);
						break;
					}
					default: {
						replaceStack.push(`<span class="tracker-col"/>`);
						headerStack.push(`<span class="tracker-col"/>`);
					}
				}
			});

			console.log("use custom tracker val was ", d20plus.cfg.get("interface", "customTracker"))
			if (d20plus.cfg.get("interface", "customTracker")) {
				$(`.init-header`).show();
				if (d20plus.cfg.get("interface", "trackerSheetButton")) {
					$(`.init-sheet-header`).show();
				} else {
					$(`.init-sheet-header`).hide();
				}
				$(`.init-init-header`).show();
				const $header = $(".tracker-header-extra-columns");
				// prepend/reverse used since tracker gets populated in right-to-left order
				headerStack.forEach(h => $header.prepend(h))
				html = html.replace(`<!--5ETOOLS_REPLACE_TARGET-->`, replaceStack.reverse().join(" \n"));
			} else {
				$(`.init-header`).hide();
				$(`.init-sheet-header`).hide();
				$(`.init-init-header`).hide();
			}

			$("#tmpl_initiativecharacter").replaceWith(html);

			// Hack to catch errors, part 1
			const startTime = (new Date).getTime();

			var results = d20plus.turnOrderCachedFunction.apply(this, []);
			setTimeout(function () {
				$(".initmacrobutton").unbind("click");
				$(".initmacrobutton").bind("click", function () {
					console.log("Macro button clicked");
					tokenid = $(this).parent().parent().data("tokenid");
					var token, char;
					var page = d20.Campaign.activePage();
					if (page) token = page.thegraphics.get(tokenid);
					if (token) char = token.character;
					if (char) {
						char.view.showDialog();
						// d20.textchat.doChatInput(`%{` + char.id + `|` + d20plus.formulas[d20plus.sheet]["macro"] + `}`)
					}
				});

				d20plus.bindTokens();
			}, 100);

			// Hack to catch errors, part 2
			if (d20plus.initErrorHandler) {
				window.removeEventListener("error", d20plus.initErrorHandler);
			}
			d20plus.initErrorHandler = function (event) {
				// if we see an error within 250 msec of trying to override the initiative window...
				if (((new Date).getTime() - startTime) < 250) {
					d20plus.ut.log("ERROR: failed to populate custom initiative tracker, restoring default...");
					// restore the default functionality
					$("#tmpl_initiativecharacter").replaceWith(d20plus.turnOrderCachedTemplate);
					return d20plus.turnOrderCachedFunction();
				}
			};
			window.addEventListener("error", d20plus.initErrorHandler);
			return results;
		};

		const getTargetWidth = () => d20plus.cfg.get("interface", "minifyTracker") ? 250 : 350;
		// wider tracker
		const cachedDialog = d20.Campaign.initiativewindow.$el.dialog;
		d20.Campaign.initiativewindow.$el.dialog = (...args) => {
			const widen = d20plus.cfg.get("interface", "customTracker");
			if (widen && args[0] && args[0].width) {
				args[0].width = getTargetWidth();
			}
			cachedDialog.bind(d20.Campaign.initiativewindow.$el)(...args);
		};

		// if the tracker is already open, widen it
		if (d20.Campaign.initiativewindow.model.attributes.initiativepage) d20.Campaign.initiativewindow.$el.dialog("option", "width", getTargetWidth());
	};

	d20plus.psionics._groupOptions = ["Alphabetical", "Order", "Source"];
	d20plus.psionics._listCols = ["name", "order", "source"];
	d20plus.psionics._listItemBuilder = (it) => `
		<span class="name col-6">${it.name}</span>
		<span class="order col-4">ORD[${it.order || "None"}]</span>
		<span title="${Parser.sourceJsonToFull(it.source)}" class="source col-2">SRC[${Parser.sourceJsonToAbv(it.source)}]</span>`;
	d20plus.psionics._listIndexConverter = (p) => {
		return {
			name: p.name.toLowerCase(),
			order: (p.order || "none").toLowerCase(),
			source: Parser.sourceJsonToAbv(p.source).toLowerCase()
		};
	};
// Import Psionics button was clicked
	d20plus.psionics.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-psionics-url-player").val() : $("#import-psionics-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.psionics.playerImportBuilder : d20plus.psionics.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"psionic",
					data.psionic,
					handoutBuilder,
					{
						groupOptions: d20plus.psionics._groupOptions,
						forcePlayer,
						listItemBuilder: d20plus.psionics._listItemBuilder,
						listIndex: d20plus.psionics._listCols,
						listIndexConverter: d20plus.psionics._listIndexConverter
					}
				);
			});
		}
	};

	d20plus.psionics.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Psionics`, folderName);
		const path = ["Psionics", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.psiTypeToFull(data.type),
				data.order || "orderless",
				Parser.sourceJsonToFull(data.source)
				], "psionic")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_PSIONICS](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [noteContents, gmNotes] = d20plus.psionics._getHandoutData(data);

				handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.psionics.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.psionics._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.psionics._getHandoutData = function (data) {
		function renderTalent () {
			const renderStack = [];
			renderer.recursiveRender(({entries: data.entries, type: "entries"}), renderStack);
			return renderStack.join(" ");
		}

		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);
		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Psionics"
			}
		};
		const gmNotes = JSON.stringify(r20json);

		const baseNoteContents = `
			<h3>${data.name}</h3>
			<p><em>${data.type === "D" ? `${data.order} ${Parser.psiTypeToFull(data.type)}` : `${Parser.psiTypeToFull(data.type)}`}</em></p>
			${Renderer.psionic.getBodyText(data, renderer)}
			`;

		const noteContents = `${baseNoteContents}<br><del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};

// Import Races button was clicked
	d20plus.races.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-races-url-player").val() : $("#import-races-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.races.playerImportBuilder : d20plus.races.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"race",
					Renderer.race.mergeSubraces(data.race),
					handoutBuilder,
					{
						forcePlayer
					}
				);
			});
		}
	};

	d20plus.races.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Races`, folderName);
		const path = ["Races", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.sizeAbvToFull(data.size),
				Parser.sourceJsonToFull(data.source)
			], "race")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_RACES](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [noteContents, gmNotes] = d20plus.races._getHandoutData(data);

				handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.races.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.races._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.races._getHandoutData = function (data) {
		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);

		const renderStack = [];
		const ability = Renderer.getAbilityData(data.ability);
		renderStack.push(`
		<h3>${data.name}</h3>
		<p>
			<strong>Ability Scores:</strong> ${ability.asText}<br>
			<strong>Size:</strong> ${Parser.sizeAbvToFull(data.size)}<br>
			<strong>Speed:</strong> ${Parser.getSpeedString(data)}<br>
		</p>
	`);
		renderer.recursiveRender({entries: data.entries}, renderStack, {depth: 1});
		const rendered = renderStack.join("");

		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Races"
			}
		};
		const gmNotes = JSON.stringify(r20json);
		const noteContents = `${rendered}\n\n<del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};

// Import Object button was clicked
	d20plus.objects.button = function () {
		const url = $("#import-objects-url").val();
		if (url && url.trim()) {
			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"object",
					data.object,
					d20plus.objects.handoutBuilder
				);
			});
		}
	};

	d20plus.objects.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Objects`, folderName);
		const path = ["Objects", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.characters.create(
			{
				name: name,
				tags: d20plus.importer.getTagString([
					Parser.sizeAbvToFull(data.size),
					Parser.sourceJsonToFull(data.source)
				], "object")
			},
			{
			success: function (character) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_OBJECTS](data)] = {name: data.name, source: data.source, type: "character", roll20Id: character.id};

				try {
					const avatar = data.tokenUrl || `${IMG_URL}objects/${name}.png`;
					character.size = data.size;
					character.name = name;
					character.senses = data.senses ? data.senses instanceof Array ? data.senses.join(", ") : data.senses : null;
					character.hp = data.hp;
					$.ajax({
						url: avatar,
						type: 'HEAD',
						error: function () {
							d20plus.importer.getSetAvatarImage(character, `${IMG_URL}blank.png`);
						},
						success: function () {
							d20plus.importer.getSetAvatarImage(character, avatar);
						}
					});
					const ac = data.ac.match(/^\d+/);
					const size = Parser.sizeAbvToFull(data.size);
					character.attribs.create({name: "npc", current: 1});
					character.attribs.create({name: "npc_toggle", current: 1});
					character.attribs.create({name: "npc_options-flag", current: 0});
					// region disable charachtermancer
					character.attribs.create({name: "mancer_confirm_flag", current: ""});
					character.attribs.create({name: "mancer_cancel", current: "on"});
					character.attribs.create({name: "l1mancer_status", current: "completed"});
					// endregion
					character.attribs.create({name: "wtype", current: d20plus.importer.getDesiredWhisperType()});
					character.attribs.create({name: "rtype", current: d20plus.importer.getDesiredRollType()});
					character.attribs.create({
						name: "advantagetoggle",
						current: d20plus.importer.getDesiredAdvantageToggle()
					});
					character.attribs.create({
						name: "whispertoggle",
						current: d20plus.importer.getDesiredWhisperToggle()
					});
					character.attribs.create({name: "dtype", current: d20plus.importer.getDesiredDamageType()});
					character.attribs.create({name: "npc_name", current: name});
					character.attribs.create({name: "npc_size", current: size});
					character.attribs.create({name: "type", current: data.type});
					character.attribs.create({name: "npc_type", current: `${size} ${data.type}`});
					character.attribs.create({name: "npc_ac", current: ac != null ? ac[0] : ""});
					character.attribs.create({name: "npc_actype", current: ""});
					character.attribs.create({name: "npc_hpbase", current: data.hp});
					character.attribs.create({name: "npc_hpformula", current: data.hp ? `${data.hp}d1` : ""});

					character.attribs.create({name: "npc_immunities", current: data.immune ? data.immune : ""});
					character.attribs.create({name: "damage_immunities", current: data.immune ? data.immune : ""});

					//Should only be one entry for objects
					if (data.entries != null) {
						character.attribs.create({name: "repeating_npctrait_0_name", current: name});
						character.attribs.create({name: "repeating_npctrait_0_desc", current: data.entries});
						if (d20plus.cfg.getOrDefault("import", "tokenactionsTraits")) {
							character.abilities.create({
								name: "Information: " + name,
								istokenaction: true,
								action: d20plus.actionMacroTrait(0)
							});
						}
					}

					const renderer = new Renderer();
					renderer.setBaseUrl(BASE_SITE_URL);
					if (data.actionEntries) {
						data.actionEntries.forEach((e, i) => {
							const renderStack = [];
							renderer.recursiveRender({entries: e.entries}, renderStack, {depth: 2});
							const actionText = d20plus.importer.getCleanText(renderStack.join(""));
							d20plus.importer.addAction(character, d20plus.importer.getCleanText(renderer.render(e.name)), actionText, i);
						});
					}

					character.view._updateSheetValues();

					if (data.entries) {
						const bio = renderer.render({type: "entries", entries: data.entries});

						setTimeout(() => {
							const fluffAs = d20plus.cfg.get("import", "importFluffAs") || d20plus.cfg.getDefault("import", "importFluffAs");
							let k = fluffAs === "Bio"? "bio" : "gmnotes";
							character.updateBlobs({
								[k]: Markdown.parse(bio)
							});
							character.save({
								[k]: (new Date).getTime()
							});
						}, 500);
					}
				} catch (e) {
					d20plus.ut.log(`Error loading [${name}]`);
					d20plus.addImportError(name);
					console.log(data);
					console.log(e);
				}
				d20.journal.addItemToFolderStructure(character.id, folder.id);
			}
		});
	};

	d20plus.optionalfeatures.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-optionalfeatures-url-player").val() : $("#import-optionalfeatures-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.optionalfeatures.playerImportBuilder : d20plus.optionalfeatures.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"optionalfeature",
					data.optionalfeature,
					handoutBuilder,
					{
						forcePlayer
					}
				);
			});
		}
	};

	d20plus.optionalfeatures.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Optional Features`, folderName);
		const path = ["Optional Features", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.sourceJsonToFull(data.source)
			], "optionalfeature")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_OPT_FEATURES](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [noteContents, gmNotes] = d20plus.optionalfeatures._getHandoutData(data);

				handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.optionalfeatures.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.optionalfeatures._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.optionalfeatures._getHandoutData = function (data) {
		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);

		const renderStack = [];

		renderer.recursiveRender({entries: data.entries}, renderStack, {depth: 1});

		const rendered = renderStack.join("");
		const prereqs = Renderer.utils.getPrerequisiteText(data.prerequisites);

		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Optional Features"
			}
		};
		const gmNotes = JSON.stringify(r20json);
		const noteContents = `${prereqs ? `<p><i>Prerequisite: ${prereqs}.</i></p>` : ""}${rendered}\n\n<del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};

	// Import Adventures button was clicked
	d20plus.adventures.button = function () {
		const url = $("#import-adventures-url").val();
		if (url !== null) d20plus.adventures.load(url);
	};

	// Fetch adventure data from file
	d20plus.adventures.load = function (url) {
		$("a.ui-tabs-anchor[href='#journal']").trigger("click");
		$.ajax({
			type: "GET",
			url: url,
			dataType: "text",
			success: function (data) {
				data = JSON.parse(data);

				function isPart (e) {
					return typeof e === "string" || typeof e === "object" && (e.type !== "entries");
				}

				// open progress window
				$("#d20plus-import").dialog("open");
				$("#import-remaining").text("Initialising...");

				// FIXME(homebrew) this always selects the first item in a list of homebrew adventures
				// FIXME(5etools) this selects the source based on the select dropdown, which can be wrong
				// get metadata
				const adMeta = data.adventure
					? data.adventure[0] :
					adventureMetadata.adventure.find(a => a.id.toLowerCase() === $("#import-adventures-url").data("id").toLowerCase());

				const addQueue = [];
				const sections = JSON.parse(JSON.stringify(data.adventureData ? data.adventureData[0].data : data.data));
				const adDir = `${Parser.sourceJsonToFull(adMeta.id)}`;
				sections.forEach((s, i) => {
					if (i >= adMeta.contents.length) return;

					const chapterDir = [adDir, adMeta.contents[i].name];

					const introEntries = [];
					if (s.entries && s.entries.length && isPart(s.entries[0])) {
						while (isPart(s.entries[0])) {
							introEntries.push(s.entries[0]);
							s.entries.shift();
						}
					}
					addQueue.push({
						dir: chapterDir,
						type: "entries",
						name: s.name,
						entries: introEntries,
					});

					// compact entries into layers
					front = null;
					let tempStack = [];
					let textIndex = 1;
					while ((front = s.entries.shift())) {
						if (isPart(front)) {
							tempStack.push(front);
						} else {
							if (tempStack.length) {
								addQueue.push({
									dir: chapterDir,
									type: "entries",
									name: `Text ${textIndex++}`,
									entries: tempStack
								});
								tempStack = [];
							}
							front.dir = chapterDir;
							addQueue.push(front);
						}
					}
				});

				const renderer = new Renderer();
				renderer.setBaseUrl(BASE_SITE_URL);

				const $stsName = $("#import-name");
				const $stsRemain = $("#import-remaining");
				const interval = d20plus.cfg.get("import", "importIntervalHandout") || d20plus.cfg.getDefault("import", "importIntervalHandout");

				////////////////////////////////////////////////////////////////////////////////////////////////////////
				Renderer.get().setBaseUrl(BASE_SITE_URL);
				// pre-import tags
				const tags = {};
				renderer.doExportTags(tags);
				addQueue.forEach(entry => {
					renderer.recursiveRender(entry, []);
				});

				// storage for returned handout/character IDs
				const RETURNED_IDS = {};

				// monsters
				const preMonsters = Object.keys(tags)
					.filter(k => tags[k].page === "bestiary.html")
					.map(k => tags[k]);
				if (confirm("Import creatures from this adventure?")) doPreImport(preMonsters, showMonsterImport);
				else doItemImport();

				function showMonsterImport (toImport) {
					d20plus.ut.log(`Displaying monster import list for [${adMeta.name}]`);
					d20plus.importer.showImportList(
						"monster",
						toImport.filter(it => it),
						d20plus.monsters.handoutBuilder,
						{
							groupOptions: d20plus.monsters._groupOptions,
							saveIdsTo: RETURNED_IDS,
							callback: doItemImport,
							listItemBuilder: d20plus.monsters._listItemBuilder,
							listIndex: d20plus.monsters._listCols,
							listIndexConverter: d20plus.monsters._listIndexConverter
						}
					);
				}

				// items
				function doItemImport () {
					const preItems = Object.keys(tags)
						.filter(k => tags[k].page === "items.html")
						.map(k => tags[k]);
					if (confirm("Import items from this adventure?")) doPreImport(preItems, showItemImport);
					else doMainImport();
				}

				function showItemImport (toImport) {
					d20plus.ut.log(`Displaying item import list for [${adMeta.name}]`);
					d20plus.importer.showImportList(
						"item",
						toImport.filter(it => it),
						d20plus.items.handoutBuilder,
						{
							groupOptions: d20plus.items._groupOptions,
							saveIdsTo: RETURNED_IDS,
							callback: doMainImport,
							listItemBuilder: d20plus.items._listItemBuilder,
							listIndex: d20plus.items._listCols,
							listIndexConverter: d20plus.items._listIndexConverter
						}
					);
				}

				function doPreImport (asTags, callback) {
					const tmp = [];
					let cachedCount = asTags.length;
					// FIXME crappy inefficient conversion to promise-based version; requires cleanup
					asTags.forEach(async it => {
						try {
							await Renderer.hover.pCacheAndGet(it.page, it.source, it.hash);
							tmp.push(Renderer.hover._getFromCache(it.page, it.source, it.hash));
							cachedCount--;
							if (cachedCount <= 0) callback(tmp);
						} catch (x) {
							console.log(x);
							cachedCount--;
							if (cachedCount <= 0) callback(tmp);
						}
					});
				}
				////////////////////////////////////////////////////////////////////////////////////////////////////////
				function doMainImport () {
					// pass in any created handouts/characters to use for links in the renderer
					renderer.setRoll20Ids(RETURNED_IDS);

					let cancelWorker = false;
					const $btnCancel = $(`#importcancel`);
					$btnCancel.off("click");
					$btnCancel.on("click", () => {
						cancelWorker = true;
					});

					let remaining = addQueue.length;

					d20plus.ut.log(`Running import of [${adMeta.name}] with ${interval} ms delay between each handout create`);
					let lastId = null;
					let lastName = null;

					const worker = setInterval(() => {
						if (!addQueue.length || cancelWorker) {
							clearInterval(worker);
							$stsName.text("DONE!");
							$stsRemain.text("0");
							d20plus.ut.log(`Finished import of [${adMeta.name}]`);
							renderer.resetRoll20Ids();
							return;
						}

						// pull items out the queue in LIFO order, for journal ordering (last created will be at the top)
						const entry = addQueue.pop();
						entry.name = entry.name || "(Unknown)";
						entry.name = d20plus.importer.getCleanText(renderer.render(entry.name));
						$stsName.text(entry.name);
						$stsRemain.text(remaining--);
						const folder = d20plus.journal.makeDirTree(entry.dir);

						d20.Campaign.handouts.create({
							name: entry.name
						}, {
							success: function (handout) {
								const renderStack = [];
								renderer.recursiveRender(entry, renderStack);
								if (lastId && lastName) renderStack.push(`<br><p>Next handout: <a href="http://journal.roll20.net/handout/${lastId}">${lastName}</a></p>`);
								const rendered = renderStack.join("");

								lastId = handout.id;
								lastName = entry.name;
								handout.updateBlobs({notes: rendered});
								handout.save({notes: (new Date).getTime(), inplayerjournals: ""});
								d20.journal.addItemToFolderStructure(handout.id, folder.id);
							}
						});
					}, interval);
				}
			}
		});
	};

	d20plus.miniInitStyle = `
	#initiativewindow button.initmacrobutton {
		padding: 1px 4px;
	}

	#initiativewindow input {
		font-size: 8px;
	}

	#initiativewindow ul li span.name {
		font-size: 13px;
		padding-top: 0;
		padding-left: 4px;
		margin-top: -3px;
	}

	#initiativewindow ul li img {
		min-height: 15px;
		max-height: 15px;
	}

	#initiativewindow ul li {
		min-height: 15px;
	}

	#initiativewindow div.header span.initiative,
	#initiativewindow ul li span.initiative,
	#initiativewindow ul li span.tracker-col,
	#initiativewindow div.header span.tracker-col,
	#initiativewindow div.header span.initmacro,
	#initiativewindow ul li span.initmacro {
		font-size: 10px;
		font-weight: bold;
		text-align: right;
		float: right;
		padding: 0 5px;
		width: 7%;
		min-height: 20px;
		display: block;
		overflow: hidden;
	}

	#initiativewindow ul li .controls {
		padding: 0 3px;
	}
`;

	d20plus.setInitiativeShrink = function (doShrink) {
		const customStyle = $(`#dynamicStyle`);
		if (doShrink) {
			customStyle.html(d20plus.miniInitStyle);
		} else {
			customStyle.html("");
		}
	};

	d20plus.difficultyHtml = `<span class="difficulty" style="position: absolute; pointer-events: none"></span>`;

	d20plus.multipliers = [1, 1.5, 2, 2.5, 3, 4, 5];

	d20plus.playerImportHtml = `<div id="d20plus-playerimport" title="Temporary Import">
	<div class="append-target">
		<!-- populate with js -->
	</div>
	<div class="append-list-journal" style="max-height: 400px; overflow-y: auto;">
		<!-- populate with js -->
	</div>
	<p><i>Player-imported items are temporary, as players can't make handouts. GMs may also use this functionality to avoid cluttering the journal. Once imported, items can be drag-dropped to character sheets.</i></p>
	</div>`;

	d20plus.importListHTML = `<div id="d20plus-importlist" title="Import..." style="width: 1000px;">
<p style="display: flex">
	<button type="button" id="importlist-selectall" class="btn" style="margin: 0 2px;"><span>Select All</span></button>
	<button type="button" id="importlist-deselectall" class="btn" style="margin: 0 2px;"><span>Deselect All</span></button>
	<button type="button" id="importlist-selectvis" class="btn" style="margin: 0 2px;"><span>Select Visible</span></button>
	<button type="button" id="importlist-deselectvis" class="btn" style="margin: 0 2px;"><span>Deselect Visible</span></button>
	<span style="width:1px;background: #bbb;height: 26px;margin: 2px;"></span>
	<button type="button" id="importlist-selectall-published" class="btn" style="margin: 0 2px;"><span>Select All Published</span></button>
</p>
<p>
<span id="import-list">
	<input class="search" autocomplete="off" placeholder="Search list...">
	<input type="search" id="import-list-filter" class="filter" placeholder="Filter...">
	<span id ="import-list-filter-help" title="Filter format example: 'cr:1/4; cr:1/2; type:beast; source:MM' -- hover over the columns to see the filterable name." style="cursor: help;">[?]</span>
	<br>
	<span class="list" style="max-height: 400px; overflow-y: auto; overflow-x: hidden; display: block; margin-top: 1em; transform: translateZ(0);"></span>
</span>
</p>
<p id="import-options">
<label style="display: inline-block">Group Handouts By... <select id="organize-by"></select></label>
<button type="button" id="import-open-props" class="btn" role="button" aria-disabled="false" style="padding: 3px; display: inline-block;">Select Properties</button>
<label>Make handouts visible to all players? <input type="checkbox" title="Make items visible to all players" id="import-showplayers" checked></label>
<label>Overwrite existing? <input type="checkbox" title="Overwrite existing" id="import-overwrite"></label>
</p>
<button type="button" id="importstart" class="btn" role="button" aria-disabled="false">
<span>Start Import</span>
</button>
</div>`;

	d20plus.importListPropsHTML = `<div id="d20plus-import-props" title="Choose Properties to Import">
	<div class="select-props" style="max-height: 400px; overflow-y: auto; transform: translateZ(0)">
		<!-- populate with JS -->
	</div>
	<p>
		Warning: this feature is highly experimental, and disabling <span style="color: red;">properties which are assumed to always exist</span> is not recommended.
		<br>
		<button type="button" id="save-import-props" class="btn" role="button" aria-disabled="false">Save</button>
	</p>
	</div>`;

	d20plus.importDialogHtml = `<div id="d20plus-import" title="Importing">
<p>
<h3 id="import-name"></h3>
</p>
<b id="import-remaining"></b> <span id="import-remaining-text">remaining</span>
<p>
Errors: <b id="import-errors">0</b>
</p>
<p>
<button style="width: 90%" type="button" id="importcancel" alt="Cancel" title="Cancel Import" class="btn btn-danger" role="button" aria-disabled="false">
	<span>Cancel</span>
</button>
</p>
</div>`;

	d20plus.settingsHtmlImportHeader = `
<h4>Import By Category</h4>
<p><small><i>We strongly recommend the OGL sheet for importing. You can switch afterwards.</i></small></p>
`;
	d20plus.settingsHtmlSelector = `
<select id="import-mode-select">
<option value="none" disabled selected>Select category...</option>
<option value="adventure">Adventures</option>
<option value="background">Backgrounds</option>
<option value="class">Classes</option>
<option value="feat">Feats</option>
<option value="item">Items</option>
<option value="monster">Monsters</option>
<option value="object">Objects</option>
<option value="optionalfeature">Optional Features (Invocations, etc.)</option>
<option value="psionic">Psionics</option>
<option value="race">Races</option>
<option value="spell">Spells</option>
<option value="subclass">Subclasses</option>
</select>
`;
	d20plus.settingsHtmlSelectorPlayer = `
<select id="import-mode-select-player">
<option value="none" disabled selected>Select category...</option>
<option value="background">Backgrounds</option>
<option value="class">Classes</option>
<option value="feat">Feats</option>
<option value="item">Items</option>
<option value="optionalfeature">Optional Features (Invocations, etc.)</option>
<option value="psionic">Psionics</option>
<option value="race">Races</option>
<option value="spell">Spells</option>
<option value="subclass">Subclasses</option>
</select>
`;
	d20plus.settingsHtmlPtMonsters = `
<div class="importer-section" data-import-group="monster">
<h4>Monster Importing</h4>
<label for="import-monster-url">Monster Data URL:</label>
<select id="button-monsters-select">
<!-- populate with JS-->
</select>
<input type="text" id="import-monster-url">
<p><a class="btn" href="#" id="button-monsters-load">Import Monsters</a></p>
<p><a class="btn" href="#" id="button-monsters-load-all" title="Standard sources only; no third-party or UA">Import Monsters From All Sources</a></p>
<p>
WARNING: Importing huge numbers of character sheets slows the game down. We recommend you import them as needed.<br>
The "Import Monsters From All Sources" button presents a list containing monsters from official sources only.<br>
To import from third-party sources, either individually select one available in the list or enter a custom URL, and "Import Monsters."
</p>
</div>
`;

	d20plus.settingsHtmlPtItems = `
<div class="importer-section" data-import-group="item">
<h4>Item Importing</h4>
<label for="import-items-url">Item Data URL:</label>
<select id="button-items-select"><!-- populate with JS--></select>
<input type="text" id="import-items-url">
<a class="btn" href="#" id="import-items-load">Import Items</a>
</div>
`;

	d20plus.settingsHtmlPtItemsPlayer = `
<div class="importer-section" data-import-group="item">
<h4>Item Importing</h4>
<label for="import-items-url-player">Item Data URL:</label>
<select id="button-items-select-player"><!-- populate with JS--></select>
<input type="text" id="import-items-url-player">
<a class="btn" href="#" id="import-items-load-player">Import Items</a>
</div>
`;

	d20plus.settingsHtmlPtSpells = `
<div class="importer-section" data-import-group="spell">
<h4>Spell Importing</h4>
<label for="import-spell-url">Spell Data URL:</label>
<select id="button-spell-select">
<!-- populate with JS-->
</select>
<input type="text" id="import-spell-url">
<p><a class="btn" href="#" id="button-spells-load">Import Spells</a><p/>
<p><a class="btn" href="#" id="button-spells-load-all" title="Standard sources only; no third-party or UA">Import Spells From All Sources</a></p>
<p>
The "Import Spells From All Sources" button presents a list containing spells from official sources only.<br>
To import from third-party sources, either individually select one available in the list or enter a custom URL, and "Import Spells."
</p>
</div>
`;

	d20plus.settingsHtmlPtSpellsPlayer = `
<div class="importer-section" data-import-group="spell">
<h4>Spell Importing</h4>
<label for="import-spell-url-player">Spell Data URL:</label>
<select id="button-spell-select-player">
<!-- populate with JS-->
</select>
<input type="text" id="import-spell-url-player">
<p><a class="btn" href="#" id="button-spells-load-player">Import Spells</a><p/>
<p><a class="btn" href="#" id="button-spells-load-all-player" title="Standard sources only; no third-party or UA">Import Spells From All Sources</a></p>
<p>
The "Import Spells From All Sources" button presents a list containing spells from official sources only.<br>
To import from third-party sources, either individually select one available in the list or enter a custom URL, and "Import Spells."
</p>
</div>
`;

	d20plus.settingsHtmlPtPsionics = `
<div class="importer-section" data-import-group="psionic">
<h4>Psionic Importing</h4>
<label for="import-psionics-url">Psionics Data URL:</label>
<select id="button-psionics-select"><!-- populate with JS--></select>
<input type="text" id="import-psionics-url">
<a class="btn" href="#" id="import-psionics-load">Import Psionics</a>
</div>
`;

	d20plus.settingsHtmlPtPsionicsPlayer = `
<div class="importer-section" data-import-group="psionic">
<h4>Psionic Importing</h4>
<label for="import-psionics-url-player">Psionics Data URL:</label>
<select id="button-psionics-select-player"><!-- populate with JS--></select>
<input type="text" id="import-psionics-url-player">
<a class="btn" href="#" id="import-psionics-load-player">Import Psionics</a>
</div>
`;

	d20plus.settingsHtmlPtFeats = `
<div class="importer-section" data-import-group="feat">
<h4>Feat Importing</h4>
<label for="import-feats-url">Feat Data URL:</label>
<select id="button-feats-select"><!-- populate with JS--></select>
<input type="text" id="import-feats-url">
<a class="btn" href="#" id="import-feats-load">Import Feats</a>
</div>
`;

	d20plus.settingsHtmlPtFeatsPlayer = `
<div class="importer-section" data-import-group="feat">
<h4>Feat Importing</h4>
<label for="import-feats-url-player">Feat Data URL:</label>
<select id="button-feats-select-player"><!-- populate with JS--></select>
<input type="text" id="import-feats-url-player">
<a class="btn" href="#" id="import-feats-load-player">Import Feats</a>
</div>
`;

	d20plus.settingsHtmlPtObjects = `
<div class="importer-section" data-import-group="object">
<h4>Object Importing</h4>
<label for="import-objects-url">Object Data URL:</label>
<select id="button-objects-select"><!-- populate with JS--></select>
<input type="text" id="import-objects-url">
<a class="btn" href="#" id="import-objects-load">Import Objects</a>
</div>
`;

	d20plus.settingsHtmlPtRaces = `
<div class="importer-section" data-import-group="race">
<h4>Race Importing</h4>
<label for="import-races-url">Race Data URL:</label>
<select id="button-races-select"><!-- populate with JS--></select>
<input type="text" id="import-races-url">
<a class="btn" href="#" id="import-races-load">Import Races</a>
</div>
`;

	d20plus.settingsHtmlPtRacesPlayer = `
<div class="importer-section" data-import-group="race">
<h4>Race Importing</h4>
<label for="import-races-url-player">Race Data URL:</label>
<select id="button-races-select-player"><!-- populate with JS--></select>
<input type="text" id="import-races-url-player">
<a class="btn" href="#" id="import-races-load-player">Import Races</a>
</div>
`;

	d20plus.settingsHtmlPtClasses = `
<div class="importer-section" data-import-group="class">
<h4>Class Importing</h4>
<p style="margin-top: 5px"><a class="btn" href="#" id="button-classes-load-all" title="Standard sources only; no third-party or UA">Import Classes from 5etools</a></p>
<label for="import-classes-url">Class Data URL:</label>
<select id="button-classes-select">
<!-- populate with JS-->
</select>
<input type="text" id="import-classes-url">
<p><a class="btn" href="#" id="button-classes-load">Import Classes from URL</a><p/>
</div>
`;

	d20plus.settingsHtmlPtClassesPlayer = `
<div class="importer-section" data-import-group="class">
<h4>Class Importing</h4>
<p style="margin-top: 5px"><a class="btn" href="#" id="button-classes-load-all-player">Import Classes from 5etools</a></p>
<label for="import-classes-url-player">Class Data URL:</label>
<select id="button-classes-select-player">
<!-- populate with JS-->
</select>
<input type="text" id="import-classes-url-player">
<p><a class="btn" href="#" id="button-classes-load-player">Import Classes from URL</a><p/>
</div>
`;

	d20plus.settingsHtmlPtSubclasses = `
<div class="importer-section" data-import-group="subclass">
<h4>Subclass Importing</h4>
<label for="import-subclasses-url">Subclass Data URL:</label>
<select id="button-subclasses-select"><!-- populate with JS--></select>
<input type="text" id="import-subclasses-url">
<a class="btn" href="#" id="import-subclasses-load">Import Subclasses</a>
</div>
`;

	d20plus.settingsHtmlPtSubclassesPlayer = `
<div class="importer-section" data-import-group="subclass">
<h4>Subclass Importing</h4>
<label for="import-subclasses-url-player">Subclass Data URL:</label>
<select id="button-subclasses-select-player"><!-- populate with JS--></select>
<input type="text" id="import-subclasses-url-player">
<a class="btn" href="#" id="import-subclasses-load-player">Import Subclasses</a>
</div>
`;

	d20plus.settingsHtmlPtBackgrounds = `
<div class="importer-section" data-import-group="background">
<h4>Background Importing</h4>
<label for="import-backgrounds-url">Background Data URL:</label>
<select id="button-backgrounds-select"><!-- populate with JS--></select>
<input type="text" id="import-backgrounds-url">
<a class="btn" href="#" id="import-backgrounds-load">Import Backgrounds</a>
</div>
`;

	d20plus.settingsHtmlPtBackgroundsPlayer = `
<div class="importer-section" data-import-group="background">
<h4>Background Importing</h4>
<label for="import-backgrounds-url-player">Background Data URL:</label>
<select id="button-backgrounds-select-player"><!-- populate with JS--></select>
<input type="text" id="import-backgrounds-url-player">
<a class="btn" href="#" id="import-backgrounds-load-player">Import Backgrounds</a>
</div>
`;


	d20plus.settingsHtmlPtOptfeatures = `
<div class="importer-section" data-import-group="optionalfeature">
<h4>Optional Feature (Invocations, etc.) Importing</h4>
<label for="import-optionalfeatures-url">Optional Feature Data URL:</label>
<select id="button-optionalfeatures-select"><!-- populate with JS--></select>
<input type="text" id="import-optionalfeatures-url">
<a class="btn" href="#" id="import-optionalfeatures-load">Import Optional Features</a>
</div>
`;

	d20plus.settingsHtmlPtOptfeaturesPlayer = `
<div class="importer-section" data-import-group="optionalfeature">
<h4>Optional Feature (Invocations, etc.) Importing</h4>
<label for="import-optionalfeatures-url-player">Optional Feature Data URL:</label>
<select id="button-optionalfeatures-select-player"><!-- populate with JS--></select>
<input type="text" id="import-optionalfeatures-url-player">
<a class="btn" href="#" id="import-optionalfeatures-load-player">Import Optional Features</a>
</div>
`;

	d20plus.settingsHtmlPtAdventures = `
<div class="importer-section" data-import-group="adventure">
<b style="color: red">Please note that this importer has been superceded by the Module Importer tool, found in the Tools List, or <a href="#" class="Vetools-module-tool-open" style="color: darkred; font-style: italic">by clicking here</a>.</b>
<h4>Adventure Importing</h4>
<label for="import-adventures-url">Adventure Data URL:</label>
<select id="button-adventures-select">
<!-- populate with JS-->
</select>
<input type="text" id="import-adventures-url">
<p><a class="btn" href="#" id="button-adventures-load">Import Adventure</a><p/>
<p>
</p>
</div>
`;

	d20plus.settingsHtmlPtImportFooter = `
<p><a class="btn bind-drop-locations" href="#" id="bind-drop-locations" style="margin-top: 5px;width: 100%;box-sizing: border-box;">Bind Drag-n-Drop</a></p>
<p><strong>Readme</strong></p>
<p>
You can drag-and-drop imported handouts to character sheets.<br>
If a handout is glowing green in the journal, it's draggable. This breaks when Roll20 decides to hard-refresh the journal.<br>
To restore this functionality, press the "Bind Drag-n-Drop" button.<br>
<i>Note: to drag a handout to a character sheet, you need to drag the name, and not the handout icon.</i>
</p>
`;

	d20plus.css.cssRules = d20plus.css.cssRules.concat([
		{
			s: ".no-shrink",
			r: "flex-shrink: 0;"
		},
		{
			s: "#initiativewindow ul li span.initiative,#initiativewindow ul li span.tracker-col,#initiativewindow ul li span.initmacro",
			r: "font-size: 25px;font-weight: bold;text-align: right;float: right;padding: 2px 5px;width: 10%;min-height: 20px;display: block;"
		},
		{
			s: "#initiativewindow ul li span.editable input",
			r: "width: 100%; box-sizing: border-box;height: 100%;"
		},
		{
			s: "#initiativewindow div.header",
			r: "height: 30px;"
		},
		{
			s: "#initiativewindow div.header span",
			r: "cursor: default;font-size: 15px;font-weight: bold;text-align: right;float: right;width: 10%;min-height: 20px;padding: 5px;"
		},
		{
			s: ".ui-dialog-buttonpane span.difficulty",
			r: "display: inline-block;padding: 5px 4px 6px;margin: .5em .4em .5em 0;font-size: 18px;"
		},
		{
			s: ".ui-dialog-buttonpane.buttonpane-absolute-position",
			r: "position: absolute;bottom: 0;box-sizing: border-box;width: 100%;"
		},
		{
			s: ".ui-dialog.dialog-collapsed .ui-dialog-buttonpane",
			r: "position: initial;"
		},
		{
			s: ".token .cr,.header .cr",
			r: "display: none!important;"
		},
		{
			s: "li.handout.compendium-item .namecontainer",
			r: "box-shadow: inset 0px 0px 25px 2px rgb(195, 239, 184);"
		},
		{
			s: ".bind-drop-locations:active",
			r: "box-shadow: inset 0px 0px 25px 2px rgb(195, 239, 184);"
		},
		{
			s: "del.userscript-hidden",
			r: "display: none;"
		},
		{
			s: ".importer-section",
			r: "display: none;"
		},
		{
			s: ".userscript-rd__h",
			r: "font-weight: bold;"
		},
		{
			s: ".userscript-rd__h--0",
			r: "font-weight: bold; font-size: 1.5em;"
		},
		{
			s: ".userscript-rd__h--2",
			r: "font-weight: bold; font-size: 1.3em;"
		},
		{
			s: ".userscript-rd__h--3, .userscript-rd__h--4",
			r: "font-style: italic"
		},
		{
			s: ".userscript-rd__b-inset--readaloud",
			r: "background: #cbd6c688 !important"
		},
		// "No character sheet" message
		{
			s: ".ve-nosheet__body",
			r: "overflow: hidden !important;"
		},
		{
			s: ".ve-nosheet__overlay",
			r: `
				background: darkred;
				position: fixed;
				z-index: 99999;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100vw;
				height: 100vh;
				color: white;
				font-family: monospace;`
		},
		{
			s: ".ve-nosheet__title",
			r: "font-size: 72px;"
		},
		{
			s: ".ve-nosheet__btn-close",
			r: `position: absolute;
				top: 8px;
				right: 8px;
				font-size: 16px;`
		},
	]);

	d20plus.tool.tools = d20plus.tool.tools.concat([
		{
			name: "Shapeshifter Token Builder",
			desc: "Build a rollable table and related token to represent a shapeshifting creature.",
			html: `
				<div id="d20plus-shapeshiftbuild" title="Shapeshifter Token Builder">
					<div id="shapeshiftbuild-list">
						<input type="search" class="search" placeholder="Search creatures...">
						<input type="search" class="filter" placeholder="Filter...">
						<span title="Filter format example: 'cr:1/4; cr:1/2; type:beast; source:MM'" style="cursor: help;">[?]</span>
						<div class="list" style="transform: translateZ(0); max-height: 490px; overflow-y: auto; overflow-x: hidden;"><i>Loading...</i></div>
					</div>
				<br>
				<input id="shapeshift-name" placeholder="Table name">
				<button class="btn">Create Table</button>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-shapeshiftbuild").dialog({
					autoOpen: false,
					resizable: true,
					width: 800,
					height: 650,
				});
			},
			openFn: async () => {
				const $win = $("#d20plus-shapeshiftbuild");
				$win.dialog("open");

				const toLoad = Object.keys(monsterDataUrls).map(src => d20plus.monsters.formMonsterUrl(monsterDataUrls[src]));

				const $fltr = $win.find(`.filter`);
				$fltr.off("keydown").off("keyup");
				$win.find(`button`).off("click");

				const $lst = $win.find(`.list`);
				let tokenList;

				const dataStack = (await Promise.all(toLoad.map(async url => await DataUtil.loadJSON(url)))).flat();

				$lst.empty();
				let toShow = [];

				const seen = {};
				await Promise.all(dataStack.map(async d => {
					const toAdd = d.monster.filter(m => {
						const out = !(seen[m.source] && seen[m.source].has(m.name));
						if (!seen[m.source]) seen[m.source] = new Set();
						seen[m.source].add(m.name);
						return out;
					});

					toShow = toShow.concat(toAdd);
				}));

				toShow = toShow.sort((a, b) => SortUtil.ascSort(a.name, b.name));

				let tmp = "";
				toShow.forEach((m, i)  => {
					m.__pType = Parser.monTypeToFullObj(m.type).asText;

					tmp += `
								<label class="import-cb-label" data-listid="${i}">
									<input type="checkbox">
									<span class="name col-4">${m.name}</span>
									<span class="type col-4">TYP[${m.__pType.uppercaseFirst()}]</span>
									<span class="cr col-2">${m.cr === undefined ? "CR[Unknown]" : `CR[${(m.cr.cr || m.cr)}]`}</span>
									<span title="${Parser.sourceJsonToFull(m.source)}" class="source">SRC[${Parser.sourceJsonToAbv(m.source)}]</span>
								</label>
							`;
				});
				$lst.html(tmp);
				tmp = null;

				tokenList = new List("shapeshiftbuild-list", {
					valueNames: ["name", "type", "cr", "source"]
				});

				d20plus.importer.addListFilter($fltr, toShow, tokenList, d20plus.monsters._listIndexConverter);

				$win.find(`button`).on("click", () => {
					function getSizeInTiles (size) {
						switch (size) {
							case SZ_TINY:
								return 0.5;
							case SZ_SMALL:
							case SZ_MEDIUM:
								return 1;
							case SZ_LARGE:
								return 2;
							case SZ_HUGE:
								return 3;
							case SZ_GARGANTUAN:
								return 4;
							case SZ_COLOSSAL:
								return 5;
						}
					}

					console.log("Assembling creature list");
					if (tokenList) {
						$("a.ui-tabs-anchor[href='#deckstables']").trigger("click");

						const sel = tokenList.items
							.filter(it => $(it.elm).find(`input`).prop("checked"))
							.map(it => toShow[$(it.elm).attr("data-listid")]);

						const id = d20.Campaign.rollabletables.create().id;
						const table = d20.Campaign.rollabletables.get(id);
						table.set("name", $(`#shapeshift-name`).val().trim() || "Shapeshifter");
						table.save();
						sel.forEach(m => {
							const item = table.tableitems.create();
							item.set("name", m.name);
							// encode size info into the URL, which will get baked into the token
							const avatar = m.tokenUrl || `${IMG_URL}${Parser.sourceJsonToAbv(m.source)}/${m.name.replace(/"/g, "")}.png?roll20_token_size=${getSizeInTiles(m.size)}`;
							item.set("avatar", avatar);
							item.set("token_size", getSizeInTiles(m.size));
							item.save();
						});
						table.save();
						d20.rollabletables.refreshTablesList();
						alert("Created table!")
					}
				});
			}
		},
		{
			name: "Pauper's Character Vault",
			desc: "Dump characters to JSON, or import dumped characters.",
			html: `
				<div id="d20plus-paupervault" title="Pauper's Character Vault">
				<p>
					This experimental tool allows you to download characters as JSON, to later upload to other games.
				</p>
				<select name="sel_char" style="margin-bottom: 0;"></select> <button class="btn download">Download</button>
				<hr>
				<button class="btn upload">Upload</button><input accept=".json" type="file" style="position: absolute; left: -9999px;"> (Previously Downloaded files only)
				<br>
				<select name="sel_player" class="mt-2"></select>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-paupervault").dialog({
					autoOpen: false,
					resizable: true,
					width: 400,
					height: 300,
				});
			},
			openFn: () => {
				const $win = $("#d20plus-paupervault");
				$win.dialog("open");

				const $selChar = $win.find(`select[name="sel_char"]`).empty();

				$selChar.append(d20.Campaign.characters.toJSON().sort((a, b) => SortUtil.ascSort(a.name, b.name)).map(c => {
					return `<option value="${c.id}">${c.name || `(Unnamed; ID ${c.id})`}</option>`
				}).join(""));

				const $btnDl = $win.find(`.download`);
				$btnDl.off("click");
				$btnDl.on("click", () => {
					const id = $selChar.val();
					const rawChar = d20.Campaign.characters.get(id);
					const char = rawChar.toJSON();
					char.attribs = rawChar.attribs.toJSON();
					const out = {
						char,
						blobs: {}
					};
					blobCount = 3;
					const onBlobsReady = () => DataUtil.userDownload(char.name.replace(/[^0-9A-Za-z -_()[\]{}]/, "_"), JSON.stringify(out, null, "\t"));

					const handleBlob = (asKey, data) => {
						out.blobs[asKey] = data;
						blobCount--;
						if (blobCount === 0) onBlobsReady();
					};

					rawChar._getLatestBlob("bio", (data) => handleBlob("bio", data));
					rawChar._getLatestBlob("gmnotes", (data) => handleBlob("gmnotes", data));
					rawChar._getLatestBlob("defaulttoken", (data) => handleBlob("defaulttoken", data));
				});

				const $selPlayer = $win.find(`select[name="sel_player"]`).empty().append(`<option value="">Assign to...</option>`);
				$selPlayer[0].selectedIndex = 0;
				d20.Campaign.players.toJSON()
					.sort((a, b) => SortUtil.ascSortLower(a.displayname, b.displayname))
					.forEach(pl => $(`<option/>`).text(pl.displayname).val(pl.id).appendTo($selPlayer));

				const $btnUl = $win.find(`.upload`);
				$btnUl.off("click");
				$btnUl.on("click", () => {
					const $iptFile = $win.find(`input[type="file"]`);

					const input = $iptFile[0];

					const reader = new FileReader();
					reader.onload = () => {
						$("a.ui-tabs-anchor[href='#journal']").trigger("click");

						try {
							const text = reader.result;
							const json = JSON.parse(text);

							if (!json.char) {
								window.alert("Failed to import character! See the log for details.");
								console.error(`No "char" attribute found in parsed JSON!`);
								return;
							}
							const char = json.char;

							const assignTo = d20plus.ut.get$SelValue($selPlayer);
							if (assignTo) {
								char.inplayerjournals = assignTo;
								char.controlledby = assignTo
							}

							const newId = d20plus.ut.generateRowId();
							d20.Campaign.characters.create(
								{
									...char,
									id: newId
								},
								{
									success: function (character) {
										try {
											character.attribs.reset();
											if (!char.attribs) {
												window.alert(`Warning: Uploaded character had no "attribs" attribute. The character sheet will contain no data.`);
												return;
											}
											const toSave = char.attribs.map(a => character.attribs.push(a));
											toSave.forEach(s => s.syncedSave());

											const blobs = json.blobs;
											if (blobs) {
												character.updateBlobs({
													bio: blobs.bio || "",
													gmnotes: blobs.gmnotes || "",
													defaulttoken: blobs.defaulttoken || ""
												});
											}
											alert("Done!")
										} catch (e) {
											window.alert("Failed to import character! See the log for details.");
											console.error(e);
										}
									}
								}
							);
						} catch (e) {
							console.error(e);
							window.alert("Failed to load file! See the log for details.")
						}
					};
					input.onchange = function () {
						reader.readAsText(input.files[0]);
					};

					$iptFile.click();
				});
			}
		},
		{
			name: "Wild Shape Builder",
			desc: "Build a character sheet to represent a character in Wild Shape.",
			html: `
				<div id="d20plus-wildformbuild" title="Wild Shape Character Builder">
					<div id="wildformbuild-list">
						<input type="search" class="search" placeholder="Search creatures...">
						<input type="search" class="filter" placeholder="Filter...">
						<span title="Filter format example: 'cr:1/4; cr:1/2; type:beast; source:MM'" style="cursor: help;">[?]</span>
						<div class="list" style="transform: translateZ(0); max-height: 490px; overflow-y: auto; overflow-x: hidden;"><i>Loading...</i></div>
					</div>
				<br>
				<select id="wildform-character">
					<option value="" disabled selected>Select Character</option>
				</select>
				<button class="btn">Create Character Sheets</button>
				</div>
				`,
			dialogFn: () => {
				$("#d20plus-wildformbuild").dialog({
					autoOpen: false,
					resizable: true,
					width: 800,
					height: 650,
				});
			},
			openFn: async () => {
				const $win = $("#d20plus-wildformbuild");
				$win.dialog("open");

				const $selChar = $(`#wildform-character`);
				$selChar.empty();
				$selChar.append(`<option value="" disabled>Select Character</option>`);
				const allChars = d20.Campaign.characters.toJSON().map(it => {
					const out = {id: it.id, name: it.name || ""};
					const npc = d20.Campaign.characters.get(it.id).attribs.toJSON().find(it => it.name === "npc");
					out.npc = !!(npc && npc.current && Number(npc.current));
					return out;
				});
				let hasNpc = false;
				allChars.sort((a, b) => a.npc - b.npc || SortUtil.ascSort(a.name.toLowerCase(), b.name.toLowerCase()))
					.forEach(it => {
						if (it.npc && !hasNpc) {
							$selChar.append(`<option value="" disabled>--NPCs--</option>`);
							hasNpc = true;
						}
						$selChar.append(`<option value="${it.id}">${it.name}</option>`)
					});


				const $fltr = $win.find(`.filter`);
				$fltr.off("keydown").off("keyup");
				$win.find(`button`).off("click");

				const $lst = $win.find(`.list`);

				let tokenList;

				const toLoad = Object.keys(monsterDataUrls).map(src => d20plus.monsters.formMonsterUrl(monsterDataUrls[src]));

				const dataStack = (await Promise.all(toLoad.map(async url => DataUtil.loadJSON(url)))).flat();

				$lst.empty();
				let toShow = [];

				const seen = {};
				await Promise.all(dataStack.map(async d => {
					const toAdd = d.monster.filter(m => {
						const out = !(seen[m.source] && seen[m.source].has(m.name));
						if (!seen[m.source]) seen[m.source] = new Set();
						seen[m.source].add(m.name);
						return out;
					});

					toShow = toShow.concat(toAdd);
				}));

				toShow = toShow.sort((a, b) => SortUtil.ascSort(a.name, b.name));

				let tmp = "";
				toShow.forEach((m, i)  => {
					m.__pType = Parser.monTypeToFullObj(m.type).asText;

					tmp += `
								<label class="import-cb-label" data-listid="${i}">
								<input type="checkbox">
								<span class="name col-4">${m.name}</span>
								<span class="type col-4">TYP[${m.__pType.uppercaseFirst()}]</span>
								<span class="cr col-2">${m.cr === undefined ? "CR[Unknown]" : `CR[${(m.cr.cr || m.cr)}]`}</span>
								<span title="${Parser.sourceJsonToFull(m.source)}" class="source">SRC[${Parser.sourceJsonToAbv(m.source)}]</span>
								</label>
								`;
				});
				$lst.html(tmp);
				tmp = null;

				tokenList = new List("wildformbuild-list", {
					valueNames: ["name", "type", "cr", "source"]
				});

				d20plus.importer.addListFilter($fltr, toShow, tokenList, d20plus.monsters._listIndexConverter);

				$win.find(`button`).on("click", () => {
					const allSel = tokenList.items
						.filter(it => $(it.elm).find(`input`).prop("checked"))
						.map(it => toShow[$(it.elm).attr("data-listid")]);

					const character = $selChar.val();
					if (!character) return alert("No character selected!");

					const d20Character = d20.Campaign.characters.get(character);
					if (!d20Character) return alert("Failed to get character data!");

					const getAttrib = (name) => d20Character.attribs.toJSON().find(x => x.name === name);

					allSel.filter(it => it).forEach(sel => {
						sel = $.extend(true, {}, sel);

						sel.wis = (d20Character.attribs.toJSON().find(x => x.name === "wisdom")|| {}).current || 10;
						sel.int = (d20Character.attribs.toJSON().find(x => x.name === "intelligence")|| {}).current || 10;
						sel.cha = (d20Character.attribs.toJSON().find(x => x.name === "charisma")|| {}).current || 10;

						const attribsSkills = {
							acrobatics_bonus: "acrobatics",
							animal_handling_bonus: "animal_handling",
							arcana_bonus: "arcana",
							athletics_bonus: "athletics",
							deception_bonus: "deception",
							history_bonus: "history",
							insight_bonus: "insight",
							intimidation_bonus: "intimidation",
							investigation_bonus: "investigation",
							medicine_bonus: "medicine",
							nature_bonus: "nature",
							perception_bonus: "perception",
							performance_bonus: "performance",
							persuasion_bonus: "persuasion",
							religion_bonus: "religion",
							slight_of_hand_bonus: "slight_of_hand",
							stealth_bonus: "stealth",
						};
						const attribsSaves = {
							npc_int_save: "int",
							npc_wis_save: "wis",
							npc_cha_save: "cha"
						};
						sel.skill = sel.skill || {};
						sel.save = sel.save || {};

						for (const a in attribsSkills) {
							const characterValue = getAttrib(a);
							if (characterValue) {
								sel.skill[attribsSkills[a]] = Math.max(sel.skill[attribsSkills[a]] || 0, characterValue.current);
							}
						}

						for (const a in attribsSaves) {
							const characterValue = getAttrib(a);
							if (characterValue) {
								sel.save[attribsSkills[a]] = Math.max(sel.save[attribsSkills[a]] || 0, characterValue.current);
							}
						}

						(() => {
							const attr = d20plus.sheet === "ogl" ? "passive_wisdom" : d20plus.sheet === "shaped" ? "perception" : "";
							if (!attr) return;
							const charAttr = getAttrib(attr);
							if (!charAttr) return;
							const passivePer = Number(charAttr.current || 0) + (d20plus.sheet === "shaped" ? 10 : 0);
							sel.passive = Math.max(passivePer, sel.passive);
						})();

						const doBuild = (result) => {
							const options = {
								charFunction: (character) => {
									character._getLatestBlob("defaulttoken", y => {
										if (y) {
											const token = JSON.parse(y);
											token.name = `${sel.name} (${d20Character.attributes.name})`;
											token.showplayers_aura1 = true;
											token.showplayers_aura2 = true;
											token.showplayers_bar1 = true;
											token.showplayers_bar2 = true;
											token.showplayers_bar3 = true;
											token.showplayers_name = true;
											token.bar3_max = result.total;
											token.bar3_value = result.total;
											character.updateBlobs({defaulttoken: JSON.stringify(token)});
											character.save({defaulttoken: (new Date()).getTime()});
										}
									});

									$("a.ui-tabs-anchor[href='#journal']").trigger("click");
								},
								charOptions: {
									inplayerjournals: d20Character.attributes.inplayerjournals,
									controlledby: d20Character.attributes.controlledby
								}
							};

							d20plus.monsters.handoutBuilder(sel, true, false, `Wild Forms - ${d20Character.attributes.name}`, {}, options);
						};

						if (sel.hp.formula) d20plus.ut.randomRoll(sel.hp.formula, result => doBuild(result));
						else doBuild({total: 0});
					});
				});

			}
		}
	]);

	d20plus.initiativeHeaders = `<div class="header init-header">
<span class="ui-button-text initmacro init-sheet-header"></span>
<span class="initiative init-init-header" alt="Initiative" title="Initiative">Init</span>
<span class="cr" alt="CR" title="CR">CR</span>
<div class="tracker-header-extra-columns"></div>
</div>`;

	d20plus.initiativeTemplate = `<script id="tmpl_initiativecharacter" type="text/html">
<![CDATA[
	<li class='token <$ if (this.layer === "gmlayer") { $>gmlayer<$ } $>' data-tokenid='<$!this.id$>' data-currentindex='<$!this.idx$>'>
		<$ var token = d20.Campaign.pages.get(d20.Campaign.activePage()).thegraphics.get(this.id); $>
		<$ var char = (token) ? token.character : null; $>
		<$ if (d20plus.cfg.get("interface", "customTracker") && d20plus.cfg.get("interface", "trackerSheetButton")) { $>
			<span alt='Sheet Macro' title='Sheet Macro' class='initmacro'>
				<button type='button' class='initmacrobutton ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only pictos' role='button' aria-disabled='false'>
				<span class='ui-button-text'>N</span>
				</button>
			</span>
		<$ } $>
		<span alt='Initiative' title='Initiative' class='initiative <$ if (this.iseditable) { $>editable<$ } $>'>
			<$!this.pr$>
		</span>
		<$ if (char) { $>
			<$ var npc = char.attribs ? char.attribs.find(function(a){return a.get("name").toLowerCase() == "npc" }) : null; $>
		<$ } $>
		<div class="tracker-extra-columns">
			<!--5ETOOLS_REPLACE_TARGET-->
		</div>
		<$ if (this.avatar) { $><img src='<$!this.avatar$>' /><$ } $>
		<span class='name'><$!this.name$></span>
			<div class='clear' style='height: 0px;'></div>
			<div class='controls'>
		<span class='pictos remove'>#</span>
		</div>
	</li>
]]>
</script>`;

	d20plus.actionMacroPerception = "%{Selected|npc_perception} @{selected|wtype} &{template:default} {{name=Senses}}  @{selected|wtype} @{Selected|npc_senses} ";
	d20plus.actionMacroInit = "%{selected|npc_init}";
	d20plus.actionMacroDrImmunities = "@{selected|wtype} &{template:default} {{name=DR/Immunities}} {{Damage Resistance= @{selected|npc_resistances}}} {{Damage Vulnerability= @{selected|npc_vulnerabilities}}} {{Damage Immunity= @{selected|npc_immunities}}} {{Condition Immunity= @{selected|npc_condition_immunities}}} ";
	d20plus.actionMacroStats = "@{selected|wtype} &{template:default} {{name=Stats}} {{Armor Class= @{selected|npc_AC}}} {{Hit Dice= @{selected|npc_hpformula}}} {{Speed= @{selected|npc_speed}}} {{Senses= @{selected|npc_senses}}} {{Languages= @{selected|npc_languages}}} {{Challenge= @{selected|npc_challenge}(@{selected|npc_xp}xp)}}";
	d20plus.actionMacroSaves = "@{selected|wtype} &{template:simple}{{always=1}}?{Saving Throw?|STR,{{rname=Strength Save&#125;&#125;{{mod=@{npc_str_save}&#125;&#125; {{r1=[[1d20+@{npc_str_save}]]&#125;&#125;{{r2=[[1d20+@{npc_str_save}]]&#125;&#125;|DEX,{{rname=Dexterity Save&#125;&#125;{{mod=@{npc_dex_save}&#125;&#125; {{r1=[[1d20+@{npc_dex_save}]]&#125;&#125;{{r2=[[1d20+@{npc_dex_save}]]&#125;&#125;|CON,{{rname=Constitution Save&#125;&#125;{{mod=@{npc_con_save}&#125;&#125; {{r1=[[1d20+@{npc_con_save}]]&#125;&#125;{{r2=[[1d20+@{npc_con_save}]]&#125;&#125;|INT,{{rname=Intelligence Save&#125;&#125;{{mod=@{npc_int_save}&#125;&#125; {{r1=[[1d20+@{npc_int_save}]]&#125;&#125;{{r2=[[1d20+@{npc_int_save}]]&#125;&#125;|WIS,{{rname=Wisdom Save&#125;&#125;{{mod=@{npc_wis_save}&#125;&#125; {{r1=[[1d20+@{npc_wis_save}]]&#125;&#125;{{r2=[[1d20+@{npc_wis_save}]]&#125;&#125;|CHA,{{rname=Charisma Save&#125;&#125;{{mod=@{npc_cha_save}&#125;&#125; {{r1=[[1d20+@{npc_cha_save}]]&#125;&#125;{{r2=[[1d20+@{npc_cha_save}]]&#125;&#125;}{{charname=@{character_name}}} ";
	d20plus.actionMacroSkillCheck = "@{selected|wtype} &{template:simple}{{always=1}}?{Ability?|Acrobatics,{{rname=Acrobatics&#125;&#125;{{mod=@{npc_acrobatics}&#125;&#125; {{r1=[[1d20+@{npc_acrobatics}]]&#125;&#125;{{r2=[[1d20+@{npc_acrobatics}]]&#125;&#125;|Animal Handling,{{rname=Animal Handling&#125;&#125;{{mod=@{npc_animal_handling}&#125;&#125; {{r1=[[1d20+@{npc_animal_handling}]]&#125;&#125;{{r2=[[1d20+@{npc_animal_handling}]]&#125;&#125;|Arcana,{{rname=Arcana&#125;&#125;{{mod=@{npc_arcana}&#125;&#125; {{r1=[[1d20+@{npc_arcana}]]&#125;&#125;{{r2=[[1d20+@{npc_arcana}]]&#125;&#125;|Athletics,{{rname=Athletics&#125;&#125;{{mod=@{npc_athletics}&#125;&#125; {{r1=[[1d20+@{npc_athletics}]]&#125;&#125;{{r2=[[1d20+@{npc_athletics}]]&#125;&#125;|Deception,{{rname=Deception&#125;&#125;{{mod=@{npc_deception}&#125;&#125; {{r1=[[1d20+@{npc_deception}]]&#125;&#125;{{r2=[[1d20+@{npc_deception}]]&#125;&#125;|History,{{rname=History&#125;&#125;{{mod=@{npc_history}&#125;&#125; {{r1=[[1d20+@{npc_history}]]&#125;&#125;{{r2=[[1d20+@{npc_history}]]&#125;&#125;|Insight,{{rname=Insight&#125;&#125;{{mod=@{npc_insight}&#125;&#125; {{r1=[[1d20+@{npc_insight}]]&#125;&#125;{{r2=[[1d20+@{npc_insight}]]&#125;&#125;|Intimidation,{{rname=Intimidation&#125;&#125;{{mod=@{npc_intimidation}&#125;&#125; {{r1=[[1d20+@{npc_intimidation}]]&#125;&#125;{{r2=[[1d20+@{npc_intimidation}]]&#125;&#125;|Investigation,{{rname=Investigation&#125;&#125;{{mod=@{npc_investigation}&#125;&#125; {{r1=[[1d20+@{npc_investigation}]]&#125;&#125;{{r2=[[1d20+@{npc_investigation}]]&#125;&#125;|Medicine,{{rname=Medicine&#125;&#125;{{mod=@{npc_medicine}&#125;&#125; {{r1=[[1d20+@{npc_medicine}]]&#125;&#125;{{r2=[[1d20+@{npc_medicine}]]&#125;&#125;|Nature,{{rname=Nature&#125;&#125;{{mod=@{npc_nature}&#125;&#125; {{r1=[[1d20+@{npc_nature}]]&#125;&#125;{{r2=[[1d20+@{npc_nature}]]&#125;&#125;|Perception,{{rname=Perception&#125;&#125;{{mod=@{npc_perception}&#125;&#125; {{r1=[[1d20+@{npc_perception}]]&#125;&#125;{{r2=[[1d20+@{npc_perception}]]&#125;&#125;|Performance,{{rname=Performance&#125;&#125;{{mod=@{npc_performance}&#125;&#125; {{r1=[[1d20+@{npc_performance}]]&#125;&#125;{{r2=[[1d20+@{npc_performance}]]&#125;&#125;|Persuasion,{{rname=Persuasion&#125;&#125;{{mod=@{npc_persuasion}&#125;&#125; {{r1=[[1d20+@{npc_persuasion}]]&#125;&#125;{{r2=[[1d20+@{npc_persuasion}]]&#125;&#125;|Religion,{{rname=Religion&#125;&#125;{{mod=@{npc_religion}&#125;&#125; {{r1=[[1d20+@{npc_religion}]]&#125;&#125;{{r2=[[1d20+@{npc_religion}]]&#125;&#125;|Sleight of Hand,{{rname=Sleight of Hand&#125;&#125;{{mod=@{npc_sleight_of_hand}&#125;&#125; {{r1=[[1d20+@{npc_sleight_of_hand}]]&#125;&#125;{{r2=[[1d20+@{npc_sleight_of_hand}]]&#125;&#125;|Stealth,{{rname=Stealth&#125;&#125;{{mod=@{npc_stealth}&#125;&#125; {{r1=[[1d20+@{npc_stealth}]]&#125;&#125;{{r2=[[1d20+@{npc_stealth}]]&#125;&#125;|Survival,{{rname=Survival&#125;&#125;{{mod=@{npc_survival}&#125;&#125; {{r1=[[1d20+@{npc_survival}]]&#125;&#125;{{r2=[[1d20+@{npc_survival}]]&#125;&#125;}{{charname=@{character_name}}} ";
	d20plus.actionMacroAbilityCheck = "@{selected|wtype} &{template:simple}{{always=1}}?{Ability?|STR,{{rname=Strength&#125;&#125;{{mod=@{strength_mod}&#125;&#125; {{r1=[[1d20+@{strength_mod}]]&#125;&#125;{{r2=[[1d20+@{strength_mod}]]&#125;&#125;|DEX,{{rname=Dexterity&#125;&#125;{{mod=@{dexterity_mod}&#125;&#125; {{r1=[[1d20+@{dexterity_mod}]]&#125;&#125;{{r2=[[1d20+@{dexterity_mod}]]&#125;&#125;|CON,{{rname=Constitution&#125;&#125;{{mod=@{constitution_mod}&#125;&#125; {{r1=[[1d20+@{constitution_mod}]]&#125;&#125;{{r2=[[1d20+@{constitution_mod}]]&#125;&#125;|INT,{{rname=Intelligence&#125;&#125;{{mod=@{intelligence_mod}&#125;&#125; {{r1=[[1d20+@{intelligence_mod}]]&#125;&#125;{{r2=[[1d20+@{intelligence_mod}]]&#125;&#125;|WIS,{{rname=Wisdom&#125;&#125;{{mod=@{wisdom_mod}&#125;&#125; {{r1=[[1d20+@{wisdom_mod}]]&#125;&#125;{{r2=[[1d20+@{wisdom_mod}]]&#125;&#125;|CHA,{{rname=Charisma&#125;&#125;{{mod=@{charisma_mod}&#125;&#125; {{r1=[[1d20+@{charisma_mod}]]&#125;&#125;{{r2=[[1d20+@{charisma_mod}]]&#125;&#125;}{{charname=@{character_name}}} ";

	d20plus.actionMacroTrait = function (index) {
		return "@{selected|wtype} &{template:npcaction} {{name=@{selected|npc_name}}} {{rname=@{selected|repeating_npctrait_$" + index + "_name}}} {{description=@{selected|repeating_npctrait_$" + index + "_desc} }}";
	};

	d20plus.actionMacroAction = function (index) {
		return "%{selected|repeating_npcaction_$" + index + "_npc_action}";
	};

	d20plus.actionMacroReaction = "@{selected|wtype} &{template:npcaction} {{name=@{selected|npc_name}}} {{rname=@{selected|repeating_npcreaction_$0_name}}} {{description=@{selected|repeating_npcreaction_$0_desc} }} ";

	d20plus.actionMacroLegendary = function (tokenactiontext) {
		return "@{selected|wtype} @{selected|wtype}&{template:npcaction} {{name=@{selected|npc_name}}} {{rname=Legendary Actions}} {{description=The @{selected|npc_name} can take @{selected|npc_legendary_actions} legendary actions, choosing from the options below. Only one legendary option can be used at a time and only at the end of another creature's turn. The @{selected|npc_name} regains spent legendary actions at the start of its turn.\n\r" + tokenactiontext + "}} ";
	}
};

SCRIPT_EXTENSIONS.push(betteR205etoolsMain);


function d20plusImporter () {
	d20plus.importer = {};

	d20plus.importer._playerImports = {};
	d20plus.importer.storePlayerImport = function (id, data) {
		d20plus.importer._playerImports[id] = data;
	};

	d20plus.importer.retrievePlayerImport = function (id) {
		return d20plus.importer._playerImports[id];
	};

	d20plus.importer.clearPlayerImport = function () {
		d20plus.importer._playerImports = {};
	};

	d20plus.importer.addMeta = function (meta) {
		if (!meta) return;
		BrewUtil._sourceCache = BrewUtil._sourceCache || {};
		if (meta.sources) {
			meta.sources.forEach(src => {
				BrewUtil._sourceCache[src.json] = {abbreviation: src.abbreviation, full: src.full};
			});
		}
		const cpy = MiscUtil.copy(meta);
		delete cpy.sources;
		Object.keys(cpy).forEach(k => {
			BrewUtil.homebrewMeta[k] = BrewUtil.homebrewMeta[k] || {};
			Object.assign(BrewUtil.homebrewMeta[k], cpy[k]);
		});
	};

	d20plus.importer.getCleanText = function (str) {
		const check = jQuery.parseHTML(str);
		if (check.length === 1 && check[0].constructor === Text) {
			return str;
		}
		const $ele = $(str);
		$ele.find("td, th").append(" | ");
		$ele.find("tr").append("\n");
		$ele.find("p, li, br").append("\n\n");
		$ele.find("li").prepend(" - ");

		return $ele.text()
			.trim()
			.replace(/\n/g, "<<N>>")
			.replace(/\s+/g, " ")
			.replace(/<<N>>(<<N>>)+/g, "\n\n")
			.replace(/<<N>>/g, "\n")
			.replace(/\n +/g, "\n");

		/* version which preserves images, and converts dice
	const IMG_TAG = "R20IMGTAG";
	let imgIndex = 0;
	const imgStack = [];
	str.replace(/(<img.*>)/, (match) => {
		imgStack.push(match);
		return ` ${IMG_TAG}_${imgIndex++} `;
	});
	const $ele = $(str);
	$ele.find("p, li, br").append("\n\n");
	let out = $ele.text();
	out = out.replace(DICE_REGEX, (match) => {
		return `[[${match}]]`;
	});
	return out.replace(/R20IMGTAG_(\d+)/, (match, g1) => {
		return imgStack[Number(g1)];
	});
	*/
	};

	// TODO do a pre-pass _before_ this, attempting to link content tags to already-imported 5etools content (by scanning thru GM notes and attempting to parse as JSON -- cache the results of this scan, as it will presumably be super-expensive (need to then invalidate or add to this cache when importing new stuff))
	// TODO pass rendered text to this, as a post-processing step
	/**
	 * Attempt to find + swap links to 5e.tools to links to handouts.
	 *
	 * @param str HTML string, usually output by the renderer.
	 */
	d20plus.importer.tryReplaceLinks = function (str) {
		const $temp = $(`<div/>`);
		$temp.append(str);
		$temp.find(`a`).filter((i, e) => {
			const href = $(e).attr("href");
			if (!href || !href.trim()) return false;
			return href.toLowerCase().startsWith(BASE_SITE_URL);
		}).each((i, e) => {
			const txt = $(e).text();
			// TODO get text, compare against existing handout/character names, and link them using this:
            //   `http://journal.roll20.net/${id.type}/${id.roll20Id}`;
		});
	};

	d20plus.importer.doFakeDrop = function (event, characterView, fakeRoll20Json, outerI) {
		const t = event; // needs a "target" property, which should be the `.sheet-compendium-drop-target` element on the sheet
		const e = characterView; // AKA character.view
		const n = fakeRoll20Json;
		// var i = $(outerI.helper[0]).attr("data-pagename"); // always undefined, since we're not using a compendium drag-drop element
		const i = d20plus.ut.generateRowId();

		$(t.target).find("*[accept]").each(function() {
			$(this).val(undefined);
		});

		// BEGIN ROLL20 CODE
		var o = _.clone(n.data);
		o.Name = n.name,
			o.data = JSON.stringify(n.data),
			o.uniqueName = i,
			o.Content = n.content,
			$(t.target).find("*[accept]").each(function() {
				var t = $(this)
					, n = t.attr("accept");
				o[n] && ("input" === t[0].tagName.toLowerCase() && "checkbox" === t.attr("type") ? t.val() == o[n] ? t.prop("checked", !0) : t.prop("checked", !1) : "input" === t[0].tagName.toLowerCase() && "radio" === t.attr("type") ? t.val() == o[n] ? t.prop("checked", !0) : t.prop("checked", !1) : "select" === t[0].tagName.toLowerCase() ? t.find("option").each(function() {
					var e = $(this);
					e.val() !== o[n] && e.text() !== o[n] || e.prop("selected", !0)
				}) : $(this).val(o[n]),
					e.saveSheetValues(this))
			})
		// END ROLL20 CODE
	};

	// caller should run `$iptFilter.off("keydown").off("keyup");` before calling this
	d20plus.importer.addListFilter = function ($iptFilter, dataList, listObj, listIndexConverter) {
		$iptFilter.val("");
		const TYPE_TIMEOUT_MS = 100;
		let typeTimer;
		$iptFilter.on("keyup", () => {
			clearTimeout(typeTimer);
			typeTimer = setTimeout(() => {
				const exps = $iptFilter.val().split(";");
				const filters = exps.map(it => it.trim())
					.filter(it => it)
					.map(it => it.toLowerCase().split(":"))
					.filter(it => it.length === 2)
					.map(it => ({field: it[0], value: it[1]}));
				const grouped = [];
				filters.forEach(f => {
					const existing = grouped.find(it => it.field === f.field);
					if (existing) existing.values.push(f.value);
					else grouped.push({field: f.field, values: [f.value]})
				});

				listObj.filter((item) => {
					const it = dataList[$(item.elm).attr("data-listid")];
					it._filterVs = it._filterVs || listIndexConverter(it);
					return !grouped.find(f => {
						if (it._filterVs[f.field]) {
							if (it._filterVs[f.field] instanceof Array) {
								return !(it._filterVs[f.field].find(v => f.values.includes(v)));
							} else {
								return !f.values.includes(it._filterVs[f.field])
							}
						}
						return false;
					});
				});
			}, TYPE_TIMEOUT_MS);
		});
		$iptFilter.on("keydown", () => {
			clearTimeout(typeTimer);
		});
	};

	d20plus.importer.getSetAvatarImage = async function (character, avatar, portraitUrl) {
		var tokensize = 1;
		if (character.size === "L") tokensize = 2;
		if (character.size === "H") tokensize = 3;
		if (character.size === "G") tokensize = 4;
		var lightradius = null;
		if (character.senses && character.senses.toLowerCase().match(/(darkvision|blindsight|tremorsense|truesight)/)) lightradius = Math.max(...character.senses.match(/\d+/g));
		var lightmin = 0;
		if (character.senses && character.senses.toLowerCase().match(/(blindsight|tremorsense|truesight)/)) lightmin = lightradius;
		const nameSuffix = d20plus.cfg.get("import", "namesuffix");
		var defaulttoken = {
			represents: character.id,
			name: `${character.name}${nameSuffix ? ` ${nameSuffix}` : ""}`,
			imgsrc: avatar,
			width: 70 * tokensize,
			height: 70 * tokensize,
			compact_bar: d20plus.cfg.getOrDefault("token", "isCompactBars") ? "compact" : "standard"
		};
		if (!d20plus.cfg.get("import", "skipSenses")) {
			defaulttoken.light_hassight = true;
			if (lightradius != null) {
				defaulttoken.light_radius = `${lightradius}`;
				defaulttoken.light_dimradius = `${lightmin}`;
			}
		}
		const barLocation = d20plus.cfg.getOrDefault("token", "barLocation");
		switch (barLocation) {
			case "Above": defaulttoken.bar_location = "above"; break;
			case "Top Overlapping": defaulttoken.bar_location = "overlap_top"; break;
			case "Bottom Overlapping": defaulttoken.bar_location = "overlap_bottom"; break;
			case "Below": defaulttoken.bar_location = "below"; break;
		}

		// ensure any portrait URL exists
		let outPortraitUrl = portraitUrl || avatar;
		if (portraitUrl) {
			await new Promise(resolve => {
				$.ajax({
					url: portraitUrl,
					type: 'HEAD',
					error: function () {
						d20plus.ut.error(`Could not access portrait URL "${portraitUrl}"`);
						outPortraitUrl = avatar;
						resolve()
					},
					success: () => resolve()
				});
			});
		}

		character.attributes.avatar = outPortraitUrl;
		character.updateBlobs({avatar: outPortraitUrl, defaulttoken: JSON.stringify(defaulttoken)});
		character.save({defaulttoken: (new Date()).getTime()});
	};

	d20plus.importer.addAction = function (character, name, actionText, index) {
		if (d20plus.cfg.getOrDefault("import", "tokenactions")) {
			character.abilities.create({
				name: index + ": " + name,
				istokenaction: true,
				action: d20plus.actionMacroAction(index)
			}).save();
		}

		const newRowId = d20plus.ut.generateRowId();
		let actionDesc = actionText; // required for later reduction of information dump.

		function handleAttack () {
			const rollBase = d20plus.importer.rollbase(); // macro

			let attackType = "";
			let attackType2 = "";
			if (actionText.indexOf(" Weapon Attack:") > -1) {
				attackType = actionText.split(" Weapon Attack:")[0];
				attackType2 = " Weapon Attack:";
			} else if (actionText.indexOf(" Spell Attack:") > -1) {
				attackType = actionText.split(" Spell Attack:")[0];
				attackType2 = " Spell Attack:";
			}
			let attackRange = "";
			let rangeType = "";
			if (attackType.indexOf("Melee") > -1) {
				attackRange = (actionText.match(/reach (.*?),/) || ["", ""])[1];
				rangeType = "Reach";
			} else {
				attackRange = (actionText.match(/range (.*?),/) || ["", ""])[1];
				rangeType = "Range";
			}
			const toHit = (actionText.match(/\+(.*?) to hit/) || ["", ""])[1];
			let damage = "";
			let damageType = "";
			let damage2 = "";
			let damageType2 = "";
			let onHit = "";
			let damageRegex = /\d+ \((\d+d\d+\s?(?:\+|-)?\s?\d*)\) (\S+ )?damage/g;
			let damageSearches = damageRegex.exec(actionText);
			if (damageSearches) {
				onHit = damageSearches[0];
				damage = damageSearches[1];
				damageType = (damageSearches[2] != null) ? damageSearches[2].trim() : "";
				damageSearches = damageRegex.exec(actionText);
				if (damageSearches) {
					onHit += " plus " + damageSearches[0];
					damage2 = damageSearches[1];
					damageType2 = (damageSearches[2] != null) ? damageSearches[2].trim() : "";
				}
			}
			onHit = onHit.trim();
			const attackTarget = ((actionText.match(/\.,(?!.*\.,)(.*)\. Hit:/) || ["", ""])[1] || "").trim();
			// Cut the information dump in the description
			const atkDescSimpleRegex = /Hit: \d+ \((\d+d\d+\s?(?:\+|-)?\s?\d*)\) (\S+ )?damage\.([\s\S]*)/gm;
			const atkDescComplexRegex = /(Hit:[\s\S]*)/g;
			// is it a simple attack (just 1 damage type)?
			const match_simple_atk = atkDescSimpleRegex.exec(actionText);
			if (match_simple_atk != null) {
				//if yes, then only display special effects, if any
				actionDesc = match_simple_atk[3].trim();
			} else {
				//if not, simply cut everything before "Hit:" so there are no details lost.
				const matchCompleteAtk = atkDescComplexRegex.exec(actionText);
				if (matchCompleteAtk != null) actionDesc = matchCompleteAtk[1].trim();
			}
			const toHitRange = "+" + toHit + ", " + rangeType + " " + attackRange + ", " + attackTarget + ".";
			const damageFlags = `{{damage=1}} {{dmg1flag=1}}${damage2 ? ` {{dmg2flag=1}}` : ""}`;
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_name", current: name}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_flag", current: "on"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_npc_options-flag", current: "0"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_display_flag", current: "{{attack=1}}"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_options", current: "{{attack=1}}"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_tohit", current: toHit}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_damage", current: damage}).save();
			// TODO this might not be necessary on Shaped sheets?
			const critDamage = (damage || "").trim().replace(/[-+]\s*\d+$/, "").trim(); // replace any trailing modifiers e.g. "+5"
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_crit", current: critDamage}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_damagetype", current: damageType}).save();
			if (damage2) {
				character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_damage2", current: damage2}).save();
				character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_crit2", current: damage2}).save();
				character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_damagetype2", current: damageType2}).save();
			}
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_name_display", current: name}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_rollbase", current: rollBase}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_type", current: attackType}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_type_display", current: attackType + attackType2}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_tohitrange", current: toHitRange}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_range", current: attackRange}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_target", current: attackTarget}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_damage_flag", current: damageFlags}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_onhit", current: onHit}).save();

			const descriptionFlag = Math.max(Math.ceil(actionText.length / 57), 1);
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_description", current: actionDesc}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_description_flag", current: descriptionFlag}).save();

			// hidden = a single space
			const descVisFlag = d20plus.cfg.getOrDefault("import", "hideActionDescs") ? " " : "@{description}";
			character.attribs.create({name: `repeating_npcaction_${newRowId}_show_desc`, current: descVisFlag}).save();
		}

		function handleOtherAction () {
			const rollBase = d20plus.importer.rollbase(false); // macro
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_name", current: name}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_npc_options-flag", current: "0"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_description", current: actionDesc}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_tohitrange", current: "+0"}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_onhit", current: ""}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_damage_flag", current: ""}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_crit", current: ""}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_attack_crit2", current: ""}).save();
			character.attribs.create({name: "repeating_npcaction_" + newRowId + "_rollbase", current: rollBase}).save();
		}

		// attack parsing
		if (actionText.includes(" Attack:")) handleAttack();
		else handleOtherAction();
	};

	d20plus.importer.findAttrId = function (character, attrName) {
		const found = character.attribs.toJSON().find(a => a.name === attrName);
		return found ? found.id : undefined;
	};

	d20plus.importer.addOrUpdateAttr = function (character, attrName, value) {
		const id = d20plus.importer.findAttrId(character, attrName);
		if (id) {
			const it = character.attribs.get(id).set("current", value);
			it.save();
		} else {
			const it = character.attribs.create({
				"name": attrName,
				"current": value
			});
			it.save();
		}
	};

	d20plus.importer.makePlayerDraggable = function (importId, name) {
		const $appTo = $(`#d20plus-playerimport`).find(`.Vetools-player-imported`);
		const $li = $(`
		<li class="journalitem dd-item handout ui-draggable compendium-item Vetools-draggable player-imported" data-playerimportid="${importId}">
			<div class="dd-handle dd-sortablehandle">Drag</div>
			<div class="dd-content">
				<div class="token"><img src="/images/handout.png" draggable="false"></div>
				<div class="name">
					<div class="namecontainer">${name}</div>
				</div>
			</div>
		</li>
	`);
		$li.draggable({
			revert: true,
			distance: 10,
			revertDuration: 0,
			helper: "clone",
			handle: ".namecontainer",
			appendTo: "body",
			scroll: true,
			start: function () {
				console.log("drag start")
			},
			stop: function () {
				console.log("drag stop")
			}
		});
		$appTo.prepend($li);
	};

	d20plus.importer.getTagString = function (data, prefix) {
		return JSON.stringify(data.filter(it => it).map(d => `${prefix}-${Parser.stringToSlug(d.toString())}`).concat([prefix]));
	};

	// from OGL sheet, Aug 2018
	d20plus.importer.rollbase = (isAttack = true) => {
		const dtype = d20plus.importer.getDesiredDamageType();
		if (dtype === "full") {
			return `@{wtype}&{template:npcaction} ${isAttack ? `{{attack=1}}` : ""} @{damage_flag} @{npc_name_flag} {{rname=@{name}}} {{r1=[[@{d20}+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{dmg1=[[@{attack_damage}+0]]}} {{dmg1type=@{attack_damagetype}}} {{dmg2=[[@{attack_damage2}+0]]}} {{dmg2type=@{attack_damagetype2}}} {{crit1=[[@{attack_crit}+0]]}} {{crit2=[[@{attack_crit2}+0]]}} {{description=@{show_desc}}} @{charname_output}`;
		} else {
			return `@{wtype}&{template:npcatk} ${isAttack ? `{{attack=1}}` : ""} @{damage_flag} @{npc_name_flag} {{rname=[@{name}](~repeating_npcaction_npc_dmg)}} {{rnamec=[@{name}](~repeating_npcaction_npc_crit)}} {{type=[Attack](~repeating_npcaction_npc_dmg)}} {{typec=[Attack](~repeating_npcaction_npc_crit)}} {{r1=[[@{d20}+(@{attack_tohit}+0)]]}} @{rtype}+(@{attack_tohit}+0)]]}} {{description=@{show_desc}}} @{charname_output}`;
		}

	};

	d20plus.importer.getDesiredRollType = function () {
		// rtype
		const toggle = "@{advantagetoggle}";
		const never = "{{normal=1}} {{r2=[[0d20";
		const always = "{{always=1}} {{r2=[[@{d20}";
		const query = "{{query=1}} ?{Advantage?|Normal Roll,&#123&#123normal=1&#125&#125 &#123&#123r2=[[0d20|Advantage,&#123&#123advantage=1&#125&#125 &#123&#123r2=[[@{d20}|Disadvantage,&#123&#123disadvantage=1&#125&#125 &#123&#123r2=[[@{d20}}";
		const desired = d20plus.cfg.get("import", "advantagemode");
		if (desired) {
			switch (desired) {
				case "Toggle (Default Advantage)":
				case "Toggle":
				case "Toggle (Default Disadvantage)":
					return toggle;
				case "Always":
					return always;
				case "Query":
					return query;
				case "Never":
					return never;
			}
		} else {
			return toggle;
		}
	};

	d20plus.importer.getDesiredAdvantageToggle = function () {
		// advantagetoggle
		const advantage = "{{query=1}} {{advantage=1}} {{r2=[[@{d20}";
		const disadvantage = "{{query=1}} {{disadvantage=1}} {{r2=[[@{d20}";
		const desired = d20plus.cfg.get("import", "advantagemode");
		const neither = "";
		if (desired) {
			switch (desired) {
				case "Toggle (Default Advantage)":
					return advantage;
				case "Toggle (Default Disadvantage)":
					return desired;
				case "Toggle":
				case "Always":
				case "Query":
				case "Never":
					return neither;
			}
		} else {
			return neither;
		}
	};

	d20plus.importer.getDesiredWhisperType = function () {
		// wtype
		const toggle = "@{whispertoggle}";
		const never = " ";
		const always = "/w gm ";
		const query = "?{Whisper?|Public Roll,|Whisper Roll,/w gm }";
		const desired = d20plus.cfg.get("import", "whispermode");
		if (desired) {
			switch (desired) {
				case "Toggle (Default GM)":
				case "Toggle (Default Public)":
					return toggle;
				case "Always":
					return always;
				case "Query":
					return query;
				case "Never":
					return never;
			}
		} else {
			return toggle;
		}
	};

	d20plus.importer.getDesiredWhisperToggle = function () {
		// whispertoggle
		const gm = "/w gm ";
		const pblic = " ";
		const desired = d20plus.cfg.get("import", "whispermode");
		if (desired) {
			switch (desired) {
				case "Toggle (Default GM)":
					return gm;
				case "Toggle (Default Public)":
					return pblic;
				case "Always":
					return "";
				case "Query":
					return "";
				case "Never":
					return "";
			}
		} else {
			return gm;
		}
	};

	d20plus.importer.getDesiredDamageType = function () {
		// dtype
		const on = "full";
		const off = "pick";
		const desired = d20plus.cfg.get("import", "damagemode");
		if (desired) {
			switch (desired) {
				case "Auto Roll":
					return on;
				case "Don't Auto Roll":
					return off;
			}
		} else {
			return on;
		}
	};

	d20plus.importer.importModeSwitch = function () {
		d20plus.importer.clearPlayerImport();
		const $winPlayer = $(`#d20plus-playerimport`).find(`.append-list-journal`).empty();

		$(`.importer-section`).hide();
		const toShow = $(`#import-mode-select`).val();
		$(`#betteR20-settings`).find(`.importer-section[data-import-group="${toShow}"]`).show();
		const toShowPlayer = $(`#import-mode-select-player`).val();
		$(`#d20plus-playerimport`).find(`.importer-section[data-import-group="${toShowPlayer}"]`).show();
	};

	d20plus.importer.showImportList = async function (dataType, dataArray, handoutBuilder, options) {
		if (!options) options = {};
		/*
		options = {
			groupOptions: ["Source", "CR", "Alphabetical", "Type"],
			forcePlayer: true,
			callback: () => console.log("hello world"),
			saveIdsTo: {}, // object to receive IDs of created handouts/creatures
			// these three generally used together
			listItemBuilder: (it) => `<span class="name col-8">${it.name}</span><span title="${Parser.sourceJsonToFull(it.source)}" class="source col-4">${it.cr ? `(CR ${it.cr.cr || it.cr}) ` : ""}(${Parser.sourceJsonToAbv(it.source)})</span>`,
			listIndex: ["name", "source"],
			listIndexConverter: (mon) => {
				name: mon.name.toLowerCase(),
				source: Parser.sourceJsonToAbv(m.source).toLowerCase() // everything is assumed to be lowercase
			},
			nextStep: (doImport, originalImportQueue) {
				const modifiedImportQueue = originalImportQueue.map(it => JSON.stringify(JSON.parse(it));
				doImport(modifiedImportQueue);
			},
			builderOptions: {
				(...passed to handoutBuilder depending on requirements...)
			}
		}
		 */
		$("a.ui-tabs-anchor[href='#journal']").trigger("click");

		if (!window.is_gm || options.forcePlayer) {
			d20plus.importer.clearPlayerImport();
			const $winPlayer = $(`#d20plus-playerimport`);
			const $appPlayer = $winPlayer.find(`.append-list-journal`);
			$appPlayer.empty();
			$appPlayer.append(`<ol class="dd-list Vetools-player-imported" style="max-width: 95%;"/>`);
		}

		// sort data
		dataArray.sort((a, b) => SortUtil.ascSort(a.name, b.name));

		// collect available properties
		const propSet = {}; // represent this as an object instead of a set, to maintain some semblance of ordering
		dataArray.map(it => Object.keys(it)).forEach(keys => keys.forEach(k => propSet[k] = true));

		// build checkbox list
		const $list = $("#import-list .list");
		$list.html("");
		dataArray.forEach((it, i) => {
			if (it.noDisplay) return;

			const inner = options.listItemBuilder
				? options.listItemBuilder(it)
				:  `<span class="name col-10">${it.name}</span><span class="source" title="${Parser.sourceJsonToFull(it.source)}">${Parser.sourceJsonToAbv(it.source)}</span>`;

			$list.append(`
			<label class="import-cb-label" data-listid="${i}">
				<input type="checkbox">
				${inner}
			</label>
		`);
		});

		// init list library
		const importList = new List("import-list", {
			valueNames: options.listIndex || ["name"]
		});

		// reset the UI and add handlers
		$(`#import-list > .search`).val("");
		importList.search("");
		$("#import-options label").hide();
		$("#import-overwrite").parent().show();
		$("#import-showplayers").parent().show();
		$("#organize-by").parent().show();
		$("#d20plus-importlist").dialog("open");

		$("#d20plus-importlist button").unbind("click");

		$("#importlist-selectall").bind("click", () => {
			d20plus.importer._importSelectAll(importList);
		});
		$("#importlist-deselectall").bind("click", () => {
			d20plus.importer._importDeselectAll(importList);
		});
		$("#importlist-selectvis").bind("click", () => {
			d20plus.importer._importSelectVisible(importList);
		});
		$("#importlist-deselectvis").bind("click", () => {
			d20plus.importer._importDeselectVisible(importList);
		});

		$("#importlist-selectall-published").bind("click", () => {
			d20plus.importer._importSelectPublished(importList);
		});

		if (options.listIndexConverter) {
			const $iptFilter = $(`#import-list-filter`).show();
			$(`#import-list-filter-help`).show();
			$iptFilter.off("keydown").off("keyup");
			d20plus.importer.addListFilter($iptFilter, dataArray, importList, options.listIndexConverter);
		} else {
			$(`#import-list-filter`).hide();
			$(`#import-list-filter-help`).hide();
		}

		const excludedProps = new Set();
		const $winProps = $("#d20plus-import-props");
		$winProps.find(`button`).bind("click", () => {
			excludedProps.clear();
			$winProps.find(`.prop-row`).each((i, ele) => {
				if (!$(ele).find(`input`).prop("checked")) excludedProps.add($(ele).find(`span`).text());
			});
		});
		const $btnProps = $(`#save-import-props`);
		$btnProps.bind("click", () => {
			$winProps.dialog("close");
		});
		const $props = $winProps.find(`.select-props`);
		$props.empty();
		$(`#import-open-props`).bind("click", () => {
			Object.keys(propSet).forEach(p => {
				const req = REQUIRED_PROPS[dataType] && REQUIRED_PROPS[dataType].includes(p);
				$props.append(`
					<label style="display: block; ${req ? "color: red;" : ""}" class="prop-row">
						<input type="checkbox" checked="true">
						<span>${p}</span>
					</label>
				`)
			});
			$winProps.dialog("open");
		});

		const $selGroupBy = $(`#organize-by`);
		$selGroupBy.html("");
		options.groupOptions = (options.groupOptions || ["Alphabetical", "Source"]).concat(["None"]);
		options.groupOptions.forEach(g => {
			$selGroupBy.append(`<option value="${g}">${g}</option>`);
		});
		const storageKeyGroupBy = `Veconfig-importer-groupby-${dataType}`;
		$selGroupBy.on("change", () => {
			StorageUtil.pSet(storageKeyGroupBy, $selGroupBy.val())
		})
		try {
			const savedSelection = await StorageUtil.pGet(storageKeyGroupBy);
			if (savedSelection) {
				$selGroupBy.val(savedSelection);
			}
		} catch (e) {
			console.error("Failed to set group from saved!");
		}

		const $cbShowPlayers = $("#import-showplayers");
		$cbShowPlayers.prop("checked", dataType !== "monster");

		const $btnImport = $("#d20plus-importlist button#importstart");
		$btnImport.text(options.nextStep ? "Next" : "Import");
		$btnImport.bind("click", function () {
			$("#d20plus-importlist").dialog("close");
			const overwrite = $("#import-overwrite").prop("checked");
			const inJournals = $cbShowPlayers.prop("checked") ? "all" : "";
			const groupBy = $(`#organize-by`).val();

			// build list of items to process
			const importQueue = [];
			importList.items.forEach((e) => {
				if ($(e.elm).find("input").prop("checked")) {
					const dataIndex = parseInt($(e.elm).data("listid"));
					const it = dataArray[dataIndex];
					importQueue.push(it);
				}
			});

			if (!importQueue.length) return;

			const doImport = (importQueue) => {
				const $stsName = $("#import-name");
				const $stsRemain = $("#import-remaining");
				const $title = $stsName.parent().parent().find("span.ui-dialog-title");
				$title.text("Importing");

				let remaining = importQueue.length;

				let interval;
				if (dataType === "monster" || dataType === "object") {
					interval = d20plus.cfg.get("import", "importIntervalCharacter") || d20plus.cfg.getDefault("import", "importIntervalCharacter");
				} else {
					interval = d20plus.cfg.get("import", "importIntervalHandout") || d20plus.cfg.getDefault("import", "importIntervalHandout");
				}

				let cancelWorker = false;
				const $btnCancel = $(`#importcancel`);

				$btnCancel.off();
				$btnCancel.on("click", () => {
					cancelWorker = true;
					handleWorkerComplete();
				});

				const $remainingText = $("#import-remaining-text");
				$btnCancel.removeClass("btn-success");
				$btnCancel.text("Cancel");

				$remainingText.text("remaining");

				// start worker to process list
				$("#d20plus-import").dialog("open");

				// run one immediately
				let worker;
				workerFn();
				worker = setInterval(() => {
					workerFn();
				}, interval);

				function workerFn() {
					if (!importQueue.length) {
						handleWorkerComplete();
						return;
					}
					if (cancelWorker) {
						return;
					}

					// pull items out the queue in LIFO order, for journal ordering (last created will be at the top)
					let it = importQueue.pop();
					it.name = it.name || "(Unknown)";

					$stsName.text(it.name);
					$stsRemain.text(remaining--);

					if (excludedProps.size) {
						it = JSON.parse(JSON.stringify(it));
						[...excludedProps].forEach(k => delete it[k]);
					}

					if (!window.is_gm || options.forcePlayer) {
						handoutBuilder(it, undefined, undefined, undefined, undefined, options.builderOptions);
					} else {
						const folderName = groupBy === "None" ? "" : d20plus.importer._getHandoutPath(dataType, it, groupBy);
						const builderOptions = Object.assign({}, options.builderOptions || {});
						if (dataType === "spell" && groupBy === "Spell Points") builderOptions.isSpellPoints = true;
						handoutBuilder(it, overwrite, inJournals, folderName, options.saveIdsTo, builderOptions);
					}
				}

				function handleWorkerComplete() {
					if (worker) clearInterval(worker);

					if (cancelWorker) {
						$title.text("Import cancelled");
						$stsName.text("");
						if (~$stsRemain.text().indexOf("(cancelled)")) $stsRemain.text(`${$stsRemain.text()} (cancelled)`);
						d20plus.ut.log(`Import cancelled`);
						setTimeout(() => {
							d20plus.bindDropLocations();
						}, 250);
					} else {
						$title.text("Import complete");
						$stsName.text("");
						$btnCancel.addClass("btn-success");
						$btnCancel.prop("title", "");

						$stsRemain.text("0");
						d20plus.ut.log(`Import complete`);
						setTimeout(() => {
							d20plus.bindDropLocations();
						}, 250);
						if (options.callback) options.callback();
					}

					$btnCancel.off();
					$btnCancel.on("click", () => $btnCancel.closest('.ui-dialog-content').dialog('close'));

					$btnCancel.first().text("OK");
					$remainingText.empty();
					$stsRemain.empty();
				}
			};

			if (options.nextStep) {
				if (importQueue.length) {
					options.nextStep(doImport, importQueue)
				}
			} else {
				doImport(importQueue);
			}
		});
	};

	d20plus.importer._getHandoutPath = function (dataType, it, groupBy) {
		switch (dataType) {
			case "monster": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "CR":
						folderName = it.cr ? (it.cr.cr || it.cr) : "Unknown";
						break;
					case "Alphabetical":
						folderName = it.name[0].uppercaseFirst();
						break;
					case "Type (with tags)":
						folderName = Parser.monTypeToFullObj(it.type).asText.uppercaseFirst();
						break;
					case "CR → Type":
						folderName = [it.cr ? (it.cr.cr || it.cr) : "Unknown", Parser.monTypeToFullObj(it.type).type.uppercaseFirst()];
						break;
					case "Type":
					default:
						folderName = Parser.monTypeToFullObj(it.type).type.uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "spell": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
						folderName = it.name[0].uppercaseFirst();
						break;
					case "Spell Points":
						folderName = `${d20plus.spells.spLevelToSpellPoints(it.level)} spell points`;
						break;
					case "Level":
					default:
						folderName = `${Parser.spLevelToFull(it.level)}${it.level ? " level" : ""}`;
						break;
				}
				return folderName;
			}
			case "item": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Rarity":
						folderName = it.rarity;
						break;
					case "Alphabetical":
						folderName = it.name[0].uppercaseFirst();
						break;
					case "Type":
					default:
						if (it.type) {
							folderName = Parser.itemTypeToFull(it.type);
						} else if (it._typeListText) {
							folderName = it._typeListText.join(", ");
						} else {
							folderName = "Unknown";
						}
						break;
				}
				return folderName;
			}
			case "psionic": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Order":
						folderName = Parser.psiOrderToFull(it.order);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "feat": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "object": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "class": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "subclass": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
						folderName = it.name[0].uppercaseFirst();
						break;
					case "Class":
					default:
						folderName = it.class;
				}
				return folderName;
			}
			case "background": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "optionalfeature": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			case "race": {
				let folderName;
				switch (groupBy) {
					case "Source":
						folderName = Parser.sourceJsonToFull(it.source);
						break;
					case "Alphabetical":
					default:
						folderName = it.name[0].uppercaseFirst();
						break;
				}
				return folderName;
			}
			default:
				throw new Error(`Unknown import type '${dataType}'`);
		}
	};

	d20plus.importer._checkHandleDuplicate = function (path, overwrite) {
		const dupe = d20plus.journal.checkFileExistsByPath(path);
		if (dupe && !overwrite) return false;
		else if (dupe) d20plus.journal.removeFileByPath(path);
		return true;
	};

	d20plus.importer._importToggleSelectAll = function (importList, selectAllCb) {
		const $sa = $(selectAllCb);
		const val = $sa.prop("checked");
		importList.items.forEach(i => Array.prototype.forEach.call(i.elm.children, (e) => {
			if (e.tagName === "INPUT") {
				$(e).prop("checked", val);
			}
		}));
	};

	d20plus.importer._importSelectAll = function (importList) {
		importList.items.forEach(i => Array.prototype.forEach.call(i.elm.children, (e) => {
			if (e.tagName === "INPUT") {
				$(e).prop("checked", true);
			}
		}));
	};

	d20plus.importer._importSelectVisible = function (importList) {
		importList.visibleItems.forEach(i => Array.prototype.forEach.call(i.elm.children, (e) => {
			if (e.tagName === "INPUT") {
				$(e).prop("checked", true);
			}
		}));
	};

	d20plus.importer._importDeselectAll = function (importList) {
		importList.items.forEach(i => Array.prototype.forEach.call(i.elm.children, (e) => {
			if (e.tagName === "INPUT") {
				$(e).prop("checked", false);
			}
		}));
	};

	d20plus.importer._importDeselectVisible = function (importList) {
		importList.visibleItems.forEach(i => Array.prototype.forEach.call(i.elm.children, (e) => {
			if (e.tagName === "INPUT") {
				$(e).prop("checked", false);
			}
		}));
	};

	d20plus.importer._importSelectPublished = function (importList) {
		function setSelection (i, setTo) {
			Array.prototype.forEach.call(i.elm.children, (e) => {
				if (e.tagName === "INPUT") {
					$(e).prop("checked", setTo);
				}
			})
		}

		importList.items.forEach(i => {
			if (SourceUtil.isNonstandardSource(i.values().source)) {
				setSelection(i, false);
			} else {
				setSelection(i, true);
			}
		});
	};
}

SCRIPT_EXTENSIONS.push(d20plusImporter);


function d20plusMonsters () {
	d20plus.monsters = {
		TAG_SPELL_OPEN: "#VE_MARK_SPELL_OPEN#",
		TAG_SPELL_CLOSE: "#VE_MARK_SPELL_CLOSE#",
	};

	d20plus.monsters._groupOptions = ["Type", "Type (with tags)", "CR", "CR → Type", "Alphabetical", "Source"];
	d20plus.monsters._listCols = ["name", "type", "cr", "source"];
	d20plus.monsters._listItemBuilder = (it) => `
		<span class="name col-4" title="name">${it.name}</span>
		<span class="type col-4" title="type">TYP[${Parser.monTypeToFullObj(it.type).asText.uppercaseFirst()}]</span>
		<span class="cr col-2" title="cr">${it.cr === undefined ? "CR[Unknown]" : `CR[${(it.cr.cr || it.cr)}]`}</span>
		<span title="source [Full source name is ${Parser.sourceJsonToFull(it.source)}]" class="source">SRC[${Parser.sourceJsonToAbv(it.source)}]</span>`;
	d20plus.monsters._listIndexConverter = (m) => {
		m.__pType = m.__pType || Parser.monTypeToFullObj(m.type).type; // only filter using primary type
		return {
			name: m.name.toLowerCase(),
			type: m.__pType.toLowerCase(),
			cr: m.cr === undefined ? "unknown" : (m.cr.cr || m.cr).toLowerCase(),
			source: Parser.sourceJsonToAbv(m.source).toLowerCase()
		};
	};
	d20plus.monsters._doScale = (doImport, origImportQueue) => {
		const _template = `
			<div id="d20plus-monster-import-cr-scale" title="Scale CRs">
				<div id="monster-import-cr-scale-list">
					<input type="search" class="search" placeholder="Search creatures...">
					<input type="search" class="filter" placeholder="Filter...">
					<span title="Filter format example: 'cr:1/4; cr:1/2; type:beast; source:MM'" style="cursor: help;">[?]</span>

					<div style="margin-top: 10px;">
						<span class="col-3 ib"><b>Name</b></span>
						<span class="col-1 ib"><b>Source</b></span>
						<span class="col-2 ib"><b>CR</b></span>
						<span class="col-2 ib"><b>Rename To</b></span>
						<span class="col-3 ib"><b>Scale CR</b></span>
					</div>
					<div class="list" style="transform: translateZ(0); max-height: 490px; overflow-y: auto; overflow-x: hidden;"><i>Loading...</i></div>
				</div>
			<br>
			<button class="btn">Import</button>
			</div>
		`;
		if (!$(`#d20plus-monster-import-cr-scale`).length) {
			$(`body`).append(_template);
			$("#d20plus-monster-import-cr-scale").dialog({
				autoOpen: false,
				resizable: true,
				width: 800,
				height: 650,
			});
		}
		const $win = $("#d20plus-monster-import-cr-scale");
		$win.dialog("open");

		const $fltr = $win.find(`.filter`);
		$fltr.off("keydown").off("keyup");
		$win.find(`button`).off("click");

		const $lst = $win.find(`.list`);
		$lst.empty();

		let temp = "";
		origImportQueue.forEach((m, i) => {
			temp += `
				<div>
					<span class="name col-3 ib">${m.name}</span>
					<span title="${Parser.sourceJsonToFull(m.source)}" class="src col-1 ib">SRC[${Parser.sourceJsonToAbv(m.source)}]</span>
					<span class="cr col-2 ib">${m.cr === undefined ? "CR[Unknown]" : `CR[${(m.cr.cr || m.cr)}]`}</span>
					<span class="col-2 ib"><input class="target-rename" style="max-width: calc(100% - 18px);" placeholder="Rename To..."></span>
					<span class="col-2 ib"><input class="target-cr" placeholder="Adjusted CR (optional; 0-30)"></span>
					<span class="index" style="display: none;">${i}</span>
				</div>
			`;
		});
		$lst.append(temp);

		list = new List("monster-import-cr-scale-list", {
			valueNames: ["name", "src"]
		});

		d20plus.importer.addListFilter($fltr, origImportQueue, list, d20plus.monsters._listIndexConverter);

		const $btn = $win.find(`.btn`);
		$btn.click(() => {
			const queueCopy = JSON.parse(JSON.stringify(origImportQueue));

			const applyRename = (mon, newName) => {
				const applyTo = (prop) => {
					mon[prop] && mon[prop].forEach(it => {
						if (it.entries) it.entries = JSON.parse(JSON.stringify(it.entries).replace(new RegExp(mon.name, "gi"), newName));
						if (it.headerEntries) it.headerEntries = JSON.parse(JSON.stringify(it.headerEntries).replace(new RegExp(mon.name, "gi"), newName));
					})
				};

				applyTo("action");
				applyTo("reaction");
				applyTo("trait");
				applyTo("legendary");
				applyTo("variant");

				mon._displayName = newName;
			};

			let failed = false;
			const promises = [];
			for (const it of list.items) {
				const $ele = $(it.elm);
				const ix = Number($ele.find(`.index`).text());
				const m = origImportQueue[ix];
				const origCr = m.cr ? (m.cr.cr || m.cr) : "Unknown";
				const $iptCr = $ele.find(`.target-cr`);
				const rename = ($ele.find(`.target-rename`).val() || "").trim();
				const crValRaw = $iptCr.val();
				let crVal = crValRaw;
				if (crVal && crVal.trim()) {
					crVal = crVal.replace(/\s+/g, "").toLowerCase();
					const mt = /(1\/[248]|\d+)/.exec(crVal);
					if (mt) {
						const asNum = Parser.crToNumber(mt[0]);
						if (asNum < 0 || asNum > 30) {
							alert(`Invalid CR: ${crValRaw} for creature ${m.name} from ${Parser.sourceJsonToAbv(m.source)} (should be between 0 and 30)`);
							failed = true;
							break;
						} else if (asNum !== Parser.crToNumber(origCr)) {
							promises.push(ScaleCreature.scale(m, asNum).then(scaled => {
								queueCopy[ix] = scaled;
								if (rename) applyRename(queueCopy[ix], rename);
								return Promise.resolve();
							}));
						} else {
							if (rename) applyRename(queueCopy[ix], rename);
							console.log(`Skipping scaling creature ${m.name} from ${Parser.sourceJsonToAbv(m.source)} -- old CR matched new CR`)
						}
					} else {
						alert(`Invalid CR: ${crValRaw} for creature ${m.name} from ${Parser.sourceJsonToAbv(m.source)}`);
						failed = true;
						break;
					}
				} else {
					if (rename) applyRename(queueCopy[ix], rename);
				}
			}

			if (!failed) {
				const pVals = Object.values(promises);
				Promise.all(promises).then(results => {
					doImport(queueCopy);
				});
			}
		});
	};
	// Import Monsters button was clicked
	d20plus.monsters.button = function () {
		const url = $("#import-monster-url").val();
		if (url && url.trim()) {
			DataUtil.loadJSON(url).then(async data => {
				const doShowList = () => {
					d20plus.importer.addMeta(data._meta);
					d20plus.importer.showImportList(
						"monster",
						data.monster,
						d20plus.monsters.handoutBuilder,
						{
							groupOptions: d20plus.monsters._groupOptions,
							listItemBuilder: d20plus.monsters._listItemBuilder,
							listIndex: d20plus.monsters._listCols,
							listIndexConverter: d20plus.monsters._listIndexConverter,
							nextStep: d20plus.monsters._doScale
						}
					);
				};

				doShowList();
			});
		}
	};

	// Import All Monsters button was clicked
	d20plus.monsters.buttonAll = async function () {
		const filterUnofficial = !d20plus.cfg.getOrDefault("import", "allSourcesIncludeUnofficial");

		const toLoad = Object.keys(monsterDataUrls)
			.filter(src => !(SourceUtil.isNonstandardSource(src) && filterUnofficial))
			.map(src => d20plus.monsters.formMonsterUrl(monsterDataUrls[src]));

		if (d20plus.cfg.getOrDefault("import", "allSourcesIncludeHomebrew")) {
			monsterBrewDataUrls.forEach(it => toLoad.push(it.url));
		}

		if (toLoad.length) {
			const dataStack = (await Promise.all(toLoad.map(async url => DataUtil.loadJSON(url)))).flat();

			let toShow = [];

			const seen = {};
			await Promise.all(dataStack.map(async d => {
				const toAdd = d.monster.filter(m => {
					const out = !(seen[m.source] && seen[m.source].has(m.name));
					if (!seen[m.source]) seen[m.source] = new Set();
					seen[m.source].add(m.name);
					return out;
				});

				toShow = toShow.concat(toAdd);
			}));

			d20plus.importer.showImportList(
				"monster",
				toShow,
				d20plus.monsters.handoutBuilder,
				{
					groupOptions: d20plus.monsters._groupOptions,
					listItemBuilder: d20plus.monsters._listItemBuilder,
					listIndex: d20plus.monsters._listCols,
					listIndexConverter: d20plus.monsters._listIndexConverter,
					nextStep: d20plus.monsters._doScale
				}
			);
		}
	};

	d20plus.monsters.formMonsterUrl = function (fileName) {
		return d20plus.formSrcUrl(MONSTER_DATA_DIR, fileName);
	};

	// Create monster character from js data object
	d20plus.monsters.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		const doBuild = () => {
			if (!options) options = {};
			if (inJournals && typeof inJournals === "string") {
				options.charOptions = options.charOptions || {};
				options.charOptions.inplayerjournals = inJournals;
			}

			// make dir
			const folder = d20plus.journal.makeDirTree(`Monsters`, folderName);
			const path = ["Monsters", ...folderName, data._displayName || data.name];

			// handle duplicates/overwrites
			if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

			const name = data.name;
			const pType = Parser.monTypeToFullObj(data.type);

			const renderer = new Renderer();
			renderer.setBaseUrl(BASE_SITE_URL);

			let fluff;
			if (data.fluff) fluff = data.fluff;
			else if (monsterFluffData[data.source]) {
				fluff = (monsterFluffData[data.source].monsterFluff || [])
					.find(it => it.name === data.name && it.source === data.source)
			}

			let renderFluff = null;
			if (fluff) {
				const depth = fluff.type === "section" ? -1 : 2;
				if (fluff.type !== "section") renderer.setFirstSection(false);
				renderFluff = renderer.render({type: fluff.type, entries: fluff.entries || []}, depth);
			}

			d20.Campaign.characters.create(
				{
					name: data._displayName || data.name,
					tags: d20plus.importer.getTagString([
						pType.type,
						...pType.tags,
						`cr ${(data.cr ? (data.cr.cr || data.cr) : "").replace(/\//g, " over ")}` || "unknown cr",
						Parser.sourceJsonToFull(data.source),
						Parser.sizeAbvToFull(data.size),
						...(data.environment || []),
						data.isNPC ? "npc" : undefined
					], "creature"),
					...options.charOptions
				},
				{
					success: function (character) {
						if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BESTIARY](data)] = {name: data.name, source: data.source, type: "character", roll20Id: character.id};
						/* OGL Sheet */
						try {
							const type = Parser.monTypeToFullObj(data.type).asText;
							const source = Parser.sourceJsonToAbv(data.source);
							const avatar = data.tokenUrl || `${IMG_URL}${source}/${name.replace(/"/g, "")}.png`;
							character.size = data.size;
							character.name = data._displayName || data.name;
							character.senses = data.senses ? data.senses instanceof Array ? data.senses.join(", ") : data.senses : null;
							character.hp = data.hp.average || 0;
							const firstFluffImage = d20plus.cfg.getOrDefault("import", "importCharAvatar") === "Portrait (where available)" && fluff && fluff.images ? (() => {
								const firstImage = fluff.images[0] || {};
								return (firstImage.href || {}).type === "internal" ? `${BASE_SITE_URL}/img/${firstImage.href.path}` : (firstImage.href || {}).url;
							})() : null;
							$.ajax({
								url: avatar,
								type: 'HEAD',
								error: function () {
									d20plus.importer.getSetAvatarImage(character, `${IMG_URL}blank.png`, firstFluffImage);
								},
								success: function () {
									d20plus.importer.getSetAvatarImage(character, `${avatar}${d20plus.ut.getAntiCacheSuffix()}`, firstFluffImage);
								}
							});
							const parsedAc = typeof data.ac === "string" ? data.ac : $(`<div>${Parser.acToFull(data.ac)}</div>`).text();
							var ac = parsedAc.match(/^\d+/);
							var actype = /\(([^)]+)\)/.exec(parsedAc);
							var hp = data.hp.average || 0;
							var hpformula = data.hp.formula;
							var passive = data.passive != null ? data.passive : "";
							var passiveStr = passive !== "" ? "passive Perception " + passive : "";
							var senses = data.senses ? data.senses instanceof Array ? data.senses.join(", ") : data.senses : "";
							var sensesStr = senses !== "" ? senses + ", " + passiveStr : passiveStr;
							var size = d20plus.getSizeString(data.size || "");
							var alignment = data.alignment ? Parser.alignmentListToFull(data.alignment).toLowerCase() : "(Unknown Alignment)";
							var cr = data.cr ? (data.cr.cr || data.cr) : "";
							var xp = Parser.crToXpNumber(cr) || 0;
							character.attribs.create({name: "npc", current: 1});
							character.attribs.create({name: "npc_toggle", current: 1});
							character.attribs.create({name: "npc_options-flag", current: 0});
							// region disable charachtermancer
							character.attribs.create({name: "mancer_confirm_flag", current: ""});
							character.attribs.create({name: "mancer_cancel", current: "on"});
							character.attribs.create({name: "l1mancer_status", current: "completed"});
							// endregion
							character.attribs.create({name: "wtype", current: d20plus.importer.getDesiredWhisperType()});
							character.attribs.create({name: "rtype", current: d20plus.importer.getDesiredRollType()});
							character.attribs.create({
								name: "advantagetoggle",
								current: d20plus.importer.getDesiredAdvantageToggle()
							});
							character.attribs.create({
								name: "whispertoggle",
								current: d20plus.importer.getDesiredWhisperToggle()
							});
							character.attribs.create({name: "dtype", current: d20plus.importer.getDesiredDamageType()});
							character.attribs.create({name: "npc_name", current: data._displayName || data.name});
							character.attribs.create({name: "npc_size", current: size});
							character.attribs.create({name: "type", current: type});
							character.attribs.create({name: "npc_type", current: size + " " + type + ", " + alignment});
							character.attribs.create({name: "npc_alignment", current: alignment});
							character.attribs.create({name: "npc_ac", current: ac != null ? ac[0] : ""});
							character.attribs.create({name: "npc_actype", current: actype != null ? actype[1] || "" : ""});
							character.attribs.create({name: "npc_hpbase", current: hp != null ? hp : ""});
							character.attribs.create({
								name: "npc_hpformula",
								current: hpformula != null ? hpformula || "" : ""
							});

							const hpModId = d20plus.ut.generateRowId();
							character.attribs.create({name: `repeating_hpmod_${hpModId}_source`, current: "CON"});
							character.attribs.create({name: `repeating_hpmod_${hpModId}_mod`, current: Parser.getAbilityModNumber(data.con)});

							const parsedSpeed = Parser.getSpeedString(data);
							data.npc_speed = parsedSpeed;
							if (d20plus.sheet === "shaped") {
								data.npc_speed = data.npc_speed.toLowerCase();
								var match = data.npc_speed.match(/^\s*(\d+)\s?(ft\.?|m\.?)/);
								if (match && match[1]) {
									data.speed = match[1] + ' ' + match[2];
									character.attribs.create({name: "speed", current: match[1] + ' ' + match[2]});
								}
								data.npc_speed = parsedSpeed;
								var regex = /(burrow|climb|fly|swim)\s+(\d+)\s?(ft\.?|m\.?)/g;
								var speeds = void 0;
								while ((speeds = regex.exec(data.npc_speed)) !== null) character.attribs.create({
									name: "speed_" + speeds[1],
									current: speeds[2] + ' ' + speeds[3]
								});
								if (data.npc_speed && data.npc_speed.includes('hover')) character.attribs.create({
									name: "speed_fly_hover",
									current: 1
								});
								data.npc_speed = '';
							}

							function calcMod (score) {
								return Math.floor((Number(score) - 10) / 2);
							}

							character.attribs.create({name: "npc_speed", current: parsedSpeed != null ? parsedSpeed : ""});

							character.attribs.create({name: "strength", current: data.str});
							character.attribs.create({name: "strength_base", current: `${data.str}`});
							character.attribs.create({name: "strength_mod", current: calcMod(data.str)});
							character.attribs.create({name: "npc_str_negative", current: calcMod(data.str) < 0});
							character.attribs.create({name: "strength_flag", current: 0});

							character.attribs.create({name: "dexterity", current: data.dex});
							character.attribs.create({name: "dexterity_base", current: `${data.dex}`});
							character.attribs.create({name: "dexterity_mod", current: calcMod(data.dex)});
							character.attribs.create({name: "npc_dex_negative", current: calcMod(data.dex) < 0});
							character.attribs.create({name: "dexterity_flag", current: 0});

							character.attribs.create({name: "constitution", current: data.con});
							character.attribs.create({name: "constitution_base", current: `${data.con}`});
							character.attribs.create({name: "constitution_mod", current: calcMod(data.con)});
							character.attribs.create({name: "npc_con_negative", current: calcMod(data.con) < 0});
							character.attribs.create({name: "constitution_flag", current: 0});

							character.attribs.create({name: "intelligence", current: data.int});
							character.attribs.create({name: "intelligence_base", current: `${data.int}`});
							character.attribs.create({name: "intelligence_mod", current: calcMod(data.int)});
							character.attribs.create({name: "npc_int_negative", current: calcMod(data.int) < 0});
							character.attribs.create({name: "intelligence_flag", current: 0});

							character.attribs.create({name: "wisdom", current: data.wis});
							character.attribs.create({name: "wisdom_base", current: `${data.wis}`});
							character.attribs.create({name: "wisdom_mod", current: calcMod(data.wis)});
							character.attribs.create({name: "npc_wis_negative", current: calcMod(data.wis) < 0});
							character.attribs.create({name: "wisdom_flag", current: 0});

							character.attribs.create({name: "charisma", current: data.cha});
							character.attribs.create({name: "charisma_base", current: `${data.cha}`});
							character.attribs.create({name: "charisma_mod", current: calcMod(data.cha)});
							character.attribs.create({name: "npc_cha_negative", current: calcMod(data.cha) < 0});
							character.attribs.create({name: "charisma_flag", current: 0});

							character.attribs.create({name: "initiative_bonus", current: calcMod(data.dex)});

							character.attribs.create({name: "passive", current: passive});
							character.attribs.create({
								name: "npc_languages",
								current: data.languages != null ? data.languages instanceof Array ? data.languages.join(", ") : data.languages : ""
							});
							const moCn = cr.cr || cr;
							character.attribs.create({name: "npc_challenge", current: moCn});

							// set a rough character level for spellcasting calculations
							const pb = Parser.crToPb(moCn);
							const charLevel = pb === 2 ? 1 : pb === 3 ? 5 : cr === 4 ? 11 : cr === 6 ? 17 : cr > 6 ? 20 : 1;
							character.attribs.create({name: "level", current: charLevel}).save();

							character.attribs.create({name: "npc_xp", current: xp});
							character.attribs.create({
								name: "npc_vulnerabilities",
								current: data.vulnerable != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.vulnerable)) : ""
							});
							character.attribs.create({
								name: "damage_vulnerabilities",
								current: data.vulnerable != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.vulnerable)) : ""
							});
							character.attribs.create({
								name: "npc_resistances",
								current: data.resist != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.resist)) : ""
							});
							character.attribs.create({
								name: "damage_resistances",
								current: data.resist != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.resist)) : ""
							});
							character.attribs.create({name: "npc_immunities", current: data.immune != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.immune)) : ""});
							character.attribs.create({
								name: "damage_immunities",
								current: data.immune != null ? d20plus.importer.getCleanText(Parser.monImmResToFull(data.immune)) : ""
							});
							character.attribs.create({
								name: "npc_condition_immunities",
								current: data.conditionImmune != null ? d20plus.importer.getCleanText(Parser.monCondImmToFull(data.conditionImmune)) : ""
							});
							character.attribs.create({
								name: "damage_condition_immunities",
								current: data.conditionImmune != null ? d20plus.importer.getCleanText(Parser.monCondImmToFull(data.conditionImmune)) : ""
							});
							character.attribs.create({name: "npc_senses", current: sensesStr});
							if (d20plus.cfg.getOrDefault("import", "dexTiebreaker")) {
								character.attribs.create({
									name: "init_tiebreaker",
									current: "@{dexterity}/100"
								});
							}

							// add Tokenaction Macros
							if (d20plus.cfg.getOrDefault("import", "tokenactionsSkills")) {
								if (d20plus.sheet === "shaped") {

								} else {
									character.abilities.create({
										name: "Skill-Check",
										istokenaction: true,
										action: d20plus.actionMacroSkillCheck
									});
								}
							}
							if (d20plus.cfg.getOrDefault("import", "tokenactionsPerception")) {
								if (d20plus.sheet === "shaped") {

								} else {
									character.abilities.create({
										name: "Perception",
										istokenaction: true,
										action: d20plus.actionMacroPerception
									});
								}
							}
							if (d20plus.cfg.getOrDefault("import", "tokenactionsSaves")) {
								if (d20plus.sheet === "shaped") {
									character.abilities.create({
										name: "Saving Throws",
										istokenaction: true,
										action: `%{${character.id}|shaped_saving_throw_query}`
									});
								} else {
									character.abilities.create({
										name: "Saves",
										istokenaction: true,
										action: d20plus.actionMacroSaves
									});
								}
							}
							if (d20plus.cfg.getOrDefault("import", "tokenactionsInitiative")) {
								if (d20plus.sheet === "shaped") {
									character.abilities.create({
										name: "Init",
										istokenaction: true,
										action: `%{${character.id}|shaped_initiative}`
									});
								} else {
									character.abilities.create({
										name: "Init",
										istokenaction: true,
										action: d20plus.actionMacroInit
									});
								}
							}
							if (d20plus.cfg.getOrDefault("import", "tokenactionsChecks")) {
								if (d20plus.sheet === "shaped") {
									character.abilities.create({
										name: "Ability Checks",
										istokenaction: true,
										action: `%{${character.id}|shaped_ability_checks_query}`
									});
								} else {
									character.abilities.create({
										name: "Ability-Check",
										istokenaction: true,
										action: d20plus.actionMacroAbilityCheck
									});
								}
							}
							if (d20plus.cfg.getOrDefault("import", "tokenactionsOther")) {
								if (d20plus.sheet === "shaped") {

								} else {
									character.abilities.create({
										name: "DR/Immunities",
										istokenaction: true,
										action: d20plus.actionMacroDrImmunities
									});
									character.abilities.create({
										name: "Stats",
										istokenaction: true,
										action: d20plus.actionMacroStats
									});
								}
							}

							if (data.save != null) {
								character.attribs.create({name: "npc_saving_flag", current: "1337"}); // value doesn't matter
								Object.keys(data.save).forEach(k => {
									character.attribs.create({
										name: "npc_" + k + "_save_flag",
										current: Number(data.save[k])
									});
									character.attribs.create({
										name: "npc_" + k + "_save",
										current: Number(data.save[k])
									});
								});
							}
							if (data.skill != null) {
								const skills = data.skill;
								const skillsString = Object.keys(skills).map(function (k) {
									return k.uppercaseFirst() + ' ' + skills[k];
								}).join(', ');
								character.attribs.create({name: "npc_skills_flag", current: "1337"}); // value doesn't matter
								// character.attribs.create({name: "npc_skills", current: skillsString}); // no longer used

								// Shaped Sheet currently doesn't correctly load NPC Skills
								// This adds a visual representation as a Trait for reference
								if (d20plus.sheet === "shaped") {
									var newRowId = d20plus.ut.generateRowId();
									character.attribs.create({
										name: "repeating_npctrait_" + newRowId + "_name",
										current: "NPC Skills"
									});
									character.attribs.create({
										name: "repeating_npctrait_" + newRowId + "_desc",
										current: skillsString
									});
								}

								$.each(skills, function (k, v) {
									if (k !== "other") {
										const cleanSkill = $.trim(k).toLowerCase().replace(/ /g, "_");
										character.attribs.create({
											name: "npc_" + cleanSkill + "_base",
											current: String(Number(v))
										});
										character.attribs.create({
											name: "npc_" + cleanSkill,
											current: Number(v)
										});
										character.attribs.create({
											name: "npc_" + cleanSkill + "_flag",
											current: Number(v)
										});
									}
								});
							}
							if (data.spellcasting) { // Spellcasting import 2.0
								const charInterval = d20plus.cfg.get("import", "importIntervalCharacter") || d20plus.cfg.getDefault("import", "importIntervalCharacter");
								const spAbilsDelayMs = Math.max(350, Math.floor(charInterval / 5));

								// figure out the casting ability or spell DC
								let spellDc = null;
								let spellAbility = null;
								let casterLevel = null;
								let spellToHit = null;
								for (const sc of data.spellcasting) {
									if (!sc.headerEntries) continue;
									const toCheck = sc.headerEntries.join("");

									// use the first ability/DC we find, since roll20 doesn't support multiple
									const abM = /(strength|constitution|dexterity|intelligence|wisdom|charisma)/i.exec(toCheck);
									const dcM = /DC (\d+)|{@dc (\d+)}/i.exec(toCheck);
									const lvlM = /(\d+)(st|nd|rd|th).level\s+spellcaster/i.exec(toCheck);
									const spHit = /{@hit (.*?)} to hit with spell attacks/i.exec(toCheck);

									if (spellDc == null && dcM) spellDc = dcM[1] || dcM[2];
									if (casterLevel == null && lvlM) casterLevel = lvlM[1];
									if (spellAbility == null && abM) spellAbility = abM[1].toLowerCase();
									if (spellToHit == null && spHit) spellToHit = spHit[1];
								}

								function setAttrib (k, v) {
									d20plus.importer.addOrUpdateAttr(character, k, v);
								}

								function addInlineRollers (text) {
									if (!text) return text;
									return text.replace(RollerUtil.DICE_REGEX, (match) => {
										return `[[${match}]]`;
									});
								}

								// the basics
								setAttrib("npcspellcastingflag", "1");
								if (spellAbility != null) setAttrib("spellcasting_ability", `@{${spellAbility}_mod}+`); else console.warn("No spellAbility!");
								// spell_attack_mod -- never used?
								setTimeout(() => {
									if (spellToHit != null) setAttrib("spell_attack_bonus", Number(spellToHit)); else console.warn("No spellToHit!");
									if (spellDc != null) setAttrib("spell_save_dc", Number(spellDc)); else console.warn("No spellDc!");
									if (casterLevel != null) {
										setAttrib("caster_level", casterLevel);
										setAttrib("level", Number(casterLevel));
									} else console.warn("No casterLevel!");
								}, spAbilsDelayMs);

								// spell slots
								for (let i = 1; i <= 9; ++i) {
									const slots = data.spellcasting
										.map(it => ((it.spells || {})[i] || {}).slots)
										.filter(it => it)
										.reduce((a, b) => Math.max(a, b), 0);

									// delay this, otherwise they all come out as 0
									setTimeout(() => {
										setAttrib(`lvl${i}_slots_total`, slots);
									}, spAbilsDelayMs);
								}

								// add the spellcasting text
								const newRowId = d20plus.ut.generateRowId();
								const spellTrait = Renderer.monster.getSpellcastingRenderedTraits(data, renderer).map(it => it.rendered).filter(it => it).join("");
								const cleanDescription = d20plus.importer.getCleanText(spellTrait);
								setAttrib(`repeating_npctrait_${newRowId}_name`, "Spellcasting");
								setAttrib(`repeating_npctrait_${newRowId}_desc`, cleanDescription);

								// begin building a spells macro
								const $temp = $(spellTrait);
								$temp.find("a").each((i, e) => {
									const $wrp = $(`<div>${d20plus.monsters.TAG_SPELL_OPEN}</div>`);
									$wrp.append(e.outerHTML);
									$wrp.append(d20plus.monsters.TAG_SPELL_CLOSE);
									$(e).replaceWith($wrp)
								});
								const tokenActionStack = [d20plus.importer.getCleanText($temp[0].outerHTML)];

								// collect all the spells
								const allSpells = [];
								data.spellcasting.forEach(sc => {
									const toAdd = ["constant", "will", "rest", "daily", "weekly"];
									toAdd.forEach(k => {
										if (sc[k]) {
											Object.values(sc[k]).forEach(spOrSpArr => {
												if (spOrSpArr instanceof Array) {
													Array.prototype.push.apply(allSpells, spOrSpArr);
												} else {
													allSpells.push(spOrSpArr);
												}
											});
										}
									});

									if (sc.spells) {
										Object.keys(sc.spells).forEach(lvl => {
											if (sc.spells[lvl].spells) {
												Array.prototype.push.apply(allSpells, sc.spells[lvl].spells);
											}
										});
									}
								});

								// add spells to the sheet //////////////////
								const toAdd = [];
								allSpells.forEach(sp => {
									const tagSplit = Renderer.splitByTags(sp);
									tagSplit.forEach(s => {
										if (!s || !s.trim()) return;
										if (s.charAt(0) === "@") {
											const [tag, text] = Renderer.splitFirstSpace(s);
											if (tag === "@spell") {
												toAdd.push(text);
											}
										}
									});
								});

								const addMacroIndex = toAdd.length - 1;
								// wait a bit, then start adding spells
								setTimeout(() => {
									toAdd.forEach((text, i) => {
										let [name, source] = text.split("|");
										if (!source) source = "PHB";
										const rawUrl = spellDataUrls[Object.keys(spellDataUrls).find(src => source.toLowerCase() === src.toLowerCase())];
										const url = d20plus.spells.formSpellUrl(rawUrl);
										// the JSON gets cached by the script, so this is fine
										DataUtil.loadJSON(url).then((data) => {
											const spell = data.spell.find(spell => spell.name.toLowerCase() === name.toLowerCase());

											const [notecontents, gmnotes] = d20plus.spells._getHandoutData(spell);

											addSpell3(JSON.parse(gmnotes), spell, i, addMacroIndex);
										});
									});
								}, spAbilsDelayMs);

								function addSpell3 (data, VeSp, index, addMacroIndex) {
									console.log("Adding spell: ", data.name)
									// prepare data
									data.content = addInlineRollers(data.content);
									const DESC_KEY = "data-description";
									data.data[DESC_KEY] = addInlineRollers(data.data[DESC_KEY]);
									const HL_KEY = "Higher Spell Slot Desc";
									if (data.data[HL_KEY]) data.data[HL_KEY] = addInlineRollers(data.data[HL_KEY]);

									// populate spell data
									// source: https://github.com/Roll20/roll20-character-sheets/blob/master/5th%20Edition%20OGL%20by%20Roll20/5th%20Edition%20OGL%20by%20Roll20.html

									// custom code
									function setAttrs (attrs, callbacks) {
										Object.entries(attrs).forEach(([a, v]) => {
											character.attribs.create({name: a, current: v}).save();
										});
										if (callbacks) callbacks.forEach(cb => cb());
									}

									// custom code
									function getAttrs (attrs) {
										const all = character.attribs.toJSON();
										const out = {};
										attrs.forEach(k => {
											const found = all.find(it => it.name === k)
											if (found) out[k] = found.current;
										})
										return out;
									}

									// largely stolen from `update_attack_from_spell`
									function update_attack_from_spell (lvl, spellid, attackid, newattack) {
										const v = getAttrs(["repeating_spell-" + lvl + "_" + spellid + "_spellname",
											"repeating_spell-" + lvl + "_" + spellid + "_spellrange",
											"repeating_spell-" + lvl + "_" + spellid + "_spelltarget",
											"repeating_spell-" + lvl + "_" + spellid + "_spellattack",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldamage",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldamage2",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2",
											"repeating_spell-" + lvl + "_" + spellid + "_spellhealing",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod",
											"repeating_spell-" + lvl + "_" + spellid + "_spellsave",
											"repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess",
											"repeating_spell-" + lvl + "_" + spellid + "_spellhldie",
											"repeating_spell-" + lvl + "_" + spellid + "_spellhldietype",
											"repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus",
											"repeating_spell-" + lvl + "_" + spellid + "_spelllevel",
											"repeating_spell-" + lvl + "_" + spellid + "_includedesc",
											"repeating_spell-" + lvl + "_" + spellid + "_spelldescription",
											"repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels",
											"repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression",
											"repeating_spell-" + lvl + "_" + spellid + "_innate",
											"repeating_spell-" + lvl + "_" + spellid + "_spell_ability",
											"spellcasting_ability"]);

										var update = {};
										var description = "";
										var spellAbility = v["repeating_spell-" + lvl + "_" + spellid + "_spell_ability"] != "spell" ? v["repeating_spell-" + lvl + "_" + spellid + "_spell_ability"].slice(0, -1) : "spell";
										update["repeating_attack_" + attackid + "_atkattr_base"] = spellAbility;

										if(newattack) {
											update["repeating_attack_" + attackid + "_options-flag"] = "0";
											update["repeating_attack_" + attackid + "_spellid"] = spellid;
											update["repeating_attack_" + attackid + "_spelllevel"] = lvl;
										}

										if(v["repeating_spell-" + lvl + "_" + spellid + "_spell_ability"] == "spell") {
											update["repeating_attack_" + attackid + "_savedc"] = "(@{spell_save_dc})";
										} else if (v["repeating_spell-" + lvl + "_" + spellid + "_spell_ability"]) {
											update["repeating_attack_" + attackid + "_savedc"] = "(" + spellAbility + "+8+@{spell_dc_mod}+@{pb})";
										}

										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellname"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellname"] != "") {
											update["repeating_attack_" + attackid + "_atkname"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellname"];
										}
										if(!v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] || v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] === "None") {
											update["repeating_attack_" + attackid + "_atkflag"] = "0";
										}
										else {
											update["repeating_attack_" + attackid + "_atkflag"] = "{{attack=1}}";
											description = description + v["repeating_spell-" + lvl + "_" + spellid + "_spellattack"] + " Spell Attack. ";
										}

										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] && v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] != "") {
											update["repeating_attack_" + attackid + "_dmgflag"] = "{{damage=1}} {{dmg1flag=1}}";
											if(v["repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression"] && v["repeating_spell-" + lvl + "_" + spellid + "_spell_damage_progression"] === "Cantrip Dice") {
												update["repeating_attack_" + attackid + "_dmgbase"] = "[[round((@{level} + 1) / 6 + 0.5)]]" + v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"].substring(1);
											}
											else {
												update["repeating_attack_" + attackid + "_dmgbase"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"];
											}
										}
										else {
											update["repeating_attack_" + attackid + "_dmgflag"] = "0"
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod"] && v["repeating_spell-" + lvl + "_" + spellid + "_spelldmgmod"] === "Yes") {
											update["repeating_attack_" + attackid + "_dmgattr"] = spellAbility;
										}
										else {
											update["repeating_attack_" + attackid + "_dmgattr"] = "0";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"]) {
											update["repeating_attack_" + attackid + "_dmgtype"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype"];
										}
										else {
											update["repeating_attack_" + attackid + "_dmgtype"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"]) {
											update["repeating_attack_" + attackid + "_dmg2base"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"];
											update["repeating_attack_" + attackid + "_dmg2attr"] = 0;
											update["repeating_attack_" + attackid + "_dmg2flag"] = "{{damage=1}} {{dmg2flag=1}}";
										}
										else {
											update["repeating_attack_" + attackid + "_dmg2base"] = "";
											update["repeating_attack_" + attackid + "_dmg2attr"] = 0;
											update["repeating_attack_" + attackid + "_dmg2flag"] = "0";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"]) {
											update["repeating_attack_" + attackid + "_dmg2type"] = v["repeating_spell-" + lvl + "_" + spellid + "_spelldamagetype2"];
										}
										else {
											update["repeating_attack_" + attackid + "_dmg2type"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"]) {
											update["repeating_attack_" + attackid + "_atkrange"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"];
										}
										else {
											update["repeating_attack_" + attackid + "_atkrange"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"]) {
											update["repeating_attack_" + attackid + "_atkrange"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellrange"];
										}
										else {
											update["repeating_attack_" + attackid + "_atkrange"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellsave"]) {
											update["repeating_attack_" + attackid + "_saveflag"] = "{{save=1}} {{saveattr=@{saveattr}}} {{savedesc=@{saveeffect}}} {{savedc=[[[[@{savedc}]][SAVE]]]}}";
											update["repeating_attack_" + attackid + "_saveattr"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellsave"];
										}
										else {
											update["repeating_attack_" + attackid + "_saveflag"] = "0";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"]) {
											update["repeating_attack_" + attackid + "_saveeffect"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellsavesuccess"];
										}
										else {
											update["repeating_attack_" + attackid + "_saveeffect"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] != "" && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] != "") {
											var bonus = "";
											var spelllevel = v["repeating_spell-" + lvl + "_" + spellid + "_spelllevel"];
											var query = "?{Cast at what level?";
											for(i = 0; i < 10-spelllevel; i++) {
												query = query + "|Level " + (parseInt(i, 10) + parseInt(spelllevel, 10)) + "," + i;
											}
											query = query + "}";
											if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] != "") {
												bonus = "+(" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhlbonus"] + "*" + query + ")";
											}
											update["repeating_attack_" + attackid + "_hldmg"] = "{{hldmg=[[(" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhldie"] + "*" + query + ")" + v["repeating_spell-" + lvl + "_" + spellid + "_spellhldietype"] + bonus + "]]}}";
										}
										else {
											update["repeating_attack_" + attackid + "_hldmg"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"] != "") {
											if(!v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] || v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage"] === "") {
												update["repeating_attack_" + attackid + "_dmgbase"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"];
												update["repeating_attack_" + attackid + "_dmgflag"] = "{{damage=1}} {{dmg1flag=1}}";
												update["repeating_attack_" + attackid + "_dmgtype"] = "Healing";
											}
											else if(!v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] || v["repeating_spell-" + lvl + "_" + spellid + "_spelldamage2"] === "") {
												update["repeating_attack_" + attackid + "_dmg2base"] = v["repeating_spell-" + lvl + "_" + spellid + "_spellhealing"];
												update["repeating_attack_" + attackid + "_dmg2flag"] = "{{damage=1}} {{dmg2flag=1}}";
												update["repeating_attack_" + attackid + "_dmg2type"] = "Healing";
											}
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_innate"]) {
											update["repeating_attack_" + attackid + "_spell_innate"] = v["repeating_spell-" + lvl + "_" + spellid + "_innate"];
										}
										else {
											update["repeating_attack_" + attackid + "_spell_innate"] = "";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_spelltarget"]) {
											description = description + v["repeating_spell-" + lvl + "_" + spellid + "_spelltarget"] + ". ";
										}
										if(v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] && v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] === "on") {
											description = v["repeating_spell-" + lvl + "_" + spellid + "_spelldescription"];
											if(v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"] && v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"] != "") {
												description = description + "\n\nAt Higher Levels: " + v["repeating_spell-" + lvl + "_" + spellid + "_spellathigherlevels"];
											}
										}
										else if(v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] && v["repeating_spell-" + lvl + "_" + spellid + "_includedesc"] === "off") {
											description = "";
										}
										update["repeating_attack_" + attackid + "_atk_desc"] = description;

										// TODO are these necessary?
										// var callback = function() {update_attacks(attackid, "spell")};
										// setAttrs(update, {silent: true}, callback);
										setAttrs(update);
									}

									// largely stolen from `create_attack_from_spell`
									function create_attack_from_spell (lvl, spellid, character_id) {
										var update = {};
										var newrowid = d20plus.ut.generateRowId();
										update["repeating_spell-" + lvl + "_" + spellid + "_spellattackid"] = newrowid;
										update["repeating_spell-" + lvl + "_" + spellid + "_rollcontent"] = "%{" + character_id + "|repeating_attack_" + newrowid + "_attack}";
										setAttrs(update, update_attack_from_spell(lvl, spellid, newrowid, true));
									}

									// largely stolen from `processDrop`
									function processDrop (page) {
										const update = {};
										const callbacks = [];
										const id = d20plus.ut.generateRowId();

										/* eslint-disable block-spacing, no-extra-semi */
										var lvl = page.data["Level"] && page.data["Level"] > 0 ? page.data["Level"] : "cantrip";
										update["repeating_spell-" + lvl + "_" + id + "_spelllevel"] = lvl;
										if(page.data["spellcasting_ability"]) {
											update["repeating_spell-" + lvl + "_" + id + "_spell_ability"] = page.data["spellcasting_ability"];
										} else {
											update["repeating_spell-" + lvl + "_" + id + "_spell_ability"] = "spell";
										}
										if(page.name) {update["repeating_spell-" + lvl + "_" + id + "_spellname"] = page.name};
										if(page.data["Ritual"]) {update["repeating_spell-" + lvl + "_" + id + "_spellritual"] = "{{ritual=1}}"};
										if(page.data["School"]) {update["repeating_spell-" + lvl + "_" + id + "_spellschool"] = page.data["School"].toLowerCase()};
										if(page.data["Casting Time"]) {update["repeating_spell-" + lvl + "_" + id + "_spellcastingtime"] = page.data["Casting Time"]};
										if(page.data["Range"]) {update["repeating_spell-" + lvl + "_" + id + "_spellrange"] = page.data["Range"]};
										if(page.data["Target"]) {update["repeating_spell-" + lvl + "_" + id + "_spelltarget"] = page.data["Target"]};
										if(page.data["Components"]) {
											if(page.data["Components"].toLowerCase().indexOf("v") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_v"] = "0"};
											if(page.data["Components"].toLowerCase().indexOf("s") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_s"] = "0"};
											if(page.data["Components"].toLowerCase().indexOf("m") === -1) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_m"] = "0"};
										};
										if(page.data["Material"]) {update["repeating_spell-" + lvl + "_" + id + "_spellcomp_materials"] = page.data["Material"]};
										if(page.data["Concentration"]) {update["repeating_spell-" + lvl + "_" + id + "_spellconcentration"] = "{{concentration=1}}"};
										if(page.data["Duration"]) {update["repeating_spell-" + lvl + "_" + id + "_spellduration"] = page.data["Duration"]};
										if(page.data["Damage"] || page.data["Healing"]) {
											update["repeating_spell-" + lvl + "_" + id + "_spelloutput"] = "ATTACK";
											callbacks.push( function() {create_attack_from_spell(lvl, id, character.id);} );
										}
										else if(page.data["Higher Spell Slot Desc"] && page.data["Higher Spell Slot Desc"] != "") {
											var spelllevel = "?{Cast at what level?";
											for(i = 0; i < 10-lvl; i++) {
												spelllevel = spelllevel + "|Level " + (parseInt(i, 10) + parseInt(lvl, 10)) + "," + (parseInt(i, 10) + parseInt(lvl, 10));
											}
											spelllevel = spelllevel + "}";
											update["repeating_spell-" + lvl + "_" + id + "_rollcontent"] = "@{wtype}&{template:spell} {{level=@{spellschool} " + spelllevel + "}} {{name=@{spellname}}} {{castingtime=@{spellcastingtime}}} {{range=@{spellrange}}} {{target=@{spelltarget}}} @{spellcomp_v} @{spellcomp_s} @{spellcomp_m} {{material=@{spellcomp_materials}}} {{duration=@{spellduration}}} {{description=@{spelldescription}}} {{athigherlevels=@{spellathigherlevels}}} @{spellritual} {{innate=@{innate}}} @{spellconcentration} @{charname_output}";
										};
										if(page.data["Spell Attack"]) {update["repeating_spell-" + lvl + "_" + id + "_spellattack"] = page.data["Spell Attack"]};
										if(page.data["Damage"]) {update["repeating_spell-" + lvl + "_" + id + "_spelldamage"] = page.data["Damage"]};
										if(page.data["Damage Type"]) {update["repeating_spell-" + lvl + "_" + id + "_spelldamagetype"] = page.data["Damage Type"]};
										if(page.data["Secondary Damage"]) {update["repeating_spell-" + lvl + "_" + id + "_spelldamage2"] = page.data["Secondary Damage"]};
										if(page.data["Secondary Damage Type"]) {update["repeating_spell-" + lvl + "_" + id + "_spelldamagetype2"] = page.data["Secondary Damage Type"]};
										if(page.data["Healing"]) {update["repeating_spell-" + lvl + "_" + id + "_spellhealing"] = page.data["Healing"];};
										if(page.data["Add Casting Modifier"]) {update["repeating_spell-" + lvl + "_" + id + "_spelldmgmod"] = page.data["Add Casting Modifier"]};
										if(page.data["Save"]) {update["repeating_spell-" + lvl + "_" + id + "_spellsave"] = page.data["Save"]};
										if(page.data["Save Success"]) {update["repeating_spell-" + lvl + "_" + id + "_spellsavesuccess"] = page.data["Save Success"]};
										if(page.data["Higher Spell Slot Dice"]) {update["repeating_spell-" + lvl + "_" + id + "_spellhldie"] = page.data["Higher Spell Slot Dice"]};
										if(page.data["Higher Spell Slot Die"]) {update["repeating_spell-" + lvl + "_" + id + "_spellhldietype"] = page.data["Higher Spell Slot Die"]};
										if(page.data["Higher Spell Slot Bonus"]) {update["repeating_spell-" + lvl + "_" + id + "_spellhlbonus"] = page.data["Higher Spell Slot Bonus"]};
										if(page.data["Higher Spell Slot Desc"]) {update["repeating_spell-" + lvl + "_" + id + "_spellathigherlevels"] = page.data["Higher Spell Slot Desc"]};
										if(page.data["data-Cantrip Scaling"] && lvl == "cantrip") {update["repeating_spell-" + lvl + "_" + id + "_spell_damage_progression"] = "Cantrip " + page.data["data-Cantrip Scaling"].charAt(0).toUpperCase() + page.data["data-Cantrip Scaling"].slice(1);};
										if(page.data["data-description"]) { update["repeating_spell-" + lvl + "_" + id + "_spelldescription"] = page.data["data-description"]};
										update["repeating_spell-" + lvl + "_" + id + "_options-flag"] = "0";

										// custom writing:
										setAttrs(update, callbacks);
										/* eslint-enable block-spacing, no-extra-semi */
									}

									processDrop(data);

									// on final item, add macro
									if (index === addMacroIndex) {
										if (d20plus.cfg.getOrDefault("import", "tokenactionsSpells")) {
											if (d20plus.sheet === "shaped") {
												character.abilities.create({
													name: "Spells",
													istokenaction: true,
													action: `%{${character.id}|shaped_spells}`
												}).save();
											} else {
												// collect name and identifier for all the character's spells
												const macroSpells = character.attribs.toJSON()
													.filter(it => it.name.startsWith("repeating_spell-") && it.name.endsWith("spellname"))
													.map(it => ({identifier: it.name.replace(/_spellname$/, "_spell"), name: it.current}));

												// build tokenaction
												const ixToReplaceIn = tokenActionStack.length - 1;
												let toReplaceIn = tokenActionStack.last();

												macroSpells.forEach(mSp => {
													let didReplace = false;
													toReplaceIn = toReplaceIn.replace(new RegExp(`${d20plus.monsters.TAG_SPELL_OPEN}\\s*${mSp.name}\\s*${d20plus.monsters.TAG_SPELL_CLOSE}`, "gi"), () => {
														didReplace = true;
														return `[${mSp.name}](~selected|${mSp.identifier})`
													});

													if (!didReplace) {
														tokenActionStack.push(`[${mSp.name}](~selected|${mSp.identifier})`)
													}
												});

												// clean e.g.
												/*
												Cantrips:

												[...text...]
												 */
												// to
												/*
												Cantrips:
												[...text...]
												 */
												toReplaceIn = toReplaceIn.replace(/: *\n\n+/gi, ":\n");

												// clean any excess tags
												toReplaceIn = toReplaceIn
													.replace(new RegExp(d20plus.monsters.TAG_SPELL_OPEN, "gi"), "")
													.replace(new RegExp(d20plus.monsters.TAG_SPELL_CLOSE, "gi"), "");

												tokenActionStack[ixToReplaceIn] = toReplaceIn;

												character.abilities.create({
													name: "Spells",
													istokenaction: true,
													action: `/w gm @{selected|wtype}&{template:npcaction} {{name=@{selected|npc_name}}} {{rname=Spellcasting}} {{description=${tokenActionStack.join("")}}}`
												}).save();
											}
										}
									}
								}
							}
							if (data.trait) {
								$.each(data.trait, function (i, v) {
									var newRowId = d20plus.ut.generateRowId();
									character.attribs.create({
										name: "repeating_npctrait_" + newRowId + "_name",
										current: d20plus.importer.getCleanText(renderer.render(v.name))
									});

									if (d20plus.cfg.getOrDefault("import", "tokenactionsTraits")) {
										const offsetIndex = data.spellcasting ? 1 + i : i;
										character.abilities.create({
											name: "Trait" + offsetIndex + ": " + v.name,
											istokenaction: true,
											action: d20plus.actionMacroTrait(offsetIndex)
										});
									}

									var text = d20plus.importer.getCleanText(renderer.render({entries: v.entries}, 1));
									character.attribs.create({name: "repeating_npctrait_" + newRowId + "_desc", current: text});
								});
							}
							if (data.action) {
								let offset = 0;

								$.each(data.action, function (i, action) {
									const name = d20plus.importer.getCleanText(renderer.render(action.name));
									const text = d20plus.importer.getCleanText(renderer.render({entries: action.entries}, 1));

									// special cases for specific creatures
									if (data.name === "Hellfire Engine" && data.source === SRC_MTF && name === "Hellfire Weapons") {
										const baseActionEnts = action.entries.filter(it => typeof it === "string");
										baseActionEnts[0] = "The hellfire engine uses one of the options listed below.";
										const baseAction = renderer.render({entries: baseActionEnts}, 1);
										d20plus.importer.addAction(character, name, d20plus.importer.getCleanText(baseAction), i + offset);
										offset++;

										action.entries.find(it => it.type === "list").items.forEach(item => {
											const itemName = d20plus.importer.getCleanText(renderer.render(item.name));
											d20plus.importer.addAction(character, itemName, d20plus.importer.getCleanText(renderer.render({entries: [item.entry]})), i + offset);
											offset++;
										});

										offset++;
									} else if (name === "Eye Rays") {
										const [base, ...others] = action.entries;

										const baseAction = renderer.render({entries: [base]}, 1);
										d20plus.importer.addAction(character, name, d20plus.importer.getCleanText(baseAction), i + offset);
										offset++;

										const packedOthers = [];
										others.forEach(it => {
											const m = /^(\d+\.\s*[^.]+?\s*)[.:](.*)$/.exec(it);
											if (m) {
												const partName = m[1].trim();
												const text = m[2].trim();
												packedOthers.push({name: partName, text: text});
											} else packedOthers[packedOthers.length - 1].text += ` ${it}`;
										});

										packedOthers.forEach(it => {
											d20plus.importer.addAction(character, it.name, d20plus.importer.getCleanText(renderer.render(it.text)), i + offset);
											offset++;
										});
									} else {
										d20plus.importer.addAction(character, name, text, i + offset);
									}
								});
							}
							if (data.reaction) {
								character.attribs.create({name: "reaction_flag", current: 1});
								character.attribs.create({name: "npcreactionsflag", current: 1});

								if (d20plus.cfg.getOrDefault("import", "tokenactions") && d20plus.sheet === "shaped") {
									character.abilities.create({
										name: "Reactions",
										istokenaction: true,
										action: `%{${character.id}|shaped_reactions}`
									});
								}

								$.each(data.reaction, function (i, v) {
									var newRowId = d20plus.ut.generateRowId();
									let text = "";
									character.attribs.create({
										name: "repeating_npcreaction_" + newRowId + "_name",
										current: d20plus.importer.getCleanText(renderer.render(v.name))
									});

									// roll20 only supports a single reaction, so only use the first
									if (d20plus.cfg.getOrDefault("import", "tokenactions") && i === 0 && d20plus.sheet !== "shaped") {
										character.abilities.create({
											name: "Reaction: " + v.name,
											istokenaction: true,
											action: d20plus.actionMacroReaction
										});
									}

									text = d20plus.importer.getCleanText(renderer.render({entries: v.entries}, 1));
									character.attribs.create({
										name: "repeating_npcreaction_" + newRowId + "_desc",
										current: text
									});
									character.attribs.create({
										name: "repeating_npcreaction_" + newRowId + "_description",
										current: text
									});
								});
							}
							if (data.legendary) {
								character.attribs.create({name: "legendary_flag", current: "1"});
								let legendaryActions = data.legendaryActions || 3;
								character.attribs.create({name: "npc_legendary_actions", current: legendaryActions.toString()});

								if (d20plus.cfg.getOrDefault("import", "tokenactions") && d20plus.sheet === "shaped") {
									character.abilities.create({
										name: "Legendary Actions",
										istokenaction: true,
										action: `%{${character.id}|shaped_legendaryactions}`
									});
								}

								let tokenactiontext = "";
								$.each(data.legendary, function (i, v) {
									var newRowId = d20plus.ut.generateRowId();

									if (d20plus.cfg.getOrDefault("import", "tokenactions") && d20plus.sheet !== "shaped") {
										tokenactiontext += "[" + v.name + "](~selected|repeating_npcaction-l_$" + i + "_npc_action)\n\r";
									}

									var rollbase = d20plus.importer.rollbase();

									// FIXME v.attack has been removed from the data; create a parser equivalent
									if (v.attack != null) {
										if (!(v.attack instanceof Array)) {
											var tmp = v.attack;
											v.attack = [];
											v.attack.push(tmp);
										}
										$.each(v.attack, function (z, x) {
											if (!x) return;
											var attack = x.split("|");
											var name = "";
											if (v.attack.length > 1)
												name = (attack[0] == v.name) ? v.name : v.name + " - " + attack[0] + "";
											else
												name = v.name;
											var onhit = "";
											var damagetype = "";
											if (attack.length == 2) {
												damage = "" + attack[1];
												tohit = "";
											} else {
												damage = "" + attack[2];
												tohit = attack[1] || 0;
											}
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_name",
												current: d20plus.importer.getCleanText(renderer.render(name))
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_flag",
												current: "on"
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_npc_options-flag",
												current: 0
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_display_flag",
												current: "{{attack=1}}"
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_options",
												current: "{{attack=1}}"
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_tohit",
												current: tohit
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_damage",
												current: damage
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_name_display",
												current: name
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_rollbase",
												current: rollbase
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_type",
												current: ""
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_tohitrange",
												current: ""
											});
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_damage_flag",
												current: "{{damage=1}} {{dmg1flag=1}} {{dmg2flag=1}}"
											});
											if (damage !== "") {
												damage1 = damage.replace(/\s/g, "").split(/d|(?=\+|-)/g);
												if (damage1[1])
													damage1[1] = damage1[1].replace(/[^0-9-+]/g, "");
												damage2 = isNaN(eval(damage1[1])) === false ? eval(damage1[1]) : 0;
												if (damage1.length < 2) {
													onhit = onhit + damage1[0] + " (" + damage + ")" + damagetype + " damage";
												} else if (damage1.length < 3) {
													onhit = onhit + Math.floor(damage1[0] * ((damage2 / 2) + 0.5)) + " (" + damage + ")" + damagetype + " damage";
												} else {
													onhit = onhit + (Math.floor(damage1[0] * ((damage2 / 2) + 0.5)) + parseInt(damage1[2], 10)) + " (" + damage + ")" + damagetype + " damage";
												}
											}
											character.attribs.create({
												name: "repeating_npcaction-l_" + newRowId + "_attack_onhit",
												current: onhit
											});
										});
									} else {
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_name",
											current: v.name
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_npc_options-flag",
											current: 0
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_rollbase",
											current: rollbase
										});
										character.attribs.create({
											name: "repeating_npcaction-l_" + newRowId + "_name_display",
											current: v.name
										});
									}

									var text = d20plus.importer.getCleanText(renderer.render({entries: v.entries}, 1));
									var descriptionFlag = Math.max(Math.ceil(text.length / 57), 1);
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_description",
										current: text
									});
									character.attribs.create({
										name: "repeating_npcaction-l_" + newRowId + "_description_flag",
										current: descriptionFlag
									});
								});

								if (d20plus.cfg.getOrDefault("import", "tokenactions") && d20plus.sheet !== "shaped") {
									character.abilities.create({
										name: "Legendary Actions",
										istokenaction: true,
										action: d20plus.actionMacroLegendary(tokenactiontext)
									});
								}
							}

							// set show/hide NPC names in rolls
							if (d20plus.cfg.has("import", "showNpcNames") && !d20plus.cfg.get("import", "showNpcNames")) {
								character.attribs.create({name: "npc_name_flag", current: 0});
							}

							if (d20plus.cfg.getOrDefault("import", "tokenactions") && d20plus.sheet === "shaped") {
								character.abilities.create({
									name: "Actions",
									istokenaction: true,
									action: `%{${character.id}|shaped_actions}`
								});

								// TODO lair action creation is unimplemented
								/*
								character.abilities.create({
									name: "Lair Actions",
									istokenaction: true,
									action: `%{${character.id}|shaped_lairactions}`
								});
								*/
							}

							character.view._updateSheetValues();

							if (renderFluff) {
								setTimeout(() => {
									const fluffAs = d20plus.cfg.get("import", "importFluffAs") || d20plus.cfg.getDefault("import", "importFluffAs");
									let k = fluffAs === "Bio"? "bio" : "gmnotes";
									character.updateBlobs({
										[k]: Markdown.parse(renderFluff)
									});
									character.save({
										[k]: (new Date).getTime()
									});
								}, 500);
							}
						} catch (e) {
							d20plus.ut.log("Error loading [" + name + "]");
							d20plus.addImportError(name);
							console.log(data);
							console.log(e);
						}
						/* end OGL Sheet */
						d20.journal.addItemToFolderStructure(character.id, folder.id);

						if (options.charFunction) {
							options.charFunction(character);
						}
					}
				});
		};

		// pre-load fluff
		const src = data.source;
		if (src && monsterFluffDataUrls[src]) {
			const fluffUrl = d20plus.monsters.formMonsterUrl(monsterFluffDataUrls[src]);
			DataUtil.loadJSON(fluffUrl).then((data) => {
				monsterFluffData[src] = data;
			}).catch(e => {
				console.error(e);
				monsterFluffData[src] = {monster: []};
			}).then(doBuild);
		} else {
			doBuild();
		}
	};
}

SCRIPT_EXTENSIONS.push(d20plusMonsters);


function d20plusSpells () {
	d20plus.spells = {};

	d20plus.spells.formSpellUrl = function (fileName) {
		return d20plus.formSrcUrl(SPELL_DATA_DIR, fileName);
	};

	d20plus.spells._groupOptions = ["Level", "Spell Points", "Alphabetical", "Source"];
	d20plus.spells._listCols = ["name", "class", "level", "source"];
	d20plus.spells._listItemBuilder = (it) => `
		<span class="name col-4" title="name">${it.name}</span>
		<span class="class col-3" title="class">${((it.classes || {}).fromClassList || []).map(c => `CLS[${c.name}]`).join(", ")}</span>
		<span class="level col-3" title="level">LVL[${Parser.spLevelToFull(it.level)}]</span>
		<span title="source [Full source name is ${Parser.sourceJsonToFull(it.source)}]" class="source col-2">SRC[${Parser.sourceJsonToAbv(it.source)}]</span>`;
	d20plus.spells._listIndexConverter = (sp) => {
		return {
			name: sp.name.toLowerCase(),
			class: ((sp.classes || {}).fromClassList || []).map(c => c.name.toLowerCase()),
			level: Parser.spLevelToFull(sp.level).toLowerCase(),
			source: Parser.sourceJsonToAbv(sp.source).toLowerCase()
		};
	};

	// Import Spells button was clicked
	d20plus.spells.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-spell-url-player").val() : $("#import-spell-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.spells.playerImportBuilder : d20plus.spells.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				if (data.roll20Spell) spellMetaData.spell = spellMetaData.spell.concat(data.roll20Spell);
				d20plus.importer.showImportList(
					"spell",
					data.spell,
					handoutBuilder,
					{
						groupOptions: d20plus.spells._groupOptions,
						forcePlayer,
						listItemBuilder: d20plus.spells._listItemBuilder,
						listIndex: d20plus.spells._listCols,
						listIndexConverter: d20plus.spells._listIndexConverter
					}
				);
			});
		}
	};

	// Import All Spells button was clicked
	d20plus.spells.buttonAll = async function (forcePlayer) {
		const toLoad = Object.keys(spellDataUrls).filter(src => !SourceUtil.isNonstandardSource(src)).map(src => d20plus.spells.formSpellUrl(spellDataUrls[src]));

		if (toLoad.length) {
			const handoutBuilder = !forcePlayer && window.is_gm ? d20plus.spells.handoutBuilder : d20plus.spells.playerImportBuilder;

			const dataStack = (await Promise.all(toLoad.map(async url => DataUtil.loadJSON(url)))).flat();

			let toAdd = [];
			dataStack.forEach(d => {
				toAdd = toAdd.concat(d.spell);
				if (d.roll20Spell) spellMetaData.spell = spellMetaData.spell.concat(d.roll20Spell);
			});
			d20plus.importer.showImportList(
				"spell",
				toAdd,
				handoutBuilder,
				{
					groupOptions: d20plus.spells._groupOptions,
					forcePlayer,
					listItemBuilder: d20plus.spells._listItemBuilder,
					listIndex: d20plus.spells._listCols,
					listIndexConverter: d20plus.spells._listIndexConverter
				}
			);
		}
	};

	// Create spell handout from js data object
	d20plus.spells.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Spells`, folderName);
		const path = ["Spells", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		// build spell handout
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.spSchoolAbvToFull(data.school),
				Parser.spLevelToFull(data.level),
				...(((data.classes || {}).fromClassList || []).map(c => c.name)),
				Parser.sourceJsonToFull(data.source)
			], "spell")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_SPELLS](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [notecontents, gmnotes] = d20plus.spells._getHandoutData(data, options);

				console.log(notecontents);
				handout.updateBlobs({notes: notecontents, gmnotes: gmnotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.spells.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.spells._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.spells._getHandoutData = function (data, builderOptions) {
		builderOptions = builderOptions || {};
		// merge in roll20 metadata, if available
		const spellMeta = spellMetaData.spell.find(sp => sp.name.toLowerCase() === data.name.toLowerCase() && sp.source.toLowerCase() === data.source.toLowerCase());
		if (spellMeta) {
			data.roll20 = spellMeta.data;
		}

		if (!data.school) data.school = "A";
		if (!data.range) data.range = "Self";
		if (!data.duration) data.duration = "Instantaneous";
		if (!data.components) data.components = "";
		if (!data.time) data.components = "1 action";

		const r20Data = {};
		if (data.roll20) Object.assign(r20Data, data.roll20);
		Object.assign(
			r20Data,
			{
				"Level": builderOptions.isSpellPoints ? String(Math.min(9, d20plus.spells.spLevelToSpellPoints(data.level))) : String(data.level),
				"Range": Parser.spRangeToFull(data.range),
				"School": Parser.spSchoolAbvToFull(data.school),
				"Source": "5etoolsR20",
				"Classes": d20plus.importer.getCleanText(Parser.spClassesToFull(data.classes)),
				"Category": "Spells",
				"Duration": Parser.spDurationToFull(data.duration).replace(/Concentration,\s*/gi, ""), // prevent double concentration text
				"Material": "",
				"Components": d20plus.spells._parseComponents(data.components),
				"Casting Time": Parser.spTimeListToFull(data.time)
			}
		);

		if (data.range.type === "point" && (data.range.distance.type === UNT_FEET || data.range.distance.type === UNT_MILES)) {
			r20Data["data-RangeNum"] = data.range.distance.amount + "";
		}

		var r20json = {
			name: data.name,
			content: "",
			htmlcontent: "",
			data: r20Data
		};
		if (data.components && data.components.m) {
			if (data.components.m.text) r20json.data["Material"] = data.components.m.text;
			else if (typeof data.components.m === "string") r20json.data["Material"] = data.components.m;
		}
		if (data.meta) {
			if (data.meta.ritual) r20json.data["Ritual"] = "Yes";
		}
		if (data.duration.filter(d => d.concentration).length > 0) {
			r20json.data["Concentration"] = "Yes";
		}
		var notecontents = "";
		var gmnotes = "";
		notecontents += `<p><h3>${data.name}</h3>
<em>${Parser.spLevelSchoolMetaToFull(data.level, data.school, data.meta)}${builderOptions.isSpellPoints && data.level ? ` (${d20plus.spells.spLevelToSpellPoints(data.level)} spell points)` : ""}</em></p><p>
<strong>Casting Time:</strong> ${Parser.spTimeListToFull(data.time)}<br>
<strong>Range:</strong> ${Parser.spRangeToFull(data.range)}<br>
<strong>Components:</strong> ${Parser.spComponentsToFull(data.components, data.level)}<br>
<strong>Duration:</strong> ${Parser.spDurationToFull(data.duration)}<br>
</p>`;
		const renderer = new Renderer();
		const renderStack = [];
		const entryList = {type: "entries", entries: data.entries};
		renderer.setBaseUrl(BASE_SITE_URL);
		renderer.recursiveRender(entryList, renderStack, {depth: 1});
		r20json.content = d20plus.importer.getCleanText(renderStack.join(" "));
		r20json.data["data-description"] = r20json.content;
		notecontents += renderStack.join("");
		if (data.entriesHigherLevel) {
			const hLevelRenderStack = [];
			const higherLevelsEntryList = {type: "entries", entries: data.entriesHigherLevel};
			renderer.recursiveRender(higherLevelsEntryList, hLevelRenderStack, {depth: 2});
			const higherLevels = d20plus.importer.getCleanText(hLevelRenderStack.join(" ").replace("At Higher Levels.", ""));
			r20json.content += "\n\n\"At Higher Levels: " + higherLevels;
			r20json.htmlcontent += "<br><br>\"At Higher Levels: " + higherLevels;
			notecontents += hLevelRenderStack.join("");
			r20Data["Higher Spell Slot Desc"] = higherLevels;
		}
		notecontents += `<p><strong>Classes:</strong> ${Parser.spClassesToFull(data.classes)}</p>`;
		gmnotes = JSON.stringify(r20json);
		notecontents += `<del class="hidden">${gmnotes}</del>`;

		return [notecontents, gmnotes];
	};

	// parse spell components
	d20plus.spells._parseComponents = function (components) {
		const out = [];
		if (components && components.v) out.push("V");
		if (components && components.s) out.push("S");
		if (components && components.m) out.push("M");
		return out.join(" ");
	};

	d20plus.spells.spLevelToSpellPoints = function (level) {
		switch (level) {
			case 1: return 2;
			case 2: return 3;
			case 3: return 5;
			case 4: return 6;
			case 5: return 7;
			case 6: return 8;
			case 7: return 10;
			case 8: return 11;
			case 9: return 13;
			case 0:
			default: return 0;
		}
	};
}

SCRIPT_EXTENSIONS.push(d20plusSpells);


function d20plusBackgrounds () {
	d20plus.backgrounds = {};

	d20plus.backgrounds.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-backgrounds-url-player").val() : $("#import-backgrounds-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.backgrounds.playerImportBuilder : d20plus.backgrounds.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"background",
					data.background,
					handoutBuilder,
					{
						forcePlayer
					}
				);
			});
		}
	};

	d20plus.backgrounds.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Backgrounds`, folderName);
		const path = ["Backgrounds", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.sourceJsonToFull(data.source)
			], "background")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_BACKGROUNDS](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [noteContents, gmNotes] = d20plus.backgrounds._getHandoutData(data);

				handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.backgrounds.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.backgrounds._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.backgrounds._getHandoutData = function (data) {
		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);

		const renderStack = [];

		renderer.recursiveRender({entries: data.entries}, renderStack, {depth: 1});

		const rendered = renderStack.join("");

		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Backgrounds"
			}
		};
		const gmNotes = JSON.stringify(r20json);
		const noteContents = `${rendered}\n\n<del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};
}

SCRIPT_EXTENSIONS.push(d20plusBackgrounds);


function d20plusClass () {
	d20plus.classes = {};
	d20plus.subclasses = {};

	// Import Classes button was clicked
	d20plus.classes.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-classes-url-player").val() : $("#import-classes-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.classes.playerImportBuilder : d20plus.classes.handoutBuilder;

			const officialClassUrls = Object.values(classDataUrls).map(v => d20plus.formSrcUrl(CLASS_DATA_DIR, v));

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);
				d20plus.importer.showImportList(
					"class",
					data.class,
					handoutBuilder,
					{
						forcePlayer,
						builderOptions: {
							isHomebrew: !officialClassUrls.includes(url)
						}
					}
				);
			});
		}
	};

	// Import All Classes button was clicked
	d20plus.classes.buttonAll = function (forcePlayer) {
		const handoutBuilder = !forcePlayer && window.is_gm ? d20plus.classes.handoutBuilder : d20plus.classes.playerImportBuilder;

		DataUtil.class.loadJSON(BASE_SITE_URL).then((data) => {
			d20plus.importer.showImportList(
				"class",
				data.class,
				handoutBuilder,
				{
					forcePlayer,
					builderOptions: {
						isHomebrew: false
					}
				}
			);
		});
	};

	d20plus.classes.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		options = options || {};

		// make dir
		const folder = d20plus.journal.makeDirTree(`Classes`, folderName);
		const path = ["Classes", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				Parser.sourceJsonToFull(data.source)
			], "class")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [noteContents, gmNotes] = d20plus.classes._getHandoutData(data);

				handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
				handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});

		d20plus.classes._handleSubclasses(data, overwrite, inJournals, folderName, false, options);
	};

	d20plus.classes._handleSubclasses = async function (data, overwrite, inJournals, outerFolderName, forcePlayer, options) {
		async function chooseSubclassImportStrategy (isUnofficialBaseClass) {
			return new Promise((resolve, reject) => {
				const $dialog = $(`
						<div title="Subclass Import">
							<label class="flex">
								<span>Import ${data.name} ${data.source ? `(${Parser.sourceJsonToAbv(data.source)}) ` : ""}subclasses?</span>
								 <select title="Note: this does not include homebrew. For homebrew subclasses, use the dedicated subclass importer." style="width: 250px;">
								 	${isUnofficialBaseClass ? "" : `<option value="1">Official/Published (excludes UA/etc)</option>`}
								 	<option value="2">All</option>
								 	<option value="3">None</option>
 								</select>
							</label>
						</div>
					`).appendTo($("body"));
				const $selStrat = $dialog.find(`select`);

				$dialog.dialog({
					dialogClass: "no-close",
					buttons: [
						{
							text: "Cancel",
							click: function () {
								$(this).dialog("close");
								$dialog.remove();
								reject(`User cancelled the prompt`);
							}
						},
						{
							text: "OK",
							click: function () {
								const selected = Number($selStrat.val());
								$(this).dialog("close");
								$dialog.remove();
								if (isNaN(selected)) reject(`Value was not a number!`);
								resolve(selected);
							}
						}
					]
				})
			});
		}

		const playerMode = forcePlayer || !window.is_gm;
		// import subclasses
		if (data.subclasses) {
			const importStrategy = await chooseSubclassImportStrategy(options.isHomebrew || (data.source && SourceUtil.isNonstandardSource(data.source)));
			if (importStrategy === 3) return;

			const gainFeatureArray = d20plus.classes._getGainAtLevelArr(data);

			data.subclasses.forEach(sc => {
				if (importStrategy === 1 && SourceUtil.isNonstandardSource(sc.source)) return;

				sc.class = data.name;
				sc.classSource = sc.classSource || data.source;
				sc._gainAtLevels = gainFeatureArray;
				if (playerMode) {
					d20plus.subclasses.playerImportBuilder(sc, data);
				} else {
					const folderName = d20plus.importer._getHandoutPath("subclass", sc, "Class");
					const path = [folderName];
					if (outerFolderName) path.push(sc.source || data.source); // if it wasn't None, group by source
					d20plus.subclasses.handoutBuilder(sc, overwrite, inJournals, path, {}, {}, data);
				}
			});
		}
	};

	d20plus.classes._getGainAtLevelArr = function (clazz) {
		const gainFeatureArray = [];
		outer: for (let i = 0; i < 20; i++) {
			const lvlFeatureList = clazz.classFeatures[i];
			for (let j = 0; j < lvlFeatureList.length; j++) {
				const feature = lvlFeatureList[j];
				if (feature.gainSubclassFeature) {
					gainFeatureArray.push(true);
					continue outer;
				}
			}
			gainFeatureArray.push(false);
		}
		return gainFeatureArray;
	};

	d20plus.classes.playerImportBuilder = function (data, _1, _2, _3, _4, options) {
		options = options || {};

		const [notecontents, gmnotes] = d20plus.classes._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);

		d20plus.classes._handleSubclasses(data, false, false, null, true, options);
	};

	d20plus.classes._getHandoutData = function (data) {
		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);

		const renderStack = [];
		// make a copy of the data to modify
		const curClass = JSON.parse(JSON.stringify(data));
		// render the class text
		for (let i = 0; i < 20; i++) {
			const lvlFeatureList = curClass.classFeatures[i];
			for (let j = 0; j < lvlFeatureList.length; j++) {
				const feature = lvlFeatureList[j];
				renderer.recursiveRender(feature, renderStack);
			}
		}
		const rendered = renderStack.join("");

		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Classes"
			}
		};
		const gmNotes = JSON.stringify(r20json);
		const noteContents = `${rendered}\n\n<del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	d20plus.subclasses._groupOptions = ["Class", "Alphabetical", "Source"];
	d20plus.subclasses._listCols = ["name", "class", "source"];
	d20plus.subclasses._listItemBuilder = (it) => `
		<span class="name col-6">${it.name}</span>
		<span class="class col-4">CLS[${it.class}]</span>
		<span title="${Parser.sourceJsonToFull(it.source)}" class="source col-2">SRC[${Parser.sourceJsonToAbv(it.source)}]</span>`;
	d20plus.subclasses._listIndexConverter = (sc) => {
		return {
			name: sc.name.toLowerCase(),
			class: sc.class.toLowerCase(),
			source: Parser.sourceJsonToAbv(sc.source).toLowerCase()
		};
	};
	// Import Subclasses button was clicked
	d20plus.subclasses.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-subclasses-url-player").val() : $("#import-subclasses-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.subclasses.playerImportBuilder : d20plus.subclasses.handoutBuilder;

			DataUtil.loadJSON(url).then((data) => {
				d20plus.importer.addMeta(data._meta);

				// merge in any subclasses contained in class data
				const allData = MiscUtil.copy(data.subclass || []);
				(data.class || []).map(c => {
					if (c.subclasses) {
						// make a copy without subclasses to prevent circular references
						const cpy = MiscUtil.copy(c);
						delete cpy.subclasses;
						c.subclasses.forEach(sc => {
							sc.class = c.name;
							sc.source = sc.source || c.source;
							sc._baseClass = cpy;
						});
						return c.subclasses;
					} else return false;
				}).filter(Boolean).forEach(sc => allData.push(sc));

				d20plus.importer.showImportList(
					"subclass",
					allData.flat(),
					handoutBuilder,
					{
						groupOptions: d20plus.subclasses._groupOptions,
						forcePlayer,
						listItemBuilder: d20plus.subclasses._listItemBuilder,
						listIndex: d20plus.subclasses._listCols,
						listIndexConverter: d20plus.subclasses._listIndexConverter
					}
				);
			});
		}
	};

	/**
	 * @param subclass
	 * @param baseClass Will be defined if importing as part of a class, undefined otherwise.
	 */
	d20plus.subclasses._preloadClass = function (subclass, baseClass) {
		if (!subclass.class) Promise.resolve();

		if (baseClass) {
			subclass._gainAtLevels = d20plus.classes._getGainAtLevelArr(baseClass);
			return Promise.resolve();
		} else if(subclass._baseClass) {
			subclass._gainAtLevels = d20plus.classes._getGainAtLevelArr(subclass._baseClass);
			return Promise.resolve();
		} else {
			d20plus.ut.log("Preloading class...");
			return DataUtil.class.loadJSON(BASE_SITE_URL).then((data) => {
				const clazz = data.class.find(it => it.name.toLowerCase() === subclass.class.toLowerCase() && it.source.toLowerCase() === (subclass.classSource || SRC_PHB).toLowerCase());
				if (!clazz) {
					throw new Error(`Could not find class for subclass ${subclass.name}::${subclass.source} with class ${subclass.class}::${subclass.classSource || SRC_PHB}`);
				}

				subclass._gainAtLevels = d20plus.classes._getGainAtLevelArr(clazz);
			});
		}
	};

	/**
	 * @param data
	 * @param overwrite
	 * @param inJournals
	 * @param folderName
	 * @param saveIdsTo
	 * @param options
	 * @param baseClass Will be defined if importing as part of a class, undefined otherwise.
	 */
	d20plus.subclasses.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options, baseClass) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Subclasses`, folderName);
		const path = ["Sublasses", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		d20plus.subclasses._preloadClass(data, baseClass).then(() => {
			const name = `${data.shortName} (${data.class})`;
			d20.Campaign.handouts.create({
				name: name,
				tags: d20plus.importer.getTagString([
					data.class,
					Parser.sourceJsonToFull(data.source)
				], "subclass")
			}, {
				success: function (handout) {
					if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_CLASSES](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

					const [noteContents, gmNotes] = d20plus.subclasses._getHandoutData(data);

					handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
					handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
					d20.journal.addItemToFolderStructure(handout.id, folder.id);
				}
			});
		});
	};

	/**
	 * @param data
	 * @param baseClass Will be defined if importing as part of a class, undefined otherwise.
	 */
	d20plus.subclasses.playerImportBuilder = function (data, baseClass) {
		d20plus.subclasses._preloadClass(data, baseClass).then(() => {
			const [notecontents, gmnotes] = d20plus.subclasses._getHandoutData(data);

			const importId = d20plus.ut.generateRowId();
			d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
			const name = `${data.class ? `${data.class} \u2014 ` : ""}${data.name}`;
			d20plus.importer.makePlayerDraggable(importId, name);
		});
	};

	d20plus.subclasses._getHandoutData = function (data) {
		const renderer = new Renderer();
		renderer.setBaseUrl(BASE_SITE_URL);

		const renderStack = [];

		data.subclassFeatures.forEach(lvl => {
			lvl.forEach(f => {
				renderer.recursiveRender(f, renderStack);
			});
		});

		const rendered = renderStack.join("");

		const r20json = {
			"name": data.name,
			"Vetoolscontent": data,
			"data": {
				"Category": "Subclasses"
			}
		};
		const gmNotes = JSON.stringify(r20json);
		const noteContents = `${rendered}\n\n<del class="hidden">${gmNotes}</del>`;

		return [noteContents, gmNotes];
	};

}

SCRIPT_EXTENSIONS.push(d20plusClass);


function d20plusItems () {
	d20plus.items = {};

	d20plus.items._groupOptions = ["Type", "Rarity", "Alphabetical", "Source"];
	d20plus.items._listCols = ["name", "type", "rarity", "source"];
	d20plus.items._listItemBuilder = (it) => {
		if (!it._isEnhanced) Renderer.item.enhanceItem(it);

		return `
		<span class="name col-3" title="name">${it.name}</span>
		<span class="type col-5" title="type">${it._typeListText.map(t => `TYP[${t.trim()}]`).join(", ")}</span>
		<span class="rarity col-2" title="rarity">RAR[${it.rarity}]</span>
		<span title="source [Full source name is ${Parser.sourceJsonToFull(it.source)}]" class="source col-2">SRC[${Parser.sourceJsonToAbv(it.source)}]</span>`;
	};
	d20plus.items._listIndexConverter = (it) => {
		if (!it._isEnhanced) Renderer.item.enhanceItem(it);
		return {
			name: it.name.toLowerCase(),
			type: it._typeListText.map(t => t.toLowerCase()),
			rarity: it.rarity.toLowerCase(),
			source: Parser.sourceJsonToAbv(it.source).toLowerCase()
		};
	};
	// Import Items button was clicked
	d20plus.items.button = function (forcePlayer) {
		const playerMode = forcePlayer || !window.is_gm;
		const url = playerMode ? $("#import-items-url-player").val() : $("#import-items-url").val();
		if (url && url.trim()) {
			const handoutBuilder = playerMode ? d20plus.items.playerImportBuilder : d20plus.items.handoutBuilder;

			if (url.trim() === `${DATA_URL}items.json`) {
				Renderer.item.pBuildList(
					{
						fnCallback: itemList => {
							const packNames = new Set([`burglar's pack`, `diplomat's pack`, `dungeoneer's pack`, `entertainer's pack`, `explorer's pack`, `priest's pack`, `scholar's pack`, `monster hunter's pack`]);

							const packs = itemList.filter(it => packNames.has(it.name.toLowerCase()));
							packs.forEach(p => {
								if (!p._r20SubItemData) {
									const contents = p.entries.find(it => it.type === "list").items;

									const out = [];
									contents.forEach(line => {
										if (line.includes("@item")) {
											const [pre, tag, item] = line.split(/({@item)/g);
											const tagItem = `${tag}${item}`;

											let [n, src] = item.split("}")[0].trim().split("|");
											if (!src) src = "dmg";

											n = n.toLowerCase();
											src = src.toLowerCase();


											const subItem = itemList.find(it => n === it.name.toLowerCase() && src === it.source.toLowerCase());

											let count = 1;
											pre.replace(/\d+/g, (m) => count = Number(m));

											out.push({
												type: "item",
												count,
												data: subItem
											})
										} else {
											out.push({
												type: "misc",
												data: {
													name: line.toTitleCase(),
													data: {
														Category: "Items",
														"Item Type": "Adventuring Gear"
													}
												}
											})
										}
									});

									p._r20SubItemData = out;
								}
							});

							d20plus.importer.showImportList(
								"item",
								itemList,
								handoutBuilder,
								{
									groupOptions: d20plus.items._groupOptions,
									forcePlayer,
									listItemBuilder: d20plus.items._listItemBuilder,
									listIndex: d20plus.items._listCols,
									listIndexConverter: d20plus.items._listIndexConverter
								}
							);
						},
						urls: {
							items: `${DATA_URL}items.json`,
							baseitems: `${DATA_URL}items-base.json`,
							magicvariants: `${DATA_URL}magicvariants.json`
						},
						isAddGroups: true,
					});
			} else {
				// for non-standard URLs, do a generic import
				DataUtil.loadJSON(url).then((data) => {
					(data.itemProperty || []).forEach(p => Renderer.item._addProperty(p));
					(data.itemType || []).forEach(t => Renderer.item._addType(t));
					d20plus.importer.addMeta(data._meta);
					d20plus.importer.showImportList(
						"item",
						data.item,
						handoutBuilder,
						{
							groupOptions: d20plus.items._groupOptions,
							forcePlayer,
							listItemBuilder: d20plus.items._listItemBuilder,
							listIndex: d20plus.items._listCols,
							listIndexConverter: d20plus.items._listIndexConverter
						}
					);
				});
			}
		}
	};

	// Import individual items
	d20plus.items.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
		// make dir
		const folder = d20plus.journal.makeDirTree(`Items`, folderName);
		const path = ["Items", ...folderName, data.name];

		// handle duplicates/overwrites
		if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

		const name = data.name;

		if (!data._isEnhanced) Renderer.item.enhanceItem(data); // for homebrew items

		// build item handout
		d20.Campaign.handouts.create({
			name: name,
			tags: d20plus.importer.getTagString([
				`rarity ${data.rarity}`,
				...data._typeListText,
				Parser.sourceJsonToFull(data.source)
			], "item")
		}, {
			success: function (handout) {
				if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_ITEMS](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

				const [notecontents, gmnotes] = d20plus.items._getHandoutData(data);

				handout.updateBlobs({notes: notecontents, gmnotes: gmnotes});
				handout.save({
					notes: (new Date).getTime(),
					inplayerjournals: inJournals
				});
				d20.journal.addItemToFolderStructure(handout.id, folder.id);
			}
		});
	};

	d20plus.items.playerImportBuilder = function (data) {
		const [notecontents, gmnotes] = d20plus.items._getHandoutData(data);

		const importId = d20plus.ut.generateRowId();
		d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
		d20plus.importer.makePlayerDraggable(importId, data.name);
	};

	d20plus.items._getHandoutData = function (data) {
		function removeDiceTags (str) {
			return str ? Renderer.stripTags(str) : str;
		}

		var notecontents = "";
		const roll20Data = {
			name: data.name,
			data: {
				Category: "Items"
			}
		};

		const [damage, damageType, propertiesTxt] = Renderer.item.getDamageAndPropertiesText(data);
		const typeRarityAttunement = Renderer.item.getTypeRarityAndAttunementText(data);

		var type = data.type;
		if (data.type) {
			roll20Data.data["Item Type"] = d20plus.items.parseType(data.type);
		} else if (data._typeListText) {
			roll20Data.data["Item Type"] = data._typeListText.join(", ");
		}

		const cleanDmg1 = removeDiceTags(data.dmg1);
		const cleanDmg2 = removeDiceTags(data.dmg2);

		var armorclass = "";
		if (type === "S") armorclass = "+" + data.ac;
		if (type === "LA") armorclass = data.ac + " + Dex";
		if (type === "MA") armorclass = data.ac + " + Dex (max 2)";
		if (type === "HA") armorclass = data.ac;
		var properties = "";
		if (data.property) {
			var propertieslist = data.property;
			for (var i = 0; i < propertieslist.length; i++) {
				var a = d20plus.items.parseProperty(propertieslist[i]);
				var b = propertieslist[i];
				if (b === "V") {
					a = a + " (" + cleanDmg2 + ")";
					roll20Data.data._versatile = cleanDmg2;
				}
				if (b === "T" || b === "A") a = a + " (" + data.range + "ft.)";
				if (b === "RLD") a = a + " (" + data.reload + " shots)";
				if (i > 0) a = ", " + a;
				properties += a;
			}
		}
		notecontents += `<p><h3>${data.name}</h3></p>
		<p><em>${typeRarityAttunement}</em></p>
		<p><strong>Value/Weight:</strong> ${[Parser.itemValueToFull(data), Parser.itemWeightToFull(data)].filter(Boolean).join(", ")}</p>
		<p><strong>Details: </strong>${[damage, damageType, propertiesTxt].filter(Boolean).join(" ")}</p>
		`;

		if (propertiesTxt) roll20Data.data.Properties = properties;
		if (armorclass) roll20Data.data.AC = String(data.ac);
		if (data.weight) roll20Data.data.Weight = String(data.weight);

		const textString = Renderer.item.getRenderedEntries(data);
		if (textString) {
			notecontents += `<hr>`;
			notecontents += textString;

			roll20Data.content = d20plus.importer.getCleanText(textString);
			roll20Data.htmlcontent = roll20Data.content;
		}

		if (data.range) {
			roll20Data.data.Range = data.range;
		}
		if (data.dmg1 && data.dmgType) {
			roll20Data.data.Damage = cleanDmg1;
			roll20Data.data["Damage Type"] = Parser.dmgTypeToFull(data.dmgType);
		}
		if (data.stealth) {
			roll20Data.data.Stealth = "Disadvantage";
		}
		// roll20Data.data.Duration = "1 Minute"; // used by e.g. poison; not show in sheet
		// roll20Data.data.Save = "Constitution"; // used by e.g. poison, ball bearings; not shown in sheet
		// roll20Data.data.Target = "Each creature in a 10-foot square centered on a point within range"; // used by e.g. ball bearings; not shown in sheet
		// roll20Data.data["Item Rarity"] = "Wondrous"; // used by Iron Bands of Binding... and nothing else?; not shown in sheet
		if (data.reqAttune === true) {
			roll20Data.data["Requires Attunement"] = "Yes";
		} else {
			roll20Data.data["Requires Attunement"] = "No";
		}

		// load modifiers (e.g. "+1 Armor"); this is a comma-separated string
		const itemMeta = (itemMetadata.item || []).find(it => it.name === data.name && it.source === data.source);
		if (itemMeta) roll20Data.data.Modifiers = itemMeta.Modifiers;

		if (data._r20SubItemData) {
			roll20Data._subItems = data._r20SubItemData.map(subItem => {
				if (subItem.type === "item") {
					const [subNote, subGm] = d20plus.items._getHandoutData(subItem.data);
					return {subItem: subGm, count: subItem.count};
				} else {
					return {subItem: subItem.data};
				}
			});
		}

		const gmnotes = JSON.stringify(roll20Data);

		return [notecontents, gmnotes];
	};

	d20plus.items.parseType = function (type) {
		const result = Parser.itemTypeToFull(type);
		return result ? result : "n/a";
	};

	d20plus.items.parseDamageType = function (damagetype) {
		const result = Parser.dmgTypeToFull(damagetype);
		return result ? result : false;
	};

	d20plus.items.parseProperty = function (property) {
		if (Renderer.item.propertyMap[property]) return Renderer.item.propertyMap[property].name;
		return "n/a";
	};
}

SCRIPT_EXTENSIONS.push(d20plusItems);


function d20plusFeats () {
    d20plus.feats = {};

    // Import Feats button was clicked
    d20plus.feats.button = function (forcePlayer) {
        const playerMode = forcePlayer || !window.is_gm;
        const url = playerMode ? $("#import-feats-url-player").val() : $("#import-feats-url").val();
        if (url && url.trim()) {
            const handoutBuilder = playerMode ? d20plus.feats.playerImportBuilder : d20plus.feats.handoutBuilder;

            DataUtil.loadJSON(url).then((data) => {
                d20plus.importer.addMeta(data._meta);
                d20plus.importer.showImportList(
                    "feat",
                    data.feat,
                    handoutBuilder,
                    {
                        forcePlayer
                    }
                );
            });
        }
    };

    d20plus.feats.handoutBuilder = function (data, overwrite, inJournals, folderName, saveIdsTo, options) {
        // make dir
        const folder = d20plus.journal.makeDirTree(`Feats`, folderName);
        const path = ["Feats", ...folderName, data.name];

        // handle duplicates/overwrites
        if (!d20plus.importer._checkHandleDuplicate(path, overwrite)) return;

        const name = data.name;
        d20.Campaign.handouts.create({
            name: name,
            tags: d20plus.importer.getTagString([
                Parser.sourceJsonToFull(data.source)
            ], "feat")
        }, {
            success: function (handout) {
                if (saveIdsTo) saveIdsTo[UrlUtil.URL_TO_HASH_BUILDER[UrlUtil.PG_FEATS](data)] = {name: data.name, source: data.source, type: "handout", roll20Id: handout.id};

                const [noteContents, gmNotes] = d20plus.feats._getHandoutData(data);

                handout.updateBlobs({notes: noteContents, gmnotes: gmNotes});
                handout.save({notes: (new Date).getTime(), inplayerjournals: inJournals});
                d20.journal.addItemToFolderStructure(handout.id, folder.id);
            }
        });
    };

    d20plus.feats.playerImportBuilder = function (data) {
        const [notecontents, gmnotes] = d20plus.feats._getHandoutData(data);

        const importId = d20plus.ut.generateRowId();
        d20plus.importer.storePlayerImport(importId, JSON.parse(gmnotes));
        d20plus.importer.makePlayerDraggable(importId, data.name);
    };

    d20plus.feats._getHandoutData = function (data) {
        const renderer = new Renderer();
        renderer.setBaseUrl(BASE_SITE_URL);
        const prerequisite = Renderer.utils.getPrerequisiteText(data.prerequisite);
        Renderer.feat.mergeAbilityIncrease(data);

        const renderStack = [];
        renderer.recursiveRender({entries: data.entries}, renderStack, {depth: 2});
        const rendered = renderStack.join("");

        const r20json = {
            "name": data.name,
            "content": `${prerequisite ? `**Prerequisite**: ${prerequisite}\n\n` : ""}${$(rendered).text()}`,
            "Vetoolscontent": d20plus.importer.getCleanText(rendered),
            "htmlcontent": "",
            "data": {
                "Category": "Feats"
            }
        };
        const gmNotes = JSON.stringify(r20json);

        const baseNoteContents = `${prerequisite ? `<p><i>Prerequisite: ${prerequisite}.</i></p> ` : ""}${rendered}`;
        const noteContents = `${baseNoteContents}<del class="hidden">${gmNotes}</del>`;

        return [noteContents, gmNotes];
    };
}

SCRIPT_EXTENSIONS.push(d20plusFeats);


unsafeWindow.d20plus = {};

const betteR20Base = function () {
	CONSOLE_LOG = console.log;
	console.log = (...args) => {
		if (args.length === 1 && typeof args[0] === "string" && args[0].startsWith("Switch mode to ")) {
			const mode = args[0].replace("Switch mode to ", "");
			if (typeof d20plus !== "undefined" && d20plus.setMode) d20plus.setMode(mode);
		}
		CONSOLE_LOG(...args);
	};


	addConfigOptions("token", {
			"_name": "Tokens",
			"massRollWhisperName": {
				"name": "Whisper Token Name to Mass-Rolls",
				"default": false,
				"_type": "boolean"
			}
		}
	);
	addConfigOptions("canvas", {
			"_name": "Canvas",
			"_player": true,
			"gridSnap": {
				"name": "Grid Snap",
				"default": "1",
				"_type": "_enum",
				"__values": ["0.25", "0.5", "1"],
				"_player": true
			},
			"scaleNamesStatuses": {
				"name": "Scaled Names and Status Icons",
				"default": true,
				"_type": "boolean",
				"_player": true
			}
		}
	);
	addConfigOptions("import", {
		"_name": "Import",
		"importIntervalMap": {
			"name": "Rest Time between Each Map (msec)",
			"default": 2500,
			"_type": "integer"
		},
	});
	addConfigOptions("interface", {
		"_name": "Interface",
		"toolbarOpacity": {
			"name": "Horizontal Toolbar Opacity",
			"default": 100,
			"_type": "_slider",
			"__sliderMin": 1,
			"__sliderMax": 100,
			"__sliderStep": 1
		},
		"quickLayerButtons": {
			"name": "Add Quick Layer Buttons",
			"default": true,
			"_type": "boolean"
		},
		"quickInitButtons": {
			"name": "Add Quick Initiative Sort Button",
			"default": true,
			"_type": "boolean"
		},
		"streamerChatTag": {
			"name": "Streamer-Friendly Chat Tags",
			"default": false,
			"_type": "boolean"
		},
		"hideDefaultJournalSearch": {
			"name": "Hide Default Journal Search Bar",
			"default": false,
			"_type": "boolean"
		},
	});
};

const D20plus = function (version) {
	d20plus.version = version;

	// Window loaded
	function doBootstrap () {
        d20plus.ut.log("Waiting for enhancement suite...");

        let timeWaitedForEnhancementSuiteMs = 0;

		(function waitForEnhancementSuite () {

			let hasRunInit = false;
			if (window.d20 || window.enhancementSuiteEnabled) {
				d20plus.ut.log("Bootstrapping...");

				// r20es will expose the d20 variable if we wait
				// this should always trigger after window.onload has fired, but track init state just in case
				(function waitForD20 () {
					if (typeof window.d20 !== "undefined" && !$("#loading-overlay").is(":visible") && !hasRunInit) {
						hasRunInit = true;
						d20plus.Init();
					} else {
						setTimeout(waitForD20, 50);
					}
				})();

				window.d20plus = d20plus;
				d20plus.ut.log("Injected");
			} else {
				if(timeWaitedForEnhancementSuiteMs > 2 * 5000) {
					alert("betteR20 requires the VTTES (R20ES) extension to be installed!\nPlease install it from https://ssstormy.github.io/roll20-enhancement-suite/\nClicking ok will take you there.");
					window.open("https://ssstormy.github.io/roll20-enhancement-suite/", "_blank");
				} else {
					timeWaitedForEnhancementSuiteMs += 100;
					setTimeout(waitForEnhancementSuite, 100);
				}
			}
		})();
	}

	(function doCheckDepsLoaded () {
		if (typeof $ !== "undefined") {
			doBootstrap();
		} else {
			setTimeout(doCheckDepsLoaded, 50);
		}
	})();
};

// if we are the topmost frame, inject
if (window.top === window.self) {
	function strip (str) {
		return str.replace(/use strict/, "").substring(str.indexOf("\n") + 1, str.lastIndexOf("\n")) + "\n";
	}

	let stack = "function (version) {\n";
	stack += strip(betteR20Base.toString());

	for (let i = 0; i < SCRIPT_EXTENSIONS.length; ++i) {
		stack += strip(SCRIPT_EXTENSIONS[i].toString())
	}
	stack += strip(D20plus.toString());

	stack += "\n}";
	unsafeWindow.eval("(" + stack + ")('" + GM_info.script.version + "')");
}
