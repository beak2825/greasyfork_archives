// ==UserScript==
// @name         Lazy Quickplay
// @version      1.0.0
// @author       Blu
// @description  A userscript to prevent creation of a new room if no suitable quickplay room found
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/443527/Lazy%20Quickplay.user.js
// @updateURL https://update.greasyfork.org/scripts/443527/Lazy%20Quickplay.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `LazyQuickplay`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
  let newSrc = src;
  
  // if receive "create" response from server, gracefully yeet
  newSrc = newSrc.replace(`if(W3C[Q6D[61]] == G9b.A43(439)){`, `if(W3C[Q6D[61]] == G9b.A43(439)){
    N4C("No room found");
    // click cancel
    document.querySelector('#sm_connectingWindowCancelButton').click();
    return;`);
  
  if(src === newSrc) throw "Injection failed!";
  console.log(injectorName+" injector run");
  return newSrc;
}

// Compatibility with Excigma's code injector userscript
if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
	try {
		return injector(bonkCode);
	} catch (error) {
		alert(errorMsg);
		throw error;
	}
});

console.log(injectorName+" injector loaded");