// ==UserScript==
// @name         TORN: Prefill Max Buy Bazaar
// @namespace    http://torn.city.com.dot.com.com
// @version      1.0.3
// @description  Prefills the bazaar buy to the max possible
// @author       IronHydeDragon[2428902]
// @match        https://www.torn.com/bazaar.php*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483230/TORN%3A%20Prefill%20Max%20Buy%20Bazaar.user.js
// @updateURL https://update.greasyfork.org/scripts/483230/TORN%3A%20Prefill%20Max%20Buy%20Bazaar.meta.js
// ==/UserScript==

async function requireElement(
  selectors,
  conditionsCallback,
  queryElement = document
) {
  try {
    await new Promise((res, rej) => {
      const maxCycles = 500;
      let current = 1;
      const interval = setInterval(() => {
        if (queryElement.querySelector(selectors)) {
          if (!conditionsCallback) {
            clearInterval(interval);
            return res();
          }
          if (
            conditionsCallback &&
            conditionsCallback(queryElement.querySelector(selectors))
          ) {
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

function set_react_input(input, newval) {
  let old_value = input.value;
  input.value = newval;
  input._valueTracker.setValue(old_value);
  input.dispatchEvent(new Event('input', { bubbles: true, simulated: true }));
  input.select();
}

async function getMoneyOnHand() {
  await requireElement('#user-money');
  const onhand = +document.querySelector('#user-money').dataset.money;

  return onhand;
}

async function prefillMaxAmount(inputEl, price, qtyAvailable) {
  price = +price;
  qtyAvailable = +qtyAvailable;

  const onhand = await getMoneyOnHand();
  if (onhand === 0) {
    inputEl.value = 0;
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }

  if (onhand > 0) {
    const maxAmount = Math.floor(onhand / price);
    const newValue = qtyAvailable ? `${qtyAvailable}` : `${maxAmount}`;
    set_react_input(inputEl, newValue);
  }
}

async function bazaarObserver(mutationList, observer) {
  for (const mutation of mutationList) {
    // if (
    //   !mutation.target.classList.contains('progress-line-timer___uV1ZZ') &&
    //   !mutation.target.classList.contains('news-ticker-slide') &&
    //   !mutation.target.classList.contains('progress___z5tk3') &&
    //   mutation.target.id !== 'news-ticker-slider-wrapper'
    // ) {
    //   // console.log('👀', mutation); // TEST
    // }

    if (
      mutation.target.classList.contains('item___GYCYJ') &&
      mutation.addedNodes?.length > 0 &&
      mutation.addedNodes[0].classList.contains('buyMenu___PJqGH')
    ) {
      const amountInput = mutation.target.querySelector(
        '.buyAmountInput___CSV2n'
      );
      const price = mutation.target
        .querySelector('.price___q9kzH')
        .textContent.slice(1)
        .split(',')
        .join('');

      await requireElement('.amount___jF6kC', null, mutation.target);
      const qtyAvailable = mutation.target
        .querySelector('.amount___jF6kC')
        .textContent.match(/(\d.*\d|\d)/)[0]
        .split(',')
        .join('');

      prefillMaxAmount(amountInput, price, qtyAvailable);
      console.log(mutation); // TEST
    }
  }
}

function createBazaarObserver() {
  const observer = new MutationObserver(bazaarObserver);
  observer.observe(document, {
    attributes: false,
    childList: true,
    subtree: true,
  });
}

(async () => {
  console.log('🤑 Prefill max buy bazaar script is ON!'); // TEST
  createBazaarObserver();
  document.addEventListener('input', (e) => console.log(e)); // TEST)
})();
