// ==UserScript==
// @name        Steam/GOG Games Links to Free Download Site
// @namespace   Kozinc
// @version     0.5.1
// @license      MIT
// @description  Simply adds a pirate link to all games on the GOG store
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://www.gog.com/game/*
// @match        https://www.gog.com/en/game/*
// @match        https://store.steampowered.com/app/*
// @grant		     GM_registerMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM.getValue
// @grant              GM.setValue
// @grant		     GM_deleteValue
// @grant       GM_xmlhttpRequest
// @run-at      document-load
// @downloadURL https://update.greasyfork.org/scripts/438752/SteamGOG%20Games%20Links%20to%20Free%20Download%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/438752/SteamGOG%20Games%20Links%20to%20Free%20Download%20Site.meta.js
// ==/UserScript==

// Default buttonSet
var buttonSet = [
	  { url: "https://steamrip.com/?s=",           title: "SteamRIP",         urlSpecial: "" },
    { url: "https://www.ovagames.com/?s=",       title: "OVA Games",        urlSpecial: "" },
	  { url: "https://fitgirl-repacks.site/?s=",   title: "FitGirl",          urlSpecial: "" },
	  { url: "https://dodi-repacks.site/?s=",      title: "DODI",             urlSpecial: "" },
	  { url: "https://gload.to/?s=",               title: "Gload",            urlSpecial: "" },
    { url: "https://search.rlsbb.ru/?s=",        title: "Release BB",       urlSpecial: "" },
    { url: "https://scnlog.me/?s=",              title: "SCNLOG",           urlSpecial: "" },
    { url: "https://cpgrepacks.site/?s=",        title: "CPG Repacks",      urlSpecial: "" },
    { url: "https://www.tiny-repacks.win/?s=",   title: "Tiny Repacks",     urlSpecial: "" },
    { url: "https://g4u.to/en/search/?str=",     title: "g4u",              urlSpecial: "" },
    { url: "https://gog-games.to/?search=",      title: "GOG-Games.to",     urlSpecial: "" },
];

var siteSet = [
    { url: "https://www.gog.com/game/*",           title: "GOG",            urlSpecial: "" },
    { url: "https://www.gog.com/en/game/*",        title: "GOG",            urlSpecial: "" },
    { url: "https://store.steampowered.com/app/*", title: "Steam",          urlSpecial: "" },
//    { url: /https:\/\/igg-games.com\/.*.html/,     title: "IGG" },
];

const CUSTOM_SITE_KEY = "customSteamSites";

function loadCustomSites() {
  return GM_getValue(CUSTOM_SITE_KEY, []);
}

function saveCustomSites(sites) {
  GM_setValue(CUSTOM_SITE_KEY, sites);
}

/*
* usergui.js -- https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
* v1.0.0
* https://github.com/AugmentedWeb/UserGui
* Apache 2.0 licensed
*/

class UserGui {
	constructor() {
		const grantArr = GM_info?.script?.grant;

		if(typeof grantArr == "object") {
			if(!grantArr.includes("GM_xmlhttpRequest")) {
				prompt(`${this.#projectName} needs GM_xmlhttpRequest!\n\nPlease add this to your userscript's header...`, "// @grant       GM_xmlhttpRequest");
			}

			if(!grantArr.includes("GM_getValue")) {
				prompt(`${this.#projectName} needs GM_getValue!\n\nPlease add this to your userscript's header...`, "// @grant       GM_getValue");
			}

			if(!grantArr.includes("GM_setValue")) {
				prompt(`${this.#projectName} needs GM_setValue!\n\nPlease add this to your userscript's header...`, "// @grant       GM_setValue");
			}
		}
	}

	#projectName = "UserGui";
	window = undefined;
	document = undefined;
	iFrame = undefined;
	settings = {
		"window" : {
			"title" : "No title set",
			"name" : "userscript-gui",
			"external" : false,
			"centered" : false,
			"size" : {
				"width" : 300,
				"height" : 500,
				"dynamicSize" : true
			}
		},
		"gui" : {
			"centeredItems" : false,
			"internal" : {
				"darkCloseButton" : false,
				"style" : `
					body {
						background-color: #ffffff;
						overflow: hidden;
						width: 100% !important;
					}

					form {
						padding: 10px;
					}

					#gui {
						height: fit-content;
					}

					.rendered-form {
						padding: 10px;
					}

					#header {
						padding: 10px;
						cursor: move;
						z-index: 10;
						background-color: #2196F3;
						color: #fff;
						height: fit-content;
					}

					.header-item-container {
						display: flex;
						justify-content: space-between;
						align-items: center;
					}

					.left-title {
						font-size: 14px;
						font-weight: bold;
						padding: 0;
						margin: 0;
					}

					#button-close-gui {
						vertical-align: middle;
					}

					div .form-group {
						margin-bottom: 15px;
					}

					#resizer {
						width: 10px;
						height: 10px;
						cursor: se-resize;
						position: absolute;
						bottom: 0;
						right: 0;
					}

					.formbuilder-button {
					    width: fit-content;
					}
				`
			},
			"external" : {
				"popup" : true,
				"style" : `
					.rendered-form {
						padding: 10px;
					}
					div .form-group {
						margin-bottom: 15px;
					}
				`
			}
		},
		"messages" : {
			"blockedPopups" : () => alert(`The GUI (graphical user interface) failed to open!\n\nPossible reason: The popups are blocked.\n\nPlease allow popups for this site. (${window.location.hostname})`)
		}
	};

