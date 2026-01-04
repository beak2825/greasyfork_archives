// ==UserScript==
// @license		MIT
// @name		ActiveX Twitter
// @description  Bringing DirectX & ActiveX to Twitter/X
// @version		1.1.0
// @author		AirGamer
// @match		https://Twitter.com/*
// @match		https://X.com/*
// @grant		none
// @run-at		document-start
// @namespace	https://greasyfork.org/users/1135652
// @downloadURL https://update.greasyfork.org/scripts/471700/ActiveX%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/471700/ActiveX%20Twitter.meta.js
// ==/UserScript==

'use strict';
const prefixes = ["Active", "Direct"];
const suffixes = ["videos", "64", "86"];

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const headerElement = document.createElement("h1");
const index = getRandomInt(prefixes.length + suffixes.length + 1);
const type = index >= prefixes.length ? (index >= prefixes.length + suffixes.length ? 3 : 2) : 1;

const i = setInterval(()=>
{
	const head = document.head;
	if(head !== null){
		const eElement = document.querySelector(`a[aria-label="Twitter"]`).firstChild;
		
		let text = null;
		switch(type)
		{
			case 1:
				text = document.createTextNode(prefixes[index]);
				headerElement.appendChild(text);
				eElement.insertBefore(headerElement, eElement.firstChild);
				break;
			case 2:
				text = document.createTextNode(suffixes[index - prefixes.length]);
				headerElement.appendChild(text);
				eElement.appendChild(headerElement);
				break;
			default: //case 3
				eElement.appendChild(eElement.firstChild.cloneNode(true));
				eElement.appendChild(eElement.firstChild.cloneNode(true));
				break;
		}
		clearInterval(i);
	}
});
