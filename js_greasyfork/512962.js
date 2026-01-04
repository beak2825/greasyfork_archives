// ==UserScript==
// @name         Bonk Quick Start
// @version      1.0
// @description  skips the countdown
// @author       Apx
// @match        https://bonk.io/*
// @match        https://bonkisback.io/*
// @run-at       document-start
// @namespace    http://tampermonkey.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512962/Bonk%20Quick%20Start.user.js
// @updateURL https://update.greasyfork.org/scripts/512962/Bonk%20Quick%20Start.meta.js
// ==/UserScript==


function injector(src){
    let newSrc = src;
    const countdownRegex = newSrc.match(/(?<=\);function )[a-zA-Z0-9\$_]{3}.{0,100}else {[a-zA-Z0-9\$_]{3}\(.{0,100}--;[a-zA-Z0-9\$_\.]{7}\(\);if\(.*?}}/)[0];
    newSrc = newSrc.replace(countdownRegex, `${countdownRegex.substring(0,3)}(){${countdownRegex.match(/[a-zA-Z0-9\$_]{3}\(.{3}\..*?\)\)/)};${countdownRegex.match(/[a-zA-Z0-9\$_]{3}\[[0-9]{1,3}\](?=--)/)}=-1}`);
    if(src === newSrc) throw "Injection failed!";
    console.log("Quick Start injector run");
    return newSrc;
}

if(!window.bonkCodeInjectors) window.bonkCodeInjectors = [];
window.bonkCodeInjectors.push(bonkCode => {
    try {
        return injector(bonkCode);
    } catch (error) {
        alert("Whoops! Quick Start was unable to load.");
        throw error;
    }
});

console.log("Quick Start injector loaded");