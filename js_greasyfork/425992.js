// ==UserScript==
// @name        Hell On Earth - noot.space
// @namespace   Violentmonkey Scripts
// @match       https://noot.space/
// @grant       none
// @version     1.0
// @author      Keyboard Slayer
// @description 5/5/2021, 15:05:22
// @downloadURL https://update.greasyfork.org/scripts/425992/Hell%20On%20Earth%20-%20nootspace.user.js
// @updateURL https://update.greasyfork.org/scripts/425992/Hell%20On%20Earth%20-%20nootspace.meta.js
// ==/UserScript==

function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms||DEF_DELAY))}(async()=>{for(;;){document.getElementsByClassName("container")[0].click();await sleep(1)}})();