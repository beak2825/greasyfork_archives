// ==UserScript==
// @name         G-Ads auto dismiss
// @namespace    http://tampermonkey.net/
// @version      2024-07-24-1
// @description  Auto dismiss google ads recommendations
// @author       paradox8599
// @match        https://ads.google.com/aw/recommendations*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501635/G-Ads%20auto%20dismiss.user.js
// @updateURL https://update.greasyfork.org/scripts/501635/G-Ads%20auto%20dismiss.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function wait_for(root, query) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const el = root.querySelector(query);
      if (el) {
        clearInterval(interval);
        resolve(el);
      }
    }, 50);
  });
}

async function wait_for_all(root, query) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const els = root.querySelectorAll(query);
      if (els.length) {
        clearInterval(interval);
        resolve([...els]);
      }
    }, 50);
  });
}

function click_menu(card) {
  // const buttons = await wait_for_all(card, "material-button");
  const buttons = [...card.querySelectorAll("material-button")];
  const btn = buttons.find((el) => el.ariaLabel === "Overflow menu");
  btn?.click();
}

function click_dismiss(card) {
  // const options = await wait_for_all(card, "material-list-item");
  const options = [...card.querySelectorAll("material-list-item")];
  const opt = options.find((e) => e.textContent === "Dismiss all");
  opt?.click();
}

async function confirm_dismiss() {
  const dialog = await wait_for(document, "dismiss-all-dialog");
  // const dialog = document.querySelector("dismiss-all-dialog");
  const buttons = [...dialog.querySelectorAll("material-button")];
  const btn = buttons.find((e) => ["dismiss", "dismiss all"].includes(e.textContent.toLowerCase()));
  btn.click();
}

async function dismiss(card) {
  click_menu(card);
  click_dismiss(card);
  await confirm_dismiss();
}

async function wait_until_cards(timeout = 10 * 1000) {
  const start = Date.now();
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const cards = document.querySelectorAll("card");
      if (cards.length) {
        clearInterval(interval);
        resolve(true);
      }
      if (Date.now() - start > timeout) {
        clearInterval(interval);
        resolve(false);
      }
    }, 50);
  });
}


async function main() {
  const hasCards = await wait_until_cards();
  while (hasCards) {
    const card = document.querySelector("card");
    if (!card) return;
    await dismiss(card);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

function start() {
  const b = document.createElement("button");
  b.id = "auto_dismiss";
  b.textContent = "Auto Dismiss All";
  b.addEventListener("click", main);
  b.style = "position: fixed; bottom: 20px; left:20px; border: 1px solid blue margin: 10px; z-index: 9999;";
  document.body.appendChild(b);
}

start();

})();