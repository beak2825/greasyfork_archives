// ==UserScript==
// @name        script - key-drop.com
// @namespace   violentmonkey Scripts
// @match       https://key-drop.com/*/case-battle/list
// @grant       none
// @version     1.0
// @author      wdsa#6952
// @description 15/08/2022, 16:46:46
// @downloadURL https://update.greasyfork.org/scripts/463548/script%20-%20key-dropcom.user.js
// @updateURL https://update.greasyfork.org/scripts/463548/script%20-%20key-dropcom.meta.js
// ==/UserScript==

const TARGETS = ['KITTY'];
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
})();