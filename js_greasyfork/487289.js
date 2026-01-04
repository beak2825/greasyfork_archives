// ==UserScript==
// @name        Cat Mario Fullscreen
// @namespace   Violentmonkey Scripts
// @match       https://catmario.eu/
// @grant       none
// @version     1.0.1
// @author      Der_Floh
// @description Removes all Text and Scales the game Canvas to fill the whole Screen
// @license     MIT
// @icon		https://catmario.eu/icon.ico
// @homepageURL https://greasyfork.org/de/scripts/487289-cat-mario-fullscreen
// @supportURL  https://greasyfork.org/de/scripts/487289-cat-mario-fullscreen/feedback
// @downloadURL https://update.greasyfork.org/scripts/487289/Cat%20Mario%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/487289/Cat%20Mario%20Fullscreen.meta.js
// ==/UserScript==

const canvas = document.getElementById("canvas");
canvas.style.width = "100%";
canvas.style.maxWidth = "100vw";
canvas.style.height = "100%";
canvas.style.maxHeight = "100vh";

var cssElems = document.head.querySelectorAll("link");
for (const cssElem of cssElems) {
	cssElem.parentNode.removeChild(cssElem);
}

while (document.body.firstChild) {
	document.body.removeChild(document.body.firstChild);
}
document.body.appendChild(canvas);
