// ==UserScript==
// @name        New script - key-drop.com
// @namespace   Violentmonkey Scripts
// @match       https://key-drop.com/*/case-battle/list
// @grant       none
// @version     1.0
// @author      wdsa#6952
// @description 15/08/2022, 16:46:46
// @downloadURL https://update.greasyfork.org/scripts/463498/New%20script%20-%20key-dropcom.user.js
// @updateURL https://update.greasyfork.org/scripts/463498/New%20script%20-%20key-dropcom.meta.js
// ==/UserScript==

const TARGETS = [ 'KITTY'];
(async () => {
  while (true) {
    await new Promise(r => setTimeout(r, 100));
    try {
      const caseName = document.querySelector('p.max-w-full.px-1.overflow-hidden').textContent;
      const casePrice = document.querySelector('div.flex.items-center.justify-center.rounded-tl-lg').textContent;
      if (TARGETS.includes(caseName) && casePrice === 'FREE') {
        const btn = document.querySelector('a.button.ml-1.mr-5');
        btn.click();
      }
    } catch {null;}
  }
})();// ==UserScript==
// @name        New script
// @namespace   Violentmonkey Scripts
// @match       :///*
// @grant       none
// @version     1.0
// @author      -
// @description 3.09.2022, 21:37:32
// ==/UserScript==