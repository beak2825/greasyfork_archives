// ==UserScript==
// @name         Remove map padding
// @namespace    http://tampermonkey.net/
// @version      2024-01-18 v2
// @description  Removes the padding on the right side of the geoguessr map
// @author       You
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485190/Remove%20map%20padding.user.js
// @updateURL https://update.greasyfork.org/scripts/485190/Remove%20map%20padding.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addGlobalStyle(`
		[class^="game_guessMap__MTlQ_"]{
			right: 0;
		}
	`);
    addGlobalStyle(`
		[class^="game-map_container___fYQ6"]{
			right: 0;
		}
	`);
    addGlobalStyle(`
		[class^="guess-map_guessMap__wuNbK"]{
			right: 0;
		}
	`);

    function addGlobalStyle(css) {
		let head;
		let style;
		head = document.getElementsByTagName("head")[0];
		if (!head) {
			return;
		}
		style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = css.replace(/;/g, " !important;");
		head.appendChild(style);
	}


})();