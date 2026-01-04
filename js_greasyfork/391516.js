// ==UserScript==
// @name         Arcanum AutoSell Herbs and one gem if maxed.
// @version      0.1
// @author       Yoyó
// @description  It sells "all" herbs and/or 1 gem when they're full. Should have more than 16 max gems for the gem selling to commence, so it doesn't interfere with unlocking gem boxes.
// @match        http://www.lerpinglemur.com/arcanum/
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @namespace https://greasyfork.org/users/390287
// @downloadURL https://update.greasyfork.org/scripts/391516/Arcanum%20AutoSell%20Herbs%20and%20one%20gem%20if%20maxed.user.js
// @updateURL https://update.greasyfork.org/scripts/391516/Arcanum%20AutoSell%20Herbs%20and%20one%20gem%20if%20maxed.meta.js
// ==/UserScript==

var autofocus = window.setInterval(function(){

    let sellGemFocus = "//div[@class='main-actions']//button[text()='Sell Gem']";
    let sellGemBtn = document.evaluate(sellGemFocus,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
    if(!sellGemBtn.disabled){
        let gemsPath = "//div[@class='resource-list']//td[text()='gems']/following-sibling::td[@class='num-align']";
        let gemsText = document.evaluate(gemsPath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
        let gemsValues = gemsText.textContent.split("/");
        let currGems = parseInt(gemsValues[0]);
        let maxGems = parseInt(gemsValues[1]);
        if(currGems == maxGems) {
            sellGemBtn.click();
        }
    }
    let sellHerbsFocus = "//div[@class='main-actions']//button[text()='Sell Herbs']";
    let sellHerbsBtn = document.evaluate(sellHerbsFocus,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
    if(!sellHerbsBtn.disabled){
        let herbsPath = "//div[@class='resource-list']//td[text()='herbs']/following-sibling::td[@class='num-align']";
        let herbsText = document.evaluate(herbsPath,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
        let herbsValues = herbsText.textContent.split("/");
        let currHerbs = parseInt(herbsValues[0]);
        let maxHerbs = parseInt(herbsValues[1]);
        if (currHerbs == maxHerbs) {
            while (maxHerbs > 0) {
                sellHerbsBtn.click();
                maxHerbs = maxHerbs -1;
            }
        }
    }
},1000);