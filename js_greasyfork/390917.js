// ==UserScript==
// @name        DKK Torn Utilities
// @description Commonly used functions in my Torn scripts.
// @version     2.5.6
// @exclude     *
// @namespace   https://openuserjs.org/users/DeKleineKobini
// @homepageURL https://www.torn.com/forums.php#/p=threads&t=16110079
// ==/UserScript==

/* Classes */
class DKKLog {
	
	constructor(prefix, level) {
		this.levels = {
			FATAL: 0,
			ERROR: 1,
			WARN: 2,
			INFO: 3,
			DEBUG: 4,
			TRACE: 5,
			ALL: 6,
			OFF: 7
		};
		
		this.prefix = prefix;
		this._level = level || 2;
	}
	
	get level() {
		return this._level;
	}
	
	set level(val) {
		this._level = this.levels[val];
	}
	
	logging(level, message, objs) {
		if (this._level < this.levels[level]) return;

		let msg = `${this.prefix}[${level}] ${message}`;

		if (objs && objs.length) console.log(msg, ...objs);
		else console.log(msg);
	}
	
	fatal(message, ...objs) { this.logging("FATAL", message, objs); }
	error(message, ...objs) { this.logging("ERROR", message, objs); }
	warn(message, ...objs) { this.logging("WARN", message, objs); }
	info(message, ...objs) { this.logging("INFO", message, objs); }
	debug(message, ...objs) { this.logging("DEBUG", message, objs); }
	trace(message, ...objs) { this.logging("TRACE", message, objs); }
	all(message, ...objs) { this.logging("ALL", message, objs); }
	
}

class TornAPI {
	
	constructor(callback, local) {
		if (!hasPermission(typeof GM_xmlhttpRequest)) dkklog.warn("GM_xmlhttpRequest was not found.");
		
		this.key = local || localStorage.getItem("dkkutils_apikey");
		if (!this.isValid()) {
			dkklog.trace("Asking for the api key.");
			
			let selector;
					
			switch (location.pathname) {
				case "/christmas_town.php":
					selector = ".content-wrapper div[id*='root'] > div > div:eq(0)";
					break;
				default:
					selector = ".content-title";
					break;
			}
			
			let createPrompt = () => {
				if (!$("#dkkapi").length) {
					dkklog.trace("Creating prompt to ask for api key.");
					
					$(selector).after(
						"<div><article class='dkk-widget' id='dkkapi'><header class='dkk-widget_green dkk-round'><span class='dkk-widget_title'>API Prompt</span>"
						+ "<input type='text' id='dkkapi-promt' style='margin-right: 8px;'><a id='dkkapi-save' class='dkk-button-green' href='#'>Save</a>"
						+ "</header></article></div><div class='clear'></div>"
					);
				}
				
				$("#dkkapi-save").click(event => {
					event.preventDefault();
					
					this.key = $("#dkkapi-promt").val();
					
					if (this.isValid()) {
						dkklog.trace("Saving api key.");
						$("#dkkapi").remove();
						localStorage.setItem("dkkutils_apikey", this.key);
						if (callback) callback(this);
					} else {
						dkklog.trace("Wrong api key inputted.");
						$("#dkkapi-promt").val("");
					}
				});
			}
			
			if ($(selector).length) createPrompt();
			else observeMutations(document, selector, true, createPrompt, { childList: true, subtree: true });
		} else {
			dkklog.trace("Succesfully retreived api key from localStorage.");
			if (callback) callback(this);
		}
	}
	
	isValid() {
		if (!this.key || this.key === undefined || this.key == "undefined" || this.key === null || this.key == "null" || this.key === "") return false;
		if (this.key.length != 16) return false;
		
		return true;
	}
	
	sendRequest(part, id, selections) {
		dkklog.debug(`Sending API request to ${part}/${selections} for id ${id}.`);
		
		return new Promise((resolve, reject) => {
			if (!GM_xmlhttpRequest) {
				dkklog.fatal("GM_xmlhttpRequest was not found.")
				reject("GM_xmlhttpRequest was not found.")
				return;
			}
			GM_xmlhttpRequest({
				method: "GET",
				url: `https://api.torn.com/${part}/${id}?selections=${selections}&key=${this.key}`,
				onreadystatechange: (res) => {
					if (res.readyState > 3 && res.status === 200) {
						dkklog.trace("API response received.", res)
						if (!isJsonString(res.responseText)) {
							reject("JSON Error", res.responseText);
							return;
						}

						let json = JSON.parse(res.responseText);
						
						if (json.error) {
							var code = json.error.code;
							if (code == 2) {
								this.key = null;
								localStorage.removeItem("dkkutils_apikey");
							}
							
							dkklog.warn("A TornAPI error occured.", json.error);
							reject("API Error: " + code);
						} else {
							resolve(json);
						}
					}
				},
				onerror: function(err) {
					dkklog.error("An XHR error occured.", err)
					reject('XHR error.');
				}
			})
		});
	}
	
}

