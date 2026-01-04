// ==UserScript==
// @name         漂流瓶价格
// @namespace    https://hkfoggyu.github.io/
// @version      0.6
// @description  显示漂流瓶每个瓶子的总重和价格(单件物品的瓶子无法显示)
// @author       Young
// @supportURL   https://github.com/HKFoggyU/USTscripts
// @match        http://www.piaoliuhk.com/packageList.php
// @icon         http://www.piaoliuhk.com/css/images/favicon.ico
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/425282/%E6%BC%82%E6%B5%81%E7%93%B6%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/425282/%E6%BC%82%E6%B5%81%E7%93%B6%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

function getBottles() {
    let tds = document.getElementsByTagName("td");
    var bottles = [];
    for (var i=1; i<tds.length; i++) {
        if (tds[i].hasAttribute("rowspan")) {
            bottles.push(tds[i]);
        }
    }
    return bottles;
}

function calcWeightAndPrice(bottleNum) {
    var total = 0.0;
    let updatedNumber = 0;
    let addedNumber = 0;
    var trs = document.getElementsByTagName("tr");
    for (var i=1; i<trs.length; i++) {
        var tds = trs[i].getElementsByTagName("td");
        if (tds[1].innerText == bottleNum) {
            addedNumber += 1;
            if (tds[7].innerText != "") {
                total += parseFloat(tds[7].innerText);
                updatedNumber += 1;
            }
        }
    }
    var totalWeight = total.toFixed(1);
    var totalPriceHKD = totalWeight>1.0 ? (Math.ceil((totalWeight-1)/0.5)*3.5+12.5).toFixed(1) : 12.5;
    var totalPriceCNY = totalWeight>1.0 ? (Math.ceil((totalWeight-1)/0.5)*3.2+11.4).toFixed(1) : 11.4;
    return [updatedNumber, addedNumber, totalWeight, totalPriceHKD, totalPriceCNY];
}

(function() {
    'use strict';
    var bottles = getBottles();
    for (var i=0; i<bottles.length; i++) {
        var bottle = bottles[i];
        var bottleNum = bottle.innerText;
        var [updatedNumber, addedNumber, totalWeight, totalPriceHKD, totalPriceCNY] = calcWeightAndPrice(bottleNum);
        var outputText = `${bottle.innerText} (${updatedNumber}/${addedNumber} items, ${totalWeight} kg, ${totalPriceHKD} HKD, ${totalPriceCNY} CNY)`;
        bottle.innerText=outputText;
    }
    //window.scrollTo(0,document.body.scrollHeight);
})();

