// ==UserScript==
// @name         SecureMyPass Multi-Login + Export (bare bones, with pauses) — double pre-click
// @namespace    local.securemypass.simple
// @version      1.0.1
// @description  Loops accounts: login -> (double click submit) -> type password -> go to My Links -> click Export -> back to login. Adds pauses between each action.
// @match        https://securemypass.com/*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546418/SecureMyPass%20Multi-Login%20%2B%20Export%20%28bare%20bones%2C%20with%20pauses%29%20%E2%80%94%20double%20pre-click.user.js
// @updateURL https://update.greasyfork.org/scripts/546418/SecureMyPass%20Multi-Login%20%2B%20Export%20%28bare%20bones%2C%20with%20pauses%29%20%E2%80%94%20double%20pre-click.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---- CONFIG ----
  const LOGIN_URL = 'https://securemypass.com/login';
  const LINKS_URL = 'https://securemypass.com/my-links';
  const DELAY_MS  = 1200;   // general pause between actions
  const BETWEEN_CLICKS_MS = 500; // pause between the two pre-clicks

  // ---- Helpers ----
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function waitForXPath(xpath, timeoutMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (el) return el;
      await sleep(150);
    }
    throw new Error('Timeout waiting for XPath: ' + xpath);
  }

  async function typeByXPath(xpath, text) {
    const el = await waitForXPath(xpath);
    el.focus();
    await sleep(50);
    el.value = '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(50);
    el.value = text;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.dispatchEvent(new Event('blur', { bubbles: true }));
    await sleep(DELAY_MS);
  }

  async function clickByXPath(xpath) {
    const el = await waitForXPath(xpath);
    el.scrollIntoView({ block: 'center' });
    el.click();
    // extra dispatch to satisfy React listeners
    el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await sleep(DELAY_MS);
  }

  async function doubleClickSubmitBeforePassword() {
    const submitXp = '//*[@id="root"]/div[1]/main/div/div/div/div/div[1]/div/form/div[2]/button';
    const btn = await waitForXPath(submitXp);
    btn.scrollIntoView({ block: 'center' });

    // First click
    btn.click();
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await sleep(BETWEEN_CLICKS_MS);

    // Second click
    btn.click();
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    await sleep(DELAY_MS);
  }

  // ---- Main flow per account ----
  async function runForAccount({ username, password }) {
    // Ensure we’re on the login page
    if (!location.href.startsWith(LOGIN_URL)) {
      location.href = LOGIN_URL;
      await sleep(DELAY_MS + 1200);
    }

    // Step 1: Enter Username
    await typeByXPath('//*[@id="loginUsername"]', username);

    // Step 2: NEW — click the submit/continue button TWICE with a brief pause
    await doubleClickSubmitBeforePassword();

    // Step 3: Enter Password (after the page reveals password field)
    await typeByXPath('//*[@id="loginPassword"]', password);

    // Step 4: Click submit once to log in
    await clickByXPath('//*[@id="root"]/div[1]/main/div/div/div/div/div[1]/div/form/div[2]/button');

    // Step 5: Go to My Links
    location.href = LINKS_URL;
    await sleep(DELAY_MS + 1500);

    // Step 6: Click Export button (kept your XPath; swap if dynamic)
    await clickByXPath('//*[@id=":r3s:"]');

    // Allow download to begin
    await sleep(DELAY_MS + 1000);

    // Step 7: Back to login for next account
    location.href = LOGIN_URL;
    await sleep(DELAY_MS + 1200);
  }

  // ---- Prompt UI ----
  async function init() {
    if (window.__SMP_MULTI_EXPORT_RUNNING__) return;
    window.__SMP_MULTI_EXPORT_RUNNING__ = true;

    const nStr = prompt('Number of accounts to process?');
    if (!nStr) return;
    const n = Math.max(0, parseInt(nStr, 10) || 0);
    if (n <= 0) return;

    const accounts = [];
    for (let i = 0; i < n; i++) {
      const user = prompt(`Username for account #${i + 1}:`);
      if (user === null) return;
      const pass = prompt(`Password for account #${i + 1}:`);
      if (pass === null) return;
      accounts.push({ username: user.trim(), password: pass });
    }

    for (let i = 0; i < accounts.length; i++) {
      console.log(`[SMP] Starting account ${i + 1}/${accounts.length}: ${accounts[i].username}`);
      try {
        await runForAccount(accounts[i]);
        console.log(`[SMP] Finished account ${i + 1}`);
        await sleep(DELAY_MS + 800);
      } catch (err) {
        console.error(`[SMP] Error on account ${i + 1}:`, err);
      }
    }

    console.log('[SMP] All done.');
    window.__SMP_MULTI_EXPORT_RUNNING__ = false;
  }

  setTimeout(init, 800);
})();