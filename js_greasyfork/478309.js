// ==UserScript==
// @name         Inquest - Chain warning
// @description  Shows a visual chain warning (Fading background and shaking screen) when chain timer runs below specific threshold
// @version      2.2.3
// @author       Fruity [2259700] | Francois Robbertze
// @namespace    https://greasyfork.org/en/users/1156949
// @copyright    none
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478309/Inquest%20-%20Chain%20warning.user.js
// @updateURL https://update.greasyfork.org/scripts/478309/Inquest%20-%20Chain%20warning.meta.js
// ==/UserScript==

/**
 * NOTE: This extension will not work on mobile as of yet
 * The reason for this is that mobile view does not expose an html element
 * that I can use to pull values from such as the current timer and chain count
 */

/**
 * INFO:
 * Editing the below min (Minutes) and sec (Seconds) will change the time at which the alarm triggers
 * for example:
 * {
 *  chain_size: 10,
 *  minutes: 2,
 *  seconds: 30,
 * };
 * Setting the above values will trigger the warning when the chain is bigger than 10 and the timer runs below 2:30
 */
const OPTS = {
  chain_size: 10,
  minutes: 2,
  seconds: 30,
};

// WARN: DO NOT EDIT THESE VALUES
const CONTENT = ".content"; // Torn content base div element
const CHAIN_TIMER = ".bar-timeleft___B9RGV"; // chain timer element name
const CHAIN_COUNT = ".bar-value___uxnah"; // chain status element name (current chain count)
const SHAKE_SCREEN = "shakeScreen"; //CSS class name
const FADE_COLOR = "100,0,0"; //rgb values for the warning color
const ALARM = new Audio(
  "https://eu-central.storage.cloudconvert.com/tasks/39fd4c74-7a2f-4b0d-943a-6459520dd488/mixkit-classic-alarm-995.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=cloudconvert-production%2F20231029%2Ffra%2Fs3%2Faws4_request&X-Amz-Date=20231029T084541Z&X-Amz-Expires=86400&X-Amz-Signature=fb8e6d0dab13d009e32690b6c062ec2e7a9f71ad0f00e1d040ab4ae127b3fc17&X-Amz-SignedHeaders=host&response-content-disposition=inline%3B%20filename%3D%22mixkit-classic-alarm-995.mp3%22&response-content-type=audio%2Fmpeg&x-id=GetObject",
);
const CHAIN_VALUES = [
  "10",
  "25",
  "50",
  "100",
  "250",
  "500",
  "1k",
  "2.5k",
  "5k",
  "10k",
  "25k",
  "50k",
  "100k",
];

// Adds the styles to the head of the document
const createElement = () => {
  const css = `
.${SHAKE_SCREEN} {
  animation: tilt-shaking-color 0.5s infinite;
  transition: background-color 0.2s ease-in-out;
}

@keyframes tilt-shaking-color {
  0% { background-color: rgba(0,0,0,0); }
  50% { background-color: rgba(${FADE_COLOR},0.4); }
  100% { background-color: rgba(0,0,0,0);}
}
`;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");

  head.appendChild(style);

  if (style.styleSheet) style.styleSheet.cssText = css;
  else style.appendChild(document.createTextNode(css));
};

(() => {
  "use strict";
  createElement();

  let div, timer, count;
  const fetchElements = () => {
    div = document.querySelector(CONTENT);
    timer = document.querySelector(CHAIN_TIMER);
    count = document.querySelector(CHAIN_COUNT);
  };
  fetchElements();

  const validChain = () => {
    const tparts = count.textContent.trim().split('/');
    if (tparts.length !== 2) return false;

    const [score, bonus] = tparts;
    if (CHAIN_VALUES.includes(bonus) && Number.parseInt(score) >= OPTS.chain_size) {
        return true;
    }
    return false;
  };

  const validTimer = () => {
    const tval = timer.textContent.trim();
    const tparts = tval.split(":");
    if (tparts.length !== 2) return false;

    const min = parseInt(tparts[0]);
    const sec = parseInt(tparts[1]);
    if (min===0 && sec===0) return false;
    if (min < OPTS.minutes || (min === OPTS.minutes && sec < OPTS.seconds)) {
      return true;
    }
    return false;
  };

  const playAlarm = () => {
    ALARM.play();
  };

  // Sets or destroys warning class to the base element
  const shakeScreen = () => {
    if (validTimer()) {
      playAlarm();
      if (div.classList.contains(SHAKE_SCREEN)) return;
      return div.classList.add(SHAKE_SCREEN);
    }
    div.classList.remove(SHAKE_SCREEN);
  };

  // Runs Shakescreen if the div and timer element exists
  const run = () => {
    if (!div || !timer) return fetchElements();
    if (validChain()) {
      shakeScreen();
    }
  };

  // Runs every second
  setInterval(run, 1000);
})();