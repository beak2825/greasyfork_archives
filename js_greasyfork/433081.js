// ==UserScript==
// @name         Bonk.IO Fullscreen Button
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Fullscreen button for bonk.io
// @author       Zertalious (Zert)
// @match        *://bonk.io/
// @icon         https://www.google.com/s2/favicons?domain=bonk.io
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433081/BonkIO%20Fullscreen%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/433081/BonkIO%20Fullscreen%20Button.meta.js
// ==/UserScript==

GM_addStyle( `

#myBtn {
	position: fixed;
	left: 20px;
	top: 20px;
	width: 50px;
	height: 50px;
	z-index: 999;
	background: url(https://cdn-icons-png.flaticon.com/512/161/161728.png) 0 0 / 100% 100%;
	filter: invert(1);
	cursor: pointer;
}

#myBtn:hover {
	transform: scale(1.1);
}

` );

const myBtn = document.createElement( 'div' );

myBtn.id = 'myBtn';

document.body.appendChild( myBtn );

myBtn.onclick = function () {

	document.getElementById( 'maingameframe' ).contentWindow.document.getElementById( 'bonkiocontainer' ).requestFullscreen()

}