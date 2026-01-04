// ==UserScript==
// @name         Sleepsnug Scripts test idk
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  testing shit
// @author       You
// @match        https://cytu.be/r/*
// @icon         https://icons.duckduckgo.com/ip2/cytu.be.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527882/Sleepsnug%20Scripts%20test%20idk.user.js
// @updateURL https://update.greasyfork.org/scripts/527882/Sleepsnug%20Scripts%20test%20idk.meta.js
// ==/UserScript==


var plusGlyph = document.getElementsByClassName('glyphicon-plus')[0];
var removeGlyph = plusGlyph.cloneNode(true);
removeGlyph.setAttribute('class', 'glyphicon glyphicon-remove pointer');
removeGlyph.setAttribute('title', 'Remove Video');
//removeGlyph.setAttribute('onClick', 'Remove()');
//removeGlyph.onclick = Remove();
removeGlyph.addEventListener("click", Remove);

var styles = '.glyphicon-remove:before { content: "\\2a"; } ';
var styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
document.getElementById('videowrap-header').appendChild(removeGlyph);

function Remove () {
	document.getElementById('videowrap').remove();
	document.getElementById('chatwrap').style.width='100%';
}
