// ==UserScript==
// @name         Slickdeals+
// @namespace    V@no
// @description  Various enhancements, such as ad-block, price difference and more.
// @match        https://slickdeals.net/*
// @version      25.7.18
// @license      MIT
// @run-at       document-start
// @inject-into  auto
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474545/Slickdeals%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/474545/Slickdeals%2B.meta.js
// ==/UserScript==

((css, api) =>
{
"use strict";

console.log("Slickdeals+ is starting");
const VERSION = "25.7.18";
const CHANGES = `! side layout with hidden side column
! black text on dark background in changes log from menu`;
const linksData = {}; //Object containing data for links.
const processedMarker = "℗"; //class name indicating that the element has already been processed

/**
 * A function that reads and writes data to the browser's local storage.
 * @function
 * @param {string} id - The ID of the data to read or write.
 * @param {*} [value] - The value to write to the specified ID. If not provided, the function will read the value at the specified ID.
 * @returns void
 */
const SETTINGS = (() =>
{
	const LocalStorageName = "slickdeals+";
	const LocalStorageNameLinks = LocalStorageName + "links";
	// upgrade from v1.12
	const oldData = localStorage.getItem("linksCache");
	if (oldData)
	{
		localStorage.setItem(LocalStorageName, oldData);
		localStorage.removeItem("linksCache");
	}
	const sColor = "Background color";
	const defaultSettings = {
		freeOnly: { /* show free only */
			default: 0,
			name: "Free Only",
			description: "Only show free items",
		},
		diffOnly: { /* show highlighted difference only */
			default: 0,
			name: "Difference Only",
			description: "Only show highlighted price diff items",
		},
		ratingOnly: { /* show rating only */
			default: 0,
			name: "Score Only",
			description: "Only show highlighted score items",
		},
		hideSideColumn: {
			default: 0,
			name: "Hide Side Column",
			description: "Hide side column on main page (popular, trending deals, etc)",
		},
		resolveLinks: { /* use resolved links by default*/
			default: 1,
			name: "Resolve links",
			description: "Use resolved links\n* link and page url will be sent to 3nd party service",
			onChange: () => updateLinks()
		},
		noAds: { /* remove ads */
			default: 1,
			name: "Block ads",
			description: "Block ads (require page reload)",
		},
		debug: { /* debug mode: 0 = off, 1 = on, 2 = off and hide menu */
			default: 2,
			name: "Debug",
			description: "Show debug messages in the console",
		},
		highlightRating: { /* highlight deals with this minimum score */
			default: 0,
			type: "number",
			name: "Highlight score ≥",
			description: "Highlight items with minimum of this score",
			min: 0,
			onChange: () => highlightCards(),
		},
		css: {
			// eslint-disable-next-line unicorn/no-null
			default: null, // null = hidden
			type: "textarea",
			name: "Custom CSS",
			description: "Add custom CSS to the page",
			onChange: () => customCSS()
		},
		colorFreeBG: {
			default: "",
			type: "color",
			description: sColor,
			onChange: () => setColors()
		},
		colorRatingBG: {
			default: "",
			type: "color",
			description: sColor,
			onChange: () => setColors()
		},
		colorDiffBG: {
			default: "",
			type: "color",
			description: sColor,
			onChange: () => setColors()
		},
		priceFirst: {
			default: 0,
			name: "Price first",
			description: "Show price before title",
		},
		showDiff: {
			default: 1,
			name: "Price difference",
			description: "Show price/percent difference between current and original prices",
		},
		highlightDiff: { /* highlight deals with this minimum price difference percent */
			default: 0,
			name: "Highlight price diff ≥",
			description: "Highlight items with minimum of this price difference percent",
			type: "number",
			min: 0,
			max: 100,
			onChange: () => highlightCards(),
		},
		version: { /* placeholder */
			default: ""
		}
	};

	const settings = new Map();
	const links = new Map();
	for(const i in defaultSettings)
		settings.set(i, defaultSettings[i].default);

	try
	{
		const data = JSON.parse(localStorage.getItem(LocalStorageName));
		for(const i in data)
			settings.set(i, data[i]);
	}
	catch{}
	const isLink = /^\d/;
	try
	{
		const data = JSON.parse(localStorage.getItem(LocalStorageNameLinks));
		for(const i in data)
		{
			if (isLink.test(i))
				links.set(i, data[i]);
		}
	}
	catch{}
	/**
	 * Compares two version strings and returns -1, 0, or 1
	 * depending on whether the first version is less than, equal to, or greater than the second version.
	 *
	 * @function
	 * @see {@link https://jsfiddle.net/vanowm/p7uvtbor/ jsFiddle}
	 * @param {string} a - The first version string to compare.
	 * @param {string} b - The second version string to compare.
	 * @returns {number} -1 if a < b,
	 *                    0 if a == b,
	 *                    1 if a > b.
	 */
	const compareVersion = ((prep, length, i, result) =>
		(a, b) =>
		{
			a = prep(a);
			b = prep(b);
			length = Math.max(a.length, b.length);
			i = 0;
			result = i;
			while (!result && i < length)
				result = ~~a[i] - ~~b[i++];

			if (result < 0)
				return -1;

			return result ? 1 : 0;
		})(t => ("" + t)
		.replace(/[^\d.]+/g, c => "." + (c.replace(/[\W_]+/, "").toUpperCase().charCodeAt() - 65_536) + ".")
		.replace(/(?:\.0+)*(\.-\d+(?:\.\d+)?)\.*$/g, "$1")
		.split("."));

	const previousVersion = settings.get("version");
	const updated = !GM_info.isIncognito && previousVersion !== VERSION;
	if (updated && previousVersion)
	{
		//show debug option only if it was manually enabled in previous version
		if (compareVersion(previousVersion, "1.18.3") < 0)
		{
			settings.debug = settings.debug ? 1 : 2;
		}
		if (compareVersion(previousVersion, "1.15") < 0 && settings.has("resolvedClick"))
		{
			settings.set("resolveLinks", settings.get("resolvedClick"));
		}
		if (compareVersion(previousVersion, "23.10.4-205802") < 0)
		{
			if (settings.get("css") === "")
				// eslint-disable-next-line unicorn/no-null
				settings.set("css", null);

			if (settings.has("thumbsUp"))
				settings.set("highlightRating", settings.get("thumbsUp"));

		}
		if (compareVersion(previousVersion, "23.12.3-012211") < 0)
		{
			for(const [id,value] of settings)
			{
				if (isLink.test(id))
					links.set(id, value);
			}
		}
	}
	/* clean up old/invalid settings */
	for(const [id] of settings)
	{
		if (!Object.prototype.hasOwnProperty.call(defaultSettings, id))
			settings.delete(id);
		else if (defaultSettings[id].default !== null && typeof settings.get(id) !== typeof defaultSettings[id].default)
			settings.set(id, defaultSettings[id].default);
	}

	settings.set("version", VERSION);
	/**
	 * Initializes the user's settings by adding the appropriate class names to the HTML element.
	 * @function
	 * @returns {void}
	 */
	const settingsInit = () =>
	{
		const elHtml = document.documentElement;
		if (!elHtml)
			return document.addEventListener("DOMContentLoaded", settingsInit);

		for(const i in defaultSettings)
		{
			if (i === "version")
				continue;

			const value = settings.get(i);
			elHtml.classList.toggle(i, !!value);
			// elHtml.dataset[i] = value;
		}

		elHtml.classList.toggle("updated", updated);
		if (!updated || !previousVersion)
			return;

		// notification popup
		const elPopup = document.createElement("div");
		elPopup.textContent = GM_info.script.name + " updated from v" + previousVersion + " to v" + VERSION;
		elPopup.className = "sdp-updated";
		elPopup.addEventListener("click", () =>
		{
			const elMenu = document.querySelector(".sdp-menu");
			const elFooter = elMenu.querySelector(".footer");
			elFooter.click();
			elMenu.firstElementChild.focus();
		});
		const onClick = () =>
		{
			window.removeEventListener("click", onClick, true);
			elPopup.remove();
		};
		window.addEventListener("click", onClick, true);
		if (!document.body)
			return document.addEventListener("DOMContentLoaded", () =>
			{
				document.body.append(elPopup);
			});

		document.body.append(elPopup);
	};
	settingsInit();

	/**
	 * Returns a read-only proxy object that retrieves the value of a specific key from the default settings object.
	 *
	 * @param {string} key - The key to retrieve from the default settings object.
	 * @returns {Object} - A read-only proxy object that retrieves the value of the specified key from the default settings object.
	 */
	const settingsGetData = key => new Proxy(defaultSettings, {
		get: (target, name) => Reflect.get(target[name], key),
		set: () => true, //read-only
	});

	/**
	 * Resets all settings to their default values, except for the version number.
	 * @function
	 * @name settingsReset
	 */
	const settingsReset = () =>
	{
		for(const i in defaultSettings)
		{
			if (i !== "version")
				settings.set(i, defaultSettings[i].default);
		}

		settingsSave();
	};
	const defaultKeys = Object.keys(defaultSettings);
	/**
	 * Object containing various settings commands for the Slickdeals+ script.
	 * @typedef {Object} SettingsCommands
	 * @property {*} $default - The default value for the setting.
	 * @property {string} $type - The type of the setting.
	 * @property {string} $name - The name of the setting.
	 * @property {string} $description - The description of the setting.
	 * @property {*} $min - The minimum value for the setting.
	 * @property {*} $max - The maximum value for the setting.
	 * @property {function} $onChange - The function to be called when the setting is changed.
	 * @property {*} $keys - The default keys for the setting.
	 * @property {function} $reset - The function to reset the setting to its default value.
	 */
	const settingsCommands = {
		$default: settingsGetData("default"),
		$type: settingsGetData("type"),
		$name: settingsGetData("name"),
		$description: settingsGetData("description"),
		$min: settingsGetData("min"),
		$max: settingsGetData("max"),
		$onChange: settingsGetData("onChange"),
		$keys: defaultKeys,
		$links: new Proxy(links, {
			get: (target, name) => target.get(name),
			set: () => true, //read-only
		}),
		$reset: () => settingsReset()
	};
	let timer;
	let timeout;

	/**
	 * Saves the data in the cache to the browser's local storage.
	 * @function
	 * @param {number} [attempt=0] - The number of times the function has attempted to save the data.
	 */
	const settingsSave = (attempt = 0) =>
	{
		clearTimeout(timeout);
		const now = Date.now();
		if (timer + 300 > now)
		{
			timeout = setTimeout(() => settingsSave(attempt), 300);
			return;
		}
		try
		{
			// try save settings, if it fails, remove previous items until it succeeds
			localStorage.setItem(LocalStorageName, JSON.stringify(Object.fromEntries(settings)));
			localStorage.setItem(LocalStorageNameLinks, JSON.stringify(Object.fromEntries(links)));
		}
		catch
		{
			//removing in batches exponentially
			for(let i = 0, key, keys = links.keys(), count = ++attempt ** 2; i < count; i++)
			{
				do
				{
					key = keys.next().value;
				}
				while(key);

				links.delete(key);
			}

			if (attempt < 10_000)
				return settingsSave(attempt);

		}
		timer = now;
	};

	if (updated)
		settingsSave();

	/**
	 * Gets or sets a setting value and updates the UI accordingly.
	 * @param {string} id - The ID of the setting to get or set.
	 * @param {*} [value] - The value to set the setting to. If not provided, the current value of the setting is returned.
	 * @returns {boolean|*} - Returns `true` if the setting was successfully set, otherwise returns the current value of the setting.
	 */
	const settingsFunction = (id, value) =>
	{
		const storageData = isLink.test(id) ? links : settings;
		if (value === undefined)
			return storageData.get(id);

		storageData.set(id, value);
		if (defaultSettings[id]?.onChange instanceof Function)
			defaultSettings[id].onChange(value);

		document.documentElement.classList.toggle(id, !!value);
		settingsSave();
		return true;
	};
	return new Proxy((id, value) => settingsFunction(id, value),
		{
			get: (target, id) =>
			{
				if (Object.prototype.hasOwnProperty.call(settingsCommands, id))
					return settingsCommands[id];

				return target(id);

			},
			set: (target, id, value) => target(id, value)
		});
})();

/**
 * Creates a shallow copy of an object.
 *
 * @param {Object} object - The object to be cloned.
 * @returns {Object} - The cloned object.
 */
const CLONE = object => Object.assign({}, object);

/**
 * A function that does nothing and returns undefined.
 * @returns {undefined}
 */
const fVoid = () => {};

/**
 * Logs debug information to the console if debug mode is enabled.
 * @function
 * @property {function} trace - Outputs a stack trace to the console.
  * @param {...*} args - The arguments to log to the console.
 */
const debug = Object.assign(SETTINGS.debug === 1 ? console.log.bind(console) : fVoid
	, {trace: console.trace.bind(console)});
const debugPrefix = "%cSlickdeals+ ";

/**
 * Converts input into a string and trims whitespace.
 * @function
 * @param {string} t - The string to trim.
 * @returns {string} The trimmed string.
 */
const trim = t => ("" + t).trim();

/*------------[ ad blocking ]------------*/
/**
 * This code block defines a function that blocks ads on a webpage.
 * It overrides the `setAttribute`, `fetch`, and `open` methods to intercept requests and block ads if necessary.
 * It also overrides the specified properties and methods of a prototype to intercept requests and block ads if necessary.
 * The function checks if the `isNoAds` setting is enabled and if the element's `src` or `href` attribute matches an ad pattern.
 * If it does, the element is removed from the DOM.
 * The function also intercepts `fetch` and `XMLHttpRequest` requests and returns a 403 response if an ad is detected.
 * @function
 * @param {HTMLElement} parent - The HTML element to check for ads.
 * @returns {void}
 */
const noAds = (() =>
{
	const isNoAds = SETTINGS.noAds;
	const setAttributeProperty = Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute");
	Object.defineProperty(Element.prototype, "setAttribute", Object.assign(Object.assign({}, setAttributeProperty), {
		value: function (name, value)
		{
			if (isNoAds && (name === "src" && (this instanceof HTMLScriptElement
											|| this instanceof HTMLIFrameElement
											|| this instanceof HTMLImageElement))
						|| (name === "href" && this instanceof HTMLLinkElement))
			{
				const blocked = isNoAds ? isAds(value) : false;

				if (blocked)
				{
					debug(debugPrefix + (blocked ? "blocked" : "allowed") + "%c " + name,
						colors[~~blocked],
						colors[(this.tagName.toLowerCase() || "") + name],
						CLONE(isAds.result),
						value,
						this);

					this.remove();
					return;
				}
			}
			setAttributeProperty.value.call(this, name, value);
			if (name !== "href" || !(this instanceof HTMLAnchorElement))
				return;

			if (this._hrefResolved && this.href !== this._hrefResolved && this.href !== this._hrefOrig)
				linkUpdate(this, this.href, true);
			else if (SETTINGS.resolveLinks && !this.classList.contains("overlayUrl"))
				processLinks([this], true);
		},
	}));

	if (!isNoAds)
		return fVoid;

	const fetch = window.fetch;
	const open = XMLHttpRequest.prototype.open;

	/**
	 * Overrides the `fetch` method to intercept requests and block ads if necessary.
	 */
	window.fetch = function (...args)
	{
		const blocked = isNoAds ? isAds(args[0]) : false;
		if (blocked)
		{
			debug(debugPrefix + (blocked ? "blocked" : "allowed") + "%c fetch",
				colors[~~blocked],
				colors.fetch,
				CLONE(isAds.result),
				args,
			);

			return Promise.resolve(new Response("", {status: 403, statusText: "Blocked"}));
		}
		return Reflect.apply(fetch, this, args);
	};

	/**
	 * Overrides the `open` method of `XMLHttpRequest` to intercept requests and block ads if necessary.
	 */
	XMLHttpRequest.prototype.open = function (...args)
	{
		const blocked = isNoAds ? isAds(args[1]) : false;
		if (blocked)
		{
			debug(debugPrefix + (blocked ? "blocked" : "allowed") + "%c XHR",
				colors[~~blocked],
				colors.xhr,
				CLONE(isAds.result),
				args,
			);

			this.send = this.abort;
		}
		Reflect.apply(open, this, args);
	};

	/**
	 * Overrides the specified properties of a prototype to intercept requests and block ads if necessary.
	 * @function
	 * @param {Object} prototype - The prototype to override.
	 * @param {(string|string[])} aName - The name(s) of the property to override.
	 */
	const setProperty = (prototype, aName) =>
	{
		if (!Array.isArray(aName))
			aName = [aName];

		for (let i = 0; i < aName.length; i++)
		{
			const name = aName[i];
			const property = Object.getOwnPropertyDescriptor(prototype, name);

			Object.defineProperty(prototype, name, {
				get ()
				{
					return property.get.call(this);
				},
				set (value)
				{
					const _isNoAds = isNoAds && !this.closest(".dealCard");
					const isSource = name === "src";
					const blocked = _isNoAds ? isAds(isSource ? value : undefined, isSource ? undefined : value) : false;
					if (blocked)
					{
						debug(debugPrefix + (blocked ? "blocked" : "allowed") + " %c" + (isSource ? this.tagName.toLowerCase() + " " : "") + name,
							colors[~~blocked],
							colors[(name === "src" ? this.tagName.toLowerCase() : "") + name],
							CLONE(isAds.result),
							value,
							this
						);

						return;
					}
					property.set.call(this, value);
				},
				enumerable: property.enumerable || true,
				configurable: property.configurable || true
			});
		}
	};

	/**
	 * Returns a function that intercepts requests and blocks ads if necessary.
	 * @function
	 * @param {string} name - The name of the function.
	 * @param {Function} _function - The function to intercept.
	 * @returns {Function} The intercepted function.
	 */
	const getPrototypeFunction = (name, _function) => function (...args)
	{
		if (isNoAds && (args[0] instanceof HTMLImageElement
						|| args[0] instanceof HTMLScriptElement
						|| args[0] instanceof HTMLIFrameElement
						|| args[0] instanceof HTMLLinkElement))
		{
			for(let i = 0; i < args.length; i++)
			{
				const node = args[i];
				if (!node)// || (i && node instanceof HTMLHeadElement))
					continue;

				const blocked = isAds(node.src || node.href, node.innerHTML);

				if (blocked)
				{
					debug(debugPrefix + (blocked ? "blocked" : "allowed") + "%c DOM_" + name,
						colors[~~blocked],
						colors.dom,
						CLONE(isAds.result),
						node,
						this,
					);
					node.remove();
					args.splice(i--, 1);
				}
			}
		}
		try
		{
			return Reflect.apply(_function, this, args);
		}
		catch{}
	};

	/**
	 * Overrides the specified methods of a prototype to intercept requests and block ads if necessary.
	 * @function
	 * @param {Object} prototype - The prototype to override.
	 * @param {Object} names - An object containing the names of the methods to override.
	 */
	const setPrototype = (prototype, names) =>
	{
		for (let i = 0; i < names.length; i++)
		{
			const name = names[i];
			const property = Object.getOwnPropertyDescriptor(prototype, name);
			Object.defineProperty(prototype, name, {
				value: getPrototypeFunction(name, prototype[name]),
				enumerable: property.enumerable || true,
				configurable: property.configurable || true
			});
		}
	};
	setProperty(Element.prototype, ["innerHTML", "outerHTML"]);
	setProperty(HTMLScriptElement.prototype, "src");
	setProperty(HTMLIFrameElement.prototype, "src");
	setProperty(HTMLImageElement.prototype, "src");
	setProperty(HTMLLinkElement.prototype, "href");
	setProperty(HTMLAnchorElement.prototype, "href");
	setPrototype(Element.prototype, [
		"append",
		"prepend",
		"after",
		"before",
		"replaceWith",
		"replaceChildren",
		"insertAdjacentElement"
	]);
	setPrototype(Node.prototype, [
		"replaceChild",
		"insertBefore",
		"appendChild"
	]);

	// allow* supersedes block*
	const list = {
		allowUrlFull: new Set([]),

		allowHostname: [
			/:\/\/slickdeals\.net\//,
			// /.*/,
		],
		allowUrl: [
			/google\.com\/recaptcha\//,
			/fonts\.googleapis\.com/,
			// /accounts\.google\.com\//
			// /.*/,
		],
		allowText: [
			/vue\.createssrapp/i,
			/frontpagecontroller/i, //Personalized Frontpage
			/^\(window\.vuerangohooks = window\.vuerangohooks/i, //See expired deals
			/SECURITYTOKEN/, //voting
			/__NUXT__/,
			// /.*/,
		],

		blockUrlFull: new Set([
			"/ad-stats/1/ad-events",
			"https://v.clarity.ms/collect"
		]),
		blockHostname: [
			/google/,
			/videoplayerhub/i,
			/btttag/,
			/schemaapp\.com/,
		],
		blockUrl: [
			/\/providerv/,
			/\/ad-\//,
			/\.ad\./,
			/\/ads(srvr|\/)/,
			/\.quantcount/,
			/btttag/,
			/connect\.facebook/,
			/heapanalytics/,
			/click\./,
			/adsystem/,
			/bat\.bing/,
			/\.clarity\./,
			/hamburger\./,
			/liadm\.com/,
			/analytic/,
			/adsafe/,
			/pinterest\.com/,
			/s\.pinimg\.com/,
			/s\.yimg\.com/,
			/doubleclick/,
			/google\.com/,
			/clicktrue/
		],
		blockText: [
			/[.:-]ads(loader|[.:-])/i,
			/google\.com/,
			/facebook/,
			/heapanalytics/,
			/demdex/,
			/\.geq/,
			// /hydration/, //kills pagination
			/qualtrics/,
			/adsrvr\./,
			/announcementBar/ //top banner
		],
	};

	const colors = {
		0: "color:green", //allowed
		1: "color:red", //blocked
		fetch: "color:cyan",
		xhr: "color:#88f",
		script: "color:orange",
		scriptsrc: "color:orange",
		iframe: "color:#08f",
		iframesrc: "color:#08f",
		imgsrc: "color:#0f8",
		linkhref: "color:#0f8",
		dom: "color:#576",
		innerHTML: "color:#357",
		outerHTML: "color:#056",
		tracker: "color:#656",
	};

	/**
	 * Checks if the given text matches any of the regular expressions in the specified type's list.
	 * @function
	 * @param {string} text - The text to check.
	 * @param {string} type - The type of list to check against.
	 * @returns {boolean} True if the text matches any of the regular expressions in the list, false otherwise.
	 */
	const check = (text, type) =>
	{
		for(let i = 0, regex = list[type]; i < regex.length; i++)
		{
			const match = regex[i].exec(text);
			if (!match)
				continue;

			isAds.result.result = match;
			isAds.result.type = type;
			isAds.result.filter = regex[i];
			return true;
		}
		return false;
	};

	/**
	 * Determines if a URL or text content is an advertisement.
 	 * @function
	 * @param {string} url - The URL to check.
	 * @param {string} textContent - The text content to check.
	 * @returns {boolean} Whether the URL or text content is an advertisement.
	 */
	const isAds = Object.assign((_url, textContent) =>
	{
		let hostname = "";
		const url = _url instanceof Request ? _url.url : _url;
		try
		{
			hostname = url ? new URL(url).hostname : "";
		}
		catch
		{
			try
			{
				hostname = new URL(location.protocol + "//" + location.host + url).hostname;
			}
			catch(error)
			{
				debug.trace(url, error);
			}
		}
		const result = Object.assign(isAds.result, {filter: "", result: "", type: ""});

		if (list.allowUrlFull.has(url))
		{
			result.filter = url;
			result.result = url;
			result.type = "allowUrlFull";
			return false;
		}

		if (list.blockUrlFull.has(url))
		{
			result.filter = url;
			result.result = url;
			result.type = "blockUrlFull";
			return true;
		}

		if (hostname)
		{

			if (check(hostname, "allowHostname"))
				return false;

			if (check(url, "allowUrl"))
				return false;

			if (check(hostname, "blockHostname"))
				return true;

			if (check(url, "blockUrl"))
				return true;
		}
		if (check(textContent, "allowText"))
			return false;

		if (check(textContent, "blockText"))
			return true;

		result.result = "";
		result.filter = "";
		result.type = "";
		return false;
	}, {result: {filter:"", result: "", type: ""}});

	return parent =>
	{
		const nodes = [parent, ...parent.querySelectorAll("script,iframe,link,img")];
		for(let i = 0; i < nodes.length; i++)
		{
			const node = nodes[i];
			isAds.result.result = "";
			isAds.result.filter = "";
			isAds.result.type = "";
			if (node instanceof HTMLIFrameElement)
			{
				if (node.src && isAds(node.src))
				{
					debug(debugPrefix + "blocked%c iframe" + (isAds.result.type === "blockText" ? "" : " src"),
						colors[1],
						colors.iframe,
						CLONE(isAds.result),
						node.src,
						node
					);
					node.remove();
					continue;
				}
				// debug(debugPrefix + "allowed%c iframe", colors[0], colors.iframe, node.src, CLONE(isAds.result), node);
			}
			else if (node instanceof HTMLScriptElement && node.type !== "application/json")
			{
				const url = node.src;
				const textContent = node.textContent;
				if (isAds(url, textContent))
				{
					debug(debugPrefix + "blocked%c script" + (isAds.result.type === "blockText" ? "" : " src"),
						colors[1],
						colors.script,
						CLONE(isAds.result),
						url,
						[node],
						textContent,
					);
					node.remove();
					continue;
				}
				// debug(debugPrefix + "allowed%c script", colors[0], colors.script, url, textContent, CLONE(isAds.result));
			}
			else if ((node instanceof HTMLLinkElement || node instanceof HTMLImageElement) && node.href && isAds(node.href))
			{
				debug(debugPrefix + "blocked%c tracker" + (isAds.result.type === "blockText" ? "" : " src"),
					colors[1],
					colors.tracker,
					CLONE(isAds.result),
					node.href,
					node
				);
				node.remove();
				continue;
			}

			if (!node.matches)
				continue;

			if (node.matches(".ablock,.adunit"))
			{
				if (node.parentElement.matches(".subBoxContent"))
					node.parentElement.parentElement.remove();

				node.parentElement.remove();
			}
			else if (node.matches("[data-role=rightRailBanner],[class*=bannerAd],[class*=Banner],[class*=ad-],[class*=contentAd],[data-adlocation],[class*=_leftAd],[class*=_rightAd]"))
			{
				if (node.parentElement.matches(".searchPage__main") && node.matches("[class*=Banner]"))
					setTimeout(() => node.remove(), 0);
				else
					node.remove();
			}
		}
	};
})();
noAds(document);

const style = document.createElement("style");
style.innerHTML = css;
if (document.head)
	document.head.append(style);

// if (document.head)
// 	noAds(document.head);

// if (document.body)
// 	noAds(document.body);

/*------------[ end ad blocking ]------------*/

/**
 * Initializes the Slickdeals+ menu.
 * @function
 * @param {HTMLElement} elNav - The navigation element to use as the menu container.
 */
const initMenu = elNav =>
{
	if (initMenu._inited)
		return;

	initMenu._inited = true;
	if (elNav.children.length < 4 && --initMenu.counter)
		return setTimeout(() => initMenu(elNav), 0);

	/**
	 * Creates a menu item for a user setting.
	 * @function
	 * @param {string} id - The ID of the setting to create a menu item for.
	 * @returns {Element} The menu item element.
	 */
	const createMenuItem = (id, options = {}) =>
	{
		const type = SETTINGS.$type[id];
		const label = SETTINGS.$name[id];
		const description = SETTINGS.$description[id];
		const elStyle = document.createElement("style");
		const types = {
			text : "input",
			color : "input",
			number : "input",
			textarea : "textarea",
			checkbox : "a",
			radio : "a"
		};
		const elSetting = document.createElement(types[type] || "a");
		const elLi = elLiDefault.cloneNode(true);
		let elLabelBefore;
		let elLabelAfter;
		const events = {};
		switch (type)
		{
			case "number": {
				elSetting.value = SETTINGS(id);
				elSetting.type = "number";
				elSetting.min = SETTINGS.$min[id] || 0;
				elSetting.step = 1;
			//only allow positive round numbers
				events.keypress = evt =>
				{
					if (evt.charCode < 48 || evt.charCode > 57)
					{
						evt.preventDefault();
						evt.stopPropagation();
					}
				};
				events.input = () => SETTINGS(id, ~~elSetting.value);
				if (SETTINGS.$max[id] !== undefined)
				{
					elSetting.max = SETTINGS.$max[id];
					const length_ = ("" + elSetting.max).length;
					elSetting.style.width = (length_ * 2) + "ch";
				}

				elLabelBefore = document.createElement("span");
				elLabelBefore.textContent = label;
				elLi.classList.add("input");

				break;
			}
			case "text": {
				elSetting.type = "text";
				elSetting.value = SETTINGS(id);
				elLabelBefore = document.createElement("span");
				elLabelBefore.textContent = label;
				elLi.classList.add("input");
				let timer;
				events.input = () =>
				{
					clearTimeout(timer);
					timer = setTimeout(() => SETTINGS(id, elSetting.value.trim()), 500);
				};

				break;
			}
			case "color": {
				// elSetting.type = "color";
				const settingValue = SETTINGS(id);
				if (settingValue)
				{
					elSetting.value = settingValue;
					elSetting.type = "color";
				}
				else
				{
					elSetting.type = "_color";
					elSetting.placeholder = "default color";
					elSetting.disabled = true;
				}

				if (label)
				{
					elLabelBefore = document.createElement("span");
					elLabelBefore.textContent = label;
				}
				elLi.classList.add("input");
				const elColorClose = $$("colorClose") || document.createElement("span");
				if (!elColorClose.parentNode)
				{
					elColorClose.id = "colorClose";
					elColorClose.addEventListener("mousedown", evt =>
					{
						evt.preventDefault();
						evt.stopPropagation();
						document.body.classList.remove("colorClose");
					});
					elUl.prepend(elColorClose);
				}
				events.click = () =>
				{
					document.body.classList.add("colorClose");
				};
				elLabelAfter = document.createElement("label");
				elLabelAfter.setAttribute("for", id);
				elLabelAfter.classList.add("reset");
				elLabelAfter.title = "Reset to default";
				const resetHide = state => elLabelAfter.classList.toggle("hidden", state);
				events.reset = evt =>
				{
					evt.preventDefault();
					evt.stopPropagation();
					if (evt.isTrusted)
						SETTINGS(id, "");

					elSetting.value = setColors.get(id);
					elSetting.type = "color";
					elSetting.disabled = false;
					elSetting.dataset.default = elSetting.value;
					resetHide(SETTINGS(id) === "");
				};
				elLabelAfter.addEventListener("click", events.reset);
				let timer;
				events.input = () =>
				{
					clearTimeout(timer);
					let value = elSetting.value.trim();
					if (elSetting.dataset.default === value)
						value = "";

					resetHide(value === "");

					timer = setTimeout(() => SETTINGS(id, value), 500);
				};
				resetHide(SETTINGS(id) === "");
				break;
			}
			case "textarea": {
				elSetting.setAttribute("autocorrect", "false");
				elSetting.setAttribute("spellcheck", "false");

				elLabelBefore = document.createElement("div");
				elLabelBefore.textContent = label;
				elSetting.value = SETTINGS(id);
				events.input = () => SETTINGS(id, elSetting.value.trim());

				break;
			}
			default: { //checkbox
				elSetting.value = SETTINGS(id);
				elSetting.textContent = label;
				events.click = () => SETTINGS(id, ~~!SETTINGS(id));
				events.keypress = evt =>
				{
					if (evt.key === " " || evt.key === "Enter")
					{
						evt.preventDefault();
						evt.stopPropagation();
						SETTINGS(id, ~~!SETTINGS(id));
					}
				};
				elStyle.textContent = `html.${id} #${id}::before{content:"☑";}`;
				elSetting.classList.add("slickdealsHeaderDropdownItem__link");
			}
		}
		options = Object.assign({events}, options);

		for(const eventType in options.events)
		{
			elSetting.addEventListener(eventType, options.events[eventType]);
		}
		// elSetting.value = SETTINGS(id);
		elSetting.id = id;
		elSetting.setAttribute("tabindex", 0);
		elSetting.dataset[dataset] = "";
		elLi.classList.add(id);
		elLi.title = description;

		if (options.labelBefore)
		{
			if (!elLabelBefore)
				elLabelBefore = document.createElement("span");

			elLabelBefore.textContent = options.labelBefore;
		}
		if (elLabelBefore)
			elLi.append(elLabelBefore);

		elLi.append(elSetting);

		if (options.labelAfter)
		{
			if (!elLabelAfter)
				elLabelAfter = document.createElement("span");

			elLabelAfter.textContent = options.labelAfter;
		}
		if (elLabelAfter)
			elLi.append(elLabelAfter);

		document.head.append(elStyle);
		return elLi;
	};//createMenuItem

	const elMenu = elNav.lastElementChild.cloneNode(true);
	initMenu.elMenu = elMenu;
	datasets.__target.push(elMenu.dataset, elMenu.querySelector(".slickdealsHeader__navItemText").dataset);
	initMenu.elHeader = elNav;
	const elHeader = elNav.closest("header");
	const elOverlay = document.createElement("div");
	initMenu.elOverlay = elOverlay;
	for (const i in elMenu.dataset)
	{
		if (/^v-\d|^v[A-F]/.test(i))
			elOverlay.dataset[i] = elMenu.dataset[i];
	}
	initMenu.elOverlay.className = "slickdealsHeader__overlay";

	elMenu.classList.add("sdp-menu");
	elMenu.dataset.qaHeaderDropdownButton = "slickdeals-plus";
	elMenu.querySelector("p").textContent = "Slickdeals+";
	const elUl = elMenu.querySelector("ul");
	const elButton = elMenu.querySelector("div[role='button']");

	elButton.addEventListener("focus", () => elHeader.after(elOverlay), true);
	elButton.addEventListener("blur", () => elOverlay.remove(), true);
	elMenu.addEventListener("mousedown", evt =>
	{
		const isMenu = evt.target === elButton || evt.target.parentElement === elButton;
		const isMenuOpen = (document.activeElement.closest(".sdp-menu > div[role='button']") || {}) === elButton;

		if (isMenu && isMenuOpen)
		{
			evt.preventDefault();
			evt.stopPropagation();
			elOverlay.click();
		}
	});
	elOverlay.addEventListener("click", () =>
	{
		elButton.focus();
		elButton.blur();
		elOverlay.remove();
	});
	const loading = document.documentElement.dataset.loading;

	elUl.dataset.qaHeaderDropdownList = "slickdeals-plus";
	const elLiDefault = elUl.querySelector("li").cloneNode(true);
	const dataset = Object.keys(elLiDefault.firstElementChild.dataset)[0];
	elUl.innerHTML = "";
	elLiDefault.innerHTML = "";
	elNav.append(elMenu);

	const elFreeOnly = createMenuItem("freeOnly");
	elFreeOnly.append(createMenuItem("colorFreeBG"));
	elUl.append(elFreeOnly);
	const elMenuItem = createMenuItem("resolveLinks");
	if (loading)
	{
		elMenu.dataset.loading = loading;
		elMenuItem.dataset.loading = loading;
	}
	elUl.append(elMenuItem);
	elUl.append(createMenuItem("priceFirst"));
	elUl.append(createMenuItem("showDiff"));
	// elUl.append(createMenuItem("diffOnly"));
	const elHighlightDiff = createMenuItem("highlightDiff", {labelAfter: "%"});
	elHighlightDiff.append(createMenuItem("colorDiffBG"));
	elUl.append(elHighlightDiff);
	// elUl.append(createMenuItem("ratingOnly"));
	const elHighlightRating = createMenuItem("highlightRating");
	elHighlightRating.append(createMenuItem("colorRatingBG"));
	elUl.append(elHighlightRating);
	elUl.append(createMenuItem("noAds"));
	elUl.append(createMenuItem("hideSideColumn"));
	if (SETTINGS.debug < 2)
		elUl.append(createMenuItem("debug"));

	if (SETTINGS.css !== null)
	{
		elUl.append(createMenuItem("css", {
			events: {
				input: evt =>
				{
					clearTimeout(customCSS.timeout);
					customCSS.timeout = setTimeout(() =>
					{
						SETTINGS.css = evt.target.value;
					}, 1000);
				},
				keydown: evt =>
				{
					if (evt.key !== "Tab")
						return;

					const target = evt.target;
					evt.preventDefault();
					let start = target.selectionStart;
					const end = target.selectionEnd;
					target.value = target.value.slice(0, start)	+ "\t" + target.value.slice(end);
					target.selectionStart = ++start;
					target.selectionEnd = start;
				}
			}
		}));
	}

	const elFooter = document.createElement("label");
	elFooter.className = "slickdealsHeaderDropdownItem footer";
	elFooter.setAttribute("for", "sdpChanges");
	elFooter.dataset.label = "v" + VERSION;
	elFooter.title = "Changes";
	elFooter.dataset[dataset] = "";

	const elFooterCheckbox = document.createElement("input");
	elFooterCheckbox.id = "sdpChanges";
	elFooterCheckbox.type = "checkbox";

	const elChanges = document.createElement("span");
	elChanges.className = "changes";
	const changes = CHANGES.split("\n");
	const types = {
		"!": "fixed",
		"*": "changed",
		"+": "added",
		"-": "removed",
		"#": "comment",
		"?": "help"
	};
	for(let i = 0, elDiv = document.createElement("div"); i < changes.length; i++)
	{
		if (changes[i] === "")
			continue;

		const type = types[changes[i][0]] ? changes[i][0] : "+";
		const className = types[type];
		const text = changes[i][0] === type ? changes[i].slice(1) : " " + changes[i];
		elDiv = elDiv.cloneNode(false);
		elDiv.className = className;
		if (className)
			elDiv.title = className[0].toUpperCase() + className.slice(1);

		elDiv.textContent = text;
		elChanges.append(elDiv);
	}

	const elChangesLink = document.createElement("a");
	elChangesLink.className = "changesLink";
	elChangesLink.href = "https://vanowm.github.io/slickdealsPlus/CHANGES.html";
	elChangesLink.target = "_blank";
	elChangesLink.textContent = "more";

	elChanges.append(elChangesLink);
	elUl.append(elFooterCheckbox, elFooter, elChanges);
	if (document.readyState === "complete")
		setColors.update();
	else
		document.addEventListener("readystatechange", () =>
		{
			if (document.readyState === "complete")
				setColors.update();
		}, false);
};
initMenu.counter = 1000;

/**
 * Set dataset values to multiple elements at once.
 *
 * @type {Proxy}
 */
const datasets = new Proxy([document.documentElement.dataset], {
	get: (target, property) => (property === "__target" ? target : target[0][property]),
	set: (target, property, value) =>
	{
		for(let i = 0; i < target.length; i++)
			target[i][property] = value;

		return true;
	},
	deleteProperty: (target, property) =>
	{
		for(let i = 0; i < target.length; i++)
		{
			if (property in target[i])
				delete target[i][property];
		}

		return true;
	}
});

/**
 * Returns the first element that is a descendant of node that matches selectors.
 * @function
 * @param {string} id - The ID of the element to find.
 * @param {HTMLElement} node - The root node to search for the element.
 * @param {boolean} all - Whether to return all elements that match the selector.
 * @returns {HTMLElement|NodeList} The first element that matches the selector, or a NodeList of all elements that match the selector.
 */
const $$ = (id, node, all) =>
{
	try
	{
		if (!node)
			node = document;

		if (!all && /\w/.test(id[0]))
			return node.getElementById(id);

		if (all)
			return node.querySelectorAll(id);

		return node.querySelector(id);
	}
	catch
	{}
};

const setColors = (ids =>
{
	const elHidden = document.createElement("div");
	elHidden.style.display = "none";
	for(let i = 0; i < ids.length; i++)
	{
		const elColor = document.createElement("div");
		elColor.className = ids[i];
		elHidden.append(elColor);
	}
	document.addEventListener("DOMContentLoaded", () => document.body.append(elHidden), false);
	return Object.assign(() =>
	{
		for(let i = 0; i < ids.length; i++)
		{
			const id = ids[i];
			const value = SETTINGS(id);
			if (value === "" || value === undefined)
				document.body.style.removeProperty("--" + id);
			else
				document.body.style.setProperty("--" + id, value);

		}
	},
	{
		get: id => getComputedStyle(elHidden.querySelector("." + id))
			.getPropertyValue("--backgroundColor"),

		update: () =>
		{
			for(let i = 0; i < ids.length; i++)
			{
				const id = ids[i];
				//only trusted reset event triggers the reset, otherwise it simply updates the color
				$$(id).dispatchEvent(new Event("reset"));
			}
		},
	});
})(["colorFreeBG", "colorRatingBG", "colorDiffBG"]);

const elMenu = document.querySelector(".slickdealsHeader__hamburgerDropdown .slickdealsHeader__linkSection");
if (elMenu)
	initMenu(elMenu);

/**
 * MutationObserver callback function that tracks changes in the DOM.
 * @function
 * @param {MutationRecord[]} mutations - An array of MutationRecord objects representing the changes in the DOM.
 */
new MutationObserver(mutations =>
{
	for (let i = 0; i < mutations.length; i++)
	{
		for (let n = 0; n < mutations[i].addedNodes.length; n++)
		{
			const node = mutations[i].addedNodes[n];

			if (!node.classList)
				continue;

			// remove ads
			if (SETTINGS.noAds && !node.closest(".dealCard"))
				noAds(node);

			//have we already processed this node?
			if (node.classList.contains(processedMarker))
				continue;

			// create menu and attach to the header
			if (node.matches(".slickdealsHeader__hamburgerDropdown .slickdealsHeader__linkSection"))
			{
				initMenu(node);
				continue;
			}
			processCards(node);
			processLinks(node);
		}
		// for some reason attached menu is being removed...reattach it back if necessary
		for(let n = 0; n < mutations[i].removedNodes.length; n++)
		{
			if (mutations[i].removedNodes[n] === initMenu.elMenu)
				initMenu.elHeader.append(initMenu.elMenu);

		}
	}
}).observe(document, {
	subtree: true,
	childList: true
});

/**
 * Divides a price by a specified divider and formats it as a string with a dollar sign and two decimal places.
 * @function
 * @param {string} _text - The text to prepend to the formatted price.
 * @param {string} divider - The value to divide the price by.
 * @param {string} price - The price to divide and format.
 * @returns {string} The formatted price with the specified text prepended to it.
 */
const priceDivide = (_text, divider, price) => "$" + (Number.parseFloat(price.replace(/,/g, "") / Number.parseFloat(divider))).toFixed(2);

/**
 * Extracts pricing information from a given node and its children.
 * @function
 * @param {HTMLElement|NodeList} node - The root node or NodeList to search for pricing information.
 * @param {boolean} [force=false] - Whether to force processing of already processed items.
 * @returns void
 */
const processCards = (node, force) =>
{
	const processed = force ? "" : ":not(." + processedMarker + ")";
	const nlItems = node instanceof NodeList
		? node
		: $$(	`.salePrice${processed},` +
				`.itemPrice${processed},` +
				`.price${processed},` + //search
				`.bp-p-dealCard_price${processed},` + // https://slickdeals.net/deals/watches/
				`.dealCard__price${processed},` +
				`.dealDetailsMainDesktopBlock__finalPrice${processed},` +
				`.dealPrice${processed}`
		, node, true) || [];

	if (nlItems.length === 0)
		return;

	const rePrice = /^[\s\w]*~?\$/;
	const rePriceFrom = /^(?:from\s)?(\d+)\sfor\s\$?([\d,.]+)/g;
	const rePriceCommas = /,/g;
	const rePriceTrim = /[\s\w]*~?\$([\d,.]+)(?:\s.*)?/;
	const rePriceFree = /free/;
	const rePricePrice = /^[\s\w]*~?\$([\d,.]+)/;
	const rePriceOff = /(?:\$?([\d,.]+))?\soff(?:\s\$?([\d,.]+))?$/;
	for (let i = 0; i < nlItems.length; i++)
	{
		const elPrice = nlItems[i];
		elPrice.title = elPrice.textContent;
		let elParent = elPrice.parentNode;
		const price = trim(elPrice.textContent).toLowerCase();
		let priceNew = Number.NaN;
		if (price)
		{
			if (price === "free")
				priceNew = 0;
			else if (rePrice.test(price))
			{
				priceNew = Number.parseFloat(price
					.replace(rePriceFrom, priceDivide) // 2 for $10
					.replace(rePriceTrim, "$1") // remove everything after first number ($xx off $yy)
					.replace(rePriceCommas, "")); // remove commas
			}

		}
		const elPriceRetail = $$(".retailPrice", elParent);
		const elPriceOld = $$(".oldListPrice, .dealCard__originalPrice, .bp-p-dealCard_originalPrice, .dealDetailsMainDesktopBlock__listPrice", elParent);
		// make sure price element is in it's own wrapper
		if (elParent.matches(".bp-c-card_content, .dealDetailsPriceInfo"))
		{
			const elWrapper = document.createElement("div");
			elWrapper.className = "cardPriceInfo";
			elWrapper.append(elPrice);
			if (elPriceOld)
				elWrapper.append(elPriceOld);

			if (elPriceRetail)
				elWrapper.append(elPriceRetail);

			elParent.prepend(elWrapper);
			elParent = elWrapper;
		}
		const priceRetail = Number.parseFloat(trim((elPriceRetail || {}).textContent)
			.replace(rePricePrice, "$1")
			.replace(rePriceCommas, ""));

		const priceOld = Number.parseFloat(trim((elPriceOld || {}).textContent)
			.replace(rePricePrice, "$1")
			.replace(rePriceCommas, ""));

		const off = price.match(rePriceOff);
		const priceOrig = Number.parseFloat(off && off[2]);
		const priceBase = priceRetail || priceOld || priceOrig;
		if (priceBase && off)
			priceNew = priceBase - priceNew;

		const priceFree = price && price.match(rePriceFree) || priceNew === 0;
		const priceDifference = priceBase - priceNew;
		const priceDealPercent = Math.round(priceDifference * 100 / priceBase);
		const elCard = elParent.closest(
			"li," +
			"div[data-type='fpdeal']," +
			"div.resultRow," +
			"div[data-role='frontpageDealContent']"
		);

		if (!Number.isNaN(priceDealPercent))
		{
			const diff = priceDifference.toFixed(2).replace(/\.00$/, "");
			elParent.dataset.dealDiff = diff;
			elParent.dataset.dealPercent = priceDealPercent;
			if (elCard)
			{
				elCard.dataset.dealDiff = diff;
				elCard.dataset.dealPercent = priceDealPercent;
			}
			elParent.title = "Save $" + diff + " (" + priceDealPercent + "%)";
		}
		elPrice.classList.add(processedMarker);

		if (elCard)
		{
			elCard.classList.toggle("free", priceFree);
			highlightCards(elCard);
		}
	}
};

/**
 * Highlights the cards with a certain number of votes.
 * @function
 * @param {NodeList|Element} node - The node or NodeList to search for cards.
 * @returns {void}
 */
const highlightCards = node =>
{
	let nlItems;
	if (node instanceof NodeList)
		nlItems = node;
	else if (node instanceof Element)
		nlItems = [node];
	else
		nlItems = $$(	"li.frontpageGrid__feedItem," + //front page
						"li.carousel__slide," + // front page carousel
						"li.categoryPageDealGrid__feedItem," + // https://slickdeals.net/deals/
						"li.bp-p-dealCard," + // https://slickdeals.net/deals/watches/
						"div.resultRow" //search result
		, node, true);

	if (nlItems.length === 0)
		return;

	const highlightDiff = SETTINGS.highlightDiff;
	for(let i = 0; i < nlItems.length; i++)
	{
		const elCard = nlItems[i];
		const elVotes = elCard.querySelector(
			".dealCardSocialControls__voteCount," + //front page
			".bp-p-votingThumbsPopup_voteCount," + // https://slickdeals.net/deals/watches/
			".ratingCol.stats>.num," + //search result
			".ratingCol>.ratingNum" //search result
		);
		if (elVotes && elVotes.textContent !== "")
		{
			const votes = Number.parseInt(elVotes.textContent || 0);
			elCard.classList.toggle("highlightRating", SETTINGS.highlightRating && votes > 0 && votes >= SETTINGS.highlightRating);
		}
		if (elCard.dataset.dealPercent)
		{
			const dealPercent = ~~elCard.dataset.dealPercent;
			elCard.classList.toggle("highlightDiff", highlightDiff && dealPercent >= highlightDiff);
		}
	}
};

/**
 * Fixes links on a given node by replacing the href with a new URL based on the deal ID and type.
 * @function
 * @param {HTMLElement|NodeList} node - The root node or NodeList to search for links to fix.
 * @param {boolean} [force=false] - Whether to force processing of already processed links.
 * @returns {void}
 */
const processLinks = (node, force) =>
{
	const processed = force ? "" : `:not(.${processedMarker})`;
	const nlLinks = node instanceof NodeList || Array.isArray(node) ? node : $$(`a:not([href=""])${processed}:not(.overlayUrl)`, node, true) || [];
	for(let i = 0; i < nlLinks.length; i++)
	{
		const elLink = nlLinks[i];

		if (!elLink.href || (elLink._hrefResolved && !force))
			continue;

		elLink.classList.add(processedMarker);
		// const {id, type} = getUrlInfo(elLink.href) || {};
		const urlObject = new URL(elLink.href);
		const id = getUrlId(urlObject);
		if (!id)
			continue;

		const queryObject = new URLSearchParams(urlObject.search);
		if (!elLink._elHover)
		{
			const elHover = document.createElement("a");
			elHover.classList.add(processedMarker, "overlayUrl", "hidden");
			elHover.title = "Original link";
			elHover.target = elLink.target;
			elLink._elHover = elHover;
			elLink.append(elHover);
		}
		elLink._hrefOrig = elLink.href;
		elLink._elHover.href = elLink.href;
		// const u2 = elLink.href.match(/(?:\?|&(?:amp;)?)u2=([^#&]*)/i);
		let url = queryObject.has("u2") ? decodeURIComponent(queryObject.get("u2")) : SETTINGS(id);

		const aLinks = linksData[id] || [elLink];
		const isInited = aLinks.resolved !== undefined;
		if (isInited)
		{
			if (!aLinks.includes(elLink))
				aLinks.push(elLink);
		}
		else
		{
			aLinks.resolved = false;
			linksData[id] = aLinks;
		}

		// if (!elLink._hrefResolved)
		// {
		// 	elLink.classList.add("alert");
		// }
		if (url)
		{
			if (Array.isArray(url))
				url = url[0];

			aLinks.resolved = true;
			linkUpdate(elLink, url, force);
			continue;
		}
		if (isInited && !force)
			return;

		elLink.classList.add("notResolved");
		if (!SETTINGS.resolveLinks)
			return;

		if (datasets.loading === undefined)
			datasets.loading = 0;

		datasets.loading++;

		/**
		 * Resolves a URL
		 * @function
		 * @param {string} id - The ID of the deal to resolve.
		 * @param {string} url - The URL to resolve.
		 * @returns {Promise<Object>} A Promise that resolves to an object containing the resolved URL and other data.
		 */
		resolveUrl(id, elLink._hrefOrig)
			.then(response =>
			{
				if (!response || response instanceof Response || response.byteLength === 0)
					throw new Error("URL not resolved " + (response instanceof Response ? response.headers.get("error") : "")/* + " id:" + id + " original:" + elLink._hrefOrig*/);

				response = new Uint8Array(response);
				const k = new TextEncoder().encode(id);
				const r = new Uint8Array(response.length)
					.map((_, i) => response[i] ^ response[i - 1] ^ k[i % k.length]);

				response = new TextDecoder().decode(r.slice(r.indexOf(0) + 1));
				// console.log(id, response);
				try
				{
					if (!/^https?:\/\//.test(response))
						return;

					SETTINGS(id, response);
					for(let i = 0; i < aLinks.length; i++)
						linkUpdate(aLinks[i], response);

					aLinks.resolved = true;
				}
				catch{}
				return response;
			})
			.finally(() =>
			{
				if (!--datasets.loading)
					delete datasets.loading;

			})
			.catch(console.error);
	}
};

/**
 * Updates a link with a new URL and styling to indicate that it has been resolved.
 * @function
 * @param {HTMLAnchorElement} elA - The link to update.
 * @param {string} url - The new URL to set on the link.
 * @returns {void}
 */
const linkUpdate = (elA, url, update) =>
{
	// elA.classList.remove("alert");
	if (elA._hrefResolved && !update)
		return;

	if (url)
		elA._hrefResolved = url;

	elA.classList.toggle("notResolved", !elA._hrefResolved);
	const elHover = elA.querySelector("a.overlayUrl");
	if (SETTINGS.resolveLinks && elA._hrefResolved)
	{
		if (elHover)
		{
			elHover.title = "Original link";
			elHover.href = elA._hrefOrig;
			elHover.classList.remove("hidden");
		}
		elA.href = elA._hrefResolved;
		elA.classList.add("resolved");
		elA.classList.remove("tracked");
	}
	else
	{
		if (elHover)
		{
			elHover.classList.toggle("hidden", !elA._hrefResolved);
			elHover.title = "Resolved link";
			elHover.href = elA._hrefResolved;
		}
		elA.href = elA._hrefOrig;
		elA.classList.add("tracked");
		elA.classList.remove("resolved");
	}
	// a.title = a._hrefResolved;
};

/**
 * Updates links on the page based on the current settings.
 * If resolveLinks is enabled, it processes all unresolved links on the page.
 * Otherwise, it updates all links in the linksData object.
 */
const updateLinks = () =>
{
	if (SETTINGS.resolveLinks)
	{
		const nlList = $$(".notResolved", document.body, true);
		if (nlList.length > 0)
			processLinks(nlList, true);
	}
	for(const id in linksData)
	{
		const aLinks = linksData[id];
		for(let i = 0; i < aLinks.length; i++)
		{
			linkUpdate(aLinks[i], undefined, true);
		}
	}
};

/**
 * Resolves a given URL by fetching data from the Slickdeals API and updating all links with the same deal ID.
 * @function
 * @param {string} id - The ID of the deal to resolve.
 * @param {string} type - The type of the deal to resolve.
 * @param {string} url - The URL to resolve.
 * @returns {Promise} A Promise that resolves with the data returned from the Slickdeals API.
 */
const resolveUrl = (id, url) => fetch(api + VERSION + "/" + id, {method: "SD", body: JSON.stringify([url,location.href]), referrerPolicy: "unsafe-url"})
	.then(r => r && r.ok && r.arrayBuffer() || r)
	.catch(fVoid);

/**
* Extracts the ID and type of a deal from a given URL.
 * @function
 * @param {string} url - The URL to parse.
 * @returns {string} - ID of the resource
 */
const getUrlId = (() =>
{
	const ids = ["pno", "sdtid", "tid", "pcoid", "lno"];
	const count = ids.length;
	return urlObject =>
	{
		if (urlObject.hostname !== "slickdeals.net")
			return false;

		const queryObject = new URLSearchParams(urlObject.search);

		let id = "";
		for (let i = 0; i < count; i++)
		{
			const key = ids[i];
			if (queryObject.has(key))
				id += queryObject.get(key) + key;
		}
		if (/^\d+lno$/.test(id) || id === "" && urlObject.pathname === "/click")
		{
			queryObject.delete("u3");
			// prepend 0 if hex string used,
			// otherwise it will be ignored.
			id = 0 + crc32(queryObject.toString()) + "crc";
		}
		return id;
	};
})();
/**
 * Injects custom CSS into the document.
 *
 * @function
 * @returns {void}
 */
const customCSS = (elStyle => () =>
{
	elStyle.textContent = SETTINGS.css;
	document.body.append(elStyle);
})(document.createElement("style"));

/**
 * This function fixes the CSS by replacing the data-v-ID attribute with a data-* attribute that matches the ID of the element.
 * @function
 * @returns {void}
 */
const fixCSS = () =>
{
	const reCssFindId = /^v([A-F]|-\d)/;
	const cssFindId = reCssFindId.test.bind(reCssFindId);
	style.innerHTML = css.replace(/^(.*)\[data-v-ID]/gm, (txt, query) =>
	{
		const element = document.body.querySelector(query);
		if (element)
		{
			const keys = Object.keys(element.dataset);
			const id = keys.find(cssFindId);
			if (id)
				return query + "[data-" + id.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() + "]";
		}
		return query;
	});

};

// crc32.js
// Copyright (c) 2014 Stephan Brumme. All rights reserved.
// see http://create.stephan-brumme.com/disclaimer.html
//
const crc32 = text =>
{
  // CRC32b polynomial
	const Polynomial = 0xED_B8_83_20;
  // start value
	let crc = 0xFF_FF_FF_FF;
	for (let i = 0; i < text.length; i++)
	{
		// XOR next byte into state
		crc ^= text.charCodeAt(i);
		// process 8 bits
		for (let bit = 0; bit < 8; bit++)
		{
		// look at lowest bit
			crc = (crc & 1) === 0 ? crc >>> 1 : (crc >>> 1) ^ Polynomial;
		}
	}
	// return hex string
	let what = ~crc;
	// adjust negative numbers
	if (what < 0)
		what = 0xFF_FF_FF_FF + what + 1;

	return what;
	// // convert to hexadecimal string
	// const result = what.toString(16);
	// // add leading zeros
	// return ("0000000" + result).slice(-8);
};

/**
 * The main function that initializes the Slickdeals+ script.
 * @function
 * @returns {void}
 */
const init = () =>
{
	document.removeEventListener("DOMContentLoaded", init, false);

	const darkModeClasses = ["bp-s-darkMode", "midnight"];
	const _isDarkMode = () => darkModeClasses.some(className => document.body.classList.contains(className));
	document.body.classList.toggle("darkMode", _isDarkMode());
	const observer = new MutationObserver(mutations =>
	{
		for (const mutation of mutations)
		{
			if (mutation.type === "attributes")
			{
				document.body.classList.toggle("darkMode", _isDarkMode());
			}
		}
	});
	observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

	fixCSS();
	window.addEventListener("load", fixCSS, false);
	document.head.append(style);

	//for some reason observer failed to process everything while page is still loading, so we do it manually
	const elPageContent = $$("pageContent");
	if (elPageContent)
	{
		processCards(elPageContent);
		processLinks(elPageContent);
	}
	customCSS();
	setColors();
	debug(GM_info.script.name, "v" + VERSION, "initialized");
};//init()

document.addEventListener("DOMContentLoaded", init, false);
})(`:root
{
	--colorMix: in srgb;
}

a.resolved:not(.seeDealButton):not(.button.success):not(.dealDetailsOutclickButton)
{
	color: #00b309;
}

.dealDetailsOutclickButton[data-v-ID].resolved,
body.bp-s-darkMode .dealDetailsOutclickButton[data-v-ID].resolved,
.seeDealButton.resolved
{
	--buttonBackgroundColor: #0c9144;
	--dealDetailsOutclickButtonBgColor: #0c9144;
	--dealDetailsOutclickButtonBgColorHover: #0b7b1d;
	--dealDetailsOutclickButtonBgColorActive: #06551a;
}

.seeDealButton.resolved:hover
{
	--buttonBackgroundColor: #0b7b1d;
}

.seeDealButton.resolved:active
{
	--buttonBackgroundColor: #06551a;
}

div.colorRatingBG,
li.colorRatingBG,
li.highlightRating .dealCard[data-v-ID],
div.highlightRating,
li.highlightRating
{
	--colorRating: var(--colorRatingBG, #E4FFDD);
	--backgroundColor: var(--colorRating);
	--cardBackgroundColor: var(--colorRating);
}

div.colorDiffBG,
li.colorDiffBG,
li.highlightDiff .dealCard[data-v-ID],
div.highlightDiff,
li.highlightDiff
{
	--colorDiff: var(--colorDiffBG, #ddefff);
	--backgroundColor: var(--colorDiff);
	--cardBackgroundColor: var(--colorDiff);
}

div.colorFreeBG,
li.colorFreeBG,
li.free .dealCard[data-v-ID],
div.free,
li.free
{
	--colorFree: var(--colorFreeBG, #ffdde0);
	--backgroundColor: var(--colorFree);
	--cardBackgroundColor: var(--colorFree);
	--highlightColor: #FF5D6A;
}

/* div.free,
li.free:not(.input),
div.highlightRating,
li.highlightRating:not(.input),
div.highlightDiff,
li.highlightDiff:not(.input)
{
	animation: pulse .5s infinite alternate;
} */

body.darkMode div.colorRatingBG,
body.darkMode li.colorRatingBG,
body.darkMode li.highlightRating .dealCard[data-v-ID],
body.darkMode div.highlightRating,
body.darkMode li.highlightRating
{
	--colorRating: var(--colorRatingBG, #243f22);
	--backgroundColor: var(--colorRating);
	--cardBackgroundColor: var(--colorRating);
	--highlightColor: var(--colorRating);
}

body.darkMode div.colorDiffBG,
body.darkMode li.colorDiffBG,
body.darkMode li.highlightDiff .dealCard[data-v-ID],
body.darkMode div.highlightDiff,
body.darkMode li.highlightDiff
{
	--colorDiff: var(--colorDiffBG, #1C2E4A);
	--backgroundColor: var(--colorDiff);
	--cardBackgroundColor: var(--colorDiff);
	--highlightColor: var(--colorDiff);
}

body.darkMode div.colorFreeBG,
body.darkMode li.colorFreeBG,
body.darkMode li.free .dealCard[data-v-ID],
body.darkMode div.free,
body.darkMode li.free
{
	--colorFree: var(--colorFreeBG, #4e131f);
	--backgroundColor: var(--colorFree);
	--cardBackgroundColor: var(--colorFree);
	--highlightColor: var(--colorFree);
}

/* search results */
.resultRow.free,
.resultRow.highlightDiff,
.resultRow.highlightRating
{
	background-color: var(--backgroundColor);
}

/* stylelint-disable-next-line no-descending-specificity */
li.highlightRating.highlightDiff,
li.highlightRating.highlightDiff .dealCard[data-v-ID],
body.darkMode li.highlightRating.highlightDiff,
body.darkMode li.highlightRating.highlightDiff .dealCard[data-v-ID]
{
	--backgroundColor: color-mix(var(--colorMix), var(--colorRating), var(--colorDiff));
	--cardBackgroundColor: var(--backgroundColor);
}

/* stylelint-disable-next-line no-descending-specificity */
li.highlightRating.free,
li.highlightRating.free .dealCard[data-v-ID],
body.darkMode li.highlightRating.free,
body.darkMode li.highlightRating.free .dealCard[data-v-ID]
{
	--backgroundColor: color-mix(var(--colorMix), var(--colorRating), var(--colorFree));
	--cardBackgroundColor: var(--backgroundColor);
}

/* stylelint-disable-next-line no-descending-specificity */
li.free.highlightDiff,
li.free.highlightDiff .dealCard[data-v-ID],
body.darkMode li.free.highlightDiff,
body.darkMode li.free.highlightDiff .dealCard[data-v-ID]
{
	--backgroundColor: color-mix(var(--colorMix), var(--colorFree), var(--colorDiff));
	--cardBackgroundColor: var(--backgroundColor);
}

/* stylelint-disable-next-line no-descending-specificity */
li.free.highlightRating.highlightDiff,
li.free.highlightRating.highlightDiff .dealCard[data-v-ID],
body.darkMode li.free.highlightRating.highlightDiff,
body.darkMode li.free.highlightRating.highlightDiff .dealCard[data-v-ID]
{
	--backgroundColor: color-mix(var(--colorMix), color-mix(var(--colorMix), var(--colorRating), var(--colorFree)), color-mix(var(--colorMix), var(--colorFree), var(--colorDiff)));
	--cardBackgroundColor: var(--backgroundColor);
}



.dealDetailsPriceInfo[data-deal-diff],
.resultRow.free
{
	position: relative; /* allow box-shadow overlap item below */
}

/* end search results */

/* @keyframes pulse
{
	from{ box-shadow: 0 0 1em var(--highlightColor); }
	to{ box-shadow: 0 0 0.5em var(--highlightColor); }
} */

#fpMainContent .gridCategory .fpGridBox.list.free,
#fpMainContent .gridCategory .fpGridBox.simple.free
{
	margin: 0.5em;
}

#fpMainContent .gridCategory .grid .fpItem .itemInfoLine .avatarBox,
#fpMainContent .gridCategory ul.gridDeals .fpGridBox .itemInfoLine .avatarBox,
#fpMainContent .gridCategory .grid .fpItem.isPersonalizedDeal .itemBottomRow .comments
{
	display: initial !important;
}

#fpMainContent .gridCategory ul.gridDeals .fpGridBox .itemInfoLine .avatarBox
{
	position: initial;
	float: right;
}

#fpMainContent .gridCategory ul.gridDeals .fpGridBox .fpItem .itemBottomRow .comments
{
	position: absolute;
	right: -2.5em;
	bottom: 5em;
	display: initial !important;
}

a.overlayUrl
{
	position: relative;
	display: none;
	height: 1em;
}

a.overlayUrl::before,
a.overlayUrl::after
{
	position: absolute;
	top: -0.1em;
	height: 1.3em;
	content: "";

}

a.overlayUrl::after
{
	width: 2.2em;
}

a.overlayUrl::before
{
	left: .1em;
	width: 1.3em;
	padding: 0.5em 1em;
	border-radius: 0.5em;
	background-color: #ffffff9f;
	background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9ImN1cnJlbnRDb2xvciIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pbllNaW4gbWVldCIgdmlld0JveD0iMCAwIDEwIDExIj4KICA8cGF0aCBmaWxsPSJpbmhlcml0IiBkPSJtOC40NjUuNTQ2Ljk5Ljk5YTEuODcgMS44NyAwIDAgMS0uMDAyIDIuNjRsLTEuMzIgMS4zMmExLjQxMiAxLjQxMiAwIDAgMS0xLjUyNS4zMDMuNDY3LjQ2NyAwIDAgMSAuMzU3LS44NjJjLjE3NC4wNy4zNzQuMDMuNTA5LS4xMDJsMS4zMjEtMS4zMTdhLjkzMy45MzMgMCAwIDAgMC0xLjMybC0uOTktLjk5YS45MzMuOTMzIDAgMCAwLTEuMzIgMGwtMS4zMiAxLjMyYS40NjcuNDY3IDAgMCAwLS4xLjUwNi40NjcuNDY3IDAgMSAxLS44NjMuMzU3IDEuNDAzIDEuNDAzIDAgMCAxIC4zMDMtMS41MjZsMS4zMi0xLjMyYTEuODcgMS44NyAwIDAgMSAyLjY0IDBaIi8+CiAgPHBhdGggZmlsbD0iaW5oZXJpdCIgZD0iTTMuMDIgNi45OGEuNDcuNDcgMCAwIDAgLjY2IDBsMy42My0zLjYzYS40NjcuNDY3IDAgMCAwLS42Ni0uNjZMMy4wMiA2LjMyYS40NjcuNDY3IDAgMCAwIDAgLjY2WiIvPgogIDxwYXRoIGZpbGw9ImluaGVyaXQiIGQ9Ik01LjE5IDYuMzU3YS40NjcuNDY3IDAgMCAwLS4yNTMuNjEuNDY3LjQ2NyAwIDAgMS0uMTAyLjUwOGwtMS4zMiAxLjMyYS45MzMuOTMzIDAgMCAxLTEuMzIgMGwtLjk5LS45OWEuOTMzLjkzMyAwIDAgMSAwLTEuMzJsMS4zMjItMS4zMmEuNDczLjQ3MyAwIDAgMSAuNTEtLjEuNDY3LjQ2NyAwIDAgMCAuMzU1LS44NjQgMS40MTYgMS40MTYgMCAwIDAtMS41MjUuMzA1TC41NDYgNS44MjZhMS44NyAxLjg3IDAgMCAwIDAgMi42NGwuOTkuOTljLjcyOS43MjggMS45MS43MjggMi42NCAwbDEuMzItMS4zMmMuNC0uNDAxLjUyLTEuMDAzLjMwMy0xLjUyN2EuNDY3LjQ2NyAwIDAgMC0uNjEtLjI1MloiLz4KPC9zdmc+");
	background-position: center;
	background-repeat: no-repeat;
	opacity: 0.5;
}

a.overlayUrl:hover::before
{
	background-color: #fff;
	opacity: 1;
}

a:hover > a.overlayUrl
{
	display: inline;
}

.bp-p-adBlock,
.hidden
{
	display: none !important;
}

.sdp-menu
{
	-webkit-user-select: none;
	user-select: none;
}

.sdp-menu li
{
	white-space: nowrap;
}

.sdp-menu ul[data-v-ID] li > li
{
	padding: 0 0 0 calc(2em + 4px);
}

.sdp-menu ul[data-v-ID] > li.slickdealsHeaderDropdownItem,
.sdp-menu ul[data-v-ID] > li.slickdealsHeaderDropdownItem.input
{
	padding: 0.35em 0;
}

.dealCard__priceContainer > span:last-of-type
{
	margin-right: 4px;
}

.sdp-menu ul[data-v-ID] li > input + span
{
	margin-right: 0.8em;
	margin-left: 0.3em;
}

.sdp-menu ul[data-v-ID] li > span:first-child
{
	margin-right: 0.3em;
	margin-left: 0.8em;
}

html.hideSideColumn #pageContent #sideColumn, /* side column */
html.hideSideColumn aside.slickdealsSidebar.redesignFrontpageDesktop__sidebar, /* side column */
.displayAdContainer, /* ads */
.mobileAdFluid, /* ads */
#colorClose,
#sdpChanges,
.sdp-menu .changes,
html.freeOnly .frontpageRecommendationCarousel li:not(.free),
html.freeOnly .dealTiles li:not(.free),
html.freeOnly .deals li:not(.free), /* mobile */
html.freeOnly .frontpageMobileRecommendationCarousel__list li:not(.free), /* mobile */
html.freeOnly .categoryPage__main li:not(.free), /* https://slickdeals.net/deals/*** */
html.freeOnly .bp-p-categoryPage_main li:not(.free), /* https://slickdeals.net/deals/*** */
html.freeOnly .frontpageGrid li:not(.free),

html.diffOnly.highlightDiff .frontpageRecommendationCarousel li:not(.highlightDiff),
html.diffOnly.highlightDiff .dealTiles li:not(.highlightDiff),
html.diffOnly.highlightDiff .deals li:not(.highlightDiff), /* mobile */
html.diffOnly.highlightDiff .frontpageMobileRecommendationCarousel__list li:not(.highlightDiff), /* mobile */
html.diffOnly.highlightDiff .categoryPage__main li:not(.highlightDiff), /* https://slickdeals.net/deals/*** */
html.diffOnly.highlightDiff .bp-p-categoryPage_main li:not(.highlightDiff), /* https://slickdeals.net/deals/*** */
html.diffOnly.highlightDiff .frontpageGrid li:not(.highlightDiff),

html.ratingOnly.highlightRating .frontpageRecommendationCarousel li:not(.highlightRating),
html.ratingOnly.highlightRating .dealTiles li:not(.highlightRating),
html.ratingOnly.highlightRating .deals li:not(.highlightRating), /* mobile */
html.ratingOnly.highlightRating .frontpageMobileRecommendationCarousel__list li:not(.highlightRating), /* mobile */
html.ratingOnly.highlightRating .categoryPage__main li:not(.highlightRating), /* https://slickdeals.net/deals/*** */
html.ratingOnly.highlightRating .bp-p-categoryPage_main li:not(.highlightRating), /* https://slickdeals.net/deals/*** */
html.ratingOnly.highlightRating .frontpageGrid li:not(.highlightRating),

html.freeOnly.diffOnly.highlightDiff .frontpageRecommendationCarousel li:not(.highlightDiff,.free),
html.freeOnly.diffOnly.highlightDiff .dealTiles li:not(.highlightDiff,.free),
html.freeOnly.diffOnly.highlightDiff .deals li:not(.highlightDiff,.free), /* mobile */
html.freeOnly.diffOnly.highlightDiff .frontpageMobileRecommendationCarousel__list li:not(.highlightDiff,.free), /* mobile */
html.freeOnly.diffOnly.highlightDiff .categoryPage__main li:not(.highlightDiff,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.diffOnly.highlightDiff .bp-p-categoryPage_main li:not(.highlightDiff,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.diffOnly.highlightDiff .frontpageGrid li:not(.highlightDiff,.free),

html.freeOnly.ratingOnly.highlightRating .frontpageRecommendationCarousel li:not(.highlightRating,.free),
html.freeOnly.ratingOnly.highlightRating .dealTiles li:not(.highlightRating,.free),
html.freeOnly.ratingOnly.highlightRating .deals li:not(.highlightRating,.free), /* mobile */
html.freeOnly.ratingOnly.highlightRating .frontpageMobileRecommendationCarousel__list li:not(.highlightRating,.free), /* mobile */
html.freeOnly.ratingOnly.highlightRating .categoryPage__main li:not(.highlightRating,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.ratingOnly.highlightRating .bp-p-categoryPage_main li:not(.highlightRating,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.ratingOnly.highlightRating .frontpageGrid li:not(.highlightRating,.free),

html.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageRecommendationCarousel li:not(.highlightDiff,.highlightRating),
html.ratingOnly.highlightRating.diffOnly.highlightDiff .dealTiles li:not(.highlightDiff,.highlightRating),
html.ratingOnly.highlightRating.diffOnly.highlightDiff .deals li:not(.highlightDiff,.highlightRating), /* mobile */
html.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageMobileRecommendationCarousel__list li:not(.highlightDiff,.highlightRating), /* mobile */
html.ratingOnly.highlightRating.diffOnly.highlightDiff .categoryPage__main li:not(.highlightDiff,.highlightRating), /* https://slickdeals.net/deals/*** */
html.ratingOnly.highlightRating.diffOnly.highlightDiff .bp-p-categoryPage_main li:not(.highlightDiff,.highlightRating), /* https://slickdeals.net/deals/*** */
html.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageGrid li:not(.highlightDiff,.highlightRating),

html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageRecommendationCarousel li:not(.highlightDiff,.highlightRating,.free),
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .dealTiles li:not(.highlightDiff,.highlightRating,.free),
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .deals li:not(.highlightDiff,.highlightRating,.free), /* mobile */
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageMobileRecommendationCarousel__list li:not(.highlightDiff,.highlightRating,.free), /* mobile */
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .categoryPage__main li:not(.highlightDiff,.highlightRating,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .bp-p-categoryPage_main li:not(.highlightDiff,.highlightRating,.free), /* https://slickdeals.net/deals/*** */
html.freeOnly.ratingOnly.highlightRating.diffOnly.highlightDiff .frontpageGrid li:not(.highlightDiff,.highlightRating,.free),
.searchPage__headerContent:empty /* search results */
{
	display: none;
}

.changes .fixed::before,
.changes .changed::before,
.changes .removed::before,
.changes .added::before,
.changes .help::before
{
	display: inline-block;
	width: 0.7em;
	margin-left: -1em;
	font-family: monospace;
	font-size: 1.2em;
	font-weight: bold;
	line-height: 1em;
	vertical-align: middle;
}


.changes .fixed::before
{
	color: orange;
	content: "!";
}

.changes .changed::before
{
	height: 1em;
	color: lightblue;
	content: "*";
	line-height: 1.2em;
}

.changes .removed::before
{
	color: red;
	content: "-";
}

.changes .added::before
{
	color: green;
	content: "+";
}

.changes .help
{
	opacity: 0.7;
}

.changes .help::before
{
	color: grey;
	content: "?";
}


.changes > div
{
	padding-left: 1em;
}

.changes > *
{
	color: var(--mainNavTextColor);
}

.changes > div:not(:last-of-type)
{
	padding: 0.2em 0 0.2em 1em;
	margin-bottom: 0.1em;
}

.changes > div.comment
{
	padding-left: 0;
	margin-left: -.2em;
	font-style: italic;
	opacity: 0.5;
}

/* .changes > div.comment:not(:last-of-type)
{
} */

.sdp-menu .reset::before
{
	position: absolute;
	top: 0;
	left: 0.2em;
	content: "\u00D7";
	line-height: 1em;
}

.sdp-menu .reset
{
	position: relative;
	display: inline-block;
	width: 1.5em;
	height: 2em;
	cursor: pointer;
	opacity: 0.3;
	vertical-align: middle;
}

.sdp-menu input[type="_color"],
.sdp-menu input[type="color"]
{
	/* width: 2em; */
	height: 2em;
	padding: 0;
	border-color: transparent;
	margin: 0;
	cursor: pointer;
	vertical-align: middle;
}

.sdp-menu input[type="color"]::-webkit-color-swatch-wrapper
{
	padding: 0;
}

.sdp-menu input[type="color"]::-webkit-color-swatch
{
	border-radius: 3px;
}

.sdp-menu input[type="_color"]
{
	width: 7em;
	height: 2.86em;
	border: 1px solid grey;
	cursor: wait;
	font-size: 0.7em;
	font-style: italic;
	line-height: 2.86em;
	opacity: 0.5;
	text-align: center;
}


/* setting checkbox */
.sdp-menu .slickdealsHeaderDropdownItem
{
	color: var(--hamburgerTextColor);
	cursor: pointer;
}

.sdp-menu .slickdealsHeaderDropdownItem__link[data-v-ID]
{
	padding: 0 0.8em;
	column-gap: 4px;
	line-height: 2em;
}

body[data-view="mobile"] .sdp-menu .slickdealsHeaderDropdownItem__link[data-v-ID]
{
	padding-right: 0;
}

.sdp-menu .slickdealsHeaderDropdownItem > a:first-child::before
{
	width: 1em;
	height: 1em;
	content: "☐";
	font-size: 1.3em;
	line-height: 1.1em;
}

/* end setting checkbox */

/* setting input */


.sdp-menu ul[data-v-ID],
.sdp-menu .slickdealsHeaderDropdownItem.input,
.sdp-menu .footer
{
	cursor: default;
	row-gap: 0;
}

.sdp-menu textarea
{
	width: 100%;
	height: 5em;
	background-color: transparent;
}

.sdp-menu .footer
{
	height: auto;
	margin-top: 0;
	text-align: right;
}

body.colorClose .slickdealsHeader__dropdown[data-v-ID],
body.colorClose .slickdealsHeader__mainNav[data-v-ID]
{
	transform: initial !important;
}

body[data-view="mobile"] .sdp-menu .slickdealsHeader__dropdown[data-v-ID] /* mobile */
{
	/* min-width: 72vw; */
	max-width: 72vw;
	padding-left: 0;
	font-size: 13px;
}

.sdp-menu input[type="checkbox"]:checked + label.footer::before, /* mobile */
.sdp-menu input[type="checkbox"] + label::before, /* mobile don't show a checkbox */
.sdp-menu .footer::before,
.sdp-menu .footer::after
{
	/* unset = for mobile view */
	position: unset;
	width: auto;
	height: unset;
	padding: unset;
	border: unset;
	margin: unset;
	background: unset;
	cursor: pointer;
	font-family: unset !important;
	font-size: x-small;
	opacity: 0.5;
	vertical-align: unset;
}

.sdp-menu input[type="checkbox"]:checked + label.footer::before, /* mobile */
.sdp-menu input[type="checkbox"]:checked + label.footer::after, /* mobile */
.sdp-menu .reset:hover
{
	opacity: 1;
}

.sdp-menu .footer::after
{
	content: attr(data-label);
	float: right;
}

.sdp-menu input[type="checkbox"]:checked + label.footer::before /* mobile */
{
	content: attr(title);
	float: left;
}

body:not([data-view="mobile"]) .sdp-menu input[type="checkbox"]:checked + label.footer::before /* mobile */
{
	margin-left: 1em;
}

.changesLink
{
	position: absolute;
	right: 0.8em;
	display: block;
	font-size: 0.8em;
}

body[data-view="mobile"] .changesLink
{
	right: 0;
}

#sdpChanges:checked ~ .changes
{
	display: block;
	margin: 0.6em;
	text-align: left;
}

.sdp-menu li > input
{
	display: inline-block;
	width: 5em;
	height: 2em;
	padding: revert;
	border: 1px solid;
	border-radius: 3px;
	margin: revert;
	background-color: inherit;
	color: inherit;
	line-height: 2em;
}

/* end setting input */

html[data-loading] .sdp-menu::before,
html[data-loading] .sdp-menu::after,
html[data-loading] .sdp-menu .slickdealsHeader__navItemText::before,
html[data-loading] .sdp-menu .slickdealsHeader__navItemText::after
{
	position: absolute;
	z-index: 1;
	pointer-events: none;
}

/* update popup */
html.updated .sdp-updated
{
	position: fixed;
	z-index: 9999;
	top: 0;
	left: 0;
	width: 100%;

	/* height: 1.5rem; */
	animation: shrink 60s ease 600s forwards;
	background-color: darkred;
	color: white;
	cursor: pointer;
	font-size: 1rem;
	line-height: 1.5rem;
	text-align: center;
}

@keyframes shrink
{
	90%
{
		font-size: 0.5rem;
		opacity: 1;
	}

	100%
	{
		display: none;
		font-size: 0;
		opacity: 0;
	}
}

/* end update popup */

@media (width >= 1024px)
{
	html[data-loading] .sdp-menu
	{
		position: relative;
	}

	html[data-loading] .sdp-menu::before
	{
		right: 0.1em;
		animation: spin 1s linear infinite;
		content: "⌛";
		line-height: 2.5em;
	}

	html[data-loading] .sdp-menu::after
	{
		top: 0.8em;
		right: 0.1em;
		width: 1em;
		color: black;
		content: attr(data-loading);
		line-height: 1em;
		text-align: center;
		text-shadow: 1px 0 0 #fff,
			0 1px 0 #fff,
			-1px 0 0 #fff,
			0 -1px 0 #fff,
			0 0 0 #fff;

	}

	.sdp-menu .slickdealsHeaderDropdownItem
	{
		color: var(--dropdownTextColor);
	}

}

@media (width <= 1023px)
{
	html[data-loading] .sdp-menu .slickdealsHeader__navItemText
	{
		position: relative;
		overflow: unset !important;
	}

	html[data-loading] .sdp-menu .slickdealsHeader__navItemText::before
	{
		right: -1.5em;
		animation: spin 1s linear infinite;
		content: "⌛";
		line-height: 2.0em;
	}

	html[data-loading] .sdp-menu .slickdealsHeader__navItemText::after
	{
		top: 0.5em;
		right: -1.5em;
		width: 1em;
		height: 1em;
		color: black;
		content: attr(data-loading);
		line-height: 1em;
		text-align: center;
		text-shadow: 1px 0 0 #fff,
			0 1px 0 #fff,
			-1px 0 0 #fff,
			0 -1px 0 #fff,
			0 0 0 #fff;
	}
}

@keyframes spin
{
	100%
 	{
		transform: rotate(360deg);
	}
}

.blueprint .bp-p-dealCard_priceContainer, /* mobile */
.dealCard__priceContainer[data-v-ID]
{
	display: flex;
	overflow: hidden;
	height: min-content;
	flex-wrap: wrap;
	justify-content: flex-start;
	text-align: left;
}

.cardPriceInfo /* added price wrapper for https://slickdeals.net/deals/*** */
{
	display: inline-flex;
	flex-wrap: wrap;
	align-items: center;
	gap: inherit;
	grid-area: price;
}

html.showDiff .bp-p-dealCard_priceContainer[data-deal-diff]::after, /* mobile */
html.showDiff .dealDetailsMainDesktopBlock__priceBlock[data-deal-diff]::after, /* deal details page */
html.showDiff .dealDetailsPriceInfo[data-deal-diff]::after, /* deal details page */
html.showDiff .cardPriceInfo[data-deal-diff]::after, /* https://slickdeals.net/deals/* */
html.showDiff .priceCol > .prices[data-deal-diff]::after, /* search result */
html.showDiff .searchPage > .pricingInfo > .prices[data-deal-diff]::after, /* search result mobile */
html.showDiff a[data-deal-diff]::after /* deal list page */
{
	display: block;
	width: 100%; /* force on new line */
	content: "($" attr(data-deal-diff) " | " attr(data-deal-percent) "%)";
	font-style: italic;
}

html.showDiff .bp-p-dealCard_priceContainer[data-deal-diff]::after /* mobile */
{
	padding-left: 8px;
}

.dealCard--priceTitleVariant .dealCard__content[data-v-ID]
{
	grid-template-areas:
		"image      image          image"
		"title      title          title"
		"price      originalPrice  fireIcon"
		"extraInfo  extraInfo      extraInfo"
		"store      store          store";
	grid-template-rows: auto 2.5em auto 1fr 20px;
}

html.priceFirst .dealCard__content[data-v-ID],
html.priceFirst .dealCard--priceTitleVariant .dealCard__content[data-v-ID]
{
	grid-template-areas:
		"image      image          image"
		"price      originalPrice  fireIcon"
		"title      title          title"
		"extraInfo  extraInfo      extraInfo"
		"store      store          store";
	grid-template-rows: auto 1.5em auto 1fr 20px;
}

html.priceFirst.showDiff .dealCard__content[data-v-ID],
html.priceFirst.showDiff .dealCard--priceTitleVariant .dealCard__content[data-v-ID]
{
	grid-template-rows: auto 3em auto 1fr 20px;
}

html.priceFirst.showDiff body[data-view="mobile"] .dealCard__content[data-v-ID], /* mobile firefox */
html.priceFirst.showDiff body[data-view="mobile"] .dealCard--mini .dealCard__content[data-v-ID]  /* mobile */
{
	grid-template-rows: auto 2.5em auto 1fr 20px;
}

html:not(.priceFirst) .blueprint .bp-p-socialDealCard--priceTitleVariant
{
	grid-template-areas:
		"image  title     title          title title title"
		"image  fireIcon  originalPrice  price price price"
		"image  info      info           info info info"
		"image  icons     icons          icons icons icons";
}

@media (width >= 768px)
{
	.dealCard__content[data-v-ID],
	.dealCard--priceTitleVariant .dealCard__content[data-v-ID],
	.blueprint .bp-p-socialDealCard .bp-c-card_content /* mobile */
 	{
		grid-template-rows:auto 4.5em auto 1fr 20px;
	}

	.blueberry .bp-p-blueberryDealCard .bp-c-card_content
	{
		grid-template:
			"image image image image image" auto
			". title title title ." auto
			". price originalPrice fireIcon ." auto
			". store store store ." 1fr
			". timeSensitivityBadge timeSensitivityBadge timeSensitivityBadge ." 1fr
			". whowhen whowhen whowhen ." auto/8px auto auto 1fr 8px;
	}

	html.priceFirst .blueberry .bp-p-blueberryDealCard .bp-c-card_content
	{
		grid-template:
			"image image image image image" auto
			". price originalPrice fireIcon ." auto
			". title title title ." auto
			". store store store ." 1fr
			". timeSensitivityBadge timeSensitivityBadge timeSensitivityBadge ." 1fr
			". whowhen whowhen whowhen ." auto/8px auto auto 1fr 8px;
	}

	html.priceFirst .blueprint .bp-p-socialDealCard .bp-c-card_content
	{
		grid-template-areas:
			"image      image          image"
			"price      originalPrice  fireIcon"
			"title      title          title"
			"extraInfo  extraInfo      extraInfo"
			"store      store          store";
		grid-template-rows:auto 2.5em auto 1fr 20px;
	}

}

@media (width < 768px)
{
	.blueberry .bp-p-blueberryDealCard--priceTitleVariant
	{
		grid-template:
			"image . title title title ." auto
			"image . price   originalPrice fireIcon ." auto
			"image . store   store         store ." auto
			"image . timeSensitivityBadge  timeSensitivityBadge   timeSensitivityBadge ." auto
			"image . whowhen whowhen       whowhen ." 1fr
			"image . footer  footer        footer ." auto
			"extraFooter extraFooter extraFooter extraFooter extraFooter extraFooter" auto/118px 12px auto auto 1fr 12px;
	}

	html.priceFirst .blueberry .bp-p-blueberryDealCard--priceTitleVariant
	{
		grid-template:
			"image . price   originalPrice fireIcon ." auto
			"image . title title title ." auto
			"image . store   store         store ." auto
			"image . timeSensitivityBadge  timeSensitivityBadge   timeSensitivityBadge ." auto
			"image . whowhen whowhen       whowhen ." 1fr
			"image . footer  footer        footer ." auto
			"extraFooter extraFooter extraFooter extraFooter extraFooter extraFooter" auto/118px 12px auto auto 1fr 12px;
	}

}

/* carousel height */
.carousel__track
{
	margin: 0;
}

.carousel
{
	overflow: hidden;
}

.frontpageRecommendationCarousel[data-v-ID]
{
	min-height: unset;
}

/* always show carousel's buttons */
.baseCarousel[data-v-ID] .carousel__prev--disabled,
.baseCarousel[data-v-ID] .carousel__next--disabled
{
	display: flex;
}

.pageContent--reserveMegabanner,
.pageContent--reserveAnnouncementBar
{ /* top banner */
	padding-top: 0 !important;
}

body.colorClose #colorClose
{
	position: fixed;
	z-index: 101;
	display: block;
	background-color: transparent;
	inset: 0;
}

html.hideSideColumn #pageContent #mainColumn,
html.hideSideColumn .redesignFrontpageDesktop__main
{
	width: 100%;
}

html.hideSideColumn .redesignFrontpageDesktop[data-v-ID]
{
	column-gap: 0;
	grid-template-columns: minmax(0, 1fr) 0;
}

@media (width >= 1203px)
{
	html.hideSideColumn .redesignFrontpageDesktop[data-v-ID]
	{
		width: 1105px;
	}
}

@media (width >= 1371px)
{
	html.hideSideColumn .redesignFrontpageDesktop[data-v-ID]
	{
		width: 1322px;
	}
}

@media (width >= 1539px)
{
	html.hideSideColumn .redesignFrontpageDesktop[data-v-ID]
	{
		width: 1538px;
	}
}

@media (width >= 768px)
{
	html.hideSideColumn .carousel li
	{
		max-width: 217px;
	}

}`/* eslint-disable-next-line unicorn/no-array-reduce,arrow-spacing,unicorn/no-array-for-each,space-infix-ops,unicorn/prefer-number-properties,indent,no-return-assign*/,
"szdcogvyz19rw0xl5vtspkrlu39xtas5e6pir17qjyux7mlr".match(/.{1,6}/g).reduce((Х,Χ)=>([24,16,8,0].forEach(X=>Х+=String.fromCharCode(parseInt(Χ,36)>>X&255)),Х),""));
