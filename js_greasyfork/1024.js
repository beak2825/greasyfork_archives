// ==UserScript==
// @id             WhutBBCode
// @name           WhutBBCode?
// @namespace      hateradio)))
// @author         hateradio
// @version        8.5
// @description    This is a cross-browser BBCode helper. It works with Gazelle and other sites . . . CDs and waffles, mmm.
// @homepageURL    https://greasyfork.org/en/scripts/1024-whutbbcode
// @icon           data:image/png;base64,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
// @screenshot     https://raw.githubusercontent.com/hateradio/wbb/master/screenshot.png
// @grant          GM_Log

// Not Gazelles

// @include        http*://*waffles.ch/forum/*
// @include        http*://*waffles.ch/details.php*
// @include        http*://*waffles.ch/my.php*
// @include        http*://*waffles.ch/bbcode.php*
// @include        http*://*waffles.ch/forums.php*
// @include        http*://*waffles.ch/upload.php*

// @include        http*://*cinemageddon.net/*
// @include        http*://*myanonamouse.net/*
// @include        http*://*torrentday.com/*

// Beautiful Gazelles

// @include        http*://*redacted.sh/*
// @include        http*://*gazellegames.net/*
// @include        http*://*orpheus.network/*
// @include        http*://*indietorrents.com/*
// @include        http*://*brokenstones.club/*
// @include        http*://*bs.lunartype.com/*
// @include        http*://*alpharatio.cc/*
// @include        http*://*secret-cinema.pw/*
// @include        http*://*broadcasthe.net/*


// RIP :(

// @include        http*://*what.cd/*

// !update         Nov 24 2024
// !since          Sep 30 2010
// 2010+, hateradio
// Please don't modify or edit my script and re-release it. D:
// Send me a message if you want something modified.
// Bug? Fix? Submit an Issue or Pull Request | https://github.com/hateradio/wbb

// @downloadURL https://update.greasyfork.org/scripts/1024/WhutBBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/1024/WhutBBCode.meta.js
// ==/UserScript==

/**
### Updates

##### 8.5

 *   +https

#### 8.4

 *   -.ch . . . +.sh

#### 8.3.1

 *   SVG icon fix

#### 8.3

 *   Adds dark theme support

#### 8.2

 *   Replace className and set/getAttribute with classList and dataset
 *   Fix a margin issue for some stylesheets

#### 8.1.1

 *   Add support for torrentday.com, passthepopcorn.me, myanonamouse.net, broadcasthe.net

#### 8.1

 *   Enhancement: Edit button now re-creates the WhutBBCode instance instead of overwriting it

#### 8

 *   New Bootstrap icons
 *   New button layouts
 *   New button text (for option with no icons)
 *   Use icon names from Bootstrap
 *   New blueprint for orph

#### 7

 *   removes IE code
 *   fixes icons for `[hr]` and `[pad]`

#### 6.6

 *   replaces `keypress` with `keydown` in Firefox

#### 6.5

 *   fixes preview in inbox
 *   adds `hr` button

#### 6

 *   removes apl, adds orph

#### 5.3
 *   adds new BB code tags for RED (`[pad]`, `[php]`)
 *   adds a line break before list item tags
 *   makes sure to only add unique emoticons

#### 5.2
 *   changes JSON version from string to int

#### 5.1.1
 *   checks that site configuration exists
 *   adds grunt and node package files

#### 5.1

 *   removes unnecessary site configurations

#### 5

 *   simplifies Gazelle site inclusion, only requires to use @include

// #Updates
 */

