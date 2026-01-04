/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               Basic Functions
// @name:zh-CN         常用函数
// @name:en            Basic Functions
// @namespace          Wenku8++
// @version            0.8
// @description        自用函数 For wenku8++
// @description:zh-CN  自用函数 For wenku8++
// @description:en     Useful functions for myself
// @author             PY-DNG
// @license            GPL-license
// @grant              GM_info
// @grant              GM_addStyle
// @grant              GM_addElement
// @grant              GM_deleteValue
// @grant              GM_listValues
// @grant              GM_addValueChangeListener
// @grant              GM_removeValueChangeListener
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_log
// @grant              GM_getResourceText
// @grant              GM_getResourceURL
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_openInTab
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @grant              GM_getTab
// @grant              GM_saveTab
// @grant              GM_getTabs
// @grant              GM_notification
// @grant              GM_setClipboard
// @grant              GM_info
// @grant              unsafeWindow
// ==/UserScript==

const LogLevel = {
	None: 0,
	Error: 1,
	Success: 2,
	Warning: 3,
	Info: 4,
}

// Arguments: level=LogLevel.Info, logContent, trace=false
// Needs one call "DoLog();" to get it initialized before using it!
function DoLog() {
	// Get window
	const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window;

	const LogLevelMap = {};
	LogLevelMap[LogLevel.None] = {
		prefix: '',
		color: 'color:#ffffff'
	}
	LogLevelMap[LogLevel.Error] = {
		prefix: '[Error]',
		color: 'color:#ff0000'
	}
	LogLevelMap[LogLevel.Success] = {
		prefix: '[Success]',
		color: 'color:#00aa00'
	}
	LogLevelMap[LogLevel.Warning] = {
		prefix: '[Warning]',
		color: 'color:#ffa500'
	}
	LogLevelMap[LogLevel.Info] = {
		prefix: '[Info]',
		color: 'color:#888888'
	}
	LogLevelMap[LogLevel.Elements] = {
		prefix: '[Elements]',
		color: 'color:#000000'
	}

	// Current log level
	DoLog.logLevel = (win.isPY_DNG && win.userscriptDebugging) ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

	// Log counter
	DoLog.logCount === undefined && (DoLog.logCount = 0);

	// Get args
	let [level, logContent, trace] = parseArgs([...arguments], [
		[2],
		[1,2],
		[1,2,3]
	], [LogLevel.Info, 'DoLog initialized.', false]);

	// Log when log level permits
	if (level <= DoLog.logLevel) {
		let msg = '%c' + LogLevelMap[level].prefix + (typeof MODULE_DATA === 'object' ? '[' + MODULE_DATA.name + ']' : '') + (LogLevelMap[level].prefix ? ' ' : '');
		let subst = LogLevelMap[level].color;

		switch (typeof(logContent)) {
			case 'string':
				msg += '%s';
				break;
			case 'number':
				msg += '%d';
				break;
			case 'object':
				msg += '%o';
				break;
		}

		if (++DoLog.logCount > 512) {
			console.clear();
			DoLog.logCount = 0;
		}
		console[trace ? 'trace' : 'log'](msg, subst, logContent);
	}
}
DoLog();

// Basic functions
// querySelector
function $() {
	switch (arguments.length) {
		case 2:
			return arguments[0].querySelector(arguments[1]);
			break;
		default:
			return document.querySelector(arguments[0]);
	}
}
// querySelectorAll
function $All() {
	switch (arguments.length) {
		case 2:
			return arguments[0].querySelectorAll(arguments[1]);
			break;
		default:
			return document.querySelectorAll(arguments[0]);
	}
}
// createElement
function $CrE() {
	switch (arguments.length) {
		case 2:
			return arguments[0].createElement(arguments[1]);
			break;
		default:
			return document.createElement(arguments[0]);
	}
}
// addEventListener
function $AEL(...args) {
	const target = args.shift();
	return target.addEventListener.apply(target, args);
}
// Object1[prop] ==> Object2[prop]
function copyProp(obj1, obj2, prop) {
	obj1.hasOwnProperty(prop) && (obj2[prop] = obj1[prop]);
}
function copyProps(obj1, obj2, props) {
	(props || Object.keys(obj1)).forEach((prop) => (copyProp(obj1, obj2, prop)));
}

