// ==UserScript==
// @name        Page Dimmer
// @description Dims any webpages to ease your eyes when reading at night. CTRL + ALT + 0 to de/activate
// @version     7
// @author      condoriano
// @namespace   condoriano_pagedimmer
// @include     *
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/15007/Page%20Dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/15007/Page%20Dimmer.meta.js
// ==/UserScript==

(function() {
	if(window.top != window.self) return;
	var dim = document.createElement("div");
	dim.setAttribute("id", "pageDimmer");
	dim.style = "display: block; opacity: 0.8; background: #000; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; z-index: 10000; pointer-events: none;";
	document.body.appendChild(dim);

	var initialZIndex = dim.style.zIndex;
	var maxZIndex = initialZIndex;
	if(document.getElementsByTagName('video').length) {
		var elem = document.getElementsByTagName('video')[0];
		while(elem = elem.parentElement) {
			var style = window.getComputedStyle(elem);
			var zidx = style.getPropertyValue('z-index');
			if(parseInt(zidx)) maxZIndex = parseInt(zidx);
		}
		if(maxZIndex == initialZIndex) document.getElementsByTagName('video')[0].style.zIndex = initialZIndex;
	}

	if(GM_getValue('pageDimmer_display') !== undefined) {
		var disp = GM_getValue('pageDimmer_display');
		if(disp == '0') dim.style.display = 'none';
		else {
			dim.style.display = 'block';
			if(disp == '2') dim.style.zIndex = maxZIndex - 1;
		}
	}
	if(GM_getValue('pageDimmer_opacity')) dim.style.opacity = GM_getValue('pageDimmer_opacity');

	function toggleDim() {
		var disp = parseInt(GM_getValue('pageDimmer_display'));
		if(isNaN(disp)) disp = 0;
		disp++
		if(disp % 3 == 0) dim.style.display = 'none';
		else {
			dim.style.display = 'block'
			if(disp % 3 == 2) dim.style.zIndex = maxZIndex - 1;
			else dim.style.zIndex = maxZIndex;
		}
		GM_setValue('pageDimmer_display', disp % 3);
	}
	function adjustDim(add) {
		if(dim.style.display == 'none') toggleDim();
		var opac = parseFloat(dim.style.opacity);
		opac = add ? opac + 0.1 : opac - 0.1;
		opac = Math.min(Math.max(opac, 0.0), 1.0);
		dim.style.opacity = opac;
		GM_setValue('pageDimmer_opacity', dim.style.opacity);
	}
	document.addEventListener('keydown', function(e) {
		var key = e.keyCode || e.which;
		var kZero, kMinus, kPlus;
		if(/Firefox/.test(navigator.userAgent)) { kZero = key == 48 || key == 96; kMinus = key == 173 || key == 109; kPlus = key == 61 || key == 107; }
		else { kZero = key == 48 || key == 96; kMinus = key == 189 || key == 109; kPlus = key == 187 || key == 107; }
		if(e.ctrlKey && e.altKey) {
			if(kZero) toggleDim(); // key 0
			else if(kMinus) adjustDim(false); // key -
			else if(kPlus) adjustDim(true); // key =
		}
	});
})();
