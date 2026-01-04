// ==UserScript==
// @name          Hy-Vee - Auto Clip Coupons
// @version       1.5.1
// @description   Add a button to automatically clip all coupons on the Hy-Vee coupons page.
// @author        Journey Over
// @license       MIT
// @match         *://*.hy-vee.com/*
// @require       https://cdn.jsdelivr.net/gh/StylusThemes/Userscripts@0171b6b6f24caea737beafbc2a8dacd220b729d8/libs/utils/utils.min.js
// @grant         none
// @icon          https://www.google.com/s2/favicons?sz=64&domain=hy-vee.com
// @homepageURL   https://github.com/StylusThemes/Userscripts
// @namespace https://greasyfork.org/users/32214
// @downloadURL https://update.greasyfork.org/scripts/547225/Hy-Vee%20-%20Auto%20Clip%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/547225/Hy-Vee%20-%20Auto%20Clip%20Coupons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const logger = Logger('Hy-Vee - Auto Clip Coupons', { debug: false });

  const BUTTON_STYLES = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '1000',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
  };

  const CLICK_DELAY = 500; // Delay between clicks to avoid overwhelming the site and allow UI updates

  function createClippingButton() {
    const button = document.createElement('button');
    button.innerText = 'Clip All Coupons';
    button.id = 'clipCouponsButton';

    Object.assign(button.style, BUTTON_STYLES);

    document.body.appendChild(button);

    button.addEventListener('click', handleClipCoupons);
  }

  function handleClipCoupons() {
    const clipButtons = document.querySelectorAll('button[aria-label^="Clip coupon"]');

    if (clipButtons.length === 0) {
      alert('No coupons found to clip.');
      return;
    }

    const clipButton = document.getElementById('clipCouponsButton');
    const totalCoupons = clipButtons.length;

    logger(`Found ${totalCoupons} coupons. Clipping...`);

    // Click each coupon button sequentially with delay to avoid rate limiting
    for (let couponIndex = 0; couponIndex < clipButtons.length; couponIndex++) {
      const couponButton = clipButtons[couponIndex];
      setTimeout(() => {
        couponButton.click();
        updateButtonProgress(clipButton, totalCoupons, couponIndex);

        logger(`Clipped coupon ${couponIndex + 1}/${totalCoupons}`);

        if (couponIndex === totalCoupons - 1) {
          finalizeButtonState(clipButton);
        }
      }, couponIndex * CLICK_DELAY);
    }
  }

  function updateButtonProgress(button, totalCoupons, currentIndex) {
    const remainingCoupons = totalCoupons - (currentIndex + 1);
    button.innerText = `Clipping Coupons... ${remainingCoupons} left`;
  }

  function finalizeButtonState(button) {
    button.innerText = 'All Coupons Clipped!';
    button.style.backgroundColor = '#6c757d';
    button.style.cursor = 'default';
    button.disabled = true;
  }

  function initializeScript() {
    checkPage();
  }

  function checkPage() {
    if (window.location.href === 'https://www.hy-vee.com/deals/coupons?offerState=Available' && !document.getElementById('clipCouponsButton')) {
      createClippingButton();
      logger('Clipping button added to the page.');
    }
  }

  window.addEventListener('load', initializeScript);

  // Poll for URL changes to detect SPA navigation
  setInterval(checkPage, 500);
})();
