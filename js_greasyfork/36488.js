// ==UserScript==
// @name 4chan Block Fix
// @namespace b4k
// @version 1.0.0
// @match *://boards.4chan.org/*
// @match *://sys.4chan.org/*
// @run-at document-start
// @grant unsafeWindow
// @description:en 4chanfix
// @description 4chanfix
// @downloadURL https://update.greasyfork.org/scripts/36488/4chan%20Block%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/36488/4chan%20Block%20Fix.meta.js
// ==/UserScript==

(function () {
	var window;
	var process;
	var interval;
	var domloaded;
	
	document.documentElement
		.classList.add("js-enabled");
	
	window =
		unsafeWindow;
	
	process = function () {
		var scripts;
		var domevent;
		
		scripts =
			document.querySelectorAll("script");
		
		scripts.forEach(
			function (script) {
				if (!script.src && script.innerHTML) {
					if (script.dataset.ran === undefined) {
						script.dataset.ran = "";
						
						if (script.innerHTML.match(/(style_gr|fourcat|recaptc|pass_ena)/)) {
							window.eval(script.innerHTML);
						}
					}
				}
			}
		);
		
		if (domloaded) {
			if (window.initStyleSheet) {
				if (!window.activeStyleSheet) {
					window.initStyleSheet();
				}
			}
			
			if (window.Main) {
				if (window.Main.now && !window.Main.type) {
					window.Main.init();
				}
			}
			
			domevent = document.createEvent("Event");
			domevent.initEvent("DOMContentLoaded", true, true);
			document.dispatchEvent(domevent);
		}
	};
	
	domloaded = false;
	
	process();
	
	interval =
		setInterval(
			function () {
				process();
				
				if (domloaded) {
					clearInterval(interval);
				}
			},
			
			( 3 )
		);
	
	document.addEventListener(
		"DOMContentLoaded",
		
		function (event) {
			domloaded = true;
		}
	);
})();