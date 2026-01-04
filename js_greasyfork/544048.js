// ==UserScript==
// @name         DogeKing.io - Auto Login + Free DOGE Spin
// @namespace    https://dogeking.io/
// @version      1.0
// @description  Auto login, claim Free DOGE spins with hCaptcha handling, and auto spin when available.
// @author       Rubystance
// @license      MIT
// @match        https://dogeking.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544048/DogeKingio%20-%20Auto%20Login%20%2B%20Free%20DOGE%20Spin.user.js
// @updateURL https://update.greasyfork.org/scripts/544048/DogeKingio%20-%20Auto%20Login%20%2B%20Free%20DOGE%20Spin.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const USER_EMAIL = 'YOUR_EMAIL_HERE';
  const USER_PASSWORD = 'YOUR_PASSWORD_HERE';

  let loginButtonClicked = false;
  let loginSubmitted = false;
  let spinRunning = false;

  const waitFor = (selector, timeout = 60000) => new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) {
        clearInterval(interval);
        resolve(el);
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject('Timeout: ' + selector);
      }
    }, 500);
  });

  const waitForCaptcha = () => new Promise(resolve => {
    const interval = setInterval(() => {
      const captcha = document.querySelector('textarea[name="h-captcha-response"]');
      if (captcha && captcha.value.trim().length > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });

  const isLoggedIn = () => {
    return !!document.querySelector('.nav-link[onclick*="show_spin_modal"]');
  };

  const clickLoginButtonOnHome = () => {
    if (loginButtonClicked) return;
    const btnLogin = Array.from(document.querySelectorAll('a.btn')).find(btn => btn.textContent.trim().toLowerCase() === 'login');
    if (btnLogin) {
      btnLogin.click();
      loginButtonClicked = true;
      console.log('[Home] Login button clicked.');
    } else {
      console.log('[Home] Login button not found yet...');
    }
  };

  const fillLoginForm = async () => {
    const email = await waitFor('#user_email');
    const password = await waitFor('#password');
    email.value = USER_EMAIL;
    password.value = USER_PASSWORD;
    console.log('[Login] Credentials filled.');
  };

  const clickLoginSubmit = async () => {
    if (loginSubmitted) return;
    loginSubmitted = true;
    const loginBtn = await waitFor('#process_login');
    loginBtn.click();
    console.log('[Login] Login button clicked.');
  };

  const openFreeDOGE = async () => {
    const link = [...document.querySelectorAll('.nav-link')].find(el => el.textContent.includes('Free DOGE'));
    if (link) {
      link.click();
      console.log('[SPIN] Navigating to Free DOGE...');
    }
  };

  const autoSpin = async () => {
    if (spinRunning) return;
    spinRunning = true;

    while (true) {
      await waitForCaptcha();
      const spinBtn = document.querySelector('#spin_wheel');
      if (spinBtn && !spinBtn.disabled && spinBtn.innerText.includes('Free Spins')) {
        spinBtn.click();
        console.log('[SPIN] Spin performed!');
      } else {
        console.log('[SPIN] No spins available. Waiting 60s...');
      }
      await new Promise(r => setTimeout(r, 60000));
    }
  };

  const handleGamesPage = async () => {
    console.log('[Games] Detected /games.php page.');
    await new Promise(r => setTimeout(r, 2000));
    await openFreeDOGE();
    await autoSpin();
  };

  const main = async () => {
    const path = window.location.pathname;

    if (path === '/games.php') {
      await handleGamesPage();
      return;
    }

    const tryClickLogin = setInterval(() => {
      if (!loginButtonClicked && !document.querySelector('#user_email')) {
        clickLoginButtonOnHome();
      } else {
        clearInterval(tryClickLogin);
      }
    }, 1000);

    await waitFor('#user_email');
    await fillLoginForm();
    await waitForCaptcha();
    await clickLoginSubmit();

    const checkLogin = setInterval(async () => {
      if (isLoggedIn()) {
        clearInterval(checkLogin);
        console.log('[System] Logged in successfully!');
        await openFreeDOGE();
        await autoSpin();
      }
    }, 1000);
  };

  window.addEventListener('load', main);
})();
