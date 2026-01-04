// ==UserScript==
// @name         EveryNoise Scan Continue
// @namespace    https://alteregobot.me/
// @description  press N to continue scanning on everynoise.com, instead of having to scroll up every time
// @author       MissingNO123
// @include      https://everynoise.com/*
// @version      1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440319/EveryNoise%20Scan%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/440319/EveryNoise%20Scan%20Continue.meta.js
// ==/UserScript==

// Inject a script tag into the document, 
// this is to call the scan() function from GM
function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script); // run the script
    document.body.removeChild(script); // clean up
}

document.addEventListener("keydown", Next);

function Next(e) {
  if (e.key == "n"){ 
    exec(function() {
    	return scan("continue");
    });
  }
}
