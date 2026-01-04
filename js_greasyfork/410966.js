// ==UserScript==
// @name         Mousehunt – Lucky Golden Shield Duration Indicator & Warning
// @namespace    fabulous.cupcake.jp.net
// @version      2020.09.08.1
// @description  Directly show LGS duration remaining and warns when it's near expiry
// @author       FabulousCupcake
// @include      http://mousehuntgame.com/*
// @include      https://mousehuntgame.com/*
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/410966/Mousehunt%20%E2%80%93%20Lucky%20Golden%20Shield%20Duration%20Indicator%20%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/410966/Mousehunt%20%E2%80%93%20Lucky%20Golden%20Shield%20Duration%20Indicator%20%20Warning.meta.js
// ==/UserScript==

const WARNING_THRESHOLD = 60 * 60 * 24 * 2;

// ---------------------------------

const stylesheet = `

.shieldDurationText {
  position: absolute;
  bottom: 0;
  left: 0;

  display: inline-block;
  width: 135px;
  padding: 4px;
  box-sizing: border-box;
  pointer-events: none;

  color: white;
  text-shadow: 0 0 3px yellow;
  text-align: center;
  opacity: 1;
}

.shieldDurationText[data-near-expiry="true"] {
  color: red;
  text-shadow: 0 0 3px white, 0 0 3px white;
  font-weight: bold;
}

`;

// ---------------------------------

const injectStylesheet = () => {
    var stylesheetEl = document.createElement("style");
    stylesheetEl.innerHTML = stylesheet;
    document.body.appendChild(stylesheetEl);
}

const isIngame = () => {
  return unsafeWindow.appname === "MouseHunt";
}

const isExpired = () => {
  const goldenShieldEl = document.querySelector(".mousehuntHud-shield.golden");
  if (!!goldenShieldEl) return false;

  alert("Golden Shield Expired!");
  return true;
}

const isNearExpiry = () => {
  return unsafeWindow.user.shield_seconds < WARNING_THRESHOLD;
}

const getDurationText = () => {
  const durationText = document.querySelector(".mousehuntHud-shield.golden").title.split(":")[1].trim();
  const shortenWords = fullText => {
    return fullText
    .replaceAll(/[a-zA-Z]+/g, text => text.substr(0,1))
    .replaceAll(/\d+ \w/g, text => text.replace(" ", ""));
  };

  return shortenWords(durationText);
}

const showDurationText = text => {
  injectStylesheet();

  const shieldEl = document.querySelector(".mousehuntHud-shield");
  const insertEl = `<span class="shieldDurationText" data-near-expiry="${isNearExpiry()}">${text}</span>`;

  shieldEl.insertAdjacentHTML("afterend", insertEl);
}

const main = () => {
  if (!isIngame()) return;
  if (isExpired()) return;

  const durationText = getDurationText();
  showDurationText(durationText);
}

main();