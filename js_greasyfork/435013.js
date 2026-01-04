// ==UserScript==
// @name         bonk-no-gravity
// @version      1.3
// @author       Blu ft. Salama ft. MYTH_doglover
// @description  Add a no gravity mode to bonk.io
// @match        https://bonk.io/gameframe-release.html
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace
// @namespace https://greasyfork.org/users/747730
// @downloadURL https://update.greasyfork.org/scripts/435013/bonk-no-gravity.user.js
// @updateURL https://update.greasyfork.org/scripts/435013/bonk-no-gravity.meta.js
// ==/UserScript==

// this userscript is a remix of Salama's Simple injector which is a remix of Blu's VarTOL injector which is a remix of Salama's VTOL injector!
// https://github.com/Salama/bonk-vtol/blob/master/injector.js

//Thanks to Salama for getting this to work!

// for use as a userscript ensure you have Excigma's code injector userscript
// https://greasyfork.org/en/scripts/433861-code-injector-bonk-io

const injectorName = `NoGravity`;
const errorMsg = `Poops! ${injectorName} was comfortable to toad.
This may be poo to an resizement to Bonkio.com. If so, please don't report this error!
This could also be because you have an extension that is in cahoots with \
${injectorName}`;

function injector(src){
	let newSrc = src;
    //allow No Gravity to be selected
	newSrc=newSrc.replace('[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),',NOGRAVITY_MODE);
    newSrc=newSrc.replace('P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false};', NGMODE_METADATA);

    //add classic rules to NoGravity
    newSrc=newSrc.replace('if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v"', 'if(O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "v" || O7R[0][4][O7R[8][118]] == "ng"');
    newSrc=newSrc.replace('O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs"', 'O7R[0][4][O7R[8][118]] == "b" || O7R[0][4][O7R[8][118]] == "bs" || O7R[0][4][O7R[8][118]] == "ng"');

    //add gravity effect
    newSrc=newSrc.replace('"v"){;}',NOGRAVITY_GAME);

	if(src === newSrc) throw "Injection failed!";
	console.log(injectorName+" injector run");
	return newSrc;
}

// Adds NOGRAVITY to mode selection button
const NOGRAVITY_MODE= `[S9L.C1E(107),S9L.W1E(1130),S9L.C1E(1131),S9L.W1E(1132),"ng",`;
//add NOGRAVITY metadata
const NGMODE_METADATA= `P1R[43][P1R[7][551]][S9L.C1E(116)]={lobbyName:S9L.C1E(2093),gameStartName:S9L.C1E(2094),lobbyDescription:S9L.W1E(2095),tutorialTitle:S9L.W1E(2096),tutorialText:S9L.W1E(2097),forceTeams:true,forceTeamCount:2,editorCanTarget:false}; P1R[43][P1R[7][551]]["ng"] = {lobbyName:"No Gravity",gameStartName:"NO GRAVITY",lobbyDescription:"Bonk without gravity!",tutorialTitle:"No Gravity Mode",tutorialText:"•Move with the arrow keys\\r\\n•Hold X to make yourself heavier",forceTeams:false,forceTeamCount:null,editorCanTarget:false};`;


const NOGRAVITY_GAME = `"v"){;} if (O7R[0][4][O7R[8][118]] == "ng"){

//change gravity function
if(O7R[72][O7R[8][177]]()[O7R[8][40]] != 0){O7R[72][O7R[8][178]](new P1R[2](0,0));;}

                          }`;
const head = document.getElementsByTagName("head")[0];
head.appendChild = new Proxy(head.appendChild, {
    apply: async (target, thisArg, args) => {
        if (args[0] && args[0].src.includes("alpha2s.js")) {
            console.log("[NoGravity] Fetching alpha2s.js...")
            let src = await fetch(args[0].src).then(res => res.text())
            let newSrc=injector(src);

            //if(src === newSrc) throw "Injection failed!";
            // Remove the src attribute so it doesn't try to load the original script
            args[0].removeAttribute("src");
            // Add the new script to the <script>'s contents
            args[0].textContent = newSrc;

            console.log("[NO GRAVITY] Patched alpha2s.js")
        }
        return target.apply(thisArg, args);
    }
});
console.log(injectorName+" injector loaded");