function clearChildNodes(elm) {
	for (const el of elm.childNodes) {
		elm.removeChild(el);
	}
}

// Just stopPropagation and preventDefault
function destroyEvent(e) {
	if (!e) {
		return false;
	};
	if (!e instanceof Event) {
		return false;
	};
	e.stopPropagation();
	e.preventDefault();
}

// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
// (If the request is invalid, such as url === '', will return false and will NOT make this request)
// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
// Requires: function delItem(){...} & function uniqueIDMaker(){...}
function GMXHRHook(maxXHR = 5) {
	const GM_XHR = GM_xmlhttpRequest;
	const getID = uniqueIDMaker();
	let todoList = [],
		ongoingList = [];
	GM_xmlhttpRequest = safeGMxhr;

	function safeGMxhr() {
		// Get an id for this request, arrange a request object for it.
		const id = getID();
		const request = {
			id: id,
			args: arguments,
			aborter: null
		};

		// Deal onload function first
		dealEndingEvents(request);

		/* DO NOT DO THIS! KEEP ITS ORIGINAL PROPERTIES!
		// Stop invalid requests
		if (!validCheck(request)) {
			return false;
		}
		*/

		// Judge if we could start the request now or later?
		todoList.push(request);
		checkXHR();
		return makeAbortFunc(id);

		// Decrease activeXHRCount while GM_XHR onload;
		function dealEndingEvents(request) {
			const e = request.args[0];

			// onload event
			const oriOnload = e.onload;
			e.onload = function() {
				reqFinish(request.id);
				checkXHR();
				oriOnload ? oriOnload.apply(null, arguments) : function() {};
			}

			// onerror event
			const oriOnerror = e.onerror;
			e.onerror = function() {
				reqFinish(request.id);
				checkXHR();
				oriOnerror ? oriOnerror.apply(null, arguments) : function() {};
			}

			// ontimeout event
			const oriOntimeout = e.ontimeout;
			e.ontimeout = function() {
				reqFinish(request.id);
				checkXHR();
				oriOntimeout ? oriOntimeout.apply(null, arguments) : function() {};
			}

			// onabort event
			const oriOnabort = e.onabort;
			e.onabort = function() {
				reqFinish(request.id);
				checkXHR();
				oriOnabort ? oriOnabort.apply(null, arguments) : function() {};
			}
		}

		// Check if the request is invalid
		function validCheck(request) {
			const e = request.args[0];

			if (!e.url) {
				return false;
			}

			return true;
		}

		// Call a XHR from todoList and push the request object to ongoingList if called
		function checkXHR() {
			if (ongoingList.length >= maxXHR) {
				return false;
			};
			if (todoList.length === 0) {
				return false;
			};
			const req = todoList.shift();
			const reqArgs = req.args;
			const aborter = GM_XHR.apply(null, reqArgs);
			req.aborter = aborter;
			ongoingList.push(req);
			return req;
		}

		// Make a function that aborts a certain request
		function makeAbortFunc(id) {
			return function() {
				let i;

				// Check if the request haven't been called
				for (i = 0; i < todoList.length; i++) {
					const req = todoList[i];
					if (req.id === id) {
						// found this request: haven't been called
						delItem(todoList, i);
						return true;
					}
				}

				// Check if the request is running now
				for (i = 0; i < ongoingList.length; i++) {
					const req = todoList[i];
					if (req.id === id) {
						// found this request: running now
						req.aborter();
						reqFinish(id);
						checkXHR();
					}
				}

				// Oh no, this request is already finished...
				return false;
			}
		}

		// Remove a certain request from ongoingList
		function reqFinish(id) {
			let i;
			for (i = 0; i < ongoingList.length; i++) {
				const req = ongoingList[i];
				if (req.id === id) {
					ongoingList = delItem(ongoingList, i);
					return true;
				}
			}
			return false;
		}
	}
}

