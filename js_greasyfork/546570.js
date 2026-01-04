// ==UserScript==
// @name        Autofill tracklist with track numbers
// @namespace   Violentmonkey Scripts
// @match       https://*.rateyourmusic.com/releases/ac*
// @version     1.0
// @author      AnotherBubblebath
// @license     MIT
// @description Supports 1-n numbers. A-Side, B-Side, etc. must be done manually.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rateyourmusic.com
// @downloadURL https://update.greasyfork.org/scripts/546570/Autofill%20tracklist%20with%20track%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/546570/Autofill%20tracklist%20with%20track%20numbers.meta.js
// ==/UserScript==

var numberButton = document.createElement('div');
document.querySelector('#clearAllLengths').after(numberButton);
numberButton.classList.add('test');
numberButton.innerHTML = '<button id="numberButton" type="button">' + 'add tracklist numbers</button>'
document.getElementById("numberButton").addEventListener("click", numberButtonClick, false);

var count = 0;
var trackArray;

const tracklistObserver = new MutationObserver(tracks => {
  trackArray = document.querySelectorAll(".tracks > tbody > tr")
  count = document.querySelectorAll(".tracks > tbody > tr").length - 2
  console.log(trackArray);
  console.log(count);
});

tracklistObserver.observe(document.querySelector(".tracks > tbody"), { childList: true});

function numberButtonClick(zEvent){
  if (count > 0){
    for (let i = 1; i < trackArray.length-1; i++){
      trackArray[i].querySelectorAll("td")[1].querySelector('input').value = i;
    }
  }
}