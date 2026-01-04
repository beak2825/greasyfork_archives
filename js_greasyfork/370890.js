// ==UserScript==
// @name           Auto scroll keys
// @namespace      http://userscripts.org/users/44573
// @description    Auto scroll page on Ctrl+Down. Escape to stop.
// @include        *
// @version 0.0.1.20180804163821
// @downloadURL https://update.greasyfork.org/scripts/370890/Auto%20scroll%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/370890/Auto%20scroll%20keys.meta.js
// ==/UserScript==

var initialSpeed = 10;

// var resetThreshold = 1;   // Detects when user scrolls during auto-scroll (occasionally!)
var resetThreshold = 10;   // Allows auto-scroll to work when zoomed in.

// 2012/10/09  Now runs at 60fps or whatever machine can handle
// However, this means PageDown/PageUp now have no effect, because the real value is always used.
// DONE: We could check if getScrollPosition gives us something far from realy, and if so assume the user has moved the page, then re-init realy if we want to continue scrolling.
// Result: PageUp/Down seem to work fine in Konqueror, but poorly in Firefox.  My guess is that Firefox issues a PageUp as a series of small movements, which do not trigger the resetThreshold.

/* BUG: Does not work well when zoomed in Chrome.
 * It does scroll, if you hold down the key long enough.
 * But when the threshold is passed, movement is quite fast.  Perhaps we can
 * overcome this by holding our own analogue (non-integer) scroll position, and
 * setting the page scroll from this.
 * Perhaps this should catch up if the real value differs significantly from
 * the stored value, indicating perhaps that the user jumped the page manually.
 */

/* BUG:
 * I think at times we are moving 1.2pixels each timeout, then accelerating to
 * say 1.4pixels per timeout, but in reality the browser is always doing 1
 * pixel!
 */

var u44573_go = false;
var scrollSpeed = 0;

var DOM_VK_DOWN = 40;
var DOM_VK_UP = 38;
var DOM_VK_ESCAPE = 27;
var DOM_VK_SPACE = 32;
var DOM_VK_ENTER = 13;

window.addEventListener('keydown', u44573_handler, true);

function sgn(x) { return ( x>0 ? 1 : x<0 ? -1 : 0 ); }
function u44573_handler(e) {
	var change = 0.60;   // Probably could be lowered a bit if we make scrollSpeed truly analogue.
	var upDelta, downDelta; // The acceleration of each key
	if (scrollSpeed === 0 || !u44573_go) {
		upDelta = initialSpeed;
		downDelta = initialSpeed;
	} else {
		if (Math.abs(scrollSpeed) < 0.1) {
			scrollSpeed = 0.1 * sgn(scrollSpeed);
		}
		downDelta = Math.abs(scrollSpeed)*change;
		upDelta = Math.abs(scrollSpeed)*change/(1+change);
		if (scrollSpeed < 0) {
			var tmpDelta = downDelta;
			downDelta = upDelta;
			upDelta = tmpDelta;
		}
	}
	// if (Math.random()<0.001) { document.title = ""+upDelta+" : "+downDelta; }
	if((e.altKey || e.ctrlKey) && e.keyCode == DOM_VK_DOWN) { // Scroll downwards with CTRL-Down_Arrow or Opt-Down_Arrow on Mac
		scrollSpeed += downDelta;
		e.preventDefault(); // Most
	}
	if((e.altKey || e.ctrlKey) && e.keyCode == DOM_VK_UP) { // Scroll upwards with CTRL-Up_Arrow or Opt-Up_Arrow on Mac
		scrollSpeed -= upDelta;
		e.preventDefault(); // Most
	}
	if(!u44573_go && scrollSpeed != 0) {
		startScroller();
	}
	if (e.keyCode == DOM_VK_ESCAPE || e.keyCode == DOM_VK_ENTER || e.keyCode == DOM_VK_SPACE) { // Stop (ESCAPE or ENTER or SPACE)
		if (u44573_go) {
			u44573_go = false;
			scrollSpeed = 0;
			// Do not pass keydown event to page:
			e.preventDefault(); // Most
			return false; // IE
		}
	}
}

function sgn(x) {
	return (x>0 ? +1 : x<0 ? -1 : 0);
}

var abs = Math.abs;

var maxPerSecond = 60;

var realx,realy,lastTime;   // real as in float, we store fractional position for smoothness

function startScroller() {
	u44573_go = true;
	var s = u44573_getScrollPosition();
	realx = s[0];
	realy = s[1];
	lastTime = new Date().getTime();
	u44573_goScroll();
}

function u44573_goScroll() {

	if (u44573_go) {

		// Check if the user has scrolled the page with a key since we last scrolled.
		// If so, update our realx,realy.
		// BUG: Argh the check isn't working in Firefox 90% of the time!
		//      Hold down the key to beat those odds.
		var s = u44573_getScrollPosition();
		if ( abs(s[0]-realx) > resetThreshold || abs(s[1]-realy) > resetThreshold ) {
			realx = s[0];
			realy = s[1];
		}

		var timeNow = new Date().getTime();
		var elapsed = timeNow - lastTime;
		var jumpPixels = abs(scrollSpeed) * elapsed/1000;
		var timeToNext = 1000/maxPerSecond;

		// The browser can only jump a whole number of pixels, and it rounds down.
		// We had to do the following anyway for jumpPixels<1 but by doing it for
		// small numbers (<5) we workaround the analogue/digital bug.  (5*1.2=6)
		/*
		if (jumpPixels < 3) {
			timeToNext /= jumpPixels;
			// jumpPixels /= jumpPixels;
			jumpPixels = 1;
		}
		*/
		/*
			var timeToNext = 1000/abs(scrollSpeed);
			if (timeToNext < 1000/maxPerSecond) {
				jumpPixels = abs(scrollSpeed)/maxPerSecond;
				timeToNext = 1000/maxPerSecond;
			} else {
				jumpPixels = 1;
			}
		*/
		// unsafeWindow.scroll(s[0], s[1] + jumpPixels*sgn(scrollSpeed));

		realy += jumpPixels*sgn(scrollSpeed);
		unsafeWindow.scroll(realx, realy); // Leave it to browser to round real values to ints

		lastTime = timeNow;

		if (scrollSpeed == 0) {
			u44573_go = false;
		} else {
			setTimeout(u44573_goScroll, timeToNext);
		}

	}

}

function u44573_getScrollPosition() {
	return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft,(document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop);
}
