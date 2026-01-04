// ==UserScript==
// @name         Highlight area
// @namespace    https://greasyfork.org
// @version      0.1
// @description  Drag to select a area to highlight, switch included.
// @author       pot-code
// @include      http://tb.gssok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369541/Highlight%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/369541/Highlight%20area.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function get_symbol_tag(obj) {
		return Object.prototype.toString.call(obj);
	}

	function set_visible() {
		for (let e of Array.from(arguments)) {
			e.style.visibility = 'visible';
		}
	}

	function set_hidden() {
		for (let e of Array.from(arguments)) {
			e.style.visibility = 'hidden';
		}
	}

	function RenderElement(element) {
		// if (!element) throw new Error('argument couldn\'t be null or undefined');
		if (!(this instanceof RenderElement)) return new RenderElement(element);
		this.element = element;
		this.init = function () { };
		this.render = function () { };
		this.post = function () { }
	}

	var _ = (function () {
		var FUNC_ERROR_TEXT = 'Expected a function';
		var NAN = 0 / 0;
		var symbolTag = '[object Symbol]';
		var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
		var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
		var root = freeGlobal || freeSelf || Function('return this')();
		var objectProto = Object.prototype;
		var objectToString = objectProto.toString;
		var nativeMax = Math.max,
			nativeMin = Math.min;
		var now = function () {
			return root.Date.now();
		};
		function debounce(func, wait, options) {
			var lastArgs,
				lastThis,
				maxWait,
				result,
				timerId,
				lastCallTime,
				lastInvokeTime = 0,
				leading = false,
				maxing = false,
				trailing = true;

			if (typeof func != 'function') {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			if (isObject(options)) {
				leading = !!options.leading;
				maxing = 'maxWait' in options;
				maxWait = maxing ? nativeMax(options.maxWait || 0, wait) : maxWait;
				trailing = 'trailing' in options ? !!options.trailing : trailing;
			}

			function invokeFunc(time) {
				var args = lastArgs,
					thisArg = lastThis;

				lastArgs = lastThis = undefined;
				lastInvokeTime = time;
				result = func.apply(thisArg, args);
				return result;
			}

			function leadingEdge(time) {
				// Reset any `maxWait` timer.
				lastInvokeTime = time;
				// Start the timer for the trailing edge.
				timerId = setTimeout(timerExpired, wait);
				// Invoke the leading edge.
				return leading ? invokeFunc(time) : result;
			}

			function remainingWait(time) {
				var timeSinceLastCall = time - lastCallTime,
					timeSinceLastInvoke = time - lastInvokeTime,
					result = wait - timeSinceLastCall;

				return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
			}

			function shouldInvoke(time) {
				var timeSinceLastCall = time - lastCallTime,
					timeSinceLastInvoke = time - lastInvokeTime;

				// Either this is the first call, activity has stopped and we're at the
				// trailing edge, the system time has gone backwards and we're treating
				// it as the trailing edge, or we've hit the `maxWait` limit.
				return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
					(timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
			}

			function timerExpired() {
				var time = now();
				if (shouldInvoke(time)) {
					return trailingEdge(time);
				}
				// Restart the timer.
				timerId = setTimeout(timerExpired, remainingWait(time));
			}

			function trailingEdge(time) {
				timerId = undefined;

				// Only invoke if we have `lastArgs` which means `func` has been
				// debounced at least once.
				if (trailing && lastArgs) {
					return invokeFunc(time);
				}
				lastArgs = lastThis = undefined;
				return result;
			}

			function cancel() {
				if (timerId !== undefined) {
					clearTimeout(timerId);
				}
				lastInvokeTime = 0;
				lastArgs = lastCallTime = lastThis = timerId = undefined;
			}

			function flush() {
				return timerId === undefined ? result : trailingEdge(now());
			}

			function debounced() {
				var time = now(),
					isInvoking = shouldInvoke(time);

				lastArgs = arguments;
				lastThis = this;
				lastCallTime = time;

				if (isInvoking) {
					if (timerId === undefined) {
						return leadingEdge(lastCallTime);
					}
					if (maxing) {
						// Handle invocations in a tight loop.
						timerId = setTimeout(timerExpired, wait);
						return invokeFunc(lastCallTime);
					}
				}
				if (timerId === undefined) {
					timerId = setTimeout(timerExpired, wait);
				}
				return result;
			}
			debounced.cancel = cancel;
			debounced.flush = flush;
			return debounced;
		}

		function throttle(func, wait, options) {
			var leading = true,
				trailing = true;

			if (typeof func != 'function') {
				throw new TypeError(FUNC_ERROR_TEXT);
			}
			if (isObject(options)) {
				leading = 'leading' in options ? !!options.leading : leading;
				trailing = 'trailing' in options ? !!options.trailing : trailing;
			}
			return debounce(func, wait, {
				'leading': leading,
				'maxWait': wait,
				'trailing': trailing
			});
		}
		function isObject(value) {
			var type = typeof value;
			return !!value && (type == 'object' || type == 'function');
		}

		function isObjectLike(value) {
			return !!value && typeof value == 'object';
		}
		function isSymbol(value) {
			return typeof value == 'symbol' ||
				(isObjectLike(value) && objectToString.call(value) == symbolTag);
		}

		return {
			throttle: throttle
		};
	}());

	var RenderHandler = (function(){
		var state = {
			active: false,
			x0: 0,
			y0: 0,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			clientWidth: 0,
			clientHeight: 0
			// x1: 0,
			// y1: 0,
		};
		var handler = {
			// preset
			mousedown: [],
			mousemove: [],
			mouseup: []
		}; //<type>:<handler array>
		var host = document.body; // Host element to render component
		var interval = 40; // throttle value

		var pre_render_handler_wrapper = function (event) {
			// console.log(event.clientX, event.clientY, state);
			for (let f of get_pre_handlers()) {
				f.call(null, event, state);
			}
		};
		var post_render_handler_wrapper = function (event) {
			// console.log(event.clientX, event.clientY, state);
			for (let f of get_post_handlers()) {
				f.call(null, event, state);
			}
		};
		var continuous_render_handler_wrapper = _.throttle(function (event) {
			if (!state.active) return;
			// console.log(event.clientX, event.clientY, state);
			for (let f of get_render_handlers()) {
				f.call(null, event, state);
			}
		}, interval);

		function get_pre_handlers() {
			return handler['mousedown'];
		}

		function get_render_handlers() {
			return handler['mousemove'];
		}

		function get_post_handlers() {
			return handler['mouseup'];
		}

		function attach_listener() {
			host.addEventListener("mousedown", pre_render_handler_wrapper);
			host.addEventListener("mousemove", continuous_render_handler_wrapper);
			host.addEventListener("mouseup", post_render_handler_wrapper);
		}

		function detach_listener() {
			host.removeEventListener("mousedown", pre_render_handler_wrapper);
			host.removeEventListener("mousemove", continuous_render_handler_wrapper);
			host.removeEventListener("mouseup", post_render_handler_wrapper);
		}

		//TODO: browser compatibility
		function disable_selection(){
			document.body.style.webkitUserSelect = 'none';
		}

		//TODO: browser compatibility
		function enable_selection(){
			document.body.style.webkitUserSelect = 'text';
		}

		return {
				// before render
			register_pre_render_handler: function (func) {
				handler["mousedown"].push(func);
			},
			// how to render
			register_continuous_render_handler: function (func) {
				handler["mousemove"].push(func);
			},
			// after render
			register_post_render_handler: function (func) {
				handler["mouseup"].push(func);
			},
			set_interval: function (i) {
				i = +i; // conform to number
				if (isNaN(i)) {
					throw new TypeError(
						`Expected number type but received: ${get_symbol_tag(i)}`
					);
				}
				if (i === 0) {
					throw new RangeError("Expected argument to be larger than 0");
				}
				interval = i;
			},
			install: function () {
				attach_listener();
				disable_selection();
			},
			uninstall: function () {
				detach_listener();
				enable_selection();
			},
		};
	}());

	var RenderManager = (function () {
		var renderElements = [];// keep RenderElement for rendering
		var initialized = false;

		// inner handler
		function caculate_box(event, state) {
			var x0 = state.x0,
				y0 = state.y0,
				clientWidth = state.clientWidth,
				clientHeight = state.clientHeight,
				x1 = event.clientX,
				y1 = event.clientY;

			if (x0 > x1) {
				state.left = x1;
				state.right = clientWidth - x0;
			} else {
				state.left = x0;
				state.right = clientWidth - x1;
			}

			if (y1 > y0) {
				state.top = y0;
				state.bottom = clientHeight - y1;
			} else {
				state.top = y1;
				state.bottom = clientHeight - y0;
			}
		}

		function update_client_data(event, state) {
			state.clientWidth = document.documentElement.clientWidth;
			state.clientHeight = document.documentElement.clientHeight;
		}

		function set_origin(event, state) {
			state.x0 = event.clientX;
			state.y0 = event.clientY;
		}

		function set_active(event, state) {
			state.active = true;
		}

		function set_deactive(event, state) {
			state.active = false;
		}

		function init() {
			RenderHandler.register_pre_render_handler(update_client_data);
			RenderHandler.register_pre_render_handler(set_origin);
			RenderHandler.register_pre_render_handler(set_active);
			RenderHandler.register_continuous_render_handler(caculate_box);
			RenderHandler.register_post_render_handler(set_deactive);
			for (let re of renderElements) {
				RenderHandler.register_pre_render_handler(re.init);
				RenderHandler.register_continuous_render_handler(re.render);
				RenderHandler.register_post_render_handler(re.post);
			}

			initialized = true;
		}

		return {
			add_render_element: function (renderElement) {
				renderElements.push(renderElement);
			},
			set_interval: function (i) {
				RenderHandler.set_interval(i);
			},
			install: function () {
				if (!initialized) init();
				RenderHandler.install();
			},
			uninstall: function () {
				RenderHandler.uninstall();
			}
		};
	})();

	// config
	var UIColor = '#4bbb8b';
	var maskColor = 'rgba(83, 82, 56, 0.9)';

	var componentFragment = document.createDocumentFragment();
	var horiLine = document.createElement('div');
	var vertLine = document.createElement('div');

	var maskLeft = document.createElement('div');
	var maskRight = document.createElement('div');
	var maskTop = document.createElement('div');
	var maskBottom = document.createElement('div');

	var sizeIndicator = document.createElement('span');
	var indicatorSpan = document.createElement('span');

	var componentMenu = document.createElement('div');
	var onButton = document.createElement('button');
	var buttonSeparator = document.createElement('span');
	var offButton = document.createElement('button');

	horiLine.style.cssText = `position:fixed;top:0;background-color:${UIColor};visibility:hidden;width:100%;height:1px;z-index:999;`;
	vertLine.style.cssText = `position:fixed;top:0;background-color:${UIColor};visibility:hidden;height:100%;width:1px;z-index:999;`;

	maskLeft.style.cssText = `position:fixed;background-color:${maskColor};height:100%;top:0;left:0;z-index:999;`;
	maskRight.style.cssText = `position:fixed;background-color:${maskColor};height:100%;top:0;right:0;z-index:999;`;
	maskTop.style.cssText = `position:fixed;background-color:${maskColor};top:0;z-index:999;`;
	maskBottom.style.cssText = `position:fixed;background-color:${maskColor};bottom:0;z-index:999;`;

	sizeIndicator.style.cssText = `display:inline-block;color:${UIColor};position:fixed;padding:10px;visibility:hidden;z-index:999;`;

	componentMenu.style.cssText = 'position:fixed;top:0;left:0;padding:1em;opacity:0.5;color:rgb(94,96,128);user-select:none;-webkit-user-select:none;z-index:999;transition: 0.2s ease opacity';
	offButton.style.cssText = onButton.style.cssText = `padding:0.2em 0.4em;display:inline-block;border-radius:0.3em;background-color:white;border:1px solid ${UIColor};cursor: pointer;transition: 0.2s ease background-color, 0.2s ease color;`;

	indicatorSpan.innerText = 'W:0, H:0';
	buttonSeparator.innerText = '/';
	onButton.innerText = 'ON';
	offButton.innerText = 'OFF';

	componentMenu.addEventListener('mouseover', function () {
		this.style.opacity = 1;
	});
	componentMenu.addEventListener('mouseout', function () {
		this.style.opacity = 0.5;
	});
	onButton.addEventListener('click', function () {
		RenderManager.install();
	}, false);
	onButton.addEventListener('mousedown', function () {
		this.style.backgroundColor = UIColor;
		this.style.color = 'white';
	}, false);
	onButton.addEventListener('mouseup', function () {
		this.style.backgroundColor = 'white';
		this.style.color = 'inherit';
	}, false);
	offButton.addEventListener('click', function (e) {
		RenderManager.uninstall();
	}, false);
	offButton.addEventListener('mousedown', function (e) {
		this.style.backgroundColor = UIColor;
		this.style.color = 'white';
	}, false);
	offButton.addEventListener('mouseup', function () {
		this.style.backgroundColor = 'white';
		this.style.color = 'inherit';
	}, false);

	sizeIndicator.appendChild(indicatorSpan);
	componentMenu.appendChild(onButton);
	componentMenu.appendChild(buttonSeparator);
	componentMenu.appendChild(offButton);

	componentFragment.appendChild(maskLeft);
	componentFragment.appendChild(maskRight);
	componentFragment.appendChild(maskTop);
	componentFragment.appendChild(maskBottom);
	componentFragment.appendChild(horiLine);
	componentFragment.appendChild(vertLine);
	componentFragment.appendChild(sizeIndicator);
	componentFragment.appendChild(componentMenu);

	var crossRender = new RenderElement();
	crossRender.init = function () {
		set_visible(horiLine, vertLine);
		horiLine.style.top = event.clientY + "px";
		vertLine.style.left = event.clientX + "px";
	}
	crossRender.render = function (event) {
		horiLine.style.top = event.clientY + "px";
		vertLine.style.left = event.clientX + "px";
	};
	crossRender.post = function () {
		set_hidden(horiLine, vertLine);
	}

	var sizeRender = new RenderElement();
	sizeRender.init = function () {
		set_visible(sizeIndicator);
		sizeIndicator.style.top = event.clientY + "px";
		sizeIndicator.style.left = event.clientX + "px";
	}
	sizeRender.render = function (event, state) {
		sizeIndicator.style.top = event.clientY + "px";
		sizeIndicator.style.left = event.clientX + "px";

		indicatorSpan.innerHTML = `W:${state.clientWidth - state.left - state.right}, H:${state.clientHeight - state.top - state.bottom}`;
	}
	sizeRender.post = function () {
		set_hidden(sizeIndicator);
		indicatorSpan.innerHTML = "W:0, H:0";
	}

	var maskRender = new RenderElement();
	maskRender.init = function (event, state) {
		set_visible(maskLeft, maskRight, maskTop, maskBottom);
	}
	maskRender.render = function (event, state) {
		maskLeft.style.right = state.clientWidth - state.left + "px";
		maskRight.style.left = state.clientWidth - state.right + "px";

		maskTop.style.left = state.left + "px";
		maskTop.style.right = state.right + "px";
		maskTop.style.bottom = state.clientHeight - state.top + "px";

		maskBottom.style.left = state.left + "px";
		maskBottom.style.right = state.right + "px";
		maskBottom.style.top = state.clientHeight - state.bottom + "px";
	};
	maskRender.post = function (event, state) {
		let width = Math.abs(event.clientX - state.x0);
		let height = Math.abs(event.clientY - state.y0);
		if (width < 10 || height < 10) {
			set_hidden(maskLeft, maskRight, maskTop, maskBottom);
		}
	}

	document.body.appendChild(componentFragment);
	RenderManager.add_render_element(crossRender);
	RenderManager.add_render_element(sizeRender);
	RenderManager.add_render_element(maskRender);
})();