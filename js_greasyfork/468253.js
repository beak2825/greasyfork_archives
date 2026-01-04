// ==UserScript==
// @name         uncapped-speed
// @version      1.0.0
// @author       Blu
// @description  A userscript to let you set your own speed cap
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/468253/uncapped-speed.user.js
// @updateURL https://update.greasyfork.org/scripts/468253/uncapped-speed.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `uncapped-speed`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;
const noCapFrFr = 10;

function injector(src){
  let newSrc = src;

  // changes box2d settings
  newSrc = newSrc.replace(`var j2b=E6ncf;`, `$& T9H.Common.b2Settings.b2_maxTranslation = ${noCapFrFr};`);

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