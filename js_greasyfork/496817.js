// ==UserScript==
// @name         GOG-Games.net Extra Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds more information about the current game you are checking out
// @author       TetteDev
// @match        https://gog-games.net/game/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gog-games.net
// @connect      gog.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/496817/GOG-Gamesnet%20Extra%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/496817/GOG-Gamesnet%20Extra%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

	const iframe_id = "ikljasdfjkljasd";
	if (document.getElementById(`${iframe_id}`)) return;

	const borderRadius = 10;
	const name = location.pathname.replace("/game/", "").replace("/", "");
	const url = `https://www.gog.com/index.php/en/game/${name}`;
	if (document.getElementById(`#${iframe_id}`)) return;
	const iframe = document.createElement("iframe");

	iframe.src = url;
	iframe.style.cssText = `
	width:100%;
	height:750px;
	display:none;
	z-index:999;
	-webkit-border-radius: ${borderRadius}px;
	-moz-border-radius: ${borderRadius}px;
	border-radius: ${borderRadius}px;
	border:2px solid black;`;
	iframe.onload = () => { iframe.style.display = "block"; };

	const container = document.querySelector("#game-details");
	container.appendChild(iframe);
	//document.body.appendChild(iframe);
})();