// ==UserScript==
// @name         YouTubeEXT
// @icon         https://www.youtube.com/yt/brand/media/image/YouTube-icon-full_color.png
// @namespace    skoshy.com
// @version      0.7.4
// @description  Does cool things with YouTube
// @author       Stefan Koshy
// @match        *://*.youtube.com/*
// @exclude      *://*.youtube.com/embed/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21012/YouTubeEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/21012/YouTubeEXT.meta.js
// ==/UserScript==
var scriptid = 'yt-ext';

var newElements = {}; // this object-array will contain all the new elements created for the page
var timers = {}; // this object-array will contain various timers

var cssTopBarHeightOffset = `0px`;
var css = `
#masthead-container.ytd-app {
transition: .2s ease-in-out;
}
html[`+scriptid+`-theater] #masthead-container.ytd-app {
width: 75%;
margin-left: 12.5%;
opacity: 0;
}

html[`+scriptid+`-theater] #masthead-container.ytd-app:hover {
opacity: 1;
}

html[`+scriptid+`-theater] ytd-watch #player.ytd-watch {
z-index: 0;
height: calc(100vh - `+cssTopBarHeightOffset+`);
max-height: none;
}

html[`+scriptid+`-theater] ytd-watch #player.ytd-watch #player-container {
position: fixed;
top:0;
box-sizing: border-box;
padding-top: `+cssTopBarHeightOffset+`;
}

html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch {
z-index: 1;
position: relative;
background-color: rgba(255,255,255,.55);
opacity: .55;
transition: .2s ease-in-out;
}

html[dark="true"][`+scriptid+`-theater] ytd-watch #top #container.ytd-watch {
background-color: rgba(0,0,0,.55);
}

html[`+scriptid+`-theater] ytd-watch:hover #top #container.ytd-watch {
opacity: 1;
}

html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch #author-thumbnail,
html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch #avatar,
html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch ytd-thumbnail
{ opacity: .55; transition: .2s ease-in-out; }

html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch #author-thumbnail:hover,
html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch #avatar:hover,
html[`+scriptid+`-theater] ytd-watch #top #container.ytd-watch ytd-thumbnail:hover
{ opacity: 1; }

/* Specifically used for small screen theater mode */
html[`+scriptid+`-theater] ytd-watch .ytp-iv-video-content {
width: 100% !important;
}

html[`+scriptid+`-theater] ytd-watch #top,
html[`+scriptid+`-theater] ytd-watch #player {
width: 100%;
}

html[`+scriptid+`-theater] .html5-video-player .video-stream {
padding: 0;
}

html[`+scriptid+`-theater] ytd-watch .ytp-chrome-bottom {
left: 0 !important;
margin: 0 auto;
}

/* GO TO TOP BUTTON */
#` + scriptid + `-goToTop {
	position: fixed;
	bottom: 20px;
	right: 20px;
	background-color: rgba(255,255,255,.8);
	padding: 10px;
	border-radius: 30px;
	box-shadow: #ccc 0px 0px 10px;
	cursor: pointer;
	color: #666;
	z-index: 2;
    transition: .2s ease-in-out;
}
#` + scriptid + `-goToTop:hover {
	color: #222;
	box-shadow: #aaa 0px 0px 10px;
}
html[`+scriptid+`-scroll-at-top] #` + scriptid + `-goToTop {
    display: none !important;
}

/* CUSTOM TOOLTIP */
.` + scriptid + `-tooltip {
	position: fixed;
	bottom: 5px;
	left: 5px;
	background: rgba(255, 255, 255, .8);
	padding: 3px;
	border-radius: 20px;
	z-index: 100;
	display: none;
}
`;

document.addEventListener("keydown", function(e) {
	if (e.altKey === true && e.code == 'KeyO') {
		// toggle style
		if (isScriptEnabled())
			turnOff();
		else
			turnOn();

		resizeCheck();
	}
});

function isScriptEnabled() {
	var cssEl = document.getElementById(scriptid);
	return !cssEl.disabled;
}

function turnOn() {
	var cssEl = document.getElementById(scriptid);
	cssEl.disabled = false;
	for (var key in newElements) {
		newElements[key].style.display = 'block';
	}
}

function turnOff() {
	var cssEl = document.getElementById(scriptid);
	cssEl.disabled = true;
	for (var key in newElements) {
		newElements[key].style.display = 'none';
	}
}

/*
	This function does a variety of checks and tweaks to the page on the resize and URL popstate
*/
function resizeCheck(e) {
	// set theat
}

// passed a target element, will check if it's an input box
function isFocusOnInputBox(target) {
	if (target.getAttribute('role') == 'textbox' || target.tagName == 'INPUT' || target.tagName == 'TEXTAREA')
		return true;
	else
		return false;
}

function pausePlayVideoCheck(event) {
	if (
		event.keyCode === 32 &&
		!isFocusOnInputBox(event.target) &&
		!event.target.classList.contains('html5-video-player') // don't pause/play if we're on the player itself. the player will handle it.
	) {
		var videoId, status;

		event.preventDefault();

		videoId = 'movie_player';
		if (document.getElementById(videoId)) {
			status = document.getElementById(videoId).getPlayerState();
			pausePlayVideo(videoId, status);
		}

		// if we're on a channel page, allow pausing/playing the main video on the channel homepage
		videoId = 'c4-player';
		if (document.getElementById(videoId)) {
			status = document.getElementById(videoId).getPlayerState();
			pausePlayVideo(videoId, status);
		}
	}
}

