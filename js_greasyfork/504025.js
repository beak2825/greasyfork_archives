// ==UserScript==
// @name          Clip CVS Coupons
// @include       https://www.cvs.com/extracare/home*
// @description   Automatically send all CVS deals to card
// @version       2.1.0
// @namespace     hatchling379
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504025/Clip%20CVS%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/504025/Clip%20CVS%20Coupons.meta.js
// ==/UserScript==

// Timing constants
const WAIT_INTERVAL = 1000;
const SCROLL_INTERVAL = 100;
const CLICK_INTERVAL = 20;

// CSS Selectors
const COUPONS_CONTAINER = '.ps-tab';
const TAB_ALL = '.ps-tab[label="All"]';
const TAB_ON_CARD = '.ps-tab[label="On card"]';
const SORT_BUTTON = '#openSortButton';
const COUPON = '[data-testid="coupon"]';
const SEND_TO_CARD = 'send-to-card-action > button';

// Main script function
async function clipCVSCoupons() {
  await waitForPageLoad();
  await scrollToShowCoupons();
  await sendAllCouponsToCard();
}

// Wait for the coupons container to appear
async function waitForPageLoad() {
  while (!document.querySelector(COUPONS_CONTAINER)) {
    await delay(WAIT_INTERVAL);
  }
}

// Scroll to load all coupons
async function scrollToShowCoupons() {
  const couponCountAll = parseInt(document.querySelector(TAB_ALL + ' ' + SORT_BUTTON).nextElementSibling.textContent);
  const couponCountOnCard = parseInt(document.querySelector(TAB_ON_CARD + ' ' + SORT_BUTTON).nextElementSibling.textContent);
  const couponCount = couponCountAll - couponCountOnCard;
  while (document.querySelectorAll(SEND_TO_CARD).length < couponCount) {
    const coupons = document.querySelectorAll(TAB_ALL + ' ' + COUPON);
    const lastCoupon = coupons[coupons.length - 1];
    lastCoupon.scrollIntoView({ block: 'center' });
    await delay(SCROLL_INTERVAL);
  }
}

// Click each "Send to card" button
async function sendAllCouponsToCard() {
  const sendButtons = document.querySelectorAll(SEND_TO_CARD);
  for (let i = sendButtons.length - 1; i >= 0; i--) {
    const sendButton = sendButtons[i];
    sendButton.click();
    if (i > 0) {
      sendButtons[i - 1].closest(COUPON).scrollIntoView({ block: 'center' });
    }
    await delay(CLICK_INTERVAL);
  }
}

// Delay utility function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the coupon clipping process
clipCVSCoupons();
