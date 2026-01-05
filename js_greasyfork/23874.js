// ==UserScript==//
// @name           Prevent off-screen HTML5 autoplay
// @description    Disable autoplay for HTML5 media elements displayed outside the visible portion of the page
// @version        1.0
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
// @match          *://*/*
// @run-at         document-start
// @grant          GM_info
// @downloadURL https://update.greasyfork.org/scripts/23874/Prevent%20off-screen%20HTML5%20autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/23874/Prevent%20off-screen%20HTML5%20autoplay.meta.js
// ==/UserScript==

var checkQueue = [];
var callee;

window.addEventListener('message', function(e) {
	// some stupid sites choke on object data
	if (!/^\{/.test(e.data))
		return;
	var data = tryParse(e.data);
	if (!data || data.name != GM_info.script.name)
		return;
	switch (data.action) {
		case 'querypos':
			var iframes = document.getElementsByTagName('iframe');
			for (var i = 0, f; (f = iframes[i++]); ) {
				if (f.contentWindow == e.source) {
					if (window == parent) {
						var b = f.getBoundingClientRect();
						data.bounds = {l:b.left, t:b.top, r:b.right, b:b.bottom};
						data.window = {w:innerWidth, h:innerHeight};
						data.action = 'gotpos';
						e.source.postMessage(JSON.stringify(data), '*');
					} else {
						callee = f;
						parent.postMessage(e.data, '*');
					}
					return;
				}
			}
			break;
		case 'gotpos':
			if (!callee)
				return autoplaySentryCheck(data);
			if (!callee.parentNode) {
				callee = null;
				return;
			}
			var bounds = callee.getBoundingClientRect();
			data.bounds.l += bounds.left;
			data.bounds.t += bounds.top;
			data.bounds.r = Math.min(data.window.w, bounds.left + data.bounds.r);
			data.bounds.b = Math.min(data.window.h, bounds.top + data.bounds.b);
			callee.contentWindow.postMessage(JSON.stringify(data), '*');
			callee = null;
			break;
	}
});

document.addEventListener('play', autoplaySentry, true);

function autoplaySentry(e) {
	checkQueue.push(e.target);
	if (window.parent == window) {
		autoplaySentryCheck({
			bounds: {l:0, t:0, r:innerWidth, b:innerHeight},
			window: {w:innerWidth, h:innerHeight}
		});
	} else {
		parent.postMessage(JSON.stringify({name: GM_info.script.name, action: 'querypos'}), '*');
	}
}

function autoplaySentryCheck(data) {
	while (checkQueue.length) {
		var el = checkQueue.pop();
		for (var elWithBounds = el, bounds;
			 elWithBounds &&
			 (bounds = elWithBounds.getBoundingClientRect()) &&
			 !bounds.left && !bounds.right && !bounds.top && !bounds.bottom;
			 elWithBounds = elWithBounds.parentElement) {}
		if (bounds.right < data.bounds.l ||
			bounds.bottom < data.bounds.t ||
			bounds.left > Math.min(data.window.w, data.bounds.r) ||
			bounds.top > Math.min(data.window.h, data.bounds.b))
		{
			console.warn('Preventing off-screen autoplay on %O', el);
			el.autoplay = false;
			el.pause();
		}
	}
}

function tryParse(str) {
	try { return JSON.parse(str); }
	catch(e) {}
}
