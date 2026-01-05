// ==UserScript==
// @name             TextReFlower
// @version          0.1.0
// @author           _leBluem_
// @description      click on text to reflow into visible area, Android FF USI 
// @info             it does this for the text and some parents
// @info             if your lucky, you only have to click once!
// @info             if it already fits the click is ignored
// @info             also works under Android with Firefox and USI UserScriptInjector
// @namespace        https://greasyfork.org/de/users/83368-lebluem
// @include          *
// @clean-include    true
// @run-at           document-ready
// @include-jquery   true
// @use-greasemonkey true
// @downloadURL https://update.greasyfork.org/scripts/25553/TextReFlower.user.js
// @updateURL https://update.greasyfork.org/scripts/25553/TextReFlower.meta.js
// ==/UserScript==

// ==info==
// before using this make sure you tried changing the default 
// font size in your browser, on mobiles default is tiny ...
//
// this is simply the userscript version of (with a twist) 
//   https://addons.mozilla.org/en-US/android/addon/android-text-reflow/
//     or (which is enabled by default)
//   https://addons.mozilla.org/de/android/addon/android-text-reflow/ 
// see also:
//   https://addons.mozilla.org/en-US/android/addon/fit-text-to-width/?src=ss
// ==/info==

(function () {
	// inject into dom
  document.addEventListener("click", function(evt){
		//alert("klick!");
		fnAddReflow(window,evt);
	});

	// how many parent objects of the clicked one will be reflown...
	// three (default) levels seems to be enough for a whole article
	var parentLevel = 3;
	// le/ri margin in pixels
	var sideMargin = 15;

	// The main routine, click event.
	// Clicking any text will resize that text width to fit.
	// If it already fits nothing happens
	function fnAddReflow(cWin,e) {
		//cWin is chromeWindow, .content gets html window
		var win = cWin.content;

		// get device width in css pixels
		var winWidth=win.content.innerWidth;

		// get nearest non-inline parent.
		var target = e.target;
		for(var i=e.target; i!==null; i = i.parentElement) {
			var icss = win.getComputedStyle(i);
			target = i;
			if(icss.display!='inline') break;
			//if(icss.['display']!='inline') break;
		}

		// get width/left values for target tag
		var bbox = target.getBoundingClientRect();

		// if box is wider than screen, reset width to make it fit
		if(bbox.width>winWidth) {
			var newWidth = winWidth - (2*sideMargin);
			// do for selected text and some parents
			for (var j=0; j<parentLevel; j++) {
				target.parentNode.style.width = newWidth + "px";
				target=target.parparentNode;
			}
			// do for whole document
			win.document.style.width = newWidth + "px";
			//win.document.documentElement.scrollLeft += bbox.left - sideMargin;
		} else {
			// do for selected text and some parents
			for (var k=0; k<parentLevel; k++) {
				target.parentNode.style.width = "";
				target=target.parparentNode;
			}
			win.document.style.width = "";
		}
	}
})();
