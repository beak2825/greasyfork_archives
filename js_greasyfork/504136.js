// ==UserScript==
// @name         Twitch points
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  EZ money
// @author       rumpear
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504136/Twitch%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/504136/Twitch%20points.meta.js
// ==/UserScript==

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const POINTS_PER_CLICK = 50;
const BONUS_BUTTON_SELECTOR = 'button[aria-label="Claim Bonus"]';
const GRAPE_HEX_COLOR = '#6F2DA8';
const HIBISCUS_HEX_COLOR = '#B43577';
const THISTLE_HEX_COLOR = '#D7BDFC';

let intervalTime = 15 * SECOND;
let intervalId = null;
let counter = 0;

const getCurrentTime = () => {
  return new Date();
};

const logMessageWithColor = (message = '', color = THISTLE_HEX_COLOR) => {
  console.log(`%c${message}`, `color: ${color}`);
};

const logPointsAmount = () => {
  const message = `you earned ${counter * POINTS_PER_CLICK} points: ${getCurrentTime()}`;
  logMessageWithColor(message, GRAPE_HEX_COLOR);
};

const handleBonusButtonClick = () => {
  const bonusButton = window.document.querySelector(BONUS_BUTTON_SELECTOR);

  if (bonusButton) {
    bonusButton.click();
    ++counter;
    logPointsAmount();
    clearInterval(intervalId);
    intervalTime = 15 * MINUTE;
    claimBonus();
  } else {
    const message = `button not found: ${getCurrentTime()}`;
    logMessageWithColor(message, HIBISCUS_HEX_COLOR);
  }
};

const claimBonus = () => {
  intervalId = setInterval(handleBonusButtonClick, intervalTime);
};

(function main() {
  logMessageWithColor('🫰TWITCH💰');
  claimBonus();
}());
