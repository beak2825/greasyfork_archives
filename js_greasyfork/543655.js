// ==UserScript==
// @name         DonaldCoin Automation
// @namespace    https://donaldco.in
// @version      1.8
// @description  DonaldCoin Full Auto Claim / Explore Soon
// @author       Rubystance
// @license      MIT
// @match        https://donaldco.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543655/DonaldCoin%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/543655/DonaldCoin%20Automation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clickIfExists = (selector) => {
    const el = document.querySelector(selector);
    if (el) el.click();
  };

  const tryClickByImgSrc = (srcContains) => {
    const imgs = [...document.querySelectorAll('img')];
    const match = imgs.find((img) => img.src.includes(srcContains));
    if (match) match.click();
  };

  const goBack = () => {
    tryClickByImgSrc('templates/aurblue/images/back.png');
  };

  async function main() {
    const now = Date.now();
    const lastWork = +localStorage.getItem('dc_lastWork') || 0;
    const lastCollect = +localStorage.getItem('dc_lastCollect') || 0;

    setTimeout(() => location.reload(), 60 * 1000);

    clickIfExists('a[href*="view=account&ac=daily-gift"]');

    await delay(500);
    tryClickByImgSrc('images/member/gift2.png');

    await delay(500);
    const selectedImg = document.getElementById('selectedimg2');
    if (selectedImg) selectedImg.click();

    await delay(500);
    goBack();

    await delay(500);
    clickIfExists('a[href*="view=account&ac=btc-kickboys"]');

    await delay(500);
    goBack();

    await delay(500);
    clickIfExists('a[href*="view=account&ac=btc-coinbonus"]');

    await delay(500);
    goBack();

    if (now - lastWork > 20 * 60 * 1000) {
      const workBtn = document.querySelector('a[href*="action=work"]');
      if (workBtn) {
        workBtn.click();
        localStorage.setItem('dc_lastWork', now);
        return;
      }
    }

    if (now - lastCollect > 30 * 60 * 1000) {
      const collectBtn = document.querySelector('a[href*="ac=btc-collect"]');
      if (collectBtn) {
        collectBtn.click();
        localStorage.setItem('dc_lastCollect', now);
        return;
      }
    }

    await delay(10000);
    const profileLink = document.querySelector('a[href="index.php?view=account&ac=btc-profile"]');
    if (profileLink) profileLink.click();
  }

  window.addEventListener('load', () => {
    setTimeout(main, 5000);
  });
})();
