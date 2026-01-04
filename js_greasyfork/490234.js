// ==UserScript==
// @name         Infinite Coins
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  change the amount of your coins to troll other people!
// @author       Turbo
// @match        https://agma.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490234/Infinite%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/490234/Infinite%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';
var ischecked = false;
var checkbox = document.createElement('input');
checkbox.type = 'checkbox';
checkbox.id = 'myCheckbox';
checkbox.name = 'myCheckbox';
var label = document.createElement('label');
label.textContent = 'Press to get infinite coins!';
label.setAttribute('for', 'myCheckbox');
var settingTab3 = document.getElementById('userSettings');
settingTab3.appendChild(checkbox);
settingTab3.appendChild(label);
checkbox.addEventListener('change', function() {
  if (checkbox.checked) {
    console.log('Checkbox is checked. Set to true.');
    ischecked = true;
    var coinPrompt = window.prompt("How much coins do u want?\n Type a number below")
    var coinPromptNum = coinPrompt.value
    document.getElementById("coinsDash").textContent = coinPrompt;
    document.getElementById("coins").textContent = coinPrompt
    curserMsg(`Coins Applied!`, 'green')
  } else {
    console.log('Checkbox is not checked. Set to false.');
    ischecked = false;
    curserMsg(`Check the box again to change coins`, 'red')
  }
});
})();