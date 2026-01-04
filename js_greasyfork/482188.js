// ==UserScript==
// @name         TORN: Quick Company Vault
// @namespace    http://torn.city.com.dot.com.com
// @version      1.0.3
// @description  Autofills your vault input with money on hand and puts focus on input for quick deposit. Updates when money on hand updates.
// @author       IronHydeDragon[2428902]
// @match        https://www.torn.com/companies.php*
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/482188/TORN%3A%20Quick%20Company%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/482188/TORN%3A%20Quick%20Company%20Vault.meta.js
// ==/UserScript==

//////// USER VARIABLES ////////

const roundDownToNearest = 10000000;

////////////////////////////////

function roundDown(value) {
  value = +value;

  const floor = Math.floor(value / roundDownToNearest);
  const roundedValue = floor * roundDownToNearest;

  return roundedValue;
}

async function requireElement(selectors, conditionsCallback) {
  try {
    await new Promise((res, rej) => {
      maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (document.querySelector(selectors)) {
          if (conditionsCallback === undefined) {
            clearInterval(interval);
            return res();
          }
          if (conditionsCallback(document.querySelector(selectors))) {
            clearInterval(interval);
            return res();
          }
        }
        if (current === maxCycles) {
          clearInterval(interval);
          rej('Timeout: Could not find element on page');
        }
        current++;
      }, 10);
    });
  } catch (err) {
    console.error(err);
  }
}

function isVaultHash() {
  isVaultHash =
    window.location.hash === '#/option=funds' || '#/p=options&tab=vault';

  return isVaultHash;
}

function urlListener() {
  window.addEventListener('popstate', function (event) {
    console.log('popstate'); // TEST
    const hash = event.target.location.hash;
    if (isVaultHash()) {
      autofillDepositInput();
    }
  });
}

function onhandChangeCallback() {
  autofillDepositInput();
}

function onhandObserver() {
  const observer = new MutationObserver(onhandChangeCallback);
  observer.observe(document.querySelector('#user-money'), {
    childList: false,
    subtree: false,
    attributes: true,
  });
}

async function getMoneyOnHand() {
  await requireElement('#user-money');
  const onhand = document.querySelector('#user-money').dataset.money;

  return onhand;
}

async function autofillDepositInput() {
  const onhand = await getMoneyOnHand();

  await requireElement('.funds-wrap.deposit .input-money');
  const depositInput = document.querySelector(
    '.funds-wrap.deposit .input-money'
  );

  depositInput.value = roundDown(onhand);
  depositInput.dispatchEvent(new Event('input', { bubbles: true }));
}

function visibilityListener() {
  document.addEventListener('visibilitychange', () => {
    autofillDepositInput();
  });
}

// function keepAliveInterval(seconds) {
//   const interval = setInterval(() => {
//     document.dispatchEvent(new Event('visibilitychange', { bubbles: true }));
//   }, 1000 * seconds || 30000);

//   document.addEventListener('visibilitychange', (e) => {
//     if (e.target.visibil) console.log('visChange', e); // TEST
//   });
// }

(() => {
  try {
    console.log('🏦 Quick Company Vault script is ON!'); // TEST
    if (!isVaultHash()) return;

    autofillDepositInput();
    urlListener();

    onhandObserver();
    visibilityListener();
    // keepAliveInterval(30);
  } catch (error) {
    console.error(error);
  }
})();