	// This error page will be shown if the user has not added any pages
	#errorPage = (title, code) => `
		<style>
			.error-page {
				width: 100%;
				height: fit-content;
				background-color: black;
				display: flex;
				justify-content: center;
				align-items: center;
				text-align: center;
				padding: 25px
			}
			.error-page-text {
				font-family: monospace;
				font-size: x-large;
				color: white;
			}
			.error-page-tag {
				margin-top: 20px;
				font-size: 10px;
				color: #4a4a4a;
				font-style: italic;
				margin-bottom: 0px;
			}
		</style>
		<div class="error-page">
			<div>
				<p class="error-page-text">${title}</p>
				<code>${code}</code>
				<p class="error-page-tag">${this.#projectName} error message</p>
			</div>
		</div>`;

	// The user can add multiple pages to their GUI. The pages are stored in this array.
	#guiPages = [
		{
			"name" : "default_no_content_set",
			"content" : this.#errorPage("Content missing", "Gui.setContent(html, tabName);")
		}
	];

	// The userscript manager's xmlHttpRequest is used to bypass CORS limitations (To load Bootstrap)
	async #bypassCors(externalFile) {
		const res = await new Promise(resolve => {
			GM_xmlhttpRequest({
			method: "GET",
			url: externalFile,
			onload: resolve
			});
		});

		return res.responseText;
	}

	// Returns one tab (as HTML) for the navigation tabs
	#createNavigationTab(page) {
		const name = page.name;

		if(name == undefined) {
			console.error(`[${this.#projectName}] Gui.addPage(html, name) <- name missing!`);
			return undefined;
		} else {
			const modifiedName = name.toLowerCase().replaceAll(' ', '').replace(/[^a-zA-Z0-9]/g, '') + Math.floor(Math.random() * 1000000000);

			const content = page.content;
			const indexOnArray = this.#guiPages.map(x => x.name).indexOf(name);
			const firstItem = indexOnArray == 0 ? true : false;

			return {
				"listItem" : `
					<li class="nav-item" role="presentation">
						<button class="nav-link ${firstItem ? 'active' : ''}" id="${modifiedName}-tab" data-bs-toggle="tab" data-bs-target="#${modifiedName}" type="button" role="tab" aria-controls="${modifiedName}" aria-selected="${firstItem}">${name}</button>
					</li>
				`,
				"panelItem" : `
					<div class="tab-pane ${firstItem ? 'active' : ''}" id="${modifiedName}" role="tabpanel" aria-labelledby="${modifiedName}-tab">${content}</div>
				`
			};
		}
	}

	// Make tabs function without bootstrap.js (CSP might block bootstrap and make the GUI nonfunctional)
	#initializeTabs() {
		const handleTabClick = e => {
			const target = e.target;
			const contentID = target.getAttribute("data-bs-target");

			target.classList.add("active");
			this.document.querySelector(contentID).classList.add("active");

			[...this.document.querySelectorAll(".nav-link")].forEach(tab => {
				if(tab != target) {
					const contentID = tab.getAttribute("data-bs-target");

					tab.classList.remove("active");
					this.document.querySelector(contentID).classList.remove("active");
				}
			});
		}

		[...this.document.querySelectorAll(".nav-link")].forEach(tab => {
			tab.addEventListener("click", handleTabClick);
		});
	}