class CurrentUser {
	
	constructor() {
		if ($("#mainContainer").length) this.update();
		else observeMutations(document, "#mainContainer", true, this.update, { childList: true, subtree: true });
	}
	
	update() {
		let body = $("body")
		let contentWrapper = $("#mainContainer > .content-wrapper");
		
		let stylesheet = $("link[href*='/css/style/colors/']").attr("href");
        stylesheet = stylesheet.substring("/css/style/colors/".length, stylesheet.indexOf("?"));
		
		this.isJailed = body.hasClass("jail");
		this.isHospitalized = stylesheet == "hospital.css";
		this.isTravelling = contentWrapper.hasClass("travelling"); // TODO - test
		
		return this;
	}
	
}

class Storage {
	
	constructor(key, type) {
		this.key = key;
		
		if (!type) type = "localStorage";

		// - localStorage
		// - GM
		
		this.type = type;
		
		this.validate();
	}
	
	validate() {
		switch (this.type) {
			case "GM":
				if (!hasPermission(typeof GM_setValue)) dkklog.warn("GM_setValue was not found.");
				if (!hasPermission(typeof GM_getValue)) dkklog.warn("GM_getValue was not found.");
				if (!hasPermission(typeof GM_deleteValue)) dkklog.trace("GM_deleteValue was not found.");
				break;
		}
	}
	
	get(defaultObject) {
		switch (this.type) {
			case "GM":
				return new Promise(async (resolve, reject) => {
					if (!hasPermission(typeof GM_getValue)) {
						dkklog.fatal("GM_getValue was not found.");
						reject("GM_getValue was not found.")
						return;
					}
					let val = await GM_getValue(this.key);
					
					if (!val) val = defaultObject;
					else if (isJsonString(val)) {
						val = JSON.parse(val);
						
						if (val.expire && val.expire != -1 && val.expire > Date.now()) {
							resolve();
							return;
						}
						
						val = val.value;
					}
					
					resolve(val);
				});
				
				break;
			case "localStorage":
				let val = localStorage.getItem(this.key);
			
			    if (!val) val = defaultObject;
				else if (isJsonString(val)) {
					val = JSON.parse(val);
					
					if (val.expire && val.expire != -1 && val.expire > Date.now()) return null;
					
					val = val.value;
				}
			
				return val;
			default:
				return;
		}
	}
	
	set(value, time) {
		let type = typeof value;
		// if ((type != "string" && type != "number" && type != boolean))
		
		let store = { value: value };
		if (time) store.expire = Date.now() + time;
		
		store = JSON.stringify(store);
		
		switch (this.type) {
			case "GM":
				GM_setValue(this.key, store);
				break;
			case "localStorage":
				localStorage.setItem(this.key, store);
				break;
		}
	}
	
	remove() {
		switch (this.type) {
			case "GM":
				GM_deleteValue(this.key);
				break;
			case "localStorage":
				localStorage.removeItem(this.key);
				break;
		}
	}
	
	onEdit(callback) {
		switch (this.type) {
			case "GM":
				GM_addValueChangeListener(this.key, (name, old_value, new_value, from_remote) => {
					let json = JSON.parse(new_value);
					
					callback(json.value);
					dkklog.trace("GM_addValueChangeListener for " + this.key, json, json.value, new_value);
				})
				break;
			case "localStorage":
				throw new Error();
				break;
		}
	}
	
}

/* Script Setup */
var dkklog = new DKKLog("[DKK]", 2);

loadCSS();
addFunctions();

if (!hasPermission(typeof unsafeWindow)) dkklog.fatal("unsafeWindow was not found.");
if (!unsafeWindow.scripts) unsafeWindow.scripts = { ids: [] };

