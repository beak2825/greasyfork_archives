// ==UserScript==
// @name         Hide Loc
// @namespace    vinz3210.gg
// @version      2025-04-19-3
// @license      MIT 
// @description  Hides the loc (for blind team duels)
// @author       vinz3210
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533271/Hide%20Loc.user.js
// @updateURL https://update.greasyfork.org/scripts/533271/Hide%20Loc.meta.js
// ==/UserScript==

GM_addStyle(`
  canvas:fist-of-type{
    display: none !important;
  }
`);