	// Will determine if a navbar is needed, returns either a regular GUI, or a GUI with a navbar
	#getContent() {
		// Only one page has been set, no navigation tabs will be created
		if(this.#guiPages.length == 1) {
			return this.#guiPages[0].content;
		}
		// Multiple pages has been set, dynamically creating the navigation tabs
		else if(this.#guiPages.length > 1) {
			const tabs = (list, panels) => `
				<ul class="nav nav-tabs" id="userscript-tab" role="tablist">
					${list}
				</ul>
				<div class="tab-content">
					${panels}
				</div>
			`;

			let list = ``;
			let panels = ``;

			this.#guiPages.forEach(page => {
				const data = this.#createNavigationTab(page);

				if(data != undefined) {
					list += data.listItem + '\n';
					panels += data.panelItem + '\n';
				}
			});

			return tabs(list, panels);
		}
	}

	// Returns the GUI's whole document as string
	async #createDocument() {
		const bootstrapStyling = await this.#bypassCors("https://raw.githubusercontent.com/AugmentedWeb/UserGui/Release-1.0/resources/bootstrap.css");

		const externalDocument = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>${this.settings.window.title}</title>
			<style>
			${bootstrapStyling}
			${this.settings.gui.external.style}
			${
			this.settings.gui.centeredItems
				? `.form-group {
						display: flex;
						justify-content: center;
					}`
				: ""
			}
			</style>
		</head>
		<body>
		${this.#getContent()}
		</body>
		</html>
		`;

		const internalDocument = `
		<!doctype html>
		<html lang="en">
		<head>
			<style>
			${bootstrapStyling}
			${this.settings.gui.internal.style}
			${
			this.settings.gui.centeredItems
				? `.form-group {
						display: flex;
						justify-content: center;
					}`
				: ""
			}
			</style>
		</head>
		<body>
			<div id="gui">
				<div id="header">
					<div class="header-item-container">
						<h1 class="left-title">${this.settings.window.title}</h1>
						<div class="right-buttons">
							<button type="button" class="${this.settings.gui.internal.darkCloseButton ? "btn-close" : "btn-close btn-close-white"}" aria-label="Close" id="button-close-gui"></button>
						</div>
					</div>
				</div>
				<div id="content">
				${this.#getContent()}
				</div>
				<div id="resizer"></div>
			</div>
		</body>
		</html>
		`;

		if(this.settings.window.external) {
			return externalDocument;
		} else {
			return internalDocument;
		}
	}

	// The user will use this function to add a page to their GUI, with their own HTML (Bootstrap 5)
	addPage(tabName, htmlString) {
		if(this.#guiPages[0].name == "default_no_content_set") {
			this.#guiPages = [];
		}

		this.#guiPages.push({
			"name" : tabName,
			"content" : htmlString
		});
	}

	#getCenterScreenPosition() {
		const guiWidth = this.settings.window.size.width;
		const guiHeight = this.settings.window.size.height;

		const x = (screen.width - guiWidth) / 2;
		const y = (screen.height - guiHeight) / 2;

		return { "x" : x, "y": y };
	}

	#getCenterWindowPosition() {
		const guiWidth = this.settings.window.size.width;
		const guiHeight = this.settings.window.size.height;

		const x = (window.innerWidth - guiWidth) / 2;
		const y = (window.innerHeight - guiHeight) / 2;

		return { "x" : x, "y": y };
	}

	#initializeInternalGuiEvents(iFrame) {
		// - The code below will consist mostly of drag and resize implementations
		// - iFrame window <-> Main window interaction requires these to be done
		// - Basically, iFrame document's event listeners make the whole iFrame move on the main window

		// Sets the iFrame's size
		function setFrameSize(x, y) {
			iFrame.style.width = `${x}px`;
			iFrame.style.height = `${y}px`;
		}

		// Gets the iFrame's size
		function getFrameSize() {
			const frameBounds = iFrame.getBoundingClientRect();

			return { "width" : frameBounds.width, "height" : frameBounds.height };
		}

		// Sets the iFrame's position relative to the main window's document
		function setFramePos(x, y) {
			iFrame.style.left = `${x}px`;
			iFrame.style.top = `${y}px`;
		}

		// Gets the iFrame's position relative to the main document
		function getFramePos() {
			const frameBounds = iFrame.getBoundingClientRect();

			return { "x": frameBounds.x, "y" : frameBounds.y };
		}

		// Gets the frame body's offsetHeight
		function getInnerFrameSize() {
			const innerFrameElem = iFrame.contentDocument.querySelector("#gui");

			return { "x": innerFrameElem.offsetWidth, "y" : innerFrameElem.offsetHeight };
		}

		// Sets the frame's size to the innerframe's size
		const adjustFrameSize = () => {
			const innerFrameSize = getInnerFrameSize();

			setFrameSize(innerFrameSize.x, innerFrameSize.y);
		}

		// Variables for draggable header
		let dragging = false,
			dragStartPos = { "x" : 0, "y" : 0 };

		// Variables for resizer
		let resizing = false,
			mousePos = { "x" : undefined, "y" : undefined },
			lastFrame;

		function handleResize(isInsideFrame, e) {
			if(mousePos.x == undefined && mousePos.y == undefined) {
				mousePos.x = e.clientX;
				mousePos.y = e.clientY;

				lastFrame = isInsideFrame;
			}

			const deltaX = mousePos.x - e.clientX,
				  deltaY = mousePos.y - e.clientY;

			const frameSize = getFrameSize();
			const allowedSize = frameSize.width - deltaX > 160 && frameSize.height - deltaY > 90;

			if(isInsideFrame == lastFrame && allowedSize) {
				setFrameSize(frameSize.width - deltaX, frameSize.height - deltaY);
			}

			mousePos.x = e.clientX;
			mousePos.y = e.clientY;

			lastFrame = isInsideFrame;
		}

		function handleDrag(isInsideFrame, e) {
			const bR = iFrame.getBoundingClientRect();

			const windowWidth = window.innerWidth,
				windowHeight = window.innerHeight;

			let x, y;

			if(isInsideFrame) {
				x = getFramePos().x += e.clientX - dragStartPos.x;
				y = getFramePos().y += e.clientY - dragStartPos.y;
			} else {
				x = e.clientX - dragStartPos.x;
				y = e.clientY - dragStartPos.y;
			}

			// Check out of bounds: left
			if(x <= 0) {
				x = 0
			}

			// Check out of bounds: right
			if(x + bR.width >= windowWidth) {
				x = windowWidth - bR.width;
			}

			// Check out of bounds: top
			if(y <= 0) {
				y = 0;
			}

			// Check out of bounds: bottom
			if(y + bR.height >= windowHeight) {
				y = windowHeight - bR.height;
			}

			setFramePos(x, y);
		}

		// Dragging start (iFrame)
		this.document.querySelector("#header").addEventListener('mousedown', e => {
			e.preventDefault();

			dragging = true;

			dragStartPos.x = e.clientX;
			dragStartPos.y = e.clientY;
		});

		// Resizing start
		this.document.querySelector("#resizer").addEventListener('mousedown', e => {
			e.preventDefault();

			resizing = true;
		});

		// While dragging or resizing (iFrame)
		this.document.addEventListener('mousemove', e => {
			if(dragging)
				handleDrag(true, e);

			if(resizing)
				handleResize(true, e);
		});

		// While dragging or resizing (Main window)
		document.addEventListener('mousemove', e => {
			if(dragging)
				handleDrag(false, e);

			if(resizing)
				handleResize(false, e);
		});

		// Stop dragging and resizing (iFrame)
		this.document.addEventListener('mouseup', e => {
			e.preventDefault();

			dragging = false;
			resizing = false;
		});

		// Stop dragging and resizing (Main window)
		document.addEventListener('mouseup', e => {
			dragging = false;
			resizing = false;
		});

		// Listener for the close button, closes the internal GUI
		this.document.querySelector("#button-close-gui").addEventListener('click', e => {
			e.preventDefault();

			this.close();
		});

		const guiObserver = new MutationObserver(adjustFrameSize);
		const guiElement = this.document.querySelector("#gui");

		guiObserver.observe(guiElement, {
			childList: true,
			subtree: true,
			attributes: true
		});

		adjustFrameSize();
	}

	async #openExternalGui(readyFunction) {
		const noWindow = this.window?.closed;

		if(noWindow || this.window == undefined) {
			let pos = "";
			let windowSettings = "";

			if(this.settings.window.centered && this.settings.gui.external.popup) {
				const centerPos = this.#getCenterScreenPosition();
				pos = `left=${centerPos.x}, top=${centerPos.y}`;
			}

			if(this.settings.gui.external.popup) {
				windowSettings = `width=${this.settings.window.size.width}, height=${this.settings.window.size.height}, ${pos}`;
			}

			// Create a new window for the GUI
			this.window = window.open("", this.settings.windowName, windowSettings);

			if(!this.window) {
				this.settings.messages.blockedPopups();
				return;
			}

			// Write the document to the new window
			this.window.document.open();
			this.window.document.write(await this.#createDocument());
			this.window.document.close();

			if(!this.settings.gui.external.popup) {
				this.window.document.body.style.width = `${this.settings.window.size.width}px`;

				if(this.settings.window.centered) {
					const centerPos = this.#getCenterScreenPosition();

					this.window.document.body.style.position = "absolute";
					this.window.document.body.style.left = `${centerPos.x}px`;
					this.window.document.body.style.top = `${centerPos.y}px`;
				}
			}

			// Dynamic sizing (only height & window.outerHeight no longer works on some browsers...)
			this.window.resizeTo(
				this.settings.window.size.width,
				this.settings.window.size.dynamicSize
					? this.window.document.body.offsetHeight + (this.window.outerHeight - this.window.innerHeight)
					: this.settings.window.size.height
			);

			this.document = this.window.document;

			this.#initializeTabs();

			// Call user's function
			if(typeof readyFunction == "function") {
				readyFunction();
			}

			window.onbeforeunload = () => {
				// Close the GUI if parent window closes
				this.close();
			}
		}

		else {
			// Window was already opened, bring the window back to focus
			this.window.focus();
		}
	}

	async #openInternalGui(readyFunction) {
		if(this.iFrame) {
			return;
		}

		const fadeInSpeedMs = 250;

		let left = 0, top = 0;

		if(this.settings.window.centered) {
			const centerPos = this.#getCenterWindowPosition();

			left = centerPos.x;
			top = centerPos.y;
		}

		const iframe = document.createElement("iframe");
		iframe.srcdoc = await this.#createDocument();
		iframe.style = `
			position: fixed;
			top: ${top}px;
			left: ${left}px;
			width: ${this.settings.window.size.width};
			height: ${this.settings.window.size.height};
			border: 0;
			opacity: 0;
			transition: all ${fadeInSpeedMs/1000}s;
			border-radius: 5px;
			box-shadow: rgb(0 0 0 / 6%) 10px 10px 10px;
			z-index: 2147483647;
		`;

		const waitForBody = setInterval(() => {
			if(document?.body) {
				clearInterval(waitForBody);

				// Prepend the GUI to the document's body
				document.body.prepend(iframe);

				iframe.contentWindow.onload = () => {
					// Fade-in implementation
					setTimeout(() => iframe.style["opacity"] = "1", fadeInSpeedMs/2);
					setTimeout(() => iframe.style["transition"] = "none", fadeInSpeedMs + 500);

					this.window = iframe.contentWindow;
					this.document = iframe.contentDocument;
					this.iFrame = iframe;

					this.#initializeInternalGuiEvents(iframe);
					this.#initializeTabs();

					readyFunction();
				}
			}
		}, 100);
	}

	// Determines if the window is to be opened externally or internally
	open(readyFunction) {
		if(this.settings.window.external) {
			this.#openExternalGui(readyFunction);
		} else {
			this.#openInternalGui(readyFunction);
		}
	}

	// Closes the GUI if it exists
	close() {
		if(this.settings.window.external) {
			if(this.window) {
				this.window.close();
			}
		} else {
			if(this.iFrame) {
				this.iFrame.remove();
				this.iFrame = undefined;
			}
		}
	}

	saveConfig() {
		let config = [];

		if(this.document) {
			[...this.document.querySelectorAll(".form-group")].forEach(elem => {
				const inputElem = elem.querySelector("[name]");

				const name = inputElem.getAttribute("name"),
					  data = this.getData(name);

				if(data) {
					config.push({ "name" : name, "value" : data });
				}
			});
		}

		GM_setValue("config", config);
	}

	loadConfig() {
		const config = this.getConfig();

		if(this.document && config) {
			config.forEach(elemConfig => {
				this.setData(elemConfig.name, elemConfig.value);
			})
		}
	}

	getConfig() {
		return GM_getValue("config");
	}

	resetConfig() {
		const config = this.getConfig();

		if(config) {
			GM_setValue("config", []);
		}
	}

	dispatchFormEvent(name) {
		const type = name.split("-")[0].toLowerCase();
		const properties = this.#typeProperties.find(x => type == x.type);
		const event = new Event(properties.event);

		const field = this.document.querySelector(`.field-${name}`);
		field.dispatchEvent(event);
	}

	setPrimaryColor(hex) {
		const styles = `
		#header {
			background-color: ${hex} !important;
		}
		.nav-link {
			color: ${hex} !important;
		}
		.text-primary {
			color: ${hex} !important;
		}
		`;

		const styleSheet = document.createElement("style")
		styleSheet.innerText = styles;
		this.document.head.appendChild(styleSheet);
	}

	// Creates an event listener a GUI element
	event(name, event, eventFunction) {
		this.document.querySelector(`.field-${name}`).addEventListener(event, eventFunction);
	}

	// Disables a GUI element
	disable(name) {
		[...this.document.querySelector(`.field-${name}`).children].forEach(childElem => {
			childElem.setAttribute("disabled", "true");
		});
	}

	// Enables a GUI element
	enable(name) {
		[...this.document.querySelector(`.field-${name}`).children].forEach(childElem => {
			if(childElem.getAttribute("disabled")) {
				childElem.removeAttribute("disabled");
			}
		});
	}

	// Gets data from types: TEXT FIELD, TEXTAREA, DATE FIELD & NUMBER
	getValue(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`[id=${name}]`).value;
	}

	// Sets data to types: TEXT FIELD, TEXT AREA, DATE FIELD & NUMBER
	setValue(name, newValue) {
		this.document.querySelector(`.field-${name}`).querySelector(`[id=${name}]`).value = newValue;

		this.dispatchFormEvent(name);
	}

	// Gets data from types: RADIO GROUP
	getSelection(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`input[name=${name}]:checked`).value;
	}

	// Sets data to types: RADIO GROUP
	setSelection(name, newOptionsValue) {
		this.document.querySelector(`.field-${name}`).querySelector(`input[value=${newOptionsValue}]`).checked = true;

		this.dispatchFormEvent(name);
	}

	// Gets data from types: CHECKBOX GROUP
	getChecked(name) {
		return [...this.document.querySelector(`.field-${name}`).querySelectorAll(`input[name*=${name}]:checked`)]
			.map(checkbox => checkbox.value);
	}

	// Sets data to types: CHECKBOX GROUP
	setChecked(name, checkedArr) {
		const checkboxes = [...this.document.querySelector(`.field-${name}`).querySelectorAll(`input[name*=${name}]`)]

		checkboxes.forEach(checkbox => {
			if(checkedArr.includes(checkbox.value)) {
				checkbox.checked = true;
			}
		});

		this.dispatchFormEvent(name);
	}

	// Gets data from types: FILE UPLOAD
	getFiles(name) {
		return this.document.querySelector(`.field-${name}`).querySelector(`input[id=${name}]`).files;
	}

	// Gets data from types: SELECT
	getOption(name) {
		const selectedArr = [...this.document.querySelector(`.field-${name} #${name}`).selectedOptions].map(({value}) => value);

		return selectedArr.length == 1 ? selectedArr[0] : selectedArr;
	}

	// Sets data to types: SELECT
	setOption(name, newOptionsValue) {
		if(typeof newOptionsValue == 'object') {
		    newOptionsValue.forEach(optionVal => {
			this.document.querySelector(`.field-${name}`).querySelector(`option[value=${optionVal}]`).selected = true;
		    });
		} else {
		    this.document.querySelector(`.field-${name}`).querySelector(`option[value=${newOptionsValue}]`).selected = true;
		}

		this.dispatchFormEvent(name);
	}

	#typeProperties = [
		{
			"type": "button",
			"event": "click",
			"function": {
				"get" : null,
				"set" : null
			}
		},
		{
			"type": "radio",
			"event": "change",
			"function": {
				"get" : n => this.getSelection(n),
				"set" : (n, nV) => this.setSelection(n, nV)
			}
		},
		{
			"type": "checkbox",
			"event": "change",
			"function": {
				"get" : n => this.getChecked(n),
				"set" : (n, nV) => this.setChecked(n, nV)
			}
		},
		{
			"type": "date",
			"event": "change",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "file",
			"event": "change",
			"function": {
				"get" : n => this.getFiles(n),
				"set" : null
			}
		},
		{
			"type": "number",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "select",
			"event": "change",
			"function": {
				"get" : n => this.getOption(n),
				"set" : (n, nV) => this.setOption(n, nV)
			}
		},
		{
			"type": "text",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
		{
			"type": "textarea",
			"event": "input",
			"function": {
				"get" : n => this.getValue(n),
				"set" : (n, nV) => this.setValue(n, nV)
			}
		},
	];

	// The same as the event() function, but automatically determines the best listener type for the element
	// (e.g. button -> listen for "click", textarea -> listen for "input")
	smartEvent(name, eventFunction) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				this.event(name, properties.event, eventFunction);

			} else {
				console.warn(`${this.#projectName}'s smartEvent function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s smartEvent. The event could not be made.`);
		}
	}

	// Will automatically determine the suitable function for data retrivial
	// (e.g. file select -> use getFiles() function)
	getData(name) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				const getFunction = properties.function.get;

				if(typeof getFunction == "function") {
					return getFunction(name);

				} else {
					console.error(`${this.#projectName}'s getData function can't be used for the type "${type}". The data can't be taken.`);
				}

			} else {
				console.warn(`${this.#projectName}'s getData function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s getData function. The event could not be made.`);
		}
	}

	// Will automatically determine the suitable function for data retrivial (e.g. checkbox -> use setChecked() function)
	setData(name, newData) {
		if(name.includes("-")) {
			const type = name.split("-")[0].toLowerCase();
			const properties = this.#typeProperties.find(x => type == x.type);

			if(typeof properties == "object") {
				const setFunction = properties.function.set;

				if(typeof setFunction == "function") {
					return setFunction(name, newData);

				} else {
					console.error(`${this.#projectName}'s setData function can't be used for the type "${type}". The data can't be taken.`);
				}

			} else {
				console.warn(`${this.#projectName}'s setData function did not find any matches for the type "${type}". The event could not be made.`);
			}

		} else {
			console.warn(`The input name "${name}" is invalid for ${this.#projectName}'s setData function. The event could not be made.`);
		}
	}
};

