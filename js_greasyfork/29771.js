// ==UserScript==
// @name        Google auto-speak pronunciation 
// @namespace   https://greasyfork.org/en/scripts/29771-google-pronunciation-speak
// @include     https://*google.com*
// @version     1.2
// @grant       none
// @description Auto pronounce the word X when googling "define X", "X definition" or "X meaning"
// @author      Ooker
// @downloadURL https://update.greasyfork.org/scripts/29771/Google%20auto-speak%20pronunciation.user.js
// @updateURL https://update.greasyfork.org/scripts/29771/Google%20auto-speak%20pronunciation.meta.js
// ==/UserScript==

document.querySelector("div.pkt1Wd:nth-child(6)").click();