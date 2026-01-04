/* eslint-disable no-multi-spaces */

// ==UserScript==
// @name               generals.io+
// @name:zh-CN         generals.io+
// @name:en            generals.io+
// @namespace          generals.io_plus
// @version            0.4.2.1
// @description        A simple script that helps you to make generals.io better
// @description:zh-CN  一个简单的generals.io增强脚本
// @description:en     A simple script that helps you to make generals.io better
// @author             PY-DNG
// @license            MIT
// @match              https://generals.io/*
// @icon               data:image/png;base64,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
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @require            https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/alertify.min.js
// @resource           alertify-css   https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/alertify.min.css
// @resource           alertify-theme https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/themes/default.min.css
// @downloadURL https://update.greasyfork.org/scripts/440983/generalsio%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/440983/generalsio%2B.meta.js
// ==/UserScript==

(function __MAIN__() {
    'use strict';

	// Polyfills
	const script_name = 'generals.io+';
	const script_version = '0.4.2.1';
	const NMonkey_Info = {
		GM_info: {
			script: {
				name: script_name,
				author: 'PY-DNG',
				version: script_version
			}
		},
		requires: [
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/alertify.min.js',
				loaded: () => (typeof(alertify) === 'object'),
				execmode: 'function'
			}
		],
		resources: [
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/alertify.min.css',
				name: 'alertify-css'
			},
			{
				src: 'https://cdn.jsdelivr.net/gh/MohammadYounes/AlertifyJS@3151fa0d65909936afcbb2f1665ed4f20767bee5/build/css/themes/default.min.css',
				name: 'alertify-theme'
			}
		],
		mainFunc: __MAIN__
	};
	const NMonkey_Ready = NMonkey(NMonkey_Info);
	if (!NMonkey_Ready) {return false;}
	polyfill_replaceAll();

	// Constances
	const CONST = {
		Number: {
			Interval: 100
		},
		Storage: {
			Key: {
				CustomColor: 'User-Preferred-Color'
			}
		},
		Colors: ['red', 'green', 'lightblue', 'purple', 'teal', 'blue', 'orange', 'maroon', 'yellow', 'pink', 'brown', 'lightgreen', 'purple-blue', 'white'],
		Color: {},
		Css: {
			alertify: '.ajs-content>p {color: black;}',
			CustomColor: '.{MC} {background-color: {UCV} !important;} .{UC} {background-color: {MCV} !important;}'
		},
		Text: {
			'zh-CN': {
				CustomColor: '自定义颜色',
				EnterColor: '请输入你想要的颜色的英文名称，</br>可用的颜色为{AC}，</br>留空即使用服务器提供的颜色：',
				ColorTitle: '自定义颜色',
				DefaultColor: '',
				InvalidColor: '颜色 "{C}" 不受支持！'
			},
			'en': {
				CustomColor: 'Custom Preferred Color',
				EnterColor: 'Enter your preferred color name,</br>Available colors are {AC},</br>Leave it blank if you don\'t want to custom your color: ',
				ColorTitle: 'Custom Preferred Color',
				DefaultColor: '',
				InvalidColor: 'Color "{C}" is not supported!'
			},
			'default': {
				CustomColor: 'Custom Preferred Color',
				EnterColor: 'Enter your preferred color name,</br>Available colors are {AC},</br>Leave it blank if you don\'t want to custom your color: ',
				ColorTitle: 'Custom Preferred Color',
				DefaultColor: '',
				InvalidColor: 'Color "{C}" is not supported!'
			}
		}
	}
	for (const color of CONST.Colors) {
		CONST.Color[color] = getColorValue(color);
	}

	// Init language
	let i18n = navigator.language;
	if (!Object.keys(CONST.Text).includes(i18n)) {i18n = 'default';}

    // Arguments: level=LogLevel.Info, logContent, asObject=false
    // Needs one call "DoLog();" to get it initialized before using it!
    function DoLog() {
		// Get window
		const win = (typeof(unsafeWindow) === 'object' && unsafeWindow !== null) ? unsafeWindow : window ;

        // Global log levels set
        win.LogLevel = {
            None: 0,
            Error: 1,
            Success: 2,
            Warning: 3,
            Info: 4,
        }
        win.LogLevelMap = {};
        win.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
        win.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
        win.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
        win.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
        win.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
        win.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

        // Current log level
        DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

        // Log counter
        DoLog.logCount === undefined && (DoLog.logCount = 0);

        // Get args
        let level, logContent, asObject;
        switch (arguments.length) {
            case 1:
                level = LogLevel.Info;
                logContent = arguments[0];
                asObject = false;
                break;
            case 2:
                level = arguments[0];
                logContent = arguments[1];
                asObject = false;
                break;
            case 3:
                level = arguments[0];
                logContent = arguments[1];
                asObject = arguments[2];
                break;
            default:
                level = LogLevel.Info;
                logContent = 'DoLog initialized.';
                asObject = false;
                break;
        }

        // Log when log level permits
        if (level <= DoLog.logLevel) {
            let msg = '%c' + LogLevelMap[level].prefix;
            let subst = LogLevelMap[level].color;

            if (asObject) {
                msg += ' %o';
            } else {
                switch(typeof(logContent)) {
                    case 'string': msg += ' %s'; break;
                    case 'number': msg += ' %d'; break;
                    case 'object': msg += ' %o'; break;
                }
            }

			if (++DoLog.logCount > 512) {
				console.clear();
				DoLog.logCount = 0;
			}
            console.log(msg, subst, logContent);
        }
    }
    DoLog();

	let EB;
	main();
	function main() {
		// Common actions
		loadinResourceCSS();
		myCss();

		// Event-based actions
		EB = new EventBroadcast();
		EB.time = CONST.Number.Interval;
		EB.name = GM_info.script.name;
		initEvents();
		EB.start();

		// Clear advertisements
		EB.addEventListener('nogame', clearAds);

		// Gaming improvements
		EB.addEventListener('gamestart', mapEnhance);

		// Custom your preferred color
		const cfuncs = colorCustom();
		EB.addEventListener('gamestart', cfuncs.apply);
		EB.addEventListener('gameover', cfuncs.remove);
		EB.addEventListener('colorpanelopen', cfuncs.enable);
		EB.addEventListener('colorpanel', cfuncs.correct);

		function initEvents() {
			// Game status events
			EB.setEventTrigger('game', gaming);
			EB.setEventTrigger('nogame', () => (!gaming()));

			// Game status change events
			let game_on = gaming();
			EB.setEventTrigger('gamestart', function() {
				if (!game_on && gaming()) {
					game_on = gaming();
					return true;
				}
				return false;
			});
			EB.setEventTrigger('gameover', function() {
				if (game_on && !gaming()) {
					game_on = gaming();
					return true;
				}
				return false;
			});

			// Color-select panel displayed
			const display = () => ($('center>div>.supporter-circle') ? true : false);
			let display_on = false;
			EB.setEventTrigger('colorpanelopen', function() {
				const returnValue = (!display_on && display()) ? true : false;
				display_on = display();
				return returnValue;
			});
			EB.setEventTrigger('colorpanel', display);
		}
	}

	function myCss() {
		addStyle(CONST.Css.alertify);
	}

	function clearAds() {
		const adsSelectors = ['#main-menu-upsell-banner', '#custom-queue-ad', '#custom-queue-ad-skyscraper', '#custom-queue-ad-top', 'center>div.tips-banner+div', '#replay-ad-container'];
		$('#custom-queue-content') && ($('#custom-queue-content').style.marginLeft = '0px');
		for (const ad of adsSelectors) {
			$H(ad);
		}
	}

	function mapEnhance() {
		const elmMap = $('#gameMap');
		const capital = $('.general');

		markForever();

		// Once a grid had been visible, keep its type visible forever
		function markForever() {
			// Data
			const grids = elmMap.querySelectorAll('td');
			const fields = [];
			const mounts = [];
			const cities = [];
			const capitals = [];

			// Launch
			const interval = setInterval(mark, CONST.Number.Interval*3);
			EB.addEventListener('gameover', () => (clearInterval(interval)));
			mark();

			function mark() {
				if (!$('#gameMap')) {
					clearInterval(interval);
					mapEnhance();
					return false;
				}
				for (const grid of grids) {
					const classes = grid.className.split(' ');

					if (classes.includes('city') && !cities.includes(grid)) {
						cities.push(grid);
						keepBgImage(grid);
						DoLog(LogLevel.Success, 'Marked a city.');
					} else if (classes.includes('general') && !capitals.includes(grid)) {
						capitals.push(grid);
						keepBgImage(grid);
						DoLog(LogLevel.Success, 'Marked a capital.');
					} else if (classes.includes('mountain') && !mounts.includes(grid)) {
						mounts.push(grid);
						keepBgImage(grid);
						DoLog(LogLevel.Success, 'Marked a Mountain.');
					} else if (!classes.includes('obstacle') && !fields.includes(grid)) {
						fields.push(grid);
					}
				}

				for (const visible_grid of mounts.concat(cities).concat(capitals)) {
					markVisible(visible_grid);
				}
			}

			function keepBgImage(grid) {
				const computedStyle = getComputedStyle(grid);
				grid.style.backgroundImage = computedStyle.backgroundImage;
				grid.style.backgroundRepeat = computedStyle.backgroundRepeat;
				grid.style.backgroundPosition = computedStyle.backgroundPosition;
			}
			function markVisible(grid) {
				grid.classList.remove('fog');
			}
		}
	}

	// Custom preferred Color without premium account
	function colorCustom() {
		GM_registerMenuCommand(CONST.Text[i18n].CustomColor, custom);
		const cssid = 'User-Preferred-Color';

		function custom() {
			const box = alertify.prompt(CONST.Text[i18n].ColorTitle, CONST.Text[i18n].EnterColor.replace('{AC}', CONST.Colors.join(', ')), CONST.Text[i18n].DefaultColor, colorGot, cancel);

			function colorGot(e, color) {
				if (!CONST.Colors.includes(color)) {
					alertify.alert(CONST.Text[i18n].InvalidColor);
				}
				GM_setValue(CONST.Storage.Key.CustomColor, color);
				apply();
			}

			function cancel() {}
		}

		function apply() {
			// Get color provided by server
			const elmMap = $('#gameMap');
			const capital = $('.general');
			const myColor = getColor(capital);
			const myValue = getColorValue(myColor);
			const color = GM_getValue(CONST.Storage.Key.CustomColor, '');
			color && loadColor(color);

			// Apply user preferred color
			function loadColor(color) {
				const userColor = color;
				const userValue = getColorValue(userColor);
				addStyle(CONST.Css.CustomColor.replace('{MC}', myColor).replace('{MCV}', myValue).replace('{UC}', userColor).replace('{UCV}', userValue), cssid);
			}
		}

		function remove() {
			$R('#'+cssid);
		}

		function enable() {
			const div = $('center>div>.supporter-circle').parentElement;
			div.style.pointerEvents = 'auto';
			let selected;
			for (const span of div.children) {
				// Transmition effect
				span.style.transitionDuration = '0.3s';

				// Display current preferred color
				const color = span.style.boxShadow.match(/rgb\(\d+, \d+, \d+\)/)[0];
				if (isSameColor(color, getColorValue(GM_getValue(CONST.Storage.Key.CustomColor)))) {
					span.style.boxShadow = span.style.boxShadow.replace('0px 0px 0px 15px inset', '0px 0px 0px 3px inset');
					selected = span;
				} else {
					span.style.boxShadow = span.style.boxShadow.replace('0px 0px 0px 3px inset', '0px 0px 0px 15px inset');
				}

				// Save when clicked
				span.addEventListener('click', circleClick);
			}

			function circleClick(e) {
				const span = e.target;
				const color = span.style.boxShadow.match(/rgb\(\d+, \d+, \d+\)/)[0];
				GM_setValue(CONST.Storage.Key.CustomColor, getColorName(color));

				// Display
				span.style.boxShadow = span.style.boxShadow.replace('0px 0px 0px 15px inset', '0px 0px 0px 3px inset');
				selected.style.boxShadow = selected.style.boxShadow.replace('0px 0px 0px 3px inset', '0px 0px 0px 15px inset');
				selected = span;
			}
		}

		function correct() {
			const div = $('center>div>.supporter-circle').parentElement;
			div.style.pointerEvents = 'auto';

			for (const span of div.children) {
				// Transmition effect
				span.style.transitionDuration = '0.3s';

				// unselect not preferred color
				const color = span.style.boxShadow.match(/rgb\(\d+, \d+, \d+\)/)[0];
				if (!isSameColor(color, getColorValue(GM_getValue(CONST.Storage.Key.CustomColor)))) {
					span.style.boxShadow = span.style.boxShadow.replace('0px 0px 0px 3px inset', '0px 0px 0px 15px inset');
				}
			}
		}

		return {
			custom: custom,
			apply: apply,
			remove: remove,
			enable: enable,
			correct: correct
		}
	}

	// Whether gameboard exists
	function gaming() {
		const API = getAPI();
		return $('#gameMap .general') && (!API || !['replays', 'mapcreator'].includes(API[0])) ? true : false;
	}

	// Get the color of a grid
	function getColor(grid) {
		for (const cls of grid.classList) {
			if (CONST.Colors.includes(cls)) {
				return cls;
			}
		}
	}

	// Get the value of color name
	function getColorValue(color) {
		const elm = document.createElement('td');
		elm.classList.add(color);
		document.body.appendChild(elm);
		const value = getComputedStyle(elm).backgroundColor;
		document.body.removeChild(elm);
		return value;
	}

	// Get the name of color value
	function getColorName(color) {
		for (const [name, value] of Object.entries(CONST.Color)) {
			if (isSameColor(color, value)) {
				return name;
			}
		}
	}

	// Whether two given color is the same
	function isSameColor(c1, c2) {
		const rgb = /^rgb/;
		c1 = c1.trim().toLowerCase();
		c2 = c2.trim().toLowerCase();
		!rgb.test(c1) && (c1 = CONST.Color[c1]);
		!rgb.test(c2) && (c2 = CONST.Color[c2]);
		c1 = c1.replaceAll(', ', ',').replaceAll(' ', ',');
		c2 = c2.replaceAll(', ', ',').replaceAll(' ', ',');
		return c1 === c2;
	}

	// Basic functions
	function $(e) {return document.querySelector(e);}
	function $R(e) {const el = $(e); return el && el.parentElement.removeChild(el);}
	function $H(e) {const el = $(e); return el && (el.style.display = 'none');}

	function loadinResourceCSS() {
		for (const res of NMonkey_Info.resources) {
			const css = GM_getResourceText(res.name);
			css && addStyle(css);
		}
	}

	function EventBroadcast() {
		const EB = this;
		const _EB = {};

		// Init
		_EB.event = {};
		_EB.time = 500;
		_EB.interval = null;
		_EB.listeners = {};
		_EB.name = null;
		defineProxy(EB, _EB, 'event', false);
		defineProxy(EB, _EB, 'time', true);
		defineProxy(EB, _EB, 'interval', false);
		defineProxy(EB, _EB, 'name', true);

		// Start listen-interval
		setTimeout(EB.start, 0);

		// Add an event trigger
		EB.setEventTrigger = function(eventName, trigger) {
			EB.initEvent(eventName);
			_EB.event[eventName].trigger = trigger;
		}

		// Add an event listener
		EB.addEventListener = function(eventName, eventFunc, once=false) {
			const id = makeid();
			const listenerObj = {
				eventName: eventName,
				eventFunc: eventFunc,
				once: once
			}

			// Add to event.listeners
			EB.initEvent(eventName);
			_EB.event[eventName].listeners[id] = listenerObj;

			// Add to _EB.listeners
			_EB.listeners[id] = listenerObj;
		}

		// Remove an event listener
		EB.removeEventListener = function(id) {
			if (_EB.listeners[id]) {
				const listenerObj = _EB.listeners[id];

				// Remove from event.listeners
				delete _EB.event[listenerObj.eventName].listeners[id];

				// Remove from _EB.listeners
				delete _EB.listeners[id];
			}
		}

		// Init an event obj
		EB.initEvent = function(eventName=null) {
			const event = _EB.event[eventName] || {trigger: null, listeners: {}};
			!_EB.event[eventName] && Object.defineProperty(event.listeners, 'length', {
				configurable: false,
				enumerable: false,
				get: function() {return Object.keys(event.listeners).length;}
			});
			eventName && !_EB.event[eventName] && (_EB.event[eventName] = event);
			return event;
		}

		// Get all listeners of an event or all events
		EB.getEventListeners = function(eventName) {
			const event = _EB.event[eventName] || EB.initEvent();
			return event.listeners;
		}

		// Remove all event listeners
		EB.removeAllListeners = function(eventName=null) {
			if (eventName) {
				const event = _EB.event[eventName] || EB.initEvent();
				for (const [id, listenerObj] of Object.entries(event.listeners)) {
					EB.removeEventListener(id);
				}
			} else {
				for (const [id, listenerObj] of Object.entries(_EB.listeners)) {
					EB.removeEventListener(id);
				}
			}
		}

		// Start listening
		EB.start = function() {
			//_EB.interval = setInterval(EB.listen, _EB.time);
			next();

			function next() {
				_EB.interval = setTimeout(next, _EB.time);
				EB.listen();
			}
		}

		// Stop listening
		EB.stop = function() {
			clearInterval(_EB.interval);
			_EB.interval = null;
		}

		EB.listen = function() {
			for (const [eventName, event] of Object.entries(_EB.event)) {
				if (event.trigger()) {
					//DoLog((_EB.name ? _EB.name + ': ' : '') + 'Dispatching {} event'.replace('{}', eventName));
					for (const [id, listenerObj] of Object.entries(event.listeners)) {
						listenerObj.eventFunc();
						listenerObj.once && EB.removeEventListener(id);
					}
				}
			}
		}

		const makeid = (function() {
			let cur = 0;
			return function() {
				return ++cur;
			}
		}) ();

		function defineProxy(outerObj, innerObj, propName, writable) {
			Object.defineProperty(outerObj, propName, {
				configurable: false,
				enumerable: true,
				get: function() {
					return innerObj[propName];
				},
				set: function(newValue) {
					writable && (innerObj[propName] = newValue);
				}
			})
		}
	}

	// Just stopPropagation and preventDefault
	function destroyEvent(e) {
		if (!e) {return false;};
		if (!e instanceof Event) {return false;};
		e.stopPropagation();
		e.preventDefault();
	}

	// GM_XHR HOOK: The number of running GM_XHRs in a time must under maxXHR
	// Returns the abort function to stop the request anyway(no matter it's still waiting, or requesting)
	// (If the request is invalid, such as url === '', will return false and will NOT make this request)
	// If the abort function called on a request that is not running(still waiting or finished), there will be NO onabort event
	// Requires: function delItem(){...} & function uniqueIDMaker(){...}
	function GMXHRHook(maxXHR=5) {
		const GM_XHR = GM_xmlhttpRequest;
		const getID = uniqueIDMaker();
		let todoList = [], ongoingList = [];
		GM_xmlhttpRequest = safeGMxhr;

		function safeGMxhr() {
			// Get an id for this request, arrange a request object for it.
			const id = getID();
			const request = {id: id, args: arguments, aborter: null};

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
				if (ongoingList.length >= maxXHR) {return false;};
				if (todoList.length === 0) {return false;};
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
    // Args: name, dealFunc=(function(a) {return a;}), defaultValue=null
	function getUrlArgv(details) {
        typeof(details) === 'string'    && (details = {name: details});
        typeof(details) === 'undefined' && (details = {});
        if (!details.name) {return null;};

        const url = details.url ? details.url : location.href;
        const name = details.name ? details.name : '';
        const dealFunc = details.dealFunc ? details.dealFunc : ((a)=>{return a;});
        const defaultValue = details.defaultValue ? details.defaultValue : null;
		const matcher = new RegExp(name + '=([^&]+)');
		const result = url.match(matcher);
		const argv = result ? dealFunc(result[1]) : defaultValue;

		return argv;
	}

	// Append a style text to document(<head>) with a <style> element
    function addStyle(css, id) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        document.head.appendChild(style);
    }

	// File download function
	// details looks like the detail of GM_xmlhttpRequest
	// onload function will be called after file saved to disk
	function downloadFile(details) {
		if (!details.url || !details.name) {return false;};

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
		if (details.onloadstart       ) {requestObj.onloadstart        = details.onloadstart;};
		if (details.onprogress        ) {requestObj.onprogress         = details.onprogress;};
		if (details.onerror           ) {requestObj.onerror            = details.onerror;};
		if (details.onabort           ) {requestObj.onabort            = details.onabort;};
		if (details.onreadystatechange) {requestObj.onreadystatechange = details.onreadystatechange;};
		if (details.ontimeout         ) {requestObj.ontimeout          = details.ontimeout;};

		// Send request
		GM_xmlhttpRequest(requestObj);
	}

	// get '/' splited API array from a url
	function getAPI(url=location.href) {
		return url.replace(/https?:\/\/(.*?\.){1,2}.*?\//, '').replace(/\?.*/, '').match(/[^\/]+?(?=(\/|$))/g);
	}

	// get host part from a url(includes '^https://', '/$')
	function getHost(url=location.href) {
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

    // NMonkey By PY-DNG, 2021.07.18 - 2022.02.18, License GPL-3
	// NMonkey: Provides GM_Polyfills and make your userscript compatible with non-script-manager environment
	// Description:
	/*
	    Simulates a script-manager environment("NMonkey Environment") for non-script-manager browser, load @require & @resource, provides some GM_functions(listed below), and also compatible with script-manager environment.
	    Provides GM_setValue, GM_getValue, GM_deleteValue, GM_listValues, GM_xmlhttpRequest, GM_openInTab, GM_setClipboard, GM_getResourceText, GM_getResourceURL, GM_addStyle, GM_addElement, GM_log, unsafeWindow(object), GM_info(object)
	    Also provides an object called GM_POLYFILLED which has the following properties that shows you which GM_functions are actually polyfilled.
	    Returns true if polyfilled is environment is ready, false for not. Don't worry, just follow the usage below.
	*/
	// Note: DO NOT DEFINE GM-FUNCTION-NAMES IN YOUR CODE. DO NOT DEFINE GM_POLYFILLED AS WELL.
	// Note: NMonkey is an advanced version of GM_PolyFill (and BypassXB), it includes more functions than GM_PolyFill, and provides better stability and compatibility. Do NOT use NMonkey and GM_PolyFill (and BypassXB) together in one script.
	// Usage:
	/*
		// ==UserScript==
		// @name      xxx
		// @namespace xxx
		// @version   1.0
		// ...
		// @require   https://.../xxx.js
		// @require   ...
		// ...
		// @resource  https://.../xxx
		// @resource  ...
		// ...
		// ==/UserScript==

		// Use a closure to wrap your code. Make sure you have it a name.
		(function YOUR_MAIN_FUNCTION() {
			'use strict';
			// Strict mode is optional. You can use strict mode or not as you want.
			// Polyfill first. Do NOT do anything before Polyfill.
			var NMonkey_Ready = NMonkey({
				mainFunc: YOUR_MAIN_FUNCTION,
				name: "script-storage-key, aims to separate different scripts' storage area. Use your script's @namespace value if you don't how to fill this field.",
				requires: [
					{
						src: "https://.../xxx.js",
						loaded: function() {return boolean_value_shows_whether_this_js_has_already_loaded;}
						execmode: "'eval' for eval code in current scope or 'function' for Function(code)() in global scope or 'script' for inserting a <script> element to document.head"
					},
					...
				],
				resources: [
					{
						src: "https://.../xxx"
						name: "@resource name. Will try to get it from @resource using this name before fetch it from src",
					},
					...
				],
				GM_info: {
					// You can get GM_info object, if you provide this argument(and there is no GM_info provided by the script-manager).
					// You can provide any object here, what you provide will be what you get.
					// Additionally, two property of NMonkey itself will be attached to GM_info if polyfilled:
					// {
					//     scriptHandler: "NMonkey"
					//     version: "NMonkey's version, it should look like '0.1'"
					// }
					// The following is just an example.
					script: {
						name: 'my first userscript for non-scriptmanager browsers!',
						description: 'this script works well both in my PC and my mobile!',
						version: '1.0',
						released: true,
						version_num: 1,
						authors: ['Johnson', 'Leecy', 'War Mars']
						update_history: {
							'0.9': 'First beta version',
							'1.0': 'Finally released!'
						}
					}
					surprise: 'if you check GM_info.surprise and you will read this!'
					// And property "scriptHandler" & "version" will be attached here
				}
			});
			if (!NMonkey_Ready) {
				// Stop executing of polyfilled environment not ready.
				// Don't worry, during polyfill progress YOUR_MAIN_FUNCTION will be called twice, and on the second call the polyfilled environment will be ready.
				return;
			}

			// Your code here...
			// Make sure your code is written after NMonkey be called
			if
			// ...

			// Just place NMonkey function code here
			function NMonkey(details) {
				...
			}
		}) ();

		// Oh you want to write something here? Fine. But code you write here cannot get into the simulated script-manager-environment.
	*/
	function NMonkey(details) {
		// Init DoLog
		DoLog();

		// Get argument
		const mainFunc = details.mainFunc;
		const name = details.name || 'default';
		const requires = details.requires || [];
		const resources = details.resources || [];
		details.GM_info = details.GM_info || {};
		details.GM_info.scriptHandler = 'NMonkey';
		details.GM_info.version = '1.0';

		// Run in variable-name-polifilled environment
		if (InNPEnvironment()) {
			// Already in polifilled environment === polyfill has alredy done, just return
			return true;
		}

		// Not in polifilled environment, then polyfill functions and create & move into the environment
		// Bypass xbrowser's useless GM_functions
		bypassXB();

		// Start polyfill
		const GM_POLYFILL_KEY_STORAGE = 'GM_STORAGE_POLYFILL';
		let GM_POLYFILL_storage;
		const Supports = {
			GetStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				let storage = gstorage[name] ? gstorage[name] : {};
				return storage;
			},

			SaveStorage: function() {
				let gstorage = localStorage.getItem(GM_POLYFILL_KEY_STORAGE);
				gstorage = gstorage ? JSON.parse(gstorage) : {};
				gstorage[name] = GM_POLYFILL_storage;
				localStorage.setItem(GM_POLYFILL_KEY_STORAGE, JSON.stringify(gstorage));
			},
		};
		const Provides = {
			// GM_setValue
			GM_setValue: function(name, value) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				GM_POLYFILL_storage[name] = value;
				Supports.SaveStorage();
			},

			// GM_getValue
			GM_getValue: function(name, defaultValue) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					return GM_POLYFILL_storage[name];
				} else {
					return defaultValue;
				}
			},

			// GM_deleteValue
			GM_deleteValue: function(name) {
				GM_POLYFILL_storage = Supports.GetStorage();
				name = String(name);
				if (GM_POLYFILL_storage.hasOwnProperty(name)) {
					delete GM_POLYFILL_storage[name];
					Supports.SaveStorage();
				}
			},

			// GM_listValues
			GM_listValues: function() {
				GM_POLYFILL_storage = Supports.GetStorage();
				return Object.keys(GM_POLYFILL_storage);
			},

			// unsafeWindow
			unsafeWindow: window,

			// GM_xmlhttpRequest
			// not supported properties of details: synchronous binary nocache revalidate context fetch
			// not supported properties of response(onload arguments[0]): finalUrl
			// ---!IMPORTANT!--- DOES NOT SUPPORT CROSS-ORIGIN REQUESTS!!!!! ---!IMPORTANT!---
			// details.synchronous is not supported as Tampermonkey
			GM_xmlhttpRequest: function(details) {
				const xhr = new XMLHttpRequest();

				// open request
				const openArgs = [details.method, details.url, true];
				if (details.user && details.password) {
					openArgs.push(details.user);
					openArgs.push(details.password);
				}
				xhr.open.apply(xhr, openArgs);

				// set headers
				if (details.headers) {
					for (const key of Object.keys(details.headers)) {
						xhr.setRequestHeader(key, details.headers[key]);
					}
				}
				details.cookie ? xhr.setRequestHeader('cookie', details.cookie) : function () {};
				details.anonymous ? xhr.setRequestHeader('cookie', '') : function () {};

				// properties
				xhr.timeout = details.timeout;
				xhr.responseType = details.responseType;
				details.overrideMimeType ? xhr.overrideMimeType(details.overrideMimeType) : function () {};

				// events
				xhr.onabort = details.onabort;
				xhr.onerror = details.onerror;
				xhr.onloadstart = details.onloadstart;
				xhr.onprogress = details.onprogress;
				xhr.onreadystatechange = details.onreadystatechange;
				xhr.ontimeout = details.ontimeout;
				xhr.onload = function (e) {
					const response = {
						readyState: xhr.readyState,
						status: xhr.status,
						statusText: xhr.statusText,
						responseHeaders: xhr.getAllResponseHeaders(),
						response: xhr.response
					};
					(details.responseType === '' || details.responseType === 'text') ? (response.responseText = xhr.responseText) : function () {};
					(details.responseType === '' || details.responseType === 'document') ? (response.responseXML = xhr.responseXML) : function () {};
					details.onload(response);
				}

				// send request
				details.data ? xhr.send(details.data) : xhr.send();

				return {
					abort: xhr.abort
				};
			},

			// NOTE: options(arg2) is NOT SUPPORTED! if provided, then will just be skipped.
			GM_openInTab: function(url) {
				window.open(url);
			},

			// NOTE: needs to be called in an event handler function, and info(arg2) is NOT SUPPORTED!
			GM_setClipboard: function(text) {
				// Create a new textarea for copying
				const newInput = document.createElement('textarea');
				document.body.appendChild(newInput);
				newInput.value = text;
				newInput.select();
				document.execCommand('copy');
				document.body.removeChild(newInput);
			},

			GM_getResourceText: function(name) {
				const _get = typeof(GM_getResourceText) === 'function' ? GM_getResourceText : () => (null);
				let text = _get(name);
				if (text) {return text;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.content ? resource.content : null;
					}
				}
				return null;
			},

			GM_getResourceURL: function(name) {
				const _get = typeof(GM_getResourceURL) === 'function' ? GM_getResourceURL : () => (null);
				let url = _get(name);
				if (url) {return url;}
				for (const resource of resources) {
					if (resource.name === name) {
						return resource.src ? btoa(resource.src) : null;
					}
				}
				return null;
			},

			GM_addStyle: function(css) {
				const style = document.createElement('style');
				style.innerHTML = css;
				document.head.appendChild(style)
			},

			GM_addElement: function() {
				let parent_node, tag_name, attributes;
				const head_elements = ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript'/*, 'template'*/];
				if (arguments.length === 2) {
					tag_name = arguments[0];
					attributes = arguments[1];
					parent_node = head_elements.includes(tag_name.toLowerCase()) ? document.head : document.body;
				} else if (arguments.length === 3) {
					parent_node = arguments[0];
					tag_name = arguments[1];
					attributes = arguments[2];
				}
				const element = document.createElement(tag_name);
				for (const [prop, value] of Object.entries(attributes)) {
					element[prop] = value;
				}
				parent_node.appendChild(element);
			},

			GM_log: function() {
				const args = []
				for (let i = 0; i < arguments.length; i++) {
					args[i] = arguments[i];
				}
				console.log.apply(null, args);
			},

			GM_info: details.GM_info,

			GM: {info: details.GM_info}
		};
		const _GM_POLYFILLED = Provides.GM_POLYFILLED = {};
		for (const pname of Object.keys(Provides)) {
			_GM_POLYFILLED[pname] = true;
		}

		// Create & move into polifilled environment
		ExecInNPEnv();

		return false;

		// Bypass xbrowser's useless GM_functions
		function bypassXB() {
			if (typeof(mbrowser) === 'object' || (typeof(GM_info) === 'object' && GM_info.scriptHandler === 'XMonkey')) {
				// Useless functions in XMonkey 1.0
				const GM_funcs = [
					'unsafeWindow',
					'GM_getValue',
					'GM_setValue',
					'GM_listValues',
					'GM_deleteValue',
					'GM_xmlhttpRequest'
				];
				for (const GM_func of GM_funcs) {
					window[GM_func] = undefined;
					eval('typeof({F}) === "function" && ({F} = undefined);'.replaceAll('{F}', GM_func));
				}
				// Delete dirty data saved by these stupid functions before
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					const value = localStorage.getItem(key);
					value === '[object Object]' && localStorage.removeItem(key);
				}
			}
		}

		// Check if already in name-predefined environment
		// I think there won't be anyone else wants to use this fxxking variable name...
		function InNPEnvironment() {
			return (typeof(GM_POLYFILLED) === 'object' && GM_POLYFILLED !== null) ? true : false;
		}

		function ExecInNPEnv() {
			const NG = new NameGenerator();

			// Init names
			const tnames = ['context', 'fapply', 'CDATA', 'uneval', 'define', 'module', 'exports', 'window', 'globalThis', 'console', 'cloneInto', 'exportFunction', 'createObjectIn', 'GM', 'GM_info'];
			const pnames = Object.keys(Provides);
			const fnames = tnames.slice();
			const argvlist = [];
			const argvs = [];

			// Add provides
			for (const pname of pnames) {
				!fnames.includes(pname) && fnames.push(pname);
			}

			// Add grants
			if (typeof(GM_info) === 'object' && GM_info.script && GM_info.script.grant) {
				for (const gname of GM_info.script.grant) {
					!fnames.includes(gname) && fnames.push(gname);
				}
			}

			// Make name code
			for (let i = 0; i < fnames.length; i++) {
				const fname = fnames[i];
				const exist = eval('typeof ' + fname) !== 'undefined' ? true : false;
				argvlist[i] = exist ? fname : (Provides.hasOwnProperty(fname) ? 'Provides.'+fname : '');
				argvs[i] = exist ? eval(fname) : (Provides.hasOwnProperty(fname) ? Provides[name] : undefined);
				pnames.includes(fname) && (_GM_POLYFILLED[fname] = !exist);
			}

			// Load all @require and @resource
			loadRequires(requires, resources, function(requires, resources) {
				// Join requirecode
				let requirecode = '';
				for (const require of requires) {
					const mode = require.execmode ? require.execmode : 'eval';
					const content = require.content;
					if (!content) {continue;}
					switch(mode) {
						case 'eval':
							requirecode += content + '\n';
							break;
						case 'function': {
							const func = Function.apply(null, fnames.concat(content));
							func.apply(null, argvs);
							break;
						}
						case 'script': {
							const s = document.createElement('script');
							s.innerHTML = content;
							document.head.appendChild(s);
							break;
						}
					}

				}

				// Make final code & eval
				const varnames = ['NG', 'tnames', 'pnames', 'fnames', 'argvist', 'argvs', 'code', 'finalcode', 'wrapper', 'ExecInNPEnv', 'GM_POLYFILL_KEY_STORAGE', 'GM_POLYFILL_storage', 'InNPEnvironment', 'NameGenerator', 'LocalCDN', 'loadRequires', 'requestText', 'Provides', 'Supports', 'bypassXB', 'details', 'mainFunc', 'name', 'requires', 'resources', '_GM_POLYFILLED', 'NMonkey', 'polyfill_status'];
				const code = requirecode + 'let ' + varnames.join(', ') + ';\n(' + mainFunc.toString() + ') ();';
				const wrapper = Function.apply(null, fnames.concat(code));
				const finalcode = '(' + wrapper.toString() + ').apply(this, [' + argvlist.join(', ') + ']);';
				eval(finalcode);
			});

			function NameGenerator() {
				const NG = this;
				const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
				let index = [0];

				NG.generate = function() {
					const chars = [];
					indexIncrease();
					for (let i = 0; i < index.length; i++) {
						chars[i] = letters.charAt(index[i]);
					}
					return chars.join('');
				}

				NG.randtext = function(len=32) {
					const chars = [];
					for (let i = 0; i < len; i++) {
						chars[i] = letters[randint(0, letter.length-1)];
					}
					return chars.join('');
				}

				function indexIncrease(i=0) {
					index[i] === undefined && (index[i] = -1);
					++index[i] >= letters.length && (index[i] = 0, indexIncrease(i+1));
				}

				function randint(min, max) {
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}
			}
		}

		// Load all @require and @resource for non-GM/TM environments (such as Alook javascript extension)
		// Requirements: function AsyncManager(){...}, function LocalCDN(){...}
		function loadRequires(requires, resoures, callback, args=[]) {
			// LocalCDN
			const LCDN = new LocalCDN();

			// AsyncManager
			const AM = new AsyncManager();
			AM.onfinish = function() {
				callback.apply(null, [requires, resoures].concat(args));
			}

			// Load js
			for (const js of requires) {
				!js.loaded() && loadinJs(js);
			}

			// Load resource
			for (const resource of resoures) {
				loadinResource(resource);
			}

			AM.finishEvent = true;

			function loadinJs(js) {
				AM.add();
				LCDN.get(js.src, function(content) {
					js.content = content;
					AM.finish();
				});
			}

			function loadinResource(resource) {
				let content;
				if (typeof(GM_getResourceText) === 'function' && (content = GM_getResourceText(resource.name))) {
					resource.content = content;
				} else {
					AM.add();
					LCDN.get(resource.src, function(content) {
						resource.content = content;
						AM.finish();
					});
				}
			}
		}

		// Loads web resources and saves them to GM-storage
		// Tries to load web resources from GM-storage in subsequent calls
		// Updates resources every $(this.expire) hours, or use $(this.refresh) function to update all resources instantly
		// Dependencies: GM_getValue(), GM_setValue(), requestText(), AsyncManager(), KEY_LOCALCDN
		function LocalCDN() {
			const LC = this;
			const GM_getValue = Provides.GM_getValue, GM_setValue = Provides.GM_setValue;

			const KEY_LOCALCDN = 'LOCAL-CDN';
			const KEY_LOCALCDN_VERSION = 'version';
			const VALUE_LOCALCDN_VERSION = '0.2';

			// Default expire time (by hour)
			LC.expire = 72;

			// Try to get resource content from loaclCDN first, if failed/timeout, request from web && save to LocalCDN
			// Accepts callback only
			// Returns true if got from LocalCDN, false if got from web
			LC.get = function(url, callback, args=[]) {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				const resource = CDN[url];
				const time = (new Date()).getTime();

				if (resource && !expired(time, resource.time)) {
					callback.apply(null, [resource.content].concat(args));
					return true;
				} else {
					LC.request(url, function(content) {
						callback.apply(null, [content].concat(args));
					});
					return false;
				}
			}

			// Generate resource obj and set to CDN[url]
			// Returns resource obj
			LC.set = function(url, content) {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				const time = (new Date()).getTime();
				const resource = {
					url: url,
					time: time,
					content: content
				}
				CDN[url] = resource;
				GM_setValue(KEY_LOCALCDN, CDN);
				return resource;
			}

			// Delete one resource from LocalCDN
			LC.delete = function(url) {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				if (!CDN[url]) {
					return false;
				} else {
					delete CDN[url];
					GM_setValue(KEY_LOCALCDN, CDN);
					return true;
				}
			}

			// Delete all resources in LocalCDN
			LC.clear = function() {
				GM_setValue(KEY_LOCALCDN, {});
				upgradeConfig();
			}

			// List all resource saved in LocalCDN
			LC.list = function() {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				const urls = LC.listurls();
				const resources = [];

				for (const url of urls) {
					resources.push(CDN[url]);
				}

				return resources;
			}

			// List all resource's url saved in LocalCDN
			LC.listurls = function() {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				const keys = Object.keys(CDN);
				const urls = [];

				for (const key of keys) {
					if (key === KEY_LOCALCDN_VERSION) {continue;}
					urls.push(key);
				}

				return urls;
			}

			// Request content from web and save it to CDN[url]
			// Accepts callback only
			LC.request = function(url, callback, args=[]) {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				requestText(url, function(content) {
					LC.set(url, content);
					callback.apply(null, [content].concat(args));
				});
			}

			// Re-request all resources in CDN instantly, ignoring LC.expire
			LC.refresh = function(callback, args=[]) {
				const urls = LC.listurls();

				const AM = new AsyncManager();
				AM.onfinish = function() {
					callback.apply(null, [].concat(args))
				};

				for (const url of urls) {
					AM.add();
					LC.request(url, function() {
						AM.finish();
					});
				}

				AM.finishEvent = true;
			}

			function upgradeConfig() {
				const CDN = GM_getValue(KEY_LOCALCDN, {});
				switch(CDN[KEY_LOCALCDN_VERSION]) {
					case undefined:
						init();
						break;
					case '0.1':
						v01_To_v02();
						logUpgrade();
						break;
					case VALUE_LOCALCDN_VERSION:
						DoLog('LocalCDN is in latest version.');
						break;
					default:
						DoLog(LogLevel.Error, 'LocalCDN.upgradeConfig: Invalid config version({V}) for LocalCDN. '.replace('{V}', CDN[KEY_LOCALCDN_VERSION]));
				}
				CDN[KEY_LOCALCDN_VERSION] = VALUE_LOCALCDN_VERSION;
				GM_setValue(KEY_LOCALCDN, CDN);

				function logUpgrade() {
					DoLog(LogLevel.Success, 'LocalCDN successfully upgraded From v{V1} to v{V2}. '.replaceAll('{V1}', CDN[KEY_LOCALCDN_VERSION]).replaceAll('{V2}', VALUE_LOCALCDN_VERSION));
				}

				function init() {
					// Nothing to do here
				}

				function v01_To_v02() {
					const urls = LC.listurls();
					for (const url of urls) {
						if (url === KEY_LOCALCDN_VERSION) {continue;}
						CDN[url] = {
							url: url,
							time: 0,
							content: CDN[url]
						};
					}
				}
			}

			function clearExpired() {
				const resources = LC.list();
				const time = (new Date()).getTime();

				for (const resource of resources) {
					expired(resource.time, time) && LC.delete(resource.url);
				}
			}

			function expired(t1, t2) {
				return (t2 - t1) > (LC.expire * 60 * 60 * 1000);
			}

			upgradeConfig();
			clearExpired();
		}

		function requestText(url, callback, args=[]) {
			Provides.GM_xmlhttpRequest({
	            method:       'GET',
	            url:          url,
	            responseType: 'text',
	            onload:       function(response) {
	                const text = response.responseText;
					const argvs = [text].concat(args);
	                callback.apply(null, argvs);
	            }
	        })
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

		// Arguments: level=LogLevel.Info, logContent, asObject=false
	    // Needs one call "DoLog();" to get it initialized before using it!
	    function DoLog() {
	    	const win = typeof(unsafeWindow) !== 'undefined' ? unsafeWindow : window;

	        // Global log levels set
	        win.LogLevel = {
	            None: 0,
	            Error: 1,
	            Success: 2,
	            Warning: 3,
	            Info: 4,
	        }
	        win.LogLevelMap = {};
	        win.LogLevelMap[LogLevel.None]     = {prefix: ''          , color: 'color:#ffffff'}
	        win.LogLevelMap[LogLevel.Error]    = {prefix: '[Error]'   , color: 'color:#ff0000'}
	        win.LogLevelMap[LogLevel.Success]  = {prefix: '[Success]' , color: 'color:#00aa00'}
	        win.LogLevelMap[LogLevel.Warning]  = {prefix: '[Warning]' , color: 'color:#ffa500'}
	        win.LogLevelMap[LogLevel.Info]     = {prefix: '[Info]'    , color: 'color:#888888'}
	        win.LogLevelMap[LogLevel.Elements] = {prefix: '[Elements]', color: 'color:#000000'}

	        // Current log level
	        DoLog.logLevel = win.isPY_DNG ? LogLevel.Info : LogLevel.Warning; // Info Warning Success Error

	        // Log counter
	        DoLog.logCount === undefined && (DoLog.logCount = 0);
	        if (++DoLog.logCount > 512) {
	            console.clear();
	            DoLog.logCount = 0;
	        }

	        // Get args
	        let level, logContent, asObject;
	        switch (arguments.length) {
	            case 1:
	                level = LogLevel.Info;
	                logContent = arguments[0];
	                asObject = false;
	                break;
	            case 2:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = false;
	                break;
	            case 3:
	                level = arguments[0];
	                logContent = arguments[1];
	                asObject = arguments[2];
	                break;
	            default:
	                level = LogLevel.Info;
	                logContent = 'DoLog initialized.';
	                asObject = false;
	                break;
	        }

	        // Log when log level permits
	        if (level <= DoLog.logLevel) {
	            let msg = '%c' + LogLevelMap[level].prefix;
	            let subst = LogLevelMap[level].color;

	            if (asObject) {
	                msg += ' %o';
	            } else {
	                switch(typeof(logContent)) {
	                    case 'string': msg += ' %s'; break;
	                    case 'number': msg += ' %d'; break;
	                    case 'object': msg += ' %o'; break;
	                }
	            }

	            console.log(msg, subst, logContent);
	        }
	    }
	}

	// Polyfill String.prototype.replaceAll
	// replaceValue does NOT support regexp match groups($1, $2, etc.)
	function polyfill_replaceAll() {
		String.prototype.replaceAll = String.prototype.replaceAll ? String.prototype.replaceAll : PF_replaceAll;

		function PF_replaceAll(searchValue, replaceValue) {
			const str = String(this);

			if (searchValue instanceof RegExp) {
				const global = RegExp(searchValue, 'g');
				if (/\$/.test(replaceValue)) {console.error('Error: Polyfilled String.protopype.replaceAll does support regexp groups');};
				return str.replace(global, replaceValue);
			} else {
				return str.split(searchValue).join(replaceValue);
			}
		}
	}

	function randint(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Del a item from an array using its index. Returns the array but can NOT modify the original array directly!!
	function delItem(arr, delIndex) {
		arr = arr.slice(0, delIndex).concat(arr.slice(delIndex+1));
		return arr;
	}
})();