const Gui = new UserGui;
Gui.settings.window.title = "Pirate Games Links Settings";
Gui.settings.window.centered = true;

var steamDisplaySidebar = GM_getValue("steamDisplaySidebar", true);
var steamDisplayCart    = GM_getValue("steamDisplayCart"   , false);
var steamDisplayHub     = GM_getValue("steamDisplayHub"    , true);


var gogDisplaySidebar = GM_getValue("gogDisplaySidebar", true);
var gogDisplayCart    = GM_getValue("gogDisplayCart",    false);

var siteSetResult = "";

siteSet.forEach((el) => {
    if(!!document.URL.match(el.url)) siteSetResult = el.title;
})

// Load saved buttonSet preference
let savedButtonSet = GM_getValue("enabledButtonSet", []);
if(savedButtonSet.length === 0) {
  savedButtonSet = buttonSet;
}

Gui.addPage("Settings", `
<div class="rendered-form">
    <div class="">
        <h2 access="false" class="text-primary" id="control-274549">Button Settings</h2>
    </div>
    <div class="checkbox-group formbuilder-checkbox-group form-group field-checkbox-group-steamDisplay">
        <div class="formbuilder-checkbox-group form-group field-checkbox-group-steamDisplay">
            <label for="checkbox-group-steamDisplay" class="formbuilder-checkbox-group-label">Steam display:</label>
            <div class="checkbox-group-steamDisplay">
                <div class="formbuilder-checkbox-inline">
                    <label for="checkbox-group-steamDisplay-0" class="kc-toggle">
                        <input name="checkbox-group-steamDisplay[]" access="false" id="checkbox-group-steamDisplay-0" value="steamDisplaySidebar" ${steamDisplaySidebar ? 'checked' : ''} type="checkbox"><span></span>Sidebar</label>
                </div>
                <div class="formbuilder-checkbox-inline">
                    <label for="checkbox-group-steamDisplay-1" class="kc-toggle">
                        <input name="checkbox-group-steamDisplay[]" access="false" id="checkbox-group-steamDisplay-1" value="steamDisplayCart" ${steamDisplayCart ? 'checked' : ''} type="checkbox"><span></span>Cart</label>
                </div>
                <div class="formbuilder-checkbox-inline">
                    <label for="checkbox-group-steamDisplay-2" class="kc-toggle">
                        <input name="checkbox-group-steamDisplay[]" access="false" id="checkbox-group-steamDisplay-2" value="steamDisplayHub" ${steamDisplayHub ? 'checked' : ''} type="checkbox"><span></span>Hub</label>
                </div>
            </div>
        </div>
    </div>
    <div class="checkbox-group formbuilder-checkbox-group form-group field-checkbox-group-gogDisplay">
        <div class="formbuilder-checkbox-group form-group field-checkbox-group-gogDisplay">
            <label for="checkbox-group-gogDisplay" class="formbuilder-checkbox-group-label">GOG display:</label>
            <div class="checkbox-group-gogDisplay">
                <div class="formbuilder-checkbox-inline">
                    <label for="checkbox-group-gogDisplay-0" class="kc-toggle">
                        <input name="checkbox-group-gogDisplay[]" access="false" id="checkbox-group-gogDisplay-0" value="gogDisplaySidebar" ${gogDisplaySidebar ? 'checked' : ''} type="checkbox"><span></span>Sidebar</label>
                </div>
                <div class="formbuilder-checkbox-inline">
                    <label for="checkbox-group-gogDisplay-1" class="kc-toggle">
                        <input name="checkbox-group-gogDisplay[]" access="false" id="checkbox-group-gogDisplay-1" value="gogDisplayCart" ${gogDisplayCart ? 'checked' : ''} type="checkbox"><span></span>Cart</label>
                </div>
            </div>
        </div>
    </div>
    <div class="checkbox-group formbuilder-checkbox-group form-group field-checkbox-group-saved">
        <h3>Toggle Buttons:</h3>
        <div class="checkbox-group-saved">
            ${buttonSet.map((button, index) => `
                <div class="formbuilder-checkbox">
                    <input name="checkbox-group-saved[]" id="checkbox-group-saved-${index}" type="checkbox" value="${button.title}"  ${savedButtonSet.some(item => item.title === button.title) ? 'checked' : ''}>
                    <label for="checkbox-group-saved-${index}">${button.title}</label>
                </div>
            `).join('')}
        </div>
    </div>
    <div class="formbuilder-button form-group field-button-save-config">
        <button type="button" class="btn-success btn" name="button-save-config" access="false" style="success" id="button-save-config">Save</button>
    </div>
</div>
`);

