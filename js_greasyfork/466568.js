// ==UserScript==
// @name         Cookie Clicker Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates clicking on the cookie, golden cookies, and buying upgrades in Cookie Clicker.
// @author       ViridityFrog712
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466568/Cookie%20Clicker%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/466568/Cookie%20Clicker%20Automation.meta.js
// ==/UserScript==

/*
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this script and associated documentation files (the "Script"), to deal in the Script without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Script, and to permit persons to whom the Script is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Script.

THE SCRIPT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SCRIPT OR THE USE OR OTHER DEALINGS IN THE SCRIPT.
*/

let intervalId;

function clickCookie() {
  const cookie = document.getElementById('bigCookie');
  if (cookie) {
    cookie.click();
  }
}

function clickGoldenCookie() {
  const goldenCookie = document.getElementById('goldenCookie');
  if (goldenCookie) {
    goldenCookie.click();
  }
}

function buyUpgrades() {
  const upgrades = document.getElementsByClassName('crate upgrade enabled');
  for (let i = 0; i < upgrades.length; i++) {
    upgrades[i].click();
  }
}

function buyItems() {
  const items = document.getElementsByClassName('product unlocked enabled');
  for (let i = 0; i < items.length; i++) {
    items[i].click();
  }
}

function startAutomation() {
  if (!intervalId) {
    intervalId = setInterval(() => {
      clickCookie();
      clickGoldenCookie();
      buyUpgrades();
      buyItems();
    }, 20); // Adjust the interval (in milliseconds) to make it faster or slower
  }
}

function stopAutomation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'p') {
    startAutomation();
  } else if (event.key === 'o') {
    stopAutomation();
  }
});
