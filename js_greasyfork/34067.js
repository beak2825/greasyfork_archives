// ==UserScript==
// @name         Replace Reporter's Color
// @namespace    https://pa0neix.github.io/
// @version      0.1
// @description  meh
// @author       pnx <pa0neix@gmail.com>
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34067/Replace%20Reporter%27s%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/34067/Replace%20Reporter%27s%20Color.meta.js
// ==/UserScript==

if(!localStorage['rrc']) localStorage['rrc'] = '#7c46b5';
document.querySelectorAll('span').forEach(function(e) {
	if(e.style.color == 'rgb(51, 102, 204)') e.style.color = localStorage['rrc'];
});
document.querySelectorAll('a').forEach(function(e) {
	if(e.style.color == 'rgb(51, 102, 204)') e.style.color = localStorage['rrc'];
});