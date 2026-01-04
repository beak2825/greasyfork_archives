// ==UserScript==
// @name         bonk-simple
// @version      1.0.4
// @author       Blu
// @description  A userscript to add Simple back to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/434177/bonk-simple.user.js
// @updateURL https://update.greasyfork.org/scripts/434177/bonk-simple.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `Simple`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(src){
  let newSrc = src;
  const modeName = "bs";
  
  
  // locate beginning of requirejs function
  const REQUIREJS_REGEX = /"use strict";var ([\w]+)=([\w]+);/;
  let requirejsMatch = newSrc.match(REQUIREJS_REGEX);
  let localObject = requirejsMatch[1];
  let globalObject = requirejsMatch[2];
  
  // get string function indices of each vanilla mode
  const MODENAME_REGEX = /(\d+)\)]={lobbyName:/g;
  let modenameMatch = newSrc.match(MODENAME_REGEX).map(x=>x.split(")")[0]);
  let modeIndices = {
    b: modenameMatch[0],
    v: modenameMatch[1],
    sp: modenameMatch[2],
    ar: modenameMatch[3],
    ard: modenameMatch[4],
    bs: modenameMatch[5],
    f: modenameMatch[6]
  };
  
  
  // locate lobbyModes array initialisation
  const LASTMODE_REGEX = `${localObject}\\.[\\w$]{1,3}\\(${modeIndices.f}\\)`;
  const MODEARRAY_REGEX = new RegExp(`=\\[(${localObject}\\.[\\w$]{1,3}\\(${modeIndices.b}\\).*?),(${LASTMODE_REGEX})]`);
  let modearrayMatch = newSrc.match(MODEARRAY_REGEX);
  // Adds Simple to mode selection button
  newSrc = newSrc.replace(modearrayMatch[0], `=[${modearrayMatch[1]},"${modeName}",${modearrayMatch[2]}]`);
  
  // locate Simple mode data initialisation
  const SIMPLEDATA_REGEX = new RegExp(`(${modeIndices[modeName]}\\)]={lobbyName:${localObject}\\.[\\w$]{1,3}\\(.*?),editorCanTarget:false}`);
  let simpledataMatch = newSrc.match(SIMPLEDATA_REGEX);
  // Adds Simple to map editor "For mode:" selector
  newSrc = newSrc.replace(simpledataMatch[0], `${simpledataMatch[1]},editorCanTarget:true}`);

  
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