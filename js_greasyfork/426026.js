// ==UserScript==
// @name         raydium - Connect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take ove11r the world!
// @author       You
// @match        https://raydium.io/staking/
// @icon         https://www.google.com/s2/favicons?domain=raydium.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426026/raydium%20-%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/426026/raydium%20-%20Connect.meta.js
// ==/UserScript==

setTimeout(function(){
let butt = xp('//*[@id="__layout"]/section/header/div[2]/div/button',8);
    butt.click();
    setTimeout(function(){
        butt = xp('/html/body/div[2]/div/div[2]/div/div[2]/div[2]/div/button[6]',8);
        butt.click();
        setTimeout(function(){
            butt = xp('//*[@id="root"]/main/div/div[2]/button[2]/span[1]',8);
            butt.click();
        }, 2000);
    }, 1000);
}, 1000);





function xp(exp, t, n) {
    var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
    if(t && t>-1 && t<10) switch(t) {
        case 1: r=r.numberValue; break;
        case 2: r=r.stringValue; break;
        case 3: r=r.booleanValue; break;
        case 8: case 9: r=r.singleNodeValue; break;
    } return r;
}