const customSites = loadCustomSites();

Gui.addPage("Custom Sites", `
<div class="rendered-form">
  <h2 class="text-primary">Custom Sites</h2>
  <div id="custom-sites-list">
    ${customSites.map((site, i) => `
      <div class="custom-site-item" data-i="${i}" style="margin-bottom:8px; display: flex; gap: 5px; align-items: center;">
        <div style="display: flex; flex-direction:column;">
          <input type="text" id="cs-title-${i}" value="${site.title}" placeholder="Name">
          <input type="text" id="cs-url-${i}" value="${site.url}" placeholder="Search URL">
        </div>
        <div style="display: flex; flex-direction:column;">
          <button class="cs-save-item btn btn-sm btn-primary">Save</button>
          <button class="cs-remove-item btn btn-sm btn-danger">✖</button>
        </div>
      </div>
    `).join("")}
  </div>

  <hr>

  <div style="display: flex; flex-direction:column; gap: 5px;">
    <input id="cs-new-title" placeholder="Site Name" style="flex-grow: 1;">
    <input id="cs-new-url" placeholder="https://example.com/?s=" style="flex-grow: 2;">
  </div>

  <button id="cs-add" class="btn btn-success">Add Site</button>
</div>
`);

function insertAddControl(parent, options = {}) {
  if (!parent || parent.querySelector(".steam-hub-controls")) return;

  const control = createAddCustomSiteControl();

  if (options.fullWidth) {
    control.style.width = "100%";
  }

  if (options.marginTop) {
    control.style.marginTop = options.marginTop;
  }

  parent.appendChild(control);
}