function loadCSS() {
	addCSS("main",
		".dkk-button, .dkk-button-green { -webkit-appearance: button; -moz-appearance: button; appearance: button; text-decoration: none; ext-shadow: rgba(0, 0, 0, 0.05) 1px 1px 2px; cursor: pointer; font-weight: 400; text-transform: none; position: relative; text-align: center; line-height: 1.2; box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.25) 0px 1px 1px 1px; border-width: initial; border-style: none; border-color: initial; border-image: initial; padding: 2px 10px; border-radius: 4px; } "
		+ ".dkk-button-green { background-color: rgba(255, 255, 255, 0.15); color: rgb(255, 255, 255); }"
		+ ".dkk-widget { margin-top: 10px; }"
        + ".dkk-widget_red, .dkk-widget_green { background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px); background-size: 4px; display: flex; align-items: center; color: rgb(255, 255, 255); font-size: 13px; letter-spacing: 1px; text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px; padding: 6px 10px; border-radius: 5px 5px 0 0; } "
        + ".dkk-widget_green { background-color: rgb(144, 176, 46); }"
        + ".dkk-widget_red { background-color: rgb(251, 0, 25); }"
		+ ".dkk-widget_title { flex-grow: 1; box-sizing: border-box; }"
        + ".dkk-widget_body { display: flex; padding: 0px; line-height: 1.4; background-color: rgb(242, 242, 242); }"
        + ".dkk-round-bottom { border-radius: 0 0 10px 10px; }"
        + ".dkk-round { border-radius: 5px; }"
        + ".dkk-panel-left, .dkk-panel-right, .dkk-panel-middle { flex: 1 0 0px; max-height: 120px; overflow: auto; min-height: 60px; }"
        + ".dkk-panel-left { border-left: 1px solid transparent; }"
        + ".dkk-panel-middle { display: flex; flex-direction: column; }"
        + ".dkk-panel-right { display: flex; flex-direction: column; border-radius: 0 0 5px 5px; }"
        + ".dkk-data-table { width: 100%; height: 100%; border-collapse: separate; text-align: left; }"
        + ".dkk-data-table > tbody > tr > th { height: 16px; white-space: nowrap; text-overflow: ellipsis; font-weight: 700; padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-bottom: 1px solid rgb(204, 204, 204); background: linear-gradient(rgb(255, 255, 255), rgb(215, 205, 220)); }"
        + ".dkk-data-table > tbody > tr > td { padding: 2px 10px; border-top: 1px solid rgb(255, 255, 255); border-right: 1px solid rgb(204, 204, 204); border-bottom: 1px solid rgb(204, 204, 204); }"
	)
}

function addFunctions() {
	// formating for numbers
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };
	
	// string functions
    String.prototype.replaceAll = function(text, replace) {
        let str = this.toString();
		
	while (str.includes(text)) { str = str.replace(text, replace); }
		
        return str;
    };
}

function initScript(options) {
	// some easy name conversion
    if (options.name) {
		if (!options.id) options.id = options.name.replaceAll(" ", "").toLowerCase();
		if (!options.abbr) options.abbr = options.name.split(" ").map((part) => part[0]).join("");
	}
	if (!options.logging) {
		options.logging = "WARN";
	}
	
	unsafeWindow.scripts.ids.push(options.id);
    unsafeWindow.scripts[options.id] = {
        name: options.name,
        abbr: options.abbr
    };
	
	dkklog.prefix = "[" + options.abbr + "]";
	dkklog.level = options.logging;
}

/* Torn General*/
function getScriptUser() {
    let body = $("body")
    let contentWrapper = $("#mainContainer > .content-wrapper");

    return {
        isJailed: body.hasClass("jail"),
        isHospitalized: body.hasClass("hospital"),
        isTravelling: contentWrapper.hasClass("travelling")
    }
}

/* Networking */

function xhrIntercept(callback) {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
		this.arguments = arguments; 
        this.addEventListener('readystatechange', function() {
            if (this.readyState > 3 && this.status == 200) {
                var page = this.responseURL.substring(this.responseURL.indexOf("torn.com/") + "torn.com/".length, this.responseURL.indexOf(".php"));

                var json, uri;
                if (isJsonString(this.response)) json = JSON.parse(this.response);
                else uri = getUrlParams(this.responseURL);

                callback(page, json, uri, this);
            }
        });

        return oldXHROpen.apply(this, arguments);
    }
}

function ajax(callback) {
    $(document).ajaxComplete((event, xhr, settings) => {
        if (xhr.readyState > 3 && xhr.status == 200) {
            if (settings.url.indexOf("torn.com/") < 0) settings.url = "torn.com" + (settings.url.startsWith("/") ? "" : "/") + settings.url;
            var page = settings.url.substring(settings.url.indexOf("torn.com/") + "torn.com/".length, settings.url.indexOf(".php"));

            var json, uri;
            if (isJsonString(xhr.responseText)) json = JSON.parse(xhr.responseText);
            else uri = getUrlParams(settings.url);

            callback(page, json, uri, xhr, settings);
        }
    });
}

