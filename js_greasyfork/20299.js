// ==UserScript==
// @name        Smart scrolling
// @namespace   zeusex81@gmail.com
// @description Prevent scrolling issues when page is resized by loading images
// @include     *
// @version     1.4
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/20299/Smart%20scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/20299/Smart%20scrolling.meta.js
// ==/UserScript==

(function() {
	var hash = location.hash.replace("#", "");
	if(hash) {
		var scrollListener = function() {removeEventListener("wheel", scrollListener); hash = "";};
		addEventListener("wheel", scrollListener);
	}
	var images;
	var update = function() {
		var scrollY = 0, ready = document.readyState == "complete", elem;
		if(hash) {
			elem = document.getElementById(hash) || document.getElementsByName(hash)[0];
			if(elem) scrollY = Math.round(elem.getBoundingClientRect().top);
		} else if(document.readyState == "interactive") {
			if(!images) images = [].slice.call(document.getElementsByTagName("IMG"));
			var overflows = ["auto", "scroll"], data, rect, height;
			for(var i = 0; i < images.length; i++) {
				if(!images[i].zssData) images[i].zssData = {};
				data = images[i].zssData;
				if(ready) delete images[i].zssData;
				if(data.complete) continue;
				rect   = images[i].getBoundingClientRect();
				height = Math.max(data.height || 0, Math.round(rect.bottom - rect.top));
				if(isNaN(data.height)) {
					if(images[i].complete || !images[i].offsetParent || getComputedStyle(images[i]).position == "fixed")
						data.complete = true;
					else
						data.height = height;
				} else if(data.height != height) {
					data.complete = true;
					if(rect.top >= 0) continue;
					elem = images[i];
					while(true) {
						elem = elem.parentNode;
						if(elem == document.body) {
							scrollY += height - data.height;
							break;
						} else if(overflows.includes(getComputedStyle(elem).overflow)) {
							elem.scrollTop += height - data.height;
							break;
						}
					}
				}
			}
		}
		if(scrollY !== 0) scrollBy(0, scrollY);
		if(!ready) requestAnimationFrame(update);
	};
	update();
})();