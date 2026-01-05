// ==UserScript==
// @name         Racing Upgrades
// @namespace    somenamespace
// @version      0.1
// @description  desc
// @author       tos
// @match        *.torn.com/loader.php?sid=racing
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28236/Racing%20Upgrades.user.js
// @updateURL https://update.greasyfork.org/scripts/28236/Racing%20Upgrades.meta.js
// ==/UserScript==

var barWrap, barValues;
barWrap = document.getElementsByClassName('bar-wrap');
for(i=0; i < barWrap.length; i++){
    barValues = getBarValues(barWrap[i]);
    barWrap[i].setAttribute('title', barValues.grey +'% ('+ barValues.sign + (barValues.color - barValues.grey) +'%)');
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if(node.className){
          var barWrap, barValues;
          if(node.className == 'pm-items-wrap'){
              barWrap = node.getElementsByClassName('bar-wrap');
              for(i=0; i < barWrap.length; i++){
                  barValues = getBarValues(barWrap[i]);
                  var modValue = barValues.color - barValues.grey;
                  modValue = +modValue.toFixed(2);
                  barWrap[i].setAttribute('title', barValues.sign + modValue +'%');
              }
          }
          if(node.className.includes('enlist-wrap') || node.className.includes('car-selected')){
              barWrap = node.getElementsByClassName('bar-wrap');
              for(i=0; i < barWrap.length; i++){
                  barValues = getBarValues(barWrap[i]);
                  barWrap[i].setAttribute('title', barValues.grey +'% ('+ barValues.sign + (barValues.color - barValues.grey) +'%)');
              }
          }
      }
    }
  }
});

const wrapper = document.querySelector('#racingAdditionalContainer');
observer.observe(wrapper, { subtree: true, childList: true });

function getBarValues(bar){
    var barValues = {};
    barValues.color = parseFloat(bar.querySelector('.bar-color-wrap-d').style.width.split('%')[0]);
    barValues.color = +barValues.color.toFixed(2);
    barValues.grey = parseFloat(bar.querySelector('.bar-gray-light-wrap-d').style.width.split('%')[0]);
    barValues.grey = +barValues.grey.toFixed(2);
    if(barValues.color === 0){
        barValues.color = barValues.grey;
    }
    barValues.sign = '+';
    if(bar.parentElement.parentElement.parentElement.className.includes('negative')) {
        barValues.sign = '-';
    }
    return barValues;
}
