// ==UserScript==
// @name        5ch_mona_keshi
// @namespace   http://catherine.v0cyc1pp.com/5ch_mona_keshi.user.js
// @match       http://*.5ch.net/*
// @match       https://*.5ch.net/*
// @match       http://*.bbspink.com/*
// @match       https://*.bbspink.com/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     2.1
// @grant       none
// @description ５ちゃんねるのモナーを消す。
// @downloadURL https://update.greasyfork.org/scripts/33707/5ch_mona_keshi.user.js
// @updateURL https://update.greasyfork.org/scripts/33707/5ch_mona_keshi.meta.js
// ==/UserScript==

console.log("5ch_mona_keshi start");

document.querySelector(".mascot").setAttribute("style","");