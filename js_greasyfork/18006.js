// ==UserScript==
// @name        Linky Square
// @author 		eight <eight04@gmail.com>
// @version     0.2.1
// @namespace   eight04.blogspot.com
// @description Grab links by dragging a square.
// @include     *
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @compatible  firefox
// @compatible  chrome
// @compatible  opera
// @require https://greasyfork.org/scripts/7212-gm-config-eight-s-version/code/GM_config%20(eight's%20version).js?version=156587
// @downloadURL https://update.greasyfork.org/scripts/18006/Linky%20Square.user.js
// @updateURL https://update.greasyfork.org/scripts/18006/Linky%20Square.meta.js
// ==/UserScript==

function createLinky(o){
	var delay = function(){
		function wrap(target) {
			target();
			target.delay = false;
		}
		
		return function(target) {
			if (!target.delay) {
				target.delay = true;
				setTimeout(wrap, 0, target);
			}
		};
	}();
	
	var tracker = function(o){
		var ox = 0, oy = 0, x = 0, y = 0,
			traceStart = false,
			linkCount = 0,
			enable = false;

		var ui = function(){
			GM_addStyle(".linky-info-box,.linky-select-box{position:absolute;z-index:65534;display:none}.linky .linky-anchor-box{background:#ff0}.linky .linky-anchor-box img{filter:url(data:image/svg+xml;charset=utf8;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KCTxmaWx0ZXIgaWQ9ImZpbHRlciI+DQoJCTxmZUZsb29kIHJlc3VsdD0iZmxvb2RGaWxsIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIg0KCQkJCWZsb29kLWNvbG9yPSJ5ZWxsb3ciIGZsb29kLW9wYWNpdHk9IjEiLz4NCgkJPGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZmxvb2RGaWxsIiBtb2RlPSJtdWx0aXBseSIvPg0KCTwvZmlsdGVyPg0KPC9zdmc+DQo=#filter)}.linky-select-box{border:2px dashed red;box-sizing:border-box}.linky-info-box{color:#000;border:1px solid grey;background:#fff;padding:.3em .6em}.linky body{-moz-user-select:none;-webkit-user-select:none;pointer-events:none}.linky .linky-info-box,.linky .linky-select-box{display:block}");

			var selectBox = document.createElement("div");
			selectBox.className = "linky-select-box";

			var infoBox = document.createElement("div");
			infoBox.className = "linky-info-box";

			var body = document.body;
			body.appendChild(selectBox);
			body.appendChild(infoBox);
			
			function updateSelectBox(x, y, w, h){
				var s = selectBox.style;
				s.left = x + "px";
				s.top = y + "px";
				s.width = w + "px";
				s.height = h + "px";
			}
			
			function updateInfoBox(x, y, text) {
				var s = infoBox.style;
				s.left = x + 16 + "px";
				s.top = y + 16 + "px";
				infoBox.textContent = text;
			}
		
			function on(){
				document.documentElement.classList.add("linky");
			}
			
			function off(){
				document.documentElement.classList.remove("linky");
			}
			
			return {
				on: on,
				off: off,
				updateSelectBox: updateSelectBox,
				updateInfoBox: updateInfoBox
			};
		}();

		function getOffset(node){
			var rect = node.getBoundingClientRect();

			return {
				x: window.pageXOffset + rect.left,
				y: window.pageYOffset + rect.top,
				width: rect.width,
				height: rect.height
			};
		}

		function updateSelectBox(){
			ui.updateSelectBox(
				Math.min(Math.min(x, ox)),
				Math.min(y, oy),
				Math.abs(x - ox),
				Math.abs(y - oy)
			);
		}

		function inSelect(node){
			var pos = getOffset(node);
			var centerx = pos.x + pos.width / 2;
			var centery = pos.y + pos.height / 2;

			if (centerx < Math.min(ox, x)) {
				return false;
			}
			if (centerx > Math.max(ox, x)) {
				return false;
			}
			if (centery < Math.min(oy, y)) {
				return false;
			}
			if (centery > Math.max(oy, y)) {
				return false;
			}
			return true;
		}
		
		function isJSURL(node){
			return node.href.lastIndexOf("javascript:", 0) != -1;
		}

		function updateLinkList(){
			var l = document.querySelectorAll("a[href]"), i, k = [], len = l.length;
			for (i = 0; i < len; i++) {
				k.push(inSelect(l[i]) && !isJSURL(l[i]));
			}
			linkCount = 0;
			for (i = 0; i < len; i++) {
				l[i].classList.toggle("linky-anchor-box", k[i]);
				linkCount += +k[i];
			}
		}
		
		function updateInfoBox() {
			ui.updateInfoBox(x, y, "selected " + linkCount + " link(s)");
		}

		function update(){
			updateSelectBox();
			delay(updateLinkList);
			updateInfoBox();
		}

		function takeLinks(){
			var l = document.querySelectorAll("a[href]"), i, links = [];
			for (i = 0; i < l.length; i++) {
				if (inSelect(l[i]) && !isJSURL(l[i])) {
					links.push(l[i].href);
				}
			}
			return links;
		}

		function handler(e){
			if (e.type == "mousedown") {
				if (traceStart) {
					return;
				}
				if (!o.config.key.regular(e)) {
					return;
				}
				traceStart = true;
				
				on();
				// call it directly will cause firefox to stop srcolling. why?
				setTimeout(ui.on);
				
				x = ox = e.pageX;
				y = oy = e.pageY;
				
				update();
				
			} else if (e.type == "mousemove") {
				if (!traceStart) {
					return;
				}
				
				x = e.pageX;
				y = e.pageY;
				
				update();
				
			} else if (e.type == "mouseup" || e.type == "keydown") {
				if (
					!traceStart ||
					e.type == "keydown" && !o.config.key.copy(e) && !o.config.key.cancel(e)
				) {
					return;
				}
				traceStart = false;
				
				off();
				ui.off();
				o.callback(e, takeLinks());	
			}
		}
		
		function on(){
			if (enable) {
				return;
			}
			window.addEventListener("mousemove", handler);
			window.addEventListener("mouseup", handler);
			window.addEventListener("keydown", handler);
			enable = true;
		}
		
		function off(){
			window.removeEventListener("mousemove", handler);
			window.removeEventListener("mouseup", handler);
			window.removeEventListener("keydown", handler);
			enable = false;
		}
		
		function track() {
			window.addEventListener("mousedown", handler);
			handler(o.initEvent);
		}
		
		return {
			on: on,
			off: off,
			track: track
		};
	}(o);
	
	tracker.track();
}

