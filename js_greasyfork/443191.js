// ==UserScript==
// @name         Bonk Kicked Alert
// @version      1.1.5
// @author       Blu
// @description  A userscript to add additional alerts in chat
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/443191/Bonk%20Kicked%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/443191/Bonk%20Kicked%20Alert.meta.js
// ==/UserScript==

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `BonkKicked`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

// escape special regex characters for RegExp obj
function escReg(reg){
  return reg.replace(/([\$[\]])/g, "\\$1");
}

function injector(src){
  let newSrc = src;

  let lobby = newSrc.match(/([\w$]{3}\[\d{2}\])=new [\w$]{2}\(([\w$]{3}\[\d{2}\],){3}/)[1];
  let ingame = newSrc.match(/\}\}if\(([\w$]{3}\[\d\d\])\)\{[\w$]{3}\(\);\}/)[1];
  let playerArr = newSrc.match(/([\w$]{3}\[\d{2}\])\[0\]=\{userName:/)[1];

  // on recv packet 24, handle player kicked when ingame or in lobby
  let kickedFunc = newSrc.match(/(\{if\(![\w$]{3}\[0\]\[1\]\).{0,500}?\}\})\}/)[1];
  newSrc = newSrc.replace(kickedFunc, `
   {arguments[69] = true;} else {
      let player = ${playerArr}[arguments[0]];
      let status = arguments[1] ? "KICKED!" : "BANNED!";

      if (${lobby}) ${lobby}.showStatusMessage("* " + player.userName + " was " + status, "#cc3333", false);
      if (${ingame}) ${ingame}.chatStatus("* " + player.userName + " was " + status);
   }
   if(arguments[69]) $&`);

  // on recv packet 40, handle player record
  let recordNotif = newSrc.match(/ ([\w$]{3}\.[\w$]{3}\(\d{3,4}\))\);\};/)[1];
  let renderer = newSrc.match(/([\w$]{3}\[\d{2}\])=new [\w$]{3}\[\d{2}\]\([\w$]{3}\[\d\]\);/)[1];
  newSrc = newSrc.replace(recordNotif, `$& + " by " + ${renderer}.playerArray[arguments[0]].userName`);

  // on recv packet 29, handle map updated
  let mapAddStr = newSrc.match(/[\w$]{3}\([\w$]{3}\.[\w$]{3}\((\d{2,4})\),[\w$]{3}\[\d\]\);\}\)/)[1];
  let mapAddFunc = newSrc.match(new RegExp(`[\\w$]{3}\\.[\\w$]{3}\\(${escReg(mapAddStr)}\\),([\\w$]{3})\\)`))[1];
  let mapAddBody = newSrc.match(new RegExp(`function ${escReg(mapAddFunc)}\\([\\w$]{3}\\)\\{`));
  newSrc = newSrc.replace(mapAddBody, `$&
    if(arguments[0].m.n.includes(' (edit)')){
      if (${lobby}) ${lobby}.showStatusMessage("* Host edited map", "#cc3333", false);
      if (${ingame}) ${ingame}.chatStatus("* Host edited map");
    }`);

  // on recv packet 29, ignore GMMODE update mode packets
  newSrc = newSrc.replace(/[\w$]{3}\[[0-9]\]=\w\[[\w$]{3}\[[0-9]\]\[[0-9]{3}\]\]\([\w$]{3}\[0\]\[0\]\);[\w$]{3}\(/, `if(arguments[0].startsWith("!!!GMMODE!!!")) return; $&`);

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