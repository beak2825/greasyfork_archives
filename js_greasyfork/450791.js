// ==UserScript==
// @name        New script - key-drop.com
// @namespace   Violentmonkey Scripts
// @match       https://key-drop.com/*/case-battle/list
// @grant       none
// @version     1.0
// @author      wdsa#6952
// @description 15/08/2022, 16:46:46
// ==/UserScript==

const TARGETS = ['TOXIC', 'DIABLO','ICE BLAST', 'ROCKET RACCON','1% PROFIT','1% KNIFE'];
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