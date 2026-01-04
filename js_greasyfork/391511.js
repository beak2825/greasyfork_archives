// ==UserScript==
// @name         Arcanum AutoTreat
// @version      0.12
// @author       Yoyó
// @description  It clicks the Treat Ailments button every 1s (if it is enabled) and drains your mana down to stamToKeep% (adjust stamToKeep for a different amount). Based on lulero's AutoFocus script.
// @match        http://www.lerpinglemur.com/arcanum/
// @match        https://game312933.konggames.com/gamez/0031/2933/*
// @namespace    https://greasyfork.org/users/390287
// @downloadURL https://update.greasyfork.org/scripts/391511/Arcanum%20AutoTreat.user.js
// @updateURL https://update.greasyfork.org/scripts/391511/Arcanum%20AutoTreat.meta.js
// ==/UserScript==

var stamToKeep = 85;

var autofocus = window.setInterval(function(){

    let focusXpath="//div[@class='main-actions']//button[text()='Treat Ailments']";
    let focusBtn = document.evaluate(focusXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(!focusBtn.disabled){
        let stamXpath="//div[@class='vitals']//table[@class='bars']//div[@class='stamina']//span[@class='bar-text']";
        let stamText = document.evaluate(stamXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        let stamValues = stamText.textContent.split("/");
        let currentStam = parseFloat(stamValues[0]);
        let maxStam = parseFloat(stamValues[1]);
        let stamToSpend = currentStam - maxStam*stamToKeep/100;
        while (stamToSpend > 0.1) {
            focusBtn.click();
            stamToSpend = stamToSpend - 0.2;
        }
    }

},1000);