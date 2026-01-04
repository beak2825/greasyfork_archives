// ==UserScript==
// @name        Forcibly Inject
// @namespace   left paren
// @match       https://bonk.io/gameframe-release.html
// @run-at      document-start
// @grant       none
// @version     1.1
// @license     Unlicense
// @author      left paren
// @description If the injector doesn't inject, reloads the page.
// @downloadURL https://update.greasyfork.org/scripts/457283/Forcibly%20Inject.user.js
// @updateURL https://update.greasyfork.org/scripts/457283/Forcibly%20Inject.meta.js
// ==/UserScript==

success = false

function injector(src){
  success = true
  return src;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert("Forcibly Inject failed");
		throw error;
	}
});

var observer = new MutationObserver(function(mutations) {
  if (document.getElementById("bonkiocontainer").style.opacity != 1) return
    if (success) {
        observer.disconnect()
    } else {
        window.location.reload()
    }
});

observer.observe(document.getElementById("bonkiocontainer"), {
    attributes:    true
});

console.log("Forcibly Inject loaded");