// ==UserScript==
// @name        Kolex Autospinner
// @namespace   Violentmonkey Scripts
// @match       https://kolex.gg/wheel
// @grant       none
// @version     1.0
// @author      Milkcarton
// @description 05/11/2023, 02:59:49
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479058/Kolex%20Autospinner.user.js
// @updateURL https://update.greasyfork.org/scripts/479058/Kolex%20Autospinner.meta.js
// ==/UserScript==

window.onload=function(){
    setInterval(autoClick,100);
}

function getElementByXPath(xpath) {
  return new XPathEvaluator()
    .createExpression(xpath)
    .evaluate(document, XPathResult.FIRST_ORDERED_NODE_TYPE)
    .singleNodeValue;
}

function autoClick(){
    let spinButton = getElementByXPath("/html/body/div[1]/div/article/div/div/div/section[1]/div/div/div[2]/div[2]/button");
    let closeButton = getElementByXPath("/html/body/div[4]/div/div/div/div[2]/div/button[2]");
  if (spinButton != null){
    spinButton.click();
  }
  if (closeButton != null){
    closeButton.click();
  }
}