function createAddCustomSiteControl() {
  const controls = document.createElement("div");
  controls.className = "steam-hub-controls product-actions-body";

  const addBtn = document.createElement("button");
  addBtn.className = "steam-hub-add-btn button button--big buy-now-button";
  addBtn.textContent = "+ Add custom site";

  const inputCtn = document.createElement("div");
  inputCtn.className = "steam-hub-input-container";
  inputCtn.style.display = "none";

  const titleInput = document.createElement("input");
  titleInput.className = "steam-hub-input";
  titleInput.placeholder = "Site name";

  const urlInput = document.createElement("input");
  urlInput.className = "steam-hub-input";
  urlInput.placeholder = "https://example.com/?s=";

  const btnGroup = document.createElement("div");
  btnGroup.className = "steam-hub-button-group";

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "steam-hub-confirm-btn button button--big buy-now-button";
  confirmBtn.textContent = "Add";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "steam-hub-cancel-btn button button--big buy-now-button";
  cancelBtn.textContent = "Cancel";

  btnGroup.append(confirmBtn, cancelBtn);
  inputCtn.append(titleInput, urlInput, btnGroup);
  controls.append(addBtn, inputCtn);

  /* ---------- Events ---------- */

  addBtn.addEventListener("click", () => {
    addBtn.style.display = "none";
    inputCtn.style.display = "flex";
    inputCtn.style.flexDirection = "column";
    inputCtn.style.padding = "5px";
    inputCtn.style.border = "1px solid var(--c-ui-tertiary)";
  });

  cancelBtn.addEventListener("click", () => {
    inputCtn.style.display = "none";
    addBtn.style.display = "inline-block";
    titleInput.value = "";
    urlInput.value = "";
  });

  confirmBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!title || !url.includes("?")) {
      alert("Please enter a valid name and search URL");
      return;
    }

    const sites = loadCustomSites();
    sites.push({ title, url, urlSpecial: "" });
    saveCustomSites(sites);

    location.reload();
  });

  return controls;
}

function openSettingsGui() {
    Gui.open(() => {
        Gui.smartEvent("button-save-config", (data) => {
            const buttons = Gui.getData("checkbox-group-saved");
            const steamDisplay = Gui.getData("checkbox-group-steamDisplay");
            const gogDisplay = Gui.getData("checkbox-group-gogDisplay");
            GM_setValue("enabledButtonSet", buttonSet.filter(item => buttons.includes(item.title)));
            GM_setValue("steamDisplaySidebar", steamDisplay.includes("steamDisplaySidebar"));
            GM_setValue("steamDisplayCart",    steamDisplay.includes("steamDisplayCart"));
            GM_setValue("steamDisplayHub",     steamDisplay.includes("steamDisplayHub"));
            GM_setValue("gogDisplaySidebar",   gogDisplay.includes("gogDisplaySidebar"));
            GM_setValue("gogDisplayCart",      gogDisplay.includes("gogDisplayCart"));
            // Gui.saveConfig();
            location.reload(); // Reload the page to reflect changes
        });
    // Custom site add
    Gui.document.getElementById("cs-add")?.addEventListener("click", () => {
      const title = Gui.document.getElementById("cs-new-title").value.trim();
      const url   = Gui.document.getElementById("cs-new-url").value.trim();

      if (!title || !url.includes("?")) {
        alert("Invalid site");
        return;
      }

      const sites = loadCustomSites();
      sites.push({ title, url, urlSpecial: "" });
      saveCustomSites(sites);
      location.reload();
    });

    // Custom site item buttons (Save/Remove)
    Gui.document.getElementById("custom-sites-list")?.addEventListener("click", e => {
      const target = e.target;
      const siteItem = target.closest(".custom-site-item");
      if (!siteItem) return;

      const i = Number(siteItem.dataset.i);

      if (target.classList.contains("cs-remove-item")) {
        const sites = loadCustomSites();
        sites.splice(i, 1);
        saveCustomSites(sites);
        location.reload();
      } else if (target.classList.contains("cs-save-item")) {
        const titleInput = siteItem.querySelector(`#cs-title-${i}`);
        const urlInput = siteItem.querySelector(`#cs-url-${i}`);
        const title = titleInput.value.trim();
        const url = urlInput.value.trim();

        if (!title || !url.includes("?")) {
          alert("Invalid site data. Please provide a title and a valid search URL.");
          return;
        }

        const sites = loadCustomSites();
        sites[i] = { title, url, urlSpecial: "" };
        saveCustomSites(sites);
        location.reload();
      }
    });
    Gui.loadConfig();
  });
}