// Get a url argument from lacation.href
// also recieve a function to deal the matched string
// returns defaultValue if name not found
// Args: {url=location.href, name, dealFunc=((a)=>{return a;}), defaultValue=null} or 'name'
function getUrlArgv(details) {
	typeof(details) === 'string' && (details = {
		name: details
	});
	typeof(details) === 'undefined' && (details = {});
	if (!details.name) {
		return null;
	};

	const url = details.url ? details.url : location.href;
	const name = details.name ? details.name : '';
	const dealFunc = details.dealFunc ? details.dealFunc : ((a) => {
		return a;
	});
	const defaultValue = details.defaultValue ? details.defaultValue : null;
	const matcher = new RegExp('[\\?&]' + name + '=([^&#]+)');
	const result = url.match(matcher);
	const argv = result ? dealFunc(result[1]) : defaultValue;

	return argv;
}

// Append a style text to document(<head>) with a <style> element
function addStyle(css, id) {
	const style = document.createElement("style");
	id && (style.id = id);
	style.textContent = css;
	for (const elm of $All(document, '#' + id)) {
		elm.parentElement && elm.parentElement.removeChild(elm);
	}
	document.head.appendChild(style);
}

// Save dataURL to file
function saveFile(dataURL, filename) {
	const a = document.createElement('a');
	a.href = dataURL;
	a.download = filename;
	a.click();
}

// File download function
// details looks like the detail of GM_xmlhttpRequest
// onload function will be called after file saved to disk
function downloadFile(details) {
	if (!details.url || !details.name) {
		return false;
	};

	// Configure request object
	const requestObj = {
		url: details.url,
		responseType: 'blob',
		onload: function(e) {
			// Save file
			saveFile(URL.createObjectURL(e.response), details.name);

			// onload callback
			details.onload ? details.onload(e) : function() {};
		}
	}
	if (details.onloadstart) {
		requestObj.onloadstart = details.onloadstart;
	};
	if (details.onprogress) {
		requestObj.onprogress = details.onprogress;
	};
	if (details.onerror) {
		requestObj.onerror = details.onerror;
	};
	if (details.onabort) {
		requestObj.onabort = details.onabort;
	};
	if (details.onreadystatechange) {
		requestObj.onreadystatechange = details.onreadystatechange;
	};
	if (details.ontimeout) {
		requestObj.ontimeout = details.ontimeout;
	};

	// Send request
	GM_xmlhttpRequest(requestObj);
}

