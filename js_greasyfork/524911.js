// ==UserScript==
// @name         lain game
// @namespace    lain game adjustment
// @version      1.0.0
// @description  lain web game adjustments
// @match        http://localhost:8080/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524911/lain%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/524911/lain%20game.meta.js
// ==/UserScript==


// scale viewport to correct website width */
(function() {
    'use strict';
    var head = document.getElementsByTagName("head")[0];
    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
    head.appendChild(meta);
})();



// apply some css adjustment
function GM_addStyle(css) {
	let head = document.getElementsByTagName("head")[0];
	if (!head) {
		return;
	}
	let style = document.createElement("style");
    style.type = "text/css";
	style.innerHTML = css;
	head.appendChild(style);
}

GM_addStyle(`
    * {
        overflow: hidden;   
    }
    .game {
        width: calc(100vh * 13 / 10  ) !important;
        height: 100vh !important;
        border: none;
        & > div:nth-child(2) {
            margin-top: calc(-100vh) !important;
        }
    }
    #subtitle {
        font-size: 20px !important;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 1);
        background: rgba(0, 0, 0, 0.5);
    }
`);