// ==UserScript==
// @name         Football+
// @version      0.0.1
// @author       Pix#7008
// @license MIT
// @description  A userscript that changes football physiscs
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/en/users/226344-pixel-melt
// @downloadURL https://update.greasyfork.org/scripts/458455/Football%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/458455/Football%2B.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io





// FOOTBALL+ SETTINGS
const Acceleration = 70.0 // default 32.0
const Deceleration = 4.8 // default 2.4
const Kickback = 0 // default 0.7
// FOOTBALL+ SETTINGS





const injectorName = `Football+`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
    let newSrc = src;

    newSrc = newSrc.replace(/=32\.0;if/g,`=${Acceleration};if`);
    newSrc = newSrc.replace(/\.linearDamping=2\.4;/g,`.linearDamping=${Deceleration};`);
    newSrc = newSrc.replace(/\.Multiply(0\.7);/g,`.Multiply(${Kickback});`)

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