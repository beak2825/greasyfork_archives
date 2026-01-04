// ==UserScript==
// @name        Bonk.io - No Christmas
// @namespace   https://greasyfork.org/en/users/945115
// @match       https://bonk.io/gameframe-release.html
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      -
// @license     The Unlicense
// @description Disables Christmas features, such as snow, in bonk.io
// @downloadURL https://update.greasyfork.org/scripts/456212/Bonkio%20-%20No%20Christmas.user.js
// @updateURL https://update.greasyfork.org/scripts/456212/Bonkio%20-%20No%20Christmas.meta.js
// ==/UserScript==

const injectorName = `No Christmas`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
  let newSrc = src.replace(/return ([$a-zA-Z0-9_]{2,5}\[[0-9]+\]) >= 335 \|\| \1 <= 6;/, "return false;")
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