function openLinks(links) {
	var i;
	for (i = 0; i < links.length; i++) {
		GM_openInTab(links[i], true);
	}
}

// do object property check
function objectProperties(a, b) {
	var key;
	for (key in b) {
		if (a[key] !== b[key]) return false;
	}
	return true;
}

function createConfig() {
	var config = {key: {
		regular: function(e) {
			return objectProperties(e, config.keyRegular);
		},
		copy: function(e) {
			return objectProperties(e, config.keyCopy);
		},
		cancel: function(e) {
			return objectProperties(e, config.keyCancel);
		}
	}};
	GM_config.setup({
		behavior: {
			label: "Default action after selecting",
			type: "select",
			default: "open",
			options: {
				open: "Open links in new tab",
				copy: "Copy URLs"
			}
		},
		keyRegular: {
			label: "Event to start selection",
			type: "textarea",
			default: JSON.stringify({altKey: true, ctrlKey: false, shiftKey: false, button: 0})
		},
		keyCopy: {
			label: "Event to copy url",
			type: "textarea",
			default: JSON.stringify({code: "KeyC"})
		},
		keyCancel: {
			label: "Event to cancel selection",
			type: "textarea",
			default: JSON.stringify({code: "Escape"})
		}
	}, function() {
		var o = GM_config.get();
		Object.assign(config, o);
		for (var key in o) {
			if (!key.startsWith("key")) {
				continue;
			}
			try {
				config[key] = JSON.parse(o[key]);
			} catch (err) {
				alert("Failed to create key config! Is your config broken?");
			}
		}
	});
	return config;
}

function copyLinks(links) {
	if (!links.length) return;
	GM_setClipboard(links.join("\n"));
}

var config = createConfig();

function handler(e, links) {
	if (e.type == "mouseup" && config.behavior == "open") {
		openLinks(links);
	} else if (e.type == "mouseup" || config.key.copy(e)) {
		copyLinks(links);
	}
}

window.addEventListener("mousedown", function init(e){
	if (config.key.regular(e)) {
		window.removeEventListener("mousedown", init);
		createLinky({
			callback: handler,
			initEvent: e,
			config: config
		});
	}
});
