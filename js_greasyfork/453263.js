// ==UserScript==
// @name        Ammo-Bar Mod | Shell Shockers | flygOn LiTe
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds an ammo bar to the Shell Shockers game UI
// @author       flygOn LiTe
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @icon         https://www.berrywidgets.com/assets/health-bar2.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453263/Ammo-Bar%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.user.js
// @updateURL https://update.greasyfork.org/scripts/453263/Ammo-Bar%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function injectScriptAndStyles() {
    const scriptContent = `(${main.toString()})();`;
    const scriptElement = document.createElement("script");
    scriptElement.textContent = scriptContent;
    document.body.appendChild(scriptElement);

    const styleContent = `
      @keyframes shift-color {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}
.goal-container {
  width: 265px;
  height: 38px;
  border: 3px solid#bc5810;
  border-radius: 12px;
  position: relative;
  margin: 8px 0;
  padding: 2px;
  background: #bc5810;
  z-index: 0;
}
.goal-bar {
  overflow: hidden;
  transition: 750ms width;
  background-image: linear-gradient(
    90deg,
    rgba(105, 6, 255, 1) 0%,
    rgba(0, 252, 228, 1) 100%
  );
  background-size: 400%;
  animation: shift-color 3s infinite alternate;
  height: 100%;
  border-radius: 12px;
  z-index: 1;
}
#weaponBox {
  position: absolute;
  right: 42% !important;
  bottom: 12% !important;
  text-align: center !important;
  z-index: 9 !important;
  background-image: url("https://www.berrybroscrypto.com/images/healthbar-animation.gif") !important;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
#ammo {
  position: relative;
  color: #d4a537 !important;
  font-size: 0.9em !important;
  font-family: snicker, sans-serif !important;
  font-weight: 700;
  transform: translateY(40px) !important;
  font-style: normal;
  font-weight: bold;
  background-image: none !important;
  text-align: center !important;
  z-index: 10 !important;
}
#grenades {
  padding-bottom: 0px;
  margin-bottom: 0;
  transform: translateY(20px) !important;
}

#grenades img {
  width: 50px !important;
  height: 50px !important;
}
    `;
    const styleElement = document.createElement("style");
    styleElement.textContent = styleContent;
    document.head.appendChild(styleElement);
  }

  function main() {
    //DEVELOPED AND MAINTAINED BY FLYGON LITE
//THIS CODE IS NOT OBFUSCATED, PLEASE DO NOT REPORT, THANK YOU ENJOY :)
//FOR QUESTIONS OR BUG FIXES CONTACT ON DISCORD- LiTe#1241

//Set ammo based on weapon class
let ammoTotal;
function setAmmoAmount() {
  let playerClass = vueData.classIdx;
  switch (playerClass) {
    case 0:
      ammoTotal = 240;
      break;
    case 1:
      ammoTotal = 24;
      break;
    case 2:
      ammoTotal = 60;
      break;
    case 3:
      ammoTotal = 3;
      break;
    case 4:
      ammoTotal = 200;
      break;
    case 5:
      ammoTotal = 20;
      break;
    case 6:
      ammoTotal = 150;
      break;
    default:
      ammoTotal = 60;
  }
    return playerClass;
}
setAmmoAmount();

//Check weapon class
function handlePauseChange() {
  if (vueData.isPaused === true) {
    setAmmoAmount();
  }
}
// Create a proxy for vueData
const vueDataProxy = new Proxy(vueData, {
  set(target, property, value) {
    target[property] = value;
    if (property === 'isPaused') {
      handlePauseChange();
    }
    return true;
  },
});

// Replace the original vueData object with the proxy
window.vueData = vueDataProxy;


//Selectors
let honeyBucket = document.querySelector("#weaponBox");
let explosiveDiarrhea = document.querySelector("#ammo");

//Create bar
let goalContainer = document.createElement("div");
goalContainer.classList.add("goal-container");
honeyBucket.appendChild(goalContainer);
let goalFill = document.createElement("div");
goalFill.classList.add("goal-bar");
goalContainer.appendChild(goalFill);

//Watch ammo and do stuff
var observeAmmo = new MutationObserver((mutations) => {
  mutations.forEach((record) => {
    if (
      record.addedNodes.length === 1 &&
      record.addedNodes[0].nodeType === Node.TEXT_NODE &&
      record.removedNodes.length === 1 &&
      record.removedNodes[0].nodeType === Node.TEXT_NODE
    ) {
      let getAmmoStr = record.addedNodes[0].nodeValue;
      let modifiedAmmoStr = getAmmoStr.substring(
        getAmmoStr.lastIndexOf("/") + 1
      );
        console.log('modifiedAmmoStr:', modifiedAmmoStr); // added console.log
console.log('ammoTotal:', ammoTotal); // added console.log
      let ammoPercentage = (Number(modifiedAmmoStr) / ammoTotal) * 100;
        console.log('ammoPercentage:', ammoPercentage); // added console.log
         console.log("player class: " + setAmmoAmount());
      goalFill.style.setProperty("width", ammoPercentage + "%");
    }
  });
});
observeAmmo.observe(explosiveDiarrhea, {
  childList: true,
});


  }

  // Check if the necessary DOM elements are available
  function checkDOMElements() {
    const weaponBox = document.querySelector("#weaponBox");
    const ammoElement = document.querySelector("#ammo");
    return weaponBox !== null && ammoElement !== null;
  }

  // Wait for the necessary DOM elements to be loaded before injecting the script and styles
  function waitForDOMElements() {
    if (checkDOMElements()) {
      injectScriptAndStyles();
    } else {
      setTimeout(waitForDOMElements, 100);
    }
  }

  waitForDOMElements();
})();
