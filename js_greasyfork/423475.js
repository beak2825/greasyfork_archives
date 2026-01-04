// ==UserScript==
// @name         Working Bonk Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Remove ads on bonk.io
// @author       MYTH_doglover
// @match        https://bonk.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423475/Working%20Bonk%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/423475/Working%20Bonk%20Ad%20Blocker.meta.js
// ==/UserScript==


document.getElementById("adboxverticalleftCurse").onclick = function() {
let ad1 = document.getElementById("adboxverticalleftCurse");
ad1.remove();
}


let ad3 = document.getElementById("bonk_d_1");
ad3.remove();

let ad4 = document.getElementById("bonk_d_2");
ad4.remove();