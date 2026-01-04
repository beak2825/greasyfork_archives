// ==UserScript==
// @name         Animate Triple and Highlight Letters for Autodarts
// @version      0.3
// @description  SLAM that Triple down and make it shine, also makes the letters have an outline to better distinguish them from the numbers
// @author       Dotty
// @match        *://play.autodarts.io/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/913506-dotty-dev
// @downloadURL https://update.greasyfork.org/scripts/498035/Animate%20Triple%20and%20Highlight%20Letters%20for%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/498035/Animate%20Triple%20and%20Highlight%20Letters%20for%20Autodarts.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function injectCSS() {
    const css = /*css*/ `

.triple:not(.suggestion.triple) {
  -webkit-mask:linear-gradient(-60deg,#000 30%,#0005,#000 70%) right/300% 100%;
  background-repeat: no-repeat;
  animation: shimmer 3s infinite, rattle 0.5s;
  animation-delay: 1s;
  overflow: visible;
}

.triple p:not(.suggestion.triple p) {
  animation: slam 1s;
  animation-timing-function: ease-in;
  font-weight: 900 !important;
}

@keyframes shimmer {
  100% {-webkit-mask-position:left}
}

@keyframes slam
{
  0%
  {
    transform: scale(10, 10);
    opacity: 0;
  }

  40%
  {
    opacity: 0;
  }

  100%
  {
    transform: scale(1, 1);
    opacity: 1;
  }
}

@keyframes rattle
{
  0% { margin-top: 0; margin-left: 0; }
  10% { margin-top: -5px; margin-left: 0; }
  20% { margin-top: 0; margin-left: -5px; }
  30% { margin-top: 5px; margin-left: 0; }
  40% { margin-top: 0; margin-left: 5px; }
  50% { margin-top: -2px; margin-left: 0; }
  60% { margin-top: 0; margin-left: -2px; }
  70% { margin-top: 2px; margin-left: 0; }
  80% { margin-top: 0; margin-left: 2px; }
  90% { margin-top: -1px; margin-left: 0; }
  100% { margin-top: 0; margin-left: 0; }
}


.outline {
  color: currentColor;
  -webkit-text-stroke: currentColor 2px;
  -webkit-text-fill-color: transparent;
  text-stroke: currentColor 2px;
  text-fill-color: transparent;
}

        `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function higlighter(target) {
    console.log("called higlighter");
    const toHighlight = [
      "T20",
      "T19",
      "T18",
      "T17",
      "T16",
      "T15",
      "25",
      "BULL",
    ];
    const pElement = target.querySelector("p.chakra-text");
    if (toHighlight.includes(pElement.textContent)) {
      if (target && !target.classList.contains("triple")) {
        target.classList.add("triple");
      }
    }
  }

  function outlineLetter(target) {
    console.log("called outline");
    if (!target.innerHTML.includes('<span class="outline">')) {
      const updatedHTML = target.textContent.replace(
        /([TDSM])/,
        '<span class="outline">$1</span>'
      );
      target.innerHTML = updatedHTML;
    }
  }

  function outlineAndHighlight() {
    Array.from(document.querySelectorAll(".ad-ext-turn-throw p.chakra-text"))
      .filter((el) => !el.querySelector(".outline"))
      .forEach((el) => outlineLetter(el));
    Array.from(document
      .querySelectorAll(".suggestion p.chakra-text"))
      .filter((el) => !el.querySelector(".outline"))
      .forEach((el) => outlineLetter(el));
    document
      .querySelectorAll(".ad-ext-turn-throw:not(.triple)")
      .forEach((el) => higlighter(el));
  }

  window.onload = () => {
    injectCSS();
    setInterval(outlineAndHighlight, 50);
  };
})();
