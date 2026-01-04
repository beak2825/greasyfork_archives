// ==UserScript==
// @name         Spice Works Helpdesk
// @namespace    https://on.spiceworks.com
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://on.spiceworks.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372389/Spice%20Works%20Helpdesk.user.js
// @updateURL https://update.greasyfork.org/scripts/372389/Spice%20Works%20Helpdesk.meta.js
// ==/UserScript==



function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}
//addGlobalStyle('p { font-size: large ! important; }');
addGlobalStyle('.ad-container { display: none ! important; }');
addGlobalStyle('.ad-shelf { display: none ! important; }');
addGlobalStyle('.main-content { width: 100% ! important; }');

addGlobalStyle('.container { width: 100% ! important; }');
(function() {
    'use strict';

    // Your code here...
})();