// ==UserScript==
// @name        Foodora - Remove annoyances!
// @description Remove the annoying review modal and donate/download/pro banner on Foodora
// @version     1.8
// @grant       GM_addStyle
// @match       https://www.foodora.at/*
// @match       https://www.foodora.no/*
// @match       https://www.foodora.se/*
// @match       https://www.foodora.fi/*
// @match       https://www.foodora.hu/*
// @match       https://www.foodora.sk/*
// @match       https://www.foodora.cz/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=foodora.at
// @license     GPL v3
// @author      @incognico
// @namespace   https://greasyfork.org/users/931787
// @downloadURL https://update.greasyfork.org/scripts/481084/Foodora%20-%20Remove%20annoyances%21.user.js
// @updateURL https://update.greasyfork.org/scripts/481084/Foodora%20-%20Remove%20annoyances%21.meta.js
// ==/UserScript==

const MODAL_CHECK_DELAY = 250;

window.setTimeout(
  function check() {
    // remove certain annoying modals
    const reviewModal = document.querySelector('[data-testid="review-survey-optimised-modal"]');
    if (reviewModal) {
      document.querySelector('button[aria-label=close]')?.click();
    }
    const bjokerModal = document.querySelector('.joker-rdp-modal-content')
    if (bjokerModal) {
      bjokerModal.querySelector('.bds-c-modal__close-button')?.click();
    }
    const appDownloadReminder = document.querySelector('[data-testid="app-download-reminder__close-button"]');
    appDownloadReminder?.click();

    window.setTimeout(check, MODAL_CHECK_DELAY);
}, MODAL_CHECK_DELAY);

GM_addStyle('section:has(.donation-entry-block-initial) { display: none !important; }');
GM_addStyle('.partnership-ads { display: none !important; }');
GM_addStyle('div:has(> .cellphone-illustration) { display: none !important; }');
GM_addStyle('[data-testid="mobile-only-incentive-banner"] { display: none !important; }');