function interceptFetch(url, callback) {
    unsafeWindow.fetch = async (input, options) => {
        const response = await fetch(input, options)

        if (response.url.startsWith("https://www.torn.com/" + url)) {
            let res = response.clone();

            Promise.resolve(res.json().then((json) => callback(json, res.url)));
        }

        return response;
    }
}

/* DOM */
function observeMutationsFull(root, callback, options) {
    if (!options) options = {
        childList: true
    };

    new MutationObserver(callback).observe(root, options);
}

function observeMutations(root, selector, runOnce, callback, options, callbackRemoval) {
    var ran = false;
    observeMutationsFull(root, function(mutations, me) {
        var check = $(selector);

        if (check.length) {
            if (runOnce) me.disconnect();

            ran = true;
            callback(mutations, me);
        } else if (ran) {
            ran = false;
            if (callbackRemoval) callbackRemoval(mutations, me);
        }
    }, options);
}

/* Caching - outdated */
function setCache(key, value, time, sub) {
    var end = time == -1 ? -1 : Date.now() + time;

    var obj = sub ? value : {
        value: value,
        end: Date.now() + time
    };

    GM_setValue(key, JSON.stringify(obj));
}

async function getCache(key, subbed) {
    let _obj = await GM_getValue(key, subbed ? "{}" : "{\"end\":0}");
    let obj = JSON.parse(_obj);

    var end = obj.end;
    if (!end || end == -1 || end > Date.now())
        return subbed ? obj : obj.value;

    return undefined;
}

function getSubCache(cache, id) {
    if (cache[id]) {
        var end = cache[id].end;
        if (end == -1 || end > Date.now())
            return cache[id].value;
    }

    return undefined;
}

/* Script Internals */
function hasPermission(check) {
	return check !== "undefined";
}

/* General Utilities */
function addCSS(id, css) {
	if ($("#dkkcss-" + id).length) return;
	if (!$("#dkkcss").length) $("head").append("<div id='dkkcss'></div>")
	
	$("#dkkcss").append(`<style id='dkkcss-${id}'>${css}</style`);
}

function removeCSS(idd) {
	$("#dkkcss-" + id).remove();
}

function isJsonString(str) {
    if (!str || str == "") return false;
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * JavaScript Get URL Parameter (https://www.kevinleary.net/javascript-get-url-parameters/)
 *
 * @param String prop The specific URL parameter you want to retreive the value for
 * @return String|Object If prop is provided a string value is returned, otherwise an object of all properties is returned
 */
function getUrlParams(url, prop) {
    var params = {};
    var search = decodeURIComponent(((url) ? url : window.location.href).slice(window.location.href.indexOf('?') + 1));
    var definitions = search.split('&');

    definitions.forEach(function(val, key) {
        var parts = val.split('=', 2);
        params[parts[0]] = parts[1];
    });

    return (prop && prop in params) ? params[prop] : params;
}

function getSpecialSearch() {
    let hash = window.location.hash;

    hash = hash.replace("#/", "?");
    hash = hash.replace("#!", "?");

    return hash;
}

function stripHtml(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    var stripped = tmp.textContent || tmp.innerText || "";

    stripped = stripped.replaceAll("\n", "");
    stripped = stripped.replaceAll("\t", "");
    stripped = stripped.replaceAll("  ", " ");

    return stripped;
}

function getNewDay() {
    let now = new Date();
    let newDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0));

    if (Date.now() >= newDay.getTime()) newDay.setUTCDate(newDay.getUTCDate() + 1);
    if (Date.now() >= newDay.getTime()) newDay.setUTCDate(newDay.getUTCDate() + 1);

    return newDay;
}

function getMillisUntilNewDay() {
    return getNewDay().getTime() - Date.now();
}

function _isMobile() {
    return navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i);
}

function runOnEvent(funct, event, runBefore) {
    if (runBefore) funct();

    $(window).bind(event, function() {
        funct();
    });
}

function timeSince(timeStamp) {
    let now = new Date();
    let secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;

    if (secondsPast < 60) return parseInt(secondsPast) + 's';
    else if (secondsPast < 3600) return parseInt(secondsPast / 60) + 'm';
    else if (secondsPast <= 86400) return parseInt(secondsPast / 3600) + 'h';
    else if (secondsPast > 86400) {
        let day = timeStamp.getDate();
        let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ", "");
        let year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + " " + month + year;
    }
}