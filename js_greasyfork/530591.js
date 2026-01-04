// ==UserScript==
// @name        SimulateClick
// @namespace   http://fulicat.com
// @author      Jack.Chan (971546@qq.com)
// @version     1.0.2
// @run-at      document-start
// @match       *://*/*
// @match       file:///*
// @url         https://greasyfork.org/zh-CN/scripts/530591-simulateclick
// @grant       none
// @description 2025/3/23 14:17:37
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530591/SimulateClick.user.js
// @updateURL https://update.greasyfork.org/scripts/530591/SimulateClick.meta.js
// ==/UserScript==
 
 
;(function(T) {
	T.__proto__.simulateClick = T.__proto__.simulateClick || simulateClick;

	function simulateClick(target, options) {

		if (typeof options == 'string') {
			// console.log('options-string:', options);
			if (options.indexOf(',') > 1) {
				options = options.split('|');
				options = options.map((point) => {
					point = point.trim().split(',');
					return {
						clientX: Number((point[0] || 0).toString().trim()),
						clientY: Number((point[1] || 0).toString().trim())
					}
				});
			} else {
				options = undefined;
			}
			// console.log('options-string-2-array:', options);
		}
		if (Array.isArray(options)) {
			options.forEach((item) => {
				if (item.clientX !== undefined && item.clientY !== undefined) {
					((point) => {
						console.log('point:', point);
						simulatedClick.apply(simulatedClick, [target, point]);
					})(item);
				}
			});
			return false;
		}

		var event = target.ownerDocument.createEvent('MouseEvents'),
		options = options || {},
		opts = { // These are the default values, set up for un-modified left clicks
			type: 'click',
			canBubble: true,
			cancelable: true,
			view: target.ownerDocument.defaultView,
			detail: 1,
			screenX: 0, //The coordinates within the entire page
			screenY: 0,
			clientX: 0, //The coordinates within the viewport
			clientY: 0,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
			button: 0, //0 = left, 1 = middle, 2 = right
			relatedTarget: null,
			related: true
		};

		//Merge the options with the defaults
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				opts[key] = options[key];
			}
		}

		// related element offset
		if (opts.related) {
			var offset = target.getBoundingClientRect();
			if (offset) {
				opts.clientX = offset.left + opts.clientX;
				opts.clientY = offset.top + opts.clientY;
			}
			delete opts.related;
		}

		// console.log('opts.clientX & Y:', opts.clientX, opts.clientY);

		//Pass in the options
		event.initMouseEvent(
				opts.type,
				opts.canBubble,
				opts.cancelable,
				opts.view,
				opts.detail,
				opts.screenX,
				opts.screenY,
				opts.clientX,
				opts.clientY,
				opts.ctrlKey,
				opts.altKey,
				opts.shiftKey,
				opts.metaKey,
				opts.button,
				opts.relatedTarget
		);

		//Fire the event
		target.dispatchEvent(event);
	}

})(window.Function);
