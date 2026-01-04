// ==UserScript==
// @name          Clip Food Lion Coupons
// @include       https://foodlion.com/savings/coupons/browse*
// @description   Automatically clip all Food Lion coupons
// @version       1.0.1
// @namespace     hatchling379
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/504157/Clip%20Food%20Lion%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/504157/Clip%20Food%20Lion%20Coupons.meta.js
// ==/UserScript==

// Timing constants
const WAIT_INTERVAL = 1000;
const SHOW_MORE_INTERVAL = 500;
const CLICK_INTERVAL = 20;

// CSS selectors
const COUPONS_CONTAINER = 'panel-browse';
const SHOW_MORE_BUTTON = 'show-more';
const COUPON = '#panel-browse .item-tile';
const CLIP_BUTTON = '.item-tile button.border-dashed';

// Start the coupon clipping process
async function clipFoodLionCoupons() {
  await waitForPageToLoad();
  await showAllCoupons();
  await clipAllCoupons();
}

// Wait until the coupons container is loaded
async function waitForPageToLoad() {
  while (!document.getElementById(COUPONS_CONTAINER)) {
    await delay(WAIT_INTERVAL);
  }
}

// Load all coupons by clicking the "Show More" button until it's gone
async function showAllCoupons() {
  while (true) {
    const lastCoupon = document.querySelector(COUPON + ':last-of-type');
    lastCoupon.scrollIntoView({ block: 'center' });
    const showMore = document.getElementById(SHOW_MORE_BUTTON);
    if (!showMore) break;
    showMore.click();
    await delay(SHOW_MORE_INTERVAL);
  }
}

// Clip all coupons by clicking each coupon button
async function clipAllCoupons() {
  const clipButtons = document.querySelectorAll(CLIP_BUTTON);
  for (let i = clipButtons.length - 1; i >= 0; i--) {
    const clipButton = clipButtons[i];
    clipButton.closest(COUPON).scrollIntoView({ block: 'center' });
    clipButton.click();
    await delay(CLICK_INTERVAL);
  }
}

// Utility function to create a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Start the coupon clipping process
clipFoodLionCoupons();