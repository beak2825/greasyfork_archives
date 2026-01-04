// ==UserScript==
// @name         Random target
// @namespace    http://tampermonkey.net/
// @version      2024-10-23
// @description  Opens a random page of inactives
// @author       BollePapzak
// @match        https://www.torn.com/*
// @icon         https://torn.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513732/Random%20target.user.js
// @updateURL https://update.greasyfork.org/scripts/513732/Random%20target.meta.js
// ==/UserScript==

console.log('randomtarget userscript loaded')

const maxLevelKey = 'maxLevel';
const maxLevelDefault = 50;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

GM_registerMenuCommand('Update max level', () => {
    let userInput = prompt("Enter preferred max level", GM_getValue(maxLevelKey, maxLevelDefault));
    if (userInput !== null) {
        const parsedNumber = Number.parseInt(userInput);
        if (isNaN(parsedNumber)) {
            alert(`${userInput} is not a valid number`)
            return
        }
        GM_setValue(maxLevelKey, parsedNumber);
    }
})

GM_registerMenuCommand('Goto random target list', () => {
    const maxLevel = GM_getValue(maxLevelKey, maxLevelDefault);
    const pageStart = getRandomInt(100 * 25, 55000*25);
    const url = `https://www.torn.com/page.php?sid=UserList&levelFrom=1&levelTo=${maxLevel}&lastAction=7#start=${pageStart}`;
    window.location.replace(url);
})