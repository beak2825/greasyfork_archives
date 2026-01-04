// ==UserScript==
// @name Stratums Quality of Life Features
// @namespace Stratums Quality of Life Features
// @version 2.0
// @description disable space bar scroll and right click context menu
// @author J3B
// @match https://stratums.io/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/447134/Stratums%20Quality%20of%20Life%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/447134/Stratums%20Quality%20of%20Life%20Features.meta.js
// ==/UserScript==

(function() {

var killSpaceBar = function(evt) {

var target = evt.target || {},
isInput = ("INPUT" == target.tagName || "TEXTAREA" == target.tagName || "SELECT" == target.tagName || "EMBED" == target.tagName);

// if we're an input or not a real target exit
if(isInput || !target.tagName) return;

// if we're a fake input like the comments exit
if(target && target.getAttribute && target.getAttribute('role') === 'textbox') return;

// ignore the space and send a 'k' to pause
if (evt.keyCode === 32) {
evt.preventDefault();
}
};

document.addEventListener("keydown", killSpaceBar, false);

})();

document.addEventListener('contextmenu', event => event.preventDefault());