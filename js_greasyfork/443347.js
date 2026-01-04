// ==UserScript==
// @name         °F+°C Weather - google
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      8
// @description  Shows both °F and °C weather temperatures at the same time on Google.
// @author       hacker09
// @include      *://www.google.*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.google.com&size=64
// @run-at       document-end
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/443347/%C2%B0F%2B%C2%B0C%20Weather%20-%20google.user.js
// @updateURL https://update.greasyfork.org/scripts/443347/%C2%B0F%2B%C2%B0C%20Weather%20-%20google.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var CorF; //Create a global variable

  if (document.querySelector("div.vk_bk.wob-unit > span,div.wob_uctr > span").innerText === '°F') //If the current temperature is in °F
  { //Starts the if condition
    CorF = '°F'; //Page was loaded in °F
  } //Finishes the if condition

  async function ShowCF() {
    var c = document.getElementById('wob_tm').innerText; //Save the current temperature value
    var f = document.getElementById('wob_ttm').innerText; //Save the hidden temperature value

    navigator.userAgentData.mobile === true ? document.querySelector("div.wob_tctr").style.display = 'none' : ''; //Hide the big text temperature
    navigator.userAgentData.mobile === true ? document.querySelector("div.wob_uctr").style.fontSize = '47px' : ''; //Increase the script custom text font size
    navigator.userAgentData.mobile === true ? document.querySelectorAll("div.wob_uctr > span").forEach(el => el.style.color = 'white') : ''; //Make the script temperature white

    if (CorF === '°F') //If the current temperature is in °F
    { //Starts the if condition
      navigator.userAgentData.mobile === true ? '' : document.querySelector("div.vk_bk.TylWce.SGNhVe").innerText = c + '°F / ' + f + '°C'; //Show °F °C
      document.querySelectorAll("div.wob_uctr > .wob_t:nth-child(1),div.wob_uctr > .wob_t:nth-child(2)").forEach(el => el.innerText = c + '°F'); //Show °F
      document.querySelectorAll("div.wob_uctr > .wob_t:nth-child(4),div.wob_uctr > .wob_t:nth-child(5)").forEach(el => el.innerText = f + '°C'); //Show °C
    } //Finishes the if condition
    else //If the current temperature is in °C
    { //Starts the else condition
      navigator.userAgentData.mobile === true ? '' : document.querySelector("div.vk_bk.TylWce.SGNhVe").innerText = c + '°C / ' + f + '°F'; //Show °C °F
      document.querySelectorAll("div.wob_uctr > .wob_t:nth-child(1),div.wob_uctr > .wob_t:nth-child(2)").forEach(el => el.innerText = c + '°C'); //Show °C
      document.querySelectorAll("div.wob_uctr > .wob_t:nth-child(4),div.wob_uctr > .wob_t:nth-child(5)").forEach(el => el.innerText = f + '°F'); //Show °F
    } //Finishes the else condition

    let elements1 = document.querySelectorAll("text.wob_t"), //For each graph number
        elements2 = document.querySelectorAll(".wNE31c > div > span"), //For each bottom number
        targetElements = [], //Creates a new array
        count = 0; //Create a new counter
    for (let i = 0; i < elements1.length; i++) { //For each graph number
      targetElements.push(elements1[i]), count++; //Add to the array and increase the counter
      if (44 === count) { //if counter is = 44
        let result = ""; ///Create a new blank variable
        for (let j = 0; j < targetElements.length; j++) "" !== targetElements[j].textContent.trim() && (result !== "" && (result += "⬩"), result += targetElements[j].textContent);
        for (let j = 1; j < targetElements.length; j++) "" !== targetElements[j].textContent.trim() && (targetElements[j - 1].textContent += "⬩" + targetElements[j].textContent);
        break; //Stop the loop
      } //Finishes the if condition
    } //Finishes the for loop
    targetElements = []; //Reset the array
    count = 0; //Reset the counter
    for (let i = 0; i < elements2.length; i++) { //For each bottom number
      targetElements.push(elements2[i]), count++; //Add to the array and increase the counter
      if (32 === count) { //if counter is = 32
        let result = ""; ///Create a new blank variable
        for (let j = 0; j < targetElements.length; j++) "" !== targetElements[j].textContent.trim() && (result !== "" && (result += "⬩"), result += targetElements[j].textContent);
        for (let j = 1; j < targetElements.length; j++) "" !== targetElements[j].textContent.trim() && (targetElements[j - 1].textContent += "⬩" + targetElements[j].textContent);
        break; //Stop the loop
      } //Finishes the if condition
    } //Finishes the for loop

    document.querySelectorAll('.wNE31c').forEach(div => { div.innerHTML = div.innerHTML.replace(/°/g, '');}); //Remove the ° symbol
  }

  setTimeout(() => { ShowCF(); }, 1200); //Calls the ShowCF function

  if (navigator.userAgentData.mobile === true) //If it's a mobile device
  { //Starts the if condition
    new MutationObserver(async function() { //When the weather bar is scrolled
      await ShowCF(); //Calls the ShowCF function
    }).observe(document.querySelector("#wob_sh"), { //Defines the element and the characteristics to be observed
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,

      childList: true,
      subtree: true
    }); //Finishes the definitions to be observed
  } //Finishes the if condition
})();