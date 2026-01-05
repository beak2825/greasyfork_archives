// ==UserScript==
// @name         PlexEXT
// @icon         https://www.macupdate.com/images/icons256/27302.png
// @namespace    skoshy.com
// @version      0.1.3
// @description  Enhances Plex
// @author       Stefan Koshy
// @match        http*://localhost:32400/*
// @match        http*://app.plex.tv/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21720/PlexEXT.user.js
// @updateURL https://update.greasyfork.org/scripts/21720/PlexEXT.meta.js
// ==/UserScript==

var scriptid = 'plex-supreme';

var newElements = {};
var timers = {};

var css = `
/* Makes video controls a little lighter */
.video-controls-overlay {background-color: rgba(0,0,0,.2);}
.video-controls-overlay:hover {background-color: rgba(0,0,0,.8);}

/* CUSTOM TOOLTIP */
.`+scriptid+`-tooltip {
  position: fixed;
  bottom: 5px;
  left: 5px;
  background: rgba(255, 255, 255, .8);
  padding: 3px;
  border-radius: 20px;
  color: black;
  z-index: 10000000;
}
`;

function brightnessChangeCheck(event) {
  if (!isFocusOnInputBox(event.target)) {
	if (event.shiftKey) {
	  var video = document.querySelector('video');

	  var brightness = parseFloat(parseFromFilter('brightness', video.style.filter));
	  if (!brightness || isNaN(brightness)) { // no brightness has been specified yet
		video.style.filter = 'brightness(1.0)';
		brightness = parseFloat(parseFromFilter('brightness', video.style.filter));
	  }

	  if (event.keyCode === 33) { // shift+pgup
		var newBrightness = brightness+.1;
		video.style.filter = 'brightness('+newBrightness+')';
		showTooltip('Brightness: '+newBrightness.toFixed(2));
	  } else if (event.keyCode === 34) { // shift+pgdn
		var newBrightness = brightness-.1;
		video.style.filter = 'brightness('+newBrightness+')';
		showTooltip('Brightness: '+newBrightness.toFixed(2));
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
  
  var startLength = name.length+1;
  var startPos = string.indexOf(name+'(');
  
  if (startPos == -1)
	return false;
  
  var endPos = string.indexOf(')', startLength+startPos);
  
  if (endPos == -1)
	return false;
  
  return string.substring(startLength+startPos, startLength+startPos+endPos);
}

function showTooltip(text) {
  newElements.tooltip.innerHTML = text;
  newElements.tooltip.style.display = 'block';
  
  clearTimeout(timers.tooltip);
  timers.tooltip = setTimeout(function() {newElements.tooltip.style.display = 'none';}, 1000);
}

function addGlobalStyle(css, id) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  style.id = id;
  head.appendChild(style);
}

function initialize() {
  if (location.hostname == 'localhost' && location.port != '32400')
  	return;
  
  // create the tooltip  
  newElements.tooltip = document.createElement('div');
  newElements.tooltip.className = scriptid+'-tooltip';
  newElements.tooltip.style.display = 'none';
  insertAfter(newElements.tooltip, document.querySelector('#plex'));

  // initialize check for increasing/decreasing brightness
  document.body.addEventListener('keydown', brightnessChangeCheck);

  addGlobalStyle(css, scriptid);
}

initialize();

// passed a target element, will check if it's an input box
function isFocusOnInputBox(target) {
  if (target.getAttribute('role') == 'textbox' || target.tagName == 'INPUT' || target.tagName == 'TEXTAREA')
	return true;
  else
	return false;
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}