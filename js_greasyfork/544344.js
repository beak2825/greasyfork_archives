// ==UserScript==
// @name         WheelOfGold Auto Claim LTC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto login, auto claim LTC and retry on fail.
// @author       Rubystance
// @license      MIT
// @match        https://wheelofgold.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544344/WheelOfGold%20Auto%20Claim%20LTC.user.js
// @updateURL https://update.greasyfork.org/scripts/544344/WheelOfGold%20Auto%20Claim%20LTC.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const email = 'YOUR_EMAIL_HERE';     // ← REPLACE WITH YOUR EMAIL
  const password = 'YOUR_PASSWORD_HERE';  // ← REPLACE WITH YOUR PASSWORD

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(interval);
          resolve(el);
        }
      }, 300);
      setTimeout(() => {
        clearInterval(interval);
        reject(new Error('Element not found: ' + selector));
      }, timeout);
    });
  }

  function waitForCaptchaSolved(timeout = 20000) {
    return new Promise((resolve) => {
      const check = () => {
        const token = document.querySelector('input[name="cf-turnstile-response"]');
        if (token && token.value.trim().length > 0) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      };
      setTimeout(resolve, timeout);
      check();
    });
  }

  function closeAdIfPresent() {
    const svgs = document.querySelectorAll('svg[viewBox="0 0 48 48"]');
    for (const svg of svgs) {
      if (svg.innerHTML.includes('M38 12.83L35.17 10 24 21.17')) {
        const btn = svg.closest('button');
        if (btn) {
          console.log('[WOG] Closing ad popup...');
          btn.click();
        }
      }
    }
  }

  function tryAgainIfPresent() {
    const tryAgainLink = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === 'Try Again');
    if (tryAgainLink) {
      console.log('[WOG] "Try Again" detected. Clicking...');
      tryAgainLink.click();
    }
  }

  async function onHomePage() {
    const loginBtn = document.querySelector('a[href="/auth/login"]');
    if (loginBtn) {
      console.log('[WOG] Clicking Login...');
      loginBtn.click();
    }
  }

  async function onLoginPage() {
    try {
      const emailInput = await waitForElement('#email');
      const passInput = await waitForElement('#password');

      emailInput.value = email;
      passInput.value = password;

      console.log('[WOG] Waiting for Turnstile captcha...');
      await waitForCaptchaSolved();

      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) {
        console.log('[WOG] Captcha solved. Logging in...');
        submitBtn.click();
      }
    } catch (e) {
      console.error('[WOG] Login error:', e);
    }
  }

  async function onDashboardPage() {
    const faucetLTC = document.querySelector('a[href="/faucet/currency/ltc"]');
    if (faucetLTC) {
      console.log('[WOG] Navigating to LTC Faucet...');
      faucetLTC.click();
    }
  }

  async function onFaucetPage() {
    console.log('[WOG] On LTC Faucet page. Waiting for captcha...');

    tryAgainIfPresent();
    closeAdIfPresent();

    await waitForCaptchaSolved(20000);
    closeAdIfPresent();
    tryAgainIfPresent();

    const claimBtn = Array.from(document.querySelectorAll('button'))
      .find(btn => btn.textContent.trim().includes('Claim Now'));

    if (claimBtn) {
      console.log('[WOG] Captcha solved. Clicking Claim Now...');
      claimBtn.click();

      setTimeout(() => {
        console.log('[WOG] Reloading to restart cycle...');
        location.href = 'https://wheelofgold.com/';
      }, 60000);
    } else {
      console.warn('[WOG] "Claim Now" button not found!');
    }
  }

  const url = location.href;

  if (url === 'https://wheelofgold.com/' || url === 'https://wheelofgold.com') {
    onHomePage();
  } else if (url.includes('/auth/login')) {
    onLoginPage();
  } else if (url.includes('/dashboard')) {
    onDashboardPage();
  } else if (url.includes('/faucet/currency/ltc')) {
    onFaucetPage();
  }

})();
