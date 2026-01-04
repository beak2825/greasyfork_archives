// ==UserScript==
// @name         Bonk.io Snow Disabler
// @namespace    http://pixelmelt.dev/
// @version      0.1
// @description  Disable snow on bonk.io!
// @author       Pix#7008
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456234/Bonkio%20Snow%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/456234/Bonkio%20Snow%20Disabler.meta.js
// ==/UserScript==

const injectorName = `Snow Disabler`;
const errorMsg = `Whoops! ${injectorName} was unable to load.
This may be due to an update to Bonk.io. If so, please report this error!
This could also be because you have an extension that is incompatible with \
${injectorName}`;

function injector(bonkSrc){
    let snow = /(\[\d+\]\(\w+\[\d+\]\[\d+\]\);this\[\w+\[\d+\]\[\d+\]\])=false;/
    console.log("Warming up...");
    let newBonkSrc = bonkSrc.replace(snow, "$1=true;")
    if(bonkSrc === newBonkSrc) throw "Injection failed!";
    console.log(injectorName+" injector run");
    return newBonkSrc;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert(errorMsg);
        throw error;
    }
});