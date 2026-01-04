// ==UserScript==
// @name        Health-Bar Mod | Shell Shockers | flygOn LiTe
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a health bar to the Shell Shockers game UI with sound FX
// @author       flygOn LiTe
// @match        https://shellshock.io/*
// @match        https://mathactivity.xyz/*
// @match        https://mathdrills.life/*
// @icon         https://www.berrywidgets.com/assets/health-bar2.png
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453253/Health-Bar%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.user.js
// @updateURL https://update.greasyfork.org/scripts/453253/Health-Bar%20Mod%20%7C%20Shell%20Shockers%20%7C%20flygOn%20LiTe.meta.js
// ==/UserScript==
(function () {
  'use strict';

  // Add the CSS styles
  const css = `
  @import url("https://use.typekit.net/ega2xty.css");

@keyframes svg-shift {
  0% {
    fill: #6a00ff;
  }
  100% {
    fill: #03fcf0;
  }
}

@keyframes svg-shift-two {
  0% {
    fill: #ff0000;
  }
  100% {
    fill: #990000;
  }
}
.cls-2 {
  fill: #bc5810;
}
.cls-3 {
  fill: #bc5810;
  transform: translate(-40%, -20%);
}
.cls-4 {
  transform: translate(-40%, -20%);
  opacity: 0.4;
  fill: #f5feff;
  mix-blend-mode: screen;
}
.cls-5 {
  transform: translate(-40%, -20%);
  opacity: 0.4;
  mix-blend-mode: overlay;
}
.cls-6 {
  fill: url(#linear-gradient);
}
.fill-overlay {
  fill: #f5feff;
  opacity: 0.3;
}
.fill {
  transition: width 1.5s ease, fill 1s ease;
  animation: svg-shift 3s infinite alternate;
}
#healthContainer {
  position: absolute;
  left: 40% !important;
  bottom: 1em;
  transform: translateY(5%) !important;
  display: inline-block;
  width: 600px;
  height: 100px;
  background: transparent !important;
  text-align: center !important;
  font-size: 1.2em !important;
}

#healthHp {
  font-family: snicker, sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #d4a537;
  font-size: 1em !important;
  transform: translateY(60px) !important;
  text-shadow: 2px 2px 2px black;
  text-align: center !important;
}
.healthBar {
  display: none !important;
}
.healthYolk {
  display: none !important;
}

.healthSvg {
  display: none !important;
}
  `;
  GM_addStyle(css);

  // Add the health bar creation script
  const addHealthBarScript = () => {
    // Wait for the healthContainer element to exist
    function waitForHealthContainer() {
      const healthContainer = document.getElementById("healthContainer");
      if (healthContainer) {
        createHealthBar(healthContainer);
      } else {
        setTimeout(waitForHealthContainer, 100);
      }
    }

    waitForHealthContainer();
  };

  function createHealthBar(healthContainer) {
  //DEVELOPED AND MAINTAINED BY FLYGON LITE
//THIS CODE IS NOT OBFUSCATED, PLEASE DO NOT REPORT, TY ENJOY :)
//FOR QUESTIONS OR BUG FIXES CONTACT ON DISCORD- LiTe#1241


var svgns = "http://www.w3.org/2000/svg";
var svg = document.createElementNS(svgns, "svg");
var pokeGym = document.createElementNS(svgns, "rect");
var pokeBall = document.createElementNS(svgns, "path");
var greatBall = document.createElementNS(svgns, "path");
var ultraBall = document.createElementNS(svgns, "path");
var masterBall = document.createElementNS(svgns, "rect");
var fillOverlay = document.createElementNS(svgns, "rect");

svg.setAttribute("aria-hidden", "true");
svg.setAttribute("viewbox", "0 0 530 80");
svg.setAttribute("width", "530px");
svg.setAttribute("height", "76px");

pokeGym.setAttribute("width", "530px");
pokeGym.setAttribute("height", "76px");
pokeGym.setAttribute("y", "3");
pokeGym.setAttribute("rx", "30.08");
pokeGym.classList.add("cls-2");

pokeBall.setAttribute(
  "d",
  "M1055.8,388a15.09,15.09,0,0,1,15.08,15.08v15.84A15.09,15.09,0,0,1,1055.8,434H586a15.09,15.09,0,0,1-15.08-15.08V403.08A15.09,15.09,0,0,1,586,388H1055.8m0-15H586a30.17,30.17,0,0,0-30.08,30.08v15.84A30.17,30.17,0,0,0,586,449H1055.8a30.17,30.17,0,0,0,30.08-30.08V403.08A30.17,30.17,0,0,0,1055.8,373Z"
);
pokeBall.classList.add("cls-3");

greatBall.setAttribute(
  "d",
  "M1055.8,371H586a30.17,30.17,0,0,0-30.08,30.08v5A30.17,30.17,0,0,1,586,376H1055.8a30.17,30.17,0,0,1,30.08,30.08v-5A30.17,30.17,0,0,0,1055.8,371Z"
);
greatBall.classList.add("cls-4");

ultraBall.setAttribute(
  "d",
  "M1055.8,445H586a30.17,30.17,0,0,1-30.08-30.08v6A30.17,30.17,0,0,0,586,451H1055.8a30.17,30.17,0,0,0,30.08-30.08v-6A30.17,30.17,0,0,1,1055.8,445Z"
);
ultraBall.classList.add("cls-5");

masterBall.setAttribute("width", "500px");
masterBall.setAttribute("height", "46px");
masterBall.setAttribute("y", "19");
masterBall.setAttribute("x", "15");
masterBall.setAttribute("rx", "15.08");
masterBall.classList.add("fill", "cls-6");

fillOverlay.setAttribute("width", "500px");
fillOverlay.setAttribute("height", "46px");
fillOverlay.setAttribute("y", "19");
fillOverlay.setAttribute("x", "15");
fillOverlay.setAttribute("rx", "15.08");
fillOverlay.classList.add("fill-overlay");

svg.appendChild(pokeGym);
svg.appendChild(pokeBall);
svg.appendChild(greatBall);
svg.appendChild(ultraBall);
svg.appendChild(masterBall);
svg.appendChild(fillOverlay);
healthContainer.appendChild(svg);

var healthGain = new Audio();
healthGain.src = "https://berrybroscrypto.com/images/healthgain.mp3";
var lowHealth = new Audio();
lowHealth.src = "https://berrybroscrypto.com/images/lowhealth.mp3";
lowHealth.loop = false;

var healthNode = document.getElementById("healthHp");
var healthObserver = new MutationObserver((mutations) => {
  mutations.forEach((record) => {
    if (
      record.addedNodes.length === 1 &&
      record.addedNodes[0].nodeType === Node.TEXT_NODE &&
      record.removedNodes.length === 1 &&
      record.removedNodes[0].nodeType === Node.TEXT_NODE
    ) {
      var myHealth = Number(healthNode.textContent);
      masterBall.style.setProperty("width", myHealth + "%");
      if (
        Number(record.removedNodes[0].nodeValue) < 30 &&
        Number(record.removedNodes[0].nodeValue) > 0
      ) {
        masterBall.style.setProperty(
          "animation",
          "svg-shift-two 1s infinite alternate"
        );
        lowHealth.play();
      } else {
        masterBall.style.setProperty(
          "animation",
          "svg-shift 3s infinite alternate"
        );
      }
      if (record.removedNodes[0].nodeValue === "100") {
        masterBall.style.setProperty("width", 94.5 + "%");
      }
      if (
        Number(record.removedNodes[0].nodeValue) === 40 &&
        Number(record.addedNodes[0].nodeValue) === 41
      ) {
        healthGain.play();
        masterBall.style.setProperty("transition", "width .1s");
        setTimeout(() => {
          masterBall.style.setProperty("transition", "width 1s");
        }, 3000);
      }
    }
  });
});
healthObserver.observe(healthNode, {
  childList: true,
});
  }

  document.body ? addHealthBarScript() : document.addEventListener("DOMContentLoaded", e => addHealthBarScript());
})();
