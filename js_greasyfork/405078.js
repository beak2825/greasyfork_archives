// ==UserScript==
// @name            Hidden Nicodic Rank
// @namespace       Hidden Nicodic Rank
// @description     ニコニコ大百科の急上昇ワードを非表示にします
// @author          lazhward
// @match           https://dic.nicovideo.jp/*
// @version         1
// @license         MIT License
// @downloadURL https://update.greasyfork.org/scripts/405078/Hidden%20Nicodic%20Rank.user.js
// @updateURL https://update.greasyfork.org/scripts/405078/Hidden%20Nicodic%20Rank.meta.js
// ==/UserScript==

document.querySelector("#right-column > div.st-box_side.st-box_space-bottom.side-spaceBottom").hidden = true;