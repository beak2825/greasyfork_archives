// ==UserScript==
// @name         sollet - Unlock
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.sollet.io/
// @icon         https://www.google.com/s2/favicons?domain=sollet.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426024/sollet%20-%20Unlock.user.js
// @updateURL https://update.greasyfork.org/scripts/426024/sollet%20-%20Unlock.meta.js
// ==/UserScript==
setTimeout(function(){
let butt = xp('//*[@id="root"]/main/div/div/div[2]/button/span[1]',8);
    butt.click();

}, 1000);

setTimeout(function(){
    let      butt = xp('//*[@id="root"]/main/div/div[2]/button[2]/span[1]',8);
    butt.click();
}, 2000);
function xp(exp, t, n) {
    var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
    if(t && t>-1 && t<10) switch(t) {
        case 1: r=r.numberValue; break;
        case 2: r=r.stringValue; break;
        case 3: r=r.booleanValue; break;
        case 8: case 9: r=r.singleNodeValue; break;
    } return r;
}