function injectSteamHubStyles() {
  if (document.getElementById("steam-hub-styles")) return;

  const style = document.createElement("style");
  style.id = "steam-hub-styles";
  style.textContent = `
    .steam-hub-container {
      margin-top: 50px;
      padding: 20px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 0px;
    }

    .steam-hub-section {
      margin-bottom: 30px;
    }

    .steam-hub-section:last-child {
      margin-bottom: 0;
    }

    .steam-hub-header {
      font-weight: bold;
      font-size: 21px;
      margin-bottom: 15px;
      text-transform: uppercase;
      color: inherit;
    }

    .steam-hub-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .steam-hub-button-wrapper {
      position: relative;
      display: inline-block;
    }

    .steam-hub-button {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 160px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      background-color: rgba(103, 193, 245, 0.2);
      color: #67c1f5;
      font-size: 14px;
      border-radius: 6px;
      text-decoration: none;
      transition: background-color 0.2s;
    }

    .steam-hub-button:hover {
      background-color: rgba(103, 193, 245, 0.3);
    }

    @media (max-width: 768px) {
      .steam-hub-button {
        min-width: 140px;
      }
    }

    .steam-hub-controls {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .steam-hub-controls button {
      display: inline-block;
      margin: 5px 0px !important;
      padding: 5px 10px;
      margin-bottom: 16px;
    }

    .steam-hub-add-btn {
      background: linear-gradient(to right, #6fa720 5%, #588a1b 95%);
      color: #d2efa9;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      width: fit-content;
  display: block;
  border-radius: 5px;
  padding: 15px;
  width: 100%;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.25);
  font-weight: 700;
  cursor: pointer;
  text-align: center;
    }

    .steam-hub-input-container {
      display: none;
      flex-direction: column;
      gap: 6px;
      max-width: 320px;
    }

    .steam-hub-input {
      padding: 8px 12px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(103, 193, 245, 0.2);
      border-radius: 4px;
      color: #c7d5e0;
      font-size: 13px;
    }

    .steam-hub-button-group {
      display: flex;
      gap: 6px;
    }

    .steam-hub-confirm-btn {
      background: linear-gradient(to right, #6fa720 5%, #588a1b 95%);
      color: white;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      flex: 1;
    }

    .steam-hub-cancel-btn {
      background: #8f98a0;
      color: white;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      flex: 1;
    }
  `;
  document.head.appendChild(style);
}

function createSteamHub(appName, buttons) {
  injectSteamHubStyles();

  const container = document.createElement("div");
  container.className = "steam-hub-container";

  const section = document.createElement("div");
  section.className = "steam-hub-section";

  const header = document.createElement("div");
  header.className = "steam-hub-header";
  header.textContent = "PIRATE / DEAL HUB";

  const grid = document.createElement("div");
  grid.className = "steam-hub-grid";

  buttons.forEach(site => {
    const wrapper = document.createElement("div");
    wrapper.className = "steam-hub-button-wrapper";

    const button = document.createElement("a");
    button.className = "steam-hub-button";
    button.target = "_blank";
    button.href = site.url + appName;
    button.textContent = site.title;

    wrapper.appendChild(button);
    grid.appendChild(wrapper);
  });

  const controls = createAddCustomSiteControl();

  section.appendChild(header);
  section.appendChild(grid);
  section.appendChild(controls);
  container.appendChild(section);

  return container;
}

