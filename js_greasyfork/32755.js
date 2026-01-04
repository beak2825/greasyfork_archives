// ==UserScript==
// @name         myetherwallet - Chỉnh max =100
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.myetherwallet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32755/myetherwallet%20-%20Ch%E1%BB%89nh%20max%20%3D100.user.js
// @updateURL https://update.greasyfork.org/scripts/32755/myetherwallet%20-%20Ch%E1%BB%89nh%20max%20%3D100.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var maxGas = xp("/html/body/header/section/section/div/span[3]/ul/div/input", 8);
    maxGas.max="100";
})();






function xp(exp, t, n) {
var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
if(t && t>-1 && t<10) switch(t) {
case 1: r=r.numberValue; break;
case 2: r=r.stringValue; break;
case 3: r=r.booleanValue; break;
case 8: case 9: r=r.singleNodeValue; break;
} return r;
}