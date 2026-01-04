// ==UserScript==
// @name         Tweetdeck side-scrolling buttons
// @namespace    https://mileshouse.neocities.org/
// @version      1.2
// @description  Tweetdeck buttons for tabbing left/right
// @author       You
// @match        https://tweetdeck.twitter.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tweetdeck.twitter.com
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443034/Tweetdeck%20side-scrolling%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/443034/Tweetdeck%20side-scrolling%20buttons.meta.js
// ==/UserScript==

setTimeout(function() { // 2 second pause before running so tweetdeck can load columns
	'use strict';
	var scrollInterval;
	var distance = 0;
	var targetLoc,targetPixel;
	// targetLoc is the current column index to scroll to, targetPixel is the pixel location of that index
	// currLoc,currPixel same things but where the page is currently scrolled to

	var column = document.querySelector("section.column");
	var container = document.querySelector("#container")
	var width = parseInt(getComputedStyle(column).marginRight)+column.clientWidth; // width of columns;assumes all columns are same
	// * if someone has a custom css with variable column width there will be unexpected behavior

	// buttons html (.stream-item gives it coloration so it can be light/dark)
	var inject = '<div class="lr-scroller stream-item"><div class="scroller-left"><</div><div class="scroller-right">></div></div>';

	// css to use when flipped to top
	var topStyle = `
    .lr-scroller {
        height: 50px;
        width: 100%;
        z-index: 2;
        display: flex;
        left: 0px;
        position: sticky;
    }

    .scroller-left, .scroller-right {
        width: 50%;
        height: 100%;
        font-size: 3em;
        text-align: center;
        user-select: none;
		border-right: black 1px solid;
    }
	`;

	// css to use when flipped to bottom
	var bottomStyle = `
	    .lr-scroller {
        height: 50px;
        width: 100%;
        z-index: 2;
        display: flex;
        left: 0px;
        position: fixed;
		bottom: 0;
		border-top: black 1px solid;
    }

    .scroller-left, .scroller-right {
        width: 50%;
        height: 100%;
        font-size: 3em;
        text-align: center;
        user-select: none;
		border-right: black 1px solid;
    }
	`;
	// insert the css and check the cookie for top/bottom
	var styleSheet = document.createElement("style");
	if (window.localStorage.sidescroll == "bottom") {
		styleSheet.innerText = bottomStyle;

	} else {
		styleSheet.innerText = topStyle;
	}
	document.head.appendChild(styleSheet);

	// insert the buttons html
	container.insertAdjacentHTML("afterbegin", inject);

	// events for clicking the buttons and scrolling on them
	document.querySelector(".scroller-left").addEventListener("click", function(){
		width = parseInt(getComputedStyle(column).marginRight)+column.clientWidth;
		getNextPos(-1);
		startScrolling();
	});
	document.querySelector(".scroller-right").addEventListener("click", function(){
		width = parseInt(getComputedStyle(column).marginRight)+column.clientWidth;
		getNextPos(1);
		startScrolling();
	});
	document.querySelector(".lr-scroller").addEventListener("wheel", function(e){
		if (e.deltaY < 0){ //scrolling up
			width = parseInt(getComputedStyle(column).marginRight)+column.clientWidth;
			getNextPos(-1);
			startScrolling();
		}
		else if (e.deltaY > 0) { //scrolling down
			width = parseInt(getComputedStyle(column).marginRight)+column.clientWidth;
			getNextPos(1);
			startScrolling();
		}
	});

	// updates the target to scroll to
	function getNextPos(x) {
		var currLoc;
		var maxLoc = Math.floor(container.scrollLeftMax/width)+1; // number of scrolling locations plus 1 for the right-most location
		//container.scrollLeft; // current scroll pixel
		currLoc = Math.ceil(container.scrollLeft/width); // index of column currently scrolled to
		if (targetLoc != null) { // if target already exists you need to use that as current location, so if you are clicking the buttons fast it can scroll fast
			currLoc = targetLoc;
		}
		targetLoc = Math.max(currLoc+x, 0); // new target index is left/right 1 index from current location and above 0
		targetLoc = Math.min(targetLoc, maxLoc); // also new target index can't overshoot right
		targetPixel = targetLoc*width; // new target in pixels
		targetPixel = Math.min(targetPixel,container.scrollLeftMax); // if right-most location, make the targ=scrollLeftMax
		// so it doesnt try to overshoot and make a yucky animation
	}

	// yeah we gay keep scrolling
	function startScrolling(){
		if (scrollInterval==null) { // only start new interval if its not already going
			scrollInterval = setInterval(function(){
				var currPixel = container.scrollLeft; // Current Pixel
				distance = targetPixel-currPixel;

				// messy line but it makes it scroll a minimum of 1 pixel unless it's zero
				// if you just do Math.ceil without the 2nd part it will round fractional negative values the wrong way,
				// which will make the interval never reach the terminate condition when it hits -0.
				// the distance/5 part makes it go 20% of the remaining distance per frame,
				// which makes it have a fast->slow smooth animation curve
				container.scrollBy(Math.ceil(Math.abs(distance)/5)*(distance/Math.abs(distance)), 0);

				if (currPixel==targetPixel) { // if reached target, end interval and unset targets
					clearInterval(scrollInterval);
					scrollInterval = null;
					targetLoc = null;
					targetPixel = null;
				}
			}, 1000/60); // interval for 60 fps (1 second divided by 60)
		}
	}

	// this puts the "Flip button" toggle option in the Tamper/Greasemonkey menu
	GM_registerMenuCommand("Flip buttons to top/bottom", function(){
		if (window.localStorage.sidescroll == "bottom") { // flip to top
			window.localStorage.sidescroll = "top"
			styleSheet.innerText = topStyle;

		} else { // flip to bottom
			window.localStorage.sidescroll = "bottom"
			styleSheet.innerText = bottomStyle;
		}
	});

}, 2000);