// get '/' splited API array from a url
function getAPI(url = location.href) {
	return url.replace(/https?:\/\/(.*?\.){1,2}.*?\//, '').replace(/\?.*/, '').match(/[^\/]+?(?=(\/|$))/g);
}

// get host part from a url(includes '^https://', '/$')
function getHost(url = location.href) {
	const match = location.href.match(/https?:\/\/[^\/]+\//);
	return match ? match[0] : match;
}

function AsyncManager() {
	const AM = this;

	// Ongoing xhr count
	this.taskCount = 0;

	// Whether generate finish events
	let finishEvent = false;
	Object.defineProperty(this, 'finishEvent', {
		configurable: true,
		enumerable: true,
		get: () => (finishEvent),
		set: (b) => {
			finishEvent = b;
			b && AM.taskCount === 0 && AM.onfinish && AM.onfinish();
		}
	});

	// Add one task
	this.add = () => (++AM.taskCount);

	// Finish one task
	this.finish = () => ((--AM.taskCount === 0 && AM.finishEvent && AM.onfinish && AM.onfinish(), AM.taskCount));
}

// Polyfill String.prototype.replaceAll
// replaceValue does NOT support regexp match groups($1, $2, etc.)
function polyfill_replaceAll() {
	String.prototype.replaceAll = String.prototype.replaceAll ? String.prototype.replaceAll : PF_replaceAll;

	function PF_replaceAll(searchValue, replaceValue) {
		const str = String(this);

		if (searchValue instanceof RegExp) {
			const global = RegExp(searchValue, 'g');
			if (/\$/.test(replaceValue)) {
				console.error('Error: Polyfilled String.protopype.replaceAll does support regexp groups');
			};
			return str.replace(global, replaceValue);
		} else {
			return str.split(searchValue).join(replaceValue);
		}
	}
}

function randint(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Replace model text with no mismatching of replacing replaced text
// e.g. replaceText('aaaabbbbccccdddd', {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'e'}) === 'bbbbccccddddeeee'
//      replaceText('abcdAABBAA', {'BB': 'AA', 'AAAAAA': 'This is a trap!'}) === 'abcdAAAAAA'
//      replaceText('abcd{AAAA}BB}', {'{AAAA}': '{BB', '{BBBB}': 'This is a trap!'}) === 'abcd{BBBB}'
//      replaceText('abcd', {}) === 'abcd'
/* Note:
	    replaceText will replace in sort of replacer's iterating sort
	    e.g. currently replaceText('abcdAABBAA', {'BBAA': 'TEXT', 'AABB': 'TEXT'}) === 'abcdAATEXT'
	    but remember: (As MDN Web Doc said,) Although the keys of an ordinary Object are ordered now, this was
	    not always the case, and the order is complex. As a result, it's best not to rely on property order.
	    So, don't expect replaceText will treat replacer key-values in any specific sort. Use replaceText to
	    replace irrelevance replacer keys only.
	*/
function replaceText(text, replacer) {
	if (Object.entries(replacer).length === 0) {return text;}
	const [models, targets] = Object.entries(replacer);
	const len = models.length;
	let text_arr = [{text: text, replacable: true}];
	for (const [model, target] of Object.entries(replacer)) {
		text_arr = replace(text_arr, model, target);
	}
	return text_arr.map((text_obj) => (text_obj.text)).join('');

	function replace(text_arr, model, target) {
		const result_arr = [];
		for (const text_obj of text_arr) {
			if (text_obj.replacable) {
				const splited = text_obj.text.split(model);
				for (const part of splited) {
					result_arr.push({text: part, replacable: true});
					result_arr.push({text: target, replacable: false});
				}
				result_arr.pop();
			} else {
				result_arr.push(text_obj);
			}
		}
		return result_arr;
	}
}

// escape str into javascript written format
function escJsStr(str, quote='"') {
	str = str.replaceAll('\\', '\\\\').replaceAll(quote, '\\' + quote);
	quote === '`' && (str = str.replaceAll(/(\$\{[^\}]*\})/g, '\\$1'));
	return quote + str + quote;
}

function parseArgs(args, rules, defaultValues=[]) {
	// args and rules should be array, but not just iterable (string is also iterable)
	if (!Array.isArray(args) || !Array.isArray(rules)) {
		throw new TypeError('parseArgs: args and rules should be array')
	}

	// fill rules[0]
	(!Array.isArray(rules[0]) || rules[0].length === 1) && rules.splice(0, 0, []);

	// max arguments length
	const count = rules.length - 1;

	// args.length must <= count
	if (args.length > count) {
		throw new TypeError(`parseArgs: args has more elements(${args.length}) longer than ruless'(${count})`);
	}

	// rules[i].length should be === i if rules[i] is an array, otherwise it should be a function
	for (let i = 1; i <= count; i++) {
		const rule = rules[i];
		if (Array.isArray(rule)) {
			if (rule.length !== i) {
				throw new TypeError(`parseArgs: rules[${i}](${rule}) should have ${i} numbers, but given ${rules[i].length}`);
			}
			if (!rule.every((num) => (typeof num === 'number' && num <= count))) {
				throw new TypeError(`parseArgs: rules[${i}](${rule}) should contain numbers smaller than count(${count}) only`);
			}
		} else if (typeof rule !== 'function') {
			throw new TypeError(`parseArgs: rules[${i}](${rule}) should be an array or a function.`)
		}
	}

	// Parse
	const rule = rules[args.length];
	let parsed;
	if (Array.isArray(rule)) {
		parsed = [...defaultValues];
		for (let i = 0; i < rule.length; i++) {
			parsed[rule[i]-1] = args[i];
		}
	} else {
		parsed = rule(args, defaultValues);
	}
	return parsed;
}

// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
function delItem(arr, delIndex) {
	arr = arr.slice(0, delIndex).concat(arr.slice(delIndex + 1));
	return arr;
}

// type: [Error, TypeError]
function Err(msg, type=0) {
	throw new [Error, TypeError][type]((typeof MODULE_DATA === 'object' ? '[' + MODULE_DATA.name + ']' : '') + msg);
}