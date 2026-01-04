// ==UserScript==
// @name         Remove Unused Buttons in HIT Forker
// @namespace    https://greasyfork.org/en/users/434272-realalexz
// @version      0.6
// @description  Removes vB, SLK, and IRC buttons from HIT Forker.
// @author       RealAlexZ
// @icon         https://i.imgur.com/NouzJ6b.jpg
// @include      https://worker.mturk.com/?hit_forker
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/395034/Remove%20Unused%20Buttons%20in%20HIT%20Forker.user.js
// @updateURL https://update.greasyfork.org/scripts/395034/Remove%20Unused%20Buttons%20in%20HIT%20Forker.meta.js
// ==/UserScript==

GM_addStyle('.vb, .irc { width: 11px !important; visibility: hidden !important; }' +
    '.slk { width: 2px !important; visibility: hidden !important; }');