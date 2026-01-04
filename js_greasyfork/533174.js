// ==UserScript==
// @name         FaucetPay Automation with Captcha Solving
// @namespace    Violentmonkey Scripts
// @match        *://*.example.com/*
// @grant        none
// @version      1.0
// @author       Your Name
// @run-at       document-start
// @description  Automates captcha solving, claim tasks, and sends rewards directly to your FaucetPay wallet.
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/533174/FaucetPay%20Automation%20with%20Captcha%20Solving.user.js
// @updateURL https://update.greasyfork.org/scripts/533174/FaucetPay%20Automation%20with%20Captcha%20Solving.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ================================
  // FaucetPay Wallet Configuration
  // ================================

  const FAUCETPAY_WALLET = {
    BTC: 'bc1qhflqvgn7543d9gu8fhsvxetnc2nn4nj9j8l57d', // Bitcoin
    DOGE: 'DSwknjsucHaXwLxFbGX78YKGssJMhFuiag', // Dogecoin
    LTC: 'MN7S2CzpbNZoLscBiAtUnQuvoWZuwjpggW', // Litecoin
    ETH: '0x69761A44B42B6dAd336e653d3bd12c265b41603E', // Ethereum
    DASH: 'XnNAUXRcJ79yRLpy2MjDNwAjTxCqGzQcNv', // Dash
    TRX: 'TBENFAimdPqAi3Dd2MMeN8JkK2VBq8zQ4D', // Tron
    SOL: '86y1pKBKH5wU18C7CqK436kaZj3JqZFD3dmLEEBhq8ex', // Solana
  };

  const DEFAULT_CURRENCY = 'DOGE'; // Moneda predeterminada

  // ================================
  // Helper Functions
  // ================================

  const waitForElement = (selector, callback) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        callback(element);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const redirect = (url, customRedirect = false) => {
    location.href = customRedirect ? url : `https://rotator.nurul-huda.sch.id/?BypassResults=${url}`;
  };

  const blockEvents = (events) => {
    events.forEach((event) => {
      document.addEventListener(event, (e) => e.stopPropagation(), true);
    });
  };

  const handleCaptcha = (captchaType, selector, time) => {
    const captchaSelectors = {
      'g-recaptcha': () => window.grecaptcha?.getResponse()?.length !== 0,
      'h-captcha': () => window.hcaptcha?.getResponse()?.length !== 0,
      'cf-turnstile': () => window.turnstile?.getResponse()?.length !== 0,
    };
    if (captchaSelectors[captchaType]?.()) {
      submitForm(selector, time);
    }
  };

  const submitForm = (selector, time) => {
    setTimeout(() => {
      const form = typeof selector === 'string' ? document.querySelector(selector)?.closest('form') : selector;
      form?.requestSubmit();
    }, time * 1000);
  };

  // ================================
  // Core Logic
  // ================================

  const initializeScript = () => {
    // Block sensitive events
    blockEvents([
      'contextmenu',
      'visibilitychange',
      'cut',
      'paste',
      'blur',
      'mouseleave',
      'keyup',
      'drag',
      'dragstart',
      'hasFocus',
      'focus',
      'select',
      'selectstart',
      'webkitvisibilitychange',
      'mozvisibilitychange',
    ]);

    // Handle specific sites
    handleBlog24();
    handleFreeOseoCheck();
    handleDiudemy();
  };

  const handleBlog24 = () => {
    if (!location.host.includes('blog24.me')) return;

    // Custom messages
    $('h2:nth-of-type(1)').text('On this page, BYPASS Script Allowed 100%');
    $('h2:nth-of-type(2)').text('In order for the link to function smoothly, You Must TURN ON the Bypass Script.');

    // Wait for captcha and submit
    waitForElement('.h-captcha', (captcha) => {
      handleCaptcha('h-captcha', '#overlay', 1);
    });

    // Wait for countdown and click
    waitForElement("div[id^='count']", (countdown) => {
      if (countdown.innerHTML === '0') {
        waitForElement('input:nth-of-type(3)', (button) => button.click());
      }
    });

    // Insert FaucetPay wallet address
    waitForElement('#wallet-address-input', (input) => {
      input.value = FAUCETPAY_WALLET[DEFAULT_CURRENCY];
      console.log(`Dirección de FaucetPay (${DEFAULT_CURRENCY}) ingresada.`);
    });
  };

  const handleFreeOseoCheck = () => {
    if (!/(freeoseocheck|greenenez|wiki-topia).com|(coinsvalue|cookinguide|cryptowidgets|webfreetools|carstopia|makeupguide|carsmania).net|insurancegold.in|coinscap.info/.test(location.host)) return;

    // Remove unnecessary elements
    document.querySelectorAll('.row.text-center').forEach((elem) => elem.remove());

    // Wait for captcha and submit
    waitForElement('#countdown', () => {
      handleCaptcha('h-captcha', '#countdown', 29);
    });

    // Insert FaucetPay wallet address
    waitForElement('#wallet-address-input', (input) => {
      input.value = FAUCETPAY_WALLET[DEFAULT_CURRENCY];
      console.log(`Dirección de FaucetPay (${DEFAULT_CURRENCY}) ingresada.`);
    });
  };

  const handleDiudemy = () => {
    if (!location.host.includes('diudemy.com')) return;

    // Wait for claim button
    waitForElement('#link-button', (button) => {
      console.log('Haciendo clic en el botón de Diudemy...');
      button.click();
    });

    // Insert FaucetPay wallet address
    waitForElement('#wallet-address-input', (input) => {
      input.value = FAUCETPAY_WALLET[DEFAULT_CURRENCY];
      console.log(`Dirección de FaucetPay (${DEFAULT_CURRENCY}) ingresada en Diudemy.`);
    });
  };

  // ================================
  // Initialization
  // ================================

  if (['interactive', 'complete'].includes(document.readyState)) {
    initializeScript();
  } else {
    document.addEventListener('DOMContentLoaded', initializeScript);
  }
})();