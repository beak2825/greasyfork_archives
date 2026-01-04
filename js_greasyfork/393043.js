// ==UserScript==
// @name        Soulforged Skill Decimals
// @description Changes the skill level display to show decimal places
// @version     2.0.0
// @include     *://play.soulforged.net/*
// @namespace   soulforged.net
// @grant       none
// @author      Zap
// @downloadURL https://update.greasyfork.org/scripts/393043/Soulforged%20Skill%20Decimals.user.js
// @updateURL https://update.greasyfork.org/scripts/393043/Soulforged%20Skill%20Decimals.meta.js
// ==/UserScript==


//run once right away
setTimeout(decimalizeSkills, 300);

window.addEventListener("click", waitDecimalizeSkills);

function waitDecimalizeSkills() {
  //hope the DOM and all the required content is updated after a bit
  setTimeout(decimalizeSkills, 50);
}

function decimalizeSkills() {
  let indicators = document.getElementsByClassName("skill-bar");
  
  //iterate all skill indicators
  for(const indicator of indicators) {
    //find the bar element and extract the fill percentage
    let width = indicator.getElementsByClassName("fill-wrapper")[0].style.width;
    let percentage = width.substring(0, width.length - 1); //eliminate percentage sign
    
    //find skill value text element
    let valueElement = indicator.getElementsByClassName("labeled-value")[0].getElementsByClassName("value")[0];
    let valueText = valueElement.innerHTML.trim();
    
    //determine base skill level
    let baseLevel = 0;
    if(valueText.includes('.')) {
      baseLevel = valueText.substring(0, valueText.indexOf('.'));
    } else {
      baseLevel = valueText;
    }
    
    valueElement.innerHTML = (parseInt(baseLevel) + (percentage / 100)).toFixed(2);
  }
}