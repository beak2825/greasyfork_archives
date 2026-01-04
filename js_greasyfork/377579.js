// ==UserScript==
// @name           enable right click 
// @description    activate mouse right click in webpage
// @match http://*/*
// @match https://*/*
// @version 0.0.1.20220331020534
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/377579/enable%20right%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/377579/enable%20right%20click.meta.js
// ==/UserScript==

(function () {
	if (window.subvaAllowRightClick === undefined) {
		// https://greasyfork.org/en/scripts/23772-absolute-enable-right-click-copy/code
		window.subvaAllowRightClick = function (dom) {
			(function GetSelection() {
				var Style = dom.createElement('style');
				Style.type = 'text/css';
				var TextNode = '*{pointer-events:auto !important;user-select:auto !important;-webkit-user-select:auto !important;}';
				if (Style.styleSheet) {
					Style.styleSheet.cssText = TextNode;
				}
				else {
					Style.appendChild(dom.createTextNode(TextNode));
				}
				dom.getElementsByTagName('head')[0].appendChild(Style);
			})();

			(function SetEvents() {
				var events = ['copy', 'cut', 'paste', 'select', 'selectstart'];
				for (var i = 0; i < events.length; i++)
					dom.addEventListener(events[i], function (e) {
						e.stopPropagation();
					}, true);
			})();

			(function RestoreEvents() {
				var n = null;
				var d = document;
				var b = dom.body;
				var SetEvents = [d.oncontextmenu = n, d.onselectstart = n, d.ondragstart = n, d.onmousedown = n];
				var GetEvents = [b.oncontextmenu = n, b.onselectstart = n, b.ondragstart = n, b.onmousedown = n, b.oncut = n, b.oncopy = n, b.onpaste = n];
			})();

			(function RightClickButton() {
				setTimeout(function () {
					dom.oncontextmenu = null;
				}, 2000);
				function EventsCall(callback) {
					this.events = ['DOMAttrModified', 'DOMNodeInserted', 'DOMNodeRemoved', 'DOMCharacterDataModified', 'DOMSubtreeModified'];
					this.bind();
				}

				EventsCall.prototype.bind = function () {
					this.events.forEach(function (event) {
						dom.addEventListener(event, this, true);
					}.bind(this));
				};
				EventsCall.prototype.handleEvent = function () {
					this.isCalled = true;
				};
				EventsCall.prototype.unbind = function () {
					this.events.forEach(function (event) {
					}.bind(this));
				};
				function EventHandler(event) {
					this.event = event;
					this.contextmenuEvent = this.createEvent(this.event.type);
				}

				EventHandler.prototype.createEvent = function (type) {
					var target = this.event.target;
					var event = target.ownerDocument.createEvent('MouseEvents');
					event.initMouseEvent(type, this.event.bubbles, this.event.cancelable,
						target.ownerDocument.defaultView, this.event.detail,
						this.event.screenX, this.event.screenY, this.event.clientX, this.event.clientY,
						this.event.ctrlKey, this.event.altKey, this.event.shiftKey, this.event.metaKey,
						this.event.button, this.event.relatedTarget);
					return event;
				};
				EventHandler.prototype.fire = function () {
					var target = this.event.target;
					var contextmenuHandler = function (event) {
						event.preventDefault();
					}.bind(this);
					target.dispatchEvent(this.contextmenuEvent);
					this.isCanceled = this.contextmenuEvent.defaultPrevented;
				};
				window.addEventListener('contextmenu', handleEvent, true);
				function handleEvent(event) {
					event.stopPropagation();
					event.stopImmediatePropagation();
					var handler = new EventHandler(event);
					window.removeEventListener(event.type, handleEvent, true);
					var EventsCallBback = new EventsCall(function () {
					});
					handler.fire();
					window.addEventListener(event.type, handleEvent, true);
					if (handler.isCanceled && (EventsCallBback.isCalled))
						event.preventDefault();
				}
			})();

			// function KeyPress(e) {
			// 	if (e.altKey && e.ctrlKey) {
			// 		if (confirm("Activate Absolute Right Click Mode!") === true) {
			// 			Absolute_Mod();
			// 		}
			// 	}
			// }
			// dom.addEventListener("keydown", KeyPress);

			(function Absolute_Mod() {
				var events = ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'];
				for (var i = 0; i < events.length; i++) {
					dom.addEventListener(events[i], function (e) {
						e.stopPropagation();
					}, true);
				}
			})();
		};

//		window.subvaAllowRightClick(document);

		runAll = function(w) {
			try {
				window.subvaAllowRightClick(w.document);
			} catch (e) {
			}
			for (var i = 0; i < w.frames.length; i++) {
				runAll(w.frames[i]);
			}
		};
	}
	runAll(window);
})();