var appName = "";
switch(siteSetResult) {
    case "GOG":
        appName = document.getElementsByClassName("productcard-basics__title")[0].textContent;
        appName = appName.trim().replace(/[^a-zA-Z0-9' ]/g, '');
        if (gogDisplayCart) {
            const allButtons = [...savedButtonSet, ...loadCustomSites()];
            allButtons.forEach((el) => {
                $("button.cart-button")[0].parentElement.parentElement.append(furnishGOG(el.url+appName, el.title))
            })
        }

        if (gogDisplaySidebar) {
            const tableRow = document.createElement('div');
            tableRow.classList.add('table__row', 'details__row');

            // Create the category div
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('details__category', 'table__row-label');
            categoryDiv.textContent = 'Search for ' + appName + ':';

            // Create the content div
            const contentDiv = document.createElement('div');
            contentDiv.classList.add('details__content', 'table__row-content');

            const allButtons = [...savedButtonSet, ...loadCustomSites()];

            allButtons.forEach((el, index) => {
                const anchor = document.createElement('a');
                anchor.href = el.url+appName; // You can set the href attribute value as needed
                anchor.target = '_blank';
                anchor.classList.add('details__link', 'ng-scope');
                anchor.textContent = el.title;
                contentDiv.appendChild(anchor);

                if (index < allButtons.length - 1) {
                    const lineBreak = document.createElement('br');
                    contentDiv.appendChild(lineBreak);
                    // const comma = document.createTextNode(', ');
                    // contentDiv.appendChild(comma);
                }
            })
            tableRow.appendChild(categoryDiv);
            tableRow.appendChild(contentDiv);

            // Finally, append the entire structure to the desired parent element in the DOM
            document.querySelector("div.details.table.table--without-border.ng-scope").prepend(tableRow); // Or append to a specific element
        }
        if (gogDisplaySidebar) {
          const sidebar = document.querySelector(".product-actions");
          insertAddControl(sidebar, { marginTop: "10px" });
        }
        if (gogDisplayCart) {
          const cartActions =
            document.querySelector(".cart-footer__actions") ||
            document.querySelector(".cart-footer");
          insertAddControl(cartActions, { marginTop: "12px", fullWidth: true });
        }

        break;
    case "Steam":
        appName = document.getElementsByClassName("apphub_AppName")[0].textContent;
        const allSteamButtons = [...savedButtonSet, ...loadCustomSites()];
        appName = appName.trim().replace(/[^a-zA-Z0-9' ]/g, '');
        // $(".game_purchase_action_bg:first").css({"height": "32px"}); remove

        if (steamDisplayCart) {
            $(".game_purchase_action_bg:first").css({
                "height": "50px",
                "max-width": "500px",
                "text-wrap": "wrap"
            });
        }

        if (steamDisplayHub) {
          const ignoreBtn = document.querySelector("#ignoreBtn");
          const queueCtn = ignoreBtn?.closest("#queueActionsCtn");

          if (queueCtn && queueCtn.parentNode) {
            queueCtn.parentNode.insertBefore(
              createSteamHub(appName, allSteamButtons),
              queueCtn.nextSibling
            );
          }
        }

        //////////
        if (steamDisplaySidebar) {
            // Sidebar for Steam
            // $(".glance_ctn_responsive_left:first").append(' <div class="dev_row"><div class="subtitle column"><br></div></div><hr><br>');
            $(".block.responsive_apppage_details_left:first").parent().prepend(' <div class="block responsive_apppage_details_left" ><div><div style="color: #8f98a0;margin-bottom: 6px;">Search for ' + appName +': </div></div> ');

            // Create and insert the style element for custom CSS rules
            var style = document.createElement('style');
            style.innerHTML = `
                .pirate_row {
                    display: flex;
                }
                .pirate_row, .pirate_row .column {
                    white-space: normal !important;
                }
                .pirate_row .column {
                    color: #556772;
                }
                .pirate_row .subtitle {
                    text-transform: uppercase;
                    font-size: 10px;
                    padding-right: 10px;
                    min-width: 120px;
                }
                .pirate_row .summary {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    color: #556772;
                }
                .pirate_row:hover {
                    background-color: #333; /* Dark grey background on hover */
                }
            `;
            document.head.appendChild(style);
        }
        ////////////

        if (steamDisplaySidebar) {
            allSteamButtons.forEach((el) => {
                $(".block.responsive_apppage_details_left:first").append(furnishSteamSidebar(el.url+appName + el.urlSpecial, el.title, appName))
                // $(".glance_ctn_responsive_left:first").append(furnishSteamSidebar(el.url+appName + el.urlSpecial, el.title, appName))
            })
        }
        if (steamDisplayCart) {
            allSteamButtons.forEach((el) => {
                $(".game_purchase_action_bg:first").append(furnishSteam(el.url+appName + el.urlSpecial, el.title))
            })
        }
        if (steamDisplaySidebar) {
          const sidebar = document.querySelector("#game_area_purchase");
          insertAddControl(sidebar, { marginTop: "10px" });
        }
        if (steamDisplayCart) {
          const cartCtn = document.querySelector(".cart_actions");
          insertAddControl(cartCtn, { marginTop: "10px" });
        }

        break;
    case "IGG":
        appName = $(".uk-article-title")[0].innerHTML.replace(" Free Download","");
        appName = appName.trim().replace(/[^a-zA-Z0-9 ]/g, '');
        const allIGGButtons = [...savedButtonSet, ...loadCustomSites()];
        allIGGButtons.forEach((el) => {
            $(".uk-article-meta")[0].append("  --  ")
            $(".uk-article-meta")[0].append(furnishIGG(el.url+appName, el.title))
        })
        break;
}

function furnishGOG(href, innerHTML) {
    let element = document.createElement("a");
    element.target= "_blank";
    element.style = "margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";
    element.classList.add("button");
    //element.classList.add("button--small");
    element.classList.add("button--big");
    element.classList.add("cart-button");
    element.classList.add("ng-scope");
    element.href = href;
    element.innerHTML= innerHTML;
    return element;
}
function furnishSteam(href, innerHTML) {
    let element = document.createElement("a");
    element.target= "_blank";
    element.style = "margin-left: 10px; padding-right: 10px;";
    element.href = href;
    element.innerHTML= innerHTML;
    return element;
}
function furnishSteamSidebar(searchUrl, appName, gameName) {
    // Create the main container div
    var devRowDiv = document.createElement('div');
    devRowDiv.className = 'dev_row pirate_row';

    // Create the subtitle div
    var subtitleDiv = document.createElement('div');
    subtitleDiv.className = 'subtitle column';
    subtitleDiv.innerHTML = appName + ':';

    // Create the summary div
    var summaryDiv = document.createElement('div');
    summaryDiv.className = 'summary column';

    // Create the anchor element
    var anchor = document.createElement('a');
    anchor.href = searchUrl;
    anchor.target = '_blank';
    // anchor.innerHTML = 'Search ' + appName + ' for ' + gameName;
    anchor.innerHTML = appName;

    // Append the anchor to the summary div
    summaryDiv.appendChild(anchor);

    // Append the subtitle and summary divs to the main container div
    devRowDiv.appendChild(subtitleDiv);
    devRowDiv.appendChild(summaryDiv);

    // Return the created element
    return devRowDiv;
}

function furnishIGG(href, innerHTML) {
    let element = document.createElement("a");
    element.target= "_blank";
    element.href = href;
    element.innerHTML= innerHTML;
    return element;
}



if (typeof GM_registerMenuCommand !== 'undefined') {

  GM_registerMenuCommand('Open Settings GUI', function(){
    openSettingsGui();
  });

  GM_registerMenuCommand('Reset settings', function(){
    GM_deleteValue("enableUnsafeButtonSet");
    GM_deleteValue("enabledButtonSet");
    GM_deleteValue("steamDisplaySidebar");
    GM_deleteValue("steamDisplayCart");
    GM_deleteValue("steamDisplayHub");
    GM_deleteValue("gogDisplaySidebar");
    GM_deleteValue("gogDisplayCart");
    location.reload();
  });
}