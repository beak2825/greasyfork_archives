// ==UserScript==
// @name         AdBlock
// @namespace    http://tampermonkey.net/
// @version      2024-02-06
// @description  Play Chess Without Ads!
// @author       Oleh Prukhnytskyi
// @match        https://www.chess.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486779/AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/486779/AdBlock.meta.js
// ==/UserScript==

const ads = ['medium-rectangle-atf-ad', 'board-layout-ad', 'leaderboard-atf-ad', 'medium-rectangle-btf-ad', 'main-banner'];
for (const ad of ads) {
  try {
    document.getElementById(ad).remove();
  } catch(e) { }
}
