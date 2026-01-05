// ==UserScript==
// @name		Logical Gaia
// @version		0.1.51
// @copyright	2014, Logical Gamers, www.logicalgamers.com
// @description	upgrades Gaia Online
// @grant		GM_info
// @match		http://www.gaiaonline.com/*
// @namespace	Logical Gamers, www.logicalgamers.com
// @changelog	http://forum.logicalgamers.com/downloads.php?do=file&id=1
// @downloadURL https://update.greasyfork.org/scripts/3980/Logical%20Gaia.user.js
// @updateURL https://update.greasyfork.org/scripts/3980/Logical%20Gaia.meta.js
// ==/UserScript==

if (typeof(unsafeWindow) == "undefined")
	unsafeWindow = window;

var YAHOO = unsafeWindow.YAHOO,
	YUI = unsafeWindow.YUI;

with (unsafeWindow) {
	const COLLAPSED = 1,
		EXPANDED = 2;
}

var LGaia = {
	apps: [],

	// Ajax connection
	// connect(GET/POST, URL, parameters, callback function)
	connect: function(t, u, d, c, app) {
		(typeof(app) == "undefined" ? LGaia : LGaia.apps[app]).debug("Ajax connection: " + t + " " + u + "?" + d);
		if (t == "GET")
		{
			u = u + (d ? "?" + d : "");
			d = null;
		}
		YAHOO.util.Connect.asyncRequest(t, u, {failure: function(o){ }, success: c}, d);
	},
	cookies: {

		// Erase all cookies.
		clear: function() {
			var cookies = document.cookie.split("; ");
			for (x = 0; x < cookies.length; x++) {
				var c = cookies[x].match(/^([^=]+)=.*$/)[1];
				if (c.indexOf(this.prefix) == 0)
					this.remove(c.substring(this.prefix.length));
			}
		},
		defaults: {},

		// Converts data types.
		parse: function(i) {
			if (i.match(/^\d+$/))
				return parseInt(i, 10);
			if (i.match(/^\[(.*)\]$/)) {
				i = i.substring(1, i.length - 1).split(/,/);
				for (var x = 0; x < i.length; x++)
					i[x] = this.parse(i[x]); // LGaia.cookies.parse
			}
			if (i == "null")
				return null;
			return i;
		},
		prefix: "LG_",

		// read(cookie name, optional array index)
		read: function(name, index) {

			// check for ("name[index]") instead of (name, index)
			if (typeof(index) == "undefined") {
				index = name.match(/\[(\d+)\]$/);
				if (
					index &&
					index[1]
				) {
					index = index[1];
					name = name.substring(0, name.length - index.toString().length - 2); // remove the last [chars]
				}
				else
					index = null;
			}
			var cookies = document.cookie.split(";");
			for (x = 0; x < cookies.length; x++) {

				// Trim.
				var c = cookies[x].match(/^\s*(.*)$/)[1];

				// If this cookie starts with LG_name=
				if (c.indexOf(this.prefix + name + "=") == 0) {

					// Strings, integers, and arrays.
					c = this.parse(c.substring(name.length + this.prefix.length + 1, c.length)); // starting after LG_name=
					if (
						typeof(index) == "number" &&
						c.length > index
					)
						return c[index];
					return c;
				}
			}
			return name in this.defaults ? (index && index in this.defaults[name] ? this.defaults[name][index] : this.defaults[name]) : null;
		},

		// Deletes a cookie.
		// remove(cookie name)
		remove: function(name)
		{
			this.set(name, null, -31536000000);
			//document.cookie = this.prefix + name + "=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		},

		// Sets a cookie.
		// set(cookie name, cookie value, optional expiration time)
		set: function(name, value, expires)
		{
			if (
				name in this.defaults &&
				this.defaults[name] === value
			)
				this.remove(name);
			else
			{
				var index = name.match(/\[(\d+)\]$/);
				index = index && index[1] || null;
				if (index !== null)
				{
					name = name.substring(0, name.length - index.toString().length - 2);
					var temp = __LG__.cookies.read(name);
					temp[index] = value;
					value = temp;
				}
				if (
					typeof(value) == "object" &&
					value !== null
				)
					value = "[" + value.join(",") + "]";
				if (typeof(expires) == "undefined")
					expires = 31536000000;
				var d = new Date();
				d.setTime(d.getTime() + expires);
				document.cookie = this.prefix + name + "=" + value + "; expires=" + d.toGMTString() + "; path=/";
			}
		}
	},
	css: '#lgaia-copyright { background-color: rgba(0, 0, 0, 0.66); padding: 5px 0; } ' +
			'#lgaia-copyright a { color: #ffffff; } ' +
		 '#lgaia-debugger { background-color: #ffffff; border-top : 1px solid #000000; bottom: 0; color: #000000; display: none; height: var(debugger_height); overflow: auto; position: fixed; width: 100%; z-index: 3; } ' +
			'#lgaia-debugger > div { border-bottom : 1px solid #c0c0c0; font-size: 10px; padding: 4px 6px; } ' +
			'#lgaia-debugger > div:nth-child(even) { background-color : #f8f8f8; } ' +
		 '#lgaia-gui { background-color: rgba(0, 0, 0, 0.33); border-right: 2px solid #000000; color: #ffffff; left: 0; font-size: 10px; height: calc(100% - var(footer_height)); position: fixed; text-align: center; top: 0; width: var(gui_width); z-index: 9998; } ' +
			'#lgaia-gui a { color: #ffffff; font-weight: bold; text-decoration: none; } ' +
			'#lgaia-gui h2 { padding: 10px 0; margin: 0; text-align: center; } ' +
				'#lgaia-gui > h2 > a { font-size: 15px; } ' +
		 '#lgaia-gui-bottom { bottom: 0; position: absolute; width: 100%; } ' +
		 '.lgaia-gui-item { background-color: rgba(0, 0, 0, 0.33); border-width: 0 0 1px 0; line-height: 12px; list-style-type: none; position: relative; } ' +
			'.lgaia-gui-item:nth-child(odd) { background-color: rgba(0, 0, 0, 0.44); } ' +
			'.lgaia-gui-item:hover { background-color: rgba(0, 0, 0, 0.66); } ' +
			'.lgaia-gui-item > a { display: block; min-height: 12px; padding: 5px 0; } ' +
			'.lgaia-gui-item > span { background-color: #ff0000; border-radius: 2px; cursor: pointer; display: none; height: 12px; position: absolute; right: -7px; top: 5px; vertical-align: middle; width: 12px; } ' +
			'.lgaia-gui-item > ul { background-color: rgba(0, 0, 0, 0.85); border-color: #000000; border-radius: 0 2px 2px 0; border-style: solid; border-width: 1px 1px 1px 0; display: none; max-height: 480px; overflow: auto; position: absolute; left: var(gui_width); text-align: left; top: -2px; white-space: nowrap; } ' +
				'.lgaia-gui-item > ul > li { border-color: #000000; border-style: dotted; border-width: 0 1px 1px 0; list-style-type: none; } ' +
					'.lgaia-gui-item > ul > li.item { background-position: 5px center; background-repeat: no-repeat; } ' +
						'.lgaia-gui-item > ul > li.item > * { line-height: 30px; min-height: 30px; padding: 5px 40px; } ' +
					'.lgaia-gui-item > ul > li > * { display: block; line-height: 12px; min-height: 12px; padding: 5px; } ' +
		 '#lgaia-gui-items { border-width: 1px 0 0 0; margin: 0; padding: 0; } ' +
		 '#lgaia-gui-expando { background-image: url(var(expando)); background-position: 0 center; background-repeat: no-repeat; left: 0; height: 26px; margin-left: calc(var(gui_width) - 13px); margin-top: -5px; position: fixed; top: 50%; width: 26px; z-index : 9999; } ' +
		 '#lgaia-gui-wrapper { height: 100%; } ' +
		 '.notifications-close { background-color: #ff0000; border-radius: 2px; cursor: pointer; display: inline-block; height: 12px; line-height: 10px; position: absolute; right: 5px; text-align: center; vertical-align: middle; width: 12px; } ' +
		 '.lgaia-gui-item, #lgaia-gui-items { border-color: #202020; border-style: solid; }',
	cssVars: {
		background: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAABCAYAAAAo2wu9AAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAA1SURBVHjaYhRysA1hgABGPDQhMXQ2MXxC4mSoYwTi/4xEmjcYMMxPXN8fPtL9fv+hIkCAAQB7dwgBIzzY0AAAAABJRU5ErkJggg==",
		debugger_height: "150px",
		expando: "data:image/gif;base64,R0lGODlhHwAKAJECAAAAAP///////wAAACH5BAEAAAIALAAAAAAfAAoAAAI/lB8YubzSjpQBMIBrxpanSVmQtXTlKYLQ2JheVWZrGHcb7JkwQjb+D/yJNJyi8YiUwYLMZoqlioJ2FKm1aigAADs=",
		footer_height: function() { return (document.getElementById("footer") ? document.getElementById("footer").clientHeight : 0) + "px"; },
		gui_width: "150px"
	},

	// Sunday, January 1st, 2014
	dateString: function(date) {
		if (typeof(date) == "undefined")
			var date = new Date();
		var day = date.getDate();
		return LGaia.days[date.getDay()] + ", " + LGaia.months[date.getMonth()] + " " + day + LGaia.ordinalSuffix(day) + ", " + date.getFullYear();
	},
	days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	debug: function(message, id, push) {
		var timestamp = LGaia.timestamp();
		timestamp = '[' + timestamp.hours + ':' + timestamp.minutes + ':' + timestamp.seconds + timestamp.meridiem + ']';
		console.log(timestamp + " LGaia: " + message + (typeof(id) != "undefined" ? " (" + id + ")" : ""));

		// the debug entry
		var entry = typeof(id) == "string" && document.getElementById("lgaia-debug-entry-" + id) ? document.getElementById("lgaia-debug-entry-" + id) : false;

		// Update old entry.
		if (entry) {

			// Forced duplicate entries: remove old entry, add new entry to bottom of list.
			if (push)
				entry.parentNode.removeChild(entry);
			else {
				entry.innerHTML = timestamp + ' ' + message;
				return id;
			}
		}

		// New debug entry.
		var div = document.createElement("div");
		if (typeof(id) != "string") {
			var id = "x";
			while (document.getElementById("lgaia-debug-entry-" + id))
				id = LGaia.random.string();
		}
		//div.setAttribute("class", typeof(push) == "string" ? push : (this.GUI.debugger.childNodes.length % 2 ? "even" : "odd"));
		div.setAttribute("id", "lgaia-debug-entry-" + id);
		div.innerHTML = timestamp + ' ' + message;
		LGaia.GUI.debugger.appendChild(div);
		LGaia.GUI.debugger.scrollTop = LGaia.GUI.debugger.scrollHeight;
		return id;
	},
	debugger: {
		toggle: function() {

			// If it's collapsed, expand it.
			if (this.status == COLLAPSED) {
				this.status = EXPANDED;
				LGaia.GUI._.style.height = 'calc(100% - ' + LGaia.cssVars.footer_height() + ' - ' + LGaia.cssVars.debugger_height + ')';
				LGaia.GUI.debugger.style.display = "block";
				LGaia.GUI.debugger.style.marginBottom = LGaia.cssVars.footer_height();
			}

			// If it's expanded, collapse it.
			else {
				this.status = COLLAPSED;
				LGaia.GUI._.style.height = 'calc(100% - ' + LGaia.cssVars.footer_height() + ')';
				LGaia.GUI.debugger.style.display = "none";
				LGaia.GUI.debugger.style.marginBottom = "0px";
			}
		},
		status: COLLAPSED,
	},
	GUI: {
		backgroundPosition: {},

		// Collapse the GUI by 1px at a time.
		collapse: function() {
			var w = LGaia.GUI._.clientWidth;
			LGaia.GUI._.style.width = (w - 1) + "px";
			LGaia.GUI.expando.style.marginLeft = (w - 13) + "px";
			if (!LGaia.GUI.overlay) {
				document.body.style.marginLeft = (w - 1) + "px";
				LGaia.GUI.debugger.style.marginLeft = "-" + (w - 1) + "px";
			}
			if (w in LGaia.GUI.backgroundPosition) {
				LGaia.GUI.expando.style.backgroundPosition = LGaia.GUI.backgroundPosition[w] + "px center";
				LGaia.GUI.wrapper.style.visibility = "hidden";
			}
			if (w > 13)
				LGaia.GUI.timeout = setTimeout(LGaia.GUI.collapse, LGaia.GUI.delay);
			else
				LGaia.debug("Collapsed the GUI.", "gui-expando", true);
		},
		delay: 1,

		// Expand the GUI by 1px at a time.
		expand: function() {
			var w = LGaia.GUI._.clientWidth;
			LGaia.GUI._.style.width = (w + 1) + "px";
			LGaia.GUI.expando.style.marginLeft = (w - 13) + "px";
			if (!LGaia.GUI.overlay) {
				document.body.style.marginLeft = (w + 1) + "px";
				LGaia.GUI.debugger.style.marginLeft = "-" + (w + 1) + "px";
			}
			if (w in LGaia.GUI.backgroundPosition)
				LGaia.GUI.expando.style.backgroundPosition = LGaia.GUI.backgroundPosition[w] + "px center";
			if (w < parseInt(LGaia.cssVars.gui_width, 10))
				LGaia.GUI.timeout = setTimeout(LGaia.GUI.expand, LGaia.GUI.delay);
			else {
				LGaia.GUI.wrapper.style.visibility = "visible";
				LGaia.debug("Expanded the GUI.", "gui-expando", true);
			}
		},
		overylay: true,
		timeout: null,
		toggle: function() {

			// Stop collapsing/expanding.
			if (this.timeout) {
				clearTimeout(this.timeout);
				this.timeout = null;
			}

			// Collapse the GUI.
			if (this.status == EXPANDED) {
				LGaia.debug("Collapsing the GUI.", "gui-expando", true);
				this.status = COLLAPSED;
				this.collapse();
			}

			// Expand the GUI.
			else {
				LGaia.debug("Expanding the GUI.", "gui-expando", true);
				this.status = EXPANDED;
				this.expand();
			}
		},
		status: EXPANDED
	},
	head: document.getElementsByTagName("head").item(0),
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	notifications: {
		close: function(id) {
			LGaia.debug("Marked notifications for " + LGaia.apps[id].title + " as read.", "notif" + id, true);
			var ul = LGaia.apps[id].guiItem.getElementsByTagName("ul").item(0);
			ul.style.display = "none";
			var lis = ul.getElementsByTagName("li");
			for (var x = 1; x < lis.length; x++)
				ul.removeChild(lis.item(x));
		},
		open: function(id) {
			if (typeof(id) != "number") {
				var id = this.parentNode.getAttribute("id").match(/\-(\d+)$/)[1];
				span = this;
			}
			else
				span = LGaia.apps[id].guiItem.getElementsByTagName("span").item(0);
			LGaia.debug("Reading notifications for " + LGaia.apps[id].title + "...", "notif" + id, true);
			span.style.display = "none";
			span.innerHTML = "0";
			var ul = LGaia.apps[id].guiItem.getElementsByTagName("ul").item(0);
			ul.style.display = "block";
			ul.style.width = "auto"; // sometimes it has pre-notifications width
		}
	},
	ordinalSuffix: function(n) {
		n = Math.abs(parseInt(n, 10));

		// 4 to 21 to includes exceptions 11-13
		if (
			n > 4 &&
			n < 21
		)
			return "th";

		// 0-3, 22+
		var suf = ["th", "st", "nd", "rd"];
		n = n.toString();
		n = parseInt(n.charAt(n.length - 1), 10);

		// 0-4 = suf[x]
		if (n in suf)
			return suf[n];

		// 5-9 = th
		return suf[0];
	},
	random: {
		integer: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		string: function(len) {
			if (typeof(len) == "undefined")
				len = 10;
			var pool = "abcdefghijklmnopqrstuvwxyz0123456789",
				str = "";
			for (var x = 0; x < len; x++)
				str += pool[Math.floor(Math.random() * 36)];
			return str;
		}
	},

	// connect, cookies, debug, gui (click), id, notify, timeout
	register: function(app) {
		app.connect = function(a, b, c, d) {
			return LGaia.connect(a, b, c, typeof(d) == "undefined" ? null : d, this.id);
		};
		app.cookies = LGaia.cookies;
		app.debug = function(message, id, push) {
			if (typeof(id) == "undefined")
				id = LGaia.random.string();
			if (typeof(push) == "undefined")
				push = null;
			id = this.id.toString() + id;
			return LGaia.debug('&nbsp; ' + this.title + ': ' + message, id, push);
		};
		app.gui = function() {
			LGaia.debug(this.title + " was clicked on the GUI.");

			// If there are notifications, read them.
			if (LGaia.apps[this.id].guiItem.getElementsByTagName("span").item(0).innerHTML != "0")
				LGaia.notifications.open(this.id);

			// If there is a command, do it.
			else if ("click" in this)
				this.click(this);

			// Do nothing?
			else {
			}
		};
		app.id = this.apps.length;
		app.notify = function(html, link) {
			var span = LGaia.apps[this.id].guiItem.getElementsByTagName("span").item(0);
			if (span.style.display == "inline-block")
				span.innerHTML = parseInt(span.innerHTML, 10) + 1;
			else if (LGaia.apps[this.id].guiItem.getElementsByTagName("ul").item(0).style.display != "block") {
				span.style.display = "inline-block";
				span.innerHTML = "1";
			}
			if (html) {
				this.debug("Notification" + (link ? " (" + link + ")" : "") + ": " + html);
				var li = document.createElement("li");
				if (link) {
					var inner = document.createElement("a");
					inner.setAttribute("href", link);
					inner.setAttribute("title", link);
				}
				else
					var inner = document.createElement("div");
				inner.innerHTML = html;
				li.appendChild(inner);
				LGaia.apps[this.id].guiItem.getElementsByTagName("ul").item(0).appendChild(li);
				return li;
			}
			return true;
		};
		app.timeout = function(method, time) {

			// They're running a method on their app. Sanitize it, because whatever.
			if (
				typeof(method) == "string" &&
				method.match(/^\w[\d\w]*$/) &&
				typeof(time) == "number"
			) {
				this.debug("Preparing to " + method + " in " + (time / 1000) + " seconds.");
				return eval(
						'setTimeout(' +
							'"LGaia.apps[' + this.id + '].' + method + '(LGaia.apps[' + this.id + ']);", ' +
							time +
						')'
					);
			}

			// Tsk, tsk, tsk.
			this.debug("Invalid method or time detected.");
			return false;
		};
		this.apps.push(app);
	},

	// 12 hour format, meridiem
	timestamp: function() {
		var timestamp = new Date();
		var hours = timestamp.getHours(),
			minutes = timestamp.getMinutes(),
			seconds = timestamp.getSeconds();
		if (hours > 11) {
			hours -= 12;
			var meridiem = "pm";
		}
		else
			var meridiem = "am";
		if (!hours)
			hours = 12;
		return {
			date: timestamp.getDate(),
			hours: hours,
			minutes: (minutes < 10 ? "0" : "") + minutes,
			seconds: (seconds < 10 ? "0" : "") + seconds,
			meridiem: meridiem
		};
	},
	title: "Logical Gaia",

	// Initiate LGaia.
	init: function() {

		// Delay initiation due to Gaia Online's own window.onload
		setTimeout(LGaia.__init, 100);
	},
	__init: function() {

		// Create GUI
		var div = document.createElement("div");
		div.setAttribute("id", "logical-gaia");
		div.innerHTML = '<div id="lgaia-gui">' +
				'<div id="lgaia-gui-wrapper">' +
					'<h2><a href="#" onclick="window.location.reload();" title="Refresh the Page">LGaia<\/a><\/h2>' +
					'<ul id="lgaia-gui-items">' +
//						'<li class="lgaia-gui-item"><a href="#" onclick="LGaia.settings(); return false;" title="Settings">Settings<\/a><\/li>' +
						'<li class="lgaia-gui-item"><a href="#" onclick="LGaia.debugger.toggle(); return false;" title="Debugger">Debugger<\/a><\/li>' +
					'<\/ul>' +
					'<div id="lgaia-gui-bottom">' +
						'<div id="lgaia-copyright">&copy; <a href="http://forum.logicalgamers.com/" target="_blank">Logical Gamers<\/a><\/div>' +
					'<\/div>' +
				'<\/div>' +
			'<\/div>' +
			'<a href="#" id="lgaia-gui-expando" onclick="LGaia.GUI.toggle(); return false;"><\/a>' +
			'<div id="lgaia-debugger"><div id="lgaia-debug-entry-x">Initiating LGaia...<\/div><\/div>';
		document.body.appendChild(div);

		// Expando background positions:
		var gui_width = parseInt(LGaia.cssVars.gui_width, 10);
		var y = 0;
		for (var x = gui_width - 1; x > 0; x -= gui_width / 6) {
			LGaia.GUI.backgroundPosition[x] = y;
			y--;
		}
		LGaia.GUI._ = document.getElementById("lgaia-gui");
		LGaia.GUI.debugger = document.getElementById("lgaia-debugger");
		LGaia.GUI.expando = document.getElementById("lgaia-gui-expando");
		LGaia.GUI.items = document.getElementById("lgaia-gui-items");
		LGaia.GUI.wrapper = document.getElementById("lgaia-gui-wrapper");

		// If Gaia's content doesn't have room for the GUI, move the content to the side.
		LGaia.GUI.overlay =
			document.getElementById("gaia_content") &&
			(document.body.clientWidth - document.getElementById("gaia_content").clientWidth) > parseInt(LGaia.cssVars.gui_width, 10) * 2;

		// Apply CSS
		LGaia.debug("Applying CSS...", "css1");

		// If overlaying, hide the needless expando.
		if (LGaia.GUI.overlay) {
			LGaia.debug("GUI set to overlay mode.");// &gt;" + parseInt(LGaia.cssVars.gui_width, 10) * 2 + "px free with " + document.body.clientWidth + " - " + document.getElementById("gaia_content").clientWidth + " = " + (document.body.clientWidth - document.getElementById("gaia_content").clientWidth) + "px");
			//LGaia.css += '#lgaia-gui-expando { display: none; } ';
		}

		// If not overlaying, move the content to the side.
		else
			LGaia.css += 'body { margin-left: var(gui_width); } ' +
				'#lgaia-debugger { margin-left: -var(gui_width); } ' +
				'#lgaia-gui-expando { display: inline-block; } ';
		LGaia.debug("Applied expando CSS...", "css1");

		var css = LGaia.css;
		for (var v in LGaia.cssVars)
			css = css.replace(new RegExp("var\\(" + v.replace(/(\_)/g, "\\$1") + "\\)", "g"), typeof(LGaia.cssVars[v]) == "function" ? LGaia.cssVars[v]() : LGaia.cssVars[v]);
		LGaia.stylesheet = document.createElement("style");
		LGaia.stylesheet.setAttribute("id", "lgaia-stylesheet");
		LGaia.stylesheet.setAttribute("type", "text/css");
		if ("styleSheet" in LGaia.stylesheet)
			LGaia.stylesheet.cssText = css;
		else
			LGaia.stylesheet.appendChild(document.createTextNode(css));
		LGaia.head.appendChild(LGaia.stylesheet);
		// LGaia.head.innerHTML += '<style id="lgaia-stylesheet" type="text/css"><!-- ' + css + ' --><\/style>';
		LGaia.stylesheet = document.getElementById("lgaia-stylesheet");
		LGaia.debug("Applied CSS successfully!", "css1");

		// Initiate extensions.
		LGaia.debug("Initiating extensions...", "initext");
		for (var x = 0; x < LGaia.apps.length; x++) {
			LGaia.debug("Initiating " + LGaia.apps[x].title + "...", "app" + x);
			LGaia.apps[x].guiItem = document.createElement("li");
			LGaia.apps[x].guiItem.className = "lgaia-gui-item";
			LGaia.apps[x].guiItem.setAttribute("id", "lgaia-gui-item-" + x);
			LGaia.apps[x].guiItem.innerHTML = '<a href="#" onclick="LGaia.apps[' + x + '].gui();">' + LGaia.apps[x].title + '<\/a>';
			var span = document.createElement("span");
			span.appendChild(document.createTextNode("0"));
			span.onclick = LGaia.notifications.open;
			LGaia.apps[x].guiItem.appendChild(span);
			LGaia.apps[x].guiItem.innerHTML += '<ul><li style="border-top-width: 1px;"><div padding-right: 32px;"><strong>Notifications:<\/strong><a class="notifications-close" onclick="LGaia.notifications.close(' + x + ');">x<\/a><\/div><\/li><\/ul><\/li>';
			LGaia.GUI.items.appendChild(LGaia.apps[x].guiItem);
			if ("init" in LGaia.apps[x])
				LGaia.apps[x].init(LGaia.apps[x]);
			LGaia.debug("Initiated " + LGaia.apps[x].title + " successfully!", "app" + x);
		}
		LGaia.debug("Initiated extensions successfully!", "initext", true);

		// Update debug entry.
		LGaia.debug("Initiated LGaia successfully!", "x", true);
	}
};






/****************************\
|*                          *|
|*   DAILY CHANCE GRABBER   *|
|*                          *|
\****************************/

LGaia.register({
	title: "Daily Rewards",
	author: "Logical Gamers",
	version: "1.0",
	init: function(app) {
		if (document.getElementById("dailyReward")) {
			document.getElementById("dailyReward").style.display = "none";
			app.debug("Grabbing Daily Rewards...", "init");
			app.grab(app, 0);
			return true;
		}
		app.debug("No daily reward found.");
		return false;
	},
	gold: 0,
	goldThumb: "",
	grab: function(app, index) {
		app.debug("Grabbing reward #" + index + "...", index);

		// Grab the reward.
		return app.connect(
			"GET", "/dailycandy/pretty/",
			"action=issue&list_id=" + app.rewards[index] + "&_view=json",
			function(o) {
				var response = eval("(" + o.responseText + ")");

				// If there was an error,
				if (typeof(response.error) == "object") {
					if (response.error.message == "The daily reward was already claimed for today.")
						app.debug("Reward #" + index + " had already been grabbed!", index);
					else
						app.debug(response.error.title + ": " + response.error.message + " (Reward #" + app.rewards[index] + ")", index, true);
				}

				// No error; received reward successfully.
				else {
					app.debug("Grabbed reward #" + index + " (" + response.data.reward.name + ") successfully!", index);

					// If the reward was gold,
					if (
						response.data.reward.name.match(/ Gold\!?$/) &&
						!response.data.reward.serial
					) {
						app.gold += parseInt(response.data.reward.name.replace(/\ Gold\!?$/, ""), 10);
						app.goldThumb = response.data.reward.thumb;
					}

					// Reward is not gold.
					else {
						var notification = app.notify(
							response.data.reward.name,
							response.data.reward.serial ? "/inventory/?serial=" + response.data.reward.serial : ""
						);
						notification.className = "item";
						notification.style.backgroundImage = 'url("http://s.cdn.gaiaonline.com/images/' + response.data.reward.thumb + '")';
					}
				}

				// Continue until last item.
				if (index < app.rewards.length - 1)
					app.grab(app, index + 1);
				else {
					if (app.gold) {
						var notification = app.notify(app.gold + ' Gold');
						notification.className = "item";
						notification.style.backgroundImage = 'url("http://s.cdn.gaiaonline.com/images/' + app.goldThumb + '")';
					}
					app.debug("Grabbed Daily Rewards successfully!", "init", true);
				}
			}
		);
	},
	rewards: [1, 2, 3, 4, 5, 7, 8, 11, 12, 13]
});



/**********************\
|*                    *|
|*   DUMPSTER DIVER   *|
|*                    *|
\**********************/

LGaia.register({
	title: "Dumpster Diver",
	init: function(app) {

		// force an integer, so that l33t h4x cookie setters don't cause a mathematical JS error
		var lastDive = parseInt(app.cookies.read("EXT_DD"), 10);

		// If we've dove recently,
		if (lastDive) {
			app.debug("Dumpster dove too recently. Waiting.");

			// Wait until the full five minutes have passed, with a little extra for no false positives.
			app.nextDive = app.timeout("dive", 315000 - (new Date().getTime() - lastDive));
			return false;
		}
		return app.dive(app);
	},
	click: function(app) {

		// If it's running, turn it off.
		if (app.status == "on") {
			alert("Dumpster Diver is now disabled.");
			app.debug("Disabled.");
			app.status = "off";
			app.guiItem.style.backgroundColor = "rgba(64, 0, 0, 0.44)";

			// If we're about to dive, don't.
			if (app.nextDive)
				clearTimeout(app.nextDive);
			return false;
		}

		// else isn't needed here, but this layout isn't permanent anyway
		else {
			alert("Dumpster Diver is now enabled.");
			app.debug("Enabled.");
			app.status = "on";
			app.guiItem.style.backgroundColor = "";
			app.init(app);
			return true;
		}
	},
	dive: function(app) {
		if (app.status == "on") {
			app.debug("Dumpster diving...", "diving");

			// Get the booty.
			app.connect(
				"POST", "/dumpsterdive",
				"mode=showConfirmed",
				function(o) {
					app.debug("Dumpster dove!", "diving", true);

					// If the dumpster wasn't empty,
					if (!o.responseText.match(/\<span\>Dumpster Empty\<\/span\>/)) {

						// If we didn't get the you-tried-this-too-recently error,
						if (!o.responseText.match(/Pete looks a little crazy XD, maybe if you try later\.\.\./)) {

							// Parse the data.
							var donator = o.responseText.match(/\<div id=\"grant_text2\">Donated by\: (.+?)\<\/div\>/),
								image = o.responseText.match(/\<img id=\"grant_image\" src=\"((?:https?\:)?\/\/s\.cdn\.gaiaonline\.com\/images\/thumbnails\/[\d\-\w]+\.[\d\w]+)\" \/\>/),
								mkt_t = o.responseText.match(/\src=\"(http\:\/\/www\.gaiaonline\.com\/internal\/mkt_t.php\?mid=\d+\&tm=\d+)\"/),
								name = o.responseText.match(/\<div id=\"grant_text1\">(.+?)\<\/div\>/);
							name = name ? name[1] : "Unknown Item";
							donator = donator ? donator[1] : "Unknown";
							app.debug("Found " + name + " donated by " + donator);

							// If we've got this exact drop recently,
							var notifID = "lgaia-dd-" + (name + "-" + donator).replace(/\s+/g, "-").replace(/[^\w\d\-]+/g, "").toLowerCase(); // lgaia-dd-1-philosophers-cache-username
							if (document.getElementById(notifID)) {
								var span = document.getElementById(notifID).getElementsByTagName("span").item(0);
								var count = span.innerHTML.match(/(\d+)$/);
								count = !count ? 1 : parseInt(count[1], 10);
								span.innerHTML = 'x' + (count + 1);

								// Alert of a notification change.
								app.notify();
							}
							else {

								// Notify the user. [Image] Name (donated by: donator)
								var notification = app.notify(
									'<a href="http://www.gaiaonline.com/marketplace/itemsearch/?search=' + name.replace(/^\d+\s+/, "") + '&amp;filter=0" title="Marketplace: ' + name + '">' + name + '<\/a>' +
									(
										donator == 'Anonymous' ?
										'' :
										' (donated by: <a href="http://www.gaiaonline.com/p/' + donator.replace(/\s+/g, '-') + '" title="' + donator + '\'s profile">' + donator + '<\/a>)'
									) +

									// If we get the same item by the same person again, we'll put a counter here.
									'&nbsp;<span style="position: absolute; right: 10px;"><\/span>'
								);
								notification.setAttribute("id", notifID);
								notification.style.backgroundImage = 'url("' + image[1] + '")';
								notification.style.backgroundPosition = "5px center";
								notification.style.backgroundRepeat = "no-repeat";
								notification.firstChild.style.lineHeight = "30px";
								notification.firstChild.style.minHeight = "30px";
								notification.firstChild.style.padding = "5px 40px"; // 5px padding + 30px background + 5px padding
							}

							// Display this unique image that appears with each dive.
							// Presumably tracks bot by seeing who gets items WITHOUT downloading the image.
							// Having the user view the image mimics legitimate diving behavior.
							if (mkt_t)
								document.body.innerHTML += '<img src="' + mkt_t[1] + '" style="bottom: 0; height: 1px; position: absolute; right: 0; width: 1px;" />';
						}

						// Don't dive again for 5 minutes, or else Pete will get a little crazy XD.
						app.cookies.set("EXT_DD", new Date().getTime(), 300000);
					}

					// (1) Lay down. (2) Try not to cry. (3) Cry a lot.
					else
						app.debug("Dumpster empty.");

					// Dive again in 5 minutes + totally-not-a-bot random amount of seconds.
					app.nextDive = app.timeout("dive", 300000 + Math.floor(Math.random() * 30000));
				}
			);
			return true;
		}
		app.debug("Can't dive. App is off!");
		return false;
	},
	nextDive: false,
	status: "on"
});



/****************************\
|*                          *|
|*     Loyal's Wildcard   *|
|*                          *|
\****************************/

LGaia.register({
	title: "Loyal's Wildcard",
	//init: function(app) {},
	click: function(app) {
		app.open(app);
	},
	caches: 0,
	open: function(app) {
		app.debug("Getting Special inventory list.");
		return app.connect(
			"GET", "/inventory/ajax/special", "",
			function(o) {
				var special = o.responseText;
				var cache = special.match(/data\-slot=\"(\d+)\.\d+\.[\d\w]+\" slot=\"\d+\" title=\"Loyal's Wildcard(?: \((\d+)\))?\"/);

				// Do Loyal's Wildcard?
				if (cache) {
					app.caches = cache[2];
					app.debug("Found " + cache[2] + " Loyal's Wildcard.");
					return app.connect(
						"GET", "/inventory/itemdetail/" + cache[1], null,
						function(o) {
							var details = o.responseText;
							var use = details.match(/(\/inventory\/use\/\d+\/\d+)\?(nonce=\d+\.\d+\.\d+)/);
							if (use) {
								app.debug("Opening Loyal's Wildcard.");
								return app.connect(
									"GET", use[1], use[2],
									function(o) {
										var result = o.responseText;
										var image = result.match(/http\:\/\/s\d*\.cdn\.gaiaonline\.com\/images\/thumbnails\/[\d\w]+\.png/),
											loot = result.match(/\<h3\>You got\: ([^\<]+?)(?: \(\d+\))?\<\/h3\>/);
										if (loot) {
											loot[1] = loot[1].replace(/^Loyal's Wildcard\: /, "");
											var id = "lgaia-pc-" + loot[1].toLowerCase();
											if (document.getElementById(id)) {
												document.getElementById(id).firstChild.innerHTML = "." + document.getElementById(id).firstChild.innerHTML;
											}
											else {
												var notification = app.notify(loot[1]);
												notification.className = "item";
												notification.setAttribute("id", id);
												notification.style.backgroundImage = 'url("' + image[0] + '")';
											}
											if (app.caches)
												app.timeout("open", 1000);
										}
										else
											app.debug("Could not find reward in: " + result);
									}
								);
							}
							else
								app.debug("Couldn't find nonce in: " + details);
						}
					);
				}
				else {
					app.debug("Found NO Loyal's Wildcard.");
					alert("There are no more Loyal's Wildcard to open.");
				}
			}
		);
	}
});





unsafeWindow.LGaia = LGaia;

unsafeWindow.onload = LGaia.init;