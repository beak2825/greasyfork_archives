// ==UserScript==
// @name     		wedsdr.ru audio fix
// @description Fixes audio on websdr.ru
// @version  		1.0
// @grant    		none
// @match 			http://*.websdr.ru/*
// @namespace       rsxgirl.gay
// @homepage        https://rsxgirl.gay
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/494428/wedsdrru%20audio%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/494428/wedsdrru%20audio%20fix.meta.js
// ==/UserScript==

let resumed = false;

addEventListener("click", (event) => {
  if (!resumed) {
    console.log("AUDIOFIX: Resuming");
    resumed = true;
		window.eval("document[\"ct\"].resume()");
  } else {
  	console.log("AUDIOFIX: Already resumed");
  }
});