function pausePlayVideo(elId, status) {
	if (status === 1 || status === 3) {
		contentEval('document.querySelector("#' + elId + '").pauseVideo();');
	} else if (status === -1 || status === 2 || status === 0) {
		contentEval('document.querySelector("#' + elId + '").playVideo();');
	}

	// N/A (-4), unstarted (-1), ended (0), playing (1), paused (2), buffering (3), video cued (5).
	// from https://greasyfork.org/scripts/8687-youtube-space-pause
}

function brightnessChangeCheck(event) {
	if (!isFocusOnInputBox(event.target)) {
		if (event.shiftKey) {
			var video = document.querySelector('video.html5-main-video');

			var brightness = parseFloat(parseFromFilter('brightness', video.style.filter));
			if (!brightness || isNaN(brightness)) { // no brightness has been specified yet
				video.style.filter = 'brightness(1.0)';
				brightness = parseFloat(parseFromFilter('brightness', video.style.filter));
			}

			if (event.keyCode === 33) { // shift+pgup
				var newBrightness = brightness + .1;
				video.style.filter = 'brightness(' + newBrightness + ')';
				showTooltip('Brightness: ' + newBrightness.toFixed(2));
			} else if (event.keyCode === 34) { // shift+pgdn
				var newBrightness = brightness - .1;
				video.style.filter = 'brightness(' + newBrightness + ')';
				showTooltip('Brightness: ' + newBrightness.toFixed(2));
			}
		}
	}
}

// will parse attribute from a filter string
// ex: parseFromFilter('brightness', 'brightness(1.5)') => 1.5
// will return false if it can't parse it
function parseFromFilter(name, string) {
	if (string == undefined)
		return false;

	var startLength = name.length + 1;
	var startPos = string.indexOf(name + '(');

	if (startPos == -1)
		return false;

	var endPos = string.indexOf(')', startLength + startPos);

	if (endPos == -1)
		return false;

	return string.substring(startLength + startPos, startLength + startPos + endPos);
}

function showTooltip(text) {
	newElements.tooltip.innerHTML = text;
	newElements.tooltip.style.display = 'block';

	clearTimeout(timers.tooltip);
	timers.tooltip = setTimeout(function() {
		newElements.tooltip.style.display = 'none';
	}, 1000);
}

/************
Initialize
************/

function initialize() {
	// create the tooltip
	newElements.tooltip = document.createElement('div');
	newElements.tooltip.className = scriptid + '-tooltip';
	setTimeout(function(){newElements.tooltip.style.display = 'none';}, 200); // there needs to be a delay to hide the brightness box for some reason
	insertAfter(newElements.tooltip, document.querySelector('body'));

	// initialize spacebar checking to pause video
	document.body.addEventListener('keydown', pausePlayVideoCheck);

	// initialize check for increasing/decreasing brightness
	document.body.addEventListener('keydown', brightnessChangeCheck);

	// Checks things on window resize
	window.addEventListener("resize", resizeCheck);
	// Check things when the page URL changes
	window.addEventListener('popstate', resizeCheck);

	addGlobalStyle(css, scriptid);

	// create the "Go To Top" button
	newElements.goToTop = document.createElement('div');
	newElements.goToTop.id = scriptid + '-goToTop';
	newElements.goToTop.onclick = function() {
		window.scrollTo(0, 0);
	};
	newElements.goToTop.innerHTML = `<div class="">&#9650;</div>`;
	insertAfter(newElements.goToTop, document.querySelector('body'));

	turnOn();

	var defaultEvent = {
		'type': 'interval'
	};
	resizeCheck(defaultEvent);
  
	setInterval(function() {
      let player = document.querySelector("#player");
	  
	  if (isTruthy(player) && !player.classList.contains('off-screen')) {
          eventFire(player, 'resize');
	  }

      // add/remove theater mode from root body element
      if (document.querySelector('ytd-watch[theater-requested_]') != null) {
          // theater mode, set it on the body element
          document.querySelector('html').setAttribute(scriptid+`-theater`, '');
      } else {
          document.querySelector('html').removeAttribute(scriptid+`-theater`);
      }

      // add/remove variable to determine if we're at the top of the page
      if (document.querySelector('html').scrollTop != 0) {
          // we've scrolled down the page a little
          document.querySelector('html').removeAttribute(scriptid+`-scroll-at-top`);
      } else {
          // top of the page
          document.querySelector('html').setAttribute(scriptid+`-scroll-at-top`, '');
      }
	}, 250);
}

initialize();

/************
Utility Functions
************/

// from https://gist.github.com/skoshy/69a7951b3070c2e2496d8257e16d7981
function isFalsy(item) {
	if (
		!item
		|| (typeof item == "object" && (Object.keys(item).length == 0 && !(item instanceof HTMLElement))) // for empty objects, like {}, [], but omits HTML elements
	)
		return true;
	else
		return false;
}

function isTruthy(item) {
    return !isFalsy(item);
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function addGlobalStyle(css, id) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	style.id = id;
	head.appendChild(style);
}

// Run codes "unsafely"
// from https://greasyfork.org/scripts/8687-youtube-space-pause
function contentEval(source) {
	// Check for function input.
	if ('function' === typeof source) {
		// Execute this function with no arguments, by adding parentheses.
		// One set around the function, required for valid syntax, and a
		// second empty set calls the surrounded function.
		source = '(' + source + ')();';
	}

	// Create a script node holding this source code.

	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = source;

	// Insert the script node into the page, so it will run, and immediately remove it to clean up.
	document.body.appendChild(script);
	document.body.removeChild(script);
}

// Used from http://stackoverflow.com/questions/2705583/simulate-click-javascript
function eventFire(el, etype) {
	if (el.fireEvent) {
		(el.fireEvent('on' + etype));
	} else {
		var evObj = document.createEvent('Events');
		evObj.initEvent(etype, true, false);
		el.dispatchEvent(evObj);
	}
}