(function () {
	'use strict';

	// helpers
	var dom, strg, update;

	// S T O R A G E HANDLE
	strg = {
		on: (function () { try { var a, b = localStorage, c = Math.random().toString(16).substr(2, 8); b.setItem(c, c); a = b.getItem(c); return a === c ? !b.removeItem(c) : false; } catch (e) { return false; } }()),
		read: function (key) { return this.on ? JSON.parse(localStorage.getItem(key)) : false; },
		save: function (key, dat) { return this.on ? !localStorage.setItem(key, JSON.stringify(dat)) : false; },
		wipe: function (key) { return this.on ? !localStorage.removeItem(key) : false; },
		zero: function (o) { var k; for (k in o) { if (o.hasOwnProperty(k)) { return false; } } return true; },
		grab: function (key, def) { var s = strg.read(key); return strg.zero(s) ? def : s; }
	};

	// M I S C HANDLE
	dom = {
		// a simple list iterator function for arrays, nodelists, etc
		aEach: function (list, cb, scope) { var i, j = list.length; for (i = 0; i < j; i++) { if (cb.call(scope, list[i], i, list) === false) { break; } } },
		// a simple object-type iterator | todo reverse cb order
		oEach: function (object, cb, scope) { var key; for (key in object) { if (object.hasOwnProperty(key)) { if (cb.call(scope, key, object[key], object) === false) { break; } } } },
		dom: function (name, attr, child, parent) {
			// dom element creator
			// attr is an object of attributes to apply
			// a child node to attach to this element
			// a parent node for this element
			var e = document.createElement(name);
			if (attr.txt) {
				e.appendChild(document.createTextNode(attr.txt));
				delete attr.txt;
			}
			dom.oEach(attr, function (key, data) {
				if (typeof data === 'object') {
					dom.oEach(data, function (name, value) {
						if (key === 'attr') {
							e.setAttribute(name, value);
						} else {
							e[key][name] = value;
						}
					});
				} else {
					e[key] = data;
				}
			});
			if (child) { e.appendChild(child); }
			if (parent) { parent.appendChild(e); }
			return e;
		},
		click: function (el) {
			try {
				return !el.click();
			} catch (err) {
				var e = document.createEvent('MouseEvents');
				e.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				return el && !el.dispatchEvent(e);
			}
		},
		css: function (t) {
			if (!this.style) {
				this.style = document.createElement('style');
				this.style.type = 'text/css';
				document.head.appendChild(this.style);
			}
			this.style.appendChild(document.createTextNode(t + '\n'));
		},
		js: function (t) {
			var j = document.createElement('script');
			j.type = 'text/javascript';
			j[/^https?\:\/\//i.test(t) ? 'src' : 'textContent'] = t;
			document.head.appendChild(j);
		},
		svg: function (path) {
			var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="wbb-svg" viewBox="0 0 16 16" fill="#d5d5d5">' + path + '</svg>';
			var base64 = window.btoa(svg);
			// return 'url(data:image/svg+xml;utf8,' + svg + ')';
			return "url(data:image/svg+xml;base64," + base64 + ")";
		}
	};

	// U P D A T E HANDLE
	update = {
		name: 'WhutBBCode?',
		version: 8500,
		key: 'ujs_WBB_UPDT_HR',
		urij: 'https://hateradio.github.io/wbb/wbb.json',
		page: 'https://greasyfork.org/en/scripts/1024-whutbbcode',
		interval: 5,
		day: (new Date()).getTime(),
		time: function () { return new Date(this.day + (1000 * 60 * 60 * 24 * this.interval)).getTime(); },
		notification: function (j) {
			if (this.version < j.version) {
				strg.save(this.key, { date: this.time(), version: j.version, page: j.page });
				this.link();
			}
		},
		link: function () {
			this.csstxt();

			var a = document.createElement('a'), b = strg.read(this.key);
			a.href = b.page || this.page;
			a.id = 'userscriptupdater2';
			a.title = 'Update now.';
			a.target = '_blank';
			a.textContent = 'An update for ' + this.name + ' is available.';
			a.addEventListener('click', function () { this.style.display = 'none'; }, false);
			document.body.appendChild(a);
		},
		xhr: function () {
			var x = new XMLHttpRequest();
			x.addEventListener('load', function () { update.notification(JSON.parse(this.responseText)); }, false);
			x.open('get', update.urij, true);
			x.send();
		},
		check: function (opt) {
			if (!strg.on) { return; }
			if (window.chrome && window.chrome.extension) { return; }
			var stored = strg.read(this.key), page;

			if (opt || !stored || stored.date < this.day) {
				page = (stored && stored.page) || this.page;
				strg.save(this.key, {date: this.time(), version: this.version, page: page});
				this.xhr();
			} else if (this.version < stored.version) {
				this.link();
			}
		},
		csstxt: function () {
			if (!this.pop) { this.pop = true; dom.css('#userscriptupdater2,#userscriptupdater2:visited{box-shadow:1px 1px 6px #7776;border-bottom:3px solid #d65e55;cursor:pointer;color:#555;font-family:sans-serif;font-size:12px;font-weight:700;text-align:justify;position:fixed;z-index:999999;right:10px;top:10px;background:#ebebeb url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTguODQ4NTMgMTk5LjM4MzA3Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNC4yNzYgLTE2LjM2NykiPjxjaXJjbGUgY3g9IjEwNC4zMjEiIGN5PSIxMTYuMzI3IiByPSI5OC4yNzQiIGZpbGw9IiNkNjVlNTUiLz48cGF0aCBmaWxsPSIjZTljZTAyIiBzdHJva2U9IiNlOWM4MDIiIHN0cm9rZS13aWR0aD0iMTYuNyIgZD0iTTE2Ni40NSAxNTcuMzEySDQxLjg5bDMxLjE0LTUzLjkzNSAzMS4xNC01My45MzUgMzEuMTM3IDUzLjkzNXoiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48dGV4dCB4PSI4NS42NDMiIHk9IjE1MS44NjYiIGZpbGw9IiNkNjVlNTUiIHN0cm9rZS13aWR0aD0iMS40NzciIHN0eWxlPSJsaW5lLWhlaWdodDoxLjI1Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0Jvb2sgQW50aXF1YSciIGZvbnQtd2VpZ2h0PSI0MDAiIGZvbnQtc2l6ZT0iNTkuMDg4IiBmb250LWZhbWlseT0iQm9vayBBbnRpcXVhIiBsZXR0ZXItc3BhY2luZz0iMCIgd29yZC1zcGFjaW5nPSIwIj48dHNwYW4geD0iODUuNjQzIiB5PSIxNTEuODY2IiBzdHlsZT0iLWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjonQm9vayBBbnRpcXVhJyIgZm9udC13ZWlnaHQ9IjcwMCIgZm9udC1zaXplPSIxMjYuMDU0Ij4hPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg==) no-repeat 10px center;background-size:40px;padding:0 20px 0 60px;height:55px;line-height:55px}#userscriptupdater2:hover,#userscriptupdater2:visited:hover{color:#b33a3a !important;border-color:#ce4b30}'); }
		}
	};
	update.check();

	/**
	 * WhutBB Class
	 * The principal class should not be used directly,
	 * use WhutBB.create() instead
	 *
	 * Uses a textarea as a reference to attach elements and events
	 *
	 * @param textarea to use
	 * @param id to place on the textarea
	 */
	function WhutBB(textarea, id) {
		this.textarea = textarea;
		this.textarea.classList.add('wbbarea');
		this.textarea.dataset.wbb = id;
		this.id = id;
		this.wrap = dom.dom('div', { className: 'wbbcode ' + WhutBB.$.getWrapClass() });

		WhutBB.Panel.copyTo(this);
		this.buttonList = this.makeButtonList();

		this.insert(WhutBB.config.beneath);
		this.events();
	}

	window.WhutBB = WhutBB;

	WhutBB.mac = /(?:^mac)/i.test(navigator.platform);

	// Array.from(document.querySelectorAll('script')).filter(function (e) { return e.src.includes('global.js?v='); }).length > 0
	WhutBB.gazelle = document.querySelector('div#wrapper > div#content > div.thin');
	WhutBB.gazelleBlacklist = /(?:\/logchecker)|(?:user.php\?action=notify)|(?:tools.php\?action=clear_cache)/i;

	WhutBB.set = {};

	/**
	 * The factory gets all textareas on the page and creates new WhutBB instances
	 * for textareas that are not read-only or disabled
	 */
	WhutBB.factory = function () {
		dom.aEach(document.getElementsByTagName('textarea'), function (textarea) {
			if (!textarea.disabled && !textarea.readOnly) {
				WhutBB.create(textarea);
			}
		});
	};

	/**
	 * Creates a WhutBBCode? instance for a textarea
	 * Ignores textareas that contain the class noWhutBB
	 *
	 * Stores reference in WhutBB.set
	 *
	 * @param textarea to use
	 * @param force forces the creation of a new instance
	 */
	WhutBB.create = function (textarea, force) {
		if (!WhutBB.$.ignore.test(textarea.getAttribute('class'))) {
			var id = WhutBB.id(textarea);
			if (!WhutBB.set[id] || force === true) {
				WhutBB.set[id] = new WhutBB(textarea, id);
			}
			return WhutBB.set[id];
		}
	};

	/**
	 * Locates or returns a unique ID
	 * @param textarea to use
	 */
	WhutBB.id = function (textarea) {
		var dat = textarea.dataset.wbb;
		if (dat && dat.length > 0) {
			return dat;
		}
		return Math.random().toString(32);
	};

	/**
	 * Inserts the buttons beneath or above a textarea
	 */
	WhutBB.prototype.insert = function (beneath) {
		var node = beneath ? this.textarea.nextSibling : this.textarea;
		this.textarea.parentNode.insertBefore(this.wrap, node);
	};


	/**
	 * @param {HTMLTextAreaElement} textarea Replace the current textarea
	 */
	WhutBB.prototype.update = function (textarea) {
		if (this.textarea.isEqualNode(textarea)) {
			return this.show();
		}

		this.textarea.remove();
		this.textarea = textarea;
		this.textarea.classList.add('wbbarea');
		this.insert(WhutBB.config.beneath);

		// wouldn't need to do this if the textarea were within the wrap . . .
		this.textarea.addEventListener('keydown', WhutBB.evt.key.register(this), false);
	};

	/**
	 * Attaches event handlers
	 */
	WhutBB.prototype.events = function () {
		this.textarea.addEventListener('keydown', WhutBB.evt.key.register(this), false);
		this.wrap.addEventListener('click', WhutBB.evt.mouse.register(this), false);
	};

	/**
	 * Hides this instance's elements
	 */
	WhutBB.prototype.hide = function () {
		this.wrap.classList.add('wbbhide');
	};

	/**
	 * Shows this instance's elements
	 */
	WhutBB.prototype.show = function () {
		this.wrap.classList.remove('wbbhide');
	};

	/**
	 * Is the instance visible?
	 */
	WhutBB.prototype.isVisble = function () {
		return !this.wrap.classList.contains('wbbhide');
	};

	/**
	 * Returns a button (if any)
	 * @param name of the button to get
	 */
	WhutBB.prototype.getButton = function (name) {
		return this.buttonList[name];
	};

	/**
	 * Builds a list of DOM buttons for referencing
	 * Used for keyboard shortcuts
	 */
	WhutBB.prototype.makeButtonList = function () {
		var list = {};
		dom.aEach(this.panels.button.getElementsByTagName('button'), function (el) {
			list[el.name] = el;
		});
		return list;
	};

	// WhutBB.$ is a collection of misc functions and storage
	// IMPORTANT: To add a new site, add a regular expression to the "web" array
	WhutBB.$ = {
		ignore: /(?:\b(?:noWhutBB)\b)/i, // Ignore textareas with a CSS class of "noWhutBB"
		web: [
			[':test', /^$|^localhost$/],
			['red', /(?:redacted)\.ch/],
			['notwhatcd', /(?:notwhat)\.cd/],
			['btn', /(?:broadcasthe)\.net/],
			['gazellegames', /(?:gazellegames)\.net/],
			['myanonamouse', /(?:myanonamouse)\.net/],
			['orpheus', /(?:orpheus)\.network/],
			['bs', /(?:bs\.lunartype)\.com/],
			['waffles', /(?:waffles\.ch)/],
			['indietorrents', /(?:indietorrents\.com)/],
			['torrentday', /(?:torrentday\.com)/],
			// ['what', /(?:what)\.cd/]
			// /(?:(last)(?:fm)?\.fm)/,
		],
		wrapClasses: [['wbbimgless', 'wbbimg'], ['wbblight', 'wbbdark']], // Toggles icons & theme on buttons
		getWrapClass: function () {
			return this.wrapClasses[0][Number(WhutBB.user.settings.icon)] + ' ' + this.wrapClasses[1][Number(WhutBB.user.settings.theme)];
		},
		svgCss: function () {
			return Object.keys(WhutBB.db.icons).map(function (icon) {
				var svg = dom.svg(WhutBB.db.icons[icon]);
				return `.wbbimg .wbb-icon.wbb-icon-${icon} { -webkit-mask-image: ${svg}; mask-image: ${svg}; }`;
			}).join('');
		},
		css: function () {
			var svgs = WhutBB.$.svgCss();
			// console.log(svgs);
			return ' .wbbcode button::-moz-focus-inner{border:0;padding:0}.wbbcode div,.wbbcode ul{margin:.2em;padding:.1em}.wbbset li{display:inline;margin:2px}.wbbset label input{vertical-align:text-bottom}.wbbset li label input{margin:0 3px 0 0}.wbbcode{width:' + WhutBB.config.width + 'px !important;font-size:11px;font-family:Tahoma, sans-serif;margin:auto!important;padding:3px}.wbbcode div{text-align:center !important}.sidebar .wbbcode {width: 100% !important;}.wbbcode.wbb_noimg button{background-image:none}.wbbcode.wbbimg button span{text-indent:-100px;overflow:hidden;display:inline-block;width:16px;height:16px}.wbbcode.wbbimgless button span{margin:0;background:none}.wbbcode button.whutbbutton{float:none;overflow:hidden;background:#eee;color:#555;font-size:11px;font-family:Arial, sans-serif;font-weight:400;cursor:pointer;width:22px;height:21px;text-shadow:#fff 1px 1px 1px;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #ccc;border-bottom:1px solid #ccc;-moz-border-radius:2px;border-radius:2px;-moz-transition-duration:.2s;-webkit-transition-duration:.2s;-o-transition:none;transition-duration:.2s;vertical-align:middle;margin:0 1px 3px;padding:1px}.wbbcode button:hover{background-color:#fff;color:#555;border-top:1px solid #eee;border-left:1px solid #eee;border-right:1px solid #bbb;border-bottom:1px solid #bbb}.wbbcode button:active span{margin:3px 0 0 1px}.wbblink{padding:2px 0}.wbbemot,.wbbset{overflow:auto;margin:auto}.wbbset{overflow:hidden}.wbbemot{max-height:150px;box-shadow:0 0 3px #777;padding:3px}.wbbemot img,.wbbemot div{cursor:pointer}div.wbbcode button.wbbpressed{background-color:#ddd;border-top:1px solid #aaa;border-left:1px solid #aaa;border-right:1px solid #eee;border-bottom:1px solid #eee}.wbbcon{color:#d06620;height:1em}textarea[id^=editbox]{max-height:400px;overflow:auto!important}.wbbarea{outline-color:#ADD8E6;max-height:500px!important;overflow:auto!important;display:block;margin:3px auto 6px}.wbbshortcut{overflow:hidden;text-align:center;color:#2F2F2F;margin:0;padding:0}.wbbshortcut li{background:#eee;border-top:1px solid #fff;border-left:1px solid #fff;border-right:1px solid #ccc;border-bottom:1px solid #ccc;border-radius:2px;display:inline-block;zoom:1;vertical-align:top;margin:3px;padding:1em .5em}* html .wbbshortcut li{display:inline}.wbbshortcut li.wbbnotes{width: 95%;height: auto;}.wbbshortcut li strong {font-weight:bold;border:1px solid #DEDEDE;padding:0 3px;background:#f3f3f3;border-radius:3px;}.wbb-key{display:block;margin: 0 0 4px;}.wbbhide,.hidden.wbbarea{display:none !important}.wbb-svg{height:16px;width:16px}' + svgs + `.wbbcode.wbbdark button.whutbbutton {
  background: #414148 !important;
  color: #d4d4d4;
  text-shadow: #282828 1px 1px 1px;
  border-top: 1px solid #565656;
  border-left: 1px solid #404040;
  border-right: 1px solid #444;
  border-bottom: 1px solid #414141;
  box-shadow: rgba(29, 29, 29, 0.3) 0px 0px 5px 0px, rgb(62, 62, 62) 0px 0px 3px 0px inset, rgb(68, 68, 68) 0px 1px 0px 0px inset;
}

.wbbcode.wbbimg.wbblight .wbb-icon { background: #333 }
.wbbcode.wbbimg.wbbdark .wbb-icon { background: #d5d5d5 }


`;
		},
		detectSite: function () {
			var website = WhutBB.gazelle ? ':gazelle' : ':generic';
			dom.aEach(this.web, function (site) {
				if (site[1].test(document.domain) && WhutBB.db.sites[site[0]]) {
					website = site[0];
					return false;
				}
			});
			return website;
		}
	};

	/**
	 * The WhutBBCode? initializer
	 *
	 * @param config, see WhutBB.Settings
	 *
	 * example:
	 *
	 *   WhutBB.init({
	 *     emoticonDir: 'https://ssl.what.cd/static/common/smileys/',
	 *     emoticons: WhutBB.db.emoticons.gazelle.slice(0, 4),
	 *     blueprint: [
	 *       ['b', 'i', 'u', 's'], ['code'],
	 *       ['color', 'size'], ['*'],
	 *       ['url', 'img'], ['quote'],
	 *       ['erase'], ['emoticon', 'shortcut', 'settings']
	 *     ]
	 *   });
	 *
	 */
	WhutBB.init = function (config) {
		if (WhutBB.gazelle && WhutBB.gazelleBlacklist.test(document.location.href)) {
			console.log('WhutBBCode?: Will not run in ' + RegExp.lastMatch + '!');
			return;
		}

		WhutBB.config = new WhutBB.Settings(config || WhutBB.db.getSiteSettings(WhutBB.$.detectSite()));
		try {
			console.info('WhutBBCode? mode ' + WhutBB.config.name);
			console.log(WhutBB.config);
		} catch (e) {}

		WhutBB.user.load();
		dom.css(WhutBB.$.css());
		WhutBB.db.setupShortcutMap();
		WhutBB.Panel.construct();

		if (WhutBB.gazelle) {
			document.getElementById('content').addEventListener('click', WhutBB.evt.delegate.edit, false);
			if (document.getElementById('messageform')) {
				document.getElementById('messageform').addEventListener('click', WhutBB.evt.delegate.inbox);
			}

			if (document.getElementById('type')) {
				document.getElementById('type').addEventListener('change', WhutBB.evt.delegate.report);

				window.setTimeout(function () {
					WhutBB.factory();
					return WhutBB.set[RegExp.lastParen].show();
				}, 500);
			}
		}
	};

	/**
	 * Settings storage management
	 * Uses localStorage to store a user's settings
	 *
	 * Sends an appropriate message when settings are saved or not
	 *
	 * All settings are stored in the options object. These are
	 * also used in the Panel class, which generates check boxes per option.
	 */
	WhutBB.user = {
		message: [
			'Settings failed to save. D:',
			'Settings saved. :D'
		],
		options: {
			prompt: {
				txt: 'Prompts',
				title: 'Show browser prompts.',
				value: false
			},
			icon: {
				txt: 'Icons',
				title: 'Show icons.',
				value: false
			},
			theme: {
				txt: 'Dark Theme',
				title: 'Toggle light or dark theme',
				value: false,
			},
			link: {
				txt: 'WhutBBCode? Link',
				title: 'Show WhutBBCode? link',
				value: true
			}
		},
		load: function () {
			this.set(strg.grab('wbb3', this.defaults()));
			// console.log('load', this.settings);
		},
		set: function (settings) {
			this.settings = this.validate(settings);
		},
		save: function (settings) {
			WhutBB.Panel.message(this.message[Number(strg.save('wbb3', this.validate(settings)))]);
			return strg.on ? this.load() : this.set(settings);
		},
		validate: function (settings) { // returns only valid settings that exist in options
			var valid = {};
			dom.oEach(this.options, function (name) {
				valid[name] = !!settings[name];
			});
			return valid;
		},
		defaults: function () {
			var defaults = {};
			dom.oEach(this.options, function (name, options) {
				defaults[name] = options.value;
			});
			return defaults;
		},
		settings: {}
	};

	/**
	 * Psuedo-Database
	 * Contains all sites, buttons, emoticons, shortcuts
	 *
	 * Shortcuts are sorted by modifier key (ctrl/alt/ctrl+alt)
	 * Modifier properties (a single letter) should correspond to a keyboard key letter
	 * and the value (text) to a button name (WhutBB.db.button[text])
	 * Don't use CTRL with W, T, N, O (Chromium/IE Bugs)
	 *
	 * Special Note: Meta key (such as that on a Mac) is aliased to CTRL,
	 * pressing either key returns the same result
	 *
	 */
	WhutBB.db = {
		sites: {
			':default': function () {
				return {
					name: '',
					link: 'https://greasyfork.org/en/scripts/1024-whutbbcode',
					beneath: true,
					blueprint: [],
					width: 470,
					emoticonDir: '',
					emoticonMax: 39,
					emoticons: [['', '']], // null emoticon
					shortcuts: WhutBB.db.shortcuts
				};
			},
			':generic': function () {
				return {
					emoticonDir: 'https://orpheus.network/static/common/smileys/',
					emoticons: WhutBB.db.emoticons.gazelle.slice(0, 4),
					blueprint: [
						['b', 'i', 'u', 's'], ['code'],
						['color', 'size'], ['*'],
						['url', 'img'], ['quote'],
						['erase'], ['emoticon', 'shortcut', 'settings']
					]
				};
			},
			':test': function () { // for tests
				return {
					emoticonDir: 'https://orpheus.network/static/common/smileys/',
					emoticons: WhutBB.db.emoticons.gazelle,
					blueprint: [
						['b', 'i', 'u', 's', 'code'],
						['font', 'color', 'size'],
						['heading', 'important'],
						['align', 'left', 'center', 'right'],
						['gz_left', 'gz_center', 'gz_right'],
						['#', '*'],
						['url', 'img'],
						['quote'],
						['pre', 'gz_src', 'php'],
						['hide', 'spoiler', 'mature'],
						['artist', 'user', 'wiki', 'torrent', 'search', 'gz_rule'],
						['pl', 'collage', 'forum'],
						['tex'],
						['plain', 'hr', 'pad'],
						['youtube'],
						['table', 'tr', 'th', 'td'],
						['emoticon', 'shortcut', 'settings'],
						['erase']
					]
				};
			},
			':gazelle': function () {
				return {
					emoticonDir: '/static/common/smileys/',
					emoticons: 'gazelle',
					blueprint: 'gazelle'
				};
			},
			':markdown': function () {
				return {};
			},
			// Custom Site Rules
            red: function () {
				return {
					// width: 470,
					link: '/wiki.php?action=article&name=BBCode',
					emoticonDir: '/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.red)),
					blueprint: [
						['b', 'i', 'u', 's'], ['color', 'size'],
						['heading', 'important'], ['gz_left', 'gz_center', 'gz_right'],
						['#', '*'], ['url', 'img'], ['quote'], ['hide', 'mature'],
						['artist', 'torrent', 'user', 'wiki', 'gz_rule'], ['pre', 'php', 'code', 'plain'],
						['hr', 'pad'], ['tex'],
						[ 'erase'], ['emoticon', 'shortcut', 'settings']
					]
				};
			},
			what: function () {
				// rip
				return {
					link: '/wiki.php?action=article&name=BBCode',
					emoticonDir: 'https://what.cd/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.what)),
					blueprint: 'gazelle'
				};
			},
			notwhatcd: function () {
				return {
					emoticonDir: 'https://notwhat.cd/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.notwhatcd)),
					blueprint: 'gazelle'
				};
			},
			gazellegames: function () {
				return {
					emoticonDir: 'https://gazellegames.net/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.gazellegames)),
					width: 430,
					blueprint: 'gazelle'
				};
			},
			orpheus: function () {
				return {
					link: '/wiki.php?action=article&id=43',
					emoticonDir: '/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.orpheus)),
					blueprint: [
						['b', 'i', 'u', 's'], ['color', 'size'],
						['heading', 'important'], ['gz_left', 'gz_center', 'gz_right'],
						['#', '*'], ['url', 'img'], ['quote', 'hide', 'mature'],
						['artist', 'torrent', 'pl', 'collage'], ['user', 'wiki', 'gz_rule'],
						['pre', 'code', 'plain', 'tex'],
						[ 'erase'], ['emoticon', 'shortcut', 'settings']
					]
				};
			},
			bs: function () {
				return {
					emoticonDir: 'https://bs.lunartype.com/static/common/smileys/',
					emoticons: WhutBB.db.uniqueEmoticons(WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.bs)),
					blueprint: 'gazelle'
				};
			},
			indietorrents: function () {
				return {
					link: '/wiki.php?action=article&id=3',
					emoticonDir: '/static/common/smileys/',
					emoticons: 'indie',
					width: 440,
					blueprint: [
						['b', 'i', 'u', 's'], ['color', 'size'],
						['gz_left', 'gz_center', 'gz_right'], ['*'], ['url', 'img', 'youtube'],
						['quote', 'pre', 'gz_src', 'hide'], ['table', 'tr', 'th', 'td'],
						['artist', 'user', 'wiki'], ['tex', 'plain'],
						['erase'], ['emoticon', 'shortcut', 'settings']
					]
				};
			},
			waffles: function () {
				WhutBB.db.buttons.raw = WhutBB.db.buttons.plain;

				return {
					link: '/bbcode.php',
					emoticonDir: 'https://d17wj6ajhy2qee.cloudfront.net/assets/images/smilies/',
					emoticons: 'waffles',
					beneath: false,
					width: 540,
					blueprint: [
						['b', 'i', 'u', 's'], ['size', 'color', 'font', 'spoiler'],
						['*'], ['url', 'img', 'youtube'],
						['center', 'quote', 'pre', 'raw'],
						['artist', 'user', 'torrent', 'search'],
						['erase'], ['emoticon', 'shortcut', 'settings']
					]
				};
			},
		}, // icons (c) Bootstrap https://icons.getbootstrap.com/
		icons: {
			typeBold: '<path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z"></path>',
			typeItalic: '<path d="M7.991 11.674L9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"></path>',
			typeUnderline: '<path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136z"></path> <path fill-rule="evenodd" d="M12.5 15h-9v-1h9v1z"></path>',
			typeStrikethrough: '<path d="M8.527 13.164c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5h3.45c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967zM6.602 6.5H5.167a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607 0 .31.083.581.27.814z"></path> <path fill-rule="evenodd" d="M15 8.5H1v-1h14v1z"></path>',
			code: '<path fill-rule="evenodd" d="M5.854 4.146a.5.5 0 0 1 0 .708L2.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm4.292 0a.5.5 0 0 0 0 .708L13.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"></path>',
			flag: '<path fill-rule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"></path> <path fill-rule="evenodd" d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 1 1-.515-.858C4.735 7.909 5.348 7.5 6.5 7.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V2.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 3.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 0 1-.554-.832l.04-.026z"></path>',
			dropletHalf: '<path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0c.109.363.234.708.371 1.038.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8zm.413 1.021A31.25 31.25 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"></path> <path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87l-.894-.448z"></path>',
			textareaT: '<path fill-rule="evenodd" d="M14 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path> <path fill-rule="evenodd" d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5v4h-1v-4A.5.5 0 0 0 13 2H3a.5.5 0 0 0-.5.5v4h-1v-4zm1 7v4a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-4h1v4A1.5 1.5 0 0 1 13 15H3a1.5 1.5 0 0 1-1.5-1.5v-4h1z"></path> <path d="M11.434 4H4.566L4.5 5.994h.386c.21-1.252.612-1.446 2.173-1.495l.343-.011v6.343c0 .537-.116.665-1.049.748V12h3.294v-.421c-.938-.083-1.054-.21-1.054-.748V4.488l.348.01c1.56.05 1.963.244 2.173 1.496h.386L11.434 4z"></path>',
			justify: '<path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>',
			textLeft: '<path fill-rule="evenodd" d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>',
			textCenter: '<path fill-rule="evenodd" d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>',
			textRight: '<path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path>',
			listOl: '<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"></path> <path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338v.041zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635V5z"></path>',
			listUl: '<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"></path>',
			link45deg: '<path d="M4.715 6.542L3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.001 1.001 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"></path> <path d="M5.712 6.96l.167-.167a1.99 1.99 0 0 1 .896-.518 1.99 1.99 0 0 1 .518-.896l.167-.167A3.004 3.004 0 0 0 6 5.499c-.22.46-.316.963-.288 1.46z"></path> <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 0 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 0 0-4.243-4.243L6.586 4.672z"></path> <path d="M10 9.5a2.99 2.99 0 0 0 .288-1.46l-.167.167a1.99 1.99 0 0 1-.896.518 1.99 1.99 0 0 1-.518.896l-.167.167A3.004 3.004 0 0 0 10 9.501z"></path>',
			image: '<path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm-12-1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12z"></path> <path d="M10.648 7.646a.5.5 0 0 1 .577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71z"></path> <path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>',
			chatSquareQuote: '<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2.5a2 2 0 0 1 1.6.8L8 14.333 9.9 11.8a2 2 0 0 1 1.6-.8H14a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path> <path fill-rule="evenodd" d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"></path>',
			braces: '<path d="M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6zM13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6z"></path>',
			eye: '<path fill-rule="evenodd" d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.134 13.134 0 0 0 1.66 2.043C4.12 11.332 5.88 12.5 8 12.5c2.12 0 3.879-1.168 5.168-2.457A13.134 13.134 0 0 0 14.828 8a13.133 13.133 0 0 0-1.66-2.043C11.879 4.668 10.119 3.5 8 3.5c-2.12 0-3.879 1.168-5.168 2.457A13.133 13.133 0 0 0 1.172 8z"></path> <path fill-rule="evenodd" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"></path>',
			exclamationDiamond: '<path fill-rule="evenodd" d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z"></path> <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"></path>',
			shieldLock: '<path fill-rule="evenodd" d="M5.443 1.991a60.17 60.17 0 0 0-2.725.802.454.454 0 0 0-.315.366C1.87 7.056 3.1 9.9 4.567 11.773c.736.94 1.533 1.636 2.197 2.093.333.228.626.394.857.5.116.053.21.089.282.11A.73.73 0 0 0 8 14.5c.007-.001.038-.005.097-.023.072-.022.166-.058.282-.111.23-.106.525-.272.857-.5a10.197 10.197 0 0 0 2.197-2.093C12.9 9.9 14.13 7.056 13.597 3.159a.454.454 0 0 0-.315-.366c-.626-.2-1.682-.526-2.725-.802C9.491 1.71 8.51 1.5 8 1.5c-.51 0-1.49.21-2.557.491zm-.256-.966C6.23.749 7.337.5 8 .5c.662 0 1.77.249 2.813.525a61.09 61.09 0 0 1 2.772.815c.528.168.926.623 1.003 1.184.573 4.197-.756 7.307-2.367 9.365a11.191 11.191 0 0 1-2.418 2.3 6.942 6.942 0 0 1-1.007.586c-.27.124-.558.225-.796.225s-.526-.101-.796-.225a6.908 6.908 0 0 1-1.007-.586 11.192 11.192 0 0 1-2.417-2.3C2.167 10.331.839 7.221 1.412 3.024A1.454 1.454 0 0 1 2.415 1.84a61.11 61.11 0 0 1 2.772-.815z"></path> <path d="M9.5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path> <path d="M7.411 8.034a.5.5 0 0 1 .493-.417h.156a.5.5 0 0 1 .492.414l.347 2a.5.5 0 0 1-.493.585h-.835a.5.5 0 0 1-.493-.582l.333-2z"></path>',
			musicPlayer: '<path fill-rule="evenodd" d="M12 1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"></path> <path fill-rule="evenodd" d="M11 3H5v3h6V3zM5 2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H5zm3 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path> <circle cx="8" cy="11" r="1"></circle>',
			personSquare: '<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path> <path fill-rule="evenodd" d="M2 15v-1c0-1 1-4 6-4s6 3 6 4v1H2zm6-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>',
			download: '<path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"></path> <path fill-rule="evenodd" d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"></path> <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z"></path>',
			cloudDownload: '<path fill-rule="evenodd" d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"></path> <path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"></path>',
			basket: '<path fill-rule="evenodd" d="M10.243 1.071a.5.5 0 0 1 .686.172l3 5a.5.5 0 1 1-.858.514l-3-5a.5.5 0 0 1 .172-.686zm-4.486 0a.5.5 0 0 0-.686.172l-3 5a.5.5 0 1 0 .858.514l3-5a.5.5 0 0 0-.172-.686z"></path> <path fill-rule="evenodd" d="M1 7v1h14V7H1zM.5 6a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5H.5z"></path> <path fill-rule="evenodd" d="M14 9H2v5a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9zM2 8a1 1 0 0 0-1 1v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9a1 1 0 0 0-1-1H2z"></path> <path fill-rule="evenodd" d="M4 10a.5.5 0 0 1 .5.5v3a.5.5 0 1 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 1 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 1 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 1 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 1 1-1 0v-3a.5.5 0 0 1 .5-.5z"></path>',
			bookHalf: '<path fill-rule="evenodd" d="M12.786 1.072C11.188.752 9.084.71 7.646 2.146A.5.5 0 0 0 7.5 2.5v11a.5.5 0 0 0 .854.354c.843-.844 2.115-1.059 3.47-.92 1.344.14 2.66.617 3.452 1.013A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.276-.447L15.5 2.5l.224-.447-.002-.001-.004-.002-.013-.006-.047-.023a12.582 12.582 0 0 0-.799-.34 12.96 12.96 0 0 0-2.073-.609zM15 2.82v9.908c-.846-.343-1.944-.672-3.074-.788-1.143-.118-2.387-.023-3.426.56V2.718c1.063-.929 2.631-.956 4.09-.664A11.956 11.956 0 0 1 15 2.82z"></path> <path fill-rule="evenodd" d="M3.214 1.072C4.813.752 6.916.71 8.354 2.146A.5.5 0 0 1 8.5 2.5v11a.5.5 0 0 1-.854.354c-.843-.844-2.115-1.059-3.47-.92-1.344.14-2.66.617-3.452 1.013A.5.5 0 0 1 0 13.5v-11a.5.5 0 0 1 .276-.447L.5 2.5l-.224-.447.002-.001.004-.002.013-.006a5.017 5.017 0 0 1 .22-.103 12.958 12.958 0 0 1 2.7-.869z"></path>',
			bookmarks: '<path fill-rule="evenodd" d="M7 13l5 3V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12l5-3zm-4 1.234l4-2.4 4 2.4V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10.234z"></path> <path d="M14 14l-1-.6V2a1 1 0 0 0-1-1H4.268A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v12z"></path>',
			fonts: '<path d="M12.258 3H3.747l-.082 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.43.013c1.935.062 2.434.301 2.694 1.846h.479L12.258 3z"></path>',
			x: '<path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"></path> <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"></path>',
			hr: '<path fill-rule="evenodd" d="M0 8a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5A.5.5 0 0 1 0 8z"></path> <path d="M4 3h8a1 1 0 0 1 1 1v2.5h1V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5h1V4a1 1 0 0 1 1-1zM3 9.5H2V12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9.5h-1V12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"></path>',
			film: '<path fill-rule="evenodd" d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0h8v6H4V1zm8 8H4v6h8V9zM1 1h2v2H1V1zm2 3H1v2h2V4zM1 7h2v2H1V7zm2 3H1v2h2v-2zm-2 3h2v2H1v-2zM15 1h-2v2h2V1zm-2 3h2v2h-2V4zm2 3h-2v2h2V7zm-2 3h2v2h-2v-2zm2 3h-2v2h2v-2z"></path>',
			type: '<path d="M2.244 13.081l.943-2.803H6.66l.944 2.803H8.86L5.54 3.75H4.322L1 13.081h1.244zm2.7-7.923L6.34 9.314H3.51l1.4-4.156h.034zm9.146 7.027h.035v.896h1.128V8.125c0-1.51-1.114-2.345-2.646-2.345-1.736 0-2.59.916-2.666 2.174h1.108c.068-.718.595-1.19 1.517-1.19.971 0 1.518.52 1.518 1.464v.731H12.19c-1.647.007-2.522.8-2.522 2.058 0 1.319.957 2.18 2.345 2.18 1.06 0 1.716-.43 2.078-1.011zm-1.763.035c-.752 0-1.456-.397-1.456-1.244 0-.65.424-1.115 1.408-1.115h1.805v.834c0 .896-.752 1.525-1.757 1.525z"></path>',
			search: '<path fill-rule="evenodd" d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"></path> <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"></path>',
			table: '<path fill-rule="evenodd" d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>',
			gripVertical: '<path d="M2 8a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm3 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>',
			grid: '<path fill-rule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"></path>',
			gridFill: '<path fill-rule="evenodd" d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"></path>',
			typeH2: '<path d="M7.638 13V3.669H6.38V7.62H1.759V3.67H.5V13h1.258V8.728h4.62V13h1.259zm3.022-6.733v-.048c0-.889.63-1.668 1.716-1.668.957 0 1.675.608 1.675 1.572 0 .855-.554 1.504-1.067 2.085l-3.513 3.999V13H15.5v-1.094h-4.245v-.075l2.481-2.844c.875-.998 1.586-1.784 1.586-2.953 0-1.463-1.155-2.556-2.919-2.556-1.941 0-2.966 1.326-2.966 2.74v.049h1.223z"></path>',
			codeSlash: '<path fill-rule="evenodd" d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0zm-.999-3.124a.5.5 0 0 1 .33.625l-4 13a.5.5 0 0 1-.955-.294l4-13a.5.5 0 0 1 .625-.33z"></path>',
			arrowsExpand: '<path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8zm6-1.5a.5.5 0 0 0 .5-.5V1.5a.5.5 0 0 0-1 0V6a.5.5 0 0 0 .5.5z"></path> <path fill-rule="evenodd" d="M10.354 3.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L8 2.207l1.646 1.647a.5.5 0 0 0 .708 0zM8 9.5a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-1 0V10a.5.5 0 0 1 .5-.5z"></path> <path fill-rule="evenodd" d="M10.354 12.146a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L8 13.793l1.646-1.647a.5.5 0 0 1 .708 0z"></path>',
			infoSquare: '<path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"></path> <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"></path> <circle cx="8" cy="4.5" r="1"></circle>',
			emojiSunglasses: '<path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path> <path fill-rule="evenodd" d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683zM6.5 6.497V6.5h-1c0-.568.447-.947.862-1.154C6.807 5.123 7.387 5 8 5s1.193.123 1.638.346c.415.207.862.586.862 1.154h-1v-.003l-.003-.01a.213.213 0 0 0-.036-.053.86.86 0 0 0-.27-.194C8.91 6.1 8.49 6 8 6c-.491 0-.912.1-1.19.24a.86.86 0 0 0-.271.194.213.213 0 0 0-.036.054l-.003.01z"></path> <path d="M2.31 5.243A1 1 0 0 1 3.28 4H6a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2h-.438a2 2 0 0 1-1.94-1.515L2.31 5.243zM9 5a1 1 0 0 1 1-1h2.72a1 1 0 0 1 .97 1.243l-.311 1.242A2 2 0 0 1 11.439 8H11a2 2 0 0 1-2-2V5z"></path>',
			toggles: '<path fill-rule="evenodd" d="M4.5 9a3.5 3.5 0 1 0 0 7h7a3.5 3.5 0 1 0 0-7h-7zm7 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm-7-14a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm2.45 0A3.49 3.49 0 0 1 8 3.5 3.49 3.49 0 0 1 6.95 6h4.55a2.5 2.5 0 0 0 0-5H6.95zM4.5 0h7a3.5 3.5 0 1 1 0 7h-7a3.5 3.5 0 1 1 0-7z"></path>',
			command: '<path fill-rule="evenodd" d="M2 3.5A1.5 1.5 0 0 0 3.5 5H5V3.5a1.5 1.5 0 1 0-3 0zM6 6V3.5A2.5 2.5 0 1 0 3.5 6H6zm8-2.5A1.5 1.5 0 0 1 12.5 5H11V3.5a1.5 1.5 0 0 1 3 0zM10 6V3.5A2.5 2.5 0 1 1 12.5 6H10zm-8 6.5A1.5 1.5 0 0 1 3.5 11H5v1.5a1.5 1.5 0 0 1-3 0zM6 10v2.5A2.5 2.5 0 1 1 3.5 10H6zm8 2.5a1.5 1.5 0 0 0-1.5-1.5H11v1.5a1.5 1.5 0 0 0 3 0zM10 10v2.5a2.5 2.5 0 1 0 2.5-2.5H10z"></path> <path fill-rule="evenodd" d="M10 6H6v4h4V6zM5 5v6h6V5H5z"></path>',
			trash: '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>'
		},
		buttons: {
			b: {title: 'Bold', icon: 'typeBold'},
			i: {title: 'Italic', icon: 'typeItalic'},
			u: {title: 'Underline', icon: 'typeUnderline'},
			s: {title: 'Strike', icon: 'typeStrikethrough'},
			code: {display: 'c', title: 'Inline Code', icon: 'code'},
			important: {display: '!', title: 'Important', icon: 'flag'},
			color: {type: 1, display: '\u25ee', prompt: 'Enter a #hexadecimal or color name.', title: 'Color', val: '#', icon: 'dropletHalf'},
			size: {type: 1, display: '\u00b1', prompt: 'Enter a number.', title: 'Size', val: 3, icon: 'textareaT'},
			align: {type: 1, display: '\u2261', prompt: 'Enter alignment: left, right, center', title: 'Align', icon: 'justify'},
			left: {display: '<', title: 'Left', icon: 'textLeft'},
			center: {display: '\u2013', title: 'Center', icon: 'textCenter'},
			right: {display: '>', title: 'Right', icon: 'textRight'},
			'#': {type: 3, title: 'Ordered List Item', icon: 'listOl'},
			'*': {type: 3, display: '\u2731', title: 'List Item', icon: 'listUl'},
			url: {type: 1, prompt: 'Enter a Link', title: 'Link', val: 'https://', icon: 'link45deg'},
			img: {title: 'Image', icon: 'image'},
			quote: {type: 1, display: 'q', prompt: 'Enter an author or name', title: 'Quote', placeholder: 'author', icon: 'chatSquareQuote'},
			pre: {title: 'Preformatted (Terminal)', icon: 'braces'},
			hide: {display: 'h', title: 'Hide', icon: 'eye'},
			spoiler: {display: '_', title: 'Spoiler', icon: 'exclamationDiamond'},
			mature: {type: 1, display: 'm', prompt: 'Enter a description', title: 'Mature Content', val: 'xXx', icon: 'shieldLock'},
			artist: {display: 'a', title: 'Artist', icon: 'musicPlayer'},
			user: {display: '@', title: 'User', icon: 'personSquare'},
			torrent: {display: 'id', title: 'Torrent', icon: 'download'},
			pl: {display: 'pl', title: 'Torrents', icon: 'cloudDownload'},
			collage: {display: 'clg', title: 'Collage', icon: 'basket'},
			forum: {display: 'f', title: 'Forum', icon: 'bookHalf'},
			wiki: {type: 4, tag: ['[[', ']]'], display: 'w', title: 'Wiki Article', icon: 'bookmarks'},
			tex: {display: 't', title: 'LaTeX', icon: 'fonts'},
			plain: {display: '\u00D7 ', title: 'Disable BBCode', icon: 'x'},
			hr: {type: 5, display: '\u2015', title: 'Horizontal Rule', icon: 'hr'},
			youtube: {type: 2, display: 'yt', title: 'YouTube', icon: 'film'},
			font: {type: 1, display: 'f', prompt: 'Enter a font\'s name', title: 'Font', val: 'Arial', icon: 'type'},
			search: {type: 1, display: '%', prompt: 'Enter a search term', title: 'Search Term', val: 'keywords', icon: 'search'},
			table: {display: 'tbl', title: 'Table', icon: 'table'},
			th: {display: 'th', title: 'Table Heading', icon: 'gripVertical'},
			tr: {display: 'tr', title: 'Table Row', icon: 'grid'},
			td: {display: 'td', title: 'Table Cell', icon: 'gridFill'},
			heading: {type: 4, tag: '=', display: '=', title: 'Heading', icon: 'typeH2'},
			php: {display: '<?', title: 'Source Code (PHP)', icon: 'codeSlash'},
			pad: {type: 1, display: '...', title: 'Pixel Padding (Eg: top|right|bottom|left --> 10|0|10|0)', prompt: 'Enter a padding. Eg, top|right|bottom|left --> 10|0|10|0', val: '0|0|0|0', icon: 'arrowsExpand'},
			// Gazelle
			gz_left: {tag: 'align', val: 'left', type: 1, noPrompt: true, display: '<', title: 'Left', icon: 'textLeft'},
			gz_center: {tag: 'align', val: 'center', type: 1, noPrompt: true, display: '\u2013', title: 'Center', icon: 'textCenter'},
			gz_right: {tag: 'align', val: 'right', type: 1, noPrompt: true, display: '>', title: 'Right', icon: 'textRight'},
			gz_src: {macro: ['quote', 'pre'], type: -3, display: '</>', title: 'Source Code', icon: 'codeSlash'},
			gz_rule: {tag: 'rule', title: 'Rule', icon: 'infoSquare', display: 'r' },
			// Panels
			emoticon: {display: ':]', toggle: ';]', title: 'Emoticons', type: -1, icon: 'emojiSunglasses'},
			settings: {display: '\u205D', toggle: '\u2059', title: 'Settings', type: -1, icon: 'toggles'},
			shortcut: {display: '?', toggle: '\u203D', title: 'Shortcuts', type: -1, icon: 'command'},
			erase: {display: '-', title: 'Delete Message', type: -2, icon: 'trash'}
		},
		emoticons: {
			// for gazelle-based sites make sure to filter any overlapping emoticons
			// use WhutBB.db.emoticons.gazelle.concat(WhutBB.db.emoticons.SOME_SITE) to cobine them
			gazelle: [[":angry:", "angry.gif"], [":D", "biggrin.gif"], [":|", "blank.gif"], [":blush:", "blush.gif"], [":cool:", "cool.gif"], [":'(", "crying.gif"], [">.>", "eyesright.gif"], [":creepy:", "creepy.gif"], [":frown:", "frown.gif"], ["<3", "heart.gif"], [":unsure:", "hmm.gif"], [":whatlove:", "ilu.gif"], [":lol:", "laughing.gif"], [":loveflac:", "loveflac.gif"], [":ninja:", "ninja.gif"], [":no:", "no.gif"], [":nod:", "nod.gif"], [":ohno:", "ohnoes.gif"], [":omg:", "omg.gif"], [":o", "ohshit.gif"], [":paddle:", "paddle.gif"], [":(", "sad.gif"], [":shifty:", "shifty.gif"], [":sick:", "sick.gif"], [":)", "smile.gif"], [":-)", "smile.gif"], [":sorry:", "sorry.gif"], [":thanks:", "thanks.gif"], [":P", "tongue.gif"], [":wave:", "wave.gif"], [":wink:", "wink.gif"], [":worried:", "worried.gif"], [":wtf:", "wtf.gif"], [":wub:", "wub.gif"]],
			gazellegames: [],
			orpheus: [],
			notwhatcd: [],
			red: [],
			bs: [],
			waffles: [[':waffleslove:', 'wubwaffles-2521f27a7566ee5cc069a3de14186bfd.gif'], [':opplove:', 'opplove-a8ccb8f7a9eac53ea93b79aefdcbbce2.gif'], [':-)', 'smile1-560658ee5e07e8ecaa3a08b2a1863c11.gif'], [':smile:', 'smile2-253a5659d9f881d0bebe9bc0b55651c6.gif'], [':-D', 'grin-4e432d4da3dacfc18d6b1efab45f109b.gif'], [':lol:', 'laugh-a1fab5d7a0444f1592f11b6300e8c735.gif'], [':w00t:', 'w00t-6d03c966b18c52fe27b8e71f4b5d0884.gif'], [':think:', 'think-ea7a2b4427bc8647d2482d56725feb55.gif'], [':-P', 'tongue-38d0b91dc1ff41a30c60cbfaf5c2a44d.gif'], [';-)', 'wink-89f2684eef38e562f10702689dac26de.gif'], [':-|', 'noexpression-4830284942db4804edd00add175bd878.gif'], [':-/', 'confused-b19136e38d02f3856fb8ada4c607c32d.gif'], [':-(', 'sad-99cbd04577892ef40541a94d426fb3da.gif'], [':cry:', 'cry-0c6e60c96c57cd04f537c064e0bcd2f9.gif'], [':crybaby:', 'crybaby-48ffb0fafe08c7e4113290a65741a92f.gif'], [':weep:', 'weep-cab525eab9fd0ca42f57534256d15b9f.gif'], [':-O', 'ohmy-219a8910835d309918b3fd38e136f5d0.gif'], [':o)', 'clown-69f44277bd832326ae116e3a8d0bdefa.gif'], ['8-)', 'cool1-40699903f40da78055f73c7a4dcf80d3.gif'], ['|-)', 'sleeping-5b9787c310fe92ca1179efa8773d13bb.gif'], [':bite:', 'bite-7d0251d8ca504cb6d9c963ba48527778.gif'], [':innocent:', 'innocent-ebfd211a73e277dcb8bb9aebe413186c.gif'], [':whistle:', 'whistle-df262302a1e22fb3b81e3c8091dd8ae8.gif'], [':unsure:', 'unsure-4f4483b4a49a4a48eea53f6a1fe2fbbe.gif'], [':closedeyes:', 'closedeyes-88fed55a5dba73d12b7d3a46ce61f1a5.gif'], [':cool:', 'cool2-585a4b126cdef75cff806373c11a6d4f.gif'], [':fun:', 'fun-bcdec9a81cf9af50b3c0db3671632a18.gif'], [':thumbsup:', 'thumbsup-9123163fe00ddf80036ee71b494b387c.gif'], [':thumbsdown:', 'thumbsdown-fd785afa98ea443ea00d88244849ecd4.gif'], [':blush:', 'blush-7e580b085806fe42a81d319821942eee.gif'], [':yes:', 'yes-458318d3341e1b7b8706e5103c2babd8.gif'], [':no:', 'no-fc2c2bcae3506ea2d3e3d3dc1b60f344.gif'], [':love:', 'love-d87adbbe12875920098a39974db15a58.gif'], [':?:', 'question-2da82c0b17b82f0f90859e2c2abe956b.gif'], [':!:', 'excl-ffa5e74329d67f804c3e75cdce4d2ae2.gif'], [':idea:', 'idea-7414639bdb7eddf4caea80ed3ba5d4d4.gif'], [':arrow:', 'arrow-ecca9442544396e7bf5258b76d837234.gif'], [':arrow2:', 'arrow2-060bb04e31b7f2ca25e24d7ccd223403.gif'], [':hmm:', 'hmm-9bcee658025a5bdf25e3e5327f3480ea.gif'], [':hmmm:', 'hmmm-e7d0bfb876d6dfc665d0d26c313b105b.gif'], [':huh:', 'huh-40027207c6263888d7cb60b1a11da8d8.gif'], [':geek:', 'geek-391ef98eb0e54003c0cfaaefe5942439.gif'], [':look:', 'look-78d96bcf1f6fe9744ecbf4d5244536c5.gif'], [':rolleyes:', 'rolleyes-41a1a18f3b18b0772240d89c45df5269.gif'], [':kiss:', 'kiss-146a79fb9405272d4f42e99c8e5ffe63.gif'], [':shifty:', 'shifty-89e6633d5f65e865b740f0d86dfcfb5b.gif'], [':blink:', 'blink-b1ceeb6a6c7c795dd141a1f5abc407cc.gif'], [':smartass:', 'smartass-df4ddd1ce630a8b2b1b1d4a07bb51802.gif'], [':sick:', 'sick-c2118245556bc2d3bd41222e5d978831.gif'], [':crazy:', 'crazy-c01c4dc3ff4ee33b23084a1d2d908023.gif'], [':orly:', 'orly-10e48d1489ca1370b37cf004e0107922.gif'], [':wacko:', 'wacko-32608221a12351b6085b2a76cbbaf1b6.gif'], [':alien:', 'alien-4242ce616db4008baeb965751ffdbd6d.gif'], [':wizard:', 'wizard-9cdf13a144a6f27ca01f9a84c50920d8.gif'], [':wave:', 'wave-356ec60e5f19bac9eff3b498ebfc1302.gif'], [':wavecry:', 'wavecry-4d265e41f67e026ebc4ab217bead7d6d.gif'], [':baby:', 'baby-97427920507ee34dfcb3647732205334.gif'], [':angry:', 'angry-0b177f61464277696e0ea047300be941.gif'], [':ras:', 'ras-5e59f83e717b19e5e26157b806437483.gif'], [':sly:', 'sly-738f409e4047197bb6375b25c7ee7f5c.gif'], [':devil:', 'devil-e3f6d8c109d34b0a6c02df621d37eb6f.gif'], [':evil:', 'evil-1dcf0991650e337d0eddb0375c6673de.gif'], [':evilmad:', 'evilmad-8094521229f4019c25b73591ae4dc0c1.gif'], [':sneaky:', 'sneaky-f1b79d0f7204bbd63f9cf47537c64f14.gif'], [':axe:', 'axe-057fb27c78a80d9bb9f002b4a5b7bb5e.gif'], [':slap:', 'slap-927bb31ea2f24e9c62e934e3944cdb23.gif'], [':wall:', 'wall-2cb395672976b927b720c6d4870c4ab8.gif'], [':rant:', 'rant-592949953cea288aa52319fa6b4c8b94.gif'], [':jump:', 'jump-29047acc082f064e6ce0c298c0d86995.gif'], [':yucky:', 'yucky-cefb1203e739c431569304382f96e524.gif'], [':nugget:', 'nugget-6753bf5221ee7569de7a689851c941c3.gif'], [':smart:', 'smart-aeeac59afce3e6b3a29c15dab8a1d2db.gif'], [':shutup:', 'shutup-955bf0025595c5ee1e7e8b7ed3c8b451.gif'], [':shutup2:', 'shutup2-12b77059128e69ea02f2c83cd674c2d8.gif'], [':crockett:', 'crockett-f6f21951664e037350178ddc48e43cc7.gif'], [':zorro:', 'zorro-6ed3d91db57faf8f1c679a0104df3287.gif'], [':snap:', 'snap-abe3f319906de4ad2c911db2f8be0457.gif'], [':beer:', 'beer-8624578c14d53eb15fcb53ce1d92b624.gif'], [':beer2:', 'beer2-3ac8a709706edc3ec23640ae261a7d7b.gif'], [':drunk:', 'drunk-9f7e144e04f9b645a0664c19d971d187.gif'], [':strongbench:', 'strongbench-a31c4395e1497b99a65ef03d9001f0f5.gif'], [':weakbench:', 'weakbench-ae49b68c1a3aeb0338067600b027630e.gif'], [':dumbells:', 'dumbells-66c83d31692d9f891f7c4abd528ce34a.gif'], [':music:', 'music-8fdf83519a7784655553167651f5b906.gif'], [':stupid:', 'stupid-64c93342b79365e6253668c56061ae30.gif'], [':dots:', 'dots-76bd535228d09950e0469c1035085733.gif'], [':offtopic:', 'offtopic-dde3c44e1eab9e64e0a0342830ece5d8.gif'], [':spam:', 'spam-89dc0d0860bf67faaf638ae5d4af5522.gif'], [':oops:', 'oops-7b7c406acac8cb9556647124b47f65bf.gif'], [':lttd:', 'lttd-419bf447899d4bd0d12421508d6b182e.gif'], [':please:', 'please-b493794982b341bd165dc78e8da392ca.gif'], [':sorry:', 'sorry-296b4590f343aae1fbcdcaec26aa9d6b.gif'], [':hi:', 'hi-d43d6f4647b842c186e4751d5f8593fa.gif'], [':yay:', 'yay-f0142dc8b6b7480c2d3c2d63cb97fbe6.gif'], [':cake:', 'cake-09bb27b361ddc8f36af89cf5c416ded1.gif'], [':hbd:', 'hbd-c88a75dffd37270ca561f3e8fa2d4792.gif'], [':band:', 'band-05785c3ffa59700b2d4d392c6d055ac1.gif'], [':punk:', 'punk-9a668ff6c0d9aa86a5f224394dd69388.gif'], [':rofl:', 'rofl-f8b19634186288c71d057d5f573b0c08.gif'], [':bounce:', 'bounce-01e0269597d0977117516e453785165e.gif'], [':mbounce:', 'mbounce-5d299f4fb8e63d88f447616fe9c6a228.gif'], [':thankyou:', 'thankyou-756e056b129ff51bbb32f25a34cee551.gif'], [':gathering:', 'gathering-086469368ada9d89216831908d16b71a.gif'], [':hang:', 'hang-7eb55fd687c7da7963c65df6738d078f.gif'], [':chop:', 'chop-01d980e59de44860127351fb8c4378d5.gif'], [':rip:', 'rip-9f76c7e7f6406a88eb51f8f7e11bf8b5.gif'], [':whip:', 'whip-449fae3c143197dbe50d1e23aa06ba1b.gif'], [':judge:', 'judge-3b457cc503c6333eb9c617bb0aaf939b.gif'], [':chair:', 'chair-06dbccd541c32f5b8b78a00be533ea48.gif'], [':tease:', 'tease-14fac8acbb4aa7941e0a0a19c24468fd.gif'], [':box:', 'box-3f8587850b9ee5e73baa303dd7be817a.gif'], [':boxing:', 'boxing-863999b9867552a5c0b9a899bfeb8b2a.gif'], [':guns:', 'guns-ed7df8a2db38d6c5ffa99175ab4c28c1.gif'], [':shoot:', 'shoot-0615a7c3de81fec986a3e9c4517a16e9.gif'], [':shoot2:', 'shoot2-f6920a2710da65de365d3c22cd2ae542.gif'], [':flowers:', 'flowers-27332577023d64cfb727141fe5e4d14b.gif'], [':wub:', 'wub-0ad5e6feb5270036b984bceef2f003d8.gif'], [':lovers:', 'lovers-f5e6c32a84e8493a4158e5e433f93361.gif'], [':kissing:', 'kissing-0fe382763a16cf6c3c60d5b08db0f9b2.gif'], [':kissing2:', 'kissing2-ee32fc798de7cb2acd5559ce73178f61.gif'], [':console:', 'console-68b189b1dab66bf547027e563ecf0c15.gif'], [':group:', 'group-c9a1ec760a777981072d1ef32aa15c18.gif'], [':hump:', 'hump-272f1f79650b59ea69f923d9130ef69e.gif'], [':hooray:', 'hooray-6c652ce73716362393686b7c6ef0b440.gif'], [':happy2:', 'happy2-c62e525a319bb1f890915a7b9aab66b0.gif'], [':clap:', 'clap-04df3e4f3c7503db3eece534e0cfc222.gif'], [':clap2:', 'clap2-948072586f68c56b095cd882883a92b2.gif'], [':weirdo:', 'weirdo-272bef79cbd6b67841ee58a11a231748.gif'], [':yawn:', 'yawn-887032484c9d38e473984004bcfb065d.gif'], [':bow:', 'bow-e7bb9c96931ac0df88d1641e0e5f3851.gif'], [':dawgie:', 'dawgie-c67131b834f9bb2a9b30cee42b67987d.gif'], [':cylon:', 'cylon-5ea27fc2b0719f40d289f4c7b93f7ada.gif'], [':book:', 'book-be7f16f0671c0c559a4e2bd74c393b8c.gif'], [':fish:', 'fish-00be24fac4a017112d7804c3e897097f.gif'], [':mama:', 'mama-4dfb65772fb41f145a3f89ad37790a81.gif'], [':pepsi:', 'pepsi-7b4b1badd4396b3f4e22d6118e323f02.gif'], [':medieval:', 'medieval-50260f623bc633f0ecf74d7c17393ff1.gif'], [':rambo:', 'rambo-09d6efc427fb1e7e6340fbb147d43a11.gif'], [':ninja:', 'ninja-1df82da69d50dbd46d2cb359f8527419.gif'], [':hannibal:', 'hannibal-426ef9b9bcc9a3333c4ab26715492580.gif'], [':party:', 'party-66ad63e75a1828550d3486931a49f857.gif'], [':snorkle:', 'snorkle-3e5f5fd9bf0db02f1f33517717683970.gif'], [':evo:', 'evo-312ef9ba37feaf9f3467d4e8d46a663e.gif'], [':king:', 'king-81506071dd6ee2049ad6fa5a21a46157.gif'], [':chef:', 'chef-e5089f65672d3467fb6840fae5976929.gif'], [':mario:', 'mario-36b76b39c0c58e36b65a055a3ce54941.gif'], [':pope:', 'pope-fb424bc064d80fe7bc29341eddbab4c6.gif'], [':fez:', 'fez-7a0ebd6c8eea5c7e6020ceff77fca632.gif'], [':cap:', 'cap-4cbad47f6570262439eeba3137b6beb7.gif'], [':cowboy:', 'cowboy-2e6c4ed4565b3cdb7af6c52367f83fe5.gif'], [':pirate:', 'pirate-0c35d70ab51a83113a8f111476da6f5e.gif'], [':pirate2:', 'pirate2-a0a401392f51e48eb66831ebbe67df53.gif'], [':rock:', 'rock-40548e8d132ae530802a14d89c2d760b.gif'], [':cigar:', 'cigar-676427cb7a3bbbea4303015d3d2acfdc.gif'], [':icecream:', 'icecream-032618e68cfae2cc8ae02b0fa3704e05.gif'], [':oldtimer:', 'oldtimer-757ffdf57d44a55ca1f72c96f09fd1b0.gif'], [':trampoline:', 'trampoline-2ba70f11043de1ef9010fc75cd29afb8.gif'], [':banana:', 'bananadance-3f9ed835b302b721ff8c82ade10459a0.gif'], [':smurf:', 'smurf-fdbbd6f4b8d709620293c49bd844febb.gif'], [':yikes:', 'yikes-0200f0559a21414f04632172f77fa99d.gif'], [':osama:', 'osama-d01f5ee7a14b25177bfd60b30d438a3f.gif'], [':saddam:', 'saddam-27b72ffd9b4d13aaa00e03567b40eea4.gif'], [':santa:', 'santa-7c385ec9c2718f9f01633dfd9a56b0b6.gif'], [':indian:', 'indian-fb42d05ff92de4d57b123e945e951244.gif'], [':pimp:', 'pimp-d0a709339d63c555d57ed7bca0c00ddb.gif'], [':nuke:', 'nuke-2f73939082f53cb445bf9e166108143d.gif'], [':jacko:', 'jacko-cfc99a11372c2eba9367932d7df360f0.gif'], [':ike:', 'ike-1992ee857800281bac157d4866d8385b.gif'], [':greedy:', 'greedy-4a04cd5db2356e54c750fe6f9f2ab93b.gif'], [':super:', 'super-19790574533d71b475ac60bc88be05fa.gif'], [':wolverine:', 'wolverine-054e82e4a90dd2874ac1dcbf773d8bdf.gif'], [':spidey:', 'spidey-7ef425b6d02a12067936229c04b821f0.gif'], [':spider:', 'spider-fac295e77895de28902d26ebc14344ca.gif'], [':bandana:', 'bandana-764003ef9751eca0f70b3f6b6668c533.gif'], [':construction:', 'construction-ec7857a9ee8ba8e7ef236cf749401194.gif'], [':sheep:', 'sheep-c8e7ce684732354235f91284927ae812.gif'], [':police:', 'police-e02b59b0fb153ad7d7314edf7b985c39.gif'], [':detective:', 'detective-4c526178c97055d4851c212e6e5d8c7c.gif'], [':bike:', 'bike-773e389449eedf0719cf6352ac9d0a85.gif'], [':fishing:', 'fishing-0d961d64c39a324a62bd6ff276200f61.gif'], [':clover:', 'clover-67a8ff1eddedfe1a2cd3c8e8cd9b9ef2.gif'], [':horse:', 'horse-ff20edcdc92f16cfc1565d38aa8ad7da.gif'], [':shit:', 'shit-90a3b56537435867cb120a4d85984704.gif'], [':soldiers:', 'soldiers-012a263073b602c268ecfae69672e1f5.gif'], [':search:', 'search-7d7bd7365acc3edb2e050b85cc4180fd.gif'], [':tinfoilhat:', 'tinfoilhat-4bf3badd9c9afbb1b0a9f2e0a92097f2.gif'], [':moon1:', 'moon1-7f51ab8d5699c8398083985aa34ff1b8.gif'], [':moon2:', 'moon2-967c0e89b8e8ab2393c23cf9dd763a22.gif'], [':user:', 'user-cadad12a1f12dae826bf1dcfbfa29db1.gif'], [':staff:', 'staff-f6921aa4cb3d0960eac347ba772f5ce2.gif']], /*, [':box:', 'box.gif']*/
			indie: [[':-)', 'smile.gif'], [';-)', 'wink.gif'], [':-D', 'biggrin.gif'], [':-P', 'tongue.gif'], [':-(', 'sad.gif'], ['>:-|', 'blank.gif'], [':-/', 'confused.gif'], [':-O', 'ohmy.gif'], [':o)', 'clown.gif'], ['8-)', 'cool1.gif'], ['|-)', 'sleeping.gif'], [':cupcake:', 'cupcake1.gif'], [':innocent:', 'innocent.gif'], [':whistle:', 'whistle.gif'], [':unsure:', 'hmm.gif'], [':closedeyes:', 'closedeyes.gif'], [':angry:', 'angry.gif'], [':smile:', 'smile2.gif'], [':lol:', 'laughing.gif'], [':cool:', 'cool.gif'], [':fun:', 'fun.gif'], [':thumbsup:', 'thumbsup.gif'], [':thumbsdown:', 'thumbsdown.gif'], [':blush:', 'blush.gif'], [':weep:', 'weep.gif'], [':yes:', 'yes.gif'], [':no:', 'no.gif'], [':love:', 'love.gif'], [':?:', 'question.gif'], [':!:', 'excl.gif'], [':idea:', 'idea.gif'], [':arrow:', 'arrow.gif'], [':hmm:', 'hmm.gif'], [':hmmm:', 'hmmm.gif'], [':huh:', 'huh.gif'], [':w00t:', 'w00t.gif'], [':geek:', 'geek.gif'], [':look:', 'look.gif'], [':rolleyes:', 'rolleyes.gif'], [':kiss:', 'kiss.gif'], [':shifty:', 'shifty.gif'], [':blink:', 'blink.gif'], [':smartass:', 'smartass.gif'], [':sick:', 'sick.gif'], [':crazy:', 'crazy.gif'], [':wacko:', 'wacko.gif'], [':alien:', 'alien.gif'], [':wizard:', 'wizard.gif'], [':wave:', 'wave.gif'], [':wavecry:', 'wavecry.gif'], [':baby:', 'baby.gif'], [':ras:', 'ras.gif'], [':sly:', 'sly.gif'], [':devil:', 'devil.gif'], [':evil:', 'evil.gif'], [':godisevil:', 'evil.gif'], [':evilmad:', 'evilmad.gif'], [':yucky:', 'yucky.gif'], [':nugget:', 'nugget.gif'], [':sneaky:', 'sneaky.gif'], [':smart:', 'smart.gif'], [':shutup:', 'shutup.gif'], [':shutup2:', 'shutup2.gif'], [':yikes:', 'yikes.gif'], [':flowers:', 'flowers.gif'], [':wub:', 'wub.gif'], [':osama:', 'osama.gif'], [':saddam:', 'saddam.gif'], [':santa:', 'santa.gif'], [':indian:', 'indian.gif'], [':guns:', 'guns.gif'], [':crockett:', 'crockett.gif'], [':zorro:', 'zorro.gif'], [':snap:', 'snap.gif'], [':beer:', 'beer.gif'], [':beer2:', 'beer2.gif'], [':drunk:', 'drunk.gif'], [':mama:', 'mama.gif'], [':pepsi:', 'pepsi.gif'], [':medieval:', 'medieval.gif'], [':rambo:', 'rambo.gif'], [':ninja:', 'ninja.gif'], [':hannibal:', 'hannibal.gif'], [':party:', 'party.gif'], [':snorkle:', 'snorkle.gif'], [':evo:', 'evo.gif'], [':king:', 'king.gif'], [':chef:', 'chef.gif'], [':mario:', 'mario.gif'], [':pope:', 'pope.gif'], [':fez:', 'fez.gif'], [':cap:', 'cap.gif'], [':cowboy:', 'cowboy.gif'], [':pirate:', 'pirate2.gif'], [':rock:', 'rock.gif'], [':cigar:', 'cigar.gif'], [':icecream:', 'icecream.gif'], [':oldtimer:', 'oldtimer.gif'], [':wolverine:', 'wolverine.gif'], [':strongbench:', 'strongbench.gif'], [':weakbench:', 'weakbench.gif'], [':bike:', 'bike.gif'], [':music:', 'music.gif'], [':book:', 'book.gif'], [':fish:', 'fish.gif'], [':stupid:', 'stupid.gif'], [':dots:', 'dots.gif'], [':kelso:', 'kelso.gif'], [':red:', 'red.gif'], [':dobbs:', 'bobdobbs.gif'], [':axe:', 'axe.gif'], [':hooray:', 'hooray.gif'], [':yay:', 'yay.gif'], [':cake:', 'cake.gif'], [':hbd:', 'hbd.gif'], [':hi:', 'hi.gif'], [':offtopic:', 'offtopic.gif'], [':band:', 'band.gif'], [':hump:', 'hump.gif'], [':punk:', 'punk.gif'], [':bounce:', 'bounce.gif'], [':mbounce:', 'mbounce.gif'], [':group:', 'group.gif'], [':console:', 'console.gif'], [':smurf:', 'smurf.gif'], [':soldiers:', 'soldiers.gif'], [':spidey:', 'spidey.gif'], [':rant:', 'rant.gif'], [':pimp:', 'pimp.gif'], [':nuke:', 'nuke.gif'], [':judge:', 'judge.gif'], [':jacko:', 'jacko.gif'], [':ike:', 'ike.gif'], [':greedy:', 'greedy.gif'], [':dumbells:', 'dumbells.gif'], [':clover:', 'clover.gif'], [':shit:', 'shit.gif'], [':thankyou:', 'thankyou.gif'], [':horse:', 'horse.gif'], [':box:', 'boxing.gif'], [':fight:', 'fighting05.gif'], [':gathering:', 'gathering.gif'], [':hang:', 'hang.gif'], [':chair:', 'chair.gif'], [':spam:', 'spam.gif'], [':bandana:', 'bandana.gif'], [':construction:', 'construction.gif'], [':oops:', 'oops.gif'], [':rip:', 'rip.gif'], [':sheep:', 'sheep.gif'], [':tease:', 'tease.gif'], [':spider:', 'spider.gif'], [':shoot:', 'shoot.gif'], [':shoot2:', 'shoot2.gif'], [':police:', 'police.gif'], [':lovers:', 'lovers.gif'], [':kissing:', 'kissing.gif'], [':kissing2:', 'kissing2.gif'], [':jump:', 'jump.gif'], [':happy2:', 'happy2.gif'], [':clap:', 'clap.gif'], [':clap2:', 'clap2.gif'], [':chop:', 'chop.gif'], [':lttd:', 'lttd.gif'], [':whip:', 'whip.gif'], [':yawn:', 'yawn.gif'], [':bow:', 'bow.gif'], [':slap:', 'slap.gif'], [':wall:', 'wall.gif'], [':please:', 'please.gif'], [':sorry:', 'sorry.gif'], [':finger:', 'finger.gif'], [':brown:', 'brownnoser.gif'], [':cloud9:', 'cloud9.gif'], [':pity:', 'mrt.gif'], [':mug:', 'mug.gif'], [':banned:', 'banned.gif'], [':tkfu:', 'ninja_hide.gif'], [':baldfresh:', 'baldy.png'], [':camera:', 'camera.gif'], [':loggeek:', 'log.jpg'], [':coleman83:', 'random'], [':locked:', 'lockd.gif'], [':tomjones1:', 'tomjones01.png'], [':tomjones2:', 'tomjones02.png'], [':D', 'biggrin.gif'], [':|', 'blank.gif'], [':\'(', 'crying.gif'], ['>.>', 'eyesright.gif'], [':frown:', 'frown.gif'], ['<3', 'heart.gif'], [':nod:', 'nod.gif'], [':ohno:', 'ohnoes.gif'], [':ohnoes:', 'ohnoes.gif'], [':omg:', 'omg.gif'], [':o', 'ohshit.gif'], [':O', 'ohshit.gif'], [':paddle:', 'paddle.gif'], [':(', 'sad.gif'], [':)', 'smile.gif'], [':thanks:', 'thanks.gif'], [':P', 'tongue.gif'], [':-p', 'tongue.gif'], [':wink:', 'wink.gif'], [':creepy:', 'creepy.gif'], [':worried:', 'worried.gif'], [':wtf:', 'wtf.gif'], [':lmgtfy:', 'lmgtfy.gif'], [':fart:', 'fart.gif'], [':hifi:', 'hifi.gif'], [':cheers:', 'cheers.gif'], [':jambox:', 'jambox.gif'], [':rimshot:', 'rimshot.gif'], [':rockout:', 'rockout.gif'], [':yourmom:', 'yourmom.gif'], [':bong:', 'bong.gif'], [':peace:', 'hippie.gif'], [':vinyl:', 'vinyl.gif'], ['\\m/', 'horns.gif']],
			what: [[":qmarklove:", "ilqmark-what.gif"], [":ajaxlove:", "ilajax-what.gif"], [":athenalove:", "ilathena-what.gif"], [":alderaanlove:", "ilalderaan-what.gif"], [":anankelove:", "ilananke-what.gif"], [":bashmorelove:", "ilbashmore-what.gif"], [":brancusilove:", "ilbrancusi-what.gif"], [":brdlove:", "ilbrd-what.gif"], [":carllove:", "ilcarl-what.gif"], [":dumontlove:", "ildumont-what.gif"], [":entrapmentlove:", "ilentrapment-what.gif"], [":espressolove:", "ilespresso-what.gif"], [":gamehendgelove:", "ilgamehendge-what.gif"], [":hyperionlove:", "ilhyperion-what.gif"], [":iapetuslove:", "iliapetus-what.gif"], [":irimiaslove:", "ilirimias-what.gif"], [":irredentialove:", "ilirredentia-what.gif"], [":kitchenstafflove:", "ilkitchenstaff-what.gif"], [":kopitiamlove:", "ilkopitiam-what.gif"], [":kryptoslove:", "ilkryptos-what.gif"], [":lenreklove:", "illenrek-what.gif"], [":lesadieuxlove:", "illesadieux-what.gif"], [":lisbethlove:", "illisbeth-what.gif"], [":nandolove:", "ilnando-what.gif"], [":porkpielove:", "ilporkpie-what.gif"], [":sinetaxlove:", "ilsinetax-what.gif"], [":theseuslove:", "iltheseus-what.gif"], [":toruslove:", "iltorus-what.gif"], [":wtelove:", "ilwte-what.gif"], [":zettellove:", "ilzettel-what.gif"], [":a9love:", "ila9-what.gif"], [":bionicsockslove:", "ilbionicsocks-what.gif"], [":chailove:", "ilchai-what.gif"], [":changleslove:", "ilchangles-what.gif"], [":claptonlove:", "ilclapton-what.gif"], [":emmlove:", "ilemm-what.gif"], [":fzeroxlove:", "ilfzerox-what.gif"], [":hothlove:", "ilhoth-what.gif"], [":interstellarlove:", "ilinterstellar-what.gif"], [":jowalove:", "iljowa-what.gif"], [":kharonlove:", "ilkharon-what.gif"], [":lylaclove:", "illylac-what.gif"], [":marienbadlove:", "ilmarienbad-what.gif"], [":marigoldslove:", "ilmarigolds-what.gif"], [":mavericklove:", "ilmaverick-what.gif"], [":mnlove:", "ilmn-what.gif"], [":mre2melove:", "ilmre2me-what.gif"], [":mugglelove:", "ilmugglehump-what.gif"], [":nightoathlove:", "ilnightoath-what.gif"], [":oinkmeuplove:", "iloinkmeup-what.gif"], [":padutchlove:", "ilpadutch-what.gif"], [":paintrainlove:", "ilpaintrain-what.gif"], [":sdfflove:", "ilsdff-what.gif"], [":seraphiellove:", "ilseraphiel-what.gif"], [":sisterraylove:", "ilsisterray-what.gif"], [":snowflakelove:", "ilsnowflake-what.gif"], [":soamlove:", "ilsoam-what.gif"], [":spacireleilove:", "ilspacirelei-what.gif"], [":stwlove:", "ilstw-what.gif"], [":whatmanlove:", "ilwhatman-what.gif"], [":whynotmicelove:", "ilwhynotmice-what.gif"], [":xorianlove:", "ilxorian-what.gif"]]
		},
		blueprints: {
			gazelle: [ // pretty standard gazelle blueprint as of ... 2012 or 2013?
				['b', 'i', 'u', 's'], ['color', 'size'], ['heading', 'important'],
				['gz_left', 'gz_center', 'gz_right'],
				['#', '*'], ['url', 'img'], ['quote'], ['hide', 'mature'],
				['artist', 'torrent', 'user', 'wiki', 'gz_rule'], ['pre', 'gz_src', 'code', 'plain'],
				['tex'],
				[ 'erase'], ['emoticon', 'shortcut', 'settings']
			]
		},
		shortcuts: {
			alt: {
				c: 'gz_src',
				i: 'torrent'
			},
			ctrl: {
				b: 'b',
				i: 'i',
				u: 'u',
				s: 's',
				g: 'code',
				k: '#',
				l: '*',
				h: 'url',
				m: 'img',
				d: 'erase'
			},
			'ctrl+alt': {
				i: 'important',
				e: 'emoticon',
				u: 'settings',
				x: 'shortcut'
			}
		},
		setupShortcutMap: function () {
			dom.oEach(WhutBB.config.shortcuts, function (meta, letters) {
				// WhutBB.config.shortcuts
				dom.oEach(letters, function (letter, button) {
					// console.log(letter, button);
					if (!WhutBB.config.shortcutMap[button]) {
						WhutBB.config.shortcutMap[button] = [];
					}
					WhutBB.config.shortcutMap[button].push(meta + '+' + letter);
				});
			});

			// console.log('created', WhutBB.config.shortcutMap);
		},
		getShortcut: function (modifier, letter) {
			if (this.shortcuts[modifier] && this.shortcuts[modifier][letter]) {
				return this.shortcuts[modifier][letter];
			}
		},
		getShortcutText: function (modifier) { // changes CTRL and ALT to Mac-centric keys if required // .replace(/(?:CTRL\+ALT)/g, 'ALT+CTRL')
			return WhutBB.mac ? modifier.toUpperCase().replace(/(?:CTRL)/g, '\u2318').replace(/(?:ALT)/g, '\u2325') : modifier.toUpperCase();
		},
		getSiteSettings: function (name) {
			if (WhutBB.db.sites[name]) {
				var settings = WhutBB.db.sites[name]();
				settings.name = name;
				return settings;
			}
			return {};
		},
		/**
		 * Inserts or replaces buttons
		 * Use this method before initializing the script (WhutBB.init)
		 * @param buttons - object of objects
		 */
		insertButtons: function (buttons) {
			dom.oEach(buttons, function (name, object) {
				WhutBB.db.buttons[name] = object;
			});
		},
		/**
		 *  Adds emoticons to (an exisiting) emoticons DB array
		 *  Use this method before initializing the script (WhutBB.init)
		 *
		 * @param {string} name of the array in the emoticons DB to use
		 *        if none exist, it will be created
		 * @param {array} emoticons
		 *        make sure to use an array of arrays
		 *
		 *  Example: add two emoticons to WhutBB.db.emoticons.gazelle
		 *    WhutBB.db.addEmoticons('gazelle', [[':new:', 'new.png'], [':pop:', 'pop.png']]);
		 */
		addEmoticons: function (name, emoticons) {
			WhutBB.db.emoticons[name] = (WhutBB.db.emoticons[name] || []).concat(emoticons);
		},
		/**
		 * @param {array} emoticons
		 */
		uniqueEmoticons: function (emoticons) {
			var unique = {}, arr = [], i;

			dom.aEach(emoticons, function (e) {
				unique[e[0]] = e;
			})

			dom.oEach(unique, function (key, obj) {
				arr.push(obj);
			});

			return arr;
		}
	};

	/**
	 * Event manager
	 * Aliases/references event data for easier use within various methods
	 */
	WhutBB.e = {
		current: null, // alias for the current event
		target: null, // alias for the current event target element
		whut: null, // alias for the current event's WhutBB instance
		macro: false, // flag for events called through a macro
		set: function (event, target, wbb) {
			WhutBB.e.current = event;
			WhutBB.e.target = target;
			WhutBB.e.whut = wbb;
		},
		clean: function () {
			this.current = this.target = this.whut = null;
		}
	};

	/**
	 * Event Object
	 *
	 * Contains all possible events, divided into:
	 *    1) mouse, 2) key, and 3) general button events
	 *
	 * Mouse and Key events trigger Button events, depending
	 * on the button type
	 *
	 * As mentioned earlier, buttons with custom events should find
	 * a method with that button's name within WhutBB.evt.button.custom
	 *
	 * WhutBB instances register themselves with the
	 * register methods.
	 *
	 * The registers return an annonymous function that
	 * is used for any subsequent click or key events.
	 *
	 */
	WhutBB.evt = {
		button: { // button events
			custom: { // Custom button events
				erase: function () { // erase button event
					WhutBB.e.whut.textarea.value = '';
				},
				emoticonLoader: function () { // removes "View all emoticons." div and loads remaining emoticons
					WhutBB.e.target.parentNode.removeChild(WhutBB.e.target);
					WhutBB.Panel.attach.emoticons(WhutBB.config.emoticonMax - 1,
						WhutBB.config.emoticons.length);
				}
			},
			macro: function (name, wbb) { // macro button events
				if (!WhutBB.e.macro) {
					WhutBB.e.macro = true;
					dom.aEach(WhutBB.db.buttons[name].macro || [], function (name) {
						// console.log(name);
						dom.click(wbb.getButton(name));
					});
					WhutBB.e.macro = false;
				}
			},
			bbcode: function () { // bbcode buttons
				WhutBB.Tag.get(WhutBB.e.target.name).insertTo(WhutBB.e.whut.textarea);
			},
			emoticon: function () { // emoticon buttons
				WhutBB.box.select(WhutBB.e.whut.textarea).insert([' ' + WhutBB.e.target.title, '']);
			},
			panel: { // panel buttons
				toggle: function (panel, el) { // el = WhutBB.e.target
					var visible = el.classList.contains('wbbpressed'); // panel's current visibility
					WhutBB.evt.button.panel.store(el);
					if (visible) {
						el.classList.remove('wbbpressed');
						panel.classList.add('wbbhide');
					} else {
						WhutBB.e.whut.wrap.appendChild(WhutBB.Panel.global[el.name].element);
						el.classList.add('wbbpressed');
						panel.classList.remove('wbbhide');
					}
					WhutBB.evt.button.panel.toggleText(visible, el.firstChild);
				},
				toggleText: function (visible, span) {
					if (span.dataset.toggle) {
						span.firstChild.nodeValue = span.dataset[visible ? 'txt' : 'toggle'];
					}
				},
				store: function (button) {
					// remove pressed (toggled) state of previous stored button
					if (WhutBB.evt.button.panel.stored[button.name]) {
						WhutBB.evt.button.panel.stored[button.name].className = 'whutbbutton';
						WhutBB.evt.button.panel.toggleText(true, WhutBB.evt.button.panel.stored[button.name].firstChild);
					}
					WhutBB.evt.button.panel.stored[button.name] = button;
				},
				stored: {}
			}
		},
		delegate: {
			button: function () { // TODO Polymorphism plz?
				var t = WhutBB.e.target;
				// console.log(t);
				WhutBB.e.current.stopPropagation();
				if (+t.dataset.type === -3) {
					// console.log(-3);
					return WhutBB.evt.button.macro(t.name, WhutBB.e.whut);
				}
				if (+t.dataset.type === -2) {
					// console.log(-2);
					return WhutBB.evt.button.custom[t.name]();
				}
				if (+t.dataset.type === -1) {
					// console.log(-1);
					return WhutBB.evt.button.panel.toggle(WhutBB.Panel.global[t.name].element, t);
				}
				if (t.dataset.type === 'emoticon') {
					// console.log(2);
					return WhutBB.evt.button.emoticon();
				}
				// console.log(1);
				return WhutBB.evt.button.bbcode();
			},
			edit: function (evt) { // RegExp.lastParen should contain an ID
				var el = evt.target,
					attr = el.getAttribute('onclick') || '',
					id,
					interv;

				if (attr.match(/(?:Edit_Form\('(\d+))/)) {
					id = RegExp.lastParen;
					interv = window.setInterval(function () {
						var txt = document.getElementById('editbox' + id), w;

						if (txt) {
							window.clearInterval(interv);
							console.log('clearing', interv);
							txt.dataset.wbb = id;

							w = WhutBB.set[id];
							if (w) {
								w.update(txt);
							} else {
								WhutBB.create(txt, true);
							}
						}
					}, 500);
				}
				if (attr.match(/(?:Preview_Edit\((\d+))/) || attr.match(/(?:Save_Edit\((\d+))/)) {
					return WhutBB.set[RegExp.lastParen].hide();
				}
				if (attr.match(/(?:Cancel_Preview\((\d+))/)) {
					return WhutBB.set[RegExp.lastParen].show();
				}
			},
			report: function (evt) {
				var el = evt.target,
					attr = el.getAttribute('onchange') || '';

				if (attr.match(/(?:ChangeReportType\()/)) {
					window.setTimeout(function () {
						var txt = document.getElementById('dynamic_form');

						if (txt) {
							WhutBB.factory();
							return WhutBB.set[RegExp.lastParen].show();
						}
					}, 500);
				}
			},
			inbox: function (evt) { // todo inbox.php
				var el = evt.target,
					attr = el.getAttribute('onclick') || '',
					qp = document.getElementById('quickpost'),
					ps = qp.previousElementSibling;
				// console.log('inbox');
				if (/(?:preview)/i.test(attr)) {
					qp.classList.add('wbbhide');
					ps.classList.add('wbbhide');
				} else if (/(?:edit)/i.test(attr)) {
					qp.classList.remove('wbbhide');
					ps.classList.remove('wbbhide');
				}
			},
			settings: { // settings events
				update:  function () { // translates checks into settings to store
					var settings = {}, saved;

					dom.aEach(WhutBB.Panel.global.settings.element.getElementsByTagName('input'), function (el) {
						settings[el.name] = el.checked;
					});

					saved = WhutBB.user.save(settings);

					// calls a sub function based on a setting's name
					// additional argument if the settings were saved
					if (this.fn[WhutBB.e.target.name]) {
						this.fn[WhutBB.e.target.name](saved);
					}
				},
				fn: {
					icon: function () { // toggles button icons
						var cls = 'wbbcode ' + WhutBB.$.getWrapClass();
						dom.oEach(WhutBB.set, function (id, wbb) {
							wbb.wrap.className = cls;
						});
					},
					theme: function () {
						this.icon();
					},
					link: function () { // toggles WhutBBCode? link
						var cls = 'wbblink ' + (WhutBB.user.settings.link ? '' : ' wbbhide');
						dom.oEach(WhutBB.set, function (id, wbb) {
							wbb.panels.link.className = cls;
						});
					}
				}
			}
		},
		mouse: {
			target: function (target) {
				// Event target issue -- This returns an actual button, instead of the span.icon-* within it
				return (/(?:icon-)/).test(target.getAttribute('class')) ? target.parentNode : target;
			},
			down: function () {
				if (WhutBB.e.target.dataset.type) {
					return WhutBB.evt.delegate.button();
				}
				if (WhutBB.e.target.dataset.setting) {
					return WhutBB.evt.delegate.settings.update();
				}
			},
			register: function (wbb) {
				return function (evt) { // context for _this_ is the container div.wbbbuttons
					// console.log('mouse.register/anon');
					WhutBB.e.set(evt, WhutBB.evt.mouse.target(evt.target), wbb);
					WhutBB.evt.mouse.down();
					WhutBB.e.clean();
				};
			}
		},
		key: {
			down: function () {
				this.fire(this.button());
			},
			letter: function () {
				return String.fromCharCode(WhutBB.e.current.which || WhutBB.e.current.keyCode).toLowerCase();
			},
			modifier: function () {
				// meta key aliases to ctrl
				var cm = WhutBB.e.current.ctrlKey || WhutBB.e.current.metaKey;
				if (cm && WhutBB.e.current.altKey) { return 'ctrl+alt'; }
				if (cm) { return 'ctrl'; }
				if (WhutBB.e.current.altKey) { return 'alt'; }
				return '';
			},
			button: function () {
				return WhutBB.e.whut.getButton(WhutBB.db.getShortcut(this.modifier(), this.letter()));
			},
			fire: function (button) {
				if (button) {
					WhutBB.e.current.preventDefault();
					WhutBB.e.target = button;
					WhutBB.evt.mouse.down();
				}
			},
			register: function (wbb) {
				return function (evt) {
					// console.log('key.register/anon');
					WhutBB.e.set(evt, this, wbb); // _this_ is a textarea
					WhutBB.evt.key.down();
					WhutBB.e.clean();
				};
			}
		}
	};

	/**
	 * Box Object (aka textarea stuff)
	 *
	 * How it works:
	 *  WhutBB.box.select(textarea).insert(['{start}', '{end}']);
	 *
	 * An array is used because Tags parse to that data type.
	 *
	 * Result:
	 * <textarea>{start}{end}</textarea>
	 *
	 * It's (more) magical when used in an event.
	 */
	WhutBB.box = {
		select: function (textarea) {
			this.textarea = textarea;
			WhutBB.box.range = this.getRange();
			return this;
		},
		getRange: function () {
			if (this.textarea.selectionStart < 0) { return; }
			if (this.textarea.selectionEnd > this.textarea.value.length) {
				this.textarea.selectionEnd = this.textarea.value.length;
			}
			var s = this.textarea.selectionStart || 0,
				e = this.textarea.selectionEnd || 0;
			return {
				start: s,
				end: e,
				selection: this.textarea.value.substring(s, e) || ''
			};
		},
		insert: function (tag) {
			var pre = this.textarea.value.substring(0, this.range.start) + tag[0],
				post = tag[1] + this.textarea.value.substring(this.range.end);
			this.textarea.value = pre + this.range.selection + post;
			WhutBB.box.selection(pre.length);
		},
		selection: function (start) {
			window.setTimeout(() => {
				this.textarea.focus();
				this.textarea.setSelectionRange(start, start + this.range.selection.length);
			}, 100);
		}
	};

	/**
	 * WhutBBCode Settings Class
	 * Intended to be a singleton used within WhutBB.init()
	 *
	 * This class is used to store site configurations for WhutBBCode?
	 * Using these options, the script can create buttons, emoticons, etc.
	 *
	 * Effectively, without any settings, nothing really happens.
	 *
	 * The most important option is blueprint, which tells the script which
	 * buttons to create.
	 *
	 * The Panel class uses this blueprint to construct buttons, put them in the button
	 * panel, and attach them to WhutBB instances.
	 *
	 * All buttons that exist in WhutBB.db.buttons are stored as validButtons. The script
	 * uses validButtons to list available shortcuts to the user.
	 *
	 * To reiterate, options are the most important aspect of this class
	 *
	 * param @options object with the following (mostly optional) attributes
	 *
	 * if none is given, the script will try to find an appropriate match
	 * for the site.
	 *
	 * if no setting is found, the "generic" default options will be used
	 *
	 *  name: (String) [ default: '' (empty string) ]
	 *    the website's name
	 *
	 *  link:
	 *    link to information about the site's BBCode or WhutBBCode? itself (default)
	 *
	 *  beneath: (Boolean) [ default: true ]
	 *    location to insert buttons, beneath or above the textarea
	 *
	 *  blueprint: (String|Array) [ default: [] (empty array) ]
	 *    - string: name of the array from WhutBB.db.blueprints
	 *      currently only 'gazelle' exists (WhutBB.db.blueprints.gazelle)
	 *      use arrays for custom configurations!
	 *
	 *    tip: use 'gazelle' for sites that use the default gazelle BBCode
	 *
	 *    - array: an array of arrays containing buttons to create
	 *
	 *    group buttons together to create a set of similiar types
	 *
	 *    example:
	 *
	 *      blueprint: [
	 *         ['b', 'i', 'u'], // a set of three buttons
	 *         ['shortcut', 'settings'] // a set of two
	 *      ]
	 *
	 *    buttons are then placed in the DOM in the following order
	 *    [b][i][u] [?][+]
	 *
	 *    each set is separated by a space
	 *
	 *  width: (Number) [ default: 430 ]
	 *    a width (in pixels) to set for the WhutBB.wrap so that buttons fit well
	 *
	 *  emoticonDir: [ default: '' ]
	 *    absolute or relative (to the current site) location to where emoticons reside
	 *    it should end in a slash (/)
	 *
	 *  emoticonMax: (Number) [ default: 39 ]
	 *    a limit of emoticons to display to the user
	 *    eg: If 100 emoticons exist, the script will display the first 39
	 *        a link to show the rest of the emoticons will be generated
	 *    the intent of this is to reduce loading times of emoticon images
	 *
	 *  emoticons: (String|Array) [ default: [['', '']] (a null emoticon) ]
	 *    - string: name of the array from WhutBB.db.emoticons
	 *      for example, possible options: 'gazelle', 'waffles', 'indie'
	 *
	 *    - array: an array of arrays containing emoticons to create
	 *
	 *    the sub-arrays are formed by the emoticon text to insert and the location of the
	 *    image to show in the emoticon list
	 *
	 *    [ ["text to append to textarea", "url or path to an image"] ]
	 *
	 *    any arbitrary string can be appended to the textarea
	 *
	 *    example:
	 *      emoticons: [ [":)", "happy.png"], [":D", "grin.png"], [":(", "sad.png"] ]
	 *
	 *    these create images with the emoticon directory (emoticonDir)
	 *    if the directory varies, it should be included
	 *
	 *    example:
	 *        [':D', 'some-other-dir/grin.png']
	 *
	 *    absolute paths are supported
	 *
	 *    example:
	 *        [':]', 'https://emto/ticon.png']
	 *
	 *    clicking on the image "https://emto/ticon.png" will append ":]" to the textarea
	 *
	 *        ['[img]https://emto/ticon.gif[/img]', 'https://emto/ticon.gif']
	 *
	 *    in the second example, the string "[img]https://emto/ticon.gif[/img]" will be appended
	 *
	 *    To add emoticons to an existing object from WhutBB.db.emoticons, see
	 *    WhutBB.db.addEmoticons().
	 *
	 *  shortcuts: (Object) [ default: WhutBB.db.shortcuts ]
	 *    an object of objects that account for shotcut mapping, see "Keyboard Shortcuts"
	 *    part of the documentation
	 *
	 *    example:
	 *      shortcuts: {
	 *        ctrl: {
	 *          i: 'i'
	 *        },
	 *        'alt+ctrl': {
	 *          x: 'shotcuts'
	 *        }
	 *      }
	 *
	 */
	WhutBB.Settings = function Settings(options) {
		var def = WhutBB.db.sites[':default']();

		try {
			this.name = options.name || def.name;
			this.link = options.link || def.link;

			this.beneath = !!options.beneath;
			this.blueprint = (typeof options.blueprint === 'string') ? WhutBB.db.blueprints[options.blueprint] : (options.blueprint || def.blueprint); // options.blueprint || def.blueprint;
			
			if (document.location.hash === '#wbb')
				this.blueprint = WhutBB.db.sites[":test"]().blueprint;
			this.width = options.width || def.width;

			this.emoticonDir = options.emoticonDir || def.emoticonDir;
			this.emoticonMax = options.emoticonMax || def.emoticonMax;
			this.emoticons = (typeof options.emoticons === 'string') ? WhutBB.db.emoticons[options.emoticons] : (options.emoticons || def.emoticons); // null emoticon

			this.shortcuts = options.shortcuts || WhutBB.db.shortcuts;
		} catch (e) {
			dom.oEach(def, function (name, setting) {
				this[name] = setting;
			}, this);
		}
		this.validButtons = {};
		this.shortcutMap = {};
	};

	/**
	 * Button
	 *
	 * Generic button class that encapsulates data from
	 * WhutBB.db.buttons objects and creates a button element
	 *
	 * Do not use the constructor directly, use Button.create instead!
	 */
	WhutBB.Button = (function () {

		function Button(name) {
			this.name = name;
			this.data = WhutBB.db.buttons[name];
		}

		/**
		 * Button.create returns a Button or a Null button
		 * All possible buttons located at WhutBB.db.buttons
		 */
		Button.create = function (button) {
			if (WhutBB.db.buttons[button]) {
				return new Button(button);
			}
			return Button.Null;
		};

		/**
		 * Creates a button element and also validates it
		 */
		Button.prototype.make = function () {
			var el = dom.dom('button', {
					className: 'whutbbutton',
					name: this.name,
					title: this.data.title + this.getShortcut(this.name),
					attr: {
						type: 'button',
						'data-type': this.data.type || 'button'
					}
				},  dom.dom('span', {
					className: 'wbb-icon wbb-icon-' + this.data.icon,
					txt: this.data.display || this.name,
					attr: {
						'data-txt': this.data.display || this.name,
						'data-toggle': this.data.toggle || ''
					}
				}));

			this.validate();
			return el;
		};

		/**
		 * Validates a button by adding it to WhutBB.config.validButtons
		 */
		Button.prototype.validate = function () {
			WhutBB.config.validButtons[this.name] = true;
			return this;
		};

		Button.prototype.getShortcut = function (name) {
			var title = '';

			if (WhutBB.config.shortcutMap[name]) {
				title = ' (' + WhutBB.config.shortcutMap[name].join(', ') + ')';
			}

			return WhutBB.db.getShortcutText(title);
		};

		/**
		 * Space creates a single-spaced text node.
		 *
		 * Both Space and Null objects are intended to mimic Buttons
		 * without using any real inheritance
		 */
		Button.Space = {
			make: function () {
				return document.createTextNode(' ');
			},
			validate: function () {
				return this;
			},
			data: {}
		};

		/**
		 * Null creates a simple text node.
		 * It's used when there is no real button in the db.
		 */
		Button.Null = {
			make: function () {
				return document.createTextNode('');
			},
			validate: function () {
				return this;
			},
			data: {}
		};

		Button.emoticon = function (emoticonData) {
			return dom.dom('img', {
				title: emoticonData[0],
				alt: emoticonData[0],
				src: /^(?:http)/g.test(emoticonData[1]) ? emoticonData[1] : WhutBB.config.emoticonDir + emoticonData[1],
				attr: {
					'data-type': 'emoticon'
				}
			});
		};

		Button.emoticonLoader = function () {
			return dom.dom('div', {
				className: 'emoticonLoader',
				name: 'emoticonLoader',
				txt: 'View all emoticons.',
				title: 'Loads all emoticons.',
				attr: {
					'data-type': -2
				}
			});
		};

		return Button;

	}());

	/**
	 * Panel Class
	 * Generates all the panels used in the script.
	 *
	 * A panel is an element intended to be within a WhutBBInstance.wrap div.
	 *
	 * eg:
	 *	{ div (WhutBBInstance.wrap)
	 *   [ wbb link panel   ]
	 *   [ buttons panel    ]
	 *   [ settings panel*  ]
	 *   [ shortcuts panel* ]
	 *	}
	 *
	 * *Global panels
	 *
	 * Use Panel.factory, instead of new Panel().
	 *
	 * Global (or public) panels are static and part of the Panel.global object,
	 * not a WhutBB instance. They are typically transient, meaning that
	 * they appear in different WhutBB.wraps depending on the toggle state
	 *
	 * For example, emoticons are appended to WBB instace for textarea 1 when its
	 * emoticon button is clicked, but once WBB instace for textarea 2's emoticon button
	 * is clicked, the emoticon panel will be moved to WBB 2's wrap.
	 *
	 * This aliviates the need to generate each panel separately for every instance.
	 * This means that if there are 100s of emoticons, they will only be created once
	 * and moved around as needed, instead of creating 100s of emoticons per instance/textarea.
	 *
	 * Private (non-global) panels are stored in the Panel.set object.
	 * Once panels are initially created within Panel.construct(),
	 * private panels can be copied to (copyTo) a WhutBB instance.
	 *
	 * The only two private panels are Button and Link, because they
	 * are not meant to be transient. Buttons are needed at every instance.
	 *
	 */
	WhutBB.Panel = (function () {

		/**
		 * An element is part of the instance
		 */
		function Panel(element) {
			this.element = element;
		}

		/**
		 * A set of private panels
		 */
		Panel.set = {};

		/**
		 * A set of global panels
		 */
		Panel.global = {};

		/**
		 * Panel.factory creates both global and private panels
		 *
		 * @param name for the panel
		 * @param element to encapsulate
		 * @param priv true for private panels, otherwise global
		 */
		Panel.factory = function (name, element, priv) {
			if (priv) {
				if (!Panel.set[name]) {
					Panel.set[name] = new Panel(element);
				}
				return Panel.set[name];
			}
			if (!Panel.global[name]) {
				Panel.global[name] = new Panel(element);
			}
			return Panel.global[name];
		};

		/**
		 * Creates and initializes every necessary panel
		 */
		Panel.construct = function () {
			Panel.factory('link', dom.dom('div', {className: 'wbblink' + (WhutBB.user.settings.link ? '' : ' wbbhide') },
				dom.dom('a', {href: WhutBB.config.link, title: 'Version r.' + update.version, txt: 'WhutBBCode?', target: '_blank'})), true);
			Panel.factory('button', dom.dom('div', {className: 'wbbbuttons'}), true);

			// Global Panels
			Panel.factory('shortcut', dom.dom('ul', {className: 'wbbshortcut wbbhide'}));
			Panel.factory('emoticon', dom.dom('div', {className: 'wbbemot wbbhide'}));
			Panel.factory('settings', dom.dom('div', {className: 'wbbset wbbhide'}, null, document.body));
			Panel.factory('console', dom.dom('div', {className: 'wbbcon', txt: ''}));
			Panel.attach.fill();
		};

		/**
		 * Copies private panels to a WhutBB Instance
		 */
		Panel.copyTo = function (wbbInst) {
			wbbInst.panels = {};
			dom.oEach(Panel.set, function (name, panel) {
				wbbInst.panels[name] = panel.element.cloneNode(true);
				wbbInst.wrap.appendChild(wbbInst.panels[name]);
			});
		};

		/**
		 * Prints a message to the console
		 */
		Panel.message = function (text, time) {
			var el = WhutBB.Panel.global.console.element;
			el.textContent = text;
			window.setTimeout(function () {
				el.textContent = '';
			}, isNaN(+time) ? 2500 : time);
		};

		Panel.attach = {
			fill: function () {
				// fills the panels appropriately
				this.buttons();
				this.emoticons(-1, Math.min(WhutBB.config.emoticons.length,
					WhutBB.config.emoticonMax));
				this.settings();
				this.shortcuts();
			},
			buttons: function () {
				var f = document.createDocumentFragment();
				dom.aEach(WhutBB.config.blueprint, function (set) {
					dom.aEach(set, function (name) {
						f.appendChild(WhutBB.Button.create(name).make());
					});
					f.appendChild(WhutBB.Button.Space.make());
				});
				Panel.set.button.element.appendChild(f);
				f = null;
			},
			emoticons: function (i, max) {
				var f = document.createDocumentFragment();
				while (++i < max) {
					f.appendChild(WhutBB.Button.emoticon(WhutBB.config.emoticons[i]));
				}
				// attach the div that loads all emoticons if required
				if (max !== WhutBB.config.emoticons.length
						&& WhutBB.config.emoticons.length > WhutBB.config.emoticonMax) {
					f.appendChild(WhutBB.Button.emoticonLoader());
				}
				Panel.global.emoticon.element.appendChild(f);
				f = null;
			},
			settings: function () {
				var list = [];
				dom.oEach(WhutBB.user.options, function (name, data) {
					list.push('<li><label title="' + data.title + '" ><input type="checkbox" data-setting="true" name="' + name + '" '
						+ (WhutBB.user.settings[name] ? 'checked="checked" ' : '') + '/>' + data.txt + '</label></li>');
				});
				Panel.global.settings.element.innerHTML = '<ul>' + list.join('') + '</ul>';
				Panel.global.settings.element.appendChild(Panel.global.console.element);
			},
			shortcuts: function () {
				var ul = Panel.global.shortcut.element;
				var f = document.createDocumentFragment();

				// todo change?
				dom.oEach(WhutBB.config.shortcuts, function (key, shortcuts) {
					dom.oEach(shortcuts, function (letter, button) {
						if (WhutBB.config.validButtons[button]) { // Checks if the site uses this button
							f.appendChild(dom.dom('li', {
								innerHTML: [
									'<strong class="wbb-key">',
									WhutBB.db.getShortcutText(key),
									'+',
									letter.toUpperCase(),
									'</strong>',
									WhutBB.db.buttons[button].title
								].join('')
							}));
						}
					});
				});

				if (f.hasChildNodes()) {
					f.appendChild(dom.dom('li', {
						className: 'wbbnotes',
						innerHTML: '<strong>CTRL</strong> and <strong>Command</strong> (<strong>&#x2318;</strong>) are interchangable'
					}));
					ul.appendChild(f);
				}
			}
		};

		return Panel;

	}());

	/**
	 * Tag Class
	 * Creates a tag of given name
	 *
	 * Use Tag.get(), not new Tag()!
	 * Tag.get() uses lazy loading, and stores all new
	 * tags within Tags.tags[]
	 *
	 * A tag's type generates the appropriate parsing
	 * All tags parse as a two-index array
	 *
	 * If a tag does not require an endpoint (matching tag),
	 * an empty string is required
	 *
	 *   ['[tag]', '[/tag]']
	 *   ['open', '']
	 *   ['', 'close']
	 *
	 * Example, insert a tag directly into a textarea
	 *   bTag = Tag.get('b');
	 *   bTag.insertTo(someTextarea);
	 *
	 * PS: Note the use of WhutBB.box within insertTo().
	 */
	WhutBB.Tag = (function () {

		function Tag(text) {
			Tag.tags[text] = this;
			this.button = WhutBB.db.buttons[text];
			this.tag = this.button.tag || text;
		}

		// Stores new Tags
		Tag.tags = {};

		// Types
		Tag.BASIC = 0;
		Tag.OPTION = 1;
		Tag.OPTION_NOCLOSE = 2;
		Tag.LIST = 3;
		Tag.CUSTOM = 4;

		/**
		 * Gets a tag by a name.
		 * Finds a tag in the tags object or creates a new tag.
		 * Returns an update()'d tag
		 */
		Tag.get = function (name) {
			if (WhutBB.db.buttons[name]) {
				return (Tag.tags[name] || new Tag(name)).update();
			}
		};

		/**
		 * Each button has a type which is used as the parsing method
		 */
		Tag.types = {
			0: function () { // Basic tag [tag][/tag]
				return ['[' + this.tag + ']', '[/' + this.tag + ']'];
			},
			1: function () { // [tag=option][/tag]
				return ['[' + this.tag + '=' + this.option + ']', '[/' + this.tag + ']'];
			},
			2: function () { // [tag=]
				return ['[' + this.tag + '=', ']'];
			},
			3: function () { // List [*] or [#]
				var j = [], li = WhutBB.box.range.selection.split('\n');

				if (li.length > 1) {
					dom.aEach(li, function (item) {
						j.push('[' + this.tag + ']' + item);
					}, this);
					WhutBB.box.range.selection = j.join('\n');
					return ['', ''];
				}

				return ['\n[' + this.tag + ']', ''];
			},
			4: function () { // used for custom tags
				if (typeof this.tag === 'string') {
					return [this.tag, this.tag];
				}
				return [this.tag[0], this.tag[1]];
			},
			5: function () { // just [tag]
				return ['[' + this.tag + ']', ''];
			}
		};

		Tag.prototype.toString = function () {
			return [this.tag, this.option, this.type].join(' ');
		};

		Tag.prototype.insertTo = function (textarea) {
			WhutBB.box.select(textarea).insert(this.parse());
		};

		/**
		 * Parse uses some JavaScript magic to get the function
		 * based on the tag type, and call it with _this_ tag's
		 * instance
		 */
		Tag.prototype.parse = function () {
			return Tag.types[this.type].call(this);
		};

		Tag.prototype.detectOption = function () {
			// console.log('find option');
			return this.button.type === 1 && this.optionText();
		};

		Tag.prototype.defaultText = function () {
			return this.button.placeholder || this.button.val || '';
		};

		Tag.prototype.placeholderText = function () {
			return this.button.placeholder ? ('\n(Default text [' + this.button.placeholder + '] will be removed automatically.)') : '';
		};

		Tag.prototype.optionText = function () {
			if (!WhutBB.e.macro && WhutBB.user.settings.prompt && this.button.noPrompt !== true) {
				this.option = window.prompt((this.button.prompt || this.button.title) + this.placeholderText(), this.defaultText());
			} else {
				this.option = this.defaultText();
			}
			if (this.option === this.button.placeholder || this.option === '') {
				this.option = false;
			}
			return true;
		};

		Tag.prototype.findType = function () {
			return this.option === false ? 0 : this.button.type || 0;
		};

		Tag.prototype.update = function () {
			this.detectOption();
			this.type = this.findType();
			return this;
		};

		return Tag;

	}());

	WhutBB.init();
	WhutBB.factory();
}());
