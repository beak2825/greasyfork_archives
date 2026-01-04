// ==UserScript==
// @name         uncapped-fps
// @version      1.0.0
// @author       Blu
// @description  A userscript to prevent bonk capping fps to your monitors refresh rate
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/464221/uncapped-fps.user.js
// @updateURL https://update.greasyfork.org/scripts/464221/uncapped-fps.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `uncapped-fps`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
  let newSrc = src;

  // inside renderer call, if idle, calculate how much free time we got and extrapolate fps
  newSrc = newSrc.replace(`requestAnimationFrame(B6);}`, `
  requestIdleCallback((deadline) => {
    // cant be bothered finding your monitors refresh rate
    let cap = 60;

    let goal = 1000/cap;
    let elapsed = goal - deadline.timeRemaining();
    let scale = goal/elapsed;
    let fps = scale*cap;

    // recentFrames keeps track of all fps calculations since last fps gui update
    window.recentFrames = window.recentFrames ?? [];
    // cant be bothered only pushing data if simpleFPS is enabled. what of it bruv
    if(window.recentFrames.length > cap) window.recentFrames = [];
    window.recentFrames.push(fps);

    // set fps to avg of all recent fps calculations
    let potentialFPS = window.recentFrames.reduce((acc, curr) => acc + curr, 0) / window.recentFrames.length;
    V5F[25].simpleFPS.currentCount = potentialFPS.toFixed(0);
  }); $&`);

  // reset rolling avg when updating currentCount in simpleFPS
  newSrc = newSrc.replace(`this[y$5[5][1654]]=0;`, `$& window.recentFrames = [];`);

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