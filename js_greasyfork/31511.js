// ==UserScript==
// @name         cryptopia-Balance
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.cryptopia.co.nz/Balances
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31511/cryptopia-Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/31511/cryptopia-Balance.meta.js
// ==/UserScript==
setTimeout(function(){
    for (var i=0; i<20; i++){
        var text = xp('//*[@id="table-balances"]/tbody/tr['+i+']/td[2]/div[2]', 2);    
    if (text.length>0 ){
        var obj = xp('//*[@id="table-balances"]/tbody/tr['+i+']/td[2]/div[1]', 8);
        var aTag = document.createElement('a');
        aTag.setAttribute('href',"https://www.cryptopia.co.nz/Exchange/?market=" + text.trim()+"_BTC");
        aTag.innerHTML = "Link";
        obj.appendChild(aTag);
    }
    }
}, 5000);



function xp(exp, t, n) {
var r = document.evaluate((exp||"//body"),(n||document),null,(t||6),null);
if(t && t>-1 && t<10) switch(t) {
case 1: r=r.numberValue; break;
case 2: r=r.stringValue; break;
case 3: r=r.booleanValue; break;
case 8: case 9: r=r.singleNodeValue; break;
} return r;
}
