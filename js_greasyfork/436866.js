// ==UserScript==
// @name         [HWM] OneBattleAuctionPrice
// @namespace    [HWM] OneBattleAuctionPrice
// @version      0.2
// @description  Show price of one battle on auction page
// @author       Komdosh
// @include      http*://*.heroeswm.ru/auction.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436866/%5BHWM%5D%20OneBattleAuctionPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/436866/%5BHWM%5D%20OneBattleAuctionPrice.meta.js
// ==/UserScript==


var arts = Array.from(document.querySelectorAll("tr[bgcolor].wb"));

if(arts==null){
    return;
}


for(var artIdx = 0; artIdx< arts.length; ++artIdx){
    var artDom = arts[artIdx];

    var cost = parseInt(artDom.querySelectorAll("td")[4].innerText.trim().replaceAll(',', ''));
    var artDescDom = artDom.querySelector("td[valign]");
    var artDesc = artDescDom.innerText.split("\n").find(it=>/\//.test(it));
    var durability = parseInt(artDesc.split(" ")[1].split("/")[0]);

    var infoSpan = document.createElement('span');
    infoSpan.style = 'font-size: 8px; color: #21211D';
    infoSpan.innerText = ' ('+Math.ceil(cost/durability)+')';
    artDescDom.append(infoSpan);
}