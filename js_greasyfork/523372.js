// ==UserScript==
// @name         Warning On Attack Join
// @namespace    https://github.com/cryosis7/torn_userscripts
// @version      0.2
// @description  Stops you from joining an attack when you don't want to.
// @author       Evil_Panda_420
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523372/Warning%20On%20Attack%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/523372/Warning%20On%20Attack%20Join.meta.js
// ==/UserScript==

run();

async function run() {
    while (!document.querySelector('div[class^="dialog"]'))
        await sleep(10);

    let x = document.querySelector('div[class^="colored"]');
    if (x.innerText === "JOIN FIGHT")
        x.style.background = 'linear-gradient(180deg, hsla(0,0%,100%,0.65),rgba(255,0,0,1))';
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}